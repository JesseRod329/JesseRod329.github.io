
import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Icon } from './components/Icon';
import { ProjectCard } from './components/ProjectCard';
import { StatusBar } from './components/StatusBar';
import { Terminal } from './components/Terminal';
import { PROJECTS } from './constants';

const CodeLine: React.FC<{ number: number; children: React.ReactNode; indent?: number }> = ({ number, children, indent = 0 }) => (
  <div className="group flex transition-colors hover:bg-slate-800/20">
    <div className="flex flex-col items-end pr-6 select-none opacity-20 text-xs w-12 shrink-0">
      <span>{number}</span>
    </div>
    <div 
      className="pl-6 w-full text-sm leading-relaxed"
      style={{ paddingLeft: `${(indent + 1) * 1.5}rem` }}
    >
      {children}
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0d1117]">
      {/* Top Layout */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main Editor */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
          {/* Tabs */}
          <header className="h-9 bg-[#0d1117] flex items-end border-b border-[#21262d] overflow-x-auto no-scrollbar select-none">
            <div className="flex h-full">
              <div className="flex items-center gap-2 px-4 bg-[#0d1117] text-slate-300 border-t-2 border-[#149cb8] min-w-[120px] cursor-pointer">
                <Icon name="code" className="text-[#149cb8]" size={14} />
                <span className="text-xs font-medium">home.tsx</span>
              </div>
              <div className="flex items-center gap-2 px-4 bg-transparent text-slate-500 hover:bg-[#161b22] border-t-2 border-transparent min-w-[120px] cursor-pointer group">
                <Icon name="javascript" className="text-slate-600" size={14} />
                <span className="text-xs">projects.json</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2 px-4 h-full">
              <Icon name="play_arrow" className="text-slate-600 hover:text-slate-300 p-1 cursor-pointer" size={16} />
              <Icon name="splitscreen" className="text-slate-600 hover:text-slate-300 p-1 cursor-pointer" size={16} />
            </div>
          </header>

          {/* Breadcrumbs */}
          <div className="h-7 bg-[#0d1117] flex items-center px-4 text-[10px] text-slate-500 gap-2 border-b border-[#21262d]/50">
            <span className="hover:text-slate-300 cursor-pointer">src</span>
            <Icon name="chevron_right" size={12} />
            <span className="text-slate-300">home.tsx</span>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto relative p-8 pb-20 scroll-smooth bg-[#0d1117]">
            <div className="max-w-4xl mx-auto w-full font-mono relative z-10">
              <CodeLine number={1}><span className="text-slate-500 italic">// Jesse Rodriguez — Creative Engineer</span></CodeLine>
              <CodeLine number={2}><span className="text-slate-500 italic">// San Francisco, CA</span></CodeLine>
              <CodeLine number={3}>&nbsp;</CodeLine>
              
              <CodeLine number={4}>
                <span className="text-[#149cb8]">class</span>
                <span className="text-white font-bold"> JesseRodriguez</span>
                <span className="text-white"> {"{"}</span>
              </CodeLine>
              
              <CodeLine number={5} indent={1}>
                <span className="text-[#149cb8]">readonly</span>
                <span className="text-white"> role = </span>
                <span className="text-emerald-400">'Senior Software Engineer'</span>
                <span className="text-white">;</span>
              </CodeLine>
              
              <CodeLine number={6} indent={1}>
                <span className="text-[#149cb8]">readonly</span>
                <span className="text-white"> status = </span>
                <span className="text-amber-400">'OPEN_TO_OPPORTUNITIES'</span>
                <span className="text-white">;</span>
              </CodeLine>
              
              <CodeLine number={7}>&nbsp;</CodeLine>
              
              <CodeLine number={8} indent={1}>
                <span className="text-slate-500 italic">/* Compiled projects listed below */</span>
              </CodeLine>
              
              <div data-projects>
                <CodeLine number={9} indent={1}>
                  <span className="text-[#149cb8]">async</span>
                  <span className="text-white"> getProjects() {"{"}</span>
                </CodeLine>
              </div>

              {/* Projects Rendering */}
              {PROJECTS.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  lineNumberStart={10 + index} 
                />
              ))}

              <CodeLine number={10 + PROJECTS.length} indent={1}><span className="text-white">{"}"}</span></CodeLine>
              <CodeLine number={11 + PROJECTS.length}><span className="text-white">{"}"}</span></CodeLine>
            </div>
          </div>

          <Terminal />
        </main>
      </div>

      <StatusBar />
    </div>
  );
};

export default App;
