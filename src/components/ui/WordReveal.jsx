import React, { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

// Use isomorphic layout effect for SSR/CSR safety
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Editorial GSAP Typography Reveal Component.
 * Splits text into words wrapped in overflow-hidden 3D perspective masks.
 * Words rise kinetically with staggered rotation, skew, and opacity easing.
 * Coordinates seamlessly with CinematicIntro so the animation triggers
 * precisely when the user sees the hero headline.
 */
export default function WordReveal({
  children,
  as: Component = 'span',
  className = '',
  delay = 100,
  stagger = 45,
}) {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const hasAnimated = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const innerWords = el.querySelectorAll('.gsap-word-inner');
    if (!innerWords.length) return undefined;

    // Accessibility fallback
    if (prefersReducedMotion) {
      gsap.set(innerWords, { opacity: 1, yPercent: 0, rotateX: 0, skewY: 0 });
      return undefined;
    }

    // Set initial masked state immediately before paint
    gsap.set(innerWords, {
      yPercent: 125,
      opacity: 0,
      rotateX: -40,
      skewY: 4,
      transformOrigin: '0% 100%',
    });

    const runRevealAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const tl = gsap.timeline({
        delay: Math.max(delay / 1000, 0.08),
      });
      timelineRef.current = tl;

      // Kinetic masked roll-up
      tl.to(innerWords, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        skewY: 0,
        duration: 1.15,
        stagger: Math.max(stagger / 1000, 0.05),
        ease: 'power3.out',
      });

      // Signature accent glow on rose-highlighted words
      const roseWords = el.querySelectorAll('.text-rose-600 .gsap-word-inner');
      if (roseWords.length > 0) {
        tl.fromTo(
          roseWords,
          { filter: 'drop-shadow(0 0 0px rgba(219, 39, 119, 0))' },
          {
            filter: 'drop-shadow(0 4px 18px rgba(219, 39, 119, 0.4))',
            duration: 0.65,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
          },
          '-=0.45'
        );
      }
    };

    // Determine whether to play immediately or wait for the cinematic intro
    const isIntroActive =
      typeof window !== 'undefined' &&
      !window.__shewingsIntroCompleted &&
      document.querySelector('video');

    if (!isIntroActive) {
      // Intro already done or not present: run smoothly with microtask delay
      const immediateTimer = setTimeout(runRevealAnimation, 120);
      return () => clearTimeout(immediateTimer);
    }

    // Wait for the intro completion custom event
    const handleIntroDone = () => {
      setTimeout(runRevealAnimation, 100);
    };

    window.addEventListener('shewings:intro-complete', handleIntroDone, { once: true });

    // Safety fallback: if video ended event is delayed, never leave text hidden
    const safetyTimeout = setTimeout(runRevealAnimation, 8500);

    return () => {
      window.removeEventListener('shewings:intro-complete', handleIntroDone);
      clearTimeout(safetyTimeout);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [delay, stagger]);

  // Recursively process nodes (strings -> split into masked words, elements -> preserve structure)
  let wordCounter = 0;
  const processNode = (node) => {
    if (typeof node === 'string') {
      const words = node.split(/\s+/).filter(Boolean);
      return words.map((word, idx) => {
        const currentCount = wordCounter++;
        return (
          <span
            key={`${word}-${idx}-${currentCount}`}
            className="gsap-word-mask inline-block overflow-hidden align-bottom pt-[0.06em] pb-[0.16em] -mt-[0.06em] -mb-[0.16em] will-change-transform"
            style={{ perspective: '1000px' }}
          >
            <span
              className="gsap-word-inner inline-block transform-gpu will-change-transform"
              data-word-idx={currentCount}
            >
              {word}
            </span>
            {/* Natural word spacing */}
            <span className="inline-block">&nbsp;</span>
          </span>
        );
      });
    }

    if (React.isValidElement(node)) {
      if (node.type === 'br') return node;
      return React.cloneElement(node, {
        children: React.Children.map(node.props.children, processNode),
      });
    }

    return node;
  };

  return (
    <Component ref={containerRef} className={className}>
      {React.Children.map(children, processNode)}
    </Component>
  );
}
