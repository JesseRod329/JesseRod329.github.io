import React from 'react';
import { useBox, usePlane } from '@react-three/cannon';
import { Mesh } from 'three';

const CandyWorld: React.FC = () => {
  // Ground plane
  const [groundRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: {
      friction: 0.1,
      restitution: 0.3
    }
  }));

  // Candy platforms
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

  // Candy collectibles
  const collectibles = [
    { position: [2, 2, 0] as [number, number, number], color: '#FF6B6B' },
    { position: [-2, 2, 0] as [number, number, number], color: '#4ECDC4' },
    { position: [0, 3, 2] as [number, number, number], color: '#45B7D1' },
    { position: [4, 2, -1] as [number, number, number], color: '#F9CA24' },
  ];

  return (
    <group>
      {/* Ground - Marshmallow */}
      <mesh ref={groundRef} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#F8BBD9"
          transparent
          opacity={0.8}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Candy Platforms */}
      <mesh ref={platform1Ref} castShadow receiveShadow>
        <boxGeometry args={[2, 0.5, 1]} />
        <meshStandardMaterial
          color="#FFB6C1"
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      <mesh ref={platform2Ref} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        <meshStandardMaterial
          color="#98FB98"
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Candy Canes */}
      <mesh position={[5, 2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 4]} />
        <meshStandardMaterial
          color="#FF69B4"
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[-5, 2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 4]} />
        <meshStandardMaterial
          color="#00FF7F"
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Lollipops */}
      <mesh position={[0, 3, -5]} castShadow>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial
          color="#FF1493"
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 2, -5]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 2]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Gummy Collectibles */}
      {collectibles.map((collectible, index) => (
        <mesh key={index} position={collectible.position} castShadow>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial
            color={collectible.color}
            transparent
            opacity={0.9}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Syrup River */}
      <mesh position={[0, 0.1, 3]} receiveShadow>
        <planeGeometry args={[8, 2]} />
        <meshStandardMaterial
          color="#87CEEB"
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

export default CandyWorld;
