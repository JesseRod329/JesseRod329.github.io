import React from 'react';
import { ArrowRight, Cpu, Network } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[128px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[128px] animate-pulse-slow delay-75" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-mono font-bold tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue"></span>
            </span>
            OPEN FOR NEW PROJECTS
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Intelligent</span> Architecture
          </h1>
          
          <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
            I engineer advanced AI agents, fine-tune proprietary models, and build comprehensive business dashboards that connect personal AI assistants to your existing infrastructure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#portfolio"
              className="flex items-center justify-center gap-2 bg-neon-blue text-dark-900 font-bold px-8 py-4 rounded hover:bg-cyan-300 transition-colors"
            >
              View Work <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#services"
              className="flex items-center justify-center gap-2 glass-panel border border-white/10 font-bold px-8 py-4 rounded hover:bg-white/5 transition-colors"
            >
              My Services
            </a>
          </div>

          <div className="pt-8 flex items-center gap-8 text-gray-500 font-mono text-sm">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-neon-purple" />
              <span>LLM Fine-Tuning</span>
            </div>
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-neon-green" />
              <span>Multi-Agent Systems</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative hidden lg:block">
          <div className="relative w-full aspect-square max-w-md mx-auto">
             <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/20 to-neon-purple/20 rounded-2xl rotate-6 blur-xl" />
             <div className="absolute inset-0 glass-panel rounded-2xl border border-white/10 p-6 flex flex-col justify-between animate-float">
                {/* Visual Code Mockup */}
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-gray-400">
                    <span className="text-neon-purple">const</span> agent = <span className="text-neon-blue">new</span> AIAgent(<span className="text-yellow-300">"BusinessOpt"</span>);
                  </div>
                  <div className="text-gray-400">
                    <span className="text-neon-purple">await</span> agent.connect({'{'}
                  </div>
                  <div className="text-gray-400 pl-4">
                    architecture: <span className="text-green-400">"Legacy_V2"</span>,
                  </div>
                  <div className="text-gray-400 pl-4">
                    capabilities: [<span className="text-green-400">"Analysis"</span>, <span className="text-green-400">"Execution"</span>]
                  </div>
                  <div className="text-gray-400">{'}'});</div>
                  <div className="text-gray-400 mt-4">
                    <span className="text-gray-500">// Deploying custom fine-tuned model...</span>
                  </div>
                  <div className="text-neon-green mt-2">
                    {'>'} Optimization Complete. Efficiency +45%
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-8">
                   <div className="flex justify-between text-xs text-gray-500 uppercase tracking-widest">
                      <span>Status</span>
                      <span className="text-neon-green">Online</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;