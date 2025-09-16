import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three'; // Re-add this import
import { TextureLoader } from 'three';
import type { Project } from '../types/project';

interface ProjectObjectProps {
  project: Project;
  position: [number, number, number];
}

const ProjectObject: React.FC<ProjectObjectProps> = ({ project, position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, project.image || '');

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

export default ProjectObject;