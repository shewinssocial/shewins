import React, { useEffect, useState } from 'react';
import { listPublicEvents, listGallery, listVideos, extractYouTubeId } from '../../data/api.js';
import { SectionHeading, CardSkeleton, EmptyState } from '../ui/Primitives.jsx';
import EventCard from './EventCard.jsx';
import EventModal from './EventModal.jsx';
import useReveal from '../../hooks/useReveal.js';

// Draft events are never fetched by the public site (see listPublicEvents /
// RLS policy "Public can read published events") — this only needs to
// filter published events down to ones that haven't passed yet.
function isUpcoming(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${event.date}T00:00:00`) >= today;
}

export default function EventsSection() {
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState([]);
  const [moments, setMoments] = useState({ images: [], videos: [] });
  const [active, setActive] = useState(null);
  const [error, setError] = useState('');
  const ref = useReveal();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const events = await listPublicEvents();
        const upcomingEvents = events.filter(isUpcoming);
        if (!mounted) return;

        if (upcomingEvents.length > 0) {
          setUpcoming(upcomingEvents);
        } else {
          const [images, videos] = await Promise.all([listGallery(), listVideos()]);
          if (!mounted) return;
          setMoments({ images: images.slice(0, 4), videos: videos.slice(0, 2) });
        }
      } catch {
        if (mounted) setError('We couldn\u2019t load events right now. Please refresh and try again.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="events" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {loading ? (
          <>
            <SectionHeading eyebrow="Upcoming Events" title="Loading what's coming up…" align="center" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
              {[...Array(3)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : error ? (
          <EmptyState title="No upcoming events" description={error} />
        ) : upcoming.length > 0 ? (
          <>
            <SectionHeading
              eyebrow="Upcoming Events"
              title="Join us at what's coming next."
              description="Programs, workshops, and meetups happening across the Shewins community."
              align="center"
            />
            <div ref={ref} className="reveal grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} onOpen={setActive} />
              ))}
            </div>
          </>
        ) : (
          <MomentsFallback images={moments.images} videos={moments.videos} />
        )}
      </div>

      {active && <EventModal event={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function MomentsFallback({ images, videos }) {
  const ref = useReveal();
  const hasContent = images.length > 0 || videos.length > 0;

  return (
    <div ref={ref} className="reveal">
      <SectionHeading
        eyebrow="Moments from Shewins"
        title="While we're preparing for our next event, take a look back."
        description="Explore some moments from our community — photos and videos from the gatherings that came before."
        align="center"
      />

      {!hasContent ? (
        <div className="mt-14">
          <EmptyState
            title="New events are on the way"
            description="We're planning our next gathering — check back soon or join to be the first to hear."
          />
        </div>
      ) : (
        <div className="mt-14 grid md:grid-cols-2 gap-8">
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {images.map((img) => (
                <div key={img.id} className="rounded-xl2 overflow-hidden shadow-card aspect-square">
                  <img
                    src={img.image}
                    alt={img.title}
                    loading="lazy"
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          )}
          {videos.length > 0 && (
            <div className="flex flex-col gap-4">
              {videos.map((v) => (
                <div key={v.id} className="rounded-xl2 overflow-hidden shadow-card aspect-video">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(v.youtubeUrl)}`}
                    title={v.title}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
