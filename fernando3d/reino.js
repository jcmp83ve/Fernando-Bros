'use strict';
/* ============================================================
   FERNANDO 3D — EL REINO PICHUNITE (lo que se ve)
   Una isla grande de aventuras al estilo de los juegos de batalla:
   casas de colores, las Torres Torcidas, cofres con armas de
   juguete, pociones de escudo, el autobús volador, la tormenta
   morada del borde, la Fortaleza del Rey Tortugón y los letreros
   de cada zona. Se engancha a modelos.js y paises.js (MOD).
   ============================================================ */
(function(){
const MOD = window.F3D_MOD;
if (!MOD || !MOD.matPais) return;
const {std, lienzo, bola, palo, GEO, halo, etiqueta, md, PINTAR, manchas, rng} = MOD;
const TAU = Math.PI*2;
const caja = (m, sx, sy, sz, x, y, z)=>{ const c = new THREE.Mesh(GEO.cubo, m); c.scale.set(sx, sy, sz); c.position.set(x || 0, y || 0, z || 0); c.castShadow = true; return c; };

/* ---------------- texturas ---------------- */
function fachada(x, w, h, pared, ventana, techo){
  x.fillStyle = pared; x.fillRect(0, 0, w, h);
  x.fillStyle = 'rgba(255,255,255,0.15)'; for (let j = 0; j < h; j += 16) x.fillRect(0, j, w, 2);
  for (const cx of [w*0.28, w*0.72]){ x.fillStyle = '#ffffff'; x.fillRect(cx - 26, h*0.28 - 4, 52, 52); x.fillStyle = ventana; x.fillRect(cx - 22, h*0.28, 44, 44); x.fillStyle = '#ffffff'; x.fillRect(cx - 2, h*0.28, 4, 44); x.fillRect(cx - 22, h*0.28 + 20, 44, 4); }
  x.fillStyle = techo; x.fillRect(0, 0, w, 14);
}
Object.assign(PINTAR, {
  casaF1(x, w, h){ fachada(x, w, h, '#ff9a3a', '#5ab8ff', '#c8401a'); },
  casaF2(x, w, h){ fachada(x, w, h, '#5ad8a0', '#ffe36e', '#2a7a5a'); },
  casaF3(x, w, h){ fachada(x, w, h, '#b07aff', '#9af0ff', '#5a2aa0'); },
  torreT(x, w, h){
    x.fillStyle = '#7a8aa8'; x.fillRect(0, 0, w, h);
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++){ x.fillStyle = (i + j) % 3 ? '#9ae0ff' : '#ffe8a0'; x.fillRect(i*64 + 8, j*64 + 10, 48, 44); x.fillStyle = 'rgba(255,255,255,0.4)'; x.fillRect(i*64 + 12, j*64 + 14, 10, 36); }
  },
  cajaMadera(x, w, h){
    x.fillStyle = '#c8883a'; x.fillRect(0, 0, w, h);
    x.strokeStyle = '#8a5a1a'; x.lineWidth = 14; x.strokeRect(7, 7, w - 14, h - 14);
    x.beginPath(); x.moveTo(10, 10); x.lineTo(w - 10, h - 10); x.moveTo(w - 10, 10); x.lineTo(10, h - 10); x.stroke();
    x.fillStyle = 'rgba(0,0,0,0.12)'; for (let j = 0; j < h; j += 32) x.fillRect(0, j, w, 3);
  },
  tronco(x, w, h){ x.fillStyle = '#7a4a22'; x.fillRect(0, 0, w, h); x.strokeStyle = '#5a3416'; x.lineWidth = 4; for (let i = 0; i < w; i += 18){ x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 6, h); x.stroke(); } },
  hojas(x, w, h){ x.fillStyle = '#3aa83a'; x.fillRect(0, 0, w, h); manchas(x, w, h, rng(61), 60, ['#4ac84a', '#2a8a2a', '#5ad85a'], 8, 24, 0.6); },
  reloj(x, w, h){ x.fillStyle = '#d8c8a8'; x.fillRect(0, 0, w, h); x.fillStyle = '#b8a888'; for (let j = 0; j < h; j += 32) for (let i = (j/32) % 2 ? 16 : 0; i < w; i += 32) x.fillRect(i + 1, j + 1, 30, 30); },
  bus(x, w, h){
    x.fillStyle = '#3a8aff'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#ffffff'; x.fillRect(0, h*0.7, w, h*0.08);
    for (let i = 0; i < 4; i++){ x.fillStyle = '#bfe8ff'; x.fillRect(i*64 + 8, 18, 48, 70); }
  },
  barco(x, w, h){ x.fillStyle = '#8a4a1a'; x.fillRect(0, 0, w, h); x.fillStyle = '#6a3410'; for (let j = 0; j < h; j += 24) x.fillRect(0, j, w, 4); x.fillStyle = '#ffd23f'; x.fillRect(0, 6, w, 6); },
  piedraF(x, w, h){ x.fillStyle = '#8a8478'; x.fillRect(0, 0, w, h); const R = rng(62); for (let j = 0; j < 8; j++) for (let i = 0; i < 4; i++){ x.fillStyle = ['#9a9488', '#7a746a', '#a8a294'][Math.floor(R()*3)]; x.fillRect(i*64 + (j % 2 ? 32 : 0) + 2, j*32 + 2, 60, 28); } },
  pantano(x, w, h){ x.fillStyle = '#4a7a3a'; x.fillRect(0, 0, w, h); manchas(x, w, h, rng(63), 50, ['#3a6a4a', '#6a9a3a', '#2a5a3a'], 10, 30, 0.6); },
  tiro(x, w, h){ x.fillStyle = '#d8c090'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(255,255,255,0.6)'; for (let i = 0; i < w; i += 64) x.fillRect(i, 0, 4, h); },
  plaza(x, w, h){ x.fillStyle = '#e8d8b8'; x.fillRect(0, 0, w, h); const R = rng(64); for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++){ x.fillStyle = ['#f0e0c0', '#d8c8a8', '#ffb0d0', '#c0e8ff'][Math.floor(R()*4)]; x.fillRect(i*32 + 2, j*32 + 2, 28, 28); } },
});
const tm = (t, o)=>std('#ffffff', Object.assign({map: MOD.tex(t), roughness:0.75}, o || {}));
Object.assign(MOD.matPais, {
  casaF1: ()=>({top: tm('casaF1'), lado: tm('casaF1')}),
  casaF2: ()=>({top: tm('casaF2'), lado: tm('casaF2')}),
  casaF3: ()=>({top: tm('casaF3'), lado: tm('casaF3')}),
  torreT: ()=>({top: tm('piedraF'), lado: tm('torreT', {roughness:0.35})}),
  cajaMadera: ()=>({top: tm('cajaMadera'), lado: tm('cajaMadera')}),
  tronco: ()=>({top: tm('tronco'), lado: tm('tronco')}),
  hojas: ()=>({top: tm('hojas'), lado: tm('hojas')}),
  reloj: ()=>({top: tm('reloj'), lado: tm('reloj')}),
  bus: ()=>({top: tm('bus', {color:'#5aa0ff'}), lado: tm('bus', {roughness:0.4})}),
  barco: ()=>({top: tm('barco'), lado: tm('barco')}),
  piedraF: ()=>({top: tm('piedraF'), lado: tm('piedraF')}),
  pantano: ()=>({top: tm('pantano')}),
  tiro: ()=>({top: tm('tiro')}),
  plaza: ()=>({top: tm('plaza')}),
});
MOD.sinCono.hojas = true;

