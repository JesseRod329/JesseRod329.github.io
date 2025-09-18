// Internationalization hook
import { useMemo } from 'react';
import { Translations, TranslationKeys } from '../types/prd';

const TRANSLATIONS: Translations = {
  "en-US": {
    "pageTitle": "One-pager PRD",
    "pageSubtitle": "Turn your vague thoughts into a clear and concise one-pager",
    "threeQuestions": "3 questions",
    "tryExample": "Try:",
    "question1Label": "1. What product or feature are you building?",
    "question1Placeholder": "e.g., A real-time collaboration dashboard for remote teams...",
    "question2Label": "2. Who are the target users and what problem does this solve?",
    "question2Placeholder": "e.g., Remote team managers who struggle with visibility into project progress...",
    "question3Label": "3. What are the key features and how will you measure success?",
    "question3Placeholder": "e.g., Live status updates, team activity feed... Success measured by 40% reduction in status meeting time...",
    "generateButton": "Generate PRD",
    "generatingButton": "Generating PRD...",
    "copyTooltip": "Copy to clipboard",
    "downloadTooltip": "Download as markdown",
    "emptyStateText": "Your PRD will appear here after answering the questions",
    "errorMessage": "Failed to generate PRD. Please try again.",
    "teamDashboard": "Team Dashboard",
    "shoppingApp": "Shopping App",
    "fitnessTracker": "Fitness Tracker"
  },
  "es-ES": {
    "pageTitle": "PRD de una página",
    "pageSubtitle": "Convierte tus ideas vagas en un documento claro y conciso de una página",
    "threeQuestions": "3 preguntas",
    "tryExample": "Prueba:",
    "question1Label": "1. ¿Qué producto o característica estás construyendo?",
    "question1Placeholder": "ej., Un panel de colaboración en tiempo real para equipos remotos...",
    "question2Label": "2. ¿Quiénes son los usuarios objetivo y qué problema resuelve esto?",
    "question2Placeholder": "ej., Gerentes de equipos remotos que luchan con la visibilidad del progreso del proyecto...",
    "question3Label": "3. ¿Cuáles son las características clave y cómo medirás el éxito?",
    "question3Placeholder": "ej., Actualizaciones de estado en vivo, feed de actividad del equipo... Éxito medido por 40% de reducción en tiempo de reuniones de estado...",
    "generateButton": "Generar PRD",
    "generatingButton": "Generando PRD...",
    "copyTooltip": "Copiar al portapapeles",
    "downloadTooltip": "Descargar como markdown",
    "emptyStateText": "Tu PRD aparecerá aquí después de responder las preguntas",
    "errorMessage": "Error al generar PRD. Por favor, inténtalo de nuevo.",
    "teamDashboard": "Panel de Equipo",
    "shoppingApp": "App de Compras",
    "fitnessTracker": "Rastreador de Fitness"
  }
};

/**
 * Find matching locale from available translations
 */
const findMatchingLocale = (locale: string): string => {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'en-US';
};

/**
 * Custom hook for internationalization
 * Automatically detects browser language and provides translations
 */
export const useI18n = (appLocale?: string) => {
  const locale = useMemo(() => {
    if (appLocale && appLocale !== '{{APP_LOCALE}}') {
      return findMatchingLocale(appLocale);
    }
    
    const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
    return findMatchingLocale(browserLocale);
  }, [appLocale]);

  const t = useMemo(() => {
    return (key: keyof TranslationKeys): string => {
      return TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;
    };
  }, [locale]);

  return { t, locale };
};
