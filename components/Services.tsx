import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, SectionHeading } from './Reveal';

const services = [
  {
    num: '01',
    title: 'Agent Systems for Business',
    body: 'Autonomous agents wired into your actual operations — support queues, research pipelines, internal tooling — running around the clock with human-grade hand-offs.',
    meta: 'orchestration · MCP · workflows',
  },
  {
    num: '02',
    title: 'Model Fine-Tuning',
    body: 'Open models (Llama, Mistral, Qwen) trained on your proprietary data. Local deployment on Apple Silicon or cloud, whichever your privacy posture demands.',
    meta: 'MLX · PyTorch · HuggingFace',
  },
  {
    num: '03',
    title: 'Intelligence Dashboards',
    body: 'Real-time views into what your agents are doing and what they are worth: token spend, task throughput, ROI. WebSocket streams into custom React visualizations.',
    meta: 'React · Recharts · WebSockets',
  },
  {
    num: '04',
    title: 'The Bridge Build',
    body: 'Connecting new AI layers to legacy infrastructure. Custom Node.js and Python APIs, vector pipelines, auth handshakes — the unglamorous plumbing that makes it real.',
    meta: 'Node.js · Python · vector DBs',
  },
];

const Services: React.FC = () => (
  <section id="services" className="py-28 md:py-36 relative">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading
        eyebrow="Engagements"
        index="/ 02"
        title={<>What I build <em className="italic font-light text-signal">for clients</em></>}
      />

      <div className="border-t border-bone/10">
        {services.map((s, i) => (
          <Reveal key={s.num} delay={i * 0.05} y={16}>
            <div className="group grid md:grid-cols-[80px_1fr_1.4fr_auto] gap-4 md:gap-10 items-baseline py-10 border-b border-bone/10 transition-colors duration-300 hover:bg-bone/[0.02] px-2 md:px-4">
              <span className="font-mono text-sm text-bone-mute">{s.num}</span>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-bone group-hover:text-signal transition-colors duration-300">
                {s.title}
              </h3>
              <div>
                <p className="text-bone-dim leading-relaxed mb-3">{s.body}</p>
                <span className="font-mono text-[11px] text-bone-mute tracking-wide">{s.meta}</span>
              </div>
              <ArrowUpRight className="hidden md:block w-6 h-6 text-bone-mute transition-all duration-300 group-hover:text-signal group-hover:translate-x-1 group-hover:-translate-y-1 self-center" />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
