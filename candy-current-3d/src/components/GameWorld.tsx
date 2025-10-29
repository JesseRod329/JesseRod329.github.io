import React, { useRef, useMemo, useCallback } from 'react';
import { useBox, useSphere } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Vector3 } from 'three';
import * as THREE from 'three';

interface Platform {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  pellets: Pellet[];
}

interface Pellet {
  id: string;
  position: [number, number, number];
  type: 'normal' | 'power' | 'bonus';
  collected: boolean;
}

interface GameWorldProps {
  level: number;
  onPelletCollected: (type: string) => void;
}

// Enhanced level generation with better structure
const GameWorld: React.FC<GameWorldProps> = ({ level, onPelletCollected }) => {
  
  // Generate side-scrolling level data with memoization for performance
  const { platforms, ground, allPellets } = useMemo(() => {
    const platformCount = Math.min(5 + level * 3, 20); // More platforms for side-scrolling
    const platforms: Platform[] = [];
    const allPellets: Pellet[] = [];
    
    // Create long horizontal ground for side-scrolling
    const ground = {
      id: 'ground',
      position: [0, -1, 0] as [number, number, number],
      size: [200, 2, 20] as [number, number, number], // Long and narrow for side-scrolling
      color: '#4CAF50'
    };
    
    // Generate platforms in a horizontal progression for side-scrolling
    for (let i = 0; i < platformCount; i++) {
      const x = i * 8 + 5; // Horizontal spacing
      const height = Math.floor(i / 3) * 3 + 2 + (Math.random() - 0.5) * 2; // Varying heights
      const z = (Math.random() - 0.5) * 8; // Some variation in Z direction
      
      const platform: Platform = {
        id: `platform_${i}`,
        position: [x, height, z],
        size: [4, 0.4, 4], // Slightly larger platforms
        color: `hsl(${(i * 30) % 360}, 70%, 60%)`,
        pellets: []
      };

      // Add pellets in a line across the platform
      const pelletCount = 3 + Math.floor(Math.random() * 3);
      for (let j = 0; j < pelletCount; j++) {
        const pelletX = (j - pelletCount/2) * 0.8; // Spread across platform
        
        const pellet: Pellet = {
          id: `pellet_${i}_${j}`,
          position: [
            platform.position[0] + pelletX,
            platform.position[1] + 0.6,
            platform.position[2] + (Math.random() - 0.5) * 2
          ],
          type: Math.random() < 0.1 ? 'power' : Math.random() < 0.2 ? 'bonus' : 'normal',
          collected: false
        };
        
        platform.pellets.push(pellet);
        allPellets.push(pellet);
      }

      platforms.push(platform);
    }

    // Add some floating platforms for variety
    for (let i = 0; i < Math.floor(platformCount / 3); i++) {
      const x = i * 12 + 8;
      const height = 8 + Math.random() * 4;
      const z = (Math.random() - 0.5) * 12;
      
      const platform: Platform = {
        id: `floating_${i}`,
        position: [x, height, z],
        size: [2.5, 0.3, 2.5],
        color: `hsl(${(i * 60 + 180) % 360}, 70%, 60%)`,
        pellets: []
      };

      // Fewer pellets on floating platforms
      const pelletCount = 1 + Math.floor(Math.random() * 2);
      for (let j = 0; j < pelletCount; j++) {
        const pellet: Pellet = {
          id: `floating_pellet_${i}_${j}`,
          position: [
            platform.position[0] + (Math.random() - 0.5) * 1.5,
            platform.position[1] + 0.5,
            platform.position[2] + (Math.random() - 0.5) * 1.5
          ],
          type: Math.random() < 0.2 ? 'bonus' : 'normal', // Higher chance of bonus on floating platforms
          collected: false
        };
        
        platform.pellets.push(pellet);
        allPellets.push(pellet);
      }

      platforms.push(platform);
    }

    return { platforms, ground, allPellets };
  }, [level]);

  return (
    <group>
      {/* Enhanced Ground */}
      <GroundComponent ground={ground} />
      
      {/* Platforms with optimized rendering */}
      {platforms.map((platform, index) => (
        <PlatformComponent
          key={platform.id}
          platform={platform}
          index={index}
        />
      ))}

      {/* Instanced Pellet Renderer for Performance */}
      <InstancedPelletRenderer 
        pellets={allPellets} 
        onCollect={onPelletCollected} 
      />
    </group>
  );
};

// Enhanced Ground Component
interface GroundComponentProps {
  ground: {
    id: string;
    position: [number, number, number];
    size: [number, number, number];
    color: string;
  };
}

