// Sample examples for PRD Creator
import { SampleExample, TranslationKeys } from '../types/prd';

/**
 * Create sample examples based on translations
 */
export const createSampleExamples = (t: (key: keyof TranslationKeys) => string): SampleExample[] => [
  {
    name: t('teamDashboard'),
    icon: '📊',
    data: {
      question1: 'A real-time team collaboration dashboard that shows current work status, upcoming deadlines, and team availability',
      question2: 'Remote team leads and project managers who struggle with visibility into who\'s working on what and when projects will be completed',
      question3: 'Live status updates, team availability calendar, automated task assignments, and drag-and-drop timeline view. Success measured by 30% reduction in status meetings and 25% faster project delivery times'
    }
  },
  {
    name: t('shoppingApp'),
    icon: '🛍️',
    data: {
      question1: 'A mobile shopping app with AI-powered personalized recommendations and instant checkout',
      question2: 'Busy professionals aged 25-45 who want to shop efficiently and discover products tailored to their style without spending hours browsing',
      question3: 'AI style recommendations, one-tap checkout, size prediction, AR try-on feature, price tracking, and wishlist sharing. Success measured by 40% increase in average order value and 60% reduction in cart abandonment'
    }
  },
  {
    name: t('fitnessTracker'),
    icon: '💪',
    data: {
      question1: 'A fitness tracking app that combines workout planning, nutrition logging, and social motivation features',
      question2: 'Fitness enthusiasts and beginners who want an all-in-one solution to plan workouts, track progress, and stay motivated through community support',
      question3: 'Custom workout builder, meal tracking with barcode scanning, progress photos, community challenges, and coaching tips. Success measured by 70% user retention after 3 months and 45% improvement in workout consistency'
    }
  }
];
