/* ============================================================
   PRUEBAS DE FERNANDO 3D
   Se corre con:   node pruebas.js
   Sin navegador: se carga solo el núcleo y un "niño robot" juega
   cada mundo de verdad (con la misma física que el juego): planea
   de plataforma en plataforma, salta, pisa enemigos y junta las
   monedas rojas y las estrellas. Así sabemos que TODAS las
   estrellas se pueden alcanzar saltando, sin trucos.
   ============================================================ */
const path = require('path');
const L = require(path.join(__dirname, 'nucleo.js'));
let fallos = 0;
const mal = m => { console.log('✗', m); fallos++; };
const bien = m => console.log('✓', m);

/* 1) frases y personajes */
for (const [clave, [quien, texto]] of Object.entries(L.FRASES)){
  if (!L.QUIEN[quien]) mal('frase sin personaje: ' + clave);
  const ops = Array.isArray(texto) ? texto : [texto];
  for (const t of ops) if (!t || t.length < 2) mal('frase vacía: ' + clave);
}
for (const m of L.MUNDOS) if (m.jefe && (!m.jefe.hola || !m.jefe.cae)) mal('al jefe de ' + m.id + ' le faltan frases');
const total = L.MUNDOS.reduce((n, m)=>n + m.estrellas.length, 0);
if (total !== L.CFG.ESTRELLAS_FIN) mal('hay ' + total + ' estrellas y se esperaban ' + L.CFG.ESTRELLAS_FIN);
else bien('hay ' + total + ' estrellas en total');
/* los cuadros piden menos estrellas de las que se pueden tener antes */
{
  const hub = L.MUNDOS[0];
  for (const po of hub.portales){
    let antes = hub.estrellas.length;
    for (const o of hub.portales) if (o.necesita < po.necesita) antes += L.MUNDOS[o.mundo].estrellas.length;
    if (po.necesita > antes) mal('el cuadro del mundo ' + po.mundo + ' pide ' + po.necesita + ' y solo se pueden tener ' + antes);
  }
}

