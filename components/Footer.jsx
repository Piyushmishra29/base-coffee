import Mark from './Mark';
import { MaskLine } from './Reveal';
import { BRAND } from '@/lib/data';

// The site is a static export, so this is baked into the HTML at build time and
// re-evaluated in the browser. The two disagree for anyone loading a stale build
// after New Year, which is a hydration mismatch — hence suppressHydrationWarning
// on the line that prints it.
const YEAR = new Date().getFullYear();

// "Crafting moments," / "one cup at a time." — split off the data, not retyped.
const [SAY_1, SAY_2] = BRAND.tagline.split(/,\s+/);
const HANDLE = '@' + BRAND.instagram.split('/').filter(Boolean).pop();

/**
 * The closing lockup: 日 + BASE COFFEE, drawn gutter to gutter.
 *
 * textLength + lengthAdjust="spacing" forces the wordmark to land exactly on
 * the right gutter at every viewport. Because it is one SVG scaled by its own
 * viewBox, the mark, the tracking and the cap height stay in proportion from
 * 350px to 2500px — no breakpoint fiddling, and no cap that would strand it
 * off the gutters on a wide display.
 */
function ClosingLockup() {
  return (
    <svg className="footer-word" viewBox="0 0 1000 74" aria-hidden="true" focusable="false">
      <Mark size={74} />
      <text
        x="96"
        y="73"
        textLength="904"
        lengthAdjust="spacing"
        style={{
          fontFamily: 'var(--font-archivo), system-ui, sans-serif',
          fontSize: '100px',
          fontWeight: 500,
          fill: 'currentColor',
        }}
      >
        {'BASE COFFEE'}
      </text>
    </svg>
  );
}

/**
 * The address, the hours link and the handle all live in <Visit>, which ends
 * two hundred pixels above this. Repeating them here would be padding, not
 * service — so the footer only closes the page: the line the brand signs off
 * with, the two links worth carrying twice, and the mark at full width.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="rule" />

        <div className="footer-body">
          <p className="serif footer-say">
            {SAY_1},<br />
            {SAY_2}
          </p>

          <ul className="footer-links">
            <li>
              <a className="footer-link" href={BRAND.instagram} target="_blank" rel="noreferrer">
                {HANDLE} <span aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a className="footer-link" href={BRAND.maps} target="_blank" rel="noreferrer">
                Directions <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </div>

        {/* The footer's one motion beat. MaskLine renders plain and visible
            under prefers-reduced-motion, so nothing here depends on a JS
            animation settling. */}
        <div className="footer-word-wrap">
          <MaskLine>
            <ClosingLockup />
          </MaskLine>
        </div>

        <div className="rule" />
        <div className="footer-colophon">
          <span className="eyebrow" suppressHydrationWarning>
            © {YEAR} {BRAND.name} — {BRAND.area}, {BRAND.city}
          </span>
          <a className="eyebrow footer-up" href="#top">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
