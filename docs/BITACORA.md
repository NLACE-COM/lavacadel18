# Bitácora

Lo que se decidió y por qué, mientras se construía. Si algo acá contradice a
`BRIEF.md`, gana el brief y esto está desactualizado.

Última entrada: 26 de agosto de 2026.

---

## 26 de agosto de 2026. Armado del proyecto

Se levantó el proyecto completo desde `src/lib/constants.ts`, que era lo único
que existía. Quedó React 19 + Vite + TypeScript estricto + Tailwind v4 + Vitest,
tal como pide el brief. 32 tests en verde.

### Desajustes encontrados entre los documentos

Se detectaron antes de escribir código y se resolvieron a favor de la tabla de
reglas del brief, no de sus ejemplos.

1. **Los ejemplos de boleta no cuadran con las reglas.** `DESIGN.md` muestra
   8 adultos + 3 niños con 3,5 kg de carne y total $153.915. La regla (400 g por
   adulto, niños al 50%) da 3,8 → 4,0 kg y total $154.660. Lo mismo pasa con
   empanadas (19, el doc dice 20) y pipeño (4 L, el doc dice 5 L). El código
   sigue la tabla. **Los ejemplos de `DESIGN.md` y `BRIEF.md` siguen sin
   corregirse.**

2. **Marraquetas.** `COPY.md` dice "2 por persona", pero la tabla de raciones
   las cuenta como comida y la comida de los niños va al 50%, o sea 1 por niño.
   El cálculo usa la regla; la ficha muestra el texto de `COPY.md` tal cual.

3. **Cero adultos.** El brief define `a` con mínimo 1, pero también pide el
   estado "Falta gente. Marca al menos un adulto." Si se acotaba a 1 ese estado
   era inalcanzable, así que `a` acepta 0. El máximo de 200 se respeta.

### Decisiones de implementación

- **`constants.ts` se amplió** con lo que faltaba para calcular: `precioPor`
  (cuánta unidad base cubre el precio unitario, para que la bebida se cobre por
  botella de 3 L y no por litro), `mostrarComo` (la boleta imprime "4 kg" pero
  "2 bot 3 L"), plantillas de texto para compartir, la tabla `FICHAS` y
  `HIELO_REQUIERE`. Sigue siendo la única fuente de reglas.

- **La carne se calcula primero** dentro de `calcularVaca`, porque el carbón
  depende de los kilos que efectivamente se compran, no de la ración cruda.

- **El carbón mantiene su mínimo de 3 kg aunque no se compre carne.** Igual hay
  que prender la parrilla para el choripán.

- **Días y hielo.** El brief dice que los días multiplican todo, así que el
  hielo se calcula como `adultos / 6 × días` y recién ahí se redondea a la bolsa.
  Se prefirió la regla literal por sobre el criterio de "el hielo se derrite y se
  compra cada día".

- **`compartir.ts` es un archivo extra** en `src/lib`, fuera de la estructura
  listada en `CLAUDE.md`. Se prefirió eso a meter el armado del texto de WhatsApp
  dentro de `url.ts`.

- **Compartir se deshabilita** cuando la vaca no da cuota. Si no, el texto salía
  como "Ponen $ cada adulto."

- **Sin niños, el texto compartido dice "Somos 8 adultos."** en vez de "y 0
  niños". `COPY.md` da la plantilla con niños siempre presentes. Es una
  desviación consciente del copy.

- **Un bug lo encontró un test.** `d=9` en la URL se acotaba a 3 en vez de volver
  al default. Los días son una opción, no un rango.

### Chilenidad, versión fonda sin bandera

Se pidió más chilenidad en el diseño, con banderas e íconos. `DESIGN.md` lo
prohíbe textualmente: "Nada de banderas, huasos ni guirnaldas" y "No usar la
bandera ni sus colores como combinación roja, blanca y azul en un mismo bloque".
Se planteó el conflicto antes de tocar nada y se optó por subir la chilenidad
**sin** romper la regla:

- Guirnalda de banderines bajo la cabecera, en tinta y kraft-dark alternados.
- Estrella solitaria dentro del sello de la cuota.
- Trama de lienzo de fonda en el fondo: dos series cruzadas de rayas de 1 px al
  4%, de borde duro. No es un degradado.
- Volantín con cola de zigzag en el pie.

El rojo no se movió de sus tres lugares: sello, fichas activas y botón compartir.
`DESIGN.md` no se modificó porque nada de esto lo contradice.

---

## Pendientes

- Corregir los ejemplos de boleta de `DESIGN.md` y `BRIEF.md` para que cuadren
  con la tabla de raciones.
- Imagen OG en `/og.png`. El `<meta>` ya la apunta y hoy da 404.
- Analytics de la sección 8 del brief: eventos `share` y `price_edit`, tiempo
  hasta primer resultado y visitas con parámetros en la URL.
- Registrar `lavacadel18.cl` en NIC Chile y apuntarlo al proyecto de Vercel. Hoy
  el pie del sitio nombra un dominio que todavía no existe.
