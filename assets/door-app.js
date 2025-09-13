// Door Knock Interactive App
class DoorKnockApp {
    constructor() {
        this.knockCount = 0;
        this.currentDoorStyle = 0;
        this.currentSound = 0;
        this.isKnocking = false;
        this.audioContext = null;
        
        this.doorStyles = [
            {
                id: 'wooden',
                name: 'Classic Wood',
                colors: {
                    primary: '#8B4513',
                    secondary: '#A0522D',
                    accent: '#CD853F',
                    hardware: '#DAA520'
                }
            },
            {
                id: 'modern',
                name: 'Modern Steel',
                colors: {
                    primary: '#2F4F4F',
                    secondary: '#708090',
                    accent: '#B0C4DE',
                    hardware: '#C0C0C0'
                }
            },
            {
                id: 'vintage',
                name: 'Vintage Green',
                colors: {
                    primary: '#355E3B',
                    secondary: '#228B22',
                    accent: '#90EE90',
                    hardware: '#FFD700'
                }
            },
            {
                id: 'royal',
                name: 'Royal Blue',
                colors: {
                    primary: '#191970',
                    secondary: '#4169E1',
                    accent: '#6495ED',
                    hardware: '#FFD700'
                }
            }
        ];
        
        this.knockSounds = [
            { id: 'wood', name: '🪵 Wood Knock', description: 'Classic wooden door sound' },
            { id: 'metal', name: '🔩 Metal Clang', description: 'Heavy metal door knock' },
            { id: 'soft', name: '🤲 Soft Tap', description: 'Gentle door tapping' },
            { id: 'echo', name: '🔊 Echo Knock', description: 'Knock with reverb effect' }
        ];
        
        this.init();
    }
    
    async init() {
        // Initialize Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
        
        this.bindEvents();
        this.updateDoorStyle();
        this.updateUI();
    }
    
    bindEvents() {
        // Door click event
        const door = document.getElementById('main-door');
        door.addEventListener('click', () => this.handleKnock());
        
        // Style button
        const styleButton = document.getElementById('style-button');
        styleButton.addEventListener('click', () => this.nextDoorStyle());
        
        // Sound button
        const soundButton = document.getElementById('sound-button');
        soundButton.addEventListener('click', () => this.nextSound());
    }
    
    async handleKnock() {
        if (this.isKnocking) return;
        
        // Resume audio context if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        
        this.isKnocking = true;
        this.knockCount++;
        
        // Visual effects
        this.showRipple();
        this.animateDoor();
        this.updateKnockCount();
        
        // Play sound
        this.playKnockSound();
        
        // Reset after animation
        setTimeout(() => {
            this.isKnocking = false;
        }, 300);
    }
    
    showRipple() {
        const rippleContainer = document.getElementById('ripple-container');
        const ripple = document.createElement('div');
        ripple.className = 'w-32 h-32 border-4 border-orange-400 rounded-full ripple';
        
        rippleContainer.appendChild(ripple);
        
        setTimeout(() => {
            rippleContainer.removeChild(ripple);
        }, 600);
    }
    
    animateDoor() {
        const door = document.getElementById('main-door');
        const handle = document.getElementById('door-handle');
        const knocker = document.getElementById('door-knocker');
        
        door.classList.add('door-shake');
        handle.classList.add('handle-rotate');
        knocker.classList.add('knocker-swing');
        
        setTimeout(() => {
            door.classList.remove('door-shake');
            handle.classList.remove('handle-rotate');
            knocker.classList.remove('knocker-swing');
        }, 400);
    }
    
    updateKnockCount() {
        const badge = document.getElementById('knock-badge');
        const countElement = document.getElementById('knock-count');
        const footerCount = document.getElementById('footer-knock-count');
        
        if (this.knockCount > 0) {
            badge.style.display = 'flex';
            badge.classList.add('badge-bounce');
            
            setTimeout(() => {
                badge.classList.remove('badge-bounce');
            }, 300);
        }
        
        const displayCount = this.knockCount > 99 ? '99+' : this.knockCount;
        countElement.textContent = displayCount;
        footerCount.textContent = this.knockCount;
    }
    
    playKnockSound() {
        if (!this.audioContext) return;
        
        const sound = this.knockSounds[this.currentSound];
        
        switch (sound.id) {
            case 'wood':
                this.playWoodKnock();
                break;
            case 'metal':
                this.playMetalKnock();
                break;
            case 'soft':
                this.playSoftKnock();
                break;
            case 'echo':
                this.playEchoKnock();
                break;
        }
    }
    
    playWoodKnock() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    playMetalKnock() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
    
    playSoftKnock() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.15);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.4);
    }
    
    playEchoKnock() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(75, this.audioContext.currentTime + 0.2);
                
                const volume = 0.2 * Math.pow(0.6, i);
                gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.4);
            }, i * 150);
        }
    }
    
    nextDoorStyle() {
        this.currentDoorStyle = (this.currentDoorStyle + 1) % this.doorStyles.length;
        this.updateDoorStyle();
        this.updateUI();
    }
    
    nextSound() {
        this.currentSound = (this.currentSound + 1) % this.knockSounds.length;
        this.updateUI();
    }
    
    updateDoorStyle() {
        const style = this.doorStyles[this.currentDoorStyle];
        const door = document.getElementById('main-door');
        const frame = document.getElementById('door-frame');
        const panel1 = document.getElementById('door-panel-1');
        const panel2 = document.getElementById('door-panel-2');
        const handle = document.getElementById('door-handle');
        const handleCenter = document.getElementById('door-handle-center');
        const knocker = document.getElementById('door-knocker');
        const knockerCenter = document.getElementById('door-knocker-center');
        const topLine = document.getElementById('door-top-line');
        const bottomLine = document.getElementById('door-bottom-line');
        
        // Apply colors
        door.style.backgroundColor = style.colors.primary;
        door.style.borderColor = style.colors.secondary;
        door.style.background = `linear-gradient(145deg, ${style.colors.primary}, ${style.colors.secondary})`;
        
        frame.style.borderColor = style.colors.accent;
        
        panel1.style.borderColor = style.colors.accent;
        panel1.style.background = `linear-gradient(135deg, ${style.colors.primary}dd, ${style.colors.secondary}dd)`;
        
        panel2.style.borderColor = style.colors.accent;
        panel2.style.background = `linear-gradient(135deg, ${style.colors.primary}dd, ${style.colors.secondary}dd)`;
        
        handle.style.backgroundColor = style.colors.hardware;
        handleCenter.style.backgroundColor = style.colors.primary;
        
        knocker.style.backgroundColor = style.colors.hardware;
        knockerCenter.style.backgroundColor = style.colors.accent;
        
        topLine.style.backgroundColor = style.colors.accent;
        bottomLine.style.backgroundColor = style.colors.accent;
    }
    
    updateUI() {
        const currentStyle = this.doorStyles[this.currentDoorStyle];
        const currentSound = this.knockSounds[this.currentSound];
        
        // Update style button
        document.getElementById('style-name').textContent = currentStyle.name;
        document.getElementById('footer-style-name').textContent = currentStyle.name;
        
        // Update sound button
        document.getElementById('sound-name').textContent = currentSound.name;
        document.getElementById('footer-sound-name').textContent = currentSound.name;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DoorKnockApp();
});
