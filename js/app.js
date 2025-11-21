/**
 * Jesse Rodriguez - Portfolio Redesign V2
 * Apple-style Animations & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initTiltEffect();
  initProjectsGrid();
});

// 1. Scroll Reveal Animation
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
}

// 2. 3D Tilt Effect for Hero Images
function initTiltEffect() {
  const containers = document.querySelectorAll('.hero-image-container');

  containers.forEach(container => {
    const image = container.querySelector('.hero-image');
    if (!image) return;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate percentage from center (-1 to 1)
      const xPct = (x / rect.width - 0.5) * 2;
      const yPct = (y / rect.height - 0.5) * 2;

      // Max rotation degrees
      const maxRotate = 5;

      // Rotate X is based on Y movement (up/down tilts X axis)
      // Rotate Y is based on X movement (left/right tilts Y axis)
      // Invert X rotation for natural feel
      image.style.transform = `
        perspective(1000px)
        rotateX(${-yPct * maxRotate}deg)
        rotateY(${xPct * maxRotate}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
    });

    container.addEventListener('mouseleave', () => {
      image.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// 3. Populate Grid Section
function initProjectsGrid() {
  const projects = [
    { title: 'Sample Mix', desc: 'Interactive Audio Chopper', emoji: '🎵', link: '/sample-mix/' },
    { title: 'Graffiti Gallery', desc: 'Digital Art Experience', emoji: '🎨', link: '/art/' },
    { title: 'Prompt Studio', desc: 'AI Prompt Library', img: '/prompt/apple_touch_icons/apple_touch_icon_1024x1024.png', link: '/prompt/' },
    { title: 'Paper Plane', desc: 'Physics Flight Game', emoji: '✈️', link: '/Paper%20Plane/' },
    { title: 'Jumping Jelly Bean', desc: 'Physics Platformer', emoji: '🫘', link: '/jumpingjellybean/' },
    { title: 'Wrestling News', desc: 'Live News Hub', img: '/wrestling-news/svgviewer-png-output-4-2.png', link: '/wrestling-news/' },
    { title: 'Philosopher\'s Library', desc: 'Curated Texts', emoji: '📚', link: '/philosophers-library.html' },
    { title: 'WorldTime', desc: 'Global Timezone Viewer', emoji: '🕐', link: '/TIME/' }
  ];

  const grid = document.getElementById('more-projects-grid');
  if (!grid) return;

  projects.forEach(project => {
    const item = document.createElement('a');
    item.href = project.link;
    item.className = 'grid-item reveal';

    let imageHtml = '';
    if (project.img) {
      imageHtml = `<img src="${project.img}" alt="${project.title}" class="grid-image" loading="lazy">`;
    } else {
      imageHtml = `<div class="grid-image-wrapper">${project.emoji}</div>`;
    }

    item.innerHTML = `
      ${project.img ? `<div class="grid-image-wrapper">${imageHtml}</div>` : imageHtml}
      <div class="grid-content">
        <h3 class="grid-title">${project.title}</h3>
        <p class="grid-desc">${project.desc}</p>
      </div>
    `;

    grid.appendChild(item);
  });
}
