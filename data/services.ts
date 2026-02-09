import { Service } from '../types';

export const services: Service[] = [
  {
    id: 'ai-agents',
    title: 'AI Agent Ecosystems',
    description: 'Deploying autonomous agents that handle complex workflows 24/7. From customer support to automated research and trading bots.',
    icon: 'brain'
  },
  {
    id: 'fine-tuning',
    title: 'Domain-Specific Fine-Tuning',
    description: 'Training open-source LLMs (Llama, Mistral) on your proprietary data to create specialized models that understand your business niche.',
    icon: 'cpu'
  },
  {
    id: 'dashboards',
    title: 'Business Intelligence Dashboards',
    description: 'Turning raw AI outputs into actionable insights. Real-time React dashboards with WebSocket streaming and custom Recharts visualizations.',
    icon: 'layout'
  },
  {
    id: 'integration',
    title: 'Architecture Integration',
    description: 'The "Bridge": Connecting your new AI assistants to legacy infrastructure via custom Node.js/Python REST APIs and secure vector pipelines.',
    icon: 'network'
  }
];
