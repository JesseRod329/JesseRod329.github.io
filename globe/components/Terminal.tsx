import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, Terminal as TerminalIcon, Minimize2, Maximize2 } from 'lucide-react';

interface TerminalProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className={`fixed bottom-6 left-6 z-20 transition-all duration-300 ease-in-out ${isMinimized ? 'w-64 h-12' : 'w-96 h-96'}`}>
      <div className="bg-black/90 border border-cyber-pink/50 backdrop-blur-md w-full h-full flex flex-col shadow-[0_0_15px_rgba(255,0,255,0.15)] overflow-hidden rounded-tl-lg rounded-br-lg">
        
        {/* Header */}
        <div 
          className="bg-cyber-pink/10 border-b border-cyber-pink/30 p-2 flex justify-between items-center cursor-pointer hover:bg-cyber-pink/20 transition-colors"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-2 text-cyber-pink font-mono text-sm font-bold">
            <TerminalIcon size={14} />
            <span>NET_RUNNER_UPLINK</span>
          </div>
          <button className="text-cyber-pink hover:text-white">
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
        </div>

        {!isMinimized && (
          <>
            {/* Message Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-3 scrollbar-thin scrollbar-thumb-cyber-pink/50"
            >
              <div className="text-gray-500 italic text-[10px]">
                &gt; Connection established to secure server...<br/>
                &gt; Identity verified.<br/>
                &gt; Welcome, User.
              </div>
              
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}>
                  <span className={`px-2 py-1 max-w-[90%] rounded ${
                    msg.sender === 'USER' 
                      ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30' 
                      : 'bg-cyber-cyan/10 text-cyber-cyan border-l-2 border-cyber-cyan'
                  }`}>
                    {msg.sender === 'SYSTEM' && <span className="font-bold mr-1">&gt;</span>}
                    {msg.text}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="text-cyber-cyan animate-pulse">
                  &gt; PROCESSING_REQUEST...
                </div>
              )}
           </div>

           {/* Input Area */}
           <form onSubmit={handleSubmit} className="p-2 border-t border-cyber-pink/30 bg-black/50 flex gap-2">
             <span className="text-cyber-pink font-bold self-center">&gt;</span>
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter command..."
                className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs placeholder-gray-600"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="text-cyber-pink hover:text-white disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};