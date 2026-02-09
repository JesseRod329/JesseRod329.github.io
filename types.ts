export type ProjectCategory = 'system' | 'interface' | 'creative';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link?: string;
  github?: string;
  category: ProjectCategory;
  featured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: 'brain' | 'cpu' | 'layout' | 'network';
}

export interface StackItem {
  name: string;
  logo: string;
  category: 'ai' | 'dev' | 'apple';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DashboardDataPoint {
  name: string;
  agentsActive: number;
  tokensProcessed: number;
  costSavings: number;
}