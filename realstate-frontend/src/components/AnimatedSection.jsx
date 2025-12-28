import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedSection = ({ children, className = '', animation = 'fadeUp', delay = 0 }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const element = sectionRef.current;
    
    if (!element) return;

    const animations = {
      fadeUp: {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      },
      fadeLeft: {
        x: -80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      },
      fadeRight: {
        x: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      },
      scale: {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)',
      },
      rotate: {
        rotation: 10,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      }
    };

    gsap.from(element, {
      ...animations[animation],
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
      delay: delay,
    });
  }, [animation, delay]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
};

export default AnimatedSection;
