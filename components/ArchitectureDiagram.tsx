import React from 'react';
import { Bot, Brain, Server, Smartphone, Layout, Database, ArrowRight, Lock } from 'lucide-react';

const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">The Bridge Architecture</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          How I connect isolated AI intelligence to your real-world business infrastructure.
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Connecting Lines (Desktop Only) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-white/5 -z-10 -translate-y-1/2">
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green opacity-20" />
          {/* Animated Data Packets */}
          <div className="absolute top-[-4px] left-0 w-3 h-3 bg-neon-blue rounded-full shadow-[0_0_10px_#00f3ff] animate-[moveRight_3s_linear_infinite]" />
          <div className="absolute top-[-4px] left-0 w-3 h-3 bg-neon-purple rounded-full shadow-[0_0_10px_#bc13fe] animate-[moveRight_3s_linear_infinite_1s]" />
          <div className="absolute top-[-4px] left-0 w-3 h-3 bg-neon-green rounded-full shadow-[0_0_10px_#0aff68] animate-[moveRight_3s_linear_infinite_2s]" />
        </div>

        {/* 1. Intelligence Source */}
        <div className="relative group">
          <div className="glass-panel p-8 rounded-2xl border-neon-blue/20 hover:border-neon-blue/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue" />
            <div className="flex flex-col items-center text-center z-10 relative">
              <div className="mb-6 p-4 rounded-full bg-neon-blue/10 text-neon-blue">
                <Brain className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Raw Intelligence</h3>
              <p className="text-sm text-gray-400 mb-4">Gemini 1.5 Pro, Llama-3, OpenAI</p>
              <div className="flex gap-2 text-xs font-mono text-neon-blue bg-neon-blue/5 px-3 py-1 rounded-full">
                <Bot className="w-3 h-3" /> Agentic Workflows
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-neon-blue/10 rounded-full blur-3xl group-hover:bg-neon-blue/20 transition-all duration-500" />
          </div>
          {/* Mobile Connector */}
          <div className="md:hidden flex justify-center py-4">
            <ArrowRight className="text-gray-600 rotate-90" />
          </div>
        </div>

        {/* 2. The Bridge (API Layer) */}
        <div className="relative group">
          <div className="glass-panel p-8 rounded-2xl border-neon-purple/20 hover:border-neon-purple/50 transition-all duration-300 transform md:scale-110 shadow-2xl z-20 bg-dark-800">
             <div className="absolute top-0 left-0 w-full h-1 bg-neon-purple" />
             <div className="flex flex-col items-center text-center">
              <div className="mb-6 p-4 rounded-full bg-neon-purple/10 text-neon-purple relative">
                <Server className="w-16 h-16" />
                <div className="absolute -top-1 -right-1 bg-dark-900 rounded-full p-1 border border-neon-purple">
                  <Lock className="w-4 h-4 text-neon-purple" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">The Bridge</h3>
              <p className="text-sm text-gray-400 mb-4">Custom Node.js / Python API</p>
              <ul className="text-xs text-left space-y-2 text-gray-400 bg-white/5 p-3 rounded-lg w-full">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-neon-purple rounded-full"/> Secure Auth Handshake</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-neon-purple rounded-full"/> Rate Limiting & Queues</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-neon-purple rounded-full"/> Vector Context Injection</li>
              </ul>
            </div>
          </div>
          {/* Mobile Connector */}
          <div className="md:hidden flex justify-center py-4">
            <ArrowRight className="text-gray-600 rotate-90" />
          </div>
        </div>

        {/* 3. Application Layer */}
        <div className="relative group">
           <div className="glass-panel p-8 rounded-2xl border-neon-green/20 hover:border-neon-green/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-green" />
            <div className="flex flex-col items-center text-center z-10 relative">
              <div className="mb-6 p-4 rounded-full bg-neon-green/10 text-neon-green">
                <Layout className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Business Logic</h3>
              <p className="text-sm text-gray-400 mb-4">Dashboards & Mobile Apps</p>
              <div className="flex justify-center gap-3">
                 <div className="flex items-center gap-1 text-xs font-mono text-neon-green bg-neon-green/5 px-2 py-1 rounded">
                    <Smartphone className="w-3 h-3" /> iOS (Pulse)
                 </div>
                 <div className="flex items-center gap-1 text-xs font-mono text-neon-green bg-neon-green/5 px-2 py-1 rounded">
                    <Database className="w-3 h-3" /> SQL/NoSQL
                 </div>
              </div>
            </div>
             {/* Background Glow */}
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-neon-green/10 rounded-full blur-3xl group-hover:bg-neon-green/20 transition-all duration-500" />
           </div>
        </div>

      </div>
      
      {/* Dynamic Keyframes for Data Flow */}
      <style>{`
        @keyframes moveRight {
          0% { left: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ArchitectureDiagram;
