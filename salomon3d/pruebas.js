/* ============================================================
   PRUEBAS DE SALOMÓN Y LOS PRIMOS DEL PUENTE
   Se corre con:   node pruebas.js
   Sin navegador: se carga solo el núcleo y un "bot" juega los tres
   niveles de punta a punta (con el personaje que haga falta en cada
   obstáculo). Además revisa que cada obstáculo pida al personaje
   correcto y que las grabaciones de Salomón sean las de La Gran Aventura.
   ============================================================ */
const path = require('path');
const S = require(path.join(__dirname, 'salomon3d.js'));
const A = require(path.join(__dirname, '..', 'aventura3d', 'aventura3d.js'));
let fallos = 0;
const mal = m=>{ console.log('✗', m); fallos++; };
const bien = m=>console.log('✓', m);

/* 1) las grabaciones de Salomón son las mismas de La Gran Aventura */
for (const [frase, url] of Object.entries(S.CLIPS_PJ.salomon))
  if (A.CLIPS_PJ.salomon[frase] !== url) mal('grabación distinta o inexistente: ' + frase);
/* y todas las frases de Salomón con mp3 se usan tal cual en algún diálogo */
const dichas = new Set([...Object.values(S.DIALOGOS).flat().map(d=>d[1]), ...Object.values(S.SALUDO)]);
for (const f of Object.keys(S.CLIPS_PJ.salomon)) if (!dichas.has(f) && !/hamburguesa|agüita/.test(f)) mal('grabación sin usar: ' + f);
for (const [clave, lineas] of Object.entries(S.DIALOGOS)) for (const [pj, t] of lineas){
  if (!S.NOMBRES[pj]) mal(clave + ': personaje desconocido ' + pj);
  if (!t || t.length > 140) mal(clave + ': frase vacía o muy larga');
}
bien('voces y diálogos');

/* 2) los saltos: cada uno llega a lo suyo */
const alto = {salomon: S.alturaSalto('salomon'), primo: S.alturaSalto('primo'), mollejuo: S.alturaSalto('mollejuo')};
if (!(alto.salomon > 1.25 && alto.salomon < 2.5)) mal('salto de Salomón raro: ' + alto.salomon.toFixed(2));
if (!(alto.primo > 2.8)) mal('el Primo no llega al muro: ' + alto.primo.toFixed(2));
if (!(alto.mollejuo > 1.0 && alto.mollejuo < alto.salomon)) mal('salto del Mollejúo raro');
bien('alturas de salto · Salomón ' + alto.salomon.toFixed(2) + ' m · Primo ' + alto.primo.toFixed(2) + ' m · Mollejúo ' + alto.mollejuo.toFixed(2) + ' m');

/* ---- el bot ---- */
function nuevo(n, previo, pj){ const G = S.crearPartida(n, previo, {pj}); return G; }
function paso(G, ent){ S.paso(G, ent); G.eventos.length = 0; revisar(G); }
function revisar(G){
  const J = G.J;
  if (![J.x, J.y, J.z, J.vx, J.vy, J.vz].every(Number.isFinite)) throw new Error('números rotos en el jugador');
}
function esperar(G, s){ for (let i = 0; i < s*60; i++) paso(G, {}); }
function como(G, pj){ for (let i = 0; i < 4 && G.J.pj !== pj; i++){ paso(G, {cambiar: true}); esperar(G, 0.3); } return G.J.pj === pj; }
/* camina hasta (x, z); si algo lo tranca o el objetivo está más alto, salta con el botón sostenido */
function ir(G, x, z, o){
  o = o || {};
  const J = G.J, lim = (o.seg || 40)*60;
  let saltando = 0;
  for (let i = 0; i < lim; i++){
    const dx = x - J.x, dz = z - J.z, d = Math.hypot(dx, dz);
    if (d < (o.cerca || 0.5) && (o.y === undefined || Math.abs(J.y - o.y) < 0.3)) return true;
    const ent = {jx: d > 0.01 ? dx/Math.max(d, 1) : 0, jy: d > 0.01 ? -dz/Math.max(d, 1) : 0};
    const trancado = J.choco && J.suelo;
    const masAlto = o.y !== undefined && o.y > J.y + 0.3 && d < 2.2 && J.suelo;
    if ((trancado || masAlto) && saltando <= 0){ ent.saltoPulsado = true; saltando = 50; }
    if (saltando > 0){ ent.saltar = true; saltando--; }
    paso(G, ent);
    if (G.fase !== 'jugando' && o.hastaFin) return true;
  }
  return false;
}
function recorrer(G, puntos, nombre){
  for (const p of puntos){
    if (p.pj && !como(G, p.pj)) { mal(nombre + ': no pudo cambiar a ' + p.pj); return false; }
    if (!ir(G, p.x, p.z, p)) { mal(nombre + ': no llegó a (' + p.x + ', ' + p.z + ') · está en (' + G.J.x.toFixed(1) + ', ' + G.J.y.toFixed(1) + ', ' + G.J.z.toFixed(1) + ') con ' + G.J.pj); return false; }
    if (p.hacer) p.hacer(G);
  }
  return true;
}

