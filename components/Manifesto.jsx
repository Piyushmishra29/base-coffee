'use client';
import { MaskLine, Rise } from './Reveal';
import { BRAND } from '@/lib/data';

export default function Manifesto() {
  return (
    <section className="shell" style={{ paddingBlock: 'clamp(80px, 13vh, 150px)' }}>
      <div className="rule" />
      <div style={{ paddingTop: 'clamp(40px, 7vh, 90px)' }}>
        <Rise as="p" className="eyebrow" style={{ marginBottom: 'clamp(28px, 5vh, 56px)' }}>
          A neighbourhood coffee shop
        </Rise>

        <h2 className="h2" style={{ maxWidth: '18ch' }}>
          <MaskLine>Crafting moments,</MaskLine>
          <MaskLine delay={0.08}>
            <span className="serif" style={{ textTransform: 'none', letterSpacing: '-0.02em', color: 'var(--caramel)' }}>
              one cup at a time.
            </span>
          </MaskLine>
        </h2>

        <div style={{
          display: 'grid', gap: 'clamp(24px, 4vw, 64px)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          marginTop: 'clamp(44px, 7vh, 88px)',
        }}>
          <Rise as="p" className="lede">
            Base opened its doors on {BRAND.street}, {BRAND.area}, in {BRAND.opened}. Espresso pulled
            slow, matcha whisked by hand, and a cup that has been waiting for you ever since.
          </Rise>
          <Rise as="div" delay={0.1} style={{ display: 'grid', gap: '1.1rem', alignContent: 'start' }}>
            {[
              ['Espresso', 'Pulled to order, never held'],
              ['Matcha', 'Ceremonial grade, whisked by hand'],
              ['Cold brew', 'Steeped slow, poured over ice'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gap: 4, paddingBottom: '1rem', borderBottom: '1px solid var(--edge-soft)' }}>
                <span className="eyebrow" style={{ color: 'var(--cream)' }}>{k}</span>
                <span style={{ fontSize: 14, color: 'var(--mute)' }}>{v}</span>
              </div>
            ))}
          </Rise>
        </div>
      </div>
    </section>
  );
}