/* ---------------- el niño robot ---------------- */
const SALTO_ALTO = 2.4, HUECO = 4.2;
function brecha(a, b){
  /* distancia horizontal entre dos piezas (0 si se tocan) */
  const ca = a.t === 'cil', cb = b.t === 'cil';
  if (ca && cb) return Math.max(0, Math.hypot(a.x - b.x, a.z - b.z) - a.r - b.r);
  if (ca || cb){
    const c = ca ? a : b, q = ca ? b : a;
    const dx = Math.max(0, Math.abs(c.x - q.x) - q.sx), dz = Math.max(0, Math.abs(c.z - q.z) - q.sz);
    return Math.max(0, Math.hypot(dx, dz) - c.r);
  }
  const dx = Math.max(0, Math.abs(a.x - b.x) - a.sx - b.sx), dz = Math.max(0, Math.abs(a.z - b.z) - a.sz - b.sz);
  return Math.hypot(dx, dz);
}
function puntoMasCerca(s, x, z, adentro){
  if (s.t === 'cil'){
    const dx = x - s.x, dz = z - s.z, d = Math.hypot(dx, dz) || 1, r = Math.max(0, Math.min(d, s.r - adentro));
    return {x: s.x + dx/d*r, z: s.z + dz/d*r};
  }
  return {x: L.clamp(x, s.x - s.sx + adentro, s.x + s.sx - adentro), z: L.clamp(z, s.z - s.sz + adentro, s.z + s.sz - adentro)};
}
function brechaMov(a, b){
  /* con las plataformas que se mueven vale el momento en que pasan más cerca */
  if (!a.mov && !b.mov) return brecha(a, b);
  let mejor = 1e9;
  for (let k = -1; k <= 1; k += 0.25){
    const q = s=>{ if (!s.mov) return s; const c = Object.assign({}, s); if (s.mov.eje === 'x') c.x = s.bx + k*s.mov.amp; else if (s.mov.eje === 'z') c.z = s.bz + k*s.mov.amp; return c; };
    mejor = Math.min(mejor, brecha(q(a), q(b)));
  }
  return mejor;
}
/* un punto de la pieza donde de verdad se pisa ESA pieza (no otra que esté encima) */
function puntoLibre(M, s, x, z){
  const cand = [];
  if (s.t === 'cil'){
    for (const f of [0, 0.35, 0.6, 0.85]) for (let k = 0; k < 16; k++){
      const r = Math.max(0, s.r - 0.6)*f, a = k/16*Math.PI*2;
      cand.push({x: s.x + Math.sin(a)*r, z: s.z + Math.cos(a)*r});
      if (f === 0) break;
    }
  } else {
    for (let i = 0; i <= 6; i++) for (let j = 0; j <= 6; j++)
      cand.push({x: s.x + (i/3 - 1)*Math.max(0, s.sx - 0.5), z: s.z + (j/3 - 1)*Math.max(0, s.sz - 0.5)});
  }
  let mejor = null, md = 1e9;
  for (const c of cand){
    if (L.suelo(M, c.x, c.z, 200, 0.7).s !== s) continue;
    const d = Math.hypot(c.x - x, c.z - z);
    if (d < md){ md = d; mejor = c; }
  }
  return mejor || puntoMasCerca(s, x, z, 0.8);
}
function alcanza(a, b){
  const dh = b.y1 - a.y1, gap = brechaMov(a, b);
  if (a.resorte) return dh < 6 && gap < 3;
  return dh <= SALTO_ALTO && gap <= HUECO;
}
function bajoDe(M, x, y, z){
  const g = L.suelo(M, x, z, y, 0.1);
  return g.s;
}
function ruta(M, desde, hasta){
  if (desde === hasta) return [];
  const prev = new Map([[desde, null]]), cola = [desde];
  while (cola.length){
    const a = cola.shift();
    if (a === hasta) break;
    for (const b of M.solidos){
      if (prev.has(b) || b.tubo) continue;
      if (alcanza(a, b)){ prev.set(b, a); cola.push(b); }
    }
  }
  if (!prev.has(hasta)) return null;
  const out = []; let c = hasta;
  while (c !== desde){ out.unshift(c); c = prev.get(c); }
  return out;
}
/* control que manda el robot este cuadro */
function robot(J, mem){
  const p = J.p, M = J.M;
  const inp = {x:0, y:0, camA:0, salto:false, poder:false, ayuda:false};
  const obj = mem.obj;
  if (!obj) return inp;
  /* sobre qué pieza estoy y en cuál está el objetivo */
  const aqui = p.enSuelo ? p.sobre : (mem.aqui || L.suelo(M, p.x, p.z, p.y, 0.3).s);
  if (p.enSuelo) mem.aqui = p.sobre;
  const meta = obj.pieza;
  let tx = obj.x, tz = obj.z, siguiente = null;
  if (aqui && meta && aqui !== meta){
    if (!mem.ruta || mem.desde !== aqui || mem.hacia !== meta){ mem.ruta = ruta(M, aqui, meta); mem.desde = aqui; mem.hacia = meta; }
    if (mem.ruta && mem.ruta.length){
      siguiente = mem.ruta[0];
      if ((siguiente.mov || aqui.mov) && (p.enSuelo || p.vy < 0) && brecha(aqui, siguiente) > brechaMov(aqui, siguiente) + 0.7){
        /* espera en la orilla a que la plataforma se acerque */
        const q = aqui.mov ? {x:aqui.x, z:aqui.z} : puntoMasCerca(aqui, siguiente.bx, siguiente.bz, 1.2);
        const ddx = q.x - p.x, ddz = q.z - p.z, dd = Math.hypot(ddx, ddz);
        if (dd > 0.3){ inp.y = ddz/dd; inp.x = -ddx/dd; }
        mem.ant = false; return inp;
      }
      const q = puntoLibre(M, siguiente, p.x, p.z);
      if (siguiente.resorte){ tx = siguiente.x; tz = siguiente.z; } else { tx = q.x; tz = q.z; }
    }
  }
  if (aqui && aqui.resorte && !p.enSuelo && mem.ruta && mem.ruta.length > 0){
    /* en el aire del resorte: ir hacia la pieza que sigue */
    const s2 = mem.ruta[0] === aqui ? mem.ruta[1] : mem.ruta[0];
    if (s2){ const q = puntoMasCerca(s2, p.x, p.z, 1); tx = q.x; tz = q.z; }
  }
  /* si una pared (un cilindro alto) está en medio, se pasa por un costado */
  {
    let mejor = null, md = 1e9;
    for (const s of M.solidos){
      const top = s.t === 'rampa' ? Math.max(s.ya, s.yb) : s.y1;
      if (top <= p.y + 0.6 || s.y0 >= p.y + 1.3 || (siguiente && s === siguiente)) continue;
      const r = (s.t === 'cil' ? s.r : Math.hypot(s.sx, s.sz)) + 0.7;
      const sx = tx - p.x, sz = tz - p.z, L2 = sx*sx + sz*sz || 1;
      const u = Math.max(0, Math.min(1, ((s.x - p.x)*sx + (s.z - p.z)*sz)/L2));
      const qx = p.x + sx*u, qz = p.z + sz*u, dd = Math.hypot(s.x - qx, s.z - qz);
      if (dd < r && u > 0 && u < 1 && Math.hypot(s.x - p.x, s.z - p.z) < md){ md = Math.hypot(s.x - p.x, s.z - p.z); mejor = {s, r, qx, qz, dd}; }
    }
    if (mejor){
      const {s, r} = mejor;
      let nx = mejor.qx - s.x, nz = mejor.qz - s.z, nl = Math.hypot(nx, nz);
      if (nl < 0.01){ nx = -(tz - p.z); nz = tx - p.x; nl = Math.hypot(nx, nz) || 1; }
      tx = s.x + nx/nl*(r + 0.8); tz = s.z + nz/nl*(r + 0.8);
    }
  }
  const dx = tx - p.x, dz = tz - p.z, d = Math.hypot(dx, dz);
  /* camA = 0: la palanca "arriba" va hacia +z y "derecha" hacia -x */
  if (d > 0.15){
    const k = Math.min(1, d/1.2);
    let ux = dx/d, uz = dz/d;
    if (mem.rodea > 0){ mem.rodea--; const a = (mem.atascos % 2 ? 1.35 : -1.35), c = Math.cos(a), s = Math.sin(a); const rx = ux*c - uz*s, rz = ux*s + uz*c; ux = rx; uz = rz; }
    inp.y = uz*k; inp.x = -ux*k;
  }
  /* saltar */
  const objetivoAlto = obj.y - p.y;
  if (siguiente && !siguiente.resorte){
    const dh = siguiente.y1 - p.y;
    const borde = brecha({t:'cil', x:p.x, z:p.z, r:0.01}, siguiente);
    let orilla = 9;
    if (aqui){ orilla = aqui.t === 'cil' ? aqui.r - Math.hypot(p.x - aqui.x, p.z - aqui.z) : Math.min(aqui.sx - Math.abs(p.x - aqui.x), aqui.sz - Math.abs(p.z - aqui.z)); }
    if (p.enSuelo && (dh > 0.45 || borde > 0.25) && (borde < 2.6 || (orilla < 0.5 && borde < 4.5))) inp.salto = true;
    if (!p.enSuelo && p.saltos === 1 && p.vy < 1.5 && p.y < siguiente.y1 + 0.3 && borde > 0.05) inp.salto = !mem.ant;
    if (!p.enSuelo && p.vy > 0) inp.salto = inp.salto || mem.ant;    // mantener para el salto alto
  } else if (!siguiente){
    if (p.enSuelo && objetivoAlto > 1.6 && d < 1.5) inp.salto = true;
    if (!p.enSuelo && p.vy > 0) inp.salto = true;
  }
  /* si se atasca, salta igual */
  mem.quieto = (Math.hypot(p.x - mem.px, p.z - mem.pz) < 0.02 && d > 0.6) ? mem.quieto + 1 : 0;
  mem.px = p.x; mem.pz = p.z;
  if (mem.quieto > 15 && !(mem.rodea > 0)){ mem.rodea = 70; mem.quieto = 0; mem.atascos = (mem.atascos || 0) + 1; }
  if (mem.quieto > 10 && mem.rodea > 0 && p.enSuelo && mem.atascos % 3 === 0) inp.salto = true;
  /* pisar o girar contra los enemigos que estorban */
  for (const e of M.enemigos){
    if (e.vivo && Math.hypot(e.x - p.x, e.z - p.z) < 2.2 && Math.abs(e.y - p.y) < 1.5) inp.poder = !mem.antPoder;
  }
  mem.ant = inp.salto; mem.antPoder = inp.poder;
  return inp;
}
/* elegir lo que falta: monedas rojas, el jefe, las estrellas */
function elegir(J){
  const M = J.M, p = J.p;
  const lista = [];
  for (const s of M.estrellas) if (s.visible && !s.tomada) lista.push({x:s.x, y:s.y, z:s.z, tipo:'estrella', ref:s});
  if (!lista.length) for (const m of M.rojas) if (m.vivo) lista.push({x:m.x, y:m.y, z:m.z, tipo:'roja', ref:m});
  if (!lista.length && M.jefe && M.jefe.vivo) lista.push({x:M.jefe.x, y:M.jefe.y, z:M.jefe.z, tipo:'jefe', ref:M.jefe});
  if (!lista.length) return null;
  lista.sort((a, b)=>Math.hypot(a.x - p.x, a.z - p.z) - Math.hypot(b.x - p.x, b.z - p.z));
  const o = lista[0];
  if (o.tipo === 'jefe'){ o.x = M.jefe.x; o.z = M.jefe.z; o.y = M.jefe.y + 3.2; }
  o.pieza = bajoDe(M, o.x, o.y, o.z);
  return o;
}

