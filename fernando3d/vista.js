'use strict';
/* ============================================================
   FERNANDO 3D — la VISTA
   Dibuja con Three.js lo que el núcleo (nucleo.js) dice que pasa:
   el cielo, el agua, el pasto que se mueve con el viento, las
   sombras, el brillo, las partículas, Fernando, Tío Juan, los
   perritos y todo lo demás. También lee los controles (teclado,
   mando y pantalla táctil), suena, toca música y hace hablar a
   los personajes.
   ============================================================ */
(function(){
const F = window.F3D, MOD = window.F3D_MOD, THREE = window.THREE, CFG = F.CFG;
const TAU = Math.PI*2;
const clamp = F.clamp, lerp = F.lerp;

/* ---------------- guardar el progreso ---------------- */
const CLAVE = 'fernando3d.v1';
let progGuardado = null;
try{ progGuardado = JSON.parse(localStorage.getItem(CLAVE) || 'null'); }catch(e){}
const OPC = {sonido: true, musica: true, pj: 'fernando'};
try{ Object.assign(OPC, JSON.parse(localStorage.getItem('fernando3d.opciones') || '{}')); }catch(e){}
if (!F.PJS[OPC.pj]) OPC.pj = 'fernando';
let J = F.crearJuego({semilla: Math.floor(Math.random()*1e6), prog: progGuardado});
function guardar(){ try{ localStorage.setItem(CLAVE, JSON.stringify(J.prog)); localStorage.setItem('fernando3d.opciones', JSON.stringify(OPC)); }catch(e){} }
setInterval(guardar, 5000);
addEventListener('pagehide', guardar);

/* ---------------- el dibujante ---------------- */
const gl = document.getElementById('gl'), hud = document.getElementById('hud'), ctx = hud.getContext('2d');
const MOVIL = matchMedia('(pointer:coarse)').matches;
const renderer = new THREE.WebGLRenderer({canvas: gl, antialias: true, powerPreference: 'high-performance'});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
MOD.anisotropia = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const escena = new THREE.Scene();
const camara = new THREE.PerspectiveCamera(55, 1, 0.1, 1500);
let W = 1, H = 1, DPR = 1;
const CAL = {nivel: MOVIL ? 'media' : 'alta', medidas: 0, suma: 0, bajadas: 0};
const BLOOM = {on: false};

const hemi = new THREE.HemisphereLight('#cfe8ff', '#5a7a3a', 0.5);
const sol = new THREE.DirectionalLight('#fff2dc', 1.4);
sol.castShadow = true;
sol.shadow.camera.left = -30; sol.shadow.camera.right = 30; sol.shadow.camera.top = 30; sol.shadow.camera.bottom = -30;
sol.shadow.camera.near = 1; sol.shadow.camera.far = 160; sol.shadow.bias = -0.0005; sol.shadow.normalBias = 0.04;
escena.add(hemi, sol, sol.target);
const SOL_DIR = new THREE.Vector3(0.45, 0.8, 0.35).normalize();

function aplicarCalidad(){
  const q = CAL.nivel;
  const tope = q === 'alta' ? 2 : q === 'media' ? 1.5 : 1;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, tope));
  const sombras = q !== 'baja';
  if (renderer.shadowMap.enabled !== sombras){
    renderer.shadowMap.enabled = sombras;
    escena.traverse(o=>{ if (o.material){ const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m=>m.needsUpdate = true); } });
  }
  sol.castShadow = sombras;
  const t = q === 'alta' ? 2048 : 1024;
  if (sol.shadow.mapSize.x !== t){ sol.shadow.mapSize.set(t, t); if (sol.shadow.map){ sol.shadow.map.dispose(); sol.shadow.map = null; } }
  BLOOM.on = q === 'alta' && renderer.capabilities.isWebGL2;
  ajustar();
}
function ajustar(){
  W = innerWidth; H = innerHeight; DPR = Math.min(devicePixelRatio || 1, 2);
  renderer.setSize(W, H, false);
  gl.style.width = W + 'px'; gl.style.height = H + 'px';
  camara.aspect = W/H; camara.fov = W < H ? 72 : 55; camara.updateProjectionMatrix();
  hud.width = Math.round(W*DPR); hud.height = Math.round(H*DPR); hud.style.width = W + 'px'; hud.style.height = H + 'px';
  if (BLOOM.rt) prepararBloom();
  if (PART) PART.mat.uniforms.escala.value = H*renderer.getPixelRatio()*0.5;
}
addEventListener('resize', ajustar);

/* ---------------- el brillo (bloom) ---------------- */
const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
const quadEscena = new THREE.Scene(); quadEscena.add(quad);
const VERT_QUAD = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }';
const matBrillo = new THREE.ShaderMaterial({uniforms:{tex:{value:null}}, vertexShader: VERT_QUAD, depthTest:false, depthWrite:false,
  fragmentShader: 'uniform sampler2D tex; varying vec2 vUv; void main(){ vec3 c = texture2D(tex, vUv).rgb; float l = max(c.r, max(c.g, c.b)); float k = smoothstep(.86, 1.25, l); gl_FragColor = vec4(c*k, 1.); }'});
const matBlur = new THREE.ShaderMaterial({uniforms:{tex:{value:null}, dir:{value:new THREE.Vector2()}}, vertexShader: VERT_QUAD, depthTest:false, depthWrite:false,
  fragmentShader: `uniform sampler2D tex; uniform vec2 dir; varying vec2 vUv;
    void main(){ vec3 s = texture2D(tex, vUv).rgb*.227;
      s += texture2D(tex, vUv + dir*1.385).rgb*.316; s += texture2D(tex, vUv - dir*1.385).rgb*.316;
      s += texture2D(tex, vUv + dir*3.231).rgb*.07;  s += texture2D(tex, vUv - dir*3.231).rgb*.07;
      gl_FragColor = vec4(s, 1.); }`});
const matMezcla = new THREE.ShaderMaterial({uniforms:{escenaT:{value:null}, brilloT:{value:null}, fuerza:{value:0.55}}, vertexShader: VERT_QUAD, depthTest:false, depthWrite:false,
  fragmentShader: `uniform sampler2D escenaT, brilloT; uniform float fuerza; varying vec2 vUv;
    void main(){ vec3 c = texture2D(escenaT, vUv).rgb + texture2D(brilloT, vUv).rgb*fuerza;
      float v = smoothstep(.45, 1.15, length((vUv - .5)*vec2(1.2, 1.))*1.35); c *= 1. - v*.28;
      gl_FragColor = vec4(c, 1.); }`});
function prepararBloom(){
  const pw = Math.round(W*renderer.getPixelRatio()), ph = Math.round(H*renderer.getPixelRatio());
  ['rt', 'rtA', 'rtB'].forEach(k=>{ if (BLOOM[k]) BLOOM[k].dispose(); });
  const RT = THREE.WebGLMultisampleRenderTarget || THREE.WebGLRenderTarget;
  BLOOM.rt = new RT(pw, ph, {encoding: THREE.sRGBEncoding});
  BLOOM.rt.texture.encoding = THREE.sRGBEncoding;
  if (BLOOM.rt.samples !== undefined) BLOOM.rt.samples = 4;
  BLOOM.rtA = new THREE.WebGLRenderTarget(Math.max(1, pw >> 2), Math.max(1, ph >> 2));
  BLOOM.rtB = new THREE.WebGLRenderTarget(Math.max(1, pw >> 2), Math.max(1, ph >> 2));
}
function pasada(mat, destino){ quad.material = mat; renderer.setRenderTarget(destino); renderer.render(quadEscena, quadCam); }
function dibujar(){
  if (!BLOOM.on){ renderer.setRenderTarget(null); renderer.render(escena, camara); return; }
  if (!BLOOM.rt) prepararBloom();
  renderer.setRenderTarget(BLOOM.rt); renderer.render(escena, camara);
  matBrillo.uniforms.tex.value = BLOOM.rt.texture; pasada(matBrillo, BLOOM.rtA);
  for (let i = 0; i < 2; i++){
    matBlur.uniforms.tex.value = BLOOM.rtA.texture; matBlur.uniforms.dir.value.set((1 + i)/BLOOM.rtA.width, 0); pasada(matBlur, BLOOM.rtB);
    matBlur.uniforms.tex.value = BLOOM.rtB.texture; matBlur.uniforms.dir.value.set(0, (1 + i)/BLOOM.rtA.height); pasada(matBlur, BLOOM.rtA);
  }
  matMezcla.uniforms.escenaT.value = BLOOM.rt.texture; matMezcla.uniforms.brilloT.value = BLOOM.rtA.texture;
  pasada(matMezcla, null);
}

/* ---------------- el cielo ---------------- */
const TEMAS = {
  castillo: {top:'#2f86ff', hor:'#c4e8ff', bot:'#8ab8dc', sol:'#fff0d0', nubes:0.55, niebla:['#c4e8ff', 80, 330], hemi:['#d8ecff', '#5a7a3a', 0.7], solI:2.4, musica:'castillo', montes:'#5a9a6a'},
  pradera:  {top:'#3a8cff', hor:'#d0f0ff', bot:'#9ac8e8', sol:'#fff2d8', nubes:0.6, niebla:['#d0f0ff', 70, 300], hemi:['#d8ecff', '#4a7a2a', 0.7], solI:2.4, musica:'pradera', montes:'#4a8a5a'},
  playa:    {top:'#1a8cff', hor:'#bff4ff', bot:'#7ad0e8', sol:'#fff6e0', nubes:0.4, niebla:['#bff4ff', 80, 340], hemi:['#e0f4ff', '#c8a860', 0.6], solI:2.1, musica:'playa', montes:'#3aa880'},
  nieve:    {top:'#5a8ad8', hor:'#eaf2ff', bot:'#b8cce8', sol:'#fff8f0', nubes:0.75, niebla:['#e4eeff', 50, 240], hemi:['#eef4ff', '#8aa0c0', 0.85], solI:2.0, musica:'nieve', montes:'#c8d8f0'},
  nubes:    {top:'#4a88ff', hor:'#ffc8e8', bot:'#c8a8f0', sol:'#fff0f8', nubes:0.7, niebla:['#f8c8e8', 70, 260], hemi:['#fff0fa', '#a888d8', 0.75], solI:2.1, musica:'nubes', montes:null},
  maracaibo:{top:'#2a8cff', hor:'#ffe8b0', bot:'#f0c890', sol:'#fff0c0', nubes:0.45, niebla:['#ffe8c0', 80, 330], hemi:['#fff0d8', '#6a8a3a', 0.75], solI:2.6, musica:'maracaibo', montes:'#6a9a5a'},
  usa:      {top:'#3a7ae8', hor:'#d8e8ff', bot:'#a8c0e0', sol:'#fff4e0', nubes:0.5, niebla:['#d8e8ff', 90, 360], hemi:['#e0ecff', '#5a7a4a', 0.7], solI:2.3, musica:'usa', montes:'#6a8a9a'},
  italia:   {top:'#3a8cff', hor:'#ffe0c0', bot:'#e8c8a0', sol:'#fff0d0', nubes:0.35, niebla:['#ffe8d0', 80, 330], hemi:['#fff0e0', '#7a8a4a', 0.72], solI:2.4, musica:'italia', montes:'#8aa060'},
  china:    {top:'#5a9ad8', hor:'#f0e0e8', bot:'#c8c0d0', sol:'#fff0e8', nubes:0.6, niebla:['#ecdde6', 60, 280], hemi:['#f8eef4', '#6a8a5a', 0.75], solI:2.1, musica:'china', montes:'#7aa08a'},
  argentina:{top:'#3a9aff', hor:'#d8f0ff', bot:'#9ad0f0', sol:'#fff6d8', nubes:0.5, niebla:['#d8f0ff', 80, 330], hemi:['#e8f4ff', '#4a8a3a', 0.72], solI:2.4, musica:'argentina', montes:'#5a9a6a'},
  reino:    {top:'#2a7aff', hor:'#c8f0ff', bot:'#8ad0f0', sol:'#fff6e0', nubes:0.65, niebla:['#c8f0ff', 90, 380], hemi:['#e8f6ff', '#5a9a3a', 0.75], solI:2.5, musica:'reino', montes:'#6aa86a'},
  lava:     {top:'#12040a', hor:'#a03010', bot:'#3a0a04', sol:'#ff9a5a', nubes:0.35, niebla:['#6a1c0c', 35, 170], hemi:['#ff9a6a', '#3a0a04', 0.55], solI:1.6, musica:'lava', montes:'#2a1418'},
};
function colorV(hex){ const c = new THREE.Color(hex); return new THREE.Vector3(c.r, c.g, c.b); }
const matCielo = new THREE.ShaderMaterial({
  uniforms: {cTop:{value:colorV('#3a8cff')}, cHor:{value:colorV('#d0f0ff')}, cBot:{value:colorV('#9ac8e8')}, sunDir:{value:SOL_DIR.clone()}, sunCol:{value:colorV('#fff2d8')}, t:{value:0}, nubes:{value:0.6}},
  vertexShader: 'varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix*modelViewMatrix*vec4(position, 1.); gl_Position = p.xyww; }',
  fragmentShader: `uniform vec3 cTop, cHor, cBot, sunDir, sunCol; uniform float t, nubes; varying vec3 vDir;
    float hs(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
    float ns(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
      return mix(mix(hs(i), hs(i + vec2(1, 0)), f.x), mix(hs(i + vec2(0, 1)), hs(i + vec2(1, 1)), f.x), f.y); }
    float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a*ns(p); p = p*2.03 + 7.1; a *= .5; } return v; }
    void main(){
      vec3 d = normalize(vDir); float h = d.y;
      vec3 col = h > 0. ? mix(cHor, cTop, pow(h, .5)) : mix(cHor, cBot, pow(-h, .35));
      float s = max(dot(d, sunDir), 0.);
      col += sunCol*(pow(s, 600.)*3. + pow(s, 14.)*.28 + pow(s, 3.)*.08);
      if (h > 0.){
        vec2 uv = d.xz/(h + .18)*1.3 + vec2(t*.008, t*.003);
        float n = fbm(uv);
        float c = smoothstep(.52, .78, n)*nubes*smoothstep(.0, .22, h);
        vec3 cn = mix(vec3(1.), cHor, .25) + sunCol*pow(s, 6.)*.4;
        col = mix(col, cn, c*.9);
      }
      gl_FragColor = vec4(col, 1.);
    }`,
  side: THREE.BackSide, depthWrite: false, fog: false,
});
const cielo = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), matCielo);
cielo.renderOrder = -10; cielo.frustumCulled = false;
escena.add(cielo);
const pmrem = new THREE.PMREMGenerator(renderer);
let envRT = null;
function prepararCielo(tema){
  const T = TEMAS[tema];
  matCielo.uniforms.cTop.value = colorV(T.top); matCielo.uniforms.cHor.value = colorV(T.hor); matCielo.uniforms.cBot.value = colorV(T.bot);
  matCielo.uniforms.sunCol.value = colorV(T.sol); matCielo.uniforms.nubes.value = T.nubes;
  escena.fog = new THREE.Fog(T.niebla[0], T.niebla[1], T.niebla[2]);
  hemi.color.set(T.hemi[0]); hemi.groundColor.set(T.hemi[1]); hemi.intensity = T.hemi[2]*0.62;
  sol.color.set(T.sol); sol.intensity = T.solI*0.6;
  /* reflejos del cielo en las cosas brillantes: un cielo pintado en un lienzo */
  try{
    const lz = document.createElement('canvas'); lz.width = 256; lz.height = 128;
    const x = lz.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, T.top); g.addColorStop(0.48, T.hor); g.addColorStop(0.52, T.hor); g.addColorStop(1, T.bot);
    x.fillStyle = g; x.fillRect(0, 0, 256, 128);
    const sg = x.createRadialGradient(80, 34, 0, 80, 34, 40); sg.addColorStop(0, T.sol); sg.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = sg; x.fillRect(0, 0, 256, 128);
    const tx = new THREE.CanvasTexture(lz); tx.mapping = THREE.EquirectangularReflectionMapping; tx.encoding = THREE.sRGBEncoding;
    const nuevo = pmrem.fromEquirectangular(tx);
    tx.dispose();
    if (envRT) envRT.dispose();
    envRT = nuevo; escena.environment = envRT.texture;
  }catch(err){ escena.environment = null; }
}

/* ---------------- el agua (o la lava, o el mar de nubes) ---------------- */
const matAgua = new THREE.ShaderMaterial({
  uniforms: {t:{value:0}, tipo:{value:0}, cProf:{value:colorV('#0a5aa8')}, cClaro:{value:colorV('#2ac8e8')}, cCielo:{value:colorV('#c8f0ff')},
             sunDir:{value:SOL_DIR.clone()}, camPos:{value:new THREE.Vector3()}, fogC:{value:colorV('#c8f0ff')}, fogN:{value:60}, fogF:{value:300}},
  vertexShader: 'varying vec3 vW; varying float vD; void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vec4 mv = viewMatrix*w; vD = -mv.z; gl_Position = projectionMatrix*mv; }',
  fragmentShader: `uniform float t, tipo, fogN, fogF; uniform vec3 cProf, cClaro, cCielo, sunDir, camPos, fogC; varying vec3 vW; varying float vD;
    float hs(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
    float ns(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
      return mix(mix(hs(i), hs(i + vec2(1, 0)), f.x), mix(hs(i + vec2(0, 1)), hs(i + vec2(1, 1)), f.x), f.y); }
    float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a*ns(p); p = p*2.1 + 3.7; a *= .5; } return v; }
    float ola(vec2 p){ return sin(p.x*.32 + t*1.2)*.35 + sin(p.y*.41 - t*1.05)*.3 + sin((p.x + p.y)*.83 + t*2.1)*.15 + ns(p*.9 + t*.4)*.35; }
    void main(){
      vec2 p = vW.xz; vec3 col; float al = .9;
      vec3 v = normalize(camPos - vW);
      if (tipo < 1.5){
        float e = .2, h0 = ola(p), hx = ola(p + vec2(e, 0.)), hz = ola(p + vec2(0., e));
        vec3 n = normalize(vec3(h0 - hx, e*3.2, h0 - hz));
        float fr = pow(1. - max(dot(n, v), 0.), 3.);
        col = mix(cProf, cClaro, clamp(.45 + h0*.35, 0., 1.));
        col = mix(col, cCielo, fr*.65);
        vec3 r = reflect(-sunDir, n);
        col += vec3(1., .96, .88)*pow(max(dot(r, v), 0.), 160.)*2.5;
        col += step(.93, ns(p*2.6 + vec2(t*.6, -t*.4)))*.25*(1. - fr);
        if (tipo > .5){ float k = smoothstep(.55, .75, fbm(p*.18)); col = mix(col, vec3(.92, .97, 1.), k*.85); }
      } else if (tipo < 2.5){
        float c = fbm(p*.12 + vec2(t*.03, t*.01)), k = smoothstep(.5, .8, c);
        col = mix(vec3(.45, .05, .02), vec3(1., .45, .05), k) + vec3(1., .7, .2)*pow(ns(p*.9 - t*.35), 10.)*.9;
        col *= .8 + .2*sin(t*1.5 + c*8.); al = 1.;
      } else {
        float c = fbm(p*.05 + vec2(t*.01, 0.)); float k = smoothstep(.35, .8, c);
        col = mix(cProf, vec3(1., .97, 1.), k*.75); al = 1.;
      }
      float f = smoothstep(fogN, fogF, vD);
      col = mix(col, fogC, f);
      gl_FragColor = vec4(col, al);
    }`,
  transparent: true,
});
const agua = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400, 1, 1), matAgua);
agua.rotation.x = -Math.PI/2;
escena.add(agua);

/* ---------------- partículas (chispas, polvo, fuego, confeti) ---------------- */
let PART = null;
function crearParticulas(n){
  const pos = new Float32Array(n*3), col = new Float32Array(n*3), tam = new Float32Array(n), alf = new Float32Array(n);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('tam', new THREE.BufferAttribute(tam, 1));
  geo.setAttribute('alf', new THREE.BufferAttribute(alf, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: {escala:{value: 400}},
    vertexShader: `attribute float tam; attribute float alf; varying vec3 vC; varying float vA; uniform float escala;
      void main(){ vC = color; vA = alf; vec4 mv = modelViewMatrix*vec4(position, 1.); gl_PointSize = tam*escala/max(.5, -mv.z); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, .0, d)*vA; if (a < .01) discard; gl_FragColor = vec4(vC*a, a); }`,
    vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const pts = new THREE.Points(geo, mat); pts.frustumCulled = false;
  escena.add(pts);
  return {n, pos, col, tam, alf, geo, mat, pts, vel: new Float32Array(n*3), vida: new Float32Array(n), max: new Float32Array(n), grav: new Float32Array(n), t0: new Float32Array(n), sig: 0};
}
PART = crearParticulas(2400);
const _c = new THREE.Color();
function emitir(x, y, z, n, o){
  o = o || {};
  const P = PART;
  for (let k = 0; k < n; k++){
    const i = P.sig; P.sig = (P.sig + 1) % P.n;
    const a = Math.random()*TAU, b = Math.random()*2 - 1, v = (o.vel == null ? 4 : o.vel)*(0.4 + Math.random()*0.6);
    const sb = Math.sqrt(1 - b*b);
    const es = o.esparce || 0;
    P.pos[i*3] = x + (Math.random() - 0.5)*es; P.pos[i*3 + 1] = y + (Math.random() - 0.5)*es*0.5; P.pos[i*3 + 2] = z + (Math.random() - 0.5)*es;
    P.vel[i*3] = Math.cos(a)*sb*v + (o.vx || 0); P.vel[i*3 + 1] = b*v*(o.plano ? 0.2 : 1) + (o.vy || 0); P.vel[i*3 + 2] = Math.sin(a)*sb*v + (o.vz || 0);
    const cs = o.colores || [o.color || '#ffffff'];
    _c.set(cs[Math.floor(Math.random()*cs.length)]);
    P.col[i*3] = _c.r; P.col[i*3 + 1] = _c.g; P.col[i*3 + 2] = _c.b;
    P.max[i] = P.vida[i] = (o.vida || 0.8)*(0.6 + Math.random()*0.6);
    P.t0[i] = (o.tam || 0.25)*(0.6 + Math.random()*0.8);
    P.grav[i] = o.grav == null ? 6 : o.grav;
  }
}
function moverParticulas(dt){
  const P = PART;
  for (let i = 0; i < P.n; i++){
    if (P.vida[i] <= 0){ P.alf[i] = 0; continue; }
    P.vida[i] -= dt;
    P.vel[i*3 + 1] -= P.grav[i]*dt;
    P.pos[i*3] += P.vel[i*3]*dt; P.pos[i*3 + 1] += P.vel[i*3 + 1]*dt; P.pos[i*3 + 2] += P.vel[i*3 + 2]*dt;
    const k = P.vida[i]/P.max[i];
    P.alf[i] = Math.min(1, k*2); P.tam[i] = P.t0[i]*(0.4 + k*0.6);
  }
  P.geo.attributes.position.needsUpdate = true; P.geo.attributes.color.needsUpdate = true;
  P.geo.attributes.tam.needsUpdate = true; P.geo.attributes.alf.needsUpdate = true;
}
/* ambiente: nieve, chispas de lava, pétalos, brillitos — siempre alrededor de la cámara */
const AMB = (function(){
  const n = MOVIL ? 300 : 600;
  const pos = new Float32Array(n*3), fase = new Float32Array(n);
  for (let i = 0; i < n; i++){ pos[i*3] = (Math.random() - 0.5)*60; pos[i*3 + 1] = Math.random()*30; pos[i*3 + 2] = (Math.random() - 0.5)*60; fase[i] = Math.random()*TAU; }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({size: 0.18, map: MOD.TEX_HALO, transparent:true, depthWrite:false, blending: THREE.AdditiveBlending, color:'#ffffff', opacity:0.8});
  const pts = new THREE.Points(geo, mat); pts.frustumCulled = false; escena.add(pts);
  return {n, pos, fase, geo, mat, pts, tipo:'brillo'};
})();
function prepararAmbiente(tema){
  const t = {nieve:['nieve', '#ffffff', 0.22, 0.9], lava:['brasa', '#ff7a2a', 0.2, 1], playa:['brillo', '#fff6c0', 0.12, 0.5], nubes:['brillo', '#ffd0f0', 0.16, 0.7],
             pradera:['polen', '#fff6a0', 0.1, 0.6], castillo:['polen', '#fff6a0', 0.1, 0.6],
             maracaibo:['polen', '#fff6a0', 0.1, 0.6], usa:['brillo', '#ffffff', 0.1, 0.4], italia:['polen', '#fff6c0', 0.1, 0.5],
             china:['nieve', '#ffb0d0', 0.2, 0.9], argentina:['nieve', '#cfeeff', 0.16, 0.8], reino:['brillo', '#e0c0ff', 0.14, 0.6]}[tema] || ['polen', '#fff6a0', 0.1, 0.6];
  AMB.tipo = t[0]; AMB.mat.color.set(t[1]); AMB.mat.size = t[2]; AMB.mat.opacity = t[3];
}
function moverAmbiente(dt, t){
  const c = camara.position;
  for (let i = 0; i < AMB.n; i++){
    let x = AMB.pos[i*3], y = AMB.pos[i*3 + 1], z = AMB.pos[i*3 + 2];
    if (AMB.tipo === 'nieve'){ y -= dt*2.2; x += Math.sin(t + AMB.fase[i])*dt*0.8; }
    else if (AMB.tipo === 'brasa'){ y += dt*2.5; x += Math.sin(t*2 + AMB.fase[i])*dt; }
    else { y += Math.sin(t + AMB.fase[i])*dt*0.3; x += Math.cos(t*0.7 + AMB.fase[i])*dt*0.4; }
    if (x - c.x > 30) x -= 60; if (x - c.x < -30) x += 60;
    if (z - c.z > 30) z -= 60; if (z - c.z < -30) z += 60;
    if (y - c.y > 18) y -= 32; if (y - c.y < -14) y += 32;
    AMB.pos[i*3] = x; AMB.pos[i*3 + 1] = y; AMB.pos[i*3 + 2] = z;
  }
  AMB.geo.attributes.position.needsUpdate = true;
}

/* ---------------- los personajes que siempre están ---------------- */
/* el personaje que uno eligió (Fernando, Lucca, Salomón o Cucú) */
function modeloPj(pj){ const P = F.PJS[pj] || F.PJS.fernando; return MOD.crearFernando({gorra: P.gorra, overol: P.overol, letra: P.letra, nina: P.nina}); }
let fer = modeloPj(OPC.pj); escena.add(fer.g);
J.pj = OPC.pj;
function cambiarPj(pj){
  if (!F.PJS[pj] || pj === OPC.pj) return;
  OPC.pj = pj; J.pj = pj; escena.remove(fer.g); fer = modeloPj(pj); escena.add(fer.g); vestirHQ(fer); guardar();
  emitir(J.p.x, J.p.y + 1, J.p.z, 40, {colores:['#ffffff', F.PJS[pj].gorra], vel:5, grav:1, vida:0.8, tam:0.4});
}
const tio = MOD.crearTio(); escena.add(tio.g);
const perros = [MOD.crearPerro('#1e1e22', 'penny'), MOD.crearPerro('#9a6230', 'sheldon')];
perros.forEach(p=>escena.add(p.g));
const sombraTex = MOD.lienzo(64, 64, (x)=>{ const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(0,0,0,0.5)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); }, false);
function sombraBlob(r){
  const m = new THREE.Mesh(new THREE.PlaneGeometry(r*2, r*2), new THREE.MeshBasicMaterial({map: sombraTex, transparent:true, depthWrite:false}));
  m.rotation.x = -Math.PI/2; m.renderOrder = 1; escena.add(m); return m;
}
const sombraFer = sombraBlob(0.6), sombraTio = sombraBlob(0.7);
/* la flecha amarilla que guía */
const flecha = new THREE.Group();
{
  const m = MOD.std('#ffd23f', {emissive:'#ffb000', emissiveIntensity:0.9, roughness:0.3, metalness:0.3});
  const c = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.6, 16), m); c.rotation.x = Math.PI/2; c.position.z = 0.3; flecha.add(c);
  const p = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 10), m); p.rotation.x = Math.PI/2; p.position.z = -0.2; flecha.add(p);
  const h = MOD.halo('#ffd23f', 1.6, 0.5); flecha.add(h);
}
escena.add(flecha);
/* bolas de fuego */
const bolasM = [];
/* cómo se ve lo que sale de cada arma de juguete */
const ASPECTO_ARMA = {
  agua:     {color:'#7ad8ff', tam:0.16, estela:0.8, colores:['#bfeaff', '#7ad8ff'], grav:3},
  burbujas: {color:'#e8f6ff', tam:0.55, estela:0.15, colores:['#ffffff', '#ffb0e0'], grav:-0.5, transp:true},
  dardos:   {color:'#ff8a1a', tam:0.12, estela:0.4, colores:['#ffffff', '#ff8a1a'], grav:0},
  confeti:  {color:'#ff5ab0', tam:0.3, estela:1, colores:['#ff5ab0', '#ffd23f', '#5ad8ff', '#7ae05a'], grav:2},
  globos:   {color:'#ff3a3a', tam:0.32, estela:0.1, colores:['#ffffff'], grav:0},
};
const FUEGOS = [];
function fuegoMesh(i){ if (!FUEGOS[i]){ FUEGOS[i] = MOD.fuegoMalo ? MOD.fuegoMalo() : new THREE.Group(); escena.add(FUEGOS[i]); } return FUEGOS[i]; }
const burbujaEscudo = {t: 0, m: (()=>{ const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshBasicMaterial({color:'#5ab8ff', transparent:true, opacity:0.4, depthWrite:false})); m.visible = false; escena.add(m); return m; })()};
function bolaMesh(i){
  if (!bolasM[i]){
    const g = new THREE.Group();
    g.add(new THREE.Mesh(MOD.GEO.esfera, new THREE.MeshBasicMaterial({color:'#ffd27a'})));
    g.children[0].scale.setScalar(0.22);
    g.add(MOD.halo('#ff7a20', 1.6, 0.9));
    escena.add(g); bolasM[i] = g;
  }
  return bolasM[i];
}

