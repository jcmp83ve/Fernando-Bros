/* ============================================================
   PRUEBAS DE FERNANDO Y TÍO JUAN: LA GRAN AVENTURA
   Se corre con:   node pruebas.js
   Sin navegador: se carga solo el núcleo (la isla, la física de los
   vehículos, las hamburguesas, los baños, la familia y las misiones) y
   se hace jugar solo a Fernando hasta ganar las ocho estrellas: camina,
   come, hace popo, maneja el carro por las banderas, salta la rampa en
   moto, despega y cruza los aros, navega hasta Santi y baja al cofre
   con el submarino. Además revisa que todas las frases habladas existan
   en las grabaciones (o estén apuntadas como voz sintética a propósito).
   ============================================================ */
const path = require('path');
const N = require(process.env.NUCLEO ? path.resolve(process.env.NUCLEO) : path.join(__dirname, 'aventura3d.js'));
let fallos = 0;
const mal = m => { console.log('✗', m); fallos++; };
const bien = (...m) => console.log('✓', ...m);
const env = a=>{ while (a>Math.PI) a-=2*Math.PI; while (a<-Math.PI) a+=2*Math.PI; return a; };

/* 1) las frases: todas grabadas, o apuntadas como voz sintética a propósito */
for (const f of N.FAMILIA) if (!N.CLIPS[f.frase]) mal('sin grabación: '+f.nombre+' → '+f.frase);
for (const f of ['¡Qué rica hamburguesa!','¡Guau, guau! ¡Soy el perrito pichunguito!','¡A volar, pichunguitos!','¡Todos a bordo del barco pichunguito!',
  'Eres mi pichunguito','¡Muy bien, mi pichunguito! ¡Eres un campeón!','Te amo tío Juan, yo soy tu pichunguito','¡Pichunguito al ataque!','¡Qué divertido! ¡Otra vez, otra vez!'])
  if (!N.CLIPS[f]) mal('sin grabación: '+f);
for (const f of N.SIN_GRABACION){ if (N.CLIPS[f]) mal('ya está grabada, quítala de SIN_GRABACION: '+f); if (!N.TONO_TTS[f]) mal('sin tono de voz sintética: '+f); }
bien('frases:', Object.keys(N.CLIPS).length, 'grabadas y', N.SIN_GRABACION.length, 'nuevas con voz sintética');

