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
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false);
  const [combo, setCombo] = useState<number>(0);

  const handleGameStateChange = (newState: Partial<GameState>) => {
    setGameState(prev => {
      const updated = { ...prev, ...newState };
      
      // Check for level up
      if (updated.score > 0 && Math.floor(updated.score / 1000) > Math.floor(prev.score / 1000)) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2000);
        updated.level = Math.floor(updated.score / 1000) + 1;
      }
      
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 p-4 font-sans">
      <style>{`
        @media (max-width: 768px) {
          body {
            padding: 0;
            margin: 0;
          }
          .flex {
            padding: 0.5rem;
          }
        }
        html {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        body {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: fixed;
          touch-action: none;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 max-w-6xl w-full">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              JUMPING JELLYBEAN
            </div>
          </div>
         
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
              <Trophy className="text-yellow-600" size={24} />
              <div className="text-2xl font-bold text-yellow-700">{gameState.score}</div>
            </div>
           
            <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
              <Star className="text-purple-600" size={24} />
              <div className="text-xl font-bold text-purple-700">LVL {gameState.level}</div>
            </div>

            {combo > 0 && (
              <div className="flex items-center gap-2 bg-pink-100 px-4 py-2 rounded-full animate-pulse">
                <Sparkles className="text-pink-600" size={20} />
                <div className="text-lg font-bold text-pink-700">x{combo}</div>
              </div>
            )}
          </div>

          <button
            onClick={togglePause}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white rounded-full p-3 shadow-lg transition-all active:scale-95"
          >
            {gameState.isPaused ? <Play size={24} /> : <Pause size={24} />}
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full ${
                  i < gameState.lives ? 'bg-gradient-to-br from-red-400 to-pink-500' : 'bg-gray-300'
                } shadow-lg flex items-center justify-center text-white font-bold text-2xl`}
              >
                {i < gameState.lives && '❤️'}
              </div>
            ))}
          </div>
         
          <div className="text-lg font-semibold text-gray-600">
            High Score: <span className="text-purple-600 font-bold">{highScore}</span>
          </div>
        </div>

        <div className="relative">
          <GameCanvas 
            gameState={gameState}
            onGameStateChange={handleGameStateChange}
            onScoreUpdate={handleScoreUpdate}
          />
         
          {showLevelUp && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-6xl font-bold px-16 py-8 rounded-3xl shadow-2xl animate-bounce">
                ⭐ LEVEL {gameState.level}! ⭐
              </div>
            </div>
          )}
         
          {gameState.isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-2xl z-40">
              <div className="bg-white text-5xl font-bold px-16 py-8 rounded-3xl shadow-2xl text-gray-800">
                ⏸ PAUSED
              </div>
            </div>
          )}

          {gameState.isGameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-2xl z-40">
              <div className="bg-white px-12 py-8 rounded-3xl shadow-2xl text-center">
                <div className="text-5xl font-bold text-red-600 mb-4">GAME OVER!</div>
                <div className="text-3xl font-semibold text-gray-700 mb-2">Final Score: {gameState.score}</div>
                <div className="text-2xl text-purple-600 mb-6">High Score: {highScore}</div>
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white text-2xl font-bold py-4 px-12 rounded-full shadow-lg transition-all active:scale-95"
                >
                  PLAY AGAIN
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
