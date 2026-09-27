(function(){
'use strict';
/* ============================================================
   SALOMÓN Y LOS PRIMOS DEL PUENTE — juego corto en 3D
   Unas nubes negras se robaron el relámpago del Catatumbo y sin
   relámpago no hay feria. Salomón, el Primo Verde y el Mollejúo
   cruzan Maracaibo para devolvérselo a la Chinita del Catatumbo:
     1 · El Saladillo — mandocas pa' la feria y el Primo escondido
     2 · El Puente sobre el Lago — carros, ventarrones y el Mollejúo
     3 · Los palafitos del Catatumbo — tres chispas y el Nublao

   Igual que La Gran Aventura, el archivo tiene dos mitades:
     · el NÚCLEO (niveles, física, personajes, nubes), que no toca
       la pantalla y se prueba con node (node pruebas.js);
     · la VISTA, que lo dibuja con Three.js y el marcador en 2D.
   ============================================================ */
const EN_NAVEGADOR = typeof window !== 'undefined' && typeof document !== 'undefined';

/* ---------------- Voces ----------------
   Las grabaciones viejas de Salomón son las mismas de La Gran Aventura;
   las nuevas se hicieron con Higgsfield (Seed Audio): Salomón con su voz
   clonada y los demás con una voz propia cada uno. Si una frase no tiene
   mp3 (o no carga), la dice la voz del navegador con el tono del personaje. */
const AUDIO_BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Fiy4A0M4MKixWlklbu10QS1hAQ/';
const CLIPS_PJ = {
  salomon: {
    '¡Salomón en la casa!': AUDIO_BASE+'hf_20260906_002518_a0daae9f-c6d4-4f63-9ec6-3f53a5c883bf.mp3',
    '¡Maracaibo, aquí estoy!': AUDIO_BASE+'hf_20260906_002518_8e3f89f9-5d22-4518-9efe-23e27679de79.mp3',
    '¡Mira para arriba, primo! ¡Es el relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041837_3e6ca31f-ecfe-4f73-867f-bcc350973252.mp3',
    '¡Qué molleja! ¡Se me hizo un nudo en la garganta, primo!': AUDIO_BASE+'hf_20260906_002554_b9143e4a-6c02-43f2-be30-c3c4cca9a7b1.mp3',
    '¡El tesoro! ¡Somos ricos!': AUDIO_BASE+'hf_20260906_002554_4f0b108c-e4d9-489c-89fa-0cdd63b0ea9c.mp3',
    '¡Hola! ¡Salomón quiere jugar!': AUDIO_BASE+'hf_20260906_002618_8b70ab41-5972-42e2-8a76-87c5d7a19789.mp3',
    '¡Arepa de agüita de sapo, la mejor!': AUDIO_BASE+'hf_20260906_002518_00f00a30-c3af-4c7b-b809-31b58b36708d.mp3',
    '¡Esta hamburguesa está brutal!': AUDIO_BASE+'hf_20260906_002456_8869de81-bee9-47ad-a736-a5cca06f61fe.mp3',
    /* las nuevas, con la voz de Salomón clonada de «¡Hola! ¡Salomón quiere jugar!» */
    '¡Tranquila, Chinita! Primero recogemos las mandocas pa\' la feria, vos.': AUDIO_BASE+'hf_20260927_201342_2ad969bf-13ac-4cdc-8497-e9fa76163b5d.mp3',
    '¡Salí de ahí, Primo Verde, que te necesito pa\' saltar!': AUDIO_BASE+'hf_20260927_201314_341ebdfc-b5d8-4aec-858c-150dfa025df9.mp3',
    '¡Bienvenido al equipo, Mollejúo!': AUDIO_BASE+'hf_20260927_201315_ad1f05d0-eeea-4a4c-9259-b3acc2830cc6.mp3',
    '¡A la orden, Chinita!': AUDIO_BASE+'hf_20260927_201227_c9a6fe73-8063-4ddf-9751-a027015ae3a4.mp3',
    '¡Ay! ¡Eso dolió, primo!': AUDIO_BASE+'hf_20260927_201342_b0942b77-a9f3-4af1-b48d-23563ac95e3a.mp3',
    '¡Otra chispa! ¡Ya van 2!': AUDIO_BASE+'hf_20260927_201408_01c895e3-7ffe-4c6f-bbd1-6645871a1773.mp3',
    '¡Las tres chispas! ¡Ahora vamos por el Nublao!': AUDIO_BASE+'hf_20260927_201414_b303dbf9-c4f9-4063-b365-8ff240bacad0.mp3',
    '¡Mandocas con queso! ¡Qué molleja de ricas!': AUDIO_BASE+'hf_20260927_201450_ba9193aa-a388-426f-ba92-ff0f559ea5f3.mp3',
    '¡Un patacón maracucho! ¡Es más grande que mi cabeza, vos!': AUDIO_BASE+'hf_20260927_201451_94f711bf-cb45-4703-b565-91c870d2a8e2.mp3',
    '¡Tequeños! ¡El queso se estira hasta allá, vos!': AUDIO_BASE+'hf_20260927_201526_cc00db0c-6d5c-4a4d-9535-c50ca1e9a617.mp3',
    '¡Pastelitos calienticos! ¡Cuidado que queman, vos!': AUDIO_BASE+'hf_20260927_201526_9367283b-b680-448b-b2e0-608fd2693f48.mp3',
    '¡Huevos chimbos! ¡Dulcísimos, vos!': AUDIO_BASE+'hf_20260927_201552_2de8b846-ebb1-4cc1-930a-0657299b4d85.mp3',
    '¡Un cepillado bien frío! ¡Se me congela el cerebro, vos!': AUDIO_BASE+'hf_20260927_201551_a2df38b7-4c32-4422-8bf2-8fc91b5f0e6b.mp3',
  },
  primo: {
    '¡Aquí está el Primo Verde, vos!': AUDIO_BASE+'hf_20260927_201148_859914f2-8586-40b7-89f7-02f6f6d969de.mp3',
    '¡Ay, vergación! ¿Ya se fueron esas nubes? Yo de aquí no me asomo, primo.': AUDIO_BASE+'hf_20260927_201618_b406f229-c573-43a2-b74e-554fffed09be.mp3',
    '¡Está bien, pues! ¡Pero vos vais adelante!': AUDIO_BASE+'hf_20260927_201640_1e39e03a-d9a5-4708-b7c7-2902f9aacfd4.mp3',
    '¡Vamos pa\'l puente, primo!': AUDIO_BASE+'hf_20260927_201648_89b32573-b8fb-43ac-9dae-03999c038369.mp3',
    '¡El Puente sobre el Lago! ¡Pendiente con los carros, que aquí nadie frena, vos!': AUDIO_BASE+'hf_20260927_201716_1c87d9c5-0280-4257-be5d-ab7c59cc1edf.mp3',
    '¡Agarrate, primo, que este ventarrón nos lleva pa\' Cabimas!': AUDIO_BASE+'hf_20260927_201715_2accdd59-b57b-413b-894c-577f4a78b3ee.mp3',
    '¡Patitas pa\' qué te tengo!': AUDIO_BASE+'hf_20260927_201800_28d202b1-dcbb-435a-9c71-73cc281bd4e3.mp3',
    '¡Ay, mamá! ¡Yo sabía que no tenía que venir!': AUDIO_BASE+'hf_20260927_201822_98aefb14-816c-41a5-8433-7ba25abb194f.mp3',
  },
  mollejuo: {
    '¡El Mollejúo llegó con hambre!': AUDIO_BASE+'hf_20260927_201216_f85e93c2-abd7-440d-b117-b1fe697bb008.mp3',
    '¡Epa! ¡De aquí no me muevo hasta que me den un patacón, vos!': AUDIO_BASE+'hf_20260927_201829_1926af0a-7e2c-410f-b7ec-2aab9257022c.mp3',
    '¡Traeme algo de comer, mi hermano, que tengo la barriga pegada al espinazo!': AUDIO_BASE+'hf_20260927_201847_bf781b66-70ce-4ca4-b4aa-3d954f3d33a9.mp3',
    '¡Qué molleja de patacón! ¡Ahora sí, vamos pa\'l Catatumbo!': AUDIO_BASE+'hf_20260927_201856_9eae9a65-149b-4635-8504-a2e0dc5ee2fb.mp3',
    '¡Apártense, que ahí va panza!': AUDIO_BASE+'hf_20260927_201932_916fab3a-47c6-4c17-babd-64035160e1d3.mp3',
    '¡Del otro lado del puente ya se ven los palafitos, vos!': AUDIO_BASE+'hf_20260927_201932_bd779c59-c3c8-4723-9d8b-da3b28872b69.mp3',
    '¡Ahora sí, a comer mandocas en la feria, vos!': AUDIO_BASE+'hf_20260927_202012_98115795-701b-48f7-91c9-4d4838005f88.mp3',
    '¡Panzazo!': AUDIO_BASE+'hf_20260927_202012_34dd8209-95a5-4a00-8f2e-4c37d646f221.mp3',
    '¡Epa, más respeto con la panza!': AUDIO_BASE+'hf_20260927_202042_135a66a1-8874-473a-89db-865e6d3ecfbf.mp3',
    '¡Eso no me llenó ni una muela, vos!': AUDIO_BASE+'hf_20260927_202043_f2671cf7-e3ff-4423-8036-31e638e2aaaf.mp3',
  },
  chinita: {
    '¡Muchachos! Unas nubes negras se robaron el relámpago del Catatumbo. ¡Sin relámpago no hay feria!': AUDIO_BASE+'hf_20260927_202111_1d524f01-998c-492f-a86c-cfe6245731bd.mp3',
    'Las nubes escondieron tres chispas del relámpago en los palafitos. ¡Búsquenlas, mis muchachos!': AUDIO_BASE+'hf_20260927_201147_0d61ea84-de1b-4563-a93d-598321f648f5.mp3',
    '¡Gracias, mis muchachos! ¡El Catatumbo vuelve a brillar y la feria se prende!': AUDIO_BASE+'hf_20260927_202108_81ce1311-f1c7-41e7-bdb3-fc71bec9be12.mp3',
  },
  nublao: {
    '¡Jua, jua, jua! ¡El relámpago es mío y el lago se queda a oscuras!': AUDIO_BASE+'hf_20260927_201147_83b8f327-ec3b-427c-a18c-e002cce24fc3.mp3',
    '¡Ay, no! ¡Me desinflaron como un globo!': AUDIO_BASE+'hf_20260927_202136_a314d890-f57f-44ba-8188-5ccf3dee2a45.mp3',
  },
};
const TONO_PJ = {
  salomon:{pitch:1.5, rate:1.1}, primo:{pitch:1.25, rate:1.2}, mollejuo:{pitch:0.6, rate:0.95},
  chinita:{pitch:1.35, rate:0.95}, nublao:{pitch:0.3, rate:0.8}, vecino:{pitch:1.0, rate:1.15},
};
const NOMBRES = {salomon:'Salomón', primo:'El Primo Verde', mollejuo:'El Mollejúo', chinita:'La Chinita del Catatumbo', nublao:'El Nublao', vecino:'Un maracucho'};

/* ---------------- Diálogos ----------------
   Los de comer vienen de La Gran Aventura (los mcbo*: comer en Maracaibo);
   el resto son de este juego. */
const COMER = {
  mandoca: '¡Mandocas con queso! ¡Qué molleja de ricas!',
  patacon: '¡Un patacón maracucho! ¡Es más grande que mi cabeza, vos!',
  tequeno: '¡Tequeños! ¡El queso se estira hasta allá, vos!',
  pastelito: '¡Pastelitos calienticos! ¡Cuidado que queman, vos!',
  huevoChimbo: '¡Huevos chimbos! ¡Dulcísimos, vos!',
  cepillado: '¡Un cepillado bien frío! ¡Se me congela el cerebro, vos!',
};
const TIPOS_COMIDA = ['mandoca', 'patacon', 'tequeno', 'pastelito', 'huevoChimbo', 'cepillado'];
const DIALOGOS = {
  intro1: [
    ['chinita', '¡Muchachos! Unas nubes negras se robaron el relámpago del Catatumbo. ¡Sin relámpago no hay feria!'],
    ['salomon', '¡Salomón en la casa!'],
    ['salomon', '¡Tranquila, Chinita! Primero recogemos las mandocas pa\' la feria, vos.'],
  ],
  primoEscondido: [
    ['primo', '¡Ay, vergación! ¿Ya se fueron esas nubes? Yo de aquí no me asomo, primo.'],
    ['salomon', '¡Salí de ahí, Primo Verde, que te necesito pa\' saltar!'],
    ['primo', '¡Está bien, pues! ¡Pero vos vais adelante!'],
  ],
  fin1: [['salomon', '¡Maracaibo, aquí estoy!'], ['primo', '¡Vamos pa\'l puente, primo!']],
  intro2: [['primo', '¡El Puente sobre el Lago! ¡Pendiente con los carros, que aquí nadie frena, vos!']],
  viento: [['primo', '¡Agarrate, primo, que este ventarrón nos lleva pa\' Cabimas!']],
  mollejuoPide: [['mollejuo', '¡Epa! ¡De aquí no me muevo hasta que me den un patacón, vos!']],
  mollejuoSinComida: [['mollejuo', '¡Traeme algo de comer, mi hermano, que tengo la barriga pegada al espinazo!']],
  mollejuoCome: [
    ['mollejuo', '¡Qué molleja de patacón! ¡Ahora sí, vamos pa\'l Catatumbo!'],
    ['salomon', '¡Bienvenido al equipo, Mollejúo!'],
  ],
  gandola: [['mollejuo', '¡Apártense, que ahí va panza!']],
  fin2: [['mollejuo', '¡Del otro lado del puente ya se ven los palafitos, vos!']],
  intro3: [
    ['chinita', 'Las nubes escondieron tres chispas del relámpago en los palafitos. ¡Búsquenlas, mis muchachos!'],
    ['salomon', '¡A la orden, Chinita!'],
  ],
  chispa: [['salomon', '¡El tesoro! ¡Somos ricos!']],
  nublao: [['nublao', '¡Jua, jua, jua! ¡El relámpago es mío y el lago se queda a oscuras!']],
  nublaoCae: [['nublao', '¡Ay, no! ¡Me desinflaron como un globo!']],
  final: [
    ['chinita', '¡Gracias, mis muchachos! ¡El Catatumbo vuelve a brillar y la feria se prende!'],
    ['salomon', '¡Mira para arriba, primo! ¡Es el relámpago del Catatumbo!'],
    ['mollejuo', '¡Ahora sí, a comer mandocas en la feria, vos!'],
    ['salomon', '¡Qué molleja! ¡Se me hizo un nudo en la garganta, primo!'],
  ],
};
const SALUDO = {
  salomon: '¡Hola! ¡Salomón quiere jugar!',
  primo: '¡Aquí está el Primo Verde, vos!',
  mollejuo: '¡El Mollejúo llegó con hambre!',
};
const PODER_DICE = {primo: '¡Patitas pa\' qué te tengo!', mollejuo: '¡Panzazo!'};
const AY = {salomon: '¡Ay! ¡Eso dolió, primo!', primo: '¡Ay, mamá! ¡Yo sabía que no tenía que venir!', mollejuo: '¡Epa, más respeto con la panza!'};
const MOLLEJUO_COME = '¡Eso no me llenó ni una muela, vos!';

/* ============================================================
   NÚCLEO — no toca la pantalla
   ============================================================ */
const DT = 1/60, GRAV = 24, R = 0.4, ALTO = 1.5;
const clamp = (v,a,b)=>v<a?a:v>b?b:v;
const lerp = (a,b,t)=>a+(b-a)*t;

/* los tres jugables: el salto marca a dónde llega cada uno (v²/2g)
   Salomón ≈ 1,7 m · el Primo ≈ 3,3 m · el Mollejúo ≈ 1,2 m */
const PJS = {
  salomon: {vel: 6.2, salto: 9, poder: 'pedrada'},
  primo: {vel: 6.6, salto: 12.5, poder: 'carrerita'},
  mollejuo: {vel: 5.2, salto: 7.5, poder: 'panzazo'},
};
const alturaSalto = pj => PJS[pj].salto*PJS[pj].salto/(2*GRAV);

/* una caja del mundo: de x0 a x1, de z0 a z1 y de y0 a y1 */
function caja(x0, x1, z0, z1, y0, y1, o){
  return Object.assign({x0: Math.min(x0,x1), x1: Math.max(x0,x1), z0: Math.min(z0,z1), z1: Math.max(z0,z1), y0, y1, solido: true, color: '#999', tipo: 'bloque'}, o||{});
}
const comida = (x, y, z, i)=>({x, y: y + 0.6, z, tipo: TIPOS_COMIDA[i % TIPOS_COMIDA.length], vivo: true});
const nube = (x, y, z, amp, vel, o)=>Object.assign({x0: x, x, y0: y, y, z, amp, vel, fase: (x*7 + z*3) % 6.28, vivo: true, hp: 1, r: 0.9}, o||{});

/* ---------------- Nivel 1: El Saladillo ---------------- */
function nivelSaladillo(){
  const c = [], colores = ['#ff6b6b','#ffd23f','#4fc3f7','#7dffa0','#ff9ed6','#ffa94d','#b197fc','#63e6be'];
  c.push(caja(-8, 8, -205, 8, -1, 0, {color: '#c2a878', tipo: 'piso'}));
  /* las casas de colores del Saladillo a los dos lados: no dejan salirse de la calle */
  for (let i = 0; i < 26; i++){
    const z1 = 8 - i*8, z0 = z1 - 8, h = 4.5 + (i % 3)*0.8;
    c.push(caja(-12, -8, z0, z1, 0, h, {color: colores[i % 8], tipo: 'casa', lado: 1}));
    c.push(caja(8, 12, z0, z1, 0, h, {color: colores[(i+3) % 8], tipo: 'casa', lado: -1}));
  }
  c.push(caja(-8, 8, 7, 9, 0, 5, {solido: true, visible: false}));
  /* huacales de refresco para ir saltando */
  c.push(caja(-3.6, -2.4, -20.6, -19.4, 0, 1.2, {color: '#e03131', tipo: 'huacal'}));
  c.push(caja(3.4, 4.6, -35.6, -34.4, 0, 1.0, {color: '#e03131', tipo: 'huacal'}));
  c.push(caja(-5.6, -4.4, -50.6, -49.4, 0, 1.1, {color: '#e03131', tipo: 'huacal'}));
  c.push(caja(-5.6, -4.4, -51.8, -50.6, 0, 2.2, {color: '#1971c2', tipo: 'huacal'}));
  /* los pipotes donde se esconde el Primo */
  for (const x of [3.2, 4.4, 5.6, 6.8]) c.push(caja(x-0.5, x+0.5, -73.5, -72.5, 0, 1.3, {color: '#2b8a3e', tipo: 'pipote'}));
  /* el muro de la plaza: 2,6 m, solo lo salta el Primo */
  c.push(caja(-8, 8, -205, -125, 0, 2.6, {color: '#c9a36b', tipo: 'muro'}));
  c.push(caja(3, 6, -150.6, -149.4, 2.6, 3.8, {color: '#e03131', tipo: 'huacal'}));
  const com = [
    [0,0,-10],[3,0,-15],[-3,1.2,-20],[-6,0,-28],[4,1.0,-35],[0,0,-45],[-5,2.2,-51.2],[6,0,-60],
    [-2,0,-68],[2,0,-85],[-4,0,-95],[5,0,-110],[-6,0,-118],[0,2.6,-140],[4.5,3.8,-150],[-4,2.6,-165],[3,2.6,-178],
  ].map((p,i)=>comida(p[0], p[1], p[2], i));
  return {
    id: 1, nombre: 'El Saladillo', sub: 'Recoge 8 comidas pa\' la feria y encuentra al Primo Verde',
    cielo: '#7cc8ff', niebla: '#bfe6ff', noche: false,
    cajas: c, comidas: com, chispas: [],
    nubes: [nube(0,1.4,-30,4,1.1), nube(-3,1.3,-57,3,1.4), nube(2,1.5,-90,5,1.0), nube(-2,1.3,-104,4,1.3), nube(0,4.1,-155,5,1.2), nube(2,4.0,-172,4,1.5)],
    aliados: [{pj: 'primo', x: 5, y: 0, z: -75.5, unido: false, radio: 3, dialogo: 'primoEscondido'}],
    chinita: {x: -2.5, y: 0, z: -4},
    banderas: [{x: -7, z: -62, y: 0}, {x: -7, z: -121, y: 0}, {x: -7, z: -132, y: 2.6}],
    meta: {z: -192, y: 2.6, necesita: G=>G.comida >= 8 ? null : '¡Nos faltan comidas pa\' la feria! Llevamos '+G.comida+' de 8'},
    intro: 'intro1', fin: 'fin1', inicio: {x: 0, y: 0, z: 2},
    avisos: [{z0: -128, z1: -118, x0: -8, x1: 8, noPj: 'primo', clave: 'muro', texto: '¡Muy alto! Cambia al Primo Verde con 👥 y salta'}],
  };
}

/* ---------------- Nivel 2: El Puente sobre el Lago ---------------- */
function nivelPuente(){
  const c = [];
  c.push(caja(-9, 9, -290, 8, -1, 0, {color: '#5c636e', tipo: 'asfalto'}));
  /* el hombrillo donde el Mollejúo empuja la gandola */
  c.push(caja(9, 24, -266, -244, -1, 0, {color: '#5c636e', tipo: 'asfalto'}));
  /* barandas (se ven) y paredes invisibles altas (para no caer al lago) */
  const pared = (x0,x1,z0,z1)=>c.push(caja(x0,x1,z0,z1,0,9,{visible:false}));
  pared(-9.8, -9, -290, 8); pared(9, 9.8, -244, 8); pared(9, 9.8, -290, -266);
  pared(9, 24, -266.8, -266); pared(9, 24, -244, -243.2); pared(24, 24.8, -266, -244);
  pared(-9, 9, 8, 9);
  /* las torres, en la isla del medio: entre ellas y los carros queda un pasillito */
  for (const z of [-60, -140, -200]) c.push(caja(-0.7, 0.7, z-1.5, z+1.5, 0, 22, {color: '#e9ecef', tipo: 'pilon'}));
  /* el Mollejúo tapa el paso con los carros atascados */
  c.push(caja(-9, 9, -124, -122, 0, 9, {visible: false, id: 'barreraMollejuo'}));
  c.push(caja(-8.5, -4, -124, -120, 0, 1.6, {color: '#f08c00', tipo: 'carroParado'}));
  c.push(caja(4, 8.5, -124, -120, 0, 1.6, {color: '#1c7ed6', tipo: 'carroParado'}));
  /* la gandola: bien alta (ni el Primo la salta); solo el panzazo la mueve */
  c.push(caja(-8.5, 8.5, -257, -253, 0, 3.8, {color: '#c92a2a', tipo: 'gandola', id: 'gandola', empujable: {dx: 13}}));
  const com = [[-2,0,-15],[5,0,-38],[-6,0,-70],[2,0,-95],[-4,0,-112],[6,0,-150],[-5,0,-185],[3,0,-230],[-3,0,-270]].map((p,i)=>comida(p[0],p[1],p[2],i+1));
  /* los carros: en los dos tramos con tráfico; los de la izquierda vienen de frente */
  const carros = [];
  const colores = ['#f03e3e','#fab005','#1c7ed6','#f8f9fa','#37b24d','#ae3ec9','#212529','#ff922b'];
  let k = 0;
  for (const tramo of [{z0: -112, z1: -8}, {z0: -240, z1: -132}]){
    for (const carril of [{x: -6.8, v: 9}, {x: -3, v: 7}, {x: 3, v: -5}, {x: 6.8, v: -6}]){
      for (let j = 0; j < 3; j++){
        const L = tramo.z1 - tramo.z0;
        carros.push({x: carril.x, z: tramo.z0 + ((j/3 + (k*0.37 % 1)*0.2) % 1)*L, vz: carril.v, z0: tramo.z0, z1: tramo.z1, largo: 4, ancho: 2, alto: 1.5, color: colores[k % colores.length]});
        k++;
      }
    }
  }
  return {
    id: 2, nombre: 'El Puente sobre el Lago', sub: 'Cruza el puente y consigue al Mollejúo',
    cielo: '#ffb870', niebla: '#ffd9a8', noche: false, lago: true,
    cajas: c, comidas: com, chispas: [], carros,
    nubes: [nube(0,1.5,-48,6,1.0), nube(4,1.4,-176,5,1.3), nube(-4,1.5,-215,5,1.1)],
    aliados: [{pj: 'mollejuo', x: 0, y: 0, z: -119, unido: false, radio: 4.5, pide: true, grande: true}],
    banderas: [{x: -8, z: -60, y: 0}, {x: -8, z: -116, y: 0}, {x: -8, z: -128, y: 0}, {x: -8, z: -243, y: 0}],
    meta: {z: -282, y: 0},
    viento: {tramos: [[-112, -8], [-240, -132]], periodo: 8, dura: 2.2, fuerza: 3.4},
    intro: 'intro2', fin: 'fin2', inicio: {x: 0, y: 0, z: 3},
    avisos: [
      {z0: -262, z1: -249, x0: -9, x1: 9, noPj: 'mollejuo', clave: 'gandola', texto: '¡Una gandola! Cambia al Mollejúo con 👥 y dale un panzazo (B)', siCaja: 'gandola'},
      {z0: -262, z1: -249, x0: -9, x1: 9, siPj: 'mollejuo', clave: 'gandolaB', texto: '¡Pégate a la gandola y dale un panzazo con B!', siCaja: 'gandola'},
    ],
  };
}

/* ---------------- Nivel 3: Los palafitos del Catatumbo ---------------- */
function nivelCatatumbo(){
  const c = [], Y = 0.5;
  const piso = (x0,x1,z0,z1)=>c.push(caja(x0,x1,z0,z1,-0.6,Y,{color:'#a0703c', tipo:'tablas'}));
  piso(-4, 4, -10, 6);          /* el muelle */
  piso(-0.8, 0.8, -18, -10);    /* tabla */
  piso(-7, 7, -32, -18);        /* palafito A */
  piso(-0.8, 0.8, -42, -32);
  piso(-9, 9, -62, -42);        /* palafito B */
  piso(-0.8, 0.8, -74, -62);
  piso(-8, 8, -96, -74);        /* palafito C */
  piso(-0.8, 0.8, -106, -96);
  piso(-13, 13, -138, -106);    /* la plaza del Nublao */
  /* A: la casa del techo alto (solo el Primo llega al techo) */
  c.push(caja(-6, -1, -29, -23, Y, 3.2, {color: '#ff8787', tipo: 'casa', lado: 0}));
  /* C: la casita tapada por el cayuco (solo el panzazo lo mueve) */
  c.push(caja(-6, -2, -91, -84, Y, 2.8, {color: '#74c0fc', tipo: 'casa', lado: 0}));
  c.push(caja(2, 6, -91, -84, Y, 2.8, {color: '#74c0fc', tipo: 'casa', lado: 0}));
  c.push(caja(-6, 6, -93, -91, Y, 2.8, {color: '#74c0fc', tipo: 'casa', lado: 0}));
  c.push(caja(-6, 6, -93, -84, 2.8, 3.3, {color: '#e9ecef', tipo: 'techo'}));
  c.push(caja(-2, 2, -84, -82.8, Y, 2.8, {color: '#8d5524', tipo: 'cayuco', id: 'cayuco', empujable: {dx: 5.5}}));
  const com = [[2,Y,-5],[-3,Y,-20],[4,Y,-30],[-6,Y,-46],[6,Y,-58],[-5,Y,-78],[5,Y,-94]].map((p,i)=>comida(p[0],p[1],p[2],i+2));
  return {
    id: 3, nombre: 'Los palafitos del Catatumbo', sub: 'Busca las 3 chispas y derrota al Nublao',
    cielo: '#1d1b3a', niebla: '#2c2a55', noche: true, lago: true, caida: -3,
    cajas: c, comidas: com,
    chispas: [
      {x: -3.5, y: 3.2 + 0.7, z: -26, vivo: true},
      {x: 0, y: 6.2, z: -52, vivo: true, oculta: true, caeA: Y + 0.7},
      {x: 0, y: Y + 0.7, z: -87.5, vivo: true},
    ],
    nubes: [
      nube(0, 6.2, -52, 3, 0.6, {grande: true, hp: 3, r: 1.8}),
      nube(3, 1.9, -38, 2.5, 1.4), nube(-4, 1.9, -66, 3, 1.2), nube(0, 1.9, -80, 4, 1.4),
      nube(0, 7.5, -126, 7, 0.55, {jefe: true, hp: 6, r: 2.6, dormido: true}),
    ],
    aliados: [],
    banderas: [{x: 5, z: -20, y: Y}, {x: 7, z: -44, y: Y}, {x: 6, z: -76, y: Y}, {x: 10, z: -108, y: Y}],
    meta: null,
    reja: {z: -97, necesita: G=>G.chispas >= 3 ? null : '¡Faltan chispas! Llevamos '+G.chispas+' de 3'},
    intro: 'intro3', inicio: {x: 0, y: Y, z: 3},
    avisos: [
      {z0: -30, z1: -21, x0: -7, x1: 1, noPj: 'primo', clave: 'techo', texto: '¡La chispa está en el techo! Solo el Primo Verde salta tan alto 👥', siChispa: 0},
      {z0: -62, z1: -42, x0: -9, x1: 9, noPj: 'salomon', clave: 'nubeG', texto: '¡Esa nube está muy alta! Las pedradas de Salomón (B) sí llegan 👥', siNube: 0},
      {z0: -86, z1: -78, x0: -4, x1: 4, noPj: 'mollejuo', clave: 'cayuco', texto: '¡Un cayuco tapa la casita! El panzazo del Mollejúo lo mueve 👥', siCaja: 'cayuco'},
      {z0: -138, z1: -106, x0: -13, x1: 13, noPj: 'salomon', clave: 'jefe', texto: '¡Solo las pedradas de Salomón llegan hasta el Nublao! 👥', siNube: 4},
    ],
  };
}
const NIVELES = [nivelSaladillo, nivelPuente, nivelCatatumbo];

/* ---------------- La partida ---------------- */
function crearPartida(n, previo, opts){
  const N = NIVELES[n]();
  opts = opts || {};
  const unidos = previo ? previo.equipo.slice() : ['salomon', 'primo', 'mollejuo'].slice(0, n+1);
  const G = {
    n, N, t: 0, fase: 'jugando', finT: 0, eventos: [],
    equipo: unidos, comida: previo ? previo.comida : (n===1 ? 2 : 0), chispas: 0,
    puntos: previo ? previo.puntos : 0, comidoTotal: previo ? previo.comidoTotal : 0, nubesVencidas: previo ? previo.nubesVencidas : 0,
    J: {x: N.inicio.x, y: N.inicio.y, z: N.inicio.z, vx: 0, vy: 0, vz: 0, fx: 0, fz: -1, suelo: true, pj: unidos.includes(opts.pj) ? opts.pj : unidos[0],
        coyote: 0, buffer: 0, stun: 0, invul: 0, turbo: 0, cd: 0, panza: 0, anda: 0},
    respawn: {x: N.inicio.x, y: N.inicio.y, z: N.inicio.z}, bandera: -1,
    rastro: [], proyectiles: [], rayos: [], avisados: {}, dichos: {}, comidoTipo: {},
    rayoT: 2, reloj: 0, jefeActivo: false, finalT: 0,
  };
  for (const a of N.aliados) if (G.equipo.includes(a.pj)){ a.unido = true; if (a.pide){ const b = cajaId(G, 'barreraMollejuo'); if (b) b.solido = false; } }
  if (N.intro) conversar(G, N.intro);
  return G;
}
function evento(G, tipo, datos){ G.eventos.push(Object.assign({tipo}, datos||{})); }
function hablar(G, pj, texto){ evento(G, 'hablar', {pj, texto, quien: NOMBRES[pj]}); }
function conversar(G, clave){ for (const [pj, t] of DIALOGOS[clave]) hablar(G, pj, t); }
/* un aviso en pantalla; no se repite antes de "cada" segundos */
function avisar(G, clave, texto, cada){
  const u = G.avisados[clave];
  if (u !== undefined && G.t - u < (cada || 6)) return false;
  G.avisados[clave] = G.t; evento(G, 'aviso', {texto}); return true;
}
function cajaId(G, id){ return G.N.cajas.find(b=>b.id===id); }

/* ---- física: el jugador es una caja de 0,8 × 1,5 × 0,8 que choca con las cajas del mundo ---- */
function tocaXZ(J, b){ return J.x+R > b.x0 && J.x-R < b.x1 && J.z+R > b.z0 && J.z-R < b.z1; }
function moverEje(G, eje, d){
  if (!d) return;
  const J = G.J;
  J[eje] += d;
  for (const b of G.N.cajas){
    if (!b.solido || J.y >= b.y1 - 0.001 || J.y + ALTO <= b.y0 || !tocaXZ(J, b)) continue;
    /* escalones bajitos se suben solos */
    if (b.y1 - J.y <= 0.35 && J.suelo && !cabezaChoca(G, J.x, J.z, b.y1)){ J.y = b.y1; continue; }
    if (eje==='x'){ J.x = d > 0 ? b.x0 - R - 0.0005 : b.x1 + R + 0.0005; J.vx = 0; }
    else { J.z = d > 0 ? b.z0 - R - 0.0005 : b.z1 + R + 0.0005; J.vz = 0; }
    J.choco = b;
  }
}
function cabezaChoca(G, x, z, y){
  for (const b of G.N.cajas) if (b.solido && y + ALTO > b.y0 && y < b.y0 && x+R > b.x0 && x-R < b.x1 && z+R > b.z0 && z-R < b.z1) return true;
  return false;
}
function moverY(G, d){
  const J = G.J, antes = J.y;
  J.y += d; J.suelo = false;
  for (const b of G.N.cajas){
    if (!b.solido || !tocaXZ(J, b)) continue;
    if (d <= 0 && antes >= b.y1 - 0.02 && J.y < b.y1){ J.y = b.y1; J.vy = 0; J.suelo = true; J.sobre = b; }
    else if (d > 0 && antes + ALTO <= b.y0 + 0.02 && J.y + ALTO > b.y0){ J.y = b.y0 - ALTO; J.vy = 0; }
  }
}
function golpe(G, desdeX, desdeZ, fuerza){
  const J = G.J;
  if (J.invul > 0) return false;
  let dx = J.x - desdeX, dz = J.z - desdeZ; const m = Math.hypot(dx, dz) || 1; dx /= m; dz /= m;
  J.vx = dx*(fuerza||7); J.vz = dz*(fuerza||7); J.vy = 6; J.stun = 0.45; J.invul = 1.6;
  evento(G, 'golpe', {x: J.x, y: J.y, z: J.z});
  if (!G.dichos.ay || G.t - G.dichos.ay > 7){ G.dichos.ay = G.t; hablar(G, J.pj, AY[J.pj]); }
  return true;
}
function reaparecer(G){
  const J = G.J;
  J.x = G.respawn.x; J.y = G.respawn.y + 0.05; J.z = G.respawn.z; J.vx = J.vy = J.vz = 0; J.invul = 1.5;
  G.rastro.length = 0;
  evento(G, 'reaparece', {});
}

/* ---- los poderes (B) ---- */
function usarPoder(G){
  const J = G.J;
  if (J.cd > 0 || J.stun > 0) return;
  const poder = PJS[J.pj].poder;
  if (poder==='pedrada'){
    J.cd = 0.38;
    /* apunta sola a la nube más cercana que tenga por delante */
    let obj = null, mejor = 1e9;
    G.N.nubes.forEach((n, i)=>{
      if (!n.vivo || n.dormido) return;
      const dx = n.x - J.x, dz = n.z - J.z, d = Math.hypot(dx, dz), frente = (dx*J.fx + dz*J.fz)/(d||1);
      const alcance = n.jefe || n.grande ? 22 : 16;
      if (d > alcance || (frente < 0.2 && d > 5)) return;
      const nota = d - frente*4;
      if (nota < mejor){ mejor = nota; obj = i; }
    });
    G.proyectiles.push({x: J.x + J.fx*0.5, y: J.y + 1.1, z: J.z + J.fz*0.5, vx: J.fx*16, vy: 4, vz: J.fz*16, vida: 2.2, obj});
    evento(G, 'pedrada', {});
  } else if (poder==='carrerita'){
    J.cd = 2; J.turbo = 1.3;
    evento(G, 'carrerita', {});
    if (!G.dichos.carrerita || G.t - G.dichos.carrerita > 10){ G.dichos.carrerita = G.t; hablar(G, 'primo', PODER_DICE.primo); }
  } else if (poder==='panzazo'){
    J.cd = 0.8; J.panza = 0.5;
    evento(G, 'panzazo', {x: J.x, y: J.y, z: J.z});
    for (const n of G.N.nubes){
      if (!n.vivo || n.jefe || n.grande) continue;
      if (Math.hypot(n.x - J.x, n.z - J.z) < 3 && Math.abs(n.y - (J.y + 0.8)) < 2.2) vencerNube(G, n);
    }
    for (const b of G.N.cajas){
      if (!b.empujable || b.empujado) continue;
      const cx = clamp(J.x, b.x0, b.x1), cz = clamp(J.z, b.z0, b.z1);
      if (Math.hypot(J.x - cx, J.z - cz) < R + 1.9 && J.y < b.y1){
        b.empujado = {falta: b.empujable.dx, vel: b.empujable.dx/1.4};
        evento(G, 'empuja', {id: b.id});
        if (b.id==='gandola') conversar(G, 'gandola');
      }
    }
    if (!G.dichos.panza || G.t - G.dichos.panza > 9){ G.dichos.panza = G.t; hablar(G, 'mollejuo', PODER_DICE.mollejuo); }
  }
}
function cambiarPj(G){
  const J = G.J;
  if (G.equipo.length < 2) { avisar(G, 'solo', 'Todavía no hay a quién cambiar: ¡busca a los primos!', 5); return; }
  const i = G.equipo.indexOf(J.pj);
  J.pj = G.equipo[(i+1) % G.equipo.length];
  J.turbo = 0; J.panza = 0; J.cd = 0.15;
  evento(G, 'cambio', {pj: J.pj});
  if (!G.dichos['saludo'+J.pj] || G.t - G.dichos['saludo'+J.pj] > 12){ G.dichos['saludo'+J.pj] = G.t; hablar(G, J.pj, SALUDO[J.pj]); }
}
function vencerNube(G, n){
  n.vivo = false; G.nubesVencidas++; G.puntos += n.jefe ? 2000 : n.grande ? 500 : 100;
  evento(G, 'nubeVencida', {x: n.x, y: n.y, z: n.z, grande: !!(n.grande || n.jefe)});
  if (n.grande){ const ch = G.N.chispas.find(c=>c.oculta); if (ch){ ch.oculta = false; ch.x = n.x; ch.y = n.y; ch.z = n.z; ch.cae = true; } }
  if (n.jefe){ conversar(G, 'nublaoCae'); G.fase = 'final'; G.finalT = 0; G.rayos.length = 0; conversar(G, 'final'); evento(G, 'relampagos', {}); }
}

/* ---- un paso de la partida: ent = {jx, jy (−1…1), saltar (sostenido), saltoPulsado, poder, cambiar} ---- */
function paso(G, ent){
  ent = ent || {};
  const N = G.N, J = G.J, dt = DT;
  G.t += dt;
  if (G.fase==='nivelListo' || G.fase==='fin'){ G.finT += dt; return; }
  if (G.fase==='final'){
    G.finalT += dt;
    J.vx *= 0.8; J.vz *= 0.8;
    if (G.finalT > 11){ G.fase = 'fin'; G.finT = 0; evento(G, 'fin', {}); }
  }
  const P = PJS[J.pj];
  J.cd = Math.max(0, J.cd - dt); J.invul = Math.max(0, J.invul - dt); J.stun = Math.max(0, J.stun - dt);
  J.turbo = Math.max(0, J.turbo - dt); J.panza = Math.max(0, J.panza - dt);
  const jugando = G.fase==='jugando';
  if (jugando && ent.cambiar) cambiarPj(G);
  if (jugando && ent.poder) usarPoder(G);
  /* moverse: la palanca mueve en el mundo (arriba = hacia adelante, que es −z) */
  let jx = clamp(ent.jx||0, -1, 1), jy = clamp(ent.jy||0, -1, 1);
  const m = Math.hypot(jx, jy); if (m > 1){ jx /= m; jy /= m; }
  if (!jugando || J.stun > 0){ jx = 0; jy = 0; }
  const vel = P.vel*(J.turbo > 0 ? 1.7 : 1);
  const acel = J.suelo ? 14 : 7;
  if (J.stun <= 0){
    J.vx += (jx*vel - J.vx)*Math.min(1, acel*dt);
    J.vz += (-jy*vel - J.vz)*Math.min(1, acel*dt);
  } else { J.vx *= 0.97; J.vz *= 0.97; }
  if (Math.hypot(jx, jy) > 0.15){ const k = Math.hypot(jx, jy); J.fx = jx/k; J.fz = -jy/k; }
  J.anda = Math.hypot(J.vx, J.vz);
  /* saltar: con un poquito de margen al borde (coyote) y al apretar antes de caer */
  J.coyote = J.suelo ? 0.1 : Math.max(0, J.coyote - dt);
  J.buffer = ent.saltoPulsado && jugando ? 0.12 : Math.max(0, J.buffer - dt);
  if (J.buffer > 0 && J.coyote > 0 && J.stun <= 0){
    J.vy = P.salto; J.suelo = false; J.coyote = 0; J.buffer = 0;
    evento(G, 'salto', {pj: J.pj});
  }
  if (!ent.saltar && J.vy > 0 && !J.stun) J.vy -= GRAV*dt*1.2;   /* soltar temprano = salto más bajito */
  J.vy -= GRAV*dt;
  if (J.vy < -30) J.vy = -30;
  /* el ventarrón del puente */
  let vientoX = 0;
  if (N.viento){
    const fase = G.t % N.viento.periodo, dentro = N.viento.tramos.some(([a, b])=>J.z > a && J.z < b);
    const sopla = fase > N.viento.periodo - N.viento.dura;
    const dir = Math.floor(G.t / N.viento.periodo) % 2 ? 1 : -1;
    G.soplando = sopla ? dir : 0;
    if (sopla && dentro){
      vientoX = dir*N.viento.fuerza;
      if (!G.dichos.viento){ G.dichos.viento = G.t; conversar(G, 'viento'); }
    }
  }
  J.choco = null;
  moverEje(G, 'x', (J.vx + vientoX)*dt);
  moverEje(G, 'z', J.vz*dt);
  moverY(G, J.vy*dt);
  /* se cayó al lago (o de la calle): vuelve a la última bandera, sin castigo */
  if (J.y < (N.caida !== undefined ? N.caida : -6)){ evento(G, 'chapuzon', {x: J.x, z: J.z}); reaparecer(G); }
  /* el rastro que siguen los primos */
  G.rastro.unshift({x: J.x, y: J.y, z: J.z, anda: J.anda});
  if (G.rastro.length > 90) G.rastro.length = 90;

  /* las cajas que se empujan */
  for (const b of N.cajas){
    if (!b.empujado || b.empujado.falta <= 0) continue;
    const d = Math.min(b.empujado.falta, b.empujado.vel*dt);
    b.x0 += d; b.x1 += d; b.empujado.falta -= d;
    if (b.empujado.falta <= 0) b.movido = true;
  }
  /* las banderas: al pasarlas se guarda el sitio */
  N.banderas.forEach((f, i)=>{
    if (i > G.bandera && J.z < f.z && Math.abs(J.y - f.y) < 1.5){
      G.bandera = i; G.respawn = {x: clamp(J.x, -3, 3), y: f.y, z: f.z - 1};
      evento(G, 'bandera', {i});
    }
  });
  /* comidas */
  for (const c of N.comidas){
    if (!c.vivo) continue;
    if (Math.hypot(c.x - J.x, c.z - J.z) < 0.95 && c.y > J.y - 0.3 && c.y < J.y + ALTO + 0.5){
      c.vivo = false; G.comida++; G.comidoTotal++; G.puntos += 50;
      evento(G, 'come', {tipo: c.tipo, x: c.x, y: c.y, z: c.z});
      const primera = !G.comidoTipo[c.tipo];
      G.comidoTipo[c.tipo] = (G.comidoTipo[c.tipo]||0) + 1;
      if (primera || !G.dichos.come || G.t - G.dichos.come > 14){
        G.dichos.come = G.t;
        hablar(G, J.pj, J.pj==='mollejuo' && !primera ? MOLLEJUO_COME : COMER[c.tipo]);
      }
    }
  }
  /* chispas del relámpago */
  for (const ch of N.chispas){
    if (!ch.vivo || ch.oculta) continue;
    if (ch.cae){ ch.y = Math.max(ch.caeA, ch.y - 5*dt); if (ch.y <= ch.caeA) ch.cae = false; }
    if (Math.hypot(ch.x - J.x, ch.z - J.z) < 1.1 && ch.y > J.y - 0.3 && ch.y < J.y + ALTO + 0.6){
      ch.vivo = false; G.chispas++; G.puntos += 1000;
      evento(G, 'chispa', {n: G.chispas, x: ch.x, y: ch.y, z: ch.z});
      if (G.chispas===1) conversar(G, 'chispa');
      else hablar(G, 'salomon', G.chispas===3 ? '¡Las tres chispas! ¡Ahora vamos por el Nublao!' : '¡Otra chispa! ¡Ya van 2!');
    }
  }
  /* los primos que se unen */
  for (const a of N.aliados){
    if (a.unido || Math.hypot(a.x - J.x, a.z - J.z) > a.radio) continue;
    if (a.pide){
      if (G.comida > 0){
        G.comida--; a.unido = true; G.equipo.push(a.pj); G.puntos += 500;
        const barrera = cajaId(G, 'barreraMollejuo'); if (barrera) barrera.solido = false;
        conversar(G, 'mollejuoCome');
        evento(G, 'seUne', {pj: a.pj});
      } else if (!G.dichos.pide || G.t - G.dichos.pide > 8){
        G.dichos.pide = G.t; conversar(G, G.dichos.pidioYa ? 'mollejuoSinComida' : 'mollejuoPide'); G.dichos.pidioYa = true;
        if (!G.comida) avisar(G, 'hambre', '¡El Mollejúo quiere comida! Busca un patacón por el puente', 8);
      }
    } else {
      a.unido = true; G.equipo.push(a.pj); G.puntos += 500;
      conversar(G, a.dialogo);
      evento(G, 'seUne', {pj: a.pj});
      avisar(G, 'cambia', '¡El Primo se unió! Toca 👥 para jugar con él', 0);
    }
  }
  /* nubes */
  const cx = J.y + 0.75;
  for (const n of N.nubes){
    if (!n.vivo) continue;
    if (n.jefe){
      if (n.dormido){
        if (J.z < -104 && G.chispas >= 3){ n.dormido = false; G.jefeActivo = true; conversar(G, 'nublao'); evento(G, 'jefe', {}); }
        continue;
      }
    }
    n.x = n.x0 + Math.sin(G.t*n.vel + n.fase)*n.amp;
    n.y = n.y0 + Math.sin(G.t*2.1 + n.fase)*0.25;
    if (n.jefe || n.grande) continue;
    const d = Math.hypot(n.x - J.x, n.z - J.z), dy = cx - n.y;
    if (d < 1.1 && J.vy < 0 && J.y > n.y - 0.4 && J.y < n.y + 0.6){
      vencerNube(G, n); J.vy = 9; evento(G, 'pisoton', {});
    } else if (d < 1.0 && Math.abs(dy) < 1.1){
      golpe(G, n.x, n.z, 7);
    }
  }
  /* los rayos del Nublao: un círculo avisa y a los 1,1 s cae el rayo */
  if (G.jefeActivo && G.fase==='jugando'){
    G.rayoT -= dt;
    if (G.rayoT <= 0){ G.rayoT = 2.1; G.rayos.push({x: J.x + J.vx*0.5, z: J.z + J.vz*0.5, t: 1.1}); }
  }
  for (let i = G.rayos.length - 1; i >= 0; i--){
    const r = G.rayos[i];
    r.t -= dt;
    if (r.t <= 0){
      evento(G, 'rayo', {x: r.x, z: r.z});
      if (Math.hypot(J.x - r.x, J.z - r.z) < 1.6 && J.y < 2.5) golpe(G, r.x, r.z, 8);
      G.rayos.splice(i, 1);
    }
  }
  /* las pedradas */
  for (let i = G.proyectiles.length - 1; i >= 0; i--){
    const p = G.proyectiles[i];
    const o = p.obj !== null ? N.nubes[p.obj] : null;
    if (o && o.vivo){
      const dx = o.x - p.x, dy = o.y - p.y, dz = o.z - p.z, d = Math.hypot(dx, dy, dz) || 1;
      p.vx = lerp(p.vx, dx/d*22, 0.2); p.vy = lerp(p.vy, dy/d*22, 0.2); p.vz = lerp(p.vz, dz/d*22, 0.2);
    } else p.vy -= 12*dt;
    p.x += p.vx*dt; p.y += p.vy*dt; p.z += p.vz*dt; p.vida -= dt;
    let fuera = p.vida <= 0 || p.y < -4;
    for (const n of N.nubes){
      if (fuera || !n.vivo || n.dormido) continue;
      if (Math.hypot(n.x - p.x, n.y - p.y, n.z - p.z) < n.r + 0.3){
        fuera = true; n.hp--; n.golpeT = G.t;
        evento(G, 'pega', {x: p.x, y: p.y, z: p.z, jefe: !!n.jefe});
        if (n.hp <= 0) vencerNube(G, n);
      }
    }
    if (fuera) G.proyectiles.splice(i, 1);
  }
  /* los carros del puente */
  if (N.carros){
    for (const c of N.carros){
      c.z += c.vz*dt;
      if (c.z > c.z1) c.z -= (c.z1 - c.z0); else if (c.z < c.z0) c.z += (c.z1 - c.z0);
      if (Math.abs(J.x - c.x) < c.ancho/2 + R && Math.abs(J.z - c.z) < c.largo/2 + R && J.y < c.alto){
        if (golpe(G, c.x, c.z - Math.sign(c.vz)*3, 9)) evento(G, 'corneta', {});
      }
    }
  }
  /* avisos de ayuda según dónde está y con quién */
  for (const a of N.avisos || []){
    if (J.x < a.x0 || J.x > a.x1 || J.z < a.z0 || J.z > a.z1) continue;
    if (a.noPj && (J.pj===a.noPj || !G.equipo.includes(a.noPj))) continue;
    if (a.siPj && J.pj!==a.siPj) continue;
    if (a.siCaja){ const b = cajaId(G, a.siCaja); if (!b || b.empujado) continue; }
    if (a.siChispa !== undefined && !N.chispas[a.siChispa].vivo) continue;
    if (a.siNube !== undefined && (!N.nubes[a.siNube].vivo || N.nubes[a.siNube].dormido)) continue;
    avisar(G, a.clave, a.texto, 7);
  }
  /* la reja del nivel 3: no se pasa sin las tres chispas */
  if (N.reja && J.z < N.reja.z){
    const falta = N.reja.necesita(G);
    if (falta){ J.z = N.reja.z + 0.3; J.vz = Math.max(0, J.vz); avisar(G, 'reja', falta, 4); }
  }
  /* la meta */
  if (N.meta && G.fase==='jugando' && J.z < N.meta.z && J.y > N.meta.y - 1){
    const falta = N.meta.necesita ? N.meta.necesita(G) : null;
    if (falta){ J.z = N.meta.z + 0.6; J.vz = 2; avisar(G, 'meta', falta, 4); }
    else {
      G.fase = 'nivelListo'; G.finT = 0; G.puntos += 1000;
      if (N.fin) conversar(G, N.fin);
      evento(G, 'nivelListo', {n: G.n});
    }
  }
}

const NUCLEO = {NIVELES, PJS, DIALOGOS, COMER, SALUDO, AY, PODER_DICE, MOLLEJUO_COME, CLIPS_PJ, TONO_PJ, NOMBRES,
  crearPartida, paso, alturaSalto, DT, R, ALTO};
if (!EN_NAVEGADOR){ if (typeof module !== 'undefined') module.exports = NUCLEO; return; }

/* ============================================================
   VISTA — Three.js + marcador en 2D
   ============================================================ */
const THREE = window.THREE;
const gl = document.getElementById('gl'), hud = document.getElementById('hud'), ctx = hud.getContext('2d');
let W = innerWidth, H = innerHeight, DPR = Math.min(devicePixelRatio || 1, 2);
const renderer = new THREE.WebGLRenderer({canvas: gl, antialias: true});
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
renderer.outputEncoding = THREE.sRGBEncoding;
const escena = new THREE.Scene();
const camara = new THREE.PerspectiveCamera(60, W/H, 0.1, 600);
function ajustar(){
  W = innerWidth; H = innerHeight; DPR = Math.min(devicePixelRatio || 1, 2);
  renderer.setSize(W, H); camara.aspect = W/H; camara.updateProjectionMatrix();
  hud.width = W*DPR; hud.height = H*DPR; hud.style.width = W+'px'; hud.style.height = H+'px';
}
addEventListener('resize', ajustar); ajustar();

/* ---------------- Voz ---------------- */
let voces = [], reproductor = null, hablando = false;
const colaVoz = [];
function cargarVoces(){ try{ voces = speechSynthesis.getVoices() || []; }catch(e){} }
if (typeof speechSynthesis !== 'undefined'){ cargarVoces(); try{ speechSynthesis.onvoiceschanged = cargarVoces; }catch(e){} }
function vozEspanola(){
  if (!voces.length) cargarVoces();
  const es = voces.filter(v=>v.lang && v.lang.toLowerCase().startsWith('es'));
  return es.find(v=>/es[-_](419|MX|US|CO|VE|AR|CL)/i.test(v.lang)) || es[0] || null;
}
function decir(texto, pj){
  const src = CLIPS_PJ[pj] && CLIPS_PJ[pj][texto];
  colaVoz.push({src, texto, pj});
  if (colaVoz.length > 4) colaVoz.shift();
  reproducirCola();
}
function reproducirCola(){
  if (hablando) return;
  const sig = colaVoz.shift(); if (!sig) return;
  if (!sig.src || !reproductor){ tts(sig.texto, sig.pj); return; }
  hablando = true;
  let sono = false;
  const fallar = ()=>{ if (sono) return; sono = true; try{ reproductor.pause(); }catch(e){} hablando = false; tts(sig.texto, sig.pj); };
  reproductor.onended = ()=>{ hablando = false; reproducirCola(); };
  reproductor.onerror = fallar;
  reproductor.onplaying = ()=>{ sono = true; };
  try{ reproductor.src = sig.src; const p = reproductor.play(); if (p && p.catch) p.catch(fallar); }catch(e){ fallar(); }
  setTimeout(()=>{ if (!sono) fallar(); }, 2000);
}
function tts(texto, pj){
  if (typeof speechSynthesis === 'undefined'){ hablando = false; reproducirCola(); return; }
  try{
    const u = new SpeechSynthesisUtterance(texto.replace(/👥/g, ''));
    const v = vozEspanola(); u.lang = 'es-ES'; if (v){ u.voice = v; u.lang = v.lang; }
    const t = TONO_PJ[pj] || {pitch: 1.2, rate: 1.05}; u.pitch = t.pitch; u.rate = t.rate;
    hablando = true;
    let listo = false;
    const fin = ()=>{ if (listo) return; listo = true; hablando = false; reproducirCola(); };
    u.onend = fin; u.onerror = fin; setTimeout(fin, 1800 + texto.length*85);
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }catch(e){ hablando = false; reproducirCola(); }
}
function callar(){ colaVoz.length = 0; try{ speechSynthesis.cancel(); }catch(e){} try{ if (reproductor) reproductor.pause(); }catch(e){} hablando = false; }

/* ---------------- Sonidos retro ---------------- */
let ac = null;
function audio(){
  if (!ac){ try{ ac = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){} }
  if (ac && ac.state==='suspended') ac.resume();
  if (!reproductor){ try{ reproductor = new Audio(); reproductor.preload = 'auto'; }catch(e){} }
}
function tono(f0, f1, dur, tipo, vol){
  if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
  o.type = tipo || 'square'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(vol || 0.08, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur);
}
function ruidoBlanco(dur, vol){
  if (!ac) return;
  const n = ac.sampleRate*dur, b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random()*2 - 1)*(1 - i/n);
  const s = ac.createBufferSource(), g = ac.createGain(); s.buffer = b; g.gain.value = vol || 0.2;
  s.connect(g); g.connect(ac.destination); s.start();
}
const sfx = {
  salto: pj=>tono(pj==='mollejuo' ? 180 : 320, pj==='primo' ? 1100 : 700, 0.18),
  come: ()=>{ tono(660, 990, 0.08); setTimeout(()=>tono(990, 1320, 0.1), 70); },
  chispa: ()=>{ [880, 1175, 1568, 2093].forEach((f, i)=>setTimeout(()=>tono(f, f, 0.12, 'triangle', 0.1), i*80)); },
  golpe: ()=>tono(300, 80, 0.3, 'sawtooth', 0.08),
  pedrada: ()=>tono(500, 200, 0.12, 'triangle'),
  pega: ()=>ruidoBlanco(0.15, 0.15),
  nube: ()=>{ ruidoBlanco(0.3, 0.12); tono(400, 1200, 0.2, 'triangle'); },
  rayo: ()=>{ ruidoBlanco(0.5, 0.3); tono(90, 40, 0.5, 'sawtooth', 0.12); },
  panza: ()=>tono(120, 60, 0.3, 'sine', 0.25),
  corneta: ()=>{ tono(440, 440, 0.15, 'square', 0.06); setTimeout(()=>tono(440, 440, 0.25, 'square', 0.06), 180); },
  bandera: ()=>[523, 659, 784].forEach((f, i)=>setTimeout(()=>tono(f, f, 0.1, 'square', 0.07), i*90)),
  chapuzon: ()=>ruidoBlanco(0.4, 0.2),
  nivel: ()=>[523, 659, 784, 1047, 784, 1047].forEach((f, i)=>setTimeout(()=>tono(f, f, 0.14, 'square', 0.08), i*120)),
  cambio: ()=>tono(600, 900, 0.1, 'triangle'),
};

/* ---------------- Materiales y modelos ---------------- */
const MAT = {};
function mat(color, o){
  const k = color + (o ? JSON.stringify(o) : '');
  if (!MAT[k]) MAT[k] = new THREE.MeshLambertMaterial(Object.assign({color}, o||{}));
  return MAT[k];
}
const GEO_CAJA = new THREE.BoxGeometry(1, 1, 1);
function bloque(padre, color, w, h, d, x, y, z, o){
  const m = new THREE.Mesh(GEO_CAJA, mat(color, o)); m.scale.set(w, h, d); m.position.set(x, y, z); padre.add(m); return m;
}
/* los personajes: de bloques, como las figuras de la foto, con la pantallita en el pecho y ojos que brillan */
function ojos(g, y, z, sep){
  for (const s of [-1, 1]){
    bloque(g, '#ffffff', 0.18, 0.22, 0.04, s*sep, y, z, {emissive: '#ffffff', emissiveIntensity: 0.5});
    bloque(g, '#1c7ed6', 0.1, 0.13, 0.05, s*sep, y - 0.01, z + 0.01, {emissive: '#1c7ed6', emissiveIntensity: 0.6});
  }
}
function modeloPj(pj){
  const g = new THREE.Group(), cuerpo = new THREE.Group(); g.add(cuerpo); g.userData.cuerpo = cuerpo;
  const piernas = [];
  if (pj==='salomon'){
    for (const s of [-1, 1]) piernas.push(bloque(cuerpo, '#1c3d7a', 0.24, 0.5, 0.28, s*0.15, 0.25, 0));
    bloque(cuerpo, '#d62828', 0.64, 0.55, 0.36, 0, 0.78, 0);             /* el suéter rojo */
    bloque(cuerpo, '#111111', 0.5, 0.08, 0.02, 0, 0.9, 0.19);            /* la araña del suéter */
    bloque(cuerpo, '#111111', 0.08, 0.3, 0.02, 0, 0.8, 0.19);
    for (const s of [-1, 1]) bloque(cuerpo, '#d62828', 0.16, 0.45, 0.2, s*0.4, 0.8, 0);
    bloque(cuerpo, '#c68642', 0.5, 0.46, 0.44, 0, 1.3, 0);                /* la cara */
    bloque(cuerpo, '#2a1a0a', 0.56, 0.2, 0.5, 0, 1.58, -0.02);            /* el pelo */
    bloque(cuerpo, '#2a1a0a', 0.14, 0.12, 0.1, 0.12, 1.55, 0.23);
    ojos(cuerpo, 1.34, 0.23, 0.11);
    bloque(cuerpo, '#8d5524', 0.18, 0.05, 0.02, 0, 1.17, 0.23);           /* la sonrisa */
  } else if (pj==='primo'){
    for (const s of [-1, 1]) piernas.push(bloque(cuerpo, '#212529', 0.24, 0.52, 0.28, s*0.15, 0.26, 0));
    bloque(cuerpo, '#2f9e44', 0.62, 0.55, 0.36, 0, 0.8, 0);
    bloque(cuerpo, '#9fffb0', 0.34, 0.2, 0.02, 0, 0.85, 0.19, {emissive: '#5cff7a', emissiveIntensity: 0.9});
    for (const s of [-1, 1]){ bloque(cuerpo, '#2f9e44', 0.16, 0.45, 0.2, s*0.39, 0.82, 0); bloque(cuerpo, '#ffd43b', 0.12, 0.12, 0.05, s*0.18, 0.66, 0.19); }
    bloque(cuerpo, '#f1c27d', 0.5, 0.5, 0.44, 0, 1.33, 0);
    bloque(cuerpo, '#5a3a1a', 0.54, 0.18, 0.46, 0, 1.52, -0.03);
    bloque(cuerpo, '#2f9e44', 0.56, 0.2, 0.52, 0, 1.68, 0);               /* la gorra verde */
    bloque(cuerpo, '#2f9e44', 0.5, 0.05, 0.25, 0, 1.6, 0.3);
    bloque(cuerpo, '#ffffff', 0.16, 0.16, 0.03, 0, 1.7, 0.27);
    ojos(cuerpo, 1.38, 0.23, 0.11);
    bloque(cuerpo, '#b5651d', 0.14, 0.12, 0.1, 0, 1.26, 0.25);            /* la nariz */
    bloque(cuerpo, '#1a1a1a', 0.34, 0.07, 0.04, 0, 1.18, 0.23);           /* el bigote */
  } else if (pj==='mollejuo'){
    for (const s of [-1, 1]) piernas.push(bloque(cuerpo, '#1c3d7a', 0.28, 0.45, 0.3, s*0.18, 0.23, 0));
    bloque(cuerpo, '#1c3d7a', 0.84, 0.62, 0.52, 0, 0.72, 0);             /* la panza en braga azul */
    bloque(cuerpo, '#ff8787', 0.34, 0.2, 0.02, 0, 0.8, 0.27, {emissive: '#ff6b6b', emissiveIntensity: 0.9});
    for (const s of [-1, 1]){ bloque(cuerpo, '#e03131', 0.18, 0.45, 0.22, s*0.5, 0.8, 0); bloque(cuerpo, '#ffd43b', 0.12, 0.12, 0.05, s*0.22, 0.95, 0.27); }
    bloque(cuerpo, '#f1c27d', 0.56, 0.5, 0.46, 0, 1.3, 0);
    bloque(cuerpo, '#6b3a1a', 0.6, 0.22, 0.5, 0, 1.58, -0.02);
    ojos(cuerpo, 1.36, 0.24, 0.12);
    bloque(cuerpo, '#b5651d', 0.16, 0.14, 0.1, 0, 1.24, 0.27);
    bloque(cuerpo, '#1a1a1a', 0.42, 0.08, 0.04, 0, 1.15, 0.24);
  } else if (pj==='chinita'){
    bloque(cuerpo, '#ffa8c5', 0.8, 0.9, 0.6, 0, 0.45, 0);                 /* el vestido */
    bloque(cuerpo, '#ffc9dc', 0.6, 0.45, 0.4, 0, 1.1, 0);
    bloque(cuerpo, '#ffe3ef', 0.28, 0.2, 0.02, 0, 1.12, 0.21, {emissive: '#ffb3d0', emissiveIntensity: 0.9});
    bloque(cuerpo, '#4dabf7', 0.08, 0.08, 0.03, 0, 1.12, 0.23, {emissive: '#4dabf7', emissiveIntensity: 1});
    bloque(cuerpo, '#ffe0bd', 0.46, 0.46, 0.42, 0, 1.58, 0);
    bloque(cuerpo, '#ffd43b', 0.6, 0.3, 0.5, 0, 1.84, -0.04);            /* el pelo dorado */
    bloque(cuerpo, '#ffd43b', 0.14, 0.6, 0.4, -0.28, 1.5, -0.05); bloque(cuerpo, '#ffd43b', 0.14, 0.6, 0.4, 0.28, 1.5, -0.05);
    bloque(cuerpo, '#fcc419', 0.34, 0.14, 0.3, 0, 2.04, 0, {emissive: '#fab005', emissiveIntensity: 0.6});   /* la corona */
    ojos(cuerpo, 1.62, 0.22, 0.1);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.05, 8, 32), mat('#fff3bf', {emissive: '#ffe066', emissiveIntensity: 1}));
    halo.position.y = 1.7; halo.position.z = -0.3; cuerpo.add(halo);
    const luz = new THREE.PointLight('#ffe8a3', 1.2, 9); luz.position.set(0, 1.8, 0.8); g.add(luz);
  }
  g.userData.piernas = piernas;
  return g;
}
function modeloNube(o){
  const g = new THREE.Group(), gris = o.jefe ? '#2b2b3a' : o.grande ? '#3b3b4f' : '#4a4a5a';
  const k = o.jefe ? 2.6 : o.grande ? 1.8 : 0.9;
  const bolas = [[0,0,0,1],[0.7,-0.1,0,0.75],[-0.7,-0.1,0,0.75],[0.3,0.35,0,0.65],[-0.35,0.3,0.1,0.6]];
  for (const [x, y, z, r] of bolas){ const m = new THREE.Mesh(new THREE.SphereGeometry(r*k*0.7, 12, 10), mat(gris)); m.position.set(x*k, y*k, z*k); g.add(m); }
  /* ojos bravos */
  for (const s of [-1, 1]){
    bloque(g, '#ffffff', 0.2*k, 0.14*k, 0.05, s*0.22*k, 0.05*k, 0.66*k, {emissive: '#ffe066', emissiveIntensity: 0.8});
    const ceja = bloque(g, '#111111', 0.28*k, 0.06*k, 0.06, s*0.22*k, 0.17*k, 0.68*k); ceja.rotation.z = s*0.4;
  }
  bloque(g, '#111111', 0.3*k, 0.05*k, 0.05, 0, -0.15*k, 0.68*k);
  if (o.jefe){
    for (const s of [-1, 1]){ const r = bloque(g, '#ffe066', 0.25, 1.6, 0.25, s*1.3, -2.2, 0.4, {emissive: '#ffd43b', emissiveIntensity: 1}); r.rotation.z = s*0.3; }
  }
  return g;
}
function modeloComida(tipo){
  const g = new THREE.Group();
  if (tipo==='mandoca'){ const m = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.09, 8, 16), mat('#d9822b')); g.add(m); }
  else if (tipo==='patacon'){
    for (const y of [-0.12, 0.12]){ const m = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 12), mat('#e8b04a')); m.position.y = y; m.rotation.x = Math.PI/2*0; g.add(m); }
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.14, 12), mat('#37b24d')); g.add(r);
    g.rotation.x = Math.PI/2;
  } else if (tipo==='tequeno'){ const m = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8), mat('#f2c060')); m.rotation.z = Math.PI/2.5; g.add(m); }
  else if (tipo==='pastelito'){ const m = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 12, 1, false, 0, Math.PI), mat('#f4a340')); m.rotation.x = Math.PI/2; g.add(m); }
  else if (tipo==='huevoChimbo'){ const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), mat('#ffc933')); m.scale.y = 1.25; g.add(m); }
  else { const v = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.12, 0.35, 10), mat('#ffffff')); g.add(v); const h = new THREE.Mesh(new THREE.SphereGeometry(0.21, 10, 8), mat('#ff4d6d')); h.position.y = 0.22; g.add(h); }
  return g;
}
function modeloChispa(){
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.4), mat('#ffe066', {emissive: '#ffd43b', emissiveIntensity: 1}));
  m.scale.y = 1.6; g.add(m);
  const l = new THREE.PointLight('#ffe066', 1.5, 6); g.add(l);
  return g;
}
function modeloCarro(color){
  const g = new THREE.Group();
  bloque(g, color, 1.9, 0.7, 3.8, 0, 0.55, 0);
  bloque(g, color, 1.6, 0.55, 2, 0, 1.15, 0.2);
  bloque(g, '#a5d8ff', 1.62, 0.4, 0.05, 0, 1.15, -0.82);
  bloque(g, '#a5d8ff', 1.62, 0.4, 0.05, 0, 1.15, 1.22);
  for (const [x, z] of [[-0.9, -1.2], [0.9, -1.2], [-0.9, 1.2], [0.9, 1.2]]){ const r = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 12), mat('#111')); r.rotation.z = Math.PI/2; r.position.set(x, 0.35, z); g.add(r); }
  for (const s of [-1, 1]) bloque(g, '#fff9db', 0.3, 0.2, 0.05, s*0.6, 0.6, -1.92, {emissive: '#fff3bf', emissiveIntensity: 1});
  return g;
}

