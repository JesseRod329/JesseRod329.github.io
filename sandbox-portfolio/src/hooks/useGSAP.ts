import { useRef } from 'react';
import { gsap } from 'gsap';

// Hook for custom GSAP animations
export function useGSAP() {
  const elementRef = useRef<HTMLElement>(null)

  const fadeIn = (delay = 0) => {
    if (!elementRef.current) return

    gsap.fromTo(elementRef.current, 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        delay,
        ease: 'power2.out' 
      }
    )
  }

  const slideIn = (direction: 'left' | 'right' | 'up' | 'down' = 'up', delay = 0) => {
    if (!elementRef.current) return

    const fromProps: gsap.TweenVars = { opacity: 0 }
    const toProps: gsap.TweenVars = { opacity: 1, duration: 0.6, delay, ease: 'power2.out' }

    switch (direction) {
      case 'left':
        fromProps.x = -50
        toProps.x = 0
        break
      case 'right':
        fromProps.x = 50
        toProps.x = 0
        break
      case 'up':
        fromProps.y = 30
        toProps.y = 0
        break
      case 'down':
        fromProps.y = -30
        toProps.y = 0
        break
    }

    gsap.fromTo(elementRef.current, fromProps, toProps)
  }

  const scaleIn = (delay = 0) => {
    if (!elementRef.current) return

    gsap.fromTo(elementRef.current,
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.5, 
        delay,
        ease: 'back.out(1.7)' 
      }
    )
  }

  return {
    elementRef,
    fadeIn,
    slideIn,
    scaleIn
  }
}
