import { useState, useEffect, useCallback } from 'react';

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  dash: boolean;
  pause: boolean;
  camera: boolean;
  reset: boolean;
  debug: boolean;
}

export interface InputActions {
  getInputVector: () => [number, number, number];
  isMovementInput: () => boolean;
  isJumpPressed: () => boolean;
  isDashPressed: () => boolean;
  resetJumpInput: () => void;
  resetDashInput: () => void;
}

export const useInput = (isPaused: boolean = false): [InputState, InputActions] => {
  const [inputState, setInputState] = useState<InputState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    dash: false,
    pause: false,
    camera: false,
    reset: false,
    debug: false
  });

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default for game keys
      const gameKeys = [
        'Space', 'KeyW', 'KeyS', 'KeyA', 'KeyD', 
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'ShiftLeft', 'ShiftRight', 'Escape', 'KeyC', 'KeyR', 'F1'
      ];
      
      if (gameKeys.includes(event.code)) {
        event.preventDefault();
      }

      switch (event.code) {
        case 'Space':
          setInputState(prev => ({ ...prev, jump: true }));
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
        case 'Escape':
          setInputState(prev => ({ ...prev, pause: true }));
          break;
        case 'KeyC':
          setInputState(prev => ({ ...prev, camera: true }));
          break;
        case 'KeyR':
          setInputState(prev => ({ ...prev, reset: true }));
          break;
        case 'F1':
          setInputState(prev => ({ ...prev, debug: true }));
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
        case 'Escape':
          setInputState(prev => ({ ...prev, pause: false }));
          break;
        case 'KeyC':
          setInputState(prev => ({ ...prev, camera: false }));
          break;
        case 'KeyR':
          setInputState(prev => ({ ...prev, reset: false }));
          break;
        case 'F1':
          setInputState(prev => ({ ...prev, debug: false }));
          break;
      }
    };

    if (!isPaused) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused]);

  // Input utility functions
  const getInputVector = useCallback((): [number, number, number] => {
    let x = 0;
    let z = 0;
    
    if (inputState.forward) z -= 1;
    if (inputState.backward) z += 1;
    if (inputState.left) x -= 1;
    if (inputState.right) x += 1;
    
    // Normalize diagonal movement
    const length = Math.sqrt(x * x + z * z);
    if (length > 0) {
      x /= length;
      z /= length;
    }
    
    return [x, z, 0];
  }, [inputState.forward, inputState.backward, inputState.left, inputState.right]);

  const isMovementInput = useCallback((): boolean => {
    return inputState.forward || inputState.backward || inputState.left || inputState.right;
  }, [inputState.forward, inputState.backward, inputState.left, inputState.right]);

  const isJumpPressed = useCallback((): boolean => {
    return inputState.jump;
  }, [inputState.jump]);

  const isDashPressed = useCallback((): boolean => {
    return inputState.dash;
  }, [inputState.dash]);

  const resetJumpInput = useCallback(() => {
    setInputState(prev => ({ ...prev, jump: false }));
  }, []);

  const resetDashInput = useCallback(() => {
    setInputState(prev => ({ ...prev, dash: false }));
  }, []);

  const actions: InputActions = {
    getInputVector,
    isMovementInput,
    isJumpPressed,
    isDashPressed,
    resetJumpInput,
    resetDashInput
  };

  return [inputState, actions];
};



