import React, { useEffect } from 'react';
import { Button } from '../ui/Primitives.jsx';
import { getOptimizedImageUrl } from '../../lib/imageUrl.js';

export default function EventModal({ event, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!event) return null;

  const dateLabel = new Date(`${event.date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fadeUp"
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-xl2 bg-white shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 sm:h-72 bg-cream-200">
          <img src={getOptimizedImageUrl(event.image, 1400)} alt={event.title} className="h-full w-full object-cover" />
          <button
            onClick={onClose}
            aria-label="Close event details"
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center text-ink focus-ring hover:bg-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="p-6 sm:p-8 flex flex-col gap-4">
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink">{event.title}</h3>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
            <span className="flex items-center gap-2">
              <CalIcon /> {dateLabel}
            </span>
            <span className="flex items-center gap-2">
              <ClockIcon /> {event.time}
            </span>
            <span className="flex items-center gap-2">
              <PinIcon /> {event.location}
            </span>
          </div>

          <p className="text-ink-soft leading-relaxed whitespace-pre-line">{event.description}</p>

          {event.registrationLink ? (
            <Button
              as="a"
              href={event.registrationLink}
              target="_blank"
              rel="noreferrer"
              variant="primary"
              className="self-start mt-2"
            >
              Register Now
            </Button>
          ) : (
            <Button as="a" href="#join" variant="secondary" className="self-start mt-2" onClick={onClose}>
              Enquire to Join
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function CalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="6" width="16" height="14" rx="1.5" />
      <path d="M4 10h16M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}