/* ---------------- los cofres de las armas ---------------- */
const ARMAS_V = {agua:1, burbujas:1, dardos:1, confeti:1, globos:1};
MOD.esArma = p=>!!ARMAS_V[p];
MOD.crearCofre = function(poder){
  const g = new THREE.Group();
  const madera = md('cofreMadera', '#a8642a', {roughness:0.6}), oro = md('cofreOro', '#ffd23f', {metalness:0.85, roughness:0.25, emissive:'#6a4a00', emissiveIntensity:0.3});
  g.add(caja(madera, 1.1, 0.6, 0.75, 0, -0.1, 0));
  for (const x of [-0.5, 0.5]) g.add(caja(oro, 0.08, 0.64, 0.8, x, -0.1, 0));
  const tapa = new THREE.Group(); tapa.position.set(0, 0.2, -0.375); g.add(tapa);
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.375, 0.375, 1.1, 16, 1, false, 0, Math.PI), madera); t.rotation.z = Math.PI/2; t.position.z = 0.375; tapa.add(t);
  const ch = caja(oro, 0.2, 0.2, 0.08, 0, 0.1, 0.8); tapa.add(ch);
  const em = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({map: etiqueta(MOD.EMOJI_PODER[poder] || '?', '#000', 'rgba(255,255,255,0.9)', 128, 128, '80px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'), transparent:true}));
  em.position.set(0, -0.08, 0.38); g.add(em);
  const h = halo('#ffe27a', 3.2, 0.7); g.add(h);
  g.userData = {tapa, halo: h};
  return g;
};

