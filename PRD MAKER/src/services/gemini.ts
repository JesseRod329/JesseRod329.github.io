// Gemini API Service
import { GeminiAPIResponse, GeminiOptions } from '../types/prd';

// Try the latest model first, fallback to older model if needed
const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro', 
  'gemini-pro'
];

const getGeminiAPIUrl = (model: string) => 
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

export class GeminiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate content using Gemini API with fallback models
   */
  async generateContent(
    prompt: string, 
    options: GeminiOptions = {}
  ): Promise<string> {
    const defaultOptions = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    };

    const config = { ...defaultOptions, ...options };

    // Try each model until one works
    for (const model of GEMINI_MODELS) {
      try {
        const response = await fetch(getGeminiAPIUrl(model), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey,
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: config
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`Model ${model} failed:`, {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          
          // If it's a 404, try the next model
          if (response.status === 404) {
            continue;
          }
          
          // For other errors, throw immediately
          if (response.status === 403) {
            throw new Error('Gemini API access denied. Please check your API key and permissions.');
          } else if (response.status === 400) {
            throw new Error('Invalid request to Gemini API. Please check your prompt and configuration.');
          } else {
            throw new Error(`Gemini API error: ${response.status} ${response.statusText}. Details: ${errorText}`);
          }
        }

        const data: GeminiAPIResponse = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
          throw new Error('Invalid response format from Gemini API');
        }

        console.log(`Successfully used model: ${model}`);
        return data.candidates[0].content.parts[0].text;
      } catch (error) {
        console.warn(`Model ${model} failed:`, error);
        // If this is the last model, throw the error
        if (model === GEMINI_MODELS[GEMINI_MODELS.length - 1]) {
          throw error;
        }
        // Otherwise, continue to next model
        continue;
      }
    }

    // This should never be reached, but just in case
    throw new Error('All Gemini models failed. Please check your API key and try again.');
  }

  /**
   * Generate PRD with streaming effect
   */
  async generatePRD(
    prompt: string, 
    onChunk: (chunk: string) => void,
    options?: GeminiOptions
  ): Promise<void> {
    const fullResponse = await this.generateContent(prompt, options);
    
    // Simulate streaming effect for better UX
    const words = fullResponse.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += words[i] + ' ';
      onChunk(currentText.trim());
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  }
}

/**
 * Create Gemini service instance
 */
export const createGeminiService = (apiKey: string): GeminiService => {
  return new GeminiService(apiKey);
};
