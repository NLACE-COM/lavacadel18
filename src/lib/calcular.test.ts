// src/lib/calcular.test.ts
// Cada regla del brief tiene al menos un test. Ver docs/BRIEF.md sección 6.

import { describe, expect, it } from 'vitest'
import { calcularVaca, type EntradaVaca } from './calcular'
import { ITEMS, PRECIOS_ESTIMADOS, type ItemId } from './constants'

const TODOS: ItemId[] = ITEMS.map((item) => item.id)

function entrada(cambios: Partial<EntradaVaca> = {}): EntradaVaca {
  return {
    adultos: 1,
    ninos: 0,
    dias: 1,
    apetito: 'normal',
    items: TODOS,
    pagoNinos: 'mitad',
    precios: {},
    ...cambios,
  }
}

function cantidad(resultado: ReturnType<typeof calcularVaca>, id: ItemId): number {
  const linea = resultado.lineas.find((l) => l.id === id)
  if (!linea) throw new Error(`no hay línea para ${id}`)
  return linea.cantidadBase
}

function formatos(resultado: ReturnType<typeof calcularVaca>, id: ItemId): number {
  const linea = resultado.lineas.find((l) => l.id === id)
  if (!linea) throw new Error(`no hay línea para ${id}`)
  return linea.formatos
}

describe('raciones por adulto', () => {
  it('1 adulto, apetito normal, 1 día', () => {
    const r = calcularVaca(entrada())
    expect(cantidad(r, 'carne')).toBe(0.5) // 400 g, se redondea a medio kilo
    expect(cantidad(r, 'chori')).toBe(1)
    expect(cantidad(r, 'emp')).toBe(2)
    expect(cantidad(r, 'pipeno')).toBe(1) // 0,5 L se redondea a 1 L
    expect(cantidad(r, 'helado')).toBe(1) // 0,1 L se redondea a 1 L
    expect(cantidad(r, 'pan')).toBe(2)
    expect(formatos(r, 'vino')).toBe(1) // 0,5 L → 1 botella de 750 ml
    expect(formatos(r, 'beb')).toBe(1) // 0,5 L → 1 botella de 3 L
  })

  it('los días multiplican todo', () => {
    const r = calcularVaca(entrada({ adultos: 10, dias: 3 }))
    expect(cantidad(r, 'carne')).toBe(12) // 10 × 0,4 × 3 = 12 kg
    expect(cantidad(r, 'chori')).toBe(30)
    expect(cantidad(r, 'pipeno')).toBe(15)
  })
})

describe('niños', () => {
  it('8 adultos y 3 niños: comida a la mitad, bebida completa, alcohol en cero', () => {
    const r = calcularVaca(entrada({ adultos: 8, ninos: 3 }))
    // carne: 8 × 0,4 + 3 × 0,2 = 3,8 → 4 kg
    expect(cantidad(r, 'carne')).toBe(4)
    // choripán: 8 + 1,5 = 9,5 → 10
    expect(cantidad(r, 'chori')).toBe(10)
    // empanadas: 16 + 3 = 19
    expect(cantidad(r, 'emp')).toBe(19)
    // marraquetas: 16 + 3 = 19
    expect(cantidad(r, 'pan')).toBe(19)
    // bebidas: (8 + 3) × 0,5 = 5,5 L → 2 botellas de 3 L
    expect(formatos(r, 'beb')).toBe(2)
  })

  it('los niños no suman alcohol', () => {
    const soloAdultos = calcularVaca(entrada({ adultos: 6, ninos: 0 }))
    const conNinos = calcularVaca(entrada({ adultos: 6, ninos: 10 }))
    expect(cantidad(conNinos, 'pipeno')).toBe(cantidad(soloAdultos, 'pipeno'))
    expect(cantidad(conNinos, 'helado')).toBe(cantidad(soloAdultos, 'helado'))
    expect(formatos(conNinos, 'vino')).toBe(formatos(soloAdultos, 'vino'))
  })
})

describe('apetito', () => {
  it('multiplica la comida', () => {
    const normal = calcularVaca(entrada({ adultos: 10 }))
    const dieciochero = calcularVaca(entrada({ adultos: 10, apetito: 'dieciochero' }))
    const ecuatoriano = calcularVaca(entrada({ adultos: 10, apetito: 'ecuatoriano' }))
    expect(cantidad(normal, 'carne')).toBe(4) // 400 g
    expect(cantidad(dieciochero, 'carne')).toBe(5) // 500 g
    expect(cantidad(ecuatoriano, 'carne')).toBe(6) // 600 g
  })

  it('el apetito ecuatoriano no toca bebidas ni alcohol', () => {
    const normal = calcularVaca(entrada({ adultos: 10 }))
    const ecuatoriano = calcularVaca(entrada({ adultos: 10, apetito: 'ecuatoriano' }))
    expect(cantidad(ecuatoriano, 'pipeno')).toBe(cantidad(normal, 'pipeno'))
    expect(formatos(ecuatoriano, 'beb')).toBe(formatos(normal, 'beb'))
  })
})

