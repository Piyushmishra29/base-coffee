/**
 * The Base Coffee mark, rebuilt to the proportions measured off their posts:
 * outer 50 × 69, stroke 5 (10% of width), bar of the same weight dead-centre.
 */
export default function Mark({ size = 20, className = '', style }) {
  return (
    <svg
      viewBox="0 0 50 69"
      width={size * 0.7246}
      height={size}
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="45" height="64" stroke="currentColor" strokeWidth="5" />
      <rect x="5" y="32" width="40" height="5" fill="currentColor" />
    </svg>
  );
}
