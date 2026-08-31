export function getOptimizedImageUrl(url, width = 1200) {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  try {
    const imageUrl = new URL(url);
    const uploadPath = '/image/upload/';
    const uploadIndex = imageUrl.pathname.indexOf(uploadPath);
    if (uploadIndex === -1) return url;

    const transform = `f_auto,q_auto,w_${width},c_limit`;
    imageUrl.pathname = `${imageUrl.pathname.slice(0, uploadIndex + uploadPath.length)}${transform}/${imageUrl.pathname.slice(uploadIndex + uploadPath.length)}`;
    return imageUrl.toString();
  } catch {
    return url;
  }
}

export const publicImageLoading = import.meta.env.PROD ? 'eager' : 'lazy';