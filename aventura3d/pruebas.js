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
/* 1b) el paquete de diálogos: cada personaje jugable tiene su frase para cada situación, y cada frase su grabación */
{
  let frases = 0;
  for (const pj of N.PERSONAJES_RED){
    const paq = N.DIALOGOS[pj.id];
    if (!paq){ mal('sin paquete de diálogos: '+pj.nombre); continue; }
    for (const k of N.CLAVES_DIALOGO){
      const t = N.fraseDe(pj.id, k, 'abu');
      if (!t) mal('sin frase '+k+' para '+pj.nombre);
      else if (!(pj.id==='fernando' ? N.CLIPS[t] : (N.CLIPS_PJ[pj.id] && N.CLIPS_PJ[pj.id][t]))) mal('sin grabación de '+pj.nombre+': '+t);
      else frases++;
    }
  }
  if (N.fraseDe('fernando','saludo','abu') !== 'Te amo Abu') mal('Fernando debe saludar a Abu con su frase de FAMILIA');
  if (N.fraseDe('luca','hamburguesa') === N.fraseDe('fernando','hamburguesa')) mal('Luca debería tener su propia frase de hamburguesa');
  for (const t of ['¡Hola! Soy el Señor Popo. ¡Come hamburguesas y ven a mi baño!', '¡Bravo! ¡Qué popo tan grande!']) if (!N.CLIPS[t]) mal('sin grabación: '+t);
  bien('diálogos:', N.PERSONAJES_RED.length, 'personajes con', frases, 'frases grabadas con su voz');
}

