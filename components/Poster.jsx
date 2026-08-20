/**
 * A video's `poster` attribute is fetched eagerly no matter where the element
 * sits on the page, so 16 reel tiles pulled ~2.3MB of JPEG before the visitor
 * had scrolled at all. An <img> underlay gets native lazy-loading instead, and
 * <picture> lets the same frame ship as AVIF (77% smaller than the JPEG) with
 * WebP and JPEG fallbacks for older Safari.
 *
 * The video sits on top with no poster of its own; until it has data it paints
 * nothing, so this shows through.
 */
export default function Poster({ src, alt = '', eager = false, className, style }) {
  const base = src.replace(/\.jpg$/, '');
  return (
    <picture>
      <source srcSet={`${base}.avif`} type="image/avif" />
      <source srcSet={`${base}.webp`} type="image/webp" />
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding={eager ? 'sync' : 'async'}
        fetchPriority={eager ? 'high' : 'auto'}
        className={className}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }}
      />
    </picture>
  );
}
