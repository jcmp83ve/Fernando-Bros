(function(raiz){
'use strict';
/* ============================================================
   NIVELES 2 a 5: EL PUENTE · LOS PALAFITOS · LAS PULGAS · LA VEREDA DE NOCHE
   (las reglas de diseño están arriba de niveles.js)
   ============================================================ */
const L = raiz.SALO_NIVELES = raiz.SALO_NIVELES || [];
const cargar = (n, f)=>{ L[n] = f; };

/* ---------------- 2 · EL PUENTE SOBRE EL LAGO ----------------
   Un puente larguísimo con carros. Arriba: aceras con obras que obligan a
   cruzar la carretera, dos torres con ascensor de mantenimiento y una
   pasarela con ventarrón. Abajo: vigas y andamios con monedas, cocadas y el
   cuartito de la pared rajada. Al final, el peaje: la talanquera se abre con
   una pedrada de Salomón al botón del letrero. */
cargar(2, B=>{
  const Y = 5, ACERA = 5.3;
  /* la orilla del comienzo */
  B.plat(0, 58, 30, 18, 0, {mat: 'pasto', h: 3});
  B.plat(0, 57, 8, 14, 0.1, {mat: 'adoquin', h: 0.4});
  /* la rampa del puente (escaloncitos que se suben caminando) */
  B.escalera(0, 49.5, 0.1, 14, 0, -1, 0.35, 10, 1, {mat: 'asfalto'});
  /* el puente: carretera, aceras, barreras de las puntas y pilotes */
  B.plat(0, -5.5, 14, 83, Y, {mat: 'asfalto', h: 1.2});
  B.plat(-5.25, -5.5, 3.5, 83, ACERA, {mat: 'adoquin', h: 0.3});
  B.plat(5.25, -5.5, 3.5, 83, ACERA, {mat: 'adoquin', h: 0.3});
  B.muro(0, 34, 7, 0.6, Y, 1.1, {mat: 'metal'});
  B.muro(0, -45, 7, 0.6, Y, 1.1, {mat: 'metal'});
  for (const z of [26, 2, -40]) B.muro(0, z, 5, 3, -1, 4.8, {mat: 'piedra'});
  B.peligro('carros', {z0: -42, z1: 31, y: Y, carriles: [{x: -1.8, v: 6, n: 3}, {x: 1.8, v: -7, n: 3}]});
  /* barandas con huecos (para bajar a las vigas y subir a los ascensores) */
  const baranda = (x, za, zb)=>B.muro(x, (za + zb)/2, 0.5, Math.abs(zb - za), Y, 1.1, {mat: 'metal'});
  baranda(-7.25, 26, 36); baranda(-7.25, -4, 22); baranda(-7.25, -36, -8); baranda(-7.25, -43, -40);
  baranda(7.25, -4, 36); baranda(7.25, -26, -8); baranda(7.25, -43, -30);
  /* el pórtico del letrero: solo el Primo llega (desde la baranda, con doble salto) */
  B.plat(0, 14, 15, 2.6, 8.8, {mat: 'metal', h: 0.5});
  B.muro(-7.25, 14, 0.5, 0.8, 6.1, 2.2, {mat: 'metal'}); B.muro(7.25, 14, 0.5, 0.8, 6.1, 2.2, {mat: 'metal'});
  B.barajita(-5, 8.8, 14);
  B.linea(-2, 8.8, 14, 6, 8.8, 14, 5);
  B.zona('aviso', -7, 7, 12, 19, {texto: '¡Hay una barajita en el letrero alto! Solo el Primo Verde llega con doble salto 👥', pj: 'primo', y: ACERA});
  /* obras en las aceras: hay que cruzar la carretera (o treparse por la baranda) */
  B.muro(-5.25, 1, 3.5, 3, ACERA, 2.4, {mat: 'ladrillo'});
  B.muro(5.25, -18, 3.5, 3, ACERA, 2.4, {mat: 'ladrillo'});
  B.linea(-5.25, 7.7, 0, -5.25, 7.7, 2, 2);
  B.cocada(5.25, 7.7, -18);
  /* las dos torres: pilón, descanso y ascensor de mantenimiento */
  for (const s of [-1, 1]){
    B.muro(13.6*s, -8, 4, 8, -1, 14.5, {mat: 'piedra'});
    B.plat(8.1*s, -6, 2.2, 4, Y, {mat: 'madera', h: 0.5});
    B.movil(10.3*s, -6, 2.2, 2.6, Y, {dy: 7.8, periodo: 9, fase: s > 0 ? Math.PI : 0}, {mat: 'metal'});
  }
  /* la pasarela de arriba, de torre a torre, con ventarrón */
  B.plat(0, -10.5, 23.2, 2, 13.5, {mat: 'metal', h: 0.4});
  B.zona('viento', -11, 11, -12.5, -8.8, {fz: 2, periodo: 5, dura: 1.5});
  B.linea(-9, 13.5, -10.5, -3, 13.5, -10.5, 3); B.linea(3, 13.5, -10.5, 9, 13.5, -10.5, 3);
  B.cocada(0, 13.5, -10.5);
  B.cocada(-13.6, 13.5, -8); B.circulo(-13.6, 13.5, -8, 1.3, 5);
  B.jaula(13.6, 13.5, -8, 'pelicano');
  /* ---- por debajo del puente: vigas y andamios ---- */
  B.plat(-8.6, 24, 3.2, 4, 3.4, {mat: 'madera', h: 0.5});
  B.plat(-9, 14.5, 2, 13, 1.5, {mat: 'metal', h: 0.6});
  B.cae(-9, 5.2, 2, 2, 1.5); B.cae(-9, 1.4, 2, 2, 1.5);
  B.plat(-9, -17.7, 2, 32.6, 1.5, {mat: 'metal', h: 0.6});
  B.plat(0, -20, 16, 2, 1.5, {mat: 'metal', h: 0.6});
  B.plat(12, -20, 8, 12, 1.5, {mat: 'tablas', h: 0.6});
  B.linea(-9, 1.5, 20, -9, 1.5, 11, 5); B.cocada(-9, 1.5, 9);
  B.linea(-9, 1.5, 5.2, -9, 1.5, 1.4, 2);
  B.linea(-9, 1.5, -3, -9, 1.5, -12, 4);
  B.linea(-6, 1.5, -20, -1, 1.5, -20, 4); B.cocada(1.5, 1.5, -20); B.linea(3.5, 1.5, -20, 6.5, 1.5, -20, 2);
  /* el cuartito de los pintores: pared rajada (panzazo del Mollejúo) y la guacamaya adentro */
  B.muro(12.5, -17.2, 6.2, 0.6, 1.5, 3, {mat: 'casa', color: '#4dabf7'});
  B.muro(12.5, -22.8, 6.2, 0.6, 1.5, 3, {mat: 'casa', color: '#4dabf7'});
  B.muro(15.3, -20, 0.6, 5, 1.5, 3, {mat: 'casa', color: '#4dabf7'});
  B.rajada(9.7, -20, 0.6, 5, 1.5, 3);
  B.plat(12.5, -20, 6.6, 6.6, 4.9, {mat: 'tablas', h: 0.4});
  B.linea(10.5, 4.9, -20, 14.5, 4.9, -20, 3);
  B.jaula(12.5, 1.5, -20, 'guacamaya');
  B.zona('aviso', 8, 10.5, -23, -17, {texto: '¡Una pared rajada! El panzazo del Mollejúo (B) la tumba 👥', pj: 'mollejuo', y: 1.5});
  /* andamios para volver a subir (derecha) */
  B.plat(12.2, -27.5, 3, 3, 2.7, {mat: 'madera', h: 0.5});
  B.plat(9.7, -29, 2, 2, 3.9, {mat: 'madera', h: 0.5});
  B.plat(7.9, -27.5, 1.6, 3, 5.1, {mat: 'madera', h: 0.5});
  /* la islita de las rocas con la barajita (tablones que se caen) */
  B.cae(-12.8, -33, 2, 2, 1.5); B.cae(-16.6, -33, 2, 2, 1.5);
  B.plat(-21, -33, 5, 5, 1.2, {mat: 'roca', h: 3});
  B.barajita(-21, 1.2, -33); B.circulo(-21, 1.2, -33, 1.7, 6);
  /* andamios para volver a subir (izquierda) */
  B.plat(-9, -35.5, 2, 3, 2.7, {mat: 'madera', h: 0.5});
  B.plat(-10, -38.5, 2, 3, 3.9, {mat: 'madera', h: 0.5});
  B.plat(-8, -38.5, 1.8, 3, 5.1, {mat: 'madera', h: 0.5});
  /* ventarrón en la acera izquierda (empuja hacia los carros) */
  B.zona('viento', -7, -3.5, -34, -22, {fx: 2.2, periodo: 4.5, dura: 1.5});
  /* ---- el peaje ---- */
  B.plat(0, -58, 30, 22, Y, {mat: 'asfalto', h: 7});
  B.muro(-8, -54, 3, 2, Y, 4.4, {mat: 'casa', color: '#ffd43b'});
  B.muro(0, -54, 3, 2, Y, 4.4, {mat: 'casa', color: '#ff6b6b'});
  B.muro(8, -54, 3, 2, Y, 4.4, {mat: 'casa', color: '#4dabf7'});
  B.muro(-12.25, -54, 5.5, 2, Y, 4.4, {mat: 'ladrillo'}); B.muro(12.25, -54, 5.5, 2, Y, 4.4, {mat: 'ladrillo'});
  B.puerta(-4, -54, 5, 1, Y, 4.4, 'peaje'); B.puerta(4, -54, 5, 1, Y, 4.4, 'peaje');
  B.plat(0, -54, 30, 5, 10, {mat: 'metal', h: 0.6});
  B.diana(0, 12.3, -51.2, 'peaje');
  B.zona('aviso', -15, 15, -51, -46, {texto: '¡La talanquera está trancada! Salomón le da una pedrada (B) al botón del letrero 👥', pj: 'salomon', y: Y});
  B.plat(0, -63, 4, 4, 5.3, {mat: 'oro', h: 0.3});
  B.meta(0, 5.3, -63);
  B.barajita(12, Y, -66); B.cocada(13, Y, -49);
  B.circulo(0, Y, -63, 3.2, 6); B.linea(-10, Y, -66, -4, Y, -66, 3);
  B.arco(-10, -49, 10, -49, Y, 1.2, 6);
  /* monedas del camino */
  B.circulo(0, 0.1, 55, 3, 8);
  B.linea(0, 1.0, 48, 0, 4.5, 38, 6);
  B.linea(-5.25, ACERA, 30, -5.25, ACERA, 6, 7);
  B.linea(5.25, ACERA, 28, 5.25, ACERA, 8, 5);
  B.arco(-5, 8, 5, 8, ACERA, 1.5, 5);
  B.cocada(0, Y, -28);
  B.cocada(-13, 0, 63);
  /* enemigos */
  B.enemigo('cangrejo', -9, 0, 55, {eje: 'x', ruta: 3});
  B.enemigo('cangrejo', 9, 0, 53, {eje: 'x', ruta: 3});
  B.enemigo('iguana', -5.25, ACERA, 18, {eje: 'z', ruta: 3.5});
  B.enemigo('iguana', 5.25, ACERA, -36, {eje: 'z', ruta: 4});
  B.enemigo('nubecita', 0, 15, -10.5, {ruta: 3});
  B.enemigo('cangrejo', -9, 1.5, -14, {eje: 'z', ruta: 4});
  B.enemigo('cangrejo', 12, 1.5, -25, {eje: 'x', ruta: 2.5});
  B.enemigo('nubecita', -21, 3.5, -33, {ruta: 2.5});
  B.enemigo('zancudo', 6, 6.8, -50, {ruta: 3});
  /* banderas */
  B.inicio(0, 0.1, 62, 0);
  B.bandera(0, 0.1, 61); B.bandera(-5.25, ACERA, 31); B.bandera(5.25, ACERA, -1); B.bandera(0, Y, -49);
  /* vecinos */
  B.npc('vecino', 3, 0.1, 58, ['¡Épale, muchachos! Por el puente los carros pasan a millón: crucen cuando no venga ninguno.', 'Por debajo del puente hay vigas con cocadas. ¡Se baja por el hueco de la baranda!'], {nombre: 'Don Hermes'});
  B.npc('vecino', 5.25, ACERA, -10, ['Ese ascensor sube hasta la torre. Arriba sopla un ventarrón: ¡caminen contra el viento!', 'Dicen que en la torre de allá hay un pelícano encerrado, primo.'], {nombre: 'La señora Yajaira'});
  B.npc('vecino', -6, Y, -49, ['La talanquera está trancada, vos. ¡Dale una pedrada al botón del letrero con Salomón!', 'Aquí se paga peaje... ¡pero a ustedes los dejo pasar gratis, qué molleja!'], {nombre: 'El señor Wilmer'});
  /* adornos */
  for (const [x, z, e] of [[-12, 52, 1], [12, 52, 1.1], [-13, 65, 0.9], [13, 64, 1], [-8, 66, 1.2], [8, 66, 0.9]]) B.deco('palmera', x, 0, z, {esc: e});
  B.deco('letrero', 6, 0.1, 50.5, {texto: 'Puente sobre el Lago'});
  B.deco('tienda', 10, 0, 60, {color: '#ff922b', ang: -Math.PI/2});
  B.deco('flores', -6, 0, 52); B.deco('flores', 6, 0, 54); B.deco('farol', -4.5, 0.1, 57); B.deco('farol', 4.5, 0.1, 57);
  for (const z of [32, 20, 8, -14, -24, -34, -44]){ B.deco('farol', -6.8, ACERA, z); B.deco('farol', 6.8, ACERA, z); }
  B.deco('cerca', -5.25, ACERA, 3.2, {w: 3.5}); B.deco('letrero', -5.25, ACERA, 4.2, {texto: '¡OBRAS! Cruce con cuidado'});
  B.deco('cerca', 5.25, ACERA, -15.8, {w: 3.5}); B.deco('letrero', 5.25, ACERA, -15, {texto: '¡OBRAS!'});
  B.deco('grua', -14, -1, 1, {esc: 0.8});
  B.deco('letrero', 0, 8.8, 14.6, {texto: 'MARACAIBO →'});
  for (const [x, z] of [[-40, 20], [45, -10], [-50, -40], [38, 40], [-35, 60], [55, 25]]) B.deco('torre', x, -1, z);
  B.deco('bote', 35, -1, -30, {ang: 1.2, color: '#1c7ed6'}); B.deco('bote', -45, -1, -5, {ang: -0.4, color: '#f08c00'});
  B.deco('bote', -20, -1, 40, {ang: 0.5}); B.deco('bote', 18, -1, 30, {ang: 2}); B.deco('bote', 24, -1, -45, {ang: 1});
  B.deco('puente', -160, -1, -60, {esc: 2, ang: Math.PI/2});
  B.deco('bandera', 13.6, 13.5, -5.5); B.deco('bandera', -13.6, 13.5, -5.5); B.deco('farol', -14.5, 13.5, -11); B.deco('farol', 14.5, 13.5, -11);
  B.deco('barril', -9, 1.5, -30); B.deco('barril', 14.5, 1.5, -15); B.deco('barril', 10.5, 1.5, -24.5);
  B.deco('ancla', -22.8, 1.2, -34.8); B.deco('faro', -22.5, 1.2, -31.2, {esc: 0.45});
  B.deco('letrero', 0, 10, -52.3, {texto: 'PEAJE'});
  B.deco('bandera', -14, Y, -48); B.deco('bandera', 14, Y, -47.5); B.deco('bandera', 0, Y, -68);
  for (const [x, z] of [[-13, -50], [13, -68], [-13, -68]]) B.deco('palmera', x, Y, z);
  B.deco('farol', -10, Y, -62); B.deco('farol', 10, Y, -62); B.deco('flores', -4, Y, -67.5); B.deco('flores', 4, Y, -67.5);
  return B.fin({nombre: 'El Puente sobre el Lago', sub: 'Carros, ventarrones y un peaje', tema: {cielo: 'tarde'}, agua: -1,
    intro: [
      ['primo', '¡Mira ese puente, primo! Es larguísimo...'],
      ['mollejuo', '¿Y del otro lado venden tequeños?'],
      ['salomon', '¡Pendiente con los carros! ¡Vamos pa\'l otro lado!'],
    ],
    fin: [['mollejuo', '¡Crucé el puente sin caerme al lago! ¡Qué molleja!']]});
});

/* ---------------- 3 · LOS PALAFITOS DE SANTA ROSA DE AGUA ----------------
   Casas sobre el lago unidas por tablas. Tablones viejos que se caen, lanchas
   que van y vienen, islitas de mangle con cangrejos, una bodega que se abre con
   una pedrada a la diana del poste y un depósito de redes con pared rajada.
   Al final, en la plaza de tablas, espera el Cangrejote. */
cargar(3, B=>{
  const Y = 1.2;
  const casa = (x, z, w, d, color)=>{ B.plat(x, z, w, d, Y + 2.6, {mat: 'casa', color, h: 2.6, redondo: 0.08}); B.deco('techo', x, Y + 2.6, z, {w, d, color: '#e9ecef'}); };
  /* la orilla y la primera pasarela */
  B.plat(0, 60, 26, 12, Y, {mat: 'arena', h: 3});
  B.plat(0, 47.5, 2.6, 13, Y, {mat: 'tablas', h: 0.5});
  /* A · la casa de la señora Nereida (se sube al techo por un barril) */
  B.plat(0, 36, 14, 10, Y, {mat: 'tablas', h: 0.6});
  casa(4, 37, 5, 4, '#ff6b6b');
  B.plat(0.4, 38, 1.2, 1.4, 2.5, {mat: 'madera', h: 1.3});
  B.cocada(4.5, 3.8, 37.6); B.linea(2.5, 3.8, 36, 6, 3.8, 36, 3);
  /* tablones que se caen: de A a B */
  B.cae(0, 28.5, 2.2, 2, Y); B.cae(0, 25, 2.2, 2, Y); B.cae(0, 21.5, 2.2, 2, Y);
  B.linea(0, Y, 28.5, 0, Y, 21.5, 3);
  /* camino de los mangles (a la izquierda): M1 → tablones → M2 → B */
  B.plat(-11.5, 36, 9, 2.2, Y, {mat: 'tablas', h: 0.5});
  B.plat(-20, 36, 8, 8, Y, {mat: 'lodo', h: 0.6});
  B.cae(-20, 29.2, 2, 2, Y); B.cae(-20, 25.4, 2, 2, Y);
  B.plat(-20, 18.6, 6, 8, Y, {mat: 'lodo', h: 0.6});
  B.plat(-12.5, 16, 9, 2.2, Y, {mat: 'tablas', h: 0.5});
  B.jaula(-20, Y, 18, 'delfin');
  B.cocada(-22.8, Y, 33);
  /* B · la casa alta con el tanque (el tanque solo lo alcanza el Primo) */
  B.plat(0, 13, 16, 12, Y, {mat: 'tablas', h: 0.6});
  casa(-4, 11, 6, 5, '#ffd43b');
  B.plat(-4, 15, 1.4, 1.2, 2.5, {mat: 'madera', h: 1.3});
  B.muro(-5.5, 10, 0.5, 0.5, 3.8, 2.8, {mat: 'metal'});
  B.plat(-5.5, 10, 2.2, 2.2, 7.0, {mat: 'metal', h: 0.4});
  B.barajita(-5.5, 7.0, 10);
  B.cocada(-2.5, 3.8, 11); B.linea(-6, 3.8, 12.8, -2, 3.8, 12.8, 3);
  B.zona('aviso', -8, -0.5, 8, 14, {texto: '¡Arriba del tanque hay una barajita! El Primo Verde llega con doble salto 👥', pj: 'primo', y: 3.8});
  /* las lanchas del canal (B → C) y la del este (B → la islita) */
  B.movil(-3, 3.5, 3, 4, 0.6, {dz: -8, periodo: 8}, {mat: 'madera'});
  B.movil(3, 3.5, 3, 4, 0.6, {dz: -8, periodo: 8, fase: Math.PI}, {mat: 'madera'});
  B.linea(-3, 0.6, 4, -3, 0.6, -4, 3); B.linea(3, 0.6, 4, 3, 0.6, -4, 3);
  B.movil(11, 13, 3, 4, 0.6, {dx: 10, periodo: 8}, {mat: 'madera'});
  B.linea(13, 0.6, 13, 19, 0.6, 13, 2);
  B.plat(27, 13, 6, 6, Y, {mat: 'arena', h: 2});
  B.barajita(27, Y, 13); B.circulo(27, Y, 13, 2, 6); B.cocada(29.3, Y, 10.6);
  /* C · el muelle del pescador, con la bodega (se abre con la diana del poste) */
  B.plat(0, -14, 18, 12, Y, {mat: 'tablas', h: 0.6});
  B.muro(-8.7, -14, 0.6, 6, Y, 3, {mat: 'casa', color: '#69db7c'});
  B.muro(-6, -11.3, 6, 0.6, Y, 3, {mat: 'casa', color: '#69db7c'});
  B.muro(-6, -16.7, 6, 0.6, Y, 3, {mat: 'casa', color: '#69db7c'});
  B.muro(-3.3, -15.7, 0.6, 1.4, Y, 3, {mat: 'casa', color: '#69db7c'});
  B.muro(-3.3, -12.3, 0.6, 1.4, Y, 3, {mat: 'casa', color: '#69db7c'});
  B.puerta(-3.3, -14, 0.6, 2, Y, 3, 'bodega');
  B.plat(-6, -14, 6.4, 6.4, 4.6, {mat: 'tablas', h: 0.4});
  B.barajita(-6, Y, -14); B.linea(-7.5, Y, -12.5, -7.5, Y, -15.5, 2);
  B.diana(-17, 5.3, -4, 'bodega');
  B.zona('aviso', -9, 1, -11, -7.5, {texto: '¡La diana del poste abre la bodega! Salomón le da una pedrada (B) 👥', pj: 'salomon', y: Y});
  B.linea(0, Y, -9, 8, Y, -9, 4); B.cocada(6, Y, -18);
  /* D · el depósito de redes: pared rajada y el cangrejito adentro */
  B.plat(11, -14, 4, 2.4, Y, {mat: 'tablas', h: 0.5});
  B.linea(10, Y, -14, 12, Y, -14, 2);
  B.plat(18, -14, 10, 10, Y, {mat: 'tablas', h: 0.6});
  B.muro(19, -11.2, 6.2, 0.6, Y, 3, {mat: 'casa', color: '#9775fa'});
  B.muro(19, -16.8, 6.2, 0.6, Y, 3, {mat: 'casa', color: '#9775fa'});
  B.muro(21.8, -14, 0.6, 5, Y, 3, {mat: 'casa', color: '#9775fa'});
  B.rajada(16.2, -14, 0.6, 5, Y, 3);
  B.plat(19, -14, 6.6, 6.6, 4.6, {mat: 'tablas', h: 0.4});
  B.linea(17, 4.6, -14, 21, 4.6, -14, 3);
  B.jaula(19, Y, -14, 'cangrejito');
  B.zona('aviso', 13, 16, -17, -11, {texto: '¡Una pared rajada! El panzazo del Mollejúo (B) la tumba 👥', pj: 'mollejuo', y: Y});
  /* pilotes para brincar hasta la islita de mangle E */
  B.plat(1.5, -22.4, 1.6, 1.6, Y, {mat: 'madera', h: 2.5});
  B.plat(-1.5, -25.4, 1.6, 1.6, Y, {mat: 'madera', h: 2.5});
  B.plat(1.5, -28.4, 1.6, 1.6, Y, {mat: 'madera', h: 2.5});
  B.moneda(1.5, Y, -22.4); B.cocada(-1.5, Y, -25.4); B.moneda(1.5, Y, -28.4);
  B.plat(0, -36, 16, 10, Y, {mat: 'lodo', h: 0.6});
  B.circulo(0, Y, -36, 3, 6); B.cocada(-6, Y, -39.5);
  B.plat(0, -42.5, 4, 3, Y, {mat: 'tablas', h: 0.5});
  /* la plaza de tablas del Cangrejote: sin huecos, con pilotes alrededor donde se estrella */
  B.plat(0, -59, 30, 30, 1.5, {mat: 'tablas', h: 1.5});
  for (let i = 0; i < 16; i++){
    if (i === 4) continue;
    const a = i/16*Math.PI*2;
    B.plat(Math.cos(a)*12.8, -60 + Math.sin(a)*12.8, 0.8, 0.8, 2.7, {mat: 'madera', h: 1.2});
  }
  B.circulo(0, 1.5, -60, 6, 5);
  B.jefe('cangrejote', 0, 1.5, -60, {arena: 10, despierta: 14, y0: 1.5});
  /* monedas del camino */
  B.linea(-8, Y, 57, -5, Y, 57, 2); B.linea(5, Y, 57, 8, Y, 57, 2);
  B.linea(0, Y, 52, 0, Y, 43, 5);
  B.linea(-5, Y, 39, -2, Y, 39, 2);
  B.linea(-9, Y, 36, -15, Y, 36, 3);
  B.circulo(-20, Y, 36, 2.5, 6);
  B.linea(-20, Y, 29.2, -20, Y, 25.4, 2);
  B.linea(-22, Y, 21, -18, Y, 21, 2);
  B.linea(-16, Y, 16, -9, Y, 16, 3);
  B.circulo(3, Y, 13, 2.5, 6);
  B.cocada(-11, Y, 64);
  /* enemigos */
  B.enemigo('iguana', 8, Y, 59, {eje: 'z', ruta: 3});
  B.enemigo('cangrejo', -3, Y, 33, {eje: 'x', ruta: 2.5});
  B.enemigo('cangrejo', -20, Y, 36, {eje: 'z', ruta: 2.5});
  B.enemigo('cangrejo', 3, Y, 9, {eje: 'x', ruta: 3});
  B.enemigo('zancudo', 0, 3, 0, {ruta: 3});
  B.enemigo('cangrejo', 4, Y, -17, {eje: 'x', ruta: 3});
  B.enemigo('zancudo', 18, 3.5, -5, {ruta: 2});
  B.enemigo('cangrejo', -4, Y, -37, {eje: 'x', ruta: 3});
  B.enemigo('cangrejo', 4, Y, -34, {eje: 'x', ruta: 3});
  B.enemigo('nubecita', 27, 4, 13, {ruta: 2});
  /* banderas */
  B.inicio(0, Y, 62, 0);
  B.bandera(0, Y, 61); B.bandera(4, Y, 17); B.bandera(2, Y, -10); B.bandera(0, Y, -32.5);
  /* vecinos */
  B.npc('vecino', -4, Y, 58.5, ['¡Bienvenidos a Santa Rosa de Agua, mis niños! Aquí las casas están paradas encima del lago.', 'Los tablones viejos se caen si te quedas parado encima. ¡Corre, corre!'], {nombre: 'Doña Nereida'});
  B.npc('vecino', 6, Y, -11, ['Las lanchas van y vienen. Espérenla en la orilla y se montan de un brinco.', 'Esa diana del poste abre mi bodega, pero solo Salomón tiene tan buena puntería.'], {nombre: 'El pescador Chuíto'});
  B.npc('vecino', 5, Y, -39, ['El Cangrejote embiste derechito. Hazte a un lado, y cuando se estrelle contra los pilotes... ¡písalo!'], {nombre: 'La señora Ninoska'});
  /* adornos */
  const colores = ['#ff6b6b', '#ffd43b', '#4dabf7', '#69db7c', '#f783ac', '#ffa94d', '#9775fa', '#38d9a9'];
  [[-30, 50], [18, 45], [22, 30], [-32, 20], [-30, 0], [32, -2], [-25, -25], [25, -30], [-24, -48], [24, -52], [-34, 38], [34, 18]]
    .forEach(([x, z], i)=>B.deco('palafito', x, 0, z, {w: 5 + i % 3, d: 5, h: 3, color: colores[i % 8], ang: i*0.7}));
  for (const [x, z] of [[-26, 30], [-25, 42], [-15, 42], [-24, 24], [-16, 12], [-25, 14], [-10, -30], [10, -30], [-10, -38], [10, -40], [-7, -46], [9, -45], [16, 40], [15, 57], [-15, 55], [-9, -43]]) B.deco('mangle', x, 0, z);
  B.deco('mangle', -23, Y, 38.5); B.deco('mangle', -17.5, Y, 15.5); B.deco('mangle', 6.5, Y, -32); B.deco('mangle', -6.5, Y, -32);
  for (const [x, z] of [[-11, 58], [11, 63], [-8, 64.5], [8, 55]]) B.deco('palmera', x, Y, z);
  B.deco('palmera', 29, Y, 15.5, {esc: 0.8});
  B.deco('bote', 8, 0, 42, {ang: 0.3}); B.deco('bote', -11, 0, 4, {ang: 1.4}); B.deco('bote', 13, 0, -1, {ang: -0.6}); B.deco('bote', -13, 0, -48, {ang: 2.2});
  B.deco('bote', -45, 0, -15, {ang: 0.8, color: '#1c7ed6'}); B.deco('bote', 48, 0, 30, {ang: -1, color: '#f08c00'});
  B.deco('poste', -17, 0, -4); B.deco('letrero', -7.5, Y, -8.7, {texto: '¡Puntería! →'});
  B.deco('letrero', 3, Y, 55, {texto: 'Santa Rosa de Agua'});
  B.deco('letrero', 2.5, Y, -41.5, {texto: '¡Cuidado con el Cangrejote!'});
  B.deco('techo', -6, 4.6, -14, {w: 6.4, d: 6.4, color: '#2b8a3e'}); B.deco('techo', 19, 4.6, -14, {w: 6.6, d: 6.6, color: '#5f3dc4'});
  B.deco('farol', 6.5, Y, 40.5); B.deco('farol', -6.5, Y, 40.5); B.deco('farol', 7.5, Y, 18.5); B.deco('farol', -8.5, Y, -8.5); B.deco('farol', 8.5, Y, -19.5); B.deco('farol', 22.5, Y, -9.5);
  B.deco('barril', 7.5, Y, -19); B.deco('barril', 14, Y, -18.5); B.deco('barril', -7, Y, 7.5); B.deco('ancla', 7, Y, -8.5);
  B.deco('flores', -1, Y, 35.5); B.deco('flores', 1.5, Y, 8); B.deco('cerca', 0, Y, 31.3, {w: 5});
  B.deco('bandera', -14.5, 1.5, -45); B.deco('bandera', 14.5, 1.5, -45);
  B.deco('tanque', -5.5, 7.0, 8.4, {esc: 0.45});
  return B.fin({nombre: 'Los Palafitos de Santa Rosa', sub: 'Casas sobre el agua y un cangrejo gigante', tema: {cielo: 'dia'}, agua: 0,
    intro: [
      ['salomon', '¡Épale! Estas casitas están paradas encima del agua.'],
      ['mollejuo', 'Huele a pescado frito... ¡tengo hambre, vale!'],
      ['primo', 'Dicen que por aquí vive un cangrejo gigantesco... ¡qué miedo, primo!'],
    ],
    fin: [['primo', '¡Le ganamos al Cangrejote! ¡Ni tanto miedo que daba!'], ['salomon', '¡Otra chispa pa\' la Chinita!']]});
});

/* ---------------- 4 · EL MERCADO LAS PULGAS ----------------
   La entrada, el pasillo de las frutas (puestos con toldos, trampolín, un
   entresuelo y la torre de cajas del Primo), el laberinto de puestos y rejas
   (pared rajada del Mollejúo, depósito que abre la diana de Salomón), el patio
   con toldos-trampolín y el techo de la nave con la torre del reloj. */
cargar(4, B=>{
  const colores = ['#ff6b6b', '#ffd43b', '#4dabf7', '#69db7c', '#f783ac', '#ffa94d', '#9775fa', '#38d9a9'];
  /* el piso y las paredes de afuera (del otro lado no hay nada: ¡vacío!) */
  B.plat(0, 4, 48, 100, 0, {mat: 'adoquin', h: 2});
  B.muro(-24.5, 4, 1, 102, -2, 9.5, {mat: 'ladrillo'});
  B.muro(24.5, 4, 1, 102, -2, 9.5, {mat: 'ladrillo'});
  B.muro(0, 54.5, 50, 1, -2, 6, {mat: 'ladrillo'});
  B.muro(0, -46.5, 50, 1, -2, 9.5, {mat: 'ladrillo'});
  /* un puesto: mostrador de madera y toldo de tela encima (el toldo se pisa) */
  let ci = 0;
  const puesto = (x, z, w, d)=>{ B.plat(x, z, w, d, 1.1, {mat: 'madera', h: 1.1}); B.plat(x, z, w, d, 2.6, {mat: 'tela', color: colores[ci++ % 8], h: 0.2}); };
  const reja = (x, z, w, d, alto)=>B.muro(x, z, w, d, 0, alto || 3.2, {mat: 'metal'});
  /* ---- la entrada ---- */
  B.arco(-6, 46, 6, 46, 0, 1.2, 5);
  B.caja(5, 0, 44); B.caja(5, 1, 44); B.caja(-6, 0, 44, {corazon: true});
  /* el cuartico de la esquina: pared rajada con una cocada */
  B.muro(-21.5, 40.3, 5, 0.6, 0, 3.2, {mat: 'casa', color: '#ffa94d'});
  B.muro(-21.5, 44.7, 5, 0.6, 0, 3.2, {mat: 'casa', color: '#ffa94d'});
  B.rajada(-19.3, 42.5, 0.6, 3.8, 0, 3.2);
  B.cocada(-21.5, 0, 42.5); B.linea(-23, 0, 41.5, -23, 0, 43.5, 2);
  B.zona('aviso', -19, -15, 40, 45, {texto: '¡Pared rajada! Un panzazo del Mollejúo (B) y se cae 👥', pj: 'mollejuo', y: 0});
  /* ---- el pasillo de las frutas ---- */
  for (const z of [36, 30, 24]){ puesto(-12, z, 3, 4); puesto(12, z, 3, 4); }
  /* trampolín en el toldo: rebota hasta la cartelera */
  B.plat(12, 38.9, 1.4, 1.4, 1.3, {mat: 'caja', h: 1.3});
  B.trampolin(12, 2.6, 36);
  B.plat(16.5, 36, 5, 4, 6.0, {mat: 'madera', h: 0.4});
  B.cocada(18, 6.0, 36); B.circulo(16, 6.0, 36, 1.4, 5);
  B.linea(12, 2.6, 30, 12, 2.6, 24, 2);
  /* el entresuelo de la pared oeste (se sube por las cajas) */
  B.plat(-17.5, 37, 1.4, 1.4, 1.0, {mat: 'caja', h: 1});
  B.plat(-19.2, 37, 1.4, 1.4, 2.0, {mat: 'caja', h: 2});
  B.plat(-22, 24, 4, 28, 3.0, {mat: 'madera', h: 0.4});
  B.linea(-22, 3.0, 35, -22, 3.0, 15, 6); B.cocada(-22, 3.0, 25);
  B.jaula(-22, 3.0, 12, 'chivito');
  /* la torre de cajas de Don Nené: solo el Primo llega arriba */
  B.plat(0, 16.5, 2, 2, 3.6, {mat: 'caja', h: 3.6});
  B.barajita(0, 3.6, 16.5);
  B.zona('aviso', -5, 5, 12.5, 21, {texto: '¡Una barajita arriba de las cajas! El Primo Verde la alcanza 👥', pj: 'primo', y: 0});
  B.linea(0, 0, 38, 0, 0, 22, 5); B.linea(17, 0, 38.5, 17, 0, 29, 3);
  B.caja(-6, 0, 32); B.caja(7, 0, 26); B.caja(7, 1, 26); B.caja(-5, 0, 19, {monedas: 8});
  /* ---- el laberinto de puestos y rejas ---- */
  B.muro(-8, -2, 2, 24, 0, 3.2, {mat: 'casa', color: '#f783ac'});      /* fila de puestos oeste */
  B.muro(8, -9, 2, 22, 0, 3.2, {mat: 'casa', color: '#38d9a9'});       /* fila de puestos este */
  B.muro(4.5, 10.5, 23, 1, 0, 3.2, {mat: 'casa', color: '#ffd43b'});   /* pared del norte */
  B.muro(20, 10.5, 8, 1, 0, 5, {mat: 'ladrillo'});
  B.muro(-20.5, -20.5, 7, 1, 0, 5, {mat: 'ladrillo'});                 /* pared del sur */
  B.muro(-5, -20.5, 24, 1, 0, 3.2, {mat: 'casa', color: '#4dabf7'});
  reja(-19, 0, 10, 0.4); reja(-14, -8, 10, 0.4);
  reja(-2, -4, 10, 0.4); reja(2, 3, 10, 0.4);
  reja(18.5, -6, 11, 0.4);
  /* el cuarto del loro: pared rajada y techo (solo el panzazo del Mollejúo) */
  B.rajada(-20.5, -13.3, 7, 0.6, 0, 5);
  B.muro(-17.3, -16.5, 0.6, 7, 0, 5, {mat: 'ladrillo'});
  B.plat(-20.5, -16.75, 7, 7.5, 5.4, {mat: 'tablas', h: 0.4});
  B.jaula(-20.8, 0, -16.8, 'loro');
  B.zona('aviso', -24, -15, -13, -8, {texto: '¡Esa pared está rajada! Cámbiate al Mollejúo y dale un panzazo (B) 👥', pj: 'mollejuo', y: 0});
  /* el depósito: la puerta se abre con la diana alta de la pared (pedrada de Salomón) */
  B.muro(16.3, 6, 0.6, 8, 0, 5, {mat: 'ladrillo'});
  B.muro(17.25, 2.3, 2.5, 0.6, 0, 5, {mat: 'ladrillo'});
  B.muro(22.75, 2.3, 2.5, 0.6, 0, 5, {mat: 'ladrillo'});
  B.puerta(20, 2.3, 3, 0.6, 0, 5, 'deposito');
  B.plat(20, 6.5, 8, 9, 5.4, {mat: 'tablas', h: 0.4});
  B.barajita(20, 0, 6.5); B.linea(17.5, 0, 8.5, 22.5, 0, 8.5, 4);
  B.diana(23.4, 10, -12, 'deposito');
  B.zona('aviso', 9, 24, -6, 2, {texto: '¿Ves la diana allá arriba en la pared? Salomón le da una pedrada (B) y se abre el depósito 👥', pj: 'salomon', y: 0});
  /* monedas y cocadas del laberinto */
  B.linea(-16, 0, 8, -16, 0, 2, 3); B.linea(-11.5, 0, -1, -11.5, 0, -6, 3); B.cocada(-22, 0, -4);
  B.linea(-12, 0, -10.5, -12, 0, -17, 3);
  B.linea(-5, 0, -17, 3, 0, -17, 4); B.cocada(5, 0, -18.5);
  B.linea(5, 0, -8, 5, 0, 1, 3); B.linea(-5, 0, 5, 5, 0, 7.5, 3);
  B.linea(11, 0, 6, 11, 0, -14, 5); B.cocada(22, 0, -18);
  B.caja(-5, 0, 7); B.caja(14, 0, -16, {corazon: true});
  /* ---- el patio: toldos con trampolín para subir al techo ---- */
  puesto(14, -25, 4, 3); puesto(-14, -25, 4, 3);
  B.plat(17, -25, 1.4, 1.4, 1.3, {mat: 'caja', h: 1.3}); B.plat(-17, -25, 1.4, 1.4, 1.3, {mat: 'caja', h: 1.3});
  B.trampolin(13, 2.6, -25); B.trampolin(-13, 2.6, -25);
  /* y una escalera de cajas por si acaso */
  B.plat(-2, -27, 2, 2, 1.3, {mat: 'caja', h: 1.3}); B.plat(0, -28.5, 2, 2, 2.6, {mat: 'caja', h: 2.6});
  B.plat(2, -28.5, 2, 2, 3.9, {mat: 'caja', h: 3.9}); B.plat(4, -28.5, 2, 2, 5.2, {mat: 'caja', h: 5.2});
  B.arco(-8, -23, 8, -23, 0, 1, 5); B.cocada(-21, 0, -28);
  B.caja(8, 0, -26); B.caja(-8, 0, -27);
  /* ---- el techo de la nave y la torre del reloj ---- */
  B.plat(0, -38, 48, 16, 6.5, {mat: 'ladrillo', h: 6.5});
  B.plat(-10, -35, 3, 2, 7.3, {mat: 'metal', h: 0.8}); B.plat(10, -41, 3, 2, 7.3, {mat: 'metal', h: 0.8});
  B.plat(18, -42, 2, 2, 8.0, {mat: 'ladrillo', h: 1.5});
  B.barajita(18, 8.0, -42);
  B.plat(0, -42, 6, 6, 8.0, {mat: 'ladrillo', h: 1.5});
  B.meta(0, 8.0, -42);
  B.cocada(-19, 6.5, -44);
  B.linea(-16, 6.5, -32, 16, 6.5, -32, 8); B.circulo(0, 6.5, -42, 4.2, 6);
  B.caja(6, 6.5, -36, {corazon: true});
  /* enemigos */
  B.enemigo('iguana', 0, 0, 30, {eje: 'z', ruta: 5});
  B.enemigo('iguana', -17, 0, 27, {eje: 'z', ruta: 5});
  B.enemigo('zancudo', 6, 2.2, 21, {ruta: 3});
  B.enemigo('robot', 0, 0, -11, {eje: 'z', ruta: 4});
  B.enemigo('iguana', -16, 0, -10.5, {eje: 'x', ruta: 3});
  B.enemigo('zancudo', 16, 2, -12, {ruta: 2.5});
  B.enemigo('chivo', -6, 0, -25, {eje: 'x', ruta: 3, lejos: 6});
  B.enemigo('chivo', -10, 6.5, -39, {eje: 'x', ruta: 3, lejos: 5});
  B.enemigo('zancudo', 10, 8, -38, {ruta: 3});
  /* banderas */
  B.inicio(0, 0, 50, 0);
  B.bandera(0, 0, 49); B.bandera(-16, 0, 13); B.bandera(16, 0, -22); B.bandera(10, 6.5, -33);
  /* vecinos */
  B.npc('vecino', 4, 0, 48, ['¡Épale, mijo! Bienvenidos a Las Pulgas. Aquí se consigue de todo... ¡hasta cocadas!', 'Los toldos con resorte rebotan como trampolín, ¡brinquen encima!'], {nombre: 'La señora Chela'});
  B.npc('vecino', -20, 0, 7, ['Este pasillo da más vueltas que un trompo. ¡Sigan las monedas, vale!', 'Al fondo hay un cuarto con la pared rajada... y adentro se oye un loro.'], {nombre: 'El señor Nené'});
  B.npc('vecino', 20, 0, -28, ['Pa\' subir al techo del mercado, brinquen en los toldos del patio. ¡La chispa está arriba en la torre del reloj!', 'Pendiente con los chivos del techo: embisten derechito.'], {nombre: 'Doña Coromoto'});
  /* adornos */
  B.deco('letrero', 0, 0, 53, {texto: 'Mercado Las Pulgas'});
  B.deco('globo', -4, 0, 52, {color: '#ff6b6b'}); B.deco('globo', 4, 0, 52, {color: '#ffd43b'}); B.deco('globo', 22, 0, 46, {color: '#4dabf7'});
  B.deco('bandera', -10, 0, 53); B.deco('bandera', 10, 0, 53);
  for (const [x, z, i] of [[-15, 50, 0], [15, 50, 1], [-15, 47, 2], [15, 44, 3]]) B.deco('tienda', x, 0, z, {color: colores[i], ang: x < 0 ? Math.PI/2 : -Math.PI/2});
  for (const z of [36, 30, 24]){ B.deco('tienda', -23, 0, z, {color: colores[(z/6) % 8], ang: Math.PI/2}); }
  for (const [x, z] of [[-9.5, 38], [9.5, 38], [-9.5, 20], [9.5, 20]]) B.deco('poste', x, 0, z);
  for (const [x, z, i] of [[-3, 15, 1], [3, 15, 4], [-20, 16, 2]]) B.deco('toldo', x, 0, z, {w: 3, d: 2.5, color: colores[i]});
  B.deco('barril', -3, 0, 40); B.deco('barril', -2, 0, 40.8); B.deco('barril', 22, 0, 40); B.deco('barril', 22.5, 0, 17);
  B.deco('flores', -9, 0, 47); B.deco('flores', 9, 0, 47); B.deco('flores', 1, 0, -21.5);
  B.deco('letrero', -20, 0, 9, {texto: 'Pasillo de las rejas'});
  B.deco('letrero', 20, 5.4, 2.4, {texto: 'DEPÓSITO'});
  B.deco('burro', -3, 0, -12, {ang: 0.5}); B.deco('chivo', 20, 0, -16);
  B.deco('barril', -6, 0, -18.5); B.deco('barril', 22.5, 0, -2); B.deco('barril', -22.5, 0, -9);
  B.deco('toldo', -20, 0, -24, {w: 4, d: 3, color: '#f783ac'}); B.deco('toldo', 20, 0, -24, {w: 4, d: 3, color: '#69db7c'});
  B.deco('techo', 0, 6.5, -38, {w: 48, d: 16, color: '#adb5bd'});
  B.deco('letrero', 0, 9.5, -39, {texto: '🕒 La torre del reloj'});
  B.deco('bandera', -2.5, 8, -44.5); B.deco('bandera', 2.5, 8, -44.5);
  B.deco('bandera', -20, 6.5, -44); B.deco('tanque', 20, 6.5, -34, {esc: 0.7}); B.deco('tuberia', -16, 6.5, -41, {w: 4});
  B.deco('palmera', -22, 0, 52); B.deco('palmera', 22, 0, 52);
  for (const [x, y, z] of [[-40, -2, 30], [40, 1, 10], [-38, 3, -30], [42, -1, -40], [-45, 2, 55], [30, 4, 70], [-20, 0, -70]]) B.deco('nube', x, y, z, {esc: 2});
  B.deco('globo', -30, 2, 20, {color: '#f783ac'}); B.deco('globo', 32, 4, -10, {color: '#69db7c'});
  return B.fin({nombre: 'El Mercado Las Pulgas', sub: 'Toldos, cajas y un laberinto de puestos', tema: {cielo: 'dia'}, vacio: -8,
    intro: [
      ['mollejuo', '¡Las Pulgas! Aquí venden las mejores empanadas de Maracaibo...'],
      ['salomon', '¡Concéntrate, primo! La chispa está arriba, en el techo del mercado.'],
      ['primo', 'Y en los toldos se rebota... ¡boing, boing!'],
    ],
    fin: [['salomon', '¡Desde aquí arriba se ve todo el mercado! ¡Qué molleja!']]});
});

/* ---------------- 5 · LA VEREDA DE NOCHE ----------------
   El paseo junto al lago con faroles, murciélagos y zancudos. El muelle está
   roto: las plataformas duermen hasta que Salomón le pega a la diana del farol.
   Después: el parque con la Casa del Lago (pared rajada), tablas flotantes, otra
   plataforma dormida (la diana de la boya) y el faro, que se sube dando vueltas. */
cargar(5, B=>{
  const Y = 0.5;
  /* la vereda (norte) y el cerro del oeste */
  B.plat(-5, 42, 22, 44, Y, {mat: 'adoquin', h: 3});
  B.muro(-19, 42, 6, 44, -2, 7.5, {mat: 'roca'});
  B.muro(6.25, 49, 0.5, 30, Y, 0.8, {mat: 'piedra'}); B.muro(6.25, 25, 0.5, 10, Y, 0.8, {mat: 'piedra'});
  /* jardineras y bancos */
  for (const [x, z] of [[-12, 54], [-12, 46], [-1, 44]]){ B.plat(x, z, 3, 3, 1.7, {mat: 'ladrillo', h: 1.2}); B.deco('flores', x, 1.7, z); }
  B.plat(2, 50, 2.4, 0.8, 1.0, {mat: 'madera', h: 0.5}); B.plat(2, 38, 2.4, 0.8, 1.0, {mat: 'madera', h: 0.5});
  B.plat(2, 30, 2.4, 0.8, 1.0, {mat: 'madera', h: 0.5}); B.plat(-12, 26, 3, 3, 1.7, {mat: 'ladrillo', h: 1.2}); B.deco('flores', -12, 1.7, 26);
  /* el kiosko: el techo solo lo alcanza el Primo */
  B.plat(-10, 34, 4.4, 4.4, 3.9, {mat: 'tablas', h: 0.3});
  B.muro(-10, 34, 0.5, 0.5, Y, 3.1, {mat: 'madera'});
  B.deco('techo', -10, 3.9, 34, {w: 4.4, d: 4.4, color: '#e03131'});
  B.barajita(-10, 3.9, 34); B.linea(-11.5, 3.9, 32.5, -8.5, 3.9, 32.5, 2);
  B.zona('aviso', -15, -5, 29, 39, {texto: '¡Arriba del kiosko brilla una barajita! El Primo Verde llega con doble salto 👥', pj: 'primo', y: Y});
  /* el muelle de pescar (a la derecha) */
  B.plat(13, 32, 14, 3, Y, {mat: 'tablas', h: 0.5});
  B.plat(21.5, 32, 3, 5, Y, {mat: 'tablas', h: 0.5});
  B.linea(8, Y, 32, 17, Y, 32, 4); B.cocada(21.5, Y, 33.5);
  B.plat(21.5, 27.2, 1.4, 1.4, Y, {mat: 'madera', h: 2}); B.plat(21.5, 23.8, 1.4, 1.4, Y, {mat: 'madera', h: 2});
  B.plat(21.5, 20, 3, 3, Y, {mat: 'tablas', h: 0.5}); B.circulo(21.5, Y, 20, 0.9, 3);
  /* ---- el muelle roto: dos plataformas dormidas que despiertan con la diana del farol ---- */
  B.movil(-5, 18, 4, 2.4, Y, {dz: -10, periodo: 8, espera: 'muelle'}, {mat: 'tablas'});
  B.movil(1, 8, 4, 2.4, Y, {dz: 10, periodo: 8, espera: 'muelle'}, {mat: 'tablas'});
  B.diana(-12, 6, 13, 'muelle');
  B.linea(-5, Y, 16, -5, Y, 10, 3);
  B.zona('aviso', -16, 6, 19.5, 25, {texto: '¡El muelle está roto y la plataforma está dormida! Salomón le da una pedrada (B) a la diana del farol 👥', pj: 'salomon', y: Y});
  /* ---- el parque de la Vereda (sur del canal) ---- */
  B.plat(-5, -9, 22, 30, Y, {mat: 'pasto', h: 3});
  B.muro(-19, -9, 6, 30, -2, 7.5, {mat: 'roca'});
  B.muro(6.25, -9, 0.5, 30, Y, 0.8, {mat: 'piedra'});
  /* la fuente */
  B.plat(-2, -8, 3, 3, 1.3, {mat: 'piedra', h: 0.8}); B.plat(-2, -8, 1, 1, 2.5, {mat: 'piedra', h: 1.2});
  B.cocada(-2, 2.5, -8); B.deco('fuente', -2, 1.3, -8, {esc: 0.6});
  B.plat(3, -15, 2.4, 0.8, 1.0, {mat: 'madera', h: 0.5}); B.plat(3, -20, 2.4, 0.8, 1.0, {mat: 'madera', h: 0.5});
  /* la Casa del Lago: pared rajada (panzazo del Mollejúo) y el morrocoy adentro */
  B.muro(-12.7, -10.7, 6.6, 0.6, Y, 3.2, {mat: 'casa', color: '#ffa94d'});
  B.muro(-12.7, -17.3, 6.6, 0.6, Y, 3.2, {mat: 'casa', color: '#ffa94d'});
  B.rajada(-9.7, -14, 0.6, 6, Y, 3.2);
  B.plat(-12.7, -14, 6.6, 7.2, 4.1, {mat: 'tablas', h: 0.4});
  B.deco('techo', -12.7, 4.1, -14, {w: 6.6, d: 7.2, color: '#c92a2a'});
  B.jaula(-13, Y, -14, 'morrocoy');
  B.zona('aviso', -9.4, -5, -17, -11, {texto: '¡La Casa del Lago tiene una pared rajada! El panzazo del Mollejúo (B) la tumba 👥', pj: 'mollejuo', y: Y});
  B.linea(-12, 4.1, -12, -12, 4.1, -16, 3);
  B.circulo(-2, Y, -8, 3, 8); B.linea(-6, Y, -22.5, 2, Y, -22.5, 4); B.cocada(-14, Y, -22);
  /* la ceiba del parque: troncos y la copa para brincar */
  B.plat(-6, 1.5, 1.4, 1.4, 1.6, {mat: 'madera', h: 1.1}); B.plat(-8, 0, 1.4, 1.4, 2.8, {mat: 'madera', h: 2.3});
  B.plat(-9.5, -3, 4, 4, 4.0, {mat: 'pasto', h: 0.6}); B.deco('arbol', -9.5, Y, -3, {esc: 0.9});
  B.circulo(-9.5, 4.0, -3, 1.2, 4);
  /* ---- las tablas flotantes ---- */
  B.plat(-2, -27.5, 4, 3, Y, {mat: 'tablas', h: 0.5});
  B.cae(-2, -31, 2, 2, Y); B.cae(0.5, -34, 2, 2, Y);
  B.plat(3, -39, 5, 5, Y, {mat: 'tablas', h: 0.5});
  B.cocada(-2, Y, -27.5); B.moneda(-2, Y, -31); B.moneda(0.5, Y, -34); B.linea(1.5, Y, -40.5, 4.5, Y, -40.5, 2);
  /* la lancha del oeste hasta la tablita de la barajita */
  B.movil(-2, -39, 3, 3, Y, {dx: -8, periodo: 7}, {mat: 'madera'});
  B.plat(-14, -39, 4, 5, Y, {mat: 'tablas', h: 0.5});
  B.barajita(-14, Y, -39); B.linea(-5, Y, -39, -9, Y, -39, 3); B.linea(-15.5, Y, -41, -12.5, Y, -41, 2);
  /* la otra plataforma dormida: despierta con la diana de la boya */
  B.movil(3, -43.5, 3, 3, Y, {dz: -6, periodo: 7, espera: 'faro'}, {mat: 'tablas'});
  B.diana(11, 8.8, -45, 'faro');
  B.zona('aviso', 0.5, 5.5, -41.5, -36.5, {texto: '¡Otra plataforma dormida! Salomón le da una pedrada (B) a la diana de la boya 👥', pj: 'salomon', y: Y});
  B.linea(3, Y, -46, 3, Y, -50, 2);
  /* ---- el faro: se sube dando vueltas y la chispa está arriba ---- */
  B.plat(0, -59, 16, 14, Y, {mat: 'roca', h: 3});
  B.muro(0, -60, 4, 4, Y, 12, {mat: 'piedra'});
  B.deco('faro', 0, Y, -60, {esc: 1.2});
  for (let k = 0; k < 10; k++){
    const a = Math.PI/2 - k*Math.PI/4, x = Math.round(Math.cos(a)*4*100)/100, z = Math.round((-60 + Math.sin(a)*4)*100)/100, y = Math.round((Y + 1.2*(k + 1))*10)/10;
    if (k === 6) B.cae(x, z, 2, 2, y); else B.plat(x, z, 2, 2, y, {mat: 'madera', h: 0.4});
    if (k === 5) B.cocada(x, y, z); else if (k < 9) B.moneda(x, y, z);
  }
  B.plat(0, -67, 3, 3, 6.5, {mat: 'madera', h: 0.4});
  B.jaula(0, 6.5, -67.3, 'iguana');
  B.plat(-7, -54, 2, 2, 10.1, {mat: 'madera', h: 0.4});
  B.barajita(-7, 10.1, -54);
  B.meta(1.2, 12.5, -58.8);
  B.circulo(0, Y, -60, 5.8, 8); B.cocada(-6.5, Y, -64.5);
  /* monedas de la vereda */
  B.linea(-2, Y, 56, -2, Y, 24, 8);
  B.arco(-8, 50, -8, 40, Y, 1.4, 4);
  B.cocada(-14, Y, 44);
  B.linea(-9, Y, 4, 3, Y, 4, 4); B.cocada(5, Y, 3.5);
  /* enemigos */
  B.enemigo('zancudo', 2, 2, 52, {ruta: 2.5});
  B.enemigo('murcielago', -4, 3, 40, {ruta: 3});
  B.enemigo('murcielago', 0, 3, 28, {ruta: 3});
  B.enemigo('cangrejo', 13, Y, 32, {eje: 'x', ruta: 3});
  B.enemigo('cangrejo', 2, Y, -4, {eje: 'z', ruta: 4});
  B.enemigo('murcielago', -6, 3, -3, {ruta: 3});
  B.enemigo('murcielago', -3, 3, -19, {ruta: 3});
  B.enemigo('zancudo', 3, 2.5, -39, {ruta: 2});
  B.enemigo('murcielago', -14, 3, -39, {ruta: 2});
  B.enemigo('pirata', 5, Y, -54, {eje: 'x', ruta: 2, lejos: 4});
  B.enemigo('murcielago', 4, 11, -60, {ruta: 4});
  B.enemigo('murcielago', -5, 7, -60, {ruta: 3});
  /* banderas */
  B.inicio(-2, Y, 60, 0);
  B.bandera(-2, Y, 59); B.bandera(-5, Y, 22); B.bandera(-2, Y, 3); B.bandera(3, Y, -38); B.bandera(-4, Y, -53.5);
  /* vecinos */
  B.npc('vecino', 2, Y, 58, ['¡Buenas noches, muchachos! De noche la Vereda se pone brava: salen murciélagos y zancudos.', 'Písenlos o denles una pedrada. ¡Y no se me caigan al lago!'], {nombre: 'El vigilante Toño'});
  B.npc('vecino', -10, Y, 23, ['El muelle está roto, vos. Esas plataformas están dormidas: despiertan con una pedrada a la diana del farol.', '¡Salomón tiene puntería de beisbolista!'], {nombre: 'La señora Maritza'});
  B.npc('vecino', 4, Y, 0, ['Pa\'l faro hay que brincar de tabla en tabla. La última plataforma también duerme: ¡busquen la diana de la boya!', 'En el faro hay un escalón flojito que se cae. ¡No se me paren encima!'], {nombre: 'El pescador Ramón'});
  /* adornos: muchos faroles (es de noche) */
  for (let z = 62; z >= 22; z -= 8){ B.deco('farol', -14.5, Y, z); B.deco('farol', 5.5, Y, z - 4); }
  for (let z = 4; z >= -22; z -= 7){ B.deco('farol', -14.5, Y, z - 3); B.deco('farol', 5.5, Y, z); }
  B.deco('farol', 21.5, Y, 30); B.deco('farol', -14, Y, -37); B.deco('farol', 5, Y, -37); B.deco('farol', 6, Y, -54); B.deco('farol', -6, Y, -54);
  B.deco('poste', -12, -0.5, 13); B.deco('farol', -12, 4, 13);
  B.deco('poste', 11, -0.5, -45); B.deco('farol', 11, 4.5, -45);
  for (const [x, z] of [[-19, 60], [-20, 48], [-18, 36], [-20, 26], [-19, 0], [-20, -12], [-18, -22]]) B.deco('ceiba', x, 5.5, z, {esc: 0.9});
  for (const [x, z] of [[4, 62], [-14, 62], [4, 42], [-14, 28], [4, -22], [-8, -60]]) B.deco('palmera', x, Y, z);
  B.deco('letrero', 0, Y, 62.5, {texto: 'La Vereda del Lago'});
  B.deco('letrero', -1, Y, 21, {texto: '¡Muelle roto!'});
  B.deco('letrero', -2, Y, -25, {texto: 'Al faro →'});
  B.deco('bote', 12, -0.5, 18, {ang: 0.4}); B.deco('bote', 16, -0.5, -20, {ang: 1.8}); B.deco('bote', -8, -0.5, -46, {ang: 2.5}); B.deco('bote', 10, -0.5, -62, {ang: -0.8});
  B.deco('bote', 45, -0.5, 10, {ang: 1.4, color: '#1c7ed6'});
  for (const [x, z] of [[40, 50], [55, -10], [38, -45], [60, 30]]) B.deco('torre', x, -0.5, z);
  B.deco('puente', 60, -0.5, -170, {esc: 2, ang: 0.25});
  B.deco('relampago', 90, 10, -80); B.deco('relampago', 110, 12, 20);
  B.deco('nube', 60, 25, -60); B.deco('nube', 80, 30, 30);
  B.deco('flores', 3, Y, -10); B.deco('flores', -8, Y, -4); B.deco('ancla', 7, Y, -64);
  B.deco('barril', 5, Y, 59); B.deco('barril', 20, Y, 30.5);
  return B.fin({nombre: 'La Vereda de noche', sub: 'Faroles, murciélagos y un faro', tema: {cielo: 'noche'}, agua: -0.5,
    intro: [
      ['chinita', '¡Mis muchachos! De noche la Vereda se llena de murciélagos. ¡Pendientes!'],
      ['salomon', '¡Tranquila, Chinita! Salomón tiene buena puntería.'],
      ['mollejuo', '¿Y si mejor nos quedamos aquí comiéndonos un raspado?'],
    ],
    fin: [['primo', '¡Desde el faro se ve el puente iluminado, primo!'], ['chinita', '¡Qué bella brilla la chispa en lo alto del faro!']]});
});

if (typeof module !== 'undefined' && module.exports) module.exports = L;
})(typeof window !== 'undefined' ? window : globalThis);
