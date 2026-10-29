'use strict';
/* ============================================================
   FERNANDO 3D — LOS PAÍSES (lo que se ve)
   Maracaibo, Estados Unidos, Italia, China y Argentina: las
   texturas pintadas, los monumentos (el Puente sobre el Lago, la
   Chinita, la Estatua de la Libertad, la Torre de Pisa, el Coliseo,
   la Gran Muralla, la pagoda, la cancha y la estatua de Messi…),
   los adornos que se mueven y la pelota y los Balones de Oro.
   Se engancha a modelos.js (MOD) y vista.js lo llama al armar cada mundo.
   ============================================================ */
(function(){
const MOD = window.F3D_MOD;
if (!MOD) return;
const {std, lienzo, bola, palo, GEO, halo, etiqueta, md, PINTAR, manchas, rng} = MOD;
const TAU = Math.PI*2;

/* ---------------- texturas pintadas ---------------- */
function ventanas(x, w, h, pared, vidrio, cols, filas, marco){
  x.fillStyle = pared; x.fillRect(0, 0, w, h);
  const cw = w/cols, ch = h/filas;
  for (let i = 0; i < cols; i++) for (let j = 0; j < filas; j++){
    const px = i*cw + cw*0.22, py = j*ch + ch*0.2;
    if (marco){ x.fillStyle = marco; x.fillRect(px - 4, py - 4, cw*0.56 + 8, ch*0.6 + 8); }
    x.fillStyle = vidrio; x.fillRect(px, py, cw*0.56, ch*0.6);
    x.fillStyle = 'rgba(255,255,255,0.35)'; x.fillRect(px + 3, py + 3, cw*0.12, ch*0.5);
  }
}
const CASAS = {casa1:'#ff7ab0', casa2:'#3ac8e8', casa3:'#ffd23f', casa4:'#7ae05a'};
for (const k in CASAS) PINTAR[k] = (x, w, h)=>{
  ventanas(x, w, h, CASAS[k], '#3a6aa8', 2, 2, '#ffffff');
  x.fillStyle = 'rgba(255,255,255,0.8)'; x.fillRect(0, 0, w, 10);
};
Object.assign(PINTAR, {
  colonial(x, w, h){
    x.fillStyle = '#f2c84a'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#fff6e0'; x.fillRect(0, 0, w, 14); x.fillRect(0, h - 14, w, 14); x.fillRect(0, 0, 12, h); x.fillRect(w/2 - 6, 0, 12, h);
    for (const cx of [w*0.25, w*0.75]){
      x.fillStyle = '#fff6e0'; x.beginPath(); x.arc(cx, h*0.42, 30, Math.PI, 0); x.lineTo(cx + 30, h*0.72); x.lineTo(cx - 30, h*0.72); x.fill();
      x.fillStyle = '#6a3a1a'; x.beginPath(); x.arc(cx, h*0.44, 22, Math.PI, 0); x.lineTo(cx + 22, h*0.7); x.lineTo(cx - 22, h*0.7); x.fill();
    }
  },
  campanario(x, w, h){
    x.fillStyle = '#fff2d0'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#f2c84a'; x.fillRect(0, h*0.48, w, h*0.06);
    for (const cx of [w*0.25, w*0.75]){ x.fillStyle = '#5a3a2a'; x.beginPath(); x.arc(cx, h*0.25, 20, Math.PI, 0); x.lineTo(cx + 20, h*0.4); x.lineTo(cx - 20, h*0.4); x.fill(); }
  },
  puente(x, w, h){
    x.fillStyle = '#b8bcc4'; x.fillRect(0, 0, w, h);
    manchas(x, w, h, rng(41), 40, ['#a8acb4', '#c8ccd4'], 6, 18, 0.4);
    x.fillStyle = '#ffffff'; for (let i = 0; i < w; i += 64) x.fillRect(i, h/2 - 4, 34, 8);
  },
  petroleo(x, w, h){
    x.fillStyle = '#5a5a62'; x.fillRect(0, 0, w, h);
    x.strokeStyle = '#ffb21a'; x.lineWidth = 6;
    for (let i = -w; i < w*2; i += 48){ x.beginPath(); x.moveTo(i, 0); x.lineTo(i + h, h); x.stroke(); }
    x.strokeStyle = '#3a3a42'; x.lineWidth = 4; for (let i = 0; i <= w; i += 64){ x.strokeRect(i, 0, 64, h); }
  },
  asfalto(x, w, h){
    x.fillStyle = '#3a3c42'; x.fillRect(0, 0, w, h);
    manchas(x, w, h, rng(42), 120, ['#44464c', '#303238'], 2, 6, 0.5);
  },
  rasca1(x, w, h){ ventanas(x, w, h, '#8aa8c8', '#bfe0ff', 3, 3, '#5a7a9a'); },
  rasca2(x, w, h){ ventanas(x, w, h, '#c8b8a0', '#ffe8a0', 3, 3, '#8a7a60'); },
  rasca3(x, w, h){ ventanas(x, w, h, '#5a8ab8', '#a8e0ff', 4, 3); },
  empire(x, w, h){ ventanas(x, w, h, '#d8ccb0', '#5a7aa8', 4, 4, '#b8ac90'); },
  hotdog(x, w, h){ for (let i = 0; i < 8; i++){ x.fillStyle = i % 2 ? '#ffffff' : '#e8262a'; x.fillRect(i*w/8, 0, w/8, h); } },
  pedestal(x, w, h){
    x.fillStyle = '#c8bca8'; x.fillRect(0, 0, w, h);
    manchas(x, w, h, rng(43), 60, ['#b8ac98', '#d8ccb8'], 4, 14, 0.4);
    x.strokeStyle = '#a89c88'; x.lineWidth = 4; for (let j = 0; j <= h; j += 64) { x.beginPath(); x.moveTo(0, j); x.lineTo(w, j); x.stroke(); }
  },
  estatua(x, w, h){ x.fillStyle = '#6fbfa6'; x.fillRect(0, 0, w, h); manchas(x, w, h, rng(44), 70, ['#5aa890', '#8ad8be'], 4, 20, 0.45); },
  marmol(x, w, h){
    x.fillStyle = '#f4f0e8'; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(160,150,140,0.35)'; x.lineWidth = 2; const R = rng(45);
    for (let i = 0; i < 14; i++){ x.beginPath(); let px = R()*w, py = 0; x.moveTo(px, py); for (let k = 0; k < 8; k++){ px += (R() - 0.5)*50; py += h/8; x.lineTo(px, py); } x.stroke(); }
  },
  pisa(x, w, h){
    x.fillStyle = '#f2ede2'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#e0d8c8'; x.fillRect(0, h - 20, w, 20);
    for (let i = 0; i < 4; i++){
      const cx = (i + 0.5)*w/4;
      x.fillStyle = '#b8ac98'; x.beginPath(); x.arc(cx, h*0.4, 22, Math.PI, 0); x.lineTo(cx + 22, h*0.85); x.lineTo(cx - 22, h*0.85); x.fill();
      x.fillStyle = '#ffffff'; x.fillRect(cx + 24, h*0.3, 6, h*0.6);
    }
  },
  adoquin(x, w, h){
    x.fillStyle = '#b8a890'; x.fillRect(0, 0, w, h);
    const R = rng(46);
    for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++){
      x.fillStyle = ['#c8b8a0', '#a89880', '#d0c0a8', '#b0a088'][Math.floor(R()*4)];
      const off = j % 2 ? 16 : 0; x.beginPath(); x.roundRect ? x.roundRect(i*32 + off + 2, j*32 + 2, 28, 28, 6) : x.rect(i*32 + off + 2, j*32 + 2, 28, 28); x.fill();
    }
  },
  pizza(x, w, h){
    x.fillStyle = '#ffd25a'; x.fillRect(0, 0, w, h);
    manchas(x, w, h, rng(47), 40, ['#ffe08a', '#f0b83a'], 6, 20, 0.5);
    const R = rng(48);
    for (let i = 0; i < 9; i++){ const px = R()*w, py = R()*h; x.fillStyle = '#c8282a'; x.beginPath(); x.arc(px, py, 18, 0, TAU); x.fill(); x.fillStyle = 'rgba(255,255,255,0.25)'; x.beginPath(); x.arc(px - 5, py - 5, 5, 0, TAU); x.fill(); }
    for (let i = 0; i < 12; i++){ x.fillStyle = '#2a8a2a'; x.beginPath(); x.ellipse(R()*w, R()*h, 8, 4, R()*3, 0, TAU); x.fill(); }
  },
  corteza(x, w, h){ x.fillStyle = '#d89a4a'; x.fillRect(0, 0, w, h); manchas(x, w, h, rng(49), 50, ['#c8883a', '#e8aa5a'], 4, 12, 0.5); },
  gelato(x, w, h){ x.fillStyle = '#ffb0d0'; x.fillRect(0, 0, w, h); x.fillStyle = '#fff4e0'; for (let i = 0; i < 4; i++){ x.beginPath(); x.arc((i + 0.5)*w/4, 0, 36, 0, Math.PI); x.fill(); } },
  gondola(x, w, h){ x.fillStyle = '#1a1a22'; x.fillRect(0, 0, w, h); x.fillStyle = '#ffd23f'; x.fillRect(0, h/2 - 4, w, 8); },
  muralla(x, w, h){
    x.fillStyle = '#a89a80'; x.fillRect(0, 0, w, h);
    const R = rng(50);
    for (let j = 0; j < 8; j++) for (let i = 0; i < 5; i++){
      x.fillStyle = ['#b8aa90', '#9a8c72', '#c0b298', '#a49680'][Math.floor(R()*4)];
      const off = j % 2 ? 26 : 0; x.fillRect(i*52 + off + 2, j*32 + 2, 48, 28);
    }
  },
  pagoda(x, w, h){
    x.fillStyle = '#d8262a'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#ffd23f'; x.fillRect(0, 0, w, 10); x.fillRect(0, h - 10, w, 10);
    for (let i = 0; i < 4; i++){ x.fillStyle = '#8a1010'; x.fillRect(i*w/4 + 10, 30, w/4 - 20, h - 60); x.fillStyle = '#ffd23f'; x.fillRect(i*w/4 + w/8 - 3, 30, 6, h - 60); }
  },
  tejaVerde(x, w, h){ x.fillStyle = '#2a8a5a'; x.fillRect(0, 0, w, h); x.fillStyle = '#3aaa6a'; for (let i = 0; i < w; i += 20) x.fillRect(i, 0, 10, h); },
  bambu(x, w, h){
    x.fillStyle = '#7ac83a'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < w; i += 32){ x.fillStyle = i % 64 ? '#6ab82a' : '#8ad84a'; x.fillRect(i, 0, 28, h); x.fillStyle = '#4a8a1a'; for (let j = 0; j < h; j += 64) x.fillRect(i, j, 28, 6); }
  },
  cancha(x, w, h){ for (let i = 0; i < 8; i++){ x.fillStyle = i % 2 ? '#3aa83a' : '#46b846'; x.fillRect(0, i*h/8, w, h/8); } },
  tribuna(x, w, h){ for (let i = 0; i < 8; i++){ x.fillStyle = i % 2 ? '#ffffff' : '#6ac8ff'; x.fillRect(i*w/8, 0, w/8, h); } },
  celesteBlanco(x, w, h){ for (let i = 0; i < 6; i++){ x.fillStyle = i % 2 ? '#ffffff' : '#6ac8ff'; x.fillRect(i*w/6, 0, w/6, h); } },
  obelisco(x, w, h){ x.fillStyle = '#f4f2ee'; x.fillRect(0, 0, w, h); x.fillStyle = '#e0ddd8'; for (let j = 0; j < h; j += 48) x.fillRect(0, j, w, 3); },
  balon(x, w, h){
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#1a1a1a';
    for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++){
      const cx = i*w/4 + (j % 2 ? w/8 : 0), cy = j*h/3 + h/6;
      x.beginPath(); for (let k = 0; k < 5; k++){ const a = k/5*TAU - Math.PI/2; x.lineTo(cx + Math.cos(a)*18, cy + Math.sin(a)*18); } x.fill();
    }
  },
  balonOro(x, w, h){
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#fff0a0'); g.addColorStop(0.5, '#ffc81a'); g.addColorStop(1, '#c88a00');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = '#b07800';
    for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++){
      const cx = i*w/4 + (j % 2 ? w/8 : 0), cy = j*h/3 + h/6;
      x.beginPath(); for (let k = 0; k < 5; k++){ const a = k/5*TAU - Math.PI/2; x.lineTo(cx + Math.cos(a)*16, cy + Math.sin(a)*16); } x.fill();
    }
  },
});

