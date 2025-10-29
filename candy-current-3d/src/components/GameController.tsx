import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import ParticleSystem from './ParticleSystem';

interface GameControllerProps {
  onScoreUpdate: (score: number) => void;
  onPelletCollected: (type: string) => void;
  onPlatformReached: (platformId: string) => void;
}

interface PlayerState {
  isGrounded: boolean;
  canJump: boolean;
  velocity: [number, number, number];
  score: number;
  lives: number;
  lastGroundedTime: number;
  jumpCount: number;
  maxJumps: number;
}

interface InputBuffer {
  jumpBuffer: number;
  lastJumpInput: number;
  inputSmoothing: {
    forward: number;
    backward: number;
    left: number;
    right: number;
  };
}

const GameController = React.forwardRef<any, GameControllerProps>(({
  onScoreUpdate,
  onPelletCollected,
  onPlatformReached
}, ref) => {
  
  // Enhanced game state with stable controls
  const [playerState, setPlayerState] = useState<PlayerState>({
    isGrounded: false,
    canJump: true,
    velocity: [0, 0, 0],
    score: 0,
    lives: 3,
    lastGroundedTime: 0,
    jumpCount: 0,
    maxJumps: 2
  });

  // Input buffer for smooth control
  const [inputBuffer, setInputBuffer] = useState<InputBuffer>({
    jumpBuffer: 0,
    lastJumpInput: 0,
    inputSmoothing: {
      forward: 0,
      backward: 0,
      left: 0,
      right: 0
    }
  });
  
  // Enhanced side-scrolling movement constants
  const moveForce = 18; // More responsive movement
  const jumpForce = 22; // Higher jump for better platforming
  const dashForce = 35; // More dash power for side-scrolling
  const maxHorizontalSpeed = 22; // Higher horizontal speed for side-scrolling
  const maxVerticalSpeed = 28;
  const groundedThreshold = 0.15; // More sensitive grounded detection
  const coyoteTime = 200; // Increased grace time for better jump feel
  const jumpBufferTime = 250; // Longer jump buffer window
  const inputSmoothingFactor = 0.25; // More responsive for side-scrolling
  
  // Simplified physics body for stability
  const [sphereRef, api] = useSphere(() => ({
    mass: 1,
    position: [0, 3, 0], // Start closer to ground
    radius: 0.4,
    material: {
      friction: 0.6,
      restitution: 0.2
    },
    userData: { type: 'player' },
    onCollide: (e) => {
      const { contact, target } = e;
      const otherBody = contact.bi === target ? contact.bj : contact.bi;
      const otherUserData = otherBody.userData;
      
      // Enhanced collision detection with raycast-like precision
      if (otherUserData.type === 'platform' || otherUserData.type === 'ground') {
        const contactPoint = contact.contactPoint;
        const playerPos = sphereRef.current?.position;
        
        if (playerPos && contactPoint.y < playerPos.y - 0.25) {
          setPlayerState(prev => ({
            ...prev,
            isGrounded: true,
            canJump: true,
            jumpCount: 0,
            lastGroundedTime: Date.now()
          }));
          
          if (otherUserData.platformId) {
            onPlatformReached(otherUserData.platformId);
          }
        }
      }
      
      // Enhanced pellet collision
      if (otherUserData.type === 'pellet') {
        const pelletType = otherUserData.pelletType;
        const points = pelletType === 'power' ? 100 : pelletType === 'bonus' ? 50 : 10;
        
        setPlayerState(prev => ({
          ...prev,
          score: prev.score + points
        }));
        
        onScoreUpdate(playerState.score + points);
        onPelletCollected(pelletType);
        
        // Remove pellet by setting its position far away
        otherBody.position.set(1000, 1000, 1000);
      }
    }
  }));

  // Enhanced input handling with smoothing
  const [inputState, setInputState] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    dash: false
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      
      switch (event.code) {
        case 'Space':
          setInputState(prev => ({ ...prev, jump: true }));
          setInputBuffer(prev => ({
            ...prev,
            jumpBuffer: jumpBufferTime,
            lastJumpInput: Date.now()
          }));
          break;
        case 'KeyW':
        case 'ArrowUp':
          setInputState(prev => ({ ...prev, forward: true }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setInputState(prev => ({ ...prev, backward: true }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setInputState(prev => ({ ...prev, left: true }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setInputState(prev => ({ ...prev, right: true }));
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setInputState(prev => ({ ...prev, dash: true }));
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      
      switch (event.code) {
        case 'Space':
          setInputState(prev => ({ ...prev, jump: false }));
          break;
        case 'KeyW':
        case 'ArrowUp':
          setInputState(prev => ({ ...prev, forward: false }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setInputState(prev => ({ ...prev, backward: false }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setInputState(prev => ({ ...prev, left: false }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setInputState(prev => ({ ...prev, right: false }));
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setInputState(prev => ({ ...prev, dash: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Velocity clamping utility
  const clampVelocity = useCallback((velocity: [number, number, number]): [number, number, number] => {
    const [x, y, z] = velocity;
    
    // Clamp horizontal velocity
    const horizontalSpeed = Math.sqrt(x * x + z * z);
    if (horizontalSpeed > maxHorizontalSpeed) {
      const factor = maxHorizontalSpeed / horizontalSpeed;
      return [x * factor, Math.max(-maxVerticalSpeed, Math.min(maxVerticalSpeed, y)), z * factor];
    }
    
    // Clamp vertical velocity
    const clampedY = Math.max(-maxVerticalSpeed, Math.min(maxVerticalSpeed, y));
    
    return [x, clampedY, z];
  }, [maxHorizontalSpeed, maxVerticalSpeed]);

  // Enhanced physics update with stable control
  useFrame((state, delta) => {
    if (!sphereRef.current) return;
    
    // Update velocity from physics
    api.velocity.subscribe((v) => {
      setPlayerState(prev => ({
        ...prev,
        velocity: v
      }));
      
      // Enhanced grounded detection with coyote time
      const now = Date.now();
      const timeSinceGrounded = now - playerState.lastGroundedTime;
      const isCurrentlyGrounded = v[1] < groundedThreshold && Math.abs(v[1]) < 0.3;
      const isCoyoteGrounded = timeSinceGrounded < coyoteTime && !isCurrentlyGrounded;
      
      setPlayerState(prev => ({
        ...prev,
        isGrounded: isCurrentlyGrounded || isCoyoteGrounded
      }));
      
      // Expose player data to parent for camera
      if (ref && typeof ref === 'object' && ref.current) {
        ref.current.position = sphereRef.current.position;
        ref.current.velocity = v;
        ref.current.isGrounded = isCurrentlyGrounded || isCoyoteGrounded;
      }
    });

    // Smooth input interpolation
    setInputBuffer(prev => ({
      ...prev,
      inputSmoothing: {
        forward: inputState.forward 
          ? Math.min(1, prev.inputSmoothing.forward + inputSmoothingFactor / delta)
          : Math.max(0, prev.inputSmoothing.forward - inputSmoothingFactor / delta),
        backward: inputState.backward 
          ? Math.min(1, prev.inputSmoothing.backward + inputSmoothingFactor / delta)
          : Math.max(0, prev.inputSmoothing.backward - inputSmoothingFactor / delta),
        left: inputState.left 
          ? Math.min(1, prev.inputSmoothing.left + inputSmoothingFactor / delta)
          : Math.max(0, prev.inputSmoothing.left - inputSmoothingFactor / delta),
        right: inputState.right 
          ? Math.min(1, prev.inputSmoothing.right + inputSmoothingFactor / delta)
          : Math.max(0, prev.inputSmoothing.right - inputSmoothingFactor / delta)
      }
    }));

    // Calculate movement forces with smooth interpolation
    const smoothForward = inputBuffer.inputSmoothing.forward;
    const smoothBackward = inputBuffer.inputSmoothing.backward;
    const smoothLeft = inputBuffer.inputSmoothing.left;
    const smoothRight = inputBuffer.inputSmoothing.right;

    let impulseX = 0;
    let impulseZ = 0;

    // Apply smooth movement forces
    if (smoothForward > 0) impulseZ -= moveForce * smoothForward;
    if (smoothBackward > 0) impulseZ += moveForce * smoothBackward;
    if (smoothLeft > 0) impulseX -= moveForce * smoothLeft;
    if (smoothRight > 0) impulseX += moveForce * smoothRight;

    // Apply dash multiplier
    if (inputState.dash && playerState.isGrounded) {
      impulseX *= 1.8;
      impulseZ *= 1.8;
      
      // Trigger dash particle effect
      setParticleEffects(prev => ({ ...prev, dash: true }));
      setTimeout(() => setParticleEffects(prev => ({ ...prev, dash: false })), 150);
    }

    // Apply movement impulses with delta time for consistency
    if (impulseX !== 0 || impulseZ !== 0) {
      api.applyImpulse([impulseX * delta * 60, 0, impulseZ * delta * 60], [0, 0, 0]);
    }

    // Jump buffer system - check if jump was pressed recently
    const now = Date.now();
    const timeSinceJumpInput = now - inputBuffer.lastJumpInput;
    const canJumpFromBuffer = timeSinceJumpInput < jumpBufferTime && inputBuffer.jumpBuffer > 0;

    // Handle jumping with buffer
    if ((inputState.jump || canJumpFromBuffer) && 
        playerState.canJump && 
        (playerState.isGrounded || playerState.jumpCount < playerState.maxJumps)) {
      
      const jumpImpulse = playerState.jumpCount === 0 ? jumpForce : jumpForce * 0.85;
      api.applyImpulse([0, jumpImpulse, 0], [0, 0, 0]);
      
      setPlayerState(prev => ({
        ...prev,
        canJump: false,
        jumpCount: prev.jumpCount + 1,
        isGrounded: false
      }));
      
      // Trigger jump particle effect
      setParticleEffects(prev => ({ ...prev, jump: true }));
      setTimeout(() => setParticleEffects(prev => ({ ...prev, jump: false })), 100);
      
      // Clear jump buffer
      setInputBuffer(prev => ({
        ...prev,
        jumpBuffer: 0
      }));
      
      // Reset jump cooldown
      setTimeout(() => {
        setPlayerState(prev => ({ ...prev, canJump: true }));
      }, 100);
    }

    // Decay jump buffer
    if (inputBuffer.jumpBuffer > 0) {
      setInputBuffer(prev => ({
        ...prev,
        jumpBuffer: Math.max(0, prev.jumpBuffer - delta * 1000)
      }));
    }

    // Velocity clamping for stability
    const currentVelocity = playerState.velocity;
    const clampedVelocity = clampVelocity(currentVelocity);
    
    // Apply clamped velocity if needed
    if (Math.abs(currentVelocity[0] - clampedVelocity[0]) > 0.1 || 
        Math.abs(currentVelocity[1] - clampedVelocity[1]) > 0.1 || 
        Math.abs(currentVelocity[2] - clampedVelocity[2]) > 0.1) {
      api.velocity.set(...clampedVelocity);
    }
  });

  // Reset position if fallen too far
  useEffect(() => {
    const unsubscribe = api.position.subscribe((pos) => {
      if (pos[1] < -20) {
        // Reset position with stable velocity
        api.position.set(0, 5, 0);
        api.velocity.set(0, 0, 0);
        setPlayerState(prev => ({
          ...prev,
          lives: Math.max(0, prev.lives - 1),
          isGrounded: false,
          jumpCount: 0
        }));
      }
    });
    
    return unsubscribe;
  }, [api]);

  // Enhanced animation state with smooth transitions
  const [animationState, setAnimationState] = useState({
    scale: [1, 1, 1] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    colorIntensity: 1
  });

  // Particle effects state
  const [particleEffects, setParticleEffects] = useState({
    jump: false,
    collect: false,
    dash: false,
    land: false
  });

  // Update animation based on player state with smooth transitions
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Squash and stretch based on grounded state
    let scaleY = 1;
    if (!playerState.isGrounded) {
      scaleY = 0.8 + Math.sin(time * 8) * 0.1; // Bounce when falling
    } else {
      scaleY = 1 + Math.sin(time * 4) * 0.05; // Gentle idle animation
    }
    
    // Rotation based on movement with smoothing
    const targetRotationY = inputState.left ? -0.15 : inputState.right ? 0.15 : 0;
    const currentRotationY = animationState.rotation[1];
    const smoothedRotationY = THREE.MathUtils.lerp(currentRotationY, targetRotationY, delta * 5);
    
    // Color intensity based on movement speed
    const speed = Math.sqrt(playerState.velocity[0]**2 + playerState.velocity[2]**2);
    const targetIntensity = 1 + Math.min(speed / 10, 0.5);
    const smoothedIntensity = THREE.MathUtils.lerp(animationState.colorIntensity, targetIntensity, delta * 3);
    
    setAnimationState({
      scale: [1, scaleY, 1],
      rotation: [0, smoothedRotationY, 0],
      colorIntensity: smoothedIntensity
    });
  });

  return (
    <group>
      {/* Enhanced player character with stable visuals */}
      <mesh 
        ref={sphereRef} 
        castShadow 
        receiveShadow
        scale={animationState.scale}
        rotation={animationState.rotation}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={playerState.isGrounded ? "#8B5CF6" : "#FFFF00"}
          roughness={0.1}
          metalness={0.1}
          emissive={playerState.isGrounded ? "#8B5CF6" : "#FFFF00"}
          emissiveIntensity={0.3 * animationState.colorIntensity}
        />
        
        {/* Enhanced eyes with movement */}
        <mesh position={[-0.1, 0.1, 0.35]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial 
            color="#000000" 
            emissive="#000000" 
            emissiveIntensity={0.2 * animationState.colorIntensity} 
          />
        </mesh>
        <mesh position={[0.1, 0.1, 0.35]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial 
            color="#000000" 
            emissive="#000000" 
            emissiveIntensity={0.2 * animationState.colorIntensity} 
          />
        </mesh>
        
        {/* Enhanced ground indicator with pulsing */}
        {playerState.isGrounded && (
          <mesh position={[0, -0.5, 0]}>
            <ringGeometry args={[0.3, 0.5, 16]} />
            <meshStandardMaterial
              color="#4CAF50"
              transparent
              opacity={0.6 * animationState.colorIntensity}
              emissive="#4CAF50"
              emissiveIntensity={0.4 * animationState.colorIntensity}
            />
          </mesh>
        )}
      </mesh>
      
      {/* Enhanced movement trail with speed-based opacity */}
      {!playerState.isGrounded && (
        <mesh position={[0, -0.8, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#FFFF00"
            transparent
            opacity={0.8 * animationState.colorIntensity}
            emissive="#FFFF00"
            emissiveIntensity={0.5 * animationState.colorIntensity}
          />
        </mesh>
      )}
      
      {/* Jump count indicator with smooth scaling */}
      {playerState.jumpCount > 0 && (
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#FF6B6B"
            emissive="#FF6B6B"
            emissiveIntensity={0.5 * animationState.colorIntensity}
          />
        </mesh>
      )}
      
      {/* Input buffer indicator (debug) */}
      {inputBuffer.jumpBuffer > 0 && (
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial
            color="#00FF00"
            emissive="#00FF00"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
      
      {/* Debug indicators */}
      {inputState.left && (
        <mesh position={[-0.8, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#FF0000" emissive="#FF0000" />
        </mesh>
      )}
      {inputState.right && (
        <mesh position={[0.8, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#00FF00" emissive="#00FF00" />
        </mesh>
      )}
      {inputState.jump && (
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#0000FF" emissive="#0000FF" />
        </mesh>
      )}
    </group>
  );
});

GameController.displayName = 'GameController';

export default GameController;