/* 2) la isla está bien armada */
{
  let rotos = 0; for (let i=0;i<N.MALLA.length;i++) if (!Number.isFinite(N.MALLA[i])) rotos++;
  if (rotos) mal('la malla del terreno tiene '+rotos+' alturas rotas');
  const enTierra = (x,z)=> N.altura(x,z) > 0.5;
  for (const v of N.VEHICULOS_DEF){
    const h = N.altura(v.x, v.z);
    if ((v.id==='barco'||v.id==='sub') ? h > -2 : h < 0.5) mal(v.nombre+' está mal puesto (suelo a '+h.toFixed(1)+' m)');
  }
  for (const f of N.FAMILIA) if (!enTierra(f.x, f.z)) mal(f.nombre+' está en el agua');
  for (const b of N.BANOS) if (!enTierra(b.x, b.z) || !enTierra(b.px, b.pz)) mal(b.nombre+' está en el agua');
  for (const c of N.CASAS) if (!enTierra(c.x, c.z)) mal(c.nombre+' está en el agua');
  if (N.altura(N.COFRE.x, N.COFRE.z) > -20) mal('el cofre no está en lo hondo');
  N.AROS.forEach((a,i)=>{ if (a.y - N.altura(a.x,a.z) < 25) mal('el aro '+i+' está muy bajo'); });
  let bajo = 0, minH = 1e9, maxH = -1e9;
  for (const m of N.RUTA.M){ const h = N.altura(m.x, m.z); if (h < 0.5) bajo++; minH = Math.min(minH,h); maxH = Math.max(maxH,h); }
  if (bajo) mal('la carretera se mete al mar en '+bajo+' muestras');
  const pendientes = N.RUTA.M.map((m,i)=>Math.abs(N.RUTA.M[(i+1)%N.RUTA.N].h - m.h)/N.RUTA.paso);
  if (Math.max(...pendientes) > 0.35) mal('la carretera tiene una cuesta demasiado empinada ('+Math.max(...pendientes).toFixed(2)+')');
  let pmin = 1e9, pmax = -1e9;
  for (let z=N.PISTA.z0; z<=N.PISTA.z1; z+=2){ const h = N.altura(N.PISTA.x, z); pmin = Math.min(pmin,h); pmax = Math.max(pmax,h); }
  if (pmax - pmin > 0.3) mal('la pista de aterrizaje no está plana ('+(pmax-pmin).toFixed(2)+' m)');
  for (const h of N.HAMBURGUESAS) if (![h.x,h.y,h.z].every(Number.isFinite)) mal('hamburguesa rota');
  if (N.DECOR.arboles.length < 400 || N.DECOR.palmeras.length < 60 || N.DECOR.pinos.length < 40) mal('pocos árboles: '+N.DECOR.arboles.length+'/'+N.DECOR.palmeras.length+'/'+N.DECOR.pinos.length);
  bien('isla: carretera de', Math.round(N.RUTA.L), 'm entre', minH.toFixed(1), 'y', maxH.toFixed(1), 'm ·', N.DECOR.arboles.length+N.DECOR.palmeras.length+N.DECOR.pinos.length, 'árboles ·', N.HAMBURGUESAS.length, 'hamburguesas');
}

/* ---- ayudas para jugar solo ---- */
const tipos = {};
function paso(P, ent){
  N.pasoPartida(P, ent);
  for (const e of P.eventos) tipos[e.tipo] = (tipos[e.tipo]||0)+1;
  const lista = P.eventos.slice(); P.eventos.length = 0; return lista;
}
function correr(P, frames, ent, hasta){
  for (let f=0; f<frames; f++){
    const evs = paso(P, typeof ent==='function' ? ent(P, f) : ent);
    if (![P.J.x,P.J.y,P.J.z,P.J.ang].every(Number.isFinite)){ mal('Fernando con números rotos'); return f; }
    for (const v of P.vehiculos) if (![v.x,v.y,v.z,v.ang,v.vel,v.vy].every(Number.isFinite)){ mal(v.nombre+' con números rotos'); return f; }
    if (hasta && hasta(P, evs)) return f;
  }
  return frames;
}
function poner(P, x, z){ P.J.x = x; P.J.z = z; P.J.y = N.altura(x,z); P.J.vx = P.J.vz = P.J.vy = 0; P.J.suelo = true; P.J.nadando = false; }
function montar(P, id){
  const v = P.vehiculos.find(v=>v.id===id);
  poner(P, v.x + 3, v.z);
  P.J.y = v.y;
  correr(P, 2, {});
  correr(P, 1, {a:true});
  if (P.veh !== v) mal('no se pudo montar en '+v.nombre);
  return v;
}
/* volante automático: gira hacia un punto */
const hacia = (v, x, z)=>{ const d = env(Math.atan2(x-v.x, z-v.z) - v.ang); return -Math.max(-1, Math.min(1, d*2.5)); };

const P = N.crearPartida();
if (N.altura(P.J.x, P.J.z) < 0.5) mal('Fernando empieza en el agua');

