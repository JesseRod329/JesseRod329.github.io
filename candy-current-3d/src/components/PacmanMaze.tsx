import React, { useMemo } from 'react';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

interface PacmanMazeProps {
  onPelletCollected: (type: string) => void;
}

// Classic Pac-Man maze layout (simplified)
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

const PacmanMaze: React.FC<PacmanMazeProps> = ({ onPelletCollected }) => {
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
      {/* Maze Walls */}
      {walls.map((wall, index) => (
        <WallComponent key={`wall-${index}`} position={wall.position} size={wall.size} />
      ))}
      
      {/* Pellets */}
      {pellets.map((pellet, index) => (
        <PelletComponent 
          key={`pellet-${index}`} 
          position={pellet.position} 
          type={pellet.type}
          onCollect={onPelletCollected}
        />
      ))}
    </group>
  );
};

// Wall Component
interface WallComponentProps {
  position: [number, number, number];
  size: [number, number, number];
}

const WallComponent: React.FC<WallComponentProps> = ({ position, size }) => {
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
    <mesh ref={wallRef} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color="#0066CC"
        roughness={0.3}
        metalness={0.1}
        emissive="#0066CC"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

// Pellet Component
interface PelletComponentProps {
  position: [number, number, number];
  type: 'normal' | 'power';
  onCollect: (type: string) => void;
}

const PelletComponent: React.FC<PelletComponentProps> = ({ position, type, onCollect }) => {
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
    <mesh ref={pelletRef} castShadow>
      <sphereGeometry args={[type === 'power' ? 0.3 : 0.15, 16, 16]} />
      <meshStandardMaterial
        color={type === 'power' ? "#FFD700" : "#FFFFFF"}
        emissive={type === 'power' ? "#FFD700" : "#FFFFFF"}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

export default PacmanMaze;



