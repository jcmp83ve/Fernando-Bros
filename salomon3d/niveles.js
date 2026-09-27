(function(raiz){
'use strict';
/* ============================================================
   LOS NIVELES de Salomón y los Primos — La Gran Aventura del Lago
   [0] la Vereda del Lago (mundo central con los 12 portales)
   [1..12] los niveles. Cada uno usa el constructor B del núcleo.

   REGLAS DE DISEÑO (el revisor de pruebas.js las comprueba):
   · subir ≤ 1,8 m: todos · ≤ 2,9 m: el Primo · ≤ 4,4 m: el Primo con doble salto
   · huecos ≤ 3,5 m: todos · ≤ 6 m: el Primo
   · cada nivel: 2 jaulas, 8 cocadas, 3 barajitas, meta o jefe, 3+ banderas
   · paredes rajadas: solo el panzazo del Mollejúo · dianas: pedrada de Salomón
   · 40+ monedas; 5+ enemigos (o jefe); Salomón solo llega al 40%+ de las monedas

   MATERIALES (mat de B.plat): pasto tierra arena adoquin piedra ladrillo madera tablas
     casa (con color) metal asfalto nieve hielo (resbala) nube tela (con color) lodo oro roca
   ADORNOS (B.deco(tipo, x, y, z, {esc, ang, color, w, d, h, r, texto})) — no chocan:
     palmera farol flores arbol pino cactus roca casa(w,d,h,color) techo(w,d,color) kiosko
     bote torre(petrolera) frailejon muneco(de nieve) toldo(w,d,color) rueda(r) carrusel(r)
     basilica puente fuente cascada(w,h) nube tepuy montana medano faro barco letrero(texto)
     tuberia(w) tanque grua poste ceiba mangle palafito(w,d,h,color) globo(color) bandera
     cerca(w) hongo cristal(color) relampago castillo barril ancla chivo burro tienda(color)
   ENEMIGOS: nubecita zancudo murcielago (vuelan) · cangrejo iguana pinguino (a pie)
     chivo (embiste) robot (aguanta 3) pirata (persigue, aguanta 2) payaso (salta)
     opciones: {eje:'x'|'z', ruta: metros de ida y vuelta (o radio si vuela), ocho: true}
   JEFES: cangrejote chivote capitan (embisten; se les pega mareados) · zancudote (vuela)
     · nublao (el final). B.jefe(tipo, x, y, z, {arena: radio, despierta: distancia})
   PELIGROS (B.peligro): canon {x,y,z,dx,dz,vel,cada,alcance} · rodante {x0,z0,y0,x1,z1,y1,vel,cada,r}
     · carros {z0,z1,y,carriles:[{x,v,n}]} · rayos {x0,x1,z0,z1,cada} · chorro {x,y,z,r,alto,fuerza}
     · pinchos {x,y,z,w,d,cada} · fuego {x,y,z,r,alto,cada,dura}
   ZONAS (B.zona(tipo,x0,x1,z0,z1,o)): viento {fx,fz,periodo,dura} · aviso {texto, pj, y}
   PLATAFORMAS ESPECIALES: B.movil(x,z,w,d,y,{dx,dy,dz,periodo,fase} o {r,eje:'y'|'x'|'z',periodo}, o)
     · B.cae(...) se cae al pisarla · B.trampolin(x,y,z,fuerza≈17) · mueve.espera:'nombre'
     (se queda quieta hasta que una diana con ese nombre se active)
   ============================================================ */
/* los niveles viven en varios archivos (niveles.js, niveles_b.js, niveles_c.js, niveles_d.js);
   todos llenan la misma lista SALO_NIVELES */
const L = raiz.SALO_NIVELES = raiz.SALO_NIVELES || [];
const cargar = (n, f)=>{ L[n] = f; };

/* ---------------- 0 · LA VEREDA DEL LAGO ---------------- */
cargar(0, B=>{
  /* la plaza redonda (hecha de losas) con el lago alrededor */
  B.plat(0, 0, 44, 44, 0, {mat: 'pasto', h: 2, redondo: 0.4});
  B.plat(0, 0, 14, 14, 0.15, {mat: 'piedra', h: 0.3});
  /* el camino de losas hasta cada portal y los portales en círculo */
  const nombres = ['', 'El Saladillo', 'El Puente', 'Los Palafitos', 'Las Pulgas', 'La Vereda de noche', 'Los Médanos de Coro', 'El Páramo', 'El Tepuy', 'Las Torres del Lago', 'La Feria de La Chinita', 'El Castillo de San Carlos', 'El Catatumbo'];
  for (let n = 1; n <= 12; n++){
    const a = (n - 1)/12*Math.PI*2 - Math.PI/2, r = 16.5;
    const x = Math.cos(a)*r, z = Math.sin(a)*r;
    B.plat(x, z, 4.2, 4.2, 0.35, {mat: 'piedra', h: 0.6, redondo: 0.3});
    B.portal(n, x, 0.35, z);
    B.deco('portal', x, 0.35, z, {nivel: n, nombre: nombres[n], ang: -a - Math.PI/2});
  }
  /* la tienda, el álbum y la antena */
  B.plat(-6, 9, 5, 3, 0.2, {mat: 'madera', h: 0.4});
  B.deco('kiosko', -6, 0.2, 9.8, {color: '#ff922b', ang: Math.PI});
  B.npc('vecino', -6, 0.2, 8.4, ['¡Bienvenidos al kiosko! Con monedas se compran gorras y sombreros. ¡Toca 🛒!', '¿Otra gorrita, mi rey? ¡Llévate dos!'], {tienda: true, nombre: 'La señora Carmen', radio: 2.6, cada: 12});
  B.deco('album', 6, 0.15, 9, {ang: Math.PI});
  B.npc('album', 6, 0.15, 8, ['Aquí está el álbum de barajitas. ¡Hay tres escondidas en cada nivel!'], {album: true, nombre: 'El álbum', radio: 2.4, cada: 12});
  B.deco('antena', 10.5, 0.15, 0, {ang: -Math.PI/2});
  B.npc('antena', 9.6, 0.15, 0, ['📡 La antena: aquí se juega con amigos. ¡Toca 👥 para crear una sala o entrar a una!'], {antena: true, nombre: 'La antena', radio: 2.2, cada: 12});
  B.npc('chinita', 0, 0.3, -2.5, [
    '¡Muchachos! Las nubes negras regaron las chispas del relámpago por todo el Zulia. ¡Búsquenlas!',
    'Cada portal se abre con chispas ⚡. Rescaten a los animalitos y junten las 8 cocadas de cada nivel.',
    '¡Sin relámpago no hay feria! Yo los espero aquí, mis muchachos.'], {nombre: 'La Chinita del Catatumbo', radio: 3, cada: 30});
  B.deco('fuente', 0, 0.3, 0);
  B.plat(0, 0, 3, 3, 0.9, {mat: 'piedra', h: 0.6, redondo: 0.5});
  /* unas monedas para empezar y palmeras alrededor */
  B.circulo(0, 0.3, 0, 5.2, 12);
  for (let i = 0; i < 14; i++){ const a = i/14*Math.PI*2 + 0.13, r = 20.5; B.deco('palmera', Math.cos(a)*r, 0, Math.sin(a)*r, {esc: 0.9 + (i % 3)*0.15}); }
  for (let i = 0; i < 10; i++){ const a = i/10*Math.PI*2 + 0.4, r = 11; B.deco('farol', Math.cos(a)*r, 0.02, Math.sin(a)*r); }
  B.deco('flores', 4, 0.02, -8); B.deco('flores', -4, 0.02, -8); B.deco('flores', 9, 0.02, 4); B.deco('flores', -9, 0.02, 4);
  B.deco('bote', 0, -1.4, 27, {ang: 0.4}); B.deco('bote', 25, -1.4, -8, {ang: 1.8});
  B.deco('puente', 0, -2, -250, {esc: 1.4});
  B.inicio(0, 0.15, 6.5, 0);
  B.bandera(3.5, 0.15, 5.5);
  return B.fin({nombre: 'La Vereda del Lago', sub: 'Elige un portal', tema: {cielo: 'dia', agua: '#2f86c4'}, agua: -1.5,
    intro: [
      ['chinita', '¡Muchachos! Unas nubes negras se robaron el relámpago del Catatumbo y regaron sus chispas por todo el Zulia.'],
      ['salomon', '¡Salomón en la casa!'],
      ['chinita', 'Cada portal los lleva a un sitio distinto. ¡Empiecen por el Saladillo!'],
    ]});
});

/* ---------------- 1 · EL SALADILLO ----------------
   Calles de casitas de colores; se sube por los techos. Aprende: saltar,
   pisar enemigos, romper cajas, doble salto del Primo, panzazo, pedrada. */
cargar(1, B=>{
  const colores = ['#ff6b6b', '#ffd43b', '#4dabf7', '#69db7c', '#f783ac', '#ffa94d', '#9775fa', '#38d9a9'];
  /* el piso: dos calles en cruz y la plaza del fondo */
  B.plat(0, -30, 12, 76, 0, {mat: 'adoquin', h: 2});
  B.plat(0, -32, 60, 10, 0, {mat: 'adoquin', h: 2});
  B.plat(0, -76, 30, 20, 0, {mat: 'piedra', h: 2});
  /* las casas de los lados: bloques de colores que sirven de plataforma (techos a 2,6 m y 4,2 m) */
  const casa = (x, z, w, d, alto, i)=>{ B.plat(x, z, w, d, alto, {mat: 'casa', color: colores[i % 8], h: alto, redondo: 0.08}); B.deco('techo', x, alto, z, {w, d, color: '#e9ecef'}); };
  let i = 0;
  for (const z of [-4, -14, -48, -58]){ casa(-9, z, 6, 8, z === -14 || z === -48 ? 4.2 : 2.6, i++); casa(9, z, 6, 8, z === -4 || z === -58 ? 4.2 : 2.6, i++); }
  for (const x of [-22, -14, 14, 22]) { casa(x, -25, 7, 5, 2.6, i++); casa(x, -39, 7, 5, x === -22 || x === 22 ? 4.2 : 2.6, i++); }
  /* muros al final de la calle en cruz (no se sale del nivel) */
  B.muro(-31, -32, 2, 10, 0, 6, {mat: 'casa', color: '#ffa94d'}); B.muro(31, -32, 2, 10, 0, 6, {mat: 'casa', color: '#4dabf7'});
  B.muro(0, 9, 14, 2, 0, 5, {mat: 'casa', color: '#f783ac'});
  /* escalones para subir al primer techo */
  B.caja(-5.2, 0, -1.5); B.plat(-6.8, -4, 1.6, 2, 1.3, {mat: 'madera', h: 1.3});
  B.linea(-9, 2.6, -1.5, -9, 2.6, -6.5, 4);
  /* monedas por la calle */
  B.linea(0, 0, 2, 0, 0, -20, 8);
  B.arco(0, -44, 0, -60, 0, 2.2, 6);
  B.circulo(0, 0, -32, 3.5, 10);
  B.linea(-7, 0, -32, -24, 0, -32, 6); B.linea(7, 0, -32, 24, 0, -32, 6);
  B.linea(-9, 4.2, -11, -9, 4.2, -17, 3); B.linea(9, 4.2, -1, 9, 4.2, -7, 3);
  B.circulo(0, 1.8, -78, 3, 6);
  /* cajas con monedas y un corazón */
  B.caja(3, 0, -9); B.caja(3, 1, -9); B.caja(-3, 0, -20, {corazon: true});
  B.caja(-17, 0, -32); B.caja(18, 0, -32, {monedas: 8});
  /* enemigos: iguanas en la calle, zancudos sobre la plaza */
  B.enemigo('iguana', 2, 0, -12, {eje: 'z', ruta: 4});
  B.enemigo('iguana', -12, 0, -32, {eje: 'x', ruta: 5});
  B.enemigo('iguana', 12, 0, -32, {eje: 'x', ruta: 5});
  B.enemigo('zancudo', 0, 1.6, -52, {ruta: 3});
  B.enemigo('zancudo', 5, 1.8, -72, {ruta: 4});
  B.enemigo('zancudo', -6, 1.8, -78, {ruta: 3});
  /* jaula 1: arriba de la casa alta (4,2 m): se llega saltando de techo en techo */
  B.jaula(9, 4.2, -4, 'perrito');
  /* jaula 2: detrás de una pared rajada, en un callejón (panzazo del Mollejúo) */
  B.plat(-27, -45, 6, 6, 0, {mat: 'adoquin', h: 2});
  B.muro(-27, -41.6, 6, 0.8, 0, 3.5, {mat: 'casa', color: '#9775fa'});
  B.muro(-30.4, -45, 0.8, 7, 0, 3.5, {mat: 'casa', color: '#9775fa'});
  B.muro(-23.6, -46.6, 0.8, 3.8, 0, 3.5, {mat: 'casa', color: '#9775fa'});
  B.rajada(-23.6, -43.3, 0.8, 2.8, 0, 3);
  B.muro(-27, -48.4, 6, 0.8, 0, 3.5, {mat: 'casa', color: '#9775fa'});
  B.jaula(-27, 0, -45, 'gatico');
  B.zona('aviso', -26, -21, -46, -41, {texto: '¡Una pared rajada! El panzazo del Mollejúo (B) la tumba 👥', pj: 'mollejuo'});
  /* las 8 cocadas */
  B.cocada(-9, 2.6, -14); B.cocada(9, 2.6, -14); B.cocada(-22, 4.2, -39); B.cocada(22, 4.2, -39);
  B.cocada(-26, 0, -32); B.cocada(26, 0, -32); B.cocada(9, 2.6, -48); B.cocada(0, 0, -84);
  /* barajitas: una en el techo alto de la izquierda (Primo), una detrás de la puerta de la diana, una arriba del campanario */
  B.barajita(-9, 4.2, -48);
  B.diana(0, 4.6, -86.5, 'sacristia');
  B.plat(11, -80, 4, 4, 0, {mat: 'piedra', h: 2});
  B.muro(11, -77.7, 4, 0.6, 0, 3, {mat: 'ladrillo'}); B.muro(13.3, -80, 0.6, 5, 0, 3, {mat: 'ladrillo'}); B.muro(11, -82.3, 4, 0.6, 0, 3, {mat: 'ladrillo'});
  B.puerta(8.7, -80, 0.6, 4, 0, 3, 'sacristia');
  B.barajita(11, 0, -80);
  /* la plaza de la Basílica: escalinata y la chispa grande arriba */
  B.escalera(0, -70, 0, 3, 0, -1.4, 0.6, 10, 1.4, {mat: 'piedra'});
  B.plat(0, -79, 12, 6, 1.8, {mat: 'piedra', h: 1.8});
  B.plat(0, -84, 8, 4, 3.4, {mat: 'piedra', h: 3.4});
  B.plat(-3, -82, 2, 2, 2.6, {mat: 'piedra', h: 0.8});
  B.deco('basilica', 0, 3.4, -88, {esc: 1});
  B.plat(-6, -88, 3, 3, 6.2, {mat: 'ladrillo', h: 6.2}); B.plat(6, -88, 3, 3, 6.2, {mat: 'ladrillo', h: 6.2});
  B.plat(-4.2, -85, 1.4, 1.4, 5, {mat: 'madera', h: 0.4});
  B.barajita(-6, 6.2, -88);
  B.meta(0, 3.4, -84);
  /* banderas */
  B.bandera(-2, 0, -26); B.bandera(3, 0, -60); B.bandera(-4, 1.8, -77);
  B.deco('farol', -5, 0, -8); B.deco('farol', 5, 0, -18); B.deco('farol', -5, 0, -40); B.deco('farol', 5, 0, -52);
  B.deco('flores', -4, 0, -66); B.deco('flores', 4, 0, -66);
  B.deco('palmera', -12, 0, -70, {esc: 1.1}); B.deco('palmera', 12, 0, -70); B.deco('palmera', -13, 0, -86); B.deco('palmera', 13, 0, -86);
  B.npc('vecino', 4, 0, -2, ['¡Épale, Salomón! Las iguanas se pisan, ¡y las cajas se rompen con B!', 'Dicen que en el techo alto hay un perrito encerrado, ¿vos lo viste?'], {nombre: 'Don Ender'});
  B.inicio(0, 0, 4, 0);
  B.bandera(0, 0, 4);
  return B.fin({nombre: 'El Saladillo', sub: 'Calles de colores y techos para saltar', tema: {cielo: 'dia'}, vacio: -8,
    intro: [
      ['salomon', '¡Maracaibo, aquí estoy!'],
      ['primo', '¡Pendiente, primo! Las iguanas de aquí son bravas. ¡Písalas!'],
    ],
    fin: [['salomon', '¡La primera chispa grande! ¡Vamos por más, primo!']]});
});

if (typeof module !== 'undefined' && module.exports) module.exports = L;
})(typeof window !== 'undefined' ? window : globalThis);