/* ---------------- lo que se le pone a las piezas ---------------- */
const vestirAntes = MOD.vestirPieza;
MOD.vestirPieza = function(s, g){
  if (vestirAntes) vestirAntes(s, g);
  if (s.mat === 'casaF1' || s.mat === 'casaF2' || s.mat === 'casaF3'){
    /* techito de colores alrededor y una puerta */
    const col = {casaF1:'#c8401a', casaF2:'#2a7a5a', casaF3:'#5a2aa0'}[s.mat];
    const borde = md('borde' + s.mat, col);
    g.add(caja(borde, s.sx*2 + 0.3, 0.25, 0.3, 0, -0.05, s.sz + 0.05)); g.add(caja(borde, s.sx*2 + 0.3, 0.25, 0.3, 0, -0.05, -s.sz - 0.05));
    g.add(caja(borde, 0.3, 0.25, s.sz*2 + 0.3, s.sx + 0.05, -0.05, 0)); g.add(caja(borde, 0.3, 0.25, s.sz*2 + 0.3, -s.sx - 0.05, -0.05, 0));
    g.add(caja(md('puertaF', '#6a3a1a'), 1, 1.6, 0.08, 0, -s.y1 + 0.8, s.sz + 0.03));
  } else if (s.mat === 'torreT'){
    const ant = palo(md('antenaT', '#d8d8e0', {metalness:0.7}), 0.04, 0.06, 1.2); ant.position.set(s.sx - 0.4, 0.6, s.sz - 0.4); g.add(ant);
  } else if (s.mat === 'tronco'){
    /* la copa del árbol gigante, arriba de todo */
    const v = md('copaGigante', '#3aa83a', {roughness:0.8, flatShading:true});
    for (let k = 0; k < 7; k++){ const a = k/7*TAU; const b = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 0), v); b.position.set(Math.sin(a)*3.4, 1.6 + (k % 2)*0.8, Math.cos(a)*3.4); b.castShadow = true; g.add(b); }
    const c = new THREE.Mesh(new THREE.IcosahedronGeometry(2.6, 0), v); c.position.y = 3.6; g.add(c);
  } else if (s.mat === 'reloj'){
    const cara = new THREE.Mesh(new THREE.CircleGeometry(1.3, 32), new THREE.MeshStandardMaterial({map: lienzo(128, 128, (x, w, h)=>{
      x.fillStyle = '#fff8e8'; x.beginPath(); x.arc(64, 64, 62, 0, TAU); x.fill(); x.strokeStyle = '#3a2a1a'; x.lineWidth = 6; x.stroke();
      x.fillStyle = '#3a2a1a'; for (let k = 0; k < 12; k++){ const a = k/12*TAU; x.fillRect(64 + Math.sin(a)*50 - 3, 64 - Math.cos(a)*50 - 3, 6, 6); }
      x.lineWidth = 7; x.beginPath(); x.moveTo(64, 64); x.lineTo(64, 24); x.moveTo(64, 64); x.lineTo(92, 64); x.stroke();
    }, false)}));
    for (const a of [0, Math.PI/2, Math.PI, -Math.PI/2]){ const c = cara.clone(); c.position.set(Math.sin(a)*2.02, -1.6, Math.cos(a)*2.02); c.rotation.y = a; g.add(c); }
  } else if (s.mat === 'bus'){
    /* el autobús volador, con su globo desinflado */
    for (const [x, z] of [[2.8, 1.5], [-2.8, 1.5], [2.8, -1.5], [-2.8, -1.5]]){ const r = palo(md('llantaBus', '#1a1a1a'), 0.6, 0.6, 0.4, 14); r.rotation.x = Math.PI/2; r.position.set(x, -1.6, z); g.add(r); }
    const globo = bola(md('globoBus', '#ff5ab0', {roughness:0.5}), 1.6, 1.5, 0.6, -2.4, 1.2, 0.5, 1); globo.rotation.z = 0.3; g.add(globo);
  } else if (s.mat === 'barco'){
    const mastil = palo(md('mastil', '#6a3a1a'), 0.12, 0.15, 6); mastil.position.set(0, 3, 0); g.add(mastil);
    const vela = new THREE.Mesh(new THREE.PlaneGeometry(3, 2.2), md('vela', '#fff6e0', {side: THREE.DoubleSide})); vela.position.set(0, 4.8, 0.2); g.add(vela);
    const band = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.6), new THREE.MeshBasicMaterial({map: etiqueta('☠', '#ffffff', '#1a1a1a', 64, 64), side: THREE.DoubleSide})); band.position.set(0, 6.4, 0); g.add(band);
    const proa = new THREE.Mesh(GEO.cono, MOD.matSuelo('barco').lado); proa.scale.set(s.sx, 2, s.sx*0.6); proa.rotation.x = Math.PI/2; proa.position.set(0, -0.8, s.sz + 1); g.add(proa);
  } else if (s.mat === 'cajaMadera' && s.y1 > 5.5){
    const b = MOD.banderaPais(['#ff5ab0', '#ffd23f', '#5ad8ff'], false); b.scale.setScalar(0.5); b.position.set(s.sx - 0.3, 0, -s.sz + 0.3); g.add(b);
  }
};

