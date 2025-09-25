# Graffiti Art App

A React-based graffiti art application where you can spray paint on a wall texture background using a virtual spray can that follows your cursor.

## Features

- **Interactive Spray Painting**: Click and drag to spray paint on the wall
- **Color Selection**: Choose from 10 different spray can colors
- **Realistic Spray Effect**: Particle-based spray simulation with random distribution
- **Cursor Following**: Spray can follows your mouse cursor
- **Debug Mode**: Press 'd' to toggle debug indicators
- **Responsive Design**: Works on different screen sizes

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

- **Paint**: Click and drag with your mouse to spray paint
- **Change Colors**: Click on different spray cans in the toolbar at the bottom
- **Debug Mode**: Press 'd' to show cursor position and nozzle alignment
- **Clear Canvas**: Refresh the page to start over

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Vite
- HTML5 Canvas

## Project Structure

```
src/
├── components/
│   ├── figma/
│   │   └── ImageWithFallback.tsx
│   ├── GraffitiCanvas.tsx
│   └── SprayToolbar.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Development

The app uses Vite for fast development and hot module replacement. The canvas drawing is implemented using HTML5 Canvas API with particle-based spray effects for a realistic graffiti experience.
