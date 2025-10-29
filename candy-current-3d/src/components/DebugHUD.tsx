import React, { useState, useEffect, useRef } from 'react';
import './DebugHUD.css';

interface DebugHUDProps {
  playerRef: React.RefObject<any>;
  gameScore: number;
  lives: number;
  level: number;
  pelletsCollected: number;
  totalPellets: number;
  timeElapsed: number;
}

interface PerformanceStats {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  memory: number;
}

const DebugHUD: React.FC<DebugHUDProps> = ({
  playerRef,
  gameScore,
  lives,
  level,
  pelletsCollected,
  totalPellets,
  timeElapsed
}) => {
  const [showDebug, setShowDebug] = useState(false);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    drawCalls: 0,
    triangles: 0,
    memory: 0
  });
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);

  // F1 toggle for debug mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'F1') {
        event.preventDefault();
        setShowDebug(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Performance monitoring using requestAnimationFrame instead of useFrame
  useEffect(() => {
    if (!showDebug) return;

    let animationFrameId: number;

    const updatePerformance = () => {
      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;
      frameCountRef.current++;

      // Calculate FPS every 60 frames
      if (frameCountRef.current >= 60) {
        const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
        fpsHistoryRef.current.push(fps);
        
        // Keep only last 60 FPS readings for average
        if (fpsHistoryRef.current.length > 60) {
          fpsHistoryRef.current.shift();
        }

        const avgFps = Math.round(
          fpsHistoryRef.current.reduce((sum, fps) => sum + fps, 0) / fpsHistoryRef.current.length
        );

        setPerformanceStats(prev => ({
          ...prev,
          fps: avgFps,
          frameTime: Math.round(deltaTime / frameCountRef.current * 100) / 100
        }));

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      // Simulate draw calls and triangles (would need access to renderer in real implementation)
      setPerformanceStats(prev => ({
        ...prev,
        drawCalls: Math.floor(Math.random() * 50) + 20, // Simulated
        triangles: Math.floor(Math.random() * 10000) + 5000, // Simulated
        memory: Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024) || 0
      }));

      animationFrameId = requestAnimationFrame(updatePerformance);
    };

    animationFrameId = requestAnimationFrame(updatePerformance);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [showDebug]);

  if (!showDebug) return null;

  const playerPosition = playerRef.current?.position || { x: 0, y: 0, z: 0 };
  const playerVelocity = playerRef.current?.velocity || [0, 0, 0];
  const playerIsGrounded = playerRef.current?.isGrounded || false;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const formatVector3 = (vec: any) => {
    if (!vec) return 'N/A';
    if (Array.isArray(vec)) {
      return `(${vec[0].toFixed(2)}, ${vec[1].toFixed(2)}, ${vec[2].toFixed(2)})`;
    }
    return `(${vec.x?.toFixed(2) || '0'}, ${vec.y?.toFixed(2) || '0'}, ${vec.z?.toFixed(2) || '0'})`;
  };

  const getFpsColor = (fps: number) => {
    if (fps >= 100) return '#4CAF50'; // Green
    if (fps >= 60) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  return (
    <div className="debug-hud">
      <div className="debug-header">
        <h3>🎮 Debug Console (F1 to toggle)</h3>
        <div className="debug-status">
          <span className={`fps-indicator ${performanceStats.fps >= 60 ? 'good' : 'poor'}`}>
            FPS: {performanceStats.fps}
          </span>
        </div>
      </div>

      <div className="debug-grid">
        {/* Performance Stats */}
        <div className="debug-section">
          <h4>📊 Performance</h4>
          <div className="debug-item">
            <span className="debug-label">FPS:</span>
            <span className="debug-value" style={{ color: getFpsColor(performanceStats.fps) }}>
              {performanceStats.fps}
            </span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Frame Time:</span>
            <span className="debug-value">{performanceStats.frameTime}ms</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Draw Calls:</span>
            <span className="debug-value">{performanceStats.drawCalls}</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Triangles:</span>
            <span className="debug-value">{performanceStats.triangles.toLocaleString()}</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Memory:</span>
            <span className="debug-value">{performanceStats.memory}MB</span>
          </div>
        </div>

        {/* Player State */}
        <div className="debug-section">
          <h4>🎯 Player State</h4>
          <div className="debug-item">
            <span className="debug-label">Position:</span>
            <span className="debug-value">{formatVector3(playerPosition)}</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Velocity:</span>
            <span className="debug-value">{formatVector3(playerVelocity)}</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Grounded:</span>
            <span className={`debug-value ${playerIsGrounded ? 'grounded' : 'airborne'}`}>
              {playerIsGrounded ? '✓' : '✗'}
            </span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Speed:</span>
            <span className="debug-value">
              {Array.isArray(playerVelocity) 
                ? Math.sqrt(playerVelocity[0]**2 + playerVelocity[1]**2 + playerVelocity[2]**2).toFixed(2)
                : '0.00'
              } m/s
            </span>
          </div>
        </div>

        {/* Game State */}
        <div className="debug-section">
          <h4>🎮 Game State</h4>
          <div className="debug-item">
            <span className="debug-label">Score:</span>
            <span className="debug-value">{gameScore}</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Lives:</span>
            <span className="debug-value">{lives}</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Level:</span>
            <span className="debug-value">{level}</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Pellets:</span>
            <span className="debug-value">{pelletsCollected}/{totalPellets}</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Time:</span>
            <span className="debug-value">{formatTime(timeElapsed)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="debug-section">
          <h4>⌨️ Controls</h4>
          <div className="debug-item">
            <span className="debug-label">Movement:</span>
            <span className="debug-value">WASD/Arrows</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Jump:</span>
            <span className="debug-value">Space</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Dash:</span>
            <span className="debug-value">Shift</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Camera:</span>
            <span className="debug-value">C (modes), R (reset)</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Orbit:</span>
            <span className="debug-value">Middle Mouse</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Zoom:</span>
            <span className="debug-value">Mouse Wheel</span>
          </div>
        </div>
      </div>

      {/* Performance Warning */}
      {performanceStats.fps < 60 && (
        <div className="performance-warning">
          ⚠️ Performance below 60 FPS - Consider reducing quality settings
        </div>
      )}
    </div>
  );
};

export default DebugHUD;