function jugarMundo(n, opciones){
  opciones = opciones || {};
  const J = L.crearJuego({semilla: 11 + n, prog: {intro:true, estrellas:{}, vuelta: opciones.vuelta || 0}});
  L.empezar(J);
  L.cargarMundo(J, n, null);
  const M = J.M;
  const mem = {px:0, pz:0, quieto:0};
  let f = 0, rescates = 0;
  const LIM = 60*60*8;
  const quiere = M.def.estrellas.filter(s=>s.tipo !== 'gol').length;   /* el gol se prueba aparte */
  let tomadas = 0;
  for (; f < LIM; f++){
    if (J.mundo !== n) break;
    if (f % 15 === 0 || !mem.obj || (mem.obj.ref && (mem.obj.ref.vivo === false || mem.obj.ref.tomada))){
      const o = elegir(J); if (!o) break;
      if (!mem.obj || mem.obj.ref !== o.ref) mem.ruta = null;
      mem.obj = o;
    }
    J.eventos.length = 0;
    L.paso(J, 1/60, robot(J, mem));
    for (const e of J.eventos) if (e.tipo === 'rescate'){ rescates++; mem.aqui = null; mem.ruta = null; }
    tomadas = M.estrellas.filter(s=>s.tomada).length;
    if (tomadas >= quiere) break;
  }
  return {tomadas, quiere, seg: (f/60).toFixed(0), rescates, J};
}

