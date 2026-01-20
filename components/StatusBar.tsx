
import React from 'react';
import { Icon } from './Icon';

export const StatusBar: React.FC = () => {
  return (
    <footer className="h-5 bg-[#010409] text-slate-500 text-[10px] flex items-center justify-between px-3 border-t border-[#21262d] select-none z-50 shrink-0">
      <div className="flex items-center gap-4">
        <a 
          href="https://github.com/JesseRod329" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          <Icon name="code" size={12} />
          <span>JesseRod329</span>
        </a>
        <div className="flex items-center gap-1">
          <Icon name="source" size={12} />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-600/70">
          <Icon name="check_circle" size={12} />
          <span>22 projects</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1">
          <span>San Francisco, CA</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse"></div>
          <span>Open to Work</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="javascript" size={12} />
          <span>TypeScript React</span>
        </div>
      </div>
    </footer>
  );
};
