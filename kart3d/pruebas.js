/* ============================================================
   PRUEBAS DE PICHUNGITO KART
   Se corre con:   node pruebas.js
   Sin navegador: se carga solo el núcleo (trazado, física, poderes,
   rivales) y se hacen correr carreras enteras con todos los karts
   manejados por la inteligencia del juego, en todas las pistas y con
   varios personajes. Además revisa que todas las frases habladas existan
   tal cual en las grabaciones.
   ============================================================ */
const path = require('path');
const N = require(path.join(__dirname, 'kart3d.js'));
let fallos = 0;
const mal = m => { console.log('✗', m); fallos++; };

/* 1) las frases de todo el elenco están grabadas */
for (const c of N.ELENCO) if (!N.CLIPS[c.frase]) mal('sin grabación: '+c.nombre+' → '+c.frase);
for (const f of ['¡Pichunguito al ataque!','¡Qué rica hamburguesa!','¡Toma, pichungazo!','¡Qué pedo tan grande, tío Fran!',
  '¡Gané! ¡Soy el pichunguito campeón!','¡Muy bien, mi pichunguito! ¡Eres un campeón!','¡Qué divertido! ¡Otra vez, otra vez!'])
  if (!N.CLIPS[f]) mal('sin grabación: '+f);

/* 2) los trazados están bien formados */
for (const p of N.PISTAS){
  const T = new N.Trazado(p);
  if (T.N < 200) mal(p.nombre+': trazado muy corto ('+T.N+' muestras)');
  for (const m of T.M) if (![m.x,m.z,m.y,m.tx,m.tz].every(Number.isFinite)) { mal(p.nombre+': muestra rota'); break; }
  const c = T.cerca(T.M[10].x + T.M[10].nx*3, T.M[10].z + T.M[10].nz*3);
  if (c.i !== 10 || Math.abs(c.lat-3) > 0.3) mal(p.nombre+': cerca() no encuentra la muestra ('+c.i+', lat '+c.lat.toFixed(2)+')');
  const salto = Math.hypot(T.M[T.N-1].x-T.M[0].x, T.M[T.N-1].z-T.M[0].z);
  if (salto > 3.5) mal(p.nombre+': el lazo no cierra ('+salto.toFixed(1)+' m)');
  console.log('✓', p.nombre, '·', Math.round(T.L), 'm por vuelta');
}

/* 3) carreras completas con todos manejados por la IA */
const personajes = ['fernando','penny','tiofran','romulo','cucu','abu'];
N.PISTAS.forEach((p, pi)=>{
  const quien = personajes[pi % personajes.length];
  const R = N.crearCarrera(pi, quien, {autoJugador:true});
  const tipos = {};
  let f = 0;
  for (; f<60*60*8 && R.fase!=='fin'; f++){
    N.pasoCarrera(R, {});
    for (const e of R.eventos) tipos[e.tipo] = (tipos[e.tipo]||0)+1;
    R.eventos.length = 0;
    for (const k of R.karts) if (![k.x,k.z,k.y,k.ang,k.vel].every(Number.isFinite)) { mal(p.nombre+': '+k.nombre+' con números rotos'); f = 1e9; break; }
  }
  if (R.fase!=='fin') mal(p.nombre+': la carrera no terminó');
  else {
    if (R.resultado.length !== R.karts.length) mal(p.nombre+': faltan corredores en el resultado');
    const pos = new Set(R.karts.map(k=>k.pos));
    if (pos.size !== R.karts.length) mal(p.nombre+': posiciones repetidas');
    if (!tipos.caja) mal(p.nombre+': nadie agarró una caja');
    if (!tipos.vuelta) mal(p.nombre+': nadie completó una vuelta');
    const usados = (tipos.lanzar||0)+(tipos.estrella||0)+(tipos.burger||0)+(tipos.pedo||0);
    if (!usados) mal(p.nombre+': nadie usó un poder');
    console.log('✓', p.nombre, 'con', quien, '·', (f/60).toFixed(0)+' s ·', R.J.nombre, 'llegó de', R.J.pos+'º ·',
      'cajas', tipos.caja||0, '· poderes', usados, '· trompos', tipos.trompo||0, '· rebases', tipos.rebase||0);
  }
});

/* 4) el jugador parado: los rivales igual terminan y la carrera acaba */
{
  const R = N.crearCarrera(0, 'fernando');
  let f = 0;
  for (; f<60*60*8 && R.fase!=='fin'; f++){ N.pasoCarrera(R, {}); R.eventos.length = 0; }
  if (R.fase!=='fin') mal('con el jugador quieto la carrera no termina');
  else console.log('✓ jugador quieto: la carrera acaba sola a los', (f/60).toFixed(0), 's');
}
/* 5) el jugador manejando con teclas: siempre a la derecha no se sale del mundo */
{
  const R = N.crearCarrera(1, 'fernando');
  for (let f=0; f<60*30; f++){ N.pasoCarrera(R, {der:true, a:f%120<60, b:true}); R.eventos.length = 0; }
  const c = R.T.cerca(R.J.x, R.J.z);
  if (c.d > R.T.ancho/2 + 12) mal('el jugador se escapó de la pista ('+c.d.toFixed(1)+' m)');
  else console.log('✓ muro invisible: el jugador queda a', c.d.toFixed(1), 'm del centro');
}
console.log(fallos ? '\n'+fallos+' FALLO(S)' : '\n✓ Pichungito Kart sin fallos');
process.exit(fallos ? 1 : 0);
