import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { listPublicEvents } from '../../data/api.js';
import { SectionHeading, CardSkeleton } from '../ui/Primitives.jsx';
import EventCard from './EventCard.jsx';
import EventModal from './EventModal.jsx';

function isUpcoming(event) {
  if (!event || !event.date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${event.date}T00:00:00`) >= today;
}

export default function EventsSection() {
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let mounted = true;
    listPublicEvents()
      .then((events) => {
        if (!mounted) return;
        setUpcoming((events || []).filter(isUpcoming));
      })
      .catch(() => {
        if (mounted) setUpcoming([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // If there are no upcoming events posted by the admin, do not render the section at all
  if (!loading && upcoming.length === 0) {
    return null;
  }

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
        ) : (
          <>
            <SectionHeading
              eyebrow="Upcoming Events"
              title="Join us at what's coming next."
              description="Programs, workshops, and meetups happening across the Shewins community."
              align="center"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14"
            >
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} onOpen={setActive} />
              ))}
            </motion.div>
          </>
        )}
      </div>

      {active && <EventModal event={active} onClose={() => setActive(null)} />}
    </section>
  );
}
