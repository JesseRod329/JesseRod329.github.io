import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

/** Scroll-triggered rise + blur-in reveal used across all sections. */
export const Reveal: React.FC<RevealProps> = ({ children, delay = 0, y = 28, className, once = true }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

interface SectionHeadingProps {
  eyebrow: string;
  index: string;
  title: React.ReactNode;
  description?: string;
  align?: 'left' | 'center';
}

/** Numbered editorial section header. */
export const SectionHeading: React.FC<SectionHeadingProps> = ({ eyebrow, index, title, description, align = 'left' }) => (
  <div className={`mb-16 ${align === 'center' ? 'text-center' : ''}`}>
    <Reveal>
      <div className={`flex items-baseline gap-4 mb-5 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="eyebrow text-signal">{eyebrow}</span>
        <span className="h-px flex-1 max-w-[80px] bg-signal/30 self-center" />
        <span className="font-mono text-xs text-bone-mute">{index}</span>
      </div>
    </Reveal>
    <Reveal delay={0.08}>
      <h2 className="font-display text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight text-bone">
        {title}
      </h2>
    </Reveal>
    {description && (
      <Reveal delay={0.16}>
        <p className={`mt-6 text-lg text-bone-dim leading-relaxed max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      </Reveal>
    )}
  </div>
);
