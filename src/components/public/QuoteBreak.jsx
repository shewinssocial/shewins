import React, { useEffect, useState } from 'react';
import useReveal from '../../hooks/useReveal.js';
import useParallax from '../../hooks/useParallax.js';

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
  const [isFading, setIsFading] = useState(false);
  const ref = useReveal({ variant: 'fade-up' });
  const iconParallax = useParallax({ speed: 0.08, min: -20, max: 20 });

  useEffect(() => {
    const id = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % QUOTES.length);
        setIsFading(false);
      }, 350);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const quote = QUOTES[index];

  return (
    <section aria-label="Community voices" className="py-16 sm:py-20 relative overflow-hidden">
      <div ref={ref} className="reveal-fade-up max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <div ref={iconParallax} className="transition-transform duration-500 ease-out">
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
        </div>

        <div
          className={`transition-all duration-350 ease-out ${
            isFading ? 'opacity-0 transform -translate-y-2 blur-[2px]' : 'opacity-100 transform translate-y-0 blur-0'
          }`}
        >
          <p className="font-display text-xl sm:text-2xl md:text-[1.75rem] leading-snug text-ink font-medium">
            "{quote.text}"
          </p>
          <p className="stitch-line w-16 mx-auto my-5" aria-hidden="true" />
          <p className="text-sm text-rose-600 font-semibold tracking-wide uppercase text-xs">
            {quote.author}
          </p>
        </div>
      </div>
    </section>
  );
}
