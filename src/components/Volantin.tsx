// src/components/Volantin.tsx
// Remate del pie. Un volantín con su cola, en tinta.

export function Volantin({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 104"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="var(--color-tinta)" strokeWidth="2" fill="none">
        <polygon points="40,4 66,30 40,56 14,30" fill="var(--color-kraft-dark)" />
        <path d="M 14 30 H 66 M 40 4 V 56" strokeWidth="1.5" />
        <path
          d="M 40 56 L 52 68 L 28 80 L 52 92 L 34 102"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
