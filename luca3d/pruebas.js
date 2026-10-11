/* ============================================================
   PRUEBAS DE LUCCA PILOTO
   Se corre con:   node pruebas.js
   Sin navegador: se carga solo el núcleo y se juegan partidas
   enteras de mentira — con un piloto que esquiva y recoge, y con
   uno que NO toca nada (como un niño chiquito) — para comprobar
   que siempre se llega al final y que salen Tío Juan y Tía Gaby.
   ============================================================ */
const path = require('path');
const L = require(path.join(__dirname, 'nucleo.js'));
let fallos = 0;
const mal = m => { console.log('✗', m); fallos++; };

/* 1) todas las frases tienen quién las diga */
for (const [clave, [quien, texto]] of Object.entries(L.FRASES)){
  if (!L.QUIEN[quien]) mal('frase sin personaje: '+clave);
  if (!texto || texto.length < 4) mal('frase vacía: '+clave);
}

/* piloto automático: va hacia la estrella/hamburguesa más cercana y se aparta de lo que choca */
function piloto(J){
  const p = J.p;
  let ox = p.x, oy = p.y, mejor = 1e9;
  for (const o of J.objs){
    const dz = p.z - o.z;
    if (dz < 0 || dz > 80) continue;
    if (o.tipo === 'estrella' || o.tipo === 'hamb' || o.tipo === 'cristal' || o.tipo === 'aro'){
      if (dz < mejor){ mejor = dz; ox = o.x; oy = o.y; }
    }
  }
  for (const o of J.objs){
    const dz = p.z - o.z;
    if (dz < 0 || dz > 40) continue;
    if (o.tipo === 'nubarron' || o.tipo === 'asteroide' || o.tipo === 'navemala'){
      if (Math.hypot(o.x - ox, o.y - oy) < 6){ ox = o.x + (o.x > 0 ? -8 : 8); }
    }
  }
  return {dx: Math.max(-1, Math.min(1, (ox - p.x)/4)), dy: Math.max(-1, Math.min(1, (oy - p.y)/4)), giro: false};
}

function partida(nombre, control, semilla){
  const J = L.crearJuego({semilla});
  for (let i=0;i<60;i++) L.paso(J, 1/60, {});
  L.empezar(J);
  const fases = ['cielo']; const tFase = {};
  let f = 0;
  const LIM = 60*60*10;   // 10 minutos de juego como mucho
  for (; f<LIM && !(J.fase === 'fin' && J.fin > 3); f++){
    L.paso(J, 1/60, control(J));
    if (fases[fases.length-1] !== J.fase) fases.push(J.fase);
    tFase[J.fase] = (tFase[J.fase]||0) + 1/60;
    const p = J.p;
    if (![p.x, p.y, p.z, p.vel, J.estrellas].every(Number.isFinite)){ mal(nombre+': número roto en el cuadro '+f); return; }
    if (p.x < -L.CFG.XMAX - 0.01 || p.x > L.CFG.XMAX + 0.01 || p.y < L.CFG.YMIN - 0.01 || p.y > L.CFG.YMAX + 0.01){ mal(nombre+': Lucca se salió del cielo'); return; }
    if (J.objs.length > 400) { mal(nombre+': demasiados objetos ('+J.objs.length+')'); return; }
  }
  const esperado = ['cielo','transformacion','espacio','jefe','fin'];
  if (fases.join() !== esperado.join()) mal(nombre+': fases '+fases.join(' → '));
  if (J.fase !== 'fin') mal(nombre+': no terminó (fase '+J.fase+', '+Math.round(J.d)+' m)');
  for (const c of ['tioLlega','gabyLlega','cristal','transforma','nave','fuerza','jefe','jefeCae','gana','ganaGaby','ganaTio'])
    if (!J.dichos.includes(c)) mal(nombre+': no se dijo «'+c+'»');
  if (!J.hecho.tio || !J.hecho.gaby) mal(nombre+': faltó Tío Juan o Tía Gaby');
  console.log('✓', nombre, '·', (f/60/60).toFixed(1), 'min ·', J.estrellas, 'estrellas ·', J.derribadas, 'naves malas ·', J.golpes, 'golpes ·', Object.entries(tFase).map(([k,v])=>k+' '+Math.round(v)+'s').join(' '));
  return J;
}

const bueno = partida('piloto que juega', piloto, 7);
partida('niño que no toca nada', ()=>({}), 3);
partida('niño que solo va a la izquierda', ()=>({dx:-1, dy:1, giro: Math.random() < 0.02}), 11);
partida('piloto con otra semilla', piloto, 99);

/* 2) el cristal transforma de verdad aunque no lo agarre */
{
  const J = L.crearJuego({semilla: 5});
  L.empezar(J);
  for (let f=0; f<60*120 && J.fase === 'cielo'; f++){
    for (const o of J.objs) if (o.tipo === 'cristal') o.vivo = false;   // el cristal se pierde
    L.paso(J, 1/60, {});
  }
  if (J.fase !== 'transformacion') mal('sin cristal no se transformó (fase '+J.fase+')');
  else console.log('✓ sin cristal igual se transforma');
}

/* 3) los choques solo quitan estrellas, nunca vidas */
{
  const J = L.crearJuego();
  L.empezar(J);
  J.estrellas = 2;
  J.objs.push({id: 999, tipo:'nubarron', x: J.p.x, y: J.p.y, z: J.p.z - 1, vivo:true, t:0, wvx:0, wvy:0, wvz:0});
  L.paso(J, 1/60, {});
  if (J.estrellas !== 0 || J.golpes !== 1) mal('el nubarrón no quitó las estrellas bien ('+J.estrellas+')');
  else console.log('✓ un choque quita estrellas y se sigue jugando');
}

/* 4) el disparo automático apunta y le da a la Bola Gris */
if (bueno && bueno.jefe && bueno.jefe.vida > 0) mal('la Bola Gris quedó viva');

console.log(fallos ? '\n✗ '+fallos+' fallo(s)' : '\n✓ todo bien');
process.exit(fallos ? 1 : 0);
