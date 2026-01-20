
import React from 'react';
import { Project } from '../types';
import { Icon } from './Icon';

interface ProjectCardProps {
  project: Project;
  lineNumberStart: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, lineNumberStart }) => {
  return (
    <div className="group flex my-6 w-full">
      <div className="flex flex-col items-end pr-6 select-none opacity-40 text-sm w-12 shrink-0">
        <span>{lineNumberStart}</span>
      </div>
      
      <div className="pl-6 w-full pr-4 md:pr-10">
        <div className="bg-[#1f2329] rounded-xl border border-[#293638] p-6 hover:border-[#149cb8]/50 transition-all duration-300 group/card relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row gap-8">
            {/* JSON Content Mockup */}
            <div className="flex-1 space-y-3 font-mono">
              <div className="text-lg font-bold flex items-center gap-2">
                <span className="text-[#149cb8]">{"{"}</span>
                <span className="text-[#a5d6ff]">"name"</span>: 
                <span className="text-white">"{project.name}"</span>,
              </div>
              
              <div className="pl-6">
                <span className="text-[#a5d6ff]">"description"</span>: 
                <span className="text-green-300 text-sm"> "{project.description}"</span>,
              </div>
              
              <div className="pl-6">
                <span className="text-[#a5d6ff]">"techStack"</span>: [
                {project.techStack.map((tech, i) => (
                  <span key={tech}>
                    <span className="text-orange-300">"{tech}"</span>
                    {i < project.techStack.length - 1 ? ', ' : ''}
                  </span>
                ))}
                ],
              </div>

              {project.role && (
                <div className="pl-6">
                  <span className="text-[#a5d6ff]">"role"</span>: 
                  <span className="text-[#a5d6ff]">"{project.role}"</span>,
                </div>
              )}

              <div className="pl-6 pt-4 flex gap-4">
                {project.demoUrl && (
                  <a 
                    href={project.demoUrl} 
                    className="inline-flex items-center gap-2 bg-[#149cb8] text-white text-[11px] font-bold px-4 py-2 rounded hover:bg-[#149cb8]/80 transition transform hover:scale-105"
                  >
                    <Icon name="play_arrow" size={14} />
                    npm run view-demo
                  </a>
                )}
                {project.sourceUrl && (
                  <a 
                    href={project.sourceUrl} 
                    className="inline-flex items-center gap-2 bg-[#293638] text-white text-[11px] font-bold px-4 py-2 rounded hover:bg-white/10 transition"
                  >
                    <Icon name="code" size={14} />
                    view_source
                  </a>
                )}
              </div>
              
              <div className="text-lg font-bold">
                <span className="text-[#149cb8]">{"}"}</span>,
              </div>
            </div>

            {/* Visual Preview */}
            <div className="w-full md:w-80 h-48 rounded-lg overflow-hidden bg-black border border-[#293638] relative shrink-0 group-hover/card:shadow-2xl transition-shadow">
              <div className={`absolute inset-0 bg-gradient-to-br ${project.colorScheme} z-10 pointer-events-none opacity-60`}></div>
              <img 
                src={project.imageUrl} 
                alt={project.name}
                className="w-full h-full object-cover opacity-80 group-hover/card:scale-110 transition-transform duration-700" 
              />
            </div>
          </div>
          
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#149cb8]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};
