/* ============================================================
   PRUEBAS DE LA RED DE FERNANDO 3D (red.js y lo que viaja) — sin navegador
   Se corre con:   node pruebas_red.js
   Revisa los códigos de sala, lo que se acepta de lo que llega
   (saludos, estrellas, eventos, el estado de cada amigo) y que
   las estrellas compartidas entren bien a la partida.
   ============================================================ */
const path = require('path');
const N = require(path.join(__dirname, 'red.js'));
const F = require(path.join(__dirname, 'nucleo.js'));
let fallos = 0;
const prueba = (que, ok)=>{ if (ok) console.log('✓', que); else { console.log('✗', que); fallos++; } };
const igual = (a, b)=>JSON.stringify(a) === JSON.stringify(b);

/* códigos de sala */
{
  let ok = true;
  for (let i = 0; i < 2000; i++){ const c = N.codigoSala(); if (c.length !== 4 || N.normalizarCodigo(c) !== c) ok = false; }
  prueba('2000 códigos al azar: 4 caracteres y se normalizan igual', ok);
  prueba('normalizar: minúsculas, espacios y lo que se confunde', N.normalizarCodigo(' ab cd ') === 'ABCD' && N.normalizarCodigo('xo1y-z2w9') === 'XYZ2');
  prueba('hasta 4 jugadores, igual en la red y en el núcleo', N.MAX_JUGADORES === F.MAX_JUGADORES && F.MAX_JUGADORES === 4);
  prueba('los personajes de la red son los del núcleo', igual([...N.PJS_OK].sort(), Object.keys(F.PJS).sort()));
}
/* saludos con las estrellas */
{
  const s = N.sanearSaludo({pj: 'lucca', n: 'Lucca<b>', es: ['pradera:torre', 'pradera:torre', 'playa:faro', 'x', 7, 'PRADERA:TORRE', 'a:b'], anf: 1});
  prueba('saludo: personaje y nombre saneado', s.pj === 'lucca' && s.n === 'Luccab' && s.anf === true);
  prueba('saludo: estrellas sin repetidos ni basura ' + JSON.stringify(s.estrellas), igual(s.estrellas, ['pradera:torre', 'playa:faro']));
  prueba('saludo raro: personaje por defecto', N.sanearSaludo({pj: 'hacker', es: 'no'}).pj === 'fernando');
  prueba('saludo gigante se recorta', N.sanearSaludo({es: Array.from({length: 5000}, (_, i)=>'mundo:e' + 'abcdefghij'[i % 10] + 'x')}).estrellas.length <= 300);
}
/* eventos */
{
  prueba('estrella', igual(N.sanearEvento({tipo: 'premio', que: 'estrella', id: 'nubes:arcoiris', z: 1}), {tipo: 'premio', que: 'estrella', id: 'nubes:arcoiris'}));
  prueba('estrella con id malo se tira', N.sanearEvento({tipo: 'premio', que: 'estrella', id: 'nubes'}) === null && N.sanearEvento({tipo: 'premio', que: 'moneda', id: 'nubes:arcoiris'}) === null);
  prueba('fx con números fuera de rango se recortan', igual(N.sanearEvento({tipo: 'fx', fx: 'estrella', x: 1e9, y: 2, z: -3}), {tipo: 'fx', fx: 'estrella', x: 500, y: 2, z: -3}));
  prueba('basura se tira', N.sanearEvento(null) === null && N.sanearEvento({tipo: 'fx', fx: '<script>', x: 0, y: 0, z: 0}) === null);
}
/* el estado de cada jugador: ida y vuelta */
{
  const J = F.crearJuego({prog: {intro: true}}); F.empezar(J); F.cargarMundo(J, 2, null);
  F.dar(J, 'alas'); J.p.x = 3.14159; J.p.vx = 4;
  const ida = JSON.parse(JSON.stringify(F.empaquetar(J, 'cucu', 'Cucú')));
  const e = F.desempaquetar(ida);
  prueba('estado: ida y vuelta ' + JSON.stringify(e), e && e.pj === 'cucu' && e.nombre === 'Cucú' && e.nv === 2 && Math.abs(e.x - 3.14) < 0.01 && e.poder === 'alas');
  prueba('estado roto se tira', F.desempaquetar({t: 'e', nv: 1, x: NaN, y: 0, z: 0, a: 0}) === null && F.desempaquetar({t: 'e', nv: 99, x: 0, y: 0, z: 0, a: 0}) === null && F.desempaquetar('hola') === null);
  const raro = F.desempaquetar({t: 'e', nv: 0, x: 9e9, y: 0, z: 0, a: 0, pj: 'malo', p: 'volarParaSiempre', n: '<img>'});
  prueba('estado raro se recorta: ' + JSON.stringify(raro), raro && raro.x === 500 && raro.pj === 'fernando' && raro.poder === '' && raro.nombre === 'img');
}
/* las estrellas compartidas */
{
  const J = F.crearJuego({prog: {intro: true}}); F.empezar(J); F.cargarMundo(J, 1, null);
  prueba('estrella de un amigo: entra una vez', F.recibirEstrella(J, 'pradera:torre') === true && F.recibirEstrella(J, 'pradera:torre') === false);
  prueba('estrella inventada no entra', F.recibirEstrella(J, 'pradera:nada') === false && F.recibirEstrella(J, 'luna:torre') === false && F.recibirEstrella(J, 5) === false);
  prueba('en el mismo mundo la estrella queda como «ya la tenías»', J.M.estrellas.find(s=>s.id === 'torre').ya === true);
  /* 8 estrellas de amigos abren el castillo del Rey Gruñón */
  ['castillo:tejado', 'pradera:rojas', 'pradera:jefe', 'playa:faro', 'playa:rojas', 'playa:jefe', 'nieve:cima'].forEach(k=>F.recibirEstrella(J, k));
  prueba('con las estrellas de los amigos ya son ' + F.cuentaEstrellas(J.prog), F.cuentaEstrellas(J.prog) === 8);
}
/* Ir con un amigo */
{
  const J = F.crearJuego({prog: {intro: true}}); F.empezar(J); for (let i = 0; i < 5; i++) F.paso(J, 1/60, {});
  F.irConAmigo(J, 2, 10, 0, 5);
  for (let i = 0; i < 120 && (J.trans || J.mundo !== 2); i++) F.paso(J, 1/60, {});
  for (let i = 0; i < 60; i++) F.paso(J, 1/60, {});
  prueba('Ir con… lleva al mundo del amigo y a su lado (' + J.p.x.toFixed(1) + ', ' + J.p.z.toFixed(1) + ')', J.mundo === 2 && Math.hypot(J.p.x - 10, J.p.z - 5) < 3);
  prueba('Ir con… a un mundo que no existe no hace nada', F.irConAmigo(J, 42, 0, 0, 0) === false);
}
console.log(fallos ? '\n' + fallos + ' prueba(s) fallaron' : '\nTodo bien ✓');
process.exit(fallos ? 1 : 0);
