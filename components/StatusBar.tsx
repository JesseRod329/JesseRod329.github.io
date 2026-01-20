
import React from 'react';
import { Icon } from './Icon';

export const StatusBar: React.FC = () => {
  return (
    <footer className="h-6 bg-[#149cb8] text-[#17191c] text-[11px] font-bold flex items-center justify-between px-3 select-none z-50 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2">
          <Icon name="source" size={14} />
          <span>main*</span>
        </div>
        <div className="flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2">
          <Icon name="sync" size={14} />
          <span className="hidden sm:inline">0</span>
        </div>
        <div className="flex items-center gap-2 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2">
          <div className="flex items-center gap-1">
            <Icon name="error" size={14} className="text-red-900" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="warning" size={14} className="text-yellow-900" />
            <span>0</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2">
          <Icon name="my_location" size={14} />
          <span>Ln 7, Col 42</span>
        </div>
        <div className="hidden md:flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2">
          <span>Spaces: 2</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2">
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2">
          <Icon name="javascript" size={14} />
          <span>TypeScript React</span>
        </div>
        <div className="flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer h-full px-2">
          <Icon name="notifications" size={14} />
        </div>
      </div>
    </footer>
  );
};
