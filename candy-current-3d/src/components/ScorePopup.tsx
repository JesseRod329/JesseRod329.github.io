import React, { useState, useEffect } from 'react';
import './ScorePopup.css';

interface ScorePopupProps {
  score: number;
  position: { x: number; y: number };
  duration?: number;
}

const ScorePopup: React.FC<ScorePopupProps> = ({ score, position, duration = 2000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div 
      className="score-popup"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      +{score}
    </div>
  );
};

export default ScorePopup;



