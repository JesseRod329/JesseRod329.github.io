// Custom hook for Gemini API integration
import { useState, useCallback } from 'react';
import { createGeminiService } from '../services/gemini';
import { UseGeminiAPIReturn, GeminiOptions } from '../types/prd';

/**
 * Custom hook for Gemini API integration
 * Handles API calls, loading states, and error management
 * Automatically gets API key from environment variables
 */
export const useGeminiAPI = (): UseGeminiAPIReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');

  const generatePRD = useCallback(async (prompt: string, options?: GeminiOptions) => {
    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      setError('Gemini API key not configured. Please check your environment variables.');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedContent('');

    try {
      const geminiService = createGeminiService(apiKey);
      
      await geminiService.generatePRD(
        prompt,
        (chunk: string) => setGeneratedContent(chunk),
        options
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PRD';
      setError(errorMessage);
      console.error('Error generating PRD:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    generatePRD,
    loading,
    error,
    generatedContent,
  };
};
