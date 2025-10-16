import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameState, JellyBean, PowerUp } from '../types';

interface GameCanvasProps {
  gameState: GameState;
  onGameStateChange: (newState: Partial<GameState>) => void;
  onScoreUpdate: (score: number) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  gameState, 
  onGameStateChange, 
  onScoreUpdate 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [keys, setKeys] = useState<Set<string>>(new Set());

  // Game constants
  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;
  const DOUBLE_JUMP_FORCE = -12;
  const MOVE_SPEED = 5;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const GROUND_Y = CANVAS_HEIGHT - 50;

  // Initialize jellybean
  const [jellybean, setJellybean] = useState<JellyBean>({
    x: 100,
    y: GROUND_Y - 40,
    vx: 0,
    vy: 0,
    width: 30,
    height: 40,
    onGround: true,
    canDoubleJump: true,
    color: '#ff6b6b'
  });

  // Power-up types and their effects
  const powerUpTypes = {
    doubleJump: { color: '#4ecdc4', effect: 'Double Jump' },
    airTime: { color: '#45b7d1', effect: 'Air Time' },
    speedBoost: { color: '#f9ca24', effect: 'Speed Boost' },
    shield: { color: '#6c5ce7', effect: 'Shield' }
  };

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeys(prev => {
      const newKeys = new Set(prev);
      newKeys.delete(e.key.toLowerCase());
      return newKeys;
    });
  }, []);

  // Mobile/Touch helpers to simulate key presses
  const pressKey = useCallback((key: string) => {
    setKeys(prevKeys => {
      const updated = new Set(prevKeys);
      updated.add(key);
      return updated;
    });
  }, []);

  const releaseKey = useCallback((key: string) => {
    setKeys(prevKeys => {
      const updated = new Set(prevKeys);
      updated.delete(key);
      return updated;
    });
  }, []);

  // Spawn power-ups
  const spawnPowerUp = useCallback(() => {
    const types = Object.keys(powerUpTypes) as Array<keyof typeof powerUpTypes>;
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const newPowerUp: PowerUp = {
      id: Date.now().toString(),
      type: randomType,
      x: Math.random() * (CANVAS_WIDTH - 30),
      y: Math.random() * (GROUND_Y - 100) + 50,
      collected: false,
      duration: 5000 // 5 seconds
    };

    onGameStateChange({
      powerUps: [...gameState.powerUps, newPowerUp]
    });
  }, [gameState.powerUps, onGameStateChange]);

  // Check power-up collection
  const checkPowerUpCollision = useCallback((jellybean: JellyBean, powerUp: PowerUp) => {
    return (
      jellybean.x < powerUp.x + 20 &&
      jellybean.x + jellybean.width > powerUp.x &&
      jellybean.y < powerUp.y + 20 &&
      jellybean.y + jellybean.height > powerUp.y
    );
  }, []);

  // Apply power-up effects
  const applyPowerUp = useCallback((powerUp: PowerUp) => {
    const activePowerUps = new Set(gameState.activePowerUps);
    activePowerUps.add(powerUp.id);

    switch (powerUp.type) {
      case 'doubleJump':
        onGameStateChange({
          doubleJumpAvailable: true,
          activePowerUps
        });
        break;
      case 'airTime':
        onGameStateChange({
          airTimeRemaining: 3000, // 3 seconds
          activePowerUps
        });
        break;
      case 'speedBoost':
        // Speed boost will be handled in movement
        onGameStateChange({ activePowerUps });
        break;
      case 'shield':
        // Shield effect would be handled in collision detection
        onGameStateChange({ activePowerUps });
        break;
    }

    // Remove power-up after collection
    setTimeout(() => {
      onGameStateChange({
        powerUps: gameState.powerUps.filter(p => p.id !== powerUp.id),
        activePowerUps: new Set([...activePowerUps].filter(id => id !== powerUp.id))
      });
    }, powerUp.duration);
  }, [gameState.activePowerUps, gameState.powerUps, onGameStateChange]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying) return;

    setJellybean(prevJellybean => {
      let newJellybean = { ...prevJellybean };

      // Handle input
      if (keys.has('arrowleft') || keys.has('a')) {
        newJellybean.vx = -MOVE_SPEED * (gameState.activePowerUps.has('speedBoost') ? 1.5 : 1);
      } else if (keys.has('arrowright') || keys.has('d')) {
        newJellybean.vx = MOVE_SPEED * (gameState.activePowerUps.has('speedBoost') ? 1.5 : 1);
      } else {
        newJellybean.vx *= 0.8; // Friction
      }

      // Jumping
      if ((keys.has(' ') || keys.has('arrowup') || keys.has('w')) && newJellybean.onGround) {
        newJellybean.vy = JUMP_FORCE;
        newJellybean.onGround = false;
        newJellybean.canDoubleJump = true;
      }

      // Double jump
      if ((keys.has(' ') || keys.has('arrowup') || keys.has('w')) && 
          !newJellybean.onGround && 
          newJellybean.canDoubleJump && 
          (gameState.doubleJumpAvailable || gameState.activePowerUps.has('doubleJump'))) {
        newJellybean.vy = DOUBLE_JUMP_FORCE;
        newJellybean.canDoubleJump = false;
      }

      // Air time power-up (reduces gravity)
      const gravityMultiplier = gameState.airTimeRemaining > 0 ? 0.3 : 1;
      newJellybean.vy += GRAVITY * gravityMultiplier;

      // Update position
      newJellybean.x += newJellybean.vx;
      newJellybean.y += newJellybean.vy;

      // Ground collision
      if (newJellybean.y >= GROUND_Y - newJellybean.height) {
        newJellybean.y = GROUND_Y - newJellybean.height;
        newJellybean.vy = 0;
        newJellybean.onGround = true;
        newJellybean.canDoubleJump = true;
      }

      // Wall collision
      if (newJellybean.x < 0) {
        newJellybean.x = 0;
        newJellybean.vx = 0;
      }
      if (newJellybean.x > CANVAS_WIDTH - newJellybean.width) {
        newJellybean.x = CANVAS_WIDTH - newJellybean.width;
        newJellybean.vx = 0;
      }

      // Check power-up collisions
      gameState.powerUps.forEach(powerUp => {
        if (!powerUp.collected && checkPowerUpCollision(newJellybean, powerUp)) {
          applyPowerUp(powerUp);
          onGameStateChange({
            powerUps: gameState.powerUps.map(p => 
              p.id === powerUp.id ? { ...p, collected: true } : p
            )
          });
        }
      });

      // Update score based on movement
      if (newJellybean.x > prevJellybean.x) {
        onScoreUpdate(gameState.score + 1);
      }

      return newJellybean;
    });

    // Spawn power-ups occasionally
    if (Math.random() < 0.001) {
      spawnPowerUp();
    }

    // Update air time
    if (gameState.airTimeRemaining > 0) {
      onGameStateChange({
        airTimeRemaining: gameState.airTimeRemaining - 16
      });
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, keys, checkPowerUpCollision, applyPowerUp, spawnPowerUp, onGameStateChange, onScoreUpdate]);

  // Start/stop game loop
  useEffect(() => {
    if (gameState.isPlaying) {
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.isPlaying, gameLoop]);

  // Event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw ground
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

    // Draw jellybean
    ctx.fillStyle = jellybean.color;
    ctx.fillRect(jellybean.x, jellybean.y, jellybean.width, jellybean.height);

    // Draw jellybean face
    ctx.fillStyle = '#fff';
    ctx.fillRect(jellybean.x + 8, jellybean.y + 8, 6, 6); // Left eye
    ctx.fillRect(jellybean.x + 16, jellybean.y + 8, 6, 6); // Right eye
    ctx.fillRect(jellybean.x + 10, jellybean.y + 20, 10, 4); // Mouth

    // Draw power-ups
    gameState.powerUps.forEach(powerUp => {
      if (!powerUp.collected) {
        const powerUpInfo = powerUpTypes[powerUp.type];
        ctx.fillStyle = powerUpInfo.color;
        ctx.fillRect(powerUp.x, powerUp.y, 20, 20);
        
        // Draw power-up icon
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('?', powerUp.x + 10, powerUp.y + 14);
      }
    });

    // Draw UI
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 20, 30);
    ctx.fillText(`Level: ${gameState.level}`, 20, 60);
    ctx.fillText(`Lives: ${gameState.lives}`, 20, 90);

    // Draw active power-ups
    let powerUpY = 120;
    gameState.activePowerUps.forEach(powerUpId => {
      const powerUp = gameState.powerUps.find(p => p.id === powerUpId);
      if (powerUp) {
        const powerUpInfo = powerUpTypes[powerUp.type];
        ctx.fillStyle = powerUpInfo.color;
        ctx.fillText(`${powerUpInfo.effect}`, 20, powerUpY);
        powerUpY += 25;
      }
    });

    // Draw air time indicator
    if (gameState.airTimeRemaining > 0) {
      ctx.fillStyle = '#45b7d1';
      ctx.fillText(`Air Time: ${Math.ceil(gameState.airTimeRemaining / 1000)}s`, 20, powerUpY);
    }

  }, [jellybean, gameState]);

  return (
    <div className="game-canvas-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />
      <div className="game-instructions">
        <p>Use WASD or Arrow Keys to move and jump</p>
        <p>Space bar for double jump (when available)</p>
        <p>Collect power-ups to enhance your abilities!</p>
      </div>

      {/* Mobile touch controls (shown on coarse pointers) */}
      <div className="mobile-controls" aria-label="Mobile controls" role="group">
        <div className="control-pad" role="group" aria-label="Move">
          <button
            type="button"
            className="control-btn"
            aria-label="Move left"
            onPointerDown={(e) => { e.preventDefault(); pressKey('arrowleft'); }}
            onPointerUp={(e) => { e.preventDefault(); releaseKey('arrowleft'); }}
            onPointerCancel={(e) => { e.preventDefault(); releaseKey('arrowleft'); }}
            onTouchStart={(e) => { e.preventDefault(); pressKey('arrowleft'); }}
            onTouchEnd={(e) => { e.preventDefault(); releaseKey('arrowleft'); }}
            onTouchCancel={(e) => { e.preventDefault(); releaseKey('arrowleft'); }}
          >
            ◀
          </button>
          <button
            type="button"
            className="control-btn"
            aria-label="Move right"
            onPointerDown={(e) => { e.preventDefault(); pressKey('arrowright'); }}
            onPointerUp={(e) => { e.preventDefault(); releaseKey('arrowright'); }}
            onPointerCancel={(e) => { e.preventDefault(); releaseKey('arrowright'); }}
            onTouchStart={(e) => { e.preventDefault(); pressKey('arrowright'); }}
            onTouchEnd={(e) => { e.preventDefault(); releaseKey('arrowright'); }}
            onTouchCancel={(e) => { e.preventDefault(); releaseKey('arrowright'); }}
          >
            ▶
          </button>
        </div>

        <div className="jump-pad">
          <button
            type="button"
            className="jump-btn"
            aria-label="Jump"
            onPointerDown={(e) => { e.preventDefault(); pressKey(' '); }}
            onPointerUp={(e) => { e.preventDefault(); releaseKey(' '); }}
            onPointerCancel={(e) => { e.preventDefault(); releaseKey(' '); }}
            onTouchStart={(e) => { e.preventDefault(); pressKey(' '); }}
            onTouchEnd={(e) => { e.preventDefault(); releaseKey(' '); }}
            onTouchCancel={(e) => { e.preventDefault(); releaseKey(' '); }}
          >
            ⤴ Jump
          </button>
        </div>
      </div>
      
      <style>{`
        .game-canvas-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
          padding: 1rem;
        }

        .game-canvas {
          border: 3px solid #667eea;
          border-radius: 10px;
          background: #1a1a2e;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 800px;
          height: auto;
          touch-action: none; /* Prevent scroll during gameplay */
        }

        .game-instructions {
          text-align: center;
          color: #666;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .game-instructions p {
          margin: 0.25rem 0;
        }

        /* Mobile touch controls */
        .mobile-controls {
          display: none;
          width: 100%;
          max-width: 800px;
          user-select: none;
          -webkit-user-select: none;
          touch-action: none;
        }

        @media (pointer: coarse) {
          .mobile-controls {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1rem;
            align-items: center;
          }

          .control-pad {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }

          .control-btn {
            padding: 1rem 0;
            background: rgba(255, 255, 255, 0.15);
            border: 2px solid rgba(255, 255, 255, 0.25);
            color: #fff;
            border-radius: 12px;
            font-size: 1.4rem;
            font-weight: 700;
            touch-action: none;
          }

          .jump-pad {
            display: flex;
            justify-content: flex-end;
          }

          .jump-btn {
            width: 100%;
            padding: 0.9rem 1rem;
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            border: none;
            border-radius: 14px;
            color: #fff;
            font-size: 1.1rem;
            font-weight: 800;
            box-shadow: 0 8px 20px rgba(255, 107, 107, 0.25);
            touch-action: none;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .control-btn,
          .jump-btn,
          .game-canvas {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GameCanvas;