import { motion } from "framer-motion";
import { useState } from "react";

const faqData = [
  {
    question: "What technologies do you work with?",
    answer: "I primarily work with React, TypeScript, and modern web technologies. I also have experience with Three.js for 3D graphics, Framer Motion for animations, and various design tools like Figma. I'm always learning new technologies and frameworks."
  },
  {
    question: "Do you take on freelance projects?",
    answer: "Yes! I'm available for freelance work and collaborations. I particularly enjoy projects involving creative coding, interactive design, and user experience challenges. Feel free to reach out through the contact form."
  },
  {
    question: "What's your design process?",
    answer: "I start with understanding the problem and user needs, then move to wireframing and prototyping. I believe in iterative design, testing ideas early and often. I also enjoy the technical implementation phase, ensuring the design works beautifully in code."
  },
  {
    question: "How long does a typical project take?",
    answer: "Project timelines vary depending on scope and complexity. A simple landing page might take 1-2 weeks, while a complex web application could take 2-3 months. I always provide detailed timelines during our initial discussion."
  },
  {
    question: "Do you work remotely?",
    answer: "Yes, I work remotely and have experience collaborating with teams across different time zones. I'm based in San Francisco but am flexible with meeting times to accommodate different schedules."
  },
  {
    question: "What makes your approach different?",
    answer: "I combine technical expertise with a strong design sensibility. I don't just build what's requested—I think about user experience, performance, and how the code will scale. I also enjoy pushing creative boundaries while maintaining clean, maintainable code."
  }
];

export default function FAQ() {
  document.title = 'FAQ • Jesse R.'
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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
          FAQ
        </h1>
        <p className="text-muted text-sm">
          Common questions • Get answers
        </p>
      </header>

      <section className="space-y-4">
        {faqData.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.35 }}
            className="border-b border-muted/30 pb-4"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left py-4 group focus:outline-none"
              aria-expanded={openIndex === index}
            >
              <h2 className="text-lg font-medium text-fg group-hover:text-muted transition-colors">
                {faq.question}
              </h2>
            </button>
            
            <motion.div
              initial={false}
              animate={{
                height: openIndex === index ? "auto" : 0,
                opacity: openIndex === index ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="text-muted leading-relaxed pb-4">
                {faq.answer}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </section>

      <section className="mt-12 p-6 bg-muted/10 rounded-lg">
        <h2 className="text-lg font-medium text-fg mb-2">Still have questions?</h2>
        <p className="text-muted text-sm mb-4">
          Don't see your question here? I'd love to hear from you.
        </p>
        <a 
          href="/contact" 
          className="inline-block px-4 py-2 bg-fg text-bg rounded-md hover:opacity-80 transition-opacity text-sm"
        >
          Get in Touch
        </a>
      </section>
    </motion.article>
  )
}
