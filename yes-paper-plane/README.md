# YES Paper Plane

A 2D side-scrolling game built with Phaser 3, TypeScript, and Vite. Pilot a paper plane through a notebook world, collecting coins and avoiding obstacles.

## Features

- **Paper plane physics** with lift mechanics
- **Parallax notebook background** for immersive pencil-drawn aesthetic
- **Object pooling** for efficient obstacle and coin management
- **Dynamic difficulty curve** that ramps up over time
- **HUD** with score tracking and best score persistence
- **Basic SFX** using Web Audio API
- **Production-ready build** for deployment to itch.io/Netlify

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (opens on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Controls

- **Space** or **Up Arrow**: Apply lift to the paper plane
- **Click** or **Space**: Start game from menu

## Project Structure

```
yes-paper-plane/
├── src/
│   ├── assets/          # Placeholder assets (easily replaceable)
│   ├── scenes/          # Phaser scenes (Boot, Menu, Game, HUD)
│   ├── systems/         # Game systems (difficulty, objectPool)
│   ├── gameConfig.ts    # Game configuration
│   └── main.ts          # Entry point
├── index.html
├── package.json
└── vite.config.ts
```

## Deployment

The `npm run build` command creates a `/dist` folder ready for deployment:

- **itch.io**: Upload the entire `/dist` folder
- **Netlify**: Point to the `/dist` folder or enable auto-deploy from Git

## Customization

- **Assets**: Replace placeholder textures in `src/scenes/Boot.ts` or add real PNG files
- **Difficulty**: Adjust curves in `src/systems/difficulty.ts`
- **Physics**: Tune gravity and forces in `src/gameConfig.ts`
- **Styling**: Modify colors and sizes throughout the scene files

## Tech Stack

- **Phaser 3.80.0** - Game framework
- **TypeScript 5.6.3** - Type safety
- **Vite 5.4.10** - Build tool and dev server
- **ESLint + Prettier** - Code quality












