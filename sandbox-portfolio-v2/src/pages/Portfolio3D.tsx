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
const portfolioData = {
  about: {
    title: "Jesse Rodriguez",
    subtitle: "Full Stack Developer & Creative Technologist",
    description: "I craft digital experiences that blend cutting-edge technology with thoughtful design. Passionate about creating solutions that make a real impact.",
    skills: ["React", "Three.js", "Python", "AI/ML", "Web Audio", "Design Systems"],
    email: "jesse@jesserodriguez.me",
    location: "Remote",
    github: "https://github.com/JesseRod329",
    linkedin: "https://linkedin.com/in/jesserodriguez",
    twitter: "https://twitter.com/jesserodriguez"
  },
  projects: [
    {
      title: "Knock Knock Door",
      description: "Interactive door experience with customizable styles and realistic knock sounds using Web Audio API",
      tech: ["HTML", "CSS", "JavaScript", "Web Audio API", "Tailwind CSS"],
      status: "Live",
      glow: "#ff6b6b", // Red glow
      links: {
        live: "https://jesserodriguez.me/knock.html",
        repo: "https://github.com/JesseRod329/JesseRod329.github.io"
      }
    },
    {
      title: "The Philosopher's Library",
      description: "Immersive digital library featuring 100 essential philosophical texts with Three.js art backgrounds",
      tech: ["HTML", "CSS", "JavaScript", "Three.js", "Tailwind CSS"],
      status: "Featured",
      glow: "#4ecdc4", // Cyan glow
      links: {
        live: "https://jesserodriguez.me/philosophers-library.html",
        repo: "https://github.com/JesseRod329/JesseRod329.github.io"
      }
    },
    {
      title: "NYC's Public AI Future",
      description: "Interactive plan for NYC-owned AI with phases, budget visualization, roadmap, and governance",
      tech: ["HTML", "Tailwind CSS", "Chart.js", "Vanilla JS"],
      status: "Planning",
      glow: "#ffe66d", // Yellow glow
      links: {
        live: "https://jesserodriguez.me/nyc-public-ai.html",
        repo: "https://github.com/JesseRod329/JesseRod329.github.io"
      }
    },
    {
      title: "AI Brainwave Simulator",
      description: "Privacy-first neural activity visualization with real-time brainwave pattern analysis",
      tech: ["JavaScript", "Canvas API", "Local Processing", "Privacy-First"],
      status: "Popular",
      glow: "#ff8b94", // Pink glow
      links: {
        live: "https://jesserodriguez.me/brainwave-simulator/brainwave-simulator.html",
        repo: "https://github.com/JesseRod329/brainwave-sim"
      }
    },
    {
      title: "Fashion Palette Generator",
      description: "Creative tool for generating harmonious color palettes for fashion design with local processing",
      tech: ["React", "Color Theory", "Canvas API", "Local Processing"],
      status: "Production",
      glow: "#96ceb4", // Green glow
      links: {
        live: "https://jesserodriguez.me/fashion-palette/",
        repo: "https://github.com/JesseRod329/fashion-palette"
      }
    },
    {
      title: "Circular Daily Planner",
      description: "Innovative daily planning interface with circular design patterns and export capabilities",
      tech: ["HTML", "CSS", "JavaScript", "Export Functionality"],
      status: "Active",
      glow: "#a8e6cf", // Light green glow
      links: {
        live: "https://jesserodriguez.me/planner/index.html",
        repo: "https://github.com/JesseRod329/circular-planner"
      }
    }
  ],
  skills: {
    technical: ["JavaScript/TypeScript", "React/Next.js", "Three.js/WebGL", "Python", "Node.js", "AI/ML"],
    design: ["UI/UX Design", "3D Modeling", "Motion Graphics", "Design Systems", "Figma", "Creative Suite"],
    other: ["Team Leadership", "Product Strategy", "Open Source", "Web Audio", "Canvas API", "Privacy-First"]
  },
  experience: [
    {
      company: "Independent Developer",
      role: "Full Stack Developer & Designer",
      period: "2024 - Present",
      description: "Building innovative web experiences with focus on privacy, performance, and user delight"
    },
    {
      company: "Creative Projects",
      role: "Technical Creator",
      period: "2023 - 2024",
      description: "Developed interactive tools and applications spanning AI, design, and creative technology"
    },
    {
      company: "Portfolio Development",
      role: "Frontend Specialist",
      period: "2022 - 2023",
      description: "Created cutting-edge portfolio experiences and experimental web technologies"
    }
  ]
};

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

      {/* Navigation Controls */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md rounded-2xl p-2 border border-white/20">
          <button
            onClick={prevFace}
            className="w-10 h-10 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {faceNames.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentFace(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentFace
                    ? 'bg-gradient-to-r from-gray-400 to-white shadow-lg'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          <button
            onClick={nextFace}
            className="w-10 h-10 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
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
