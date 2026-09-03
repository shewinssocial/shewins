import React, { useEffect, useRef, useState } from 'react';

/**
 * Editorial word-by-word reveal component.
 * Words slide up gracefully from an overflow-hidden clip container with staggered delays.
 */
export default function WordReveal({
  children,
  as: Component = 'span',
  className = '',
  delay = 0,
  stagger = 40,
  threshold = 0.2,
}) {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  // Recursively process nodes (strings -> split into words, elements -> preserved)
  let wordCounter = 0;
  const processNode = (node) => {
    if (typeof node === 'string') {
      const words = node.split(/\s+/).filter(Boolean);
      return words.map((word, idx) => {
        const currentCount = wordCounter++;
        return (
          <span key={`${word}-${idx}-${currentCount}`} className="word-mask-wrap">
            <span
              className={`word-mask-inner ${isInView ? 'is-in-view' : ''}`}
              style={{ transitionDelay: `${delay + currentCount * stagger}ms` }}
            >
              {word}
            </span>
            {/* Preserve natural spacing between words */}
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
