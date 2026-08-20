'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import useReducedMotionSafe from './useReducedMotionSafe';
import useLazyVideo from './useLazyVideo';
import { Rise } from './Reveal';
import { MENU } from '@/lib/data';

/**
 * Beat two: the menu is pinned and panned sideways.
 *
 * The pan is a wheel-and-trackpad idea. On a phone it becomes ~3.4 viewports of
 * *vertical* scrolling that moves content *sideways*, with no swipe to match the
 * gesture the layout implies and no sense of how many cards are left — and the
 * "Scroll →" hint points at an axis the finger cannot use.
 *
 * The fix is not to bolt a drag onto it. A scroll-driven transform and a drag
 * gesture both write the same `x`, so they fight each other and fight Lenis's
 * touch scrolling, and the result is a carousel that is worse than either honest
 * option. Below the same 780px where the nav collapses, the pan is simply not
 * offered: the cards stack, vertical scrolling means what it says, and every
 * card is reachable with the one gesture every phone user already has.
 *
 * Reduced motion takes that same stacked route at every width.
 */
export default function MenuRail() {
  const reduced = useReducedMotionSafe();
  const [narrow, setNarrow] = useState(false);

  // Matched to the nav's own 780px break so the page changes shape once rather
  // than twice. Deliberately width-only, not `pointer: coarse` — a touchscreen
  // laptop has the room for the pan and should keep it.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 780px)');
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Both reads happen after mount, so the first client render still matches the
  // server's. Swapping component rather than branching inside one keeps the
  // pan's scroll subscription from existing at all when it isn't used.
  return reduced || narrow ? <MenuStack /> : <MenuPan />;
}

/** Wide screens: the pinned, scroll-driven horizontal pan. */
function MenuPan() {
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

/**
 * Phones, narrow windows and reduced motion: the same five cards down the page.
 * The reveal is the page's own `Rise`, the one every other section already uses
 * — not a new layer, and it goes quiet under reduced motion because `Rise`
 * checks that in JS rather than trusting a media query to stop an animation.
 */
function MenuStack() {
  return (
    <section id="menu" className="shell" style={{ paddingBlock: 'clamp(80px, 14vh, 160px)' }}>
      <Head stacked />
      <div
        style={{
          display: 'grid',
          gap: 'clamp(44px, 7vh, 64px) clamp(24px, 3vw, 40px)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {MENU.map((m, i) => (
          <Rise key={m.id} delay={(i % 2) * 0.06} style={{ minWidth: 0 }}>
            <Card item={m} stacked />
          </Rise>
        ))}
      </div>
    </section>
  );
}

/**
 * "Scroll →" is a promise about an axis. It is only true while the rail pans;
 * stacked, the honest thing to say is how many there are — and that count was
 * the other half of what the pinned version withheld on a phone.
 */
function Head({ stacked }) {
  return (
    <div className="section-head" style={{ paddingBlock: '0.5rem clamp(16px, 3vh, 40px)' }}>
      <h2 className="h2">Signatures</h2>
      <span className="eyebrow">
        {stacked ? `01 — ${String(MENU.length).padStart(2, '0')}` : 'Scroll →'}
      </span>
    </div>
  );
}

function Card({ item, stacked }) {
  const reduced = useReducedMotionSafe();
  const videoRef = useLazyVideo(!reduced && item.kind === 'video');

  return (
    <article style={{
      flex: stacked ? undefined : '0 0 clamp(272px, 62vw, 640px)',
      display: 'grid',
      // Pinned, the media takes whatever height the viewport leaves over.
      // Stacked, the card sizes to its own content instead.
      gridTemplateRows: stacked ? 'auto auto' : 'minmax(0, 1fr) auto',
      gap: 'clamp(14px, 2vh, 28px)', minWidth: 0, minHeight: 0,
    }}>
      <div style={{
        position: 'relative', overflow: 'hidden', background: 'var(--ground-2)', borderRadius: 2,
        minHeight: 0,
        // No viewport frame to fill when stacked, so use the 4:5 portrait the
        // reel wall and the event poster already use.
        aspectRatio: stacked ? '4 / 5' : undefined,
      }}>
        {item.kind === 'video' ? (
          <video ref={videoRef} src={item.src} poster={item.poster} muted loop playsInline preload="none"
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
