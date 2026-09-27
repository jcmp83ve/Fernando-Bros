(function(){
'use strict';
/* ============================================================
   LOS GRÁFICOS de Salomón y los Primos
   Todo se arma en el momento, sin archivos de imagen: texturas
   pintadas en un lienzo, bloques con bordes redondeados, cielo
   con degradado, agua con olas, pasto que se mueve con el viento,
   partículas, personajes con contorno de caricatura y sombras.
   Expone window.SALO_GFX.
   ============================================================ */
const THREE = window.THREE;
const S = window.SALO;
const GFX = {};
const lin = c=>new THREE.Color(c);

/* ---------------- tiempo compartido por los sombreadores ---------------- */
const U = {tiempo: {value: 0}, viento: {value: 1}};
GFX.U = U;

/* ============================================================
   TEXTURAS PINTADAS
   ============================================================ */
function lienzo(n){ const c = document.createElement('canvas'); c.width = c.height = n || 256; return c; }
function azar(semilla){ let s = semilla || 1; return ()=>{ s = (s*16807) % 2147483647; return (s - 1)/2147483646; }; }
function ruidoPintado(g, n, col, k, a, t, rnd){ for (let i = 0; i < k; i++){ g.fillStyle = col(rnd()); g.globalAlpha = a; const x = rnd()*n, y = rnd()*n, r = t*(0.4 + rnd()); g.beginPath(); g.arc(x, y, r, 0, Math.PI*2); g.fill(); } g.globalAlpha = 1; }
const hsl = (h, s, l)=>'hsl(' + h + ',' + s + '%,' + l + '%)';
const PINTORES = {
  pasto(g, n, r){ g.fillStyle = '#5fbf3f'; g.fillRect(0, 0, n, n); ruidoPintado(g, n, v=>hsl(95 + v*20, 55, 38 + v*18), 700, 0.35, 5, r);
    g.lineWidth = 2; for (let i = 0; i < 500; i++){ const x = r()*n, y = r()*n; g.strokeStyle = hsl(90 + r()*25, 60, 45 + r()*20); g.globalAlpha = 0.6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5)*4, y - 5 - r()*5); g.stroke(); } g.globalAlpha = 1;
    for (let i = 0; i < 18; i++){ g.fillStyle = ['#fff3bf', '#ffd8e4', '#ffffff', '#ffe066'][i % 4]; g.beginPath(); g.arc(r()*n, r()*n, 1.6, 0, 7); g.fill(); } },
  tierra(g, n, r){ g.fillStyle = '#9c6b3f'; g.fillRect(0, 0, n, n); ruidoPintado(g, n, v=>hsl(28, 40, 26 + v*22), 900, 0.3, 4, r); ruidoPintado(g, n, v=>hsl(30, 15, 55 + v*15), 70, 0.8, 3, r); },
  ladoPasto(g, n, r){ PINTORES.tierra(g, n, r); g.fillStyle = '#5fbf3f'; g.fillRect(0, 0, n, n*0.14); for (let x = 0; x < n; x += 6){ const h = n*0.14 + r()*n*0.1; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 6, 0); g.lineTo(x + 3, h); g.fill(); } ruidoPintado(g, n, v=>hsl(95, 55, 30 + v*20), 120, 0.4, 3, r); },
  arena(g, n, r){ g.fillStyle = '#ecd6a0'; g.fillRect(0, 0, n, n); ruidoPintado(g, n, v=>hsl(40, 55, 70 + v*15), 900, 0.35, 3, r); g.strokeStyle = 'rgba(160,120,60,.18)'; g.lineWidth = 3; for (let y = 10; y < n; y += 22){ g.beginPath(); for (let x = 0; x <= n; x += 8) g.lineTo(x, y + Math.sin(x/20 + y)*4); g.stroke(); } },
  adoquin(g, n, r){ g.fillStyle = '#6b6258'; g.fillRect(0, 0, n, n); const k = 8, t = n/k; for (let j = 0; j < k; j++) for (let i = 0; i < k + 1; i++){ const x = i*t - (j % 2)*t/2, y = j*t; g.fillStyle = hsl(28 + r()*16, 12 + r()*10, 52 + r()*16); rr(g, x + 2, y + 2, t - 4, t - 4, 6); g.fill(); g.fillStyle = 'rgba(255,255,255,.12)'; rr(g, x + 4, y + 3, t - 10, 5, 3); g.fill(); } },
  piedra(g, n, r){ g.fillStyle = '#8a8f96'; g.fillRect(0, 0, n, n); const k = 4, t = n/k; for (let j = 0; j < k; j++) for (let i = 0; i < k + 1; i++){ const x = i*t - (j % 2)*t/2, y = j*t; g.fillStyle = hsl(210, 6 + r()*6, 58 + r()*14); rr(g, x + 3, y + 3, t - 6, t - 6, 8); g.fill(); ruidoPintado(g, n, v=>'rgba(0,0,0,.08)', 6, 1, 4, r); } },
  roca(g, n, r){ g.fillStyle = '#7a746c'; g.fillRect(0, 0, n, n); ruidoPintado(g, n, v=>hsl(30, 8, 35 + v*30), 1300, 0.3, 6, r); g.strokeStyle = 'rgba(40,30,20,.35)'; g.lineWidth = 2; for (let i = 0; i < 14; i++){ g.beginPath(); let x = r()*n, y = r()*n; g.moveTo(x, y); for (let k = 0; k < 4; k++){ x += (r() - 0.5)*50; y += (r() - 0.5)*50; g.lineTo(x, y); } g.stroke(); } },
  ladrillo(g, n, r){ g.fillStyle = '#d9cbb3'; g.fillRect(0, 0, n, n); const fh = n/8, fw = n/4; for (let j = 0; j < 8; j++) for (let i = 0; i < 5; i++){ const x = i*fw - (j % 2)*fw/2, y = j*fh; g.fillStyle = hsl(10 + r()*14, 55, 42 + r()*12); g.fillRect(x + 2, y + 2, fw - 4, fh - 4); } },
  madera(g, n, r){ const k = 4, t = n/k; for (let i = 0; i < k; i++){ g.fillStyle = hsl(28 + r()*8, 50, 42 + r()*10); g.fillRect(0, i*t, n, t); g.strokeStyle = 'rgba(60,30,10,.25)'; g.lineWidth = 1.5; for (let l = 0; l < 6; l++){ g.beginPath(); const y = i*t + 4 + r()*(t - 8); for (let x = 0; x <= n; x += 16) g.lineTo(x, y + Math.sin(x/30 + l)*2); g.stroke(); } g.fillStyle = 'rgba(40,20,5,.55)'; g.fillRect(0, i*t, n, 3); g.beginPath(); g.arc(12, i*t + t/2, 3, 0, 7); g.arc(n - 12, i*t + t/2, 3, 0, 7); g.fill(); } },
  tablas(g, n, r){ const k = 5, t = n/k; for (let i = 0; i < k; i++){ g.fillStyle = hsl(30 + r()*6, 35, 38 + r()*14); g.fillRect(i*t, 0, t, n); g.fillStyle = 'rgba(30,15,5,.6)'; g.fillRect(i*t, 0, 3, n); ruidoPintado(g, n, v=>'rgba(80,50,20,.3)', 6, 1, 3, r); } },
  casa(g, n, r){ g.fillStyle = '#f4efe6'; g.fillRect(0, 0, n, n); ruidoPintado(g, n, v=>hsl(40, 10, 82 + v*14), 900, 0.3, 5, r); },
  tela(g, n, r){ g.fillStyle = '#ffffff'; g.fillRect(0, 0, n, n); g.fillStyle = 'rgba(0,0,0,.08)'; for (let x = 0; x < n; x += 32) g.fillRect(x, 0, 16, n); },
  metal(g, n, r){ g.fillStyle = '#8b96a3'; g.fillRect(0, 0, n, n); const t = n/2; for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++){ const gr = g.createLinearGradient(i*t, j*t, i*t + t, j*t + t); gr.addColorStop(0, '#aab4bf'); gr.addColorStop(1, '#6f7a86'); g.fillStyle = gr; g.fillRect(i*t + 3, j*t + 3, t - 6, t - 6); g.fillStyle = '#4a525c'; for (const [a, b] of [[10, 10], [t - 10, 10], [10, t - 10], [t - 10, t - 10]]){ g.beginPath(); g.arc(i*t + a, j*t + b, 3.5, 0, 7); g.fill(); } } },
  asfalto(g, n, r){ g.fillStyle = '#4b4f55'; g.fillRect(0, 0, n, n); ruidoPintado(g, n, v=>hsl(220, 5, 22 + v*30), 2200, 0.35, 2, r); },
  nieve(g, n, r){ g.fillStyle = '#f4f8ff'; g.fillRect(0, 0, n, n); ruidoPintado(g, n, v=>hsl(210, 60, 88 + v*10), 500, 0.35, 6, r); ruidoPintado(g, n, v=>'#ffffff', 80, 0.9, 1.5, r); },
  ladoNieve(g, n, r){ PINTORES.roca(g, n, r); g.fillStyle = '#f4f8ff'; g.fillRect(0, 0, n, n*0.16); for (let x = 0; x < n; x += 10){ g.beginPath(); g.arc(x + 5, n*0.16, 5 + r()*5, 0, Math.PI); g.fill(); } },
  hielo(g, n, r){ const gr = g.createLinearGradient(0, 0, n, n); gr.addColorStop(0, '#d0f0ff'); gr.addColorStop(1, '#8fd3f4'); g.fillStyle = gr; g.fillRect(0, 0, n, n); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.5; for (let i = 0; i < 10; i++){ g.beginPath(); let x = r()*n, y = r()*n; g.moveTo(x, y); for (let k = 0; k < 3; k++){ x += (r() - 0.5)*80; y += (r() - 0.5)*80; g.lineTo(x, y); } g.stroke(); } g.fillStyle = 'rgba(255,255,255,.35)'; for (let i = 0; i < 6; i++){ g.save(); g.translate(r()*n, r()*n); g.rotate(-0.7); g.fillRect(0, 0, 60, 6); g.restore(); } },
  nube(g, n, r){ g.fillStyle = '#ffffff'; g.fillRect(0, 0, n, n); ruidoPintado(g, n, v=>hsl(210, 40, 90 + v*8), 300, 0.4, 14, r); },
  caja(g, n, r){ PINTORES.madera(g, n, r); g.strokeStyle = '#6b3d14'; g.lineWidth = n*0.08; g.strokeRect(n*0.04, n*0.04, n*0.92, n*0.92); g.beginPath(); g.moveTo(n*0.1, n*0.1); g.lineTo(n*0.9, n*0.9); g.moveTo(n*0.9, n*0.1); g.lineTo(n*0.1, n*0.9); g.stroke(); g.fillStyle = '#ffd43b'; g.font = 'bold ' + (n*0.3) + 'px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.globalAlpha = 0.9; g.fillText('?', n/2, n/2 + 2); g.globalAlpha = 1; },
  rajada(g, n, r){ PINTORES.piedra(g, n, r); g.strokeStyle = '#2b2118'; g.lineWidth = 4; for (let i = 0; i < 3; i++){ g.beginPath(); let x = n*(0.3 + i*0.2), y = 0; g.moveTo(x, y); while (y < n){ x += (r() - 0.5)*40; y += 18 + r()*20; g.lineTo(x, y); } g.stroke(); } g.fillStyle = 'rgba(255,200,80,.25)'; g.fillRect(0, 0, n, n); },
  puerta(g, n, r){ PINTORES.tablas(g, n, r); g.fillStyle = '#2b2d31'; g.fillRect(0, n*0.18, n, n*0.08); g.fillRect(0, n*0.74, n, n*0.08); g.fillStyle = '#ffd43b'; g.beginPath(); g.arc(n*0.8, n*0.5, n*0.05, 0, 7); g.fill(); },
  lodo(g, n, r){ g.fillStyle = '#5c4630'; g.fillRect(0, 0, n, n); ruidoPintado(g, n, v=>hsl(30, 30, 20 + v*18), 900, 0.4, 7, r); },
  oro(g, n, r){ const gr = g.createLinearGradient(0, 0, n, n); gr.addColorStop(0, '#fff3bf'); gr.addColorStop(0.5, '#fcc419'); gr.addColorStop(1, '#e67700'); g.fillStyle = gr; g.fillRect(0, 0, n, n); },
};
function rr(g, x, y, w, h, r){ g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
const TEX = {};
function textura(nombre, metros){
  const k = nombre + '|' + (metros || 2);
  if (TEX[k]) return TEX[k];
  const c = lienzo(256), g = c.getContext('2d');
  (PINTORES[nombre] || PINTORES.casa)(g, 256, azar(nombre.length*97 + 13));
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1/(metros || 2), 1/(metros || 2));
  t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
  return TEX[k] = t;
}
/* texturas de emojis (amigos en las jaulas, iconos) */
const TEX_EMOJI = {};
function texEmoji(e, fondo){
  const k = e + (fondo || '');
  if (TEX_EMOJI[k]) return TEX_EMOJI[k];
  const c = lienzo(128), g = c.getContext('2d');
  if (fondo){ g.fillStyle = fondo; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); }
  g.font = '92px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(e, 64, 70);
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
  return TEX_EMOJI[k] = t;
}
/* un letrero: texto sobre un cartel redondeado */
function texTexto(texto, color, fondo, alto){
  const c = document.createElement('canvas'), g = c.getContext('2d');
  const tam = alto || 48;
  g.font = 'bold ' + tam + 'px Fredoka, "Trebuchet MS", sans-serif';
  const w = Math.ceil(g.measureText(texto).width) + tam, h = Math.ceil(tam*1.5);
  c.width = w; c.height = h;
  g.font = 'bold ' + tam + 'px Fredoka, "Trebuchet MS", sans-serif';
  if (fondo){ g.fillStyle = fondo; rr(g, 0, 0, w, h, h*0.35); g.fill(); }
  g.fillStyle = color || '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(texto, w/2, h/2 + 2);
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
  return {t, w, h};
}
function letrero(texto, color, fondo, alto){
  const {t, w, h} = texTexto(texto, color, fondo);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({map: t, depthWrite: false, transparent: true}));
  const k = (alto || 0.7)/h; s.scale.set(w*k, h*k, 1); s.renderOrder = 10;
  return s;
}
GFX.textura = textura; GFX.texEmoji = texEmoji; GFX.letrero = letrero;

