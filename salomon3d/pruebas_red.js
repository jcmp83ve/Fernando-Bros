/* ============================================================
   PRUEBAS DE LA RED (red.js) — sin navegador
   Se corre con:   node pruebas_red.js
   Revisa lo puro: los códigos de sala y lo que se acepta de
   lo que llega (saludos, eventos y nombres).
   ============================================================ */
const path = require('path');
const N = require(path.join(__dirname, 'red.js'));
const S = require(path.join(__dirname, 'nucleo.js'));
let fallos = 0;
const mal = m=>{ console.log('✗', m); fallos++; };
const bien = m=>console.log('✓', m);
const igual = (a, b)=>JSON.stringify(a) === JSON.stringify(b);
const prueba = (que, ok)=>ok ? bien(que) : mal(que);

/* ---------------- códigos de sala ---------------- */
{
  let ok = true;
  for (let i = 0; i < 2000; i++){ const c = N.codigoSala(); if (c.length !== 4 || [...c].some(ch=>!N.ALFABETO_SALA.includes(ch)) || N.normalizarCodigo(c) !== c) ok = false; }
  prueba('2000 códigos al azar: 4 caracteres del alfabeto y se normalizan igual', ok);
  prueba('el alfabeto no tiene I, O, 0 ni 1', !/[IO01]/.test(N.ALFABETO_SALA));
  prueba('código con azar fijo', N.codigoSala(()=>0) === 'AAAA' && N.codigoSala(()=>0.999) === '9999');
  prueba('normalizar: minúsculas y espacios', N.normalizarCodigo(' ab cd ') === 'ABCD');
  prueba('normalizar: se quitan los que se confunden y lo que sobra', N.normalizarCodigo('xo1y-z2w9') === 'XYZ2');
  prueba('normalizar: nada o basura', N.normalizarCodigo(null) === '' && N.normalizarCodigo(undefined) === '' && N.normalizarCodigo('¿?') === '');
  prueba('normalizar: número', N.normalizarCodigo(2345) === '2345');
  prueba('MAX_JUGADORES igual al del núcleo', N.MAX_JUGADORES === S.MAX_JUGADORES && N.MAX_JUGADORES === 4);
}

/* ---------------- nombres ---------------- */
prueba('nombre saneado: sin etiquetas y corto', N.sanearNombre('<b>Salomón</b> el más grande del mundo') === 'bSalomónb el m');
prueba('nombre con ñ y acentos se queda', N.sanearNombre('Mollejúo Ñañá') === 'Mollejúo Ñañá');
prueba('nombre raro', N.sanearNombre(null) === '' && N.sanearNombre({toString(){ return 'x'; }}) === 'x');

/* ---------------- saludos ---------------- */
{
  const s = N.sanearSaludo({pj: 'primo', n: 'Primo<script>', ch: ['1-j0', '1-j0', '2-c', 'x', 3, '1-m', '99-j12', '1-j0'.repeat(9)], ba: ['1-b2', '1-b22', 'b3', null], anf: 1});
  prueba('saludo: pj válido y nombre saneado', s.pj === 'primo' && s.n === 'Primoscript');
  prueba('saludo: chispas sin repetidos ni basura ' + JSON.stringify(s.chispas), igual(s.chispas, ['1-j0', '2-c', '1-m', '99-j12']));
  prueba('saludo: barajitas ' + JSON.stringify(s.barajitas), igual(s.barajitas, ['1-b2']));
  prueba('saludo: anfitrión', s.anf === true);
  const r = N.sanearSaludo({pj: 'hacker', ch: 'no es lista', ba: {length: 3}});
  prueba('saludo raro: pj por defecto y listas vacías', r.pj === 'salomon' && igual(r.chispas, []) && igual(r.barajitas, []) && r.anf === false);
  const mucho = N.sanearSaludo({ch: Array.from({length: 5000}, (_, i)=>'1-j' + i)});
  prueba('saludo gigante se recorta (' + mucho.chispas.length + ')', mucho.chispas.length <= 300);
  /* lo aceptado por el saludo también lo acepta el núcleo */
  const P = S.progresoNuevo(); let n = 0;
  for (const id of s.chispas) if (S.recibirPremio(P, 'chispa', id)) n++;
  for (const id of s.barajitas) if (S.recibirPremio(P, 'barajita', id)) n++;
  prueba('las chispas y barajitas del saludo entran con SALO.recibirPremio (' + n + ')', n === s.chispas.length + s.barajitas.length);
}