/* ============================================================
   PERSONAJES 3D DE ALTA CALIDAD (activos.js, hechos con Higgsfield)
   Fernando con esqueleto y animaciones, y Tío Juan volando. Se
   cargan mientras se juega; hasta que lleguen (o si no llegan) se
   ven los personajes hechos con piezas.
   ============================================================ */
const ACT = window.F3D_ACTIVOS || null;
const HQ = {fer: null, tio: null};
/* la animación no debe mover al personaje de lugar (eso lo hace el juego): se fija la cadera en x y z */
function clipQuieto(clip, sinAltura){
  if (!clip) return null;
  const c = clip.clone();
  c.tracks = c.tracks.filter(t=>!/\.position$/.test(t.name) || /Hips/.test(t.name));
  for (const t of c.tracks){
    if (!/Hips\.position$/.test(t.name)) continue;
    const v = t.values, x0 = v[0], y0 = v[1], z0 = v[2];
    for (let i = 0; i < v.length; i += 3){ v[i] = x0; v[i + 2] = z0; if (sinAltura) v[i + 1] = y0 + (v[i + 1] - y0)*0.25; }
  }
  return c;
}
function cargarActivos(){
  if (!ACT) return;
  try{
    const tl = new THREE.TextureLoader(); tl.setCrossOrigin('anonymous');
    for (const k in ACT.texturas) tl.load(ACT.texturas[k], t=>{ try{ MOD.mejorarTextura(k, t.image); }catch(e){} }, undefined, ()=>{});
  }catch(e){}
  if (!THREE.GLTFLoader || !THREE.SkeletonUtils) return;
  const gl = new THREE.GLTFLoader(); gl.setCrossOrigin('anonymous');
  const cargar = url=>new Promise((ok, mal)=>gl.load(url, ok, undefined, mal));
  cargar(ACT.fernando.modelo).then(async g=>{
    const clips = {correr: clipQuieto(g.animations[0], false)};
    await Promise.all(['quieto', 'salto', 'baile'].map(k=>cargar(ACT.fernando[k]).then(a=>{ clips[k] = clipQuieto(a.animations[0], k === 'salto'); }).catch(()=>{})));
    HQ.fer = {escena: g.scene, clips};
    vestirHQ(fer);
  }).catch(e=>console.warn('No llegó el modelo 3D de Fernando: ' + (e && e.message)));
  cargar(ACT.tio.modelo).then(g=>{ HQ.tio = g.scene; vestirTioHQ(); }).catch(e=>console.warn('No llegó el modelo 3D de Tío Juan: ' + (e && e.message)));
}
/* le pone el Fernando de alta calidad a un muñeco (el propio o el de un amigo que juega con Fernando) */
function vestirHQ(m, pj){
  if (!HQ.fer || !m || m.hq || (pj || OPC.pj) !== 'fernando') return;
  const raiz = THREE.SkeletonUtils.clone(HQ.fer.escena);
  const mats = [];
  raiz.traverse(o=>{
    if (!o.isMesh) return;
    o.castShadow = true; o.frustumCulled = false;
    o.material = o.material.clone(); o.material.metalness = 0; o.material.roughness = 0.62;
    mats.push(o.material);
  });
  /* en un modelo con esqueleto el tamaño real es el de la malla tal cual (los huesos ya traen su escala) */
  let alto = 1.2, piso = 0;
  raiz.traverse(o=>{ if (o.isSkinnedMesh && o.geometry){ o.geometry.computeBoundingBox(); const bb = o.geometry.boundingBox; alto = Math.max(0.1, bb.max.y - bb.min.y); piso = bb.min.y; } });
  const k = (ACT.fernando.alto || 1.55)/alto;
  const cont = new THREE.Group(); cont.add(raiz); cont.scale.setScalar(k); cont.position.y = -piso*k;
  const mixer = new THREE.AnimationMixer(raiz), acc = {};
  for (const n in HQ.fer.clips) if (HQ.fer.clips[n]) acc[n] = mixer.clipAction(HQ.fer.clips[n]);
  m.cuerpo.visible = false;
  m.g.add(cont);
  m.g.add(m.alas); m.alas.position.set(0, 1.42, -0.05);
  m.hq = {cont, raiz, mixer, acc, actual: '', mats};
}
function animarHQ(h, est, dt, t){
  let q = 'quieto';
  if (est.baile) q = 'baile';
  else if (est.nada) q = est.vel > 0.6 ? 'correr' : 'quieto';
  else if (!est.suelo) q = 'salto';
  else if (est.vel > 0.6) q = 'correr';
  if (!h.acc[q]) q = h.acc.quieto ? 'quieto' : 'correr';
  if (h.actual !== q){
    const a = h.acc[q];
    a.reset();
    if (q === 'salto'){ a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; a.time = a.getClip().duration*0.28; }
    a.fadeIn(0.12).play();
    if (h.actual && h.acc[h.actual]) h.acc[h.actual].fadeOut(0.12);
    h.actual = q;
  }
  if (h.acc.correr) h.acc.correr.timeScale = est.nada ? 0.8 : clamp(est.vel/6, 0.7, 1.8);
  h.mixer.update(dt);
  /* poderes: fuego → brillo naranja; hamburguesa → arcoíris */
  const pod = est.poder;
  for (const mt of h.mats){
    if (pod === 'hamburguesa'){ mt.emissive.copy(arcoiris(t)); mt.emissiveIntensity = 0.45; }
    else if (pod === 'fuego'){ mt.emissive.set('#ff6a1a'); mt.emissiveIntensity = 0.18 + Math.sin(t*8)*0.08; }
    else if (pod === 'tenis'){ mt.emissive.set('#3aff8a'); mt.emissiveIntensity = 0.1; }
    else if (pod === 'fuerza'){ mt.emissive.set('#ff2a2a'); mt.emissiveIntensity = 0.22 + Math.sin(t*10)*0.1; }
    else if (pod === 'clon'){ mt.emissive.set('#8a4aff'); mt.emissiveIntensity = 0.12; }
    else mt.emissiveIntensity = 0;
  }
  /* la inclinación de volar se va poniendo de a poco (nada de cambios de golpe) */
  const inclMeta = est.vuela ? 0.9 : est.nada && est.vel > 0.6 ? 1.2 : 0;
  h.incl = (h.incl || 0) + (inclMeta - (h.incl || 0))*Math.min(1, dt*(est.nada ? 4 : 6));
  h.cont.rotation.set(h.incl, est.giro ? est.giroA : 0, 0);
  /* acostado nadando gira desde los pies: se sube para que el cuerpo quede en la superficie */
  if (h.y0 == null) h.y0 = h.cont.position.y;
  h.cont.position.y = h.y0 + (est.nada ? h.incl/1.2*0.8 : 0);
}
/* Tío Juan volando: el modelo ya viene en pose de superhéroe */
function vestirTioHQ(){
  if (!HQ.tio || tio.hq) return;
  const raiz = HQ.tio.clone(true);
  raiz.traverse(o=>{ if (o.isMesh){ o.castShadow = true; o.material = o.material.clone(); o.material.metalness = 0; o.material.roughness = 0.6; } });
  raiz.updateMatrixWorld(true);
  const caja = new THREE.Box3().setFromObject(raiz), tam = new THREE.Vector3(); caja.getSize(tam);
  const centro = new THREE.Vector3(); caja.getCenter(centro);
  const k = (ACT.tio.largo || 2.3)/Math.max(tam.x, tam.z, 0.1);
  raiz.position.sub(centro).multiplyScalar(k); raiz.scale.multiplyScalar(k);
  const giro = new THREE.Group(); giro.rotation.y = ACT.tio.giro || 0; giro.add(raiz);
  const cont = new THREE.Group(); cont.add(giro); cont.position.y = 1.1;
  tio.cuerpo.visible = false;
  tio.g.add(cont);
  tio.hq = {cont};
}

/* ---------------- construir el mundo ---------------- */
let MUNDO = null;   // todo lo del mundo actual: {grupo, solidos, monedas, rojas, estrellas, cajas, enemigos, portales, amigos, resortes, ...}
let cargaVista = -1;
function limpiar(obj){
  obj.traverse(o=>{
    if (o.geometry && !o.geometry.userData.compartida) o.geometry.dispose();
  });
}
const R0 = MOD.rng;
function construirMundo(){
  if (MUNDO){ escena.remove(MUNDO.grupo); limpiar(MUNDO.grupo); }
  const M = J.M, def = M.def, T = TEMAS[def.tema];
  const grupo = new THREE.Group();
  const W0 = {grupo, solidos: [], monedas: [], rojas: [], estrellas: [], pelotas: [], pociones: [], animPais: [], rayo: null, cajas: new Map(), enemigos: new Map(), portales: [], amigos: [], resortes: [], giran: [], antorchas: [], globos: [], ocluyen: [], tubo: null};
  MUNDO = W0;
  prepararCielo(def.tema);
  prepararAmbiente(def.tema);
  /* agua */
  if (def.agua){
    agua.visible = true; agua.position.y = def.agua.y;
    const tipo = def.agua.tipo;
    matAgua.uniforms.tipo.value = tipo === 'lava' ? 2 : tipo === 'hielo' ? 1 : 0;
    const cs = tipo === 'mar' ? ['#0a6ab8', '#2ae0e0'] : tipo === 'hielo' ? ['#1a4a7a', '#5aa8d8'] : ['#0a5aa8', '#2ac0e8'];
    matAgua.uniforms.cProf.value = colorV(cs[0]); matAgua.uniforms.cClaro.value = colorV(cs[1]);
  } else {
    agua.visible = true; agua.position.y = def.yMuerte + 2;
    matAgua.uniforms.tipo.value = 3; matAgua.uniforms.cProf.value = colorV('#b8a0f0');
  }
  matAgua.uniforms.cCielo.value = colorV(T.hor); matAgua.uniforms.fogC.value = colorV(T.niebla[0]);
  matAgua.uniforms.fogN.value = T.niebla[1]; matAgua.uniforms.fogF.value = T.niebla[2];
  /* el suelo */
  const fondo = def.agua ? def.agua.y - 4 : def.yMuerte - 2;
  for (const s of M.solidos){
    if (s.resorte){
      const r = MOD.crearResorte(); r.position.set(s.x, s.y1 - 0.45, s.z); grupo.add(r);
      W0.resortes.push({s, g:r, apretado:0}); continue;
    }
    if (s.tubo){ const t = MOD.crearTubo(); t.position.set(s.x, s.y1, s.z); grupo.add(t); W0.tubo = t; continue; }
    const g = MOD.piezaSuelo(s, fondo);
    if (MOD.vestirPieza) MOD.vestirPieza(s, g);
    grupo.add(g);
    W0.solidos.push({s, g, by: g.position.y - s.y1});
  }
  /* los pisos pintados: calles, plazas y la cancha */
  if (MOD.piso) for (const p of (def.pisos || [])) grupo.add(MOD.piso(p));
  /* las pociones de escudo */
  W0.pociones = MOD.pocion ? (M.pociones || []).map(q=>{ const g = MOD.pocion(); g.position.set(q.x, q.y - 0.4, q.z); grupo.add(g); return {q, g}; }) : [];
  /* la pelota de fútbol */
  W0.pelotas = (M.pelotas || []).map(b=>{ const g = MOD.pelota(); grupo.add(g); return {b, g, giro: b.giro}; });
  /* pasto que se mueve con el viento */
  pasto(grupo, M);
  /* adornos */
  adornos(grupo, M, T);
  /* monedas */
  for (const m of M.monedas){ const me = MOD.crearMoneda(false); me.position.set(m.x, m.y, m.z); grupo.add(me); W0.monedas.push({m, me}); }
  const balones = def.fraseRoja === 'balon' && MOD.balonOro;   /* en Argentina las rojas son Balones de Oro */
  for (const m of M.rojas){ const me = balones ? MOD.balonOro() : MOD.crearMoneda(true); me.position.set(m.x, m.y, m.z); me.add(MOD.halo(balones ? '#ffd23f' : '#ff3a4a', 1.6, 0.6)); grupo.add(me); W0.rojas.push({m, me}); }
  /* estrellas */
  for (const s of M.estrellas){
    const g = MOD.crearEstrella(s.ya && !s.grande, s.grande);
    g.position.set(s.x, s.y, s.z);
    const h = MOD.halo(s.ya && !s.grande ? '#7ab0ff' : '#ffd23f', s.grande ? 7 : 3.4, 0.75); g.add(h);
    const col = MOD.columnaLuz(s.ya && !s.grande ? '#7ab0ff' : '#ffe27a'); col.position.y = 18 - 0; g.add(col);
    g.visible = s.visible; grupo.add(g);
    W0.estrellas.push({s, g, col, aparece: s.visible ? 1 : 0});
  }
  /* cuadros mágicos del castillo */
  for (const po of M.portales){
    const d = F.MUNDOS[po.mundo];
    const color = d.color || {pradera:'#4ae060', playa:'#3ad0ff', nieve:'#bfe8ff', nubes:'#ff9ae0', lava:'#ff5a2a'}[d.id];
    const g = MOD.crearPortal(po.mundo, d.nombre, d.emoji, color, po.necesita, d.corto);
    g.position.set(po.x, po.y, po.z); g.rotation.y = po.ang; grupo.add(g);
    W0.portales.push({po, g});
  }
  /* amigos */
  for (const a of M.amigos){
    const g = a.quien === 'abu' ? MOD.crearAbu() : MOD.crearSanti();
    g.position.set(a.x, a.y, a.z); grupo.add(g);
    const cartel = cartelito(a.quien === 'abu' ? 'ABU' : 'SANTI', a.quien === 'abu' ? '#d8a0ff' : '#8ecbff');
    cartel.position.y = a.quien === 'abu' ? 2.3 : 1.7; g.add(cartel);
    W0.amigos.push({a, g});
  }
  escena.add(grupo);
  prepararMinimapa(M);
  /* los enemigos y las cajas se crean al vuelo (puede haber nuevos) */
  sincronizarEnemigos(); sincronizarCajas();
  cargaVista = J.cargas;
  cam.ang = J.camA; cam.listo = false;
  banner = {texto: def.nombre, emoji: def.emoji, t: 0};
  musica.tema(T.musica);
}
function cartelito(texto, color){
  const t = MOD.lienzo(256, 80, (x, w, h)=>{
    x.fillStyle = 'rgba(20,16,40,0.8)'; x.beginPath(); x.roundRect ? x.roundRect(4, 4, w - 8, h - 8, 26) : x.rect(4, 4, w - 8, h - 8); x.fill();
    x.fillStyle = color; x.font = 'bold 44px Fredoka, Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(texto, w/2, h/2 + 2);
  }, false);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({map: t, transparent:true, depthWrite:false}));
  s.scale.set(1.6, 0.5, 1);
  return s;
}

function enPiso(M, x, z, m){ for (const p of (M.def.pisos || [])) if (Math.abs(x - p.x) < p.sx + (m || 0) && Math.abs(z - p.z) < p.sz + (m || 0)) return true; return false; }
/* el pasto: miles de hojitas instanciadas que se mueven con el viento */
const uViento = {value: 0};
function pasto(grupo, M){
  const cuantas = {alta: 14000, media: 6000, baja: 1500}[CAL.nivel];
  const verdes = M.solidos.filter(s=>s.mat === 'pasto' && !s.mov);
  if (!verdes.length || !cuantas) return;
  const area = s=>s.t === 'cil' ? Math.PI*s.r*s.r : 4*s.sx*s.sz;
  const total = verdes.reduce((n, s)=>n + area(s), 0);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-0.06, 0, 0, 0.06, 0, 0, 0, 1, 0, 0, 0, -0.05, 0, 0, 0.05, 0, 1, 0]), 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]), 3));
  const cb = new THREE.Color('#2a6a1a').convertSRGBToLinear(), ct = new THREE.Color('#9af06a').convertSRGBToLinear();
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array([cb.r, cb.g, cb.b, cb.r, cb.g, cb.b, ct.r, ct.g, ct.b, cb.r, cb.g, cb.b, cb.r, cb.g, cb.b, ct.r, ct.g, ct.b]), 3));
  const mat = new THREE.MeshStandardMaterial({vertexColors: true, side: THREE.DoubleSide, roughness: 0.9});
  mat.onBeforeCompile = sh=>{
    sh.uniforms.uViento = uViento;
    sh.vertexShader = 'uniform float uViento;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      #ifdef USE_INSTANCING
        vec4 base0 = instanceMatrix*vec4(0., 0., 0., 1.);
        float k = position.y;
        transformed.x += sin(uViento*2.1 + base0.x*.35 + base0.z*.22)*k*.22;
        transformed.z += cos(uViento*1.6 + base0.x*.18 - base0.z*.3)*k*.12;
      #endif`);
  };
  const inst = new THREE.InstancedMesh(geo, mat, cuantas);
  const R = R0(J.mundo*101 + 5), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3();
  const color = new THREE.Color();
  let n = 0, intentos = 0;
  while (n < cuantas && intentos < cuantas*3){
    intentos++;
    let u = R()*total, s = verdes[0];
    for (const x of verdes){ u -= area(x); if (u <= 0){ s = x; break; } }
    let x, z;
    if (s.t === 'cil'){ const a = R()*TAU, r = Math.sqrt(R())*(s.r - 0.15); x = s.x + Math.sin(a)*r; z = s.z + Math.cos(a)*r; }
    else { x = s.x + (R()*2 - 1)*s.sx; z = s.z + (R()*2 - 1)*s.sz; }
    if (F.suelo(M, x, z, 300, 0).s !== s || enPiso(M, x, z)) continue;
    const h = 0.25 + R()*0.35;
    e.set(0, R()*TAU, 0); q.setFromEuler(e); v.set(x, s.y1, z); sc.set(1 + R(), h, 1);
    m4.compose(v, q, sc); inst.setMatrixAt(n, m4);
    color.setHSL(0.27 + R()*0.06, 0.6, 0.45 + R()*0.25); inst.setColorAt(n, color);
    n++;
  }
  inst.count = n;
  inst.receiveShadow = CAL.nivel === 'alta';
  grupo.add(inst);
  /* florecitas */
  const nf = Math.min(400, Math.round(n*0.025));
  const flor = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.1, 0), new THREE.MeshStandardMaterial({roughness:0.5}), nf);
  const cols = ['#ffffff', '#ffe36e', '#ff7ab0', '#b08aff', '#ff6a4a'];
  let k = 0;
  for (let i = 0; i < nf*3 && k < nf; i++){
    const s = verdes[Math.floor(R()*verdes.length)];
    let x, z;
    if (s.t === 'cil'){ const a = R()*TAU, r = Math.sqrt(R())*(s.r - 0.3); x = s.x + Math.sin(a)*r; z = s.z + Math.cos(a)*r; }
    else { x = s.x + (R()*2 - 1)*s.sx; z = s.z + (R()*2 - 1)*s.sz; }
    if (F.suelo(M, x, z, 300, 0).s !== s || enPiso(M, x, z)) continue;
    v.set(x, s.y1 + 0.28, z); sc.set(1, 0.6, 1); q.identity(); m4.compose(v, q, sc); flor.setMatrixAt(k, m4);
    color.set(cols[Math.floor(R()*cols.length)]).convertSRGBToLinear(); flor.setColorAt(k, color); k++;
  }
  flor.count = k;
  grupo.add(flor);
}