for (let n = 0; n < L.MUNDOS.length; n++){
  const def = L.MUNDOS[n];
  /* toda pieza con estrella o moneda roja tiene que estar conectada con el inicio */
  const J = L.crearJuego({prog:{intro:true}});
  L.cargarMundo(J, n, null);
  const M = J.M;
  const inicio = L.suelo(M, def.inicio.x, def.inicio.z, 100, 0).s;
  const cosas = M.estrellas.map(s=>['estrella ' + s.id, s]).concat(M.rojas.map((r, i)=>['roja ' + i, r]));
  if (M.jefe) cosas.push(['jefe', {x:M.jefe.x, y:M.jefe.y + 0.5, z:M.jefe.z}]);
  for (const [nom, o] of cosas){
    const pz = bajoDe(M, o.x, o.y, o.z);
    if (!pz){ mal(def.id + ': ' + nom + ' no tiene suelo debajo'); continue; }
    if (o.y - pz.y1 > (pz.resorte ? 6 : 3.4)) mal(def.id + ': ' + nom + ' está muy alta (' + (o.y - pz.y1).toFixed(1) + ' m)');
    if (!ruta(M, inicio, pz) && pz !== inicio) mal(def.id + ': no hay camino de saltos hasta ' + nom);
  }
  for (const c of M.cajas) if (!isFinite(c.y)) mal(def.id + ': caja sin suelo en ' + c.x + ',' + c.z);
  for (const e of M.enemigos) if (!isFinite(e.y)) mal(def.id + ': enemigo sin suelo en ' + e.x + ',' + e.z);
  for (const m of M.monedas){ const g = L.suelo(M, m.x, m.z, m.y, 2.5); if (!g.s || m.y - g.y > 6) mal(def.id + ': moneda flotando sobre el vacío en ' + m.x.toFixed(1) + ',' + m.z.toFixed(1)); }

  /* el robot juega el mundo de verdad */
  const r = jugarMundo(n);
  if (r.tomadas < r.quiere) mal(def.id + ': el robot solo consiguió ' + r.tomadas + ' de ' + r.quiere + ' estrellas en ' + r.seg + ' s');
  else bien(def.id + ': el robot consiguió las ' + r.quiere + ' estrellas en ' + r.seg + ' s (' + r.rescates + ' rescates de Tío Juan)');
}

/* 3) el niño que no sabe jugar: nunca pierde, Tío Juan lo rescata */
{
  const J = L.crearJuego({prog:{intro:true}});
  L.empezar(J); L.cargarMundo(J, 1, null);
  let rescates = 0;
  for (let f = 0; f < 60*90; f++){
    J.eventos.length = 0;
    L.paso(J, 1/60, {x: Math.sin(f/50), y: Math.cos(f/77), camA: 0, salto: (f % 40) < 10, poder: (f % 90) < 2, ayuda: (f % 300) < 2});
    for (const e of J.eventos) if (e.tipo === 'rescate') rescates++;
    if (!isFinite(J.p.x + J.p.y + J.p.z)) { mal('la posición se volvió NaN'); break; }
  }
  if (J.p.y < J.M.def.yMuerte) mal('Fernando quedó en el vacío');
  else bien('el niño que aprieta todo sigue jugando (' + rescates + ' rescates)');
  /* y saltar al agua a propósito: nada (no se hunde) */
  const J2 = L.crearJuego({prog:{intro:true}});
  L.empezar(J2); L.cargarMundo(J2, 1, null);
  let rescate = false, nado = 0, minY = Infinity;
  for (let f = 0; f < 60*12; f++){
    J2.eventos.length = 0;
    L.paso(J2, 1/60, {x:0, y:-1, camA:Math.PI, salto: f % 30 < 5 && !J2.p.nada});
    if (J2.eventos.some(e=>e.tipo === 'rescate')) rescate = true;
    if (J2.p.nada){ nado++; minY = Math.min(minY, J2.p.y); }
  }
  const aguaY = J2.M.def.agua.y;
  if (rescate || nado < 60) mal('al caer al agua no nadó (nadando ' + nado + ' cuadros, rescate: ' + rescate + ')');
  else bien('en el agua Fernando nada (' + (nado/60).toFixed(1) + ' s) sin hundirse (más hondo: ' + (minY - aguaY).toFixed(2) + ' m)');
  if (J2.p.nada && Math.hypot(J2.p.x, J2.p.z) > 400) mal('nadó hasta el infinito');
  /* nadando de vuelta, sale solito a la orilla */
  let fuera = false;
  for (let f = 0; f < 60*20 && !fuera; f++){
    const p = J2.p, s = p.seguro, dx = s.x - p.x, dz = s.z - p.z, l = Math.hypot(dx, dz) || 1;
    L.paso(J2, 1/60, {x: -dx/l, y: -dz/l, camA: Math.PI});
    if (J2.p.enSuelo && !J2.p.nada) fuera = true;
  }
  if (fuera) bien('nadando hacia la orilla, sale del agua solito'); else mal('no pudo salir del agua');
  /* la lava sí: Tío Juan lo rescata */
  const J3 = L.crearJuego({prog:{intro:true}}); L.empezar(J3); L.cargarMundo(J3, 5, null);
  for (let i = 0; i < 30; i++) L.paso(J3, 1/60, {});
  J3.p.y = J3.M.def.agua.y - 0.8; J3.p.enSuelo = false; J3.p.vy = -1; J3.eventos.length = 0;
  L.paso(J3, 1/60, {});
  if (J3.eventos.some(e=>e.tipo === 'rescate') && !J3.p.nada) bien('en la lava no se nada: Tío Juan lo rescata'); else mal('en la lava no lo rescató');
}

