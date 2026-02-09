import React from 'react';
import { Bot, LineChart, BrainCircuit, Cable } from 'lucide-react';
import { Service } from '../types';

const services: Service[] = [
  {
    id: 'ai-agents',
    title: 'Custom AI Agents',
    description: 'Autonomous agents designed to perform specific tasks, handle customer support, or automate complex workflows 24/7.',
    icon: 'brain'
  },
  {
    id: 'fine-tuning',
    title: 'Model Fine-Tuning',
    description: 'Specializing in fine-tuning open-source LLMs (Llama, Mistral) on your proprietary data for maximum domain accuracy.',
    icon: 'cpu'
  },
  {
    id: 'dashboards',
    title: 'Business Dashboards',
    description: 'Full-stack BI dashboards visualization. Turning raw AI outputs into actionable, real-time visual insights for stakeholders.',
    icon: 'layout'
  },
  {
    id: 'integration',
    title: 'Architecture Integration',
    description: 'Seamlessly connecting new AI layers into legacy infrastructure. API development, vector databases, and secure pipelines.',
    icon: 'network'
  }
];

const Services: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'brain': return <Bot className="w-8 h-8 text-neon-blue" />;
      case 'cpu': return <BrainCircuit className="w-8 h-8 text-neon-purple" />;
      case 'layout': return <LineChart className="w-8 h-8 text-neon-green" />;
      case 'network': return <Cable className="w-8 h-8 text-yellow-400" />;
      default: return <Bot />;
    }
  };

  return (
    <section id="services" className="py-24 bg-dark-800 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Competencies</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            My technical focus bridges the gap between cutting-edge AI research and practical, revenue-generating business applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className="glass-panel p-6 rounded-xl hover:border-neon-blue/40 transition-all duration-300 group hover:-translate-y-2"
            >
              <div className="mb-6 p-4 rounded-lg bg-white/5 inline-block group-hover:bg-neon-blue/10 transition-colors">
                {getIcon(service.icon)}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-neon-blue transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;