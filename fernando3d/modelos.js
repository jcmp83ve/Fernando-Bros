'use strict';
/* ============================================================
   FERNANDO 3D — los MODELOS
   Todo se arma con piezas de Three.js (sin archivos externos):
   texturas pintadas en lienzos, Fernando, Tío Juan, Penny y
   Sheldon, los enemigos, las estrellas, las cajas de regalo,
   los cuadros mágicos y los adornos de cada mundo.
   ============================================================ */
(function(){
const THREE = window.THREE;
const MOD = {anisotropia: 4};
const TAU = Math.PI*2;

/* ---------------- azar con semilla (para que todo salga igual siempre) ---------------- */
function rng(seed){
  let a = seed >>> 0;
  return function(){
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* ---------------- texturas pintadas ---------------- */
const TEX = {};
function lienzo(w, h, pinta, repetir){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  pinta(x, w, h);
  const t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  t.anisotropy = MOD.anisotropia;
  if (repetir !== false){ t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  return t;
}
function manchas(x, w, h, R, n, colores, rmin, rmax, alfa){
  for (let i = 0; i < n; i++){
    x.globalAlpha = alfa == null ? 0.5 : alfa;
    x.fillStyle = colores[Math.floor(R()*colores.length)];
    const px = R()*w, py = R()*h, r = rmin + R()*(rmax - rmin);
    for (const [ox, oy] of [[0,0],[w,0],[-w,0],[0,h],[0,-h]]){ x.beginPath(); x.arc(px+ox, py+oy, r, 0, TAU); x.fill(); }
  }
  x.globalAlpha = 1;
}
const PINTAR = {
  pasto(x, w, h){
    const R = rng(1);
    x.fillStyle = '#52b236'; x.fillRect(0, 0, w, h);
    manchas(x, w, h, R, 90, ['#63c843', '#47a02c', '#6fd24c', '#3e9227'], 6, 26, 0.35);
    x.lineWidth = 2;
    for (let i = 0; i < 900; i++){
      const px = R()*w, py = R()*h, l = 4 + R()*7;
      x.strokeStyle = R() < 0.5 ? 'rgba(130,230,90,0.55)' : 'rgba(40,120,25,0.5)';
      x.beginPath(); x.moveTo(px, py); x.lineTo(px + (R() - 0.5)*3, py - l); x.stroke();
    }
    for (let i = 0; i < 26; i++){ x.fillStyle = ['#fff', '#ffe36e', '#ff9ed6'][i%3]; x.beginPath(); x.arc(R()*w, R()*h, 2.2, 0, TAU); x.fill(); }
  },
  tierra(x, w, h){
    const R = rng(2);
    x.fillStyle = '#9a6234'; x.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 32){ x.fillStyle = y % 64 ? '#8c5629' : '#a86d3c'; x.fillRect(0, y, w, 16); }
    manchas(x, w, h, R, 160, ['#7a4620', '#b57a46', '#6b3c1a', '#c08a55'], 2, 7, 0.6);
    for (let i = 0; i < 40; i++){ x.fillStyle = '#c9b49a'; x.globalAlpha = 0.7; x.beginPath(); x.ellipse(R()*w, R()*h, 5 + R()*6, 3 + R()*3, R()*3, 0, TAU); x.fill(); }
    x.globalAlpha = 1;
  },
  arena(x, w, h){
    const R = rng(3);
    x.fillStyle = '#f1d68e'; x.fillRect(0, 0, w, h);
    manchas(x, w, h, R, 70, ['#f7e2a6', '#e6c477', '#fbeab9'], 8, 30, 0.35);
    for (let i = 0; i < 2600; i++){ x.fillStyle = R() < 0.5 ? 'rgba(180,140,70,0.45)' : 'rgba(255,255,255,0.5)'; x.fillRect(R()*w, R()*h, 1.5, 1.5); }
    x.strokeStyle = 'rgba(200,160,90,0.35)'; x.lineWidth = 3;
    for (let i = 0; i < 9; i++){ const y = R()*h; x.beginPath(); for (let px = 0; px <= w; px += 16) x.lineTo(px, y + Math.sin(px/30 + i)*6); x.stroke(); }
  },
  arenaLado(x, w, h){
    const R = rng(4);
    x.fillStyle = '#d9b56a'; x.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 24){ x.fillStyle = y % 48 ? '#ccA25a' : '#e2c27f'; x.fillRect(0, y, w, 12); }
    manchas(x, w, h, R, 120, ['#b88a45', '#f0d394'], 2, 6, 0.5);
  },
  nieve(x, w, h){
    const R = rng(5);
    x.fillStyle = '#eef5ff'; x.fillRect(0, 0, w, h);
    manchas(x, w, h, R, 80, ['#ffffff', '#dbe8fb', '#e6f0ff'], 10, 34, 0.5);
    for (let i = 0; i < 300; i++){ x.fillStyle = 'rgba(160,200,255,0.8)'; x.fillRect(R()*w, R()*h, 2, 2); }
  },
  roca(x, w, h){
    const R = rng(6);
    x.fillStyle = '#9fb3c8'; x.fillRect(0, 0, w, h);
    manchas(x, w, h, R, 120, ['#8aa0b8', '#b6c8da', '#7d91a8', '#c8d8e8'], 6, 22, 0.5);
    x.strokeStyle = 'rgba(70,90,110,0.5)'; x.lineWidth = 2;
    for (let i = 0; i < 20; i++){ x.beginPath(); let px = R()*w, py = R()*h; x.moveTo(px, py); for (let k = 0; k < 4; k++){ px += (R() - 0.5)*40; py += R()*30; x.lineTo(px, py); } x.stroke(); }
  },
  nube(x, w, h){
    const R = rng(7);
    x.fillStyle = '#fbfbff'; x.fillRect(0, 0, w, h);
    manchas(x, w, h, R, 60, ['#ffffff', '#efeaff', '#fff4fb', '#e9f2ff'], 14, 40, 0.6);
  },
  piedra(x, w, h){
    const R = rng(8);
    x.fillStyle = '#7d7f88'; x.fillRect(0, 0, w, h);
    const n = 6, s = w/n;
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++){
      const o = (j % 2)*s/2, g = 120 + Math.floor(R()*50);
      x.fillStyle = `rgb(${g},${g+4},${g+14})`;
      x.beginPath(); x.roundRect ? x.roundRect(i*s + o + 3, j*s + 3, s - 6, s - 6, 10) : x.rect(i*s + o + 3, j*s + 3, s - 6, s - 6); x.fill();
      if (o){ x.beginPath(); x.rect(-s/2 + 3, j*s + 3, s - 6, s - 6); x.fill(); }
    }
    manchas(x, w, h, R, 120, ['#5a5c66', '#b0b2bc'], 1, 4, 0.5);
  },
  piedraOscura(x, w, h){
    const R = rng(9);
    x.fillStyle = '#2a2326'; x.fillRect(0, 0, w, h);
    manchas(x, w, h, R, 100, ['#3a3034', '#1d1719', '#4a3a3a'], 6, 24, 0.6);
    x.strokeStyle = '#ff7a1a'; x.lineWidth = 3; x.shadowColor = '#ffb040'; x.shadowBlur = 8;
    for (let i = 0; i < 14; i++){ x.beginPath(); let px = R()*w, py = R()*h; x.moveTo(px, py); for (let k = 0; k < 5; k++){ px += (R() - 0.5)*50; py += (R() - 0.5)*50; x.lineTo(px, py); } x.stroke(); }
    x.shadowBlur = 0;
  },
  ladrillo(x, w, h){
    const R = rng(10);
    x.fillStyle = '#cfc4b0'; x.fillRect(0, 0, w, h);
    const fh = h/8, fw = w/4;
    for (let j = 0; j < 8; j++) for (let i = -1; i < 5; i++){
      const o = (j % 2)*fw/2, g = R()*30;
      x.fillStyle = `rgb(${226 - g},${214 - g},${190 - g})`;
      x.fillRect(i*fw + o + 2, j*fh + 2, fw - 4, fh - 4);
    }
    manchas(x, w, h, R, 200, ['#b8ab92', '#efe6d4'], 1, 3, 0.5);
  },
  ladrilloArena(x, w, h){
    const R = rng(11);
    x.fillStyle = '#e2c27f'; x.fillRect(0, 0, w, h);
    const fh = h/6, fw = w/3;
    for (let j = 0; j < 6; j++) for (let i = -1; i < 4; i++){
      const o = (j % 2)*fw/2; x.fillStyle = R() < 0.5 ? '#f0d394' : '#e8c985';
      x.fillRect(i*fw + o + 3, j*fh + 3, fw - 6, fh - 6);
    }
  },
  madera(x, w, h){
    const R = rng(12);
    x.fillStyle = '#b07840'; x.fillRect(0, 0, w, h);
    const n = 5, s = h/n;
    for (let j = 0; j < n; j++){
      x.fillStyle = ['#b9824a', '#a86f3a', '#c08a52'][j%3]; x.fillRect(0, j*s + 2, w, s - 4);
      x.strokeStyle = 'rgba(90,50,20,0.35)'; x.lineWidth = 2;
      for (let k = 0; k < 4; k++){ x.beginPath(); const y = j*s + 6 + R()*(s - 12); x.moveTo(0, y); for (let px = 0; px <= w; px += 20) x.lineTo(px, y + Math.sin(px/40 + k)*2); x.stroke(); }
      x.fillStyle = '#5a3a1a'; x.beginPath(); x.arc(10, j*s + s/2, 3, 0, TAU); x.arc(w - 10, j*s + s/2, 3, 0, TAU); x.fill();
    }
  },
  faro(x, w, h){
    for (let j = 0; j < 4; j++){ x.fillStyle = j % 2 ? '#ffffff' : '#e8323a'; x.fillRect(0, j*h/4, w, h/4); }
    x.fillStyle = 'rgba(0,0,0,0.06)'; for (let i = 0; i < w; i += 16) x.fillRect(i, 0, 2, h);
  },
  molino(x, w, h){
    const R = rng(13);
    x.fillStyle = '#f4ece0'; x.fillRect(0, 0, w, h);
    manchas(x, w, h, R, 60, ['#e0d4c0', '#c8b8a0'], 4, 12, 0.5);
  },
  hielo(x, w, h){
    const R = rng(14);
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#bfeaff'); g.addColorStop(1, '#8fd0f4');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(255,255,255,0.8)'; x.lineWidth = 2;
    for (let i = 0; i < 16; i++){ x.beginPath(); let px = R()*w, py = R()*h; x.moveTo(px, py); for (let k = 0; k < 3; k++){ px += (R() - 0.5)*60; py += (R() - 0.5)*60; x.lineTo(px, py); } x.stroke(); }
  },
  arcoiris(x, w, h){
    const cs = ['#ff4a4a', '#ff9a2a', '#ffe23a', '#4ade4a', '#3aa8ff', '#8a5aff'];
    for (let i = 0; i < 6; i++){ x.fillStyle = cs[i]; x.fillRect(0, i*h/6, w, h/6); }
    x.fillStyle = 'rgba(255,255,255,0.25)'; for (let i = 0; i < 6; i++) x.fillRect(0, i*h/6, w, 4);
  },
  castilloTecho(x, w, h){
    const R = rng(15);
    x.fillStyle = '#b4a890'; x.fillRect(0, 0, w, h);
    const s = w/4;
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++){ x.fillStyle = (i + j) % 2 ? '#c8bca4' : '#bfb39a'; x.fillRect(i*s + 2, j*s + 2, s - 4, s - 4); }
    manchas(x, w, h, R, 80, ['#a89c84'], 1, 4, 0.5);
  },
  lava(x, w, h){
    const R = rng(16);
    x.fillStyle = '#ff5a00'; x.fillRect(0, 0, w, h);
    manchas(x, w, h, R, 50, ['#ffb000', '#ff2a00', '#ffd040'], 10, 40, 0.6);
  },
};
function tex(nombre){
  if (!TEX[nombre]) TEX[nombre] = lienzo(256, 256, PINTAR[nombre]);
  return TEX[nombre];
}

/* ---------------- materiales ---------------- */
const MATS = {};
/* los colores se escriben como se ven (sRGB) y se pasan a lineal para que no salgan lavados */
function std(color, o){
  const m = new THREE.MeshStandardMaterial(Object.assign({color, roughness:0.6, metalness:0}, o || {}));
  m.color.convertSRGBToLinear(); m.emissive.convertSRGBToLinear();
  return m;
}
function matSuelo(clave){
  if (MATS[clave]) return MATS[clave];
  let top, lado;
  const m = (t, o)=>std('#ffffff', Object.assign({map: tex(t), roughness: 0.85}, o || {}));
  switch (clave){
    case 'pasto':        top = m('pasto'); lado = m('tierra'); break;
    case 'arena':        top = m('arena', {color:'#e6c890'}); lado = m('arenaLado'); break;
    case 'nieve':        top = m('nieve', {roughness:0.75, color:'#d4deec'}); lado = m('roca'); break;
    case 'nube':         top = m('nube', {roughness:0.95, color:'#f4ecff'}); lado = top; break;
    case 'piedra':       top = m('piedra'); lado = top; break;
    case 'piedraOscura': top = m('piedraOscura', {emissive:'#ffffff', emissiveMap: tex('piedraOscura'), emissiveIntensity:0.35}); lado = top; break;
    case 'castillo':     top = m('castilloTecho'); lado = m('ladrillo'); break;
    case 'torre':        top = m('castilloTecho'); lado = m('ladrillo'); break;
    case 'castilloArena':top = m('ladrilloArena'); lado = top; break;
    case 'madera':       top = m('madera', {roughness:0.7}); lado = top; break;
    case 'faro':         top = m('piedra'); lado = m('faro', {roughness:0.4}); break;
    case 'molino':       top = m('piedra'); lado = m('molino'); break;
    case 'hielo':        top = std('#ffffff', {map: tex('hielo'), roughness:0.08, metalness:0.1, transparent:true, opacity:0.88}); lado = top; break;
    case 'arcoiris':     top = std('#ffffff', {map: tex('arcoiris'), roughness:0.3, emissive:'#ffffff', emissiveMap: tex('arcoiris'), emissiveIntensity:0.35}); lado = std('#ffffff', {roughness:0.6}); break;
    default:             top = m('piedra'); lado = top;
  }
  return (MATS[clave] = {top, lado});
}

/* ---------------- piezas del suelo ---------------- */
/* coordenadas de textura en metros del mundo, sin costuras en los cilindros */
function uvMundo(geo, cx, cz, r, esc){
  const pos = geo.attributes.position, nor = geo.attributes.normal, uv = geo.attributes.uv;
  const vueltas = r ? Math.max(1, Math.round(TAU*r/esc)) : 0;
  for (let i = 0; i < pos.count; i++){
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const nx = nor.getX(i), ny = nor.getY(i), nz = nor.getZ(i);
    if (Math.abs(ny) > 0.6) uv.setXY(i, (x + cx)/esc, (z + cz)/esc);
    else if (r){ const a = Math.atan2(x, z)/TAU + 0.5; uv.setXY(i, a*vueltas, y/esc); }
    else if (Math.abs(nx) > Math.abs(nz)) uv.setXY(i, (z + cz)/esc, y/esc);
    else uv.setXY(i, (x + cx)/esc, y/esc);
  }
  uv.needsUpdate = true;
}
function piezaSuelo(s, fondo){
  const mats = matSuelo(s.mat);
  const y0 = Math.max(s.y0, fondo), alto = Math.max(0.2, (s.t === 'rampa' ? Math.max(s.ya, s.yb) : s.y1) - y0);
  const g = new THREE.Group();
  let geo, mesh;
  const esc = s.mat === 'faro' ? 6 : 3.2;
  if (s.t === 'cil'){
    const seg = Math.min(64, Math.max(20, Math.round(s.r*6)));
    geo = new THREE.CylinderGeometry(s.r, s.flota ? s.r*0.92 : s.r, alto, seg, 1);
    geo.translate(0, -alto/2, 0);
    uvMundo(geo, s.x, s.z, s.r, esc);
    mesh = new THREE.Mesh(geo, [mats.lado, mats.top, mats.lado]);
    /* el bordecito redondo de arriba */
    if (s.mat === 'pasto' || s.mat === 'nieve' || s.mat === 'arena' || s.mat === 'nube'){
      const borde = new THREE.Mesh(new THREE.TorusGeometry(s.r - 0.02, 0.14, 8, seg), mats.top);
      borde.rotation.x = Math.PI/2; borde.position.y = -0.04;
      g.add(borde);
    }
    /* las islas flotantes tienen una piedra puntiaguda debajo */
    if (s.flota && s.mat !== 'nube' && s.mat !== 'arcoiris' && s.mat !== 'hielo'){
      const cono = new THREE.Mesh(new THREE.ConeGeometry(s.r*0.85, s.r*1.1, seg, 1), matSuelo(s.mat === 'madera' ? 'madera' : 'pasto').lado);
      cono.rotation.x = Math.PI; cono.position.y = -alto - s.r*0.55;
      g.add(cono);
    }
    if (s.mat === 'nube'){
      const R = rng(Math.round(s.x*13 + s.z*7));
      const n = Math.round(4 + s.r*1.5);
      for (let i = 0; i < n; i++){
        const a = i/n*TAU + R()*0.3, rr = s.r*(0.75 + R()*0.2), b = 0.7 + R()*0.6 + s.r*0.08;
        const bola = new THREE.Mesh(GEO.esfera, mats.top);
        bola.scale.setScalar(b); bola.position.set(Math.sin(a)*rr, -alto*0.5 - R()*0.6, Math.cos(a)*rr);
        g.add(bola);
      }
    }
  } else {
    geo = new THREE.BoxGeometry(s.sx*2, alto, s.sz*2);
    geo.translate(0, -alto/2, 0);
    if (s.t === 'rampa'){
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++){
        if (pos.getY(i) > -0.01){
          const u = s.eje === 'x' ? (pos.getX(i)/(2*s.sx) + 0.5) : (pos.getZ(i)/(2*s.sz) + 0.5);
          pos.setY(i, (s.ya + (s.yb - s.ya)*u) - (y0 + alto));
        }
      }
      geo.computeVertexNormals();
    }
    uvMundo(geo, s.x, s.z, 0, esc);
    mesh = new THREE.Mesh(geo, [mats.lado, mats.lado, mats.top, mats.lado, mats.lado, mats.lado]);
  }
  mesh.castShadow = s.flota || alto < 20; mesh.receiveShadow = true;
  g.add(mesh);
  g.traverse(o=>{ if (o.isMesh){ o.receiveShadow = true; if (o !== mesh) o.castShadow = true; } });
  g.position.set(s.x, s.t === 'rampa' ? y0 + alto : s.y1, s.z);
  return g;
}

