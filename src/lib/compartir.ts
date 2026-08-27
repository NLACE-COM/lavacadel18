// src/lib/compartir.ts
// Arma el texto plano que se pega en el grupo. Copy en docs/COPY.md.

import type { Resultado } from './calcular'
import { formatoMonto } from './formato'
import type { EstadoVaca } from './url'

export const TITULO_COMPARTIR = 'La Vaca del 18'

function personas(cantidad: number, singular: string, plural: string): string {
  return `${cantidad} ${cantidad === 1 ? singular : plural}`
}

/** Frase de quiénes van. Sin niños no se menciona a los niños. */
export function frasePersonas(estado: EstadoVaca): string {
  const adultos = personas(estado.adultos, 'adulto', 'adultos')
  if (estado.ninos === 0) return `Somos ${adultos}.`
  return `Somos ${adultos} y ${personas(estado.ninos, 'niño', 'niños')}.`
}

export function textoCompartir(
  estado: EstadoVaca,
  resultado: Resultado,
  url: string,
): string {
  const lista = resultado.lineas.map((linea) => linea.textoLista).join(', ')
  const cuota = resultado.cuota === null ? '' : formatoMonto(resultado.cuota)
  return [
    TITULO_COMPARTIR,
    `${frasePersonas(estado)} Ponen $${cuota} cada adulto.`,
    `Lista: ${lista}.`,
    `Total estimado: $${formatoMonto(resultado.total)}`,
    url,
  ].join('\n')
}