/* ============================================================
   MATERIALES
   Toon (caricatura con tres tonos) para personajes y cosas; los
   pisos con textura y luz suave.
   ============================================================ */
let gradienteToon = null;
function gradiente(){
  if (gradienteToon) return gradienteToon;
  const d = new Uint8Array([90, 170, 255]);
  gradienteToon = new THREE.DataTexture(d, 3, 1, THREE.LuminanceFormat);
  gradienteToon.minFilter = gradienteToon.magFilter = THREE.NearestFilter; gradienteToon.needsUpdate = true;
  return gradienteToon;
}
const MATS = {};
function toon(color, o){
  const k = 'toon' + color + (o ? JSON.stringify(o) : '');
  if (MATS[k]) return MATS[k];
  const m = new THREE.MeshToonMaterial(Object.assign({color: lin(color), gradientMap: gradiente()}, o||{}));
  if (o && o.emissive) m.emissive = lin(o.emissive);
  return MATS[k] = m;
}
function brillo(color, fuerza){
  const k = 'brillo' + color + (fuerza || 1);
  if (MATS[k]) return MATS[k];
  return MATS[k] = new THREE.MeshBasicMaterial({color: lin(color).multiplyScalar(fuerza || 1), toneMapped: false});
}
const COLOR_MAT = {pasto: '#ffffff', tierra: '#ffffff', arena: '#ffffff', adoquin: '#ffffff', piedra: '#ffffff', ladrillo: '#ffffff', madera: '#ffffff', tablas: '#ffffff', casa: '#ffffff', metal: '#ffffff', asfalto: '#ffffff', nieve: '#ffffff', hielo: '#ffffff', nube: '#ffffff', tela: '#ffffff', caja: '#ffffff', rajada: '#ffffff', puerta: '#ffffff', lodo: '#ffffff', oro: '#ffffff', roca: '#ffffff'};
/* los pisos: [arriba, lados] */
function matPiso(mat, color){
  const k = 'piso' + mat + (color || '');
  if (MATS[k]) return MATS[k];
  const arriba = {pasto: 'pasto', nieve: 'nieve', casa: 'casa', tela: 'tela'}[mat] || mat;
  const lado = {pasto: 'ladoPasto', nieve: 'ladoNieve', casa: 'casa', tela: 'tela', arena: 'arena', nube: 'nube'}[mat] || mat;
  const mk = (tex, extra)=>new THREE.MeshLambertMaterial(Object.assign({map: textura(tex, mat === 'caja' || mat === 'puerta' ? 1 : mat === 'tela' ? 2 : 2.2), color: lin(color || COLOR_MAT[mat] || '#fff')}, extra||{}));
  const a = mk(arriba, mat === 'hielo' ? {emissive: lin('#1c5f7a'), emissiveIntensity: 0.25} : mat === 'oro' ? {emissive: lin('#8a5a00'), emissiveIntensity: 0.4} : null);
  const b = lado === arriba ? a : mk(lado);
  if (mat === 'casa' && color){ b.color = lin(color); a.color = lin(color).lerp(lin('#ffffff'), 0.25); }
  if (mat === 'tela' && color){ a.color = lin(color); b.color = lin(color); }
  return MATS[k] = [a, b];
}
GFX.toon = toon; GFX.brillo = brillo; GFX.matPiso = matPiso;

/* ============================================================
   GEOMETRÍAS
   ============================================================ */
const GEOS = {};
/* un bloque con los bordes redondeados (extrusión con bisel). Grupo 0 = arriba/abajo, 1 = lados */
function geoBloque(w, h, d, r){
  r = Math.max(0, Math.min(r || 0, w/2 - 0.02, d/2 - 0.02, h/2 - 0.02));
  const k = [w, h, d, r].map(v=>v.toFixed(2)).join('|');
  if (GEOS[k]) return GEOS[k];
  let g;
  if (r < 0.03){
    g = new THREE.BoxGeometry(w, h, d);
    /* coordenadas de textura en metros (para que la textura no se estire) */
    const p = g.attributes.position, n = g.attributes.normal, uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++){ const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)); if (ay > 0.5) uv.setXY(i, p.getX(i), p.getZ(i)); else if (ax > 0.5) uv.setXY(i, p.getZ(i), p.getY(i)); else uv.setXY(i, p.getX(i), p.getY(i)); }
    g.clearGroups(); g.addGroup(0, 12, 1); g.addGroup(12, 12, 0); g.addGroup(24, 12, 1);   /* +x −x · +y −y · +z −z */
  } else {
    const W = w - 2*r, D = d - 2*r, rc = Math.min(r*0.8, W/2 - 0.01, D/2 - 0.01);
    const s = new THREE.Shape();
    if (rc > 0.02){ s.moveTo(-W/2 + rc, -D/2); s.lineTo(W/2 - rc, -D/2); s.quadraticCurveTo(W/2, -D/2, W/2, -D/2 + rc); s.lineTo(W/2, D/2 - rc); s.quadraticCurveTo(W/2, D/2, W/2 - rc, D/2); s.lineTo(-W/2 + rc, D/2); s.quadraticCurveTo(-W/2, D/2, -W/2, D/2 - rc); s.lineTo(-W/2, -D/2 + rc); s.quadraticCurveTo(-W/2, -D/2, -W/2 + rc, -D/2); }
    else { s.moveTo(-W/2, -D/2); s.lineTo(W/2, -D/2); s.lineTo(W/2, D/2); s.lineTo(-W/2, D/2); s.lineTo(-W/2, -D/2); }
    const prof = Math.max(0.001, h - 2*r);
    g = new THREE.ExtrudeGeometry(s, {depth: prof, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 2, curveSegments: 2});
    g.rotateX(-Math.PI/2); g.translate(0, -prof/2, 0);
    /* los lados: textura en metros según hacia dónde miran */
    const p = g.attributes.position, n = g.attributes.normal, uv = g.attributes.uv;
    const lados = g.groups.find(q=>q.materialIndex === 1);
    if (lados) for (let i = lados.start; i < lados.start + lados.count; i++){ const ax = Math.abs(n.getX(i)), az = Math.abs(n.getZ(i)); uv.setXY(i, ax > az ? p.getZ(i) : p.getX(i), p.getY(i)); }
    const tapas = g.groups.find(q=>q.materialIndex === 0);
    if (tapas) for (let i = tapas.start; i < tapas.start + tapas.count; i++) uv.setXY(i, p.getX(i), p.getZ(i));
    g.computeVertexNormals();
  }
  return GEOS[k] = g;
}
/* un bloquecito redondeado para armar personajes */
function pieza(padre, color, w, h, d, x, y, z, o){
  o = o || {};
  const r = o.r !== undefined ? o.r : Math.min(w, h, d)*0.28;
  const m = new THREE.Mesh(geoBloque(w, h, d, r), o.mat || toon(color, o.emissive ? {emissive: o.emissive} : null));
  m.position.set(x, y, z); m.castShadow = !o.sinSombra; m.receiveShadow = false;
  padre.add(m); return m;
}
function esfera(padre, color, r, x, y, z, o){ const m = new THREE.Mesh(geoEsfera(r, (o && o.lados) || 16), (o && o.mat) || toon(color, o && o.emissive ? {emissive: o.emissive} : null)); m.position.set(x, y, z); m.castShadow = !(o && o.sinSombra); padre.add(m); return m; }
function geoEsfera(r, lados){ const k = 'esf' + r + '|' + lados; return GEOS[k] || (GEOS[k] = new THREE.SphereGeometry(r, lados, Math.max(6, lados*0.7|0))); }
function cilindro(padre, color, r0, r1, h, x, y, z, o){ const k = 'cil' + [r0, r1, h, (o && o.lados) || 14].join('|'); const g = GEOS[k] || (GEOS[k] = new THREE.CylinderGeometry(r0, r1, h, (o && o.lados) || 14)); const m = new THREE.Mesh(g, (o && o.mat) || toon(color, o && o.emissive ? {emissive: o.emissive} : null)); m.position.set(x, y, z); m.castShadow = !(o && o.sinSombra); padre.add(m); return m; }
GFX.geoBloque = geoBloque; GFX.pieza = pieza; GFX.esfera = esfera; GFX.cilindro = cilindro;

/* ---- contorno de caricatura: una copia por detrás, empujada hacia afuera, negra ---- */
const MAT_CONTORNO = new THREE.ShaderMaterial({
  uniforms: {grosor: {value: 0.035}},
  vertexShader: 'uniform float grosor; void main(){ vec3 p = position + normal*grosor; gl_Position = projectionMatrix*modelViewMatrix*vec4(p, 1.0); }',
  fragmentShader: 'void main(){ gl_FragColor = vec4(0.07, 0.05, 0.1, 1.0); }',
  side: THREE.BackSide,
});
function contornear(grupo){
  const lista = [];
  grupo.traverse(o=>{ if (o.isMesh && !o.userData.sinContorno && o.material !== MAT_CONTORNO && !(o.material && o.material.isMeshBasicMaterial)) lista.push(o); });
  for (const o of lista){ const c = new THREE.Mesh(o.geometry, MAT_CONTORNO); c.userData.sinContorno = true; c.castShadow = false; o.add(c); }
  return grupo;
}
GFX.contornear = contornear;

