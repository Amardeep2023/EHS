/**
 * Echo-Layer Typography Component
 * Creates multi-layered text shadow effect for editorial look.
 */
export default function EchoText({ text, className = '', size = '14vw' }) {
  return (
    <div className={`relative inline-block ${className}`} style={{ fontSize: size }}>
      {/* Layer 1 - bottom ghost */}
      <span
        className="absolute top-0 left-0 font-boska font-black select-none pointer-events-none"
        style={{
          color: 'rgba(212, 165, 116, 0.05)',
          transform: 'translate(-0.04em, -0.04em)',
          fontFamily: 'Boska, Georgia, serif',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        {text}
      </span>
      {/* Layer 2 - mid ghost */}
      <span
        className="absolute top-0 left-0 font-boska font-black select-none pointer-events-none"
        style={{
          color: 'rgba(212, 165, 116, 0.10)',
          transform: 'translate(-0.02em, -0.02em)',
          fontFamily: 'Boska, Georgia, serif',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        {text}
      </span>
      {/* Layer 3 - top visible */}
      <span
        className="relative font-boska font-black"
        style={{
          color: '#2a2219',
          fontFamily: 'Boska, Georgia, serif',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        {text}
      </span>
    </div>
  );
}
