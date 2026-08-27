// src/components/Estrella.tsx
// La solitaria. Va sola, nunca dentro de un bloque rojo, blanco y azul.

export function Estrella({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <polygon points="12,1 15.1,8.6 23.2,9.2 17,14.5 19,22.4 12,18.1 5,22.4 7,14.5 0.8,9.2 8.9,8.6" />
    </svg>
  )
}
