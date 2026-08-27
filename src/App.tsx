// src/App.tsx
// Una página. El estado vive en la URL. Los cálculos viven en src/lib.

import { useEffect, useMemo, useRef, useState } from 'react'
import { BarraInferior } from './components/BarraInferior'
import { Boleta } from './components/Boleta'
import { Ficha } from './components/Ficha'
import { Precio } from './components/Precio'
import { Stepper } from './components/Stepper'
import { calcularVaca } from './lib/calcular'
import { TITULO_COMPARTIR, textoCompartir } from './lib/compartir'
import {
  DIAS_OPCIONES,
  FICHAS,
  ITEMS,
  MAX_PERSONAS,
  PRECIOS_ESTIMADOS,
  itemsDeFichas,
  type Apetito,
  type ItemId,
  type PagoNinos,
} from './lib/constants'
import { formatoMonto } from './lib/formato'
import { parsearEstado, serializarEstado, urlDeEstado, type EstadoVaca } from './lib/url'

const APETITOS: { id: Apetito; nombre: string; ayuda: string }[] = [
  { id: 'normal', nombre: 'Normal', ayuda: '400 g de carne por persona' },
  { id: 'dieciochero', nombre: 'Dieciochero', ayuda: '500 g de carne por persona' },
  { id: 'ecuatoriano', nombre: 'Ecuatoriano', ayuda: '600 g y nadie se levanta de la mesa' },
]

const PAGOS: { id: PagoNinos; nombre: string }[] = [
  { id: 'nada', nombre: 'Nada' },
  { id: 'mitad', nombre: 'La mitad' },
  { id: 'completo', nombre: 'Completo' },
]

function Seccion({ pregunta, ayuda, children }: {
  pregunta: string
  ayuda?: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-8">
      <h2 className="text-pregunta font-semibold">{pregunta}</h2>
      {ayuda ? <p className="mt-1 text-nota text-tinta/70">{ayuda}</p> : null}
      <div className="mt-3">{children}</div>
    </section>
  )
}

