import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { Modal, ConfirmDialog } from '../../components/admin/Modal.jsx';
import { FormField, inputClass, Toast } from '../../components/admin/FormField.jsx';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import { listGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../data/api.js';
import { deleteImageFromCloudinary } from '../../lib/cloudinary.js';

const emptyForm = { title: '', caption: '', category: '', image: '', cloudinaryPublicId: '' };

export default function GalleryManager() {
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
      setItems(await listGallery());
    } catch {
      setLoadError('Could not load the gallery. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AdminLayout title="Gallery">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-faint">{items.length} images</p>
        <button
          onClick={() => setEditing('new')}
          className="rounded-full bg-rose-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-rose-700 focus-ring"
        >
          + Add Image
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 rounded-xl2 bg-white shadow-card animate-pulse" />
          ))}
        </div>
      ) : loadError ? (
        <div className="bg-white rounded-xl2 shadow-card p-14 text-center text-sm text-rose-600">{loadError}</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl2 shadow-card p-14 text-center">
          <p className="font-display text-lg text-ink font-semibold">No images yet</p>
          <p className="text-sm text-ink-faint mt-1 mb-5">Add your first gallery image.</p>
          <button
            onClick={() => setEditing('new')}
            className="rounded-full bg-rose-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-rose-700"
          >
            + Add Image
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl2 shadow-card overflow-hidden group">
              <div className="h-36 bg-cream-200">
                <img src={item.image} alt={item.title || 'Gallery image'} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <p className="font-medium text-ink text-sm truncate">{item.title || 'Untitled'}</p>
                {item.category && <p className="text-xs text-rose-600 mt-0.5">{item.category}</p>}
                <div className="flex justify-between mt-3">
                  <button onClick={() => setEditing(item)} className="text-xs font-medium text-rose-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => setDeleting(item)} className="text-xs font-medium text-ink-faint hover:text-rose-600">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <GalleryFormModal
          initial={editing === 'new' ? emptyForm : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await refresh();
            setToast({ message: 'Gallery item saved.', tone: 'success' });
          }}
          onError={(msg) => setToast({ message: msg, tone: 'error' })}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this image?"
          description={`"${deleting.title || 'This image'}" will be permanently removed.`}
          loading={deletingBusy}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            setDeletingBusy(true);
            try {
              await deleteGalleryItem(deleting.id);
              if (deleting.cloudinaryPublicId) {
                await deleteImageFromCloudinary(deleting.cloudinaryPublicId);
              }
              setDeleting(null);
              await refresh();
              setToast({ message: 'Image deleted.', tone: 'success' });
            } catch {
              setToast({ message: 'Could not delete the image. Please try again.', tone: 'error' });
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

function GalleryFormModal({ initial, onClose, onSaved, onError }) {
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
    if (!form.image) errs.image = 'An image is required.';
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
        await createGalleryItem(form);
      } else {
        await updateGalleryItem(form.id, form);
      }
      if (previousPublicId && form.cloudinaryPublicId && previousPublicId !== form.cloudinaryPublicId) {
        await deleteImageFromCloudinary(previousPublicId);
      }
      onSaved();
    } catch (err) {
      onError(err.message || 'Could not save the image. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={isNew ? 'Add Image' : 'Edit Image'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Image" error={errors.image}>
          <ImageUploader
            value={form.image}
            folder="shewings/gallery"
            onUploadingChange={setImageUploading}
            onUploaded={({ url, publicId }) =>
              setForm((f) => ({ ...f, image: url, cloudinaryPublicId: publicId }))
            }
          />
        </FormField>
        <FormField label="Title (optional)">
          <input value={form.title} onChange={update('title')} className={inputClass()} />
        </FormField>
        <FormField label="Caption (optional)">
          <input value={form.caption} onChange={update('caption')} className={inputClass()} />
        </FormField>
        <FormField label="Category (optional)">
          <input value={form.category} onChange={update('category')} className={inputClass()} placeholder="Community, Events…" />
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full text-sm font-medium text-ink-soft hover:bg-cream-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || imageUploading}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : imageUploading ? 'Waiting for upload…' : 'Save Image'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
