'use strict';
/* ============================================================
   LUCA PILOTO: ¡DE AVIÓN A NAVE GALÁCTICA! — el NÚCLEO
   Aquí vive todo lo que pasa en el juego (vuelo, guion, estrellas,
   naves malas, la Bola Gris) sin tocar la pantalla, para poder
   probarlo con node. La vista (vista.js) solo lo dibuja.

   Como en todo Fernando Bros, aquí NUNCA se pierde: si algo te
   choca solo se te caen unas estrellas y sigues volando.
   ============================================================ */
(function(raiz){

const CFG = {
  LARGO_CIELO: 2400,      // metros de vuelo en el cielo antes del cristal
  LARGO_ESPACIO: 3200,    // metros de espacio antes de la Bola Gris
  VEL_CIELO: 32,
  VEL_ESPACIO: 42,
  XMAX: 15, YMIN: 2, YMAX: 24, YCENTRO: 13,
  RADIO_LUCA: 1.2,
  VEL_LASER: 180,
  JEFE_REL: 110,          // a cuántos metros se queda la Bola Gris
  JEFE_RADIO: 30,
  JEFE_VIDA: 150,
  TURBO: 6,
  DURA_TRANS: 3.4,
};

/* Quién habla: nombre en pantalla, color del globito y tono de voz */
const QUIEN = {
  luca:    {nombre:'Luca',      color:'#ffe36e', emoji:'🧒', pitch:1.75, rate:1.05},
  tio:     {nombre:'Tío Juan',  color:'#6ab0ff', emoji:'🦸', pitch:0.7,  rate:0.95},
  gaby:    {nombre:'Tía Gaby',  color:'#ff9ed6', emoji:'👩‍🚀', pitch:1.3,  rate:1.0},
  malvado: {nombre:'El Malvado',color:'#b0b0c0', emoji:'😈', pitch:0.2,  rate:0.8},
};

/* Todas las frases del juego (las pruebas revisan que no falte ninguna) */
const FRASES = {
  inicio:     ['luca', '¡Soy Luca, el piloto más valiente! ¡A volar!'],
  tioLlega:   ['tio',  '¡Aquí está Tío Juan! ¡Vamos, Luca, yo vuelo contigo!'],
  tioHola:    ['luca', '¡Tío Juan! ¡Qué chévere volar juntos!'],
  hamb:       ['tio',  '¡Toma una hamburguesa, Luca! ¡Turbo!'],
  hambRica:   ['luca', '¡Qué rica hamburguesa! ¡Fiuuuu!'],
  gabyLlega:  ['gaby', '¡Hola, Luca! ¡Soy tía Gaby! ¡Te necesito en el espacio!'],
  gabyHola:   ['luca', '¡Hola, tía Gaby! ¡Allá voy!'],
  cristal:    ['gaby', '¡Agarra este cristal mágico y tu avión se convertirá en una nave galáctica!'],
  transforma: ['luca', '¡Wooow! ¡Mi avión se está transformando!'],
  nave:       ['luca', '¡Mi avión ahora es una nave espacial! ¡Rumbo a las estrellas!'],
  naveMala:   ['gaby', '¡Cuidado, Luca! ¡Ahí vienen las naves malas del Malvado!'],
  fuerza:     ['tio',  '¡Que la fuerza te acompañe, Luca!'],
  golpe:      ['tio',  '¡Tranquilo, Luca! ¡Sigue volando!'],
  jefe:       ['malvado', '¡Ja, ja, ja! ¡Nadie pasa por mi galaxia!'],
  jefePista:  ['gaby', '¡Luca, dispárale al punto verde que brilla!'],
  jefeAyuda:  ['tio',  '¡Yo te ayudo, Luca!'],
  jefeMitad:  ['gaby', '¡Ya casi, Luca! ¡Sigue así!'],
  jefeCae:    ['malvado', '¡Noooo! ¡Mi Bola Gris!'],
  gana:       ['luca', '¡Ganamos! ¡Somos los héroes de la galaxia!'],
  ganaGaby:   ['gaby', '¡Lo lograste, Luca! ¡Eres un héroe!'],
  ganaTio:    ['tio',  '¡Muy bien, Luca! ¡Eres un campeón!'],
  toma1:      ['luca', '¡Toma, nave mala!'],
  toma2:      ['luca', '¡Le di! ¡Le di!'],
  toma3:      ['luca', '¡Pum! ¡Una menos!'],
};

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

function crearJuego(op){
  op = op || {};
  const J = {
    R: rng(op.semilla || 7),
    fase: 'titulo', t: 0, d: 0, dTotal: 0, faseT: 0,
    p: {x:0, y:CFG.YCENTRO, z:0, vx:0, vy:0, vel:CFG.VEL_CIELO, inv:0, giro:0, giroCd:0, turbo:0,
        ladeo:0, cabeceo:0, cad:0, lado:1, sacudida:0},
    estrellas: 0, derribadas: 0, golpes: 0,
    objs: [], laseres: [], balas: [],
    fx: [], sonidos: [], dichos: [],
    colaDialogo: [], dialogo: null,
    tio:  {activo:false, x:6, y:CFG.YCENTRO+2, z:40, oz:40, cad:2},
    gaby: {activo:false, x:-8, y:CFG.YCENTRO+30, z:-60, oz:-90, cad:3},
    jefe: null, trans: 0, fin: 0, genHasta: 0,
    hecho: {}, sigId: 1, cdGolpe: 0,
    angosto: false,   // la vista lo pone en true con el celular de pie: los amigos vuelan más pegaditos
  };
  return J;
}

/* ---------------- diálogos, sonidos y efectos ---------------- */
function decir(J, clave){
  const f = FRASES[clave];
  if (!f) return;
  J.dichos.push(clave);
  if (J.dichos.length > 200) J.dichos.shift();
  J.colaDialogo.push({clave, quien:f[0], texto:f[1]});
  if (J.colaDialogo.length > 6) J.colaDialogo.shift();
}
function son(J, n){ J.sonidos.push(n); if (J.sonidos.length > 60) J.sonidos.shift(); }
function efecto(J, tipo, x, y, z, tam){ J.fx.push({tipo, x, y, z, tam: tam||1}); if (J.fx.length > 80) J.fx.shift(); }
function dialogos(J, dt){
  if (J.dialogo){ J.dialogo.t -= dt; if (J.dialogo.t <= 0) J.dialogo = null; }
  if (!J.dialogo && J.colaDialogo.length){
    const s = J.colaDialogo.shift();
    J.dialogo = {clave:s.clave, quien:s.quien, texto:s.texto, t: Math.max(2.2, s.texto.length*0.062), nuevo:true};
  }
}

/* ---------------- objetos ---------------- */
function nuevo(J, tipo, x, y, z, extra){
  const o = Object.assign({id: J.sigId++, tipo, x, y, z, vivo:true, t:0, wvx:0, wvy:0, wvz:0}, extra || {});
  J.objs.push(o);
  return o;
}
const RADIO = {estrella:1.0, aro:4.2, nubarron:3.2, hamb:1.4, cristal:1.6, asteroide:3, navemala:1.8};

/* Va sembrando el camino por delante de Luca, en tramos de 50 m */
function generar(J){
  const R = J.R, p = J.p;
  const enCielo = J.fase === 'cielo';
  const largo = enCielo ? CFG.LARGO_CIELO - 120 : CFG.LARGO_ESPACIO - 120;
  while (J.genHasta < J.d + 320 && J.genHasta < largo){
    const d0 = J.genHasta;
    J.genHasta += 50;
    if (d0 < 60) continue;
    const zBase = p.z - (d0 - J.d);
    const k = Math.round(d0 / 50);
    const cx = (R()*2-1)*CFG.XMAX*0.6, cy = CFG.YCENTRO + (R()*2-1)*7;
    if (enCielo){
      if (k % 3 === 0){
        /* un aro con una fila de estrellas que lleva hasta él */
        for (let i=0;i<4;i++) nuevo(J, 'estrella', cx*(0.4+i*0.15), CFG.YCENTRO + (cy-CFG.YCENTRO)*(0.4+i*0.15), zBase + 30 - i*7);
        nuevo(J, 'aro', cx, cy, zBase);
      } else {
        const ph = R()*6;
        for (let i=0;i<5;i++) nuevo(J, 'estrella', cx + Math.sin(ph+i*0.7)*5, cy + Math.cos(ph+i*0.5)*2, zBase - i*6);
        if (d0 > 150 && R() < 0.55){
          let nx = (R()*2-1)*CFG.XMAX*0.9, ny = CFG.YCENTRO + (R()*2-1)*9;
          if (Math.hypot(nx-cx, ny-cy) < 7) nx = -nx;
          nuevo(J, 'nubarron', nx, ny, zBase - 25, {fase: R()*6});
        }
      }
    } else {
      const ph = R()*6;
      for (let i=0;i<4;i++) nuevo(J, 'estrella', cx + Math.sin(ph+i*0.8)*4, cy + Math.cos(ph+i*0.6)*3, zBase - i*7);
      const n = d0 > 300 ? 2 : 1;
      for (let i=0;i<n;i++){
        const r = 1.8 + R()*2.6;
        nuevo(J, 'asteroide', (R()*2-1)*CFG.XMAX, CFG.YCENTRO + (R()*2-1)*10, zBase - 20 - R()*25,
          {r, vida: Math.ceil(r), rx: R()*6, ry: R()*6, gx: (R()-0.5)*1.2, gy: (R()-0.5)*1.2, deriva:(R()-0.5)*2});
      }
    }
  }
}

function oleada(J, n){
  const R = J.R;
  for (let i=0;i<n;i++){
    const bx = (i - (n-1)/2) * 9 + (R()-0.5)*3;
    const by = CFG.YCENTRO + (R()-0.5)*8;
    nuevo(J, 'navemala', bx, by, J.p.z - 230 - i*12,
      {rel: 230 + i*12, relObj: 60 + R()*30, estado:'llega', bx, by, ph: R()*6, cad: 1.2 + R()*1.5, vida: 2, pelea: 7});
  }
}

/* ---------------- el guion ---------------- */
function una(J, clave){ if (J.hecho[clave]) return false; J.hecho[clave] = true; return true; }
function guion(J){
  const d = J.d;
  if (J.fase === 'cielo'){
    if (una(J,'inicio')) decir(J, 'inicio');
    if (d >= 260 && una(J,'tio')){ J.tio.activo = true; J.tio.oz = 40; decir(J,'tioLlega'); decir(J,'tioHola'); }
    if (d >= 750 && una(J,'hamb1')) tirarHamburguesa(J);
    if (d >= 1650 && una(J,'gaby')){ J.gaby.activo = true; J.gaby.oz = -90; J.gaby.y = CFG.YCENTRO + 30; decir(J,'gabyLlega'); decir(J,'gabyHola'); }
    if (d >= 1850 && una(J,'hamb2')) tirarHamburguesa(J);
    if (d >= CFG.LARGO_CIELO - 180 && una(J,'cristal')){
      decir(J, 'cristal');
      nuevo(J, 'cristal', J.gaby.x, J.gaby.y, J.p.z - 90, {iman: true});
    }
    /* por si acaso el cristal se escapara: igual se transforma */
    if (d >= CFG.LARGO_CIELO + 150) empezarTransformacion(J);
  } else if (J.fase === 'espacio'){
    if (una(J,'espacio')){ decir(J,'nave'); decir(J,'naveMala'); decir(J,'fuerza'); }
    const olas = [[200,2],[550,3],[900,3],[1250,4],[1600,3],[1950,4],[2300,3],[2650,4],[2950,4]];
    for (const [od, n] of olas) if (d >= od && una(J,'ola'+od)) oleada(J, n);
    if (d >= 1100 && una(J,'hamb3')) tirarHamburguesa(J);
    if (d >= 2400 && una(J,'hamb4')) tirarHamburguesa(J);
    if (d >= CFG.LARGO_ESPACIO) empezarJefe(J);
  } else if (J.fase === 'jefe'){
    const jf = J.jefe;
    if (jf.vida <= CFG.JEFE_VIDA/2 && una(J,'mitad')) decir(J,'jefeMitad');
    if (J.faseT > 14 && una(J,'hamb5')) tirarHamburguesa(J);
  }
}
function tirarHamburguesa(J){
  const t = J.tio;
  if (J.fase === 'cielo' || J.fase === 'espacio' || J.fase === 'jefe') decir(J, 'hamb');
  nuevo(J, 'hamb', t.activo ? t.x : J.p.x + 4, t.activo ? t.y : J.p.y, J.p.z - 45, {iman:true});
  son(J, 'lanza');
}
function empezarTransformacion(J){
  if (J.fase !== 'cielo') return;
  J.fase = 'transformacion'; J.trans = 0; J.faseT = 0;
  J.p.turbo = 0;
  J.colaDialogo = [];
  J.objs = J.objs.filter(o => o.tipo === 'hamb');
  decir(J, 'transforma');
  son(J, 'trans');
  efecto(J, 'brillo', J.p.x, J.p.y, J.p.z, 3);
}
function terminarTransformacion(J){
  J.fase = 'espacio'; J.faseT = 0;
  J.objs = J.objs.filter(o => o.tipo === 'hamb');
  J.d = 0; J.genHasta = 0;
  J.p.vel = CFG.VEL_ESPACIO;
  J.p.inv = 1.5;
}
function empezarJefe(J){
  J.fase = 'jefe'; J.faseT = 0;
  J.jefe = {rel: 320, vida: CFG.JEFE_VIDA, cad: 2.5, t: 0, x: 0, y: CFG.YCENTRO, z: 0, wx: 0, wy: 0, wz: 0, tocado: 0, cadTio: 2};
  posJefe(J, 0);
  decir(J, 'jefe'); decir(J, 'jefePista'); decir(J, 'jefeAyuda');
  son(J, 'jefe');
}
function posJefe(J, dt){
  const jf = J.jefe, p = J.p;
  jf.t += dt;
  if (jf.rel > CFG.JEFE_REL) jf.rel = Math.max(CFG.JEFE_REL, jf.rel - 50*dt);
  jf.x = 0; jf.y = CFG.YCENTRO;
  jf.z = p.z - jf.rel - CFG.JEFE_RADIO;
  /* el punto débil da vueltas por la cara de la Bola Gris */
  const a = jf.t * 0.6;
  jf.wx = Math.sin(a) * 7;
  jf.wy = CFG.YCENTRO + Math.cos(a*1.3) * 5;
  jf.wz = p.z - jf.rel + 1;
}

/* ---------------- disparos ---------------- */
function apuntar(J, ox, oy, oz, cono){
  /* busca el blanco más centrado delante del cañón (para que un niño de
     cinco años también le dé) */
  const p = J.p;
  let mejor = null, mejorA = cono;
  const ver = (tx, ty, tz, wvz, ref)=>{
    const dz = oz - tz;
    if (dz < 12 || dz > 230) return;
    const a = Math.hypot(tx-ox, ty-oy) / dz;
    if (a < mejorA){ mejorA = a; mejor = {tx, ty, tz, wvz, ref}; }
  };
  for (const o of J.objs){
    if (o.tipo === 'navemala' || o.tipo === 'asteroide') ver(o.x, o.y, o.z, o.wvz, o);
  }
  if (J.jefe && J.fase === 'jefe') ver(J.jefe.wx, J.jefe.wy, J.jefe.wz, -p.vel, 'jefe');
  return mejor;
}
function disparar(J, ox, oy, oz, de, cono){
  const p = J.p, vel = p.vel * (p.turbo > 0 ? 1.8 : 1);
  const b = apuntar(J, ox, oy, oz, cono);
  let dx = 0, dy = 0, dz = -1;
  if (b){
    /* adelanta un poquito el tiro según cómo se mueve el blanco */
    const tz = b.tz, rvz = b.wvz + vel;
    const dist = Math.hypot(b.tx-ox, b.ty-oy, tz-oz);
    const tv = dist / CFG.VEL_LASER;
    const fz = tz + rvz*tv;
    const L = Math.hypot(b.tx-ox, b.ty-oy, fz-oz) || 1;
    dx = (b.tx-ox)/L; dy = (b.ty-oy)/L; dz = (fz-oz)/L;
  }
  J.laseres.push({id: J.sigId++, x:ox, y:oy, z:oz, vx: dx*CFG.VEL_LASER, vy: dy*CFG.VEL_LASER, vz: dz*CFG.VEL_LASER - vel, vida: 1.6, de});
  if (de === 'luca') son(J, 'laser');
}

function golpear(J, quien){
  const p = J.p;
  if (p.inv > 0 || p.turbo > 0 || p.giro > 0) return false;
  J.golpes++;
  const pierde = Math.min(J.estrellas, 3);
  J.estrellas -= pierde;
  p.inv = 1.6; p.sacudida = 0.5;
  son(J, 'golpe');
  efecto(J, 'chispa', p.x, p.y, p.z, 1);
  if (J.cdGolpe <= 0){ decir(J, 'golpe'); J.cdGolpe = 14; }
  return true;
}

function romper(J, o){
  o.vivo = false;
  efecto(J, 'boom', o.x, o.y, o.z, o.tipo === 'navemala' ? 1.4 : (o.r || 2) / 2);
  son(J, 'boom');
  if (o.tipo === 'navemala'){
    J.derribadas++;
    if (J.derribadas % 3 === 1) decir(J, ['toma1','toma2','toma3'][Math.floor(J.derribadas/3) % 3]);
  }
  /* cada cosa rota suelta una estrella que vuela sola hacia Luca */
  nuevo(J, 'estrella', o.x, o.y, o.z, {iman: true});
}

/* ---------------- paso del juego ---------------- */
function empezar(J){
  if (J.fase !== 'titulo') return;
  J.fase = 'cielo'; J.faseT = 0; J.d = 0; J.genHasta = 0;
  J.p.z = 0; J.objs = [];
}

function paso(J, dt, e){
  e = e || {};
  J.t += dt; J.faseT += dt;
  dialogos(J, dt);
  const p = J.p;
  if (J.cdGolpe > 0) J.cdGolpe -= dt;

  if (J.fase === 'titulo'){
    p.z -= 14*dt;
    p.ladeo = Math.sin(J.t*0.8)*0.25;
    moverAmigos(J, dt);
    return;
  }

  if (J.fase === 'transformacion'){
    J.trans += dt;
    p.z -= p.vel*0.5*dt;
    p.y += (CFG.YCENTRO - p.y) * Math.min(1, dt*2);
    p.x += (0 - p.x) * Math.min(1, dt*2);
    moverAmigos(J, dt);
    if (J.trans >= CFG.DURA_TRANS) terminarTransformacion(J);
    return;
  }

  if (J.fase === 'fin'){
    J.fin += dt;
    p.z -= p.vel*0.6*dt;
    p.ladeo = Math.sin(J.fin*1.5)*0.4;
    p.x += (0 - p.x) * Math.min(1, dt);
    p.y += (CFG.YCENTRO - p.y) * Math.min(1, dt);
    if (J.fin > 0.5 && J.R() < dt*3) efecto(J, 'fuego', (J.R()*2-1)*20, CFG.YCENTRO + 4 + J.R()*14, p.z - 50 - J.R()*40, 1.2);
    moverAmigos(J, dt);
    moverLaseres(J, dt);
    return;
  }

  /* ----- manejar el avión / la nave ----- */
  const dx = clamp(e.dx || 0, -1, 1), dy = clamp(e.dy || 0, -1, 1);
  const k = Math.min(1, dt*5);
  p.vx += (dx*20 - p.vx)*k;
  p.vy += (dy*16 - p.vy)*k;
  p.x = clamp(p.x + p.vx*dt, -CFG.XMAX, CFG.XMAX);
  p.y = clamp(p.y + p.vy*dt, CFG.YMIN, CFG.YMAX);
  p.ladeo += (-p.vx*0.045 - p.ladeo)*Math.min(1, dt*6);
  p.cabeceo += (p.vy*0.03 - p.cabeceo)*Math.min(1, dt*6);
  if (p.giroCd > 0) p.giroCd -= dt;
  if (e.giro && p.giroCd <= 0){ p.giro = 0.7; p.giroCd = 1.3; son(J, 'giro'); }
  if (p.giro > 0) p.giro = Math.max(0, p.giro - dt);
  if (p.inv > 0) p.inv -= dt;
  if (p.sacudida > 0) p.sacudida -= dt;
  if (p.turbo > 0) p.turbo = Math.max(0, p.turbo - dt);

  const vel = p.vel * (p.turbo > 0 ? 1.8 : 1);
  p.z -= vel*dt;
  if (J.fase !== 'jefe'){ J.d += vel*dt; J.dTotal += vel*dt; }

  generar(J);
  guion(J);
  if (J.fase !== 'cielo' && J.fase !== 'espacio' && J.fase !== 'jefe') return;   // se transformó en este paso

  /* ----- disparos (solo en el espacio; disparan solos) ----- */
  if (J.fase === 'espacio' || J.fase === 'jefe'){
    p.cad -= dt;
    if (p.cad <= 0){
      p.cad = 0.2;
      p.lado = -p.lado;
      disparar(J, p.x + p.lado*2.6, p.y + 0.3, p.z - 2, 'luca', 0.28);
    }
  }

  moverAmigos(J, dt);
  moverObjetos(J, dt, vel);
  moverLaseres(J, dt);
  moverBalas(J, dt);
  if (J.fase === 'jefe') moverJefe(J, dt);

  J.objs = J.objs.filter(o => o.vivo && o.z < p.z + 25);
}

function moverAmigos(J, dt){
  const p = J.p, t = J.tio, g = J.gaby;
  const k = Math.min(1, dt*2.5);
  if (t.activo){
    /* vuela a la derecha de Luca; oz es cuántos metros va detrás (llega desde atrás) */
    const lejos = J.fase === 'transformacion' || J.fase === 'fin';   // se apartan para que la cámara dé la vuelta
    const tx = p.x + (lejos ? 11 : J.angosto ? 4.2 : 6) + Math.sin(J.t*0.9)*1.2, ty = p.y + (lejos ? 9 : 2) + Math.sin(J.t*1.7)*0.8;
    t.x += (tx - t.x)*k; t.y += (ty - t.y)*k;
    t.oz += (1 - t.oz)*Math.min(1, dt*1.2); t.z = p.z + t.oz;
    if ((J.fase === 'espacio' || J.fase === 'jefe')){
      t.cad -= dt;
      if (t.cad <= 0){ t.cad = 1.3; disparar(J, t.x, t.y, t.z - 1.5, 'tio', 0.45); }
    }
  }
  if (g.activo){
    const enJefe = J.fase === 'jefe';
    const lejos = J.fase === 'transformacion' || J.fase === 'fin';
    const gx = p.x - (lejos ? 13 : J.angosto ? 5 : 8) + Math.sin(J.t*0.7)*1.5, gy = p.y + (lejos ? 10 : 1.5) + Math.cos(J.t*1.1)*1;
    const oz = J.fase === 'cielo' && !J.hecho.cristalTomado ? -45 : 0;
    g.x += (gx - g.x)*k; g.y += (gy - g.y)*Math.min(1, dt*1.2);
    g.oz += (oz - g.oz)*Math.min(1, dt*1.2); g.z = p.z + g.oz;
    if (enJefe){
      g.cad -= dt;
      if (g.cad <= 0){ g.cad = 2.2; disparar(J, g.x, g.y, g.z - 1.5, 'gaby', 0.45); }
    }
  }
}

function moverObjetos(J, dt, vel){
  const p = J.p;
  for (const o of J.objs){
    if (!o.vivo) continue;
    o.t += dt;
    const x0 = o.x, y0 = o.y, z0 = o.z;
    if (o.iman){
      /* hamburguesas, cristal y estrellas premio buscan solitas a Luca */
      const fuerza = o.tipo === 'estrella' ? 30 : 9;
      const ddx = p.x - o.x, ddy = p.y - o.y;
      const L = Math.hypot(ddx, ddy) || 1;
      const v = Math.min(L, fuerza*dt);
      o.x += ddx/L*v; o.y += ddy/L*v;
      if (o.tipo === 'estrella') o.z += (p.z - 1 - o.z)*Math.min(1, dt*3);
      else if (o.z < p.z - 12) o.z += 4*dt;     // se queda esperándolo un poquito por delante
    } else if (o.tipo === 'estrella'){
      const dd = Math.hypot(p.x - o.x, p.y - o.y, p.z - o.z);
      if (dd < 7){ o.x += (p.x - o.x)*Math.min(1, dt*6); o.y += (p.y - o.y)*Math.min(1, dt*6); }
    } else if (o.tipo === 'asteroide'){
      o.x += o.deriva*dt;
    } else if (o.tipo === 'navemala'){
      moverNaveMala(J, o, dt, vel);
    }
    if (dt > 0){ o.wvx = (o.x-x0)/dt; o.wvy = (o.y-y0)/dt; o.wvz = (o.z-z0)/dt; }

    /* choques con Luca */
    const dz = Math.abs(o.z - p.z);
    if (o.tipo === 'aro'){
      if (!o.pasado && o.z >= p.z){
        o.pasado = true;
        if (Math.hypot(o.x - p.x, o.y - p.y) < RADIO.aro){
          J.estrellas += 5; o.bien = true; son(J, 'aro'); efecto(J, 'aro', o.x, o.y, o.z, 1);
        }
      }
      continue;
    }
    const r = (o.r || RADIO[o.tipo] || 1) + CFG.RADIO_LUCA + (o.tipo === 'estrella' ? 1.2 : 0);
    if (dz > r) continue;
    if (Math.hypot(o.x - p.x, o.y - p.y, o.z - p.z) > r) continue;
    if (o.tipo === 'estrella'){ o.vivo = false; J.estrellas++; son(J, 'estrella'); efecto(J, 'estrella', o.x, o.y, o.z, 0.6); }
    else if (o.tipo === 'hamb'){
      o.vivo = false; p.turbo = CFG.TURBO; decir(J, 'hambRica'); son(J, 'turbo'); efecto(J, 'brillo', p.x, p.y, p.z, 1.5);
    }
    else if (o.tipo === 'cristal'){
      o.vivo = false; J.hecho.cristalTomado = true; J.estrellas += 10; empezarTransformacion(J);
    }
    else if (o.tipo === 'nubarron' || o.tipo === 'asteroide' || o.tipo === 'navemala'){
      if (golpear(J) && o.tipo !== 'nubarron') romper(J, o);
      else if (p.turbo > 0 && o.tipo !== 'nubarron') romper(J, o);   // con turbo, Luca los atraviesa y los rompe
    }
  }
}

function moverNaveMala(J, o, dt, vel){
  const p = J.p;
  if (o.estado === 'llega'){
    o.rel -= 35*dt;
    if (o.rel <= o.relObj){ o.rel = o.relObj; o.estado = 'pelea'; }
  } else if (o.estado === 'pelea'){
    o.pelea -= dt;
    o.x = o.bx + Math.sin(o.t*1.3 + o.ph)*5;
    o.y = o.by + Math.cos(o.t*0.9 + o.ph)*3;
    o.cad -= dt;
    if (o.cad <= 0){
      o.cad = 1.8 + J.R()*1.4;
      const ddx = p.x - o.x, ddy = p.y - o.y, ddz = p.z - o.z;
      const L = Math.hypot(ddx, ddy, ddz) || 1;
      const v = 24;
      J.balas.push({id: J.sigId++, x:o.x, y:o.y, z:o.z + 1.5, vx: ddx/L*v, vy: ddy/L*v, vz: ddz/L*v - vel, vida: 6});
      son(J, 'balamala');
    }
    if (o.pelea <= 0) o.estado = 'seva';
  } else {
    o.rel -= 55*dt;
    o.x += (o.x >= 0 ? 1 : -1) * 14*dt;
    o.y += 6*dt;
    if (o.rel < -20) o.vivo = false;
  }
  o.z = p.z - o.rel;
}

/* distancia más corta entre el segmento a→b y el punto c */
function distSeg(ax, ay, az, bx, by, bz, cx, cy, cz){
  const ux = bx-ax, uy = by-ay, uz = bz-az;
  const L2 = ux*ux + uy*uy + uz*uz || 1e-9;
  let t = ((cx-ax)*ux + (cy-ay)*uy + (cz-az)*uz) / L2;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return Math.hypot(ax + ux*t - cx, ay + uy*t - cy, az + uz*t - cz);
}

function moverLaseres(J, dt){
  const jf = J.jefe;
  for (const l of J.laseres){
    if (l.vida <= 0) continue;
    l.vida -= dt;
    const ax = l.x, ay = l.y, az = l.z;
    l.x += l.vx*dt; l.y += l.vy*dt; l.z += l.vz*dt;
    for (const o of J.objs){
      if (!o.vivo || (o.tipo !== 'navemala' && o.tipo !== 'asteroide')) continue;
      const r = (o.tipo === 'navemala' ? 2.4 : o.r + 0.5);
      if (distSeg(ax, ay, az, l.x, l.y, l.z, o.x, o.y, o.z) < r){
        l.vida = 0;
        o.vida--;
        efecto(J, 'chispa', l.x, l.y, l.z, 0.5);
        if (o.vida <= 0) romper(J, o);
        break;
      }
    }
    if (l.vida > 0 && jf && J.fase === 'jefe' && jf.vida > 0){
      if (distSeg(ax, ay, az, l.x, l.y, l.z, jf.wx, jf.wy, jf.wz) < 4){
        l.vida = 0;
        jf.vida--; jf.tocado = 0.25;
        efecto(J, 'chispa', jf.wx, jf.wy, jf.wz, 1.2);
        son(J, 'tocado');
        if (jf.vida <= 0) jefeCae(J);
      } else if (distSeg(ax, ay, az, l.x, l.y, l.z, jf.x, jf.y, jf.z) < CFG.JEFE_RADIO){
        l.vida = 0;
        efecto(J, 'chispa', l.x, l.y, l.z, 0.4);
      }
    }
  }
  J.laseres = J.laseres.filter(l => l.vida > 0);
}

function moverBalas(J, dt){
  const p = J.p;
  for (const b of J.balas){
    b.vida -= dt;
    b.x += b.vx*dt; b.y += b.vy*dt; b.z += b.vz*dt;
    if (Math.hypot(b.x - p.x, b.y - p.y, b.z - p.z) < CFG.RADIO_LUCA + 0.5){
      b.vida = 0;
      golpear(J);
    }
    if (b.z > p.z + 15) b.vida = 0;
  }
  J.balas = J.balas.filter(b => b.vida > 0);
}

function moverJefe(J, dt){
  const jf = J.jefe, p = J.p;
  posJefe(J, dt);
  if (jf.tocado > 0) jf.tocado -= dt;
  if (jf.rel > CFG.JEFE_REL + 5) return;
  jf.cad -= dt;
  if (jf.cad <= 0){
    jf.cad = 1.4 + J.R()*0.6;
    /* la Bola Gris tira dos bolitas rojas lentas desde su cara */
    for (let i=0;i<2;i++){
      const ox = (J.R()*2-1)*16, oy = CFG.YCENTRO + (J.R()*2-1)*12, oz = p.z - jf.rel;
      const ddx = p.x - ox, ddy = p.y - oy, ddz = p.z - oz;
      const L = Math.hypot(ddx, ddy, ddz) || 1, v = 26;
      J.balas.push({id: J.sigId++, x:ox, y:oy, z:oz, vx: ddx/L*v, vy: ddy/L*v, vz: ddz/L*v - p.vel*(p.turbo>0?1.8:1), vida: 7});
    }
    son(J, 'balamala');
  }
}

function jefeCae(J){
  const jf = J.jefe;
  J.fase = 'fin'; J.fin = 0; J.faseT = 0;
  J.balas = [];
  J.colaDialogo = []; J.dialogo = null;
  for (const o of J.objs) if (o.vivo && (o.tipo === 'navemala' || o.tipo === 'asteroide')){ o.vivo = false; efecto(J, 'boom', o.x, o.y, o.z, 1.4); }
  J.estrellas += 50;
  for (let i=0;i<8;i++) efecto(J, 'boom', jf.x + (J.R()*2-1)*20, jf.y + (J.R()*2-1)*20, jf.z + 20, 4);
  efecto(J, 'granboom', jf.x, jf.y, jf.z, 10);
  son(J, 'granboom'); son(J, 'gana');
  decir(J, 'jefeCae'); decir(J, 'gana'); decir(J, 'ganaGaby'); decir(J, 'ganaTio');
}

const API = {CFG, QUIEN, FRASES, crearJuego, empezar, paso, rng, distSeg};
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else raiz.LUCA = API;
})(typeof window !== 'undefined' ? window : this);