/* adornos: árboles, palmeras, pinos, rocas, montañas lejanas, nubes en el cielo */
function adornos(grupo, M, T){
  const def = M.def, D = def.deco || {};
  const R = R0(J.mundo*977 + 3);
  const base = M.solidos[0];
  const evitar = [];
  evitar.push([def.inicio.x, def.inicio.z, 5]);
  if (def.tubo) evitar.push([def.tubo.x, def.tubo.z, 3]);
  for (const p of (def.portales || [])) evitar.push([p.x, p.z, 5]);
  for (const c of def.cajas) evitar.push([c.x, c.z, 2.5]);
  for (const e of M.estrellas) evitar.push([e.x, e.z, 3]);
  for (const m of M.rojas) evitar.push([m.x, m.z, 2]);
  for (const a of M.amigos) evitar.push([a.x, a.z, 2.5]);
  if (def.jefe) evitar.push([def.jefe.x, def.jefe.z, def.jefe.r]);
  for (const s of M.solidos) if (s !== base) evitar.push([s.x, s.z, (s.r || Math.hypot(s.sx, s.sz)) + 1.6]);
  const libre = (x, z, m)=>{
    if (F.suelo(M, x, z, 300, 0).s !== base || enPiso(M, x, z, 1)) return false;
    for (const [ex, ez, er] of evitar) if (Math.hypot(x - ex, z - ez) < er + (m || 0)) return false;
    return true;
  };
  const poner = (n, crear, rMin, margen)=>{
    let k = 0;
    for (let i = 0; i < n*8 && k < n; i++){
      if (base.t !== 'cil') break;
      const a = R()*TAU, r = (rMin || 0) + Math.sqrt(R())*(base.r - 1.2 - (rMin || 0));
      const x = base.x + Math.sin(a)*r, z = base.z + Math.cos(a)*r;
      if (!libre(x, z, margen || 0)) continue;
      const o = crear(); o.position.set(x, base.y1, z); o.rotation.y = R()*TAU; grupo.add(o);
      evitar.push([x, z, margen || 1]); k++;
    }
  };
  if (D.arboles) poner(D.arboles, ()=>ocultable(MOD.arbol(R, 0.8 + R()*0.6)), 6, 1.2);
  if (D.pinos) poner(D.pinos, ()=>ocultable(MOD.pino(R, 0.9 + R()*0.7, true)), 6, 1.2);
  if (D.palmeras) poner(D.palmeras, ()=>ocultable(MOD.palmera(R, 0.9 + R()*0.5)), 8, 1.2);
  for (const k of ['cipreses', 'bambu', 'cerezos']) if (D[k] && MOD.decoPais && MOD.decoPais[k]) poner(D[k], ()=>ocultable(MOD.decoPais[k](R)), 6, 1.4);
  if (D.rocas) poner(D.rocas, ()=>MOD.roca(R, 0.5 + R()*0.7, def.tema === 'nieve' ? '#aabbd0' : def.tema === 'playa' ? '#c8b090' : null), 4, 1);
  if (D.hongos) poner(D.hongos, ()=>MOD.hongo(R, 0.8 + R()*0.9), 4, 0.8);
  if (D.sombrillas) poner(D.sombrillas, ()=>MOD.sombrilla(R), 6, 2);
  if (D.conchas){ poner(D.conchas, ()=>MOD.concha(R), 2, 0.3); poner(Math.round(D.conchas/2), ()=>MOD.estrellaMar(R), 2, 0.3); }
  if (D.munecos) poner(D.munecos, ()=>MOD.munecoDeco(), 6, 1.5);
  if (D.regalos) poner(D.regalos, ()=>MOD.regaloDeco(R), 4, 1);
  if (D.cercas) for (let i = 0; i < 8; i++){ const a = i/8*TAU + 0.2, r = base.r - 2; const x = Math.sin(a)*r, z = Math.cos(a)*r; if (!libre(x, z)) continue; const c = MOD.cerca(4); c.position.set(x, base.y1, z); c.rotation.y = a + Math.PI/2; grupo.add(c); }
  /* adornos especiales de cada mundo */
  for (const s of M.solidos){
    if (s === base || s.resorte || s.tubo) continue;
    if ((s.mat === 'pasto' || s.mat === 'arena' || s.mat === 'nieve') && s.t === 'cil' && !s.flota && s.r >= 4.5){
      const n = Math.round(s.r/2.5);
      for (let i = 0; i < n; i++){
        const a = R()*TAU, r = s.r*(0.5 + R()*0.4), x = s.x + Math.sin(a)*r, z = s.z + Math.cos(a)*r;
        if (F.suelo(M, x, z, 300, 0).s !== s) continue;
        let ok = true; for (const [ex, ez, er] of evitar) if (Math.hypot(x - ex, z - ez) < Math.min(er, 3)) ok = false;
        if (!ok) continue;
        const o = ocultable(s.mat === 'arena' ? MOD.palmera(R, 0.8) : s.mat === 'nieve' ? MOD.pino(R, 0.8, true) : (R() < 0.5 ? MOD.arbol(R, 0.7) : MOD.hongo(R, 1)));
        o.position.set(x, s.y1, z); grupo.add(o);
      }
    }
  }
  if (def.id === 'castillo') grupo.add(MOD.castilloDeco());
  if (def.id === 'castillo'){
    /* la fuente con agua que salta */
    const f = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.15, 32), new THREE.MeshStandardMaterial({color: new THREE.Color('#5ac8ff').convertSRGBToLinear(), roughness:0.05, metalness:0.2, transparent:true, opacity:0.85}));
    f.position.set(0, 0.78, -4); grupo.add(f);
    const pil = MOD.palo(MOD.matSuelo('piedra').top, 0.3, 0.4, 1.6); pil.position.set(0, 1.4, -4); grupo.add(pil);
    MUNDO.fuente = {x:0, y:2.3, z:-4};
  }
  if (def.id === 'pradera'){
    const a = MOD.molinoAspas(); a.position.set(-12, 5.6, -6 + 2.15); grupo.add(a); MUNDO.giran.push({o:a, eje:'z', v:0.8});
  }
  if (def.id === 'playa') grupo.add(MOD.faroDeco(12, -10));
  MUNDO.animPais = []; MUNDO.rayo = null;
  if (MOD.decorarPais){
    const r = MOD.decorarPais(def.id, grupo, M, R);
    if (r){ MUNDO.animPais = r.anim || []; if (r.relampago) MUNDO.rayo = crearRayo(grupo, T); }
  }
  if (D.nubesDeco) for (let i = 0; i < D.nubesDeco; i++){
    const n = MOD.nubeDeco(R, 1 + R()*1.8); const a = R()*TAU, r = 30 + R()*60;
    n.position.set(Math.sin(a)*r, -8 + R()*40, Math.cos(a)*r - 20); grupo.add(n);
  }
  if (D.globos) for (let i = 0; i < D.globos; i++){
    const g = MOD.globo(R); const a = R()*TAU, r = 10 + R()*30;
    g.position.set(Math.sin(a)*r, 2 + R()*16, Math.cos(a)*r - 20); grupo.add(g); MUNDO.globos.push({g, y0: g.position.y, f: R()*TAU});
  }
  if (D.antorchas){
    const ar = def.jefe;
    for (let i = 0; i < 8; i++){ const a = i/8*TAU; const t = MOD.antorcha(); t.position.set(ar.x + Math.sin(a)*(10.3), 2.2, -48 + Math.cos(a)*10.3); grupo.add(t); MUNDO.antorchas.push(t); }
    for (const z of [-27, -37]) for (const x of [-2.2, 2.2]){ const t = MOD.antorcha(); t.position.set(x, 2.2, z); t.scale.setScalar(0.7); grupo.add(t); MUNDO.antorchas.push(t); }
  }
  if (D.columnas){ for (let i = 0; i < D.columnas; i++){ const a = (i + 0.5)/D.columnas*TAU; const c = MOD.columna(); c.position.set(Math.sin(a)*13, -0.5, -48 + Math.cos(a)*13); grupo.add(c); } }
  /* montañas a lo lejos */
  if (T.montes){
    const mm = MOD.std(T.montes, {roughness:0.95, flatShading:true});
    const mn = def.tema === 'nieve' ? MOD.std('#ffffff', {roughness:0.7, flatShading:true}) : null;
    for (let i = 0; i < 18; i++){
      const a = i/18*TAU + R()*0.2, r = 230 + R()*90, h = 40 + R()*70;
      const c = new THREE.Mesh(new THREE.ConeGeometry(h*0.9, h, 7), mm);
      c.position.set(Math.sin(a)*r, (def.agua ? def.agua.y : -10) + h/2 - 4, Math.cos(a)*r); c.rotation.y = R()*3; grupo.add(c);
      if (mn){ const cap = new THREE.Mesh(new THREE.ConeGeometry(h*0.35, h*0.39, 7), mn); cap.position.set(c.position.x, c.position.y + h*0.31, c.position.z); cap.rotation.y = c.rotation.y; grupo.add(cap); }
      if (def.tema === 'lava' && i % 3 === 0){ const hh = MOD.halo('#ff5a1a', h*0.8, 0.5); hh.position.set(c.position.x, c.position.y + h*0.5, c.position.z); grupo.add(hh); }
    }
  }
  /* nubes grandotas en el cielo */
  if (def.tema !== 'lava'){
    const cielo = new THREE.Group();
    for (let i = 0; i < 12; i++){ const n = MOD.nubeDeco(R, 3 + R()*3); const a = R()*TAU, r = 110 + R()*90; n.position.set(Math.sin(a)*r, 45 + R()*40, Math.cos(a)*r); cielo.add(n); }
    grupo.add(cielo); MUNDO.giran.push({o: cielo, eje:'y', v: 0.004});
  }
}

/* el Relámpago del Catatumbo: a lo lejos, sobre el Lago, cada tanto (un destello suave, sin parpadeos) */
const _eje = new THREE.Vector3(), _q = new THREE.Quaternion();
function crearRayo(grupo, T){
  const g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({color:'#e8dcff', transparent:true, opacity:0, fog:false, depthWrite:false});
  let x = 0, y = 60;
  for (let i = 0; i < 7; i++){
    const nx = x + (Math.random() - 0.5)*10, ny = y - 8 - Math.random()*4;
    const len = Math.hypot(nx - x, ny - y), c = new THREE.Mesh(GEO_RAYO, mat);
    c.scale.set(1, len, 1); c.position.set((x + nx)/2, (y + ny)/2, 0); c.rotation.z = Math.atan2(-(nx - x), ny - y) + Math.PI;
    g.add(c); x = nx; y = ny;
  }
  g.visible = false; grupo.add(g);
  return {g, mat, prox: 3, f: 0, base: T.hemi[2]*0.62};
}
const GEO_RAYO = new THREE.BoxGeometry(0.9, 1, 0.9); GEO_RAYO.userData.compartida = true;
function moverRayo(r, dt, t){
  if (t > r.prox){
    r.prox = t + 4 + Math.random()*6; r.f = 1;
    const a = -2.2 + Math.random()*1.4; r.g.position.set(Math.sin(a)*170, -4, Math.cos(a)*170); r.g.rotation.y = a;
    if (Math.random() < 0.5) setTimeout(()=>sonar('trueno'), 700);
  }
  r.f = Math.max(0, r.f - dt*1.6);
  r.g.visible = r.f > 0; r.mat.opacity = r.f;
  hemi.intensity = r.base + r.f*0.3;
}

/* los árboles que se ponen entre la cámara y Fernando se vuelven transparentes */
function ocultable(o){
  const mats = [];
  o.traverse(m=>{ if (m.isMesh){ m.material = m.material.clone(); m.material.transparent = true; mats.push(m.material); } });
  MUNDO.ocluyen.push({o, mats, a: 1});
  return o;
}
const _seg = new THREE.Vector3(), _ap = new THREE.Vector3(), _pt = new THREE.Vector3();
function aclarar(dt){
  const p = J.p, c = camara.position;
  _seg.set(p.x - c.x, p.y + 1 - c.y, p.z - c.z);
  const L2 = _seg.lengthSq() || 1;
  for (const t of MUNDO.ocluyen){
    const e = t.o.scale.x;
    _pt.set(t.o.position.x, t.o.position.y + 2.2*e, t.o.position.z);
    _ap.subVectors(_pt, c);
    const u = clamp(_ap.dot(_seg)/L2, 0, 1);
    const d = _ap.sub(_seg.clone().multiplyScalar(u)).length();
    const meta = (u > 0.02 && u < 0.97 && d < 2.6*e) ? 0.22 : 1;
    if (Math.abs(t.a - meta) < 0.01) continue;
    t.a += (meta - t.a)*Math.min(1, dt*8);
    for (const m of t.mats){ m.opacity = t.a; m.depthWrite = t.a > 0.9; }
  }
}

/* enemigos y cajas: se crean y se quitan según lo que diga el núcleo */
function sincronizarEnemigos(){
  const vistos = new Set();
  for (const e of J.M.enemigos){
    vistos.add(e.id);
    if (!MUNDO.enemigos.has(e.id)){
      const piel = e.tipo === 'jefe' ? e.piel : e.piel;
      const m = MOD.crearEnemigo(piel);
      const esc = e.tipo === 'jefe' ? (e.def.rey ? 3.1 : 2.6) : 1;
      m.g.scale.setScalar(esc); m.esc = esc;
      MUNDO.grupo.add(m.g);
      if (e.tipo === 'jefe'){
        const c = cartelito(e.def.nombre.toUpperCase(), '#ff9a6a'); c.position.y = e.alto/esc + 1.0; c.scale.set(2.6/esc*1.4, 0.8/esc*1.4, 1); m.g.add(c); m.cartel = c;
      }
      MUNDO.enemigos.set(e.id, m);
    }
  }
  for (const [id, m] of MUNDO.enemigos) if (!vistos.has(id)){ MUNDO.grupo.remove(m.g); MUNDO.enemigos.delete(id); }
}
function sincronizarCajas(){
  const vistas = new Set();
  for (const c of J.M.cajas){
    vistas.add(c);
    if (!MUNDO.cajas.has(c)){
      const g = MOD.crearRegalo(c.poder); g.position.set(c.x, c.y, c.z); MUNDO.grupo.add(g);
      MUNDO.cajas.set(c, {g, s: c.nueva ? 0 : 1});
      if (c.nueva) emitir(c.x, c.y, c.z, 30, {colores:['#ffffff', MOD.COLOR_PODER[c.poder]], vel:5, grav:2, vida:0.9, tam:0.35});
    }
  }
  for (const [c, o] of MUNDO.cajas) if (!vistas.has(c) || c.fuera){ MUNDO.grupo.remove(o.g); MUNDO.cajas.delete(c); }
}

/* ---------------- la cámara ---------------- */
const cam = {ang: J.camA, alt: 0.36, dist: 9.5, x: 0, y: 6, z: 20, manual: 0, listo: false, temblor: 0, mira: new THREE.Vector3()};
function moverCamara(dt, ctl){
  const p = J.p;
  if (ctl.camX){ cam.ang -= ctl.camX*dt*2.4; cam.manual = 1.6; }
  if (ctl.camY){ cam.alt = clamp(cam.alt + ctl.camY*dt*1.2, 0.08, 1.05); }
  cam.manual = Math.max(0, cam.manual - dt);
  let dist = cam.dist*Math.max(1, p.escala*0.75), alt = cam.alt;
  let objetivo = new THREE.Vector3(IP.p.x, IP.p.y + 1.3*p.escala, IP.p.z);
  if (J.fase === 'titulo'){
    cam.ang += dt*0.12; dist = 30; alt = 0.32;
    objetivo.set(0, 5, -10);
  } else if (J.fase === 'final' || p.baile > 0){
    /* para la foto: de frente a Fernando */
    const a = p.ang + Math.PI;
    cam.ang += F.angDif(cam.ang, a)*Math.min(1, dt*3);
    dist = J.fase === 'final' ? 8 : 6; alt = 0.2;
  } else {
    /* sigue por detrás cuando corre, sin pelear con el niño */
    const vel = Math.hypot(p.vx, p.vz);
    if (cam.manual <= 0 && vel > 2 && !J.trans){
      const d = F.angDif(cam.ang, p.ang);
      if (Math.abs(d) < 2.4) cam.ang += d*Math.min(1, dt*0.9*(vel/CFG.VEL));
    }
  }
  const ca = Math.cos(alt), sa = Math.sin(alt);
  let cx = objetivo.x - Math.sin(cam.ang)*dist*ca, cy = objetivo.y + dist*sa, cz = objetivo.z - Math.cos(cam.ang)*dist*ca;
  /* que no se meta debajo del suelo */
  const g = F.suelo(J.M, cx, cz, cy + 2, 0).y;
  if (cy < g + 1.2) cy = g + 1.2;
  if (!cam.listo){ cam.x = cx; cam.y = cy; cam.z = cz; cam.mira.copy(objetivo); cam.listo = true; }
  const k = 1 - Math.exp(-dt*(J.fase === 'titulo' ? 2 : 7));
  cam.x += (cx - cam.x)*k; cam.y += (cy - cam.y)*k; cam.z += (cz - cam.z)*k;
  cam.mira.lerp(objetivo, 1 - Math.exp(-dt*10));
  cam.temblor = Math.max(0, cam.temblor - dt*2);
  const tb = cam.temblor*cam.temblor*0.5;
  camara.position.set(cam.x + (Math.random() - 0.5)*tb, cam.y + (Math.random() - 0.5)*tb, cam.z + (Math.random() - 0.5)*tb);
  camara.lookAt(cam.mira);
  cielo.position.copy(camara.position);
  /* el sol y su sombra siguen a Fernando */
  sol.position.set(p.x + SOL_DIR.x*70, p.y + SOL_DIR.y*70, p.z + SOL_DIR.z*70);
  sol.target.position.set(p.x, p.y, p.z);
  matAgua.uniforms.camPos.value.copy(camara.position);
  agua.position.x = Math.round(camara.position.x/50)*50; agua.position.z = Math.round(camara.position.z/50)*50;
}

/* ---------------- el minimapa (en los mundos grandes, como el Reino Pichunite) ----------------
   La isla se pinta una sola vez al cargar el mundo; encima, cada cuadro: Fernando (flecha), las
   estrellas que faltan, las monedas rojas, las zonas pendientes, el jefe y los amigos.
   El norte va siempre arriba (hacia donde se mira al entrar). Tocándolo se agranda. */
const MINI = {lienzo: null, cx: 0, cz: 0, esc: 1, grande: false, mundo: -1};
const COLOR_MAPA = {pasto:'#6ac84a', arena:'#e8d090', nube:'#ffffff', madera:'#a8743a', cajaMadera:'#c8883a', tronco:'#7a4a22', hojas:'#3aa83a',
  piedraF:'#a8a094', torreT:'#8aa8d8', casaF1:'#ff9a3a', casaF2:'#5ad8a0', casaF3:'#b07aff', reloj:'#d8c8a8', bus:'#3a8aff', barco:'#8a4a1a', resorte:'#ff5ab0'};
function prepararMinimapa(M){
  MINI.lienzo = null; MINI.grande = false;
  if (!M.def.minimapa) return;
  const c = M.caja, ext = Math.max(c.x1 - c.x0, c.z1 - c.z0) + 16;
  MINI.cx = (c.x0 + c.x1)/2; MINI.cz = (c.z0 + c.z1)/2; MINI.esc = 256/ext;
  const lz = document.createElement('canvas'); lz.width = lz.height = 256;
  const x = lz.getContext('2d');
  x.fillStyle = '#3a8ad8'; x.fillRect(0, 0, 256, 256);
  const aMapa = (wx, wz)=>[128 + (wx - MINI.cx)*MINI.esc, 128 + (wz - MINI.cz)*MINI.esc];
  const piezas = M.solidos.filter(s=>!s.tubo).slice().sort((a, b)=>a.y1 - b.y1);
  for (const s of piezas){
    const base = COLOR_MAPA[s.mat] || '#b8b0a0';
    /* lo más alto se ve un poquito más claro */
    x.fillStyle = base; x.globalAlpha = 1;
    const [px, pz] = aMapa(s.x, s.z);
    if (s.t === 'cil'){ x.beginPath(); x.arc(px, pz, Math.max(1.5, s.r*MINI.esc), 0, TAU); x.fill(); }
    else x.fillRect(px - s.sx*MINI.esc, pz - s.sz*MINI.esc, s.sx*2*MINI.esc, s.sz*2*MINI.esc);
    if (s.y1 > 1){ x.fillStyle = 'rgba(255,255,255,' + Math.min(0.35, s.y1*0.03) + ')'; if (s.t === 'cil'){ x.beginPath(); x.arc(px, pz, Math.max(1.5, s.r*MINI.esc), 0, TAU); x.fill(); } else x.fillRect(px - s.sx*MINI.esc, pz - s.sz*MINI.esc, s.sx*2*MINI.esc, s.sz*2*MINI.esc); }
  }
  for (const p of M.def.pisos || []){ const [px, pz] = aMapa(p.x, p.z); x.fillStyle = 'rgba(255,240,200,0.45)'; x.fillRect(px - p.sx*MINI.esc, pz - p.sz*MINI.esc, p.sx*2*MINI.esc, p.sz*2*MINI.esc); }
  MINI.lienzo = lz; MINI.mundo = J.mundo;
}
function miniRect(){
  const chico = Math.min(W, H) < 500;
  if (MINI.grande){ const r = Math.min(W, H)*0.42; return {x: W/2, y: H/2, r}; }
  const r = chico ? 58 : 72;
  return {x: W - r - 14, y: 132 + r, r};
}
function tocaMinimapa(px, py){
  if (!MINI.lienzo || J.fase !== 'juego') return false;
  const m = miniRect();
  if (Math.hypot(px - m.x, py - m.y) < m.r || MINI.grande){ MINI.grande = !MINI.grande; return true; }
  return false;
}
function dibujarMinimapa(){
  if (!MINI.lienzo || MINI.mundo !== J.mundo || J.fase !== 'juego') return;
  const M = J.M, p = J.p, m = miniRect(), k = m.r*2/256;
  const aPant = (wx, wz)=>[m.x + (wx - MINI.cx)*MINI.esc*k, m.y + (wz - MINI.cz)*MINI.esc*k];
  if (MINI.grande){ ctx.fillStyle = 'rgba(10,8,30,0.55)'; ctx.fillRect(0, 0, W, H); }
  ctx.save();
  ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, TAU); ctx.clip();
  ctx.drawImage(MINI.lienzo, m.x - m.r, m.y - m.r, m.r*2, m.r*2);
  const ic = MINI.grande ? 1.6 : 1;
  /* lo que falta: estrellas, monedas rojas, zonas y el jefe */
  for (const s of M.estrellas){
    if (s.tomada || s.ya) continue;
    const [x, y] = aPant(s.x, s.z);
    if (s.visible) estrellita(x, y, 6*ic, '#ffd23f', 0);
    else if (s.tipo === 'zona'){ const em = {tiro:'🎯', llama:'🦙'}[s.zona] || '⚔️'; emoji(em, x, y, 13*ic); }
  }
  for (const r of M.rojas){ if (!r.vivo) continue; const [x, y] = aPant(r.x, r.z); ctx.fillStyle = '#ff3a4a'; ctx.beginPath(); ctx.arc(x, y, 2.6*ic, 0, TAU); ctx.fill(); }
  if (M.jefe && M.jefe.vivo){ const [x, y] = aPant(M.jefe.x, M.jefe.z); emoji('👑', x, y, 14*ic); }
  /* los amigos de este mundo */
  if (RED && RED.remotos) for (const r of RED.remotos.values()){
    if (!r.listo || !r.obj || r.obj.nv !== J.mundo) continue;
    const [x, y] = aPant(r.act.x, r.act.z), P = F.PJS[r.pj] || F.PJS.fernando;
    ctx.fillStyle = P.gorra; ctx.beginPath(); ctx.arc(x, y, 4*ic, 0, TAU); ctx.fill(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke();
  }
  /* a dónde lleva la flecha amarilla */
  if (J.guia){ const [x, y] = aPant(J.guia.x, J.guia.z); ctx.strokeStyle = '#ffe36e'; ctx.lineWidth = 2; ctx.globalAlpha = 0.5 + Math.sin(tHud*6)*0.4; ctx.beginPath(); ctx.arc(x, y, (7 + Math.sin(tHud*6)*2)*ic, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1; }
  /* Fernando: una flecha que apunta a donde mira */
  const [fx, fy] = aPant(p.x, p.z), a = Math.atan2(Math.sin(p.ang), Math.cos(p.ang)), t = 7*ic;
  const dx = Math.sin(a), dy = Math.cos(a);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#e8262a'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(fx + dx*t*1.3, fy + dy*t*1.3); ctx.lineTo(fx - dy*t*0.8 - dx*t*0.7, fy + dx*t*0.8 - dy*t*0.7); ctx.lineTo(fx - dx*t*0.3, fy - dy*t*0.3); ctx.lineTo(fx + dy*t*0.8 - dx*t*0.7, fy - dx*t*0.8 - dy*t*0.7); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.lineWidth = 4; ctx.strokeStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, TAU); ctx.stroke();
  if (MINI.grande){ texto('Toca para cerrar el mapa', m.x, m.y + m.r + 24, 16, '#ffffff', 'center'); texto('★ ' + M.estrellas.filter(s=>s.tomada || s.ya).length + ' de ' + M.estrellas.length + ' estrellas de este mundo', m.x, m.y - m.r - 18, 18, '#ffe36e', 'center'); }
}

/* ---------------- los súper poderes que se ven ---------------- */
function vestirSuper(f){
  if (f.sup) return f.sup;
  const piv = new THREE.Group(); f.g.add(piv);
  const robot = MOD.crearRobot(); robot.g.visible = false; f.g.add(robot.g);
  const mochila = MOD.mochilaCohete(); mochila.position.set(0, 0.95, -0.3); mochila.visible = false; piv.add(mochila);
  const ojos = MOD.ojosLaser(); ojos.visible = false; piv.add(ojos);
  const mano = new THREE.Group(); mano.position.set(-0.36, 0.82, 0.22); piv.add(mano);
  const plomero = MOD.trajePlomero ? MOD.trajePlomero() : new THREE.Group(); plomero.visible = false; piv.add(plomero);
  const planeador = new THREE.Group(); planeador.visible = false; f.g.add(planeador);
  const tela = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 1.4, 16, 1, true, -Math.PI/2.4, Math.PI/1.2), new THREE.MeshStandardMaterial({map: MOD.lienzo(128, 32, (x, w, h)=>{ ['#ff5ab0', '#ffd23f', '#5ad8ff', '#7ae05a', '#b07aff'].forEach((c, i)=>{ x.fillStyle = c; x.fillRect(i*w/5, 0, w/5 + 1, h); }); }, false), side: THREE.DoubleSide, roughness:0.6}));
  tela.rotation.z = Math.PI/2; tela.position.y = 3.2; planeador.add(tela);
  for (const lado of [1, -1]){ const c = MOD.palo(MOD.std('#ffffff'), 0.015, 0.015, 2.2); c.position.set(0.7*lado, 2.1, 0); c.rotation.z = 0.35*lado; planeador.add(c); }
  return (f.sup = {piv, robot, mochila, ojos, mano, arma: '', plomero, planeador});
}
function animarSuper(f, poder, t, fase, k, suelo, vuela){
  const s = vestirSuper(f), robot = poder === 'robot';
  s.robot.g.visible = robot;
  if (f.hq) f.hq.cont.visible = !robot; else f.cuerpo.visible = !robot;
  if (robot){
    const w = Math.sin(fase), rb = s.robot;
    rb.piernaI.rotation.x = w*0.7*k; rb.piernaD.rotation.x = -w*0.7*k;
    rb.brazoI.rotation.x = suelo ? -w*0.6*k : -2.4; rb.brazoD.rotation.x = suelo ? w*0.6*k : -2.4;
    rb.g.rotation.x = vuela ? 0.9 : 0;
    rb.bombillo.visible = Math.floor(t*3) % 2 === 0;
  }
  /* la mochila y los ojos se inclinan con el cuerpo (al volar va acostado) */
  s.piv.rotation.x = f.hq ? (f.hq.incl || 0) : f.cuerpo.rotation.x;
  s.mochila.visible = poder === 'cohete';
  if (s.mochila.visible) s.mochila.userData.llamas.forEach((l, i)=>{ l.scale.set(0.09, (0.35 + Math.sin(t*40 + i*2)*0.08)*(vuela ? 1.8 : 0.5), 0.09); });
  s.ojos.visible = poder === 'laser';
  s.ojos.position.set(0, f.hq ? 1.5 : 1.36, 0.3);
  /* el arma de juguete en la mano */
  const arma = F.PODERES[poder] && F.PODERES[poder].arma ? poder : '';
  if (s.arma !== arma){ while (s.mano.children.length) s.mano.remove(s.mano.children[0]); if (arma && MOD.armaJuguete) s.mano.add(MOD.armaJuguete(arma)); s.arma = arma; }
  s.mano.visible = !!arma && !robot;
  /* el Súper Plomero: bigote, guantes y su gorra */
  s.plomero.visible = poder === 'plomero';
  s.plomero.position.y = f.hq ? 0.22 : 0;
}
function animarPlaneo(f, planeo, t){ const s = vestirSuper(f); s.planeador.visible = !!planeo; if (planeo) s.planeador.rotation.z = Math.sin(t*1.5)*0.08; }
/* los clones de la caja de clones: se ven como Fernando con un brillo morado */
const CLONES = [];
function animarClones(dt){
  const lista = J.clones || [];
  while (CLONES.length < MAX_CLONES_VISTA && CLONES.length < lista.length){
    const m = modeloPj(OPC.pj);
    m.g.traverse(o=>{ if (o.isMesh && o.material && o.material.emissive){ o.material = o.material.clone(); o.material.emissive.set('#7a3aff'); o.material.emissiveIntensity = 0.35; } });
    escena.add(m.g); CLONES.push({m, fase: 0});
  }
  CLONES.forEach((c, i)=>{
    const d = lista[i]; c.m.g.visible = !!d && !J.trans;
    if (!d) return;
    const f = c.m;
    f.g.position.set(d.x, d.y, d.z); f.g.rotation.y = d.ang; f.g.scale.setScalar(J.p.escala);
    c.fase += dt*(4 + d.vel*1.6);
    const k = d.suelo ? Math.min(1, d.vel/4) : 0, w = Math.sin(c.fase);
    f.cuerpo.rotation.set(d.vuela ? 0.9 : 0, 0, 0); f.cuerpo.position.y = d.suelo ? Math.abs(w)*0.06*k : 0;
    f.piernaI.rotation.x = w*0.9*k; f.piernaD.rotation.x = -w*0.9*k;
    f.brazoI.rotation.x = d.suelo ? -w*0.8*k : -2.6; f.brazoD.rotation.x = d.suelo ? w*0.8*k : -2.6;
  });
}
const MAX_CLONES_VISTA = 4;
const _v3 = new THREE.Vector3();
const RAYOS = [0, 1].map(()=>{
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1, 10, 1, true), new THREE.MeshBasicMaterial({color:'#ff1a3a', transparent:true, opacity:0.95, depthWrite:false}));
  const nucleo = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1, 6, 1, true), new THREE.MeshBasicMaterial({color:'#fff0f0'})); m.add(nucleo);
  m.visible = false; escena.add(m); return m;
});
let rayoT = 0;
const _rA = new THREE.Vector3(), _rB = new THREE.Vector3(), _rY = new THREE.Vector3(0, 1, 0);
function dispararRayo(e, ang, esc){
  if (ang == null) ang = J.p.ang;
  if (esc == null) esc = J.p.escala;
  RAYOS.forEach((r, i)=>{
    const lado = i ? 1 : -1;
    _rA.set(e.x + Math.cos(ang)*0.1*lado*esc, e.y, e.z - Math.sin(ang)*0.1*lado*esc); _rB.set(e.a.x, e.a.y, e.a.z);
    const len = Math.max(0.1, _rA.distanceTo(_rB));
    r.position.copy(_rA).add(_rB).multiplyScalar(0.5); r.scale.set(1, len, 1);
    r.quaternion.setFromUnitVectors(_rY, _rB.clone().sub(_rA).normalize());
  });
  rayoT = 0.15;
}
const onda = {t: 0, r: 5, m: (()=>{ const m = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 48), new THREE.MeshBasicMaterial({color:'#fff0e0', transparent:true, blending: THREE.AdditiveBlending, depthWrite:false, side: THREE.DoubleSide})); m.rotation.x = -Math.PI/2; m.visible = false; escena.add(m); return m; })()};

