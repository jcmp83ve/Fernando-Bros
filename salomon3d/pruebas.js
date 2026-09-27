/* ============================================================
   PRUEBAS DE SALOMÓN Y LOS PRIMOS — LA GRAN AVENTURA DEL LAGO
   Se corre con:   node pruebas.js          (todo)
                   node pruebas.js 3 4      (solo esos niveles)
   Sin navegador: carga el núcleo y los niveles y revisa
   · que cada nivel tenga lo que pide el diseño (jaulas, cocadas…)
   · que se pueda llegar a todo con el equipo (revisor de saltos)
   · las mecánicas (poderes, jaulas, dianas, jefes, tienda, red)
   · botones al azar sin números rotos
   ============================================================ */
const path = require('path');
const S = require(path.join(__dirname, 'nucleo.js'));
for (const f of ['niveles.js', 'niveles_b.js', 'niveles_c.js', 'niveles_d.js']) require(path.join(__dirname, f));
const L = globalThis.SALO_NIVELES;
S.registrarNiveles(L);
let fallos = 0;
const mal = m=>{ console.log('✗', m); fallos++; };
const bien = m=>console.log('✓', m);
const soloNiveles = process.argv.slice(2).map(Number).filter(Number.isFinite);
const niveles = [...Array(L.length).keys()].filter(n=>L[n] && (!soloNiveles.length || soloNiveles.includes(n)));

