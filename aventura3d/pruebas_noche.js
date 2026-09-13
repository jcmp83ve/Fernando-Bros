/* ============================================================
   PRUEBAS DEL MAPA 2: MARACAIBO DE NOCHE
   Se corre con:   node pruebas_noche.js
   Carga el núcleo con MAPA=2 y hace jugar solo al personaje por las
   misiones nuevas: el bar de Rómulo, Coro y sus chivos, el relámpago del
   Catatumbo desde la moto de agua, los aros de la noche con el
   pterodáctilo, Marte y la nave extraterrestre.
   ============================================================ */
process.env.MAPA = '2';
const path = require('path');
const N = require(path.join(__dirname, 'aventura3d.js'));
let fallos = 0;
const mal = m => { console.log('✗', m); fallos++; };
const bien = (...m) => console.log('✓', ...m);
const env = a=>{ while (a>Math.PI) a-=2*Math.PI; while (a<-Math.PI) a+=2*Math.PI; return a; };
const tipos = {};
function paso(P, ent){ N.pasoPartida(P, ent); for (const e of P.eventos) tipos[e.tipo] = (tipos[e.tipo]||0)+1; const lista = P.eventos.slice(); P.eventos.length = 0; return lista; }
function correr(P, frames, ent, hasta){
  for (let f=0; f<frames; f++){
    const evs = paso(P, typeof ent==='function' ? ent(P, f) : ent);
    if (![P.J.x,P.J.y,P.J.z,P.J.ang].every(Number.isFinite)){ mal('el personaje con números rotos'); return f; }
    for (const v of P.vehiculos) if (![v.x,v.y,v.z,v.ang,v.vel,v.vy].every(Number.isFinite)){ mal(v.nombre+' con números rotos'); return f; }
    if (hasta && hasta(P, evs)) return f;
  }
  return frames;
}
function poner(P, x, z){ P.J.x = x; P.J.z = z; P.J.y = N.altura(x,z); P.J.vx = P.J.vz = P.J.vy = 0; P.J.suelo = true; P.J.nadando = false; }
function montar(P, id){ const v = P.vehiculos.find(v=>v.id===id); poner(P, v.x + 3, v.z); P.J.y = v.y; correr(P, 2, {}); correr(P, 1, {a:true}); if (P.veh !== v) mal('no se pudo montar en '+v.nombre); return v; }
const hacia = (v, x, z)=>{ const d = env(Math.atan2(x-v.x, z-v.z) - v.ang); return -Math.max(-1, Math.min(1, d*2.5)); };

if (N.MAPA !== 2) mal('el núcleo no cargó el mapa 2');
if (N.MISIONES.length !== 14) mal('el mapa 2 debería tener 14 misiones, tiene '+N.MISIONES.length);
if (!N.VEHICULOS_DEF.some(v=>v.id==='ptero')) mal('falta el pterodáctilo');
if (N.CHIVOS.length !== 8) mal('deberían ser 8 chivos');
for (const c of N.CHIVOS) if (N.alturaBase(c.x, c.z) < 1) mal('un chivo nació en el agua');
bien('mapa 2:', N.MISIONES.length, 'misiones ·', N.VEHICULOS_DEF.length, 'vehículos · Coro con', N.CHIVOS.length, 'chivos');


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

const P = N.crearPartida(); P.pj = 'luca';
const dichos = []; const oir = (P, evs)=>{ for (const e of evs) if (e.tipo==='hablar') dichos.push(e); return false; };

