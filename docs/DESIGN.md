# Sistema de diseño: La Vaca del 18

Referencia visual: la boleta de la carnicería de barrio y el lienzo de la fonda. Papel kraft, tinta negra, un sello rojo. Nada de banderas, huasos ni guirnaldas. El 18 se nota por el tono y por el sello, no por la utilería.

## Concepto

La página es un mostrador. Arriba, el cliente dice cuántos son y qué quiere. Abajo, el carnicero entrega la boleta con la cuenta. La boleta es el único elemento con fondo blanco y es lo que la gente comparte.

## Color

| Token | Hex | Uso |
|---|---|---|
| `--kraft` | #E9D3AE | Fondo de página. Papel de envolver. |
| `--kraft-dark` | #D6B98C | Bordes, separadores, estados deshabilitados. |
| `--tinta` | #1C1917 | Texto, bordes de fichas, botones primarios. |
| `--sello` | #C8102E | Sello de la cuota, ficha activa, botón compartir. Un solo acento rojo. |
| `--fonda` | #1F3A93 | Links y foco de teclado. Aparece poco. |
| `--boleta` | #FFFDF6 | Fondo del ticket. Único blanco de la página. |

Reglas:

- El rojo aparece en tres lugares máximo por pantalla: sello de cuota, fichas activas, botón compartir.
- El azul nunca es fondo. Solo texto de link y anillo de foco.
- Sin degradados. Sin sombras difusas. Las sombras son duras: `4px 4px 0 var(--tinta)`.

Contraste verificado: tinta sobre kraft 12.9:1, sello sobre kraft 5.1:1, boleta sobre kraft con borde tinta.

## Tipografía

Cargar los archivos de fuente desde Google Fonts en `index.html` con `preconnect`. Declarar el nombre no basta.

| Rol | Familia | Peso | Uso |
|---|---|---|---|
| Display | Anton | 400 | Título del sitio, cuota, cantidades grandes. Siempre mayúsculas, tracking 0.01em. Es la letra del lienzo de la fonda. |
| Cuerpo | Archivo | 400, 600 | Labels, botones, texto. |
| Ticket | IBM Plex Mono | 400, 600 | Todo lo que va dentro de la boleta: ítems, cantidades, precios, total. |

Escala (mobile, px):

- Título: 40 Anton
- Cuota en sello: 44 Anton
- Cantidad grande en steppers: 32 Anton
- Pregunta de sección: 18 Archivo 600
- Texto y labels: 16 Archivo 400
- Ticket: 14 IBM Plex Mono
- Nota y etiquetas: 13 Archivo 400

En desktop el título sube a 64 y el resto se mantiene. La página no crece a más de 560 px de ancho de contenido.

## Espaciado y forma

- Unidad base 8 px.
- Ancho máximo de contenido 560 px, centrado, padding lateral 20 px en mobile.
- Separación entre secciones 32 px.
- Radio: 4 px en fichas y botones. 0 en la boleta.
- Borde estándar: 2 px tinta.

## Componentes

### Stepper (adultos, niños)

Caja con borde 2 px tinta, fondo kraft. Botón menos a la izquierda, número en Anton 32 al centro, botón más a la derecha. Área de toque mínima 48 px. Mantener presionado acelera. El número es editable al tocarlo.

### Ficha (ítems, apetito, días, pago de niños)

Botón rectangular con borde 2 px tinta, fondo kraft, texto Archivo 600 16. Activa: fondo sello, texto boleta, sombra dura 3px 3px 0 tinta. Desactivada: borde kraft-dark, texto kraft-dark. Las fichas de ítems muestran nombre y debajo, en 13, la ración por persona ("400 g por adulto").

### Precio editable

Fila: nombre del ítem, input numérico alineado a la derecha con prefijo "$", unidad debajo ("por kilo"), etiqueta a la derecha del input: "estimado" en kraft-dark o "tuyo" en fonda. Botón "Volver al estimado" aparece solo si fue editado.

### Boleta (elemento de firma)

Fondo boleta, borde 2 px tinta, sin radio, sombra dura 6px 6px 0 tinta. Borde superior e inferior con dientes (clip-path o borde punteado grueso) como ticket cortado. Contenido en IBM Plex Mono:

```
LA VACA DEL 18
8 ADULTOS · 3 NIÑOS · 1 DÍA
------------------------------
Carne para asado     3,5 kg    45.465
Choripán            10 un      15.000
Empanadas de pino   20 un      50.000
Pipeño               5 L       15.000
Helado de piña       1 L        4.500
Bebidas              2 bot      4.980
Marraquetas         20 un       5.000
Carbón               3 kg       8.970
Hielo                2 bolsas   5.000
------------------------------
TOTAL ESTIMADO             153.915
PAGAN 9,5 PERSONAS
------------------------------
```

Cantidades alineadas en una columna, precios en otra. El total en 600. Debajo del total, el sello.

### Sello de cuota

Círculo o rectángulo rotado -6 grados con borde 3 px sello, texto sello, Anton 44: "PONE $16.300". Debajo, en Archivo 13: "cada adulto". Si los niños pagan: "cada adulto · niños $8.150". Al cambiar la cuota, el sello hace una entrada de 150 ms desde escala 1.15 a 1 con opacidad. Con `prefers-reduced-motion` no anima.

### Barra inferior fija (mobile)

Fondo tinta, texto boleta. Izquierda: "Pone" en 13 y la cuota en Anton 28. Derecha: botón "Compartir la vaca" fondo sello. Aparece cuando la boleta sale de pantalla al hacer scroll hacia arriba.

### Botón primario

Fondo tinta, texto boleta, Archivo 600, altura 52 px, sombra dura. Presionado: se desplaza 2 px y pierde la sombra. Compartir usa fondo sello.

## Accesibilidad

- Foco visible: anillo 3 px fonda con offset 2 px.
- Steppers y fichas operables con teclado. Fichas son `button` con `aria-pressed`.
- Inputs de precio con `inputmode="numeric"`.
- El texto compartido es texto plano legible por cualquier lector.
- `prefers-reduced-motion` desactiva la animación del sello.

## Lo que no se hace

- No usar la bandera ni sus colores como combinación roja, blanca y azul en un mismo bloque.
- No usar emojis en la interfaz.
- No usar gradientes, glassmorphism ni sombras difusas.
- No usar tipografías del sistema como reemplazo. Si las fuentes no cargan, el fallback es `Impact` para display y `sans-serif` para cuerpo, declarado en CSS.
