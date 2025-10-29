import React, { useRef, useMemo, useState } from 'react';
import { useBox, useSphere } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
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

interface SimplePacmanLevelProps {
  level: number;
  onPelletCollected: (pellet: Pellet) => void;
  onLevelComplete: () => void;
}

const SimplePacmanLevel: React.FC<SimplePacmanLevelProps> = ({ 
  level, 
  onPelletCollected, 
  onLevelComplete 
}) => {
  const [collectedPellets, setCollectedPellets] = useState<Set<string>>(new Set());
  const [levelComplete, setLevelComplete] = useState(false);

  // Generate level layout based on level number
  const platforms = useMemo(() => {
    const platformCount = Math.min(3 + level, 6); // 3-6 platforms based on level
    const platforms: Platform[] = [];
    
    for (let i = 0; i < platformCount; i++) {
      const angle = (i / platformCount) * Math.PI * 2;
      const radius = 3 + i * 0.8; // Spiral outward
      const height = i * 2; // Rising platforms
      
      const platform: Platform = {
        id: `platform_${i}`,
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ],
        size: [2.5, 0.3, 2.5],
        color: `hsl(${(i * 60) % 360}, 70%, 60%)`,
        pellets: []
      };

      // Add pellets to each platform
      const pelletCount = 4 + Math.floor(Math.random() * 3); // 4-6 pellets per platform
      for (let j = 0; j < pelletCount; j++) {
        const pelletX = (Math.random() - 0.5) * (platform.size[0] - 0.5);
        const pelletZ = (Math.random() - 0.5) * (platform.size[2] - 0.5);
        
        const pellet: Pellet = {
          id: `pellet_${i}_${j}`,
          position: [
            platform.position[0] + pelletX,
            platform.position[1] + 0.5,
            platform.position[2] + pelletZ
          ],
          type: Math.random() < 0.15 ? 'power' : Math.random() < 0.25 ? 'bonus' : 'normal',
          collected: false
        };
        
        platform.pellets.push(pellet);
      }

      platforms.push(platform);
    }

    return platforms;
  }, [level]);

  // Calculate total pellets for level completion
  const totalPellets = useMemo(() => {
    return platforms.reduce((total, platform) => total + platform.pellets.length, 0);
  }, [platforms]);

  // Check level completion
  React.useEffect(() => {
    if (collectedPellets.size >= totalPellets && !levelComplete && totalPellets > 0) {
      setLevelComplete(true);
      setTimeout(() => {
        onLevelComplete();
      }, 1000);
    }
  }, [collectedPellets.size, totalPellets, levelComplete, onLevelComplete]);

  // Handle pellet collection
  const handlePelletCollection = (pellet: Pellet) => {
    if (!collectedPellets.has(pellet.id)) {
      setCollectedPellets(prev => new Set([...prev, pellet.id]));
      onPelletCollected(pellet);
    }
  };

  return (
    <group>
      {/* Platforms */}
      {platforms.map((platform, index) => (
        <PlatformComponent
          key={platform.id}
          platform={platform}
          index={index}
        />
      ))}

      {/* Pellets */}
      {platforms.map(platform =>
        platform.pellets.map(pellet => (
          <PelletComponent
            key={pellet.id}
            pellet={pellet}
            onCollect={() => handlePelletCollection(pellet)}
            collected={collectedPellets.has(pellet.id)}
          />
        ))
      )}

      {/* Level Progress Indicator */}
      <LevelProgress
        current={collectedPellets.size}
        total={totalPellets}
        level={level}
        complete={levelComplete}
      />
    </group>
  );
};

// Platform Component
interface PlatformComponentProps {
  platform: Platform;
  index: number;
}

const PlatformComponent: React.FC<PlatformComponentProps> = ({ platform, index }) => {
  const [platformRef] = useBox(() => ({
    position: platform.position,
    args: platform.size,
    material: {
      friction: 0.1,
      restitution: 0.3
    },
    userData: { type: 'platform', platformId: platform.id }
  }));

  return (
    <mesh ref={platformRef} castShadow receiveShadow>
      <boxGeometry args={platform.size} />
      <meshStandardMaterial
        color={platform.color}
        roughness={0.05}
        metalness={0.1}
        emissive={platform.color}
        emissiveIntensity={0.1}
      />
      
      {/* Platform edge glow */}
      <mesh position={[0, platform.size[1] / 2 + 0.01, 0]}>
        <planeGeometry args={[platform.size[0], platform.size[2]]} />
        <meshStandardMaterial
          color={platform.color}
          transparent
          opacity={0.3}
          emissive={platform.color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </mesh>
  );
};

// Pellet Component
interface PelletComponentProps {
  pellet: Pellet;
  onCollect: () => void;
  collected: boolean;
}

const PelletComponent: React.FC<PelletComponentProps> = ({ 
  pellet, 
  onCollect, 
  collected 
}) => {
  const [pelletRef] = useSphere(() => ({
    position: pellet.position,
    radius: pellet.type === 'power' ? 0.2 : pellet.type === 'bonus' ? 0.15 : 0.1,
    material: {
      friction: 0.1,
      restitution: 0.8
    },
    userData: { 
      type: 'pellet', 
      pelletId: pellet.id,
      pelletType: pellet.type
    },
    onCollide: (e) => {
      const { contact } = e;
      if (contact.bi.id !== contact.bj.id) {
        // Check if jelly character collided with pellet
        if (contact.bi.userData?.type === 'jelly' || contact.bj.userData?.type === 'jelly') {
          onCollect();
        }
      }
    }
  }));

  const getPelletColor = () => {
    switch (pellet.type) {
      case 'power': return '#FFD700'; // Gold
      case 'bonus': return '#FF6B6B'; // Red
      default: return '#FFFFFF'; // White
    }
  };

  const getPelletSize = () => {
    switch (pellet.type) {
      case 'power': return 0.2;
      case 'bonus': return 0.15;
      default: return 0.1;
    }
  };

  if (collected) return null;

  return (
    <mesh ref={pelletRef} castShadow>
      <sphereGeometry args={[getPelletSize(), 16, 16]} />
      <meshStandardMaterial
        color={getPelletColor()}
        roughness={0.05}
        metalness={0.1}
        emissive={getPelletColor()}
        emissiveIntensity={0.3}
      />
      
      {/* Pellet glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[getPelletSize() * 1.5, 16, 16]} />
        <meshStandardMaterial
          color={getPelletColor()}
          transparent
          opacity={0.2}
          emissive={getPelletColor()}
          emissiveIntensity={0.5}
        />
      </mesh>
    </mesh>
  );
};

// Level Progress Component
interface LevelProgressProps {
  current: number;
  total: number;
  level: number;
  complete: boolean;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ 
  current, 
  total, 
  level, 
  complete 
}) => {
  return (
    <group position={[0, 8, 0]}>
      {/* Level indicator */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[4, 1]} />
        <meshStandardMaterial
          color={complete ? '#4CAF50' : '#2196F3'}
          transparent
          opacity={0.8}
          emissive={complete ? '#4CAF50' : '#2196F3'}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Progress bar */}
      <mesh position={[0, -0.5, 0.01]}>
        <planeGeometry args={[3, 0.3]} />
        <meshStandardMaterial
          color="#E0E0E0"
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Progress fill */}
      <mesh position={[-1.5 + (current / total) * 3, -0.5, 0.02]}>
        <planeGeometry args={[(current / total) * 3, 0.3]} />
        <meshStandardMaterial
          color={complete ? '#4CAF50' : '#FFD700'}
          emissive={complete ? '#4CAF50' : '#FFD700'}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

export default SimplePacmanLevel;



