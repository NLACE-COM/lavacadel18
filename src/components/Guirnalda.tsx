// src/components/Guirnalda.tsx
// Banderines de fonda colgando de un cordel. Dos tonos, borde duro, sin bandera.
// El rojo no entra acá: ya está gastado en el sello, las fichas y compartir.

const ANCHO = 560
const BANDERINES = 14
const MEDIA_BASE = 13
const LARGO = 30

/** El cordel es una curva que cuelga. x avanza parejo, y baja al centro. */
function alturaDelCordel(t: number): number {
  return 4 + 40 * t * (1 - t)
}

export function Guirnalda({ className = '' }: { className?: string }) {
  const puntos = Array.from({ length: BANDERINES }, (_, i) => {
    const t = (i + 0.5) / BANDERINES
    return { x: t * ANCHO, y: alturaDelCordel(t), par: i % 2 === 0 }
  })

  return (
    <svg
      viewBox={`0 0 ${ANCHO} ${LARGO + 18}`}
      className={`w-full ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={`M 0 4 Q ${ANCHO / 2} 24 ${ANCHO} 4`}
        fill="none"
        stroke="var(--color-tinta)"
        strokeWidth="2"
      />
      {puntos.map((punto) => (
        <polygon
          key={punto.x}
          points={[
            `${punto.x - MEDIA_BASE},${punto.y}`,
            `${punto.x + MEDIA_BASE},${punto.y}`,
            `${punto.x},${punto.y + LARGO}`,
          ].join(' ')}
          fill={punto.par ? 'var(--color-tinta)' : 'var(--color-kraft-dark)'}
          stroke="var(--color-tinta)"
          strokeWidth="2"
          strokeLinejoin="miter"
        />
      ))}
    </svg>
  )
}