/* ---- juntar lo que no se mueve en pocas mallas (una por material): muchísimo más rápido ---- */
function juntarEstaticos(grupo, relativo, filtro){
  grupo.updateMatrixWorld(true);
  const cubetas = new Map();   /* material -> {pos:[], nor:[], uv:[], sombra} */
  const quitar = [];
  const nm = new THREE.Matrix3(), v = new THREE.Vector3(), mm = new THREE.Matrix4();
  const inversa = relativo ? new THREE.Matrix4().copy(grupo.matrixWorld).invert() : null;
  grupo.traverse(o=>{
    if (!o.isMesh || o.userData.noJuntar || o.material === MAT_CONTORNO || o.isInstancedMesh) return;
    if (filtro && !filtro(o)) return;
    const g0 = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const grupos = g0.groups.length ? g0.groups : [{start: 0, count: g0.attributes.position.count, materialIndex: 0}];
    const P = g0.attributes.position, N = g0.attributes.normal, UV = g0.attributes.uv;
    mm.copy(o.matrixWorld); if (inversa) mm.premultiply(inversa);
    nm.getNormalMatrix(mm);
    for (const q of grupos){
      const mat = mats[q.materialIndex] || mats[0];
      let c = cubetas.get(mat); if (!c){ c = {pos: [], nor: [], uv: [], sombra: false}; cubetas.set(mat, c); }
      c.sombra = c.sombra || o.castShadow;
      for (let i = q.start; i < q.start + q.count; i++){
        v.set(P.getX(i), P.getY(i), P.getZ(i)).applyMatrix4(mm); c.pos.push(v.x, v.y, v.z);
        if (N){ v.set(N.getX(i), N.getY(i), N.getZ(i)).applyMatrix3(nm).normalize(); c.nor.push(v.x, v.y, v.z); } else c.nor.push(0, 1, 0);
        if (UV) c.uv.push(UV.getX(i), UV.getY(i)); else c.uv.push(0, 0);
      }
    }
    quitar.push(o);
  });
  for (const o of quitar){ if (o.parent) o.parent.remove(o); }
  const salida = new THREE.Group();
  for (const [mat, c] of cubetas){
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(c.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(c.nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(c.uv, 2));
    g.computeBoundingSphere();
    const m = new THREE.Mesh(g, mat); m.castShadow = c.sombra; m.receiveShadow = !relativo; m.matrixAutoUpdate = false; m.userData.propia = true;
    salida.add(m);
  }
  return salida;
}
GFX.juntarEstaticos = juntarEstaticos;
/* juntar las piezas de un modelo en pocas mallas (una por material) sin romper lo que se anima:
   cada parte animada (brazo, pierna, ala…) se junta aparte dentro de sí misma */
function quitarContornos(g){ const q = []; g.traverse(o=>{ if (o.material === MAT_CONTORNO) q.push(o); }); q.forEach(o=>o.parent.remove(o)); }
function optimizar(g, partes, conContorno){
  quitarContornos(g);
  partes = (partes || []).filter(Boolean);
  for (const p of partes) p.traverse(o=>{ o.userData.aparte = true; });
  for (const p of partes){ if (p.isMesh) continue; const j = juntarEstaticos(p, true, o=>!o.userData.ojo); p.add(j); }
  const j = juntarEstaticos(g, true, o=>!o.userData.aparte && !o.userData.ojo); g.add(j);
  /* contorno solo en lo grande: las partes chiquitas que se mueven (patas, alas) van sin contorno */
  if (conContorno !== false){ contornear(j); for (const p of partes) if (p.isMesh ? false : p.children.length && (p.userData.conContorno || partes.length <= 5)) contornear(p); }
  return g;
}
GFX.optimizar = optimizar;

/* ============================================================
   CIELO, NIEBLA Y LUCES
   ============================================================ */
const CIELOS = {
  dia: {arriba: '#3d8ee8', horizonte: '#bfe6ff', abajo: '#e8f6ff', sol: '#fff6d8', luz: '#fff4e0', fuerza: 2.3, amb: '#bfdcff', suelo: '#6b5a3a', ambF: 0.95, niebla: '#cfe9ff', lejos: 190, exp: 1.0, solDir: [0.5, 0.8, 0.35]},
  tarde: {arriba: '#4a7bd0', horizonte: '#ffd7a8', abajo: '#ffe8cc', sol: '#ffe0a0', luz: '#ffe2b8', fuerza: 2.1, amb: '#d6c8ff', suelo: '#6b4a3a', ambF: 0.85, niebla: '#f6d6b8', lejos: 180, exp: 1.0, solDir: [0.8, 0.45, 0.2]},
  atardecer: {arriba: '#2a2d6b', horizonte: '#ff8a5c', abajo: '#ffb870', sol: '#ffb070', luz: '#ffb888', fuerza: 1.9, amb: '#8c7bd6', suelo: '#5a3a3a', ambF: 0.75, niebla: '#e89478', lejos: 170, exp: 1.05, solDir: [0.9, 0.25, -0.1]},
  noche: {arriba: '#070a24', horizonte: '#1f2a5c', abajo: '#141c40', sol: '#dfe8ff', luz: '#9fb4ff', fuerza: 1.3, amb: '#7a8ae8', suelo: '#2a2a48', ambF: 1.3, niebla: '#1a2350', lejos: 120, exp: 1.15, solDir: [-0.3, 0.8, 0.4], estrellas: true},
  tormenta: {arriba: '#141625', horizonte: '#3b3a5c', abajo: '#24253d', sol: '#aab4ff', luz: '#8a94c8', fuerza: 1.2, amb: '#8a90c8', suelo: '#2a2a3a', ambF: 1.2, niebla: '#2a2b44', lejos: 95, exp: 1.2, solDir: [0.2, 0.9, 0.3], lluvia: true},
  nublado: {arriba: '#8fa7c0', horizonte: '#dfe7ef', abajo: '#eef3f8', sol: '#ffffff', luz: '#eef4ff', fuerza: 1.5, amb: '#d8e4f0', suelo: '#8a8a8a', ambF: 1.0, niebla: '#e4ecf4', lejos: 130, exp: 1.05, solDir: [0.3, 0.9, 0.3]},
};
GFX.CIELOS = CIELOS;
function crearCielo(tema){
  const C = CIELOS[tema] || CIELOS.dia;
  const mat = new THREE.ShaderMaterial({
    uniforms: {arriba: {value: lin(C.arriba)}, horizonte: {value: lin(C.horizonte)}, abajo: {value: lin(C.abajo)}, sol: {value: lin(C.sol)}, dirSol: {value: new THREE.Vector3(...C.solDir).normalize()}, noche: {value: C.estrellas ? 1 : 0}},
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = projectionMatrix*modelViewMatrix*vec4(position, 1.0); gl_Position = p.xyww; }',
    fragmentShader: [
      'uniform vec3 arriba; uniform vec3 horizonte; uniform vec3 abajo; uniform vec3 sol; uniform vec3 dirSol; uniform float noche; varying vec3 vDir;',
      'void main(){ float h = vDir.y; vec3 c = h > 0.0 ? mix(horizonte, arriba, pow(clamp(h, 0.0, 1.0), 0.55)) : mix(horizonte, abajo, clamp(-h*3.0, 0.0, 1.0));',
      ' float s = max(dot(normalize(vDir), dirSol), 0.0); c += sol*(pow(s, 900.0)*(noche > 0.5 ? 0.9 : 2.2) + pow(s, 12.0)*0.25*(1.0 - noche*0.6));',
      ' gl_FragColor = vec4(c, 1.0); }'].join('\n'),
    side: THREE.BackSide, depthWrite: false,
  });
  const cielo = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), mat);
  cielo.renderOrder = -10; cielo.frustumCulled = false;
  const g = new THREE.Group(); g.add(cielo);
  if (C.estrellas){
    const n = 900, pos = new Float32Array(n*3), rnd = azar(77);
    for (let i = 0; i < n; i++){ const a = rnd()*Math.PI*2, e = Math.asin(0.08 + rnd()*0.92); pos[i*3] = Math.cos(a)*Math.cos(e)*380; pos[i*3 + 1] = Math.sin(e)*380; pos[i*3 + 2] = Math.sin(a)*Math.cos(e)*380; }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const est = new THREE.Points(geo, new THREE.PointsMaterial({color: '#ffffff', size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.85, depthWrite: false, fog: false}));
    g.add(est);
    const luna = new THREE.Mesh(new THREE.CircleGeometry(14, 32), new THREE.MeshBasicMaterial({color: '#fff8e0', fog: false}));
    luna.position.set(-120, 200, -260); luna.lookAt(0, 0, 0); g.add(luna);
  }
  /* nubes: tarjetas suaves que pasan despacio */
  const texN = texNubeSuave();
  const nubes = [];
  const rnd = azar(tema.length*31 + 5);
  const nn = tema === 'tormenta' ? 22 : tema === 'noche' ? 8 : 16;
  for (let i = 0; i < nn; i++){
    const s = new THREE.Sprite(new THREE.SpriteMaterial({map: texN, transparent: true, depthWrite: false, fog: false, opacity: tema === 'tormenta' ? 0.85 : tema === 'noche' ? 0.25 : 0.9, color: lin(tema === 'tormenta' ? '#4a4c68' : tema === 'atardecer' ? '#ffc6a8' : tema === 'noche' ? '#6a78b8' : '#ffffff')}));
    const a = rnd()*Math.PI*2, r = 150 + rnd()*120;
    s.position.set(Math.cos(a)*r, 45 + rnd()*60, Math.sin(a)*r); const k = 60 + rnd()*70; s.scale.set(k, k*0.45, 1);
    s.userData.v = 0.6 + rnd()*1.2; g.add(s); nubes.push(s);
  }
  g.userData.nubes = nubes;
  return g;
}
let texNube = null;
function texNubeSuave(){
  if (texNube) return texNube;
  const c = lienzo(256), g = c.getContext('2d'), r = azar(5);
  for (let i = 0; i < 26; i++){ const x = 50 + r()*156, y = 110 + (r() - 0.5)*50, rad = 25 + r()*40; const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill(); }
  texNube = new THREE.CanvasTexture(c); return texNube;
}
GFX.crearCielo = crearCielo;

/* ============================================================
   AGUA con olas, brillos y espuma en la orilla (aproximada)
   ============================================================ */
function crearAgua(tema, color, y){
  const C = CIELOS[tema] || CIELOS.dia;
  const oscuro = lin(color || (tema === 'noche' || tema === 'tormenta' ? '#1b3a5c' : tema === 'atardecer' ? '#3a4a78' : '#1f78b4'));
  const mat = new THREE.ShaderMaterial({
    uniforms: {tiempo: U.tiempo, hondo: {value: oscuro.clone().multiplyScalar(0.55)}, claro: {value: oscuro.clone().lerp(lin('#9fe8ff'), 0.45)}, cielo: {value: lin(C.horizonte)}, dirSol: {value: new THREE.Vector3(...C.solDir).normalize()}, sol: {value: lin(C.sol)},
      nieblaColor: {value: lin(C.niebla)}, nieblaLejos: {value: C.lejos}},
    vertexShader: [
      'uniform float tiempo; varying vec3 vPos; varying vec3 vNorm; varying float vDist;',
      'void main(){ vec3 p = position; vec4 w = modelMatrix*vec4(p, 1.0);',
      ' float o1 = sin(w.x*0.35 + tiempo*1.3)*0.12 + sin(w.z*0.42 + tiempo*1.1)*0.1 + sin((w.x + w.z)*0.9 + tiempo*2.3)*0.04;',
      ' w.y += o1; vPos = w.xyz;',
      ' vec3 dx = vec3(1.0, cos(w.x*0.35 + tiempo*1.3)*0.042 + cos((w.x + w.z)*0.9 + tiempo*2.3)*0.036, 0.0);',
      ' vec3 dz = vec3(0.0, cos(w.z*0.42 + tiempo*1.1)*0.042 + cos((w.x + w.z)*0.9 + tiempo*2.3)*0.036, 1.0);',
      ' vNorm = normalize(cross(dz, dx)); vec4 mv = viewMatrix*w; vDist = -mv.z; gl_Position = projectionMatrix*mv; }'].join('\n'),
    fragmentShader: [
      'uniform vec3 hondo; uniform vec3 claro; uniform vec3 cielo; uniform vec3 dirSol; uniform vec3 sol; uniform float tiempo; uniform vec3 nieblaColor; uniform float nieblaLejos;',
      'varying vec3 vPos; varying vec3 vNorm; varying float vDist;',
      'void main(){ vec3 v = normalize(cameraPosition - vPos); float fres = pow(1.0 - max(dot(v, vNorm), 0.0), 3.0);',
      ' vec3 c = mix(hondo, claro, 0.35 + 0.35*sin(vPos.x*0.08 + vPos.z*0.05));',
      ' c = mix(c, cielo, fres*0.75);',
      ' vec3 r = reflect(-v, vNorm); float s = pow(max(dot(r, dirSol), 0.0), 120.0); c += sol*s*1.6;',
      ' float vetas = pow(max(sin(vPos.x*0.7 + sin(vPos.z*0.5 + tiempo)*1.5 + tiempo*0.8)*sin(vPos.z*0.6 - tiempo*0.6), 0.0), 8.0);',
      ' c += vetas*0.12*(1.0 - fres);',
      ' float f = smoothstep(nieblaLejos*0.3, nieblaLejos, vDist); c = mix(c, nieblaColor, f);',
      ' gl_FragColor = vec4(c, 0.9); }'].join('\n'),
    transparent: true, depthWrite: true,
  });
  const g = new THREE.PlaneGeometry(700, 700, 140, 140); g.rotateX(-Math.PI/2);
  const m = new THREE.Mesh(g, mat); m.position.y = y; m.receiveShadow = false; m.userData.noJuntar = true;
  return m;
}
GFX.crearAgua = crearAgua;

/* ============================================================
   PASTO QUE SE MUEVE: matas en instancias sobre los pisos de pasto
   ============================================================ */
function crearPasto(cajas, rndSemilla, color, tope){
  const tops = cajas.filter(c=>c.mat === 'pasto' && !c.mueve && !c.cae && c.visible !== false);
  if (!tops.length) return null;
  const rnd = azar(rndSemilla || 3);
  const pos = [];
  for (const c of tops){
    const area = (c.x1 - c.x0)*(c.z1 - c.z0);
    const n = Math.min(1400, Math.floor(area*1.6));
    for (let i = 0; i < n; i++){ pos.push(c.x0 + 0.3 + rnd()*(c.x1 - c.x0 - 0.6), c.y1, c.z0 + 0.3 + rnd()*(c.z1 - c.z0 - 0.6), rnd()); }
  }
  if (!pos.length) return null;
  const total = Math.min(tope === undefined ? 14000 : tope, pos.length/4);
  if (total < 1) return null;
  /* una mata: tres hojitas cruzadas */
  const hoja = new THREE.BufferGeometry();
  const v = [], col = [];
  for (let k = 0; k < 5; k++){ const a = k/5*Math.PI*2, b = a + 0.5; const ox = Math.cos(a)*0.1, oz = Math.sin(a)*0.1; v.push(ox - Math.cos(b)*0.05, 0, oz - Math.sin(b)*0.05, ox + Math.cos(b)*0.05, 0, oz + Math.sin(b)*0.05, ox*1.8, 0.2 + (k % 2)*0.06, oz*1.8); col.push(0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 1.05, 1.05, 1.05); }
  hoja.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  hoja.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  hoja.computeVertexNormals();
  const mat = new THREE.MeshLambertMaterial({color: lin(color || '#6fcf4a'), vertexColors: true, side: THREE.DoubleSide});
  mat.onBeforeCompile = sh=>{
    sh.uniforms.tiempo = U.tiempo;
    sh.vertexShader = 'uniform float tiempo;\n' + sh.vertexShader.replace('#include <begin_vertex>', [
      'vec3 transformed = vec3(position);',
      'vec4 wp = instanceMatrix*vec4(0.0, 0.0, 0.0, 1.0);',
      'float sway = sin(tiempo*2.2 + wp.x*0.6 + wp.z*0.4)*0.09 + sin(tiempo*3.7 + wp.x*1.3)*0.03;',
      'transformed.x += sway*position.y*3.0; transformed.z += sway*position.y*1.5;'].join('\n'));
    sh.vertexShader = sh.vertexShader.replace('#include <beginnormal_vertex>', 'vec3 objectNormal = vec3(0.0, 1.0, 0.0);');
  };
  const im = new THREE.InstancedMesh(hoja, mat, total);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
  for (let i = 0; i < total; i++){
    const j = Math.floor(i*pos.length/4/total)*4;
    e.set(0, pos[j + 3]*6.28, 0); q.setFromEuler(e); const k = 0.55 + pos[j + 3]*0.5; s.set(k, k*(0.8 + pos[j + 3]*0.5), k);
    p.set(pos[j], pos[j + 1], pos[j + 2]); m4.compose(p, q, s); im.setMatrixAt(i, m4);
  }
  im.receiveShadow = true; im.userData.noJuntar = true; im.frustumCulled = false;
  return im;
}
GFX.crearPasto = crearPasto;

/* ============================================================
   PARTÍCULAS: puntos suaves (polvo, chispitas, confeti, lluvia…)
   ============================================================ */
function crearParticulas(max, aditivo){
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(max*3), col = new Float32Array(max*3), tam = new Float32Array(max), alfa = new Float32Array(max);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('tam', new THREE.BufferAttribute(tam, 1));
  geo.setAttribute('alfa', new THREE.BufferAttribute(alfa, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: {escala: {value: 300}},
    vertexShader: 'attribute float tam; attribute float alfa; varying vec3 vColor; varying float vAlfa; uniform float escala; void main(){ vColor = color; vAlfa = alfa; vec4 mv = modelViewMatrix*vec4(position, 1.0); gl_PointSize = tam*escala/max(-mv.z, 0.1); gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'varying vec3 vColor; varying float vAlfa; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); if (r > 0.5) discard; float a = smoothstep(0.5, 0.15, r)*vAlfa; gl_FragColor = vec4(vColor, a); }',
    vertexColors: true, transparent: true, depthWrite: false, blending: aditivo ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
  const pts = new THREE.Points(geo, mat); pts.frustumCulled = false; pts.userData.noJuntar = true;
  const P = {pts, max, vivos: [], libres: [...Array(max).keys()].reverse()};
  P.emitir = (x, y, z, o)=>{
    const i = P.libres.pop(); if (i === undefined) return;
    const c = lin(o.color || '#fff');
    P.vivos.push({i, x, y, z, vx: o.vx || 0, vy: o.vy || 0, vz: o.vz || 0, g: o.g === undefined ? 9 : o.g, vida: o.vida || 1, t: 0, tam: o.tam || 0.3, tam1: o.tam1 === undefined ? (o.tam || 0.3) : o.tam1, c, roce: o.roce || 0});
  };
  P.paso = dt=>{
    for (let k = P.vivos.length - 1; k >= 0; k--){
      const p = P.vivos[k]; p.t += dt;
      if (p.t >= p.vida){ tam[p.i] = 0; alfa[p.i] = 0; P.libres.push(p.i); P.vivos.splice(k, 1); continue; }
      p.vy -= p.g*dt; if (p.roce){ const f = Math.max(0, 1 - p.roce*dt); p.vx *= f; p.vy *= f; p.vz *= f; }
      p.x += p.vx*dt; p.y += p.vy*dt; p.z += p.vz*dt;
      const u = p.t/p.vida;
      pos[p.i*3] = p.x; pos[p.i*3 + 1] = p.y; pos[p.i*3 + 2] = p.z;
      col[p.i*3] = p.c.r; col[p.i*3 + 1] = p.c.g; col[p.i*3 + 2] = p.c.b;
      tam[p.i] = lerp(p.tam, p.tam1, u); alfa[p.i] = u < 0.15 ? u/0.15 : 1 - Math.max(0, (u - 0.5)/0.5);
    }
    geo.attributes.position.needsUpdate = geo.attributes.color.needsUpdate = geo.attributes.tam.needsUpdate = geo.attributes.alfa.needsUpdate = true;
  };
  return P;
}
const lerp = (a, b, t)=>a + (b - a)*t;
GFX.crearParticulas = crearParticulas;

