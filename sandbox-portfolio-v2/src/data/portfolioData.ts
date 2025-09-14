
export interface Project {
  title: string;
  description: string;
  tech: string[];
  status: string;
  glow: string;
  links: {
    live: string;
    repo: string;
  };
}

export interface SkillCategory {
  technical: string[];
  design: string[];
  other: string[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface PortfolioData {
  about: {
    title: string;
    subtitle: string;
    description: string;
    skills: string[];
    email: string;
    location: string;
    github: string;
    linkedin: string;
    twitter: string;
  };
  projects: Project[];
  skills: SkillCategory;
  experience: Experience[];
}

export const portfolioData: PortfolioData = {
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
