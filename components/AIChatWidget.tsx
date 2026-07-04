import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { streamGeminiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hey — I'm Jesse's agent. Ask me about his multi-agent systems, MCP work, or fine-tuning.", timestamp: new Date() },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const apiHistory = messages.slice(-10).map(m => ({
      role: m.role,
      parts: [{ text: m.text }] as [{ text: string }],
    }));

    let accumulatedResponse = '';
    setMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

    await streamGeminiResponse(apiHistory, userMsg.text, chunk => {
      accumulatedResponse += chunk;
      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1].text = accumulatedResponse;
        return newArr;
      });
    });

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-ink-900 border border-bone/15 flex flex-col shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85)]"
          >
            <div className="p-4 border-b border-bone/10 flex justify-between items-center bg-ink-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-signal/10 border border-signal/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-signal" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-bone">Jesse&rsquo;s Agent</h3>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-live">
                    <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" />
                    gemini powered
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-bone-mute hover:text-bone transition-colors" aria-label="Close chat">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] p-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-signal/10 text-bone border border-signal/25'
                        : 'bg-bone/[0.04] text-bone-dim border border-bone/10'
                    }`}
                  >
                    {msg.text}
                    {msg.text === '' && isLoading && idx === messages.length - 1 && (
                      <span className="animate-blink text-signal">▋</span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-bone/10 bg-ink-950/60">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Ask about agents, MCP, fine-tuning…"
                  className="flex-1 bg-bone/5 border border-bone/15 px-3 py-2 text-sm font-mono text-bone placeholder:text-bone-mute focus:outline-none focus:border-signal/60 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="bg-signal text-ink-950 p-2.5 hover:bg-bone disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 bg-signal hover:bg-bone text-ink-950 px-5 py-4 font-semibold shadow-[0_16px_40px_-8px_rgba(255,178,36,0.35)] transition-all duration-300 hover:scale-[1.03]"
      >
        <span className={`${isOpen ? 'hidden' : 'hidden md:block'} font-mono text-xs uppercase tracking-widest`}>Talk to my agent</span>
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default AIChatWidget;