/* un halo que brilla (para chispas, faroles, monedas lejanas) */
let texHalo = null;
function halo(color, tam){
  if (!texHalo){ const c = lienzo(128), g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); texHalo = new THREE.CanvasTexture(c); }
  const s = new THREE.Sprite(new THREE.SpriteMaterial({map: texHalo, color: lin(color), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.8}));
  s.scale.set(tam, tam, 1); s.userData.noJuntar = true; s.material.opacity = 0.55;
  return s;
}
GFX.halo = halo;

/* ============================================================
   PERSONAJES
   ============================================================ */
function ojos(g, y, z, sep, tam){
  const k = tam || 1, o = [];
  for (const s of [-1, 1]){
    const blanco = pieza(g, '#ffffff', 0.15*k, 0.2*k, 0.05, s*sep, y, z, {r: 0.02, mat: brillo('#ffffff', 1.1), sinSombra: true});
    const nina = pieza(g, '#1c7ed6', 0.09*k, 0.12*k, 0.03, s*sep, y - 0.01, z + 0.025, {r: 0.015, mat: brillo('#3aa0ff', 1.2), sinSombra: true});
    const luz = pieza(g, '#ffffff', 0.03*k, 0.03*k, 0.02, s*sep + 0.02*k, y + 0.03*k, z + 0.04, {r: 0.005, mat: brillo('#ffffff', 1.5), sinSombra: true});
    for (const e of [blanco, nina, luz]) e.userData.ojo = true;
    o.push(blanco, nina, luz);
  }
  return o;
}
/* un personaje de bloques, como las figuras de la foto: pantallita en el pecho, ojos que brillan y parpadean */
function modeloPj(pj, puesto){
  const g = new THREE.Group(), cuerpo = new THREE.Group(), cabeza = new THREE.Group(), brazos = [], piernas = [];
  g.add(cuerpo); cuerpo.add(cabeza);
  const pierna = (color, x, w)=>{ const p = new THREE.Group(); p.position.set(x, 0.5, 0); cuerpo.add(p); pieza(p, color, w || 0.24, 0.42, 0.28, 0, -0.22, 0); pieza(p, '#3b2a1a', (w || 0.24) + 0.03, 0.12, 0.34, 0, -0.44, 0.03); piernas.push(p); return p; };
  const brazo = (color, x, piel)=>{ const p = new THREE.Group(); p.position.set(x, 1.02, 0); cuerpo.add(p); pieza(p, color, 0.16, 0.36, 0.18, 0, -0.16, 0); pieza(p, piel || '#f1c27d', 0.15, 0.13, 0.15, 0, -0.38, 0); brazos.push(p); return p; };
  let ojosM;
  if (pj === 'salomon'){
    pierna('#1c3d7a', -0.15); pierna('#1c3d7a', 0.15);
    pieza(cuerpo, '#d62828', 0.64, 0.56, 0.38, 0, 0.8, 0);                     /* el suéter rojo */
    pieza(cuerpo, '#111111', 0.44, 0.06, 0.02, 0, 0.92, 0.2, {r: 0.01}); pieza(cuerpo, '#111111', 0.07, 0.3, 0.02, 0, 0.82, 0.2, {r: 0.01});
    pieza(cuerpo, '#ffd8a8', 0.32, 0.17, 0.02, 0, 0.66, 0.2, {r: 0.02, mat: brillo('#ffe9c8', 1.05)});   /* la pantallita del pecho */
    brazo('#d62828', -0.42, '#c68642'); brazo('#d62828', 0.42, '#c68642');
    pieza(cabeza, '#c68642', 0.52, 0.48, 0.46, 0, 0, 0);
    pieza(cabeza, '#2a1a0a', 0.58, 0.2, 0.52, 0, 0.26, -0.02); pieza(cabeza, '#2a1a0a', 0.2, 0.14, 0.12, 0.12, 0.22, 0.24); pieza(cabeza, '#2a1a0a', 0.14, 0.12, 0.1, -0.14, 0.24, 0.24);
    ojosM = ojos(cabeza, 0.03, 0.235, 0.11);
    pieza(cabeza, '#7a2e1a', 0.16, 0.05, 0.02, 0, -0.13, 0.235, {r: 0.01});
    cabeza.position.y = 1.32;
  } else if (pj === 'primo'){
    pierna('#212529', -0.15); pierna('#212529', 0.15);
    pieza(cuerpo, '#2f9e44', 0.62, 0.56, 0.36, 0, 0.82, 0);
    pieza(cuerpo, '#9fffb0', 0.32, 0.17, 0.02, 0, 0.86, 0.19, {r: 0.02, mat: brillo('#7dff95', 1.05)});
    for (const s of [-1, 1]) pieza(cuerpo, '#ffd43b', 0.1, 0.1, 0.05, s*0.18, 0.66, 0.19, {r: 0.02});
    brazo('#2f9e44', -0.41); brazo('#2f9e44', 0.41);
    pieza(cabeza, '#f1c27d', 0.5, 0.5, 0.44, 0, 0, 0);
    pieza(cabeza, '#5a3a1a', 0.54, 0.16, 0.46, 0, 0.18, -0.03);
    pieza(cabeza, '#2f9e44', 0.56, 0.2, 0.52, 0, 0.34, 0); pieza(cabeza, '#2f9e44', 0.5, 0.06, 0.26, 0, 0.26, 0.3, {r: 0.02});   /* la gorra verde */
    pieza(cabeza, '#ffffff', 0.16, 0.16, 0.03, 0, 0.36, 0.27, {r: 0.05});
    ojosM = ojos(cabeza, 0.05, 0.225, 0.11);
    pieza(cabeza, '#d08050', 0.14, 0.12, 0.1, 0, -0.06, 0.25);
    pieza(cabeza, '#1a1a1a', 0.34, 0.07, 0.05, 0, -0.14, 0.235, {r: 0.02});      /* el bigote */
    cabeza.position.y = 1.35;
  } else if (pj === 'mollejuo'){
    pierna('#1c3d7a', -0.18, 0.28); pierna('#1c3d7a', 0.18, 0.28);
    pieza(cuerpo, '#1c3d7a', 0.84, 0.64, 0.54, 0, 0.76, 0);                   /* la panza en braga azul */
    pieza(cuerpo, '#ff8787', 0.32, 0.18, 0.02, 0, 0.82, 0.28, {r: 0.02, mat: brillo('#ff9a9a', 1.05)});
    for (const s of [-1, 1]) pieza(cuerpo, '#ffd43b', 0.12, 0.12, 0.05, s*0.24, 0.98, 0.28, {r: 0.03});
    brazo('#e03131', -0.52); brazo('#e03131', 0.52);
    pieza(cabeza, '#f1c27d', 0.56, 0.5, 0.46, 0, 0, 0);
    pieza(cabeza, '#6b3a1a', 0.6, 0.22, 0.5, 0, 0.26, -0.02);
    ojosM = ojos(cabeza, 0.05, 0.24, 0.12);
    pieza(cabeza, '#d08050', 0.16, 0.14, 0.1, 0, -0.06, 0.27);
    pieza(cabeza, '#1a1a1a', 0.42, 0.08, 0.05, 0, -0.15, 0.245, {r: 0.02});
    cabeza.position.y = 1.36;
  } else if (pj === 'chinita'){
    pieza(cuerpo, '#ffa8c5', 0.84, 0.9, 0.62, 0, 0.45, 0);
    pieza(cuerpo, '#ffc9dc', 0.6, 0.45, 0.4, 0, 1.1, 0);
    pieza(cuerpo, '#ffe3ef', 0.26, 0.18, 0.02, 0, 1.12, 0.21, {r: 0.02, mat: brillo('#ffc0dc', 1.1)});
    brazo('#ffc9dc', -0.36, '#ffe0bd'); brazo('#ffc9dc', 0.36, '#ffe0bd'); brazos.forEach(b=>b.position.y = 1.3);
    pieza(cabeza, '#ffe0bd', 0.46, 0.46, 0.42, 0, 0, 0);
    pieza(cabeza, '#ffd43b', 0.6, 0.3, 0.5, 0, 0.26, -0.04); pieza(cabeza, '#ffd43b', 0.14, 0.62, 0.4, -0.28, -0.08, -0.05); pieza(cabeza, '#ffd43b', 0.14, 0.62, 0.4, 0.28, -0.08, -0.05);
    pieza(cabeza, '#fcc419', 0.34, 0.14, 0.3, 0, 0.46, 0, {emissive: '#fab005'});
    ojosM = ojos(cabeza, 0.04, 0.215, 0.1);
    cabeza.position.y = 1.58;
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.045, 8, 36), brillo('#ffe066', 1.3)); aro.position.set(0, 1.7, -0.32); g.add(aro); aro.userData.sinContorno = true;
  }
  vestir({cabeza, cuerpo}, pj, puesto);
  optimizar(cuerpo, [cabeza, ...brazos, ...piernas, cuerpo.userData.capa]);
  g.userData = {cuerpo, cabeza, brazos, piernas, ojos: ojosM, pj, parpadeo: Math.random()*4};
  return g;
}
/* los gorros y adornos de la tienda */
function vestir(partes, pj, puesto){
  puesto = puesto || {};
  const c = partes.cabeza, alto = pj === 'primo' ? 0.46 : pj === 'mollejuo' ? 0.4 : 0.38;
  const it = id=>S.TIENDA.find(t=>t.id === id);
  const cab = it(puesto.cabeza);
  if (cab){
    const g = new THREE.Group(); g.position.y = alto; c.add(g); g.userData.adorno = true;
    if (pj === 'primo') c.children.filter(m=>m.position.y > 0.3).forEach(m=>m.visible = false);
    if (cab.tipo === 'gorra'){ pieza(g, cab.color, 0.58, 0.2, 0.54, 0, 0, 0); pieza(g, cab.color, 0.52, 0.06, 0.28, 0, -0.08, 0.32, {r: 0.02}); pieza(g, '#ffd43b', 0.18, 0.14, 0.03, 0, 0.02, 0.27, {r: 0.04}); }
    else if (cab.tipo === 'sombrero'){ cilindro(g, cab.color, 0.55, 0.55, 0.06, 0, -0.04, 0, {lados: 20}); cilindro(g, cab.color, 0.26, 0.3, 0.3, 0, 0.12, 0); cilindro(g, '#3b2a1a', 0.305, 0.305, 0.07, 0, 0.02, 0); }
    else if (cab.tipo === 'pescador'){ cilindro(g, cab.color, 0.42, 0.45, 0.08, 0, -0.04, 0, {lados: 18}); esfera(g, cab.color, 0.3, 0, 0.06, 0); }
    else if (cab.tipo === 'casco'){ esfera(g, cab.color, 0.34, 0, 0, 0); cilindro(g, cab.color, 0.42, 0.42, 0.05, 0, -0.08, 0.02, {lados: 20}); pieza(g, '#ffffff', 0.1, 0.1, 0.05, 0, 0.1, 0.3, {mat: brillo('#fffbe0', 1.3)}); }
    else if (cab.tipo === 'corona'){ cilindro(g, cab.color, 0.24, 0.26, 0.2, 0, 0.04, 0, {lados: 8, emissive: '#8a5a00'}); for (let i = 0; i < 5; i++){ const a = i/5*Math.PI*2; esfera(g, '#ff4d6d', 0.05, Math.cos(a)*0.24, 0.16, Math.sin(a)*0.24, {emissive: '#a61e4d'}); } }
    else if (cab.tipo === 'pirata'){ pieza(g, cab.color, 0.7, 0.18, 0.4, 0, 0.02, 0, {r: 0.08}); pieza(g, cab.color, 0.4, 0.2, 0.3, 0, 0.14, 0); pieza(g, '#ffffff', 0.12, 0.1, 0.02, 0, 0.1, 0.21, {r: 0.03}); }
  }
  const cara = it(puesto.cara);
  if (cara){ const g = new THREE.Group(); g.position.set(0, 0.05, 0.25); c.add(g); for (const s of [-1, 1]) pieza(g, '#111', 0.18, 0.12, 0.03, s*0.11, 0, 0, {r: 0.03}); pieza(g, '#111', 0.08, 0.03, 0.02, 0, 0.03, 0, {r: 0.01}); }
  const esp = it(puesto.espalda);
  if (esp){ const capa = pieza(partes.cuerpo, esp.color, 0.62, 0.8, 0.05, 0, 0.72, -0.24, {r: 0.02, emissive: '#2b1a6a'}); capa.rotation.x = 0.12; partes.cuerpo.userData.capa = capa; }
}
GFX.modeloPj = modeloPj;
/* animar un personaje: caminar, saltar, atacar, parpadear, estirarse al saltar y aplastarse al caer */
function animarPj(m, o, t, dt){
  const u = m.userData, k = Math.min(1, (o.anda || 0)/6);
  const f = t*(u.pj === 'mollejuo' ? 10 : 13);
  const aire = !o.suelo;
  u.piernas.forEach((p, i)=>{ p.rotation.x = aire ? (i ? 0.6 : -0.5) : Math.sin(f + i*Math.PI)*0.8*k; });
  u.brazos.forEach((b, i)=>{ b.rotation.x = aire ? -2.4 + (i ? 0.3 : 0) : -Math.sin(f + i*Math.PI)*0.7*k; b.rotation.z = aire ? (i ? -0.3 : 0.3) : 0; });
  u.cuerpo.position.y = aire ? 0 : Math.abs(Math.sin(f))*0.07*k + Math.sin(t*2.2)*0.012*(1 - k);
  u.cabeza.rotation.x = aire ? -0.1 : 0;
  /* estirar y aplastar */
  let sx = 1, sy = 1;
  if (o.saltoT !== undefined && t - o.saltoT < 0.25){ const q = (t - o.saltoT)/0.25; sy = 1 + 0.18*(1 - q); sx = 1 - 0.08*(1 - q); }
  if (o.aterriza > 0){ const q = o.aterriza/0.18; sy = 1 - 0.22*q; sx = 1 + 0.14*q; }
  /* ataques */
  if (o.ataque > 0){
    if (o.ataqueTipo === 'pedrada'){ u.brazos[1].rotation.x = -2.6 + (0.25 - o.ataque)*14; }
    else if (o.ataqueTipo === 'patada'){ u.cuerpo.rotation.y = (0.4 - o.ataque)/0.4*Math.PI*2; u.piernas[1].rotation.x = -1.4; }
    else if (o.ataqueTipo === 'panzazo'){ const q = Math.sin((0.5 - o.ataque)/0.5*Math.PI); sx *= 1 + 0.35*q; sy *= 1 - 0.12*q; u.brazos.forEach(b=>b.rotation.z = (b === u.brazos[0] ? 1 : -1)*1.2*q); }
  } else u.cuerpo.rotation.y = 0;
  u.cuerpo.scale.set(sx, sy, sx);
  if (u.cuerpo.userData.capa) u.cuerpo.userData.capa.rotation.x = 0.15 + k*0.5 + (aire ? 0.6 : 0) + Math.sin(t*6)*0.05;
  /* parpadeo */
  u.parpadeo -= dt;
  const cerrado = u.parpadeo < 0.12;
  if (u.parpadeo < 0) u.parpadeo = 2.5 + Math.random()*3;
  if (u.ojos) for (const e of u.ojos) e.scale.y = cerrado ? 0.1 : 1;
}
GFX.animarPj = animarPj;

