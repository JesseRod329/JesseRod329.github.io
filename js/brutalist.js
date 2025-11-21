/**
 * Jesse Rodriguez - Neo-Brutalist Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initProjectHover();
    initMarquee();
});

// 1. Custom Cursor Logic
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth animation loop
    function animate() {
        // Linear interpolation for smooth follow
        const speed = 0.2;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;

        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

        requestAnimationFrame(animate);
    }
    animate();

    // Hover effects
    const hoverTargets = document.querySelectorAll('a, .project-item');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        target.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    // Ensure cursor is visible when moving
    document.addEventListener('mousemove', () => {
        cursor.style.opacity = '1';
    });
}

// 2. Project Image Reveal on Hover
function initProjectHover() {
    const reveal = document.querySelector('.hover-reveal');
    const revealImg = reveal ? reveal.querySelector('img') : null;
    const items = document.querySelectorAll('.project-item');

    if (!reveal || !revealImg) return;

    items.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const imgUrl = item.dataset.img;
            if (imgUrl) {
                revealImg.src = imgUrl;
                reveal.classList.add('active');
            }
        });

        item.addEventListener('mouseleave', () => {
            reveal.classList.remove('active');
        });

        item.addEventListener('mousemove', (e) => {
            // Move the reveal image with cursor but with some lag/offset
            reveal.style.left = e.clientX + 'px';
            reveal.style.top = e.clientY + 'px';
        });
    });
}

// 3. Dynamic Marquee Content
function initMarquee() {
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        // Duplicate content to ensure seamless loop
        marqueeContent.innerHTML += ' ' + marqueeContent.innerHTML;
    }
}
