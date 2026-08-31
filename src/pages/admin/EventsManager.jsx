import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { Modal, ConfirmDialog } from '../../components/admin/Modal.jsx';
import { FormField, inputClass, Toast } from '../../components/admin/FormField.jsx';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import { listEvents, createEvent, updateEvent, deleteEvent } from '../../data/api.js';
import { deleteImageFromCloudinary } from '../../lib/cloudinary.js';

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  image: '',
  cloudinaryPublicId: '',
  registrationLink: '',
  status: 'draft',
};

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState(null); // 'new' | event object | null
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [toast, setToast] = useState({ message: '', tone: 'success' });

  async function refresh() {
    setLoading(true);
    setLoadError('');
    try {
      setEvents(await listEvents());
    } catch {
      setLoadError('Could not load events. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AdminLayout title="Events">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-faint">{events.length} total events</p>
        <button
          onClick={() => setEditing('new')}
          className="rounded-full bg-rose-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-rose-700 focus-ring"
        >
          + New Event
        </button>
      </div>

      <div className="bg-white rounded-xl2 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-ink-faint text-sm">Loading events…</div>
        ) : loadError ? (
          <div className="p-14 text-center text-sm text-rose-600">{loadError}</div>
        ) : events.length === 0 ? (
          <div className="p-14 text-center">
            <p className="font-display text-lg text-ink font-semibold">No events yet</p>
            <p className="text-sm text-ink-faint mt-1 mb-5">Create your first event to see it here.</p>
            <button
              onClick={() => setEditing('new')}
              className="rounded-full bg-rose-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-rose-700"
            >
              + New Event
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-ink-faint border-b border-ink/5">
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-b border-ink/5 last:border-0 hover:bg-cream-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={e.image} alt="" className="h-10 w-10 rounded-lg object-cover bg-cream-200" />
                        <span className="font-medium text-ink line-clamp-1 max-w-[220px]">{e.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-soft whitespace-nowrap">
                      {e.date} · {e.time}
                    </td>
                    <td className="px-5 py-3 text-ink-soft max-w-[160px] truncate">{e.location}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button onClick={() => setEditing(e)} className="text-rose-600 font-medium hover:underline mr-4">
                        Edit
                      </button>
                      <button onClick={() => setDeleting(e)} className="text-ink-faint font-medium hover:text-rose-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <EventFormModal
          initial={editing === 'new' ? emptyForm : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await refresh();
            setToast({ message: 'Event saved.', tone: 'success' });
          }}
          onError={(msg) => setToast({ message: msg, tone: 'error' })}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this event?"
          description={`"${deleting.title}" will be permanently removed, including its image.`}
          loading={deletingBusy}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            setDeletingBusy(true);
            try {
              await deleteEvent(deleting.id);
              if (deleting.cloudinaryPublicId) {
                await deleteImageFromCloudinary(deleting.cloudinaryPublicId);
              }
              setDeleting(null);
              await refresh();
              setToast({ message: 'Event deleted.', tone: 'success' });
            } catch {
              setToast({ message: 'Could not delete the event. Please try again.', tone: 'error' });
            } finally {
              setDeletingBusy(false);
            }
          }}
        />
      )}

      <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast({ message: '', tone: 'success' })} />
    </AdminLayout>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide ${
        status === 'published' ? 'bg-rose-100 text-rose-700' : 'bg-cream-200 text-ink-faint'
      }`}
    >
      {status === 'published' ? 'PUBLISHED' : 'DRAFT'}
    </span>
  );
}

function EventFormModal({ initial, onClose, onSaved, onError }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const isNew = !initial.id;
  const previousPublicId = initial.cloudinaryPublicId;

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.date) errs.date = 'Date is required.';
    if (!form.time.trim()) errs.time = 'Time is required.';
    if (!form.location.trim()) errs.location = 'Location is required.';
    if (!form.image) errs.image = 'An event image is required.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (imageUploading) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      if (isNew) {
        await createEvent(form);
      } else {
        await updateEvent(form.id, form);
      }
      // Image was replaced during this edit — clean up the old Cloudinary
      // asset now that the new one is safely saved.
      if (previousPublicId && form.cloudinaryPublicId && previousPublicId !== form.cloudinaryPublicId) {
        await deleteImageFromCloudinary(previousPublicId);
      }
      onSaved();
    } catch (err) {
      onError(err.message || 'Could not save the event. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={isNew ? 'New Event' : 'Edit Event'} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
        <FormField label="Event Image" error={errors.image} className="sm:col-span-2">
          <ImageUploader
            value={form.image}
            folder="shewings/events"
            onUploadingChange={setImageUploading}
            onUploaded={({ url, publicId }) =>
              setForm((f) => ({ ...f, image: url, cloudinaryPublicId: publicId }))
            }
          />
        </FormField>
        <FormField label="Title" error={errors.title} className="sm:col-span-2">
          <input value={form.title} onChange={update('title')} className={inputClass(errors.title)} />
        </FormField>
        <FormField label="Description (optional)" error={errors.description} className="sm:col-span-2">
          <textarea
            value={form.description}
            onChange={update('description')}
            rows={3}
            className={inputClass(errors.description)}
          />
        </FormField>
        <FormField label="Date" error={errors.date}>
          <input type="date" value={form.date} onChange={update('date')} className={inputClass(errors.date)} />
        </FormField>
        <FormField label="Time" error={errors.time}>
          <input
            value={form.time}
            onChange={update('time')}
            placeholder="6:00 PM"
            className={inputClass(errors.time)}
          />
        </FormField>
        <FormField label="Location" error={errors.location} className="sm:col-span-2">
          <input value={form.location} onChange={update('location')} className={inputClass(errors.location)} />
        </FormField>
        <FormField label="Registration Link (optional)" className="sm:col-span-2">
          <input value={form.registrationLink} onChange={update('registrationLink')} className={inputClass()} />
        </FormField>
        <FormField label="Status" className="sm:col-span-2" hint="Draft events are never shown on the public site.">
          <select value={form.status} onChange={update('status')} className={inputClass()}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </FormField>

        <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full text-sm font-medium text-ink-soft hover:bg-cream-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || imageUploading}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : imageUploading ? 'Waiting for upload…' : 'Save Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
