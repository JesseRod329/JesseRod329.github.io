import { GoogleGenAI } from "@google/genai";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'dummy_key' });
};

export const chatWithSystem = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    const ai = createClient();
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a helpful country data assistant. You provide factual information about countries including GDP, trade, population, and economic statistics. Keep responses concise, informative, and formatted like a terminal output. Be helpful and educational."
            },
            history: history
        });

        const result = await chat.sendMessage({ message });
        return result.text || "System Error.";
    } catch (e) {
        console.error(e);
        return "Connection error. Please try again.";
    }
}
