// src/components/Boleta.tsx
// El elemento de firma. Es lo único con fondo blanco y es lo que se comparte.

import type { Resultado } from '../lib/calcular'
import { formatoMonto, formatoPersonas } from '../lib/formato'
import type { EstadoVaca } from '../lib/url'
import { Sello } from './Sello'

interface Props {
  estado: EstadoVaca
  resultado: Resultado
  /** texto bajo el sello, según cómo pagan los niños */
  pieDelSello: string
}

function plural(cantidad: number, singular: string, muchos: string): string {
  return `${cantidad} ${cantidad === 1 ? singular : muchos}`
}

function Linea({ children }: { children: React.ReactNode }) {
  return <div className="border-t-2 border-dashed border-tinta/30" role="presentation">{children}</div>
}

export function Boleta({ estado, resultado, pieDelSello }: Props) {
  const resumen = [
    plural(estado.adultos, 'ADULTO', 'ADULTOS'),
    plural(estado.ninos, 'NIÑO', 'NIÑOS'),
    plural(estado.dias, 'DÍA', 'DÍAS'),
  ].join(' · ')

  return (
    <section
      aria-label="La vaca"
      className="relative border-2 border-tinta bg-boleta text-tinta shadow-dura-lg"
    >
      <div className="dientes absolute inset-x-0 -top-[5px] h-[10px]" aria-hidden="true" />

      <div className="ticket px-5 pb-6 pt-5">
        <h2 className="rotulo text-center text-2xl">La Vaca del 18</h2>
        <p className="mt-1 text-center uppercase">{resumen}</p>

        {resultado.estado === 'sin-adultos' ? (
          <p className="mt-6 text-center">Falta gente. Marca al menos un adulto.</p>
        ) : resultado.estado === 'sin-items' ? (
          <p className="mt-6 text-center">Vaca vacía. Marca qué se compra.</p>
        ) : (
          <>
            <div className="mt-4" />
            <Linea>
              <ul className="py-2">
                {resultado.lineas.map((linea) => (
                  <li key={linea.id} className="flex gap-2 py-0.5">
                    <span className="flex-1 truncate">{linea.nombre}</span>
                    <span className="w-24 shrink-0 whitespace-nowrap text-right text-tinta/70">
                      {linea.cantidadTexto}
                    </span>
                    <span className="w-20 shrink-0 whitespace-nowrap text-right tabular-nums">
                      {formatoMonto(linea.subtotal)}
                    </span>
                  </li>
                ))}
              </ul>
            </Linea>

            <Linea>
              <div className="flex justify-between py-2 font-semibold">
                <span>TOTAL ESTIMADO</span>
                <span className="tabular-nums">{formatoMonto(resultado.total)}</span>
              </div>
              <div className="pb-2 text-tinta/70">
                PAGAN {formatoPersonas(resultado.personasQuePagan)} PERSONAS
              </div>
            </Linea>

            <Linea>
              {resultado.cuota !== null ? (
                <Sello cuota={resultado.cuota} pie={pieDelSello} />
              ) : null}
            </Linea>

            {resultado.vuelto > 0 ? (
              <p className="text-center text-tinta/70">
                Sobran ${formatoMonto(resultado.vuelto)} para el que compra
              </p>
            ) : null}

            <p className="mt-2 text-center text-tinta/60">
              Cuota redondeada hacia arriba a la centena.
            </p>

            {resultado.avisoMayorista ? (
              <p className="mt-4 border-2 border-tinta/30 p-2 text-center">
                Con esta cantidad conviene cotizar al por mayor. La cuenta sigue siendo válida.
              </p>
            ) : null}
          </>
        )}
      </div>

      <div className="dientes absolute inset-x-0 -bottom-[5px] h-[10px]" aria-hidden="true" />
    </section>
  )
}
