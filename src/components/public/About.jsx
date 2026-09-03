import React from 'react';
import { SectionHeading, StitchDivider } from '../ui/Primitives.jsx';
import useReveal from '../../hooks/useReveal.js';
import useParallax from '../../hooks/useParallax.js';
import { publicImageLoading } from '../../lib/imageUrl.js';

const HIGHLIGHTS = [
  { title: 'Community', text: 'A circle of women who show up for one another.' },
  { title: 'Empowerment', text: 'Encouragement to grow, lead, and take up space.' },
  { title: 'Connection', text: 'Relationships that cross profession and background.' },
  { title: 'Opportunities', text: 'Doors opened through people, not paperwork.' },
];

export default function About() {
  const contentRef = useReveal({ variant: 'fade-up' });
  const highlightsRef = useReveal({ variant: 'fade-up', staggerChildren: true });
  const img1Parallax = useParallax({ speed: 0.05, min: -30, max: 30 });
  const img2Parallax = useParallax({ speed: -0.05, min: -30, max: 30 });
  const quoteParallax = useParallax({ speed: 0.08, min: -25, max: 40 });

  return (
    <section id="about" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left Column: Text and Highlights */}
          <div ref={contentRef} className="reveal-fade-up flex flex-col gap-6">
            <SectionHeading
              eyebrow="About SheWins Women Forum"
              title="A community woven together, one woman at a time."
              description="SheWins exists because women grow faster together than apart. We bring together founders, professionals, artists, and everyone in between — not to compete, but to connect. Whatever stage you're at, whatever room you're trying to walk into, SheWins is the community that walks in with you."
              wordReveal={true}
            />
            <p className="text-ink-soft leading-relaxed">
              Anyone who identifies as a woman and wants to be part of a community built on
              generosity, honesty, and real support is welcome at Shewins — no matter your
              profession, your background, or where you're starting from.
            </p>
            <StitchDivider className="my-2" />
            <div ref={highlightsRef} className="grid grid-cols-2 gap-6">
              {HIGHLIGHTS.map((h, i) => (
                <div
                  key={h.title}
                  className={`flex flex-col gap-1.5 p-3 rounded-xl hover:bg-white/60 transition-all duration-300 stagger-${i + 1}`}
                >
                  <p className="font-display text-lg font-semibold text-rose-600 tracking-tight">
                    {h.title}
                  </p>
                  <p className="text-sm text-ink-faint leading-relaxed">{h.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Layered Multi-Plane Media */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div
                ref={img1Parallax}
                className="rounded-xl2 overflow-hidden shadow-card h-64 sm:h-72 w-full mt-8 group transition-transform duration-700 ease-out"
              >
                <img
                  src="/women-group-11.jpeg"
                  alt="Women in conversation at a Shewins community meetup"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading={publicImageLoading}
                />
              </div>
              <div
                ref={img2Parallax}
                className="rounded-xl2 overflow-hidden shadow-card h-64 sm:h-72 w-full group transition-transform duration-700 ease-out"
              >
                <img
                  src="/women-group-14.jpeg"
                  alt="Members of Shewins collaborating at a roundtable"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading={publicImageLoading}
                />
              </div>
            </div>

            {/* Floating Layered Testimonial Pill */}
            <div
              ref={quoteParallax}
              className="absolute -top-6 right-1/3 bg-rose-600 text-white rounded-xl2 px-5 py-4 shadow-soft hidden sm:block border border-rose-500/50 transition-transform duration-500 ease-out"
            >
              <p className="font-display text-sm italic font-medium">"A room that finally felt like mine."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
