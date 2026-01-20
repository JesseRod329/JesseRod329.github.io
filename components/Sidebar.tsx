
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
  name, icon, colorClass = 'text-slate-400', isActive, indent = 0, isFolder, isOpen, onClick, href 
}) => {
  const content = (
    <>
      {isFolder && (
        <Icon 
          name={isOpen ? 'expand_more' : 'chevron_right'} 
          className="text-slate-500" 
          size={16} 
        />
      )}
      <Icon name={icon} className={colorClass} size={18} />
      <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>{name}</span>
    </>
  );

  const className = `
    flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-md transition-colors
    ${isActive ? 'bg-[#293638]/50 text-white border-l-2 border-[#149cb8]' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
  `;

  if (href) {
    return (
      <a 
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
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

interface SocialLinkProps {
  href: string;
  icon: string;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#1f2329] hover:bg-[#149cb8]/20 hover:text-[#149cb8] text-slate-400 transition-all duration-200 group"
    title={label}
  >
    <Icon name={icon} size={18} />
  </a>
);

export const Sidebar: React.FC = () => {
  const [srcOpen, setSrcOpen] = useState(true);

  const scrollToProjects = () => {
    const projectsSection = document.querySelector('[data-projects]');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="w-64 bg-[#111316] flex flex-col border-r border-[#293638] hidden lg:flex shrink-0 select-none">
      <div className="p-4 flex items-center justify-between text-[11px] text-slate-400 font-bold tracking-widest uppercase">
        <span>Explorer</span>
        <Icon name="more_horiz" className="cursor-pointer hover:text-white" size={16} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Open Editors Section */}
        <div className="mb-4">
          <div className="flex items-center gap-1 px-4 py-1 text-[11px] font-bold text-slate-400 group cursor-pointer">
            <Icon name="expand_more" size={14} />
            <span>OPEN EDITORS</span>
          </div>
          <FileTreeItem name="home.tsx" icon="code" colorClass="text-[#61dafb]" isActive />
        </div>

        {/* Project Folder */}
        <div>
          <div className="flex items-center gap-1 px-4 py-1 text-[11px] font-bold text-slate-300 group cursor-pointer">
            <Icon name="expand_more" size={14} />
            <span>PORTFOLIO-V2</span>
          </div>

          <div className="mt-1">
            <FileTreeItem 
              name=".github" 
              icon="folder" 
              colorClass="text-yellow-500" 
              indent={1} 
              isFolder 
              href="https://github.com/JesseRod329"
            />
            <FileTreeItem 
              name="src" 
              icon={srcOpen ? "folder_open" : "folder"} 
              colorClass="text-green-500" 
              indent={1} 
              isFolder 
              isOpen={srcOpen}
              onClick={() => setSrcOpen(!srcOpen)}
            />
            
            {srcOpen && (
              <>
                <FileTreeItem name="home.tsx" icon="code" colorClass="text-[#61dafb]" indent={2} isActive />
                <FileTreeItem 
                  name="projects.json" 
                  icon="javascript" 
                  colorClass="text-yellow-400" 
                  indent={2} 
                  onClick={scrollToProjects}
                />
                <FileTreeItem name="style.css" icon="css" colorClass="text-pink-400" indent={2} />
                <FileTreeItem 
                  name="README.md" 
                  icon="description" 
                  colorClass="text-slate-400" 
                  indent={2}
                  href="https://github.com/JesseRod329/JesseRod329.github.io#readme"
                />
              </>
            )}
            
            <FileTreeItem name="package.json" icon="adb" colorClass="text-red-400" indent={1} />
          </div>
        </div>
      </div>

      {/* Social Links Bar */}
      <div className="px-4 py-3 border-t border-[#293638]">
        <div className="flex items-center justify-center gap-2">
          <SocialLink 
            href="https://github.com/JesseRod329" 
            icon="code" 
            label="GitHub"
          />
          <SocialLink 
            href="https://linkedin.com/in/jesse-rodriguez-sf" 
            icon="work" 
            label="LinkedIn"
          />
          <SocialLink 
            href="mailto:jesse@jesserodriguez.me" 
            icon="mail" 
            label="Email"
          />
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-[#293638]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#149cb8]/20 flex items-center justify-center text-[#149cb8] font-bold text-sm">
            JR
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm text-white truncate font-medium">Jesse Rodriguez</span>
            <span className="text-[10px] text-slate-500 truncate">Senior Software Engineer</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
