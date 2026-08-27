# La Vaca del 18

Calculadora de la cuota del asado del 18 de septiembre. Una página. Dice cuántos van, qué se compra y cuánto pone cada uno. Estado completo en la URL. Se comparte con un link.

Lee estos archivos antes de escribir código:

- `docs/BRIEF.md`: qué es el producto, reglas de negocio, raciones, precios, alcance.
- `docs/DESIGN.md`: tokens de color, tipografía, componentes.
- `docs/COPY.md`: todos los textos de la interfaz, tal cual van.
- `docs/BITACORA.md`: qué se decidió, qué desajustes hay entre documentos y qué queda pendiente.

Cuando el brief y el código no coincidan, gana el brief. Si crees que el brief está mal, dilo antes de cambiarlo.

## Stack

- React 19 + Vite + TypeScript estricto.
- Tailwind CSS v4 con tokens en `src/index.css` vía `@theme`.
- Vitest para tests.
- Node 20 o superior. npm.
- Deploy en Vercel como sitio estático. Sin funciones serverless.

## Dónde vive

- Repo: `NLACE-COM/lavacadel18` en GitHub, público.
- Vercel: equipo `nlace`, proyecto `lavacadel18`. Cada push a `main` despliega a producción.
- Producción hoy: `lavacadel18.vercel.app`. El dominio `lavacadel18.cl` todavía no se registra.

## Estructura

```
src/
  lib/
    constants.ts     raciones, precios default, multiplicadores. Única fuente de reglas.
    calcular.ts      calcularVaca(input): Resultado. Función pura. Sin React. Sin DOM.
    calcular.test.ts
    url.ts           serializar y parsear el estado desde search params.
    url.test.ts
    formato.ts       pesos chilenos, kilos, litros.
    compartir.ts     el texto plano que se pega en el grupo.
  components/
    Stepper.tsx
    Ficha.tsx
    Precio.tsx
    Boleta.tsx
    Sello.tsx
    BarraInferior.tsx
    Guirnalda.tsx    banderines de fonda bajo la cabecera.
    Estrella.tsx     la solitaria, dentro del sello.
    Volantin.tsx     remate del pie.
  App.tsx
  main.tsx
  index.css
docs/
  BRIEF.md DESIGN.md COPY.md BITACORA.md
```

## Reglas de código

- La lógica vive en `src/lib`. Los componentes reciben datos y renderizan. Ningún cálculo dentro de un componente.
- `calcularVaca` es pura: mismos inputs, mismo output. Testeable sin React.
- Todas las constantes de negocio (raciones, precios, multiplicadores, redondeos) están en `constants.ts`. Ningún número mágico en otro archivo.
- Los precios default son estimados. En código se llaman `PRECIOS_ESTIMADOS`. Nunca "precios reales".
- El estado de la app se deriva de la URL en cada render. La URL es la fuente de verdad. `history.replaceState` al cambiar, sin recargar.
- Sin librerías de estado, sin router, sin librerías de UI. React puro.
- Sin `localStorage`. Todo viaja en la URL.
- Pesos chilenos con separador de miles con punto y sin decimales: `$12.990`.
- Textos de interfaz copiados de `docs/COPY.md`. No inventar ni parafrasear.
- Componentes en español. Nombres de archivo y funciones en español sin tildes: `calcularVaca`, `Boleta`, `formatoPesos`.

## Diseño

- Fuentes cargadas en `index.html` desde Google Fonts: Anton, Archivo (400 y 600), IBM Plex Mono (400 y 600). Con `preconnect`.
- Colores solo desde tokens. Nunca hex sueltos en componentes.
- Mobile primero. Ancho máximo de contenido 560 px.
- Sombras duras, sin gradientes, sin emojis.
- `prefers-reduced-motion` respetado.

## Tests

- Cada regla del brief tiene al menos un test en `calcular.test.ts`.
- Casos obligatorios: 1 adulto normal 1 día; 8 adultos 3 niños; niños al 0% de alcohol; apetito ecuatoriano; carbón mínimo 3 kg; redondeo de cuota a la centena; vaca vacía; cero adultos.
- `npm test` corre en cada commit antes de subir.

## Git

- Rama `main` protegida por costumbre: se trabaja en `main` durante la clase, commits pequeños con mensaje en español en imperativo: "Agrega cálculo de raciones", "Crea componente Boleta".
- `.gitignore` estándar de Vite más `.vercel`.

## Comandos

```
npm install
npm run dev
npm test
npm run build
npx vercel --prod
```

## Lo que no se hace

- No agregar dependencias sin decirlo primero.
- No agregar backend, base de datos ni analytics con cookies.
- No cambiar raciones ni precios en el código sin actualizar `docs/BRIEF.md`.
- No dejar `console.log` en el código final.
