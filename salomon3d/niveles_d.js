(function(raiz){
'use strict';
/* ============================================================
   NIVELES 9 a 12: LAS TORRES · LA FERIA · SAN CARLOS · EL CATATUMBO
   (las reglas de diseño están arriba de niveles.js)
   ============================================================ */
const L = raiz.SALO_NIVELES = raiz.SALO_NIVELES || [];
const cargar = (n, f)=>{ L[n] = f; };

/* ---------------- 9 · LAS TORRES DEL LAGO ----------------
   Torres petroleras en medio del lago al atardecer. Se sube por pistones,
   se cruza en balancines y se trepa la torre principal dando vueltas.
   Chorros de vapor que prenden y apagan; robots que aguantan tres golpes. */
cargar(9, B=>{
  const met = (x, z, w, d, y, o)=>B.plat(x, z, w, d, y, Object.assign({mat: 'metal', h: 0.5, redondo: 0.04}, o||{}));
  const cubierta = (x, z, w, d, y)=>B.plat(x, z, w, d, y, {mat: 'metal', h: y + 1.4, redondo: 0.06});
  const vapor = (x, y, z, fase)=>{ B.peligro('fuego', {x, y, z, r: 0.6, alto: 2.4, cada: 3.2, dura: 1.2, fase: fase || 0, color: '#f1f3f5'}); };

  /* el muelle de tablas: aquí se empieza */
  B.plat(0, 0, 10, 12, 0, {mat: 'tablas', h: 1.4});
  B.inicio(0, 0, 3.5, 0); B.bandera(0, 0, 4);
  B.npc('vecino', -3, 0, 0, ['¡Épale, chamos! Esos chorros de vapor prenden y apagan: ¡espera que se apaguen y pasa rapidito!',
    'Los robots aguantan tres golpes, vos. ¡Mejor písalos dos veces o dales pedradas!',
    'La chispa grande está arriba de la torre principal, ¡la del fondo!'], {nombre: 'El señor Nerio, petrolero'});
  B.deco('letrero', 3.6, 0, 4.8, {texto: 'Torres del Lago'});
  B.deco('barril', 3.8, 0, 0.5); B.deco('barril', 3.8, 0, -0.7); B.deco('barril', 2.8, 0, 0);
  B.deco('farol', -4.5, 0, 5.4); B.deco('farol', 4.5, 0, -5.4);
  B.deco('bote', -8, -1, 2, {ang: 0.3}); B.deco('bote', 8.5, -1, -3, {ang: 2});
  B.deco('ancla', -4, 0, -5);
  B.linea(0, 0, 1, 0, 0, -4, 3);

  /* pasarelas hasta la primera plataforma, con un chorro de vapor en el medio */
  met(0, -9, 3, 6, 0.4);
  met(0, -16.5, 3, 5, 0.8);
  vapor(0, 0.8, -16.5);
  B.linea(0, 0.4, -7, 0, 0.4, -11, 3);
  B.arco(0, -12, 0, -14, 0.6, 1.2, 2);

  /* plataforma A */
  cubierta(0, -25, 16, 12, 1.2);
  B.deco('tanque', -5.5, 1.2, -28.5); B.deco('tanque', 5.5, 1.2, -28.5); B.deco('tuberia', 0, 1.2, -30.4, {w: 8});
  B.deco('farol', -7.4, 1.2, -19.6); B.deco('farol', 7.4, 1.2, -19.6);
  B.caja(4, 1.2, -21); B.caja(-4, 1.2, -21, {corazon: true});
  B.circulo(0, 1.2, -25, 3, 8);
  B.enemigo('robot', 0, 1.2, -24.5, {eje: 'x', ruta: 3});
  B.cocada(6.5, 1.2, -20);

  /* a la derecha: la plataforma de los tanques, con trampolín */
  met(12, -25, 8, 2.4, 1.2);
  cubierta(21, -25, 8, 8, 1.2);
  B.plat(23, -27.5, 3, 3, 5.6, {mat: 'metal', h: 4.4, redondo: 0.3});
  B.trampolin(19, 1.2, -27.4);
  B.linea(9.5, 1.2, -25, 15.5, 1.2, -25, 3);
  B.circulo(23, 5.6, -27.5, 1, 5);
  B.cocada(23, 5.6, -27.5);
  B.enemigo('cangrejo', 20, 1.2, -22.5, {eje: 'x', ruta: 1.5});
  B.deco('tanque', 23.5, 1.2, -21.8, {esc: 0.5}); B.deco('barril', 18, 1.2, -21.8);

  /* a la izquierda: tablitas que se caen y la plataforma del pelícano */
  B.cae(-10, -25, 2, 2, 1.2, {mat: 'metal'}); B.cae(-13, -25, 2, 2, 1.2, {mat: 'metal'});
  B.moneda(-10, 1.2, -25); B.moneda(-13, 1.2, -25);
  cubierta(-20, -25, 9, 9, 1.2);
  B.jaula(-21, 1.2, -27.5, 'pelicano');
  B.enemigo('iguana', -19.5, 1.2, -22, {eje: 'x', ruta: 2.5});
  B.cocada(-23, 1.2, -21.5);
  B.linea(-17, 1.2, -28.5, -23, 1.2, -28.5, 3);
  B.deco('grua', -22.5, 1.2, -22.8, {ang: 1.2}); B.deco('barril', -16.5, 1.2, -28.8);

  /* los pistones que suben a la plataforma B (uno sube mientras el otro baja) */
  B.movil(0, -33, 3, 3, 1.2, {dy: 2.4, periodo: 3.6}, {mat: 'metal'});
  B.movil(0, -37, 3, 3, 2.8, {dy: 2.4, periodo: 3.6, fase: Math.PI}, {mat: 'metal'});
  B.arco(0, -31, 0, -35, 2.2, 1.4, 2); B.arco(0, -35, 0, -39, 3.8, 1.4, 2);
  B.zona('aviso', -2, 2, -32, -30, {texto: '¡Súbete al pistón y salta al otro cuando esté arriba!'});

  /* plataforma B, la grande del medio */
  cubierta(0, -49, 18, 20, 5.2);
  B.bandera(0, 5.2, -41.5);
  B.deco('grua', 6, 5.2, -56, {ang: -0.6}); B.deco('tuberia', -4, 5.2, -58.3, {w: 9}); B.deco('tanque', -6.5, 5.2, -54.5);
  B.deco('barril', 7.8, 5.2, -40.5); B.deco('barril', 7, 5.2, -40.5); B.deco('farol', -8.3, 5.2, -39.8);
  B.plat(-6.5, -44.5, 2.4, 2.4, 6.4, {mat: 'metal', h: 1.2, redondo: 0.3});
  B.plat(-6.5, -47.6, 2.4, 2.4, 7.6, {mat: 'metal', h: 2.4, redondo: 0.3});
  B.circulo(-6.5, 7.6, -47.6, 0.7, 4);
  vapor(-2, 5.2, -50, 0); vapor(2.5, 5.2, -54, 1.6);
  B.enemigo('robot', 0, 5.2, -52, {eje: 'x', ruta: 4});
  B.linea(-4, 5.2, -43, 4, 5.2, -43, 5);
  B.caja(5, 5.2, -46, {corazon: true}); B.caja(5, 6.2, -46);
  B.cocada(7, 5.2, -57.5);

  /* rama del oeste: la caseta de control con la pared rajada (el gatico) */
  met(-13.5, -49, 9, 2.4, 5.2);
  B.cae(-19.5, -49, 2, 2, 5.2, {mat: 'metal'}); B.cae(-22.5, -49, 2, 2, 5.2, {mat: 'metal'});
  cubierta(-30, -49, 10, 10, 5.2);
  B.muro(-31, -51.3, 5.2, 0.6, 5.2, 3, {mat: 'metal'});
  B.muro(-31, -46.7, 5.2, 0.6, 5.2, 3, {mat: 'metal'});
  B.muro(-33.3, -49, 0.6, 4, 5.2, 3, {mat: 'metal'});
  B.rajada(-28.7, -49, 0.6, 4, 5.2, 3);
  B.plat(-31, -49, 5.6, 5.6, 8.6, {mat: 'metal', h: 0.4});
  B.jaula(-31, 5.2, -49, 'gatico');
  B.zona('aviso', -28.4, -25, -52, -46, {texto: '¡La caseta tiene una pared rajada! Pásale al Mollejúo y dale un panzazo (B) 👥', pj: 'mollejuo', y: 5.2});
  B.linea(-10, 5.2, -49, -17, 5.2, -49, 4); B.moneda(-19.5, 5.2, -49); B.moneda(-22.5, 5.2, -49);
  B.cocada(-26.5, 5.2, -53);
  B.deco('bandera', -31, 8.6, -49); B.deco('tanque', -27, 5.2, -45.5, {esc: 0.6});

  /* rama del este: el tanque alto (solo el Primo con doble salto) */
  met(13, -49, 8, 2.4, 5.2);
  cubierta(21, -49, 8, 8, 5.2);
  B.plat(22.5, -50.5, 3.5, 3.5, 8.8, {mat: 'metal', h: 3.6, redondo: 0.3});
  B.barajita(22.5, 8.8, -50.5);
  B.enemigo('robot', 20, 5.2, -46.5, {eje: 'x', ruta: 1.5});
  B.zona('aviso', 17, 25, -53, -45, {texto: '¡Ese tanque está altísimo! El doble salto del Primo Verde sí llega 👥', pj: 'primo', y: 5.2});
  B.linea(10, 5.2, -49, 16, 5.2, -49, 3);
  B.deco('barril', 18, 5.2, -52.3); B.deco('farol', 24.4, 5.2, -45.6);

  /* los balancines sobre el agua */
  B.movil(0, -62, 3, 3, 5.2, {dz: -6, periodo: 4.6}, {mat: 'metal'});
  B.plat(0, -73, 4, 4, 5.2, {mat: 'metal', h: 6.4, redondo: 0.2});
  vapor(0, 5.2, -73, 0.8);
  B.cocada(1.4, 5.2, -74.4);
  B.movil(-5, -77.5, 3, 3, 5.2, {dx: 10, periodo: 5}, {mat: 'metal'});
  B.linea(0, 5.2, -60.5, 0, 5.2, -68.5, 4); B.linea(-4, 5.2, -77.5, 4, 5.2, -77.5, 3);
  B.enemigo('zancudo', 3, 7, -66, {ruta: 3});

  /* plataforma C y la torre principal: se sube dando la vuelta */
  cubierta(0, -92, 24, 24, 6);
  B.bandera(0, 6, -82);
  B.muro(0, -92, 6, 6, 6, 12, {mat: 'metal'});
  const pasos = [[0, -87.5], [4.5, -87.5], [4.5, -92], [4.5, -96.5], [0, -96.5], [-4.5, -96.5], [-4.5, -92], [-4.5, -87.5], [0, -87.5], [4.5, -87.5]];
  pasos.forEach(([x, z], i)=>{ const y = 6 + 1.2*(i + 1); met(x, z, 2.5, 2.5, y); if (i !== 6) B.moneda(x, y, z); });
  B.peligro('fuego', {x: 0, y: 10.8, z: -96.5, r: 0.5, alto: 2, cada: 3.4, dura: 1.1, color: '#f1f3f5'});
  B.cocada(-4.5, 13.2, -92);
  B.meta(0, 18, -92);
  B.deco('bandera', 2.2, 18, -94.2); B.deco('poste', -2.2, 18, -94.2);
  B.enemigo('robot', 5, 6, -100.5, {eje: 'x', ruta: 3});
  B.enemigo('zancudo', 0, 13, -92, {ruta: 6});
  B.linea(-3, 6, -82, 3, 6, -82, 3); B.linea(10.5, 6, -86, 10.5, 6, -100, 4);
  B.cocada(10.5, 6, -102);
  B.deco('grua', 9.5, 6, -83, {ang: 2.4}); B.deco('tanque', -9.5, 6, -101); B.deco('barril', 11, 6, -92); B.deco('barril', 11, 6, -93.2);
  B.deco('barril', -11, 6, -94); B.deco('barril', -11, 6, -95.2); B.deco('farol', 11.3, 6, -80.7); B.deco('farol', -11.3, 6, -103.3);

  /* la caseta cerrada: la abre la diana que está en la torrecita del agua (pedrada de Salomón) */
  B.muro(-8.5, -85.45, 4.4, 0.5, 6, 2.6, {mat: 'metal'});
  B.muro(-8.5, -81.55, 4.4, 0.5, 6, 2.6, {mat: 'metal'});
  B.muro(-10.45, -83.5, 0.5, 3.4, 6, 2.6, {mat: 'metal'});
  B.puerta(-6.55, -83.5, 0.5, 3.4, 6, 2.6, 'caseta');
  B.plat(-8.5, -83.5, 4.6, 4.6, 9, {mat: 'metal', h: 0.4});
  B.barajita(-8.5, 6, -83.5);
  B.deco('torre', -20, -1, -84, {h: 9.4});
  B.diana(-20, 9, -84, 'caseta');
  B.zona('aviso', -12, -5, -88, -80, {texto: '¿Ves la diana en la torrecita del agua? ¡Una pedrada de Salomón abre la caseta! 👥', pj: 'salomon', y: 6});

  /* el secreto de atrás: una viga angosta hasta una plataformita */
  met(0, -107.5, 1.2, 7, 6);
  met(0, -113.5, 4, 4, 6);
  B.linea(0, 6, -105, 0, 6, -110, 3);
  B.barajita(0, 6, -114);
  B.npc('vecino', 1.3, 6, -112.5, ['¡Me encontraste! Yo vengo aquí a ver el atardecer. ¡Qué molleja de vista, primo!'], {nombre: 'La señora Yajaira'});

  /* el paisaje: torres, tanques y barcos en el lago */
  B.deco('torre', -38, -1, -40, {esc: 1.1}); B.deco('torre', 40, -1, -62, {esc: 1.2}); B.deco('torre', -44, -1, -95, {esc: 1});
  B.deco('torre', 42, -1, -112, {esc: 1.3}); B.deco('torre', -28, -1, -128, {esc: 0.9}); B.deco('torre', 30, -1, -20, {esc: 0.8});
  B.deco('torre', 0, 6, -126, {esc: 1.4});
  B.deco('tanque', 34, -1, -36); B.deco('tanque', -40, -1, -66); B.deco('grua', 36, -1, -88, {ang: 1});
  B.deco('barco', 55, -1, -30, {ang: 1.2}); B.deco('barco', -58, -1, -70, {ang: -0.4}); B.deco('barco', 20, -1, -130, {ang: 0.2});
  B.deco('bote', -14, -1, -8, {ang: 1.2}); B.deco('bote', 16, -1, -64, {ang: 2.6});
  B.deco('relampago', -70, -1, -150, {esc: 2}); B.deco('nube', 50, 30, -140, {esc: 3}); B.deco('nube', -60, 28, -40, {esc: 2.5});
  B.deco('faro', -30, -1, 10, {esc: 1});

  return B.fin({nombre: 'Las Torres del Lago', sub: 'Pistones, vapor y robots sobre el agua', tema: {cielo: 'atardecer', agua: '#1f5f8b'}, agua: -1,
    intro: [
      ['primo', '¡Primo, mira esas torres! Allá arriba brilla una chispa.'],
      ['salomon', '¡Vamos pa\' arriba! Pendiente con el vapor, que quema.'],
      ['mollejuo', 'Y con los robots... ¡esos son de lata, pero duros!'],
    ],
    fin: [['salomon', '¡Llegamos a la punta de la torre! Desde aquí se ve todito el lago.'], ['primo', '¡Qué molleja de atardecer, vos!']]});
});

/* ---------------- 10 · LA FERIA DE LA CHINITA ----------------
   De noche, con luces. La calle de las casetas, los toldos que suben,
   los globos, el carrusel y la gran rueda de la fortuna: se sube en una
   góndola y se salta a la tarima de la meta. Alrededor, el vacío. */
cargar(10, B=>{
  const colores = ['#ff6b6b', '#ffd43b', '#4dabf7', '#69db7c', '#f783ac', '#ffa94d', '#9775fa', '#38d9a9'];
  const toldo = (x, z, w, d, y, i, o)=>{ const c = B.plat(x, z, w, d, y, Object.assign({mat: 'tela', color: colores[i % 8], h: 0.5, redondo: 0.2}, o||{})); B.deco('toldo', x, y - 2.6, z, {w, d, color: colores[i % 8]}); return c; };
  /* casita con techo y tres paredes; la cuarta es rajada, puerta o pared */
  const caseta = (x, z, y, cuarta, lado, color, nombre)=>{
    const W = 3, g = 0.5, h = 2.6;
    const pared = (px, pz, w, d, tipo)=>tipo === 'rajada' ? B.rajada(px, pz, w, d, y, h) : tipo === 'puerta' ? B.puerta(px, pz, w, d, y, h, nombre) : B.muro(px, pz, w, d, y, h, {mat: 'casa', color});
    pared(x, z - W/2 - g/2, W + 2*g, g, lado === 'n' ? cuarta : 'muro');
    pared(x, z + W/2 + g/2, W + 2*g, g, lado === 's' ? cuarta : 'muro');
    pared(x - W/2 - g/2, z, g, W, lado === 'o' ? cuarta : 'muro');
    pared(x + W/2 + g/2, z, g, W, lado === 'e' ? cuarta : 'muro');
    B.plat(x, z, W + 2*g + 0.4, W + 2*g + 0.4, y + h + 0.5, {mat: 'tela', color, h: 0.5, redondo: 0.1});
  };

  /* la calle de las casetas */
  B.plat(0, -20, 20, 54, 0, {mat: 'adoquin', h: 3});
  B.inicio(0, 0, 4, 0); B.bandera(0, 0, 4.5);
  B.deco('letrero', 0, 0, 7, {texto: '¡Feria de La Chinita!'});
  B.npc('vecino', 3, 0, 1.5, ['¡Épale, mis niños! ¿Un raspadito? La chispa grande está arriba de la rueda, en la tarima.',
    'En el trampolín de los toldos dejen apretado el salto, ¡que así suben más alto!',
    'Los payasos brincan: písenlos cuando vayan bajando.'], {nombre: 'La señora Chiquinquirá'});
  for (let i = 0; i < 5; i++){ B.deco('tienda', 8.6, 0, -2 - i*9, {color: colores[i], ang: -Math.PI/2}); B.deco('farol', 9.3, 0, -6.5 - i*9); B.deco('farol', -9.3, 0, -6.5 - i*9); }
  B.deco('tienda', -8.6, 0, 0, {color: colores[5], ang: Math.PI/2}); B.deco('tienda', -8.6, 0, -34, {color: colores[6], ang: Math.PI/2}); B.deco('tienda', -8.6, 0, -43, {color: colores[7], ang: Math.PI/2});
  B.deco('tienda', -7, 0, 5, {color: '#ff922b', ang: Math.PI/2});
  B.linea(0, 0, 1, 0, 0, -12, 6);
  B.linea(-3, 0, -30, -3, 0, -44, 5);
  B.caja(4, 0, -8); B.caja(-3, 0, -18, {corazon: true}); B.caja(4, 0, -30, {monedas: 8});
  /* la tarima de los gaiteros, con sus escaloncitos */
  B.plat(6, -34, 5, 4, 1.2, {mat: 'tablas', h: 1.2}); B.plat(6, -31.2, 3, 1.6, 0.6, {mat: 'tablas', h: 0.6});
  B.deco('toldo', 6, 1.2, -34, {w: 5, d: 4, color: '#f08c00'}); B.circulo(6, 1.2, -34, 1.4, 5);
  B.plat(-6, -40, 2, 2, 0.8, {mat: 'caja', h: 0.8}); B.plat(-6, -42.4, 2, 2, 1.6, {mat: 'caja', h: 1.6}); B.moneda(-6, 1.6, -42.4);
  B.cocada(-7.5, 0, -4); B.cocada(7.5, 0, -44);
  B.enemigo('payaso', 2, 0, -20, {eje: 'z', ruta: 5});
  B.enemigo('payaso', 3, 0, -38, {eje: 'x', ruta: 3});
  B.enemigo('murcielago', 4, 2.5, -30, {ruta: 3});

  /* el tiro al blanco: la diana está al fondo, pasando el vacío (pedrada de Salomón) */
  B.muro(-9.5, -14, 1, 6, 0, 1.1, {mat: 'madera'});
  B.muro(-17.6, -14, 0.6, 8, -3, 9, {mat: 'madera'});
  B.diana(-17.1, 2.8, -14, 'premios');
  B.deco('letrero', -9.5, 1.1, -10.5, {texto: 'Tiro al blanco'});
  B.deco('globo', -17.3, 6, -17.5, {color: '#ff6b6b'}); B.deco('globo', -17.3, 6, -10.5, {color: '#4dabf7'});
  B.npc('vecino', -7, 0, -12, ['¡Tiro al blanco, tiro al blanco! Con una pedrada de Salomón se abre la caseta de los premios.'], {nombre: 'Don Wilmer'});
  B.zona('aviso', -9, -5, -18, -10, {texto: '¡Esa diana está lejísimos! Solo la pedrada de Salomón llega 👥', pj: 'salomon'});
  /* la caseta de los premios (se abre con la diana) */
  caseta(-6, -24, 0, 'puerta', 'e', '#f783ac', 'premios');
  B.barajita(-6, 0, -24);

  /* a la derecha: los toldos que suben, la pasarela y el trampolín a los globos */
  toldo(12.5, -10, 4, 4, 1.4, 0);
  toldo(15.5, -14.5, 4, 4, 2.8, 1);
  toldo(18.5, -19, 4, 4, 4.2, 2);
  B.moneda(12.5, 1.4, -10); B.moneda(15.5, 2.8, -14.5);
  B.cocada(18.5, 4.2, -19);
  B.plat(20, -33.5, 3, 24, 5.6, {mat: 'tablas', h: 0.4});
  B.linea(20, 5.6, -23, 20, 5.6, -44, 7);
  B.plat(20, -48, 4, 4, 5.6, {mat: 'madera', h: 0.5});
  B.cocada(21.3, 5.6, -46.8);
  B.trampolin(20, 5.6, -48.6);
  B.movil(20, -53, 2.4, 2.4, 9.6, {dy: 0.8, periodo: 3}, {mat: 'tela', color: '#ff6b6b'});
  B.movil(18, -56.8, 2.4, 2.4, 10.2, {dy: 0.8, periodo: 3, fase: 2}, {mat: 'tela', color: '#4dabf7'});
  B.plat(14.5, -59, 3, 3, 10.8, {mat: 'tela', color: '#9775fa', h: 1.2, redondo: 0.5});
  B.deco('globo', 20, 9.6, -53, {color: '#ff6b6b', esc: 1.6}); B.deco('globo', 18, 10.2, -56.8, {color: '#4dabf7', esc: 1.6}); B.deco('globo', 14.5, 10.8, -59, {color: '#9775fa', esc: 2});
  B.moneda(20, 10.4, -53); B.moneda(18, 11, -56.8); B.circulo(14.5, 10.8, -59, 1, 3);
  B.barajita(14.5, 10.8, -59);
  B.enemigo('murcielago', 17, 11.5, -52, {ruta: 2});
  B.zona('aviso', 18.5, 21.5, -50, -46, {texto: '¡Deja apretado el salto en el trampolín pa\' llegar a los globos!', y: 5.6});

  /* pasitos sobre el vacío hasta la plaza del carrusel */
  B.plat(0, -49.5, 3, 3, 0.3, {mat: 'tela', color: '#ffd43b', h: 0.5, redondo: 0.4});
  B.plat(-1, -53.5, 3, 3, 0.6, {mat: 'tela', color: '#69db7c', h: 0.5, redondo: 0.4});
  B.moneda(0, 0.3, -49.5); B.moneda(-1, 0.6, -53.5);

  /* la plaza del carrusel */
  B.plat(0, -68, 26, 24, 0.8, {mat: 'adoquin', h: 3});
  B.bandera(0, 0.8, -58);
  B.plat(0, -68, 14, 14, 1.2, {mat: 'madera', h: 0.4, redondo: 0.5});
  B.plat(0, -68, 1.2, 1.2, 5.2, {mat: 'metal', h: 4, redondo: 0.5});
  B.plat(0, -68, 6.4, 6.4, 5.8, {mat: 'tela', color: '#e64980', h: 0.6, redondo: 0.5});
  B.deco('carrusel', 0, 1.2, -68, {r: 3});
  for (let i = 0; i < 4; i++) B.movil(0, -68, 1.6, 1.6, 2.2, {r: 5.5, eje: 'y', periodo: 9, fase: i*Math.PI/2}, {mat: 'madera', color: colores[i + 4]});
  B.circulo(0, 2.2, -68, 5.5, 8);
  B.cocada(-5.5, 2.2, -68.2);
  B.jaula(0, 5.8, -68, 'loro');
  B.zona('aviso', -7, 7, -75, -61, {texto: '¡El loro está en el techo del carrusel! Súbete a un caballito y dale el doble salto del Primo 👥', pj: 'primo'});
  /* la caseta de los juegos con la pared rajada (el perrito) */
  caseta(9.5, -61, 0.8, 'rajada', 'o', '#4dabf7');
  B.jaula(9.5, 0.8, -61, 'perrito');
  B.zona('aviso', 6.8, 7.6, -63, -59, {texto: '¡Pared rajada! Un panzazo del Mollejúo la tumba 👥', pj: 'mollejuo'});
  B.cocada(-11, 0.8, -78);
  B.linea(-11, 0.8, -60, -11, 0.8, -74, 4); B.linea(11, 0.8, -66, 11, 0.8, -78, 4);
  B.enemigo('payaso', -9, 0.8, -72, {eje: 'z', ruta: 4});
  B.enemigo('murcielago', 8, 3.5, -74, {ruta: 3});
  B.deco('tienda', -11, 0.8, -58.5, {color: colores[2], ang: Math.PI/2}); B.deco('tienda', 11.5, 0.8, -75, {color: colores[3], ang: -Math.PI/2});
  B.deco('globo', -12, 0.8, -66, {color: '#ffd43b'}); B.deco('globo', 12, 0.8, -70, {color: '#ff6b6b'}); B.deco('fuente', -8, 0.8, -58);
  B.deco('farol', -12.3, 0.8, -56.7); B.deco('farol', 12.3, 0.8, -56.7); B.deco('farol', -12.3, 0.8, -79.3); B.deco('farol', 12.3, 0.8, -79.3);
  B.caja(-7.5, 0.8, -77); B.caja(7.5, 0.8, -77, {corazon: true});

  /* los toldos hasta la rueda (el del medio tiene trampolín) */
  toldo(-2, -82.5, 3, 3, 1.6, 3);
  toldo(1.5, -86.5, 3, 3, 2.4, 4);
  toldo(-1, -90.5, 3, 3, 1.6, 5);
  B.trampolin(1.5, 2.4, -86.5, 14);
  B.arco(1.5, -84, 1.5, -89, 2.4, 3.5, 3);
  B.cocada(-2, 1.6, -82.5);
  B.enemigo('murcielago', 0, 4.5, -87, {ruta: 2});

  /* la plaza de la rueda de la fortuna */
  B.plat(0, -104, 30, 22, 0.8, {mat: 'adoquin', h: 3});
  B.bandera(0, 0.8, -95);
  const hub = 9.8, R = 8, zr = -106;
  B.deco('rueda', 0, hub - R - 1.5, zr - 2, {r: R});
  for (let i = 0; i < 8; i++) B.movil(0, zr, 2.4, 2.4, hub, {r: R, eje: 'z', periodo: 20, fase: i/8*Math.PI*2}, {mat: 'tela', color: colores[i]});
  for (let i = 0; i < 12; i++){ const a = i/12*Math.PI*2 + 0.26; if (i === 4) continue; B.moneda(Math.cos(a)*R, hub + Math.sin(a)*R, zr); }
  B.cocada(-6.93, hub + 4, zr);
  /* la estrella de arriba de la rueda: solo el Primo salta tan alto desde la góndola */
  B.plat(0, zr, 3, 2.4, hub + R + 2.4, {mat: 'oro', h: 0.4});
  B.barajita(0, hub + R + 2.4, zr);
  B.deco('bandera', 1.2, hub + R + 2.4, zr);
  /* la tarima de la meta: se salta desde la góndola cuando va subiendo por la derecha */
  B.plat(12.9, zr, 6, 6, 14.3, {mat: 'tablas', h: 13.5});
  B.meta(12.9, 14.3, zr);
  B.deco('toldo', 12.9, 14.3, zr, {w: 6, d: 6, color: '#ffd43b'}); B.deco('bandera', 15.4, 14.3, zr - 2.5); B.deco('globo', 15.2, 14.3, zr + 2.4, {color: '#f783ac'});
  B.linea(11, 14.3, zr + 2, 15, 14.3, zr + 2, 3);
  B.npc('vecino', -5, 0.8, -96, ['¡Súbanse a una góndola! Cuando vaya subiendo por la derecha, ¡salten a la tarima!',
    'Dicen que arriba de la rueda hay una estrellita dorada... pero hay que saltar altísimo, como el Primo.'], {nombre: 'El gaitero Neudo'});
  B.zona('aviso', -3, 3, -100, -97, {texto: '¡Súbete a una góndola de la rueda y salta a la tarima de la derecha!'});
  B.enemigo('payaso', -9, 0.8, -97, {eje: 'x', ruta: 3});
  B.linea(-12, 0.8, -100, -12, 0.8, -112, 4); B.linea(4, 0.8, -96, 8, 0.8, -96, 3);
  B.deco('farol', -14.3, 0.8, -93.7); B.deco('farol', 14.3, 0.8, -93.7); B.deco('farol', -14.3, 0.8, -114.3);
  B.deco('tienda', -12, 0.8, -113, {color: colores[1]}); B.deco('globo', -13, 0.8, -105, {color: '#69db7c'}); B.deco('globo', -13.6, 0.8, -106.5, {color: '#ffd43b'});

  /* el paisaje: la Basílica a lo lejos, globos en el cielo y fuegos de colores */
  B.deco('basilica', 0, -6, -150, {esc: 2});
  B.deco('globo', -30, 14, -40, {color: '#ff6b6b', esc: 2}); B.deco('globo', 32, 18, -80, {color: '#4dabf7', esc: 2}); B.deco('globo', -28, 20, -110, {color: '#ffd43b', esc: 2.5});
  B.deco('globo', 26, 12, -20, {color: '#69db7c', esc: 1.8}); B.deco('globo', -24, 16, -75, {color: '#f783ac', esc: 2});
  B.deco('palmera', -14, -3, 8, {esc: 1.2}); B.deco('palmera', 14, -3, 8, {esc: 1.2}); B.deco('palmera', -20, -3, -95, {esc: 1.3}); B.deco('palmera', 22, -3, -120, {esc: 1.3});

  return B.fin({nombre: 'La Feria de La Chinita', sub: 'Toldos, carrusel y la rueda de la fortuna', tema: {cielo: 'noche'}, vacio: -10,
    intro: [
      ['mollejuo', '¡Huele a raspado y a tequeños! ¡Qué molleja de feria!'],
      ['primo', 'Concéntrate, primo: la chispa está arriba de la rueda de la fortuna.'],
      ['chinita', 'Sin relámpago, las luces de la feria se apagan. ¡Ayúdenme, mis muchachos!'],
    ],
    fin: [['chinita', '¡Se prendieron todas las luces de la feria! Gracias, muchachos.'], ['salomon', '¡Ahora sí, a montarnos en todo!']]});
});

/* ---------------- 11 · EL CASTILLO DE SAN CARLOS ----------------
   La fortaleza colonial en la boca del lago. Se llega por la playa y el
   puente levadizo (con barriles rodando), se sube a la muralla, se recorre
   el adarve entre cañonazos y piratas y se baja al patio, donde espera
   el Capitán Pata de Palo. */
cargar(11, B=>{
  /* cuartico con techo; una de las cuatro paredes es rajada o puerta */
  const cuarto = (x, z, y, W, D, cuarta, lado, mat, nombre)=>{
    const g = 0.6, h = 2.8;
    const pared = (px, pz, w, d, tipo)=>tipo === 'rajada' ? B.rajada(px, pz, w, d, y, h) : tipo === 'puerta' ? B.puerta(px, pz, w, d, y, h, nombre) : B.muro(px, pz, w, d, y, h, {mat});
    pared(x, z - D/2 - g/2, W + 2*g, g, lado === 'n' ? cuarta : 'muro');
    pared(x, z + D/2 + g/2, W + 2*g, g, lado === 's' ? cuarta : 'muro');
    pared(x - W/2 - g/2, z, g, D, lado === 'o' ? cuarta : 'muro');
    pared(x + W/2 + g/2, z, g, D, lado === 'e' ? cuarta : 'muro');
    B.plat(x, z, W + 2*g + 0.4, D + 2*g + 0.4, y + h + 0.6, {mat, h: 0.6, redondo: 0.06});
  };

  /* el muellecito y la playa */
  B.plat(0, 2, 6, 8, 0, {mat: 'tablas', h: 1.4});
  B.inicio(0, 0, 4, 0); B.bandera(0, 0, 4.5);
  B.plat(0, -12, 34, 20, 0.4, {mat: 'arena', h: 1.8, redondo: 0.3});
  B.npc('vecino', -4, 0.4, -4, ['¡Épale, chamos! Allá está el Castillo de San Carlos. Un pirata se metió y se cree el dueño.',
    'Los piratas te persiguen, pero se cansan rápido. ¡Písalos dos veces!',
    'Ese barco de la izquierda es de los piratas... dicen que en la popa dejaron algo bonito.'], {nombre: 'Don Chepe, el pescador'});
  B.linea(0, 0.4, -1, 0, 0.4, -8, 4); B.circulo(-8, 0.4, -14, 2.5, 6);
  B.enemigo('cangrejo', -8, 0.4, -8, {eje: 'x', ruta: 4});
  B.enemigo('cangrejo', 8, 0.4, -14, {eje: 'x', ruta: 4});
  B.enemigo('cangrejo', 0, 0.4, -18.5, {eje: 'x', ruta: 3});
  B.cocada(-15, 0.4, -20);
  B.caja(10, 0.4, -5); B.caja(11, 0.4, -5, {corazon: true});
  B.deco('palmera', -15, 0.4, -3, {esc: 1.1}); B.deco('palmera', 15, 0.4, -4); B.deco('palmera', 14, 0.4, -19, {esc: 1.2}); B.deco('palmera', -12, 0.4, -20.5);
  B.plat(12, -10, 3, 3, 1.5, {mat: 'roca', h: 1.6, redondo: 0.4}); B.plat(14, -12.5, 2.2, 2.2, 2.6, {mat: 'roca', h: 2.7, redondo: 0.4}); B.circulo(14, 2.6, -12.5, 0.6, 3);
  B.plat(-6, -19.5, 2.4, 2.4, 1.3, {mat: 'roca', h: 1.4, redondo: 0.4}); B.moneda(-6, 1.3, -19.5);
  B.deco('ancla', -10, 0.4, -2.5); B.deco('bote', 6, -1, 6, {ang: 0.6}); B.deco('barril', 3.5, 0, 4);

  /* el barco pirata de la izquierda (se sube por la plancha) */
  B.plat(-21, -6, 8, 1.6, 0.9, {mat: 'tablas', h: 0.3});
  B.plat(-28, -10, 6, 16, 1.5, {mat: 'tablas', h: 2.8});
  B.plat(-28, -15.5, 6, 5, 3, {mat: 'tablas', h: 1.5});
  B.linea(-18, 0.9, -6, -24, 0.9, -6, 3); B.linea(-28, 1.5, -4, -28, 1.5, -11, 3);
  B.cocada(-28, 1.5, -3.2);
  B.barajita(-28, 3, -16.5);
  B.enemigo('pirata', -28, 1.5, -8, {eje: 'z', ruta: 2.5, lejos: 2});
  B.deco('poste', -28, 1.5, -10, {esc: 1.8}); B.deco('bandera', -28, 9.5, -10, {color: '#212529'}); B.deco('barril', -30.3, 1.5, -12); B.deco('barril', -25.7, 3, -17.3);
  B.deco('ancla', -31.5, 1.5, -2.5);

  /* el puente levadizo: los piratas ruedan barriles desde la explanada */
  B.plat(0, -31, 6, 18, 0.8, {mat: 'tablas', h: 0.5});
  B.peligro('rodante', {x0: -1.3, z0: -39.5, y0: 0.8, x1: -1.3, z1: -22.5, vel: 4, cada: 3.5, r: 0.6, barril: true});
  B.linea(1.6, 0.8, -24, 1.6, 0.8, -38, 6);
  B.cocada(1.8, 0.8, -31);
  B.deco('poste', -3.2, 0.8, -23, {esc: 0.6}); B.deco('poste', 3.2, 0.8, -23, {esc: 0.6}); B.deco('poste', -3.2, 0.8, -39, {esc: 0.8}); B.deco('poste', 3.2, 0.8, -39, {esc: 0.8});

  /* la explanada frente a la muralla */
  B.plat(0, -48, 48, 16, 1, {mat: 'piedra', h: 3});
  B.bandera(0, 1, -42);
  B.npc('vecino', 4, 1, -44, ['¡Cuidado con los cañones, mijo! Disparan cada ratico: cuenta hasta tres y pasa.',
    'Por la escalera se sube a la muralla. Por arriba se llega al patio del capitán.'], {nombre: 'La señora Nelly'});
  B.linea(-20, 1, -50, 20, 1, -50, 9);
  B.enemigo('pirata', 8, 1, -47, {eje: 'x', ruta: 4, lejos: 4});
  B.cocada(-8, 1, -44);
  B.deco('barril', -5, 1, -41.5); B.deco('barril', -6, 1, -41.5); B.deco('barril', 12, 1, -41.3); B.deco('farol', -12, 1, -41); B.deco('farol', 12, 1, -54.5);
  B.deco('letrero', -4, 1, -41, {texto: 'Castillo de San Carlos'});
  /* el calabozo con la pared rajada (el cangrejito) */
  cuarto(-19.5, -45, 1, 4, 3, 'rajada', 'e', 'piedra');
  B.jaula(-19.5, 1, -45, 'cangrejito');
  B.zona('aviso', -17, -13, -48, -42, {texto: '¡El calabozo tiene una pared rajada! Pásale al Mollejúo y dale un panzazo 👥', pj: 'mollejuo', y: 1});
  /* el polvorín: se abre con la diana del mástil del barco del agua (pedrada de Salomón) */
  cuarto(19.5, -45, 1, 3, 3, 'puerta', 'o', 'ladrillo', 'polvorin');
  B.barajita(19.5, 1, -45);
  B.deco('barco', 31, -1, -30, {esc: 1.3, ang: 0.15});
  B.diana(30.4, 7.5, -30, 'polvorin');
  B.zona('aviso', 12, 17, -48, -42, {texto: '¿Ves la diana en el mástil del barco? ¡Una pedrada de Salomón abre el polvorín! 👥', pj: 'salomon', y: 1});

  /* la muralla: cuatro lienzos con sus baluartes en las esquinas; el patio en el medio */
  B.muro(0, -58, 30, 4, 1, 5, {mat: 'ladrillo'});
  B.muro(0, -92, 30, 4, 1, 5, {mat: 'ladrillo'});
  B.muro(-17, -75, 4, 30, 1, 5, {mat: 'ladrillo'});
  B.muro(17, -75, 4, 30, 1, 5, {mat: 'ladrillo'});
  for (const [x, z] of [[-20, -56], [20, -56], [-20, -94], [20, -94]]){ B.plat(x, z, 9, 9, 7.2, {mat: 'piedra', h: 9, redondo: 0.08}); B.deco('bandera', x + (x < 0 ? -3.6 : 3.6), 7.2, z + (z > -75 ? 3.6 : -3.6)); }
  /* las almenas del lado de afuera (adornan y dan dónde esconderse de las balas) */
  const almena = (x, z, w, d, y)=>B.plat(x, z, w, d, y + 1, {mat: 'ladrillo', h: 1, redondo: 0.05});
  for (let x = -13; x <= 13; x += 3.25) if (Math.abs(x - 8) > 1.6) almena(x, -56.4, 1.2, 0.8, 6);
  for (let x = -13; x <= 13; x += 3.25) almena(x, -93.6, 1.2, 0.8, 6);
  for (let z = -63; z >= -87; z -= 4) { almena(-18.6, z, 0.8, 1.2, 6); almena(18.6, z, 0.8, 1.2, 6); }
  /* los pretiles de adentro (solo el Primo los salta; por la escalera del noroeste se baja al patio) */
  B.plat(0, -59.7, 30, 0.6, 8.2, {mat: 'piedra', h: 2.2});
  B.plat(-15.3, -73, 0.6, 26, 8.2, {mat: 'piedra', h: 2.2});
  B.plat(15.3, -75, 0.6, 30, 8.2, {mat: 'piedra', h: 2.2});
  B.plat(1.1, -90.3, 27.8, 0.6, 8.2, {mat: 'piedra', h: 2.2});
  /* la escalera de la explanada a la muralla */
  B.escalera(-3, -54.5, 1, 4, -2.2, 0, 1.25, 2.2, 3, {mat: 'piedra'});
  for (let i = 0; i < 4; i++) B.moneda(-3 - 2.2*i, 1 + 1.25*(i + 1), -54.5);
  B.zona('aviso', -11, 0, -56, -52, {texto: '¡Sube por la escalera a la muralla!', y: 1});
  /* el adarve de la muralla sur, el baluarte suroeste y la muralla oeste */
  B.linea(-6, 6, -58, 10, 6, -58, 5);
  B.enemigo('pirata', 5, 6, -57.7, {eje: 'x', ruta: 4, lejos: 2});
  B.peligro('canon', {x: 8, y: 6, z: -57.2, dx: 0, dz: 1, vel: 8, vy: 5, cada: 3.2, alcance: 24});
  B.cocada(-21, 7.2, -58);
  B.linea(-17.3, 6, -63, -17.3, 6, -86, 7);
  B.enemigo('pirata', -17.3, 6, -72, {eje: 'z', ruta: 5, lejos: 2.5});
  B.peligro('canon', {x: -17.3, y: 7.2, z: -92, dx: 0, dz: 1, vel: 9, vy: 4, cada: 3, alcance: 22});
  B.cocada(-17.3, 6, -78);
  B.zona('aviso', -19, -15, -70, -62, {texto: '¡Cañonazos por la muralla! Espera que caiga la bola y pasa corriendo.', y: 6});
  /* el baluarte noroeste: bandera y la bajada al patio */
  B.bandera(-21, 7.2, -95.5);
  B.npc('vecino', -22.5, 7.2, -92, ['El Capitán embiste como un toro. Si se estrella contra la pared queda mareado: ¡ahí le das!',
    'Y ojo: cuando te mira, dispara una bala de cañón. ¡Muévete de lado!'], {nombre: 'El guardia Ramón'});
  [[-13.9, 4.75], [-11.7, 3.5], [-9.5, 2.25]].forEach(([x, y])=>{ B.plat(x, -88.5, 2.2, 3, y, {mat: 'piedra', h: y}); B.moneda(x, y, -88.5); });
  /* la muralla norte hasta el baluarte noreste (la guacamaya) */
  B.linea(-10, 6, -92.3, 12, 6, -92.3, 6);
  B.enemigo('pirata', 4, 6, -92.3, {eje: 'x', ruta: 4, lejos: 2});
  B.peligro('canon', {x: 17.5, y: 7.2, z: -92.3, dx: -1, dz: 0, vel: 9, vy: 4, cada: 3.4, alcance: 20});
  B.jaula(21.5, 7.2, -95.5, 'guacamaya');
  B.cocada(22.5, 7.2, -91);
  B.linea(17.3, 6, -64, 17.3, 6, -86, 5);
  /* la garita del baluarte sureste: solo el Primo con doble salto */
  B.plat(21.5, -54.5, 3, 3, 10.7, {mat: 'ladrillo', h: 3.5, redondo: 0.1});
  B.deco('techo', 21.5, 10.7, -54.5, {w: 3, d: 3, color: '#c92a2a'});
  B.barajita(21.5, 10.7, -54.5);
  B.circulo(21.5, 7.2, -54.5, 2.4, 5);
  B.zona('aviso', 16, 24.5, -60.5, -51.5, {texto: '¡La garita está altísima! El doble salto del Primo sí llega 👥', pj: 'primo', y: 7.2});

  /* el patio de armas: la arena del Capitán Pata de Palo */
  B.plat(0, -75, 30, 30, 1, {mat: 'adoquin', h: 2.2});
  B.bandera(-12.5, 1, -85);
  B.circulo(0, 1, -75, 7, 12);
  B.cocada(12.5, 1, -87.5);
  B.jefe('capitan', 0, 1, -75, {arena: 11, despierta: 12, y0: 1});
  B.deco('barril', 13.5, 1, -61.5); B.deco('barril', 12.5, 1, -61.5); B.deco('barril', -13.5, 1, -61.5); B.deco('ancla', 13, 1, -80);
  B.deco('bandera', 0, 6, -92, {color: '#212529'}); B.deco('poste', -13.8, 1, -61.2, {esc: 0.6}); B.deco('farol', 13.8, 1, -88.8);

  /* el paisaje: el castillo es la estrella; barcos, rocas y el lago abierto */
  B.deco('barco', -45, -1, -60, {esc: 1.5, ang: 1.2}); B.deco('barco', 46, -1, -95, {esc: 1.4, ang: 2.4}); B.deco('barco', -30, -1, -120, {esc: 1.2});
  B.deco('bote', 26, -1, -12, {ang: 1}); B.deco('bote', -38, -1, -30, {ang: 2.2});
  B.deco('roca', -30, -1, -48, {esc: 2}); B.deco('roca', 30, -1, -70, {esc: 1.6}); B.deco('roca', -28, -1, -84, {esc: 1.8}); B.deco('roca', 28, -1, -108, {esc: 2});
  B.deco('faro', 40, -1, -130, {esc: 1.4}); B.deco('palmera', -26, -1, -40); B.deco('palmera', 26, -1, -40);
  B.deco('mangle', -34, -1, -10, {esc: 1.2}); B.deco('mangle', 30, -1, 0, {esc: 1.2}); B.deco('nube', -40, 30, -90, {esc: 3}); B.deco('nube', 50, 26, -40, {esc: 2.5});

  return B.fin({nombre: 'El Castillo de San Carlos', sub: 'Murallas, cañones y un capitán pirata', tema: {cielo: 'dia', agua: '#1c7ed6'}, agua: -1,
    intro: [
      ['salomon', '¡El Castillo de San Carlos! Mi abuelo dice que aquí se peleó por el lago.'],
      ['mollejuo', 'Y ahora lo tomó un pirata... ¡y se comió todas las cocadas!'],
      ['primo', '¡Pendiente con los cañones, primo! Yo voy detrás de vos... bien detrás.'],
    ],
    fin: [['chinita', '¡Se fue el Capitán Pata de Palo! El castillo vuelve a cuidar el lago.'], ['salomon', '¡Chao, capitán! ¡Y deja las cocadas!']]});
});

/* ---------------- 12 · EL CATATUMBO (el final) ----------------
   Los palafitos de la desembocadura bajo la tormenta. Se cruza el río en
   lanchas mientras caen rayos, se pasa por el manglar y la ceiba, y en la
   gran piedra del fondo espera El Nublao, el que se robó el relámpago. */
cargar(12, B=>{
  const colores = ['#ff6b6b', '#ffd43b', '#4dabf7', '#69db7c', '#f783ac', '#ffa94d', '#9775fa', '#38d9a9'];
  const casa = (x, z, w, d, alto, i)=>{ B.plat(x, z, w, d, alto, {mat: 'casa', color: colores[i % 8], h: alto + 1, redondo: 0.08}); B.deco('techo', x, alto, z, {w, d, color: '#e9ecef'}); };
  const cuarto = (x, z, y, W, D, cuarta, lado, color, nombre)=>{
    const g = 0.5, h = 2.6;
    const pared = (px, pz, w, d, tipo)=>tipo === 'rajada' ? B.rajada(px, pz, w, d, y, h) : tipo === 'puerta' ? B.puerta(px, pz, w, d, y, h, nombre) : B.muro(px, pz, w, d, y, h, {mat: 'casa', color});
    pared(x, z - D/2 - g/2, W + 2*g, g, lado === 'n' ? cuarta : 'muro');
    pared(x, z + D/2 + g/2, W + 2*g, g, lado === 's' ? cuarta : 'muro');
    pared(x - W/2 - g/2, z, g, D, lado === 'o' ? cuarta : 'muro');
    pared(x + W/2 + g/2, z, g, D, lado === 'e' ? cuarta : 'muro');
    B.plat(x, z, W + 2*g + 0.4, D + 2*g + 0.4, y + h + 0.5, {mat: 'tablas', h: 0.5, redondo: 0.05});
    B.deco('techo', x, y + h + 0.5, z, {w: W + 2*g + 0.4, d: D + 2*g + 0.4, color: '#c92a2a'});
  };

  /* el muelle de los palafitos */
  B.plat(0, 2, 8, 8, 0.6, {mat: 'tablas', h: 2});
  B.inicio(0, 0.6, 4, 0); B.bandera(0, 0.6, 4.5);
  B.npc('vecino', -2.5, 0.6, 1, ['¡Épale, muchachos! El Nublao está allá al fondo, en la piedra grande. ¡Tenemos años sin relámpago!',
    'Cuando veas un círculo en el piso, ¡muévete! Ahí mismito cae un rayo.',
    'Al Nublao se le tumba a pedradas: dos pedradas de Salomón y baja cansado. ¡Ahí lo pisan!'], {nombre: 'Don Ciro, el pescador'});
  B.deco('bote', -6, -1, 3, {ang: 0.4}); B.deco('bote', 6.5, -1, 1, {ang: 2.1}); B.deco('farol', 3.5, 0.6, 5.5); B.deco('barril', -3.5, 0.6, 5);
  B.linea(0, 0.6, 1, 0, 0.6, -20, 8);

  /* la pasarela del pueblo y los palafitos */
  B.plat(0, -12, 3, 20, 0.6, {mat: 'tablas', h: 0.4});
  casa(-5.5, -6, 5, 5, 3.2, 0);
  B.plat(-2.25, -9.5, 1.5, 2, 1.9, {mat: 'tablas', h: 1.3});
  casa(-6, -11.5, 5, 5, 6.7, 1);
  B.barajita(-6, 6.7, -11.5);
  B.zona('aviso', -8, -3, -8.5, -3.5, {texto: '¡Esa casa de al lado está altísima! El doble salto del Primo sí llega 👥', pj: 'primo', y: 3.2});
  B.cocada(-5.5, 3.2, -5); B.circulo(-5.5, 3.2, -6, 1.3, 4);
  casa(5.5, -15, 5, 5, 3.2, 2);
  B.plat(2.25, -19, 1.5, 2, 1.9, {mat: 'tablas', h: 1.3});
  B.cocada(5.5, 3.2, -15); B.linea(4, 3.2, -13.5, 7, 3.2, -16.5, 3);
  /* techo con techo hasta la placita */
  casa(9, -20, 4, 4, 3.8, 5); casa(10.5, -26, 4, 4, 2.6, 6);
  B.moneda(9, 3.8, -20); B.moneda(10.5, 2.6, -26);
  /* los pilotes del muelle y unos pipotes para brincar */
  for (const [x, z] of [[-4.5, 5.5], [4.5, 5.5], [-4.5, -1.5], [4.5, -1.5]]) B.plat(x, z, 0.8, 0.8, 1.4, {mat: 'madera', h: 3, redondo: 0.4});
  B.plat(-2.5, -1.2, 1.2, 1.2, 1.5, {mat: 'madera', h: 0.9, redondo: 0.5}); B.moneda(-2.5, 1.5, -1.2);
  /* el palafito de la pared rajada (la iguana) */
  B.plat(5.5, -6, 6, 5, 0.6, {mat: 'tablas', h: 1.6});
  cuarto(6, -6, 0.6, 3.2, 3, 'rajada', 'o', colores[3]);
  B.jaula(6, 0.6, -6, 'iguana');
  B.zona('aviso', 1.5, 4.2, -8, -4, {texto: '¡Una pared rajada! El panzazo del Mollejúo la tumba 👥', pj: 'mollejuo'});
  B.enemigo('zancudo', 0, 2.2, -9, {ruta: 2});
  B.enemigo('zancudo', 2, 4.5, -16, {ruta: 2.5});

  /* la placita del pueblo y la capillita de la Chinita (se abre con la diana del poste) */
  B.plat(0, -27, 12, 10, 0.6, {mat: 'tablas', h: 2});
  B.bandera(2, 0.6, -24);
  cuarto(-3.3, -29.4, 0.6, 3, 3, 'puerta', 'e', '#f8f9fa', 'capilla');
  B.barajita(-3.3, 0.6, -29.4);
  B.deco('poste', -15, -1, -28, {esc: 1.7}); B.diana(-15, 7.4, -28, 'capilla');
  B.zona('aviso', -1.5, 2.5, -31.5, -27, {texto: '¡La capillita está cerrada! ¿Ves la diana en el poste del agua? Pedrada de Salomón 👥', pj: 'salomon', y: 0.6});
  B.enemigo('iguana', 1, 0.6, -24.5, {eje: 'x', ruta: 3});
  B.cocada(4.5, 0.6, -30.5); B.linea(1.5, 0.6, -31, 4.5, 0.6, -26.5, 3);
  B.deco('farol', 5.5, 0.6, -22.5); B.deco('farol', -5.5, 0.6, -22.5); B.deco('flores', -3.3, 0.6, -27.3);

  /* el río: lanchas bajo la tormenta */
  B.peligro('rayos', {x0: -10, x1: 20, z0: -70, z1: -33, cada: 2.8});
  B.zona('aviso', -6, 6, -33, -31, {texto: '¡Aquí empiezan los rayos! Si ves un círculo en el piso, ¡quítate rápido!'});
  B.movil(0, -35.5, 3, 4, 0.4, {dz: -10, periodo: 7}, {mat: 'madera'});
  B.linea(0, 0.4, -36, 0, 0.4, -46, 4);
  B.plat(0, -51, 6, 5, 0.6, {mat: 'lodo', h: 2});
  B.cocada(-2, 0.6, -51); B.deco('mangle', -2.5, 0.6, -52.8, {esc: 0.7});
  B.movil(0, -57, 3, 4, 0.4, {dz: -10, periodo: 7, fase: Math.PI}, {mat: 'madera'});
  B.linea(0, 0.4, -58, 0, 0.4, -66, 4);
  B.enemigo('nubecita', 3, 2.6, -42, {ruta: 2});
  B.enemigo('nubecita', -3, 2.6, -62, {ruta: 2});
  /* a la derecha: troncos que se hunden y la toninita en su jaula */
  for (const x of [5, 8, 11]){ B.cae(x, -51, 2, 2, 0.6, {mat: 'madera'}); B.moneda(x, 0.6, -51); }
  B.plat(15.5, -51, 5, 5, 0.6, {mat: 'lodo', h: 2});
  B.jaula(16, 0.6, -52.5, 'delfin');
  B.enemigo('cangrejo', 15.5, 0.6, -49.5, {eje: 'x', ruta: 1});
  B.deco('mangle', 17.5, 0.6, -49, {esc: 0.8});
  B.cocada(8, 0.6, -51.8);
  /* y de ahí, islitas de barro hasta el manglar (camino de atrás) */
  [[15.5, -56.5], [14, -60.5], [12.5, -64.5], [11, -68.5]].forEach(([x, z], i)=>{ B.plat(x, z, 2.5, 2.5, 0.6, {mat: 'lodo', h: 1.8, redondo: 0.5}); B.moneda(x, 0.6, z); if (i % 2) B.deco('mangle', x + 1, 0.6, z - 0.8, {esc: 0.5}); });

  /* el manglar y la ceiba grande (se sube por las ramas) */
  B.plat(0, -78, 20, 16, 0.8, {mat: 'lodo', h: 2.5});
  B.bandera(4, 0.8, -72.5);
  B.npc('vecino', 7, 0.8, -73, ['¡Qué molleja de tormenta! Desde la ceiba se ve la piedra del Nublao.',
    'Ese Nublao se cree muy grande, pero cuando baja cansado es un algodoncito. ¡Písalo!'], {nombre: 'La abuela Chela'});
  B.deco('ceiba', -5, 0.8, -80, {esc: 0.9});
  [[-2.5, -80, 2.0], [-5, -77.5, 3.2], [-7.5, -80, 4.4], [-5, -82.5, 5.6], [-2.5, -80, 6.8]].forEach(([x, z, y], i)=>{ B.plat(x, z, 2.2, 2.2, y, {mat: 'madera', h: 0.4}); if (i < 4) B.moneda(x, y, z); });
  B.cocada(-7.5, 4.4, -80);
  B.barajita(-2.5, 6.8, -80);
  B.enemigo('zancudo', -5, 4.5, -80, {ruta: 3.5});
  B.enemigo('cangrejo', 4, 0.8, -82, {eje: 'x', ruta: 4});
  B.cocada(8, 0.8, -84); B.circulo(4, 0.8, -78, 2.5, 6);
  B.caja(8, 0.8, -76, {corazon: true}); B.caja(-8.5, 0.8, -72, {monedas: 8});
  B.deco('mangle', -9, 0.8, -85, {esc: 1.1}); B.deco('mangle', 9, 0.8, -71); B.deco('mangle', 8.5, 0.8, -86); B.deco('flores', 2, 0.8, -85);

  /* la última pasarela: tablas, una que se hunde y la lancha a la piedra grande */
  B.peligro('rayos', {x0: -6, x1: 6, z0: -107, z1: -86, cada: 2.4});
  B.plat(0, -90, 3, 6, 0.8, {mat: 'tablas', h: 0.4});
  B.cae(0, -95, 2.4, 2.4, 1, {mat: 'tablas'});
  B.plat(0, -99, 3, 4, 1.2, {mat: 'tablas', h: 0.4});
  B.movil(0, -103.5, 3, 3, 1.2, {dz: -3, periodo: 4}, {mat: 'madera'});
  B.linea(0, 0.8, -88, 0, 0.8, -92, 3); B.moneda(0, 1, -95);
  B.cocada(0, 1.2, -99);
  B.enemigo('nubecita', 2.5, 3, -92, {ruta: 2});
  B.enemigo('nubecita', -2.5, 3.2, -101, {ruta: 2});

  /* la piedra grande: la arena de El Nublao */
  B.plat(0, -122, 28, 28, 2, {mat: 'roca', h: 3.5, redondo: 0.2});
  B.bandera(-10, 2, -110.5);
  B.jefe('nublao', 0, 2, -122, {arena: 12, despierta: 11, y0: 2});
  B.circulo(0, 2, -122, 9, 10);
  for (const [x, z] of [[12.3, -109.7], [-12.3, -134.3], [12.3, -134.3]]){ B.plat(x, z, 2.5, 2.5, 2.9, {mat: 'roca', h: 1, redondo: 0.4}); B.moneda(x, 2.9, z); }
  B.linea(-12, 2, -112, -12, 2, -132, 5); B.linea(12, 2, -112, 12, 2, -132, 5);
  B.deco('relampago', 0, 2, -140, {esc: 3}); B.deco('relampago', -25, -1, -135, {esc: 2}); B.deco('relampago', 28, -1, -128, {esc: 2.2});
  B.deco('roca', -13, 2, -135, {esc: 1.2}); B.deco('roca', 13, 2, -135, {esc: 1.2}); B.deco('cristal', -13, 2, -109, {color: '#9775fa'}); B.deco('cristal', 13, 2, -109, {color: '#9775fa'});

  /* el paisaje: palafitos, manglares, nubes negras y relámpagos */
  B.deco('palafito', -14, -1, -4, {w: 5, d: 5, h: 3, color: colores[4]}); B.deco('palafito', 14, -1, -2, {w: 5, d: 4, h: 3, color: colores[5]});
  B.deco('palafito', -15, -1, -18, {w: 4, d: 5, h: 3.5, color: colores[6]}); B.deco('palafito', 14, -1, -26, {w: 5, d: 5, h: 3, color: colores[7]});
  B.deco('palafito', -16, -1, -40, {w: 5, d: 4, h: 3, color: colores[1]}); B.deco('palafito', 24, -1, -36, {w: 4, d: 4, h: 3, color: colores[0]});
  B.deco('mangle', -18, -1, -60, {esc: 1.4}); B.deco('mangle', -22, -1, -75, {esc: 1.3}); B.deco('mangle', 20, -1, -68, {esc: 1.3}); B.deco('mangle', 18, -1, -92, {esc: 1.4});
  B.deco('mangle', -16, -1, -98, {esc: 1.2}); B.deco('mangle', 26, -1, -52, {esc: 1.1});
  B.deco('nube', -30, 22, -60, {esc: 3, color: '#495057'}); B.deco('nube', 30, 24, -90, {esc: 3.5, color: '#343a40'}); B.deco('nube', 0, 28, -150, {esc: 4, color: '#212529'});
  B.deco('relampago', -45, -1, -80, {esc: 1.5}); B.deco('relampago', 40, -1, -40, {esc: 1.4});
  B.deco('bote', -9, -1, -40, {ang: 1.2}); B.deco('bote', 10, -1, -88, {ang: 0.5});

  return B.fin({nombre: 'El Catatumbo', sub: 'La tormenta final: ¡a devolver el relámpago!', tema: {cielo: 'tormenta', agua: '#1b3a4b'}, agua: -1,
    intro: [
      ['chinita', 'Mis muchachos, aquí nace el relámpago. El Nublao lo tiene tapado con su tormenta.'],
      ['salomon', '¡Tranquila, Chinita! Salomón, el Primo y el Mollejúo se encargan.'],
      ['primo', '¿Y... tiene que ser con tanto rayo? ¡Bueno, vamos pues!'],
    ],
    fin: [
      ['chinita', '¡Lo lograron, mis muchachos! Gracias a ustedes volvió el relámpago del Catatumbo.'],
      ['chinita', 'Ahora el faro del lago alumbra otra vez a los pescadores... y a la feria. ¡El Zulia entero les da las gracias!'],
      ['salomon', '¡Salomón y los primos, los héroes del lago! ¡Qué molleja, vos!'],
    ]});
});

if (typeof module !== 'undefined' && module.exports) module.exports = L;
})(typeof window !== 'undefined' ? window : globalThis);
