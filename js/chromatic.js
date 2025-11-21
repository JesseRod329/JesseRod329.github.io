/**
 * Jesse Rodriguez - V5: Chromatic Timeline
 * Rich, Colorful, Dynamic
 */

document.addEventListener('DOMContentLoaded', () => {
    initIntro();
    initCanvas();
    initScrollObserver();
    initTiltEffect();
});

// 1. Intro Sequence
function initIntro() {
    const intro = document.querySelector('.intro-screen');
    if (!intro) return;

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

// 3. Scroll Observer for Timeline Nodes
function initScrollObserver() {
    const nodes = document.querySelectorAll('.timeline-node');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    nodes.forEach((node, index) => {
        // Set initial state
        node.style.opacity = '0';
        node.style.transform = 'translateY(30px)';
        node.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        // Stagger delay slightly
        node.style.transitionDelay = `${index * 0.05}s`;

        observer.observe(node);
    });
}

// 4. 3D Tilt Effect for Timeline Content
function initTiltEffect() {
    const cards = document.querySelectorAll('.timeline-content');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            // Update CSS variables for glow
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Apply transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}
