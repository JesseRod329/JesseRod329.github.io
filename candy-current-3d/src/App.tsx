import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import * as THREE from 'three';
import EnhancedPacmanCharacter from './components/EnhancedPacmanCharacter';
import EnhancedPacmanMaze from './components/EnhancedPacmanMaze';
import EnhancedGhost from './components/EnhancedGhost';
import SoundSystem from './components/SoundSystem';
import GameHUD from './components/GameHUD';
import CameraController from './components/CameraController';
import DebugHUD from './components/DebugHUD';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { useGameState } from './hooks/useGameState';
import { useInput } from './hooks/useInput';
import './App.css';

function App() {
  // Use custom hooks for state management
  const [gameState, gameActions] = useGameState();
  const [inputState, inputActions] = useInput(gameState.isPaused);
  
  // Player ref for camera
  const playerRef = useRef<any>(null);
  
  // Pac-Man game state
  const [pacmanState, setPacmanState] = useState({
    score: 0,
    lives: 3,
    isPoweredUp: false,
    pelletsCollected: 0,
    totalPellets: 100 // Set initial total pellets count
  });

  // Handle input events
  React.useEffect(() => {
    if (inputState.pause) {
      if (gameState.isPaused) {
        gameActions.resumeGame();
      } else {
        gameActions.pauseGame();
      }
    }
  }, [inputState.pause, gameState.isPaused, gameActions]);

  // Handle loading complete
  const handleLoadingComplete = React.useCallback(() => {
    gameActions.startGame();
  }, [gameActions]);

  // Handle score update
  const handleScoreUpdate = React.useCallback((newScore: number) => {
    gameActions.updateScore(newScore);
  }, [gameActions]);

  // Handle pellet collection
  const handlePelletCollected = React.useCallback((type: string) => {
    gameActions.collectPellet(type);
    setPacmanState(prev => ({
      ...prev,
      pelletsCollected: prev.pelletsCollected + 1,
      isPoweredUp: type === 'power' ? true : prev.isPoweredUp
    }));
  }, [gameActions]);

  // Handle platform reached
  const handlePlatformReached = React.useCallback((platformId: string) => {
    console.log(`Reached platform: ${platformId}`);
  }, []);

  // Handle player caught by ghost
  const handlePlayerCaught = React.useCallback(() => {
    setPacmanState(prev => ({
      ...prev,
      lives: prev.lives - 1,
      isPoweredUp: false
    }));
    
    if (pacmanState.lives <= 1) {
      // Game over
      gameActions.pauseGame();
    }
  }, [pacmanState.lives, gameActions]);

  if (gameState.isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <ErrorBoundary>
      <div className="app">
                <Canvas
                  camera={{ position: [0, 20, 10], fov: 60 }}
                  shadows
                  gl={{ 
                    antialias: true, 
                    alpha: true,
                    powerPreference: "high-performance",
                    precision: "highp"
                  }}
                  dpr={[1, 2]}
                  performance={{ min: 0.5 }}
                  frameloop="always"
                >
          <Suspense fallback={null}>
            {/* Enhanced Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 20, 10]}
              intensity={1.2}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={50}
              shadow-camera-left={-25}
              shadow-camera-right={25}
              shadow-camera-top={25}
              shadow-camera-bottom={-25}
            />
            
            {/* Physics World with Error Boundary */}
            <ErrorBoundary fallback={<div>Physics Error - Reloading...</div>}>
              <Physics 
                gravity={[0, -20, 0]} 
                defaultContactMaterial={{ friction: 0.3, restitution: 0.2 }}
                iterations={15}
                tolerance={0.001}
                broadphase="SAP"
                allowSleep={false}
              >
                        {/* Enhanced Pac-Man Maze */}
                        <EnhancedPacmanMaze 
                          onPelletCollected={handlePelletCollected}
                        />
                        
                        {/* Enhanced Pac-Man Character */}
                        <EnhancedPacmanCharacter 
                          ref={playerRef}
                          onScoreUpdate={handleScoreUpdate}
                          onPelletCollected={handlePelletCollected}
                        />
                        
                        {/* Enhanced Ghosts */}
                        <EnhancedGhost 
                          position={[0, 1, 6]}
                          color="#FF0000"
                          playerPosition={playerRef.current?.position || new THREE.Vector3(0, 1, -6)}
                          isPlayerPoweredUp={pacmanState.isPoweredUp}
                          onPlayerCaught={handlePlayerCaught}
                        />
                        <EnhancedGhost 
                          position={[6, 1, 0]}
                          color="#FF69B4"
                          playerPosition={playerRef.current?.position || new THREE.Vector3(0, 1, -6)}
                          isPlayerPoweredUp={pacmanState.isPoweredUp}
                          onPlayerCaught={handlePlayerCaught}
                        />
                        <EnhancedGhost 
                          position={[-6, 1, 0]}
                          color="#00FF00"
                          playerPosition={playerRef.current?.position || new THREE.Vector3(0, 1, -6)}
                          isPlayerPoweredUp={pacmanState.isPoweredUp}
                          onPlayerCaught={handlePlayerCaught}
                        />
                        <EnhancedGhost 
                          position={[0, 1, -6]}
                          color="#FFA500"
                          playerPosition={playerRef.current?.position || new THREE.Vector3(0, 1, -6)}
                          isPlayerPoweredUp={pacmanState.isPoweredUp}
                          onPlayerCaught={handlePlayerCaught}
                        />
                
                {/* Camera Controller */}
                <CameraController 
                  target={playerRef}
                  isPaused={gameState.isPaused}
                />
              </Physics>
            </ErrorBoundary>
          </Suspense>
        </Canvas>
        
                {/* Game HUD */}
                <GameHUD
                  score={pacmanState.score}
                  lives={pacmanState.lives}
                  level={gameState.currentLevel}
                  pelletsCollected={pacmanState.pelletsCollected}
                  totalPellets={pacmanState.totalPellets}
                  timeElapsed={gameState.timeElapsed}
                  isPaused={gameState.isPaused}
                  onPause={gameActions.pauseGame}
                  onResume={gameActions.resumeGame}
                />
        
                {/* Debug HUD */}
                <DebugHUD
                  playerRef={playerRef}
                  gameScore={pacmanState.score}
                  lives={pacmanState.lives}
                  level={gameState.currentLevel}
                  pelletsCollected={pacmanState.pelletsCollected}
                  totalPellets={pacmanState.totalPellets}
                  timeElapsed={gameState.timeElapsed}
                />
                
                {/* Sound System */}
                <SoundSystem
                  onPelletCollected={handlePelletCollected}
                  onPlayerCaught={handlePlayerCaught}
                  onPowerUp={() => setPacmanState(prev => ({ ...prev, isPoweredUp: true }))}
                />
      </div>
    </ErrorBoundary>
  );
}

export default App;