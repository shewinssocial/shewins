import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FlipWords } from '../ui/flipwords.tsx';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Words for continuous infinite flip animation
const FLIP_WORDS = ['Rises.', 'Creates.', 'Leads.'];

// Use isomorphic layout effect
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * MagneticButton — CTA button with subtle magnetic pull on desktop.
 */
function MagneticButton({ href, variant = 'primary', children }) {
  const btnRef = useRef(null);
  const magnetRef = useRef({ x: 0, y: 0, rafId: null });

  const onMouseMove = useCallback((e) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.28;
    const dy = (e.clientY - cy) * 0.28;
    magnetRef.current.x = dx;
    magnetRef.current.y = dy;
    cancelAnimationFrame(magnetRef.current.rafId);
    magnetRef.current.rafId = requestAnimationFrame(() => {
      if (el) gsap.to(el, { x: dx, y: dy, duration: 0.55, ease: 'power2.out' });
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    cancelAnimationFrame(magnetRef.current.rafId);
    if (btnRef.current)
      gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
  }, []);

  const baseClasses =
    'hero-cta-btn inline-flex items-center justify-center gap-2 rounded-full px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 cursor-pointer select-none will-change-transform';

  const variants = {
    primary:
      'bg-[#DB2777] text-white hover:bg-[#BE185D] shadow-[0_6px_24px_-6px_rgba(219,39,119,0.5)] hover:shadow-[0_10px_32px_-6px_rgba(219,39,119,0.55)]',
    secondary:
      'bg-white text-[#3A2E29] border border-[#3A2E29]/25 hover:bg-[#F3EFE6] hover:border-[#3A2E29]/50 shadow-sm',
  };

  return (
    <a
      ref={btnRef}
      href={href}
      className={`${baseClasses} ${variants[variant]}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  );
}

/**
 * ScrollIndicator — Minimal animated scroll cue at bottom of Hero.
 */
function ScrollIndicator() {
  return (
    <div
      className="hero-scroll-indicator absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      aria-hidden="true"
    >
      <span className="text-[10px] tracking-[0.25em] uppercase text-ink-faint font-medium">
        Scroll
      </span>
      <div className="relative h-10 w-px overflow-hidden">
        <div className="scroll-line-inner absolute top-0 left-0 w-full bg-gradient-to-b from-rose-400/60 to-transparent" />
      </div>
    </div>
  );
}

/**
 * HeroAbstractVisual — CSS/SVG fallback for mobile or reduced-motion environments.
 */
function HeroAbstractVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" aria-hidden="true">
      {/* Outer diffuse glow ring */}
      <div className="absolute w-[340px] h-[340px] rounded-full bg-gradient-radial from-rose-200/40 via-rose-100/20 to-transparent animate-[pulse_6s_ease-in-out_infinite]" />
      {/* Mid organic shape */}
      <div
        className="absolute w-[260px] h-[280px] rounded-[70%_55%_60%_65%/65%_60%_55%_60%] bg-gradient-to-br from-rose-100/60 via-pink-50/40 to-cream-100/30 border border-rose-200/30 backdrop-blur-sm animate-[drift_8s_ease-in-out_infinite]"
        style={{ animationDelay: '-2s' }}
      />
      {/* Inner sphere highlight */}
      <div className="absolute w-[180px] h-[190px] rounded-[55%_65%_60%_70%/60%_55%_65%_60%] bg-gradient-to-tl from-rose-200/50 via-pink-100/40 to-transparent border border-white/40 animate-[drift_10s_ease-in-out_infinite]" />
      {/* Light refraction dot */}
      <div className="absolute top-[30%] left-[38%] w-8 h-8 rounded-full bg-white/30 blur-sm animate-[drift_7s_ease-in-out_infinite]" />
      {/* Particle dots */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-rose-400/40"
          style={{
            top: `${20 + Math.sin(i * 0.8) * 35 + 30}%`,
            left: `${20 + Math.cos(i * 0.8) * 35 + 30}%`,
            animationDelay: `${i * 0.4}s`,
            animation: `drift ${6 + i}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Premium Hero Section — SheWins editorial redesign.
 *
 * Features:
 * - GSAP sequential line-by-line headline reveal
 * - Three.js organic glass orb (desktop only, lazy-loaded)
 * - CSS/SVG fallback visual for mobile
 * - Magnetic CTA buttons (desktop only)
 * - Subtle mouse parallax on the orb
 * - Scroll indicator
 * - Syncs with CinematicIntro completion event
 */
export default function Hero() {
  const sectionRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const subTextRef = useRef(null);
  const ctaRef = useRef(null);
  const eyebrowRef = useRef(null);
  const orbWrapRef = useRef(null);
  const tlRef = useRef(null);
  const hasAnimated = useRef(false);



  // GSAP sequential headline animation
  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lines = [line1Ref, line2Ref, line3Ref].map((r) => r.current).filter(Boolean);
    const eyebrow = eyebrowRef.current;
    const subText = subTextRef.current;
    const cta = ctaRef.current;
    const orbWrap = orbWrapRef.current;
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');

    if (!lines.length) return;

    // Set initial hidden states immediately
    if (prefersReducedMotion) {
      [eyebrow, ...lines, subText, cta, orbWrap, scrollIndicator].forEach((el) => {
        if (el) gsap.set(el, { opacity: 1, y: 0, filter: 'blur(0px)', clipPath: 'inset(0 0 0% 0)' });
      });
      return;
    }

    gsap.set(eyebrow, { opacity: 0, y: 12 });
    lines.forEach((line) => {
      gsap.set(line, {
        opacity: 0,
        y: 50,
        filter: 'blur(10px)',
        clipPath: 'inset(0 0 100% 0)',
      });
    });
    gsap.set(subText, { opacity: 0, y: 22, filter: 'blur(6px)' });
    gsap.set(cta, { opacity: 0, y: 18 });
    if (orbWrap) gsap.set(orbWrap, { opacity: 0, scale: 0.88, filter: 'blur(16px)' });
    if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0 });

    const runAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const tl = gsap.timeline({ delay: 0.15 });
      tlRef.current = tl;

      // Eyebrow
      tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0);

      // Line 1 — SHE RISES.
      tl.to(
        line1Ref.current,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          ease: 'power3.out',
        },
        0.25
      );

      // Line 2 — She Rises/Creates/Leads
      tl.to(
        line2Ref.current,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          ease: 'power3.out',
          onComplete: () => {
            if (line2Ref.current) {
              gsap.set(line2Ref.current, { clearProps: 'clipPath,filter' });
            }
          },
        },
        0.52
      );

      // Line 3 — SHE LEADS.
      tl.to(
        line3Ref.current,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          ease: 'power3.out',
        },
        0.79
      );

      // Supporting text
      tl.to(
        subText,
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.95, ease: 'power2.out' },
        1.15
      );

      // CTA buttons
      tl.to(cta, { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' }, 1.42);

      // Visual — reveal with bloom
      if (orbWrap) {
        tl.to(
          orbWrap,
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.6, ease: 'power2.out' },
          0.5
        );
      }

      // Scroll indicator
      if (scrollIndicator) {
        tl.to(scrollIndicator, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 1.8);
      }
    };

    // Determine if intro is already done or skipped.
    // - window.__shewingsIntroCompleted: set by App.jsx when intro finishes or is skipped
    // - sessionStorage key: set immediately on mount so refresh reliably skips intro
    const introAlreadyDone =
      (typeof window !== 'undefined' && !!window.__shewingsIntroCompleted) ||
      !!(typeof sessionStorage !== 'undefined' && sessionStorage.getItem('shewings_intro_played'));

    if (introAlreadyDone) {
      // Run immediately — App.jsx already dispatched the event with a 120ms delay,
      // but we listen here too with our own timer as a belt-and-suspenders guarantee
      const immediateTimer = setTimeout(runAnimation, 160);
      const handler = () => {
        clearTimeout(immediateTimer);
        runAnimation();
      };
      window.addEventListener('shewings:intro-complete', handler, { once: true });
      return () => {
        window.removeEventListener('shewings:intro-complete', handler);
        clearTimeout(immediateTimer);
        if (tlRef.current) tlRef.current.kill();
      };
    } else {
      // Intro is playing — wait for its completion event
      window.addEventListener('shewings:intro-complete', runAnimation, { once: true });
      // Safety fallback: never leave text invisible
      const safety = setTimeout(runAnimation, 15000);
      return () => {
        window.removeEventListener('shewings:intro-complete', runAnimation);
        clearTimeout(safety);
        if (tlRef.current) tlRef.current.kill();
      };
    }
  }, []);

  // Scroll-indicator line animation
  useEffect(() => {
    const line = document.querySelector('.scroll-line-inner');
    if (!line) return;
    gsap.to(line, {
      height: '100%',
      duration: 1.4,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: false,
      repeatDelay: 0.3,
    });
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-screen flex items-center overflow-hidden bg-[#F3EFE6]"
    >
      {/* ====================================================== */}
      {/* BACKGROUND DECORATIVE ELEMENTS                         */}
      {/* ====================================================== */}

      {/* Subtle radial gradient wash — top-right */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 65% at 78% 30%, rgba(217,153,160,0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(217,153,160,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Signature woven thread — decorative SVG lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none z-0"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          d="M-80 680 C 200 560, 420 780, 700 640 S 1100 480, 1520 600"
          stroke="#B4616C"
          strokeWidth="1"
          strokeDasharray="2 18"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M-80 200 C 250 310, 420 80, 720 200 S 1060 360, 1520 160"
          stroke="#B4616C"
          strokeWidth="1"
          strokeDasharray="2 18"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M 600 -20 C 640 200, 580 400, 720 550 S 820 700, 760 920"
          stroke="#C97B84"
          strokeWidth="0.8"
          strokeDasharray="1 20"
          strokeLinecap="round"
          opacity="0.25"
        />
      </svg>

      {/* ====================================================== */}
      {/* MAIN CONTENT GRID                                      */}
      {/* ====================================================== */}
      {/* pt-16 = navbar height, pb-4 = bottom breathing room   */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 sm:pt-18 lg:pt-20 pb-4">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] xl:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-12 xl:gap-16 items-center">

          {/* ================================================ */}
          {/* LEFT — TEXT CONTENT                              */}
          {/* ================================================ */}
          <div
            id="hero-text-column"
            className="flex flex-col gap-3 sm:gap-4 lg:gap-5"
          >
            {/* Eyebrow label */}
            <div ref={eyebrowRef}>
              <span className="inline-flex items-center gap-2.5 text-[10px] sm:text-[11px] tracking-[0.22em] uppercase font-semibold text-[#6E3A43]">
                <span className="h-px w-6 bg-[#C97B84]/70" aria-hidden="true" />
                A Community Built for Women, by Women
              </span>
            </div>

            {/* Headline — 3 lines, individually animated */}
            <h1 className="flex flex-col gap-0">
              <span
                ref={line1Ref}
                className="block font-display text-[clamp(1.9rem,4vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.015em] text-[#3A2E29]"
              >
                Empowering Women.
              </span>
              <span
                ref={line2Ref}
                className="block text-pink-600 font-display text-[clamp(1.9rem,4vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.015em] text-[#B4616C]"
              >
                She <br />
                <FlipWords
                  words={["Rises.", "Creates.", "Leads."]}
                  className="text-pink-600 px-0"
                  duration={2500}
                />
              </span>
              <span
                ref={line3Ref}
                className="block font-display text-[clamp(1.9rem,4vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.015em] text-[#3A2E29]"
              >
                Creating Opportunities.
              </span>
            </h1>

            {/* Supporting description */}
            <p
              ref={subTextRef}
              className="text-[#5E4E47] text-sm sm:text-base max-w-lg leading-relaxed"
            >
              Shewins brings women together from different professions, businesses, and backgrounds — a place to be seen, supported, and celebrated as you grow.
            </p>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-wrap gap-3 pt-1">
              <MagneticButton href="#about" variant="primary">
                Explore Shewins
              </MagneticButton>
              <MagneticButton href="#join" variant="secondary">
                Join Shewins
              </MagneticButton>
            </div>

            {/* Decorative brand stats */}
            <div className="flex items-center gap-5 pt-2 border-t border-[#3A2E29]/8">
              <div className="flex flex-col">
                <span className="font-display text-xl font-semibold text-[#6E3A43]">1000+</span>
                <span className="text-[11px] tracking-wide text-[#8A796F]">Women Connected</span>
              </div>
              <div className="w-px h-7 bg-[#C97B84]/30" />
              <div className="flex flex-col">
                <span className="font-display text-xl font-semibold text-[#6E3A43]">50+</span>
                <span className="text-[11px] tracking-wide text-[#8A796F]">Events Hosted</span>
              </div>
              <div className="w-px h-7 bg-[#C97B84]/30" />
              <div className="flex flex-col">
                <span className="font-display text-xl font-semibold text-[#6E3A43]">∞</span>
                <span className="text-[11px] tracking-wide text-[#8A796F]">Possibilities</span>
              </div>
            </div>
          </div>

          {/* ================================================ */}
          {/* RIGHT — ORGANIC VISUAL                           */}
          {/* ================================================ */}
          <div
            ref={orbWrapRef}
            className="relative flex items-center justify-center h-[52vh] lg:h-[60vh] w-full max-h-[520px]"
            aria-hidden="true"
          >

            {/* Background glow ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-[80%] h-[80%] rounded-full opacity-50"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(201,123,132,0.22) 0%, rgba(217,153,160,0.12) 45%, transparent 70%)',
                  filter: 'blur(24px)',
                }}
              />
            </div>

            {/* Floating elegant curves — SVG */}
            <svg
              className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
              viewBox="0 0 500 500"
              fill="none"
            >
              <ellipse cx="250" cy="250" rx="210" ry="230" stroke="#C97B84" strokeWidth="0.6" opacity="0.5" />
              <ellipse cx="250" cy="250" rx="165" ry="180" stroke="#B4616C" strokeWidth="0.5" opacity="0.35" strokeDasharray="4 12" />
              <path
                d="M 250 50 C 370 100, 440 200, 420 280 S 340 430, 250 450 S 100 400, 80 300 S 130 100, 250 50 Z"
                stroke="#D999A0"
                strokeWidth="0.8"
                fill="rgba(217,153,160,0.04)"
                opacity="0.6"
              />
            </svg>

            {/* Organic Editorial Visual (Pure CSS/SVG, Zero Three.js) */}
            <HeroAbstractVisual />

            {/* Floating particle dots — CSS only, decorative */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
              {[
                { size: 5, top: '18%', left: '14%', delay: 0 },
                { size: 3, top: '72%', left: '20%', delay: 1.5 },
                { size: 4, top: '30%', right: '12%', delay: 0.8 },
                { size: 6, top: '65%', right: '18%', delay: 2.2 },
                { size: 3, top: '50%', left: '8%', delay: 3.1 },
              ].map((p, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-rose-400/40 animate-drift"
                  style={{
                    width: p.size,
                    height: p.size,
                    top: p.top,
                    left: p.left,
                    right: p.right,
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${6 + i * 1.5}s`,
                  }}
                />
              ))}
            </div>

            {/* Translucent editorial label — subtle */}
            <div className="absolute bottom-6 right-6 lg:right-0 flex items-center gap-2 opacity-40">
              <div className="h-px w-6 bg-[#C97B84]" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A796F] font-medium">
                Community
              </span>
            </div>
          </div>

        </div>{/* end grid */}
      </div>{/* end content */}

      {/* Scroll indicator */}
      <ScrollIndicator />

      {/* id anchor for StorySection transition */}
      <div
        id="hero-media-card"
        data-hero-card="true"
        aria-hidden="true"
        style={{ display: 'none' }}
      />
    </section>
  );
}
