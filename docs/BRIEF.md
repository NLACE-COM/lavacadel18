# La Vaca del 18

Brief de producto. Versión 1.0. 26 de agosto de 2026.
Dominio: lavacadel18.cl (disponible al 26 de agosto de 2026, se registra en NIC Chile).

---

## 1. Una frase

Somos tantos, qué compramos y cuánto pone cada uno para el asado del 18.

## 2. El problema

Organizar el asado dieciochero termina siempre en el mismo hilo de WhatsApp: alguien pregunta cuántos van, otro pregunta cuánta carne, un tercero manda una transferencia sin saber el monto y el que compra pone la diferencia. La cuenta se hace a ojo y siempre falta carbón.

## 3. Usuario

Quien organiza el asado del grupo: amigos, familia, oficina. Entre 20 y 45 años. Lo hace desde el celular, en el hilo del grupo, la semana antes del 18. No quiere una app, quiere una respuesta para pegar en el chat.

## 4. Trabajo por hacer

En menos de un minuto: ingresar cuántos van, marcar qué se compra y obtener la lista de compras con cantidades, el costo estimado y la cuota por persona. Compartir el resultado con un link.

## 5. Alcance

Dentro:

- Una página. Sin navegación.
- Inputs: adultos, niños, días de asado, apetito, qué se compra, cómo pagan los niños.
- Precios unitarios editables con defaults estimados.
- Output: lista de compras con cantidades redondeadas a formato de venta, costo total estimado, cuota por persona redondeada a la centena.
- Estado completo en la URL. Un link reproduce la vaca.
- Botón "Compartir la vaca" con texto listo para WhatsApp.
- Deploy público en lavacadel18.cl.

Fuera (hora dos o nunca):

- Cuentas de usuario, guardar vacas, historial.
- Precios reales desde supermercados.
- Mapa de carnicerías.
- Pago o transferencia integrada.
- Otros menús (curanto, cordero). El 18 es asado.

## 6. Reglas de negocio

### Raciones por adulto por día

| Ítem | Ración | Unidad de venta | Redondeo |
|---|---|---|---|
| Carne para asado | 400 g | kilo | hacia arriba a 0,5 kg |
| Choripán (chorizo + pan) | 1 unidad | unidad | entero |
| Empanadas de pino | 2 unidades | unidad | entero |
| Terremoto: pipeño | 0,5 L | litro | hacia arriba a 1 L |
| Terremoto: helado de piña | 0,1 L | litro | hacia arriba a 1 L |
| Vino | 0,5 L | botella 750 ml | hacia arriba a botella |
| Bebidas | 0,5 L | botella 3 L | hacia arriba a botella |
| Pan (marraqueta) | 2 unidades | unidad | entero |
| Carbón | 1 kg por cada 2 kg de carne, mínimo 3 kg | kilo | hacia arriba a 1 kg |
| Hielo | 1 bolsa por cada 6 adultos, si hay terremoto, vino o bebidas | bolsa | hacia arriba a bolsa |

### Niños

Comida al 50% de la ración de adulto. Bebidas al 100%. Alcohol al 0%. Un niño es cualquier persona sin edad para tomar. No pedimos edades.

### Apetito

Multiplica solo la comida (carne, choripán, empanadas, pan). No multiplica bebidas ni alcohol.

- Normal: 1,0
- Dieciochero: 1,25
- Ecuatoriano: 1,5

### Días

Uno, dos o tres. Multiplica todo. El 18 y el 19 son feriados y hay grupos con asado los dos días.

### Cuota

Total estimado dividido por personas que pagan. Adulto paga 1. Niño paga según la opción elegida: nada (0), la mitad (0,5) o completo (1). Default: la mitad. La cuota se redondea hacia arriba a la centena. Lo que sobra queda declarado como "vuelto para el que compra".

### Precios

