(function(){
'use strict';
/* ============================================================
   LA VISTA de Salomón y los Primos — La Gran Aventura del Lago
   Arma el mundo de cada nivel con los gráficos (graficos.js),
   mueve la cámara, lee los controles, dibuja el marcador y los
   menús (tienda, álbum, amigos), suena y habla, y comparte la
   partida con los amigos (red.js).
   ============================================================ */
const THREE = window.THREE, S = window.SALO, GFX = window.SALO_GFX, RED = window.SALO_RED || null, VOCES = window.SALO_VOCES || {};
S.registrarNiveles(window.SALO_NIVELES);
const clamp = S.clamp, lerp = S.lerp;

/* ---------------- guardar ---------------- */
const CLAVE = 'salomon3d.v2';
let P = S.progresoNuevo();
try{ P = S.progresoLimpio(JSON.parse(localStorage.getItem(CLAVE) || 'null')); }catch(e){}
const OPC = {calidad: 'auto', musica: true, voces: true};
try{ Object.assign(OPC, JSON.parse(localStorage.getItem('salomon3d.opciones') || '{}')); }catch(e){}
function guardar(){ try{ localStorage.setItem(CLAVE, JSON.stringify(P)); localStorage.setItem('salomon3d.opciones', JSON.stringify(OPC)); }catch(e){} }
setInterval(guardar, 10000);
addEventListener('pagehide', guardar);

/* ---------------- el dibujante ---------------- */
const gl = document.getElementById('gl'), hud = document.getElementById('hud'), ctx = hud.getContext('2d');
const renderer = new THREE.WebGLRenderer({canvas: gl, antialias: true, powerPreference: 'high-performance'});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const escena = new THREE.Scene();
const camara = new THREE.PerspectiveCamera(58, 1, 0.1, 900);
let W = 1, H = 1, DPR = 1;
/* calidad: alta, media o baja; en "auto" baja sola si el aparato no da los cuadros */
const CAL = {nivel: OPC.calidad === 'auto' ? (matchMedia('(pointer:coarse)').matches ? 'media' : 'alta') : OPC.calidad, fps: 60, medido: 0, bajadas: 0};
function aplicarCalidad(){
  const q = CAL.nivel;
  const tope = q === 'alta' ? 2 : q === 'media' ? 1.4 : 1;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, tope));
  renderer.shadowMap.enabled = q !== 'baja';
  sol.castShadow = q !== 'baja';
  sol.shadow.mapSize.set(q === 'alta' ? 2048 : 1024, q === 'alta' ? 2048 : 1024);
  if (sol.shadow.map){ sol.shadow.map.dispose(); sol.shadow.map = null; }
  escena.traverse(o=>{ if (o.material){ const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m=>m.needsUpdate = true); } });
  ajustar();
}
function ajustar(){
  W = innerWidth; H = innerHeight; DPR = Math.min(devicePixelRatio || 1, 2);
  renderer.setSize(W, H); camara.aspect = W/H; camara.updateProjectionMatrix();
  hud.width = W*DPR; hud.height = H*DPR; hud.style.width = W + 'px'; hud.style.height = H + 'px';
  if (particulas) particulas.pts.material.uniforms.escala.value = H*renderer.getPixelRatio()*0.5;
}
addEventListener('resize', ajustar);
/* luces */
const cielo_luz = new THREE.HemisphereLight('#bfdcff', '#6b5a3a', 0.7);
const sol = new THREE.DirectionalLight('#fff4e0', 1.2);
sol.shadow.camera.left = -24; sol.shadow.camera.right = 24; sol.shadow.camera.top = 24; sol.shadow.camera.bottom = -24;
sol.shadow.camera.near = 1; sol.shadow.camera.far = 120; sol.shadow.bias = -0.0006; sol.shadow.normalBias = 0.03;
escena.add(cielo_luz, sol, sol.target);
let particulas = null, brillitos = null;

