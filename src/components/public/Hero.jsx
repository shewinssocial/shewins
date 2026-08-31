import React from 'react';
import { Button, Eyebrow } from '../ui/Primitives.jsx';
import { getOptimizedImageUrl } from '../../lib/imageUrl.js';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12"
    >
      {/* Signature: threads weaving between nodes — women, connected */}
      <svg
        className="absolute inset-x-0 top-0 w-full h-full opacity-70 pointer-events-none"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMin slice"
        aria-hidden="true"
      >
        <path
          d="M-50 620 C 200 520, 340 720, 560 600 S 900 460, 1250 560"
          stroke=" white"
          strokeWidth="2"
          strokeDasharray="1 14"
          strokeLinecap="round"
        />
        <path
          d="M-50 180 C 220 260, 360 60, 610 160 S 940 300, 1250 140"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="1 14"
          strokeLinecap="round"
        />
          </svg>

      <div className="relative w-full max-w-6xl mx-auto px-6 sm:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
        <div className="flex flex-col gap-5 lg:gap-6 animate-fadeUp">
          <Eyebrow>A community built by women, for women</Eyebrow>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl leading-[1.05] font-semibold text-ink">
            Empowering Women.
            <br />
            <span className="text-rose-600">Connecting Communities.</span>
            <br />
            Creating Opportunities.
          </h1>
          <p className="text-ink-soft text-base sm:text-lg max-w-xl leading-relaxed">
            Shewins brings women together from different professions, businesses, and backgrounds —
            a place to be seen, supported, and celebrated as you grow.
          </p>
          <div className="flex flex-wrap gap-4 pt-1">
            <Button as="a" href="#about" variant="primary">
              Explore Shewins
            </Button>
            <Button as="a" href="#join" variant="secondary">
              Join Shewins
            </Button>
          </div>

          {/* <div className="flex items-center gap-6 pt-2 lg:pt-4 text-sm text-ink-faint">
            <div className="flex -space-x-3">
              {['#E9BEC2', '#C97B84', '#8C4B56', '#DFD3B9'].map((c, i) => (
                <span
                  key={i}
                  className="h-9 w-9 rounded-full border-2 border-cream"
                  style={{ background: c }}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span>Women from every profession, one community.</span>
          </div> */}
        </div>

        <div
          className="relative animate-fadeUp mx-auto w-full max-w-sm lg:max-w-none"
          style={{ animationDelay: '120ms' }}
        >
          {/* Fixed, breakpoint-scaled heights instead of aspect-ratio — aspect-[4/5]
              scaled off the column's *width*, so on a wide two-column desktop
              layout the image kept growing taller than the viewport itself. */}
          <div className="relative rounded-xl2 overflow-hidden shadow-soft h-[300px] sm:h-[380px] lg:h-[420px] xl:h-[480px]">
            <img
              src={getOptimizedImageUrl('/women-group-1.jpg', 1200)}
              alt="Women from the Shewins community gathered together, smiling and connecting"
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white rounded-xl2 shadow-soft px-5 py-4 max-w-[220px] hidden sm:block">
            <p className="font-display text-2xl font-semibold text-rose-600">1000+</p>
            <p className="text-xs text-ink-faint mt-1">women connected across professions and cities</p>
          </div>
        </div>
      </div>
    </section>
  );
}
