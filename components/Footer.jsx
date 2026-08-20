import Mark from './Mark';
import { BRAND } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="shell" style={{ paddingBlock: 'clamp(48px, 8vh, 88px)', background: 'var(--ground)' }}>
      <div className="rule" style={{ marginBottom: 'clamp(32px, 5vh, 56px)' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Mark size={30} />
            <span className="wordmark" style={{ fontSize: 13 }}>Base&nbsp;&nbsp;Coffee</span>
          </div>
          <p className="serif" style={{ margin: 0, fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)', color: 'var(--greige)' }}>
            {BRAND.tagline}
          </p>
        </div>
        <div style={{ display: 'grid', gap: 8, textAlign: 'right' }}>
          <a className="eyebrow" href={BRAND.instagram} target="_blank" rel="noreferrer" style={{ color: 'var(--greige)' }}>Instagram</a>
          <a className="eyebrow" href={BRAND.maps} target="_blank" rel="noreferrer" style={{ color: 'var(--greige)' }}>Directions</a>
          <span className="eyebrow">{BRAND.area}, {BRAND.city}</span>
        </div>
      </div>
    </footer>
  );
}
