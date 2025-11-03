import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleEffectProps {
  position: [number, number, number];
  color: string;
  duration?: number;
  particleCount?: number;
}

// Pellet collection particle effect
export const PelletCollectionEffect: React.FC<ParticleEffectProps> = ({
  position,
  color,
  duration = 1000,
  particleCount = 20
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const startTime = useRef(Date.now());
  const particles = useRef<Array<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    life: number;
    maxLife: number;
  }>>([]);

  // Initialize particles
  useEffect(() => {
    particles.current = Array.from({ length: particleCount }, () => ({
      position: new THREE.Vector3(...position),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        Math.random() * 8 + 2,
        (Math.random() - 0.5) * 10
      ),
      life: 1,
      maxLife: 1
    }));
  }, [position, particleCount]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const elapsed = Date.now() - startTime.current;
    if (elapsed > duration) return;

    const temp = new THREE.Object3D();

    particles.current.forEach((particle, index) => {
      // Update particle physics
      particle.velocity.y -= 20 * delta; // Gravity
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));
      particle.life -= delta * 0.5;

      // Update instanced mesh
      if (particle.life > 0) {
        temp.position.copy(particle.position);
        temp.scale.setScalar(particle.life * 0.2);
        temp.updateMatrix();
        meshRef.current.setMatrixAt(index, temp.matrix);
      } else {
        temp.position.set(0, -1000, 0); // Hide particle
        temp.updateMatrix();
        meshRef.current.setMatrixAt(index, temp.matrix);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </instancedMesh>
  );
};

interface GlowEffectProps {
  position: [number, number, number];
  color: string;
  intensity?: number;
  size?: number;
}

// Glowing orb effect for power pellets
export const GlowEffect: React.FC<GlowEffectProps> = ({
  position,
  color,
  intensity = 1,
  size = 1
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const scale = size + Math.sin(time * 3) * 0.2;
    const opacity = 0.5 + Math.sin(time * 2) * 0.3;

    meshRef.current.scale.setScalar(scale);
    if (meshRef.current.material) {
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

interface TrailEffectProps {
  points: THREE.Vector3[];
  color: string;
  width?: number;
}

// Player movement trail effect
export const TrailEffect: React.FC<TrailEffectProps> = ({
  points,
  color,
  width = 0.1
}) => {
  const lineRef = useRef<THREE.Line>(null);

  useEffect(() => {
    if (lineRef.current && points.length > 1) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lineRef.current.geometry = geometry;
    }
  }, [points]);

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color={color} linewidth={width} />
    </line>
  );
};

interface PulseEffectProps {
  position: [number, number, number];
  color: string;
  frequency?: number;
  amplitude?: number;
}

// Pulse effect for platforms
export const PulseEffect: React.FC<PulseEffectProps> = ({
  position,
  color,
  frequency = 2,
  amplitude = 0.1
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const scale = 1 + Math.sin(time * frequency) * amplitude;
    
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <ringGeometry args={[2, 2.5, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Screen flash effect for level completion
interface ScreenFlashProps {
  color: string;
  duration?: number;
  onComplete?: () => void;
}

export const ScreenFlash: React.FC<ScreenFlashProps> = ({
  color,
  duration = 500,
  onComplete
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      
      if (ref.current) {
        const opacity = Math.sin(progress * Math.PI); // Fade in and out
        ref.current.style.opacity = opacity.toString();
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  }, [duration, onComplete]);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: color,
        pointerEvents: 'none',
        zIndex: 1000,
        opacity: 0
      }}
    />
  );
};





