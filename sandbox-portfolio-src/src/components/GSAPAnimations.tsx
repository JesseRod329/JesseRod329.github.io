import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

interface GSAPAnimationsProps {
  children: React.ReactNode
  className?: string
}

export default function GSAPAnimations({ children, className = '' }: GSAPAnimationsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const elements = container.querySelectorAll('[data-animate]')

    // Set initial states
    gsap.set(elements, {
      opacity: 0,
      y: 30,
      scale: 0.95
    })

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    // Animate elements with stagger
    tl.to(elements, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

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

    const fromProps: any = { opacity: 0 }
    const toProps: any = { opacity: 1, duration: 0.6, delay, ease: 'power2.out' }

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
