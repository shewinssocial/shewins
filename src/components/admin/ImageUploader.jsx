import React, { useRef, useState } from 'react';
import { uploadImageToCloudinary, validateImageFile } from '../../lib/cloudinary.js';

/**
 * File-upload control backed by Cloudinary. Renders a preview (existing
 * image, or a local object-URL while a new one uploads), a progress bar
 * during upload, and a Choose/Replace button. Calls onChange({ url,
 * publicId }) once the upload succeeds — the parent form only ever stores
 * the resulting Cloudinary URL + public ID, never a raw file.
 */
export default function ImageUploader({ value, onUploaded, onUploadingChange, error, folder = 'shewings' }) {
  const inputRef = useRef(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    const invalidReason = validateImageFile(file);
    if (invalidReason) {
      setUploadError(invalidReason);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploadError('');
    setUploading(true);
    onUploadingChange?.(true);
    setProgress(0);

    try {
      const result = await uploadImageToCloudinary(file, { folder, onProgress: setProgress });
      onUploaded({ url: result.url, publicId: result.publicId });
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      URL.revokeObjectURL(objectUrl);
      setLocalPreview(null);
    }
  }

  const previewSrc = localPreview || value || null;

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`relative rounded-xl border-2 border-dashed overflow-hidden bg-cream-50 flex items-center justify-center h-44 ${
          error ? 'border-rose-500' : 'border-ink/15'
        }`}
      >
        {previewSrc ? (
          <img
            src={previewSrc}
            alt="Preview"
            className={`h-full w-full object-cover ${uploading ? 'opacity-50' : ''}`}
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-ink-faint text-sm px-4 text-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10" r="1.5" />
              <path d="M21 15l-5-5-4 4-2-2-5 5" />
            </svg>
            No image selected
          </div>
        )}

        {uploading && (
          <div className="absolute inset-x-3 bottom-3 bg-white/90 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-rose-600 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-sm font-medium text-rose-600 hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? `Uploading… ${progress}%` : previewSrc ? 'Replace Image' : 'Choose Image'}
        </button>
        <span className="text-xs text-ink-faint">JPG, PNG, WEBP or GIF — up to 8MB</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="hidden"
      />

      {(uploadError || error) && <p className="text-xs text-rose-600">{uploadError || error}</p>}
    </div>
  );
}
