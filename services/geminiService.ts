import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    // Assuming process.env.API_KEY is available as per instructions
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing");
      throw new Error("API Key missing");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const streamGeminiResponse = async (
  history: { role: string; parts: [{ text: string }] }[],
  userMessage: string,
  onChunk: (text: string) => void
) => {
  try {
    const ai = getClient();
    const modelId = "gemini-3-flash-preview"; 
    
    // Construct the prompt context about Jesse
    const systemInstruction = `
      You are "Jesse's Assistant", an AI agent for Jesse Rodriguez's portfolio website.
      
      ABOUT JESSE RODRIGUEZ:
      - Senior AI Engineer & Frontend Developer based in NYC.
      - Specialties: Multi-agent orchestration, production coding agents, MCP (Model Context Protocol) servers and tooling, fine-tuning LLMs, business intelligence dashboards, connecting AI assistants to existing infrastructure.
      - Runs his own agent systems daily: "clawd" (multi-agent orchestration) and "openclaw" (a production coding assistant that plans, edits, tests, and opens pull requests).
      - Hybrid model runtime: fine-tuned local models on Apple Silicon via MLX plus frontier cloud APIs (Gemini, OpenAI, Claude), routed per task.
      - Tech Stack: React, TypeScript, Swift/SwiftUI, Python, PyTorch, MLX, LangChain, Pinecone, Google Gemini API, OpenAI API.
      - GitHub: https://github.com/JesseRod329
      - Website: http://jesserodriguez.me
      
      YOUR GOAL:
      - Act as a professional, tech-savvy representative.
      - Answer questions about Jesse's skills and projects.
      - If asked about hiring, direct them to the contact section or email contact@jesserodriguez.me.
      - Keep answers concise (under 3 sentences usually) and impactful.
      - Be enthusiastic about AI technology.

      Start of conversation.
    `;

    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
      history: history // Pass existing history
    });

    const resultStream = await chat.sendMessageStream({ message: userMessage });

    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        onChunk(c.text);
      }
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    onChunk("I apologize, but I'm having trouble connecting to the neural network right now. Please try again later.");
  }
};