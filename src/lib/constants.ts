// src/lib/constants.ts
// Única fuente de reglas de negocio. Ver docs/BRIEF.md sección 6.

export type ItemId =
  | 'carne'
  | 'chori'
  | 'emp'
  | 'pipeno'
  | 'helado'
  | 'vino'
  | 'beb'
  | 'pan'
  | 'carbon'
  | 'hielo'

export type Apetito = 'normal' | 'dieciochero' | 'ecuatoriano'
export type PagoNinos = 'nada' | 'mitad' | 'completo'
export type Tipo = 'comida' | 'alcohol' | 'bebida' | 'insumo'

export interface Item {
  id: ItemId
  nombre: string
  tipo: Tipo
  /** ración por adulto por día, en la unidad base */
  racion: number
  /** unidad base para calcular: kg, un, l, bolsa */
  unidadBase: 'kg' | 'un' | 'l' | 'bolsa'
  /** tamaño del formato de venta en unidad base. Ej: botella de vino = 0.75 l */
  formatoVenta: number
  /** cuánta unidad base cubre el precio unitario. Ej: bebida de 3 L = 3 */
  precioPor: number
  /** cómo se nombra el formato de venta en la boleta */
  unidadVenta: string
  /** la boleta muestra la unidad base (4 kg) o el número de formatos (2 bot) */
  mostrarComo: 'base' | 'formato'
  /** texto de unidad para la sección de precios */
  unidadPrecio: string
  /** cómo se muestra la ración en la ficha */
  racionTexto: string
  /** activo por defecto */
  defaultActivo: boolean
  /** plantilla para el texto de compartir. {c} es la cantidad */
  lista: string
  /** plantilla cuando la cantidad es 1. Si falta, se usa `lista` */
  listaUno?: string
}

export const ITEMS: Item[] = [
  { id: 'carne', nombre: 'Carne para asado', tipo: 'comida', racion: 0.4, unidadBase: 'kg', formatoVenta: 0.5, precioPor: 1, unidadVenta: 'kg', mostrarComo: 'base', unidadPrecio: 'por kilo', racionTexto: '400 g por adulto', defaultActivo: true, lista: '{c} kg de carne' },
  { id: 'chori', nombre: 'Choripán', tipo: 'comida', racion: 1, unidadBase: 'un', formatoVenta: 1, precioPor: 1, unidadVenta: 'un', mostrarComo: 'base', unidadPrecio: 'por unidad', racionTexto: '1 por adulto', defaultActivo: true, lista: '{c} choripanes', listaUno: '1 choripán' },
  { id: 'emp', nombre: 'Empanadas de pino', tipo: 'comida', racion: 2, unidadBase: 'un', formatoVenta: 1, precioPor: 1, unidadVenta: 'un', mostrarComo: 'base', unidadPrecio: 'por unidad', racionTexto: '2 por adulto', defaultActivo: true, lista: '{c} empanadas', listaUno: '1 empanada' },
  { id: 'pipeno', nombre: 'Pipeño', tipo: 'alcohol', racion: 0.5, unidadBase: 'l', formatoVenta: 1, precioPor: 1, unidadVenta: 'L', mostrarComo: 'base', unidadPrecio: 'por litro', racionTexto: 'medio litro por adulto', defaultActivo: true, lista: '{c} L de pipeño' },
  { id: 'helado', nombre: 'Helado de piña', tipo: 'alcohol', racion: 0.1, unidadBase: 'l', formatoVenta: 1, precioPor: 1, unidadVenta: 'L', mostrarComo: 'base', unidadPrecio: 'por litro', racionTexto: '100 ml por adulto', defaultActivo: true, lista: '{c} L de helado de piña' },
  { id: 'vino', nombre: 'Vino', tipo: 'alcohol', racion: 0.5, unidadBase: 'l', formatoVenta: 0.75, precioPor: 0.75, unidadVenta: 'bot', mostrarComo: 'formato', unidadPrecio: 'por botella', racionTexto: 'media botella por adulto', defaultActivo: false, lista: '{c} botellas de vino', listaUno: '1 botella de vino' },
  { id: 'beb', nombre: 'Bebidas', tipo: 'bebida', racion: 0.5, unidadBase: 'l', formatoVenta: 3, precioPor: 3, unidadVenta: 'bot 3 L', mostrarComo: 'formato', unidadPrecio: 'por botella de 3 L', racionTexto: 'medio litro por persona', defaultActivo: true, lista: '{c} bebidas de 3 L', listaUno: '1 bebida de 3 L' },
  { id: 'pan', nombre: 'Marraquetas', tipo: 'comida', racion: 2, unidadBase: 'un', formatoVenta: 1, precioPor: 1, unidadVenta: 'un', mostrarComo: 'base', unidadPrecio: 'por unidad', racionTexto: '2 por persona', defaultActivo: true, lista: '{c} marraquetas', listaUno: '1 marraqueta' },
  { id: 'carbon', nombre: 'Carbón', tipo: 'insumo', racion: 0, unidadBase: 'kg', formatoVenta: 1, precioPor: 1, unidadVenta: 'kg', mostrarComo: 'base', unidadPrecio: 'por kilo', racionTexto: '1 kg por cada 2 kg de carne', defaultActivo: true, lista: '{c} kg de carbón' },
  { id: 'hielo', nombre: 'Hielo', tipo: 'insumo', racion: 0, unidadBase: 'bolsa', formatoVenta: 1, precioPor: 1, unidadVenta: 'bolsas', mostrarComo: 'base', unidadPrecio: 'por bolsa', racionTexto: '1 bolsa cada 6 adultos', defaultActivo: true, lista: '{c} bolsas de hielo', listaUno: '1 bolsa de hielo' },
]

