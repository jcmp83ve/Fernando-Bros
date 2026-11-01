'use strict';
/* ============================================================
   FERNANDO 3D — con Fernando y Tío Juan — el NÚCLEO
   Aquí vive todo lo que pasa en el juego (correr, saltar, los
   poderes, los enemigos, las estrellas, los mundos y el castillo)
   sin tocar la pantalla, para poder probarlo con node.
   La vista (vista.js) solo lo dibuja.

   Como en todo Fernando Bros, aquí NUNCA se pierde: no hay vidas.
   Si Fernando se cae, Tío Juan lo atrapa en el aire y lo devuelve.
   ============================================================ */
(function(raiz){

const CFG = {
  GRAV: 38, SALTO: 14, SALTO2: 12, VEL: 7.5,
  RADIO: 0.45, ALTO: 1.3, PASO: 0.55,
  COYOTE: 0.14, BUFFER: 0.16,
  RESORTE: 21, REBOTE: 12,
  INVUL: 2, AYUDA_CD: 6, GIRO_CD: 0.55,
  ESTRELLAS_FIN: 14,
};

/* Los poderes: todos se ganan tocando las cajas de regalo de Tío Juan */
const PODERES = {
  alas:        {nombre:'Gorra Alada',      emoji:'🪽', dur:20, color:'#ffffff'},
  fuego:       {nombre:'Flor de Fuego',    emoji:'🔥', dur:25, color:'#ff7a2a'},
  hamburguesa: {nombre:'Súper Hamburguesa',emoji:'🍔', dur:10, color:'#ffb43a'},
  gigante:     {nombre:'Hongo Gigante',    emoji:'🍄', dur:14, color:'#ff4a4a'},
  iman:        {nombre:'Imán de Monedas',  emoji:'🧲', dur:20, color:'#ff5a8a'},
  tenis:       {nombre:'Tenis Saltarines', emoji:'👟', dur:20, color:'#5aff9a'},
  /* los súper poderes */
  clon:        {nombre:'Caja de Clones',   emoji:'👯', dur:25, color:'#c08aff'},
  cohete:      {nombre:'Súper Vuelo',      emoji:'🚀', dur:20, color:'#3ad0ff'},
  fuerza:      {nombre:'Súper Fuerza',     emoji:'💪', dur:20, color:'#ff3a3a'},
  laser:       {nombre:'Ojos Láser',       emoji:'👀', dur:22, color:'#ff2a6a'},
  robot:       {nombre:'Fernando Robot',   emoji:'🤖', dur:20, color:'#a8c0d8'},
  /* las armas de juguete (cofres del Reino Pichunite) */
  agua:        {nombre:'Pistola de Agua',  emoji:'💦', dur:40, color:'#3ac8ff', arma:true},
  burbujas:    {nombre:'Lanza-Burbujas',   emoji:'🫧', dur:40, color:'#9ae0ff', arma:true},
  dardos:      {nombre:'Rifle de Dardos',  emoji:'🎯', dur:40, color:'#ff8a1a', arma:true},
  confeti:     {nombre:'Cañón de Confeti', emoji:'🎉', dur:40, color:'#ff5ab0', arma:true},
  globos:      {nombre:'Globos de Agua',   emoji:'🎈', dur:40, color:'#ff3a3a', arma:true},
  plomero:     {nombre:'Súper Plomero',    emoji:'🔧', dur:25, color:'#e8262a'},
};
/* cómo dispara cada arma: velocidad, gravedad, cada cuánto, tamaño y si explota (radio) */
const ARMAS = {
  agua:     {vel:20, g:14, cd:0.12, r:0.3, explota:0},
  burbujas: {vel:9, g:-1, cd:0.3, r:0.7, explota:0, vida:3},
  dardos:   {vel:32, g:0, cd:0.2, r:0.25, explota:0},
  confeti:  {vel:18, g:6, cd:0.8, r:0.4, explota:4},
  globos:   {vel:12, g:22, cd:0.55, r:0.35, explota:3.2, vy:8},
};
const LISTA_PODERES = Object.keys(PODERES);
const SUPER = ['clon', 'cohete', 'fuerza', 'laser', 'robot'];
const MAX_CLONES = 4;

/* Con quién se juega: cada amigo de la sala elige uno (todos tienen gorra con su letra) */
const PJS = {
  fernando: {nombre:'Fernando', letra:'F', gorra:'#e8262a', overol:'#2f52e6', color:'#ff6a5a'},
  lucca:    {nombre:'Lucca',    letra:'L', gorra:'#2ab84a', overol:'#1a3a8a', color:'#5aff8a'},
  salomon:  {nombre:'Salomón',  letra:'S', gorra:'#7ad83a', overol:'#1e8c3a', color:'#ffe23a'},
  cucu:     {nombre:'Cucú',     letra:'C', gorra:'#ff5ab0', overol:'#ffffff', color:'#ff9ad8', nina:true},
};
const MAX_JUGADORES = 4;

/* Quién habla: nombre en pantalla, color del globito y tono de voz */
const QUIEN = {
  fer:     {nombre:'Fernando', color:'#ff6a5a', emoji:'🧒', pitch:1.8, rate:1.05},
  fernando:{nombre:'Fernando', color:'#ff6a5a', emoji:'🧒', pitch:1.8, rate:1.05},
  tio:     {nombre:'Tío Juan', color:'#5aa8ff', emoji:'🦸', pitch:0.7, rate:0.95},
  malo:    {nombre:'El Malo',  color:'#9ad040', emoji:'👹', pitch:0.2, rate:0.8},
  santi:   {nombre:'Santi',    color:'#8ecbff', emoji:'👶', pitch:2,   rate:1.1},
  abu:     {nombre:'Abu',      color:'#d8a0ff', emoji:'👵', pitch:1.2, rate:0.9},
  penny:   {nombre:'Penny',    color:'#ff9ad8', emoji:'🐶', pitch:1.9, rate:1.1},
  sheldon: {nombre:'Sheldon',  color:'#e8b070', emoji:'🐕', pitch:1.5, rate:1.1},
  lucca:   {nombre:'Lucca',    color:'#5aff8a', emoji:'🧒', pitch:1.7, rate:1.1},
  salomon: {nombre:'Salomón',  color:'#ffe23a', emoji:'🧒', pitch:1.5, rate:1.1},
  cucu:    {nombre:'Cucú',     color:'#ff9ad8', emoji:'👧', pitch:1.9, rate:1.0},
};

/* Todas las frases (las pruebas revisan que ninguna quede sin dueño).
   Si hay varias, se elige una al azar. Casi todas son las mismas de la
   Aventura 3D y tienen voz grabada (voces.js); las demás las dice el
   navegador. */
const FRASES = {
  intro1:     ['tio', '¡Tío Juan al rescate!'],
  intro2:     ['tio', '¡Fernando! ¡El Rey Gruñón se robó las estrellas del castillo! ¡Entra en los cuadros mágicos y búscalas!'],
  intro3:     ['fer', '¡Soy el pichunguito de tío Juan!'],
  intro4:     ['fer', '¡Fernando Bros! ¡Vamos Penny y Sheldon!'],
  entra:      ['fer', ['¡Pichunguito al ataque!', '¡Qué divertido! ¡Otra vez, otra vez!']],
  perro:      ['penny', '¡Guau! ¡Penny al ataque!'],
  perro2:     ['sheldon', '¡Guau! ¡Sheldon al ataque!'],
  estrella:   ['fer', ['¡Gané! ¡Soy el pichunguito campeón!', '¡Qué divertido! ¡Otra vez, otra vez!', '¡Tesoro! ¡Encontré el tesoro!']],
  estrellaTio:['tio', ['¡Muy bien, mi pichunguito! ¡Eres un campeón!', 'Eres mi pichunguito']],
  estrellaYa: ['tio', '¡Esa estrella ya la tenías! ¡Igual brilla bonito!'],
  rojas:      ['tio', '¡Juntaste todas las monedas rojas! ¡Apareció una estrella!'],
  roja:       ['fer', ['¡Una moneda roja!', '¡Otra roja!']],
  toma:       ['fer', ['¡Toma, pichungazo!', '¡Pichunguito al ataque!']],
  jefeGolpe:  ['fer', '¡Toma, pichungazo!'],
  jefeCae:    ['tio', '¡Muy bien, mi pichunguito! ¡Eres un campeón!'],
  alas:       ['fer', '¡A volar, pichunguitos!'],
  nadar:      ['fer', ['¡Estoy nadando! ¡Mírame!', '¡Al agua, pichunguitos!']],
  fuego:      ['fer', '¡Fuego pichunguito!'],
  hamburguesa:['tio', '¡Tío Juan al rescate! ¡Toma una hamburguesa, pichunguito, corre!'],
  hamb2:      ['fer', '¡Qué rica hamburguesa!'],
  gigante:    ['fer', '¡Soy gigante! ¡El pichunguito más grande del mundo!'],
  iman:       ['tio', '¡Imán de monedas! ¡Todas vienen a ti!'],
  tenis:      ['tio', ['¡Tenis saltarines! ¡Salta súper alto!', '¡Arriba, arriba! ¡Tío Juan vuela!']],
  clon:       ['tio', '¡La caja de clones! ¡Cada vez que saltes aparece otro Fernando!'],
  clonSale:   ['fer', ['¡Otro Fernando!', '¡Somos un equipo de pichunguitos!']],
  cohete:     ['fer', '¡Súper vuelo! ¡Más rápido que un cohete!'],
  fuerza:     ['fer', '¡Súper fuerza! ¡Soy el pichunguito más fuerte!'],
  laser:      ['fer', '¡Rayos láser con los ojos! ¡Piu, piu!'],
  robot:      ['fer', '¡Modo robot activado! ¡Bip, bup!'],
  choca:      ['fer', ['¡Choca esos cinco!', '¡Equipo pichunguito!', '¡Somos un equipo!']],
  agua:       ['fer', '¡Pistola de agua! ¡Splash, splash!'],
  burbujas:   ['fer', '¡Lanza-burbujas! ¡Burbujas para los monstruos!'],
  dardos:     ['fer', '¡Rifle de dardos de espuma! ¡Piu, piu!'],
  confeti:    ['fer', '¡Cañón de confeti! ¡Bum de colores!'],
  globos:     ['fer', '¡Globos de agua! ¡Splash!'],
  plomero:    ['fer', '¡Súper Plomero! ¡Ya-juu! ¡Triple salto!'],
  pocion:     ['tio', '¡Poción de escudo! ¡Ahora el escudo te protege!'],
  escudoRoto: ['fer', '¡Mi escudo me salvó!'],
  reino1:     ['tio', '¡Bienvenido al Reino Pichunite! ¡Salta del autobús volador! ¡Hay veinte estrellas escondidas!'],
  reino2:     ['fer', '¡Vamos a la aventura! ¡Busquen los cofres!'],
  zonaLista:  ['tio', '¡Venciste a todos los monstruos de aquí! ¡Apareció una estrella!'],
  dianasListas:['tio', '¡Le diste a todas las dianas! ¡Qué puntería, pichunguito!'],
  pinata:     ['fer', '¡Rompí la llama piñata! ¡Una estrella!'],
  superPortal:['tio', ['¡Toma un súper poder nuevo para este mundo!', '¡Un súper poder de regalo, pichunguito!']],
  vuelta:     ['tio', '¡Encontraste todas las estrellas! ¡Ahora se escondieron en otros lugares! ¡A buscarlas otra vez!'],
  vueltaFer:  ['fer', '¡Otra vez, otra vez!'],
  ayuda:      ['fer', ['¡Tío Juan, ayúdame!', '¡Ayuda, tío Juan!']],
  ayudaVoy:   ['tio', ['¡Tío Juan al rescate!', '¡Arriba, arriba! ¡Tío Juan vuela!']],
  regalo:     ['tio', ['¡Toma un regalo, pichunguito!', 'Eres mi pichunguito']],
  gracias:    ['fer', '¡Gracias tío Juan!'],
  rescate:    ['tio', ['¡Tío Juan al rescate!', 'Eres mi pichunguito']],
  ay:         ['fer', ['¡Ay!', '¡Uy!']],
  bloqueado:  ['tio', '¡Para este cuadro necesitas más estrellas!'],
  todas:      ['fer', '¡Gané! ¡Soy el pichunguito campeón!'],
  monedas50:  ['tio', '¡Muy bien, mi pichunguito! ¡Eres un campeón!'],
  santi:      ['fer', 'Te amo Santi, mi hermanito'],
  santi2:     ['santi', '¡Hola! ¡Soy Santi!'],
  abu:        ['fer', 'Te amo Abu'],
  abu2:       ['abu', '¡Hola, mi cielo! ¡Abu te quiere!'],
  abu3:       ['abu', '¡Busca la estrella de arriba del molino, mi pichunguito!'],
  tejado:     ['tio', '¡Fernando! ¡Allá arriba en el techo del castillo brilla una estrella!'],
  final1:     ['malo', '¡Noooo! ¡Me ganó un niño de seis años!'],
  final2:     ['fer', 'Te amo tío Juan, yo soy tu pichunguito'],
  final3:     ['tio', '¡Hola, familia! ¡Un abrazo de tío Juan!'],
  pista:      ['tio', ['¡Sigue la flecha amarilla que va encima de ti!', '¡La flecha amarilla te lleva a las estrellas!']],
  /* los países */
  paises:     ['tio', '¡Pichunguito, mira atrás! ¡Hay cuadros nuevos: Maracaibo, Estados Unidos, Italia, China y Argentina!'],
  maracaibo1: ['tio', '¡Bienvenido a Maracaibo, la tierra del sol amada! ¡Sube al campanario de la Chinita!'],
  maracaibo2: ['fer', '¡Qué molleja! ¡Mira el puente sobre el Lago!'],
  usa1:       ['tio', '¡Bienvenido a Estados Unidos! ¡Sube hasta la antorcha de la Estatua de la Libertad!'],
  usa2:       ['fer', '¡Wow! ¡Qué edificios tan altos!'],
  italia1:    ['tio', '¡Bienvenido a Italia! ¡Sube a la Torre de Pisa, la que está chueca!'],
  italia2:    ['fer', '¡Mamma mia! ¡Pizzas gigantes!'],
  china1:     ['tio', '¡Bienvenido a China! ¡Sube por la Gran Muralla hasta la torre más alta!'],
  china2:     ['fer', '¡Mira, pandas! ¡Ni hao!'],
  argentina1: ['tio', '¡Bienvenido a Argentina, la tierra de Messi! ¡Busca los ocho Balones de Oro y mete un gol!'],
  argentina2: ['fer', '¡Vamos Messi! ¡Vamos Argentina!'],
  balon:      ['fer', ['¡Un Balón de Oro!', '¡Otro Balón de Oro, como Messi!']],
  balones:    ['tio', '¡Juntaste los ocho Balones de Oro, como Messi! ¡Apareció una estrella!'],
  pelota:     ['tio', '¡Patea la pelota hasta el arco y mete un gol!'],
  gol:        ['fer', ['¡Gooool! ¡Golazo como Messi!', '¡Gol, gol, gol!']],
  golTio:     ['tio', '¡Qué golazo, pichunguito! ¡Eres como Messi!'],
};
/* Cuando se juega con Lucca, Salomón o Cucú, algunas frases cambian por las suyas (también grabadas) */
const FRASES_PJ = {
  lucca:   {entra:'¡Lucca al ataque!', toma:'¡Lucca al ataque!', alas:'¡Estoy volando! ¡Mírame!', hamb2:'¡Ñam! ¡Qué rica hamburguesa!', estrella:'¡Encontré el tesoro!', todas:'¡Encontré el tesoro!', intro3:'¡Hola! ¡Soy Lucca, el amigo de Fernando!'},
  salomon: {entra:'¡Salomón en la casa!', toma:'¡Salomón en la casa!', alas:'¡Volando con estilo!', hamb2:'¡Esta hamburguesa está brutal!', estrella:'¡El tesoro! ¡Somos ricos!', todas:'¡El tesoro! ¡Somos ricos!', intro3:'¡Hola! ¡Salomón quiere jugar!'},
  cucu:    {entra:'¡Cucú! ¡Aquí estoy!', toma:'¡Cucú! ¡Aquí estoy!', alas:'¡Estoy volando como un pajarito!', hamb2:'¡Qué rica hamburguesa!', estrella:'¡Encontré el tesoro!', todas:'¡Encontré el tesoro!', intro3:'¡Hola! ¡Soy Cucú! ¿Jugamos?'},
};
/* Lo que dice Fernando cuando llega un amigo a la sala */
const SALUDOS = {
  fernando: ['fer', '¡Fernando Bros! ¡Vamos Penny y Sheldon!'],
  lucca:    ['fer', '¡Luca! ¡Mi amigo pichunguito!'],
  salomon:  ['fer', '¡Salomón! ¡Juega conmigo, pichunguito!'],
  cucu:     ['fer', 'Hola Cucú, acompáñame'],
};

/* ============================================================
   LOS MUNDOS
   Las piezas: C = colina (cilindro hasta el suelo), P = plataforma
   que flota, B = bloque, R = rampa. Todo salto obligatorio mide como
   mucho 2,3 m de alto y 4 m de hueco (el salto llega a 2,6 m).
   ============================================================ */
function C(x, z, r, y1, mat, o){ return Object.assign({t:'cil', x, z, r, y0:-40, y1, mat: mat || 'pasto'}, o || {}); }
function P(x, y, z, r, mat, o){ return Object.assign({t:'cil', x, z, r, y0:y-0.9, y1:y, mat: mat || 'pasto', flota:true}, o || {}); }
function B(x, z, sx, sz, y1, mat, o){ return Object.assign({t:'caja', x, z, sx, sz, y0:-40, y1, mat: mat || 'piedra'}, o || {}); }
function R(x, z, sx, sz, eje, ya, yb, mat, o){ return Object.assign({t:'rampa', x, z, sx, sz, eje, ya, yb, y0:-40, y1:Math.max(ya, yb), mat: mat || 'pasto'}, o || {}); }
function resorte(x, z, y){ return {t:'cil', x, z, r:0.9, y0:(y||0)-0.3, y1:(y||0)+0.45, mat:'resorte', resorte:true}; }
/* un anillo de monedas */
function anillo(x, y, z, r, n){ const out = []; for (let i=0;i<n;i++){ const a = i/n*Math.PI*2; out.push([x+Math.sin(a)*r, y, z+Math.cos(a)*r]); } return out; }
function fila(x0, y0, z0, x1, y1, z1, n){ const out = []; for (let i=0;i<n;i++){ const u = n === 1 ? 0 : i/(n-1); out.push([x0+(x1-x0)*u, y0+(y1-y0)*u, z0+(z1-z0)*u]); } return out; }

const MUNDOS = [];

/* ---------- 0) El jardín del castillo de Tío Juan ---------- */
MUNDOS.push({
  id:'castillo', nombre:'El Castillo de Tío Juan', emoji:'🏰', tema:'castillo',
  inicio:{x:0, z:14, ang:Math.PI}, yMuerte:-8, agua:{y:-0.8, tipo:'agua'}, techo:30,
  solidos:[
    C(0, 0, 46, 0, 'pasto'),
    B(0, -34, 16, 7, 8.8, 'castillo'),           // el castillo: el techo es una terraza
    C(-15, -29, 2.6, 13, 'torre'), C(15, -29, 2.6, 13, 'torre'),
    C(-15, -39, 2.6, 13, 'torre'), C(15, -39, 2.6, 13, 'torre'),
    C(0, -37, 4, 16, 'torre'),
    C(0, -4, 2.6, 0.8, 'piedra'),                // la fuente
    P(-10, 2.2, -21, 1.7, 'piedra'), P(-14, 4.4, -22.6, 1.7, 'piedra'), P(-11, 6.6, -24.6, 1.7, 'piedra'),
    resorte(7, 6),
    C(-30, 14, 5, 1.2, 'pasto'), C(-33, 16, 2.6, 2.6, 'pasto'),
    C(30, 14, 5, 1.2, 'pasto'), C(33, 16, 2.6, 2.6, 'pasto'),
  ],
  monedas:[...anillo(0, 0.9, -4, 4.5, 10), ...fila(-3, 0.9, 10, -14, 0.9, -8, 6), ...fila(3, 0.9, 10, 14, 0.9, -8, 6),
           [-33, 3.6, 16], [33, 3.6, 16], [-10, 3.2, -21], [-14, 5.4, -22.6], [-11, 7.6, -24.6], ...anillo(7, 3.5, 6, 1.6, 6)],
  rojas:[],
  estrellas:[{id:'tejado', tipo:'libre', x:0, y:10.2, z:-30.5, nombre:'El techo del castillo'}],
  enemigos:[], jefe:null,
  cajas:[{x:-6, z:4, poder:'alas'}, {x:9, z:-2, poder:'gigante'}, {x:-9, z:-2, poder:'tenis'},
         /* los súper poderes, cerca del inicio */
         {x:-14, z:8, poder:'clon'}, {x:14, z:8, poder:'cohete'}, {x:-8, z:20, poder:'fuerza'}, {x:8, z:20, poder:'laser'}, {x:0, z:24, poder:'robot'}],
  portales:[
    {mundo:1, x:-16, z:-12, necesita:0},
    {mundo:2, x:-24, z:2,   necesita:1},
    {mundo:3, x:16,  z:-12, necesita:3},
    {mundo:4, x:24,  z:2,   necesita:5},
    {mundo:5, x:0,   z:-24.6, necesita:8},
    /* los países (abiertos desde el principio) */
    {mundo:6,  x:-30, z:28, necesita:0},
    {mundo:7,  x:-15, z:36, necesita:0},
    {mundo:8,  x:0,   z:39, necesita:0},
    {mundo:9,  x:15,  z:36, necesita:0},
    {mundo:10, x:30,  z:28, necesita:0},
    /* el Reino Pichunite */
    {mundo:11, x:36,  z:-22, necesita:0},
  ],
  amigos:[],
  deco:{arboles:46, flores:120, rocas:10},
});

/* ---------- 1) La Pradera del Pichunguito ---------- */
MUNDOS.push({
  id:'pradera', nombre:'La Pradera del Pichunguito', emoji:'🌳', tema:'pradera',
  inicio:{x:0, z:22, ang:Math.PI}, yMuerte:-6, agua:{y:-0.7, tipo:'agua'}, techo:30,
  tubo:{x:5, z:22},
  solidos:[
    C(0, 0, 30, 0, 'pasto'),
    C(-12, -6, 8, 2, 'pasto'), C(-12, -6, 4.5, 4.2, 'pasto'), C(-12, -6, 2, 6.4, 'molino'),
    P(33.5, 0.6, 0, 1.8, 'madera'), P(37.5, 1.2, 2, 1.8, 'madera'), C(44, 3, 6, 1.8, 'pasto'),
    P(-35, 0.6, 10, 2, 'madera', {mov:{eje:'x', amp:3, vel:0.7}}), C(-42, 10, 5, 2.2, 'pasto'),
    P(8, 2, -18, 2, 'pasto'), P(12, 4, -22, 2, 'pasto'),
    resorte(16, 6),
    C(0, -40, 9, 0.5, 'pasto'),
    B(18, 16, 2, 2, 1.2, 'madera'), B(22, 16, 1.5, 1.5, 2.4, 'madera'),
  ],
  monedas:[...anillo(0, 0.9, 6, 5, 8), ...fila(-2, 0.9, 16, -9, 0.9, 4, 5), ...anillo(-12, 3, -6, 6.2, 10),
           ...fila(31.5, 1.6, 0, 44, 2.8, 3, 6), ...fila(8, 0.9, -8, 12, 5, -22, 5), ...anillo(0, 1.5, -40, 5, 8),
           [22, 3.4, 16], [-42, 3.2, 12], [-42, 3.2, 8]],
  rojas:[[37.5, 2.2, 2], [-42, 3.4, 10], [-12, 3.2, 0.5], [12, 5.2, -22], [16, 5, 6]],
  estrellas:[
    {id:'torre', tipo:'libre', x:-12, y:7.7, z:-6, nombre:'Arriba del molino'},
    {id:'rojas', tipo:'rojas', x:0, y:1.4, z:0, nombre:'Las cinco monedas rojas'},
    {id:'jefe',  tipo:'jefe',  x:0, y:1.9, z:-40, nombre:'El Gran Gruñón'},
  ],
  enemigos:[
    {tipo:'grunon', x:6, z:8}, {tipo:'grunon', x:-6, z:10}, {tipo:'grunon', x:10, z:-6},
    {tipo:'grunon', x:-20, z:10}, {tipo:'grunon', x:20, z:-14}, {tipo:'grunon', x:-12, z:-13},
    {tipo:'abeja', x:14, z:12, y:2.6}, {tipo:'abeja', x:-4, z:-14, y:2.4},
  ],
  jefe:{x:0, z:-40, r:8.5, piel:'grunon', nombre:'Gran Gruñón', vida:3, vel:2.6,
        hola:'¡Grrr! ¡Soy el Gran Gruñón! ¡Esta estrella es mía!', cae:'¡Ay, ay, ay! ¡Me aplastaron!'},
  cajas:[{x:-4, z:16, poder:'fuego'}, {x:8, z:14, poder:'tenis'}, {x:44, z:3, poder:'alas'},
         {x:-20, z:-14, poder:'hamburguesa'}, {x:12, z:-2, poder:'iman'}, {x:0, z:-27, poder:'gigante'}],
  amigos:[{quien:'abu', x:-4, z:4, frases:['abu', 'abu2', 'abu3']}],
  deco:{arboles:40, flores:160, rocas:12, cercas:true, hongos:14},
});

/* ---------- 2) La Playa de Penny ---------- */
const faro = {x:12, z:-10};
const espiral = [];
for (let k=0;k<7;k++){ const a = k*55*Math.PI/180; espiral.push(P(faro.x + Math.sin(a)*4.9, 1.7*(k+1), faro.z + Math.cos(a)*4.9, 1.5, 'madera')); }
MUNDOS.push({
  id:'playa', nombre:'La Playa de Penny', emoji:'🏖️', tema:'playa',
  inicio:{x:0, z:20, ang:Math.PI}, yMuerte:-6, agua:{y:-0.5, tipo:'mar'}, techo:30,
  tubo:{x:5, z:19},
  solidos:[
    C(0, 0, 26, 0, 'arena'),
    C(faro.x, faro.z, 2.8, 13, 'faro'), ...espiral,
    C(-30, -12, 5, 1, 'arena'), C(20, 26, 4.5, 0.8, 'arena'),
    P(0, 0.6, 31, 2.2, 'madera', {mov:{eje:'z', amp:4, vel:0.6}}), C(0, 42, 5, 1.2, 'arena'),
    B(-10, -14, 3, 3, 2.2, 'castilloArena'),
    P(-4, 0.5, -28.5, 1.6, 'piedra'), C(-6, -38, 9, 0.6, 'arena'),
    resorte(-14, 8),
  ],
  monedas:[...anillo(0, 0.9, 4, 5, 8), ...fila(-6, 0.9, 14, -26, 2, -12, 7), ...fila(8, 0.9, 16, 20, 1.8, 26, 5),
           ...fila(0, 0.9, 24, 0, 2.2, 42, 7), ...anillo(-6, 1.6, -38, 5, 8), ...anillo(-14, 4, 8, 1.6, 6)],
  rojas:[[-30, 2.2, -12], [20, 2, 26], [0, 2.4, 42], [espiral[3].x, espiral[3].y1+1.2, espiral[3].z], [-10, 3.4, -14]],
  estrellas:[
    {id:'faro',  tipo:'libre', x:faro.x, y:14.2, z:faro.z, nombre:'La luz del faro'},
    {id:'rojas', tipo:'rojas', x:0, y:1.4, z:4, nombre:'Las monedas rojas de la playa'},
    {id:'jefe',  tipo:'jefe',  x:-6, y:2, z:-38, nombre:'El Cangrejo Gigante'},
  ],
  enemigos:[
    {tipo:'grunon', piel:'cangrejo', x:8, z:6}, {tipo:'grunon', piel:'cangrejo', x:-8, z:8},
    {tipo:'grunon', piel:'cangrejo', x:-14, z:-4}, {tipo:'grunon', piel:'cangrejo', x:14, z:10},
    {tipo:'grunon', piel:'cangrejo', x:-30, z:-12},
    {tipo:'abeja', piel:'gaviota', x:0, z:-6, y:3.5}, {tipo:'abeja', piel:'gaviota', x:16, z:16, y:3},
  ],
  jefe:{x:-6, z:-38, r:8.5, piel:'cangrejo', nombre:'Cangrejo Gigante', vida:3, vel:2.8,
        hola:'¡Clac, clac! ¡Soy el Cangrejo Gigante! ¡No te doy la estrella!', cae:'¡Clac! ¡Me voy al mar!'},
  cajas:[{x:-5, z:12, poder:'fuego'}, {x:8, z:2, poder:'iman'}, {x:16, z:-2, poder:'alas'},
         {x:-16, z:4, poder:'hamburguesa'}, {x:6, z:-18, poder:'tenis'}],
  amigos:[],
  deco:{palmeras:26, conchas:30, sombrillas:5, rocas:8},
});

/* ---------- 3) La Montaña Nevada de Sheldon ---------- */
MUNDOS.push({
  id:'nieve', nombre:'La Montaña Nevada de Sheldon', emoji:'⛄', tema:'nieve',
  inicio:{x:0, z:24, ang:Math.PI}, yMuerte:-6, agua:{y:-0.8, tipo:'hielo'}, techo:34,
  tubo:{x:5, z:23},
  solidos:[
    C(0, 0, 30, 0, 'nieve'),
    C(0, -8, 16, 2.2, 'nieve'), C(0, -8, 11, 4.4, 'nieve'), C(0, -8, 6.5, 6.6, 'nieve'), C(0, -8, 3, 8.8, 'nieve'),
    P(20, 1.5, -14, 2, 'hielo', {hielo:true}), P(23, 3, -19, 2, 'hielo', {hielo:true}), P(20, 4.5, -24, 2, 'hielo', {hielo:true}),
    P(-34, 0.8, -4, 2, 'hielo', {hielo:true, mov:{eje:'x', amp:3, vel:0.7}}), C(-40, -4, 5, 1.5, 'nieve'),
    resorte(14, 8),
    C(0, -38, 9, 0.5, 'nieve'),
    B(-18, 14, 3, 2, 1.4, 'hielo', {hielo:true}),
  ],
  monedas:[...anillo(0, 0.9, 12, 4, 8), ...anillo(0, 3.2, -8, 13.5, 12), ...anillo(0, 5.4, -8, 8.7, 10), ...anillo(0, 7.6, -8, 4.7, 8),
           ...fila(20, 2.7, -14, 20, 5.7, -24, 4), ...fila(-31, 1.8, -4, -40, 2.7, -4, 4), ...anillo(0, 1.5, -38, 5, 8)],
  rojas:[[0, 3.4, 5.5], [-8.5, 5.6, -8], [0, 7.8, -12.8], [20, 5.7, -24], [-40, 2.7, -4]],
  estrellas:[
    {id:'cima',  tipo:'libre', x:0, y:10.1, z:-8, nombre:'La cima de la montaña'},
    {id:'rojas', tipo:'rojas', x:-14, y:1.4, z:10, nombre:'Las monedas rojas de la nieve'},
    {id:'jefe',  tipo:'jefe',  x:0, y:1.9, z:-38, nombre:'El Muñeco de Nieve Gigante'},
  ],
  enemigos:[
    {tipo:'grunon', piel:'pinguino', x:10, z:10}, {tipo:'grunon', piel:'pinguino', x:-10, z:12},
    {tipo:'grunon', piel:'pinguino', x:-20, z:-6}, {tipo:'grunon', piel:'pinguino', x:18, z:-2},
    {tipo:'grunon', piel:'pinguino', x:10, z:-14}, {tipo:'grunon', piel:'pinguino', x:-7, z:-10},
    {tipo:'abeja', piel:'pajaro', x:-14, z:-20, y:4},
  ],
  jefe:{x:0, z:-38, r:8.5, piel:'muneco', nombre:'Muñeco de Nieve Gigante', vida:3, vel:2.8,
        hola:'¡Brrr! ¡Soy el Muñeco Gigante! ¡Te voy a congelar!', cae:'¡Me derrito, me derrito!'},
  cajas:[{x:-6, z:16, poder:'gigante'}, {x:6, z:16, poder:'tenis'}, {x:-18, z:4, poder:'fuego'},
         {x:22, z:10, poder:'alas'}, {x:-10, z:-28, poder:'hamburguesa'}],
  amigos:[],
  deco:{pinos:44, munecos:6, rocas:10, regalos:6},
});

/* ---------- 4) Las Nubes de Santi ---------- */
MUNDOS.push({
  id:'nubes', nombre:'Las Nubes de Santi', emoji:'☁️', tema:'nubes',
  inicio:{x:0, z:6, ang:Math.PI}, yMuerte:-14, agua:null, techo:40,
  tubo:{x:4, z:5},
  solidos:[
    C(0, 0, 9, 0, 'nube', {y0:-3}),
    P(0, 1.5, -12, 2.6, 'nube'), P(-5, 3, -17.5, 2.6, 'nube'), P(-2, 4.5, -24, 3, 'nube'),
    C(4, -34, 7, 5, 'nube', {y0:2}),
    P(10, 7, -38, 1.8, 'arcoiris'), P(13, 9, -43, 1.8, 'arcoiris'), P(10, 11, -48, 1.8, 'arcoiris'),
    C(3, -50, 4.5, 13, 'nube', {y0:10}),
    resorte(5, -3),
    P(12, 0.5, 2, 2.4, 'nube'), P(18, 1, 2, 2.4, 'nube', {mov:{eje:'x', amp:2.5, vel:0.8}}), C(27, 2, 5, 1.5, 'nube', {y0:-1.5}),
    P(-12, 1, 3, 2.4, 'nube'), P(-17, 2.5, 6, 2.2, 'nube'), C(-24, 8, 4.5, 3.5, 'nube', {y0:0}),
    P(0, 0.3, 11.8, 2.2, 'nube'), C(0, 22, 8, 0, 'nube', {y0:-3}),
  ],
  monedas:[...anillo(0, 0.9, 0, 5, 8), ...fila(0, 2.6, -12, -2, 5.6, -24, 4), ...anillo(4, 6, -34, 4.5, 8),
           ...fila(10, 8.2, -38, 10, 12.2, -48, 3), ...fila(12, 1.6, 2, 27, 2.6, 2, 5), ...fila(-12, 2, 3, -24, 4.5, 8, 4),
           ...anillo(5, 4, -3, 1.6, 6), ...anillo(0, 1.2, 22, 5, 8)],
  rojas:[[27, 2.7, 2], [18, 2.2, 2], [-24, 4.7, 8], [-5, 4.2, -17.5], [8, 6.2, -30]],
  estrellas:[
    {id:'arcoiris', tipo:'libre', x:3, y:14.2, z:-50, nombre:'Al final del arcoíris'},
    {id:'rojas',    tipo:'rojas', x:0, y:1.4, z:-4, nombre:'Las monedas rojas de las nubes'},
    {id:'jefe',     tipo:'jefe',  x:0, y:1.5, z:22, nombre:'El Nubarrón Gruñón'},
  ],
  enemigos:[
    {tipo:'grunon', piel:'nubecita', x:4, z:-34}, {tipo:'grunon', piel:'nubecita', x:27, z:2},
    {tipo:'grunon', piel:'nubecita', x:-24, z:8}, {tipo:'grunon', piel:'nubecita', x:-4, z:2},
    {tipo:'abeja', x:-2, z:-20, y:6}, {tipo:'abeja', x:14, z:-36, y:9}, {tipo:'abeja', x:20, z:6, y:4},
  ],
  jefe:{x:0, z:22, r:7.5, piel:'nubarron', nombre:'Nubarrón Gruñón', vida:3, vel:2.8,
        hola:'¡Bruuum! ¡Soy el Nubarrón Gruñón! ¡Aquí llueve!', cae:'¡Me deshice como algodón de azúcar!'},
  cajas:[{x:-4, z:-3, poder:'alas'}, {x:3, z:-30, poder:'tenis'}, {x:27, z:4, poder:'fuego'}, {x:-3, z:3, poder:'iman'},
         {x:-24, z:10, poder:'hamburguesa'}],
  amigos:[{quien:'santi', x:-24, z:6, frases:['santi', 'santi2']}],
  deco:{nubesDeco:30, globos:10},
});

/* ---------- 5) El Castillo del Rey Gruñón ---------- */
MUNDOS.push({
  id:'lava', nombre:'El Castillo del Rey Gruñón', emoji:'🌋', tema:'lava',
  inicio:{x:0, z:4, ang:Math.PI}, yMuerte:-3, agua:{y:-0.5, tipo:'lava'}, techo:26,
  tubo:{x:4, z:3},
  solidos:[
    C(0, 0, 7, 0, 'piedraOscura'),
    P(0, 0.6, -10, 2.2, 'piedraOscura'), P(0, 1.2, -16.5, 2.2, 'piedraOscura', {mov:{eje:'x', amp:3, vel:0.7}}),
    P(0, 1.8, -23, 2.2, 'piedraOscura'),
    B(0, -32, 2.6, 6, 2.2, 'castillo'),
    C(0, -48, 11, 2.2, 'castillo'),
  ],
  monedas:[...anillo(0, 0.9, 0, 4, 8), ...fila(0, 1.6, -10, 0, 2.8, -23, 3), ...fila(0, 3.1, -27, 0, 3.1, -37, 5), ...anillo(0, 3.2, -48, 7, 12)],
  rojas:[],
  estrellas:[{id:'final', tipo:'jefe', x:0, y:4, z:-48, nombre:'La Gran Estrella', grande:true}],
  enemigos:[{tipo:'grunon', x:0, z:-29}, {tipo:'grunon', x:0, z:-35}, {tipo:'abeja', piel:'murcielago', x:3, z:-16, y:4}],
  jefe:{x:0, z:-50, r:10, piel:'rey', nombre:'Rey Gruñón', vida:3, vel:3.1, rey:true,
        hola:'¡Ja, ja, ja! ¡Soy el Rey Gruñón! ¡Las estrellas son mías!', cae:'¡Noooo! ¡Me ganó un niño de seis años!'},
  cajas:[{x:-3, z:-2, poder:'hamburguesa'}, {x:3, z:-2, poder:'fuego'}, {x:0, z:-28, poder:'gigante'}],
  amigos:[],
  deco:{antorchas:10, columnas:8},
});

/* ============================================================
   LOS PAÍSES: cinco cuadros nuevos en el jardín del castillo
   (Maracaibo, Estados Unidos, Italia, China y Argentina).
   Mismas reglas de saltos que los demás mundos.
   ============================================================ */

/* ---------- 6) Maracaibo, la Tierra del Sol Amada ---------- */
MUNDOS.push({
  id:'maracaibo', nombre:'Maracaibo, la Tierra del Sol', corto:'MARACAIBO', emoji:'🌉', tema:'maracaibo', color:'#ffb21a',
  inicio:{x:0, z:16, ang:Math.PI}, yMuerte:-8, agua:{y:-0.6, tipo:'agua'}, techo:30,
  tubo:{x:5, z:15},
  saludo:['maracaibo1', 'maracaibo2'],
  solidos:[
    C(0, 0, 22, 0, 'pasto'),
    /* las casitas de colores de Santa Lucía: una escalera de techos */
    B(-10, 4, 2, 2, 2.2, 'casa1'), B(-14, 4, 2, 2, 4.2, 'casa2'), B(-18, 4, 2, 2, 6.2, 'casa3'),
    B(8, 10, 1.8, 1.8, 2.2, 'casa4'), B(11.6, 10, 1.6, 1.8, 3.2, 'casa2'),
    /* la Basílica de la Chinita con sus dos campanarios */
    B(-6, -7, 1.6, 1.4, 2.2, 'colonial'), B(-6, -12, 4, 3, 4.4, 'colonial'),
    C(-8.6, -13.4, 1.3, 6.6, 'campanario'), C(-3.4, -13.4, 1.3, 6.6, 'campanario'),
    /* el Puente General Rafael Urdaneta sobre el Lago */
    R(19, -6, 2.2, 1.8, 'x', 0, 1.4, 'puente'), B(32.6, -6, 11.4, 1.8, 1.4, 'puente'), R(46, -6, 2, 1.8, 'x', 1.4, 0.8, 'puente'),
    C(53, -6, 8, 0.8, 'pasto'),
    /* las plataformas petroleras del Lago */
    B(-17, 17, 1.8, 1.8, 0.6, 'petroleo'), B(-21.5, 18, 1.8, 1.8, 1.4, 'petroleo'), B(-26.5, 19.5, 2.5, 2.5, 2.2, 'petroleo'),
    resorte(6, 4),
  ],
  monedas:[...anillo(0, 0.9, 6, 3.6, 8), ...fila(22, 2.3, -6, 43, 2.3, -6, 8), [-10, 3.4, 4], [-14, 5.4, 4], [8, 3.4, 10], [11.6, 4.4, 10],
           ...fila(-9, 5.6, -10, -4.5, 5.6, -10, 3), ...fila(-17, 1.8, 17, -21.5, 2.6, 18, 2), ...anillo(53, 1.8, -6, 5, 8), ...anillo(6, 3.5, 4, 1.6, 6),
           ...fila(-2, 0.9, -3, -14, 0.9, -1, 5)],
  rojas:[[-18, 7.4, 4], [-25.5, 3.4, 18.5], [32.6, 2.6, -6], [-2.6, 5.6, -10], [6, 5, 4]],
  estrellas:[
    {id:'chinita', tipo:'libre', x:-8.6, y:7.9, z:-13.4, nombre:'El campanario de la Chinita'},
    {id:'rojas',   tipo:'rojas', x:0, y:1.4, z:0, nombre:'Las monedas rojas del Lago'},
    {id:'jefe',    tipo:'jefe',  x:53, y:2.7, z:-6, nombre:'La Iguana Gigante'},
  ],
  enemigos:[
    {tipo:'grunon', piel:'iguana', x:6, z:-6}, {tipo:'grunon', piel:'iguana', x:-6, z:4}, {tipo:'grunon', piel:'iguana', x:10, z:-12},
    {tipo:'grunon', piel:'iguana', x:-14, z:-6}, {tipo:'grunon', piel:'iguana', x:13, z:2},
    {tipo:'abeja', piel:'zancudo', x:2, z:-14, y:2.6}, {tipo:'abeja', piel:'zancudo', x:16, z:8, y:2.8},
  ],
  jefe:{x:53, z:-6, r:6.5, piel:'iguana', nombre:'Iguana Gigante', vida:3, vel:2.6,
        hola:'¡Sssí! ¡Soy la Iguana Gigante del Lago! ¡Esta estrella es mía!', cae:'¡Ay, qué molleja! ¡Me voy al Lago!'},
  cajas:[{x:-4, z:12, poder:'hamburguesa'}, {x:4, z:-3, poder:'alas'}, {x:14, z:-9, poder:'fuego'}, {x:-15, z:10, poder:'tenis'}, {x:16, z:4, poder:'iman'}],
  amigos:[],
  deco:{palmeras:22, rocas:6},
});

/* ---------- 7) Estados Unidos ---------- */
const lib = {x:-30, z:-14};
const espiralLib = [];
for (let k = 1; k <= 5; k++){ const a = k*60*Math.PI/180; espiralLib.push(P(lib.x + Math.sin(a)*3, 3.2 + 1.7*k, lib.z + Math.cos(a)*3, 1.4, 'piedra')); }
MUNDOS.push({
  id:'usa', nombre:'Estados Unidos', corto:'USA', emoji:'🗽', tema:'usa', color:'#3a6aff',
  inicio:{x:0, z:18, ang:Math.PI}, yMuerte:-8, agua:{y:-0.5, tipo:'mar'}, techo:32,
  tubo:{x:5, z:18},
  saludo:['usa1', 'usa2'],
  pisos:[{x:0, z:6, sx:22, sz:2, mat:'asfalto'}],
  solidos:[
    C(0, 0, 24, 0, 'pasto'),
    /* los rascacielos: de techo en techo hasta el más alto */
    B(8, -8, 2.5, 2.5, 2.2, 'rasca1'), B(13, -8, 2, 2, 4.4, 'rasca2'), B(13, -13.5, 2, 2, 6.6, 'rasca3'), B(8, -15, 2.2, 2, 8.8, 'empire'),
    B(-14, -12, 1.5, 1, 1.2, 'hotdog'),
    /* la Estatua de la Libertad en su islita */
    C(lib.x, lib.z, 6, 1, 'piedra'), P(-24.6, 0.5, -11.5, 1.4, 'madera'),
    B(lib.x, lib.z, 2.5, 2.5, 3.2, 'pedestal'), C(lib.x, lib.z, 1.3, 12, 'estatua'), ...espiralLib,
    P(0, 0.5, -27, 1.6, 'madera'), C(0, -36, 9, 0.6, 'pasto'),
    resorte(-10, 12),
  ],
  monedas:[...anillo(0, 0.9, 0, 5, 8), ...fila(-18, 0.9, 6, 18, 0.9, 6, 9), [8, 3.4, -8], [13, 5.6, -8], [13, 7.8, -13.5],
           ...espiralLib.filter((s, i)=>i !== 2).map(s=>[s.x, s.y1 + 1, s.z]), ...anillo(0, 1.8, -36, 5, 8), ...anillo(-10, 3.5, 12, 1.6, 6),
           ...fila(-16, 0.9, -2, -24, 0.9, -8, 4)],
  rojas:[[8, 10, -15], [espiralLib[2].x, espiralLib[2].y1 + 1.2, espiralLib[2].z], [-24.6, 1.7, -11.5], [-10, 5, 12], [-14, 2.4, -12]],
  estrellas:[
    {id:'antorcha', tipo:'libre', x:lib.x, y:13.3, z:lib.z, nombre:'La antorcha de la Estatua de la Libertad'},
    {id:'rojas',    tipo:'rojas', x:0, y:1.4, z:0, nombre:'Las monedas rojas de Nueva York'},
    {id:'jefe',     tipo:'jefe',  x:0, y:2.5, z:-36, nombre:'El Vaquero Gruñón'},
  ],
  enemigos:[
    {tipo:'grunon', piel:'vaquero', x:6, z:2}, {tipo:'grunon', piel:'vaquero', x:-6, z:-2}, {tipo:'grunon', piel:'vaquero', x:16, z:0},
    {tipo:'grunon', piel:'vaquero', x:-14, z:2}, {tipo:'grunon', piel:'vaquero', x:2, z:-12},
    {tipo:'abeja', piel:'pajaro', x:-6, z:10, y:3}, {tipo:'abeja', piel:'pajaro', x:12, z:14, y:3},
  ],
  jefe:{x:0, z:-36, r:7.5, piel:'vaquero', nombre:'Vaquero Gruñón', vida:3, vel:2.8,
        hola:'¡Yiijaa! ¡Soy el Vaquero Gruñón! ¡Esta estrella es mía, compañero!', cae:'¡Yiijaa... ay! ¡Me ganaste, compañero!'},
  cajas:[{x:-4, z:14, poder:'alas'}, {x:4, z:14, poder:'tenis'}, {x:-16, z:-3, poder:'fuego'}, {x:16, z:-3, poder:'hamburguesa'},
         {x:-6, z:-10, poder:'gigante'}, {x:12, z:12, poder:'iman'}],
  amigos:[],
  deco:{arboles:24, rocas:4},
});

/* ---------- 8) Italia ---------- */
const pisa = {x:-10, z:-10};
const espiralPisa = [];
for (let k = 0; k < 7; k++){ const a = k*55*Math.PI/180; espiralPisa.push(P(pisa.x + Math.sin(a)*4.6, 1.7*(k + 1), pisa.z + Math.cos(a)*4.6, 1.5, 'marmol')); }
MUNDOS.push({
  id:'italia', nombre:'Italia', corto:'ITALIA', emoji:'🍕', tema:'italia', color:'#3ad86a',
  inicio:{x:0, z:15, ang:Math.PI}, yMuerte:-8, agua:{y:-0.6, tipo:'agua'}, techo:30,
  tubo:{x:5, z:15},
  saludo:['italia1', 'italia2'],
  pisos:[{x:2, z:2, sx:7, sz:7, mat:'adoquin'}],
  solidos:[
    C(0, 0, 22, 0, 'pasto'),
    /* la Torre de Pisa (la escalera da vueltas por fuera) */
    C(pisa.x, pisa.z, 2.4, 13, 'pisa'), ...espiralPisa,
    /* pizzas gigantes para saltar */
    P(10, 2, 6, 2.2, 'pizza'), P(14, 3.8, 9.5, 2, 'pizza'),
    B(-16, 4, 1.2, 1.2, 1.4, 'gelato'),
    /* el Coliseo, donde espera el jefe */
    C(31, -8, 9, 0.6, 'adoquin'),
    /* Venecia: se llega en góndola */
    P(0, 0.3, 25, 2, 'gondola', {mov:{eje:'z', amp:1.6, vel:0.5}, gondola:true}), C(0, 36, 8, 0.6, 'adoquin'),
    resorte(-14, 10),
  ],
  monedas:[...anillo(2, 0.9, 2, 4, 8), ...espiralPisa.filter((s, i)=>i !== 3).map(s=>[s.x, s.y1 + 1, s.z]), [10, 3.2, 6],
           ...anillo(31, 1.5, -8, 5, 8), ...anillo(0, 1.5, 36, 4.5, 8), ...anillo(-14, 3.5, 10, 1.6, 6), ...fila(14, 0.9, -2, 20, 0.9, -6, 3)],
  rojas:[[espiralPisa[3].x, espiralPisa[3].y1 + 1.2, espiralPisa[3].z], [14, 5, 9.5], [-14, 5, 10], [0, 1.8, 40], [-16, 2.6, 4]],
  estrellas:[
    {id:'pisa',  tipo:'libre', x:pisa.x + 0.5, y:14.3, z:pisa.z, nombre:'Arriba de la Torre de Pisa'},
    {id:'rojas', tipo:'rojas', x:2, y:1.4, z:2, nombre:'Las monedas rojas de la piazza'},
    {id:'jefe',  tipo:'jefe',  x:31, y:2.5, z:-8, nombre:'El Chef Gruñón'},
  ],
  enemigos:[
    {tipo:'grunon', piel:'chef', x:6, z:-4}, {tipo:'grunon', piel:'chef', x:-4, z:8}, {tipo:'grunon', piel:'chef', x:-17, z:-2},
    {tipo:'grunon', piel:'chef', x:12, z:-12}, {tipo:'grunon', piel:'chef', x:0, z:-16},
    {tipo:'abeja', piel:'paloma', x:-4, z:-4, y:3}, {tipo:'abeja', piel:'paloma', x:8, z:12, y:3.5},
  ],
  jefe:{x:31, z:-8, r:7.5, piel:'chef', nombre:'Chef Gruñón', vida:3, vel:2.8,
        hola:'¡Mamma mia! ¡Soy el Chef Gruñón! ¡Esta estrella va en mi pizza!', cae:'¡Mamma mia! ¡Se me quemó la pizza!'},
  cajas:[{x:-5, z:12, poder:'hamburguesa'}, {x:6, z:13, poder:'tenis'}, {x:14, z:-2, poder:'fuego'}, {x:-6, z:-18, poder:'alas'},
         {x:-19, z:-6, poder:'iman'}, {x:4, z:38, poder:'gigante'}],
  amigos:[],
  deco:{cipreses:20, rocas:4},
});

/* ---------- 9) China ---------- */
MUNDOS.push({
  id:'china', nombre:'China', corto:'CHINA', emoji:'🐉', tema:'china', color:'#ff3a3a',
  inicio:{x:0, z:18, ang:Math.PI}, yMuerte:-8, agua:{y:-0.7, tipo:'agua'}, techo:32,
  tubo:{x:5, z:18},
  saludo:['china1', 'china2'],
  solidos:[
    C(0, 0, 24, 0, 'pasto'),
    /* la Gran Muralla: sube de torre en torre */
    R(9, 8, 1.5, 2.5, 'x', 0, 1.1, 'muralla'), B(14, 8, 3.5, 2.5, 1.1, 'muralla'), B(20, 8, 2.5, 2.5, 3.3, 'torreMuralla'),
    B(20, 1.5, 2.5, 4, 3.3, 'muralla'), B(20, -5, 2.5, 2.5, 5.5, 'torreMuralla'), B(14, -5, 3.5, 2.5, 5.5, 'muralla'), B(8, -5, 2.5, 2.5, 7.7, 'torreMuralla'),
    /* la pagoda de cuatro pisos */
    C(-12, -10, 6, 2.2, 'pagoda'), C(-12, -10, 4.2, 4.4, 'pagoda'), C(-12, -10, 2.7, 6.6, 'pagoda'), C(-12, -10, 1.6, 8.8, 'pagoda'),
    /* bambú para saltar */
    P(-6, 1.8, 14, 1.8, 'bambu'), P(-10.5, 3.4, 16, 1.6, 'bambu'),
    P(0, 0.5, -28.5, 1.6, 'madera'), C(0, -38, 9, 0.6, 'pasto'),
    resorte(4, -14),
  ],
  monedas:[...anillo(0, 0.9, 4, 4, 8), ...fila(11, 2.3, 8, 17, 2.3, 8, 4), ...fila(20, 4.5, 4, 20, 4.5, -1, 3), ...fila(17, 6.7, -5, 11, 6.7, -5, 4),
           ...anillo(-12, 3.4, -10, 5.1, 10), ...anillo(-12, 5.6, -10, 3.45, 8), ...anillo(-12, 7.8, -10, 2.15, 6),
           ...anillo(0, 1.8, -38, 5, 8), [-6, 3, 14], ...anillo(4, 3.5, -14, 1.6, 6)],
  rojas:[[-12, 10, -10], [20, 6.7, -5], [-10.5, 4.6, 16], [4, 5, -14], [20, 4.5, 8]],
  estrellas:[
    {id:'muralla', tipo:'libre', x:8, y:9, z:-5, nombre:'La torre más alta de la Gran Muralla'},
    {id:'rojas',   tipo:'rojas', x:0, y:1.4, z:4, nombre:'Las monedas rojas de la pagoda'},
    {id:'jefe',    tipo:'jefe',  x:0, y:2.5, z:-38, nombre:'El Dragón Gruñón'},
  ],
  enemigos:[
    {tipo:'grunon', piel:'dragoncito', x:4, z:10}, {tipo:'grunon', piel:'dragoncito', x:-6, z:2}, {tipo:'grunon', piel:'dragoncito', x:3, z:-8},
    {tipo:'grunon', piel:'dragoncito', x:-18, z:4}, {tipo:'grunon', piel:'dragoncito', x:12, z:14},
    {tipo:'abeja', piel:'pajaro', x:-4, z:-16, y:3}, {tipo:'abeja', x:-16, z:10, y:3},
  ],
  jefe:{x:0, z:-38, r:7.5, piel:'dragon', nombre:'Dragón Gruñón', vida:3, vel:2.8,
        hola:'¡Grooar! ¡Soy el Dragón Gruñón! ¡Esta estrella es mía!', cae:'¡Grooar! ¡Me apagaste el fuego!'},
  cajas:[{x:-4, z:20, poder:'tenis'}, {x:4, z:13, poder:'alas'}, {x:-18, z:-2, poder:'fuego'}, {x:14, z:14, poder:'hamburguesa'},
         {x:-2, z:-12, poder:'gigante'}, {x:2, z:8, poder:'iman'}],
  amigos:[],
  deco:{bambu:22, cerezos:10, rocas:6},
});

/* ---------- 10) Argentina: el mundo de Messi ---------- */
MUNDOS.push({
  id:'argentina', nombre:'Argentina, la tierra de Messi', corto:'ARGENTINA', emoji:'⚽', tema:'argentina', color:'#6ac8ff',
  inicio:{x:0, z:22, ang:Math.PI}, yMuerte:-8, agua:{y:-0.6, tipo:'agua'}, techo:32,
  tubo:{x:5, z:23},
  saludo:['argentina1', 'argentina2'],
  fraseRoja:'balon', fraseRojas:'balones',
  pisos:[{x:0, z:-2, sx:16, sz:10, mat:'cancha'}],
  solidos:[
    C(0, 0, 30, 0, 'pasto'),
    /* la cancha, con sus tribunas */
    B(0, -15, 16, 1.5, 1.1, 'tribuna'), B(0, -18, 16, 1.5, 2.2, 'tribuna'), B(0, -21, 16, 1.5, 3.3, 'tribuna'),
    /* la estatua de Messi levantando la Copa, y la Copa del Mundo gigante */
    B(-14, 16, 2, 2, 1.1, 'pedestal'), C(-14, 16, 0.9, 5.6, 'messi'),
    B(14, 16, 2, 2, 1.1, 'pedestal'), C(14, 16, 0.9, 4.4, 'copa'),
    C(-24, -8, 1.3, 22, 'obelisco'),
    /* pelotas gigantes para saltar */
    P(22, 2, -4, 1.8, 'balon'), P(25, 3.8, 0, 1.6, 'balon'),
    C(40, 0, 8, 0.6, 'pasto'),
    resorte(20, 14),
  ],
  pelotas:[{x:0, z:-2}],
  arcos:[{x:16, z:-2, dir:1, ancho:2.6, alto:2.2}, {x:-16, z:-2, dir:-1, ancho:2.6, alto:2.2}],
  monedas:[...anillo(0, 0.9, 12, 3, 8), ...fila(-12, 2.3, -15, 12, 2.3, -15, 7), ...fila(-8, 3.4, -18, 8, 3.4, -18, 5),
           ...anillo(40, 1.8, 0, 5, 8), [22, 3.2, -4], ...anillo(20, 3.5, 14, 1.6, 6), [-15.4, 2.3, 14.6], [15.4, 2.3, 14.6],
           ...fila(-22, 0.9, 4, -22, 0.9, 16, 4)],
  rojas:[[0, 4.5, -21], [-12, 3.4, -18], [12, 3.4, -18], [25, 5, 0], [-12.6, 2.3, 17.4], [20, 5, 14], [12.6, 2.3, 17.4], [-15, 4.5, -21]],
  estrellas:[
    {id:'gol',     tipo:'gol',   x:0, y:2.2, z:4, nombre:'¡Mete un golazo!'},
    {id:'balones', tipo:'rojas', x:0, y:1.4, z:12, nombre:'Los 8 Balones de Oro'},
    {id:'jefe',    tipo:'jefe',  x:40, y:2.5, z:0, nombre:'El Arquero Gruñón'},
  ],
  enemigos:[
    {tipo:'grunon', piel:'futbolista', x:-8, z:4}, {tipo:'grunon', piel:'futbolista', x:8, z:-8}, {tipo:'grunon', piel:'futbolista', x:-6, z:-8},
    {tipo:'grunon', piel:'futbolista', x:20, z:8}, {tipo:'grunon', piel:'futbolista', x:-20, z:6},
    {tipo:'abeja', piel:'pajaro', x:-10, z:12, y:3}, {tipo:'abeja', piel:'pajaro', x:6, z:14, y:3},
  ],
  jefe:{x:40, z:0, r:6.5, piel:'arquero', nombre:'Arquero Gruñón', vida:3, vel:2.8,
        hola:'¡Soy el Arquero Gruñón! ¡Nadie me hace un gol!', cae:'¡Golazo! ¡Me ganaste como Messi!'},
  cajas:[{x:-4, z:24, poder:'hamburguesa'}, {x:4, z:20, poder:'tenis'}, {x:-22, z:10, poder:'fuego'}, {x:22, z:-12, poder:'alas'},
         {x:-20, z:-20, poder:'iman'}, {x:18, z:6, poder:'gigante'}],
  amigos:[],
  deco:{arboles:16, rocas:4},
});

/* ---------- 11) El Reino Pichunite: isla grande de aventuras, 20 estrellas ----------
   Se llega planeando desde el autobús volador. Hay cofres con armas de juguete, pociones
   de escudo, monstruos, la llama piñata, el campo de tiro y el Rey Tortugón. */
const arbolG = {x:-18, z:-24}, relojT = {x:-40, z:-22};
const espiralArbol = [], espiralReloj = [];
for (let k = 0; k < 6; k++){ const a = k*60*Math.PI/180; espiralArbol.push(P(arbolG.x + Math.sin(a)*3.2, 1.8*(k + 1), arbolG.z + Math.cos(a)*3.2, 1.4, 'hojas')); }
for (let k = 0; k < 6; k++){ const a = k*60*Math.PI/180 + 0.5; espiralReloj.push(P(relojT.x + Math.sin(a)*4, 1.8*(k + 1), relojT.z + Math.cos(a)*4, 1.4, 'madera')); }
MUNDOS.push({
  id:'reino', nombre:'El Reino Pichunite', corto:'PICHUNITE', emoji:'🛡️', tema:'reino', color:'#b05aff',
  inicio:{x:0, z:50, ang:Math.PI}, yMuerte:-8, agua:{y:-0.6, tipo:'mar'}, techo:44,
  tubo:{x:5, z:50},
  saludo:['reino1', 'reino2'], autobus:true, minimapa:true,
  pisos:[{x:23, z:45, sx:7, sz:6, mat:'pantano'}, {x:30, z:24, sx:8, sz:8, mat:'tiro'}, {x:0, z:2, sx:6, sz:6, mat:'plaza'}],
  zonas:[{id:'bosque', nombre:'BOSQUE DE LOS MONSTRUOS', x:-30, z:24}, {id:'tiro', nombre:'CAMPO DE TIRO', x:30, z:24}, {id:'pantano', nombre:'PANTANO PEGAJOSO', x:23, z:45},
         {id:'pueblo', nombre:'PUEBLO PICHUNGUITO', x:-28, z:-2}, {id:'torres', nombre:'TORRES TORCIDAS', x:-5, z:-21}, {id:'montana', nombre:'MONTAÑA MIRADOR', x:32, z:-2},
         {id:'fortaleza', nombre:'FORTALEZA DEL TORTUGÓN', x:0, z:-63}, {id:'plaza', nombre:'PLAZA DE LA LLAMA', x:0, z:9}],
  solidos:[
    C(0, 0, 62, 0, 'pasto'),
    /* Pueblo Pichunguito: casas de colores, de techo en techo */
    B(-24, -4, 2.5, 2.5, 2.2, 'casaF1'), B(-29, -4, 2.5, 2.5, 4.4, 'casaF2'), B(-29, -9.5, 2.5, 2.5, 6.6, 'casaF3'), B(-20, -14, 2, 2, 2.2, 'casaF2'),
    /* las Torres Torcidas */
    B(0, -24, 2.5, 2.5, 2.2, 'torreT'), B(0, -29, 2.5, 2.5, 4.4, 'torreT'), B(0, -34, 2.5, 2.5, 6.6, 'torreT'), B(0, -39, 2.5, 2.5, 8.8, 'torreT'), B(0, -44, 2.5, 2.5, 11, 'torreT'),
    /* Montaña Mirador */
    C(32, -14, 10, 2.2, 'pasto'), C(32, -14, 7, 4.4, 'pasto'), C(32, -14, 4.5, 6.6, 'pasto'), C(32, -14, 2.5, 8.8, 'piedraF'),
    /* islas flotantes */
    P(20, 1.8, -34, 2, 'nube'), P(24, 3.6, -37, 2, 'nube'), P(28, 5.4, -40, 2, 'nube'), P(32, 7.2, -43, 2, 'nube'),
    /* el castillo de cajas */
    B(12, 8, 1.5, 1.5, 1.5, 'cajaMadera'), B(15, 8, 1.5, 1.5, 3, 'cajaMadera'), B(15, 11, 1.5, 1.5, 4.5, 'cajaMadera'), B(12, 11, 1.5, 1.5, 6, 'cajaMadera'),
    /* el árbol gigante y la torre del reloj (escaleras que dan vueltas) */
    C(arbolG.x, arbolG.z, 1.5, 12, 'tronco'), ...espiralArbol,
    C(relojT.x, relojT.z, 2, 11, 'reloj'), ...espiralReloj,
    /* la torre de vigía */
    B(-48, 8, 2, 2, 2.2, 'madera'), B(-48, 12, 2, 2, 4.4, 'madera'), B(-52, 12, 2, 2, 6.6, 'madera'),
    /* la pirámide */
    B(44, 6, 6, 6, 1.5, 'piedraF'), B(44, 6, 4, 4, 3, 'piedraF'), B(44, 6, 2, 2, 4.5, 'piedraF'),
    /* el barco pirata con su cofa */
    B(52, 38, 3, 6, 1.6, 'barco'), P(52, 3.8, 38, 1.2, 'madera'),
    /* el autobús volador que se estrelló */
    B(-10, 18, 4, 1.6, 2.2, 'bus'),
    /* la isla secreta */
    P(-64.5, 0.5, 0, 1.4, 'madera'), P(-68.5, 0.9, 0, 1.4, 'madera'), C(-76, 0, 5, 1.2, 'arena'),
    /* la Fortaleza del Tortugón */
    P(0, 0.5, -66.5, 1.6, 'piedraF'), C(0, -76, 10, 0.6, 'piedraF'),
    resorte(-12, 34),
  ],
  monedas:[...anillo(0, 0.9, 40, 3, 8), ...fila(0, 0.9, 46, 0, 0.9, 20, 8), ...anillo(0, 0.9, 2, 5, 10),
           [-24, 3.4, -4], [-29, 7.8, -9.5], [-20, 3.4, -14], [0, 3.4, -24], [0, 5.6, -29], [0, 7.8, -34],
           ...anillo(32, 3.4, -14, 8.5, 12), ...anillo(32, 5.6, -14, 5.7, 8), ...anillo(32, 7.8, -14, 3.5, 6),
           [20, 3, -34], [28, 6.6, -40], [12, 2.7, 8], [15, 5.7, 11],
           ...espiralArbol.filter((s, i)=>i % 2 === 0).map(s=>[s.x, s.y1 + 1, s.z]), ...espiralReloj.filter((s, i)=>i % 2 === 1).map(s=>[s.x, s.y1 + 1, s.z]),
           [-48, 3.4, 8], [-52, 7.8, 12], [44, 2.7, 1], [44, 4.2, 9], [52, 2.8, 34],
           ...fila(-58, 0.9, 0, -50, 0.9, 0, 4), [-76, 2.4, 3], ...anillo(0, 1.8, -76, 6, 10), ...anillo(-12, 3.5, 34, 1.6, 6),
           ...fila(-34, 0.9, 18, -26, 0.9, 30, 5), ...fila(24, 0.9, 30, 36, 0.9, 30, 5), ...fila(18, 0.9, 40, 28, 0.9, 50, 4),
           ...fila(-6, 0.9, -46, 6, 0.9, -54, 5), [-10, 3.4, 16], [-10, 3.4, 20]],
  rojas:[[0, 10, -39], [-29, 5.6, -4], [15, 4.2, 8], [24, 4.8, -37], [38, 5.6, -14], [47, 4.2, 6], [52, 2.8, 42], [-48, 5.6, 12]],
  estrellas:[
    {id:'pueblo',    tipo:'libre', x:-29, y:7.9, z:-9.5, nombre:'El techo más alto del pueblo'},
    {id:'torres',    tipo:'libre', x:0, y:12.3, z:-44, nombre:'Arriba de las Torres Torcidas'},
    {id:'montana',   tipo:'libre', x:32, y:10.1, z:-14, nombre:'La cima de la Montaña Mirador'},
    {id:'islas',     tipo:'libre', x:32, y:8.5, z:-43, nombre:'Las islas flotantes'},
    {id:'cajas',     tipo:'libre', x:12, y:7.3, z:11, nombre:'El castillo de cajas'},
    {id:'arbol',     tipo:'libre', x:arbolG.x, y:13.3, z:arbolG.z, nombre:'Arriba del árbol gigante'},
    {id:'reloj',     tipo:'libre', x:relojT.x, y:12.3, z:relojT.z, nombre:'La torre del reloj'},
    {id:'vigia',     tipo:'libre', x:-52, y:7.9, z:12, nombre:'La torre de vigía'},
    {id:'piramide',  tipo:'libre', x:44, y:5.8, z:6, nombre:'La punta de la pirámide'},
    {id:'barco',     tipo:'libre', x:52, y:5.1, z:38, nombre:'La cofa del barco pirata'},
    {id:'bus',       tipo:'libre', x:-10, y:3.5, z:18, nombre:'El techo del autobús volador'},
    {id:'trampolin', tipo:'libre', x:-12, y:5.4, z:34, nombre:'Arriba del trampolín'},
    {id:'secreta',   tipo:'libre', x:-76, y:2.5, z:0, nombre:'La isla secreta'},
    {id:'escondida', tipo:'libre', x:0, y:1.3, z:-58, nombre:'Escondida detrás de las torres'},
    {id:'bosque',    tipo:'zona', zona:'bosque', x:-30, y:1.4, z:24, nombre:'Vence a los monstruos del bosque'},
    {id:'pantano',   tipo:'zona', zona:'pantano', x:23, y:1.4, z:45, nombre:'Vence a los monstruos del pantano'},
    {id:'tiro',      tipo:'zona', zona:'tiro', x:30, y:1.4, z:24, nombre:'Dale a todas las dianas'},
    {id:'llama',     tipo:'zona', zona:'llama', x:0, y:1.4, z:6, nombre:'Rompe la llama piñata'},
    {id:'rojas',     tipo:'rojas', x:0, y:1.4, z:40, nombre:'Las 8 monedas rojas del reino'},
    {id:'jefe',      tipo:'jefe', x:0, y:2.5, z:-76, nombre:'El Rey Tortugón'},
  ],
  frasesZona:{bosque:'zonaLista', pantano:'zonaLista', tiro:'dianasListas', llama:'pinata'},
  enemigos:[
    /* el bosque de los monstruos */
    {tipo:'grunon', piel:'monstruo', zona:'bosque', x:-34, z:20}, {tipo:'grunon', piel:'monstruo', zona:'bosque', x:-26, z:20},
    {tipo:'grunon', piel:'monstruo', zona:'bosque', x:-30, z:28}, {tipo:'grunon', piel:'monstruo', zona:'bosque', x:-36, z:28}, {tipo:'grunon', piel:'monstruo', zona:'bosque', x:-24, z:27},
    /* el pantano pegajoso */
    {tipo:'grunon', piel:'slime', zona:'pantano', x:20, z:42}, {tipo:'grunon', piel:'slime', zona:'pantano', x:26, z:44}, {tipo:'grunon', piel:'slime', zona:'pantano', x:22, z:48},
    /* el campo de tiro: dianas */
    {tipo:'diana', zona:'tiro', x:26, z:19, dy:0.6}, {tipo:'diana', zona:'tiro', x:30, z:17, dy:0.6}, {tipo:'diana', zona:'tiro', x:34, z:19, dy:0.6},
    {tipo:'diana', zona:'tiro', x:26, z:29, dy:0.6}, {tipo:'diana', zona:'tiro', x:30, z:31, dy:0.6}, {tipo:'diana', zona:'tiro', x:34, z:29, dy:0.6},
    /* la llama piñata */
    {tipo:'llama', piel:'llama', zona:'llama', x:0, z:0},
    /* monstruos sueltos por todo el reino */
    {tipo:'grunon', piel:'monstruo', x:10, z:-10}, {tipo:'grunon', piel:'monstruo', x:-10, z:-10}, {tipo:'grunon', piel:'monstruo', x:20, z:2},
    {tipo:'grunon', piel:'slime', x:40, z:30}, {tipo:'grunon', piel:'monstruo', x:-40, z:-34}, {tipo:'grunon', piel:'slime', x:10, z:-46},
    {tipo:'grunon', piel:'monstruo', x:-44, z:30}, {tipo:'grunon', piel:'slime', x:-8, z:28}, {tipo:'grunon', piel:'monstruo', x:46, z:-30},
    {tipo:'abeja', piel:'ojo', x:0, z:-20, y:3.2}, {tipo:'abeja', piel:'ojo', x:20, z:20, y:3.2}, {tipo:'abeja', piel:'ojo', x:-20, z:0, y:3.2},
    {tipo:'abeja', piel:'ojo', x:30, z:-32, y:4}, {tipo:'abeja', piel:'ojo', x:-32, z:-28, y:4},
  ],
  jefe:{x:0, z:-76, r:8.5, piel:'tortugon', nombre:'Rey Tortugón', vida:3, vel:2.9, fuego:true,
        hola:'¡Graaar! ¡Soy el Rey Tortugón! ¡Este reino es mío!', cae:'¡Nooo! ¡Mi caparazón! ¡Me ganó un pichunguito!'},
  cajas:[{x:4, z:44, poder:'agua'}, {x:-4, z:44, poder:'burbujas'}, {x:8, z:30, poder:'dardos'}, {x:-30, z:14, poder:'confeti'},
         {x:28, z:13, poder:'globos'}, {x:0, z:12, poder:'plomero'}, {x:-20, z:-20, poder:'alas'}, {x:20, z:-20, poder:'cohete'},
         {x:40, z:-36, poder:'robot'}, {x:-40, z:0, poder:'laser'}, {x:-6, z:-50, poder:'plomero'}, {x:14, z:-56, poder:'dardos'}],
  pociones:[[2, 0.9, 36], [-16, 0.9, -8], [16, 0.9, -6], [-36, 0.9, 16], [36, 0.9, 14], [0, 0.9, -50], [44, 0.9, -6], [-50, 0.9, -12], [10, 0.9, 52]],
  amigos:[],
  deco:{arboles:40, rocas:10},
});

/* el total de estrellas sale de los mundos */
CFG.ESTRELLAS_FIN = MUNDOS.reduce((n, m)=>n + m.estrellas.length, 0);

/* ============================================================
   UTILIDADES
   ============================================================ */
function rng(seed){
  let a = seed >>> 0;
  return function(){
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const clamp = (v, a, b)=> v < a ? a : v > b ? b : v;
const lerp = (a, b, t)=> a + (b - a)*t;
function angDif(a, b){ let d = (b - a) % (Math.PI*2); if (d > Math.PI) d -= Math.PI*2; if (d < -Math.PI) d += Math.PI*2; return d; }

/* ---------- las piezas del suelo ---------- */
function topDe(s, x, z){
  if (s.t !== 'rampa') return s.y1;
  if (s.eje === 'x'){ const u = clamp((x - (s.x - s.sx))/(2*s.sx), 0, 1); return s.ya + (s.yb - s.ya)*u; }
  const u = clamp((z - (s.z - s.sz))/(2*s.sz), 0, 1); return s.ya + (s.yb - s.ya)*u;
}
function dentro(s, x, z, m){
  if (s.t === 'cil'){ const dx = x - s.x, dz = z - s.z, rr = s.r + m; return dx*dx + dz*dz <= rr*rr; }
  return Math.abs(x - s.x) <= s.sx + m && Math.abs(z - s.z) <= s.sz + m;
}
/* el suelo más alto debajo de (x,z) que no esté por encima de yPie+paso */
function suelo(M, x, z, yPie, m){
  let mejor = -Infinity, cual = null;
  for (const s of M.solidos){
    if (!dentro(s, x, z, m)) continue;
    const t = topDe(s, x, z);
    if (t <= yPie + CFG.PASO && t > mejor){ mejor = t; cual = s; }
  }
  return {y: mejor, s: cual};
}
/* empuja hacia afuera de las paredes (lo que es más alto que un pasito) */
function empujar(M, o, R, alto){
  let choco = false;
  for (const s of M.solidos){
    if (s.y0 >= o.y + alto) continue;
    if (s.t === 'cil'){
      if (s.y1 <= o.y + CFG.PASO) continue;
      const dx = o.x - s.x, dz = o.z - s.z, d = Math.hypot(dx, dz), lim = s.r + R;
      if (d < lim){
        choco = true;
        if (d < 1e-4){ o.x = s.x + lim; continue; }
        o.x = s.x + dx/d*lim; o.z = s.z + dz/d*lim;
      }
    } else {
      const cx = clamp(o.x, s.x - s.sx, s.x + s.sx), cz = clamp(o.z, s.z - s.sz, s.z + s.sz);
      if (topDe(s, cx, cz) <= o.y + CFG.PASO) continue;
      const dx = o.x - cx, dz = o.z - cz, d = Math.hypot(dx, dz);
      if (d >= R) continue;
      choco = true;
      if (d > 1e-4){ o.x = cx + dx/d*R; o.z = cz + dz/d*R; }
      else {
        const px = s.sx - Math.abs(o.x - s.x), pz = s.sz - Math.abs(o.z - s.z);
        if (px < pz) o.x = s.x + (o.x >= s.x ? 1 : -1)*(s.sx + R);
        else o.z = s.z + (o.z >= s.z ? 1 : -1)*(s.sz + R);
      }
    }
  }
  return choco;
}

/* ============================================================
   EL JUEGO
   ============================================================ */
function progresoNuevo(){ return {estrellas:{}, monedas:0, intro:false, ganado:false, tejadoDicho:false, vuelta:0, vueltaLista:false, superN:0}; }
function progresoLimpio(p){
  const n = progresoNuevo();
  if (!p || typeof p !== 'object') return n;
  if (p.estrellas && typeof p.estrellas === 'object') for (const k in p.estrellas) if (p.estrellas[k] === true) n.estrellas[k] = true;
  n.monedas = Math.max(0, Math.floor(+p.monedas || 0));
  n.intro = !!p.intro; n.ganado = !!p.ganado; n.tejadoDicho = !!p.tejadoDicho; n.paisesDicho = !!p.paisesDicho;
  n.vuelta = Math.max(0, Math.min(99, Math.floor(+p.vuelta || 0))); n.vueltaLista = !!p.vueltaLista;
  n.superN = Math.max(0, Math.floor(+p.superN || 0)) % SUPER.length;
  return n;
}
function cuentaEstrellas(prog){ let n = 0; for (const k in prog.estrellas) if (prog.estrellas[k]) n++; return n; }
function estrellasDe(prog, idMundo){ const def = MUNDOS.find(m=>m.id === idMundo); let n = 0; for (const e of def.estrellas) if (prog.estrellas[idMundo+':'+e.id]) n++; return n; }

function crearJuego(op){
  op = op || {};
  const J = {
    R: rng(op.semilla || 7), t: 0,
    prog: progresoLimpio(op.prog),
    fase: 'titulo',      // titulo · juego · final
    mundo: 0, M: null, cargas: 0,
    p: null, tio: null, perros: [], clones: [], rastro: [], escudo: 0, fuegosMalos: [],
    bolas: [], eventos: [], dialogos: [], dichos: [],
    trans: null, guia: null, tGuia: 0,
    monedasMundo: 0, rojasMundo: 0, cdBloqueo: 0, cdRescateDicho: 0, tTodas: -1, tFinal: 0,
    sigId: 1, pj: 'fernando',
  };
  cargarMundo(J, 0, null);
  return J;
}

function empezar(J){
  if (J.fase !== 'titulo') return;
  J.fase = 'juego';
  if (!J.prog.intro){ decir(J, 'intro1'); decir(J, 'intro2'); decir(J, 'intro3'); decir(J, 'intro4'); J.prog.intro = true; }
  else decir(J, 'entra');
}

/* ---------------- eventos y diálogos ---------------- */
function ev(J, tipo, x, y, z, extra){ J.eventos.push(Object.assign({tipo, x, y, z}, extra || {})); if (J.eventos.length > 120) J.eventos.shift(); }
function decir(J, clave, texto, quien, nombre){
  const f = FRASES[clave];
  if (!f && !texto) return;
  if (J.dialogos.some(d=>d.clave === clave)) return;
  if (J.dialogos.length >= 5) return;
  let t = texto;
  if (!t){ const op = f[1]; t = Array.isArray(op) ? op[Math.floor(J.R()*op.length)] : op; }
  const q = quien || f[0];
  if (!texto && q === 'fer' && J.pj && FRASES_PJ[J.pj] && FRASES_PJ[J.pj][clave]) t = FRASES_PJ[J.pj][clave];
  J.dialogos.push({clave, quien:q, texto:t, nombre: nombre || null, t:0, dur: Math.max(1.8, 1.0 + t.length*0.062)});
  J.dichos.push(clave); if (J.dichos.length > 300) J.dichos.shift();
}
function dialogos(J, dt){
  if (!J.dialogos.length) return;
  const d = J.dialogos[0];
  if (d.t === 0) ev(J, 'habla', 0, 0, 0, {quien:d.quien, texto:d.texto});
  d.t += dt;
  if (d.t >= d.dur) J.dialogos.shift();
}

/* ---------------- cargar un mundo ---------------- */
function cargarMundo(J, n, desde){
  const def = MUNDOS[n];
  /* ¡todas las estrellas!: al volver al castillo empieza otra vuelta con las estrellas escondidas en otros lugares */
  let nuevaVuelta = false;
  if (n === 0 && J.prog.vueltaLista){ J.prog.vueltaLista = false; J.prog.vuelta++; J.prog.estrellas = {}; nuevaVuelta = true; }
  const M = {
    def, n, t:0,
    solidos: def.solidos.map(s=>Object.assign({}, s, {bx:s.x, bz:s.z, by0:s.y0, by1:s.y1, ya0:s.ya, yb0:s.yb, dx:0, dy:0, dz:0})),
    monedas: def.monedas.map(m=>({x:m[0], y:m[1], z:m[2], tipo:'oro', vivo:true})),
    rojas: def.rojas.map(m=>({x:m[0], y:m[1], z:m[2], tipo:'roja', vivo:true})),
    estrellas: def.estrellas.map(e=>Object.assign({}, e, {visible: e.tipo === 'libre', tomada:false, ya: !!J.prog.estrellas[def.id+':'+e.id]})),
    enemigos: [], cajas: [], amigos: (def.amigos || []).map(a=>Object.assign({}, a, {dicho:false, y:0})),
    portales: (def.portales || []).map(p=>Object.assign({}, p)),
    jefe: null,
  };
  if (def.tubo){
    const g = suelo(M, def.tubo.x, def.tubo.z, 100, 0).y;
    M.tuboY = g + 1.2;
    M.solidos.push({t:'cil', x:def.tubo.x, z:def.tubo.z, r:1.0, y0:g - 1, y1:g + 1.2, mat:'tubo', tubo:true, bx:def.tubo.x, bz:def.tubo.z, dx:0, dy:0, dz:0});
  }
  /* hasta dónde se puede nadar: la caja de las islas y un poquito más */
  M.caja = {x0: Infinity, x1: -Infinity, z0: Infinity, z1: -Infinity};
  for (const s of M.solidos){
    const ex = s.t === 'cil' ? s.r : s.sx, ez = s.t === 'cil' ? s.r : s.sz;
    if (!(ex < 150 && ez < 150)) continue;
    M.caja.x0 = Math.min(M.caja.x0, s.x - ex); M.caja.x1 = Math.max(M.caja.x1, s.x + ex);
    M.caja.z0 = Math.min(M.caja.z0, s.z - ez); M.caja.z1 = Math.max(M.caja.z1, s.z + ez);
  }
  if (J.prog.vuelta > 0) mezclarEstrellas(M, n, J.prog.vuelta);
  J.M = M; J.mundo = n; J.cargas++;
  J.clones = []; J.rastro = []; J.fuegosMalos = [];
  M.pociones = (def.pociones || []).map(q=>({x:q[0], y:q[1], z:q[2], vivo:true}));
  J.bolas = []; J.monedasMundo = 0; J.rojasMundo = 0; J.tTodas = -1; J.guia = null;
  for (const e of def.enemigos) M.enemigos.push(nuevoEnemigo(J, e.tipo, e.x, e.z, e));
  if (def.jefe){
    const jf = def.jefe;
    M.jefe = nuevoEnemigo(J, 'jefe', jf.x, jf.z, {piel:jf.piel});
    Object.assign(M.jefe, {vida:jf.vida, radio:jf.rey ? 2.3 : 1.9, alto:jf.rey ? 3.6 : 2.8, cx:jf.x, cz:jf.z, rArena:jf.r, vel:jf.vel, despierto:false, def:jf});
    M.enemigos.push(M.jefe);
  }
  for (const c of def.cajas){
    const g = suelo(M, c.x, c.z, 100, 0);
    M.cajas.push({x:c.x, y:g.y + 1.3, z:c.z, poder:c.poder, abierta:0, temporal:false});
  }
  for (const a of M.amigos) a.y = suelo(M, a.x, a.z, 100, 0).y;
  M.pelotas = (def.pelotas || []).map(b=>{ const o = {x0:b.x, z0:b.z, r:0.45, giro:0}; reponerPelota(M, o); return o; });
  for (const p of M.portales){
    p.y = suelo(M, p.x, p.z, 100, 0).y;
    p.ang = Math.atan2(-p.x, 8 - p.z);           // miran hacia el centro del jardín
  }
  /* Fernando */
  let x = def.inicio.x, z = def.inicio.z, ang = def.inicio.ang;
  if (desde != null && def.portales){
    const po = M.portales.find(p=>p.mundo === desde);
    if (po){ x = po.x + Math.sin(po.ang)*3.2; z = po.z + Math.cos(po.ang)*3.2; ang = po.ang; }
  }
  const y0 = suelo(M, x, z, 100, 0).y;
  J.p = {x, y:y0, z, vx:0, vy:0, vz:0, ang, enSuelo:true, sobre:null, coyote:0, buffer:0, saltos:0, cortado:true,
         invul:0, poder:null, tPoder:0, escala:1, giro:0, cdGiro:0, cdFuego:0, baile:0, seguro:{x, y:y0, z}, tSeguro:0,
         antSalto:false, antPoder:false, antAyuda:false, anim:0, vuela:false, nada:false, golpeT:0, tAire:0};
  J.camA = ang;
  J.tio = {x: x + 2, y: y0 + 2.4, z: z + 2, vx: 0, vy: 0, vz: 0, ang, estado:'sigue', lista:[], obj:null, cd:0, puno:0, t:0};
  J.perros = [{quien:'penny', x: x - 1.5, y:y0, z: z + 1.5, ang, anim:0}, {quien:'sheldon', x: x + 1.5, y:y0, z: z + 1.8, ang, anim:0}];
  ev(J, 'mundo', x, y0, z, {n});
  if (nuevaVuelta){ J.dialogos = []; decir(J, 'vuelta'); decir(J, 'vueltaFer'); ev(J, 'vuelta', x, y0, z, {vuelta: J.prog.vuelta}); }
}

/* en cada vuelta nueva la estrella del monumento y las monedas rojas se cambian de lugar entre ellas:
   la estrella queda donde había una moneda roja y las rojas se reparten en los otros lugares
   (todos ya se alcanzan saltando) */
function mezclarEstrellas(M, n, v){
  const libres = M.estrellas.filter(s=>s.tipo === 'libre');
  if (!libres.length || !M.rojas.length) return;
  const R = rng(1000 + n*131 + v*7919);
  const lugares = libres.map(s=>({x:s.x, y:s.y - 0.1, z:s.z, era:s})).concat(M.rojas.map(r=>({x:r.x, y:r.y, z:r.z, era:r})));
  const orden = lugares.slice();
  for (let i = orden.length - 1; i > 0; i--){ const k = Math.floor(R()*(i + 1)); [orden[i], orden[k]] = [orden[k], orden[i]]; }
  /* la estrella siempre se va a otro lugar */
  for (let i = 0; i < libres.length; i++) if (orden[i].era === libres[i]){ const k = libres.length + Math.floor(R()*M.rojas.length); [orden[i], orden[k]] = [orden[k], orden[i]]; }
  libres.forEach((s, i)=>{ s.x = orden[i].x; s.y = orden[i].y + 0.1; s.z = orden[i].z; });
  M.rojas.forEach((r, i)=>{ const l = orden[libres.length + i]; r.x = l.x; r.y = l.y; r.z = l.z; });
}

function nuevoEnemigo(J, tipo, x, z, o){
  const M = J.M;
  const g = suelo(M, x, z, 100, 0);
  const e = {id: J.sigId++, tipo, piel: (o && o.piel) || (tipo === 'abeja' ? 'abeja' : 'grunon'),
             x, z, y: tipo === 'abeja' ? ((o && o.y) || 2.5) : g.y, hx:x, hz:z, hy: tipo === 'abeja' ? ((o && o.y) || 2.5) : g.y,
             ang: J.R()*6.28, vivo:true, muere:0, t: J.R()*10, radio:0.75, alto:1.1, vel:1.3, vida:1, invul:0,
             wx:x, wz:z, tw:0, huye:0, salto:0, vy:0, zona: (o && o.zona) || ''};
  if (tipo === 'diana'){ e.piel = 'diana'; e.y = e.hy = g.y + ((o && o.dy) || 0); e.radio = 0.7; e.alto = 1.4; }
  if (tipo === 'llama'){ e.radio = 0.8; e.alto = 1.6; e.vel = 1.4; }
  return e;
}

/* ============================================================
   EL PASO DEL JUEGO
   inp = {x, y (palanca, -1..1), camA, salto, poder, ayuda (apretados)}
   ============================================================ */
function paso(J, dt, inp){
  inp = inp || {};
  J.t += dt;
  dialogos(J, dt);
  if (J.trans){
    J.trans.t += dt;
    if (!J.trans.cargado && J.trans.t >= 0.6){ J.trans.cargado = true; cargarMundo(J, J.trans.a, J.trans.desde); if (J.trans.alEntrar) J.trans.alEntrar(); }
    if (J.trans.t >= 1.2) J.trans = null;
  }
  const M = J.M;
  M.t += dt;
  moverSolidos(J, dt);
  if (J.fase === 'titulo'){ tioSigue(J, dt); return; }
  if (J.fase === 'final'){
    J.tFinal += dt;
    J.p.baile = 1;
    tioSigue(J, dt); perros(J, dt);
    if (J.tFinal > 14 && !J.trans){ J.fase = 'juego'; irA(J, 0, 5); }
    return;
  }
  const bloqueado = !!J.trans || J.p.baile > 0;
  jugador(J, dt, bloqueado ? {camA: inp.camA} : inp);
  clones(J, dt);
  amigosCerca(J);
  enemigos(J, dt);
  bolas(J, dt);
  fuegosMalos(J, dt);
  pelotas(J, dt);
  cosas(J, dt);
  tio(J, dt, bloqueado ? {} : inp);
  perros(J, dt);
  J.p.antSalto = !!inp.salto; J.p.antPoder = !!inp.poder; J.p.antAyuda = !!inp.ayuda;
  J.tGuia -= dt;
  if (J.tGuia <= 0){ J.tGuia = 0.25; J.guia = buscarGuia(J); }
  if (J.tTodas >= 0){
    J.tTodas += dt;
    if (J.tTodas > 4.5 && !J.trans){ J.tTodas = -1; irA(J, 0, J.mundo); }
  }
  J.cdBloqueo = Math.max(0, J.cdBloqueo - dt);
  J.cdRescateDicho = Math.max(0, J.cdRescateDicho - dt);
}

function irA(J, n, desde, alEntrar){
  if (J.trans) return;
  J.trans = {t:0, a:n, desde, cargado:false, alEntrar};
  ev(J, 'portal', J.p.x, J.p.y, J.p.z);
}

function moverSolidos(J, dt){
  const M = J.M;
  for (const s of M.solidos){
    if (!s.mov){ s.dx = s.dy = s.dz = 0; continue; }
    const m = s.mov, off = Math.sin(M.t*m.vel + (m.fase || 0))*m.amp;
    const ox = s.x, oz = s.z, oy = s.y1;
    if (m.eje === 'x') s.x = s.bx + off;
    else if (m.eje === 'z') s.z = s.bz + off;
    else { s.y0 = s.by0 + off; s.y1 = s.by1 + off; }
    s.dx = s.x - ox; s.dz = s.z - oz; s.dy = s.y1 - oy;
  }
}

/* ---------------- Fernando ---------------- */
function jugador(J, dt, inp){
  const p = J.p, M = J.M, def = M.def;
  p.anim += dt;
  p.invul = Math.max(0, p.invul - dt);
  p.cdGiro = Math.max(0, p.cdGiro - dt);
  p.cdFuego = Math.max(0, p.cdFuego - dt);
  p.giro = Math.max(0, p.giro - dt);
  p.baile = Math.max(0, p.baile - dt);
  p.golpeT = Math.max(0, p.golpeT - dt);
  if (p.poder){
    p.tPoder -= dt;
    if (p.tPoder <= 0){ ev(J, 'finPoder', p.x, p.y, p.z, {poder:p.poder}); p.poder = null; }
  }
  const objEsc = p.poder === 'gigante' ? 2.4 : p.poder === 'robot' ? 1.35 : p.poder === 'plomero' ? 1.12 : 1;
  p.escala += (objEsc - p.escala)*Math.min(1, dt*6);

  /* lo lleva la plataforma que se mueve */
  if (p.enSuelo && p.sobre && (p.sobre.dx || p.sobre.dz || p.sobre.dy)){
    p.x += p.sobre.dx; p.z += p.sobre.dz; p.y += p.sobre.dy;
  }

  /* hacia dónde quiere ir (relativo a la cámara) */
  const camA = inp.camA != null ? inp.camA : J.camA;
  J.camA = camA;
  const ix = inp.x || 0, iy = inp.y || 0;
  let mag = Math.min(1, Math.hypot(ix, iy));
  let dx = 0, dz = 0;
  if (mag > 0.12){
    const fx = Math.sin(camA), fz = Math.cos(camA), rx = -Math.cos(camA), rz = Math.sin(camA);
    dx = fx*iy + rx*ix; dz = fz*iy + rz*ix;
    const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
  } else mag = 0;
  /* el agua (no la lava): se nada en la superficie */
  const agua = def.agua && def.agua.tipo !== 'lava' ? def.agua : null;
  const flota = agua ? agua.y - 0.95*p.escala : -1e9;
  const superVuelo = p.poder === 'cohete' && p.vuela;
  if (p.planeo && (p.enSuelo || p.nada)){ p.planeo = false; ev(J, 'aterrizaPlaneo', p.x, p.y, p.z); }
  let vmax = CFG.VEL*(p.poder === 'hamburguesa' ? 1.8 : p.poder === 'gigante' ? 1.25 : p.poder === 'robot' ? 1.15 : p.poder === 'fuerza' ? 1.1 : 1)*(p.nada ? 0.7 : 1)*(superVuelo ? 2.6 : 1);
  if (p.golpeT > 0) mag *= 0.3;
  const tvx = dx*vmax*mag, tvz = dz*vmax*mag;
  const hielo = p.enSuelo && p.sobre && p.sobre.hielo;
  if (p.planeo) vmax *= 1.4;
  const acel = (p.enSuelo ? (hielo ? 9 : 48) : p.nada ? 18 : superVuelo || p.planeo ? 36 : 22)*dt;
  if (p.golpeT <= 0){
    p.vx += clamp(tvx - p.vx, -acel, acel);
    p.vz += clamp(tvz - p.vz, -acel, acel);
  }
  if (mag > 0){
    const a = Math.atan2(dx, dz);
    p.ang += angDif(p.ang, a)*Math.min(1, dt*14);
  }

  /* saltar */
  const saltoNuevo = inp.salto && !p.antSalto;
  if (saltoNuevo) p.buffer = CFG.BUFFER; else p.buffer = Math.max(0, p.buffer - dt);
  p.coyote = p.enSuelo || p.nada ? CFG.COYOTE : Math.max(0, p.coyote - dt);
  const mSalto = p.poder === 'tenis' ? 1.4 : p.poder === 'gigante' || p.poder === 'fuerza' ? 1.15 : p.poder === 'robot' ? 1.2 : 1;
  if (p.buffer > 0 && p.coyote > 0){
    /* el Súper Plomero: saltando justo al caer, el segundo salto es más alto y el tercero altísimo */
    let mTriple = 1;
    if (p.poder === 'plomero'){
      p.cadena = (J.t - (p.tAterrizo || -9) < 0.35 && p.enSuelo) ? Math.min(3, (p.cadena || 0) + 1) : 1;
      mTriple = [1, 1.22, 1.6][p.cadena - 1];
      if (p.cadena === 3){ ev(J, 'salto3', p.x, p.y, p.z); p.cadena = 0; }
    }
    p.vy = CFG.SALTO*mSalto*mTriple; p.enSuelo = false; p.coyote = 0; p.buffer = 0; p.saltos = 1; p.cortado = false; p.sobre = null; p.nada = false;
    ev(J, 'salto', p.x, p.y, p.z);
    if (p.poder === 'clon') nuevoClon(J);
  } else if (saltoNuevo && !p.enSuelo && p.saltos < 2 && p.poder !== 'alas' && p.poder !== 'cohete'){
    p.vy = CFG.SALTO2*mSalto; p.saltos = 2; p.cortado = false; p.buffer = 0;
    ev(J, 'salto2', p.x, p.y, p.z);
    if (p.poder === 'clon') nuevoClon(J);
  }
  if (!inp.salto && !p.cortado && p.vy > 5){ p.vy = 5; p.cortado = true; }
  if (!inp.salto) p.cortado = true;

  /* gravedad (y el vuelo de la gorra alada) */
  let g = CFG.GRAV;
  /* con la gorra alada todo el rato en el aire es "volar" (antes cambiaba de pose en cada cuadro
     al llegar al techo y Fernando parpadeaba); cerca del techo frena suave y se queda flotando */
  p.vuela = (p.poder === 'alas' || p.poder === 'cohete') && !p.enSuelo && !p.nada;
  if (p.vuela){
    const cohete = p.poder === 'cohete';
    if (inp.salto){
      const falta = def.techo - p.y;
      const meta = falta > 2 ? (cohete ? 10 : 7) : Math.max(0, falta*3);
      p.vy += (meta - p.vy)*Math.min(1, dt*6);
      g = 0;
    } else if (p.vy < (cohete ? -1.5 : -3.5)){ p.vy = cohete ? -1.5 : -3.5; g = 0; }
  }
  /* nadar: entra con un chapuzón, flota meciéndose y en la orilla sale solito */
  if (agua && !p.enSuelo && !p.nada && p.vy <= 0 && p.y <= flota + 0.3){
    p.nada = true; p.saltos = 0; p.giro = 0;
    ev(J, 'chapuzon', p.x, agua.y, p.z, {fuerte: p.vy < -12});
    p.vy = Math.max(p.vy, -6);
    if (!J.dijoNadar){ J.dijoNadar = true; decir(J, 'nadar'); }
  }
  if (p.nada){
    if (p.enSuelo || p.y > flota + 0.6) p.nada = false;
    else {
      g = 0;
      p.vy += ((flota + Math.sin(p.anim*2.2)*0.06 - p.y)*14 - p.vy*5)*dt;
      if (mag > 0){
        const ox = p.x + dx*0.75, oz = p.z + dz*0.75, o = suelo(M, ox, oz, p.y + 3.4, 0.1);
        if (o.s && o.y > p.y + CFG.PASO){ p.vy = Math.sqrt(2*CFG.GRAV*(o.y - p.y + 0.6)); p.nada = false; p.saltos = 1; p.cortado = true; ev(J, 'chapuzon', p.x, agua.y, p.z, {}); }
      }
      const c = M.caja, mg = 10;
      if (p.x < c.x0 - mg){ p.x = c.x0 - mg; p.vx = Math.max(0, p.vx); }
      if (p.x > c.x1 + mg){ p.x = c.x1 + mg; p.vx = Math.min(0, p.vx); }
      if (p.z < c.z0 - mg){ p.z = c.z0 - mg; p.vz = Math.max(0, p.vz); }
      if (p.z > c.z1 + mg){ p.z = c.z1 + mg; p.vz = Math.min(0, p.vz); }
    }
  }
  p.vy -= g*dt;
  if (p.vy < -32) p.vy = -32;
  if (p.planeo && p.vy < -4.5) p.vy = -4.5;

  /* poder: girar o lanzar fuego */
  if (inp.poder && !p.antPoder){
    if ((p.poder === 'fuego' || p.poder === 'plomero') && p.cdFuego <= 0){
      p.cdFuego = 0.22;
      J.bolas.push({x:p.x + Math.sin(p.ang)*0.6, y:p.y + 0.8*p.escala, z:p.z + Math.cos(p.ang)*0.6,
                    vx:Math.sin(p.ang)*15 + p.vx*0.3, vz:Math.cos(p.ang)*15 + p.vz*0.3, vy:3, t:0, vivo:true});
      ev(J, 'fuego', p.x, p.y + 0.8, p.z);
    } else if (ARMAS[p.poder]){
      /* las armas se disparan abajo (también dejando el botón apretado) */
    } else if (p.poder === 'laser'){
      if (p.cdFuego <= 0){ p.cdFuego = 0.25; disparoLaser(J); }
    } else if (p.poder === 'fuerza'){
      if (p.cdGiro <= 0){ p.cdGiro = 0.7; ondaFuerza(J, 6); }
    } else if (p.poder === 'robot'){
      if (p.cdFuego <= 0){
        p.cdFuego = 0.35;
        for (const lado of [1, -1]){
          const ox = Math.cos(p.ang)*0.55*lado, oz = -Math.sin(p.ang)*0.55*lado;
          J.bolas.push({x:p.x + Math.sin(p.ang)*0.8 + ox, y:p.y + 1.1*p.escala, z:p.z + Math.cos(p.ang)*0.8 + oz,
                        vx:Math.sin(p.ang)*22, vz:Math.cos(p.ang)*22, vy:0, t:0, vivo:true, misil:true});
        }
        ev(J, 'misil', p.x, p.y + 1, p.z);
      }
    } else if (p.cdGiro <= 0){
      p.giro = 0.45; p.cdGiro = CFG.GIRO_CD;
      if (!p.enSuelo && p.vy < 4) p.vy = 4;
      ev(J, 'giro', p.x, p.y, p.z);
    }
  }

  if (ARMAS[p.poder] && inp.poder && p.cdFuego <= 0) dispararArma(J);

  /* mover (dos pasitos para no atravesar nada) */
  const sub = 2, h = dt/sub, R = CFG.RADIO, alto = CFG.ALTO;
  for (let i=0;i<sub;i++){
    p.x += p.vx*h; p.z += p.vz*h;
    empujar(M, p, R, alto);
    const yAnt = p.y;
    p.y += p.vy*h;
    /* techo */
    if (p.vy > 0){
      for (const s of M.solidos){
        if (s.y0 < -30) continue;
        if (!dentro(s, p.x, p.z, -0.15)) continue;
        if (yAnt + alto <= s.y0 + 0.05 && p.y + alto > s.y0){ p.y = s.y0 - alto; p.vy = 0; }
      }
    }
    const gr = suelo(M, p.x, p.z, Math.max(yAnt, p.y), 0.22);
    if (p.vy <= 0 && p.y <= gr.y){
      aterrizar(J, gr);
    } else if (p.enSuelo && p.vy <= 0 && p.y - gr.y < 0.6){
      p.y = gr.y; p.sobre = gr.s;
    } else if (p.y > gr.y + 0.02){
      if (p.enSuelo) p.coyote = CFG.COYOTE;
      p.enSuelo = false;
    }
  }
  if (!p.enSuelo) p.tAire += dt; else p.tAire = 0;

  /* lugar seguro para volver si se cae */
  if (p.enSuelo && p.sobre && !p.sobre.mov && !p.sobre.resorte){
    p.tSeguro += dt;
    if (p.tSeguro > 0.4){
      p.tSeguro = 0;
      const cerca = M.enemigos.some(e=>e.vivo && Math.hypot(e.x - p.x, e.z - p.z) < 3);
      if (!cerca && dentro(p.sobre, p.x, p.z, -0.6)) p.seguro = {x:p.x, y:p.y, z:p.z};
    }
  }
  /* se cayó: Tío Juan lo atrapa */
  const aguaY = def.agua ? def.agua.y - (agua ? 4 : 0.6) : -1e9;
  if (p.y < def.yMuerte || p.y < aguaY) rescatar(J);
}

function aterrizar(J, gr){
  const p = J.p;
  const caida = p.vy;
  p.tAterrizo = J.t;
  p.y = gr.y; p.vy = 0; p.enSuelo = true; p.sobre = gr.s; p.saltos = 0;
  if (gr.s && gr.s.resorte){
    p.vy = CFG.RESORTE*(p.poder === 'tenis' ? 1.15 : 1); p.enSuelo = false; p.saltos = 1; p.cortado = true; p.sobre = null;
    ev(J, 'boing', p.x, p.y, p.z);
    return;
  }
  if (caida < -12) ev(J, 'aterriza', p.x, p.y, p.z, {fuerte: caida < -20});
}

function rescatar(J){
  const p = J.p, s = p.seguro;
  ev(J, 'rescate', p.x, p.y, p.z, {a:{x:s.x, y:s.y, z:s.z}});
  p.x = s.x; p.y = s.y + 1.5; p.z = s.z; p.vx = p.vz = 0; p.vy = 2; p.enSuelo = false; p.sobre = null; p.nada = false;
  p.invul = Math.max(p.invul, 1.5);
  J.tio.x = s.x + 1.2; J.tio.y = s.y + 3; J.tio.z = s.z + 1; J.tio.vx = J.tio.vy = J.tio.vz = 0;
  J.tio.estado = 'sigue'; J.tio.lista = [];
  if (J.cdRescateDicho <= 0){ decir(J, 'rescate'); J.cdRescateDicho = 14; }
}

function dar(J, poder){
  const p = J.p;
  p.poder = poder; p.tPoder = PODERES[poder].dur;
  ev(J, 'poder', p.x, p.y, p.z, {poder});
  decir(J, poder);
  if (poder === 'hamburguesa') decir(J, 'hamb2');
}

/* ---------------- jugar con los amigos de la sala ----------------
   La vista pone en J.amigos dónde está cada amigo que anda en este mismo mundo.
   Saltar en su cabeza hace rebotar alto, no se atraviesan (se empujan suavecito) y
   al chocar parados se dan los cinco. */
function amigosCerca(J){
  const p = J.p;
  if (!J.cdChoca) J.cdChoca = {};
  for (const a of J.amigos || []){
    if (!a || !isFinite(a.x + a.y + a.z)) continue;
    const dx = p.x - a.x, dz = p.z - a.z, d = Math.hypot(dx, dz), dy = p.y - a.y;
    const r = CFG.RADIO*2*Math.max(1, p.escala*0.8);
    if (p.vy < 0 && dy > 0.7 && dy < 1.9 && d < r + 0.2){
      p.vy = 17; p.saltos = 1; p.cortado = true; p.enSuelo = false; p.sobre = null;
      ev(J, 'saltoAmigo', a.x, a.y + 1.6, a.z, {id: a.id});
      continue;
    }
    const toca = d < r + 0.15 && Math.abs(dy) < 1.2, antes = J.tocaAmigo && J.tocaAmigo[a.id];
    (J.tocaAmigo || (J.tocaAmigo = {}))[a.id] = toca;
    if (d < r && Math.abs(dy) < 1.2){
      const ux = d > 0.01 ? dx/d : Math.sin(p.ang + 1.6), uz = d > 0.01 ? dz/d : Math.cos(p.ang + 1.6);
      p.x += ux*(r - d); p.z += uz*(r - d);                  /* se corre hacia afuera (el otro hace lo mismo en su aparato) */
      const vn = p.vx*ux + p.vz*uz; if (vn < 0){ p.vx -= vn*ux; p.vz -= vn*uz; }
    }
    if (toca && !antes){
      /* se dan los cinco al encontrarse (no cada rato si se quedan juntos) */
      if (p.enSuelo && J.t - (J.cdChoca[a.id] || -99) > 3){
        J.cdChoca[a.id] = J.t;
        ev(J, 'choca', (p.x + a.x)/2, Math.max(p.y, a.y) + 1.5, (p.z + a.z)/2, {id: a.id});
        decir(J, 'choca');
      }
    }
  }
}

/* ---------------- las armas de juguete ----------------
   Apuntan solas al monstruo más cercano que esté más o menos enfrente (un niño de seis años
   no tiene que apuntar fino); si no hay, disparan derecho. */
function dispararArma(J){
  const p = J.p, M = J.M, A = ARMAS[p.poder];
  p.cdFuego = A.cd;
  const ox = p.x + Math.sin(p.ang)*0.7, oy = p.y + 1.0*p.escala, oz = p.z + Math.cos(p.ang)*0.7;
  let blanco = null, mejor = 1e9;
  for (const e of M.enemigos){
    if (!e.vivo) continue;
    const dx = e.x - ox, dz = e.z - oz, d = Math.hypot(dx, dz);
    if (d > 26 || d < 0.5) continue;
    const da = Math.abs(angDif(p.ang, Math.atan2(dx, dz)));
    if (da > 0.55) continue;
    const pts = d + da*12; if (pts < mejor){ mejor = pts; blanco = e; }
  }
  let ang = p.ang, vy = A.vy || 0;
  if (blanco){
    const dx = blanco.x - ox, dz = blanco.z - oz, d = Math.hypot(dx, dz), dy = blanco.y + blanco.alto*0.5 - oy;
    ang = Math.atan2(dx, dz);
    const t = d/A.vel; vy = dy/t + 0.5*A.g*t;
  }
  J.bolas.push({x: ox, y: oy, z: oz, vx: Math.sin(ang)*A.vel, vz: Math.cos(ang)*A.vel, vy, t: 0, vivo: true, arma: p.poder});
  ev(J, 'disparo', ox, oy, oz, {arma: p.poder});
}
function explotar(J, x, y, z, r, arma){
  for (const e of J.M.enemigos) if (e.vivo && Math.hypot(e.x - x, e.z - z) < r + e.radio && Math.abs(e.y + e.alto*0.5 - y) < r + 1) matar(J, e, arma);
  ev(J, 'explota', x, y, z, {r, arma});
}
/* las bolas de fuego del Rey Tortugón: el escudo o saltarlas */
function fuegosMalos(J, dt){
  const M = J.M, p = J.p;
  for (const f of J.fuegosMalos){
    if (!f.vivo) continue;
    f.t += dt; f.vy -= 6*dt;
    f.x += f.vx*dt; f.y += f.vy*dt; f.z += f.vz*dt;
    if (f.t > 3.5 || f.y < suelo(M, f.x, f.z, f.y + 0.3, 0).y){ f.vivo = false; ev(J, 'puf', f.x, f.y, f.z); continue; }
    if (Math.hypot(f.x - p.x, f.z - p.z) < 0.8*Math.max(1, p.escala) && f.y > p.y - 0.3 && f.y < p.y + CFG.ALTO*p.escala + 0.3){
      f.vivo = false; ev(J, 'puf', f.x, f.y, f.z); lastimar(J, {x: f.x - f.vx, z: f.z - f.vz});
    }
  }
  if (J.fuegosMalos.length > 24) J.fuegosMalos = J.fuegosMalos.filter(f=>f.vivo);
}

/* ---------------- los súper poderes ---------------- */
function nuevoClon(J){
  const p = J.p;
  if (J.clones.length >= MAX_CLONES) return;
  J.clones.push({x:p.x, y:p.y, z:p.z, ang:p.ang, vel:0, suelo:p.enSuelo, vuela:false});
  ev(J, 'clon', p.x, p.y, p.z, {n: J.clones.length});
  if (!J.dijoClon){ J.dijoClon = true; decir(J, 'clonSale'); }
}
/* los clones van detrás de Fernando por su mismo camino; vencen a los gruñones y juntan monedas */
function clones(J, dt){
  const p = J.p, M = J.M;
  J.rastro.push({x:p.x, y:p.y, z:p.z, ang:p.ang, suelo:p.enSuelo, vuela:p.vuela});
  if (J.rastro.length > 120) J.rastro.shift();
  if (p.poder !== 'clon' && J.clones.length){ for (const c of J.clones) ev(J, 'clonSeVa', c.x, c.y, c.z); J.clones = []; }
  J.clones.forEach((c, i)=>{
    const r = J.rastro[Math.max(0, J.rastro.length - 1 - (i + 1)*16)];
    c.vel = Math.hypot(r.x - c.x, r.z - c.z)/dt;
    if (c.vel > 40){ c.vel = 0; }
    c.x = r.x; c.y = r.y; c.z = r.z; c.ang = r.ang; c.suelo = r.suelo; c.vuela = r.vuela;
    for (const e of M.enemigos){
      if (e.vivo && e.tipo !== 'jefe' && Math.hypot(e.x - c.x, e.z - c.z) < e.radio + 0.6 && e.y < c.y + 1.4 && e.y + e.alto > c.y) matar(J, e, 'golpe');
    }
    for (const m of M.monedas){
      if (m.vivo && Math.hypot(m.x - c.x, m.z - c.z) < 1 && m.y > c.y - 0.6 && m.y < c.y + 2){ m.vivo = false; monedaGanada(J, 1, m.x, m.y, m.z); }
    }
  });
}
/* rayos láser por los ojos: derechito hacia donde mira, la mira es generosa (sube y baja sola) */
function disparoLaser(J){
  const p = J.p, M = J.M;
  const ox = p.x, oy = p.y + 1.15*p.escala, oz = p.z, dx = Math.sin(p.ang), dz = Math.cos(p.ang);
  let largo = 22, blanco = null;
  for (const e of M.enemigos){
    if (!e.vivo) continue;
    const rx = e.x - ox, rz = e.z - oz, u = rx*dx + rz*dz;
    if (u < 0 || u > largo) continue;
    if (Math.abs(rx*dz - rz*dx) < e.radio + 0.7 && e.y - 2 < oy && e.y + e.alto + 2 > oy){ largo = u; blanco = e; }
  }
  for (let u = 0.6; u < largo; u += 0.5){ if (suelo(M, ox + dx*u, oz + dz*u, 300, 0).y > oy){ largo = u; blanco = null; break; } }
  const fy = blanco ? blanco.y + blanco.alto*0.5 : oy;
  if (blanco) matar(J, blanco, 'laser');
  ev(J, 'laser', ox, oy, oz, {a:{x:ox + dx*largo, y:fy, z:oz + dz*largo}, pego: !!blanco});
}
/* súper fuerza: un golpe al suelo que tumba a todos los de alrededor */
function ondaFuerza(J, r){
  const p = J.p, M = J.M;
  for (const e of M.enemigos){
    if (e.vivo && Math.hypot(e.x - p.x, e.z - p.z) < r + e.radio && Math.abs(e.y - p.y) < 3) matar(J, e, 'onda');
  }
  for (const b of (M.pelotas || [])){
    const dx = b.x - p.x, dz = b.z - p.z, d = Math.hypot(dx, dz);
    if (d < r && d > 0.01){ b.vx = dx/d*18; b.vz = dz/d*18; b.vy = 7; }
  }
  if (!p.enSuelo && p.vy > -10) p.vy = -10;
  ev(J, 'onda', p.x, p.y, p.z, {r});
}

function lastimar(J, e){
  const p = J.p;
  if (p.invul > 0 || p.baile > 0 || p.poder === 'robot') return;
  /* el escudo aguanta el golpe */
  if (J.escudo > 0){
    J.escudo = Math.max(0, J.escudo - 50); p.invul = 1.2;
    ev(J, 'escudoGolpe', p.x, p.y + 1, p.z, {queda: J.escudo});
    if (J.escudo <= 0) decir(J, 'escudoRoto');
    return;
  }
  const dx = p.x - e.x, dz = p.z - e.z, d = Math.hypot(dx, dz) || 1;
  p.vx = dx/d*5; p.vz = dz/d*5; p.vy = 6.5; p.enSuelo = false; p.sobre = null;
  p.invul = CFG.INVUL; p.golpeT = 0.45;
  ev(J, 'golpe', p.x, p.y, p.z);
  decir(J, 'ay');
}

/* ---------------- enemigos ---------------- */
function matar(J, e, como){
  if (!e.vivo) return;
  if (e.tipo === 'jefe'){
    if (e.invul > 0) return;
    e.vida--; e.invul = 1.6; e.huye = 1.4;
    ev(J, 'jefeGolpe', e.x, e.y + 1.5, e.z, {vida:e.vida});
    if (e.vida <= 0){
      e.vivo = false; e.muere = 0.001;
      ev(J, 'jefeCae', e.x, e.y + 1.5, e.z);
      decir(J, 'jefeCaeMalo', e.def.cae, 'malo', e.def.nombre);
      const est = J.M.estrellas.find(s=>s.tipo === 'jefe');
      if (est){
        est.visible = true;
        ev(J, 'aparece', est.x, est.y, est.z);
        if (est.grande) decir(J, 'jefeCae');
        else decir(J, 'jefeCae');
      }
      for (const o of J.M.enemigos) if (o.vivo && o !== e && Math.hypot(o.x - e.x, o.z - e.z) < 14){ o.vivo = false; o.muere = 0.001; }
    } else {
      decir(J, 'jefeGolpe');
      /* llama a un ayudante */
      const a = J.R()*6.28;
      const nx = e.cx + Math.sin(a)*e.rArena*0.6, nz = e.cz + Math.cos(a)*e.rArena*0.6;
      const piel = e.piel === 'rey' ? 'grunon' : e.piel === 'muneco' ? 'pinguino' : e.piel === 'nubarron' ? 'nubecita' : e.piel;
      const n = nuevoEnemigo(J, 'grunon', nx, nz, {piel});
      J.M.enemigos.push(n);
      ev(J, 'nace', nx, n.y, nz);
    }
    return;
  }
  e.vivo = false; e.muere = 0.001;
  ev(J, 'muere', e.x, e.y + 0.5, e.z, {como, tipo: e.tipo, piel: e.piel});
  monedaGanada(J, e.tipo === 'llama' ? 10 : 1, e.x, e.y + 1, e.z);
  /* la zona quedó limpia: aparece su estrella */
  if (e.zona && !J.M.enemigos.some(o=>o.vivo && o.zona === e.zona)){
    const est = J.M.estrellas.find(s=>s.tipo === 'zona' && s.zona === e.zona);
    if (est && !est.visible && !est.tomada){
      est.visible = true; ev(J, 'aparece', est.x, est.y, est.z);
      decir(J, (J.M.def.frasesZona || {})[e.zona] || 'zonaLista');
      return;
    }
  }
  if (J.R() < 0.35) decir(J, 'toma');
}

function enemigos(J, dt){
  const M = J.M, p = J.p;
  const esc = p.escala;
  for (const e of M.enemigos){
    if (!e.vivo){ if (e.muere > 0) e.muere += dt; continue; }
    e.t += dt; e.invul = Math.max(0, e.invul - dt);
    const dxp = p.x - e.x, dzp = p.z - e.z, dp = Math.hypot(dxp, dzp);
    if (e.tipo === 'diana'){
      e.ang = Math.atan2(p.x - e.x, p.z - e.z);
    } else if (e.tipo === 'abeja'){
      e.x = e.hx + Math.sin(e.t*0.8)*3; e.z = e.hz + Math.cos(e.t*0.8)*3; e.y = e.hy + Math.sin(e.t*2.2)*0.5;
      e.ang = e.t*0.8 + Math.PI/2;
    } else {
      let tx = e.wx, tz = e.wz, vel = e.vel;
      if (e.tipo === 'jefe'){
        if (!e.despierto && dp < e.rArena + 4 && Math.abs(p.y - e.y) < 3){
          e.despierto = true;
          decir(J, 'jefeHola', e.def.hola, 'malo', e.def.nombre);
          ev(J, 'jefeDespierta', e.x, e.y, e.z);
        }
        if (!e.despierto){ e.ang += dt*0.5; continue; }
        if (e.huye > 0){ e.huye -= dt; tx = e.x - dxp; tz = e.z - dzp; vel = 4.5; }
        else { tx = p.x; tz = p.z; }
        /* no sale de su arena */
        const ax = tx - e.cx, az = tz - e.cz, ad = Math.hypot(ax, az), lim = e.rArena - e.radio - 0.3;
        if (ad > lim){ tx = e.cx + ax/ad*lim; tz = e.cz + az/ad*lim; }
        /* el Rey Tortugón escupe bolas de fuego */
        if (e.def.fuego && e.huye <= 0 && dp < 20){
          e.cdFuego = (e.cdFuego == null ? 2 : e.cdFuego) - dt;
          if (e.cdFuego <= 0){
            e.cdFuego = 3.2;
            const a0 = Math.atan2(dxp, dzp);
            for (const da of [-0.3, 0, 0.3]) J.fuegosMalos.push({x: e.x + Math.sin(a0)*2, y: e.y + 2.2, z: e.z + Math.cos(a0)*2, vx: Math.sin(a0 + da)*9, vz: Math.cos(a0 + da)*9, vy: 2, t: 0, vivo: true});
            ev(J, 'fuegoMalo', e.x, e.y + 2.2, e.z);
          }
        }
        /* a veces da un saltote */
        e.salto -= dt;
        if (e.salto <= -3.5 && e.huye <= 0){ e.salto = 0.6; e.vy = 9; ev(J, 'jefeSalta', e.x, e.y, e.z); }
      } else {
        const persigue = e.tipo !== 'llama' && dp < 8 && Math.abs(p.y - e.y) < 2.5 && p.invul <= 0;
        const huye = e.tipo === 'llama' && dp < 6;
        if (persigue){ tx = p.x; tz = p.z; vel = e.piel === 'pinguino' ? 3 : 2.5; }
        else if (huye){ tx = e.x - dxp; tz = e.z - dzp; vel = 3; }
        else {
          e.tw -= dt;
          if (e.tw <= 0 || Math.hypot(e.wx - e.x, e.wz - e.z) < 0.5){
            e.tw = 2 + J.R()*3; const a = J.R()*6.28, r = J.R()*3.5;
            e.wx = e.hx + Math.sin(a)*r; e.wz = e.hz + Math.cos(a)*r;
          }
        }
      }
      const ddx = tx - e.x, ddz = tz - e.z, dd = Math.hypot(ddx, ddz);
      if (dd > 0.3){
        const a = Math.atan2(ddx, ddz);
        e.ang += angDif(e.ang, a)*Math.min(1, dt*6);
        const nx = e.x + Math.sin(e.ang)*vel*dt, nz = e.z + Math.cos(e.ang)*vel*dt;
        const g = suelo(M, nx, nz, e.y + (e.tipo === 'jefe' ? 0.3 : 0), 0);
        if (g.s && Math.abs(g.y - e.hy) < 0.7){ e.x = nx; e.z = nz; if (e.vy === 0) e.y = g.y; }
        else { e.tw = 0; e.wx = e.hx; e.wz = e.hz; }
      }
      if (e.vy !== 0 || e.y > e.hy + 0.01){
        e.y += e.vy*dt; e.vy -= 30*dt;
        if (e.y <= e.hy){
          e.y = e.hy; e.vy = 0;
          if (e.tipo === 'jefe'){ ev(J, 'temblor', e.x, e.y, e.z); if (p.enSuelo && dp < 4.2) lastimar(J, e); }
        }
      }
    }
    /* choque con Fernando */
    const rr = e.radio + CFG.RADIO*esc;
    if (dp < rr && p.y < e.y + e.alto && p.y + CFG.ALTO*esc > e.y){
      const encima = p.vy < 0 && p.y > e.y + e.alto*0.45;
      if (encima){
        matar(J, e, 'pisa');
        p.vy = e.tipo === 'jefe' ? 16 : CFG.REBOTE; p.saltos = 1; p.cortado = true; p.enSuelo = false; p.sobre = null;
        if (e.tipo === 'jefe'){ const d = dp || 1; p.vx = dxp/d*7; p.vz = dzp/d*7; }
        ev(J, 'pisa', e.x, e.y + e.alto, e.z);
      } else if (p.poder === 'hamburguesa' || p.poder === 'gigante' || p.poder === 'fuerza' || p.poder === 'robot' || p.giro > 0){
        matar(J, e, 'golpe');
        if (e.tipo === 'jefe'){ const d = dp || 1; p.vx = dxp/d*8; p.vz = dzp/d*8; p.vy = 7; }
      } else if (e.tipo === 'diana' || e.tipo === 'llama'){
        matar(J, e, 'golpe');                      /* las dianas y la llama piñata se rompen con solo tocarlas */
      } else if (e.tipo !== 'jefe' || e.invul <= 0){
        lastimar(J, e);
      }
    }
  }
  /* se limpian los que ya terminaron de desaparecer */
  if (M.enemigos.length > 30) M.enemigos = M.enemigos.filter(e=>e.vivo || e.muere < 1.5);
}

/* ---------------- bolas de fuego ---------------- */
function bolas(J, dt){
  const M = J.M;
  for (const b of J.bolas){
    if (!b.vivo) continue;
    b.t += dt;
    if (b.t > 2.4){ b.vivo = false; continue; }
    const A = b.arma ? ARMAS[b.arma] : null;
    if (A){ b.vy -= A.g*dt; if (b.t > (A.vida || 2.2)){ b.vivo = false; ev(J, 'puf', b.x, b.y, b.z, {arma: b.arma}); continue; } }
    else if (!b.misil) b.vy -= 30*dt;
    const ox = b.x, oz = b.z;
    b.x += b.vx*dt; b.z += b.vz*dt; b.y += b.vy*dt;
    const yAnt = b.y - b.vy*dt;
    const g = suelo(M, b.x, b.z, Math.max(yAnt, b.y), 0);
    if (b.y <= g.y){
      if (A){ b.vivo = false; if (A.explota) explotar(J, b.x, g.y + 0.3, b.z, A.explota, b.arma); else ev(J, 'puf', b.x, g.y, b.z, {arma: b.arma}); continue; }
      if (b.misil){ b.vivo = false; ev(J, 'puf', b.x, b.y, b.z); continue; }
      b.y = g.y; b.vy = 8;
    }
    const o = {x:b.x, y:b.y, z:b.z};
    if (empujar(M, o, A ? A.r*0.6 : 0.25, 0.3)){ b.vivo = false; if (A && A.explota) explotar(J, ox, b.y, oz, A.explota, b.arma); else ev(J, 'puf', ox, b.y, oz, {arma: b.arma}); continue; }
    if (b.y < M.def.yMuerte){ b.vivo = false; continue; }
    const rb = A ? A.r : 0.45;
    for (const e of M.enemigos){
      if (!e.vivo) continue;
      if (Math.hypot(e.x - b.x, e.z - b.z) < e.radio + rb && b.y > e.y - 0.4 - rb && b.y < e.y + e.alto + 0.4 + rb){
        b.vivo = false;
        if (A && A.explota) explotar(J, b.x, b.y, b.z, A.explota, b.arma);
        else { matar(J, e, b.arma || 'fuego'); ev(J, 'puf', b.x, b.y, b.z, {arma: b.arma}); }
        break;
      }
    }
  }
  if (J.bolas.length > 20) J.bolas = J.bolas.filter(b=>b.vivo);
}

/* ---------------- la pelota de fútbol (Argentina) ----------------
   Fernando la patea solo con tocarla (hacia donde va él); rueda, rebota
   en las paredes y si entra al arco: ¡gol! La primera vez aparece la estrella. */
function reponerPelota(M, b){
  b.x = b.x0; b.z = b.z0; b.y = suelo(M, b.x0, b.z0, 100, 0).y; b.vx = b.vy = b.vz = 0; b.cd = 0; b.golT = 0;
}
function pelotas(J, dt){
  const M = J.M, p = J.p, def = M.def;
  for (const b of M.pelotas){
    b.cd = Math.max(0, b.cd - dt);
    /* la patada */
    const dx = b.x - p.x, dz = b.z - p.z, d = Math.hypot(dx, dz), alcance = CFG.RADIO*p.escala + b.r + 0.15;
    if (b.cd <= 0 && d < alcance && b.y < p.y + CFG.ALTO*p.escala && b.y + b.r*2 > p.y - 0.2){
      const ux = d > 0.01 ? dx/d : Math.sin(p.ang), uz = d > 0.01 ? dz/d : Math.cos(p.ang);
      let kx = ux + Math.sin(p.ang), kz = uz + Math.cos(p.ang); const kl = Math.hypot(kx, kz) || 1; kx /= kl; kz /= kl;
      const fuerza = 9 + Math.hypot(p.vx, p.vz)*1.1 + (p.giro > 0 ? 6 : 0) + (p.escala > 1.2 ? 5 : 0) + (p.poder === 'fuerza' || p.poder === 'robot' ? 8 : 0);
      b.vx = kx*fuerza; b.vz = kz*fuerza; b.vy = p.enSuelo ? 3 : 5;
      b.x = p.x + kx*(alcance + 0.05); b.z = p.z + kz*(alcance + 0.05);
      b.cd = 0.25;
      ev(J, 'patada', b.x, b.y, b.z);
      if (!M.dijoPelota){ M.dijoPelota = true; decir(J, 'pelota'); }
    }
    /* rodar y rebotar */
    b.vy -= CFG.GRAV*0.8*dt;
    b.x += b.vx*dt; b.z += b.vz*dt;
    const o = {x:b.x, y:b.y, z:b.z};
    if (empujar(M, o, b.r, b.r*2)){
      const nx = o.x - b.x, nz = o.z - b.z, nl = Math.hypot(nx, nz) || 1, vn = (b.vx*nx + b.vz*nz)/nl;
      if (vn < 0){ b.vx -= 1.6*vn*nx/nl; b.vz -= 1.6*vn*nz/nl; }
      b.x = o.x; b.z = o.z;
    }
    b.y += b.vy*dt;
    const g = suelo(M, b.x, b.z, b.y + 0.3, 0);
    if (b.y <= g.y){
      b.y = g.y; b.vy = b.vy < -2.5 ? -b.vy*0.45 : 0;
      const f = Math.max(0, 1 - dt*1.1); b.vx *= f; b.vz *= f;
    }
    b.giro += Math.hypot(b.vx, b.vz)*dt/b.r;
    /* ¿gol? */
    if (b.golT > 0){ b.golT -= dt; if (b.golT <= 0) reponerPelota(M, b); continue; }
    for (const a of def.arcos || []){
      const adentro = (b.x - a.x)*a.dir;
      if (adentro > 0 && adentro < 3 && Math.abs(b.z - a.z) < a.ancho && b.y < a.alto){
        b.golT = 1.6; b.vx *= 0.3; b.vz *= 0.3;
        ev(J, 'gol', a.x, 1.2, a.z);
        decir(J, 'gol');
        const est = M.estrellas.find(s=>s.tipo === 'gol');
        if (est && !est.visible && !est.tomada){ est.visible = true; ev(J, 'aparece', est.x, est.y, est.z); decir(J, 'golTio'); }
        break;
      }
    }
    /* se fue al agua o al vacío: vuelve al centro de la cancha */
    if (b.y < (def.agua ? def.agua.y - 0.3 : def.yMuerte)){ reponerPelota(M, b); ev(J, 'pelotaVuelve', b.x, b.y, b.z); }
  }
}

/* ---------------- monedas, estrellas, cajas, portales ---------------- */
function monedaGanada(J, n, x, y, z){
  const antes = J.prog.monedas;
  J.prog.monedas += n; J.monedasMundo += n;
  ev(J, 'moneda', x, y, z, {n});
  if (Math.floor(antes/50) !== Math.floor(J.prog.monedas/50)){
    decir(J, 'monedas50');
    const libres = LISTA_PODERES.filter(k=>k !== J.p.poder);
    dar(J, libres[Math.floor(J.R()*libres.length)]);
  }
}
function toca(p, o, rh, arriba){
  const esc = p.escala;
  return Math.hypot(o.x - p.x, o.z - p.z) < rh*Math.max(1, esc*0.8) && o.y > p.y - 0.6 && o.y < p.y + CFG.ALTO*esc + (arriba || 0.7);
}

function cosas(J, dt){
  const M = J.M, p = J.p, def = M.def;
  const iman = p.poder === 'iman';
  for (const m of M.monedas.concat(M.rojas)){
    if (!m.vivo) continue;
    if (iman){
      const dx = p.x - m.x, dy = p.y + 0.7 - m.y, dz = p.z - m.z, d = Math.hypot(dx, dy, dz);
      if (d < 12 && d > 0.01){ const v = Math.min(d, 16*dt); m.x += dx/d*v; m.y += dy/d*v; m.z += dz/d*v; }
    }
    if (toca(p, m, 1.0)){
      m.vivo = false;
      if (m.tipo === 'roja'){
        J.rojasMundo++;
        monedaGanada(J, 2, m.x, m.y, m.z);
        ev(J, 'roja', m.x, m.y, m.z, {n:J.rojasMundo});
        const est = M.estrellas.find(s=>s.tipo === 'rojas');
        if (J.rojasMundo >= M.rojas.length && est && !est.visible){
          est.visible = true; ev(J, 'aparece', est.x, est.y, est.z); decir(J, def.fraseRojas || 'rojas');
        } else decir(J, def.fraseRoja || 'roja');
      } else monedaGanada(J, 1, m.x, m.y, m.z);
    }
  }
  for (const s of M.estrellas){
    if (!s.visible || s.tomada) continue;
    if (toca(p, s, 1.4, 1.2)) tomarEstrella(J, s);
  }
  /* las pociones de escudo */
  for (const q of M.pociones){
    if (q.vivo && J.escudo < 100 && toca(p, q, 1.0)){
      q.vivo = false; J.escudo = Math.min(100, J.escudo + 50);
      ev(J, 'pocion', q.x, q.y, q.z, {escudo: J.escudo});
      if (!J.dijoPocion){ J.dijoPocion = true; decir(J, 'pocion'); }
    }
  }
  for (const c of M.cajas){
    if (c.abierta > 0){
      c.abierta -= dt;
      if (c.abierta <= 0 && c.temporal) c.fuera = true;
      continue;
    }
    if (c.fuera) continue;
    if (c.temporal){ c.vida -= dt; if (c.vida <= 0){ c.fuera = true; continue; } }
    if (toca(p, c, 1.3, 0.9)){
      c.abierta = c.temporal ? 0.5 : 18;
      ev(J, 'caja', c.x, c.y, c.z, {poder:c.poder});
      dar(J, c.poder);
    }
  }
  if (M.cajas.length > 14) M.cajas = M.cajas.filter(c=>!c.fuera);
  for (const a of M.amigos){
    if (!a.dicho && Math.hypot(a.x - p.x, a.z - p.z) < 3){
      a.dicho = true;
      for (const f of a.frases) decir(J, f);
      ev(J, 'amigo', a.x, a.y, a.z, {quien:a.quien});
    }
  }
  /* los cuadros mágicos del castillo */
  for (const po of M.portales){
    if (Math.hypot(po.x - p.x, po.z - p.z) < 1.7 && Math.abs(p.y - po.y) < 2 && !J.trans){
      const tengo = cuentaEstrellas(J.prog);
      if (tengo >= po.necesita){
        const id = MUNDOS[po.mundo].id;
        const saludo = MUNDOS[po.mundo].saludo;
        irA(J, po.mundo, null, ()=>{
          decir(J, 'entra');
          /* cada vez que entra a un cuadro: ¡un súper poder nuevo! (van rotando) */
          const sp = SUPER[J.prog.superN % SUPER.length]; J.prog.superN = (J.prog.superN + 1) % SUPER.length;
          decir(J, 'superPortal'); dar(J, sp);
          if (MUNDOS[po.mundo].autobus){ J.p.y += 32; J.p.vy = 0; J.p.enSuelo = false; J.p.planeo = true; ev(J, 'autobus', J.p.x, J.p.y, J.p.z); }
          if (estrellasDe(J.prog, id) === 0){
            if (saludo) for (const f of saludo) decir(J, f);
            else { decir(J, J.R() < 0.5 ? 'perro' : 'perro2'); decir(J, 'pista'); }
          }
        });
      }
      else {
        const dx = p.x - po.x, dz = p.z - po.z, d = Math.hypot(dx, dz) || 1;
        p.x = po.x + dx/d*1.8; p.z = po.z + dz/d*1.8; p.vx = dx/d*5; p.vz = dz/d*5;
        if (J.cdBloqueo <= 0){ decir(J, 'bloqueado'); J.cdBloqueo = 5; ev(J, 'bloqueado', po.x, po.y, po.z, {necesita:po.necesita}); }
      }
    }
  }
  /* el tubo para volver al castillo */
  if (def.tubo && !J.trans){
    if (Math.hypot(def.tubo.x - p.x, def.tubo.z - p.z) < 1.1 && p.enSuelo && Math.abs(p.y - M.tuboY) < 0.1) irA(J, 0, J.mundo);
  }
  /* si la última estrella fue en el castillo, la vuelta nueva empieza ahí mismo */
  if (def.id === 'castillo' && J.prog.vueltaLista && !J.trans && p.baile <= 0 && J.fase === 'juego') irA(J, 0);
  /* los cuadros de los países están detrás: Tío Juan avisa una vez */
  if (def.id === 'castillo' && !J.prog.paisesDicho && J.fase === 'juego' && M.t > 4){ J.prog.paisesDicho = true; decir(J, 'paises'); }
  /* la pista del techo en el castillo */
  if (def.id === 'castillo' && !J.prog.tejadoDicho && cuentaEstrellas(J.prog) >= 2 && !J.prog.estrellas['castillo:tejado']){
    J.prog.tejadoDicho = true; decir(J, 'tejado');
  }
}

function tomarEstrella(J, s){
  const p = J.p, M = J.M, def = M.def;
  s.tomada = true;
  const clave = def.id + ':' + s.id;
  const nueva = !J.prog.estrellas[clave];
  J.prog.estrellas[clave] = true;
  if (cuentaEstrellas(J.prog) >= CFG.ESTRELLAS_FIN) J.prog.vueltaLista = true;
  p.baile = 2.2; p.vx = p.vz = 0;
  ev(J, 'estrella', s.x, s.y, s.z, {nueva, total: cuentaEstrellas(J.prog), grande: !!s.grande, clave});
  if (s.grande){
    J.fase = 'final'; J.tFinal = 0; J.prog.ganado = true;
    J.dialogos = [];
    decir(J, 'final2'); decir(J, 'final3');
    ev(J, 'final', p.x, p.y, p.z);
    return;
  }
  if (nueva){ decir(J, 'estrella'); decir(J, 'estrellaTio'); }
  else decir(J, 'estrellaYa');
  const faltan = def.estrellas.filter(e=>!J.prog.estrellas[def.id + ':' + e.id]).length;
  if (faltan === 0 && nueva && def.id !== 'castillo'){ decir(J, 'todas'); J.tTodas = 0; }
}

/* la flecha amarilla: lo más cercano que falta */
function buscarGuia(J){
  const M = J.M, p = J.p, def = M.def;
  let mejor = null, md = 1e9;
  const prueba = (x, y, z, tipo)=>{ const d = Math.hypot(x - p.x, z - p.z, (y - p.y)*0.5); if (d < md){ md = d; mejor = {x, y, z, tipo}; } };
  if (def.id === 'castillo'){
    const tengo = cuentaEstrellas(J.prog);
    for (const po of M.portales){
      const d2 = MUNDOS[po.mundo];
      if (tengo >= po.necesita && estrellasDe(J.prog, d2.id) < d2.estrellas.length) prueba(po.x, po.y + 2, po.z, 'portal');
    }
    for (const s of M.estrellas) if (s.visible && !s.tomada && !s.ya && tengo >= 2) prueba(s.x, s.y, s.z, 'estrella');
    return mejor;
  }
  for (const s of M.estrellas) if (s.visible && !s.tomada) prueba(s.x, s.y, s.z, 'estrella');
  if (mejor) return mejor;
  const rojasEst = M.estrellas.find(s=>s.tipo === 'rojas');
  if (rojasEst && !rojasEst.ya) for (const m of M.rojas) if (m.vivo) prueba(m.x, m.y, m.z, 'roja');
  if (mejor) return mejor;
  for (const e of M.enemigos){
    if (!e.vivo || !e.zona) continue;
    const ez = M.estrellas.find(s=>s.tipo === 'zona' && s.zona === e.zona);
    if (ez && !ez.ya && !ez.visible) prueba(e.x, e.y + 1.5, e.z, 'zona');
  }
  if (mejor) return mejor;
  const golEst = M.estrellas.find(s=>s.tipo === 'gol');
  if (golEst && !golEst.visible && !golEst.ya) for (const b of M.pelotas) prueba(b.x, b.y + 1.2, b.z, 'pelota');
  if (mejor) return mejor;
  const jefeEst = M.estrellas.find(s=>s.tipo === 'jefe');
  if (M.jefe && M.jefe.vivo && jefeEst && (!jefeEst.ya || jefeEst.grande)) prueba(M.jefe.x, M.jefe.y + 2, M.jefe.z, 'jefe');
  if (mejor) return mejor;
  for (const s of M.estrellas) if (s.visible && !s.tomada) prueba(s.x, s.y, s.z, 'estrella');
  if (!mejor && def.tubo) prueba(def.tubo.x, M.tuboY + 1, def.tubo.z, 'tubo');
  return mejor;
}

/* ---------------- Tío Juan ---------------- */
function tioSigue(J, dt){
  const t = J.tio, p = J.p;
  t.t += dt;
  /* vuela al lado de Fernando, un poquito adelante, para que la cámara vea a los dos. El lado
     depende hacia dónde va Fernando, pero girado con calma para que Tío Juan no dé vueltas locas */
  t.rumbo = t.rumbo == null ? p.ang : t.rumbo + angDif(t.rumbo, p.ang)*Math.min(1, dt*1.5);
  const a = t.rumbo - 1.15;
  const ox = p.x + Math.sin(a)*2.1, oz = p.z + Math.cos(a)*2.1, oy = p.y + 1.6*Math.max(1, p.escala*0.9) + Math.sin(t.t*1.6)*0.2;
  /* resorte con amortiguación: acelera y frena como si tuviera peso (antes saltaba hacia el punto) */
  const w = 3.2;
  if (!isFinite(t.vx + t.vy + t.vz)) t.vx = t.vy = t.vz = 0;
  t.vx += ((ox - t.x)*w*w - t.vx*2*w)*dt;
  t.vy += ((oy - t.y)*w*w - t.vy*2*w)*dt;
  t.vz += ((oz - t.z)*w*w - t.vz*2*w)*dt;
  const v = Math.hypot(t.vx, t.vy, t.vz), tope = 24;
  if (v > tope){ t.vx *= tope/v; t.vy *= tope/v; t.vz *= tope/v; }
  t.x += t.vx*dt; t.y += t.vy*dt; t.z += t.vz*dt;
  /* mira hacia donde vuela; si casi no se mueve, hacia donde mira Fernando */
  const vh = Math.hypot(t.vx, t.vz);
  const meta = vh > 1.5 ? Math.atan2(t.vx, t.vz) : p.ang;
  t.ang += angDif(t.ang, meta)*Math.min(1, dt*(vh > 1.5 ? 5 : 2));
  if (Math.hypot(t.x - p.x, t.z - p.z) > 30){ t.x = ox; t.y = oy; t.z = oz; t.vx = t.vy = t.vz = 0; }
}
function tio(J, dt, inp){
  const t = J.tio, p = J.p, M = J.M;
  t.cd = Math.max(0, t.cd - dt);
  t.puno = Math.max(0, t.puno - dt);
  if (inp.ayuda && !p.antAyuda && t.cd <= 0 && t.estado === 'sigue'){
    t.cd = CFG.AYUDA_CD;
    decir(J, 'ayuda');
    const malos = M.enemigos.filter(e=>e.vivo && Math.hypot(e.x - p.x, e.z - p.z) < 18 && (e.tipo !== 'jefe' || e.despierto))
                             .sort((a, b)=>Math.hypot(a.x - p.x, a.z - p.z) - Math.hypot(b.x - p.x, b.z - p.z)).slice(0, 4);
    if (malos.length){ t.estado = 'ataca'; t.lista = malos; decir(J, 'ayudaVoy'); ev(J, 'tioVuela', t.x, t.y, t.z); }
    else {
      /* no hay malos cerca: le trae un regalo con un poder */
      const libres = LISTA_PODERES.filter(k=>k !== p.poder);
      const poder = libres[Math.floor(J.R()*libres.length)];
      const x = p.x + Math.sin(p.ang)*2.6, z = p.z + Math.cos(p.ang)*2.6;
      const g = suelo(M, x, z, p.y + 1, 0.3);
      const y = (g.s ? g.y : p.y) + 1.3;
      M.cajas.push({x: g.s ? x : p.x, y, z: g.s ? z : p.z, poder, abierta:0, temporal:true, vida:25, nueva:true});
      ev(J, 'regalo', x, y, z, {poder});
      decir(J, 'regalo'); decir(J, 'gracias');
    }
  }
  if (t.estado === 'ataca'){
    while (t.lista.length && !t.lista[0].vivo) t.lista.shift();
    const e = t.lista[0];
    if (!e){ t.estado = 'sigue'; }
    else {
      const tx = e.x, ty = e.y + e.alto*0.6 + 0.4, tz = e.z;
      const dx = tx - t.x, dy = ty - t.y, dz = tz - t.z, d = Math.hypot(dx, dy, dz);
      const v = 26*dt;
      if (d < 1.2 + e.radio*0.5){
        t.puno = 0.35;
        ev(J, 'puno', e.x, e.y + e.alto*0.6, e.z);
        if (e.tipo === 'jefe'){ matar(J, e, 'tio'); t.lista.shift(); }
        else matar(J, e, 'tio');
      } else {
        const paso = Math.min(v, d);
        t.x += dx/d*paso; t.y += dy/d*paso; t.z += dz/d*paso;
        t.vx = dx/d*paso/dt; t.vy = dy/d*paso/dt; t.vz = dz/d*paso/dt;
        t.ang += angDif(t.ang, Math.atan2(dx, dz))*Math.min(1, dt*10);
      }
    }
  } else tioSigue(J, dt);
}

/* ---------------- Penny y Sheldon, los perritos ---------------- */
function perros(J, dt){
  const p = J.p, M = J.M, agua = M.def.agua && M.def.agua.tipo !== 'lava' ? M.def.agua : null;
  J.perros.forEach((g, i)=>{
    const a = p.ang + Math.PI + (i ? 0.7 : -0.7);
    const tx = p.x + Math.sin(a)*2.2, tz = p.z + Math.cos(a)*2.2;
    const dx = tx - g.x, dz = tz - g.z, d = Math.hypot(dx, dz);
    /* lejos (o Fernando parado en otro piso): aparecen a su lado, sobre el suelo.
       Mientras Fernando vuela se quedan abajo siguiéndolo (no suben al aire). */
    if (d > 14 || (p.enSuelo && Math.abs(g.y - p.y) > 6)){
      const nx = p.x + Math.sin(a)*1.2, nz = p.z + Math.cos(a)*1.2, gs = suelo(M, nx, nz, p.y + 1, 0.2);
      if (gs.s && Math.abs(gs.y - p.y) < 1){ g.x = nx; g.z = nz; g.y = gs.y; g.nada = false; return; }
      if (p.enSuelo){ g.x = p.x; g.z = p.z; g.y = p.y; g.nada = false; return; }
      if (!p.nada) return;   /* vuela lejos: esperan; nada lejos: nadan hacia él */
    }
    const v = Math.min(d, (d > 3 ? 11 : 6)*dt);
    let corre = false;
    if (d > 0.4){
      const nx = g.x + dx/d*v*(g.nada ? 0.7 : 1), nz = g.z + dz/d*v*(g.nada ? 0.7 : 1), gs = suelo(M, nx, nz, g.y + 3, 0.2);
      if (gs.s || agua){ g.x = nx; g.z = nz; corre = true; }   /* en el agua nadan; en el vacío esperan en la orilla */
      g.ang += angDif(g.ang, Math.atan2(dx, dz))*Math.min(1, dt*8);
    }
    g.anim += corre ? dt*12 : dt*2;
    const gr = suelo(M, g.x, g.z, g.y + 3, 0.2);
    const ty = agua && (!gr.s || gr.y < agua.y - 0.4) ? agua.y - 0.4 : gr.s ? gr.y : g.y;
    g.nada = ty > (gr.s ? gr.y : -Infinity) + 0.01;
    g.y += (ty - g.y)*Math.min(1, dt*(g.nada ? 4 : 10));
  });
}

/* ============================================================
   JUGAR CON AMIGOS (lo que viaja por la red; red.js lo manda)
   ============================================================ */
const r2 = v=>Math.round(v*100)/100;
function empaquetar(J, pj, nombre, ts){
  const p = J.p;
  return {t:'e', pj: PJS[pj] ? pj : 'fernando', n: String(nombre || '').slice(0, 14), nv: J.mundo,
          ts: Math.round(ts != null ? ts : Date.now()), vx: r2(p.vx), vy: r2(p.vy), vz: r2(p.vz),
          x: r2(p.x), y: r2(p.y), z: r2(p.z), a: r2(p.ang), v: r2(Math.hypot(p.vx, p.vz)),
          s: p.enSuelo ? 1 : 0, vu: p.vuela ? 1 : 0, na: p.nada ? 1 : 0, p: p.poder || '', g: p.giro > 0 ? 1 : 0, b: (p.baile > 0 || J.fase === 'final') ? 1 : 0, e: r2(p.escala)};
}
/* lo que llega se revisa: números finitos y dentro de rango, textos conocidos; si no, se tira */
function desempaquetar(m){
  if (!m || typeof m !== 'object' || m.t !== 'e') return null;
  const n = (v, a, b)=>Number.isFinite(v) ? Math.min(b, Math.max(a, v)) : NaN;
  const nv = Number.isInteger(m.nv) && m.nv >= 0 && m.nv < MUNDOS.length ? m.nv : -1;
  const x = n(m.x, -500, 500), y = n(m.y, -60, 300), z = n(m.z, -500, 500), ang = n(m.a, -50, 50);
  if (nv < 0 || [x, y, z, ang].some(Number.isNaN)) return null;
  const pj = PJS[m.pj] ? m.pj : 'fernando';
  const nombre = String(typeof m.n === 'string' ? m.n : '').replace(/[^\wáéíóúñÁÉÍÓÚÑ ]/g, '').slice(0, 14) || PJS[pj].nombre;
  const ts = Number.isFinite(m.ts) && m.ts >= 0 && m.ts < 1e13 ? m.ts : undefined;
  return {pj, nombre, nv, x, y, z, ang, ts, vx: n(m.vx, -80, 80) || 0, vy: n(m.vy, -80, 80) || 0, vz: n(m.vz, -80, 80) || 0,
          mov: n(m.v, 0, 40) || 0, suelo: !!m.s, vuela: !!m.vu, nada: !!m.na,
          poder: PODERES[m.p] ? m.p : '', giro: !!m.g, baile: !!m.b, escala: n(m.e, 1, 3) || 1};
}
/* una estrella que ganó un amigo: «mundo:estrella» tiene que existir; devuelve true si es nueva */
function recibirEstrella(J, clave){
  if (typeof clave !== 'string') return false;
  const [m, e] = clave.split(':');
  const def = MUNDOS.find(d=>d.id === m);
  if (!def || !def.estrellas.some(x=>x.id === e) || J.prog.estrellas[clave]) return false;
  J.prog.estrellas[clave] = true;
  /* si es del mundo donde estoy, la estrella se vuelve transparente (ya es de todos) */
  if (J.M && J.M.def.id === m){ const s = J.M.estrellas.find(x=>x.id === e); if (s) s.ya = true; }
  return true;
}
/* Tío Juan lleva a Fernando de un salto al lado de un amigo (aunque esté en otro mundo) */
function irConAmigo(J, nv, x, y, z){
  if (J.trans || J.fase !== 'juego' || !Number.isInteger(nv) || nv < 0 || nv >= MUNDOS.length) return false;
  const poner = ()=>{
    const p = J.p;
    p.x = x + 1.2; p.z = z + 0.6; p.y = y + 1.5; p.vx = p.vz = 0; p.vy = 2; p.enSuelo = false; p.sobre = null;
    p.invul = Math.max(p.invul, 1.5);
    const g = suelo(J.M, x, z, y + 1, 0.3);
    if (g.s && !g.s.mov) p.seguro = {x, y: g.y, z};
    J.tio.x = p.x + 1; J.tio.y = p.y + 2; J.tio.z = p.z; J.tio.vx = J.tio.vy = J.tio.vz = 0;
    ev(J, 'llevar', p.x, p.y, p.z);
  };
  if (nv === J.mundo){ poner(); return true; }
  irA(J, nv, null, poner);
  return true;
}

const API = {matar, ARMAS, SUPER, mezclarEstrellas, nuevoEnemigo, FRASES_PJ, SALUDOS, PJS, MAX_JUGADORES, empaquetar, desempaquetar, recibirEstrella, irConAmigo, CFG, PODERES, LISTA_PODERES, QUIEN, FRASES, MUNDOS, crearJuego, empezar, paso, cargarMundo, irA,
             topDe, dentro, suelo, empujar, rng, clamp, lerp, angDif, progresoNuevo, progresoLimpio, cuentaEstrellas, estrellasDe, dar};
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else raiz.F3D = API;
})(typeof window !== 'undefined' ? window : this);
