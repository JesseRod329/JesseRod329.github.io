
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { PROJECTS } from '../constants';

interface TerminalMessage {
  text: string;
  type: 'user' | 'system' | 'response';
}

const COMMANDS: Record<string, string> = {
  help: `Available commands:
  help     - Show this help message
  about    - Learn about Jesse
  projects - View all projects
  skills   - List technical skills
  contact  - Get in touch
  github   - Open GitHub profile
  clear    - Clear terminal`,
  
  about: `Jesse Rodriguez - Senior Software Engineer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Based in San Francisco, CA. Building modern web 
experiences with React, TypeScript, and Node.js.

15,000+ lines of code across 12+ specialized apps.
All projects achieve >95 Lighthouse scores.

Currently open to new opportunities.`,
  
  skills: `Technical Skills:
━━━━━━━━━━━━━━━━━━
Frontend:  React 19, TypeScript, Next.js, Tailwind CSS
           Three.js, Framer Motion, Chart.js
Backend:   Node.js, Python, PostgreSQL, Redis
Tools:     Git, Docker, AWS, Vercel, Vite
Practices: WCAG AA, PWA, Security Best Practices`,
  
  contact: `Get in Touch:
━━━━━━━━━━━━━━━━━
📧 Email:    jesse@jesserodriguez.me
🌐 Website:  jesserodriguez.me
💼 LinkedIn: linkedin.com/in/jesse-rodriguez-sf
🐙 GitHub:   github.com/JesseRod329

Type 'github' to open GitHub profile in new tab.`,

  github: `Opening GitHub profile...`,
};

export const Terminal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<TerminalMessage[]>([
    { text: "Welcome to JesseOS v2.0. Type 'help' to see available commands.", type: 'system' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getProjectsList = () => {
    return `All Projects (${PROJECTS.length}):
━━━━━━━━━━━━━━━━━━━━━━
${PROJECTS.map((p, i) => `${(i + 1).toString().padStart(2, '0')}. ${p.name}
    └─ ${p.demoUrl}`).join('\n')}

Click any project card above to view demo.`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const cmd = inputValue.trim().toLowerCase();
    setMessages(prev => [...prev, { text: inputValue, type: 'user' }]);
    setInputValue('');

    if (cmd === 'clear') {
      setMessages([{ text: "Terminal cleared. Type 'help' for commands.", type: 'system' }]);
      return;
    }

    if (cmd === 'projects') {
      setMessages(prev => [...prev, { text: getProjectsList(), type: 'response' }]);
      return;
    }

    if (cmd === 'github') {
      setMessages(prev => [...prev, { text: COMMANDS.github, type: 'response' }]);
      window.open('https://github.com/JesseRod329', '_blank');
      return;
    }

    const response = COMMANDS[cmd];
    if (response) {
      setMessages(prev => [...prev, { text: response, type: 'response' }]);
    } else {
      setMessages(prev => [...prev, { 
        text: `Command not found: ${cmd}. Type 'help' for available commands.`, 
        type: 'system' 
      }]);
    }
  };

  return (
    <div className={`flex flex-col border-t border-[#293638] bg-[#111316] transition-all duration-300 ${isOpen ? 'h-72' : 'h-10'}`}>
      <div 
        className="flex items-center justify-between px-4 h-10 border-b border-[#293638] cursor-pointer hover:bg-slate-800/30"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span className={`pb-2 border-b-2 ${isOpen ? 'border-[#149cb8] text-white' : 'border-transparent'}`}>Terminal</span>
          <span className="pb-2 border-b-2 border-transparent">Output</span>
          <span className="pb-2 border-b-2 border-transparent">Debug Console</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <Icon name={isOpen ? "expand_more" : "expand_less"} size={16} />
          <Icon name="close" size={16} />
        </div>
      </div>

      {isOpen && (
        <div className="flex-1 overflow-hidden flex flex-col p-3 font-mono text-sm">
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 mb-2 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className="flex gap-2">
                <span className={`font-bold shrink-0 ${m.type === 'user' ? 'text-green-400' : m.type === 'response' ? 'text-[#149cb8]' : 'text-slate-500'}`}>
                  {m.type === 'user' ? '➜' : m.type === 'response' ? '⟩' : '::'}
                </span>
                <span className={`${m.type === 'system' ? 'text-slate-400 italic' : 'text-slate-200'} whitespace-pre-wrap`}>
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-[#293638] pt-2">
            <span className="text-green-400 font-bold shrink-0">➜ ~</span>
            <input 
              autoFocus
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-slate-200 focus:ring-0 p-0 text-sm"
              placeholder="Type a command..."
            />
          </form>
        </div>
      )}
    </div>
  );
};
