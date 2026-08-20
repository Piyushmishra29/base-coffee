'use client';
import { motion } from 'motion/react';

/**
 * Mask reveal. The viewport trigger lives on the OUTER, unclipped wrapper —
 * putting whileInView on the inner element parks it outside its own
 * overflow:hidden mask, so IntersectionObserver never fires and it stays
 * invisible forever.
 */
export function MaskLine({ children, delay = 0, className = '', style }) {
  return (
    <motion.span
      className={className}
      style={{ display: 'block', overflow: 'hidden', ...style }}
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
  const C = motion[as] ?? motion.div;
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
