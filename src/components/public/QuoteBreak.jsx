import React, { useEffect, useState } from 'react';
import useReveal from '../../hooks/useReveal.js';

// Anonymous community-voice lines rather than attributed quotes from named
// public figures — appropriate for a members' platform, and it sidesteps
// the misattribution problem that plagues most "inspirational quote" lists
// circulating online.
const QUOTES = [
  {
    text: 'I walked in knowing no one and left with five new collaborators and a friend for life.',
    author: 'A Shewins member',
  },
  {
    text: 'This is the first room I\u2019ve been in where being ambitious and being kind were never treated as opposites.',
    author: 'A Shewins member',
  },
  {
    text: 'Someone I met at a Shewins meetup became my business partner six months later.',
    author: 'A Shewins member',
  },
  {
    text: 'I came for the community and stayed for how much I\u2019ve grown because of it.',
    author: 'A Shewins member',
  },
];

export default function QuoteBreak() {
  const [index, setIndex] = useState(0);
  const ref = useReveal();

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), 7000);
    return () => clearInterval(id);
  }, []);

  const quote = QUOTES[index];

  return (
    <section aria-label="Community voices" className="py-16 sm:py-20">
      <div ref={ref} className="reveal max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <svg
          className="mx-auto mb-6 text-rose-300"
          width="34"
          height="26"
          viewBox="0 0 34 26"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 26V14.6C0 6.4 5.2 1 13.6 0l1 3.4C9 5 6.6 8 6.6 12h7v14H0zm18.4 0V14.6C18.4 6.4 23.6 1 32 0l1 3.4c-5.6 1.6-8 4.6-8 8.6h7v14H18.4z"
            fill="currentColor"
          />
        </svg>
        <p
          key={index}
          className="font-display text-xl sm:text-2xl md:text-[1.75rem] leading-snug text-ink font-medium animate-fadeUp"
        >
          {quote.text}
        </p>
        <p className="stitch-line w-16 mx-auto my-5" aria-hidden="true" />
        <p className="text-sm text-rose-600 font-semibold tracking-wide">{quote.author}</p>
      </div>
    </section>
  );
}
