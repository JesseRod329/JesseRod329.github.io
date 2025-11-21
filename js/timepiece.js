/**
 * Jesse Rodriguez - V4: The Timepiece
 * Physics, Particles, and Time.
 */

document.addEventListener('DOMContentLoaded', () => {
    initIntro();
    initCanvas();
    initScrollObserver();
});

// 1. Intro Sequence
function initIntro() {
    const intro = document.querySelector('.intro-screen');

    // Simulate "booting up"
    setTimeout(() => {
        intro.classList.add('hidden');
        // Allow body scroll after intro
        document.body.style.overflowY = 'auto';
    }, 2500);
}

// 2. Canvas Particle System (The "Quantum Stream")
function initCanvas() {
    const canvas = document.getElementById('time-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

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
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5;
            this.speedY = Math.random() * 0.5 + 0.1;
            this.opacity = Math.random() * 0.5;
        }

        update() {
            this.y -= this.speedY; // Float upwards
            if (this.y < 0) {
                this.y = height;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Init Particles
    for (let i = 0; i < 100; i++) {
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

// 3. Scroll Observer (The "Unfolding")
function initScrollObserver() {
    const nodes = document.querySelectorAll('.node');

    const observerOptions = {
        threshold: 0.2, // Trigger when 20% visible
        rootMargin: '-10% 0px -10% 0px' // Shrink trigger area to center focus
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const node = entry.target;

            if (entry.isIntersecting) {
                // Active State (Unfolded)
                node.classList.remove('waiting', 'passed');
                node.classList.add('active');
            } else {
                // Check if it's above or below viewport
                const rect = node.getBoundingClientRect();
                if (rect.top > window.innerHeight) {
                    // Below viewport -> Waiting to unfold
                    node.classList.remove('active', 'passed');
                    node.classList.add('waiting');
                } else if (rect.bottom < 0) {
                    // Above viewport -> Passed (Folded back)
                    node.classList.remove('active', 'waiting');
                    node.classList.add('passed');
                }
            }
        });
    }, observerOptions);

    nodes.forEach(node => {
        node.classList.add('waiting'); // Initial state
        observer.observe(node);
    });
}
