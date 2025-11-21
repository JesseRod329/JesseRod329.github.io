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

// 3. Scroll Observer (The "Unfolding")
function initScrollObserver() {
    const nodes = document.querySelectorAll('.node');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '-10% 0px -15% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const node = entry.target;

            if (entry.isIntersecting) {
                node.classList.remove('waiting', 'passed');
                node.classList.add('active');
            } else {
                const rect = node.getBoundingClientRect();
                if (rect.top > window.innerHeight) {
                    node.classList.remove('active', 'passed');
                    node.classList.add('waiting');
                } else if (rect.bottom < 0) {
                    node.classList.remove('active', 'waiting');
                    node.classList.add('passed');
                }
            }
        });
    }, observerOptions);

    nodes.forEach(node => {
        node.classList.add('waiting');
        observer.observe(node);
    });
}

// 4. Timeline Fade on Scroll
function initTimelineFade() {
    const timeline = document.querySelector('.timeline-line');
    if (!timeline) return;

    let ticking = false;

    function updateTimelineOpacity() {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        // Fade out as user scrolls down (starts fading at 60% scroll)
        const opacity = Math.max(0, 1 - (scrollPercent - 0.6) * 2.5);
        timeline.style.opacity = opacity;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateTimelineOpacity);
            ticking = true;
        }
    });
}

// 5. Scratch to Reveal Cards
function initScratchCards() {
    const cards = document.querySelectorAll('.scratch-card');

    cards.forEach(card => {
        const canvas = card.querySelector('.scratch-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = card.getBoundingClientRect();

        // Set canvas size
        canvas.width = rect.width * 2; // 2x for retina
        canvas.height = rect.height * 2;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(2, 2);

        // Draw scratch surface with gradient
        const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
        const colors = ['#6366f1', '#8b5cf6', '#14b8a6', '#f59e0b', '#f43f5e', '#06b6d4'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        gradient.addColorStop(0, randomColor);
        gradient.addColorStop(1, colors[(colors.indexOf(randomColor) + 1) % colors.length]);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Add "SCRATCH ME" text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = 'bold 14px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SCRATCH ME', rect.width / 2, rect.height / 2);

        // Scratch functionality
        let isScratching = false;
        let scratchedPercentage = 0;

        function scratch(x, y) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI * 2);
            ctx.fill();

            // Check if enough has been scratched
            checkScratchPercentage();
        }

        function checkScratchPercentage() {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let transparent = 0;

            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] < 128) transparent++;
            }

            scratchedPercentage = (transparent / (pixels.length / 4)) * 100;

            // If 50% scratched, remove canvas
            if (scratchedPercentage > 50) {
                canvas.style.opacity = '0';
                canvas.style.transition = 'opacity 0.5s ease';
                setTimeout(() => canvas.remove(), 500);
            }
        }

        // Mouse events
        canvas.addEventListener('mousedown', (e) => {
            isScratching = true;
            const rect = canvas.getBoundingClientRect();
            scratch(e.clientX - rect.left, e.clientY - rect.top);
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isScratching) return;
            const rect = canvas.getBoundingClientRect();
            scratch(e.clientX - rect.left, e.clientY - rect.top);
        });

        canvas.addEventListener('mouseup', () => {
            isScratching = false;
        });

        canvas.addEventListener('mouseleave', () => {
            isScratching = false;
        });

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
