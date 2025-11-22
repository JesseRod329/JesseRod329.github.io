import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CyberpunkAnalysis } from '../types';

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'dummy_key' });
};

export const analyzeLocation = async (locationName: string): Promise<CyberpunkAnalysis> => {
  const ai = createClient();

  const prompt = `
    You are a futuristic planetary surveillance AI system in the year 2077. 
    Analyze the geopolitical and technological state of "${locationName}".
    
    Create a fictional, cyberpunk-themed analysis. 
    - Threat Level should be based on stability/crime (Low to Extreme).
    - Tech Index is 0-100 representing cybernetic adoption.
    - Faction Control is a fictional corporation or gang running the area.
    - Description should be atmospheric, mentioning neon lights, megastructures, or wasteland conditions.
    - Notable Exports should be futuristic items (e.g., "Neural Chips", "Synthetic Water", "Hacked Drones").
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      location: { type: Type.STRING },
      threatLevel: { type: Type.STRING, enum: ['LOW', 'MODERATE', 'CRITICAL', 'EXTREME'] },
      techIndex: { type: Type.NUMBER },
      factionControl: { type: Type.STRING },
      description: { type: Type.STRING },
      notableExports: { 
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ['location', 'threatLevel', 'techIndex', 'factionControl', 'description', 'notableExports']
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        systemInstruction: "You are Nexus-7, a cold, precise global monitoring AI."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as CyberpunkAnalysis;
  } catch (error) {
    console.error("Analysis failed:", error);
    return {
      location: locationName,
      threatLevel: 'CRITICAL',
      techIndex: 0,
      factionControl: 'UNKNOWN_ERROR',
      description: 'Data stream corrupted. Local sector offline. Manual override required.',
      notableExports: ['Glitch Data']
    };
  }
};

export const chatWithSystem = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    const ai = createClient();
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are the Operating System of a futuristic global surveillance network. Your name is Nexus. Speak in a robotic, slightly ominous, but helpful tone. Keep responses concise and formatted like a terminal output."
            },
            history: history
        });

        const result = await chat.sendMessage({ message });
        return result.text || "System Error.";
    } catch (e) {
        console.error(e);
        return "Connection to mainframe severed.";
    }
}
