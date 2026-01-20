
import React, { useState } from 'react';
import { Icon } from './Icon';

interface FileTreeItemProps {
  name: string;
  icon: string;
  colorClass?: string;
  isActive?: boolean;
  indent?: number;
  isFolder?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
  href?: string;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ 
  name, icon, colorClass = 'text-slate-500', isActive, indent = 0, isFolder, isOpen, onClick, href 
}) => {
  const content = (
    <>
      {isFolder && (
        <Icon 
          name={isOpen ? 'expand_more' : 'chevron_right'} 
          className="text-slate-600" 
          size={14} 
        />
      )}
      <Icon name={icon} className={colorClass} size={16} />
      <span className={`text-[13px] ${isActive ? 'text-white' : 'text-slate-500'}`}>{name}</span>
    </>
  );

  const className = `
    flex items-center gap-2 px-4 py-1.5 cursor-pointer transition-colors
    ${isActive ? 'bg-[#21262d] text-white' : 'hover:bg-[#161b22]'}
  `;

  if (href) {
    return (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
        style={{ paddingLeft: `${(indent + 1) * 12}px` }}
      >
        {content}
      </a>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={className}
      style={{ paddingLeft: `${(indent + 1) * 12}px` }}
    >
      {content}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [srcOpen, setSrcOpen] = useState(true);

  const scrollToProjects = () => {
    const projectsSection = document.querySelector('[data-projects]');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="w-60 bg-[#010409] flex flex-col border-r border-[#21262d] hidden lg:flex shrink-0 select-none">
      <div className="p-3 pl-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        Explorer
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mt-2">
          <div className="flex items-center gap-1 px-4 py-1 text-[10px] font-bold text-slate-600 group cursor-pointer">
            <Icon name="expand_more" size={12} />
            <span>PORTFOLIO</span>
          </div>

          <div className="mt-1">
            <FileTreeItem 
              name=".github" 
              icon="folder" 
              indent={1} 
              isFolder 
              href="https://github.com/JesseRod329"
            />
            <FileTreeItem 
              name="src" 
              icon={srcOpen ? "folder_open" : "folder"} 
              indent={1} 
              isFolder 
              isOpen={srcOpen}
              onClick={() => setSrcOpen(!srcOpen)}
            />
            
            {srcOpen && (
              <>
                <FileTreeItem name="home.tsx" icon="code" colorClass="text-[#149cb8]" indent={2} isActive />
                <FileTreeItem 
                  name="projects.json" 
                  icon="javascript" 
                  indent={2} 
                  onClick={scrollToProjects}
                />
                <FileTreeItem 
                  name="README.md" 
                  icon="description" 
                  indent={2}
                  href="https://github.com/JesseRod329/JesseRod329.github.io#readme"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="p-4 flex justify-around border-t border-[#21262d]/50">
        <a href="https://github.com/JesseRod329" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#149cb8] transition-colors">
          <Icon name="code" size={16} />
        </a>
        <a href="https://linkedin.com/in/jesse-rodriguez-sf" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#149cb8] transition-colors">
          <Icon name="work" size={16} />
        </a>
        <a href="mailto:jesse@jesserodriguez.me" className="text-slate-600 hover:text-[#149cb8] transition-colors">
          <Icon name="mail" size={16} />
        </a>
      </div>
    </aside>
  );
};
