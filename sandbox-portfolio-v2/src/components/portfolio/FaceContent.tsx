// Component imports
import { motion } from 'framer-motion';
import {
  User,
  Code,
  Zap,
  Briefcase,
  Mail,
  BookOpen,
  Star,
  MapPin,
  Calendar,
  // Clock,
  ExternalLink,
  Github
} from 'lucide-react';

interface FaceContentProps {
  currentFace: number;
  portfolioData: any;
  faceNames: string[];
}

export default function FaceContent({ currentFace, portfolioData }: FaceContentProps) {
  const renderContent = () => {
    switch(currentFace) {
      case 0: // About
        return (
          <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-white rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-xl bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent font-bold">
                  {portfolioData.about.title}
                </h3>
                <p className="text-sm text-gray-300">{portfolioData.about.subtitle}</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              {portfolioData.about.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {portfolioData.about.skills.map((skill, index) => (
                <span key={index} className="bg-white/10 text-white border border-white/20 px-2 py-1 rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );

      case 1: // Projects
        return (
          <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent font-bold">
                Featured Projects
              </h3>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {portfolioData.projects.map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-black/30 rounded-lg p-4 border border-white/10"
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: project.glow }}
                  // style={{ '--glow-color': project.glow }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold" style={{ color: project.glow }}>{project.title}</h4>
                    <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-400/30 px-2 py-1 rounded text-xs">
                      <Star className="w-3 h-3 mr-1 inline" />
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex} className="text-xs bg-white/5 text-gray-400 border border-white/20 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.open(project.links.live, '_blank')}
                      className="text-xs px-3 py-1 rounded border transition-colors duration-300"
                      style={{ 
                        color: project.glow, 
                        borderColor: project.glow + '50',
                      }}
                      onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = project.glow + '20'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
                    >
                      <ExternalLink className="w-3 h-3 mr-1 inline" />
                      Live Demo
                    </button>
                    <button 
                      onClick={() => window.open(project.links.repo, '_blank')}
                      className="text-xs px-3 py-1 rounded border border-gray-400/30 text-gray-400 hover:bg-gray-400/10 transition-colors duration-300"
                    >
                      <Github className="w-3 h-3 mr-1 inline" />
                      Code
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 2: // Skills
        return (
          <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent font-bold">
                Core Skills
              </h3>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Technical
                </h4>
                <div className="space-y-2">
                  {portfolioData.skills.technical.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-gray-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Design & Leadership
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {[...portfolioData.skills.design.slice(0, 3), ...portfolioData.skills.other.slice(0, 3)].map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-gray-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Experience
        return (
          <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent font-bold">
                Experience Timeline
              </h3>
            </div>
            <div className="space-y-4">
              {portfolioData.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  className="bg-black/30 rounded-lg p-4 border border-white/10"
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-yellow-400">{exp.role}</h4>
                      <p className="text-gray-300 font-medium">{exp.company}</p>
                    </div>
                    {index === 0 && <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{exp.period}</span>
                  </div>
                  <p className="text-sm text-gray-300">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 4: // Contact
        return (
          <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent font-bold">
                Let's Connect
              </h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                  <Mail className="w-5 h-5 text-pink-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{portfolioData.about.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white">{portfolioData.about.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p className="text-white">Open to new opportunities</p>
                  </div>
                </div>
              </div>
              <div className="text-center bg-gradient-to-r from-pink-500/10 to-pink-600/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-pink-400 mb-1">24h</div>
                <div className="text-sm text-gray-400">Average Response Time</div>
              </div>
              <button 
                onClick={() => window.open(`mailto:${portfolioData.about.email}`, '_blank')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 px-4 py-2 rounded-lg transition-all duration-300"
              >
                <Mail className="w-4 h-4 mr-2 inline" />
                Start Conversation
              </button>
            </div>
          </div>
        );

      case 5: // Links
        return (
          <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent font-bold">
                Quick Links
              </h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => window.open(portfolioData.about.github, '_blank')}
                  className="flex items-center gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/40 transition-colors duration-300"
                >
                  <Github className="w-5 h-5 text-green-400" />
                  <div className="text-left">
                    <p className="text-white font-medium">GitHub</p>
                    <p className="text-sm text-gray-400">View my code repositories</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </button>
                
                <button 
                  onClick={() => window.open(portfolioData.about.linkedin, '_blank')}
                  className="flex items-center gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/40 transition-colors duration-300"
                >
                  <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-xs font-bold text-white">in</div>
                  <div className="text-left">
                    <p className="text-white font-medium">LinkedIn</p>
                    <p className="text-sm text-gray-400">Professional network</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </button>

                <button 
                  onClick={() => window.open('https://jesserodriguez.me', '_blank')}
                  className="flex items-center gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/40 transition-colors duration-300"
                >
                  <div className="w-5 h-5 bg-purple-500 rounded flex items-center justify-center text-xs font-bold text-white">JR</div>
                  <div className="text-left">
                    <p className="text-white font-medium">Main Portfolio</p>
                    <p className="text-sm text-gray-400">Full portfolio website</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </button>
              </div>
              
              <div className="text-center bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400 mb-1">{portfolioData.projects.length}</div>
                <div className="text-sm text-gray-400">Active Projects</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      key={currentFace}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {renderContent()}
    </motion.div>
  );
}
