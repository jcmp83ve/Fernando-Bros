# El Dominó de Tía Yany 🁫

Dominó **doble seis para cuatro**, con los personajes y las voces de
[Fernando Bros](../README.md): juega **Fernando** contra **Salomón**,
**tía Yany** y **tío Fran**.

👉 **[Jugar](https://jcmp83ve.github.io/Fernando-Bros/domino/)** — o desde
Fernando Bros, en la casilla **🁫 DOMINÓ** de la pantalla de ELIGE TU MUNDO.

## 🕹️ Cómo jugar

Abre `index.html` en cualquier navegador, o publícalo con GitHub Pages.
Funciona igual en computadora, celular y tablet.

| Teclado | Celular 📱 | Acción |
|---|---|---|
| ← → | ◀ ▶ | Elegir ficha |
| ESPACIO / ENTER | A | Ponerla en la mesa |
| ← → | los dos botones morados | Elegir de qué lado la pones |
| ESC | ✕ | Cambiar de ficha |
| H | 💡 AYUDA | Encender o apagar la ayuda |
| ESC | ✕ SALIR | Volver a la portada |
| ESC (en la portada) | ◀ FERNANDO BROS | Volver a Fernando Bros |

**Con el dedo es más fácil todavía:** se toca la ficha que quieres poner y ya.
Si esa ficha pega por los dos lados, salen dos botones grandes para decir por
dónde va.

## 📜 Las reglas

- Fichas de **doble seis** (28) y **siete para cada uno**.
- La primera ronda la abre **quien tenga el 6|6**, y tiene que salir con él.
  Las siguientes las abre **quien ganó la anterior**, con la ficha que quiera.
- En tu turno pones una ficha que pegue con alguno de los dos números
  abiertos. Si no tienes ninguna, **pasas solo** (nadie se queda atascado).
- La ronda se acaba cuando alguien **se queda sin fichas** (¡dominó!), o
  cuando **nadie puede jugar** (tranca); ahí gana el que menos puntos tenga
  en la mano.
- El que gana la ronda **se lleva la suma de lo que les quedó a los otros
  tres**. Gana la partida el primero que llega a **100 puntos**.

## 💡 La ayuda

Viene encendida. Con la ayuda puesta, las fichas que **sí pegan** se marcan
con un borde verde y las que no se ven apagaditas, y abajo del paño salen los
dos números abiertos bien grandes (**◀ AQUÍ PEGA EL 5**). Se apaga con el
botón de arriba a la derecha o con la tecla H.

## 🧑‍🤝‍🧑 Cada uno juega a su manera

| | Cómo juega | Qué dice |
|---|---|---|
| 🧒 **Fernando** | Lo llevas tú | *«¡Toma, pichungazo!»* |
| 🧒 **Salomón** | Adora los dobles y los suelta en cuanto puede | *«¡Ese doble es mío!»* |
| 👩 **Tía Yany** | Va soltando las suaves y se guarda las gordas | *«¡Ay mi amor, qué linda ficha!»* |
| 👨 **Tío Fran** | Suelta siempre la más gorda — y cada vez que pone un doble **se echa un pedo** 💨 | *«¡Qué pedo tan podrido, tío Fran!»* |

Ninguno juega perfecto: de vez en cuando se despistan y sueltan cualquier
cosa, para que la mesa no sea una máquina y a Fernando le toque ganar de
verdad.

## 🗣️ Las voces

Son **las mismas grabaciones con voz de niño de Fernando Bros** (archivos
mp3), que suenan en cualquier aparato, iPhone incluido. La primera vez hay que
tocar la pantalla o pulsar una tecla para que el navegador deje sonar el audio.

Las frases propias del dominó (*«¡Paso!»*, *«¡Ese doble es mío!»*…) no tienen
grabación, así que las dice la voz del navegador **con el tono de cada
personaje**: Fernando agudo de niño, tía Yany más suave, tío Fran bien grave.
Si un mp3 no carga, esa frase también sale con la voz del navegador.

## 🧪 Pruebas

```
cd domino && node pruebas.js
```

No hace falta navegador ni instalar nada. El banco de pruebas finge la
pantalla y **juega partidas enteras solo**, tocando las fichas de Fernando
como lo haría un dedo. Después de **cada** jugada comprueba que la culebra
siga pegando, que las 28 fichas sigan estando sin repetirse, que nadie tenga
más de siete en la mano y que los puntos de cada ronda cuadren exactamente con
lo que les quedó a los demás. También revisa que las frases marcadas
«grabada» existan de verdad en los mp3.

Se le puede pedir más partidas: `node pruebas.js . 100`.

(Las pruebas de Fernando Bros son otras, y se corren con `node pruebas.js`
desde la carpeta de arriba.)
