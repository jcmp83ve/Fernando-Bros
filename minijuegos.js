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
];
const COLS_ARCADE = 5;
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
const nivel = {};
const nivelDe = id => nivel[id] || 1;
function pasarNivel(id, iniciar, finModo, frase){
  if (nivelDe(id) < MAXNIV){
    nivel[id] = nivelDe(id) + 1;
    sumar(1000); sfx.meta();
    hablar(VOZ.campeon);
    iniciar();
    aviso('🏅 ¡NIVEL '+nivel[id]+' DE '+MAXNIV+'! Ahora un poquito más difícil', 2.6);
    cortina = 34;
  } else {
    resultado = 1; modo = finModo; sfx.meta();
    if (frase) hablar(frase);
  }
}
const etiquetaNivel = id => 'NIV '+nivelDe(id)+'/'+MAXNIV;

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
                 mega:10, burger:14, survivor:15, jeep:5, mappy:2, circo:9};
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
             t:0, sustos:0, pedoCd:0, pedoPrev:false, ponPrev:false, camPrev:false, amigo:null, bajas:0 };
const TC = 60, TW = 15, TH = 7, TX0 = 30, TY0 = 74, PEDO_TD = 420;
/* el caminito que recorren los goombas, en casillas */
const CAMINO = [[0,1],[1,1],[2,1],[3,1],[4,1],[4,2],[4,3],[4,4],[5,4],[6,4],[7,4],
                [7,3],[7,2],[7,1],[8,1],[9,1],[10,1],[10,2],[10,3],[10,4],[10,5],
                [11,5],[12,5],[13,5],[14,5]];
