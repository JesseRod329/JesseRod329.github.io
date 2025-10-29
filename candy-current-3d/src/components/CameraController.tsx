import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, MathUtils } from 'three';

interface CameraControllerProps {
  target: React.RefObject<any>;
  isPaused?: boolean;
}

const CameraController: React.FC<CameraControllerProps> = ({ target, isPaused = false }) => {
  const { camera } = useThree();
  
  // Side-scrolling camera state
  const [cameraMode, setCameraMode] = useState<'sidescroll' | 'follow' | 'orbit'>('sidescroll');
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  
  // Camera vectors for side-scrolling
  const cameraTarget = useRef(new Vector3());
  const lookAtTarget = useRef(new Vector3());
  const smoothedPosition = useRef(new Vector3());
  const smoothedLookAt = useRef(new Vector3());
  
  // Side-scrolling camera settings
  const sideScrollOffset = new Vector3(15, 8, 0); // Fixed side view
  const followSpeed = 0.1;
  const deadZone = 2; // Horizontal dead zone for smoother following
  
  // Enhanced mouse controls for side-scrolling
  useEffect(() => {
    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 1) { // Middle mouse button
        event.preventDefault();
        isMouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        setIsOrbiting(true);
        setCameraMode('orbit');
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 1) {
        isMouseDown = false;
        setIsOrbiting(false);
        setCameraMode('sidescroll');
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isMouseDown && isOrbiting) {
        const deltaX = event.clientX - lastMouseX;
        const deltaY = event.clientY - lastMouseY;
        
        setOrbitAngle(prev => prev + deltaX * 0.01);
        
        // Adjust camera height based on mouse Y movement
        sideScrollOffset.y = Math.max(4, Math.min(15, sideScrollOffset.y - deltaY * 0.01));
        
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9;
      
      sideScrollOffset.multiplyScalar(zoomFactor);
      sideScrollOffset.clampLength(8, 25);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isOrbiting]);

  // Keyboard camera controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isPaused) return;
      
      switch (event.code) {
        case 'KeyC':
          // Cycle camera modes
          setCameraMode(prev => {
            const modes: Array<'sidescroll' | 'follow' | 'orbit'> = ['sidescroll', 'follow', 'orbit'];
            const currentIndex = modes.indexOf(prev);
            return modes[(currentIndex + 1) % modes.length];
          });
          break;
          
        case 'KeyR':
          // Reset camera to side-scroll
          sideScrollOffset.set(15, 8, 0);
          setOrbitAngle(0);
          setCameraMode('sidescroll');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused]);

  // Simplified side-scrolling camera update
  useFrame((state, delta) => {
    if (!target?.current || isPaused) return;

    const playerPosition = target.current.position;
    
    // Simple side-scrolling camera - follow player horizontally
    const targetX = playerPosition.x + 15;
    const targetY = playerPosition.y + 8;
    const targetZ = 0;
    
    // Smooth camera movement
    camera.position.lerp(new Vector3(targetX, targetY, targetZ), followSpeed);
    camera.lookAt(playerPosition.x, playerPosition.y + 1, playerPosition.z);
  });


  return null; // This component doesn't render anything
};

export default CameraController;