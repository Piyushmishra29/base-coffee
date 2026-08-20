'use client';
import { MaskLine, Rise } from './Reveal';
import { EVENT } from '@/lib/data';

export default function Events() {
  return (
    <section style={{ background: 'var(--ground-2)', paddingBlock: 'clamp(90px, 16vh, 190px)' }}>
      <div className="shell" style={{
        display: 'grid', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'center',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      }}>
        <Rise style={{ position: 'relative', aspectRatio: '4 / 5', overflow: 'hidden', maxWidth: 460 }}>
          <img src={EVENT.poster} alt="Pup & Yoga at Base Coffee"
               style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        </Rise>

        <div>
          <Rise as="p" className="eyebrow" style={{ marginBottom: 22 }}>At Base</Rise>
          <h2 className="h2">
            <MaskLine>Pup</MaskLine>
            <MaskLine delay={0.06}>
              <span className="serif" style={{ textTransform: 'none', color: 'var(--caramel)', letterSpacing: '-0.02em' }}>&amp; Yoga</span>
            </MaskLine>
          </h2>
          <Rise as="p" className="lede" delay={0.12} style={{ marginTop: 28 }}>{EVENT.body}</Rise>
          <Rise delay={0.18} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 10px', marginTop: 28 }}>
            {EVENT.meta.map((m) => (
              <span key={m} className="eyebrow" style={{ border: '1px solid var(--edge)', padding: '7px 12px', color: 'var(--greige)' }}>{m}</span>
            ))}
          </Rise>
        </div>
      </div>
    </section>
  );
}