/* ---------------- geometrías compartidas ---------------- */
const GEO = {
  esfera: new THREE.SphereGeometry(1, 20, 14),
  esferaB: new THREE.SphereGeometry(1, 12, 8),
  cil: new THREE.CylinderGeometry(1, 1, 1, 16),
  cubo: new THREE.BoxGeometry(1, 1, 1),
  cono: new THREE.ConeGeometry(1, 1, 16),
};
for (const k in GEO) GEO[k].userData.compartida = true;
function bola(mat, r, x, y, z, sx, sy, sz){
  const m = new THREE.Mesh(GEO.esfera, mat);
  m.position.set(x || 0, y || 0, z || 0);
  m.scale.set(r*(sx || 1), r*(sy || 1), r*(sz || 1));
  m.castShadow = true;
  return m;
}
function palo(mat, r1, r2, h, seg){
  const geo = new THREE.CylinderGeometry(r1, r2, h, seg || 12);
  const m = new THREE.Mesh(geo, mat); m.castShadow = true;
  return m;
}
/* ojos con brillito: devuelve un grupo */
const M_BLANCO = std('#ffffff', {roughness:0.25}), M_NEGRO = std('#141414', {roughness:0.15}), M_BRILLO = new THREE.MeshBasicMaterial({color:'#ffffff'});
function ojo(r){
  const g = new THREE.Group();
  g.add(bola(M_BLANCO, r, 0, 0, 0, 0.8, 1.1, 0.55));
  const pu = bola(M_NEGRO, r*0.55, 0, -r*0.05, r*0.42, 1, 1.2, 0.5); g.add(pu);
  const br = new THREE.Mesh(GEO.esferaB, M_BRILLO); br.scale.setScalar(r*0.18); br.position.set(r*0.15, r*0.25, r*0.62); g.add(br);
  return g;
}
function sonrisa(mat, r, grueso){
  const m = new THREE.Mesh(new THREE.TorusGeometry(r, grueso, 6, 16, Math.PI), mat);
  m.rotation.z = Math.PI;
  return m;
}
function etiqueta(texto, color, fondo, w, h, fuente){
  return lienzo(w || 128, h || 128, (x, W, H)=>{
    if (fondo){ x.fillStyle = fondo; x.beginPath(); x.arc(W/2, H/2, W/2 - 2, 0, TAU); x.fill(); }
    x.fillStyle = color; x.font = fuente || `bold ${Math.floor(H*0.62)}px Fredoka, Arial, sans-serif`;
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(texto, W/2, H/2 + H*0.04);
  }, false);
}

