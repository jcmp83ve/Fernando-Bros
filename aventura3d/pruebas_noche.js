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
  if (M.r < 180) mal('Maracaibo debería ser grande (r '+M.r+')');
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
  for (const e of N.EMPANADAS.slice(0, 4)){ poner(P, e.x - 4, e.z); correr(P, 60*3, (P)=>({jy: 1, camYaw: Math.atan2(e.x-P.J.x, e.z-P.J.z)}), (P, evs)=>{ oir(P, evs); for (const v of evs) if (v.tipo==='empanada') comidas.push(v); return comidas.length && comidas[comidas.length-1].id===e.id; }); correr(P, 70, {}); }
  if (comidas.length !== 4) mal('no comió las 4 comidas ('+comidas.length+')'); else bien('comió:', comidas.map(c=>c.comida).join(', '), '· dijo:', dichos.filter(d=>['empanada','patacon','tequeno','mandoca'].includes(d.k)).map(d=>d.texto).join(' / '));
  if (!dichos.some(d=>d.k==='patacon') || !dichos.some(d=>d.k==='mandoca')) mal('no dijo lo del patacón o la mandoca');
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
  let batazos = 0, jonron = null, caidas = [];
  for (let i=0;i<14 && !(jonron && caidas.length);i++){ poner(P, N.BEISBOL.home.x, N.BEISBOL.home.z); correr(P, 3, {}); correr(P, 1, {a:true, b:true}, (P, evs)=>{ for (const e of evs) if (e.tipo==='batazo') batazos++; return false; }); correr(P, 60*7, {}, (P, evs)=>{ for (const e of evs){ if (e.tipo==='batazo') batazos++; if (e.tipo==='jonron') jonron = e; if (e.tipo==='pelotaCae') caidas.push(e.d); } return P.pelota.estado==='quieta' && batazos > 0; }); }
  if (!batazos) mal('no bateó desde el home'); else if (!jonron) mal('en 14 batazos no hubo jonrón (caídas: '+caidas.map(d=>d.toFixed(0)).join(', ')+')'); else bien('batazos:', batazos, '· jonrón a la', batazos, 'ª · +monedas', P.monedas, '· caídas:', caidas.map(d=>d.toFixed(0)).join(', '));
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
for (const t of ['rayo','catatumboCuenta','coro','chivo','aroNoche','polarcita','ovniLlega','ovniLuz','extraterrestres','ovniLista','lunaLlega','banderaLuna','cepillado','empanada','gaita','lugarMcbo','batazo','jonron','pelotaCae','avionNPC','estadioCerca','aeropuertoCerca']) if (!tipos[t]) mal('nunca salió el evento '+t);
console.log(fallos ? '\n'+fallos+' FALLO(S)' : '\n✓ Maracaibo de noche sin fallos');
process.exit(fallos ? 1 : 0);