/* ---------------- animar a todos ---------------- */
const anim = {fase: 0, voltereta: 0, tioFase: 0, tioAnt: new THREE.Vector3(), tPoderVisto: 0};
function arcoiris(t){ return new THREE.Color().setHSL((t*0.8) % 1, 0.9, 0.55); }
function animarFernando(dt, t){
  const p = J.p, f = fer;
  f.g.position.set(IP.p.x, IP.p.y, IP.p.z);
  f.g.rotation.y = p.ang;
  f.g.scale.setScalar(p.escala);
  const vel = Math.hypot(p.vx, p.vz);
  anim.fase += dt*(4 + vel*1.6);
  const pasoK = p.enSuelo ? Math.min(1, vel/4) : 0;
  const s = Math.sin(anim.fase);
  f.cuerpo.position.y = p.enSuelo ? Math.abs(s)*0.06*pasoK : 0;
  f.cuerpo.rotation.set(0, 0, 0);
  f.piernaI.rotation.x = s*0.9*pasoK; f.piernaD.rotation.x = -s*0.9*pasoK;
  f.brazoI.rotation.x = -s*0.8*pasoK; f.brazoD.rotation.x = s*0.8*pasoK;
  f.brazoI.rotation.z = 0.25; f.brazoD.rotation.z = -0.25;
  f.cabeza.rotation.set(0, 0, 0);
  if (p.nada){
    /* nadar: estilo libre si avanza, pataleando parado si no */
    const k = Math.min(1, vel/3), fn = t*(k > 0.2 ? 7 : 4);
    f.cuerpo.rotation.x = 1.2*k; f.cuerpo.position.y = 0.75*k;
    f.brazoI.rotation.x = -1.6 + Math.sin(fn)*1.5*k - (1 - k)*0.4; f.brazoD.rotation.x = -1.6 - Math.sin(fn)*1.5*k - (1 - k)*0.4;
    f.brazoI.rotation.z = 0.25 + (1 - k)*0.8*(0.6 + Math.sin(fn)*0.4); f.brazoD.rotation.z = -0.25 - (1 - k)*0.8*(0.6 + Math.sin(fn)*0.4);
    f.piernaI.rotation.x = Math.sin(fn*2)*0.45; f.piernaD.rotation.x = -Math.sin(fn*2)*0.45;
    f.cabeza.rotation.x = -0.9*k;
  } else if (!p.enSuelo){
    if (p.vuela){
      f.cuerpo.rotation.x = 0.9; f.brazoI.rotation.x = f.brazoD.rotation.x = -2.9; f.piernaI.rotation.x = f.piernaD.rotation.x = 0.3; f.cabeza.rotation.x = -0.7;
    } else {
      f.brazoI.rotation.x = f.brazoD.rotation.x = -2.6; f.brazoI.rotation.z = 0.6; f.brazoD.rotation.z = -0.6;
      f.piernaI.rotation.x = -0.7; f.piernaD.rotation.x = 0.35;
    }
  }
  if (anim.voltereta > 0){ anim.voltereta = Math.max(0, anim.voltereta - dt); f.cuerpo.rotation.x = (1 - anim.voltereta/0.42)*TAU; f.cuerpo.position.y += 0.6*Math.sin((1 - anim.voltereta/0.42)*Math.PI); }
  if (p.giro > 0){ f.cuerpo.rotation.y = (1 - p.giro/0.45)*TAU*2; f.brazoI.rotation.z = 1.4; f.brazoD.rotation.z = -1.4; }
  if (p.golpeT > 0){ f.cuerpo.rotation.x = -0.4; }
  if (p.baile > 0 || J.fase === 'final'){
    f.cuerpo.position.y = Math.abs(Math.sin(t*7))*0.35;
    f.brazoI.rotation.x = -2.8 + Math.sin(t*10)*0.3; f.brazoD.rotation.x = -2.8 - Math.sin(t*10)*0.3;
    f.brazoI.rotation.z = 0.5; f.brazoD.rotation.z = -0.5;
    f.cuerpo.rotation.y = Math.sin(t*4)*0.3;
  }
  if (f.hq){
    if (p.giro > 0) anim.giroA = (1 - p.giro/0.45)*TAU*2;
    animarHQ(f.hq, {suelo: p.enSuelo, vel, baile: p.baile > 0 || J.fase === 'final', vuela: p.vuela, nada: p.nada, giro: p.giro > 0, giroA: anim.giroA || 0, poder: p.tPoder < 3 && Math.floor(t*8) % 2 === 0 ? '' : p.poder}, dt, t);
    if (anim.voltereta > 0) f.hq.cont.rotation.x = (1 - anim.voltereta/0.42)*TAU;
  }
  animarSuper(f, p.tPoder < 2 && Math.floor(t*8) % 2 === 0 && p.poder !== 'robot' ? '' : p.poder, t, anim.fase, pasoK, p.enSuelo, p.vuela);
  animarPlaneo(f, p.planeo, t);
  if (p.poder === 'robot' && p.tPoder < 2 && Math.floor(t*8) % 2 === 0) emitir(p.x, p.y + 1.2*p.escala, p.z, 1, {color:'#5ae8ff', vel:2, grav:0, vida:0.3, tam:0.3});
  if (p.poder === 'cohete' && p.vuela){ const bx = p.x - Math.sin(p.ang)*0.5, bz = p.z - Math.cos(p.ang)*0.5; emitir(bx, p.y + 0.4, bz, 2, {colores:['#ffb21a', '#ff5a1a', '#ffffff'], vel:1.2, grav:-1, vida:0.4, tam:0.4}); }
  if (p.poder === 'fuerza' && Math.random() < 0.25) emitir(p.x, p.y + 0.8, p.z, 1, {colores:['#ff3a3a', '#ffb0a0'], vel:1.5, grav:-1, vida:0.4, tam:0.25, esparce:0.8});
  /* parpadea si lo golpearon */
  f.g.visible = !(p.invul > 0 && p.golpeT <= 0 && J.fase === 'juego' && Math.floor(t*14) % 2 === 0 && p.invul < CFG.INVUL - 0.05);
  /* poderes */
  const pod = p.poder, acaba = p.tPoder < 3 && Math.floor(t*8) % 2 === 0;
  f.alas.visible = pod === 'alas' && !acaba;
  if (f.alas.visible) f.alas.children.forEach(a=>{ a.rotation.y = Math.sin(t*(p.vuela ? 22 : 6))*0.5*a.userData.lado; });
  f.iman.visible = pod === 'iman' && !acaba; f.iman.rotation.y = t*3; f.iman.position.y = 2.3 + Math.sin(t*4)*0.1;
  const m = f.mats;
  if (pod === 'fuego' && !acaba){ m.rojo.color.set('#ffffff').convertSRGBToLinear(); m.azul.color.set('#e8262a').convertSRGBToLinear(); }
  else { m.rojo.color.copy(f.base.rojo); m.azul.color.copy(f.base.azul); }
  if (pod === 'tenis' && !acaba){ m.cafe.color.set('#3aff8a').convertSRGBToLinear(); m.cafe.emissive.set('#1aa04a'); }
  else { m.cafe.color.copy(f.base.cafe); m.cafe.emissive.set('#000000'); }
  if (pod === 'hamburguesa' && !acaba){ const c = arcoiris(t); m.rojo.emissive.copy(c); m.azul.emissive.copy(arcoiris(t + 0.3)); m.rojo.emissiveIntensity = m.azul.emissiveIntensity = 0.7; }
  else { m.rojo.emissive.set('#000000'); m.azul.emissive.set('#000000'); }
  /* estelas */
  if (pod === 'hamburguesa' && vel > 3) emitir(p.x, p.y + 0.6, p.z, 2, {colores:['#ff4a4a', '#ffd23f', '#4ae060', '#3aa8ff', '#c06aff'], vel:0.5, grav:0, vida:0.5, tam:0.4, esparce:0.5});
  if (pod === 'tenis' && !p.enSuelo) emitir(p.x, p.y + 0.1, p.z, 1, {color:'#5aff9a', vel:0.4, grav:0, vida:0.4, tam:0.3});
  if (pod === 'gigante' && p.enSuelo && vel > 2 && Math.random() < 0.3) emitir(p.x, p.y + 0.1, p.z, 2, {color:'#e8d8c0', vel:1.5, grav:1, vida:0.5, tam:0.6, plano:true});
  if (p.vuela) emitir(p.x, p.y + 1.5, p.z, 1, {color:'#ffffff', vel:0.5, grav:-0.5, vida:0.6, tam:0.25});
  /* nadando: espuma alrededor y salpicones al bracear */
  if (p.nada && J.M.def.agua){
    const ay = J.M.def.agua.y + 0.05;
    if (Math.random() < (vel > 1 ? 0.6 : 0.15)) emitir(p.x - Math.sin(p.ang)*0.5, ay, p.z - Math.cos(p.ang)*0.5, 1, {color:'#ffffff', vel:0.6, grav:0, vida:0.9, tam:0.45, plano:true});
    anim.brazada = (anim.brazada || 0) + dt*(vel > 1 ? 2.2 : 0);
    if (anim.brazada > 1){ anim.brazada = 0; sonar('brazada'); emitir(p.x + Math.sin(p.ang)*0.6, ay, p.z + Math.cos(p.ang)*0.6, 5, {colores:['#ffffff', '#bfeaff'], vel:2, vy:2.5, grav:8, vida:0.5, tam:0.22}); }
  }
  /* sombra suave */
  const g = F.suelo(J.M, p.x, p.z, p.y + 0.1, 0.2);
  sombraFer.visible = isFinite(g.y) && p.y - g.y < 12;
  if (sombraFer.visible){ sombraFer.position.set(p.x, g.y + 0.03, p.z); const k = clamp(1 - (p.y - g.y)/10, 0.3, 1); sombraFer.scale.setScalar(k*p.escala); sombraFer.material.opacity = k; }
}
function animarTio(dt, t){
  const T = J.tio, m = tio;
  const vel = IP.tVel;
  m.g.position.set(IP.t.x, IP.t.y - 1.1, IP.t.z);
  anim.tioYaw = anim.tioYaw == null ? T.ang : anim.tioYaw + F.angDif(anim.tioYaw, T.ang)*Math.min(1, dt*10);
  m.g.rotation.y = anim.tioYaw;
  const rapido = clamp(vel/12, 0, 1);
  if (m.hq){
    /* Vuelo natural: despacio flota casi parado; rápido se acuesta como superhéroe. Si sube,
       levanta la cabeza; si baja, la agacha. En las curvas se ladea hacia adentro, como un avión. */
    const T2 = J.tio, vh = Math.hypot(T2.vx || 0, T2.vz || 0);
    const r = clamp(vh/10, 0, 1);
    let cab = -1.3 + r*1.25 - clamp((T2.vy || 0)*0.06, -0.35, 0.35);
    if (J.fase === 'final' || J.p.baile > 0) cab = -1.25;
    const giroV = anim.tioAngAnt == null ? 0 : F.angDif(anim.tioAngAnt, T2.ang)/Math.max(dt, 1e-3);
    anim.tioAngAnt = T2.ang;
    const ladeo = clamp(-giroV*0.12*(0.4 + r), -0.6, 0.6) + Math.sin(t*1.3)*0.05;
    const hq = m.hq;
    hq.cab = (hq.cab == null ? cab : hq.cab + (cab - hq.cab)*Math.min(1, dt*3));
    hq.lad = (hq.lad == null ? 0 : hq.lad + (ladeo - hq.lad)*Math.min(1, dt*4));
    hq.cont.rotation.set(hq.cab, 0, hq.lad, 'YXZ');
    hq.cont.position.y = 1.1 + Math.sin(t*1.9)*0.06*(1 - r);
  }
  m.cuerpo.rotation.x = rapido*1.1;
  m.piernaI.rotation.x = 0.2 + rapido*0.4 + Math.sin(t*3)*0.1; m.piernaD.rotation.x = 0.1 + rapido*0.4 - Math.sin(t*3)*0.1;
  if (T.estado === 'ataca' || T.puno > 0){ m.brazoD.rotation.x = -3; m.brazoD.rotation.z = -0.1; m.brazoI.rotation.x = 0.3; }
  else if (J.fase === 'final' || J.p.baile > 0){ m.brazoI.rotation.x = m.brazoD.rotation.x = -2.8 + Math.sin(t*8)*0.3; m.brazoI.rotation.z = 0.4; m.brazoD.rotation.z = -0.4; }
  else { m.brazoI.rotation.x = Math.sin(t*2)*0.15; m.brazoD.rotation.x = -Math.sin(t*2)*0.15; m.brazoI.rotation.z = 0.5; m.brazoD.rotation.z = -0.5; }
  MOD.ondearCapa(m.capa, t, vel);
  if (rapido > 0.5) emitir(T.x, T.y - 0.5, T.z, 1, {colores:['#ffffff', '#9ad0ff'], vel:0.3, grav:0, vida:0.4, tam:0.3});
  const g = F.suelo(J.M, T.x, T.z, T.y, 0.2);
  sombraTio.visible = isFinite(g.y) && T.y - g.y < 10;
  if (sombraTio.visible){ sombraTio.position.set(T.x, g.y + 0.03, T.z); const k = clamp(1 - (T.y - g.y)/8, 0.25, 0.8); sombraTio.scale.setScalar(k); sombraTio.material.opacity = k; }
}
function animarPerros(dt, t){
  J.perros.forEach((d, i)=>{
    const m = perros[i];
    m.g.position.set(d.x, d.y, d.z); m.g.rotation.y = d.ang;
    const s = Math.sin(d.anim);
    m.patas[0].rotation.x = s*0.7; m.patas[1].rotation.x = -s*0.7; m.patas[2].rotation.x = -s*0.7; m.patas[3].rotation.x = s*0.7;
    m.cola.rotation.z = Math.sin(t*14 + i)*0.6;
    m.cabeza.rotation.x = Math.sin(d.anim*0.5)*0.08;
    m.cuerpo.position.y = Math.abs(s)*0.04;
    if (J.p.baile > 0 || J.fase === 'final') m.cuerpo.position.y = Math.abs(Math.sin(t*8 + i))*0.3;
  });
}
function animarEnemigos(dt, t){
  sincronizarEnemigos();
  for (const e of J.M.enemigos){
    const m = MUNDO.enemigos.get(e.id); if (!m) continue;
    m.g.position.set(e.x, e.y, e.z); m.g.rotation.y = e.ang;
    let s = m.esc;
    if (!e.vivo){
      const k = clamp(e.muere/0.5, 0, 1);
      m.g.scale.set(s*(1 + k*0.4), s*Math.max(0.05, 1 - k), s*(1 + k*0.4));
      m.g.visible = e.muere < 0.6;
      continue;
    }
    m.g.visible = !(e.invul > 0 && Math.floor(t*12) % 2 === 0);
    const andar = Math.sin(e.t*10);
    m.cuerpo.position.y = Math.abs(andar)*0.06;
    m.cuerpo.rotation.z = andar*0.08;
    m.pies.forEach((p, i)=>{ if (p.userData.z0 == null) p.userData.z0 = p.position.z; p.position.z = p.userData.z0 + (i % 2 ? 1 : -1)*andar*0.08; });
    m.alas.forEach((a, i)=>{ a.rotation.z = (e.tipo === 'abeja' ? Math.sin(t*30) : Math.sin(t*6))*0.6*(i % 2 ? -1 : 1); });
    m.g.scale.setScalar(s);
    if (e.tipo === 'jefe'){
      if (!e.despierto){ m.cuerpo.position.y = Math.sin(t*1.5)*0.03; m.cuerpo.rotation.z = 0; }
      if (m.cartel) m.cartel.visible = !e.despierto || e.vida < e.def.vida;
    }
  }
}
function animarCosas(dt, t){
  const M = J.M;
  for (const o of MUNDO.monedas){ o.me.visible = o.m.vivo; if (o.m.vivo){ o.me.position.set(o.m.x, o.m.y + Math.sin(t*2 + o.m.x)*0.08, o.m.z); o.me.rotation.y = t*3; } }
  for (const o of MUNDO.pociones){ o.g.visible = o.q.vivo; if (o.q.vivo){ o.g.position.y = o.q.y - 0.4 + Math.sin(t*2.5 + o.q.x)*0.12; o.g.rotation.y = t*1.5; } }
  for (const o of MUNDO.rojas){ o.me.visible = o.m.vivo; if (o.m.vivo){ o.me.position.set(o.m.x, o.m.y + Math.sin(t*2 + o.m.z)*0.1, o.m.z); o.me.rotation.y = t*3.4; } }
  for (const o of MUNDO.estrellas){
    o.g.visible = o.s.visible && !o.s.tomada;
    if (!o.g.visible) continue;
    o.aparece = Math.min(1, o.aparece + dt*1.5);
    const k = o.aparece, e = k < 1 ? 1 + Math.sin(k*Math.PI)*0.5 : 1;
    o.g.scale.setScalar((o.s.grande ? 2.2 : 1)*k*e);
    o.g.position.y = o.s.y + Math.sin(t*2)*0.18;
    o.g.rotation.y = t*1.8;
    if (Math.random() < 0.15) emitir(o.s.x, o.s.y, o.s.z, 1, {color:'#fff2a0', vel:1.2, grav:-0.5, vida:0.8, tam:0.25, esparce:1.4});
  }
  sincronizarCajas();
  for (const [c, o] of MUNDO.cajas){
    o.g.position.set(c.x, c.y + Math.sin(t*2 + c.x)*0.12, c.z);
    o.g.rotation.y = t*0.9;
    if (c.abierta > 0){
      o.s = Math.max(0, o.s - dt*4);
      o.g.userData.tapa.position.y = 0.43 + (1 - o.s)*0.8;
    } else {
      o.s = Math.min(1, o.s + dt*2);
      o.g.userData.tapa.position.y = 0.43;
    }
    o.g.scale.setScalar(Math.max(0.001, o.s));
    o.g.visible = o.s > 0.01;
  }
  const tengo = F.cuentaEstrellas(J.prog);
  for (const o of MUNDO.portales){
    const abierto = tengo >= o.po.necesita;
    o.g.userData.candado.visible = !abierto;
    o.g.userData.remolino.material.uniforms.t.value = t;
    o.g.userData.remolino.material.uniforms.cerrado.value = abierto ? 0 : 0.85;
    o.g.userData.halo.material.opacity = abierto ? 0.35 + Math.sin(t*3)*0.12 : 0.08;
  }
  for (const o of MUNDO.amigos){ o.g.position.y = o.a.y + (o.a.quien === 'santi' ? Math.abs(Math.sin(t*3))*0.15 : 0); o.g.rotation.y = Math.atan2(J.p.x - o.a.x, J.p.z - o.a.z); }
  for (const o of MUNDO.solidos) if (o.s.mov) o.g.position.set(o.s.x, o.s.y1 + o.by, o.s.z);
  for (const r of MUNDO.resortes){ r.apretado = Math.max(0, r.apretado - dt*3); const k = 1 - Math.sin(r.apretado*Math.PI)*0.4; r.g.userData.muelle.scale.y = k; r.g.userData.tapa.position.y = 0.37 - (1 - k)*0.3; }
  for (const o of MUNDO.giran){ if (o.eje === 'z') o.o.rotation.z += dt*o.v; else o.o.rotation.y += dt*o.v; }
  for (const b of MUNDO.globos) b.g.position.y = b.y0 + Math.sin(t*0.8 + b.f)*0.6;
  for (const f of MUNDO.animPais) f(t, dt);
  for (const o of MUNDO.pelotas){
    const b = o.b; o.g.position.set(b.x, b.y + b.r, b.z);
    const v = Math.hypot(b.vx, b.vz), d = b.giro - o.giro; o.giro = b.giro;
    if (v > 0.05 && d > 0){ _eje.set(b.vz/v, 0, -b.vx/v); _q.setFromAxisAngle(_eje, d); o.g.quaternion.premultiply(_q); }
  }
  if (MUNDO.rayo) moverRayo(MUNDO.rayo, dt, t);
  for (const a of MUNDO.antorchas){ a.userData.fuego.scale.set(0.2, 0.32 + Math.sin(t*15 + a.position.x)*0.06, 0.2); if (Math.random() < 0.2) emitir(a.position.x, a.position.y + 2.2*a.scale.y, a.position.z, 1, {colores:['#ffb030', '#ff6a1a'], vel:0.5, grav:-2, vida:0.6, tam:0.3}); }
  if (MUNDO.fuente && Math.random() < 0.7) emitir(MUNDO.fuente.x, MUNDO.fuente.y, MUNDO.fuente.z, 2, {color:'#9ae0ff', vel:1.2, vy:5, grav:9, vida:0.9, tam:0.25});
  /* bolas de fuego */
  let i = 0;
  for (const b of J.bolas){
    if (!b.vivo) continue; const m = bolaMesh(i++); m.visible = true; m.position.set(b.x, b.y, b.z);
    const A = b.arma && ASPECTO_ARMA[b.arma];
    m.children[0].material.color.set(A ? A.color : b.misil ? '#dfe6ee' : '#ffd27a'); m.children[1].visible = !b.misil && !A;
    m.children[0].scale.setScalar(A ? A.tam : 0.22);
    m.children[0].material.transparent = !!(A && A.transp); m.children[0].material.opacity = A && A.transp ? 0.55 : 1;
    if (A){ if (Math.random() < A.estela) emitir(b.x, b.y, b.z, 1, {colores: A.colores, vel:0.4, grav: A.grav, vida:0.35, tam:0.22}); }
    else emitir(b.x, b.y, b.z, 1, b.misil ? {colores:['#c8ccd4', '#ffb030'], vel:0.3, grav:-0.5, vida:0.4, tam:0.3} : {colores:['#ffb030', '#ff5a1a'], vel:0.4, grav:-1, vida:0.35, tam:0.35});
  }
  /* las bolas de fuego del Rey Tortugón */
  let fi = 0;
  for (const f of J.fuegosMalos || []){ if (!f.vivo) continue; const m = fuegoMesh(fi++); m.visible = true; m.position.set(f.x, f.y, f.z); if (Math.random() < 0.6) emitir(f.x, f.y, f.z, 1, {colores:['#ff7a1a', '#ffd23f'], vel:0.6, grav:-1, vida:0.4, tam:0.4}); }
  for (; fi < FUEGOS.length; fi++) FUEGOS[fi].visible = false;
  burbujaEscudo.t = Math.max(0, burbujaEscudo.t - dt); burbujaEscudo.m.visible = burbujaEscudo.t > 0;
  if (burbujaEscudo.t > 0){ burbujaEscudo.m.position.set(J.p.x, J.p.y + 0.9*J.p.escala, J.p.z); burbujaEscudo.m.scale.setScalar(1.3*J.p.escala*(1 + (0.45 - burbujaEscudo.t))); burbujaEscudo.m.material.opacity = burbujaEscudo.t/0.45*0.5; }
  /* los rayos láser y la onda de la súper fuerza */
  rayoT = Math.max(0, rayoT - dt);
  for (const r of RAYOS){ r.visible = rayoT > 0; r.material.opacity = Math.min(1, rayoT/0.12); }
  onda.t = Math.max(0, onda.t - dt); onda.m.visible = onda.t > 0;
  if (onda.t > 0){ const u = 1 - onda.t/0.45; onda.m.scale.setScalar(0.5 + u*onda.r); onda.m.material.opacity = onda.t/0.45; }
  animarClones(dt);
  for (; i < bolasM.length; i++) bolasM[i].visible = false;
  /* la flecha guía */
  const gu = J.guia, p = J.p;
  const verFlecha = gu && J.fase === 'juego' && p.baile <= 0 && Math.hypot(gu.x - p.x, gu.z - p.z) > 4;
  flecha.visible = !!verFlecha;
  if (verFlecha){
    flecha.position.set(p.x, p.y + 2.3*p.escala + 0.4 + Math.sin(t*4)*0.1, p.z);
    flecha.rotation.y = Math.atan2(gu.x - p.x, gu.z - p.z);
  }
}

