import React, { useState, useEffect } from 'react';
import { Pause, Play, Trophy, Star, Sparkles } from 'lucide-react';
import GameCanvas from './components/GameCanvas';
import { GameState } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    lives: 3,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    currentUser: null,
    powerUps: [],
    activePowerUps: new Set(),
    doubleJumpAvailable: false,
    airTimeRemaining: 0
  });

  const [highScore, setHighScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);

  const handleGameStateChange = (newState: Partial<GameState>) => {
    setGameState(prev => {
      const updated = { ...prev, ...newState };
      
      // Update high score
      if (updated.isGameOver && updated.score > highScore) {
        setHighScore(updated.score);
      }
      
      return updated;
    });
  };

  const handleScoreUpdate = (newScore: number) => {
    const scoreDiff = newScore - gameState.score;
    if (scoreDiff > 0) {
      setCombo(c => c + 1);
    }
    handleGameStateChange({ score: newScore });
  };

  const startGame = () => {
    handleGameStateChange({
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      score: 0,
      level: 1,
      lives: 3
    });
    setCombo(0);
  };

  const resetGame = () => {
    handleGameStateChange({
      score: 0,
      level: 1,
      lives: 3,
      isPlaying: true,
      isPaused: false,
      isGameOver: false
    });
    setCombo(0);
  };

  const togglePause = () => {
    if (gameState.isPlaying && !gameState.isGameOver) {
      handleGameStateChange({ isPaused: !gameState.isPaused });
    }
  };

  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('jellybean-highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    // Save high score to localStorage
    if (highScore > 0) {
      localStorage.setItem('jellybean-highscore', highScore.toString());
    }
  }, [highScore]);

  // Auto-start game on mount
  useEffect(() => {
    startGame();
  }, []);

  return (
    <div className="game-wrapper">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: fixed;
          touch-action: none;
          -webkit-overflow-scrolling: touch;
        }
        
        body {
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        #root {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @media (max-width: 768px) {
          body {
            align-items: stretch;
          }
          
          #root {
            align-items: stretch;
          }
        }
        
        .game-wrapper {
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          position: relative;
          overflow: hidden;
        }
        
        /* Desktop - center and constrain width */
        @media (min-width: 769px) {
          .game-wrapper {
            max-width: 1400px;
            margin: 0 auto;
            height: 100vh;
            box-shadow: 0 0 40px rgba(0,0,0,0.2);
          }
        }
        
        /* Portrait mode */
        @media (orientation: portrait) {
          .game-wrapper {
            flex-direction: column;
          }
          
          .game-header {
            padding: 0.5rem 0.75rem;
            min-height: 50px;
          }
          
          .game-content {
            flex: 1;
            min-height: 0;
          }
        }
        
        /* Landscape mode */
        @media (orientation: landscape) {
          .game-wrapper {
            flex-direction: row;
          }
          
          .game-header {
            width: 120px;
            flex-direction: column;
            padding: 0.75rem 0.5rem;
            justify-content: flex-start;
            gap: 0.75rem;
          }
          
          .game-content {
            flex: 1;
            min-width: 0;
          }
        }
        
        /* Desktop landscape - keep header at top */
        @media (min-width: 769px) and (orientation: landscape) {
          .game-wrapper {
            flex-direction: column;
          }
          
          .game-header {
            width: 100%;
            flex-direction: row;
            padding: 0.75rem 1.5rem;
          }
        }
        
        .game-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 10;
          flex-shrink: 0;
        }
        
        @media (min-width: 769px) {
          .game-header {
            padding: 1rem 1.5rem;
          }
        }
        
        @media (max-width: 768px) {
          .game-header {
            padding: 0.5rem 0.75rem;
            min-height: 50px;
          }
        }
        
        .game-title {
          font-size: clamp(0.875rem, 2vw, 1.5rem);
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .stats-grid {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          align-items: center;
        }
        
        @media (orientation: landscape) {
          .stats-grid {
            flex-direction: column;
            width: 100%;
            gap: 0.5rem;
          }
        }
        
        @media (min-width: 769px) and (orientation: landscape) {
          .stats-grid {
            flex-direction: row;
          }
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 0.375rem 0.75rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          min-width: fit-content;
        }
        
        .stat-value {
          font-size: clamp(0.875rem, 2vw, 1.25rem);
          font-weight: 700;
          color: #1f2937;
        }
        
        .stat-icon {
          flex-shrink: 0;
        }
        
        .game-content {
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .game-container {
          flex: 1;
          position: relative;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @media (min-width: 769px) {
          .game-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
          }
        }
        
        @media (orientation: landscape) {
          .game-container {
            padding: 0.5rem;
          }
        }
        
        @media (min-width: 769px) and (orientation: landscape) {
          .game-container {
            padding: 1rem;
          }
        }
        
        .canvas-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Pause overlay */
        .pause-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          z-index: 50;
          border-radius: inherit;
        }
        
        .pause-content {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem 3rem;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
        }
        
        .pause-text {
          font-size: clamp(1.5rem, 5vw, 3rem);
          font-weight: 800;
          color: #1f2937;
          letter-spacing: 0.05em;
        }
        
        /* Game over overlay */
        .game-over-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          z-index: 50;
          border-radius: inherit;
        }
        
        .game-over-content {
          background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%);
          padding: 2rem;
          border-radius: 24px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
          text-align: center;
          max-width: 90%;
          min-width: 280px;
        }
        
        .game-over-title {
          font-size: clamp(1.75rem, 6vw, 3.5rem);
          font-weight: 900;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          letter-spacing: 0.02em;
        }
        
        .game-over-score {
          font-size: clamp(1.125rem, 4vw, 1.75rem);
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 0.5rem;
        }
        
        .game-over-highscore {
          font-size: clamp(1rem, 3vw, 1.5rem);
          font-weight: 700;
          color: #7c3aed;
          margin-bottom: 1.5rem;
        }
        
        .restart-button {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          font-size: clamp(1rem, 3vw, 1.25rem);
          font-weight: 700;
          padding: 0.875rem 2rem;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
          transition: all 0.2s;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          min-height: 48px;
        }
        
        .restart-button:active {
          transform: scale(0.95);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        /* Lives display */
        .lives-display {
          display: flex;
          gap: 0.375rem;
          align-items: center;
        }
        
        .life-heart {
          width: clamp(20px, 4vw, 32px);
          height: clamp(20px, 4vw, 32px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(0.75rem, 2vw, 1.25rem);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: all 0.2s;
        }
        
        .life-heart.active {
          background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
        }
        
        .life-heart.inactive {
          background: rgba(156, 163, 175, 0.3);
          opacity: 0.5;
        }
        
        /* High score display */
        .highscore-display {
          font-size: clamp(0.75rem, 2vw, 1rem);
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .highscore-value {
          color: #fbbf24;
          font-weight: 800;
        }
        
        /* Pause button */
        .pause-button {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.5rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          transition: all 0.2s;
          min-width: 40px;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .pause-button:active {
          transform: scale(0.9);
        }
        
        @media (orientation: landscape) {
          .pause-button {
            width: 100%;
            padding: 0.75rem;
          }
        }
        
        @media (min-width: 769px) and (orientation: landscape) {
          .pause-button {
            width: auto;
            padding: 0.5rem;
          }
        }
        
        @media (max-width: 768px) {
          .game-header {
            padding: 0.5rem;
          }
          
          .stat-card {
            padding: 0.25rem 0.5rem;
          }
        }
      `}</style>
      
      <div className="game-header">
        <div className="game-title">Jelly Bean</div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <Trophy className="stat-icon text-yellow-600" size={18} />
            <div className="stat-value">{gameState.score}</div>
          </div>
          
          <div className="stat-card">
            <Star className="stat-icon text-purple-600" size={18} />
            <div className="stat-value">L{gameState.level}</div>
          </div>
          
          {combo > 0 && (
            <div className="stat-card animate-pulse">
              <Sparkles className="stat-icon text-pink-600" size={16} />
              <div className="stat-value">x{combo}</div>
            </div>
          )}
        </div>
        
        <div className="stats-grid">
          <div className="lives-display">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`life-heart ${i < gameState.lives ? 'active' : 'inactive'}`}
              >
                {i < gameState.lives && '❤️'}
              </div>
            ))}
          </div>
          
          <div className="highscore-display">
            Hi: <span className="highscore-value">{highScore}</span>
          </div>
          
          <button
            onClick={togglePause}
            className="pause-button"
          >
            {gameState.isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
        </div>
      </div>

      <div className="game-content">
        <div className="game-container">
          <div className="canvas-wrapper">
            <GameCanvas 
              gameState={gameState}
              onGameStateChange={handleGameStateChange}
              onScoreUpdate={handleScoreUpdate}
            />
            
            {gameState.isPaused && (
              <div className="pause-overlay">
                <div className="pause-content">
                  <div className="pause-text">⏸ PAUSED</div>
                </div>
              </div>
            )}

            {gameState.isGameOver && (
              <div className="game-over-overlay">
                <div className="game-over-content">
                  <div className="game-over-title">GAME OVER!</div>
                  <div className="game-over-score">Final Score: {gameState.score}</div>
                  <div className="game-over-highscore">High Score: {highScore}</div>
                  <button
                    onClick={resetGame}
                    className="restart-button"
                  >
                    PLAY AGAIN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
