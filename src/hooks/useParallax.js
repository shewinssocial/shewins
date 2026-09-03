import { useEffect, useRef } from 'react';

/**
 * Applies a smooth scroll-driven parallax translation to an element.
 * @param {Object} options
 * @param {number} options.speed - Speed multiplier (negative moves opposite to scroll, positive moves with scroll)
 * @param {number} options.min - Lower bound offset in pixels
 * @param {number} options.max - Upper bound offset in pixels
 * @param {boolean} options.disabledOnMobile - Whether to disable on screens < 768px
 */
export default function useParallax({
  speed = 0.1,
  min = -120,
  max = 120,
  disabledOnMobile = true,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    let ticking = false;
    let frameId = null;

    function updateParallax() {
      if (!el) return;

      if (disabledOnMobile && window.innerWidth < 768) {
        el.style.transform = '';
        return;
      }

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Only calculate if the element is near or within the viewport
      if (rect.bottom >= -200 && rect.top <= viewportHeight + 200) {
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const delta = centerY - viewportCenter;

        const offset = Math.max(min, Math.min(max, delta * speed));
        el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
        el.style.willChange = 'transform';
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        frameId = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frameId) cancelAnimationFrame(frameId);
      if (el) {
        el.style.transform = '';
        el.style.willChange = '';
      }
    };
  }, [speed, min, max, disabledOnMobile]);

  return ref;
}