/* 4) cada poder hace lo suyo */
{
  const base = ()=>{ const J = L.crearJuego({prog:{intro:true}}); L.empezar(J); L.cargarMundo(J, 1, null); for (let i = 0; i < 30; i++) L.paso(J, 1/60, {}); return J; };
  const altura = (J, inp)=>{ let max = J.p.y; for (let f = 0; f < 120; f++){ L.paso(J, 1/60, Object.assign({camA:0}, inp(f))); max = Math.max(max, J.p.y); } return max; };
  const hNormal = altura(base(), f=>({salto: f < 40}));
  const Jt = base(); L.dar(Jt, 'tenis'); const hTenis = altura(Jt, f=>({salto: f < 40}));
  const Ja = base(); L.dar(Ja, 'alas'); const hAlas = altura(Ja, f=>({salto: f < 2 || f > 4}));
  if (!(hTenis > hNormal + 1.5)) mal('los tenis no hacen saltar más alto (' + hNormal.toFixed(1) + ' vs ' + hTenis.toFixed(1) + ')');
  if (!(hAlas > 6)) mal('la gorra alada no hace volar (' + hAlas.toFixed(1) + ')');
  bien('salto normal ' + hNormal.toFixed(1) + ' m · con tenis ' + hTenis.toFixed(1) + ' m · con alas ' + hAlas.toFixed(1) + ' m');
  /* velocidad con la hamburguesa */
  const vel = (J)=>{ const x0 = J.p.z; for (let f = 0; f < 40; f++) L.paso(J, 1/60, {y:-1, camA:0}); return Math.abs(J.p.z - x0); };
  const vN = vel(base()); const Jh = base(); L.dar(Jh, 'hamburguesa'); const vH = vel(Jh);
  if (!(vH > vN*1.4)) mal('la hamburguesa no hace correr más rápido');
  else bien('la hamburguesa hace correr ' + (vH/vN).toFixed(1) + ' veces más rápido');
  /* el fuego vence a un enemigo */
  const Jf = base(); L.dar(Jf, 'fuego');
  const e = Jf.M.enemigos.find(x=>x.tipo === 'grunon');
  e.x = Jf.p.x; e.z = Jf.p.z - 5; e.hx = e.x; e.hz = e.z; e.y = e.hy = Jf.p.y; e.vel = 0;
  Jf.p.ang = Math.PI;
  for (let f = 0; f < 90; f++) L.paso(Jf, 1/60, {camA: Math.PI, poder: f % 10 < 5});
  if (e.vivo) mal('la bola de fuego no venció al gruñón'); else bien('la flor de fuego vence a los gruñones');
  /* el imán trae las monedas */
  const Ji = base(); L.dar(Ji, 'iman'); const m0 = Ji.prog.monedas;
  for (let f = 0; f < 120; f++) L.paso(Ji, 1/60, {camA:Math.PI, y: f < 60 ? 1 : 0});
  if (!(Ji.prog.monedas > m0 + 3)) mal('el imán no atrajo monedas'); else bien('el imán atrajo ' + (Ji.prog.monedas - m0) + ' monedas');
  /* gigante: crece */
  const Jg = base(); L.dar(Jg, 'gigante'); for (let f = 0; f < 60; f++) L.paso(Jg, 1/60, {camA:0});
  if (!(Jg.p.escala > 2)) mal('el hongo gigante no hizo crecer a Fernando'); else bien('el hongo gigante hace crecer a Fernando');
  /* Tío Juan ayuda */
  const Jj = base();
  const cerca = Jj.M.enemigos.filter(x=>x.tipo === 'grunon').slice(0, 2);
  cerca.forEach((x, i)=>{ x.x = x.hx = Jj.p.x + 4 + i; x.z = x.hz = Jj.p.z; x.y = x.hy = Jj.p.y; x.vel = 0; });
  for (let f = 0; f < 240; f++) L.paso(Jj, 1/60, {camA:0, ayuda: f < 3});
  if (cerca.some(x=>x.vivo)) mal('Tío Juan no venció a los gruñones al pedir ayuda'); else bien('Tío Juan vence a los gruñones cuando Fernando pide ayuda');
  const Jr = base();
  for (const x of Jr.M.enemigos) x.vivo = false;
  const antes = Jr.M.cajas.length;
  L.paso(Jr, 1/60, {camA:0, ayuda:true});
  if (Jr.M.cajas.length !== antes + 1) mal('sin enemigos cerca, Tío Juan no trajo un regalo'); else bien('sin enemigos, Tío Juan trae un regalo con un poder');
}