/* ============================================================
   ENEMIGOS Y JEFES
   ============================================================ */
function ojosBravos(g, y, z, sep, k){
  for (const s of [-1, 1]){
    pieza(g, '#fff', 0.16*k, 0.16*k, 0.05, s*sep, y, z, {r: 0.03*k, mat: brillo('#ffffff', 1.1), sinSombra: true});
    pieza(g, '#000', 0.08*k, 0.1*k, 0.03, s*sep, y - 0.01, z + 0.03, {r: 0.02*k, mat: brillo('#111111'), sinSombra: true});
    const ceja = pieza(g, '#111', 0.2*k, 0.05*k, 0.04, s*sep, y + 0.11*k, z + 0.02, {r: 0.01, sinSombra: true}); ceja.rotation.z = s*0.45;
  }
}
function modeloEnemigo(tipo, k){
  k = k || 1;
  const g = new THREE.Group(), c = new THREE.Group(); g.add(c);
  const alas = [], patas = [];
  if (tipo === 'nubecita' || tipo === 'nublao'){
    const gris = tipo === 'nublao' ? '#3a3a52' : '#6a6a82';
    for (const [x, y, z, r] of [[0, 0, 0, 0.55], [0.45, -0.05, 0, 0.42], [-0.45, -0.05, 0, 0.42], [0.2, 0.3, 0, 0.38], [-0.22, 0.26, 0.05, 0.36]]) esfera(c, gris, r*k, x*k, y*k + 0.6*k, z*k, {lados: 14});
    ojosBravos(c, 0.62*k, 0.5*k, 0.17*k, k);
    pieza(c, '#111', 0.26*k, 0.05*k, 0.04, 0, 0.44*k, 0.52*k, {r: 0.01});
    if (tipo === 'nublao'){ for (const s of [-1, 1]){ const r = pieza(c, '#ffe066', 0.18*k, 1.1*k, 0.18*k, s*0.9*k, -0.4*k, 0.2*k, {mat: brillo('#ffe066', 1.4)}); r.rotation.z = s*0.35; } pieza(c, '#fcc419', 0.5*k, 0.2*k, 0.4*k, 0, 1.15*k, 0, {emissive: '#e67700'}); }
  } else if (tipo === 'cangrejo' || tipo === 'cangrejote'){
    esfera(c, '#e8590c', 0.42*k, 0, 0.4*k, 0, {lados: 16}).scale.set(1.3, 0.65, 1);
    for (const s of [-1, 1]){ const p = new THREE.Group(); p.position.set(s*0.62*k, 0.45*k, 0.25*k); c.add(p); esfera(p, '#fd7e14', 0.22*k, 0, 0, 0.1*k).scale.set(1, 0.7, 1.3); pieza(p, '#e8590c', 0.08*k, 0.3*k, 0.08*k, -s*0.1*k, -0.1*k, -0.1*k); patas.push(p); }
    for (let i = 0; i < 3; i++) for (const s of [-1, 1]){ const pt = pieza(c, '#c92a2a', 0.36*k, 0.06*k, 0.06*k, s*0.5*k, 0.2*k, (i - 1)*0.18*k, {r: 0.02}); pt.rotation.z = s*0.6; }
    for (const s of [-1, 1]){ cilindro(c, '#e8590c', 0.03*k, 0.03*k, 0.3*k, s*0.15*k, 0.72*k, 0.2*k); esfera(c, '#fff', 0.08*k, s*0.15*k, 0.88*k, 0.22*k, {mat: brillo('#ffffff')}); esfera(c, '#000', 0.04*k, s*0.15*k, 0.9*k, 0.29*k, {mat: brillo('#111')}); }
  } else if (tipo === 'zancudo' || tipo === 'zancudote'){
    esfera(c, '#495057', 0.22*k, 0, 0, -0.2*k).scale.set(0.8, 0.8, 1.6);
    esfera(c, '#343a40', 0.16*k, 0, 0.05*k, 0.18*k);
    cilindro(c, '#212529', 0.012*k, 0.02*k, 0.45*k, 0, 0.0, 0.45*k).rotation.x = Math.PI/2;
    for (const s of [-1, 1]){ const a = new THREE.Mesh(new THREE.PlaneGeometry(0.55*k, 0.22*k), new THREE.MeshBasicMaterial({color: '#e7f5ff', transparent: true, opacity: 0.6, side: THREE.DoubleSide})); a.position.set(s*0.3*k, 0.18*k, 0); a.userData.sinContorno = true; c.add(a); alas.push(a); }
    for (const s of [-1, 1]){ esfera(c, '#ff4d4d', 0.06*k, s*0.08*k, 0.12*k, 0.28*k, {mat: brillo('#ff5a5a', 1.2)}); }
    for (let i = 0; i < 3; i++) for (const s of [-1, 1]){ const p = cilindro(c, '#212529', 0.01*k, 0.01*k, 0.4*k, s*0.12*k, -0.2*k, (i - 1)*0.12*k); p.rotation.z = s*0.5; }
    if (tipo === 'zancudote') pieza(c, '#fcc419', 0.28*k, 0.12*k, 0.28*k, 0, 0.26*k, 0.18*k, {emissive: '#e67700'});
  } else if (tipo === 'chivo' || tipo === 'chivote'){
    pieza(c, '#f1f3f5', 0.6*k, 0.5*k, 0.95*k, 0, 0.7*k, 0);
    pieza(c, '#e9ecef', 0.34*k, 0.38*k, 0.42*k, 0, 1.0*k, 0.55*k);
    for (const s of [-1, 1]){ const cu = pieza(c, '#868e96', 0.08*k, 0.36*k, 0.08*k, s*0.12*k, 1.28*k, 0.44*k, {r: 0.03}); cu.rotation.x = -0.7; cu.rotation.z = s*0.3; }
    pieza(c, '#adb5bd', 0.12*k, 0.2*k, 0.1*k, 0, 0.78*k, 0.72*k, {r: 0.03});
    ojosBravos(c, 1.06*k, 0.77*k, 0.1*k, k*0.7);
    for (const [x, z] of [[-0.2, -0.3], [0.2, -0.3], [-0.2, 0.3], [0.2, 0.3]]){ const p = pieza(c, '#495057', 0.12*k, 0.45*k, 0.12*k, x*k, 0.22*k, z*k, {r: 0.03}); patas.push(p); }
  } else if (tipo === 'iguana'){
    pieza(c, '#51cf66', 0.36*k, 0.26*k, 0.9*k, 0, 0.22*k, 0, {r: 0.1});
    pieza(c, '#40c057', 0.28*k, 0.22*k, 0.34*k, 0, 0.3*k, 0.55*k, {r: 0.08});
    const cola = pieza(c, '#37b24d', 0.14*k, 0.12*k, 0.8*k, 0, 0.18*k, -0.75*k, {r: 0.05}); cola.rotation.x = -0.1;
    for (let i = 0; i < 5; i++) pieza(c, '#fab005', 0.04*k, 0.1*k, 0.08*k, 0, 0.38*k, (0.3 - i*0.18)*k, {r: 0.01});
    ojosBravos(c, 0.36*k, 0.72*k, 0.08*k, k*0.55);
    for (const [x, z] of [[-0.22, -0.25], [0.22, -0.25], [-0.22, 0.25], [0.22, 0.25]]) patas.push(pieza(c, '#2b8a3e', 0.1*k, 0.18*k, 0.1*k, x*k, 0.08*k, z*k, {r: 0.03}));
  } else if (tipo === 'robot'){
    pieza(c, '#868e96', 0.8*k, 0.7*k, 0.6*k, 0, 0.75*k, 0, {r: 0.06});
    pieza(c, '#495057', 0.5*k, 0.36*k, 0.44*k, 0, 1.3*k, 0, {r: 0.05});
    pieza(c, '#ff2020', 0.32*k, 0.08*k, 0.04*k, 0, 1.32*k, 0.23*k, {mat: brillo('#ff3030', 1.5)});
    cilindro(c, '#343a40', 0.02*k, 0.02*k, 0.3*k, 0, 1.6*k, 0); esfera(c, '#ffd43b', 0.06*k, 0, 1.78*k, 0, {mat: brillo('#ffd43b', 1.3)});
    pieza(c, '#fab005', 0.8*k, 0.08*k, 0.62*k, 0, 0.55*k, 0, {r: 0.02});
    for (const s of [-1, 1]){ patas.push(pieza(c, '#495057', 0.2*k, 0.4*k, 0.26*k, s*0.22*k, 0.2*k, 0, {r: 0.04})); const b = pieza(c, '#adb5bd', 0.14*k, 0.5*k, 0.14*k, s*0.52*k, 0.8*k, 0, {r: 0.04}); alas.push(b); }
  } else if (tipo === 'pirata' || tipo === 'capitan'){
    for (const s of [-1, 1]) patas.push(pieza(c, s < 0 || tipo !== 'capitan' ? '#343a40' : '#8d5524', 0.2*k, 0.5*k, 0.24*k, s*0.14*k, 0.25*k, 0));
    pieza(c, '#f1f3f5', 0.6*k, 0.6*k, 0.36*k, 0, 0.8*k, 0); for (let i = 0; i < 3; i++) pieza(c, '#e03131', 0.61*k, 0.07*k, 0.37*k, 0, (0.62 + i*0.16)*k, 0, {r: 0.01});
    pieza(c, '#e0a070', 0.46*k, 0.44*k, 0.42*k, 0, 1.34*k, 0);
    pieza(c, '#212529', 0.7*k, 0.16*k, 0.4*k, 0, 1.62*k, 0, {r: 0.06}); pieza(c, '#212529', 0.36*k, 0.2*k, 0.3*k, 0, 1.74*k, 0);
    pieza(c, '#111', 0.14*k, 0.12*k, 0.03*k, -0.1*k, 1.38*k, 0.22*k, {r: 0.02}); pieza(c, '#fff', 0.1*k, 0.12*k, 0.03*k, 0.1*k, 1.38*k, 0.22*k, {mat: brillo('#fff')});
    pieza(c, '#6b3a1a', 0.3*k, 0.08*k, 0.05*k, 0, 1.2*k, 0.22*k, {r: 0.02});
    for (const s of [-1, 1]) alas.push(pieza(c, '#e0a070', 0.14*k, 0.46*k, 0.16*k, s*0.4*k, 0.84*k, 0));
    const espada = pieza(c, '#dee2e6', 0.05*k, 0.7*k, 0.1*k, 0.46*k, 0.9*k, 0.3*k, {r: 0.01}); espada.rotation.x = 0.9;
  } else if (tipo === 'pinguino'){
    esfera(c, '#212529', 0.4*k, 0, 0.5*k, 0).scale.set(1, 1.25, 0.9);
    esfera(c, '#ffffff', 0.3*k, 0, 0.45*k, 0.16*k).scale.set(1, 1.2, 0.7);
    pieza(c, '#ffa94d', 0.14*k, 0.08*k, 0.16*k, 0, 0.72*k, 0.38*k, {r: 0.03});
    ojosBravos(c, 0.84*k, 0.3*k, 0.1*k, k*0.6);
    for (const s of [-1, 1]){ alas.push(pieza(c, '#212529', 0.08*k, 0.4*k, 0.2*k, s*0.4*k, 0.5*k, 0, {r: 0.03})); patas.push(pieza(c, '#ffa94d', 0.14*k, 0.06*k, 0.2*k, s*0.14*k, 0.03*k, 0.08*k, {r: 0.02})); }
    pieza(c, '#e03131', 0.6*k, 0.1*k, 0.5*k, 0, 0.98*k, 0, {r: 0.04});   /* bufanda */
  } else if (tipo === 'murcielago'){
    esfera(c, '#5f3dc4', 0.26*k, 0, 0, 0);
    for (const s of [-1, 1]){ const a = pieza(c, '#4c2a9e', 0.6*k, 0.04*k, 0.34*k, s*0.45*k, 0.02*k, 0, {r: 0.02}); alas.push(a); pieza(c, '#5f3dc4', 0.08*k, 0.16*k, 0.06*k, s*0.12*k, 0.28*k, 0, {r: 0.02}); }
    for (const s of [-1, 1]){ esfera(c, '#ffd43b', 0.05*k, s*0.09*k, 0.06*k, 0.22*k, {mat: brillo('#ffe066', 1.4)}); }
  } else if (tipo === 'payaso'){
    for (const s of [-1, 1]) patas.push(pieza(c, s < 0 ? '#4dabf7' : '#ffd43b', 0.22*k, 0.5*k, 0.26*k, s*0.15*k, 0.25*k, 0));
    pieza(c, '#f783ac', 0.66*k, 0.6*k, 0.4*k, 0, 0.8*k, 0); for (let i = 0; i < 3; i++) esfera(c, ['#ffd43b', '#4dabf7', '#51cf66'][i], 0.06*k, 0, (0.66 + i*0.15)*k, 0.21*k);
    pieza(c, '#fff5f5', 0.48*k, 0.44*k, 0.42*k, 0, 1.34*k, 0);
    esfera(c, '#ff2020', 0.09*k, 0, 1.32*k, 0.24*k, {mat: brillo('#ff3030', 1.1)});
    for (const s of [-1, 1]) esfera(c, '#ff922b', 0.2*k, s*0.3*k, 1.46*k, -0.02*k);
    cilindro(c, '#9775fa', 0.02*k, 0.2*k, 0.4*k, 0, 1.74*k, 0);
    ojosBravos(c, 1.42*k, 0.22*k, 0.1*k, k*0.6);
    for (const s of [-1, 1]) alas.push(pieza(c, '#f783ac', 0.14*k, 0.46*k, 0.16*k, s*0.42*k, 0.84*k, 0));
  }
  optimizar(c, [...alas, ...patas]);
  g.userData = {c, alas, patas, tipo};
  return g;
}
GFX.modeloEnemigo = modeloEnemigo;
function animarEnemigo(m, e, t, vivo){
  const u = m.userData;
  const f = t*9 + (e.fase || 0);
  u.alas.forEach((a, i)=>{ if (u.tipo === 'zancudo' || u.tipo === 'zancudote') a.rotation.x = Math.sin(t*60 + i)*0.7; else if (u.tipo === 'murcielago') a.rotation.z = (i ? -1 : 1)*Math.sin(t*14)*0.7; else a.rotation.x = Math.sin(f + i*Math.PI)*0.6; });
  u.patas.forEach((p, i)=>{ p.rotation.x = Math.sin(f + i*Math.PI)*0.5; });
  if (u.tipo === 'nubecita' || u.tipo === 'nublao') u.c.rotation.z = Math.sin(t*2 + (e.fase || 0))*0.08;
  if (u.tipo === 'pinguino') u.c.rotation.z = Math.sin(f)*0.15;
}
GFX.animarEnemigo = animarEnemigo;