const enCamino = (cx,cy) => CAMINO.some(c=>c[0]===cx && c[1]===cy);
const TORRES = [
  {id:'penny',   nombre:'PENNY',    coste:2, alcance:150, dano:1, cd:26, color:'#222'},
  {id:'sheldon', nombre:'SHELDON',  coste:3, alcance:120, dano:3, cd:54, color:'#8a5a2a'},
  {id:'tiojuan', nombre:'TÍO JUAN', coste:5, alcance:235, dano:2, cd:40, color:'#2a6ad0'},
];
const celPix = (cx,cy) => ({x: TX0 + cx*TC + TC/2, y: TY0 + cy*TC + TC/2});
function iniciarTorre(){
  const N = nivelDe('torre');
  TD.torres = []; TD.enem = []; TD.t = 0; TD.sustos = 0; TD.bajas = 0;
  TD.cx = 2; TD.cy = 3; TD.tipo = 0;
  TD.monedas = 5 + N;
  TD.oleada = 0; TD.restan = 0; TD.spawn = 40;
  TD.oleadas = 2 + N;                       /* de 3 a 8 oleadas */
  TD.pedoCd = 0; TD.pedoPrev = false; TD.ponPrev = false; TD.camPrev = false;
  const casa = celPix(14,5);
  TD.amigo = nuevoRescate('torre', casa.x-13, casa.y-46);
  TD.amigo.salvado = true;                  /* aquí no se rescata: se DEFIENDE */
  aviso('¡Defiende a '+TD.amigo.a.nombre+'! Flechas mueven · A pone · B cambia', 4.2);
}
function ponerTorre(){
  const t = TORRES[TD.tipo];
  if (TD.monedas < t.coste){ aviso('Te faltan monedas para '+t.nombre, 1.4); sfx.dano(); return; }
  if (enCamino(TD.cx, TD.cy)){ aviso('Ahí pasan los goombas', 1.4); sfx.dano(); return; }
  if (TD.torres.some(o=>o.cx===TD.cx && o.cy===TD.cy)){ aviso('Ya hay alguien ahí', 1.4); return; }
  TD.monedas -= t.coste;
  TD.torres.push({cx:TD.cx, cy:TD.cy, t:TD.tipo, cd:0, tiro:0, blanco:null});
  sfx.poder(); sacudir(2);
  hablar(t.id==='tiojuan' ? VOZ.tioJuan : VOZ.vamos);
  aviso('¡'+t.nombre+' a defender!', 1.4);
}
function posEnem(e){
  const a = CAMINO[Math.min(e.i, CAMINO.length-1)], b = CAMINO[Math.min(e.i+1, CAMINO.length-1)];
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
  /* B: cambia de defensor, o suelta el pedo si se mantiene */
  if (mAccion() && !TD.camPrev){ TD.tipo = (TD.tipo+1) % TORRES.length; sfx.huevo(); }
  TD.camPrev = mAccion();
  /* PODER: el pedo de tío Fran daña a todos los goombas del mapa */
  if (TD.pedoCd>0) TD.pedoCd--;
  if (mArr() && mAccion() && TD.pedoCd<=0){
    TD.pedoCd = PEDO_TD; sfx.pedo(); sacudir(7);
    aviso('💨 ¡PEDO DE TÍO FRAN EN TODO EL CAMPO!', 2.2);
    hablar(VOZ.pedo);
    for(const e of TD.enem){ e.vida -= 3; const p = posEnem(e); nubePedo(p.x, p.y, 6); }
  }
  /* oleadas */
  if (TD.restan<=0 && TD.enem.length===0 && TD.oleada < TD.oleadas && TD.spawn<=0){
    TD.oleada++;
    TD.restan = 4 + N + TD.oleada*2;
    aviso('🌊 ¡OLEADA '+TD.oleada+' DE '+TD.oleadas+'!', 2);
    sfx.heroe();
  }
  if (TD.spawn>0) TD.spawn--;
  if (TD.restan>0 && TD.spawn<=0){
    TD.restan--;
    TD.spawn = Math.max(22, 48 - N*3 - TD.oleada);
    TD.enem.push({i:0, p:0, vida:2 + N + Math.floor(TD.oleada*0.8),
                  max:2 + N + Math.floor(TD.oleada*0.8), vel:0.010 + N*0.0008 + TD.oleada*0.0004});
  }
  /* goombas por el camino */
  for(const e of TD.enem){
    e.p += e.vel;
    while (e.p >= 1){ e.p -= 1; e.i++; }
    if (e.i >= CAMINO.length-1){
      e.fuera = true;
      susto(TD, '¡Un goomba llegó a la casa! Vidas infinitas: sigue');
    }
  }
  TD.enem = TD.enem.filter(e=>{
    if (e.fuera) return false;
    if (e.vida<=0){
      const p = posEnem(e);
      sumar(250); sfx.pisoton();
      for(let i=0;i<6;i++) parts.push({tipo:'estrellita', x:p.x, y:p.y, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*3, t:30});
      if (++TD.bajas % 4 === 0){ TD.monedas++; aviso('🪙 ¡Una moneda más!', 1.2); }
      return false;
    }
    return true;
  });
  /* las torres disparan al goomba más adelantado que tengan a tiro */
  for(const to of TD.torres){
    const d = TORRES[to.t];
    if (to.cd>0) to.cd--;
    if (to.tiro>0) to.tiro--;
    const c = celPix(to.cx, to.cy);
    let mejor = null, mejorAvance = -1;
    for(const e of TD.enem){
      const p = posEnem(e);
      if (Math.hypot(p.x-c.x, p.y-c.y) > d.alcance) continue;
      const avance = e.i + e.p;
      if (avance > mejorAvance){ mejorAvance = avance; mejor = e; }
    }
    to.blanco = mejor ? posEnem(mejor) : null;
    if (mejor && to.cd<=0){
      to.cd = d.cd; to.tiro = 7;
      mejor.vida -= d.dano;
      sfx.fuego();
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
  for(const [cx,cy] of CAMINO){
    rect(TX0+cx*TC, TY0+cy*TC, TC, TC, '#b08a50');
    rect(TX0+cx*TC, TY0+cy*TC, TC, 5, '#c8a068');
  }
  /* la casa que hay que defender, con el amigo dentro */
  const casa = celPix(14,5);
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
    if (d.id==='tiojuan') dibTioJuan(c.x-14, c.y-30, T);
    else { ctx.save(); ctx.translate(c.x-13, c.y-8); dibPerroSolo(d.color); ctx.restore(); }
    if (to.tiro>0 && to.blanco){
      ctx.strokeStyle='#ffe36e'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(c.x, c.y-6); ctx.lineTo(to.blanco.x, to.blanco.y); ctx.stroke();
    }
  }
  /* goombas */
  for(const e of TD.enem){
    const p = posEnem(e);
    sombra(p.x, p.y+14, 13);
    dibGoomba(p.x-13, p.y-12, T);
    rect(p.x-15, p.y-24, 30, 5, '#3a0a0a');
    rect(p.x-15, p.y-24, 30*Math.max(0,e.vida)/e.max, 5, '#5ee08a');
  }
  /* cursor y alcance del defensor elegido */
  const c = celPix(TD.cx, TD.cy), d = TORRES[TD.tipo];
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = enCamino(TD.cx,TD.cy) ? '#ff5a5a' : '#ffe36e';
  ctx.beginPath(); ctx.arc(c.x, c.y, d.alcance, 0, Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = enCamino(TD.cx,TD.cy) ? '#ff5a5a' : '#ffe36e';
  ctx.lineWidth = 4;
  ctx.strokeRect(TX0+TD.cx*TC+3, TY0+TD.cy*TC+3, TC-6, TC-6);
  ctx.globalAlpha = 0.5;
  if (d.id==='tiojuan') dibTioJuan(c.x-14, c.y-30, T);
  else { ctx.save(); ctx.translate(c.x-13, c.y-8); dibPerroSolo(d.color); ctx.restore(); }
  ctx.globalAlpha = 1;
  hudMJ('🏰 TORRE', etiquetaNivel('torre')+'  🌊'+Math.max(1,TD.oleada)+'/'+TD.oleadas+'  🪙'+TD.monedas+'  '+corazonesInf(TD),
        'A pone · B cambia');
  texto('PONES: '+d.nombre+' (🪙'+d.coste+')', 16, H-16, 16, TD.monedas>=d.coste ? '#5ee08a' : '#ff8a8a');
  barraPoder(TD.pedoCd<=0 ? '💨 PEDO TOTAL (▲ + B)' : '💨 cargando pedo...', 1-TD.pedoCd/PEDO_TD, TD.pedoCd<=0);
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
    const tipo = ['valla','techo','tren'][(Math.random()*3)|0];
    const carril = (Math.random()*3)|0;
    RU.obs.push({carril, z:118, tipo});
    /* de vez en cuando una fila de monedas en otro carril */
    if (Math.random() < 0.55){
      const otro = (carril + 1 + ((Math.random()*2)|0)) % 3;
      for(let k=0;k<4;k++) RU.obs.push({carril:otro, z:118+k*7, tipo:'moneda'});
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
    for(let f=0; f<3; f++)
      for(let k=0; k<8; k++)
        CI.globos.push({x: 90 + k*100, y: 90 + f*60, vivo:true, color:['#e03434','#ffe36e','#5ee08a','#8ecbff'][(f+k)%4]});
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
      CI.y = CISUELO-40; CI.vy = -12.6 - N*0.25;
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
   Sala arcade y orquestación
   ============================================================ */
function cajasArcade(){
  const anc = 174, alt = 92, hx = 12, hy = 10, x0 = 20, y0 = 98;
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
    ctx.font='20px monospace'; ctx.textAlign='left';
    ctx.fillText(c.j.emoji, c.x+9, c.y+26);
    texto(c.j.corto, c.x+36, c.y+24, 13, '#fff');
    /* la descripción se parte en líneas que quepan de verdad dentro de la tarjeta */
    ctx.font = 'bold 10px monospace';
    const ancho = c.w - 20;
    const lineas = [];
    let linea = '';
    for(const palabra of c.j.desc.split(' ')){
      const prueba = linea ? linea+' '+palabra : palabra;
      if (ctx.measureText(prueba).width > ancho && linea){ lineas.push(linea); linea = palabra; }
      else linea = prueba;
      if (lineas.length===3) break;
    }
    if (linea && lineas.length<4) lineas.push(linea);
    lineas.forEach((l,i)=> texto(l, c.x+10, c.y+45+i*13, 9.5, 'rgba(255,255,255,0.85)'));
  }
  /* botón para volver: sin él, en el celular no había manera de salir de la sala */
  const z = {x:22, y:12, w:148, h:40};
  ctx.fillStyle='rgba(255,255,255,0.18)';
  ctx.beginPath(); ctx.roundRect(z.x, z.y, z.w, z.h, 12); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=2; ctx.stroke();
  texto('✕ VOLVER', z.x+z.w/2, z.y+27, 17, '#fff', true);
  texto('Toca un juego · flechas + ENTER · ESC o ✕ VOLVER para salir', W/2, H-12, 14, '#dfc8ff', true);
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
         _reiniciar: id=>({birds:iniciarBirds, dig:iniciarDig, kong:iniciarKong, contra:iniciarContra,
                           globos:iniciarGlobos, bomba:iniciarBombas, hielo:iniciarHielo,
                           torre:iniciarTorre, nieve:iniciarNieve, luna:iniciarLuna,
                           corre:iniciarRunner, flappy:iniciarFlappy, coco:iniciarCoco,
                           mega:iniciarMega, burger:iniciarBurger, survivor:iniciarSuper,
                           jeep:iniciarJeep, mappy:iniciarMappy, circo:iniciarCirco}[id])(),
         _TD:TD, _SN:SN, _LU:LU, _RU:RU, _FL:FL, _CO:CO,
         _MG:MG, _BU:BU, _SU:SU, _JP:JP, _MP:MP, _CI:CI, _ARMAS:ARMAS,
         _amigos: AMIGOS,
         _zonaSalir: zonaSalir, _zonaVolver: zonaVolver,
         _B:B, _D:D, _K:K, _C:C, _KPL:KPL, _KESC:KESC, _G:G, _M:M, _I:I,
         _MW:MW, _MH:MH, _IPISOS:IPISOS, _DY0:DY0, _DC:DC, _MX0:MX0, _MY0:MY0, _MC:MC, _IC2:IC2 };
})();
