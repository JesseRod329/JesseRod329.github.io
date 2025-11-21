/**
 * Jesse Rodriguez - V5: Chromatic Timeline
 * Rich, Colorful, Dynamic
 */

document.addEventListener('DOMContentLoaded', () => {
    initIntro();
    initCanvas();
    initScrollObserver();
    initTimelineFade();
});

// 1. Intro Sequence
function initIntro() {
    const intro = document.querySelector('.intro-screen');

    setTimeout(() => {
        intro.classList.add('hidden');
    }, 2800);
}

// 2. Colorful Particle System
function initCanvas() {
    const canvas = document.getElementById('chromatic-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Color palette for particles
    const colors = [
        '#6366f1', // Indigo
        '#8b5cf6', // Purple
        '#14b8a6', // Teal
        '#f59e0b', // Amber
        '#f43f5e', // Rose
        '#06b6d4'  // Cyan
    ];

    // Resize handling
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
        constructor() {
            this.reset();
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = Math.random() * 0.3 + 0.1;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.6 + 0.2;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;

            // Wrap around
            if (this.y < 0) {
                this.y = height;
                this.x = Math.random() * width;
            }
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
        }

        draw() {
            // Draw glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;

            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Reset shadow
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
    }

    // Init Particles
    const particleCount = window.innerWidth < 768 ? 60 : 120;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// V5: Chromatic Timeline - Holographic Grid Logic

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTiltEffect();
    animateIntro();
});

// --- 3D Tilt Effect ---
function initTiltEffect() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {

        // Touch events
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isScratching = true;
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            scratch(touch.clientX - rect.left, touch.clientY - rect.top);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!isScratching) return;
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            scratch(touch.clientX - rect.left, touch.clientY - rect.top);
        });

        canvas.addEventListener('touchend', () => {
            isScratching = false;
        });
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initIntro();
    initCanvas();
    initScrollObserver();

    // Delay scratch cards init to ensure proper sizing
    setTimeout(initScratchCards, 100);
});
