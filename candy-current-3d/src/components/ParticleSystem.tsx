import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
}

interface ParticleSystemProps {
  position: [number, number, number];
  type: 'jump' | 'collect' | 'dash' | 'land';
  active: boolean;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ position, type, active }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particles = useRef<Particle[]>([]);
  
  // Create particles based on type
  const createParticles = () => {
    const newParticles: Particle[] = [];
    const count = type === 'jump' ? 8 : type === 'collect' ? 12 : type === 'dash' ? 15 : 6;
    
    for (let i = 0; i < count; i++) {
      const particle: Particle = {
        position: new THREE.Vector3(position[0], position[1], position[2]),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * (type === 'dash' ? 8 : 4),
          Math.random() * (type === 'jump' ? 6 : 3) + (type === 'jump' ? 2 : 0),
          (Math.random() - 0.5) * (type === 'dash' ? 8 : 4)
        ),
        life: 0,
        maxLife: type === 'collect' ? 1.5 : type === 'dash' ? 0.8 : 1.2,
        size: Math.random() * 0.1 + 0.05,
        color: new THREE.Color()
      };
      
      // Set colors based on type
      switch (type) {
        case 'jump':
          particle.color.setHSL(0.6, 0.8, 0.7); // Blue
          break;
        case 'collect':
          particle.color.setHSL(0.15, 0.9, 0.8); // Gold
          break;
        case 'dash':
          particle.color.setHSL(0.0, 0.9, 0.8); // Red
          break;
        case 'land':
          particle.color.setHSL(0.3, 0.8, 0.6); // Green
          break;
      }
      
      newParticles.push(particle);
    }
    
    particles.current = newParticles;
  };
  
  // Initialize particles when active
  React.useEffect(() => {
    if (active) {
      createParticles();
    }
  }, [active, type, position]);
  
  // Update particles
  useFrame((state, delta) => {
    if (!particlesRef.current || !active) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
    
    let needsUpdate = false;
    
    particles.current.forEach((particle, i) => {
      if (particle.life >= particle.maxLife) return;
      
      // Update particle
      particle.life += delta;
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));
      particle.velocity.y -= 15 * delta; // Gravity
      particle.velocity.multiplyScalar(0.98); // Damping
      
      // Update positions
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
      
      // Update colors with fade
      const alpha = 1 - (particle.life / particle.maxLife);
      colors[i * 3] = particle.color.r;
      colors[i * 3 + 1] = particle.color.g;
      colors[i * 3 + 2] = particle.color.b;
      
      needsUpdate = true;
    });
    
    if (needsUpdate) {
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });
  
  // Create geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particles.current.length * 3);
    const colors = new Float32Array(particles.current.length * 3);
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geo;
  }, []);
  
  if (!active || particles.current.length === 0) return null;
  
  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.1}
        transparent
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleSystem;