/* ---------------- Armar el mundo de un nivel ---------------- */
let mundo = null, G = null;
const luzSol = new THREE.DirectionalLight('#ffffff', 0.9), luzAmb = new THREE.HemisphereLight('#ffffff', '#6b5a3a', 0.65);
escena.add(luzSol, luzSol.target, luzAmb);
function armarMundo(){
  if (mundo) escena.remove(mundo.raiz);
  const N = G.N, raiz = new THREE.Group();
  mundo = {raiz, cajas: new Map(), comidas: [], chispas: [], nubes: [], carros: [], aliados: [], rayos: [], efectos: [], seguidores: {}};
  escena.add(raiz);
  escena.background = new THREE.Color(N.cielo);
  escena.fog = new THREE.Fog(N.niebla, 45, N.noche ? 120 : 170);
  luzSol.intensity = N.noche ? 0.25 : 0.7; luzAmb.intensity = N.noche ? 0.45 : 0.55;
  luzAmb.color.set(N.noche ? '#8c8cff' : '#ffffff');
  if (N.lago){
    const agua = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), mat(N.noche ? '#1b3a5c' : '#2f7fb8'));
    agua.rotation.x = -Math.PI/2; agua.position.set(0, N.noche ? -0.6 : -14, -150); raiz.add(agua);
  }
  for (const b of N.cajas){
    if (b.visible === false) continue;
    const g = new THREE.Group(), w = b.x1 - b.x0, h = b.y1 - b.y0, d = b.z1 - b.z0;
    g.position.set((b.x0 + b.x1)/2, b.y0, (b.z0 + b.z1)/2);
    bloque(g, b.color, w, h, d, 0, h/2, 0);
    if (b.tipo==='casa' && b.lado){
      /* puerta, ventanas y el techito de las casas del Saladillo */
      const fx = b.lado*w/2 + b.lado*0.03;
      bloque(g, '#5c3a1e', 0.05, 2.1, 1.3, fx, 1.05, 0);
      for (const s of [-1, 1]) bloque(g, '#fff3bf', 0.05, 0.9, 1.1, fx, 2.6, s*2.4);
      bloque(g, '#ffffff', w + 0.4, 0.3, d, 0, h + 0.15, 0);
    } else if (b.tipo==='casa'){
      bloque(g, '#fff3bf', 0.9, 0.8, 0.05, 0, h*0.6, d/2 + 0.03, {emissive: '#ffe066', emissiveIntensity: G.N.noche ? 0.8 : 0});
      /* los palos de los palafitos */
      for (const [x, z] of [[-w/2, -d/2], [w/2, -d/2], [-w/2, d/2], [w/2, d/2]]) bloque(g, '#5c3a1e', 0.25, 3, 0.25, x, -2.5, z);
    } else if (b.tipo==='tablas'){
      for (const [x, z] of [[-w/2+0.3, -d/2+0.3], [w/2-0.3, -d/2+0.3], [-w/2+0.3, d/2-0.3], [w/2-0.3, d/2-0.3]]) bloque(g, '#5c3a1e', 0.3, 3, 0.3, x, -1.5, z);
    } else if (b.tipo==='pilon'){
      /* las torres del puente, en forma de A, con sus cables */
      for (const s of [-1, 1]){ const p = bloque(g, '#e9ecef', 1.2, 30, 0.9, 0, 13, s*3.2); p.rotation.x = -s*0.2; }
      bloque(g, '#dee2e6', 1.2, 0.9, 5, 0, 17, 0);
      const cable = new THREE.LineBasicMaterial({color: '#adb5bd'});
      for (const s of [-1, 1]) for (let k = 1; k <= 5; k++){
        const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 27, 0), new THREE.Vector3(s*8.6, 0.3, s*k*7)]);
        g.add(new THREE.Line(geo, cable));
        const geo2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 27, 0), new THREE.Vector3(-s*8.6, 0.3, s*k*7)]);
        g.add(new THREE.Line(geo2, cable));
      }
    } else if (b.tipo==='asfalto'){
      for (let z = -d/2 + 2; z < d/2; z += 6) for (const x of [-4.9, -1.5, 1.5, 4.9]) if (Math.abs(x) < w/2 - 1) bloque(g, '#f8f9fa', 0.2, 0.02, 2.5, x, h + 0.01, z);
      if (w > 17) for (const s of [-1, 1]) bloque(g, '#dee2e6', 0.3, 1.1, d, s*(w/2 - 0.15), h + 0.55, 0);
      /* columnas bajo el puente */
      for (let z = -d/2 + 15; z < d/2; z += 30) bloque(g, '#ced4da', 3, 14, 3, 0, -7, z);
    } else if (b.tipo==='gandola'){
      bloque(g, '#f8f9fa', w*0.7, 0.1, d + 0.02, -w*0.1, h*0.6, 0);
      bloque(g, '#343a40', w*0.22, h*0.75, d + 0.04, w*0.37, h*0.4, 0);
      bloque(g, '#a5d8ff', w*0.18, h*0.25, 0.05, w*0.37, h*0.6, d/2 + 0.04);
    } else if (b.tipo==='huacal'){
      for (const s of [-1, 1]) bloque(g, '#ffffff', w + 0.02, 0.12, 0.05, 0, h*0.75, s*(d/2 + 0.01));
    } else if (b.tipo==='cayuco'){
      bloque(g, '#e03131', w + 0.04, 0.2, d + 0.04, 0, h*0.8, 0);
    }
    raiz.add(g);
    mundo.cajas.set(b, g);
  }
  /* el arco de la meta */
  if (N.meta){
    const a = new THREE.Group(); a.position.set(0, N.meta.y, N.meta.z);
    for (const s of [-1, 1]) bloque(a, '#ffd43b', 0.8, 5, 0.8, s*6, 2.5, 0);
    bloque(a, '#1c7ed6', 12.8, 1.2, 0.8, 0, 5.3, 0);
    bloque(a, '#ffffff', 11, 0.6, 0.1, 0, 5.3, 0.45, {emissive: '#ffffff', emissiveIntensity: 0.3});
    raiz.add(a);
  }
  for (const f of N.banderas){
    const b = new THREE.Group(); b.position.set(f.x, f.y, f.z);
    bloque(b, '#dee2e6', 0.12, 2.6, 0.12, 0, 1.3, 0);
    const tela = bloque(b, '#1c7ed6', 0.9, 0.55, 0.05, 0.5, 2.25, 0);
    bloque(b, '#ffd43b', 0.22, 0.22, 0.06, 0.5, 2.25, 0, {emissive: '#fab005', emissiveIntensity: 0.6});
    b.userData.tela = tela; raiz.add(b); f.malla = b;
  }
  for (const c of N.comidas){ const m = modeloComida(c.tipo); m.position.set(c.x, c.y, c.z); raiz.add(m); mundo.comidas.push([c, m]); }
  for (const c of N.chispas){ const m = modeloChispa(); m.position.set(c.x, c.y, c.z); m.visible = !c.oculta; raiz.add(m); mundo.chispas.push([c, m]); }
  for (const n of N.nubes){ const m = modeloNube(n); m.position.set(n.x, n.y + (n.dormido ? 3 : 0), n.z); raiz.add(m); mundo.nubes.push([n, m]); }
  for (const c of N.carros || []){ const m = modeloCarro(c.color); m.position.set(c.x, 0, c.z); if (c.vz > 0) m.rotation.y = Math.PI; raiz.add(m); mundo.carros.push([c, m]); }
  for (const a of N.aliados){ const m = modeloPj(a.pj); m.position.set(a.x, a.y, a.z); if (a.grande) m.scale.setScalar(2.2); raiz.add(m); mundo.aliados.push([a, m]); }
  if (N.chinita){ const m = modeloPj('chinita'); m.position.set(N.chinita.x, N.chinita.y, N.chinita.z); m.rotation.y = 0.5; raiz.add(m); mundo.chinita = m; }
  if (N.id===3){
    mundo.chinitaFinal = modeloPj('chinita'); mundo.chinitaFinal.visible = false; raiz.add(mundo.chinitaFinal);
    /* los relámpagos del Catatumbo al final: rayitos en el horizonte */
    mundo.relampagos = [];
    for (let i = 0; i < 14; i++){
      const r = new THREE.Group(); let x = 0, y = 0;
      for (let k = 0; k < 5; k++){ const nx = x + (Math.random() - 0.5)*4, ny = y - 4; const s = bloque(r, '#fff9db', 0.35, 4.3, 0.35, (x+nx)/2, (y+ny)/2, 0, {emissive: '#ffffff', emissiveIntensity: 1}); s.rotation.z = Math.atan2(nx - x, 4); x = nx; y = ny; }
      const a = (i/14)*Math.PI*1.2 + Math.PI*0.4;
      r.position.set(Math.cos(a)*90, 45 + Math.random()*10, -130 + Math.sin(a)*-90); r.visible = false;
      raiz.add(r); mundo.relampagos.push(r);
    }
  }
  /* el jugador y los primos que lo siguen */
  mundo.jugador = {};
  for (const pj of ['salomon', 'primo', 'mollejuo']){
    const m = modeloPj(pj); m.visible = false; raiz.add(m); mundo.jugador[pj] = m;
    const s = modeloPj(pj); s.visible = false; raiz.add(s); mundo.seguidores[pj] = s;
  }
  const sombra = new THREE.Mesh(new THREE.CircleGeometry(0.45, 16), new THREE.MeshBasicMaterial({color: '#000', transparent: true, opacity: 0.3}));
  sombra.rotation.x = -Math.PI/2; raiz.add(sombra); mundo.sombra = sombra;
  mundo.piedras = [];
  camPos.set(G.J.x, G.J.y + 5, G.J.z + 8);
}
function efecto(x, y, z, color, n, vel){
  for (let i = 0; i < (n||10); i++){
    const m = bloque(mundo.raiz, color, 0.14, 0.14, 0.14, x, y, z, {emissive: color, emissiveIntensity: 0.5});
    const a = Math.random()*Math.PI*2, v = (vel||4)*(0.5 + Math.random()*0.5);
    mundo.efectos.push({m, vx: Math.cos(a)*v, vy: 2 + Math.random()*4, vz: Math.sin(a)*v, t: 0.8});
  }
}
function destello(x, z){
  const r = new THREE.Group(); let px = 0, py = 12;
  for (let k = 0; k < 4; k++){ const nx = px + (Math.random() - 0.5)*1.6, ny = py - 3; const s = bloque(r, '#ffffff', 0.25, 3.2, 0.25, (px+nx)/2, (py+ny)/2, 0, {emissive: '#fff3bf', emissiveIntensity: 1}); s.rotation.z = Math.atan2(nx - px, 3); px = nx; py = ny; }
  r.position.set(x, 0.5, z); mundo.raiz.add(r);
  mundo.efectos.push({m: r, vx: 0, vy: 0, vz: 0, t: 0.25, fijo: true});
}

