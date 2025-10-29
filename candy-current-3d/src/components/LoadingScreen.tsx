import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Candy World...');

          const loadingSteps = [
            { text: 'Initializing Pac-Man Maze...', duration: 1000 },
            { text: 'Loading Ghost Enemies...', duration: 800 },
            { text: 'Creating Maze Walls...', duration: 600 },
            { text: 'Spawning Power Pellets...', duration: 500 },
            { text: 'Setting up Player Spawn...', duration: 400 },
            { text: 'Preparing Ghost AI...', duration: 300 },
            { text: 'Almost Ready...', duration: 200 },
            { text: 'Welcome to Pac-Man 3D!', duration: 100 },
          ];

  useEffect(() => {
    let currentStep = 0;
    let totalDuration = 0;

    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setLoadingText(step.text);
        
        const stepProgress = ((currentStep + 1) / loadingSteps.length) * 100;
        setProgress(stepProgress);
        
        totalDuration += step.duration;
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
                <div className="loading-title">
                  👻 Pac-Man 3D 👻
                </div>
                <div className="loading-subtitle">
                  Maze Adventure
                </div>
        
        <div className="loading-spinner"></div>
        
        <div className="loading-progress">
          {loadingText}
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
                <div className="loading-tips">
                  <div className="tip">💡 Tip: Use A/D or ←/→ to move left/right!</div>
                  <div className="tip">💡 Tip: Use W/S or ↑/↓ to move up/down!</div>
                  <div className="tip">💡 Tip: Collect pellets for points!</div>
                  <div className="tip">💡 Tip: Power pellets make ghosts vulnerable!</div>
                </div>
      </div>
      
      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1, #F9CA24);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: gradientShift 3s ease-in-out infinite;
        }

        .loading-content {
          text-align: center;
          color: white;
          max-width: 500px;
          padding: 2rem;
        }

        .loading-title {
          font-size: 3rem;
          font-weight: bold;
          text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
          margin-bottom: 1rem;
          animation: bounce 2s ease-in-out infinite;
        }

        .loading-subtitle {
          font-size: 1.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          margin-bottom: 3rem;
          opacity: 0.9;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 2rem;
        }

        .loading-progress {
          font-size: 1.2rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          margin-bottom: 1rem;
          min-height: 1.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #FFD700, #FFA500);
          border-radius: 4px;
          transition: width 0.3s ease;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .loading-tips {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .tip {
          animation: float 3s ease-in-out infinite;
        }

        .tip:nth-child(2) {
          animation-delay: 0.5s;
        }

        .tip:nth-child(3) {
          animation-delay: 1s;
        }

        @keyframes gradientShift {
          0% { background: linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1, #F9CA24); }
          25% { background: linear-gradient(135deg, #4ECDC4, #45B7D1, #F9CA24, #FF6B6B); }
          50% { background: linear-gradient(135deg, #45B7D1, #F9CA24, #FF6B6B, #4ECDC4); }
          75% { background: linear-gradient(135deg, #F9CA24, #FF6B6B, #4ECDC4, #45B7D1); }
          100% { background: linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1, #F9CA24); }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @media (max-width: 768px) {
          .loading-title {
            font-size: 2rem;
          }
          
          .loading-subtitle {
            font-size: 1.2rem;
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
