import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { listEvents, listGallery, listVideos, listEnquiries } from '../../data/api.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [events, gallery, videos, enquiries] = await Promise.all([
          listEvents(),
          listGallery(),
          listVideos(),
          listEnquiries(),
        ]);
        const published = events.filter((e) => e.status === 'published');
        const draft = events.filter((e) => e.status === 'draft');
        const newEnquiries = enquiries.filter((e) => e.status === 'New');

        setStats({
          totalEvents: events.length,
          publishedEvents: published.length,
          draftEvents: draft.length,
          gallery: gallery.length,
          videos: videos.length,
          newEnquiries: newEnquiries.length,
        });
        setRecentEnquiries(enquiries.slice(0, 5));
      } catch {
        setError('Could not load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = stats
    ? [
        { label: 'Total Events', value: stats.totalEvents, to: '/admin/events', tone: 'rose' },
        { label: 'Published Events', value: stats.publishedEvents, to: '/admin/events', tone: 'cream' },
        { label: 'Draft Events', value: stats.draftEvents, to: '/admin/events', tone: 'cream' },
        { label: 'Gallery Images', value: stats.gallery, to: '/admin/gallery', tone: 'cream' },
        { label: 'Videos', value: stats.videos, to: '/admin/videos', tone: 'cream' },
        { label: 'New Enquiries', value: stats.newEnquiries, to: '/admin/enquiries', tone: 'rose' },
      ]
    : [];

  return (
    <AdminLayout title="Dashboard">
      {error && (
        <div className="mb-6 rounded-xl2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-5 py-4">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl2 p-5 bg-white shadow-card animate-pulse h-24" />
            ))
          : cards.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                className={`rounded-xl2 p-5 shadow-card hover:shadow-soft hover:-translate-y-0.5 transition-all ${
                  c.tone === 'rose' ? 'bg-rose-600 text-white' : 'bg-white text-ink'
                }`}
              >
                <p className={`text-xs uppercase tracking-wide ${c.tone === 'rose' ? 'text-white/70' : 'text-ink-faint'}`}>
                  {c.label}
                </p>
                <p className="font-display text-3xl font-semibold mt-2">{c.value}</p>
              </Link>
            ))}
      </div>

      {!loading && !error && (
        <div className="mt-10 bg-white rounded-xl2 shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-ink">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="text-sm text-rose-600 font-medium hover:underline">
              View all →
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <p className="text-sm text-ink-faint py-8 text-center">No enquiries submitted yet.</p>
          ) : (
            <ul className="divide-y divide-ink/5">
              {recentEnquiries.map((e) => (
                <li key={e.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{e.name}</p>
                    <p className="text-xs text-ink-faint truncate">{e.email}</p>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-cream-100 text-ink-soft whitespace-nowrap">
                    {e.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
