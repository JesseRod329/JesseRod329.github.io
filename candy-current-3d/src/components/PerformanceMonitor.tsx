import React, { useState, useEffect } from 'react';

interface PerformanceStats {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  memory: number;
}

const PerformanceMonitor: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    drawCalls: 0,
    triangles: 0,
    memory: 0
  });

  const [showStats, setShowStats] = useState(false);
  const [targetFPS, setTargetFPS] = useState(120);
  const [currentFPS, setCurrentFPS] = useState(0);

  // FPS monitoring using requestAnimationFrame
  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const updateFPS = () => {
      const now = performance.now();
      const delta = now - lastTime;
      const fps = Math.round(1000 / delta);
      
      setCurrentFPS(fps);
      
      // Update stats every 60 frames for performance
      if (frameCount % 60 === 0) {
        setStats({
          fps: fps,
          frameTime: Math.round(delta * 100) / 100,
          drawCalls: Math.floor(Math.random() * 50) + 20, // Simulated
          triangles: Math.floor(Math.random() * 10000) + 5000, // Simulated
          memory: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0
        });
      }
      
      frameCount++;
      lastTime = now;
      requestAnimationFrame(updateFPS);
    };
    
    const animationId = requestAnimationFrame(updateFPS);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Performance optimization based on FPS
  useEffect(() => {
    if (currentFPS < targetFPS * 0.8) {
      console.warn(`Performance warning: ${currentFPS} FPS (target: ${targetFPS})`);
      // Could trigger quality reduction here
    }
  }, [currentFPS, targetFPS]);

  const getFPSColor = () => {
    if (currentFPS >= targetFPS) return '#4CAF50'; // Green
    if (currentFPS >= targetFPS * 0.8) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getPerformanceLevel = () => {
    if (currentFPS >= 120) return 'Ultra';
    if (currentFPS >= 90) return 'High';
    if (currentFPS >= 60) return 'Medium';
    if (currentFPS >= 30) return 'Low';
    return 'Poor';
  };

  return (
    <div className="performance-monitor">
      {/* FPS Counter */}
      <div 
        className="fps-counter"
        style={{ color: getFPSColor() }}
        onClick={() => setShowStats(!showStats)}
      >
        {currentFPS} FPS
      </div>

      {/* Detailed Stats Panel */}
      {showStats && (
        <div className="stats-panel">
          <div className="stats-header">
            <h3>Performance Monitor</h3>
            <button 
              className="close-stats"
              onClick={() => setShowStats(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">FPS</div>
              <div className="stat-value" style={{ color: getFPSColor() }}>
                {stats.fps}
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Frame Time</div>
              <div className="stat-value">
                {stats.frameTime}ms
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Draw Calls</div>
              <div className="stat-value">
                {stats.drawCalls}
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Triangles</div>
              <div className="stat-value">
                {stats.triangles.toLocaleString()}
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Memory</div>
              <div className="stat-value">
                {stats.memory.toFixed(1)} MB
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Performance</div>
              <div className="stat-value">
                {getPerformanceLevel()}
              </div>
            </div>
          </div>
          
          <div className="performance-tips">
            <h4>Optimization Tips:</h4>
            <ul>
              {currentFPS < 60 && (
                <li>Reduce shadow quality</li>
              )}
              {currentFPS < 90 && (
                <li>Lower particle count</li>
              )}
              {currentFPS < 120 && (
                <li>Disable post-processing</li>
              )}
              {stats.drawCalls > 100 && (
                <li>Use instanced rendering</li>
              )}
              {stats.memory > 100 && (
                <li>Clear unused textures</li>
              )}
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`
        .performance-monitor {
          position: fixed;
          top: 10px;
          left: 10px;
          z-index: 10000;
          font-family: 'Courier New', monospace;
        }

        .fps-counter {
          background: rgba(0, 0, 0, 0.8);
          color: #4CAF50;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .fps-counter:hover {
          background: rgba(0, 0, 0, 0.9);
          border-color: currentColor;
        }

        .stats-panel {
          position: absolute;
          top: 100%;
          left: 0;
          background: rgba(0, 0, 0, 0.95);
          color: white;
          padding: 1rem;
          border-radius: 10px;
          min-width: 300px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          animation: slideDown 0.3s ease;
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #333;
        }

        .stats-header h3 {
          margin: 0;
          font-size: 1.1rem;
        }

        .close-stats {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.25rem;
        }

        .close-stats:hover {
          color: #ff6b6b;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #ccc;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: bold;
        }

        .performance-tips {
          border-top: 1px solid #333;
          padding-top: 1rem;
        }

        .performance-tips h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          color: #4CAF50;
        }

        .performance-tips ul {
          margin: 0;
          padding-left: 1rem;
        }

        .performance-tips li {
          font-size: 0.8rem;
          color: #ccc;
          margin-bottom: 0.25rem;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .stats-panel {
            min-width: 250px;
            left: -100px;
          }
        }
      `}</style>
    </div>
  );
};

export default PerformanceMonitor;
