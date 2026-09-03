import { useEffect, useState, useCallback } from 'react';

/**
 * Editorial scroll reveal behavior via IntersectionObserver.
 * Uses a callback ref so dynamically loaded elements (e.g. after async fetches)
 * are reliably observed the moment they mount.
 *
 * @param {Object} options
 * @param {number} options.threshold - Intersection threshold (default 0.01)
 * @param {string} options.rootMargin - Margin around root bounds (default '80px 0px 80px 0px')
 * @param {string} options.variant - Reveal animation variant ('fade-up' | 'blur' | 'scale' | 'clip')
 * @param {boolean} options.once - Whether to unobserve after reveal (default true)
 */
export default function useReveal({
  threshold = 0.01,
  rootMargin = '80px 0px 80px 0px',
  variant = 'fade-up',
  once = true,
  ...customOptions
} = {}) {
  const [element, setElement] = useState(null);

  const ref = useCallback((node) => {
    if (node) {
      setElement(node);
    }
  }, []);

  useEffect(() => {
    if (!element) return undefined;

    // Accessibility: instantly visible if prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      element.classList.add('is-visible');
      return undefined;
    }

    // Ensure variant class is attached
    const variantClass = `reveal-${variant}`;
    if (!element.classList.contains('reveal') && !element.classList.contains(variantClass)) {
      element.classList.add(variantClass);
    }

    // Immediate check if element is already within or near viewport
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight + 150 && rect.bottom > -150) {
      element.classList.add('is-visible');
      if (once) return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          entry.target.classList.remove('is-visible');
        }
      },
      { threshold, rootMargin, ...customOptions }
    );

    observer.observe(element);

    // Failsafe timer: ensure element is NEVER left hidden indefinitely
    const timer = setTimeout(() => {
      if (element && !element.classList.contains('is-visible')) {
        element.classList.add('is-visible');
      }
    }, 800);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [element, variant, once, threshold, rootMargin]);

  return ref;
}
