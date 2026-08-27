// src/lib/formato.ts
// Formato de pesos chilenos, cantidades y unidades. Sin React, sin DOM.

const PESOS = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 })
const CANTIDAD = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 })

/** 12990 → "$12.990". Sin decimales, separador de miles con punto. */
export function formatoPesos(monto: number): string {
  return `$${PESOS.format(Math.round(monto))}`
}

/** 12990 → "12.990". El mismo número, sin el signo. */
export function formatoMonto(monto: number): string {
  return PESOS.format(Math.round(monto))
}

/** 3.5 → "3,5". 4 → "4". Coma decimal, sin ceros de relleno. */
export function formatoCantidad(cantidad: number): string {
  return CANTIDAD.format(cantidad)
}

/** 3.5, "kg" → "3,5 kg" */
export function formatoUnidad(cantidad: number, unidad: string): string {
  return `${formatoCantidad(cantidad)} ${unidad}`
}

/** 9.5 → "9,5". Personas que pagan, puede tener media persona. */
export function formatoPersonas(personas: number): string {
  return CANTIDAD.format(personas)
}
