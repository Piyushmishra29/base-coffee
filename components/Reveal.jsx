'use client';
import { motion } from 'motion/react';
import useReducedMotionSafe from './useReducedMotionSafe';

/**
 * Mask reveal. The viewport trigger lives on the OUTER, unclipped wrapper —
 * putting whileInView on the inner element parks it outside its own
 * overflow:hidden mask, so IntersectionObserver never fires and it stays
 * invisible forever.
 *
 * Under reduced motion these render plain and visible rather than animating
 * to visible: a reduced-motion reader should never depend on a scroll trigger
 * firing to be able to read the page at all.
 */
export function MaskLine({ children, delay = 0, className = '', style }) {
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return <span className={className} style={{ display: 'block', ...style }}>{children}</span>;
  }

  return (
    <motion.span
      className={className}
      // .display and .h2 set line-height below 1, so the ink box is taller
      // than the line box and descenders stay clipped even after the
      // animation ends. Pad the mask, then pull the padding back out of the
      // layout so nothing shifts.
      style={{
        display: 'block', overflow: 'hidden',
        paddingBottom: '0.18em', marginBottom: '-0.18em',
        ...style,
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-8%' }}
    >
      <motion.span
        style={{ display: 'block' }}
        variants={{ hidden: { y: '112%' }, visible: { y: '0%' } }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/** Plain fade + rise, for anything that isn't a line of type. */
export function Rise({ children, delay = 0, y = 28, className = '', style, as = 'div' }) {
  const reduced = useReducedMotionSafe();
  const C = motion[as] ?? motion.div;

  if (reduced) {
    const Plain = as;
    return <Plain className={className} style={style}>{children}</Plain>;
  }

  return (
    <C
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </C>
  );
}