/* ============================================================
   FERNANDO (gorra roja, camisa roja, overol azul)
   ============================================================ */
function crearFernando(){
  const g = new THREE.Group();
  const mats = {
    piel: std('#ffcfa6', {roughness:0.55}), rojo: std('#e8262a', {roughness:0.45}), azul: std('#2f52e6', {roughness:0.5}),
    cafe: std('#6b3a18', {roughness:0.65}), pelo: std('#4a2a12', {roughness:0.8}), oro: std('#ffd23f', {metalness:0.8, roughness:0.25}),
    boca: std('#a8283a', {roughness:0.4}), mejilla: std('#ff9a9a', {roughness:0.7, transparent:true, opacity:0.55}),
  };
  const cuerpo = new THREE.Group(); g.add(cuerpo);
  /* piernas con zapatos */
  const pierna = (lado)=>{
    const p = new THREE.Group(); p.position.set(0.13*lado, 0.46, 0);
    const l = palo(mats.azul, 0.11, 0.1, 0.32); l.position.y = -0.16; p.add(l);
    const z = bola(mats.cafe, 0.14, 0, -0.36, 0.05, 1, 0.68, 1.45); p.add(z);
    cuerpo.add(p); return p;
  };
  const piernaI = pierna(1), piernaD = pierna(-1);
  /* tronco: overol azul y camisa roja arriba */
  cuerpo.add(bola(mats.azul, 0.31, 0, 0.72, 0, 1, 1.05, 0.9));
  const camisa = new THREE.Mesh(new THREE.SphereGeometry(0.325, 24, 12, 0, TAU, 0, Math.PI*0.42), mats.rojo);
  camisa.position.y = 0.76; camisa.scale.set(1, 1.05, 0.92); camisa.castShadow = true; cuerpo.add(camisa);
  for (const lado of [1, -1]){
    const tira = new THREE.Mesh(GEO.cubo, mats.azul); tira.scale.set(0.07, 0.3, 0.04); tira.position.set(0.12*lado, 0.9, 0.265); tira.rotation.x = -0.35; cuerpo.add(tira);
    cuerpo.add(bola(mats.oro, 0.045, 0.12*lado, 0.8, 0.29));
  }
  /* brazos */
  const brazo = (lado)=>{
    const b = new THREE.Group(); b.position.set(0.31*lado, 0.92, 0);
    b.add(bola(mats.rojo, 0.11, 0, 0, 0));
    const a = palo(mats.piel, 0.06, 0.055, 0.28); a.position.y = -0.17; b.add(a);
    b.add(bola(mats.piel, 0.085, 0, -0.33, 0));
    b.rotation.z = 0.25*lado;
    cuerpo.add(b); return b;
  };
  const brazoI = brazo(1), brazoD = brazo(-1);
  /* cabeza grandota */
  const cabeza = new THREE.Group(); cabeza.position.y = 1.3; cuerpo.add(cabeza);
  cabeza.add(bola(mats.piel, 0.36, 0, 0, 0));
  const pelo = new THREE.Mesh(new THREE.SphereGeometry(0.372, 24, 12, Math.PI*1.1, Math.PI*0.8, Math.PI*0.25, Math.PI*0.45), mats.pelo);
  cabeza.add(pelo);
  for (const lado of [1, -1]){
    cabeza.add(bola(mats.piel, 0.08, 0.35*lado, -0.02, 0, 0.6, 1, 1));
    const o = ojo(0.085); o.position.set(0.125*lado, 0.04, 0.305); cabeza.add(o);
    const mj = bola(mats.mejilla, 0.06, 0.22*lado, -0.09, 0.27, 1, 0.7, 0.4); mj.castShadow = false; cabeza.add(mj);
    const ceja = new THREE.Mesh(GEO.cubo, mats.pelo); ceja.scale.set(0.09, 0.022, 0.02); ceja.position.set(0.125*lado, 0.165, 0.33); ceja.rotation.z = -0.15*lado; cabeza.add(ceja);
  }
  cabeza.add(bola(mats.piel, 0.075, 0, -0.04, 0.36));
  const boca = sonrisa(mats.boca, 0.07, 0.018); boca.position.set(0, -0.13, 0.33); cabeza.add(boca);
  /* gorra roja con la F */
  const gorra = new THREE.Group(); gorra.position.y = 0.05; cabeza.add(gorra);
  const domo = new THREE.Mesh(new THREE.SphereGeometry(0.385, 28, 12, 0, TAU, 0, Math.PI*0.5), mats.rojo); domo.castShadow = true; gorra.add(domo);
  const visera = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 24, 1, false, -Math.PI/2, Math.PI), mats.rojo);
  visera.position.set(0, 0.02, 0.2); visera.scale.set(1, 1, 0.85); visera.rotation.x = 0.12; gorra.add(visera);
  const emb = new THREE.Mesh(new THREE.CircleGeometry(0.11, 24), new THREE.MeshStandardMaterial({map: etiqueta('F', '#e8262a', '#ffffff'), roughness:0.4}));
  emb.position.set(0, 0.2, 0.33); emb.rotation.x = -0.5; gorra.add(emb);
  /* alas de la gorra (poder) */
  const alas = new THREE.Group(); alas.visible = false; gorra.add(alas);
  const mPluma = std('#ffffff', {roughness:0.4, emissive:'#cfe8ff', emissiveIntensity:0.3});
  for (const lado of [1, -1]){
    const ala = new THREE.Group(); ala.position.set(0.36*lado, 0.12, -0.05); ala.userData.lado = lado;
    for (let i = 0; i < 3; i++){ const p = bola(mPluma, 0.2 - i*0.04, 0.12*lado + 0.1*i*lado, 0.06 + i*0.07, -0.02*i, 1.3, 0.35, 0.6); p.rotation.z = (0.4 + i*0.25)*lado; ala.add(p); }
    alas.add(ala);
  }
  /* imán (poder) */
  const iman = new THREE.Group(); iman.visible = false; g.add(iman);
  const mImanR = std('#ff3a3a', {roughness:0.3, metalness:0.3}), mImanG = std('#dfe6ee', {roughness:0.2, metalness:0.9});
  const u = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.08, 10, 20, Math.PI), mImanR); u.rotation.z = Math.PI; iman.add(u);
  for (const lado of [1, -1]){ const pt = palo(mImanG, 0.08, 0.08, 0.12); pt.position.set(0.22*lado, 0.06, 0); iman.add(pt); }
  iman.position.y = 2.3;
  return {g, cuerpo, piernaI, piernaD, brazoI, brazoD, cabeza, alas, iman, mats,
          base: {rojo: mats.rojo.color.clone(), azul: mats.azul.color.clone(), cafe: mats.cafe.color.clone()}};
}

/* ============================================================
   TÍO JUAN (el superhéroe: traje azul, capa roja, TJ dorado)
   ============================================================ */