/* ---------------- los materiales de cada pieza ---------------- */
const tm = (t, o)=>std('#ffffff', Object.assign({map: MOD.tex(t), roughness:0.8}, o || {}));
MOD.matPais = {
  casa1: ()=>({top: tm('puente'), lado: tm('casa1')}), casa2: ()=>({top: tm('puente'), lado: tm('casa2')}),
  casa3: ()=>({top: tm('puente'), lado: tm('casa3')}), casa4: ()=>({top: tm('puente'), lado: tm('casa4')}),
  colonial: ()=>({top: tm('puente', {color:'#e8e0d0'}), lado: tm('colonial')}),
  campanario: ()=>({top: tm('marmol'), lado: tm('campanario')}),
  puente: ()=>({top: tm('puente'), lado: tm('puente', {color:'#d8dce4'})}),
  petroleo: ()=>({top: tm('petroleo'), lado: tm('petroleo', {color:'#c8c8d0'})}),
  rasca1: ()=>({top: tm('asfalto'), lado: tm('rasca1', {roughness:0.3, metalness:0.2})}),
  rasca2: ()=>({top: tm('asfalto'), lado: tm('rasca2', {roughness:0.4})}),
  rasca3: ()=>({top: tm('asfalto'), lado: tm('rasca3', {roughness:0.25, metalness:0.25})}),
  empire: ()=>({top: tm('asfalto'), lado: tm('empire', {roughness:0.5})}),
  hotdog: ()=>({top: tm('hotdog'), lado: tm('hotdog')}),
  pedestal: ()=>({top: tm('pedestal'), lado: tm('pedestal')}),
  estatua: ()=>({top: tm('estatua'), lado: tm('estatua')}),
  marmol: ()=>({top: tm('marmol', {roughness:0.35}), lado: tm('marmol', {roughness:0.35})}),
  pisa: ()=>({top: tm('marmol'), lado: tm('pisa', {roughness:0.5})}),
  adoquin: ()=>({top: tm('adoquin'), lado: tm('pedestal')}),
  pizza: ()=>({top: tm('pizza', {roughness:0.6}), lado: tm('corteza')}),
  gelato: ()=>({top: tm('gelato'), lado: tm('gelato')}),
  gondola: ()=>({top: tm('gondola'), lado: tm('gondola')}),
  muralla: ()=>({top: tm('muralla', {color:'#d8ccb8'}), lado: tm('muralla')}),
  torreMuralla: ()=>({top: tm('muralla', {color:'#d8ccb8'}), lado: tm('muralla', {color:'#e8dcc8'})}),
  pagoda: ()=>({top: tm('tejaVerde'), lado: tm('pagoda')}),
  bambu: ()=>({top: tm('bambu'), lado: tm('bambu')}),
  cancha: ()=>({top: tm('cancha')}),
  tribuna: ()=>({top: tm('puente', {color:'#e8eef8'}), lado: tm('tribuna')}),
  messi: ()=>({top: tm('celesteBlanco'), lado: tm('celesteBlanco')}),
  copa: ()=>({top: std('#ffd23f', {metalness:0.9, roughness:0.2})}),
  obelisco: ()=>({top: tm('obelisco'), lado: tm('obelisco')}),
  balon: ()=>({top: tm('balon', {roughness:0.4}), lado: tm('balon', {roughness:0.4})}),
};
/* las piezas que flotan sin la piedra puntiaguda de abajo */
MOD.sinCono = {pizza:true, balon:true, gondola:true, bambu:true};

