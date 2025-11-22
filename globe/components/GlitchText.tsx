import React from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, as: Tag = 'span', className = '' }) => {
  return (
    <Tag className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyber-pink opacity-0 group-hover:opacity-70 group-hover:animate-glitch group-hover:translate-x-[2px]">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyber-cyan opacity-0 group-hover:opacity-70 group-hover:animate-glitch group-hover:-translate-x-[2px] group-hover:delay-75">
        {text}
      </span>
    </Tag>
  );
};