// src/components/Precio.tsx
// Fila de precio editable. Etiqueta "estimado" mientras no se toque, "tuyo" después.

import type { Item } from '../lib/constants'

interface Props {
  item: Item
  /** precio vigente: el editado o el estimado */
  valor: number
  editado: boolean
  onChange: (valor: number | null) => void
}

export function Precio({ item, valor, editado, onChange }: Props) {
  return (
    <div className="flex items-start justify-between gap-3 border-b-2 border-kraft-dark py-3 last:border-b-0">
      <div className="min-w-0">
        <div className="text-cuerpo">{item.nombre}</div>
        <div className="text-nota text-tinta/70">{item.unidadPrecio}</div>
        {editado ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="mt-1 text-nota text-fonda underline"
          >
            Volver al estimado
          </button>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center rounded-[4px] border-2 border-tinta bg-kraft px-2">
          <span aria-hidden="true">$</span>
          <input
            type="number"
            inputMode="numeric"
            aria-label={`Precio de ${item.nombre}, ${item.unidadPrecio}`}
            value={String(valor)}
            min={0}
            onChange={(e) => {
              const n = Number.parseInt(e.target.value, 10)
              onChange(Number.isFinite(n) && n >= 0 ? n : null)
            }}
            className="w-24 bg-transparent py-2 text-right"
          />
        </div>
        <span
          className={[
            'w-16 shrink-0 text-nota',
            editado ? 'text-fonda' : 'text-kraft-dark',
          ].join(' ')}
        >
          {editado ? 'tuyo' : 'estimado'}
        </span>
      </div>
    </div>
  )
}