/* ---------------- ayudantes ---------------- */
const oro = ()=>md('oroPais', '#ffd23f', {metalness:0.9, roughness:0.22, emissive:'#5a4000', emissiveIntensity:0.25});
function caja(mat, sx, sy, sz, x, y, z){ const m = new THREE.Mesh(GEO.cubo, mat); m.scale.set(sx, sy, sz); m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; return m; }
function cartel(texto, color, fondo, ancho, alto){
  const t = lienzo(512, 128, (x, w, h)=>{
    x.fillStyle = fondo || 'rgba(20,16,40,0.85)'; x.beginPath(); x.roundRect ? x.roundRect(4, 4, w - 8, h - 8, 24) : x.rect(4, 4, w - 8, h - 8); x.fill();
    x.fillStyle = color || '#ffffff'; x.font = 'bold 62px Fredoka, Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(texto, w/2, h/2 + 3);
  }, false);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(ancho || 3, alto || 0.75), new THREE.MeshStandardMaterial({map: t, roughness:0.6}));
  return m;
}
function bandera(colores, vertical, sol){
  const g = new THREE.Group();
  const asta = palo(md('asta', '#e8e8f0', {metalness:0.6, roughness:0.3}), 0.05, 0.06, 5); asta.position.y = 2.5; g.add(asta);
  const t = lienzo(192, 128, (x, w, h)=>{
    colores.forEach((c, i)=>{ x.fillStyle = c; if (vertical) x.fillRect(i*w/colores.length, 0, w/colores.length + 1, h); else x.fillRect(0, i*h/colores.length, w, h/colores.length + 1); });
    if (sol === 'usa'){ x.fillStyle = '#2a3a8a'; x.fillRect(0, 0, w*0.42, h*0.54); x.fillStyle = '#ffffff'; for (let j = 0; j < 4; j++) for (let i = 0; i < 5; i++) { x.beginPath(); x.arc(8 + i*15, 8 + j*15, 3, 0, TAU); x.fill(); } }
    if (sol === 'arg'){ x.fillStyle = '#ffc81a'; x.beginPath(); x.arc(w/2, h/2, 14, 0, TAU); x.fill(); }
    if (sol === 'china'){ x.fillStyle = '#ffd23f'; for (const [px, py, r] of [[30, 30, 14], [62, 14, 5], [72, 28, 5], [72, 46, 5], [62, 58, 5]]){ x.beginPath(); for (let k = 0; k < 10; k++){ const a = k/10*TAU - Math.PI/2, rr = k % 2 ? r*0.45 : r; x.lineTo(px + Math.cos(a)*rr, py + Math.sin(a)*rr); } x.fill(); } }
    if (sol === 'vzla'){ x.fillStyle = '#ffffff'; for (let k = 0; k < 8; k++){ const a = Math.PI + (k + 0.5)/8*Math.PI; x.beginPath(); x.arc(w/2 + Math.cos(a)*34, h*0.62 + Math.sin(a)*34, 4, 0, TAU); x.fill(); } }
  }, false);
  const tela = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.2, 8, 1), new THREE.MeshStandardMaterial({map: t, side: THREE.DoubleSide, roughness:0.7}));
  tela.position.set(0.95, 4.3, 0); g.add(tela);
  g.userData.tela = tela;
  return g;
}
function ondear(b, t){
  const geo = b.userData.tela.geometry, pos = geo.attributes.position;
  if (!geo.userData.x0){ geo.userData.x0 = Array.from({length: pos.count}, (_, i)=>pos.getX(i)); }
  for (let i = 0; i < pos.count; i++){ const x0 = geo.userData.x0[i]; pos.setZ(i, Math.sin(x0*3 - t*5)*0.12*(x0 + 0.9)); }
  pos.needsUpdate = true;
}
function persona(R, colores){
  const g = new THREE.Group();
  const c = colores[Math.floor(R()*colores.length)];
  g.add(caja(md('ropa' + c, c, {roughness:0.7}), 0.34, 0.45, 0.24, 0, 0.32, 0));
  g.add(bola(md('piel' + (R() < 0.5 ? 1 : 2), R() < 0.5 ? '#ffcfa6' : '#c88a5a', {roughness:0.6}), 0.15, 0, 0.7, 0));
  return g;
}

/* ---------------- lo que se le pone encima a ciertas piezas ---------------- */
MOD.vestirPieza = function(s, g){
  const base = g.children[0];
  if (s.mat === 'balon'){
    if (base) base.visible = false;
    const b = new THREE.Mesh(new THREE.SphereGeometry(s.r*1.08, 32, 20), MOD.matSuelo('balon').top); b.position.y = -s.r*0.98; b.castShadow = true; g.add(b);
  } else if (s.mat === 'gondola'){
    if (base) base.visible = false;
    g.add(gondola());
  } else if (s.mat === 'estatua'){
    if (base) base.visible = false;
    g.add(estatuaLibertad(s.y1 - 3.2));
  } else if (s.mat === 'messi'){
    if (base) base.visible = false;
    g.add(estatuaMessi(s.y1 - 1.1));
  } else if (s.mat === 'copa'){
    if (base) base.visible = false;
    const c = copaMundo(s.y1 - 1.1); c.position.y = -(s.y1 - 1.1); g.add(c);
  } else if (s.mat === 'obelisco'){
    if (base) base.visible = false;
    const alto = s.y1 + 0.5;
    const o = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 1.3, alto, 4), MOD.matSuelo('obelisco').lado); o.rotation.y = Math.PI/4; o.position.y = -alto/2; o.castShadow = true; g.add(o);
    const p = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.4, 4), MOD.matSuelo('obelisco').lado); p.rotation.y = Math.PI/4; p.position.y = 0.7; g.add(p);
  } else if (s.mat === 'pisa'){
    /* la torre se inclina un poquito (la escalera la rodea igual) */
    const piv = new THREE.Group(); piv.position.y = -s.y1;
    for (const c of [...g.children]){ g.remove(c); c.position.y += s.y1; piv.add(c); }
    const marmol = MOD.matSuelo('marmol').top;
    for (let k = 1; k <= 6; k++){ const r = new THREE.Mesh(new THREE.TorusGeometry(s.r + 0.06, 0.1, 6, 40), marmol); r.rotation.x = Math.PI/2; r.position.y = k*s.y1/7; piv.add(r); }
    const cam = new THREE.Mesh(new THREE.CylinderGeometry(s.r*0.75, s.r*0.75, 1.4, 24, 1, true), MOD.matSuelo('pisa').lado); cam.position.y = s.y1 + 0.7; piv.add(cam);
    piv.rotation.z = -0.05; g.add(piv);
  } else if (s.mat === 'pagoda'){
    /* el alero de tejas verdes con las puntas hacia arriba */
    const teja = MOD.matSuelo('pagoda').top;
    const alero = new THREE.Mesh(new THREE.CylinderGeometry(s.r + 0.05, s.r + 1.0, 0.55, 32, 1, true), teja); alero.position.y = -0.35; alero.material = teja; g.add(alero);
    for (let k = 0; k < 8; k++){ const a = k/8*TAU; const p = new THREE.Mesh(GEO.cono, oro()); p.scale.set(0.1, 0.4, 0.1); p.position.set(Math.sin(a)*(s.r + 1.0), -0.45, Math.cos(a)*(s.r + 1.0)); p.rotation.set(Math.cos(a)*0.6, 0, -Math.sin(a)*0.6); g.add(p);
      const fa = bola(md('farolito', '#ff3a2a', {emissive:'#ff2a10', emissiveIntensity:0.8}), 0.18, Math.sin(a + 0.4)*(s.r + 0.6), -0.9, Math.cos(a + 0.4)*(s.r + 0.6), 1, 1.3, 1); g.add(fa); }
    if (s.r < 2) { const pu = palo(oro(), 0.06, 0.12, 1.6); pu.position.set(s.r*0.6, 0.8, 0); g.add(pu); }
  } else if (s.mat === 'muralla' || s.mat === 'torreMuralla'){
    /* las almenas a los lados */
    const m = MOD.matSuelo('muralla').lado;
    const lados = s.mat === 'torreMuralla' ? ['x', 'z'] : (s.sx > s.sz ? ['x'] : ['z']);
    for (const eje of lados){
      const largo = eje === 'x' ? s.sx : s.sz, otro = eje === 'x' ? s.sz : s.sx;
      for (let u = -largo + 0.4; u <= largo - 0.3; u += 1.1) for (const lado of [1, -1]){
        const a = eje === 'x' ? caja(m, 0.55, 0.5, 0.35, u, 0.25, lado*(otro - 0.18)) : caja(m, 0.35, 0.5, 0.55, lado*(otro - 0.18), 0.25, u);
        g.add(a);
      }
    }
  } else if (s.mat === 'colonial' && s.sx >= 3){
    /* la fachada de la Basílica de la Chinita: frontón, rosetón y la virgencita dorada */
    const blanco = md('blancoColonial', '#fff6e0');
    const tri = new THREE.Shape(); tri.moveTo(-s.sx*0.8, 0); tri.lineTo(s.sx*0.8, 0); tri.lineTo(0, 1.5); tri.lineTo(-s.sx*0.8, 0);
    const fr = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, {depth: 0.35, bevelEnabled: false}), md('frontonColonial', '#f2c84a')); fr.position.set(0, 0, s.sz - 0.35); fr.castShadow = true; g.add(fr);
    const cruz = new THREE.Group(); cruz.add(caja(blanco, 0.12, 0.7, 0.12, 0, 0.35, 0)); cruz.add(caja(blanco, 0.45, 0.12, 0.12, 0, 0.48, 0)); cruz.position.set(0, 1.5, s.sz - 0.17); g.add(cruz);
    const ros = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), md('roseton', '#5ab8ff', {emissive:'#2a7ad8', emissiveIntensity:0.5})); ros.position.set(0, -1.2, s.sz + 0.02); g.add(ros);
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.07, 6, 24), blanco); aro.position.copy(ros.position); g.add(aro);
    const virgen = new THREE.Mesh(new THREE.CircleGeometry(0.45, 20), oro()); virgen.position.set(0, -2.9, s.sz + 0.03); g.add(virgen);
    const h = halo('#ffe27a', 2.2, 0.5); h.position.set(0, -2.9, s.sz + 0.2); g.add(h);
    const puerta = caja(md('puertaColonial', '#6a3a1a'), 1.4, 1.8, 0.1, 0, -s.y1 + 0.9, s.sz + 0.02); g.add(puerta);
  } else if (s.mat === 'campanario'){
    const c = new THREE.Mesh(new THREE.TorusGeometry(s.r, 0.12, 6, 24), md('blancoColonial', '#fff6e0')); c.rotation.x = Math.PI/2; c.position.y = -0.05; g.add(c);
    const campana = bola(oro(), 0.35, 0, -1.5, s.r - 0.1, 1, 1.1, 0.6); g.add(campana);
  } else if (s.mat === 'empire'){
    const ant = palo(md('antena', '#d8d8e0', {metalness:0.7, roughness:0.3}), 0.06, 0.18, 4); ant.position.set(-s.sx + 0.5, 2, -s.sz + 0.5); g.add(ant);
    const luz = bola(md('luzRoja', '#ff2a2a', {emissive:'#ff0000', emissiveIntensity:1}), 0.12, -s.sx + 0.5, 4.05, -s.sz + 0.5); g.add(luz);
  } else if (s.mat === 'rasca1' || s.mat === 'rasca2'){
    const tanque = palo(md('tanque', '#8a5a3a'), 0.45, 0.45, 0.9); tanque.position.set(s.sx - 0.7, 0.45, s.sz - 0.7); g.add(tanque);
    const tapa = new THREE.Mesh(GEO.cono, md('tanque', '#8a5a3a')); tapa.scale.set(0.5, 0.4, 0.5); tapa.position.set(s.sx - 0.7, 1.1, s.sz - 0.7); g.add(tapa);
  } else if (s.mat === 'hotdog'){
    const c = cartel('HOT DOGS', '#ffe23a', '#e8262a', 2.4, 0.6); c.position.set(0, 1.1, s.sz + 0.02); g.add(c);
    const pan = bola(md('pan', '#e8a050'), 0.3, -s.sx + 0.5, 0.25, 0, 2.2, 0.8, 0.9); g.add(pan);
    const sal = bola(md('salchicha', '#c8483a'), 0.22, -s.sx + 0.5, 0.42, 0, 3.2, 0.7, 0.7); g.add(sal);
  } else if (s.mat === 'petroleo' && s.sx > 2){
    const t = torrePetrolera(); t.position.set(-s.sx + 1, 0, -s.sz + 1); g.add(t);
  } else if (s.mat === 'gelato'){
    const cono = new THREE.Mesh(GEO.cono, md('barquillo', '#d8a050')); cono.scale.set(0.45, 1.2, 0.45); cono.rotation.x = Math.PI; cono.position.set(s.sx - 0.3, 0.6, s.sz - 0.3); g.add(cono);
    g.add(bola(md('helado1', '#ff9ac0'), 0.45, s.sx - 0.3, 1.35, s.sz - 0.3));
    g.add(bola(md('helado2', '#9af0c0'), 0.38, s.sx - 0.3, 1.85, s.sz - 0.3));
  } else if (s.mat === 'tribuna'){
    /* la hinchada: celeste y blanco */
    const R = rng(Math.round(s.z*31 + s.y1*7));
    for (let u = -s.sx + 0.6; u < s.sx - 0.4; u += 0.75){
      if (R() < 0.15) continue;
      const p = persona(R, ['#6ac8ff', '#ffffff', '#6ac8ff', '#1a3a8a']); p.position.set(u + (R() - 0.5)*0.2, 0, -s.sz + 0.5); g.add(p);
    }
  } else if (s.mat === 'pizza'){
    const borde = new THREE.Mesh(new THREE.TorusGeometry(s.r - 0.05, 0.16, 8, 32), MOD.matSuelo('pizza').lado); borde.rotation.x = Math.PI/2; borde.position.y = 0.02; g.add(borde);
  }
};

