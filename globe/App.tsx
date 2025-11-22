import React, { useState, useCallback } from 'react';
import WorldMap from './components/WorldMap';
import { HUD } from './components/HUD';
import { Terminal } from './components/Terminal';
import { CyberpunkAnalysis, SystemStatus, ChatMessage } from './types';
import { analyzeLocation, chatWithSystem } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>(SystemStatus.IDLE);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CyberpunkAnalysis | null>(null);
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleLocationSelect = useCallback(async (loc: { name: string, lat: number, lng: number }) => {
    setSelectedLocation(loc.name);
    setStatus(SystemStatus.SCANNING);
    setAnalysis(null); // Clear previous

    try {
      // Simulate scanning delay for effect
      setTimeout(async () => {
        setStatus(SystemStatus.ANALYZING);
        const data = await analyzeLocation(loc.name);
        setAnalysis(data);
        setStatus(SystemStatus.LOCKED);
      }, 1500);
    } catch (e) {
      setStatus(SystemStatus.ERROR);
    }
  }, []);

  const handleSendMessage = async (text: string) => {
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'USER',
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsChatLoading(true);

    try {
      // Construct history for API
      const history = messages.map(m => ({
        role: m.sender === 'USER' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithSystem(history, text);
      
      const newSystemMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'SYSTEM',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, newSystemMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCloseAnalysis = () => {
    setAnalysis(null);
    setSelectedLocation(null);
    setStatus(SystemStatus.IDLE);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden selection:bg-cyber-pink selection:text-white">
      
      {/* 3D Layer */}
      <WorldMap onLocationSelect={handleLocationSelect} />

      {/* UI Layer */}
      <HUD 
        status={status}
        analysis={analysis}
        selectedLocation={selectedLocation}
        onCloseAnalysis={handleCloseAnalysis}
      />

      {/* Interactive Terminal */}
      <Terminal 
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
      />
      
      {/* Vignette & Scanlines Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-30 pointer-events-none bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      <div className="pointer-events-none fixed inset-0 z-40 bg-gradient-radial from-transparent to-black opacity-80" />
    </div>
  );
};

export default App;