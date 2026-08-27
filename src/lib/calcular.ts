// src/lib/calcular.ts
// Función pura. Mismos inputs, mismo output. Sin React, sin DOM.
// Las reglas viven en constants.ts. Aquí solo se aplican.

import {
  APETITO,
  AVISO_MAYORISTA_DESDE,
  CARBON_KG_POR_KG_CARNE,
  CARBON_MINIMO_KG,
  HIELO_ADULTOS_POR_BOLSA,
  HIELO_REQUIERE,
  ITEMS,
  NINOS_RACION,
  PAGO_NINOS,
  PRECIOS_ESTIMADOS,
  REDONDEO_CUOTA,
  type Apetito,
  type Item,
  type ItemId,
  type PagoNinos,
} from './constants'
import { formatoCantidad } from './formato'

export interface EntradaVaca {
  adultos: number
  ninos: number
  dias: 1 | 2 | 3
  apetito: Apetito
  /** ítems activos. Los que no están, no se compran. */
  items: ItemId[]
  pagoNinos: PagoNinos
  /** precios editados por el usuario. Los ausentes usan PRECIOS_ESTIMADOS. */
  precios: Partial<Record<ItemId, number>>
}

export interface LineaBoleta {
  id: ItemId
  nombre: string
  /** cantidad a comprar en la unidad base: kg, unidades, litros, bolsas */
  cantidadBase: number
  /** cuántos formatos de venta son. Ej: 2 botellas de 3 L */
  formatos: number
  /** lo que se imprime en la boleta: 4 kg, 2 bot 3 L, 20 un */
  cantidadTexto: string
  precioUnitario: number
  subtotal: number
  /** frase para el texto de compartir: "4 kg de carne" */
  textoLista: string
}

export type EstadoVaca = 'ok' | 'sin-adultos' | 'sin-items'

export interface Resultado {
  estado: EstadoVaca
  lineas: LineaBoleta[]
  total: number
  personasQuePagan: number
  /** cuota por adulto, redondeada hacia arriba a la centena. null si no se calcula. */
  cuota: number | null
  /** lo que pone cada niño. 0 si no pagan. null si no se calcula. */
  cuotaNino: number | null
  /** suma de lo que ponen todos */
  recaudado: number
  /** recaudado menos el total. Queda para el que compra. */
  vuelto: number
  avisoMayorista: boolean
}

/** Redondea hacia arriba al múltiplo pedido. Evita ruido de punto flotante. */
function techo(valor: number, multiplo: number): number {
  if (multiplo <= 0) return valor
  return Math.ceil(redondear(valor / multiplo, 6)) * multiplo
}

/** Recorta la basura binaria de 0.1 + 0.2 antes de comparar o redondear. */
function redondear(valor: number, decimales: number): number {
  const f = 10 ** decimales
  return Math.round(valor * f) / f
}

/** Ración base en unidad base, antes de redondear al formato de venta. */
function racionBase(item: Item, entrada: EntradaVaca): number {
  const { adultos, ninos, dias, apetito } = entrada
  const factorApetito = item.tipo === 'comida' ? APETITO[apetito] : 1
  const porAdulto = item.racion * factorApetito
  const porNino = item.racion * NINOS_RACION[item.tipo] * factorApetito
  return (adultos * porAdulto + ninos * porNino) * dias
}

/** Carbón: 1 kg por cada 2 kg de carne comprada, mínimo 3 kg. */
function carbonBase(kgCarne: number): number {
  return Math.max(kgCarne * CARBON_KG_POR_KG_CARNE, CARBON_MINIMO_KG)
}

/** Hielo: 1 bolsa por cada 6 adultos, solo si hay algo que enfriar. */
function hieloBase(entrada: EntradaVaca): number {
  const hayQueEnfriar = HIELO_REQUIERE.some((id) => entrada.items.includes(id))
  if (!hayQueEnfriar) return 0
  return (entrada.adultos / HIELO_ADULTOS_POR_BOLSA) * entrada.dias
}

function textoCantidad(item: Item, cantidadBase: number, formatos: number): string {
  const valor = item.mostrarComo === 'formato' ? formatos : cantidadBase
  return `${formatoCantidad(valor)} ${item.unidadVenta}`
}

function textoLista(item: Item, cantidadBase: number, formatos: number): string {
  const valor = item.mostrarComo === 'formato' ? formatos : cantidadBase
  if (valor === 1 && item.listaUno) return item.listaUno
  return item.lista.replace('{c}', formatoCantidad(valor))
}

export function calcularVaca(entrada: EntradaVaca): Resultado {
  const activos = ITEMS.filter((item) => entrada.items.includes(item.id))
  const lineas: LineaBoleta[] = []

  // La carne se calcula primero: el carbón depende de cuántos kilos se compran.
  let kgCarne = 0
  const carne = activos.find((item) => item.id === 'carne')
  if (carne) {
    kgCarne = techo(racionBase(carne, entrada), carne.formatoVenta)
  }

  for (const item of activos) {
    let base: number
    if (item.id === 'carbon') base = carbonBase(kgCarne)
    else if (item.id === 'hielo') base = hieloBase(entrada)
    else base = racionBase(item, entrada)

    if (base <= 0) continue

    const cantidadBase = redondear(techo(base, item.formatoVenta), 4)
    const formatos = Math.round(cantidadBase / item.formatoVenta)
    const precioUnitario = entrada.precios[item.id] ?? PRECIOS_ESTIMADOS[item.id]
    const subtotal = Math.round((cantidadBase / item.precioPor) * precioUnitario)

    lineas.push({
      id: item.id,
      nombre: item.nombre,
      cantidadBase,
      formatos,
      cantidadTexto: textoCantidad(item, cantidadBase, formatos),
      precioUnitario,
      subtotal,
      textoLista: textoLista(item, cantidadBase, formatos),
    })
  }

  const total = lineas.reduce((suma, linea) => suma + linea.subtotal, 0)
  const personasQuePagan = entrada.adultos + entrada.ninos * PAGO_NINOS[entrada.pagoNinos]
  const avisoMayorista = entrada.adultos + entrada.ninos > AVISO_MAYORISTA_DESDE

  const estado: EstadoVaca =
    entrada.adultos < 1 ? 'sin-adultos' : lineas.length === 0 ? 'sin-items' : 'ok'

  if (estado !== 'ok' || personasQuePagan <= 0) {
    return {
      estado,
      lineas,
      total,
      personasQuePagan,
      cuota: null,
      cuotaNino: null,
      recaudado: 0,
      vuelto: 0,
      avisoMayorista,
    }
  }

  const cuota = techo(total / personasQuePagan, REDONDEO_CUOTA)
  const cuotaNino = cuota * PAGO_NINOS[entrada.pagoNinos]
  const recaudado = cuota * entrada.adultos + cuotaNino * entrada.ninos

  return {
    estado,
    lineas,
    total,
    personasQuePagan,
    cuota,
    cuotaNino,
    recaudado,
    vuelto: recaudado - total,
    avisoMayorista,
  }
}
