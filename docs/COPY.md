# Copy de interfaz: La Vaca del 18

Voz: chileno de mesa, directo, con humor corto. Sin caricatura. Tuteo. Sin emojis. Sin signos de exclamación salvo uno en el título si hace falta. Cada texto va tal cual, es el que Claude Code implementa.

## Meta

- Title: La Vaca del 18. Cuánto pone cada uno para el asado
- Description: Di cuántos van, marca qué se compra y comparte la lista con la cuota por persona. Gratis, sin registro.
- OG image: la boleta con un ejemplo de 8 adultos.

## Cabecera

- Título: La Vaca del 18
- Bajada: Cuántos van, qué se compra y cuánto pone cada uno. Para pegar en el grupo.

## Sección: cuántos van

- Pregunta: ¿Cuántos van?
- Label adultos: Adultos
- Label niños: Niños
- Ayuda niños: Sin edad para tomar. Comen la mitad.

## Sección: días

- Pregunta: ¿Cuántos días de asado?
- Opciones: 1 día · 2 días · 3 días
- Ayuda: El 18 y el 19 son feriados. Hay grupos que repiten.

## Sección: apetito

- Pregunta: ¿Cuánto comen?
- Opciones:
  - Normal
  - Dieciochero
  - Ecuatoriano
- Ayuda por opción:
  - Normal: 400 g de carne por persona
  - Dieciochero: 500 g de carne por persona
  - Ecuatoriano: 600 g y nadie se levanta de la mesa

## Sección: qué se compra

- Pregunta: ¿Qué compramos?
- Fichas (nombre / ración visible):
  - Carne para asado / 400 g por adulto
  - Choripán / 1 por adulto
  - Empanadas de pino / 2 por adulto
  - Terremoto / medio litro por adulto
  - Vino / media botella por adulto
  - Bebidas / medio litro por persona
  - Marraquetas / 2 por persona
  - Carbón / 1 kg por cada 2 kg de carne
  - Hielo / 1 bolsa cada 6 adultos
- Nota bajo terremoto: Pipeño más helado de piña. La granadina va por tu cuenta.

## Sección: precios

- Título colapsado: Precios estimados. Tócalos si tienes mejores.
- Etiqueta default: estimado
- Etiqueta editado: tuyo
- Acción: Volver al estimado
- Unidades: por kilo · por unidad · por litro · por botella · por botella de 3 L · por bolsa
- Aviso al pie de la sección: Son referencias para calcular. El precio real lo pone la carnicería.

## Sección: pago de niños

- Pregunta: ¿Los niños pagan?
- Opciones: Nada · La mitad · Completo

## Boleta

- Encabezado: LA VACA DEL 18
- Resumen: {a} ADULTOS · {n} NIÑOS · {d} DÍA(S)
- Fila total: TOTAL ESTIMADO
- Fila pagan: PAGAN {x} PERSONAS
- Sello: PONE ${cuota}
- Bajo el sello, sin niños o niños pagan nada: cada adulto
- Bajo el sello, niños pagan la mitad: cada adulto · niños ${mitad}
- Bajo el sello, niños pagan completo: cada persona
- Vuelto: Sobran ${vuelto} para el que compra
- Nota de redondeo: Cuota redondeada hacia arriba a la centena.

## Estados de la boleta

- Sin adultos: Falta gente. Marca al menos un adulto.
- Sin ítems: Vaca vacía. Marca qué se compra.
- Más de 50 personas: Con esta cantidad conviene cotizar al por mayor. La cuenta sigue siendo válida.

## Compartir

- Botón: Compartir la vaca
- Confirmación al copiar: Copiado. Pégalo en el grupo.
- Error al compartir: No se pudo compartir. Copia el link de arriba.
- Texto compartido:

```
La Vaca del 18
Somos {a} adultos y {n} niños. Ponen ${cuota} cada adulto.
Lista: {lista en una línea, separada por comas}.
Total estimado: ${total}
{url}
```

- Título para Web Share: La Vaca del 18

## Barra inferior

- Label: Pone
- Botón: Compartir

## Pie

- Línea 1: Precios estimados. Ajústalos si tienes mejores.
- Línea 2: Hecho en una clase con Claude Code. Código en GitHub.
- Línea 3: lavacadel18.cl

## Errores de formulario

- Número inválido: Pon un número entero.
- Precio inválido: Pon un precio en pesos, sin puntos.
- Máximo: Hasta 200 personas. Más que eso ya es fonda.
