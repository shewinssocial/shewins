import React from 'react';
import { SectionHeading } from '../ui/Primitives.jsx';
import useReveal from '../../hooks/useReveal.js';

const ITEMS = [
  {
    title: 'Women Empowerment',
    text: 'Creating opportunities and encouraging women to grow, lead, and back themselves.',
    icon: (
      <path d="M12 3l2.2 4.5L19 8.3l-3.5 3.4.8 4.9L12 14.4l-4.3 2.2.8-4.9L5 8.3l4.8-.8L12 3z" />
    ),
  },
  {
    title: 'Community',
    text: 'Connecting women from different professions, industries, and walks of life.',
    icon: <path d="M8 11a3 3 0 100-6 3 3 0 000 6zm8 0a3 3 0 100-6 3 3 0 000 6zM2 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2.5 2-4 4-4s4 1.5 4 4" />,
  },
  {
    title: 'Networking',
    text: 'Building meaningful professional and personal connections that last.',
    icon: <path d="M6 12a3 3 0 106 0 3 3 0 00-6 0zm6 6a3 3 0 106 0 3 3 0 00-6 0zM8.7 13.6l4.6 3.2M9 10.5l6-3" />,
  },
  {
    title: 'Events',
    text: 'Programs, meetings, workshops, and community activities throughout the year.',
    icon: <path d="M4 7h16M7 3v4M17 3v4M5 21h14a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v13a1 1 0 001 1z" />,
  },
  {
    title: 'Skill Development',
    text: 'Encouraging learning, knowledge sharing, and personal growth at every stage.',
    icon: <path d="M12 4L2 9l10 5 8-4v6M6 11.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />,
  },
  {
    title: 'Opportunities',
    text: 'Helping women discover new possibilities, collaborations, and open doors.',
    icon: <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1.2 4.5 2.5C12 6.2 13.5 5 15.5 5 19 5 21.5 8.5 19.5 12.5 17 16.65 12 21 12 21z" />,
  },
];

export default function WhatWeDo() {
  const ref = useReveal();
  return (
    <section id="what-we-do" className="py-16 sm:py-24 bg-white/60">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="SheWins empowers women entrepreneurs to connect, grow, and win together."
          align="center"
        />
        <div ref={ref} className="reveal grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {ITEMS.map((item, i) => (
            <div
              key={item.title}
              className="group rounded-xl2 bg-white p-7 shadow-card hover:shadow-soft hover:-translate-y-1.5 transition-all duration-300 border border-transparent hover:border-rose-100"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  {item.icon}
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-ink mt-5">{item.title}</h3>
              <p className="text-ink-faint text-sm leading-relaxed mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