/* ---------------- Entrada: teclado, palanca táctil, botones y mando ---------------- */
const teclas = {}, pulsadas = new Set();
let estado = 'titulo', tactil = false, nivelInicial = 0;
try{ const q = new URL(location.href).searchParams.get('nivel'); if (q && +q >= 1 && +q <= 3) nivelInicial = +q - 1; }catch(e){}
addEventListener('keydown', e=>{
  if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','Tab'].includes(e.key)) e.preventDefault();
  const k = e.key.toLowerCase();
  teclas[k] = true; if (!e.repeat) pulsadas.add(k);
  audio();
  if (e.repeat) return;
  if (estado==='titulo'){
    if (k==='enter' || k===' ') empezar(nivelInicial);
    else if (k>='1' && k<='3') empezar(+k - 1);
    else if (k==='escape') salir();
  } else if (estado==='fin'){ if (k==='enter' || k===' ') empezar(0); else if (k==='escape') salir(); }
  else if (k==='escape') volverTitulo();
});
addEventListener('keyup', e=>{ teclas[e.key.toLowerCase()] = false; });
addEventListener('blur', ()=>{ for (const k in teclas) teclas[k] = false; TOQUE.palanca = null; TOQUE.botones.clear(); });
for (const ev of ['gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(ev, e=>e.preventDefault());
document.addEventListener('touchmove', e=>e.preventDefault(), {passive: false});
document.addEventListener('contextmenu', e=>e.preventDefault());
addEventListener('touchstart', ()=>{ tactil = true; }, {passive: true, once: true});
const TOQUE = {palanca: null, botones: new Map()};
const BOTONES = [
  {k: 'a', txt: 'A', sub: 'saltar', color: 'rgba(255,120,90,.42)', borde: 'rgba(255,190,170,.9)', r: 42, pos: ()=>({x: W - 58, y: H - 118})},
  {k: 'b', txt: 'B', sub: 'poder', color: 'rgba(110,170,255,.42)', borde: 'rgba(180,210,255,.9)', r: 36, pos: ()=>({x: W - 140, y: H - 56})},
  {k: 'c', txt: '👥', sub: 'cambiar', color: 'rgba(255,210,80,.42)', borde: 'rgba(255,235,160,.9)', r: 32, pos: ()=>({x: W - 58, y: H - 225})},
  {k: 'x', txt: '✕', color: 'rgba(255,255,255,.22)', borde: 'rgba(255,255,255,.7)', r: 20, pos: ()=>({x: W - 30, y: 30}), siempre: true},
];
function botonEn(x, y){
  let mejor = null, md = 1e9;
  for (const b of BOTONES){
    if (!b.siempre && (!tactil || estado!=='juego')) continue;
    const p = b.pos(), d = Math.hypot(x - p.x, y - p.y);
    if (d < b.r*1.55 && d < md){ md = d; mejor = b; }
  }
  return mejor;
}
document.addEventListener('pointerdown', ev=>{
  audio();
  if (ev.pointerType==='touch') tactil = true;
  const x = ev.clientX, y = ev.clientY, b = botonEn(x, y);
  if (b){
    if (b.k==='x'){ if (estado==='juego') volverTitulo(); else salir(); ev.preventDefault(); return; }
    TOQUE.botones.set(ev.pointerId, b); pulsadas.add(b.k); ev.preventDefault(); return;
  }
  if (estado==='titulo'){ clicTitulo(x, y); return; }
  if (estado==='fin'){ clicFin(x, y); return; }
  if (estado==='juego' && x < W*0.55 && !TOQUE.palanca){ TOQUE.palanca = {id: ev.pointerId, x0: x, y0: y, x, y}; ev.preventDefault(); }
}, true);
document.addEventListener('pointermove', ev=>{
  if (TOQUE.palanca && TOQUE.palanca.id===ev.pointerId){ TOQUE.palanca.x = ev.clientX; TOQUE.palanca.y = ev.clientY; }
}, true);
const soltar = ev=>{ if (TOQUE.palanca && TOQUE.palanca.id===ev.pointerId) TOQUE.palanca = null; TOQUE.botones.delete(ev.pointerId); };
document.addEventListener('pointerup', soltar, true);
document.addEventListener('pointercancel', soltar, true);
function botonTocado(k){ for (const b of TOQUE.botones.values()) if (b.k===k) return true; return false; }
const MANDO = {prev: {}, hay: false};
function leerMando(){
  const r = {jx: 0, jy: 0, a: false, b: false, c: false, aP: false, bP: false, cP: false, startP: false};
  if (!navigator.getGamepads) return r;
  let gps; try{ gps = navigator.getGamepads(); }catch(e){ return r; }
  for (const gp of gps || []){
    if (!gp || !gp.connected) continue;
    MANDO.hay = true;
    const zona = v=>Math.abs(v) > 0.15 ? Math.sign(v)*(Math.abs(v) - 0.15)/0.85 : 0;
    r.jx += zona(gp.axes[0]||0); r.jy -= zona(gp.axes[1]||0);
    const p = i=>{ const b = gp.buttons[i]; return !!(b && (b.pressed || b.value > 0.5)); };
    if (p(14)) r.jx -= 1; if (p(15)) r.jx += 1; if (p(12)) r.jy += 1; if (p(13)) r.jy -= 1;
    const flanco = (i, campo, campoP)=>{ const v = p(i), c = gp.index+':'+i; if (v){ r[campo] = true; if (!MANDO.prev[c]) r[campoP] = true; } MANDO.prev[c] = v; };
    flanco(0, 'a', 'aP'); flanco(1, 'b', 'bP'); flanco(2, 'b', 'bP'); flanco(7, 'b', 'bP');
    flanco(3, 'c', 'cP'); flanco(4, 'c', 'cP'); flanco(5, 'c', 'cP'); flanco(9, 'start', 'startP');
  }
  return r;
}
function leerEntrada(){
  const m = leerMando();
  let jx = m.jx, jy = m.jy;
  if (teclas['arrowleft'] || teclas['a']) jx -= 1;
  if (teclas['arrowright'] || teclas['d']) jx += 1;
  if (teclas['arrowup'] || teclas['w']) jy += 1;
  if (teclas['arrowdown'] || teclas['s']) jy -= 1;
  const p = TOQUE.palanca;
  if (p){ let dx = (p.x - p.x0)/50, dy = (p.y - p.y0)/50; const k = Math.hypot(dx, dy); if (k > 1){ dx /= k; dy /= k; } if (k > 0.12){ jx += dx; jy -= dy; } }
  const ent = {
    jx, jy,
    saltar: !!(teclas[' '] || teclas['z'] || teclas['k'] || m.a || botonTocado('a')),
    saltoPulsado: pulsadas.has(' ') || pulsadas.has('z') || pulsadas.has('k') || m.aP || pulsadas.has('a') && botonTocado('a'),
    poder: pulsadas.has('x') && !tactil || pulsadas.has('shift') || pulsadas.has('j') || m.bP || pulsadas.has('b') && botonTocado('b'),
    cambiar: pulsadas.has('c') || pulsadas.has('tab') || pulsadas.has('l') || m.cP,
  };
  /* en el celular las letras vienen de los botones de la pantalla */
  if (tactil){ if (pulsadas.has('a')) ent.saltoPulsado = true; if (pulsadas.has('b')) ent.poder = true; if (pulsadas.has('c')) ent.cambiar = true; }
  if (m.startP && estado==='titulo') empezar(nivelInicial);
  pulsadas.clear();
  return ent;
}
function salir(){ callar(); location.href = '../'; }
function volverTitulo(){ callar(); estado = 'titulo'; subtitulos.length = 0; tituloEscena = null; }

/* ---------------- Flujo del juego ---------------- */
const subtitulos = [];   /* {quien, pj, texto, t} */
let aviso = null, cartel = null, finNivelT = 0;
function empezar(n, previo){
  audio(); callar();
  G = crearPartida(n, previo);
  estado = 'juego'; subtitulos.length = 0; aviso = null;
  armarMundo();
  cartel = {titulo: 'NIVEL ' + (n+1) + ' · ' + G.N.nombre, sub: G.N.sub, t: 3.2};
}
function atenderEventos(){
  for (const e of G.eventos){
    switch (e.tipo){
      case 'hablar': decir(e.texto, e.pj); subtitulos.push({quien: e.quien, pj: e.pj, texto: e.texto, t: Math.max(2.4, e.texto.length*0.065)}); if (subtitulos.length > 5) subtitulos.shift(); break;
      case 'aviso': aviso = {texto: e.texto, t: 3.6}; break;
      case 'salto': sfx.salto(e.pj); break;
      case 'come': sfx.come(); efecto(e.x, e.y, e.z, '#ffd43b', 8, 3); break;
      case 'chispa': sfx.chispa(); efecto(e.x, e.y, e.z, '#fff3bf', 16, 5); break;
      case 'golpe': sfx.golpe(); efecto(e.x, e.y + 1, e.z, '#ffffff', 6, 3); break;
      case 'pedrada': sfx.pedrada(); break;
      case 'pega': sfx.pega(); efecto(e.x, e.y, e.z, '#adb5bd', 6, 3); break;
      case 'nubeVencida': sfx.nube(); efecto(e.x, e.y, e.z, '#868e96', e.grande ? 30 : 12, e.grande ? 8 : 4); break;
      case 'rayo': sfx.rayo(); destello(e.x, e.z); break;
      case 'panzazo': sfx.panza(); efecto(e.x, e.y + 0.6, e.z, '#ffe8cc', 12, 6); break;
      case 'corneta': sfx.corneta(); break;
      case 'bandera': sfx.bandera(); break;
      case 'chapuzon': sfx.chapuzon(); break;
      case 'cambio': sfx.cambio(); break;
      case 'seUne': sfx.bandera(); break;
      case 'nivelListo': sfx.nivel(); cartel = {titulo: '¡NIVEL COMPLETADO!', sub: G.N.nombre, t: 4}; finNivelT = 0; break;
      case 'jefe': cartel = {titulo: '¡EL NUBLAO!', sub: 'Dale pedradas con Salomón (B) y esquiva los rayos', t: 3}; break;
      case 'relampagos': sfx.chispa(); break;
      case 'fin': estado = 'fin'; break;
    }
  }
  G.eventos.length = 0;
}

/* ---------------- Cámara y dibujo 3D ---------------- */
const camPos = new THREE.Vector3(0, 5, 8), camMira = new THREE.Vector3();
function animarPj(m, anda, t, enAire, pj){
  const piernas = m.userData.piernas, c = m.userData.cuerpo;
  const k = Math.min(1, anda/5), f = t*(pj==='mollejuo' ? 11 : 14);
  piernas.forEach((p, i)=>{ p.rotation.x = enAire ? (i ? 0.5 : -0.5) : Math.sin(f + i*Math.PI)*0.7*k; });
  c.position.y = enAire ? 0 : Math.abs(Math.sin(f))*0.06*k;
}
function dibujar3D(dt){
  const N = G.N, J = G.J, t = G.t;
  /* jugador */
  for (const pj in mundo.jugador){
    const m = mundo.jugador[pj]; m.visible = pj===J.pj && !(J.invul > 0 && Math.floor(t*14) % 2);
    if (pj!==J.pj) continue;
    m.position.set(J.x, J.y, J.z);
    const ang = Math.atan2(J.fx, J.fz);
    let da = ang - m.rotation.y; while (da > Math.PI) da -= Math.PI*2; while (da < -Math.PI) da += Math.PI*2;
    m.rotation.y += da*Math.min(1, dt*14);
    animarPj(m, J.anda, t, !J.suelo, pj);
    const esc = pj==='mollejuo' && J.panza > 0 ? 1 + Math.sin(J.panza*Math.PI*2)*0.25 : 1;
    m.userData.cuerpo.scale.set(esc, 1, esc);
  }
  mundo.sombra.position.set(J.x, (J.sobre ? J.sobre.y1 : 0) + 0.02, J.z);
  mundo.sombra.visible = J.y > -1;
  /* los primos siguen el rastro */
  let orden = 0;
  for (const pj in mundo.seguidores){
    const s = mundo.seguidores[pj];
    s.visible = G.equipo.includes(pj) && pj!==J.pj && G.rastro.length > 0;
    if (!s.visible) continue;
    orden++;
    const r = G.rastro[Math.min(G.rastro.length - 1, orden*13)], r2 = G.rastro[Math.min(G.rastro.length - 1, orden*13 - 4)];
    s.position.set(r.x + (orden===1 ? 0.8 : -0.8), r.y, r.z);
    if (Math.hypot(r2.x - r.x, r2.z - r.z) > 0.01) s.rotation.y = Math.atan2(r2.x - r.x, r2.z - r.z);
    animarPj(s, r.anda, t + orden, false, pj);
  }
  for (const [a, m] of mundo.aliados){
    m.visible = !a.unido;
    if (a.unido) continue;
    m.rotation.y = Math.atan2(J.x - a.x, J.z - a.z);
    if (a.pj==='primo'){ const cerca = Math.hypot(J.x - a.x, J.z - a.z) < 12; m.position.y = cerca ? 0 : -0.9; m.position.z = a.z + Math.sin(t*9)*0.03; }
    else m.userData.cuerpo.position.y = Math.abs(Math.sin(t*2))*0.1;
  }
  if (mundo.chinita){ mundo.chinita.userData.cuerpo.position.y = Math.sin(t*2)*0.08; }
  for (const [c, m] of mundo.comidas){ m.visible = c.vivo; if (c.vivo){ m.position.y = c.y + Math.sin(t*3 + c.z)*0.12; m.rotation.y = t*2; } }
  for (const [c, m] of mundo.chispas){ m.visible = c.vivo && !c.oculta; if (m.visible){ m.position.set(c.x, c.y + Math.sin(t*4)*0.15, c.z); m.rotation.y = t*3; } }
  for (const [n, m] of mundo.nubes){
    m.visible = n.vivo;
    if (!n.vivo) continue;
    m.position.set(n.x, n.y, n.z);
    const tiembla = n.golpeT && t - n.golpeT < 0.3 ? Math.sin(t*80)*0.15 : 0;
    m.position.x += tiembla;
    m.rotation.y = Math.atan2(J.x - n.x, J.z - n.z)*0.6;
    if (n.jefe && n.dormido){ m.position.y = n.y0 + 3 + Math.sin(t)*0.4; }
  }
  for (const [c, m] of mundo.carros) m.position.set(c.x, 0, c.z);
  for (const [b, g] of mundo.cajas) if (b.empujado){ g.position.x = (b.x0 + b.x1)/2; }
  for (const f of N.banderas){ if (f.malla) f.malla.userData.tela.rotation.y = Math.sin(t*3 + f.z)*0.3; }
  /* pedradas */
  while (mundo.piedras.length < G.proyectiles.length){ const p = bloque(mundo.raiz, '#868e96', 0.22, 0.22, 0.22, 0, -99, 0); mundo.piedras.push(p); }
  mundo.piedras.forEach((p, i)=>{ const q = G.proyectiles[i]; p.visible = !!q; if (q){ p.position.set(q.x, q.y, q.z); p.rotation.x += dt*12; } });
  /* círculos de aviso de los rayos */
  while (mundo.rayos.length < G.rayos.length){
    const c = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.6, 24), new THREE.MeshBasicMaterial({color: '#ffe066', transparent: true, opacity: 0.8, side: THREE.DoubleSide}));
    c.rotation.x = -Math.PI/2; mundo.raiz.add(c); mundo.rayos.push(c);
  }
  mundo.rayos.forEach((c, i)=>{ const r = G.rayos[i]; c.visible = !!r; if (r){ c.position.set(r.x, 0.53, r.z); c.material.opacity = 0.4 + Math.sin(t*20)*0.4; const s = 0.6 + r.t*0.4; c.scale.set(s, s, s); } });
  /* chispitas y rayos sueltos */
  for (let i = mundo.efectos.length - 1; i >= 0; i--){
    const e = mundo.efectos[i]; e.t -= dt;
    if (!e.fijo){ e.vy -= 12*dt; e.m.position.x += e.vx*dt; e.m.position.y += e.vy*dt; e.m.position.z += e.vz*dt; }
    if (e.t <= 0){ mundo.raiz.remove(e.m); mundo.efectos.splice(i, 1); }
  }
  /* el final: vuelve el relámpago del Catatumbo y baja la Chinita */
  if (N.id===3 && (G.fase==='final' || G.fase==='fin')){
    const ch = mundo.chinitaFinal; ch.visible = true;
    ch.position.set(0, 0.5 + Math.max(0, 6 - G.finalT*2), -128); ch.rotation.y = Math.atan2(J.x, J.z + 128);
    for (const r of mundo.relampagos) r.visible = Math.random() < 0.18;
    escena.background.lerp(new THREE.Color('#3b2d6e'), 0.02);
    luzAmb.intensity = 0.45 + (Math.random() < 0.1 ? 0.8 : 0);
  }
  /* la cámara va detrás y un poquito arriba */
  const lejos = J.pj==='mollejuo' ? 8.5 : 7.5;
  const objetivo = new THREE.Vector3(J.x*0.85, Math.max(J.y, 0) + 4.3, J.z + lejos);
  camPos.lerp(objetivo, Math.min(1, dt*5));
  camara.position.copy(camPos);
  camMira.set(J.x*0.92, Math.max(J.y, -1) + 1.1, J.z - 4);
  camara.lookAt(camMira);
  luzSol.position.set(J.x + 20, 40, J.z + 10); luzSol.target.position.set(J.x, 0, J.z);
  renderer.render(escena, camara);
}

