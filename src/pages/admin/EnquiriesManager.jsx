import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { Modal } from '../../components/admin/Modal.jsx';
import { Toast } from '../../components/admin/FormField.jsx';
import { listEnquiries, updateEnquiryStatus } from '../../data/api.js';

const STATUSES = ['New', 'Contacted', 'In Progress', 'Completed'];

const STATUS_TONE = {
  New: 'bg-rose-100 text-rose-700',
  Contacted: 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
};

export default function EnquiriesManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [active, setActive] = useState(null);
  const [toast, setToast] = useState({ message: '', tone: 'success' });

  async function refresh() {
    setLoading(true);
    setLoadError('');
    try {
      setItems(await listEnquiries());
    } catch {
      setLoadError('Could not load enquiries. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((e) => {
      const matchesQuery =
        !query.trim() ||
        [e.name, e.email, e.profession].some((f) => f?.toLowerCase().includes(query.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [items, query, statusFilter]);

  async function handleStatusChange(id, status) {
    try {
      await updateEnquiryStatus(id, status);
      setItems((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
      if (active?.id === id) setActive((a) => ({ ...a, status }));
      setToast({ message: 'Status updated.', tone: 'success' });
    } catch {
      setToast({ message: 'Could not update the status. Please try again.', tone: 'error' });
    }
  }

  return (
    <AdminLayout title="Enquiries">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or profession…"
          className="flex-1 rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm focus-ring focus:border-rose-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm focus-ring"
        >
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl2 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-ink-faint text-sm">Loading enquiries…</div>
        ) : loadError ? (
          <div className="p-14 text-center text-sm text-rose-600">{loadError}</div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center">
            <p className="font-display text-lg text-ink font-semibold">
              {items.length === 0 ? 'No enquiries yet' : 'No matching enquiries'}
            </p>
            <p className="text-sm text-ink-faint mt-1">
              {items.length === 0
                ? 'Submissions from the Join Shewings form will appear here.'
                : 'Try a different search or filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-ink-faint border-b border-ink/5">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Profession</th>
                  <th className="px-5 py-3 font-medium">Submitted</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => setActive(e)}
                    className="border-b border-ink/5 last:border-0 hover:bg-cream-50 cursor-pointer"
                  >
                    <td className="px-5 py-3 font-medium text-ink">{e.name}</td>
                    <td className="px-5 py-3 text-ink-soft">{e.email}</td>
                    <td className="px-5 py-3 text-ink-soft">{e.profession || '—'}</td>
                    <td className="px-5 py-3 text-ink-faint whitespace-nowrap">
                      {new Date(e.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_TONE[e.status]}`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {active && (
        <Modal title="Enquiry Details" onClose={() => setActive(null)}>
          <div className="flex flex-col gap-4">
            <DetailRow label="Name" value={active.name} />
            <DetailRow label="Email" value={active.email} />
            <DetailRow label="Phone" value={active.phone} />
            <DetailRow label="Location" value={active.location || '—'} />
            <DetailRow label="Profession" value={active.profession || '—'} />
            <DetailRow label="Reason for Joining" value={active.reason || '—'} />
            <DetailRow label="Message" value={active.message || '—'} />
            <DetailRow label="Submitted" value={new Date(active.submittedAt).toLocaleString()} />

            <div>
              <p className="text-xs uppercase tracking-wide text-ink-faint mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(active.id, s)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      active.status === s
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'border-ink/10 text-ink-soft hover:border-rose-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast({ message: '', tone: 'success' })} />
    </AdminLayout>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="text-sm text-ink mt-0.5">{value}</p>
    </div>
  );
}
