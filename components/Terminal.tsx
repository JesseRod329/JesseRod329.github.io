
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { PROJECTS } from '../constants';

interface TerminalMessage {
  text: string;
  type: 'user' | 'system' | 'response';
}

const COMMANDS: Record<string, string> = {
  help: `Commands: help, about, projects, skills, contact, clear`,
  about: `Jesse Rodriguez — Senior Software Engineer. SF, CA.`,
  skills: `React 19, TS, Node, Python, AWS, Vercel, Three.js`,
  contact: `jesse@jesserodriguez.me | github.com/JesseRod329`,
};

export const Terminal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<TerminalMessage[]>([
    { text: "Type 'help' for commands.", type: 'system' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const cmd = inputValue.trim().toLowerCase();
    setMessages(prev => [...prev, { text: inputValue, type: 'user' }]);
    setInputValue('');

    if (cmd === 'clear') {
      setMessages([{ text: "Terminal cleared.", type: 'system' }]);
      return;
    }

    const response = COMMANDS[cmd];
    if (response) {
      setMessages(prev => [...prev, { text: response, type: 'response' }]);
    } else {
      setMessages(prev => [...prev, { text: `Unknown command: ${cmd}`, type: 'system' }]);
    }
  };

  return (
    <div className={`flex flex-col border-t border-[#21262d] bg-[#0d1117] transition-all duration-300 ${isOpen ? 'h-48' : 'h-8'}`}>
      <div 
        className="flex items-center justify-between px-4 h-8 cursor-pointer hover:bg-white/5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <span className={isOpen ? 'text-white' : ''}>Terminal</span>
        </div>
        <Icon name={isOpen ? "expand_more" : "expand_less"} size={14} className="text-slate-600" />
      </div>

      {isOpen && (
        <div className="flex-1 overflow-hidden flex flex-col p-3 font-mono text-xs">
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 mb-2">
            {messages.map((m, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-slate-600">{m.type === 'user' ? '➜' : '::'}</span>
                <span className="text-slate-300">{m.text}</span>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-[#21262d] pt-2">
            <span className="text-[#149cb8] font-bold shrink-0">➜</span>
            <input 
              autoFocus
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-slate-300 focus:ring-0 p-0 text-xs"
            />
          </form>
        </div>
      )}
    </div>
  );
};
