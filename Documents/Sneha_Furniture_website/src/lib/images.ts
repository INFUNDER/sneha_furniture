// Fallback shown when a product has no images.
export const PLACEHOLDER_IMAGE = '/sofa-pic.jpg';

// Product photos on Cloudinary are uploaded as multi-megabyte PNGs. Asking Cloudinary for
// an auto-format (WebP/AVIF), auto-quality, resized copy cuts each one to ~50–150 KB.
export function productImage(url: string, width = 800): string {
  if (!url) return PLACEHOLDER_IMAGE;
  const marker = '/image/upload/';
  const i = url.indexOf(marker);
  if (!url.startsWith('https://res.cloudinary.com/') || i === -1) return url;
  const rest = url.slice(i + marker.length);
  // Leave URLs that already carry a transformation alone.
  if (/^(?!v\d+\/)[a-z]{1,3}_[^/]+\//.test(rest)) return url;
  return `${url.slice(0, i + marker.length)}f_auto,q_auto,c_limit,w_${width}/${rest}`;
}

export function parseImages(json: string | null | undefined): string[] {
  try {
    const parsed = JSON.parse(json || '[]');
    return Array.isArray(parsed) ? parsed.filter((u): u is string => typeof u === 'string' && u !== '') : [];
  } catch {
    return [];
  }
}
