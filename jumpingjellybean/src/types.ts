export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface HighScore {
  id: string;
  userId: string;
  username: string;
  score: number;
  level: number;
  powerUpsUsed: number;
  date: Date;
}

export interface PowerUp {
  id: string;
  type: 'doubleJump' | 'airTime' | 'speedBoost' | 'shield';
  x: number;
  y: number;
  collected: boolean;
  duration: number;
}

export interface GameState {
  score: number;
  level: number;
  lives: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  currentUser: User | null;
  powerUps: PowerUp[];
  activePowerUps: Set<string>;
  doubleJumpAvailable: boolean;
  airTimeRemaining: number;
}

export interface JellyBean {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  onGround: boolean;
  canDoubleJump: boolean;
  color: string;
}