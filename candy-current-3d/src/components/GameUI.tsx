import React, { useState } from 'react';

const GameUI: React.FC = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);

  return (
    <div className="game-ui">
      {/* Top HUD */}
      <div className="top-hud">
        <div className="hud-left">
          <button className="ui-button pause-button">
            ⏸️
          </button>
        </div>
        
        <div className="hud-center">
          <div className="score-display">
            SCORE: {score.toLocaleString()}
          </div>
        </div>
        
        <div className="hud-right">
          <button className="ui-button missions-button">
            MISSIONS
          </button>
          <div className="star-icon">⭐</div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bottom-controls">
        <div className="control-buttons">
          <button className="control-button move-button">
            <div className="control-icon">←→</div>
            <div className="control-label">MOVE</div>
          </button>
          
          <button className="control-button jump-button">
            <div className="control-icon">↑</div>
            <div className="control-label">JUMP</div>
          </button>
        </div>
        
        <div className="character-status">
          <div className="jelly-squad">
            <div className="jelly-portrait">
              <div className="jelly-avatar grape">🍇</div>
              <div className="jelly-level">Level 1</div>
              <div className="level-bar">
                <div className="level-progress" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div className="jelly-portrait">
              <div className="jelly-avatar lime">🍋</div>
              <div className="jelly-level">Level 1</div>
              <div className="level-bar">
                <div className="level-progress" style={{ width: '30%' }}></div>
              </div>
            </div>
            
            <div className="jelly-portrait">
              <div className="jelly-avatar blueberry">🫐</div>
              <div className="jelly-level">Level 1</div>
              <div className="level-bar">
                <div className="level-progress" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Power-up Indicators */}
      <div className="power-up-indicators">
        <div className="power-up active">
          <div className="power-up-icon">🍭</div>
          <div className="power-up-timer">5s</div>
        </div>
        <div className="power-up">
          <div className="power-up-icon">🧲</div>
          <div className="power-up-timer">0s</div>
        </div>
        <div className="power-up">
          <div className="power-up-icon">🛡️</div>
          <div className="power-up-timer">0s</div>
        </div>
      </div>

      <style jsx>{`
        .game-ui {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1000;
          font-family: 'Comic Sans MS', cursive, sans-serif;
        }

        .top-hud {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
          backdrop-filter: blur(10px);
          border-radius: 0 0 20px 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .hud-left, .hud-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .score-display {
          font-size: 24px;
          font-weight: bold;
          color: #FF6B6B;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          background: linear-gradient(45deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ui-button {
          background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          color: white;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
          transition: all 0.3s ease;
          pointer-events: all;
        }

        .ui-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        }

        .missions-button {
          background: linear-gradient(135deg, #4ECDC4, #44A08D);
          border-radius: 25px;
          width: auto;
          padding: 0 20px;
          font-size: 14px;
          font-weight: bold;
        }

        .star-icon {
          font-size: 30px;
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
        }

        .bottom-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 20px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
          backdrop-filter: blur(10px);
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
        }

        .control-buttons {
          display: flex;
          gap: 15px;
        }

        .control-button {
          background: linear-gradient(135deg, #E0E0E0, #C0C0C0);
          border: none;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          pointer-events: all;
        }

        .control-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .control-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .control-icon {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .control-label {
          font-size: 12px;
          font-weight: bold;
          color: #666;
          margin-top: 5px;
        }

        .jelly-squad {
          display: flex;
          gap: 15px;
        }

        .jelly-portrait {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 15px;
          padding: 10px;
          min-width: 80px;
        }

        .jelly-avatar {
          font-size: 30px;
          margin-bottom: 5px;
        }

        .jelly-level {
          font-size: 12px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }

        .level-bar {
          width: 60px;
          height: 6px;
          background: #E0E0E0;
          border-radius: 3px;
          overflow: hidden;
        }

        .level-progress {
          height: 100%;
          background: linear-gradient(90deg, #4ECDC4, #44A08D);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .power-up-indicators {
          position: absolute;
          top: 50%;
          right: 20px;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .power-up {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
          padding: 10px;
          min-width: 60px;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .power-up.active {
          opacity: 1;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .power-up-icon {
          font-size: 24px;
          margin-bottom: 5px;
        }

        .power-up-timer {
          font-size: 12px;
          font-weight: bold;
          color: #333;
        }

        @media (max-width: 768px) {
          .top-hud {
            padding: 15px;
          }
          
          .score-display {
            font-size: 20px;
          }
          
          .bottom-controls {
            padding: 15px;
          }
          
          .control-button {
            width: 70px;
            height: 70px;
          }
          
          .jelly-squad {
            gap: 10px;
          }
          
          .jelly-portrait {
            min-width: 60px;
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default GameUI;