/* 4b) volar no parpadea y Tío Juan se mueve suave */
{
  const J = L.crearJuego({prog:{intro:true}}); L.empezar(J); L.cargarMundo(J, 1, null);
  for (let i = 0; i < 30; i++) L.paso(J, 1/60, {});
  L.dar(J, 'alas');
  let cambios = 0, ant = null, saltoTio = 0, malo = false, prev = null, saltoPerro = 0, prevP = null;
  for (let f = 0; f < 60*10; f++){
    /* sube hasta el techo, se queda arriba, y corre en círculos para que Tío Juan lo siga */
    L.paso(J, 1/60, {salto: f < 60*7, camA: 0, x: Math.sin(f/40), y: Math.cos(f/40)});
    if (ant !== null && J.p.vuela !== ant && !J.p.enSuelo) cambios++;
    ant = J.p.vuela;
    const t = J.tio;
    if (!isFinite(t.x + t.y + t.z + t.vx + t.vy + t.vz)) malo = true;
    if (prev) saltoTio = Math.max(saltoTio, Math.hypot(t.x - prev.x, t.y - prev.y, t.z - prev.z));
    prev = {x: t.x, y: t.y, z: t.z};
    if (prevP) J.perros.forEach((g, i)=>{ saltoPerro = Math.max(saltoPerro, Math.hypot(g.x - prevP[i].x, g.y - prevP[i].y, g.z - prevP[i].z)); });
    prevP = J.perros.map(g=>({x: g.x, y: g.y, z: g.z}));
  }
  if (cambios) mal('Fernando cambió de pose ' + cambios + ' veces volando (parpadeo)'); else bien('volar con la gorra alada no parpadea');
  if (malo || saltoTio > 0.5) mal('Tío Juan se movió a saltos (' + saltoTio.toFixed(2) + ' m en un cuadro)'); else bien('Tío Juan vuela suave (máximo ' + saltoTio.toFixed(2) + ' m por cuadro)');
  if (saltoPerro > 0.5) mal('Penny y Sheldon saltaron ' + saltoPerro.toFixed(2) + ' m en un cuadro mientras Fernando volaba (parpadeo)'); else bien('Penny y Sheldon lo siguen por el suelo sin parpadear (máximo ' + saltoPerro.toFixed(2) + ' m por cuadro)');
  /* al aterrizar lejos, los perritos llegan a su lado */
  for (let f = 0; f < 60*6; f++) L.paso(J, 1/60, {});
  const lejos = Math.max(...J.perros.map(g=>Math.hypot(g.x - J.p.x, g.z - J.p.z) + Math.abs(g.y - J.p.y)));
  if (lejos > 5) mal('después de aterrizar los perritos quedaron lejos (' + lejos.toFixed(1) + ' m)'); else bien('después de aterrizar, Penny y Sheldon están con Fernando');
}

/* 4d) las vueltas: con todas las estrellas, al volver al castillo empieza otra vuelta; la estrella del
   monumento y las monedas rojas se cambian de lugar entre ellas (los mismos lugares que el robot ya
   alcanzó, así que todo se sigue pudiendo alcanzar) */
{
  const clave = (x, z)=>Math.round(x*10) + ',' + Math.round(z*10);
  let ok = true, movidas = 0, total = 0;
  for (let n = 1; n < L.MUNDOS.length; n++){
    const J0 = L.crearJuego({prog:{intro:true}}); L.cargarMundo(J0, n, null);
    const antes = J0.M.estrellas.filter(s=>s.tipo === 'libre').map(s=>clave(s.x, s.z)).concat(J0.M.rojas.map(r=>clave(r.x, r.z))).sort().join('|');
    for (const vuelta of [1, 2, 3]){
      const J1 = L.crearJuego({prog:{intro:true, vuelta}}); L.cargarMundo(J1, n, null);
      const libre = J1.M.estrellas.find(s=>s.tipo === 'libre'), orig = J0.M.estrellas.find(s=>s.tipo === 'libre');
      const despues = J1.M.estrellas.filter(s=>s.tipo === 'libre').map(s=>clave(s.x, s.z)).concat(J1.M.rojas.map(r=>clave(r.x, r.z))).sort().join('|');
      if (!libre) continue;
      total++;
      if (despues !== antes){ ok = false; mal(L.MUNDOS[n].id + ' vuelta ' + (vuelta + 1) + ': las cosas quedaron en lugares nuevos sin probar'); }
      if (clave(libre.x, libre.z) !== clave(orig.x, orig.z)) movidas++;
      for (const r of J1.M.rojas.concat([libre])){ const g = L.suelo(J1.M, r.x, r.z, r.y, 0.3); if (!g.s || r.y - g.y > 6) { ok = false; mal(L.MUNDOS[n].id + ': algo quedó flotando en la vuelta ' + (vuelta + 1)); } }
    }
  }
  if (ok && movidas === total) bien('en las vueltas nuevas la estrella del monumento siempre cambia de lugar (' + movidas + ' de ' + total + ') y todo queda donde se alcanza');
  else if (ok) mal('en ' + (total - movidas) + ' vueltas la estrella quedó en el mismo lugar');
  /* el reinicio: con todas las estrellas, al volver al castillo empieza la vuelta 2 */
  const J = L.crearJuego({prog:{intro:true}}); L.empezar(J);
  for (const m of L.MUNDOS) for (const e of m.estrellas) J.prog.estrellas[m.id + ':' + e.id] = true;
  delete J.prog.estrellas['pradera:torre'];
  L.cargarMundo(J, 1, null);
  for (let i = 0; i < 30; i++) L.paso(J, 1/60, {});
  const s = J.M.estrellas.find(e=>e.id === 'torre'); J.p.x = s.x; J.p.z = s.z; J.p.y = s.y - 1; J.p.vy = 0; J.p.enSuelo = false;
  for (let i = 0; i < 10; i++) L.paso(J, 1/60, {});
  const lista = J.prog.vueltaLista;
  L.cargarMundo(J, 0, 1);
  if (lista && J.prog.vuelta === 1 && L.cuentaEstrellas(J.prog) === 0 && J.dichos.includes('vuelta')) bien('con las 29 estrellas, al volver al castillo empieza la vuelta 2 (las estrellas se esconden otra vez)');
  else mal('no empezó la vuelta 2 (lista: ' + lista + ', vuelta: ' + J.prog.vuelta + ', estrellas: ' + L.cuentaEstrellas(J.prog) + ')');
}