/* ---------------- sonidos ---------------- */
let AC = null, maestro = null, busMusica = null;
function audio(){
  if (!AC){
    try{
      AC = new (window.AudioContext || window.webkitAudioContext)();
      maestro = AC.createGain(); maestro.gain.value = OPC.sonido ? 0.55 : 0; maestro.connect(AC.destination);
      busMusica = AC.createGain(); busMusica.gain.value = OPC.musica ? 0.32 : 0; busMusica.connect(maestro);
    }catch(e){}
  }
  if (AC && AC.state === 'suspended') AC.resume();
}
function tono(f0, f1, dur, tipo, vol, cuando, destino){
  if (!AC) return;
  const t = cuando || AC.currentTime;
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = tipo || 'square'; o.frequency.setValueAtTime(f0, t);
  if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.08, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(destino || maestro); o.start(t); o.stop(t + dur + 0.03);
}
let bufRuido = null;
function ruido(dur, vol, frec, cuando){
  if (!AC) return;
  if (!bufRuido){ bufRuido = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const d = bufRuido.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random()*2 - 1; }
  const t = cuando || AC.currentTime;
  const s = AC.createBufferSource(), g = AC.createGain(), f = AC.createBiquadFilter();
  s.buffer = bufRuido; f.type = 'bandpass'; f.frequency.value = frec || 1200; f.Q.value = 0.8;
  g.gain.setValueAtTime(vol || 0.1, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(maestro); s.start(t); s.stop(t + dur + 0.02);
}
const nota = n=>440*Math.pow(2, (n - 69)/12);
const SON = {
  salto(){ tono(330, 660, 0.14, 'square', 0.06); },
  salto2(){ tono(440, 990, 0.16, 'square', 0.06); tono(880, 1760, 0.12, 'triangle', 0.04, AC.currentTime + 0.05); },
  moneda(){ const t = AC.currentTime; tono(nota(83), 0, 0.07, 'square', 0.05, t); tono(nota(88), 0, 0.25, 'square', 0.05, t + 0.07); },
  roja(){ const t = AC.currentTime; [76, 79, 83, 88].forEach((n, i)=>tono(nota(n), 0, 0.12, 'triangle', 0.08, t + i*0.06)); },
  estrella(){ const t = AC.currentTime; [72, 76, 79, 84, 88, 91, 96].forEach((n, i)=>{ tono(nota(n), 0, 0.3, 'square', 0.06, t + i*0.09); tono(nota(n - 12), 0, 0.3, 'triangle', 0.08, t + i*0.09); }); },
  pisa(){ tono(520, 140, 0.16, 'square', 0.08); },
  golpe(){ tono(300, 80, 0.3, 'sawtooth', 0.07); ruido(0.2, 0.12, 400); },
  poder(){ const t = AC.currentTime; [60, 64, 67, 72, 76, 79, 84].forEach((n, i)=>tono(nota(n), 0, 0.1, 'square', 0.05, t + i*0.05)); },
  fuego(){ ruido(0.18, 0.12, 900); tono(600, 200, 0.12, 'sawtooth', 0.04); },
  giro(){ ruido(0.25, 0.1, 2400); tono(500, 900, 0.2, 'triangle', 0.04); },
  boing(){ tono(180, 900, 0.35, 'sine', 0.15); tono(200, 1000, 0.3, 'triangle', 0.06); },
  portal(){ const t = AC.currentTime; for (let i = 0; i < 10; i++) tono(nota(60 + i*3), 0, 0.12, 'sine', 0.06, t + i*0.04); },
  jefeGolpe(){ tono(140, 50, 0.5, 'sawtooth', 0.12); ruido(0.4, 0.15, 300); },
  temblor(){ ruido(0.5, 0.2, 120); tono(70, 40, 0.5, 'sine', 0.2); },
  puno(){ ruido(0.15, 0.2, 700); tono(220, 60, 0.18, 'square', 0.1); },
  tioVuela(){ ruido(0.5, 0.12, 1800); },
  patada(){ tono(170, 60, 0.12, 'square', 0.1); ruido(0.08, 0.15, 700); },
  agua(){ ruido(0.08, 0.06, 2600); },
  burbujas(){ tono(500, 900, 0.12, 'sine', 0.06); },
  dardos(){ tono(900, 300, 0.06, 'square', 0.04); ruido(0.04, 0.05, 2000); },
  confeti(){ ruido(0.2, 0.15, 500); tono(200, 90, 0.2, 'triangle', 0.1); },
  globos(){ tono(300, 500, 0.1, 'sine', 0.06); },
  explota(){ ruido(0.5, 0.25, 700); const t = AC.currentTime; [84, 88, 91].forEach((n, i)=>tono(nota(n), 0, 0.12, 'triangle', 0.05, t + 0.05 + i*0.05)); },
  pocion(){ const t = AC.currentTime; [72, 79, 84, 91].forEach((n, i)=>tono(nota(n), 0, 0.14, 'sine', 0.08, t + i*0.06)); },
  escudo(){ tono(1200, 600, 0.25, 'triangle', 0.1); ruido(0.1, 0.1, 3000); },
  salto3(){ const t = AC.currentTime; [72, 76, 79, 84, 88].forEach((n, i)=>tono(nota(n), 0, 0.08, 'square', 0.06, t + i*0.04)); },
  fuegoMalo(){ ruido(0.4, 0.15, 400); tono(150, 60, 0.4, 'sawtooth', 0.08); },
  pinata(){ ruido(0.3, 0.2, 1500); const t = AC.currentTime; [72, 76, 79, 84, 88, 91].forEach((n, i)=>tono(nota(n), 0, 0.1, 'square', 0.06, t + i*0.05)); },
  choca(){ ruido(0.12, 0.3, 2600); const t = AC.currentTime; [76, 83].forEach((n, i)=>tono(nota(n), 0, 0.12, 'triangle', 0.08, t + 0.05 + i*0.07)); },
  clon(){ const t = AC.currentTime; [67, 71, 74, 79].forEach((n, i)=>tono(nota(n), 0, 0.08, 'triangle', 0.08, t + i*0.04)); },
  laser(){ tono(1600, 260, 0.18, 'square', 0.05); tono(1200, 200, 0.18, 'sawtooth', 0.03); },
  onda(){ ruido(0.5, 0.2, 160); tono(110, 40, 0.45, 'sine', 0.25); },
  misil(){ ruido(0.25, 0.12, 1800); tono(400, 900, 0.15, 'square', 0.04); },
  robot(){ const t = AC.currentTime; [48, 55, 60, 67, 72].forEach((n, i)=>tono(nota(n), 0, 0.09, 'square', 0.06, t + i*0.06)); },
  gol(){ const t = AC.currentTime; ruido(1.6, 0.1, 1400); [72, 76, 79, 84, 79, 84].forEach((n, i)=>{ tono(nota(n), 0, 0.22, 'square', 0.07, t + i*0.12); tono(nota(n - 12), 0, 0.22, 'triangle', 0.08, t + i*0.12); }); },
  trueno(){ ruido(1.6, 0.05, 90); },
  chapuzon(){ ruido(0.45, 0.16, 900); tono(500, 140, 0.25, 'sine', 0.08); },
  brazada(){ ruido(0.18, 0.05, 1400); },
  caja(){ const t = AC.currentTime; tono(nota(72), 0, 0.1, 'triangle', 0.08, t); tono(nota(79), 0, 0.2, 'triangle', 0.08, t + 0.08); },
  rescate(){ const t = AC.currentTime; [79, 76, 72, 79, 84].forEach((n, i)=>tono(nota(n), 0, 0.12, 'triangle', 0.08, t + i*0.07)); },
  bloqueado(){ tono(200, 150, 0.25, 'square', 0.06); },
  aparece(){ const t = AC.currentTime; [84, 88, 91, 96].forEach((n, i)=>tono(nota(n), 0, 0.25, 'sine', 0.08, t + i*0.1)); },
  final(){ const t = AC.currentTime; [[72, 0], [72, 0.15], [72, 0.3], [76, 0.45], [79, 0.75], [76, 1.0], [79, 1.15], [84, 1.4]].forEach(([n, d])=>{ tono(nota(n), 0, 0.3, 'square', 0.07, t + d); tono(nota(n - 24), 0, 0.3, 'triangle', 0.1, t + d); }); },
};
function sonar(n){ if (AC && OPC.sonido && SON[n]) try{ SON[n](); }catch(e){} }

/* ---------------- música (8 bits) ---------------- */
const TEMAS_MUS = {
  castillo: {bpm: 128, mel:[72,0,76,79, 81,79,76,0, 74,0,77,81, 79,0,0,0, 72,0,76,79, 84,83,81,79, 77,76,74,72, 74,0,72,0], baj:[48,55,52,55, 50,57,55,50, 48,55,52,55, 53,55,48,48]},
  pradera:  {bpm: 140, mel:[67,71,74,71, 72,76,79,76, 74,78,81,78, 79,0,79,0, 76,74,72,71, 69,71,72,74, 76,74,72,69, 67,0,0,0], baj:[43,50,48,55, 50,57,55,50, 43,50,48,52, 50,50,43,43]},
  playa:    {bpm: 132, mel:[65,0,69,72, 0,69,72,74, 72,0,69,65, 67,0,0,0, 65,0,69,72, 77,76,74,72, 70,69,67,65, 65,0,0,0], baj:[41,48,46,48, 43,50,48,43, 41,48,46,48, 48,43,41,41]},
  nieve:    {bpm: 104, mel:[76,0,79,0, 84,0,79,0, 77,0,81,0, 84,0,0,0, 74,0,77,0, 81,0,77,0, 76,0,72,0, 74,0,0,0], baj:[48,55,52,55, 53,57,53,57, 50,57,53,57, 55,55,48,48], onda:'triangle'},
  nubes:    {bpm: 112, mel:[79,81,83,86, 83,81,79,0, 76,79,81,83, 81,0,0,0, 79,81,83,86, 88,86,83,81, 79,76,74,76, 79,0,0,0], baj:[43,50,47,50, 40,47,43,47, 45,52,48,52, 50,50,43,43], onda:'triangle'},
  lava:     {bpm: 150, mel:[57,0,57,60, 0,57,63,62, 57,0,57,60, 0,64,63,0, 57,0,57,60, 0,57,63,62, 65,64,63,62, 60,0,0,0], baj:[33,33,40,33, 36,36,39,38, 33,33,40,33, 41,40,39,38]},
  maracaibo:{bpm: 120, mel:[69,0,73,76, 0,76,74,73, 71,0,74,78, 0,76,74,0, 73,0,76,81, 0,81,79,78, 76,74,73,71, 69,0,0,0], baj:[45,52,45,52, 50,57,50,57, 52,59,52,59, 45,52,45,45]},
  usa:      {bpm: 132, mel:[67,67,69,71, 67,71,69,62, 67,67,69,71, 67,0,66,0, 67,67,69,71, 72,71,69,67, 66,62,64,66, 67,0,67,0], baj:[43,50,43,50, 43,50,38,45, 43,50,43,50, 43,38,43,43]},
  italia:   {bpm: 150, mel:[69,0,69,71, 72,0,71,69, 68,0,68,69, 71,0,0,0, 72,0,72,74, 76,0,74,72, 71,0,72,71, 69,0,0,0], baj:[45,52,45,52, 44,52,44,52, 45,52,45,52, 40,47,45,45]},
  china:    {bpm: 104, mel:[74,0,76,79, 81,0,79,76, 74,0,72,69, 72,0,0,0, 74,0,76,79, 84,0,81,79, 76,0,74,72, 74,0,0,0], baj:[50,57,50,57, 48,55,48,55, 45,52,45,52, 50,57,50,50], onda:'triangle'},
  argentina:{bpm: 140, mel:[72,74,76,0, 72,74,76,0, 76,77,79,0, 79,77,76,74, 72,74,76,0, 72,74,76,0, 79,77,76,74, 72,0,0,0], baj:[48,55,48,55, 48,55,48,55, 53,60,53,60, 55,55,48,48]},
  reino:    {bpm: 144, mel:[69,0,72,76, 74,0,72,69, 67,0,69,72, 74,0,0,0, 76,0,79,76, 74,72,74,76, 72,69,67,69, 69,0,0,0], baj:[45,45,52,45, 41,41,48,41, 43,43,50,43, 45,52,45,45]},
  jefe:     {bpm: 168, mel:[69,72,76,72, 69,72,77,72, 69,72,76,72, 68,71,76,71, 69,72,76,79, 77,76,74,72, 71,72,74,71, 69,0,69,0], baj:[45,45,52,45, 45,45,53,45, 45,45,52,45, 44,44,52,44]},
  final:    {bpm: 150, mel:[72,0,76,79, 84,0,79,84, 88,86,84,79, 81,0,0,0, 77,81,84,81, 79,84,88,84, 86,84,83,86, 84,0,0,0], baj:[48,55,52,55, 53,57,48,55, 53,57,48,52, 55,55,48,48]},
};
/* la canción de Fernando suena en el castillo y también en el Reino Pichunite */
const CANCIONES = {castillo: 'musica_castillo.mp3', reino: 'musica_castillo.mp3'};
const cancion = {el: null, src: '', fallo: false, despierta: false};
function crearCancion(){
  if (cancion.el || !AC) return cancion.el;
  cancion.el = new Audio(); cancion.el.loop = true; cancion.el.preload = 'auto';
  cancion.el.addEventListener('error', ()=>{ cancion.fallo = true; });
  /* por el audio del juego: en iPhone el volumen de un <audio> no se puede cambiar */
  try{ const src = AC.createMediaElementSource(cancion.el); cancion.g = AC.createGain(); cancion.g.gain.value = 0.5; src.connect(cancion.g); cancion.g.connect(AC.destination); }catch(e){ cancion.g = null; }
  return cancion.el;
}
/* En iPhone una canción solo puede empezar a sonar dentro de un toque de la pantalla. Por eso, en
   los primeros toques se la «despierta» (se le da play ahí mismo); desde ese momento el juego la
   puede prender y apagar cuando quiera. */
function despertarCancion(){
  if (cancion.despierta || cancion.fallo || !AC) return;
  const el = crearCancion(); if (!el) return;
  const archivo = CANCIONES[musica.nombre()] || CANCIONES.castillo;
  if (!cancion.src){ cancion.src = archivo; el.src = archivo; }
  try{
    const pr = el.play();
    const listo = ()=>{ cancion.despierta = true; if (!CANCIONES[musica.nombre()] || !OPC.musica || !OPC.sonido) el.pause(); };
    if (pr && pr.then) pr.then(listo).catch(()=>{}); else listo();
  }catch(e){}
}
const musica = (function(){
  let actual = null, paso = 0, prox = 0;
  return {
    tema(n){ if (actual !== n){ actual = n; paso = 0; prox = AC ? AC.currentTime + 0.1 : 0; } },
    nombre(){ return actual; },
    tick(){
      /* en el castillo suena la canción de Fernando (mp3); en los demás mundos, la música 8 bits */
      const archivo = CANCIONES[actual];
      const usarArchivo = !!(archivo && !cancion.fallo);
      if (cancion.el && (!usarArchivo || cancion.src !== archivo || !OPC.musica || !OPC.sonido || document.hidden)){ try{ cancion.el.pause(); }catch(e){} }
      if (!AC || !actual || !OPC.musica) return;
      if (usarArchivo){
        if (!OPC.sonido || document.hidden) return;
        crearCancion();
        if (cancion.src !== archivo){ cancion.src = archivo; cancion.el.src = archivo; }
        cancion.el.volume = cancion.g ? 1 : 0.5*DUCK.nivel;
        if (cancion.el.paused) cancion.el.play().catch(()=>{});
        return;
      }
      const T = TEMAS_MUS[actual]; if (!T) return;
      const dur = 60/T.bpm/2;
      if (prox < AC.currentTime) prox = AC.currentTime + 0.05;
      while (prox < AC.currentTime + 0.25){
        const m = T.mel[paso % T.mel.length];
        if (m) tono(nota(m), 0, dur*0.9, T.onda || 'square', 0.05, prox, busMusica);
        if (paso % 2 === 0){ const b = T.baj[(paso/2) % T.baj.length]; tono(nota(b), 0, dur*1.8, 'triangle', 0.11, prox, busMusica); }
        if (paso % 4 === 2) ruido(0.05, 0.035, 6000, prox);
        paso++; prox += dur;
      }
    },
  };
})();

/* ---------------- voces ---------------- */
let voces = [];
function cargarVoces(){ try{ voces = speechSynthesis.getVoices(); }catch(e){ voces = []; } }
if (typeof speechSynthesis !== 'undefined'){ cargarVoces(); speechSynthesis.onvoiceschanged = cargarVoces; }
function vozEspanola(){
  if (!voces.length) cargarVoces();
  const es = voces.filter(v=>v.lang && v.lang.toLowerCase().startsWith('es'));
  return es.find(v=>/es[-_](419|MX|US|CO|VE|AR|CL)/i.test(v.lang)) || es[0] || null;
}
/* primero la voz grabada (voces.js, las mismas de la Aventura 3D); si no hay, la del navegador */
const VOCES = window.F3D_VOCES || {};
let vozSonando = null;
function hablar(texto, quien){
  if (!OPC.sonido) return;
  const quienVoz = quien === 'fer' ? OPC.pj : quien;
  const url = VOCES[quienVoz] && VOCES[quienVoz][texto];
  if (url){
    try{
      if (vozSonando){ vozSonando.pause(); vozSonando = null; }
      try{ speechSynthesis.cancel(); }catch(e){}
      const a = new Audio(url); a.volume = 1; vozSonando = a;
      a.play().catch(()=>{ if (vozSonando === a) hablarTTS(texto, quien); });
      return;
    }catch(e){}
  }
  hablarTTS(texto, quien);
}
function hablarTTS(texto, quien){
  if (typeof speechSynthesis === 'undefined' || !OPC.sonido) return;
  if (quien === 'fer' && F.QUIEN[OPC.pj]) quien = OPC.pj;
  try{
    const q = F.QUIEN[quien] || {};
    const u = new SpeechSynthesisUtterance(texto.replace(/[¡¿]/g, ''));
    u.lang = 'es-ES';
    const v = vozEspanola(); if (v){ u.voice = v; u.lang = v.lang; }
    u.pitch = q.pitch || 1.5; u.rate = q.rate || 1; u.volume = 1;
    speechSynthesis.cancel();
    setTimeout(()=>{ try{ speechSynthesis.resume(); speechSynthesis.speak(u); }catch(e){} }, 40);
  }catch(e){}
}

/* ---------------- eventos del núcleo → sonidos, chispas y voces ---------------- */
let banner = null, cartelEstrella = null, avisoCerrado = null;
function procesarEventos(){
  for (const e of J.eventos){
    switch (e.tipo){
      case 'habla': hablar(e.texto, e.quien); break;
      case 'salto': sonar('salto'); emitir(e.x, e.y + 0.1, e.z, 6, {color:'#ffffff', vel:1.5, grav:2, vida:0.4, tam:0.3, plano:true}); break;
      case 'salto2': sonar('salto2'); anim.voltereta = 0.42; emitir(e.x, e.y + 0.4, e.z, 10, {colores:['#ffffff', '#ffe36e'], vel:2.5, grav:1, vida:0.5, tam:0.25}); break;
      case 'disparo': sonar(e.arma); break;
      case 'explota': sonar('explota'); cam.temblor = Math.max(cam.temblor, 0.2);
        emitir(e.x, e.y, e.z, 70, {colores: e.arma === 'globos' ? ['#7ad0ff', '#ffffff', '#3a8aff'] : ['#ff5ab0', '#ffd23f', '#5ad8ff', '#7ae05a', '#b07aff'], vel: e.r*2.2, vy:3, grav:4, vida:1, tam:0.35}); break;
      case 'pocion': sonar('pocion'); emitir(e.x, e.y, e.z, 30, {colores:['#5ab8ff', '#ffffff'], vel:3, vy:2, grav:-1, vida:0.8, tam:0.35}); break;
      case 'escudoGolpe': sonar('escudo'); burbujaEscudo.t = 0.45; emitir(e.x, e.y, e.z, 24, {colores:['#5ab8ff', '#ffffff'], vel:5, grav:0, vida:0.5, tam:0.3}); break;
      case 'salto3': sonar('salto3'); anim.voltereta = 0.6; emitir(e.x, e.y + 0.3, e.z, 20, {colores:['#ffd23f', '#ffffff', '#e8262a'], vel:3, grav:1, vida:0.6, tam:0.3}); break;
      case 'fuegoMalo': sonar('fuegoMalo'); break;
      case 'autobus': banner = {texto: '¡Salta del autobús!', emoji: '🚌', t: 0}; break;
      case 'aterrizaPlaneo': emitir(e.x, e.y + 0.2, e.z, 16, {color:'#e8f0e0', vel:3, grav:2, vida:0.5, tam:0.4, plano:true}); break;
      case 'saltoAmigo': sonar('boing'); emitir(e.x, e.y, e.z, 16, {colores:['#ffe36e', '#ffffff'], vel:4, grav:2, vida:0.6, tam:0.35}); redEvento({tipo: 'fx', fx: 'pisado', x: e.x, y: e.y, z: e.z}); break;
      case 'choca': sonar('choca'); emitir(e.x, e.y, e.z, 40, {colores:['#ffd23f', '#ffffff', '#ff9ad8', '#7ad0ff'], vel:5, vy:2, grav:2, vida:0.9, tam:0.4}); brindar('✋ ¡Choca esos cinco!', '#ffe36e'); break;
      case 'clon': sonar('clon'); emitir(e.x, e.y + 0.9, e.z, 24, {colores:['#c08aff', '#ffffff'], vel:3.5, grav:0, vida:0.5, tam:0.35}); redEvento({tipo: 'fx', fx: 'clon', x: e.x, y: e.y, z: e.z}); break;
      case 'clonSeVa': emitir(e.x, e.y + 0.9, e.z, 14, {colores:['#c08aff', '#ffffff'], vel:2.5, grav:-1, vida:0.5, tam:0.35}); break;
      case 'laser':
        sonar('laser'); dispararRayo(e);
        redEvento({tipo: 'fx', fx: 'laser', x: e.x, y: e.y, z: e.z, x2: e.a.x, y2: e.a.y, z2: e.a.z});
        if (e.pego) emitir(e.a.x, e.a.y, e.a.z, 18, {colores:['#ff3a5a', '#ffd0d8', '#ffffff'], vel:5, grav:3, vida:0.4, tam:0.3});
        break;
      case 'onda': sonar('onda'); cam.temblor = 0.4; onda.t = 0.45; onda.r = e.r; onda.m.position.set(e.x, e.y + 0.12, e.z); redEvento({tipo: 'fx', fx: 'onda', x: e.x, y: e.y, z: e.z});
        emitir(e.x, e.y + 0.2, e.z, 30, {colores:['#ffffff', '#ffb0a0', '#e8d8c0'], vel:8, grav:2, vida:0.5, tam:0.45, plano:true}); break;
      case 'misil': sonar('misil'); break;
      case 'vuelta': sonar('estrella'); banner = {texto: '¡Vuelta ' + (e.vuelta + 1) + '!', emoji: '🔄', t: 0};
        emitir(e.x, e.y + 2, e.z, 80, {colores:['#ffd23f', '#ffffff', '#7ad0ff'], vel:7, grav:2, vida:1.4, tam:0.4}); break;
      case 'patada': sonar('patada'); emitir(e.x, e.y + 0.1, e.z, 6, {color:'#d8f0c0', vel:2, grav:3, vida:0.4, tam:0.3, plano:true}); break;
      case 'gol': sonar('gol'); redEvento({tipo: 'fx', fx: 'gol', x: e.x, y: e.y, z: e.z}); cam.temblor = 0.3; emitir(e.x, e.y + 1, e.z, 120, {colores:['#6ac8ff', '#ffffff', '#ffd23f'], vel:7, vy:5, grav:4, vida:1.6, tam:0.35}); banner = {texto: '¡GOOOL!', emoji: '⚽', t: 0}; break;
      case 'pelotaVuelve': emitir(e.x, e.y, e.z, 10, {color:'#ffffff', vel:2, grav:0, vida:0.5, tam:0.4}); break;
      case 'chapuzon': sonar('chapuzon'); emitir(e.x, e.y + 0.1, e.z, e.fuerte ? 34 : 20, {colores:['#ffffff', '#bfeaff', '#7ad0ff'], vel: e.fuerte ? 6 : 4, vy: e.fuerte ? 6 : 4, grav:9, vida:0.8, tam:0.35}); break;
      case 'aterriza': emitir(e.x, e.y + 0.1, e.z, e.fuerte ? 16 : 8, {color:'#f0e8d8', vel:2.5, grav:2, vida:0.5, tam:0.4, plano:true}); if (e.fuerte) cam.temblor = 0.4; break;
      case 'moneda': sonar('moneda'); emitir(e.x, e.y, e.z, 10, {colores:['#ffe36e', '#fff6c0'], vel:3, grav:3, vida:0.5, tam:0.25}); break;
      case 'roja': sonar('roja'); emitir(e.x, e.y, e.z, 24, {colores:['#ff3a4a', '#ffd0d0'], vel:4, grav:2, vida:0.8, tam:0.35}); break;
      case 'estrella':
        sonar('estrella');
        emitir(e.x, e.y, e.z, 80, {colores:['#ffd23f', '#ffffff', '#ff9ad8', '#7ad0ff'], vel:8, grav:3, vida:1.4, tam:0.45});
        cartelEstrella = {t: 0, nueva: e.nueva, total: e.total, grande: e.grande};
        guardar();
        if (e.nueva) redEvento({tipo: 'premio', que: 'estrella', id: e.clave});
        redEvento({tipo: 'fx', fx: 'estrella', x: e.x, y: e.y, z: e.z});
        break;
      case 'llevar': sonar('rescate'); cam.listo = false; emitir(e.x, e.y + 1, e.z, 40, {colores:['#5aa8ff', '#ffffff', '#ffd23f'], vel:5, grav:1, vida:0.9, tam:0.45}); break;
      case 'aparece': sonar('aparece'); emitir(e.x, e.y, e.z, 50, {colores:['#ffd23f', '#ffffff'], vel:5, grav:0, vida:1.2, tam:0.4}); break;
      case 'pisa': sonar('pisa'); emitir(e.x, e.y, e.z, 14, {colores:['#ffffff', '#ffe36e'], vel:4, grav:4, vida:0.5, tam:0.3}); break;
      case 'muere':
        if (e.tipo === 'llama'){ sonar('pinata'); emitir(e.x, e.y + 1, e.z, 90, {colores:['#c070ff', '#ff70c0', '#ffe23a', '#5ad8ff', '#ffd23f'], vel:7, vy:5, grav:5, vida:1.5, tam:0.4}); }
        if (e.tipo === 'diana') emitir(e.x, e.y + 0.8, e.z, 18, {colores:['#e8262a', '#ffffff', '#c8883a'], vel:4, grav:6, vida:0.8, tam:0.3}); if (e.como !== 'pisa') sonar('pisa'); emitir(e.x, e.y, e.z, 18, {colores:['#ffffff', '#c8c8c8', '#ffe36e'], vel:4, grav:3, vida:0.6, tam:0.4}); break;
      case 'golpe': sonar('golpe'); cam.temblor = 0.5; emitir(e.x, e.y + 0.8, e.z, 14, {colores:['#ff6a6a', '#ffffff'], vel:4, grav:4, vida:0.5, tam:0.3}); break;
      case 'poder': if (e.poder === 'robot') sonar('robot'); else sonar('poder'); emitir(e.x, e.y + 1, e.z, 50, {colores:['#ffffff', MOD.COLOR_PODER[e.poder]], vel:6, grav:1, vida:1, tam:0.4}); break;
      case 'caja': sonar('caja'); emitir(e.x, e.y, e.z, 40, {colores:['#ffffff', MOD.COLOR_PODER[e.poder], '#ffd23f'], vel:6, grav:5, vida:0.9, tam:0.35}); break;
      case 'fuego': sonar('fuego'); break;
      case 'giro': sonar('giro'); emitir(e.x, e.y + 0.7, e.z, 16, {color:'#ffffff', vel:4, grav:0, vida:0.3, tam:0.3, plano:true}); break;
      case 'boing': sonar('boing'); for (const r of MUNDO.resortes) if (Math.hypot(r.s.x - e.x, r.s.z - e.z) < 2) r.apretado = 1; emitir(e.x, e.y, e.z, 16, {colores:['#ffffff', '#ff6a7a'], vel:4, grav:2, vida:0.5, tam:0.35}); break;
      case 'portal': sonar('portal'); break;
      case 'mundo': break;
      case 'jefeGolpe': sonar('jefeGolpe'); cam.temblor = 0.7; emitir(e.x, e.y, e.z, 40, {colores:['#ffffff', '#ffd23f', '#ff6a3a'], vel:7, grav:3, vida:0.8, tam:0.5}); break;
      case 'jefeCae': sonar('estrella'); cam.temblor = 1; emitir(e.x, e.y, e.z, 120, {colores:['#ffffff', '#ffd23f', '#ff6a3a', '#7ad0ff'], vel:10, grav:3, vida:1.4, tam:0.6}); musica.tema(TEMAS[J.M.def.tema].musica); break;
      case 'jefeDespierta': musica.tema('jefe'); cam.temblor = 0.4; break;
      case 'jefeSalta': break;
      case 'temblor': sonar('temblor'); cam.temblor = 0.8; emitir(e.x, e.y + 0.2, e.z, 30, {color:'#e8d8c0', vel:7, grav:2, vida:0.6, tam:0.7, plano:true}); break;
      case 'nace': emitir(e.x, e.y + 0.5, e.z, 20, {color:'#c06aff', vel:3, grav:0, vida:0.7, tam:0.4}); break;
      case 'puno': sonar('puno'); cam.temblor = 0.3; emitir(e.x, e.y, e.z, 30, {colores:['#ffd23f', '#ffffff', '#5aa8ff'], vel:6, grav:2, vida:0.6, tam:0.45}); break;
      case 'tioVuela': sonar('tioVuela'); break;
      case 'regalo': sonar('caja'); break;
      case 'rescate': sonar('rescate'); emitir(J.p.x, J.p.y + 1, J.p.z, 30, {colores:['#5aa8ff', '#ffffff', '#d82800'], vel:4, grav:1, vida:0.8, tam:0.4}); cam.listo = false; break;
      case 'bloqueado': sonar('bloqueado'); avisoCerrado = {t: 0, necesita: e.necesita}; break;
      case 'amigo': emitir(e.x, e.y + 1.5, e.z, 30, {colores:['#ff9ad8', '#ffffff'], vel:3, grav:-1, vida:1, tam:0.4}); break;
      case 'final': sonar('final'); musica.tema('final'); break;
      case 'finPoder': break;
    }
  }
  J.eventos.length = 0;
}

/* ---------------- controles ---------------- */
const teclas = new Set();
let tocado = false;
const pulsos = new Set();      // lo que se apretó entre dos cuadros cuenta aunque se suelte rapidito
addEventListener('keydown', e=>{
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab', 'Backspace'].includes(e.code)) e.preventDefault();
  if (UI.abierto){ teclaAmigos(e); return; }
  teclas.add(e.code); pulsos.add(e.code);
  primerToque();
  if (e.code === 'Escape') salir();
  if (e.code === 'KeyT') irConSiguiente();
  if (e.code === 'Tab' && MINI.lienzo) MINI.grande = !MINI.grande;
  if (e.code === 'KeyH' && !e.repeat){ if (hayAmigosEnSala()) empezarHablar(); else brindar('🎙️ Para hablar, primero entra a una sala con tus amigos (botón 👥)', '#ffe36e'); }
  if (e.code === 'KeyM'){ OPC.musica = !OPC.musica; if (busMusica) busMusica.gain.value = OPC.musica ? 0.32 : 0; guardar(); }
});
addEventListener('keyup', e=>{ teclas.delete(e.code); if (e.code === 'KeyH') terminarHablar(); });
addEventListener('blur', ()=>teclas.clear());
/* en algunos iPhone el sonido solo se puede soltar al levantar el dedo (o en un clic) */
for (const ev of ['touchend', 'click']) addEventListener(ev, ()=>{ if (tocado){ audio(); despertarCancion(); } }, {passive: true});
function primerToque(){
  audio();
  despertarCancion();
  if (!tocado){ tocado = true; }
  if (J.fase === 'titulo'){ F.empezar(J); musica.tema(TEMAS[J.M.def.tema].musica); }
}
function salir(){ if (window.SIN_SALIR) return; guardar(); try{ speechSynthesis.cancel(); }catch(e){} location.href = window.URL_MENU || '../'; }

/* táctil: palanca a la izquierda, botones a la derecha, arrastrar para girar la cámara */
const TACTIL = {usado: MOVIL, joy: null, botones: {}, pulsos: {}, cam: null};
function botonesTactiles(){
  const s = Math.min(W, H)/400, r = (n)=>n*clamp(s, 0.8, 1.35);
  return {
    salto: {x: W - r(78), y: H - r(84), r: r(54), etiqueta: '⤒', color: '#4ae060'},
    poder: {x: W - r(190), y: H - r(58), r: r(42), etiqueta: '', color: '#ff7a3a'},
    ayuda: {x: W - r(150), y: H - r(178), r: r(40), etiqueta: '🦸', color: '#5aa8ff'},
    salir: window.SIN_SALIR ? {x: -999, y: -999, r: 0} : {x: 30, y: 30, r: 22, etiqueta: '✕', color: '#ffffff'},
    sonido: {x: 82, y: 30, r: 22, etiqueta: '🔊', color: '#ffffff'},
    amigos: RED && RED.hay && RED.hay() ? {x: 134, y: 30, r: 22, etiqueta: '👥', color: '#ffffff'} : {x: -999, y: -999, r: 0},
    ircon: hayAmigosListos() && J.fase === 'juego' ? {x: W - 52, y: MINI.lienzo ? 330 : 152, r: 30, etiqueta: '🚀', color: '#ffd23f'} : {x: -999, y: -999, r: 0},
    /* el walkie-talkie: grande y a la izquierda, sobre el lugar donde se mueve */
    /* siempre está mientras se juega; sin amigos conectados se ve apagadito y explica qué hacer */
    hablar: J.fase !== 'titulo' && !UI.abierto ? {x: r(74), y: Math.max(r(170), H - r(260)), r: r(48), etiqueta: '🎙️', color: '#ff3a6a'} : {x: -999, y: -999, r: 0},
  };
}
const toques = new Map();
hud.addEventListener('pointerdown', e=>{
  e.preventDefault();
  if (e.pointerType === 'touch') TACTIL.usado = true;
  if (UI.abierto){ audio(); clicAmigos(e.clientX, e.clientY); return; }
  const B = botonesTactiles();
  if (Math.hypot(e.clientX - B.amigos.x, e.clientY - B.amigos.y) < B.amigos.r*1.35){ audio(); abrirAmigos(); return; }
  primerToque();
  if (Math.hypot(e.clientX - B.ircon.x, e.clientY - B.ircon.y) < B.ircon.r*1.3){ irConSiguiente(); return; }
  if (tocaMinimapa(e.clientX, e.clientY)) return;
  if (B.hablar.r && Math.hypot(e.clientX - B.hablar.x, e.clientY - B.hablar.y) < B.hablar.r*1.25){
    if (!hayAmigosEnSala()){
      audio();
      if (RED && RED.activa && RED.activa()) brindar('🎙️ Cuando entre un amigo a la sala ' + RED.sala + ' podrán hablar', '#ffe36e');
      else { brindar('🎙️ Para hablar, primero entra a una sala con tus amigos', '#ffe36e'); abrirAmigos(); }
      return;
    }
    toques.set(e.pointerId, {tipo: 'hablar'}); try{ hud.setPointerCapture(e.pointerId); }catch(er){}
    empezarHablar(); return;
  }
  for (const k in B){
    const b = B[k];
    if (k === 'amigos' || k === 'ircon' || k === 'hablar') continue;
    if (Math.hypot(e.clientX - b.x, e.clientY - b.y) < b.r*1.35){
      if (k === 'salir'){ salir(); return; }
      if (k === 'sonido'){ OPC.sonido = !OPC.sonido; OPC.musica = OPC.sonido; if (maestro) maestro.gain.value = OPC.sonido ? 0.55 : 0; if (busMusica) busMusica.gain.value = OPC.musica ? 0.32 : 0; if (!OPC.sonido) try{ speechSynthesis.cancel(); }catch(er){} guardar(); return; }
      if (!TACTIL.usado && e.pointerType === 'mouse') break;
      toques.set(e.pointerId, {tipo: 'boton', k}); TACTIL.botones[k] = true; TACTIL.pulsos[k] = true;
      try{ hud.setPointerCapture(e.pointerId); }catch(er){}
      return;
    }
  }
  if (e.clientX < W*0.45 && (TACTIL.usado || e.pointerType !== 'mouse')){
    toques.set(e.pointerId, {tipo: 'joy'}); TACTIL.joy = {x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY};
  } else {
    toques.set(e.pointerId, {tipo: 'cam', x: e.clientX, y: e.clientY}); TACTIL.cam = {dx: 0, dy: 0};
  }
  try{ hud.setPointerCapture(e.pointerId); }catch(er){}
}, {passive: false});
hud.addEventListener('pointermove', e=>{
  const t = toques.get(e.pointerId); if (!t) return;
  if (t.tipo === 'joy' && TACTIL.joy){ TACTIL.joy.x = e.clientX; TACTIL.joy.y = e.clientY; }
  if (t.tipo === 'cam' && TACTIL.cam){ TACTIL.cam.dx += e.clientX - t.x; TACTIL.cam.dy += e.clientY - t.y; t.x = e.clientX; t.y = e.clientY; }
});
function soltar(e){
  const t = toques.get(e.pointerId); if (!t) return;
  if (t.tipo === 'joy') TACTIL.joy = null;
  if (t.tipo === 'boton') TACTIL.botones[t.k] = false;
  if (t.tipo === 'cam') TACTIL.cam = null;
  if (t.tipo === 'hablar') terminarHablar();
  toques.delete(e.pointerId);
}
hud.addEventListener('pointerup', soltar);
hud.addEventListener('pointercancel', soltar);
hud.addEventListener('contextmenu', e=>e.preventDefault());

let mandoAnt = {};
function leerControles(dt){
  const c = {x: 0, y: 0, salto: false, poder: false, ayuda: false, camX: 0, camY: 0};
  const k = n=>teclas.has(n) || pulsos.has(n);
  if (k('ArrowLeft') || k('KeyA')) c.x -= 1;
  if (k('ArrowRight') || k('KeyD')) c.x += 1;
  if (k('ArrowUp') || k('KeyW')) c.y += 1;
  if (k('ArrowDown') || k('KeyS')) c.y -= 1;
  if (k('Space') || k('KeyZ') || k('KeyK')) c.salto = true;
  if (k('KeyX') || k('KeyJ') || k('ShiftLeft') || k('ShiftRight')) c.poder = true;
  if (k('KeyC') || k('KeyL')) c.ayuda = true;
  if (k('KeyQ')) c.camX -= 1;
  if (k('KeyE')) c.camX += 1;
  if (k('KeyR')) c.camY += 1;
  if (k('KeyF')) c.camY -= 1;
  if (k('Enter') && J.fase === 'titulo') primerToque();
  /* mando */
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  for (const g of pads){
    if (!g) continue;
    const ax = g.axes, b = i=>g.buttons[i] && g.buttons[i].pressed;
    if (Math.abs(ax[0]) > 0.2) c.x += ax[0];
    if (Math.abs(ax[1]) > 0.2) c.y -= ax[1];
    if (ax.length > 3){ if (Math.abs(ax[2]) > 0.2) c.camX += ax[2]; if (Math.abs(ax[3]) > 0.2) c.camY -= ax[3]; }
    if (b(14)) c.x -= 1; if (b(15)) c.x += 1; if (b(12)) c.y += 1; if (b(13)) c.y -= 1;
    if (b(0) || b(1)) c.salto = true;
    if (b(2) || b(3) || b(7)) c.poder = true;
    if (b(4) || b(5) || b(6)) c.ayuda = true;
    const algo = g.buttons.some(x=>x && x.pressed);
    if (algo && !mandoAnt[g.index]) primerToque();
    mandoAnt[g.index] = algo;
    TACTIL.usado = TACTIL.usado && !algo;
  }
  /* táctil */
  if (TACTIL.joy){
    const j = TACTIL.joy, R = 60;
    let dx = j.x - j.x0, dy = j.y - j.y0; const d = Math.hypot(dx, dy);
    if (d > R){ j.x0 = j.x - dx/d*R; j.y0 = j.y - dy/d*R; dx = j.x - j.x0; dy = j.y - j.y0; }
    c.x += dx/R; c.y -= dy/R;
  }
  if (TACTIL.botones.salto || TACTIL.pulsos.salto) c.salto = true;
  if (TACTIL.botones.poder || TACTIL.pulsos.poder) c.poder = true;
  if (TACTIL.botones.ayuda || TACTIL.pulsos.ayuda) c.ayuda = true;
  TACTIL.pulsos = {}; pulsos.clear();
  if (TACTIL.cam){ c.camX += clamp(TACTIL.cam.dx*0.9/Math.max(dt, 0.001)/W, -3, 3); c.camY += clamp(-TACTIL.cam.dy*0.6/Math.max(dt, 0.001)/H, -3, 3); TACTIL.cam.dx = 0; TACTIL.cam.dy = 0; }
  /* ratón: arrastrar con botón derecho o izquierdo fuera de los botones ya cuenta como cámara */
  const m = Math.hypot(c.x, c.y); if (m > 1){ c.x /= m; c.y /= m; }
  if (UI.abierto) return {x: 0, y: 0, salto: false, poder: false, ayuda: false, camX: 0, camY: 0};
  return c;
}

/* ---------------- el marcador (HUD) ---------------- */
function texto(t, x, y, tam, color, alin, borde){
  ctx.font = `bold ${tam}px Fredoka, 'Trebuchet MS', sans-serif`;
  ctx.textAlign = alin || 'left'; ctx.textBaseline = 'middle';
  if (borde !== false){ ctx.lineWidth = Math.max(3, tam/6); ctx.strokeStyle = 'rgba(20,10,40,0.85)'; ctx.lineJoin = 'round'; ctx.strokeText(t, x, y); }
  ctx.fillStyle = color || '#ffffff'; ctx.fillText(t, x, y);
}
function emoji(e, x, y, tam){
  ctx.font = `${tam}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e, x, y);
}
function pastilla(x, y, w, h, color){
  ctx.fillStyle = color || 'rgba(20,14,50,0.55)';
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, h/2) : ctx.rect(x, y, w, h); ctx.fill();
}
function estrellita(x, y, r, color, giro){
  ctx.save(); ctx.translate(x, y); ctx.rotate(giro || 0);
  ctx.beginPath();
  for (let i = 0; i < 10; i++){ const a = i/10*TAU - Math.PI/2, rr = i % 2 ? r*0.45 : r; ctx.lineTo(Math.cos(a)*rr, Math.sin(a)*rr); }
  ctx.closePath(); ctx.fillStyle = color || '#ffd23f'; ctx.fill();
  ctx.lineWidth = Math.max(2, r*0.14); ctx.strokeStyle = 'rgba(120,60,0,0.8)'; ctx.stroke();
  ctx.restore();
}
function envolver(t, max){
  const pal = t.split(' '), out = []; let l = '';
  for (const p of pal){ const n = l ? l + ' ' + p : p; if (ctx.measureText(n).width > max && l){ out.push(l); l = p; } else l = n; }
  if (l) out.push(l); return out;
}
let tHud = 0;
function dibujarHud(dt){
  tHud += dt;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const p = J.p, M = J.M, def = M.def;
  const chico = Math.min(W, H) < 500;
  const B = botonesTactiles();
  /* botones de arriba */
  for (const k of ['salir', 'sonido', 'amigos', 'ircon']){
    const b = B[k];
    if (!b.r) continue;
    ctx.fillStyle = k === 'ircon' ? 'rgba(90,60,10,0.7)' : 'rgba(20,14,50,0.55)'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.fill();
    if (k === 'ircon'){ ctx.lineWidth = 3; ctx.strokeStyle = '#ffd23f'; ctx.stroke(); }
    if (k === 'salir') texto('✕', b.x, b.y + 1, 22, '#ffffff', 'center', false);
    else if (k === 'sonido') emoji(OPC.sonido ? '🔊' : '🔇', b.x, b.y + 1, 20);
    else emoji(b.etiqueta, b.x, b.y + 1, b.r*0.95);
  }
  if (B.ircon.r && !chico) texto('Ir con ' + (siguienteAmigo() || {}).nombre + ' (T)', W - 90, B.ircon.y, 15, '#ffe36e', 'right');
  if (B.hablar.r && J.fase !== 'titulo'){
    const b = B.hablar, on = WALKIE.estado === 'hablando', pulso = on ? 1 + Math.sin(tHud*10)*0.08 : 1, listo = hayAmigosEnSala();
    if (!listo) ctx.globalAlpha = 0.75;
    if (on){ ctx.fillStyle = 'rgba(255,58,106,0.35)'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r*1.35*pulso, 0, TAU); ctx.fill(); }
    ctx.fillStyle = on ? '#ff3a6a' : 'rgba(20,14,50,0.6)'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r*pulso, 0, TAU); ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = on ? '#ffffff' : '#ff3a6a'; ctx.stroke();
    emoji(WALKIE.estado === 'abriendo' ? '⏳' : '🎙️', b.x, b.y + 2, b.r*0.95);
    pastilla(b.x - b.r*1.1, b.y + b.r + 6, b.r*2.2, 26, on ? 'rgba(255,58,106,0.9)' : 'rgba(20,14,50,0.6)');
    texto(on ? 'HABLANDO…' : (TACTIL.usado ? 'HABLA' : 'HABLA (H)'), b.x, b.y + b.r + 19, 14, '#ffffff', 'center');
    ctx.globalAlpha = 1;
  }
  /* quién está hablando por el walkie-talkie: un 🔊 encima de su muñeco y un aviso arriba */
  bajarJuego();
  const hablan = quienHabla();
  if (hablan.length){
    const txt = '🔊 ' + hablan.map(h=>h.nombre).join(' y ') + (hablan.length > 1 ? ' hablan' : ' está hablando');
    pastilla(W/2 - 150, 58, 300, 32, 'rgba(255,58,106,0.85)'); texto(txt, W/2, 75, 16, '#ffffff', 'center');
    for (const h of hablan){
      if (!h.r || !h.r.listo || !h.r.obj || h.r.obj.nv !== J.mundo) continue;
      _v3.set(h.r.act.x, h.r.act.y + 2.9, h.r.act.z).project(camara);
      if (_v3.z < 1) emoji('🔊', (_v3.x + 1)/2*W, (1 - _v3.y)/2*H, 28 + Math.sin(tHud*12)*3);
    }
  }
  if (RED && RED.activa && RED.activa()){
    const n = [...RED.remotos.values()].filter(r=>r.listo).length;
    const et = '👥 Sala ' + RED.sala + (n ? ' · ' + n + (n === 1 ? ' amigo' : ' amigos') : ' · esperando…');
    if (W < 820) texto(et, 16, 104, 13, '#a5d8ff', 'left');
    else texto(et, W - 16, p.poder ? 108 : 30, 15, '#a5d8ff', 'right');
  }
  if (J.fase === 'titulo'){ dibujarTitulo(); dibujarBrindis(dt); dibujarAmigos(); return; }
  /* estrellas y monedas */
  const x0 = B.amigos.r ? 168 : 116;
  pastilla(x0, 12, 118, 38);
  estrellita(x0 + 22, 31, 14, '#ffd23f', Math.sin(tHud*2)*0.2);
  texto('× ' + F.cuentaEstrellas(J.prog), x0 + 42, 32, 24, '#ffe36e');
  pastilla(x0 + 126, 12, 112, 38);
  ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.ellipse(x0 + 148, 31, 9, 13, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#a86a00'; ctx.lineWidth = 2; ctx.stroke();
  texto('× ' + J.prog.monedas, x0 + 164, 32, 22, '#ffffff');
  if (J.prog.vuelta){ pastilla(x0 + 246, 12, 74, 38); texto('🔄 ' + (J.prog.vuelta + 1), x0 + 258, 32, 22, '#ffe36e'); }
  if (J.escudo > 0){
    const ye = 98;
    pastilla(x0, ye, 150, 30); emoji('🛡️', x0 + 18, ye + 15, 20);
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(x0 + 36, ye + 10, 100, 10);
    ctx.fillStyle = '#5ab8ff'; ctx.fillRect(x0 + 36, ye + 10, J.escudo, 10);
  }
  /* monedas rojas */
  const estR = M.estrellas.find(s=>s.tipo === 'rojas');
  if (M.rojas.length && estR && !estR.visible){
    pastilla(x0, 56, Math.max(140, 20 + M.rojas.length*24), 34);
    const oroR = M.def.fraseRoja === 'balon';
    for (let i = 0; i < M.rojas.length; i++){
      ctx.fillStyle = i < J.rojasMundo ? (oroR ? '#ffd23f' : '#ff3a4a') : 'rgba(255,255,255,0.25)';
      ctx.beginPath(); ctx.arc(x0 + 20 + i*24, 73, 9, 0, TAU); ctx.fill();
      if (i < J.rojasMundo){ ctx.strokeStyle = '#ffd0d0'; ctx.lineWidth = 2; ctx.stroke(); }
    }
  }
  /* el poder que tiene */
  if (p.poder){
    const PD = F.PODERES[p.poder], cx = W - 52, cy = 52, r = 34;
    ctx.fillStyle = 'rgba(20,14,50,0.6)'; ctx.beginPath(); ctx.arc(cx, cy, r + 6, 0, TAU); ctx.fill();
    ctx.strokeStyle = MOD.COLOR_PODER[p.poder]; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + TAU*clamp(p.tPoder/PD.dur, 0, 1)); ctx.stroke();
    emoji(PD.emoji, cx, cy + 2, 34);
    if (!chico) texto(PD.nombre, cx - r - 14, cy, 18, '#ffffff', 'right');
  }
  /* el nombre del mundo al entrar */
  if (banner){
    banner.t += dt;
    const a = banner.t < 0.4 ? banner.t/0.4 : banner.t > 3 ? Math.max(0, 1 - (banner.t - 3)/0.6) : 1;
    if (a > 0){
      ctx.globalAlpha = a;
      const y = H*0.2 - (1 - a)*30;
      const tam = chico ? 26 : 38;
      ctx.font = `bold ${tam}px Fredoka, sans-serif`;
      const w = ctx.measureText(banner.texto).width + 100;
      pastilla(W/2 - w/2, y - tam*0.9, w, tam*1.8, 'rgba(20,14,50,0.6)');
      emoji(banner.emoji, W/2 - w/2 + 40, y, tam);
      texto(banner.texto, W/2 + 20, y, tam, '#ffe36e', 'center');
      ctx.globalAlpha = 1;
    } else banner = null;
  }
  /* aviso de cuadro cerrado */
  if (avisoCerrado){
    avisoCerrado.t += dt;
    if (avisoCerrado.t > 3) avisoCerrado = null;
    else {
      const y = H*0.36;
      pastilla(W/2 - 170, y - 34, 340, 68, 'rgba(60,10,30,0.7)');
      emoji('🔒', W/2 - 130, y, 32);
      texto('Necesitas ★ ' + avisoCerrado.necesita, W/2 + 20, y, 28, '#ffe36e', 'center');
    }
  }
  /* diálogo */
  const d = J.dialogos[0];
  if (d){
    const q = F.QUIEN[d.quien] || {};
    const nombre = d.nombre || q.nombre || '';
    const tam = chico ? 17 : 22;
    ctx.font = `bold ${tam}px Fredoka, sans-serif`;
    const maxW = Math.min(W - 160, 640);
    const lineas = envolver(d.texto, maxW - 110);
    const h = 44 + lineas.length*(tam + 6);
    const bx = W/2 - maxW/2, by = (TACTIL.usado ? H*0.04 + 96 : H - h - 24);
    const a = Math.min(1, d.t*6, (d.dur - d.t)*4);
    ctx.globalAlpha = clamp(a, 0, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.94)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, maxW, h, 22) : ctx.rect(bx, by, maxW, h); ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = q.color || '#ffd23f'; ctx.stroke();
    ctx.fillStyle = q.color || '#ffd23f'; ctx.beginPath(); ctx.arc(bx + 50, by + h/2, 34, 0, TAU); ctx.fill();
    emoji(q.emoji || '💬', bx + 50, by + h/2 + 2, 38);
    texto(nombre, bx + 100, by + 22, tam*0.85, q.color || '#333', 'left', false);
    ctx.fillStyle = '#1e1640'; ctx.font = `bold ${tam}px Fredoka, sans-serif`; ctx.textAlign = 'left';
    lineas.forEach((l, i)=>ctx.fillText(l, bx + 100, by + 48 + i*(tam + 6)));
    ctx.globalAlpha = 1;
  }
  /* ¡estrella! */
  if (cartelEstrella){
    cartelEstrella.t += dt;
    const t = cartelEstrella.t;
    if (t > 2.6) cartelEstrella = null;
    else {
      const k = Math.min(1, t*3), e = 1 + Math.sin(Math.min(1, t*2)*Math.PI)*0.25;
      ctx.globalAlpha = Math.min(1, (2.6 - t)*3);
      estrellita(W/2, H*0.38, 70*k*e, cartelEstrella.nueva ? '#ffd23f' : '#8ab8ff', t*2);
      texto(cartelEstrella.grande ? '¡LA GRAN ESTRELLA!' : cartelEstrella.nueva ? '¡ESTRELLA!' : '¡YA LA TENÍAS!', W/2, H*0.38 + 110, chico ? 40 : 60, '#ffe36e', 'center');
      texto('★ ' + cartelEstrella.total + ' de ' + CFG.ESTRELLAS_FIN, W/2, H*0.38 + 170, chico ? 24 : 30, '#ffffff', 'center');
      ctx.globalAlpha = 1;
    }
  }
  /* el final */
  if (J.fase === 'final'){
    const t = J.tFinal;
    if (Math.random() < 0.5) emitir(p.x + (Math.random() - 0.5)*16, p.y + 8, p.z + (Math.random() - 0.5)*16, 3, {colores:['#ff4a6a', '#ffd23f', '#4ae060', '#3aa8ff', '#c06aff'], vel:1, grav:2, vida:3, tam:0.4});
    if (t > 2.5){
      ctx.globalAlpha = Math.min(1, (t - 2.5)*1.5);
      texto('¡GANASTE, FERNANDO!', W/2, H*0.16, chico ? 36 : 58, '#ffe36e', 'center');
      texto('Recuperaste las estrellas del castillo de Tío Juan', W/2, H*0.16 + (chico ? 40 : 56), chico ? 16 : 22, '#ffffff', 'center');
      ctx.globalAlpha = 1;
    }
  }
  if (!MINI.grande) dibujarMinimapa();
  /* botones táctiles */
  if (TACTIL.usado && J.fase === 'juego'){
    for (const k of ['salto', 'poder', 'ayuda']){
      const b = B[k], on = TACTIL.botones[k];
      ctx.fillStyle = on ? 'rgba(255,255,255,0.55)' : 'rgba(20,14,50,0.42)';
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = b.color; ctx.stroke();
      if (k === 'salto') texto('SALTA', b.x, b.y + 2, b.r*0.38, '#ffffff', 'center');
      else if (k === 'poder') emoji(p.poder && (['fuego', 'laser', 'fuerza', 'robot', 'plomero'].includes(p.poder) || F.PODERES[p.poder].arma) ? F.PODERES[p.poder].emoji : '🌀', b.x, b.y + 2, b.r*0.85);
      else {
        emoji('🦸', b.x, b.y + 2, b.r*0.9);
        if (J.tio.cd > 0){ ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.arc(b.x, b.y, b.r, -Math.PI/2, -Math.PI/2 + TAU*(J.tio.cd/CFG.AYUDA_CD)); ctx.fill(); }
      }
    }
    if (TACTIL.joy){
      const j = TACTIL.joy;
      ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(j.x0, j.y0, 60, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.arc(j.x, j.y, 28, 0, TAU); ctx.fill();
    } else {
      ctx.globalAlpha = 0.35 + Math.sin(tHud*3)*0.1;
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(110, H - 110, 60, 0, TAU); ctx.stroke();
      texto('MUEVE', 110, H - 110, 16, '#ffffff', 'center');
      ctx.globalAlpha = 1;
    }
  } else if (J.fase === 'juego' && tHud < 40 && !TACTIL.usado){
    ctx.globalAlpha = clamp((40 - tHud)/5, 0, 0.85);
    pastilla(12, H - 46, 660, 34, 'rgba(20,14,50,0.55)');
    texto('Flechas: correr · Espacio: saltar · X: poder · C: ¡Tío Juan! · Q/E: cámara' + (MINI.lienzo ? ' · Tab: mapa' : ''), 26, H - 29, 16, '#ffffff');
    ctx.globalAlpha = 1;
  }
  /* el círculo que se cierra al cambiar de mundo (como en los juegos clásicos) */
  if (J.trans){
    const t = J.trans.t, rMax = Math.hypot(W, H)/2;
    const r = t < 0.6 ? rMax*(1 - t/0.6) : rMax*((t - 0.6)/0.6);
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(W/2, H/2, Math.max(0, r), 0, TAU, true); ctx.fill();
    if (t < 0.6) estrellita(W/2, H/2, Math.max(0, r*0.25), '#ffd23f', t*6);
  }
  if (MINI.grande) dibujarMinimapa();          /* el mapa grande va encima de los botones */
  dibujarBrindis(dt);
  dibujarAmigos();
}
function dibujarTitulo(){
  const chico = Math.min(W, H) < 500;
  ctx.fillStyle = 'rgba(10,6,40,0.25)'; ctx.fillRect(0, 0, W, H);
  const y = H*0.3, tam = Math.min(96, W*0.115);
  ctx.save();
  ctx.translate(W/2, y); ctx.rotate(Math.sin(tHud*1.5)*0.02);
  ctx.font = `bold ${tam}px Fredoka, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = tam*0.16; ctx.strokeStyle = '#2a0a5a'; ctx.lineJoin = 'round'; ctx.strokeText('FERNANDO 3D', 0, 0);
  const gr = ctx.createLinearGradient(0, -tam/2, 0, tam/2); gr.addColorStop(0, '#fff6a0'); gr.addColorStop(0.5, '#ffd23f'); gr.addColorStop(1, '#ff8a1a');
  ctx.fillStyle = gr; ctx.fillText('FERNANDO 3D', 0, 0);
  ctx.restore();
  texto('con Fernando y Tío Juan', W/2, y + tam*0.85, chico ? 22 : 32, '#ffffff', 'center');
  ctx.font = `bold ${tam}px Fredoka, sans-serif`;
  const anchoT = ctx.measureText('FERNANDO 3D').width/2 + tam*0.55;
  if (anchoT + tam*0.35 < W/2){
    estrellita(W/2 - anchoT, y, tam*0.38, '#ffd23f', tHud);
    estrellita(W/2 + anchoT, y, tam*0.38, '#ffd23f', -tHud);
  } else {
    estrellita(W/2 - tam, y - tam*0.95, tam*0.3, '#ffd23f', tHud);
    estrellita(W/2 + tam, y - tam*0.95, tam*0.3, '#ffd23f', -tHud);
  }
  const n = F.cuentaEstrellas(J.prog);
  if (n) texto('★ ' + n + ' de ' + CFG.ESTRELLAS_FIN + ' estrellas', W/2, y + tam*0.85 + 44, chico ? 18 : 24, '#ffe36e', 'center');
  ctx.globalAlpha = 0.6 + Math.sin(tHud*4)*0.4;
  texto(MOVIL ? '👆 Toca para jugar' : 'Aprieta ESPACIO o toca para jugar', W/2, H*0.78, chico ? 24 : 32, '#ffffff', 'center');
  ctx.globalAlpha = 1;
  if (RED && RED.hay && RED.hay() && !UI.abierto) texto('👥 arriba: jugar con amigos en línea (hasta 4)', W/2, H*0.78 + (chico ? 36 : 46), chico ? 15 : 19, '#a5d8ff', 'center');
}

/* ============================================================
   JUGAR CON AMIGOS (hasta 4, cada uno en su aparato)
   La red (red.js) es la misma de la Aventura 3D y Salomón 3D.
   Cada quien juega su partida; se ven los amigos que están en
   el mismo mundo y las estrellas que gana uno son de todos.
   ============================================================ */
const RED = window.F3D_RED || null;
const UI = {abierto: false, codigo: '', escribiendo: false, msg: '', msgT: 0, botones: [], k: 1, ox: 0, oy: 0, alto: 560, sig: 0};
const REMOTOS = new Map();
const brindis = [];
function F_decir(clave, texto, quien){ if (J.fase !== 'titulo' && J.dialogos.length < 5) J.dialogos.push({clave, quien, texto, nombre: null, t: 0, dur: Math.max(1.8, 1 + texto.length*0.062)}); }
function brindar(texto, color){ brindis.push({texto, color: color || '#ffffff', t: 0}); if (brindis.length > 4) brindis.shift(); }
function redEvento(d){ if (RED && RED.activa && RED.activa()) try{ RED.enviarEvento(d); }catch(e){} }
function amigosListos(){ return RED ? [...RED.remotos.values()].filter(r=>r.listo && r.obj && r.obj.nv >= 0) : []; }
function hayAmigosListos(){ return !!(RED && RED.activa && RED.activa() && amigosListos().length); }
function siguienteAmigo(){ const l = amigosListos(); return l.length ? l[UI.sig % l.length] : null; }
function irCon(r){
  if (!r || !r.listo) return;
  if (F.irConAmigo(J, r.obj.nv, r.act.x, r.act.y, r.act.z)){ brindar('🚀 ¡Tío Juan te lleva con ' + r.nombre + '!', '#ffe36e'); UI.abierto = false; }
}
function irConSiguiente(){ const r = siguienteAmigo(); if (r){ irCon(r); UI.sig++; } }
if (RED){
  RED.saludo = ()=>({pj: OPC.pj, n: F.PJS[OPC.pj].nombre, estrellas: Object.keys(J.prog.estrellas).filter(k=>J.prog.estrellas[k])});
  RED.alSaludo = (r, s)=>{
    let k = 0; for (const id of s.estrellas || []) if (F.recibirEstrella(J, id)) k++;
    if (k){ brindar('🎁 ' + r.nombre + ' te compartió ' + k + (k === 1 ? ' estrella' : ' estrellas') + ' ★', '#ffe36e'); sonar('aparece'); guardar(); }
  };
  RED.on.llega = r=>{
    brindar('👋 ¡' + r.nombre + ' entró a jugar!', '#8ce99a'); sonar('caja');
    /* Fernando saluda al amigo con su frase grabada, o el amigo se presenta con la suya */
    const S = F.SALUDOS[r.pj];
    if (OPC.pj === 'fernando' && S && r.pj !== 'fernando') F_decir('saludo' + r.pj, S[1], 'fer');
    else { const g = {fernando: ['fernando', '¡Fernando Bros! ¡Vamos Penny y Sheldon!'], lucca: ['lucca', '¡Hola! ¡Soy Lucca, el amigo de Fernando!'], salomon: ['salomon', '¡Hola! ¡Salomón quiere jugar!'], cucu: ['cucu', '¡Hola! ¡Soy Cucú! ¿Jugamos?']}[r.pj]; if (g) F_decir('saludo' + r.pj, g[1], g[0]); }
  };
  RED.on.seVa = r=>brindar('👋 ' + r.nombre + ' se fue', '#ced4da');
  RED.on.aviso = t=>brindar(t, '#a5d8ff');
  RED.on.evento = (r, d)=>{
    if (d.tipo === 'premio' && d.que === 'estrella' && F.recibirEstrella(J, d.id)){
      brindar('⭐ ¡' + r.nombre + ' consiguió una estrella! ¡Es de todos!', '#ffe36e'); sonar('estrella'); guardar();
    } else if (d.tipo === 'fx' && r.obj && r.obj.nv === J.mundo){
      if (d.fx === 'estrella') emitir(d.x, d.y, d.z, 60, {colores:['#ffd23f', '#ffffff', '#ff9ad8'], vel:7, grav:3, vida:1.2, tam:0.45});
      else if (d.fx === 'pisado'){
        /* un amigo me saltó encima (o a otro amigo) */
        emitir(d.x, d.y, d.z, 14, {colores:['#ffe36e', '#ffffff'], vel:3, grav:1, vida:0.7, tam:0.35});
        if (Math.hypot(d.x - J.p.x, d.z - J.p.z) < 2.5){ sonar('boing'); brindar('🤸 ¡' + r.nombre + ' rebotó en tu cabeza!', '#ffe36e'); }
      }
      else if (d.fx === 'onda'){ sonar('onda'); onda.t = 0.45; onda.r = 6; onda.m.position.set(d.x, d.y + 0.12, d.z); emitir(d.x, d.y + 0.2, d.z, 24, {colores:['#ffffff', '#ffb0a0'], vel:7, grav:2, vida:0.5, tam:0.45, plano:true}); }
      else if (d.fx === 'laser' && d.x2 != null){ sonar('laser'); dispararRayo({x: d.x, y: d.y, z: d.z, a: {x: d.x2, y: d.y2, z: d.z2}}, r.act.ang, r.obj.escala || 1); }
      else if (d.fx === 'clon') emitir(d.x, d.y + 0.9, d.z, 20, {colores:['#c08aff', '#ffffff'], vel:3, grav:0, vida:0.5, tam:0.35});
      else if (d.fx === 'gol'){ sonar('gol'); emitir(d.x, d.y + 1, d.z, 80, {colores:['#6ac8ff', '#ffffff', '#ffd23f'], vel:7, vy:5, grav:4, vida:1.4, tam:0.35}); brindar('⚽ ¡Gol de ' + r.nombre + '!', '#ffe36e'); }
    }
  };
}
/* ============================================================
   EL WALKIE-TALKIE
   Se deja apretado el botón 🎙️ (o la tecla H), se habla y se suelta. La voz va a los amigos
   de la sala en pedacitos de medio segundo, así se escucha mientras uno todavía está hablando.
   Va como un radio de verdad: 8000 muestras por segundo, un byte cada una (μ-law), con su
   pitido al empezar y al terminar. Lo que llega se oye aunque el juego esté en silencio.
   ============================================================ */
const VOZ_HZ = 8000, VOZ_PEDAZO = 4000, VOZ_MAX_S = 15;
const WALKIE = {estado: 'listo', soltado: false, stream: null, fuente: null, proc: null, de: null, muestras: [], frac: 0, acc: 0, cuenta: 0,
                n: 0, id: Math.floor(Math.random()*1000), t0: 0, ultUso: 0, rx: new Map(), salida: null};
function hayAmigosEnSala(){ return !!(RED && RED.activa && RED.activa() && RED.remotos.size); }
function aMuLaw(x){
  let v = Math.max(-32635, Math.min(32635, Math.round(x*32767)));
  const signo = v < 0 ? 0x80 : 0; if (signo) v = -v;
  v += 132;
  let exp = 7; for (let m = 0x4000; (v & m) === 0 && exp > 0; m >>= 1) exp--;
  return ~(signo | (exp << 4) | ((v >> (exp + 3)) & 0x0f)) & 0xff;
}
function deMuLaw(u){
  u = ~u & 0xff;
  const exp = (u >> 4) & 7, v = ((((u & 0x0f) << 3) + 132) << exp) - 132;
  return (u & 0x80 ? -v : v)/32768;
}
function salidaVoz(){
  if (WALKIE.salida || !AC) return WALKIE.salida;
  /* como radio: sin graves ni agudos de más, y un poquito más fuerte */
  const alto = AC.createBiquadFilter(); alto.type = 'highpass'; alto.frequency.value = 280;
  const bajo = AC.createBiquadFilter(); bajo.type = 'lowpass'; bajo.frequency.value = 3400;
  const g = AC.createGain(); g.gain.value = 1.6;
  alto.connect(bajo); bajo.connect(g); g.connect(AC.destination);
  return (WALKIE.salida = alto);
}
function pipVoz(cuando, sube){ if (!AC) return; const g = AC.createGain(); g.gain.value = 1; g.connect(AC.destination); tono(sube ? 1400 : 1900, sube ? 1900 : 1200, 0.09, 'square', 0.05, cuando, g); }
async function empezarHablar(){
  if (WALKIE.estado !== 'listo' || !hayAmigosEnSala()) return;
  audio(); if (!AC) return;
  WALKIE.soltado = false; WALKIE.estado = 'abriendo';
  try{
    if (!WALKIE.stream || !WALKIE.stream.active)
      WALKIE.stream = await navigator.mediaDevices.getUserMedia({audio: {echoCancellation: true, noiseSuppression: true, autoGainControl: true}});
  }catch(e){
    WALKIE.estado = 'listo';
    brindar('🎙️ Para hablar con tus amigos, dale permiso al micrófono', '#ffb0b0');
    return;
  }
  if (WALKIE.de !== WALKIE.stream){
    try{ if (WALKIE.fuente) WALKIE.fuente.disconnect(); }catch(e){}
    WALKIE.fuente = AC.createMediaStreamSource(WALKIE.stream); WALKIE.de = WALKIE.stream;
    if (!WALKIE.proc){
      WALKIE.proc = AC.createScriptProcessor(4096, 1, 1);
      const mudo = AC.createGain(); mudo.gain.value = 0; WALKIE.proc.connect(mudo); mudo.connect(AC.destination);
      WALKIE.proc.onaudioprocess = grabarVoz;
    }
    WALKIE.fuente.connect(WALKIE.proc);
  }
  if (WALKIE.soltado){ WALKIE.estado = 'listo'; return; }        /* soltó el botón mientras pedía permiso */
  WALKIE.id = (WALKIE.id + 1) % 1e6; WALKIE.n = 0; WALKIE.muestras = []; WALKIE.frac = 0; WALKIE.acc = 0; WALKIE.cuenta = 0;
  WALKIE.t0 = performance.now(); WALKIE.estado = 'hablando';
  pipVoz(AC.currentTime, true);
}
function grabarVoz(ev){
  if (WALKIE.estado !== 'hablando') return;
  const x = ev.inputBuffer.getChannelData(0), paso = AC.sampleRate/VOZ_HZ;
  for (let i = 0; i < x.length; i++){
    WALKIE.acc += x[i]; WALKIE.cuenta++; WALKIE.frac += 1;
    if (WALKIE.frac >= paso){ WALKIE.frac -= paso; WALKIE.muestras.push(aMuLaw(Math.max(-1, Math.min(1, WALKIE.acc/WALKIE.cuenta*1.8)))); WALKIE.acc = 0; WALKIE.cuenta = 0; }
  }
  while (WALKIE.muestras.length >= VOZ_PEDAZO) mandarVoz(false);
  if (performance.now() - WALKIE.t0 > VOZ_MAX_S*1000) terminarHablar();
}
function mandarVoz(fin){
  const trozo = WALKIE.muestras.splice(0, VOZ_PEDAZO);
  let bin = ''; for (let i = 0; i < trozo.length; i++) bin += String.fromCharCode(trozo[i]);
  try{ RED.enviarVoz({i: WALKIE.id, n: Math.min(60, WALKIE.n++), d: btoa(bin), fin}); }catch(e){}
}
function terminarHablar(){
  WALKIE.soltado = true;
  if (WALKIE.estado !== 'hablando') return;
  mandarVoz(true);
  WALKIE.estado = 'listo'; WALKIE.ultUso = performance.now();
  pipVoz(AC.currentTime, false);
}
/* el micrófono se apaga solo si no se usa por un rato (así no queda la lucecita prendida) */
setInterval(()=>{
  if (WALKIE.estado === 'listo' && WALKIE.stream && performance.now() - WALKIE.ultUso > 25000){
    try{ WALKIE.stream.getTracks().forEach(t=>t.stop()); }catch(e){}
    try{ if (WALKIE.fuente) WALKIE.fuente.disconnect(); }catch(e){}
    WALKIE.stream = null; WALKIE.fuente = null; WALKIE.de = null;
  }
}, 5000);
/* lo que dicen los amigos: se pone en fila y se oye en orden */
function oirVoz(r, v){
  if (!AC) return;
  const sal = salidaVoz(); if (!sal) return;
  let q = WALKIE.rx.get(r.id);
  const nueva = !q || q.i !== v.i;
  if (nueva){ q = {i: v.i, prox: 0, hasta: 0, nombre: r.nombre}; WALKIE.rx.set(r.id, q); }
  const ahora = AC.currentTime;
  if (q.prox < ahora + 0.05){ q.prox = ahora + 0.18; if (nueva) pipVoz(q.prox - 0.13, true); }
  if (v.d){
    const bin = atob(v.d), n = bin.length;
    /* se sube a 24000 por segundo (todos los navegadores lo aceptan) */
    const buf = AC.createBuffer(1, n*3, 24000), out = buf.getChannelData(0);
    let ant = 0;
    for (let i = 0; i < n; i++){ const s1 = deMuLaw(bin.charCodeAt(i)); out[i*3] = ant + (s1 - ant)/3; out[i*3 + 1] = ant + (s1 - ant)*2/3; out[i*3 + 2] = s1; ant = s1; }
    const src = AC.createBufferSource(); src.buffer = buf; src.connect(sal); src.start(q.prox);
    q.prox += buf.duration;
  }
  q.hasta = q.prox; q.nombre = r.nombre;
  if (v.fin) pipVoz(q.prox + 0.02, false);
}
/* mientras alguien habla por el walkie-talkie (uno mismo o un amigo) todo el juego baja al 15 %:
   música, sonidos y la canción del castillo; si un personaje empieza a hablar, se pausa y sigue después */
const DUCK = {nivel: 1, t: 0, vozPausada: null, ttsPausado: false};
function bajarJuego(){
  const ahora = performance.now(), dt = DUCK.t ? Math.min(0.1, (ahora - DUCK.t)/1000) : 0.016; DUCK.t = ahora;
  const walkie = WALKIE.estado === 'hablando' || quienHabla().length > 0;
  DUCK.nivel += ((walkie ? 0.15 : 1) - DUCK.nivel)*Math.min(1, dt*(walkie ? 12 : 3));
  if (maestro) maestro.gain.value = (OPC.sonido ? 0.55 : 0)*DUCK.nivel;
  if (busMusica) busMusica.gain.value = OPC.musica ? 0.32 : 0;
  if (cancion.g) cancion.g.gain.value = 0.5*DUCK.nivel; else if (cancion.el) cancion.el.volume = 0.5*DUCK.nivel;
  if (walkie){
    if (vozSonando && !vozSonando.paused){ try{ vozSonando.pause(); }catch(e){} DUCK.vozPausada = vozSonando; }
    try{ if (speechSynthesis.speaking && !speechSynthesis.paused){ speechSynthesis.pause(); DUCK.ttsPausado = true; } }catch(e){}
  } else {
    if (DUCK.vozPausada){ const v = DUCK.vozPausada; DUCK.vozPausada = null; if (v === vozSonando) v.play().catch(()=>{}); }
    if (DUCK.ttsPausado){ DUCK.ttsPausado = false; try{ speechSynthesis.resume(); }catch(e){} }
  }
}
function quienHabla(){
  if (!AC) return [];
  const t = AC.currentTime, l = [];
  for (const [id, q] of WALKIE.rx){ if (t < q.hasta + 0.15){ const r = RED && RED.remotos.get(id); l.push({nombre: q.nombre, r}); } }
  return l;
}
if (RED) RED.on.voz = (r, v)=>{ try{ oirVoz(r, v); }catch(e){ console.warn('voz: ' + (e && e.message)); } };

/* los muñecos de los amigos */
function crearMuneco(r){
  const P = F.PJS[r.pj] || F.PJS.fernando;
  const m = modeloPj(r.pj);
  const cartel = cartelito(r.nombre, P.color); cartel.position.y = 2.3; m.g.add(cartel);
  escena.add(m.g);
  return {m, pj: r.pj, nombre: r.nombre, sombra: sombraBlob(0.6), fase: 0};
}
function quitarMuneco(o){ escena.remove(o.m.g); escena.remove(o.sombra); }
function animarRemotos(dt, t){
  if (!RED) return;
  try{ RED.paso(); }catch(e){}
  for (const [id, r] of RED.remotos){
    let o = REMOTOS.get(id);
    if (!o || o.pj !== r.pj || o.nombre !== r.nombre){ if (o) quitarMuneco(o); o = crearMuneco(r); REMOTOS.set(id, o); }
    const ver = !!(r.listo && r.obj && r.obj.nv === J.mundo && !J.trans);
    o.m.g.visible = ver; o.sombra.visible = ver;
    if (!ver) continue;
    const e = r.obj, a = r.act, f = o.m;
    if (r.pj === 'fernando' && !f.hq && HQ.fer) vestirHQ(f, 'fernando');
    if (f.hq) animarHQ(f.hq, {suelo: e.suelo, vel: e.mov, baile: e.baile, vuela: e.vuela, nada: e.nada, giro: e.giro, giroA: t*25, poder: e.poder}, dt, t);
    f.g.position.set(a.x, a.y, a.z); f.g.rotation.y = a.ang; f.g.scale.setScalar(e.escala);
    o.fase += dt*(4 + e.mov*1.6);
    const k = e.suelo ? Math.min(1, e.mov/4) : 0, s = Math.sin(o.fase);
    f.cuerpo.rotation.set(0, 0, 0); f.cuerpo.position.y = e.suelo ? Math.abs(s)*0.06*k : 0;
    f.piernaI.rotation.x = s*0.9*k; f.piernaD.rotation.x = -s*0.9*k;
    f.brazoI.rotation.x = -s*0.8*k; f.brazoD.rotation.x = s*0.8*k; f.brazoI.rotation.z = 0.25; f.brazoD.rotation.z = -0.25;
    if (e.nada){
      const kk = Math.min(1, e.mov/3), fn = t*7;
      f.cuerpo.rotation.x = 1.2*kk; f.cuerpo.position.y = 0.75*kk; f.brazoI.rotation.x = -1.6 + Math.sin(fn)*1.5*kk; f.brazoD.rotation.x = -1.6 - Math.sin(fn)*1.5*kk;
      f.piernaI.rotation.x = Math.sin(fn*2)*0.45; f.piernaD.rotation.x = -Math.sin(fn*2)*0.45;
    } else if (!e.suelo){
      if (e.vuela){ f.cuerpo.rotation.x = 0.9; f.brazoI.rotation.x = f.brazoD.rotation.x = -2.9; }
      else { f.brazoI.rotation.x = f.brazoD.rotation.x = -2.6; f.brazoI.rotation.z = 0.6; f.brazoD.rotation.z = -0.6; f.piernaI.rotation.x = -0.7; f.piernaD.rotation.x = 0.35; }
    }
    if (e.giro) f.cuerpo.rotation.y = t*25;
    animarSuper(f, e.poder, t, o.fase, k, e.suelo, e.vuela);
    if (e.baile){ f.cuerpo.position.y = Math.abs(Math.sin(t*7))*0.35; f.brazoI.rotation.x = f.brazoD.rotation.x = -2.8; }
    f.alas.visible = e.poder === 'alas';
    if (f.alas.visible) f.alas.children.forEach(w=>{ w.rotation.y = Math.sin(t*(e.vuela ? 22 : 6))*0.5*w.userData.lado; });
    f.iman.visible = e.poder === 'iman'; f.iman.rotation.y = t*3;
    const mm = f.mats;
    if (e.poder === 'fuego'){ mm.rojo.color.set('#ffffff').convertSRGBToLinear(); mm.azul.color.copy(f.base.rojo); }
    else { mm.rojo.color.copy(f.base.rojo); mm.azul.color.copy(f.base.azul); }
    if (e.poder === 'hamburguesa'){ mm.rojo.emissive.copy(arcoiris(t)); mm.rojo.emissiveIntensity = 0.7; } else mm.rojo.emissive.set('#000000');
    const g = F.suelo(J.M, a.x, a.z, a.y + 0.1, 0.2);
    o.sombra.visible = isFinite(g.y) && a.y - g.y < 12;
    if (o.sombra.visible){ o.sombra.position.set(a.x, g.y + 0.03, a.z); const kk = clamp(1 - (a.y - g.y)/10, 0.3, 1); o.sombra.scale.setScalar(kk*e.escala); o.sombra.material.opacity = kk; }
  }
  for (const [id, o] of REMOTOS) if (!RED.remotos.has(id)){ quitarMuneco(o); REMOTOS.delete(id); }
}
function dibujarBrindis(dt){
  for (let i = brindis.length - 1; i >= 0; i--){ brindis[i].t += dt; if (brindis[i].t > 4.5) brindis.splice(i, 1); }
  const chico = Math.min(W, H) < 500;
  brindis.forEach((b, i)=>{
    const a = Math.min(1, b.t*5, (4.5 - b.t)*2);
    ctx.globalAlpha = clamp(a, 0, 1);
    const tam = chico ? 15 : 19, y = (chico ? 104 : 112) + i*(tam + 18);
    ctx.font = `bold ${tam}px Fredoka, sans-serif`;
    const w = Math.min(W - 24, ctx.measureText(b.texto).width + 36);
    pastilla(W/2 - w/2, y - tam*0.85, w, tam*1.7, 'rgba(20,14,50,0.78)');
    texto(b.texto, W/2, y, tam, b.color, 'center', false);
  });
  ctx.globalAlpha = 1;
}

/* la pantalla de amigos: elegir personaje, crear sala o entrar con código */
function abrirAmigos(){ UI.abierto = true; UI.escribiendo = false; UI.msg = ''; }
function boton(x, y, w, h, txt, fn, o){
  o = o || {};
  ctx.fillStyle = o.color || 'rgba(110,80,230,0.9)';
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, 14) : ctx.rect(x, y, w, h); ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.stroke();
  texto(txt, x + w/2, y + h/2 + 1, o.tam || 19, '#ffffff', 'center', false);
  UI.botones.push({x, y, w, h, fn});
}
function envolverEn(t, max, tam){ ctx.font = `bold ${tam}px Fredoka, sans-serif`; return envolver(t, max); }
function dibujarAmigos(){
  UI.botones = [];
  if (!UI.abierto) return;
  if (UI.msgT > 0) UI.msgT -= 1/60;
  const PW = 440;
  UI.k = Math.min(1, (H - 20)/UI.alto, (W - 20)/PW);
  UI.ox = (W - PW*UI.k)/2; UI.oy = Math.max(10, (H - UI.alto*UI.k)/2);
  ctx.fillStyle = 'rgba(5,3,20,0.55)'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(UI.ox, UI.oy); ctx.scale(UI.k, UI.k);
  ctx.fillStyle = 'rgba(24,16,60,0.96)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(0, 0, PW, UI.alto, 26) : ctx.rect(0, 0, PW, UI.alto); ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = '#ffd23f'; ctx.stroke();
  boton(PW - 54, 12, 42, 42, '✕', ()=>{ UI.abierto = false; }, {color: 'rgba(224,49,49,0.8)', tam: 22});
  let y = 38;
  texto('👥 Jugar con amigos', PW/2 - 10, y, 26, '#ffe36e', 'center'); y += 36;
  texto('Elige tu personaje', PW/2, y, 16, '#dbe4ff', 'center', false); y += 20;
  const pjs = Object.keys(F.PJS);
  pjs.forEach((k, i)=>{
    const P = F.PJS[k], bx = 16 + i*104, sel = OPC.pj === k;
    ctx.fillStyle = sel ? 'rgba(255,210,63,0.25)' : 'rgba(255,255,255,0.06)';
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, y, 96, 96, 16) : ctx.rect(bx, y, 96, 96); ctx.fill();
    if (sel){ ctx.lineWidth = 4; ctx.strokeStyle = '#ffd23f'; ctx.stroke(); }
    ctx.fillStyle = P.gorra; ctx.beginPath(); ctx.arc(bx + 48, y + 38, 26, 0, TAU); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(bx + 48, y + 38, 13, 0, TAU); ctx.fill();
    texto(P.letra, bx + 48, y + 39, 18, P.gorra, 'center', false);
    texto(P.nombre, bx + 48, y + 80, 17, '#ffffff', 'center', false);
    UI.botones.push({x: bx, y, w: 96, h: 96, fn: ()=>cambiarPj(k)});
  });
  y += 112;
  const w = PW - 32, x = 16;
  if (!RED || !RED.hay || !RED.hay()){
    envolverEn('No se cargó la parte de red. Revisa el internet y recarga la página.', w, 16).forEach((l, i)=>texto(l, PW/2, y + i*22, 16, '#ffc9c9', 'center', false));
    y += 50;
  } else if (RED.estado === 'off' || RED.estado === 'error'){
    if (RED.error){ const ls = envolverEn(RED.error, w, 15); ls.forEach((l, i)=>texto(l, PW/2, y + i*20, 15, '#ffc9c9', 'center', false)); y += ls.length*20 + 10; }
    if (!UI.escribiendo){
      boton(x, y, w, 54, '✨ Crear una sala', ()=>{ RED.crear(); if (J.fase === 'titulo') primerToque(); }, {color: 'rgba(64,192,87,0.92)', tam: 22}); y += 66;
      boton(x, y, w, 54, '🔢 Entrar con el código de un amigo', ()=>{ UI.escribiendo = true; UI.codigo = ''; }, {tam: 19}); y += 66;
      envolverEn('Uno crea la sala y les manda el código (o el enlace) a los demás. Hasta 4 jugadores, cada uno en su aparato. Las estrellas que gana uno son de todos.', w, 14)
        .forEach((l, i)=>texto(l, PW/2, y + i*19, 14, 'rgba(220,228,255,0.8)', 'center', false));
      y += 64;
    } else {
      texto('Escribe el código de 4 letras', PW/2, y, 17, '#dbe4ff', 'center', false); y += 18;
      for (let i = 0; i < 4; i++){
        const bx = PW/2 - 128 + i*66;
        ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, y, 58, 64, 12) : ctx.rect(bx, y, 58, 64); ctx.fill();
        ctx.lineWidth = 3; ctx.strokeStyle = i === UI.codigo.length ? '#ffd23f' : 'rgba(255,255,255,0.3)'; ctx.stroke();
        if (UI.codigo[i]) texto(UI.codigo[i], bx + 29, y + 34, 40, '#ffd23f', 'center', false);
      }
      y += 78;
      const AL = RED.normalizarCodigo ? 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' : '';
      for (let i = 0; i < AL.length; i++){
        const c = AL[i], col = i % 8, fila = Math.floor(i/8);
        boton(x + col*52, y + fila*46, 48, 40, c, ()=>{ if (UI.codigo.length < 4) UI.codigo += c; }, {color: 'rgba(70,60,140,0.95)', tam: 20});
      }
      y += 4*46 + 6;
      boton(x, y, w/3 - 6, 46, '⌫', ()=>{ UI.codigo = UI.codigo.slice(0, -1); }, {color: 'rgba(120,120,140,0.9)', tam: 22});
      boton(x + w/3, y, w*2/3, 46, '▶ Entrar', ()=>{ if (UI.codigo.length === 4){ RED.unirse(UI.codigo); UI.escribiendo = false; if (J.fase === 'titulo') primerToque(); } },
        {color: UI.codigo.length === 4 ? 'rgba(64,192,87,0.95)' : 'rgba(90,90,110,0.7)', tam: 21});
      y += 56;
      boton(x, y, w, 38, '↩ Volver', ()=>{ UI.escribiendo = false; }, {color: 'rgba(90,90,110,0.7)', tam: 16}); y += 48;
    }
  } else {
    texto(RED.estado === 'creando' ? 'Abriendo la sala…' : RED.estado === 'uniendo' ? (RED.aviso || 'Entrando a la sala…') : 'Sala abierta · código para tus amigos:', PW/2, y, 15, '#dbe4ff', 'center', false);
    y += 44;
    texto(RED.sala.split('').join(' '), PW/2, y, 54, '#ffd23f', 'center'); y += 50;
    const lista = [...RED.remotos.values()].filter(r=>r.listo || r.saludo);
    if (!lista.length){ texto(RED.anfitrion ? 'Esperando a que entren tus amigos…' : 'Buscando a tus amigos…', PW/2, y, 16, 'rgba(220,228,255,0.85)', 'center', false); y += 30; }
    for (const r of lista){
      const P = F.PJS[r.pj] || F.PJS.fernando;
      ctx.fillStyle = P.gorra; ctx.beginPath(); ctx.arc(x + 18, y + 20, 14, 0, TAU); ctx.fill();
      texto(r.nombre, x + 42, y + 12, 18, '#ffffff', 'left', false);
      const d = r.listo && r.obj ? F.MUNDOS[r.obj.nv] : null;
      texto(d ? 'en ' + d.nombre : 'llegando…', x + 42, y + 32, 13, 'rgba(220,228,255,0.8)', 'left', false);
      if (r.listo) boton(PW - 16 - 120, y + 2, 120, 38, '🚀 Ir con…', ()=>irCon(r), {color: 'rgba(230,150,20,0.92)', tam: 16});
      y += 50;
    }
    y += 6;
    boton(x, y, w, 46, '🔗 Copiar enlace para invitar', ()=>{
      const t = RED.enlace();
      try{ navigator.clipboard.writeText(t).then(()=>{ UI.msg = '¡Enlace copiado! Pégalo en WhatsApp'; UI.msgT = 3; }, ()=>{ UI.msg = t; UI.msgT = 8; }); }catch(e){ UI.msg = t; UI.msgT = 8; }
    }, {tam: 18}); y += 56;
    boton(x, y, w, 44, '🚪 Salir de la sala', ()=>RED.salir(), {color: 'rgba(224,49,49,0.78)', tam: 17}); y += 52;
    if (RED.diagnostico) texto(RED.diagnostico(), PW/2, y, 11, 'rgba(255,255,255,0.5)', 'center', false);
    y += 16;
  }
  if (UI.msg && UI.msgT > 0){ envolverEn(UI.msg, w, 14).forEach((l, i)=>texto(l, PW/2, y + i*18, 14, '#8ce99a', 'center', false)); y += 40; }
  boton(x, y, w, 46, '🎮 ¡A jugar!', ()=>{ UI.abierto = false; if (J.fase === 'titulo') primerToque(); }, {color: 'rgba(64,140,230,0.92)', tam: 20}); y += 60;
  UI.alto = y;
  ctx.restore();
}
function clicAmigos(cx, cy){
  const vx = (cx - UI.ox)/UI.k, vy = (cy - UI.oy)/UI.k;
  for (const b of UI.botones) if (vx >= b.x && vx <= b.x + b.w && vy >= b.y && vy <= b.y + b.h){ try{ b.fn(); }catch(e){ console.warn(e); } return; }
}
function teclaAmigos(e){
  if (e.code === 'Escape'){ if (UI.escribiendo) UI.escribiendo = false; else UI.abierto = false; return; }
  if (!UI.escribiendo || !RED) return;
  if (e.code === 'Backspace'){ UI.codigo = UI.codigo.slice(0, -1); return; }
  if (e.code === 'Enter'){ if (UI.codigo.length === 4){ RED.unirse(UI.codigo); UI.escribiendo = false; } return; }
  if (e.key && e.key.length === 1) UI.codigo = RED.normalizarCodigo(UI.codigo + e.key);
}

