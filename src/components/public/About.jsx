import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading, StitchDivider } from '../ui/Primitives.jsx';
import useParallax from '../../hooks/useParallax.js';

const HIGHLIGHTS = [
  { title: 'Community', text: 'A circle of women who show up for one another.' },
  { title: 'Empowerment', text: 'Encouragement to grow, lead, and take up space.' },
  { title: 'Connection', text: 'Relationships that cross profession and background.' },
  { title: 'Opportunities', text: 'Doors opened through people, not paperwork.' },
];

export default function About() {
  const sectionRef = useRef(null);

  // Section-scoped parallax: imagery drifts at ~0.9 speed while text stays static (1.0)
  const { y: imgDriftY } = useParallax({ speed: 0.9, distance: 35, targetRef: sectionRef });
  const { y: quoteDriftY } = useParallax({ speed: 1.08, distance: 30, targetRef: sectionRef });

  return (
    <section ref={sectionRef} id="about" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left Column: Words stay confident and static (speed 1.0) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <SectionHeading
              eyebrow="About SheWins Women Forum"
              title="A community woven together, one woman at a time."
              description="SheWins exists because women grow faster together than apart. We bring together founders, professionals, artists, and everyone in between — not to compete, but to connect. Whatever stage you're at, whatever room you're trying to walk into, SheWins is the community that walks in with you."
            />
            <p className="text-ink-soft leading-relaxed">
              Anyone who identifies as a woman and wants to be part of a community built on
              generosity, honesty, and real support is welcome at Shewins — no matter your
              profession, your background, or where you're starting from.
            </p>
            <StitchDivider className="my-2" />
            <div className="grid grid-cols-2 gap-6">
              {HIGHLIGHTS.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-white/60 transition-colors duration-300"
                >
                  <p className="font-display text-lg font-semibold text-rose-600 tracking-tight">
                    {h.title}
                  </p>
                  <p className="text-sm text-ink-faint leading-relaxed">{h.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Layered Multi-Plane Media Drifting at ~0.9 speed */}
          <motion.div style={{ y: imgDriftY }} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl2 overflow-hidden shadow-card h-64 sm:h-72 w-full mt-8 group bg-cream-200">
                <img
                  src="/women-group-11.jpeg"
                  alt="Women in conversation at a Shewins community meetup"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
              </div>
              <div className="rounded-xl2 overflow-hidden shadow-card h-64 sm:h-72 w-full group bg-cream-200">
                <img
                  src="/women-group-14.jpeg"
                  alt="Members of Shewins collaborating at a roundtable"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
              </div>
            </div>

            {/* Floating Layered Testimonial Pill */}
            <motion.div
              style={{ y: quoteDriftY }}
              className="absolute -top-6 right-1/3 bg-rose-600 text-white rounded-xl2 px-5 py-4 shadow-soft hidden sm:block border border-rose-500/50"
            >
              <p className="font-display text-sm italic font-medium">"A room that finally felt like mine."</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