/* ---------------- eventos ---------------- */
{
  prueba('evento premio chispa', igual(N.sanearEvento({t: 'ev', tipo: 'premio', que: 'chispa', id: '3-j1', extra: 'x'}), {tipo: 'premio', que: 'chispa', id: '3-j1'}));
  prueba('evento premio barajita', igual(N.sanearEvento({tipo: 'premio', que: 'barajita', id: '12-b1'}), {tipo: 'premio', que: 'barajita', id: '12-b1'}));
  prueba('premio con id malo se tira', N.sanearEvento({tipo: 'premio', que: 'chispa', id: '3-b1'}) === null && N.sanearEvento({tipo: 'premio', que: 'barajita', id: '3-j1'}) === null && N.sanearEvento({tipo: 'premio', que: 'moneda', id: '3-j1'}) === null && N.sanearEvento({tipo: 'premio', que: 'chispa', id: 31}) === null);
  prueba('premio con id larguísimo se tira', N.sanearEvento({tipo: 'premio', que: 'chispa', id: '1'.repeat(40) + '-j1'}) === null);
  prueba('fx normal', igual(N.sanearEvento({tipo: 'fx', fx: 'salto', x: 1.5, y: 2, z: -3}), {tipo: 'fx', fx: 'salto', x: 1.5, y: 2, z: -3}));
  prueba('fx con números fuera de rango se recortan', igual(N.sanearEvento({tipo: 'fx', fx: 'moneda', x: 1e9, y: -1e9, z: 0}), {tipo: 'fx', fx: 'moneda', x: 500, y: -60, z: 0}));
  prueba('fx con números rotos se tira', N.sanearEvento({tipo: 'fx', fx: 'salto', x: NaN, y: 0, z: 0}) === null && N.sanearEvento({tipo: 'fx', fx: 'salto', x: Infinity, y: 0, z: 0}) === null && N.sanearEvento({tipo: 'fx', fx: 'salto', x: '1', y: 0, z: 0}) === null && N.sanearEvento({tipo: 'fx', fx: 'salto'}) === null);
  prueba('fx con nombre raro se tira', N.sanearEvento({tipo: 'fx', fx: '<img>', x: 0, y: 0, z: 0}) === null && N.sanearEvento({tipo: 'fx', fx: 'a'.repeat(30), x: 0, y: 0, z: 0}) === null && N.sanearEvento({tipo: 'fx', fx: 7, x: 0, y: 0, z: 0}) === null);
  prueba('tipos desconocidos o basura se tiran', [null, undefined, 5, 'hola', [], {}, {tipo: 'borrar'}, {tipo: '__proto__'}].every(m=>N.sanearEvento(m) === null));
}

/* ---------------- el estado usa el núcleo ---------------- */
{
  const m = S.desempaquetar({t: 'e', n: 'Pepe', pj: 'mollejuo', nv: 3, x: 1, y: 2, z: 3, a: 0.5, m: 4, su: 1, at: 'panzazo', v: 2, p: {cabeza: 'nada'}});
  prueba('SALO.desempaquetar lee un estado', m && m.pj === 'mollejuo' && m.nv === 3 && m.ataque === 'panzazo');
  prueba('SALO.desempaquetar tira uno roto', S.desempaquetar({t: 'e', x: NaN, y: 0, z: 0}) === null);
}

console.log(fallos ? '\n✗ ' + fallos + ' fallos' : '\n✓ todo bien');
process.exit(fallos ? 1 : 0);
