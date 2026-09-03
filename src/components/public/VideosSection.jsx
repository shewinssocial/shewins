import React, { useEffect, useState } from 'react';
import { listVideos, extractYouTubeId } from '../../data/api.js';
import { SectionHeading, CardSkeleton } from '../ui/Primitives.jsx';
import useReveal from '../../hooks/useReveal.js';

export default function VideosSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const ref = useReveal({ variant: 'fade-up', staggerChildren: true });

  useEffect(() => {
    let mounted = true;
    listVideos()
      .then((data) => {
        if (mounted) setVideos(data);
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!loading && (videos.length === 0 || error)) return null;

  return (
    <section id="videos" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <SectionHeading
          eyebrow="Videos"
          title="Watch Shewins in motion."
          align="center"
          wordReveal={true}
        />

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-6 mt-14">
            {[...Array(2)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div ref={ref} className="reveal-fade-up grid sm:grid-cols-2 gap-6 mt-14">
            {videos.map((v, i) => (
              <div
                key={v.id}
                className={`group rounded-xl2 overflow-hidden bg-white shadow-card hover:shadow-soft hover:-translate-y-1.5 transition-all duration-400 border border-transparent hover:border-pink-100 stagger-${(i % 2) + 1}`}
              >
                <div className="aspect-video bg-cream-200 relative overflow-hidden">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(v.youtubeUrl)}`}
                    title={v.title}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-ink group-hover:text-pink-600 transition-colors duration-200">
                    {v.title}
                  </h3>
                  {v.description && (
                    <p className="text-sm text-ink-faint mt-1.5 line-clamp-2 leading-relaxed">
                      {v.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