/* 4e) los súper poderes */
{
  const base = (n)=>{ const J = L.crearJuego({prog:{intro:true}}); L.empezar(J); L.cargarMundo(J, n == null ? 1 : n, null); for (let i = 0; i < 30; i++) L.paso(J, 1/60, {}); J.M.enemigos.length = 0; return J; };
  const poner = (J, tipo, dx, dz)=>{ const e = L.nuevoEnemigo(J, tipo || 'grunon', J.p.x + dx, J.p.z + dz, {}); e.vel = 0; J.M.enemigos.push(e); return e; };
  /* clones: cada salto saca otro Fernando que lo sigue */
  {
    const J = base(); L.dar(J, 'clon');
    for (let k = 0; k < 6; k++){ for (let i = 0; i < 40; i++) L.paso(J, 1/60, {salto: i < 8, y: 1, camA: 0}); }
    const n = J.clones.length;
    const e = poner(J, 'grunon', 0, 0); e.y = J.clones[n - 1].y; e.x = J.clones[n - 1].x; e.z = J.clones[n - 1].z;
    L.paso(J, 1/60, {});
    if (n === 4 && !e.vivo) bien('caja de clones: al saltar aparecen ' + n + ' Fernandos que lo siguen y vencen a los gruñones');
    else mal('los clones no funcionan (clones: ' + n + ', gruñón vivo: ' + e.vivo + ')');
    J.p.tPoder = 0.01; L.paso(J, 1/60, {}); L.paso(J, 1/60, {});
    if (J.clones.length) mal('los clones no se van cuando se acaba el poder'); else bien('los clones se van cuando se acaba el poder');
  }
  /* súper vuelo: mucho más rápido que la gorra alada */
  {
    const vel = (poder)=>{ const J = base(); L.dar(J, poder); let vmax = 0;
      for (let i = 0; i < 240; i++){ L.paso(J, 1/60, {salto: true, y: 1, camA: 0}); vmax = Math.max(vmax, Math.hypot(J.p.vx, J.p.vz)); } return vmax; };
    const va = vel('alas'), vc = vel('cohete');
    if (vc > va*2) bien('súper vuelo: ' + vc.toFixed(1) + ' m/s (la gorra alada va a ' + va.toFixed(1) + ')'); else mal('el súper vuelo no es más rápido (' + vc.toFixed(1) + ' vs ' + va.toFixed(1) + ')');
  }
  /* súper fuerza: el golpe al suelo tumba a todos alrededor */
  {
    const J = base(); L.dar(J, 'fuerza');
    const es = [poner(J, 'grunon', 3, 0), poner(J, 'grunon', -3, 1), poner(J, 'grunon', 0, -4)];
    L.paso(J, 1/60, {poder: true});
    if (es.every(e=>!e.vivo)) bien('súper fuerza: un golpe tumba a los ' + es.length + ' gruñones de alrededor'); else mal('la súper fuerza no tumbó a todos');
  }
  /* ojos láser: el rayo vence al de enfrente */
  {
    const J = base(); L.dar(J, 'laser');
    const e = poner(J, 'grunon', Math.sin(J.p.ang)*10, Math.cos(J.p.ang)*10);
    J.eventos.length = 0; L.paso(J, 1/60, {poder: true});
    if (!e.vivo && J.eventos.some(x=>x.tipo === 'laser')) bien('ojos láser: el rayo vence al gruñón de enfrente a 10 m'); else mal('el láser no le pegó al gruñón');
  }
  /* robot: no lo lastiman y sus misiles vencen */
  {
    const J = base(); L.dar(J, 'robot');
    for (let i = 0; i < 30; i++) L.paso(J, 1/60, {});
    const e = poner(J, 'grunon', Math.sin(J.p.ang)*8, Math.cos(J.p.ang)*8);
    L.paso(J, 1/60, {poder: true});
    for (let i = 0; i < 40; i++) L.paso(J, 1/60, {});
    const golpe = poner(J, 'grunon', 0.3, 0); const inv0 = J.p.invul;
    L.paso(J, 1/60, {});
    if (!e.vivo && J.p.escala > 1.2 && J.p.invul === inv0) bien('Fernando robot: más grande, los gruñones no lo lastiman y sus misiles los vencen');
    else mal('el robot no funciona (misil: ' + !e.vivo + ', escala: ' + J.p.escala.toFixed(2) + ')');
  }
  /* al entrar a cada cuadro: un súper poder nuevo, y van rotando */
  {
    const J = L.crearJuego({prog:{intro:true}}); L.empezar(J);
    for (let i = 0; i < 10; i++) L.paso(J, 1/60, {});
    const vistos = [];
    for (let k = 0; k < 5; k++){
      if (J.mundo !== 0){ L.irA(J, 0, J.mundo); for (let i = 0; i < 90; i++) L.paso(J, 1/60, {}); }
      const po = J.M.portales.find(p=>p.mundo === 1);
      J.p.x = po.x; J.p.z = po.z; J.p.y = po.y;
      for (let i = 0; i < 90 && (J.mundo !== 1 || J.trans); i++) L.paso(J, 1/60, {});
      vistos.push(J.p.poder);
    }
    if (new Set(vistos).size === 5 && vistos.every(v=>L.SUPER.includes(v))) bien('al entrar a cada cuadro le toca un súper poder nuevo: ' + vistos.join(', '));
    else mal('los súper poderes de los cuadros no rotan: ' + vistos.join(', '));
  }
}