function crearTio(){
  const g = new THREE.Group();
  const mats = {
    piel: std('#f2bf98', {roughness:0.55}), azul: std('#1560d0', {roughness:0.35, metalness:0.15}), rojo: std('#d82800', {roughness:0.45}),
    pelo: std('#1d1b1a', {roughness:0.7}), oro: std('#ffd23f', {metalness:0.85, roughness:0.2}), boca: std('#8a2a2a'),
  };
  const cuerpo = new THREE.Group(); g.add(cuerpo);
  const pierna = (lado)=>{
    const p = new THREE.Group(); p.position.set(0.17*lado, 0.8, 0);
    const l = palo(mats.azul, 0.14, 0.12, 0.6); l.position.y = -0.3; p.add(l);
    const b = palo(mats.rojo, 0.14, 0.15, 0.3); b.position.y = -0.62; p.add(b);
    p.add(bola(mats.rojo, 0.15, 0, -0.78, 0.06, 1, 0.6, 1.4));
    cuerpo.add(p); return p;
  };
  const piernaI = pierna(1), piernaD = pierna(-1);
  const torso = palo(mats.azul, 0.36, 0.28, 0.75, 20); torso.position.y = 1.18; cuerpo.add(torso);
  cuerpo.add(bola(mats.azul, 0.36, 0, 1.52, 0, 1.05, 0.55, 0.85));
  const cint = palo(mats.oro, 0.3, 0.3, 0.09, 20); cint.position.y = 0.86; cuerpo.add(cint);
  const emb = new THREE.Mesh(new THREE.CircleGeometry(0.17, 28), new THREE.MeshStandardMaterial({map: etiqueta('TJ', '#d82800', '#ffd23f', 128, 128, 'bold 64px Fredoka, Arial'), roughness:0.3, metalness:0.3}));
  emb.position.set(0, 1.3, 0.335); emb.rotation.x = -0.12; cuerpo.add(emb);
  const brazo = (lado)=>{
    const b = new THREE.Group(); b.position.set(0.43*lado, 1.5, 0);
    b.add(bola(mats.azul, 0.14, 0, 0, 0));
    const a = palo(mats.azul, 0.09, 0.08, 0.5); a.position.y = -0.27; b.add(a);
    b.add(bola(mats.rojo, 0.11, 0, -0.55, 0));
    b.rotation.z = 0.18*lado;
    cuerpo.add(b); return b;
  };
  const brazoI = brazo(1), brazoD = brazo(-1);
  const cabeza = new THREE.Group(); cabeza.position.y = 1.92; cuerpo.add(cabeza);
  cabeza.add(bola(mats.piel, 0.3, 0, 0, 0, 1, 1.08, 1));
  const pelo = new THREE.Mesh(new THREE.SphereGeometry(0.315, 24, 12, 0, TAU, 0, Math.PI*0.42), mats.pelo); pelo.rotation.x = -0.25; cabeza.add(pelo);
  cabeza.add(bola(mats.pelo, 0.14, 0, 0.2, 0.18, 1.6, 0.6, 0.8));
  for (const lado of [1, -1]){
    const o = ojo(0.065); o.position.set(0.1*lado, 0.04, 0.26); cabeza.add(o);
    const ceja = new THREE.Mesh(GEO.cubo, mats.pelo); ceja.scale.set(0.1, 0.025, 0.02); ceja.position.set(0.1*lado, 0.14, 0.28); cabeza.add(ceja);
    cabeza.add(bola(mats.piel, 0.065, 0.3*lado, 0, 0, 0.6, 1, 1));
  }
  cabeza.add(bola(mats.piel, 0.06, 0, -0.03, 0.3));
  const boca = sonrisa(mats.boca, 0.08, 0.02); boca.position.set(0, -0.13, 0.27); cabeza.add(boca);
  /* la capa (se ondula en la vista) */
  const capaGeo = new THREE.PlaneGeometry(0.78, 1.3, 6, 10);
  capaGeo.translate(0, -0.65, 0);
  const capa = new THREE.Mesh(capaGeo, std('#b0140c', {side: THREE.DoubleSide, roughness:0.6}));
  capa.position.set(0, 1.62, -0.3); capa.castShadow = true;
  capa.userData.base = Float32Array.from(capaGeo.attributes.position.array);
  cuerpo.add(capa);
  return {g, cuerpo, piernaI, piernaD, brazoI, brazoD, cabeza, capa, mats};
}
/* ondea la capa: v = qué tan rápido va, t = tiempo */
function ondearCapa(capa, t, v){
  const pos = capa.geometry.attributes.position, b = capa.userData.base;
  for (let i = 0; i < pos.count; i++){
    const x0 = b[i*3], y = b[i*3 + 1];
    const k = -y/1.3;
    const x = x0*(0.55 + 0.5*k);                       // angosta en los hombros, ancha abajo
    pos.setX(i, x);
    pos.setZ(i, x*x*0.9 - k*(0.25 + v*0.07) - Math.sin(t*7 + y*4 + x*2)*0.08*k*(0.5 + v*0.15));
    pos.setY(i, y*(1 - Math.min(0.35, v*0.03)*k));
  }
  pos.needsUpdate = true;
  capa.geometry.computeVertexNormals();
}

/* ============================================================
   PENNY (negra) y SHELDON (marrón)
   ============================================================ */
function crearPerro(color, nombre){
  const g = new THREE.Group();
  const m = std(color, {roughness:0.8}), mc = std(nombre === 'penny' ? '#3a3a3a' : '#c48a50', {roughness:0.8}), nariz = std('#141414', {roughness:0.2});
  const lengua = std('#ff7a9a');
  const cuerpo = new THREE.Group(); g.add(cuerpo);
  cuerpo.add(bola(m, 0.26, 0, 0.42, 0, 0.9, 0.85, 1.45));
  const cabeza = new THREE.Group(); cabeza.position.set(0, 0.68, 0.36); cuerpo.add(cabeza);
  cabeza.add(bola(m, 0.21, 0, 0, 0));
  cabeza.add(bola(mc, 0.12, 0, -0.05, 0.16, 1, 0.8, 1.1));
  cabeza.add(bola(nariz, 0.045, 0, -0.01, 0.29));
  const len = bola(lengua, 0.05, 0, -0.12, 0.22, 0.8, 0.3, 1.2); cabeza.add(len);
  const orejas = [];
  for (const lado of [1, -1]){
    const o = ojo(0.05); o.position.set(0.08*lado, 0.06, 0.17); cabeza.add(o);
    const or = new THREE.Group(); or.position.set(0.15*lado, 0.1, -0.02);
    or.add(bola(mc, 0.1, 0, -0.1, 0, 0.45, 1.1, 0.8)); or.rotation.z = 0.35*lado; cabeza.add(or); orejas.push(or);
  }
  const patas = [];
  for (const [px, pz] of [[0.13, 0.22], [-0.13, 0.22], [0.13, -0.22], [-0.13, -0.22]]){
    const p = new THREE.Group(); p.position.set(px, 0.3, pz);
    const l = palo(m, 0.06, 0.055, 0.26); l.position.y = -0.13; p.add(l);
    p.add(bola(mc, 0.065, 0, -0.27, 0.02, 1, 0.7, 1.2));
    cuerpo.add(p); patas.push(p);
  }
  const cola = new THREE.Group(); cola.position.set(0, 0.55, -0.34); cuerpo.add(cola);
  const c = palo(m, 0.04, 0.025, 0.28); c.position.y = 0.13; cola.add(c); cola.rotation.x = -0.6;
  /* collar con placa */
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.03, 8, 20), std(nombre === 'penny' ? '#ff4aa0' : '#3aa0ff', {roughness:0.4}));
  collar.position.set(0, 0.6, 0.27); collar.rotation.x = Math.PI/2 + 0.6; cuerpo.add(collar);
  return {g, cuerpo, cabeza, patas, cola, orejas};
}

/* ============================================================
   ENEMIGOS (pieles) y JEFES
   ============================================================ */