/* ============================================================
   COSAS QUE SE RECOGEN
   ============================================================ */
const GEO_MONEDA = new THREE.CylinderGeometry(0.34, 0.34, 0.08, 20); GEO_MONEDA.rotateX(Math.PI/2);
const GEO_MONEDA_BORDE = new THREE.TorusGeometry(0.34, 0.045, 6, 20);
function modeloMoneda(){
  const g = new THREE.Group();
  const m = new THREE.Mesh(GEO_MONEDA, toon('#ffc61a', {emissive: '#b86e00'})); m.castShadow = true; g.add(m);
  const b = new THREE.Mesh(GEO_MONEDA_BORDE, toon('#ffe066', {emissive: '#c77d00'})); g.add(b);
  const s = pieza(g, '#fff3bf', 0.1, 0.28, 0.1, 0, 0, 0, {r: 0.03, mat: brillo('#fff3bf', 1.2), sinSombra: true}); s.position.z = 0.03;
  return g;
}
/* la chispa del relámpago: un rayito dorado que brilla */
let GEO_RAYO = null;
function geoRayo(){
  if (GEO_RAYO) return GEO_RAYO;
  const s = new THREE.Shape(); s.moveTo(0.1, 0.8); s.lineTo(-0.35, 0.02); s.lineTo(-0.02, 0.02); s.lineTo(-0.2, -0.8); s.lineTo(0.35, 0.1); s.lineTo(0.02, 0.1); s.lineTo(0.1, 0.8);
  GEO_RAYO = new THREE.ExtrudeGeometry(s, {depth: 0.16, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 2}); GEO_RAYO.translate(0, 0, -0.08);
  return GEO_RAYO;
}
function modeloChispa(grande){
  const g = new THREE.Group();
  const m = new THREE.Mesh(geoRayo(), toon('#ffe066', {emissive: '#ffb300'})); m.scale.setScalar(grande ? 1.3 : 1); g.add(m);
  contornear(g);
  const h = halo('#ffd43b', grande ? 4 : 2.8); g.add(h);
  return g;
}
function modeloCocada(){
  const g = new THREE.Group();
  cilindro(g, '#f4e3c1', 0.3, 0.34, 0.2, 0, 0, 0, {lados: 16});
  const t = cilindro(g, '#fff8e6', 0.26, 0.3, 0.08, 0, 0.13, 0, {lados: 16}); t.castShadow = false;
  for (let i = 0; i < 7; i++){ const a = i*0.9; pieza(g, '#c68642', 0.06, 0.03, 0.06, Math.cos(a)*0.18, 0.18, Math.sin(a)*0.18, {r: 0.01, sinSombra: true}); }
  optimizar(g, [], false);
  g.add(halo('#ffffff', 1.2));
  return g;
}
function modeloBarajita(id){
  const g = new THREE.Group();
  const c = document.createElement('canvas'); c.width = 128; c.height = 176; const x = c.getContext('2d');
  const gr = x.createLinearGradient(0, 0, 128, 176); gr.addColorStop(0, '#7048e8'); gr.addColorStop(1, '#f06595'); x.fillStyle = gr; rr(x, 0, 0, 128, 176, 16); x.fill();
  x.fillStyle = '#fff'; rr(x, 10, 10, 108, 156, 10); x.fill();
  x.font = '64px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(['⚡', '🌴', '🦜', '🎡', '🏰', '🌉'][(id || '').length % 6], 64, 80);
  x.fillStyle = '#7048e8'; x.font = 'bold 22px Fredoka, sans-serif'; x.fillText('BARAJITA', 64, 148);
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
  const cara = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.96, 0.04), [toon('#7048e8'), toon('#7048e8'), toon('#7048e8'), toon('#7048e8'), new THREE.MeshBasicMaterial({map: t}), new THREE.MeshBasicMaterial({map: t})]);
  g.add(cara); g.add(halo('#e599f7', 2.4));
  return g;
}
function modeloJaula(amigo){
  const g = new THREE.Group();
  cilindro(g, '#6b3a1a', 0.75, 0.8, 0.2, 0, 0.1, 0, {lados: 18});
  cilindro(g, '#6b3a1a', 0.75, 0.75, 0.16, 0, 1.72, 0, {lados: 18});
  esfera(g, '#ffd43b', 0.12, 0, 1.9, 0, {emissive: '#b86e00'});
  const barras = new THREE.Group(); g.add(barras);
  for (let i = 0; i < 12; i++){ const a = i/12*Math.PI*2; cilindro(barras, '#495057', 0.035, 0.035, 1.55, Math.cos(a)*0.68, 0.95, Math.sin(a)*0.68, {lados: 6}); }
  const A = S.AMIGOS[amigo] || S.AMIGOS.morrocoy;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({map: texEmoji(A.emoji), transparent: true})); s.scale.set(0.95, 0.95, 1); s.position.y = 0.72; g.add(s);
  optimizar(g, [barras]);
  g.userData = {barras, amigo: s};
  return g;
}
function modeloDiana(){
  const g = new THREE.Group();
  const cols = ['#e03131', '#ffffff', '#e03131', '#ffffff', '#ffd43b'];
  cols.forEach((c, i)=>{ const r = 0.62 - i*0.12; const m = cilindro(g, c, r, r, 0.08 + i*0.015, 0, 0, 0, {lados: 24}); m.rotation.x = Math.PI/2; });
  cilindro(g, '#6b3a1a', 0.06, 0.06, 1.2, 0, -0.9, -0.05, {lados: 6});
  optimizar(g, []);
  return g;
}
function modeloTrampolin(){
  const g = new THREE.Group();
  cilindro(g, '#343a40', 0.9, 0.95, 0.3, 0, 0.15, 0, {lados: 20});
  const tela = cilindro(g, '#ff4d6d', 0.8, 0.8, 0.1, 0, 0.34, 0, {lados: 20}); g.userData.tela = tela;
  for (let i = 0; i < 8; i++){ const a = i/8*Math.PI*2; esfera(g, '#ffd43b', 0.07, Math.cos(a)*0.86, 0.33, Math.sin(a)*0.86); }
  optimizar(g, []);
  return g;
}
function modeloBandera(){
  const g = new THREE.Group();
  cilindro(g, '#dee2e6', 0.06, 0.06, 2.6, 0, 1.3, 0, {lados: 8});
  esfera(g, '#ffd43b', 0.1, 0, 2.65, 0);
  const tela = new THREE.Group(); tela.position.set(0, 2.25, 0); g.add(tela);
  pieza(tela, '#1c7ed6', 0.9, 0.55, 0.04, 0.47, 0, 0, {r: 0.02});
  pieza(tela, '#ffd43b', 0.26, 0.26, 0.06, 0.47, 0, 0, {r: 0.04});
  cilindro(g, '#868e96', 0.35, 0.4, 0.15, 0, 0.07, 0, {lados: 12});
  optimizar(g, [tela]);
  g.userData.tela = tela;
  return g;
}
GFX.modeloMoneda = modeloMoneda; GFX.modeloChispa = modeloChispa; GFX.modeloCocada = modeloCocada; GFX.modeloBarajita = modeloBarajita;
GFX.modeloJaula = modeloJaula; GFX.modeloDiana = modeloDiana; GFX.modeloTrampolin = modeloTrampolin; GFX.modeloBandera = modeloBandera;

/* ============================================================
   ADORNOS DEL MUNDO
   ============================================================ */
