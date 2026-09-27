# ⚡ Salomón y los Primos: La Gran Aventura del Lago

Un juego de plataformas en 3D con mundo central, inspirado en el estilo de juegos como
*Super Bear Adventure*, pero con personajes, lugares e historia propios de Maracaibo y
Venezuela.

Unas nubes negras se robaron el relámpago del Catatumbo y regaron sus **chispas** por todo el
Zulia. **Salomón**, **el Primo Verde** y **el Mollejúo** salen desde **la Vereda del Lago** a
buscarlas y devolvérselas a **la Chinita del Catatumbo**.

👉 **[Jugar](https://jcmp83ve.github.io/Fernando-Bros/salomon3d/)**

## Cómo se juega

- **La Vereda del Lago** es el mundo central. Tiene 12 portales, la tienda de la señora Carmen,
  el álbum de barajitas y la antena para jugar con amigos.
- Los portales se abren juntando **chispas ⚡**. Hay 48 en total, 4 por nivel:
  - 2 por rescatar a los animalitos de las jaulas (se rompen a golpes).
  - 1 por juntar las **8 cocadas** del nivel.
  - 1 por la chispa grande del final o por vencer al jefe.
- **Barajitas 🃏:** hay 3 escondidas en cada nivel, 36 en el álbum.
- **Monedas 🪙:** sirven para comprar gorras, sombreros, lentes y una capa en el kiosko.
- **Corazones ❤️:** tienes 3. Si los pierdes, vuelves a la última bandera con 10 monedas menos.
  Nunca se pierde el juego.

## Los primos (se cambia con 👥 en cualquier momento)

| | Personaje | Salto | Poder (B) |
|---|---|---|---|
| 🧒 | **Salomón** | normal (~2 m) | 🪨 **Pedrada**: apunta sola; es lo único que activa las **dianas** |
| 🟢 | **El Primo Verde** | muy alto (~3 m) y **doble salto** (~4,5 m) | 🦶 **Patada giratoria** |
| 🍔 | **El Mollejúo** | bajito (~1,85 m) | 💥 **Panzazo**: lo único que tumba las **paredes rajadas** |

Todos vencen enemigos pisándolos y rompen cajas con su poder.

## Los 12 niveles

| # | Nivel | Qué tiene |
|---|---|---|
| 1 | El Saladillo | Techos de colores, iguanas, la Basílica |
| 2 | El Puente sobre el Lago | Carros, ventarrones, ascensores de las torres |
| 3 | Los Palafitos de Santa Rosa | Tablones que se caen, lanchas. **Jefe:** el Cangrejote |
| 4 | El Mercado Las Pulgas | Toldos-trampolín, laberinto de puestos |
| 5 | La Vereda de noche | Faroles, murciélagos, el faro |
| 6 | Los Médanos de Coro | Dunas, chivos, rocas rodantes. **Jefe:** el Chivo Cabezón |
| 7 | El Páramo | Hielo, bolas de nieve, el teleférico |
| 8 | El Tepuy | Subida vertical, corrientes de aire. **Jefe:** el Zancudo Rey |
| 9 | Las Torres del Lago | Pistones, vapor, robots |
| 10 | La Feria de La Chinita | Rueda de la fortuna, carrusel, payasos |
| 11 | El Castillo de San Carlos | Cañones, piratas. **Jefe:** el Capitán Pata de Palo |
| 12 | El Catatumbo | Tormenta y rayos. **Jefe final:** el Nublao |

## Jugar con amigos

Hasta 4 jugadores, cada uno en su aparato: uno toca **👥 → Crear una sala** y los demás escriben
el código de 4 letras (o abren el enlace para invitar). Es el mismo sistema de La Gran Aventura:
Trystero por Nostr y MQTT, con relé de reserva para datos móviles. Cada quien juega su partida y
ve a los demás en el mismo nivel. **Las chispas y barajitas que gana uno son de todos.**

## Controles

| Teclado | Mando | Celular | Acción |
|---|---|---|---|
| Flechas / WASD | Palanca izquierda | Deslizar a la izquierda | Caminar |
| Ratón (arrastrar) / Q E | Palanca derecha | Deslizar a la derecha | Girar la cámara |
| ESPACIO / Z | A | **A** | Saltar (sostener = más alto) |
| X / MAYÚS | B / X / gatillo | **B** | Poder |
| C / TAB | Y / hombros | **👥** | Cambiar de primo |
| ENTER | — | botón | Tienda / álbum / antena (cerca de ellos) |
| ESC | Start | ☰ | Pausa |

## Gráficos

Todo se dibuja con Three.js sin imágenes externas:
- **Texturas:** pintadas en el momento.
- **Formas:** bloques con bordes redondeados, personajes estilo caricatura (sombreado en 3 tonos
  y contorno).
- **Escenario:** sombras suaves que siguen al jugador, cielo con degradado, nubes y estrellas.
- **Agua y pasto:** agua con olas y reflejos, y pasto en instancias que se mueve con el viento.
- **Efectos:** partículas para polvo, chispitas, confeti, lluvia y luciérnagas, y relámpagos.
- **Movimiento:** cámara con suavizado, sacudidas y animación de estirar y aplastar.

La calidad se ajusta sola (alta, media o baja) según cómo vaya el aparato, y se puede cambiar en
la pausa.

## Voces

Las frases que ya estaban grabadas (Salomón y compañía) suenan con su mp3 (`voces.js`); las
demás las dice la voz del navegador.

## Archivos

| Archivo | Qué hace |
|---|---|
| `nucleo.js` | El motor sin dibujo: física, personajes, enemigos, jefes, peligros, progreso, revisor de niveles |
| `niveles.js` | Reglas de diseño + la Vereda y el nivel 1 |
| `niveles_b.js` · `niveles_c.js` · `niveles_d.js` | Niveles 2-5 · 6-8 · 9-12 |
| `graficos.js` | Texturas, materiales, modelos, cielo, agua, pasto, partículas |
| `vista.js` | Cámara, controles, marcador, menús, sonido, música y voces |
| `red.js` | Jugar con amigos |
| `voces.js` | Las grabaciones mp3 |
| `pruebas.js` | `node pruebas.js`: arma los 13 mundos, revisa que se llegue a todo con el equipo, prueba poderes, jaulas, dianas, jefes, tienda y red |
| `pruebas_red.js` | `node pruebas_red.js`: las partes puras de la red |
