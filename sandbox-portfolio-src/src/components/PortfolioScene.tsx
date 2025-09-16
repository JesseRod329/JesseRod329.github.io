import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei'; // Import Stars for particle background
import * as THREE from 'three';
import projectsData from '../data/projects.json';
import type { Project } from '../types/project';
import ProjectObject from './ProjectObject'; // Import ProjectObject

// Component to handle particle animation
const Particles = () => {
  const ref = useRef<THREE.Points>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.0005;
      ref.current.rotation.y += 0.0008;
    }
  });
  return <Stars ref={ref} radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />;
};

const PortfolioScene: React.FC = () => {
  const projects: Project[] = (projectsData as Project[]).filter(p => !p.hidden);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[1, 1, 1]} intensity={0.5} />

      <Particles />

      {projects.map((project, i) => {
        const angle = (i / projects.length) * Math.PI * 2;
        const radius = 5;
        const position: [number, number, number] = [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0,
        ];
        return <ProjectObject key={project.slug} project={project} position={position} />; // Use ProjectObject
      })}

      <OrbitControls enableDamping dampingFactor={0.25} screenSpacePanning={false} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  );
};

export default PortfolioScene;