/* ---------------- los adornos y lo que se mueve ---------------- */
function autobusVolador(){
  const g = new THREE.Group();
  const az = md('busAzul', '#3a8aff', {roughness:0.35, metalness:0.2});
  g.add(caja(az, 6, 2.4, 2.6, 0, 0, 0));
  for (let i = 0; i < 4; i++) g.add(caja(md('ventBus', '#bfe8ff', {roughness:0.1}), 1, 0.9, 2.64, -2.1 + i*1.4, 0.4, 0));
  g.add(caja(md('franjaBus', '#ffffff'), 6.04, 0.25, 2.64, 0, -0.7, 0));
  const globo = bola(md('globoBusV', '#ff5ab0', {roughness:0.4}), 3.2, 0, 4.6, 0, 1.2, 1, 1); g.add(globo);
  for (const [x, z] of [[2.5, 1], [-2.5, 1], [2.5, -1], [-2.5, -1]]){ const c = palo(md('cuerda', '#e8e0d0'), 0.03, 0.03, 3); c.position.set(x*0.8, 2.2, z*0.8); g.add(c); }
  return g;
}
function letrero(texto, color){
  /* el letrero de cada zona: un cartel grande sobre dos palos */
  const g = new THREE.Group();
  const c = MOD.cartelPais(texto, color || '#ffe36e', 'rgba(40,20,80,0.92)', Math.max(3.5, texto.length*0.32), 0.9);
  c.position.y = 2.6; g.add(c);
  const atras = c.clone(); atras.rotation.y = Math.PI; atras.position.z = -0.02; g.add(atras);
  for (const x of [-1, 1]){ const p = palo(md('paloLetrero', '#8a5a2a'), 0.07, 0.08, 2.6); p.position.set(x*Math.max(1.5, texto.length*0.14), 1.3, 0); g.add(p); }
  return g;
}
function pocionDeco(){
  const g = new THREE.Group();
  const vidrio = std('#5ab8ff', {roughness:0.05, metalness:0.1, transparent:true, opacity:0.75, emissive:'#1a6ad8', emissiveIntensity:0.6});
  g.add(bola(vidrio, 0.3, 0, 0.3, 0));
  const cu = palo(vidrio, 0.09, 0.12, 0.25); cu.position.y = 0.62; g.add(cu);
  const ta = palo(md('tapaPocion', '#8a5a2a'), 0.1, 0.1, 0.1); ta.position.y = 0.78; g.add(ta);
  const h = halo('#5ab8ff', 1.6, 0.7); h.position.y = 0.3; g.add(h);
  return g;
}
MOD.pocion = pocionDeco;
MOD.fuegoMalo = function(){
  const g = new THREE.Group();
  g.add(bola(std('#ff7a1a', {emissive:'#ff4a00', emissiveIntensity:1.4}), 0.35, 0, 0, 0));
  g.add(halo('#ff6a1a', 2.2, 0.85));
  return g;
};
/* el arma que lleva Fernando en la mano */
MOD.armaJuguete = function(arma){
  const g = new THREE.Group();
  const col = {agua:'#3ac8ff', burbujas:'#ff9ae0', dardos:'#ff8a1a', confeti:'#b07aff', globos:'#ff3a3a'}[arma] || '#ffd23f';
  const c = md('arma' + arma, col, {roughness:0.35}), am = md('armaAm', '#ffd23f', {roughness:0.35}), bl = md('armaBl', '#ffffff', {roughness:0.35});
  if (arma === 'confeti'){
    const tubo = palo(c, 0.14, 0.17, 1.0, 12); tubo.rotation.x = Math.PI/2; tubo.position.z = 0.25; g.add(tubo);
    const boca = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 6, 14), am); boca.position.z = 0.76; g.add(boca);
  } else if (arma === 'globos'){
    g.add(bola(c, 0.22, 0, 0.05, 0.15, 1, 1.2, 1));
    const nudo = palo(bl, 0.03, 0.05, 0.08); nudo.position.set(0, -0.2, 0.15); g.add(nudo);
  } else {
    const cuerpo = caja(c, 0.16, 0.2, arma === 'dardos' ? 0.8 : 0.5, 0, 0, 0.12); g.add(cuerpo);
    const canon = palo(am, 0.05, 0.05, arma === 'dardos' ? 0.5 : 0.3, 8); canon.rotation.x = Math.PI/2; canon.position.z = arma === 'dardos' ? 0.7 : 0.5; g.add(canon);
    const mango = caja(bl, 0.12, 0.3, 0.14, 0, -0.18, -0.05); mango.rotation.x = 0.3; g.add(mango);
    if (arma === 'agua' || arma === 'burbujas'){ const tq = bola(md('tanque' + arma, arma === 'agua' ? '#9ae8ff' : '#fff0fa', {transparent:true, opacity:0.8}), 0.14, 0, 0.18, 0.05); g.add(tq); }
  }
  return g;
};
/* el bigote, los guantes y la gorra del Súper Plomero */
MOD.trajePlomero = function(){
  const g = new THREE.Group();
  const neg = md('bigote', '#2a1a10', {roughness:0.8}), bl = md('guanteBl', '#ffffff', {roughness:0.5});
  const big = new THREE.Group(); big.position.set(0, 1.23, 0.36); g.add(big); g.userData.bigote = big;
  for (const lado of [1, -1]){ const b = bola(neg, 0.09, 0.07*lado, 0, 0, 1.4, 0.7, 0.8); b.rotation.z = -0.3*lado; big.add(b); }
  const gl = [];
  for (const lado of [1, -1]){ const gu = bola(bl, 0.11, 0.36*lado, 0.62, 0.06); g.add(gu); gl.push(gu); }
  g.userData.guantes = gl;
  const em = new THREE.Mesh(new THREE.CircleGeometry(0.1, 16), new THREE.MeshBasicMaterial({map: etiqueta('P', '#e8262a', '#ffffff', 64, 64)}));
  em.position.set(0, 1.62, 0.3); g.add(em);
  return g;
};

