// src/components/BarraInferior.tsx
// Aparece cuando la boleta sale de pantalla. La cuota siempre a la vista.

import { formatoMonto } from '../lib/formato'

interface Props {
  cuota: number | null
  visible: boolean
  onCompartir: () => void
}

export function BarraInferior({ cuota, visible, onCompartir }: Props) {
  return (
    <div
      aria-hidden={!visible}
      className={[
        'fixed inset-x-0 bottom-0 z-10 bg-tinta text-boleta',
        visible ? '' : 'pointer-events-none translate-y-full opacity-0',
      ].join(' ')}
      style={{ transition: 'transform 150ms ease-out, opacity 150ms ease-out' }}
    >
      <div className="mx-auto flex max-w-contenido items-center justify-between gap-4 px-5 py-3">
        <div>
          <div className="text-nota text-boleta/70">Pone</div>
          <div className="rotulo text-[28px]">
            {cuota === null ? '—' : `$${formatoMonto(cuota)}`}
          </div>
        </div>
        <button
          type="button"
          tabIndex={visible ? 0 : -1}
          disabled={cuota === null}
          onClick={onCompartir}
          className="rounded-[4px] bg-sello px-5 py-3 font-semibold text-boleta disabled:bg-boleta/20 disabled:text-boleta/50"
        >
          Compartir
        </button>
      </div>
    </div>
  )
}
