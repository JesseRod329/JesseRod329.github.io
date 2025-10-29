import React, { useState, useEffect } from 'react';

interface PlayerStats {
  level: number;
  xp: number;
  xpToNext: number;
  totalScore: number;
  coins: number;
  gems: number;
  streak: number;
  playTime: number;
  achievements: string[];
}

interface ProgressionSystemProps {
  onLevelUp: (newLevel: number) => void;
  onAchievement: (achievement: string) => void;
}

const ProgressionSystem: React.FC<ProgressionSystemProps> = ({ onLevelUp, onAchievement }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    xp: 0,
    xpToNext: 100,
    totalScore: 0,
    coins: 0,
    gems: 0,
    streak: 0,
    playTime: 0,
    achievements: []
  });

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [recentRewards, setRecentRewards] = useState<string[]>([]);

  // XP and Level calculation
  const calculateXPToNext = (level: number) => {
    return Math.floor(100 * Math.pow(1.2, level - 1));
  };

  // Add XP with dopamine effects
  const addXP = (amount: number, source: string) => {
    setPlayerStats(prev => {
      const newXP = prev.xp + amount;
      const xpToNext = calculateXPToNext(prev.level);
      
      if (newXP >= xpToNext) {
        // LEVEL UP!
        const newLevel = prev.level + 1;
        const remainingXP = newXP - xpToNext;
        
        setShowLevelUp(true);
        onLevelUp(newLevel);
        
        // Add rewards for leveling up
        const rewards = [
          `${newLevel * 50} Coins`,
          `${newLevel * 2} Gems`,
          'New Jelly Skin Unlocked!',
          'Power-up Boost!'
        ];
        setRecentRewards(rewards);
        
        // Check for achievements
        checkAchievements(newLevel, prev.totalScore + amount);
        
        return {
          ...prev,
          level: newLevel,
          xp: remainingXP,
          xpToNext: calculateXPToNext(newLevel),
          coins: prev.coins + (newLevel * 50),
          gems: prev.gems + (newLevel * 2),
          totalScore: prev.totalScore + amount
        };
      }
      
      return {
        ...prev,
        xp: newXP,
        totalScore: prev.totalScore + amount
      };
    });
    
    // Show XP gain with animation
    showXPGain(amount, source);
  };

  // Check for achievements
  const checkAchievements = (level: number, totalScore: number) => {
    const newAchievements = [];
    
    if (level >= 5 && !playerStats.achievements.includes('level5')) {
      newAchievements.push('level5');
    }
    if (level >= 10 && !playerStats.achievements.includes('level10')) {
      newAchievements.push('level10');
    }
    if (totalScore >= 10000 && !playerStats.achievements.includes('score10k')) {
      newAchievements.push('score10k');
    }
    if (playerStats.streak >= 7 && !playerStats.achievements.includes('streak7')) {
      newAchievements.push('streak7');
    }
    
    newAchievements.forEach(achievement => {
      showAchievementNotification(achievement);
      onAchievement(achievement);
    });
  };

  // Show XP gain animation
  const showXPGain = (amount: number, source: string) => {
    // Create floating XP text
    const xpElement = document.createElement('div');
    xpElement.textContent = `+${amount} XP`;
    xpElement.style.position = 'fixed';
    xpElement.style.top = '50%';
    xpElement.style.left = '50%';
    xpElement.style.transform = 'translate(-50%, -50%)';
    xpElement.style.color = '#FFD700';
    xpElement.style.fontSize = '24px';
    xpElement.style.fontWeight = 'bold';
    xpElement.style.pointerEvents = 'none';
    xpElement.style.zIndex = '9999';
    xpElement.style.animation = 'xpFloat 2s ease-out forwards';
    
    document.body.appendChild(xpElement);
    
    setTimeout(() => {
      document.body.removeChild(xpElement);
    }, 2000);
  };

  // Show achievement notification
  const showAchievementNotification = (achievement: string) => {
    const achievementNames: { [key: string]: string } = {
      level5: 'Rising Star',
      level10: 'Candy Master',
      score10k: 'High Scorer',
      streak7: 'Consistent Player'
    };
    
    setShowAchievement(achievementNames[achievement]);
    setTimeout(() => setShowAchievement(null), 3000);
  };

  // Simulate gameplay progression
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate score gain during gameplay
      if (Math.random() < 0.3) {
        const xpGain = Math.floor(Math.random() * 50) + 10;
        addXP(xpGain, 'collectible');
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showLevelUp && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        console.log('Keyboard shortcut triggered - closing level up modal');
        setShowLevelUp(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showLevelUp]);

  return (
    <div className="progression-system">
      {/* Level Up Modal */}
      {showLevelUp && (
        <div 
          className="level-up-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              console.log('Modal background clicked - closing modal');
              setShowLevelUp(false);
            }
          }}
        >
          <div className="level-up-content">
            <div className="level-up-title">🎉 LEVEL UP! 🎉</div>
            <div className="level-up-level">Level {playerStats.level}</div>
            <div className="rewards-title">Rewards:</div>
            <div className="rewards-list">
              {recentRewards.map((reward, index) => (
                <div key={index} className="reward-item">
                  ✨ {reward}
                </div>
              ))}
            </div>
            <button 
              className="continue-button"
              onClick={() => {
                console.log('Continue button clicked!');
                setShowLevelUp(false);
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(2px) scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
              }}
            >
              Continue Playing!
            </button>
          </div>
        </div>
      )}

      {/* Achievement Notification */}
      {showAchievement && (
        <div className="achievement-notification">
          <div className="achievement-content">
            <div className="achievement-icon">🏆</div>
            <div className="achievement-title">Achievement Unlocked!</div>
            <div className="achievement-name">{showAchievement}</div>
          </div>
        </div>
      )}

      {/* XP Bar */}
      <div className="xp-bar-container">
        <div className="xp-bar">
          <div 
            className="xp-fill"
            style={{ 
              width: `${(playerStats.xp / playerStats.xpToNext) * 100}%` 
            }}
          />
        </div>
        <div className="xp-text">
          Level {playerStats.level} • {playerStats.xp}/{playerStats.xpToNext} XP
        </div>
      </div>

      {/* Stats Display */}
      <div className="stats-display">
        <div className="stat-item">
          <span className="stat-icon">🪙</span>
          <span className="stat-value">{playerStats.coins.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💎</span>
          <span className="stat-value">{playerStats.gems}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🔥</span>
          <span className="stat-value">{playerStats.streak} streak</span>
        </div>
      </div>

      <style jsx>{`
        .progression-system {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          pointer-events: none;
        }

        .level-up-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.5s ease;
          pointer-events: auto;
        }

        .level-up-content {
          background: linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1, #F9CA24);
          padding: 3rem;
          border-radius: 20px;
          text-align: center;
          color: white;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: bounceIn 0.6s ease;
          max-width: 400px;
        }

        .level-up-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .level-up-level {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 2rem;
          color: #FFD700;
          text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
        }

        .rewards-title {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          font-weight: bold;
        }

        .rewards-list {
          margin-bottom: 2rem;
        }

        .reward-item {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 10px;
          font-weight: bold;
        }

        .continue-button {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          border: none;
          padding: 1rem 2rem;
          border-radius: 15px;
          color: white;
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
          transition: transform 0.3s ease;
          pointer-events: auto;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          z-index: 10000;
          position: relative;
        }

        .continue-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(255, 215, 0, 0.4);
        }

        .continue-button:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
        }

        .continue-button:focus {
          outline: none;
          box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3), 0 0 0 3px rgba(255, 215, 0, 0.3);
        }

        .achievement-notification {
          position: fixed;
          top: 50%;
          right: 20px;
          transform: translateY(-50%);
          background: linear-gradient(135deg, #FFD700, #FFA500);
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
          animation: slideInRight 0.5s ease;
          z-index: 9998;
        }

        .achievement-content {
          text-align: center;
          color: white;
        }

        .achievement-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .achievement-title {
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .achievement-name {
          font-size: 1.2rem;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .xp-bar-container {
          background: rgba(255, 255, 255, 0.9);
          padding: 1rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          margin-bottom: 1rem;
          min-width: 200px;
        }

        .xp-bar {
          width: 100%;
          height: 8px;
          background: #E0E0E0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .xp-fill {
          height: 100%;
          background: linear-gradient(90deg, #4ECDC4, #45B7D1);
          border-radius: 4px;
          transition: width 0.3s ease;
          box-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
        }

        .xp-text {
          font-size: 0.9rem;
          font-weight: bold;
          color: #333;
          text-align: center;
        }

        .stats-display {
          display: flex;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.9);
          padding: 0.75rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: bold;
          color: #333;
        }

        .stat-icon {
          font-size: 1.2rem;
        }

        .stat-value {
          font-size: 0.9rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(100%) translateY(-50%); }
          to { transform: translateX(0) translateY(-50%); }
        }

        @keyframes xpFloat {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -80px) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ProgressionSystem;
