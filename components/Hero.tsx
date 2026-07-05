import React, { useEffect, useMemo, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

// ============================================
// COMPLETE HERO REDESIGN — Minimal text. Maximum visual.
// ============================================

const SwarmVisualizer: React.FC = () => {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  // Stunning modern palette — rich cyan/teal. Zero yellow.
  const ACCENT = '#22d3ee';
  const ACCENT_BRIGHT = '#a5f3fc';
  const GLOW = 'rgba(34, 211, 238, 0.65)';

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || reduce) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    type Node = { 
      x: number; y: number; vx: number; vy: number; 
      label: string; r: number; isCore: boolean; 
    };

    const nodes: Node[] = [
      { x: width * 0.5,  y: height * 0.22, vx: 0.18, vy: 0.09, label: 'CORE', r: 15, isCore: true },
      { x: width * 0.2,  y: height * 0.32, vx: -0.22, vy: 0.12, label: 'PLAN', r: 9.5, isCore: false },
      { x: width * 0.8,  y: height * 0.32, vx: 0.21, vy: -0.11, label: 'RES', r: 9.5, isCore: false },
      { x: width * 0.14, y: height * 0.68, vx: -0.16, vy: 0.13, label: 'CODE', r: 8, isCore: false },
      { x: width * 0.5,  y: height * 0.78, vx: 0.14, vy: -0.19, label: 'CODE', r: 8, isCore: false },
      { x: width * 0.86, y: height * 0.68, vx: -0.12, vy: 0.18, label: 'REV', r: 8, isCore: false },
      { x: width * 0.28, y: height * 0.52, vx: 0.2, vy: -0.08, label: 'MCP', r: 7, isCore: false },
    ];

    type Particle = { 
      x: number; y: number; vx: number; vy: number; 
      life: number; maxLife: number; size: number; color: string; 
      trail?: {x:number, y:number}[]; 
    };
    let particles: Particle[] = [];

    const spawnAmbient = (count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.42,
          vy: (Math.random() - 0.5) * 0.42,
          life: 140 + Math.random() * 160,
          maxLife: 180,
          size: 0.85 + Math.random() * 1.1,
          color: ACCENT_BRIGHT,
        });
      }
    };
    spawnAmbient(32);

    const triggerBurst = (clickX?: number, clickY?: number) => {
      const origin = clickX !== undefined 
        ? nodes.reduce((a, b) => {
            const da = Math.hypot(a.x - clickX, a.y - clickY);
            const db = Math.hypot(b.x - clickX, b.y - clickY);
            return da < db ? a : b;
          })
        : nodes[Math.floor(Math.random() * nodes.length)];

      // Massive, satisfying burst
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
        const speed = 2.4 + Math.random() * 3.1;
        particles.push({
          x: origin.x,
          y: origin.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 48 + Math.random() * 28,
          maxLife: 68,
          size: 2.4 + Math.random() * 1.7,
          color: Math.random() > 0.25 ? '#fff' : ACCENT_BRIGHT,
          trail: [],
        });
      }

      // High-speed data streams between nodes
      nodes.forEach(target => {
        if (target === origin) return;
        const dx = target.x - origin.x;
        const dy = target.y - origin.y;
        const dist = Math.hypot(dx, dy) || 1;
        for (let k = 0; k < 5; k++) {
          particles.push({
            x: origin.x + dx * (0.12 + k * 0.16),
            y: origin.y + dy * (0.12 + k * 0.16),
            vx: (dx / dist) * (1.8 + k * 0.35),
            vy: (dy / dist) * (1.8 + k * 0.35),
            life: 26 + k * 5,
            maxLife: 44,
            size: 1.7,
            color: ACCENT_BRIGHT,
          });
        }
      });
    };

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const handleLeave = () => { mouseRef.current.active = false; };
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      triggerBurst(e.clientX - rect.left, e.clientY - rect.top);
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', handleLeave);
    canvas.addEventListener('click', handleClick);

    let time = 0;
    const draw = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Rich dark base
      ctx.fillStyle = '#040404';
      ctx.fillRect(0, 0, width, height);

      // Dense moving starfield for depth
      ctx.fillStyle = 'rgba(165, 243, 252, 0.07)';
      for (let s = 0; s < 65; s++) {
        const sx = ((s * 83 + time * 0.22) % (width + 50)) - 25;
        const sy = ((s * 47 + Math.sin(time * 0.008 + s * 1.3) * 11) % (height + 50)) - 25;
        ctx.fillRect(sx, sy, 1.1, 1.1);
      }

      const mouse = mouseRef.current;

      // Update nodes with strong mouse influence
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        n.vx += (Math.random() - 0.5) * 0.03;
        n.vy += (Math.random() - 0.5) * 0.03;

        if (n.x < 42 || n.x > width - 42) n.vx *= -0.88;
        if (n.y < 42 || n.y > height - 42) n.vy *= -0.88;

        n.vx *= 0.981;
        n.vy *= 0.981;

        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < 205) {
            const f = ((205 - d) / 205) * 1.3;
            n.vx += (dx / d) * f;
            n.vy += (dy / d) * f;
          }
        }
      });

      // Dramatic glowing connections
      ctx.lineCap = 'round';
      nodes.forEach((n1, i) => {
        nodes.slice(i + 1).forEach(n2 => {
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const d = Math.hypot(dx, dy);
          if (d > 14 && d < 225) {
            const a = Math.pow(1 - d / 225, 1.9) * 0.9;
            ctx.strokeStyle = `rgba(34, 211, 238, ${a})`;
            ctx.lineWidth = 1.3 + (1 - d / 225) * 2.6;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();

            if (a > 0.42) {
              ctx.strokeStyle = `rgba(165, 243, 252, ${a * 0.5})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.stroke();
            }
          }
        });
      });

      // Particles with beautiful trails
      particles = particles.filter(p => {
        if (p.trail) {
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 7) p.trail.shift();
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        p.vx *= 0.972;
        p.vy *= 0.972;

        if (p.life <= 0) return false;

        const prog = p.life / p.maxLife;

        // Trail
        if (p.trail && p.trail.length > 1) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * 0.55;
          ctx.globalAlpha = prog * 0.4;
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) ctx.lineTo(p.trail[t].x, p.trail[t].y);
          ctx.stroke();
        }

        // Strong glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 13;
        ctx.globalAlpha = prog * 0.95;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.65 + prog * 0.55), 0, Math.PI * 2);
        ctx.fill();

        // Sharp core
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = prog * 0.92;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.32, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Beautiful glowing nodes
      nodes.forEach((n, i) => {
        const pulse = n.isCore 
          ? 0.8 + Math.sin(time * 0.068 + i) * 0.24 
          : 0.86 + Math.sin(time * 0.047 + i * 1.8) * 0.13;
        const r = n.r * pulse;

        // Massive outer bloom
        ctx.shadowColor = ACCENT;
        ctx.shadowBlur = n.isCore ? 38 : 20;
        ctx.fillStyle = GLOW;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.05, 0, Math.PI * 2);
        ctx.fill();

        // Main orb
        ctx.shadowBlur = n.isCore ? 15 : 10;
        ctx.fillStyle = n.isCore ? ACCENT_BRIGHT : '#e6d9c2';
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Dark center
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#040404';
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.52, 0, Math.PI * 2);
        ctx.fill();

        // Crisp ring
        ctx.strokeStyle = n.isCore ? '#fff' : ACCENT;
        ctx.lineWidth = n.isCore ? 2.4 : 1.4;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.8, 0, Math.PI * 2);
        ctx.stroke();
      });

      if (Math.random() < 0.08) spawnAmbient(1);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    (container as any)._burst = triggerBurst;

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseleave', handleLeave);
      canvas.removeEventListener('click', handleClick);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [reduce]);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (reduce) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    (container as any)._burst?.(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleContainerClick}
      className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-black cursor-pointer active:scale-[0.992] transition-transform duration-150"
      style={{ height: 'clamp(480px, 62vh, 660px)' }}
      title="Click to fire a burst"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Minimal elegant HUD */}
      <div className="absolute top-5 left-5 font-mono text-[10px] tracking-[4px] text-white/25 pointer-events-none flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-[#a5f3fc] animate-pulse" />
        SWARM ACTIVE
      </div>
      <div className="absolute bottom-5 right-5 font-mono text-[9px] tracking-[2.5px] text-white/20 pointer-events-none">
        CLICK TO DISPATCH
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yDrift = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden blueprint">
      {/* Subtle atmospheric light */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[820px] h-[520px] bg-[#22d3ee]/[0.035] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ink-950 to-transparent pointer-events-none" />

      <motion.div 
        style={{ y: yDrift }} 
        className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-32 pb-16 grid lg:grid-cols-[0.95fr_1.35fr] gap-10 lg:gap-14 items-center"
      >
        {/* LEFT — Extremely minimal text */}
        <div className="max-w-[42ch]">
          <div className="inline-flex items-center gap-2 mb-8 font-mono text-[10px] tracking-[3px] uppercase text-white/50 border border-white/10 px-4 py-1.5 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22d3ee] opacity-70" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22d3ee]" />
            </span>
            NYC
          </div>

          <h1 className="font-display text-[72px] md:text-[86px] leading-[0.88] tracking-[-4.2px] text-bone font-semibold">
            Agents<br />that ship.
          </h1>

          <p className="mt-6 text-[17px] text-bone-dim leading-tight max-w-[34ch]">
            I build systems that get real work done.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="group inline-flex items-center gap-3 bg-[#22d3ee] text-black font-semibold px-8 py-4 rounded-sm hover:bg-white transition-all active:scale-[0.985]"
            >
              See the work
              <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#agents"
              className="group inline-flex items-center gap-3 font-semibold px-7 py-4 rounded-sm border border-white/20 hover:border-white/50 hover:text-white transition-colors"
            >
              How it works
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* RIGHT — The captivating visual */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="mb-3 px-1 flex items-center justify-between text-[10px] font-mono tracking-[2.5px] text-white/35">
            <div>LIVE AGENT NETWORK</div>
            <div>INTERACTIVE</div>
          </div>

          <SwarmVisualizer />

          <div className="mt-2.5 text-center text-[10px] font-mono tracking-[1.5px] text-white/20">
            7 AGENTS • REAL-TIME • CLICK TO BURST
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between font-mono text-[10px] text-white/40 tracking-[1.5px]">
          <span>JESSE RODRIGUEZ</span>
          <span className="hidden md:block">AI SYSTEMS &amp; AUTONOMOUS AGENTS</span>
          <span>EST. 2024</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;