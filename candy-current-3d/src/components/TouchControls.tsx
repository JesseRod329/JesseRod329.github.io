import React, { useState, useRef, useEffect } from 'react';

interface TouchControlsProps {
  onMove: (direction: 'left' | 'right' | 'forward' | 'backward' | null) => void;
  onJump: () => void;
  onSlide: () => void;
  onDash?: () => void;
}

const TouchControls: React.FC<TouchControlsProps> = ({ onMove, onJump, onSlide, onDash }) => {
  const [isMoving, setIsMoving] = useState(false);
  const [moveDirection, setMoveDirection] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });

  // Handle joystick movement
  const handleJoystickMove = (clientX: number, clientY: number) => {
    if (!joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = rect.width / 2;

    if (distance <= maxDistance) {
      setJoystickPosition({ x: deltaX, y: deltaY });
      
      // Determine movement direction
      const angle = Math.atan2(deltaY, deltaX);
      const degrees = (angle * 180) / Math.PI;
      
      let direction: 'left' | 'right' | 'forward' | 'backward' | null = null;
      
      if (degrees >= -45 && degrees <= 45) {
        direction = 'right';
      } else if (degrees >= 45 && degrees <= 135) {
        direction = 'backward';
      } else if (degrees >= 135 || degrees <= -135) {
        direction = 'left';
      } else if (degrees >= -135 && degrees <= -45) {
        direction = 'forward';
      }
      
      setMoveDirection(direction);
      onMove(direction);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsMoving(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchStart) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 10) { // Minimum movement threshold
      handleJoystickMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setTouchStart(null);
    setIsMoving(false);
    setMoveDirection(null);
    setJoystickPosition({ x: 0, y: 0 });
    onMove(null);
  };

  const handleJumpTouch = () => {
    onJump();
  };

  const handleSlideTouch = () => {
    onSlide();
  };

  return (
    <div className="touch-controls">
      {/* Virtual Joystick */}
      <div className="joystick-container">
        <div 
          ref={joystickRef}
          className="joystick-base"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="joystick-knob"
            style={{
              transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
              opacity: isMoving ? 1 : 0.7
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="action-button jump-button"
          onTouchStart={handleJumpTouch}
          onMouseDown={handleJumpTouch}
        >
          <div className="button-icon">↑</div>
          <div className="button-label">JUMP</div>
        </button>
        
        <button 
          className="action-button slide-button"
          onTouchStart={handleSlideTouch}
          onMouseDown={handleSlideTouch}
        >
          <div className="button-icon">↓</div>
          <div className="button-label">SLIDE</div>
        </button>
        
        {onDash && (
          <button 
            className="action-button dash-button"
            onTouchStart={(e) => {
              e.preventDefault();
              onDash();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              onDash();
            }}
          >
            <div className="button-icon">⚡</div>
            <div className="button-label">DASH</div>
          </button>
        )}
      </div>

      <style jsx>{`
        .touch-controls {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          pointer-events: none;
          z-index: 1000;
        }

        .joystick-container {
          position: absolute;
          bottom: 20px;
          left: 20px;
          width: 120px;
          height: 120px;
          pointer-events: all;
        }

        .joystick-base {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          border: 3px solid rgba(255, 255, 255, 0.5);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .joystick-knob {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
          border: 2px solid rgba(255, 255, 255, 0.8);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: opacity 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .action-buttons {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          pointer-events: all;
        }

        .action-button {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #4ECDC4, #44A08D);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .action-button:active {
          transform: scale(0.95);
          box-shadow: 0 2px 10px rgba(78, 205, 196, 0.5);
        }

        .jump-button {
          background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .jump-button:active {
          box-shadow: 0 2px 10px rgba(255, 107, 107, 0.5);
        }

        .slide-button {
          background: linear-gradient(135deg, #F9CA24, #F0932B);
          box-shadow: 0 4px 15px rgba(249, 202, 36, 0.3);
        }

        .slide-button:active {
          box-shadow: 0 2px 10px rgba(249, 202, 36, 0.5);
        }

        .dash-button {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }

        .dash-button:active {
          box-shadow: 0 2px 10px rgba(255, 215, 0, 0.5);
        }

        .button-icon {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 2px;
        }

        .button-label {
          font-size: 10px;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .joystick-container {
            width: 100px;
            height: 100px;
          }
          
          .joystick-knob {
            width: 35px;
            height: 35px;
          }
          
          .action-button {
            width: 70px;
            height: 70px;
          }
          
          .button-icon {
            font-size: 20px;
          }
          
          .button-label {
            font-size: 9px;
          }
        }

        @media (max-width: 480px) {
          .joystick-container {
            width: 90px;
            height: 90px;
          }
          
          .joystick-knob {
            width: 30px;
            height: 30px;
          }
          
          .action-button {
            width: 60px;
            height: 60px;
          }
          
          .button-icon {
            font-size: 18px;
          }
          
          .button-label {
            font-size: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default TouchControls;
