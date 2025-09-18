# PRD Creator

A modern, AI-powered Product Requirements Document (PRD) generator built with React, TypeScript, and Google Gemini API. Features a beautiful glassmorphism UI with internationalization support.

## Features

- 🤖 **AI-Powered Generation**: Uses Google Gemini API for intelligent PRD creation
- 🎨 **Glassmorphism UI**: Modern, responsive design with backdrop blur effects
- 🌍 **Internationalization**: Multi-language support with automatic locale detection
- 📝 **Markdown Support**: Rich text formatting with custom markdown renderer
- 📋 **Copy & Download**: Easy sharing with clipboard and file download functionality
- ⚡ **Real-time Streaming**: Typewriter effect for generated content
- 🔒 **Secure**: API key management with environment variable support

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API (Gemini Pro)
- **Build Tool**: Vite
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prd-creator
```

2. Install dependencies:
```bash
npm install
```

3. Get your Gemini API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key for configuration

4. Configure your Gemini API key in the .env file:
```bash
# Update the .env file with your actual API key
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Answer the three questions**:
   - What product or feature are you building?
   - Who are the target users and what problem does this solve?
   - What are the key features and how will you measure success?
2. **Click "Generate PRD"** to create your document
3. **Copy or download** the generated PRD

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── forms/          # Form-specific components
│   ├── layout/         # Layout components
│   └── prd/            # PRD-specific components
├── hooks/              # Custom React hooks
│   ├── useGeminiAPI.ts # Gemini API integration
│   ├── useClipboard.ts # Clipboard functionality
│   └── useI18n.ts      # Internationalization
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── services/           # External service integrations
└── styles/             # Global styles and Tailwind config
```

## API Configuration

The application uses environment variables for secure API key management:

1. **Environment Variable**: Set `VITE_GEMINI_API_KEY` in your `.env` file
2. **Production**: Configure the environment variable in your deployment platform

## Internationalization

The application supports multiple languages:

- English (en-US) - Default
- Spanish (es-ES)

To add a new language:

1. Add translations to `src/hooks/useI18n.ts`
2. Update the `TranslationKeys` interface in `src/types/prd.ts`
3. Test the new locale

## Customization

### Styling

The application uses Tailwind CSS with custom glassmorphism effects. Key customization points:

- **Colors**: Modify `tailwind.config.js`
- **Glassmorphism**: Update `.glassmorphism` classes in `globals.css`
- **Animations**: Customize blob animations in CSS

### PRD Template

To modify the PRD generation template:

1. Update the prompt in `src/components/prd/PRDCreator.tsx`
2. Adjust the markdown renderer in `src/utils/markdown.ts`

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## Acknowledgments

- [Google Gemini API](https://ai.google.dev/) for AI capabilities
- [Lucide React](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for fast development and building