function cejasEnojadas(mat, g, y, z, sep, s){
  for (const lado of [1, -1]){ const c = new THREE.Mesh(GEO.cubo, mat); c.scale.set(0.16*s, 0.04*s, 0.04*s); c.position.set(sep*lado, y, z); c.rotation.z = 0.45*lado; g.add(c); }
}
function crearEnemigo(piel){
  const g = new THREE.Group(), cuerpo = new THREE.Group(); g.add(cuerpo);
  const pies = [], alas = [];
  const negro = std('#2a1a12', {roughness:0.6});
  if (piel === 'grunon' || piel === 'rey'){
    const cafe = std('#a0582a', {roughness:0.55}), crema = std('#f6dcae', {roughness:0.6});
    cuerpo.add(bola(crema, 0.32, 0, 0.42, 0, 1, 0.9, 1));
    const cab = bola(cafe, 0.55, 0, 0.78, 0, 1, 0.72, 1); cuerpo.add(cab);
    for (const lado of [1, -1]){
      const o = ojo(0.12); o.position.set(0.17*lado, 0.82, 0.42); cuerpo.add(o);
      const p = bola(negro, 0.2, 0.2*lado, 0.1, 0.05, 1, 0.55, 1.4); cuerpo.add(p); pies.push(p);
      const d = new THREE.Mesh(GEO.cono, M_BLANCO); d.scale.set(0.05, 0.1, 0.05); d.rotation.x = Math.PI; d.position.set(0.12*lado, 0.55, 0.47); cuerpo.add(d);
    }
    cejasEnojadas(negro, cuerpo, 0.98, 0.47, 0.17, 1.2);
  } else if (piel === 'cangrejo'){
    const rojo = std('#ff4a2a', {roughness:0.35});
    cuerpo.add(bola(rojo, 0.45, 0, 0.4, 0, 1.3, 0.6, 0.9));
    for (const lado of [1, -1]){
      const tallo = palo(rojo, 0.04, 0.04, 0.3); tallo.position.set(0.14*lado, 0.75, 0.15); cuerpo.add(tallo);
      const o = ojo(0.1); o.position.set(0.14*lado, 0.92, 0.18); cuerpo.add(o);
      const pinza = new THREE.Group(); pinza.position.set(0.62*lado, 0.45, 0.25);
      pinza.add(bola(rojo, 0.17, 0, 0, 0, 1, 0.8, 1.2));
      const tapa = bola(rojo, 0.12, 0, 0.1, 0.12, 1, 0.5, 1); pinza.add(tapa);
      cuerpo.add(pinza); alas.push(pinza);
      for (let k = 0; k < 3; k++){ const pata = palo(rojo, 0.035, 0.03, 0.4); pata.position.set(0.45*lado, 0.18, -0.15 + k*0.15); pata.rotation.z = 0.8*lado; cuerpo.add(pata); pies.push(pata); }
    }
    cejasEnojadas(negro, cuerpo, 1.05, 0.2, 0.14, 0.8);
  } else if (piel === 'pinguino'){
    const azul = std('#20304a', {roughness:0.4}), blanco = std('#f4f6ff'), naranja = std('#ff9a1a');
    cuerpo.add(bola(azul, 0.42, 0, 0.55, 0, 1, 1.25, 0.95));
    cuerpo.add(bola(blanco, 0.34, 0, 0.5, 0.12, 0.9, 1.1, 0.8));
    const pico = new THREE.Mesh(GEO.cono, naranja); pico.scale.set(0.08, 0.2, 0.08); pico.rotation.x = Math.PI/2; pico.position.set(0, 0.85, 0.42); cuerpo.add(pico);
    for (const lado of [1, -1]){
      const o = ojo(0.09); o.position.set(0.13*lado, 0.98, 0.32); cuerpo.add(o);
      const f = bola(naranja, 0.13, 0.15*lado, 0.06, 0.12, 1, 0.4, 1.5); cuerpo.add(f); pies.push(f);
      const al = bola(azul, 0.22, 0.4*lado, 0.55, 0, 0.3, 1, 0.6); al.rotation.z = 0.3*lado; cuerpo.add(al); alas.push(al);
    }
    const gorro = new THREE.Mesh(GEO.cono, std('#e8262a')); gorro.scale.set(0.25, 0.35, 0.25); gorro.position.set(0, 1.35, 0); cuerpo.add(gorro);
    cuerpo.add(bola(std('#ffffff'), 0.08, 0, 1.55, 0));
    cejasEnojadas(negro, cuerpo, 1.1, 0.36, 0.13, 0.8);
  } else if (piel === 'nubecita' || piel === 'nubarron'){
    const gris = std(piel === 'nubarron' ? '#6a6f86' : '#c9cde0', {roughness:0.9, emissive:'#20243a', emissiveIntensity:0.2});
    for (let i = 0; i < 6; i++){ const a = i/6*TAU; cuerpo.add(bola(gris, 0.3, Math.sin(a)*0.35, 0.55 + Math.cos(a*2)*0.08, Math.cos(a)*0.28)); }
    cuerpo.add(bola(gris, 0.42, 0, 0.7, 0));
    for (const lado of [1, -1]){ const o = ojo(0.11); o.position.set(0.15*lado, 0.75, 0.4); cuerpo.add(o); }
    cejasEnojadas(negro, cuerpo, 0.92, 0.45, 0.16, 1.1);
    const b = sonrisa(negro, 0.1, 0.025); b.rotation.z = 0; b.position.set(0, 0.5, 0.42); cuerpo.add(b);
    if (piel === 'nubarron'){
      const rayo = std('#ffe23a', {emissive:'#ffd000', emissiveIntensity:1});
      for (const lado of [1, -1]){ const r = new THREE.Mesh(GEO.cono, rayo); r.scale.set(0.08, 0.5, 0.08); r.rotation.x = Math.PI; r.rotation.z = 0.3*lado; r.position.set(0.25*lado, 0.15, 0.1); cuerpo.add(r); pies.push(r); }
    }
  } else if (piel === 'muneco'){
    const nieve = std('#ffffff', {roughness:0.7}), carbon = std('#222'), zanah = std('#ff8a1a');
    cuerpo.add(bola(nieve, 0.5, 0, 0.45, 0));
    cuerpo.add(bola(nieve, 0.38, 0, 1.1, 0));
    const cab = bola(nieve, 0.29, 0, 1.6, 0); cuerpo.add(cab);
    const nariz = new THREE.Mesh(GEO.cono, zanah); nariz.scale.set(0.06, 0.3, 0.06); nariz.rotation.x = Math.PI/2; nariz.position.set(0, 1.6, 0.4); cuerpo.add(nariz);
    for (const lado of [1, -1]){ cuerpo.add(bola(carbon, 0.05, 0.1*lado, 1.7, 0.25)); const br = palo(std('#6b3a18'), 0.03, 0.02, 0.6); br.position.set(0.55*lado, 1.15, 0); br.rotation.z = -1.1*lado; cuerpo.add(br); alas.push(br); }
    for (let k = 0; k < 3; k++) cuerpo.add(bola(carbon, 0.05, 0, 1.25 - k*0.18, 0.36));
    const som = palo(carbon, 0.22, 0.22, 0.3); som.position.y = 1.95; cuerpo.add(som);
    const ala = palo(carbon, 0.33, 0.33, 0.04); ala.position.y = 1.81; cuerpo.add(ala);
    cejasEnojadas(carbon, cuerpo, 1.8, 0.26, 0.1, 0.7);
  } else if (piel === 'abeja' || piel === 'gaviota' || piel === 'pajaro' || piel === 'murcielago'){
    const col = {abeja:'#ffd21a', gaviota:'#ffffff', pajaro:'#3a8aff', murcielago:'#6a3aa0'}[piel];
    const mc = std(col, {roughness:0.45});
    cuerpo.add(bola(mc, 0.36, 0, 0, 0, 1, 0.95, 1.15));
    if (piel === 'abeja'){
      for (let k = 0; k < 2; k++){ const r = new THREE.Mesh(new THREE.TorusGeometry(0.33 - k*0.04, 0.05, 6, 20), negro); r.position.z = -0.1 - k*0.16; cuerpo.add(r); }
      const agu = new THREE.Mesh(GEO.cono, negro); agu.scale.set(0.06, 0.18, 0.06); agu.rotation.x = -Math.PI/2; agu.position.z = -0.48; cuerpo.add(agu);
    } else {
      const pico = new THREE.Mesh(GEO.cono, std(piel === 'murcielago' ? '#ffffff' : '#ffb21a')); pico.scale.set(0.08, 0.2, 0.08); pico.rotation.x = Math.PI/2; pico.position.set(0, -0.05, 0.42); cuerpo.add(pico);
    }
    for (const lado of [1, -1]){
      const o = ojo(0.09); o.position.set(0.13*lado, 0.1, 0.3); cuerpo.add(o);
      const ala = new THREE.Group(); ala.position.set(0.3*lado, 0.18, 0);
      const mAla = piel === 'abeja' ? std('#e8f6ff', {transparent:true, opacity:0.6, roughness:0.1}) : mc;
      ala.add(bola(mAla, 0.28, 0.22*lado, 0.05, 0, 1, 0.12, 0.6)); cuerpo.add(ala); alas.push(ala);
    }
    cejasEnojadas(negro, cuerpo, 0.22, 0.33, 0.13, 0.7);
  }
  if (piel === 'rey'){
    const oro = std('#ffd23f', {metalness:0.9, roughness:0.2, emissive:'#5a4000', emissiveIntensity:0.3});
    const corona = new THREE.Group(); corona.position.y = 1.15;
    const aro = palo(oro, 0.32, 0.36, 0.18, 20); corona.add(aro);
    for (let k = 0; k < 5; k++){ const a = k/5*TAU; const pt = new THREE.Mesh(GEO.cono, oro); pt.scale.set(0.08, 0.22, 0.08); pt.position.set(Math.sin(a)*0.3, 0.18, Math.cos(a)*0.3); corona.add(pt);
      corona.add(bola(std(['#ff3a5a', '#3ae0ff', '#5aff6a'][k%3], {roughness:0.1, metalness:0.2}), 0.045, Math.sin(a)*0.34, 0.02, Math.cos(a)*0.34)); }
    cuerpo.add(corona);
    const capa = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.62, 0.8, 20, 1, true, Math.PI*0.6, Math.PI*0.8), std('#8a1a8a', {side:THREE.DoubleSide}));
    capa.position.set(0, 0.45, -0.05); cuerpo.add(capa);
  }
  g.traverse(o=>{ if (o.isMesh) o.castShadow = true; });
  return {g, cuerpo, pies, alas};
}

/* ============================================================
   MONEDAS, ESTRELLAS, REGALOS, CUADROS, RESORTES, TUBO
   ============================================================ */
const GEO_MONEDA = new THREE.CylinderGeometry(0.42, 0.42, 0.09, 28);
GEO_MONEDA.rotateX(Math.PI/2);
GEO_MONEDA.userData.compartida = true;
const TEX_MONEDA = lienzo(128, 128, (x, w, h)=>{
  x.fillStyle = '#ffd23f'; x.fillRect(0, 0, w, h);
  x.strokeStyle = '#d89a10'; x.lineWidth = 8; x.beginPath(); x.arc(64, 64, 52, 0, TAU); x.stroke();
  x.fillStyle = '#c88a00'; x.fillRect(54, 30, 20, 68);
  x.fillStyle = '#fff2a8'; x.fillRect(50, 26, 10, 68);
}, false);
const MAT_MONEDA = std('#ffffff', {map: TEX_MONEDA, metalness:0.85, roughness:0.22, emissive:'#a86a00', emissiveIntensity:0.25});
const MAT_MONEDA_LADO = std('#e8a820', {metalness:0.9, roughness:0.25});
const MAT_ROJA = std('#ff2a3a', {metalness:0.7, roughness:0.22, emissive:'#7a0010', emissiveIntensity:0.45});
function crearMoneda(roja){
  const m = new THREE.Mesh(GEO_MONEDA, roja ? [MAT_ROJA, MAT_ROJA, MAT_ROJA] : [MAT_MONEDA_LADO, MAT_MONEDA, MAT_MONEDA]);
  m.castShadow = true;
  return m;
}