/* ---------------- El marcador en 2D ---------------- */
const CARA = {salomon: '🧒', primo: '🟢', mollejuo: '🍔', chinita: '👑', nublao: '⛈️', vecino: '🙂'};
const COLOR_PJ = {salomon: '#ff6b6b', primo: '#51cf66', mollejuo: '#ffa94d', chinita: '#ff9ed6', nublao: '#adb5bd', vecino: '#ffffff'};
function redondo(x, y, w, h, r){ ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); }
function textoEnvuelto(t, x, y, ancho, alto){
  const palabras = t.split(' '); let linea = '', lineas = [];
  for (const p of palabras){ const prueba = linea ? linea + ' ' + p : p; if (ctx.measureText(prueba).width > ancho && linea){ lineas.push(linea); linea = p; } else linea = prueba; }
  if (linea) lineas.push(linea);
  lineas.forEach((l, i)=>ctx.fillText(l, x, y + i*alto));
  return lineas.length;
}
function dibujarHUD(dt){
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const J = G.J, chico = Math.min(W, H) < 500;
  /* arriba a la izquierda: quién juega, la comida y las chispas */
  ctx.textBaseline = 'middle';
  redondo(10, 10, chico ? 190 : 250, 44, 12); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fill();
  ctx.font = 'bold ' + (chico ? 15 : 18) + 'px Fredoka, sans-serif'; ctx.fillStyle = COLOR_PJ[J.pj]; ctx.textAlign = 'left';
  ctx.fillText(CARA[J.pj] + ' ' + NOMBRES[J.pj], 20, 32);
  const fila = ['🍩 ' + G.comida];
  if (G.N.id===3) fila.push('⚡ ' + G.chispas + '/3');
  redondo(10, 60, chico ? 130 : 160, 34, 10); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = 'bold ' + (chico ? 15 : 17) + 'px Fredoka, sans-serif';
  ctx.fillText(fila.join('   '), 20, 78);
  /* el equipo: las caritas de los que están, la del que juega más grande */
  let ex = 20;
  for (const pj of ['salomon', 'primo', 'mollejuo']){
    const tiene = G.equipo.includes(pj);
    ctx.globalAlpha = tiene ? 1 : 0.25; ctx.font = (pj===J.pj ? 26 : 18) + 'px sans-serif';
    ctx.fillText(tiene ? CARA[pj] : '❔', ex, 118); ex += pj===J.pj ? 36 : 28;
  }
  ctx.globalAlpha = 1;
  /* el jefe: su barra */
  const jefe = G.N.nubes.find(n=>n.jefe);
  if (jefe && G.jefeActivo && jefe.vivo){
    const w = Math.min(320, W*0.6), x = (W - w)/2;
    redondo(x - 6, 14, w + 12, 30, 10); ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fill();
    ctx.fillStyle = '#495057'; ctx.fillRect(x, 30, w, 8);
    ctx.fillStyle = '#ffd43b'; ctx.fillRect(x, 30, w*jefe.hp/6, 8);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = 'bold 13px Fredoka, sans-serif'; ctx.fillText('⛈️ EL NUBLAO', W/2, 22);
  }
  /* viento */
  if (G.soplando && G.N.viento){ ctx.textAlign = 'center'; ctx.font = 'bold 22px Fredoka, sans-serif'; ctx.fillStyle = '#e7f5ff'; ctx.fillText(G.soplando > 0 ? '💨 ¡VENTARRÓN! → → →' : '← ← ← ¡VENTARRÓN! 💨', W/2, 64); }
  /* subtítulos: quien habla y lo que dice */
  if (subtitulos.length){
    const s = subtitulos[0]; s.t -= dt;
    /* en el celular va abajo, entre la palanca y los botones */
    let w = tactil ? Math.min(560, W - 400) : Math.min(640, W - 24);
    if (w < 280) w = Math.min(640, W - 24);
    ctx.font = (chico ? 15 : 18) + 'px Fredoka, sans-serif';
    const lineas = Math.ceil(ctx.measureText(s.texto).width/(w - 40)) + 1;
    const x = (W - w)/2, y = H - 14 - (36 + lineas*22);
    ctx.font = 'bold ' + (chico ? 15 : 18) + 'px Fredoka, sans-serif';
    redondo(x, y, w, 36 + lineas*22, 14); ctx.fillStyle = 'rgba(10,10,30,.78)'; ctx.fill();
    ctx.strokeStyle = COLOR_PJ[s.pj] || '#fff'; ctx.lineWidth = 3; ctx.stroke();
    ctx.textAlign = 'left'; ctx.fillStyle = COLOR_PJ[s.pj] || '#fff';
    ctx.fillText((CARA[s.pj]||'') + ' ' + s.quien, x + 14, y + 18);
    ctx.fillStyle = '#fff'; ctx.font = (chico ? 15 : 18) + 'px Fredoka, sans-serif';
    textoEnvuelto(s.texto, x + 14, y + 42, w - 28, 22);
    if (s.t <= 0) subtitulos.shift();
  }
  /* avisos de ayuda */
  if (aviso){
    aviso.t -= dt;
    ctx.font = 'bold ' + (chico ? 15 : 19) + 'px Fredoka, sans-serif'; ctx.textAlign = 'center';
    const w = Math.min(ctx.measureText(aviso.texto).width + 30, W - 20);
    redondo((W - w)/2, 132, w, 38, 12); ctx.fillStyle = 'rgba(255,212,59,.92)'; ctx.fill();
    ctx.fillStyle = '#212529'; textoEnvuelto(aviso.texto, W/2, 151, W - 40, 20);
    if (aviso.t <= 0) aviso = null;
  }
  /* el cartel grande del nivel */
  if (cartel){
    cartel.t -= dt;
    const a = Math.min(1, cartel.t*2);
    ctx.globalAlpha = a; ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(0, H*0.32, W, 110);
    ctx.fillStyle = '#ffd43b'; ctx.font = (chico ? 24 : 38) + 'px "Luckiest Guy", Fredoka, sans-serif';
    ctx.fillText(cartel.titulo, W/2, H*0.32 + 42);
    ctx.fillStyle = '#fff'; ctx.font = (chico ? 14 : 19) + 'px Fredoka, sans-serif';
    ctx.fillText(cartel.sub, W/2, H*0.32 + 82);
    ctx.globalAlpha = 1;
    if (cartel.t <= 0) cartel = null;
  }
  /* los controles táctiles */
  if (tactil){
    const p = TOQUE.palanca;
    if (p){
      ctx.beginPath(); ctx.arc(p.x0, p.y0, 50, 0, Math.PI*2); ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 2; ctx.stroke();
      let dx = p.x - p.x0, dy = p.y - p.y0; const k = Math.hypot(dx, dy); if (k > 50){ dx *= 50/k; dy *= 50/k; }
      ctx.beginPath(); ctx.arc(p.x0 + dx, p.y0 + dy, 24, 0, Math.PI*2); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
    } else {
      ctx.globalAlpha = 0.5; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.font = '14px Fredoka, sans-serif';
      ctx.fillText('👆 desliza aquí para caminar', W*0.2, H*0.62); ctx.globalAlpha = 1;
    }
  }
  dibujarBotones();
}
function dibujarBotones(){
  for (const b of BOTONES){
    if (!b.siempre && (!tactil || estado!=='juego')) continue;
    const p = b.pos(), on = [...TOQUE.botones.values()].includes(b);
    ctx.beginPath(); ctx.arc(p.x, p.y, b.r*(on ? 1.08 : 1), 0, Math.PI*2);
    ctx.fillStyle = b.color; ctx.fill(); ctx.strokeStyle = b.borde; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = 'bold ' + Math.round(b.r*0.75) + 'px Fredoka, sans-serif'; ctx.fillText(b.txt, p.x, p.y + 1);
    if (b.sub){ ctx.font = '11px Fredoka, sans-serif'; ctx.fillText(b.sub, p.x, p.y + b.r + 10); }
  }
}

