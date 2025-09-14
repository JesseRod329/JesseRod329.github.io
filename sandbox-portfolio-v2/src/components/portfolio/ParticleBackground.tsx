import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ParticleBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.6 + 0.2
    }));
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      twinkle: Math.random() * 3 + 2
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-black" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-800/10 to-pink-900/20" />
      <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/10 via-transparent to-cyan-900/15" />
      
      {/* Twinkling Stars */}
      {stars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: star.twinkle,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Enhanced Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(255, 255, 255, ${particle.opacity}), rgba(192, 192, 192, ${particle.opacity * 0.5}), transparent)`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(255, 255, 255, ${particle.opacity * 0.3})`
          }}
          animate={{
            y: [0, -120, 0],
            x: [0, Math.sin(particle.id) * 30, 0],
            opacity: [0, particle.opacity, 0],
            scale: [0.3, 1, 0.3]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Enhanced Floating Geometric Shapes */}
      {Array.from({ length: 15 }).map((_, index) => (
        <motion.div
          key={`shape-${index}`}
          className="absolute"
          style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{
            rotate: { duration: 40 + index * 5, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, delay: index * 0.3 },
            opacity: { duration: 8, repeat: Infinity, delay: index * 0.4 }
          }}
        >
          <div
            className={`border border-white/20 ${
              index % 3 === 0 ? 'rotate-45' : index % 3 === 1 ? 'rounded-full' : ''
            }`}
            style={{
              width: `${20 + (index % 3) * 15}px`,
              height: `${20 + (index % 3) * 15}px`,
              background: `linear-gradient(${45 + index * 30}deg, 
                rgba(255, 255, 255, 0.1), 
                rgba(192, 192, 192, 0.1), 
                rgba(128, 128, 255, 0.1))`,
              boxShadow: `0 0 20px rgba(255, 255, 255, 0.1)`
            }}
          />
        </motion.div>
      ))}

      {/* Animated Light Rays */}
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={`ray-${index}`}
          className="absolute top-0 left-1/2 origin-bottom"
          style={{
            width: '2px',
            height: '100vh',
            background: `linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent)`,
            transform: `translateX(-50%) rotate(${index * 30}deg)`,
          }}
          animate={{
            opacity: [0, 0.3, 0],
            scaleY: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: index * 1.3,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Pulsing Ring Effects */}
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          key={`ring-${index}`}
          className="absolute top-1/2 left-1/2 border border-white/10 rounded-full"
          style={{
            width: `${200 + index * 150}px`,
            height: `${200 + index * 150}px`,
            marginLeft: `${-100 - index * 75}px`,
            marginTop: `${-100 - index * 75}px`,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.1, 0.3, 0.1],
            rotate: 360
          }}
          transition={{
            scale: { duration: 8, repeat: Infinity, delay: index * 2 },
            opacity: { duration: 8, repeat: Infinity, delay: index * 2 },
            rotate: { duration: 60, repeat: Infinity, ease: "linear" }
          }}
        />
      ))}
    </div>
  );
}
