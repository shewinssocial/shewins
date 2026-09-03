import React, { useEffect, useState } from 'react';
import { listGallery } from '../../data/api.js';
import { SectionHeading, EmptyState } from '../ui/Primitives.jsx';
import { getOptimizedImageUrl } from '../../lib/imageUrl.js';

export default function GallerySection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let mounted = true;
    listGallery()
      .then((data) => {
        if (!mounted) return;
        setItems(data || []);
      })
      .catch((err) => {
        console.error('Gallery fetch error:', err);
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
    <section id="gallery" className="py-16 sm:py-24 bg-white/60 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="What Shewins looks like, in pictures."
          align="center"
          wordReveal={true}
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
            <EmptyState title="Pictures are Not added" description={error} />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-14">
            <EmptyState
              title="The gallery is warming up"
              description="Photos from our next gathering will appear here."
            />
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 gap-4 mt-14 space-y-4">
            {items.map((item) => {
              const displayUrl = getOptimizedImageUrl(item.image, 1000) || item.image;
              return (
                <button
                  key={item.id}
                  onClick={() => setLightbox(item)}
                  className="group relative block w-full break-inside-avoid rounded-xl2 overflow-hidden shadow-card hover:shadow-soft focus-ring cursor-pointer text-left transition-all duration-300 bg-cream-200"
                >
                  <div className="relative overflow-hidden min-h-[140px] bg-cream-200">
                    <img
                      src={displayUrl}
                      onError={(e) => {
                        if (item.image && e.currentTarget.src !== item.image) {
                          e.currentTarget.src = item.image;
                        }
                      }}
                      alt={item.title || 'Shewins gallery image'}
                      loading="eager"
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-5">
                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                        {item.title && (
                          <p className="text-white font-display text-sm font-semibold tracking-wide">
                            {item.title}
                          </p>
                        )}
                        {item.caption && (
                          <p className="text-white/80 text-xs mt-1 leading-snug">{item.caption}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Editorial Lightbox with Smooth Scale & Backdrop Blur */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-ink/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeUp"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 sm:top-7 sm:right-7 h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/25 hover:scale-105 active:scale-95 transition-all duration-200 focus-ring cursor-pointer z-10"
            onClick={() => setLightbox(null)}
            aria-label="Close preview"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative rounded-xl2 overflow-hidden shadow-2xl bg-ink/40">
              <img
                src={getOptimizedImageUrl(lightbox.image, 1600) || lightbox.image}
                onError={(e) => {
                  if (lightbox.image && e.currentTarget.src !== lightbox.image) {
                    e.currentTarget.src = lightbox.image;
                  }
                }}
                alt={lightbox.title || 'Preview'}
                className="w-full max-h-[78vh] object-contain mx-auto"
              />
            </div>
            <div className="text-center mt-4">
              {lightbox.title && (
                <p className="text-white font-display text-lg sm:text-xl font-semibold tracking-wide">
                  {lightbox.title}
                </p>
              )}
              {lightbox.caption && (
                <p className="text-white/70 text-sm mt-1 max-w-md mx-auto leading-relaxed">
                  {lightbox.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
