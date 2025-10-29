import React, { useRef, useMemo } from 'react';
import { useBox, usePlane } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { Mesh, InstancedMesh } from 'three';
import * as THREE from 'three';

const EnhancedCandyWorld: React.FC = () => {
  const [groundRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: {
      friction: 0.1,
      restitution: 0.3
    }
  }));

  // Enhanced platforms with better physics
  const [platform1Ref] = useBox(() => ({
    position: [3, 1, -2],
    args: [2, 0.5, 1],
    material: {
      friction: 0.1,
      restitution: 0.5
    }
  }));

  const [platform2Ref] = useBox(() => ({
    position: [-3, 1.5, 1],
    args: [1.5, 0.5, 1.5],
    material: {
      friction: 0.1,
      restitution: 0.5
    }
  }));

  const [platform3Ref] = useBox(() => ({
    position: [0, 2.5, 3],
    args: [1, 0.3, 1],
    material: {
      friction: 0.05,
      restitution: 0.7
    }
  }));

  // Moving platforms for dynamic gameplay
  const [movingPlatformRef] = useBox(() => ({
    position: [5, 1, 0],
    args: [1, 0.3, 1],
    material: {
      friction: 0.1,
      restitution: 0.5
    }
  }));

  // Animate moving platform
  useFrame((state) => {
    if (movingPlatformRef.current) {
      const time = state.clock.elapsedTime;
      movingPlatformRef.current.position.set(
        5 + Math.sin(time * 2) * 2,
        1 + Math.sin(time * 3) * 0.5,
        0
      );
    }
  });

  // Optimized collectibles using InstancedMesh for performance
  const collectiblesRef = useRef<InstancedMesh>(null);
  const collectibleCount = 20;
  
  const collectiblePositions = useMemo(() => {
    const positions = new Float32Array(collectibleCount * 3);
    for (let i = 0; i < collectibleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = Math.random() * 5 + 1; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }
    return positions;
  }, []);

  // Animate collectibles
  useFrame((state) => {
    if (collectiblesRef.current) {
      const time = state.clock.elapsedTime;
      const matrix = new THREE.Matrix4();
      
      for (let i = 0; i < collectibleCount; i++) {
        const x = collectiblePositions[i * 3];
        const y = collectiblePositions[i * 3 + 1] + Math.sin(time * 2 + i) * 0.2;
        const z = collectiblePositions[i * 3 + 2];
        
        matrix.setPosition(x, y, z);
        collectiblesRef.current.setMatrixAt(i, matrix);
      }
      
      collectiblesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // Power-ups with physics
  const [powerUp1Ref] = useBox(() => ({
    position: [2, 3, 0],
    args: [0.3, 0.3, 0.3],
    material: {
      friction: 0.1,
      restitution: 0.8
    },
    userData: { type: 'powerup', powerUpType: 'speed' }
  }));

  const [powerUp2Ref] = useBox(() => ({
    position: [-2, 3, 0],
    args: [0.3, 0.3, 0.3],
    material: {
      friction: 0.1,
      restitution: 0.8
    },
    userData: { type: 'powerup', powerUpType: 'jump' }
  }));

  const [powerUp3Ref] = useBox(() => ({
    position: [0, 4, 2],
    args: [0.3, 0.3, 0.3],
    material: {
      friction: 0.1,
      restitution: 0.8
    },
    userData: { type: 'powerup', powerUpType: 'magnet' }
  }));

  // Animate power-ups
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    [powerUp1Ref, powerUp2Ref, powerUp3Ref].forEach((ref, index) => {
      if (ref.current) {
        ref.current.rotation.y = time * 2 + index;
        ref.current.position.y += Math.sin(time * 3 + index) * 0.01;
      }
    });
  });

  return (
    <group>
      {/* Enhanced Ground */}
      <mesh ref={groundRef} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#F8BBD9"
          transparent
          opacity={0.9}
          roughness={0.1}
          metalness={0.05}
        />
      </mesh>

      {/* Enhanced Platforms */}
      <mesh ref={platform1Ref} castShadow receiveShadow>
        <boxGeometry args={[2, 0.5, 1]} />
        <meshStandardMaterial
          color="#FFB6C1"
          roughness={0.05}
          metalness={0.1}
          emissive="#FFB6C1"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh ref={platform2Ref} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        <meshStandardMaterial
          color="#98FB98"
          roughness={0.05}
          metalness={0.1}
          emissive="#98FB98"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh ref={platform3Ref} castShadow receiveShadow>
        <boxGeometry args={[1, 0.3, 1]} />
        <meshStandardMaterial
          color="#87CEEB"
          roughness={0.05}
          metalness={0.1}
          emissive="#87CEEB"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Moving Platform */}
      <mesh ref={movingPlatformRef} castShadow receiveShadow>
        <boxGeometry args={[1, 0.3, 1]} />
        <meshStandardMaterial
          color="#DDA0DD"
          roughness={0.05}
          metalness={0.1}
          emissive="#DDA0DD"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Enhanced Candy Canes */}
      <mesh position={[8, 2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 6]} />
        <meshStandardMaterial
          color="#FF69B4"
          roughness={0.05}
          metalness={0.1}
          emissive="#FF69B4"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <mesh position={[-8, 2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 6]} />
        <meshStandardMaterial
          color="#00FF7F"
          roughness={0.05}
          metalness={0.1}
          emissive="#00FF7F"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Enhanced Lollipops */}
      <group position={[0, 3, -8]}>
        <mesh castShadow>
          <sphereGeometry args={[0.4]} />
          <meshStandardMaterial
            color="#FF1493"
            roughness={0.05}
            metalness={0.1}
            emissive="#FF1493"
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.03, 3]} />
          <meshStandardMaterial
            color="#8B4513"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      </group>

      {/* Optimized Collectibles */}
      <instancedMesh
        ref={collectiblesRef}
        args={[undefined, undefined, collectibleCount]}
        castShadow
      >
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial
          color="#FFD700"
          roughness={0.05}
          metalness={0.1}
          emissive="#FFD700"
          emissiveIntensity={0.3}
        />
      </instancedMesh>

      {/* Power-ups */}
      <mesh ref={powerUp1Ref} castShadow>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial
          color="#FF6B6B"
          roughness={0.05}
          metalness={0.1}
          emissive="#FF6B6B"
          emissiveIntensity={0.4}
        />
      </mesh>

      <mesh ref={powerUp2Ref} castShadow>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial
          color="#4ECDC4"
          roughness={0.05}
          metalness={0.1}
          emissive="#4ECDC4"
          emissiveIntensity={0.4}
        />
      </mesh>

      <mesh ref={powerUp3Ref} castShadow>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial
          color="#F9CA24"
          roughness={0.05}
          metalness={0.1}
          emissive="#F9CA24"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Enhanced Syrup River */}
      <mesh position={[0, 0.05, 5]} receiveShadow>
        <planeGeometry args={[12, 3]} />
        <meshStandardMaterial
          color="#87CEEB"
          transparent
          opacity={0.7}
          roughness={0.1}
          metalness={0.1}
          emissive="#87CEEB"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Background Elements for Depth */}
      <mesh position={[0, 0, -15]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial
          color="#E6E6FA"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
};

export default EnhancedCandyWorld;
