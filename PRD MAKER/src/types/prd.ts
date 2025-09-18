// PRD Creator Type Definitions

export interface PRDFormData {
  question1: string;
  question2: string;
  question3: string;
}

export interface SampleExample {
  name: string;
  icon: string;
  data: PRDFormData;
}

export interface GeminiAPIResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface GeminiOptions {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
}

export interface UseGeminiAPIReturn {
  generatePRD: (prompt: string, options?: GeminiOptions) => Promise<void>;
  loading: boolean;
  error: string | null;
  generatedContent: string;
}

export interface LocaleConfig {
  language: string;
  direction: 'ltr' | 'rtl';
}

export interface TranslationKeys {
  pageTitle: string;
  pageSubtitle: string;
  threeQuestions: string;
  tryExample: string;
  question1Label: string;
  question1Placeholder: string;
  question2Label: string;
  question2Placeholder: string;
  question3Label: string;
  question3Placeholder: string;
  generateButton: string;
  generatingButton: string;
  copyTooltip: string;
  downloadTooltip: string;
  emptyStateText: string;
  errorMessage: string;
  teamDashboard: string;
  shoppingApp: string;
  fitnessTracker: string;
}

export interface Translations {
  [locale: string]: TranslationKeys;
}
