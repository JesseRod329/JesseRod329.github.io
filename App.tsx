
import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Icon } from './components/Icon';
import { ProjectCard } from './components/ProjectCard';
import { StatusBar } from './components/StatusBar';
import { Terminal } from './components/Terminal';
import { PROJECTS } from './constants';

const CodeLine: React.FC<{ number: number; children: React.ReactNode; indent?: number }> = ({ number, children, indent = 0 }) => (
  <div className="group flex transition-colors hover:bg-slate-800/30">
    <div className="flex flex-col items-end pr-6 select-none opacity-40 text-sm w-12 shrink-0">
      <span>{number}</span>
    </div>
    <div 
      className="pl-6 w-full text-sm md:text-base leading-relaxed"
      style={{ paddingLeft: `${(indent + 1) * 1.5}rem` }}
    >
      {children}
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#17191c]">
      {/* Top Layout */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main Editor */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#17191c]">
          {/* Tabs */}
          <header className="h-10 bg-[#111316] flex items-end border-b border-[#293638] overflow-x-auto no-scrollbar select-none">
            <div className="flex h-full">
              <div className="flex items-center gap-2 px-4 bg-[#17191c] text-white border-t-2 border-[#149cb8] min-w-[140px] cursor-pointer">
                <Icon name="code" className="text-[#61dafb]" size={16} />
                <span className="text-sm font-medium">home.tsx</span>
                <Icon name="close" className="ml-auto opacity-0 group-hover:opacity-100 hover:bg-slate-700 rounded-full p-0.5" size={14} />
              </div>
              <div className="flex items-center gap-2 px-4 bg-transparent text-slate-500 hover:bg-[#1f2226] border-t-2 border-transparent min-w-[140px] cursor-pointer border-r border-[#293638]/50 group">
                <Icon name="javascript" className="text-yellow-400" size={16} />
                <span className="text-sm">projects.json</span>
                <Icon name="close" className="ml-auto opacity-0 group-hover:opacity-100 hover:bg-slate-700 rounded-full p-0.5" size={14} />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2 px-4 h-full">
              <Icon name="play_arrow" className="text-slate-400 hover:text-white p-1 cursor-pointer" />
              <Icon name="splitscreen" className="text-slate-400 hover:text-white p-1 cursor-pointer" />
              <Icon name="more_vert" className="text-slate-400 hover:text-white p-1 cursor-pointer" />
            </div>
          </header>

          {/* Breadcrumbs */}
          <div className="h-8 bg-[#17191c] flex items-center px-4 text-xs text-slate-500 gap-2 border-b border-[#293638]/30">
            <span className="hover:text-slate-300 cursor-pointer">src</span>
            <Icon name="chevron_right" size={14} />
            <span className="text-white">home.tsx</span>
            <span className="ml-auto text-slate-600 hidden sm:block">JesseRodriguez &gt; render()</span>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto relative p-4 pb-12 scroll-smooth bg-[#17191c]">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            <div className="max-w-6xl mx-auto w-full font-mono relative z-10">
              <CodeLine number={1}><span className="text-comment">/**</span></CodeLine>
              <CodeLine number={2}><span className="text-comment"> * @author Jesse Rodriguez</span></CodeLine>
              <CodeLine number={3}><span className="text-comment"> * @desc Full Stack Developer specializing in React, Node, and UI/UX.</span></CodeLine>
              <CodeLine number={4}><span className="text-comment"> */</span></CodeLine>
              <CodeLine number={5}>
                <span className="text-keyword">import</span>
                <span className="text-white"> {"{ "}</span>
                <span className="text-class-name">Developer</span>
                <span className="text-white">, </span>
                <span className="text-class-name">Designer</span>
                <span className="text-white">{" }"} </span>
                <span className="text-keyword">from</span>
                <span className="text-string"> 'human-v2.0'</span>
                <span className="text-white">;</span>
              </CodeLine>
              <CodeLine number={6}>&nbsp;</CodeLine>
              <CodeLine number={7}>
                <span className="text-keyword">export default class</span>
                <span className="text-yellow-400 font-bold"> JesseRodriguez</span>
                <span className="text-keyword"> extends</span>
                <span className="text-class-name"> Developer</span>
                <span className="text-white"> {"{"}</span>
                <span className="animate-pulse inline-block w-[8px] h-[18px] bg-[#149cb8] ml-1 align-middle"></span>
              </CodeLine>
              
              <CodeLine number={8} indent={1}>
                <span className="text-keyword">constructor</span>
                <span className="text-white">() {"{"}</span>
              </CodeLine>
              <CodeLine number={9} indent={2}><span className="text-keyword">super</span><span className="text-white">();</span></CodeLine>
              <CodeLine number={10} indent={2}>
                <span className="text-keyword">this</span><span className="text-white">.name = </span><span className="text-string">'Jesse Rodriguez'</span><span className="text-white">;</span>
              </CodeLine>
              <CodeLine number={11} indent={2}>
                <span className="text-keyword">this</span><span className="text-white">.role = </span><span className="text-string">'Senior Software Engineer'</span><span className="text-white">;</span>
              </CodeLine>
              <CodeLine number={12} indent={2}>
                <span className="text-keyword">this</span><span className="text-white">.location = </span><span className="text-string">'San Francisco, CA'</span><span className="text-white">;</span>
              </CodeLine>
              <CodeLine number={13} indent={2}>
                <span className="text-keyword">this</span><span className="text-white">.status = </span>
                <span className="bg-[#149cb8]/20 text-[#149cb8] px-2 py-0.5 rounded text-sm font-bold">"Open to Opportunities"</span>
                <span className="text-white">;</span>
              </CodeLine>
              <CodeLine number={14} indent={1}><span className="text-white">{"}"}</span></CodeLine>
              <CodeLine number={15}>&nbsp;</CodeLine>
              <CodeLine number={16} indent={1}><span className="text-comment">// Scroll down to view compiled portfolio projects...</span></CodeLine>
              <div data-projects>
                <CodeLine number={17} indent={1}>
                  <span className="text-keyword">renderProjects</span><span className="text-white">() {"{"}</span>
                </CodeLine>
                <CodeLine number={18} indent={2}>
                  <span className="text-keyword">return</span><span className="text-white"> [</span>
                </CodeLine>
              </div>

              {/* Projects Rendering */}
              {PROJECTS.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  lineNumberStart={19 + index} 
                />
              ))}

              <CodeLine number={19 + PROJECTS.length} indent={2}><span className="text-white">];</span></CodeLine>
              <CodeLine number={20 + PROJECTS.length} indent={1}><span className="text-white">{"}"}</span></CodeLine>
              <CodeLine number={21 + PROJECTS.length}><span className="text-white">{"}"}</span></CodeLine>
              <CodeLine number={22 + PROJECTS.length}>&nbsp;</CodeLine>
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
