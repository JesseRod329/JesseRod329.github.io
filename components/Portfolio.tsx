import React, { useState } from 'react';
import { ExternalLink, Github, Smartphone, Terminal, Layout, Layers, Brain, ArrowRight } from 'lucide-react';
import { projects } from '../data/projects';
import { ProjectCategory } from '../types';

const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProjectCategory | 'all'>('all');

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  const tabs: { id: ProjectCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Work', icon: <Layers className="w-4 h-4" /> },
    { id: 'interface', label: 'Mobile & Interface', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'system', label: 'System Architecture', icon: <Terminal className="w-4 h-4" /> },
    { id: 'creative', label: 'Creative & Web', icon: <Layout className="w-4 h-4" /> },
  ];

  return (
    <section id="portfolio" className="py-24 bg-dark-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Selected Projects</h2>
            <p className="text-gray-400 max-w-xl">
              From high-performance iOS apps to autonomous agent systems.
            </p>
          </div>
          <a 
            href="https://github.com/JesseRod329" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-neon-blue hover:text-white transition-colors flex items-center gap-2 font-mono text-sm group"
          >
            View all on GitHub <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeTab === tab.id
                  ? 'bg-neon-blue/10 border-neon-blue text-neon-blue'
                  : 'bg-white/5 border-transparent text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="group relative bg-dark-800 rounded-xl overflow-hidden border border-white/5 hover:border-neon-purple/40 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image / Placeholder */}
              <div className="aspect-video overflow-hidden bg-dark-900 relative">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                {/* Fallback for broken images */}
                <div className="hidden absolute inset-0 flex items-center justify-center bg-dark-900">
                   {project.category === 'interface' && <Smartphone className="w-12 h-12 text-gray-700" />}
                   {project.category === 'system' && <Terminal className="w-12 h-12 text-gray-700" />}
                   {project.category === 'creative' && <Layout className="w-12 h-12 text-gray-700" />}
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`
                    text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/10
                    ${project.category === 'interface' ? 'bg-neon-green/10 text-neon-green' : ''}
                    ${project.category === 'system' ? 'bg-neon-purple/10 text-neon-purple' : ''}
                    ${project.category === 'creative' ? 'bg-neon-blue/10 text-neon-blue' : ''}
                  `}>
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-neon-blue transition-colors flex items-center gap-2">
                  {project.title}
                  {project.featured && <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded border border-yellow-400/20">Featured</span>}
                </h3>
                
                <p className="text-gray-400 text-sm mb-6 leading-relaxed h-12 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  {project.github && (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" /> Code
                    </a>
                  )}
                  {project.link && project.link !== '#' && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors ml-auto"
                    >
                      Live Demo <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
