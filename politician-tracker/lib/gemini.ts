import { GoogleGenAI, Schema, Type } from "@google/genai";

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

export const analyzeStateData = async (stateName: string, politicians: any[], topTickers: any[]): Promise<StateAnalysis> => {
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
    
    return JSON.parse(text) as StateAnalysis;
  } catch (error) {
    console.error("State analysis failed:", error);
    return {
      stateName,
      summary: "Data analysis unavailable at this time.",
      topSectors: ["Unknown"],
      tradingActivityLevel: "LOW",
      keyInsight: "System offline."
    };
  }
};


