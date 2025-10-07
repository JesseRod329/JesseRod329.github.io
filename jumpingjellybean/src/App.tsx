import React, { useState, useEffect } from 'react';
import { User, HighScore, GameState } from './types';
import UserSignup from './components/UserSignup';
import HighScores from './components/HighScores';
import GameCanvas from './components/GameCanvas';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showSignup, setShowSignup] = useState(true);
  const [showHighScores, setShowHighScores] = useState(false);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  
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

  // Load high scores from localStorage on mount
  useEffect(() => {
    const savedScores = localStorage.getItem('jellybean-highscores');
    if (savedScores) {
      try {
        const scores = JSON.parse(savedScores).map((score: any) => ({
          ...score,
          date: new Date(score.date)
        }));
        setHighScores(scores);
      } catch (error) {
        console.error('Error loading high scores:', error);
      }
    }
  }, []);

  // Save high scores to localStorage
  const saveHighScores = (scores: HighScore[]) => {
    localStorage.setItem('jellybean-highscores', JSON.stringify(scores));
    setHighScores(scores);
  };

  // Handle user signup
  const handleSignup = (user: User) => {
    setCurrentUser(user);
    setGameState(prev => ({ ...prev, currentUser: user }));
    setShowSignup(false);
  };

  // Handle user login
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setGameState(prev => ({ ...prev, currentUser: user }));
    setShowSignup(false);
  };

  // Start new game
  const startNewGame = () => {
    setGameState({
      score: 0,
      level: 1,
      lives: 3,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      currentUser,
      powerUps: [],
      activePowerUps: new Set(),
      doubleJumpAvailable: false,
      airTimeRemaining: 0
    });
  };

  // Pause/resume game
  const togglePause = () => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
      isPlaying: !prev.isPaused
    }));
  };

  // End game
  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isGameOver: true
    }));

    // Add score to high scores if user is logged in
    if (currentUser && gameState.score > 0) {
      const newScore: HighScore = {
        id: Date.now().toString(),
        userId: currentUser.id,
        username: currentUser.username,
        score: gameState.score,
        level: gameState.level,
        powerUpsUsed: gameState.activePowerUps.size,
        date: new Date()
      };

      const updatedScores = [...highScores, newScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 50); // Keep top 50 scores

      saveHighScores(updatedScores);
    }
  };

  // Update game state
  const handleGameStateChange = (newState: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...newState }));
  };

  // Update score
  const handleScoreUpdate = (score: number) => {
    setGameState(prev => ({ ...prev, score }));
  };

  // Show high scores
  const showHighScoresModal = () => {
    setShowHighScores(true);
  };

  // Close high scores
  const closeHighScores = () => {
    setShowHighScores(false);
  };

  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setGameState(prev => ({ ...prev, currentUser: null }));
    setShowSignup(true);
  };

  return (
    <div className="app">
      {/* User Signup Modal */}
      {showSignup && (
        <UserSignup
          onSignup={handleSignup}
          onLogin={handleLogin}
        />
      )}

      {/* High Scores Modal */}
      <HighScores
        scores={highScores}
        isVisible={showHighScores}
        onClose={closeHighScores}
      />

      {/* Main Game Interface */}
      {!showSignup && (
        <div className="game-container">
          {/* Header */}
          <header className="game-header">
            <div className="header-left">
              <h1>🍭 Jumping Jelly Bean Enhanced</h1>
              {currentUser && (
                <div className="user-info">
                  Welcome, {currentUser.username}!
                </div>
              )}
            </div>
            <div className="header-right">
              <button 
                className="header-button"
                onClick={showHighScoresModal}
              >
                🏆 High Scores
              </button>
              <button 
                className="header-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </header>

          {/* Game Area */}
          <main className="game-main">
            {!gameState.isPlaying && !gameState.isGameOver && (
              <div className="game-menu">
                <h2>Ready to Jump?</h2>
                <p>Collect power-ups, master double jumps, and reach new heights!</p>
                <div className="menu-buttons">
                  <button 
                    className="play-button"
                    onClick={startNewGame}
                  >
                    🎮 Start Game
                  </button>
                </div>
                <div className="game-features">
                  <h3>New Features:</h3>
                  <ul>
                    <li>✨ Double Jump ability</li>
                    <li>🚀 Air Time power-ups</li>
                    <li>⚡ Speed Boost power-ups</li>
                    <li>🛡️ Shield protection</li>
                    <li>🏆 High Score tracking</li>
                  </ul>
                </div>
              </div>
            )}

            {gameState.isPlaying && (
              <div className="game-play">
                <GameCanvas
                  gameState={gameState}
                  onGameStateChange={handleGameStateChange}
                  onScoreUpdate={handleScoreUpdate}
                />
                <div className="game-controls">
                  <button 
                    className="control-button"
                    onClick={togglePause}
                  >
                    {gameState.isPaused ? '▶️ Resume' : '⏸️ Pause'}
                  </button>
                  <button 
                    className="control-button"
                    onClick={endGame}
                  >
                    🏁 End Game
                  </button>
                </div>
              </div>
            )}

            {gameState.isGameOver && (
              <div className="game-over">
                <h2>Game Over!</h2>
                <div className="final-score">
                  <p>Final Score: <span className="score-value">{gameState.score}</span></p>
                  <p>Level Reached: <span className="level-value">{gameState.level}</span></p>
                </div>
                <div className="game-over-buttons">
                  <button 
                    className="play-button"
                    onClick={startNewGame}
                  >
                    🔄 Play Again
                  </button>
                  <button 
                    className="header-button"
                    onClick={showHighScoresModal}
                  >
                    🏆 View High Scores
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      <style>{`
        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-family: 'Arial', sans-serif;
        }

        .game-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-left h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .user-info {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-top: 0.25rem;
        }

        .header-right {
          display: flex;
          gap: 1rem;
        }

        .header-button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .header-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .game-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .game-menu {
          text-align: center;
          max-width: 600px;
        }

        .game-menu h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .game-menu p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .menu-buttons {
          margin-bottom: 3rem;
        }

        .play-button {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          border: none;
          color: white;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
        }

        .play-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(255, 107, 107, 0.4);
        }

        .game-features {
          text-align: left;
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .game-features h3 {
          margin: 0 0 1rem 0;
          font-size: 1.3rem;
        }

        .game-features ul {
          margin: 0;
          padding-left: 1.5rem;
        }

        .game-features li {
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .game-play {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .game-controls {
          display: flex;
          gap: 1rem;
        }

        .control-button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .control-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .game-over {
          text-align: center;
          max-width: 500px;
        }

        .game-over h2 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #ff6b6b;
        }

        .final-score {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
        }

        .final-score p {
          font-size: 1.2rem;
          margin: 0.5rem 0;
        }

        .score-value, .level-value {
          color: #ffd700;
          font-weight: 700;
          font-size: 1.5rem;
        }

        .game-over-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .game-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .header-right {
            justify-content: center;
          }

          .game-menu h2 {
            font-size: 2rem;
          }

          .game-over h2 {
            font-size: 2rem;
          }

          .game-over-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default App;