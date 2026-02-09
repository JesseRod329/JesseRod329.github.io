import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { streamGeminiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm Jesse's AI Assistant. Ask me about his skills in AI Agents or Fine-tuning.", timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Prepare history for API (convert internal ChatMessage to Gemini format)
    // We limit history to last 10 messages to save context
    const apiHistory = messages.slice(-10).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    let accumulatedResponse = "";
    
    // Add placeholder for streaming response
    setMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

    await streamGeminiResponse(apiHistory, userMsg.text, (chunk) => {
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
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] glass-panel rounded-2xl border border-neon-blue/20 flex flex-col shadow-2xl animate-float">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-neon-blue/5 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center border border-neon-blue/30">
                <Bot className="w-5 h-5 text-neon-blue" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Jesse's Assistant</h3>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-green-500">Gemini 3 Powered</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-neon-blue/20 text-white rounded-br-none border border-neon-blue/20' 
                      : 'bg-white/5 text-gray-200 rounded-bl-none border border-white/5'
                  }`}
                >
                  {msg.text}
                  {msg.text === '' && isLoading && idx === messages.length - 1 && (
                     <span className="animate-pulse">...</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-dark-900/50 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about fine-tuning..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-blue/50 transition-colors"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !inputText.trim()}
                className="bg-neon-blue text-dark-900 p-2 rounded-lg hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 bg-neon-blue hover:bg-cyan-300 text-dark-900 px-5 py-4 rounded-full font-bold shadow-lg shadow-neon-blue/20 transition-all hover:scale-105"
      >
        <span className={`${isOpen ? 'hidden' : 'hidden md:block'}`}>Ask AI Assistant</span>
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default AIChatWidget;