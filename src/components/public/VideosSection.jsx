import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { listVideos, extractYouTubeId } from '../../data/api.js';
import { SectionHeading, CardSkeleton } from '../ui/Primitives.jsx';
import useParallax from '../../hooks/useParallax.js';

export default function VideosSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const sectionRef = useRef(null);

  // Cinematic non-uniform drift speeds per §3: card 0 at 0.92, card 1 at 0.96
  const { y: card0Y } = useParallax({ speed: 0.92, distance: 30, targetRef: sectionRef });
  const { y: card1Y } = useParallax({ speed: 0.96, distance: 22, targetRef: sectionRef });

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
    <section ref={sectionRef} id="videos" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <SectionHeading
          eyebrow="Videos"
          title="Watch Shewins in motion."
          align="center"
        />

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-6 mt-14">
            {[...Array(2)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6 mt-14 items-start">
            {videos.map((v, i) => {
              const motionY = i === 0 ? card0Y : card1Y;
              return (
                <motion.div
                  key={v.id}
                  style={{ y: motionY }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4 }}
                  className="group rounded-xl2 overflow-hidden bg-white shadow-card hover:shadow-soft transition-all duration-300 border border-transparent hover:border-pink-100"
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
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
