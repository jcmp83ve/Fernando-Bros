# ⚡ Salomón y los Primos del Puente

Un juego **corto en 3D** (10 minutos, más o menos) por Maracaibo, con diálogos en maracucho.

Unas nubes negras se robaron **el relámpago del Catatumbo**, y sin relámpago no hay feria.
**Salomón**, **el Primo Verde** y **el Mollejúo** cruzan la ciudad para devolvérselo a
**la Chinita del Catatumbo**.

👉 **[Jugar](https://jcmp83ve.github.io/Fernando-Bros/salomon3d/)**

## Los personajes

| | Personaje | Salto | Poder (B) |
|---|---|---|---|
| 🧒 | **Salomón** (el del suéter rojo) | normal (~1,7 m) | 🪨 **Pedrada**: apunta sola a la nube más cercana |
| 🟢 | **El Primo Verde**: medio cagón, pero salta altísimo | **muy alto** (~3,3 m) | 🏃 **Carrerita**: «¡Patitas pa' qué te tengo!» |
| 🍔 | **El Mollejúo**: siempre tiene hambre | bajito (~1,2 m) | 💥 **Panzazo**: empuja gandolas y cayucos, y tumba nubes |
| 👑 | **La Chinita del Catatumbo** | — | Pide ayuda al principio y enciende el relámpago al final |

Con **👥** se cambia de personaje cuando uno quiera. Cada obstáculo necesita a uno distinto,
y el juego avisa a quién hay que usar.

## Los tres niveles

1. **El Saladillo**: hay que recoger 8 comidas pa' la feria (mandocas, patacones,
   tequeños, pastelitos, huevos chimbos, cepillados) y encontrar al Primo Verde, que está
   escondido detrás de unos pipotes. El muro de la plaza (2,6 m) solo lo salta el Primo.
2. **El Puente sobre el Lago**: hay que cruzar el puente esquivando carros y ventarrones.
   El Mollejúo tapa el paso hasta que le dan un patacón. Después hay una gandola atravesada
   que solo se quita con su panzazo.
3. **Los palafitos del Catatumbo** (de noche): hay tres chispas del relámpago. Una está en
   un techo alto (le toca al Primo), otra dentro de una nube gorda (le toca a Salomón con
   pedradas) y otra en una casita tapada por un cayuco (le toca al Mollejúo). Al final
   aparece **el Nublao**: se le dan pedradas y se esquivan sus rayos. Si se cae al lago,
   vuelve a la última bandera.

Aquí nunca se pierde: no hay vidas y los golpes solo empujan.

## Controles

| Teclado | Mando | Celular | Acción |
|---|---|---|---|
| Flechas / WASD | Palanca o cruceta | Deslizar el dedo a la izquierda | Caminar |
| ESPACIO / Z | A | **A** | Saltar (si se sostiene, salta más alto) |
| X / MAYÚS | B / X / gatillo | **B** | Poder |
| C / TAB | Y / hombros | **👥** | Cambiar de personaje |
| ESC | — | ✕ | Salir |

Se puede empezar directo en un nivel con `?nivel=2` o `?nivel=3`, o con los botones del título.

## Voces

Todas las frases tienen mp3, así que no hay voz de robot:
- **Salomón**: las grabaciones de *La Gran Aventura* («¡Salomón en la casa!», «¡Mira para
  arriba, primo! ¡Es el relámpago del Catatumbo!», etc.) y 16 frases nuevas hechas con
  Higgsfield (Seed Audio) **clonando su propia voz**.
- **El Primo Verde, el Mollejúo, la Chinita y el Nublao**: voces de Higgsfield, cada uno
  con la suya (el Primo más agudo y rápido, el Mollejúo grave, el Nublao muy grave y lento).

Si un mp3 no carga, habla la voz del navegador con el tono del personaje. Cuando el
Primo o el Mollejúo comen por primera vez, sus frases de comida van con voz del
navegador. Las grabaciones están en `CLIPS_PJ`, dentro de `salomon3d.js`.

## Archivos

- `index.html`: la página. Usa el mismo motor 3D de `../kart3d/three.min.js`.
- `salomon3d.js`: el **núcleo** (niveles, física, personajes, nubes), que se prueba sin
  navegador, y la **vista** con Three.js.
- `pruebas.js`: se corre con `node pruebas.js`. Un bot juega los tres niveles completos,
  revisa que cada obstáculo pida al personaje correcto y que las grabaciones sean las de
  La Gran Aventura.
