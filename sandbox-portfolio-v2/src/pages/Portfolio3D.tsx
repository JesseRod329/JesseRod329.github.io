import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import ThreeScene from '../components/portfolio/ThreeScene';
import FaceContent from '../components/portfolio/FaceContent';
import LoadingScreen from '../components/portfolio/LoadingScreen';
import ParticleBackground from '../components/portfolio/ParticleBackground';

// Your actual portfolio data from projects.json
import { portfolioData } from '../data/portfolioData';

export default function Portfolio3D() {
  const [currentFace, setCurrentFace] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const faceNames = ['About', 'Projects', 'Skills', 'Experience', 'Contact', 'Links'];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const nextFace = () => {
    setCurrentFace((prev) => (prev + 1) % faceNames.length);
  };

  const prevFace = () => {
    setCurrentFace((prev) => (prev - 1 + faceNames.length) % faceNames.length);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden">
      <ParticleBackground />
      
      {/* Enhanced Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 z-10" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-900/10 to-transparent z-10" />
     
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-0 left-0 right-0 z-20 p-6"
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-silver-400 to-white bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            JR
          </motion.div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.open(portfolioData.about.github, '_blank')}
              className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
            >
              <Github className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.open(portfolioData.about.linkedin, '_blank')}
              className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
            >
              <Linkedin className="w-5 h-5" />
            </button>
            <button className="bg-gradient-to-r from-gray-500 to-white hover:from-gray-600 hover:to-gray-100 text-black border-0 px-4 py-2 rounded-lg font-semibold transition-all duration-300">
              <Download className="w-4 h-4 mr-2 inline" />
              Resume
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main 3D Scene */}
      <div className="h-full w-full">
        <ThreeScene
          currentFace={currentFace}
          setCurrentFace={setCurrentFace}
          portfolioData={portfolioData}
        />
      </div>

      {/* Enhanced Navigation Controls */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex items-center gap-6 bg-black/70 backdrop-blur-md rounded-3xl p-4 border border-white/30 shadow-2xl">
          <motion.button
            onClick={prevFace}
            className="w-12 h-12 text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 rounded-xl transition-all duration-300 flex items-center justify-center border border-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <div className="flex gap-3">
            {faceNames.map((faceName, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentFace(index)}
                className={`relative w-4 h-4 rounded-full transition-all duration-500 ${
                  index === currentFace
                    ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 shadow-lg'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                title={faceName}
              >
                {index === currentFace && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      boxShadow: '0 0 20px rgba(147, 51, 234, 0.6), 0 0 40px rgba(147, 51, 234, 0.4)'
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={nextFace}
            className="w-12 h-12 text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 rounded-xl transition-all duration-300 flex items-center justify-center border border-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>

      {/* Current Section Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-8 left-8 z-20"
      >
        <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-lg font-medium">{faceNames[currentFace]}</span>
          </div>
        </div>
      </motion.div>

      {/* Face Content Overlay */}
      <motion.div
        key={currentFace}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-80"
      >
        <FaceContent
          currentFace={currentFace}
          portfolioData={portfolioData}
          faceNames={faceNames}
        />
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 right-8 z-20 text-white/60 text-sm"
      >
        <div className="flex flex-col items-end gap-2">
          <p>Drag to rotate • Scroll to zoom</p>
          <div className="flex items-center gap-1">
            <ChevronDown className="w-4 h-4 animate-bounce" />
            <span>Navigate with controls below</span>
          </div>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4"
      >
        {[
          { icon: Github, href: portfolioData.about.github },
          { icon: Linkedin, href: portfolioData.about.linkedin },
          { icon: Twitter, href: portfolioData.about.twitter },
          { icon: Mail, href: `mailto:${portfolioData.about.email}` }
        ].map(({ icon: Icon, href }, index) => (
          <motion.a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
          >
            <Icon className="w-5 h-5" />
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
