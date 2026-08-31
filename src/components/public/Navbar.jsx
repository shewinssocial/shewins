import React, { useEffect, useState } from 'react';
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
    window.addEventListener('scroll', onScroll);
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
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`w-full max-w-6xl rounded-full transition-all duration-300 ${
          scrolled ? 'bg-white/85 backdrop-blur-md shadow-soft' : 'bg-white/40 backdrop-blur-sm'
        }`}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-3">
         <a href="#home" className="flex items-center gap-2 font-display text-ink">
           <img src="/shweinslogo.png" width="32" height="32" alt="Shewins" />
           <span className="flex flex-col leading-none">
             <span className="text-lg font-semibold">SheWins</span>
             <span className="text-[10px] font-medium tracking-[0.12em]  text-ink-soft">Women Forum</span>
           </span>
         </a>

          <ul className="hidden lg:flex items-center gap-7 text-sm font-medium text-ink-soft">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-rose-600 transition-colors focus-ring rounded">
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
            className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full text-ink focus-ring"
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

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-[1px] lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className="fixed top-[84px] inset-x-4 z-50 lg:hidden rounded-xl2 bg-white/85 backdrop-blur-xl border border-white/60 shadow-soft overflow-hidden animate-fadeUp"
          >
            <div className="relative px-6 pt-6 pb-7">
              {/* <svg
                className="absolute -top-6 -right-10 opacity-40 pointer-events-none"
                width="160"
                height="160"
                viewBox="0 0 160 160"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="80" cy="80" r="78" stroke="#E9BEC2" strokeWidth="1.5" strokeDasharray="1 10" />
              </svg> */}

              <ul className="flex flex-col gap-0.5 text-base font-display relative">
                {LINKS.map((link, i) => (
                  <li
                    key={link.href}
                    className="animate-fadeUp"
                    style={{ animationDelay: `${i * 15}ms`, animationFillMode: 'both' }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-3.5 text-ink hover:text-rose-600 transition-colors border-b border-ink/[0.06] focus-ring rounded"
                    >
                      {link.label}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40">
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
          </div>
        </>
      )}
    </header>
  );
}