/* ---------------- 1) cada nivel está bien armado ---------------- */
for (const n of niveles){
  let N;
  try{ N = S.armarNivel(n); }catch(e){ mal('nivel ' + n + ' no se arma: ' + e.message); continue; }
  const pre = 'nivel ' + n + ' (' + (N.nombre || '?') + '): ';
  if (!N.nombre || !N.sub) mal(pre + 'falta nombre o sub');
  if (!N.tema || !S.CIELOS.includes(N.tema.cielo)) mal(pre + 'cielo desconocido: ' + (N.tema && N.tema.cielo));
  if (N.agua === undefined && N.vacio === undefined) mal(pre + 'falta agua o vacio (el piso de caída)');
  const finito = (o, campos)=>campos.every(k=>Number.isFinite(o[k]));
  for (const c of N.cajas){
    if (!finito(c, ['x0', 'x1', 'y0', 'y1', 'z0', 'z1']) || c.x1 <= c.x0 || c.y1 <= c.y0 || c.z1 <= c.z0){ mal(pre + 'caja rota ' + c.id); break; }
    if (!S.MATERIALES.includes(c.mat)){ mal(pre + 'material desconocido: ' + c.mat); break; }
  }
  for (const d of N.deco) if (!S.DECOS.includes(d.tipo)){ mal(pre + 'adorno desconocido: ' + d.tipo); break; }
  for (const e of N.enemigos) if (!S.ENEMIGOS[e.tipo]){ mal(pre + 'enemigo desconocido: ' + e.tipo); break; }
  for (const j of N.jaulas) if (!S.AMIGOS[j.amigo]) mal(pre + 'amigo desconocido: ' + j.amigo);
  if (N.jefe && !S.JEFES[N.jefe.tipo]) mal(pre + 'jefe desconocido: ' + N.jefe.tipo);
  for (const k of ['monedas', 'cocadas', 'barajitas', 'jaulas', 'enemigos', 'banderas']) for (const o of N[k]) if (!finito(o, ['x', 'y', 'z'])){ mal(pre + k + ' con números rotos'); break; }
  if (n === 0){
    if (N.portales.length !== 12) mal(pre + 'la Vereda debe tener 12 portales');
    bien(pre + N.cajas.length + ' plataformas · ' + N.portales.length + ' portales');
    continue;
  }
  if (N.jaulas.length !== 2) mal(pre + 'debe tener 2 jaulas (tiene ' + N.jaulas.length + ')');
  if (N.cocadas.length !== 8) mal(pre + 'debe tener 8 cocadas (tiene ' + N.cocadas.length + ')');
  if (N.barajitas.length !== 3) mal(pre + 'debe tener 3 barajitas (tiene ' + N.barajitas.length + ')');
  if (!N.meta && !N.jefe) mal(pre + 'no tiene meta ni jefe');
  if (N.banderas.length < 3) mal(pre + 'debe tener 3 banderas o más');
  if (N.monedas.length < 40) mal(pre + 'muy pocas monedas (' + N.monedas.length + ', mínimo 40)');
  if (N.enemigos.length < 5 && !N.jefe) mal(pre + 'muy pocos enemigos (' + N.enemigos.length + ')');
  /* ¿se llega a todo con el equipo? */
  const A = S.alcanzables(N, 'equipo');
  const faltan = [];
  N.jaulas.forEach((j, i)=>{ if (!A.llegaA(j.x, j.y, j.z)) faltan.push('jaula ' + i); });
  N.cocadas.forEach((c, i)=>{ if (!A.llegaA(c.x, c.y - 0.7, c.z)) faltan.push('cocada ' + i + ' (' + c.x + ', ' + (c.y - 0.7).toFixed(1) + ', ' + c.z + ')'); });
  N.barajitas.forEach((b, i)=>{ if (!A.llegaA(b.x, b.y - 0.9, b.z)) faltan.push('barajita ' + i + ' (' + b.x + ', ' + (b.y - 0.9).toFixed(1) + ', ' + b.z + ')'); });
  N.banderas.forEach((b, i)=>{ if (!A.llegaA(b.x, b.y, b.z, 2)) faltan.push('bandera ' + i); });
  if (N.meta && !A.llegaA(N.meta.x, N.meta.y - 1.1, N.meta.z)) faltan.push('meta');
  if (N.jefe && !A.llegaA(N.jefe.x, N.jefe.y, N.jefe.z, 4)) faltan.push('arena del jefe');
  for (const d of N.dianas) if (!A.abiertas.has(d.abre)) faltan.push('diana ' + d.abre);
  if (faltan.length) mal(pre + 'no se llega a: ' + faltan.join(', '));
  /* y que no todo sea para el Primo: la mitad de las monedas las alcanza Salomón solo */
  const AS = S.alcanzables(N, 'salomon');
  const deSalomon = N.monedas.filter(m=>AS.llegaA(m.x, m.y - 0.7, m.z)).length;
  if (deSalomon < N.monedas.length*0.4) mal(pre + 'Salomón solo llega a ' + deSalomon + ' de ' + N.monedas.length + ' monedas: el nivel es muy del Primo');
  if (!faltan.length) bien(pre + N.cajas.length + ' plataformas · ' + N.monedas.length + ' monedas · ' + N.enemigos.length + ' enemigos' + (N.jefe ? ' · jefe ' + S.JEFES[N.jefe.tipo].nombre : '') + ' · Salomón solo: ' + deSalomon + ' monedas');
}

/* ---------------- 2) botones al azar ---------------- */
for (const n of niveles){
  const G = S.crearPartida(n, S.progresoNuevo());
  const azar = S.azarCon(7 + n);
  let ent = {};
  try{
    for (let i = 0; i < 60*60; i++){
      if (i % 20 === 0) ent = {jx: azar()*2 - 1, jy: azar()*2 - 1, saltar: azar() < 0.5, saltoPulsado: azar() < 0.3, poder: azar() < 0.2, cambiar: azar() < 0.03, camYaw: azar()*6};
      S.paso(G, ent); ent.saltoPulsado = ent.poder = ent.cambiar = false;
      G.eventos.length = 0;
      const J = G.J;
      if (![J.x, J.y, J.z, J.vx, J.vy, J.vz].every(Number.isFinite)) throw new Error('números rotos en el jugador');
      if (J.y < -60) throw new Error('cayó sin fin');
      for (const e of G.N.enemigos) if (e.vivo && ![e.x, e.y, e.z].every(Number.isFinite)) throw new Error('enemigo con números rotos');
      if (G.fase === 'portal' || G.fase === 'fin') break;
    }
  }catch(e){ mal('nivel ' + n + ' al azar: ' + e.message); }
}
bien('botones al azar en ' + niveles.length + ' niveles');

