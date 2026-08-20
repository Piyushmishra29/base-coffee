'use client';
import { useEffect, useState } from 'react';

/**
 * motion's useReducedMotion() reads matchMedia during render, which desyncs SSR
 * from the first client render. Returning false until after mount keeps the
 * first client render identical to the server's.
 */
export default function useReducedMotionSafe() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}