/* 3) a pie: camina hacia el norte, salta y no se rompe */
{
  const x0 = P.J.x, z0 = P.J.z;
  correr(P, 60*4, {jx:0, jy:1, camYaw:0});
  const d = Math.hypot(P.J.x-x0, P.J.z-z0);
  if (d < 10) mal('caminando 4 s solo avanzó '+d.toFixed(1)+' m');
  if (P.J.z < z0) mal('debía caminar hacia el sur (+z)');
  correr(P, 1, {a:true}); correr(P, 30, {});
  if (!tipos.salto) mal('no saltó');
  bien('a pie: caminó', d.toFixed(0), 'm y saltó');
}
/* 4) hamburguesa → peo → ganas → baño → estrella */
{
  const h = N.HAMBURGUESAS[0];
  poner(P, h.x-1.5, h.z);
  correr(P, 60, {jx:0, jy:0});
  correr(P, 60, {jx:0, jy:1, camYaw: Math.atan2(h.x-P.J.x, h.z-P.J.z)});
  if (!tipos.hamburguesa) mal('no se comió la hamburguesa'); else bien('se comió la hamburguesa, popo al', Math.round(P.popo*100)+'%');
  if (!tipos.pedo) mal('no se echó el peo');
  const dicho = P.eventos; /* ya vaciados: se mira el contador */
  const b = N.BANOS[0];
  poner(P, b.px, b.pz);
  const f = correr(P, 60*8, {}, (P, evs)=>evs.some(e=>e.tipo==='banoSale'));
  if (!tipos.banoEntra) mal('no entró al baño');
  if (!tipos.banoSale) mal('no salió del baño'); else bien('hizo popo en', b.nombre, 'en', (f/60).toFixed(1), 's');
  if (!P.estrellas.includes('popo')) mal('no dio la estrella del popo');
  if (P.popo !== 0) mal('las ganas no se fueron');
  if (!tipos.plop || !tipos.descarga) mal('faltan los ruidos del baño');
  if (P.popitos.length !== 1) mal('al salir del baño debía nacer un popo bebé ('+P.popitos.length+')'); else bien('nació un popo bebé');
}
/* 5) el carro: acelera, gira, choca con la orilla y cruza las seis banderas */
{
  const v = montar(P, 'carro');
  let vmax = 0;
  correr(P, 60*6, (P)=>{ vmax = Math.max(vmax, v.vel); const c = N.cercaRuta(v.x, v.z); const m = N.puntoRuta(c.s + 22); return {jy:1, jx:hacia(v, m.x, m.z)}; });
  if (vmax < 15) mal('el carro no acelera ('+vmax.toFixed(1)+' m/s)');
  const a0 = v.ang; correr(P, 60*2, {jy:1, jx:1});
  if (Math.abs(env(v.ang-a0)) < 0.5) mal('el carro no gira');
  /* la orilla lo frena: apunta al mar */
  const ori = Math.atan2(v.x, v.z);
  correr(P, 60*30, (P)=>({jy:1, jx:hacia(v, Math.sin(ori)*600, Math.cos(ori)*600)}));
  if (N.altura(v.x, v.z) < -1) mal('el carro se metió al mar (suelo '+N.altura(v.x,v.z).toFixed(1)+')');
  else bien('carro: acelera a', vmax.toFixed(0), 'm/s, gira y la orilla lo frena');
  /* de vuelta a la carretera y a dar la vuelta cruzando banderas */
  const m0 = N.puntoRuta(N.BANDERAS[0].s - 60);
  v.x = m0.x; v.z = m0.z; v.y = N.altura(v.x,v.z); v.ang = Math.atan2(m0.tx, m0.tz); v.vel = 0;
  const f = correr(P, 60*200, (P)=>{ const c = N.cercaRuta(v.x, v.z); const m = N.puntoRuta(c.s + 22); return {jy:1, jx:hacia(v, m.x, m.z), b: c.d < 3}; },
                   (P)=>P.estrellas.includes('carro'));
  if (!P.estrellas.includes('carro')) mal('el carro no cruzó las seis banderas ('+P.prog.banderas.length+')');
  else bien('carro: dio la vuelta a la isla y cruzó las 6 banderas en', (f/60).toFixed(0), 's');
  correr(P, 60*2, {jy:-1}); correr(P, 60*2, {});
  correr(P, 1, {salir:true});
  if (P.veh) mal('no se bajó del carro');
}
/* 6) la moto y la rampa */
{
  const v = montar(P, 'moto');
  const R = N.RAMPA;
  v.x = R.x - R.tx*70; v.z = R.z - R.tz*70; v.y = N.altura(v.x, v.z); v.ang = Math.atan2(R.tx, R.tz); v.vel = 0;
  let maxY = -1e9;
  const f = correr(P, 60*12, (P)=>{ maxY = Math.max(maxY, v.y); return {jy:1, b:true, jx:hacia(v, R.x + R.tx*60, R.z + R.tz*60)}; }, (P)=>P.estrellas.includes('moto'));
  if (!P.estrellas.includes('moto')) mal('la moto no pasó por el aro de la rampa (subió hasta '+(maxY-R.base).toFixed(1)+' m sobre la carretera, aro a '+(R.aro.y-R.base).toFixed(1)+')');
  else bien('moto: saltó la rampa y pasó el aro a', (maxY-R.base).toFixed(1), 'm de altura en', (f/60).toFixed(1), 's');
  if (!tipos.brinco){ correr(P, 120, {}); correr(P, 1, {a:true}); correr(P, 30, {}); if (!tipos.brinco) mal('la moto no brinca con A'); }
  correr(P, 60*2, {jy:-1}); correr(P, 60*2, {}); correr(P, 1, {salir:true});
  if (P.veh) mal('no se bajó de la moto');
}
/* 7) el avión: despega, no se puede bajar en el aire, cruza los siete aros y aterriza */
{
  const v = montar(P, 'avion');
  const f0 = correr(P, 60*20, {jy:1}, (P)=>v.aire);
  if (!v.aire) mal('el avión no despegó (vel '+v.vel.toFixed(1)+')'); else bien('avión: despegó a los', (f0/60).toFixed(1), 's');
  correr(P, 60*2, {jy:1});
  if (v.y < N.altura(v.x,v.z)+8) mal('el avión no sube');
  correr(P, 1, {salir:true});
  if (!P.veh) mal('se bajó del avión en pleno vuelo');
  const f = correr(P, 60*400, (P)=>{
    const i = N.AROS.findIndex((a,i)=>!P.prog.aros.includes(i)); if (i<0) return {jy:0};
    const a = N.AROS[i]; const d = Math.hypot(a.x-v.x, a.z-v.z);
    const jy = Math.max(-1, Math.min(1, (a.y - v.y)/Math.max(8, d*0.35)));
    return {jy, jx:hacia(v, a.x, a.z), b: d > 80};
  }, (P)=>P.estrellas.includes('avion'));
  if (!P.estrellas.includes('avion')) mal('el avión no cruzó los siete aros ('+P.prog.aros.length+')');
  else bien('avión: cruzó los 7 aros en', (f/60).toFixed(0), 's, techo', Math.round(v.y), 'm');
  /* aterrizar: se deja caer suavecito sobre la pista */
  const px = N.PISTA.x, pz = (N.PISTA.z0+N.PISTA.z1)/2;
  const fa = correr(P, 60*120, (P)=>{ const d = Math.hypot(px-v.x, pz-v.z); return {jy: d > 60 ? Math.max(-1, Math.min(1, (18 - v.y)/20)) : -0.3, jx:hacia(v, px, pz)}; }, (P)=>!v.aire);
  if (v.aire) mal('el avión no aterrizó'); else bien('avión: aterrizó a los', (fa/60).toFixed(0), 's, suelo', N.altura(v.x,v.z).toFixed(1), 'm');
  correr(P, 60*3, {jy:-1}); correr(P, 60*2, {}); correr(P, 1, {salir:true});
  if (P.veh) mal('no se bajó del avión');
}
/* 8) el barco hasta la islita y el abrazo a Santi */
{
  const v = montar(P, 'barco');
  /* bordeando la costa del sur, como lo haría un niño mirando el mapita */
  const ruta = [[-100,380],[250,330],[400,220],[N.ISLITA.x, N.ISLITA.z]]; let paso_ = 0;
  const f = correr(P, 60*150, (P)=>{ const w = ruta[paso_]; if (paso_ < ruta.length-1 && Math.hypot(v.x-w[0], v.z-w[1]) < 25) paso_++; return {jy:1, b:true, jx:hacia(v, w[0], w[1])}; }, (P)=>Math.hypot(v.x-N.ISLITA.x, v.z-N.ISLITA.z) < 40);
  const d = Math.hypot(v.x-N.ISLITA.x, v.z-N.ISLITA.z);
  if (d > 40) mal('el barco no llegó a la islita (quedó a '+d.toFixed(0)+' m)'); else bien('barco: llegó a la islita en', (f/60).toFixed(0), 's');
  correr(P, 60*4, (P)=>({jy:1, jx:hacia(v, N.ISLITA.x, N.ISLITA.z)}));
  if (N.altura(v.x, v.z) > 0) mal('el barco se subió a la playa');
  correr(P, 60*3, {jy:-1}); correr(P, 60*3, {}); correr(P, 1, {salir:true});
  if (P.veh) mal('no se bajó del barco');
  const fs = correr(P, 60*30, (P)=>({jy:1, camYaw: Math.atan2(N.ISLITA.x-P.J.x, N.ISLITA.z-P.J.z)}), (P)=>P.prog.santi);
  if (!P.prog.santi) mal('no abrazó a Santi (quedó a '+Math.hypot(P.J.x-N.ISLITA.x, P.J.z-N.ISLITA.z).toFixed(1)+' m)');
  else bien('nadó y caminó hasta Santi en', (fs/60).toFixed(0), 's ·', tipos.chapoteo ? 'con chapoteo' : 'sin chapoteo');
  if (!P.estrellas.includes('barco')) mal('no dio la estrella del barco');
}
/* 9) el submarino: baja al fondo, no se puede bajar del vehículo hundido, y encuentra el cofre */
{
  const v = montar(P, 'sub');
  correr(P, 60*4, {b:true});
  if (v.y > -3.5) mal('el submarino no se hunde (y '+v.y.toFixed(1)+')');
  correr(P, 1, {salir:true});
  if (!P.veh) mal('se bajó del submarino bajo el agua');
  const ruta = [[-330,200],[-420,-50],[-380,-300],[N.COFRE.x, N.COFRE.z]]; let paso_ = 0;
  const f = correr(P, 60*200, (P)=>{ const w = ruta[paso_]; if (paso_ < ruta.length-1 && Math.hypot(v.x-w[0], v.z-w[1]) < 25) paso_++;
    const fondo = N.altura(v.x, v.z); return {jy:1, jx:hacia(v, w[0], w[1]), b: v.y > fondo + 6, a: v.y < fondo + 3}; }, (P)=>P.prog.cofre);
  if (!P.prog.cofre) mal('el submarino no llegó al cofre (a '+Math.hypot(v.x-N.COFRE.x, v.z-N.COFRE.z).toFixed(0)+' m, y '+v.y.toFixed(1)+')');
  else bien('submarino: encontró el cofre en', (f/60).toFixed(0), 's a', v.y.toFixed(0), 'm de profundidad');
  correr(P, 60*10, {a:true});
  if (v.y < -0.9) mal('el submarino no sube a la superficie');
  correr(P, 1, {salir:true});
  if (P.veh) mal('no se bajó del submarino en la superficie');
  if (!P.J.nadando) mal('al bajarse en alta mar debía quedar nadando');
}
/* 10) la familia y los perritos */
{
  for (const f of N.FAMILIA){ if (f.bebe) continue; poner(P, f.x + Math.sin(f.ang)*1.5, f.z + Math.cos(f.ang)*1.5); correr(P, 3, {}); if (!P.saludos[f.id]) mal('no saludó a '+f.nombre); }
  if (!P.estrellas.includes('familia')) mal('no dio la estrella de la familia ('+P.prog.familia.length+'/'+N.FAMILIA.length+')'); else bien('saludó a toda la familia');
  if (!tipos.eructo) mal('Rómulo no eructó');
  for (const p of P.perros){ poner(P, p.x+1, p.z); correr(P, 3, {}); if (!p.sigue) mal(p.nombre+' no sigue a Fernando'); }
  poner(P, N.INICIO.x, N.INICIO.z);
  correr(P, 60*6, {jy:1, camYaw:Math.PI});
  for (const p of P.perros) if (Math.hypot(p.x-P.J.x, p.z-P.J.z) > 9) mal(p.nombre+' se quedó atrás ('+Math.hypot(p.x-P.J.x, p.z-P.J.z).toFixed(0)+' m)');
  for (const p of P.popitos) if (Math.hypot(p.x-P.J.x, p.z-P.J.z) > 12) mal('el popo bebé se quedó atrás ('+Math.hypot(p.x-P.J.x, p.z-P.J.z).toFixed(0)+' m)');
  bien('Penny, Sheldon y', P.popitos.length, 'popo bebé lo siguen');
}
/* 11) popo en los cuatro baños → última estrella → final */
{
  for (const b of N.BANOS){
    if (P.prog.banos.includes(b.id)) continue;
    const h = N.HAMBURGUESAS.find(h=>!P.comidas.has(h.id) && h.y < 30);
    poner(P, h.x, h.z); correr(P, 2, {});
    if (P.popo <= 0) mal('no comió antes de ir a '+b.nombre);
    poner(P, b.px, b.pz);
    correr(P, 60*8, {}, (P, evs)=>evs.some(e=>e.tipo==='banoSale'));
  }
  if (P.prog.banos.length !== N.BANOS.length) mal('no hizo popo en los cuatro baños ('+P.prog.banos.length+')');
  if (P.popitos.length !== N.BANOS.length) mal('debía haber '+N.BANOS.length+' popos bebés y hay '+P.popitos.length);
  if (!P.estrellas.includes('banos')) mal('no dio la estrella de los baños');
  if (P.estrellas.length !== N.MISIONES.length) mal('faltan estrellas: '+N.MISIONES.filter(m=>!P.estrellas.includes(m.id)).map(m=>m.id).join(', '));
  if (!tipos.final) mal('no llegó el final');
  else bien('¡las', P.estrellas.length, 'estrellas! puntos:', P.puntos, '· hamburguesas:', P.hamburguesas);
}
/* 12) guardar y seguir */
{
  const g = JSON.parse(JSON.stringify(N.exportar(P)));
  const P2 = N.crearPartida(g);
  if (P2.estrellas.length !== P.estrellas.length || P2.puntos !== P.puntos || P2.comidas.size !== P.comidas.size || P2.popitos.length !== P.popitos.length) mal('la partida guardada no se recupera igual');
  else bien('la partida se guarda y se recupera');
  const o = N.objetivo(P2); if (!o || typeof o.texto !== 'string') mal('objetivo() no responde');
  const P3 = N.crearPartida(); for (let i=0;i<5;i++){ const o = N.objetivo(P3); if (!o.texto) mal('objetivo vacío'); paso(P3, {}); }
}
/* 13) los eventos que la vista necesita salieron todos */
for (const t of ['hamburguesa','pedo','ganas','banoEntra','banoPuerta','plop','descarga','banoSale','estrella','montar','bajar','noBajar','despegue','aterriza','estelaAire','estela','polvo','burbujas','choque','saludo','perro','popito','bandera','aro','rampa','cofre','final','hablar','salto','chapoteo'])
  if (!tipos[t]) mal('nunca salió el evento '+t);
console.log(fallos ? '\n'+fallos+' FALLO(S)' : '\n✓ La Gran Aventura sin fallos');
process.exit(fallos ? 1 : 0);
