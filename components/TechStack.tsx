import React from 'react';

const items = [
  'Multi-Agent Systems', 'MCP', 'Gemini', 'OpenAI', 'Claude', 'MLX', 'Fine-Tuning',
  'SwiftUI', 'React', 'TypeScript', 'Python', 'Node.js', 'LangChain', 'RAG', 'Cursor',
];

/** Typographic marquee — repeated twice for a seamless loop. */
const TechStack: React.FC = () => (
  <div className="w-full bg-ink-950 border-b border-bone/10 py-6 overflow-hidden relative select-none">
    <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-ink-950 to-transparent pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-ink-950 to-transparent pointer-events-none" />

    <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
      {[...items, ...items].map((item, index) => (
        <div key={`${item}-${index}`} className="flex items-center shrink-0">
          <span className="font-display italic font-light text-xl md:text-2xl text-bone-dim hover:text-signal transition-colors duration-300 cursor-default px-6">
            {item}
          </span>
          <span className="text-signal/60 text-xs">✦</span>
        </div>
      ))}
    </div>
  </div>
);

export default TechStack;
