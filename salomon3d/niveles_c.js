(function(raiz){
'use strict';
/* ============================================================
   NIVELES 6 a 8: LOS MÉDANOS DE CORO · EL PÁRAMO · EL TEPUY
   (las reglas de diseño están arriba de niveles.js)
   ============================================================ */
const L = raiz.SALO_NIVELES = raiz.SALO_NIVELES || [];
const cargar = (n, f)=>{ L[n] = f; };

/* ---------------- 6 · LOS MÉDANOS DE CORO ----------------
   La plaza colonial de Coro (casitas pastel), el desierto de dunas con
   chivos que embisten y rocas que bajan rodando del médano, el oasis y la
   arena redonda del Chivo Cabezón.
   · barajita 0: en la torre de la iglesia (3,6 m sobre el techo): el Primo
   · barajita 1: en el corral de adobe, detrás de la pared rajada: el Mollejúo
   · barajita 2: en la cima del gran médano (todos)
   · jaula 0 (chivito): arriba del tanque del oasis, con el trampolín (todos)
   · jaula 1 (burrito): en el establo; la puerta la abre la diana de la columna: Salomón */
cargar(6, B=>{
  const pastel = ['#ffd8a8', '#b2f2bb', '#a5d8ff', '#fcc2d7', '#ffec99', '#d0bfff', '#99e9f2', '#ffc9c9'];
  const casa = (x, z, w, d, alto, i)=>{ B.plat(x, z, w, d, alto, {mat: 'casa', color: pastel[i % 8], h: alto + 1, redondo: 0.06}); B.deco('techo', x, alto, z, {w, d, color: '#c0583a'}); };
  const duna = (x, z, w, d, y)=>B.plat(x, z, w, d, y, {mat: 'arena', h: y + 1, redondo: 0.45});

  /* A · la plaza colonial de Coro (x −11…11, z 8…−20) */
  B.plat(0, -6, 22, 28, 0, {mat: 'adoquin', h: 2});
  /* casitas de la izquierda: escalera de techos 1,3 → 2,6 → 3,9 */
  casa(-8.5, 3, 5, 5, 1.3, 0); casa(-8.5, -3.5, 5, 6, 2.6, 1); casa(-8.5, -10.5, 5, 6, 3.9, 2);
  /* las de la derecha y la iglesia con su torre (la torre pide al Primo) */
  casa(8.5, 2, 5, 6, 2.6, 3); casa(8.5, -5, 5, 6, 1.3, 4);
  B.plat(8.5, -14, 5, 7, 2.6, {mat: 'casa', color: '#fff3bf', h: 3.6, redondo: 0.05});
  B.plat(9.5, -15, 2.4, 2.4, 6.2, {mat: 'casa', color: '#ffe066', h: 3.6, redondo: 0.04});
  B.deco('techo', 9.5, 6.2, -15, {w: 2.4, d: 2.4, color: '#c0583a'});
  B.barajita(9.5, 6.2, -15);
  B.zona('aviso', 5, 11, -18, -10, {texto: '¡Hay una barajita en la torre! Con el doble salto del Primo Verde se llega 👥', pj: 'primo'});
  /* casitas de adorno detrás de la plaza */
  for (let k = 0; k < 4; k++){
    B.deco('casa', -15.5, 0, 4 - k*6.5, {w: 5, d: 6, h: 3 + (k % 2)*0.8, color: pastel[(k + 3) % 8]});
    B.deco('casa', 15.5, 0, 4 - k*6.5, {w: 5, d: 6, h: 3.4 - (k % 2)*0.6, color: pastel[(k + 5) % 8]});
  }
  B.deco('letrero', 0, 0, -19, {texto: 'CORO · Los Médanos →'});
  B.deco('farol', -4.5, 0, 0); B.deco('farol', 4.5, 0, -4); B.deco('farol', -4.5, 0, -12); B.deco('farol', 4.5, 0, -17);
  B.deco('flores', -5, 0, 6); B.deco('flores', 5, 0, 6); B.deco('burro', 5, 0, -9, {ang: 1.2});
  B.linea(0, 0, 3, 0, 0, -17, 8);
  B.linea(-8.5, 1.3, 4.5, -8.5, 1.3, 1.5, 2); B.linea(-8.5, 2.6, -2, -8.5, 2.6, -5, 2);
  B.linea(8.5, 2.6, 4, 8.5, 2.6, 0, 3); B.linea(8.5, 1.3, -3.5, 8.5, 1.3, -6.5, 2);
  B.cocada(-8.5, 3.9, -11.5); B.cocada(7, 2.6, -11.5);
  B.caja(-3, 0, -14); B.caja(3, 0, 1, {corazon: true});
  /* la plazoleta del medio y los banquitos */
  B.plat(0, -9, 3, 3, 0.5, {mat: 'piedra', h: 0.5, redondo: 0.4}); B.deco('farol', 0, 0.5, -9, {esc: 1.2});
  B.plat(-4, -5, 2.4, 0.8, 0.5, {mat: 'madera', h: 0.5}); B.plat(4, -13, 2.4, 0.8, 0.5, {mat: 'madera', h: 0.5});
  B.enemigo('iguana', 3, 0, -9, {eje: 'z', ruta: 3});
  B.npc('vecino', -3, 0, 3, ['¡Épale, muchachos! Bienvenidos a Coro. Los chivos del médano embisten: cuando bajen la cabeza, ¡apártense!',
    'En la torre de la iglesia dejaron una barajita. Solo el Primo, con su doble salto, llega hasta allá arriba.'], {nombre: 'Doña Chela'});
  B.inicio(0, 0, 6, 0);
  B.bandera(0, 0, 5);

  /* B · el desierto de dunas (x −16…16, z −20…−62) */
  B.plat(0, -41, 32, 42, 0, {mat: 'arena', h: 2, redondo: 0.2});
  /* el gran médano de la izquierda: sube hasta 4,8 m y vuelve a bajar */
  duna(-10, -26, 8, 6, 1.2); duna(-11, -32, 7, 5, 2.4); duna(-11, -38, 7, 5, 3.6);
  duna(-12, -44, 6, 5, 4.8); duna(-12, -50, 6, 5, 3.4); duna(-12, -56, 6, 5, 1.8);
  B.barajita(-12, 4.8, -44);
  B.cocada(-11, 3.6, -38.5);
  B.linea(-10, 1.2, -24, -10, 1.2, -28, 2); B.linea(-11, 2.4, -31, -11, 2.4, -33, 2);
  B.linea(-12, 3.4, -49, -12, 3.4, -51, 2); B.linea(-12, 1.8, -55, -12, 1.8, -57, 2);
  /* dunitas de la derecha */
  duna(9, -27, 6, 6, 0.8); duna(11, -52, 6, 5, 1.4); duna(7, -40, 4, 4, 0.7);
  B.plat(12.5, -35, 2, 2, 1.2, {mat: 'roca', h: 1.2, redondo: 0.3}); B.plat(-3, -24.5, 2, 2, 0.9, {mat: 'roca', h: 0.9, redondo: 0.3});
  B.caja(-5, 0, -42); B.caja(13, 0, -44, {corazon: true});
  B.moneda(7, 0.7, -40); B.moneda(12.5, 1.2, -35);
  B.cocada(11, 1.4, -52);
  B.linea(9, 0.8, -25, 9, 0.8, -29, 3);
  /* el camino de monedas por el medio */
  B.linea(3, 0, -22, 3, 0, -44, 8);
  B.arco(0, -46, 0, -58, 0, 2.2, 6);
  B.cocada(-15, 0, -61);
  /* las rocas que bajan rodando del médano (dos carriles, a destiempo) */
  B.peligro('rodante', {x0: 16, z0: -47.5, y0: 0, x1: -7, z1: -47.5, y1: 0, vel: 5, cada: 3.2, r: 0.8});
  B.peligro('rodante', {x0: 16, z0: -56, y0: 0, x1: -7, z1: -56, y1: 0, vel: 5.5, cada: 3.6, r: 0.8, fase: 1.7});
  B.zona('aviso', -6, 16, -45, -43, {texto: '¡Pendiente con las rocas que ruedan! Pasa cuando no venga ninguna'});
  /* chivos e iguanas del desierto */
  B.enemigo('chivo', 4, 0, -33, {eje: 'x', ruta: 4, lejos: 6});
  B.enemigo('chivo', 1, 0, -39, {eje: 'z', ruta: 3, lejos: 6});
  B.enemigo('iguana', 4, 0, -52, {eje: 'x', ruta: 3});
  B.enemigo('iguana', -12, 4.8, -44, {eje: 'x', ruta: 1.5});
  /* el corral de adobe (x 16…28): la barajita está detrás de la pared rajada */
  B.plat(22, -38, 12, 14, 0, {mat: 'arena', h: 2, redondo: 0.2});
  B.muro(22, -34.6, 7.6, 0.8, 0, 3.2, {mat: 'ladrillo'}); B.muro(22, -41.4, 7.6, 0.8, 0, 3.2, {mat: 'ladrillo'});
  B.muro(25.4, -38, 0.8, 6, 0, 3.2, {mat: 'ladrillo'});
  B.rajada(18.6, -38, 0.8, 6, 0, 3.2);
  B.plat(22, -38, 7.6, 7.6, 3.6, {mat: 'tablas', h: 0.4});
  B.barajita(22, 0, -38);
  B.zona('aviso', 14, 18.2, -41, -35, {texto: '¡Una pared rajada en el corral! El panzazo del Mollejúo (B) la tumba 👥', pj: 'mollejuo'});
  B.cocada(24, 0, -44);
  B.deco('chivo', 26, 0, -33, {ang: -0.6}); B.deco('cerca', 21, 0, -31.6, {w: 6});
  B.npc('vecino', -3, 0, -21.5, ['¡Qué molleja de calor, primo! Las rocas bajan rodando del médano: esperen que pase una y crucen.',
    'En el corral de adobe hay algo escondido, pero la pared está rajada. ¡Eso es trabajo pa\'l Mollejúo!'], {nombre: 'El Tío Chuchú'});
  B.bandera(0, 0, -22);

  /* C · piedras sobre el vacío hasta el oasis */
  B.plat(0, -64.5, 3, 3, 0.4, {mat: 'roca', h: 1.2, redondo: 0.3});
  B.cae(1.5, -68.5, 2.6, 2.6, 0.8, {mat: 'tablas'});
  B.plat(0, -72.5, 3, 3, 0.4, {mat: 'roca', h: 1.2, redondo: 0.3});
  B.arco(0, -62, 0, -75, 0.4, 2, 6);
  /* el caminito de la derecha: piedras más altas con monedas */
  B.plat(6, -65, 2.4, 2.4, 0.6, {mat: 'roca', h: 1.2, redondo: 0.3}); B.plat(8, -69, 2.4, 2.4, 1.0, {mat: 'roca', h: 1.2, redondo: 0.3});
  B.plat(6, -73, 2.4, 2.4, 0.6, {mat: 'roca', h: 1.2, redondo: 0.3});
  B.moneda(6, 0.6, -65); B.moneda(8, 1.0, -69); B.moneda(6, 0.6, -73);

  /* D · el oasis (x −12…12, z −75,5…−92,5) */
  B.plat(0, -84, 24, 17, 0.4, {mat: 'pasto', h: 2.4, redondo: 0.3});
  B.deco('fuente', 0, 0.4, -84, {esc: 1.3});
  B.circulo(0, 0.4, -84, 4.5, 10);
  for (let k = 0; k < 8; k++){ const a = k/8*Math.PI*2 + 0.3; B.deco('palmera', Math.cos(a)*9.5, 0.4, -84 + Math.sin(a)*6.5, {esc: 0.9 + (k % 3)*0.15}); }
  B.deco('flores', -3, 0.4, -78); B.deco('flores', 3, 0.4, -90); B.deco('toldo', -9, 0.4, -78, {w: 3, d: 2.5, color: '#f08c00'});
  /* el tanque de agua con el chivito arriba: se sube con el trampolín */
  B.trampolin(6, 0.4, -79.5, 16);
  B.plat(6, -83, 3, 3, 4.4, {mat: 'madera', h: 0.5});
  B.deco('tanque', 6, 0.4, -83, {esc: 0.9});
  B.jaula(6, 4.4, -83, 'chivito');
  B.linea(6, 1.6, -79.5, 6, 3.6, -79.5, 3);
  /* el establo del burrito: la puerta la abre la diana de la columna (pedrada de Salomón) */
  B.muro(-8, -85.6, 5.6, 0.8, 0.4, 3, {mat: 'casa', color: '#ffc9c9'});
  B.muro(-8, -90.4, 5.6, 0.8, 0.4, 3, {mat: 'casa', color: '#ffc9c9'});
  B.muro(-10.4, -88, 0.8, 4, 0.4, 3, {mat: 'casa', color: '#ffc9c9'});
  B.puerta(-5.6, -88, 0.8, 4, 0.4, 3, 'establo');
  B.plat(-8, -88, 6, 6, 3.8, {mat: 'tablas', h: 0.4});
  B.jaula(-8, 0.4, -88, 'burrito');
  B.muro(-7, -99, 1.4, 1.4, -8, 16, {mat: 'piedra'});
  B.diana(-7, 8.9, -99, 'establo');
  B.zona('aviso', -6, 0, -92, -84, {texto: '¡El burrito está encerrado! Salomón le tira una pedrada (B) a la diana de la columna 👥', pj: 'salomon'});
  B.cocada(-9.5, 0.4, -77.5);
  B.enemigo('chivo', 3, 0.4, -88.5, {eje: 'x', ruta: 3, lejos: 5});
  B.enemigo('zancudo', -3, 2.2, -81, {ruta: 3});
  B.npc('vecino', 3, 0.4, -77, ['¡Llegaron al oasis! Tómense un fresquito. El burrito está en el establo, y la puerta se abre con la diana de la columna.',
    'El chivito se subió al tanque, ¡quién sabe cómo! Con el trampolín llegan, vos.'], {nombre: 'Don Nelson'});
  B.bandera(0, 0.4, -77.5);

  /* E · el puente de adoquines y la arena del Chivo Cabezón */
  B.plat(0, -97, 6, 9, 0.4, {mat: 'adoquin', h: 2});
  B.muro(-3.2, -97, 0.4, 9, 0.4, 0.6, {mat: 'piedra'}); B.muro(3.2, -97, 0.4, 9, 0.4, 0.6, {mat: 'piedra'});
  B.caja(-9, 0.4, -80); B.caja(10, 0.4, -87);
  B.linea(0, 0.4, -93.5, 0, 0.4, -100.5, 4);
  B.bandera(1.5, 0.4, -95);
  B.plat(0, -116, 30, 29, 0.4, {mat: 'arena', h: 2.4, redondo: 0.15});
  B.jefe('chivote', 0, 0.4, -117, {arena: 12, despierta: 12});
  B.circulo(0, 0.4, -117, 8, 12);
  B.cocada(13.5, 1.4, -130);
  for (const [x, z] of [[-13.5, -103], [13.5, -103], [-13.5, -130], [13.5, -130]]){ B.plat(x, z, 2, 2, 1.4, {mat: 'roca', h: 1, redondo: 0.3}); B.deco('cactus', x, 1.4, z, {esc: 1.3}); }
  B.deco('cerca', -14.5, 0.4, -116, {w: 20, ang: Math.PI/2}); B.deco('cerca', 14.5, 0.4, -116, {w: 20, ang: Math.PI/2});
  B.deco('medano', 0, -3, -140, {esc: 3}); B.deco('letrero', -2.5, 0.4, -93.5, {texto: '¡Cuidado con el chivo!'});

  /* adornos del desierto: médanos, cactus y rocas */
  for (const [x, z, e] of [[-24, -30, 2], [-26, -48, 2.4], [-24, -64, 1.8], [26, -58, 2], [22, -72, 1.6], [-20, -90, 2], [22, -100, 2.2], [0, -150, 3]]) B.deco('medano', x, -2, z, {esc: e});
  for (const [x, z] of [[-14.5, -22], [14.5, -24], [-6, -30], [14.5, -40], [-2, -60], [14.5, -60], [-15, -40], [7, -45], [15, -48], [-7, -54]]) B.deco('cactus', x, 0, z, {esc: 0.9 + ((x*7 + z) & 3)*0.12});
  B.deco('roca', 12, 0, -35); B.deco('roca', -5, 0, -46); B.deco('roca', 15, 0, -59); B.deco('roca', 1, 0.4, -73);
  B.deco('chivo', -6, 0, -33, {ang: 1}); B.deco('chivo', 8, 0.4, -91, {ang: -2});
  return B.fin({nombre: 'Los Médanos de Coro', sub: 'Dunas, chivos y un sol que raja piedras', tema: {cielo: 'dia'}, vacio: -8,
    intro: [
      ['mollejuo', '¡Qué molleja de calor! Aquí hay más arena que en la playa de Caimare.'],
      ['primo', 'Pendiente con los chivos, primo, que esos embisten con la cabeza.'],
      ['salomon', '¡Épale! ¡Vamos pa\'l oasis!'],
    ],
    fin: [['primo', '¡Le ganamos al Chivo Cabezón! ¡Beeee!'], ['salomon', '¡Otra chispa pa\'l relámpago, vos!']]});
});

/* ---------------- 7 · EL PÁRAMO ----------------
   Sierra Nevada de Mérida: el pueblito, la rampa de nieve con bolas que
   ruedan, la laguna congelada con pingüinos, el teleférico y el pico más alto.
   · barajita 0: en el pico de roca junto a la laguna (3,2 m): el Primo
   · jaula 0 (osito): en la cueva de hielo, detrás de la pared rajada: el Mollejúo
   · jaula 1 (loro): en la caseta del teleférico; la abre la diana del cable: Salomón
   · barajita 1: en el poste de las cabinas que giran · barajita 2: debajo de la cumbre */
cargar(7, B=>{
  const nieve = (x, z, w, d, y, o)=>B.plat(x, z, w, d, y, Object.assign({mat: 'nieve', h: y + 3, redondo: 0.3}, o||{}));
  /* A · el pueblito andino (x −11…11, z 10…−14) */
  nieve(0, -2, 22, 24, 0, {h: 3});
  const colores = ['#ff8787', '#74c0fc', '#ffd43b', '#8ce99a'];
  B.plat(-8, 2, 5, 5, 2.2, {mat: 'casa', color: '#f8f9fa', h: 3.2}); B.deco('techo', -8, 2.2, 2, {w: 5, d: 5, color: '#c92a2a'});
  B.plat(8, 0, 5, 6, 2.2, {mat: 'casa', color: '#f8f9fa', h: 3.2}); B.deco('techo', 8, 2.2, 0, {w: 5, d: 6, color: '#c92a2a'});
  B.plat(-7.6, 6.5, 1.6, 1.6, 1.1, {mat: 'madera', h: 1.1});
  for (let k = 0; k < 4; k++){ B.deco('casa', k < 2 ? -15 : 15, 0, 6 - (k % 2)*9, {w: 5, d: 6, h: 3, color: colores[k]}); }
  B.deco('muneco', 3.5, 0, 3); B.deco('muneco', -4, 0, -10, {esc: 1.2});
  B.deco('letrero', 0, 0, -12.5, {texto: 'Mucubají ↑ · Teleférico ↑'});
  B.linea(0, 0, 4, 0, 0, -12, 6);
  B.linea(-8, 2.2, 3.5, -8, 2.2, 0.5, 2); B.linea(8, 2.2, 2, 8, 2.2, -2, 3);
  B.cocada(-8, 2.2, 1);
  B.caja(4, 0, -6, {corazon: true}); B.caja(-4, 0, -2);
  B.npc('vecino', 3, 0, 5, ['¡Épale, chamos! Bienvenidos al páramo. Allá arriba ruedan bolas de nieve por la rampa: ¡caminen por la orillita!',
    'En la laguna el hielo resbala. ¡Frenen con tiempo o se van de paseo!'], {nombre: 'Don Rigoberto'});
  B.inicio(0, 0, 7, 0);
  B.bandera(0, 0, 6);

  /* B · la rampa de nieve (escaloncitos de 0,3 m que se suben caminando) y las bolas que bajan */
  B.escalera(0, -14.5, 0, 16, 0, -1, 0.3, 6, 1, {mat: 'nieve', redondo: 0.05});
  B.peligro('rodante', {x0: 0, z0: -30, y0: 4.8, x1: 0, z1: -14, y1: 0, vel: 4.5, cada: 3, r: 0.8});
  B.zona('aviso', -3, 3, -16, -13, {texto: '¡Bolas de nieve! Sube por la orillita de la rampa'});
  B.linea(-2.2, 0.9, -16, -2.2, 4.2, -28, 6); B.linea(2.2, 0.9, -16, 2.2, 4.2, -28, 5);
  /* terrazas de frailejones a la izquierda */
  nieve(-7.5, -19, 8, 6, 1.8); nieve(-7.5, -26, 8, 6, 3.6);
  B.linea(-9, 1.8, -17, -6, 1.8, -21, 3); B.linea(-9, 3.6, -24, -6, 3.6, -28, 3);
  B.cocada(-10.5, 3.6, -28);
  B.enemigo('murcielago', -7, 5.5, -22, {ruta: 2.5});
  /* el pico de roca (8 m): la barajita del Primo */
  B.plat(7, -24, 3, 3, 8, {mat: 'roca', h: 12, redondo: 0.1});
  B.barajita(7, 8, -24);
  B.zona('aviso', 3.5, 11, -34, -30, {texto: '¡Una barajita en el pico de roca! El Primo Verde llega con el doble salto 👥', pj: 'primo', y: 4.8});

  /* C · la laguna congelada (Mucubají): orillas de nieve y hielo que resbala */
  nieve(0, -41, 26, 22, 4.8);
  B.plat(0, -42, 16, 14, 4.85, {mat: 'hielo', h: 0.3, redondo: 0.4});
  B.circulo(0, 4.85, -42, 5, 10);
  B.cocada(6.5, 4.85, -48);
  B.enemigo('pinguino', -3, 4.85, -39, {eje: 'x', ruta: 4});
  B.enemigo('pinguino', 3, 4.85, -45, {eje: 'x', ruta: 4});
  B.bandera(0, 4.8, -32);
  /* la cueva de hielo (izquierda): el osito está detrás de la pared rajada */
  nieve(-17, -42, 8, 10, 4.8);
  B.muro(-20.6, -42, 0.8, 9.2, 4.8, 3.2, {mat: 'roca'});
  B.muro(-17.6, -37.4, 6.8, 0.8, 4.8, 3.2, {mat: 'roca'}); B.muro(-17.6, -46.6, 6.8, 0.8, 4.8, 3.2, {mat: 'roca'});
  B.rajada(-14.6, -42, 0.8, 8.4, 4.8, 3.2);
  B.plat(-17.6, -42, 7.2, 10, 8.4, {mat: 'hielo', h: 0.4});
  B.jaula(-17.6, 4.8, -42, 'osito');
  B.deco('cristal', -19.6, 4.8, -39, {color: '#a5d8ff'}); B.deco('cristal', -19.6, 4.8, -45, {color: '#d0ebff'});
  B.zona('aviso', -14.2, -9, -46, -38, {texto: '¡El osito frontino está en la cueva! El panzazo del Mollejúo (B) tumba la pared rajada 👥', pj: 'mollejuo'});
  B.enemigo('murcielago', -11, 6.6, -48, {ruta: 2});
  B.cocada(-17.6, 8.4, -44);
  /* témpanos que se caen (izquierda del teleférico): una cocada escondida */
  B.cae(-8, -55, 2.4, 2.4, 5.4, {mat: 'hielo'}); B.cae(-8, -59, 2.4, 2.4, 6.0, {mat: 'hielo'});
  B.plat(-8, -63.5, 3, 3, 6.6, {mat: 'hielo', h: 0.8, redondo: 0.4});
  B.cocada(-8, 6.6, -64); B.linea(-8, 5.4, -55, -8, 6.0, -59, 2);
  /* las cabinas que giran alrededor del poste (derecha): la barajita está en el poste */
  nieve(17, -36, 8, 6, 4.8);
  for (let k = 0; k < 3; k++) B.movil(19, -45, 2.4, 2.4, 6, {r: 4, periodo: 9, fase: k*Math.PI*2/3}, {mat: 'metal'});
  B.plat(19, -45, 1.6, 1.6, 7.2, {mat: 'metal', h: 12});
  B.barajita(19, 7.2, -45);
  B.circulo(19, 6.2, -45, 4, 8);

  /* D · el teleférico: dos cabinas que van y vienen de la estación A a la B */
  nieve(0, -54, 4, 3, 6, {mat: 'roca'});
  B.plat(0, -59, 8, 6, 7.2, {mat: 'madera', h: 1.2});
  B.deco('letrero', -3, 7.2, -57, {texto: 'Teleférico Mukumbarí'});
  B.deco('poste', 3.8, 7.2, -61.5); B.deco('poste', -3.8, 7.2, -61.5);
  B.movil(-2.2, -64, 3.2, 3.2, 7.2, {dz: -18, dy: 4, periodo: 9}, {mat: 'metal'});
  B.movil(2.2, -64, 3.2, 3.2, 7.2, {dz: -18, dy: 4, periodo: 9, fase: Math.PI}, {mat: 'metal'});
  B.linea(-2.2, 7.6, -67, -2.2, 10.8, -81, 5); B.linea(2.2, 7.6, -67, 2.2, 10.8, -81, 5);
  B.enemigo('murcielago', 6, 9.5, -62, {ruta: 2.5});
  B.zona('aviso', -4, 4, -62, -56, {texto: '¡Súbete a la cabina del teleférico cuando llegue a la estación!', y: 7.2});

  /* E · la estación B (meseta a 11,2 m), la caseta del loro y la diana del cable */
  nieve(0, -90, 16, 12, 11.2);
  B.bandera(0.5, 11.2, -89);
  B.deco('poste', -3.8, 11.2, -84.6); B.deco('poste', 3.8, 11.2, -84.6);
  B.muro(-4.5, -89.6, 5.8, 0.8, 11.2, 3, {mat: 'madera'}); B.muro(-4.5, -94.4, 5.8, 0.8, 11.2, 3, {mat: 'madera'});
  B.muro(-7.4, -92, 0.8, 4, 11.2, 3, {mat: 'madera'});
  B.puerta(-1.6, -92, 0.8, 4, 11.2, 3, 'caseta');
  B.plat(-4.5, -92, 6.6, 5.6, 14.6, {mat: 'tablas', h: 0.4});
  B.jaula(-4.5, 11.2, -92, 'loro');
  B.diana(-14, 18.8, -90, 'caseta');
  B.deco('torre', -14, 7, -90, {esc: 0.8});
  B.zona('aviso', -1, 3, -95, -88, {texto: '¡El loro está en la caseta! La diana del cable se tumba con una pedrada de Salomón (B) 👥', pj: 'salomon', y: 11.2});
  B.peligro('rodante', {x0: -7.5, z0: -86.5, y0: 11.2, x1: 7.5, z1: -86.5, y1: 11.2, vel: 4, cada: 3.5, r: 0.7});
  B.enemigo('pinguino', 3, 11.2, -92.5, {eje: 'x', ruta: 3});
  B.circulo(3, 11.2, -91, 2.5, 6);
  B.cocada(6.5, 11.2, -95);
  B.npc('vecino', 5.5, 11.2, -89, ['¡Qué frío, vale! El loro se metió en la caseta y la puerta se trancó. La diana del cable la abre, pero hay que tener puntería.',
    'Pa\'l pico Bolívar se sigue por la otra cabina, la que va pa\'l lado de allá.'], {nombre: 'La señora Yajaira'});

  /* F · la segunda cabina (hacia +x) y la estación D */
  B.plat(12, -90, 6, 6, 12.6, {mat: 'madera', h: 1.4});
  B.movil(17, -90, 3, 3, 12.6, {dx: 14, dy: 4, periodo: 8}, {mat: 'metal'});
  B.linea(19, 13.3, -90, 29, 16, -90, 5);
  nieve(36, -90, 6, 8, 16.6);
  B.enemigo('pinguino', 36, 16.6, -88, {eje: 'x', ruta: 1.4});
  B.bandera(35, 16.6, -91);
  B.cocada(13.8, 12.6, -92);

  /* G · la rampa a la cumbre (con bolas de nieve) y el pico más alto */
  B.escalera(36, -94.5, 16.6, 12, 0, -1, 0.3, 6, 1, {mat: 'nieve', redondo: 0.05});
  B.peligro('rodante', {x0: 36, z0: -106, y0: 20.2, x1: 36, z1: -94, y1: 16.6, vel: 4, cada: 3.4, r: 0.7});
  B.linea(38, 17.4, -96, 38, 19.6, -104, 4); B.linea(34, 17.4, -96, 34, 19.6, -104, 4);
  nieve(36, -110, 10, 8, 20.2, {mat: 'nieve'});
  B.meta(36, 20.2, -111);
  B.deco('bandera', 38.5, 20.2, -112.5, {esc: 1.5, color: '#ffd43b'});
  B.deco('muneco', 33, 20.2, -112); B.circulo(36, 20.2, -110, 3, 8);
  B.cocada(32, 20.2, -113);
  B.enemigo('murcielago', 40, 22, -108, {ruta: 2});
  /* detrás de la cumbre, una repisa escondida con barajita */
  B.plat(36, -116, 4, 3, 18.6, {mat: 'roca', h: 1});
  B.barajita(36, 18.6, -116.5);

  /* adornos: frailejones, pinos, montañas, nubes */
  for (const [x, z, y] of [[-9, -17, 1.8], [-5, -21, 1.8], [-10, -24, 3.6], [-5, -27, 3.6], [-11, -34, 4.8], [11, -32, 4.8], [-11, -50, 4.8], [11, -50, 4.8], [-6, -33, 4.8], [9, -51, 4.8],
    [-6, -95, 11.2], [6, -85, 11.2], [38, -87, 16.6], [39, -107, 20.2], [-9, 8, 0], [9, 8, 0], [-2, -8, 0], [6, -11, 0]]) B.deco('frailejon', x, y, z, {esc: 0.9 + ((x*3 - z) & 3)*0.15});
  for (const [x, z] of [[-10.5, -3], [10.5, -8], [-10, 9], [10, 7]]) B.deco('pino', x, 0, z, {esc: 1.2});
  for (const [x, z] of [[20, -38], [-7, -51], [7, -34]]) B.deco('pino', x, 4.8, z);
  for (const [x, z, e] of [[-40, -60, 4], [40, -40, 3.5], [-35, -120, 5], [60, -110, 4], [10, -140, 5]]) B.deco('montana', x, -10, z, {esc: e});
  for (const [x, y, z] of [[-12, 14, -70], [12, 16, -75], [24, 22, -100], [-20, 20, -110], [48, 24, -95]]) B.deco('nube', x, y, z, {esc: 1.5});
  B.deco('muneco', -10, 4.8, -32); B.deco('muneco', 11, 4.8, -48, {esc: 0.8});
  B.deco('roca', 12, 4.8, -32); B.deco('roca', -2, 11.2, -95.5);
  return B.fin({nombre: 'El Páramo', sub: 'Nieve, frailejones y el teleférico más alto', tema: {cielo: 'nublado'}, vacio: -10,
    intro: [
      ['salomon', '¡Brrr! ¡Qué frío, primo! Esto no es Maracaibo ni de vaina.'],
      ['primo', 'Allá arriba está el pico más alto. ¡Nos vamos en teleférico, vos!'],
      ['mollejuo', 'Yo quiero una fresa con crema antes de subir...'],
    ],
    fin: [['salomon', '¡Llegamos al pico! ¡Se ve todo Mérida desde aquí!'], ['mollejuo', '¡Ahora sí me como mi fresa con crema!']]});
});

/* ---------------- 8 · EL TEPUY ----------------
   El Auyantepuy: se sube por las paredes, dando la vuelta al tepuy:
   repisas, nubes (algunas se caen), corrientes de aire que suben (chorros)
   y hongos-trampolín. Arriba, en la mesa del tepuy, el Zancudo Rey.
   · barajita 0: encima de la cueva de la base (2,3 m sobre la repisa): el Primo
   · jaula 0 (morrocoy): en la cueva, detrás de la pared rajada: el Mollejúo
   · jaula 1 (guacamaya): en la choza de la esquina NE; la abre la diana del cristal: Salomón
   · barajita 1: en el sombrero del hongo gigante · barajita 2: en la isla de nubes del oeste */
cargar(8, B=>{
  /* el tepuy: un bloque gigante de roca de 30 × 30 con la mesa a 44 m (x −15…15, z −45…−15) */
  B.plat(0, -30, 30, 30, 44, {mat: 'roca', h: 74, redondo: 0.05});
  const repisa = (x, z, w, d, y, o)=>B.plat(x, z, w, d, y, Object.assign({mat: 'roca', h: 1.2, redondo: 0.15}, o||{}));
  const nube = (x, z, w, d, y, cae)=>cae ? B.cae(x, z, w, d, y, {mat: 'nube', h: 0.6}) : B.plat(x, z, w, d, y, {mat: 'nube', h: 0.6, redondo: 0.45});

  /* A · la sabana de la base (x −18…18, z −15…23) */
  B.plat(0, 4, 36, 38, 0, {mat: 'pasto', h: 3, redondo: 0.2});
  B.inicio(0, 0, 16, 0);
  B.bandera(0, 0, 15);
  B.circulo(0, 0, 5, 4, 10);
  B.linea(-6, 0, 12, 6, 0, 12, 5);
  B.enemigo('iguana', 3, 0, -2, {eje: 'x', ruta: 5});
  B.enemigo('iguana', -8, 0, 8, {eje: 'z', ruta: 3});
  B.cocada(-15, 0, 20);
  /* el hongo gigante-trampolín con la barajita en el sombrero */
  B.trampolin(10, 0, 8, 17);
  B.deco('hongo', 10, 0, 8, {esc: 0.8});
  B.plat(13.5, 8, 4, 4, 5.2, {mat: 'tela', color: '#e03131', h: 0.8, redondo: 0.5});
  B.deco('hongo', 13.5, 0, 8, {esc: 2.4});
  B.barajita(13.5, 5.2, 8);
  B.linea(10, 1.5, 8, 10, 4.5, 8, 3);
  /* la cueva de la base: el morrocoy está detrás de la pared rajada; arriba de la cueva, la barajita del Primo */
  B.muro(-16.4, -12.8, 0.8, 4.4, 0, 3.2, {mat: 'roca'}); B.muro(-10.6, -12.8, 0.8, 4.4, 0, 3.2, {mat: 'roca'});
  B.rajada(-13.5, -10.6, 5, 0.8, 0, 3.2);
  B.plat(-13.5, -12.8, 6.6, 4.4, 3.6, {mat: 'roca', h: 0.4});
  B.jaula(-13.5, 0, -13, 'morrocoy');
  B.zona('aviso', -17, -10, -10.2, -6, {texto: '¡El morrocoy está en la cueva! El panzazo del Mollejúo (B) tumba la pared rajada 👥', pj: 'mollejuo'});
  /* la piedra alta de la sabana (3,4 m): la barajita del Primo */
  B.plat(-13, 15, 3, 3, 3.4, {mat: 'roca', h: 3.4, redondo: 0.15});
  B.barajita(-13, 3.4, 15);
  B.zona('aviso', -17, -9, 11, 19, {texto: '¡Una barajita arriba de la piedra! El doble salto del Primo llega 👥', pj: 'primo'});
  /* sombreritos de hongo con monedas y unas cajas */
  B.plat(14.5, -1, 2.6, 2.6, 1.2, {mat: 'tela', color: '#f59f00', h: 0.6, redondo: 0.5}); B.plat(14.5, -5, 2.6, 2.6, 2.2, {mat: 'tela', color: '#e8590c', h: 0.6, redondo: 0.5});
  B.plat(10.5, -6.5, 2.6, 2.6, 1.4, {mat: 'tela', color: '#f59f00', h: 0.6, redondo: 0.5});
  B.moneda(14.5, 1.2, -1); B.moneda(14.5, 2.2, -5); B.moneda(10.5, 1.4, -6.5);
  B.plat(-4, 18, 2, 2, 0.8, {mat: 'roca', h: 0.8, redondo: 0.4}); B.plat(6, 18.5, 2.4, 1.6, 0.6, {mat: 'roca', h: 0.6, redondo: 0.4}); B.plat(-16, 6, 2, 2, 1, {mat: 'roca', h: 1, redondo: 0.4});
  B.caja(-6, 0, 6); B.caja(6, 0, -4, {corazon: true});
  B.npc('vecino', -3, 0, 13, ['¡Épale! Soy el baquiano de la sabana. Al tepuy se sube dándole la vuelta por las repisas.',
    'Las corrientes de aire te suben como un ascensor: métete en el remolino y muévete pa\' la repisa de arriba.',
    'Las nubes blanquitas aguantan, pero las que tiemblan se caen. ¡Rapidito, vos!'], {nombre: 'El baquiano Yorman'});

  /* B · la cara sur: repisas que suben hacia el este */
  const sur = [[-6, 1.3], [-2, 2.6], [2, 3.9], [6, 5.2], [10, 6.5]];
  for (const [x, y] of sur){ repisa(x, -13.5, 3, 3, y); B.linea(x - 0.8, y, -13.5, x + 0.8, y, -13.5, 2); }
  B.enemigo('zancudo', 2, 6.5, -10, {ruta: 3});
  /* esquina sureste (descanso) */
  repisa(15.5, -12, 7, 6, 7.6);
  B.bandera(16, 7.6, -10.5);
  B.cocada(18, 7.6, -9.8);
  B.enemigo('iguana', 15.5, 7.6, -12, {eje: 'x', ruta: 2});

  /* C · la cara este: la primera corriente de aire y las nubes */
  repisa(17, -18, 4, 6, 7.6);
  B.peligro('chorro', {x: 17.2, y: 7.6, z: -19.5, r: 1.2, alto: 8, fuerza: 11});
  B.linea(17.2, 9, -19.5, 17.2, 15, -19.5, 5);
  B.zona('aviso', 15, 19, -21, -16, {texto: '¡Una corriente de aire! Métete y, arriba, muévete pa\' la repisa 🌪️', y: 7.6});
  repisa(16.8, -24, 3.6, 4.4, 16.2);
  nube(19.5, -29.6, 3, 3, 17.2); nube(23.3, -25, 2.6, 2.6, 17.6); B.cocada(23.3, 17.6, -25); nube(17.5, -34.5, 3, 3, 18.4, true); nube(19.5, -39, 3, 3, 19.6); nube(17.5, -43.5, 3, 3, 20.8, true);
  B.linea(19.5, 17.2, -29, 19.5, 17.2, -31, 2); B.linea(19.5, 19.6, -38, 19.5, 19.6, -40, 2);
  B.cocada(17.5, 18.4, -34.5);
  B.enemigo('zancudo', 23, 20, -36, {ruta: 2.5});

  /* D · la esquina noreste: la choza de la guacamaya (la abre la diana del cristal) */
  repisa(15.5, -50, 11, 9, 21.8);
  B.bandera(18, 21.8, -47);
  B.muro(10.4, -47.5, 0.8, 4.6, 21.8, 3, {mat: 'madera'});
  B.muro(12.7, -49.4, 5.4, 0.8, 21.8, 3, {mat: 'madera'});
  B.puerta(15, -47.3, 0.8, 3.8, 21.8, 3, 'choza');
  B.plat(12.7, -47.4, 5.6, 5, 25.2, {mat: 'tablas', h: 0.4});
  B.deco('techo', 12.7, 25.2, -47.4, {w: 5.6, d: 5, color: '#8f5c2c'});
  B.jaula(12.7, 21.8, -47.2, 'guacamaya');
  B.diana(26, 29, -52, 'choza');
  B.deco('cristal', 26, 27.4, -52, {color: '#be4bdb', esc: 1.4});
  B.zona('aviso', 15.4, 21, -50, -45.5, {texto: '¡La guacamaya está en la choza! Salomón le tira una pedrada (B) a la diana del cristal 👥', pj: 'salomon', y: 21.8});
  B.enemigo('iguana', 18, 21.8, -52.5, {eje: 'x', ruta: 1.8});
  B.circulo(17, 21.8, -51.5, 2, 6);
  B.cocada(20.5, 21.8, -54);

  /* E · la cara norte: hongo-trampolín, nube que va y viene y repisas hacia el oeste */
  B.trampolin(13, 21.8, -52.8, 17);
  B.deco('hongo', 13, 21.8, -52.8, {esc: 0.9});
  B.linea(13, 23.5, -52.8, 13, 26.5, -52.8, 3);
  repisa(7.5, -47, 4, 4, 26.2);
  B.movil(3.5, -47.5, 3, 3, 27, {dx: -8, periodo: 6}, {mat: 'nube', h: 0.6, redondo: 0.45});
  repisa(-10, -47, 5, 4, 28);
  B.linea(6.5, 26.2, -47, 8.5, 26.2, -47, 2); B.linea(3, 27.6, -47.5, -5, 27.6, -47.5, 4);
  B.cocada(-11.5, 28, -48);
  /* esquina noroeste (descanso) */
  repisa(-18, -49, 7, 7, 29.2);
  B.bandera(-18, 29.2, -50);
  B.enemigo('murcielago', -18, 31, -50, {ruta: 2});
  B.linea(-20, 29.2, -51, -16, 29.2, -51, 3);

  /* F · la cara oeste: la segunda corriente de aire y la escalera hasta la mesa */
  repisa(-17.5, -42.5, 4, 5, 29.2);
  B.peligro('chorro', {x: -17.5, y: 29.2, z: -42.5, r: 1.2, alto: 8, fuerza: 11});
  B.linea(-17.5, 30.5, -42.5, -17.5, 36.5, -42.5, 5);
  repisa(-17.1, -38.6, 3.8, 3.6, 38);
  const oeste = [[-33.5, 39.3], [-29.5, 40.6], [-25.5, 41.9], [-21.5, 43.1]];
  for (const [z, y] of oeste){ repisa(-17.1, z, 3.8, 3, y); B.moneda(-17.1, y, z); }
  B.enemigo('murcielago', -21, 41.5, -30, {ruta: 2});
  /* la isla de nubes del oeste (se caen: ¡rapidito!) */
  nube(-22.3, -33.5, 2.6, 2.6, 39.8, true); nube(-26.3, -33.5, 2.6, 2.6, 40.4, true);
  nube(-31, -33.5, 4, 4, 41);
  B.cocada(-31, 41, -32.3);
  B.barajita(-31, 41, -34);
  B.linea(-22.3, 40.2, -33.5, -26.3, 40.8, -33.5, 3);

  /* G · la mesa del tepuy: la arena del Zancudo Rey */
  B.jefe('zancudote', 0, 44, -30, {arena: 11, despierta: 12});
  B.bandera(-13, 44, -21);
  B.circulo(0, 44, -30, 8, 12);
  for (const [x, z, c] of [[-13.4, -43.4, '#74c0fc'], [13.4, -16.6, '#e599f7'], [13.4, -43.4, '#63e6be']]){ B.plat(x, z, 2, 2, 45.2, {mat: 'roca', h: 1.2, redondo: 0.3}); B.deco('cristal', x, 45.2, z, {color: c, esc: 1.2}); }
  B.cocada(13.4, 45.2, -43.4);
  B.deco('cristal', 13.5, 44, -30, {color: '#ffd43b'}); B.deco('cristal', -13.5, 44, -36, {color: '#e599f7'});
  B.deco('hongo', 12, 44, -17, {esc: 1.3}); B.deco('flores', -12, 44, -26); B.deco('flores', 12, 44, -36);

  /* adornos: cascadas por las paredes, nubes, tepuyes lejanos, selva abajo */
  B.deco('cascada', 5, 0, -14.9, {w: 3, h: 44}); B.deco('cascada', 15.1, 8, -30, {w: 2.5, h: 36, ang: Math.PI/2});
  B.deco('cascada', -5, 10, -45.1, {w: 3, h: 34, ang: Math.PI}); B.deco('cascada', -15.1, 20, -25, {w: 2, h: 24, ang: -Math.PI/2});
  for (const [x, z, e] of [[-60, -80, 1.6], [55, -90, 1.3], [-70, 10, 1.1], [70, 0, 1.4], [0, -120, 1.8]]) B.deco('tepuy', x, -20, z, {esc: e});
  for (const [x, y, z] of [[26, 12, -20], [-26, 18, -12], [24, 30, -60], [-28, 34, -55], [0, 36, -60], [30, 40, -30], [-8, 48, -8], [10, 50, -55], [-34, 26, -40], [28, 24, 0]]) B.deco('nube', x, y, z, {esc: 1.2 + ((x + z) & 3)*0.2});
  for (const [x, z] of [[-15, 12], [15, 18], [-12, 2], [16, -2], [-16, -4], [7, 20]]) B.deco('arbol', x, 0, z, {esc: 1.1});
  B.deco('ceiba', -9, 0, 19, {esc: 1.2}); B.deco('palmera', 12, 0, 20); B.deco('palmera', -16, 0, 16);
  for (const [x, z] of [[-5, 20], [4, 1], [-10, 0], [8, -8]]) B.deco('flores', x, 0, z);
  B.deco('hongo', -6, 0, -6, {esc: 1.2}); B.deco('hongo', 6, 0, 16, {esc: 0.7}); B.deco('hongo', -16, 0, -1, {esc: 1.5});
  B.deco('roca', -16, 0, 22); B.deco('roca', 16, 0, 10);
  B.deco('cristal', 18.5, 7.6, -14.5, {color: '#e599f7'}); B.deco('cristal', 18.6, 16.2, -25.5, {color: '#74c0fc'});
  B.deco('cristal', -20.5, 29.2, -52, {color: '#63e6be'}); B.deco('cristal', -18.6, 38, -40, {color: '#ffd43b'});
  B.deco('letrero', 3, 0, -9, {texto: 'Auyantepuy ↑'});
  return B.fin({nombre: 'El Tepuy', sub: 'Pa\'rriba por las paredes del Auyantepuy', tema: {cielo: 'dia'}, vacio: -15,
    intro: [
      ['chinita', 'Una chispa grande quedó arriba del Auyantepuy, y el Zancudo Rey la está cuidando.'],
      ['primo', '¡Primo, eso es altísimo! Se sube dándole la vuelta por las paredes.'],
      ['salomon', '¡Pa\'rriba es pa\'llá! ¡Vámonos!'],
    ],
    fin: [['salomon', '¡Le ganamos al Zancudo Rey! ¡Qué molleja de vista, primo!'], ['mollejuo', 'Ahora... ¿cómo bajamos de aquí?']]});
});

if (typeof module !== 'undefined' && module.exports) module.exports = L;
})(typeof window !== 'undefined' ? window : globalThis);
