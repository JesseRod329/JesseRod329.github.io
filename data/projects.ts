import { Project } from '../types';

export const projects: Project[] = [
  // Interface (Mobile/Web)
  {
    id: 'pulse-app',
    title: 'Pulse Messaging',
    description: 'Decentralized iOS messaging client built with SwiftUI, inspired by Nostr. Focuses on privacy, censorship resistance, and seamless user experience.',
    tags: ['SwiftUI', 'iOS', 'Decentralized', 'Nostr'],
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop', // Placeholder
    link: '#',
    github: 'https://github.com/JesseRod329/Pulse-Messaging-',
    category: 'interface',
    featured: true
  },
  {
    id: 'kami-apps',
    title: 'Kami Apps',
    description: 'Next-generation AI-integrated mobile applications. Bridging on-device intelligence with cloud-based agentic workflows.',
    tags: ['Swift', 'CoreML', 'Mobile AI'],
    imageUrl: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1000&auto=format&fit=crop', // Placeholder
    link: '#',
    category: 'interface',
    featured: true
  },
  {
    id: 'kats-eye',
    title: 'Kats Eye Pop Group',
    description: 'High-end branded web experience for a pop group. Features immersive animations, media integration, and a custom content management flow.',
    tags: ['React', 'Framer Motion', 'Branding'],
    imageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop', // Placeholder
    link: 'https://github.com/JesseRod329/katseye',
    github: 'https://github.com/JesseRod329/katseye',
    category: 'creative'
  },
  
  // Creative
  {
    id: 'world-globe',
    title: 'Interactive World Globe',
    description: '3D data visualization experiment using WebGL. Real-time rendering of global data points with cyberpunk aesthetics.',
    tags: ['WebGL', 'Three.js', 'Data Viz'],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop', // Placeholder
    link: 'http://jesserodriguez.me/globe/dist/',
    category: 'creative',
    featured: true
  },
  {
    id: 'sample-mix',
    title: 'AI Sample Mixer',
    description: 'Automated audio segmentation and sequencing. Transforms linear audio tracks into interactive sample pads using AI analysis.',
    tags: ['Web Audio API', 'AI Music', 'React'],
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000&auto=format&fit=crop', // Placeholder
    link: 'http://jesserodriguez.me/sample-mix/',
    category: 'creative'
  },

  // Systems (AI/Backend)
  {
    id: 'fin-sentiment',
    title: 'Financial Sentiment Analyst',
    description: 'Multi-agent system that scrapes news, fine-tunes Llama-3 for financial sentiment, and executes mock trades based on confidence scores.',
    tags: ['Python', 'LangChain', 'Llama-3', 'AI Agents'],
    imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop', // Placeholder
    link: '#',
    category: 'system',
    featured: true
  },
  {
    id: 'rag-dashboard',
    title: 'Enterprise RAG Dashboard',
    description: 'Secure document chat for internal business use. Connects SharePoint/Drive to Pinecone vectors with a sleek React dashboard.',
    tags: ['OpenAI', 'Pinecone', 'Next.js', 'RAG'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop', // Placeholder
    link: '#',
    category: 'system'
  },
  {
    id: 'cust-service',
    title: 'Customer Service Fine-Tune',
    description: 'Fine-tuned Mistral 7B on 50k support tickets to automate tier-1 responses with 95% accuracy and empathy.',
    tags: ['PyTorch', 'HuggingFace', 'Fine-tuning'],
    imageUrl: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1000&auto=format&fit=crop', // Placeholder
    link: '#',
    category: 'system'
  }
];