/* ---------------- el bucle ---------------- */
/* el estado se manda 20 veces por segundo con su propio reloj, sin importar cuántos cuadros
   por segundo dibuje el aparato (en un teléfono lento los amigos igual lo ven moverse parejo) */
setInterval(()=>{
  if (RED && RED.activa && RED.activa() && J.fase !== 'titulo') try{ RED.enviarEstado(F.empaquetar(J, OPC.pj, F.PJS[OPC.pj].nombre, performance.now())); }catch(e){}
}, 50);
/* El juego avanza a 60 pasos por segundo; en pantallas de 90 o 120 Hz se dibuja entre paso y paso,
   así Fernando y Tío Juan se mueven suaves (antes Tío Juan titilaba en esas pantallas). */
const IP = {p: {x: 0, y: 0, z: 0}, pAnt: {x: 0, y: 0, z: 0}, t: {x: 0, y: 0, z: 0}, tAnt: {x: 0, y: 0, z: 0}, tVel: 0, listo: false};
function interpolar(dt){
  const a = clamp(reloj.acc/PASO, 0, 1);
  const mezcla = (o, ant, cur)=>{
    if (!IP.listo || Math.hypot(cur.x - ant.x, cur.y - ant.y, cur.z - ant.z) > 3){ o.x = cur.x; o.y = cur.y; o.z = cur.z; return; }
    o.x = ant.x + (cur.x - ant.x)*a; o.y = ant.y + (cur.y - ant.y)*a; o.z = ant.z + (cur.z - ant.z)*a;
  };
  mezcla(IP.p, IP.pAnt, J.p); mezcla(IP.t, IP.tAnt, J.tio);
  const v = Math.hypot(J.tio.x - IP.tAnt.x, J.tio.y - IP.tAnt.y, J.tio.z - IP.tAnt.z)/PASO;
  IP.tVel += ((v < 60 ? v : 0) - IP.tVel)*Math.min(1, dt*6);
  IP.listo = true;
}
const reloj = {ant: performance.now(), acc: 0};
const PASO = 1/60;
const cargando = document.getElementById('cargando');
function bucle(ahora){
  requestAnimationFrame(bucle);
  let dt = Math.min(0.1, (ahora - reloj.ant)/1000);
  reloj.ant = ahora;
  if (cargaVista !== J.cargas){ construirMundo(); dt = PASO; }
  const ctl = leerControles(dt);
  musica.tick();
  reloj.acc += dt;
  /* dónde están los amigos de este mundo (para rebotar en su cabeza, empujarse y chocar los cinco) */
  J.amigos = [];
  if (RED && RED.activa && RED.activa() && !J.trans) for (const [id, r] of RED.remotos) if (r.listo && r.obj && r.obj.nv === J.mundo) J.amigos.push({id, x: r.act.x, y: r.act.y, z: r.act.z});
  let pasos = 0;
  while (reloj.acc >= PASO && pasos < 4){
    IP.pAnt.x = J.p.x; IP.pAnt.y = J.p.y; IP.pAnt.z = J.p.z;
    IP.tAnt.x = J.tio.x; IP.tAnt.y = J.tio.y; IP.tAnt.z = J.tio.z;
    F.paso(J, PASO, {x: ctl.x, y: ctl.y, camA: cam.ang, salto: ctl.salto, poder: ctl.poder, ayuda: ctl.ayuda});
    reloj.acc -= PASO; pasos++;
    if (J.eventos.length) procesarEventos();
    if (cargaVista !== J.cargas) break;
  }
  if (pasos >= 4) reloj.acc = 0;
  interpolar(dt);
  if (cargaVista !== J.cargas) construirMundo();
  const t = J.t;
  uViento.value = t;
  matCielo.uniforms.t.value = t;
  matAgua.uniforms.t.value = t;
  moverCamara(dt, ctl);
  animarFernando(dt, t);
  animarTio(dt, t);
  animarPerros(dt, t);
  animarRemotos(dt, t);
  animarEnemigos(dt, t);
  animarCosas(dt, t);
  aclarar(dt);
  moverParticulas(dt);
  moverAmbiente(dt, t);
  dibujar();
  dibujarHud(dt);
  /* si el aparato no da, baja la calidad sola */
  if (J.fase === 'juego'){
    CAL.suma += dt; CAL.medidas++;
    if (CAL.medidas >= 120){
      const fps = CAL.medidas/CAL.suma; CAL.suma = 0; CAL.medidas = 0;
      if (fps < 40 && CAL.nivel !== 'baja' && CAL.bajadas < 2){ CAL.nivel = CAL.nivel === 'alta' ? 'media' : 'baja'; CAL.bajadas++; aplicarCalidad(); }
    }
  }
}
aplicarCalidad();
construirMundo();
cargarActivos();
if (cargando) cargando.style.display = 'none';
window.FER3D = {J: ()=>J, walkie: WALKIE, duck: DUCK, hablar: empezarHablar, callar: terminarHablar, quienHabla, camara, escena, renderer, empezar: primerToque, cal: CAL, calidad(n){ CAL.nivel = n; CAL.bajadas = 9; aplicarCalidad(); }, sol, BLOOM, cam,
  RED, UI, REMOTOS, cambiarPj, irCon, abrirAmigos, opc: OPC, cancion};
if (RED && RED.pendiente){
  /* vino con ?sala=ABCD (el enlace que mandó un amigo): se entra solo */
  setTimeout(()=>{ if (J.fase === 'titulo'){ F.empezar(J); musica.tema(TEMAS[J.M.def.tema].musica); } abrirAmigos(); RED.unirse(RED.pendiente); }, 400);
}
requestAnimationFrame(bucle);
})();
