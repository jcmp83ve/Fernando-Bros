# Pichungito Kart 🏎️

Una carrera **en 3D de verdad**, al estilo Mario Kart, con los personajes y
las **voces grabadas** de Fernando Bros. Vive en su propia carpeta y se entra
desde la pantalla **ELIGE TU MUNDO** del juego principal (botón
**🏎️ PICHUNGITO KART** o tecla **P**). Desde el kart se vuelve con
**◀ FERNANDO BROS**.

👉 **[Jugar](https://jcmp83ve.github.io/Fernando-Bros/kart3d/)**

## 🕹️ Cómo se juega

El kart **acelera solo** (pensado para manos pequeñas): solo hay que girar.

| Teclado | Mando 🎮 | Celular 📱 | Acción |
|---|---|---|---|
| ← → / A D | Palanca (analógica) o cruceta | ◀ ▶ | Girar |
| ESPACIO / Z | Botón inferior (A/B) | A | **Derrape**: manteniéndolo en una curva el kart cruza más y, al soltar, sale un **miniturbo** con chispas |
| MAYÚS / X | Botón lateral (X/Y) o gatillo | B | **Usar el poder** de la caja `?` |
| ↓ / S | Palanca abajo | — | Frenar y marcha atrás |
| ENTER · ESC | + / − | tocar · ✕ | Elegir · volver |

Los botones táctiles son zonas grandes e invisibles alrededor del círculo
que se ve, se puede deslizar el dedo de ◀ a ▶ y usar dos dedos a la vez.

## 🧑‍🤝‍🧑 El elenco (16 pilotos)

Fernando, Penny, Sheldon, Cucú, Luca, Salomón, Tío Juan (con su capa que
ondea), Tío Nacho (con sombrero), Tía Yanny, Tío Fran, Rómulo (con su jarra de
cerveza), Abu, Mamá, Papá, Tío Beto y Tía Giuliana. Cada uno tiene su kart de
su color, su cara hecha de cajitas y **su frase grabada**: la dice al elegirlo
y cuando lo rebasas de cerca. Cada piloto tiene su propia mezcla de
**velocidad** y **giro**. Corren doce en cada carrera: tú y once rivales.

## 🛣️ Las pistas

Seis pistas con **subidas y bajadas**, cada una con su cielo y sus decorados:
Circuito Pichunguito (árboles), Playa de Penny (palmeras), Cueva de Sheldon
(rocas y estalagmitas), Nubes de Cucú (nubes flotando), Desierto de Abu
(cactus) y Castillo de Bowser (torres). Tres vueltas cada una, con un arco de
meta que dice PICHUNGITO KART.

## 🎁 Los poderes

Se recogen en las cajas `?` y se usan con **B**. A los que van atrás les
tocan los mejores.

| Poder | Qué hace |
|---|---|
| 🐢 **Caparazón** | Sale disparado siguiendo la carretera y hace dar vueltas al primero que toca |
| ⭐ **Estrella** | Un rato invencible, más rápido y brillando de colores; al chocar, el otro da vueltas |
| 🍔 **Hamburguesa** | Turbo de tío Juan (*«¡Qué rica hamburguesa!»*) |
| 💨 **Pedo de tío Fran** | Deja una nube verde en la pista: el que la pisa da vueltas (*«¡Qué pedo tan podrido, tío Fran!»*) |

## ⭐ Detalles

- **Nadie se queda atrás**: los rivales aprietan si vas primero y aflojan si vas
  último. Y si todos llegan antes que tú, **Tío Juan te lleva a la meta** solo.
- **Muro invisible**: no hay forma de perderse en el campo; fuera del asfalto
  el kart va a la mitad.
- **Cuenta atrás 3-2-1-¡YA!**, marcador de posición gigante estilo Mario Kart
  64, minimapa, velocímetro, mensajes de vuelta y última vuelta.
- **Podio 3D** al final, con confeti y la tabla completa, y las voces de
  victoria (*«¡Gané! ¡Soy el pichunguito campeón!»*) o de ánimo (*«¡Qué
  divertido! ¡Otra vez, otra vez!»*).
- Música 8-bits hecha con código, chispas al derrapar, fuego en el turbo, humo
  y la capa de Tío Juan ondeando.
- Funciona en computadora, iPad, iPhone y Android (mejor **acostado**), y con
  mandos Bluetooth (Joy-Con, Pro Controller, PlayStation, Xbox).

## 🧰 Por dentro

- `kart3d.js` tiene dos mitades: el **núcleo** (trazado, física, poderes,
  rivales; no toca la pantalla) y la **vista** (Three.js + marcador en 2D).
- `three.min.js` es Three.js r128 (licencia MIT, en `THREE-LICENSE.txt`),
  incluido en la carpeta para no depender de ninguna CDN.
- Los personajes se arman con cajitas de colores que se funden en **una sola
  malla por kart**, y los decorados se dibujan con instancias: doce karts y
  cientos de árboles pesan poquísimo, incluso en un teléfono.
- Las voces son los mismos mp3 de Fernando Bros; si uno no carga, habla la
  voz sintética del navegador con el tono de cada personaje.

## 🧪 Pruebas

```
node pruebas.js
```

Sin navegador: se hacen correr **carreras enteras en las seis pistas** con
todos los karts manejados por la inteligencia del juego, se comprueba que
todos terminan, que se reparten cajas y poderes, que el jugador quieto también
llega (con Tío Juan) y que nadie se sale del mundo; además revisa que cada
frase hablada exista tal cual en las grabaciones.
