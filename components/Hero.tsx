import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface LogLine {
  agent: string;
  color: string;
  text: string;
  delay: number;
}

const script: LogLine[] = [
  { agent: 'orchestrator', color: 'text-signal', text: 'spawning swarm for task: "ship client dashboard"', delay: 600 },
  { agent: 'planner', color: 'text-bone', text: 'decomposed into 4 subtasks · assigning workers', delay: 1100 },
  { agent: 'researcher', color: 'text-bone-dim', text: 'pulling context via MCP → linear, github, postgres', delay: 950 },
  { agent: 'coder', color: 'text-bone', text: 'writing React views + FastAPI endpoints…', delay: 1300 },
  { agent: 'coder', color: 'text-bone', text: 'tests passing 47/47 · opening pull request', delay: 1200 },
  { agent: 'reviewer', color: 'text-bone-dim', text: 'diff reviewed · 2 fixes applied · approved', delay: 1000 },
  { agent: 'orchestrator', color: 'text-signal', text: 'deploy complete → merged in 14m 32s, zero human touches', delay: 1400 },
];

const AgentConsole: React.FC = () => {
  const [visible, setVisible] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible >= script.length) {
      const reset = setTimeout(() => setVisible(0), 5000);
      return () => clearTimeout(reset);
    }
    const t = setTimeout(() => setVisible(v => v + 1), script[visible].delay);
    return () => clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [visible]);

  return (
    <div className="panel rounded-lg overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between px-5 py-3 border-b border-bone/10 bg-ink-900/80">
        <div className="flex items-center gap-2 font-mono text-[11px] text-bone-mute">
          <span className="w-2 h-2 rounded-full bg-live animate-pulse" />
          agent-swarm · live run
        </div>
        <span className="font-mono text-[11px] text-bone-mute">tmux 0:main</span>
      </div>
      <div ref={bodyRef} className="h-[300px] md:h-[340px] overflow-hidden px-5 py-4 font-mono text-[13px] leading-[1.9] bg-ink-950/60">
        {script.slice(0, visible).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="flex gap-3"
          >
            <span className="text-bone-mute shrink-0 select-none">{String(i + 1).padStart(2, '0')}</span>
            <span className={`shrink-0 w-[7.5rem] ${line.color}`}>[{line.agent}]</span>
            <span className="text-bone-dim">{line.text}</span>
          </motion.div>
        ))}
        <div className="flex gap-3">
          <span className="text-bone-mute select-none">{String(Math.min(visible + 1, script.length + 1)).padStart(2, '0')}</span>
          <span className="text-signal animate-blink">▋</span>
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-3 border-t border-bone/10 bg-ink-900/80 font-mono text-[11px] text-bone-mute">
        <span>7 agents registered</span>
        <span className="text-live">orchestration: healthy</span>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yDrift = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);

  const headline = useMemo(
    () => [
      { text: 'I build', italic: false },
      { text: 'agents', italic: true },
      { text: 'that build', italic: false },
      { text: 'the work.', italic: true },
    ],
    []
  );

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden blueprint">
      {/* Warm spotlight */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-signal/[0.07] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent pointer-events-none" />

      <motion.div style={{ y: yDrift }} className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-36 pb-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-10 font-mono text-[11px] tracking-[0.25em] uppercase text-bone-dim border border-bone/15 px-4 py-2 rounded-full"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-live" />
            </span>
            Open for new projects · NYC
          </motion.div>

          <h1 className="font-display font-semibold text-[clamp(3rem,8vw,6.5rem)] leading-[0.98] tracking-tight text-bone">
            {headline.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.28em] last:mr-0">
                <motion.span
                  className={`inline-block ${word.italic ? 'italic font-light text-signal' : ''}`}
                  initial={reduce ? false : { y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-8 text-lg md:text-xl text-bone-dim leading-relaxed max-w-xl"
          >
            AI engineer running multi-agent systems in production — orchestration frameworks,
            MCP integrations, fine-tuned models, and the dashboards that keep them honest.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <a
              href="#agents"
              className="group inline-flex items-center gap-3 bg-signal text-ink-950 font-semibold px-7 py-4 rounded-sm hover:bg-bone transition-colors duration-300"
            >
              See the agent stack
              <ArrowDownRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
            </a>
            <a
              href="#work"
              className="group inline-flex items-center gap-3 font-semibold px-7 py-4 rounded-sm border border-bone/20 hover:border-signal/60 hover:text-signal transition-colors duration-300"
            >
              Selected work
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-14 flex flex-wrap gap-x-10 gap-y-3 font-mono text-xs text-bone-mute"
          >
            <span>→ multi-agent orchestration</span>
            <span>→ mcp servers & tools</span>
            <span>→ local + cloud models</span>
            <span>→ swiftui interfaces</span>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <AgentConsole />
        </motion.div>
      </motion.div>

      {/* Bottom ticker line */}
      <div className="relative z-10 border-t border-bone/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between font-mono text-[11px] text-bone-mute uppercase tracking-[0.2em]">
          <span>Jesse Rodriguez</span>
          <span className="hidden md:inline">AI Engineering & Agent Systems</span>
          <span>EST. NYC</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
