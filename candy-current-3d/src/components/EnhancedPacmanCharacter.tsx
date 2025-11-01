import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';

interface EnhancedPacmanCharacterProps {
  onScoreUpdate: (score: number) => void;
  onPelletCollected: (type: string) => void;
}

const EnhancedPacmanCharacter: React.FC<EnhancedPacmanCharacterProps> = ({
  onScoreUpdate,
  onPelletCollected
}) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPoweredUp, setIsPoweredUp] = useState(false);
  const [powerUpTime, setPowerUpTime] = useState(0);
  
  // Movement state
  const [inputState, setInputState] = useState({
    up: false,
    down: false,
    left: false,
    right: false
  });

  // Movement constants
  const moveSpeed = 8;
  const maxSpeed = 12;
  
  // Physics body
  const [sphereRef, api] = useSphere(() => ({
    mass: 1,
    position: [0, 1, -6], // Start at bottom of maze
    radius: 0.4,
    material: {
      friction: 0.1,
      restitution: 0.1
    },
    userData: { type: 'player' }
  }));

  // Input handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          setInputState(prev => ({ ...prev, up: true }));
          break;
        case 'ArrowDown':
        case 'KeyS':
          setInputState(prev => ({ ...prev, down: true }));
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setInputState(prev => ({ ...prev, left: true }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setInputState(prev => ({ ...prev, right: true }));
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          setInputState(prev => ({ ...prev, up: false }));
          break;
        case 'ArrowDown':
        case 'KeyS':
          setInputState(prev => ({ ...prev, down: false }));
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setInputState(prev => ({ ...prev, left: false }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setInputState(prev => ({ ...prev, right: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Movement logic
  useFrame((state, delta) => {
    if (!sphereRef.current) return;

    // Calculate movement direction
    let moveX = 0;
    let moveZ = 0;

    if (inputState.left) moveX = -1;
    if (inputState.right) moveX = 1;
    if (inputState.up) moveZ = -1;
    if (inputState.down) moveZ = 1;

    // Normalize diagonal movement
    if (moveX !== 0 && moveZ !== 0) {
      moveX *= 0.707;
      moveZ *= 0.707;
    }

    // Apply movement
    if (moveX !== 0 || moveZ !== 0) {
      const force = moveSpeed * delta * 60;
      api.applyImpulse([moveX * force, 0, moveZ * force], [0, 0, 0]);
    }

    // Limit speed
    api.velocity.subscribe((velocity) => {
      const speed = Math.sqrt(velocity[0] ** 2 + velocity[2] ** 2);
      if (speed > maxSpeed) {
        const factor = maxSpeed / speed;
        api.velocity.set(velocity[0] * factor, velocity[1], velocity[2] * factor);
      }
    });

    // Update power-up timer
    if (isPoweredUp) {
      setPowerUpTime(prev => {
        const newTime = prev - delta;
        if (newTime <= 0) {
          setIsPoweredUp(false);
          return 0;
        }
        return newTime;
      });
    }
  });

  // Handle pellet collection
  const handlePelletCollected = useCallback((type: string) => {
    const points = type === 'power' ? 50 : 10;
    setScore(prev => prev + points);
    onScoreUpdate(score + points);
    onPelletCollected(type);

    if (type === 'power') {
      setIsPoweredUp(true);
      setPowerUpTime(10); // 10 seconds of power-up
    }
  }, [score, onScoreUpdate, onPelletCollected]);

  // Enhanced Pac-Man with better visuals
  const pacmanRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (pacmanRef.current) {
      const time = state.clock.elapsedTime;
      
      // Floating animation
      pacmanRef.current.position.y = Math.sin(time * 4) * 0.1;
      
      // Rotation based on movement
      if (inputState.left) pacmanRef.current.rotation.y = Math.PI;
      else if (inputState.right) pacmanRef.current.rotation.y = 0;
      else if (inputState.up) pacmanRef.current.rotation.y = Math.PI / 2;
      else if (inputState.down) pacmanRef.current.rotation.y = -Math.PI / 2;
    }

    if (mouthRef.current) {
      const time = state.clock.elapsedTime;
      const mouthOpen = Math.sin(time * 8) * 0.3 + 0.7; // Animate mouth
      mouthRef.current.rotation.z = mouthOpen;
    }
  });

  return (
    <group ref={pacmanRef}>
      {/* Enhanced Pac-Man Body */}
      <mesh ref={sphereRef} castShadow receiveShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={isPoweredUp ? "#FFD700" : "#FFFF00"}
          emissive={isPoweredUp ? "#FFD700" : "#FFFF00"}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.1}
        />
        
        {/* Enhanced Pac-Man Mouth */}
        <group ref={mouthRef} position={[0, 0, 0.35]}>
          <mesh>
            <coneGeometry args={[0.3, 0.8, 8]} />
            <meshStandardMaterial
              color="#000000"
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </mesh>

      {/* Enhanced Eyes */}
      <mesh position={[-0.15, 0.1, 0.35]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive="#FFFFFF"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0.15, 0.1, 0.35]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive="#FFFFFF"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[-0.15, 0.1, 0.4]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.15, 0.1, 0.4]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Power-up indicator */}
      {isPoweredUp && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}

      {/* Movement trail effect */}
      {inputState.left || inputState.right || inputState.up || inputState.down ? (
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#FFFF00"
            transparent
            opacity={0.6}
            emissive="#FFFF00"
            emissiveIntensity={0.3}
          />
        </mesh>
      ) : null}
    </group>
  );
};

export default EnhancedPacmanCharacter;




