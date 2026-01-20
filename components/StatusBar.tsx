
import React from 'react';
import { Icon } from './Icon';

export const StatusBar: React.FC = () => {
  return (
    <footer className="h-6 bg-[#149cb8] text-[#17191c] text-[11px] font-bold flex items-center justify-between px-3 select-none z-50 shrink-0">
      <div className="flex items-center gap-4">
        <a 
          href="https://github.com/JesseRod329" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2"
        >
          <Icon name="code" size={14} />
          <span>JesseRod329</span>
        </a>
        <div className="flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2">
          <Icon name="source" size={14} />
          <span>main</span>
        </div>
        <div className="flex items-center gap-2 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2">
          <div className="flex items-center gap-1">
            <Icon name="check_circle" size={14} className="text-green-900" />
            <span>12 projects</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <a 
          href="https://jesserodriguez.me" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2"
        >
          <Icon name="language" size={14} />
          <span>jesserodriguez.me</span>
        </a>
        <div className="hidden md:flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2">
          <span>San Francisco, CA</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2">
          <span>Open to Work</span>
        </div>
        <div className="flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2">
          <Icon name="javascript" size={14} />
          <span>TypeScript React</span>
        </div>
        <a 
          href="mailto:jesse@jesserodriguez.me"
          className="flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2"
        >
          <Icon name="mail" size={14} />
        </a>
      </div>
    </footer>
  );
};
