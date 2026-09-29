import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SmoothScroll component using Lenis v1.
 * Provides luxury, momentum-smoothed scrolling coordinated frame-by-frame
 * with GSAP ScrollTrigger. Automatically handles anchor links (#about, #events, etc.)
 * and respects reduced motion settings and admin route exclusions.
 */
export default function SmoothScroll({ children, isPaused = false }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Do not activate smooth scrolling in CMS / admin area
    if (window.location.pathname.startsWith('/admin')) return;

    // Respect reduced motion accessibility
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    // Synchronize Lenis scroll positions with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Support internal hash navigation (#about, #events, #join, etc.)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#' && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -70, duration: 1.2 });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // Control pause/resume state (e.g. while intro video is playing)
  useEffect(() => {
    if (window.__lenis) {
      if (isPaused) {
        window.__lenis.stop();
      } else {
        window.__lenis.start();
      }
    }
  }, [isPaused]);

  return <>{children}</>;
}
