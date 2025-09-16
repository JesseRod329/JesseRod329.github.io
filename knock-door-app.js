// Enhanced Knock Knock Door App with New Features
class KnockDoorApp {
    constructor() {
        this.knockCount = 0;
        this.currentStyle = 0;
        this.currentSound = 0;
        this.audioContext = null;
        this.isPlaying = false;
        
        // Enhanced door styles with more variety
        this.doorStyles = [
            {
                name: "Classic Wood",
                colors: {
                    frame: "#8B4513",
                    panel1: "#D2691E",
                    panel2: "#CD853F",
                    handle: "#FFD700",
                    knocker: "#C0C0C0",
                    accent: "#654321"
                },
                pattern: "wood"
            },
            {
                name: "Modern Steel",
                colors: {
                    frame: "#2F4F4F",
                    panel1: "#708090",
                    panel2: "#778899",
                    handle: "#FFD700",
                    knocker: "#C0C0C0",
                    accent: "#1C1C1C"
                },
                pattern: "metal"
            },
            {
                name: "Vintage Green",
                colors: {
                    frame: "#228B22",
                    panel1: "#32CD32",
                    panel2: "#90EE90",
                    handle: "#FFD700",
                    knocker: "#C0C0C0",
                    accent: "#006400"
                },
                pattern: "vintage"
            },
            {
                name: "Royal Blue",
                colors: {
                    frame: "#191970",
                    panel1: "#4169E1",
                    panel2: "#87CEEB",
                    handle: "#FFD700",
                    knocker: "#C0C0C0",
                    accent: "#000080"
                },
                pattern: "royal"
            },
            {
                name: "Cyberpunk Neon",
                colors: {
                    frame: "#0D1117",
                    panel1: "#161B22",
                    panel2: "#21262D",
                    handle: "#00FF41",
                    knocker: "#FF0080",
                    accent: "#00D4FF"
                },
                pattern: "cyberpunk"
            },
            {
                name: "Gothic Dark",
                colors: {
                    frame: "#1C1C1C",
                    panel1: "#2F2F2F",
                    panel2: "#404040",
                    handle: "#8B0000",
                    knocker: "#FFD700",
                    accent: "#000000"
                },
                pattern: "gothic"
            },
            {
                name: "Crystal Glass",
                colors: {
                    frame: "#E6F3FF",
                    panel1: "#F0F8FF",
                    panel2: "#F5F5F5",
                    handle: "#4169E1",
                    knocker: "#FF69B4",
                    accent: "#87CEEB"
                },
                pattern: "crystal"
            },
            {
                name: "Rustic Brick",
                colors: {
                    frame: "#8B0000",
                    panel1: "#A0522D",
                    panel2: "#CD853F",
                    handle: "#DAA520",
                    knocker: "#B8860B",
                    accent: "#654321"
                },
                pattern: "brick"
            }
        ];

        // Enhanced sound library with more variety
        this.sounds = [
            { name: "🪵 Wood Knock", type: "wood" },
            { name: "🔨 Metal Clang", type: "metal" },
            { name: "🔔 Soft Bell", type: "bell" },
            { name: "🌊 Echo Knock", type: "echo" },
            { name: "⚡ Electric Zap", type: "electric" },
            { name: "🎵 Musical Note", type: "musical" },
            { name: "💎 Crystal Chime", type: "crystal" },
            { name: "🔥 Fire Crackle", type: "fire" },
            { name: "❄️ Ice Shatter", type: "ice" },
            { name: "🌪️ Wind Howl", type: "wind" }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDoorStyle();
        this.updateSoundDisplay();
        this.initAudioContext();
    }

    setupEventListeners() {
        // Door click
        document.getElementById('main-door').addEventListener('click', (e) => {
            this.knock();
        });

        // Style button
        document.getElementById('style-button').addEventListener('click', () => {
            this.nextStyle();
        });

        // Sound button
        document.getElementById('sound-button').addEventListener('click', () => {
            this.nextSound();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.knock();
            } else if (e.key === 's' || e.key === 'S') {
                this.nextStyle();
            } else if (e.key === 'a' || e.key === 'A') {
                this.nextSound();
            }
        });
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    knock() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.knockCount++;
        
        // Visual effects
        this.createRipple();
        this.animateDoor();
        this.updateKnockCounter();
        
        // Sound effect
        this.playKnockSound();
        
        // Reset playing state after animation
        setTimeout(() => {
            this.isPlaying = false;
        }, 500);
    }

