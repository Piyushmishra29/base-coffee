'use client';
import { useEffect, useRef } from 'react';

/**
 * `autoPlay` forces a fetch regardless of `preload`, so an autoplaying video
 * 8000px down the page still downloads on first paint. This starts playback
 * only once the element is near the viewport, and pauses it again on the way
 * out so offscreen clips stop costing decode time.
 *
 * Pass enabled=false (reduced motion) to leave the poster showing.
 */
export default function useLazyVideo(enabled = true) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) el.play().catch(() => {});
          else el.pause();
        }
      },
      { rootMargin: '250px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  return ref;
}
