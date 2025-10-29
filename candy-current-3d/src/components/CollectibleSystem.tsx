import React, { useState, useEffect } from 'react';

interface Collectible {
  id: string;
  type: 'common' | 'rare' | 'epic' | 'legendary';
  name: string;
  description: string;
  emoji: string;
  value: number;
  rarity: number; // 0-100, higher = rarer
}

interface CollectibleSystemProps {
  onCollectibleFound: (collectible: Collectible) => void;
}

const CollectibleSystem: React.FC<CollectibleSystemProps> = ({ onCollectibleFound }) => {
  const [inventory, setInventory] = useState<Collectible[]>([]);
  const [showGachaModal, setShowGachaModal] = useState(false);
  const [gachaResult, setGachaResult] = useState<Collectible | null>(null);
  const [coins, setCoins] = useState(1000);
  const [gems, setGems] = useState(50);

  // Collectible database - the addiction factor!
  const collectibleDatabase: Collectible[] = [
    // Common (70% chance)
    { id: '1', type: 'common', name: 'Basic Gummy', description: 'A simple gummy bear', emoji: '🐻', value: 10, rarity: 70 },
    { id: '2', type: 'common', name: 'Sugar Cube', description: 'Sweet and simple', emoji: '🧊', value: 15, rarity: 65 },
    { id: '3', type: 'common', name: 'Marshmallow', description: 'Fluffy and soft', emoji: '🤍', value: 20, rarity: 60 },
    
    // Rare (20% chance)
    { id: '4', type: 'rare', name: 'Golden Gummy', description: 'A shimmering gummy bear', emoji: '🌟', value: 50, rarity: 25 },
    { id: '5', type: 'rare', name: 'Crystal Candy', description: 'Transparent and pure', emoji: '💎', value: 75, rarity: 20 },
    { id: '6', type: 'rare', name: 'Rainbow Lollipop', description: 'All the colors of the rainbow', emoji: '🍭', value: 100, rarity: 15 },
    
    // Epic (8% chance)
    { id: '7', type: 'epic', name: 'Diamond Gummy', description: 'The rarest of gummies', emoji: '💠', value: 200, rarity: 8 },
    { id: '8', type: 'epic', name: 'Cosmic Candy', description: 'Contains the power of the stars', emoji: '🌌', value: 300, rarity: 5 },
    { id: '9', type: 'epic', name: 'Mystical Marshmallow', description: 'Glows with magical energy', emoji: '✨', value: 250, rarity: 7 },
    
    // Legendary (2% chance) - THE ADDICTION!
    { id: '10', type: 'legendary', name: 'Phantom Jelly', description: 'A ghostly jelly that transcends reality', emoji: '👻', value: 1000, rarity: 2 },
    { id: '11', type: 'legendary', name: 'Time Warp Candy', description: 'Bends time and space itself', emoji: '⏰', value: 1500, rarity: 1 },
    { id: '12', type: 'legendary', name: 'Infinity Gummy', description: 'Contains infinite sweetness', emoji: '♾️', value: 2000, rarity: 1 },
  ];

  // Gacha pull system - the core addiction mechanic!
  const pullGacha = (type: 'coins' | 'gems') => {
    const cost = type === 'coins' ? 100 : 10;
    const currency = type === 'coins' ? coins : gems;
    
    if (currency < cost) return;
    
    // Update currency
    if (type === 'coins') {
      setCoins(prev => prev - cost);
    } else {
      setGems(prev => prev - 10);
    }
    
    // Roll for collectible
    const roll = Math.random() * 100;
    let selectedCollectible: Collectible;
    
    if (roll < 2) {
      // Legendary (2%)
      selectedCollectible = collectibleDatabase.filter(c => c.type === 'legendary')[Math.floor(Math.random() * 3)];
    } else if (roll < 10) {
      // Epic (8%)
      selectedCollectible = collectibleDatabase.filter(c => c.type === 'epic')[Math.floor(Math.random() * 3)];
    } else if (roll < 30) {
      // Rare (20%)
      selectedCollectible = collectibleDatabase.filter(c => c.type === 'rare')[Math.floor(Math.random() * 3)];
    } else {
      // Common (70%)
      selectedCollectible = collectibleDatabase.filter(c => c.type === 'common')[Math.floor(Math.random() * 3)];
    }
    
    setGachaResult(selectedCollectible);
    setShowGachaModal(true);
    addToInventory(selectedCollectible);
    onCollectibleFound(selectedCollectible);
  };

  const addToInventory = (collectible: Collectible) => {
    setInventory(prev => [...prev, collectible]);
  };

  // Simulate finding collectibles during gameplay
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 3 seconds
        const randomCollectible = collectibleDatabase[Math.floor(Math.random() * collectibleDatabase.length)];
        addToInventory(randomCollectible);
        onCollectibleFound(randomCollectible);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getRarityColor = (type: string) => {
    switch (type) {
      case 'common': return '#95A5A6';
      case 'rare': return '#3498DB';
      case 'epic': return '#9B59B6';
      case 'legendary': return '#F39C12';
      default: return '#95A5A6';
    }
  };

  const getRarityGlow = (type: string) => {
    switch (type) {
      case 'legendary': return '0 0 20px rgba(243, 156, 18, 0.5)';
      case 'epic': return '0 0 15px rgba(155, 89, 182, 0.5)';
      case 'rare': return '0 0 10px rgba(52, 152, 219, 0.5)';
      default: return 'none';
    }
  };

  return (
    <div className="collectible-system">
      {/* Gacha Modal */}
      {showGachaModal && gachaResult && (
        <div className="gacha-modal">
          <div className="gacha-content">
            <div className="gacha-title">🎁 GACHA RESULT! 🎁</div>
            <div 
              className="gacha-result"
              style={{ 
                borderColor: getRarityColor(gachaResult.type),
                boxShadow: getRarityGlow(gachaResult.type)
              }}
            >
              <div className="collectible-emoji">{gachaResult.emoji}</div>
              <div className="collectible-name">{gachaResult.name}</div>
              <div className="collectible-type" style={{ color: getRarityColor(gachaResult.type) }}>
                {gachaResult.type.toUpperCase()}
              </div>
              <div className="collectible-description">{gachaResult.description}</div>
              <div className="collectible-value">+{gachaResult.value} Points</div>
            </div>
            <button 
              className="close-gacha-button"
              onClick={() => setShowGachaModal(false)}
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {/* Gacha Buttons */}
      <div className="gacha-buttons">
        <button 
          className="gacha-button coins"
          onClick={() => pullGacha('coins')}
          disabled={coins < 100}
        >
          <div className="gacha-cost">100 🪙</div>
          <div className="gacha-label">Pull Gacha</div>
        </button>
        
        <button 
          className="gacha-button gems"
          onClick={() => pullGacha('gems')}
          disabled={gems < 10}
        >
          <div className="gacha-cost">10 💎</div>
          <div className="gacha-label">Premium Pull</div>
        </button>
      </div>

      {/* Inventory */}
      <div className="inventory-section">
        <div className="inventory-title">📦 Collection ({inventory.length})</div>
        <div className="inventory-grid">
          {inventory.slice(-12).map((item, index) => (
            <div 
              key={`${item.id}-${index}`}
              className="inventory-item"
              style={{ 
                borderColor: getRarityColor(item.type),
                boxShadow: getRarityGlow(item.type)
              }}
            >
              <div className="item-emoji">{item.emoji}</div>
              <div className="item-name">{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Currency Display */}
      <div className="currency-display">
        <div className="currency-item">
          <span className="currency-icon">🪙</span>
          <span className="currency-amount">{coins.toLocaleString()}</span>
        </div>
        <div className="currency-item">
          <span className="currency-icon">💎</span>
          <span className="currency-amount">{gems}</span>
        </div>
      </div>

      <style jsx>{`
        .collectible-system {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          pointer-events: all;
          max-width: 300px;
        }

        .gacha-modal {
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
        }

        .gacha-content {
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 2rem;
          border-radius: 20px;
          text-align: center;
          color: white;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: bounceIn 0.6s ease;
          max-width: 400px;
        }

        .gacha-title {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 2rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .gacha-result {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 15px;
          border: 3px solid;
          margin-bottom: 2rem;
          animation: pulse 2s infinite;
        }

        .collectible-emoji {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: float 2s ease-in-out infinite;
        }

        .collectible-name {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .collectible-type {
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 1rem;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .collectible-description {
          font-size: 0.9rem;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .collectible-value {
          font-size: 1.2rem;
          font-weight: bold;
          color: #FFD700;
        }

        .close-gacha-button {
          background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
          border: none;
          padding: 1rem 2rem;
          border-radius: 15px;
          color: white;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
          transition: transform 0.3s ease;
        }

        .close-gacha-button:hover {
          transform: translateY(-2px);
        }

        .gacha-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .gacha-button {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .gacha-button.coins {
          background: linear-gradient(135deg, #F39C12, #E67E22);
          color: white;
        }

        .gacha-button.gems {
          background: linear-gradient(135deg, #9B59B6, #8E44AD);
          color: white;
        }

        .gacha-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .gacha-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .gacha-cost {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .gacha-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .inventory-section {
          background: rgba(255, 255, 255, 0.9);
          padding: 1rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          margin-bottom: 1rem;
        }

        .inventory-title {
          font-size: 1.1rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #333;
          text-align: center;
        }

        .inventory-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }

        .inventory-item {
          background: rgba(255, 255, 255, 0.8);
          padding: 0.5rem;
          border-radius: 10px;
          border: 2px solid;
          text-align: center;
          transition: transform 0.3s ease;
        }

        .inventory-item:hover {
          transform: scale(1.05);
        }

        .item-emoji {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .item-name {
          font-size: 0.7rem;
          font-weight: bold;
          color: #333;
        }

        .currency-display {
          display: flex;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.9);
          padding: 0.75rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .currency-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: bold;
          color: #333;
        }

        .currency-icon {
          font-size: 1.2rem;
        }

        .currency-amount {
          font-size: 1rem;
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

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default CollectibleSystem;
