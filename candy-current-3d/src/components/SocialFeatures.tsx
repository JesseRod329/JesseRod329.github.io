import React, { useState, useEffect } from 'react';

interface Friend {
  id: string;
  name: string;
  level: number;
  score: number;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  target: number;
  progress: number;
  type: 'score' | 'collect' | 'time' | 'streak';
  expires: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  level: number;
  avatar: string;
  isYou: boolean;
}

const SocialFeatures: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Alex', level: 15, score: 45000, avatar: '🍇', isOnline: true, lastSeen: 'now' },
    { id: '2', name: 'Sarah', level: 12, score: 38000, avatar: '🍋', isOnline: true, lastSeen: '2m ago' },
    { id: '3', name: 'Mike', level: 18, score: 52000, avatar: '🫐', isOnline: false, lastSeen: '1h ago' },
    { id: '4', name: 'Emma', level: 9, score: 28000, avatar: '🍓', isOnline: true, lastSeen: '5m ago' },
    { id: '5', name: 'Jake', level: 22, score: 67000, avatar: '🍊', isOnline: false, lastSeen: '3h ago' },
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Daily Score Rush',
      description: 'Score 10,000 points in one session',
      reward: '500 Coins + 5 Gems',
      target: 10000,
      progress: 7500,
      type: 'score',
      expires: '23:59'
    },
    {
      id: '2',
      title: 'Collector\'s Dream',
      description: 'Find 15 rare collectibles',
      reward: 'Rare Jelly Skin',
      target: 15,
      progress: 8,
      type: 'collect',
      expires: '23:59'
    },
    {
      id: '3',
      title: 'Speed Demon',
      description: 'Complete a level in under 60 seconds',
      reward: 'Speed Boost Power-up',
      target: 60,
      progress: 45,
      type: 'time',
      expires: '23:59'
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'Jake', score: 67000, level: 22, avatar: '🍊', isYou: false },
    { rank: 2, name: 'You', score: 45000, level: 15, avatar: '🍇', isYou: true },
    { rank: 3, name: 'Alex', score: 45000, level: 15, avatar: '🍇', isYou: false },
    { rank: 4, name: 'Sarah', score: 38000, level: 12, avatar: '🍋', isYou: false },
    { rank: 5, name: 'Emma', score: 28000, level: 9, avatar: '🍓', isYou: false },
  ]);

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update friend online status
      setFriends(prev => prev.map(friend => ({
        ...friend,
        isOnline: Math.random() > 0.3, // 70% chance to be online
        lastSeen: friend.isOnline ? 'now' : `${Math.floor(Math.random() * 60)}m ago`
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const sendChallenge = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      alert(`Challenge sent to ${friend.name}! 🎮`);
    }
  };

  const getChallengeProgress = (challenge: Challenge) => {
    return Math.min((challenge.progress / challenge.target) * 100, 100);
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'score': return '🎯';
      case 'collect': return '📦';
      case 'time': return '⏱️';
      case 'streak': return '🔥';
      default: return '🏆';
    }
  };

  return (
    <div className="social-features">
      {/* Social Buttons */}
      <div className="social-buttons">
        <button 
          className="social-button leaderboard"
          onClick={() => setShowLeaderboard(!showLeaderboard)}
        >
          <span className="button-icon">🏆</span>
          <span className="button-label">Leaderboard</span>
        </button>
        
        <button 
          className="social-button friends"
          onClick={() => setShowFriends(!showFriends)}
        >
          <span className="button-icon">👥</span>
          <span className="button-label">Friends</span>
          <span className="online-count">{friends.filter(f => f.isOnline).length}</span>
        </button>
        
        <button 
          className="social-button challenges"
          onClick={() => setShowChallenges(!showChallenges)}
        >
          <span className="button-icon">🎯</span>
          <span className="button-label">Challenges</span>
          <span className="challenge-count">{challenges.length}</span>
        </button>
      </div>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="modal-overlay" onClick={() => setShowLeaderboard(false)}>
          <div className="modal-content leaderboard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🏆 Global Leaderboard</h2>
              <button className="close-button" onClick={() => setShowLeaderboard(false)}>✕</button>
            </div>
            
            <div className="leaderboard-list">
              {leaderboard.map((entry, index) => (
                <div key={entry.rank} className={`leaderboard-entry ${entry.isYou ? 'you' : ''}`}>
                  <div className="rank">
                    {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                  </div>
                  <div className="avatar">{entry.avatar}</div>
                  <div className="player-info">
                    <div className="name">{entry.name}</div>
                    <div className="level">Level {entry.level}</div>
                  </div>
                  <div className="score">{entry.score.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Friends Modal */}
      {showFriends && (
        <div className="modal-overlay" onClick={() => setShowFriends(false)}>
          <div className="modal-content friends-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>👥 Friends</h2>
              <button className="close-button" onClick={() => setShowFriends(false)}>✕</button>
            </div>
            
            <div className="friends-list">
              {friends.map((friend) => (
                <div key={friend.id} className="friend-entry">
                  <div className="friend-avatar">
                    {friend.avatar}
                    <div className={`online-indicator ${friend.isOnline ? 'online' : 'offline'}`}></div>
                  </div>
                  <div className="friend-info">
                    <div className="friend-name">{friend.name}</div>
                    <div className="friend-level">Level {friend.level}</div>
                    <div className="friend-status">
                      {friend.isOnline ? 'Online' : `Last seen ${friend.lastSeen}`}
                    </div>
                  </div>
                  <div className="friend-score">{friend.score.toLocaleString()}</div>
                  <button 
                    className="challenge-button"
                    onClick={() => sendChallenge(friend.id)}
                  >
                    Challenge
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenges Modal */}
      {showChallenges && (
        <div className="modal-overlay" onClick={() => setShowChallenges(false)}>
          <div className="modal-content challenges-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🎯 Daily Challenges</h2>
              <button className="close-button" onClick={() => setShowChallenges(false)}>✕</button>
            </div>
            
            <div className="challenges-list">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="challenge-entry">
                  <div className="challenge-header">
                    <div className="challenge-icon">{getChallengeIcon(challenge.type)}</div>
                    <div className="challenge-info">
                      <div className="challenge-title">{challenge.title}</div>
                      <div className="challenge-description">{challenge.description}</div>
                    </div>
                    <div className="challenge-reward">{challenge.reward}</div>
                  </div>
                  
                  <div className="challenge-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${getChallengeProgress(challenge)}%` }}
                      />
                    </div>
                    <div className="progress-text">
                      {challenge.progress}/{challenge.target} • Expires {challenge.expires}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .social-features {
          position: fixed;
          bottom: 20px;
          left: 20px;
          z-index: 1000;
        }

        .social-buttons {
          display: flex;
          gap: 1rem;
        }

        .social-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          border-radius: 15px;
          padding: 1rem;
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
          position: relative;
          min-width: 80px;
        }

        .social-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .button-icon {
          font-size: 1.5rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .button-label {
          font-size: 0.8rem;
          font-weight: bold;
        }

        .online-count, .challenge-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #FF6B6B;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .modal-overlay {
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
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 20px;
          padding: 2rem;
          color: white;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.2);
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .close-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .leaderboard-list, .friends-list, .challenges-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .leaderboard-entry, .friend-entry, .challenge-entry {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .leaderboard-entry.you {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 193, 7, 0.2));
          border: 2px solid rgba(255, 215, 0, 0.5);
        }

        .rank {
          font-size: 1.5rem;
          font-weight: bold;
          min-width: 40px;
          text-align: center;
        }

        .avatar, .friend-avatar {
          font-size: 2rem;
          position: relative;
        }

        .online-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .online-indicator.online {
          background: #4CAF50;
        }

        .online-indicator.offline {
          background: #95A5A6;
        }

        .player-info, .friend-info {
          flex: 1;
        }

        .name, .friend-name, .challenge-title {
          font-weight: bold;
          font-size: 1.1rem;
        }

        .level, .friend-level {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .score, .friend-score {
          font-weight: bold;
          color: #FFD700;
        }

        .challenge-button {
          background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
          transition: transform 0.3s ease;
        }

        .challenge-button:hover {
          transform: translateY(-1px);
        }

        .challenge-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
        }

        .challenge-icon {
          font-size: 2rem;
        }

        .challenge-info {
          flex: 1;
        }

        .challenge-description {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-top: 0.25rem;
        }

        .challenge-reward {
          font-weight: bold;
          color: #FFD700;
          font-size: 0.9rem;
        }

        .challenge-progress {
          width: 100%;
          margin-top: 1rem;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4ECDC4, #45B7D1);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.8rem;
          opacity: 0.8;
          text-align: center;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 1rem;
            padding: 1.5rem;
          }
          
          .social-buttons {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .social-button {
            min-width: 60px;
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SocialFeatures;
