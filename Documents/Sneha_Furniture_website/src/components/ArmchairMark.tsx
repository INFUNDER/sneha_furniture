// Single-line armchair drawing used by the intro loader and route loading states.
// Each path has pathLength=1 so CSS can draw it with stroke-dashoffset.
const PATHS = [
  // backrest
  'M34 62 V30 C34 18 42 12 60 12 C78 12 86 18 86 30 V62',
  // left arm
  'M34 64 V54 C34 47 29 44 24 44 C19 44 15 47 15 54 V80',
  // right arm
  'M86 64 V54 C86 47 91 44 96 44 C101 44 105 47 105 54 V80',
  // seat cushion
  'M34 64 C34 60 37 58 41 58 H79 C83 58 86 60 86 64 V70 H34 Z',
  // base
  'M15 80 H105 V86 C105 88 103 90 101 90 H19 C17 90 15 88 15 86 Z',
  // legs
  'M24 90 L21 104 M96 90 L99 104',
];

export default function ArmchairMark({
  className = '',
  strokeWidth = 1.6,
  stagger = 0.14,
}: {
  className?: string;
  strokeWidth?: number;
  stagger?: number;
}) {
  return (
    <svg viewBox="0 0 120 110" fill="none" className={className} aria-hidden="true">
      {PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ '--d': `${i * stagger}s` } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}
