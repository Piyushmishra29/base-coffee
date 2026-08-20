'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import useReducedMotionSafe from './useReducedMotionSafe';
import { MENU } from '@/lib/data';

/** Beat two: the menu is pinned and panned sideways. */
export default function MenuRail() {
  const reduced = useReducedMotionSafe();
  const wrapRef = useRef(null);
  const railRef = useRef(null);
  const [travel, setTravel] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });

  // Guessing the pan distance in vw overshoots and throws the last cards off
  // screen. Measure the rail instead so it lands exactly on the final card.
  useEffect(() => {
    const measure = () => {
      const el = railRef.current;
      if (!el) return;
      setTravel(Math.max(0, el.scrollWidth - el.clientWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 400); // after fonts/media settle
    return () => { window.removeEventListener('resize', measure); clearTimeout(t); };
  }, []);

  const railX = useTransform(scrollYProgress, [0.06, 0.94], [0, -travel]);
  const lineScale = useTransform(scrollYProgress, [0.06, 0.94], [0, 1]);

  if (reduced) {
    return (
      <section id="menu" className="shell" style={{ paddingBlock: 'clamp(80px, 14vh, 160px)' }}>
        <Head />
        <div style={{ display: 'grid', gap: 40, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {MENU.map((m) => <Card key={m.id} item={m} static />)}
        </div>
      </section>
    );
  }

  return (
    <section id="menu" ref={wrapRef} style={{ height: `${MENU.length * 88}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="shell" style={{ paddingTop: 'clamp(64px, 10vh, 120px)' }}>
          <Head />
        </div>

        <motion.div
          ref={railRef}
          style={{
            x: railX, display: 'flex', gap: 'clamp(20px, 3vw, 48px)',
            paddingInline: 'var(--gutter)', alignItems: 'stretch', flex: 1,
            paddingBottom: 'clamp(56px, 8vh, 84px)', minHeight: 0,
          }}
        >
          {MENU.map((m) => <Card key={m.id} item={m} />)}
          <div aria-hidden style={{ flex: '0 0 var(--gutter)' }} />
        </motion.div>

        <div style={{ position: 'absolute', left: 'var(--gutter)', right: 'var(--gutter)', bottom: 'clamp(18px, 3vh, 30px)' }}>
          <div style={{ height: 1, background: 'var(--edge-soft)', position: 'relative' }}>
            <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--caramel)', scaleX: lineScale, transformOrigin: 'left' }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Head() {
  return (
    <div className="section-head" style={{ paddingBlock: '0.5rem clamp(16px, 3vh, 40px)' }}>
      <h2 className="h2">Signatures</h2>
      <span className="eyebrow">Scroll →</span>
    </div>
  );
}

function Card({ item, static: isStatic }) {
  return (
    <article style={{
      flex: isStatic ? undefined : '0 0 clamp(272px, 62vw, 640px)',
      display: 'grid', gridTemplateRows: 'minmax(0, 1fr) auto',
      gap: 'clamp(14px, 2vh, 28px)', minWidth: 0, minHeight: 0,
    }}>
      <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--ground-2)', borderRadius: 2, minHeight: isStatic ? 320 : 0 }}>
        {item.kind === 'video' ? (
          <video src={item.src} poster={item.poster} autoPlay muted loop playsInline preload="metadata"
                 style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
        ) : (
          <img src={item.src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
        )}
        <span className="eyebrow" style={{
          position: 'absolute', top: 16, left: 16, color: 'var(--cream)',
          background: 'rgba(16,12,10,0.55)', padding: '5px 10px', backdropFilter: 'blur(6px)',
        }}>{item.index}</span>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: 'clamp(1.25rem, 2.1vw, 2rem)', fontWeight: 600, letterSpacing: '-0.02em' }}>
            {item.name}
          </h3>
          <span className="serif" style={{ color: item.accent, fontSize: 'clamp(0.95rem, 1.3vw, 1.2rem)' }}>{item.note}</span>
        </div>
        <p style={{ margin: 0, color: 'var(--mute)', fontSize: 14, maxWidth: '48ch', lineHeight: 1.6 }}>{item.body}</p>
        {item.list && (
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px', listStyle: 'none', margin: '4px 0 0', padding: 0 }}>
            {item.list.map((l) => (
              <li key={l} className="eyebrow" style={{ border: '1px solid var(--edge)', padding: '5px 10px', color: 'var(--greige)' }}>{l}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
