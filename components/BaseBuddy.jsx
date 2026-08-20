'use client';
import { MaskLine, Rise } from './Reveal';
import { BUDDY } from '@/lib/data';

export default function BaseBuddy() {
  return (
    <section id="buddy" style={{ background: 'var(--ground-2)', paddingBlock: 'clamp(90px, 16vh, 190px)' }}>
      <div className="shell" style={{
        display: 'grid', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'center',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      }}>
        <div>
          <Rise as="p" className="eyebrow" style={{ marginBottom: 22 }}>The mascot</Rise>
          <h2 className="h2">
            <MaskLine>Base</MaskLine>
            <MaskLine delay={0.08}>
              <span className="serif" style={{ textTransform: 'none', color: 'var(--caramel)', letterSpacing: '-0.02em' }}>Buddy</span>
            </MaskLine>
          </h2>
          <Rise as="p" className="lede" delay={0.12} style={{ marginTop: 28 }}>{BUDDY.body}</Rise>
          <Rise as="p" delay={0.18} style={{ marginTop: 24, color: 'var(--mute)', fontSize: 14 }}>
            He’s printed on every cup. Yes, people keep them.
          </Rise>
        </div>

        <Rise delay={0.06} style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden', background: 'var(--ink)' }}>
          <video src={BUDDY.video} poster={BUDDY.poster} autoPlay muted loop playsInline preload="metadata"
                 style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        </Rise>
      </div>
    </section>
  );
}
