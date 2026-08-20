'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MaskLine, Rise } from './Reveal';
import useLazyVideo from './useLazyVideo';
import useReducedMotionSafe from './useReducedMotionSafe';
import Mark from './Mark';
import { BRAND, VISIT } from '@/lib/data';

export default function Visit() {
  const reduced = useReducedMotionSafe();
  const videoRef = useLazyVideo(!reduced);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section id="visit" ref={ref} style={{ position: 'relative', overflow: 'hidden', background: 'var(--ink)' }}>
      <motion.div style={{ position: 'absolute', inset: '-10% 0', y }}>
        <video ref={videoRef} src={VISIT.video} poster={VISIT.poster} muted loop playsInline preload="none"
               style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.42 }} />
      </motion.div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(16,12,10,0.85), rgba(16,12,10,0.6) 45%, rgba(16,12,10,0.95))' }} />

      <div className="shell" style={{ position: 'relative', paddingBlock: 'clamp(100px, 17vh, 190px)' }}>
        <Rise as="p" className="eyebrow" style={{ marginBottom: 24 }}>Come by</Rise>
        <h2 className="display" style={{ maxWidth: '11ch' }}>
          <MaskLine>Road No.</MaskLine>
          <MaskLine delay={0.06}>Forty&nbsp;Six</MaskLine>
        </h2>

        <div style={{
          display: 'grid', gap: 'clamp(24px, 4vw, 60px)', marginTop: 'clamp(44px, 8vh, 90px)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}>
          <Rise as="div" style={{ display: 'grid', gap: 6 }}>
            <span className="eyebrow">Address</span>
            <span style={{ fontSize: 17, lineHeight: 1.5 }}>
              {BRAND.street}<br />{BRAND.area}<br />{BRAND.city}
            </span>
          </Rise>
          <Rise as="div" delay={0.06} style={{ display: 'grid', gap: 6, alignContent: 'start' }}>
            <span className="eyebrow">Hours</span>
            <span style={{ fontSize: 17 }}>{BRAND.hours}</span>
            <a href={BRAND.maps} target="_blank" rel="noreferrer" className="visit-link" style={{ fontSize: 14 }}>
              Confirm on Google Maps ↗
            </a>
          </Rise>
          <Rise as="div" delay={0.12} style={{ display: 'grid', gap: 6, alignContent: 'start' }}>
            <span className="eyebrow">Follow</span>
            <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="visit-link" style={{ fontSize: 17 }}>
              @basecoffeeindia ↗
            </a>
          </Rise>
          <Rise as="div" delay={0.18} style={{ display: 'grid', gap: 6, alignContent: 'start' }}>
            <span className="eyebrow">Open since</span>
            <span style={{ fontSize: 17 }}>{BRAND.opened}</span>
          </Rise>
        </div>

        <Rise delay={0.22} style={{ marginTop: 'clamp(44px, 7vh, 80px)' }}>
          <a href={BRAND.maps} target="_blank" rel="noreferrer" className="cta">
            <Mark size={18} />
            <span>Get directions</span>
            <span aria-hidden>↗</span>
          </a>
        </Rise>
      </div>

    </section>
  );
}
