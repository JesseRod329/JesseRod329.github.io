import React, { useMemo } from 'react';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

interface EnhancedPacmanMazeProps {
  onPelletCollected: (type: string) => void;
}

// Enhanced Pac-Man maze layout with more complexity
const MAZE_LAYOUT = [
  "####################",
  "#..................#",
  "#.####.####.####.###",
  "#..................#",
  "###.####.####.####.#",
  "#..................#",
  "#.####.####.####.###",
  "#..................#",
  "####################"
];

const CELL_SIZE = 2;
const WALL_HEIGHT = 2;
const WALL_THICKNESS = 0.2;

const EnhancedPacmanMaze: React.FC<EnhancedPacmanMazeProps> = ({ onPelletCollected }) => {
  const { walls, pellets, playerSpawn, ghostSpawns } = useMemo(() => {
    const walls: Array<{ position: [number, number, number]; size: [number, number, number] }> = [];
    const pellets: Array<{ position: [number, number, number]; type: 'normal' | 'power' }> = [];
    const ghostSpawns: Array<[number, number, number]> = [];
    let playerSpawn: [number, number, number] = [0, 0, 0];

    MAZE_LAYOUT.forEach((row, y) => {
      row.split('').forEach((cell, x) => {
        const worldX = (x - row.length / 2) * CELL_SIZE;
        const worldZ = (y - MAZE_LAYOUT.length / 2) * CELL_SIZE;
        
        if (cell === '#') {
          // Create wall
          walls.push({
            position: [worldX, WALL_HEIGHT / 2, worldZ],
            size: [CELL_SIZE, WALL_HEIGHT, CELL_SIZE]
          });
        } else if (cell === '.') {
          // Create pellet
          const isPowerPellet = Math.random() < 0.1; // 10% chance for power pellet
          pellets.push({
            position: [worldX, 0.5, worldZ],
            type: isPowerPellet ? 'power' : 'normal'
          });
        } else if (cell === 'P') {
          // Player spawn
          playerSpawn = [worldX, 1, worldZ];
        } else if (cell === 'G') {
          // Ghost spawn
          ghostSpawns.push([worldX, 1, worldZ]);
        }
      });
    });

    // Set default player spawn if not specified
    if (playerSpawn[0] === 0 && playerSpawn[1] === 0 && playerSpawn[2] === 0) {
      playerSpawn = [0, 1, -MAZE_LAYOUT.length * CELL_SIZE / 2 + CELL_SIZE];
    }

    return { walls, pellets, playerSpawn, ghostSpawns };
  }, []);

  return (
    <group>
      {/* Enhanced Ground */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial
          color="#2D5016"
          roughness={0.8}
          metalness={0.1}
          emissive="#1A3009"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Maze Walls */}
      {walls.map((wall, index) => (
        <EnhancedWallComponent key={`wall-${index}`} position={wall.position} size={wall.size} />
      ))}
      
      {/* Enhanced Pellets */}
      {pellets.map((pellet, index) => (
        <EnhancedPelletComponent 
          key={`pellet-${index}`} 
          position={pellet.position} 
          type={pellet.type}
          onCollect={onPelletCollected}
        />
      ))}

      {/* Ambient lighting for better visibility */}
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#FFFFFF" />
      <pointLight position={[10, 5, 10]} intensity={0.3} color="#FFFFFF" />
      <pointLight position={[-10, 5, -10]} intensity={0.3} color="#FFFFFF" />
    </group>
  );
};

// Enhanced Wall Component
interface EnhancedWallComponentProps {
  position: [number, number, number];
  size: [number, number, number];
}

const EnhancedWallComponent: React.FC<EnhancedWallComponentProps> = ({ position, size }) => {
  const [wallRef] = useBox(() => ({
    position,
    args: size,
    type: 'Static',
    material: {
      friction: 0.8,
      restitution: 0.1
    },
    userData: { type: 'wall' }
  }));

  return (
    <group>
      {/* Main wall body */}
      <mesh ref={wallRef} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#0066CC"
          roughness={0.3}
          metalness={0.2}
          emissive="#004499"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Wall top edge */}
      <mesh position={[position[0], position[1] + size[1]/2 + 0.1, position[2]]} castShadow>
        <boxGeometry args={[size[0], 0.2, size[2]]} />
        <meshStandardMaterial
          color="#0088FF"
          roughness={0.2}
          metalness={0.3}
          emissive="#0088FF"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Wall glow effect */}
      <mesh position={[position[0], position[1], position[2]]}>
        <boxGeometry args={[size[0] + 0.1, size[1] + 0.1, size[2] + 0.1]} />
        <meshStandardMaterial
          color="#0066CC"
          transparent
          opacity={0.1}
          emissive="#0066CC"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
};

// Enhanced Pellet Component
interface EnhancedPelletComponentProps {
  position: [number, number, number];
  type: 'normal' | 'power';
  onCollect: (type: string) => void;
}

const EnhancedPelletComponent: React.FC<EnhancedPelletComponentProps> = ({ position, type, onCollect }) => {
  const [pelletRef] = useBox(() => ({
    position,
    radius: type === 'power' ? 0.3 : 0.15,
    type: 'Static',
    isTrigger: true,
    userData: { 
      type: 'pellet', 
      pelletType: type 
    },
    onCollide: (e) => {
      const { contact, target } = e;
      const otherBody = contact.bi === target ? contact.bj : contact.bi;
      
      if (otherBody.userData.type === 'player') {
        onCollect(type);
        // Hide pellet by moving it far away
        if (pelletRef.current) {
          pelletRef.current.position.set(1000, 1000, 1000);
        }
      }
    }
  }));

  return (
    <group>
      {/* Main pellet */}
      <mesh ref={pelletRef} castShadow>
        <sphereGeometry args={[type === 'power' ? 0.3 : 0.15, 16, 16]} />
        <meshStandardMaterial
          color={type === 'power' ? "#FFD700" : "#FFFFFF"}
          emissive={type === 'power' ? "#FFD700" : "#FFFFFF"}
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Pellet glow effect */}
      <mesh position={position}>
        <sphereGeometry args={[type === 'power' ? 0.4 : 0.2, 16, 16]} />
        <meshStandardMaterial
          color={type === 'power' ? "#FFD700" : "#FFFFFF"}
          transparent
          opacity={0.3}
          emissive={type === 'power' ? "#FFD700" : "#FFFFFF"}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Power pellet special effect */}
      {type === 'power' && (
        <mesh position={position}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial
            color="#FFD700"
            transparent
            opacity={0.1}
            emissive="#FFD700"
            emissiveIntensity={0.1}
          />
        </mesh>
      )}
    </group>
  );
};

export default EnhancedPacmanMaze;





