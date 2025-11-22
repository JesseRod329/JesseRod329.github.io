export interface LocationData {
  name: string;
  lat: number;
  lng: number;
  iso_a2?: string;
  iso_a3?: string;
}

export interface CyberpunkAnalysis {
  location: string;
  threatLevel: 'LOW' | 'MODERATE' | 'CRITICAL' | 'EXTREME';
  techIndex: number; // 0-100
  factionControl: string;
  description: string;
  notableExports: string[];
}

export enum SystemStatus {
  IDLE = 'SYSTEM IDLE',
  SCANNING = 'SCANNING SECTOR...',
  ANALYZING = 'PROCESSING DATA...',
  LOCKED = 'TARGET ACQUIRED',
  ERROR = 'CONNECTION LOST'
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'SYSTEM';
  text: string;
  timestamp: number;
}