/* ---------------- sonidos ---------------- */
let ac = null, maestro = null;
function audio(){
  if (!ac){ try{ ac = new (window.AudioContext || window.webkitAudioContext)(); maestro = ac.createGain(); maestro.gain.value = 0.9; maestro.connect(ac.destination); }catch(e){} }
  if (ac && ac.state === 'suspended') ac.resume();
  if (!reproductor){ try{ reproductor = new Audio(); reproductor.preload = 'auto'; }catch(e){} }
}
function tono(f0, f1, dur, tipo, vol, cuando){
  if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain(), t = (cuando || ac.currentTime);
  o.type = tipo || 'square'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(vol || 0.07, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  o.connect(g); g.connect(maestro); o.start(t); o.stop(t + dur + 0.02);
}
let bufRuido = null;
function ruido(dur, vol, filtro, cuando){
  if (!ac) return;
  if (!bufRuido){ bufRuido = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = bufRuido.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random()*2 - 1; }
  const s = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter(), t = cuando || ac.currentTime;
  s.buffer = bufRuido; f.type = 'bandpass'; f.frequency.value = filtro || 1200; f.Q.value = 0.8;
  g.gain.setValueAtTime(vol || 0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  s.connect(f); f.connect(g); g.connect(maestro); s.start(t); s.stop(t + dur);
}
const sfx = {
  salto: pj=>tono(pj === 'mollejuo' ? 200 : 330, pj === 'primo' ? 1000 : 720, 0.16, 'square', 0.05),
  doble: ()=>{ tono(600, 1400, 0.14, 'triangle', 0.06); },
  moneda: ()=>{ tono(988, 988, 0.06, 'square', 0.04); tono(1319, 1319, 0.16, 'square', 0.04, ac && ac.currentTime + 0.06); },
  chispa: ()=>{ [784, 988, 1175, 1568, 1976].forEach((f, i)=>tono(f, f, 0.18, 'triangle', 0.08, ac && ac.currentTime + i*0.08)); },
  cocada: ()=>{ tono(660, 880, 0.1, 'triangle', 0.07); tono(880, 1320, 0.12, 'triangle', 0.06, ac && ac.currentTime + 0.08); },
  barajita: ()=>{ [523, 659, 784, 1047, 1319].forEach((f, i)=>tono(f, f, 0.14, 'square', 0.05, ac && ac.currentTime + i*0.07)); },
  lastima: ()=>{ tono(400, 90, 0.35, 'sawtooth', 0.07); },
  pisoton: ()=>{ tono(220, 880, 0.12, 'square', 0.06); ruido(0.08, 0.1, 400); },
  vence: ()=>{ ruido(0.18, 0.12, 900); tono(500, 1500, 0.15, 'triangle', 0.05); },
  golpe: ()=>{ ruido(0.1, 0.16, 700); },
  pedrada: ()=>{ tono(520, 180, 0.1, 'triangle', 0.06); ruido(0.06, 0.05, 2500); },
  patada: ()=>{ ruido(0.18, 0.1, 1800); tono(300, 700, 0.14, 'sawtooth', 0.04); },
  panzazo: ()=>{ tono(120, 50, 0.35, 'sine', 0.3); ruido(0.25, 0.12, 300); },
  rompe: ()=>{ ruido(0.25, 0.2, 600); tono(180, 80, 0.2, 'square', 0.05); },
  boing: ()=>{ tono(180, 900, 0.3, 'sine', 0.14); },
  bandera: ()=>[523, 659, 784].forEach((f, i)=>tono(f, f, 0.12, 'square', 0.05, ac && ac.currentTime + i*0.1)),
  chapuzon: ()=>{ ruido(0.5, 0.2, 500); tono(300, 80, 0.3, 'sine', 0.08); },
  rayo: ()=>{ ruido(0.8, 0.35, 180); tono(80, 30, 0.6, 'sawtooth', 0.12); },
  canonazo: ()=>{ ruido(0.4, 0.3, 150); tono(90, 40, 0.3, 'sine', 0.25); },
  cambio: ()=>{ tono(500, 900, 0.1, 'triangle', 0.06); tono(900, 700, 0.08, 'triangle', 0.05, ac && ac.currentTime + 0.09); },
  jaula: ()=>{ tono(300, 250, 0.12, 'square', 0.05); ruido(0.1, 0.1, 2000); },
  rescate: ()=>{ [523, 659, 784, 1047].forEach((f, i)=>tono(f, f, 0.16, 'square', 0.06, ac && ac.currentTime + i*0.09)); },
  nivel: ()=>{ [523, 523, 523, 659, 784, 659, 784, 1047].forEach((f, i)=>tono(f, f, 0.16, 'square', 0.06, ac && ac.currentTime + i*0.13)); },
  portal: ()=>{ tono(200, 1600, 0.8, 'sine', 0.1); ruido(0.8, 0.08, 3000); },
  diana: ()=>{ tono(880, 1760, 0.2, 'square', 0.06); },
  rugido: ()=>{ tono(160, 60, 0.6, 'sawtooth', 0.12); ruido(0.5, 0.12, 250); },
  aterriza: ()=>ruido(0.08, 0.07, 500),
  menu: ()=>tono(700, 900, 0.05, 'square', 0.04),
  compra: ()=>{ tono(1319, 1319, 0.08, 'square', 0.05); tono(1760, 1760, 0.2, 'square', 0.05, ac && ac.currentTime + 0.08); },
};
/* la música: un ritmo alegre que se arma solo (bajo, acordes y maracas), distinto de día, de noche y con el jefe */
const MUS = {on: false, sig: 0, paso: 0, modo: 'dia'};
const ESCALAS = {dia: {base: 196, prog: [0, 7, 9, 5], tempo: 0.2, menor: false}, noche: {base: 174.6, prog: [0, 5, 7, 3], tempo: 0.26, menor: true}, jefe: {base: 146.8, prog: [0, 3, 5, 7], tempo: 0.15, menor: true}, vereda: {base: 220, prog: [0, 5, 7, 5], tempo: 0.22, menor: false}};
function musicaPaso(){
  if (!ac || !OPC.musica || estado === 'titulo' && !MUS.on) return;
  const E = ESCALAS[MUS.modo] || ESCALAS.dia;
  while (MUS.sig < ac.currentTime + 0.25){
    if (MUS.sig < ac.currentTime - 0.1) MUS.sig = ac.currentTime + 0.05;
    const i = MUS.paso % 16, compas = Math.floor(MUS.paso/16) % 4, raiz = E.base*Math.pow(2, E.prog[compas]/12);
    const tercera = E.menor ? 3 : 4, notas = [0, tercera, 7, 12];
    if (i % 4 === 0) tono(raiz/2, raiz/2, E.tempo*1.6, 'triangle', 0.05, MUS.sig);
    if (i % 4 === 2) tono(raiz/2*Math.pow(2, 7/12), raiz/2*Math.pow(2, 7/12), E.tempo*0.9, 'triangle', 0.035, MUS.sig);
    if (i % 2 === 1 || i === 0) tono(raiz*2*Math.pow(2, notas[(i*3 + compas) % 4]/12), raiz*2*Math.pow(2, notas[(i*3 + compas) % 4]/12), E.tempo*0.7, 'square', 0.012, MUS.sig);
    ruido(0.05, i % 4 === 2 ? 0.035 : 0.018, 6000, MUS.sig);           /* las maracas */
    if (i % 8 === 4) ruido(0.09, 0.05, 900, MUS.sig);                    /* la tambora */
    MUS.sig += E.tempo; MUS.paso++;
  }
}
/* ---------------- voces ---------------- */
let reproductor = null, hablando = false, voces = [];
const colaVoz = [];
const TONO = {salomon: {p: 1.5, r: 1.1}, primo: {p: 1.25, r: 1.2}, mollejuo: {p: 0.6, r: 0.95}, chinita: {p: 1.35, r: 0.95}, nublao: {p: 0.3, r: 0.8}, vecino: {p: 1.0, r: 1.1}, amigo: {p: 1.8, r: 1.15}, album: {p: 1, r: 1.1}, antena: {p: 1, r: 1.1}};
function cargarVoces(){ try{ voces = speechSynthesis.getVoices() || []; }catch(e){} }
if (typeof speechSynthesis !== 'undefined'){ cargarVoces(); try{ speechSynthesis.onvoiceschanged = cargarVoces; }catch(e){} }
function decir(texto, pj){
  if (!OPC.voces) return;
  const base = (pj || '').split(':')[0];
  const src = VOCES[base] && VOCES[base][texto];
  colaVoz.push({src, texto, pj: base}); if (colaVoz.length > 3) colaVoz.shift();
  reproducirVoz();
}
function reproducirVoz(){
  if (hablando) return;
  const s = colaVoz.shift(); if (!s) return;
  if (!s.src || !reproductor){ tts(s); return; }
  hablando = true; let sono = false;
  const fallar = ()=>{ if (sono) return; sono = true; try{ reproductor.pause(); }catch(e){} hablando = false; tts(s); };
  reproductor.onended = ()=>{ hablando = false; reproducirVoz(); }; reproductor.onerror = fallar; reproductor.onplaying = ()=>{ sono = true; };
  try{ reproductor.src = s.src; const p = reproductor.play(); if (p && p.catch) p.catch(fallar); }catch(e){ fallar(); }
  setTimeout(()=>{ if (!sono) fallar(); }, 2000);
}
function tts(s){
  if (typeof speechSynthesis === 'undefined'){ hablando = false; reproducirVoz(); return; }
  try{
    const u = new SpeechSynthesisUtterance(s.texto.replace(/[^\p{L}\p{N}\s¡!¿?,.'-]/gu, ''));
    const es = voces.filter(v=>v.lang && v.lang.toLowerCase().startsWith('es')); const v = es.find(v=>/es[-_](419|MX|US|CO|VE|AR)/i.test(v.lang)) || es[0];
    u.lang = v ? v.lang : 'es-ES'; if (v) u.voice = v;
    const t = TONO[s.pj] || TONO.vecino; u.pitch = t.p; u.rate = t.r;
    hablando = true; let listo = false; const fin = ()=>{ if (listo) return; listo = true; hablando = false; reproducirVoz(); };
    u.onend = fin; u.onerror = fin; setTimeout(fin, 1800 + s.texto.length*80);
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }catch(e){ hablando = false; reproducirVoz(); }
}
function callar(){ colaVoz.length = 0; try{ speechSynthesis.cancel(); }catch(e){} try{ if (reproductor) reproductor.pause(); }catch(e){} hablando = false; }

/* ============================================================
   ARMAR EL MUNDO DE UN NIVEL
   ============================================================ */
let G = null, M = null;   /* M = las mallas del nivel */
function armarMundo(){
  /* se suelta la memoria del nivel anterior (las geometrías compartidas se vuelven a subir solas si hacen falta) */
  if (M){ escena.remove(M.raiz); M.raiz.traverse(o=>{ if (o.geometry) o.geometry.dispose(); }); }
  const N = G.N, tema = N.tema.cielo, C = GFX.CIELOS[tema] || GFX.CIELOS.dia;
  const raiz = new THREE.Group();
  M = {raiz, cajas: new Map(), monedas: null, cocadas: [], barajitas: [], chispas: [], jaulas: [], dianas: [], enemigos: [], trampolines: [], banderas: [], npcs: [], animadas: [], peligros: [], jugador: {}, remotos: new Map(), balas: [], piedras: [], rayos: [], meta: null, jefe: null};
  escena.add(raiz);
  /* cielo, niebla, luces */
  escena.background = new THREE.Color(C.horizonte);
  escena.fog = new THREE.Fog(C.niebla, 45, C.lejos);
  M.cielo = GFX.crearCielo(tema); raiz.add(M.cielo);
  cielo_luz.color.set(C.amb); cielo_luz.groundColor.set(C.suelo); cielo_luz.intensity = C.ambF*0.5;
  sol.color.set(C.luz); sol.intensity = C.fuerza*0.36; M.dirSol = new THREE.Vector3(...C.solDir).normalize();
  renderer.toneMappingExposure = C.exp*0.92;
  if (N.agua !== undefined){ M.agua = GFX.crearAgua(tema, N.tema.agua, N.agua); raiz.add(M.agua); }
  /* las plataformas: las quietas se juntan; las que se mueven, rompen o abren van sueltas */
  const crudo = new THREE.Group(); raiz.add(crudo);
  for (const c of N.cajas){
    if (c.visible === false) continue;
    const m = GFX.mallaCaja(c);
    const dinamica = c.mueve || c.cae || c.rompible || c.rajada || c.puerta || c.empuja;
    if (dinamica){ m.userData.noJuntar = true; raiz.add(m); M.cajas.set(c, m); }
    else crudo.add(m);
  }
  /* los adornos */
  for (const d of N.deco){
    const m = GFX.modeloDeco(Object.assign({noche: tema === 'noche' || tema === 'tormenta'}, d));
    if (GFX.decoAnimada(d)){ m.userData.noJuntar = true; m.traverse(o=>o.userData.noJuntar = true); raiz.add(m); M.animadas.push(m); }
    else crudo.add(m);
  }
  raiz.add(GFX.juntarEstaticos(crudo));
  const pasto = GFX.crearPasto(N.cajas, N.id*13 + 1, tema === 'atardecer' ? '#7fb04a' : tema === 'noche' || tema === 'tormenta' ? '#3f7a4a' : '#6fcf4a', CAL.nivel === 'alta' ? 14000 : CAL.nivel === 'media' ? 6000 : 0); if (pasto) raiz.add(pasto);
  /* monedas: en instancias (dos mallas para todas) */
  const nm = N.monedas.length;
  if (nm){
    const base = GFX.modeloMoneda(); const cuerpo = base.children[0], borde = base.children[1];
    M.monedas = {cuerpo: new THREE.InstancedMesh(cuerpo.geometry, cuerpo.material, nm), borde: new THREE.InstancedMesh(borde.geometry, borde.material, nm)};
    M.monedas.cuerpo.castShadow = true; raiz.add(M.monedas.cuerpo, M.monedas.borde);
  }
  for (const c of N.cocadas){ const m = GFX.modeloCocada(); m.position.set(c.x, c.y, c.z); raiz.add(m); M.cocadas.push([c, m]); }
  for (const b of N.barajitas){ const m = GFX.modeloBarajita(b.id); m.position.set(b.x, b.y, b.z); raiz.add(m); M.barajitas.push([b, m]); }
  for (const j of N.jaulas){ const m = GFX.modeloJaula(j.amigo); m.position.set(j.x, j.y, j.z); raiz.add(m); M.jaulas.push([j, m]); }
  for (const d of N.dianas){ const m = GFX.modeloDiana(); m.position.set(d.x, d.y, d.z); raiz.add(m); M.dianas.push([d, m]); }
  for (const t of N.trampolines){ const m = GFX.modeloTrampolin(); m.position.set(t.x, t.y, t.z); raiz.add(m); M.trampolines.push([t, m]); }
  /* la bandera del inicio se corre un poquito para que no tape al jugador */
  for (const f of N.banderas){ const m = GFX.modeloBandera(); const cerca = Math.hypot(f.x - N.inicio.x, f.z - N.inicio.z) < 2.2; m.position.set(f.x + (cerca ? 2.4 : 0), f.y, f.z + (cerca ? -0.5 : 0)); if (cerca) m.position.y = S.sueloEn(N, m.position.x, m.position.z, f.y + 0.5) > -Infinity ? S.sueloEn(N, m.position.x, m.position.z, f.y + 0.5) : f.y; raiz.add(m); M.banderas.push([f, m]); }
  M.meta = GFX.modeloChispa(true); M.meta.visible = false; raiz.add(M.meta);
  /* chispas sueltas que aparecen al ganar (se muestran volando al marcador) */
  for (const e of N.enemigos){ const m = GFX.modeloEnemigo(e.tipo); raiz.add(m); M.enemigos.push([e, m]); }
  /* el jefe: su modelo sale del tipo del nivel (cangrejote, chivote…); G.jefe.tipo es cómo pelea */
  if (G.jefe){ const quien = N.jefe.tipo; M.jefe = GFX.modeloEnemigo(quien, quien === 'nublao' ? 2.6 : quien === 'zancudote' ? 2.8 : quien === 'capitan' ? 1.6 : 2.4); raiz.add(M.jefe); }
  for (const n of N.npcs){
    let m = null;
    if (n.quien === 'chinita') m = GFX.modeloPj('chinita');
    else if (n.quien === 'vecino') m = modeloVecino(n.id);
    if (m){ m.position.set(n.x, n.y, n.z); raiz.add(m); M.npcs.push([n, m]); }
    if (n.nombre && m){ const l = GFX.letrero(n.nombre, '#fff', 'rgba(20,30,60,.75)', 0.4); l.position.y = n.quien === 'chinita' ? 2.6 : 2.2; m.add(l); }
  }
  /* los peligros */
  for (const p of N.peligros){
    const g = new THREE.Group(); g.userData.noJuntar = true; raiz.add(g); M.peligros.push([p, g]);
    if (p.tipo === 'canon'){ const c = modeloCanon(); c.position.set(p.x, p.y, p.z); c.rotation.y = Math.atan2(p.dx || 0, p.dz || 1); g.add(c); }
    else if (p.tipo === 'chorro'){ const col = new THREE.Mesh(new THREE.CylinderGeometry(p.r || 1.2, p.r || 1.2, p.alto || 8, 16, 1, true), new THREE.ShaderMaterial({uniforms: {tiempo: GFX.U.tiempo}, transparent: true, depthWrite: false, side: THREE.DoubleSide, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0); }', fragmentShader: 'uniform float tiempo; varying vec2 vUv; void main(){ float f = fract(vUv.y*4.0 - tiempo*1.8 + sin(vUv.x*25.0)*0.1); gl_FragColor = vec4(0.85, 0.97, 1.0, (0.08 + f*0.18)*(1.0 - vUv.y)); }'})); col.position.set(p.x, p.y + (p.alto || 8)/2, p.z); g.add(col); }
    else if (p.tipo === 'pinchos'){ const pin = new THREE.Group(); for (let x = -p.w/2 + 0.25; x < p.w/2; x += 0.5) for (let z = -p.d/2 + 0.25; z < p.d/2; z += 0.5) GFX.cilindro(pin, '#ced4da', 0.01, 0.16, 0.6, x, 0.3, z, {lados: 5}); pin.position.set(p.x, p.y - 0.6, p.z); g.add(pin); g.userData.pinchos = pin; GFX.pieza(g, '#495057', p.w, 0.1, p.d, p.x, p.y + 0.02, p.z, {r: 0.02}); }
    else if (p.tipo === 'fuego'){ GFX.cilindro(g, '#495057', 0.5, 0.6, 0.4, p.x, p.y + 0.2, p.z, {lados: 10}); }
  }
  /* el jugador (los tres modelos, se muestra el que juega) y su sombra de mentira bajo los pies */
  for (const pj of S.ORDEN_PJS){ const m = GFX.modeloPj(pj, P.puesto); m.visible = false; raiz.add(m); M.jugador[pj] = m; }
  M.puestoClave = JSON.stringify(P.puesto);
  const sombra = new THREE.Mesh(new THREE.CircleGeometry(0.42, 20), new THREE.MeshBasicMaterial({color: '#000', transparent: true, opacity: 0.28, depthWrite: false}));
  sombra.rotation.x = -Math.PI/2; sombra.renderOrder = 2; raiz.add(sombra); M.sombra = sombra;
  /* partículas */
  particulas = GFX.crearParticulas(1400, false); raiz.add(particulas.pts);
  brillitos = GFX.crearParticulas(700, true); raiz.add(brillitos.pts);
  ajustar();
  M.lluvia = C.lluvia; M.noche = tema === 'noche' || tema === 'tormenta';
  M.relampagoT = 0;
  cam.yaw = G.camYaw; cam.pos = null;
}
/* un vecino de Maracaibo: persona de bloques con ropa de colores */
function modeloVecino(semilla){
  let s = 0; for (const ch of String(semilla)) s = (s*31 + ch.charCodeAt(0)) % 9973;
  const ropa = ['#e63946', '#4fc3f7', '#ffd23f', '#7dffa0', '#ff6ec0', '#ff8a3d', '#c07dff', '#ffffff'][s % 8], piel = ['#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#ffdbac'][s % 5], pelo = ['#2a1a0a', '#5a3a1a', '#111', '#c8a040', '#8b2a2a'][s % 5];
  const g = new THREE.Group(), c = new THREE.Group(); g.add(c);
  GFX.pieza(c, '#495057', 0.2, 0.5, 0.26, -0.13, 0.25, 0); GFX.pieza(c, '#495057', 0.2, 0.5, 0.26, 0.13, 0.25, 0);
  GFX.pieza(c, ropa, 0.58, 0.6, 0.34, 0, 0.8, 0);
  GFX.pieza(c, ropa, 0.15, 0.5, 0.16, -0.38, 0.8, 0); GFX.pieza(c, ropa, 0.15, 0.5, 0.16, 0.38, 0.8, 0);
  GFX.pieza(c, piel, 0.46, 0.44, 0.42, 0, 1.33, 0); GFX.pieza(c, pelo, 0.5, 0.14, 0.46, 0, 1.56, -0.02);
  for (const k of [-1, 1]){ GFX.pieza(c, '#fff', 0.1, 0.12, 0.03, k*0.1, 1.36, 0.21, {r: 0.02, mat: GFX.brillo('#ffffff')}); GFX.pieza(c, '#222', 0.05, 0.07, 0.02, k*0.1, 1.35, 0.23, {r: 0.01, mat: GFX.brillo('#222222')}); }
  if (s % 3 === 0){ GFX.cilindro(c, '#f4e3c1', 0.45, 0.45, 0.05, 0, 1.64, 0, {lados: 16}); GFX.cilindro(c, '#f4e3c1', 0.22, 0.24, 0.2, 0, 1.74, 0); }
  GFX.optimizar(c, []);
  g.userData = {c};
  return g;
}
function modeloCanon(){
  const g = new THREE.Group();
  GFX.pieza(g, '#6b3a1a', 1.2, 0.5, 1.4, 0, 0.25, 0, {r: 0.08});
  const tubo = GFX.cilindro(g, '#343a40', 0.28, 0.36, 1.6, 0, 0.75, 0.3, {lados: 12}); tubo.rotation.x = Math.PI/2 - 0.35;
  for (const s of [-1, 1]){ const r = GFX.cilindro(g, '#495057', 0.35, 0.35, 0.12, s*0.66, 0.35, 0, {lados: 12}); r.rotation.z = Math.PI/2; }
  GFX.optimizar(g, []);
  return g;
}
function modeloCarro(ci){
  const g = new THREE.Group(), col = ['#f03e3e', '#fab005', '#1c7ed6', '#f8f9fa', '#37b24d', '#ae3ec9', '#212529', '#ff922b'][ci % 8];
  GFX.pieza(g, col, 1.9, 0.7, 3.8, 0, 0.55, 0, {r: 0.2}); GFX.pieza(g, col, 1.6, 0.6, 2, 0, 1.15, 0.2, {r: 0.2});
  GFX.pieza(g, '#a5d8ff', 1.62, 0.42, 1.6, 0, 1.18, 0.2, {r: 0.1, mat: GFX.brillo('#9fd0f0', 0.9)});
  for (const [x, z] of [[-0.9, -1.2], [0.9, -1.2], [-0.9, 1.2], [0.9, 1.2]]){ const r = GFX.cilindro(g, '#111', 0.36, 0.36, 0.3, x, 0.36, z, {lados: 14}); r.rotation.z = Math.PI/2; }
  for (const s of [-1, 1]){ GFX.pieza(g, '#fff9db', 0.34, 0.2, 0.06, s*0.6, 0.62, -1.9, {r: 0.04, mat: GFX.brillo('#fff9db', 1.4)}); GFX.pieza(g, '#ff2020', 0.3, 0.16, 0.06, s*0.65, 0.62, 1.9, {r: 0.04, mat: GFX.brillo('#ff3030', 1.2)}); }
  GFX.optimizar(g, []);
  return g;
}

/* ============================================================
   LA CÁMARA: detrás del jugador, se gira arrastrando a la derecha
   ============================================================ */
const cam = {yaw: 0, pitch: 0.36, dist: 8.2, pos: null, mira: new THREE.Vector3(), manualT: 0, sacude: 0};
function pasoCamara(dt){
  const J = G.J;
  const objetivo = new THREE.Vector3(J.x, J.y + 1.3, J.z);
  /* si camina y no se ha tocado la cámara hace rato, se acomoda sola detrás, despacito */
  cam.manualT -= dt;
  if (cam.manualT <= 0 && J.anda > 1.5 && G.fase === 'jugando'){
    const detras = J.ang + Math.PI; let d = S.envolver(detras - cam.yaw);
    if (Math.abs(d) < 2.4) cam.yaw += d*Math.min(1, dt*0.9*(J.anda/7));
  }
  const dist = cam.dist*(G.n === 0 ? 1.1 : 1) + (J.pj === 'mollejuo' ? 0.6 : 0);
  const dir = new THREE.Vector3(Math.sin(cam.yaw)*Math.cos(cam.pitch), Math.sin(cam.pitch), Math.cos(cam.yaw)*Math.cos(cam.pitch));
  /* que la cámara no se meta dentro de las paredes */
  let d = dist;
  for (let k = 1; k <= 14; k++){
    const t = k/14*dist, x = objetivo.x + dir.x*t, y = objetivo.y + dir.y*t, z = objetivo.z + dir.z*t;
    let dentro = false;
    for (const c of G.N.cajas){ if (c.solido && c.visible !== false && x > c.x0 - 0.2 && x < c.x1 + 0.2 && y > c.y0 - 0.2 && y < c.y1 + 0.2 && z > c.z0 - 0.2 && z < c.z1 + 0.2){ dentro = true; break; } }
    if (dentro){ d = Math.max(1.6, t - 0.5); break; }
  }
  const deseada = objetivo.clone().addScaledVector(dir, d);
  if (!cam.pos) cam.pos = deseada.clone(); else cam.pos.lerp(deseada, Math.min(1, dt*(d < dist - 0.5 ? 14 : 6)));
  cam.mira.lerp(objetivo, cam.mira.lengthSq() ? Math.min(1, dt*10) : 1);
  camara.position.copy(cam.pos);
  if (cam.sacude > 0){ cam.sacude -= dt; const k = cam.sacude*0.5; camara.position.x += (Math.random() - 0.5)*k; camara.position.y += (Math.random() - 0.5)*k; }
  camara.lookAt(cam.mira);
  /* la luz del sol sigue al jugador (con las sombras bien quietas: se ajusta a la cuadrícula de la sombra) */
  const paso = 48/sol.shadow.mapSize.x;
  const cx = Math.round(J.x/paso)*paso, cz = Math.round(J.z/paso)*paso;
  sol.position.set(cx + M.dirSol.x*50, J.y + M.dirSol.y*50, cz + M.dirSol.z*50);
  sol.target.position.set(cx, J.y, cz);
}

/* ============================================================
   CONTROLES
   ============================================================ */
const teclas = {}, pulsadas = new Set();
let tactil = matchMedia('(pointer:coarse)').matches;
addEventListener('keydown', e=>{
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Tab'].includes(e.key)) e.preventDefault();
  const k = e.key.toLowerCase(); audio();
  if (UI.escribiendo && estado === 'menu'){ teclaCodigo(e.key); return; }
  teclas[k] = true; if (!e.repeat) pulsadas.add(k);
  if (e.repeat) return;
  if (estado === 'menu' || estado === 'titulo'){ teclaMenu(k); return; }
  if (k === 'escape' || k === 'p') abrirMenu('pausa');
});
addEventListener('keyup', e=>{ teclas[e.key.toLowerCase()] = false; });
addEventListener('blur', ()=>{ for (const k in teclas) teclas[k] = false; TOQUE.palanca = null; TOQUE.camara = null; TOQUE.botones.clear(); });
for (const ev of ['gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(ev, e=>e.preventDefault());
document.addEventListener('touchmove', e=>e.preventDefault(), {passive: false});
document.addEventListener('contextmenu', e=>e.preventDefault());
const TOQUE = {palanca: null, camara: null, botones: new Map(), raton: null};
const BOTONES = [
  {k: 'a', txt: 'A', sub: 'saltar', color: 'rgba(255,110,90,.5)', r: 44, pos: ()=>({x: W - 62, y: H - 108})},
  {k: 'b', txt: 'B', sub: 'poder', color: 'rgba(100,160,255,.5)', r: 38, pos: ()=>({x: W - 150, y: H - 52})},
  {k: 'c', txt: '', sub: 'cambiar', color: 'rgba(255,210,80,.5)', r: 32, pos: ()=>({x: W - 58, y: H - 214})},
];
const BOTON_PAUSA = {x: ()=>W - 34, y: ()=>34, r: 22};
function botonEn(x, y){
  if (!tactil || estado !== 'juego') return null;
  let mejor = null, md = 1e9;
  for (const b of BOTONES){ const p = b.pos(), d = Math.hypot(x - p.x, y - p.y); if (d < b.r*1.5 && d < md){ md = d; mejor = b; } }
  return mejor;
}
document.addEventListener('pointerdown', ev=>{
  audio();
  if (ev.pointerType === 'touch') tactil = true;
  const x = ev.clientX, y = ev.clientY;
  if (estado === 'menu' || estado === 'titulo'){ clicMenu(x, y); ev.preventDefault(); return; }
  if (estado !== 'juego') return;
  if (Math.hypot(x - BOTON_PAUSA.x(), y - BOTON_PAUSA.y()) < BOTON_PAUSA.r*1.6){ abrirMenu('pausa'); return; }
  const b = botonEn(x, y);
  if (b){ TOQUE.botones.set(ev.pointerId, b); pulsadas.add('toque_' + b.k); ev.preventDefault(); return; }
  if (ev.pointerType === 'mouse'){ TOQUE.raton = {id: ev.pointerId, x, y}; return; }
  if (x < W*0.45 && !TOQUE.palanca){ TOQUE.palanca = {id: ev.pointerId, x0: x, y0: y, x, y}; ev.preventDefault(); return; }
  if (!TOQUE.camara){ TOQUE.camara = {id: ev.pointerId, x, y}; ev.preventDefault(); }
}, true);
document.addEventListener('pointermove', ev=>{
  if (TOQUE.palanca && TOQUE.palanca.id === ev.pointerId){ TOQUE.palanca.x = ev.clientX; TOQUE.palanca.y = ev.clientY; }
  else if (TOQUE.camara && TOQUE.camara.id === ev.pointerId){ const dx = ev.clientX - TOQUE.camara.x, dy = ev.clientY - TOQUE.camara.y; cam.yaw -= dx*0.008; cam.pitch = clamp(cam.pitch + dy*0.004, 0.08, 1.0); cam.manualT = 2.5; TOQUE.camara.x = ev.clientX; TOQUE.camara.y = ev.clientY; }
  else if (TOQUE.raton && TOQUE.raton.id === ev.pointerId){ const dx = ev.clientX - TOQUE.raton.x, dy = ev.clientY - TOQUE.raton.y; cam.yaw -= dx*0.006; cam.pitch = clamp(cam.pitch + dy*0.003, 0.08, 1.0); cam.manualT = 2.5; TOQUE.raton.x = ev.clientX; TOQUE.raton.y = ev.clientY; }
}, true);
const soltar = ev=>{ if (TOQUE.palanca && TOQUE.palanca.id === ev.pointerId) TOQUE.palanca = null; if (TOQUE.camara && TOQUE.camara.id === ev.pointerId) TOQUE.camara = null; if (TOQUE.raton && TOQUE.raton.id === ev.pointerId) TOQUE.raton = null; TOQUE.botones.delete(ev.pointerId); };
document.addEventListener('pointerup', soltar, true); document.addEventListener('pointercancel', soltar, true);
addEventListener('wheel', e=>{ cam.dist = clamp(cam.dist + e.deltaY*0.005, 5, 13); }, {passive: true});
const tocado = k=>{ for (const b of TOQUE.botones.values()) if (b.k === k) return true; return false; };
/* mandos */
const MANDO = {prev: {}};
function leerMando(){
  const r = {jx: 0, jy: 0, cx: 0, cy: 0, a: false, aP: false, bP: false, cP: false, startP: false, arriba: false, abajo: false, izq: false, der: false};
  if (!navigator.getGamepads) return r;
  let gps; try{ gps = navigator.getGamepads(); }catch(e){ return r; }
  for (const gp of gps || []){
    if (!gp || !gp.connected) continue;
    const z = v=>Math.abs(v) > 0.15 ? Math.sign(v)*(Math.abs(v) - 0.15)/0.85 : 0;
    r.jx += z(gp.axes[0] || 0); r.jy -= z(gp.axes[1] || 0); r.cx += z(gp.axes[2] || 0); r.cy += z(gp.axes[3] || 0);
    const p = i=>{ const b = gp.buttons[i]; return !!(b && (b.pressed || b.value > 0.5)); };
    if (p(14)) r.jx -= 1; if (p(15)) r.jx += 1; if (p(12)) r.jy += 1; if (p(13)) r.jy -= 1;
    const fl = (i, c)=>{ const v = p(i), k = gp.index + ':' + i; if (v && !MANDO.prev[k]) r[c] = true; MANDO.prev[k] = v; return v; };
    if (fl(0, 'aP')) r.a = true; fl(1, 'bP'); fl(2, 'bP'); fl(7, 'bP'); fl(3, 'cP'); fl(4, 'cP'); fl(5, 'cP'); fl(9, 'startP');
    fl(12, 'arriba'); fl(13, 'abajo'); fl(14, 'izq'); fl(15, 'der');
  }
  return r;
}
function leerEntrada(dt){
  const m = leerMando();
  if (estado === 'menu' || estado === 'titulo'){
    if (m.arriba) teclaMenu('arrowup'); if (m.abajo) teclaMenu('arrowdown'); if (m.izq) teclaMenu('arrowleft'); if (m.der) teclaMenu('arrowright');
    if (m.aP || m.startP) teclaMenu('enter'); if (m.bP) teclaMenu('escape');
    pulsadas.clear(); return {};
  }
  if (m.startP) abrirMenu('pausa');
  let jx = m.jx, jy = m.jy;
  if (teclas['arrowleft'] || teclas['a']) jx -= 1; if (teclas['arrowright'] || teclas['d']) jx += 1;
  if (teclas['arrowup'] || teclas['w']) jy += 1; if (teclas['arrowdown'] || teclas['s']) jy -= 1;
  const p = TOQUE.palanca;
  if (p){ let dx = (p.x - p.x0)/55, dy = (p.y - p.y0)/55; const k = Math.hypot(dx, dy); if (k > 1){ dx /= k; dy /= k; p.x0 = p.x - dx*55; p.y0 = p.y - dy*55; } if (k > 0.1){ jx += dx; jy -= dy; } }
  if (m.cx || m.cy){ cam.yaw -= m.cx*dt*2.6; cam.pitch = clamp(cam.pitch + m.cy*dt*1.4, 0.08, 1.0); cam.manualT = 2.5; }
  if (teclas['q']){ cam.yaw += dt*2.2; cam.manualT = 2.5; } if (teclas['e']){ cam.yaw -= dt*2.2; cam.manualT = 2.5; }
  const ent = {
    jx, jy, camYaw: cam.yaw,
    saltar: !!(teclas[' '] || teclas['z'] || teclas['k'] || tocado('a') || (navigator.getGamepads && m.a)),
    saltoPulsado: pulsadas.has(' ') || pulsadas.has('z') || pulsadas.has('k') || pulsadas.has('toque_a') || m.aP,
    poder: pulsadas.has('x') || pulsadas.has('shift') || pulsadas.has('j') || pulsadas.has('toque_b') || m.bP,
    cambiar: pulsadas.has('c') || pulsadas.has('tab') || pulsadas.has('l') || pulsadas.has('toque_c') || m.cP,
  };
  if (m.a) ent.saltar = true;
  pulsadas.clear();
  return ent;
}

/* ============================================================
   EL FLUJO: título → la Vereda → portal → nivel → la Vereda
   ============================================================ */
let estado = 'titulo', cortina = 1, cortinaObj = 0, alTerminarCortina = null;
const subtitulos = [], avisos = [], brindis = [];
let cartel = null, tituloT = 0;
function entrarNivel(n, desdePortal){
  callar(); subtitulos.length = 0; avisos.length = 0; UI.cerca = null;
  G = S.crearPartida(n, P);
  if (n === 0 && desdePortal){ const p = G.N.portales.find(q=>q.nivel === desdePortal); if (p){ const k = 0.82; G.J.x = p.x*k; G.J.z = p.z*k; G.J.y = 0.3; G.J.ang = Math.atan2(-p.x, -p.z); G.camYaw = G.J.ang + Math.PI; } }
  armarMundo();
  estado = 'juego';
  cartel = {titulo: n === 0 ? 'LA VEREDA DEL LAGO' : 'NIVEL ' + n + ' · ' + G.N.nombre.toUpperCase(), sub: G.N.sub, t: 3.6};
  MUS.modo = n === 0 ? 'vereda' : (G.N.tema.cielo === 'noche' || G.N.tema.cielo === 'tormenta') ? 'noche' : 'dia';
  cortinaObj = 0;
  guardar();
}
function irA(n, desdePortal){ cortinaObj = 1; alTerminarCortina = ()=>entrarNivel(n, desdePortal); sfx.portal(); }

/* ---------------- lo que pasa en la partida → efectos, sonidos y textos ---------------- */
function efectoPolvo(x, y, z, k, color){ for (let i = 0; i < (k || 8); i++){ const a = Math.random()*Math.PI*2, v = 1 + Math.random()*2; particulas.emitir(x, y + 0.1, z, {vx: Math.cos(a)*v, vy: 0.6 + Math.random(), vz: Math.sin(a)*v, g: 1, vida: 0.5 + Math.random()*0.4, tam: 0.35, tam1: 0.9, color: color || '#e9e2d0', roce: 2}); } }
function efectoChispas(x, y, z, k, color, vel){ for (let i = 0; i < (k || 12); i++){ const a = Math.random()*Math.PI*2, b = Math.random()*Math.PI - Math.PI/2, v = (vel || 4)*(0.5 + Math.random()*0.6); brillitos.emitir(x, y, z, {vx: Math.cos(a)*Math.cos(b)*v, vy: Math.sin(b)*v + 2, vz: Math.sin(a)*Math.cos(b)*v, g: 6, vida: 0.5 + Math.random()*0.5, tam: 0.3, tam1: 0.05, color: color || '#ffe066'}); } }
function efectoConfeti(x, y, z, k){ const cols = ['#ff6b6b', '#ffd43b', '#4dabf7', '#69db7c', '#f783ac', '#9775fa']; for (let i = 0; i < (k || 40); i++){ const a = Math.random()*Math.PI*2, v = 2 + Math.random()*5; particulas.emitir(x, y, z, {vx: Math.cos(a)*v, vy: 4 + Math.random()*6, vz: Math.sin(a)*v, g: 9, vida: 1.2 + Math.random()*0.8, tam: 0.22, tam1: 0.18, color: cols[i % 6], roce: 1.2}); } }
function efectoAgua(x, y, z){ for (let i = 0; i < 24; i++){ const a = Math.random()*Math.PI*2, v = 1 + Math.random()*3; particulas.emitir(x, y, z, {vx: Math.cos(a)*v, vy: 4 + Math.random()*4, vz: Math.sin(a)*v, g: 14, vida: 0.8, tam: 0.3, tam1: 0.12, color: '#d0f0ff'}); } }
function destello(x, y, z){
  const g = new THREE.Group(); let px = 0, py = 16;
  for (let k = 0; k < 5; k++){ const nx = px + (Math.random() - 0.5)*2.2, ny = py - 3.3; const s = GFX.pieza(g, '#fff', 0.3, 3.5, 0.3, (px + nx)/2, (py + ny)/2, 0, {mat: GFX.brillo('#fff9db', 2.5), sinSombra: true}); s.rotation.z = Math.atan2(nx - px, 3.3); px = nx; py = ny; }
  g.position.set(x, y, z); M.raiz.add(g); M.rayos.push({g, t: 0.22});
  M.relampagoT = 0.2; cam.sacude = Math.max(cam.sacude, 0.25);
}
function brindar(texto, color){ brindis.push({texto, color: color || '#fff', t: 3}); if (brindis.length > 5) brindis.shift(); }
function nombreDe(pj){ const base = (pj || '').split(':'); if (base[0] === 'amigo'){ const A = S.AMIGOS[base[1]]; return A ? A.emoji + ' ' + A.nombre.replace(/^./, c=>c.toUpperCase()) : '🐾'; } return S.PJS[pj] ? S.PJS[pj].emoji + ' ' + S.PJS[pj].nombre : pj === 'chinita' ? '👑 La Chinita del Catatumbo' : pj === 'nublao' ? '⛈️ El Nublao' : pj === 'album' ? '📒 El álbum' : pj === 'antena' ? '📡 La antena' : '🙂 Un vecino'; }
function atenderEventos(){
  const J = G.J;
  for (const e of G.eventos){
    switch (e.tipo){
      case 'hablar': {
        const npc = G.N.npcs.find(n=>n.quien === e.pj && n.frases.includes(e.texto));
        subtitulos.push({quien: npc && npc.nombre ? npc.nombre : nombreDe(e.pj), pj: e.pj, texto: e.texto, t: Math.max(2.6, e.texto.length*0.062)}); if (subtitulos.length > 4) subtitulos.shift();
        decir(e.texto, e.pj); break;
      }
      case 'aviso': avisos.length = 0; avisos.push({texto: e.texto, t: 3.8}); break;
      case 'salto': sfx.salto(e.pj); efectoPolvo(e.x, e.y, e.z, 5); break;
      case 'dobleSalto': sfx.doble(); efectoChispas(e.x, e.y + 0.3, e.z, 10, '#b2f2bb', 3); break;
      case 'aterriza': sfx.aterriza(); efectoPolvo(e.x, e.y, e.z, e.fuerte ? 14 : 7); if (e.fuerte) cam.sacude = 0.15; break;
      case 'moneda': sfx.moneda(); efectoChispas(e.x, e.y, e.z, 7, '#ffe066', 2.5); break;
      case 'monedas': sfx.moneda(); brindar('+' + e.k + ' 🪙', '#ffe066'); break;
      case 'cocada': sfx.cocada(); efectoChispas(e.x, e.y, e.z, 12, '#fff3bf', 3); brindar('🥥 Cocada ' + e.n + '/' + e.de, '#fff3bf'); break;
      case 'barajita': sfx.barajita(); efectoConfeti(e.x, e.y, e.z, 30); brindar('🃏 ¡Barajita! (' + P.barajitas.length + '/36)', '#e599f7'); red('premio', {que: 'barajita', id: e.id}); break;
      case 'chispa': sfx.chispa(); efectoChispas(e.x, e.y, e.z, 40, '#ffd43b', 7); cartel = {titulo: '¡CHISPA DEL RELÁMPAGO! ⚡', sub: 'Llevas ' + e.total + ' de 48', t: 2.6}; red('premio', {que: 'chispa', id: e.id}); guardar(); break;
      case 'lastima': sfx.lastima(); efectoChispas(e.x, e.y + 1, e.z, 10, '#ffffff', 4); cam.sacude = 0.25; break;
      case 'ay': decir(({salomon: '¡Ay! ¡Eso dolió, primo!', primo: '¡Ay, mamá! ¡Yo sabía que no tenía que venir!', mollejuo: '¡Epa, más respeto con la panza!'})[e.pj], e.pj); break;
      case 'desmayo': cartel = {titulo: '¡UY! TE DESMAYASTE', sub: e.pierde ? 'Se te cayeron ' + e.pierde + ' monedas. ¡Vuelves a la bandera!' : '¡Vuelves a la bandera!', t: 2.4}; break;
      case 'cura': efectoChispas(J.x, J.y + 1, J.z, 10, '#ff8787', 2); break;
      case 'pisoton': sfx.pisoton(); break;
      case 'vence': sfx.vence(); efectoPolvo(e.x, e.y + 0.4, e.z, 12, '#ffffff'); efectoChispas(e.x, e.y + 0.6, e.z, 8, '#ffe066', 3); break;
      case 'pega': sfx.golpe(); efectoChispas(e.x, e.y, e.z, 6, '#ffffff', 3); break;
      case 'pedrada': sfx.pedrada(); break;
      case 'patada': sfx.patada(); for (let i = 0; i < 16; i++){ const a = i/16*Math.PI*2; brillitos.emitir(e.x + Math.cos(a)*1.2, e.y + 0.8, e.z + Math.sin(a)*1.2, {vx: -Math.sin(a)*4, vy: 0.5, vz: Math.cos(a)*4, g: 0, vida: 0.3, tam: 0.3, tam1: 0.05, color: '#b2f2bb'}); } break;
      case 'panzazo': sfx.panzazo(); cam.sacude = 0.3; for (let i = 0; i < 24; i++){ const a = i/24*Math.PI*2; particulas.emitir(e.x, e.y + 0.3, e.z, {vx: Math.cos(a)*7, vy: 1, vz: Math.sin(a)*7, g: 2, vida: 0.45, tam: 0.5, tam1: 1.2, color: '#f4e3c1', roce: 3}); } break;
      case 'rompe': sfx.rompe(); efectoPolvo(e.x, e.y, e.z, 18, e.que === 'pared' ? '#adb5bd' : '#c68642'); for (let i = 0; i < 10; i++){ const a = Math.random()*6.28; particulas.emitir(e.x, e.y, e.z, {vx: Math.cos(a)*4, vy: 4 + Math.random()*3, vz: Math.sin(a)*4, g: 16, vida: 0.9, tam: 0.3, tam1: 0.3, color: e.que === 'pared' ? '#868e96' : '#8d5524'}); } cam.sacude = 0.2; break;
      case 'diana': sfx.diana(); efectoConfeti(e.x, e.y, e.z, 20); break;
      case 'abre': efectoPolvo(e.x, e.y - 1, e.z, 20, '#dee2e6'); brindar('🚪 ¡Se abrió algo!', '#a5d8ff'); break;
      case 'golpeJaula': sfx.jaula(); efectoChispas(e.x, e.y + 1, e.z, 6, '#dee2e6', 3); break;
      case 'rescate': sfx.rescate(); efectoConfeti(e.x, e.y + 1, e.z, 50); { const A = S.AMIGOS[e.amigo]; brindar('🔓 ¡Rescataste a ' + (A ? A.nombre : 'un amigo') + '!', '#8ce99a'); } break;
      case 'boing': sfx.boing(); efectoChispas(e.x, e.y + 0.4, e.z, 10, '#ff8fa3', 3); break;
      case 'bandera': sfx.bandera(); efectoConfeti(e.x, e.y + 2.4, e.z, 24); brindar('🚩 ¡Bandera!', '#74c0fc'); break;
      case 'chapuzon': sfx.chapuzon(); efectoAgua(e.x, e.y, e.z); break;
      case 'cae': sfx.chapuzon(); break;
      case 'rayo': sfx.rayo(); destello(e.x, e.y, e.z); efectoChispas(e.x, e.y + 0.2, e.z, 20, '#fff3bf', 6); break;
      case 'canonazo': sfx.canonazo(); efectoPolvo(e.x, e.y, e.z, 10, '#868e96'); break;
      case 'explota': sfx.golpe(); efectoPolvo(e.x, e.y, e.z, 14, '#868e96'); break;
      case 'cambio': sfx.cambio(); efectoChispas(J.x, J.y + 0.8, J.z, 24, S.PJS[e.pj].color, 4); guardar(); break;
      case 'jefe': sfx.rugido(); cartel = {titulo: '¡' + e.nombre.toUpperCase() + '!', sub: '¡A pelear, primos!', t: 3}; MUS.modo = 'jefe'; cam.sacude = 0.5; break;
      case 'rugido': sfx.rugido(); break;
      case 'choqueJefe': cam.sacude = 0.4; efectoPolvo(e.x, e.y, e.z, 26); sfx.rompe(); break;
      case 'pegaJefe': sfx.vence(); efectoChispas(e.x, e.y, e.z, 20, '#ffffff', 5); break;
      case 'jefeVence': sfx.nivel(); efectoConfeti(e.x, e.y + 2, e.z, 90); cartel = {titulo: '¡VENCISTE A ' + e.nombre.toUpperCase() + '!', sub: '¡Busca la chispa grande!', t: 3.4}; MUS.modo = 'dia'; break;
      case 'nivelListo': sfx.nivel(); efectoConfeti(J.x, J.y + 2, J.z, 80); cartel = {titulo: '¡NIVEL COMPLETADO!', sub: G.N.nombre, t: 4.2}; break;
      case 'salida': irA(0, G.n); break;
      case 'portal': irA(e.nivel); break;
      case 'tienda': UI.cerca = 'tienda'; break;
      case 'album': UI.cerca = 'album'; break;
      case 'antena': UI.cerca = 'amigos'; break;
      case 'cruje': efectoPolvo(e.x, e.y, e.z, 6, '#c68642'); break;
    }
  }
  G.eventos.length = 0;
}
/* lo que se le cuenta a los amigos */
function red(tipo, datos){ if (RED && RED.activa && RED.activa()) try{ RED.enviarEvento(Object.assign({tipo}, datos)); }catch(e){} }

/* ============================================================
   DIBUJAR EL MUNDO CADA CUADRO
   ============================================================ */
const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), e4 = new THREE.Euler(), s4 = new THREE.Vector3(), p4 = new THREE.Vector3();
function dibujarMundo(dt){
  const N = G.N, J = G.J, t = G.t;
  GFX.U.tiempo.value = t;
  /* el jugador */
  if (JSON.stringify(P.puesto) !== M.puestoClave){ for (const pj of S.ORDEN_PJS){ M.raiz.remove(M.jugador[pj]); M.jugador[pj] = GFX.modeloPj(pj, P.puesto); M.raiz.add(M.jugador[pj]); } M.puestoClave = JSON.stringify(P.puesto); }
  for (const pj of S.ORDEN_PJS){
    const m = M.jugador[pj]; m.visible = pj === J.pj && !(J.invul > 0 && Math.floor(t*16) % 2);
    if (pj !== J.pj) continue;
    m.position.set(J.x, J.y, J.z); m.rotation.y = J.ang;
    GFX.animarPj(m, {anda: J.anda, suelo: J.suelo, saltoT: J.saltoT, aterriza: J.aterriza, ataque: J.ataque, ataqueTipo: J.ataqueTipo}, t, dt);
    /* polvito al correr */
    if (J.suelo && J.anda > 5 && Math.random() < dt*10) efectoPolvo(J.x, J.y, J.z, 1);
  }
  const suelo = S.sueloEn(N, J.x, J.z, J.y + 0.1, 0.1);
  M.sombra.visible = suelo > -Infinity && J.y - suelo < 12;
  if (M.sombra.visible){ M.sombra.position.set(J.x, suelo + 0.03, J.z); const k = clamp(1 - (J.y - suelo)/8, 0.3, 1); M.sombra.scale.setScalar(k); M.sombra.material.opacity = 0.3*k; }
  /* plataformas que se mueven, caen o rompen */
  for (const [c, m] of M.cajas){
    m.position.set((c.x0 + c.x1)/2, (c.y0 + c.y1)/2, (c.z0 + c.z1)/2);
    if (c.cae && c.pisada > 0 && !c.cayendo) m.position.x += Math.sin(t*60)*0.04;
    if ((c.rompible || c.rajada || c.puerta) && !c.solido){ const s = m.scale.x*0.8; m.scale.setScalar(s); if (s < 0.02) m.visible = false; }
    else if (c.solido && !m.visible){ m.visible = true; m.scale.setScalar(1); }
  }
  /* monedas: giran todas juntas */
  if (M.monedas){
    const giro = t*3;
    N.monedas.forEach((mo, i)=>{
      e4.set(0, giro + i*0.3, 0); q4.setFromEuler(e4); const k = mo.vivo ? 1 : 0; s4.set(k, k, k); p4.set(mo.x, mo.y + Math.sin(t*3 + i)*0.08, mo.z);
      m4.compose(p4, q4, s4); M.monedas.cuerpo.setMatrixAt(i, m4); M.monedas.borde.setMatrixAt(i, m4);
    });
    M.monedas.cuerpo.instanceMatrix.needsUpdate = M.monedas.borde.instanceMatrix.needsUpdate = true;
  }
  for (const [c, m] of M.cocadas){ m.visible = c.vivo; if (c.vivo){ m.rotation.y = t*2; m.position.y = c.y + Math.sin(t*3 + c.x)*0.1; } }
  for (const [b, m] of M.barajitas){ m.visible = b.vivo; if (b.vivo){ m.rotation.y = t*1.6; m.position.y = b.y + Math.sin(t*2.5)*0.15; } }
  for (const [j, m] of M.jaulas){
    const u = m.userData;
    if (j.abierta){ u.barras.visible = false; u.amigo.position.y = 0.72 + Math.abs(Math.sin(t*5))*0.35; }
    else { m.rotation.z = j.golpeT && t - j.golpeT < 0.3 ? Math.sin(t*60)*0.08 : 0; u.amigo.position.y = 0.72 + Math.sin(t*3)*0.05; }
  }
  for (const [d, m] of M.dianas){ m.rotation.y = d.activa ? m.rotation.y + dt*12 : Math.sin(t)*0.2; if (d.activa) m.scale.setScalar(Math.max(0.001, m.scale.x - dt*0.8)); m.visible = m.scale.x > 0.01; }
  for (const [tr, m] of M.trampolines){ const b = tr.boing && t - tr.boing < 0.3 ? Math.sin((t - tr.boing)*30)*(0.3 - (t - tr.boing)) : 0; m.scale.set(1 + b, 1 - b, 1 + b); }
  for (const [f, m] of M.banderas){
    m.userData.tela.rotation.y = Math.sin(t*3 + f.x)*0.35;
    /* la bandera tocada se pone verde */
    if (f.tocada && !m.userData.verde){ m.userData.verde = true; m.userData.tela.traverse(o=>{ if (o.isMesh && o.material && o.material.isMeshToonMaterial && o.material.color.getHexString() !== 'ffd43b') o.material = GFX.toon('#40c057'); }); }
  }
  /* la meta */
  const metaVisible = !!(N.meta && G.metaViva);
  M.meta.visible = metaVisible;
  if (metaVisible){ M.meta.position.set(N.meta.x, N.meta.y + Math.sin(t*2.5)*0.2, N.meta.z); M.meta.rotation.y = t*2; if (Math.random() < dt*20) efectoChispas(N.meta.x, N.meta.y, N.meta.z, 1, '#ffe066', 1.5); }
  /* enemigos */
  for (const [e, m] of M.enemigos){
    const muerto = !e.vivo, tm = muerto ? t - (e.muereT || t) : 0;
    m.visible = !muerto || tm < 0.35;
    if (!m.visible) continue;
    m.position.set(e.x, e.y + (muerto ? tm*2 : 0), e.z);
    if (muerto) m.scale.set(1 + tm*2, Math.max(0.05, 1 - tm*3), 1 + tm*2);
    m.rotation.y = e.ang !== undefined ? e.ang : Math.atan2(J.x - e.x, J.z - e.z);
    if (e.golpeT && t - e.golpeT < 0.2) m.position.x += Math.sin(t*80)*0.1;
    GFX.animarEnemigo(m, e, t, !muerto);
  }
  /* el jefe */
  if (M.jefe){
    const B = G.jefe;
    M.jefe.visible = B.vivo || (t - (B.golpeT || 0)) < 0.6;
    if (M.jefe.visible){
      M.jefe.position.set(B.x, B.y, B.z); M.jefe.rotation.y = B.ang || 0;
      const mareado = B.estado === 'mareado' || B.estado === 'cansado';
      M.jefe.rotation.z = mareado ? Math.sin(t*8)*0.15 : 0;
      if (mareado && Math.random() < dt*12) brillitos.emitir(B.x + Math.cos(t*6)*1.2, B.y + B.alto + 0.6, B.z + Math.sin(t*6)*1.2, {vy: 0, g: 0, vida: 0.4, tam: 0.35, tam1: 0.1, color: '#ffe066'});
      if (t - B.golpeT < 0.25) M.jefe.scale.setScalar(1.1); else M.jefe.scale.setScalar(1);
      GFX.animarEnemigo(M.jefe, {fase: 0}, t, true);
    }
  }
  /* NPC: miran al jugador y respiran */
  for (const [n, m] of M.npcs){ const d = Math.hypot(J.x - n.x, J.z - n.z); if (d < 9) m.rotation.y += S.envolver(Math.atan2(J.x - n.x, J.z - n.z) - m.rotation.y)*Math.min(1, dt*4); const c = m.userData.c || m.userData.cuerpo; if (c) c.position.y = Math.sin(t*2 + n.x)*0.03; }
  /* adornos animados */
  for (const m of M.animadas){
    const u = m.userData;
    if (u.gira) u.gira.rotation.z !== undefined && (m.children[0] === u.gira ? (u.gira.rotation.z += dt*0.15) : (u.gira.rotation.y += dt*0.6));
    if (u.tela) u.tela.rotation.y = Math.sin(t*2.5 + m.position.x)*0.3;
    if (u.flota) m.position.y += Math.sin(t*1.5 + m.position.x)*0.004;
    if (u.relampago){ m.visible = Math.random() < 0.02 || (m.visible && Math.random() < 0.6); }
    if (u.fuente && Math.random() < dt*30) particulas.emitir(m.position.x + (Math.random() - 0.5)*0.2, m.position.y + 2.2, m.position.z + (Math.random() - 0.5)*0.2, {vx: (Math.random() - 0.5)*2, vy: 3.5, vz: (Math.random() - 0.5)*2, g: 9, vida: 0.8, tam: 0.18, tam1: 0.08, color: '#a5d8ff'});
    if (u.portal){ const pide = S.PIDE_PORTAL[u.portal]; u.candado.visible = P.chispas.length < pide; const hecho = S.chispasDeNivelCache(u.portal); if (!u.hechoL || u.hechoL !== hecho){ u.hechoL = hecho; } }
  }
  /* peligros */
  for (const [p, g] of M.peligros){
    if (p.tipo === 'rodante' || p.tipo === 'carros'){
      if (!g.userData.lista) g.userData.lista = [];
      const L = g.userData.lista;
      while (L.length < p.items.length){ const m = p.tipo === 'carros' ? modeloCarro(L.length) : (p.bola ? GFX.esfera(g, p.color || '#f4f8ff', p.r || 0.7, 0, 0, 0) : (()=>{ const b = GFX.cilindro(g, '#8d5524', p.r || 0.6, p.r || 0.6, (p.r || 0.6)*1.6, 0, 0, 0, {lados: 12}); b.rotation.z = Math.PI/2; const h = new THREE.Group(); g.remove(b); h.add(b); return h; })()); if (!m.parent) g.add(m); L.push(m); }
      L.forEach((m, i)=>{ const it = p.items[i]; m.visible = !!it; if (!it) return; if (p.tipo === 'carros'){ m.position.set(it.x, p.y, it.z); m.rotation.y = it.v > 0 ? Math.PI : 0; } else { m.position.set(it.x, it.y + (p.r || 0.7), it.z); m.rotation.y = Math.atan2(p.x1 - p.x0, p.z1 - p.z0); m.rotation.x += dt*(p.vel || 5)/(p.r || 0.7); } });
    } else if (p.tipo === 'pinchos'){ const pin = g.userData.pinchos; pin.position.y = lerp(pin.position.y, p.arriba ? p.y : p.y - 0.62, dt*14); }
    else if (p.tipo === 'fuego'){ if (p.on && Math.random() < dt*60) particulas.emitir(p.x + (Math.random() - 0.5)*0.4, p.y + 0.4, p.z + (Math.random() - 0.5)*0.4, {vx: (Math.random() - 0.5), vy: 5 + Math.random()*3, vz: (Math.random() - 0.5), g: -1, vida: 0.6, tam: 0.5, tam1: 1.4, color: p.color || (G.N.tema.cielo === 'atardecer' ? '#f1f3f5' : '#ff922b'), roce: 1}); }
    else if (p.tipo === 'chorro'){ if (Math.random() < dt*25) brillitos.emitir(p.x + (Math.random() - 0.5)*(p.r || 1.2)*1.5, p.y, p.z + (Math.random() - 0.5)*(p.r || 1.2)*1.5, {vy: (p.fuerza || 11)*0.9, g: 0, vida: 0.9, tam: 0.2, tam1: 0.05, color: '#e7f5ff'}); }
  }
  /* balas y pedradas */
  const sync = (lista, arr, crear)=>{ while (lista.length < arr.length){ const m = crear(); M.raiz.add(m); lista.push(m); } lista.forEach((m, i)=>{ const b = arr[i]; m.visible = !!b; if (b) m.position.set(b.x, b.y, b.z); }); };
  sync(M.balas, G.balas, ()=>GFX.esfera(new THREE.Group(), '#212529', 0.35, 0, 0, 0));
  sync(M.piedras, G.proyectiles, ()=>{ const g = new THREE.Group(); GFX.esfera(g, '#868e96', 0.18, 0, 0, 0, {lados: 7}); return g; });
  for (const b of G.proyectiles) if (Math.random() < 0.5) particulas.emitir(b.x, b.y, b.z, {g: 0, vida: 0.25, tam: 0.18, tam1: 0.02, color: '#dee2e6'});
  /* los círculos de aviso de los rayos */
  if (!M.avisosRayo) M.avisosRayo = [];
  while (M.avisosRayo.length < G.rayos.length){ const c = new THREE.Mesh(new THREE.RingGeometry(1.3, 1.7, 32), new THREE.MeshBasicMaterial({color: '#ffe066', transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false})); c.rotation.x = -Math.PI/2; M.raiz.add(c); M.avisosRayo.push(c); }
  M.avisosRayo.forEach((c, i)=>{ const r = G.rayos[i]; c.visible = !!r; if (r){ c.position.set(r.x, (Number.isFinite(r.y) ? r.y : 0) + 0.06, r.z); c.material.opacity = 0.4 + Math.sin(t*25)*0.4; const k = 0.6 + r.t*0.5; c.scale.set(k, k, k); } });
  for (let i = M.rayos.length - 1; i >= 0; i--){ const r = M.rayos[i]; r.t -= dt; if (r.t <= 0){ M.raiz.remove(r.g); M.rayos.splice(i, 1); } }
  /* relámpagos: la luz del cielo parpadea */
  if (M.relampagoT > 0){ M.relampagoT -= dt; cielo_luz.intensity = 2.2; } else cielo_luz.intensity = lerp(cielo_luz.intensity, (GFX.CIELOS[N.tema.cielo] || GFX.CIELOS.dia).ambF*0.5, dt*6);
  if (N.tema.cielo === 'tormenta' && Math.random() < dt*0.25){ M.relampagoT = 0.12; sfx.rayo(); }
  /* lluvia */
  if (M.lluvia) for (let i = 0; i < 6; i++) particulas.emitir(J.x + (Math.random() - 0.5)*40, J.y + 18, J.z + (Math.random() - 0.5)*40, {vy: -26, vx: -2, g: 0, vida: 0.9, tam: 0.09, tam1: 0.09, color: '#a5b4dc'});
  /* luciérnagas de noche */
  if (M.noche && N.tema.cielo === 'noche' && Math.random() < dt*6) brillitos.emitir(J.x + (Math.random() - 0.5)*24, J.y + 0.5 + Math.random()*3, J.z + (Math.random() - 0.5)*24, {vx: (Math.random() - 0.5)*0.6, vy: 0.3, vz: (Math.random() - 0.5)*0.6, g: 0, vida: 3, tam: 0.18, tam1: 0.1, color: '#d8f5a2'});
  /* viento */
  if (G.soplando && Math.random() < dt*30){ const z = G.soplando; particulas.emitir(J.x - (z.fx || 0)*3 + (Math.random() - 0.5)*10, J.y + Math.random()*3, J.z - (z.fz || 0)*3 + (Math.random() - 0.5)*10, {vx: (z.fx || 0)*6, vz: (z.fz || 0)*6, g: 0, vida: 0.7, tam: 0.1, tam1: 0.1, color: '#ffffff'}); G.soplando = null; }
  /* nubes del cielo */
  for (const n of M.cielo.userData.nubes){ n.position.x += n.userData.v*dt; if (n.position.x > 280) n.position.x = -280; }
  M.cielo.position.set(camara.position.x, 0, camara.position.z);
  if (M.agua){ M.agua.position.x = Math.round(J.x/10)*10; M.agua.position.z = Math.round(J.z/10)*10; }
  /* amigos en línea */
  dibujarRemotos(dt);
  particulas.paso(dt); brillitos.paso(dt);
}
S.chispasDeNivelCache = (()=>{ const c = {}; return n=>c[n] || (c[n] = S.chispasDeNivel(n)); })();

/* ---------------- los amigos en línea ---------------- */
function dibujarRemotos(dt){
  if (!RED) return;
  try{ RED.paso(); }catch(e){}
  const vistos = new Set();
  for (const [id, r] of RED.remotos){
    if (!r.listo || !r.obj || r.obj.nv !== G.n) continue;
    vistos.add(id);
    const clave = r.obj.pj + JSON.stringify(r.obj.puesto || {});
    let x = M.remotos.get(id);
    if (!x || x.clave !== clave){ if (x) M.raiz.remove(x.m); const m = GFX.modeloPj(r.obj.pj, r.obj.puesto); const l = GFX.letrero('👤 ' + r.nombre, '#fff', 'rgba(28,126,214,.9)', 0.42); l.position.y = 2.35; m.add(l); M.raiz.add(m); x = {m, clave, t: 0}; M.remotos.set(id, x); }
    x.t += dt;
    x.m.position.set(r.act.x, r.act.y, r.act.z); x.m.rotation.y = r.act.ang;
    GFX.animarPj(x.m, {anda: r.obj.mov, suelo: r.obj.suelo, ataque: r.obj.ataque ? 0.2 : 0, ataqueTipo: r.obj.ataque}, G.t + id.length, dt);
  }
  for (const [id, x] of M.remotos) if (!vistos.has(id)){ M.raiz.remove(x.m); M.remotos.delete(id); }
}
if (RED){
  RED.saludo = ()=>({pj: G ? G.J.pj : P.pj, n: S.PJS[G ? G.J.pj : P.pj].nombre, chispas: P.chispas.slice(), barajitas: P.barajitas.slice()});
  RED.alSaludo = (r, s)=>{ let k = 0; for (const id of s.chispas || []) if (S.recibirPremio(P, 'chispa', id)) k++; let b = 0; for (const id of s.barajitas || []) if (S.recibirPremio(P, 'barajita', id)) b++; if (k || b){ brindar('🎁 ' + r.nombre + ' te compartió ' + (k ? k + ' ⚡ ' : '') + (b ? b + ' 🃏' : ''), '#ffe066'); guardar(); } };
  RED.on.llega = r=>{ brindar('👋 ¡' + r.nombre + ' entró a jugar!', '#8ce99a'); sfx.bandera(); };
  RED.on.seVa = r=>{ brindar('👋 ' + r.nombre + ' se fue', '#ced4da'); };
  RED.on.aviso = t=>brindar(t, '#a5d8ff');
  RED.on.evento = (r, d)=>{ if (d.tipo === 'premio' && S.recibirPremio(P, d.que, d.id)){ brindar((d.que === 'chispa' ? '⚡ ' : '🃏 ') + r.nombre + ' ganó ' + (d.que === 'chispa' ? 'una chispa' : 'una barajita') + ': ¡es de todos!', '#ffe066'); sfx.chispa(); guardar(); } };
}

/* ============================================================
   EL MARCADOR
   ============================================================ */
function rr(x, y, w, h, r){ ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function corazon(x, y, s, lleno){
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, 6); ctx.bezierCurveTo(-12, -2, -8, -12, 0, -5); ctx.bezierCurveTo(8, -12, 12, -2, 0, 6); ctx.closePath();
  ctx.fillStyle = lleno ? '#ff3b5c' : 'rgba(0,0,0,.35)'; ctx.fill(); ctx.lineWidth = 2/s; ctx.strokeStyle = '#fff'; ctx.stroke();
  if (lleno){ ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(-4, -4, 2, 0, 7); ctx.fill(); }
  ctx.restore();
}
function textoSombra(t, x, y, color, tam, alin, fuente){
  ctx.font = (fuente || 'bold ') + tam + 'px Fredoka, "Trebuchet MS", sans-serif'; ctx.textAlign = alin || 'left'; ctx.textBaseline = 'middle';
  ctx.lineWidth = Math.max(3, tam*0.18); ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.strokeText(t, x, y); ctx.fillStyle = color || '#fff'; ctx.fillText(t, x, y);
}
function envolverTexto(t, ancho){ const pal = t.split(' '), L = []; let l = ''; for (const p of pal){ const q = l ? l + ' ' + p : p; if (ctx.measureText(q).width > ancho && l){ L.push(l); l = p; } else l = q; } if (l) L.push(l); return L; }
function dibujarHUD(dt){
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
  const J = G.J, chico = Math.min(W, H) < 480;
  /* viñeta suave en los bordes (se ve más de cine) */
  const vg = ctx.createRadialGradient(W/2, H/2, Math.min(W, H)*0.45, W/2, H/2, Math.max(W, H)*0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.28)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  if (M.relampagoT > 0){ ctx.fillStyle = 'rgba(255,255,240,' + (M.relampagoT*1.6) + ')'; ctx.fillRect(0, 0, W, H); }
  /* corazones */
  for (let i = 0; i < J.maxVidas; i++) corazon(28 + i*34, 30, chico ? 1.25 : 1.45, i < J.vidas);
  /* monedas y chispas */
  const fila = y=>y;
  ctx.font = 'bold 20px Fredoka, sans-serif';
  textoSombra('🪙 ' + P.monedas, 16, fila(64), '#ffe066', chico ? 18 : 22);
  textoSombra('⚡ ' + P.chispas.length + '/48', 16, fila(92), '#fff3bf', chico ? 16 : 19);
  if (G.n > 0){
    const ganadas = S.chispasDeNivelCache(G.n).filter(c=>P.chispas.includes(c)).length;
    textoSombra('🥥 ' + G.cocadas + '/8   ⚡' + ganadas + '/4   🃏' + G.N.barajitas.filter(b=>!b.vivo).length + '/3', 16, fila(118), '#fff', chico ? 14 : 16);
  }
  /* nivel y amigos */
  textoSombra(G.n === 0 ? 'La Vereda del Lago' : G.n + ' · ' + G.N.nombre, W/2, 22, '#fff', chico ? 13 : 15, 'center', '');
  if (RED && RED.activa && RED.activa()){ const n = [...RED.remotos.values()].filter(r=>r.listo).length; textoSombra('👥 Sala ' + RED.sala + (n ? ' · ' + n + (n === 1 ? ' amigo' : ' amigos') : ' · esperando…'), W - 70, 34, '#a5d8ff', chico ? 13 : 15, 'right', ''); }
  /* botón de pausa */
  ctx.beginPath(); ctx.arc(BOTON_PAUSA.x(), BOTON_PAUSA.y(), BOTON_PAUSA.r, 0, 7); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2; ctx.stroke();
  textoSombra('☰', BOTON_PAUSA.x(), BOTON_PAUSA.y() + 1, '#fff', 20, 'center');
  /* barra del jefe */
  const B = G.jefe;
  if (B && B.vivo && B.activo){
    const w = Math.min(360, W*0.6), x = (W - w)/2, y = 46;
    rr(x - 8, y - 16, w + 16, 40, 12); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fill();
    textoSombra(B.nombre, W/2, y - 4, '#ffd43b', 14, 'center');
    ctx.fillStyle = '#495057'; rr(x, y + 7, w, 10, 5); ctx.fill();
    ctx.fillStyle = '#ff3b5c'; rr(x, y + 7, Math.max(10, w*B.hp/B.hpMax), 10, 5); ctx.fill();
  }
  /* avisos */
  if (avisos.length){ const a = avisos[0]; a.t -= dt; ctx.font = 'bold ' + (chico ? 15 : 18) + 'px Fredoka, sans-serif'; const L = envolverTexto(a.texto, Math.min(W - 40, 560)); const w = Math.min(W - 20, Math.max(...L.map(l=>ctx.measureText(l).width)) + 34), h = 16 + L.length*22, y = B && B.activo ? 94 : 60; rr((W - w)/2, y, w, h, 14); ctx.fillStyle = 'rgba(255,212,59,.95)'; ctx.fill(); ctx.fillStyle = '#212529'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; L.forEach((l, i)=>ctx.fillText(l, W/2, y + 19 + i*22)); if (a.t <= 0) avisos.shift(); }
  /* brindis (avisitos a la derecha) */
  brindis.forEach((b, i)=>{ b.t -= dt; ctx.globalAlpha = Math.min(1, b.t*2); textoSombra(b.texto, W - 16, 70 + i*26, b.color, chico ? 13 : 16, 'right'); ctx.globalAlpha = 1; });
  for (let i = brindis.length - 1; i >= 0; i--) if (brindis[i].t <= 0) brindis.splice(i, 1);
  /* subtítulos: quién habla y qué dice */
  if (subtitulos.length){
    const s = subtitulos[0]; s.t -= dt;
    let w = tactil ? Math.min(560, W - 380) : Math.min(640, W - 40); if (w < 260) w = W - 30;
    ctx.font = (chico ? 15 : 18) + 'px Fredoka, sans-serif';
    const L = envolverTexto(s.texto, w - 34), h = 40 + L.length*23, x = (W - w)/2, y = H - 16 - h;
    rr(x, y, w, h, 16); ctx.fillStyle = 'rgba(12,14,36,.82)'; ctx.fill();
    const col = (S.PJS[s.pj] && S.PJS[s.pj].color) || (s.pj === 'chinita' ? '#ff9ed6' : s.pj === 'nublao' ? '#adb5bd' : '#ffe066');
    ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke();
    textoSombra(s.quien, x + 16, y + 18, col, chico ? 14 : 16);
    ctx.fillStyle = '#fff'; ctx.font = (chico ? 15 : 18) + 'px Fredoka, sans-serif'; ctx.textAlign = 'left';
    L.forEach((l, i)=>ctx.fillText(l, x + 16, y + 42 + i*23));
    if (s.t <= 0) subtitulos.shift();
  }
  /* el cartel grande */
  if (cartel){
    cartel.t -= dt; const a = clamp(Math.min(cartel.t*2, (4.5 - cartel.t)*3), 0, 1);
    ctx.globalAlpha = a;
    const g = ctx.createLinearGradient(0, H*0.3, 0, H*0.3 + 110); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, 'rgba(0,0,0,.5)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, H*0.3, W, 110);
    textoSombra(cartel.titulo, W/2, H*0.3 + 44, '#ffd43b', chico ? 24 : 38, 'center', '');
    ctx.font = (chico ? 24 : 38) + 'px "Luckiest Guy", Fredoka, sans-serif';
    textoSombra(cartel.sub, W/2, H*0.3 + 82, '#fff', chico ? 14 : 18, 'center', '');
    ctx.globalAlpha = 1; if (cartel.t <= 0) cartel = null;
  }
  /* cerca de la tienda, el álbum o la antena */
  if (UI.cerca){
    const d = UI.cerca === 'tienda' ? G.N.npcs.find(n=>n.tienda) : UI.cerca === 'album' ? G.N.npcs.find(n=>n.album) : G.N.npcs.find(n=>n.antena);
    if (d && Math.hypot(J.x - d.x, J.z - d.z) < 3.4){
      const txt = UI.cerca === 'tienda' ? '🛒 Abrir la tienda' : UI.cerca === 'album' ? '📒 Ver el álbum' : '👥 Jugar con amigos';
      const w = 250, x = W/2 - w/2, y = H*0.62; UI.botonCerca = {x, y, w, h: 50};
      rr(x, y, w, 50, 25); ctx.fillStyle = 'rgba(28,126,214,.95)'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
      textoSombra(txt + (tactil ? '' : '  [ENTER]'), W/2, y + 26, '#fff', 17, 'center');
      if (teclas['enter']){ teclas['enter'] = false; abrirMenu(UI.cerca); }
    } else { UI.cerca = null; UI.botonCerca = null; }
  } else UI.botonCerca = null;
  /* controles táctiles */
  if (tactil){
    const p = TOQUE.palanca;
    if (p){ ctx.beginPath(); ctx.arc(p.x0, p.y0, 55, 0, 7); ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 2; ctx.stroke(); let dx = p.x - p.x0, dy = p.y - p.y0; const k = Math.hypot(dx, dy); if (k > 55){ dx *= 55/k; dy *= 55/k; } ctx.beginPath(); ctx.arc(p.x0 + dx, p.y0 + dy, 26, 0, 7); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fill(); }
    else if (G.t < 20){ ctx.globalAlpha = 0.55; textoSombra('👆 desliza para caminar', W*0.2, H*0.7, '#fff', 14, 'center', ''); textoSombra('👆 desliza para mirar', W*0.6, H*0.78, '#fff', 14, 'center', ''); ctx.globalAlpha = 1; }
    for (const b of BOTONES){
      const q = b.pos(), on = [...TOQUE.botones.values()].includes(b);
      ctx.beginPath(); ctx.arc(q.x, q.y, b.r*(on ? 1.08 : 1), 0, 7); ctx.fillStyle = b.color; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 2.5; ctx.stroke();
      const txt = b.k === 'c' ? S.PJS[S.ORDEN_PJS[(S.ORDEN_PJS.indexOf(J.pj) + 1) % 3]].emoji : b.k === 'b' ? ({pedrada: '🪨', patada: '🦶', panzazo: '💥'})[S.PJS[J.pj].poder] : b.txt;
      textoSombra(txt, q.x, q.y + 2, '#fff', Math.round(b.r*(b.k === 'a' ? 0.8 : 0.72)), 'center');
      textoSombra(b.sub, q.x, q.y + b.r + 10, '#fff', 11, 'center', '');
    }
  } else if (G.t < 12 && G.n === 0){
    ctx.globalAlpha = clamp(12 - G.t, 0, 1)*0.85;
    textoSombra('Flechas/WASD caminar · ESPACIO saltar · X poder · C cambiar · Q/E o ratón girar cámara · ESC pausa', W/2, H - 20, '#fff', 13, 'center', '');
    ctx.globalAlpha = 1;
  }
  /* quién juega */
  if (!tactil) textoSombra(S.PJS[J.pj].emoji + ' ' + S.PJS[J.pj].nombre, 16, H - 24, S.PJS[J.pj].color, 17);
}

/* ============================================================
   MENÚS (pausa, tienda, álbum, amigos, título)
   ============================================================ */
const UI = {menu: null, botones: [], sel: 0, cerca: null, botonCerca: null, escribiendo: false, codigo: '', msg: '', msgT: 0};
function abrirMenu(cual){ if (estado === 'juego' || estado === 'menu'){ UI.menu = cual; UI.sel = 0; estado = 'menu'; UI.escribiendo = false; UI.msg = ''; sfx.menu(); } }
function cerrarMenu(){ UI.menu = null; UI.escribiendo = false; estado = 'juego'; guardar(); }
function boton(x, y, w, h, txt, accion, o){ UI.botones.push(Object.assign({x, y, w, h, txt, accion}, o || {})); }
function clicMenu(x, y){
  for (let i = 0; i < UI.botones.length; i++){ const b = UI.botones[i]; if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h){ UI.sel = i; sfx.menu(); b.accion(); return; } }
  if (estado === 'titulo') return;
}
function teclaMenu(k){
  const n = UI.botones.length; if (!n) return;
  if (k === 'arrowdown' || k === 'arrowright' || k === 's' || k === 'd'){ UI.sel = (UI.sel + 1) % n; sfx.menu(); }
  else if (k === 'arrowup' || k === 'arrowleft' || k === 'w' || k === 'a'){ UI.sel = (UI.sel + n - 1) % n; sfx.menu(); }
  else if (k === 'enter' || k === ' '){ const b = UI.botones[UI.sel]; if (b){ sfx.menu(); b.accion(); } }
  else if (k === 'escape'){ if (estado === 'menu') cerrarMenu(); }
}
function teclaCodigo(k){
  if (k === 'Escape'){ UI.escribiendo = false; return; }
  if (k === 'Backspace'){ UI.codigo = UI.codigo.slice(0, -1); return; }
  if (k === 'Enter'){ if (RED && UI.codigo.length === 4){ RED.unirse(UI.codigo); UI.escribiendo = false; } return; }
  const c = k.toUpperCase(); if (/^[A-Z0-9]$/.test(c) && UI.codigo.length < 4) UI.codigo = RED ? RED.normalizarCodigo(UI.codigo + c) : UI.codigo + c;
}
function panel(titulo, w, h){
  ctx.fillStyle = 'rgba(8,10,30,.62)'; ctx.fillRect(0, 0, W, H);
  w = Math.min(w, W - 20); h = Math.min(h, H - 20);
  const x = (W - w)/2, y = (H - h)/2;
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#2b3a8c'); g.addColorStop(1, '#1a2255');
  rr(x, y, w, h, 22); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 3; ctx.stroke();
  textoSombra(titulo, W/2, y + 30, '#ffd43b', 26, 'center');
  return {x, y, w, h};
}
function dibujarBoton(b, i){
  const sel = i === UI.sel;
  rr(b.x, b.y, b.w, b.h, Math.min(16, b.h/2)); ctx.fillStyle = b.color || (sel ? 'rgba(255,212,59,.95)' : 'rgba(255,255,255,.14)'); ctx.fill();
  ctx.strokeStyle = sel ? '#fff' : 'rgba(255,255,255,.35)'; ctx.lineWidth = sel ? 3 : 1.5; ctx.stroke();
  const col = b.textoColor || (sel && !b.color ? '#212529' : '#fff');
  ctx.font = 'bold ' + (b.tam || 17) + 'px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col;
  const L = String(b.txt).split('\n'); L.forEach((l, k)=>ctx.fillText(l, b.x + b.w/2, b.y + b.h/2 + (k - (L.length - 1)/2)*((b.tam || 17) + 3)));
}
function dibujarMenu(){
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  UI.botones = [];
  const m = UI.menu;
  if (m === 'pausa'){
    const p = panel('⏸ PAUSA', 380, 470), x = p.x + 30, w = p.w - 60; let y = p.y + 62;
    const fila = (txt, a)=>{ boton(x, y, w, 44, txt, a); y += 52; };
    fila('▶ Seguir jugando', cerrarMenu);
    if (G.n > 0) fila('🏠 Volver a la Vereda', ()=>{ cerrarMenu(); irA(0, G.n); });
    fila('👥 Jugar con amigos', ()=>abrirMenu('amigos'));
    fila('📒 Álbum de barajitas', ()=>abrirMenu('album'));
    fila('✨ Calidad: ' + (OPC.calidad === 'auto' ? 'automática (' + CAL.nivel + ')' : CAL.nivel), ()=>{ const o = ['auto', 'alta', 'media', 'baja']; OPC.calidad = o[(o.indexOf(OPC.calidad) + 1) % 4]; CAL.nivel = OPC.calidad === 'auto' ? CAL.nivel : OPC.calidad; aplicarCalidad(); guardar(); });
    fila((OPC.musica ? '🎵 Música: sí' : '🔇 Música: no') + ' · ' + (OPC.voces ? '🗣 Voces: sí' : 'Voces: no'), ()=>{ if (OPC.musica && OPC.voces) OPC.musica = false; else if (!OPC.musica && OPC.voces) OPC.voces = false; else if (!OPC.musica){ OPC.musica = true; OPC.voces = true; } guardar(); });
    fila('🚪 Salir a Fernando Bros', ()=>{ guardar(); location.href = '../'; });
  } else if (m === 'tienda'){
    const p = panel('🛒 EL KIOSKO', 640, 480);
    textoSombra('🪙 ' + P.monedas, p.x + p.w - 24, p.y + 30, '#ffe066', 20, 'right');
    const cols = W < 520 ? 2 : 3, filas = Math.ceil(S.TIENDA.length/cols), bw = (p.w - 40 - (cols - 1)*10)/cols, bh = Math.min(86, (p.h - 58 - 66 - (filas - 1)*8)/filas);
    S.TIENDA.forEach((it, i)=>{
      const cx = p.x + 20 + (i % cols)*(bw + 10), cy = p.y + 56 + Math.floor(i/cols)*(bh + 8);
      const tiene = P.compras.includes(it.id), puesto = Object.values(P.puesto).includes(it.id);
      boton(cx, cy, bw, bh, it.emoji + ' ' + it.nombre + '\n' + (puesto ? '✅ Puesto (quitar)' : tiene ? 'Tuyo · ponértelo' : '🪙 ' + it.precio), ()=>{
        const r = S.comprar(P, it.id);
        if (r === 'faltan'){ UI.msg = '¡Te faltan ' + (it.precio - P.monedas) + ' monedas!'; UI.msgT = 2; } else { sfx.compra(); guardar(); efectoConfeti(G.J.x, G.J.y + 2, G.J.z, 20); }
      }, {tam: 14, color: puesto ? 'rgba(64,192,87,.85)' : tiene ? 'rgba(28,126,214,.7)' : P.monedas >= it.precio ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.3)'});
    });
    boton(p.x + p.w/2 - 90, p.y + p.h - 58, 180, 44, '✔ Listo', cerrarMenu);
  } else if (m === 'album'){
    const p = panel('📒 ÁLBUM DE BARAJITAS · ' + P.barajitas.length + '/36', 680, 500);
    const nombres = ['El Saladillo', 'El Puente', 'Los Palafitos', 'Las Pulgas', 'La Vereda de noche', 'Coro', 'El Páramo', 'El Tepuy', 'Las Torres', 'La Feria', 'San Carlos', 'El Catatumbo'];
    const cols = W < 560 ? 2 : 3, cw = (p.w - 40)/cols, ch = Math.min(56, (p.h - 140)/(12/cols));
    for (let n = 1; n <= 12; n++){
      const i = n - 1, x = p.x + 20 + (i % cols)*cw, y = p.y + 60 + Math.floor(i/cols)*ch;
      const ch1 = S.chispasDeNivelCache(n).filter(c=>P.chispas.includes(c)).length;
      textoSombra(n + '. ' + nombres[i] + '  ⚡' + ch1 + '/4', x + 4, y + 12, '#fff', 13, 'left', '');
      for (let b = 0; b < 3; b++){ const tiene = P.barajitas.includes(n + '-b' + b); rr(x + 6 + b*30, y + 24, 24, 26, 5); ctx.fillStyle = tiene ? '#e599f7' : 'rgba(255,255,255,.12)'; ctx.fill(); textoSombra(tiene ? '⚡' : '?', x + 18 + b*30, y + 37, tiene ? '#fff' : 'rgba(255,255,255,.5)', 13, 'center'); }
    }
    boton(p.x + p.w/2 - 90, p.y + p.h - 58, 180, 44, '✔ Cerrar', cerrarMenu);
  } else if (m === 'amigos'){
    const p = panel('👥 JUGAR CON AMIGOS', 560, 480);
    const x = p.x + 30, w = p.w - 60; let y = p.y + 64;
    if (!RED || !RED.hay || !RED.hay()){ textoSombra('No se cargó la parte de red. Revisa el internet y recarga.', W/2, y + 20, '#ffc9c9', 15, 'center', ''); }
    else if (RED.estado === 'off' || RED.estado === 'error'){
      if (RED.error){ ctx.font = '14px Fredoka, sans-serif'; envolverTexto(RED.error, w).forEach((l, i)=>textoSombra(l, W/2, y + 10 + i*20, '#ffc9c9', 14, 'center', '')); y += 70; }
      else { ctx.font = '15px Fredoka, sans-serif'; envolverTexto('Hasta 4 amigos, cada uno en su aparato. Uno crea la sala y los demás escriben el código de 4 letras.', w).forEach((l, i)=>textoSombra(l, W/2, y + 8 + i*21, '#dbe4ff', 15, 'center', '')); y += 64; }
      boton(x, y, w, 50, '✨ Crear una sala', ()=>RED.crear()); y += 62;
      if (UI.escribiendo){
        textoSombra('Código: ' + (UI.codigo + '____').slice(0, 4).split('').join(' '), W/2, y + 16, '#ffe066', 26, 'center'); y += 40;
        const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', cols = 11, bw = (w - (cols - 1)*4)/cols;
        letras.split('').forEach((l, i)=>boton(x + (i % cols)*(bw + 4), y + Math.floor(i/cols)*38, bw, 34, l, ()=>{ if (UI.codigo.length < 4) UI.codigo += l; }, {tam: 15}));
        y += 3*38 + 6;
        boton(x, y, w/2 - 5, 42, '⌫ Borrar', ()=>{ UI.codigo = UI.codigo.slice(0, -1); }); boton(x + w/2 + 5, y, w/2 - 5, 42, '▶ Entrar', ()=>{ if (UI.codigo.length === 4){ RED.unirse(UI.codigo); UI.escribiendo = false; } }, {color: UI.codigo.length === 4 ? 'rgba(64,192,87,.9)' : null});
      } else boton(x, y, w, 50, '🔑 Entrar con un código', ()=>{ UI.escribiendo = true; UI.codigo = ''; });
    } else {
      textoSombra(RED.estado === 'creando' ? 'Abriendo la sala…' : RED.estado === 'uniendo' ? (RED.aviso || 'Entrando…') : 'Sala abierta', W/2, y + 6, '#dbe4ff', 15, 'center', '');
      ctx.font = '900 64px Fredoka, sans-serif'; textoSombra(RED.sala.split('').join(' '), W/2, y + 60, '#ffd43b', 58, 'center'); y += 104;
      const lista = [...RED.remotos.values()].filter(r=>r.listo || r.saludo);
      textoSombra(lista.length ? 'En la sala: ' + lista.map(r=>r.nombre).join(', ') : 'Dile el código a tus amigos 👆', W/2, y, '#fff', 16, 'center', ''); y += 30;
      if (navigator.clipboard) boton(x, y, w, 44, '🔗 Copiar enlace para invitar', ()=>{ try{ navigator.clipboard.writeText(RED.enlace()); UI.msg = '¡Enlace copiado!'; UI.msgT = 2; }catch(e){} }); y += 54;
      boton(x, y, w, 44, '🚪 Salir de la sala', ()=>RED.salir(), {color: 'rgba(224,49,49,.75)'}); y += 54;
      if (RED.diagnostico) textoSombra(RED.diagnostico(), W/2, p.y + p.h - 76, 'rgba(255,255,255,.55)', 11, 'center', '');
    }
    boton(p.x + p.w/2 - 90, p.y + p.h - 58, 180, 44, '✔ Volver', ()=>{ if (estado === 'menu') cerrarMenu(); });
  }
  if (UI.msgT > 0){ UI.msgT -= 1/60; textoSombra(UI.msg, W/2, H*0.16, '#ffe066', 20, 'center'); }
  UI.botones.forEach(dibujarBoton);
}
/* el título: la Vereda de fondo, los cuatro personajes y el nombre del juego */
let tituloEscena = null;
function prepararTitulo(){
  G = S.crearPartida(0, P); G.eventos.length = 0; armarMundo();
  tituloEscena = new THREE.Group();
  ['salomon', 'primo', 'mollejuo', 'chinita'].forEach((pj, i)=>{ const m = GFX.modeloPj(pj, pj === 'chinita' ? {} : P.puesto); m.position.set(-2.4 + i*1.6, 0.15, 5.2); m.userData.i = i; m.rotation.y = 0; tituloEscena.add(m); });
  M.raiz.add(tituloEscena);
  estado = 'titulo';
}
function dibujarTitulo(dt){
  tituloT += dt; GFX.U.tiempo.value = tituloT;
  for (const m of tituloEscena.children){ m.rotation.y = Math.sin(tituloT*1.1 + m.userData.i)*0.45; GFX.animarPj(m, {anda: 0, suelo: true}, tituloT + m.userData.i, dt); m.userData.cuerpo.position.y = Math.abs(Math.sin(tituloT*3 + m.userData.i))*0.12; }
  const a = tituloT*0.12;
  camara.position.set(Math.sin(a)*1.4, 1.7, 9.6 + Math.cos(a)*0.3); camara.lookAt(0, 1.3, 4.6);
  M.cielo.position.set(camara.position.x, 0, camara.position.z);
  for (const n of M.cielo.userData.nubes){ n.position.x += n.userData.v*dt; if (n.position.x > 280) n.position.x = -280; }
  sol.position.set(20, 40, 20); sol.target.position.set(0, 0, 0);
  particulas.paso(dt); brillitos.paso(dt);
  if (Math.random() < dt*8) brillitos.emitir((Math.random() - 0.5)*10, Math.random()*4, (Math.random() - 0.5)*6, {vy: 0.4, g: 0, vida: 2, tam: 0.12, tam1: 0.02, color: '#ffe066'});
  renderer.render(escena, camara);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
  const chico = Math.min(W, H) < 480;
  const g = ctx.createLinearGradient(0, 0, 0, chico ? 120 : 160); g.addColorStop(0, 'rgba(0,10,40,.55)'); g.addColorStop(1, 'rgba(0,10,40,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, chico ? 120 : 160);
  ctx.save(); ctx.translate(W/2, chico ? 42 : 62); ctx.rotate(Math.sin(tituloT*1.5)*0.02);
  ctx.font = (chico ? 34 : 60) + 'px "Luckiest Guy", Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = chico ? 8 : 12; ctx.strokeStyle = '#6a1b1b'; ctx.strokeText('SALOMÓN Y LOS PRIMOS', 0, 0); const gt = ctx.createLinearGradient(0, -30, 0, 30); gt.addColorStop(0, '#fff3bf'); gt.addColorStop(1, '#fcc419'); ctx.fillStyle = gt; ctx.fillText('SALOMÓN Y LOS PRIMOS', 0, 0);
  ctx.restore();
  textoSombra('⚡ La Gran Aventura del Lago ⚡', W/2, chico ? 80 : 112, '#fff', chico ? 16 : 24, 'center');
  UI.botones = [];
  const bw = Math.min(300, W - 40), bx = (W - bw)/2, by = H - (chico ? 150 : 190);
  boton(bx, by, bw, 54, P.chispas.length ? '▶ Seguir la aventura (' + P.chispas.length + ' ⚡)' : '▶ ¡A jugar!', ()=>{ audio(); MUS.on = true; entrarNivel(0); }, {tam: 20, color: 'rgba(255,146,43,.95)'});
  boton(bx, by + 64, bw, 46, '👥 Jugar con amigos', ()=>{ audio(); MUS.on = true; entrarNivel(0); abrirMenu('amigos'); }, {tam: 17});
  UI.botones.forEach(dibujarBoton);
  textoSombra('Inspirado en los juegos de plataformas en 3D · hecho en casa para Salomón', W/2, H - 14, 'rgba(255,255,255,.6)', 11, 'center', '');
}

/* ============================================================
   EL CICLO
   ============================================================ */
let ultimo = performance.now(), acumulado = 0, cuadros = 0, relojFps = 0;
aplicarCalidad();
prepararTitulo();
if (RED && RED.pendiente){ /* vino con ?sala=ABCD: se entra solo */ setTimeout(()=>{ entrarNivel(0); abrirMenu('amigos'); RED.unirse(RED.pendiente); }, 400); }
const cargando = document.getElementById('cargando'); if (cargando) cargando.remove();
function ciclo(ahora){
  requestAnimationFrame(ciclo);
  const dt = Math.min(0.1, (ahora - ultimo)/1000); ultimo = ahora;
  /* calidad automática: si pasa 3 s por debajo de 40 cuadros, baja un escalón */
  cuadros++; relojFps += dt;
  if (relojFps > 3){ CAL.fps = cuadros/relojFps; cuadros = 0; relojFps = 0; if (OPC.calidad === 'auto' && CAL.fps < 40 && CAL.nivel !== 'baja' && estado === 'juego'){ CAL.nivel = CAL.nivel === 'alta' ? 'media' : 'baja'; aplicarCalidad(); brindar('✨ Bajé la calidad para que vaya más fluido', '#a5d8ff'); } }
  musicaPaso();
  if (estado === 'titulo'){ leerEntrada(dt); dibujarTitulo(dt); return; }
  if (estado === 'juego'){
    let ent = leerEntrada(dt);
    acumulado += dt;
    while (acumulado >= S.DT){ S.paso(G, ent); acumulado -= S.DT; ent = Object.assign({}, ent, {saltoPulsado: false, poder: false, cambiar: false}); }
    atenderEventos();
    if (RED && RED.activa && RED.activa() && (++M.envio % 4 === 0 || !M.envio)) try{ RED.enviarEstado(S.empaquetar(G, S.PJS[G.J.pj].nombre)); }catch(e){}
  } else leerEntrada(dt);
  if (!M.envio) M.envio = 1;
  pasoCamara(dt);
  dibujarMundo(dt);
  renderer.render(escena, camara);
  dibujarHUD(estado === 'juego' ? dt : 0);
  if (estado === 'menu') dibujarMenu();
  /* la cortina (fundido al cambiar de nivel) */
  cortina = lerp(cortina, cortinaObj, Math.min(1, dt*5));
  if (cortinaObj === 1 && cortina > 0.97 && alTerminarCortina){ const f = alTerminarCortina; alTerminarCortina = null; cortina = 1; f(); }
  if (cortina > 0.01){ ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.fillStyle = 'rgba(10,12,40,' + cortina + ')'; ctx.fillRect(0, 0, W, H); if (cortina > 0.5) textoSombra('⚡', W/2, H/2, '#ffd43b', 50, 'center'); }
}
requestAnimationFrame(ciclo);
/* para las capturas de prueba */
window.SALO_VISTA = {escena, get M(){ return M; }, info: ()=>({llamadas: renderer.info.render.calls, triangulos: renderer.info.render.triangles, geometrias: renderer.info.memory.geometries}), entrarNivel, get G(){ return G; }, get P(){ return P; }, abrirMenu, get estado(){ return estado; }};
})();
