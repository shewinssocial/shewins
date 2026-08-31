import { supabase } from './supabaseClient.js';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const MAX_FILE_SIZE_MB = 50;
const CLOUDINARY_MAX_FILE_SIZE = 10 * 1024 * 1024;
const TARGET_UPLOAD_SIZE = 8.5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function validateImageFile(file) {
  if (!file) return 'Please choose an image.';
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Please upload a JPG, PNG, WEBP, or GIF image.';
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`;
  }
  return null;
}

async function compressImageForUpload(file) {
  if (file.size <= CLOUDINARY_MAX_FILE_SIZE) return file;
  if (file.type === 'image/gif') {
    throw new Error('GIF images larger than 10MB cannot be compressed automatically. Please choose a smaller GIF.');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();

    const canvas = document.createElement('canvas');
    let scale = Math.min(1, Math.sqrt(TARGET_UPLOAD_SIZE / file.size));
    let blob = null;

    for (let attempt = 0; attempt < 4; attempt += 1) {
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.78));
      if (blob && blob.size <= TARGET_UPLOAD_SIZE) break;
      scale *= 0.75;
    }

    if (!blob || blob.size > CLOUDINARY_MAX_FILE_SIZE) {
      throw new Error('This image could not be compressed below the 10MB upload limit. Please choose a smaller image.');
    }

    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Uploads an image file directly from the browser to Cloudinary using an
 * unsigned upload preset (no API secret ever touches the frontend). Reports
 * progress via onProgress(percent) using XHR, since fetch() can't report
 * upload progress.
 *
 * Returns { url, publicId, width, height } on success.
 */
export function uploadImageToCloudinary(file, { folder = 'shewings', onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const invalidReason = validateImageFile(file);
    if (invalidReason) {
      reject(new Error(invalidReason));
      return;
    }
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(
        new Error(
          'Image upload is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.local, then restart the app.'
        )
      );
      return;
    }

    compressImageForUpload(file)
      .then((uploadFile) => {
        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', folder);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({
                url: data.secure_url,
                publicId: data.public_id,
                width: data.width,
                height: data.height,
              });
            } else {
              const cloudinaryMessage = data?.error?.message || data?.error?.description || '';
              const presetMessage =
                cloudinaryMessage.toLowerCase().includes('upload preset') ||
                cloudinaryMessage.toLowerCase().includes('preset');

              reject(
                new Error(
                  xhr.status === 400 && presetMessage
                    ? 'Cloudinary upload preset is invalid or not set to Unsigned. Open Cloudinary → Settings → Upload → Upload presets and create a valid unsigned preset, then update VITE_CLOUDINARY_UPLOAD_PRESET in .env.local.'
                    : cloudinaryMessage || 'Image upload failed. Please try again.'
                )
              );
            }
          } catch {
            reject(new Error('Image upload failed. Please try again.'));
          }
        };

        xhr.onerror = () => reject(new Error('Image upload failed — check your connection and try again.'));
        xhr.send(formData);
      })
      .catch(reject);
  });
}

/**
 * Deletes a Cloudinary asset by public_id. Cloudinary deletion requires the
 * API secret, which must never live in the frontend — so this calls a
 * Supabase Edge Function (supabase/functions/delete-cloudinary-asset) that
 * holds the secret server-side and is only callable by an authenticated
 * admin session.
 *
 * Failures here are intentionally non-fatal to the caller: if the asset is
 * already gone, or the function call fails, we still want the database
 * record removed — so callers should proceed with the DB delete regardless
 * and simply surface a soft warning if this returns false.
 */
export async function deleteImageFromCloudinary(publicId) {
  if (!publicId) return true;
  try {
    const { error } = await supabase.functions.invoke('delete-cloudinary-asset', {
      body: { publicId },
    });
    return !error;
  } catch {
    return false;
  }
}
