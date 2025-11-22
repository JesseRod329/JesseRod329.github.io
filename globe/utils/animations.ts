// Animation utility functions for smooth transitions

export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export const animateValue = (
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void,
  easing: (t: number) => number = easeInOutCubic
) => {
  const startTime = performance.now();
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const currentValue = start + (end - start) * easedProgress;
    
    callback(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

export const createRippleEffect = (x: number, y: number, color: string = '#00f3ff') => {
  const ripple = document.createElement('div');
  ripple.style.position = 'fixed';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = '10px';
  ripple.style.height = '10px';
  ripple.style.borderRadius = '50%';
  ripple.style.border = `2px solid ${color}`;
  ripple.style.transform = 'translate(-50%, -50%)';
  ripple.style.pointerEvents = 'none';
  ripple.style.zIndex = '9999';
  ripple.style.animation = 'ripple-expand 0.6s ease-out forwards';
  
  document.body.appendChild(ripple);
  
  setTimeout(() => {
    document.body.removeChild(ripple);
  }, 600);
};

// Add CSS animation for ripple
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-expand {
      0% {
        width: 10px;
        height: 10px;
        opacity: 1;
      }
      100% {
        width: 100px;
        height: 100px;
        opacity: 0;
      }
    }
    
    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 5px currentColor;
      }
      50% {
        box-shadow: 0 0 20px currentColor;
      }
    }
    
    @keyframes slide-in-right {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

