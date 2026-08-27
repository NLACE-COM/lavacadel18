// src/lib/url.test.ts
// La URL es la fuente de verdad: parsear y serializar tienen que dar la vuelta completa.

import { describe, expect, it } from 'vitest'
import { DEFAULTS, FICHAS_DEFAULT, PRECIOS_ESTIMADOS, itemsDeFichas } from './constants'
import { parsearEstado, serializarEstado, urlDeEstado } from './url'

describe('parsear', () => {
  it('sin parámetros usa los defaults', () => {
    const estado = parsearEstado('')
    expect(estado.adultos).toBe(DEFAULTS.adultos)
    expect(estado.ninos).toBe(DEFAULTS.ninos)
    expect(estado.dias).toBe(DEFAULTS.dias)
    expect(estado.apetito).toBe(DEFAULTS.apetito)
    expect(estado.pagoNinos).toBe(DEFAULTS.pagoNinos)
    expect(estado.fichas).toEqual(FICHAS_DEFAULT)
    expect(estado.precios).toEqual({})
  })

  it('lee el ejemplo del brief', () => {
    const estado = parsearEstado(
      '?a=8&n=3&d=1&ap=dieciochero&it=carne,chori,emp,terre,beb,pan,carbon,hielo&nk=mitad&p_carne=11990',
    )
    expect(estado.adultos).toBe(8)
    expect(estado.ninos).toBe(3)
    expect(estado.apetito).toBe('dieciochero')
    expect(estado.fichas).not.toContain('vino')
    expect(estado.precios.carne).toBe(11990)
    // la ficha "terre" activa los dos ítems del terremoto
    expect(itemsDeFichas(estado.fichas)).toContain('pipeno')
    expect(itemsDeFichas(estado.fichas)).toContain('helado')
  })

  it('it vacío significa vaca vacía, no default', () => {
    expect(parsearEstado('?it=').fichas).toEqual([])
  })

  it('ignora valores inválidos y vuelve al default', () => {
    const estado = parsearEstado('?a=hola&d=9&ap=vegano&nk=todo&it=carne,volantin')
    expect(estado.adultos).toBe(DEFAULTS.adultos)
    expect(estado.dias).toBe(DEFAULTS.dias)
    expect(estado.apetito).toBe(DEFAULTS.apetito)
    expect(estado.pagoNinos).toBe(DEFAULTS.pagoNinos)
    expect(estado.fichas).toEqual(['carne'])
  })

  it('acota a los máximos del brief', () => {
    expect(parsearEstado('?a=9999').adultos).toBe(200)
    expect(parsearEstado('?a=-5').adultos).toBe(0)
  })

  it('un precio igual al estimado no cuenta como editado', () => {
    expect(parsearEstado(`?p_carne=${PRECIOS_ESTIMADOS.carne}`).precios.carne).toBeUndefined()
  })
})

describe('serializar', () => {
  it('el estado por defecto no escribe nada', () => {
    expect(serializarEstado(parsearEstado(''))).toBe('')
  })

  it('deja las comas legibles', () => {
    const query = serializarEstado({ ...parsearEstado(''), fichas: ['carne', 'chori'] })
    expect(query).toContain('it=carne,chori')
  })

  it('da la vuelta completa', () => {
    const original = parsearEstado(
      '?a=12&n=4&d=3&ap=ecuatoriano&it=carne,vino,carbon&nk=completo&p_carne=11990&p_beb=1990',
    )
    expect(parsearEstado(serializarEstado(original))).toEqual(original)
  })

  it('arma la url para compartir', () => {
    const estado = { ...parsearEstado(''), adultos: 20 }
    expect(urlDeEstado(estado, 'https://lavacadel18.cl')).toBe('https://lavacadel18.cl/?a=20')
  })
})
