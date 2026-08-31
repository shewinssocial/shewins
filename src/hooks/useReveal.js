import { useEffect, useRef } from 'react';

/**
 * Adds `.reveal` fade-up-on-scroll behavior to an element via IntersectionObserver.
 * Usage: const ref = useReveal(); <div ref={ref} className="reveal">...</div>
 */
export default function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}