/* 4c) Argentina: patear la pelota hasta el arco es gol y aparece la estrella */
{
  const n = L.MUNDOS.findIndex(m=>m.id === 'argentina');
  const J = L.crearJuego({prog:{intro:true}}); L.empezar(J); L.cargarMundo(J, n, null);
  for (let i = 0; i < 30; i++) L.paso(J, 1/60, {});
  const b = J.M.pelotas[0], est = J.M.estrellas.find(s=>s.tipo === 'gol');
  if (est.visible) mal('la estrella del gol se ve antes del gol');
  J.p.x = b.x - 3; J.p.z = b.z; J.p.y = b.y; J.p.vx = J.p.vz = 0;
  let gol = false, patadas = 0;
  for (let f = 0; f < 60*12 && !gol; f++){
    J.eventos.length = 0;
    /* corre detrás de la pelota empujándola hacia el arco de x = +16 (camA = 0: "derecha" va hacia -x) */
    const dz = b.z - J.p.z, dx = b.x - 0.6 - J.p.x;
    L.paso(J, 1/60, {camA: 0, x: -Math.sign(dx)*Math.min(1, Math.abs(dx)), y: Math.max(-1, Math.min(1, dz))});
    for (const e of J.eventos){ if (e.tipo === 'gol') gol = true; if (e.tipo === 'patada') patadas++; }
  }
  if (gol && est.visible) bien('¡gol! con ' + patadas + ' patadas la pelota entró al arco y apareció la estrella');
  else mal('no hubo gol (patadas: ' + patadas + ', pelota en ' + b.x.toFixed(1) + ', ' + b.z.toFixed(1) + ')');
  /* la pelota que se va al agua vuelve a la cancha */
  b.x = 40; b.z = 30; b.y = 3; b.vx = b.vz = 0; b.golT = 0;
  for (let i = 0; i < 120; i++) L.paso(J, 1/60, {});
  if (Math.hypot(b.x - b.x0, b.z - b.z0) < 0.5) bien('la pelota que cae al agua vuelve al centro de la cancha'); else mal('la pelota se perdió en el agua');
}

/* 5) el castillo: los cuadros se abren con estrellas y el final llega */
{
  const J = L.crearJuego({prog:{intro:true}});
  L.empezar(J);
  for (let i = 0; i < 10; i++) L.paso(J, 1/60, {});
  const po = J.M.portales.find(p=>p.mundo === 3);
  J.p.x = po.x + 0.2; J.p.z = po.z + 0.2;
  L.paso(J, 1/60, {});
  if (J.trans) mal('el cuadro del mundo 3 se abrió sin estrellas'); else bien('el cuadro del mundo 3 está cerrado sin estrellas');
  const po1 = J.M.portales.find(p=>p.mundo === 1);
  J.p.x = po1.x; J.p.z = po1.z;
  for (let i = 0; i < 90; i++) L.paso(J, 1/60, {});
  if (J.mundo !== 1) mal('el cuadro del mundo 1 no llevó a la pradera'); else bien('el cuadro del mundo 1 lleva a la pradera');
  /* el tubo vuelve al castillo */
  const t = J.M.def.tubo;
  J.p.x = t.x; J.p.z = t.z; J.p.y = J.M.solidos.find(s=>s.tubo).y1 + 0.5; J.p.vy = 0;
  for (let i = 0; i < 120; i++) L.paso(J, 1/60, {});
  if (J.mundo !== 0) mal('el tubo no devolvió al castillo'); else bien('el tubo verde devuelve al castillo');
  /* la gran estrella termina el juego */
  const r = jugarMundo(5);
  if (r.J.fase !== 'final' || !r.J.prog.ganado) mal('vencer al Rey Gruñón no lleva al final'); else bien('vencer al Rey Gruñón lleva al final feliz');
  if (!r.J.dichos.includes('final2')) mal('falta la frase final de Fernando');
}

console.log(fallos ? '\n' + fallos + ' prueba(s) fallaron' : '\nTodo bien ✓');
process.exit(fallos ? 1 : 0);
