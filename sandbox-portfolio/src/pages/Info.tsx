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
      <header className="mb-8">
        <h1 className="text-[clamp(36px,6.2vw,64px)] font-light tracking-[-0.02em] leading-[0.9] text-fg mb-4">
          About
        </h1>
        <p className="text-muted text-sm">
          Designer & Developer • Creative Technologist
        </p>
      </header>

      <section className="space-y-6 text-fg leading-relaxed">
        <p className="text-lg">
          I'm Jesse, a designer and developer focused on creating meaningful digital experiences. 
          I specialize in frontend development, UI/UX design, and creative coding.
        </p>
        
        <p>
          My work spans from interactive web applications to data visualizations, 
          always with an emphasis on clean design, smooth animations, and user-centered thinking.
        </p>

        <div className="space-y-4">
          <h2 className="text-xl font-light text-fg">Skills & Tools</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-fg mb-2">Frontend</h3>
              <ul className="space-y-1 text-muted">
                <li>React, TypeScript, Next.js</li>
                <li>Framer Motion, Three.js</li>
                <li>Tailwind CSS, Styled Components</li>
                <li>Canvas API, WebGL</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-fg mb-2">Design</h3>
              <ul className="space-y-1 text-muted">
                <li>Figma, Adobe Creative Suite</li>
                <li>UI/UX Design Systems</li>
                <li>Motion Design</li>
                <li>Color Theory, Typography</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-light text-fg">Philosophy</h2>
          <p className="text-muted">
            I believe in the power of thoughtful design and clean code. Every project is an opportunity 
            to learn, experiment, and create something that brings joy to users while solving real problems.
          </p>
        </div>
      </section>
    </motion.article>
  )
}
