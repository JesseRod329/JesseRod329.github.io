import { useState, useCallback, useEffect } from 'react';

export interface GameState {
  isLoading: boolean;
  currentLevel: number;
  gameScore: number;
  lives: number;
  pelletsCollected: number;
  totalPellets: number;
  timeElapsed: number;
  isPaused: boolean;
  gameStarted: boolean;
  gameOver: boolean;
}

export interface GameActions {
  setLoading: (loading: boolean) => void;
  updateScore: (score: number) => void;
  collectPellet: (type: string) => void;
  loseLife: () => void;
  advanceLevel: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  updateTime: (time: number) => void;
}

export const useGameState = (): [GameState, GameActions] => {
  const [gameState, setGameState] = useState<GameState>({
    isLoading: true,
    currentLevel: 1,
    gameScore: 0,
    lives: 3,
    pelletsCollected: 0,
    totalPellets: 0,
    timeElapsed: 0,
    isPaused: false,
    gameStarted: false,
    gameOver: false
  });

  // Calculate total pellets for current level
  useEffect(() => {
    const platformCount = Math.min(3 + gameState.currentLevel * 2, 12);
    const pelletsPerPlatform = 3 + Math.floor(Math.random() * 3);
    const totalPellets = platformCount * pelletsPerPlatform;
    
    setGameState(prev => ({
      ...prev,
      totalPellets
    }));
  }, [gameState.currentLevel]);

  // Game timer
  useEffect(() => {
    if (!gameState.gameStarted || gameState.isPaused || gameState.gameOver) return;
    
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 1
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameState.gameStarted, gameState.isPaused, gameState.gameOver]);

  // Game actions
  const setLoading = useCallback((loading: boolean) => {
    setGameState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const updateScore = useCallback((score: number) => {
    setGameState(prev => ({ ...prev, gameScore: score }));
  }, []);

  const collectPellet = useCallback((type: string) => {
    setGameState(prev => {
      const newCount = prev.pelletsCollected + 1;
      let newState = { ...prev, pelletsCollected: newCount };
      
      // Check level completion
      if (newCount >= prev.totalPellets) {
        setTimeout(() => {
          setGameState(currentState => ({
            ...currentState,
            currentLevel: currentState.currentLevel + 1,
            pelletsCollected: 0,
            timeElapsed: 0
          }));
        }, 1000);
      }
      
      return newState;
    });
  }, []);

  const loseLife = useCallback(() => {
    setGameState(prev => {
      const newLives = Math.max(0, prev.lives - 1);
      let newState = { ...prev, lives: newLives };
      
      // Check game over
      if (newLives <= 0) {
        newState.gameOver = true;
        newState.isPaused = true;
      }
      
      return newState;
    });
  }, []);

  const advanceLevel = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      pelletsCollected: 0,
      timeElapsed: 0
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({ 
      ...prev, 
      gameStarted: true, 
      isLoading: false 
    }));
  }, []);

  const endGame = useCallback(() => {
    setGameState(prev => ({ 
      ...prev, 
      gameOver: true, 
      isPaused: true 
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      isLoading: false,
      currentLevel: 1,
      gameScore: 0,
      lives: 3,
      pelletsCollected: 0,
      totalPellets: 0,
      timeElapsed: 0,
      isPaused: false,
      gameStarted: true,
      gameOver: false
    });
  }, []);

  const updateTime = useCallback((time: number) => {
    setGameState(prev => ({ ...prev, timeElapsed: time }));
  }, []);

  const actions: GameActions = {
    setLoading,
    updateScore,
    collectPellet,
    loseLife,
    advanceLevel,
    pauseGame,
    resumeGame,
    startGame,
    endGame,
    resetGame,
    updateTime
  };

  return [gameState, actions];
};




