import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const quote = QUOTES[index];

  return (
    <section aria-label="Community voices" className="py-16 sm:py-20 relative overflow-hidden">
      {/* Clip/mask unveil moment on scroll entry per §4 */}
      <motion.div
        initial={{ clipPath: 'inset(60% 0% 0% 0%)', opacity: 0, y: 16 }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto px-6 sm:px-8 text-center"
      >
        <div>
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

        <div className="min-h-[120px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote className="font-display text-2xl sm:text-3xl lg:text-[2rem] leading-snug text-ink font-normal italic">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-rose-600 mt-5">
                — {quote.author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
