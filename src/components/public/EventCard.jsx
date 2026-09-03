import React from 'react';
import { getOptimizedImageUrl, publicImageLoading } from '../../lib/imageUrl.js';

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function EventCard({ event, onOpen }) {
  return (
    <button
      onClick={() => onOpen(event)}
      className="group text-left rounded-xl2 bg-white shadow-card hover:shadow-soft hover:-translate-y-2 hover:scale-[1.01] transition-all duration-300 overflow-hidden focus-ring flex flex-col border border-transparent hover:border-pink-200/70 cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden bg-cream-200">
        <img
          src={getOptimizedImageUrl(event.image, 1000)}
          alt={event.title}
          loading={publicImageLoading}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center leading-none shadow-sm">
          <span className="block text-[10px] uppercase tracking-wide text-rose-600 font-semibold">
            {new Date(`${event.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className="block text-lg font-display font-semibold text-ink">
            {new Date(`${event.date}T00:00:00`).getDate()}
          </span>
        </span>
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-display text-lg font-semibold text-ink leading-snug group-hover:text-rose-600 transition-colors duration-200">
          {event.title}
        </h3>
        <p className="text-sm text-ink-faint line-clamp-2 leading-relaxed">{event.description}</p>
        <div className="flex flex-col gap-1 mt-auto pt-3 text-xs text-ink-faint">
          <span className="flex items-center gap-1.5">
            <ClockIcon /> {formatDate(event.date)} · {event.time}
          </span>
          <span className="flex items-center gap-1.5">
            <PinIcon /> {event.location}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 mt-2">
          View Details
          <span className="transform group-hover:translate-x-1.5 transition-transform duration-200 ease-out">
            →
          </span>
        </span>
      </div>
    </button>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}