const GroundComponent: React.FC<GroundComponentProps> = ({ ground }) => {
  const [groundRef] = useBox(() => ({
    position: ground.position,
    args: ground.size,
    type: 'Static',
    material: {
      friction: 0.8,
      restitution: 0.1,
      contactEquationStiffness: 1e8,
      contactEquationRelaxation: 3
    },
    userData: { type: 'ground', platformId: 'ground' }
  }));

  return (
    <mesh ref={groundRef} receiveShadow>
      <boxGeometry args={ground.size} />
      <meshStandardMaterial
        color={ground.color}
        roughness={0.8}
        metalness={0.1}
        emissive={ground.color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

// Enhanced Platform Component
interface PlatformComponentProps {
  platform: Platform;
  index: number;
}

const PlatformComponent: React.FC<PlatformComponentProps> = ({ platform }) => {
  const [platformRef] = useBox(() => ({
    position: platform.position,
    args: platform.size,
    type: 'Static',
    material: {
      friction: 0.6,
      restitution: 0.3,
      contactEquationStiffness: 1e8,
      contactEquationRelaxation: 3
    },
    userData: { type: 'platform', platformId: platform.id }
  }));

  // Platform animation
  useFrame((state) => {
    if (platformRef.current) {
      const time = state.clock.elapsedTime;
      // Gentle floating animation
      platformRef.current.position.y = platform.position[1] + Math.sin(time + platform.position[0]) * 0.05;
    }
  });

  return (
    <mesh ref={platformRef} castShadow receiveShadow>
      <boxGeometry args={platform.size} />
      <meshStandardMaterial
        color={platform.color}
        roughness={0.2}
        metalness={0.1}
        emissive={platform.color}
        emissiveIntensity={0.2}
      />
      
      {/* Enhanced platform glow */}
      <mesh position={[0, platform.size[1] / 2 + 0.01, 0]}>
        <planeGeometry args={[platform.size[0], platform.size[2]]} />
        <meshStandardMaterial
          color={platform.color}
          transparent
          opacity={0.4}
          emissive={platform.color}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Platform edges */}
      <mesh position={[0, platform.size[1] / 2, 0]}>
        <ringGeometry args={[1.4, 1.8, 32]} />
        <meshStandardMaterial
          color={platform.color}
          transparent
          opacity={0.6}
          emissive={platform.color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </mesh>
  );
};

// Individual Pellet Component
interface PelletComponentProps {
  pellet: Pellet;
  onCollect: (type: string) => void;
}

const PelletComponent: React.FC<PelletComponentProps> = ({ pellet, onCollect }) => {
  const [pelletRef] = useSphere(() => ({
    position: pellet.position,
    radius: pellet.type === 'power' ? 0.25 : pellet.type === 'bonus' ? 0.18 : 0.12,
    type: 'Static',
    material: {
      friction: 0.1,
      restitution: 0.8,
      contactEquationStiffness: 1e8,
      contactEquationRelaxation: 3
    },
    userData: { 
      type: 'pellet', 
      pelletId: pellet.id,
      pelletType: pellet.type
    },
    onCollide: (e) => {
      const { contact, target } = e;
      const otherBody = contact.bi === target ? contact.bj : contact.bi;
      
      if (otherBody.userData.type === 'player') {
        onCollect(pellet.type);
        // Hide pellet by moving it far away
        if (pelletRef.current) {
          pelletRef.current.position.set(1000, 1000, 1000);
        }
      }
    }
  }));

  // Pellet animation
  useFrame((state) => {
    if (!pelletRef.current || pellet.collected) return;
    
    const time = state.clock.elapsedTime;
    const index = parseInt(pellet.id.split('_')[2] || '0');
    
    // Floating animation
    pelletRef.current.position.y = pellet.position[1] + Math.sin(time * 3 + index) * 0.1;
    pelletRef.current.rotation.y = time * 2 + index;
    
    // Scale based on type
    const scale = pellet.type === 'power' ? 1.2 : pellet.type === 'bonus' ? 1.1 : 1;
    pelletRef.current.scale.setScalar(scale);
  });

  if (pellet.collected) return null;

  // Get color based on type
  let color: string;
  switch (pellet.type) {
    case 'power':
      color = '#FFD700'; // Gold
      break;
    case 'bonus':
      color = '#FF6B6B'; // Red
      break;
    default:
      color = '#FFFFFF'; // White
      break;
  }

  return (
    <mesh ref={pelletRef} castShadow>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color={color}
        roughness={0.1}
        metalness={0.1}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

// Simple Pellet Renderer (no instancing to avoid hook issues)
interface InstancedPelletRendererProps {
  pellets: Pellet[];
  onCollect: (type: string) => void;
}

const InstancedPelletRenderer: React.FC<InstancedPelletRendererProps> = ({ 
  pellets, 
  onCollect 
}) => {
  return (
    <group>
      {pellets.map((pellet) => (
        <PelletComponent
          key={pellet.id}
          pellet={pellet}
          onCollect={onCollect}
        />
      ))}
    </group>
  );
};

export default GameWorld;