/**
 * Fichas de la sección "¿Qué compramos?". Una ficha puede activar más de un
 * ítem: "Terremoto" activa pipeño y helado de piña juntos. El id de la ficha
 * es también el token que viaja en el parámetro `it` de la URL.
 */
export interface Ficha {
  id: string
  nombre: string
  racionTexto: string
  items: ItemId[]
  nota?: string
}

export const FICHAS: Ficha[] = [
  { id: 'carne', nombre: 'Carne para asado', racionTexto: '400 g por adulto', items: ['carne'] },
  { id: 'chori', nombre: 'Choripán', racionTexto: '1 por adulto', items: ['chori'] },
  { id: 'emp', nombre: 'Empanadas de pino', racionTexto: '2 por adulto', items: ['emp'] },
  { id: 'terre', nombre: 'Terremoto', racionTexto: 'medio litro por adulto', items: ['pipeno', 'helado'], nota: 'Pipeño más helado de piña. La granadina va por tu cuenta.' },
  { id: 'vino', nombre: 'Vino', racionTexto: 'media botella por adulto', items: ['vino'] },
  { id: 'beb', nombre: 'Bebidas', racionTexto: 'medio litro por persona', items: ['beb'] },
  { id: 'pan', nombre: 'Marraquetas', racionTexto: '2 por persona', items: ['pan'] },
  { id: 'carbon', nombre: 'Carbón', racionTexto: '1 kg por cada 2 kg de carne', items: ['carbon'] },
  { id: 'hielo', nombre: 'Hielo', racionTexto: '1 bolsa cada 6 adultos', items: ['hielo'] },
]

/** Ítems que obligan a comprar hielo cuando están activos. */
export const HIELO_REQUIERE: ItemId[] = ['pipeno', 'helado', 'vino', 'beb']

/** Precios estimados en CLP. Editables por el usuario. Nunca presentar como reales. */
export const PRECIOS_ESTIMADOS: Record<ItemId, number> = {
  carne: 12990,
  chori: 1500,
  emp: 2500,
  pipeno: 3000,
  helado: 4500,
  vino: 4990,
  beb: 2490,
  pan: 250,
  carbon: 2990,
  hielo: 2500,
}

/** Multiplica solo tipo 'comida'. */
export const APETITO: Record<Apetito, number> = {
  normal: 1,
  dieciochero: 1.25,
  ecuatoriano: 1.5,
}

/** Factor de ración de niños por tipo de ítem. */
export const NINOS_RACION: Record<Tipo, number> = {
  comida: 0.5,
  alcohol: 0,
  bebida: 1,
  insumo: 0,
}

/** Cuánto paga un niño respecto a un adulto. */
export const PAGO_NINOS: Record<PagoNinos, number> = {
  nada: 0,
  mitad: 0.5,
  completo: 1,
}

export const CARBON_KG_POR_KG_CARNE = 0.5
export const CARBON_MINIMO_KG = 3
export const HIELO_ADULTOS_POR_BOLSA = 6
export const REDONDEO_CUOTA = 100
export const MAX_PERSONAS = 200
export const AVISO_MAYORISTA_DESDE = 50
export const DIAS_OPCIONES = [1, 2, 3] as const

export const DEFAULTS = {
  adultos: 8,
  ninos: 0,
  dias: 1 as 1 | 2 | 3,
  apetito: 'normal' as Apetito,
  pagoNinos: 'mitad' as PagoNinos,
}

/** Ítems que activa una lista de fichas. Sin repetidos y en el orden de ITEMS. */
export function itemsDeFichas(fichas: string[]): ItemId[] {
  const activos = new Set<ItemId>()
  for (const ficha of FICHAS) {
    if (fichas.includes(ficha.id)) ficha.items.forEach((id) => activos.add(id))
  }
  return ITEMS.filter((item) => activos.has(item.id)).map((item) => item.id)
}

/** Fichas marcadas al abrir la página sin parámetros. */
export const FICHAS_DEFAULT: string[] = FICHAS.filter((ficha) =>
  ficha.items.every((id) => ITEMS.find((item) => item.id === id)?.defaultActivo),
).map((ficha) => ficha.id)
