import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Brain, Server, Layout, Lock } from 'lucide-react';
import { Reveal, SectionHeading } from './Reveal';

const stages = [
  {
    icon: Brain,
    label: 'stage_a',
    title: 'Raw Intelligence',
    sub: 'Frontier APIs + local fine-tunes',
    points: ['Gemini / OpenAI / Claude', 'MLX models on-device', 'Agentic workflows'],
  },
  {
    icon: Server,
    label: 'stage_b',
    title: 'The Bridge',
    sub: 'Custom Node.js / Python layer',
    points: ['Secure auth handshake', 'Rate limits & queues', 'Vector context injection'],
    highlight: true,
  },
  {
    icon: Layout,
    label: 'stage_c',
    title: 'Business Logic',
    sub: 'Dashboards & mobile apps',
    points: ['iOS (SwiftUI)', 'React dashboards', 'SQL / vector stores'],
  },
];

const ArchitectureDiagram: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <section id="architecture" className="py-28 md:py-36 bg-ink-900 border-y border-bone/10 relative overflow-hidden blueprint">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="System Design"
          index="/ 03"
          title={<>The <em className="italic font-light text-signal">bridge</em> architecture</>}
          description="How isolated model intelligence gets connected to real-world business infrastructure — the same pattern behind every agent system I ship."
        />

        <div className="relative grid md:grid-cols-3 gap-6 md:gap-4 items-stretch">
          {/* Flow line with traveling pulses */}
          <div className="hidden md:block absolute top-1/2 left-[12%] right-[12%] h-px bg-bone/15 -translate-y-1/2 z-0">
            {!reduce &&
              [0, 1.2, 2.4].map(delay => (
                <motion.div
                  key={delay}
                  className="absolute -top-[3px] w-[7px] h-[7px] rounded-full bg-signal shadow-[0_0_12px_#ffb224]"
                  initial={{ left: '0%', opacity: 0 }}
                  animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 3.4, delay, repeat: Infinity, ease: 'linear' }}
                />
              ))}
          </div>

          {stages.map((stage, i) => (
            <Reveal key={stage.label} delay={i * 0.12} className="relative z-10 h-full">
              <div
                className={`panel panel-hover h-full p-8 flex flex-col ${
                  stage.highlight ? 'border-signal/40 bg-ink-800 md:scale-[1.04] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-3 rounded-sm ${stage.highlight ? 'bg-signal/15 text-signal' : 'bg-bone/5 text-bone-dim'} relative`}>
                    <stage.icon className="w-8 h-8" strokeWidth={1.5} />
                    {stage.highlight && (
                      <span className="absolute -top-1.5 -right-1.5 bg-ink-950 border border-signal rounded-full p-1">
                        <Lock className="w-3 h-3 text-signal" />
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-bone-mute">{stage.label}</span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-bone mb-1">{stage.title}</h3>
                <p className="font-mono text-xs text-bone-mute mb-6">{stage.sub}</p>
                <ul className="mt-auto space-y-2.5">
                  {stage.points.map(point => (
                    <li key={point} className="flex items-center gap-3 text-sm text-bone-dim">
                      <span className={`w-1 h-1 rounded-full ${stage.highlight ? 'bg-signal' : 'bg-bone/40'}`} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArchitectureDiagram;
