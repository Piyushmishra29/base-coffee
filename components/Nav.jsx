'use client';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useState } from 'react';
import Mark from './Mark';
import { BRAND } from '@/lib/data';

const LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'Base Buddy', href: '#buddy' },
  { label: 'The Space', href: '#space' },
  { label: 'Visit', href: '#visit' },
];

export default function Nav({ ready }) {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setSolid(v > 40));

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backdropFilter: solid ? 'blur(14px)' : 'none',
        background: solid ? 'rgba(24,19,17,0.72)' : 'transparent',
        borderBottom: `1px solid ${solid ? 'var(--edge-soft)' : 'transparent'}`,
        transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
      }}
    >
      <nav className="shell" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 'clamp(56px, 6.4vh, 76px)', gap: '1.5rem',
      }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Mark size={22} />
          <span className="wordmark">Base&nbsp;&nbsp;Coffee</span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px, 2vw, 34px)' }}>
          <ul className="nav-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="eyebrow nav-link" style={{ color: 'var(--greige)' }}>{l.label}</a>
              </li>
            ))}
          </ul>
          <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="eyebrow nav-link"
             style={{ color: 'var(--cream)', border: '1px solid var(--edge)', borderRadius: 999, padding: '8px 16px' }}>
            Instagram ↗
          </a>
        </div>
      </nav>

    </motion.header>
  );
}
