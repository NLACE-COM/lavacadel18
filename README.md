# La Vaca del 18

Calculadora de la cuota del asado del 18 de septiembre. Una página: dice cuántos van,
qué se compra y cuánto pone cada uno. El estado completo viaja en la URL, así que la
vaca se comparte con un link.

**Sitio:** [lavacadel18.vercel.app](https://lavacadel18.vercel.app)
**Dominio final:** lavacadel18.cl, todavía sin registrar.

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
- `docs/` — el brief de producto, el sistema de diseño, el copy de interfaz y la
  bitácora de decisiones.

Cuando el brief y el código no coinciden, gana el brief.

## Deploy

Sitio estático en Vercel, equipo `nlace`, proyecto `lavacadel18`. Está conectado a
este repo: **cada push a `main` despliega a producción solo**. No hay funciones
serverless, variables de entorno ni backend.

Deploy manual, si hiciera falta:

```
npx vercel --prod
```

## Estado

Funciona de punta a punta: se ingresan personas, se marca qué se compra, se
editan precios, la boleta calcula y el link reproduce la vaca completa.

Falta, en orden de importancia:

1. Registrar `lavacadel18.cl` y apuntarlo al proyecto de Vercel.
2. La imagen OG en `/og.png`. El `<meta>` ya la apunta y hoy da 404.
3. Los eventos de analytics de la sección 8 del brief.
4. Corregir los ejemplos de boleta de `docs/DESIGN.md`, que no cuadran con la
   tabla de raciones. Ver `docs/BITACORA.md`.

## Licencia

MIT.