/* 3) nivel 1: sin el Primo no se sube el muro; con él sí, y la meta pide 8 comidas */
{
  const G = nuevo(0);
  G.equipo = ['salomon'];
  if (ir(G, 0, -135, {seg: 20})) mal('Salomón subió el muro de 2,6 m solito');
  else if (G.J.z > -123 && G.J.z < -110) bien('el muro frena a Salomón (z ' + G.J.z.toFixed(1) + ')');
  else mal('Salomón quedó en un sitio raro frente al muro: z ' + G.J.z.toFixed(1));
}
{
  const G = nuevo(0);
  /* las comidas de abajo en orden, el Primo, y arriba del muro */
  const abajo = G.N.comidas.filter(c=>c.z > -124).sort((a, b)=>b.z - a.z);
  const pts = [];
  for (const c of abajo){ if (c.y - 0.6 > 1.7) pts.push({x: c.x, z: c.z + 2, y: 1.1, cerca: 0.4}); pts.push({x: c.x, z: c.z, y: c.y - 0.6, cerca: 0.4}); if (c.z < -60 && !pts.some(p=>p.primo)) pts.push({x: 5, z: -73.5 + 2.2, primo: true, cerca: 1.5}); }
  pts.push({x: 0, z: -135, pj: 'primo', y: 2.6});
  for (const c of G.N.comidas.filter(c=>c.z <= -124).sort((a, b)=>b.z - a.z)) pts.push({x: c.x, z: c.z, y: c.y - 0.6, cerca: 0.4});
  pts.push({x: 0, z: -195, hastaFin: true, seg: 20});
  const antes = G.comida;
  if (recorrer(G, pts, 'nivel 1')){
    if (!G.equipo.includes('primo')) mal('nivel 1: el Primo no se unió');
    if (G.fase !== 'nivelListo') mal('nivel 1: no terminó (fase ' + G.fase + ', comida ' + G.comida + ')');
    else bien('nivel 1 completo · comida ' + G.comida + ' · equipo ' + G.equipo.join(', ') + ' · ' + G.t.toFixed(0) + ' s');
  }
  if (G.comida - antes < 8) mal('nivel 1: comió muy poquito');
  var PREVIO1 = G;
}
{
  /* la meta no abre con menos de 8 */
  const G = nuevo(0);
  G.equipo = ['salomon', 'primo']; G.N.aliados[0].unido = true; G.comida = 3;
  G.J.pj = 'primo'; G.J.x = 0; G.J.y = 2.6; G.J.z = -185;
  ir(G, 0, -196, {seg: 5});
  if (G.fase === 'nivelListo') mal('la meta abrió con 3 comidas');
  else bien('la meta pide 8 comidas (se queda en z ' + G.J.z.toFixed(1) + ')');
}

/* 4) nivel 2: el Mollejúo tapa el paso hasta que come; la gandola solo se mueve con el panzazo */
{
  const G = nuevo(1, {equipo: ['salomon', 'primo'], comida: 0, puntos: 0, comidoTotal: 0, nubesVencidas: 0});
  G.N.comidas.forEach(c=>{ c.vivo = false; });
  G.J.x = 0; G.J.z = -112;
  ir(G, 0, -130, {seg: 6});
  if (G.J.z < -122.5) mal('se pasó al Mollejúo sin darle comida');
  else if (G.equipo.includes('mollejuo')) mal('el Mollejúo se unió sin comer');
  else bien('el Mollejúo tapa el paso sin comida');
  G.comida = 1;
  ir(G, 0, -130, {seg: 6});
  if (!G.equipo.includes('mollejuo') || G.comida !== 0) mal('el Mollejúo no se unió al darle un patacón');
  else bien('el Mollejúo se unió y se comió el patacón');
  como(G, 'salomon');
  G.J.x = 0; G.J.z = -246;
  for (let i = 0; i < 20; i++) paso(G, {poder: true});
  ir(G, 0, -262, {seg: 4});
  if (G.J.z < -253.5) mal('Salomón pasó la gandola');
  const gandola = G.N.cajas.find(b=>b.id==='gandola');
  if (gandola.empujado) mal('una pedrada movió la gandola');
  como(G, 'mollejuo'); paso(G, {poder: true}); esperar(G, 2);
  if (!gandola.movido) mal('el panzazo no movió la gandola');
  else bien('la gandola solo se mueve con el panzazo');
}
{
  const G = nuevo(1, PREVIO1);
  const pts = [];
  const zs = [-8, -55, -57.5, -62.5, -66, -110, -125, -135, -137.5, -142.5, -146, -195, -197.5, -202.5, -206, -244];
  for (const z of zs){
    const cercaPilon = [-60, -140, -200].some(p=>Math.abs(z - p) < 3);
    pts.push({x: cercaPilon ? 1.35 : 0, z, seg: 30, cerca: 0.6});
  }
  pts.push({x: 0, z: -252.3, pj: 'mollejuo', cerca: 0.5, hacer: g=>{ paso(g, {poder: true}); esperar(g, 2); }});
  pts.push({x: 0, z: -284, hastaFin: true, seg: 20});
  if (recorrer(G, pts, 'nivel 2')){
    if (G.fase !== 'nivelListo') mal('nivel 2: no terminó (fase ' + G.fase + ')');
    else bien('nivel 2 completo · equipo ' + G.equipo.join(', ') + ' · ' + G.t.toFixed(0) + ' s');
  }
  var PREVIO2 = G;
}
{
  /* los carros sí golpean */
  const G = nuevo(1, PREVIO1);
  let golpes = 0;
  G.J.x = -6.8; G.J.z = -60;
  for (let i = 0; i < 600; i++){ S.paso(G, {}); golpes += G.eventos.filter(e=>e.tipo==='golpe').length; G.eventos.length = 0; }
  if (!golpes) mal('los carros no golpean');
  else bien('los carros golpean (' + golpes + ' en 10 s parado en el carril)');
}

