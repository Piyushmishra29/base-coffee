'use client';
import { useRef } from 'react';
import { Rise } from './Reveal';
import { REELS } from '@/lib/data';

export default function ReelWall() {
  return (
    <section id="space" className="shell" style={{ paddingBlock: 'clamp(80px, 13vh, 150px)' }}>
      <div className="section-head">
        <h2 className="h2">The space</h2>
        <span className="eyebrow">Hover to play</span>
      </div>

      <div className="reel-grid">
        {REELS.map((r, i) => <Tile key={r.src} reel={r} i={i} />)}
      </div>
    </section>
  );
}

function Tile({ reel, i }) {
  const ref = useRef(null);
  const play = () => ref.current?.play().catch(() => {});
  const stop = () => { const v = ref.current; if (v) { v.pause(); v.currentTime = 0; } };

  return (
    <Rise
      delay={(i % 4) * 0.05}
      style={{
        position: 'relative', overflow: 'hidden', background: 'var(--ground-2)',
        border: '1px solid var(--edge-soft)',
        aspectRatio: reel.ratio === 'wide' ? '16 / 10' : '4 / 5',
      }}
      className={reel.ratio === 'wide' ? 'reel-tile reel-wide' : 'reel-tile'}
    >
      <div onMouseEnter={play} onMouseLeave={stop} style={{ position: 'absolute', inset: 0 }}>
        <video ref={ref} src={reel.src} poster={reel.poster} muted loop playsInline preload="none"
               style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(16,12,10,0.82), transparent 55%)' }} />
        <p className="serif" style={{
          position: 'absolute', left: 16, right: 16, bottom: 14, margin: 0,
          fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)', color: 'var(--cream)', lineHeight: 1.3,
        }}>{reel.line}</p>
      </div>
    </Rise>
  );
}