/* ---------------- monumentos ---------------- */
function techoChino(r){
  const g = new THREE.Group();
  const teja = MOD.matSuelo('pagoda').top;
  const t = new THREE.Mesh(new THREE.ConeGeometry(r, r*0.6, 4), teja); t.rotation.y = Math.PI/4; t.position.y = r*0.3; g.add(t);
  for (let k = 0; k < 4; k++){ const a = k/4*TAU + Math.PI/4; const p = new THREE.Mesh(GEO.cono, oro()); p.scale.set(0.08, 0.35, 0.08); p.position.set(Math.sin(a)*r*0.72, 0.1, Math.cos(a)*r*0.72); g.add(p); }
  return g;
}
function gondola(){
  const g = new THREE.Group();
  const negro = MOD.matSuelo('gondola').lado;
  const casco = bola(negro, 1, 0, -0.32, 0, 0.95, 0.38, 2.6); g.add(casco);
  const piso = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.06, 24), md('pisoGondola', '#8a5a2a')); piso.scale.set(0.5, 1, 1.25); piso.position.y = -0.02; g.add(piso);
  const proa = new THREE.Mesh(GEO.cono, negro); proa.scale.set(0.18, 1.1, 0.18); proa.position.set(0, 0.25, 2.6); proa.rotation.x = 0.6; g.add(proa);
  const popa = new THREE.Mesh(GEO.cono, negro); popa.scale.set(0.18, 1.0, 0.18); popa.position.set(0, 0.2, -2.6); popa.rotation.x = -0.6; g.add(popa);
  const hierro = caja(md('plata', '#e0e0e8', {metalness:0.9, roughness:0.2}), 0.08, 0.5, 0.3, 0, 0.75, 3.05); g.add(hierro);
  /* el gondolero con camiseta de rayas y sombrero de paja */
  const gon = new THREE.Group(); gon.position.set(0, 0, -1.9);
  const t = lienzo(64, 64, (x, w, h)=>{ for (let i = 0; i < 8; i++){ x.fillStyle = i % 2 ? '#ffffff' : '#1a2a6a'; x.fillRect(0, i*h/8, w, h/8); } }, false);
  gon.add(caja(new THREE.MeshStandardMaterial({map: t}), 0.5, 0.6, 0.32, 0, 1.1, 0));
  gon.add(caja(md('pantalon', '#1a1a22'), 0.42, 0.7, 0.28, 0, 0.45, 0));
  gon.add(bola(md('pielG', '#ffcfa6'), 0.2, 0, 1.6, 0));
  const som = palo(md('paja', '#f0d070'), 0.32, 0.32, 0.04, 20); som.position.y = 1.78; gon.add(som);
  const som2 = palo(md('paja', '#f0d070'), 0.18, 0.2, 0.16, 16); som2.position.y = 1.86; gon.add(som2);
  const cinta = palo(md('cintaRoja', '#e8262a'), 0.205, 0.205, 0.05, 16); cinta.position.y = 1.82; gon.add(cinta);
  const remo = palo(md('remo', '#8a5a2a'), 0.04, 0.04, 3.2); remo.position.set(0.4, 0.9, 0.3); remo.rotation.x = 0.5; gon.add(remo);
  g.add(gon);
  return g;
}
function estatuaLibertad(alto){
  /* hecha para pararse en su cabeza: la corona queda alrededor */
  const g = new THREE.Group();
  const verde = MOD.matSuelo('estatua').lado;
  const tunica = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 1.5, alto - 1.6, 24), verde); tunica.position.y = -alto + (alto - 1.6)/2; tunica.castShadow = true; g.add(tunica);
  const hombros = bola(verde, 0.95, 0, -1.55, 0, 1, 0.55, 0.8); g.add(hombros);
  const cuello = palo(verde, 0.3, 0.35, 0.5); cuello.position.y = -1.1; g.add(cuello);
  const cab = bola(verde, 0.55, 0, -0.55, 0, 1, 0.95, 1); g.add(cab);
  for (let k = 0; k < 7; k++){ const a = (k/6 - 0.5)*Math.PI*1.1; const p = new THREE.Mesh(GEO.cono, verde); p.scale.set(0.09, 0.6, 0.09); p.position.set(Math.sin(a)*0.75, -0.2, Math.cos(a)*0.75); p.rotation.set(Math.cos(a)*1.2, 0, -Math.sin(a)*1.2); g.add(p); }
  for (const lado of [1, -1]){ const o = bola(md('ojoEstatua', '#4a9a80'), 0.07, 0.2*lado, -0.5, 0.5); g.add(o); }
  /* el brazo con la antorcha, hacia el lado */
  const brazo = palo(verde, 0.18, 0.24, 2.6); brazo.position.set(1.05, -0.4, 0); brazo.rotation.z = -0.25; g.add(brazo);
  const copa = palo(oro(), 0.32, 0.16, 0.4); copa.position.set(1.4, 1.0, 0); g.add(copa);
  const llama = new THREE.Mesh(GEO.cono, md('llamaOro', '#ffb21a', {emissive:'#ff8a00', emissiveIntensity:1.2})); llama.scale.set(0.28, 0.7, 0.28); llama.position.set(1.4, 1.5, 0); g.add(llama);
  const h = halo('#ffc84a', 3, 0.6); h.position.set(1.4, 1.5, 0); g.add(h);
  /* la tablilla en el otro brazo */
  const tab = caja(verde, 0.5, 0.75, 0.15, -0.95, -2.2, 0.35); tab.rotation.z = 0.2; g.add(tab);
  return g;
}
function estatuaMessi(alto){
  /* Messi levantando la Copa, con la camiseta albiceleste y el 10 */
  const g = new THREE.Group(); g.position.y = -alto;
  const k = alto/4.5;
  const t = lienzo(128, 128, (x, w, h)=>{ for (let i = 0; i < 6; i++){ x.fillStyle = i % 2 ? '#ffffff' : '#6ac8ff'; x.fillRect(i*w/6, 0, w/6, h); } }, false);
  const camiseta = new THREE.MeshStandardMaterial({map: t, roughness:0.6});
  const piel = md('pielMessi', '#f0c098', {roughness:0.6}), negro = md('shortMessi', '#1a1a2a'), pelo = md('peloMessi', '#5a3a1a', {roughness:0.8});
  for (const lado of [1, -1]){
    const pierna = palo(piel, 0.16*k, 0.13*k, 1.1*k); pierna.position.set(0.22*k*lado, 0.75*k, 0); g.add(pierna);
    const media = palo(md('mediaMessi', '#1a1a2a'), 0.17*k, 0.15*k, 0.5*k); media.position.set(0.22*k*lado, 0.4*k, 0); g.add(media);
    const zapato = bola(md('botin', '#ffd23f'), 0.17*k, 0.22*k*lado, 0.1*k, 0.08*k, 1, 0.6, 1.6); g.add(zapato);
  }
  const short = palo(negro, 0.42*k, 0.45*k, 0.5*k, 16); short.position.y = 1.45*k; g.add(short);
  const torso = palo(camiseta, 0.46*k, 0.42*k, 1.0*k, 16); torso.position.y = 2.15*k; g.add(torso);
  const num = new THREE.Mesh(new THREE.PlaneGeometry(0.55*k, 0.55*k), new THREE.MeshBasicMaterial({map: etiqueta('10', '#1a2a6a', null, 128, 128), transparent:true}));
  num.position.set(0, 2.2*k, -0.47*k); num.rotation.y = Math.PI; g.add(num);
  const cab = bola(piel, 0.32*k, 0, 2.95*k, 0, 1, 1.1, 1); g.add(cab);
  g.add(bola(pelo, 0.34*k, 0, 3.08*k, -0.04*k, 1, 0.8, 1));
  g.add(bola(pelo, 0.26*k, 0, 2.78*k, 0.12*k, 1, 0.7, 0.8));     // la barba
  for (const lado of [1, -1]){
    const brazo = palo(camiseta, 0.13*k, 0.11*k, 1.1*k); brazo.position.set(0.42*k*lado, 3.1*k, 0); brazo.rotation.z = -0.35*lado; g.add(brazo);
    g.add(bola(piel, 0.12*k, 0.24*k*lado, 3.62*k, 0));
  }
  const copa = copaMundo(0.9*k); copa.position.y = 3.6*k; g.add(copa);
  /* la placa */
  const placa = cartel('MESSI 10', '#1a2a6a', '#ffffff', 2.6, 0.65); placa.position.set(0, -0.55, 2.02); g.add(placa);
  g.traverse(o=>{ if (o.isMesh) o.castShadow = true; });
  return g;
}
function copaMundo(alto){
  const g = new THREE.Group();
  const k = alto/3.3;
  const verde = md('malaquita', '#1a8a4a', {roughness:0.3, metalness:0.3});
  const base = palo(oro(), 0.75*k, 0.85*k, 0.45*k, 24); base.position.y = 0.22*k; g.add(base);
  for (const y of [0.5, 0.75]){ const a = new THREE.Mesh(new THREE.TorusGeometry(0.62*k, 0.08*k, 8, 24), verde); a.rotation.x = Math.PI/2; a.position.y = y*k; g.add(a); }
  const cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(0.42*k, 0.55*k, 1.7*k, 20), oro()); cuerpo.position.y = 1.6*k; g.add(cuerpo);
  for (let i = 0; i < 2; i++){ const esp = new THREE.Mesh(new THREE.TorusGeometry(0.5*k, 0.12*k, 8, 20, Math.PI*1.4), oro()); esp.position.y = (1.3 + i*0.5)*k; esp.rotation.set(Math.PI/2, 0, i*2); g.add(esp); }
  const mundo = bola(oro(), 0.72*k, 0, 2.85*k, 0); g.add(mundo);
  const h = halo('#ffe27a', 2.5*k, 0.45); h.position.y = 2.4*k; g.add(h);
  return g;
}
function torrePetrolera(){
  const g = new THREE.Group();
  const m = md('torrePetro', '#e8e8f0', {metalness:0.5, roughness:0.4}), r = md('torrePetroR', '#e8262a');
  for (let i = 0; i < 4; i++){ const a = i/4*TAU + Math.PI/4; const p = palo(i % 2 ? m : r, 0.06, 0.06, 7.2); p.position.set(Math.sin(a)*0.55, 3.5, Math.cos(a)*0.55); p.rotation.set(-Math.cos(a)*0.12, 0, Math.sin(a)*0.12); g.add(p); }
  for (let y = 1; y < 7; y += 1.2){ const a = new THREE.Mesh(new THREE.TorusGeometry(0.8 - y*0.07, 0.04, 4, 4), m); a.rotation.x = Math.PI/2; a.rotation.z = Math.PI/4; a.position.y = y; g.add(a); }
  const luz = bola(md('luzRoja', '#ff2a2a', {emissive:'#ff0000', emissiveIntensity:1}), 0.12, 0, 7.2, 0); g.add(luz);
  return g;
}
function balancin(){
  /* el balancín petrolero que sube y baja */
  const g = new THREE.Group();
  const az = md('balancinAz', '#ffb21a', {roughness:0.5}), gr = md('balancinGr', '#4a4a52');
  g.add(caja(gr, 2.6, 0.3, 1.2, 0, 0.15, 0));
  const pata = palo(gr, 0.12, 0.16, 2.2); pata.position.set(0, 1.25, 0); g.add(pata);
  const viga = new THREE.Group(); viga.position.y = 2.3; g.add(viga);
  viga.add(caja(az, 3.2, 0.3, 0.3, 0, 0, 0));
  const cabeza = caja(az, 0.4, 1.0, 0.5, 1.7, -0.3, 0); viga.add(cabeza);
  g.userData.viga = viga;
  return g;
}
function taxi(){
  const g = new THREE.Group();
  const am = md('taxi', '#ffc81a', {roughness:0.35, metalness:0.2}), ng = md('llanta', '#1a1a1a'), vi = md('vidrioTaxi', '#5a8ab8', {roughness:0.1, metalness:0.3});
  g.add(caja(am, 2.2, 0.55, 1.1, 0, 0.55, 0));
  g.add(caja(vi, 1.2, 0.45, 1.0, -0.1, 1.05, 0));
  g.add(caja(am, 0.5, 0.18, 0.3, -0.1, 1.36, 0));
  for (const [x, z] of [[0.7, 0.55], [-0.7, 0.55], [0.7, -0.55], [-0.7, -0.55]]){ const r = palo(ng, 0.24, 0.24, 0.18, 12); r.rotation.x = Math.PI/2; r.position.set(x, 0.26, z); g.add(r); }
  const tablero = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.2), new THREE.MeshBasicMaterial({map: etiqueta('TAXI', '#1a1a1a', null, 128, 32)})); tablero.position.set(-0.1, 1.36, 0.16); g.add(tablero);
  return g;
}
function cohete(){
  const g = new THREE.Group();
  const bl = md('cohete', '#f4f4f8', {roughness:0.3, metalness:0.2}), rj = md('coheteR', '#e8262a');
  const c = palo(bl, 0.9, 0.9, 7, 20); c.position.y = 4.2; g.add(c);
  const p = new THREE.Mesh(GEO.cono, rj); p.scale.set(0.9, 2, 0.9); p.position.y = 8.7; g.add(p);
  for (let k = 0; k < 4; k++){ const a = k/4*TAU; const al = caja(rj, 0.12, 1.8, 1.1, Math.sin(a)*1.2, 1.4, Math.cos(a)*1.2); al.rotation.y = a; g.add(al); }
  const v = bola(md('ventanaCohete', '#5ab8ff', {emissive:'#1a6ad8', emissiveIntensity:0.5}), 0.35, 0, 6, 0.85, 1, 1, 0.3); g.add(v);
  const t = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 3), new THREE.MeshBasicMaterial({map: lienzo(64, 256, (x, w, h)=>{ x.fillStyle = '#1a3a8a'; x.font = 'bold 54px Arial'; x.textAlign = 'center'; ['U', 'S', 'A'].forEach((l, i)=>x.fillText(l, w/2, 70 + i*70)); }, false), transparent:true}));
  t.position.set(0, 4, 0.92); g.add(t);
  return g;
}
function letrasCartel(texto, colores, alto){
  const g = new THREE.Group();
  const ancho = alto*0.75, paso = ancho*1.05;
  [...texto].forEach((l, i)=>{
    const c = colores[i % colores.length];
    const t = lienzo(128, 160, (x, w, h)=>{ x.fillStyle = c; x.font = 'bold 150px Fredoka, Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(l, w/2, h/2 + 6); }, false);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(ancho, alto), new THREE.MeshStandardMaterial({map: t, transparent:true, side: THREE.DoubleSide, roughness:0.4}));
    m.position.set((i - (texto.length - 1)/2)*paso, alto/2, 0); g.add(m);
  });
  return g;
}
function panda(R){
  const g = new THREE.Group();
  const bl = md('pandaB', '#f8f8f4', {roughness:0.8}), ng = md('pandaN', '#1a1a1e', {roughness:0.8});
  g.add(bola(bl, 0.55, 0, 0.55, 0, 1, 0.95, 0.9));
  g.add(bola(bl, 0.4, 0, 1.25, 0.1));
  for (const lado of [1, -1]){
    g.add(bola(ng, 0.14, 0.28*lado, 1.58, 0.05));
    g.add(bola(ng, 0.1, 0.15*lado, 1.3, 0.42, 1, 1.2, 0.5));
    g.add(bola(ng, 0.2, 0.42*lado, 0.7, 0.2, 0.8, 1.2, 0.8));
    g.add(bola(ng, 0.22, 0.28*lado, 0.18, 0.35, 1, 0.7, 1.1));
  }
  g.add(bola(ng, 0.06, 0, 1.2, 0.5));
  const bam = palo(md('bambuP', '#7ac83a'), 0.05, 0.05, 1.1); bam.position.set(0.3, 0.9, 0.45); bam.rotation.z = 0.6; g.add(bam);
  g.scale.setScalar(0.8 + R()*0.4);
  return g;
}
function bambu(R){
  const g = new THREE.Group();
  const m = md('bambuT', '#7ac83a', {roughness:0.5}), n = md('bambuN', '#4a8a1a'), h = md('bambuH', '#5ab83a', {side: THREE.DoubleSide});
  const n0 = 3 + Math.floor(R()*4);
  for (let i = 0; i < n0; i++){
    const alto = 3 + R()*3, x = (R() - 0.5)*1.2, z = (R() - 0.5)*1.2;
    const t = palo(m, 0.08, 0.1, alto, 8); t.position.set(x, alto/2, z); t.rotation.set((R() - 0.5)*0.1, 0, (R() - 0.5)*0.1); g.add(t);
    for (let y = 0.8; y < alto; y += 0.8){ const a = palo(n, 0.11, 0.11, 0.05, 8); a.position.set(x, y, z); g.add(a); }
    for (let k = 0; k < 3; k++){ const hj = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.16), h); hj.position.set(x + (R() - 0.5)*0.5, alto - R()*0.8, z + (R() - 0.5)*0.5); hj.rotation.set(R(), R()*3, R()); g.add(hj); }
  }
  return g;
}
function farol(){
  const g = new THREE.Group();
  const rj = md('farolRojo', '#ff2a1a', {emissive:'#ff3a10', emissiveIntensity:0.9, roughness:0.5});
  g.add(bola(rj, 0.45, 0, 0, 0, 1, 0.85, 1));
  const ta = palo(oro(), 0.22, 0.22, 0.12); ta.position.y = 0.4; g.add(ta);
  const tb = palo(oro(), 0.22, 0.22, 0.12); tb.position.y = -0.4; g.add(tb);
  const bo = palo(md('borla', '#ffd23f'), 0.04, 0.08, 0.5); bo.position.y = -0.7; g.add(bo);
  const h = halo('#ff7a3a', 2.4, 0.55); g.add(h);
  return g;
}
function dragonVolador(){
  /* el dragón chino que da vueltas por el cielo */
  const g = new THREE.Group(), seg = [];
  const rj = md('dragonV', '#e8262a', {roughness:0.4}), am = md('dragonA', '#ffd23f', {roughness:0.4, metalness:0.3});
  for (let i = 0; i < 16; i++){ const b = bola(i % 2 ? rj : am, 0.9 - i*0.035, 0, 0, 0); g.add(b); seg.push(b); }
  const cab = new THREE.Group(); seg[0].add(cab);
  cab.add(bola(rj, 1.3, 0, 0.1, 0.6, 1, 0.8, 1.2));
  for (const lado of [1, -1]){ const o = MOD.ojo(0.3); o.position.set(0.55*lado, 0.55, 1.2); cab.add(o);
    const cu = new THREE.Mesh(GEO.cono, am); cu.scale.set(0.12, 0.9, 0.12); cu.position.set(0.5*lado, 1.1, 0.2); cu.rotation.x = -0.6; cab.add(cu);
    const bi = palo(am, 0.04, 0.02, 1.8); bi.position.set(0.9*lado, -0.1, 1.5); bi.rotation.z = Math.PI/2 + 0.4*lado; cab.add(bi); }
  g.userData.seg = seg;
  return g;
}
function arco(lado){
  /* el arco de fútbol con su red */
  const g = new THREE.Group();
  const bl = md('poste', '#ffffff', {roughness:0.3});
  for (const z of [-2.6, 2.6]){ const p = palo(bl, 0.08, 0.08, 2.2); p.position.set(0, 1.1, z); g.add(p); }
  const tr = palo(bl, 0.08, 0.08, 5.36); tr.rotation.x = Math.PI/2; tr.position.set(0, 2.2, 0); g.add(tr);
  const red = new THREE.MeshStandardMaterial({map: lienzo(64, 64, (x, w, h)=>{ x.strokeStyle = '#ffffff'; x.lineWidth = 3; for (let i = 0; i <= w; i += 16){ x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke(); } }), transparent:true, side: THREE.DoubleSide, alphaTest:0.3});
  red.map.repeat.set(4, 2);
  const fondo = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 2.2), red); fondo.rotation.y = Math.PI/2; fondo.position.set(1.6*lado, 1.1, 0); g.add(fondo);
  const techo = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 5.2), red); techo.rotation.x = Math.PI/2; techo.position.set(0.8*lado, 2.2, 0); g.add(techo);
  for (const z of [-2.6, 2.6]){ const l = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.2), red); l.position.set(0.8*lado, 1.1, z); g.add(l); }
  return g;
}
function lineasCancha(p){
  const g = new THREE.Group(), bl = md('cal', '#ffffff', {roughness:0.8});
  const linea = (x, z, sx, sz)=>{ const m = new THREE.Mesh(new THREE.PlaneGeometry(sx, sz), bl); m.rotation.x = -Math.PI/2; m.position.set(x, 0.045, z); g.add(m); };
  linea(p.x, p.z - p.sz + 0.1, p.sx*2, 0.16); linea(p.x, p.z + p.sz - 0.1, p.sx*2, 0.16);
  linea(p.x - p.sx + 0.1, p.z, 0.16, p.sz*2); linea(p.x + p.sx - 0.1, p.z, 0.16, p.sz*2);
  linea(p.x, p.z, 0.16, p.sz*2);
  const c = new THREE.Mesh(new THREE.RingGeometry(2.9, 3.06, 48), bl); c.rotation.x = -Math.PI/2; c.position.set(p.x, 0.046, p.z); g.add(c);
  for (const lado of [1, -1]){
    const ax = p.x + lado*(p.sx - 2.5);
    linea(ax, p.z - 4, 5, 0.16); linea(ax, p.z + 4, 5, 0.16); linea(p.x + lado*(p.sx - 5), p.z, 0.16, 8.16);
    const pt = new THREE.Mesh(new THREE.CircleGeometry(0.18, 12), bl); pt.rotation.x = -Math.PI/2; pt.position.set(p.x + lado*(p.sx - 3.5), 0.046, p.z); g.add(pt);
  }
  return g;
}
function torreLuz(){
  const g = new THREE.Group(), gr = md('torreLuz', '#8a8a96', {metalness:0.6, roughness:0.4});
  const p = palo(gr, 0.18, 0.28, 12); p.position.y = 6; g.add(p);
  const panel = caja(gr, 2.4, 1.4, 0.3, 0, 12.4, 0); g.add(panel);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++){ g.add(bola(md('foco', '#ffffff', {emissive:'#ffffe0', emissiveIntensity:1.2}), 0.25, -0.75 + i*0.75, 12.1 + j*0.6, 0.2, 1, 1, 0.4)); }
  return g;
}
function coliseo(cx, cz, r){
  /* el Coliseo: anillo de arcos de dos pisos, roto de un lado y abierto hacia la isla */
  const g = new THREE.Group();
  const m = std('#ffffff', {map: (()=>{ const t = lienzo(256, 256, (x, w, h)=>{
    x.fillStyle = '#d8c09a'; x.fillRect(0, 0, w, h);
    for (let j = 0; j < 2; j++) for (let i = 0; i < 4; i++){ x.fillStyle = '#7a5a3a'; const cx2 = (i + 0.5)*w/4, cy = j*h/2 + h*0.3; x.beginPath(); x.arc(cx2, cy, 18, Math.PI, 0); x.lineTo(cx2 + 18, cy + 50); x.lineTo(cx2 - 18, cy + 50); x.fill(); }
    x.fillStyle = '#c8b08a'; x.fillRect(0, h/2 - 6, w, 12); x.fillRect(0, h - 10, w, 10);
  }); t.repeat.set(10, 1); return t; })(), roughness:0.85, side: THREE.DoubleSide});
  const n = 28;
  for (let i = 0; i < n; i++){
    const a = i/n*TAU;
    const abierto = Math.abs(((a - Math.PI*1.5 + Math.PI*3) % TAU) - Math.PI) < 0.5;   // la entrada mira a la isla principal
    if (abierto) continue;
    const roto = Math.sin(a*1.7) > 0.55;
    const alto = roto ? 3.2 : 5.5;
    const ancho = TAU*r/n + 0.05;
    const p = new THREE.Mesh(new THREE.PlaneGeometry(ancho, alto), m);
    p.position.set(cx + Math.sin(a)*r, 0.6 + alto/2, cz + Math.cos(a)*r); p.rotation.y = a; g.add(p);
  }
  return g;
}
function casaVenecia(R, alto){
  const g = new THREE.Group();
  const c = ['#e88a5a', '#f2c84a', '#e86a6a', '#8ac8e8', '#f0a0c0'][Math.floor(R()*5)];
  const t = lienzo(128, 256, (x, w, h)=>{ ventanas(x, w, h, c, '#3a2a2a', 2, 4, '#ffffff'); }, false);
  const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(2.2, alto, 1.8), new THREE.MeshStandardMaterial({map: t, roughness:0.8})); cuerpo.position.y = alto/2; cuerpo.castShadow = true; g.add(cuerpo);
  const techo = caja(md('tejaRoja', '#b8483a'), 2.4, 0.25, 2, 0, alto + 0.12, 0); g.add(techo);
  return g;
}
function pizzaDeco(){
  const g = new THREE.Group();
  const geo = new THREE.CylinderGeometry(1.4, 1.4, 0.25, 3, 1, false, 0, Math.PI/3.2);
  const p = new THREE.Mesh(geo, [MOD.matSuelo('pizza').lado, MOD.matSuelo('pizza').top, MOD.matSuelo('pizza').lado]); p.position.y = 0.13; g.add(p);
  return g;
}
function paifang(){
  /* la puerta china roja con techito verde */
  const g = new THREE.Group(), rj = md('rojoPagoda', '#d8262a');
  for (const x of [-2.4, 2.4]){ const c = palo(rj, 0.25, 0.28, 4.2); c.position.set(x, 2.1, 0); g.add(c); }
  g.add(caja(rj, 5.6, 0.4, 0.5, 0, 3.6, 0));
  g.add(caja(oro(), 2.2, 0.7, 0.1, 0, 3.0, 0.26));
  const t = techoChino(3.4); t.scale.set(1, 0.6, 0.35); t.position.y = 4.1; g.add(t);
  return g;
}
function cerezo(R){
  const g = MOD.arbol(R, 0.8 + R()*0.4);
  g.traverse(o=>{ if (o.isMesh && o.material && o.material.color){ const c = o.material.color; if (c.g > c.r){ o.material = o.material.clone(); o.material.color.set('#ffb0d0').convertSRGBToLinear(); } } });
  return g;
}
function cipres(R){
  const g = new THREE.Group();
  const t = palo(md('troncoC', '#6a4a2a'), 0.12, 0.16, 1); t.position.y = 0.5; g.add(t);
  const c = bola(md('cipres', '#2a6a3a', {roughness:0.9}), 0.7, 0, 2.6, 0, 1, 3, 1); g.add(c);
  g.scale.setScalar(0.8 + R()*0.5);
  return g;
}

