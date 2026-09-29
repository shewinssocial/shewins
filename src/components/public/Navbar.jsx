import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Primitives.jsx';

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'What We Do', href: '#what-we-do' },
  { label: 'Events', href: '#events' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Videos', href: '#videos' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4 transition-all duration-300">
      <nav
        className={`w-full max-w-6xl rounded-full transition-all duration-400 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-soft border border-white/40'
            : 'bg-white/40 backdrop-blur-sm border border-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-3">
          <a
            href="#home"
            id="navbar-logo"
            className="group flex items-center focus-ring rounded-lg py-1 transition-transform duration-300"
          >
            <img
              id="navbar-logo-img"
              src="/sl2.png"
              alt="SheWins — Women Forum"
              className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
              style={{ aspectRatio: '1878 / 829' }}
            />
          </a>

          <ul className="hidden lg:flex items-center gap-7 text-sm font-medium text-ink-soft">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="nav-link-premium py-1 hover:text-rose-600 transition-colors focus-ring rounded"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <Button as="a" href="#join" variant="primary">
              Join Shewins
            </Button>
          </div>

          <button
            className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full text-ink focus-ring cursor-pointer hover:bg-white/40 transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[84px] inset-x-4 z-50 lg:hidden rounded-xl2 bg-white/95 backdrop-blur-xl border border-white/70 shadow-soft overflow-hidden"
            >
              <div className="relative px-6 pt-6 pb-7">
                <ul className="flex flex-col gap-0.5 text-base font-display relative">
                  {LINKS.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between py-3.5 text-ink hover:text-rose-600 transition-colors border-b border-ink/[0.06] focus-ring rounded"
                      >
                        {link.label}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="opacity-40"
                        >
                          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>

                <Button
                  as="a"
                  href="#join"
                  variant="primary"
                  onClick={() => setOpen(false)}
                  className="mt-6 w-full relative"
                >
                  Join Shewins
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
