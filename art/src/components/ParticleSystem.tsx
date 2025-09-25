import { useEffect, useRef } from 'react';
import { Particle, ParticleConfig } from '../types';

interface ParticleSystemProps {
  config: ParticleConfig;
  isActive: boolean;
  color: string;
  position: { x: number; y: number };
}

export default function ParticleSystem({
  config,
  isActive,
  color,
  position,
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const lastPositionRef = useRef(position);

  // Create new particles function
  const createParticles = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < config.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = config.velocity.min + Math.random() * (config.velocity.max - config.velocity.min);
      const size = config.size.min + Math.random() * (config.size.max - config.size.min);
      const lifetime = config.lifetime.min + Math.random() * (config.lifetime.max - config.lifetime.min);

      newParticles.push({
        id: `${Date.now()}-${i}`,
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size,
        color,
        alpha: 0.8 + Math.random() * 0.2,
        lifetime: 0,
        maxLifetime: lifetime,
        gravity: config.gravity,
        wind: config.wind,
      });
    }
    particlesRef.current.push(...newParticles);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Update particles
    const updateParticles = () => {
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += particle.gravity;
        particle.vx += particle.wind;
        particle.lifetime += 16; // Assuming 60fps
        particle.alpha = Math.max(0, 1 - (particle.lifetime / particle.maxLifetime));

        return particle.lifetime < particle.maxLifetime && particle.alpha > 0;
      });
    };

    // Render particles
    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    // Animation loop
    const animate = () => {
      updateParticles();
      renderParticles();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, color]);

  // Create particles when drawing
  useEffect(() => {
    if (isActive) {
      const distance = Math.sqrt(
        Math.pow(position.x - lastPositionRef.current.x, 2) +
        Math.pow(position.y - lastPositionRef.current.y, 2)
      );
      
      if (distance > 5) { // Only create particles if moved enough
        createParticles(position.x, position.y);
        lastPositionRef.current = position;
      }
    }
  }, [isActive, position, config]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ opacity: isActive ? 1 : 0.3 }}
    />
  );
}