/* ---------------- los pisos pintados (calle, piazza, cancha) ---------------- */
MOD.piso = function(p){
  const g = new THREE.Group();
  const mat = MOD.matSuelo(p.mat).top.clone();
  if (mat.map){ mat.map = mat.map.clone(); mat.map.needsUpdate = true; mat.map.repeat.set(p.sx*2/3.2, p.sz*2/3.2); }
  const m = new THREE.Mesh(new THREE.PlaneGeometry(p.sx*2, p.sz*2), mat); m.rotation.x = -Math.PI/2; m.position.set(p.x, 0.035, p.z); m.receiveShadow = true; g.add(m);
  if (p.mat === 'asfalto'){
    const am = md('rayaAm', '#ffd23f');
    for (let x = -p.sx + 1; x < p.sx; x += 3){ const r = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.14), am); r.rotation.x = -Math.PI/2; r.position.set(p.x + x, 0.045, p.z); g.add(r); }
    const bl = md('cal', '#ffffff');
    for (let x = -p.sx + 4; x < p.sx - 2; x += 10) for (let k = 0; k < 6; k++){ const c = new THREE.Mesh(new THREE.PlaneGeometry(0.4, p.sz*2 - 0.4), bl); c.rotation.x = -Math.PI/2; c.position.set(p.x + x + k*0.7, 0.04, p.z); g.add(c); }
  }
  if (p.mat === 'cancha') g.add(lineasCancha(p));
  return g;
};

