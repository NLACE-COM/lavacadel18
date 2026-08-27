// src/components/Stepper.tsx
// Menos, número editable, más. Mantener presionado acelera.

import { useEffect, useRef, useState } from 'react'

interface Props {
  label: string
  ayuda?: string
  valor: number
  min: number
  max: number
  onChange: (valor: number) => void
}

const PRIMER_PASO_MS = 400
const REPETICION_MS = 90

export function Stepper({ label, ayuda, valor, min, max, onChange }: Props) {
  const [borrador, setBorrador] = useState<string | null>(null)
  const timers = useRef<number[]>([])

  // El intervalo necesita el valor de ahora, no el del render en que arrancó.
  const valorRef = useRef(valor)
  valorRef.current = valor

  const acotar = (n: number) => Math.min(Math.max(n, min), max)

  function detener() {
    for (const id of timers.current) {
      window.clearTimeout(id)
      window.clearInterval(id)
    }
    timers.current = []
  }

  useEffect(() => detener, [])

  function pasar(delta: number) {
    onChange(acotar(valorRef.current + delta))
  }

  function mantener(delta: number) {
    const espera = window.setTimeout(() => {
      const repetir = window.setInterval(() => pasar(delta), REPETICION_MS)
      timers.current.push(repetir)
    }, PRIMER_PASO_MS)
    timers.current.push(espera)
  }

  function confirmarBorrador() {
    if (borrador === null) return
    const n = Number.parseInt(borrador, 10)
    onChange(Number.isFinite(n) ? acotar(n) : valor)
    setBorrador(null)
  }

  return (
    <div>
      <div className="mb-2">
        <span className="text-cuerpo font-semibold">{label}</span>
        {ayuda ? <span className="ml-2 text-nota text-tinta/70">{ayuda}</span> : null}
      </div>
      <div className="flex items-stretch rounded-[4px] border-2 border-tinta bg-kraft">
        <button
          type="button"
          aria-label={`Menos ${label.toLowerCase()}`}
          disabled={valor <= min}
          onClick={() => pasar(-1)}
          onPointerDown={() => mantener(-1)}
          onPointerUp={detener}
          onPointerLeave={detener}
          className="h-14 w-14 shrink-0 text-2xl font-semibold disabled:text-kraft-dark"
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          aria-label={label}
          value={borrador ?? String(valor)}
          min={min}
          max={max}
          onChange={(e) => setBorrador(e.target.value)}
          onBlur={confirmarBorrador}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
          }}
          className="rotulo w-full min-w-0 border-x-2 border-tinta bg-transparent text-center text-stepper"
        />
        <button
          type="button"
          aria-label={`Más ${label.toLowerCase()}`}
          disabled={valor >= max}
          onClick={() => pasar(1)}
          onPointerDown={() => mantener(1)}
          onPointerUp={detener}
          onPointerLeave={detener}
          className="h-14 w-14 shrink-0 text-2xl font-semibold disabled:text-kraft-dark"
        >
          +
        </button>
      </div>
    </div>
  )
}