function geoEstrella(){
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++){
    const a = i/10*TAU + Math.PI/2, r = i % 2 ? 0.42 : 1;
    const x = Math.cos(a)*r, y = Math.sin(a)*r;
    if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
  }
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, {depth:0.28, bevelEnabled:true, bevelThickness:0.14, bevelSize:0.1, bevelSegments:4, curveSegments:4});
  geo.translate(0, 0, -0.14);
  geo.computeVertexNormals();
  return geo;
}
const GEO_ESTRELLA = geoEstrella();
GEO_ESTRELLA.userData.compartida = true;
function crearEstrella(fantasma, grande){
  const g = new THREE.Group();
  const mat = fantasma
    ? new THREE.MeshPhysicalMaterial({color:'#8ab8ff', roughness:0.1, metalness:0.2, transparent:true, opacity:0.55, emissive:'#3a6aff', emissiveIntensity:0.5, clearcoat:1})
    : new THREE.MeshPhysicalMaterial({color:'#ffd23f', roughness:0.12, metalness:0.75, emissive:'#ffa000', emissiveIntensity:0.55, clearcoat:1, clearcoatRoughness:0.1});
  mat.color.convertSRGBToLinear(); mat.emissive.convertSRGBToLinear();
  const e = new THREE.Mesh(GEO_ESTRELLA, mat); e.castShadow = true; g.add(e);
  for (const lado of [1, -1]){ const o = bola(M_NEGRO, 0.07, 0.15*lado, 0.12, 0.27, 0.7, 1.5, 0.5); e.add(o); }
  if (grande) g.scale.setScalar(2.2);
  g.userData.mat = mat;
  return g;
}

/* el halo que brilla (sprite aditivo) */
const TEX_HALO = lienzo(128, 128, (x, w, h)=>{
  const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.55)'); gr.addColorStop(0.6, 'rgba(255,255,255,0.12)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = gr; x.fillRect(0, 0, w, h);
}, false);
TEX_HALO.encoding = THREE.LinearEncoding;
function halo(color, tam, opacidad){
  const s = new THREE.Sprite(new THREE.SpriteMaterial({map: TEX_HALO, color, transparent:true, opacity: opacidad == null ? 0.8 : opacidad, blending: THREE.AdditiveBlending, depthWrite:false}));
  s.scale.setScalar(tam);
  return s;
}
/* columna de luz para ver las estrellas desde lejos */
const TEX_RAYO = lienzo(16, 256, (x, w, h)=>{
  const gr = x.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.7, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0.8)');
  x.fillStyle = gr; x.fillRect(0, 0, w, h);
}, false);
TEX_RAYO.encoding = THREE.LinearEncoding;
function columnaLuz(color){
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.9, 36, 16, 1, true),
    new THREE.MeshBasicMaterial({map: TEX_RAYO, color, transparent:true, opacity:0.55, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide, fog:false}));
  m.position.y = 18;
  return m;
}

const COLOR_PODER = {alas:'#7ad0ff', fuego:'#ff6a2a', hamburguesa:'#ffb43a', gigante:'#ff4a6a', iman:'#ff5ab0', tenis:'#4ae08a'};
const EMOJI_PODER = {alas:'🪽', fuego:'🔥', hamburguesa:'🍔', gigante:'🍄', iman:'🧲', tenis:'👟'};
const TEX_REGALO = {};
function texRegalo(poder){
  if (TEX_REGALO[poder]) return TEX_REGALO[poder];
  const col = COLOR_PODER[poder];
  return (TEX_REGALO[poder] = lienzo(256, 256, (x, w, h)=>{
    x.fillStyle = col; x.fillRect(0, 0, w, h);
    x.fillStyle = 'rgba(255,255,255,0.18)'; for (let i = -w; i < w*2; i += 40){ x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 20, 0); x.lineTo(i + 20 - h, h); x.lineTo(i - h, h); x.fill(); }
    x.fillStyle = '#fff6c8'; x.fillRect(w/2 - 18, 0, 36, h); x.fillRect(0, h/2 - 18, w, 36);
    x.fillStyle = 'rgba(255,255,255,0.92)'; x.beginPath(); x.arc(w/2, h/2, 66, 0, TAU); x.fill();
    x.font = '84px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(EMOJI_PODER[poder], w/2, h/2 + 6);
  }, false));
}
function crearRegalo(poder){
  const g = new THREE.Group();
  const col = COLOR_PODER[poder];
  const mat = std('#ffffff', {map: texRegalo(poder), roughness:0.35, emissive: col, emissiveIntensity:0.12});
  const caja = new THREE.Mesh(new THREE.BoxGeometry(1, 0.85, 1), mat); caja.castShadow = true; g.add(caja);
  const tapa = new THREE.Group(); tapa.position.y = 0.43; g.add(tapa);
  const t = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.2, 1.1), std(col, {roughness:0.35})); t.position.y = 0.1; t.castShadow = true; tapa.add(t);
  const lazoM = std('#fff6c8', {roughness:0.3});
  for (const lado of [1, -1]){ const l = bola(lazoM, 0.22, 0.17*lado, 0.32, 0, 1.2, 0.7, 0.5); l.rotation.z = 0.5*lado; tapa.add(l); }
  tapa.add(bola(lazoM, 0.1, 0, 0.3, 0));
  const h = halo(col, 2.6, 0.55); g.add(h);
  g.userData = {tapa, halo:h};
  return g;
}

const TEX_PORTAL = {};
function crearPortal(mundo, nombre, emoji, color, necesita){
  const g = new THREE.Group();
  const piedra = matSuelo('castillo').lado;
  const oro = std('#ffd23f', {metalness:0.85, roughness:0.25});
  /* marco dorado de cuadro */
  const marco = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.22, 10, 40), oro); marco.position.y = 2.1; marco.castShadow = true; g.add(marco);
  for (const lado of [1, -1]){ const c = palo(piedra, 0.32, 0.38, 2.2); c.position.set(1.95*lado, 1.1, 0); g.add(c); const b = bola(oro, 0.28, 1.95*lado, 2.3, 0); g.add(b); }
  /* el remolino mágico */
  const remolino = new THREE.Mesh(new THREE.CircleGeometry(1.75, 48), new THREE.ShaderMaterial({
    uniforms: {t:{value:0}, c1:{value:new THREE.Color(color)}, c2:{value:new THREE.Color('#ffffff')}, cerrado:{value:0}},
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `uniform float t, cerrado; uniform vec3 c1, c2; varying vec2 vUv;
      void main(){ vec2 p = vUv*2.-1.; float r = length(p), a = atan(p.y, p.x);
        float s = sin(a*5. + r*10. - t*3.)*.5+.5; s = mix(s, sin(a*3. - r*6. + t*2.)*.5+.5, .4);
        vec3 col = mix(c1*.55, c2, pow(s, 3.)*.6 + (1.-r)*.45);
        col = mix(col, vec3(dot(col, vec3(.3,.59,.11)))*.5, cerrado);
        float al = smoothstep(1., .92, r);
        gl_FragColor = vec4(col, al); }`,
    transparent:true, side:THREE.DoubleSide,
  }));
  remolino.position.y = 2.1; g.add(remolino);
  /* letrero con nombre y estrellas que pide */
  const cartel = lienzo(512, 192, (x, w, h)=>{
    x.fillStyle = 'rgba(30,20,60,0.85)'; x.beginPath(); x.roundRect ? x.roundRect(6, 6, w - 12, h - 12, 30) : x.rect(6, 6, w - 12, h - 12); x.fill();
    x.strokeStyle = '#ffd23f'; x.lineWidth = 8; x.stroke();
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = '64px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; x.fillText(emoji, 70, h/2);
    x.fillStyle = '#ffffff'; x.font = 'bold 40px Fredoka, Arial'; x.fillText('MUNDO ' + mundo, w/2 + 40, 58);
    x.fillStyle = '#ffd23f'; x.font = 'bold 44px Fredoka, Arial'; x.fillText('★ ' + necesita, w/2 + 40, 128);
  }, false);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({map: cartel, transparent:true, depthWrite:false}));
  sp.scale.set(3.2, 1.2, 1); sp.position.y = 4.6; g.add(sp);
  /* candado */
  const candado = new THREE.Group(); candado.position.set(0, 2.1, 0.12);
  candado.add(new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.55, 0.2), oro));
  const arco = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.07, 8, 16, Math.PI), std('#cfd6de', {metalness:0.9, roughness:0.2})); arco.position.y = 0.28; candado.add(arco);
  g.add(candado);
  const h = halo(color, 6, 0.35); h.position.y = 2.1; g.add(h);
  g.userData = {remolino, candado, halo:h};
  return g;
}

function crearResorte(){
  const g = new THREE.Group();
  const rojo = std('#ff3a4a', {roughness:0.3}), metal = std('#dfe6ee', {metalness:0.9, roughness:0.2});
  const base = palo(std('#3a3a4a'), 0.85, 0.9, 0.18, 24); base.position.y = -0.2; g.add(base);
  const muelle = new THREE.Group(); g.add(muelle);
  for (let k = 0; k < 3; k++){ const t = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 8, 24), metal); t.rotation.x = Math.PI/2; t.position.y = -0.05 + k*0.13; muelle.add(t); }
  const tapa = palo(rojo, 0.9, 0.9, 0.16, 28); tapa.position.y = 0.37; g.add(tapa);
  const est = new THREE.Mesh(new THREE.CircleGeometry(0.5, 24), new THREE.MeshStandardMaterial({map: etiqueta('★', '#ffffff', null), transparent:true}));
  est.rotation.x = -Math.PI/2; est.position.y = 0.46; g.add(est);
  g.traverse(o=>{ if (o.isMesh) o.castShadow = true; });
  g.userData = {muelle, tapa, est};
  return g;
}
function crearTubo(){
  const g = new THREE.Group();
  const verde = std('#2ac84a', {roughness:0.25, metalness:0.3});
  const c = palo(verde, 0.85, 0.85, 1.4, 28); c.position.y = -0.7 + 0.0; g.add(c);
  const borde = palo(verde, 1.02, 1.02, 0.35, 28); borde.position.y = -0.17; g.add(borde);
  const hueco = new THREE.Mesh(new THREE.CircleGeometry(0.82, 28), new THREE.MeshBasicMaterial({color:'#04160a'})); hueco.rotation.x = -Math.PI/2; hueco.position.y = 0.01; g.add(hueco);
  g.traverse(o=>{ if (o.isMesh && o.material !== hueco.material) o.castShadow = true; });
  return g;
}