const decorarAntes = MOD.decorarPais;
MOD.decorarPais = function(id, grupo, M, R){
  if (id !== 'reino') return decorarAntes ? decorarAntes(id, grupo, M, R) : null;
  const def = M.def, anim = [];
  const sobre = (o, x, z)=>{ const y = window.F3D.suelo(M, x, z, 100, 0).y; o.position.set(x, isFinite(y) ? y : 0, z); grupo.add(o); return o; };
  /* los letreros de las zonas */
  for (const zn of def.zonas || []){ const l = letrero(zn.nombre, '#ffe36e'); sobre(l, zn.x, zn.z); l.rotation.y = Math.atan2(-zn.x, 50 - zn.z); }
  /* la tormenta morada del borde (no hace nada: marca hasta dónde se puede ir) */
  const torm = new THREE.Mesh(new THREE.CylinderGeometry(96, 96, 140, 64, 1, true), new THREE.MeshBasicMaterial({color:'#b05aff', transparent:true, opacity:0.18, side: THREE.DoubleSide, depthWrite:false, fog:false}));
  torm.position.y = 40; grupo.add(torm);
  anim.push(t=>{ torm.material.opacity = 0.15 + Math.sin(t*0.8)*0.04; torm.rotation.y = t*0.02; });
  /* el autobús volador da vueltas por el cielo */
  const bus = autobusVolador(); grupo.add(bus);
  anim.push(t=>{ const u = t*0.12; bus.position.set(Math.sin(u)*55, 34 + Math.sin(t*0.7)*1.5, Math.cos(u)*55); bus.rotation.y = u + Math.PI/2; });
  /* la Fortaleza del Tortugón: murallas con almenas alrededor de la arena */
  const pf = MOD.matSuelo('piedraF').lado;
  for (let i = 0; i < 20; i++){
    const a = i/20*TAU; if (Math.abs(Math.sin(a/2)) < 0.12) continue;     /* la entrada mira a la isla */
    const w = caja(pf, 3.2, 3.4, 0.8, Math.sin(a)*10.8, 2.1, -76 + Math.cos(a)*10.8); w.rotation.y = a; grupo.add(w);
    const al = caja(pf, 1, 0.7, 0.8, Math.sin(a)*10.8, 4.15, -76 + Math.cos(a)*10.8); al.rotation.y = a; grupo.add(al);
  }
  for (const x of [-3, 3]){ const t = palo(pf, 1.3, 1.5, 8, 10); t.position.set(x, 4, -65); grupo.add(t); const c = new THREE.Mesh(GEO.cono, md('techoFort', '#e8401a')); c.scale.set(1.7, 2.2, 1.7); c.position.set(x, 9.1, -65); grupo.add(c); }
  /* banderas del reino y cajas sueltas */
  for (const [x, z, k] of [[-4, 46, 0], [4, 46, 1], [-6, -60, 2], [6, -60, 3]]){ const b = MOD.banderaPais(['#b05aff', '#ffd23f', '#5ad8ff'], false); sobre(b, x, z); anim.push(t=>MOD.ondearBandera(b, t + k)); }
  const mc = MOD.matSuelo('cajaMadera').lado;
  for (let i = 0; i < 14; i++){
    const a = R()*TAU, r = 18 + R()*38, x = Math.sin(a)*r, z = Math.cos(a)*r;
    if (window.F3D.suelo(M, x, z, 100, 0).s !== M.solidos[0]) continue;
    const c = caja(mc, 1, 1, 1, 0, 0.5, 0); sobre(c, x, z); c.rotation.y = R()*TAU;
  }
  /* arbustos redonditos */
  const v = md('arbusto', '#4ac84a', {roughness:0.85, flatShading:true});
  for (let i = 0; i < 30; i++){
    const a = R()*TAU, r = 10 + R()*48, x = Math.sin(a)*r, z = Math.cos(a)*r;
    if (window.F3D.suelo(M, x, z, 100, 0).s !== M.solidos[0]) continue;
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8 + R()*0.5, 0), v); sobre(b, x, z); b.position.y += 0.4;
  }
  return {anim};
};
})();
