import { StackItem } from '../types';

export const stack: StackItem[] = [
  // AI
  { name: 'Gemini', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg', category: 'ai' },
  { name: 'OpenAI', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', category: 'ai' },
  { name: 'Grok', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Grok_logo.svg', category: 'ai' }, // Placeholder or SVG needed
  { name: 'Cursor', logo: 'https://cursor.sh/brand/icon.svg', category: 'ai' }, // Check availability

  // Apple/Mobile
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', category: 'apple' },
  { name: 'Xcode', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Xcode_icon.png', category: 'apple' },
  { name: 'SwiftUI', logo: 'https://developer.apple.com/assets/elements/icons/swiftui/swiftui-96x96_2x.png', category: 'apple' },

  // Dev
  { name: 'React', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg', category: 'dev' },
  { name: 'Node.js', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg', category: 'dev' },
  { name: 'Python', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg', category: 'dev' }
];
