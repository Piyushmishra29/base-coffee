'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useScroll, animate, cubicBezier } from 'motion/react';
import Mark from './Mark';
import Poster from './Poster';
import useReducedMotionSafe from './useReducedMotionSafe';
import { HERO, BRAND } from '@/lib/data';

const MARK_RATIO = 0.7246;              // measured off their posts
const easeFrame = cubicBezier(0.76, 0, 0.24, 1);
const easeIris  = cubicBezier(0.65, 0, 0.15, 1);

const lerp = (a, b, t) => a + (b - a) * t;

export default function Hero({ onIntroDone }) {
  const reduced = useReducedMotionSafe();
  const [vp, setVp] = useState(null);
  const sectionRef = useRef(null);
  const p = useMotionValue(0);

  // Measure the viewport — the aperture is drawn in real pixels so the
  // stroke weight never distorts the way a scaled element's would.
  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Keep the object identity stable when the size hasn't actually changed.
      // A fresh {w,h} on every resize event re-ran the intro effect below, and
      // iOS fires resize on every URL-bar collapse — the intro could be
      // restarted indefinitely and onIntroDone would never fire, leaving the
      // nav invisible but still focusable.
      setVp((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // The one beat: mark holds, frame expands, bar splits, footage pours out.
  // Guarded so it runs once — a resize must never restart or re-time it.
  const started = useRef(false);
  useEffect(() => {
    if (!vp || started.current) return;
    started.current = true;
    const controls = animate(p, 1, {
      duration: 2.6,
      ease: 'linear',
      onComplete: () => onIntroDone?.(),
    });
    return () => controls.stop();
  }, [vp, p, onIntroDone]);

  // useReducedMotionSafe resolves after mount, so this may land mid-intro.
  useEffect(() => {
    if (!reduced) return;
    p.set(1);
    onIntroDone?.();
  }, [reduced, p, onIntroDone]);

  const w = vp?.w ?? 0;
  const h = vp?.h ?? 0;
  const cy = h / 2;
  const markH = Math.min(148, Math.max(96, h * 0.16));
  const markW = markH * MARK_RATIO;
  const sw0 = markW * 0.1;

  // frame: 0.18 → 0.74 of the timeline    iris: 0.42 → 1.0
  const geo = (v) => {
    const f = easeFrame(Math.min(1, Math.max(0, (v - 0.18) / 0.56)));
    const W = lerp(markW, w, f);
    const H = lerp(markH, h, f);
    const SW = lerp(sw0, 1.1, f);
    // An SVG stroke straddles the path, so pull the rect in by half a stroke
    // to leave the outer edge exactly where the div's border-box had it.
    return { f, W: W - SW, H: H - SW, SW, X: (w - W) / 2 + SW / 2, Y: (h - H) / 2 + SW / 2 };
  };
  const irisGap = (v) => easeIris(Math.min(1, Math.max(0, (v - 0.42) / 0.58))) * (h * 1.08);

  // Solve the geometry once per frame; everything else reads off it.
  const g = useTransform(p, geo);
  const gap = useTransform(p, irisGap);

  // Frame outline
  const frameLeft   = useTransform(g, (v) => v.X);
  const frameTop    = useTransform(g, (v) => v.Y);
  const frameW      = useTransform(g, (v) => v.W);
  const frameH      = useTransform(g, (v) => v.H);
  const frameBorder = useTransform(g, (v) => v.SW);
  const frameOpacity = useTransform(p, [0, 0.86, 1], [1, 1, 0]);

  // Footage is clipped twice — once to the frame's interior, once to the
  // widening band between the two halves of the bar. The intersection is the aperture.
  const frameClip = useTransform(g, ({ X, Y, W, H, SW }) => {
    const top = Y + SW / 2, left = X + SW / 2;
    const right = X + W - SW / 2, bottom = Y + H - SW / 2;
    return `inset(${top}px ${w - right}px ${h - bottom}px ${left}px)`;
  });
  const irisClip = useTransform(gap, (v) =>
    `inset(${cy - v / 2}px 0px ${h - (cy + v / 2)}px 0px)`);

  // The bar, torn in half
  const barLeft   = useTransform(g, (v) => v.X + v.SW / 2);
  const barWidth  = useTransform(g, (v) => Math.max(0, v.W - v.SW));
  const barHeight = useTransform(g, (v) => v.SW / 2);
  const barTopY   = useTransform([g, gap], ([v, gp]) => cy - gp / 2 - v.SW / 2);
  const barBotY   = useTransform(gap, (v) => cy + v / 2);
  const barOpacity = useTransform(p, [0, 0.9, 1], [1, 1, 0]);

  // The lockup's wordmark, present only while the mark is still a logo
  const lockupOpacity = useTransform(p, [0, 0.16, 0.3], [1, 1, 0]);
  const lockupTop = useTransform(p, () => cy + markH / 2 + 18);


  // Headline arrives once the aperture is open
  const copyOpacity = useTransform(p, [0.74, 0.94], [0, 1]);
  const copyY = useTransform(p, [0.74, 0.94], [26, 0]);

  // Gentle parallax on the footage as you leave
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.75]);

  return (
    <section ref={sectionRef} style={{ position: 'relative', height: '100svh', overflow: 'hidden', background: 'var(--ground)' }}>
      {/* Footage, double-clipped into the aperture */}
      <motion.div style={{ position: 'absolute', inset: 0, clipPath: vp ? frameClip : 'inset(50% 50% 50% 50%)' }}>
        <motion.div style={{ position: 'absolute', inset: 0, clipPath: vp ? irisClip : 'inset(50% 0 50% 0)' }}>
          <Poster src={HERO.poster} alt="" eager />
          <motion.video
            src={HERO.video}
            autoPlay={!reduced} muted loop={!reduced} playsInline preload="auto"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', scale: videoScale }}
          />
          <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', opacity: veil }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(16,12,10,0.88) 0%, rgba(16,12,10,0.18) 42%, rgba(16,12,10,0.42) 100%)',
          }} />
        </motion.div>
      </motion.div>

      {/* The mark's outline growing into the page frame, and the bar splitting
          in half. Drawn as SVG rather than positioned divs: animating
          left/top/width/height reflows a viewport-sized box every frame AND
          the browser scores it as layout shift — it was the entire CLS of the
          page, 0.446. SVG geometry never touches document layout, and unlike a
          transform-scaled div the stroke keeps its exact weight throughout. */}
      {vp && (
        <svg
          aria-hidden
          width="100%"
          height="100%"
          viewBox={`0 0 ${w} ${h}`}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <motion.rect
            x={frameLeft} y={frameTop} width={frameW} height={frameH}
            fill="none" stroke="var(--cream)"
            style={{ strokeWidth: frameBorder, opacity: frameOpacity }}
          />
          <motion.rect
            x={barLeft} y={barTopY} width={barWidth} height={barHeight}
            fill="var(--cream)" style={{ opacity: barOpacity }}
          />
          <motion.rect
            x={barLeft} y={barBotY} width={barWidth} height={barHeight}
            fill="var(--cream)" style={{ opacity: barOpacity }}
          />
        </svg>
      )}

      {/* Static first paint. The mark is sized and centred in CSS to land
          exactly where the measured t=0 frame does — centring a mark+wordmark
          stack instead put the mark 17px high and 20% small, so it visibly
          popped on hydration. */}
      {!vp && (
        <div style={{ position: 'absolute', inset: 0 }} aria-hidden>
          <Mark
            size={120}
            style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              height: 'clamp(96px, 16svh, 148px)', width: 'auto',
            }}
          />
          <div style={{
            position: 'absolute', left: 0, right: 0,
            top: 'calc(50% + clamp(96px, 16svh, 148px) / 2 + 18px)', textAlign: 'center',
          }}>
            <span className="wordmark" style={{ color: 'var(--cream)' }}>Base&nbsp;&nbsp;Coffee</span>
          </div>
        </div>
      )}

      {/* Wordmark half of the lockup */}
      {vp && (
        <motion.div
          aria-hidden
          style={{ position: 'absolute', left: 0, right: 0, top: lockupTop, textAlign: 'center', opacity: lockupOpacity, pointerEvents: 'none' }}
        >
          <span className="wordmark" style={{ color: 'var(--cream)' }}>Base&nbsp;&nbsp;Coffee</span>
        </motion.div>
      )}

      {/* Headline */}
      <motion.div
        className="shell"
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 'clamp(40px, 8vh, 92px)',
          opacity: vp ? copyOpacity : 0, y: vp ? copyY : 0,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem' }}>
          <h1 className="display" style={{ maxWidth: '14ch' }}>
            Good coffee<br />doesn’t rush.
            <span className="serif" style={{
              display: 'block', textTransform: 'none', letterSpacing: '-0.01em',
              fontSize: 'clamp(1.4rem, 3.4vw, 3.2rem)', color: 'var(--caramel)', marginTop: '0.24em',
            }}>
              Neither do we.
            </span>
          </h1>
          <div style={{ display: 'grid', gap: '0.5rem', paddingBottom: '0.6rem' }}>
            <span className="eyebrow" style={{ color: 'var(--greige)' }}>{BRAND.street} · {BRAND.area}</span>
            <span className="eyebrow" style={{ color: 'var(--greige)' }}>{BRAND.city} · Est. {BRAND.opened}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
