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
      <header className="mb-12">
        <h1 className="text-[clamp(36px,6.2vw,64px)] font-light tracking-[-0.02em] leading-[0.9] neomorphic-text-white mb-4">
          Contact
        </h1>
        <p className="neomorphic-text-muted text-sm">
          Let's work together • Get in touch
        </p>
      </header>

      <section className="space-y-8">
        <div className="neomorphic-card p-8">
          <p className="neomorphic-text-white leading-relaxed">
            I'm always interested in new opportunities and collaborations. 
            Whether you have a project in mind or just want to chat about design and development, 
            I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="neomorphic-card p-8 space-y-6">
            <h2 className="text-xl font-light neomorphic-text-white">Get in Touch</h2>
            <div className="space-y-4 text-sm">
              <div>
                <span className="neomorphic-text-muted">Email:</span>
                <a href="mailto:jesse@example.com" className="neomorphic-text-white hover:neomorphic-text-muted transition-colors ml-2">
                  jesse@example.com
                </a>
              </div>
              <div>
                <span className="neomorphic-text-muted">GitHub:</span>
                <a href="https://github.com/JesseRod329" target="_blank" rel="noopener noreferrer" className="neomorphic-text-white hover:neomorphic-text-muted transition-colors ml-2">
                  @JesseRod329
                </a>
              </div>
              <div>
                <span className="neomorphic-text-muted">Location:</span>
                <span className="neomorphic-text-white ml-2">San Francisco, CA</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="neomorphic-card p-8 space-y-6" aria-label="Contact form">
            <h2 className="text-xl font-light neomorphic-text-white mb-4">Send a Message</h2>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium neomorphic-text-white mb-3">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 neomorphic-pressed neomorphic-text-white placeholder:neomorphic-text-muted focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium neomorphic-text-white mb-3">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 neomorphic-pressed neomorphic-text-white placeholder:neomorphic-text-muted focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="neomorphic-button px-8 py-3 neomorphic-text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </motion.article>
  )
}
