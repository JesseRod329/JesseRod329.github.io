
import React from 'react';
import { Project } from '../types';
import { Icon } from './Icon';

interface ProjectCardProps {
  project: Project;
  lineNumberStart: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, lineNumberStart }) => {
  return (
    <div className="group flex my-12 w-full">
      <div className="flex flex-col items-end pr-6 select-none opacity-20 text-xs w-12 shrink-0">
        <span>{lineNumberStart}</span>
      </div>
      
      <div className="pl-6 w-full pr-4 md:pr-10">
        <div className="bg-[#1a1d21]/50 rounded-lg border border-[#2d3139] p-6 hover:border-[#149cb8]/30 transition-all duration-500 group/card relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row gap-8">
            {/* Minimalist Code Style */}
            <div className="flex-1 space-y-4 font-mono">
              <div className="flex flex-col gap-1">
                <div className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="text-[#149cb8] opacity-50 font-normal">#</span>
                  {project.name}
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#149cb8]/10 text-[#149cb8] font-normal tracking-wider uppercase">
                    {project.role}
                  </span>
                </div>
                <div className="text-slate-500 text-sm italic">
                  /* {project.description} */
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="text-xs text-slate-400 bg-[#2d3139]/30 px-2 py-1 rounded border border-[#2d3139]/50">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-6 pt-4 items-center">
                {project.demoUrl && (
                  <a 
                    href={project.demoUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex items-center gap-2 text-[#149cb8] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                  >
                    <span>View Project</span>
                    <Icon name="arrow_forward" size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </a>
                )}
                {project.sourceUrl && (
                  <a 
                    href={project.sourceUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                  >
                    <Icon name="code" size={14} />
                    Source
                  </a>
                )}
              </div>
            </div>

            {/* Clean Visual Preview */}
            <div className="w-full md:w-72 h-44 rounded overflow-hidden bg-black border border-[#2d3139] relative shrink-0">
              <img 
                src={project.imageUrl} 
                alt={project.name}
                className="w-full h-full object-cover grayscale-[0.2] group-hover/card:grayscale-0 group-hover/card:scale-105 transition-all duration-700" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
