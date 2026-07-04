import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github } from 'lucide-react';
import { projects } from '../data/projects';
import { ProjectCategory } from '../types';
import { Reveal, SectionHeading } from './Reveal';

const tabs: { id: ProjectCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All work' },
  { id: 'system', label: 'Agents & systems' },
  { id: 'interface', label: 'Mobile & interface' },
  { id: 'creative', label: 'Creative & web' },
];

const categoryLabel: Record<ProjectCategory, string> = {
  system: 'system',
  interface: 'interface',
  creative: 'creative',
};

const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProjectCategory | 'all'>('all');

  const filtered = activeTab === 'all' ? projects : projects.filter(p => p.category === activeTab);

  return (
    <section id="work" className="py-28 md:py-36 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-4">
          <SectionHeading
            eyebrow="Selected Work"
            index="/ 04"
            title={<>Projects with a <em className="italic font-light text-signal">pulse</em></>}
          />
          <Reveal delay={0.2}>
            <a
              href="https://github.com/JesseRod329"
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-16 inline-flex items-center gap-2 font-mono text-sm text-bone-dim hover:text-signal transition-colors"
            >
              view all on github
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        <Reveal>
          <div className="flex flex-wrap gap-2 mb-14">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors duration-300 border ${
                  activeTab === tab.id
                    ? 'border-signal text-signal bg-signal/5'
                    : 'border-bone/15 text-bone-mute hover:text-bone hover:border-bone/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-bone/10 border border-bone/10">
          <AnimatePresence mode="popLayout">
            {filtered.map(project => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-ink-950 p-8 flex flex-col min-h-[300px] transition-colors duration-500 hover:bg-ink-800"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-mute">
                    {categoryLabel[project.category]}
                  </span>
                  {project.featured && (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-signal border border-signal/30 px-2.5 py-1">
                      featured
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl font-semibold text-bone mb-3 group-hover:text-signal transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-sm text-bone-dim leading-relaxed mb-8">{project.description}</p>

                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="font-mono text-[11px] text-bone-mute">
                        #{tag.replace(/\s+/g, '-').toLowerCase()}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-5 pt-5 border-t border-bone/10">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-xs text-bone-dim hover:text-signal transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" /> code
                      </a>
                    )}
                    {project.link && project.link !== '#' && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-xs text-bone-dim hover:text-signal transition-colors ml-auto"
                      >
                        live <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="absolute top-0 left-0 h-[2px] w-0 bg-signal transition-all duration-500 group-hover:w-full" />
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