Todos los precios unitarios son estimados y editables. Cada uno se muestra con la etiqueta "estimado". Cuando el usuario edita un precio, la etiqueta cambia a "tuyo" y el valor viaja en la URL. Ningún precio se presenta como dato real de mercado.

Defaults iniciales (CLP, estimados, agosto 2026, se ajustan en clase si alguien tiene mejor dato):

| Ítem | Precio | Por |
|---|---|---|
| Carne para asado | 12.990 | kilo |
| Choripán | 1.500 | unidad |
| Empanada de pino | 2.500 | unidad |
| Pipeño | 3.000 | litro |
| Helado de piña | 4.500 | litro |
| Vino | 4.990 | botella |
| Bebida | 2.490 | botella 3 L |
| Marraqueta | 250 | unidad |
| Carbón | 2.990 | kilo |
| Hielo | 2.500 | bolsa |

### Estado en URL

Cada parámetro corto y legible. Ausente significa default.

```
/?a=8&n=3&d=1&ap=dieciochero&it=carne,chori,emp,terre,beb,pan,carbon,hielo&nk=mitad&p_carne=11990
```

- a: adultos (entero, mínimo 1, máximo 200)
- n: niños (entero, mínimo 0, máximo 200)
- d: días (1, 2 o 3)
- ap: apetito (normal, dieciochero, ecuatoriano)
- it: ítems activos separados por coma
- nk: cómo pagan los niños (nada, mitad, completo)
- p_<item>: precio unitario editado

## 7. Experiencia

Una columna en mobile. Orden de lectura igual al orden de decisión.

1. Título y una línea de contexto.
2. ¿Cuántos van? Dos steppers grandes: adultos, niños.
3. ¿Cuántos días? Tres botones.
4. ¿Cuánto comen? Tres botones de apetito.
5. ¿Qué compramos? Ítems como fichas seleccionables. Todo marcado por defecto salvo vino (el terremoto ya cubre).
6. Precios. Sección colapsada. Al abrir, cada ítem con su precio editable y su etiqueta.
7. ¿Los niños pagan? Tres botones.
8. La vaca. Ticket con la lista, el total y la cuota. Es el elemento de firma del sitio.
9. Compartir la vaca. Botón principal.
10. Pie: aviso de precios estimados, autor, link al repo si es público.

Barra inferior fija en mobile con la cuota por persona y el botón compartir. Siempre visible mientras se ajustan inputs.

Estados:

- Cero adultos: el ticket dice "Falta gente" y la cuota no se calcula.
- Nada seleccionado: el ticket dice "Vaca vacía. Marca qué se compra".
- Grupo grande (más de 50): aviso "Con esta cantidad conviene cotizar al por mayor" sin bloquear.

Compartir: usa Web Share API si existe. Si no, copia al portapapeles y muestra "Copiado". El texto compartido:

```
La Vaca del 18
Somos 8 adultos y 3 niños. Ponen $9.100 cada adulto.
Lista: 3,5 kg de carne, 10 choripanes, 20 empanadas, 5 L de pipeño, 1 L de helado de piña, 2 bebidas de 3 L, 20 marraquetas, 3 kg de carbón, 2 bolsas de hielo.
Total estimado: $98.480
lavacadel18.cl/?a=8&n=3...
```

## 8. Métricas

- Vacas compartidas por sesión (evento `share`).
- Precios editados (evento `price_edit`, con el ítem, nunca el valor).
- Tiempo hasta primer resultado válido.
- Visitas con parámetros en la URL (llegaron por un link compartido).

GA4 o Vercel Analytics. Sin cookies de terceros. Sin PII.

## 9. Stack

React 19, Vite, TypeScript, Tailwind CSS v4, Vitest. Node 20 o superior. Repo en GitHub. Deploy en Vercel como sitio estático.

Por qué Vite y no Next.js: la página no tiene servidor, no tiene datos remotos y no necesita rutas. Vite construye en segundos y deja menos cosas por explicar en una hora. Next.js queda como opción si en hora dos aparece un endpoint de precios.
