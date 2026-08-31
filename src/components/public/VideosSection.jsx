import React, { useEffect, useState } from 'react';
import { listVideos, extractYouTubeId } from '../../data/api.js';
import { SectionHeading, CardSkeleton } from '../ui/Primitives.jsx';
import useReveal from '../../hooks/useReveal.js';

export default function VideosSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const ref = useReveal();

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

  // No videos, or the fetch failed: this section is optional on the public
  // page, so fail quietly rather than showing an error block.
  if (!loading && (videos.length === 0 || error)) return null;

  return (
    <section id="videos" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <SectionHeading eyebrow="Videos" title="Watch Shewins in motion." align="center" />

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-6 mt-14">
            {[...Array(2)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div ref={ref} className="reveal grid sm:grid-cols-2 gap-6 mt-14">
            {videos.map((v) => (
              <div key={v.id} className="rounded-xl2 overflow-hidden bg-white shadow-card">
                <div className="aspect-video bg-cream-200">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(v.youtubeUrl)}`}
                    title={v.title}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-ink">{v.title}</h3>
                  {v.description && (
                    <p className="text-sm text-ink-faint mt-1.5 line-clamp-2">{v.description}</p>
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
