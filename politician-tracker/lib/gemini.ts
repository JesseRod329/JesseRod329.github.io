import { GoogleGenAI, Schema, Type } from "@google/genai";
import { prisma } from "./prisma";

export interface StateAnalysis {
  stateName: string;
  summary: string;
  topSectors: string[];
  tradingActivityLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  keyInsight: string;
}

const createClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'dummy_key' });
};

export const analyzeStateData = async (
  stateName: string,
  stateCode: string,
  politicians: any[],
  topTickers: any[]
): Promise<StateAnalysis> => {
  const monthKey = new Date().toISOString().slice(0, 7); // YYYY-MM

  // 1) Try cache first
  try {
    const cached = await prisma.stateAnalysisCache.findUnique({
      where: {
        stateCode_yearMonth: {
          stateCode,
          yearMonth: monthKey
        }
      }
    });
    if (cached?.analysis) {
      const parsed = JSON.parse(cached.analysis) as StateAnalysis;
      return parsed;
    }
  } catch (err) {
    console.error("Failed to read state analysis cache:", err);
  }

  const ai = createClient();

  const prompt = `
    Analyze the following stock trading data for politicians from ${stateName}.
    
    Politicians: ${politicians.map(p => `${p.fullName} (${p.party})`).join(', ')}
    Top Traded Tickers: ${topTickers.map(t => t.ticker).join(', ')}
    
    Provide a brief, professional financial insight summary about the trading activity in this state.
    - Summary: 2-3 sentences on the overall trading behavior.
    - Top Sectors: Infer sectors based on tickers (e.g. Tech, Energy).
    - Trading Activity Level: Low, Moderate, High, or Extreme based on the number of politicians and tickers.
    - Key Insight: One specific observation (e.g., "Heavy investment in defense stocks").
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      stateName: { type: Type.STRING },
      summary: { type: Type.STRING },
      topSectors: { 
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      tradingActivityLevel: { type: Type.STRING, enum: ['LOW', 'MODERATE', 'HIGH', 'EXTREME'] },
      keyInsight: { type: Type.STRING }
    },
    required: ['stateName', 'summary', 'topSectors', 'tradingActivityLevel', 'keyInsight']
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        systemInstruction: "You are a financial analyst tracking US politician stock trades. Be concise, objective, and data-driven."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const analysis = JSON.parse(text) as StateAnalysis;

    // 2) Write to cache (best-effort)
    try {
      await prisma.stateAnalysisCache.upsert({
        where: {
          stateCode_yearMonth: {
            stateCode,
            yearMonth: monthKey
          }
        },
        create: {
          stateCode,
          yearMonth: monthKey,
          analysis: JSON.stringify(analysis)
        },
        update: {
          analysis: JSON.stringify(analysis)
        }
      });
    } catch (cacheErr) {
      console.error("Failed to write state analysis cache:", cacheErr);
    }

    return analysis;
  } catch (error) {
    console.error("State analysis failed:", error);
    const fallback: StateAnalysis = {
      stateName,
      summary: "Data analysis unavailable at this time.",
      topSectors: ["Unknown"],
      tradingActivityLevel: "LOW",
      keyInsight: "System offline."
    };

    // Best-effort cache of fallback so we don't keep retrying on every click
    try {
      await prisma.stateAnalysisCache.upsert({
        where: {
          stateCode_yearMonth: {
            stateCode,
            yearMonth: monthKey
          }
        },
        create: {
          stateCode,
          yearMonth: monthKey,
          analysis: JSON.stringify(fallback)
        },
        update: {
          analysis: JSON.stringify(fallback)
        }
      });
    } catch (cacheErr) {
      console.error("Failed to cache fallback state analysis:", cacheErr);
    }

    return fallback;
  }
};