export default function App() {
  const [estado, setEstado] = useState<EstadoVaca>(() => parsearEstado(window.location.search))
  const [aviso, setAviso] = useState<string | null>(null)
  const [barraVisible, setBarraVisible] = useState(false)
  const boletaRef = useRef<HTMLDivElement>(null)

  // La URL es la fuente de verdad: cada cambio la reescribe sin recargar.
  useEffect(() => {
    const query = serializarEstado(estado)
    window.history.replaceState(null, '', `${window.location.pathname}${query}`)
  }, [estado])

  useEffect(() => {
    const alVolver = () => setEstado(parsearEstado(window.location.search))
    window.addEventListener('popstate', alVolver)
    return () => window.removeEventListener('popstate', alVolver)
  }, [])

  // La barra inferior aparece cuando la boleta deja de verse.
  useEffect(() => {
    const nodo = boletaRef.current
    if (!nodo) return
    const observador = new IntersectionObserver(
      ([entrada]) => setBarraVisible(entrada ? !entrada.isIntersecting : false),
      { threshold: 0.15 },
    )
    observador.observe(nodo)
    return () => observador.disconnect()
  }, [])

  useEffect(() => {
    if (aviso === null) return
    const id = window.setTimeout(() => setAviso(null), 3000)
    return () => window.clearTimeout(id)
  }, [aviso])

  const items = useMemo(() => itemsDeFichas(estado.fichas), [estado.fichas])
  const resultado = useMemo(
    () =>
      calcularVaca({
        adultos: estado.adultos,
        ninos: estado.ninos,
        dias: estado.dias,
        apetito: estado.apetito,
        items,
        pagoNinos: estado.pagoNinos,
        precios: estado.precios,
      }),
    [estado, items],
  )

  function cambiar(parcial: Partial<EstadoVaca>) {
    setEstado((previo) => ({ ...previo, ...parcial }))
  }

  function alternarFicha(id: string) {
    setEstado((previo) => ({
      ...previo,
      fichas: previo.fichas.includes(id)
        ? previo.fichas.filter((f) => f !== id)
        : [...previo.fichas, id],
    }))
  }

  function cambiarPrecio(id: ItemId, valor: number | null) {
    setEstado((previo) => {
      const precios = { ...previo.precios }
      if (valor === null || valor === PRECIOS_ESTIMADOS[id]) delete precios[id]
      else precios[id] = valor
      return { ...previo, precios }
    })
  }

  async function compartir() {
    if (resultado.estado !== 'ok') return
    const url = urlDeEstado(estado, window.location.origin, window.location.pathname)
    const texto = textoCompartir(estado, resultado, url)
    try {
      if (navigator.share) {
        await navigator.share({ title: TITULO_COMPARTIR, text: texto })
        return
      }
      await navigator.clipboard.writeText(texto)
      setAviso('Copiado. Pégalo en el grupo.')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setAviso('No se pudo compartir. Copia el link de arriba.')
    }
  }

  const pieDelSello =
    estado.ninos === 0 || estado.pagoNinos === 'nada'
      ? 'cada adulto'
      : estado.pagoNinos === 'completo'
        ? 'cada persona'
        : `cada adulto · niños $${formatoMonto(resultado.cuotaNino ?? 0)}`

  return (
    <div className="mx-auto max-w-contenido px-5 pb-40">
      <header className="pt-10">
        <h1 className="rotulo text-titulo md:text-[64px]">La Vaca del 18</h1>
        <p className="mt-2 text-tinta/80">
          Cuántos van, qué se compra y cuánto pone cada uno. Para pegar en el grupo.
        </p>
      </header>

      <Seccion pregunta="¿Cuántos van?">
        <div className="grid grid-cols-1 gap-4">
          <Stepper
            label="Adultos"
            valor={estado.adultos}
            min={0}
            max={MAX_PERSONAS}
            onChange={(adultos) => cambiar({ adultos })}
          />
          <Stepper
            label="Niños"
            ayuda="Sin edad para tomar. Comen la mitad."
            valor={estado.ninos}
            min={0}
            max={MAX_PERSONAS}
            onChange={(ninos) => cambiar({ ninos })}
          />
        </div>
      </Seccion>

      <Seccion
        pregunta="¿Cuántos días de asado?"
        ayuda="El 18 y el 19 son feriados. Hay grupos que repiten."
      >
        <div className="grid grid-cols-3 gap-2">
          {DIAS_OPCIONES.map((dias) => (
            <Ficha
              key={dias}
              nombre={dias === 1 ? '1 día' : `${dias} días`}
              activa={estado.dias === dias}
              onClick={() => cambiar({ dias })}
            />
          ))}
        </div>
      </Seccion>

      <Seccion pregunta="¿Cuánto comen?">
        <div className="grid grid-cols-1 gap-2">
          {APETITOS.map((opcion) => (
            <Ficha
              key={opcion.id}
              nombre={opcion.nombre}
              ayuda={opcion.ayuda}
              activa={estado.apetito === opcion.id}
              onClick={() => cambiar({ apetito: opcion.id })}
            />
          ))}
        </div>
      </Seccion>

      <Seccion pregunta="¿Qué compramos?">
        <div className="grid grid-cols-2 gap-2">
          {FICHAS.map((ficha) => (
            <Ficha
              key={ficha.id}
              nombre={ficha.nombre}
              ayuda={ficha.racionTexto}
              activa={estado.fichas.includes(ficha.id)}
              onClick={() => alternarFicha(ficha.id)}
            />
          ))}
        </div>
        <p className="mt-2 text-nota text-tinta/70">
          Pipeño más helado de piña. La granadina va por tu cuenta.
        </p>
      </Seccion>

      <details className="mt-8 border-2 border-tinta bg-kraft/40 p-4">
        <summary className="cursor-pointer text-pregunta font-semibold">
          Precios estimados. Tócalos si tienes mejores.
        </summary>
        <div className="mt-3">
          {ITEMS.map((item) => (
            <Precio
              key={item.id}
              item={item}
              valor={estado.precios[item.id] ?? PRECIOS_ESTIMADOS[item.id]}
              editado={estado.precios[item.id] !== undefined}
              onChange={(valor) => cambiarPrecio(item.id, valor)}
            />
          ))}
          <p className="mt-3 text-nota text-tinta/70">
            Son referencias para calcular. El precio real lo pone la carnicería.
          </p>
        </div>
      </details>

      <Seccion pregunta="¿Los niños pagan?">
        <div className="grid grid-cols-3 gap-2">
          {PAGOS.map((opcion) => (
            <Ficha
              key={opcion.id}
              nombre={opcion.nombre}
              activa={estado.pagoNinos === opcion.id}
              onClick={() => cambiar({ pagoNinos: opcion.id })}
            />
          ))}
        </div>
      </Seccion>

      <div ref={boletaRef} className="mt-10">
        <Boleta estado={estado} resultado={resultado} pieDelSello={pieDelSello} />
      </div>

      <button
        type="button"
        onClick={compartir}
        disabled={resultado.estado !== 'ok'}
        className="mt-6 h-13 w-full rounded-[4px] bg-sello font-semibold text-boleta shadow-dura active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:bg-kraft-dark disabled:text-tinta/50 disabled:shadow-none"
      >
        Compartir la vaca
      </button>

      <p aria-live="polite" className="mt-2 min-h-5 text-center text-nota">
        {aviso}
      </p>

      <footer className="mt-10 border-t-2 border-kraft-dark pt-4 text-nota text-tinta/70">
        <p>Precios estimados. Ajústalos si tienes mejores.</p>
        <p>Hecho en una clase con Claude Code. Código en GitHub.</p>
        <p>lavacadel18.cl</p>
      </footer>

      <BarraInferior
        cuota={resultado.cuota}
        visible={barraVisible}
        onCompartir={compartir}
      />
    </div>
  )
}
