# 🍭 Candy Current: Jelly Rush Adventure

A vibrant 3D platform runner set in a living candy world where players guide squishy jelly creatures through rivers of syrup, across marshmallow bridges, and up candy-cane towers.

## 🎮 Features

### Core Gameplay
- **3D Jelly Physics**: Realistic jelly movement with bouncy, squishy animations
- **Multiple Jelly Types**: Grape Blob, Lime Squish, and Blueberry Puff with unique abilities
- **Candy Environments**: Marshmallow platforms, syrup rivers, candy canes, and lollipops
- **Collectible System**: Gummy bears, syrup drops, and rare candies
- **Power-ups**: Sugar Rush, Magnet Candy, Bubble Shield, and Rainbow Combo

### Controls
- **Desktop**: WASD/Arrow Keys for movement, Space for jump
- **Mobile**: Virtual joystick and touch buttons for optimal mobile experience
- **Physics**: Cannon.js integration for realistic jelly physics

### Visual Design
- **3D Graphics**: Three.js with custom candy-themed shaders
- **Pastel Aesthetics**: Soft, dreamy lighting with candy-inspired colors
- **Responsive UI**: Comic-style bubble buttons and floating candy icons
- **Loading Screen**: Animated candy world initialization

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd candy-current-3d
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18**: Component-based UI framework
- **TypeScript**: Type-safe development
- **Three.js**: 3D graphics and rendering
- **React Three Fiber**: React integration for Three.js
- **React Three Drei**: Useful helpers and components
- **Cannon.js**: Physics simulation

### Project Structure
```
src/
├── components/
│   ├── CandyWorld.tsx      # 3D candy environment
│   ├── JellyCharacter.tsx  # Player character with physics
│   ├── GameUI.tsx          # Game interface and HUD
│   ├── TouchControls.tsx   # Mobile touch controls
│   └── LoadingScreen.tsx   # Animated loading experience
├── App.tsx                 # Main application component
├── App.css                 # Global styles
└── main.tsx               # Application entry point
```

## 🎯 Game Mechanics

### Jelly Types
- **Grape Blob**: Balanced jumper with medium speed
- **Lime Squish**: Fast movement but less control
- **Blueberry Puff**: Floats briefly mid-jump

### Power-ups
- **Sugar Rush**: Temporary speed boost
- **Magnet Candy**: Attracts nearby collectibles
- **Bubble Shield**: One-hit protection
- **Rainbow Combo**: Chain multiplier for perfect runs

### Environments
- **Gummy River Run**: Surf on floating gummies
- **Marshmallow Mountains**: Sticky slopes and timed jumps
- **Licorice Labs**: Mechanical traps and dark lighting
- **Caramel Canyon**: High-risk, high-reward drops

## 📱 Mobile Optimization

- **Touch Controls**: Virtual joystick and action buttons
- **Responsive Design**: Adapts to different screen sizes
- **Performance**: Optimized for 60 FPS on mobile devices
- **Battery Efficient**: Optimized rendering and physics

## 🎨 Visual Features

- **Candy Shaders**: Custom materials for jelly-like appearance
- **Dynamic Lighting**: Soft, dreamy lighting effects
- **Particle Systems**: Candy-themed visual effects
- **Smooth Animations**: Jelly bobbing and squishing effects

## 🔧 Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Performance Targets
- **60 FPS**: Smooth gameplay on target devices
- **<3 seconds**: Initial load time
- **<100MB**: App size
- **<5%**: Battery drain per 10-minute session

## 🎮 Controls

### Desktop
- **WASD/Arrow Keys**: Move jelly character
- **Space**: Jump
- **Mouse**: Camera control (OrbitControls)

### Mobile
- **Virtual Joystick**: Movement control
- **Jump Button**: Jump action
- **Slide Button**: Slide action

## 🏆 Future Features

### Planned Updates
- **Multiplayer Races**: Real-time candy river challenges
- **Seasonal Events**: Chocolate Volcano, Peppermint Snowland
- **Jelly Creator**: Custom jelly avatar design
- **Progression System**: XP, levels, and character upgrades
- **Monetization**: Cosmetic skins and battle pass

### Technical Roadmap
- **Mobile App**: React Native port
- **Console Port**: Nintendo Switch and Steam
- **Advanced Physics**: More realistic jelly mechanics
- **Audio System**: Candy-themed sound effects and music

## 📊 Performance Metrics

### Target KPIs
- **DAU**: 100K within 3 months
- **Retention**: 35% day-7 retention rate
- **Session Length**: 8-10 minutes average
- **Conversion**: 4-6% cosmetic purchases

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Three.js community for excellent 3D web graphics
- React Three Fiber for seamless React integration
- Cannon.js for realistic physics simulation
- Candy-themed inspiration from classic platformers

---

**Ready to dive into the sweetest adventure? Start your jelly journey today!** 🍭✨