/* ---------------- la pelota y los Balones de Oro ---------------- */
MOD.pelota = function(){
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 16), MOD.matSuelo('balon').top); b.castShadow = true; g.add(b);
  g.userData.bola = b;
  return g;
};
MOD.balonOro = function(){
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), std('#ffffff', {map: MOD.tex('balonOro'), metalness:0.8, roughness:0.25, emissive:'#8a5a00', emissiveIntensity:0.35}));
  m.castShadow = true;
  return m;
};

/* ---------------- los adornos de cada país ----------------
   devuelve una función que anima lo que se mueve (o null) */
MOD.decorarPais = function(id, grupo, M, R, poner){
  const def = M.def, anim = [];
  const sobre = (o, x, z)=>{ const y = window.F3D.suelo(M, x, z, 100, 0).y; o.position.set(x, isFinite(y) ? y : 0, z); grupo.add(o); return o; };
  if (id === 'maracaibo'){
    /* el puente: las torres en forma de A y los cables */
    const bl = md('pilar', '#f0f0f4', {roughness:0.5});
    for (const px of [27, 38]){
      for (const lado of [1, -1]){ const pata = palo(bl, 0.28, 0.4, 10.5); pata.position.set(px, 3.3, -6 + lado*2.5); pata.rotation.x = -0.18*lado; grupo.add(pata); }
      grupo.add(caja(bl, 0.6, 0.6, 2.2, px, 8.4, -6));
      const cab = md('cable', '#d8d8e0', {metalness:0.6, roughness:0.3});
      for (const d of [-5, -3.5, -2, 2, 3.5, 5]){
        const a = new THREE.Vector3(px, 8.2, -6), b = new THREE.Vector3(px + d, 1.5, -6);
        const len = a.distanceTo(b), c = palo(cab, 0.03, 0.03, len, 4); c.position.copy(a).add(b).multiplyScalar(0.5);
        c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()); grupo.add(c);
      }
    }
    for (let x = 22; x <= 44; x += 2.2) for (const lado of [1, -1]){ const b = palo(md('baranda', '#e8262a'), 0.04, 0.04, 0.7); b.position.set(x, 1.75, -6 + lado*1.7); grupo.add(b); }
    for (const lado of [1, -1]){ const b = palo(md('baranda', '#e8262a'), 0.05, 0.05, 22.8); b.rotation.z = Math.PI/2; b.position.set(32.6, 2.1, -6 + lado*1.7); grupo.add(b); }
    /* el Lago con sus balancines y torres petroleras */
    for (const [x, z] of [[-34, -8], [-30, 30], [24, 26], [36, -30], [-12, -34], [8, -30]]){
      const base = caja(md('baseP', '#5a5a62'), 4, 0.6, 4, x, -0.4, z); grupo.add(base);
      const b = balancin(); b.position.set(x, -0.1, z); b.rotation.y = R()*TAU; grupo.add(b); anim.push(t=>{ b.userData.viga.rotation.z = Math.sin(t*1.3 + x)*0.3; });
      if (R() < 0.6){ const tr = torrePetrolera(); tr.position.set(x + 1.4, -0.1, z + 1.4); grupo.add(tr); }
    }
    /* el letrero de colores */
    const l = letrasCartel('MARACAIBO', ['#e8262a', '#ffd23f', '#3a8aff', '#3ae05a', '#ff7ab0'], 1.6); l.position.set(6, 0, -18.5); l.rotation.y = -0.15; grupo.add(l);
    const bv = bandera(['#ffd23f', '#1a3a9a', '#e8262a'], false, 'vzla'); sobre(bv, 3, 12); anim.push(t=>ondear(bv, t));
    const bz = bandera(['#3a8aff', '#ffffff', '#3a8aff'], false); sobre(bz, -3, 12); anim.push(t=>ondear(bz, t + 1));
    return {anim, relampago: true};
  }
  if (id === 'usa'){
    /* los taxis amarillos que pasan por la avenida */
    for (let i = 0; i < 4; i++){
      const t = taxi(); grupo.add(t);
      const carril = i % 2 ? 5 : 7, dir = i % 2 ? 1 : -1, f = i*11;
      anim.push(tt=>{ const u = ((tt*4 + f)*dir % 44 + 44) % 44 - 22; t.position.set(u, 0.04, carril); t.rotation.y = dir > 0 ? 0 : Math.PI; });
    }
    const b1 = bandera(['#e8262a', '#ffffff', '#e8262a', '#ffffff', '#e8262a', '#ffffff', '#e8262a'], false, 'usa'); sobre(b1, -3, 12); anim.push(t=>ondear(b1, t));
    const b2 = bandera(['#e8262a', '#ffffff', '#e8262a', '#ffffff', '#e8262a', '#ffffff', '#e8262a'], false, 'usa'); sobre(b2, 3, 12); anim.push(t=>ondear(b2, t + 1));
    sobre(cohete(), 18, 13);
    const h = letrasCartel('HOLLYWOOD', ['#ffffff'], 7); h.position.set(30, 14, -150); h.rotation.y = -0.2; grupo.add(h);
    const cerro = new THREE.Mesh(new THREE.ConeGeometry(70, 40, 9), MOD.std('#7a9a5a', {flatShading:true, roughness:0.95})); cerro.position.set(30, -2, -175); grupo.add(cerro);
    const ny = letrasCartel('I♥NY', ['#1a1a1a', '#e8262a', '#1a1a1a', '#1a1a1a'], 1.4); ny.position.set(-6, 0, -18); ny.rotation.y = 0.3; grupo.add(ny);
    return {anim};
  }
  if (id === 'italia'){
    grupo.add(coliseo(31, -8, 9.4));
    for (let i = 0; i < 12; i++){ const a = i/12*TAU; const c = casaVenecia(R, 3 + R()*2.5); c.position.set(Math.sin(a)*6.8, 0.6, 36 + Math.cos(a)*6.8); c.rotation.y = a + Math.PI; if (Math.cos(a) < -0.7) continue; grupo.add(c); }
    for (let i = 0; i < 6; i++){ const p = pizzaDeco(); sobre(p, -6 + i*1.6, -2 + (i % 2)*1.5); p.rotation.y = R()*TAU; }
    const bi = bandera(['#2aa84a', '#ffffff', '#e8262a'], true); sobre(bi, -4, 12); anim.push(t=>ondear(bi, t));
    const l = letrasCartel('ITALIA', ['#2aa84a', '#ffffff', '#e8262a'], 1.5); l.position.set(10, 0, -16); l.rotation.y = -0.4; grupo.add(l);
    return {anim};
  }
  if (id === 'china'){
    const p = paifang(); p.position.set(0, 0, 13); grupo.add(p);
    for (const [x, z] of [[-6, 8], [8, 14], [-18, -2], [6, -16], [-20, 10]]){ const pa = panda(R); sobre(pa, x, z); pa.rotation.y = R()*TAU; }
    for (let i = 0; i < 14; i++){
      const f = farol(); const a = R()*TAU, r = 4 + R()*16, y0 = 3 + R()*6;
      f.position.set(Math.sin(a)*r, y0, Math.cos(a)*r); grupo.add(f);
      anim.push(t=>{ f.position.y = y0 + Math.sin(t*0.9 + a*3)*0.4; f.rotation.y = t*0.3 + a; });
    }
    const d = dragonVolador(); grupo.add(d);
    anim.push(t=>{ d.userData.seg.forEach((s, i)=>{ const u = t*0.35 - i*0.05; s.position.set(Math.sin(u)*34, 16 + Math.sin(u*3 + i*0.6)*2.2, Math.cos(u)*34 - 6); }); const s0 = d.userData.seg[0], s1 = d.userData.seg[1]; s0.lookAt(s0.position.clone().multiplyScalar(2).sub(s1.position)); });
    const bc = bandera(['#e8262a'], false, 'china'); sobre(bc, 4, 13); anim.push(t=>ondear(bc, t));
    return {anim};
  }
  if (id === 'argentina'){
    for (const lado of [1, -1]){ const a = arco(lado); a.position.set(lado*16, 0.03, -2); grupo.add(a); }
    for (const [x, z] of [[16, -12], [-16, -12], [16, 8], [-16, 8]]){ const b = palo(md('poste', '#ffffff'), 0.04, 0.04, 1.4); b.position.set(x, 0.7, z); grupo.add(b);
      const ba = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.35), md('banderin', '#ffd23f', {side: THREE.DoubleSide})); ba.position.set(x + 0.25, 1.25, z); grupo.add(ba); }
    for (const [x, z] of [[-19, -14], [19, -14], [-19, 10], [19, 10]]) sobre(torreLuz(), x, z);
    for (const [x, z, k] of [[-6, 20, 0], [6, 20, 1], [-26, 0, 2], [26, -10, 3]]){ const b = bandera(['#6ac8ff', '#ffffff', '#6ac8ff'], false, 'arg'); sobre(b, x, z); anim.push(t=>ondear(b, t + k)); }
    const l = letrasCartel('ARGENTINA', ['#6ac8ff', '#ffffff'], 1.5); l.position.set(0, 3.3, -23.4); grupo.add(l);
    const g10 = letrasCartel('10', ['#ffd23f'], 3); g10.position.set(-22, 0, 16); g10.rotation.y = 0.8; grupo.add(g10);
    return {anim};
  }
  return null;
};
/* para el Reino Pichunite (reino.js) */
Object.assign(MOD, {letrasCartel, cartelPais: cartel, banderaPais: bandera, ondearBandera: ondear, cajaDeco: caja});
/* adornos que se reparten por el pasto */
MOD.decoPais = {palmeras: MOD.palmera, cipreses: cipres, bambu: bambu, cerezos: cerezo};
})();