    createRipple() {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        document.getElementById('ripple-container').appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    animateDoor() {
        const door = document.getElementById('main-door');
        const handle = document.getElementById('door-handle');
        const knocker = document.getElementById('door-knocker');
        
        // Door shake
        door.classList.add('door-shake');
        setTimeout(() => door.classList.remove('door-shake'), 300);
        
        // Handle rotation
        handle.classList.add('handle-rotate');
        setTimeout(() => handle.classList.remove('handle-rotate'), 300);
        
        // Knocker swing
        knocker.classList.add('knocker-swing');
        setTimeout(() => knocker.classList.remove('knocker-swing'), 400);
    }

    playKnockSound() {
        if (!this.audioContext) return;
        
        const soundType = this.sounds[this.currentSound].type;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Different sound characteristics based on type
        const soundConfig = this.getSoundConfig(soundType);
        
        oscillator.type = soundConfig.waveform;
        oscillator.frequency.setValueAtTime(soundConfig.frequency, this.audioContext.currentTime);
        
        filter.type = soundConfig.filterType;
        filter.frequency.setValueAtTime(soundConfig.filterFreq, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(soundConfig.volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + soundConfig.duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + soundConfig.duration);
    }

    getSoundConfig(soundType) {
        const configs = {
            wood: { waveform: 'sawtooth', frequency: 120, filterType: 'lowpass', filterFreq: 800, volume: 0.3, duration: 0.3 },
            metal: { waveform: 'square', frequency: 200, filterType: 'bandpass', filterFreq: 1200, volume: 0.4, duration: 0.4 },
            bell: { waveform: 'sine', frequency: 800, filterType: 'lowpass', filterFreq: 2000, volume: 0.2, duration: 0.8 },
            echo: { waveform: 'sawtooth', frequency: 100, filterType: 'lowpass', filterFreq: 600, volume: 0.3, duration: 0.6 },
            electric: { waveform: 'square', frequency: 300, filterType: 'highpass', filterFreq: 2000, volume: 0.5, duration: 0.2 },
            musical: { waveform: 'sine', frequency: 440, filterType: 'lowpass', filterFreq: 1500, volume: 0.3, duration: 0.5 },
            crystal: { waveform: 'sine', frequency: 1200, filterType: 'bandpass', filterFreq: 3000, volume: 0.2, duration: 0.7 },
            fire: { waveform: 'sawtooth', frequency: 80, filterType: 'lowpass', filterFreq: 400, volume: 0.4, duration: 0.4 },
            ice: { waveform: 'triangle', frequency: 600, filterType: 'highpass', filterFreq: 1000, volume: 0.3, duration: 0.3 },
            wind: { waveform: 'sawtooth', frequency: 60, filterType: 'lowpass', filterFreq: 200, volume: 0.3, duration: 1.0 }
        };
        
        return configs[soundType] || configs.wood;
    }

    nextStyle() {
        this.currentStyle = (this.currentStyle + 1) % this.doorStyles.length;
        this.updateDoorStyle();
    }

    nextSound() {
        this.currentSound = (this.currentSound + 1) % this.sounds.length;
        this.updateSoundDisplay();
    }

    updateDoorStyle() {
        const style = this.doorStyles[this.currentStyle];
        const door = document.getElementById('main-door');
        
        // Update colors
        door.style.borderColor = style.colors.frame;
        document.getElementById('door-frame').style.borderColor = style.colors.accent;
        document.getElementById('door-panel-1').style.backgroundColor = style.colors.panel1;
        document.getElementById('door-panel-2').style.backgroundColor = style.colors.panel2;
        document.getElementById('door-handle').style.backgroundColor = style.colors.handle;
        document.getElementById('door-knocker').style.backgroundColor = style.colors.knocker;
        document.getElementById('door-top-line').style.backgroundColor = style.colors.accent;
        document.getElementById('door-bottom-line').style.backgroundColor = style.colors.accent;
        
        // Add pattern effects
        this.applyPattern(style.pattern);
        
        // Update display
        document.getElementById('style-name').textContent = style.name;
        document.getElementById('footer-style-name').textContent = style.name;
    }

    applyPattern(pattern) {
        const door = document.getElementById('main-door');
        door.className = `door-glow relative w-80 h-96 rounded-lg shadow-2xl transition-all duration-300 hover:shadow-3xl border-4 cursor-pointer group ${pattern}-pattern`;
        
        // Add pattern-specific styles
        const patternStyles = {
            wood: 'bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900',
            metal: 'bg-gradient-to-br from-gray-600 via-gray-500 to-gray-700',
            vintage: 'bg-gradient-to-br from-green-700 via-green-600 to-green-800',
            royal: 'bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900',
            cyberpunk: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
            gothic: 'bg-gradient-to-br from-gray-800 via-gray-700 to-black',
            crystal: 'bg-gradient-to-br from-blue-100 via-blue-50 to-white',
            brick: 'bg-gradient-to-br from-red-800 via-red-700 to-red-900'
        };
        
        door.className += ` ${patternStyles[pattern] || patternStyles.wood}`;
    }

    updateSoundDisplay() {
        const sound = this.sounds[this.currentSound];
        document.getElementById('sound-name').textContent = sound.name;
        document.getElementById('footer-sound-name').textContent = sound.name;
    }

    updateKnockCounter() {
        const badge = document.getElementById('knock-badge');
        const count = document.getElementById('knock-count');
        const footerCount = document.getElementById('footer-knock-count');
        
        badge.style.display = 'flex';
        count.textContent = this.knockCount;
        footerCount.textContent = this.knockCount;
        
        // Add bounce animation
        badge.classList.add('badge-bounce');
        setTimeout(() => badge.classList.remove('badge-bounce'), 300);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new KnockDoorApp();
});
