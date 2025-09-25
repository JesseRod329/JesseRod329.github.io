import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface SoundManagerRef {
  playSound: (sound: string) => void;
  setVolume: (volume: number) => void;
}

interface SoundManagerProps {
  enabled: boolean;
}

const SoundManager = forwardRef<SoundManagerRef, SoundManagerProps>(
  ({ enabled }, ref) => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const volumeRef = useRef(0.5);

    useImperativeHandle(ref, () => ({
      playSound: (sound: string) => {
        if (!enabled || !audioContextRef.current) return;
        
        const audioContext = audioContextRef.current;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different sounds for different actions
        switch (sound) {
          case 'spray':
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1 * volumeRef.current, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
          case 'brush':
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.05 * volumeRef.current, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        }
      },
      setVolume: (volume: number) => {
        volumeRef.current = Math.max(0, Math.min(1, volume));
      }
    }));

    // Initialize audio context on first user interaction
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    return (
      <div 
        className="hidden"
        onClick={initAudioContext}
        onTouchStart={initAudioContext}
      />
    );
  }
);

SoundManager.displayName = 'SoundManager';

export default SoundManager;
