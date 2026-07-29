'use strict';
/* ============================================================
   SALA ARCADE DE FERNANDO BROS
   Minijuegos con los personajes del juego:
     · FERNANDO BIRDS  (estilo Angry Birds)
     · FERNANDO DIG    (estilo Dig Dug)
     · FERNANDO KONG   (estilo Donkey Kong)
     · FERNANDO CONTRA (estilo Contra)
   ============================================================ */
var MJ = (function(){   // var: seguro para 'typeof MJ' desde game.js

const JUEGOS = [
  {id:'birds',  nombre:'FERNANDO BIRDS',  emoji:'🐦', color:'#2a8a4a',
   corto:'BIRDS', desc:'Tiros infinitos · poder de cada perrito en el aire'},
  {id:'dig',    nombre:'FERNANDO DIG',    emoji:'⛏️', color:'#a05a28',
   corto:'DIG', desc:'Cava e infla goombas · poder: pedo de tío Fran'},
  {id:'kong',   nombre:'FERNANDO KONG',   emoji:'🛢️', color:'#2a5ab0',
   corto:'KONG', desc:'Sube hasta mamá · poder: martillo pichunguito'},
  {id:'contra', nombre:'FERNANDO CONTRA', emoji:'🔫', color:'#7a2a8a',
   corto:'CONTRA', desc:'Dispara hasta el jefe · poder: perrito rojo gigante'},
  {id:'globos', nombre:'FERNANDO GLOBOS', emoji:'🎈', color:'#2a6ad0',
   corto:'GLOBOS', desc:'Vuela con globos · poder: impulso pedorro'},
  {id:'bomba',  nombre:'FERNANDO BOMBAS',  emoji:'💣', color:'#a02a3a',
   corto:'BOMBAS', desc:'Bombas y poderes · poder: súper pedo en cruz'},
  {id:'hielo',  nombre:'FERNANDO HIELO',   emoji:'🧊', color:'#2a8aa0',
   corto:'HIELO', desc:'Sube hasta Cucú · poder: salto de papá'},
  {id:'torre',  nombre:'FERNANDO TORRE',   emoji:'🏰', color:'#2a6f26',
   corto:'TORRE', desc:'Pon a Penny y Tío Juan a frenar goombas'},
  {id:'nieve',  nombre:'FERNANDO NIEVE',   emoji:'🎿', color:'#3a7ab0',
   corto:'NIEVE', desc:'Baja la montaña esquivando pinos'},
  {id:'luna',   nombre:'FERNANDO LUNA',    emoji:'🚀', color:'#3a2a7a',
   corto:'LUNA', desc:'Aluniza suavecito en las plataformas'},
  {id:'corre',  nombre:'FERNANDO RUNNER',  emoji:'🏃', color:'#2a4a9a',
   corto:'RUNNER', desc:'Corre sin parar por tres carriles'},
  {id:'flappy', nombre:'FLAPPY FERNANDO',  emoji:'🐤', color:'#2a8ad0',
   corto:'FLAPPY', desc:'Aletea y pasa entre los tubos'},
  {id:'coco',   nombre:'FERNANDO-MAN',     emoji:'🟡', color:'#1a2a8a',
   corto:'COCO', desc:'Cómete las hamburguesas del laberinto'},
  {id:'mega',   nombre:'FERNANDO MEGA',    emoji:'🤖', color:'#3a2a6a',
   corto:'MEGA', desc:'Vence al jefe y róbale su poder'},
  {id:'burger', nombre:'FERNANDO BURGER',  emoji:'🍔', color:'#8a5a1a',
   corto:'BURGER', desc:'Arma las hamburguesas de tío Juan'},
  {id:'survivor',nombre:'FERNANDO SÚPER',  emoji:'🧛', color:'#1a5a2a',
   corto:'SÚPER', desc:'Solo muévete: el arma dispara sola'},
  {id:'jeep',   nombre:'FERNANDO JEEP',    emoji:'🚙', color:'#3a5a1a',
   corto:'JEEP', desc:'Rescata a tus amigos en el jeep'},
  {id:'mappy',  nombre:'FERNANDO MAPPY',   emoji:'🐭', color:'#5a2a8a',
   corto:'MAPPY', desc:'Tirolinas y portazos a los gatos'},
  {id:'circo',  nombre:'FERNANDO CIRCO',   emoji:'🎪', color:'#8a1a4a',
   corto:'CIRCO', desc:'Aros de fuego y balancín con globos'},
  {id:'patos',    nombre:'FERNANDO PATOS',    emoji:'🦆', color:'#2a6ad0',
   corto:'PATOS', desc:'Tócalos al vuelo · Penny se ríe si fallas'},
  {id:'isla',     nombre:'FERNANDO ISLA',     emoji:'🏝️', color:'#2a8a4a',
   corto:'ISLA', desc:'Corre comiendo fruta o se acaba la energía'},
  {id:'galaxia',  nombre:'FERNANDO GALAXIA',  emoji:'👾', color:'#2a2a7a',
   corto:'GALAXIA', desc:'Nave con barra de mejoras y nave madre'},
  {id:'lucha',    nombre:'FERNANDO LUCHA',    emoji:'🥊', color:'#a04a1a',
   corto:'LUCHA', desc:'Pelea uno a uno con golpe especial'},
  {id:'vagoneta', nombre:'VAGONETA',          emoji:'🚃', color:'#6a3a1a',
   corto:'VAGONETA', desc:'La vagoneta de Sheldon: solo saltar'},
  {id:'jam',      nombre:'FERNANDO JAM',      emoji:'🏀', color:'#c8853a',
   corto:'JAM', desc:'2 contra 2 y a los 3 aciertos ¡fuego!'},
  {id:'fcero',    nombre:'FERNANDO F-CERO',   emoji:'🏎️', color:'#6a1a8a',
   corto:'F-CERO', desc:'Carrera futurista con turbo'},
  {id:'bananas',  nombre:'BANANAS',           emoji:'🍌', color:'#3a3a8a',
   corto:'BANANAS', desc:'Ángulo y fuerza contra tío Fran'},
  {id:'quake',    nombre:'FERNANDO 3D',       emoji:'🧱', color:'#1a3a5a',
   corto:'3D', desc:'Laberinto en primera persona'},
];
const COLS_ARCADE = 7;
let sel = 0, modo = null, T = 0, msg = '', msgT = 0, resultado = 0, finDicho = false;
/* controles: la flecha arriba sirve para SUBIR, nunca para saltar */
const mIzq   = ()=> keys['arrowleft']||keys['a']||mando['arrowleft'];
const mDer   = ()=> keys['arrowright']||keys['d']||mando['arrowright'];
const mArr   = ()=> keys['arrowup']||keys['w']||mando['arrowup'];
const mAbj   = ()=> keys['arrowdown']||keys['s']||mando['arrowdown'];
const mSalta = ()=> keys[' ']||keys['z']||mando[' '];
const mAccion= ()=> keys['shift']||keys['x']||mando['shift'];
let puntosMJ = 0;               /* marcador propio de cada partida */
function sumar(n){ puntosMJ += n; puntos += n; }

/* ---------- voces de verdad ----------
   Todas estas frases son grabaciones que ya existen en CLIPS (game.js), así que
   suenan con la voz de niño de siempre y no hace falta generar nada nuevo.
   Si alguna se cambia, hay que respetar el texto EXACTO o el juego se pasa a la
   voz sintética del navegador. */
const VOZ = {
  vamos:      '¡Fernando Bros! ¡Vamos Penny y Sheldon!',
  hongo:      '¡Soy el pichunguito de tío Juan!',
  fuego:      '¡Fuego pichunguito!',
  gracias:    '¡Gracias tío Juan!',
  hamburguesa:'¡Qué rica hamburguesa!',
  santi:      'Te amo Santi, mi hermanito',
  cucu:       'Hola Cucú, acompáñame',
  abu:        'Te amo Abu',
  graciasAbu: '¡Gracias Abu!',
  tioJuan:    'Te amo tío Juan, yo soy tu pichunguito',
  campeon:    '¡Muy bien, mi pichunguito! ¡Eres un campeón!',
  ganaste:    '¡Ganaste! ¡Te amo tío Juan!',
  luca:       '¡Luca! ¡Mi amigo pichunguito!',
  salomon:    '¡Salomón! ¡Juega conmigo, pichunguito!',
  pedo:       '¡Qué pedo tan grande, tío Fran!',
  mama:       '¡Te amo mamá!',
  papa:       '¡Papá, mira cómo salto de alto!',
  pichungazo: '¡Toma, pichungazo!',
  ataque:     '¡Pichunguito al ataque!',
  yanny:      '¡Hola mi amor! ¡Soy tía Yanny!',
  nacho:      '¡Épale! ¡Aquí viene tío Nacho!',
  romulo:     '¡Brrrp! ¡Qué rica cerveza! ¡Ay, qué pena!',
  gane:       '¡Gané! ¡Soy el pichunguito campeón!',
  otraVez:    '¡Qué divertido! ¡Otra vez, otra vez!',
  perrito:    '¡Guau, guau! ¡Soy el perrito pichunguito!',
  volar:      '¡A volar, pichunguitos!',
  beto:       '¡Hola pichunguito! ¡Soy tío Beto!',
  giuliana:   '¡Un abrazo, pichunguito! ¡Soy tía Giuliana!',
};

/* ---------- niveles ----------
   Cada minijuego tiene tres niveles: al superar uno se vuelve a armar el
   escenario más difícil, sin perder los puntos, y solo al terminar el
   tercero aparece la pantalla de victoria. */
const MAXNIV = 6;
/* algunos juegos dan para más: la Torre tiene diez niveles, con mapa nuevo
   cada dos y defensores que se van desbloqueando */
const MAXJUEGO = {torre: 10};
const maxDe = id => MAXJUEGO[id] || MAXNIV;
const nivel = {};
const nivelDe = id => nivel[id] || 1;
function pasarNivel(id, iniciar, finModo, frase){
  const tope = maxDe(id);
  if (nivelDe(id) < tope){
    nivel[id] = nivelDe(id) + 1;
    sumar(1000); sfx.meta();
    hablar(VOZ.campeon);
    iniciar();
    aviso('🏅 ¡NIVEL '+nivel[id]+' DE '+tope+'! Ahora un poquito más difícil', 2.6);
    cortina = 34;
  } else {
    resultado = 1; modo = finModo; sfx.meta();
    if (frase) hablar(frase);
  }
}
const etiquetaNivel = id => 'NIV '+nivelDe(id)+'/'+maxDe(id);

/* ---------- el elenco de Fernando Bros ----------
   En cada nivel de cada minijuego aparece un amigo distinto al que hay que
   rescatar (o que acompaña a Fernando). Así van saliendo todos. */
const AMIGOS = [
  {id:'santi',    nombre:'SANTI',        frase:VOZ.santi,
   dib:(x,y,t)=>dibSanti(x,y,t)},
  {id:'cucu',     nombre:'CUCÚ',         frase:VOZ.cucu,
   dib:(x,y,t)=>dibCucu(x,y,1,t)},
  {id:'penny',    nombre:'PENNY',        frase:VOZ.vamos,
   dib:(x,y,t)=>{ ctx.save(); ctx.translate(x,y+10); dibPerroSolo('#222'); ctx.restore(); }},
  {id:'sheldon',  nombre:'SHELDON',      frase:VOZ.vamos,
   dib:(x,y,t)=>{ ctx.save(); ctx.translate(x,y+10); dibPerroSolo('#8a5a2a'); ctx.restore(); }},
  {id:'luca',     nombre:'LUCA',         frase:VOZ.luca,
   dib:(x,y,t)=>dibLuca(x,y,t,1)},
  {id:'salomon',  nombre:'SALOMÓN',      frase:VOZ.salomon,
   dib:(x,y,t)=>dibSalomon(x,y,t,1)},
  {id:'abu',      nombre:'ABU',          frase:VOZ.abu,
   dib:(x,y,t)=>dibAbu(x,y,1,t,true)},
  {id:'tiofran',  nombre:'TÍO FRAN',     frase:VOZ.pedo,
   dib:(x,y,t)=>dibTioFran(x,y,t,false)},
  {id:'mama',     nombre:'MAMÁ',         frase:VOZ.mama,
   dib:(x,y,t)=>dibMama(x,y,t)},
  {id:'papa',     nombre:'PAPÁ',         frase:VOZ.papa,
   dib:(x,y,t)=>dibPapa(x,y,t)},
  {id:'yanny',    nombre:'TÍA YANNY',    frase:VOZ.yanny,
   dib:(x,y,t)=>dibYanny(x,y,t)},
  {id:'nacho',    nombre:'TÍO NACHO',    frase:VOZ.nacho,
   dib:(x,y,t)=>dibNacho(x,y,t)},
  {id:'beto',     nombre:'TÍO BETO',     frase:VOZ.beto,
   dib:(x,y,t)=>dibBeto(x,y,t)},
  {id:'giuliana', nombre:'TÍA GIULIANA', frase:VOZ.giuliana,
   dib:(x,y,t)=>dibGiuliana(x,y,t)},
  {id:'romulo',   nombre:'RÓMULO',       frase:VOZ.romulo,
   dib:(x,y,t)=>dibRomulo(x,y,t)},
  {id:'tiojuan',  nombre:'TÍO JUAN',     frase:VOZ.tioJuan,
   dib:(x,y,t)=>dibTioJuan(x,y,t)},
];
const DESFASE = {birds:0, dig:2, kong:5, contra:7, globos:9, bomba:11, hielo:13,
                 torre:1, nieve:4, luna:8, corre:3, flappy:6, coco:12,
                 mega:10, burger:14, survivor:15, jeep:5, mappy:2, circo:9,
                 patos:3, isla:7, galaxia:11, lucha:0, vagoneta:6, jam:12,
                 fcero:1, bananas:8, quake:4};
function amigoDeNivel(juego, n){
  /* en Kong mamá princesa ya espera arriba, así que ella no entra en el sorteo */
  const lista = juego==='kong' ? AMIGOS.filter(a=>a.id!=='mama') : AMIGOS;
  return lista[((DESFASE[juego]||0) + (n||1) - 1) % lista.length];
}
/* un amigo esperando a que Fernando lo rescate */
function nuevoRescate(juego, x, y){
  return {a: amigoDeNivel(juego, nivelDe(juego)), x, y, salvado:false};
}
function dibRescate(r){
  if (!r || r.salvado) return;
  const f = Math.sin(T/12)*3;
  ctx.globalAlpha = 0.32+Math.sin(T/8)*0.2;
  ctx.strokeStyle='#ffe36e'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.arc(r.x+13, r.y+18+f, 32, 0, Math.PI*2); ctx.stroke();
  ctx.globalAlpha = 1;
  r.a.dib(r.x, r.y+f, T);
  letrero(r.x+13, r.y-18+f, r.a.nombre, '#ffe36e');
}
function rescatar(r, px, py, radio){
  if (!r || r.salvado) return false;
  const rr = radio || 34;
  if (Math.abs(px-(r.x+13)) > rr || Math.abs(py-(r.y+18)) > rr+12) return false;
  r.salvado = true; sumar(1500); sfx.poder(); sacudir(3);
  hablar(r.a.frase);
  aviso('🤗 ¡RESCATASTE A '+r.a.nombre+'! +1500', 2.4);
  for(let i=0;i<12;i++) parts.push({tipo:'estrellita', x:r.x+13, y:r.y+16,
    vx:(Math.random()-0.5)*6, vy:-2-Math.random()*3, t:36});
  return true;
}

/* ---------- utilidades ---------- */
const HUD2 = 44;
function texto(t, x, y, tam, color, centro){
  ctx.font = 'bold '+tam+'px monospace';
  ctx.textAlign = centro ? 'center' : 'left';
  ctx.fillStyle = '#000'; ctx.fillText(t, x+2, y+2);
  ctx.fillStyle = color || '#fff'; ctx.fillText(t, x, y);
  ctx.textAlign = 'left';
}
function aviso(t, seg){ msg = t; msgT = (seg||2)*60; }
function hudMJ(titulo, izqTxt, derTxt){
  ctx.fillStyle='rgba(8,10,24,0.92)'; ctx.fillRect(0,0,W,HUD2);
  const acc = ctx.createLinearGradient(0,0,W,0);
  acc.addColorStop(0,'#d82800'); acc.addColorStop(0.5,'#f8b800'); acc.addColorStop(1,'#2a6ad0');
  ctx.fillStyle=acc; ctx.fillRect(0,HUD2-3,W,3);
  texto(titulo, 16, 29, 17, '#f8b800');
  /* los dos rótulos se encogen si hace falta, para no encimarse nunca */
  const cabe = (t, tam, max) => {
    let f = tam;
    ctx.font = 'bold '+f+'px monospace';
    while (f > 9 && ctx.measureText(t).width > max){ f -= 0.5; ctx.font = 'bold '+f+'px monospace'; }
    return f;
  };
  if (izqTxt) texto(izqTxt, 248, 29, cabe(izqTxt, 16, 336), '#fff');
  if (derTxt) texto(derTxt, 596, 28, cabe(derTxt, 13, 216), '#8ecbff');
  const z = zonaSalir();
  ctx.fillStyle='rgba(255,255,255,0.16)';
  ctx.beginPath(); ctx.roundRect(z.x, z.y, z.w, z.h, 11); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=2; ctx.stroke();
  texto('✕ SALIR', z.x+z.w/2, z.y+23, 16, '#fff', true);
}
function zonaSalir(){ return {x: W-138, y: 5, w: 126, h: 34}; }
/* botón de volver de la propia sala arcade (aquí no hay marcador) */
function zonaVolver(){ return {x: 22, y: 12, w: 148, h: 40}; }
/* al tocar con el dedo se admite un margen de sobra alrededor del botón */
const enZona = (z, x, y, m) => {
  m = m===undefined ? 20 : m;
  return x>=z.x-m && x<=z.x+z.w+m && y>=z.y-m && y<=z.y+z.h+m;
};

/* ---------- vidas infinitas ----------
   En los minijuegos nadie pierde nunca: un golpe solo cuesta un susto,
   deja a Fernando parpadeando un rato y lo devuelve a un sitio seguro. */
function susto(obj, frase){
  obj.sustos = (obj.sustos||0) + 1;
  sfx.dano(); sacudir(4);
  aviso(frase || '¡Ay! Vidas infinitas: sigue jugando', 1.4);
}
const corazonesInf = obj => '♥∞ 😵'+(obj.sustos||0);

/* nube de pedo reutilizable (el poder favorito de tío Fran) */
function nubePedo(x, y, n){
  for(let i=0;i<(n||10);i++)
    parts.push({tipo:'pedo', x:x+(Math.random()-0.5)*26, y:y+(Math.random()-0.5)*18,
                vx:(Math.random()-0.5)*2.6, vy:-0.5-Math.random()*1.1, t:34+((Math.random()*20)|0)});
}

/* medidor del poder de cada minijuego, abajo a la derecha */
function barraPoder(nombre, frac, encendido){
  const w = 250, x = W-w-16, y = H-42;
  ctx.fillStyle = 'rgba(8,10,24,0.72)';
  ctx.beginPath(); ctx.roundRect(x, y, w, 30, 9); ctx.fill();
  ctx.strokeStyle = encendido ? '#ffe36e' : 'rgba(255,255,255,0.32)';
  ctx.lineWidth = encendido ? 3 : 2; ctx.stroke();
  const bx = x+10, bw = w-20;
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.beginPath(); ctx.roundRect(bx, y+20, bw, 6, 3); ctx.fill();
  ctx.fillStyle = encendido ? '#ffe36e' : (frac>=1 ? '#5ee08a' : '#8ecbff');
  ctx.beginPath(); ctx.roundRect(bx, y+20, bw*Math.max(0,Math.min(1,frac)), 6, 3); ctx.fill();
  /* el rótulo se encoge solito para no salirse nunca del recuadro */
  let tam = 13;
  ctx.font = 'bold '+tam+'px monospace';
  while (tam > 8 && ctx.measureText(nombre).width > w-18){ tam -= 0.5; ctx.font = 'bold '+tam+'px monospace'; }
  texto(nombre, x+w/2, y+15, tam, frac>=1||encendido ? '#ffe36e' : '#cfd8ff', true);
}
function pantallaFin(gano, titulo, sub){
  if (!finDicho){ finDicho = true; hablar(gano ? VOZ.ganaste : VOZ.otraVez); }
  const g = ctx.createLinearGradient(0,0,0,H);
  if (gano){ g.addColorStop(0,'#0a3a1a'); g.addColorStop(1,'#2a8a4a'); }
  else { g.addColorStop(0,'#3a0a1a'); g.addColorStop(1,'#8a2a3a'); }
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  texto(gano ? '🏆 '+titulo : titulo, W/2, 200, 46, gano?'#ffe36e':'#ffb0b0', true);
  texto(sub, W/2, 260, 20, '#fff', true);
  texto('PUNTOS: '+puntosMJ, W/2, 320, 22, '#8ecbff', true);
  if ((T>>4)%2===0) texto('ENTER o toca para volver a la sala', W/2, 420, 20, '#fff', true);
}
/* control táctil propio (arrastrar en Birds) */
let pt = {x:0, y:0, abajo:false, soltado:false};
try{
  const rel = e => {
    const r = cv.getBoundingClientRect();
    return { x:(e.clientX-r.left)*(W/r.width), y:(e.clientY-r.top)*(H/r.height) };
  };
  cv.addEventListener('pointerdown', e=>{ if(!activo()) return; const p=rel(e); pt.x=p.x; pt.y=p.y; pt.abajo=true; });
  cv.addEventListener('pointermove', e=>{ if(!activo()||!pt.abajo) return; const p=rel(e); pt.x=p.x; pt.y=p.y; });
  cv.addEventListener('pointerup',   e=>{ if(!activo()) return; if(pt.abajo){ pt.abajo=false; pt.soltado=true; } });
}catch(e){}

/* ============================================================
   1) FERNANDO BIRDS
   ============================================================ */
const B = { proy:null, extras:[], cajas:[], bichos:[], tiros:3, listos:[], apunta:false, ang:-0.6, fza:0,
            fase:'espera', disparos:0, podPrev:false, sustos:0 };
/* quién se puede lanzar con la resortera, y qué hace su poder */
const ELENCO_B = ['penny','sheldon','cucu','luca','salomon','tiofran','santi'];
const PODER_B = {
  penny:   '🚀 PENNY COHETE',
  sheldon: '💨 PEDO DE SHELDON',
  cucu:    '👧 CUCÚ POR TRES',
  luca:    '⚽ LUCA PELOTA',
  salomon: '🪨 SALOMÓN EN PICADA',
  tiofran: '💥 PEDAZO DE PEDO',
  santi:   '👶 SANTI TALADRO',
};
const SUELO_B = 470;
/* nombre del perrito que toca lanzar (los tiros son infinitos y van rotando) */
const bichoTurno = () => B.listos[B.disparos % B.listos.length];
function iniciarBirds(){
  B.tiros = 0; B.fase='espera'; B.proy=null; B.extras=[]; B.ang=-0.6; B.fza=0; B.apunta=false; B.finT=undefined;
  B.disparos = 0; B.podPrev = false; B.sustos = 0;
  /* el elenco lanzable crece con el nivel: cada uno con su propio poder */
  B.listos = ELENCO_B.slice(0, Math.min(ELENCO_B.length, 2 + nivelDe('birds')));
  B.cajas = []; B.bichos = [];
  const N = nivelDe('birds');
  const base = 520;
  /* torres de cajas con goombas dentro; cada nivel añade una torre y un goomba */
  const col = (x, n, y0) => { for(let i=0;i<n;i++) B.cajas.push({x, y:y0-i*36, w:36, h:36, vx:0, vy:0, vida:2}); };
  const alto = 2 + N;                                   /* 3, 4 y 5 cajas de alto */
  col(base, alto, SUELO_B-36); col(base+150, alto, SUELO_B-36);
  for(let i=0;i<4;i++) B.cajas.push({x:base+i*38, y:SUELO_B-36*alto-36, w:36, h:36, vx:0, vy:0, vida:2});
  col(base+300, alto-1, SUELO_B-36);
  if (N>=2) col(base+225, 2, SUELO_B-36);
  if (N>=3) col(base+375, 3, SUELO_B-36);
  B.bichos.push({x:base+46, y:SUELO_B-30, vx:0, vy:0, vivo:true});
  B.bichos.push({x:base+96, y:SUELO_B-30, vx:0, vy:0, vivo:true});
  B.bichos.push({x:base+60, y:SUELO_B-36*(alto+1)-30, vx:0, vy:0, vivo:true});
  B.bichos.push({x:base+310, y:SUELO_B-36*(alto-1)-30, vx:0, vy:0, vivo:true});
  if (N>=2) B.bichos.push({x:base+235, y:SUELO_B-36*2-30, vx:0, vy:0, vivo:true});
  if (N>=3) B.bichos.push({x:base+385, y:SUELO_B-36*3-30, vx:0, vy:0, vivo:true},
                          {x:base+146, y:SUELO_B-30, vx:0, vy:0, vivo:true});
  aviso('¡Arrastra y suelta! En pleno vuelo toca otra vez: cada perrito tiene su poder', 4);
}
/* ---- poderes en el aire: uno distinto por personaje ---- */
function poderBird(p){
  if (p.usado) return;
  p.usado = true;
  if (p.tipo==='penny'){                       /* Penny cohete */
    const m = Math.hypot(p.vx, p.vy) || 1;
    p.vx = p.vx/m*23; p.vy = p.vy/m*23;
    sfx.fuego(); aviso('🚀 ¡PENNY COHETE!', 1.4); hablar(VOZ.vamos);
    for(let i=0;i<8;i++) parts.push({tipo:'estrellita', x:p.x, y:p.y,
      vx:-p.vx*0.2+(Math.random()-0.5)*2, vy:-p.vy*0.2+(Math.random()-0.5)*2, t:24});
  } else if (p.tipo==='sheldon'){              /* Sheldon pedorro */
    nubePedo(p.x, p.y, 18); sfx.pedo(); sacudir(6);
    for(const c of B.cajas){
      const d = Math.hypot(c.x+18-p.x, c.y+18-p.y);
      if (d < 155){ c.vida--; c.vx += (c.x+18-p.x)/(d||1)*7; c.vy += (c.y+18-p.y)/(d||1)*6 - 2.5; }
    }
    for(const b of B.bichos)
      if (b.vivo && Math.hypot(b.x-p.x, b.y-p.y) < 115){ b.vivo = false; sumar(500); sfx.pisoton(); }
    p.vx *= 0.25; p.vy = -2.5;
    aviso('💨 ¡Qué pedo tan grande, tío Fran!', 2);
    hablar(VOZ.pedo);
  } else if (p.tipo==='cucu'){                 /* Cucú se multiplica por tres */
    for(const giro of [-0.32, 0.32]){
      const co = Math.cos(giro), si = Math.sin(giro);
      B.extras.push({x:p.x, y:p.y, vx:p.vx*co - p.vy*si, vy:p.vx*si + p.vy*co,
                     tipo:'cucu', t:p.t, espera:0, usado:true});
    }
    sfx.huevo(); aviso('👧 ¡CUCÚ SE MULTIPLICA POR TRES!', 1.8); hablar(VOZ.cucu);
  } else if (p.tipo==='luca'){                 /* Luca rebota como una pelota */
    p.pelota = true; p.vy = -Math.abs(p.vy) - 6; p.vx *= 1.25;
    sfx.salto(); aviso('⚽ ¡LUCA PELOTA! Rebota y rebota', 1.6); hablar(VOZ.luca);
  } else if (p.tipo==='salomon'){              /* Salomón cae a plomo */
    p.vx *= 0.35; p.vy = 21; p.pesado = true;
    sfx.pisoton(); aviso('🪨 ¡SALOMÓN EN PICADA!', 1.6); hablar(VOZ.salomon);
  } else if (p.tipo==='tiofran'){              /* el pedo más grande de todos */
    nubePedo(p.x, p.y, 30); sfx.pedo(); sacudir(9);
    for(const c of B.cajas){
      const d = Math.hypot(c.x+18-p.x, c.y+18-p.y);
      if (d < 240){ c.vida -= 2; c.vx += (c.x+18-p.x)/(d||1)*9; c.vy += (c.y+18-p.y)/(d||1)*8 - 3; }
    }
    for(const b of B.bichos)
      if (b.vivo && Math.hypot(b.x-p.x, b.y-p.y) < 190){ b.vivo = false; sumar(500); sfx.pisoton(); }
    p.vx *= 0.2; p.vy = -3;
    aviso('💥 ¡QUÉ PEDO TAN GRANDE, TÍO FRAN!', 2.2);
    hablar(VOZ.pedo);
  } else {                                     /* Santi atraviesa las cajas */
    p.taladro = 140;
    sfx.moneda(); aviso('👶 ¡SANTI TALADRO! Atraviesa las cajas', 1.8); hablar(VOZ.santi);
  }
}
/* física de un proyectil; devuelve false cuando ya terminó su vuelo */
function fisicaProy(p){
  if (p.espera>0) p.espera--;
  if (p.taladro>0) p.taladro--;
  p.vy += p.pesado ? 0.9 : 0.42; p.x += p.vx; p.y += p.vy; p.t++;
  if (p.y > SUELO_B-14){
    p.y = SUELO_B-14;
    p.vy *= p.pelota ? -0.92 : -0.42;           /* Luca rebota casi sin perder fuerza */
    p.vx *= p.pelota ? 0.97 : 0.7;
  }
  for(const c of B.cajas){
    if (p.x+12>c.x && p.x-12<c.x+c.w && p.y+12>c.y && p.y-12<c.y+c.h){
      if (p.espera>0) continue;                 /* evita golpear 60 veces por segundo */
      if (p.taladro>0){                         /* Santi taladro: rompe y sigue de largo */
        c.vida--; c.vx += p.vx*0.3; c.vy -= 1;
        p.espera = 5; sfx.romper(); sacudir(2);
        continue;
      }
      p.espera = 8;
      const fuerza = Math.hypot(p.vx,p.vy);
      c.vx += p.vx*0.5; c.vy += p.vy*0.4 - 1.5;
      if (fuerza>6.5){ c.vida--; sacudir(3); }
      /* salir por el lado por donde entró */
      if (Math.abs(p.vx) > Math.abs(p.vy)) p.x = p.vx>0 ? c.x-13 : c.x+c.w+13;
      else p.y = p.vy>0 ? c.y-13 : c.y+c.h+13;
      p.vx *= -0.3; p.vy *= 0.45;
      sfx.romper();
    }
  }
  for(const b of B.bichos){
    if (b.vivo && Math.abs(p.x-b.x)<24 && Math.abs(p.y-b.y)<24){
      b.vivo=false; sumar(500); sfx.pisoton(); sacudir(4);
      for(let i=0;i<6;i++) parts.push({tipo:'estrellita', x:b.x, y:b.y, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*3, t:34});
    }
  }
  if (p.x>W+400 || p.x<-200) return false;
  if (p.t>260 || (Math.abs(p.vx)<0.4 && Math.abs(p.vy)<0.5 && p.y>=SUELO_B-16)) return false;
  return true;
}
function updateBirds(){
  const RES = {x:150, y:SUELO_B-90};
  /* apuntar */
  if (B.fase==='espera'){
    if (pt.abajo){
      B.apunta = true;
      const dx = RES.x-pt.x, dy = RES.y-pt.y;
      B.ang = Math.atan2(dy, dx);
      B.fza = Math.min(Math.hypot(dx,dy)/9, 20);
    } else if (B.apunta && B.fza>2){
      B.apunta = false;
      B.proy = {x:RES.x, y:RES.y, vx:Math.cos(B.ang)*B.fza, vy:Math.sin(B.ang)*B.fza,
                tipo:bichoTurno(), t:0, espera:0};
      B.fase='vuela'; B.disparos++; B.tiros++; B.fza=0; sfx.salto();
    } else {
      B.apunta = false;
      /* control por teclas para quien juega sin pantalla táctil */
      if (mIzq()) B.ang -= 0.02;
      if (mDer()) B.ang += 0.02;
      if (mSalta()) B.fza = Math.min(B.fza+0.35, 20);
      else if (B.fza > 2){
        B.proy = {x:RES.x, y:RES.y, vx:Math.cos(B.ang)*B.fza, vy:Math.sin(B.ang)*B.fza,
                  tipo:bichoTurno(), t:0, espera:0};
        B.fase='vuela'; B.disparos++; B.tiros++; sfx.salto(); B.fza=0;
      }
    }
    pt.soltado = false;
    B.podPrev = mSalta() || mAccion();
  } else {
    /* en pleno vuelo, un toque (o A/B) activa el poder del personaje */
    const pulsa = mSalta() || mAccion();
    if ((pt.soltado || (pulsa && !B.podPrev)) && B.proy) poderBird(B.proy);
    pt.soltado = false;
    B.podPrev = pulsa;
  }
  /* proyectiles: el principal y las Cucús clonadas */
  if (B.proy && !fisicaProy(B.proy)) B.proy = null;
  for(const p of B.extras) p.fuera = !fisicaProy(p);
  B.extras = B.extras.filter(p=>!p.fuera);
  if (!B.proy && B.extras.length===0 && B.fase==='vuela') B.fase='espera';
  /* cajas: caída, apilado y rotura */
  for(const c of B.cajas){
    if (c.vida<=0) continue;
    c.vy += 0.42; c.x += c.vx; c.y += c.vy; c.vx *= 0.94;
    if (c.y+c.h > SUELO_B){ c.y = SUELO_B-c.h; c.vy = c.vy>3 ? -c.vy*0.2 : 0; c.vx *= 0.7; }
    for(const o of B.cajas){
      if (o===c || o.vida<=0) continue;
      if (c.x+c.w>o.x+4 && c.x<o.x+o.w-4 && c.y+c.h>o.y && c.y+c.h<o.y+o.h && c.vy>=0){
        c.y = o.y-c.h; c.vy = 0; c.vx *= 0.8;
      }
    }
  }
  B.cajas = B.cajas.filter(c=>{
    if (c.vida<=0){
      sumar(100);
      for(let i=0;i<4;i++) parts.push({tipo:'ladrillo', x:c.x+18, y:c.y+18, vx:(Math.random()-0.5)*5, vy:-2-Math.random()*3, t:40});
      return false;
    }
    return true;
  });
  /* bichos: caen con las cajas y mueren aplastados */
  for(const b of B.bichos){
    if (!b.vivo) continue;
    b.vy += 0.42; b.y += b.vy; b.x += b.vx; b.vx *= 0.93;
    if (b.y > SUELO_B-14){ b.y = SUELO_B-14; b.vy = 0; }
    for(const c of B.cajas){
      if (Math.abs(b.x-(c.x+18))<26 && b.y-c.y>-30 && b.y-c.y<8 && c.vy>4){
        b.vivo=false; sumar(500); sfx.pisoton();
      }
      if (b.x+12>c.x && b.x-12<c.x+c.w && b.y+14>c.y && b.y+14<c.y+c.h+6 && b.vy>=0){
        b.y = c.y-14; b.vy = 0;
      }
    }
  }
  /* fin: solo se gana; los lanzamientos son infinitos */
  const quedan = B.bichos.filter(b=>b.vivo).length;
  if (quedan===0 && !B.proy && B.extras.length===0){
    pasarNivel('birds', iniciarBirds, 'finBirds', VOZ.pichungazo);
  }
}
function drawBirds(){
  /* cielo y suelo */
  const g = ctx.createLinearGradient(0,0,0,SUELO_B);
  g.addColorStop(0,'#5c94fc'); g.addColorStop(1,'#a8dcf8');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,SUELO_B);
  ctx.fillStyle='#3fae2f'; ctx.fillRect(0,SUELO_B,W,H-SUELO_B);
  ctx.fillStyle='#2f8f22'; ctx.fillRect(0,SUELO_B,W,8);
  for(let i=0;i<8;i++){ ctx.fillStyle='rgba(255,255,255,0.85)';
    ctx.beginPath(); ctx.ellipse(120+i*230-(T*0.2)%1800, 90+(i%3)*40, 44, 15, 0, 0, Math.PI*2); ctx.fill(); }
  /* resortera */
  const RES = {x:150, y:SUELO_B-90};
  rect(RES.x-6, RES.y, 12, 90, '#8a5a2a');
  rect(RES.x-24, RES.y-34, 10, 40, '#8a5a2a');
  rect(RES.x+14, RES.y-34, 10, 40, '#8a5a2a');
  /* cajas */
  for(const c of B.cajas){
    rect(c.x, c.y, c.w, c.h, '#c88a3a');
    rect(c.x+2, c.y+2, c.w-4, 4, 'rgba(255,255,255,0.25)');
    rect(c.x+2, c.y+c.h-5, c.w-4, 3, 'rgba(0,0,0,0.3)');
    ctx.strokeStyle='#7a4a10'; ctx.lineWidth=2; ctx.strokeRect(c.x+1, c.y+1, c.w-2, c.h-2);
  }
  /* goombas */
  for(const b of B.bichos) if (b.vivo){ sombra(b.x, SUELO_B+2, 16); dibGoomba(b.x-13, b.y-12, T); }
  /* proyectiles */
  for(const p of (B.proy ? [B.proy].concat(B.extras) : B.extras)){
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.t*0.15);
    dibLanzable(p.tipo);
    ctx.restore();
    if (!p.usado){                                  /* aro que recuerda que tiene poder */
      ctx.strokeStyle='rgba(255,227,110,'+(0.45+Math.sin(T/5)*0.3)+')'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(p.x, p.y, 22+Math.sin(T/6)*2, 0, Math.PI*2); ctx.stroke();
    }
  }
  /* Fernando junto a la resortera */
  ctx.save(); ctx.translate(64, SUELO_B-52); ctx.scale(1.3,1.3); dibFernandoSolo(); ctx.restore();
  /* guía de puntería */
  if (B.fase==='espera'){
    const f = B.apunta ? B.fza : B.fza;
    if (f>1){
      ctx.fillStyle='rgba(255,255,255,0.55)';
      for(let i=1;i<=9;i++){
        const t2=i*4.2;
        ctx.beginPath();
        ctx.arc(RES.x+Math.cos(B.ang)*f*t2, RES.y+Math.sin(B.ang)*f*t2+0.21*t2*t2, 3.4, 0, Math.PI*2);
        ctx.fill();
      }
    }
  }
  /* a quién le toca lanzar (la munición nunca se acaba) */
  for(let i=0;i<3;i++){
    const t2 = B.listos[(B.disparos+i) % B.listos.length];
    ctx.save(); ctx.translate(40+i*38, SUELO_B+38); ctx.scale(i===0?1:0.7, i===0?1:0.7);
    ctx.globalAlpha = i===0 ? 1 : 0.5;
    dibLanzable(t2);
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  texto('∞', 40+3*38+4, SUELO_B+50, 24, '#ffe36e');
  const enVuelo = B.proy && !B.proy.usado;
  hudMJ('🐦 BIRDS', etiquetaNivel('birds')+'   GOOMBAS: '+B.bichos.filter(b=>b.vivo).length+'   TIROS: ∞', 'arrastra y suelta');
  barraPoder(enVuelo ? '¡TOCA YA! '+PODER_B[B.proy.tipo] : 'PODER: '+PODER_B[bichoTurno()],
             enVuelo ? 1 : 0.34, !!enVuelo);
}
/* cada personaje lanzable, dibujado centrado en el origen */
function dibLanzable(tipo){
  if (tipo==='penny'){ ctx.save(); ctx.translate(-13,-10); dibPerroSolo('#222'); ctx.restore(); }
  else if (tipo==='sheldon'){ ctx.save(); ctx.translate(-13,-10); dibPerroSolo('#8a5a2a'); ctx.restore(); }
  else if (tipo==='cucu') dibCucu(-11,-14,1,T);
  else if (tipo==='luca') dibLuca(-12,-17,T,1);
  else if (tipo==='salomon') dibSalomon(-12,-13,T,1);
  else if (tipo==='tiofran') dibTioFran(-14,-16,T,false);
  else {                                        /* Santi, en versión compacta */
    rect(-13,-4,26,16,'#8ecbff');
    rect(-8,-15,16,12,'#ffc8a0');
    rect(-8,-17,16,4,'#4a2f10');
    rect(-4,-11,2,2,'#222'); rect(2,-11,2,2,'#222');
    rect(-2,-7,4,2,'#e07a7a');
  }
}

/* ============================================================
   2) FERNANDO DIG  (estilo Dig Dug)
   ============================================================ */
const D = { g:[], jx:0, jy:0, dir:0, arpon:0, arponL:0, enem:[], rocas:[], px:0, py:0, vida:3, inv:0,
            disparoPrev:false, sustos:0, pedo:0, pedoCd:0, pedoPrev:false };
const PEDO_CD = 280;
const DC = 40, DW = 24, DH = 11, DY0 = 60;
function iniciarDig(){
  D.g = Array.from({length:DH}, (_,y)=> Array.from({length:DW}, (_,x)=> y<1 ? 0 : 1));
  D.jx = 2; D.jy = 1; D.dir = 1; D.arpon = 0; D.arponL = 0;
  D.px = D.jx*DC; D.py = DY0+D.jy*DC; D.vida = 3; D.inv = 0; D.disparoPrev = false;
  D.sustos = 0; D.pedo = 0; D.pedoCd = 0; D.pedoPrev = false;
  D.g[1][1] = 0; D.g[1][2] = 0; D.g[1][3] = 0;
  /* los goombas arrancan lejos de Fernando para que nadie muera de entrada */
  const N = nivelDe('dig');
  const sitios = [[18,4],[21,7],[9,9],[16,9],[21,2],[12,6],[6,7],[19,10],[14,3],[22,5]];
  D.enem = sitios.slice(0, Math.min(10, 2 + N*2)).map(([cx,cy])=>   /* de 4 a 10 goombas */
    ({x:cx*DC, y:DY0+cy*DC, vivo:true, infla:0, t:0, golpe:0}));
  /* cada goomba nace en un pasillito para que se mueva desde el primer momento */
  D.enem.forEach((e,i)=>{
    const cx=(e.x/DC)|0, cy=((e.y-DY0)/DC)|0;
    for(let o=-1;o<=1;o++) if (celdaLibre(cx+o,cy)) D.g[cy][cx+o]=0;
    e.fantasma = 0; e.atasco = 0; e.enTierra = false;
    e.tcx = undefined; e.ox = 0; e.oy = 0;
    e.espera = i*80;              /* así no salen todos a la vez por la tierra */
    e.vel = 1.25 + i*0.08 + Math.min(N-1,5)*0.17;   /* cada uno a su ritmo, más rápidos por nivel */
  });
  D.rocas = [{cx:6, cae:false, y:DY0+2*DC, quieta:false}, {cx:13, cae:false, y:DY0+4*DC, quieta:false},
             {cx:19, cae:false, y:DY0+7*DC, quieta:false}];
  if (N>=2) D.rocas.push({cx:10, cae:false, y:DY0+7*DC, quieta:false});
  if (N>=3) D.rocas.push({cx:16, cae:false, y:DY0+3*DC, quieta:false});
  /* el amigo del nivel, enterrado al fondo: hay que cavar hasta él */
  const rincones = [[22,8],[2,9],[22,2],[11,10],[6,3],[17,6]];
  const rc = rincones[(N-1) % rincones.length];
  D.amigo = nuevoRescate('dig', rc[0]*DC-13, DY0+rc[1]*DC-22);
  aviso('¡Cava y usa B para inflar! Con A sueltas el PEDO DE TÍO FRAN 💨', 4);
}
function celdaLibre(cx, cy){ return cx>=0 && cx<DW && cy>=0 && cy<DH; }
/* Un goomba recorre el túnel casilla a casilla: se fija una casilla contigua
   excavada como destino y no cambia de idea hasta llegar a su centro. Así
   avanza de verdad en vez de temblar en el borde entre dos casillas.
   Devuelve false si está encerrado y no tiene ninguna salida. */
function moverEnemDig(e, v){
  const llego = e.tcx===undefined ||
                (Math.abs(e.x-e.tcx*DC)<=v && Math.abs(e.y-(DY0+e.tcy*DC))<=v);
  if (llego){
    const ecx = Math.round(e.x/DC), ecy = Math.round((e.y-DY0)/DC);
    e.x = ecx*DC; e.y = DY0+ecy*DC;                  /* se centra en su casilla */
    const salidas = [];
    for(const [ox,oy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const tcx = ecx+ox, tcy = ecy+oy;
      if (celdaLibre(tcx,tcy) && D.g[tcy][tcx]===0) salidas.push({tcx, tcy, ox, oy});
    }
    if (!salidas.length){ e.tcx = undefined; return false; }
    /* no se da la vuelta si tiene otra salida: así recorre el túnel entero */
    const sinVolver = salidas.filter(s => !(s.ox === -(e.ox||0) && s.oy === -(e.oy||0)));
    const lista = sinVolver.length ? sinVolver : salidas;
    lista.sort((a,b) =>
      Math.hypot(a.tcx*DC-D.px, DY0+a.tcy*DC-D.py) - Math.hypot(b.tcx*DC-D.px, DY0+b.tcy*DC-D.py));
    const s = lista[0];
    e.tcx = s.tcx; e.tcy = s.tcy; e.ox = s.ox; e.oy = s.oy;
  }
  e.x += Math.max(-v, Math.min(v, e.tcx*DC - e.x));
  e.y += Math.max(-v, Math.min(v, DY0 + e.tcy*DC - e.y));
  return true;
}
function danoDig(){
  if (D.inv>0) return;
  D.inv = 120; susto(D, '¡Ay! Vidas infinitas: vuelves arriba y sigues');
  /* lo devuelve a la entrada para que pueda reorganizarse */
  D.px = 2*DC; D.py = DY0+DC;
}
function updateDig(){
  /* movimiento por rejilla suave */
  if (D.inv>0) D.inv--;
  const vel = 2.6;
  let mx=0, my=0;
  if (mIzq()) mx=-1; else if (mDer()) mx=1;
  else if (mArr()) my=-1; else if (mAbj()) my=1;
  if (mx){ D.dir = mx>0?1:3; D.px += mx*vel; }
  else if (my){ D.dir = my>0?2:0; D.py += my*vel; }
  D.px = Math.max(0, Math.min((DW-1)*DC, D.px));
  D.py = Math.max(DY0, Math.min(DY0+(DH-1)*DC, D.py));
  /* excavar */
  const cx = Math.round(D.px/DC), cy = Math.round((D.py-DY0)/DC);
  if (celdaLibre(cx,cy) && D.g[cy][cx]===1){ D.g[cy][cx]=0; sumar(10); }
  /* arpón / bomba de aire */
  if (mAccion() && !D.disparoPrev && D.arpon<=0){ D.arpon = 40; D.arponL = 0; sfx.fuego(); }
  D.disparoPrev = mAccion();
  if (D.arpon>0){
    D.arpon--;
    D.arponL = Math.min(D.arponL+7, 110);
    const dx=[0,1,0,-1][D.dir], dy=[-1,0,1,0][D.dir];
    for(const e of D.enem){
      if (!e.vivo) continue;
      for(let l=10; l<=D.arponL; l+=12){
        if (Math.abs(e.x-(D.px+dx*l))<20 && Math.abs(e.y-(D.py+dy*l))<20){
          e.infla += 0.06; e.golpe = 10;
          if (e.infla>=1){ e.vivo=false; sumar(800); sfx.pisoton(); sacudir(3);
            for(let i=0;i<8;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y, vx:(Math.random()-0.5)*5, vy:-2-Math.random()*3, t:34}); }
          break;
        }
      }
    }
  } else {
    D.arponL = 0;
    for(const e of D.enem) if (e.infla>0) e.infla = Math.max(0, e.infla-0.004);
  }
  /* ---- PODER: el pedo de tío Fran infla a todos los goombas de alrededor ---- */
  if (D.pedoCd>0) D.pedoCd--;
  if (mSalta() && !D.pedoPrev && D.pedo<=0 && D.pedoCd<=0){
    D.pedo = 80; D.pedoCd = PEDO_CD; sfx.pedo(); sacudir(5);
    aviso('💨 ¡PEDO DE TÍO FRAN!', 2);
    hablar(VOZ.pedo);
  }
  D.pedoPrev = mSalta();
  if (D.pedo>0){
    D.pedo--;
    if (D.pedo%4===0) nubePedo(D.px, D.py, 3);
    for(const e of D.enem){
      if (!e.vivo) continue;
      if (Math.hypot(e.x-D.px, e.y-D.py) < 175){
        e.infla += 0.022; e.golpe = 4;
        if (e.infla>=1){
          e.vivo = false; sumar(900); sfx.pisoton();
          for(let i=0;i<8;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y, vx:(Math.random()-0.5)*5, vy:-2-Math.random()*3, t:34});
        }
      }
    }
  }
  /* enemigos: persiguen por los túneles y, si se quedan encerrados,
     atraviesan la tierra hechos fantasmas, como en el Dig Dug de verdad */
  for(const e of D.enem){
    if (!e.vivo) continue;
    e.t++;
    if (e.golpe>0){ e.golpe--; continue; }
    const v = (e.vel || 1.35) + e.infla*0.25;
    if (e.fantasma>0){
      e.fantasma--;
      const dx = D.px-e.x, dy = D.py-e.y, d = Math.hypot(dx,dy) || 1;
      e.x += dx/d*0.95; e.y += dy/d*0.95;
      e.x = Math.max(0, Math.min((DW-1)*DC, e.x));
      e.y = Math.max(DY0, Math.min(DY0+(DH-1)*DC, e.y));
      /* al asomar a un túnel vuelve a ser goomba de carne y hueso */
      const cx3 = Math.round(e.x/DC), cy3 = Math.round((e.y-DY0)/DC);
      const dentro = !celdaLibre(cx3,cy3) || D.g[cy3][cx3]===1;
      if (dentro) e.enTierra = true;                 /* ya se metió en la tierra */
      /* solo vuelve a ser goomba normal al asomar a OTRO túnel */
      if (e.enTierra && !dentro){ e.fantasma = 0; e.enTierra = false; e.tcx = undefined; e.ox = 0; e.oy = 0; }
      else if (e.fantasma<=0 && e.enTierra) e.fantasma = 120;   /* no se materializa dentro de la tierra */
    } else {
      const avanza = moverEnemDig(e, v);
      e.atasco = avanza ? 0 : (e.atasco||0)+1;
      /* mientras persigue de cerca no hace falta trampa; si lleva cinco
         segundos lejos sin poder llegar, se cuela por dentro de la tierra */
      const lejos = Math.hypot(D.px-e.x, D.py-e.y) > 4*DC;
      e.espera = lejos ? (e.espera||0)+1 : 0;
      if (e.atasco > 40 || e.espera > 300){
        e.fantasma = 320; e.atasco = 0; e.espera = 0; e.tcx = undefined;
      }
    }
    /* los fantasmas no hacen daño hasta que salen a un túnel */
    if (!e.fantasma && Math.abs(e.x-D.px)<24 && Math.abs(e.y-D.py)<24 && e.infla<0.5) danoDig();
  }
  /* rocas: caen si les quitan el suelo y quedan enterradas al tocar tierra */
  for(const r of D.rocas){
    if (r.quieta) continue;
    const rcy = Math.round((r.y-DY0)/DC);
    if (!r.cae){
      /* basta con quitarle el suelo: tiembla un pestañeo y se viene abajo */
      if (celdaLibre(r.cx, rcy+1) && D.g[rcy+1][r.cx]===0){
        r.aviso = (r.aviso||0)+1;
        if (r.aviso>18) r.cae = true;             /* tiembla antes de caer, como en el original */
      } else r.aviso = 0;
      continue;
    }
    r.y += 9;
    const ncy = Math.round((r.y-DY0)/DC);
    for(const e of D.enem) if (e.vivo && Math.abs(e.x-r.cx*DC)<26 && Math.abs(e.y-r.y)<28){
      e.vivo=false; sumar(1000); sfx.romper(); sacudir(4);
    }
    if (Math.abs(D.px-r.cx*DC)<26 && Math.abs(D.py-r.y)<28) danoDig();
    if (r.y > DY0+(DH-1)*DC){ r.y = DY0+(DH-1)*DC; r.quieta = true; }
    else if (celdaLibre(r.cx, ncy+1) && D.g[ncy+1][r.cx]===1){ r.quieta = true; }
  }
  rescatar(D.amigo, D.px, D.py, 32);
  if (D.enem.every(e=>!e.vivo)) pasarNivel('dig', iniciarDig, 'finDig', VOZ.pichungazo);
}
function drawDig(){
  ctx.fillStyle='#2a1a0e'; ctx.fillRect(0,0,W,H);
  /* capas de tierra */
  const tonos = ['#8a5a2a','#7a4a22','#6a3e1c','#5a3418'];
  for(let y=0;y<DH;y++) for(let x=0;x<DW;x++){
    const px = x*DC, py = DY0+y*DC;
    if (D.g[y][x]===1){
      ctx.fillStyle = tonos[Math.min(3, (y/3)|0)];
      ctx.fillRect(px-DC/2, py-DC/2, DC, DC);
      ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fillRect(px-DC/2, py-DC/2, DC, 3);
    } else {
      ctx.fillStyle='#150c06'; ctx.fillRect(px-DC/2, py-DC/2, DC, DC);
    }
  }
  ctx.fillStyle='#3fae2f'; ctx.fillRect(0, DY0-DC/2-10, W, 10);
  /* rocas (tiemblan justo antes de caer) */
  for(const r of D.rocas){
    const tem = (!r.cae && r.aviso>0) ? Math.sin(T)*2 : 0;
    ctx.fillStyle='#8a8a96';
    ctx.beginPath(); ctx.roundRect(r.cx*DC-18+tem, r.y-18, 36, 36, 9); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.22)'; ctx.fillRect(r.cx*DC-12+tem, r.y-13, 20, 5);
  }
  /* arpón */
  if (D.arpon>0){
    const dx=[0,1,0,-1][D.dir], dy=[-1,0,1,0][D.dir];
    ctx.strokeStyle='#ffe36e'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(D.px, D.py); ctx.lineTo(D.px+dx*D.arponL, D.py+dy*D.arponL); ctx.stroke();
    ctx.fillStyle='#fff';
    ctx.beginPath(); ctx.arc(D.px+dx*D.arponL, D.py+dy*D.arponL, 6, 0, Math.PI*2); ctx.fill();
  }
  /* goombas inflados (los que atraviesan la tierra van transparentes) */
  for(const e of D.enem){
    if (!e.vivo) continue;
    const s = 1 + e.infla*1.5;
    ctx.save(); ctx.translate(e.x, e.y); ctx.scale(s, s); ctx.translate(-13, -12);
    if (e.fantasma>0){
      ctx.globalAlpha = 0.45 + Math.sin(T/7)*0.12;
      dibGoomba(0, 0, T);
      ctx.globalAlpha = 1;
      /* ojitos brillantes para que se vea que viene por dentro de la tierra */
      rect(6, 8, 4, 4, '#fff'); rect(16, 8, 4, 4, '#fff');
    } else dibGoomba(0, 0, T);
    ctx.restore();
  }
  dibRescate(D.amigo);
  /* nube verde mientras dura el pedo */
  if (D.pedo>0){
    ctx.fillStyle='rgba(120,220,90,'+(0.12+Math.sin(T/6)*0.05)+')';
    ctx.beginPath(); ctx.arc(D.px, D.py, 175, 0, Math.PI*2); ctx.fill();
  }
  /* Fernando (parpadea tras un golpe) */
  if (!(D.inv>0 && (T>>2)%2)){
    ctx.save(); ctx.translate(D.px-12, D.py-20); dibFernandoSolo(); ctx.restore();
  }
  hudMJ('⛏️ DIG', etiquetaNivel('dig')+'   GOOMBAS: '+D.enem.filter(e=>e.vivo).length+'   '+corazonesInf(D), 'flechas cavan · B infla');
  barraPoder('💨 PEDO DE TÍO FRAN (A)', D.pedo>0 ? 1 : 1-D.pedoCd/PEDO_CD, D.pedo>0);
}

/* ============================================================
   3) FERNANDO KONG  (estilo Donkey Kong)
   ============================================================ */
const K = { x:0, y:0, vy:0, suelo:false, barriles:[], t:0, escalando:false, vida:3, inv:0, saltoPrev:false,
            sustos:0, martillo:0, martillos:[] };
const MARTILLO_T = 460;
function yEnPlat(p, x){
  const t = Math.max(0, Math.min(1, (x-p.x0)/(p.x1-p.x0)));
  return p.y0 + (p.y1-p.y0)*t;
}
const KPL = [];   /* plataformas: {x0,x1,y0,y1} ligeramente inclinadas */
const KESC = [];  /* escaleras: {x, y0, y1} */
function iniciarKong(){
  KPL.length = 0; KESC.length = 0;
  const filas = 5, sep = 84, baseY = 500;
  for(let i=0;i<filas;i++){
    const y = baseY - i*sep;
    const izqL = i%2===0;
    KPL.push({x0: izqL?60:120, x1: izqL?W-120:W-60, y0: izqL?y:y-14, y1: izqL?y-14:y});
    if (i < filas-1) KESC.push({x: izqL ? W-190 : 190, y0: y-sep, y1: y});
  }
  KPL.push({x0:60, x1:W-60, y0:baseY+40, y1:baseY+40});
  K.x = 110; K.y = baseY+40; K.vy = 0; K.barriles = []; K.t = 0;
  K.vida = 3; K.inv = 0; K.escalando = false; K.saltoPrev = false;
  K.sustos = 0; K.martillo = 0;
  /* dos martillos repartidos por la torre, como en el Donkey Kong de verdad */
  K.martillos = [
    {x: 300,   y: yEnPlat(KPL[1], 300)-20,   tomado:false},
    {x: W-320, y: yEnPlat(KPL[3], W-320)-20, tomado:false},
  ];
  /* un amigo esperando a mitad de la torre */
  const xa = (nivelDe('kong')%2) ? 210 : W-260;
  K.amigo = nuevoRescate('kong', xa-13, yEnPlat(KPL[2], xa)-40);
  aviso('¡Sube hasta mamá! Agarra los 🔨 martillos y rescata a tu amigo', 4);
}
function danoKong(caida){
  if (K.inv>0 && !caida) return;
  K.inv = 110; susto(K, '¡Ay! Vidas infinitas: vuelves abajo y sigues');
  /* vuelve al suelo, sin castigo mayor */
  K.x = 110; K.y = KPL[KPL.length-1].y0; K.vy = 0; K.escalando = false;
}
function alturaPlataforma(x, y){
  let mejor = null;
  for(const p of KPL){
    if (x < p.x0-6 || x > p.x1+6) continue;
    const t = (x-p.x0)/(p.x1-p.x0);
    const py = p.y0 + (p.y1-p.y0)*t;
    if (py >= y-14 && (mejor===null || py < mejor)) mejor = py;
  }
  return mejor;
}
function updateKong(){
  K.t++;
  if (K.inv>0) K.inv--;
  /* escaleras: se sube desde abajo y se remata sobre la plataforma de arriba */
  /* la escalera se agarra con margen de sobra: no hay que clavar la posición */
  const esc = KESC.find(e => Math.abs(K.x-e.x)<34 && K.y<=e.y1+22 && K.y>=e.y0-12);
  if (esc && (mArr()||mAbj())){
    K.escalando = true; K.vy = 0;
    K.y += mArr() ? -2.6 : 2.6;
    K.x += (esc.x - K.x)*0.45;
    if (K.y < esc.y0){ K.y = esc.y0; K.escalando = false; }   /* queda firme arriba */
    if (K.y > esc.y1){ K.y = esc.y1; K.escalando = false; }
  } else {
    K.escalando = false;
    if (mIzq()) K.x -= 3.2; if (mDer()) K.x += 3.2;
    K.x = Math.max(60, Math.min(W-60, K.x));
    if (mSalta() && K.suelo && !K.saltoPrev){ K.vy = -9.5; K.suelo=false; sfx.salto(); }
    K.saltoPrev = mSalta();
    const antesY = K.y;
    K.vy = Math.min(K.vy+0.55, 13); K.y += K.vy;
    const py = alturaPlataforma(K.x, K.y);
    K.suelo = false;
    if (py!==null && K.vy>=0 && antesY<=py+4 && K.y>=py-2){ K.y = py; K.vy = 0; K.suelo = true; }
    if (K.y > H+60) danoKong(true);
  }
  /* barriles que tira Bowser: más seguidos en cada nivel */
  const NK = nivelDe('kong');
  if (K.t % Math.max(38, 104 - NK*12) === 0){
    K.barriles.push({x:150, y:KPL[KPL.length-2].y0-16, vx:2.4+Math.min(NK,5)*0.22, vy:0, rot:0});
    sfx.romper();
  }
  /* ---- PODER: el martillo pichunguito ---- */
  for(const m of K.martillos){
    if (m.tomado) continue;
    if (Math.abs(m.x-K.x)<28 && Math.abs(m.y-(K.y-20))<44){
      m.tomado = true; K.martillo = MARTILLO_T;
      sfx.poder(); sacudir(3);
      aviso('🔨 ¡MARTILLO PICHUNGUITO! Rompe todos los barriles', 2.4);
      hablar(VOZ.ataque);
      K.dijoMartillo = true;
    }
  }
  if (K.martillo>0){
    K.martillo--;
    for(const b of K.barriles){
      if (b.roto) continue;
      if (Math.abs(b.x-K.x)<52 && Math.abs(b.y-K.y)<54){
        b.roto = true; sumar(500); sfx.romper(); sacudir(4);
        for(let i=0;i<6;i++) parts.push({tipo:'ladrillo', x:b.x, y:b.y-10, vx:(Math.random()-0.5)*6, vy:-2-Math.random()*3, t:38});
      }
    }
  }
  for(const b of K.barriles){
    if (b.roto) continue;
    const antesB = b.y;
    b.vy = Math.min(b.vy+0.55, 12);
    b.x += b.vx; b.y += b.vy; b.rot += b.vx*0.09;
    const py = alturaPlataforma(b.x, b.y);
    if (py!==null && b.vy>=0 && antesB<=py+6 && b.y>=py-4){ b.y = py; b.vy = 0; }
    /* al llegar al borde, el barril CAE al piso de abajo (antes subía por error) */
    if (b.x > W-64){ b.x = W-64; b.vx = -Math.abs(b.vx); b.y += 6; b.vy = 2; }
    if (b.x < 64){ b.x = 64; b.vx = Math.abs(b.vx); b.y += 6; b.vy = 2; }
    if (Math.abs(b.x-K.x)<20 && Math.abs(b.y-K.y)<26) danoKong(false);
    if (Math.abs(b.x-K.x)<40 && K.y < b.y-20 && !b.contado){ b.contado=true; sumar(200); }
  }
  K.barriles = K.barriles.filter(b=>!b.roto && b.y < H+60);
  rescatar(K.amigo, K.x, K.y-18, 36);
  /* llegar arriba con mamá princesa */
  if (K.y <= KPL[KPL.length-2].y0+6 && K.x > W-330){
    pasarNivel('kong', iniciarKong, 'finKong', VOZ.mama);
  }
}
function drawKong(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#1a0a2a'); g.addColorStop(1,'#3a1a4a');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<26;i++){ ctx.fillStyle='rgba(255,255,255,'+(0.2+Math.sin(T/20+i)*0.15)+')';
    ctx.fillRect((i*173)%W, 60+((i*97)%260), 2, 2); }
  /* escaleras */
  for(const e of KESC){
    ctx.strokeStyle='#8ecbff'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(e.x-11, e.y0); ctx.lineTo(e.x-11, e.y1);
    ctx.moveTo(e.x+11, e.y0); ctx.lineTo(e.x+11, e.y1); ctx.stroke();
    ctx.lineWidth=3;
    for(let y=e.y0; y<e.y1; y+=16){ ctx.beginPath(); ctx.moveTo(e.x-11,y); ctx.lineTo(e.x+11,y); ctx.stroke(); }
  }
  /* plataformas */
  for(const p of KPL){
    ctx.strokeStyle='#e05a3a'; ctx.lineWidth=13; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(p.x0,p.y0); ctx.lineTo(p.x1,p.y1); ctx.stroke();
    ctx.strokeStyle='#ff8a6a'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(p.x0,p.y0-4); ctx.lineTo(p.x1,p.y1-4); ctx.stroke();
  }
  /* Bowser arriba a la izquierda y mamá princesa arriba a la derecha */
  const arriba = KPL[KPL.length-2];
  dibBowser(96, arriba.y0-70, T, 0);
  dibPrincesa(W-250, arriba.y0-74, T, false);
  texto('MAMÁ', W-236, arriba.y0-92, 13, '#ff9ed6', true);
  /* barriles */
  for(const b of K.barriles){
    ctx.save(); ctx.translate(b.x, b.y-12); ctx.rotate(b.rot);
    ctx.fillStyle='#c87838';
    ctx.beginPath(); ctx.roundRect(-15,-12,30,24,7); ctx.fill();
    ctx.fillStyle='#8a4a18'; ctx.fillRect(-15,-5,30,4); ctx.fillRect(-15,2,30,3);
    ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.fillRect(-11,-10,22,3);
    ctx.restore();
  }
  dibRescate(K.amigo);
  /* martillos esperando en las plataformas */
  for(const m of K.martillos){
    if (m.tomado) continue;
    const fl = Math.sin(T/10)*4;
    dibMartillo(m.x, m.y+fl, 0);
    ctx.globalAlpha = 0.35+Math.sin(T/8)*0.2;
    ctx.strokeStyle='#ffe36e'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(m.x, m.y+fl-6, 24, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  /* Fernando (parpadea tras un golpe) */
  sombra(K.x, K.y+2, 15);
  if (!(K.inv>0 && (K.t>>2)%2)){
    ctx.save(); ctx.translate(K.x-12, K.y-40); dibFernandoSolo(); ctx.restore();
    if (K.martillo>0) dibMartillo(K.x+((K.t>>3)%2?18:-18), K.y-44, (K.t>>3)%2 ? 0.6 : -0.6);
  }
  hudMJ('🛢️ KONG', etiquetaNivel('kong')+'  '+Math.max(0, Math.round((540-K.y)/4))+'m  '+corazonesInf(K), '↑ escaleras · A salta');
  const restan = K.martillos.filter(m=>!m.tomado).length;
  barraPoder(K.martillo>0 ? '🔨 ¡MARTILLO ACTIVO!' : (restan ? '🔨 HAY '+restan+' MARTILLOS' : '🔨 SIN MARTILLOS'),
             K.martillo>0 ? K.martillo/MARTILLO_T : (restan?1:0), K.martillo>0);
}
/* martillo dibujado a mano, girado un poco al golpear */
function dibMartillo(x, y, giro){
  ctx.save(); ctx.translate(x, y); ctx.rotate(giro||0);
  ctx.fillStyle='#8a5a2a'; ctx.fillRect(-3, -4, 6, 26);
  ctx.fillStyle='#d8d8e0';
  ctx.beginPath(); ctx.roundRect(-15, -18, 30, 16, 4); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.fillRect(-12, -15, 24, 4);
  ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.fillRect(-12, -6, 24, 3);
  ctx.restore();
}

/* ============================================================
   4) FERNANDO CONTRA
   ============================================================ */
const C = { x:0, y:0, vy:0, suelo:false, vida:5, balas:[], enem:[], balasE:[], scroll:0, t:0, jefe:null,
            items:[], perro:0, bajas:0, sustos:0 };
const SUELO_C = 470, PERRO_T = 560;
function iniciarContra(){
  C.x = 140; C.y = SUELO_C; C.vy = 0; C.vida = 5;
  C.balas = []; C.enem = []; C.balasE = []; C.scroll = 0; C.t = 0; C.jefe = null; C.inv = 0; C.cara = 1;
  C.items = []; C.perro = 0; C.bajas = 0; C.sustos = 0; C.recarga = 0;
  C.disparoDicho = false;
  C.socio = amigoDeNivel('contra', nivelDe('contra'));   /* el compañero de este nivel */
  C.socioT = 0;
  aviso('¡Mantén B para disparar sin parar! El 🦴 hueso te vuelve perrito rojo gigante', 4);
}
function updateContra(){
  C.t++;
  if (C.inv>0) C.inv--;
  if (mIzq()) C.x -= 3.4; if (mDer()) C.x += 3.4;
  C.x = Math.max(30, Math.min(W-260, C.x));
  if (mIzq()) C.cara = -1; else if (mDer()) C.cara = 1;
  if (mSalta() && C.suelo && !C.saltoPrev){ C.vy = -11; C.suelo = false; sfx.salto(); }
  C.saltoPrev = mSalta();
  C.vy = Math.min(C.vy+0.6, 14); C.y += C.vy;
  if (C.y >= SUELO_C){ C.y = SUELO_C; C.vy = 0; C.suelo = true; }
  C.scroll += C.jefe ? 0 : 1.5;
  /* el compañero vuela al lado y echa una mano disparando de vez en cuando */
  if (++C.socioT % 96 === 0 && (C.enem.length || C.jefe)){
    C.balas.push({x:C.x-40, y:C.y-140, vx:10, vy:0, socio:true});
    sfx.fuego();
  }
  /* ---- PODER: hueso → perrito rojo gigante (dispara en abanico) ---- */
  if (C.perro>0){
    C.perro--;
    if (C.perro%5===0) parts.push({tipo:'estrellita', x:C.x+(Math.random()-0.5)*30, y:C.y-20-Math.random()*30,
                                   vx:(Math.random()-0.5)*2, vy:-1, t:22});
  }
  for(const it of C.items){
    it.vy = Math.min((it.vy||0)+0.5, 12); it.y += it.vy; it.x -= 1.5;
    if (it.y > SUELO_C-10){ it.y = SUELO_C-10; it.vy = 0; }
    if (!it.usado && Math.abs(it.x-C.x)<32 && Math.abs(it.y-(C.y-20))<46){
      it.usado = true; C.perro = PERRO_T; sfx.poder(); sacudir(4); sumar(400);
      aviso('🦴 ¡FERNANDO PERRITO ROJO GIGANTE!', 2.4);
      hablar(VOZ.perrito);
    }
  }
  C.items = C.items.filter(it=>!it.usado && it.x>-40);
  /* disparo: basta con MANTENER el botón, no hace falta machacarlo */
  if (C.recarga>0) C.recarga--;
  if (mAccion() && (!C.dispPrev || C.recarga<=0)){
    if (!C.disparoDicho){ C.disparoDicho = true; hablar(VOZ.fuego); }
    C.recarga = 11;
    const cara = C.cara||1;
    if (C.perro>0){                       /* de perrito grande dispara en abanico */
      for(const dv of [-3.4, 0, 3.4]) C.balas.push({x:C.x+18*cara, y:C.y-30, vx:11*cara, vy:dv, perro:true});
      sfx.pisoton();
    } else {
      C.balas.push({x:C.x+16*cara, y:C.y-26, vx:11*cara, vy:0});
    }
    sfx.fuego();
  }
  C.dispPrev = mAccion();
  for(const b of C.balas){ b.x += b.vx; b.y += b.vy||0; }
  C.balas = C.balas.filter(b=>b.x>-20 && b.x<W+20 && b.y>-20 && b.y<H+20);
  /* aparición de enemigos (cada nivel, más y más seguidos) */
  const NC = nivelDe('contra'), META_C = 2400 + (NC-1)*380;
  if (!C.jefe && C.t % Math.max(28, 76 - NC*9) === 0 && C.scroll < META_C){
    C.enem.push({x:W+30, y:SUELO_C, vida:Math.min(4, 1+NC), t:0, tipo: Math.random()<0.35?'koopa':'goomba'});
  }
  for(const e of C.enem){
    e.t++;
    e.x -= 1.9;
    if (e.t%110===0 && e.x<W-40){
      C.balasE.push({x:e.x, y:e.y-24, vx:-4.6});
      sfx.fuego();
    }
    for(const b of C.balas){
      if (Math.abs(b.x-e.x)<22 && Math.abs(b.y-(e.y-22))<26){
        e.vida--; b.x = 9999;
        if (e.vida<=0){ e.muerto=true; sumar(300); sfx.pisoton(); soltarHueso(e);
          for(let i=0;i<5;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y-20, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*2, t:30}); }
      }
    }
    if (Math.abs(e.x-C.x)<26 && Math.abs(e.y-C.y)<40 && !e.muerto){
      if (C.perro>0){                     /* el perrito rojo arrolla a quien se le cruce */
        e.muerto = true; sumar(300); sfx.pisoton(); sacudir(3);
        for(let i=0;i<5;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y-20, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*2, t:28});
      } else if (C.inv<=0){
        C.inv = 70; susto(C, '¡Ay! Vidas infinitas: sigue disparando');
      }
    }
  }
  C.enem = C.enem.filter(e=>!e.muerto && e.x>-60);
  for(const b of C.balasE){
    b.x += b.vx;
    if (Math.abs(b.x-C.x)<18 && Math.abs(b.y-(C.y-26))<28 && !b.usada){
      b.usada = true;
      if (C.perro>0){ /* el perrito rojo aguanta los disparos */ }
      else if (C.inv<=0){ C.inv = 70; susto(C, '¡Ay! Vidas infinitas: sigue disparando'); }
    }
  }
  C.balasE = C.balasE.filter(b=>!b.usada && b.x>-20);
  /* jefe final */
  if (!C.jefe && C.scroll >= META_C && C.enem.length===0){
    C.jefe = {x:W-220, y:150, vy:1.6+ (NC-1)*0.35, vida:12+NC*3, vidaMax:12+NC*3, golpe:0};
    aviso('¡JEFE FINAL DEL NIVEL '+NC+'!', 2.4);
  }
  if (C.jefe){
    const j = C.jefe;
    j.y += j.vy;
    if (j.y < 110 || j.y > 330) j.vy *= -1;
    if (C.t%46===0) C.balasE.push({x:j.x, y:j.y+40, vx:-5.4});
    for(const b of C.balas){
      if (Math.abs(b.x-(j.x+28))<40 && Math.abs(b.y-(j.y+30))<40){
        b.x = 9999; j.vida--; j.golpe = 8; sfx.pisoton(); sumar(100);
      }
    }
    if (j.golpe>0) j.golpe--;
    if (j.vida<=0) pasarNivel('contra', iniciarContra, 'finContra', VOZ.gane);
    /* el jefe también suelta huesos, para no quedarse nunca sin poder */
    if (C.t%420===0) soltarHueso({x:j.x, y:j.y+60});
  }
}
/* un hueso cada tres enemigos vencidos */
function soltarHueso(e){
  if (++C.bajas % 3 !== 0) return;
  C.items.push({x:e.x, y:e.y-30, vy:-3, tipo:'hueso'});
}
function drawContra(){
  const g = ctx.createLinearGradient(0,0,0,SUELO_C+40);
  g.addColorStop(0,'#1a2a4a'); g.addColorStop(1,'#4a6a8a');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  /* selva de fondo con desplazamiento */
  for(let i=0;i<10;i++){
    const x = ((i*180 - C.scroll*0.35)%(W+200)+(W+200))%(W+200)-100;
    ctx.fillStyle='#14361f';
    ctx.beginPath(); ctx.moveTo(x,SUELO_C+40); ctx.lineTo(x+50,SUELO_C-140); ctx.lineTo(x+100,SUELO_C+40); ctx.fill();
  }
  for(let i=0;i<14;i++){
    const x = ((i*130 - C.scroll*0.7)%(W+160)+(W+160))%(W+160)-80;
    ctx.fillStyle='#1c4a28';
    ctx.beginPath(); ctx.arc(x+40, SUELO_C-30, 34, Math.PI, 0); ctx.fill();
  }
  /* suelo con rayas que se mueven */
  ctx.fillStyle='#3a2a1a'; ctx.fillRect(0,SUELO_C+18,W,H-SUELO_C);
  ctx.fillStyle='#4a3a24';
  for(let i=0;i<16;i++){
    const x = ((i*70 - C.scroll)%(W+80)+(W+80))%(W+80)-40;
    ctx.fillRect(x, SUELO_C+18, 40, 8);
  }
  ctx.fillStyle='#5a4a30'; ctx.fillRect(0,SUELO_C+14,W,6);
  /* enemigos */
  for(const e of C.enem){
    sombra(e.x, SUELO_C+18, 16);
    if (e.tipo==='koopa') dibKoopa(e.x-13, e.y-38, {caparazon:false}, T);
    else dibGoomba(e.x-13, e.y-24, T);
  }
  /* jefe */
  if (C.jefe){
    const j = C.jefe;
    if (!(j.golpe>0 && (T>>1)%2)) dibBowser(j.x, j.y, T, 0);
    rect(j.x-4, j.y-24, 68, 9, '#3a0a0a');
    rect(j.x-4, j.y-24, 68*Math.max(0,j.vida)/(j.vidaMax||14), 9, '#e03434');
  }
  /* huesos por recoger */
  for(const it of C.items){
    ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(Math.sin(T/9)*0.35);
    ctx.fillStyle='#f4f0e2';
    ctx.beginPath(); ctx.roundRect(-14, -4, 28, 8, 4); ctx.fill();
    for(const sx of [-14, 14]) for(const sy of [-6, 6]){
      ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 0.35+Math.sin(T/7)*0.2;
    ctx.strokeStyle='#ffe36e'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(it.x, it.y, 26, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  /* balas */
  for(const b of C.balas){ ctx.fillStyle = b.perro ? '#ff5a3a' : (b.socio ? '#8ecbff' : '#ffe36e');
    ctx.beginPath(); ctx.arc(b.x, b.y, b.perro?7:(b.socio?6:5), 0, Math.PI*2); ctx.fill(); }
  for(const b of C.balasE){ ctx.fillStyle='#ff6a4a';
    ctx.beginPath(); ctx.arc(b.x, b.y, 6, 0, Math.PI*2); ctx.fill(); }
  /* Fernando disparando (parpadea tras un golpe) */
  sombra(C.x, SUELO_C+18, C.perro>0 ? 26 : 16);
  if (C.inv>0 && (C.t>>2)%2){ /* invisible un instante */ } else {
  ctx.save();
  if (C.perro>0){                       /* convertido en perrito rojo gigante */
    ctx.translate(C.x, C.y);
    if (C.cara<0) ctx.scale(-1,1);
    ctx.scale(2.4, 2.4); ctx.translate(-13, -21);
    dibPerroSolo('#e03434');
    /* orejotas y cola para que se note que es el perrito rojo gigante */
    rect(15, -3, 4, 5, '#b02020'); rect(-4, 5, 6, 3, '#b02020');
  } else {
    ctx.translate(C.x-12, C.y-40);
    if (C.cara<0){ ctx.translate(24,0); ctx.scale(-1,1); }
    dibFernandoSolo();
    rect(20, 16, 16, 5, '#3a3a44');
  }
  ctx.restore(); }
  /* el compañero del nivel, volando de apoyo */
  if (C.socio){
    const yv = C.y-150+Math.sin(T/16)*8;
    C.socio.dib(C.x-70, yv, T);
    letrero(C.x-57, yv-16, C.socio.nombre, '#8ecbff');
  }
  hudMJ('🔫 CONTRA', etiquetaNivel('contra')+'   '+corazonesInf(C), C.jefe ? '¡DERROTA A BOWSER!' : 'mantén B para disparar');
  barraPoder(C.perro>0 ? '🦴 ¡PERRITO ROJO GIGANTE!' : '🦴 BUSCA EL HUESO',
             C.perro>0 ? C.perro/PERRO_T : (C.bajas%3)/3, C.perro>0);
}


/* ============================================================
   5) FERNANDO GLOBOS  (estilo Balloon Fight)
   ============================================================ */
const G = { x:0, y:0, vx:0, vy:0, globos:2, enem:[], plats:[], t:0, aletPrev:false,
            premios:[], pedoCd:0, pedoPrev:false, sustos:0 };
const AGUA_G = 512, PEDO_G = 140;
function iniciarGlobos(){
  G.x = 180; G.y = 300; G.vx = 0; G.vy = 0; G.globos = 2; G.t = 0; G.inv = 0; G.aletPrev = false;
  G.premios = []; G.pedoCd = 0; G.pedoPrev = false; G.sustos = 0;
  G.plats = [{x:120,y:420,w:180},{x:420,y:340,w:170},{x:700,y:430,w:190},{x:560,y:210,w:150},{x:200,y:180,w:150}];
  G.enem = [];
  const NG = nivelDe('globos');
  const nK = Math.min(8, 3+NG);                             /* de 4 a 8 koopas */
  for(let i=0;i<nK;i++)
    G.enem.push({x:200+i*95, y:120+ (i%2)*120, vx:(i%2?1:-1)*(1+Math.min(NG,5)*0.13), vy:0,
                 globos:2, cae:0, vivo:true, f:Math.random()*6});
  const pa = G.plats[(nivelDe('globos')-1) % G.plats.length];
  G.amigo = nuevoRescate('globos', pa.x + pa.w/2 - 13, pa.y - 40);
  aviso('¡Aletea con A! Con B, IMPULSO PEDORRO 💨 · rescata a tu amigo', 4);
}
function updateGlobos(){
  G.t++;
  if (G.inv>0) G.inv--;
  /* aleteo */
  if (mIzq()) G.vx -= 0.22; if (mDer()) G.vx += 0.22;
  if ((mSalta()||mArr()) && !G.aletPrev && G.globos>0){ G.vy = -3.4; sfx.salto();
    for(let i=0;i<3;i++) parts.push({tipo:'polvo', x:G.x, y:G.y+22, vx:(Math.random()-0.5)*2, vy:1, t:16}); }
  G.aletPrev = mSalta()||mArr();
  /* ---- PODER: impulso pedorro ---- */
  if (G.pedoCd>0) G.pedoCd--;
  if (mAccion() && !G.pedoPrev && G.pedoCd<=0){
    G.vy = -9; G.vx += (G.vx>=0 ? 2.6 : -2.6); G.pedoCd = PEDO_G;
    nubePedo(G.x, G.y+24, 14); sfx.pedo(); sacudir(4);
    aviso('💨 ¡IMPULSO PEDORRO!', 1.4); hablar(VOZ.volar);
  }
  G.pedoPrev = mAccion();
  /* globos sueltos que devuelven aire (hasta tres) */
  if (G.t%380===120 && G.premios.length<2)
    G.premios.push({x:80+Math.random()*(W-160), y:110+Math.random()*260, t:0});
  for(const pr of G.premios){
    pr.t++; pr.y += Math.sin(pr.t/26)*0.5;
    if (!pr.usado && Math.abs(pr.x-G.x)<30 && Math.abs(pr.y-G.y)<34){
      pr.usado = true;
      if (G.globos<3){ G.globos++; aviso('🎈 ¡GLOBO EXTRA!', 1.4); }
      else { sumar(300); aviso('🎈 +300 puntos', 1.2); }
      sfx.moneda();
    }
  }
  G.premios = G.premios.filter(pr=>!pr.usado);
  G.vy += G.globos>0 ? (G.globos>2 ? 0.10 : 0.13) : 0.42;
  G.vx *= 0.975; G.vy = Math.min(G.vy, G.globos>0 ? 3.6 : 9);
  G.x += G.vx; G.y += G.vy;
  if (G.x < 20){ G.x = 20; G.vx = Math.abs(G.vx)*0.5; }
  if (G.x > W-20){ G.x = W-20; G.vx = -Math.abs(G.vx)*0.5; }
  if (G.y < 60){ G.y = 60; G.vy = Math.abs(G.vy)*0.5; }
  /* plataformas */
  for(const p of G.plats){
    if (G.x > p.x-14 && G.x < p.x+p.w+14 && G.y+26 > p.y && G.y+26 < p.y+22 && G.vy>0){
      G.y = p.y-26; G.vy = 0;
    }
  }
  /* enemigos */
  for(const e of G.enem){
    if (!e.vivo) continue;
    e.f += 0.03;
    if (e.globos>0){
      e.vx += (G.x - e.x) * 0.00035;
      e.vy = Math.sin(e.f)*1.1 + (G.y - e.y)*0.004;
      e.x += e.vx; e.y += e.vy;
      e.vx = Math.max(-2, Math.min(2, e.vx));
      if (e.x<24 || e.x>W-24) e.vx *= -1;
      if (e.y<70) e.y = 70;
      for(const p of G.plats)
        if (e.x>p.x-12 && e.x<p.x+p.w+12 && e.y+24>p.y && e.y+24<p.y+20 && e.vy>0) e.y = p.y-24;
    } else {
      e.cae++; e.y += 2.4;                      /* baja en paracaídas */
      if (e.y > AGUA_G-10){ e.vivo=false; sumar(600); sfx.moneda(); }
    }
    /* choque con Fernando: gana quien viene desde arriba */
    if (Math.abs(e.x-G.x)<28 && Math.abs(e.y-G.y)<30){
      if (G.y < e.y-6 && e.globos>0){
        e.globos--; e.vy = 2; sfx.pisoton(); sacudir(3); sumar(300);
        G.vy = -3.5;
        for(let i=0;i<5;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y-16, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*2, t:28});
      } else if (e.y < G.y-6 && e.globos>0 && G.globos>0 && G.inv<=0){
        G.globos--; G.inv = 80; G.vy = 3; G.vx = (G.x<e.x?-3:3);
        susto(G, '¡Se reventó un globo! Vidas infinitas: aguanta');
      }
    }
  }
  rescatar(G.amigo, G.x, G.y, 34);
  /* agua: sin globos, Fernando sale a flote con globos nuevos (vidas infinitas) */
  if (G.y > AGUA_G-10){
    if (G.globos>0){ G.y = AGUA_G-10; G.vy = -4; }
    else {
      G.x = 180; G.y = 220; G.vx = 0; G.vy = 0; G.globos = 2; G.inv = 90;
      susto(G, '¡Al agua! Vidas infinitas: globos nuevos y a volar');
      sfx.poder();
    }
  }
  if (G.enem.every(e=>!e.vivo)) pasarNivel('globos', iniciarGlobos, 'finGlobos', VOZ.pichungazo);
}
function dibGlobitos(x, y, n, color){
  const desf = n===1 ? [0] : n===2 ? [-11,11] : [-16,0,16];
  for(let i=0;i<n;i++){
    const gx = x + (desf[i]||0), gy = y - 30 - (n>2&&i===1?6:0) + Math.sin(T/14+i)*2;
    ctx.strokeStyle='#eee'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(x, y-8); ctx.lineTo(gx, gy+11); ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.ellipse(gx, gy, 10, 12, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.45)';
    ctx.beginPath(); ctx.ellipse(gx-3, gy-4, 3.4, 4.4, -0.3, 0, Math.PI*2); ctx.fill();
  }
}
function drawGlobos(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#0a2a5a'); g.addColorStop(0.7,'#2a6ad0'); g.addColorStop(1,'#6bb0f0');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<20;i++){ ctx.fillStyle='rgba(255,255,255,'+(0.25+Math.sin(T/24+i)*0.2)+')';
    ctx.fillRect((i*151)%W, 60+((i*67)%160), 2, 2); }
  /* agua */
  ctx.fillStyle='#1560c8'; ctx.fillRect(0,AGUA_G,W,H-AGUA_G);
  ctx.fillStyle='rgba(255,255,255,0.28)';
  for(let i=0;i<W;i+=28) ctx.fillRect(i+((T*0.6)%28), AGUA_G+4, 16, 3);
  /* plataformas */
  for(const p of G.plats){
    rect(p.x, p.y, p.w, 16, '#4a8a3a');
    rect(p.x, p.y, p.w, 5, '#7ed040');
    rect(p.x, p.y+13, p.w, 3, '#2a5a20');
  }
  /* enemigos */
  for(const e of G.enem){
    if (!e.vivo) continue;
    if (e.globos>0) dibGlobitos(e.x, e.y, e.globos, '#e03434');
    else { ctx.strokeStyle='#fff'; ctx.lineWidth=2;   /* paracaídas */
      ctx.beginPath(); ctx.arc(e.x, e.y-26, 18, Math.PI, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(e.x-18,e.y-26); ctx.lineTo(e.x,e.y-8);
      ctx.lineTo(e.x+18,e.y-26); ctx.stroke(); }
    dibKoopa(e.x-13, e.y-22, {caparazon:false}, T);
  }
  dibRescate(G.amigo);
  /* globos extra flotando */
  for(const pr of G.premios){
    dibGlobitos(pr.x, pr.y, 1, '#5ee08a');
    ctx.globalAlpha = 0.3+Math.sin(T/7)*0.2;
    ctx.strokeStyle='#ffe36e'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(pr.x, pr.y-26, 22, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  /* Fernando con sus globos (parpadea tras un golpe) */
  if (!(G.inv>0 && (T>>2)%2)){
    if (G.globos>0) dibGlobitos(G.x, G.y, G.globos, '#f8b800');
    ctx.save(); ctx.translate(G.x-12, G.y-16); dibFernandoSolo(); ctx.restore();
  }
  hudMJ('🎈 GLOBOS', etiquetaNivel('globos')+'   KOOPAS: '+G.enem.filter(e=>e.vivo).length+'   🎈'+G.globos+'   '+corazonesInf(G), 'A = aletear');
  barraPoder(G.pedoCd<=0 ? '💨 PEDO PROPULSOR (B)' : '💨 tomando aire...',
             1-G.pedoCd/PEDO_G, G.pedoCd<=0);
}

/* ============================================================
   6) FERNANDO BOMBAS  (estilo Bomberman)
   ============================================================ */
const M = { g:[], jx:1, jy:1, px:0, py:0, bombas:[], fuego:[], enem:[], t:0, bombaPrev:false, vida:3, inv:0,
            items:[], alcance:2, maxBombas:2, vel:2.6, pedoCd:0, pedoPrev:false, sustos:0 };
const MC = 42, MW = 17, MH = 11, MX0 = 60, MY0 = 66, PEDO_M = 330;
function iniciarBombas(){
  M.g = Array.from({length:MH}, (_,y)=> Array.from({length:MW}, (_,x)=>{
    if (x===0||y===0||x===MW-1||y===MH-1) return 2;         /* muro duro */
    if (x%2===0 && y%2===0) return 2;                        /* pilar */
    if (x+y < 4) return 0;                                   /* esquina libre */
    return Math.random()<0.55 ? 1 : 0;                       /* bloque blando */
  }));
  M.jx = 1; M.jy = 1; M.px = MX0+MC; M.py = MY0+MC;
  M.bombas = []; M.fuego = []; M.t = 0; M.vida = 3; M.inv = 0;
  M.items = []; M.alcance = 2; M.maxBombas = 2; M.vel = 2.6;
  M.pedoCd = 0; M.pedoPrev = false; M.sustos = 0;
  M.enem = [];
  const NM = nivelDe('bomba');
  const libres = [];
  for(let y=1;y<MH-1;y++) for(let x=1;x<MW-1;x++)
    if (M.g[y][x]===0 && x+y>8) libres.push({x,y});
  for(let i=0;i<Math.min(10, 2+NM*2) && libres.length;i++){   /* de 4 a 10 goombas */
    const c = libres.splice((Math.random()*libres.length)|0, 1)[0];
    M.enem.push({x:MX0+c.x*MC, y:MY0+c.y*MC, dir:(Math.random()*4)|0, vivo:true, vel:1.15+Math.min(NM,5)*0.19});
  }
  /* el amigo del nivel, encerrado al otro extremo del laberinto */
  const ca = {x: MW-2, y: MH-2};
  M.g[ca.y][ca.x] = 0;
  M.amigo = nuevoRescate('bomba', MX0+ca.x*MC-13, MY0+ca.y*MC-22);
  aviso('¡B pone bombas! Rompe cajas, halla poderes y rescata a tu amigo', 4);
}
const mCel = (x,y) => (x<0||y<0||x>=MW||y>=MH) ? 2 : M.g[y][x];
function danoBomba(){
  if (M.inv>0) return;
  M.inv = 110; susto(M, '¡Ay! Vidas infinitas: vuelves a la esquina');
  M.px = MX0+MC; M.py = MY0+MC;
}
function updateBombas(){
  M.t++;
  if (M.inv>0) M.inv--;
  /* movimiento con paredes */
  const v = M.vel;
  const libre = (px,py)=>{
    for(const [ox,oy] of [[-17,-17],[17,-17],[-17,17],[17,17]])
      if (mCel(Math.round((px+ox-MX0)/MC), Math.round((py+oy-MY0)/MC)) !== 0) return false;
    return true;
  };
  let dx = 0, dy = 0;
  if (mIzq()) dx = -v; else if (mDer()) dx = v;
  else if (mArr()) dy = -v; else if (mAbj()) dy = v;
  if (dx){
    if (libre(M.px+dx, M.py)) M.px += dx;
    else {  /* deslizarse hacia el centro del pasillo para no atascarse */
      const cyc = MY0 + Math.round((M.py-MY0)/MC)*MC;
      if (Math.abs(M.py-cyc) > 3 && libre(M.px+dx, cyc)) M.py += Math.sign(cyc-M.py)*v;
    }
  } else if (dy){
    if (libre(M.px, M.py+dy)) M.py += dy;
    else {
      const cxc = MX0 + Math.round((M.px-MX0)/MC)*MC;
      if (Math.abs(M.px-cxc) > 3 && libre(cxc, M.py+dy)) M.px += Math.sign(cxc-M.px)*v;
    }
  }
  M.jx = Math.round((M.px-MX0)/MC); M.jy = Math.round((M.py-MY0)/MC);
  /* poner bomba */
  if (mAccion() && !M.bombaPrev && M.bombas.length<M.maxBombas &&
      !M.bombas.some(b=>b.x===M.jx && b.y===M.jy)){
    M.bombas.push({x:M.jx, y:M.jy, t:120});
    sfx.romper();
  }
  M.bombaPrev = mAccion();
  /* ---- PODER: el súper pedo, una cruz enorme que no daña a Fernando ---- */
  if (M.pedoCd>0) M.pedoCd--;
  if (mSalta() && !M.pedoPrev && M.pedoCd<=0){
    M.pedoCd = PEDO_M; sfx.pedo(); sacudir(6);
    aviso('💨 ¡SÚPER PEDO PICHUNGUITO!', 2);
    hablar(VOZ.pedo);
    M.fuego.push({x:M.jx, y:M.jy, t:36, pedo:true});
    nubePedo(M.px, M.py, 14);
    for(const [dx2,dy2] of [[1,0],[-1,0],[0,1],[0,-1]]){
      for(let r=1;r<=M.alcance+2;r++){
        const fx = M.jx+dx2*r, fy = M.jy+dy2*r;
        if (mCel(fx,fy)===2) break;
        M.fuego.push({x:fx, y:fy, t:36, pedo:true});
        nubePedo(MX0+fx*MC, MY0+fy*MC, 4);
        if (mCel(fx,fy)===1){ M.g[fy][fx] = 0; sumar(50); soltarPremio(fx,fy); break; }
      }
    }
  }
  M.pedoPrev = mSalta();
  /* premios que aparecen al romper cajas */
  for(const it of M.items){
    if (Math.abs(MX0+it.x*MC-M.px)<24 && Math.abs(MY0+it.y*MC-M.py)<24){
      it.usado = true; sfx.poder();
      if (it.tipo==='fuego'){ M.alcance = Math.min(6, M.alcance+1); aviso('🔥 ¡Explosiones más largas!', 1.6); }
      else if (it.tipo==='bomba'){ M.maxBombas = Math.min(6, M.maxBombas+1); aviso('💣 ¡Una bomba más!', 1.6); }
      else { M.vel = Math.min(4.4, M.vel+0.35); aviso('👟 ¡Zapatos veloces!', 1.6); }
      sumar(200);
    }
  }
  M.items = M.items.filter(it=>!it.usado);
  /* bombas y explosiones */
  for(const b of M.bombas){
    b.t--;
    if (b.t<=0){
      b.explota = true; sfx.pedo(); sacudir(5);
      M.fuego.push({x:b.x, y:b.y, t:34});
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
        for(let r=1;r<=M.alcance;r++){
          const fx = b.x+dx*r, fy = b.y+dy*r;
          if (mCel(fx,fy)===2) break;
          M.fuego.push({x:fx, y:fy, t:34});
          if (mCel(fx,fy)===1){ M.g[fy][fx] = 0; sumar(50); soltarPremio(fx,fy); break; }
        }
      }
    }
  }
  M.bombas = M.bombas.filter(b=>!b.explota);
  for(const f of M.fuego) f.t--;
  M.fuego = M.fuego.filter(f=>f.t>0);
  /* daño del fuego */
  for(const f of M.fuego){
    if (f.t<30){
      const fx2 = MX0+f.x*MC, fy2 = MY0+f.y*MC;
      for(const e of M.enem)
        if (e.vivo && Math.abs(e.x-fx2)<24 && Math.abs(e.y-fy2)<24){
          e.vivo=false; sumar(700); sfx.pisoton();
          for(let i=0;i<6;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*3, t:30});
        }
      if (!f.pedo && Math.abs(M.px-fx2)<20 && Math.abs(M.py-fy2)<20) danoBomba();
    }
  }
  /* enemigos */
  for(const e of M.enem){
    if (!e.vivo) continue;
    const dx=[1,0,-1,0][e.dir], dy=[0,1,0,-1][e.dir];
    const ve = e.vel || 1.3;
    const nx2 = e.x+dx*ve, ny2 = e.y+dy*ve;
    const ecx = Math.round((nx2-MX0)/MC), ecy = Math.round((ny2-MY0)/MC);
    if (mCel(ecx,ecy)===0 && !M.bombas.some(b=>b.x===ecx&&b.y===ecy)){ e.x=nx2; e.y=ny2; }
    else e.dir = (Math.random()*4)|0;
    if (M.t%90===0 && Math.random()<0.4) e.dir = (Math.random()*4)|0;
    if (Math.abs(e.x-M.px)<24 && Math.abs(e.y-M.py)<24) danoBomba();
  }
  rescatar(M.amigo, M.px, M.py, 32);
  if (M.enem.every(e=>!e.vivo)) pasarNivel('bomba', iniciarBombas, 'finBombas', VOZ.pichungazo);
}
/* una de cada tres cajas rotas esconde un poder */
function soltarPremio(x, y){
  if (Math.random() > 0.34) return;
  const tipo = ['fuego','bomba','zapato'][(Math.random()*3)|0];
  M.items.push({x, y, tipo});
}
function drawBombas(){
  ctx.fillStyle='#1a2a1a'; ctx.fillRect(0,0,W,H);
  for(let y=0;y<MH;y++) for(let x=0;x<MW;x++){
    const px = MX0+x*MC-MC/2, py = MY0+y*MC-MC/2, c = M.g[y][x];
    if (c===2){
      rect(px,py,MC,MC,'#5a6a7a');
      rect(px+2,py+2,MC-4,4,'rgba(255,255,255,0.28)');
      rect(px+2,py+MC-6,MC-4,4,'rgba(0,0,0,0.35)');
    } else if (c===1){
      rect(px,py,MC,MC,'#a06a3a');
      rect(px+2,py+2,MC-4,4,'rgba(255,255,255,0.22)');
      ctx.strokeStyle='#6a4020'; ctx.lineWidth=2; ctx.strokeRect(px+2,py+2,MC-4,MC-4);
    } else {
      rect(px,py,MC,MC, (x+y)%2 ? '#2f7a2a' : '#2a6f26');
    }
  }
  /* bombas */
  for(const b of M.bombas){
    const bx = MX0+b.x*MC, by = MY0+b.y*MC;
    const s = 1 + Math.sin(M.t/4)*0.09;
    ctx.save(); ctx.translate(bx,by); ctx.scale(s,s);
    ctx.fillStyle='#1a1a22'; ctx.beginPath(); ctx.arc(0,2,15,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(-5,-4,4,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#c8a050'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(0,-13); ctx.quadraticCurveTo(8,-22,3,-27); ctx.stroke();
    ctx.fillStyle=(M.t>>2)%2?'#ffe36e':'#ff6a20';
    ctx.beginPath(); ctx.arc(3,-28,4,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
  /* premios */
  for(const it of M.items){
    const ix = MX0+it.x*MC, iy = MY0+it.y*MC;
    const s = 1+Math.sin(M.t/9)*0.08;
    ctx.save(); ctx.translate(ix, iy); ctx.scale(s,s);
    ctx.fillStyle = it.tipo==='fuego' ? '#e05a20' : it.tipo==='bomba' ? '#2a3a6a' : '#2a8a4a';
    ctx.beginPath(); ctx.roundRect(-16,-16,32,32,8); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.7)'; ctx.lineWidth=2; ctx.stroke();
    ctx.font='19px monospace'; ctx.textAlign='center';
    ctx.fillStyle='#fff';
    ctx.fillText(it.tipo==='fuego' ? '🔥' : it.tipo==='bomba' ? '💣' : '👟', 0, 7);
    ctx.textAlign='left';
    ctx.restore();
  }
  /* fuego (el del súper pedo sale verde y no hace daño) */
  for(const f of M.fuego){
    const fx = MX0+f.x*MC-MC/2, fy = MY0+f.y*MC-MC/2;
    const a = Math.min(1, f.t/16);
    ctx.globalAlpha = f.pedo ? a*0.8 : a;
    rect(fx+2, fy+2, MC-4, MC-4, f.pedo ? ((M.t>>1)%2 ? '#7ad84a' : '#4aa832') : ((M.t>>1)%2 ? '#ff8a20' : '#ffe36e'));
    rect(fx+8, fy+8, MC-16, MC-16, f.pedo ? '#d8f8b0' : '#fff6c0');
    ctx.globalAlpha = 1;
  }
  dibRescate(M.amigo);
  /* goombas */
  for(const e of M.enem) if (e.vivo) dibGoomba(e.x-13, e.y-12, T);
  /* Fernando (parpadea tras un golpe) */
  if (!(M.inv>0 && (M.t>>2)%2)){
    ctx.save(); ctx.translate(M.px-12, M.py-22); dibFernandoSolo(); ctx.restore();
  }
  hudMJ('💣 BOMBAS', etiquetaNivel('bomba')+'   GOOMBAS: '+M.enem.filter(e=>e.vivo).length+'   '+corazonesInf(M),
        '💣'+M.maxBombas+' 🔥'+M.alcance+' 👟'+M.vel.toFixed(1));
  barraPoder(M.pedoCd<=0 ? '💨 SÚPER PEDO (A)' : '💨 cargando pedo...',
             1-M.pedoCd/PEDO_M, M.pedoCd<=0);
}

/* ============================================================
   7) FERNANDO HIELO  (estilo Ice Climber)
   ============================================================ */
const I = { x:0, y:0, vy:0, cam:0, suelo:false, pisos:[], enem:[], t:0, saltoPrev:false, cima:0, vida:3, inv:0,
            papa:0, papaCd:0, papaPrev:false, sustos:0 };
const IPISOS = 12, IALTO = 116, IC2 = 40, PAPA_CD = 190;
function iniciarHielo(){
  I.pisos = [];
  const nCel = Math.ceil(W/IC2);
  for(let p=0;p<IPISOS;p++){
    const y = 470 - p*IALTO;
    const cel = new Array(nCel).fill(1);
    if (p>0){
      /* dos o tres huecos, nunca en los bordes ni pegados entre sí:
         así siempre hay hielo firme a ambos lados para aterrizar */
      const nH = 2, huecos = [];
      let intentos = 0;
      while(huecos.length<nH && intentos++<80){
        const h = 3 + ((Math.random()*(nCel-6))|0);
        if (huecos.every(o=>Math.abs(o-h)>=3)) huecos.push(h);
      }
      for(const h of huecos) cel[h] = 0;
    }
    I.pisos.push({y, cel});
  }
  I.x = 120; I.y = 470; I.vy = 0; I.cam = 0; I.t = 0; I.cima = 0;
  I.vida = 3; I.inv = 0; I.suelo = true; I.saltoPrev = false;
  I.papa = 0; I.papaCd = 0; I.papaPrev = false; I.sustos = 0;
  I.enem = [];
  const NI = nivelDe('hielo');
  for(let p=2;p<IPISOS-1;p+=(NI>=3?1:2))          /* cada nivel, más goombas por la torre */
    I.enem.push({x:200+Math.random()*500, y:I.pisos[p].y-22,
                 vx:(p%4?1:-1)*(1+Math.min(NI,5)*0.2), piso:p, vivo:true});
  /* un amigo a mitad de la torre, sobre hielo firme */
  const pm = I.pisos[5];
  let cm = pm.cel.findIndex(v=>v===1);
  if (cm < 0){ cm = 3; pm.cel[3] = 1; }
  I.amigo = nuevoRescate('hielo', cm*IC2 + 6, pm.y - 40);
  aviso('¡Rompe el hielo con la cabeza! Con B das el SALTO DE PAPÁ 🦘', 4);
}
function danoHielo(){
  if (I.inv>0) return;
  I.inv = 120; susto(I, '¡Ay! Vidas infinitas: vuelves al piso más alto');
  /* lo devuelve a un bloque firme del piso más alto alcanzado */
  const pi = I.pisos[Math.max(0, I.cima)];
  let c = pi.cel.findIndex(v=>v===1);
  if (c<0){ c = 2; pi.cel[2] = 1; }
  I.x = c*IC2 + IC2/2; I.y = pi.y; I.vy = 0; I.suelo = true;
}
function bloqueEn(px, py){
  for(let p=0;p<IPISOS;p++){
    const pi = I.pisos[p];
    if (py > pi.y-4 && py < pi.y+24){
      const c = Math.floor(px/IC2);
      if (c>=0 && c<pi.cel.length && pi.cel[c]===1) return {p, c, pi};
    }
  }
  return null;
}
function updateHielo(){
  I.t++;
  if (I.inv>0) I.inv--;
  if (mIzq()) I.x -= 3.4; if (mDer()) I.x += 3.4;
  I.x = Math.max(14, Math.min(W-14, I.x));
  if ((mSalta()||mArr()) && I.suelo && !I.saltoPrev){ I.vy = -12.6; I.suelo = false; sfx.salto(); }
  I.saltoPrev = mSalta()||mArr();
  /* ---- PODER: el salto de papá, sube dos pisos y rompe hielo a lo ancho ---- */
  if (I.papaCd>0) I.papaCd--;
  if (I.papa>0) I.papa--;
  if (mAccion() && !I.papaPrev && I.suelo && I.papaCd<=0){
    I.vy = -18.6; I.suelo = false; I.papa = 70; I.papaCd = PAPA_CD;
    sfx.poder(); sacudir(3);
    aviso('🦘 ¡SALTO DE PAPÁ!', 1.6);
    hablar(VOZ.papa);
  }
  I.papaPrev = mAccion();
  I.vy = Math.min(I.vy+0.62, 14);
  const antes = I.y;
  I.y += I.vy;
  I.suelo = false;
  /* romper el hielo con la cabeza (la cabeza va 40 px sobre los pies) */
  if (I.vy < 0){
    const b = bloqueEn(I.x, I.y-40);
    if (b){
      b.pi.cel[b.c] = 0; sfx.romper(); sacudir(3); sumar(80);
      if (I.papa>0){
        /* con el salto de papá abre un butrón de tres bloques y no frena */
        for(const d2 of [-1, 1]) if (b.pi.cel[b.c+d2]===1){ b.pi.cel[b.c+d2] = 0; sumar(80); }
        sacudir(5);
        for(let i=0;i<10;i++) parts.push({tipo:'cascara', x:I.x+(Math.random()-0.5)*80, y:I.y-36, vx:(Math.random()-0.5)*6, vy:-2-Math.random()*3, t:34});
      } else {
        I.vy = 1.2;
        for(let i=0;i<5;i++) parts.push({tipo:'cascara', x:I.x, y:I.y-36, vx:(Math.random()-0.5)*5, vy:-2-Math.random()*2, t:32});
      }
    }
  }
  /* apoyarse en el hielo, sin atravesarlo por ir rápido */
  if (I.vy >= 0){
    for(let p=0;p<IPISOS;p++){
      const pi = I.pisos[p];
      const c = Math.floor(I.x/IC2);
      if (c<0 || c>=pi.cel.length || pi.cel[c]!==1) continue;
      if (antes <= pi.y+2 && I.y >= pi.y){
        I.y = pi.y; I.vy = 0; I.suelo = true;
        I.cima = Math.max(I.cima, p);
        break;
      }
    }
  }
  /* cámara */
  const objetivo = Math.max(0, 470 - I.y - 200);
  I.cam += (objetivo - I.cam) * 0.1;
  /* enemigos que caminan por su piso */
  for(const e of I.enem){
    if (!e.vivo) continue;
    e.x += e.vx;
    const pi = I.pisos[e.piso];
    const c = Math.floor(e.x/IC2);
    if (e.x<20 || e.x>W-20 || c<0 || c>=pi.cel.length || pi.cel[c]!==1) e.vx *= -1;
    e.y = pi.y-22;
    /* aplastarlo cayendo encima; si no, empujón y un corazón menos */
    if (Math.abs(e.x-I.x)<26 && I.y > e.y-6 && I.y < e.y+34){
      if (I.vy > 1.5 && antes < e.y+4){
        e.vivo=false; sumar(400); I.vy=-9; sfx.pisoton(); sacudir(3);
        for(let i=0;i<5;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*2, t:28});
      } else if (I.inv<=0) danoHielo();
    }
  }
  /* caer fuera de la pantalla: pierde un corazón y vuelve al último piso pisado */
  if (I.y > 470 + 240) danoHielo();
  /* llegar a la cima */
  rescatar(I.amigo, I.x, I.y-18, 34);
  if (I.cima >= IPISOS-1) pasarNivel('hielo', iniciarHielo, 'finHielo', VOZ.cucu);
}
function drawHielo(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#0a2a4a'); g.addColorStop(1,'#4a9ad0');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  /* nieve cayendo */
  for(let i=0;i<40;i++){
    const sx = (i*137 + Math.sin(T/30+i)*20)%W;
    const sy = ((i*97 + T*1.6)%(H+40))-20;
    ctx.fillStyle='rgba(255,255,255,0.75)';
    ctx.fillRect(sx, sy, 3, 3);
  }
  ctx.save(); ctx.translate(0, I.cam);
  /* pisos de hielo */
  for(let p=0;p<IPISOS;p++){
    const pi = I.pisos[p];
    if (pi.y+I.cam < -60 || pi.y+I.cam > H+60) continue;
    for(let c=0;c<pi.cel.length;c++){
      if (pi.cel[c]!==1) continue;
      const x = c*IC2;
      rect(x, pi.y, IC2, 24, p===0 ? '#8a7a6a' : '#bfe8f8');
      rect(x, pi.y, IC2, 6, p===0 ? '#a89888' : '#eafaff');
      rect(x, pi.y+20, IC2, 4, p===0 ? '#5a4a3a' : '#7ab8d8');
      ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1;
      ctx.strokeRect(x+1, pi.y+1, IC2-2, 22);
    }
  }
  /* Cucú esperando en la cima */
  const cima = I.pisos[IPISOS-1];
  dibCucu(W/2-11, cima.y-52, 1, T);
  texto('CUCÚ', W/2, cima.y-62, 13, '#ff9ed6', true);
  dibRescate(I.amigo);
  /* enemigos */
  for(const e of I.enem) if (e.vivo){ sombra(e.x, e.y+22, 15); dibGoomba(e.x-13, e.y, T); }
  /* Fernando (parpadea tras un golpe) */
  sombra(I.x, I.y+2, 15);
  if (!(I.inv>0 && (I.t>>2)%2)){
    ctx.save(); ctx.translate(I.x-12, I.y-40); dibFernandoSolo(); ctx.restore();
  }
  ctx.restore();
  hudMJ('🧊 HIELO', etiquetaNivel('hielo')+'   PISO: '+(I.cima+1)+'/'+IPISOS+'   '+corazonesInf(I), 'A salta · rompe hielo');
  barraPoder(I.papa>0 ? '🦘 ¡SALTO DE PAPÁ!' : (I.papaCd<=0 ? '🦘 SALTO DE PAPÁ (B)' : '🦘 tomando impulso...'),
             I.papa>0 ? 1 : 1-I.papaCd/PAPA_CD, I.papa>0);
}

/* ============================================================
   8) FERNANDO TORRE  (defensa de torres)
   ============================================================ */
const TD = { cx:0, cy:0, torres:[], enem:[], oleada:0, restan:0, spawn:0, monedas:0, tipo:0,
             t:0, sustos:0, pedoCd:0, pedoPrev:false, ponPrev:false, camPrev:false, amigo:null, bajas:0,
             camino:null, burgerCd:0, burger:0, dirPrev:null, repite:0, tanda:null,
             jefeToca:false, oleadas:0 };
const TC = 60, TW = 15, TH = 7, TX0 = 30, TY0 = 74, PEDO_TD = 420, BURGER_TD = 540;
/* cuatro caminitos distintos: el mapa cambia cada dos niveles */
const CAMINOS = [
  [[0,1],[1,1],[2,1],[3,1],[4,1],[4,2],[4,3],[4,4],[5,4],[6,4],[7,4],
   [7,3],[7,2],[7,1],[8,1],[9,1],[10,1],[10,2],[10,3],[10,4],[10,5],
   [11,5],[12,5],[13,5],[14,5]],
  [[0,5],[1,5],[2,5],[2,4],[2,3],[2,2],[2,1],[3,1],[4,1],[5,1],[6,1],
   [6,2],[6,3],[6,4],[6,5],[7,5],[8,5],[9,5],[10,5],[10,4],[10,3],[10,2],[10,1],
   [11,1],[12,1],[13,1],[14,1],[14,2],[14,3],[14,4],[14,5]],
  [[0,3],[1,3],[2,3],[3,3],[3,2],[3,1],[4,1],[5,1],[5,2],[5,3],[5,4],[5,5],
   [6,5],[7,5],[8,5],[8,4],[8,3],[8,2],[8,1],[9,1],[10,1],[11,1],[11,2],[11,3],
   [11,4],[11,5],[12,5],[13,5],[14,5]],
  [[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],[3,4],[2,4],[1,4],[1,5],[1,6],
   [2,6],[3,6],[4,6],[5,6],[6,6],[6,5],[6,4],[6,3],[6,2],[7,2],[8,2],[9,2],
   [9,3],[9,4],[9,5],[10,5],[11,5],[12,5],[12,4],[12,3],[13,3],[14,3],[14,4],[14,5]],
];
/* el mapa de cada nivel, y dónde queda la casa que hay que defender */
const caminoDe = n => CAMINOS[Math.floor((n-1)/2) % CAMINOS.length];
const enCamino = (cx,cy) => TD.camino.some(c=>c[0]===cx && c[1]===cy);
/* Los defensores. Cada uno tiene su gracia, y se van desbloqueando por nivel. */
const TORRES = [
  {id:'penny',   nombre:'PENNY',    coste:2, alcance:150, dano:1, cd:26, color:'#222',
   desde:1, hab:'', gracia:'dispara rapidísimo'},
  {id:'sheldon', nombre:'SHELDON',  coste:3, alcance:120, dano:3, cd:54, color:'#8a5a2a',
   desde:1, hab:'', gracia:'pega muy fuerte'},
  {id:'tiojuan', nombre:'TÍO JUAN', coste:5, alcance:235, dano:2, cd:40, color:'#2a6ad0',
   desde:1, hab:'', gracia:'llega lejísimos'},
  {id:'cucu',    nombre:'CUCÚ',     coste:4, alcance:145, dano:1, cd:38, color:'#e8a0c0',
   desde:2, hab:'hielo',  gracia:'❄️ los congela y andan a la mitad'},
  {id:'tiofran', nombre:'TÍO FRAN', coste:6, alcance:155, dano:2, cd:64, color:'#7ac040',
   desde:4, hab:'pedo',   gracia:'💨 su pedo daña a todos los de alrededor'},
  {id:'abu',     nombre:'ABU',      coste:4, alcance:0,   dano:0, cd:0,  color:'#c8a0d0',
   desde:6, hab:'moneda', gracia:'🪙 hornea una moneda cada ratito'},
  {id:'salomon', nombre:'SALOMÓN',  coste:7, alcance:180, dano:9, cd:115, color:'#d0a060',
   desde:8, hab:'piedra', gracia:'🪨 pedrada enorme que los deja atontados'},
];
const torresDe = n => TORRES.filter(t => n >= t.desde);
/* cada estrella de mejora: más daño, más alcance y menos espera */
const MAX_ESTRELLA = 3;
const danoDe   = (d,e) => d.dano * (1 + 0.5*e);
const alcanceDe= (d,e) => d.alcance * (1 + 0.14*e);
const cdDe     = (d,e) => Math.max(8, Math.round(d.cd * Math.pow(0.82, e)));
const costeMejora = (d,e) => d.coste + e*2;
/* los bichos que atacan */
const BICHOS = {
  goomba: {nombre:'goomba', vida:1,   vel:1,   monedas:1, desde:1},
  koopa:  {nombre:'koopa',  vida:0.7, vel:1.7, monedas:1, desde:3},
  jefe:   {nombre:'jefazo', vida:9,   vel:0.55,monedas:6, desde:5},
};
const celPix = (cx,cy) => ({x: TX0 + cx*TC + TC/2, y: TY0 + cy*TC + TC/2});
/* la casa a defender está siempre al final del camino de ese mapa */
function casaTorre(){
  const f = TD.camino[TD.camino.length-1];
  return celPix(f[0], f[1]);
}
function iniciarTorre(){
  const N = nivelDe('torre');
  TD.camino = caminoDe(N);
  TD.torres = []; TD.enem = []; TD.t = 0; TD.sustos = 0; TD.bajas = 0;
  TD.tipo = 0;
  TD.monedas = 5 + N;
  TD.oleada = 0; TD.restan = 0; TD.spawn = 40; TD.tanda = null;
  TD.oleadas = 2 + N;                       /* de 3 a 12 oleadas */
  TD.pedoCd = 0; TD.pedoPrev = false; TD.ponPrev = false; TD.camPrev = false;
  TD.burger = 0; TD.burgerCd = 0; TD.dirPrev = null; TD.repite = 0;
  /* el cursor arranca en una casilla libre, nunca encima del camino */
  TD.cx = 2; TD.cy = 3;
  for(let k=0; k<TW*TH && enCamino(TD.cx, TD.cy); k++){ TD.cx = (TD.cx+1)%TW; if (!TD.cx) TD.cy = (TD.cy+1)%TH; }
  const casa = casaTorre();
  TD.amigo = nuevoRescate('torre', casa.x-13, casa.y-46);
  TD.amigo.salvado = true;                  /* aquí no se rescata: se DEFIENDE */
  aviso('¡Defiende a '+TD.amigo.a.nombre+'! A pone y mejora ⭐ · B cambia', 4.2);
}
function ponerTorre(){
  const N = nivelDe('torre');
  /* si ya hay un defensor en la casilla, A lo MEJORA en vez de dar error */
  const ya = TD.torres.find(o=>o.cx===TD.cx && o.cy===TD.cy);
  if (ya){
    const d = TORRES[ya.t];
    if (ya.est >= MAX_ESTRELLA){ aviso(d.nombre+' ya está al máximo ⭐⭐⭐', 1.6); return; }
    const precio = costeMejora(d, ya.est);
    if (TD.monedas < precio){ aviso('La mejora de '+d.nombre+' cuesta 🪙'+precio, 1.6); sfx.dano(); return; }
    TD.monedas -= precio; ya.est++; ya.brillo = 30;
    sfx.poder(); sacudir(3);
    aviso('⭐ ¡'+d.nombre+' sube a '+'⭐'.repeat(ya.est)+'!', 1.8);
    hablar(VOZ.campeon);
    return;
  }
  const t = TORRES[TD.tipo];
  if (N < t.desde){ aviso(t.nombre+' se abre en el nivel '+t.desde, 1.6); sfx.dano(); return; }
  if (TD.monedas < t.coste){ aviso('Te faltan monedas para '+t.nombre, 1.4); sfx.dano(); return; }
  if (enCamino(TD.cx, TD.cy)){ aviso('Ahí pasan los goombas', 1.4); sfx.dano(); return; }
  TD.monedas -= t.coste;
  TD.torres.push({cx:TD.cx, cy:TD.cy, t:TD.tipo, cd:0, tiro:0, blanco:null, est:0, brillo:20, horno:0});
  sfx.poder(); sacudir(2);
  hablar(t.id==='tiojuan' ? VOZ.tioJuan
       : t.id==='cucu'    ? VOZ.cucu
       : t.id==='tiofran' ? VOZ.pedo
       : t.id==='abu'     ? VOZ.abu
       : t.id==='salomon' ? VOZ.salomon : VOZ.vamos);
  aviso('¡'+t.nombre+' a defender! '+t.gracia, 1.8);
}
function posEnem(e){
  const C = TD.camino;
  const a = C[Math.min(e.i, C.length-1)], b = C[Math.min(e.i+1, C.length-1)];
  const pa = celPix(a[0], a[1]), pb = celPix(b[0], b[1]);
  return {x: pa.x + (pb.x-pa.x)*e.p, y: pa.y + (pb.y-pa.y)*e.p};
}
function updateTorre(){
  TD.t++;
  const N = nivelDe('torre');
  /* mover el cursor casilla a casilla, sin repetir mientras se mantiene */
  const mover = (dx,dy)=>{ TD.cx = Math.max(0, Math.min(TW-1, TD.cx+dx));
                           TD.cy = Math.max(0, Math.min(TH-1, TD.cy+dy)); sfx.moneda(); };
  const dir = mIzq()? 'i' : mDer()? 'd' : mArr()? 'a' : mAbj()? 'b' : null;
  if (dir && dir !== TD.dirPrev){
    if (dir==='i') mover(-1,0); else if (dir==='d') mover(1,0);
    else if (dir==='a') mover(0,-1); else mover(0,1);
    TD.repite = 26;
  } else if (dir && --TD.repite <= 0){
    if (dir==='i') mover(-1,0); else if (dir==='d') mover(1,0);
    else if (dir==='a') mover(0,-1); else mover(0,1);
    TD.repite = 9;
  }
  TD.dirPrev = dir;
  if (mSalta() && !TD.ponPrev) ponerTorre();
  TD.ponPrev = mSalta();
  /* B: cambia de defensor, saltándose los que aún no se han desbloqueado */
  if (mAccion() && !TD.camPrev && !mArr() && !mAbj()){
    for(let v=0; v<TORRES.length; v++){
      TD.tipo = (TD.tipo+1) % TORRES.length;
      if (N >= TORRES[TD.tipo].desde) break;
    }
    sfx.huevo();
  }
  TD.camPrev = mAccion();
  /* PODER 1: el pedo de tío Fran daña a todos los goombas del mapa */
  if (TD.pedoCd>0) TD.pedoCd--;
  if (mArr() && mAccion() && TD.pedoCd<=0){
    TD.pedoCd = PEDO_TD; sfx.pedo(); sacudir(7);
    aviso('💨 ¡PEDO DE TÍO FRAN EN TODO EL CAMPO!', 2.2);
    hablar(VOZ.pedo);
    for(const e of TD.enem){ e.vida -= 3; const p = posEnem(e); nubePedo(p.x, p.y, 6); }
  }
  /* PODER 2: la hamburguesa de tío Juan pone a TODOS los defensores a mil */
  if (TD.burgerCd>0) TD.burgerCd--;
  if (TD.burger>0) TD.burger--;
  if (mAbj() && mAccion() && TD.burgerCd<=0 && TD.burger<=0){
    TD.burgerCd = BURGER_TD; TD.burger = 300; sfx.poder(); sacudir(4);
    aviso('🍔 ¡HAMBURGUESA DE TÍO JUAN! Todos disparan al doble', 2.4);
    hablar(VOZ.hamburguesa);
  }
  /* oleadas: cada una trae su mezcla de bichos, y las últimas traen jefazo */
  if (TD.restan<=0 && TD.enem.length===0 && TD.oleada < TD.oleadas && TD.spawn<=0){
    TD.oleada++;
    TD.restan = 4 + N + TD.oleada*2;
    /* qué bichos salen en esta oleada */
    TD.tanda = ['goomba'];
    if (N >= BICHOS.koopa.desde && TD.oleada >= 2) TD.tanda.push('koopa');
    TD.jefeToca = (N >= BICHOS.jefe.desde && TD.oleada === TD.oleadas);
    aviso('🌊 ¡OLEADA '+TD.oleada+' DE '+TD.oleadas+'!'+(TD.jefeToca ? ' ¡Y VIENE EL JEFAZO!' : ''), 2);
    sfx.heroe();
  }
  if (TD.spawn>0) TD.spawn--;
  if (TD.restan>0 && TD.spawn<=0){
    TD.restan--;
    TD.spawn = Math.max(22, 48 - N*3 - TD.oleada);
    /* el jefazo sale el último de su oleada, para que dé tiempo a prepararse */
    const clase = (TD.jefeToca && TD.restan === 0) ? 'jefe'
                : TD.tanda[(Math.random()*TD.tanda.length)|0];
    const B = BICHOS[clase];
    const vida = Math.max(1, Math.round((2 + N + Math.floor(TD.oleada*0.8)) * B.vida));
    TD.enem.push({clase, i:0, p:0, vida, max:vida, hielo:0, atonta:0,
                  vel:(0.010 + N*0.0008 + TD.oleada*0.0004) * B.vel});
    if (clase === 'jefe'){ sfx.heroe(); sacudir(5); }
  }
  /* bichos por el camino */
  for(const e of TD.enem){
    if (e.hielo>0) e.hielo--;
    if (e.atonta>0){ e.atonta--; continue; }     /* la pedrada los deja clavados */
    e.p += e.vel * (e.hielo>0 ? 0.5 : 1);
    while (e.p >= 1){ e.p -= 1; e.i++; }
    if (e.i >= TD.camino.length-1){
      e.fuera = true;
      susto(TD, '¡Un '+BICHOS[e.clase].nombre+' llegó a la casa! Vidas infinitas: sigue');
    }
  }
  TD.enem = TD.enem.filter(e=>{
    if (e.fuera) return false;
    if (e.vida<=0){
      const p = posEnem(e);
      sumar(e.clase==='jefe' ? 1200 : 250); sfx.pisoton();
      for(let i=0;i<(e.clase==='jefe'?16:6);i++) parts.push({tipo:'estrellita', x:p.x, y:p.y, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*3, t:30});
      /* el jefazo suelta un buen puñado de monedas de golpe */
      if (e.clase === 'jefe'){
        TD.monedas += BICHOS.jefe.monedas; sacudir(6);
        aviso('🪙 ¡El jefazo soltó '+BICHOS.jefe.monedas+' monedas!', 2);
      } else if (++TD.bajas % 4 === 0){ TD.monedas++; aviso('🪙 ¡Una moneda más!', 1.2); }
      return false;
    }
    return true;
  });
  /* los defensores hacen lo suyo con el bicho más adelantado que tengan a tiro */
  for(const to of TD.torres){
    const d = TORRES[to.t];
    if (to.brillo>0) to.brillo--;
    if (to.cd>0) to.cd--;
    if (to.tiro>0) to.tiro--;
    /* ABU no dispara: hornea monedas */
    if (d.hab === 'moneda'){
      if (++to.horno >= Math.round(300 / (1 + 0.5*to.est))){
        to.horno = 0; TD.monedas++; to.brillo = 22; sfx.moneda();
      }
      continue;
    }
    const c = celPix(to.cx, to.cy);
    const alc = alcanceDe(d, to.est);
    let mejor = null, mejorAvance = -1;
    for(const e of TD.enem){
      const p = posEnem(e);
      if (Math.hypot(p.x-c.x, p.y-c.y) > alc) continue;
      const avance = e.i + e.p;
      if (avance > mejorAvance){ mejorAvance = avance; mejor = e; }
    }
    to.blanco = mejor ? posEnem(mejor) : null;
    if (mejor && to.cd<=0){
      to.cd = Math.max(6, Math.round(cdDe(d, to.est) * (TD.burger>0 ? 0.5 : 1)));
      to.tiro = 7;
      const golpe = danoDe(d, to.est);
      mejor.vida -= golpe;
      /* y ahora la gracia de cada uno */
      if (d.hab === 'hielo'){ mejor.hielo = 110 + to.est*40; }
      else if (d.hab === 'pedo'){
        const p0 = posEnem(mejor), radio = 74 + to.est*14;
        nubePedo(p0.x, p0.y, 5);
        for(const o of TD.enem){
          if (o === mejor) continue;
          const po = posEnem(o);
          if (Math.hypot(po.x-p0.x, po.y-p0.y) <= radio) o.vida -= golpe*0.6;
        }
        sfx.pedo();
      }
      else if (d.hab === 'piedra'){
        mejor.atonta = 55 + to.est*18; sacudir(3);
        const p0 = posEnem(mejor);
        for(let i=0;i<7;i++) parts.push({tipo:'ladrillo', x:p0.x, y:p0.y,
          vx:(Math.random()-0.5)*6, vy:-2-Math.random()*4, t:26});
      }
      if (d.hab !== 'pedo') sfx.fuego();
    }
  }
  /* fin del nivel */
  if (TD.oleada >= TD.oleadas && TD.enem.length===0 && TD.restan<=0)
    pasarNivel('torre', iniciarTorre, 'finTorre', VOZ.pichungazo);
}
function drawTorre(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#2a6f26'); g.addColorStop(1,'#1c4a1a');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  /* césped a cuadros */
  for(let y=0;y<TH;y++) for(let x=0;x<TW;x++){
    rect(TX0+x*TC, TY0+y*TC, TC, TC, (x+y)%2 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)');
  }
  /* el camino */
  for(const [cx,cy] of TD.camino){
    rect(TX0+cx*TC, TY0+cy*TC, TC, TC, '#b08a50');
    rect(TX0+cx*TC, TY0+cy*TC, TC, 5, '#c8a068');
  }
  /* por dónde entran los bichos */
  const ent = celPix(TD.camino[0][0], TD.camino[0][1]);
  texto('▶', ent.x-2+Math.sin(T/9)*4, ent.y+7, 26, 'rgba(255,90,90,0.9)', true);
  /* la casa que hay que defender, con el amigo dentro */
  const casa = casaTorre();
  rect(casa.x-28, casa.y-30, 56, 52, '#d8d0c0');
  ctx.fillStyle='#c8402a';
  ctx.beginPath(); ctx.moveTo(casa.x-34, casa.y-30); ctx.lineTo(casa.x, casa.y-58);
  ctx.lineTo(casa.x+34, casa.y-30); ctx.fill();
  rect(casa.x-9, casa.y-4, 18, 26, '#8a5a2a');
  if (TD.amigo){
    const fa = Math.sin(T/14)*3;
    TD.amigo.a.dib(casa.x-13, casa.y-100+fa, T);
    letrero(casa.x, casa.y-112+fa, TD.amigo.a.nombre, '#ffe36e');
  }
  /* torres colocadas */
  for(const to of TD.torres){
    const c = celPix(to.cx, to.cy), d = TORRES[to.t];
    sombra(c.x, c.y+18, 15);
    if (to.brillo>0){                       /* fogonazo al ponerlo o al mejorarlo */
      ctx.globalAlpha = 0.35*(to.brillo/30);
      ctx.fillStyle='#ffe36e';
      ctx.beginPath(); ctx.arc(c.x, c.y, 34, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    dibDefensor(d, c.x, c.y);
    /* las estrellitas de mejora, encima de la cabeza */
    for(let s=0; s<to.est; s++)
      texto('⭐', c.x - (to.est-1)*7 + s*14, c.y-38, 13, '#ffe36e', true);
    if (to.tiro>0 && to.blanco){
      ctx.strokeStyle = d.hab==='hielo' ? '#8ecbff' : d.hab==='piedra' ? '#d0a060' : '#ffe36e';
      ctx.lineWidth = d.hab==='piedra' ? 6 : 3;
      ctx.beginPath(); ctx.moveTo(c.x, c.y-6); ctx.lineTo(to.blanco.x, to.blanco.y); ctx.stroke();
    }
  }
  /* bichos */
  for(const e of TD.enem){
    const p = posEnem(e);
    const esc = e.clase==='jefe' ? 1.7 : 1;
    sombra(p.x, p.y+14, 13*esc);
    ctx.save(); ctx.translate(p.x, p.y); ctx.scale(esc, esc); ctx.translate(-p.x, -p.y);
    if (e.clase==='jefe') dibBowser(p.x-16, p.y-24, T, 0);
    else if (e.clase==='koopa') dibKoopa(p.x-13, p.y-20, {vivo:true}, T);
    else dibGoomba(p.x-13, p.y-12, T);
    ctx.restore();
    if (e.hielo>0){                          /* congelado: se ve azulito */
      ctx.globalAlpha = 0.34;
      ctx.fillStyle='#8ecbff';
      ctx.beginPath(); ctx.arc(p.x, p.y, 19*esc, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
      texto('❄️', p.x+15*esc, p.y-16*esc, 13, '#fff', true);
    }
    if (e.atonta>0) texto('💫', p.x, p.y-30*esc, 15, '#fff', true);
    /* la barrita solo cuando ya le han pegado: si no, en fila india se
       juntan todas y parece una raya verde de punta a punta */
    if (e.vida < e.max || e.clase==='jefe'){
      const an = 30*esc;
      rect(p.x-an/2, p.y-24*esc, an, 5, '#3a0a0a');
      rect(p.x-an/2, p.y-24*esc, an*Math.max(0,e.vida)/e.max, 5, e.clase==='jefe' ? '#ff8a20' : '#5ee08a');
    }
  }
  /* cursor y alcance del defensor elegido */
  const c = celPix(TD.cx, TD.cy), d = TORRES[TD.tipo];
  const N = nivelDe('torre');
  const encima = TD.torres.find(o=>o.cx===TD.cx && o.cy===TD.cy);
  const malSitio = enCamino(TD.cx,TD.cy);
  const col = malSitio ? '#ff5a5a' : encima ? '#8ecbff' : '#ffe36e';
  const alcVista = encima ? alcanceDe(TORRES[encima.t], encima.est) : alcanceDe(d, 0);
  if (alcVista > 0){
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(c.x, c.y, alcVista, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = col;
  ctx.lineWidth = 4;
  ctx.strokeRect(TX0+TD.cx*TC+3, TY0+TD.cy*TC+3, TC-6, TC-6);
  if (!encima){
    ctx.globalAlpha = 0.5;
    dibDefensor(d, c.x, c.y);
    ctx.globalAlpha = 1;
  }
  hudMJ('🏰 TORRE', etiquetaNivel('torre')+'  🌊'+Math.max(1,TD.oleada)+'/'+TD.oleadas+'  🪙'+TD.monedas+'  '+corazonesInf(TD),
        'A pone/mejora · B cambia');
  /* abajo: a quién estás poniendo, o a quién puedes mejorar */
  if (encima){
    const de = TORRES[encima.t];
    const tope = encima.est >= MAX_ESTRELLA;
    const precio = costeMejora(de, encima.est);
    texto(tope ? de.nombre+' '+'⭐'.repeat(encima.est)+' ¡al máximo!'
               : 'A MEJORA a '+de.nombre+' '+'⭐'.repeat(encima.est+1)+' (🪙'+precio+')',
          16, H-16, 16, tope ? '#8ecbff' : (TD.monedas>=precio ? '#5ee08a' : '#ff8a8a'));
  } else if (N < d.desde){
    texto(d.nombre+' se abre en el NIVEL '+d.desde, 16, H-16, 16, '#8a8ab0');
  } else {
    texto('PONES: '+d.nombre+' (🪙'+d.coste+') · '+d.gracia,
          16, H-16, 16, TD.monedas>=d.coste ? '#5ee08a' : '#ff8a8a');
  }
  /* dos poderes: se muestra el que toca cargar */
  if (TD.burger>0)
    barraPoder('🍔 ¡TODOS AL DOBLE!', TD.burger/300, true);
  else if (TD.pedoCd<=0)
    barraPoder('💨 PEDO TOTAL (▲ + B)', 1, true);
  else if (TD.burgerCd<=0)
    barraPoder('🍔 HAMBURGUESA (▼ + B)', 1, true);
  else
    barraPoder('💨 pedo '+Math.round((1-TD.pedoCd/PEDO_TD)*100)+'% · 🍔 '+Math.round((1-TD.burgerCd/BURGER_TD)*100)+'%',
               Math.max(1-TD.pedoCd/PEDO_TD, 1-TD.burgerCd/BURGER_TD), false);
}
/* cada defensor con su propio dibujo */
function dibDefensor(d, x, y){
  if (d.id==='tiojuan')      dibTioJuan(x-14, y-30, T);
  else if (d.id==='cucu')    dibCucu(x-13, y-30, 1, T);
  else if (d.id==='tiofran') dibTioFran(x-14, y-30, T, false);
  else if (d.id==='abu')     dibAbu(x-13, y-30, 1, T, true);
  else if (d.id==='salomon') dibSalomon(x-13, y-28, T, 1);
  else { ctx.save(); ctx.translate(x-13, y-8); dibPerroSolo(d.color); ctx.restore(); }
}

/* ============================================================
   9) FERNANDO NIEVE  (bajada en tabla de nieve)
   ============================================================ */
const SN = { x:0, vx:0, dist:0, obs:[], premios:[], salto:0, saltoPrev:false, turbo:0, turboCd:0,
             t:0, sustos:0, meta:0, frenado:0, amigo:null, amigoDist:0 };
const SNY = 400, TURBO_SN = 200;
function iniciarNieve(){
  const N = nivelDe('nieve');
  SN.x = W/2; SN.vx = 0; SN.dist = 0; SN.obs = []; SN.premios = [];
  SN.salto = 0; SN.saltoPrev = false; SN.turbo = 0; SN.turboCd = 0;
  SN.t = 0; SN.sustos = 0; SN.frenado = 0;
  SN.meta = 3600 + N*700;
  SN.amigoDist = SN.meta * 0.55;
  SN.amigo = nuevoRescate('nieve', 0, -999);
  aviso('¡Baja esquivando los pinos! A salta · B turbo de hamburguesa 🍔', 4);
}
const velNieve = () => (4.6 + nivelDe('nieve')*0.5) * (SN.turbo>0 ? 1.75 : 1) * (SN.frenado>0 ? 0.45 : 1);
function updateNieve(){
  SN.t++;
  const v = velNieve();
  if (SN.frenado>0) SN.frenado--;
  if (SN.turbo>0) SN.turbo--;
  if (SN.turboCd>0) SN.turboCd--;
  if (SN.salto>0) SN.salto--;
  /* mover de lado */
  if (mIzq()) SN.vx -= 0.62; if (mDer()) SN.vx += 0.62;
  SN.vx *= 0.90;
  SN.vx = Math.max(-9, Math.min(9, SN.vx));
  SN.x = Math.max(28, Math.min(W-28, SN.x + SN.vx));
  /* saltar y turbo */
  if (mSalta() && !SN.saltoPrev && SN.salto<=0){ SN.salto = 38; sfx.salto(); }
  SN.saltoPrev = mSalta();
  if (mAccion() && SN.turboCd<=0){
    SN.turbo = 110; SN.turboCd = TURBO_SN; sfx.poder();
    aviso('🍔 ¡TURBO DE HAMBURGUESA!', 1.6); hablar(VOZ.hamburguesa);
  }
  SN.dist += v;
  /* aparecen pinos y premios */
  if (SN.t % Math.max(11, 26 - nivelDe('nieve')*2) === 0)
    SN.obs.push({x: 40 + Math.random()*(W-80), y: -50, tipo: Math.random()<0.25 ? 'roca' : 'pino'});
  if (SN.t % 70 === 0)
    SN.premios.push({x: 40 + Math.random()*(W-80), y: -40});
  /* el amigo aparece a mitad de la bajada */
  if (SN.amigo && SN.amigo.y < -100 && SN.dist >= SN.amigoDist){
    SN.amigo.x = 60 + Math.random()*(W-120); SN.amigo.y = -60;
  }
  for(const o of SN.obs) o.y += v;
  for(const p of SN.premios) p.y += v;
  if (SN.amigo && SN.amigo.y > -100 && !SN.amigo.salvado) SN.amigo.y += v;
  SN.obs = SN.obs.filter(o=>o.y < H+60);
  SN.premios = SN.premios.filter(p=>{
    if (p.y > H+40) return false;
    if (Math.abs(p.x-SN.x)<26 && Math.abs(p.y-SNY)<28){ sumar(150); sfx.moneda(); return false; }
    return true;
  });
  /* chocar: solo si no va saltando ni con turbo */
  if (SN.salto<=0 && SN.turbo<=0){
    for(const o of SN.obs){
      if (o.chocado) continue;
      if (Math.abs(o.x-SN.x)<24 && Math.abs(o.y-SNY)<26){
        o.chocado = true; SN.frenado = 55; SN.vx = (SN.x<o.x?-6:6);
        susto(SN, '¡Auch, un pino! Vidas infinitas: sigue bajando');
      }
    }
  }
  if (SN.amigo && !SN.amigo.salvado && SN.amigo.y > -100)
    rescatar(SN.amigo, SN.x, SNY, 34);
  if (SN.dist >= SN.meta) pasarNivel('nieve', iniciarNieve, 'finNieve', VOZ.pichungazo);
}
function drawNieve(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#bfe8ff'); g.addColorStop(1,'#ffffff');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  /* rayas de la pista que corren hacia abajo */
  ctx.fillStyle='rgba(150,190,230,0.35)';
  for(let i=0;i<14;i++){
    const y = ((i*60 + SN.dist*1.2) % (H+60)) - 30;
    ctx.fillRect(0, y, W, 3);
  }
  /* nieve que vuela */
  ctx.fillStyle='rgba(255,255,255,0.9)';
  for(let i=0;i<50;i++){
    const y = ((i*53 + SN.dist*2.1) % (H+40)) - 20;
    ctx.fillRect((i*167)%W, y, 3, 5);
  }
  /* premios */
  for(const p of SN.premios) dibBurger(p.x-11, p.y-10);
  /* amigo bajando */
  if (SN.amigo && SN.amigo.y > -100) dibRescate(SN.amigo);
  /* pinos y rocas */
  for(const o of SN.obs){
    sombra(o.x, o.y+16, 16);
    if (o.tipo==='roca'){
      ctx.fillStyle='#8a8a96';
      ctx.beginPath(); ctx.roundRect(o.x-18, o.y-16, 36, 32, 10); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.fillRect(o.x-12, o.y-11, 18, 5);
    } else {
      rect(o.x-4, o.y+2, 8, 16, '#7a4a20');
      ctx.fillStyle='#1c6a2a';
      for(const k of [0,1,2]){
        ctx.beginPath();
        ctx.moveTo(o.x, o.y-30+k*13); ctx.lineTo(o.x-19+k*3, o.y-6+k*9); ctx.lineTo(o.x+19-k*3, o.y-6+k*9);
        ctx.fill();
      }
      ctx.fillStyle='rgba(255,255,255,0.85)';
      ctx.beginPath(); ctx.moveTo(o.x, o.y-30); ctx.lineTo(o.x-7, o.y-16); ctx.lineTo(o.x+7, o.y-16); ctx.fill();
    }
  }
  /* Fernando en la tabla */
  const alto = SN.salto>0 ? Math.sin((38-SN.salto)/38*Math.PI)*36 : 0;
  sombra(SN.x, SNY+20, 18 - alto*0.25);
  ctx.save();
  ctx.translate(SN.x, SNY-alto);
  ctx.rotate(SN.vx*0.035);
  rect(-22, 14, 44, 8, '#e03434');
  rect(-20, 15, 40, 3, '#ff8a6a');
  ctx.translate(-12, -28); dibFernandoSolo();
  ctx.restore();
  if (SN.turbo>0){
    ctx.fillStyle='rgba(255,227,110,0.5)';
    for(let i=0;i<8;i++) ctx.fillRect(SN.x-20+Math.random()*40, SNY+20+i*6, 4, 10);
  }
  /* barra de la bajada */
  const frac = Math.min(1, SN.dist/SN.meta);
  rect(W-40, 70, 16, H-160, 'rgba(0,0,0,0.35)');
  rect(W-40, 70, 16, (H-160)*frac, '#5ee08a');
  texto('🏁', W-38, 70+(H-160)*frac+6, 16, '#fff');
  hudMJ('🎿 NIEVE', etiquetaNivel('nieve')+'  '+Math.round(frac*100)+'%  '+corazonesInf(SN), 'A salta · B turbo');
  barraPoder(SN.turbo>0 ? '🍔 ¡TURBO!' : (SN.turboCd<=0 ? '🍔 TURBO LISTO (B)' : '🍔 comiendo...'),
             SN.turbo>0 ? 1 : 1-SN.turboCd/TURBO_SN, SN.turbo>0);
}

/* ============================================================
   10) FERNANDO LUNA  (alunizaje)
   ============================================================ */
const LU = { x:0, y:0, vx:0, vy:0, ang:0, fuel:0, motor:false, suelo:[], plats:[], t:0,
             logrados:0, meta:0, sustos:0, capa:0, capaCd:0, capaPrev:false, amigo:null, platAmigo:0, exito:0 };
const LUPASO = 24, CAPA_CD = 460;
function iniciarLuna(){
  const N = nivelDe('luna');
  LU.meta = 3;                                   /* tres alunizajes por nivel */
  LU.logrados = 0; LU.t = 0; LU.sustos = 0;
  LU.capa = 0; LU.capaCd = 0; LU.capaPrev = false;
  nuevoTerrenoLuna();
  LU.amigo = nuevoRescate('luna', 0, 0);
  aviso('¡Aluniza suavecito en las plataformas! A enciende el motor · ←→ giran', 4.2);
}
function nuevoTerrenoLuna(){
  const N = nivelDe('luna');
  const n = Math.ceil(W/LUPASO)+1;
  LU.suelo = [];
  let h = 430;
  for(let i=0;i<n;i++){
    h += (Math.random()-0.5)*54;
    h = Math.max(330, Math.min(505, h));
    LU.suelo.push(h);
  }
  /* dos o tres plataformas planas donde se puede posar */
  LU.plats = [];
  const nP = Math.max(2, 4 - Math.floor(N/2));
  for(let k=0;k<nP;k++){
    const i0 = 3 + Math.floor((k+0.15)*(n-8)/nP);
    const ancho = 5;
    const hp = 360 + Math.random()*110;
    for(let i=i0;i<i0+ancho && i<n;i++) LU.suelo[i] = hp;
    LU.plats.push({i0, i1:i0+ancho-1, y:hp, x0:i0*LUPASO, x1:(i0+ancho-1)*LUPASO});
  }
  LU.platAmigo = (LU.logrados) % LU.plats.length;
  LU.x = 90 + Math.random()*(W-180); LU.y = 90;
  LU.vx = (Math.random()-0.5)*1.6; LU.vy = 0.4; LU.ang = 0;
  LU.fuel = 620 - N*40;
  LU.exito = 0;
}
const alturaLuna = x => {
  const i = Math.max(0, Math.min(LU.suelo.length-2, Math.floor(x/LUPASO)));
  const f = (x - i*LUPASO)/LUPASO;
  return LU.suelo[i] + (LU.suelo[i+1]-LU.suelo[i])*f;
};
function updateLuna(){
  LU.t++;
  if (LU.exito>0){                        /* pequeña pausa de celebración */
    if (--LU.exito<=0){
      LU.logrados++;
      if (LU.logrados >= LU.meta) pasarNivel('luna', iniciarLuna, 'finLuna', VOZ.pichungazo);
      else { nuevoTerrenoLuna(); aviso('🚀 ¡'+LU.logrados+' de '+LU.meta+'! A por la siguiente', 2); }
    }
    return;
  }
  if (LU.capaCd>0) LU.capaCd--;
  if (LU.capa>0) LU.capa--;
  if (mAccion() && !LU.capaPrev && LU.capaCd<=0){
    LU.capa = 260; LU.capaCd = CAPA_CD; sfx.heroe();
    aviso('🦸 ¡TÍO JUAN TE SOSTIENE!', 2);
    hablar(VOZ.tioJuan);
  }
  LU.capaPrev = mAccion();
  if (mIzq()) LU.ang -= 0.045;
  if (mDer()) LU.ang += 0.045;
  LU.ang = Math.max(-1.2, Math.min(1.2, LU.ang));
  LU.motor = mSalta() && LU.fuel>0;
  if (LU.motor){
    LU.fuel--;
    LU.vx += Math.sin(LU.ang)*0.115;
    LU.vy -= Math.cos(LU.ang)*0.115;
    if (LU.t%3===0) parts.push({tipo:'estrellita', x:LU.x-Math.sin(LU.ang)*16, y:LU.y+Math.cos(LU.ang)*16,
                                vx:(Math.random()-0.5)*2, vy:1.5, t:16});
  }
  LU.vy += LU.capa>0 ? 0.021 : 0.046;
  LU.x += LU.vx; LU.y += LU.vy;
  if (LU.x < 12){ LU.x = 12; LU.vx = Math.abs(LU.vx)*0.4; }
  if (LU.x > W-12){ LU.x = W-12; LU.vx = -Math.abs(LU.vx)*0.4; }
  if (LU.y < 40){ LU.y = 40; LU.vy = Math.abs(LU.vy)*0.4; }
  /* tocar el suelo */
  const hs = alturaLuna(LU.x);
  if (LU.y >= hs-14){
    const plat = LU.plats.find(p=> LU.x >= p.x0-6 && LU.x <= p.x1+LUPASO+6 && Math.abs(hs-p.y)<3);
    const suave = Math.abs(LU.vx) < 1.5 && LU.vy < 2.4 && Math.abs(LU.ang) < 0.42;
    if (plat && (suave || LU.capa>0)){
      LU.y = hs-14; LU.vx = 0; LU.vy = 0; LU.exito = 70;
      sumar(1200); sfx.meta(); sacudir(2);
      for(let i=0;i<14;i++) parts.push({tipo:'estrellita', x:LU.x, y:LU.y+12,
        vx:(Math.random()-0.5)*6, vy:-2-Math.random()*3, t:36});
      const esDelAmigo = LU.plats.indexOf(plat) === LU.platAmigo;
      if (esDelAmigo && LU.amigo && !LU.amigo.salvado){
        LU.amigo.x = LU.x-13; LU.amigo.y = LU.y-26;
        rescatar(LU.amigo, LU.x, LU.y, 60);
      } else { aviso('🚀 ¡Alunizaje perfecto! +1200', 2); hablar(VOZ.gracias); }
    } else {
      /* golpe: vidas infinitas, se vuelve a intentar */
      susto(LU, '¡Muy fuerte! Vidas infinitas: otra vez');
      sfx.muerte();
      for(let i=0;i<12;i++) parts.push({tipo:'ladrillo', x:LU.x, y:hs-10,
        vx:(Math.random()-0.5)*7, vy:-2-Math.random()*4, t:36});
      LU.x = 90 + Math.random()*(W-180); LU.y = 90;
      LU.vx = (Math.random()-0.5)*1.6; LU.vy = 0.4; LU.ang = 0;
      LU.fuel = Math.max(LU.fuel, 320);
    }
  }
}
function drawLuna(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#05061a'); g.addColorStop(1,'#1a1038');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<70;i++){
    ctx.fillStyle='rgba(255,255,255,'+(0.3+Math.sin(T/26+i)*0.25)+')';
    ctx.fillRect((i*137)%W, (i*89)%400, 2, 2);
  }
  /* planeta de fondo */
  ctx.fillStyle='rgba(120,160,255,0.18)';
  ctx.beginPath(); ctx.arc(W-140, 120, 76, 0, Math.PI*2); ctx.fill();
  /* terreno */
  ctx.fillStyle='#6a6a86';
  ctx.beginPath(); ctx.moveTo(0, H);
  for(let i=0;i<LU.suelo.length;i++) ctx.lineTo(i*LUPASO, LU.suelo[i]);
  ctx.lineTo(W, H); ctx.fill();
  ctx.strokeStyle='#b8b8d0'; ctx.lineWidth=3;
  ctx.beginPath();
  for(let i=0;i<LU.suelo.length;i++) (i ? ctx.lineTo(i*LUPASO, LU.suelo[i]) : ctx.moveTo(0, LU.suelo[0]));
  ctx.stroke();
  /* plataformas de alunizaje */
  LU.plats.forEach((p,k)=>{
    rect(p.x0, p.y-5, p.x1-p.x0+LUPASO, 7, k===LU.platAmigo ? '#ffe36e' : '#5ee08a');
    texto(k===LU.platAmigo ? '★' : 'H', (p.x0+p.x1+LUPASO)/2, p.y-12, 15,
          k===LU.platAmigo ? '#ffe36e' : '#5ee08a', true);
    if (k===LU.platAmigo && LU.amigo && !LU.amigo.salvado){
      const cxp = (p.x0+p.x1+LUPASO)/2;
      LU.amigo.a.dib(cxp-13, p.y-46+Math.sin(T/14)*2, T);
      letrero(cxp, p.y-58, LU.amigo.a.nombre, '#ffe36e');
    }
  });
  /* la nave, con Fernando dentro */
  ctx.save(); ctx.translate(LU.x, LU.y); ctx.rotate(LU.ang);
  if (LU.capa>0){
    ctx.globalAlpha = 0.5+Math.sin(T/6)*0.2;
    ctx.fillStyle='#8ecbff';
    ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
  }
  rect(-14, -12, 28, 20, '#d8d8e8');
  rect(-10, -8, 20, 10, '#3a6ad0');
  rect(-4, -6, 8, 6, '#ffc8a0');
  rect(-16, 8, 6, 8, '#8a8a9a'); rect(10, 8, 6, 8, '#8a8a9a');
  rect(-18, 15, 10, 4, '#8a8a9a'); rect(8, 15, 10, 4, '#8a8a9a');
  if (LU.motor){
    ctx.fillStyle = (T>>1)%2 ? '#ffb020' : '#ffe36e';
    ctx.beginPath(); ctx.moveTo(-7, 9); ctx.lineTo(0, 26+Math.random()*8); ctx.lineTo(7, 9); ctx.fill();
  }
  ctx.restore();
  /* medidores de velocidad: en verde cuando se puede posar */
  const suaveX = Math.abs(LU.vx) < 1.5, suaveY = LU.vy < 2.4, recto = Math.abs(LU.ang) < 0.42;
  texto('↔ '+LU.vx.toFixed(1), 16, H-58, 16, suaveX ? '#5ee08a' : '#ff8a8a');
  texto('↕ '+LU.vy.toFixed(1), 16, H-38, 16, suaveY ? '#5ee08a' : '#ff8a8a');
  texto('⟳ '+LU.ang.toFixed(2), 16, H-18, 16, recto ? '#5ee08a' : '#ff8a8a');
  rect(110, H-30, 160, 12, 'rgba(0,0,0,0.4)');
  rect(110, H-30, 160*Math.max(0, LU.fuel)/620, 12, LU.fuel>150 ? '#8ecbff' : '#ff8a4a');
  texto('COMBUSTIBLE', 112, H-36, 12, '#8ecbff');
  hudMJ('🚀 LUNA', etiquetaNivel('luna')+'  🛬'+LU.logrados+'/'+LU.meta+'  '+corazonesInf(LU), 'A motor · ←→ giran');
  barraPoder(LU.capa>0 ? '🦸 ¡TÍO JUAN TE SOSTIENE!' : (LU.capaCd<=0 ? '🦸 TÍO JUAN (B)' : '🦸 volando hacia ti...'),
             LU.capa>0 ? 1 : 1-LU.capaCd/CAPA_CD, LU.capa>0);
}

/* ============================================================
   11) FERNANDO RUNNER  (corre sin parar, estilo Subway Surfers)
   ============================================================ */
const RU = { carril:1, salto:0, agacha:0, dist:0, meta:0, obs:[], t:0, sustos:0, inv:0,
             vuela:0, vuelaCd:0, vPrev:false, sPrev:false, dirPrev:null, amigo:null, amigoDist:0 };
const RHOR = 196, RSUELO = 452, VUELA_CD = 430;
const rp = z => 1/(1 + Math.max(0,z)*0.026);          /* perspectiva sencilla */
const rx = (carril, z) => W/2 + (carril-1)*178*rp(z);
const ry = z => RHOR + (RSUELO-RHOR)*rp(z);
function iniciarRunner(){
  const N = nivelDe('corre');
  RU.carril = 1; RU.salto = 0; RU.agacha = 0; RU.dist = 0; RU.obs = [];
  RU.t = 0; RU.sustos = 0; RU.inv = 0; RU.vuela = 0; RU.vuelaCd = 0;
  RU.vPrev = false; RU.sPrev = false; RU.dirPrev = null;
  RU.meta = 3200 + N*650;
  RU.amigoDist = RU.meta*0.5;
  RU.amigo = nuevoRescate('corre', 0, 0);
  RU.amigo.enPista = false;
  aviso('¡Corre! ←→ cambian de carril · A salta · ▼ se agacha · B vuela con tío Juan', 4.4);
}
const velRunner = () => (5.4 + nivelDe('corre')*0.55) * (RU.vuela>0 ? 1.5 : 1);
function updateRunner(){
  RU.t++;
  const N = nivelDe('corre'), v = velRunner();
  if (RU.inv>0) RU.inv--;
  if (RU.salto>0) RU.salto--;
  if (RU.vuela>0) RU.vuela--;
  if (RU.vuelaCd>0) RU.vuelaCd--;
  RU.agacha = (mAbj() && RU.salto<=0) ? 12 : 0;
  /* cambiar de carril, un paso por pulsación */
  const dir = mIzq() ? 'i' : mDer() ? 'd' : null;
  if (dir && dir !== RU.dirPrev){
    RU.carril = Math.max(0, Math.min(2, RU.carril + (dir==='i' ? -1 : 1)));
    sfx.salto();
  }
  RU.dirPrev = dir;
  if (mSalta() && !RU.sPrev && RU.salto<=0){ RU.salto = 36; sfx.salto(); }
  RU.sPrev = mSalta();
  /* PODER: tío Juan lo lleva volando por encima de todo */
  if (mAccion() && !RU.vPrev && RU.vuelaCd<=0){
    RU.vuela = 230; RU.vuelaCd = VUELA_CD; sfx.heroe();
    aviso('🦸 ¡TÍO JUAN TE LLEVA VOLANDO!', 2.2);
    hablar(VOZ.tioJuan);
  }
  RU.vPrev = mAccion();
  RU.dist += v;
  /* van apareciendo obstáculos y monedas al fondo */
  if (RU.t % Math.max(16, 34 - N*2) === 0){
    /* Un obstáculo no puede caer justo detrás de otro del MISMO carril: el
       salto dura 36 cuadros y el segundo llegaría estando aún en el aire, lo
       que sería imposible de esquivar. Y nunca se bloquean los tres carriles. */
    const zSalto = 36 * v * 0.1 + 10;
    const estorba = (c, margen) => RU.obs.some(o =>
      o.tipo !== 'moneda' && o.tipo !== 'amigo' && o.carril === c && Math.abs(o.z-118) < margen);
    const libres = [0,1,2].filter(c => !estorba(c, zSalto));
    const ocupados = [0,1,2].filter(c => estorba(c, 24)).length;
    if (libres.length && ocupados < 2){
      const carril = libres[(Math.random()*libres.length)|0];
      const tipo = ['valla','techo','tren'][(Math.random()*3)|0];
      RU.obs.push({carril, z:118, tipo});
      /* de vez en cuando una fila de monedas en otro carril */
      if (Math.random() < 0.55){
        const otro = (carril + 1 + ((Math.random()*2)|0)) % 3;
        for(let k=0;k<4;k++) RU.obs.push({carril:otro, z:118+k*7, tipo:'moneda'});
      }
    }
  }
  /* el amigo aparece a mitad del recorrido */
  if (RU.amigo && !RU.amigo.enPista && !RU.amigo.salvado && RU.dist >= RU.amigoDist){
    RU.amigo.enPista = true;
    RU.obs.push({carril:(Math.random()*3)|0, z:120, tipo:'amigo'});
  }
  const salta = RU.salto>0 || RU.vuela>0;
  const agachado = RU.agacha>0 || RU.vuela>0;
  for(const o of RU.obs){
    o.z -= v*0.1;
    if (o.z > 5 || o.z < -7 || o.usado) continue;
    if (o.carril !== RU.carril) continue;
    if (o.tipo==='moneda'){ o.usado = true; sumar(120); sfx.moneda(); continue; }
    if (o.tipo==='amigo'){ o.usado = true; RU.amigo.x = 0; RU.amigo.y = 0;
      rescatar(RU.amigo, 0, 0, 9999); continue; }
    if (RU.vuela>0) continue;                       /* volando no le pasa nada */
    const esquiva = (o.tipo==='valla' && salta) || (o.tipo==='techo' && agachado);
    if (!esquiva && RU.inv<=0){
      o.usado = true; RU.inv = 70;
      susto(RU, '¡Auch! Vidas infinitas: sigue corriendo');
    }
  }
  RU.obs = RU.obs.filter(o=>o.z > -8 && !o.usado);
  if (RU.dist >= RU.meta) pasarNivel('corre', iniciarRunner, 'finRunner', VOZ.pichungazo);
}
function drawRunner(){
  const g = ctx.createLinearGradient(0,0,0,RHOR);
  g.addColorStop(0,'#1a2a6a'); g.addColorStop(1,'#8ec0f0');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,RHOR);
  /* el prado de los lados, que además limpia el cuadro anterior */
  const g2 = ctx.createLinearGradient(0,RHOR,0,H);
  g2.addColorStop(0,'#2f8f22'); g2.addColorStop(1,'#1c5a14');
  ctx.fillStyle=g2; ctx.fillRect(0,RHOR,W,H-RHOR);
  /* edificios al fondo */
  for(let i=0;i<16;i++){
    const bx = ((i*140 - RU.dist*0.06) % (W+200) + (W+200)) % (W+200) - 100;
    const bh = 40 + (i*37)%90;
    rect(bx, RHOR-bh, 96, bh, '#2a3a6a');
    for(let k=0;k<4;k++) rect(bx+12+k*20, RHOR-bh+10, 10, 10, 'rgba(255,227,110,0.35)');
  }
  /* la pista en perspectiva */
  ctx.fillStyle='#6a6a78';
  ctx.beginPath();
  ctx.moveTo(rx(-0.6,118), ry(118)); ctx.lineTo(rx(2.6,118), ry(118));
  ctx.lineTo(rx(2.6,0), H); ctx.lineTo(rx(-0.6,0), H);
  ctx.fill();
  /* líneas de los carriles y traviesas que corren */
  ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=3;
  for(const c of [-0.5, 0.5, 1.5, 2.5]){
    ctx.beginPath(); ctx.moveTo(rx(c,118), ry(118)); ctx.lineTo(rx(c,0), H); ctx.stroke();
  }
  for(let i=0;i<16;i++){
    const z = ((i*9 - RU.dist*0.1) % 118 + 118) % 118;
    const p = rp(z), y = ry(z);
    ctx.fillStyle = 'rgba(0,0,0,'+(0.10*p)+')';
    ctx.fillRect(rx(-0.6,z), y, rx(2.6,z)-rx(-0.6,z), Math.max(2, 10*p));
  }
  /* obstáculos, de lejos a cerca */
  const orden = RU.obs.slice().sort((a,b)=>b.z-a.z);
  for(const o of orden){
    const p = rp(o.z), x = rx(o.carril, o.z), y = ry(o.z);
    if (o.tipo==='moneda'){ ctx.save(); ctx.translate(x, y-46*p); ctx.scale(p*1.1, p*1.1);
      dibBurger(-11,-10); ctx.restore(); continue; }
    if (o.tipo==='amigo'){ ctx.save(); ctx.translate(x, y-56*p); ctx.scale(p*1.2, p*1.2);
      RU.amigo.a.dib(-13, -14, T); ctx.restore();
      if (p>0.5) letrero(x, y-64*p, RU.amigo.a.nombre, '#ffe36e');
      continue; }
    if (o.tipo==='valla'){
      rect(x-52*p, y-40*p, 104*p, 12*p, '#e0a020');
      rect(x-52*p, y-28*p, 104*p, 26*p, '#c85a20');
      for(let k=0;k<4;k++) rect(x-46*p+k*26*p, y-26*p, 10*p, 22*p, '#f0d060');
    } else if (o.tipo==='techo'){
      rect(x-58*p, y-150*p, 116*p, 46*p, '#3a4a8a');
      rect(x-58*p, y-108*p, 116*p, 10*p, '#8ecbff');
      texto('AGÁCHATE', x, y-118*p, Math.max(9, 15*p), '#ffe36e', true);
    } else {
      rect(x-54*p, y-118*p, 108*p, 118*p, '#c83a3a');
      rect(x-54*p, y-118*p, 108*p, 16*p, '#f06a5a');
      rect(x-40*p, y-92*p, 34*p, 30*p, '#8ecbff');
      rect(x+8*p, y-92*p, 34*p, 30*p, '#8ecbff');
    }
  }
  /* Fernando corriendo */
  const alto = RU.salto>0 ? Math.sin((36-RU.salto)/36*Math.PI)*90 : 0;
  const px = rx(RU.carril, 0), py = ry(0) - alto - (RU.vuela>0 ? 120 : 0);
  sombra(px, ry(0)+4, 26);
  if (!(RU.inv>0 && (T>>2)%2)){
    ctx.save(); ctx.translate(px, py); ctx.scale(1.5, RU.agacha>0 ? 0.85 : 1.5);
    ctx.translate(-12, -40); dibFernandoSolo(); ctx.restore();
    if (RU.vuela>0) dibTioJuan(px-14, py-96+Math.sin(T/8)*5, T);
  }
  /* barra de avance */
  const frac = Math.min(1, RU.dist/RU.meta);
  rect(24, H-26, W-260, 14, 'rgba(0,0,0,0.4)');
  rect(24, H-26, (W-260)*frac, 14, '#5ee08a');
  texto('🏁', 24+(W-260)*frac-6, H-14, 15, '#fff');
  hudMJ('🏃 RUNNER', etiquetaNivel('corre')+'  '+Math.round(frac*100)+'%  '+corazonesInf(RU), 'A salta · ▼ agacha');
  barraPoder(RU.vuela>0 ? '🦸 ¡VOLANDO!' : (RU.vuelaCd<=0 ? '🦸 TÍO JUAN (B)' : '🦸 ya viene...'),
             RU.vuela>0 ? 1 : 1-RU.vuelaCd/VUELA_CD, RU.vuela>0);
}

/* ============================================================
   12) FLAPPY FERNANDO
   ============================================================ */
const FL = { y:0, vy:0, tubos:[], pasados:0, meta:0, t:0, sustos:0, inv:0,
             globo:0, globoCd:0, gPrev:false, aPrev:false, amigo:null, amigoPuesto:false };
const FLX = 220, FLSUELO = 470, GLOBO_CD = 380;
function iniciarFlappy(){
  const N = nivelDe('flappy');
  FL.y = 240; FL.vy = 0; FL.tubos = []; FL.pasados = 0; FL.t = 0; FL.sustos = 0; FL.inv = 0;
  FL.globo = 0; FL.globoCd = 0; FL.gPrev = false; FL.aPrev = false;
  FL.meta = 8 + N*2;                                   /* de 10 a 20 tubos */
  FL.amigo = nuevoRescate('flappy', 0, 0);
  FL.amigoPuesto = false;
  aviso('¡Toca A para aletear! Pasa '+FL.meta+' tubos · B saca el globo 🎈', 4);
}
function updateFlappy(){
  FL.t++;
  const N = nivelDe('flappy');
  const vel = 3.1 + N*0.28;
  const hueco = Math.max(128, 190 - N*10);
  if (FL.inv>0) FL.inv--;
  if (FL.globo>0) FL.globo--;
  if (FL.globoCd>0) FL.globoCd--;
  /* aletear */
  if ((mSalta()||mArr()) && !FL.aPrev){ FL.vy = FL.globo>0 ? -4.6 : -7.4; sfx.salto();
    for(let i=0;i<3;i++) parts.push({tipo:'polvo', x:FLX-14, y:FL.y+16, vx:-1, vy:1, t:16}); }
  FL.aPrev = mSalta()||mArr();
  /* PODER: el globo lo deja flotar suavecito y sin sustos */
  if (mAccion() && !FL.gPrev && FL.globoCd<=0){
    FL.globo = 300; FL.globoCd = GLOBO_CD; sfx.poder();
    aviso('🎈 ¡GLOBO! Flotas suavecito y nada te toca', 2.2); hablar(VOZ.volar);
  }
  FL.gPrev = mAccion();
  FL.vy += FL.globo>0 ? 0.16 : 0.44;
  FL.vy = Math.min(FL.vy, FL.globo>0 ? 3.4 : 10);
  FL.y += FL.vy;
  if (FL.y < 34){ FL.y = 34; FL.vy = 0; }
  /* tubos */
  if (FL.t % Math.max(70, 108 - N*6) === 0 && FL.pasados + FL.tubos.length < FL.meta + 2){
    const centro = 130 + Math.random()*(FLSUELO-260);
    FL.tubos.push({x:W+40, c:centro, pasado:false});
  }
  for(const tu of FL.tubos){
    tu.x -= vel;
    if (!tu.pasado && tu.x + 40 < FLX){
      tu.pasado = true; FL.pasados++; sumar(200); sfx.moneda();
    }
    if (FL.globo>0 || FL.inv>0) continue;
    const dentro = Math.abs(tu.x - FLX) < 52;
    if (dentro && (FL.y < tu.c - hueco/2 || FL.y > tu.c + hueco/2)){
      FL.inv = 80; FL.vy = -3;
      FL.y = tu.c;                                    /* lo pone en el hueco y sigue */
      susto(FL, '¡Pum! Vidas infinitas: te pongo en el hueco');
    }
  }
  FL.tubos = FL.tubos.filter(tu=>tu.x > -70);
  if (FL.y > FLSUELO-18){
    FL.y = FLSUELO-18; FL.vy = -6;
    if (FL.inv<=0 && FL.globo<=0){ FL.inv = 80; susto(FL, '¡Al suelo! Vidas infinitas: arriba otra vez'); }
  }
  /* el amigo aparece a mitad de camino, volando entre los tubos */
  if (!FL.amigoPuesto && FL.pasados >= Math.floor(FL.meta/2)){
    FL.amigoPuesto = true;
    FL.amigo.x = W+60; FL.amigo.y = 120 + Math.random()*220;
  }
  if (FL.amigoPuesto && !FL.amigo.salvado){
    FL.amigo.x -= vel;
    rescatar(FL.amigo, FLX, FL.y+14, 40);
    if (FL.amigo.x < -60){ FL.amigo.x = W+60; FL.amigo.y = 120 + Math.random()*220; }
  }
  if (FL.pasados >= FL.meta) pasarNivel('flappy', iniciarFlappy, 'finFlappy', VOZ.pichungazo);
}
function drawFlappy(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#4aa0e8'); g.addColorStop(1,'#bfe8ff');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<7;i++){
    const cx = ((i*220 - FL.t*0.5) % (W+240) + (W+240)) % (W+240) - 120;
    ctx.fillStyle='rgba(255,255,255,0.85)';
    ctx.beginPath(); ctx.ellipse(cx, 90+(i%3)*46, 52, 18, 0, 0, Math.PI*2); ctx.fill();
  }
  const N = nivelDe('flappy'), hueco = Math.max(128, 190 - N*10);
  for(const tu of FL.tubos){
    for(const [y0,y1] of [[0, tu.c-hueco/2], [tu.c+hueco/2, FLSUELO]]){
      rect(tu.x-38, y0, 76, y1-y0, '#2a9c3a');
      rect(tu.x-34, y0, 12, y1-y0, '#6ad048');
      rect(tu.x+22, y0, 8, y1-y0, '#1a6a24');
    }
    rect(tu.x-46, tu.c-hueco/2-26, 92, 26, '#2a9c3a');
    rect(tu.x-42, tu.c-hueco/2-22, 12, 22, '#6ad048');
    rect(tu.x-46, tu.c+hueco/2, 92, 26, '#2a9c3a');
    rect(tu.x-42, tu.c+hueco/2+4, 12, 22, '#6ad048');
  }
  rect(0, FLSUELO, W, H-FLSUELO, '#3fae2f');
  rect(0, FLSUELO, W, 8, '#2f8f22');
  if (FL.amigoPuesto && !FL.amigo.salvado) dibRescate(FL.amigo);
  /* Fernando volando */
  if (!(FL.inv>0 && (FL.t>>2)%2)){
    if (FL.globo>0) dibGlobitos(FLX, FL.y+18, 2, '#f8b800');
    ctx.save(); ctx.translate(FLX, FL.y);
    ctx.rotate(Math.max(-0.5, Math.min(0.9, FL.vy*0.07)));
    ctx.translate(-12, -14); dibFernandoSolo();
    /* alitas que aletean */
    ctx.fillStyle='#fff';
    const al = Math.sin(FL.t/3)*7;
    ctx.beginPath(); ctx.ellipse(-6, 16+al, 12, 6, -0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(30, 16-al, 12, 6, 0.4, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }
  texto(FL.pasados+' / '+FL.meta, W/2, 96, 40, '#fff', true);
  hudMJ('🐤 FLAPPY', etiquetaNivel('flappy')+'  TUBOS '+FL.pasados+'/'+FL.meta+'  '+corazonesInf(FL), 'A aletea');
  barraPoder(FL.globo>0 ? '🎈 ¡GLOBO!' : (FL.globoCd<=0 ? '🎈 GLOBO (B)' : '🎈 inflando...'),
             FL.globo>0 ? 1 : 1-FL.globoCd/GLOBO_CD, FL.globo>0);
}

/* ============================================================
   13) FERNANDO-MAN  (laberinto de hamburguesas)
   ============================================================ */
const MAPA_COCO = [
  '###################',
  '#o.......#.......o#',
  '#.##.###.#.###.##.#',
  '#.................#',
  '#.##.#.#####.#.##.#',
  '#....#...#...#....#',
  '###..###.#.###..###',
  '#o.......#.......o#',
  '#.##.###.#.###.##.#',
  '#.................#',
  '###################',
];
const CO = { g:[], x:0, y:0, dx:0, dy:0, qx:0, qy:0, bolitas:0, fant:[], t:0, sustos:0, inv:0,
             asusta:0, pedoCd:0, pPrev:false, amigo:null, vel:2.4 };
const CC = 40, COW = 19, COH = 11, COX0 = 100, COY0 = 76, PEDO_CO = 400;
const coCel = (cx,cy) => (cx<0||cy<0||cx>=COW||cy>=COH) ? '#' : CO.g[cy][cx];
const coLibre = (cx,cy) => coCel(cx,cy) !== '#';
const coPix = (cx,cy) => ({x: COX0 + cx*CC + CC/2, y: COY0 + cy*CC + CC/2});
function iniciarCoco(){
  const N = nivelDe('coco');
  CO.g = MAPA_COCO.map(f=>f.split(''));
  CO.bolitas = 0;
  for(let y=0;y<COH;y++) for(let x=0;x<COW;x++) if (CO.g[y][x]==='.'||CO.g[y][x]==='o') CO.bolitas++;
  const ini = coPix(9, 3);
  CO.x = ini.x; CO.y = ini.y; CO.dx = 0; CO.dy = 0; CO.qx = 0; CO.qy = 0;
  CO.tcx = undefined; CO.tcy = undefined;
  CO.t = 0; CO.sustos = 0; CO.inv = 0; CO.asusta = 0; CO.pedoCd = 0; CO.pPrev = false;
  CO.vel = 2.4 + N*0.12;
  const casas = [[1,1],[17,1],[1,9],[17,9]];
  CO.fant = casas.map((c,i)=>{
    const p = coPix(c[0], c[1]);
    const f = {x:p.x, y:p.y, dx:0, dy:0, qx:0, qy:0, tcx:c[0], tcy:c[1],
               color:['#e03434','#ff9ed6','#8ecbff','#f8a020'][i],
               nombre:['BOWSER','RÓMULO','KOOPA','GOOMBA'][i],
               vel:1.5 + N*0.13 + i*0.06, salida:i*70};
    f.decide = (cx,cy)=>decidirFantasma(f, cx, cy);
    return f;
  });
  /* el amigo del nivel, escondido en una esquina del laberinto */
  const rincones = [[1,5],[17,5],[9,1],[9,9],[3,3],[15,7]];
  const rc = rincones[(N-1) % rincones.length];
  const pa = coPix(rc[0], rc[1]);
  CO.amigo = nuevoRescate('coco', pa.x-13, pa.y-20);
  aviso('¡Cómete todas las hamburguesas! Las ⭐ asustan a los fantasmas · B = pedo 💨', 4.4);
}
/* Movimiento por rejilla: cada uno va SIEMPRE hacia el centro de una casilla
   destino y solo al llegar decide la siguiente. Comparar la distancia al
   centro con la velocidad no vale: por los decimales de la coma flotante se
   quedaba pegado al centro y no avanzaba nunca. */
const coCelActual = o => ({ cx: Math.round((o.x-COX0-CC/2)/CC),
                            cy: Math.round((o.y-COY0-CC/2)/CC) });
function coMover(o, vel){
  if (o.tcx === undefined){ const c0 = coCelActual(o); o.tcx = c0.cx; o.tcy = c0.cy; }
  const dest = coPix(o.tcx, o.tcy);
  const dx = dest.x - o.x, dy = dest.y - o.y;
  if (Math.abs(dx) + Math.abs(dy) <= vel + 0.002){
    o.x = dest.x; o.y = dest.y;                 /* llegó al centro: aquí se decide */
    if (o.decide) o.decide(o.tcx, o.tcy);
    if ((o.qx||o.qy) && coLibre(o.tcx+o.qx, o.tcy+o.qy)){ o.dx = o.qx; o.dy = o.qy; }
    if (!coLibre(o.tcx+o.dx, o.tcy+o.dy)){ o.dx = 0; o.dy = 0; }
    if (o.dx || o.dy){ o.tcx += o.dx; o.tcy += o.dy; }
  } else {
    o.x += Math.max(-vel, Math.min(vel, dx));
    o.y += Math.max(-vel, Math.min(vel, dy));
  }
  return coCelActual(o);
}
/* los fantasmas eligen el camino que más los acerca a Fernando (o que más los
   aleja mientras están asustados), y no se dan la vuelta si tienen otra salida */
function decidirFantasma(f, cx, cy){
  const huye = CO.asusta > 0;
  const salidas = [[1,0],[-1,0],[0,1],[0,-1]].filter(([ox,oy])=>
    coLibre(cx+ox, cy+oy) && !(ox === -f.dx && oy === -f.dy));
  const lista = salidas.length ? salidas : [[-f.dx, -f.dy]];
  const coste = ([ox,oy]) => {
    const p = coPix(cx+ox, cy+oy);
    return Math.hypot(p.x-CO.x, p.y-CO.y);
  };
  lista.sort((a,b)=> huye ? coste(b)-coste(a) : coste(a)-coste(b));
  f.qx = lista[0][0]; f.qy = lista[0][1];
}
function updateCoco(){
  CO.t++;
  if (CO.inv>0) CO.inv--;
  if (CO.asusta>0) CO.asusta--;
  if (CO.pedoCd>0) CO.pedoCd--;
  if (mIzq()){ CO.qx=-1; CO.qy=0; } else if (mDer()){ CO.qx=1; CO.qy=0; }
  else if (mArr()){ CO.qx=0; CO.qy=-1; } else if (mAbj()){ CO.qx=0; CO.qy=1; }
  /* PODER: el pedo asusta a todos los fantasmas sin gastar estrella */
  if (mAccion() && !CO.pPrev && CO.pedoCd<=0){
    CO.pedoCd = PEDO_CO; CO.asusta = Math.max(CO.asusta, 300);
    sfx.pedo(); sacudir(5); nubePedo(CO.x, CO.y, 16);
    aviso('💨 ¡PEDO! Los fantasmas salen corriendo', 2.2);
    hablar(VOZ.pedo);
  }
  CO.pPrev = mAccion();
  const c = coMover(CO, CO.vel);
  /* comer */
  const cel = coCel(c.cx, c.cy);
  if (cel==='.'){ CO.g[c.cy][c.cx]=' '; CO.bolitas--; sumar(30); if (CO.t%4===0) sfx.moneda(); }
  else if (cel==='o'){
    CO.g[c.cy][c.cx]=' '; CO.bolitas--; sumar(150); sfx.poder();
    CO.asusta = 360; aviso('⭐ ¡A por ellos!', 1.6); hablar(VOZ.ataque);
  }
  rescatar(CO.amigo, CO.x, CO.y, 30);
  /* fantasmas */
  for(const f of CO.fant){
    if (f.salida>0){ f.salida--; continue; }
    coMover(f, f.vel * (CO.asusta>0 ? 0.62 : 1));
    /* encuentro */
    if (Math.abs(f.x-CO.x) < 22 && Math.abs(f.y-CO.y) < 22){
      if (CO.asusta>0){
        sumar(600); sacudir(3);
        if (f.nombre==='RÓMULO'){ sfx.eructo(); hablar(VOZ.romulo); }
        else { sfx.pisoton(); if (Math.random()<0.4) hablar(VOZ.pichungazo); }
        const casa = coPix(9, 3);
        f.x = casa.x; f.y = casa.y; f.salida = 150; f.dx = 0; f.dy = 0;
        f.tcx = undefined; f.tcy = undefined; f.qx = 0; f.qy = 0;
        for(let i=0;i<6;i++) parts.push({tipo:'estrellita', x:f.x, y:f.y, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*3, t:30});
      } else if (CO.asusta<=0 && CO.inv<=0){
        CO.inv = 110;
        const ini = coPix(9, 3);
        CO.x = ini.x; CO.y = ini.y; CO.dx = 0; CO.dy = 0; CO.qx = 0; CO.qy = 0;
        CO.tcx = undefined; CO.tcy = undefined;
        susto(CO, '¡Te atrapó! Vidas infinitas: vuelves al centro');
      }
    }
  }
  if (CO.bolitas <= 0) pasarNivel('coco', iniciarCoco, 'finCoco', VOZ.pichungazo);
}
function drawCoco(){
  ctx.fillStyle='#04061e'; ctx.fillRect(0,0,W,H);
  for(let y=0;y<COH;y++) for(let x=0;x<COW;x++){
    const p = {x: COX0+x*CC, y: COY0+y*CC};
    const cel = CO.g[y][x];
    if (cel==='#'){
      rect(p.x+3, p.y+3, CC-6, CC-6, '#1a2a8a');
      rect(p.x+6, p.y+6, CC-12, 5, '#4a6ad8');
    } else if (cel==='.'){
      ctx.save(); ctx.translate(p.x+CC/2-9, p.y+CC/2-8); ctx.scale(0.8,0.8); dibBurger(0,0); ctx.restore();
    } else if (cel==='o'){
      const s = 1+Math.sin(CO.t/7)*0.16;
      ctx.save(); ctx.translate(p.x+CC/2, p.y+CC/2); ctx.scale(s,s);
      texto('★', 0, 8, 26, '#ffe36e', true);
      ctx.restore();
    }
  }
  dibRescate(CO.amigo);
  /* fantasmas */
  for(const f of CO.fant){
    const asustado = CO.asusta>0;
    ctx.fillStyle = asustado ? ((CO.asusta<80 && (CO.t>>2)%2) ? '#fff' : '#3a5ad8') : f.color;
    ctx.beginPath();
    ctx.arc(f.x, f.y-4, 15, Math.PI, 0);
    ctx.lineTo(f.x+15, f.y+13);
    for(let k=0;k<3;k++) ctx.lineTo(f.x+15-(k*2+1)*5, f.y + (k%2 ? 13 : 5));
    ctx.lineTo(f.x-15, f.y+13);
    ctx.closePath(); ctx.fill();
    if (!asustado){
      rect(f.x-9+f.dx*3, f.y-8, 7, 8, '#fff'); rect(f.x+2+f.dx*3, f.y-8, 7, 8, '#fff');
      rect(f.x-7+f.dx*5, f.y-5, 4, 4, '#222'); rect(f.x+4+f.dx*5, f.y-5, 4, 4, '#222');
    } else {
      rect(f.x-8, f.y-6, 4, 4, '#fff'); rect(f.x+4, f.y-6, 4, 4, '#fff');
      rect(f.x-9, f.y+3, 18, 3, '#fff');
    }
    if (f.salida<=0 && !asustado) texto(f.nombre, f.x, f.y-24, 10, f.color, true);
  }
  /* Fernando comilón */
  if (!(CO.inv>0 && (CO.t>>2)%2)){
    ctx.save(); ctx.translate(CO.x, CO.y);
    if (CO.dx<0) ctx.scale(-1,1);
    ctx.translate(-12, -20); dibFernandoSolo();
    ctx.restore();
  }
  if (CO.asusta>0){
    ctx.strokeStyle='rgba(255,227,110,'+(0.4+Math.sin(CO.t/5)*0.25)+')'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(CO.x, CO.y, 26, 0, Math.PI*2); ctx.stroke();
  }
  hudMJ('🟡 COCO', etiquetaNivel('coco')+'  🍔'+CO.bolitas+'  '+corazonesInf(CO), 'flechas · B pedo');
  barraPoder(CO.asusta>0 ? '💨 ¡A POR ELLOS!' : (CO.pedoCd<=0 ? '💨 PEDO (B)' : '💨 cargando...'),
             CO.asusta>0 ? 1 : 1-CO.pedoCd/PEDO_CO, CO.asusta>0);
}

/* ============================================================
   14) FERNANDO MEGA  (estilo Mega Man: al vencer al jefe le robas su poder)
   ============================================================ */
const ARMAS = [
  {id:'normal',   nombre:'PICHUNGAZO', color:'#ffe36e', dano:1, vel:11, r:6},
  {id:'fuego',    nombre:'FUEGO',      color:'#ff6a20', dano:2, vel:9,  r:8, cae:true},
  {id:'hielo',    nombre:'HIELO',      color:'#8ecbff', dano:1, vel:10, r:8, congela:true},
  {id:'pedo',     nombre:'PEDO',       color:'#7ad84a', dano:2, vel:6,  r:14, area:true},
  {id:'estrella', nombre:'ESTRELLA',   color:'#ffe36e', dano:2, vel:12, r:9, atraviesa:true},
  {id:'hueso',    nombre:'HUESO',      color:'#f4f0e2', dano:4, vel:7,  r:11},
];
const MG = { x:0, y:0, vy:0, suelo:false, cara:1, balas:[], balasJ:[], enem:[], plats:[],
             largo:0, jefe:null, arma:0, armas:[0], carga:0, t:0, sustos:0, inv:0,
             saltoPrev:false, armaPrev:false, dispPrev:false, amigo:null, camX:0 };
const MGS = 452;
function iniciarMega(){
  const N = nivelDe('mega');
  MG.x = 80; MG.y = MGS; MG.vy = 0; MG.cara = 1; MG.balas = []; MG.balasJ = [];
  MG.t = 0; MG.sustos = 0; MG.inv = 0; MG.carga = 0; MG.camX = 0;
  MG.saltoPrev = false; MG.armaPrev = false; MG.dispPrev = false;
  MG.armas = [0];
  for(let k=1;k<N;k++) MG.armas.push(k);          /* las armas robadas en niveles anteriores */
  MG.arma = 0;
  MG.largo = 2000 + N*260;
  MG.jefe = null;
  /* plataformas y enemigos repartidos por el pasillo */
  MG.plats = [];
  for(let x=380; x<MG.largo-320; x+=260){
    MG.plats.push({x, y: 250 + ((x/260)%3)*66, w: 150});
    if ((x/260)%2===0) MG.plats.push({x:x+120, y: 180 + ((x/130)%2)*50, w: 110});
  }
  MG.enem = [];
  for(let x=520; x<MG.largo-260; x+=210){
    const p = MG.plats.find(pl=>pl.x < x && x < pl.x+pl.w);
    MG.enem.push({x, y: p ? p.y : MGS, x0:x-60, x1:x+60, vx: 1.1 + N*0.1,
                  vida: 1 + Math.floor(N/2), hielo:0, tipo: (x/210)%3===0 ? 'koopa' : 'goomba'});
  }
  MG.amigo = nuevoRescate('mega', MG.largo-140, MGS-46);
  aviso('¡Vence al jefe y ROBA su poder! B dispara (mantenlo para cargar) · ▲ cambia de arma', 4.6);
}
const armaMG = () => ARMAS[MG.armas[MG.arma % MG.armas.length]];
function updateMega(){
  MG.t++;
  const N = nivelDe('mega');
  if (MG.inv>0) MG.inv--;
  /* movimiento */
  if (mIzq()){ MG.x -= 3.6; MG.cara = -1; }
  if (mDer()){ MG.x += 3.6; MG.cara = 1; }
  const tope = MG.jefe ? MG.largo+300 : MG.largo+40;
  MG.x = Math.max(20, Math.min(tope, MG.x));
  if (mSalta() && MG.suelo && !MG.saltoPrev){ MG.vy = -11.4; MG.suelo = false; sfx.salto(); }
  MG.saltoPrev = mSalta();
  const antes = MG.y;
  MG.vy = Math.min(MG.vy + 0.58, 14); MG.y += MG.vy;
  MG.suelo = false;
  if (MG.y >= MGS){ MG.y = MGS; MG.vy = 0; MG.suelo = true; }
  for(const p of MG.plats){
    if (MG.x > p.x-14 && MG.x < p.x+p.w+14 && MG.vy>=0 && antes <= p.y+6 && MG.y >= p.y){
      MG.y = p.y; MG.vy = 0; MG.suelo = true;
    }
  }
  /* cambiar de arma */
  if (mArr() && !MG.armaPrev && MG.armas.length>1){
    MG.arma = (MG.arma+1) % MG.armas.length;
    sfx.huevo(); aviso('🔫 '+armaMG().nombre, 1.4);
  }
  MG.armaPrev = mArr();
  /* disparo con carga */
  if (mAccion()){ MG.carga = Math.min(MG.carga+1, 70); }
  else if (MG.carga > 0){
    const a = armaMG(), grande = MG.carga > 42;
    MG.balas.push({x:MG.x+16*MG.cara, y:MG.y-26, vx:a.vel*MG.cara, vy:0,
                   a, grande, dano: a.dano*(grande?3:1), r: a.r*(grande?1.9:1)});
    sfx.fuego(); MG.carga = 0;
    if (grande) sacudir(3);
  }
  MG.dispPrev = mAccion();
  for(const b of MG.balas){
    b.x += b.vx;
    if (b.a.cae){ b.vy += 0.28; b.y += b.vy;
      if (b.y > MGS-6){ b.y = MGS-6; b.vy = -Math.abs(b.vy)*0.7; } }
  }
  /* se descartan las balas lejanas AL JUGADOR, no a la cámara: mientras la
     cámara alcanza al jefe, los disparos no deben esfumarse a medio camino */
  MG.balas = MG.balas.filter(b=>!b.fuera && Math.abs(b.x-MG.x) < W);
  /* enemigos */
  for(const e of MG.enem){
    if (e.muerto) continue;
    if (e.hielo>0){ e.hielo--; }
    else {
      e.x += e.vx;
      if (e.x < e.x0 || e.x > e.x1) e.vx *= -1;
    }
    for(const b of MG.balas){
      if (b.fuera) continue;
      if (Math.abs(b.x-e.x) < 20+b.r && Math.abs(b.y-(e.y-16)) < 26+b.r){
        e.vida -= b.dano;
        if (b.a.congela) e.hielo = 150;
        if (b.a.area) for(const o of MG.enem)
          if (!o.muerto && Math.hypot(o.x-e.x, o.y-e.y) < 90) o.vida -= 1;
        if (!b.a.atraviesa) b.fuera = true;
        if (e.vida<=0){
          e.muerto = true; sumar(300); sfx.pisoton();
          for(let i=0;i<6;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y-16,
            vx:(Math.random()-0.5)*4, vy:-2-Math.random()*3, t:30});
        }
      }
    }
    if (MG.inv<=0 && e.hielo<=0 && Math.abs(e.x-MG.x)<24 && Math.abs(e.y-MG.y)<38){
      MG.inv = 80; MG.x -= 30*MG.cara;
      susto(MG, '¡Ay! Vidas infinitas: sigue disparando');
    }
  }
  /* el jefe espera al final del pasillo */
  if (!MG.jefe && MG.x > MG.largo-60){
    const arma = ARMAS[Math.min(N, ARMAS.length-1)];
    MG.jefe = {x: MG.largo+190, y: 300, vy:0, vida: 16+N*5, max: 16+N*5, golpe:0, t:0, arma};
    aviso('👑 ¡BOWSER '+arma.nombre+'! Vence y quédate con su poder', 3);
    sfx.heroe();
  }
  if (MG.jefe){
    const j = MG.jefe;
    j.t++;
    j.vy = Math.min(j.vy+0.5, 13); j.y += j.vy;
    if (j.y >= MGS-6){ j.y = MGS-6; j.vy = -9 - Math.random()*3; }
    j.x += Math.sign(MG.x - j.x) * 0.9;
    j.x = Math.max(MG.largo+70, Math.min(MG.largo+300, j.x));
    if (j.t % Math.max(38, 76 - N*6) === 0){
      MG.balasJ.push({x:j.x, y:j.y-10, vx: Math.sign(MG.x-j.x)*5.4 || -5.4, color:j.arma.color});
      sfx.fuego();
    }
    if (j.golpe>0) j.golpe--;
    for(const b of MG.balas){
      if (b.fuera) continue;
      if (Math.abs(b.x-(j.x+20)) < 46 && Math.abs(b.y-(j.y+18)) < 46){
        j.vida -= b.dano; j.golpe = 8; b.fuera = true; sfx.pisoton(); sumar(80);
      }
    }
    if (j.vida <= 0){
      const idx = ARMAS.indexOf(j.arma);
      if (idx>0 && !MG.armas.includes(idx)) MG.armas.push(idx);
      MG.jefe = null;
      hablar(VOZ.gane);
      pasarNivel('mega', iniciarMega, 'finMega', VOZ.ganaste);
      return;
    }
  }
  for(const b of MG.balasJ){
    b.x += b.vx;
    if (MG.inv<=0 && Math.abs(b.x-MG.x)<20 && Math.abs(b.y-(MG.y-24))<30){
      b.fuera = true; MG.inv = 80;
      susto(MG, '¡Ay! Vidas infinitas: sigue disparando');
    }
  }
  MG.balasJ = MG.balasJ.filter(b=>!b.fuera && Math.abs(b.x-MG.x) < W);
  rescatar(MG.amigo, MG.x, MG.y-18, 34);
  /* cámara */
  const obj = Math.max(0, Math.min(MG.largo+400-W, MG.x - W*0.38));
  MG.camX += (obj - MG.camX) * 0.14;
}
function drawMega(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#12083a'); g.addColorStop(1,'#3a1a5a');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<40;i++){
    ctx.fillStyle='rgba(255,255,255,'+(0.15+Math.sin(T/24+i)*0.12)+')';
    ctx.fillRect(((i*173 - MG.camX*0.2)%W+W)%W, (i*97)%400, 2, 2);
  }
  ctx.save(); ctx.translate(-MG.camX, 0);
  /* suelo metálico */
  rect(-40, MGS, MG.largo+500, H-MGS, '#2a2a52');
  for(let x=-40; x<MG.largo+500; x+=40) rect(x, MGS, 36, 8, '#5a5a9a');
  for(const p of MG.plats){
    rect(p.x, p.y, p.w, 14, '#4a4a86');
    rect(p.x, p.y, p.w, 5, '#8a8ad0');
  }
  dibRescate(MG.amigo);
  for(const e of MG.enem){
    if (e.muerto) continue;
    if (e.hielo>0){ ctx.globalAlpha = 0.75; }
    if (e.tipo==='koopa') dibKoopa(e.x-13, e.y-38, {caparazon:false}, T);
    else dibGoomba(e.x-13, e.y-24, T);
    if (e.hielo>0){
      ctx.globalAlpha = 0.45; rect(e.x-16, e.y-40, 32, 42, '#8ecbff'); ctx.globalAlpha = 1;
    }
    ctx.globalAlpha = 1;
  }
  for(const b of MG.balas){
    ctx.fillStyle = b.a.color;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI*2); ctx.fill();
    if (b.grande){ ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke(); }
  }
  for(const b of MG.balasJ){
    ctx.fillStyle = b.color;
    ctx.beginPath(); ctx.arc(b.x, b.y, 8, 0, Math.PI*2); ctx.fill();
  }
  if (MG.jefe){
    const j = MG.jefe;
    if (!(j.golpe>0 && (T>>1)%2)) dibBowser(j.x, j.y, T, 0);
    rect(j.x-6, j.y-26, 76, 10, '#3a0a0a');
    rect(j.x-6, j.y-26, 76*Math.max(0,j.vida)/j.max, 10, '#e03434');
    texto('BOWSER '+j.arma.nombre, j.x+32, j.y-34, 13, j.arma.color, true);
  }
  /* Fernando */
  sombra(MG.x, MG.y+2, 15);
  if (!(MG.inv>0 && (MG.t>>2)%2)){
    ctx.save(); ctx.translate(MG.x, MG.y);
    if (MG.cara<0) ctx.scale(-1,1);
    ctx.translate(-12, -40); dibFernandoSolo();
    rect(20, 16, 16, 5, '#3a3a44');
    ctx.restore();
    if (MG.carga > 18){
      const c = armaMG();
      ctx.globalAlpha = 0.4 + Math.sin(T/3)*0.3;
      ctx.fillStyle = MG.carga>42 ? '#fff' : c.color;
      ctx.beginPath(); ctx.arc(MG.x+18*MG.cara, MG.y-26, 6+MG.carga*0.22, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
  const a = armaMG();
  hudMJ('🤖 MEGA', etiquetaNivel('mega')+'  '+a.nombre+'  '+corazonesInf(MG), 'B dispara · ▲ arma');
  /* armas conseguidas */
  MG.armas.forEach((ia,i)=>{
    const sel = i === MG.arma % MG.armas.length;
    ctx.fillStyle = sel ? ARMAS[ia].color : 'rgba(255,255,255,0.25)';
    ctx.beginPath(); ctx.arc(28+i*26, H-24, sel?11:8, 0, Math.PI*2); ctx.fill();
  });
  barraPoder(MG.carga>42 ? '💥 ¡DISPARO CARGADO!' : (MG.carga>0 ? '🔋 cargando...' : '🔫 '+a.nombre+' (mantén B)'),
             MG.carga/42, MG.carga>42);
}

/* ============================================================
   15) FERNANDO BURGER  (estilo BurgerTime)
   ============================================================ */
const BU = { x:0, y:0, piso:0, trozos:[], enem:[], pimienta:0, t:0, sustos:0, inv:0,
             pimPrev:false, escaleras:[], pisos:[], amigo:null, faltan:0 };
const BUPISOS = [456, 372, 288, 204, 120], BUCOL = [170, 370, 570, 770], BUANCHO = 132;
function iniciarBurger(){
  const N = nivelDe('burger');
  BU.pisos = BUPISOS;
  BU.x = BUCOL[0]; BU.y = BUPISOS[0]; BU.piso = 0;
  BU.t = 0; BU.sustos = 0; BU.inv = 0; BU.pimPrev = false;
  BU.pimienta = 3 + Math.max(0, 3-Math.floor(N/2));
  /* escaleras: una por columna y una entre columnas */
  BU.escaleras = [];
  for(const cx of BUCOL) BU.escaleras.push(cx);
  BU.escaleras.push(270, 470, 670);
  /* cada columna es una hamburguesa de cuatro trozos en pisos distintos */
  const capas = ['pan','lechuga','carne','pan2'];
  BU.trozos = [];
  BUCOL.forEach((cx,ci)=>{
    capas.forEach((tipo,k)=>{
      BU.trozos.push({cx, tipo, piso: 4-k, pisadas:[false,false,false,false], cae:0, y:BUPISOS[4-k], listo:false});
    });
  });
  BU.faltan = BU.trozos.length;
  BU.enem = [];
  for(let i=0;i<2+Math.min(3,N);i++)
    BU.enem.push({x: 300+i*160, piso: 3 - (i%3), y: BUPISOS[3-(i%3)], vx:(i%2?1:-1)*(1+N*0.13),
                  aturdido:0, subiendo:0, tipo: ['huevo','salchicha','pepino'][i%3]});
  BU.amigo = nuevoRescate('burger', 60, BUPISOS[2]-44);
  aviso('¡Camina por encima de los ingredientes para tirarlos al plato! B echa pimienta', 4.4);
}
const buEnEscalera = x => BU.escaleras.some(e=>Math.abs(x-e) < 16);
function updateBurger(){
  BU.t++;
  const N = nivelDe('burger');
  if (BU.inv>0) BU.inv--;
  /* subir y bajar por las escaleras */
  if ((mArr()||mAbj()) && buEnEscalera(BU.x)){
    const dir = mArr() ? 1 : -1;
    const destino = BU.piso + dir;
    if (destino >= 0 && destino < BUPISOS.length){
      BU.y += -dir*2.6;
      const yObj = BUPISOS[destino];
      if ((dir>0 && BU.y <= yObj) || (dir<0 && BU.y >= yObj)){ BU.y = yObj; BU.piso = destino; }
    }
  } else {
    if (mIzq()) BU.x -= 3;
    if (mDer()) BU.x += 3;
    BU.x = Math.max(30, Math.min(W-30, BU.x));
    BU.y = BUPISOS[BU.piso];
  }
  /* pisar los trozos */
  for(const tr of BU.trozos){
    if (tr.listo || tr.cae>0) continue;
    if (tr.piso !== BU.piso) continue;
    const izq = tr.cx - BUANCHO/2;
    if (BU.x > izq-6 && BU.x < izq+BUANCHO+6){
      const seg = Math.max(0, Math.min(3, Math.floor((BU.x-izq)/(BUANCHO/4))));
      if (!tr.pisadas[seg]){
        tr.pisadas[seg] = true; sumar(40); sfx.moneda();
        if (tr.pisadas.every(Boolean)) tirarTrozo(tr);
      }
    }
  }
  /* trozos cayendo */
  for(const tr of BU.trozos){
    if (tr.cae<=0) continue;
    tr.y += 5.5;
    for(const e of BU.enem){
      if (!e.aplastado && Math.abs(e.x-tr.cx)<BUANCHO/2 && Math.abs(e.y-tr.y)<26){
        e.aplastado = 90; sumar(500); sfx.pisoton();
      }
    }
    const yDest = BUPISOS[tr.piso-1] !== undefined ? BUPISOS[tr.piso-1] : BUPISOS[0]+34;
    if (tr.y >= yDest){
      tr.y = yDest; tr.piso--; tr.cae = 0;
      tr.pisadas = [false,false,false,false];
      if (tr.piso <= 0){
        tr.listo = true; tr.y = BUPISOS[0]+30 - contarPlato(tr.cx)*13;
        BU.faltan--; sumar(600); sfx.meta();
      } else {
        /* si cae encima de otro trozo, ese también se va abajo */
        const abajo = BU.trozos.find(o=>o!==tr && o.cx===tr.cx && o.piso===tr.piso && !o.listo);
        if (abajo) tirarTrozo(abajo);
      }
    }
  }
  /* pimienta */
  if (mAccion() && !BU.pimPrev && BU.pimienta>0){
    BU.pimienta--; sfx.pedo(); nubePedo(BU.x, BU.y-20, 10);
    aviso('🌶️ ¡PIMIENTA!', 1.4);
    for(const e of BU.enem) if (Math.abs(e.x-BU.x)<130 && e.piso===BU.piso) e.aturdido = 150;
  }
  BU.pimPrev = mAccion();
  /* enemigos */
  for(const e of BU.enem){
    if (e.aplastado){ if(--e.aplastado<=0){ e.x = 300+Math.random()*400; e.piso = 3; e.y = BUPISOS[3]; } continue; }
    if (e.aturdido>0){ e.aturdido--; continue; }
    const vel = Math.abs(e.vx);
    /* de vez en cuando cambia de piso por una escalera */
    if (e.subiendo){
      e.y += e.subiendo*2;
      const yObj = BUPISOS[e.pisoDest];
      if ((e.subiendo<0 && e.y<=yObj) || (e.subiendo>0 && e.y>=yObj)){
        e.y = yObj; e.piso = e.pisoDest; e.subiendo = 0;
      }
    } else {
      e.x += e.vx;
      if (e.x < 30 || e.x > W-30) e.vx *= -1;
      e.y = BUPISOS[e.piso];
      if (BU.t % 40 === 0 && buEnEscalera(e.x)){
        const quiere = BU.piso > e.piso ? 1 : (BU.piso < e.piso ? -1 : 0);
        if (quiere){
          e.pisoDest = e.piso + quiere;
          e.subiendo = -quiere*1;      /* subir un piso es restar y */
          e.x = BU.escaleras.reduce((a,b)=>Math.abs(b-e.x)<Math.abs(a-e.x)?b:a, BU.escaleras[0]);
        }
      }
    }
    if (BU.inv<=0 && Math.abs(e.x-BU.x)<22 && Math.abs(e.y-BU.y)<26){
      BU.inv = 110; BU.x = BUCOL[0]; BU.y = BUPISOS[0]; BU.piso = 0;
      susto(BU, '¡Te pilló! Vidas infinitas: vuelves abajo');
    }
  }
  rescatar(BU.amigo, BU.x, BU.y-20, 32);
  if (BU.faltan <= 0) pasarNivel('burger', iniciarBurger, 'finBurger', VOZ.pichungazo);
}
function tirarTrozo(tr){ tr.cae = 1; sfx.romper(); sacudir(2); }
function contarPlato(cx){ return BU.trozos.filter(t=>t.listo && t.cx===cx).length; }
function drawBurger(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#2a1a3a'); g.addColorStop(1,'#12060f');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  /* escaleras */
  for(const ex of BU.escaleras){
    ctx.strokeStyle='#8ecbff'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(ex-11, BUPISOS[4]); ctx.lineTo(ex-11, BUPISOS[0]);
    ctx.moveTo(ex+11, BUPISOS[4]); ctx.lineTo(ex+11, BUPISOS[0]); ctx.stroke();
    for(let y=BUPISOS[4]; y<BUPISOS[0]; y+=15){
      ctx.beginPath(); ctx.moveTo(ex-11,y); ctx.lineTo(ex+11,y); ctx.stroke();
    }
  }
  /* pisos */
  for(const y of BUPISOS){ rect(20, y+2, W-40, 7, '#c8a860'); rect(20, y+2, W-40, 3, '#f0d890'); }
  /* platos */
  for(const cx of BUCOL){ rect(cx-BUANCHO/2-8, BUPISOS[0]+34, BUANCHO+16, 9, '#d8d8e8'); }
  dibRescate(BU.amigo);
  /* trozos de hamburguesa */
  for(const tr of BU.trozos){
    const izq = tr.cx - BUANCHO/2;
    const col = tr.tipo==='lechuga' ? '#4ac83a' : tr.tipo==='carne' ? '#8a4a20' : '#e0a850';
    for(let s=0;s<4;s++){
      const sx = izq + s*(BUANCHO/4);
      const baja = (tr.pisadas[s] && tr.cae<=0 && !tr.listo) ? 5 : 0;
      rect(sx+1, tr.y-12+baja, BUANCHO/4-2, 12, col);
      rect(sx+1, tr.y-12+baja, BUANCHO/4-2, 4, 'rgba(255,255,255,0.3)');
      if (tr.tipo==='pan') rect(sx+4, tr.y-15+baja, 4, 3, '#f4e0b0');
    }
  }
  /* enemigos */
  for(const e of BU.enem){
    if (e.aplastado) continue;
    const col = e.tipo==='huevo' ? '#f4f0e2' : e.tipo==='salchicha' ? '#d05a3a' : '#4ac83a';
    ctx.fillStyle = e.aturdido>0 ? '#8ecbff' : col;
    ctx.beginPath(); ctx.ellipse(e.x, e.y-14, 15, 13, 0, 0, Math.PI*2); ctx.fill();
    rect(e.x-8, e.y-18, 5, 5, '#fff'); rect(e.x+3, e.y-18, 5, 5, '#fff');
    rect(e.x-7+ (e.vx>0?2:-2), e.y-17, 3, 3, '#222'); rect(e.x+4+ (e.vx>0?2:-2), e.y-17, 3, 3, '#222');
    if (e.aturdido>0) texto('💫', e.x, e.y-30, 16, '#fff', true);
  }
  /* Fernando cocinero */
  if (!(BU.inv>0 && (BU.t>>2)%2)){
    ctx.save(); ctx.translate(BU.x-12, BU.y-40); dibFernandoSolo();
    rect(2, -8, 20, 8, '#fff');           /* gorro de cocinero */
    ctx.restore();
  }
  hudMJ('🍔 BURGER', etiquetaNivel('burger')+'  FALTAN '+BU.faltan+'  '+corazonesInf(BU), '↑↓ escaleras · B pimienta');
  barraPoder('🌶️ PIMIENTA x'+BU.pimienta+' (B)', BU.pimienta/6, BU.pimienta>0);
}

/* ============================================================
   16) FERNANDO SUPERVIVIENTE  (arena, el arma dispara sola)
   ============================================================ */
const SU = { x:0, y:0, enem:[], balas:[], gemas:[], nivelXp:1, xp:0, xpMeta:0, t:0, seg:0, meta:0,
             sustos:0, inv:0, cd:0, mejoras:{}, eligiendo:false, ops:[], sel:0, selPrev:null,
             amigo:null, orbT:0 };
const MEJORAS = [
  {id:'tiros',  nombre:'MÁS PICHUNGAZOS', desc:'Un disparo más a la vez'},
  {id:'rapido', nombre:'ZAPATOS VELOCES',  desc:'Fernando corre más'},
  {id:'cadencia',nombre:'DISPARO RÁPIDO',  desc:'Dispara más seguido'},
  {id:'perros', nombre:'PENNY Y SHELDON',  desc:'Giran a tu alrededor y muerden'},
  {id:'pedo',   nombre:'AURA DE TÍO FRAN', desc:'Nube que daña alrededor'},
  {id:'iman',   nombre:'IMÁN DE ABU',      desc:'Las estrellitas vienen solas'},
  {id:'fuerza', nombre:'PICHUNGAZO FUERTE',desc:'Cada disparo hace más daño'},
];
function iniciarSuper(){
  const N = nivelDe('survivor');
  SU.x = W/2; SU.y = H/2; SU.enem = []; SU.balas = []; SU.gemas = [];
  SU.nivelXp = 1; SU.xp = 0; SU.xpMeta = 6; SU.t = 0; SU.seg = 0;
  SU.meta = 45 + N*12; SU.sustos = 0; SU.inv = 0; SU.cd = 0;
  SU.mejoras = {tiros:1, rapido:0, cadencia:0, perros:0, pedo:0, iman:0, fuerza:0};
  SU.eligiendo = false; SU.ops = []; SU.sel = 0; SU.selPrev = null; SU.orbT = 0;
  SU.amigo = nuevoRescate('survivor', W*0.7, H*0.3);
  aviso('¡Solo muévete, el pichungazo dispara solo! Sube de nivel y elige poderes', 4.2);
}
function updateSuper(){
  const N = nivelDe('survivor');
  /* menú de mejoras: el juego se detiene */
  if (SU.eligiendo){
    const dir = mIzq() ? 'i' : mDer() ? 'd' : null;
    if (dir && dir !== SU.selPrev){
      SU.sel = (SU.sel + (dir==='i'?SU.ops.length-1:1)) % SU.ops.length;
      sfx.moneda();
    }
    SU.selPrev = dir;
    if (mSalta() || mAccion()){
      const m = SU.ops[SU.sel];
      SU.mejoras[m.id] = (SU.mejoras[m.id]||0) + 1;
      SU.eligiendo = false; sfx.poder();
      aviso('⭐ '+m.nombre, 2);
      hablar(VOZ.campeon);
    }
    return;
  }
  SU.t++;
  if (SU.t % 60 === 0) SU.seg++;
  if (SU.inv>0) SU.inv--;
  SU.orbT += 0.06;
  const vel = 3.1 + SU.mejoras.rapido*0.7;
  if (mIzq()) SU.x -= vel; if (mDer()) SU.x += vel;
  if (mArr()) SU.y -= vel; if (mAbj()) SU.y += vel;
  SU.x = Math.max(24, Math.min(W-24, SU.x));
  SU.y = Math.max(64, Math.min(H-24, SU.y));
  /* van saliendo goombas por los bordes */
  if (SU.t % Math.max(14, 46 - N*3 - SU.seg*0.3 | 0) === 0){
    const lado = (Math.random()*4)|0;
    const p = lado===0 ? {x:-20, y:Math.random()*H} : lado===1 ? {x:W+20, y:Math.random()*H}
            : lado===2 ? {x:Math.random()*W, y:50} : {x:Math.random()*W, y:H+20};
    SU.enem.push({x:p.x, y:p.y, vida:1+Math.floor(N/2)+Math.floor(SU.seg/25), vel:0.9+N*0.08});
  }
  /* el arma dispara sola al más cercano */
  if (SU.cd>0) SU.cd--;
  if (SU.cd<=0 && SU.enem.length){
    SU.cd = Math.max(10, 30 - SU.mejoras.cadencia*5);
    const orden = SU.enem.slice().sort((a,b)=>
      Math.hypot(a.x-SU.x,a.y-SU.y) - Math.hypot(b.x-SU.x,b.y-SU.y));
    for(let k=0;k<SU.mejoras.tiros && k<orden.length;k++){
      const e = orden[k], d = Math.hypot(e.x-SU.x, e.y-SU.y) || 1;
      SU.balas.push({x:SU.x, y:SU.y, vx:(e.x-SU.x)/d*8, vy:(e.y-SU.y)/d*8,
                     dano:1+SU.mejoras.fuerza, t:80});
    }
    sfx.fuego();
  }
  for(const b of SU.balas){ b.x += b.vx; b.y += b.vy; b.t--; }
  SU.balas = SU.balas.filter(b=>b.t>0 && !b.fuera);
  /* enemigos */
  for(const e of SU.enem){
    const d = Math.hypot(SU.x-e.x, SU.y-e.y) || 1;
    e.x += (SU.x-e.x)/d*e.vel; e.y += (SU.y-e.y)/d*e.vel;
    for(const b of SU.balas){
      if (b.fuera) continue;
      if (Math.hypot(b.x-e.x, b.y-e.y) < 20){ e.vida -= b.dano; b.fuera = true; }
    }
    /* los perritos que orbitan */
    if (SU.mejoras.perros) for(let k=0;k<2;k++){
      const a = SU.orbT + k*Math.PI, px = SU.x+Math.cos(a)*70, py = SU.y+Math.sin(a)*70;
      if (Math.hypot(px-e.x, py-e.y) < 26) e.vida -= 0.09*SU.mejoras.perros;
    }
    /* el aura de pedo */
    if (SU.mejoras.pedo && Math.hypot(SU.x-e.x, SU.y-e.y) < 70+SU.mejoras.pedo*18)
      e.vida -= 0.045*SU.mejoras.pedo;
    if (e.vida<=0 && !e.muerto){
      e.muerto = true; sumar(120); sfx.pisoton();
      SU.gemas.push({x:e.x, y:e.y});
    }
    if (!e.muerto && SU.inv<=0 && Math.hypot(SU.x-e.x, SU.y-e.y) < 24){
      SU.inv = 80; susto(SU, '¡Ay! Vidas infinitas: sigue');
    }
  }
  SU.enem = SU.enem.filter(e=>!e.muerto);
  /* estrellitas de experiencia */
  for(const gm of SU.gemas){
    const d = Math.hypot(SU.x-gm.x, SU.y-gm.y) || 1;
    const alcance = 46 + SU.mejoras.iman*70;
    if (d < alcance){ gm.x += (SU.x-gm.x)/d*4.5; gm.y += (SU.y-gm.y)/d*4.5; }
    if (d < 20){
      gm.usada = true; SU.xp++; sfx.moneda();
      if (SU.xp >= SU.xpMeta){
        SU.xp = 0; SU.nivelXp++; SU.xpMeta = Math.round(SU.xpMeta*1.45)+2;
        const baraja = MEJORAS.slice().sort(()=>Math.random()-0.5);
        SU.ops = baraja.slice(0,3); SU.sel = 0; SU.selPrev = null;
        SU.eligiendo = true; sfx.heroe();
      }
    }
  }
  SU.gemas = SU.gemas.filter(gm=>!gm.usada);
  rescatar(SU.amigo, SU.x, SU.y-12, 34);
  if (SU.seg >= SU.meta) pasarNivel('survivor', iniciarSuper, 'finSuper', VOZ.gane);
}
function drawSuper(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#123a1a'); g.addColorStop(1,'#0a2410');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let y=60;y<H;y+=48) for(let x=0;x<W;x+=48)
    rect(x, y, 46, 46, ((x+y)/48)%2 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)');
  /* el aura de pedo */
  if (SU.mejoras.pedo){
    ctx.fillStyle='rgba(120,220,90,'+(0.09+Math.sin(T/8)*0.04)+')';
    ctx.beginPath(); ctx.arc(SU.x, SU.y, 70+SU.mejoras.pedo*18, 0, Math.PI*2); ctx.fill();
  }
  dibRescate(SU.amigo);
  for(const gm of SU.gemas){ texto('✦', gm.x, gm.y, 17, '#8ecbff', true); }
  for(const e of SU.enem) dibGoomba(e.x-13, e.y-12, T);
  for(const b of SU.balas){
    ctx.fillStyle='#ffe36e';
    ctx.beginPath(); ctx.arc(b.x, b.y, 6, 0, Math.PI*2); ctx.fill();
  }
  if (!(SU.inv>0 && (SU.t>>2)%2)){
    ctx.save(); ctx.translate(SU.x-12, SU.y-22); dibFernandoSolo(); ctx.restore();
  }
  if (SU.mejoras.perros) for(let k=0;k<2;k++){
    const a = SU.orbT + k*Math.PI;
    ctx.save(); ctx.translate(SU.x+Math.cos(a)*70-13, SU.y+Math.sin(a)*70-10);
    dibPerroSolo(k ? '#8a5a2a' : '#222'); ctx.restore();
  }
  /* barra de experiencia */
  rect(0, 46, W, 8, 'rgba(0,0,0,0.5)');
  rect(0, 46, W*Math.min(1, SU.xp/SU.xpMeta), 8, '#8ecbff');
  hudMJ('🧛 SÚPER', etiquetaNivel('survivor')+'  ⏱'+Math.max(0,SU.meta-SU.seg)+'s  NIV✦'+SU.nivelXp+'  '+corazonesInf(SU),
        'muévete y ya está');
  barraPoder('👾 '+SU.enem.length+' goombas · aguanta '+Math.max(0,SU.meta-SU.seg)+'s',
             1-Math.max(0,SU.meta-SU.seg)/SU.meta, SU.seg>=SU.meta);
  /* menú de mejoras */
  if (SU.eligiendo){
    ctx.fillStyle='rgba(0,0,0,0.72)'; ctx.fillRect(0,0,W,H);
    texto('⭐ ¡SUBISTE DE NIVEL! ELIGE UN PODER', W/2, 110, 30, '#ffe36e', true);
    SU.ops.forEach((m,i)=>{
      const x = 60 + i*300, y = 180, an = 260, al = 210;
      ctx.fillStyle = i===SU.sel ? '#2a5a9a' : '#1a2a4a';
      ctx.beginPath(); ctx.roundRect(x, y, an, al, 16); ctx.fill();
      ctx.strokeStyle = i===SU.sel ? '#ffe36e' : 'rgba(255,255,255,0.4)';
      ctx.lineWidth = i===SU.sel ? 6 : 3; ctx.stroke();
      texto(m.nombre, x+an/2, y+56, 17, '#fff', true);
      const pal = m.desc.split(' ');
      let ln = '', li = 0;
      ctx.font='bold 13px monospace';
      for(const p of pal){
        const pr = ln ? ln+' '+p : p;
        if (ctx.measureText(pr).width > an-30 && ln){ texto(ln, x+an/2, y+100+li*20, 13, '#cfe0ff', true); ln = p; li++; }
        else ln = pr;
      }
      if (ln) texto(ln, x+an/2, y+100+li*20, 13, '#cfe0ff', true);
      texto('x'+((SU.mejoras[m.id]||0)+1), x+an/2, y+180, 22, '#5ee08a', true);
    });
    texto('←→ para elegir · A para quedártelo', W/2, 450, 18, '#fff', true);
  }
}

/* ============================================================
   17) FERNANDO JEEP  (estilo Jackal: se ve desde arriba y se rescata gente)
   ============================================================ */
const JP = { x:0, y:0, avance:0, meta:0, balas:[], bombas:[], enem:[], muros:[], presos:[],
             t:0, sustos:0, inv:0, dispPrev:false, bombPrev:false, bombas0:0, rescatados:0, amigo:null };
const JPY = 430;
function iniciarJeep(){
  const N = nivelDe('jeep');
  JP.x = W/2; JP.y = JPY; JP.avance = 0; JP.meta = 2600 + N*520;
  JP.balas = []; JP.bombas = []; JP.enem = []; JP.muros = []; JP.presos = [];
  JP.t = 0; JP.sustos = 0; JP.inv = 0; JP.dispPrev = false; JP.bombPrev = false;
  JP.bombas0 = 3; JP.rescatados = 0;
  JP.amigo = nuevoRescate('jeep', 0, 0);
  JP.amigo.puesto = false;
  aviso('¡Sube por el camino! B dispara · A tira bombas · rescata a tus amigos', 4.2);
}
const velJeep = () => 3.2 + nivelDe('jeep')*0.32;
function updateJeep(){
  JP.t++;
  const N = nivelDe('jeep'), v = velJeep();
  if (JP.inv>0) JP.inv--;
  JP.avance += v;
  if (mIzq()) JP.x -= 4.2; if (mDer()) JP.x += 4.2;
  if (mArr()) JP.y -= 2.6; if (mAbj()) JP.y += 2.6;
  JP.x = Math.max(60, Math.min(W-60, JP.x));
  JP.y = Math.max(110, Math.min(H-50, JP.y));
  /* disparo hacia arriba */
  if (mAccion() && !JP.dispPrev){ JP.balas.push({x:JP.x, y:JP.y-24, vy:-9}); sfx.fuego(); }
  JP.dispPrev = mAccion();
  /* bomba: revienta todo lo que tenga delante */
  if (mSalta() && !JP.bombPrev && JP.bombas0>0){
    JP.bombas0--; JP.bombas.push({x:JP.x, y:JP.y-40, t:34});
    sfx.pedo(); sacudir(6); aviso('💣 ¡BOMBAZO!', 1.4);
  }
  JP.bombPrev = mSalta();
  for(const b of JP.balas) b.y += b.vy;
  JP.balas = JP.balas.filter(b=>b.y>60 && !b.fuera);
  for(const b of JP.bombas){
    b.t--;
    for(const e of JP.enem) if (!e.muerto && Math.hypot(e.x-b.x, e.y-b.y) < 150){
      e.muerto = true; sumar(200); sfx.pisoton();
    }
  }
  JP.bombas = JP.bombas.filter(b=>b.t>0);
  /* van apareciendo enemigos, muros y prisioneros por arriba */
  if (JP.t % Math.max(24, 54 - N*4) === 0)
    JP.enem.push({x: 80+Math.random()*(W-160), y:-40, vida:1+Math.floor(N/2),
                  vx:(Math.random()-0.5)*1.6, cd: 60+((Math.random()*80)|0)});
  if (JP.t % 150 === 40){
    const hueco = 120 + Math.random()*(W-360);
    JP.muros.push({y:-40, hueco, ancho:150});
  }
  if (JP.t % 220 === 90)
    JP.presos.push({x: 90+Math.random()*(W-180), y:-40, libre:false,
                    a: AMIGOS[((JP.t/220)|0 + nivelDe('jeep')) % AMIGOS.length]});
  /* el amigo del nivel aparece a mitad de camino */
  if (!JP.amigo.puesto && JP.avance >= JP.meta*0.55){
    JP.amigo.puesto = true;
    JP.presos.push({x: W/2, y:-40, libre:false, a: JP.amigo.a, esDelNivel:true});
  }
  for(const e of JP.enem){
    if (e.muerto) continue;
    e.y += v*0.55; e.x += e.vx;
    if (e.x < 60 || e.x > W-60) e.vx *= -1;
    if (--e.cd <= 0){ e.cd = 90 + ((Math.random()*60)|0);
      JP.balas.push({x:e.x, y:e.y+18, vy: 5.2, enemiga:true}); }
    for(const b of JP.balas){
      if (b.enemiga || b.fuera) continue;
      if (Math.abs(b.x-e.x)<22 && Math.abs(b.y-e.y)<24){
        b.fuera = true; e.vida--;
        if (e.vida<=0){ e.muerto = true; sumar(200); sfx.pisoton();
          for(let i=0;i<5;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y,
            vx:(Math.random()-0.5)*4, vy:-2-Math.random()*2, t:28}); }
      }
    }
    if (JP.inv<=0 && Math.abs(e.x-JP.x)<28 && Math.abs(e.y-JP.y)<28){
      JP.inv = 90; susto(JP, '¡Choque! Vidas infinitas: sigue');
    }
  }
  JP.enem = JP.enem.filter(e=>!e.muerto && e.y < H+60);
  /* balas enemigas */
  for(const b of JP.balas){
    if (!b.enemiga || b.fuera) continue;
    b.y += 0;                                   /* ya se mueve arriba */
    if (JP.inv<=0 && Math.abs(b.x-JP.x)<18 && Math.abs(b.y-JP.y)<22){
      b.fuera = true; JP.inv = 90; susto(JP, '¡Te dieron! Vidas infinitas: sigue');
    }
  }
  JP.balas = JP.balas.filter(b=>!b.fuera && b.y > -40 && b.y < H+40);
  /* muros: hay que colarse por el hueco */
  for(const m of JP.muros){
    m.y += v*0.85;
    if (JP.inv<=0 && Math.abs(m.y-JP.y)<22 && (JP.x < m.hueco || JP.x > m.hueco+m.ancho)){
      JP.inv = 90; JP.y += 40;
      susto(JP, '¡El muro! Vidas infinitas: busca el hueco');
    }
  }
  JP.muros = JP.muros.filter(m=>m.y < H+60);
  /* prisioneros que hay que recoger */
  for(const pr of JP.presos){
    pr.y += v*0.85;
    if (!pr.libre && Math.abs(pr.x-JP.x)<34 && Math.abs(pr.y-JP.y)<34){
      pr.libre = true; JP.rescatados++;
      sumar(pr.esDelNivel ? 1500 : 500); sfx.poder();
      hablar(pr.a.frase);
      aviso('🤗 ¡'+pr.a.nombre+' a bordo!', 2);
      if (pr.esDelNivel) JP.amigo.salvado = true;
    }
  }
  JP.presos = JP.presos.filter(pr=>!pr.libre && pr.y < H+60);
  if (JP.avance >= JP.meta) pasarNivel('jeep', iniciarJeep, 'finJeep', VOZ.pichungazo);
}
function drawJeep(){
  rect(0,0,W,H,'#3a6a2a');
  /* camino de tierra que sube */
  rect(120, 0, W-240, H, '#a8864a');
  ctx.fillStyle='rgba(255,255,255,0.16)';
  for(let i=0;i<12;i++){
    const y = ((i*70 + JP.avance) % (H+70)) - 40;
    ctx.fillRect(W/2-5, y, 10, 34);
  }
  for(let i=0;i<14;i++){
    const y = ((i*62 + JP.avance*0.9) % (H+62)) - 30;
    ctx.fillStyle='#2a5a1a';
    ctx.beginPath(); ctx.arc(60, y, 26, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(W-60, y+30, 26, 0, Math.PI*2); ctx.fill();
  }
  /* muros */
  for(const m of JP.muros){
    rect(120, m.y-12, m.hueco-120, 24, '#8a8a96');
    rect(m.hueco+m.ancho, m.y-12, W-120-(m.hueco+m.ancho), 24, '#8a8a96');
    rect(120, m.y-12, m.hueco-120, 6, '#c0c0cc');
    rect(m.hueco+m.ancho, m.y-12, W-120-(m.hueco+m.ancho), 6, '#c0c0cc');
  }
  /* prisioneros en su jaula */
  for(const pr of JP.presos){
    ctx.strokeStyle='#d8d8e8'; ctx.lineWidth=3;
    ctx.strokeRect(pr.x-22, pr.y-30, 44, 56);
    for(let k=-1;k<=1;k++){ ctx.beginPath(); ctx.moveTo(pr.x+k*11, pr.y-30); ctx.lineTo(pr.x+k*11, pr.y+26); ctx.stroke(); }
    pr.a.dib(pr.x-13, pr.y-26, T);
    letrero(pr.x, pr.y-40, pr.a.nombre, '#ffe36e');
  }
  /* enemigos */
  for(const e of JP.enem){
    sombra(e.x, e.y+16, 15);
    dibGoomba(e.x-13, e.y-12, T);
  }
  /* balas */
  for(const b of JP.balas){
    ctx.fillStyle = b.enemiga ? '#ff6a4a' : '#ffe36e';
    ctx.beginPath(); ctx.arc(b.x, b.y, 6, 0, Math.PI*2); ctx.fill();
  }
  /* bombazos */
  for(const b of JP.bombas){
    ctx.globalAlpha = Math.min(1, b.t/18);
    ctx.fillStyle = (T>>1)%2 ? '#ffb020' : '#ffe36e';
    ctx.beginPath(); ctx.arc(b.x, b.y, 150*(1-b.t/34), 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
  }
  /* el jeep con Fernando dentro */
  if (!(JP.inv>0 && (JP.t>>2)%2)){
    sombra(JP.x, JP.y+20, 24);
    rect(JP.x-24, JP.y-22, 48, 46, '#4a6a2a');
    rect(JP.x-24, JP.y-22, 48, 8, '#6a9a3a');
    rect(JP.x-30, JP.y-16, 8, 16, '#222'); rect(JP.x+22, JP.y-16, 8, 16, '#222');
    rect(JP.x-30, JP.y+6, 8, 16, '#222');  rect(JP.x+22, JP.y+6, 8, 16, '#222');
    rect(JP.x-4, JP.y-44, 8, 24, '#8a8a96');            /* el cañón */
    ctx.save(); ctx.translate(JP.x-12, JP.y-24); ctx.scale(0.8,0.8); dibFernandoSolo(); ctx.restore();
  }
  const frac = Math.min(1, JP.avance/JP.meta);
  rect(W-34, 70, 16, H-150, 'rgba(0,0,0,0.4)');
  rect(W-34, 70+(H-150)*(1-frac), 16, (H-150)*frac, '#5ee08a');
  hudMJ('🚙 JEEP', etiquetaNivel('jeep')+'  '+Math.round(frac*100)+'%  🤗'+JP.rescatados+'  '+corazonesInf(JP),
        'B dispara · A bomba');
  barraPoder('💣 BOMBAS x'+JP.bombas0+' (A)', JP.bombas0/3, JP.bombas0>0);
}

/* ============================================================
   18) FERNANDO MAPPY  (pisos, tirolinas y puertas que dan portazo)
   ============================================================ */
const MP = { x:0, y:0, piso:0, tubos:[], objetos:[], gatos:[], puertas:[], t:0, sustos:0, inv:0,
             subiendo:0, destino:0, puertaPrev:false, amigo:null, faltan:0 };
const MPPISOS = [462, 374, 286, 198, 110];
function iniciarMappy(){
  const N = nivelDe('mappy');
  MP.x = 70; MP.piso = 0; MP.y = MPPISOS[0]; MP.subiendo = 0; MP.t = 0;
  MP.sustos = 0; MP.inv = 0; MP.puertaPrev = false;
  /* tirolinas: columnas por las que se sube y se baja rebotando */
  MP.tubos = [250, 480, 710];
  /* puertas repartidas por los pisos */
  MP.puertas = [];
  for(let p=0;p<MPPISOS.length;p++)
    for(const x of [150, 360, 600, 830]) if ((p+x)%3 !== 0) MP.puertas.push({x, piso:p, abierta:0});
  /* objetos que hay que recoger */
  MP.objetos = [];
  for(let p=0;p<MPPISOS.length;p++)
    for(let k=0;k<3+Math.min(2,N);k++)
      MP.objetos.push({x: 100 + k*((W-200)/(2+Math.min(2,N))) + (p%2)*40, piso:p, tomado:false});
  MP.faltan = MP.objetos.length;
  MP.gatos = [];
  for(let i=0;i<2+Math.min(3,N);i++)
    MP.gatos.push({x: 400+i*130, piso: (i%MPPISOS.length), vx:(i%2?1:-1)*(1.3+N*0.15),
                   volando:0, aturdido:0});
  MP.amigo = nuevoRescate('mappy', W-120, MPPISOS[MPPISOS.length-1]-44);
  aviso('¡Recoge todo! Las tirolinas suben y bajan · B da un portazo a los gatos', 4.2);
}
const mpEnTubo = x => MP.tubos.some(t=>Math.abs(x-t) < 26);
function updateMappy(){
  MP.t++;
  const N = nivelDe('mappy');
  if (MP.inv>0) MP.inv--;
  if (MP.subiendo){
    MP.y += MP.subiendo*3.4;
    const yObj = MPPISOS[MP.destino];
    if ((MP.subiendo<0 && MP.y<=yObj) || (MP.subiendo>0 && MP.y>=yObj)){
      MP.y = yObj; MP.piso = MP.destino; MP.subiendo = 0;
    }
  } else {
    if (mIzq()) MP.x -= 3.4;
    if (mDer()) MP.x += 3.4;
    MP.x = Math.max(30, Math.min(W-30, MP.x));
    MP.y = MPPISOS[MP.piso];
    if (mpEnTubo(MP.x)){
      if (mArr() && MP.piso < MPPISOS.length-1){ MP.destino = MP.piso+1; MP.subiendo = -1; sfx.salto(); }
      else if (mAbj() && MP.piso > 0){ MP.destino = MP.piso-1; MP.subiendo = 1; sfx.salto(); }
    }
  }
  /* el portazo: empuja a los gatos del piso */
  if (mAccion() && !MP.puertaPrev){
    const pu = MP.puertas.find(p=>p.piso===MP.piso && Math.abs(p.x-MP.x)<38);
    if (pu){
      pu.abierta = 26; sfx.romper(); sacudir(4);
      aviso('🚪 ¡PORTAZO!', 1.4);
      for(const gt of MP.gatos){
        if (gt.piso===MP.piso && Math.abs(gt.x-pu.x) < 220 && !gt.volando){
          gt.volando = 46; gt.vvx = Math.sign(gt.x-pu.x)*9 || 9;
          sumar(400);
        }
      }
    }
  }
  MP.puertaPrev = mAccion();
  for(const p of MP.puertas) if (p.abierta>0) p.abierta--;
  /* objetos */
  for(const o of MP.objetos){
    if (o.tomado || o.piso!==MP.piso || MP.subiendo) continue;
    if (Math.abs(o.x-MP.x) < 24){
      o.tomado = true; MP.faltan--; sumar(250); sfx.moneda();
    }
  }
  /* gatos */
  for(const gt of MP.gatos){
    if (gt.volando){
      gt.volando--; gt.x += gt.vvx; gt.vvx *= 0.94;
      if (gt.x < 30 || gt.x > W-30){ gt.vvx *= -0.5; gt.x = Math.max(30, Math.min(W-30, gt.x)); }
      if (gt.volando<=0) gt.aturdido = 60;
      continue;
    }
    if (gt.aturdido>0){ gt.aturdido--; continue; }
    gt.x += gt.vx;
    if (gt.x < 30 || gt.x > W-30) gt.vx *= -1;
    /* de vez en cuando cambia de piso por una tirolina */
    if (MP.t % 70 === 0 && mpEnTubo(gt.x)){
      const quiere = MP.piso > gt.piso ? 1 : (MP.piso < gt.piso ? -1 : 0);
      if (quiere) gt.piso = Math.max(0, Math.min(MPPISOS.length-1, gt.piso+quiere));
    }
    if (MP.inv<=0 && !MP.subiendo && gt.piso===MP.piso && Math.abs(gt.x-MP.x)<24){
      MP.inv = 110; MP.x = 70; MP.piso = 0; MP.y = MPPISOS[0]; MP.subiendo = 0;
      susto(MP, '¡El gato! Vidas infinitas: vuelves abajo');
    }
  }
  rescatar(MP.amigo, MP.x, MP.y-20, 34);
  if (MP.faltan <= 0) pasarNivel('mappy', iniciarMappy, 'finMappy', VOZ.pichungazo);
}
function drawMappy(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#2a1a4a'); g.addColorStop(1,'#0e0620');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  /* tirolinas */
  for(const t of MP.tubos){
    rect(t-22, MPPISOS[MPPISOS.length-1]-20, 44, MPPISOS[0]-MPPISOS[MPPISOS.length-1]+30, 'rgba(140,200,255,0.14)');
    ctx.strokeStyle='#8ecbff'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(t-22, MPPISOS[MPPISOS.length-1]-20); ctx.lineTo(t-22, MPPISOS[0]+10);
    ctx.moveTo(t+22, MPPISOS[MPPISOS.length-1]-20); ctx.lineTo(t+22, MPPISOS[0]+10); ctx.stroke();
  }
  /* pisos */
  for(const y of MPPISOS){ rect(20, y+4, W-40, 8, '#7a4a9a'); rect(20, y+4, W-40, 3, '#b07ad0'); }
  /* puertas */
  for(const p of MP.puertas){
    const y = MPPISOS[p.piso];
    const an = p.abierta>0 ? 8 : 26;
    rect(p.x-an/2, y-40, an, 40, p.abierta>0 ? '#ffe36e' : '#c8853a');
    rect(p.x-an/2, y-40, an, 5, 'rgba(255,255,255,0.3)');
    if (p.abierta<=0) rect(p.x+6, y-22, 4, 4, '#ffe36e');
  }
  /* objetos */
  for(const o of MP.objetos){
    if (o.tomado) continue;
    const y = MPPISOS[o.piso];
    ctx.save(); ctx.translate(o.x-11, y-26); ctx.scale(0.9,0.9); dibBurger(0,0); ctx.restore();
  }
  dibRescate(MP.amigo);
  /* gatos */
  for(const gt of MP.gatos){
    const y = MPPISOS[gt.piso];
    ctx.save(); ctx.translate(gt.x, y-16);
    if (gt.volando) ctx.rotate(MP.t*0.4);
    ctx.fillStyle = gt.aturdido>0 ? '#8ecbff' : '#f0a020';
    ctx.beginPath(); ctx.ellipse(0, 0, 17, 14, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-14,-9); ctx.lineTo(-8,-22); ctx.lineTo(-2,-10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(14,-9); ctx.lineTo(8,-22); ctx.lineTo(2,-10); ctx.fill();
    rect(-9,-5,6,6,'#fff'); rect(3,-5,6,6,'#fff');
    rect(-7,-3,3,3,'#222'); rect(5,-3,3,3,'#222');
    ctx.restore();
  }
  /* Fernando ratoncito */
  if (!(MP.inv>0 && (MP.t>>2)%2)){
    ctx.save(); ctx.translate(MP.x-12, MP.y-40); dibFernandoSolo(); ctx.restore();
  }
  hudMJ('🐭 MAPPY', etiquetaNivel('mappy')+'  FALTAN '+MP.faltan+'  '+corazonesInf(MP), '↑↓ tirolina · B puerta');
  const cerca = MP.puertas.some(p=>p.piso===MP.piso && Math.abs(p.x-MP.x)<38);
  barraPoder(cerca ? '🚪 ¡DA EL PORTAZO! (B)' : '🚪 acércate a una puerta', cerca?1:0.25, cerca);
}

/* ============================================================
   19) FERNANDO CIRCO  (estilo Circus Charlie, con dos actos)
   ============================================================ */
const CI = { x:0, y:0, vy:0, suelo:false, avance:0, meta:0, aros:[], globos:[], t:0,
             sustos:0, inv:0, saltoPrev:false, estrella:0, estrellaCd:0, estPrev:false,
             acto:0, vx:0, amigo:null, faltan:0 };
const CISUELO = 442, ESTRELLA_CI = 400;
/* Impulso del balancín. Tiene que dar de sobra para llegar a la fila de globos
   más alta: con gravedad 0.44 la altura que sube es v²/(2·0.44). Si se toca
   alguno de los dos números hay que comprobar que sigue alcanzando. */
const IMPULSO_CI = N => 16.4 + N*0.2;
const ALTO_CI = N => (CISUELO-40) - (IMPULSO_CI(N)*IMPULSO_CI(N))/(2*0.44);
function iniciarCirco(){
  const N = nivelDe('circo');
  CI.acto = (N-1) % 2;                     /* 0 = león y aros · 1 = balancín y globos */
  CI.x = 140; CI.y = CISUELO; CI.vy = 0; CI.vx = 0; CI.suelo = true;
  CI.t = 0; CI.sustos = 0; CI.inv = 0; CI.saltoPrev = false;
  CI.estrella = 0; CI.estrellaCd = 0; CI.estPrev = false;
  CI.aros = []; CI.globos = [];
  CI.amigo = nuevoRescate('circo', 0, 0);
  CI.amigo.puesto = false;
  if (CI.acto === 0){
    CI.avance = 0; CI.meta = 2400 + N*380;
    aviso('¡Salta los aros de fuego montado en el león! A salta · B estrella mágica', 4.2);
  } else {
    CI.faltan = 0;
    /* las tres filas van dentro del alcance del rebote (ver ALTO_CI abajo) */
    for(let f=0; f<3; f++)
      for(let k=0; k<8; k++)
        CI.globos.push({x: 90 + k*100, y: 132 + f*62, vivo:true, color:['#e03434','#ffe36e','#5ee08a','#8ecbff'][(f+k)%4]});
    CI.faltan = CI.globos.length;
    CI.y = CISUELO - 40; CI.vy = -12;
    aviso('¡Rebota en el balancín y revienta todos los globos! ←→ para moverte', 4.2);
  }
}
function updateCirco(){
  CI.t++;
  const N = nivelDe('circo');
  if (CI.inv>0) CI.inv--;
  if (CI.estrellaCd>0) CI.estrellaCd--;
  if (CI.estrella>0) CI.estrella--;
  if (mAccion() && !CI.estPrev && CI.estrellaCd<=0){
    CI.estrella = 260; CI.estrellaCd = ESTRELLA_CI; sfx.poder();
    aviso('⭐ ¡ESTRELLA MÁGICA! Nada te toca', 2);
    hablar(VOZ.ataque);
  }
  CI.estPrev = mAccion();

  if (CI.acto === 0){
    /* ---- acto del león: corre solo y hay que saltar ---- */
    const v = (5.2 + N*0.5) * (CI.estrella>0 ? 1.35 : 1);
    CI.avance += v;
    if (mIzq()) CI.x -= 2.6; if (mDer()) CI.x += 2.6;
    CI.x = Math.max(70, Math.min(W-220, CI.x));
    if (mSalta() && CI.suelo && !CI.saltoPrev){ CI.vy = -13.2; CI.suelo = false; sfx.salto(); }
    CI.saltoPrev = mSalta();
    CI.vy = Math.min(CI.vy+0.62, 15); CI.y += CI.vy;
    if (CI.y >= CISUELO){ CI.y = CISUELO; CI.vy = 0; CI.suelo = true; }
    if (CI.t % Math.max(48, 96 - N*7) === 0){
      const tipo = Math.random() < 0.35 ? 'mono' : 'aro';
      CI.aros.push({x: W+60, tipo, alto: tipo==='aro' ? (Math.random()<0.5 ? 90 : 130) : 0, pasado:false});
    }
    if (!CI.amigo.puesto && CI.avance >= CI.meta*0.5){
      CI.amigo.puesto = true;
      CI.aros.push({x: W+60, tipo:'amigo', alto:110, pasado:false});
    }
    for(const a of CI.aros){
      a.x -= v;
      if (a.pasado) continue;
      if (a.tipo==='amigo'){
        if (Math.abs(a.x-CI.x) < 40 && Math.abs((CISUELO-a.alto) - (CI.y-20)) < 60){
          a.pasado = true; CI.amigo.x = 0; CI.amigo.y = 0;
          rescatar(CI.amigo, 0, 0, 9999);
        }
        continue;
      }
      if (a.x < CI.x - 40){ a.pasado = true; sumar(180); continue; }
      if (CI.estrella>0) continue;
      if (Math.abs(a.x-CI.x) > 34) continue;
      if (a.tipo==='mono'){
        if (CI.y > CISUELO-40){ a.pasado = true; CI.inv = 80;
          susto(CI, '¡Un mono! Vidas infinitas: sigue'); }
      } else {
        /* hay que pasar POR DENTRO del aro */
        /* solo quema si pasa por DEBAJO del aro; por arriba se cuela sin más,
           que si no habría que clavar el salto al pixel */
        const centro = CISUELO - a.alto;
        if ((CI.y-20) - centro > 46 && CI.inv<=0){
          a.pasado = true; CI.inv = 80;
          susto(CI, '¡Te quemaste! Vidas infinitas: sigue');
        } else {
          a.pasado = true; sumar(400); sfx.moneda();
        }
      }
    }
    CI.aros = CI.aros.filter(a=>a.x > -80);
    if (CI.avance >= CI.meta) pasarNivel('circo', iniciarCirco, 'finCirco', VOZ.pichungazo);
  } else {
    /* ---- acto del balancín: rebota y revienta globos ---- */
    if (mIzq()) CI.vx -= 0.6; if (mDer()) CI.vx += 0.6;
    CI.vx *= 0.94; CI.vx = Math.max(-8, Math.min(8, CI.vx));
    CI.x += CI.vx;
    if (CI.x < 40){ CI.x = 40; CI.vx = Math.abs(CI.vx)*0.6; }
    if (CI.x > W-40){ CI.x = W-40; CI.vx = -Math.abs(CI.vx)*0.6; }
    CI.vy = Math.min(CI.vy+0.44, 14); CI.y += CI.vy;
    if (CI.y >= CISUELO-40){                    /* el balancín lo vuelve a lanzar */
      CI.y = CISUELO-40; CI.vy = -IMPULSO_CI(N);
      sfx.salto();
      for(let i=0;i<5;i++) parts.push({tipo:'polvo', x:CI.x, y:CI.y+24,
        vx:(Math.random()-0.5)*3, vy:1, t:16});
    }
    if (CI.y < 40){ CI.y = 40; CI.vy = Math.abs(CI.vy)*0.5; }
    for(const gl of CI.globos){
      if (!gl.vivo) continue;
      if (Math.abs(gl.x-CI.x) < 26 && Math.abs(gl.y-(CI.y-18)) < 26){
        gl.vivo = false; CI.faltan--; sumar(260); sfx.romper();
        for(let i=0;i<5;i++) parts.push({tipo:'estrellita', x:gl.x, y:gl.y,
          vx:(Math.random()-0.5)*4, vy:-1-Math.random()*2, t:26});
      }
    }
    if (!CI.amigo.puesto && CI.faltan <= CI.globos.length*0.45){
      CI.amigo.puesto = true;
      CI.amigo.x = W/2-13; CI.amigo.y = 250;
    }
    if (CI.amigo.puesto) rescatar(CI.amigo, CI.x, CI.y-18, 40);
    if (CI.faltan <= 0) pasarNivel('circo', iniciarCirco, 'finCirco', VOZ.pichungazo);
  }
}
function drawCirco(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#6a1a4a'); g.addColorStop(1,'#2a0a24');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  /* la carpa de rayas */
  for(let i=0;i<16;i++){
    ctx.fillStyle = i%2 ? 'rgba(255,255,255,0.10)' : 'rgba(255,80,80,0.16)';
    ctx.beginPath();
    ctx.moveTo(W/2, -40); ctx.lineTo(i*(W/16), 260); ctx.lineTo((i+1)*(W/16), 260);
    ctx.fill();
  }
  rect(0, CISUELO+18, W, H-CISUELO-18, '#a8663a');
  rect(0, CISUELO+18, W, 8, '#c8864a');
  if (CI.acto === 0){
    /* aros de fuego, monos y el amigo */
    for(const a of CI.aros){
      if (a.tipo==='mono'){
        ctx.fillStyle='#8a5a2a';
        ctx.beginPath(); ctx.arc(a.x, CISUELO-14, 16, 0, Math.PI*2); ctx.fill();
        rect(a.x-10, CISUELO-26, 6, 6, '#c89a6a'); rect(a.x+4, CISUELO-26, 6, 6, '#c89a6a');
        rect(a.x-6, CISUELO-18, 4, 4, '#222'); rect(a.x+2, CISUELO-18, 4, 4, '#222');
      } else if (a.tipo==='amigo'){
        CI.amigo.a.dib(a.x-13, CISUELO-a.alto-20, T);
        letrero(a.x, CISUELO-a.alto-34, CI.amigo.a.nombre, '#ffe36e');
      } else {
        const cy = CISUELO - a.alto;
        ctx.lineWidth = 9;
        ctx.strokeStyle = (T>>1)%2 ? '#ff8a20' : '#ffd020';
        ctx.beginPath(); ctx.arc(a.x, cy, 50, 0, Math.PI*2); ctx.stroke();
        ctx.lineWidth = 3; ctx.strokeStyle = '#fff6c0';
        ctx.beginPath(); ctx.arc(a.x, cy, 50, 0, Math.PI*2); ctx.stroke();
      }
    }
    /* el león con Fernando encima */
    if (!(CI.inv>0 && (CI.t>>2)%2)){
      sombra(CI.x, CISUELO+16, 26);
      ctx.save(); ctx.translate(CI.x, CI.y);
      if (CI.estrella>0){
        ctx.globalAlpha = 0.45+Math.sin(T/5)*0.25;
        ctx.fillStyle='#ffe36e';
        ctx.beginPath(); ctx.arc(0, -6, 44, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle='#e0a020';
      ctx.beginPath(); ctx.ellipse(0, -8, 34, 20, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(26, -20, 18, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#c07818';
      ctx.beginPath(); ctx.arc(26, -20, 24, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#e0a020';
      ctx.beginPath(); ctx.arc(26, -20, 16, 0, Math.PI*2); ctx.fill();
      rect(22, -24, 4, 4, '#222'); rect(31, -24, 4, 4, '#222');
      rect(-26, 8, 8, 14, '#c07818'); rect(10, 8, 8, 14, '#c07818');
      ctx.translate(-22, -52); ctx.scale(0.9,0.9); dibFernandoSolo();
      ctx.restore();
    }
    const frac = Math.min(1, CI.avance/CI.meta);
    rect(24, H-24, W-280, 12, 'rgba(0,0,0,0.4)');
    rect(24, H-24, (W-280)*frac, 12, '#5ee08a');
    hudMJ('🎪 CIRCO', etiquetaNivel('circo')+'  ACTO 1  '+Math.round(frac*100)+'%  '+corazonesInf(CI), 'A salta los aros');
  } else {
    /* globos y balancín */
    for(const gl of CI.globos){
      if (!gl.vivo) continue;
      ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(gl.x, gl.y+12); ctx.lineTo(gl.x, gl.y+26); ctx.stroke();
      ctx.fillStyle = gl.color;
      ctx.beginPath(); ctx.ellipse(gl.x, gl.y, 15, 18, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.45)';
      ctx.beginPath(); ctx.ellipse(gl.x-5, gl.y-6, 5, 6, -0.3, 0, Math.PI*2); ctx.fill();
    }
    if (CI.amigo.puesto) dibRescate(CI.amigo);
    /* el balancín */
    ctx.save(); ctx.translate(CI.x, CISUELO-8); ctx.rotate(Math.sin(CI.t/8)*0.05);
    rect(-46, 0, 92, 10, '#c8853a'); rect(-6, 8, 12, 14, '#8a5a2a');
    ctx.restore();
    if (!(CI.inv>0 && (CI.t>>2)%2)){
      ctx.save(); ctx.translate(CI.x, CI.y);
      if (CI.estrella>0){
        ctx.globalAlpha = 0.45+Math.sin(T/5)*0.25;
        ctx.fillStyle='#ffe36e';
        ctx.beginPath(); ctx.arc(0, -14, 36, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.rotate(CI.vx*0.04);
      ctx.translate(-12, -40); dibFernandoSolo();
      ctx.restore();
    }
    hudMJ('🎪 CIRCO', etiquetaNivel('circo')+'  ACTO 2  GLOBOS '+CI.faltan+'  '+corazonesInf(CI), '←→ para moverte');
  }
  barraPoder(CI.estrella>0 ? '⭐ ¡ESTRELLA MÁGICA!' : (CI.estrellaCd<=0 ? '⭐ ESTRELLA (B)' : '⭐ brillando...'),
             CI.estrella>0 ? 1 : 1-CI.estrellaCd/ESTRELLA_CI, CI.estrella>0);
}

/* ============================================================
   20) FERNANDO CAZAPATOS  (estilo Duck Hunt)
   ============================================================ */
const PA = { mira:{x:0,y:0}, patos:[], cazados:0, meta:0, balas:0, t:0, sustos:0,
             dispPrev:false, doble:0, dobleCd:0, doblePrev:false, amigo:null, risa:0, ronda:0 };
const PASUELO = 430, DOBLE_CD = 380;
function iniciarPatos(){
  const N = nivelDe('patos');
  PA.mira = {x:W/2, y:260}; PA.patos = []; PA.cazados = 0; PA.balas = 3;
  PA.t = 0; PA.sustos = 0; PA.dispPrev = false; PA.doble = 0; PA.dobleCd = 0;
  PA.doblePrev = false; PA.risa = 0; PA.ronda = 0;
  PA.meta = 6 + N*2;                                  /* de 8 a 18 patos */
  PA.amigo = nuevoRescate('patos', 0, 0);
  PA.amigo.puesto = false;
  aviso('¡Toca los pájaros para cazarlos! B dispara · A = escopeta doble', 4);
}
function sueltaPato(){
  const N = nivelDe('patos');
  const dcha = Math.random() < 0.5;
  PA.patos.push({x: dcha ? -40 : W+40, y: 120 + Math.random()*190,
                 vx: (dcha?1:-1)*(2.4 + N*0.5), vy: (Math.random()-0.5)*2.2,
                 vivo:true, t:0, cae:0});
  PA.balas = 3; PA.ronda++;
}
function dispararPatos(mx, my){
  if (PA.balas <= 0) return;
  PA.balas--; sfx.fuego(); sacudir(2);
  const radio = PA.doble > 0 ? 110 : 42;
  let dio = false;
  for(const p of PA.patos){
    if (!p.vivo || p.cae) continue;
    if (Math.hypot(p.x-mx, p.y-my) < radio){
      p.cae = 1; p.vy = 0; dio = true;
      PA.cazados++; sumar(500); sfx.pisoton();
      for(let i=0;i<7;i++) parts.push({tipo:'estrellita', x:p.x, y:p.y,
        vx:(Math.random()-0.5)*5, vy:-1-Math.random()*2, t:30});
    }
  }
  /* el globo del amigo: al tocarlo baja sano y salvo */
  if (PA.amigo.puesto && !PA.amigo.salvado &&
      Math.hypot(PA.amigo.x+13-mx, PA.amigo.y+18-my) < radio+16){
    rescatar(PA.amigo, PA.amigo.x+13, PA.amigo.y+18, 9999);
    dio = true;
  }
  if (!dio && PA.balas <= 0){ PA.risa = 110; sfx.dano(); susto(PA, '¡Se te escapó! Penny se ríe'); }
}
function updatePatos(){
  PA.t++;
  const N = nivelDe('patos');
  if (PA.doble > 0) PA.doble--;
  if (PA.dobleCd > 0) PA.dobleCd--;
  if (PA.risa > 0) PA.risa--;
  /* PODER: la escopeta doble agranda muchísimo el tiro */
  if (mSalta() && !PA.doblePrev && PA.dobleCd <= 0){
    PA.doble = 300; PA.dobleCd = DOBLE_CD; sfx.poder();
    aviso('🔫 ¡ESCOPETA DOBLE! Casi no hay que apuntar', 2);
  }
  PA.doblePrev = mSalta();
  /* apuntar: con el dedo directamente, o con las flechas */
  if (pt.abajo || pt.soltado){ PA.mira.x = pt.x; PA.mira.y = pt.y; }
  if (mIzq()) PA.mira.x -= 6; if (mDer()) PA.mira.x += 6;
  if (mArr()) PA.mira.y -= 6; if (mAbj()) PA.mira.y += 6;
  PA.mira.x = Math.max(10, Math.min(W-10, PA.mira.x));
  PA.mira.y = Math.max(60, Math.min(PASUELO-10, PA.mira.y));
  if (pt.soltado){ pt.soltado = false; dispararPatos(pt.x, pt.y); }
  if (mAccion() && !PA.dispPrev) dispararPatos(PA.mira.x, PA.mira.y);
  PA.dispPrev = mAccion();
  /* sueltan pájaros mientras queden por cazar */
  if (PA.patos.filter(p=>p.vivo && !p.cae).length === 0 &&
      PA.cazados + PA.patos.length < PA.meta + 3 && PA.t % 40 === 0) sueltaPato();
  for(const p of PA.patos){
    if (!p.vivo) continue;
    if (p.cae){ p.cae++; p.y += 5.5; if (p.y > PASUELO){ p.vivo = false; } continue; }
    p.t++;
    p.x += p.vx; p.y += p.vy;
    if (p.y < 90 || p.y > 330) p.vy *= -1;
    if (p.t % 70 === 0) p.vy = (Math.random()-0.5)*2.4;
    if (p.x < -70 || p.x > W+70){          /* se escapó */
      p.vivo = false; PA.risa = 110;
      susto(PA, '¡Voló! Vidas infinitas: viene otro');
    }
  }
  PA.patos = PA.patos.filter(p=>p.vivo);
  /* el amigo cruza en globo a mitad de la partida */
  if (!PA.amigo.puesto && PA.cazados >= Math.floor(PA.meta/2)){
    PA.amigo.puesto = true; PA.amigo.x = -60; PA.amigo.y = 120;
  }
  if (PA.amigo.puesto && !PA.amigo.salvado){
    PA.amigo.x += 1.5;
    if (PA.amigo.x > W+60){ PA.amigo.x = -60; PA.amigo.y = 100 + Math.random()*120; }
  }
  if (PA.cazados >= PA.meta) pasarNivel('patos', iniciarPatos, 'finPatos', VOZ.pichungazo);
}
function drawPatos(){
  const g = ctx.createLinearGradient(0,0,0,PASUELO);
  g.addColorStop(0,'#2a6ad0'); g.addColorStop(1,'#bfe8ff');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,PASUELO);
  for(let i=0;i<6;i++){
    ctx.fillStyle='rgba(255,255,255,0.8)';
    ctx.beginPath(); ctx.ellipse(120+i*180-((PA.t*0.2)%1200), 100+(i%3)*44, 48, 16, 0, 0, Math.PI*2); ctx.fill();
  }
  rect(0, PASUELO, W, H-PASUELO, '#2f8f22');
  rect(0, PASUELO, W, 8, '#3fae2f');
  for(let i=0;i<9;i++){                                  /* juncos */
    ctx.fillStyle='#1c6a18';
    ctx.beginPath(); ctx.moveTo(60+i*110, PASUELO+8);
    ctx.lineTo(66+i*110, PASUELO-38); ctx.lineTo(74+i*110, PASUELO+8); ctx.fill();
  }
  if (PA.amigo.puesto && !PA.amigo.salvado){
    dibGlobitos(PA.amigo.x+13, PA.amigo.y+34, 2, '#ff6ec0');
    dibRescate(PA.amigo);
  }
  for(const p of PA.patos){
    ctx.save(); ctx.translate(p.x, p.y);
    if (p.cae) ctx.rotate(Math.PI);
    else if (p.vx < 0) ctx.scale(-1,1);
    const al = p.cae ? -8 : Math.sin(PA.t/4)*10;
    ctx.fillStyle='#3a3a5a';
    ctx.beginPath(); ctx.ellipse(0, 0, 20, 12, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-4,-4); ctx.lineTo(6, -14+al); ctx.lineTo(12,-2); ctx.fill();
    ctx.fillStyle='#5a5a8a';
    ctx.beginPath(); ctx.arc(15, -6, 9, 0, Math.PI*2); ctx.fill();
    rect(20, -9, 9, 4, '#f0a020');
    rect(16, -9, 3, 3, '#fff');
    ctx.restore();
  }
  /* Penny abajo, riéndose si fallas */
  ctx.save(); ctx.translate(70, PASUELO-6 - (PA.risa>0 ? Math.abs(Math.sin(PA.t/4))*14 : 0));
  ctx.scale(1.5,1.5); ctx.translate(-13,-10); dibPerroSolo('#222'); ctx.restore();
  if (PA.risa > 0) texto('¡JA JA JA!', 78, PASUELO-56, 20, '#ffe36e', true);
  /* la mira */
  const r = PA.doble > 0 ? 110 : 42;
  ctx.strokeStyle = PA.doble>0 ? '#ffe36e' : '#fff'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(PA.mira.x, PA.mira.y, r*0.32, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(PA.mira.x-r*0.5, PA.mira.y); ctx.lineTo(PA.mira.x+r*0.5, PA.mira.y);
  ctx.moveTo(PA.mira.x, PA.mira.y-r*0.5); ctx.lineTo(PA.mira.x, PA.mira.y+r*0.5);
  ctx.stroke();
  for(let i=0;i<PA.balas;i++) texto('🔫', 26+i*26, H-16, 20, '#fff');
  hudMJ('🦆 PATOS', etiquetaNivel('patos')+'  '+PA.cazados+'/'+PA.meta+'  '+corazonesInf(PA), 'toca para disparar');
  barraPoder(PA.doble>0 ? '🔫 ¡ESCOPETA DOBLE!' : (PA.dobleCd<=0 ? '🔫 ESCOPETA DOBLE (A)' : '🔫 recargando...'),
             PA.doble>0 ? 1 : 1-PA.dobleCd/DOBLE_CD, PA.doble>0);
}

/* ============================================================
   21) FERNANDO ISLA  (estilo Adventure Island)
   ============================================================ */
const IS = { x:0, y:0, vy:0, suelo:false, avance:0, meta:0, energia:0, obs:[], frutas:[], hachas:[],
             tabla:0, t:0, sustos:0, inv:0, saltoPrev:false, tiraPrev:false, amigo:null };
const ISSUELO = 448;
function iniciarIsla(){
  const N = nivelDe('isla');
  IS.x = 120; IS.y = ISSUELO; IS.vy = 0; IS.suelo = true;
  IS.avance = 0; IS.meta = 3000 + N*600; IS.energia = 100;
  IS.obs = []; IS.frutas = []; IS.hachas = []; IS.tabla = 0;
  IS.t = 0; IS.sustos = 0; IS.inv = 0; IS.saltoPrev = false; IS.tiraPrev = false;
  IS.amigo = nuevoRescate('isla', 0, 0);
  IS.amigo.puesto = false;
  aviso('¡La energía baja sola! Come fruta · A salta · B lanza · 🛹 te hace correr', 4.4);
}
function updateIsla(){
  IS.t++;
  const N = nivelDe('isla');
  if (IS.inv>0) IS.inv--;
  /* la energía baja sola: hay que ir comiendo */
  if (IS.t % 14 === 0) IS.energia -= 1;
  if (IS.energia <= 0){
    IS.energia = 60; IS.inv = 90;
    susto(IS, '¡Sin energía! Vidas infinitas: come más fruta');
  }
  const v = (2.6 + N*0.18) * (IS.tabla>0 ? 2 : 1);
  if (mDer() || IS.tabla>0) IS.avance += v;
  else if (mIzq()) IS.avance = Math.max(0, IS.avance - v*0.7);
  if (IS.tabla>0) IS.tabla--;
  if (mSalta() && IS.suelo && !IS.saltoPrev){ IS.vy = -12.4; IS.suelo = false; sfx.salto(); }
  IS.saltoPrev = mSalta();
  IS.vy = Math.min(IS.vy+0.62, 15); IS.y += IS.vy;
  if (IS.y >= ISSUELO){ IS.y = ISSUELO; IS.vy = 0; IS.suelo = true; }
  /* lanzar el pichungazo */
  if (mAccion() && !IS.tiraPrev){
    IS.hachas.push({x: IS.x, y: IS.y-26, vx: 7, vy: -4});
    sfx.fuego();
  }
  IS.tiraPrev = mAccion();
  for(const h of IS.hachas){ h.vy += 0.3; h.x += h.vx - v; h.y += h.vy; }
  IS.hachas = IS.hachas.filter(h=>h.x < W+40 && h.y < H && !h.usada);
  /* van saliendo obstáculos, fruta y la tabla */
  if (IS.t % Math.max(30, 62 - N*4) === 0)
    IS.obs.push({x: W+40, tipo: Math.random()<0.4 ? 'fuego' : 'caracol', vivo:true});
  if (IS.t % 90 === 20) IS.frutas.push({x: W+40, y: ISSUELO - 40 - Math.random()*90, tipo:'fruta'});
  if (IS.t % 520 === 100) IS.frutas.push({x: W+40, y: ISSUELO-30, tipo:'tabla'});
  if (!IS.amigo.puesto && IS.avance >= IS.meta*0.55){
    IS.amigo.puesto = true; IS.amigo.x = W+40; IS.amigo.y = ISSUELO-44;
  }
  for(const o of IS.obs){
    o.x -= v;
    if (!o.vivo) continue;
    for(const h of IS.hachas){
      if (!h.usada && Math.abs(h.x-o.x)<22 && Math.abs(h.y-(ISSUELO-14))<28){
        h.usada = true; o.vivo = false; sumar(200); sfx.pisoton();
      }
    }
    if (IS.inv<=0 && o.vivo && Math.abs(o.x-IS.x)<22 && IS.y > ISSUELO-34){
      o.vivo = false; IS.inv = 80;
      if (IS.tabla>0){ IS.tabla = 0; aviso('¡Adiós monopatín!', 1.4); }
      else susto(IS, '¡Auch! Vidas infinitas: sigue');
    }
  }
  IS.obs = IS.obs.filter(o=>o.x > -50 && o.vivo);
  for(const f of IS.frutas){
    f.x -= v;
    if (f.usada) continue;
    if (Math.abs(f.x-IS.x)<28 && Math.abs(f.y-(IS.y-20))<34){
      f.usada = true; sfx.moneda();
      if (f.tipo==='tabla'){ IS.tabla = 420; sumar(400); aviso('🛹 ¡MONOPATÍN!', 1.8); }
      else { IS.energia = Math.min(100, IS.energia+18); sumar(120); }
    }
  }
  IS.frutas = IS.frutas.filter(f=>!f.usada && f.x > -40);
  if (IS.amigo.puesto && !IS.amigo.salvado){
    IS.amigo.x -= v;
    rescatar(IS.amigo, IS.x, IS.y-20, 36);
    if (IS.amigo.x < -60) IS.amigo.x = W+60;
  }
  if (IS.avance >= IS.meta) pasarNivel('isla', iniciarIsla, 'finIsla', VOZ.pichungazo);
}
function drawIsla(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#4aa0e8'); g.addColorStop(0.7,'#bfe8ff'); g.addColorStop(1,'#f0e0a0');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<7;i++){                                  /* palmeras de fondo */
    const px = ((i*180 - IS.avance*0.35) % (W+200) + (W+200)) % (W+200) - 100;
    rect(px, ISSUELO-90, 10, 90, '#8a5a2a');
    ctx.fillStyle='#2a8a3a';
    for(const a of [-1,-0.4,0.4,1]){
      ctx.beginPath(); ctx.ellipse(px+5+a*26, ISSUELO-92, 26, 9, a*0.5, 0, Math.PI*2); ctx.fill();
    }
  }
  rect(0, ISSUELO+14, W, H-ISSUELO, '#e8d090');
  rect(0, ISSUELO+14, W, 6, '#f6e6b0');
  for(const f of IS.frutas){
    if (f.tipo==='tabla'){ rect(f.x-20, f.y+8, 40, 8, '#e03434'); rect(f.x-14, f.y+16, 8, 8, '#222'); rect(f.x+6, f.y+16, 8, 8, '#222'); }
    else { ctx.fillStyle='#ff5a5a'; ctx.beginPath(); ctx.arc(f.x, f.y, 12, 0, Math.PI*2); ctx.fill();
           rect(f.x-2, f.y-18, 4, 8, '#2a8a3a'); }
  }
  for(const o of IS.obs){
    if (o.tipo==='fuego'){
      ctx.fillStyle = (IS.t>>1)%2 ? '#ff8a20' : '#ffd020';
      ctx.beginPath(); ctx.moveTo(o.x, ISSUELO-40); ctx.lineTo(o.x-14, ISSUELO+8); ctx.lineTo(o.x+14, ISSUELO+8); ctx.fill();
    } else {
      ctx.fillStyle='#c8a060';
      ctx.beginPath(); ctx.arc(o.x, ISSUELO-10, 15, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#8a5a2a';
      ctx.beginPath(); ctx.arc(o.x-4, ISSUELO-12, 9, 0, Math.PI*2); ctx.fill();
      rect(o.x+10, ISSUELO-22, 4, 10, '#c8a060');
    }
  }
  for(const h of IS.hachas){
    ctx.save(); ctx.translate(h.x, h.y); ctx.rotate(IS.t*0.4);
    texto('🪃', 0, 6, 20, '#fff', true);
    ctx.restore();
  }
  if (IS.amigo.puesto && !IS.amigo.salvado) dibRescate(IS.amigo);
  if (!(IS.inv>0 && (IS.t>>2)%2)){
    sombra(IS.x, ISSUELO+14, 16);
    ctx.save(); ctx.translate(IS.x-12, IS.y-40);
    dibFernandoSolo();
    rect(0, -6, 24, 6, '#2a8a3a');                       /* sombrerito de hojas */
    ctx.restore();
    if (IS.tabla>0){ rect(IS.x-22, IS.y+2, 44, 7, '#e03434');
      rect(IS.x-16, IS.y+9, 8, 8, '#222'); rect(IS.x+8, IS.y+9, 8, 8, '#222'); }
  }
  /* barra de energía */
  rect(24, H-30, 240, 16, 'rgba(0,0,0,0.45)');
  rect(24, H-30, 240*Math.max(0,IS.energia)/100, 16, IS.energia>30 ? '#5ee08a' : '#ff6a4a');
  texto('ENERGÍA', 26, H-36, 12, '#fff');
  const frac = Math.min(1, IS.avance/IS.meta);
  hudMJ('🏝️ ISLA', etiquetaNivel('isla')+'  '+Math.round(frac*100)+'%  '+corazonesInf(IS), 'A salta · B lanza');
  barraPoder(IS.tabla>0 ? '🛹 ¡MONOPATÍN!' : '🍎 come fruta o se acaba la energía',
             IS.tabla>0 ? IS.tabla/420 : IS.energia/100, IS.tabla>0);
}

/* ============================================================
   22) FERNANDO GALAXIA  (estilo Gradius, con su barra de mejoras)
   ============================================================ */
const MEJORAS_G = ['VELOCIDAD','MISIL','DOBLE','LÁSER','OPCIÓN','ESCUDO'];
const GX = { x:0, y:0, balas:[], enem:[], balasE:[], capsulas:[], t:0, sustos:0, inv:0,
             sel:0, tengo:{}, avance:0, meta:0, jefe:null, dispPrev:false, mejPrev:false,
             escudo:0, amigo:null };
function iniciarGalaxia(){
  const N = nivelDe('galaxia');
  GX.x = 140; GX.y = H/2; GX.balas = []; GX.enem = []; GX.balasE = []; GX.capsulas = [];
  GX.t = 0; GX.sustos = 0; GX.inv = 0; GX.sel = 0; GX.escudo = 0;
  GX.tengo = {VELOCIDAD:0, MISIL:0, DOBLE:0, 'LÁSER':0, 'OPCIÓN':0, ESCUDO:0};
  GX.avance = 0; GX.meta = 2400 + N*420; GX.jefe = null;
  GX.dispPrev = false; GX.mejPrev = false;
  GX.amigo = nuevoRescate('galaxia', 0, 0);
  GX.amigo.puesto = false;
  aviso('¡Recoge cápsulas y pulsa A para gastar la mejora marcada! B dispara', 4.4);
}
function usarMejoraGX(){
  const m = MEJORAS_G[GX.sel];
  if (GX.sel === 0 && GX.capsulas.gastadas === undefined) { /* nada */ }
  GX.tengo[m] = (GX.tengo[m]||0) + 1;
  GX.sel = 0;
  sfx.poder();
  aviso('⚡ ¡'+m+'!', 1.8);
  if (m === 'ESCUDO') GX.escudo = 600;
}
function updateGalaxia(){
  GX.t++;
  const N = nivelDe('galaxia');
  if (GX.inv>0) GX.inv--;
  if (GX.escudo>0) GX.escudo--;
  GX.avance += 2;
  const v = 3.2 + GX.tengo.VELOCIDAD*1.1;
  if (mIzq()) GX.x -= v; if (mDer()) GX.x += v;
  if (mArr()) GX.y -= v; if (mAbj()) GX.y += v;
  GX.x = Math.max(30, Math.min(W-160, GX.x));
  GX.y = Math.max(60, Math.min(H-30, GX.y));
  /* gastar la mejora marcada en la barra */
  if (mSalta() && !GX.mejPrev && GX.sel > 0) usarMejoraGX();
  GX.mejPrev = mSalta();
  /* disparo */
  if (mAccion() && !GX.dispPrev){
    const laser = GX.tengo['LÁSER'] > 0;
    GX.balas.push({x:GX.x+20, y:GX.y, vx: laser ? 18 : 11, laser});
    if (GX.tengo.DOBLE > 0) GX.balas.push({x:GX.x+20, y:GX.y, vx: 9, vy:-5});
    if (GX.tengo.MISIL > 0) GX.balas.push({x:GX.x+10, y:GX.y+10, vx: 7, vy:3, misil:true});
    if (GX.tengo['OPCIÓN'] > 0) GX.balas.push({x:GX.x-40, y:GX.y, vx: 11});
    sfx.fuego();
  }
  GX.dispPrev = mAccion();
  for(const b of GX.balas){
    b.x += b.vx; b.y += b.vy||0;
    if (b.misil && b.y < H-24) b.vy = Math.min((b.vy||0)+0.35, 6);
  }
  GX.balas = GX.balas.filter(b=>!b.fuera && b.x < W+40 && b.y > 0 && b.y < H);
  /* enemigos: los rojos sueltan cápsula */
  if (!GX.jefe && GX.t % Math.max(22, 52 - N*4) === 0 && GX.avance < GX.meta){
    const rojo = Math.random() < 0.3;
    GX.enem.push({x:W+30, y: 80 + Math.random()*(H-140), vida: 1+Math.floor(N/2), rojo,
                  vy:(Math.random()-0.5)*2, cd: 70+((Math.random()*70)|0)});
  }
  for(const e of GX.enem){
    if (e.muerto) continue;
    e.x -= 2.6 + N*0.2; e.y += e.vy;
    if (e.y < 70 || e.y > H-30) e.vy *= -1;
    if (--e.cd <= 0){ e.cd = 110; GX.balasE.push({x:e.x, y:e.y, vx:-5}); }
    for(const b of GX.balas){
      if (b.fuera) continue;
      if (Math.abs(b.x-e.x)<24 && Math.abs(b.y-e.y)<22){
        e.vida--; if (!b.laser) b.fuera = true;
        if (e.vida<=0){
          e.muerto = true; sumar(250); sfx.pisoton();
          if (e.rojo) GX.capsulas.push({x:e.x, y:e.y});
          for(let i=0;i<5;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y,
            vx:(Math.random()-0.5)*4, vy:(Math.random()-0.5)*4, t:26});
        }
      }
    }
    if (Math.abs(e.x-GX.x)<24 && Math.abs(e.y-GX.y)<22 && !e.muerto) golpeGX();
  }
  GX.enem = GX.enem.filter(e=>!e.muerto && e.x > -50);
  for(const b of GX.balasE){
    b.x += b.vx;
    if (Math.abs(b.x-GX.x)<18 && Math.abs(b.y-GX.y)<18 && !b.fuera){ b.fuera = true; golpeGX(); }
  }
  GX.balasE = GX.balasE.filter(b=>!b.fuera && b.x > -30);
  for(const c of GX.capsulas){
    c.x -= 2.2;
    if (Math.abs(c.x-GX.x)<28 && Math.abs(c.y-GX.y)<26 && !c.usada){
      c.usada = true; sfx.moneda(); sumar(150);
      GX.sel = (GX.sel % MEJORAS_G.length) + 1;
      if (GX.sel > MEJORAS_G.length) GX.sel = 1;
    }
  }
  GX.capsulas = GX.capsulas.filter(c=>!c.usada && c.x > -30);
  /* el amigo flota en una cápsula grande */
  if (!GX.amigo.puesto && GX.avance >= GX.meta*0.5){
    GX.amigo.puesto = true; GX.amigo.x = W+40; GX.amigo.y = 100 + Math.random()*260;
  }
  if (GX.amigo.puesto && !GX.amigo.salvado){
    GX.amigo.x -= 2.2;
    rescatar(GX.amigo, GX.x, GX.y, 40);
    if (GX.amigo.x < -60){ GX.amigo.x = W+60; GX.amigo.y = 100 + Math.random()*260; }
  }
  /* jefe final */
  if (!GX.jefe && GX.avance >= GX.meta && GX.enem.length === 0){
    GX.jefe = {x: W-170, y: H/2, vy: 2, vida: 20+N*5, max: 20+N*5, golpe:0, t:0};
    aviso('👑 ¡NAVE MADRE!', 2.4); sfx.heroe();
  }
  if (GX.jefe){
    const j = GX.jefe;
    j.t++; j.y += j.vy;
    if (j.y < 110 || j.y > H-110) j.vy *= -1;
    if (j.t % Math.max(24, 54 - N*4) === 0)
      for(const dy of [-4,0,4]) GX.balasE.push({x:j.x-40, y:j.y, vx:-5.4, vy:dy});
    for(const b of GX.balas){
      if (b.fuera) continue;
      if (Math.abs(b.x-j.x)<58 && Math.abs(b.y-j.y)<52){
        j.vida--; j.golpe = 6; if (!b.laser) b.fuera = true; sumar(60);
      }
    }
    if (j.golpe>0) j.golpe--;
    if (j.vida<=0) pasarNivel('galaxia', iniciarGalaxia, 'finGalaxia', VOZ.gane);
  }
  for(const b of GX.balasE) b.y += b.vy||0;
}
function golpeGX(){
  if (GX.inv>0) return;
  if (GX.escudo>0){ GX.escudo = 0; GX.inv = 60; sfx.romper(); aviso('🛡️ ¡El escudo aguantó!', 1.6); return; }
  GX.inv = 90;
  susto(GX, '¡Tocado! Vidas infinitas: sigue volando');
}
function drawGalaxia(){
  ctx.fillStyle='#05061e'; ctx.fillRect(0,0,W,H);
  for(let i=0;i<70;i++){
    const sx = ((i*137 - GX.avance*(1+(i%3))) % W + W) % W;
    ctx.fillStyle='rgba(255,255,255,'+(0.2+(i%4)*0.16)+')';
    ctx.fillRect(sx, (i*89)%H, 2, 2);
  }
  if (GX.amigo.puesto && !GX.amigo.salvado){
    ctx.strokeStyle='#8ecbff'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(GX.amigo.x+13, GX.amigo.y+18, 34, 0, Math.PI*2); ctx.stroke();
    dibRescate(GX.amigo);
  }
  for(const c of GX.capsulas){
    ctx.fillStyle = (GX.t>>2)%2 ? '#ffe36e' : '#ff8a20';
    ctx.beginPath(); ctx.roundRect(c.x-14, c.y-9, 28, 18, 8); ctx.fill();
    texto('P', c.x, c.y+5, 14, '#2a1a00', true);
  }
  for(const e of GX.enem){
    ctx.fillStyle = e.rojo ? '#e03434' : '#8a8ad0';
    ctx.beginPath(); ctx.moveTo(e.x-18, e.y); ctx.lineTo(e.x+14, e.y-13);
    ctx.lineTo(e.x+14, e.y+13); ctx.fill();
    rect(e.x-2, e.y-4, 9, 8, '#ffe36e');
  }
  for(const b of GX.balas){
    ctx.fillStyle = b.misil ? '#ff8a20' : b.laser ? '#8ecbff' : '#ffe36e';
    if (b.laser) ctx.fillRect(b.x-16, b.y-3, 34, 6);
    else { ctx.beginPath(); ctx.arc(b.x, b.y, b.misil?6:5, 0, Math.PI*2); ctx.fill(); }
  }
  for(const b of GX.balasE){
    ctx.fillStyle='#ff6a4a';
    ctx.beginPath(); ctx.arc(b.x, b.y, 6, 0, Math.PI*2); ctx.fill();
  }
  if (GX.jefe){
    const j = GX.jefe;
    if (!(j.golpe>0 && (GX.t>>1)%2)){
      ctx.fillStyle='#6a3a8a';
      ctx.beginPath(); ctx.ellipse(j.x, j.y, 58, 46, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#c86ad0';
      ctx.beginPath(); ctx.arc(j.x-20, j.y, 16, 0, Math.PI*2); ctx.fill();
      rect(j.x-8, j.y-30, 50, 12, '#3a1a4a');
      rect(j.x-8, j.y+18, 50, 12, '#3a1a4a');
    }
    rect(j.x-58, j.y-60, 116, 9, '#3a0a0a');
    rect(j.x-58, j.y-60, 116*Math.max(0,j.vida)/j.max, 9, '#e03434');
  }
  /* la nave de Fernando */
  if (!(GX.inv>0 && (GX.t>>2)%2)){
    if (GX.tengo['OPCIÓN'] > 0){
      ctx.fillStyle='#8ecbff';
      ctx.beginPath(); ctx.arc(GX.x-40, GX.y, 9, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle='#d8d8e8';
    ctx.beginPath(); ctx.moveTo(GX.x+24, GX.y); ctx.lineTo(GX.x-18, GX.y-14);
    ctx.lineTo(GX.x-10, GX.y); ctx.lineTo(GX.x-18, GX.y+14); ctx.fill();
    rect(GX.x-2, GX.y-5, 12, 10, '#3a6ad0');
    ctx.fillStyle=(GX.t>>1)%2 ? '#ffb020' : '#ffe36e';
    ctx.beginPath(); ctx.moveTo(GX.x-18, GX.y-6); ctx.lineTo(GX.x-34, GX.y); ctx.lineTo(GX.x-18, GX.y+6); ctx.fill();
    ctx.save(); ctx.translate(GX.x-8, GX.y-24); ctx.scale(0.6,0.6); dibFernandoSolo(); ctx.restore();
    if (GX.escudo>0){
      ctx.strokeStyle='rgba(140,200,255,'+(0.4+Math.sin(GX.t/5)*0.25)+')'; ctx.lineWidth=4;
      ctx.beginPath(); ctx.arc(GX.x, GX.y, 34, 0, Math.PI*2); ctx.stroke();
    }
  }
  /* la barra de mejoras, como en el original */
  /* cabe entera a la izquierda de la barra de poder, sin pisarla */
  const anc = 104, y0 = H-34;
  MEJORAS_G.forEach((m,i)=>{
    const x = 20 + i*(anc+6);
    const activa = GX.sel === i+1;
    ctx.fillStyle = activa ? '#e0a020' : 'rgba(255,255,255,0.14)';
    ctx.beginPath(); ctx.roundRect(x, y0, anc, 24, 6); ctx.fill();
    ctx.strokeStyle = activa ? '#fff' : 'rgba(255,255,255,0.35)';
    ctx.lineWidth = activa ? 3 : 2; ctx.stroke();
    texto(m + (GX.tengo[m] ? ' x'+GX.tengo[m] : ''), x+anc/2, y0+17, 12,
          activa ? '#2a1a00' : '#cfd8ff', true);
  });
  hudMJ('👾 GALAXIA', etiquetaNivel('galaxia')+'  '+Math.round(Math.min(1,GX.avance/GX.meta)*100)+'%  '+corazonesInf(GX),
        'B dispara · A mejora');
  barraPoder(GX.sel > 0 ? '⚡ PULSA A: '+MEJORAS_G[GX.sel-1] : '⚡ recoge cápsulas P',
             GX.sel/MEJORAS_G.length, GX.sel > 0);
}

/* ============================================================
   23) FERNANDO LUCHA  (estilo Street Fighter II)
   ============================================================ */
const LU2 = { x:0, y:0, vy:0, suelo:true, vida:0, max:0, golpe:0, agacha:false, guardia:0,
              rival:null, t:0, sustos:0, inv:0, saltoPrev:false, golpePrev:false,
              especial:0, especialCd:0, amigo:null, ganadas:0 };
const LSUELO = 430, ESP_CD = 300;
const RIVALES = [
  {nombre:'BOWSER',      dib:(x,y,t)=>dibBowser(x-16,y-58,t,0),      vida:22, vel:1.9, alcance:52},
  {nombre:'TÍO FRAN',    dib:(x,y,t)=>dibTioFran(x-14,y-52,t,false), vida:26, vel:2.3, alcance:46},
  {nombre:'RÓMULO',      dib:(x,y,t)=>dibRomulo(x-14,y-50,t),        vida:30, vel:2.6, alcance:44},
  {nombre:'TÍO NACHO',   dib:(x,y,t)=>dibNacho(x-14,y-52,t),         vida:34, vel:2.8, alcance:48},
  {nombre:'TÍO BETO',    dib:(x,y,t)=>dibBeto(x-14,y-52,t),          vida:38, vel:3.0, alcance:50},
  {nombre:'BOWSER FINAL',dib:(x,y,t)=>dibBowser(x-16,y-58,t,0),      vida:46, vel:3.2, alcance:56},
];
function iniciarLucha(){
  const N = nivelDe('lucha');
  const r = RIVALES[Math.min(N-1, RIVALES.length-1)];
  LU2.x = 220; LU2.y = LSUELO; LU2.vy = 0; LU2.suelo = true;
  LU2.max = 30; LU2.vida = LU2.max; LU2.golpe = 0; LU2.agacha = false; LU2.guardia = 0;
  LU2.t = 0; LU2.sustos = 0; LU2.inv = 0; LU2.saltoPrev = false; LU2.golpePrev = false;
  LU2.especial = 0; LU2.especialCd = 0;
  LU2.rival = {r, x: W-240, y: LSUELO, vida: r.vida, max: r.vida, golpe:0, cd: 70, salta:0, vy:0};
  LU2.amigo = nuevoRescate('lucha', 60, LSUELO-46);
  LU2.amigo.salvado = true;                 /* aquí el amigo anima desde la esquina */
  aviso('¡A pelear contra '+r.nombre+'! ←→ te mueves · A salta · B golpea · ▼+B = especial', 4.6);
}
function updateLucha(){
  LU2.t++;
  const N = nivelDe('lucha'), rv = LU2.rival;
  if (LU2.inv>0) LU2.inv--;
  if (LU2.golpe>0) LU2.golpe--;
  if (LU2.guardia>0) LU2.guardia--;
  if (LU2.especial>0) LU2.especial--;
  if (LU2.especialCd>0) LU2.especialCd--;
  LU2.agacha = mAbj() && LU2.suelo;
  if (!LU2.agacha){
    if (mIzq()){ LU2.x -= 3.6; LU2.guardia = 6; }        /* ir hacia atrás es cubrirse */
    if (mDer()) LU2.x += 3.6;
  }
  LU2.x = Math.max(40, Math.min(W-40, LU2.x));
  if (mSalta() && LU2.suelo && !LU2.saltoPrev){ LU2.vy = -12.4; LU2.suelo = false; sfx.salto(); }
  LU2.saltoPrev = mSalta();
  LU2.vy = Math.min(LU2.vy+0.62, 15); LU2.y += LU2.vy;
  if (LU2.y >= LSUELO){ LU2.y = LSUELO; LU2.vy = 0; LU2.suelo = true; }
  /* golpear, y el especial si está agachado */
  if (mAccion() && !LU2.golpePrev){
    if (LU2.agacha && LU2.especialCd<=0){
      LU2.especial = 40; LU2.especialCd = ESP_CD;
      sfx.pedo(); sacudir(6); nubePedo(LU2.x+30, LU2.y-24, 14);
      hablar(VOZ.pedo);
      aviso('💨 ¡PICHUNGAZO ESPECIAL!', 1.8);
      if (Math.abs(rv.x-LU2.x) < 210){ rv.vida -= 7; rv.golpe = 14; rv.x += 46; }
    } else {
      LU2.golpe = 16; sfx.fuego();
      if (Math.abs(rv.x-LU2.x) < 62 && Math.abs(rv.y-LU2.y) < 60){
        rv.vida -= 3; rv.golpe = 10; rv.x += 16; sfx.pisoton(); sumar(120);
      }
    }
  }
  LU2.golpePrev = mAccion();
  /* el rival */
  if (rv.golpe>0) rv.golpe--;
  else {
    const d = LU2.x - rv.x;
    if (Math.abs(d) > rv.r.alcance) rv.x += Math.sign(d) * rv.r.vel;
    if (--rv.cd <= 0){
      rv.cd = Math.max(28, 92 - N*8);
      if (Math.abs(d) <= rv.r.alcance + 16){
        /* pega, salvo que Fernando esté cubriéndose o agachado */
        if (LU2.guardia>0 || LU2.agacha){ sfx.romper(); aviso('🛡️ ¡Cubierto!', 1); }
        else if (LU2.inv<=0){
          LU2.vida -= 3; LU2.inv = 40; LU2.x -= 24; sfx.dano(); sacudir(3);
        }
      } else if (rv.y >= LSUELO){ rv.salta = 1; rv.vy = -11; }
    }
  }
  /* la gravedad manda siempre: el salto acaba al tocar el suelo, no por un contador */
  if (rv.salta>0 || rv.y < LSUELO){
    rv.vy = Math.min(rv.vy+0.62, 15); rv.y += rv.vy;
    if (rv.y >= LSUELO){ rv.y = LSUELO; rv.vy = 0; rv.salta = 0; }
  }
  rv.x = Math.max(40, Math.min(W-40, rv.x));
  /* vidas infinitas: si le tumban, se levanta con la barra llena */
  if (LU2.vida <= 0){
    LU2.vida = LU2.max; LU2.inv = 100; LU2.x = 220;
    susto(LU2, '¡Te tumbó! Vidas infinitas: otra vez en pie');
  }
  if (rv.vida <= 0) pasarNivel('lucha', iniciarLucha, 'finLucha', VOZ.gane);
}
function drawLucha(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#f0a020'); g.addColorStop(0.6,'#e05a20'); g.addColorStop(1,'#6a2a10');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<12;i++){                                 /* público */
    for(let k=0;k<3;k++){
      ctx.fillStyle='rgba(0,0,0,'+(0.18+k*0.08)+')';
      ctx.beginPath(); ctx.arc(50+i*80+k*20, 120+k*26+Math.sin(LU2.t/16+i+k)*4, 15, 0, Math.PI*2); ctx.fill();
    }
  }
  rect(0, LSUELO+16, W, H-LSUELO, '#8a5a2a');
  rect(0, LSUELO+16, W, 8, '#c8853a');
  /* el amigo animando en la esquina */
  if (LU2.amigo){
    LU2.amigo.a.dib(40, LSUELO-46+Math.sin(LU2.t/8)*4, T);
    letrero(53, LSUELO-60, '¡VAMOS!', '#ffe36e');
  }
  const rv = LU2.rival;
  /* rival */
  if (!(rv.golpe>0 && (LU2.t>>1)%2)){
    sombra(rv.x, LSUELO+16, 20);
    ctx.save(); ctx.translate(rv.x, rv.y); ctx.scale(-1,1); ctx.translate(-rv.x, -rv.y);
    rv.r.dib(2*rv.x - rv.x, rv.y, T);
    ctx.restore();
  }
  /* Fernando */
  if (!(LU2.inv>0 && (LU2.t>>2)%2)){
    sombra(LU2.x, LSUELO+16, 18);
    ctx.save(); ctx.translate(LU2.x, LU2.y);
    ctx.scale(1, LU2.agacha ? 0.7 : 1);
    ctx.translate(-12, -40); dibFernandoSolo();
    if (LU2.golpe>0) rect(24, 14, 26, 8, '#ffc8a0');      /* el puñetazo */
    ctx.restore();
  }
  if (LU2.especial>0){
    ctx.fillStyle='rgba(120,220,90,'+(0.25+Math.sin(LU2.t/3)*0.15)+')';
    ctx.beginPath(); ctx.arc(LU2.x+70, LU2.y-24, 90, 0, Math.PI*2); ctx.fill();
  }
  /* barras de vida, como en los de pelea */
  const bw = 380;
  rect(24, 56, bw, 24, '#3a0a0a'); rect(24, 56, bw*Math.max(0,LU2.vida)/LU2.max, 24, '#5ee08a');
  ctx.strokeStyle='#fff'; ctx.lineWidth=3; ctx.strokeRect(24, 56, bw, 24);
  rect(W-24-bw, 56, bw, 24, '#3a0a0a');
  rect(W-24-bw*Math.max(0,rv.vida)/rv.max, 56, bw*Math.max(0,rv.vida)/rv.max, 24, '#e03434');
  ctx.strokeRect(W-24-bw, 56, bw, 24);
  texto('FERNANDO', 28, 100, 16, '#fff');
  ctx.textAlign='right'; ctx.font='bold 16px monospace';
  ctx.fillStyle='#000'; ctx.fillText(rv.r.nombre, W-26, 101);
  ctx.fillStyle='#fff'; ctx.fillText(rv.r.nombre, W-28, 100);
  ctx.textAlign='left';
  hudMJ('🥊 LUCHA', etiquetaNivel('lucha')+'  '+corazonesInf(LU2), 'B golpea · ▼+B especial');
  barraPoder(LU2.especialCd<=0 ? '💨 ESPECIAL LISTO (▼ + B)' : '💨 tomando aire...',
             1-LU2.especialCd/ESP_CD, LU2.especialCd<=0);
}

/* ============================================================
   24) VAGONETA DE SHELDON  (estilo Donkey Kong Country)
   ============================================================ */
const VG = { x:0, y:0, vy:0, suelo:false, avance:0, meta:0, vias:[], obs:[], monedas:[],
             t:0, sustos:0, inv:0, saltoPrev:false, estrella:0, estCd:0, estPrev:false, amigo:null };
const VGBASE = 430, EST_VG = 420;
function iniciarVagoneta(){
  const N = nivelDe('vagoneta');
  VG.x = 200; VG.y = VGBASE; VG.vy = 0; VG.suelo = true;
  VG.avance = 0; VG.meta = 3200 + N*700;
  VG.vias = []; VG.obs = []; VG.monedas = [];
  VG.t = 0; VG.sustos = 0; VG.inv = 0; VG.saltoPrev = false;
  VG.estrella = 0; VG.estCd = 0; VG.estPrev = false;
  /* la vía: tramos a distintas alturas con huecos entre medias */
  let x = 0, y = VGBASE;
  while (x < VG.meta + 1400){
    const largo = 260 + Math.random()*280;
    VG.vias.push({x0:x, x1:x+largo, y});
    x += largo + (60 + Math.random()*(50 + N*9));      /* el hueco que hay que saltar */
    y = Math.max(250, Math.min(VGBASE, y + (Math.random()<0.5 ? -60 : 60)));
  }
  VG.amigo = nuevoRescate('vagoneta', 0, 0);
  VG.amigo.puesto = false;
  aviso('¡Solo hay que saltar! A salta los huecos · B = estrella invencible', 4);
}
const alturaVia = xm => {
  for(const v of VG.vias) if (xm >= v.x0 && xm <= v.x1) return v.y;
  return null;
};
function updateVagoneta(){
  VG.t++;
  const N = nivelDe('vagoneta');
  if (VG.inv>0) VG.inv--;
  if (VG.estrella>0) VG.estrella--;
  if (VG.estCd>0) VG.estCd--;
  if (mAccion() && !VG.estPrev && VG.estCd<=0){
    VG.estrella = 300; VG.estCd = EST_VG; sfx.poder();
    aviso('⭐ ¡ESTRELLA! Nada te para', 2); hablar(VOZ.ataque);
  }
  VG.estPrev = mAccion();
  const v = (5.4 + N*0.55) * (VG.estrella>0 ? 1.4 : 1);
  VG.avance += v;
  if (mSalta() && VG.suelo && !VG.saltoPrev){ VG.vy = -13.6; VG.suelo = false; sfx.salto(); }
  VG.saltoPrev = mSalta();
  VG.vy = Math.min(VG.vy+0.66, 16); VG.y += VG.vy;
  const yv = alturaVia(VG.avance + VG.x);
  VG.suelo = false;
  if (yv !== null && VG.vy >= 0 && VG.y >= yv && VG.y < yv + 40){ VG.y = yv; VG.vy = 0; VG.suelo = true; }
  if (VG.y > H + 60){                                   /* se cayó al vacío */
    const yy = alturaVia(VG.avance + VG.x) ;
    VG.y = (yy !== null ? yy : VGBASE) - 120; VG.vy = 0; VG.inv = 70;
    susto(VG, '¡Al vacío! Vidas infinitas: de vuelta a la vía');
  }
  /* obstáculos y monedas sobre la vía */
  if (VG.t % Math.max(34, 74 - N*5) === 0){
    const xm = VG.avance + W + 60;
    const yy = alturaVia(xm);
    if (yy !== null) VG.obs.push({x:xm, y:yy, vivo:true});
  }
  if (VG.t % 46 === 0){
    const xm = VG.avance + W + 40;
    const yy = alturaVia(xm);
    if (yy !== null) VG.monedas.push({x:xm, y:yy-46});
  }
  if (!VG.amigo.puesto && VG.avance >= VG.meta*0.55){
    const xm = VG.avance + W + 60, yy = alturaVia(xm);
    if (yy !== null){ VG.amigo.puesto = true; VG.amigo.x = xm; VG.amigo.y = yy-46; }
  }
  for(const o of VG.obs){
    if (!o.vivo) continue;
    if (Math.abs((o.x-VG.avance)-VG.x) < 24 && Math.abs(o.y-VG.y) < 34){
      o.vivo = false;
      if (VG.estrella>0){ sumar(300); sfx.pisoton(); }
      else if (VG.inv<=0){ VG.inv = 80; susto(VG, '¡Un barril! Vidas infinitas: sigue'); }
    }
  }
  VG.obs = VG.obs.filter(o=>o.vivo && o.x > VG.avance - 80);
  VG.monedas = VG.monedas.filter(m=>{
    if (m.x < VG.avance - 60) return false;
    if (Math.abs((m.x-VG.avance)-VG.x) < 28 && Math.abs(m.y-VG.y) < 46){ sumar(120); sfx.moneda(); return false; }
    return true;
  });
  if (VG.amigo.puesto && !VG.amigo.salvado)
    rescatar(VG.amigo, VG.avance + VG.x, VG.y - 18, 40);
  if (VG.avance >= VG.meta) pasarNivel('vagoneta', iniciarVagoneta, 'finVagoneta', VOZ.pichungazo);
}
function drawVagoneta(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#2a1408'); g.addColorStop(1,'#0e0604');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<10;i++){                                  /* antorchas del fondo */
    const fx = ((i*220 - VG.avance*0.3) % (W+240) + (W+240)) % (W+240) - 120;
    rect(fx, 120, 8, 40, '#5a3a1a');
    ctx.fillStyle=(VG.t>>2)%2 ? '#ffb020' : '#ff7020';
    ctx.beginPath(); ctx.arc(fx+4, 114, 11, 0, Math.PI*2); ctx.fill();
  }
  ctx.save(); ctx.translate(-VG.avance, 0);
  for(const via of VG.vias){
    if (via.x1 < VG.avance-60 || via.x0 > VG.avance+W+60) continue;
    rect(via.x0, via.y+10, via.x1-via.x0, 10, '#8a5a2a');
    rect(via.x0, via.y+8, via.x1-via.x0, 5, '#c8853a');
    for(let x=via.x0; x<via.x1; x+=28) rect(x, via.y+20, 16, 26, '#5a3a1a');
  }
  for(const m of VG.monedas){
    ctx.save(); ctx.translate(m.x, m.y); ctx.scale(0.9,0.9); dibBurger(-11,-10); ctx.restore();
  }
  for(const o of VG.obs){
    ctx.save(); ctx.translate(o.x, o.y-16); ctx.rotate(VG.t*0.12);
    ctx.fillStyle='#c87838';
    ctx.beginPath(); ctx.roundRect(-16,-13,32,26,8); ctx.fill();
    rect(-16,-5,32,4,'#8a4a18'); rect(-16,2,32,3,'#8a4a18');
    ctx.restore();
  }
  if (VG.amigo.puesto && !VG.amigo.salvado) dibRescate(VG.amigo);
  ctx.restore();
  /* la vagoneta con Fernando y Sheldon */
  if (!(VG.inv>0 && (VG.t>>2)%2)){
    ctx.save(); ctx.translate(VG.x, VG.y);
    if (VG.estrella>0){
      ctx.globalAlpha = 0.4+Math.sin(VG.t/4)*0.25; ctx.fillStyle='#ffe36e';
      ctx.beginPath(); ctx.arc(0,-24,48,0,Math.PI*2); ctx.fill(); ctx.globalAlpha = 1;
    }
    ctx.save(); ctx.translate(-16, -50); ctx.scale(0.85,0.85); dibFernandoSolo(); ctx.restore();
    ctx.save(); ctx.translate(4, -30); dibPerroSolo('#8a5a2a'); ctx.restore();
    rect(-26, -18, 52, 22, '#8a4a18');
    rect(-26, -18, 52, 6, '#c87838');
    ctx.fillStyle='#3a3a44';
    ctx.beginPath(); ctx.arc(-14, 8, 9, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(14, 8, 9, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }
  const frac = Math.min(1, VG.avance/VG.meta);
  rect(24, H-24, W-280, 12, 'rgba(0,0,0,0.45)');
  rect(24, H-24, (W-280)*frac, 12, '#5ee08a');
  hudMJ('🚃 VAGONETA', etiquetaNivel('vagoneta')+'  '+Math.round(frac*100)+'%  '+corazonesInf(VG), 'A salta');
  barraPoder(VG.estrella>0 ? '⭐ ¡ESTRELLA!' : (VG.estCd<=0 ? '⭐ ESTRELLA (B)' : '⭐ brillando...'),
             VG.estrella>0 ? 1 : 1-VG.estCd/EST_VG, VG.estrella>0);
}

/* ============================================================
   25) FERNANDO JAM  (estilo NBA Jam, 2 contra 2)
   ============================================================ */
const JM = { x:0, y:0, conBalon:true, balon:{x:0,y:0,vx:0,vy:0,vuela:false,alto:0},
             socio:null, rivales:[], puntos:0, meta:0, t:0, sustos:0, fuego:0, seguidas:0,
             tiraPrev:false, pasaPrev:false, amigo:null, aro:{x:0,y:0}, aviso2:0 };
const JMY0 = 130, JMY1 = 470;
function iniciarJam(){
  const N = nivelDe('jam');
  JM.x = 240; JM.y = 300; JM.conBalon = true;
  JM.balon = {x:JM.x, y:JM.y, vx:0, vy:0, vuela:false, alto:0};
  JM.puntos = 0; JM.meta = 8 + N*2; JM.t = 0; JM.sustos = 0;
  JM.fuego = 0; JM.seguidas = 0; JM.tiraPrev = false; JM.pasaPrev = false; JM.aviso2 = 0;
  JM.aro = {x: W-70, y: 250};
  JM.socio = {x: 180, y: 380, tipo:'tiojuan'};
  JM.rivales = [
    {x: W-320, y: 240, vel: 1.9 + N*0.22},
    {x: W-260, y: 360, vel: 1.7 + N*0.22},
  ];
  JM.amigo = nuevoRescate('jam', 60, JMY1-70);
  JM.amigo.salvado = true;               /* anima desde la banda */
  aviso('¡Encesta '+JM.meta+' puntos! A tira · B pasa a tío Juan · 3 seguidas = ¡FUEGO!', 4.4);
}
function updateJam(){
  JM.t++;
  const N = nivelDe('jam');
  if (JM.fuego>0) JM.fuego--;
  if (JM.aviso2>0) JM.aviso2--;
  const vel = 3.6 + (JM.fuego>0 ? 1.4 : 0);
  if (mIzq()) JM.x -= vel; if (mDer()) JM.x += vel;
  if (mArr()) JM.y -= vel; if (mAbj()) JM.y += vel;
  JM.x = Math.max(40, Math.min(W-40, JM.x));
  JM.y = Math.max(JMY0, Math.min(JMY1, JM.y));
  /* tirar a canasta */
  if (mSalta() && !JM.tiraPrev && JM.conBalon){
    JM.conBalon = false;
    const b = JM.balon;
    b.x = JM.x; b.y = JM.y; b.vuela = true; b.alto = 0;
    const d = Math.hypot(JM.aro.x-JM.x, JM.aro.y-JM.y);
    const fallo = JM.fuego>0 ? 0 : Math.min(0.62, d/1500 + 0.06*N);
    b.acierta = Math.random() > fallo;
    b.destinoX = JM.aro.x + (b.acierta ? 0 : (Math.random()<0.5?-46:46));
    b.destinoY = JM.aro.y + (b.acierta ? 0 : 40);
    b.t = 0; b.dur = Math.max(24, d/16);
    b.ox = JM.x; b.oy = JM.y;
    sfx.salto();
  }
  JM.tiraPrev = mSalta();
  /* pasar a tío Juan */
  if (mAccion() && !JM.pasaPrev && JM.conBalon){
    JM.conBalon = false;
    const b = JM.balon;
    b.x = JM.x; b.y = JM.y; b.vuela = true; b.pase = true; b.t = 0; b.dur = 20;
    b.ox = JM.x; b.oy = JM.y; b.destinoX = JM.socio.x; b.destinoY = JM.socio.y;
    sfx.moneda();
  }
  JM.pasaPrev = mAccion();
  /* el balón en el aire */
  const b = JM.balon;
  if (b.vuela){
    b.t++;
    const f = Math.min(1, b.t/b.dur);
    b.x = b.ox + (b.destinoX-b.ox)*f;
    b.y = b.oy + (b.destinoY-b.oy)*f;
    b.alto = Math.sin(f*Math.PI) * (b.pase ? 30 : 110);
    if (f >= 1){
      b.vuela = false;
      if (b.pase){ b.pase = false; JM.socioTiene = 40; }
      else if (b.acierta){
        const tres = Math.hypot(b.ox-JM.aro.x, b.oy-JM.aro.y) > 330;
        const pts = tres ? 3 : 2;
        JM.puntos += pts; JM.seguidas++;
        sumar(pts*300); sfx.meta();
        JM.aviso2 = 90;
        if (JM.seguidas >= 3 && JM.fuego<=0){
          JM.fuego = 480; sfx.heroe(); hablar(VOZ.gane);
          aviso('🔥 ¡EN LLAMAS! No fallas ni una', 2.4);
        }
        for(let i=0;i<10;i++) parts.push({tipo:'estrellita', x:JM.aro.x, y:JM.aro.y,
          vx:(Math.random()-0.5)*6, vy:-1-Math.random()*3, t:34});
      } else {
        JM.seguidas = 0;
        susto(JM, '¡Rebotó en el aro! Vidas infinitas: otra vez');
      }
      /* el balón vuelve a Fernando */
      JM.conBalon = true;
      JM.x = Math.max(60, Math.min(W-260, JM.x));
    }
  }
  /* tío Juan devuelve el balón */
  if (JM.socioTiene){ if (--JM.socioTiene <= 0){ JM.conBalon = true; } }
  /* tío Juan se coloca */
  JM.socio.x += Math.sign((JM.x-120) - JM.socio.x) * 1.6;
  JM.socio.y += Math.sign(JM.y - JM.socio.y) * 1.2;
  /* rivales: intentan quitarte el balón */
  for(const r of JM.rivales){
    const d = Math.hypot(JM.x-r.x, JM.y-r.y) || 1;
    r.x += (JM.x-r.x)/d*r.vel; r.y += (JM.y-r.y)/d*r.vel;
    if (JM.conBalon && JM.fuego<=0 && d < 26 && !r.cd){
      r.cd = 120; JM.conBalon = false; JM.socioTiene = 60; JM.seguidas = 0;
      JM.x = Math.max(60, JM.x - 90);
      susto(JM, '¡Te lo quitaron! Vidas infinitas: tío Juan te lo devuelve');
    }
    if (r.cd) r.cd--;
  }
  if (JM.puntos >= JM.meta) pasarNivel('jam', iniciarJam, 'finJam', VOZ.gane);
}
function drawJam(){
  rect(0,0,W,H,'#c8853a');
  rect(0,JMY0-30,W,JMY1-JMY0+70,'#e0a860');
  ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=4;
  ctx.strokeRect(30, JMY0-24, W-60, JMY1-JMY0+58);
  ctx.beginPath(); ctx.arc(W/2, (JMY0+JMY1)/2, 66, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(JM.aro.x, JM.aro.y, 150, Math.PI*0.55, Math.PI*1.45); ctx.stroke();
  /* la canasta */
  rect(JM.aro.x+16, JM.aro.y-70, 12, 140, '#8a8a96');
  rect(JM.aro.x-6, JM.aro.y-46, 34, 46, 'rgba(255,255,255,0.85)');
  ctx.strokeStyle='#e03434'; ctx.lineWidth=6;
  ctx.beginPath(); ctx.arc(JM.aro.x, JM.aro.y, 20, 0, Math.PI*2); ctx.stroke();
  /* el amigo animando en la banda */
  if (JM.amigo){ JM.amigo.a.dib(46, JMY1-46+Math.sin(JM.t/8)*4, T);
                 letrero(59, JMY1-60, '¡VAMOS!', '#ffe36e'); }
  for(const r of JM.rivales){ sombra(r.x, r.y+16, 15); dibGoomba(r.x-13, r.y-12, T); }
  ctx.save(); ctx.translate(JM.socio.x-14, JM.socio.y-30); dibTioJuan(0,0,T); ctx.restore();
  /* Fernando */
  ctx.save(); ctx.translate(JM.x-12, JM.y-34);
  if (JM.fuego>0){
    ctx.globalAlpha = 0.4+Math.sin(JM.t/3)*0.25;
    ctx.fillStyle=(JM.t>>1)%2 ? '#ff8a20' : '#ffe36e';
    ctx.beginPath(); ctx.arc(12, 20, 34, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
  }
  dibFernandoSolo(); ctx.restore();
  /* el balón */
  const b = JM.balon;
  const bx = JM.conBalon ? JM.x+16 : b.x, by = (JM.conBalon ? JM.y-10 : b.y) - (b.vuela ? b.alto : 0);
  if (!JM.socioTiene || !JM.conBalon){
    ctx.fillStyle = JM.fuego>0 ? ((JM.t>>1)%2 ? '#ff8a20' : '#ffe36e') : '#e07a20';
    ctx.beginPath(); ctx.arc(bx, by, 11, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle='#8a3a10'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(bx, by, 11, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx-11, by); ctx.lineTo(bx+11, by);
    ctx.moveTo(bx, by-11); ctx.lineTo(bx, by+11); ctx.stroke();
  }
  if (JM.aviso2>0) texto('¡CANASTA!', W/2, 220, 44, '#ffe36e', true);
  hudMJ('🏀 JAM', etiquetaNivel('jam')+'  '+JM.puntos+'/'+JM.meta+'  '+corazonesInf(JM), 'A tira · B pasa');
  barraPoder(JM.fuego>0 ? '🔥 ¡EN LLAMAS!' : '🔥 '+JM.seguidas+'/3 seguidas para el fuego',
             JM.fuego>0 ? JM.fuego/480 : JM.seguidas/3, JM.fuego>0);
}

/* ============================================================
   26) FERNANDO F-CERO  (carrera futurista en perspectiva)
   ============================================================ */
const FZ = { x:0, vel:0, avance:0, meta:0, curva:0, curvaObj:0, rivales:[], t:0, sustos:0,
             turbo:0, turboCd:0, turboPrev:false, energia:0, amigo:null };
const FZHOR = 200, FZSUELO = 470, TURBO_FZ = 360;
function iniciarFcero(){
  const N = nivelDe('fcero');
  FZ.x = 0; FZ.vel = 0; FZ.avance = 0; FZ.meta = 4200 + N*900;
  FZ.curva = 0; FZ.curvaObj = 0; FZ.t = 0; FZ.sustos = 0;
  FZ.turbo = 0; FZ.turboCd = 0; FZ.turboPrev = false; FZ.energia = 100;
  FZ.rivales = [];
  for(let i=0;i<5;i++)
    FZ.rivales.push({z: 260 + i*230, x:(i%2?1:-1)*0.45, vel: 7.2 + N*0.35 + i*0.25,
                     a: AMIGOS[(i + N*2) % AMIGOS.length]});
  FZ.amigo = nuevoRescate('fcero', 0, 0);
  FZ.amigo.puesto = false;
  aviso('¡Carrera futurista! ←→ giras · B turbo · sal de la pista y pierdes energía', 4.2);
}
const fzp = z => 1/(1 + Math.max(0,z)*0.011);
const fzY = z => FZHOR + (FZSUELO-FZHOR)*fzp(z);
const fzX = (desv, z) => W/2 + (desv - FZ.x)*300*fzp(z) - FZ.curva*z*z*0.010*fzp(z);
function updateFcero(){
  FZ.t++;
  const N = nivelDe('fcero');
  if (FZ.turbo>0) FZ.turbo--;
  if (FZ.turboCd>0) FZ.turboCd--;
  if (mAccion() && !FZ.turboPrev && FZ.turboCd<=0 && FZ.energia > 20){
    FZ.turbo = 130; FZ.turboCd = TURBO_FZ; FZ.energia -= 15;
    sfx.poder(); aviso('🔥 ¡TURBO!', 1.6); hablar(VOZ.hamburguesa);
  }
  FZ.turboPrev = mAccion();
  /* la pista serpentea sola */
  if (FZ.t % 150 === 0) FZ.curvaObj = (Math.random()-0.5) * (1.6 + N*0.2);
  FZ.curva += (FZ.curvaObj - FZ.curva) * 0.02;
  const vMax = (9.5 + N*0.5) * (FZ.turbo>0 ? 1.7 : 1);
  FZ.vel += (vMax - FZ.vel) * 0.03;
  FZ.avance += FZ.vel;
  /* girar; la curva empuja hacia fuera */
  if (mIzq()) FZ.x -= 0.026; if (mDer()) FZ.x += 0.026;
  FZ.x += FZ.curva * 0.0016 * FZ.vel;
  FZ.x = Math.max(-2.2, Math.min(2.2, FZ.x));
  /* fuera de la pista: frena y gasta energía */
  if (Math.abs(FZ.x) > 1){
    FZ.vel *= 0.965;
    FZ.energia -= 0.35;
    if (FZ.t % 8 === 0) parts.push({tipo:'estrellita', x:W/2+FZ.x*90, y:FZSUELO-10,
      vx:(Math.random()-0.5)*4, vy:-1, t:20});
    if (FZ.energia <= 0){
      FZ.energia = 60; FZ.x = 0; FZ.vel *= 0.5;
      susto(FZ, '¡Te saliste! Vidas infinitas: de vuelta a la pista');
    }
  } else if (FZ.energia < 100) FZ.energia += 0.06;
  /* rivales */
  for(const r of FZ.rivales){
    r.z -= (FZ.vel - r.vel);
    if (r.z < -30){ r.z += 1500; sumar(300); }
    if (r.z > 1500) r.z -= 1500;
    if (r.z < 22 && r.z > -6 && Math.abs(r.x - FZ.x) < 0.42){
      r.z = 60; FZ.vel *= 0.55;
      susto(FZ, '¡Choque! Vidas infinitas: acelera otra vez');
    }
  }
  if (!FZ.amigo.puesto && FZ.avance >= FZ.meta*0.5){
    FZ.amigo.puesto = true; FZ.amigo.z = 900; FZ.amigo.desv = (Math.random()-0.5)*1.2;
  }
  if (FZ.amigo.puesto && !FZ.amigo.salvado){
    FZ.amigo.z -= FZ.vel;
    if (FZ.amigo.z < 22 && FZ.amigo.z > -10 && Math.abs(FZ.amigo.desv - FZ.x) < 0.5){
      FZ.amigo.x = 0; FZ.amigo.y = 0;
      rescatar(FZ.amigo, 0, 0, 9999);
    }
    if (FZ.amigo.z < -40){ FZ.amigo.z = 900; FZ.amigo.desv = (Math.random()-0.5)*1.2; }
  }
  if (FZ.avance >= FZ.meta) pasarNivel('fcero', iniciarFcero, 'finFcero', VOZ.gane);
}
function drawFcero(){
  const g = ctx.createLinearGradient(0,0,0,FZHOR);
  g.addColorStop(0,'#12063a'); g.addColorStop(1,'#8a2a8a');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,FZHOR);
  for(let i=0;i<40;i++){
    ctx.fillStyle='rgba(255,255,255,'+(0.2+Math.sin(FZ.t/20+i)*0.16)+')';
    ctx.fillRect((i*137 - FZ.curva*40)%W, (i*53)%FZHOR, 2, 2);
  }
  /* ciudad futurista al fondo */
  for(let i=0;i<14;i++){
    const bx = ((i*90 - FZ.curva*90) % (W+120) + (W+120)) % (W+120) - 60;
    const bh = 30 + (i*47)%80;
    rect(bx, FZHOR-bh, 56, bh, '#2a1050');
    for(let k=0;k<3;k++) rect(bx+8+k*16, FZHOR-bh+8, 8, 8, 'rgba(255,120,220,0.5)');
  }
  rect(0, FZHOR, W, H-FZHOR, '#1a0a2a');
  /* la pista, franja a franja */
  for(let i=28;i>=0;i--){
    const z0 = i*32, z1 = (i+1)*32;
    const y0 = fzY(z0), y1 = fzY(z1);
    const claro = (Math.floor((FZ.avance+z0)/40) % 2) === 0;
    ctx.fillStyle = claro ? '#3a3a6a' : '#32325e';
    ctx.beginPath();
    ctx.moveTo(fzX(-1,z0), y0); ctx.lineTo(fzX(1,z0), y0);
    ctx.lineTo(fzX(1,z1), y1); ctx.lineTo(fzX(-1,z1), y1);
    ctx.fill();
    ctx.fillStyle = claro ? '#ff4aa0' : '#8ecbff';
    ctx.beginPath();
    ctx.moveTo(fzX(-1.1,z0), y0); ctx.lineTo(fzX(-1,z0), y0);
    ctx.lineTo(fzX(-1,z1), y1); ctx.lineTo(fzX(-1.1,z1), y1); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(fzX(1,z0), y0); ctx.lineTo(fzX(1.1,z0), y0);
    ctx.lineTo(fzX(1.1,z1), y1); ctx.lineTo(fzX(1,z1), y1); ctx.fill();
  }
  /* rivales y el amigo, de lejos a cerca */
  const cosas = FZ.rivales.map(r=>({z:r.z, dib:()=>{
    const p = fzp(r.z), x = fzX(r.x, r.z), y = fzY(r.z);
    ctx.save(); ctx.translate(x, y); ctx.scale(p*2.4, p*2.4);
    ctx.fillStyle='#e03434';
    ctx.beginPath(); ctx.moveTo(-22,0); ctx.lineTo(0,-16); ctx.lineTo(22,0); ctx.lineTo(0,8); ctx.fill();
    ctx.restore();
    if (p > 0.34) r.a.dib(x-13*p*2.4, y-40*p*2.4, T);
  }}));
  if (FZ.amigo.puesto && !FZ.amigo.salvado) cosas.push({z:FZ.amigo.z, dib:()=>{
    const p = fzp(FZ.amigo.z), x = fzX(FZ.amigo.desv, FZ.amigo.z), y = fzY(FZ.amigo.z);
    ctx.save(); ctx.translate(x, y); ctx.scale(p*2.6, p*2.6); ctx.translate(-13, -30);
    FZ.amigo.a.dib(0, 0, T);
    ctx.restore();
    if (p > 0.3) letrero(x, y-46*p*2.6, FZ.amigo.a.nombre, '#ffe36e');
  }});
  cosas.sort((a,b)=>b.z-a.z).forEach(c=>c.dib());
  /* la nave de Fernando */
  const nx = W/2 + FZ.x*90;
  ctx.save(); ctx.translate(nx, FZSUELO-6);
  ctx.rotate((mIzq()?-0.1:0) + (mDer()?0.1:0));
  if (FZ.turbo>0){
    ctx.fillStyle=(FZ.t>>1)%2 ? '#ffb020' : '#8ecbff';
    ctx.beginPath(); ctx.moveTo(-26,10); ctx.lineTo(0, 54+Math.random()*20); ctx.lineTo(26,10); ctx.fill();
  }
  ctx.fillStyle='#3a6ad0';
  ctx.beginPath(); ctx.moveTo(-52,16); ctx.lineTo(-22,-18); ctx.lineTo(22,-18); ctx.lineTo(52,16); ctx.fill();
  ctx.fillStyle='#8ecbff';
  ctx.beginPath(); ctx.ellipse(0,-8,18,10,0,0,Math.PI*2); ctx.fill();
  rect(-56, 12, 18, 12, '#e03434'); rect(38, 12, 18, 12, '#e03434');
  ctx.save(); ctx.translate(-11, -40); ctx.scale(0.75,0.75); dibFernandoSolo(); ctx.restore();
  ctx.restore();
  /* energía y avance */
  rect(24, H-32, 240, 16, 'rgba(0,0,0,0.5)');
  rect(24, H-32, 240*Math.max(0,FZ.energia)/100, 16, FZ.energia>35 ? '#8ecbff' : '#ff6a4a');
  texto('ENERGÍA', 26, H-38, 12, '#8ecbff');
  const frac = Math.min(1, FZ.avance/FZ.meta);
  hudMJ('🏎️ F-CERO', etiquetaNivel('fcero')+'  '+Math.round(frac*100)+'%  '+corazonesInf(FZ), '←→ giran · B turbo');
  barraPoder(FZ.turbo>0 ? '🔥 ¡TURBO!' : (FZ.turboCd<=0 ? '🔥 TURBO (B)' : '🔥 recargando...'),
             FZ.turbo>0 ? 1 : 1-FZ.turboCd/TURBO_FZ, FZ.turbo>0);
}

/* ============================================================
   27) BANANAS DE TÍO FRAN  (estilo Gorillas de QBasic)
   ============================================================ */
const BA = { edificios: [], turno:0, ang:45, fza:50, banana:null, viento:0, t:0,
             aciertos:[0,0], meta:0, sustos:0, fase:'angulo', ajustePrev:null,
             tiraPrev:false, amigo:null, jug:[{x:0,y:0},{x:0,y:0}], msgT:0, msg2:'' };
function iniciarBananas(){
  const N = nivelDe('bananas');
  BA.edificios = [];
  let x = 0;
  while (x < W){
    const an = 70 + Math.random()*44;
    BA.edificios.push({x, an, alto: 90 + Math.random()*230,
                       color: ['#3a4a8a','#8a3a5a','#3a6a5a','#6a4a2a'][(BA.edificios.length)%4]});
    x += an;
  }
  BA.turno = 0; BA.ang = 45; BA.fza = 50; BA.banana = null;
  BA.viento = (Math.random()-0.5) * (0.06 + N*0.02);
  BA.t = 0; BA.aciertos = [0,0]; BA.meta = 2 + Math.min(3, Math.floor(N/2));
  BA.sustos = 0; BA.fase = 'angulo'; BA.ajustePrev = null; BA.tiraPrev = false;
  BA.msgT = 0;
  const e0 = BA.edificios[1], e1 = BA.edificios[BA.edificios.length-2];
  BA.jug[0] = {x: e0.x + e0.an/2, y: H - e0.alto};
  BA.jug[1] = {x: e1.x + e1.an/2, y: H - e1.alto};
  BA.amigo = nuevoRescate('bananas', BA.jug[0].x-13, BA.jug[0].y-92);
  BA.amigo.salvado = true;              /* mira desde el tejado */
  aviso('¡Ángulo con ←→, fuerza con ▲▼ y B para lanzar! Gana quien acierte '+BA.meta+' veces', 4.6);
}
function updateBananas(){
  BA.t++;
  const N = nivelDe('bananas');
  if (BA.msgT>0) BA.msgT--;
  if (BA.banana){
    const b = BA.banana;
    b.vx += BA.viento; b.vy += 0.28;
    b.x += b.vx; b.y += b.vy; b.giro += 0.3;
    /* ¿le dio a alguien? */
    for(let k=0;k<2;k++){
      if (Math.abs(b.x-BA.jug[k].x) < 22 && Math.abs(b.y-(BA.jug[k].y-24)) < 30){
        BA.banana = null;
        sfx.pedo(); sacudir(7); nubePedo(BA.jug[k].x, BA.jug[k].y-24, 16);
        if (k === b.de){ BA.msg2 = '¡Te diste a ti mismo!'; BA.msgT = 110; }
        else {
          BA.aciertos[b.de]++;
          if (b.de === 0){ sumar(900); BA.msg2 = '¡LE DISTE A TÍO FRAN!'; hablar(VOZ.pedo); }
          else { BA.msg2 = '¡Te dio tío Fran!'; susto(BA, '¡Te dio! Vidas infinitas: te toca'); }
          BA.msgT = 110;
        }
        if (BA.aciertos[0] >= BA.meta){ pasarNivel('bananas', iniciarBananas, 'finBananas', VOZ.gane); return; }
        if (BA.aciertos[1] >= BA.meta){ BA.aciertos = [0,0]; BA.msg2 = '¡Empezamos de nuevo!'; }
        BA.turno = 1 - b.de; BA.fase = 'angulo';
        BA.viento = (Math.random()-0.5) * (0.06 + N*0.02);
        return;
      }
    }
    /* ¿le dio a un edificio? */
    for(const e of BA.edificios){
      if (b.x > e.x && b.x < e.x+e.an && b.y > H-e.alto){
        BA.banana = null; sfx.romper(); sacudir(3);
        for(let i=0;i<8;i++) parts.push({tipo:'ladrillo', x:b.x, y:b.y,
          vx:(Math.random()-0.5)*6, vy:-2-Math.random()*3, t:34});
        BA.turno = 1 - b.de; BA.fase = 'angulo';
        return;
      }
    }
    if (b.y > H+60 || b.x < -300 || b.x > W+300){ BA.banana = null; BA.turno = 1 - b.de; BA.fase = 'angulo'; }
    return;
  }
  /* le toca a tío Fran: apunta él solito */
  if (BA.turno === 1){
    if (!BA.penso){ BA.penso = 40; }
    if (--BA.penso <= 0){
      BA.penso = 0;
      const dx = BA.jug[0].x - BA.jug[1].x, dy = BA.jug[0].y - BA.jug[1].y;
      const ang = (135 + (Math.random()-0.5)*(34 - N*3)) * Math.PI/180;
      const f = (Math.min(96, Math.hypot(dx,dy)/7.5) + (Math.random()-0.5)*(20 - N*2));
      BA.banana = {x: BA.jug[1].x, y: BA.jug[1].y-34, vx: Math.cos(ang)*f*0.22,
                   vy: -Math.abs(Math.sin(ang))*f*0.22, giro:0, de:1};
      sfx.salto();
    }
    return;
  }
  /* turno de Fernando: ángulo y fuerza */
  const dirH = mIzq() ? 'i' : mDer() ? 'd' : null;
  const dirV = mArr() ? 'a' : mAbj() ? 'b' : null;
  if (dirH){ BA.ang = Math.max(5, Math.min(89, BA.ang + (dirH==='i' ? 0.7 : -0.7))); }
  if (dirV){ BA.fza = Math.max(10, Math.min(100, BA.fza + (dirV==='a' ? 0.7 : -0.7))); }
  if (mAccion() && !BA.tiraPrev){
    const a = BA.ang*Math.PI/180;
    BA.banana = {x: BA.jug[0].x, y: BA.jug[0].y-34,
                 vx: Math.cos(a)*BA.fza*0.22, vy: -Math.sin(a)*BA.fza*0.22, giro:0, de:0};
    sfx.salto();
  }
  BA.tiraPrev = mAccion();
}
function drawBananas(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#0a1030'); g.addColorStop(1,'#3a1a5a');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<50;i++){
    ctx.fillStyle='rgba(255,255,255,'+(0.25+Math.sin(BA.t/22+i)*0.2)+')';
    ctx.fillRect((i*137)%W, (i*61)%260, 2, 2);
  }
  for(const e of BA.edificios){
    rect(e.x, H-e.alto, e.an-4, e.alto, e.color);
    for(let y=H-e.alto+14; y<H-16; y+=26)
      for(let x=e.x+10; x<e.x+e.an-16; x+=22)
        rect(x, y, 12, 14, ((x+y)%3) ? 'rgba(255,227,110,0.75)' : 'rgba(0,0,0,0.35)');
  }
  /* Fernando y tío Fran, cada uno en su tejado */
  ctx.save(); ctx.translate(BA.jug[0].x-12, BA.jug[0].y-40); dibFernandoSolo(); ctx.restore();
  dibTioFran(BA.jug[1].x-14, BA.jug[1].y-52, T, false);
  if (BA.amigo){ BA.amigo.a.dib(BA.jug[0].x-52, BA.jug[0].y-40+Math.sin(BA.t/10)*3, T); }
  /* la banana */
  if (BA.banana){
    const b = BA.banana;
    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.giro);
    ctx.fillStyle='#ffe36e';
    ctx.beginPath(); ctx.arc(0,0,10,0.6,Math.PI+0.2); ctx.arc(2,-3,10,Math.PI+0.2,0.6,true); ctx.fill();
    ctx.restore();
  }
  /* mandos de ángulo y fuerza */
  if (BA.turno === 0 && !BA.banana){
    const a = BA.ang*Math.PI/180;
    ctx.strokeStyle='rgba(255,227,110,0.8)'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(BA.jug[0].x, BA.jug[0].y-34);
    ctx.lineTo(BA.jug[0].x + Math.cos(a)*BA.fza*1.5, BA.jug[0].y-34 - Math.sin(a)*BA.fza*1.5);
    ctx.stroke();
    rect(24, H-84, 240, 26, 'rgba(0,0,0,0.55)');
    texto('ÁNGULO  '+BA.ang.toFixed(0)+'°   (←→)', 32, H-65, 15, '#ffe36e');
    rect(24, H-52, 240, 26, 'rgba(0,0,0,0.55)');
    rect(26, H-50, 236*BA.fza/100, 22, 'rgba(94,224,138,0.55)');
    texto('FUERZA  '+BA.fza.toFixed(0)+'   (▲▼)', 32, H-33, 15, '#5ee08a');
  } else if (BA.turno === 1 && !BA.banana){
    texto('💨 Apunta tío Fran...', W/2, 120, 24, '#ffe36e', true);
  }
  /* el viento */
  const vx = BA.viento*900;
  texto('VIENTO', W/2-46, 118, 13, '#8ecbff');
  ctx.strokeStyle='#8ecbff'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(W/2, 128); ctx.lineTo(W/2+vx, 128);
  ctx.lineTo(W/2+vx-Math.sign(vx)*8, 122); ctx.moveTo(W/2+vx, 128);
  ctx.lineTo(W/2+vx-Math.sign(vx)*8, 134); ctx.stroke();
  if (BA.msgT>0) texto(BA.msg2, W/2, 180, 30, '#ffe36e', true);
  hudMJ('🍌 BANANAS', etiquetaNivel('bananas')+'  TÚ '+BA.aciertos[0]+' - '+BA.aciertos[1]+' FRAN  (a '+BA.meta+')  '+corazonesInf(BA),
        'B lanza');
  barraPoder(BA.turno===0 ? '🍌 ¡TE TOCA! ángulo y fuerza' : '💨 tira tío Fran...', BA.aciertos[0]/BA.meta, BA.turno===0);
}

/* ============================================================
   28) FERNANDO 3D  (primera persona, estilo Quake / Wolfenstein)
   ============================================================ */
const MAPA_3D = [
  '###################',
  '#........#........#',
  '#.##.###.#.###.##.#',
  '#.#............#..#',
  '#.#.##.#####.#.##.#',
  '#...#...#...#....##',
  '##..###.#.###...###',
  '#........#........#',
  '#.##.###...###.##.#',
  '#.................#',
  '###################',
];
const Q3 = { x:0, y:0, ang:0, mapa:[], bichos:[], balas:[], quedan:0, t:0, sustos:0, inv:0,
             dispPrev:false, metralla:0, metCd:0, metPrev:false, amigo:null, meneo:0 };
const Q3W = 19, Q3H = 11, Q3PASO = 4, MET_CD = 420;
const q3Muro = (cx,cy) => (cx<0||cy<0||cx>=Q3W||cy>=Q3H) ? true : Q3.mapa[cy][cx]==='#';
function iniciarQuake(){
  const N = nivelDe('quake');
  Q3.mapa = MAPA_3D.map(f=>f.split(''));
  Q3.x = 1.5; Q3.y = 1.5; Q3.ang = 0; Q3.balas = []; Q3.t = 0; Q3.sustos = 0; Q3.inv = 0;
  Q3.dispPrev = false; Q3.metralla = 0; Q3.metCd = 0; Q3.metPrev = false; Q3.meneo = 0;
  Q3.bichos = [];
  const sitios = [[9,1],[17,1],[3,5],[15,5],[9,9],[1,9],[13,3],[5,7],[17,9],[11,7]];
  for(let i=0;i<Math.min(sitios.length, 3+N); i++){
    const s = sitios[i];
    if (q3Muro(s[0], s[1])) continue;
    Q3.bichos.push({x:s[0]+0.5, y:s[1]+0.5, vida:1+Math.floor(N/2), vivo:true, cd: 60+i*25});
  }
  Q3.quedan = Q3.bichos.length;
  /* el amigo espera en un rincón del laberinto */
  const rin = [[17,1],[1,9],[17,9],[9,1],[1,1],[9,9]][(N-1)%6];
  Q3.amigo = nuevoRescate('quake', 0, 0);
  Q3.amigo.cx = rin[0]+0.5; Q3.amigo.cy = rin[1]+0.5;
  aviso('¡Primera persona! ←→ giras · ▲▼ andas · B dispara · A = metralleta', 4.4);
}
function updateQuake(){
  Q3.t++;
  const N = nivelDe('quake');
  if (Q3.inv>0) Q3.inv--;
  if (Q3.metralla>0) Q3.metralla--;
  if (Q3.metCd>0) Q3.metCd--;
  if (mIzq()) Q3.ang -= 0.052;
  if (mDer()) Q3.ang += 0.052;
  let av = 0;
  if (mArr()) av = 0.072;
  if (mAbj()) av = -0.055;
  if (av){
    Q3.meneo += 0.22;
    const nx = Q3.x + Math.cos(Q3.ang)*av, ny = Q3.y + Math.sin(Q3.ang)*av;
    if (!q3Muro(Math.floor(nx), Math.floor(Q3.y))) Q3.x = nx;
    if (!q3Muro(Math.floor(Q3.x), Math.floor(ny))) Q3.y = ny;
  }
  /* PODER: la metralleta dispara sola y muy seguido */
  if (mSalta() && !Q3.metPrev && Q3.metCd<=0){
    Q3.metralla = 300; Q3.metCd = MET_CD; sfx.poder();
    aviso('🔫 ¡METRALLETA PICHUNGUITO!', 2);
  }
  Q3.metPrev = mSalta();
  const dispara = (mAccion() && !Q3.dispPrev) || (Q3.metralla>0 && Q3.t % 6 === 0);
  if (dispara){
    Q3.balas.push({x:Q3.x, y:Q3.y, dx:Math.cos(Q3.ang)*0.24, dy:Math.sin(Q3.ang)*0.24, t:60});
    sfx.fuego();
  }
  Q3.dispPrev = mAccion();
  for(const b of Q3.balas){
    b.x += b.dx; b.y += b.dy; b.t--;
    if (q3Muro(Math.floor(b.x), Math.floor(b.y))) b.t = 0;
    for(const e of Q3.bichos){
      if (!e.vivo || b.t<=0) continue;
      if (Math.hypot(e.x-b.x, e.y-b.y) < 0.4){
        b.t = 0; e.vida--;
        if (e.vida<=0){ e.vivo = false; Q3.quedan--; sumar(400); sfx.pisoton(); }
      }
    }
  }
  Q3.balas = Q3.balas.filter(b=>b.t>0);
  /* los goombas se acercan */
  for(const e of Q3.bichos){
    if (!e.vivo) continue;
    const dx = Q3.x-e.x, dy = Q3.y-e.y, d = Math.hypot(dx,dy) || 1;
    if (d < 9){
      const v = 0.016 + N*0.0022;
      const nx = e.x + dx/d*v, ny = e.y + dy/d*v;
      if (!q3Muro(Math.floor(nx), Math.floor(e.y))) e.x = nx;
      if (!q3Muro(Math.floor(e.x), Math.floor(ny))) e.y = ny;
    }
    if (d < 0.55 && Q3.inv<=0){
      Q3.inv = 100;
      Q3.x -= dx/d*0.8; Q3.y -= dy/d*0.8;
      susto(Q3, '¡Te alcanzó! Vidas infinitas: sigue');
    }
  }
  if (!Q3.amigo.salvado && Math.hypot(Q3.x-Q3.amigo.cx, Q3.y-Q3.amigo.cy) < 0.8){
    Q3.amigo.x = 0; Q3.amigo.y = 0;
    rescatar(Q3.amigo, 0, 0, 9999);
  }
  if (Q3.quedan <= 0) pasarNivel('quake', iniciarQuake, 'finQuake', VOZ.gane);
}
function drawQuake(){
  /* cielo y suelo */
  const g = ctx.createLinearGradient(0,HUD2,0,H/2);
  g.addColorStop(0,'#101a3a'); g.addColorStop(1,'#28305a');
  ctx.fillStyle=g; ctx.fillRect(0,HUD2,W,H/2-HUD2);
  const g2 = ctx.createLinearGradient(0,H/2,0,H);
  g2.addColorStop(0,'#2a2018'); g2.addColorStop(1,'#4a3a28');
  ctx.fillStyle=g2; ctx.fillRect(0,H/2,W,H/2);
  const bob = Math.sin(Q3.meneo)*5;
  const zbuf = [];
  /* trazado de rayos: una franja cada Q3PASO píxeles */
  for(let sx=0; sx<W; sx+=Q3PASO){
    const camX = 2*sx/W - 1;
    const rdx = Math.cos(Q3.ang) + Math.cos(Q3.ang+Math.PI/2)*camX*0.66;
    const rdy = Math.sin(Q3.ang) + Math.sin(Q3.ang+Math.PI/2)*camX*0.66;
    let mx = Math.floor(Q3.x), my = Math.floor(Q3.y);
    const ddx = Math.abs(1/(rdx||1e-6)), ddy = Math.abs(1/(rdy||1e-6));
    let pasoX, pasoY, ladoX, ladoY;
    if (rdx < 0){ pasoX = -1; ladoX = (Q3.x-mx)*ddx; } else { pasoX = 1; ladoX = (mx+1-Q3.x)*ddx; }
    if (rdy < 0){ pasoY = -1; ladoY = (Q3.y-my)*ddy; } else { pasoY = 1; ladoY = (my+1-Q3.y)*ddy; }
    let lado = 0, pasos = 0;
    while (pasos++ < 60){
      if (ladoX < ladoY){ ladoX += ddx; mx += pasoX; lado = 0; }
      else { ladoY += ddy; my += pasoY; lado = 1; }
      if (q3Muro(mx,my)) break;
    }
    const dist = lado===0 ? (mx-Q3.x+(1-pasoX)/2)/(rdx||1e-6) : (my-Q3.y+(1-pasoY)/2)/(rdy||1e-6);
    zbuf.push(dist);
    const alt = Math.min(H*3, (H-HUD2)/Math.max(0.12, dist));
    const y0 = (H+HUD2)/2 - alt/2 + bob;
    /* muros de ladrillo: color cálido para que se distingan bien del cielo azul */
    const som = Math.max(0.5, Math.min(1, 3.4/Math.max(0.7, dist)));
    const base = lado ? [214,124,86] : [168,84,64];
    ctx.fillStyle = 'rgb('+Math.round(base[0]*som)+','+Math.round(base[1]*som)+','+Math.round(base[2]*som)+')';
    ctx.fillRect(sx, Math.max(HUD2, y0), Q3PASO, Math.min(H-y0, alt));
  }
  /* goombas y el amigo, dibujados como estampas ordenadas de lejos a cerca */
  const cosas = Q3.bichos.filter(e=>e.vivo).map(e=>({x:e.x, y:e.y, tipo:'goomba'}));
  if (!Q3.amigo.salvado) cosas.push({x:Q3.amigo.cx, y:Q3.amigo.cy, tipo:'amigo'});
  const co = Math.cos(Q3.ang), si = Math.sin(Q3.ang);
  cosas.map(c=>{
    const rx = c.x-Q3.x, ry = c.y-Q3.y;
    return {c, prof: rx*co + ry*si, lat: -rx*si + ry*co};
  }).filter(o=>o.prof > 0.25)
    .sort((a,b)=>b.prof-a.prof)
    .forEach(o=>{
      const sx = W/2 + (o.lat/o.prof)*(W/2)/0.66;
      const alt = (H-HUD2)/o.prof;
      const sy = (H+HUD2)/2 + bob + alt*0.18;
      if (sx < -80 || sx > W+80) return;
      const col = Math.max(0, Math.min(zbuf.length-1, Math.round(sx/Q3PASO)));
      if (zbuf[col] !== undefined && zbuf[col] < o.prof) return;   /* tapado por un muro */
      const esc = alt/90;
      ctx.save(); ctx.translate(sx, sy); ctx.scale(esc, esc);
      if (o.c.tipo==='goomba') dibGoomba(-13, -26, T);
      else { Q3.amigo.a.dib(-13, -46, T); }
      ctx.restore();
      if (o.c.tipo==='amigo' && esc > 0.4) letrero(sx, sy-52*esc, Q3.amigo.a.nombre, '#ffe36e');
    });
  /* el arma en primera persona */
  const rec = (Q3.metralla>0 && Q3.t%6<3) ? 8 : 0;
  ctx.save(); ctx.translate(W/2 + Math.sin(Q3.meneo)*8, H - 10 + rec + bob*0.4);
  ctx.fillStyle='#3a3a44';
  ctx.beginPath(); ctx.moveTo(-70, 60); ctx.lineTo(-26, -46); ctx.lineTo(26, -46); ctx.lineTo(70, 60); ctx.fill();
  rect(-14, -74, 28, 30, '#5a5a6a');
  rect(-8, -84, 16, 12, '#8a8a9a');
  if (rec){ ctx.fillStyle=(Q3.t>>1)%2 ? '#ffe36e' : '#ff8a20';
    ctx.beginPath(); ctx.arc(0, -92, 20, 0, Math.PI*2); ctx.fill(); }
  ctx.restore();
  /* mirilla */
  ctx.strokeStyle='rgba(255,255,255,0.85)'; ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(W/2-14, H/2); ctx.lineTo(W/2-5, H/2);
  ctx.moveTo(W/2+5, H/2); ctx.lineTo(W/2+14, H/2);
  ctx.moveTo(W/2, H/2-14); ctx.lineTo(W/2, H/2-5);
  ctx.moveTo(W/2, H/2+5); ctx.lineTo(W/2, H/2+14);
  ctx.stroke();
  /* minimapa */
  const mm = 5, mx0 = W-Q3W*mm-16, my0 = 54;
  ctx.globalAlpha = 0.75;
  for(let y=0;y<Q3H;y++) for(let x=0;x<Q3W;x++)
    rect(mx0+x*mm, my0+y*mm, mm-1, mm-1, q3Muro(x,y) ? '#8ecbff' : '#12203a');
  for(const e of Q3.bichos) if (e.vivo) rect(mx0+e.x*mm-1, my0+e.y*mm-1, 3, 3, '#e03434');
  if (!Q3.amigo.salvado) rect(mx0+Q3.amigo.cx*mm-1, my0+Q3.amigo.cy*mm-1, 3, 3, '#ffe36e');
  rect(mx0+Q3.x*mm-1, my0+Q3.y*mm-1, 3, 3, '#5ee08a');
  ctx.globalAlpha = 1;
  hudMJ('🧱 FERNANDO 3D', etiquetaNivel('quake')+'  👾'+Q3.quedan+'  '+corazonesInf(Q3), '▲▼ andas · ←→ giras');
  barraPoder(Q3.metralla>0 ? '🔫 ¡METRALLETA!' : (Q3.metCd<=0 ? '🔫 METRALLETA (A)' : '🔫 recargando...'),
             Q3.metralla>0 ? Q3.metralla/300 : 1-Q3.metCd/MET_CD, Q3.metralla>0);
}

/* ============================================================
   Sala arcade y orquestación
   ============================================================ */
function cajasArcade(){
  const anc = 125, alt = 86, hx = 8, hy = 9, x0 = 22, y0 = 104;
  return JUEGOS.map((j,i)=>({
    x: x0 + (i%COLS_ARCADE)*(anc+hx),
    y: y0 + ((i/COLS_ARCADE)|0)*(alt+hy),
    w: anc, h: alt, idx:i, j }));
}
function drawArcade(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#1a0a3a'); g.addColorStop(1,'#4a1a6a');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<40;i++){
    ctx.fillStyle='rgba(255,255,255,'+(0.05+Math.sin(T/22+i)*0.05)+')';
    ctx.fillRect((i*137)%W, (i*89)%H, 3, 3);
  }
  texto('🕹️ SALA ARCADE 🕹️', W/2, 56, 32, '#ff9ed6', true);
  texto('Los minijuegos de Fernando y sus amigos', W/2, 82, 14, '#dfc8ff', true);
  for(const c of cajasArcade()){
    const s = sel===c.idx;
    ctx.fillStyle = c.j.color;
    ctx.beginPath(); ctx.roundRect(c.x, c.y, c.w, c.h, 16); ctx.fill();
    ctx.lineWidth = s?6:3; ctx.strokeStyle = s ? '#ffe36e' : 'rgba(255,255,255,0.45)';
    ctx.stroke();
    if (s){ ctx.globalAlpha=0.3+Math.sin(T/7)*0.22; ctx.lineWidth=12; ctx.stroke(); ctx.globalAlpha=1; }
    /* con 28 juegos la tarjeta es solo dibujo y nombre: la explicación va abajo,
       en una barra grande que se lee de verdad */
    ctx.font='34px monospace'; ctx.textAlign='center';
    ctx.fillText(c.j.emoji, c.x+c.w/2, c.y+46);
    let tam = 13;
    ctx.font = 'bold '+tam+'px monospace';
    while (tam > 8 && ctx.measureText(c.j.corto).width > c.w-12){ tam -= 0.5; ctx.font='bold '+tam+'px monospace'; }
    texto(c.j.corto, c.x+c.w/2, c.y+70, tam, '#fff', true);
    ctx.textAlign='left';
  }
  /* botón para volver: sin él, en el celular no había manera de salir de la sala */
  const z = {x:22, y:12, w:148, h:40};
  ctx.fillStyle='rgba(255,255,255,0.18)';
  ctx.beginPath(); ctx.roundRect(z.x, z.y, z.w, z.h, 12); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=2; ctx.stroke();
  texto('✕ VOLVER', z.x+z.w/2, z.y+27, 17, '#fff', true);
  /* barra con la explicación del juego marcado */
  const j = JUEGOS[sel] || JUEGOS[0];
  ctx.fillStyle='rgba(8,10,24,0.8)';
  ctx.beginPath(); ctx.roundRect(22, H-62, W-44, 40, 10); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=2; ctx.stroke();
  texto(j.emoji+'  '+j.nombre+' — '+j.desc, W/2, H-36, 16, '#ffe36e', true);
  texto('Toca un juego · flechas + ENTER · ESC o ✕ VOLVER para salir', W/2, H-8, 13, '#dfc8ff', true);
}
function abrirArcade(){ estado = 'arcade'; modo = null; sel = 0; finDicho = false; }
function empezar(id){
  resultado = 0; puntosMJ = 0; parts.length = 0; nivel[id] = 1; finDicho = false;
  hablar(VOZ.ataque);
  if (id==='birds'){ iniciarBirds(); modo='birds'; estado='mjBirds'; }
  else if (id==='dig'){ iniciarDig(); modo='dig'; estado='mjDig'; }
  else if (id==='kong'){ iniciarKong(); modo='kong'; estado='mjKong'; }
  else if (id==='contra'){ iniciarContra(); modo='contra'; estado='mjContra'; }
  else if (id==='globos'){ iniciarGlobos(); modo='globos'; estado='mjGlobos'; }
  else if (id==='bomba'){ iniciarBombas(); modo='bomba'; estado='mjBombas'; }
  else if (id==='hielo'){ iniciarHielo(); modo='hielo'; estado='mjHielo'; }
  else if (id==='torre'){ iniciarTorre(); modo='torre'; estado='mjTorre'; }
  else if (id==='nieve'){ iniciarNieve(); modo='nieve'; estado='mjNieve'; }
  else if (id==='luna'){ iniciarLuna(); modo='luna'; estado='mjLuna'; }
  else if (id==='corre'){ iniciarRunner(); modo='corre'; estado='mjRunner'; }
  else if (id==='flappy'){ iniciarFlappy(); modo='flappy'; estado='mjFlappy'; }
  else if (id==='coco'){ iniciarCoco(); modo='coco'; estado='mjCoco'; }
  else if (id==='mega'){ iniciarMega(); modo='mega'; estado='mjMega'; }
  else if (id==='burger'){ iniciarBurger(); modo='burger'; estado='mjBurger'; }
  else if (id==='survivor'){ iniciarSuper(); modo='survivor'; estado='mjSuper'; }
  else if (id==='jeep'){ iniciarJeep(); modo='jeep'; estado='mjJeep'; }
  else if (id==='mappy'){ iniciarMappy(); modo='mappy'; estado='mjMappy'; }
  else if (id==='circo'){ iniciarCirco(); modo='circo'; estado='mjCirco'; }
  else if (id==='patos'){ iniciarPatos(); modo='patos'; estado='mjPatos'; }
  else if (id==='isla'){ iniciarIsla(); modo='isla'; estado='mjIsla'; }
  else if (id==='galaxia'){ iniciarGalaxia(); modo='galaxia'; estado='mjGalaxia'; }
  else if (id==='lucha'){ iniciarLucha(); modo='lucha'; estado='mjLucha'; }
  else if (id==='vagoneta'){ iniciarVagoneta(); modo='vagoneta'; estado='mjVagoneta'; }
  else if (id==='jam'){ iniciarJam(); modo='jam'; estado='mjJam'; }
  else if (id==='fcero'){ iniciarFcero(); modo='fcero'; estado='mjFcero'; }
  else if (id==='bananas'){ iniciarBananas(); modo='bananas'; estado='mjBananas'; }
  else if (id==='quake'){ iniciarQuake(); modo='quake'; estado='mjQuake'; }
  cortina = 40;
}
function activo(){ return estado==='arcade' || (typeof estado==='string' && estado.indexOf('mj')===0); }
function update(){
  T++;
  if (msgT>0) msgT--;
  actualizarExtras();
  if (estado==='arcade'){
    if (pt.soltado){
      pt.soltado = false;
      /* volver al selector de mundos (y de ahí al menú principal) */
      if (enZona(zonaVolver(), pt.x, pt.y)){ estado='mapa'; return; }
      /* toque en las tarjetas */
      for(const c of cajasArcade())
        if (pt.x>=c.x && pt.x<=c.x+c.w && pt.y>=c.y && pt.y<=c.y+c.h){ sel=c.idx; empezar(c.j.id); break; }
    }
    return;
  }
  if (modo==='birds') updateBirds();
  else if (modo==='dig') updateDig();
  else if (modo==='kong') updateKong();
  else if (modo==='contra') updateContra();
  else if (modo==='globos') updateGlobos();
  else if (modo==='bomba') updateBombas();
  else if (modo==='hielo') updateHielo();
  else if (modo==='torre') updateTorre();
  else if (modo==='nieve') updateNieve();
  else if (modo==='luna') updateLuna();
  else if (modo==='corre') updateRunner();
  else if (modo==='flappy') updateFlappy();
  else if (modo==='coco') updateCoco();
  else if (modo==='mega') updateMega();
  else if (modo==='burger') updateBurger();
  else if (modo==='survivor') updateSuper();
  else if (modo==='jeep') updateJeep();
  else if (modo==='mappy') updateMappy();
  else if (modo==='circo') updateCirco();
  else if (modo==='patos') updatePatos();
  else if (modo==='isla') updateIsla();
  else if (modo==='galaxia') updateGalaxia();
  else if (modo==='lucha') updateLucha();
  else if (modo==='vagoneta') updateVagoneta();
  else if (modo==='jam') updateJam();
  else if (modo==='fcero') updateFcero();
  else if (modo==='bananas') updateBananas();
  else if (modo==='quake') updateQuake();
  else if (modo && modo.indexOf('fin')===0){
    if (pt.soltado){ pt.soltado=false; abrirArcade(); }
  }
  /* salir tocando el botón SALIR del marcador */
  if (pt.soltado && modo && modo.indexOf('fin')!==0){
    if (enZona(zonaSalir(), pt.x, pt.y)){ pt.soltado=false; abrirArcade(); return; }
  }
}
function draw(){
  if (estado==='arcade'){ drawArcade(); dibFXFinales(); return; }
  if (modo==='birds') drawBirds();
  else if (modo==='dig') drawDig();
  else if (modo==='kong') drawKong();
  else if (modo==='contra') drawContra();
  else if (modo==='globos') drawGlobos();
  else if (modo==='bomba') drawBombas();
  else if (modo==='hielo') drawHielo();
  else if (modo==='torre') drawTorre();
  else if (modo==='nieve') drawNieve();
  else if (modo==='luna') drawLuna();
  else if (modo==='corre') drawRunner();
  else if (modo==='flappy') drawFlappy();
  else if (modo==='coco') drawCoco();
  else if (modo==='mega') drawMega();
  else if (modo==='burger') drawBurger();
  else if (modo==='survivor') drawSuper();
  else if (modo==='jeep') drawJeep();
  else if (modo==='mappy') drawMappy();
  else if (modo==='circo') drawCirco();
  else if (modo==='patos') drawPatos();
  else if (modo==='isla') drawIsla();
  else if (modo==='galaxia') drawGalaxia();
  else if (modo==='lucha') drawLucha();
  else if (modo==='vagoneta') drawVagoneta();
  else if (modo==='jam') drawJam();
  else if (modo==='fcero') drawFcero();
  else if (modo==='bananas') drawBananas();
  else if (modo==='quake') drawQuake();
  else if (modo==='finBirds') pantallaFin(resultado, resultado?'¡GANASTE!':'CASI...', resultado?'¡Todos los goombas fuera!':'Se acabaron los lanzamientos');
  else if (modo==='finDig') pantallaFin(resultado, resultado?'¡GANASTE!':'¡TE ATRAPARON!', resultado?'¡Túneles limpios!':'Inténtalo otra vez, pichunguito');
  else if (modo==='finKong') pantallaFin(resultado, resultado?'¡RESCATASTE A MAMÁ!':'¡UN BARRIL!', resultado?'«¡Te amo mamá!»':'Sube con más cuidado');
  else if (modo==='finContra') pantallaFin(resultado, resultado?'¡JEFE DERROTADO!':'SIN CORAZONES', resultado?'¡Eres el pichunguito campeón!':'Vuelve a intentarlo');
  else if (modo==='finGlobos') pantallaFin(resultado, resultado?'¡GANASTE!':'¡AL AGUA!', resultado?'¡Todos los koopas al mar!':'Se te acabaron los globos');
  else if (modo==='finBombas') pantallaFin(resultado, resultado?'¡GANASTE!':'¡BOOM!', resultado?'¡Laberinto despejado!':'Cuidado con tus propias bombas');
  else if (modo==='finHielo') pantallaFin(resultado, resultado?'¡LLEGASTE A CUCÚ!':'¡TE CAÍSTE!', resultado?'«¡Hola Cucú, acompáñame!»':'Sube con más cuidado');
  else if (modo==='finTorre') pantallaFin(resultado, '¡CASA DEFENDIDA!', '¡Ni un goomba se coló hasta el final!');
  else if (modo==='finNieve') pantallaFin(resultado, '¡LLEGASTE ABAJO!', '¡Qué manera de bajar, pichunguito!');
  else if (modo==='finLuna') pantallaFin(resultado, '¡ALUNIZAJE PERFECTO!', '¡Fernando astronauta!');
  else if (modo==='finRunner') pantallaFin(resultado, '¡QUÉ CARRERA!', '¡Nadie corre como el pichunguito!');
  else if (modo==='finFlappy') pantallaFin(resultado, '¡TODOS LOS TUBOS!', '¡Fernando vuela como un pajarito!');
  else if (modo==='finCoco') pantallaFin(resultado, '¡LABERINTO LIMPIO!', '¡Ni una hamburguesa quedó!');
  else if (modo==='finMega') pantallaFin(resultado, '¡TODOS LOS PODERES!', '¡Le robaste el poder a todos los jefes!');
  else if (modo==='finBurger') pantallaFin(resultado, '¡HAMBURGUESAS LISTAS!', '¡Tío Juan estaría orgulloso!');
  else if (modo==='finSuper') pantallaFin(resultado, '¡SOBREVIVISTE!', '¡Ni una horda pudo con el pichunguito!');
  else if (modo==='finJeep') pantallaFin(resultado, '¡TODOS RESCATADOS!', '¡Al helicóptero, pichunguitos!');
  else if (modo==='finMappy') pantallaFin(resultado, '¡TODO RECOGIDO!', '¡Ni un gato te atrapó!');
  else if (modo==='finCirco') pantallaFin(resultado, '¡GRAN FUNCIÓN!', '¡El público aplaude a Fernando!');
  else if (modo==='finPatos') pantallaFin(resultado, '¡QUÉ PUNTERÍA!', '¡Penny ya no se ríe de ti!');
  else if (modo==='finIsla') pantallaFin(resultado, '¡ISLA CRUZADA!', '¡Y sin quedarse sin energía!');
  else if (modo==='finGalaxia') pantallaFin(resultado, '¡NAVE MADRE VENCIDA!', '¡Fernando salvó la galaxia!');
  else if (modo==='finLucha') pantallaFin(resultado, '¡CAMPEÓN!', '¡Nadie puede con el pichunguito!');
  else if (modo==='finVagoneta') pantallaFin(resultado, '¡QUÉ VIAJE!', '¡Sheldon pide otra vuelta!');
  else if (modo==='finJam') pantallaFin(resultado, '¡PARTIDO GANADO!', '¡Fernando y tío Juan, campeones!');
  else if (modo==='finFcero') pantallaFin(resultado, '¡PRIMER PUESTO!', '¡Nadie corre como Fernando!');
  else if (modo==='finBananas') pantallaFin(resultado, '¡LE DISTE A TÍO FRAN!', '¡Qué puntería, pichunguito!');
  else if (modo==='finQuake') pantallaFin(resultado, '¡LABERINTO LIMPIO!', '¡Ni un goomba quedó dentro!');
  /* partículas compartidas */
  for(const p of parts){
    if (p.tipo==='estrellita'){ ctx.fillStyle='#ffe36e'; ctx.font='16px monospace'; ctx.fillText('✦',p.x,p.y); }
    else if (p.tipo==='ladrillo'){ ctx.fillStyle='#c88a3a'; ctx.fillRect(p.x,p.y,9,7); }
    else if (p.tipo==='pedo'){
      ctx.fillStyle='rgba(140,225,100,'+Math.min(0.6, p.t/70)+')';
      ctx.beginPath(); ctx.arc(p.x, p.y, 6+ (60-Math.min(60,p.t))*0.22, 0, Math.PI*2); ctx.fill();
    }
    else if (p.tipo==='cascara'){ ctx.fillStyle='#dff2fb'; ctx.fillRect(p.x,p.y,7,7); }
    else if (p.tipo==='polvo'){ ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.fillRect(p.x,p.y,4,4); }
  }
  if (msgT>0){
    const a = Math.min(1, msgT/30);
    ctx.globalAlpha = a;
    ctx.fillStyle='rgba(0,0,0,0.65)';
    ctx.font='bold 20px monospace';
    const w2 = ctx.measureText(msg).width;
    ctx.beginPath(); ctx.roundRect(W/2-w2/2-16, H-92, w2+32, 40, 10); ctx.fill();
    texto(msg, W/2, H-64, 20, '#ffe36e', true);
    ctx.globalAlpha = 1;
  }
  dibFXFinales();
}
function tecla(k){
  if (estado==='arcade'){
    if (k==='ArrowLeft') sel = (sel+JUEGOS.length-1)%JUEGOS.length;
    else if (k==='ArrowRight') sel = (sel+1)%JUEGOS.length;
    else if (k==='ArrowUp') sel = (sel+JUEGOS.length-COLS_ARCADE)%JUEGOS.length;
    else if (k==='ArrowDown') sel = (sel+COLS_ARCADE)%JUEGOS.length;
    else if (k==='Enter'||k===' ') empezar(JUEGOS[sel].id);
    else if (k==='Escape') estado='mapa';
    return;
  }
  if (modo && modo.indexOf('fin')===0){
    if (k==='Enter'||k===' '||k==='Escape') abrirArcade();
    return;
  }
  if (k==='Escape') abrirArcade();
}
return { activo, update, draw, tecla, abrirArcade, empezar,
         _estado: ()=>modo, _juegos: JUEGOS,
         _nivel: id=>nivelDe(id), _ponNivel: (id,n)=>{ nivel[id]=n; }, _MAXNIV: MAXNIV,
         _maxDe: maxDe, _TORRES: TORRES, _CAMINOS: CAMINOS,
         _reiniciar: id=>({birds:iniciarBirds, dig:iniciarDig, kong:iniciarKong, contra:iniciarContra,
                           globos:iniciarGlobos, bomba:iniciarBombas, hielo:iniciarHielo,
                           torre:iniciarTorre, nieve:iniciarNieve, luna:iniciarLuna,
                           corre:iniciarRunner, flappy:iniciarFlappy, coco:iniciarCoco,
                           mega:iniciarMega, burger:iniciarBurger, survivor:iniciarSuper,
                           jeep:iniciarJeep, mappy:iniciarMappy, circo:iniciarCirco,
                           patos:iniciarPatos, isla:iniciarIsla, galaxia:iniciarGalaxia,
                           lucha:iniciarLucha, vagoneta:iniciarVagoneta, jam:iniciarJam,
                           fcero:iniciarFcero, bananas:iniciarBananas, quake:iniciarQuake}[id])(),
         _TD:TD, _SN:SN, _LU:LU, _RU:RU, _FL:FL, _CO:CO,
         _MG:MG, _BU:BU, _SU:SU, _JP:JP, _MP:MP, _CI:CI, _ARMAS:ARMAS,
         _PA:PA, _IS:IS, _GX:GX, _LU2:LU2, _VG:VG, _JM:JM, _FZ:FZ, _BA:BA, _Q3:Q3,
         _amigos: AMIGOS,
         _zonaSalir: zonaSalir, _zonaVolver: zonaVolver,
         _B:B, _D:D, _K:K, _C:C, _KPL:KPL, _KESC:KESC, _G:G, _M:M, _I:I,
         _MW:MW, _MH:MH, _IPISOS:IPISOS, _DY0:DY0, _DC:DC, _MX0:MX0, _MY0:MY0, _MC:MC, _IC2:IC2 };
})();
