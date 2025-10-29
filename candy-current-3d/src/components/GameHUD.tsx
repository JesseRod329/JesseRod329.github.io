import React, { useState, useEffect } from 'react';
import './GameHUD.css';

interface GameHUDProps {
  score: number;
  lives: number;
  level: number;
  pelletsCollected: number;
  totalPellets: number;
  timeElapsed: number;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
}

const GameHUD: React.FC<GameHUDProps> = ({
  score,
  lives,
  level,
  pelletsCollected,
  totalPellets,
  timeElapsed,
  isPaused,
  onPause,
  onResume
}) => {
  const [showControls, setShowControls] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (totalPellets === 0) return 0;
    return Math.round((pelletsCollected / totalPellets) * 100);
  };

  return (
    <div className="game-hud">
      {/* Top Bar */}
      <div className="hud-top">
        <div className="score-display">
          <div className="score-label">SCORE</div>
          <div className="score-value">{score.toLocaleString()}</div>
        </div>
        
        <div className="level-info">
          <div className="level-label">LEVEL</div>
          <div className="level-value">{level}</div>
        </div>
        
        <div className="lives-display">
          <div className="lives-label">LIVES</div>
          <div className="lives-value">
            {'❤️'.repeat(lives)}
            {'💔'.repeat(3 - lives)}
          </div>
        </div>
        
        <div className="timer-display">
          <div className="timer-label">TIME</div>
          <div className="timer-value">{formatTime(timeElapsed)}</div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="hud-bottom">
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <div className="progress-text">
            {pelletsCollected}/{totalPellets} Pellets
          </div>
        </div>
        
        <div className="controls-section">
          <button 
            className="control-btn pause-btn"
            onClick={isPaused ? onResume : onPause}
          >
            {isPaused ? '▶️' : '⏸️'}
          </button>
          
          <button 
            className="control-btn help-btn"
            onClick={() => setShowControls(!showControls)}
          >
            ❓
          </button>
        </div>
      </div>

      {/* Controls Overlay */}
      {showControls && (
        <div className="controls-overlay">
          <div className="controls-content">
                    <div className="controls-title">🎮 Pac-Man Controls</div>
                    <div className="controls-list">
                      <div className="control-item">
                        <span className="control-key">A/D / ←/→</span>
                        <span className="control-desc">Move Left/Right</span>
                      </div>
                      <div className="control-item">
                        <span className="control-key">W/S / ↑/↓</span>
                        <span className="control-desc">Move Up/Down</span>
                      </div>
                      <div className="control-item">
                        <span className="control-key">ESC</span>
                        <span className="control-desc">Pause Game</span>
                      </div>
                      <div className="control-item">
                        <span className="control-key">Power Pellets</span>
                        <span className="control-desc">Make ghosts vulnerable</span>
                      </div>
              <div className="control-item">
                <span className="control-key">Middle Mouse</span>
                <span className="control-desc">Orbit Camera</span>
              </div>
              <div className="control-item">
                <span className="control-key">Mouse Wheel</span>
                <span className="control-desc">Zoom</span>
              </div>
              <div className="control-item">
                <span className="control-key">C</span>
                <span className="control-desc">Camera Mode</span>
              </div>
              <div className="control-item">
                <span className="control-key">R</span>
                <span className="control-desc">Reset Camera</span>
              </div>
              <div className="control-item">
                <span className="control-key">ESC</span>
                <span className="control-desc">Pause</span>
              </div>
            </div>
            <button 
              className="close-controls"
              onClick={() => setShowControls(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Pause Overlay */}
      {isPaused && (
        <div className="pause-overlay">
          <div className="pause-content">
            <div className="pause-title">⏸️ PAUSED</div>
            <div className="pause-stats">
              <div>Score: {score.toLocaleString()}</div>
              <div>Level: {level}</div>
              <div>Pellets: {pelletsCollected}/{totalPellets}</div>
              <div>Time: {formatTime(timeElapsed)}</div>
            </div>
            <div className="pause-buttons">
              <button className="pause-btn" onClick={onResume}>
                Resume
              </button>
              <button className="pause-btn">
                Restart
              </button>
              <button className="pause-btn">
                Menu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GameHUD;
