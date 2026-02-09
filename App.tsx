import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import Hero from './components/Hero';
import TechStack from './components/TechStack'; // New component
import Services from './components/Services';
import ArchitectureDiagram from './components/ArchitectureDiagram'; // New component
import GithubPulse from './components/GithubPulse'; // New component
import DualTrackGallery from './components/Portfolio'; // Refactored Portfolio
import DashboardShowcase from './components/DashboardShowcase';
import AIChatWidget from './components/AIChatWidget';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Architecture', href: '#architecture' },
    { name: 'Systems & Mobile', href: '#portfolio' },
    { name: 'Intelligence', href: '#dashboard' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 selection:bg-neon-blue selection:text-dark-900 overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'glass-panel py-4 border-b border-white/5' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold font-mono tracking-tighter flex items-center gap-2 group">
            <span className="text-neon-blue group-hover:animate-pulse">&lt;</span>
            JesseRodriguez
            <span className="text-neon-blue group-hover:animate-pulse">/&gt;</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-gray-300 hover:text-white hover:text-neon-blue transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="https://github.com/JesseRod329" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 border border-neon-blue/30 text-neon-blue rounded hover:bg-neon-blue/10 transition-colors font-mono text-xs"
            >
              git checkout profile
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full glass-panel border-b border-white/5 py-6 px-6 flex flex-col gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xl font-medium text-gray-200 hover:text-neon-blue"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </nav>

      <main>
        {/* 1. Hero: "Apple Certified Developer & AI Engineer" */}
        <Hero />

        {/* 2. Tech Stack: Scrolling ticker of logos (Gemini, Apple, Node, etc.) */}
        <TechStack />

        {/* 3. Architecture & Pulse: Visualizing the "Node/Python Bridge" + Live GitHub */}
        <section id="architecture" className="py-24 bg-dark-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ArchitectureDiagram />
              </div>
              <div className="lg:col-span-1">
                <GithubPulse />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Services: "Connecting Agents to Architecture" */}
        <Services />

        {/* 5. Dual-Track Portfolio: Switch between "AI Systems" and "Interface Engineering" */}
        {/* Featuring: Pulse, Kami, Kats Eye, World Globe */}
        <DualTrackGallery />

        {/* 6. Dashboard: The "Business Intelligence" hook */}
        <DashboardShowcase />
        
        {/* Contact Section */}
        <section id="contact" className="py-24 relative overflow-hidden">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-purple/5 rounded-full blur-[120px] -z-10" />
           <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to Bridge the Gap?</h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                From high-end SwiftUI interfaces to deep agentic workflows. Let's architect a solution that works.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                <a 
                  href="mailto:contact@jesserodriguez.me" 
                  className="flex items-center gap-3 px-8 py-4 bg-white text-dark-900 font-bold rounded hover:bg-gray-200 transition-transform hover:-translate-y-1"
                >
                  <Mail className="w-5 h-5" />
                  Email Me
                </a>
                <a 
                  href="https://github.com/JesseRod329" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-8 py-4 glass-panel border border-white/10 rounded font-bold hover:bg-white/5 transition-transform hover:-translate-y-1"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
                <a 
                  href="#" 
                  className="flex items-center gap-3 px-8 py-4 glass-panel border border-neon-blue/30 text-neon-blue rounded font-bold hover:bg-neon-blue/10 transition-transform hover:-translate-y-1"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
              </div>
           </div>
        </section>

        <footer className="py-8 border-t border-white/5 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Jesse Rodriguez. Apple Certified Developer. AI Engineer.</p>
        </footer>
      </main>

      <AIChatWidget />
    </div>
  );
};

export default App;
