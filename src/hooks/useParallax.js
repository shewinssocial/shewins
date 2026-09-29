import { useRef } from 'react';
import { useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Section-scoped smooth parallax hook using Framer Motion.
 * Calculates scroll progress relative to the target section container (`target: ref`).
 * Returns a smoothed `y` motion value wrapped in `useSpring` for a lagged-follow feel.
 *
 * @param {Object} [options]
 * @param {number} [options.speed=1.0] - Relative speed (1.0 = normal page rate, 0.85 = slower/depth)
 * @param {number} [options.distance=60] - Base travel range
 * @param {React.RefObject} [options.targetRef] - Section container ref (or created automatically)
 * @param {Object} [options.springConfig] - Framer Motion spring config
 * @returns {{ ref: React.RefObject, y: import('framer-motion').MotionValue<number> }}
 */
export default function useParallax({
  speed = 1.0,
  distance = 60,
  targetRef,
  springConfig = { stiffness: 90, damping: 26, mass: 0.8, restDelta: 0.001 },
} = {}) {
  const localRef = useRef(null);
  const containerRef = targetRef || localRef;
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Relative speed difference translates to travel:
  // Speed < 1.0 moves slower than page scroll (creates background depth)
  // Speed > 1.0 moves faster than page scroll (creates foreground drift)
  const delta = (1 - speed) * distance * 2.5;

  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-delta, delta]
  );

  const y = useSpring(rawY, springConfig);

  return { ref: containerRef, y };
}
