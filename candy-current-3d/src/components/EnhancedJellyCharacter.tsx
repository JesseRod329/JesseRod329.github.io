import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { Mesh } from 'three';
import * as THREE from 'three';

interface EnhancedJellyCharacterProps {
  type?: 'grape' | 'lime' | 'blueberry';
  onScoreUpdate?: (score: number) => void;
  onPowerUpCollected?: (powerUp: any) => void;
}

const EnhancedJellyCharacter: React.FC<EnhancedJellyCharacterProps> = ({ 
  type = 'grape', 
  onScoreUpdate,
  onPowerUpCollected 
}) => {
  const meshRef = useRef<Mesh>(null);
  const [jumping, setJumping] = useState(false);
  const [sliding, setSliding] = useState(false);
  const [velocity, setVelocity] = useState([0, 0, 0]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [powerUps, setPowerUps] = useState<string[]>([]);
  
  // Enhanced physics body with better performance
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 2, 0],
    radius: 0.5,
    material: {
      friction: 0.1,
      restitution: 0.4,
      contactEquationStiffness: 1e8,
      contactEquationRelaxation: 3
    },
    onCollide: (e) => {
      // Enhanced collision detection
      const { contact } = e;
      if (contact.bi.id !== contact.bj.id) {
        // Collision with collectible
        if (contact.bi.userData?.type === 'collectible' || contact.bj.userData?.type === 'collectible') {
          handleCollectibleCollision();
        }
        // Collision with power-up
        if (contact.bi.userData?.type === 'powerup' || contact.bj.userData?.type === 'powerup') {
          handlePowerUpCollision(contact.bi.userData || contact.bj.userData);
        }
      }
    }
  }));

  const { camera } = useThree();

  // Enhanced movement with 120FPS optimization
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth jelly bobbing animation (optimized for high FPS)
    const time = state.clock.elapsedTime;
    meshRef.current.position.y += Math.sin(time * 6) * 0.005;
    
    // Enhanced jelly squish effects
    if (jumping) {
      const scale = 1 + Math.sin(time * 12) * 0.08;
      meshRef.current.scale.set(scale, 1 / scale, scale);
    } else if (sliding) {
      meshRef.current.scale.set(1.2, 0.6, 1);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }

    // Update score based on movement (optimized)
    if (Math.random() < 0.01) { // Reduced frequency for performance
      const scoreGain = Math.floor(Math.random() * 10) + 1;
      const newScore = score + scoreGain;
      setScore(newScore);
      onScoreUpdate?.(newScore);
    }

    // Update camera to follow jelly with smooth interpolation
    camera.position.lerp(new THREE.Vector3(
      meshRef.current.position.x * 0.5,
      meshRef.current.position.y + 5,
      meshRef.current.position.z + 10
    ), 0.05);
  });

  // Enhanced keyboard controls with better responsiveness
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      
      switch (event.code) {
        case 'Space':
          if (!jumping) {
            setJumping(true);
            api.velocity.set(0, 12, 0);
            setTimeout(() => setJumping(false), 400);
            
            // Jump combo system
            setCombo(prev => prev + 1);
            onScoreUpdate?.(score + combo * 5);
          }
          break;
          
        case 'KeyA':
        case 'ArrowLeft':
          api.velocity.set(-8, velocity[1], 0);
          break;
          
        case 'KeyD':
        case 'ArrowRight':
          api.velocity.set(8, velocity[1], 0);
          break;
          
        case 'KeyW':
        case 'ArrowUp':
          api.velocity.set(0, velocity[1], -8);
          break;
          
        case 'KeyS':
        case 'ArrowDown':
          setSliding(true);
          api.velocity.set(0, velocity[1], 8);
          setTimeout(() => setSliding(false), 300);
          break;
          
        case 'ShiftLeft':
        case 'ShiftRight':
          // Dash ability
          const dashForce = 15;
          api.velocity.set(velocity[0] > 0 ? dashForce : -dashForce, velocity[1], velocity[2]);
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyA':
        case 'ArrowLeft':
        case 'KeyD':
        case 'ArrowRight':
        case 'KeyW':
        case 'ArrowUp':
          api.velocity.set(0, velocity[1], 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [api, velocity, jumping, sliding, score, combo, onScoreUpdate]);

  // Handle collectible collisions
  const handleCollectibleCollision = () => {
    const collectibleScore = 100 + (combo * 25);
    const newScore = score + collectibleScore;
    setScore(newScore);
    setCombo(prev => prev + 1);
    onScoreUpdate?.(newScore);
    
    // Visual feedback
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1.2);
      setTimeout(() => {
        if (meshRef.current) {
          meshRef.current.scale.setScalar(1);
        }
      }, 100);
    }
  };

  // Handle power-up collisions
  const handlePowerUpCollision = (powerUpData: any) => {
    setPowerUps(prev => [...prev, powerUpData.type]);
    onPowerUpCollected?.(powerUpData);
    
    // Apply power-up effects
    switch (powerUpData.type) {
      case 'speed':
        api.velocity.set(velocity[0] * 1.5, velocity[1], velocity[2] * 1.5);
        break;
      case 'jump':
        api.velocity.set(0, 18, 0);
        break;
      case 'magnet':
        // Attract nearby collectibles (would need to implement)
        break;
    }
    
    // Remove power-up after 5 seconds
    setTimeout(() => {
      setPowerUps(prev => prev.filter(p => p !== powerUpData.type));
    }, 5000);
  };

  // Get jelly colors based on type
  const getJellyColor = () => {
    switch (type) {
      case 'grape':
        return '#8B5CF6';
      case 'lime':
        return '#84CC16';
      case 'blueberry':
        return '#3B82F6';
      default:
        return '#8B5CF6';
    }
  };

  // Get jelly material with enhanced properties
  const getJellyMaterial = () => {
    const color = getJellyColor();
    return (
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.85}
        roughness={0.05}
        metalness={0.1}
        emissive={color}
        emissiveIntensity={0.1}
      />
    );
  };

  return (
    <group>
      {/* Main Jelly Body */}
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        {getJellyMaterial()}
        
        {/* Enhanced jelly face with better details */}
        <mesh position={[0, 0, 0.5]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.15, 0.1, 0.5]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.15, 0.1, 0.5]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Mouth */}
        <mesh position={[0, -0.1, 0.5]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Power-up indicators */}
        {powerUps.map((powerUp, index) => (
          <mesh key={powerUp} position={[0, 0.8 + index * 0.2, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial 
              color={powerUp === 'speed' ? '#FF6B6B' : powerUp === 'jump' ? '#4ECDC4' : '#F9CA24'}
              emissive={powerUp === 'speed' ? '#FF6B6B' : powerUp === 'jump' ? '#4ECDC4' : '#F9CA24'}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </mesh>
      
      {/* Combo indicator */}
      {combo > 1 && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial 
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
      
      {/* Trail effect for speed */}
      {powerUps.includes('speed') && (
        <mesh position={[-0.3, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color="#FF6B6B"
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
    </group>
  );
};

export default EnhancedJellyCharacter;