describe('carbón', () => {
  it('1 kg por cada 2 kg de carne', () => {
    const r = calcularVaca(entrada({ adultos: 30 })) // 12 kg de carne
    expect(cantidad(r, 'carne')).toBe(12)
    expect(cantidad(r, 'carbon')).toBe(6)
  })

  it('nunca baja de 3 kg', () => {
    const r = calcularVaca(entrada({ adultos: 1 })) // 0,5 kg de carne → 0,25 kg
    expect(cantidad(r, 'carbon')).toBe(3)
  })

  it('se redondea hacia arriba al kilo', () => {
    const r = calcularVaca(entrada({ adultos: 20 })) // 8 kg de carne → 4 kg
    expect(cantidad(r, 'carbon')).toBe(4)
    const impar = calcularVaca(entrada({ adultos: 23 })) // 9,5 kg → 4,75 → 5 kg
    expect(impar.lineas.find((l) => l.id === 'carbon')?.cantidadBase).toBe(5)
  })
})

describe('hielo', () => {
  it('1 bolsa por cada 6 adultos', () => {
    const r = calcularVaca(entrada({ adultos: 8, ninos: 3 }))
    expect(cantidad(r, 'hielo')).toBe(2)
  })

  it('no se compra si no hay nada que enfriar', () => {
    const r = calcularVaca(entrada({ adultos: 8, items: ['carne', 'pan', 'carbon', 'hielo'] }))
    expect(r.lineas.find((l) => l.id === 'hielo')).toBeUndefined()
  })
})

describe('cuota', () => {
  it('se redondea hacia arriba a la centena', () => {
    const r = calcularVaca(entrada({ adultos: 8, ninos: 3, pagoNinos: 'mitad' }))
    expect(r.personasQuePagan).toBe(9.5)
    expect(r.cuota).not.toBeNull()
    expect(r.cuota! % 100).toBe(0)
    expect(r.cuota! * r.personasQuePagan).toBeGreaterThanOrEqual(r.total)
  })

  it('el vuelto es lo que sobra para el que compra', () => {
    const r = calcularVaca(entrada({ adultos: 7, ninos: 2 }))
    expect(r.vuelto).toBe(r.recaudado - r.total)
    expect(r.vuelto).toBeGreaterThanOrEqual(0)
  })

  it('los niños pagan según la opción elegida', () => {
    const nada = calcularVaca(entrada({ adultos: 8, ninos: 4, pagoNinos: 'nada' }))
    const mitad = calcularVaca(entrada({ adultos: 8, ninos: 4, pagoNinos: 'mitad' }))
    const completo = calcularVaca(entrada({ adultos: 8, ninos: 4, pagoNinos: 'completo' }))
    expect(nada.personasQuePagan).toBe(8)
    expect(mitad.personasQuePagan).toBe(10)
    expect(completo.personasQuePagan).toBe(12)
    expect(nada.cuotaNino).toBe(0)
    expect(mitad.cuotaNino).toBe(mitad.cuota! / 2)
    expect(completo.cuotaNino).toBe(completo.cuota)
    expect(nada.cuota!).toBeGreaterThan(completo.cuota!)
  })
})

describe('estados', () => {
  it('vaca vacía: no hay ítems marcados', () => {
    const r = calcularVaca(entrada({ items: [] }))
    expect(r.estado).toBe('sin-items')
    expect(r.total).toBe(0)
    expect(r.cuota).toBeNull()
  })

  it('cero adultos: falta gente y no hay cuota', () => {
    const r = calcularVaca(entrada({ adultos: 0, ninos: 4 }))
    expect(r.estado).toBe('sin-adultos')
    expect(r.cuota).toBeNull()
  })

  it('avisa cuando pasan de 50 personas', () => {
    expect(calcularVaca(entrada({ adultos: 50 })).avisoMayorista).toBe(false)
    expect(calcularVaca(entrada({ adultos: 48, ninos: 3 })).avisoMayorista).toBe(true)
  })
})

describe('precios', () => {
  it('usa los estimados cuando el usuario no edita', () => {
    const r = calcularVaca(entrada({ adultos: 10 }))
    const carne = r.lineas.find((l) => l.id === 'carne')!
    expect(carne.precioUnitario).toBe(PRECIOS_ESTIMADOS.carne)
    expect(carne.subtotal).toBe(4 * PRECIOS_ESTIMADOS.carne)
  })

  it('usa el precio editado cuando lo hay', () => {
    const r = calcularVaca(entrada({ adultos: 10, precios: { carne: 9990 } }))
    const carne = r.lineas.find((l) => l.id === 'carne')!
    expect(carne.precioUnitario).toBe(9990)
    expect(carne.subtotal).toBe(4 * 9990)
  })

  it('el precio de la bebida es por botella de 3 L, no por litro', () => {
    const r = calcularVaca(entrada({ adultos: 8, ninos: 3 }))
    const beb = r.lineas.find((l) => l.id === 'beb')!
    expect(beb.formatos).toBe(2)
    expect(beb.subtotal).toBe(2 * PRECIOS_ESTIMADOS.beb)
  })

  it('el total es la suma de los subtotales', () => {
    const r = calcularVaca(entrada({ adultos: 8, ninos: 3 }))
    const suma = r.lineas.reduce((s, l) => s + l.subtotal, 0)
    expect(r.total).toBe(suma)
  })
})

describe('pureza', () => {
  it('mismos inputs, mismo output', () => {
    const uno = calcularVaca(entrada({ adultos: 8, ninos: 3, dias: 2 }))
    const dos = calcularVaca(entrada({ adultos: 8, ninos: 3, dias: 2 }))
    expect(uno).toEqual(dos)
  })
})
