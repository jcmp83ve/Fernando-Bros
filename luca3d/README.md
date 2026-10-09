# ✈️ Luca Piloto: ¡De avión a nave galáctica!

Un juego de vuelo en 3D para un niño de cinco años. **Luca** despega en su avioncito
amarillo y verde, vuela sobre el mar con **Tío Juan** (el superhéroe de la capa roja) a su
lado, y cuando aparece **Tía Gaby** en su nave rosada le entrega un **cristal mágico** que
convierte el avión en una **nave galáctica estilo Star Wars**, con alas en X. Juntos van al
espacio a vencer a las naves malas y a la **Bola Gris del Malvado**.

👉 **[Jugar](https://jcmp83ve.github.io/Fernando-Bros/luca3d/)**

## La historia (unos 3 minutos)

| Parte | Qué pasa |
|---|---|
| ☁️ **El cielo** | Luca vuela sobre islas y nubes juntando ⭐ estrellas y pasando por aros (+5). Hay que esquivar los nubarrones gruñones. Tío Juan llega volando y le tira 🍔 hamburguesas: **turbo** e invencible por 6 segundos. |
| 👩‍🚀 **Tía Gaby** | Baja en su nave rosada: *«¡Te necesito en el espacio!»* y le da el cristal mágico. |
| ✨ **Transformación** | El avión da vueltas, brilla y se convierte en la nave galáctica. El cielo se vuelve espacio. |
| 🚀 **El espacio** | Asteroides, oleadas de naves malas y planetas. La nave **dispara sola** y apunta sola; Tío Juan (con casco de astronauta) dispara también. *«¡Que la fuerza te acompañe, Luca!»* |
| 🌑 **La Bola Gris** | Hay que darle al **punto verde que brilla**. Tía Gaby y Tío Juan ayudan disparando. |
| 🎉 **¡Ganaste!** | Fuegos artificiales y los tres celebran juntos. |

**Aquí nunca se pierde:** si algo choca a Luca solo se le caen 3 estrellas y sigue volando.
Aunque el niño no toque nada, la partida llega al final.

## Controles

| Teclado | Mando 🎮 | Celular 📱 | Acción |
|---|---|---|---|
| Flechas / WASD | Palanca o cruceta | Deslizar el dedo | Volar |
| ESPACIO / X | Cualquier botón | 🌀 | Dar una vuelta (esquiva todo) |
| ENTER | Start | Tocar | Empezar / otra vez |
| ESC | — | ✕ | Volver al menú |

## Cómo está hecho

- `nucleo.js`: todo lo que pasa en el juego (vuelo, guion, objetos, disparos, la Bola Gris),
  sin tocar la pantalla, para poder probarlo con node.
- `vista.js`: lo dibuja con Three.js (el mismo motor de Pichungito Kart, `../kart3d/three.min.js`),
  con el marcador, los globitos de diálogo, los controles táctiles, sonidos y música 8-bits.
- Las voces usan la voz del navegador con un tono distinto para cada personaje.

## Pruebas

```
node pruebas.js
```

Juega partidas enteras sin navegador: con un piloto automático que esquiva y recoge, con un
niño que no toca nada y con uno que solo va hacia un lado. Comprueba que siempre se pasa por
cielo → transformación → espacio → Bola Gris → final, y que hablan Tío Juan y Tía Gaby.
