import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { Mesh } from 'three';
import * as THREE from 'three';

interface JellyCharacterProps {
  type?: 'grape' | 'lime' | 'blueberry';
}

const JellyCharacter: React.FC<JellyCharacterProps> = ({ type = 'grape' }) => {
  const meshRef = useRef<Mesh>(null);
  const [jumping, setJumping] = useState(false);
  const [velocity, setVelocity] = useState([0, 0, 0]);
  
  // Physics body
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 2, 0],
    radius: 0.5,
    material: {
      friction: 0.1,
      restitution: 0.3
    }
  }));

  // Get camera for movement
  const { camera } = useThree();

  // Handle movement
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth jelly bobbing animation
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 4) * 0.01;
    
    // Jelly squish effect when jumping
    if (jumping) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.1;
      meshRef.current.scale.set(scale, 1 / scale, scale);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  // Keyboard controls
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Space':
          event.preventDefault();
          setJumping(true);
          api.velocity.set(0, 8, 0);
          setTimeout(() => setJumping(false), 300);
          break;
        case 'KeyA':
        case 'ArrowLeft':
          api.velocity.set(-5, velocity[1], 0);
          break;
        case 'KeyD':
        case 'ArrowRight':
          api.velocity.set(5, velocity[1], 0);
          break;
        case 'KeyW':
        case 'ArrowUp':
          api.velocity.set(0, velocity[1], -5);
          break;
        case 'KeyS':
        case 'ArrowDown':
          api.velocity.set(0, velocity[1], 5);
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
        case 'KeyS':
        case 'ArrowDown':
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
  }, [api, velocity]);

  // Jelly colors based on type
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

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={getJellyColor()}
        transparent
        opacity={0.8}
        roughness={0.1}
        metalness={0.1}
      />
      {/* Jelly face */}
      <mesh position={[0, 0, 0.5]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-0.15, 0.1, 0.5]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.15, 0.1, 0.5]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, -0.1, 0.5]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </mesh>
  );
};

export default JellyCharacter;