/* 5) nivel 3: tres chispas, cada una con su primo, y el Nublao */
{
  const G = nuevo(2, PREVIO2);
  G.J.pj = 'salomon';
  ir(G, -3.5, -26, {seg: 6, y: 3.2});
  if (G.chispas) mal('Salomón llegó al techo alto');
  else bien('el techo alto no lo alcanza Salomón');
  G.J.pj = 'mollejuo'; G.J.x = 0; G.J.y = 0.5; G.J.z = -80;
  for (let i = 0; i < 10; i++) paso(G, {poder: true});
  if (G.N.nubes[0].hp < 3) mal('el panzazo le llegó a la nube grande');
  G.J.pj = 'salomon'; G.J.x = 0; G.J.z = -99; G.chispas = 0;
  ir(G, 0, -110, {seg: 4});
  if (G.J.z < -98) mal('se pasó a la plaza del Nublao sin chispas');
  else bien('la plaza del Nublao pide las tres chispas');
}
{
  const G = nuevo(2, PREVIO2);
  const dispara = (g, n)=>{ for (let i = 0; i < n*60 && g.fase === 'jugando'; i++){ const ent = {poder: i % 25 === 0, jx: Math.sin(i/40)*0.6}; paso(g, ent); } };
  const pts = [
    {x: 0, z: -19},
    {x: -3.5, z: -26, y: 3.2, pj: 'primo', cerca: 0.8},
    {x: 0, z: -20}, {x: 0, z: -43},
    {x: 0, z: -46, pj: 'salomon', hacer: g=>{ for (let i = 0; i < 12*60 && g.N.nubes[0].vivo; i++) paso(g, {poder: i % 25 === 0}); if (g.N.nubes[0].vivo) mal('nivel 3: la nube grande no cayó'); esperar(g, 1.5); }},
  ];
  if (recorrer(G, pts, 'nivel 3 (a)')){
    const ch = G.N.chispas[1];
    const pts2 = [
      {x: ch.x, z: ch.z, cerca: 0.8},
      {x: 0, z: -63}, {x: 0, z: -75},
      {x: 0, z: -81.8, pj: 'mollejuo', cerca: 0.8, hacer: g=>{ paso(g, {poder: true}); esperar(g, 2); }},
      {x: 0, z: -87.5, cerca: 0.8},
      {x: 0, z: -83}, {x: -7, z: -83}, {x: -7, z: -94.5}, {x: 0, z: -94.5}, {x: 0, z: -97}, {x: 0, z: -107},
      {x: 0, z: -112, pj: 'salomon', hacer: g=>dispara(g, 30)},
    ];
    if (recorrer(G, pts2, 'nivel 3 (b)')){
      if (G.chispas !== 3) mal('nivel 3: chispas ' + G.chispas);
      if (G.fase !== 'final') mal('nivel 3: el Nublao no cayó (fase ' + G.fase + ', hp ' + G.N.nubes[4].hp + ')');
      else {
        esperar(G, 12);
        if (G.fase !== 'fin') mal('nivel 3: el final no terminó');
        else bien('nivel 3 completo · chispas 3 · Nublao vencido · puntos ' + G.puntos + ' · ' + G.t.toFixed(0) + ' s');
      }
    }
  }
}

/* 6) a lo loco: entradas al azar en los tres niveles, sin números rotos ni caídas eternas */
for (let n = 0; n < 3; n++){
  const G = nuevo(n);
  let s = 7 + n;
  const azar = ()=>{ s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff; return s/0x7fffffff; };
  let ent = {};
  try{
    for (let i = 0; i < 60*120; i++){
      if (i % 20 === 0) ent = {jx: azar()*2 - 1, jy: azar()*2 - 1, saltar: azar() < 0.5, saltoPulsado: azar() < 0.3, poder: azar() < 0.2, cambiar: azar() < 0.03};
      paso(G, ent); ent.saltoPulsado = ent.poder = ent.cambiar = false;
      if (G.J.y < -40) throw new Error('cayó sin fin');
    }
    bien('nivel ' + (n+1) + ' aguanta 2 minutos de botones al azar');
  }catch(e){ mal('nivel ' + (n+1) + ' al azar: ' + e.message); }
}

console.log(fallos ? '\n' + fallos + ' fallo(s)' : '\nTodo bien ✔');
process.exit(fallos ? 1 : 0);
