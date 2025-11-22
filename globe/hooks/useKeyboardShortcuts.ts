import { useEffect } from 'react';

interface KeyboardShortcutsConfig {
  onSearch?: () => void;
  onClearSelection?: () => void;
  onToggleRotation?: () => void;
  onHelp?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onRotateUp?: () => void;
  onRotateDown?: () => void;
}

export const useKeyboardShortcuts = (config: KeyboardShortcutsConfig) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '/':
          e.preventDefault();
          config.onSearch?.();
          break;
        case 'Escape':
          config.onClearSelection?.();
          break;
        case ' ':
          e.preventDefault();
          config.onToggleRotation?.();
          break;
        case '?':
          config.onHelp?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          config.onRotateLeft?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          config.onRotateRight?.();
          break;
        case 'ArrowUp':
          e.preventDefault();
          config.onRotateUp?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          config.onRotateDown?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config]);
};

