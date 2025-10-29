import React, { useRef, useEffect, useCallback } from 'react';
import { GameState } from '../types';

interface GameCanvasProps {
  gameState: GameState;
  onGameStateChange: (newState: Partial<GameState>) => void;
  onScoreUpdate: (score: number) => void;
}

type Platform = { x: number; y: number; w: number; h: number; color: string; type: 'normal' | 'bouncy' | 'ground' };
type Candy = { x: number; y: number; collected: boolean; type: 'pink' | 'blue' | 'yellow' };
type GummyBear = { x: number; y: number; collected: boolean };
type Lollipop = { x: number; y: number; collected: boolean };
type Enemy = { x: number; y: number; vx: number; range: number; startX: number };
type Particle = { x: number; y: number; vx: number; vy: number; color: string; life: number };

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;

const GRAVITY = 0.6;
const JUMP_FORCE = -13;
const MOVE_SPEED = 6;
const PLAYER_SIZE = 45;

// Responsive canvas dimensions
let canvasWidth = CANVAS_WIDTH;
let canvasHeight = CANVAS_HEIGHT;
let scaleX = 1;
let scaleY = 1;

// Detect mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onGameStateChange, onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // inputs - use refs for immediate access in game loop
  const keysRef = useRef<Set<string>>(new Set());

  // world state kept in refs to avoid React re-renders per frame
  const playerRef = useRef({ x: 100, y: 300, vx: 0, vy: 0, onGround: false, color: '#90EE90', bounceTime: 0 });
  const platformsRef = useRef<Platform[]>([]);
  const candiesRef = useRef<Candy[]>([]);
  const gummyRef = useRef<GummyBear[]>([]);
  const lollipopsRef = useRef<Lollipop[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const cameraXRef = useRef<number>(0);

  const dprRef = useRef<number>(1);

  const initLevel = useCallback(() => {
    const baseY = 550;
    platformsRef.current = [
      { x: 0, y: baseY, w: 300, h: 30, color: '#FF69B4', type: 'normal' },
      { x: 350, y: baseY - 80, w: 180, h: 30, color: '#FFD700', type: 'normal' },
      { x: 600, y: baseY - 150, w: 160, h: 30, color: '#FF69B4', type: 'bouncy' },
      { x: 820, y: baseY - 100, w: 180, h: 30, color: '#87CEEB', type: 'normal' },
      { x: 1050, y: baseY - 180, w: 150, h: 30, color: '#FFD700', type: 'normal' },
      { x: 1250, y: baseY - 250, w: 200, h: 30, color: '#FF69B4', type: 'bouncy' },
      { x: 1500, y: baseY - 150, w: 180, h: 30, color: '#87CEEB', type: 'normal' },
      { x: 1750, y: baseY - 220, w: 160, h: 30, color: '#FFD700', type: 'normal' },
      { x: 2000, y: baseY - 300, w: 200, h: 30, color: '#FF69B4', type: 'bouncy' },
      { x: 0, y: baseY + 50, w: 2500, h: 50, color: '#DDA0DD', type: 'ground' }
    ];

    candiesRef.current = [
      { x: 400, y: baseY - 150, collected: false, type: 'pink' },
      { x: 680, y: baseY - 220, collected: false, type: 'blue' },
      { x: 900, y: baseY - 170, collected: false, type: 'pink' },
      { x: 1120, y: baseY - 260, collected: false, type: 'yellow' },
      { x: 1320, y: baseY - 330, collected: false, type: 'blue' },
      { x: 1600, y: baseY - 230, collected: false, type: 'pink' },
      { x: 1850, y: baseY - 300, collected: false, type: 'yellow' },
      { x: 2100, y: baseY - 380, collected: false, type: 'blue' }
    ];

    gummyRef.current = [
      { x: 530, y: baseY - 200, collected: false },
      { x: 1180, y: baseY - 310, collected: false },
      { x: 1900, y: baseY - 350, collected: false }
    ];

    lollipopsRef.current = [
      { x: 750, y: baseY - 250, collected: false },
      { x: 1400, y: baseY - 380, collected: false }
    ];

    enemiesRef.current = [
      { x: 500, y: baseY - 110, vx: 2, range: 150, startX: 500 },
      { x: 1100, y: baseY - 210, vx: -2, range: 120, startX: 1100 },
      { x: 1650, y: baseY - 180, vx: 2, range: 180, startX: 1650 }
    ];

    const p = playerRef.current;
    p.x = 100; p.y = 300; p.vx = 0; p.vy = 0; p.onGround = false; p.bounceTime = 0;
    cameraXRef.current = 0;
  }, []);

  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        color,
        life: 30
      });
    }
    particlesRef.current = particlesRef.current.concat(newParticles);
  }, []);

  // inputs
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    keysRef.current.add(k);
    if (k === ' ' || k === 'arrowup' || k === 'w') e.preventDefault();
  }, []);
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    keysRef.current.delete(k);
  }, []);

  // rAF loop with dt
  const loop = useCallback((t: number) => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) {
      rafRef.current = requestAnimationFrame(loop);
      lastTimeRef.current = t;
      render();
      return;
    }

    const prev = lastTimeRef.current || t;
    const dt = Math.min(1 / 30, Math.max(0, (t - prev) / 1000));
    lastTimeRef.current = t;

    update(dt);
    render();
    rafRef.current = requestAnimationFrame(loop);
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver]);

  // update world
  const update = (_dt: number) => {
    const player = playerRef.current;
    const speed = MOVE_SPEED;
    const currentKeys = keysRef.current; // Use ref for immediate access

    if (currentKeys.has('arrowleft') || currentKeys.has('a')) player.vx = -speed;
    else if (currentKeys.has('arrowright') || currentKeys.has('d')) player.vx = speed;
    else player.vx *= 0.8;

    if ((currentKeys.has(' ') || currentKeys.has('arrowup') || currentKeys.has('w')) && player.onGround) {
      player.vy = JUMP_FORCE;
      player.onGround = false;
    }

    player.vy += GRAVITY;
    player.x += player.vx;
    player.y += player.vy;
    if (player.x < 0) player.x = 0;

    player.onGround = false;
    player.bounceTime = Math.max(0, player.bounceTime - 1);

    // platform collisions
    platformsRef.current.forEach(pl => {
      if (
        player.x + PLAYER_SIZE > pl.x &&
        player.x < pl.x + pl.w &&
        player.y + PLAYER_SIZE > pl.y &&
        player.y + PLAYER_SIZE < pl.y + pl.h + 15 &&
        player.vy > 0
      ) {
        player.y = pl.y - PLAYER_SIZE;
        if (pl.type === 'bouncy') {
          player.vy = JUMP_FORCE * 1.3;
          player.bounceTime = 10;
          createParticles(player.x + PLAYER_SIZE / 2, player.y + PLAYER_SIZE, '#FFD700');
        } else {
          player.vy = 0;
        }
        player.onGround = true;
      }
    });

    // fall off world
    if (player.y > CANVAS_HEIGHT + 50) {
      onGameStateChange({ lives: Math.max(0, gameState.lives - 1) });
      if (gameState.lives - 1 <= 0) {
        onGameStateChange({ isPlaying: false, isGameOver: true });
      }
      player.x = 100; player.y = 300; player.vx = 0; player.vy = 0;
    }

    // candies
    candiesRef.current = candiesRef.current.map(c => {
      if (!c.collected && Math.abs(player.x + PLAYER_SIZE / 2 - c.x) < 35 && Math.abs(player.y + PLAYER_SIZE / 2 - c.y) < 35) {
        const pts = c.type === 'yellow' ? 150 : c.type === 'blue' ? 120 : 100;
        // Add combo bonus
        const comboBonus = gameState.score > 0 ? Math.floor(gameState.score / 100) * 5 : 0;
        onScoreUpdate(gameState.score + pts + comboBonus);
        createParticles(c.x, c.y, c.type === 'yellow' ? '#FFD700' : c.type === 'blue' ? '#87CEEB' : '#FF69B4');
        return { ...c, collected: true };
      }
      return c;
    });

    // gummy bears
    gummyRef.current = gummyRef.current.map(g => {
      if (!g.collected && Math.abs(player.x + PLAYER_SIZE / 2 - g.x) < 40 && Math.abs(player.y + PLAYER_SIZE / 2 - g.y) < 40) {
        onScoreUpdate(gameState.score + 250);
        createParticles(g.x, g.y, '#90EE90');
        return { ...g, collected: true };
      }
      return g;
    });

    // lollipops => extra life
    lollipopsRef.current = lollipopsRef.current.map(l => {
      if (!l.collected && Math.abs(player.x + PLAYER_SIZE / 2 - l.x) < 40 && Math.abs(player.y + PLAYER_SIZE / 2 - l.y) < 40) {
        onGameStateChange({ lives: Math.min(5, gameState.lives + 1) });
        createParticles(l.x, l.y, '#FF1493');
        return { ...l, collected: true };
      }
      return l;
    });

    // enemies
    enemiesRef.current = enemiesRef.current.map(e => {
      e.x += e.vx;
      if (Math.abs(e.x - e.startX) > e.range) e.vx *= -1;
      if (Math.abs(player.x + PLAYER_SIZE / 2 - e.x) < 40 && Math.abs(player.y + PLAYER_SIZE / 2 - e.y) < 40) {
        const newLives = Math.max(0, gameState.lives - 1);
        onGameStateChange({ lives: newLives });
        if (newLives <= 0) onGameStateChange({ isPlaying: false, isGameOver: true });
        player.x = 100; player.y = 300; player.vx = 0; player.vy = 0;
      }
      return e;
    });

    // particles
    particlesRef.current = particlesRef.current
      .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.3, life: p.life - 1 }))
      .filter(p => p.life > 0);

    // camera follow (using scaled canvas width)
    const scaledCanvasWidth = canvasWidth || CANVAS_WIDTH;
    const target = player.x - scaledCanvasWidth * 0.33;
    cameraXRef.current += (target - cameraXRef.current) * 0.08;
    cameraXRef.current = Math.max(0, Math.min(cameraXRef.current, 2500 - scaledCanvasWidth));
  };

  // render world
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaledWidth = canvasWidth || CANVAS_WIDTH;
    const scaledHeight = canvasHeight || CANVAS_HEIGHT;

    // sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, scaledHeight);
    gradient.addColorStop(0, '#FFE6F0');
    gradient.addColorStop(0.3, '#B0E0E6');
    gradient.addColorStop(0.7, '#E6E6FA');
    gradient.addColorStop(1, '#FFB6C1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, scaledWidth, scaledHeight);

    ctx.save();
    ctx.translate(-Math.floor(cameraXRef.current), 0);

    // platforms
    platformsRef.current.forEach(pl => {
      ctx.fillStyle = pl.color;
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 12;
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.shadowBlur = 0;
      if (pl.type === 'bouncy') {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(pl.x + pl.w / 4 + i * pl.w / 4, pl.y + 15, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // candies
    candiesRef.current.forEach(c => {
      if (!c.collected) {
        const colors = { pink: '#FF69B4', blue: '#87CEEB', yellow: '#FFD700' } as const;
        ctx.fillStyle = colors[c.type];
        ctx.shadowColor = colors[c.type];
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(c.x - 5, c.y - 5, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // gummy bears
    gummyRef.current.forEach(b => {
      if (!b.collected) {
        ctx.fillStyle = '#90EE90';
        ctx.shadowColor = '#90EE90';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(b.x, b.y - 10, 12, 0, Math.PI * 2);
        ctx.arc(b.x - 8, b.y - 12, 8, 0, Math.PI * 2);
        ctx.arc(b.x + 8, b.y - 12, 8, 0, Math.PI * 2);
        ctx.arc(b.x, b.y + 5, 15, 0, Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // lollipops
    lollipopsRef.current.forEach(l => {
      if (!l.collected) {
        ctx.strokeStyle = '#DDA0DD';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(l.x, l.y + 15);
        ctx.lineTo(l.x, l.y + 35);
        ctx.stroke();

        const grad = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, 18);
        grad.addColorStop(0, '#FF1493');
        grad.addColorStop(0.5, '#FF69B4');
        grad.addColorStop(1, '#FFB6C1');
        ctx.fillStyle = grad;
        ctx.shadowColor = '#FF1493';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(l.x, l.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(l.x, l.y, 12, 0, Math.PI * 1.5);
        ctx.stroke();
      }
    });

    // enemies
    enemiesRef.current.forEach(e => {
      ctx.fillStyle = '#8B0000';
      ctx.shadowColor = '#8B0000';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(e.x, e.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.arc(e.x - 6, e.y - 4, 4, 0, Math.PI * 2);
      ctx.arc(e.x + 6, e.y - 4, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // particles
    particlesRef.current.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / 30;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // player
    const p = playerRef.current;
    const jellybeanGrad = ctx.createRadialGradient(p.x + PLAYER_SIZE / 2, p.y + PLAYER_SIZE / 2, 5, p.x + PLAYER_SIZE / 2, p.y + PLAYER_SIZE / 2, PLAYER_SIZE / 2);
    jellybeanGrad.addColorStop(0, '#B4FFB4');
    jellybeanGrad.addColorStop(0.7, p.color);
    jellybeanGrad.addColorStop(1, '#4CAF50');
    ctx.fillStyle = jellybeanGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    const squish = p.bounceTime > 0 ? 1.2 : (p.onGround ? 0.95 : 1.05);
    ctx.ellipse(p.x + PLAYER_SIZE / 2, p.y + PLAYER_SIZE / 2, PLAYER_SIZE / 2, (PLAYER_SIZE / 2) * squish, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(p.x + 16, p.y + 18, 5, 0, Math.PI * 2);
    ctx.arc(p.x + 29, p.y + 18, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(p.x + 18, p.y + 16, 2, 0, Math.PI * 2);
    ctx.arc(p.x + 31, p.y + 16, 2, 0, Math.PI * 2);
    ctx.fill();

    // smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(p.x + PLAYER_SIZE / 2, p.y + 28, 10, 0, Math.PI);
    ctx.stroke();

    ctx.restore();
  };

  // Resize canvas for responsiveness
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get container dimensions
    const container = canvas.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    
    // Use actual viewport dimensions for mobile
    if (isMobile) {
      canvasWidth = window.innerWidth || document.documentElement.clientWidth;
      canvasHeight = window.innerHeight || document.documentElement.clientHeight;
      
      // Use dynamic viewport height if available
      if (window.visualViewport) {
        canvasHeight = window.visualViewport.height;
      } else {
        canvasHeight = window.innerHeight;
      }
      
      // Ensure we don't exceed viewport
      canvasWidth = Math.min(canvasWidth, screen.width);
      canvasHeight = Math.min(canvasHeight, screen.height);
    } else {
      canvasWidth = Math.min(CANVAS_WIDTH, containerRect.width);
      canvasHeight = Math.min(CANVAS_HEIGHT, containerRect.height);
    }

    scaleX = canvasWidth / CANVAS_WIDTH;
    scaleY = canvasHeight / CANVAS_HEIGHT;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    dprRef.current = dpr;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    ctx.setTransform(dpr * scaleX, 0, 0, dpr * scaleY, 0, 0);
  }, []);

  // set up canvas DPR and responsive sizing
  useEffect(() => {
    resizeCanvas();
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', () => {
      setTimeout(resizeCanvas, 100);
    });
    
    // Handle visual viewport changes (mobile browser UI)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        setTimeout(resizeCanvas, 50);
      });
    }
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', resizeCanvas);
      }
    };
  }, [resizeCanvas]);

  // init level on mount or when a new game starts
  useEffect(() => {
    initLevel();
  }, [initLevel]);

  // detect a fresh new game (avoid triggering on pause/resume)
  useEffect(() => {
    if (gameState.isPlaying && gameState.score === 0 && gameState.level === 1 && gameState.lives === 3) {
      initLevel();
    }
  }, [gameState.isPlaying, gameState.score, gameState.level, gameState.lives, initLevel]);

  // rAF lifecycle
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [loop]);

  // keyboard lifecycle
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // mobile touch controls
  const setKeyHeld = (key: string, held: boolean) => {
    if (held) {
      keysRef.current.add(key);
    } else {
      keysRef.current.delete(key);
    }
  };

  return (
    <div className="game-canvas-container">
      <canvas ref={canvasRef} className="game-canvas" />

      <div className="mobile-controls">
        <button className="btn left" onMouseDown={() => setKeyHeld('arrowleft', true)} onMouseUp={() => setKeyHeld('arrowleft', false)} onMouseLeave={() => setKeyHeld('arrowleft', false)}
          onTouchStart={(e) => { e.preventDefault(); setKeyHeld('arrowleft', true); }} onTouchEnd={(e) => { e.preventDefault(); setKeyHeld('arrowleft', false); }}>← LEFT</button>
        <button className="btn jump" onMouseDown={() => setKeyHeld(' ', true)} onMouseUp={() => setKeyHeld(' ', false)} onMouseLeave={() => setKeyHeld(' ', false)}
          onTouchStart={(e) => { e.preventDefault(); setKeyHeld(' ', true); }} onTouchEnd={(e) => { e.preventDefault(); setKeyHeld(' ', false); }}>↑ JUMP</button>
        <button className="btn right" onMouseDown={() => setKeyHeld('arrowright', true)} onMouseUp={() => setKeyHeld('arrowright', false)} onMouseLeave={() => setKeyHeld('arrowright', false)}
          onTouchStart={(e) => { e.preventDefault(); setKeyHeld('arrowright', true); }} onTouchEnd={(e) => { e.preventDefault(); setKeyHeld('arrowright', false); }}>RIGHT →</button>
      </div>

      <div className="game-instructions">
        <p>Use Arrow Keys / WASD to move and jump • Space to jump</p>
        <p>Collect candies and bears, avoid enemies, reach higher platforms</p>
      </div>
      
      <style>{`
        .game-canvas-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
          max-width: ${CANVAS_WIDTH}px;
        }
        .game-canvas {
          width: 100%;
          max-width: ${CANVAS_WIDTH}px;
          height: auto;
          aspect-ratio: ${CANVAS_WIDTH} / ${CANVAS_HEIGHT};
          border: 4px solid #a78bfa;
          border-radius: 16px;
          background: linear-gradient(to bottom, #e0f2fe, #ede9fe);
          box-shadow: inset 0 0 12px rgba(0,0,0,0.15), 0 20px 40px rgba(0,0,0,0.25);
          touch-action: none;
        }
        @media (max-width: 768px) {
          .game-canvas {
            width: 100vw;
            max-width: 100vw;
            height: 100vh;
            height: 100dvh;
            aspect-ratio: auto;
            border-radius: 0;
            border: none;
          }
          .game-canvas-container {
            max-width: 100%;
            padding: 0;
            gap: 0.5rem;
          }
        }
        .mobile-controls {
          display: none;
          gap: 12px;
          position: fixed;
          bottom: max(20px, env(safe-area-inset-bottom, 0px));
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          padding: 0 20px;
          width: 100%;
          max-width: 400px;
          justify-content: center;
        }
        @media (max-width: 768px) {
          .mobile-controls {
            display: flex;
          }
        }
        .btn {
          background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
          border: 1px solid rgba(0,0,0,0.08);
          color: #1f2937;
          padding: 12px 16px;
          border-radius: 9999px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          min-width: 70px;
          min-height: 44px;
        }
        @media (max-width: 480px) {
          .btn {
            padding: 10px 14px;
            font-size: 0.9rem;
            min-width: 60px;
          }
        }
        .btn:hover { transform: translateY(-1px); }
        .btn:active { transform: translateY(1px) scale(0.95); }
        .jump { background: linear-gradient(135deg, #34d399, #059669); color: white; }
        .left, .right { background: linear-gradient(135deg, #6b7280, #374151); color: white; }
        .game-instructions { 
          color: #4b5563; 
          font-size: 0.9rem; 
          text-align: center;
          padding: 0 1rem;
        }
        @media (max-width: 768px) {
          .game-instructions {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default GameCanvas;