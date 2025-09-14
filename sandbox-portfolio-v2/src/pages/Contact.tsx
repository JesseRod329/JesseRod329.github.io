import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  document.title = 'Contact • Jesse R.'
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Thank you for your message! I\'ll get back to you soon.');
    setFormData({ email: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.35 }}
      className="max-w-[70ch]"
    >
      <header className="mb-8">
        <h1 className="text-[clamp(36px,6.2vw,64px)] font-light tracking-[-0.02em] leading-[0.9] text-fg mb-4">
          Contact
        </h1>
        <p className="text-muted text-sm">
          Let's work together • Get in touch
        </p>
      </header>

      <section className="space-y-8">
        <div className="space-y-4">
          <p className="text-fg leading-relaxed">
            I'm always interested in new opportunities and collaborations. 
            Whether you have a project in mind or just want to chat about design and development, 
            I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-light text-fg">Get in Touch</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted">Email:</span>
                <a href="mailto:jesse@example.com" className="text-fg hover:text-muted transition-colors ml-2">
                  jesse@example.com
                </a>
              </div>
              <div>
                <span className="text-muted">GitHub:</span>
                <a href="https://github.com/JesseRod329" target="_blank" rel="noopener noreferrer" className="text-fg hover:text-muted transition-colors ml-2">
                  @JesseRod329
                </a>
              </div>
              <div>
                <span className="text-muted">Location:</span>
                <span className="text-fg ml-2">San Francisco, CA</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Contact form">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-fg mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border border-muted rounded-md text-fg placeholder-muted focus:outline-none focus:border-fg transition-colors"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-fg mb-2">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border border-muted rounded-md text-fg placeholder-muted focus:outline-none focus:border-fg transition-colors resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-fg text-bg rounded-md hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </motion.article>
  )
}
