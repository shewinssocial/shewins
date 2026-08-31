import React, { useEffect, useState } from 'react';
import { listGallery } from '../../data/api.js';
import { SectionHeading, EmptyState } from '../ui/Primitives.jsx';
import useReveal from '../../hooks/useReveal.js';

export default function GallerySection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState(null);
  const ref = useReveal();

  useEffect(() => {
    let mounted = true;
    listGallery()
      .then((data) => {
        if (!mounted) return;
        setItems(data);
      })
      .catch(() => {
        if (mounted) setError('We couldn\u2019t load the gallery right now.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setLightbox(null);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-white/60">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="What Shewins looks like, in pictures."
          align="center"
        />

        {loading ? (
          <div className="columns-2 sm:columns-3 gap-4 mt-14 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl2 bg-cream-200 animate-pulse break-inside-avoid"
                style={{ height: `${180 + (i % 3) * 60}px` }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-14">
            <EmptyState title="  Pictures are Not  added" description={error} />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-14">
            <EmptyState
              title="The gallery is warming up"
              description="Photos from our next gathering will appear here."
            />
          </div>
        ) : (
          <div ref={ref} className="reveal columns-2 sm:columns-3 gap-4 mt-14 space-y-4">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setLightbox(item)}
                className="group relative block w-full break-inside-avoid rounded-xl2 overflow-hidden shadow-card focus-ring"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-left">
                    <p className="text-white font-display text-sm font-semibold">{item.title}</p>
                    {item.caption && <p className="text-white/80 text-xs mt-0.5">{item.caption}</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeUp"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 focus-ring"
            onClick={() => setLightbox(null)}
            aria-label="Close preview"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.image}
              alt={lightbox.title}
              className="w-full max-h-[75vh] object-contain rounded-xl2"
            />
            <div className="text-center mt-4">
              <p className="text-white font-display text-lg font-semibold">{lightbox.title}</p>
              {lightbox.caption && <p className="text-white/70 text-sm mt-1">{lightbox.caption}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
