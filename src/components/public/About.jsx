import React from 'react';
import { SectionHeading, StitchDivider } from '../ui/Primitives.jsx';
import useReveal from '../../hooks/useReveal.js';

const HIGHLIGHTS = [
  { title: 'Community', text: 'A circle of women who show up for one another.' },
  { title: 'Empowerment', text: 'Encouragement to grow, lead, and take up space.' },
  { title: 'Connection', text: 'Relationships that cross profession and background.' },
  { title: 'Opportunities', text: 'Doors opened through people, not paperwork.' },
];

export default function About() {
  const ref = useReveal();
  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div ref={ref} className="reveal grid lg:grid-cols-2 gap-14 items-center">
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="About  SheWins Women Forum"
              title="A community woven together, one woman at a time."
              description=" SheWins exists because women grow faster together than apart. We bring together founders, professionals, artists, and everyone in between — not to compete, but to connect. Whatever stage you're at, whatever room you're trying to walk into,  SheWins is the community that walks in with you."
            />
            <p className="text-ink-soft leading-relaxed">
              Anyone who identifies as a woman and wants to be part of a community built on
              generosity, honesty, and real support is welcome at  Shewins — no matter your
              profession, your background, or where you're starting from.
            </p>
            <StitchDivider className="my-2" />
            <div className="grid grid-cols-2 gap-6">
              {HIGHLIGHTS.map((h) => (
                <div key={h.title} className="flex flex-col gap-1">
                  <p className="font-display text-lg font-semibold text-rose-600">{h.title}</p>
                  <p className="text-sm text-ink-faint leading-relaxed">{h.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop"
                alt="Women in conversation at a  Shewins community meetup"
                className="rounded-xl2 shadow-card object-cover h-64 w-full mt-8"
                loading="lazy"
              />
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
                alt="Members of  Shewins collaborating at a roundtable"
                className="rounded-xl2 shadow-card object-cover h-64 w-full"
                loading="lazy"
              />
            </div>
            <div className="absolute -top-6 right-1/3 bg-rose-600 text-white rounded-xl2 px-5 py-4 shadow-soft hidden sm:block">
              <p className="font-display text-sm">"A room that finally felt like mine."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