/* ---------------- Pantalla de título y final ---------------- */
let tituloT = 0, tituloEscena = null;
function prepararTitulo(){
  G = crearPartida(0);
  G.eventos.length = 0;
  armarMundo();
  tituloEscena = new THREE.Group();
  ['salomon', 'primo', 'mollejuo', 'chinita'].forEach((pj, i)=>{ const m = modeloPj(pj); m.position.set(-2.4 + i*1.6, 0, -3); m.userData.i = i; tituloEscena.add(m); });
  mundo.raiz.add(tituloEscena);
  mundo.chinita && (mundo.chinita.visible = false);
  mundo.sombra.visible = false;
}
function cajasNivel(){
  const w = Math.min(120, (W - 60)/3), y = H*0.78, x0 = (W - (w*3 + 20))/2;
  return [0, 1, 2].map(i=>({x: x0 + i*(w + 10), y, w, h: 46, n: i}));
}
function clicTitulo(x, y){
  for (const c of cajasNivel()) if (x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h){ empezar(c.n); return; }
  empezar(nivelInicial);
}
function dibujarTitulo(dt){
  tituloT += dt;
  for (const m of tituloEscena.children){ m.rotation.y = Math.sin(tituloT*1.2 + m.userData.i)*0.5; m.userData.cuerpo.position.y = Math.abs(Math.sin(tituloT*3 + m.userData.i))*0.15; }
  camara.position.set(Math.sin(tituloT*0.3)*1.2, 1.8, 3.2); camara.lookAt(0, 1.0, -3);
  renderer.render(escena, camara);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
  const chico = W < 600;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(0, 0, W, chico ? 110 : 130);
  ctx.font = (chico ? 30 : 52) + 'px "Luckiest Guy", Fredoka, sans-serif';
  ctx.lineWidth = 6; ctx.strokeStyle = '#7a1c1c'; ctx.strokeText('SALOMÓN', W/2, chico ? 38 : 48);
  ctx.fillStyle = '#ffd43b'; ctx.fillText('SALOMÓN', W/2, chico ? 38 : 48);
  ctx.font = (chico ? 17 : 26) + 'px "Luckiest Guy", Fredoka, sans-serif'; ctx.fillStyle = '#fff';
  ctx.fillText('y los Primos del Puente', W/2, chico ? 78 : 100);
  ctx.font = (chico ? 13 : 16) + 'px Fredoka, sans-serif'; ctx.fillStyle = '#fff';
  ctx.fillText('¡Las nubes se robaron el relámpago del Catatumbo!', W/2, H*0.70);
  for (const c of cajasNivel()){
    redondo(c.x, c.y, c.w, c.h, 12); ctx.fillStyle = 'rgba(28,126,214,.85)'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold ' + (chico ? 13 : 16) + 'px Fredoka, sans-serif';
    ctx.fillText(['1 · Saladillo', '2 · El Puente', '3 · Catatumbo'][c.n], c.x + c.w/2, c.y + c.h/2);
  }
  ctx.globalAlpha = 0.6 + Math.sin(tituloT*4)*0.4; ctx.font = 'bold ' + (chico ? 16 : 20) + 'px Fredoka, sans-serif'; ctx.fillStyle = '#ffd43b';
  ctx.fillText(tactil ? 'Toca para jugar' : 'ENTER para jugar · 1 2 3 elige nivel', W/2, H*0.93); ctx.globalAlpha = 1;
  dibujarBotones();
}
function clicFin(x, y){ if (y > H*0.72) { if (x < W/2) empezar(0); else salir(); } }
function dibujarFin(dt){
  dibujar3D(dt);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
  const chico = W < 600;
  ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = (chico ? 28 : 46) + 'px "Luckiest Guy", Fredoka, sans-serif'; ctx.fillStyle = '#ffd43b';
  ctx.fillText('¡LA FERIA SE PRENDIÓ!', W/2, H*0.2);
  ctx.font = (chico ? 16 : 21) + 'px Fredoka, sans-serif'; ctx.fillStyle = '#fff';
  ctx.fillText('El relámpago del Catatumbo volvió a brillar ⚡', W/2, H*0.3);
  const filas = ['🍩 Comidas: ' + G.comidoTotal, '☁️ Nubes vencidas: ' + G.nubesVencidas, '⭐ Puntos: ' + G.puntos];
  filas.forEach((f, i)=>ctx.fillText(f, W/2, H*0.42 + i*34));
  ctx.font = 'bold ' + (chico ? 15 : 19) + 'px Fredoka, sans-serif';
  for (const [i, txt] of ['🔁 Jugar otra vez', '🏠 Fernando Bros'].entries()){
    const w = Math.min(220, W*0.42), x = i ? W/2 + 10 : W/2 - 10 - w;
    redondo(x, H*0.76, w, 50, 14); ctx.fillStyle = i ? 'rgba(47,158,68,.9)' : 'rgba(28,126,214,.9)'; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillText(txt, x + w/2, H*0.76 + 25);
  }
  dibujarBotones();
}

/* ---------------- El ciclo ---------------- */
let ultimo = performance.now(), acumulado = 0;
prepararTitulo();
function ciclo(ahora){
  requestAnimationFrame(ciclo);
  const dt = Math.min(0.1, (ahora - ultimo)/1000); ultimo = ahora;
  if (estado==='titulo'){
    if (!tituloEscena || !tituloEscena.parent) prepararTitulo();
    leerEntrada(); dibujarTitulo(dt); return;
  }
  if (estado==='fin'){ leerEntrada(); dibujarFin(dt); return; }
  acumulado += dt;
  let ent = leerEntrada();
  while (acumulado >= DT){
    paso(G, ent); acumulado -= DT;
    ent = Object.assign({}, ent, {saltoPulsado: false, poder: false, cambiar: false});
  }
  atenderEventos();
  if (G.fase==='nivelListo'){
    finNivelT += dt;
    if (finNivelT > 4.5 && G.n < 2) empezar(G.n + 1, G);
  }
  if (estado==='juego'){ dibujar3D(dt); dibujarHUD(dt); }
}
requestAnimationFrame(ciclo);
})();
