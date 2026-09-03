import React, { Suspense, lazy } from 'react';
import { Button, Eyebrow } from '../ui/Primitives.jsx';
import { getOptimizedImageUrl } from '../../lib/imageUrl.js';
import WordReveal from '../ui/WordReveal.jsx';
import useParallax from '../../hooks/useParallax.js';

const HeroScene3D = lazy(() => import('./HeroScene3D.jsx'));

export default function Hero() {
  const imageParallaxRef = useParallax({ speed: -0.06, min: -40, max: 40 });
  const badgeParallaxRef = useParallax({ speed: 0.08, min: -30, max: 50 });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12"
    >
      {/* 3D Organic Wings Three.js Background (lazy loaded) */}
      <Suspense fallback={null}>
        <HeroScene3D />
      </Suspense>

      {/* Signature: subtle woven threads accent */}
      <svg
        className="absolute inset-x-0 top-0 w-full h-full opacity-60 pointer-events-none z-0"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMin slice"
        aria-hidden="true"
      >
        <path
          d="M-50 620 C 200 520, 340 720, 560 600 S 900 460, 1250 560"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="1 14"
          strokeLinecap="round"
        />
        <path
          d="M-50 180 C 220 260, 360 60, 610 160 S 940 300, 1250 140"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="1 14"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
        <div className="flex flex-col gap-5 lg:gap-6">
          <div className="animate-fadeUp">
            <Eyebrow>A community built by women, for women</Eyebrow>
          </div>

          <WordReveal
            as="h1"
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl leading-[1.08] font-semibold text-ink"
            delay={100}
            stagger={45}
          >
            Empowering Women.
            <br />
            <span className="text-rose-600">Connecting Communities.</span>
            <br />
            Creating Opportunities.
          </WordReveal>

          <p
            className="text-ink-soft text-base sm:text-lg max-w-xl leading-relaxed animate-fadeUp"
            style={{ animationDelay: '300ms', animationFillMode: 'both' }}
          >
            Shewins brings women together from different professions, businesses, and backgrounds —
            a place to be seen, supported, and celebrated as you grow.
          </p>

          <div
            className="flex flex-wrap gap-4 pt-1 animate-fadeUp"
            style={{ animationDelay: '400ms', animationFillMode: 'both' }}
          >
            <Button as="a" href="#about" variant="primary" className="shadow-soft hover:shadow-lg">
              Explore Shewins
            </Button>
            <Button as="a" href="#join" variant="secondary">
              Join Shewins
            </Button>
          </div>
        </div>

        <div
          ref={imageParallaxRef}
          className="relative mx-auto w-full max-w-sm lg:max-w-none transition-transform duration-700 ease-out"
        >
          {/* Main Hero Media Card */}
          <div className="relative rounded-xl2 overflow-hidden shadow-soft h-[300px] sm:h-[380px] lg:h-[420px] xl:h-[480px] group">
            <img
              src={getOptimizedImageUrl('/women-group-1.jpg', 1200)}
              alt="Women from the Shewins community gathered together, smiling and connecting"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Floating Metric Pill with Layered Parallax */}
          <div
            ref={badgeParallaxRef}
            className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-xl2 shadow-soft px-5 py-4 max-w-[220px] hidden sm:block border border-white/60 transition-transform duration-500 ease-out"
          >
            <p className="font-display text-2xl font-semibold text-rose-600">1000+</p>
            <p className="text-xs text-ink-faint mt-1 leading-snug">
              women connected across professions and cities
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
