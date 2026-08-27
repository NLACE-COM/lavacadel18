// src/components/Sello.tsx
// El sello de la cuota. Es lo que la gente busca al abrir la página.

import { formatoMonto } from '../lib/formato'
import { Estrella } from './Estrella'

interface Props {
  cuota: number
  /** línea de 13 px bajo el sello. Depende de si los niños pagan. */
  pie: string
}

export function Sello({ cuota, pie }: Props) {
  return (
    <div className="flex flex-col items-center py-6">
      <div
        // La clave reinicia la animación cada vez que la cuota cambia.
        key={cuota}
        className="sello-anima rotulo flex items-center gap-3 border-[3px] border-sello px-6 py-3 text-cuota text-sello"
        style={{ transform: 'rotate(-6deg)' }}
      >
        <Estrella className="h-7 w-7 shrink-0" />
        <span>Pone ${formatoMonto(cuota)}</span>
      </div>
      <p className="mt-5 text-nota text-tinta/80">{pie}</p>
    </div>
  )
}