/* 1) Rómulo en su bar: la Polarcita y el eructo */
{
  const r = N.FAMILIA.find(f=>f.id==='romulo');
  poner(P, r.x, r.z + 8); P.J.ang = Math.PI;
  correr(P, 60*3, {jy:1, camYaw: Math.PI}, (P, evs)=>{ oir(P, evs); return P.estrellas.includes('polarcita'); });
  if (!P.estrellas.includes('polarcita')) mal('no dio la estrella del bar de Rómulo');
  else if (!dichos.some(d=>d.texto==='¡Qué rica Polarcita!' && d.pj==='romulo') || !tipos.eructo) mal('Rómulo no dijo lo de la Polarcita con su eructo');
  else bien('Rómulo en el bar:', dichos.find(d=>d.pj==='romulo').texto, '+ eructo');
}
/* 2) Coro: la frase al llegar y los ocho chivos */
{
  poner(P, N.CORO.x - N.CORO.r - 12, N.CORO.z); P.J.ang = Math.PI/2;
  dichos.length = 0;
  correr(P, 60*4, {jy:1, camYaw: Math.PI/2}, (P, evs)=>{ oir(P, evs); return P.prog.coroDicho; });
  if (!P.prog.coroDicho || !dichos.some(d=>d.k==='coro')) mal('no dijo lo de los chivos al llegar a Coro'); else bien('en Coro dijo:', dichos.find(d=>d.k==='coro').texto);
  const f = correr(P, 60*120, (P)=>{ const c = P.chivos.find(c=>!P.prog.chivos.includes(c.id)); if (!c) return {}; return {jy: 1, camYaw: Math.atan2(c.x-P.J.x, c.z-P.J.z), b:true}; }, (P)=>P.estrellas.includes('coro'));
  if (!P.estrellas.includes('coro')) mal('no saludó a los 8 chivos ('+P.prog.chivos.length+')'); else bien('Coro: los 8 chivos en', (f/60).toFixed(0), 's');
}
/* 3) el Catatumbo desde la moto de agua, cerca de Maracaibo */
{
  const v = montar(P, 'motoagua');
  v.x = N.MARACAIBO.x; v.z = N.MARACAIBO.z + N.MARACAIBO.r + 40; v.ang = Math.PI/2;
  dichos.length = 0;
  const f = correr(P, 60*60, (P)=>({jy:0.6, jx: hacia(v, N.MARACAIBO.x + Math.cos(P.t*0.01)*(N.MARACAIBO.r+45), N.MARACAIBO.z + Math.sin(P.t*0.01)*(N.MARACAIBO.r+45))}), (P, evs)=>{ oir(P, evs); return P.estrellas.includes('catatumbo'); });
  if (!P.estrellas.includes('catatumbo')) mal('no vio los 5 relámpagos ('+P.prog.rayos+')'); else bien('Catatumbo: 5 relámpagos en', (f/60).toFixed(0), 's');
  if (!tipos.rayo) mal('nunca cayó un rayo');
  if (!dichos.some(d=>d.k==='catatumbo')) mal('no dijo lo del relámpago'); else bien('con el relámpago dijo:', dichos.find(d=>d.k==='catatumbo').texto);
  correr(P, 1, {salir:true}); correr(P, 60, {});
}
/* 4) el pterodáctilo por los seis aros de la noche */
{
  const v = montar(P, 'ptero');
  const f = correr(P, 60*180, (P)=>{ const i = N.AROS_NOCHE.findIndex((a,i)=>!P.prog.arosNoche.includes(i)); if (i<0) return {}; const a = N.AROS_NOCHE[i]; return {a: v.y < a.y - 1, b: v.y > a.y + 1, jy: 1, jx: hacia(v, a.x, a.z)}; }, (P)=>P.estrellas.includes('ptero'));
  if (!P.estrellas.includes('ptero')) mal('el pterodáctilo no pasó los 6 aros ('+P.prog.arosNoche.length+')'); else bien('pterodáctilo: los 6 aros de la noche en', (f/60).toFixed(0), 's');
  correr(P, 60*30, {b:true}, (P)=>v.suelo); correr(P, 1, {salir:true}); if (P.veh) mal('no se bajó del pterodáctilo');
}
/* 5) la nave hasta Marte, y después la nave extraterrestre */
{
  const v = montar(P, 'nave');
  dichos.length = 0;
  const f = correr(P, 60*120, (P)=>({a:true, jy: v.y > 80 ? Math.min(1, Math.hypot(v.x-N.LUNA.x, v.z-N.LUNA.z)/30) : 0, jx: hacia(v, N.LUNA.x, N.LUNA.z)}), (P, evs)=>{ oir(P, evs); return P.estrellas.includes('luna'); });
  if (!P.estrellas.includes('luna')) mal('la nave no llegó a Marte (y '+v.y.toFixed(0)+')'); else bien('nave: llegó a Marte en', (f/60).toFixed(0), 's');
  if (!dichos.some(d=>d.k==='marte')) mal('no dijo lo de Marte'); else bien('en Marte dijo:', dichos.find(d=>d.k==='marte').texto);
  dichos.length = 0;
  /* en Marte se pasea, se recogen las rocas y se sigue a Saturno y Júpiter; después, de vuelta, el ovni */
  paseoEspacial(P, v, 'Marte');
  montar(P, 'nave');
  const g = correr(P, 60*150, (P)=>({a: v.y < N.OVNI.y - 5, jy: Math.min(1, Math.hypot(v.x-N.OVNI.x, v.z-N.OVNI.z)/30), jx: hacia(v, N.OVNI.x, N.OVNI.z)}), (P, evs)=>{ oir(P, evs); return P.estrellas.includes('ovni'); });
  if (!P.estrellas.includes('ovni')) mal('no encontró la nave extraterrestre (y '+v.y.toFixed(0)+', a '+Math.hypot(v.x-N.OVNI.x, v.y-N.OVNI.y, v.z-N.OVNI.z).toFixed(0)+' m)'); else bien('nave: encontró a los extraterrestres en', (g/60).toFixed(0), 's');
  if (!tipos.ovniLuz || !tipos.extraterrestres) mal('faltan los eventos del ovni');
  if (!dichos.some(d=>d.k==='extraterrestres')) mal('no saludó a los extraterrestres'); else bien('a los extraterrestres les dijo:', dichos.find(d=>d.k==='extraterrestres').texto);
  const fb = correr(P, 60*150, {}, (P)=>v.suelo);
  if (!v.suelo) mal('la nave no volvió a posarse'); else bien('nave: volvió a tierra en', (fb/60).toFixed(0), 's');
  correr(P, 1, {salir:true});
}
/* 5b) Maracaibo grande: el guajiro con cepillados, la comida maracucha, los gaiteros, los lugares de verdad, el estadio y el aeropuerto */
{
  const M = N.MARACAIBO, cerca = (x, z, r)=>Math.hypot(P.J.x-x, P.J.z-z) < r;
  if (M.r < 225) mal('Maracaibo debería ser un 30% más grande (r '+M.r+')');
  if (N.RUTA_MCBO.M.some(m=>m.h < 1.2)) mal('la carretera de la orilla se mete en el agua');
  if (N.altura(N.ESTADIO.x, N.ESTADIO.z) < 1 || N.altura(N.LA_CHINITA.terminal.x, N.LA_CHINITA.terminal.z) < 1 || N.altura(N.BASILICA.x, N.BASILICA.z) < 1 || N.altura(N.TORRE_RELOJ.x, N.TORRE_RELOJ.z) < 1) mal('el estadio, la terminal, la basílica o la torre nacen en el agua');
  for (const e of N.EMPANADAS) if (N.altura(e.x, e.z) < 1) mal('una comida nació en el agua');
  if (!N.EMPANADAS.some(e=>e.tipo==='patacon') || !N.EMPANADAS.some(e=>e.tipo==='tequeno') || !N.EMPANADAS.some(e=>e.tipo==='mandoca')) mal('faltan patacones, tequeños o mandocas');
  if (N.CASAS_MCBO.filter(c=>c.carabobo).length !== 6) mal('la calle Carabobo debería tener 6 casas');
  for (const p of N.PALAFITOS){ if (N.alturaBase(p.x, p.z) > -1) mal('un palafito está en tierra'); if (N.altura(p.x, p.z) !== N.PALAFITOS.alto) mal('la tarima del palafito no se camina'); }
  bien('Maracaibo: r', M.r, '· carretera de', N.RUTA_MCBO.N, 'tramos ·', N.CASAS_MCBO.length, 'casas ·', N.EMPANADAS.length, 'comidas ·', N.PALAFITOS.length, 'palafitos');
  /* el guajiro: saludarlo da un cepillado */
  poner(P, N.GUAJIRO.x - 6, N.GUAJIRO.z); P.J.ang = 0; dichos.length = 0; P.veh = null;
  let ceps = [];
  correr(P, 60*6, (P)=>({jy: 1, camYaw: Math.atan2(N.GUAJIRO.x-P.J.x, N.GUAJIRO.z-P.J.z)}), (P, evs)=>{ oir(P, evs); for (const e of evs) if (e.tipo==='cepillado') ceps.push(e); return ceps.length > 0; });
  if (!ceps.length) mal('el guajiro no vendió el cepillado'); else bien('cepillado de', ceps[0].sabor, ceps[0].favorito ? '(¡el favorito!)' : '', '· dijo:', (dichos.find(d=>d.k==='cepillado'||d.k==='cepilladoColita')||{}).texto);
  { let favorito = ceps[0].favorito, n = 0; while (!favorito && n < 12){ n++; poner(P, N.GUAJIRO.x - 6, N.GUAJIRO.z); correr(P, 60*2, {}); correr(P, 60*6, (P)=>({jy: 1, camYaw: Math.atan2(N.GUAJIRO.x-P.J.x, N.GUAJIRO.z-P.J.z)}), (P, evs)=>{ for (const e of evs) if (e.tipo==='cepillado'){ favorito = favorito || e.favorito; return true; } return false; }); }
    if (!favorito) mal('nunca tocó el cepillado de colita'); else bien('el de colita salió en', n+1, 'visitas; cepillados:', P.cepillados); }
  /* la comida maracucha: se come al pasar */
  dichos.length = 0; const comidas = [];
  for (const e of N.EMPANADAS.slice(0, 4)){ poner(P, e.x - 4, e.z); correr(P, 60*3, (P)=>({jy: 1, camYaw: Math.atan2(e.x-P.J.x, e.z-P.J.z)}), (P, evs)=>{ oir(P, evs); for (const v of evs) if (v.tipo==='empanada') comidas.push(v); return comidas.length && comidas[comidas.length-1].id===e.id; }); correr(P, 70, {}, (P, evs)=>{ oir(P, evs); return false; }); }
  correr(P, 60*6, {}, (P, evs)=>{ oir(P, evs); return false; });   /* se espera el remate del diálogo */
  if (!dichos.some(d=>d.k && /^mcbo/.test(d.k))) mal('al comer en Maracaibo no habló en maracucho'); else if (!dichos.some(d=>d.pj && d.pj.startsWith('npc_') && /vos|mi hermano|pichunguito|os /.test(d.texto))) mal('nadie de la ciudad contestó en voseo'); else bien('diálogo maracucho al comer:', dichos.filter(d=>(d.k && /^mcbo/.test(d.k)) || (d.pj||'').startsWith('npc_')).slice(0, 3).map(d=>d.quien+': '+d.texto).join(' / '));
  if (comidas.length !== 4) mal('no comió las 4 comidas ('+comidas.length+')'); else bien('comió:', comidas.map(c=>c.comida).join(', '), '· dijo:', dichos.filter(d=>['empanada','patacon','tequeno','mandoca'].includes(d.k)).map(d=>d.texto).join(' / '));
  for (const [t, k] of [['patacon','mcboPatacon1'],['mandoca','mcboMandoca1']]) if (!dichos.some(d=>d.k===t || d.k===k)) mal('no dijo nada del '+t);
  /* los gaiteros */
  dichos.length = 0; let gaita = null;
  const g0 = N.GAITEROS[1]; poner(P, g0.x, g0.z - 7);
  correr(P, 60*6, (P)=>({jy: 1, camYaw: Math.atan2(g0.x-P.J.x, g0.z-P.J.z)}), (P, evs)=>{ oir(P, evs); for (const e of evs) if (e.tipo==='gaita') gaita = e; return !!gaita; });
  if (!gaita) mal('no sonó la gaita al saludar a los gaiteros'); else bien('gaita zuliana con', gaita.total, 'saludo(s) · dijo:', (dichos.find(d=>d.k==='gaita')||{}).texto);
  /* los lugares de verdad: al llegar se comentan */
  const vistos = {};
  for (const L of N.LUGARES_MCBO){ dichos.length = 0; poner(P, L.x + (L.id==='basilica' ? 22 : L.id==='palafitos' ? 0 : 6), L.z + (L.id==='carabobo' ? 0 : 4)); if (L.id==='palafitos') P.J.y = N.PALAFITOS.alto;
    correr(P, 60*3, {}, (P, evs)=>{ oir(P, evs); for (const e of evs) if (e.tipo==='lugarMcbo') vistos[e.id] = e.titulo; return !!vistos[L.id]; });
    if (!vistos[L.id]) mal('no comentó '+L.id); else if (!dichos.some(d=>d.k===L.frase)) mal('no dijo la frase de '+L.id); else bien(vistos[L.id], '→', dichos.find(d=>d.k===L.frase).texto); }
  /* se camina por la pasarela de los palafitos sin caer al agua */
  { const PA = N.PALAFITOS, a0 = PA.aEntrada, x0 = M.x + Math.cos(a0)*(PA.rEntrada - 4), z0 = M.z + Math.sin(a0)*(PA.rEntrada - 4); poner(P, x0, z0);
    const fin = PA[4]; let nado = false; const metas = [[M.x + Math.cos(a0)*PA.rPasarela, M.z + Math.sin(a0)*PA.rPasarela], [PA[2].x, PA[2].z], [PA[3].x, PA[3].z], [fin.x, fin.z]]; let k = 0;
    correr(P, 60*30, (P)=>{ const [tx, tz] = metas[k]; if (Math.hypot(P.J.x-tx, P.J.z-tz) < 1.5 && k < metas.length-1) k++; return {jy: 1, camYaw: Math.atan2(metas[k][0]-P.J.x, metas[k][1]-P.J.z)}; }, (P)=>{ if (P.J.nadando) nado = true; return nado || Math.hypot(P.J.x-fin.x, P.J.z-fin.z) < 2.5; });
    if (nado) mal('se cayó al agua yendo por la pasarela de los palafitos'); else if (Math.hypot(P.J.x-fin.x, P.J.z-fin.z) >= 2.5) mal('no llegó al último palafito'); else bien('caminó por la pasarela hasta el último palafito (y', P.J.y.toFixed(1)+')'); }
  /* el estadio: la frase al llegar y batear desde el home hasta un jonrón */
  dichos.length = 0; poner(P, N.ESTADIO.x + N.ESTADIO.r + 30, N.ESTADIO.z);
  correr(P, 60*8, (P)=>({jy: 1, camYaw: Math.atan2(N.ESTADIO.x-P.J.x, N.ESTADIO.z-P.J.z)}), (P, evs)=>{ oir(P, evs); return evs.some(e=>e.tipo==='estadioCerca'); });
  if (!dichos.some(d=>d.k==='estadio')) mal('no comentó el estadio'); else bien('en el estadio dijo:', dichos.find(d=>d.k==='estadio').texto);
  /* el juego de béisbol: parado en el home el pícher lanza; abanicar a destiempo es strike, a tiempo es hit y se corre a primera */
  { const H = N.BEISBOL.home; poner(P, H.x, H.z); dichos.length = 0;
    let lanz = false; correr(P, 60*4, {}, (P, evs)=>{ oir(P, evs); for (const e of evs) if (e.tipo==='lanzamiento') lanz = true; return lanz; });
    if (!lanz) mal('el pícher no lanzó'); else bien('el pícher lanzó · dijo:', (dichos.find(d=>d.k==='alBate')||{}).texto);
    let strike = null; correr(P, 3, {}); correr(P, 1, {a:true}, (P, evs)=>{ for (const e of evs) if (e.tipo==='strike') strike = e; return false; });
    if (!strike || strike.porque!=='abanico') mal('abanicar antes de tiempo debía ser strike'); else bien('abanicó antes de tiempo: strike', strike.strikes);
    lanz = false; correr(P, 60*6, {}, (P, evs)=>{ for (const e of evs) if (e.tipo==='lanzamiento') lanz = true; return lanz; });
    correr(P, N.BEIS_VENTANA[0] + 6, {}); let hit = null; correr(P, 1, {a:true, b:true}, (P, evs)=>{ for (const e of evs) if (e.tipo==='hit') hit = e; return false; });
    if (!hit) mal('batear a tiempo no fue hit (estado '+P.beis.estado+')'); else bien('bateó a tiempo: ¡hit!');
    const b1 = N.BEISBOL.bases[0]; let fin = null, base1 = false; const res = [];
    correr(P, 60*30, (P)=>({jy: Math.hypot(P.J.x-b1.x, P.J.z-b1.z) > 0.8 ? 1 : 0, b:true, camYaw: Math.atan2(b1.x-P.J.x, b1.z-P.J.z)}), (P, evs)=>{ for (const e of evs){ if (e.tipo==='base') base1 = true; if (['safe','out','carrera','jonron'].includes(e.tipo)) res.push(e.tipo); if (e.tipo==='jugadaFin') fin = e; } return !!fin; });
    if (!base1) mal('no llegó a primera base'); if (!fin) mal('la jugada no terminó'); else bien('jugada:', res.join('+') || fin.porque, '· marcador Águilas', P.beis.carreras, 'visitante', P.beis.visitante, '· outs', P.beis.outs, '· corredores', P.beis.corredores.map(c=>c?'●':'○').join(''));
    if (!tipos.jonron){ poner(P, H.x, H.z); correr(P, 60*3, {}, (P, evs)=>evs.some(e=>e.tipo==='lanzamiento')); correr(P, N.BEIS_VENTANA[0] + 6, {}); correr(P, 1, {a:true, b:true}); const B = P.pelota; if (B.estado==='aire'){ B.vy = 30; B.vx *= 2; B.vz *= 2; } let jon = false; correr(P, 60*10, {}, (P, evs)=>{ for (const e of evs) if (e.tipo==='jonron') jon = true; return jon; }); if (!jon) mal('no salió el jonrón forzado'); else bien('jonrón: carreras', P.beis.carreras); }
    correr(P, 60*2, {}); poner(P, H.x + 30, H.z); correr(P, 60*3, {}); if (P.beis.estado!=='libre') mal('lejos del home el juego no vuelve a libre ('+P.beis.estado+')'); }
  /* las gradas se suben caminando: desde el jardín hacia afuera, escalón por escalón, hasta arriba */
  { const E = N.ESTADIO, a = E.entrada + Math.PI, y0 = N.altura(E.x, E.z); poner(P, E.x + Math.cos(a)*(N.GRADAS.r0 - 3), E.z + Math.sin(a)*(N.GRADAS.r0 - 3));
    let maxY = 0; correr(P, 60*8, (P)=>({jy: 1, camYaw: Math.atan2(Math.cos(a), Math.sin(a))}), (P)=>{ maxY = Math.max(maxY, P.J.y - y0); return P.J.y - y0 > 4.5; });
    if (P.J.y - y0 < 4.5) mal('no subió a lo alto de las gradas (llegó a '+maxY.toFixed(1)+' m)'); else bien('subió las gradas caminando hasta', (P.J.y - y0).toFixed(1), 'm sobre el jardín');
    const d = Math.hypot(P.J.x-E.x, P.J.z-E.z); if (d > N.GRADAS.r0 + N.GRADAS.paso*N.GRADAS.niveles + 0.5) mal('se salió de las gradas por atrás'); }
  /* la señora de las cocadas */
  { const c = N.COCADERA; poner(P, c.x - 6, c.z); dichos.length = 0; let coc = null;
    correr(P, 60*6, (P)=>({jy: 1, camYaw: Math.atan2(c.x-P.J.x, c.z-P.J.z)}), (P, evs)=>{ oir(P, evs); for (const e of evs) if (e.tipo==='cocada') coc = e; return !!coc; });
    if (!coc) mal('la señora no vendió la cocada'); else bien('cocada vendida · dijo:', (dichos.find(d=>d.k==='cocada'||d.k==='cocadaFresca')||{}).texto, '· la señora:', (dichos.find(d=>d.pj==='npc_cocadera')||{}).texto); }
  /* los carritos por puesto dan vueltas por la carretera y frenan si uno se les para delante */
  { poner(P, N.MARACAIBO.x, N.MARACAIBO.z); const s0 = P.carritos.map(c=>c.s); correr(P, 60*6, {}); const s1 = P.carritos.map(c=>c.s);
    if (!s1.every((s, i)=>s - s0[i] > 30)) mal('los carritos por puesto no circulan ('+s1.map((s,i)=>(s-s0[i]).toFixed(0)).join(',')+' m)'); else bien('los carritos por puesto recorrieron', s1.map((s,i)=>(s-s0[i]).toFixed(0)).join(' y '), 'm en 6 s');
    for (const c of P.carritos) if (N.cercaRutaMcbo(c.x, c.z).d > 4) mal('un carrito se salió de la carretera');
    const c = P.carritos[0]; const p = N.puntoRutaMcbo(c.s + 6); poner(P, p.x, p.z); let boc = false; correr(P, 60*5, {}, (P, evs)=>{ for (const e of evs) if (e.tipo==='bocina') boc = true; return boc && c.vel < 0.5; });
    if (!boc) mal('el carrito no tocó la bocina con el personaje delante'); else if (c.vel > 0.5) mal('el carrito no frenó (vel '+c.vel.toFixed(1)+')'); else bien('el carrito frenó y tocó la bocina; se aparta uno y sigue'); }
  /* la feria: la rueda de la fortuna sube y da la vuelta; el carrusel */
  { const R = N.FERIA.rueda; poner(P, R.x, R.z + 3.2); correr(P, 5, {}); correr(P, 1, {a:true});
    if (!P.paseo || P.paseo.tipo!=='rueda') mal('no se subió a la rueda de la fortuna'); else { let maxY = 0; const y0 = N.altura(R.x, R.z); const f = correr(P, R.vuelta + 120, {}, (P)=>{ maxY = Math.max(maxY, P.J.y - y0); return !P.paseo; });
      if (P.paseo) mal('la rueda no lo bajó al terminar la vuelta'); else if (maxY < R.eje + R.R - 3) mal('la rueda no subió ('+maxY.toFixed(1)+' m)'); else bien('rueda de la fortuna: subió hasta', maxY.toFixed(1), 'm y bajó solo en', (f/60).toFixed(0), 's'); }
    const C = N.FERIA.carrusel; poner(P, C.x + C.R + 1.2, C.z); correr(P, 5, {}); correr(P, 1, {a:true});
    if (!P.paseo || P.paseo.tipo!=='carrusel') mal('no se montó en el carrusel'); else { const x0 = P.J.x, z0 = P.J.z; correr(P, 60*3, {}); const d = Math.hypot(P.J.x-x0, P.J.z-z0); correr(P, 1, {a:true}); if (P.paseo) mal('no se bajó del carrusel con A'); else if (d < 2) mal('el carrusel no gira'); else bien('carrusel: dio vueltas ('+d.toFixed(1)+' m en 3 s) y se bajó con A'); } }
  /* el tranvía: se espera en la parada de la plaza, se sube, viaja y se baja */
  { const pd = N.TRANVIA.paradas[0], q = N.puntoRutaMcbo(pd.s); poner(P, q.x, q.z); let paro = false;
    correr(P, 60*300, {}, (P, evs)=>{ for (const e of evs) if (e.tipo==='tranviaPara' && e.nombre===pd.nombre) paro = true; return paro; });
    if (!paro) mal('el tranvía nunca paró en la plaza'); else { poner(P, P.tranvia.x, P.tranvia.z + 2); correr(P, 3, {}); correr(P, 1, {a:true});
      if (!P.paseo || P.paseo.tipo!=='tranvia') mal('no se subió al tranvía'); else { const x0 = P.J.x, z0 = P.J.z; correr(P, 60*25, {}); const d = Math.hypot(P.J.x-x0, P.J.z-z0); correr(P, 1, {a:true});
        if (P.paseo) mal('no se bajó del tranvía'); else if (d < 40) mal('el tranvía no lo llevó ('+d.toFixed(0)+' m)'); else if (N.altura(P.J.x, P.J.z) < 1) mal('se bajó del tranvía en el agua'); else bien('tranvía: paró en la plaza, lo llevó', d.toFixed(0), 'm y se bajó en la acera'); } } }
  /* la lancha: se espera en la parada de la vereda, se sube, navega hasta los palafitos y se baja en la tarima */
  { const pd = N.LANCHA.paradas[0]; poner(P, pd.bajaX, pd.bajaZ); let paro = false;
    correr(P, 60*400, {}, (P, evs)=>{ for (const e of evs) if (e.tipo==='lanchaPara' && e.nombre===pd.nombre) paro = true; return paro; });
    if (!paro) mal('la lancha nunca paró en la vereda'); else { poner(P, pd.bajaX, pd.bajaZ); correr(P, 60*8, (P)=>({jy:1, camYaw: Math.atan2(P.lancha.x-P.J.x, P.lancha.z-P.J.z)}), (P)=>Math.hypot(P.J.x-P.lancha.x, P.J.z-P.lancha.z) < 6); if (P.J.nadando) mal('se cayó al agua caminando por el muelle de la lancha'); correr(P, 2, {}); correr(P, 1, {a:true});
      if (!P.paseo || P.paseo.tipo!=='lancha') mal('no se subió a la lancha (d '+Math.hypot(P.J.x-P.lancha.x, P.J.z-P.lancha.z).toFixed(1)+')'); else { let llego = false; correr(P, 60*200, {}, (P, evs)=>{ for (const e of evs) if (e.tipo==='lanchaPara' && e.nombre==='los palafitos') llego = true; return llego; });
        if (!llego) mal('la lancha no llegó a los palafitos con el personaje a bordo'); else { correr(P, 1, {a:true}); if (P.paseo) mal('no se bajó de la lancha'); else if (!N.enPalafitos(P.J.x, P.J.z)) mal('se bajó de la lancha fuera de la tarima'); else bien('lancha: paró en la vereda, lo llevó a los palafitos y se bajó en la tarima (y', P.J.y.toFixed(1)+')'); } } } }
  /* los vecinos caminan y hablan al pasar */
  { const x0 = P.vecinos.map(v=>[v.x, v.z]); const q = N.puntoAvenida(N.AVENIDAS[0], 0.3, 0); poner(P, q.x, q.z); dichos.length = 0;
    correr(P, 60*60, {}, (P, evs)=>{ oir(P, evs); return false; });
    const movidos = P.vecinos.filter((v, i)=>Math.hypot(v.x-x0[i][0], v.z-x0[i][1]) > 3).length;
    if (movidos < 8) mal('los vecinos no caminan ('+movidos+'/14)'); else bien(movidos, 'de 14 vecinos caminaron por las avenidas');
    if (P.vecinos.some(v=>N.altura(v.x, v.z) < 1.5)) mal('un vecino se metió al agua');
    if (!dichos.some(d=>d.pj==='npc_vecino')) mal('ningún vecino habló al pasar'); else bien('un vecino dijo al pasar:', dichos.find(d=>d.pj==='npc_vecino').texto); }
  /* la pesca en el palafito: espera, pica y saca un pez */
  { const p = N.PESCA[0]; poner(P, p.x, p.z); P.J.y = N.PALAFITOS.alto; correr(P, 3, {}); correr(P, 1, {a:true});
    if (!P.paseo || P.paseo.tipo!=='pesca') mal('no empezó a pescar'); else { let pico = false; correr(P, 60*12, {}, (P, evs)=>{ for (const e of evs) if (e.tipo==='pica') pico = true; return pico; });
      if (!pico) mal('nunca picó'); else { let pez = null; correr(P, 1, {a:true}, (P, evs)=>{ for (const e of evs) if (e.tipo==='pez') pez = e; return false; }); if (!pez) mal('al dar A no sacó el pez'); else bien('pesca: sacó', pez.nombre, 'de', pez.tam, 'cm (+'+pez.monedas+' monedas)'); }
      correr(P, 20, {jy:1}); if (P.paseo) mal('moverse no termina la pesca'); } }
  /* el castillo de San Carlos: por la rampa a la muralla y un cañonazo al lago */
  { const S = N.SANCARLOS, base = N.alturaBase(S.x, S.z); poner(P, S.x - 7.4, S.z - 5); const y0 = P.J.y;
    correr(P, 60*6, (P)=>({jy:1, camYaw: 0}), (P)=>P.J.y - base > S.alto - 0.1);
    if (P.J.y - base < S.alto - 0.1) mal('no subió a la muralla por la rampa (y '+(P.J.y-base).toFixed(1)+')'); else bien('San Carlos: subió por la rampa a la muralla (+'+(P.J.y-base).toFixed(1)+' m)');
    const c = S.canones[0]; poner(P, c.x + 0.5, c.z + 0.8); correr(P, 3, {}); let tiro = null; correr(P, 1, {a:true}, (P, evs)=>{ for (const e of evs) if (e.tipo==='canonazo') tiro = e; return false; });
    if (!tiro) mal('el cañón no disparó'); else { let expl = null; correr(P, 60*6, {}, (P, evs)=>{ for (const e of evs) if (e.tipo==='explosion') expl = e; return !!expl; }); if (!expl || !expl.agua) mal('la bala del cañón no cayó al lago'); else bien('cañonazo: la bala cayó al lago a', Math.hypot(expl.x-c.x, expl.z-c.z).toFixed(0), 'm'); } }
  /* el mercado y el zoológico: saludos */
  { const v = P.vendedores[0], pu = N.PULGAS_PUESTOS[1], lado = v.z > pu.z ? -1 : 1; poner(P, v.x, pu.z + lado*4); dichos.length = 0;   /* del lado de los clientes, con el puesto en medio */ correr(P, 60*5, (P)=>({jy:1, camYaw: Math.atan2(v.x-P.J.x, v.z-P.J.z)}), (P, evs)=>{ oir(P, evs); return dichos.some(d=>d.pj==='npc_vendedor'); });
    if (!dichos.some(d=>d.pj==='npc_vendedor')) mal('el vendedor del mercado no saludó'); else bien('en Las Pulgas:', dichos.find(d=>d.pj==='npc_vendedor').texto);
    const cu = P.cuidador; poner(P, cu.x, cu.z + 3); dichos.length = 0; correr(P, 60*5, (P)=>({jy:1, camYaw: Math.atan2(cu.x-P.J.x, cu.z-P.J.z)}), (P, evs)=>{ oir(P, evs); return dichos.some(d=>d.pj==='npc_cuidador'); });
    if (!dichos.some(d=>d.pj==='npc_cuidador')) mal('el cuidador del zoo no saludó'); else bien('en el zoo:', dichos.find(d=>d.pj==='npc_cuidador').texto);
    for (const a of P.animales.filter(a=>a.zona==='zoo')){ const c = N.ZOO.corrales[a.corral]; if (Math.hypot(a.x-c.x, a.z-c.z) > c.r) mal(a.nombre+' se salió del corral'); }
    bien('los', P.animales.filter(a=>a.zona==='zoo').length, 'animales del zoo siguen en sus corrales'); }
  /* Agui y los peloteros saludan */
  { const ag = P.agui; poner(P, ag.x + 3, ag.z); dichos.length = 0; correr(P, 60*5, (P)=>({jy:1, camYaw: Math.atan2(ag.x-P.J.x, ag.z-P.J.z)}), (P, evs)=>{ oir(P, evs); return dichos.some(d=>d.pj==='npc_agui'); });
    if (!dichos.some(d=>d.pj==='npc_agui')) mal('Agui no saludó'); else bien('Agui dijo:', dichos.find(d=>d.pj==='npc_agui').texto); }
  /* el aeropuerto: la frase al llegar y los aviones que despegan y aterrizan */
  dichos.length = 0; poner(P, N.LA_CHINITA.terminal.x, N.LA_CHINITA.terminal.z + 16);
  correr(P, 60*8, (P)=>({jy: 1, camYaw: Math.atan2(N.LA_CHINITA.terminal.x-P.J.x, N.LA_CHINITA.z-P.J.z)}), (P, evs)=>{ oir(P, evs); return evs.some(e=>e.tipo==='aeropuertoCerca'); });
  if (!dichos.some(d=>d.k==='aeropuerto')) mal('no comentó el aeropuerto'); else bien('en La Chinita dijo:', dichos.find(d=>d.k==='aeropuerto').texto);
  poner(P, N.LA_CHINITA.terminal.x, N.LA_CHINITA.terminal.z + 16); const fases = new Set(); let maxY = 0;
  const fa = correr(P, 60*200, {}, (P)=>{ for (const a of P.aviones){ fases.add(a.estado); maxY = Math.max(maxY, a.y); } return ['despegue','vuelo','final','rodaje','parado'].every(f=>fases.has(f)); });
  if (!['despegue','vuelo','final','parado'].every(f=>fases.has(f))) mal('los aviones no completan el ciclo ('+[...fases].join(',')+')'); else bien('aviones: despegan, vuelan (hasta', maxY.toFixed(0), 'm), aterrizan y se estacionan en', (fa/60).toFixed(0), 's');
  if (!tipos.avionNPC) mal('no avisó de los aviones');
  const g = N.exportar(P), P2 = N.crearPartida(g);
  if (P2.cepillados !== P.cepillados || P2.empanadas !== P.empanadas || P2.comidasEmpanadas.size !== P.comidasEmpanadas.size) mal('el guardado no conserva cepillados y comidas');
  else bien('se guardan', P2.cepillados, 'cepillados y', P2.empanadas, 'comidas');
}
/* 6) guardar y seguir en el mapa 2 */
{
  const g = N.exportar(P); const P2 = N.crearPartida(g);
  if (P2.estrellas.length !== P.estrellas.length || P2.prog.chivos.length !== 8 || P2.prog.rayos !== P.prog.rayos || !P2.prog.ovni) mal('el guardado del mapa 2 no conserva chivos, rayos o el ovni');
  else bien('la partida de noche se guarda y se recupera con', P2.estrellas.length, 'estrellas');
}
for (const t of ['rayo','catatumboCuenta','coro','chivo','aroNoche','polarcita','ovniLlega','ovniLuz','extraterrestres','ovniLista','lunaLlega','banderaLuna','cepillado','empanada','gaita','lugarMcbo','batazo','jonron','avionNPC','estadioCerca','aeropuertoCerca','cocada','bocina','paseo','paseoFin','tranviaPara','pica','pez','canonazo','lanzamiento','strike','hit','base','jugadaFin','lanchaPara']) if (!tipos[t]) mal('nunca salió el evento '+t);
console.log(fallos ? '\n'+fallos+' FALLO(S)' : '\n✓ Maracaibo de noche sin fallos');
process.exit(fallos ? 1 : 0);