/* ---------------- 3) mecánicas ---------------- */
if (!soloNiveles.length){
  const N1 = 1;
  const mover = (G, x, y, z)=>{ G.J.x = x; G.J.y = y; G.J.z = z; G.J.vx = G.J.vy = G.J.vz = 0; G.J.suelo = false; S.paso(G, {}); };
  const esperar = (G, s, ent)=>{ for (let i = 0; i < s*60; i++) S.paso(G, ent || {}); };
  /* pedrada a un enemigo */
  {
    const G = S.crearPartida(N1, S.progresoNuevo(), {pj: 'salomon'});
    const e = G.N.enemigos[0];
    mover(G, e.x, e.y, e.z + 5); G.J.ang = Math.PI;   /* mirando hacia −z */
    for (let i = 0; i < 10 && e.vivo; i++){ S.paso(G, {poder: true}); esperar(G, 0.5); G.J.x = e.x; G.J.z = e.z + 5; G.J.invul = 9; }
    if (e.vivo) mal('la pedrada no vence a la iguana'); else bien('la pedrada vence enemigos');
  }
  /* pisotón */
  {
    const G = S.crearPartida(N1, S.progresoNuevo());
    const e = G.N.enemigos[0];
    G.J.x = e.x; G.J.z = e.z; G.J.y = e.y + 3; G.J.vy = -2; G.J.suelo = false;
    for (let i = 0; i < 60 && e.vivo; i++){ G.J.x = e.x; G.J.z = e.z; S.paso(G, {}); }
    if (e.vivo) mal('pisar no vence a la iguana'); else if (G.J.vidas < 3) mal('pisar lastimó'); else bien('pisar vence enemigos sin lastimar');
  }
  /* panzazo tumba la pared rajada y rompe cajas; la patada del Primo no tumba paredes */
  {
    const G = S.crearPartida(N1, S.progresoNuevo(), {pj: 'primo'});
    const raj = G.N.cajas.find(c=>c.rajada);
    const cx = raj.x1 + 1, cz = (raj.z0 + raj.z1)/2;
    mover(G, cx, 0, cz); S.paso(G, {poder: true}); esperar(G, 1);
    if (!raj.solido) mal('la patada tumbó la pared rajada');
    G.J.pj = 'mollejuo'; mover(G, cx, 0, cz); S.paso(G, {poder: true});
    if (raj.solido) mal('el panzazo no tumbó la pared rajada'); else bien('solo el panzazo tumba paredes rajadas');
  }
  /* jaula: tres golpes y da chispa */
  {
    const G = S.crearPartida(N1, S.progresoNuevo(), {pj: 'primo'});
    const j = G.N.jaulas[0];
    for (let i = 0; i < 5 && !j.abierta; i++){ mover(G, j.x + 1, j.y, j.z); G.J.cd = 0; S.paso(G, {poder: true}); esperar(G, 0.8); }
    if (!j.abierta || !G.P.chispas.includes(j.chispa)) mal('la jaula no se abrió o no dio chispa'); else bien('la jaula se abre a golpes y da chispa ' + j.chispa);
    const G2 = S.crearPartida(N1, G.P);
    if (!G2.N.jaulas[0].abierta) mal('la jaula ya abierta volvió a cerrarse al entrar otra vez'); else bien('lo ganado queda ganado');
  }
  /* diana abre la puerta */
  {
    const G = S.crearPartida(N1, S.progresoNuevo(), {pj: 'salomon'});
    const d = G.N.dianas[0], pu = G.N.cajas.find(c=>c.puerta === d.abre);
    mover(G, d.x, 1.8, d.z + 8); G.J.ang = Math.PI;
    for (let i = 0; i < 6 && !d.activa; i++){ G.J.cd = 0; S.paso(G, {poder: true}); esperar(G, 0.6); }
    if (!d.activa || pu.solido) mal('la diana no abrió la puerta'); else bien('la diana abre la puerta');
  }
  /* 8 cocadas = chispa */
  {
    const G = S.crearPartida(N1, S.progresoNuevo());
    for (const c of G.N.cocadas){ mover(G, c.x, c.y - 0.7, c.z); }
    if (!G.P.chispas.includes(G.N.chispaCocadas)) mal('las 8 cocadas no dieron chispa (' + G.cocadas + ')'); else bien('las 8 cocadas dan chispa');
  }
  /* meta termina el nivel */
  {
    const G = S.crearPartida(N1, S.progresoNuevo());
    const M = G.N.meta; mover(G, M.x, M.y - 1.1, M.z);
    if (G.fase !== 'fin' || !G.P.chispas.includes(G.N.chispaMeta)) mal('la meta no terminó el nivel'); else bien('la meta da chispa y termina el nivel');
    esperar(G, 5);
  }
  /* corazones: tres golpes = desmayo y vuelve a la bandera con los corazones llenos */
  {
    const G = S.crearPartida(N1, S.progresoNuevo()); G.P.monedas = 25;
    for (let i = 0; i < 3; i++){ G.J.invul = 0; S.lastimar(G, G.J.x + 1, G.J.z, 5); }
    if (G.J.vidas !== 3 || G.P.monedas !== 15) mal('el desmayo no funcionó (vidas ' + G.J.vidas + ', monedas ' + G.P.monedas + ')'); else bien('al desmayarse pierde 10 monedas y vuelve con 3 corazones');
  }
  /* portales: cerrados sin chispas, abiertos con chispas */
  {
    const P = S.progresoNuevo();
    const G = S.crearPartida(0, P);
    const p5 = G.N.portales.find(p=>p.nivel === 5);
    mover(G, p5.x, p5.y, p5.z); esperar(G, 0.2);
    if (G.fase === 'portal') mal('el portal 5 abrió sin chispas');
    P.chispas = Array.from({length: 12}, (_, i)=>(1 + (i % 3)) + '-j' + i);
    const G2 = S.crearPartida(0, P); mover(G2, p5.x, p5.y, p5.z); esperar(G2, 0.2);
    if (G2.fase !== 'portal' || G2.destino !== 5) mal('el portal 5 no abrió con 12 chispas'); else bien('los portales piden chispas');
  }
  /* jefes: cada tipo se puede vencer */
  for (const tipo of Object.keys(S.JEFES)){
    const G = S.crearPartida(N1, S.progresoNuevo(), {pj: 'salomon'});
    G.N.jefe = {tipo, x: 0, y: 0, z: -32, arena: 10};
    G.jefe = Object.assign({}, G.N.jefe, S.JEFES[tipo], {hp: S.JEFES[tipo].hp, hpMax: S.JEFES[tipo].hp, vivo: true, activo: false, x0: 0, z0: -32, y0: 0, estado: 'espera', t: 0, vx: 0, vz: 0, vy: 0, golpeT: -9, ang: 0});
    G.N.meta = null; G.metaViva = false;
    let t = 0;
    for (; t < 60*120 && G.jefe.vivo; t++){
      G.J.invul = 9; G.J.vidas = 3;
      const B = G.jefe;
      /* se queda cerca mirando al jefe y le tira pedradas; si está mareado o cansado, le salta encima */
      if ((B.estado === 'mareado' || B.estado === 'cansado') && B.activo){ G.J.x = B.x; G.J.z = B.z; G.J.y = B.y + B.alto + 0.6; G.J.vy = -3; G.J.suelo = false; }
      else { G.J.x = B.x0; G.J.z = B.z0 + 8; G.J.y = 0; G.J.ang = Math.atan2(B.x - G.J.x, B.z - G.J.z); G.J.cd = t % 20 ? G.J.cd : 0; }
      S.paso(G, {poder: t % 20 === 0});
      G.eventos.length = 0;
    }
    if (G.jefe.vivo) mal('no se pudo vencer al jefe ' + tipo + ' (hp ' + G.jefe.hp + ', estado ' + G.jefe.estado + ')'); else bien('jefe ' + S.JEFES[tipo].nombre + ' vencido en ' + (t/60).toFixed(0) + ' s');
  }
  /* tienda */
  {
    const P = S.progresoNuevo(); P.monedas = 50;
    if (S.comprar(P, 'corona') !== 'faltan') mal('compró sin plata');
    if (S.comprar(P, 'aguilas') !== 'comprado' || P.monedas !== 10 || P.puesto.cabeza !== 'aguilas') mal('no compró la gorra');
    if (S.comprar(P, 'aguilas') !== 'puesto' || P.puesto.cabeza) mal('no se quitó la gorra');
    const Q = S.progresoLimpio(JSON.parse(JSON.stringify(Object.assign(P, {chispas: ['1-j0', 'malo', '12-m'], monedas: -5, compras: ['aguilas', 'x']}))));
    if (Q.chispas.length !== 2 || Q.monedas !== 0 || Q.compras.length !== 1) mal('progresoLimpio no limpia'); else bien('tienda y guardado');
  }
  /* red */
  {
    const G = S.crearPartida(N1, S.progresoNuevo()); G.P.puesto.cabeza = 'corona';
    const e = S.desempaquetar(JSON.parse(JSON.stringify(S.empaquetar(G, 'Salomón'))));
    if (!e || e.nv !== N1 || e.puesto.cabeza !== 'corona' || Math.abs(e.x - G.J.x) > 0.01) mal('el paquete de red no va y vuelve');
    if (S.desempaquetar({t: 'e', x: 'a'}) || S.desempaquetar(null)) mal('acepta paquetes malos');
    const P = S.progresoNuevo();
    if (!S.recibirPremio(P, 'chispa', '3-j1') || S.recibirPremio(P, 'chispa', '3-j1') || S.recibirPremio(P, 'chispa', 'hack')) mal('recibirPremio');
    else bien('paquetes de red');
  }
  /* los jefes de los niveles despiertan cuando uno se acerca */
  for (const n of niveles){
    if (!L[n]) continue;
    const G = S.crearPartida(n, S.progresoNuevo());
    if (!G.jefe) continue;
    const B = G.jefe;
    if (!Number.isFinite(B.y0)) { mal('nivel ' + n + ': el jefe no tiene altura'); continue; }
    G.J.x = B.x0; G.J.z = B.z0 + 6; G.J.y = B.y0; G.J.invul = 99;
    for (let i = 0; i < 30; i++) S.paso(G, {});
    if (!B.activo) mal('nivel ' + n + ': el jefe ' + B.nombre + ' no despierta'); else bien('nivel ' + n + ': el jefe despierta');
  }
  /* total de chispas: 12 niveles × 4 = 48 y el último portal pide 36 */
  if (L.length === 13 && L.every(Boolean)){
    let total = 0; for (let n = 1; n <= 12; n++) total += S.chispasDeNivel(n).length;
    if (total !== 48) mal('hay ' + total + ' chispas, deberían ser 48'); else bien('48 chispas en total; el último portal pide ' + S.PIDE_PORTAL[12]);
  } else mal('faltan niveles: hay ' + (L.filter(Boolean).length - 1) + ' de 12');
}

console.log(fallos ? '\n' + fallos + ' fallo(s)' : '\nTodo bien ✔');
process.exit(fallos ? 1 : 0);
