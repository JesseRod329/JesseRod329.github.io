import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '/', description: 'Focus search bar' },
    { key: 'ESC', description: 'Clear selection / Close modals' },
    { key: 'SPACE', description: 'Pause/Resume auto-rotation' },
    { key: '?', description: 'Show this help' },
    { key: '←→↑↓', description: 'Rotate globe manually' },
    { key: 'SHIFT + Click', description: 'Add to comparison' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-cyber-black border-2 border-cyber-cyan w-full max-w-md">
        <div className="bg-cyber-cyan/10 border-b border-cyber-cyan/30 p-4 flex justify-between items-center">
          <h2 className="text-cyber-cyan font-mono text-lg font-bold flex items-center gap-2">
            <Keyboard size={20} />
            KEYBOARD SHORTCUTS
          </h2>
          <button
            onClick={onClose}
            className="text-cyber-cyan hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-300 font-mono text-sm">{shortcut.description}</span>
              <kbd className="bg-cyber-cyan/20 border border-cyber-cyan/50 text-cyber-cyan px-3 py-1 rounded font-mono text-sm">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

