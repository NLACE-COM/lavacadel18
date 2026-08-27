// src/components/Ficha.tsx
// Botón rectangular seleccionable. Ítems, apetito, días y pago de niños.

interface Props {
  nombre: string
  /** línea de 13 px bajo el nombre: la ración o la ayuda de la opción */
  ayuda?: string
  activa: boolean
  onClick: () => void
}

export function Ficha({ nombre, ayuda, activa, onClick }: Props) {
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={onClick}
      className={[
        'flex min-h-12 flex-col justify-center rounded-[4px] border-2 px-3 py-2 text-left',
        activa
          ? 'border-tinta bg-sello text-boleta shadow-dura-sm'
          : 'border-tinta bg-kraft text-tinta',
      ].join(' ')}
    >
      <span className="text-cuerpo font-semibold">{nombre}</span>
      {ayuda ? (
        <span className={activa ? 'text-nota text-boleta/80' : 'text-nota text-tinta/70'}>
          {ayuda}
        </span>
      ) : null}
    </button>
  )
}
