import React, { useRef, useEffect } from 'react';

interface SoundSystemProps {
  onPelletCollected?: (type: string) => void;
  onPlayerCaught?: () => void;
  onPowerUp?: () => void;
}

const SoundSystem: React.FC<SoundSystemProps> = ({ 
  onPelletCollected, 
  onPlayerCaught, 
  onPowerUp 
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundsRef = useRef<{ [key: string]: AudioBuffer }>({});

  useEffect(() => {
    // Initialize Web Audio API
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create simple sound effects using Web Audio API
        const createTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
          if (!audioContextRef.current) return;
          
          const oscillator = audioContextRef.current.createOscillator();
          const gainNode = audioContextRef.current.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContextRef.current.destination);
          
          oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
          oscillator.type = type;
          
          gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
          
          oscillator.start(audioContextRef.current.currentTime);
          oscillator.stop(audioContextRef.current.currentTime + duration);
        };

        // Store sound creation functions
        soundsRef.current = {
          pellet: () => createTone(800, 0.1, 'square'),
          powerPellet: () => createTone(1200, 0.3, 'sawtooth'),
          playerCaught: () => createTone(200, 0.5, 'triangle'),
          powerUp: () => createTone(600, 0.2, 'sine')
        };
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    };

    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play sound effects
  const playSound = (soundName: string) => {
    if (soundsRef.current[soundName]) {
      try {
        soundsRef.current[soundName]();
      } catch (error) {
        console.warn('Error playing sound:', error);
      }
    }
  };

  // Expose sound functions to parent components
  React.useEffect(() => {
    if (onPelletCollected) {
      const originalOnPelletCollected = onPelletCollected;
      onPelletCollected = (type: string) => {
        playSound(type === 'power' ? 'powerPellet' : 'pellet');
        originalOnPelletCollected(type);
      };
    }

    if (onPlayerCaught) {
      const originalOnPlayerCaught = onPlayerCaught;
      onPlayerCaught = () => {
        playSound('playerCaught');
        originalOnPlayerCaught();
      };
    }

    if (onPowerUp) {
      const originalOnPowerUp = onPowerUp;
      onPowerUp = () => {
        playSound('powerUp');
        originalOnPowerUp();
      };
    }
  }, [onPelletCollected, onPlayerCaught, onPowerUp]);

  return null; // This component doesn't render anything
};

export default SoundSystem;