function modeloDeco(d){
  const g = new THREE.Group(), e = d.esc || 1;
  const T = d.tipo;
  if (T === 'palmera'){
    const tronco = new THREE.Group(); g.add(tronco);
    for (let i = 0; i < 7; i++){ const p = cilindro(tronco, i % 2 ? '#a07040' : '#8d5f33', 0.2 - i*0.012, 0.23 - i*0.012, 0.75, Math.sin(i*0.35)*0.25, 0.37 + i*0.72, 0, {lados: 8}); p.rotation.z = -0.06; }
    const copa = new THREE.Group(); copa.position.set(Math.sin(2.4)*0.25, 5.2, 0); g.add(copa);
    for (let i = 0; i < 8; i++){ const h = new THREE.Group(); h.rotation.y = i/8*Math.PI*2; copa.add(h); const hoja = pieza(h, i % 2 ? '#2b9348' : '#40a85a', 0.5, 0.06, 2.4, 0, -0.2, 1.1, {r: 0.03}); hoja.rotation.x = 0.45; }
    for (let i = 0; i < 3; i++) esfera(copa, '#6b4423', 0.16, Math.cos(i*2)*0.25, -0.25, Math.sin(i*2)*0.25);
  } else if (T === 'farol'){
    cilindro(g, '#2b2d31', 0.07, 0.1, 3.2, 0, 1.6, 0, {lados: 8}); cilindro(g, '#2b2d31', 0.2, 0.25, 0.12, 0, 0.06, 0, {lados: 10});
    pieza(g, '#fff3bf', 0.36, 0.44, 0.36, 0, 3.4, 0, {mat: brillo('#fff1c0', 1.6), r: 0.06}); pieza(g, '#2b2d31', 0.48, 0.1, 0.48, 0, 3.66, 0, {r: 0.04});
    if (d.noche){ const h = halo('#ffe8a3', 2.4); h.position.y = 3.4; g.add(h); }
  } else if (T === 'flores'){
    for (let i = 0; i < 9; i++){ const a = i*2.4, r = 0.2 + (i % 3)*0.3; cilindro(g, '#2b9348', 0.02, 0.02, 0.35, Math.cos(a)*r, 0.17, Math.sin(a)*r, {lados: 4}); esfera(g, ['#ff6b6b', '#ffd43b', '#f783ac', '#ffffff', '#9775fa'][i % 5], 0.1, Math.cos(a)*r, 0.38, Math.sin(a)*r, {lados: 8}); }
  } else if (T === 'arbol' || T === 'ceiba' || T === 'mangle'){
    const k = T === 'ceiba' ? 1.8 : 1;
    cilindro(g, '#7a5230', 0.25*k, 0.38*k, 2.4*k, 0, 1.2*k, 0, {lados: 9});
    const hojas = T === 'mangle' ? '#2f7a3a' : '#3aa655';
    for (const [x, y, z, r] of [[0, 3, 0, 1.4], [0.9, 2.7, 0.2, 1], [-0.8, 2.8, -0.3, 1.05], [0.2, 3.7, -0.4, 0.95], [-0.3, 3.5, 0.7, 0.9]]) esfera(g, hojas, r*k, x*k, y*k, z*k, {lados: 10});
    if (T === 'mangle') for (let i = 0; i < 6; i++){ const a = i/6*Math.PI*2; const r = cilindro(g, '#6b4a2a', 0.06, 0.06, 1.4, Math.cos(a)*0.5, 0.2, Math.sin(a)*0.5, {lados: 5}); r.rotation.z = Math.cos(a)*0.5; r.rotation.x = -Math.sin(a)*0.5; }
  } else if (T === 'pino'){
    cilindro(g, '#6b4a2a', 0.18, 0.24, 1.2, 0, 0.6, 0, {lados: 7});
    for (let i = 0; i < 3; i++) cilindro(g, '#2b7a4b', 0.05, 1.3 - i*0.3, 1.3, 0, 1.4 + i*0.8, 0, {lados: 9});
    if (d.nieve) for (let i = 0; i < 3; i++) cilindro(g, '#f4f8ff', 0.05, 0.6 - i*0.15, 0.35, 0, 1.95 + i*0.8, 0, {lados: 9});
  } else if (T === 'cactus'){
    cilindro(g, '#3a9a4a', 0.3, 0.34, 2.4, 0, 1.2, 0, {lados: 10}); esfera(g, '#3a9a4a', 0.3, 0, 2.4, 0, {lados: 10});
    for (const s of [-1, 1]){ const b = cilindro(g, '#3a9a4a', 0.18, 0.2, 0.9, s*0.55, 1.5 + s*0.2, 0, {lados: 8}); cilindro(g, '#3a9a4a', 0.18, 0.18, 0.5, s*0.32, 1.12 + s*0.2, 0, {lados: 8}).rotation.z = Math.PI/2; esfera(g, '#3a9a4a', 0.18, s*0.55, 1.95 + s*0.2, 0, {lados: 8}); }
    esfera(g, '#f783ac', 0.1, 0, 2.72, 0);
  } else if (T === 'roca'){
    const r = esfera(g, '#8a8f96', 0.9, 0, 0.5, 0, {lados: 7}); r.scale.set(1.2, 0.8, 1); r.rotation.y = 0.5;
    esfera(g, '#9aa0a6', 0.5, 0.8, 0.3, 0.3, {lados: 6});
  } else if (T === 'casa' || T === 'palafito'){
    const w = d.w || 4, dd = d.d || 4, h = d.h || 3, y0 = T === 'palafito' ? 1.2 : 0;
    if (T === 'palafito') for (const [x, z] of [[-w/2 + 0.2, -dd/2 + 0.2], [w/2 - 0.2, -dd/2 + 0.2], [-w/2 + 0.2, dd/2 - 0.2], [w/2 - 0.2, dd/2 - 0.2]]) cilindro(g, '#5c3a1e', 0.12, 0.14, 3.5, x, y0 - 1.5, z, {lados: 6});
    const cuerpo = new THREE.Mesh(geoBloque(w, h, dd, 0.08), matPiso('casa', d.color || '#ffd43b')); cuerpo.position.y = y0 + h/2; cuerpo.castShadow = true; cuerpo.receiveShadow = true; g.add(cuerpo);
    const techo = new THREE.Mesh(new THREE.CylinderGeometry(0.01, Math.max(w, dd)*0.78, 1.3, 4), toon('#c0582b')); techo.rotation.y = Math.PI/4; techo.position.y = y0 + h + 0.65; techo.scale.set(w/Math.max(w, dd), 1, dd/Math.max(w, dd)); techo.castShadow = true; g.add(techo);
    pieza(g, '#5c3a1e', 0.9, 1.7, 0.08, 0, y0 + 0.85, dd/2 + 0.02, {r: 0.03});
    for (const s of [-1, 1]){ pieza(g, '#a5d8ff', 0.7, 0.7, 0.06, s*w*0.3, y0 + h*0.6, dd/2 + 0.02, {r: 0.03, mat: brillo(d.noche ? '#ffe8a3' : '#bfe3ff', d.noche ? 1.3 : 0.9)}); pieza(g, '#ffffff', 0.86, 0.1, 0.1, s*w*0.3, y0 + h*0.6 - 0.4, dd/2 + 0.05, {r: 0.02}); }
  } else if (T === 'techo'){
    const w = d.w || 4, dd = d.d || 4;
    pieza(g, d.color || '#e9ecef', w + 0.3, 0.22, dd + 0.3, 0, 0.11, 0, {r: 0.06});
    for (let x = -w/2 + 0.6; x < w/2; x += 1.6) pieza(g, '#c0582b', 0.5, 0.35, 0.5, x, 0.35, -dd/2 + 0.5, {r: 0.05});
  } else if (T === 'kiosko' || T === 'tienda' || T === 'toldo'){
    const w = d.w || 3, dd = d.d || 2.4, c = d.color || '#ff922b';
    if (T !== 'toldo') pieza(g, '#8d5524', w, 1, dd*0.5, 0, 0.5, -dd*0.2, {r: 0.05});
    for (const [x, z] of [[-w/2 + 0.1, -dd/2 + 0.1], [w/2 - 0.1, -dd/2 + 0.1], [-w/2 + 0.1, dd/2 - 0.1], [w/2 - 0.1, dd/2 - 0.1]]) cilindro(g, '#e9ecef', 0.05, 0.05, 2.4, x, 1.2, z, {lados: 6});
    for (let i = 0; i < 6; i++){ const t = pieza(g, i % 2 ? '#ffffff' : c, w/6, 0.08, dd + 0.3, -w/2 + w/12 + i*w/6, 2.5, 0, {r: 0.02}); t.rotation.x = 0.12; }
    if (T === 'kiosko'){ const l = letrero('🛒 KIOSKO', '#fff', 'rgba(230,110,20,.95)', 0.5); l.position.set(0, 3.1, 0); g.add(l); }
  } else if (T === 'bote' || T === 'barco'){
    const k = T === 'barco' ? 3 : 1;
    const casco = pieza(g, d.color || '#e03131', 1.4*k, 0.6*k, 3.4*k, 0, 0.3*k, 0, {r: 0.25*k}); casco.scale.x = 1;
    pieza(g, '#ffffff', 1.5*k, 0.12*k, 3.5*k, 0, 0.62*k, 0, {r: 0.05});
    if (T === 'barco'){ cilindro(g, '#6b3a1a', 0.12*k, 0.12*k, 4*k, 0, 2.6*k, 0, {lados: 6}); const v = pieza(g, '#212529', 0.05, 2*k, 1.6*k, 0, 2.8*k, 0, {r: 0.02}); v.rotation.y = Math.PI/2; const cal = letrero('☠', '#fff', null, 1.2*k); cal.position.set(0, 2.9*k, 0); g.add(cal); }
  } else if (T === 'torre'){
    const h = (d.h || 14);
    for (const [x, z] of [[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]]){ const p = cilindro(g, '#495057', 0.12, 0.12, h, x*0.6, h/2, z*0.6, {lados: 6}); p.rotation.z = -x*0.025; p.rotation.x = z*0.025; }
    for (let y = 2; y < h; y += 2.2){ const s = 1 - y/h*0.4; pieza(g, '#868e96', 2.2*s, 0.1, 0.1, 0, y, 1*s, {r: 0.02}); pieza(g, '#868e96', 2.2*s, 0.1, 0.1, 0, y, -1*s, {r: 0.02}); pieza(g, '#868e96', 0.1, 0.1, 2.2*s, 1*s, y, 0, {r: 0.02}); pieza(g, '#868e96', 0.1, 0.1, 2.2*s, -1*s, y, 0, {r: 0.02}); }
    esfera(g, '#ff2020', 0.18, 0, h + 0.2, 0, {mat: brillo('#ff4040', 1.6)}); const hl = halo('#ff4040', 2); hl.position.y = h + 0.2; g.add(hl);
  } else if (T === 'tanque'){
    cilindro(g, d.color || '#e9ecef', 2.2, 2.2, 3.2, 0, 1.6, 0, {lados: 20}); cilindro(g, '#ced4da', 2.25, 2.25, 0.2, 0, 3.2, 0, {lados: 20}); pieza(g, '#e03131', 0.1, 3, 0.1, 2.2, 1.5, 0);
  } else if (T === 'tuberia'){
    const w = d.w || 6; const t = cilindro(g, d.color || '#fab005', 0.3, 0.3, w, 0, 0.5, 0, {lados: 10}); t.rotation.z = Math.PI/2;
    for (let x = -w/2 + 0.5; x < w/2; x += 2) cilindro(g, '#495057', 0.36, 0.36, 0.15, x, 0.5, 0, {lados: 10}).rotation.z = Math.PI/2;
  } else if (T === 'grua'){
    pieza(g, '#fab005', 0.6, 10, 0.6, 0, 5, 0, {r: 0.05}); pieza(g, '#fab005', 7, 0.5, 0.5, 2.5, 10, 0, {r: 0.05}); cilindro(g, '#343a40', 0.03, 0.03, 4, 5.5, 8, 0, {lados: 4}); pieza(g, '#495057', 0.5, 0.4, 0.5, 5.5, 6, 0);
  } else if (T === 'frailejon'){
    cilindro(g, '#8d7a5a', 0.16, 0.22, 1.1, 0, 0.55, 0, {lados: 7});
    for (let i = 0; i < 12; i++){ const h = new THREE.Group(); h.rotation.y = i/12*Math.PI*2; h.position.y = 1.15; g.add(h); const hoja = pieza(h, '#b5c99a', 0.14, 0.05, 0.7, 0, 0, 0.3, {r: 0.02}); hoja.rotation.x = -0.6; }
    esfera(g, '#ffe066', 0.08, 0, 1.4, 0);
  } else if (T === 'muneco'){
    esfera(g, '#f8f9fa', 0.6, 0, 0.55, 0); esfera(g, '#f8f9fa', 0.42, 0, 1.35, 0); esfera(g, '#f8f9fa', 0.3, 0, 1.95, 0);
    pieza(g, '#ff922b', 0.08, 0.08, 0.3, 0, 1.95, 0.35, {r: 0.03}); for (const s of [-1, 1]) esfera(g, '#111', 0.04, s*0.1, 2.02, 0.26);
    cilindro(g, '#212529', 0.22, 0.22, 0.35, 0, 2.35, 0); cilindro(g, '#212529', 0.34, 0.34, 0.05, 0, 2.2, 0); pieza(g, '#e03131', 0.7, 0.12, 0.55, 0, 1.68, 0, {r: 0.05});
  } else if (T === 'rueda'){
    const r = d.r || 8; const aro = new THREE.Group(); aro.position.y = r + 1.5; g.add(aro); g.userData.gira = aro;
    const tor = new THREE.Mesh(new THREE.TorusGeometry(r, 0.15, 8, 48), toon('#e9ecef')); aro.add(tor);
    const tor2 = new THREE.Mesh(new THREE.TorusGeometry(r*0.3, 0.12, 8, 24), toon('#ff6b6b')); aro.add(tor2);
    for (let i = 0; i < 12; i++){ const a = i/12*Math.PI*2; const rayo = pieza(aro, '#e9ecef', 0.1, r, 0.1, Math.cos(a)*r/2, Math.sin(a)*r/2, 0, {r: 0.02}); rayo.rotation.z = a - Math.PI/2; const foco = esfera(aro, ['#ff6b6b', '#ffd43b', '#4dabf7', '#51cf66'][i % 4], 0.18, Math.cos(a)*r, Math.sin(a)*r, 0, {mat: brillo(['#ff8787', '#ffe066', '#74c0fc', '#8ce99a'][i % 4], 1.5)}); foco.userData.sinContorno = true; }
    for (const s of [-1, 1]){ const p = pieza(g, '#adb5bd', 0.3, r + 2, 0.3, s*r*0.35, (r + 1.5)/2, 0.6, {r: 0.05}); p.rotation.z = s*0.35; const p2 = pieza(g, '#adb5bd', 0.3, r + 2, 0.3, s*r*0.35, (r + 1.5)/2, -0.6, {r: 0.05}); p2.rotation.z = s*0.35; }
    optimizar(aro, [], false); aro.traverse(o=>o.userData.noJuntar = true);
  } else if (T === 'carrusel'){
    const r = d.r || 4; cilindro(g, '#ffd43b', r, r, 0.3, 0, 0.15, 0, {lados: 24}); cilindro(g, '#e9ecef', 0.3, 0.3, 3.6, 0, 1.8, 0, {lados: 10});
    const techo = cilindro(g, '#f06595', 0.1, r + 0.4, 1.2, 0, 4, 0, {lados: 24}); g.userData.gira = techo;
    for (let i = 0; i < 16; i++){ const a = i/16*Math.PI*2; esfera(g, i % 2 ? '#fff3bf' : '#ffd8a8', 0.12, Math.cos(a)*(r + 0.3), 3.4, Math.sin(a)*(r + 0.3), {mat: brillo(i % 2 ? '#fff3bf' : '#ffc9c9', 1.4)}).userData.sinContorno = true; }
  } else if (T === 'basilica'){
    const k = e;
    pieza(g, '#ffd43b', 10*k, 7*k, 3*k, 0, 3.5*k, 0, {r: 0.08});
    pieza(g, '#fff3bf', 8*k, 0.5*k, 3.2*k, 0, 7.2*k, 0, {r: 0.06});
    for (const s of [-1, 1]){ pieza(g, '#fcc419', 2.6*k, 11*k, 2.6*k, s*4.2*k, 5.5*k, 0, {r: 0.08}); cilindro(g, '#e67700', 0.1, 1.6*k, 2.2*k, s*4.2*k, 12.1*k, 0, {lados: 4}); esfera(g, '#fff3bf', 0.2*k, s*4.2*k, 13.3*k, 0, {emissive: '#ffd43b'}); }
    pieza(g, '#6b3a1a', 2.4*k, 3.6*k, 0.2*k, 0, 1.8*k, 1.52*k, {r: 0.1}); esfera(g, '#a5d8ff', 1*k, 0, 5.2*k, 1.5*k, {mat: brillo('#bfe3ff', 0.9)}).scale.z = 0.1;
  } else if (T === 'puente'){
    const k = e;
    for (let i = -4; i <= 4; i++){ const x = i*30*k; pieza(g, '#dee2e6', 3*k, 12*k, 3*k, x, 6*k, 0, {r: 0.1}); }
    pieza(g, '#ced4da', 280*k, 1.2*k, 6*k, 0, 12.6*k, 0, {r: 0.1});
    for (const s of [-1, 1]){ const p = pieza(g, '#f1f3f5', 1.4*k, 24*k, 1.4*k, s*30*k, 24*k, 0, {r: 0.1}); }
  } else if (T === 'portal'){
    const n = d.nivel || 1;
    const col = ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#38d9a9', '#4dabf7', '#748ffc', '#9775fa', '#f783ac', '#ff922b', '#20c997', '#845ef7'][(n - 1) % 12];
    const arco = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.28, 12, 32, Math.PI), toon(col)); arco.position.y = 1.2; g.add(arco);
    for (const s of [-1, 1]) cilindro(g, col, 0.28, 0.32, 1.2, s*1.5, 0.6, 0, {lados: 10});
    const disco = new THREE.Mesh(new THREE.CircleGeometry(1.3, 32), new THREE.ShaderMaterial({uniforms: {tiempo: U.tiempo, color: {value: lin(col)}}, transparent: true, side: THREE.DoubleSide, depthWrite: false,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0); }',
      fragmentShader: 'uniform float tiempo; uniform vec3 color; varying vec2 vUv; void main(){ vec2 p = vUv - 0.5; float r = length(p)*2.0; float a = atan(p.y, p.x); float esp = sin(a*3.0 + r*10.0 - tiempo*4.0)*0.5 + 0.5; vec3 c = mix(color, vec3(1.0), esp*0.55 + (1.0 - r)*0.3); gl_FragColor = vec4(c, (1.0 - smoothstep(0.85, 1.0, r))*0.85); }'}));
    disco.position.y = 1.2; disco.userData.noJuntar = true; g.add(disco);
    const cuadro = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.2), disco.material); cuadro.position.y = 0.6; cuadro.userData.noJuntar = true; g.add(cuadro);
    const t = letrero(n + ' · ' + (d.nombre || ''), '#fff', 'rgba(20,20,40,.8)', 0.5); t.position.y = 3.4; g.add(t);
    const cand = letrero('🔒 ' + S.PIDE_PORTAL[n] + ' ⚡', '#ffe066', 'rgba(20,20,40,.8)', 0.42); cand.position.y = 2.9; g.add(cand); g.userData.candado = cand;
    g.userData.portal = n; g.userData.noJuntar = true;
    contornear(g);
  } else if (T === 'album'){
    pieza(g, '#7048e8', 2.4, 1.8, 0.2, 0, 1.6, 0, {r: 0.08}); cilindro(g, '#6b3a1a', 0.08, 0.08, 1.4, -0.9, 0.7, -0.1); cilindro(g, '#6b3a1a', 0.08, 0.08, 1.4, 0.9, 0.7, -0.1);
    const l = letrero('📒 ÁLBUM', '#fff', 'rgba(112,72,232,.95)', 0.45); l.position.set(0, 2.8, 0); g.add(l);
  } else if (T === 'antena'){
    cilindro(g, '#868e96', 0.08, 0.12, 5, 0, 2.5, 0, {lados: 8}); esfera(g, '#e03131', 0.18, 0, 5.1, 0, {mat: brillo('#ff5050', 1.5)});
    const plato = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 8, 0, Math.PI*2, 0, Math.PI/3), toon('#dee2e6', {side: THREE.DoubleSide})); plato.position.set(0, 3.6, 0.3); plato.rotation.x = -1.2; g.add(plato);
    const l = letrero('📡 AMIGOS', '#fff', 'rgba(28,126,214,.95)', 0.45); l.position.set(0, 5.8, 0); g.add(l);
  } else if (T === 'fuente'){
    cilindro(g, '#adb5bd', 2.2, 2.4, 0.7, 0, 0.35, 0, {lados: 24}); const agua = cilindro(g, '#4dabf7', 2, 2, 0.1, 0, 0.66, 0, {lados: 24, mat: brillo('#74c0fc', 0.9)}); agua.userData.sinContorno = true;
    cilindro(g, '#ced4da', 0.3, 0.4, 1.8, 0, 1.2, 0, {lados: 12}); cilindro(g, '#adb5bd', 0.9, 0.7, 0.3, 0, 2.1, 0, {lados: 16});
    g.userData.fuente = true;
  } else if (T === 'cascada'){
    const w = d.w || 4, h = d.h || 10;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 1, 1), new THREE.ShaderMaterial({uniforms: {tiempo: U.tiempo}, transparent: true, depthWrite: false,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0); }',
      fragmentShader: 'uniform float tiempo; varying vec2 vUv; void main(){ float l = sin(vUv.x*40.0)*0.5 + 0.5; float f = fract(vUv.y*3.0 + tiempo*1.5 + l*0.3); vec3 c = mix(vec3(0.55, 0.8, 0.95), vec3(1.0), smoothstep(0.6, 1.0, f)*0.8); gl_FragColor = vec4(c, 0.82); }'}));
    m.position.y = h/2; m.userData.noJuntar = true; g.add(m); g.userData.cascada = true;
  } else if (T === 'nube'){
    for (const [x, y, z, r] of [[0, 0, 0, 1.6], [1.4, -0.2, 0, 1.2], [-1.4, -0.2, 0.2, 1.1], [0.5, 0.8, -0.2, 1], [-0.6, 0.6, 0.3, 0.95]]) esfera(g, '#ffffff', r, x, y, z, {lados: 12, mat: toon('#ffffff', {emissive: '#6a7aa8'})});
  } else if (T === 'tepuy' || T === 'montana' || T === 'medano'){
    const k = e;
    if (T === 'tepuy'){ const m = cilindro(g, '#8a5a44', 16*k, 20*k, 36*k, 0, 18*k, 0, {lados: 9}); m.scale.z = 0.7; const t = cilindro(g, '#4c8a3c', 16.2*k, 16.2*k, 1*k, 0, 36*k, 0, {lados: 9}); t.scale.z = 0.7; }
    else if (T === 'montana'){ cilindro(g, '#7a8a9a', 0.5*k, 18*k, 26*k, 0, 13*k, 0, {lados: 7}); cilindro(g, '#f4f8ff', 0.3*k, 5.5*k, 8*k, 0, 22.5*k, 0, {lados: 7}); }
    else { const m = esfera(g, '#e9cf95', 8*k, 0, -3*k, 0, {lados: 12}); m.scale.set(1.6, 0.6, 1); }
    g.traverse(o=>{ if (o.isMesh) o.castShadow = false; });
  } else if (T === 'faro'){
    cilindro(g, '#f8f9fa', 1.2, 1.6, 10, 0, 5, 0, {lados: 16}); for (let i = 0; i < 3; i++) cilindro(g, '#e03131', 1.25 - i*0.12, 1.3 - i*0.12, 1.2, 0, 1.5 + i*3, 0, {lados: 16});
    cilindro(g, '#343a40', 1.3, 1.3, 0.3, 0, 10.2, 0, {lados: 16}); const luz = cilindro(g, '#fff3bf', 0.8, 0.8, 1.3, 0, 11, 0, {lados: 12, mat: brillo('#fff3bf', 1.6)}); luz.userData.sinContorno = true; cilindro(g, '#e03131', 0.1, 1, 1, 0, 12.1, 0, {lados: 12});
    const h = halo('#fff3bf', 7); h.position.y = 11; g.add(h);
  } else if (T === 'letrero'){
    cilindro(g, '#6b3a1a', 0.08, 0.08, 2, -0.9, 1, 0, {lados: 6}); cilindro(g, '#6b3a1a', 0.08, 0.08, 2, 0.9, 1, 0, {lados: 6});
    const tt = texTexto(d.texto || '¡Épale!', '#3b2a1a', '#f4e3c1'); const k = 0.55/tt.h; const tabla = new THREE.Mesh(new THREE.PlaneGeometry(tt.w*k, tt.h*k), new THREE.MeshBasicMaterial({map: tt.t, side: THREE.DoubleSide, transparent: true})); tabla.position.set(0, 2, 0.1); tabla.userData.noJuntar = true; g.add(tabla);
  } else if (T === 'poste'){
    cilindro(g, '#6b4a2a', 0.1, 0.12, 5, 0, 2.5, 0, {lados: 6}); pieza(g, '#6b4a2a', 1.6, 0.1, 0.1, 0, 4.6, 0, {r: 0.02});
  } else if (T === 'globo'){
    const c = d.color || '#ff6b6b'; const b = esfera(g, c, 0.5, 0, 3, 0, {lados: 14}); b.scale.y = 1.2; cilindro(g, '#dee2e6', 0.008, 0.008, 2.4, 0, 1.4, 0, {lados: 3}); g.userData.flota = true;
  } else if (T === 'bandera'){
    cilindro(g, '#dee2e6', 0.08, 0.08, 4.5, 0, 2.25, 0, {lados: 8});
    const t = new THREE.Group(); t.position.set(0, 3.9, 0); g.add(t); g.userData.tela = t;
    pieza(t, '#ffd43b', 1.6, 0.3, 0.04, 0.82, 0.3, 0, {r: 0.01}); pieza(t, '#1c7ed6', 1.6, 0.3, 0.04, 0.82, 0, 0, {r: 0.01}); pieza(t, '#e03131', 1.6, 0.3, 0.04, 0.82, -0.3, 0, {r: 0.01});
  } else if (T === 'cerca'){
    const w = d.w || 4; for (let x = -w/2; x <= w/2 + 0.01; x += 1) pieza(g, '#e9ecef', 0.12, 0.9, 0.12, x, 0.45, 0, {r: 0.03}); pieza(g, '#e9ecef', w, 0.1, 0.08, 0, 0.7, 0, {r: 0.02}); pieza(g, '#e9ecef', w, 0.1, 0.08, 0, 0.35, 0, {r: 0.02});
  } else if (T === 'hongo'){
    cilindro(g, '#f8f0e0', 0.35*e, 0.45*e, 1.4*e, 0, 0.7*e, 0); const s = esfera(g, d.color || '#e03131', 1.1*e, 0, 1.5*e, 0, {lados: 16}); s.scale.y = 0.55; for (let i = 0; i < 5; i++){ const a = i*1.3; esfera(g, '#fff', 0.18*e, Math.cos(a)*0.65*e, 1.85*e, Math.sin(a)*0.65*e); }
  } else if (T === 'cristal'){
    const c = d.color || '#74c0fc'; for (let i = 0; i < 4; i++){ const m = cilindro(g, c, 0.01, 0.3 - i*0.04, 1.6 - i*0.25, (i - 1.5)*0.3, 0.8 - i*0.12, (i % 2)*0.2, {lados: 6, emissive: c}); m.rotation.z = (i - 1.5)*0.25; }
    const h = halo(c, 2.5); h.position.y = 0.8; g.add(h);
  } else if (T === 'relampago'){
    for (let k = 0; k < 5; k++){ const s = pieza(g, '#fff9db', 0.6, 7, 0.6, Math.sin(k*1.7)*2, 30 - k*6, 0, {mat: brillo('#fff9db', 2)}); s.rotation.z = Math.sin(k*2.3)*0.5; s.userData.sinContorno = true; }
    g.userData.relampago = true; g.visible = false;
  } else if (T === 'castillo'){
    const k = e; pieza(g, '#c9b18a', 16*k, 7*k, 16*k, 0, 3.5*k, 0, {r: 0.1});
    for (const [x, z] of [[-8, -8], [8, -8], [-8, 8], [8, 8]]){ cilindro(g, '#bfa57a', 2.2*k, 2.5*k, 9*k, x*k, 4.5*k, z*k, {lados: 10}); cilindro(g, '#e03131', 0.1, 2.6*k, 2.4*k, x*k, 10.2*k, z*k, {lados: 10}); }
  } else if (T === 'barril'){
    cilindro(g, '#8d5524', 0.45, 0.45, 1, 0, 0.5, 0, {lados: 12}); for (const y of [0.15, 0.85]) cilindro(g, '#495057', 0.47, 0.47, 0.08, 0, y, 0, {lados: 12});
  } else if (T === 'ancla'){
    pieza(g, '#495057', 0.2, 2, 0.2, 0, 1, 0, {r: 0.05}); pieza(g, '#495057', 1.4, 0.2, 0.2, 0, 1.7, 0, {r: 0.05}); const a = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.1, 6, 16, Math.PI), toon('#495057')); a.rotation.z = Math.PI; a.position.y = 0.6; g.add(a);
  } else if (T === 'chivo' || T === 'burro'){
    const c = T === 'chivo' ? '#f1f3f5' : '#868e96';
    pieza(g, c, 0.5, 0.45, 0.9, 0, 0.7, 0); pieza(g, c, 0.3, 0.34, 0.4, 0, 1.0, 0.5); for (const [x, z] of [[-0.18, -0.3], [0.18, -0.3], [-0.18, 0.3], [0.18, 0.3]]) pieza(g, '#495057', 0.1, 0.45, 0.1, x, 0.22, z, {r: 0.03});
    for (const s of [-1, 1]) pieza(g, T === 'burro' ? c : '#868e96', 0.07, 0.3, 0.07, s*0.1, 1.28, 0.42, {r: 0.02});
  }
  if (d.ang) g.rotation.y = d.ang;
  if (T !== 'portal' && T !== 'rueda' && T !== 'tepuy' && T !== 'montana' && T !== 'medano' && T !== 'puente' && T !== 'castillo' && T !== 'basilica') g.scale.setScalar(e);
  g.position.set(d.x, d.y, d.z);
  g.traverse(o=>{ if (o.isMesh && o.castShadow === undefined) o.castShadow = true; });
  return g;
}
GFX.modeloDeco = modeloDeco;
/* los adornos que se animan (no se juntan) */
GFX.decoAnimada = d=>['portal', 'rueda', 'carrusel', 'bandera', 'globo', 'relampago', 'cascada', 'fuente'].includes(d.tipo);

/* ============================================================
   PLATAFORMAS: una malla por plataforma (se juntan las quietas)
   ============================================================ */
function mallaCaja(c){
  const w = c.x1 - c.x0, h = c.y1 - c.y0, d = c.z1 - c.z0;
  const r = c.redondo === undefined ? 0.12 : c.redondo;
  const m = new THREE.Mesh(geoBloque(w, h, d, Math.min(r, h*0.45)), matPiso(c.mat, c.color));
  m.position.set((c.x0 + c.x1)/2, (c.y0 + c.y1)/2, (c.z0 + c.z1)/2);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
GFX.mallaCaja = mallaCaja;
window.SALO_GFX = GFX;
})();
