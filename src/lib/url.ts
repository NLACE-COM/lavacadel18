// src/lib/url.ts
// La URL es la fuente de verdad. Todo el estado viaja en los search params.
// Ausente significa default. Ver docs/BRIEF.md sección 6.

import {
  DEFAULTS,
  DIAS_OPCIONES,
  FICHAS,
  FICHAS_DEFAULT,
  ITEMS,
  MAX_PERSONAS,
  PRECIOS_ESTIMADOS,
  type Apetito,
  type ItemId,
  type PagoNinos,
} from './constants'

export interface EstadoVaca {
  adultos: number
  ninos: number
  dias: 1 | 2 | 3
  apetito: Apetito
  /** ids de ficha marcadas. "terre" activa pipeño y helado. */
  fichas: string[]
  pagoNinos: PagoNinos
  /** solo los precios que el usuario editó */
  precios: Partial<Record<ItemId, number>>
}

const APETITOS: Apetito[] = ['normal', 'dieciochero', 'ecuatoriano']
const PAGOS: PagoNinos[] = ['nada', 'mitad', 'completo']
const IDS_FICHA = FICHAS.map((ficha) => ficha.id)
const IDS_ITEM = ITEMS.map((item) => item.id)

/**
 * Adultos admite cero para poder representar el estado "Falta gente" que pide
 * el brief. El máximo sigue siendo el del brief.
 */
function entero(valor: string | null, min: number, max: number, fallback: number): number {
  if (valor === null) return fallback
  const n = Number.parseInt(valor, 10)
  if (!Number.isFinite(n)) return fallback
  return Math.min(Math.max(n, min), max)
}

function unaDe<T extends string>(valor: string | null, opciones: T[], fallback: T): T {
  return opciones.includes(valor as T) ? (valor as T) : fallback
}

export function parsearEstado(search: string): EstadoVaca {
  const p = new URLSearchParams(search)

  // Los días son una opción, no un rango: un valor fuera de la lista vuelve al
  // default en vez de acotarse al máximo.
  const dias = Number.parseInt(p.get('d') ?? '', 10)
  const diasValido = (DIAS_OPCIONES as readonly number[]).includes(dias)
    ? (dias as 1 | 2 | 3)
    : DEFAULTS.dias

  const crudo = p.get('it')
  const fichas =
    crudo === null
      ? [...FICHAS_DEFAULT]
      : IDS_FICHA.filter((id) => crudo.split(',').includes(id))

  const precios: Partial<Record<ItemId, number>> = {}
  for (const id of IDS_ITEM) {
    const valor = p.get(`p_${id}`)
    if (valor === null) continue
    const n = Number.parseInt(valor, 10)
    if (!Number.isFinite(n) || n < 0 || n > 9_999_999) continue
    if (n === PRECIOS_ESTIMADOS[id]) continue
    precios[id] = n
  }

  return {
    adultos: entero(p.get('a'), 0, MAX_PERSONAS, DEFAULTS.adultos),
    ninos: entero(p.get('n'), 0, MAX_PERSONAS, DEFAULTS.ninos),
    dias: diasValido,
    apetito: unaDe(p.get('ap'), APETITOS, DEFAULTS.apetito),
    fichas,
    pagoNinos: unaDe(p.get('nk'), PAGOS, DEFAULTS.pagoNinos),
    precios,
  }
}

/** Solo escribe lo que difiere del default. La URL corta se lee y se pega mejor. */
export function serializarEstado(estado: EstadoVaca): string {
  const p = new URLSearchParams()

  if (estado.adultos !== DEFAULTS.adultos) p.set('a', String(estado.adultos))
  if (estado.ninos !== DEFAULTS.ninos) p.set('n', String(estado.ninos))
  if (estado.dias !== DEFAULTS.dias) p.set('d', String(estado.dias))
  if (estado.apetito !== DEFAULTS.apetito) p.set('ap', estado.apetito)
  if (estado.pagoNinos !== DEFAULTS.pagoNinos) p.set('nk', estado.pagoNinos)

  const enOrden = IDS_FICHA.filter((id) => estado.fichas.includes(id))
  if (enOrden.join(',') !== FICHAS_DEFAULT.join(',')) p.set('it', enOrden.join(','))

  for (const id of IDS_ITEM) {
    const precio = estado.precios[id]
    if (precio !== undefined && precio !== PRECIOS_ESTIMADOS[id]) {
      p.set(`p_${id}`, String(precio))
    }
  }

  // La coma se deja legible: el brief pide `it=carne,chori`, no `it=carne%2Cchori`.
  const query = p.toString().replace(/%2C/g, ',')
  return query ? `?${query}` : ''
}

/** URL absoluta de la vaca actual, para compartir. */
export function urlDeEstado(estado: EstadoVaca, origen: string, ruta = '/'): string {
  return `${origen}${ruta}${serializarEstado(estado)}`
}
