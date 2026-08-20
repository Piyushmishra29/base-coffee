'use client';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useEffect, useState } from 'react';
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
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setSolid(v > 40));

  // Close on Escape, and never leave the page locked behind a hidden overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        // While it is invisible it must not be clickable or focusable — the
        // links were still hit-testable and tabbable through the intro.
        inert={!ready}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          pointerEvents: ready ? 'auto' : 'none',
          backdropFilter: solid ? 'blur(14px)' : 'none',
          background: solid ? 'rgba(24,19,17,0.72)' : 'transparent',
          borderBottom: `1px solid ${solid ? 'var(--edge-soft)' : 'transparent'}`,
          transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        <nav className="shell nav-bar">
          <a href="#top" className="nav-lockup" aria-label={`${BRAND.name} — back to top`}>
            <Mark size={22} />
            <span className="wordmark">Base&nbsp;&nbsp;Coffee</span>
          </a>

          <div className="nav-right">
            <ul className="nav-links">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="eyebrow nav-link">{l.label}</a>
                </li>
              ))}
            </ul>

            <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="eyebrow nav-pill">
              Instagram ↗
            </a>

            <button
              type="button"
              className="eyebrow nav-toggle"
              aria-expanded={open}
              aria-controls="nav-sheet"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-sheet"
            className="nav-sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
                </li>
              ))}
            </ul>
            <a className="eyebrow nav-sheet-ig" href={BRAND.instagram} target="_blank" rel="noreferrer">
              @basecoffeeindia ↗
            </a>
            <span className="eyebrow nav-sheet-addr">
              {BRAND.street} · {BRAND.area} · {BRAND.city}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
