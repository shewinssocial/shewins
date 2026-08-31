import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { Modal, ConfirmDialog } from '../../components/admin/Modal.jsx';
import { FormField, inputClass, Toast } from '../../components/admin/FormField.jsx';
import {
  listVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  isValidYouTubeUrl,
  extractYouTubeId,
} from '../../data/api.js';

const emptyForm = { title: '', description: '', youtubeUrl: '' };

export default function VideosManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [toast, setToast] = useState({ message: '', tone: 'success' });

  async function refresh() {
    setLoading(true);
    setLoadError('');
    try {
      setItems(await listVideos());
    } catch {
      setLoadError('Could not load videos. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AdminLayout title="Videos">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-faint">{items.length} videos</p>
        <button
          onClick={() => setEditing('new')}
          className="rounded-full bg-rose-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-rose-700 focus-ring"
        >
          + Add Video
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-52 rounded-xl2 bg-white shadow-card animate-pulse" />
          ))}
        </div>
      ) : loadError ? (
        <div className="bg-white rounded-xl2 shadow-card p-14 text-center text-sm text-rose-600">{loadError}</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl2 shadow-card p-14 text-center">
          <p className="font-display text-lg text-ink font-semibold">No videos yet</p>
          <p className="text-sm text-ink-faint mt-1 mb-5">Add a YouTube video to feature it on the site.</p>
          <button
            onClick={() => setEditing('new')}
            className="rounded-full bg-rose-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-rose-700"
          >
            + Add Video
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((v) => {
            const ytId = extractYouTubeId(v.youtubeUrl);
            return (
              <div key={v.id} className="bg-white rounded-xl2 shadow-card overflow-hidden">
                <div className="aspect-video bg-cream-200">
                  {ytId && (
                    <img
                      src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                      alt={v.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-medium text-ink text-sm truncate">{v.title}</p>
                  <p className="text-xs text-ink-faint mt-1 line-clamp-2">{v.description}</p>
                  <div className="flex justify-between mt-3">
                    <button onClick={() => setEditing(v)} className="text-xs font-medium text-rose-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => setDeleting(v)} className="text-xs font-medium text-ink-faint hover:text-rose-600">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <VideoFormModal
          initial={editing === 'new' ? emptyForm : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await refresh();
            setToast({ message: 'Video saved.', tone: 'success' });
          }}
          onError={(msg) => setToast({ message: msg, tone: 'error' })}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this video?"
          description={`"${deleting.title}" will be permanently removed.`}
          loading={deletingBusy}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            setDeletingBusy(true);
            try {
              await deleteVideo(deleting.id);
              setDeleting(null);
              await refresh();
              setToast({ message: 'Video deleted.', tone: 'success' });
            } catch {
              setToast({ message: 'Could not delete the video. Please try again.', tone: 'error' });
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

function VideoFormModal({ initial, onClose, onSaved, onError }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const isNew = !initial.id;

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.youtubeUrl.trim()) {
      errs.youtubeUrl = 'YouTube URL is required.';
    } else if (!isValidYouTubeUrl(form.youtubeUrl)) {
      errs.youtubeUrl = 'Enter a valid YouTube video URL.';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    try {
      if (isNew) {
        await createVideo(form);
      } else {
        await updateVideo(form.id, form);
      }
      onSaved();
    } catch (err) {
      onError(err.message || 'Could not save the video. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={isNew ? 'Add Video' : 'Edit Video'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="YouTube URL" error={errors.youtubeUrl} hint="e.g. https://youtube.com/watch?v=…">
          <input value={form.youtubeUrl} onChange={update('youtubeUrl')} className={inputClass(errors.youtubeUrl)} />
        </FormField>
        <FormField label="Title" error={errors.title}>
          <input value={form.title} onChange={update('title')} className={inputClass(errors.title)} />
        </FormField>
        <FormField label="Description (optional)">
          <textarea value={form.description} onChange={update('description')} rows={3} className={inputClass()} />
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full text-sm font-medium text-ink-soft hover:bg-cream-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Video'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
