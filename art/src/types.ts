export type ToolType = 'spray' | 'brush' | 'eraser' | 'fill' | 'stencil' | 'pattern';

export interface Color {
  hex: string;
  name: string;
  metallic: boolean;
}

export interface Environment {
  id: string;
  name: string;
  background: string;
  atmosphere: 'urban' | 'industrial' | 'futuristic' | 'rustic';
  lighting: 'warm' | 'cool' | 'blue';
}

export interface ParticleConfig {
  count: number;
  size: { min: number; max: number };
  velocity: { min: number; max: number };
  lifetime: { min: number; max: number };
  gravity: number;
  wind: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  lifetime: number;
  maxLifetime: number;
  gravity: number;
  wind: number;
}

export interface SoundManagerRef {
  playSound: (sound: string) => void;
  setVolume: (volume: number) => void;
}

export interface GraffitiCanvasRef {
  clear: () => void;
  save: () => string;
  load: (data: string) => void;
  undo: () => void;
  redo: () => void;
}

export interface Stencil {
  id: string;
  name: string;
  path: string;
  preview: string;
}

export interface Pattern {
  id: string;
  name: string;
  data: string;
  preview: string;
}
