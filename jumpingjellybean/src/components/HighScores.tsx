import React from 'react';
import { HighScore } from '../types';

interface HighScoresProps {
  scores: HighScore[];
  isVisible: boolean;
  onClose: () => void;
}

const HighScores: React.FC<HighScoresProps> = ({ scores, isVisible, onClose }) => {
  if (!isVisible) return null;

  const topScores = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div className="high-scores-overlay">
      <div className="high-scores-container">
        <div className="high-scores-header">
          <h2>🏆 Top 10 High Scores</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="high-scores-list">
          {topScores.length === 0 ? (
            <div className="no-scores">
              <p>No scores yet! Be the first to play!</p>
            </div>
          ) : (
            topScores.map((score, index) => (
              <div key={score.id} className={`score-item ${index < 3 ? 'podium' : ''}`}>
                <div className="rank">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </div>
                <div className="player-info">
                  <div className="username">{score.username}</div>
                  <div className="score-details">
                    Level {score.level} • {score.powerUpsUsed} power-ups
                  </div>
                </div>
                <div className="score-value">
                  {score.score.toLocaleString()}
                </div>
                <div className="score-date">
                  {new Date(score.date).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="high-scores-footer">
          <button className="play-again-button" onClick={onClose}>
            Play Again
          </button>
        </div>
      </div>

      <style>{`
        .high-scores-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .high-scores-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 2rem;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          color: white;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        .high-scores-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.2);
        }

        .high-scores-header h2 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .close-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .high-scores-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .score-item {
          display: grid;
          grid-template-columns: 60px 1fr auto auto;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .score-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .score-item.podium {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 193, 7, 0.1));
          border: 2px solid rgba(255, 215, 0, 0.3);
        }

        .rank {
          font-size: 1.5rem;
          font-weight: 700;
          text-align: center;
        }

        .player-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .username {
          font-weight: 700;
          font-size: 1.1rem;
        }

        .score-details {
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .score-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: #ffd700;
        }

        .score-date {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .no-scores {
          text-align: center;
          padding: 3rem 1rem;
          opacity: 0.8;
        }

        .no-scores p {
          margin: 0;
          font-size: 1.1rem;
        }

        .high-scores-footer {
          text-align: center;
          padding-top: 1rem;
          border-top: 2px solid rgba(255, 255, 255, 0.2);
        }

        .play-again-button {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          border: none;
          color: white;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .play-again-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: translateY(0);} }

        @media (max-width: 600px) {
          .high-scores-container {
            padding: 1.5rem;
            margin: 1rem;
          }

          .score-item {
            grid-template-columns: 50px 1fr auto;
            gap: 0.75rem;
            padding: 0.75rem;
          }

          .score-date {
            display: none;
          }

          .rank {
            font-size: 1.2rem;
          }

          .score-value {
            font-size: 1.1rem;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .high-scores-overlay,
          .high-scores-container,
          .score-item {
            animation: none !important;
            transition: none !important;
          }

          .score-item:hover {
            transform: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HighScores;