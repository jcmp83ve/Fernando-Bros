'use strict';
/* ============================================================
   LUCCA PILOTO — la VISTA
   Dibuja con Three.js (el mismo motor de Pichungito Kart) lo que
   el núcleo (nucleo.js) dice que pasa, y pone encima el marcador,
   los globitos de diálogo y los botones táctiles en 2D.
   ============================================================ */
(function(){
const L = window.LUCA, CFG = L.CFG;
const gl = document.getElementById('gl'), hud = document.getElementById('hud');
const hx = hud.getContext('2d');
let W = 0, H = 0, DPR = 1;

/* ---------------- motor 3D ---------------- */
const renderer = new THREE.WebGLRenderer({canvas: gl, antialias: true});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(66, 1, 0.5, 4000);
scene.add(new THREE.HemisphereLight(0xffffff, 0x4a6a8a, 0.95));
const sol = new THREE.DirectionalLight(0xffffff, 0.75);
sol.position.set(30, 80, 40);
scene.add(sol);

function redimensionar(){
  W = window.innerWidth; H = window.innerHeight;
  DPR = Math.min(2, window.devicePixelRatio || 1);
  renderer.setPixelRatio(DPR);
  renderer.setSize(W, H, false);
  gl.style.width = W+'px'; gl.style.height = H+'px';
  hud.width = W*DPR; hud.height = H*DPR;
  hud.style.width = W+'px'; hud.style.height = H+'px';
  camera.aspect = W/H;
  camera.fov = W < H ? 82 : 66;      // en el celular de pie se ve más ancho
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', redimensionar);
redimensionar();

/* materiales y piezas compartidas */
const MATS = {};
function mat(color, brilla){
  const k = color + (brilla ? '!' : '');
  if (!MATS[k]) MATS[k] = brilla ? new THREE.MeshBasicMaterial({color}) : new THREE.MeshLambertMaterial({color});
  return MATS[k];
}
function malla(geo, color, x, y, z, padre, brilla){
  const m = new THREE.Mesh(geo, typeof color === 'string' ? mat(color, brilla) : color);
  m.position.set(x||0, y||0, z||0);
  if (padre) padre.add(m);
  return m;
}
const caja = (w,h,d,c,x,y,z,p,b)=> malla(new THREE.BoxGeometry(w,h,d), c, x,y,z,p,b);
const bola = (r,c,x,y,z,p,b,seg)=> malla(new THREE.SphereGeometry(r, seg||14, seg ? Math.max(4, seg-4) : 10), c, x,y,z,p,b);
const cil  = (rt,rb,h,c,x,y,z,p,b,seg)=> malla(new THREE.CylinderGeometry(rt,rb,h,seg||14), c, x,y,z,p,b);
const vidrio = new THREE.MeshLambertMaterial({color: 0x9ad8ff, transparent: true, opacity: 0.38});

/* letrero flotante con el nombre (como los carteles de Fernando Bros) */
function letrero(texto, color){
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const x = c.getContext('2d');
  x.fillStyle = 'rgba(0,0,0,0.55)';
  x.beginPath(); if (x.roundRect) x.roundRect(4,6,248,52,18); else x.rect(4,6,248,52); x.fill();
  x.font = 'bold 34px Fredoka, Trebuchet MS, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.lineWidth = 6; x.strokeStyle = '#000'; x.strokeText(texto, 128, 33);
  x.fillStyle = color; x.fillText(texto, 128, 33);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({map: new THREE.CanvasTexture(c), depthTest: false, transparent: true}));
  s.scale.set(5, 1.25, 1);
  s.renderOrder = 10;
  return s;
}

/* ---------------- Lucca ---------------- */
function crearLucaPiloto(padre, y){
  const g = new THREE.Group(); g.position.y = y; padre.add(g);
  caja(0.75, 0.6, 0.5, '#ffe36e', 0, 0, 0, g);                     // franela amarilla
  bola(0.36, '#e8b088', 0, 0.62, 0, g);                             // cara
  const gorra = bola(0.38, '#2a9c3a', 0, 0.74, 0.02, g);            // gorra verde
  gorra.scale.set(1, 0.6, 1);
  caja(0.5, 0.06, 0.32, '#2a9c3a', 0, 0.7, -0.38, g);               // visera
  bola(0.06, '#1a1a1a', -0.13, 0.66, -0.31, g); bola(0.06, '#1a1a1a', 0.13, 0.66, -0.31, g);
  caja(0.16, 0.04, 0.04, '#b0503a', 0, 0.5, -0.34, g);              // sonrisa
  return g;
}

function crearAvion(){
  const g = new THREE.Group();
  const fus = cil(0.75, 0.55, 5.2, '#ffd23f', 0, 0, 0, g); fus.rotation.x = Math.PI/2;
  const cola = cil(0.55, 0.15, 2.2, '#ffd23f', 0, 0.1, 3.7, g); cola.rotation.x = Math.PI/2;
  const nariz = cil(0.3, 0.75, 0.6, '#e63946', 0, 0, -2.9, g); nariz.rotation.x = Math.PI/2;
  bola(0.22, '#e63946', 0, 0, -3.25, g);
  const helice = new THREE.Group(); helice.position.set(0, 0, -3.35); g.add(helice);
  caja(0.22, 2.6, 0.06, '#333', 0, 0, 0, helice); caja(2.6, 0.22, 0.06, '#333', 0, 0, 0, helice);
  caja(8.6, 0.16, 1.5, '#2a9c3a', 0, -0.15, -0.6, g);              // alas verdes de Lucca
  caja(1.4, 0.18, 1.52, '#ffe36e', -3.4, -0.14, -0.6, g); caja(1.4, 0.18, 1.52, '#ffe36e', 3.4, -0.14, -0.6, g);
  caja(3.2, 0.12, 0.9, '#2a9c3a', 0, 0.15, 4.4, g);                // timón de cola
  caja(0.12, 1.2, 1.0, '#2a9c3a', 0, 0.75, 4.4, g);
  caja(0.1, 0.5, 0.5, '#e63946', 0, 0.9, 4.5, g);
  crearLucaPiloto(g, 0.75);
  const parab = caja(0.9, 0.5, 0.08, vidrio, 0, 0.95, -0.55, g); parab.rotation.x = -0.4;
  g.userData.helice = helice;
  return g;
}

function crearNave(){
  /* la nave galáctica de Lucca: blanca, alas en X con rayas verdes y amarillas */
  const g = new THREE.Group();
  const cuerpo = cil(0.45, 0.85, 7, '#eef0f4', 0, 0, 0.3, g, false, 6); cuerpo.rotation.x = Math.PI/2;
  const punta = cil(0.12, 0.45, 2.2, '#eef0f4', 0, 0, -4.1, g, false, 6); punta.rotation.x = Math.PI/2;
  caja(0.3, 0.3, 1.2, '#2a9c3a', 0, 0.35, -3.2, g);
  caja(1.5, 1.0, 2.6, '#d8dce4', 0, 0.05, 2.6, g);
  crearLucaPiloto(g, 0.75);
  const cupula = bola(0.75, vidrio, 0, 0.85, -0.2, g); cupula.scale.set(1, 0.8, 1.6);
  const alas = [];
  for (const [sx, sy] of [[-1,1],[1,1],[-1,-1],[1,-1]]){
    const piv = new THREE.Group(); piv.position.set(0, 0, 2.0); g.add(piv);
    const a = new THREE.Group(); piv.add(a);
    caja(4.6, 0.12, 1.5, '#e4e7ee', sx*2.6, 0, 0, a);
    caja(3.0, 0.14, 0.35, '#2a9c3a', sx*2.4, 0, -0.35, a);
    caja(3.0, 0.14, 0.25, '#ffd23f', sx*2.4, 0, 0.2, a);
    const mot = cil(0.38, 0.38, 2.2, '#c8ccd6', sx*0.95, sy*0.25, 0, a); mot.rotation.x = Math.PI/2;
    const fuego = cil(0.3, 0.3, 0.1, '#ff8a3d', sx*0.95, sy*0.25, 1.15, a, true); fuego.rotation.x = Math.PI/2;
    const can = cil(0.08, 0.08, 3.4, '#9aa0aa', sx*4.95, 0, -1.2, a); can.rotation.x = Math.PI/2;
    bola(0.13, '#e63946', sx*4.95, 0, -2.95, a, true);
    piv.userData = {sx, sy, fuego};
    alas.push(piv);
  }
  g.userData.alas = alas;
  return g;
}

const luca = new THREE.Group(); scene.add(luca);
const avion = crearAvion(); luca.add(avion);
const nave = crearNave(); luca.add(nave); nave.visible = false;
function abrirAlas(t){            // t: 0 = alas planas, 1 = alas en X
  for (const piv of nave.userData.alas) piv.rotation.z = piv.userData.sx * piv.userData.sy * 0.28 * t;
}
abrirAlas(1);

/* ---------------- Tío Juan (superhéroe volando) ---------------- */
function crearTio(){
  const g = new THREE.Group();
  const c = new THREE.Group(); g.add(c); c.rotation.x = -Math.PI/2 + 0.15;   // acostado, volando de frente
  caja(0.9, 1.25, 0.55, '#1560d0', 0, 0, 0, c);                     // traje azul
  caja(0.95, 0.18, 0.6, '#ffe36e', 0, -0.5, 0, c);                  // correa amarilla
  caja(0.3, 0.3, 0.06, '#d82800', 0, 0.2, -0.3, c);                 // escudo
  caja(0.32, 1.1, 0.4, '#1560d0', -0.24, -1.15, 0, c); caja(0.32, 1.1, 0.4, '#1560d0', 0.24, -1.15, 0, c);
  caja(0.34, 0.3, 0.45, '#d82800', -0.24, -1.8, 0, c); caja(0.34, 0.3, 0.45, '#d82800', 0.24, -1.8, 0, c);
  const brazo = caja(0.26, 1.2, 0.3, '#1560d0', 0.55, 1.0, 0, c);   // un puño adelante
  brazo.rotation.z = -0.15;
  bola(0.2, '#e0ac69', 0.62, 1.65, 0, c);
  caja(0.26, 0.9, 0.3, '#1560d0', -0.6, 0.15, 0, c);
  const cabeza = bola(0.42, '#e0ac69', 0, 0.95, 0, c);
  const pelo = bola(0.44, '#222', 0, 1.05, 0.06, c); pelo.scale.set(1, 0.75, 1);
  bola(0.07, '#111', -0.15, 0.95, -0.36, c); bola(0.07, '#111', 0.15, 0.95, -0.36, c);
  caja(0.2, 0.05, 0.05, '#8a3a2a', 0, 0.78, -0.38, c);
  const capa = new THREE.Group(); capa.position.set(0, 0.55, 0.3); c.add(capa);
  caja(1.1, 2.4, 0.06, '#d82800', 0, -1.2, 0, capa);
  const casco = bola(0.75, vidrio, 0, 0.95, 0, c); casco.visible = false;
  g.userData = {capa, casco};
  const l = letrero('TÍO JUAN', '#6ab0ff'); l.position.set(0, 2.2, 0); g.add(l);
  return g;
}
const tio = crearTio(); scene.add(tio); tio.visible = false;

/* ---------------- Tía Gaby y su nave rosada ---------------- */
function crearGaby(){
  const g = new THREE.Group();
  const cuerpo = bola(1.3, '#ff9ed6', 0, 0, 0, g); cuerpo.scale.set(1, 0.7, 2.0);
  const nariz = bola(0.6, '#ffffff', 0, -0.05, -2.3, g); nariz.scale.set(1, 0.7, 1);
  caja(5.2, 0.14, 1.4, '#ffffff', 0, -0.2, 0.6, g);
  caja(1.0, 0.16, 1.45, '#ff6ec0', -2.1, -0.18, 0.6, g); caja(1.0, 0.16, 1.45, '#ff6ec0', 2.1, -0.18, 0.6, g);
  caja(0.12, 1.1, 1.0, '#ff6ec0', 0, 0.7, 2.0, g);
  for (const sx of [-0.6, 0.6]){ const m = cil(0.3, 0.3, 0.12, '#7dffa0', sx, 0, 2.55, g, true); m.rotation.x = Math.PI/2; }
  /* Tía Gaby en la cabina: pelo marrón con dos moños, como una princesa galáctica */
  const p = new THREE.Group(); p.position.set(0, 0.85, -0.4); g.add(p);
  caja(0.7, 0.5, 0.45, '#ffffff', 0, 0, 0, p);
  bola(0.34, '#f1c27d', 0, 0.55, 0, p);
  const pelo = bola(0.37, '#5a3418', 0, 0.62, 0.05, p); pelo.scale.set(1, 0.85, 1);
  bola(0.22, '#5a3418', -0.42, 0.5, 0.05, p); bola(0.22, '#5a3418', 0.42, 0.5, 0.05, p);
  bola(0.055, '#1a1a1a', -0.12, 0.58, -0.29, p); bola(0.055, '#1a1a1a', 0.12, 0.58, -0.29, p);
  caja(0.14, 0.04, 0.04, '#d8406a', 0, 0.44, -0.31, p);
  const cup = bola(0.8, vidrio, 0, 0.95, -0.4, g); cup.scale.set(1, 0.8, 1.3);
  const l = letrero('TÍA GABY', '#ff9ed6'); l.position.set(0, 2.4, 0); g.add(l);
  return g;
}
const gaby = crearGaby(); scene.add(gaby); gaby.visible = false;

/* ---------------- objetos del camino ---------------- */
const GEO = {};
function estrellaGeo(){
  const s = new THREE.Shape();
  for (let i=0;i<10;i++){
    const r = i % 2 ? 0.45 : 1.05, a = -Math.PI/2 + i*Math.PI/5;
    if (i === 0) s.moveTo(Math.cos(a)*r, Math.sin(a)*r); else s.lineTo(Math.cos(a)*r, Math.sin(a)*r);
  }
  const g = new THREE.ExtrudeGeometry(s, {depth: 0.3, bevelEnabled: false});
  g.translate(0, 0, -0.15);
  return g;
}
GEO.estrella = estrellaGeo();
GEO.aro = new THREE.TorusGeometry(4.2, 0.35, 8, 28);
GEO.ast = new THREE.IcosahedronGeometry(1, 0);
GEO.laser = new THREE.BoxGeometry(0.16, 0.16, 3.2);
GEO.bala = new THREE.SphereGeometry(0.55, 10, 8);
GEO.part = new THREE.BoxGeometry(0.5, 0.5, 0.5);

function crearObjeto(o){
  const g = new THREE.Group();
  switch (o.tipo){
    case 'estrella': malla(GEO.estrella, '#ffd23f', 0,0,0, g, true); break;
    case 'aro': malla(GEO.aro, '#ff8a3d', 0,0,0, g, true); break;
    case 'nubarron': {
      for (const [x,y,z,r] of [[0,0,0,2.2],[-1.8,-0.3,0.2,1.6],[1.8,-0.2,0,1.7],[0.6,1.2,0.3,1.5],[-0.9,1,0,1.3]]) bola(r, '#5a5f70', x,y,z, g);
      bola(0.32, '#fff', -0.7, 0.3, -2.1, g, true); bola(0.32, '#fff', 0.7, 0.3, -2.1, g, true);
      bola(0.16, '#111', -0.65, 0.25, -2.4, g); bola(0.16, '#111', 0.65, 0.25, -2.4, g);
      caja(0.7, 0.12, 0.1, '#111', -0.7, 0.75, -2.2, g).rotation.z = -0.4;
      caja(0.7, 0.12, 0.1, '#111', 0.7, 0.75, -2.2, g).rotation.z = 0.4;
      const rayo = new THREE.Group(); g.add(rayo);
      for (const [x,y,rz] of [[0,-2.2,0.4],[0.35,-3.0,-0.4],[0,-3.8,0.4]]) caja(0.25, 1.0, 0.25, '#ffe36e', x,y,0, rayo, true).rotation.z = rz;
      g.userData.rayo = rayo;
      break;
    }
    case 'hamb': {
      cil(1.1, 1.0, 0.4, '#d89a4a', 0, -0.5, 0, g);
      cil(1.15, 1.15, 0.3, '#5a2a10', 0, -0.15, 0, g);
      cil(1.25, 1.25, 0.08, '#ffd23f', 0, 0.04, 0, g);
      cil(1.25, 1.2, 0.1, '#4caf50', 0, 0.13, 0, g);
      const pan = bola(1.12, '#e0a050', 0, 0.2, 0, g); pan.scale.set(1, 0.6, 1);
      g.scale.setScalar(1.1);
      break;
    }
    case 'cristal': {
      const c = malla(new THREE.OctahedronGeometry(1.2, 0), '#7de0ff', 0,0,0, g, true); c.scale.set(0.8, 1.6, 0.8);
      const halo = bola(2, new THREE.MeshBasicMaterial({color: 0x7de0ff, transparent: true, opacity: 0.25}), 0,0,0, g);
      g.userData.halo = halo;
      break;
    }
    case 'asteroide': {
      const a = malla(GEO.ast, ['#7a6a5a','#6a6a72','#8a7058'][o.id % 3], 0,0,0, g);
      a.scale.set(o.r, o.r*0.85, o.r*1.1);
      a.material = new THREE.MeshLambertMaterial({color: a.material.color, flatShading: true});
      break;
    }
    case 'navemala': {
      bola(1.0, '#6a6e78', 0,0,0, g);
      const ojo = cil(0.55, 0.55, 0.2, '#ff3030', 0, 0, -0.95, g, true); ojo.rotation.x = Math.PI/2;
      caja(2.6, 0.25, 0.25, '#3a3d44', 0, 0, 0, g);
      for (const sx of [-1, 1]){
        const panel = cil(2.1, 2.1, 0.14, '#2a2c33', sx*1.4, 0, 0, g, false, 6); panel.rotation.z = Math.PI/2;
        const borde = cil(2.25, 2.25, 0.1, '#8a8e98', sx*1.36, 0, 0, g, false, 6); borde.rotation.z = Math.PI/2;
      }
      break;
    }
  }
  return g;
}

/* ---------------- la Bola Gris del Malvado ---------------- */
function texturaBola(){
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#8a8e98'; x.fillRect(0,0,512,256);
  for (let i=0;i<900;i++){
    const v = 110 + Math.floor(Math.random()*50);
    x.fillStyle = `rgb(${v},${v+2},${v+8})`;
    x.fillRect(Math.random()*512, Math.random()*256, 4 + Math.random()*22, 2 + Math.random()*8);
  }
  x.fillStyle = '#4a4d55'; x.fillRect(0, 124, 512, 8);
  for (let i=0;i<300;i++){ x.fillStyle = Math.random() < 0.3 ? '#ffe9a0' : '#5a5d66'; x.fillRect(Math.random()*512, Math.random()*256, 2, 2); }
  return new THREE.CanvasTexture(c);
}
let bolaGris = null, puntoDebil = null;
function crearBolaGris(){
  const g = new THREE.Group();
  malla(new THREE.SphereGeometry(CFG.JEFE_RADIO, 40, 28), new THREE.MeshLambertMaterial({map: texturaBola()}), 0,0,0, g);
  /* el plato gigante, mirando hacia Lucca (que viene por +z) */
  const dir = new THREE.Vector3(-0.4, 0.45, 0.8).normalize();
  const disco = cil(8, 6, 3, '#5a5d66', 0, 0, 0, g, false, 28);
  disco.position.copy(dir).multiplyScalar(CFG.JEFE_RADIO*0.93);
  disco.lookAt(dir.clone().multiplyScalar(CFG.JEFE_RADIO*3)); disco.rotateX(Math.PI/2);
  const centro = bola(1.5, '#3a3d44', 0, 0, 0, g); centro.position.copy(dir).multiplyScalar(CFG.JEFE_RADIO*0.97);
  const l = letrero('BOLA GRIS', '#ff6060'); l.scale.set(16, 4, 1); l.position.set(0, CFG.JEFE_RADIO + 5, 0); g.add(l);
  scene.add(g);
  puntoDebil = new THREE.Group();
  bola(3.2, '#7dff6a', 0,0,0, puntoDebil, true);
  bola(4.6, new THREE.MeshBasicMaterial({color: 0x7dff6a, transparent: true, opacity: 0.3}), 0,0,0, puntoDebil);
  scene.add(puntoDebil);
  return g;
}

/* ---------------- el mundo: cielo con mar e islas, y el espacio ---------------- */
const cielo = new THREE.Group(); scene.add(cielo);
const mar = malla(new THREE.PlaneGeometry(4000, 4000), '#2a8ad0', 0, -30, 0, cielo);
mar.rotation.x = -Math.PI/2;
const islas = [], nubes = [];
for (let i=0;i<26;i++){
  const g = new THREE.Group();
  const lado = i % 2 ? 1 : -1;
  g.position.set(lado*(35 + Math.random()*160), -30, -i*40);
  const arena = cil(9, 11, 1.2, '#f4dca0', 0, 0.4, 0, g); arena.scale.set(1, 1, 0.8);
  const monte = new THREE.Mesh(new THREE.ConeGeometry(7, 9 + Math.random()*8, 9), mat('#43a047')); monte.position.y = 5; g.add(monte);
  for (let k=0;k<3;k++){
    const tr = cil(0.25, 0.3, 4, '#8a5a2a', -5 + k*4, 2.6, 5, g);
    bola(1.5, '#2e8a3a', -5 + k*4, 4.8, 5, g);
    tr.rotation.z = (k-1)*0.2;
  }
  cielo.add(g); islas.push(g);
}
for (let i=0;i<40;i++){
  const g = new THREE.Group();
  const n = 3 + Math.floor(Math.random()*3);
  for (let k=0;k<n;k++) bola(2 + Math.random()*2.5, '#ffffff', k*2.6 - n, Math.random()*1.2, Math.random()*2, g);
  colocarNube(g, -i*26);
  cielo.add(g); nubes.push(g);
}
function colocarNube(g, z){
  const lado = Math.random() < 0.5 ? -1 : 1;
  const arriba = Math.random() < 0.5;
  g.position.set(lado*(20 + Math.random()*60), arriba ? 30 + Math.random()*25 : -8 - Math.random()*12, z);
}

const espacio = new THREE.Group(); scene.add(espacio); espacio.visible = false;
const fondoEstrellas = (function(){
  const n = 2500, pos = new Float32Array(n*3);
  for (let i=0;i<n;i++){
    const u = Math.random()*2-1, a = Math.random()*Math.PI*2, r = 1500;
    const s = Math.sqrt(1-u*u);
    pos[i*3] = Math.cos(a)*s*r; pos[i*3+1] = u*r; pos[i*3+2] = Math.sin(a)*s*r;
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({color: 0xffffff, size: 2.2, sizeAttenuation: false}));
})();
espacio.add(fondoEstrellas);
const polvo = (function(){
  const n = 400, pos = new Float32Array(n*3);
  for (let i=0;i<n;i++){ pos[i*3] = (Math.random()*2-1)*60; pos[i*3+1] = (Math.random()*2-1)*40 + CFG.YCENTRO; pos[i*3+2] = -Math.random()*300; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({color: 0xbfd8ff, size: 0.35}));
})();
espacio.add(polvo);
const planetas = new THREE.Group(); espacio.add(planetas);
(function(){
  const tierra = bola(260, '#2a6ad0', 0, -420, 200, planetas, false, 40);
  for (let i=0;i<14;i++){
    const a = Math.random()*Math.PI*2, b = Math.random()*0.9 + 0.3;
    const cont = bola(60 + Math.random()*40, '#3aa04a', 0, 0, 0, planetas, false, 10);
    cont.position.set(Math.cos(a)*Math.sin(b)*228, -420 + Math.cos(b)*228, 200 + Math.sin(a)*Math.sin(b)*228);
    cont.scale.set(1, 0.25, 1); cont.lookAt(tierra.position); cont.rotateX(Math.PI/2);
  }
  const saturno = bola(70, '#e8b86a', -420, 120, -900, planetas, false, 32);
  const anillo = new THREE.Mesh(new THREE.RingGeometry(95, 140, 48), new THREE.MeshBasicMaterial({color: 0xd8c08a, side: THREE.DoubleSide, transparent: true, opacity: 0.8}));
  anillo.position.copy(saturno.position); anillo.rotation.x = 1.2; anillo.rotation.y = 0.3; planetas.add(anillo);
  bola(40, '#c84a3a', 380, -60, -1100, planetas, false, 24);
  bola(28, '#9a6ad8', 260, 200, -1300, planetas, false, 20);
  bola(22, '#e0e0e0', -150, 40, -500, planetas, false, 18);
})();

/* ---------------- partículas: explosiones, chispas y fuegos artificiales ---------------- */
const parts = [];
function soltar(tipo, x, y, z, tam){
  const n = tipo === 'granboom' ? 80 : tipo === 'boom' ? 18 : tipo === 'fuego' ? 30 : tipo === 'brillo' ? 24 : 8;
  const colores = tipo === 'fuego' ? [['#ff6ec0','#ffd23f','#7dffa0','#6ab0ff','#ff8a3d'][Math.floor(Math.random()*5)]]
    : tipo === 'estrella' || tipo === 'aro' ? ['#ffd23f','#fff3a0'] : tipo === 'brillo' ? ['#7de0ff','#ffffff','#ffd23f']
    : tipo === 'chispa' ? ['#ffe36e','#ffffff'] : ['#ff8a3d','#ffd23f','#e63946','#555'];
  for (let i=0;i<n;i++){
    const m = malla(GEO.part, colores[i % colores.length], x, y, z, scene, true);
    const u = Math.random()*2-1, a = Math.random()*Math.PI*2, s = Math.sqrt(1-u*u);
    const v = (tipo === 'granboom' ? 40 : tipo === 'fuego' ? 14 : 9) * (0.5 + Math.random()*0.7) * Math.max(0.6, Math.min(tam, 3));
    m.userData = {vx: Math.cos(a)*s*v, vy: u*v, vz: Math.sin(a)*s*v, t: 0, dura: tipo === 'granboom' ? 2.5 : tipo === 'fuego' ? 1.6 : 0.8,
      tam: (tipo === 'granboom' ? 3 : 1) * (0.6 + Math.random()*0.8) * Math.min(tam, 2.5)};
    m.scale.setScalar(m.userData.tam);
    parts.push(m);
  }
}
function moverParts(dt){
  for (let i=parts.length-1;i>=0;i--){
    const m = parts[i], u = m.userData;
    u.t += dt;
    m.position.x += u.vx*dt; m.position.y += u.vy*dt; m.position.z += u.vz*dt;
    u.vy -= 4*dt;
    m.rotation.x += dt*5; m.rotation.y += dt*4;
    const k = 1 - u.t/u.dura;
    if (k <= 0){ scene.remove(m); parts.splice(i, 1); }
    else m.scale.setScalar(u.tam*k);
  }
}

/* ---------------- voces ---------------- */
let voces = [];
function cargarVoces(){ try{ voces = speechSynthesis.getVoices(); }catch(e){ voces = []; } }
if (typeof speechSynthesis !== 'undefined'){ cargarVoces(); speechSynthesis.onvoiceschanged = cargarVoces; }
function vozEspanola(){
  if (!voces.length) cargarVoces();
  const es = voces.filter(v => v.lang && v.lang.toLowerCase().startsWith('es'));
  return es.find(v => /es[-_](419|MX|US|CO|VE|AR|CL)/i.test(v.lang)) || es[0] || null;
}
function hablar(texto, quien){
  if (typeof speechSynthesis === 'undefined') return;
  try{
    const q = L.QUIEN[quien] || {};
    const u = new SpeechSynthesisUtterance(texto.replace(/¡|¿/g, ''));
    u.lang = 'es-ES';
    const v = vozEspanola();
    if (v){ u.voice = v; u.lang = v.lang; }
    u.pitch = q.pitch || 1.5; u.rate = q.rate || 1; u.volume = 1;
    speechSynthesis.cancel();
    setTimeout(()=>{ try{ speechSynthesis.resume(); speechSynthesis.speak(u); }catch(e){} }, 60);
  }catch(e){}
}

/* ---------------- sonidos y música (Web Audio) ---------------- */
let AC = null, master = null;
function audio(){
  if (!AC){
    try{ AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = 0.5; master.connect(AC.destination); }catch(e){}
  }
  if (AC && AC.state === 'suspended') AC.resume();
}
function tono(f, dur, tipo, vol, f2, cuando){
  if (!AC) return;
  const t = AC.currentTime + (cuando || 0);
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = tipo || 'square'; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(vol || 0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
}
function ruido(dur, vol){
  if (!AC) return;
  const n = Math.floor(AC.sampleRate*dur), b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0);
  for (let i=0;i<n;i++) d[i] = (Math.random()*2-1) * (1 - i/n);
  const s = AC.createBufferSource(), g = AC.createGain(), fl = AC.createBiquadFilter();
  fl.type = 'lowpass'; fl.frequency.value = 900;
  s.buffer = b; g.gain.value = vol || 0.4; s.connect(fl); fl.connect(g); g.connect(master); s.start();
}
const SFX = {
  estrella: ()=>{ tono(1320, 0.08, 'square', 0.08); tono(1760, 0.12, 'square', 0.08, 0, 0.06); },
  aro:      ()=>{ [660,880,1100,1320].forEach((f,i)=>tono(f, 0.12, 'triangle', 0.12, 0, i*0.05)); },
  laser:    ()=>tono(1400, 0.12, 'sawtooth', 0.035, 300),
  boom:     ()=>{ ruido(0.45, 0.35); tono(120, 0.3, 'square', 0.12, 40); },
  granboom: ()=>{ ruido(2.0, 0.6); tono(80, 1.5, 'sawtooth', 0.2, 25); },
  golpe:    ()=>{ tono(200, 0.25, 'square', 0.16, 70); ruido(0.2, 0.2); },
  turbo:    ()=>tono(300, 0.6, 'sawtooth', 0.12, 1400),
  trans:    ()=>{ tono(200, 3.0, 'sine', 0.2, 1600); [523,659,784,1047].forEach((f,i)=>tono(f, 0.5, 'triangle', 0.12, 0, 2.6 + i*0.12)); },
  giro:     ()=>tono(500, 0.3, 'triangle', 0.1, 1000),
  lanza:    ()=>tono(700, 0.2, 'triangle', 0.08, 1200),
  balamala: ()=>tono(260, 0.2, 'square', 0.04, 140),
  tocado:   ()=>tono(900, 0.08, 'square', 0.05, 500),
  jefe:     ()=>{ [196,185,175,165].forEach((f,i)=>tono(f, 0.5, 'sawtooth', 0.12, 0, i*0.45)); },
  gana:     ()=>{ [523,659,784,1047,784,1047].forEach((f,i)=>tono(f, 0.3, 'square', 0.1, 0, 1 + i*0.16)); },
};
/* música: una melodía alegre en el cielo y otra de aventura galáctica en el espacio */
const MUSICA = {
  cielo:   [523,0,659,0,784,659,523,0, 587,0,698,0,880,698,587,0, 523,0,659,784,1047,0,784,659, 587,659,698,587,523,0,0,0],
  espacio: [392,0,392,0,392,0,523,0, 784,0,0,0,698,659,587,1047, 0,0,784,0,698,659,587,1047, 0,0,784,0,698,659,698,587],
};
let notaI = 0, notaT = 0;
function musica(dt, fase){
  if (!AC || fase === 'titulo') return;
  notaT -= dt;
  if (notaT > 0) return;
  const espa = fase !== 'cielo';
  notaT = espa ? 0.17 : 0.16;
  const m = espa ? MUSICA.espacio : MUSICA.cielo;
  const f = m[notaI % m.length];
  if (f) tono(f, 0.14, espa ? 'sawtooth' : 'triangle', espa ? 0.025 : 0.05);
  if (notaI % 4 === 0) tono(espa ? 98 : 131, 0.25, 'triangle', 0.06);
  notaI++;
}

/* ---------------- controles ---------------- */
const teclas = {};
let toque = null, botonGiro = false, pedirGiro = false;
window.addEventListener('keydown', e => {
  teclas[e.key] = true; audio();
  if (e.key === ' ' || e.key === 'x' || e.key === 'X' || e.key === 'Shift') pedirGiro = true;
  if (e.key === 'Enter' || e.key === ' ') accionPrincipal();
  if (e.key === 'Escape') salir();
  if (e.key.startsWith('Arrow') || e.key === ' ') e.preventDefault();
});
window.addEventListener('keyup', e => { teclas[e.key] = false; });

function zonaGiro(x, y){ return J.fase !== 'titulo' && J.fase !== 'fin' && Math.hypot(x - (W - 80), y - (H - 90)) < 75; }
function zonaSalir(x, y){ return x < 64 && y < 64; }
function botonesFin(){
  const bw = Math.min(220, W*0.4), bh = 60, y = H*0.56;
  return {otra: {x: W/2 - bw - 10, y, w: bw, h: bh}, salir: {x: W/2 + 10, y, w: bw, h: bh}};
}
const dentro = (b, x, y)=> x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;

hud.addEventListener('pointerdown', e => {
  audio();
  const x = e.clientX, y = e.clientY;
  if (zonaSalir(x, y)){ salir(); return; }
  if (J.fase === 'titulo'){ accionPrincipal(); return; }
  if (J.fase === 'fin' && J.fin > 3){
    const b = botonesFin();
    if (dentro(b.otra, x, y)) reiniciar();
    else if (dentro(b.salir, x, y)) salir();
    return;
  }
  if (zonaGiro(x, y)){ pedirGiro = true; botonGiro = true; return; }
  toque = {id: e.pointerId, ox: x, oy: y, x, y};
  try{ hud.setPointerCapture(e.pointerId); }catch(er){}
});
hud.addEventListener('pointermove', e => { if (toque && e.pointerId === toque.id){ toque.x = e.clientX; toque.y = e.clientY; } });
const soltarToque = e => { if (toque && e.pointerId === toque.id) toque = null; botonGiro = false; };
hud.addEventListener('pointerup', soltarToque);
hud.addEventListener('pointercancel', soltarToque);

let mandoAntes = {};
function leerEntrada(){
  let dx = 0, dy = 0;
  if (teclas.ArrowLeft || teclas.a || teclas.A) dx -= 1;
  if (teclas.ArrowRight || teclas.d || teclas.D) dx += 1;
  if (teclas.ArrowUp || teclas.w || teclas.W) dy += 1;
  if (teclas.ArrowDown || teclas.s || teclas.S) dy -= 1;
  if (toque){
    dx += Math.max(-1, Math.min(1, (toque.x - toque.ox)/55));
    dy -= Math.max(-1, Math.min(1, (toque.y - toque.oy)/55));
  }
  try{
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const g of pads){
      if (!g) continue;
      const ax = g.axes[0] || 0, ay = g.axes[1] || 0;
      if (Math.abs(ax) > 0.2) dx += ax;
      if (Math.abs(ay) > 0.2) dy -= ay;
      const b = i => g.buttons[i] && g.buttons[i].pressed;
      if (b(14)) dx -= 1; if (b(15)) dx += 1; if (b(12)) dy += 1; if (b(13)) dy -= 1;
      const algun = b(0) || b(1) || b(2) || b(3) || b(5) || b(7);
      if (algun && !mandoAntes[g.index]){ audio(); pedirGiro = true; if (J.fase === 'titulo' || (J.fase === 'fin' && J.fin > 3)) accionPrincipal(); }
      if (b(9) && !mandoAntes['s'+g.index]) accionPrincipal();
      mandoAntes[g.index] = algun; mandoAntes['s'+g.index] = b(9);
    }
  }catch(e){}
  return {dx: Math.max(-1, Math.min(1, dx)), dy: Math.max(-1, Math.min(1, dy)), giro: pedirGiro};
}

function accionPrincipal(){
  audio();
  if (J.fase === 'titulo'){ L.empezar(J); return; }
  if (J.fase === 'fin' && J.fin > 3) reiniciar();
}
function salir(){ try{ speechSynthesis.cancel(); }catch(e){} location.href = window.URL_MENU || '../'; }

/* ---------------- la partida ---------------- */
let J = L.crearJuego({semilla: Math.floor(Math.random()*1e6)});
const mallas = new Map();
function reiniciar(){
  for (const m of mallas.values()) scene.remove(m);
  mallas.clear();
  if (bolaGris){ scene.remove(bolaGris); scene.remove(puntoDebil); bolaGris = null; puntoDebil = null; }
  J = L.crearJuego({semilla: Math.floor(Math.random()*1e6)});
  L.empezar(J);
  notaI = 0;
}

function sincronizar(){
  const vistos = new Set();
  const poner = (o, crear)=>{
    vistos.add(o.id);
    let m = mallas.get(o.id);
    if (!m){ m = crear(o); scene.add(m); mallas.set(o.id, m); }
    m.position.set(o.x, o.y, o.z);
    return m;
  };
  for (const o of J.objs){
    if (!o.vivo) continue;
    const m = poner(o, crearObjeto);
    if (o.tipo === 'estrella') m.rotation.y = J.t*3 + o.id;
    else if (o.tipo === 'hamb'){ m.rotation.y = J.t*2; m.rotation.z = Math.sin(J.t*3)*0.3; }
    else if (o.tipo === 'cristal'){ m.rotation.y = J.t*2; m.userData.halo.scale.setScalar(1 + Math.sin(J.t*6)*0.2); }
    else if (o.tipo === 'asteroide'){ m.rotation.x = o.rx + J.t*o.gx; m.rotation.y = o.ry + J.t*o.gy; }
    else if (o.tipo === 'nubarron'){ m.userData.rayo.visible = Math.sin(J.t*7 + o.fase) > 0.3; }
    else if (o.tipo === 'aro'){ m.children[0].material = mat(o.bien ? '#7dff6a' : '#ff8a3d', true); }
    else if (o.tipo === 'navemala'){ m.rotation.z = Math.sin(o.t*2 + o.ph)*0.3; }
  }
  for (const l of J.laseres){
    const m = poner(l, ()=>{
      const g = new THREE.Group();
      malla(GEO.laser, l.de === 'luca' ? '#7dff6a' : l.de === 'gaby' ? '#ff6ec0' : '#6ab0ff', 0,0,0, g, true);
      return g;
    });
    m.lookAt(l.x + l.vx, l.y + l.vy, l.z + l.vz);
  }
  for (const b of J.balas) poner(b, ()=>{ const g = new THREE.Group(); malla(GEO.bala, '#ff3030', 0,0,0, g, true); return g; });
  for (const [id, m] of mallas) if (!vistos.has(id)){ scene.remove(m); mallas.delete(id); }
}

const camPos = new THREE.Vector3(0, CFG.YCENTRO + 4, 14), camMira = new THREE.Vector3();
const COLOR_CIELO = new THREE.Color(0x7cc8ff), COLOR_ESPACIO = new THREE.Color(0x05030f);
scene.background = COLOR_CIELO.clone();
scene.fog = new THREE.Fog(0x9fd6ff, 80, 520);

function actualizarVista(dt){
  const p = J.p;
  J.angosto = W < H;
  const enEspacio = J.fase === 'espacio' || J.fase === 'jefe' || J.fase === 'fin' || (J.fase === 'transformacion' && J.trans > CFG.DURA_TRANS*0.5);

  /* --- el avión / la nave --- */
  luca.position.set(p.x, p.y, p.z);
  let rz = p.ladeo;
  if (p.giro > 0) rz += (1 - p.giro/0.7) * Math.PI*2;
  luca.rotation.set(p.cabeceo, 0, rz);
  luca.visible = !(p.inv > 0 && Math.floor(J.t*12) % 2 === 0 && J.fase !== 'transformacion');
  avion.userData.helice.rotation.z += dt*40;
  if (J.fase === 'transformacion'){
    const k = J.trans / CFG.DURA_TRANS;
    luca.rotation.z = k*Math.PI*4;
    if (k < 0.5){ avion.visible = true; nave.visible = false; avion.scale.setScalar(1 - k*1.6); }
    else { avion.visible = false; nave.visible = true; nave.scale.setScalar(Math.min(1, (k - 0.5)*2.4)); abrirAlas(Math.max(0, (k - 0.75)*4)); }
  } else {
    avion.visible = !enEspacio; nave.visible = enEspacio;
    avion.scale.setScalar(1); nave.scale.setScalar(1);
    if (enEspacio) abrirAlas(1);
  }
  for (const piv of nave.userData.alas){
    const f = piv.userData.fuego;
    f.scale.set(1, 1, 1);
    f.material = mat(p.turbo > 0 ? '#7de0ff' : '#ff8a3d', true);
  }

  /* --- Tío Juan --- */
  tio.visible = J.tio.activo;
  if (tio.visible){
    tio.position.set(J.tio.x, J.tio.y, J.tio.z);
    tio.rotation.z = Math.sin(J.t*1.3)*0.15;
    tio.userData.capa.rotation.x = 0.5 + Math.sin(J.t*14)*0.18;
    tio.userData.casco.visible = enEspacio;
  }
  /* --- Tía Gaby --- */
  gaby.visible = J.gaby.activo;
  if (gaby.visible){ gaby.position.set(J.gaby.x, J.gaby.y, J.gaby.z); gaby.rotation.z = Math.sin(J.t*1.1)*0.12; }

  /* --- la Bola Gris --- */
  if (J.jefe && J.fase !== 'fin'){
    if (!bolaGris) bolaGris = crearBolaGris();
    bolaGris.position.set(J.jefe.x, J.jefe.y, J.jefe.z);
    bolaGris.rotation.y = Math.sin(J.t*0.3)*0.2;
    puntoDebil.position.set(J.jefe.wx, J.jefe.wy, J.jefe.wz);
    puntoDebil.scale.setScalar((J.jefe.tocado > 0 ? 1.3 : 1) * (1 + Math.sin(J.t*8)*0.12));
  } else if (bolaGris && J.fase === 'fin'){
    bolaGris.scale.multiplyScalar(Math.max(0, 1 - dt*1.5));
    puntoDebil.visible = false;
    if (bolaGris.scale.x < 0.02){ scene.remove(bolaGris); scene.remove(puntoDebil); bolaGris = null; }
  }

  sincronizar();

  /* --- efectos que pidió el núcleo --- */
  while (J.fx.length){ const f = J.fx.shift(); soltar(f.tipo, f.x, f.y, f.z, f.tam); }
  while (J.sonidos.length){ const s = J.sonidos.shift(); if (SFX[s]) SFX[s](); }
  if (J.dialogo && J.dialogo.nuevo){ J.dialogo.nuevo = false; hablar(J.dialogo.texto, J.dialogo.quien); }
  moverParts(dt);
  musica(dt, J.fase);

  /* --- el cielo o el espacio --- */
  cielo.visible = !enEspacio; espacio.visible = enEspacio;
  if (J.fase === 'transformacion'){
    const k = Math.min(1, J.trans / (CFG.DURA_TRANS*0.5));
    scene.background.copy(COLOR_CIELO).lerp(COLOR_ESPACIO, enEspacio ? 1 : k);
    scene.fog.color.copy(scene.background); scene.fog.far = enEspacio ? 3000 : 520;
  } else {
    scene.background.copy(enEspacio ? COLOR_ESPACIO : COLOR_CIELO);
    scene.fog.color.set(enEspacio ? 0x05030f : 0x9fd6ff);
    scene.fog.near = enEspacio ? 300 : 80; scene.fog.far = enEspacio ? 3000 : 520;
  }
  if (!enEspacio){
    mar.position.z = p.z;
    for (const g of islas){
      if (g.position.z > p.z + 60) g.position.z -= islas.length*40;
      else if (g.position.z < p.z - islas.length*40 - 100) g.position.z = p.z - Math.random()*islas.length*40;   // al volver a empezar
    }
    for (const g of nubes){
      if (g.position.z > p.z + 30) colocarNube(g, g.position.z - nubes.length*26);
      else if (g.position.z < p.z - nubes.length*26 - 100) colocarNube(g, p.z - Math.random()*nubes.length*26);
    }
  } else {
    fondoEstrellas.position.set(camera.position.x, camera.position.y, camera.position.z);
    planetas.position.set(0, 0, p.z * 0.97);
    const pos = polvo.geometry.attributes.position;
    for (let i=0;i<pos.count;i++){
      if (pos.getZ(i) > p.z + 20){ pos.setZ(i, p.z - 280 - Math.random()*40); pos.setX(i, p.x + (Math.random()*2-1)*60); }
    }
    pos.needsUpdate = true;
  }

  /* --- cámara --- */
  let cx, cy, cz, mx, my, mz;
  if (J.fase === 'transformacion'){
    const a = J.trans*1.4;
    cx = p.x + Math.sin(a)*16; cy = p.y + 4; cz = p.z + Math.cos(a)*16;
    mx = p.x; my = p.y; mz = p.z;
  } else if (J.fase === 'fin'){
    const a = J.fin*0.3 + 0.4;
    cx = p.x + Math.sin(a)*24; cy = p.y + 7; cz = p.z + Math.cos(a)*24;
    mx = p.x; my = p.y + 1.5; mz = p.z;
  } else if (J.fase === 'titulo'){
    const a = J.t*0.25;
    cx = p.x + Math.sin(a)*13; cy = p.y + 3; cz = p.z + Math.cos(a)*13;
    mx = p.x; my = p.y + 0.5; mz = p.z;
  } else {
    const atras = W < H ? 15 : 12;
    cx = p.x*0.75; cy = p.y + 3.4; cz = p.z + atras;
    mx = p.x*0.85; my = p.y + 0.6; mz = p.z - 22;
  }
  const k = J.fase === 'cielo' || J.fase === 'espacio' || J.fase === 'jefe' ? Math.min(1, dt*6) : Math.min(1, dt*3);
  camPos.x += (cx - camPos.x)*k; camPos.y += (cy - camPos.y)*k;
  camPos.z = J.fase === 'cielo' || J.fase === 'espacio' || J.fase === 'jefe' ? cz : camPos.z + (cz - camPos.z)*k;
  camera.position.copy(camPos);
  if (p.sacudida > 0){ camera.position.x += (Math.random()-0.5)*p.sacudida*2; camera.position.y += (Math.random()-0.5)*p.sacudida*2; }
  camMira.set(mx, my, mz);
  camera.lookAt(camMira);
  if (J.fase !== 'transformacion' && J.fase !== 'fin' && J.fase !== 'titulo') camera.rotation.z += p.ladeo*0.25;
  const fovBase = W < H ? 82 : 66;
  camera.fov += ((p.turbo > 0 ? fovBase + 12 : fovBase) - camera.fov)*Math.min(1, dt*4);
  camera.updateProjectionMatrix();
}

/* ---------------- marcador en 2D ---------------- */
function rr(x, y, w, h, r){ hx.beginPath(); if (hx.roundRect) hx.roundRect(x, y, w, h, r); else hx.rect(x, y, w, h); }
function texto(t, x, y, tam, color, alin, borde){
  hx.font = `bold ${tam}px Fredoka, 'Trebuchet MS', sans-serif`;
  hx.textAlign = alin || 'center'; hx.textBaseline = 'middle';
  if (borde !== false){ hx.lineWidth = Math.max(3, tam/6); hx.strokeStyle = 'rgba(0,0,0,0.75)'; hx.strokeText(t, x, y); }
  hx.fillStyle = color; hx.fillText(t, x, y);
}
function lineas(t, maxW, tam){
  hx.font = `bold ${tam}px Fredoka, 'Trebuchet MS', sans-serif`;
  const pal = t.split(' '), out = [];
  let l = '';
  for (const w of pal){ const p = l ? l + ' ' + w : w; if (hx.measureText(p).width > maxW && l){ out.push(l); l = w; } else l = p; }
  if (l) out.push(l);
  return out;
}
function dibujarHud(){
  hx.setTransform(DPR, 0, 0, DPR, 0, 0);
  hx.clearRect(0, 0, W, H);
  const p = J.p, chico = W < 600;

  /* botón de salir */
  rr(10, 10, 46, 46, 12); hx.fillStyle = 'rgba(0,0,0,0.45)'; hx.fill();
  texto('✕', 33, 34, 26, '#fff', 'center', false);

  if (J.fase === 'titulo'){
    const t = J.t;
    texto('LUCCA PILOTO', W/2, H*0.2, Math.min(72, W*0.12), '#ffd23f');
    texto('✈️  ¡De avión a nave galáctica!  🚀', W/2, H*0.2 + Math.min(60, W*0.1), Math.min(30, W*0.055), '#ffffff');
    texto('con 🦸 Tío Juan y 👩‍🚀 Tía Gaby', W/2, H*0.2 + Math.min(100, W*0.17), Math.min(24, W*0.045), '#bfe4ff');
    hx.globalAlpha = 0.6 + Math.sin(t*4)*0.4;
    texto(matchMedia('(pointer: coarse)').matches ? '👆 Toca para despegar' : '▶ ENTER o toca para despegar', W/2, H*0.8, Math.min(32, W*0.06), '#7dff6a');
    hx.globalAlpha = 1;
    texto(chico ? 'Desliza el dedo para volar · 🌀 para dar vueltas' : 'Flechas o el dedo para volar · ESPACIO para dar una vuelta', W/2, H*0.9, Math.min(17, W*0.035), '#ffffff');
    return;
  }

  /* estrellas */
  rr(W - 150, 10, 140, 46, 14); hx.fillStyle = 'rgba(0,0,0,0.45)'; hx.fill();
  texto('⭐ ' + J.estrellas, W - 80, 34, 28, '#ffd23f');

  /* barra del viaje: avión → nave → Bola Gris */
  if (J.fase !== 'fin'){
    const bw = chico ? W - 90 : Math.min(360, W - 240), bx = W/2 - bw/2, by = chico ? 72 : 22;
    let k;
    if (J.fase === 'cielo') k = Math.min(1, J.d/CFG.LARGO_CIELO)*0.45;
    else if (J.fase === 'transformacion') k = 0.45 + 0.05*(J.trans/CFG.DURA_TRANS);
    else if (J.fase === 'espacio') k = 0.5 + Math.min(1, J.d/CFG.LARGO_ESPACIO)*0.45;
    else k = 0.95 + 0.05*(1 - J.jefe.vida/CFG.JEFE_VIDA);
    rr(bx, by, bw, 14, 7); hx.fillStyle = 'rgba(0,0,0,0.45)'; hx.fill();
    rr(bx, by, bw*k, 14, 7); hx.fillStyle = J.fase === 'cielo' ? '#7de0ff' : '#c07dff'; hx.fill();
    texto('✈️', bx - 2, by + 7, 20, '#fff', 'right', false);
    texto('🚀', bx + bw*0.5, by + 7, 18, '#fff', 'center', false);
    texto('🌑', bx + bw + 4, by + 7, 20, '#fff', 'left', false);
  }

  /* turbo de hamburguesa */
  if (p.turbo > 0){
    hx.globalAlpha = 0.65 + Math.sin(J.t*12)*0.35;
    texto('🍔 ¡TURBO!', W/2, chico ? 108 : 64, 28, '#ff8a3d');
    hx.globalAlpha = 1;
  }

  /* vida de la Bola Gris */
  if (J.fase === 'jefe'){
    const bw = Math.min(420, W*0.7), bx = W/2 - bw/2, by = chico ? 150 : 92;
    texto('BOLA GRIS DEL MALVADO', W/2, by - 12, 18, '#ff8080');
    rr(bx, by, bw, 18, 9); hx.fillStyle = 'rgba(0,0,0,0.55)'; hx.fill();
    rr(bx, by, bw*Math.max(0, J.jefe.vida/CFG.JEFE_VIDA), 18, 9); hx.fillStyle = '#ff4a4a'; hx.fill();
  }

  /* destello blanco de la transformación */
  if (J.fase === 'transformacion'){
    const k = J.trans/CFG.DURA_TRANS;
    const a = Math.max(0, 1 - Math.abs(k - 0.5)*6);
    if (a > 0){ hx.fillStyle = `rgba(255,255,255,${a})`; hx.fillRect(0, 0, W, H); }
    texto('✨ ¡TRANSFORMACIÓN! ✨', W/2, H*0.28, Math.min(46, W*0.08), '#7de0ff');
  }

  /* controles táctiles */
  if (J.fase !== 'fin' && J.fase !== 'transformacion' && matchMedia('(pointer: coarse)').matches){
    hx.beginPath(); hx.arc(W - 80, H - 90, 46, 0, Math.PI*2);
    hx.fillStyle = botonGiro ? 'rgba(125,224,255,0.6)' : 'rgba(0,0,0,0.35)'; hx.fill();
    hx.lineWidth = 3; hx.strokeStyle = 'rgba(255,255,255,0.7)'; hx.stroke();
    texto('🌀', W - 80, H - 92, 38, '#fff', 'center', false);
    if (toque){
      hx.beginPath(); hx.arc(toque.ox, toque.oy, 55, 0, Math.PI*2); hx.strokeStyle = 'rgba(255,255,255,0.5)'; hx.lineWidth = 3; hx.stroke();
      const ddx = Math.max(-55, Math.min(55, toque.x - toque.ox)), ddy = Math.max(-55, Math.min(55, toque.y - toque.oy));
      hx.beginPath(); hx.arc(toque.ox + ddx, toque.oy + ddy, 24, 0, Math.PI*2); hx.fillStyle = 'rgba(255,255,255,0.55)'; hx.fill();
    } else if (J.t < 40 || J.faseT < 6){
      hx.globalAlpha = 0.5 + Math.sin(J.t*3)*0.3;
      texto('👆 desliza el dedo para volar', W*0.35, H - 60, 18, '#fff');
      hx.globalAlpha = 1;
    }
  }

  /* final */
  if (J.fase === 'fin' && J.fin > 3){
    hx.fillStyle = 'rgba(5,3,20,0.55)'; hx.fillRect(0, 0, W, H);
    texto('¡GANASTE, LUCCA!', W/2, H*0.2, Math.min(64, W*0.1), '#ffd23f');
    texto('Salvaste la galaxia con Tío Juan y Tía Gaby', W/2, H*0.2 + Math.min(56, W*0.09), Math.min(24, W*0.045), '#ffffff');
    texto('⭐ ' + J.estrellas + ' estrellas   💥 ' + J.derribadas + ' naves malas', W/2, H*0.44, Math.min(30, W*0.055), '#ffe36e');
    const b = botonesFin();
    rr(b.otra.x, b.otra.y, b.otra.w, b.otra.h, 18); hx.fillStyle = '#2a9c3a'; hx.fill();
    texto('▶ OTRA VEZ', b.otra.x + b.otra.w/2, b.otra.y + b.otra.h/2, 24, '#fff');
    rr(b.salir.x, b.salir.y, b.salir.w, b.salir.h, 18); hx.fillStyle = '#5a5f70'; hx.fill();
    texto('✕ SALIR', b.salir.x + b.salir.w/2, b.salir.y + b.salir.h/2, 24, '#fff');
  }
  /* globito de diálogo */
  if (J.dialogo){
    const q = L.QUIEN[J.dialogo.quien];
    const bw = Math.min(640, W - 30), tam = chico ? 17 : 21;
    const ls = lineas(J.dialogo.texto, bw - 100, tam);
    const bh = 40 + ls.length*(tam + 6);
    const bx = W/2 - bw/2, by = H - bh - (chico && J.fase !== 'fin' ? 150 : 16);
    rr(bx, by, bw, bh, 18); hx.fillStyle = 'rgba(10,14,40,0.82)'; hx.fill();
    hx.lineWidth = 3; hx.strokeStyle = q.color; hx.stroke();
    texto(q.emoji, bx + 42, by + bh/2, 40, '#fff', 'center', false);
    texto(q.nombre, bx + 84, by + 20, tam - 2, q.color, 'left');
    ls.forEach((l, i)=> texto(l, bx + 84, by + 22 + (i + 1)*(tam + 6), tam, '#ffffff', 'left', false));
  }

}

/* ---------------- bucle ---------------- */
let antes = performance.now(), acum = 0;
const PASO = 1/60;
function bucle(ahora){
  requestAnimationFrame(bucle);
  let dt = Math.min(0.1, (ahora - antes)/1000);
  antes = ahora;
  acum += dt;
  const e = leerEntrada();
  let n = 0;
  while (acum >= PASO && n < 6){ L.paso(J, PASO, n === 0 ? e : {dx: e.dx, dy: e.dy}); acum -= PASO; n++; }
  if (n === 6) acum = 0;
  if (n > 0) pedirGiro = false;
  actualizarVista(dt);
  renderer.render(scene, camera);
  dibujarHud();
}
const cargando = document.getElementById('cargando');
if (cargando) cargando.remove();
requestAnimationFrame(bucle);
window.__luca = ()=> J;   // para mirar la partida desde la consola
})();
