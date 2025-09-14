import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ParticleBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-white/20 to-gray-400/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Floating Geometric Shapes */}
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.div
          key={`shape-${index}`}
          className="absolute"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, delay: index * 0.5 }
          }}
        >
          <div
            className={`w-8 h-8 border border-white/10 ${
              index % 2 === 0 ? 'rotate-45' : ''
            }`}
            style={{
              background: `linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(192, 192, 192, 0.1))`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