/* 2) la isla está bien armada */
{
  let rotos = 0; for (let i=0;i<N.MALLA.length;i++) if (!Number.isFinite(N.MALLA[i])) rotos++;
  if (rotos) mal('la malla del terreno tiene '+rotos+' alturas rotas');
  const enTierra = (x,z)=> N.altura(x,z) > 0.5;
  for (const v of N.VEHICULOS_DEF){
    const h = N.altura(v.x, v.z);
    if ((v.id==='barco'||v.id==='sub'||v.agua) ? h > -2 : h < 0.5) mal(v.nombre+' está mal puesto (suelo a '+h.toFixed(1)+' m)');
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
  if (N.DECOR.arboles.length < 200 || N.DECOR.palmeras.length < 40 || N.DECOR.pinos.length < 20) mal('pocos árboles: '+N.DECOR.arboles.length+'/'+N.DECOR.palmeras.length+'/'+N.DECOR.pinos.length);
  if (N.DECOR.arboles.length + N.DECOR.palmeras.length + N.DECOR.pinos.length > 1700) mal('demasiados árboles para chocar: '+(N.DECOR.arboles.length + N.DECOR.palmeras.length + N.DECOR.pinos.length));
  if (!enTierra(N.MARACAIBO.x, N.MARACAIBO.z)) mal('Maracaibo está bajo el agua');
  for (const c of N.CASAS_MCBO) if (!enTierra(c.x, c.z)) mal(c.nombre+' de Maracaibo está en el agua');
  for (const a of N.AREPAS) if (!enTierra(a.x, a.z)) mal('una arepa está en el agua');
  for (const h of N.HELIPUERTOS) if (!enTierra(h.x, h.z)) mal('el helipuerto de '+h.nombre+' está en el agua');
  for (const h of N.HUEVOS) if (!enTierra(h.x, h.z)) mal('un huevo está en el agua');
  for (const b of N.BOYAS) if (N.alturaAgua(b.x, b.z) > -2) mal('una boya está en seco');
  { let minP = 1e9; for (let t=0; t<=N.PUENTE.L; t+=2){ const x = N.PUENTE.x0+N.PUENTE.ux*t, z = N.PUENTE.z0+N.PUENTE.uz*t; const h = N.altura(x, z); minP = Math.min(minP, h); if (N.alturaAgua(x, z) < -1 && h < 3) mal('el puente se hunde en t='+t); }
    let salto = 0; for (let t=2; t<=N.PUENTE.L; t+=2){ const a = N.altura(N.PUENTE.x0+N.PUENTE.ux*t, N.PUENTE.z0+N.PUENTE.uz*t), b = N.altura(N.PUENTE.x0+N.PUENTE.ux*(t-2), N.PUENTE.z0+N.PUENTE.uz*(t-2)); salto = Math.max(salto, Math.abs(a-b)); }
    if (salto > 1.2) mal('el puente tiene un escalón de '+salto.toFixed(1)+' m'); else bien('puente a Maracaibo de', Math.round(N.PUENTE.L), 'm, sin escalones'); }
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


/* el paseo por el espacio: bajarse en la luna, recoger las rocas, subir a Saturno a saludar y a Júpiter por los cristales */
function paseoEspacial(P, v, nombreLuna){
  if (!P.zona || P.zona.id!=='luna') { mal('la nave no se posó en '+nombreLuna+' (zona '+(P.zona && P.zona.id)+')'); return; }
  bien('nave: se posó en '+nombreLuna+', gravedad', P.zona.grav);
  correr(P, 1, {salir:true}); if (P.veh) mal('no se bajó de la nave en '+nombreLuna);
  const Z = P.zona;
  let alto = 0; correr(P, 1, {a:true}); correr(P, 60, {}, (P)=>{ alto = Math.max(alto, P.J.y - Z.y); return P.J.suelo; });
  if (alto < 4.5) mal('en '+nombreLuna+' no se salta más alto ('+alto.toFixed(1)+' m)'); else bien('salto en '+nombreLuna+':', alto.toFixed(1), 'm');
  for (const r of Z.recogibles){
    P.J.x = r.x + 4; P.J.z = r.z; P.J.y = Z.y;
    correr(P, 60*6, (P)=>({jy:1, camYaw: Math.atan2(r.x-P.J.x, r.z-P.J.z)}), (P)=>P.prog.rocas.includes(r.id));
  }
  if (!P.estrellas.includes('rocas')) mal('no recogió las 6 rocas ('+P.prog.rocas.length+')'); else bien('rocas: las 6, con la estrella');
  const subir = (destino)=>{
    montar(P, 'nave');
    correr(P, 60*20, {a:true}, (P)=>!P.zona);
    if (P.zona) { mal('la nave no salió de la zona'); return false; }
    if (destino === null) return true;
    const B = N.ZONAS[destino].planeta;
    const f = correr(P, 60*200, (P)=>({a: v.y < B.y - B.r - 8, jy: Math.hypot(v.x-B.x, v.z-B.z) > 8 ? 1 : 0, jx: hacia(v, B.x, B.z)}), (P)=>P.zona && P.zona.id===destino);
    if (!P.zona || P.zona.id!==destino){ mal('la nave no llegó a '+destino+' (y '+v.y.toFixed(0)+', a '+Math.hypot(v.x-B.x, v.z-B.z).toFixed(0)+' m)'); return false; }
    bien('nave: llegó a '+N.ZONAS[destino].nombre+' en', (f/60).toFixed(0), 's');
    correr(P, 1, {salir:true}); if (P.veh) mal('no se bajó de la nave en '+destino);
    return true;
  };
  if (subir('saturno')){
    const S = P.zona;
    for (const a of P.aliens.saturno){
      for (let k=0;k<3 && !P.prog.saturnianos.includes(a.id);k++){ P.J.x = a.x + 3; P.J.z = a.z; P.J.y = S.y; correr(P, 60*4, (P)=>({jy:1, camYaw: Math.atan2(a.x-P.J.x, a.z-P.J.z)}), (P)=>P.prog.saturnianos.includes(a.id)); }
    }
    if (!P.estrellas.includes('saturno')) mal('no saludó a los 4 saturnianos ('+P.prog.saturnianos.length+')'); else bien('Saturno: saludó a los 4 saturnianos y ganó', P.monedas, 'monedas en total');
  }
  if (subir('jupiter')){
    const Jz = P.zona;
    for (const r of Jz.recogibles){ P.J.x = r.x + 4; P.J.z = r.z; P.J.y = Jz.y; correr(P, 60*6, (P)=>({jy:1, camYaw: Math.atan2(r.x-P.J.x, r.z-P.J.z)}), (P)=>P.prog.cristales.includes(r.id)); }
    if (!P.estrellas.includes('jupiter')) mal('no recogió los 5 cristales ('+P.prog.cristales.length+')'); else bien('Júpiter: los 5 cristales, gravedad', Jz.grav);
  }
  subir(null);
  const fb = correr(P, 60*200, {}, (P)=>v.suelo);
  if (!v.suelo) mal('la nave no volvió a posarse en la Tierra (y '+v.y.toFixed(0)+')'); else bien('nave: volvió a tierra en', (fb/60).toFixed(0), 's');
  correr(P, 1, {salir:true}); if (P.veh) mal('no se bajó de la nave');
}
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
  /* jugando como Luca, la hamburguesa se celebra con la frase y el nombre de Luca */
  P.pj = 'luca'; const dichos = []; const oir = (P, evs)=>{ for (const e of evs) if (e.tipo==='hablar') dichos.push(e); return false; };
  poner(P, h.x-1.5, h.z);
  correr(P, 60, {jx:0, jy:0}, oir);
  correr(P, 60, {jx:0, jy:1, camYaw: Math.atan2(h.x-P.J.x, h.z-P.J.z)}, oir);
  P.pj = 'fernando';
  if (!tipos.hamburguesa) mal('no se comió la hamburguesa'); else bien('se comió la hamburguesa, popo al', Math.round(P.popo*100)+'%');
  { const d = dichos.find(e=>e.k==='hamburguesa');
    if (!d) mal('no dijo nada al comer'); else if (d.texto !== N.fraseDe('luca','hamburguesa') || d.quien !== 'Luca' || d.pj !== 'luca') mal('la frase de la hamburguesa no es la de Luca: '+JSON.stringify(d)); else bien('como Luca dijo:', d.texto); }
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
  /* E en pleno vuelo: se salta en paracaídas, se cae despacito y el avión vuelve solo a la pista */
  correr(P, 1, {salir:true});
  if (P.veh || !P.paracaidas) mal('E en el aire debía abrir el paracaídas');
  let vyMin = 0; correr(P, 60*40, {jy:0.5, camYaw:0}, (P)=>{ vyMin = Math.min(vyMin, P.J.vy); return !P.paracaidas; });
  if (P.paracaidas) mal('el paracaídas no aterrizó'); else if (vyMin < -7) mal('con paracaídas cayó muy rápido: '+vyMin.toFixed(1)); else bien('paracaídas: saltó del avión y bajó a', (-vyMin).toFixed(1), 'm/s como máximo');
  correr(P, 60*9, {}, (P)=>!P.avionSolo);
  if (P.avionSolo || !v.suelo || Math.hypot(v.x-N.PISTA.x, v.z-70) > 2) mal('el avión no volvió solo a la pista'); else bien('el avión volvió solo a la pista');
  if (!tipos.paracaidas || !tipos.paracaidasSuelo || !tipos.avionVuelve) mal('faltan los eventos del paracaídas');
  montar(P, 'avion'); correr(P, 60*20, {jy:1}, (P)=>v.aire); correr(P, 60*2, {jy:1});
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
  const ruta = [[-150,570],[375,495],[600,330],[N.ISLITA.x, N.ISLITA.z]]; let paso_ = 0;
  const f = correr(P, 60*260, (P)=>{ const w = ruta[paso_]; if (paso_ < ruta.length-1 && Math.hypot(v.x-w[0], v.z-w[1]) < 25) paso_++; return {jy:1, b:true, jx:hacia(v, w[0], w[1])}; }, (P)=>Math.hypot(v.x-N.ISLITA.x, v.z-N.ISLITA.z) < 40);
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
  /* bordeando por fuera de Maracaibo */
  const ruta = [[-495,300],[-740,0],[-860,-300],[-700,-760],[-420,-830],[N.COFRE.x, N.COFRE.z]];   /* bordeando Maracaibo y la islita del castillo */ let paso_ = 0;
  const f = correr(P, 60*340, (P)=>{ const w = ruta[paso_]; if (paso_ < ruta.length-1 && Math.hypot(v.x-w[0], v.z-w[1]) < 25) paso_++;
    const fondo = N.altura(v.x, v.z); return {jy:1, jx:hacia(v, w[0], w[1]), b: v.y > fondo + 6, a: v.y < fondo + 3}; }, (P)=>P.prog.cofre);
  if (!P.prog.cofre) mal('el submarino no llegó al cofre (a '+Math.hypot(v.x-N.COFRE.x, v.z-N.COFRE.z).toFixed(0)+' m, y '+v.y.toFixed(1)+')');
  else bien('submarino: encontró el cofre en', (f/60).toFixed(0), 's a', v.y.toFixed(0), 'm de profundidad');
  correr(P, 60*10, {a:true});
  if (v.y < -0.9) mal('el submarino no sube a la superficie');
  correr(P, 1, {salir:true});
  if (P.veh) mal('no se bajó del submarino en la superficie');
  if (!P.J.nadando) mal('al bajarse en alta mar debía quedar nadando');
}
/* 9b) el helicóptero se posa en los cuatro helipuertos */
{
  const v = montar(P, 'heli');
  const f = correr(P, 60*300, (P)=>{
    const h = N.HELIPUERTOS.find(h=>!P.prog.helipuertos.includes(h.id)); if (!h) return {};
    const d = Math.hypot(v.x-h.x, v.z-h.z);
    if (d > 5) return {a: v.y < Math.max(h.y, N.altura(v.x, v.z)) + 25, jy: Math.min(1, d/40), jx: hacia(v, h.x, h.z)};
    return {b: true, jy: 0};
  }, (P)=>P.estrellas.includes('heli'));
  if (!P.estrellas.includes('heli')) mal('el helicóptero no aterrizó en los 4 helipuertos ('+P.prog.helipuertos.length+')'); else bien('helicóptero: los 4 helipuertos en', (f/60).toFixed(0), 's');
  correr(P, 60*3, {b:true}); correr(P, 1, {salir:true}); if (P.veh) mal('no se bajó del helicóptero');
}
/* 9c) la moto de agua pasa las seis boyas */
{
  const v = montar(P, 'motoagua');
  /* da la vuelta a la isla por fuera, boya por boya, con un punto intermedio en mar abierto entre cada dos */
  const a0 = Math.atan2(v.z, v.x);
  const orden = N.BOYAS.slice().sort((p, q)=>{ const da = (Math.atan2(p.z,p.x)-a0+Math.PI*4)%(Math.PI*2), db = (Math.atan2(q.z,q.x)-a0+Math.PI*4)%(Math.PI*2); return da-db; });
  const RM = N.R_ISLA + 100;
  const ruta = [[Math.cos(a0)*RM, Math.sin(a0)*RM]];
  for (const b of orden){ const ab = Math.atan2(b.z, b.x), prev = ruta[ruta.length-1], ap = Math.atan2(prev[1], prev[0]); const am = ap + env(ab-ap)/2; ruta.push([Math.cos(am)*RM, Math.sin(am)*RM]); ruta.push([b.x, b.z]); }
  let paso_ = 0;
  const f = correr(P, 60*480, (P)=>{ const w = ruta[Math.min(paso_, ruta.length-1)]; if (Math.hypot(v.x-w[0], v.z-w[1]) < 12) paso_++; return {jy:1, b:true, jx:hacia(v, w[0], w[1])}; }, (P)=>P.estrellas.includes('motoagua'));
  if (!P.estrellas.includes('motoagua')) mal('la moto de agua no pasó las 6 boyas ('+P.prog.boyas.length+')'); else bien('moto de agua: las 6 boyas en', (f/60).toFixed(0), 's');
  correr(P, 1, {a:true}); correr(P, 40, {}); if (!tipos.brinco) mal('la moto de agua no brinca');
  correr(P, 60*3, {jy:-1}); correr(P, 60*2, {}); correr(P, 1, {salir:true}); if (P.veh) mal('no se bajó de la moto de agua');
}
/* 9d) el dinosaurio recoge los ocho huevos sin chocar con los árboles */
{
  const v = montar(P, 'dino');
  const f = correr(P, 60*240, (P)=>{ const h = N.HUEVOS.find(h=>!P.prog.huevos.includes(h.id)); if (!h) return {}; return {jy:1, b:true, jx:hacia(v, h.x, h.z)}; }, (P)=>P.estrellas.includes('dino'));
  if (!P.estrellas.includes('dino')) mal('el dinosaurio no recogió los 8 huevos ('+P.prog.huevos.length+')'); else bien('dinosaurio: los 8 huevos en', (f/60).toFixed(0), 's ·', tipos.rugido||0, 'rugidos');
  correr(P, 60*2, {jy:-1}); correr(P, 60*2, {}); correr(P, 1, {salir:true}); if (P.veh) mal('no se bajó del dinosaurio');
}
/* 9e) la nave espacial sube hasta la luna y vuelve */
{
  const v = montar(P, 'nave');
  const f = correr(P, 60*120, (P)=>({a:true, jy: v.y > 80 ? Math.min(1, Math.hypot(v.x-N.LUNA.x, v.z-N.LUNA.z)/30) : 0, jx: hacia(v, N.LUNA.x, N.LUNA.z)}), (P)=>P.estrellas.includes('luna'));
  if (!P.estrellas.includes('luna')) mal('la nave no llegó a la luna (y '+v.y.toFixed(0)+')'); else bien('nave: llegó a la luna en', (f/60).toFixed(0), 's');
  if (!tipos.espacio || !tipos.banderaLuna) mal('faltan los eventos del espacio o la bandera');
  paseoEspacial(P, v, 'la luna');
}
/* 9f) el carro cruza el puente hasta Maracaibo y come arepas */
{
  const v = montar(P, 'carro');
  const t0 = N.PUENTE.x0 - N.PUENTE.ux*25, z0 = N.PUENTE.z0 - N.PUENTE.uz*25;
  v.x = t0; v.z = z0; v.y = N.altura(v.x, v.z); v.ang = Math.atan2(N.PUENTE.ux, N.PUENTE.uz); v.vel = 0;
  let minAlt = 1e9, nudos = 0;
  const f = correr(P, 60*40, (P)=>{ if (N.enPuente(v.x, v.z) >= 0) minAlt = Math.min(minAlt, v.y); return {jy:1, jx:hacia(v, N.PUENTE.x1 + N.PUENTE.ux*30, N.PUENTE.z1 + N.PUENTE.uz*30)}; }, (P, evs)=>{ for (const e of evs) if (e.tipo==='hablar' && e.k==='puente') nudos++; return N.enMaracaibo(v.x, v.z) && N.enPuente(v.x, v.z) < 0; });
  if (nudos !== 1) mal('al cruzar el puente debería decir una sola vez lo del nudo en la garganta (dijo '+nudos+')'); else bien('en el puente dijo:', N.fraseDe('fernando','puente'));
  if (!N.enMaracaibo(v.x, v.z)) mal('el carro no cruzó el puente (queda a '+Math.hypot(v.x-N.MARACAIBO.x, v.z-N.MARACAIBO.z).toFixed(0)+' m, suelo '+N.altura(v.x,v.z).toFixed(1)+')');
  else bien('carro: cruzó el puente a Maracaibo en', (f/60).toFixed(0), 's, a', minAlt.toFixed(1), 'm sobre el mar como mínimo');
  if (!tipos.maracaibo) mal('no avisó la llegada a Maracaibo');
  const fa = correr(P, 60*120, (P)=>{ const a = N.AREPAS.find(a=>!P.comidasArepas.has(a.id)); if (!a) return {}; return {jy:0.6, jx:hacia(v, a.x, a.z)}; }, (P)=>P.estrellas.includes('maracaibo'));
  if (!P.estrellas.includes('maracaibo')) mal('no se comió las 5 arepas ('+P.arepas+')'); else bien('Maracaibo: 5 arepas en', (fa/60).toFixed(0), 's');
  if (!tipos.arepa) mal('no salió el evento arepa');
  correr(P, 60*2, {jy:-1}); correr(P, 60*2, {}); correr(P, 1, {salir:true}); if (P.veh) mal('no se bajó del carro en Maracaibo');
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
  if (P.prog.banos.length !== N.BANOS.length) mal('no hizo popo en los '+N.BANOS.length+' baños ('+P.prog.banos.length+')');
  if (P.popitos.length !== N.BANOS.length + 0 && P.popitos.length !== Math.min(N.MAX_POPITOS, N.BANOS.length)) mal('debía haber '+N.BANOS.length+' popos bebés y hay '+P.popitos.length);
  if (!P.estrellas.includes('banos')) mal('no dio la estrella de los baños');
  if (P.estrellas.length !== N.MISIONES.length) mal('faltan estrellas: '+N.MISIONES.filter(m=>!P.estrellas.includes(m.id)).map(m=>m.id).join(', '));
  if (!tipos.final) mal('no llegó el final');
  else bien('¡las', P.estrellas.length, 'estrellas! puntos:', P.puntos, '· hamburguesas:', P.hamburguesas);
}
/* 12) guardar y seguir */
{
  const g = JSON.parse(JSON.stringify(N.exportar(P)));
  const P2 = N.crearPartida(g);
  if (P2.estrellas.length !== P.estrellas.length || P2.puntos !== P.puntos || P2.comidas.size !== P.comidas.size || P2.popitos.length !== P.popitos.length || P2.arepas !== P.arepas || P2.prog.helipuertos.length !== P.prog.helipuertos.length || P2.prog.luna !== P.prog.luna) mal('la partida guardada no se recupera igual');
  else bien('la partida se guarda y se recupera');
  const o = N.objetivo(P2); if (!o || typeof o.texto !== 'string') mal('objetivo() no responde');
  const P3 = N.crearPartida(); for (let i=0;i<5;i++){ const o = N.objetivo(P3); if (!o.texto) mal('objetivo vacío'); paso(P3, {}); }
}
/* 13) jugar con amigos: los códigos de sala y los paquetes que viajan por la red */
{
  for (let i=0;i<50;i++){ const c = N.codigoSala(); if (c.length!==4 || c.split('').some(ch=>!N.ALFABETO_SALA.includes(ch))) mal('código de sala raro: '+c); }
  if (N.normalizarCodigo(' ab-cd ') !== 'ABCD') mal('normalizarCodigo no limpia: '+N.normalizarCodigo(' ab-cd '));
  if (N.normalizarCodigo('popo1') !== 'PP') mal('normalizarCodigo debía quitar la O y el 1: '+N.normalizarCodigo('popo1'));
  if (N.normalizarCodigo('abcdefg') !== 'ABCD') mal('normalizarCodigo debía cortar a 4');
  const Q = N.crearPartida();
  const a = N.empaquetarEstado(Q, 'luca', 'Luca'), r1 = N.desempaquetarEstado(JSON.parse(JSON.stringify(a)));
  if (!r1 || r1.pj!=='luca' || r1.nombre!=='Luca' || Math.abs(r1.x-Q.J.x)>0.01 || r1.veh!=='' ) mal('el paquete a pie no da la vuelta bien');
  const v = Q.vehiculos.find(v=>v.id==='avion'); Q.veh = v; v.aire = true; v.cabeceo = 0.3; v.vel = 34; Q.J.x = v.x;
  const b = N.empaquetarEstado(Q, 'fernando', 'Fernando'), r2 = N.desempaquetarEstado(JSON.parse(JSON.stringify(b)));
  if (!r2 || r2.veh!=='avion' || !r2.aire || Math.abs(r2.cabeceo-0.3)>0.01 || Math.abs(r2.vel-34)>0.1) mal('el paquete en avión no da la vuelta bien');
  if (JSON.stringify(b).length > 260) mal('el paquete pesa mucho: '+JSON.stringify(b).length+' bytes');
  if (N.desempaquetarEstado({t:'e', x:'no', y:1, z:2}) !== null) mal('un paquete sin posición debía rechazarse');
  const basura = N.desempaquetarEstado({t:'e', pj:'bowser', n:'<script>x'.repeat(9), x:NaN+0*0 || 0, y:1e9, z:-1e9, a:99, v:'cohete', m:-5, pp:999, es:50});
  if (!basura || basura.pj!=='fernando' || basura.x!==0 || basura.y!==950 || basura.z!==-N.LIMITE || basura.veh!=='' || basura.mov!==0 || basura.popitos!==N.MAX_POPITOS || basura.estrellas!==8 || /[<>]/.test(basura.nombre)) mal('un paquete con basura no se limpia bien: '+JSON.stringify(basura));
  if (N.desempaquetarEstado(null) !== null || N.desempaquetarEstado({t:'hola'}) !== null || N.desempaquetarEstado('e') !== null) mal('desempaquetar debía rechazar lo que no es estado');
  bien('red: códigos de sala y paquetes de', JSON.stringify(a).length, 'bytes que se limpian solos');
}
/* 13b) lo nuevo: casas y castillo por dentro, la nave extraterrestre, los dinosaurios sueltos,
   los meteoritos, la isla de las bananas, la vereda del lago y la gordura */
{
  const Q = N.crearPartida();
  /* el castillo: se entra por la puerta con A, se camina adentro sin salirse del salón, y se sale */
  const I = N.INTERIOR_CASTILLO;
  if (!I || !I.castillo || I.muebles.length < 10) mal('el castillo no tiene salón');
  poner(Q, I.ex, I.ez); correr(Q, 2, {});
  if (!Q.cercaPuerta || Q.cercaPuerta !== I) mal('frente al portón no se ofrece entrar');
  const evsC = paso(Q, {a:true});
  if (Q.casa !== I || Math.abs(Q.J.y - N.Y_INTERIOR) > 0.01) mal('no entró al castillo: '+JSON.stringify({casa: Q.casa && Q.casa.nombre, y: Q.J.y}));
  if (!evsC.some(e=>e.tipo==='casaEntra' && e.castillo)) mal('no salió el evento casaEntra del castillo');
  const dicho = evsC.find(e=>e.tipo==='hablar' && e.k==='castillo'); if (!dicho || !/castillo/i.test(dicho.texto)) mal('no dijo lo del castillo');
  correr(Q, 60*6, {jy:1, camYaw: I.ang + Math.PI});
  if (Math.abs(Q.J.x - I.x) > I.hw || Math.abs(Q.J.z - I.z) > I.hd) mal('se salió del salón caminando');
  if (Q.J.y < N.Y_INTERIOR - 0.01) mal('se hundió en el piso del castillo');
  /* los muebles chocan: parado en el trono se sale empujado */
  const trono = I.muebles.find(m=>m.t==='trono'); Q.J.x = trono.x; Q.J.z = trono.z; correr(Q, 30, {});
  if (Math.abs(Q.J.x - trono.x) < trono.w/2 && Math.abs(Q.J.z - trono.z) < trono.d/2) mal('el trono no empuja');
  Q.J.x = I.px - Math.sin(I.ang)*1.2; Q.J.z = I.pz - Math.cos(I.ang)*1.2; correr(Q, 2, {});
  if (Q.cercaPuerta !== I) mal('junto a la puerta de adentro no se ofrece salir');
  correr(Q, 1, {a:true});
  if (Q.casa || Math.abs(Q.J.x - I.ex) > 0.01 || Math.abs(Q.J.y - N.altura(I.ex, I.ez)) > 0.01) mal('no salió del castillo bien');
  /* una casa cualquiera, con Penny siguiendo: adentro los perritos se esconden y afuera vuelven */
  const casa = N.INTERIORES.find(J=>J.nombre==='CASA DE FERNANDO');
  Q.perros[0].sigue = true;
  poner(Q, casa.ex, casa.ez); correr(Q, 2, {}); correr(Q, 1, {a:true}); correr(Q, 10, {});
  if (Q.casa !== casa) mal('no entró a la casa de Fernando'); if (!Q.perros[0].dentro) mal('Penny no se escondió al entrar');
  const cama = casa.muebles.find(m=>m.t==='cama'); Q.J.x = cama.x; Q.J.z = cama.z; correr(Q, 30, {});
  if (Math.abs(Q.J.x - cama.x) < cama.w/2 && Math.abs(Q.J.z - cama.z) < cama.d/2) mal('la cama no empuja');
  Q.J.x = casa.px - Math.sin(casa.ang)*1.2; Q.J.z = casa.pz - Math.cos(casa.ang)*1.2; correr(Q, 2, {}); correr(Q, 1, {a:true}); correr(Q, 5, {});
  if (Q.casa || Q.perros[0].dentro) mal('al salir de la casa algo quedó adentro');
  bien('casas y castillo: se entra con A, hay '+N.INTERIORES.length+' cuartos con muebles que chocan, y se sale por la puerta');
  /* la nave extraterrestre: se monta, sube con A, no deja bajarse en el aire, y baja con B */
  const ov = montar(Q, 'ovni');
  if (!Q.eventos.some(e=>e.tipo==='hablar' && e.k==='ovni') && !tipos.hablar) mal('no dijo lo de la nave extraterrestre');
  correr(Q, 60*3, {a:true});
  if (!ov.aire || ov.y < 8) mal('la nave extraterrestre no sube: y='+ov.y.toFixed(1));
  if (N.puedeBajar(Q)) mal('deja bajarse de la nave extraterrestre en el aire');
  correr(Q, 60*4, {jy:1});
  if (Math.hypot(ov.x - N.CASTILLO.x, ov.z - (N.CASTILLO.z-44)) < 20) mal('la nave extraterrestre no avanza');
  const fb = correr(Q, 60*20, {b:true}, (P)=>ov.suelo);
  if (!ov.suelo) mal('la nave extraterrestre no aterriza'); else bien('nave extraterrestre: sube, vuela y aterriza en '+(fb/60).toFixed(0)+' s');
  correr(Q, 1, {salir:true}); if (Q.veh) mal('no se pudo bajar de la nave extraterrestre');
  /* los dinosaurios sueltos: pasean por su valle, en tierra, y empujan al que camina */
  poner(Q, N.VALLE_DINOS.x - 40, N.VALLE_DINOS.z); const antes = Q.dinos.map(d=>({x:d.x, z:d.z}));
  correr(Q, 60*25, {});
  let movidos = 0; Q.dinos.forEach((d, i)=>{ const V = N.VALLES_DINOS[N.DINOS[i].valle||0]; if (N.altura(d.x, d.z) < 1.4) mal('un dinosaurio se metió al agua'); if (Math.hypot(d.x - V.x, d.z - V.z) > V.r + 8) mal('un dinosaurio se fue del valle'); if (Math.hypot(d.x-antes[i].x, d.z-antes[i].z) > 4) movidos++; });
  if (movidos < 2) mal('los dinosaurios no pasean: solo '+movidos+' se movieron');
  if (!tipos.dinosVistos) mal('no se dijo lo de los dinosaurios al acercarse');
  { const d = Q.dinos[0]; Q.J.x = d.x; Q.J.z = d.z; Q.J.y = N.altura(d.x, d.z); correr(Q, 5, {}); if (Math.hypot(Q.J.x-d.x, Q.J.z-d.z) < d.r) mal('el dinosaurio no empuja'); }
  bien('dinosaurios: '+movidos+' pasean por el valle sin meterse al agua');
  /* los meteoritos: cae una lluvia cerca y todos tocan tierra */
  poner(Q, 0, -30); Q.proxMeteoros = Q.t; correr(Q, 2, {});
  const enElAire = Q.meteoros.length; if (enElAire < 3) mal('la lluvia trajo pocos meteoritos: '+enElAire);
  correr(Q, 60*12, {}, (P)=>P.meteoros.length===0);
  if (Q.meteoros.length) mal('quedaron meteoritos flotando'); if ((tipos.meteoroCae||0) < enElAire) mal('no cayeron todos: '+tipos.meteoroCae+'/'+enElAire);
  if (!tipos.meteoros) mal('no salió el evento de la lluvia');
  bien('meteoritos: cayeron '+enElAire+' cerca de Fernando');
  /* la isla de las bananas: comer una vuelve gorila un minuto, corre más, y la banana vuelve a crecer */
  const bn = N.BANANAS[0]; poner(Q, bn.x - 5, bn.z);
  correr(Q, 60*3, {jy:1, camYaw: Math.PI/2}, (P)=>P.gorilaT > 0);
  if (!(Q.gorilaT > 0)) mal('la banana no volvió gorila a Fernando');
  if (!Q.eventos.some(e=>e.tipo==='gorila') && !tipos.gorila) mal('no salió el evento gorila');
  if (Q.bananasT[bn.id] === undefined) mal('la banana no se marcó comida');
  { poner(Q, 0, -30); let vg = 0; correr(Q, 90, {jy:1, camYaw:0}); vg = Q.J.mov; Q.gorilaT = 0; correr(Q, 90, {jy:1, camYaw:0}); if (!(vg > Q.J.mov*1.2)) mal('el gorila no corre más rápido: '+vg.toFixed(1)+' vs '+Q.J.mov.toFixed(1)); }
  Q.gorilaT = 2; correr(Q, 3, {}); if (Q.gorilaT !== 0 || !tipos.gorila) mal('el gorila no se acaba');
  if (Q.t - Q.bananasT[bn.id] >= 60*45) mal('la prueba fue muy larga'); Q.bananasT[bn.id] = Q.t - 60*46; poner(Q, bn.x - 5, bn.z); correr(Q, 60*3, {jy:1, camYaw: Math.PI/2}, (P)=>P.gorilaT > 0);
  if (!(Q.gorilaT > 0)) mal('la banana no volvió a crecer');
  bien('isla de las bananas: gorila por un minuto, corre más, y las bananas vuelven a crecer');
  Q.gorilaT = 0;
  /* la vereda del lago: al pasear por ella se dice lo de la brisa */
  const vp = N.VEREDA.pts; if (vp.length < 20) mal('la vereda es muy corta'); for (const t of vp) if (N.altura(t.x, t.z) < 0.8) mal('la vereda pisa el agua');
  poner(Q, vp[10].x, vp[10].z); correr(Q, 30, {});
  if (!tipos.vereda) mal('no se dijo lo de la vereda del lago'); else bien('vereda del lago: '+vp.length+' tramos por la orilla de Maracaibo, con su frase');
  /* la gordura: cada hamburguesa engorda, el baño adelgaza y lo deja flaquito un rato */
  for (let i=0;i<5;i++) N.engordar(Q);
  if (Q.gordura !== 5) mal('no engordó: '+Q.gordura);
  if (!Q.eventos.some(e=>e.tipo==='hablar' && e.k==='gordo')) mal('no dijo que está gordito');
  { poner(Q, 0, -30); correr(Q, 90, {jy:1, camYaw:0}); const vGordo = Q.J.mov; Q.gordura = 0; correr(Q, 90, {jy:1, camYaw:0}); if (!(Q.J.mov > vGordo*1.15)) mal('gordito no camina más lento'); Q.gordura = 5; }
  Q.popo = 1; const bq = N.BANOS[0]; poner(Q, bq.px, bq.pz); correr(Q, 60*8, {}, (P, evs)=>evs.some(e=>e.tipo==='banoSale'));
  if (Q.gordura !== 0 || !(Q.flacoT > 0)) mal('el baño no lo dejó flaquito: '+JSON.stringify({g:Q.gordura, f:Q.flacoT}));
  if (!tipos.flaco) mal('no salió el evento flaco');
  const paq = N.empaquetarEstado(Q, 'fernando', 'Fer'); const des = N.desempaquetarEstado(paq);
  if (!des.flaco || des.gordura !== 0) mal('la red no lleva la gordura');
  bien('gordura: 5 hamburguesas = gordito y lento; el baño lo deja flaquito');
  /* la sala de conciertos: Fernando canta frente al micrófono; con otro personaje, Fernando está ahí y canta al saludarlo */
  { const C = N.crearPartida(); C.pj = 'fernando';
    if (N.altura(N.MICROFONO.x, N.MICROFONO.z) < 1.5) mal('el micrófono está en el agua');
    poner(C, N.MICROFONO.x, N.MICROFONO.z + 0.4); const antes = tipos.canta||0; correr(C, 10, {});
    if ((tipos.canta||0) === antes || !C.canto || C.canto.quien!=='yo') mal('Fernando no canta al pararse frente al micrófono');
    if (N.npcsCerca(C).some(n=>n.tipo==='cantante')) mal('siendo Fernando, hay otro Fernando cantante');
    correr(C, 60*3, {}); if (!C.canto) mal('la canción se cortó antes de tiempo');
    correr(C, N.CANCION_FRAMES, {}); if (C.canto) mal('la canción no terminó sola'); if (!tipos.cantoFin) mal('no avisó el final de la canción');
    const mon = C.monedas; poner(C, N.MICROFONO.x + 20, N.MICROFONO.z + 20); correr(C, 60*9, {}); poner(C, N.MICROFONO.x, N.MICROFONO.z + 0.4); correr(C, 10, {});
    if (!C.canto) mal('no vuelve a cantar al volver al micrófono'); if (C.monedas !== mon) mal('cantar de nuevo dio monedas otra vez');
    poner(C, N.MICROFONO.x + 12, N.MICROFONO.z); correr(C, 5, {}); if (C.canto) mal('se alejó del micrófono y la canción siguió');
    const R = N.crearPartida(); R.pj = 'tiojuan';
    poner(R, N.CANTANTE.x + 1.3, N.CANTANTE.z); correr(R, 5, {});
    if (!N.npcsCerca(R).some(n=>n.tipo==='cantante')) mal('siendo Tío Juan, Fernando no está de cantante');
    if (!R.canto || R.canto.quien!=='npc') mal('al saludar a Fernando cantante, no canta'); if (R.monedas < 25) mal('saludar al cantante no dio monedas');
    if (!tipos.conciertoCerca) mal('no se dijo nada al llegar a la sala de conciertos');
    bien('sala de conciertos: Fernando canta al micrófono, y de cantante canta cuando lo saludan');
  }
  /* fase 1: ovación tras la canción, correr 60% más, fútbol, tanque, tabla de surf y olas */
  { const C = N.crearPartida(); C.pj = 'fernando';
    poner(C, N.MICROFONO.x, N.MICROFONO.z + 0.4); correr(C, 10 + N.CANCION_FRAMES, {});
    if (!tipos.ovacion) mal('al terminar la canción no hubo ovación');
    poner(C, 0, -30); correr(C, 90, {jy:1, camYaw:0, b:true}); if (C.J.mov < 15) mal('con B no corre un 60% más rápido: '+C.J.mov.toFixed(1));
    const vB = C.J.mov; correr(C, 90, {jy:1, camYaw:0, b:true, c:true}); if (C.J.mov < vB*1.4) mal('con C no corre un 50% más: '+C.J.mov.toFixed(1)+' vs '+vB.toFixed(1)); if (!tipos.turboPie) mal('el turbo a pie no deja rayitas');
    correr(C, 90, {jy:1, camYaw:0, c:true}); if (C.J.mov < 6.2*1.4 || C.J.mov > 6.2*1.6) mal('con C solo, sin B, no va un 50% más que caminando: '+C.J.mov.toFixed(1));
    /* fútbol: correr contra el balón lo patea; llevarlo a la portería es gol */
    const B = C.balon; poner(C, N.CANCHA.x - 4, N.CANCHA.z); correr(C, 3, {});
    correr(C, 40, {jy:1, camYaw: Math.PI/2}); if (!tipos.patada) mal('correr contra el balón no lo patea'); if (Math.hypot(B.vx, B.vz) < 1 && Math.abs(B.x - N.CANCHA.x) < 0.5) mal('el balón no se movió');
    let goles = 0; for (let k=0;k<12 && !goles;k++){ B.x = N.CANCHA.x + N.CANCHA.w/2 - 6; B.z = N.CANCHA.z; B.vx = B.vz = B.vy = 0; poner(C, B.x - 2.5, B.z); correr(C, 3, {}); correr(C, 60, {jy:1, camYaw: Math.PI/2, b:true}); goles = C.goles; }
    if (!goles || !tipos.gol) mal('no se pudo meter gol'); if (C.monedas < 10) mal('el gol no dio monedas');
    correr(C, 120, {}); if (Math.hypot(B.x-N.CANCHA.x, B.z-N.CANCHA.z) > 1) mal('tras el gol el balón no volvió al centro');
    /* el tanque: se monta, con B dispara, la bala estalla y manda a volar una caja */
    const tq = C.vehiculos.find(v=>v.id==='tanque'); if (!tq) mal('no hay tanque');
    poner(C, tq.x + 3, tq.z); correr(C, 3, {}); correr(C, 1, {a:true}); if (C.veh !== tq) mal('no se montó en el tanque');
    const caja = C.props.find(p=>p.tipo==='caja'); tq.ang = Math.atan2(caja.x - tq.x, caja.z - tq.z); const dc = Math.hypot(caja.x-tq.x, caja.z-tq.z); tq.x = caja.x - Math.sin(tq.ang)*Math.min(dc, 30); tq.z = caja.z - Math.cos(tq.ang)*Math.min(dc, 30); tq.y = N.altura(tq.x, tq.z);
    correr(C, 2, {b:true}); if (!tipos.disparo || !C.balas.length) mal('el tanque no disparó con B');
    correr(C, 60*4, {}, (P)=>tipos.explosion); if (!tipos.explosion) mal('la bala del tanque no estalló');
    correr(C, 1, {salir:true}); if (C.veh) mal('no se pudo bajar del tanque');
    /* las olas grandes y la tabla de surf */
    let maxOla = 0; for (let k=0;k<200;k++) maxOla = Math.max(maxOla, Math.abs(N.olaGrande(N.OLAS.x, N.OLAS.z, k*0.05))); if (maxOla < 1.8) mal('las olas grandes no son grandes: '+maxOla.toFixed(2));
    if (Math.abs(N.olaGrande(N.OLAS.x + N.OLAS.r*1.2, N.OLAS.z, 1)) > 0.01) mal('las olas grandes se salen de su zona');
    const tb = C.vehiculos.find(v=>v.id==='tabla'); if (!tb) mal('no hay tabla de surf'); if (N.altura(tb.x, tb.z) > -1.1) mal('la tabla no está en el agua');
    C.J.x = tb.x + 2; C.J.z = tb.z; C.J.y = 0; C.J.nadando = true; C.J.suelo = false; correr(C, 3, {}); correr(C, 1, {a:true}); if (C.veh !== tb) mal('no se montó en la tabla');
    tb.x = N.OLAS.x; tb.z = N.OLAS.z; tb.ang = Math.atan2(-N.OLAS.dx, -N.OLAS.dz); let vmax = 0; correr(C, 60*20, {jy:1}, (P)=>{ vmax = Math.max(vmax, tb.vel); return tipos.surfea; });
    if (!tipos.surfea) mal('en las olas grandes no se surfea (vel máx '+vmax.toFixed(1)+')'); if (C.monedas < 30) mal('agarrar la ola no dio monedas');
    bien('fase 1: ovación, carrera 60% más rápida, fútbol con goles, tanque que dispara y tabla de surf en las olas');
  }
  /* fase 2: cuartos grandes con muebles que se usan, dormir, sentarse; afuera cajas, escaleras a los techos y columpios */
  { const C = N.crearPartida(); C.pj = 'fernando';
    const I = N.INTERIORES.find(I=>I.nombre==='CASA DE FERNANDO');
    if (I.hw < 9 || I.hd < 7) mal('la casa por dentro no creció: '+I.hw+'×'+I.hd);
    if (Math.max(N.INTERIOR_CASTILLO.hw, N.INTERIOR_CASTILLO.hd) < 18) mal('el castillo por dentro no creció');
    if (!I.muebles.some(m=>m.t==='nevera') || !I.muebles.some(m=>m.t==='piano')) mal('faltan la nevera o el piano en la casa');
    poner(C, I.ex, I.ez); correr(C, 2, {}); correr(C, 1, {a:true}); if (!C.casa) mal('no entró a la casa de Fernando');
    const junto = (t)=>{ const m = I.muebles.find(m=>m.t===t); C.J.x = m.x - Math.sin(m.ang)*(m.d/2+0.6); C.J.z = m.z - Math.cos(m.ang)*(m.d/2+0.6); C.J.y = I.y; C.J.vx = C.J.vz = 0; correr(C, 2, {}); return m; };
    junto('tele'); if (!C.cercaMueble || C.cercaMueble.t!=='tele') mal('junto a la tele no se ofrece usarla: '+(C.cercaMueble && C.cercaMueble.t));
    correr(C, 1, {a:true}); if (!tipos.mueble) mal('la tele no se prendió'); const kTele = Object.keys(C.casaEstado).find(k=>/tele/.test(k)); if (!kTele || !C.casaEstado[kTele].on) mal('la tele no quedó encendida');
    const hamb = C.hamburguesas; junto('nevera'); correr(C, 1, {a:true}); if (C.hamburguesas !== hamb+1 || !tipos.comidaCasa) mal('la nevera no dio hamburguesa');
    correr(C, 2, {}); correr(C, 1, {a:true}); if (C.hamburguesas !== hamb+1 || !tipos.muebleNada) mal('la nevera dio otra hamburguesa enseguida');
    junto('sofa'); correr(C, 1, {a:true}); if (!C.sentado) mal('no se sentó en el sofá'); correr(C, 30, {}); if (!C.sentado) mal('se levantó solo'); correr(C, 5, {jy:1}); if (C.sentado) mal('no se levantó con la palanca');
    junto('piano'); correr(C, 1, {a:true}); if (!tipos.mueble || tipos.mueble < 2) mal('el piano no sonó');
    const hora = C.hora; junto('cama'); correr(C, 1, {a:true}); if (!C.durmiendo) mal('no se durmió en la cama'); correr(C, 200, {jy:1}); if (C.durmiendo) mal('no se despertó'); if (!tipos.despierta) mal('no avisó al despertar'); if (Math.abs(((C.hora - hora) + 1) % 1 - 0.25) > 0.02) mal('dormir no adelantó la hora: '+hora.toFixed(2)+' → '+C.hora.toFixed(2));
    C.J.x = I.px - Math.sin(I.ang)*1.2; C.J.z = I.pz - Math.cos(I.ang)*1.2; correr(C, 2, {}); correr(C, 1, {a:true}); if (C.casa) mal('no salió de la casa');
    /* el trono del castillo hace rey */
    const K = N.INTERIOR_CASTILLO; poner(C, K.ex, K.ez); correr(C, 2, {}); correr(C, 1, {a:true}); if (!C.casa || !C.casa.castillo) mal('no entró al castillo');
    { const m = K.muebles.find(m=>m.t==='trono'); C.J.x = m.x - Math.sin(m.ang)*(m.d/2+0.6); C.J.z = m.z - Math.cos(m.ang)*(m.d/2+0.6); C.J.y = K.y; correr(C, 2, {}); correr(C, 1, {a:true}); if (!C.sentado || !tipos.rey) mal('el trono no lo hizo rey'); }
    C.sentado = null; C.J.x = K.px - Math.sin(K.ang)*1.2; C.J.z = K.pz - Math.cos(K.ang)*1.2; correr(C, 2, {}); correr(C, 1, {a:true}); if (C.casa) mal('no salió del castillo');
    /* los regalos de Santa y las llantas de la gasolinera */
    for (const [nombre, t, ev] of [['santa', 'regalos', 'regalo'], ['gasolinera', 'llantas', 'muebleSalto']]){
      const S = N.INTERIORES.find(I=>I.c[nombre]); poner(C, S.ex, S.ez); correr(C, 2, {}); correr(C, 1, {a:true}); if (!C.casa) mal('no entró a la casa con '+t);
      const m = S.muebles.find(m=>m.t===t); C.J.x = m.x - Math.sin(m.ang)*(m.d/2+0.6); C.J.z = m.z - Math.cos(m.ang)*(m.d/2+0.6); C.J.y = S.y; correr(C, 2, {}); correr(C, 1, {a:true});
      if (!tipos[ev]) mal('usar '+t+' no dio el evento '+ev);
      C.J.x = S.px - Math.sin(S.ang)*1.2; C.J.z = S.pz - Math.cos(S.ang)*1.2; C.J.y = S.y; C.J.suelo = true; C.J.vy = 0; correr(C, 2, {}); correr(C, 1, {a:true}); if (C.casa) mal('no salió de la casa con '+t);
    }
    /* una caja se pisa: encima de ella el suelo es su tapa */
    const caja = C.props.find(p=>p.tipo==='caja'); poner(C, caja.x, caja.z); C.J.y = caja.y + 1.0; correr(C, 20, {}); if (Math.abs(C.J.y - (caja.y + 1.0)) > 0.05) mal('encima de la caja se cae: y='+C.J.y.toFixed(2)+' tapa='+(caja.y+1).toFixed(2));
    /* la escalera: palanca arriba trepa hasta el techo */
    const L = N.ESCALERAS[0]; poner(C, L.x + L.lado*0.6, L.z); correr(C, 2, {}); correr(C, 150, {jy:1}, (P)=>tipos.techo);
    if (!tipos.techo) mal('no subió al techo por la escalera'); if (C.J.y < L.top - 0.5) mal('en el techo está bajo: '+C.J.y.toFixed(1)+' < '+L.top.toFixed(1));
    correr(C, 40, {jx:1}); if (C.J.y < L.top - 0.8) mal('caminando por el techo se cae: '+C.J.y.toFixed(1));
    /* el columpio: A para montarse, palanca para impulsarse, A para saltar */
    const co = N.COLUMPIOS[0]; poner(C, co.x, co.z + 0.5); correr(C, 2, {}); correr(C, 1, {a:true}); if (!C.columpio) mal('no se montó en el columpio');
    let amp = 0; correr(C, 60*6, {jy:1}, (P)=>{ amp = Math.max(amp, Math.abs(P.columpio ? P.columpio.ang : 0)); return false; }); if (amp < 0.9) mal('el columpio no se impulsa: '+amp.toFixed(2));
    correr(C, 1, {a:true}); if (C.columpio) mal('no saltó del columpio'); if (!tipos.columpioSalta) mal('no avisó el salto del columpio');
    bien('fase 2: casas grandes con tele, nevera, sofá, piano y cama; trono real; cajas y techos que se pisan; columpio');
  }
  /* las frases nuevas: cada personaje las dice a su manera */
  for (const k of Object.keys(N.FRASES_NUEVAS)) for (const pj of N.PERSONAJES_RED) if (!N.fraseDe(pj.id, k)) mal('sin frase '+k+' para '+pj.nombre);
  if (!/^¡Épale!/.test(N.fraseDe('nacho', 'castillo'))) mal('Nacho no dice épale');
  if (!/pichunguito!$/.test(N.fraseDe('tiojuan', 'gorila'))) mal('Tío Juan no dice pichunguito: '+N.fraseDe('tiojuan', 'gorila'));
  if (N.fraseDe('santi', 'meteorito').length >= N.fraseDe('fernando', 'meteorito').length) mal('Santi no habla cortico');
  bien('frases nuevas: '+Object.keys(N.FRASES_NUEVAS).length+' situaciones con la manera de hablar de cada quien');
}
/* 13b) Maracaibo de día: el calor maracucho y el carrito por puesto */
{
  const M = N.MARACAIBO; P.veh = null; poner(P, M.x, M.z - 6); P.hora = 0.5; P.calor = 0;
  const f = correr(P, 60*70, {}, (P)=>P.calor >= 0.999);
  if (P.calor < 0.999) mal('al sol de Maracaibo no sube el calor ('+P.calor.toFixed(2)+')'); else bien('al sol del mediodía en la plaza el calor llegó al máximo en', (f/60).toFixed(0), 's');
  if (!tipos.sudor || !tipos.calorMaximo) mal('faltan el sudor o el aviso del calor');
  correr(P, 60*2, {jy:1, camYaw: 0}); const lento = P.J.mov;
  P.calor = 0; correr(P, 60*2, {jy:1, camYaw: 0}); const normal = P.J.mov;
  if (!(lento < normal*0.8)) mal('con calor debería caminar más lento ('+lento.toFixed(1)+' vs '+normal.toFixed(1)+')'); else bien('con calor camina a', lento.toFixed(1), 'm/s y fresco a', normal.toFixed(1));
  P.calor = 1; const g0 = P.calor; poner(P, N.GUAJIRO.x - 6, N.GUAJIRO.z); correr(P, 60*6, (P)=>({jy:1, camYaw: Math.atan2(N.GUAJIRO.x-P.J.x, N.GUAJIRO.z-P.J.z)}), (P)=>P.calor < 0.05);
  if (P.calor >= 0.05) mal('el cepillado no quitó el calor ('+P.calor.toFixed(2)+')'); else { correr(P, 60*10, {}); if (P.calor > 0.05) mal('recién tomado el cepillado, el calor no debería volver enseguida ('+P.calor.toFixed(2)+')'); else bien('el cepillado del guajiro quitó el calor de golpe y por un rato'); }
  P.calor = 1; P.J.nadando = false; poner(P, M.x, M.z + M.r + 30); P.J.y = -0.3; correr(P, 60*4, {});
  if (P.calor > 0.2) mal('el lago no refresca ('+P.calor.toFixed(2)+')'); else bien('metido en el lago el calor baja a', P.calor.toFixed(2));
  P.hora = 0.9; P.calor = 1; poner(P, M.x, M.z - 6); correr(P, 60*16, {}); if (P.calor > 0.1) mal('de noche no baja el calor ('+P.calor.toFixed(2)+')'); else bien('de noche el calor se va solo'); P.hora = 0.4;
  const v = montar(P, 'porpuesto'); const x0 = v.x, z0 = v.z;
  correr(P, 60*5, {jy:1, b:true}); const d = Math.hypot(v.x-x0, v.z-z0);
  if (d < 25) mal('el carrito por puesto no anda ('+d.toFixed(0)+' m)'); else bien('el carrito por puesto recorrió', d.toFixed(0), 'm en 5 s con turbo');
  correr(P, 60*3, {}); correr(P, 1, {salir:true}); if (P.veh) mal('no se bajó del carrito por puesto');
}
/* 14) los eventos que la vista necesita salieron todos */
for (const t of ['hamburguesa','pedo','ganas','banoEntra','banoPuerta','plop','descarga','banoSale','estrella','montar','bajar','noBajar','despegue','aterriza','estelaAire','estela','polvo','burbujas','choque','saludo','perro','popito','bandera','helipuerto','boya','huevo','rugido','fuego','lunaLlega','banderaLuna','lunaLista','arepa','maracaibo','aro','rampa','cofre','final','hablar','salto','chapoteo','casaEntra','casaSale','gorila','banana','meteoros','meteoroCae','vereda','dinosVistos','gordura','flaco','paracaidas','paracaidasSuelo','avionVuelve','zonaEntra','zonaSale','planetaLlega','roca','cristal','saturniano','saludoNPC','canta','cantoFin','conciertoCerca','ovacion','patada','gol','disparo','explosion','surfea','mueble','muebleNada','sentado','levanta','rey','dormir','despierta','comidaCasa','regalo','muebleSalto','columpio','columpioSalta','columpioAlto','techo','turboPie'])
  if (!tipos[t]) mal('nunca salió el evento '+t);
console.log(fallos ? '\n'+fallos+' FALLO(S)' : '\n✓ La Gran Aventura sin fallos');
process.exit(fallos ? 1 : 0);