/* ============================================================
   AMIGOS: Abu y Santi
   ============================================================ */
function crearAbu(){
  const g = new THREE.Group();
  const piel = std('#f6c9a8'), canas = std('#e4e4ea', {roughness:0.8}), vestido = std('#9a5ad8'), lentes = std('#333', {metalness:0.5});
  g.add(bola(vestido, 0.42, 0, 0.55, 0, 1, 1.35, 0.95));
  const cab = new THREE.Group(); cab.position.y = 1.35; g.add(cab);
  cab.add(bola(piel, 0.3, 0, 0, 0));
  const pelo = new THREE.Mesh(new THREE.SphereGeometry(0.315, 20, 10, 0, TAU, 0, Math.PI*0.45), canas); cab.add(pelo);
  cab.add(bola(canas, 0.16, 0, 0.3, -0.15));
  for (const lado of [1, -1]){ const o = ojo(0.06); o.position.set(0.1*lado, 0.03, 0.26); cab.add(o);
    const l = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 6, 16), lentes); l.position.set(0.1*lado, 0.03, 0.3); cab.add(l); }
  const b = sonrisa(std('#a8283a'), 0.07, 0.016); b.position.set(0, -0.12, 0.27); cab.add(b);
  for (const lado of [1, -1]){ const br = bola(vestido, 0.1, 0.4*lado, 0.95, 0.1, 1, 2, 1); br.rotation.z = 0.3*lado; g.add(br); }
  const baston = palo(std('#6b3a18'), 0.03, 0.03, 1); baston.position.set(0.5, 0.5, 0.2); g.add(baston);
  g.traverse(o=>{ if (o.isMesh) o.castShadow = true; });
  return g;
}
function crearSanti(){
  const g = new THREE.Group();
  const piel = std('#ffd2b0'), manta = std('#8ecbff', {roughness:0.8});
  g.add(bola(manta, 0.38, 0, 0.35, 0, 1, 0.9, 1));
  const cab = new THREE.Group(); cab.position.y = 0.8; g.add(cab);
  cab.add(bola(piel, 0.27, 0, 0, 0));
  cab.add(bola(std('#4a2f10'), 0.1, 0, 0.24, 0.05, 1, 0.5, 1));
  for (const lado of [1, -1]){ const o = ojo(0.06); o.position.set(0.09*lado, 0.03, 0.22); cab.add(o); }
  cab.add(bola(std('#7ad0ff'), 0.06, 0, -0.1, 0.25, 1, 1, 0.5));
  g.traverse(o=>{ if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ============================================================
   ADORNOS
   ============================================================ */
const MAT_DECO = {};
function md(clave, color, o){ return MAT_DECO[clave] || (MAT_DECO[clave] = std(color, o)); }
function arbol(R, escala){
  const g = new THREE.Group();
  const tronco = palo(md('tronco', '#7a4a22', {roughness:0.85}), 0.18, 0.28, 1.8, 10); tronco.position.y = 0.9; g.add(tronco);
  const verdes = [md('hoja1', '#3fae3a', {roughness:0.75, flatShading:true}), md('hoja2', '#57c444', {roughness:0.75, flatShading:true}), md('hoja3', '#2f9a34', {roughness:0.75, flatShading:true})];
  const geo = new THREE.IcosahedronGeometry(1, 1);
  for (let i = 0; i < 4; i++){
    const m = new THREE.Mesh(geo, verdes[i % 3]);
    const s = 0.9 + R()*0.5;
    m.scale.set(s, s*0.85, s); m.position.set((R() - 0.5)*1.1, 2.2 + R()*0.9 + (i === 3 ? 0.7 : 0), (R() - 0.5)*1.1);
    m.rotation.set(R()*3, R()*3, 0); m.castShadow = true; g.add(m);
  }
  if (R() < 0.35) for (let i = 0; i < 4; i++){ const a = R()*TAU; g.add(bola(md('manzana', '#ff3a3a', {roughness:0.3}), 0.12, Math.sin(a)*1.1, 2.1 + R()*0.8, Math.cos(a)*1.1)); }
  g.scale.setScalar(escala);
  return g;
}
function pino(R, escala, nevado){
  const g = new THREE.Group();
  const tronco = palo(md('tronco', '#7a4a22'), 0.15, 0.22, 1, 8); tronco.position.y = 0.5; g.add(tronco);
  const verde = md('pino', '#2a7a4a', {roughness:0.8, flatShading:true}), nieve = md('nieveDeco', '#ffffff', {roughness:0.6});
  for (let i = 0; i < 3; i++){
    const c = new THREE.Mesh(new THREE.ConeGeometry(1.25 - i*0.3, 1.5, 9), verde); c.position.y = 1.3 + i*0.85; c.castShadow = true; g.add(c);
    if (nevado){ const n = new THREE.Mesh(new THREE.ConeGeometry(0.75 - i*0.18, 0.6, 9), nieve); n.position.y = 1.75 + i*0.85; g.add(n); }
  }
  g.scale.setScalar(escala);
  return g;
}
function palmera(R, escala){
  const g = new THREE.Group();
  const mt = md('palmTronco', '#9a6a3a', {roughness:0.85}), mh = md('palmHoja', '#2a9a2a', {roughness:0.6, side:THREE.DoubleSide});
  const curva = (R() - 0.5)*0.6;
  let x = 0, y = 0;
  for (let i = 0; i < 6; i++){
    const s = palo(mt, 0.16 - i*0.012, 0.2 - i*0.012, 0.7, 8); s.position.set(x, y + 0.35, 0); s.rotation.z = -curva*i*0.25; g.add(s);
    x += Math.sin(curva*i*0.25)*0.7; y += Math.cos(curva*i*0.25)*0.68;
  }
  const copa = new THREE.Group(); copa.position.set(x, y + 0.1, 0); g.add(copa);
  const hoja = new THREE.PlaneGeometry(0.6, 2.4, 1, 6);
  const pos = hoja.attributes.position;
  for (let i = 0; i < pos.count; i++){ const yy = pos.getY(i) + 1.2; pos.setY(i, yy); pos.setZ(i, -Math.pow(yy/2.4, 2)*1.1); pos.setX(i, pos.getX(i)*(1 - yy/2.4*0.8)); }
  hoja.computeVertexNormals();
  for (let i = 0; i < 7; i++){ const h = new THREE.Mesh(hoja, mh); h.rotation.set(-1.0, i/7*TAU, 0, 'YXZ'); h.castShadow = true; copa.add(h); }
  for (let i = 0; i < 3; i++) copa.add(bola(md('coco', '#6b4a22'), 0.13, Math.sin(i*2)*0.18, -0.15, Math.cos(i*2)*0.18));
  g.scale.setScalar(escala);
  return g;
}
function roca(R, escala, color){
  const m = new THREE.Mesh(new THREE.DodecahedronGeometry(1, 0), md('roca' + (color || ''), color || '#9a9aa8', {roughness:0.85, flatShading:true}));
  m.scale.set(escala*(0.8 + R()*0.6), escala*(0.5 + R()*0.4), escala*(0.8 + R()*0.6)); m.rotation.set(R(), R()*3, R());
  m.position.y = escala*0.2; m.castShadow = true; m.receiveShadow = true;
  return m;
}
function hongo(R, escala){
  const g = new THREE.Group();
  const p = palo(md('hongoPie', '#fff4e0'), 0.15, 0.2, 0.5, 10); p.position.y = 0.25; g.add(p);
  const s = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 8, 0, TAU, 0, Math.PI/2), md('hongoSom' + (R() < 0.5 ? 'r' : 'a'), R() < 0.5 ? '#ff3a3a' : '#3a8aff', {roughness:0.4}));
  s.position.y = 0.45; s.castShadow = true; g.add(s);
  for (let i = 0; i < 5; i++){ const a = i/5*TAU; g.add(bola(md('lunar', '#ffffff'), 0.07, Math.sin(a)*0.3, 0.68, Math.cos(a)*0.3, 1, 0.5, 1)); }
  g.scale.setScalar(escala);
  return g;
}
function cerca(largo){
  const g = new THREE.Group();
  const m = md('cerca', '#f4e8d0', {roughness:0.7});
  const n = Math.max(2, Math.round(largo/1.2));
  for (let i = 0; i <= n; i++){ const p = new THREE.Mesh(GEO.cubo, m); p.scale.set(0.14, 0.9, 0.14); p.position.set(-largo/2 + i*largo/n, 0.45, 0); p.castShadow = true; g.add(p); }
  for (const y of [0.35, 0.7]){ const t = new THREE.Mesh(GEO.cubo, m); t.scale.set(largo, 0.1, 0.06); t.position.y = y; t.castShadow = true; g.add(t); }
  return g;
}
function sombrilla(R){
  const g = new THREE.Group();
  const p = palo(md('blanco', '#ffffff'), 0.04, 0.04, 2.4); p.position.y = 1.2; g.add(p);
  const cols = ['#ff4a4a', '#ffffff'];
  for (let i = 0; i < 8; i++){
    const s = new THREE.Mesh(new THREE.ConeGeometry(1.5, 0.6, 2, 1, true, i/8*TAU, TAU/8), md('somb' + i%2, cols[i%2], {side:THREE.DoubleSide}));
    s.position.y = 2.4; s.castShadow = true; g.add(s);
  }
  g.rotation.z = (R() - 0.5)*0.3;
  return g;
}
function concha(R){
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 6, 0, TAU, 0, Math.PI/2), md('concha' + Math.floor(R()*3), ['#ffb0c8', '#fff0d0', '#ffd090'][Math.floor(R()*3)], {roughness:0.4}));
  m.scale.set(1, 0.5, 1.2); m.rotation.y = R()*3;
  return m;
}
function estrellaMar(R){
  const m = new THREE.Mesh(GEO_ESTRELLA, md('estMar', '#ff8a4a', {roughness:0.6}));
  m.scale.set(0.25, 0.25, 0.25); m.rotation.x = -Math.PI/2; m.rotation.z = R()*3; m.position.y = 0.05;
  return m;
}
function munecoDeco(){
  const g = new THREE.Group();
  const n = md('nieveDeco', '#ffffff', {roughness:0.6});
  g.add(bola(n, 0.5, 0, 0.45, 0)); g.add(bola(n, 0.36, 0, 1.1, 0)); g.add(bola(n, 0.26, 0, 1.6, 0));
  const nariz = new THREE.Mesh(GEO.cono, md('zanah', '#ff8a1a')); nariz.scale.set(0.05, 0.25, 0.05); nariz.rotation.x = Math.PI/2; nariz.position.set(0, 1.6, 0.35); g.add(nariz);
  for (const lado of [1, -1]) g.add(bola(md('carbon', '#222'), 0.04, 0.09*lado, 1.68, 0.22));
  const bufanda = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.07, 8, 16), md('bufanda', '#3a8aff')); bufanda.rotation.x = Math.PI/2; bufanda.position.y = 1.38; g.add(bufanda);
  return g;
}
function regaloDeco(R){
  const c = ['#ff4a6a', '#4a8aff', '#ffd23f', '#4ae08a'][Math.floor(R()*4)];
  const g = new THREE.Group();
  const b = new THREE.Mesh(GEO.cubo, md('reg' + c, c, {roughness:0.4})); const s = 0.5 + R()*0.4; b.scale.setScalar(s); b.position.y = s/2; b.castShadow = true; g.add(b);
  const l = new THREE.Mesh(GEO.cubo, md('lazo', '#ffffff')); l.scale.set(s*1.02, s*1.02, s*0.2); l.position.y = s/2; g.add(l);
  const l2 = l.clone(); l2.scale.set(s*0.2, s*1.02, s*1.02); g.add(l2);
  g.rotation.y = R()*3;
  return g;
}
function nubeDeco(R, s){
  const g = new THREE.Group();
  const m = md('nubeDeco', '#ffffff', {roughness:1, emissive:'#ffffff', emissiveIntensity:0.08});
  const n = 5 + Math.floor(R()*4);
  for (let i = 0; i < n; i++) g.add(bola(m, 1 + R()*0.8, (i - n/2)*1.2 + R()*0.5, R()*0.7, (R() - 0.5)*1.5));
  g.traverse(o=>{ if (o.isMesh) o.castShadow = false; });
  g.scale.setScalar(s);
  return g;
}
function globo(R){
  const g = new THREE.Group();
  const c = ['#ff4a6a', '#4a8aff', '#ffd23f', '#4ae08a', '#c06aff'][Math.floor(R()*5)];
  g.add(bola(md('globo' + c, c, {roughness:0.2, metalness:0.1}), 0.5, 0, 0, 0, 1, 1.15, 1));
  const hilo = palo(md('hilo', '#ffffff'), 0.01, 0.01, 1.4); hilo.position.y = -1.2; g.add(hilo);
  return g;
}
function antorcha(){
  const g = new THREE.Group();
  const p = palo(md('hierro', '#3a3a44', {metalness:0.6, roughness:0.4}), 0.08, 0.12, 1.8); p.position.y = 0.9; g.add(p);
  const copa = palo(md('hierro', '#3a3a44'), 0.25, 0.12, 0.3); copa.position.y = 1.9; g.add(copa);
  const fuego = bola(new THREE.MeshBasicMaterial({color:'#ffb030'}), 0.2, 0, 2.15, 0, 1, 1.6, 1); g.add(fuego);
  const h = halo('#ff8a20', 2.4, 0.8); h.position.y = 2.2; g.add(h);
  g.userData.fuego = fuego;
  return g;
}
function columna(){
  const g = new THREE.Group();
  const m = matSuelo('piedraOscura').top;
  const c = palo(m, 0.6, 0.7, 7, 12); c.position.y = 3.5; c.castShadow = true; g.add(c);
  const t = new THREE.Mesh(GEO.cubo, m); t.scale.set(1.6, 0.4, 1.6); t.position.y = 7.1; g.add(t);
  return g;
}
function molinoAspas(){
  const g = new THREE.Group();
  const m = md('aspa', '#fff8ec', {roughness:0.6, side:THREE.DoubleSide}), mm = md('tronco', '#7a4a22');
  for (let i = 0; i < 4; i++){
    const a = new THREE.Group(); a.rotation.z = i*Math.PI/2;
    const brazo = new THREE.Mesh(GEO.cubo, mm); brazo.scale.set(0.12, 3.2, 0.08); brazo.position.y = 1.6; a.add(brazo);
    const vela = new THREE.Mesh(GEO.cubo, m); vela.scale.set(0.7, 2.4, 0.03); vela.position.set(0.42, 1.9, 0); a.add(vela);
    g.add(a);
  }
  g.add(bola(mm, 0.25, 0, 0, 0.1));
  g.traverse(o=>{ if (o.isMesh) o.castShadow = true; });
  return g;
}
/* el castillo de Tío Juan (adornos encima de los bloques que se pisan) */
function castilloDeco(){
  const g = new THREE.Group();
  const piedra = matSuelo('castillo').lado, techo = md('tejas', '#e83a3a', {roughness:0.45}), oro = std('#ffd23f', {metalness:0.85, roughness:0.25});
  /* almenas alrededor de la terraza */
  for (let i = -15; i <= 15; i += 2){ for (const z of [-27.3, -40.7]){ const a = new THREE.Mesh(GEO.cubo, piedra); a.scale.set(1, 0.9, 0.6); a.position.set(i, 9.2, z); a.castShadow = true; g.add(a); } }
  /* techos de las torres con banderas */
  const torres = [[-15, -29, 2.6, 13], [15, -29, 2.6, 13], [-15, -39, 2.6, 13], [15, -39, 2.6, 13], [0, -37, 4, 16]];
  torres.forEach(([x, z, r, h], i)=>{
    const c = new THREE.Mesh(new THREE.ConeGeometry(r*1.25, r*2.2, 24), techo); c.position.set(x, h + r*1.1, z); c.castShadow = true; g.add(c);
    const asta = palo(md('blanco', '#ffffff'), 0.04, 0.04, 1.6); asta.position.set(x, h + r*2.2 + 0.8, z); g.add(asta);
    const band = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.7), md('bandera', i === 4 ? '#ffd23f' : '#3a8aff', {side:THREE.DoubleSide}));
    band.position.set(x + 0.6, h + r*2.2 + 1.3, z); g.add(band);
    for (let k = 0; k < 4; k++){ const a = k/4*TAU + 0.4; const v = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1), new THREE.MeshStandardMaterial({color:'#ffcf6a', emissive:'#ffaa30', emissiveIntensity:0.9}));
      v.position.set(x + Math.sin(a)*(r + 0.02), h - 2.5, z + Math.cos(a)*(r + 0.02)); v.rotation.y = a; g.add(v); }
  });
  /* puerta grande y vitral con TJ */
  const puerta = new THREE.Mesh(new THREE.PlaneGeometry(4, 5.5), md('puerta', '#6b3a18', {roughness:0.6}));
  puerta.position.set(0, 2.75, -26.98); g.add(puerta);
  const arcoP = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.25, 8, 24, Math.PI), oro); arcoP.position.set(0, 5.4, -26.9); g.add(arcoP);
  const vitral = new THREE.Mesh(new THREE.CircleGeometry(1.6, 32), new THREE.MeshStandardMaterial({map: etiqueta('TJ', '#ffd23f', '#d82800', 256, 256, 'bold 120px Fredoka, Arial'), emissive:'#ffffff', emissiveMap: etiqueta('TJ', '#ffd23f', '#d82800', 256, 256, 'bold 120px Fredoka, Arial'), emissiveIntensity:0.6}));
  vitral.position.set(0, 12.5, -32.95); g.add(vitral);
  for (const x of [-9, -5, 5, 9]){ const v = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2), new THREE.MeshStandardMaterial({color:'#ffcf6a', emissive:'#ffaa30', emissiveIntensity:0.9})); v.position.set(x, 5.5, -26.98); g.add(v); }
  return g;
}
function faroDeco(x, z){
  const g = new THREE.Group();
  const baranda = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.08, 8, 32), md('hierro', '#3a3a44')); baranda.rotation.x = Math.PI/2; baranda.position.set(x, 13.7, z); g.add(baranda);
  return g;
}

Object.assign(MOD, {rng, tex, lienzo, std, matSuelo, piezaSuelo, GEO, bola, palo, halo, columnaLuz,
  crearFernando, crearTio, ondearCapa, crearPerro, crearEnemigo, crearMoneda, crearEstrella, crearRegalo, crearPortal,
  crearResorte, crearTubo, crearAbu, crearSanti, COLOR_PODER, EMOJI_PODER, TEX_HALO,
  arbol, pino, palmera, roca, hongo, cerca, sombrilla, concha, estrellaMar, munecoDeco, regaloDeco, nubeDeco, globo, antorcha, columna,
  molinoAspas, castilloDeco, faroDeco, etiqueta});
window.F3D_MOD = MOD;
})();
