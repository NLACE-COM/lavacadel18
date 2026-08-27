# La Vaca del 18

Calculadora de la cuota del asado del 18 de septiembre. Una página: dice cuántos van,
qué se compra y cuánto pone cada uno. El estado completo viaja en la URL, así que la
vaca se comparte con un link.

**Sitio:** [lavacadel18.cl](https://lavacadel18.cl)

Los precios son estimados y editables. Ninguno se presenta como dato real de mercado.

## Cómo correrlo

```
npm install
npm run dev
npm test
npm run build
```

Node 20 o superior.

## Cómo está armado

React 19, Vite, TypeScript, Tailwind CSS v4, Vitest. Sitio estático, sin backend.

- `src/lib/constants.ts` — raciones, precios estimados y multiplicadores. Única fuente de reglas.
- `src/lib/calcular.ts` — `calcularVaca(entrada)`. Función pura, sin React ni DOM.
- `src/lib/url.ts` — el estado de la app, serializado en los search params.
- `src/components/` — reciben datos y renderizan. Ningún cálculo adentro.
- `docs/` — el brief de producto, el sistema de diseño y el copy de interfaz.

Cuando el brief y el código no coinciden, gana el brief.

## Licencia

MIT.
