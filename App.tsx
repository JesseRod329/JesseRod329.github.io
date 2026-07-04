import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Menu, X, Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import Hero from './components/Hero';
import TechStack from './components/TechStack';
import AgentLab from './components/AgentLab';
import Services from './components/Services';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import Portfolio from './components/Portfolio';
import ClientDemos from './components/ClientDemos';
import DashboardShowcase from './components/DashboardShowcase';
import AIChatWidget from './components/AIChatWidget';
import { Reveal } from './components/Reveal';

const navLinks = [
  { name: 'Agents', href: '#agents' },
  { name: 'Services', href: '#services' },
  { name: 'Work', href: '#work' },
  { name: 'Demos', href: '#client-demos' },
  { name: 'Intelligence', href: '#dashboard' },
];

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-ink-950 text-bone overflow-x-hidden font-sans">
      {/* Scroll progress hairline */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-signal origin-left z-[60]" style={{ scaleX: progress }} />

      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled ? 'bg-ink-950/85 backdrop-blur-md py-4 border-bone/10' : 'bg-transparent py-6 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#" className="font-display text-xl font-semibold tracking-tight text-bone group">
            Jesse Rodriguez
            <span className="text-signal transition-opacity group-hover:animate-blink">_</span>
          </a>

          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.18em] text-bone-dim hover:text-signal transition-colors duration-300"
              >
                <span className="text-signal/50 mr-1.5">0{i + 1}</span>
                {link.name}
              </a>
            ))}
            <a
              href="mailto:contact@jesserodriguez.me"
              className="font-mono text-xs uppercase tracking-[0.18em] px-5 py-2.5 border border-signal/40 text-signal hover:bg-signal hover:text-ink-950 transition-colors duration-300"
            >
              Hire me
            </a>
          </div>

          <button className="md:hidden text-bone" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-ink-950/95 backdrop-blur-md border-b border-bone/10 py-8 px-6 flex flex-col gap-6">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-2xl font-semibold text-bone hover:text-signal transition-colors"
              >
                <span className="font-mono text-xs text-signal/60 mr-3">0{i + 1}</span>
                {link.name}
              </a>
            ))}
            <a
              href="mailto:contact@jesserodriguez.me"
              className="font-mono text-xs uppercase tracking-[0.18em] mt-2 px-5 py-3 border border-signal/40 text-signal text-center"
            >
              Hire me
            </a>
          </div>
        )}
      </nav>

      <main>
        <Hero />
        <TechStack />
        <AgentLab />
        <Services />
        <ArchitectureDiagram />
        <Portfolio />
        <ClientDemos />
        <DashboardShowcase />

        {/* Contact */}
        <section id="contact" className="py-32 md:py-44 relative overflow-hidden blueprint">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-signal/[0.06] rounded-full blur-[140px] pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-6 text-center">
            <Reveal>
              <p className="eyebrow text-signal mb-8">/ 06 — Contact</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] mb-10">
                Put an agent
                <br />
                <em className="italic font-light text-signal">on it.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg md:text-xl text-bone-dim max-w-2xl mx-auto mb-14">
                From SwiftUI interfaces to full agent swarms with observability baked in.
                Tell me what should run without you, and I&rsquo;ll architect it.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:contact@jesserodriguez.me"
                  className="group inline-flex items-center gap-3 bg-signal text-ink-950 font-semibold px-8 py-4 hover:bg-bone transition-colors duration-300"
                >
                  <Mail className="w-4 h-4" />
                  contact@jesserodriguez.me
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
                <a
                  href="https://github.com/JesseRod329"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 font-semibold px-8 py-4 border border-bone/20 hover:border-signal/60 hover:text-signal transition-colors duration-300"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/jesserod329"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 font-semibold px-8 py-4 border border-bone/20 hover:border-signal/60 hover:text-signal transition-colors duration-300"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <footer className="border-t border-bone/10 py-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-mute">
            <span>© {new Date().getFullYear()} Jesse Rodriguez</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" />
              agents online · humans welcome
            </span>
            <span>NYC — jesserodriguez.me</span>
          </div>
        </footer>
      </main>

      <AIChatWidget />
    </div>
  );
};

export default App;
