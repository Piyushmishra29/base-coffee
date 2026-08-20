'use client';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

/**
 * The one piece of chrome on the page, and it earns its keep: the 日 mark in the
 * corner fills with coffee as you scroll. Scroll progress and brand mark, one object.
 */
export default function ScrollMark({ ready }) {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  // The mark's interior runs from y=5 to y=64 in its own 50×69 coordinate space.
  const fillY = useTransform(smooth, [0, 1], [64, 5]);
  const fillH = useTransform(smooth, [0, 1], [0, 59]);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      style={{
        position: 'fixed', right: 'clamp(14px, 2vw, 26px)', bottom: 'clamp(14px, 2.4vh, 26px)',
        zIndex: 45, pointerEvents: 'none',
        padding: '10px 12px', borderRadius: 999,
        background: 'rgba(16,12,10,0.5)', backdropFilter: 'blur(10px)',
        border: '1px solid var(--edge-soft)',
      }}
    >
      <svg viewBox="0 0 50 69" width={20} height={27.6} fill="none">
        <clipPath id="mark-interior">
          <rect x="5" y="5" width="40" height="59" />
        </clipPath>
        <motion.rect x="5" width="40" y={fillY} height={fillH} fill="var(--cream)" clipPath="url(#mark-interior)" opacity="0.55" />
        <rect x="2.5" y="2.5" width="45" height="64" stroke="var(--cream)" strokeWidth="5" />
        <rect x="5" y="32" width="40" height="5" fill="var(--cream)" />
      </svg>
    </motion.div>
  );
}
