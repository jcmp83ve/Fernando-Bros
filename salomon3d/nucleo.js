(function(raiz){
'use strict';
/* ============================================================
   SALOMÓN Y LOS PRIMOS — LA GRAN AVENTURA DEL LAGO · el NÚCLEO
   Plataformas en 3D con mundo central: la Vereda del Lago tiene
   un portal a cada uno de los 12 niveles. En cada nivel hay
   monedas, jaulas con amiguitos, barajitas escondidas y chispas
   del relámpago del Catatumbo (las chispas abren los portales).

   Este archivo no toca la pantalla: se prueba con node. La vista
   (vista.js) lo dibuja y la red (red.js) lo comparte.
   ============================================================ */

/* ---------------- constantes ---------------- */
const DT = 1/60, GRAV = 26, R = 0.38, ALTO = 1.45, CORAZONES = 3;
const clamp = (v, a, b)=>v < a ? a : v > b ? b : v;
const lerp = (a, b, t)=>a + (b - a)*t;
const envolver = a=>{ while (a > Math.PI) a -= 2*Math.PI; while (a < -Math.PI) a += 2*Math.PI; return a; };

/* los tres jugables. Alturas de salto (v²/2g): Salomón ≈ 2,0 m · el Primo ≈ 3,05 m
   (+1,5 con el doble salto) · el Mollejúo ≈ 1,85 m */
const PJS = {
  salomon: {nombre: 'Salomón', vel: 6.6, salto: 10.2, doble: 0, poder: 'pedrada', emoji: '🧒', color: '#ff6b6b'},
  primo: {nombre: 'El Primo Verde', vel: 7.0, salto: 12.6, doble: 8.8, poder: 'patada', emoji: '🟢', color: '#51cf66'},
  mollejuo: {nombre: 'El Mollejúo', vel: 5.9, salto: 9.8, doble: 0, poder: 'panzazo', emoji: '🍔', color: '#ffa94d'},
};
const ORDEN_PJS = ['salomon', 'primo', 'mollejuo'];
const alturaSalto = pj=>{ const P = PJS[pj]; return P.salto*P.salto/(2*GRAV) + (P.doble ? P.doble*P.doble/(2*GRAV) : 0); };
/* lo que salta cada uno sin doble salto, para las reglas de diseño */
const SALTO_SIMPLE = pj=>PJS[pj].salto*PJS[pj].salto/(2*GRAV);

/* la tienda del kiosko: gorros y adornos que se compran con monedas */
const TIENDA = [
  {id: 'aguilas', nombre: 'Gorra de las Águilas', emoji: '🧢', precio: 40, color: '#1c3d7a', tipo: 'gorra'},
  {id: 'llanero', nombre: 'Sombrero llanero', emoji: '🤠', precio: 60, color: '#c9a36b', tipo: 'sombrero'},
  {id: 'pescador', nombre: 'Gorro de pescador', emoji: '🎣', precio: 50, color: '#e9ecef', tipo: 'pescador'},
  {id: 'minero', nombre: 'Casco petrolero', emoji: '⛑️', precio: 80, color: '#ffd43b', tipo: 'casco'},
  {id: 'corona', nombre: 'Corona de la feria', emoji: '👑', precio: 120, color: '#fcc419', tipo: 'corona'},
  {id: 'pirata', nombre: 'Sombrero pirata', emoji: '🏴‍☠️', precio: 100, color: '#212529', tipo: 'pirata'},
  {id: 'gaitero', nombre: 'Sombrero gaitero', emoji: '🪇', precio: 90, color: '#f08c00', tipo: 'sombrero'},
  {id: 'lentes', nombre: 'Lentes de sol', emoji: '🕶️', precio: 30, color: '#111111', tipo: 'lentes'},
  {id: 'capa', nombre: 'Capa del Catatumbo', emoji: '⚡', precio: 150, color: '#7048e8', tipo: 'capa'},
];
/* los amiguitos que están en las jaulas: cada uno da una chispa */
const AMIGOS = {
  morrocoy: {nombre: 'el morrocoy', emoji: '🐢', dice: '¡Gracias! Yo solito me iba a tardar un año en salir.'},
  guacamaya: {nombre: 'la guacamaya', emoji: '🦜', dice: '¡Libre! ¡Libre! ¡Qué molleja de rescate!'},
  perrito: {nombre: 'el perrito', emoji: '🐶', dice: '¡Guau! ¡Ustedes sí son panas!'},
  gatico: {nombre: 'el gatico', emoji: '🐱', dice: '¡Miau! Ya me estaba dando sueño aquí adentro.'},
  iguana: {nombre: 'la iguana', emoji: '🦎', dice: '¡Por fin! Ya quería agarrar sol.'},
  pelicano: {nombre: 'el pelícano', emoji: '🐦', dice: '¡Gracias, chamos! Me voy a pescar al lago.'},
  burrito: {nombre: 'el burrito', emoji: '🫏', dice: '¡Iii-aaa! ¡Qué buena gente son ustedes!'},
  chivito: {nombre: 'el chivito', emoji: '🐐', dice: '¡Beee! ¡Me salvaron, vos!'},
  loro: {nombre: 'el loro', emoji: '🦜', dice: '¡Salomón es el mejor! ¡Salomón es el mejor!'},
  cangrejito: {nombre: 'el cangrejito', emoji: '🦀', dice: '¡Gracias! Me voy caminando de lado pa\' mi casa.'},
  osito: {nombre: 'el osito frontino', emoji: '🐻', dice: '¡Gracias! Del páramo vengo y pa\'l páramo voy.'},
  delfin: {nombre: 'la toninita', emoji: '🐬', dice: '¡Gracias! ¡Me voy nadando por el lago!'},
};
/* los enemigos: todos se vencen pisándolos o con un golpe (algunos aguantan más) */
const ENEMIGOS = {
  nubecita: {hp: 1, vel: 1.2, radio: 0.8, vuela: true, alto: 0.9, monedas: 2},
  cangrejo: {hp: 1, vel: 1.8, radio: 0.7, alto: 0.6, monedas: 2},
  zancudo: {hp: 1, vel: 2.4, radio: 0.55, vuela: true, alto: 0.5, persigue: 7, monedas: 2},
  chivo: {hp: 2, vel: 2.0, radio: 0.8, alto: 1.1, carga: 8, monedas: 3},
  iguana: {hp: 1, vel: 3.0, radio: 0.7, alto: 0.5, monedas: 2},
  robot: {hp: 3, vel: 1.4, radio: 0.8, alto: 1.4, monedas: 5},
  pirata: {hp: 2, vel: 2.2, radio: 0.7, alto: 1.5, persigue: 6, monedas: 4},
  pinguino: {hp: 1, vel: 3.4, radio: 0.6, alto: 0.9, desliza: true, monedas: 2},
  murcielago: {hp: 1, vel: 2.8, radio: 0.55, vuela: true, alto: 0.5, persigue: 8, monedas: 2},
  payaso: {hp: 2, vel: 2.2, radio: 0.7, alto: 1.4, salta: 7, monedas: 4},
};
const JEFES = {
  cangrejote: {nombre: 'El Cangrejote del Lago', hp: 4, tipo: 'carga', radio: 2.4, vel: 9, alto: 2.2},
  chivote: {nombre: 'El Chivo Cabezón de Coro', hp: 5, tipo: 'carga', radio: 2.0, vel: 11, alto: 2.6},
  zancudote: {nombre: 'El Zancudo Rey', hp: 6, tipo: 'volador', radio: 1.8, vel: 7, alto: 1.4},
  capitan: {nombre: 'El Capitán Pata de Palo', hp: 6, tipo: 'carga', radio: 1.6, vel: 10, alto: 2.4, canones: true},
  nublao: {nombre: 'El Nublao', hp: 8, tipo: 'nublao', radio: 3.0, vel: 5, alto: 2.2},
};

/* lo que la vista sabe dibujar: materiales de plataforma, adornos y cielos */
const MATERIALES = ['pasto', 'tierra', 'arena', 'adoquin', 'piedra', 'ladrillo', 'madera', 'tablas', 'casa', 'metal', 'asfalto', 'nieve', 'hielo', 'nube', 'tela', 'caja', 'rajada', 'puerta', 'lodo', 'oro', 'roca'];
const DECOS = ['palmera', 'farol', 'flores', 'arbol', 'pino', 'cactus', 'roca', 'casa', 'techo', 'kiosko', 'bote', 'torre', 'frailejon', 'muneco', 'toldo', 'rueda', 'carrusel',
  'basilica', 'puente', 'portal', 'album', 'antena', 'fuente', 'cascada', 'nube', 'tepuy', 'montana', 'medano', 'faro', 'barco', 'letrero', 'tuberia', 'tanque', 'grua', 'poste',
  'ceiba', 'mangle', 'palafito', 'globo', 'bandera', 'cerca', 'hongo', 'cristal', 'relampago', 'castillo', 'barril', 'ancla', 'chivo', 'burro', 'tienda'];
const CIELOS = ['dia', 'tarde', 'atardecer', 'noche', 'tormenta', 'nublado'];

/* ---------------- azar determinista ---------------- */
function azarCon(s){ let x = s|0 || 1; return ()=>{ x = (Math.imul(x, 1103515245) + 12345) & 0x7fffffff; return x/0x7fffffff; }; }

/* ============================================================
   EL CONSTRUCTOR DE NIVELES
   Cada nivel es una función (B)=>B.fin({...}) que usa estas ayudas.
   Las medidas van en metros; y es la altura del PISO de arriba.
   ============================================================ */
function constructor(id){
  const N = {id, cajas: [], monedas: [], jaulas: [], enemigos: [], banderas: [], trampolines: [], cajasRompibles: [], dianas: [],
    npcs: [], deco: [], chispas: [], barajitas: [], cocadas: [], portales: [], peligros: [], zonas: [], jefe: null, inicio: {x: 0, y: 0, z: 0, ang: 0}};
  let n = 0; const sig = p=>p + (n++);
  const B = {
    N,
    /* una plataforma: centro (x, z), ancho w (en x), fondo d (en z), piso arriba en y, grueso h */
    plat(x, z, w, d, y, o){ o = o || {}; const h = o.h || 1; const c = {id: o.id || sig('p'), x0: x - w/2, x1: x + w/2, z0: z - d/2, z1: z + d/2, y0: y - h, y1: y, solido: true, mat: o.mat || 'pasto', color: o.color || null, redondo: o.redondo !== undefined ? o.redondo : 0.12, visible: o.visible !== false}; for (const k of ['mueve', 'cae', 'hielo', 'rajada', 'puerta', 'empuja', 'tipo']) if (o[k] !== undefined) c[k] = o[k]; if (c.mat === 'hielo') c.hielo = true; N.cajas.push(c); return c; },
    /* una pared (bloque alto) */
    muro(x, z, w, d, y0, alto, o){ return B.plat(x, z, w, d, y0 + alto, Object.assign({h: alto, mat: 'piedra'}, o||{})); },
    /* una escalera de n escalones que sube dy cada uno, avanzando por dx, dz */
    escalera(x, z, y, nEsc, dx, dz, dy, w, d, o){ const r = []; for (let i = 0; i < nEsc; i++) r.push(B.plat(x + dx*i, z + dz*i, w, d, y + dy*(i+1), Object.assign({h: dy*(i+1) + (o && o.h0 || 1)}, o||{}))); return r; },
    /* plataforma que se mueve: ida y vuelta (dx, dy, dz) o en círculo (r) */
    movil(x, z, w, d, y, mueve, o){ return B.plat(x, z, w, d, y, Object.assign({mat: 'madera', h: 0.5, mueve}, o||{})); },
    /* plataforma que se cae un ratito después de pisarla y vuelve a los 3 s */
    cae(x, z, w, d, y, o){ return B.plat(x, z, w, d, y, Object.assign({mat: 'madera', h: 0.4, cae: true}, o||{})); },
    moneda(x, y, z){ N.monedas.push({id: sig('m'), x, y: y + 0.7, z}); },
    linea(x0, y0, z0, x1, y1, z1, k){ for (let i = 0; i < k; i++){ const t = k === 1 ? 0 : i/(k - 1); B.moneda(lerp(x0, x1, t), lerp(y0, y1, t), lerp(z0, z1, t)); } },
    circulo(x, y, z, r, k){ for (let i = 0; i < k; i++){ const a = i/k*Math.PI*2; B.moneda(x + Math.cos(a)*r, y, z + Math.sin(a)*r); } },
    arco(x0, z0, x1, z1, y, alto, k){ for (let i = 0; i < k; i++){ const t = (i + 0.5)/k; B.moneda(lerp(x0, x1, t), y + Math.sin(t*Math.PI)*alto, lerp(z0, z1, t)); } },
    /* caja de madera: se rompe con cualquier golpe y suelta monedas (o un corazón) */
    caja(x, y, z, o){ o = o || {}; const c = B.plat(x, z, 1, 1, y + 1, {h: 1, mat: 'caja', redondo: 0.05, id: sig('caja')}); c.rompible = true; c.suelta = o.corazon ? 'corazon' : 'monedas'; c.cuantas = o.monedas || 5; N.cajasRompibles.push(c); return c; },
    /* pared rajada: solo el panzazo del Mollejúo la tumba */
    rajada(x, z, w, d, y0, alto){ const c = B.muro(x, z, w, d, y0, alto, {mat: 'rajada', redondo: 0.04}); c.rajada = true; return c; },
    /* diana: una pedrada (o cualquier golpe si está a mano) la activa y abre la puerta con ese nombre */
    diana(x, y, z, abre, o){ N.dianas.push(Object.assign({id: sig('d'), x, y, z, abre, activa: false}, o||{})); },
    puerta(x, z, w, d, y0, alto, nombre){ const c = B.muro(x, z, w, d, y0, alto, {mat: 'puerta', redondo: 0.03}); c.puerta = nombre; return c; },
    trampolin(x, y, z, fuerza){ N.trampolines.push({id: sig('t'), x, y, z, r: 0.9, fuerza: fuerza || 17}); },
    jaula(x, y, z, amigo){ N.jaulas.push({id: sig('j'), x, y, z, amigo, hp: 3}); },
    barajita(x, y, z){ N.barajitas.push({id: N.id + '-b' + N.barajitas.length, x, y: y + 0.9, z}); },
    /* las 8 cocadas: el reto de cada nivel (juntarlas todas da una chispa) */
    cocada(x, y, z){ N.cocadas.push({id: sig('c'), x, y: y + 0.7, z}); },
    enemigo(tipo, x, y, z, o){ N.enemigos.push(Object.assign({id: sig('e'), tipo, x, y, z}, o||{})); },
    bandera(x, y, z){ N.banderas.push({x, y, z}); },
    npc(quien, x, y, z, frases, o){ N.npcs.push(Object.assign({id: sig('n'), quien, x, y, z, frases}, o||{})); },
    deco(tipo, x, y, z, o){ N.deco.push(Object.assign({tipo, x, y, z}, o||{})); },
    /* peligros: 'canon' (dispara bolas), 'carros' (carriles), 'rayos' (caen del cielo), 'rodante' (barriles/bolas por un camino), 'chorro' (sube como ascensor) */
    peligro(tipo, o){ N.peligros.push(Object.assign({id: sig('z'), tipo}, o)); },
    /* zonas: 'viento' (empuja), 'agua' (se hunde y vuelve), 'aviso' (texto de ayuda) */
    zona(tipo, x0, x1, z0, z1, o){ N.zonas.push(Object.assign({tipo, x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1)}, o||{})); },
    inicio(x, y, z, ang){ N.inicio = {x, y, z, ang: ang || 0}; },
    /* la chispa grande del final (o la que suelta el jefe) */
    meta(x, y, z){ N.meta = {x, y: y + 1.1, z}; },
    jefe(tipo, x, y, z, o){ N.jefe = Object.assign({tipo, x, y, z}, o||{}); },
    portal(nivel, x, y, z){ N.portales.push({nivel, x, y, z}); },
    fin(def){ return Object.assign(N, def); },
  };
  return B;
}

/* ---------------- los niveles (se cargan de niveles.js) ---------------- */
const NIVELES = [];                   /* [0] = la Vereda (el mundo central), [1..12] = los niveles */
function registrarNiveles(lista){ NIVELES.length = 0; for (const f of lista) NIVELES.push(f); }
function armarNivel(n){ const B = constructor(n); const N = NIVELES[n](B, {clamp, lerp}); prepararNivel(N); return N; }
/* chispas del nivel: 0 y 1 = las jaulas (las dos primeras), 2 = las 8 cocadas, 3 = la meta o el jefe */
function prepararNivel(N){
  N.jaulas.forEach((j, i)=>{ j.chispa = N.id + '-j' + i; });
  N.chispaCocadas = N.id + '-c';
  N.chispaMeta = N.id + '-m';
  N.chispasTotal = N.id === 0 ? 0 : N.jaulas.length + (N.cocadas.length ? 1 : 0) + ((N.meta || N.jefe) ? 1 : 0);
  for (const c of N.cajas){ c.bx0 = c.x0; c.bx1 = c.x1; c.by0 = c.y0; c.by1 = c.y1; c.bz0 = c.z0; c.bz1 = c.z1; }
}
/* cuántas chispas pide cada portal */
const PIDE_PORTAL = [0, 0, 2, 4, 7, 10, 13, 16, 20, 24, 28, 32, 36];
function chispasDeNivel(n){ if (!NIVELES[n]) return []; const N = armarNivel(n); const r = N.jaulas.map(j=>j.chispa); if (N.cocadas.length) r.push(N.chispaCocadas); if (N.meta || N.jefe) r.push(N.chispaMeta); return r; }

/* ============================================================
   EL PROGRESO (lo que se guarda): chispas, barajitas, monedas, tienda
   ============================================================ */
function progresoNuevo(){ return {chispas: [], barajitas: [], monedas: 0, compras: [], puesto: {}, pj: 'salomon', vistos: {}, record: {}}; }
function progresoLimpio(p){
  const q = progresoNuevo();
  if (!p || typeof p !== 'object') return q;
  const lista = (v, f)=>Array.isArray(v) ? v.filter(f).slice(0, 400) : [];
  q.chispas = [...new Set(lista(p.chispas, x=>typeof x === 'string' && /^\d+-[jcm]\d*$/.test(x)))];
  q.barajitas = [...new Set(lista(p.barajitas, x=>typeof x === 'string' && /^\d+-b\d$/.test(x)))];
  q.monedas = Number.isFinite(p.monedas) ? clamp(Math.floor(p.monedas), 0, 999999) : 0;
  q.compras = [...new Set(lista(p.compras, x=>TIENDA.some(t=>t.id === x)))];
  if (p.puesto && typeof p.puesto === 'object') for (const t of ['cabeza', 'cara', 'espalda']) if (q.compras.includes(p.puesto[t])) q.puesto[t] = p.puesto[t];
  if (ORDEN_PJS.includes(p.pj)) q.pj = p.pj;
  if (p.vistos && typeof p.vistos === 'object') for (const k in p.vistos) if (/^[\w-]{1,30}$/.test(k)) q.vistos[k] = true;
  return q;
}
const lugarDe = it=>it.tipo === 'lentes' ? 'cara' : it.tipo === 'capa' ? 'espalda' : 'cabeza';
function comprar(p, id){
  const it = TIENDA.find(t=>t.id === id); if (!it) return 'no existe';
  if (p.compras.includes(id)){ const l = lugarDe(it); p.puesto[l] = p.puesto[l] === id ? undefined : id; if (!p.puesto[l]) delete p.puesto[l]; return 'puesto'; }
  if (p.monedas < it.precio) return 'faltan';
  p.monedas -= it.precio; p.compras.push(id); p.puesto[lugarDe(it)] = id; return 'comprado';
}

/* ============================================================
   LA PARTIDA DE UN NIVEL
   ============================================================ */
function crearPartida(n, progreso, opts){
  opts = opts || {};
  const N = armarNivel(n);
  const P = progreso || progresoNuevo();
  const G = {
    n, N, P, t: 0, fase: 'jugando', finT: 0, eventos: [], azar: azarCon(1000 + n*77),
    J: null, monedasNivel: 0, cocadas: 0, proyectiles: [], balas: [], rayos: [], efectos: 0, avisados: {}, dichos: {},
    respawn: {x: N.inicio.x, y: N.inicio.y, z: N.inicio.z}, bandera: -1, jefe: null, camYaw: N.inicio.ang || 0,
  };
  G.J = {x: N.inicio.x, y: N.inicio.y + 0.02, z: N.inicio.z, vx: 0, vy: 0, vz: 0, ang: N.inicio.ang || 0, suelo: true, sobre: null,
    pj: ORDEN_PJS.includes(opts.pj) ? opts.pj : P.pj, vidas: CORAZONES, maxVidas: CORAZONES, coyote: 0, buffer: 0, dobleUsado: false, stun: 0, invul: 0,
    turbo: 0, cd: 0, ataque: 0, ataqueTipo: '', anda: 0, aterriza: 0, saltoT: 0, caidaMax: 0, ahogando: 0};
  /* lo que ya se ganó antes no vuelve a salir (las jaulas quedan abiertas, las barajitas no están) */
  for (const j of N.jaulas){ j.abierta = P.chispas.includes(j.chispa); }
  for (const b of N.barajitas) b.vivo = !P.barajitas.includes(b.id);
  for (const m of N.monedas) m.vivo = true;
  for (const c of N.cocadas) c.vivo = true;
  for (const c of N.cajas){ if (c.rompible || c.rajada) c.solido = true; c.cayendo = 0; c.pisada = 0; }
  for (const d of N.dianas) d.activa = false;
  G.cocadasListas = P.chispas.includes(N.chispaCocadas);
  G.metaViva = !!N.meta && !P.chispas.includes(N.chispaMeta);
  N.enemigos.forEach(e=>{ const D = ENEMIGOS[e.tipo]; Object.assign(e, {vivo: true, hp: D.hp, x0: e.x, y0: e.y, z0: e.z, fase: (e.x*1.7 + e.z*0.9) % 6.28, estado: 'anda', t: 0, vy: 0, dir: 1, golpeT: -9}); });
  /* los enemigos puestos muy justos (sin espacio para dar la vuelta) patrullan como siempre, sin revisar bordes */
  for (const e of N.enemigos){ const ex = (e.eje || 'x') === 'x' ? 1 : 0, ez = 1 - ex; e.sinChoque = false; if (bloqueaEnemigo(N, e, e.x + ex*0.8, e.z + ez*0.8) && bloqueaEnemigo(N, e, e.x - ex*0.8, e.z - ez*0.8)) e.sinChoque = true; }
  if (N.jefe){
    const D = JEFES[N.jefe.tipo];
    G.jefe = Object.assign({}, N.jefe, D, {hp: D.hp, hpMax: D.hp, vivo: !P.chispas.includes(N.chispaMeta), activo: false, x0: N.jefe.x, y0: Number.isFinite(N.jefe.y0) ? N.jefe.y0 : N.jefe.y, z0: N.jefe.z, estado: 'espera', t: 0, vx: 0, vz: 0, vy: 0, golpeT: -9, ang: 0});
  }
  for (const p of N.peligros){ p.t = p.fase || 0; p.items = []; }
  if (N.carros) for (const c of N.carros) c.z0 = c.z;
  if (N.intro && !P.vistos['intro' + n]){ P.vistos['intro' + n] = true; for (const [pj, t] of N.intro) hablar(G, pj, t); }
  return G;
}
function evento(G, tipo, datos){ G.eventos.push(Object.assign({tipo}, datos||{})); }
function hablar(G, pj, texto){ evento(G, 'hablar', {pj, texto}); }
function avisar(G, clave, texto, cada){
  const u = G.avisados[clave];
  if (u !== undefined && G.t - u < (cada === undefined ? 6 : cada)) return false;
  G.avisados[clave] = G.t; evento(G, 'aviso', {texto}); return true;
}

/* ---------------- choques con las cajas del mundo ---------------- */
function tocaXZ(x, z, r, b){ return x + r > b.x0 && x - r < b.x1 && z + r > b.z0 && z - r < b.z1; }
function cabezaChoca(N, x, z, y){ for (const b of N.cajas) if (b.solido && y + ALTO > b.y0 && y < b.y0 && tocaXZ(x, z, R, b)) return true; return false; }
function moverEje(G, eje, d){
  if (!d) return;
  const J = G.J, N = G.N;
  J[eje] += d;
  for (const b of N.cajas){
    if (!b.solido || J.y >= b.y1 - 0.001 || J.y + ALTO <= b.y0 || !tocaXZ(J.x, J.z, R, b)) continue;
    if (b.y1 - J.y <= 0.36 && (J.suelo || J.vy <= 0) && !cabezaChoca(N, J.x, J.z, b.y1)){ J.y = b.y1; continue; }   /* escaloncitos */
    if (eje === 'x'){ J.x = d > 0 ? b.x0 - R - 0.0005 : b.x1 + R + 0.0005; J.vx = 0; }
    else { J.z = d > 0 ? b.z0 - R - 0.0005 : b.z1 + R + 0.0005; J.vz = 0; }
    J.choco = b;
  }
}
function moverY(G, d){
  const J = G.J, antes = J.y;
  J.y += d; J.suelo = false; J.sobre = null;
  for (const b of G.N.cajas){
    if (!b.solido || !tocaXZ(J.x, J.z, R, b)) continue;
    if (d <= 0 && antes >= b.y1 - 0.05 && J.y < b.y1){ J.y = b.y1; J.vy = 0; J.suelo = true; J.sobre = b; }
    else if (d > 0 && antes + ALTO <= b.y0 + 0.05 && J.y + ALTO > b.y0){ J.y = b.y0 - ALTO; J.vy = 0; if (b.rompible) romperCaja(G, b, 'cabezazo'); }
  }
}
/* lo más alto que hay debajo de (x, z) desde la altura y: para los enemigos y las sombras */
function sueloEn(N, x, z, y, r){
  let mejor = -Infinity;
  for (const b of N.cajas){ if (!b.solido || b.y1 > y + 0.3 || !tocaXZ(x, z, r || 0.05, b)) continue; if (b.y1 > mejor) mejor = b.y1; }
  return mejor;
}

/* ---------------- golpes que recibe el jugador ---------------- */
function lastimar(G, desdeX, desdeZ, fuerza){
  const J = G.J;
  if (J.invul > 0 || G.fase !== 'jugando') return false;
  J.vidas--;
  let dx = J.x - desdeX, dz = J.z - desdeZ; const m = Math.hypot(dx, dz) || 1; dx /= m; dz /= m;
  J.vx = dx*(fuerza || 7); J.vz = dz*(fuerza || 7); J.vy = 7; J.stun = 0.4; J.invul = 1.8; J.suelo = false;
  evento(G, 'lastima', {x: J.x, y: J.y, z: J.z, vidas: J.vidas});
  if (J.vidas <= 0){ desmayo(G); return true; }
  if (!G.dichos.ay || G.t - G.dichos.ay > 8){ G.dichos.ay = G.t; evento(G, 'ay', {pj: J.pj}); }
  return true;
}
/* sin corazones: pierde unas monedas y vuelve a la última bandera con los corazones llenos */
function desmayo(G){
  const J = G.J, pierde = Math.min(G.P.monedas, 10);
  G.P.monedas -= pierde;
  evento(G, 'desmayo', {x: J.x, y: J.y, z: J.z, pierde});
  reaparecer(G); J.vidas = J.maxVidas;
}
function reaparecer(G){
  const J = G.J;
  J.x = G.respawn.x; J.y = G.respawn.y + 0.05; J.z = G.respawn.z; J.vx = J.vy = J.vz = 0; J.invul = 1.5; J.stun = 0; J.ahogando = 0;
  evento(G, 'reaparece', {});
}
function curar(G, k){ const J = G.J; if (J.vidas >= J.maxVidas) return false; J.vidas = Math.min(J.maxVidas, J.vidas + (k || 1)); evento(G, 'cura', {}); return true; }

/* ---------------- ganar cosas ---------------- */
function ganarChispa(G, id, x, y, z, como){
  const P = G.P;
  if (P.chispas.includes(id)) return false;
  P.chispas.push(id);
  evento(G, 'chispa', {id, x, y, z, como, total: P.chispas.length});
  return true;
}
function romperCaja(G, c, como){
  if (!c.solido || !c.rompible) return;
  c.solido = false;
  const cx = (c.x0 + c.x1)/2, cz = (c.z0 + c.z1)/2, cy = c.y1;
  evento(G, 'rompe', {x: cx, y: cy - 0.5, z: cz, que: 'caja'});
  if (c.suelta === 'corazon'){ if (!curar(G)) G.P.monedas += 3; }
  else { G.P.monedas += c.cuantas; G.monedasNivel += c.cuantas; evento(G, 'monedas', {k: c.cuantas, x: cx, y: cy, z: cz}); }
}
function tumbarRajada(G, c){
  if (!c.solido || !c.rajada) return;
  c.solido = false;
  evento(G, 'rompe', {x: (c.x0 + c.x1)/2, y: (c.y0 + c.y1)/2, z: (c.z0 + c.z1)/2, que: 'pared'});
}
function activarDiana(G, d){
  if (d.activa) return;
  d.activa = true;
  evento(G, 'diana', {x: d.x, y: d.y, z: d.z});
  let abiertas = 0;
  for (const c of G.N.cajas) if (c.puerta === d.abre && c.solido){ c.solido = false; abiertas++; evento(G, 'abre', {x: (c.x0 + c.x1)/2, y: c.y1, z: (c.z0 + c.z1)/2}); }
  /* las plataformas dormidas que esperan esta diana empiezan a moverse */
  for (const c of G.N.cajas) if (c.mueve && c.mueve.espera === d.abre) c.mueve.despierta = true;
}
function golpearJaula(G, j){
  if (j.abierta) return;
  j.hp--; j.golpeT = G.t;
  evento(G, 'golpeJaula', {x: j.x, y: j.y, z: j.z});
  if (j.hp > 0) return;
  j.abierta = true;
  const A = AMIGOS[j.amigo] || AMIGOS.morrocoy;
  evento(G, 'rescate', {x: j.x, y: j.y, z: j.z, amigo: j.amigo});
  hablar(G, 'amigo:' + j.amigo, A.dice);
  ganarChispa(G, j.chispa, j.x, j.y + 1.5, j.z, 'jaula');
}
function vencerEnemigo(G, e, como){
  if (!e.vivo) return;
  e.hp--; e.golpeT = G.t;
  if (e.hp > 0){ evento(G, 'pega', {x: e.x, y: e.y + 0.5, z: e.z}); const J = G.J, dx = e.x - J.x, dz = e.z - J.z, m = Math.hypot(dx, dz) || 1; e.empujeX = dx/m*6; e.empujeZ = dz/m*6; return; }
  e.vivo = false; e.muereT = G.t;
  const k = ENEMIGOS[e.tipo].monedas;
  G.P.monedas += k; G.monedasNivel += k;
  evento(G, 'vence', {x: e.x, y: e.y, z: e.z, tipo: e.tipo, como, k});
}

/* ---------------- los poderes (B) ---------------- */
function usarPoder(G){
  const J = G.J;
  if (J.cd > 0 || J.stun > 0) return;
  const poder = PJS[J.pj].poder, N = G.N;
  if (poder === 'pedrada'){
    J.cd = 0.35; J.ataque = 0.25; J.ataqueTipo = 'pedrada';
    /* apunta sola a lo más cercano que tenga por delante: enemigo, jefe, diana o jaula */
    const fx = Math.sin(J.ang), fz = Math.cos(J.ang);
    let obj = null, mejor = 1e9;
    const mirar = (o, x, y, z, alcance)=>{ const dx = x - J.x, dz = z - J.z, d = Math.hypot(dx, dz), fr = (dx*fx + dz*fz)/(d || 1); if (d > alcance || (fr < 0.35 && d > 3) || Math.abs(y - J.y) > 12) return; const nota = d - fr*5; if (nota < mejor){ mejor = nota; obj = o; } };
    for (const e of N.enemigos) if (e.vivo) mirar({e}, e.x, e.y, e.z, 16);
    if (G.jefe && G.jefe.vivo && G.jefe.activo) mirar({jefe: G.jefe}, G.jefe.x, G.jefe.y, G.jefe.z, 26);
    for (const d of N.dianas) if (!d.activa) mirar({d}, d.x, d.y, d.z, 22);
    for (const j of N.jaulas) if (!j.abierta && Math.abs(j.y - J.y) < 2) mirar({j}, j.x, j.y, j.z, 5);
    G.proyectiles.push({x: J.x + fx*0.5, y: J.y + 1.1, z: J.z + fz*0.5, vx: fx*18, vy: 3, vz: fz*18, vida: 1.8, obj});
    evento(G, 'pedrada', {x: J.x, y: J.y + 1.1, z: J.z});
  } else if (poder === 'patada'){
    /* el Primo da una patada voladora que gira: golpea todo alrededor y lo empuja hacia adelante */
    J.cd = 0.55; J.ataque = 0.4; J.ataqueTipo = 'patada'; J.turbo = 0.35;
    if (!J.suelo && J.vy < 3) J.vy = 3;
    golpeCerca(G, 1.9, 'patada');
    evento(G, 'patada', {x: J.x, y: J.y, z: J.z});
  } else if (poder === 'panzazo'){
    J.cd = 0.7; J.ataque = 0.5; J.ataqueTipo = 'panzazo';
    golpeCerca(G, 2.6, 'panzazo');
    for (const c of N.cajas){
      if (!c.solido) continue;
      const cx = clamp(J.x, c.x0, c.x1), cz = clamp(J.z, c.z0, c.z1);
      if (Math.hypot(J.x - cx, J.z - cz) > R + 1.9 || J.y > c.y1 + 0.3 || J.y + ALTO < c.y0) continue;
      if (c.rajada) tumbarRajada(G, c);
      if (c.empuja && !c.empujado){ c.empujado = {dx: c.empuja.dx || 0, dz: c.empuja.dz || 0, falta: 1}; evento(G, 'empuja', {x: cx, y: J.y, z: cz}); }
    }
    evento(G, 'panzazo', {x: J.x, y: J.y, z: J.z});
  }
}
/* ¿hay una pared entre dos puntos? (los golpes no atraviesan paredes) */
function vistaLibre(N, x0, y0, z0, x1, y1, z1, ignorar){
  const d = Math.hypot(x1 - x0, y1 - y0, z1 - z0), k = Math.max(1, Math.ceil(d/0.3));
  for (let i = 1; i < k; i++){
    const t = i/k, x = lerp(x0, x1, t), y = lerp(y0, y1, t), z = lerp(z0, z1, t);
    for (const b of N.cajas) if (b.solido && b !== ignorar && !b.rompible && x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1 && z > b.z0 && z < b.z1) return false;
  }
  return true;
}
/* golpe cuerpo a cuerpo alrededor del jugador */
function golpeCerca(G, radio, como){
  const J = G.J, N = G.N, cy = J.y + 0.7;
  const ve = (x, y, z)=>vistaLibre(N, J.x, cy, J.z, x, y, z);
  for (const e of N.enemigos) if (e.vivo && Math.hypot(e.x - J.x, e.z - J.z) < radio + ENEMIGOS[e.tipo].radio*0.5 && Math.abs(e.y + 0.4 - cy) < 1.8 && ve(e.x, e.y + 0.4, e.z)) vencerEnemigo(G, e, como);
  for (const c of N.cajasRompibles) if (c.solido && Math.hypot((c.x0 + c.x1)/2 - J.x, (c.z0 + c.z1)/2 - J.z) < radio + 0.3 && c.y1 > J.y - 0.2 && c.y0 < J.y + ALTO + 0.2) romperCaja(G, c, como);
  for (const j of N.jaulas) if (!j.abierta && Math.hypot(j.x - J.x, j.z - J.z) < radio + 0.6 && Math.abs(j.y - J.y) < 1.6 && ve(j.x, j.y + 0.8, j.z)){ golpearJaula(G, j); if (como === 'panzazo' && !j.abierta) golpearJaula(G, j); }
  for (const d of N.dianas) if (!d.activa && Math.hypot(d.x - J.x, d.z - J.z) < radio + 0.3 && Math.abs(d.y - cy) < 1.6 && ve(d.x, d.y, d.z)) activarDiana(G, d);
  const B = G.jefe;
  if (B && B.vivo && B.activo && Math.hypot(B.x - J.x, B.z - J.z) < radio + B.radio*0.8 && Math.abs(B.y - J.y) < 2.6) pegarJefe(G, como);
}
function cambiarPj(G){
  const J = G.J;
  const i = ORDEN_PJS.indexOf(J.pj);
  J.pj = ORDEN_PJS[(i + 1) % ORDEN_PJS.length];
  G.P.pj = J.pj;
  J.turbo = 0; J.cd = 0.15; J.ataque = 0;
  evento(G, 'cambio', {pj: J.pj});
}

/* ---------------- el jefe ---------------- */
function pegarJefe(G, como){
  const B = G.jefe;
  if (!B || !B.vivo || G.t - B.golpeT < 0.6) return;
  /* el Nublao solo recibe pedradas mientras está arriba; abajo, cansado, cualquier golpe sirve */
  /* cuándo se le puede pegar: mareado o cansado (a cualquier golpe); el volador y el Nublao, además,
     con pedradas mientras vuelan. Después de cada golpe se aleja un rato y no se le puede pegar */
  const vulnerable = B.estado === 'mareado' || B.estado === 'cansado';
  const aPedradas = (B.tipo === 'nublao' || B.tipo === 'volador') && como === 'pedrada' && B.estado === 'mira';
  if (!vulnerable && !aPedradas){
    if (B.estado === 'huye') return;
    avisar(G, 'jefeDuro', B.tipo === 'carga' ? '¡Espera a que choque y quede mareado, y ahí le das!' : B.tipo === 'nublao' ? '¡Está muy alto! Dale pedradas con Salomón o espera a que baje' : '¡Dale pedradas mientras vuela, o espera a que se clave en el piso!', 5);
    return;
  }
  B.hp--; B.golpeT = G.t;
  evento(G, 'pegaJefe', {x: B.x, y: B.y + 1, z: B.z, hp: B.hp});
  B.estado = 'huye'; B.t = 0;
  if (B.hp <= 0){
    B.vivo = false; G.rayos.length = 0; G.balas.length = 0;
    evento(G, 'jefeVence', {x: B.x, y: B.y, z: B.z, nombre: B.nombre});
    const N = G.N;
    N.meta = N.meta || {x: B.x0, y: B.y0 + 1.1, z: B.z0};
    G.metaViva = !G.P.chispas.includes(N.chispaMeta);
    G.P.monedas += 30; G.monedasNivel += 30;
  }
}
function pasoJefe(G, dt){
  const B = G.jefe, J = G.J;
  if (!B || !B.vivo) return;
  if (!B.activo){
    if (Math.hypot(J.x - B.x0, J.z - B.z0) < (B.despierta || 16) && Math.abs(J.y - B.y0) < 6){ B.activo = true; B.estado = 'mira'; B.t = 0; evento(G, 'jefe', {nombre: B.nombre}); }
    return;
  }
  B.t += dt;
  const dx = J.x - B.x, dz = J.z - B.z, d = Math.hypot(dx, dz) || 1;
  const arenaR = B.arena || 12;
  if (B.tipo === 'carga'){
    /* mira, carga en línea recta, si choca con el borde queda mareado: ahí se le puede pegar o pisar */
    if (B.estado === 'mira'){ B.ang = Math.atan2(dx, dz); if (B.t > 1.2){ B.estado = 'carga'; B.t = 0; B.vx = dx/d*B.vel; B.vz = dz/d*B.vel; evento(G, 'rugido', {}); } }
    else if (B.estado === 'carga'){
      B.x += B.vx*dt; B.z += B.vz*dt;
      const r = Math.hypot(B.x - B.x0, B.z - B.z0);
      if (r > arenaR){ const k = arenaR/r; B.x = B.x0 + (B.x - B.x0)*k; B.z = B.z0 + (B.z - B.z0)*k; B.estado = 'mareado'; B.t = 0; evento(G, 'choqueJefe', {x: B.x, y: B.y, z: B.z}); }
      else if (B.t > 2.5){ B.estado = 'mira'; B.t = 0; }
    } else if (B.estado === 'mareado'){ if (B.t > 2.6){ B.estado = 'mira'; B.t = 0; } }
    else if (B.estado === 'huye'){ const hx = B.x0 - B.x, hz = B.z0 - B.z, hd = Math.hypot(hx, hz) || 1; if (hd > 0.5){ B.x += hx/hd*6*dt; B.z += hz/hd*6*dt; } if (B.t > 1.4){ B.estado = 'mira'; B.t = 0; } }
    if (B.canones && B.estado === 'mira' && B.t > 0.6 && B.t - dt <= 0.6) dispararBala(G, B.x, B.y + 1.6, B.z, dx/d*12, 4, dz/d*12);
  } else if (B.tipo === 'volador'){
    /* vuela en círculo alto; baja en picada hacia el jugador y se clava en el piso un momento */
    const alto = B.y0 + 4.5;
    if (B.estado === 'mira' || B.estado === 'huye'){
      const a = G.t*0.8; const tx = B.x0 + Math.cos(a)*arenaR*0.6, tz = B.z0 + Math.sin(a)*arenaR*0.6;
      B.x = lerp(B.x, tx, dt*2); B.z = lerp(B.z, tz, dt*2); B.y = lerp(B.y, alto + Math.sin(G.t*3)*0.4, dt*3);
      if (B.t > (B.estado === 'huye' ? 2.2 : 3)){ B.estado = 'picada'; B.t = 0; B.tx = J.x; B.tz = J.z; evento(G, 'rugido', {}); }
    } else if (B.estado === 'picada'){
      const px = B.tx - B.x, pz = B.tz - B.z, py = B.y0 + 0.3 - B.y, pd = Math.hypot(px, py, pz) || 1;
      const v = B.vel*1.8*dt; B.x += px/pd*v; B.y += py/pd*v; B.z += pz/pd*v;
      if (pd < 0.6 || B.t > 2){ B.estado = 'cansado'; B.t = 0; B.y = B.y0 + 0.3; evento(G, 'choqueJefe', {x: B.x, y: B.y, z: B.z}); }
    } else if (B.estado === 'cansado'){ if (B.t > 2.4){ B.estado = 'mira'; B.t = 0; } }
    B.ang = Math.atan2(dx, dz);
  } else if (B.tipo === 'nublao'){
    /* arriba tira rayos y nubecitas; cada 3 pedradas baja cansado un rato y se le puede pisar */
    const alto = B.y0 + 7;
    if (B.estado === 'mira' || B.estado === 'huye'){
      B.x = B.x0 + Math.sin(G.t*0.5)*arenaR*0.5; B.z = B.z0 + Math.cos(G.t*0.37)*arenaR*0.3; B.y = lerp(B.y, alto, dt*2);
      if (B.t > 0.8 && Math.floor((B.t - dt)/1.6) !== Math.floor(B.t/1.6)) G.rayos.push({x: J.x + J.vx*0.4, z: J.z + J.vz*0.4, y: sueloEn(G.N, J.x, J.z, J.y + 1), t: 1.1});
      if (B.estado === 'huye' && B.t > 1.5){ B.estado = 'mira'; B.t = 0; B.golpesArriba = (B.golpesArriba || 0) + 1; }
      if (B.estado === 'mira' && ((B.golpesArriba || 0) >= 2 || B.t > 9)){ B.estado = 'baja'; B.t = 0; B.golpesArriba = 0; }
    } else if (B.estado === 'baja'){
      B.y = lerp(B.y, B.y0 + 1.2, dt*3);
      if (B.t > 1){ B.estado = 'cansado'; B.t = 0; avisar(G, 'nublaoBaja', '¡El Nublao bajó cansado! ¡Písalo o dale un golpe!', 3); }
    } else if (B.estado === 'cansado'){ if (B.t > 3.5){ B.estado = 'mira'; B.t = 0; } }
    B.ang = Math.atan2(dx, dz);
  }
  /* tocar al jefe duele, menos cuando está mareado/cansado (ahí se le pisa) */
  const alcance = B.radio + R;
  const vulnerable = B.estado === 'mareado' || B.estado === 'cansado';
  if (d < alcance && J.y < B.y + B.alto && J.y + ALTO > B.y){
    if (vulnerable && J.vy < 0 && J.y > B.y + B.alto*0.5){ J.vy = 12; pegarJefe(G, 'pisoton'); evento(G, 'pisoton', {}); }
    else if (!vulnerable) lastimar(G, B.x, B.z, 10);
  }
}
function dispararBala(G, x, y, z, vx, vy, vz){ G.balas.push({x, y, z, vx, vy, vz, vida: 4}); evento(G, 'canonazo', {x, y, z}); }

/* ============================================================
   UN PASO DE LA PARTIDA
   ent = {jx, jy (−1…1, relativos a la cámara), camYaw, saltar (sostenido),
          saltoPulsado, poder, cambiar, usar}
   ============================================================ */
function paso(G, ent){
  ent = ent || {};
  const N = G.N, J = G.J, dt = DT;
  G.t += dt;
  if (Number.isFinite(ent.camYaw)) G.camYaw = ent.camYaw;
  if (G.fase === 'fin'){ G.finT += dt; }
  const P = PJS[J.pj];
  J.cd = Math.max(0, J.cd - dt); J.invul = Math.max(0, J.invul - dt); J.stun = Math.max(0, J.stun - dt);
  J.turbo = Math.max(0, J.turbo - dt); J.ataque = Math.max(0, J.ataque - dt); J.aterriza = Math.max(0, J.aterriza - dt);
  const jugando = G.fase === 'jugando';
  if (jugando && ent.cambiar) cambiarPj(G);
  if (jugando && ent.poder) usarPoder(G);

  pasoPlataformas(G, dt);
  /* moverse relativo a la cámara: arriba = hacia donde mira la cámara */
  let jx = clamp(ent.jx || 0, -1, 1), jy = clamp(ent.jy || 0, -1, 1);
  const m = Math.hypot(jx, jy); if (m > 1){ jx /= m; jy /= m; }
  if (!jugando || J.stun > 0){ jx = 0; jy = 0; }
  const yaw = G.camYaw, fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
  const wx = jx*rx + jy*fx, wz = jx*rz + jy*fz;
  const vel = P.vel*(J.turbo > 0 ? 1.6 : 1);
  const hielo = J.sobre && J.sobre.hielo;
  const acel = hielo ? 2.2 : J.suelo ? 16 : 8;
  if (J.stun <= 0){
    J.vx += (wx*vel - J.vx)*Math.min(1, acel*dt);
    J.vz += (wz*vel - J.vz)*Math.min(1, acel*dt);
  } else { J.vx *= 0.97; J.vz *= 0.97; }
  if (Math.hypot(wx, wz) > 0.12){ const obj = Math.atan2(wx, wz); J.ang += envolver(obj - J.ang)*Math.min(1, dt*14); }
  J.anda = Math.hypot(J.vx, J.vz);
  /* saltar: margen al borde (coyote), botón apretado un poquito antes (buffer), doble salto del Primo */
  J.coyote = J.suelo ? 0.1 : Math.max(0, J.coyote - dt);
  if (J.suelo) J.dobleUsado = false;
  J.buffer = ent.saltoPulsado && jugando ? 0.13 : Math.max(0, J.buffer - dt);
  if (J.buffer > 0 && J.stun <= 0){
    if (J.coyote > 0){ J.vy = P.salto; J.suelo = false; J.coyote = 0; J.buffer = 0; J.saltoT = G.t; evento(G, 'salto', {pj: J.pj, x: J.x, y: J.y, z: J.z}); }
    else if (P.doble && !J.dobleUsado){ J.vy = P.doble; J.dobleUsado = true; J.buffer = 0; J.saltoT = G.t; evento(G, 'dobleSalto', {pj: J.pj, x: J.x, y: J.y, z: J.z}); }
  }
  if (J.vy <= 0) J.lanzado = false;
  if (!ent.saltar && J.vy > 0 && J.stun <= 0 && !J.lanzado) J.vy -= GRAV*dt*1.3;   /* soltar temprano = salto más bajito (no si lo lanzó un trampolín o un pisotón) */
  J.vy -= GRAV*dt;
  if (J.vy < -32) J.vy = -32;
  /* zonas: viento, corriente de aire (chorro) */
  let empX = 0, empZ = 0;
  for (const z of N.zonas){
    if (J.x < z.x0 || J.x > z.x1 || J.z < z.z0 || J.z > z.z1) continue;
    if (z.tipo === 'viento'){ const on = !z.periodo || (G.t % z.periodo) > z.periodo - (z.dura || 2); if (on){ empX += z.fx || 0; empZ += z.fz || 0; G.soplando = z; } }
    else if (z.tipo === 'aviso' && (!z.pj || z.pj !== J.pj) && (z.y === undefined || Math.abs(J.y - z.y) < 3)) avisar(G, 'zona' + z.x0 + ',' + z.z0, z.texto, 9);
  }
  for (const p of N.peligros) if (p.tipo === 'chorro' && Math.hypot(J.x - p.x, J.z - p.z) < (p.r || 1.2) && J.y < p.y + (p.alto || 8) && J.y > p.y - 0.5){ J.vy = Math.max(J.vy, p.fuerza || 11); J.lanzado = true; J.suelo = false; }
  const antesY = J.y;
  J.choco = null;
  moverEje(G, 'x', (J.vx + empX)*dt);
  moverEje(G, 'z', (J.vz + empZ)*dt);
  const iba = J.vy;
  moverY(G, J.vy*dt);
  if (J.suelo && iba < -9){ J.aterriza = 0.18; evento(G, 'aterriza', {x: J.x, y: J.y, z: J.z, fuerte: iba < -16}); }
  /* pisar una plataforma que se cae */
  if (J.sobre && J.sobre.cae && !J.sobre.cayendo){ J.sobre.pisada += dt; if (J.sobre.pisada > 0.45){ J.sobre.cayendo = 0.001; evento(G, 'cruje', {x: J.x, y: J.y, z: J.z}); } }
  /* trampolines */
  for (const t of N.trampolines) if (J.vy <= 0 && Math.hypot(J.x - t.x, J.z - t.z) < t.r + R*0.5 && J.y <= t.y + 0.45 && antesY >= t.y - 0.1){ J.vy = t.fuerza; J.lanzado = true; J.y = t.y + 0.46; J.suelo = false; J.dobleUsado = false; t.boing = G.t; evento(G, 'boing', {x: t.x, y: t.y, z: t.z}); }
  /* se cayó al vacío o al agua: vuelve a la bandera y pierde un corazón */
  const piso = N.agua !== undefined ? N.agua : (N.vacio !== undefined ? N.vacio : -12);
  if (J.y < piso - (N.agua !== undefined ? 0.6 : 0)){
    evento(G, N.agua !== undefined ? 'chapuzon' : 'cae', {x: J.x, y: piso, z: J.z});
    J.vidas--; if (J.vidas <= 0){ desmayo(G); } else reaparecer(G);
  }
  /* banderas */
  N.banderas.forEach((f, i)=>{ if (i !== G.bandera && Math.hypot(J.x - f.x, J.z - f.z) < 1.6 && Math.abs(J.y - f.y) < 2){ G.bandera = i; G.respawn = {x: f.x, y: f.y, z: f.z}; if (!f.tocada){ f.tocada = true; evento(G, 'bandera', {i, x: f.x, y: f.y, z: f.z}); curar(G, 9); } } });

  recoger(G);
  pasoEnemigos(G, dt);
  pasoJefe(G, dt);
  pasoPeligros(G, dt);
  pasoProyectiles(G, dt);
  pasoNpcs(G);
  /* los portales de la Vereda */
  if (N.portales.length && jugando){
    for (const p of N.portales){
      const d = Math.hypot(J.x - p.x, J.z - p.z);
      if (d > 1.8 || Math.abs(J.y - p.y) > 2) continue;
      const pide = PIDE_PORTAL[p.nivel] || 0, tiene = G.P.chispas.length;
      if (tiene < pide){ avisar(G, 'portal' + p.nivel, '🔒 Este portal pide ' + pide + ' ⚡ (tienes ' + tiene + ')', 4); continue; }
      G.fase = 'portal'; G.destino = p.nivel; evento(G, 'portal', {nivel: p.nivel});
    }
  }
  if (G.fase === 'fin' && G.finT > 4.5 && !G.salida){ G.salida = true; evento(G, 'salida', {}); }
}

/* ---- plataformas que se mueven, que se caen y que se empujan ---- */
function pasoPlataformas(G, dt){
  const J = G.J;
  for (const c of G.N.cajas){
    let dx = 0, dy = 0, dz = 0;
    if (c.mueve){
      const M = c.mueve;
      if (M.espera && !M.despierta) continue;
      M.t = (M.t || 0) + dt;
      const per = M.periodo || 4, fase = (M.fase || 0) + M.t/per*Math.PI*2;
      let ox = 0, oy = 0, oz = 0;
      if (M.r){ const eje = M.eje || 'y'; const a = fase; if (eje === 'y'){ ox = Math.cos(a)*M.r; oz = Math.sin(a)*M.r; } else if (eje === 'x'){ oy = Math.sin(a)*M.r; oz = Math.cos(a)*M.r; } else { ox = Math.cos(a)*M.r; oy = Math.sin(a)*M.r; } }
      else { const k = (1 - Math.cos(fase))/2; ox = (M.dx || 0)*k; oy = (M.dy || 0)*k; oz = (M.dz || 0)*k; }
      dx = c.bx0 + ox - c.x0; dy = c.by0 + oy - c.y0; dz = c.bz0 + oz - c.z0;
    }
    if (c.cayendo){
      c.cayendo += dt;
      if (c.cayendo > 0.35){ const v = (c.cayendo - 0.35)*16; dy = -v*dt; }
      if (c.cayendo > 3.2){ dx = c.bx0 - c.x0; dy = c.by0 - c.y0; dz = c.bz0 - c.z0; c.cayendo = 0; c.pisada = 0; evento(G, 'vuelve', {x: (c.bx0 + c.bx1)/2, y: c.by1, z: (c.bz0 + c.bz1)/2}); }
    }
    if (c.empujado && c.empujado.falta > 0){
      const k = Math.min(c.empujado.falta, dt/1.2); c.empujado.falta -= k;
      dx = c.empujado.dx*k; dz = c.empujado.dz*k;
      if (c.empujado.falta <= 0) c.movido = true;
    }
    if (!dx && !dy && !dz) continue;
    const encima = J.sobre === c && J.suelo;
    c.x0 += dx; c.x1 += dx; c.y0 += dy; c.y1 += dy; c.z0 += dz; c.z1 += dz;
    c.vx = dx/dt; c.vy = dy/dt; c.vz = dz/dt;
    if (encima && !c.cayendo){ J.x += dx; J.z += dz; if (dy > 0 || !cabezaChoca(G.N, J.x, J.z, c.y1)) J.y = c.y1; }
    else if (encima && c.cayendo){ J.y = Math.min(J.y, c.y1); }
    /* si la plataforma se mete en el jugador, lo empuja afuera */
    if (c.solido && !encima && J.y < c.y1 - 0.05 && J.y + ALTO > c.y0 && tocaXZ(J.x, J.z, R, c)){
      if (dy > 0 && J.y > c.y1 - 0.5){ J.y = c.y1; J.vy = Math.max(J.vy, 0); }
      else { const ox = Math.min(J.x + R - c.x0, c.x1 - (J.x - R)), oz = Math.min(J.z + R - c.z0, c.z1 - (J.z - R)); if (ox < oz) J.x += (J.x < (c.x0 + c.x1)/2 ? -ox : ox); else J.z += (J.z < (c.z0 + c.z1)/2 ? -oz : oz); }
    }
  }
}

/* ---- recoger monedas, cocadas, barajitas, chispas ---- */
function recoger(G){
  const J = G.J, N = G.N, cy = J.y + 0.75;
  const cerca = (o, r)=>Math.hypot(o.x - J.x, o.z - J.z) < (r || 0.9) && Math.abs(o.y - cy) < 1.3;
  for (const m of N.monedas){ if (m.vivo && cerca(m)){ m.vivo = false; G.P.monedas++; G.monedasNivel++; evento(G, 'moneda', {x: m.x, y: m.y, z: m.z}); } }
  for (const c of N.cocadas){
    if (!c.vivo || !cerca(c)) continue;
    c.vivo = false; G.cocadas++;
    evento(G, 'cocada', {x: c.x, y: c.y, z: c.z, n: G.cocadas, de: N.cocadas.length});
    if (G.cocadas === N.cocadas.length && !G.cocadasListas){ G.cocadasListas = true; ganarChispa(G, N.chispaCocadas, J.x, J.y + 2, J.z, 'cocadas'); }
  }
  for (const b of N.barajitas){ if (b.vivo && cerca(b, 1)){ b.vivo = false; if (!G.P.barajitas.includes(b.id)) G.P.barajitas.push(b.id); evento(G, 'barajita', {id: b.id, x: b.x, y: b.y, z: b.z}); } }
  if (G.metaViva && N.meta && cerca(N.meta, 1.2)){
    G.metaViva = false;
    ganarChispa(G, N.chispaMeta, N.meta.x, N.meta.y, N.meta.z, 'meta');
    G.fase = 'fin'; G.finT = 0;
    if (N.fin) for (const [pj, t] of N.fin) hablar(G, pj, t);
    evento(G, 'nivelListo', {n: G.n});
  }
}

/* ---- los NPC: hablan una vez al acercarse (y otra vez si se vuelve un rato después) ---- */
function pasoNpcs(G){
  const J = G.J;
  for (const n of G.N.npcs){
    const d = Math.hypot(n.x - J.x, n.z - J.z);
    if (d > (n.radio || 3.2) || Math.abs(n.y - J.y) > 3) continue;
    if (n.dichoT !== undefined && G.t - n.dichoT < (n.cada || 25)) continue;
    n.dichoT = G.t;
    n.i = ((n.i === undefined ? -1 : n.i) + 1) % n.frases.length;
    hablar(G, n.quien, n.frases[n.i]);
    if (n.tienda) evento(G, 'tienda', {});
    if (n.album) evento(G, 'album', {});
    if (n.antena) evento(G, 'antena', {});
  }
}

/* ---- enemigos ---- */
/* un enemigo de a pie no se mete en paredes ni se cae de su piso */
function bloqueaEnemigo(N, e, x, z){
  const D = ENEMIGOS[e.tipo];
  if (D.vuela || e.sinChoque) return false;
  for (const b of N.cajas) if (b.solido && e.y + 0.1 < b.y1 - 0.3 && e.y + (D.alto || 1) > b.y0 && x > b.x0 && x < b.x1 && z > b.z0 && z < b.z1) return true;
  const s = sueloEn(N, x, z, e.y + 0.6, 0.05);
  return !(s > e.y - 1.2);
}
function pasoEnemigos(G, dt){
  const J = G.J, N = G.N, cy = J.y;
  for (const e of N.enemigos){
    if (!e.vivo) continue;
    const D = ENEMIGOS[e.tipo];
    e.t += dt;
    const dx = J.x - e.x, dz = J.z - e.z, d = Math.hypot(dx, dz) || 1;
    if (e.empujeX){ e.x += e.empujeX*dt; e.z += e.empujeZ*dt; e.empujeX *= 0.9; e.empujeZ *= 0.9; if (Math.abs(e.empujeX) + Math.abs(e.empujeZ) < 0.2) e.empujeX = e.empujeZ = 0; }
    const ruta = e.ruta || 3;
    if (D.vuela){
      if (D.persigue && d < D.persigue && Math.abs(cy - e.y0) < 5){ e.x += dx/d*D.vel*dt; e.z += dz/d*D.vel*dt; e.y = lerp(e.y, J.y + 1.1, dt*1.5); }
      else { const a = e.t*D.vel/ruta + e.fase; const tx = e.x0 + Math.cos(a)*ruta, tz = e.z0 + Math.sin(a*(e.ocho ? 2 : 1))*ruta*(e.ocho ? 0.5 : 1); e.x = lerp(e.x, tx, dt*3); e.z = lerp(e.z, tz, dt*3); e.y = lerp(e.y, e.y0 + Math.sin(e.t*2 + e.fase)*0.35, dt*3); }
    } else {
      /* los de a pie patrullan ida y vuelta; algunos embisten o persiguen si te ven */
      if (D.carga && d < D.carga && Math.abs(cy - e.y) < 1.5 && e.estado === 'anda'){ e.estado = 'mira'; e.t = 0; }
      if (e.estado === 'mira'){ e.ang = Math.atan2(dx, dz); if (e.t > 0.7){ e.estado = 'carga'; e.t = 0; e.cvx = dx/d*D.vel*3.2; e.cvz = dz/d*D.vel*3.2; } }
      else if (e.estado === 'carga'){ const nx = e.x + e.cvx*dt, nz = e.z + e.cvz*dt; if (bloqueaEnemigo(N, e, nx + Math.sign(e.cvx)*0.4, nz + Math.sign(e.cvz)*0.4)){ e.estado = 'vuelve'; e.t = 0; } else { e.x = nx; e.z = nz; } if (e.t > 1.1 || Math.hypot(e.x - e.x0, e.z - e.z0) > (e.lejos || 10)){ e.estado = 'vuelve'; e.t = 0; } }
      else if (e.estado === 'vuelve'){ const hx = e.x0 - e.x, hz = e.z0 - e.z, hd = Math.hypot(hx, hz); if (hd < 0.3){ e.estado = 'anda'; e.t = 0; } else { e.x += hx/hd*D.vel*dt; e.z += hz/hd*D.vel*dt; e.ang = Math.atan2(hx, hz); } }
      else if (D.persigue && d < D.persigue && Math.abs(cy - e.y) < 1.5 && Math.hypot(e.x - e.x0, e.z - e.z0) < (e.lejos || 8) && !bloqueaEnemigo(N, e, e.x + dx/d*0.6, e.z + dz/d*0.6)){ e.x += dx/d*D.vel*dt; e.z += dz/d*D.vel*dt; e.ang = Math.atan2(dx, dz); }
      else {
        const eje = e.eje || 'x', dirX = eje === 'x' ? 1 : 0, dirZ = eje === 'z' ? 1 : 0;
        const pos = eje === 'x' ? e.x - e.x0 : e.z - e.z0;
        if (pos > ruta) e.dir = -1; else if (pos < -ruta) e.dir = 1;
        const nx = e.x + dirX*e.dir*D.vel*dt, nz = e.z + dirZ*e.dir*D.vel*dt;
        if (bloqueaEnemigo(N, e, nx + dirX*e.dir*0.5, nz + dirZ*e.dir*0.5)){
          e.dir = -e.dir;
          /* si queda encajonado (da vueltas sin avanzar), patrulla sin revisar bordes */
          if (e.t - (e.giroT || -9) < 0.4) e.giros = (e.giros || 0) + 1; else e.giros = 0;
          e.giroT = e.t; if (e.giros > 3) e.sinChoque = true;
        }
        else { e.x = nx; e.z = nz; }
        e.ang = Math.atan2(dirX*e.dir, dirZ*e.dir);
        /* los que se alejaron persiguiendo vuelven a su camino */
        const off = eje === 'x' ? e.z - e.z0 : e.x - e.x0; if (Math.abs(off) > 0.05){ if (eje === 'x') e.z -= off*Math.min(1, dt*2); else e.x -= off*Math.min(1, dt*2); }
      }
      if (D.salta){ e.vy -= GRAV*dt; e.y += e.vy*dt; const s = sueloEn(N, e.x, e.z, e.y + 0.5, 0.3); if (e.y <= s){ e.y = s; e.vy = e.t % 2 < dt*1.5 ? D.salta : 0; } }
      else { const s = sueloEn(N, e.x, e.z, e.y + 0.6, 0.3); if (s > -Infinity && Math.abs(s - e.y) < 1.2) e.y = lerp(e.y, s, dt*10); }
    }
    /* contacto con el jugador: pisarlo lo vence; si no, lastima */
    const alcance = D.radio + R;
    if (d < alcance && J.y < e.y + D.alto + 0.4 && J.y + ALTO > e.y){
      if (J.vy < -1 && J.y > e.y + D.alto*0.45){ vencerEnemigo(G, e, 'pisoton'); J.vy = 11; J.lanzado = true; J.dobleUsado = false; evento(G, 'pisoton', {}); }
      else if (J.ataque > 0 && (J.ataqueTipo === 'patada' || J.ataqueTipo === 'panzazo')) vencerEnemigo(G, e, J.ataqueTipo);
      else lastimar(G, e.x, e.z, 7);
    }
  }
}

/* ---- peligros ---- */
function pasoPeligros(G, dt){
  const J = G.J, N = G.N;
  for (const p of N.peligros){
    p.t += dt;
    if (p.tipo === 'canon'){
      const cada = p.cada || 3;
      if (Math.floor((p.t - dt)/cada) !== Math.floor(p.t/cada)){
        const d = Math.hypot(J.x - p.x, J.z - p.z);
        if (!p.alcance || d < p.alcance) dispararBala(G, p.x, p.y + 0.8, p.z, (p.dx || 0)*(p.vel || 10), p.vy || 5, (p.dz || 0)*(p.vel || 10));
      }
    } else if (p.tipo === 'rayos'){
      const cada = p.cada || 1.8;
      if (Math.floor((p.t - dt)/cada) !== Math.floor(p.t/cada) && J.x > p.x0 && J.x < p.x1 && J.z > p.z0 && J.z < p.z1)
        G.rayos.push({x: J.x + J.vx*0.5 + (G.azar() - 0.5)*2, z: J.z + J.vz*0.5 + (G.azar() - 0.5)*2, y: sueloEn(N, J.x, J.z, J.y + 1), t: 1.2});
    } else if (p.tipo === 'rodante'){
      /* barriles o bolas que bajan por un camino recto de (x0, z0) a (x1, z1) */
      const cada = p.cada || 3;
      if (Math.floor((p.t - dt)/cada) !== Math.floor(p.t/cada)) p.items.push({k: 0});
      const L = Math.hypot(p.x1 - p.x0, p.z1 - p.z0);
      for (let i = p.items.length - 1; i >= 0; i--){
        const it = p.items[i]; it.k += (p.vel || 5)*dt/L;
        if (it.k >= 1){ p.items.splice(i, 1); continue; }
        it.x = lerp(p.x0, p.x1, it.k); it.z = lerp(p.z0, p.z1, it.k); it.y = lerp(p.y0, p.y1 === undefined ? p.y0 : p.y1, it.k);
        if (Math.hypot(J.x - it.x, J.z - it.z) < (p.r || 0.7) + R && J.y < it.y + (p.r || 0.7)*2 && J.y + ALTO > it.y) lastimar(G, it.x, it.z, 8);
      }
    } else if (p.tipo === 'carros'){
      /* carros por carriles en x = p.carriles[i].x, entre z0 y z1 */
      if (!p.items.length) p.carriles.forEach((c, ci)=>{ for (let k = 0; k < (c.n || 3); k++) p.items.push({x: c.x, z: p.z0 + ((k/(c.n || 3) + ci*0.37) % 1)*(p.z1 - p.z0), v: c.v, color: ci}); });
      for (const it of p.items){
        it.z += it.v*dt;
        if (it.z > p.z1) it.z -= p.z1 - p.z0; else if (it.z < p.z0) it.z += p.z1 - p.z0;
        if (Math.abs(J.x - it.x) < 1 + R && Math.abs(J.z - it.z) < 2 + R && J.y < p.y + 1.5 && J.y + ALTO > p.y) lastimar(G, it.x, it.z - Math.sign(it.v)*3, 10);
      }
    } else if (p.tipo === 'pinchos'){
      /* pinchos que suben y bajan */
      const cada = p.cada || 2.4, arriba = (p.t % cada) < cada*0.5;
      p.arriba = arriba;
      if (arriba && Math.abs(J.x - p.x) < p.w/2 + R*0.5 && Math.abs(J.z - p.z) < p.d/2 + R*0.5 && J.y < p.y + 0.6 && J.y >= p.y - 0.1) lastimar(G, p.x, p.z, 6);
    } else if (p.tipo === 'fuego'){
      /* un chorro de fuego/vapor que prende y apaga */
      const cada = p.cada || 3, on = (p.t % cada) < (p.dura || 1.2);
      p.on = on;
      if (on && Math.hypot(J.x - p.x, J.z - p.z) < (p.r || 0.8) + R && J.y < p.y + (p.alto || 3) && J.y + ALTO > p.y) lastimar(G, p.x, p.z, 7);
    }
  }
  /* los rayos: el círculo avisa, a los 1,1 s cae */
  for (let i = G.rayos.length - 1; i >= 0; i--){
    const r = G.rayos[i]; r.t -= dt;
    if (r.t <= 0){ evento(G, 'rayo', {x: r.x, y: r.y, z: r.z}); if (Math.hypot(J.x - r.x, J.z - r.z) < 1.7 && Math.abs(J.y - r.y) < 2.5) lastimar(G, r.x, r.z, 8); G.rayos.splice(i, 1); }
  }
  /* las balas de cañón */
  for (let i = G.balas.length - 1; i >= 0; i--){
    const b = G.balas[i];
    b.vy -= 9*dt; b.x += b.vx*dt; b.y += b.vy*dt; b.z += b.vz*dt; b.vida -= dt;
    let fuera = b.vida <= 0 || b.y < -20;
    if (!fuera && Math.hypot(J.x - b.x, J.z - b.z) < 0.9 && b.y > J.y - 0.3 && b.y < J.y + ALTO + 0.3){ lastimar(G, b.x, b.z, 9); fuera = true; }
    if (!fuera && b.y <= sueloEn(N, b.x, b.z, b.y + 0.3)){ fuera = true; evento(G, 'explota', {x: b.x, y: b.y, z: b.z}); }
    if (fuera) G.balas.splice(i, 1);
  }
}

/* ---- las pedradas ---- */
function pasoProyectiles(G, dt){
  const N = G.N;
  for (let i = G.proyectiles.length - 1; i >= 0; i--){
    const p = G.proyectiles[i];
    const o = p.obj;
    let tx, ty, tz, vivo = false;
    if (o && o.e && o.e.vivo){ tx = o.e.x; ty = o.e.y + ENEMIGOS[o.e.tipo].alto*0.5; tz = o.e.z; vivo = true; }
    else if (o && o.jefe && o.jefe.vivo){ tx = o.jefe.x; ty = o.jefe.y + o.jefe.alto*0.5; tz = o.jefe.z; vivo = true; }
    else if (o && o.d && !o.d.activa){ tx = o.d.x; ty = o.d.y; tz = o.d.z; vivo = true; }
    else if (o && o.j && !o.j.abierta){ tx = o.j.x; ty = o.j.y + 0.8; tz = o.j.z; vivo = true; }
    if (vivo){ const dx = tx - p.x, dy = ty - p.y, dz = tz - p.z, d = Math.hypot(dx, dy, dz) || 1; p.vx = lerp(p.vx, dx/d*24, 0.25); p.vy = lerp(p.vy, dy/d*24, 0.25); p.vz = lerp(p.vz, dz/d*24, 0.25); }
    else p.vy -= 14*dt;
    p.x += p.vx*dt; p.y += p.vy*dt; p.z += p.vz*dt; p.vida -= dt;
    let fuera = p.vida <= 0 || p.y < -20;
    for (const e of N.enemigos){ if (fuera || !e.vivo) continue; if (Math.hypot(e.x - p.x, e.y + ENEMIGOS[e.tipo].alto*0.5 - p.y, e.z - p.z) < ENEMIGOS[e.tipo].radio + 0.35){ vencerEnemigo(G, e, 'pedrada'); fuera = true; } }
    const B = G.jefe;
    if (!fuera && B && B.vivo && B.activo && Math.hypot(B.x - p.x, B.y + B.alto*0.5 - p.y, B.z - p.z) < B.radio + 0.4){ pegarJefe(G, 'pedrada'); fuera = true; evento(G, 'pega', {x: p.x, y: p.y, z: p.z}); }
    for (const d of N.dianas){ if (fuera || d.activa) continue; if (Math.hypot(d.x - p.x, d.y - p.y, d.z - p.z) < 0.9){ activarDiana(G, d); fuera = true; } }
    for (const j of N.jaulas){ if (fuera || j.abierta) continue; if (Math.hypot(j.x - p.x, j.y + 0.8 - p.y, j.z - p.z) < 1.0){ golpearJaula(G, j); fuera = true; } }
    for (const c of N.cajasRompibles){ if (fuera || !c.solido) continue; if (p.x > c.x0 - 0.2 && p.x < c.x1 + 0.2 && p.y > c.y0 && p.y < c.y1 + 0.2 && p.z > c.z0 - 0.2 && p.z < c.z1 + 0.2){ romperCaja(G, c, 'pedrada'); fuera = true; } }
    if (!fuera) for (const c of N.cajas){ if (c.solido && p.x > c.x0 && p.x < c.x1 && p.y > c.y0 && p.y < c.y1 && p.z > c.z0 && p.z < c.z1){ fuera = true; evento(G, 'pega', {x: p.x, y: p.y, z: p.z}); break; } }
    if (fuera) G.proyectiles.splice(i, 1);
  }
}

/* ============================================================
   REVISOR DE NIVELES: ¿se puede llegar a todo?
   Arma un grafo entre plataformas (se puede ir de A a B si el
   salto alcanza en altura y en distancia) y recorre desde el
   inicio. Las puertas se abren cuando se alcanza su diana; las
   paredes rajadas cuentan como abiertas (el Mollejúo las tumba).
   Las plataformas móviles se toman en todo su recorrido.
   ============================================================ */
function alcanzables(N, pj, opts){
  opts = opts || {};
  /* 'equipo' = se puede cambiar de personaje en cualquier momento: vale lo mejor de los tres */
  const equipo = pj === 'equipo';
  const P = PJS[equipo ? 'primo' : pj];
  const altoMax = opts.alto !== undefined ? opts.alto : alturaSalto(equipo ? 'primo' : pj) - 0.15;
  const tAire = (P.salto + (P.doble || 0))/GRAV*1.5;
  const lejosMax = opts.lejos !== undefined ? opts.lejos : P.vel*tAire*0.72;
  const tira = pj === 'salomon' || equipo;
  /* cada plataforma sólida con piso que se pueda pisar; las móviles, con su caja de recorrido */
  const plats = N.cajas.filter(c=>c.visible !== false || c.mat).filter(c=>!c.rompible).map(c=>{
    let x0 = c.bx0, x1 = c.bx1, z0 = c.bz0, z1 = c.bz1, y0 = c.by1, y1 = c.by1;
    if (c.mueve){ const M = c.mueve; if (M.r){ const eje = M.eje || 'y'; if (eje === 'y'){ x0 -= M.r; x1 += M.r; z0 -= M.r; z1 += M.r; } else if (eje === 'x'){ z0 -= M.r; z1 += M.r; y0 -= M.r; y1 += M.r; } else { x0 -= M.r; x1 += M.r; y0 -= M.r; y1 += M.r; } } else { x0 = Math.min(x0, x0 + (M.dx || 0)); x1 = Math.max(x1, x1 + (M.dx || 0)); z0 = Math.min(z0, z0 + (M.dz || 0)); z1 = Math.max(z1, z1 + (M.dz || 0)); y0 = Math.min(y0, y0 + (M.dy || 0)); y1 = Math.max(y1, y1 + (M.dy || 0)); } }
    return {c, x0, x1, z0, z1, y0, y1};
  });
  const trampolin = t=>({c: {trampolin: t}, x0: t.x - t.r, x1: t.x + t.r, z0: t.z - t.r, z1: t.z + t.r, y0: t.y, y1: t.y, extra: t.fuerza*t.fuerza/(2*GRAV)});
  for (const t of N.trampolines) plats.push(trampolin(t));
  const chorros = N.peligros.filter(p=>p.tipo === 'chorro').map(p=>({c: {chorro: p}, x0: p.x - (p.r || 1.2), x1: p.x + (p.r || 1.2), z0: p.z - (p.r || 1.2), z1: p.z + (p.r || 1.2), y0: p.y, y1: p.y, extra: (p.alto || 8) + 1}));
  for (const c of chorros) plats.push(c);
  const bloqueada = c=>c.puerta && !abiertas.has(c.puerta);
  const abiertas = new Set();
  const distXZ = (a, b)=>{ const dx = Math.max(0, a.x0 - b.x1, b.x0 - a.x1), dz = Math.max(0, a.z0 - b.z1, b.z0 - a.z1); return Math.hypot(dx, dz); };
  const ini = {x0: N.inicio.x - 0.2, x1: N.inicio.x + 0.2, z0: N.inicio.z - 0.2, z1: N.inicio.z + 0.2, y0: N.inicio.y, y1: N.inicio.y};
  const vistos = new Set();
  let cola = plats.filter(p=>!bloqueada(p.c) && distXZ(p, ini) < 0.5 && Math.abs(p.y1 - ini.y1) < 0.4);
  cola.forEach(p=>vistos.add(p));
  const puede = (a, b)=>{
    if (bloqueada(b.c)) return false;
    const d = distXZ(a, b);
    const subir = b.y0 - a.y1;                       /* lo más fácil: del punto más alto de a al más bajo de b */
    const alto = altoMax + (a.extra || 0);
    if (subir > alto) return false;
    const caida = Math.max(0, a.y1 - b.y0);
    const lejos = lejosMax + P.vel*Math.sqrt(2*caida/GRAV)*0.8 + (a.extra ? 3 : 0);
    return d <= lejos;
  };
  let cambio = true;
  while (cambio){
    cambio = false;
    while (cola.length){
      const a = cola.pop();
      for (const b of plats){ if (vistos.has(b) || !puede(a, b)) continue; vistos.add(b); cola.push(b); }
    }
    /* dianas alcanzadas (a mano o con pedrada) abren puertas */
    for (const d of N.dianas){
      if (abiertas.has(d.abre)) continue;
      const llega = [...vistos].some(p=>Math.hypot(Math.max(0, p.x0 - d.x, d.x - p.x1), Math.max(0, p.z0 - d.z, d.z - p.z1)) < (tira ? 16 : 1.6) && d.y - p.y1 < (tira ? 12 : altoMax + 1.6));
      if (llega){ abiertas.add(d.abre); cambio = true; cola = [...vistos]; }
    }
  }
  const llegaA = (x, y, z, r)=>[...vistos].some(p=>{ const d = Math.hypot(Math.max(0, p.x0 - x, x - p.x1), Math.max(0, p.z0 - z, z - p.z1)); return d < (r || 1.2) && y - p.y1 < altoMax + 1.2 && p.y0 - y < 2.5; });
  return {vistos, llegaA, abiertas};
}

/* ============================================================
   LA RED: lo que viaja (ver red.js)
   ============================================================ */
const MAX_JUGADORES = 4;
function empaquetar(G, nombre){
  const J = G.J, r = (v, d)=>Math.round(v*(d || 100))/(d || 100);
  return {t: 'e', n: nombre, pj: J.pj, nv: G.n, x: r(J.x), y: r(J.y), z: r(J.z), a: r(J.ang), m: r(J.anda, 10), su: J.suelo ? 1 : 0, at: J.ataque > 0 ? J.ataqueTipo : '', v: J.vidas, p: Object.assign({}, G.P.puesto)};
}
function desempaquetar(m){
  if (!m || typeof m !== 'object' || m.t !== 'e' || ![m.x, m.y, m.z].every(Number.isFinite)) return null;
  const num = (v, a, b)=>Number.isFinite(v) ? clamp(v, a, b) : 0;
  const pj = ORDEN_PJS.includes(m.pj) ? m.pj : 'salomon';
  const nombre = String(m.n || '').replace(/[^\wáéíóúñÁÉÍÓÚÑ ]/g, '').slice(0, 14) || PJS[pj].nombre;
  const puesto = {};
  if (m.p && typeof m.p === 'object') for (const l of ['cabeza', 'cara', 'espalda']) if (TIENDA.some(t=>t.id === m.p[l])) puesto[l] = m.p[l];
  return {pj, nombre, nv: num(m.nv, 0, 12)|0, x: num(m.x, -500, 500), y: num(m.y, -60, 300), z: num(m.z, -500, 500), ang: num(m.a, -7, 7), mov: num(m.m, 0, 30), suelo: !!m.su,
    ataque: ['pedrada', 'patada', 'panzazo'].includes(m.at) ? m.at : '', vidas: num(m.v, 0, 5)|0, puesto};
}
/* una chispa o barajita ganada por un amigo también es tuya */
function recibirPremio(P, tipo, id){
  if (tipo === 'chispa' && typeof id === 'string' && /^\d+-[jcm]\d*$/.test(id) && !P.chispas.includes(id)){ P.chispas.push(id); return true; }
  if (tipo === 'barajita' && typeof id === 'string' && /^\d+-b\d$/.test(id) && !P.barajitas.includes(id)){ P.barajitas.push(id); return true; }
  return false;
}

const API = {MATERIALES, DECOS, CIELOS, DT, GRAV, R, ALTO, CORAZONES, PJS, ORDEN_PJS, TIENDA, AMIGOS, ENEMIGOS, JEFES, PIDE_PORTAL, MAX_JUGADORES,
  clamp, lerp, envolver, alturaSalto, SALTO_SIMPLE, azarCon, constructor, NIVELES, registrarNiveles, armarNivel, chispasDeNivel,
  progresoNuevo, progresoLimpio, comprar, lugarDe, crearPartida, paso, sueloEn, alcanzables, empaquetar, desempaquetar, recibirPremio,
  usarPoder, lastimar, curar, ganarChispa, hablar, avisar};
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else raiz.SALO = API;
})(typeof window !== 'undefined' ? window : globalThis);
