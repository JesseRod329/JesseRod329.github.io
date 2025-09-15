import { motion } from "framer-motion";

export default function Info() {
  document.title = 'Info • Jesse R.'
  
  return (
    <motion.article 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.35 }}
      className="max-w-[70ch]"
    >
      <header className="mb-12">
        <h1 className="text-[clamp(36px,6.2vw,64px)] font-light tracking-[-0.02em] leading-[0.9] neomorphic-text-white mb-4">
          About
        </h1>
        <p className="neomorphic-text-muted text-sm">
          Designer & Developer • Creative Technologist
        </p>
      </header>

      <section className="space-y-8 leading-relaxed">
        <div className="neomorphic-card p-8">
          <p className="text-lg neomorphic-text-white mb-4">
            I'm Jesse, a designer and developer focused on creating meaningful digital experiences. 
            I specialize in frontend development, UI/UX design, and creative coding.
          </p>
          
          <p className="neomorphic-text-muted">
            My work spans from interactive web applications to data visualizations, 
            always with an emphasis on clean design, smooth animations, and user-centered thinking.
          </p>
        </div>

        <div className="neomorphic-card p-8 space-y-6">
          <h2 className="text-xl font-light neomorphic-text-white">Skills & Tools</h2>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium neomorphic-text-white mb-3">Frontend</h3>
              <ul className="space-y-2 neomorphic-text-muted">
                <li>React, TypeScript, Next.js</li>
                <li>Framer Motion, Three.js</li>
                <li>Tailwind CSS, Styled Components</li>
                <li>Canvas API, WebGL</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium neomorphic-text-white mb-3">Design</h3>
              <ul className="space-y-2 neomorphic-text-muted">
                <li>Figma, Adobe Creative Suite</li>
                <li>UI/UX Design Systems</li>
                <li>Motion Design</li>
                <li>Color Theory, Typography</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="neomorphic-card p-8 space-y-4">
          <h2 className="text-xl font-light neomorphic-text-white">Philosophy</h2>
          <p className="neomorphic-text-muted leading-relaxed">
            I believe in the power of thoughtful design and clean code. Every project is an opportunity 
            to learn, experiment, and create something that brings joy to users while solving real problems.
          </p>
        </div>
      </section>
    </motion.article>
  )
}
