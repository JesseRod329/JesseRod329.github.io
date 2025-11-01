import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';

interface GhostProps {
  position: [number, number, number];
  color: string;
  playerPosition: THREE.Vector3;
  isPlayerPoweredUp: boolean;
  onPlayerCaught: () => void;
}

const Ghost: React.FC<GhostProps> = ({ 
  position, 
  color, 
  playerPosition, 
  isPlayerPoweredUp,
  onPlayerCaught 
}) => {
  const [ghostRef, api] = useSphere(() => ({
    mass: 1,
    position,
    radius: 0.4,
    material: {
      friction: 0.1,
      restitution: 0.1
    },
    userData: { type: 'ghost' },
    onCollide: (e) => {
      const { contact, target } = e;
      const otherBody = contact.bi === target ? contact.bj : contact.bi;
      
      if (otherBody.userData.type === 'player') {
        if (isPlayerPoweredUp) {
          // Ghost is vulnerable - respawn
          api.position.set(position[0], position[1], position[2]);
        } else {
          // Player caught
          onPlayerCaught();
        }
      }
    }
  }));

  const [isVulnerable, setIsVulnerable] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<THREE.Vector3>(new THREE.Vector3());
  const [moveDirection, setMoveDirection] = useState(new THREE.Vector3(1, 0, 0));

  // Ghost AI - simple chase behavior
  useFrame((state, delta) => {
    if (!ghostRef.current) return;

    const ghostPos = ghostRef.current.position;
    const distanceToPlayer = ghostPos.distanceTo(playerPosition);

    // Update vulnerability state
    setIsVulnerable(isPlayerPoweredUp);

    // Simple AI: move towards player
    const direction = playerPosition.clone().sub(ghostPos).normalize();
    
    // Add some randomness to make movement less predictable
    const randomFactor = 0.3;
    direction.x += (Math.random() - 0.5) * randomFactor;
    direction.z += (Math.random() - 0.5) * randomFactor;
    direction.normalize();

    // Apply movement
    const speed = isVulnerable ? 3 : 6; // Slower when vulnerable
    const force = speed * delta * 60;
    api.applyImpulse([direction.x * force, 0, direction.z * force], [0, 0, 0]);

    // Limit speed
    api.velocity.subscribe((velocity) => {
      const currentSpeed = Math.sqrt(velocity[0] ** 2 + velocity[2] ** 2);
      const maxSpeed = isVulnerable ? 8 : 12;
      if (currentSpeed > maxSpeed) {
        const factor = maxSpeed / currentSpeed;
        api.velocity.set(velocity[0] * factor, velocity[1], velocity[2] * factor);
      }
    });

    // Update movement direction for animation
    setMoveDirection(direction);
  });

  // Ghost animation
  const bodyRef = useRef<THREE.Group>(null);
  const eyeRefs = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    if (bodyRef.current) {
      const time = state.clock.elapsedTime;
      // Floating animation
      bodyRef.current.position.y = Math.sin(time * 2) * 0.1;
      
      // Rotation based on movement
      if (moveDirection.length() > 0.1) {
        const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
        bodyRef.current.rotation.y = THREE.MathUtils.lerp(bodyRef.current.rotation.y, targetRotation, 0.1);
      }
    }

    // Eye tracking
    eyeRefs.current.forEach(eyeRef => {
      if (eyeRef) {
        const direction = playerPosition.clone().sub(eyeRef.position).normalize();
        eyeRef.lookAt(eyeRef.position.clone().add(direction));
      }
    });
  });

  return (
    <group ref={bodyRef}>
      {/* Ghost Body */}
      <mesh ref={ghostRef} castShadow receiveShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={isVulnerable ? "#0000FF" : color}
          emissive={isVulnerable ? "#0000FF" : color}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Ghost Eyes */}
      <group ref={(ref) => { if (ref) eyeRefs.current[0] = ref; }} position={[-0.15, 0.1, 0.3]}>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      <group ref={(ref) => { if (ref) eyeRefs.current[1] = ref; }} position={[0.15, 0.1, 0.3]}>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Ghost Bottom Wavy Effect */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 8]} />
        <meshStandardMaterial
          color={isVulnerable ? "#0000FF" : color}
          emissive={isVulnerable ? "#0000FF" : color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Vulnerability indicator */}
      {isVulnerable && (
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
    </group>
  );
};

export default Ghost;




