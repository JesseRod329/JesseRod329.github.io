import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Network, GitPullRequest, Plug, Cpu } from 'lucide-react';
import { Reveal, SectionHeading } from './Reveal';

const capabilities = [
  {
    icon: Network,
    num: '01',
    title: 'Multi-Agent Orchestration',
    body: 'Swarms of specialized agents — planner, researcher, coder, reviewer — coordinated through shared memory, task queues, and routing logic. Built and battle-tested on my own orchestration stack, clawd.',
    tags: ['routing', 'shared memory', 'task queues'],
  },
  {
    icon: GitPullRequest,
    num: '02',
    title: 'Agents That Ship Code',
    body: 'Production coding assistants that take a ticket, write the code, run the tests, and open the pull request. openclaw runs this loop daily across my own repos before it ever touches a client\u2019s.',
    tags: ['autonomous PRs', 'test loops', 'code review'],
  },
  {
    icon: Plug,
    num: '03',
    title: 'MCP Servers & Tooling',
    body: 'Custom Model Context Protocol servers that hand agents real capabilities: databases, Linear, GitHub, iMessage, internal APIs. The difference between a chatbot and a coworker is its tools.',
    tags: ['MCP', 'tool design', 'integrations'],
  },
  {
    icon: Cpu,
    num: '04',
    title: 'Hybrid Local + Cloud Models',
    body: 'Fine-tuned open models running locally on Apple Silicon with MLX, routed alongside frontier APIs. Private where it matters, powerful where it counts, cheap everywhere else.',
    tags: ['MLX', 'fine-tuning', 'model routing'],
  },
];

const workers = [
  { label: 'planner', angle: -132 },
  { label: 'researcher', angle: -48 },
  { label: 'coder', angle: 48 },
  { label: 'reviewer', angle: 132 },
];

/** Animated orchestration graph: pulses travel from the hub to each worker. */
const OrchestrationGraph: React.FC = () => {
  const reduce = useReducedMotion();
  const cx = 200;
  const cy = 190;
  const r = 140;

  return (
    <svg viewBox="0 0 400 380" className="w-full max-w-[440px] mx-auto" aria-hidden>
      {workers.map((w, i) => {
        const rad = (w.angle * Math.PI) / 180;
        const x = cx + r * Math.sin(rad);
        const y = cy - r * Math.cos(rad);
        return (
          <g key={w.label}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(236,228,211,0.15)" strokeWidth="1" />
            {!reduce && (
              <motion.circle
                r="3.5"
                fill="#ffb224"
                initial={{ cx, cy, opacity: 0 }}
                animate={{ cx: [cx, x], cy: [cy, y], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.8, delay: i * 0.45, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
              />
            )}
            <circle cx={x} cy={y} r="34" fill="#12100c" stroke="rgba(236,228,211,0.2)" strokeWidth="1" />
            <text x={x} y={y + 4} textAnchor="middle" fill="#a89f8b" fontSize="11" fontFamily="'IBM Plex Mono', monospace">
              {w.label}
            </text>
          </g>
        );
      })}

      {/* Hub */}
      {!reduce && (
        <motion.circle
          cx={cx}
          cy={cy}
          r="52"
          fill="none"
          stroke="#ffb224"
          strokeWidth="1"
          animate={{ r: [52, 68], opacity: [0.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <circle cx={cx} cy={cy} r="52" fill="#181510" stroke="#ffb224" strokeWidth="1.5" />
      <text x={cx} y={cy - 3} textAnchor="middle" fill="#ffb224" fontSize="12" fontFamily="'IBM Plex Mono', monospace" fontWeight="700">
        orchestrator
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#6f6757" fontSize="9" fontFamily="'IBM Plex Mono', monospace">
        clawd core
      </text>
    </svg>
  );
};

const AgentLab: React.FC = () => (
  <section id="agents" className="relative py-28 md:py-36 bg-ink-900 border-y border-bone/10 overflow-hidden">
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-signal/[0.04] rounded-full blur-[120px] pointer-events-none" />

    <div className="relative max-w-7xl mx-auto px-6">
      <SectionHeading
        eyebrow="The Agent Lab"
        index="/ 01"
        title={<>Systems that <em className="italic font-light text-signal">think</em> in teams</>}
        description="The last year of my work has been agents: orchestration frameworks, coding assistants that ship real PRs, MCP tooling, and hybrid local-cloud model pipelines. This is what I run every day."
      />

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-16 items-center mb-20">
        <Reveal delay={0.1}>
          <OrchestrationGraph />
        </Reveal>
        <div className="space-y-4 font-mono text-sm text-bone-dim leading-relaxed">
          <Reveal delay={0.15}>
            <p className="border-l-2 border-signal pl-5 py-1">
              <span className="text-bone">clawd</span> — my multi-agent orchestration system. One
              orchestrator, many workers, shared context, real task hand-offs.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="border-l-2 border-bone/20 pl-5 py-1">
              <span className="text-bone">openclaw</span> — a production coding assistant that plans,
              edits, tests, and opens pull requests on its own.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <p className="border-l-2 border-bone/20 pl-5 py-1">
              <span className="text-bone">hybrid runtime</span> — fine-tuned local models on an M4 Mac
              via MLX, frontier models in the cloud, routed per task.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-bone/10 border border-bone/10">
        {capabilities.map((cap, i) => (
          <Reveal key={cap.num} delay={i * 0.08} y={20}>
            <div className="group relative bg-ink-900 p-8 md:p-10 h-full transition-colors duration-500 hover:bg-ink-800">
              <div className="flex items-start justify-between mb-8">
                <cap.icon className="w-7 h-7 text-signal" strokeWidth={1.5} />
                <span className="font-mono text-xs text-bone-mute">{cap.num}</span>
              </div>
              <h3 className="font-display text-2xl font-semibold mb-4 text-bone group-hover:text-signal transition-colors duration-300">
                {cap.title}
              </h3>
              <p className="text-bone-dim leading-relaxed mb-6">{cap.body}</p>
              <div className="flex flex-wrap gap-2">
                {cap.tags.map(tag => (
                  <span key={tag} className="font-mono text-[11px] px-3 py-1 border border-bone/15 text-bone-mute rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-signal transition-all duration-500 group-hover:w-full" />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default AgentLab;
