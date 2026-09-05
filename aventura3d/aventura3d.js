(function(){
'use strict';
/* ============================================================
   FERNANDO Y TÍO JUAN: LA GRAN AVENTURA — mundo abierto en 3D
   Una isla entera para recorrer a pie, en carro, en moto, en
   barco, en avión por el cielo y en submarino por el fondo del
   mar, con toda la familia de Fernando Bros, las hamburguesas
   que dan ganas de hacer popo, los cuatro baños de la isla y el
   nuevo amigo: el Señor Popo.

   El archivo tiene dos mitades:
     · el NÚCLEO (isla, carretera, física de los vehículos,
       hamburguesas, baños, familia y misiones), que no toca la
       pantalla y se prueba con node;
     · la VISTA, que dibuja todo con Three.js y el marcador en 2D.
   ============================================================ */
const EN_NAVEGADOR = typeof window !== 'undefined' && typeof document !== 'undefined';

/* ---------------- Voces (las mismas grabaciones de Fernando Bros) ---------------- */
const AUDIO_BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Fiy4A0M4MKixWlklbu10QS1hAQ/';
const CLIPS = {
  '¡Fernando Bros! ¡Vamos Penny y Sheldon!': AUDIO_BASE+'hf_20260723_022831_be4594e7-9934-45df-82f7-ecbd7684a1b4.mp3',
  '¡Soy el pichunguito de tío Juan!': AUDIO_BASE+'hf_20260723_022843_1d4b30e7-9e12-45eb-b765-1cd4192a71f1.mp3',
  '¡Fuego pichunguito!': AUDIO_BASE+'hf_20260723_022853_3a12f5a7-1254-4828-a79d-ec513d359e17.mp3',
  '¡Tío Juan al rescate! ¡Toma una hamburguesa, pichunguito, corre!': AUDIO_BASE+'hf_20260723_022904_7e72ee2f-e753-4c38-9913-82375109fd07.mp3',
  '¡Gracias tío Juan!': AUDIO_BASE+'hf_20260723_022915_731cc734-d397-4780-b376-0ae4832f2098.mp3',
  '¡Qué rica hamburguesa!': AUDIO_BASE+'hf_20260723_022926_3851354b-3562-48ad-85a9-600895ad4076.mp3',
  'Te amo Santi, mi hermanito': AUDIO_BASE+'hf_20260723_022939_b650e98e-e039-4c68-8517-4bed26cf3136.mp3',
  'Hola Cucú, acompáñame': AUDIO_BASE+'hf_20260723_022951_60e42569-0204-4c13-a440-1b3fbb2e8323.mp3',
  'Te amo Abu': AUDIO_BASE+'hf_20260723_023000_8b6c7894-da76-44ce-8f1f-01e44d1efb18.mp3',
  '¡Gracias Abu!': AUDIO_BASE+'hf_20260723_023015_c571b81b-b462-4c5f-902b-9cb8525d3cb5.mp3',
  '¡Cuídate Abu!': AUDIO_BASE+'hf_20260723_023027_a7298a38-b585-42ce-9a0f-9c6de5170887.mp3',
  'Te amo tío Juan, yo soy tu pichunguito': AUDIO_BASE+'hf_20260723_023041_e2b52034-c05e-46b6-bd10-dbb2442db2b2.mp3',
  '¡Muy bien, mi pichunguito! ¡Eres un campeón!': AUDIO_BASE+'hf_20260723_023053_920db23a-576a-4d54-b97d-03c5bc8741fa.mp3',
  '¡Ganaste! ¡Te amo tío Juan!': AUDIO_BASE+'hf_20260723_023105_67a22a9c-82e4-4c7c-84a1-082141d8bba2.mp3',
  '¡Luca! ¡Mi amigo pichunguito!': AUDIO_BASE+'hf_20260723_023116_bf6a1862-d546-4eca-9ac2-4a9d22830f77.mp3',
  '¡Salomón! ¡Juega conmigo, pichunguito!': AUDIO_BASE+'hf_20260723_023126_b6845ef0-32b0-4f99-9e7c-7783dc4c50b2.mp3',
  '¡Qué pedo tan grande, tío Fran!': AUDIO_BASE+'hf_20260723_023137_81465d0a-8d26-4126-97b1-5ba55b001c93.mp3',
  '¡Te amo mamá!': AUDIO_BASE+'hf_20260723_023146_ec901637-45bb-4e3d-a8e0-a68153809c87.mp3',
  '¡Papá, mira cómo salto de alto!': AUDIO_BASE+'hf_20260723_023156_ebff0113-5296-49b5-adb9-0e65b4631f57.mp3',
  '¡Toma, pichungazo!': AUDIO_BASE+'hf_20260723_023207_6b418548-3e75-4413-b546-9e8adbeba2a7.mp3',
  '¡Pichunguito al ataque!': AUDIO_BASE+'hf_20260723_023217_8ad6f4d2-453d-4b77-8a92-6a2ec3f92d41.mp3',
  '¡Fernando Kart! ¡A correr, pichunguitos!': AUDIO_BASE+'hf_20260724_033516_b1c00a4e-d5e5-4256-82ab-56d68b2b009c.mp3',
  '¡Qué pedo tan podrido, tío Fran!': AUDIO_BASE+'hf_20260724_033524_9d887f77-d92c-4f82-be0c-51161dbf0fc4.mp3',
  'Eres mi pichunguito': AUDIO_BASE+'hf_20260724_033537_c3b9b915-0929-4fce-ad3c-620c24e39123.mp3',
  '¡Épale! ¡Aquí viene tío Nacho!': AUDIO_BASE+'hf_20260724_033544_c703c9ac-a713-4347-a98f-3292e001262f.mp3',
  '¡Hola mi amor! ¡Soy tía Yanny!': AUDIO_BASE+'hf_20260724_033555_824fdb5f-f639-4d48-9a3a-9475febcb25c.mp3',
  '¡Brrrp! ¡Qué rica cerveza! ¡Ay, qué pena!': AUDIO_BASE+'hf_20260724_033603_ebf5391c-9790-47e1-8617-03c3b7f376bf.mp3',
  '¡Gané! ¡Soy el pichunguito campeón!': AUDIO_BASE+'hf_20260724_033611_24c906e1-4f49-4d9f-8dad-bef017754598.mp3',
  '¡Qué divertido! ¡Otra vez, otra vez!': AUDIO_BASE+'hf_20260724_033620_de835742-0dc8-4820-a07a-dc5fa37afe22.mp3',
  '¡Guau, guau! ¡Soy el perrito pichunguito!': AUDIO_BASE+'hf_20260725_162312_d4dbf515-e01b-47da-ad9c-64e1bd77ab03.mp3',
  '¡A volar, pichunguitos!': AUDIO_BASE+'hf_20260725_162319_5f211291-4377-4290-8dba-6a44907caef6.mp3',
  '¡Todos a bordo del barco pichunguito!': AUDIO_BASE+'hf_20260725_162327_f5fa2e64-407b-4948-a00b-b83b013b79fb.mp3',
  '¡Hola pichunguito! ¡Soy tío Beto!': AUDIO_BASE+'hf_20260725_163030_8cc540e9-df84-42a8-a3f2-43da34c8f736.mp3',
  '¡Un abrazo, pichunguito! ¡Soy tía Giuliana!': AUDIO_BASE+'hf_20260725_163038_87ec8542-ec18-4e86-ac5c-17480516cb71.mp3',
  /* las frases de esta aventura: Fernando y el Señor Popo, con la misma voz de niño */
  '¡Quiero hacer popo!': AUDIO_BASE+'hf_20260904_233610_75469df0-2058-46dc-ac66-10c308254efa.mp3',
  '¡Ahh, qué alivio!': AUDIO_BASE+'hf_20260904_233610_aea4016d-7276-448f-9872-396016fc908d.mp3',
  '¡Uy, me eché un peo!': AUDIO_BASE+'hf_20260904_233610_fe3fbdba-d60d-47b5-89eb-090d7146c14c.mp3',
  '¡Tesoro! ¡Encontré el tesoro!': AUDIO_BASE+'hf_20260904_233610_bfa20432-1aed-46fa-a4c3-13572d4b5b07.mp3',
  '¡Salté la rampa!': AUDIO_BASE+'hf_20260904_233610_cb88f458-b7d4-4f73-b501-0331854d0be3.mp3',
  '¡Hola Fernando! Soy el Señor Popo. ¡Come hamburguesas y ven a mi baño!': AUDIO_BASE+'hf_20260904_233610_a068155f-b5b1-4a1b-b948-4285b70851e8.mp3',
  '¡Pasa, pasa! ¡El baño está libre!': AUDIO_BASE+'hf_20260904_233709_826bb731-f4be-4a00-a2b9-88186e358732.mp3',
  '¡Bravo, Fernando! ¡Qué popo tan grande!': AUDIO_BASE+'hf_20260904_233610_f83490ea-524e-4d27-9258-2bb23eaf49d9.mp3',
  '¡Hiciste popo en todos mis baños! ¡Eres el campeón del popo!': AUDIO_BASE+'hf_20260904_233610_2b076d8a-c436-4b16-91f0-b0b1c3a49fca.mp3',
  '¡Mira, un popo bebé me sigue!': AUDIO_BASE+'hf_20260904_233709_6ef4f4e8-c3d3-4dcd-a1f9-cfb62e319947.mp3',
};
/* Si un mp3 no carga, habla el navegador con la voz sintética y el tono
   de cada personaje. SIN_GRABACION lista las frases que a propósito no
   tienen mp3 (hoy ninguna): la prueba automática avisa si alguna se sale. */
const TONO_TTS = {
  'Eres mi pichunguito': {pitch:0.6, rate:0.95},
  '¡Épale! ¡Aquí viene tío Nacho!': {pitch:0.85, rate:1.15},
  '¡Hola mi amor! ¡Soy tía Yanny!': {pitch:1.45, rate:1.0},
  '¡Brrrp! ¡Qué rica cerveza! ¡Ay, qué pena!': {pitch:0.35, rate:0.8},
  '¡Hola pichunguito! ¡Soy tío Beto!': {pitch:0.75, rate:1.0},
  '¡Un abrazo, pichunguito! ¡Soy tía Giuliana!': {pitch:1.3, rate:1.05},
  /* Fernando */
  '¡Quiero hacer popo!': {pitch:1.9, rate:1.05},
  '¡Ahh, qué alivio!': {pitch:1.9, rate:0.9},
  '¡Uy, me eché un peo!': {pitch:1.9, rate:1.1},
  '¡Tesoro! ¡Encontré el tesoro!': {pitch:1.9, rate:1.05},
  '¡Salté la rampa!': {pitch:1.9, rate:1.05},
  '¡Mira, un popo bebé me sigue!': {pitch:1.9, rate:1.05},
  /* el Señor Popo */
  '¡Hola Fernando! Soy el Señor Popo. ¡Come hamburguesas y ven a mi baño!': {pitch:0.5, rate:0.92},
  '¡Pasa, pasa! ¡El baño está libre!': {pitch:0.5, rate:0.95},
  '¡Bravo, Fernando! ¡Qué popo tan grande!': {pitch:0.5, rate:0.9},
  '¡Hiciste popo en todos mis baños! ¡Eres el campeón del popo!': {pitch:0.5, rate:0.9},
};
const SIN_GRABACION = [];
let voces = [], reproductor = null, clipsListos = false, hablando = false, colaVoz = [];
function cargarVoces(){ try{ voces = speechSynthesis.getVoices(); }catch(e){ voces = []; } }
if (EN_NAVEGADOR && typeof speechSynthesis !== 'undefined'){ cargarVoces(); speechSynthesis.onvoiceschanged = cargarVoces; }
function prepararClips(){
  /* iOS solo deja sonar audios tocados por el usuario: un único reproductor
     que se desbloquea con el primer toque y luego va cambiando de frase */
  if (clipsListos || typeof Audio === 'undefined') return;
  clipsListos = true;
  try{
    reproductor = new Audio();
    reproductor.preload = 'auto';
    reproductor.src = CLIPS['¡Pichunguito al ataque!'];
    if (reproductor.load) reproductor.load();
  }catch(e){ reproductor = null; }
}
function vozEspanola(){
  if (!voces.length) cargarVoces();
  const es = voces.filter(v=>v.lang && v.lang.toLowerCase().startsWith('es'));
  return es.find(v=>/es[-_](419|MX|US|CO|VE|AR|CL)/i.test(v.lang)) || es[0] || null;
}
/* Cola de diálogos: cada frase espera a que termine la anterior, sea mp3 o voz sintética */
function hablar(texto){
  if (!EN_NAVEGADOR) return;
  colaVoz.push({src: CLIPS[texto] || null, texto});
  if (colaVoz.length > 3) colaVoz.shift();
  reproducirCola();
}
function reproducirCola(){
  if (hablando) return;
  const sig = colaVoz.shift();
  if (!sig) return;
  if (!sig.src || !reproductor){ hablarTTS(sig.texto); return; }
  try{
    hablando = true;
    let sono = false;
    const fallar = ()=>{
      if (sono) return; sono = true;
      try{ reproductor.pause(); }catch(e){}
      hablando = false; hablarTTS(sig.texto);
    };
    reproductor.onended = ()=>{ hablando = false; reproducirCola(); };
    reproductor.onerror = fallar;
    reproductor.onplaying = ()=>{ sono = true; };
    if (reproductor.src !== sig.src) reproductor.src = sig.src;
    else { try{ reproductor.currentTime = 0; }catch(e){} }
    const p = reproductor.play();
    if (p && p.catch) p.catch(fallar);
    setTimeout(()=>{ if(!sono) fallar(); }, 2000);
  }catch(e){ hablando = false; hablarTTS(sig.texto); }
}
function hablarTTS(texto){
  if (typeof speechSynthesis === 'undefined'){ hablando = false; reproducirCola(); return; }
  try{
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-ES';
    const v = vozEspanola();
    if (v){ u.voice = v; u.lang = v.lang; }
    const t = TONO_TTS[texto];
    u.pitch = t ? t.pitch : 1.9; u.rate = t ? t.rate : 1.05; u.volume = 1;
    hablando = true;
    let listo = false;
    const fin = ()=>{ if (listo) return; listo = true; hablando = false; reproducirCola(); };
    u.onend = fin; u.onerror = fin;
    setTimeout(fin, 1500 + texto.length*90);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }catch(e){ hablando = false; reproducirCola(); }
}

/* ============================================================
   NÚCLEO — no toca la pantalla
   ============================================================ */
const DT = 1/60, GRAV = 24;
const lerp = (a,b,t)=>a+(b-a)*t;
const clamp = (v,a,b)=>v<a?a:v>b?b:v;
const smooth = (a,b,x)=>{ const t = clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); };
const envolver = a=>{ while (a>Math.PI) a-=2*Math.PI; while (a<-Math.PI) a+=2*Math.PI; return a; };
let semilla = 20260904;
function azar(){ semilla = (Math.imul(semilla, 1103515245) + 12345) & 0x7fffffff; return semilla/0x7fffffff; }
/* ruido suave y determinista (el mismo en cada aparato) para las colinas */
function hash(i, j){
  let n = (Math.imul(i, 374761393) + Math.imul(j, 668265263)) | 0;
  n = Math.imul(n ^ (n>>>13), 1274126177); n ^= n>>>16;
  return (n>>>0)/4294967296;
}
function ruido(x, z){
  const i = Math.floor(x), j = Math.floor(z), u = x-i, v = z-j;
  const su = u*u*(3-2*u), sv = v*v*(3-2*v);
  return lerp(lerp(hash(i,j), hash(i+1,j), su), lerp(hash(i,j+1), hash(i+1,j+1), su), sv);
}
function fbm(x, z, oct){
  let a = 0, s = 0, f = 1, amp = 1;
  for (let o=0;o<oct;o++){ a += amp*ruido(x*f, z*f); s += amp; f *= 2.07; amp *= 0.5; }
  return a/s;
}

/* ---------------- La isla ----------------
   El mundo mide 1200 m de lado; la isla grande está en el centro, la islita
   de Santi al este, y todo lo demás es mar (hondo hacia afuera). */
const TAM = 1200, NSEG = 240, SEG = TAM/NSEG, MITAD = TAM/2, LIMITE = 560;
const R_ISLA = 300;
const ISLITA = {x:430, z:170};
const MONTANA = {x:-60, z:-200};
const PUEBLO = {x:20, z:70};
const FARO = {x:-270, z:-60};
const NIVEL_MAR = 0;
function alturaBase(x, z){
  const d0 = Math.hypot(x, z), a = Math.atan2(z, x);
  const d = d0 + 22*(fbm(Math.cos(a)*1.6+5.3, Math.sin(a)*1.6+2.7, 2)-0.5)*2;
  const m = 1 - smooth(R_ISLA-30, R_ISLA+50, d);
  const colinas = Math.max(-1.5, (fbm(x/95+3.1, z/95+9.7, 4)-0.45)*52);
  const dm = (x-MONTANA.x)*(x-MONTANA.x)+(z-MONTANA.z)*(z-MONTANA.z);
  const montana = 62*Math.exp(-dm/(95*95));
  let tierra = 2.5 + colinas*m*m + montana;
  const dp = (x-PUEBLO.x)*(x-PUEBLO.x)+(z-PUEBLO.z)*(z-PUEBLO.z);
  const gt = Math.min(1, 1.4*Math.exp(-dp/(130*130)));
  tierra = lerp(tierra, 4, gt);
  const df = (x-FARO.x)*(x-FARO.x)+(z-FARO.z)*(z-FARO.z);
  tierra += 9*Math.exp(-df/(22*22));                                  /* el peñón del faro */
  const mar = -10 - 24*smooth(R_ISLA+60, R_ISLA+220, d0) + 3*(ruido(x/40+1, z/40+1)-0.5);
  let h = lerp(mar, tierra, m);
  const d2 = Math.hypot(x-ISLITA.x, z-ISLITA.z);
  const m2 = 1 - smooth(14, 60, d2);
  h = lerp(h, -8 + 11*m2, m2);
  return h;
}

/* ---------------- La carretera ----------------
   Un lazo que da la vuelta a la isla, sube por la falda de la montaña y
   pasa junto al pueblo, la playa, el puerto y el aeropuerto. */
const RUTA_PTS = [[-40,182],[80,192],[160,160],[236,80],[240,-20],[190,-120],[60,-165],[-50,-125],[-165,-75],[-215,30],[-165,135]];
function catmull(p0,p1,p2,p3,t){ const t2=t*t, t3=t2*t; return 0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3); }
function muestrearLazo(pts, paso){
  const n = pts.length, densos = [];
  for (let i=0;i<n;i++){
    const p0=pts[(i-1+n)%n], p1=pts[i], p2=pts[(i+1)%n], p3=pts[(i+2)%n];
    const k = Math.max(4, Math.round(Math.hypot(p2[0]-p1[0], p2[1]-p1[1])*2));
    for (let j=0;j<k;j++){ const t=j/k; densos.push([catmull(p0[0],p1[0],p2[0],p3[0],t), catmull(p0[1],p1[1],p2[1],p3[1],t)]); }
  }
  /* se vuelve a muestrear cada 'paso' metros exactos */
  const M = []; let acum = 0, prox = 0;
  for (let i=0;i<densos.length;i++){
    const a = densos[i], b = densos[(i+1)%densos.length];
    const l = Math.hypot(b[0]-a[0], b[1]-a[1]);
    while (prox <= acum + l){
      const t = l>0 ? (prox-acum)/l : 0;
      M.push({x: lerp(a[0],b[0],t), z: lerp(a[1],b[1],t), s: prox});
      prox += paso;
    }
    acum += l;
  }
  const N = M.length;
  for (let i=0;i<N;i++){
    const a = M[(i-1+N)%N], b = M[(i+1)%N];
    let tx = b.x-a.x, tz = b.z-a.z; const l = Math.hypot(tx,tz)||1; tx/=l; tz/=l;
    M[i].tx = tx; M[i].tz = tz; M[i].nx = tz; M[i].nz = -tx;
  }
  return {M, N, L: acum, paso};
}
const RUTA = muestrearLazo(RUTA_PTS, 2);
RUTA.ancho = 10;
/* la altura de la carretera: la del terreno, pero muy suavizada, para que
   suba y baje sin baches */
{
  let h = RUTA.M.map(m=>alturaBase(m.x, m.z));
  for (let pasada=0; pasada<3; pasada++){
    const s = new Array(RUTA.N).fill(0);
    for (let i=0;i<RUTA.N;i++){ let acc=0; for (let k=-22;k<=22;k++) acc += h[(i+k+RUTA.N)%RUTA.N]; s[i] = acc/45; }
    h = s;
  }
  for (let i=0;i<RUTA.N;i++) RUTA.M[i].h = Math.max(h[i], 1.2);
}
function cercaRuta(x, z){
  /* primero a saltos grandes, luego se afina alrededor del mejor */
  let mejor = 0, md = Infinity;
  for (let i=0;i<RUTA.N;i+=4){ const m = RUTA.M[i], d = (m.x-x)*(m.x-x)+(m.z-z)*(m.z-z); if (d<md){ md=d; mejor=i; } }
  for (let k=-4;k<=4;k++){ const i=(mejor+k+RUTA.N)%RUTA.N, m=RUTA.M[i], d=(m.x-x)*(m.x-x)+(m.z-z)*(m.z-z); if (d<md){ md=d; mejor=i; } }
  const m = RUTA.M[mejor];
  return {i: mejor, d: Math.sqrt(md), lat: (x-m.x)*m.nx + (z-m.z)*m.nz, s: m.s};
}
function puntoRuta(s){ let i = Math.round(s/RUTA.paso) % RUTA.N; if (i<0) i += RUTA.N; return RUTA.M[i]; }

/* ---------------- La pista de aterrizaje ---------------- */
const PISTA = {x:205, z0:-70, z1:100, ancho:18, h: 0};
PISTA.h = Math.max(2.5, alturaBase(PISTA.x, (PISTA.z0+PISTA.z1)/2));
function distPista(x, z){
  const dz = z < PISTA.z0 ? PISTA.z0-z : z > PISTA.z1 ? z-PISTA.z1 : 0;
  return Math.hypot(x-PISTA.x, dz);
}

/* ---------------- Los solares planos ----------------
   Alrededor de cada casa, baño o taller el suelo se aplana para que nada
   quede colgando. Se llenan más abajo, cuando ya están todos los lugares. */
const SOLARES = [];
function solar(x, z, r, h){ SOLARES.push({x, z, r, h: h===undefined ? alturaBase(x,z) : h}); }

/* ---------------- La orilla ----------------
   Busca, en la dirección de un punto, dónde el terreno cruza el nivel del
   mar: así el muelle, la playa y las palmeras caen siempre en la orilla. */
function orilla(x, z){
  const a = Math.atan2(z, x);
  let d = 200;
  while (d < 420 && alturaBase(Math.cos(a)*d, Math.sin(a)*d) > 0.3) d += 1;
  return {x: Math.cos(a)*d, z: Math.sin(a)*d, ang: a, d};
}

/* ---------------- Los lugares de la isla ----------------
   Direcciones: ang=0 mira al sur (+z), π/2 al este (+x), π al norte (−z). */
const orillaPuerto = orilla(-150, 250);
const MUELLE = {x: orillaPuerto.x, z: orillaPuerto.z, ang: orillaPuerto.ang, largo: 40, ancho: 4, alto: 1.0};
MUELLE.x0 = MUELLE.x - Math.cos(MUELLE.ang)*6; MUELLE.z0 = MUELLE.z - Math.sin(MUELLE.ang)*6;
MUELLE.x1 = MUELLE.x + Math.cos(MUELLE.ang)*(MUELLE.largo-6); MUELLE.z1 = MUELLE.z + Math.sin(MUELLE.ang)*(MUELLE.largo-6);
function enMuelle(x, z){
  const dx = MUELLE.x1-MUELLE.x0, dz = MUELLE.z1-MUELLE.z0, l2 = dx*dx+dz*dz;
  const t = clamp(((x-MUELLE.x0)*dx + (z-MUELLE.z0)*dz)/l2, 0, 1);
  const px = MUELLE.x0 + dx*t, pz = MUELLE.z0 + dz*t;
  return Math.hypot(x-px, z-pz) <= MUELLE.ancho/2;
}
const orillaPlaya = orilla(30, 262);
const PLAYA = {x: orillaPlaya.x - Math.cos(orillaPlaya.ang)*14, z: orillaPlaya.z - Math.sin(orillaPlaya.ang)*14, ang: orillaPlaya.ang};

/* la rampa de la moto, sobre la recta del sur de la carretera */
const RAMPA = (()=>{
  const c = cercaRuta(20, 186), m = RUTA.M[c.i];
  return {x: m.x, z: m.z, tx: m.tx, tz: m.tz, nx: m.nx, nz: m.nz, largo: 18, ancho: 8, alto: 5.5, base: m.h,
          ang: Math.atan2(m.tx, m.tz)};
})();
function enRampa(x, z){
  const dx = x-RAMPA.x, dz = z-RAMPA.z;
  const t = dx*RAMPA.tx + dz*RAMPA.tz, u = dx*RAMPA.nx + dz*RAMPA.nz;
  if (t < 0 || t > RAMPA.largo || Math.abs(u) > RAMPA.ancho/2) return -1;
  return t;
}
RAMPA.aro = {x: RAMPA.x + RAMPA.tx*(RAMPA.largo+9), z: RAMPA.z + RAMPA.tz*(RAMPA.largo+9), y: RAMPA.base + RAMPA.alto + 2.2, r: 4.5};

/* los baños del Señor Popo (ang = hacia dónde mira la puerta) */
const banoMontana = (()=>{ const c = cercaRuta(-60,-120), m = RUTA.M[c.i]; return {x: m.x + m.nx*10, z: m.z + m.nz*10, ang: Math.atan2(-m.nx, -m.nz)}; })();
const BANOS = [
  {id:0, nombre:'el baño del pueblo',     x:66,  z:44,  ang:-Math.PI/2},
  {id:1, nombre:'el baño de la playa',    x:PLAYA.x+12, z:PLAYA.z-6, ang: PLAYA.ang+Math.PI/2},
  {id:2, nombre:'el baño de la montaña',  x:banoMontana.x, z:banoMontana.z, ang: banoMontana.ang},
  {id:3, nombre:'el baño del aeropuerto', x:230, z:62,  ang:-Math.PI/2},
];
for (const b of BANOS){ b.px = b.x + Math.sin(b.ang)*1.9; b.pz = b.z + Math.cos(b.ang)*1.9; }

/* las casas del pueblo (cajas alineadas con los ejes; también son obstáculos) */
const CASAS = [
  {x:44,  z:14,  w:10, d:8, h:4.4, color:'#f6c453', techo:'#c0392b', nombre:'CASA DE FERNANDO', puerta:0},
  {x:-22, z:30,  w:9,  d:7, h:4.0, color:'#9bd1ff', techo:'#2a6ad0', nombre:'CASA DE ABU', puerta:0},
  {x:112, z:120, w:12, d:9, h:4.2, color:'#c39bd3', techo:'#5b2c6f', nombre:'BAR DE RÓMULO', letrero:'BAR', puerta:Math.PI},
  {x:100, z:164, w:9,  d:6, h:3.6, color:'#ffffff', techo:'#e63946', nombre:'GASOLINERA', gasolinera:true, puerta:0},
  {x:-44, z:82,  w:11, d:8, h:4.4, color:'#ffb347', techo:'#8b4513', nombre:'HAMBURGUESERÍA', letrero:'BURGER', puerta:Math.PI/2},
  {x:-10, z:8,   w:8,  d:7, h:3.8, color:'#a8e6a1', techo:'#2e7d32', nombre:'casa verde', puerta:0},
  {x:80,  z:10,  w:8,  d:7, h:3.8, color:'#ffd1dc', techo:'#ad1457', nombre:'casa rosada', puerta:0},
  {x:110, z:40,  w:9,  d:7, h:4.0, color:'#fff59d', techo:'#f57f17', nombre:'casa amarilla', puerta:-Math.PI/2},
  {x:-60, z:40,  w:8,  d:8, h:3.8, color:'#80deea', techo:'#006064', nombre:'casa celeste', puerta:Math.PI/2},
  {x:-70, z:120, w:9,  d:7, h:3.8, color:'#ffab91', techo:'#bf360c', nombre:'casa naranja', puerta:Math.PI/2},
  {x:70,  z:150, w:8,  d:7, h:3.8, color:'#b39ddb', techo:'#4527a0', nombre:'casa lila', puerta:Math.PI},
  {x:-10, z:160, w:9,  d:7, h:3.8, color:'#c5e1a5', techo:'#33691e', nombre:'casa verdecita', puerta:Math.PI},
];
const HANGAR = {x:228, z:-20, w:16, d:14, h:7};
const CANCHA = {x:0, z:128, w:36, d:22};
const PARQUE = {x:90, z:66};
const FUENTE = {x:10, z:70, r:3.2};
const COFRE = {x:-120, z:-470};
const AROS = [
  {x:205, z:-170, y:42}, {x:120, z:-290, y:62}, {x:-30, z:-330, y:84}, {x:-190, z:-260, y:96},
  {x:-280, z:-80, y:82}, {x:-190, z:140, y:66}, {x:-10, z:290, y:50},
];
for (const a of AROS) a.r = 6;
const BANDERAS = [];
for (let i=0;i<6;i++){ const m = puntoRuta((i+0.5)*RUTA.L/6); BANDERAS.push({id:i, x:m.x, z:m.z, tx:m.tx, tz:m.tz, nx:m.nx, nz:m.nz, s:m.s}); }
const VEHICULOS_DEF = [
  {id:'carro', nombre:'el carro',      emoji:'🚗', x:100, z:177, ang:1.95, radio:2.2},
  {id:'moto',  nombre:'la moto',       emoji:'🏍️', x:RAMPA.x - RAMPA.tx*70, z:RAMPA.z - RAMPA.tz*70, ang:RAMPA.ang, radio:1.2},
  {id:'avion', nombre:'el avión',      emoji:'✈️', x:PISTA.x, z:70, ang:Math.PI, radio:3},
  {id:'barco', nombre:'el barco',      emoji:'🚤', x:MUELLE.x0 + Math.cos(MUELLE.ang)*26 + Math.sin(MUELLE.ang)*5.5, z:MUELLE.z0 + Math.sin(MUELLE.ang)*26 - Math.cos(MUELLE.ang)*5.5, ang:Math.atan2(Math.cos(MUELLE.ang), Math.sin(MUELLE.ang)), radio:2.6},
  {id:'sub',   nombre:'el submarino',  emoji:'🤿', x:MUELLE.x0 + Math.cos(MUELLE.ang)*26 - Math.sin(MUELLE.ang)*5.5, z:MUELLE.z0 + Math.sin(MUELLE.ang)*26 + Math.cos(MUELLE.ang)*5.5, ang:Math.atan2(Math.cos(MUELLE.ang), Math.sin(MUELLE.ang)), radio:2.4},
];
/* la familia: dónde está cada quien y qué dice Fernando al saludarlo */
const FAMILIA = [
  {id:'abu',      nombre:'Abu',          x:-22, z:38,  ang:0,           frase:'Te amo Abu'},
  {id:'cucu',     nombre:'Cucú',         x:PARQUE.x+6, z:PARQUE.z+4, ang:-Math.PI/2, frase:'Hola Cucú, acompáñame'},
  {id:'luca',     nombre:'Luca',         x:-8,  z:128, ang:Math.PI/2,   frase:'¡Luca! ¡Mi amigo pichunguito!'},
  {id:'salomon',  nombre:'Salomón',      x:8,   z:128, ang:-Math.PI/2,  frase:'¡Salomón! ¡Juega conmigo, pichunguito!'},
  {id:'tiofran',  nombre:'Tío Fran',     x:PLAYA.x, z:PLAYA.z, ang:PLAYA.ang+Math.PI, frase:'¡Qué pedo tan grande, tío Fran!', pedo:true},
  {id:'mama',     nombre:'Mamá',         x:38,  z:22,  ang:0,           frase:'¡Te amo mamá!'},
  {id:'papa',     nombre:'Papá',         x:50,  z:22,  ang:0,           frase:'¡Papá, mira cómo salto de alto!'},
  {id:'nacho',    nombre:'Tío Nacho',    x:216, z:-10, ang:-Math.PI/2,  frase:'¡Épale! ¡Aquí viene tío Nacho!'},
  {id:'yanny',    nombre:'Tía Yanny',    x:MUELLE.x0 - Math.cos(MUELLE.ang)*4 + Math.sin(MUELLE.ang)*3, z:MUELLE.z0 - Math.sin(MUELLE.ang)*4 - Math.cos(MUELLE.ang)*3, ang:MUELLE.ang, frase:'¡Hola mi amor! ¡Soy tía Yanny!'},
  {id:'romulo',   nombre:'Rómulo',       x:112, z:112, ang:Math.PI,     frase:'¡Brrrp! ¡Qué rica cerveza! ¡Ay, qué pena!', eructo:true},
  {id:'beto',     nombre:'Tío Beto',     x:92,  z:171, ang:0,           frase:'¡Hola pichunguito! ¡Soy tío Beto!'},
  {id:'giuliana', nombre:'Tía Giuliana', x:FARO.x+6, z:FARO.z+4, ang:Math.PI/2, frase:'¡Un abrazo, pichunguito! ¡Soy tía Giuliana!'},
  {id:'santi',    nombre:'Santi',        x:ISLITA.x, z:ISLITA.z, ang:-Math.PI/2, frase:'Te amo Santi, mi hermanito', bebe:true},
];
const porId = id => FAMILIA.find(c=>c.id===id);
const PERROS_DEF = [
  {id:'penny',   nombre:'Penny',   color:'#222222', x:36, z:30},
  {id:'sheldon', nombre:'Sheldon', color:'#8a5a2a', x:52, z:30},
];
const INICIO = {x:44, z:28, ang:0};

/* los solares planos: casas, hangar, faro, baños, muelle, cancha y parque */
for (const c of CASAS) solar(c.x, c.z, Math.max(c.w,c.d)/2+3);
solar(HANGAR.x, HANGAR.z, 12, PISTA.h); solar(FARO.x, FARO.z, 9); solar(CANCHA.x, CANCHA.z, 24); solar(PARQUE.x, PARQUE.z, 12);
solar(FUENTE.x, FUENTE.z, 8);
for (const b of BANOS) solar(b.x, b.z, 5);
solar(MUELLE.x0 - Math.cos(MUELLE.ang)*4, MUELLE.z0 - Math.sin(MUELLE.ang)*4, 9, Math.max(0.9, alturaBase(MUELLE.x0 - Math.cos(MUELLE.ang)*4, MUELLE.z0 - Math.sin(MUELLE.ang)*4)));
solar(RAMPA.x + RAMPA.tx*9, RAMPA.z + RAMPA.tz*9, 12, RAMPA.base);

/* ---------------- La malla del terreno ----------------
   Se calcula UNA vez con todo (colinas, carretera aplanada, solares) y de
   ahí sale tanto lo que se ve como lo que se pisa: así lo que se dibuja y
   lo que se maneja es exactamente lo mismo. */
function alturaTerreno(x, z){
  let h = alturaBase(x, z);
  const c = cercaRuta(x, z);
  if (c.d < 9) h = lerp(h, RUTA.M[c.i].h, 1 - smooth(4.5, 9, c.d));
  const dp = distPista(x, z);
  if (dp < 18) h = lerp(h, PISTA.h, 1 - smooth(10, 18, dp));
  for (const s of SOLARES){
    const d = Math.hypot(x-s.x, z-s.z);
    if (d < s.r+8) h = lerp(h, s.h, 1 - smooth(s.r, s.r+8, d));
  }
  return h;
}
const MALLA = new Float32Array((NSEG+1)*(NSEG+1));
(function construirTerreno(){
  for (let iy=0; iy<=NSEG; iy++) for (let ix=0; ix<=NSEG; ix++)
    MALLA[iy*(NSEG+1)+ix] = alturaTerreno(ix*SEG-MITAD, iy*SEG-MITAD);
})();
function alturaMalla(x, z){
  const fx = clamp((x+MITAD)/SEG, 0, NSEG-1e-6), fz = clamp((z+MITAD)/SEG, 0, NSEG-1e-6);
  const ix = Math.floor(fx), iz = Math.floor(fz), u = fx-ix, v = fz-iz;
  const a = MALLA[iz*(NSEG+1)+ix], b = MALLA[(iz+1)*(NSEG+1)+ix], c = MALLA[(iz+1)*(NSEG+1)+ix+1], d = MALLA[iz*(NSEG+1)+ix+1];
  /* los mismos dos triángulos por celda que dibuja la vista */
  if (u+v <= 1) return a + (d-a)*u + (b-a)*v;
  return c + (b-c)*(1-u) + (d-c)*(1-v);
}
/* la altura que se pisa: la malla más la rampa y el muelle */
function altura(x, z){
  const t = enRampa(x, z);
  if (t >= 0) return RAMPA.base + RAMPA.alto*(t/RAMPA.largo);
  if (enMuelle(x, z)) return MUELLE.alto;
  return alturaMalla(x, z);
}
function ola(x, z, t){
  return 0.22*Math.sin(x*0.23 + t*1.3) + 0.16*Math.sin(z*0.29 - t*1.1) + 0.1*Math.sin((x+z)*0.11 + t*0.7);
}
const enAgua = (x, z)=> altura(x, z) < NIVEL_MAR - 1.1;

/* ---------------- Los adornos con cuerpo (chocan): árboles, palmeras y rocas ---------------- */
const DECOR = {arboles:[], palmeras:[], pinos:[], rocas:[]};
const OBST = new Map();     /* cuadrícula de 24 m → obstáculos (círculos y cajas) */
const CELDA = 24;
function claveCelda(x, z){ return Math.floor((x+MITAD)/CELDA)+','+Math.floor((z+MITAD)/CELDA); }
function agregarObst(o){
  const r = o.r || Math.max(o.hx, o.hz);
  for (let cx=Math.floor((o.x-r+MITAD)/CELDA); cx<=Math.floor((o.x+r+MITAD)/CELDA); cx++)
    for (let cz=Math.floor((o.z-r+MITAD)/CELDA); cz<=Math.floor((o.z+r+MITAD)/CELDA); cz++){
      const k = cx+','+cz; if (!OBST.has(k)) OBST.set(k, []); OBST.get(k).push(o);
    }
}
function obstaculosCerca(x, z){ return OBST.get(claveCelda(x, z)) || []; }
function lejosDeTodo(x, z, minimo){
  if (cercaRuta(x, z).d < 9) return false;
  if (distPista(x, z) < 20) return false;
  if (Math.hypot(x-HANGAR.x, z-HANGAR.z) < 16) return false;
  for (const s of SOLARES) if (Math.hypot(x-s.x, z-s.z) < s.r+3) return false;
  for (const v of VEHICULOS_DEF) if (Math.hypot(x-v.x, z-v.z) < 24) return false;
  for (const f of FAMILIA) if (Math.hypot(x-f.x, z-f.z) < 5) return false;
  for (const b of BANOS) if (Math.hypot(x-b.x, z-b.z) < 7) return false;
  if (Math.hypot(x-CANCHA.x, z-CANCHA.z) < 26 || Math.hypot(x-PARQUE.x, z-PARQUE.z) < 14) return false;
  if (Math.hypot(x-INICIO.x, z-INICIO.z) < 10) return false;
  if (enMuelle(x, z) || enRampa(x, z) >= 0) return false;
  if (Math.hypot(x-RAMPA.aro.x, z-RAMPA.aro.z) < 14) return false;
  for (const a of DECOR.arboles) if (Math.hypot(x-a.x, z-a.z) < minimo) return false;
  for (const a of DECOR.palmeras) if (Math.hypot(x-a.x, z-a.z) < minimo) return false;
  for (const a of DECOR.pinos) if (Math.hypot(x-a.x, z-a.z) < minimo) return false;
  return true;
}
(function plantar(){
  semilla = 777;
  for (let i=0;i<9000;i++){
    const x = (azar()-0.5)*TAM, z = (azar()-0.5)*TAM, h = altura(x, z);
    if (h < 1.0) continue;
    const dp = Math.hypot(x-PUEBLO.x, z-PUEBLO.z);
    if (dp < 150 && azar() < 0.75) continue;                     /* el pueblo tiene pocos árboles */
    if (!lejosDeTodo(x, z, 5.5)) continue;
    const esc = 0.8 + azar()*0.6;
    if (h > 30) DECOR.pinos.push({x, z, h, esc, rot: azar()*6.28});
    else if (h < 3.4 && Math.hypot(x,z) > 230) DECOR.palmeras.push({x, z, h, esc, rot: azar()*6.28, inclina: (azar()-0.5)*0.5});
    else if (Math.hypot(x-ISLITA.x, z-ISLITA.z) < 40) DECOR.palmeras.push({x, z, h, esc, rot: azar()*6.28, inclina: (azar()-0.5)*0.5});
    else DECOR.arboles.push({x, z, h, esc, rot: azar()*6.28, tono: azar()});
  }
  for (let i=0;i<420;i++){
    const x = (azar()-0.5)*TAM, z = (azar()-0.5)*TAM, h = altura(x, z);
    if (h > -2 && h < 1.5) continue;
    if (h > 1.5 && !lejosDeTodo(x, z, 3)) continue;
    if (h > 1.5 && Math.hypot(x-PUEBLO.x, z-PUEBLO.z) < 140) continue;
    DECOR.rocas.push({x, z, h, esc: 0.6 + azar()*1.6, rot: azar()*6.28, agua: h < -2});
  }
  for (const a of DECOR.arboles) agregarObst({x:a.x, z:a.z, r:0.9*a.esc});
  for (const a of DECOR.palmeras) agregarObst({x:a.x, z:a.z, r:0.7*a.esc});
  for (const a of DECOR.pinos) agregarObst({x:a.x, z:a.z, r:0.9*a.esc});
  for (const r of DECOR.rocas) if (!r.agua && r.esc > 1.0) agregarObst({x:r.x, z:r.z, r:1.1*r.esc});
  for (const c of CASAS) agregarObst({x:c.x, z:c.z, hx:c.w/2, hz:c.d/2});
  agregarObst({x:HANGAR.x, z:HANGAR.z, hx:HANGAR.w/2, hz:HANGAR.d/2});
  agregarObst({x:FARO.x, z:FARO.z, r:3.2});
  agregarObst({x:FUENTE.x, z:FUENTE.z, r:FUENTE.r});
  for (const b of BANOS) agregarObst({x:b.x, z:b.z, r:1.6});
  for (const f of FAMILIA) agregarObst({x:f.x, z:f.z, r:0.7});
})();

/* ---------------- Las hamburguesas ---------------- */
const HAMBURGUESAS = [];
(function ponerHamburguesas(){
  semilla = 4242;
  let id = 0;
  const poner = (x, z, y)=>{ HAMBURGUESAS.push({id:id++, x, z, y: y===undefined ? altura(x,z)+1.1 : y}); };
  /* en el pueblo, cerca de la casa */
  for (const [x,z] of [[36,44],[54,44],[20,60],[0,84],[-30,60],[60,80],[90,90],[-40,110],[30,150],[-20,100],[70,40],[100,20]]) poner(x, z);
  /* por la carretera, a un ladito */
  for (let i=0;i<14;i++){ const m = puntoRuta(i*RUTA.L/14 + 30); poner(m.x + m.nx*3.2, m.z + m.nz*3.2); }
  /* en la playa, el muelle, el aeropuerto y la montaña */
  poner(PLAYA.x-8, PLAYA.z+3); poner(PLAYA.x+18, PLAYA.z-2); poner(PLAYA.x-20, PLAYA.z-6);
  poner(MUELLE.x0 + Math.cos(MUELLE.ang)*14, MUELLE.z0 + Math.sin(MUELLE.ang)*14);
  poner(PISTA.x, PISTA.z1-20); poner(PISTA.x, PISTA.z0+20); poner(HANGAR.x, HANGAR.z+14);
  poner(MONTANA.x, MONTANA.z); poner(MONTANA.x+30, MONTANA.z+40); poner(FARO.x-8, FARO.z+8);
  /* en la islita, por el cielo (dentro de los aros) y por el fondo del mar */
  poner(ISLITA.x-8, ISLITA.z+6); poner(ISLITA.x+7, ISLITA.z-5);
  for (const a of AROS) poner(a.x, a.z, a.y);
  poner(COFRE.x+10, COFRE.z, altura(COFRE.x+10, COFRE.z)+2.5); poner(COFRE.x-10, COFRE.z+8, altura(COFRE.x-10, COFRE.z+8)+2.5);
  poner(-40, 420, altura(-40,420)+2.5); poner(-300, 300, altura(-300,300)+2.5);
})();

/* ---------------- Las misiones (cada una da una estrella) ---------------- */
const MISIONES = [
  {id:'popo',    emoji:'🍔', titulo:'Come hamburguesas y haz popo en un baño'},
  {id:'banos',   emoji:'🚽', titulo:'Haz popo en los 4 baños del Señor Popo'},
  {id:'carro',   emoji:'🚗', titulo:'Cruza las 6 banderas con el carro'},
  {id:'moto',    emoji:'🏍️', titulo:'Salta la rampa con la moto'},
  {id:'avion',   emoji:'✈️', titulo:'Vuela por los 7 aros del cielo'},
  {id:'barco',   emoji:'🚤', titulo:'Ve en barco a la islita de Santi'},
  {id:'sub',     emoji:'🤿', titulo:'Busca el tesoro con el submarino'},
  {id:'familia', emoji:'👨‍👩‍👧', titulo:'Saluda a toda la familia'},
];
const SALUDABLES = FAMILIA.filter(f=>!f.bebe).map(f=>f.id);

/* ---------------- La partida ---------------- */
function crearPartida(guardado){
  const P = {
    t: 0, eventos: [], puntos: 0, camYaw: Math.PI,
    J: {x: INICIO.x, z: INICIO.z, y: 0, ang: INICIO.ang, vx: 0, vz: 0, vy: 0, suelo: true, nadando: false, radio: 0.5, mov: 0, fase: 0},
    veh: null, vehiculos: VEHICULOS_DEF.map(v=>Object.assign({}, v, {y:0, vel:0, vy:0, suelo:true, aire:false, cabeceo:0, giro:0, turbo:0, pos:null})),
    perros: PERROS_DEF.map(p=>Object.assign({}, p, {y:0, sigue:false, ang:0, mov:0, fase:0, radio:0.4})),
    popitos: [],
    popo: 0, ganas: false, pedoT: 0, ultimoPopoDicho: -9999, ultimaHamb: -9999,
    hamburguesas: 0, comidas: new Set(), estrellas: [], prog: {banos:[], banderas:[], aros:[], familia:[], rampa:false, santi:false, cofre:false, popo:false},
    saludos: {}, escena: null, srPopo: {bano: 0, visible: true, saludo: -9999}, cercaVeh: null, final: false, finalT: 0,
    aPrev: false, bPrev: false, salirPrev: false, avisoBano: -9999, ultimoChoque: -9999,
  };
  P.J.y = altura(P.J.x, P.J.z);
  for (const v of P.vehiculos) v.y = v.id==='barco' || v.id==='sub' ? NIVEL_MAR : altura(v.x, v.z);
  for (const p of P.perros) p.y = altura(p.x, p.z);
  if (guardado) importar(P, guardado);
  return P;
}
function exportar(P){
  return {estrellas: P.estrellas.slice(), puntos: P.puntos, hamburguesas: P.hamburguesas, comidas: [...P.comidas], popitos: P.popitos.length,
          prog: {banos:P.prog.banos.slice(), banderas:P.prog.banderas.slice(), aros:P.prog.aros.slice(), familia:P.prog.familia.slice(),
                 rampa:P.prog.rampa, santi:P.prog.santi, cofre:P.prog.cofre, popo:P.prog.popo}};
}
function importar(P, g){
  try{
    if (Array.isArray(g.estrellas)) P.estrellas = g.estrellas.filter(id=>MISIONES.some(m=>m.id===id));
    if (Number.isFinite(g.puntos)) P.puntos = g.puntos;
    if (Number.isFinite(g.hamburguesas)) P.hamburguesas = g.hamburguesas;
    if (Array.isArray(g.comidas)) P.comidas = new Set(g.comidas);
    if (g.prog){ for (const k of ['banos','banderas','aros','familia']) if (Array.isArray(g.prog[k])) P.prog[k] = g.prog[k].slice();
      for (const k of ['rampa','santi','cofre','popo']) if (typeof g.prog[k]==='boolean') P.prog[k] = g.prog[k]; }
    for (const id of P.prog.familia) P.saludos[id] = true;
    for (const p of P.perros) p.sigue = false;
    if (Number.isFinite(g.popitos)) for (let i=0;i<Math.min(g.popitos, MAX_POPITOS);i++) nacerPopito(P, P.J.x - 2 - i, P.J.z + 1);
  }catch(e){}
}
const evento = (P, tipo, datos)=>{ P.eventos.push(Object.assign({tipo}, datos||{})); };
const tieneEstrella = (P, id)=> P.estrellas.includes(id);
function darEstrella(P, id){
  if (tieneEstrella(P, id)) return;
  P.estrellas.push(id);
  P.puntos += 2000;
  evento(P, 'estrella', {id, total: P.estrellas.length});
  if (P.estrellas.length === MISIONES.length && !P.final){ P.final = true; P.finalT = P.t; evento(P, 'final'); }
}

/* ---- moverse chocando con los árboles, las casas y el borde del mundo ---- */
function moverChocando(e, nx, nz){
  let choco = false;
  if (nx < -LIMITE || nx > LIMITE || nz < -LIMITE || nz > LIMITE){ nx = clamp(nx, -LIMITE, LIMITE); nz = clamp(nz, -LIMITE, LIMITE); choco = true; }
  const lista = obstaculosCerca(nx, nz);
  for (const o of lista){
    if (o.r){
      const dx = nx-o.x, dz = nz-o.z, d = Math.hypot(dx,dz), rr = o.r + e.radio;
      if (d < rr){ if (d > 1e-6){ nx = o.x + dx/d*rr; nz = o.z + dz/d*rr; } else { nx += rr; } choco = true; }
    } else {
      const cx = clamp(nx, o.x-o.hx, o.x+o.hx), cz = clamp(nz, o.z-o.hz, o.z+o.hz);
      const dx = nx-cx, dz = nz-cz, d = Math.hypot(dx,dz);
      if (d < e.radio){
        if (d > 1e-6){ nx = cx + dx/d*e.radio; nz = cz + dz/d*e.radio; }
        else { /* justo dentro: se sale por el lado más cercano */
          const sx = o.x+o.hx+e.radio-nx, sx2 = nx-(o.x-o.hx-e.radio), sz = o.z+o.hz+e.radio-nz, sz2 = nz-(o.z-o.hz-e.radio);
          const m = Math.min(sx,sx2,sz,sz2);
          if (m===sx) nx = o.x+o.hx+e.radio; else if (m===sx2) nx = o.x-o.hx-e.radio; else if (m===sz) nz = o.z+o.hz+e.radio; else nz = o.z-o.hz-e.radio;
        }
        choco = true;
      }
    }
  }
  return {x:nx, z:nz, choco};
}
/* el escalón máximo que se sube de golpe (más alto es pared: el fondo de la rampa, el muelle desde el mar) */
const ESCALON = 1.3;

/* ---- a pie ---- */
function pasoPie(P, ent){
  const J = P.J;
  let dx = 0, dz = 0, mag = Math.hypot(ent.jx, ent.jy);
  if (mag > 0.08){
    mag = Math.min(1, mag);
    const fx = Math.sin(P.camYaw), fz = Math.cos(P.camYaw);          /* hacia dónde mira la cámara */
    const rx = -fz, rz = fx;                                           /* la derecha de la cámara */
    dx = (fx*ent.jy + rx*ent.jx)/mag; dz = (fz*ent.jy + rz*ent.jx)/mag;
    J.ang = envolver(J.ang + envolver(Math.atan2(dx, dz) - J.ang)*0.25);
  }
  let velMax = J.nadando ? 3.2 : (ent.b ? 9.5 : 6.2);
  if (P.ganas && !J.nadando) velMax *= 0.72;                          /* con ganas de popo se camina apretado */
  const objx = dx*velMax*mag, objz = dz*velMax*mag;
  const k = J.suelo || J.nadando ? 0.18 : 0.04;
  J.vx += (objx - J.vx)*k; J.vz += (objz - J.vz)*k;
  J.mov = Math.hypot(J.vx, J.vz);
  const nx = J.x + J.vx*DT, nz = J.z + J.vz*DT;
  const m = moverChocando(J, nx, nz);
  const gNueva = altura(m.x, m.z);
  if (!J.nadando && gNueva - J.y > ESCALON && J.suelo){ J.vx *= 0.2; J.vz *= 0.2; }   /* pared */
  else { J.x = m.x; J.z = m.z; if (m.choco){ J.vx *= 0.5; J.vz *= 0.5; } }
  const g = altura(J.x, J.z);
  if (g < NIVEL_MAR - 1.1 && J.y <= NIVEL_MAR + 0.3){
    if (!J.nadando){ J.nadando = true; J.suelo = false; J.vy = 0; evento(P, 'chapoteo', {x:J.x, z:J.z}); }
    J.y = NIVEL_MAR - 0.35 + ola(J.x, J.z, P.t*DT)*0.5;
  } else if (J.nadando){
    J.nadando = false; J.suelo = true; J.y = Math.max(J.y, g);
  }
  if (!J.nadando){
    if (J.suelo && ent.aNuevo){ J.vy = 9.8; J.suelo = false; evento(P, 'salto'); }
    if (J.suelo){
      if (g >= J.y - 0.8){ J.vy = 0; J.y = g; }
      else { J.suelo = false; J.vy = 0; }
    }
    if (!J.suelo){
      J.vy -= GRAV*DT; J.y += J.vy*DT;
      if (J.y <= g){ J.y = g; J.suelo = true; if (J.vy < -8) evento(P, 'aterriza'); J.vy = 0; }
    }
  }
  J.fase += J.mov*DT*2.2;
  /* ¿hay un vehículo al lado? */
  P.cercaVeh = null; let md = 4.6;
  for (const v of P.vehiculos){
    const d = Math.hypot(v.x-J.x, v.z-J.z) - v.radio;
    if (d < md && Math.abs(v.y - J.y) < 4){ md = d; P.cercaVeh = v; }
  }
}
function montar(P, v){
  P.veh = v; P.J.suelo = true; P.J.nadando = false; P.J.vx = P.J.vz = 0;
  P.J.x = v.x; P.J.z = v.z; P.J.y = v.y; P.J.ang = v.ang;
  P.cercaVeh = null;
  evento(P, 'montar', {id: v.id});
  if (v.id==='avion') evento(P, 'hablar', {texto:'¡A volar, pichunguitos!', quien:'Fernando'});
  else if (v.id==='barco') evento(P, 'hablar', {texto:'¡Todos a bordo del barco pichunguito!', quien:'Fernando'});
}
function puedeBajar(P){
  const v = P.veh; if (!v) return false;
  if (Math.abs(v.vel) > 4) return false;
  if (v.id==='avion' && v.aire) return false;
  if (v.id==='sub' && v.y < NIVEL_MAR - 0.9) return false;
  return true;
}
function intentarBajar(P){
  const v = P.veh; if (!v) return;
  if (!puedeBajar(P)){ evento(P, 'noBajar', {id:v.id}); return; }
  const rx = -Math.cos(v.ang), rz = Math.sin(v.ang);            /* a la derecha del vehículo */
  const lado = v.radio + 1.2;
  let x = v.x + rx*lado, z = v.z + rz*lado;
  if (v.id==='sub' || v.id==='barco'){
    /* si el muelle está cerca, se baja hacia él */
    for (let i=0;i<=10;i++){ const t=i/10, px = lerp(MUELLE.x0, MUELLE.x1, t), pz = lerp(MUELLE.z0, MUELLE.z1, t);
      if (Math.hypot(px-v.x, pz-v.z) < 9){ x = px; z = pz; break; } }
  }
  const J = P.J;
  J.x = x; J.z = z; J.ang = v.ang; J.vx = J.vz = J.vy = 0;
  J.nadando = enAgua(x, z); J.suelo = !J.nadando;
  J.y = J.nadando ? NIVEL_MAR - 0.35 : altura(x, z);
  v.vel = 0; P.veh = null;
  for (const p of P.perros) if (p.sigue){ p.x = x - rx*2 + azar(); p.z = z - rz*2 + azar(); p.y = altura(p.x, p.z); }
  evento(P, 'bajar', {id: v.id});
}

/* ---- los vehículos ---- */
const CARACT = {
  carro: {vmax: 30, acc: 13, freno: 26, giro: 1.9, reversa: 8, turbo: 1.4},
  moto:  {vmax: 34, acc: 18, freno: 28, giro: 2.5, reversa: 6, turbo: 1.45},
  barco: {vmax: 22, acc: 7,  freno: 10, giro: 1.3, reversa: 5, turbo: 1.4},
  avion: {vmax: 40, acc: 13, freno: 16, giro: 1.15, reversa: 3, turbo: 1.5, despegue: 26, crucero: 34, techo: 230},
  sub:   {vmax: 12, acc: 6,  freno: 8,  giro: 1.35, reversa: 5, turbo: 1.3, vertical: 5.5},
};
function pasoVehiculo(P, v, ent){
  const C = CARACT[v.id];
  const turbo = ent.b && (v.id!=='sub');
  v.turbo = turbo ? Math.min(1, v.turbo+0.1) : Math.max(0, v.turbo-0.05);
  const fx = Math.sin(v.ang), fz = Math.cos(v.ang);
  if (v.id==='avion' && v.aire) return pasoAvionAire(P, v, ent, C);
  if (v.id==='sub') return pasoSub(P, v, ent, C);
  /* en tierra o sobre el agua: gas, freno, marcha atrás y volante */
  const enRuta = cercaRuta(v.x, v.z).d < RUTA.ancho/2 + 1 || distPista(v.x, v.z) < PISTA.ancho/2 || v.id==='barco' || Math.hypot(v.x-PUEBLO.x, v.z-PUEBLO.z) < 130;
  const vmax = C.vmax*(enRuta ? 1 : 0.68)*(turbo ? C.turbo : 1);
  if (ent.jy > 0.05) v.vel += C.acc*ent.jy*(turbo ? 1.5 : 1)*DT;
  else if (ent.jy < -0.05){ if (v.vel > 0.4) v.vel -= C.freno*(-ent.jy)*DT; else v.vel = Math.max(v.vel - C.acc*0.6*DT, -C.reversa); }
  else v.vel -= v.vel*(v.id==='barco' ? 0.6 : 1.2)*DT;
  if (v.vel > vmax) v.vel -= (v.vel - vmax)*0.08;
  if (Math.abs(v.vel) < 0.02 && Math.abs(ent.jy) < 0.05) v.vel = 0;
  const agarre = Math.min(1, Math.abs(v.vel)/6);
  v.giro = lerp(v.giro, -ent.jx*agarre, 0.2);
  v.ang = envolver(v.ang + v.giro*C.giro*DT*Math.sign(v.vel||1)*(v.id==='barco' ? 1 : Math.min(1, 12/Math.max(6, Math.abs(v.vel)))*1.4));
  const nx = v.x + fx*v.vel*DT, nz = v.z + fz*v.vel*DT;
  const m = moverChocando(v, nx, nz);
  const gNueva = altura(m.x, m.z);
  if (v.id==='barco'){
    if (gNueva > NIVEL_MAR - 0.6){ v.vel *= 0.4; if (Math.abs(v.vel) > 3) evento(P, 'choque', {x:v.x, z:v.z}); }   /* la orilla */
    else { v.x = m.x; v.z = m.z; }
    v.y = NIVEL_MAR + ola(v.x, v.z, P.t*DT);
    v.suelo = true;
    if (Math.abs(v.vel) > 4 && P.t % 3 === 0) evento(P, 'estela', {x:v.x - fx*2.5, z:v.z - fz*2.5});
    return;
  }
  if (gNueva < NIVEL_MAR - 0.8 && v.id!=='avion'){ v.vel *= 0.3; evento(P, 'chapoteo', {x:m.x, z:m.z}); }              /* el mar frena */
  else if (v.suelo && gNueva - v.y > ESCALON){ v.vel *= -0.25; evento(P, 'choque', {x:v.x, z:v.z}); }                   /* pared */
  else { v.x = m.x; v.z = m.z; if (m.choco){ if (Math.abs(v.vel) > 4) evento(P, 'choque', {x:v.x, z:v.z}); v.vel *= 0.35; } }
  let g = altura(v.x, v.z);
  if (v.id==='avion') g = Math.max(g, NIVEL_MAR + ola(v.x, v.z, P.t*DT) + 0.2);                                 /* el avión también flota */
  if (v.suelo && ent.aNuevo && v.id!=='avion'){ v.vy = 6.5; v.suelo = false; evento(P, 'brinco', {id:v.id}); }
  if (v.suelo){
    if (g >= v.y - 0.9){ v.vy = (g - v.y)/DT; v.y = g; }
    else { v.suelo = false; v.vy = clamp(v.vy, -2, 16); }
  }
  if (!v.suelo){
    v.vy -= GRAV*DT; v.y += v.vy*DT;
    if (v.y <= g){ v.y = g; v.suelo = true; if (v.vy < -5) evento(P, 'aterriza', {id:v.id}); v.vy = 0; }
  }
  v.cabeceo = lerp(v.cabeceo, v.suelo ? 0 : clamp(-v.vy*0.03, -0.35, 0.35), 0.1);
  if (v.id==='avion' && v.vel > C.despegue && v.suelo){ v.aire = true; v.suelo = false; v.cabeceo = 0.2; v.vy = 4; v.y = g + 0.8; evento(P, 'despegue'); }
  if (Math.abs(v.vel) > 8 && v.suelo && P.t % 4 === 0) evento(P, 'polvo', {x:v.x - fx*1.5, z:v.z - fz*1.5, y:v.y, agua: g < NIVEL_MAR + 0.4 && v.id==='avion'});
}
function pasoAvionAire(P, v, ent, C){
  const objetivo = ent.b ? C.crucero*C.turbo : C.crucero;
  v.vel += (objetivo - v.vel)*0.02;
  /* subir y bajar: la palanca manda el cabeceo, que vuelve solo al plano */
  const cabObj = clamp(ent.jy, -1, 1)*0.6 + (ent.a ? 0.35 : 0);
  v.cabeceo = lerp(v.cabeceo, clamp(cabObj, -0.6, 0.7), 0.06);
  if (v.y > C.techo && v.cabeceo > 0) v.cabeceo = lerp(v.cabeceo, -0.1, 0.1);
  v.giro = lerp(v.giro, -ent.jx, 0.08);
  v.ang = envolver(v.ang + v.giro*C.giro*DT);
  const fx = Math.sin(v.ang), fz = Math.cos(v.ang);
  const horiz = v.vel*Math.cos(v.cabeceo);
  v.vy = v.vel*Math.sin(v.cabeceo);
  const nx = clamp(v.x + fx*horiz*DT, -LIMITE, LIMITE), nz = clamp(v.z + fz*horiz*DT, -LIMITE, LIMITE);
  if (nx !== v.x + fx*horiz*DT || nz !== v.z + fz*horiz*DT){ v.ang = envolver(v.ang + 0.03); }        /* en el borde del mundo el avión da la vuelta solo */
  v.x = nx; v.z = nz; v.y += v.vy*DT;
  const g = Math.max(altura(v.x, v.z), NIVEL_MAR + ola(v.x, v.z, P.t*DT) + 0.2);
  /* los árboles y las casas no derriban al avión: solo se pasa por encima */
  if (v.y <= g + 0.4 && v.vy <= 0){
    if (v.cabeceo > -0.22 && v.vy > -9){ v.aire = false; v.suelo = true; v.y = g; v.vy = 0; v.cabeceo = 0; v.vel = Math.min(v.vel, 24); evento(P, 'aterriza', {id:'avion'}); }
    else { v.y = g + 0.5; v.vy = 3; v.cabeceo = 0.25; v.vel *= 0.75; evento(P, 'rebote'); }
  }
  if (P.t % 2 === 0) evento(P, 'estelaAire', {x:v.x - fx*3, y:v.y, z:v.z - fz*3});
}
function pasoSub(P, v, ent, C){
  if (ent.jy > 0.05) v.vel += C.acc*ent.jy*DT;
  else if (ent.jy < -0.05) v.vel = Math.max(v.vel - C.acc*0.8*DT, -C.reversa);
  else v.vel -= v.vel*0.8*DT;
  if (v.vel > C.vmax) v.vel -= (v.vel-C.vmax)*0.1;
  v.giro = lerp(v.giro, -ent.jx, 0.12);
  v.ang = envolver(v.ang + v.giro*C.giro*DT);
  const fx = Math.sin(v.ang), fz = Math.cos(v.ang);
  const nx = v.x + fx*v.vel*DT, nz = v.z + fz*v.vel*DT;
  const fondo = altura(nx, nz);
  if (fondo > v.y - 1.6){ v.vel *= 0.3; if (Math.abs(v.vel) > 2) evento(P, 'choque', {x:v.x, z:v.z}); }
  else { v.x = clamp(nx, -LIMITE, LIMITE); v.z = clamp(nz, -LIMITE, LIMITE); }
  const vertObj = (ent.a ? C.vertical : 0) - (ent.b ? C.vertical : 0);
  v.vy = lerp(v.vy, vertObj, 0.08);
  v.y = clamp(v.y + v.vy*DT, altura(v.x, v.z) + 1.6, NIVEL_MAR);
  v.cabeceo = lerp(v.cabeceo, clamp(v.vy*0.08, -0.35, 0.35), 0.1);
  v.suelo = true;
  if ((Math.abs(v.vel) > 1 || Math.abs(v.vy) > 0.5) && P.t % 4 === 0) evento(P, 'burbujas', {x:v.x - fx*3, y:v.y, z:v.z - fz*3});
}

/* ---- los perritos siguen a Fernando ---- */
function pasoPerros(P){
  const J = P.J;
  P.perros.forEach((p, i)=>{
    if (!p.sigue){
      if (!P.veh && Math.hypot(p.x-J.x, p.z-J.z) < 2.6){ p.sigue = true; evento(P, 'perro', {id:p.id}); evento(P, 'hablar', {texto:'¡Guau, guau! ¡Soy el perrito pichunguito!', quien:p.nombre}); }
      p.fase += DT*2;
      return;
    }
    if (P.veh){ p.dentro = true; return; }
    p.dentro = false;
    const atras = 2.2 + i*1.8, lado = (i===0 ? -1 : 1)*1.1;
    const ox = J.x - Math.sin(J.ang)*atras - Math.cos(J.ang)*lado, oz = J.z - Math.cos(J.ang)*atras + Math.sin(J.ang)*lado;
    const dx = ox-p.x, dz = oz-p.z, d = Math.hypot(dx,dz);
    if (d > 40){ p.x = ox; p.z = oz; }
    else if (d > 1.0){
      const vel = Math.min(10.5, d*2.2);
      const nx = p.x + dx/d*vel*DT, nz = p.z + dz/d*vel*DT;
      const m = moverChocando(p, nx, nz);
      p.x = m.x; p.z = m.z; p.ang = envolver(p.ang + envolver(Math.atan2(dx,dz)-p.ang)*0.2); p.mov = vel;
    } else { p.mov = 0; p.ang = envolver(p.ang + envolver(J.ang-p.ang)*0.05); }
    const g = altura(p.x, p.z);
    p.y = g < NIVEL_MAR - 1.1 ? NIVEL_MAR - 0.3 : g;
    p.fase += p.mov*DT*2.8 + DT*2;
  });
}

/* ---- los popos bebés: nacen en el baño y van detrás de los perritos ---- */
const MAX_POPITOS = 10;
function nacerPopito(P, x, z){
  if (P.popitos.length >= MAX_POPITOS) return null;
  const p = {id: P.popitos.length, x, z, y: altura(x, z), ang: 0, mov: 0, fase: azar()*6.28, dentro: false, radio: 0.35};
  P.popitos.push(p); return p;
}
function pasoPopitos(P){
  const J = P.J, base = P.perros.filter(p=>p.sigue).length;
  P.popitos.forEach((p, i)=>{
    if (P.veh){ p.dentro = true; return; }
    p.dentro = false;
    const k = base + i, atras = 2.4 + k*1.5, lado = (k%2 ? 1 : -1)*0.9;
    const ox = J.x - Math.sin(J.ang)*atras - Math.cos(J.ang)*lado, oz = J.z - Math.cos(J.ang)*atras + Math.sin(J.ang)*lado;
    const dx = ox-p.x, dz = oz-p.z, d = Math.hypot(dx,dz);
    if (d > 45){ p.x = ox; p.z = oz; }
    else if (d > 0.8){
      const vel = Math.min(9.5, d*2.4);
      const m = moverChocando(p, p.x + dx/d*vel*DT, p.z + dz/d*vel*DT);
      p.x = m.x; p.z = m.z; p.ang = envolver(p.ang + envolver(Math.atan2(dx,dz)-p.ang)*0.2); p.mov = vel;
    } else { p.mov = 0; p.ang = envolver(p.ang + envolver(J.ang-p.ang)*0.05); }
    const g = altura(p.x, p.z);
    p.y = g < NIVEL_MAR - 1.1 ? NIVEL_MAR - 0.2 : g;
    p.fase += p.mov*DT*3 + DT*3;
  });
}
/* ---- hamburguesas, ganas de popo y peos ---- */
function comerHamburguesa(P, h){
  P.comidas.add(h.id); P.hamburguesas++; P.puntos += 100;
  P.popo = Math.min(1, P.popo + 0.34);
  evento(P, 'hamburguesa', {id:h.id, x:h.x, y:h.y, z:h.z, total:P.hamburguesas});
  if (P.t - P.ultimaHamb > 60) evento(P, 'hablar', {texto:'¡Qué rica hamburguesa!', quien:'Fernando'});
  P.ultimaHamb = P.t;
  /* el peo de la hamburguesa, y las ganas */
  P.pedoT = 14;
  evento(P, 'pedo', {x:P.J.x, y:P.J.y, z:P.J.z, grande: P.popo >= 0.99});
  if (P.t - P.ultimoPopoDicho > 60*7){ evento(P, 'hablar', {texto:'¡Quiero hacer popo!', quien:'Fernando'}); P.ultimoPopoDicho = P.t; }
  if (P.popo >= 0.99 && !P.ganas){ P.ganas = true; evento(P, 'ganas'); }
}
function pasoPopo(P){
  if (P.pedoT > 0) P.pedoT--;
  if (P.ganas && P.t % (60*8) === 0){ P.pedoT = 10; evento(P, 'pedo', {x:P.J.x, y:P.J.y, z:P.J.z, grande:false}); }
}
function revisarRecogibles(P){
  const J = P.J, alcance = P.veh ? (P.veh.id==='avion' ? 7 : 3.6) : 2.0;
  for (const h of HAMBURGUESAS){
    if (P.comidas.has(h.id)) continue;
    const dx = h.x-J.x, dz = h.z-J.z, dy = h.y-(J.y+1);
    if (dx*dx+dz*dz+dy*dy < alcance*alcance) comerHamburguesa(P, h);
  }
}
/* ---- los baños ---- */
function revisarBanos(P){
  if (P.veh || P.escena) return;
  const J = P.J;
  for (const b of BANOS){
    if (Math.hypot(b.px-J.x, b.pz-J.z) > 2.1) continue;
    if (P.popo <= 0.01){ if (P.t - P.avisoBano > 240){ P.avisoBano = P.t; evento(P, 'sinGanas', {bano:b.id}); } continue; }
    P.escena = {tipo:'bano', t:0, bano:b.id, dur: 330};
    P.srPopo.bano = b.id; P.srPopo.visible = true;
    J.vx = J.vz = 0; J.x = b.px; J.z = b.pz; J.ang = envolver(b.ang + Math.PI);
    evento(P, 'banoEntra', {bano:b.id});
    if (P.t - P.srPopo.saludo > 120) evento(P, 'hablar', {texto:'¡Pasa, pasa! ¡El baño está libre!', quien:'Señor Popo'});
    return;
  }
  /* el Señor Popo saluda cuando Fernando se le acerca */
  const b = BANOS[P.srPopo.bano], sx = b.x + Math.sin(b.ang)*2.6 - Math.cos(b.ang)*2.2, sz = b.z + Math.cos(b.ang)*2.6 + Math.sin(b.ang)*2.2;
  if (P.srPopo.visible && Math.hypot(sx-J.x, sz-J.z) < 3.2 && P.t - P.srPopo.saludo > 60*12){
    P.srPopo.saludo = P.t;
    evento(P, 'hablar', {texto: P.popo > 0.01 ? '¡Pasa, pasa! ¡El baño está libre!' : '¡Hola Fernando! Soy el Señor Popo. ¡Come hamburguesas y ven a mi baño!', quien:'Señor Popo'});
  }
}
function posSrPopo(P){
  const b = BANOS[P.srPopo.bano];
  return {x: b.x + Math.sin(b.ang)*2.6 - Math.cos(b.ang)*2.2, z: b.z + Math.cos(b.ang)*2.6 + Math.sin(b.ang)*2.2, ang: b.ang, bano: b};
}
function pasoEscena(P){
  const E = P.escena; E.t++;
  if (E.tipo==='bano'){
    if (E.t === 40) evento(P, 'banoPuerta', {abre:false, bano:E.bano});
    if (E.t > 70 && E.t < 210 && E.t % 28 === 0) evento(P, 'plop', {bano:E.bano});
    if (E.t === 225) evento(P, 'descarga', {bano:E.bano});
    if (E.t === 285){ evento(P, 'banoPuerta', {abre:true, bano:E.bano}); evento(P, 'hablar', {texto:'¡Ahh, qué alivio!', quien:'Fernando'}); }
    if (E.t >= E.dur){
      P.escena = null; P.popo = 0; P.ganas = false; P.puntos += 500;
      if (!P.prog.banos.includes(E.bano)) P.prog.banos.push(E.bano);
      evento(P, 'banoSale', {bano:E.bano, banos:P.prog.banos.length});
      /* de cada popo nace un popo bebé que sigue a Fernando */
      { const b = BANOS[E.bano]; const n = nacerPopito(P, b.px + Math.sin(b.ang)*1.2, b.pz + Math.cos(b.ang)*1.2); if (n) { evento(P, 'popito', {total:P.popitos.length}); if (P.popitos.length <= 3) evento(P, 'hablar', {texto:'¡Mira, un popo bebé me sigue!', quien:'Fernando'}); } }
      evento(P, 'hablar', {texto:'¡Bravo, Fernando! ¡Qué popo tan grande!', quien:'Señor Popo'});
      P.srPopo.saludo = P.t;
      P.prog.popo = true;
      darEstrella(P, 'popo');
      if (P.prog.banos.length >= BANOS.length){ evento(P, 'hablar', {texto:'¡Hiciste popo en todos mis baños! ¡Eres el campeón del popo!', quien:'Señor Popo'}); darEstrella(P, 'banos'); }
    }
  }
}
/* ---- la familia ---- */
function revisarFamilia(P){
  const J = P.J;
  for (const f of FAMILIA){
    const d = Math.hypot(f.x-J.x, f.z-J.z);
    if (d > (P.veh ? 4.5 : 2.6) || Math.abs(altura(f.x,f.z) - J.y) > 3) continue;
    if (P.saludos[f.id] && P.t - P.saludos[f.id+'T'] < 60*15) continue;
    const primera = !P.saludos[f.id];
    P.saludos[f.id] = true; P.saludos[f.id+'T'] = P.t;
    evento(P, 'saludo', {id:f.id, primera});
    evento(P, 'hablar', {texto:f.frase, quien:'Fernando'});
    if (f.pedo) evento(P, 'pedo', {x:f.x, y:altura(f.x,f.z), z:f.z, grande:true, tioFran:true});
    if (f.eructo) evento(P, 'eructo');
    if (primera){
      P.puntos += 500;
      if (f.bebe){ if (!P.prog.santi){ P.prog.santi = true; darEstrella(P, 'barco'); } }
      else if (!P.prog.familia.includes(f.id)){ P.prog.familia.push(f.id); if (P.prog.familia.length >= SALUDABLES.length) darEstrella(P, 'familia'); }
    }
  }
}
/* ---- las misiones de los vehículos ---- */
function revisarMisiones(P){
  const v = P.veh; if (!v) return;
  if (v.id==='carro'){
    for (const b of BANDERAS){
      if (P.prog.banderas.includes(b.id)) continue;
      const dx = v.x-b.x, dz = v.z-b.z;
      if (Math.abs(dx*b.tx+dz*b.tz) < 2.5 && Math.abs(dx*b.nx+dz*b.nz) < 7){
        P.prog.banderas.push(b.id); P.puntos += 300; evento(P, 'bandera', {id:b.id, total:P.prog.banderas.length});
        if (P.prog.banderas.length >= BANDERAS.length) darEstrella(P, 'carro');
      }
    }
  } else if (v.id==='moto'){
    if (!P.prog.rampa && !v.suelo){
      const a = RAMPA.aro;
      if (Math.hypot(v.x-a.x, v.z-a.z) < a.r && Math.abs(v.y+1 - a.y) < a.r){ P.prog.rampa = true; P.puntos += 500; evento(P, 'rampa'); evento(P, 'hablar', {texto:'¡Salté la rampa!', quien:'Fernando'}); darEstrella(P, 'moto'); }
    }
  } else if (v.id==='avion'){
    AROS.forEach((a, i)=>{
      if (P.prog.aros.includes(i)) return;
      if (Math.hypot(v.x-a.x, v.z-a.z) < a.r+1 && Math.abs(v.y-a.y) < a.r+1){
        P.prog.aros.push(i); P.puntos += 300; evento(P, 'aro', {id:i, total:P.prog.aros.length});
        if (P.prog.aros.length >= AROS.length) darEstrella(P, 'avion');
      }
    });
  } else if (v.id==='sub'){
    if (!P.prog.cofre && Math.hypot(v.x-COFRE.x, v.z-COFRE.z) < 9 && v.y < altura(COFRE.x, COFRE.z)+8){
      P.prog.cofre = true; P.puntos += 1000; evento(P, 'cofre'); evento(P, 'hablar', {texto:'¡Tesoro! ¡Encontré el tesoro!', quien:'Fernando'}); darEstrella(P, 'sub');
    }
  }
}
/* ---- el objetivo de ahora: qué le conviene hacer a Fernando y hacia dónde queda ---- */
function objetivo(P){
  const J = P.J;
  const masCerca = (lista, f)=>{ let mejor=null, md=Infinity; for (const o of lista){ const d = f ? f(o) : Math.hypot(o.x-J.x, o.z-J.z); if (d<md){ md=d; mejor=o; } } return mejor; };
  if (P.popo > 0.01 && !P.veh){ const b = masCerca(BANOS); return {texto: P.ganas ? '¡Corre al baño! 🚽' : 'Ve al baño del Señor Popo 🚽', x:b.px, z:b.pz, y:altura(b.px,b.pz), emoji:'🚽'}; }
  const v = P.veh;
  if (v){
    if (v.id==='carro' && !tieneEstrella(P,'carro')){ const b = masCerca(BANDERAS.filter(b=>!P.prog.banderas.includes(b.id))); if (b) return {texto:'Cruza las banderas 🚩 '+P.prog.banderas.length+'/'+BANDERAS.length, x:b.x, z:b.z, y:altura(b.x,b.z), emoji:'🚩'}; }
    if (v.id==='moto' && !tieneEstrella(P,'moto')) return {texto:'¡Salta la rampa a toda velocidad! 🏍️', x:RAMPA.x, z:RAMPA.z, y:RAMPA.base, emoji:'🏁'};
    if (v.id==='avion' && !tieneEstrella(P,'avion')){ const i = AROS.findIndex((a,i)=>!P.prog.aros.includes(i)); if (i>=0){ const a = AROS[i]; return {texto: v.aire ? 'Pasa por los aros ⭕ '+P.prog.aros.length+'/'+AROS.length : 'Acelera por la pista para despegar ✈️', x:a.x, z:a.z, y:a.y, emoji:'⭕'}; } }
    if (v.id==='barco' && !tieneEstrella(P,'barco')) return {texto:'Navega hasta la islita de Santi 👶', x:ISLITA.x, z:ISLITA.z, y:3, emoji:'👶'};
    if (v.id==='sub' && !tieneEstrella(P,'sub')) return {texto:'Baja al fondo del mar y busca el cofre 💎', x:COFRE.x, z:COFRE.z, y:altura(COFRE.x,COFRE.z), emoji:'💎'};
    return {texto:'¡Explora la isla! 🌴', x:null};
  }
  if (!tieneEstrella(P,'popo')){ const h = masCerca(HAMBURGUESAS.filter(h=>!P.comidas.has(h.id) && h.y < 30)); if (h) return {texto:'Busca hamburguesas 🍔', x:h.x, z:h.z, y:h.y, emoji:'🍔'}; }
  const orden = ['carro','moto','familia','avion','barco','sub','banos'];
  for (const id of orden){
    if (tieneEstrella(P, id)) continue;
    if (id==='familia'){ const f = masCerca(FAMILIA.filter(f=>!f.bebe && !P.saludos[f.id])); if (f) return {texto:'Saluda a '+f.nombre+' 👋', x:f.x, z:f.z, y:altura(f.x,f.z), emoji:'👋'}; continue; }
    if (id==='banos'){ const b = masCerca(BANOS.filter(b=>!P.prog.banos.includes(b.id))); if (b) return {texto:'Come 🍔 y ve a '+b.nombre+' 🚽', x:b.px, z:b.pz, y:altura(b.px,b.pz), emoji:'🚽'}; continue; }
    const vd = P.vehiculos.find(v=>v.id===id);
    return {texto:'Móntate en '+vd.nombre+' '+vd.emoji, x:vd.x, z:vd.z, y:vd.y, emoji:vd.emoji};
  }
  return {texto: P.final ? '¡Lo lograste todo! 🌟' : '¡Explora la isla! 🌴', x:null};
}

/* ---------------- Jugar con amigos: lo que viaja por la red ----------------
   Cada aparato lleva su propia partida (sus hamburguesas, estrellas y popos
   bebés) y solo comparte dónde está y qué hace, quince veces por segundo.
   Aquí está lo puro: armar y leer esos paquetes, y los códigos de sala. */
const PERSONAJES_RED = [
  {id:'fernando', nombre:'Fernando', emoji:'🧢'}, {id:'luca', nombre:'Luca', emoji:'🧒'}, {id:'salomon', nombre:'Salomón', emoji:'🕶️'},
  {id:'cucu', nombre:'Cucú', emoji:'👧'}, {id:'nacho', nombre:'Tío Nacho', emoji:'🤠'}, {id:'beto', nombre:'Tío Beto', emoji:'👓'},
];
const ALFABETO_SALA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   /* sin I, O, 0 ni 1, que se confunden */
const VERSION_RED = 1;
function codigoSala(){ let c = ''; for (let i=0;i<4;i++) c += ALFABETO_SALA[Math.floor(Math.random()*ALFABETO_SALA.length)]; return c; }
function normalizarCodigo(t){ return String(t||'').toUpperCase().split('').filter(ch=>ALFABETO_SALA.includes(ch)).slice(0,4).join(''); }
function empaquetarEstado(P, pj, nombre){
  const J = P.J, v = P.veh, r = (n, d)=> Math.round(n*(d||100))/(d||100);
  return {t:'e', pj, n:nombre, x:r(J.x), y:r(J.y), z:r(J.z), a:r(J.ang), v: v ? v.id : '', m:r(J.mov,10), f:r(J.fase,10),
    na: J.nadando ? 1 : 0, su: J.suelo ? 1 : 0, c: v ? r(v.cabeceo) : 0, g: v ? r(v.giro) : 0, ve: v ? r(v.vel,10) : 0, ai: v && v.aire ? 1 : 0,
    pp: P.popitos.length, ga: P.ganas ? 1 : 0, es: P.estrellas.length};
}
function desempaquetarEstado(m){
  if (!m || typeof m !== 'object' || m.t !== 'e' || ![m.x, m.y, m.z].every(Number.isFinite)) return null;
  const num = (v, a, b)=> Number.isFinite(v) ? clamp(v, a, b) : 0;
  const pj = PERSONAJES_RED.some(p=>p.id===m.pj) ? m.pj : 'fernando';
  const nombre = String(m.n||'').replace(/[^\wáéíóúñÁÉÍÓÚÑ ]/g, '').slice(0, 14) || PERSONAJES_RED.find(p=>p.id===pj).nombre;
  return {pj, nombre, x:num(m.x,-LIMITE,LIMITE), y:num(m.y,-60,400), z:num(m.z,-LIMITE,LIMITE), ang:num(m.a,-7,7),
    veh: VEHICULOS_DEF.some(d=>d.id===m.v) ? m.v : '', mov:num(m.m,0,40), fase:num(m.f,0,1e7), nadando:!!m.na, suelo:!!m.su,
    cabeceo:num(m.c,-1,1), giro:num(m.g,-1,1), vel:num(m.ve,-20,80), aire:!!m.ai, popitos:num(m.pp,0,MAX_POPITOS)|0, ganas:!!m.ga, estrellas:num(m.es,0,8)|0};
}

/* ---- un paso de la partida (60 por segundo) ---- */
function pasoPartida(P, ent){
  ent = ent || {};
  P.t++;
  const jx = clamp(ent.jx||0, -1, 1), jy = clamp(ent.jy||0, -1, 1);
  const aNuevo = !!ent.a && !P.aPrev, bNuevo = !!ent.b && !P.bPrev, salirNuevo = !!ent.salir && !P.salirPrev;
  P.aPrev = !!ent.a; P.bPrev = !!ent.b; P.salirPrev = !!ent.salir;
  if (Number.isFinite(ent.camYaw)) P.camYaw = ent.camYaw;
  if (P.escena){ pasoEscena(P); pasoPerros(P); pasoPopitos(P); return; }
  const e2 = {jx, jy, a:!!ent.a, b:!!ent.b, aNuevo, bNuevo};
  if (P.veh){
    pasoVehiculo(P, P.veh, e2);
    P.J.x = P.veh.x; P.J.y = P.veh.y; P.J.z = P.veh.z; P.J.ang = P.veh.ang;
    if (salirNuevo) intentarBajar(P);
  } else {
    if (aNuevo && P.cercaVeh){ montar(P, P.cercaVeh); e2.aNuevo = false; e2.a = false; }
    if (P.veh) pasoVehiculo(P, P.veh, {jx:0, jy:0, a:false, b:false, aNuevo:false, bNuevo:false});
    else pasoPie(P, e2);
  }
  pasoPerros(P); pasoPopitos(P); pasoPopo(P); revisarRecogibles(P); revisarFamilia(P); revisarMisiones(P); revisarBanos(P);
}

if (typeof module !== 'undefined' && module.exports){
  module.exports = {CLIPS, TONO_TTS, SIN_GRABACION, MISIONES, FAMILIA, PERROS_DEF, VEHICULOS_DEF, BANOS, HAMBURGUESAS, AROS, BANDERAS, CASAS, DECOR,
    RUTA, PISTA, RAMPA, MUELLE, COFRE, ISLITA, INICIO, HANGAR, FARO, PLAYA, MONTANA, PUEBLO, CANCHA, PARQUE, FUENTE, TAM, NSEG, SEG, MALLA, LIMITE, NIVEL_MAR,
    altura, alturaBase, alturaMalla, ola, enAgua, cercaRuta, puntoRuta, distPista, enMuelle, enRampa, crearPartida, pasoPartida, objetivo, exportar, importar,
    posSrPopo, puedeBajar, montar, obstaculosCerca, azar, SOLARES, MAX_POPITOS, PERSONAJES_RED, ALFABETO_SALA, codigoSala, normalizarCodigo, empaquetarEstado, desempaquetarEstado};
}
if (!EN_NAVEGADOR) return;

/* ============================================================
   VISTA — Three.js y el marcador en 2D
   ============================================================ */
if (typeof THREE === 'undefined'){
  document.body.insertAdjacentHTML('beforeend',
    '<p style="color:#fff;text-align:center;font-family:monospace;padding:40px">No se pudo cargar el motor 3D. Revisa tu conexión y recarga.</p>');
  return;
}
const gl = document.getElementById('gl'), hud = document.getElementById('hud');
const ctx = hud.getContext('2d');
let renderer;
try{
  renderer = new THREE.WebGLRenderer({canvas: gl, antialias: true, powerPreference:'high-performance'});
}catch(e){
  document.body.insertAdjacentHTML('beforeend',
    '<p style="color:#fff;text-align:center;font-family:monospace;padding:40px">Este navegador no puede dibujar en 3D (WebGL). Prueba con Chrome o Safari actualizados.</p>');
  return;
}
const MOVIL = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||'');
const CAL = {sombras:true, pixel: Math.min(window.devicePixelRatio||1, MOVIL ? 1.5 : 2), nivel:0};
renderer.setPixelRatio(CAL.pixel);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, 16/9, 0.4, 1600);
const luzSol = new THREE.DirectionalLight(0xfff1dc, 1.05);
luzSol.position.set(80, 140, 60);
luzSol.castShadow = true;
luzSol.shadow.mapSize.set(MOVIL ? 1024 : 2048, MOVIL ? 1024 : 2048);
luzSol.shadow.camera.near = 10; luzSol.shadow.camera.far = 420;
luzSol.shadow.camera.left = -70; luzSol.shadow.camera.right = 70;
luzSol.shadow.camera.top = 70; luzSol.shadow.camera.bottom = -70;
luzSol.shadow.bias = -0.0005; luzSol.shadow.normalBias = 0.04;
scene.add(luzSol); scene.add(luzSol.target);
const luzCielo = new THREE.HemisphereLight(0xcfe9ff, 0x4f8a3a, 0.6);
scene.add(luzCielo);
const luzAmb = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(luzAmb);
function enfocarLuz(x, y, z){
  luzSol.position.set(x+90, y+150, z+70);
  luzSol.target.position.set(x, y, z);
  luzSol.target.updateMatrixWorld();
}
function bajarCalidad(){
  CAL.nivel++;
  if (CAL.nivel===1){ CAL.sombras = false; renderer.shadowMap.enabled = false; luzSol.castShadow = false;
    scene.traverse(o=>{ if (o.material){ (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true); } }); }
  else if (CAL.nivel===2){ renderer.setPixelRatio(1); }
  else if (CAL.nivel===3){ renderer.setPixelRatio(0.75); }
}
/* medidas lógicas del marcador: 540 de alto siempre; el ancho depende de la pantalla */
let W = 960, H = 540, esc = 1, kLog = 1;
function redimensionar(){
  const w = window.innerWidth, h = window.innerHeight, dpr = Math.min(window.devicePixelRatio||1, 2);
  renderer.setSize(w, h, false);
  gl.style.width = w+'px'; gl.style.height = h+'px';
  camera.aspect = w/h; camera.updateProjectionMatrix();
  hud.width = Math.round(w*dpr); hud.height = Math.round(h*dpr);
  hud.style.width = w+'px'; hud.style.height = h+'px';
  let k = h/540;
  if (w/k < 640) k = w/640;
  kLog = k; esc = k*dpr;
  W = w/k; H = h/k;
}
window.addEventListener('resize', redimensionar);
redimensionar();

/* ---------------- Sonido y música 8-bits (Web Audio) ---------------- */
let AC = null, motor = null;
function audio(){
  prepararClips();
  if (!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  if (AC && AC.state==='suspended') AC.resume();
}
function beep(freq, dur, tipo, vol, t0){
  if (!AC) return;
  try{
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = tipo||'square'; o.frequency.value = freq;
    g.gain.setValueAtTime(vol||0.08, AC.currentTime+(t0||0));
    g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime+(t0||0)+dur);
    o.connect(g); g.connect(AC.destination);
    o.start(AC.currentTime+(t0||0)); o.stop(AC.currentTime+(t0||0)+dur+0.02);
  }catch(e){}
}
/* ruido para el agua, el pedo y la descarga del baño */
function ruidoSonoro(dur, vol, fInicio, fFin, t0){
  if (!AC) return;
  try{
    const n = Math.floor(AC.sampleRate*dur), buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0);
    for (let i=0;i<n;i++) d[i] = Math.random()*2-1;
    const src = AC.createBufferSource(); src.buffer = buf;
    const f = AC.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(fInicio, AC.currentTime+(t0||0)); f.frequency.exponentialRampToValueAtTime(fFin, AC.currentTime+(t0||0)+dur);
    const g = AC.createGain(); g.gain.setValueAtTime(vol, AC.currentTime+(t0||0)); g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime+(t0||0)+dur);
    src.connect(f); f.connect(g); g.connect(AC.destination);
    src.start(AC.currentTime+(t0||0));
  }catch(e){}
}
const sfx = {
  salto(){ beep(520,0.06,'square',0.05); beep(780,0.1,'square',0.05,0.05); },
  brinco(){ beep(300,0.08,'square',0.06); beep(440,0.1,'square',0.06,0.06); },
  hamburguesa(){ [784,988,1175,1568].forEach((f,i)=>beep(f,0.09,'square',0.06,i*0.06)); },
  estrella(){ [523,659,784,1047,1319,1568,2093].forEach((f,i)=>beep(f,0.16,'square',0.07,i*0.09)); },
  pedo(grande){ const n = grande ? 18 : 10; for(let i=0;i<n;i++) beep(96-i*3+(i%2)*18, 0.11, 'sawtooth', grande ? 0.3 : 0.2, i*0.055); ruidoSonoro(0.5+(grande?0.4:0), 0.12, 300, 80); },
  eructo(){ [84,66,94,56,74,50,68,44].forEach((f,i)=>beep(f,0.15,'sawtooth',0.3,i*0.08)); },
  plop(){ beep(180,0.05,'sine',0.2); beep(90,0.14,'sine',0.25,0.05); ruidoSonoro(0.12, 0.06, 900, 200, 0.06); },
  descarga(){ ruidoSonoro(2.4, 0.22, 1200, 200); for (let i=0;i<8;i++) beep(120+i*15, 0.12, 'sine', 0.05, 0.3+i*0.2); },
  puerta(){ beep(240,0.06,'square',0.05); beep(180,0.08,'square',0.05,0.06); },
  montar(){ [330,440,550].forEach((f,i)=>beep(f,0.09,'square',0.06,i*0.07)); },
  bajar(){ [550,440,330].forEach((f,i)=>beep(f,0.09,'square',0.06,i*0.07)); },
  no(){ beep(200,0.12,'square',0.06); beep(150,0.18,'square',0.06,0.12); },
  choque(){ beep(160,0.08,'square',0.09); beep(110,0.12,'triangle',0.09,0.05); ruidoSonoro(0.2, 0.1, 600, 100); },
  chapoteo(){ ruidoSonoro(0.45, 0.14, 2500, 300); },
  aro(){ [988,1319,1568].forEach((f,i)=>beep(f,0.1,'square',0.06,i*0.07)); },
  bandera(){ beep(880,0.08,'square',0.06); beep(1175,0.16,'square',0.06,0.08); },
  despegue(){ [220,330,440,660].forEach((f,i)=>beep(f,0.14,'sawtooth',0.05,i*0.08)); },
  aterriza(){ ruidoSonoro(0.3, 0.1, 800, 200); beep(180,0.1,'triangle',0.06); },
  saludo(){ [659,784,988,1319].forEach((f,i)=>beep(f,0.08,'square',0.05,i*0.06)); },
  cofre(){ [523,659,784,1047,784,1047,1319,1568].forEach((f,i)=>beep(f,0.14,'square',0.07,i*0.1)); },
  perro(){ beep(600,0.06,'square',0.06); beep(500,0.06,'square',0.06,0.1); },
  final(){ [523,587,659,784,880,1047,1319,1568,2093].forEach((f,i)=>beep(f,0.2,'square',0.08,i*0.12)); },
  toque(){ beep(660,0.05,'square',0.04); },
};
/* el motor: un zumbido que sube con la velocidad, distinto en cada vehículo */
function motorArrancar(tipo){
  if (!AC) return;
  motorParar();
  try{
    const o = AC.createOscillator(), o2 = AC.createOscillator(), f = AC.createBiquadFilter(), g = AC.createGain();
    o.type = tipo==='avion' ? 'sawtooth' : tipo==='sub' ? 'sine' : tipo==='barco' ? 'square' : 'sawtooth';
    o2.type = 'square';
    f.type = 'lowpass'; f.frequency.value = tipo==='sub' ? 220 : 700;
    g.gain.value = 0;
    o.connect(f); o2.connect(f); f.connect(g); g.connect(AC.destination);
    o.start(); o2.start();
    motor = {o, o2, f, g, tipo};
  }catch(e){ motor = null; }
}
function motorParar(){ if (motor){ try{ motor.g.gain.setTargetAtTime(0, AC.currentTime, 0.1); motor.o.stop(AC.currentTime+0.4); motor.o2.stop(AC.currentTime+0.4); }catch(e){} motor = null; } }
function motorAjustar(vel, turbo){
  if (!motor || !AC) return;
  const v = Math.abs(vel);
  const base = motor.tipo==='avion' ? 90 + v*2.2 : motor.tipo==='sub' ? 40 + v*3 : motor.tipo==='barco' ? 50 + v*2.5 : motor.tipo==='moto' ? 70 + v*4.5 : 55 + v*3.2;
  try{
    motor.o.frequency.setTargetAtTime(base*(1+turbo*0.3), AC.currentTime, 0.05);
    motor.o2.frequency.setTargetAtTime(base*0.5, AC.currentTime, 0.05);
    motor.g.gain.setTargetAtTime(Math.min(0.09, 0.025 + v*0.002 + turbo*0.02), AC.currentTime, 0.1);
  }catch(e){}
}
const TEMA_ISLA = { bpm: 150,
  mel: [76,0,79,81, 83,0,81,79, 76,0,74,0, 72,74,76,0,
        74,0,76,79, 81,0,79,76, 74,0,72,0, 71,72,74,0,
        76,0,79,81, 83,0,86,83, 81,0,79,0, 76,79,81,0,
        83,81,79,76, 74,76,79,74, 72,0,74,0, 76,0,0,0],
  bajo:[52,52,59,52, 50,50,57,50, 48,48,55,48, 50,50,57,50,
        52,52,59,52, 55,55,62,55, 50,50,57,50, 52,59,52,0] };
const TEMA_MAR = { bpm: 96,
  mel: [67,0,0,71, 74,0,0,71, 69,0,0,67, 0,0,0,0,
        66,0,0,69, 74,0,0,69, 67,0,0,66, 0,0,0,0,
        67,0,0,71, 74,0,0,78, 76,0,0,74, 0,0,0,0,
        72,0,71,0, 69,0,67,0, 0,0,0,0, 0,0,0,0],
  bajo:[43,0,50,0, 41,0,48,0, 40,0,47,0, 41,0,48,0] };
const TEMA_CIELO = { bpm: 160,
  mel: [79,0,83,0, 86,0,83,79, 81,0,79,0, 78,0,0,0,
        79,0,83,0, 86,0,90,86, 83,0,81,0, 79,0,0,0,
        81,83,86,0, 88,86,83,0, 81,79,78,0, 79,0,0,0,
        83,0,86,0, 90,0,88,86, 83,0,86,0, 91,0,0,0],
  bajo:[55,62,55,62, 52,59,52,59, 50,57,50,57, 55,62,55,62] };
const TEMA_MENU = { bpm: 128,
  mel: [76,0,79,0, 81,0,79,76, 74,0,76,0, 72,0,0,0,
        76,0,79,0, 81,0,84,81, 79,0,76,0, 74,0,0,0],
  bajo:[48,55,48,55, 45,52,45,52, 41,48,41,48, 43,50,43,50] };
const frecuencia = n => 440*Math.pow(2,(n-69)/12);
function tonoAbs(freq, cuando, dur, tipo, vol){
  if (!AC) return;
  try{
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = tipo; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, cuando);
    g.gain.exponentialRampToValueAtTime(0.001, cuando+dur);
    o.connect(g); g.connect(AC.destination);
    o.start(cuando); o.stop(cuando+dur+0.02);
  }catch(e){}
}
let musPaso = 0, musProx = 0, musTema = null, musicaOn = true;
try{ musicaOn = localStorage.getItem('aventura3d.musica') !== 'no'; }catch(e){}
function programarMusica(tema){
  if (!AC || AC.state!=='running' || !musicaOn) return;
  if (tema !== musTema){ musTema = tema; musPaso = 0; }
  if (musProx < AC.currentTime) musProx = AC.currentTime + 0.05;
  const dur = 60/tema.bpm/2;
  while (musProx < AC.currentTime + 0.35){
    const m = tema.mel[musPaso % tema.mel.length];
    if (m) tonoAbs(frecuencia(m), musProx, dur*0.85, tema===TEMA_MAR ? 'sine' : 'square', tema===TEMA_MAR ? 0.04 : 0.024);
    if (musPaso % 2 === 0){
      const b = tema.bajo[(musPaso>>1) % tema.bajo.length];
      if (b) tonoAbs(frecuencia(b), musProx, dur*1.7, 'triangle', 0.04);
    }
    musPaso++; musProx += dur;
  }
}

/* ---------------- Entrada: teclado, palanca táctil, botones y mando ---------------- */
const keys = {};
let tick = 0;
for (const ev of ['gesturestart','gesturechange','gestureend']) document.addEventListener(ev, e=>e.preventDefault());
document.addEventListener('dblclick', e=>e.preventDefault());
document.addEventListener('touchmove', e=>e.preventDefault(), {passive:false});
document.addEventListener('contextmenu', e=>e.preventDefault());
/* un toque muy corto (menos de un cuadro) también cuenta: se guarda hasta el próximo paso */
const pulsadas = new Set();
addEventListener('keydown', e=>{
  if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)) e.preventDefault();
  keys[e.key.toLowerCase()] = true; pulsadas.add(e.key.toLowerCase());
  if (e.repeat) return;
  audio();
  procesarTecla(e.key);
});
addEventListener('keyup', e=>{ keys[e.key.toLowerCase()] = false; });
addEventListener('blur', ()=>{ for (const k in keys) keys[k] = false; });
/* la palanca táctil: aparece donde se pone el dedo en la mitad izquierda */
const TOQUE = {palanca:null, botones:new Map()};
const BOTONES_TACTILES = [
  {id:'A', k:'a', txt:'A', color:'rgba(255,120,90,.40)', borde:'rgba(255,190,170,.9)', r:40, pos:()=>({x:W-52, y:H-112})},
  {id:'B', k:'b', txt:'B', color:'rgba(110,170,255,.40)', borde:'rgba(180,210,255,.9)', r:34, pos:()=>({x:W-130, y:H-52})},
  {id:'salir', k:'salir', txt:'🚪', color:'rgba(255,230,110,.40)', borde:'rgba(255,240,180,.9)', r:28, pos:()=>({x:W-52, y:H-210}), solo:'veh'},
  {id:'menu', k:'menu', txt:'☰', color:'rgba(255,255,255,.25)', borde:'rgba(255,255,255,.7)', r:20, pos:()=>({x:W-30, y:30})},
];
function botonTactilEn(x, y){
  let mejor = null, md = 1e9;
  for (const b of BOTONES_TACTILES){
    if (b.solo==='veh' && !(P && P.veh)) continue;
    const p = b.pos(), d = Math.hypot(x-p.x, y-p.y);
    if (d < b.r*1.5 && d < md){ md = d; mejor = b; }
  }
  return mejor;
}
const aLogico = ev=>({x: ev.clientX/kLog, y: ev.clientY/kLog});
document.addEventListener('pointerdown', ev=>{
  audio();
  const p = aLogico(ev);
  if (estado==='juego' && !P.escena){
    const b = botonTactilEn(p.x, p.y);
    if (b){ TOQUE.botones.set(ev.pointerId, b); pulsadas.add(b.k); if (b.k==='a') procesarTecla(' '); if (b.k==='b') procesarTecla('Shift'); if (b.k==='salir') procesarTecla('e'); if (b.k==='menu') procesarTecla('Escape'); ev.preventDefault(); return; }
    if (p.x < W*0.5 && !TOQUE.palanca && ev.pointerType!=='mouse'){ TOQUE.palanca = {id:ev.pointerId, x0:p.x, y0:p.y, x:p.x, y:p.y}; ev.preventDefault(); return; }
    if (p.x < W*0.5 && !TOQUE.palanca && ev.pointerType==='mouse'){ TOQUE.palanca = {id:ev.pointerId, x0:p.x, y0:p.y, x:p.x, y:p.y}; ev.preventDefault(); return; }
  }
  clic(p.x, p.y);
}, true);
document.addEventListener('pointermove', ev=>{
  if (TOQUE.palanca && TOQUE.palanca.id===ev.pointerId){ const p = aLogico(ev); TOQUE.palanca.x = p.x; TOQUE.palanca.y = p.y; ev.preventDefault(); }
  else if (TOQUE.botones.has(ev.pointerId)){ const p = aLogico(ev); const b = botonTactilEn(p.x, p.y); if (b && b.k!==TOQUE.botones.get(ev.pointerId).k && (b.k==='a'||b.k==='b')){ TOQUE.botones.set(ev.pointerId, b); } }
}, true);
const soltar = ev=>{
  if (TOQUE.palanca && TOQUE.palanca.id===ev.pointerId) TOQUE.palanca = null;
  TOQUE.botones.delete(ev.pointerId);
};
document.addEventListener('pointerup', soltar, true);
document.addEventListener('pointercancel', soltar, true);
addEventListener('blur', ()=>{ TOQUE.palanca = null; TOQUE.botones.clear(); });
function palancaTactil(){
  const p = TOQUE.palanca; if (!p) return {jx:0, jy:0};
  const R = 46;
  let dx = (p.x-p.x0)/R, dy = (p.y-p.y0)/R;
  const m = Math.hypot(dx, dy);
  if (m > 1){ dx /= m; dy /= m; }
  const zona = 0.12;
  if (m < zona) return {jx:0, jy:0};
  return {jx: dx, jy: -dy};
}
/* mandos: palanca analógica, A/B como en Fernando Bros, hombros para bajarse, + para el menú */
const MANDO = {activo:false, prev:{}, dirPrev:null, rep:0, jx:0, jy:0, a:false, b:false, salir:false, avisoT:0};
function leerMandos(){
  if (!navigator.getGamepads) return;
  let gps; try{ gps = navigator.getGamepads(); }catch(e){ return; }
  let hay = false, jx = 0, jy = 0, a = false, b = false, salir = false;
  for (const gp of gps){
    if (!gp || !gp.connected) continue;
    hay = true;
    const ax = gp.axes[0]||0, ay = gp.axes[1]||0;
    const zona = v=> Math.abs(v) > 0.14 ? Math.sign(v)*Math.pow((Math.abs(v)-0.14)/0.86, 1.3) : 0;
    jx += zona(ax); jy -= zona(ay);
    const pulsado = i=>{ const bt = gp.buttons[i]; return !!(bt && (bt.pressed || bt.value > 0.5)); };
    if (pulsado(0)||pulsado(1)) a = true;
    if (pulsado(2)||pulsado(3)||pulsado(7)||pulsado(6)) b = true;
    if (pulsado(4)||pulsado(5)||pulsado(8)) salir = true;
    if (pulsado(14)) jx -= 1; if (pulsado(15)) jx += 1; if (pulsado(12)) jy += 1; if (pulsado(13)) jy -= 1;
    const P_ = {0:' ',1:' ',2:'Shift',3:'Shift',4:'e',5:'e',8:'e',9:'Escape',12:'ArrowUp',13:'ArrowDown',14:'ArrowLeft',15:'ArrowRight'};
    for (const i in P_){
      const p = pulsado(+i), clave = gp.index+':'+i;
      if (p && !MANDO.prev[clave]){ audio(); procesarTecla(P_[i]); }
      MANDO.prev[clave] = p;
    }
    const dir = ax < -0.6 ? 'ArrowLeft' : ax > 0.6 ? 'ArrowRight' : ay < -0.6 ? 'ArrowUp' : ay > 0.6 ? 'ArrowDown' : null;
    if (estado!=='juego' && dir){
      if (MANDO.dirPrev !== dir || ++MANDO.rep > 18){ procesarTecla(dir); MANDO.rep = 0; }
    } else if (!dir) MANDO.dirPrev = null;
    if (dir) MANDO.dirPrev = dir;
  }
  if (hay !== MANDO.activo){ MANDO.activo = hay; document.body.classList.toggle('conMando', hay); }
  MANDO.jx = hay ? clamp(jx,-1,1) : 0; MANDO.jy = hay ? clamp(jy,-1,1) : 0; MANDO.a = a; MANDO.b = b; MANDO.salir = salir;
}
addEventListener('gamepadconnected', ()=>{ MANDO.avisoT = 200; });
/* la entrada de este cuadro, juntando teclado, palanca táctil, botones y mando */
function leerEntrada(){
  let jx = 0, jy = 0;
  if (keys['arrowleft']||keys['a']) jx -= 1; if (keys['arrowright']||keys['d']) jx += 1;
  if (keys['arrowup']||keys['w']) jy += 1; if (keys['arrowdown']||keys['s']) jy -= 1;
  const t = palancaTactil(); jx += t.jx; jy += t.jy; jx += MANDO.jx; jy += MANDO.jy;
  const m = Math.hypot(jx, jy); if (m > 1){ jx /= m; jy /= m; }
  const tb = [...TOQUE.botones.values()].map(b=>b.k);
  const ent = {jx, jy,
    a: !!(keys[' ']||keys['z']||MANDO.a||tb.includes('a')||pulsadas.has(' ')||pulsadas.has('z')||pulsadas.has('a')),
    b: !!(keys['shift']||keys['x']||MANDO.b||tb.includes('b')||pulsadas.has('shift')||pulsadas.has('x')||pulsadas.has('b')),
    salir: !!(keys['e']||keys['enter']||keys['backspace']||MANDO.salir||tb.includes('salir')||pulsadas.has('e')||pulsadas.has('enter')||pulsadas.has('salir'))};
  pulsadas.clear();
  return ent;
}

/* ---------------- Materiales y el armador de cajitas ----------------
   Cada personaje, casa o vehículo se arma con cajas, bolas y cilindros
   de colores que se funden en UNA sola malla: cientos de cosas pesan poco. */
const colorCache = {};
function col(hex){ if (!colorCache[hex]) colorCache[hex] = new THREE.Color(hex).convertSRGBToLinear(); return colorCache[hex]; }
const lin = hex => new THREE.Color(hex).convertSRGBToLinear();
const matMate = ()=> new THREE.MeshLambertMaterial({vertexColors:true});
const matBrillo = (extra)=> new THREE.MeshPhongMaterial(Object.assign({vertexColors:true, shininess:42, specular: lin(0x606060)}, extra||{}));
class Armador {
  constructor(){ this.geos = []; }
  pieza(geo, color, x, y, z, rx, ry, rz, sx, sy, sz){
    const g = geo.index ? geo.toNonIndexed() : geo;
    const n = g.attributes.position.count, c = col(color), arr = new Float32Array(n*3);
    for (let i=0;i<n;i++){ arr[i*3]=c.r; arr[i*3+1]=c.g; arr[i*3+2]=c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    const m = new THREE.Matrix4();
    m.compose(new THREE.Vector3(x||0,y||0,z||0), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx||0, ry||0, rz||0)), new THREE.Vector3(sx||1, sy||1, sz||1));
    g.applyMatrix4(m);
    this.geos.push(g);
    return this;
  }
  caja(w,h,d,color,x,y,z,rx,ry,rz){ return this.pieza(new THREE.BoxGeometry(w,h,d), color, x,y,z,rx,ry,rz); }
  bola(r,color,x,y,z,seg,sx,sy,sz){ return this.pieza(new THREE.SphereGeometry(r, seg||10, seg? Math.max(5,seg-2):7), color, x,y,z,0,0,0,sx,sy,sz); }
  cil(r1,r2,h,color,x,y,z,rx,ry,rz,seg){ return this.pieza(new THREE.CylinderGeometry(r1,r2,h,seg||12), color, x,y,z,rx,ry,rz); }
  cono(r,h,color,x,y,z,seg,rx,ry,rz){ return this.pieza(new THREE.ConeGeometry(r,h,seg||10), color, x,y,z,rx,ry,rz); }
  geo(){
    let total = 0;
    for (const g of this.geos) total += g.attributes.position.count;
    const pos = new Float32Array(total*3), nor = new Float32Array(total*3), colr = new Float32Array(total*3);
    let o = 0;
    for (const g of this.geos){
      pos.set(g.attributes.position.array, o*3);
      nor.set(g.attributes.normal.array, o*3);
      colr.set(g.attributes.color.array, o*3);
      o += g.attributes.position.count;
      g.dispose();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor,3));
    geo.setAttribute('color', new THREE.BufferAttribute(colr,3));
    return geo;
  }
  malla(material, sombra){
    const m = new THREE.Mesh(this.geo(), material || matMate());
    if (sombra !== false){ m.castShadow = true; m.receiveShadow = true; }
    return m;
  }
}
function texturaTexto(txt, fondo, color, w, h, tam, fuente){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  if (fondo){ x.fillStyle = fondo; x.beginPath(); x.roundRect(2, 2, w-4, h-4, h*0.3); x.fill(); }
  const f = fuente||"'Fredoka','Arial Rounded MT Bold',Arial,sans-serif";
  x.font = 'bold '+tam+'px '+f;
  while (x.measureText(txt).width > w-16 && tam > 8){ tam--; x.font = 'bold '+tam+'px '+f; }   /* el nombre siempre cabe */
  x.fillStyle = color; x.textAlign='center'; x.textBaseline='middle';
  x.fillText(txt, w/2, h/2+tam*0.06);
  const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
}
function texturaCuadros(a, b, n){
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d'), s = 64/n;
  for (let i=0;i<n;i++) for (let j=0;j<n;j++){ x.fillStyle = (i+j)%2 ? a : b; x.fillRect(i*s, j*s, s, s); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.NearestFilter; return t;
}
let texResplandor = null;
function texturaResplandor(){
  if (texResplandor) return texResplandor;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'), g = x.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(0.3,'rgba(255,255,255,0.6)'); g.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0,0,128,128);
  texResplandor = new THREE.CanvasTexture(c); return texResplandor;
}
function letrero(txt, color, fondo, esc){
  const t = texturaTexto(txt, fondo||'rgba(20,20,40,0.72)', color||'#fff', 256, 64, 34);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({map:t, transparent:true, depthWrite:false}));
  sp.scale.set(2.8*(esc||1), 0.7*(esc||1), 1);
  return sp;
}

/* ---------------- El cielo, el sol y las nubes ---------------- */
const CIELO = {arriba: lin(0x2f7fe0), horizonte: lin(0xd6ecff), arribaAgua: lin(0x03305e), horizonteAgua: lin(0x0b5f9c)};
const cupula = new THREE.Mesh(new THREE.SphereGeometry(1400, 24, 12), new THREE.ShaderMaterial({
  uniforms: {arriba:{value:CIELO.arriba.clone()}, horizonte:{value:CIELO.horizonte.clone()}, sol:{value:new THREE.Vector3(0.45,0.6,0.35).normalize()}},
  vertexShader: 'varying vec3 vP; void main(){ vP = (modelMatrix*vec4(position,1.0)).xyz; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader: `uniform vec3 arriba; uniform vec3 horizonte; uniform vec3 sol; varying vec3 vP;
    void main(){
      vec3 d = normalize(vP - cameraPosition); float h = d.y; float t = pow(clamp(h*1.5, 0.0, 1.0), 0.55);
      vec3 c = mix(horizonte, arriba, t); float s = pow(max(dot(d, sol), 0.0), 18.0); c += vec3(1.0,0.85,0.6)*s*0.35;
      gl_FragColor = vec4(c, 1.0);
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }`,
  side: THREE.BackSide, depthWrite: false, fog: false,
}));
cupula.renderOrder = -10; cupula.frustumCulled = false;
scene.add(cupula);
const sol = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xfff2c0, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, fog:false}));
sol.scale.set(260, 260, 1); scene.add(sol);
const nubes = (()=>{
  const A = new Armador();
  for (const [x,y,z,r] of [[0,0,0,7],[6,-1,1,5.5],[-6,-1,-1,5],[2,3,-2,4.5],[-3,2,2,4.2],[10,-2,-1,3.5],[-10,-2,1,3.2]]) A.bola(r, '#ffffff', x, y, z, 8, 1, 0.62, 1);
  const m = new THREE.InstancedMesh(A.geo(), new THREE.MeshLambertMaterial({vertexColors:true, emissive: lin(0x334455), emissiveIntensity:0.18, transparent:true, opacity:0.96}), 40);
  const M = new THREE.Matrix4(); m.datos = [];
  for (let i=0;i<40;i++){
    const d = {x:(azar()-0.5)*1500, z:(azar()-0.5)*1500, y:130+azar()*80, esc:0.9+azar()*1.6, v:1.5+azar()*2, rot:azar()*6.28};
    m.datos.push(d);
    M.compose(new THREE.Vector3(d.x,d.y,d.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0,d.rot,0)), new THREE.Vector3(d.esc,d.esc,d.esc));
    m.setMatrixAt(i, M);
  }
  m.frustumCulled = false; scene.add(m); return m;
})();
function pasoNubes(){
  const M = new THREE.Matrix4();
  nubes.datos.forEach((d,i)=>{
    d.x += d.v*DT; if (d.x > 800) d.x = -800;
    M.compose(new THREE.Vector3(d.x,d.y,d.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0,d.rot,0)), new THREE.Vector3(d.esc,d.esc,d.esc));
    nubes.setMatrixAt(i, M);
  });
  nubes.instanceMatrix.needsUpdate = true;
}
/* las gaviotas dan vueltas sobre la isla */
const gaviotas = (()=>{
  const A = new Armador();
  A.caja(0.9,0.06,0.28,'#ffffff', -0.45,0,0, 0,0,0.25).caja(0.9,0.06,0.28,'#ffffff', 0.45,0,0, 0,0,-0.25).caja(0.3,0.16,0.5,'#f0f0f0', 0,0,0).cono(0.06,0.2,'#ffb000', 0,0,0.32, 5, 1.57,0,0);
  const m = new THREE.InstancedMesh(A.geo(), matMate(), 18);
  m.datos = [];
  for (let i=0;i<18;i++) m.datos.push({cx:(azar()-0.5)*500, cz:(azar()-0.5)*500, r:40+azar()*80, y:40+azar()*50, a:azar()*6.28, v:(0.15+azar()*0.15)*(azar()<0.5?1:-1), fase:azar()*6.28});
  m.frustumCulled = false; scene.add(m); return m;
})();
function pasoGaviotas(){
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  gaviotas.datos.forEach((d,i)=>{
    d.a += d.v*DT; d.fase += DT*9;
    const x = d.cx + Math.cos(d.a)*d.r, z = d.cz + Math.sin(d.a)*d.r, y = d.y + Math.sin(d.fase*0.3)*2;
    const rumbo = Math.atan2(-Math.sin(d.a)*d.v, Math.cos(d.a)*d.v);
    e.set(0, rumbo, Math.sin(d.fase)*0.5);
    M.compose(new THREE.Vector3(x,y,z), q.setFromEuler(e), new THREE.Vector3(1.6,1.6,1.6));
    gaviotas.setMatrixAt(i, M);
  });
  gaviotas.instanceMatrix.needsUpdate = true;
}

/* ---------------- El terreno: una malla con colores por vértice ----------------
   Arena en la orilla, pasto de varios verdes, roca en las cuestas, nieve
   en la cima y fondo de mar azulado, con un poquito de ruido para que se
   vea pintado a mano. */
const terreno = (()=>{
  const n = NSEG+1, pos = new Float32Array(n*n*3), colr = new Float32Array(n*n*3);
  const arena = col('#f2dfa6'), arenaMojada = col('#d9c48a'), fondo = col('#2c5e83'), fondoHondo = col('#1a3d5c');
  const pasto = [col('#5fb040'), col('#52a238'), col('#6cbf4a'), col('#7ccb56'), col('#58aa3c')];
  const pastoAlto = col('#3f8f3a'), roca = col('#8d8a86'), rocaOscura = col('#6e6a66'), nieve = col('#f7f8fc');
  const c = new THREE.Color();
  for (let iy=0; iy<n; iy++) for (let ix=0; ix<n; ix++){
    const i = iy*n+ix, x = ix*SEG-MITAD, z = iy*SEG-MITAD, h = MALLA[i];
    pos[i*3] = x; pos[i*3+1] = h; pos[i*3+2] = z;
    const hx = MALLA[iy*n+Math.min(ix+1,NSEG)] - MALLA[iy*n+Math.max(ix-1,0)];
    const hz = MALLA[Math.min(iy+1,NSEG)*n+ix] - MALLA[Math.max(iy-1,0)*n+ix];
    const pend = Math.hypot(hx, hz)/(2*SEG);
    const r = ruido(x*0.08+3, z*0.08+7), r2 = ruido(x*0.5, z*0.5);
    if (h < -0.6){ c.copy(arenaMojada).lerp(fondo, clamp(-h/12, 0, 1)).lerp(fondoHondo, clamp((-h-14)/22, 0, 1)); c.multiplyScalar(0.92+r2*0.16); }
    else if (h < 1.2){ c.copy(arena).multiplyScalar(0.95+r2*0.1); }
    else {
      c.copy(pasto[Math.floor(r*4.99)]);
      const t = clamp((h-1.2)/1.0, 0, 1); c.lerp(arena, 1-t);
      if (h > 22) c.lerp(pastoAlto, clamp((h-22)/14, 0, 1));
      if (pend > 0.55) c.lerp(r2 > 0.5 ? roca : rocaOscura, clamp((pend-0.55)/0.35, 0, 1));
      if (h > 50) c.lerp(nieve, clamp((h-50)/6, 0, 1));
      c.multiplyScalar(0.94+r2*0.12);
    }
    colr[i*3] = c.r; colr[i*3+1] = c.g; colr[i*3+2] = c.b;
  }
  const idx = new Uint32Array(NSEG*NSEG*6); let o = 0;
  for (let iy=0; iy<NSEG; iy++) for (let ix=0; ix<NSEG; ix++){
    const a = ix + n*iy, b = ix + n*(iy+1), cc = (ix+1) + n*(iy+1), d = (ix+1) + n*iy;
    idx[o++] = a; idx[o++] = b; idx[o++] = d; idx[o++] = b; idx[o++] = cc; idx[o++] = d;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(colr, 3));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({vertexColors:true}));
  m.receiveShadow = true; m.castShadow = false;
  scene.add(m); return m;
})();

/* ---------------- El mar: olas, brillo del sol, espuma en la orilla ---------------- */
const agua = (()=>{
  const n = 130, lado = 1400, seg = lado/n, k = n+1;
  const pos = new Float32Array(k*k*3), prof = new Float32Array(k*k);
  for (let iy=0; iy<k; iy++) for (let ix=0; ix<k; ix++){
    const i = iy*k+ix, x = ix*seg-lado/2, z = iy*seg-lado/2;
    pos[i*3] = x; pos[i*3+1] = 0; pos[i*3+2] = z; prof[i] = alturaMalla(x, z);
  }
  const idx = new Uint32Array(n*n*6); let o = 0;
  for (let iy=0; iy<n; iy++) for (let ix=0; ix<n; ix++){
    const a = ix + k*iy, b = ix + k*(iy+1), c = (ix+1) + k*(iy+1), d = (ix+1) + k*iy;
    idx[o++] = a; idx[o++] = b; idx[o++] = d; idx[o++] = b; idx[o++] = c; idx[o++] = d;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('prof', new THREE.BufferAttribute(prof, 1));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
      t:{value:0}, bajo:{value:0}, sol:{value:new THREE.Vector3(0.45,0.6,0.35).normalize()},
      hondo:{value:lin(0x0d5c9a)}, claro:{value:lin(0x3fd0d8)}, espuma:{value:lin(0xffffff)}, cielo:{value:lin(0xbfe4ff)},
    }]),
    vertexShader: `
      uniform float t; attribute float prof;
      varying float vProf; varying vec3 vPos; varying vec3 vN;
      #include <fog_pars_vertex>
      void main(){
        vec3 p = position;
        float h = 0.22*sin(p.x*0.23 + t*1.3) + 0.16*sin(p.z*0.29 - t*1.1) + 0.1*sin((p.x+p.z)*0.11 + t*0.7);
        float dhx = 0.0506*cos(p.x*0.23 + t*1.3) + 0.011*cos((p.x+p.z)*0.11 + t*0.7);
        float dhz = 0.0464*cos(p.z*0.29 - t*1.1) + 0.011*cos((p.x+p.z)*0.11 + t*0.7);
        p.y = h;
        vN = vec3(0.0, 1.0, 0.0);
        vProf = prof;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        vPos = (modelMatrix * vec4(p, 1.0)).xyz;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: `
      uniform vec3 hondo, claro, espuma, cielo, sol; uniform float t, bajo;
      varying float vProf; varying vec3 vPos; varying vec3 vN;
      #include <fog_pars_fragment>
      void main(){
        vec3 V = normalize(cameraPosition - vPos);
        float dhx = 0.0506*cos(vPos.x*0.23 + t*1.3) + 0.011*cos((vPos.x+vPos.z)*0.11 + t*0.7) + 0.02*cos(vPos.x*1.3 + vPos.z*0.7 + t*2.6);
        float dhz = 0.0464*cos(vPos.z*0.29 - t*1.1) + 0.011*cos((vPos.x+vPos.z)*0.11 + t*0.7) + 0.02*cos(vPos.z*1.1 - vPos.x*0.6 + t*2.2);
        vec3 n = normalize(vec3(-dhx*4.0, 1.0, -dhz*4.0));
        if (bajo > 0.5) n = -n;
        float fres = pow(1.0 - max(dot(n, V), 0.0), 3.0);
        float prof = clamp(-vProf/16.0, 0.0, 1.0);
        vec3 c = mix(claro, hondo, prof);
        c = mix(c, cielo, fres*0.5);
        vec3 R = reflect(-normalize(sol), n);
        float spec = pow(max(dot(R, V), 0.0), 90.0);
        c += vec3(1.0, 0.97, 0.9)*spec*0.7;
        float orilla = smoothstep(-2.6, -0.1, vProf);
        float esp = orilla * (0.5 + 0.5*sin(vPos.x*0.6 + vPos.z*0.45 + t*2.0 + sin(vPos.x*0.17 + vPos.z*0.13)*3.0));
        esp += smoothstep(-0.9, -0.1, vProf)*0.5;
        c = mix(c, espuma, clamp(esp, 0.0, 1.0)*0.9);
        float alfa = mix(0.58, 0.9, prof) + fres*0.1;
        if (bajo > 0.5){ c = mix(c, hondo, 0.4) + vec3(0.2,0.3,0.35)*spec; alfa = 0.8; }
        gl_FragColor = vec4(c, alfa);
        #include <tonemapping_fragment>
        #include <encodings_fragment>
        #include <fog_fragment>
      }`,
    transparent: true, side: THREE.DoubleSide, fog: true, depthWrite: false,
  });
  const m = new THREE.Mesh(g, mat);
  m.renderOrder = 2; m.frustumCulled = false;
  scene.add(m); return m;
})();

/* ---------------- La carretera, la pista, el muelle y la rampa ---------------- */
const mundo = new THREE.Group(); scene.add(mundo);
/* una cinta que sigue una lista de puntos (con tangente y normal), pegada al terreno */
function cinta(muestras, a, b, color, alza, cerrada){
  const n = muestras.length, pos = new Float32Array(n*6), colr = new Float32Array(n*6), c = col(color);
  for (let i=0;i<n;i++){
    const m = muestras[i];
    const xa = m.x + m.nx*a, za = m.z + m.nz*a, xb = m.x + m.nx*b, zb = m.z + m.nz*b;
    pos[i*6] = xa; pos[i*6+1] = altura(xa, za)+alza; pos[i*6+2] = za;
    pos[i*6+3] = xb; pos[i*6+4] = altura(xb, zb)+alza; pos[i*6+5] = zb;
    for (let k=0;k<2;k++){ colr[i*6+k*3] = c.r; colr[i*6+k*3+1] = c.g; colr[i*6+k*3+2] = c.b; }
  }
  const segs = cerrada ? n : n-1, idx = new Uint32Array(segs*6); let o = 0;
  for (let i=0;i<segs;i++){ const j = (i+1)%n; idx[o++] = i*2; idx[o++] = j*2; idx[o++] = i*2+1; idx[o++] = j*2; idx[o++] = j*2+1; idx[o++] = i*2+1; }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(colr, 3));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeVertexNormals();
  return g;
}
(function construirCarretera(){
  const mat = new THREE.MeshLambertMaterial({vertexColors:true, polygonOffset:true, polygonOffsetFactor:-1, polygonOffsetUnits:-1});
  const asfalto = new THREE.Mesh(cinta(RUTA.M, -5, 5, '#4a4a55', 0.1, true), mat); asfalto.receiveShadow = true; mundo.add(asfalto);
  mundo.add(new THREE.Mesh(cinta(RUTA.M, -5.2, -4.6, '#e8e8ea', 0.14, true), mat));
  mundo.add(new THREE.Mesh(cinta(RUTA.M, 4.6, 5.2, '#e8e8ea', 0.14, true), mat));
  for (let i=0;i<RUTA.N;i+=8){
    const tramo = []; for (let k=0;k<5;k++) tramo.push(RUTA.M[(i+k)%RUTA.N]);
    mundo.add(new THREE.Mesh(cinta(tramo, -0.22, 0.22, '#ffd23f', 0.15, false), mat));
  }
  /* la pista de aterrizaje */
  const P_ = []; for (let z=PISTA.z0; z<=PISTA.z1; z+=4) P_.push({x:PISTA.x, z, nx:1, nz:0});
  const pista = new THREE.Mesh(cinta(P_, -PISTA.ancho/2, PISTA.ancho/2, '#6a6a72', 0.1, false), mat); pista.receiveShadow = true; mundo.add(pista);
  mundo.add(new THREE.Mesh(cinta(P_, -PISTA.ancho/2, -PISTA.ancho/2+0.7, '#ffffff', 0.14, false), mat));
  mundo.add(new THREE.Mesh(cinta(P_, PISTA.ancho/2-0.7, PISTA.ancho/2, '#ffffff', 0.14, false), mat));
  for (let i=0;i<P_.length-2;i+=3) mundo.add(new THREE.Mesh(cinta(P_.slice(i, i+2), -0.35, 0.35, '#ffffff', 0.15, false), mat));
  /* el muelle de madera con sus postes */
  const A = new Armador();
  const cx = (MUELLE.x0+MUELLE.x1)/2, cz = (MUELLE.z0+MUELLE.z1)/2, rot = Math.atan2(Math.cos(MUELLE.ang), Math.sin(MUELLE.ang));
  A.caja(MUELLE.ancho, 0.36, MUELLE.largo, '#a5713f', cx, MUELLE.alto-0.18, cz, 0, rot, 0);
  for (let i=0;i<=8;i++){
    const t = i/8, px = lerp(MUELLE.x0, MUELLE.x1, t), pz = lerp(MUELLE.z0, MUELLE.z1, t);
    for (const lado of [-1,1]){
      const ox = px - Math.sin(MUELLE.ang)*lado*(MUELLE.ancho/2-0.2), oz = pz + Math.cos(MUELLE.ang)*lado*(MUELLE.ancho/2-0.2);
      A.cil(0.16,0.16,5,'#7a4f2a', ox, MUELLE.alto-2.2, oz, 0,0,0,6);
      if (i%2===0) A.bola(0.2,'#e0c090', ox, MUELLE.alto+0.25, oz, 6);
    }
  }
  /* la rampa naranja con rayas blancas */
  const R = RAMPA, w = R.ancho/2, L = R.largo, hh = R.alto;
  const geoR = new THREE.BufferGeometry();
  const v = [
    /* piso */ -w,0,0,  w,0,0,  w,0,L,   -w,0,0,  w,0,L,  -w,0,L,
    /* tapa inclinada */ -w,0,0,  w,hh,L,  w,0,0,   -w,0,0,  -w,hh,L,  w,hh,L,
    /* pared de atrás */ -w,0,L,  w,hh,L,  -w,hh,L,   -w,0,L,  w,0,L,  w,hh,L,
    /* lados */ w,0,0,  w,hh,L,  w,0,L,    -w,0,0,  -w,0,L,  -w,hh,L,
  ];
  geoR.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  const cr = col('#ff7a1a'), colR = new Float32Array(v.length);
  for (let i=0;i<v.length/3;i++){ colR[i*3]=cr.r; colR[i*3+1]=cr.g; colR[i*3+2]=cr.b; }
  geoR.setAttribute('color', new THREE.BufferAttribute(colR, 3));
  geoR.computeVertexNormals();
  const M = new THREE.Matrix4().compose(new THREE.Vector3(R.x, R.base+0.02, R.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, R.ang, 0)), new THREE.Vector3(1,1,1));
  geoR.applyMatrix4(M);
  A.geos.push(geoR);
  for (let i=1;i<5;i++){ const t = i/5; A.caja(R.ancho-0.4, 0.08, 0.6, '#ffffff', R.x + R.tx*L*t, R.base + hh*t + 0.08, R.z + R.tz*L*t, -Math.atan2(hh, L), R.ang, 0); }
  /* el aro dorado sobre la rampa lo pone la lista de misiones */
  const m = A.malla(matMate()); mundo.add(m);
})();

/* ---------------- El pueblo ---------------- */
function techoGeo(w, d, alto){
  const s = new THREE.Shape(); s.moveTo(-w/2-0.6, 0); s.lineTo(w/2+0.6, 0); s.lineTo(0, alto); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {depth: d+1.2, bevelEnabled:false}); g.translate(0, 0, -(d+1.2)/2); return g;
}
const letreros = [];
(function construirPueblo(){
  const A = new Armador();
  for (const c of CASAS){
    const y = altura(c.x, c.z);
    A.caja(c.w, c.h, c.d, c.color, c.x, y + c.h/2, c.z);
    A.pieza(techoGeo(c.w, c.d, c.h*0.55), c.techo, c.x, y + c.h, c.z);
    A.caja(0.5, 0.9, 0.5, '#8a8a90', c.x + c.w*0.3, y + c.h + c.h*0.4, c.z + c.d*0.2);   /* la chimenea */
    /* la puerta hacia c.puerta y ventanas en los otros lados */
    const px = c.x + Math.sin(c.puerta)*(c.w/2), pz = c.z + Math.cos(c.puerta)*(c.d/2);
    const lados = [0, Math.PI/2, Math.PI, -Math.PI/2];
    for (const a of lados){
      const sx = Math.sin(a), sz = Math.cos(a), lx = a===0||a===Math.PI ? c.w : c.d;
      const bx = c.x + sx*(c.w/2), bz = c.z + sz*(c.d/2);
      const grueso = 0.16;
      if (Math.abs(envolver(a - c.puerta)) < 0.01){
        A.caja(a===0||a===Math.PI ? 1.3 : grueso, 2.2, a===0||a===Math.PI ? grueso : 1.3, '#6b3e1e', px + sx*grueso/2, y + 1.1, pz + sz*grueso/2);
        A.caja(a===0||a===Math.PI ? 0.16 : grueso+0.06, 0.16, a===0||a===Math.PI ? grueso+0.06 : 0.16, '#ffd23f', px + sx*grueso/2 + (a===0||a===Math.PI ? 0.4 : 0), y + 1.05, pz + sz*grueso/2 + (a===0||a===Math.PI ? 0 : 0.4));
      }
      for (const k of [-0.3, 0.3]){
        const wx = bx + (a===0||a===Math.PI ? k*lx : 0), wz = bz + (a===0||a===Math.PI ? 0 : k*lx);
        if (Math.abs(envolver(a - c.puerta)) < 0.01 && Math.abs(k) < 0.2) continue;
        A.caja(a===0||a===Math.PI ? 1.1 : grueso, 1.0, a===0||a===Math.PI ? grueso : 1.1, '#bfe9ff', wx + sx*grueso/2, y + c.h*0.55, wz + sz*grueso/2);
        A.caja(a===0||a===Math.PI ? 1.3 : grueso*1.3, 0.12, a===0||a===Math.PI ? grueso*1.3 : 1.3, '#ffffff', wx + sx*grueso/2, y + c.h*0.55 - 0.55, wz + sz*grueso/2);
      }
    }
    if (c.letrero){
      const sp = letrero((c.letrero==='BAR' ? '🍺 ' : '🍔 ')+c.letrero, '#fff', c.letrero==='BAR' ? 'rgba(90,40,120,0.9)' : 'rgba(200,60,30,0.9)', 1.6);
      sp.position.set(c.x, y + c.h + c.h*0.55 + 1.2, c.z); mundo.add(sp);
    }
    if (c.gasolinera){
      /* techito sobre postes y el surtidor rojo */
      const gx = c.x, gz = c.z + c.d/2 + 6;
      A.caja(12, 0.5, 7, '#ffffff', gx, y + 4.6, gz); A.caja(12.2, 0.5, 0.5, '#e63946', gx, y + 4.6, gz - 3.5); A.caja(12.2, 0.5, 0.5, '#e63946', gx, y + 4.6, gz + 3.5);
      for (const [ox,oz] of [[-5,-3],[5,-3],[-5,3],[5,3]]) A.cil(0.22,0.22,4.4,'#c8c8d0', gx+ox, y + 2.2, gz+oz, 0,0,0,8);
      A.caja(1.1, 1.8, 0.7, '#e63946', gx, y + 0.9, gz); A.caja(0.7, 0.5, 0.1, '#222', gx, y + 1.3, gz - 0.38); A.caja(0.25, 0.6, 0.25, '#222', gx + 0.6, y + 1.1, gz);
      const sp = letrero('⛽ GASOLINA', '#fff', 'rgba(220,50,40,0.92)', 1.6); sp.position.set(gx, y + 6.2, gz); mundo.add(sp);
    }
    if (c.nombre==='CASA DE FERNANDO'){
      const sp = letrero('🏠 CASA DE FERNANDO', '#ffe36e', 'rgba(20,20,60,0.85)', 1.8); sp.position.set(c.x, y + c.h*1.55 + 1.4, c.z); mundo.add(sp);
    }
    if (c.nombre==='CASA DE ABU'){ const sp = letrero('👵 CASA DE ABU', '#fff', 'rgba(40,80,160,0.85)', 1.6); sp.position.set(c.x, y + c.h*1.55 + 1.2, c.z); mundo.add(sp); }
    if (c.nombre==='HAMBURGUESERÍA'){
      /* la hamburguesa gigante del techo */
      const hg = hamburguesaGeo(); const mh = new THREE.Mesh(hg, matBrillo()); mh.scale.set(3.2,3.2,3.2); mh.position.set(c.x, y + c.h*1.55 + 1.6, c.z); mh.castShadow = true; mundo.add(mh); letreros.push({giro: mh});
    }
  }
  /* la fuente de la plaza */
  const fy = altura(FUENTE.x, FUENTE.z);
  A.cil(FUENTE.r, FUENTE.r+0.3, 0.9, '#d9d9e0', FUENTE.x, fy+0.45, FUENTE.z, 0,0,0,20);
  A.cil(FUENTE.r-0.4, FUENTE.r-0.4, 0.2, '#4fc3f7', FUENTE.x, fy+0.85, FUENTE.z, 0,0,0,20);
  A.cil(0.35,0.5,2.2,'#d9d9e0', FUENTE.x, fy+1.9, FUENTE.z, 0,0,0,10); A.bola(0.5,'#4fc3f7', FUENTE.x, fy+3.1, FUENTE.z, 8);
  for (let i=0;i<8;i++){ const a = i/8*6.283; A.caja(0.5,0.5,0.5,'#ff6ec0', FUENTE.x + Math.cos(a)*(FUENTE.r+0.9), fy+0.25, FUENTE.z + Math.sin(a)*(FUENTE.r+0.9)); }
  /* la cancha de fútbol con sus porterías */
  const cy = altura(CANCHA.x, CANCHA.z);
  A.caja(CANCHA.w, 0.12, CANCHA.d, '#4caf50', CANCHA.x, cy+0.06, CANCHA.z);
  A.caja(CANCHA.w, 0.14, 0.25, '#ffffff', CANCHA.x, cy+0.08, CANCHA.z - CANCHA.d/2); A.caja(CANCHA.w, 0.14, 0.25, '#ffffff', CANCHA.x, cy+0.08, CANCHA.z + CANCHA.d/2);
  A.caja(0.25, 0.14, CANCHA.d, '#ffffff', CANCHA.x - CANCHA.w/2, cy+0.08, CANCHA.z); A.caja(0.25, 0.14, CANCHA.d, '#ffffff', CANCHA.x + CANCHA.w/2, cy+0.08, CANCHA.z);
  A.caja(0.25, 0.14, CANCHA.d, '#ffffff', CANCHA.x, cy+0.08, CANCHA.z);
  A.pieza(new THREE.RingGeometry(3, 3.25, 24), '#ffffff', CANCHA.x, cy+0.09, CANCHA.z, -Math.PI/2, 0, 0);
  for (const lado of [-1,1]){
    const gx = CANCHA.x + lado*CANCHA.w/2;
    A.cil(0.1,0.1,2.2,'#ffffff', gx, cy+1.1, CANCHA.z-3, 0,0,0,6); A.cil(0.1,0.1,2.2,'#ffffff', gx, cy+1.1, CANCHA.z+3, 0,0,0,6);
    A.cil(0.1,0.1,6.2,'#ffffff', gx, cy+2.2, CANCHA.z, Math.PI/2,0,0,6);
  }
  A.bola(0.45,'#ffffff', CANCHA.x+2, cy+0.55, CANCHA.z+1, 8);
  /* el parque: tobogán, columpios y arenero */
  const py = altura(PARQUE.x, PARQUE.z);
  A.caja(1.2, 0.2, 5, '#ffd23f', PARQUE.x, py+1.5, PARQUE.z, -0.55, 0, 0); A.caja(1.4, 0.3, 1.4, '#ff6ec0', PARQUE.x, py+2.75, PARQUE.z-2.4);
  for (const [ox,oz] of [[-0.6,-2.4],[0.6,-2.4],[-0.6,-3.2],[0.6,-3.2]]) A.cil(0.08,0.08,2.8,'#2a6ad0', PARQUE.x+ox, py+1.4, PARQUE.z+oz, 0,0,0,6);
  for (let i=0;i<4;i++) A.caja(0.9, 0.08, 0.3, '#2a6ad0', PARQUE.x, py+0.4+i*0.55, PARQUE.z-2.8);
  const sx = PARQUE.x+6, sz = PARQUE.z-1;
  A.cil(0.12,0.12,3,'#2a9c3a', sx-2.5, py+1.5, sz, 0,0,0,6); A.cil(0.12,0.12,3,'#2a9c3a', sx+2.5, py+1.5, sz, 0,0,0,6); A.cil(0.1,0.1,5.2,'#2a9c3a', sx, py+3, sz, 0,0,Math.PI/2,6);
  for (const ox of [-1.1, 1.1]){ A.caja(0.9,0.12,0.4,'#e63946', sx+ox, py+0.9, sz); A.cil(0.03,0.03,2.1,'#dddddd', sx+ox-0.4, py+1.95, sz, 0,0,0,4); A.cil(0.03,0.03,2.1,'#dddddd', sx+ox+0.4, py+1.95, sz, 0,0,0,4); }
  A.caja(5, 0.3, 4, '#f2dfa6', PARQUE.x-6, py+0.15, PARQUE.z+2); A.caja(5.4, 0.5, 0.4, '#a5713f', PARQUE.x-6, py+0.25, PARQUE.z); A.caja(5.4, 0.5, 0.4, '#a5713f', PARQUE.x-6, py+0.25, PARQUE.z+4);
  A.caja(0.4, 0.5, 4.4, '#a5713f', PARQUE.x-8.5, py+0.25, PARQUE.z+2); A.caja(0.4, 0.5, 4.4, '#a5713f', PARQUE.x-3.5, py+0.25, PARQUE.z+2);
  const spP = letrero('🛝 PARQUE DE CUCÚ', '#fff', 'rgba(200,60,140,0.9)', 1.6); spP.position.set(PARQUE.x, py+5, PARQUE.z); mundo.add(spP);
  const spC = letrero('⚽ CANCHA', '#fff', 'rgba(30,120,60,0.9)', 1.6); spC.position.set(CANCHA.x, cy+5, CANCHA.z - CANCHA.d/2 - 2); mundo.add(spC);
  /* el hangar del aeropuerto, con su manga de viento */
  const hy = altura(HANGAR.x, HANGAR.z);
  A.caja(HANGAR.w, HANGAR.h*0.55, HANGAR.d, '#c9ced6', HANGAR.x, hy + HANGAR.h*0.275, HANGAR.z);
  A.pieza(new THREE.CylinderGeometry(HANGAR.w/2, HANGAR.w/2, HANGAR.d, 18, 1, true, Math.PI/2, Math.PI), '#e8a33d', HANGAR.x, hy + HANGAR.h*0.55, HANGAR.z, Math.PI/2, 0, 0);
  A.caja(HANGAR.w-1, HANGAR.h*0.55, 0.3, '#5a6270', HANGAR.x, hy + HANGAR.h*0.275, HANGAR.z + HANGAR.d/2 - 0.2);
  A.cil(0.1,0.1,8,'#ffffff', PISTA.x + 12, PISTA.h+4, PISTA.z1-6, 0,0,0,6); A.cono(0.7, 2.6, '#ff7a1a', PISTA.x + 12, PISTA.h+8, PISTA.z1-6, 8, 0, 0, -Math.PI/2);
  const spH = letrero('✈️ AEROPUERTO', '#fff', 'rgba(40,60,120,0.9)', 2); spH.position.set(HANGAR.x, hy + HANGAR.h + 2.5, HANGAR.z); mundo.add(spH);
  /* el faro de tía Giuliana */
  const fy2 = altura(FARO.x, FARO.z);
  A.cil(2.2, 2.8, 16, '#ffffff', FARO.x, fy2+8, FARO.z, 0,0,0,16);
  for (let i=0;i<3;i++) A.cil(2.45-i*0.12, 2.6-i*0.12, 1.6, '#e63946', FARO.x, fy2+3+i*5, FARO.z, 0,0,0,16);
  A.cil(2.6, 2.6, 0.5, '#8a8a90', FARO.x, fy2+16.2, FARO.z, 0,0,0,16);
  A.cil(1.6, 1.6, 2.4, '#bfe9ff', FARO.x, fy2+17.6, FARO.z, 0,0,0,12);
  A.cono(2.4, 2.2, '#e63946', FARO.x, fy2+19.9, FARO.z, 12);
  A.bola(0.6, '#fff6a0', FARO.x, fy2+17.6, FARO.z, 8);
  const spF = letrero('🗼 FARO', '#fff', 'rgba(200,50,50,0.9)', 1.6); spF.position.set(FARO.x, fy2+23, FARO.z); mundo.add(spF);
  /* la playa de tío Fran: sombrilla y toalla */
  const by = altura(PLAYA.x, PLAYA.z);
  A.cil(0.06,0.06,2.6,'#ffffff', PLAYA.x-4, by+1.3, PLAYA.z-2, 0,0,0,6); A.cono(2.2, 0.9, '#ff6ec0', PLAYA.x-4, by+2.9, PLAYA.z-2, 10);
  A.caja(2.2, 0.06, 3.4, '#ff7a1a', PLAYA.x-3.5, by+0.05, PLAYA.z+1); A.bola(0.6,'#e63946', PLAYA.x+3, by+0.6, PLAYA.z+2, 8);
  const spB = letrero('🏖️ PLAYA', '#fff', 'rgba(230,140,40,0.9)', 1.6); spB.position.set(PLAYA.x, by+5.5, PLAYA.z); mundo.add(spB);
  /* la islita de Santi: cartel */
  const spS = letrero('👶 ISLITA DE SANTI', '#fff', 'rgba(60,160,220,0.9)', 2); spS.position.set(ISLITA.x, altura(ISLITA.x, ISLITA.z)+6, ISLITA.z); mundo.add(spS);
  const spM = letrero('⚓ PUERTO', '#fff', 'rgba(30,80,140,0.9)', 1.6); spM.position.set(MUELLE.x0, MUELLE.alto+5, MUELLE.z0); mundo.add(spM);
  const spMo = letrero('🏔️ MONTAÑA', '#fff', 'rgba(90,90,110,0.9)', 2.4); spMo.position.set(MONTANA.x, altura(MONTANA.x, MONTANA.z)+10, MONTANA.z); mundo.add(spMo);
  const m = A.malla(matMate()); mundo.add(m);
})();

/* ---------------- Los bosques, las flores y las rocas (instanciados) ---------------- */
function instanciar(geo, material, datos, arma){
  const m = new THREE.InstancedMesh(geo, material, datos.length);
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), c = new THREE.Color();
  datos.forEach((d, i)=>{
    const a = arma(d);
    e.set(a.rx||0, a.ry||0, a.rz||0);
    M.compose(new THREE.Vector3(a.x, a.y, a.z), q.setFromEuler(e), new THREE.Vector3(a.sx||a.s||1, a.sy||a.s||1, a.sz||a.s||1));
    m.setMatrixAt(i, M);
    if (a.tinte !== undefined){ c.setHSL(0, 0, 1); c.setRGB(a.tinte, a.tinte, a.tinte); if (a.color) c.copy(a.color); m.setColorAt(i, c); }
  });
  m.castShadow = true; m.receiveShadow = true;
  mundo.add(m); return m;
}
(function plantarVista(){
  /* árbol redondo */
  let A = new Armador();
  A.cil(0.28,0.42,2.4,'#7a4f2a', 0,1.2,0, 0,0,0,6).bola(1.7,'#5db242', 0,3.4,0, 7).bola(1.3,'#6cc04a', 0.9,3.0,0.5, 6).bola(1.2,'#7fd15a', -0.8,3.1,-0.4, 6).bola(1.0,'#8fdc66', 0.1,4.4,-0.2, 6);
  instanciar(A.geo(), matMate(), DECOR.arboles, d=>({x:d.x, y:d.h-0.1, z:d.z, ry:d.rot, s:d.esc, tinte: 0.82 + d.tono*0.28}));
  /* pinos */
  A = new Armador();
  A.cil(0.22,0.32,2.2,'#5a3a1a', 0,1.1,0, 0,0,0,7).cono(2.0,3.0,'#2e7d32', 0,3.0,0, 9).cono(1.6,2.6,'#388e3c', 0,4.8,0, 9).cono(1.1,2.2,'#43a047', 0,6.4,0, 9);
  instanciar(A.geo(), matMate(), DECOR.pinos, d=>({x:d.x, y:d.h-0.1, z:d.z, ry:d.rot, s:d.esc, tinte: 0.9 + (d.esc-0.8)*0.3}));
  /* palmeras */
  A = new Armador();
  A.cil(0.22,0.34,6,'#a5713f', 0,3,0, 0,0,0,7);
  for (let i=0;i<6;i++){ const a = i/6*6.283; A.caja(3.2,0.08,0.9,'#43a047', Math.cos(a)*1.5, 6.1 - 0.3, Math.sin(a)*1.5, 0, -a, -0.45); }
  A.bola(0.3,'#6b3e1e', 0.4,5.7,0.2, 6).bola(0.3,'#6b3e1e', -0.3,5.6,0.3, 6).bola(0.3,'#6b3e1e', 0.1,5.5,-0.4, 6);
  instanciar(A.geo(), matMate(), DECOR.palmeras, d=>({x:d.x, y:d.h-0.1, z:d.z, ry:d.rot, rz:d.inclina, s:d.esc}));
  /* rocas */
  instanciar(new THREE.DodecahedronGeometry(1, 0), new THREE.MeshLambertMaterial({color: lin(0x9a9a9a)}), DECOR.rocas,
    d=>({x:d.x, y:d.h + 0.2*d.esc, z:d.z, ry:d.rot, rx:d.rot*0.3, sx:d.esc*1.3, sy:d.esc*0.8, sz:d.esc, tinte:1, color: d.agua ? lin(0x6a8aa0) : lin(0x9a9a9a).multiplyScalar(0.8+ (d.rot%1)*0.3)}));
  /* matas de pasto y flores: no chocan, solo adornan */
  semilla = 999;
  const pasto = [], flores = [];
  for (let i=0;i<14000 && pasto.length<3600;i++){
    const x = (azar()-0.5)*760, z = (azar()-0.5)*760, h = altura(x, z);
    if (h < 2.0 || h > 32) continue;
    if (cercaRuta(x,z).d < 6 || distPista(x,z) < 12 || enMuelle(x,z) || enRampa(x,z) >= 0) continue;
    let libre = true; for (const s of SOLARES) if (Math.hypot(x-s.x, z-s.z) < s.r) { libre = false; break; }
    if (!libre) continue;
    if (azar() < 0.22) flores.push({x, z, h, rot:azar()*6.28, c:Math.floor(azar()*5), esc:0.8+azar()*0.6});
    else pasto.push({x, z, h, rot:azar()*6.28, esc:0.7+azar()*0.7, tono:azar()});
  }
  A = new Armador();
  A.cono(0.14,0.8,'#6cc04a', 0,0.4,0, 4).cono(0.12,0.65,'#7fd15a', 0.18,0.32,0.05, 4, 0,0,-0.35).cono(0.12,0.6,'#5db242', -0.16,0.3,-0.06, 4, 0,0,0.35);
  const mp = instanciar(A.geo(), matMate(), pasto, d=>({x:d.x, y:d.h, z:d.z, ry:d.rot, s:d.esc, tinte:0.85+d.tono*0.3}));
  mp.castShadow = false;
  A = new Armador();
  A.cil(0.03,0.03,0.6,'#43a047', 0,0.3,0, 0,0,0,4).bola(0.16,'#ffffff', 0,0.62,0, 6);
  const coloresF = [lin(0xff6ec0), lin(0xffd23f), lin(0xff7a1a), lin(0xffffff), lin(0xb39ddb)];
  const mf = instanciar(A.geo(), matMate(), flores, d=>({x:d.x, y:d.h, z:d.z, ry:d.rot, s:d.esc, tinte:1, color:coloresF[d.c]}));
  mf.castShadow = false;
})();

/* ---------------- El fondo del mar: algas, corales, peces y el cofre ---------------- */
const peces = (()=>{
  const A = new Armador();
  A.bola(0.5,'#ffffff', 0,0,0, 8, 0.7,0.9,1.4).cono(0.35,0.7,'#ffffff', 0,0,-0.95, 4, -Math.PI/2,0,0).caja(0.06,0.08,0.08,'#222', 0.22,0.1,0.45).caja(0.06,0.08,0.08,'#222', -0.22,0.1,0.45);
  const m = new THREE.InstancedMesh(A.geo(), new THREE.MeshLambertMaterial({vertexColors:true}), 110);
  m.datos = []; semilla = 31337;
  const colores = [lin(0xff7a1a), lin(0xffd23f), lin(0x4fc3f7), lin(0xff6ec0), lin(0x7dffa0), lin(0xb39ddb), lin(0xffffff)];
  const c = new THREE.Color();
  for (let i=0;i<110;i++){
    let cx, cz; do { cx = (azar()-0.5)*1000; cz = (azar()-0.5)*1000; } while (altura(cx, cz) > -6);
    const d = {cx, cz, r: 6+azar()*20, y: altura(cx,cz)*0.5 - 2 - azar()*6, a: azar()*6.28, v:(0.3+azar()*0.5)*(azar()<0.5?1:-1), esc:0.8+azar()*1.4, fase:azar()*6.28};
    d.y = Math.max(altura(cx,cz)+2.5, Math.min(-2, d.y));
    m.datos.push(d);
    m.setColorAt(i, c.copy(colores[i%colores.length]));
  }
  m.frustumCulled = false; mundo.add(m); return m;
})();
function pasoPeces(){
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  peces.datos.forEach((d,i)=>{
    d.a += d.v*DT; d.fase += DT*6;
    const x = d.cx + Math.cos(d.a)*d.r, z = d.cz + Math.sin(d.a)*d.r, y = d.y + Math.sin(d.fase*0.5)*0.6;
    const rumbo = Math.atan2(-Math.sin(d.a)*d.v, Math.cos(d.a)*d.v);
    e.set(0, rumbo, 0);
    M.compose(new THREE.Vector3(x,y,z), q.setFromEuler(e), new THREE.Vector3(d.esc, d.esc, d.esc*(1+Math.sin(d.fase)*0.06)));
    peces.setMatrixAt(i, M);
  });
  peces.instanceMatrix.needsUpdate = true;
}
const algas = (()=>{
  semilla = 2024;
  const datos = [];
  for (let i=0;i<4000 && datos.length<420;i++){ const x = (azar()-0.5)*1100, z = (azar()-0.5)*1100, h = altura(x,z); if (h > -3.5 || h < -40) continue; datos.push({x, z, h, rot:azar()*6.28, esc:0.7+azar()*1.4, fase:azar()*6.28}); }
  const A = new Armador();
  A.cono(0.35,3.2,'#2e9e5e', 0,1.6,0, 5).cono(0.25,2.6,'#3cb371', 0.5,1.3,0.2, 5, 0,0,-0.2).cono(0.25,2.2,'#2e9e5e', -0.45,1.1,-0.2, 5, 0,0,0.22);
  const m = instanciar(A.geo(), matMate(), datos, d=>({x:d.x, y:d.h, z:d.z, ry:d.rot, s:d.esc}));
  m.castShadow = false; m.datos = datos; return m;
})();
function pasoAlgas(){
  if (tick % 2) return;
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), t = tick*DT;
  algas.datos.forEach((d,i)=>{ e.set(Math.sin(t*1.3+d.fase)*0.12, d.rot, Math.cos(t*1.1+d.fase)*0.12); M.compose(new THREE.Vector3(d.x,d.h,d.z), q.setFromEuler(e), new THREE.Vector3(d.esc,d.esc,d.esc)); algas.setMatrixAt(i, M); });
  algas.instanceMatrix.needsUpdate = true;
}
(function corales(){
  semilla = 555;
  const datos = [];
  for (let i=0;i<3000 && datos.length<260;i++){ const x = (azar()-0.5)*1100, z = (azar()-0.5)*1100, h = altura(x,z); if (h > -4 || h < -38) continue; datos.push({x, z, h, rot:azar()*6.28, esc:0.6+azar()*1.5, c:Math.floor(azar()*5)}); }
  const A = new Armador();
  A.bola(0.8,'#ffffff', 0,0.5,0, 7).bola(0.6,'#ffffff', 0.7,0.9,0.2, 6).bola(0.5,'#ffffff', -0.6,0.8,-0.3, 6).cil(0.18,0.25,1.6,'#ffffff', 0.2,1.3,-0.5, 0.3,0,0.2,6).cil(0.15,0.2,1.3,'#ffffff', -0.4,1.2,0.4, -0.3,0,-0.2,6);
  const colores = [lin(0xff6ec0), lin(0xff7a1a), lin(0xb39ddb), lin(0xffd23f), lin(0x4fc3f7)];
  const m = instanciar(A.geo(), matMate(), datos, d=>({x:d.x, y:d.h, z:d.z, ry:d.rot, s:d.esc, tinte:1, color:colores[d.c]}));
  m.castShadow = false;
})();
const cofre = (()=>{
  const g = new THREE.Group(), y = altura(COFRE.x, COFRE.z);
  const A = new Armador();
  A.caja(2.4,1.3,1.5,'#8b5a2b', 0,0.65,0).caja(2.5,0.16,1.6,'#4a3018', 0,0.16,0).caja(2.5,0.16,1.6,'#4a3018', 0,1.2,0).caja(0.3,1.3,1.6,'#4a3018', 0,0.65,0);
  A.caja(2.4,0.7,1.5,'#8b5a2b', 0,1.65,-0.9, -1.1,0,0).caja(0.3,0.5,0.3,'#ffd23f', 0,1.2,0.78);
  for (let i=0;i<14;i++) A.bola(0.2,'#ffd23f', (azar()-0.5)*1.8, 1.35+azar()*0.35, (azar()-0.5)*1.0, 6);
  A.bola(0.28,'#ff4060', 0.5,1.55,0.2, 6).bola(0.25,'#4fc3f7', -0.6,1.5,-0.1, 6);
  const m = A.malla(matBrillo()); g.add(m);
  const haz = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.6, -y+2, 12, 1, true), new THREE.MeshBasicMaterial({color:0xfff2a0, transparent:true, opacity:0.16, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide}));
  haz.position.y = (-y+2)/2; g.add(haz);
  g.position.set(COFRE.x, y, COFRE.z); g.rotation.y = 0.6;
  mundo.add(g); g.haz = haz; return g;
})();

/* ---------------- Los objetos de las misiones: aros, banderas, baños ---------------- */
const arosMesh = AROS.map((a, i)=>{
  const m = new THREE.Mesh(new THREE.TorusGeometry(a.r, 0.55, 10, 30), new THREE.MeshPhongMaterial({color: lin(0xffd23f), emissive: lin(0x8a6a00), shininess: 80}));
  m.position.set(a.x, a.y, a.z); m.castShadow = false;
  const nudo = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xffe36e, transparent:true, opacity:0.5, depthWrite:false, blending:THREE.AdditiveBlending}));
  nudo.scale.set(a.r*1.6, a.r*1.6, 1); m.add(nudo);
  const num = letrero(String(i+1), '#fff', 'rgba(200,120,0,0.9)', 2.2); num.position.y = a.r + 2.5; m.add(num);
  mundo.add(m); return m;
});
const aroRampa = (()=>{
  const a = RAMPA.aro;
  const m = new THREE.Mesh(new THREE.TorusGeometry(a.r, 0.45, 10, 30), new THREE.MeshPhongMaterial({color: lin(0xffd23f), emissive: lin(0x8a6a00), shininess: 80}));
  m.position.set(a.x, a.y, a.z); m.rotation.y = RAMPA.ang; mundo.add(m); return m;
})();
const banderasMesh = BANDERAS.map(b=>{
  const g = new THREE.Group(), y = altura(b.x, b.z);
  const A = new Armador();
  const rot = Math.atan2(b.tx, b.tz);
  for (const lado of [-1, 1]){ A.cil(0.16,0.16,6.5,'#e8e8ea', b.nx*lado*6.6, y+3.25, b.nz*lado*6.6, 0,0,0,8); A.bola(0.3,'#e63946', b.nx*lado*6.6, y+6.6, b.nz*lado*6.6, 6); }
  A.caja(13.6, 1.0, 0.16, '#ffffff', b.x*0, y+6.0, b.z*0, 0, rot, 0);
  const geoP = A.geo(); geoP.translate(0,0,0);
  const postes = new THREE.Mesh(geoP, matMate()); g.add(postes);
  const tex = texturaCuadros('#e63946', '#ffffff', 8); tex.repeat.set(6, 1);
  const cartel = new THREE.Mesh(new THREE.PlaneGeometry(13.4, 0.9), new THREE.MeshLambertMaterial({map: tex, side: THREE.DoubleSide}));
  cartel.position.set(b.nx*0 + Math.sin(rot)*0.1, y+6.0, Math.cos(rot)*0.1); cartel.rotation.y = rot; g.add(cartel);
  const ban = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshLambertMaterial({color: lin(0xe63946), side: THREE.DoubleSide}));
  ban.position.set(b.nx*6.6 + Math.sin(rot+Math.PI/2)*0.8*0, y+6.9, b.nz*6.6); ban.rotation.y = rot; g.add(ban); g.bandera = ban;
  g.position.set(b.x, 0, b.z);
  mundo.add(g); g.cartel = cartel; return g;
});
const banosMesh = BANOS.map(b=>{
  const g = new THREE.Group(), y = altura(b.x, b.z);
  const A = new Armador();
  A.caja(2.2, 2.7, 2.2, '#8fd3ff', 0, 1.35, 0).caja(2.5, 0.2, 2.5, '#2a6ad0', 0, 2.8, 0, 0.18, 0, 0).caja(0.2, 2.7, 0.2, '#2a6ad0', 1.05, 1.35, 1.05).caja(0.2, 2.7, 0.2, '#2a6ad0', -1.05, 1.35, 1.05)
   .caja(0.2, 2.7, 0.2, '#2a6ad0', 1.05, 1.35, -1.05).caja(0.2, 2.7, 0.2, '#2a6ad0', -1.05, 1.35, -1.05).cil(0.3,0.3,0.8,'#8a8a90', 0.6, 3.3, -0.5, 0,0,0,8);
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  /* la puerta gira sobre su bisagra */
  const bis = new THREE.Group(); bis.position.set(-0.55, 0, 1.12);
  const P2 = new Armador();
  P2.caja(1.1, 2.2, 0.12, '#2a6ad0', 0.55, 1.1, 0).caja(0.12, 0.12, 0.2, '#ffd23f', 0.95, 1.1, 0.1).bola(0.16, '#ffffff', 0.55, 1.75, 0.07, 6);
  bis.add(P2.malla(matMate())); g.add(bis); g.puerta = bis;
  const sp = letrero('🚽 BAÑO', '#fff', 'rgba(30,90,180,0.92)', 1.4); sp.position.set(0, 3.9, 0); g.add(sp);
  g.position.set(b.x, y, b.z); g.rotation.y = b.ang;
  g.puertaObj = 0;
  mundo.add(g); return g;
});

/* ---------------- Las hamburguesas y la estrella ---------------- */
function hamburguesaGeo(){
  const A = new Armador();
  A.cil(0.52,0.46,0.22,'#e8a44a', 0,0.11,0, 0,0,0,14).cil(0.55,0.55,0.16,'#6b3e1e', 0,0.30,0, 0,0,0,14).caja(1.0,0.06,1.0,'#ffd23f', 0,0.41,0, 0,0.6,0)
   .cil(0.62,0.6,0.1,'#43a047', 0,0.47,0, 0,0,0,10).cil(0.5,0.5,0.1,'#e63946', 0,0.56,0, 0,0,0,12)
   .bola(0.56,'#f0b050', 0,0.62,0, 12, 1,0.72,1).caja(0.06,0.03,0.09,'#fff8e0', 0.2,1.0,0.1).caja(0.06,0.03,0.09,'#fff8e0', -0.15,1.0,-0.2).caja(0.06,0.03,0.09,'#fff8e0', 0.05,1.02,0.3).caja(0.06,0.03,0.09,'#fff8e0', -0.25,0.97,0.15);
  return A.geo();
}
const geoHamb = hamburguesaGeo();
const matHamb = matBrillo();
const hambMesh = HAMBURGUESAS.map(h=>{
  const m = new THREE.Mesh(geoHamb, matHamb); m.scale.set(1.4,1.4,1.4); m.position.set(h.x, h.y, h.z); m.castShadow = true;
  const brillo = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xffe9a0, transparent:true, opacity:0.45, depthWrite:false, blending:THREE.AdditiveBlending}));
  brillo.scale.set(2.2,2.2,1); brillo.position.y = 0.5; m.add(brillo);
  mundo.add(m); return m;
});
function estrellaGeo(){
  const s = new THREE.Shape();
  for (let i=0;i<10;i++){ const r = i%2 ? 0.42 : 1, a = i/10*Math.PI*2 - Math.PI/2; if (i===0) s.moveTo(Math.cos(a)*r, Math.sin(a)*r); else s.lineTo(Math.cos(a)*r, Math.sin(a)*r); }
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {depth:0.3, bevelEnabled:true, bevelThickness:0.08, bevelSize:0.08, bevelSegments:2}); g.center(); return g;
}
const geoEstrella = estrellaGeo();
const matEstrella = new THREE.MeshPhongMaterial({color: lin(0xffd23f), emissive: lin(0x7a5a00), shininess: 90});

/* ---------------- Partículas: polvo, chispas, burbujas, nubes de peo, confeti ---------------- */
const particulas = [];
const geoPart = new THREE.SphereGeometry(1, 6, 5), geoConf = new THREE.BoxGeometry(1, 0.2, 0.6);
const matParts = {};
function matPart(color, alfa, aditivo){
  const k = color+'/'+alfa+'/'+(aditivo?1:0);
  if (!matParts[k]) matParts[k] = new THREE.MeshBasicMaterial({color: lin(color), transparent: alfa < 1, opacity: alfa, depthWrite: alfa >= 1, blending: aditivo ? THREE.AdditiveBlending : THREE.NormalBlending});
  return matParts[k];
}
function particula(x,y,z, color, vx,vy,vz, vida, tam, opciones){
  if (particulas.length > 420) return;
  const o = opciones||{};
  const m = new THREE.Mesh(o.confeti ? geoConf : geoPart, matPart(color, o.alfa===undefined ? 1 : o.alfa, o.aditivo));
  m.position.set(x,y,z); m.scale.setScalar(tam);
  if (o.confeti) m.rotation.set(azar()*3, azar()*3, azar()*3);
  scene.add(m);
  particulas.push({m, vx, vy, vz, vida, vida0: vida, tam, crece: o.crece||0, grav: o.grav===undefined ? 0 : o.grav, confeti: !!o.confeti, flota: !!o.flota});
}
function pasoParticulas(){
  for (let i=particulas.length-1;i>=0;i--){
    const p = particulas[i];
    p.vida--;
    p.vy -= p.grav*DT;
    p.m.position.x += p.vx*DT; p.m.position.y += p.vy*DT; p.m.position.z += p.vz*DT;
    if (p.flota){ p.vx *= 0.97; p.vz *= 0.97; if (p.m.position.y > NIVEL_MAR) p.vida = Math.min(p.vida, 2); }
    if (p.confeti){ p.m.rotation.x += 0.15; p.m.rotation.z += 0.1; p.vx *= 0.98; p.vz *= 0.98; }
    const f = p.vida/p.vida0;
    p.m.scale.setScalar(p.tam*(p.crece ? (1 + (1-f)*p.crece) : (0.3 + 0.7*f)));
    /* una partícula pegada a la cámara taparía media pantalla: se esconde */
    p.m.visible = p.m.position.distanceToSquared(camera.position) > 9;
    if (p.vida <= 0){ scene.remove(p.m); particulas.splice(i, 1); }
  }
}
function nubePeo(x, y, z, grande){
  const n = grande ? 16 : 8;
  for (let i=0;i<n;i++) particula(x + (azar()-0.5), y + 0.6 + azar()*0.6, z + (azar()-0.5), i%2 ? '#8fd44a' : '#b8ec6a', (azar()-0.5)*3, 0.8+azar()*1.5, (azar()-0.5)*3, 50+azar()*40, 0.35+azar()*0.4, {alfa:0.55, crece: grande ? 3.5 : 2.2});
}
function chispas(x, y, z, color, n, fuerza){
  for (let i=0;i<n;i++){ const a = azar()*6.28, b = azar()*3.14; const f = fuerza||6; particula(x, y, z, color, Math.cos(a)*Math.sin(b)*f*azar(), Math.abs(Math.cos(b))*f*azar()+2, Math.sin(a)*Math.sin(b)*f*azar(), 30+azar()*30, 0.12+azar()*0.15, {grav:12, aditivo:true, alfa:0.9}); }
}
function confeti(x, y, z, n){
  const cs = ['#e63946','#ffd23f','#4fc3f7','#7dffa0','#ff6ec0','#ffffff'];
  for (let i=0;i<n;i++) particula(x + (azar()-0.5)*3, y + 2 + azar()*3, z + (azar()-0.5)*3, cs[i%cs.length], (azar()-0.5)*6, 2+azar()*6, (azar()-0.5)*6, 90+azar()*60, 0.16+azar()*0.12, {grav:5, confeti:true});
}

/* ---------------- Los personajes: cajitas con brazos y piernas que se mueven ----------------
   Cada uno mira hacia +z y tiene los pies en el origen. */
const PIEL = '#ffc8a0';
function extremidad(w, h, d, color, pie, colorPie){
  const A = new Armador();
  A.caja(w, h, d, color, 0, -h/2, 0);
  if (pie) A.caja(w+0.04, 0.14, d+0.12, colorPie||'#3a2a1a', 0, -h+0.05, 0.05);
  else A.caja(w*0.8, w*0.8, w*0.8, colorPie||PIEL, 0, -h-0.02, 0);
  return A.malla(matMate());
}
function armarPersona(id){
  const g = new THREE.Group();
  const A = new Armador();
  const R = {};
  const torso = (color, alto)=>{ A.caja(0.62, alto||0.7, 0.38, color, 0, 0.72+(alto||0.7)/2, 0); };
  const falda = (color)=>{ A.cil(0.3, 0.5, 0.5, color, 0, 0.62, 0, 0,0,0,10); };
  const cabeza = (piel)=>{
    A.caja(0.56, 0.56, 0.56, piel||PIEL, 0, 1.76, 0);
    A.caja(0.1, 0.13, 0.06, '#222', -0.13, 1.82, 0.28); A.caja(0.1, 0.13, 0.06, '#222', 0.13, 1.82, 0.28);
    A.caja(0.04, 0.05, 0.06, '#fff', -0.11, 1.85, 0.3); A.caja(0.04, 0.05, 0.06, '#fff', 0.15, 1.85, 0.3);
    A.caja(0.2, 0.05, 0.04, '#b0483a', 0, 1.63, 0.29);
    A.caja(0.08, 0.08, 0.04, '#ffa0a0', -0.22, 1.7, 0.28); A.caja(0.08, 0.08, 0.04, '#ffa0a0', 0.22, 1.7, 0.28);
  };
  const gorra = (color)=>{ A.caja(0.6, 0.2, 0.6, color, 0, 2.12, 0); A.caja(0.5, 0.06, 0.34, color, 0, 2.06, 0.42); };
  const pelo = (color, alto)=>{ A.caja(0.6, alto||0.16, 0.6, color, 0, 2.08, 0); A.caja(0.6, 0.4, 0.12, color, 0, 1.86, -0.26); };
  const melena = (color)=>{ pelo(color, 0.2); A.caja(0.14, 0.62, 0.5, color, -0.34, 1.6, -0.06); A.caja(0.14, 0.62, 0.5, color, 0.34, 1.6, -0.06); A.caja(0.6, 0.7, 0.2, color, 0, 1.55, -0.32); };
  const bigote = ()=>{ A.caja(0.34, 0.08, 0.08, '#3a2a1a', 0, 1.66, 0.3); };
  const barba = (color)=>{ A.caja(0.5, 0.14, 0.1, color||'#3a2a1a', 0, 1.52, 0.28); };
  const lentes = ()=>{ A.caja(0.56, 0.14, 0.06, '#1a1a1a', 0, 1.82, 0.31); A.caja(0.16, 0.1, 0.07, '#8ecbff', -0.13, 1.82, 0.32); A.caja(0.16, 0.1, 0.07, '#8ecbff', 0.13, 1.82, 0.32); };
  let ropa = '#d82800', piel = PIEL, esc = 1, brazoColor = null;
  switch(id){
    case 'fernando': ropa = '#d82800'; torso(ropa); A.caja(0.64, 0.34, 0.4, '#2038ec', 0, 0.9, 0); A.caja(0.1, 0.5, 0.06, '#2038ec', -0.2, 1.2, 0.2); A.caja(0.1, 0.5, 0.06, '#2038ec', 0.2, 1.2, 0.2);
      cabeza(); gorra('#d82800'); A.caja(0.16, 0.14, 0.04, '#fff', 0, 2.12, 0.31); A.caja(0.58, 0.06, 0.58, '#5a3418', 0, 2.0, 0); esc = 0.8; break;
    case 'cucu': ropa = '#ff6ec0'; torso(ropa); falda(ropa); cabeza(); pelo('#3b2410'); A.caja(0.18, 0.5, 0.18, '#3b2410', -0.42, 1.7, 0); A.caja(0.18, 0.5, 0.18, '#3b2410', 0.42, 1.7, 0);
      A.bola(0.1, '#ff6ec0', -0.42, 1.98, 0, 6); A.bola(0.1, '#ff6ec0', 0.42, 1.98, 0, 6); esc = 0.74; break;
    case 'luca': ropa = '#ffe36e'; piel = '#e8b088'; torso(ropa); cabeza(piel); gorra('#2a9c3a'); esc = 0.76; break;
    case 'salomon': ropa = '#d86a28'; piel = '#c88a5a'; torso(ropa); cabeza(piel); lentes();
      for (const [x,z] of [[-0.2,-0.2],[0.2,-0.2],[-0.2,0.2],[0.2,0.2],[0,0],[0,-0.3],[0.3,0],[-0.3,0]]) A.bola(0.17, '#2a1a0a', x, 2.08, z, 6); esc = 0.76; break;
    case 'tiojuan': ropa = '#1560d0'; torso(ropa); cabeza(); pelo('#222'); A.caja(0.26, 0.26, 0.05, '#ffe36e', 0, 1.15, 0.21); A.caja(0.1, 0.16, 0.05, '#d82800', 0, 1.15, 0.24);
      A.caja(0.66, 0.16, 0.42, '#d82800', 0, 0.76, 0); esc = 1.0; break;
    case 'nacho': ropa = '#ffe36e'; piel = '#d8a070'; torso(ropa); cabeza(piel); bigote(); A.cil(0.72, 0.72, 0.06, '#e8a33d', 0, 2.06, 0, 0,0,0,14); A.cil(0.34, 0.38, 0.34, '#e8a33d', 0, 2.24, 0, 0,0,0,10); break;
    case 'yanny': ropa = '#40c0b0'; torso(ropa); falda(ropa); cabeza(); melena('#7a3aa8'); esc = 0.95; break;
    case 'tiofran': ropa = '#8a6a3a'; torso(ropa); cabeza(); pelo('#3a2a1a'); bigote(); break;
    case 'romulo': ropa = '#b8b8c8'; piel = '#9a9aae'; torso(ropa); A.caja(0.58, 0.56, 0.56, piel, 0, 1.76, 0); A.caja(0.6, 0.18, 0.06, '#2a2a34', 0, 1.84, 0.28);
      A.caja(0.1, 0.1, 0.06, '#fff', -0.13, 1.84, 0.31); A.caja(0.1, 0.1, 0.06, '#fff', 0.13, 1.84, 0.31);
      A.caja(0.16, 0.16, 0.14, piel, -0.26, 2.08, 0); A.caja(0.16, 0.16, 0.14, piel, 0.26, 2.08, 0); A.caja(0.2, 0.14, 0.2, '#3a3a44', 0, 1.62, 0.32);
      A.caja(0.16, 0.7, 0.16, piel, 0, 0.7, -0.35, 0.7, 0, 0); A.caja(0.18, 0.12, 0.18, '#3a3a44', 0, 0.95, -0.55);
      brazoColor = piel; break;
    case 'abu': ropa = '#7b4fa8'; torso(ropa); falda(ropa); cabeza(); pelo('#cfcfcf'); A.bola(0.2, '#cfcfcf', 0, 2.24, -0.1, 6); lentes(); esc = 0.92; break;
    case 'mama': ropa = '#ff6ea8'; torso(ropa); falda(ropa); cabeza(); melena('#5a3418'); A.caja(0.22, 0.07, 0.04, '#e0304a', 0, 1.63, 0.3); esc = 0.96; break;
    case 'papa': ropa = '#2a6ad0'; torso(ropa); cabeza(); gorra('#1560d0'); barba('#8a5a3a'); esc = 1.04; break;
    case 'beto': ropa = '#2a9c6a'; piel = '#e8b088'; torso(ropa); cabeza(piel); pelo('#2a2a2a'); lentes(); barba(); break;
    case 'giuliana': ropa = '#ff8a3d'; torso(ropa); falda(ropa); cabeza(); melena('#7a4a1a'); esc = 0.95; break;
    case 'santi': ropa = '#9bd1ff'; torso(ropa, 0.5); A.caja(0.7, 0.7, 0.7, PIEL, 0, 1.6, 0); A.caja(0.12, 0.14, 0.06, '#222', -0.15, 1.66, 0.35); A.caja(0.12, 0.14, 0.06, '#222', 0.15, 1.66, 0.35);
      A.caja(0.1, 0.1, 0.05, '#ffa0a0', -0.28, 1.52, 0.35); A.caja(0.1, 0.1, 0.05, '#ffa0a0', 0.28, 1.52, 0.35); A.cil(0.12, 0.12, 0.1, '#ff6ec0', 0, 1.46, 0.38, Math.PI/2, 0, 0, 8); A.bola(0.08, '#ffd23f', 0, 1.46, 0.46, 6);
      A.caja(0.2, 0.12, 0.2, '#5a3418', 0, 2.0, 0); esc = 0.55; break;
    default: torso(ropa); cabeza(); pelo('#3a2a1a');
  }
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  const bI = extremidad(0.18, 0.62, 0.18, brazoColor||ropa, false, piel), bD = extremidad(0.18, 0.62, 0.18, brazoColor||ropa, false, piel);
  bI.position.set(-0.4, 1.36, 0); bD.position.set(0.4, 1.36, 0);
  const pI = extremidad(0.24, 0.7, 0.26, id==='cucu'||id==='yanny'||id==='abu'||id==='mama'||id==='giuliana' ? PIEL : id==='fernando' ? '#2038ec' : id==='romulo' ? piel : '#3a4a8a', true, id==='fernando' ? '#5a3418' : '#2a2a2a');
  const pD = extremidad(0.24, 0.7, 0.26, id==='cucu'||id==='yanny'||id==='abu'||id==='mama'||id==='giuliana' ? PIEL : id==='fernando' ? '#2038ec' : id==='romulo' ? piel : '#3a4a8a', true, id==='fernando' ? '#5a3418' : '#2a2a2a');
  pI.position.set(-0.16, 0.72, 0); pD.position.set(0.16, 0.72, 0);
  g.add(bI, bD, pI, pD);
  const cuerpoG = new THREE.Group(); g.add(cuerpoG);
  let capa = null;
  if (id==='tiojuan'){
    capa = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.3, 1, 4), new THREE.MeshLambertMaterial({color: lin(0xd82800), side: THREE.DoubleSide}));
    capa.position.set(0, 0.85, -0.22); capa.castShadow = true; g.add(capa);
  }
  g.scale.setScalar(esc);
  g.partes = {cuerpo, bI, bD, pI, pD, capa};
  g.esc = esc; g.fase = azar()*6.28;
  return g;
}
function armarPerro(color){
  const g = new THREE.Group(), A = new Armador();
  A.caja(0.5, 0.42, 0.9, color, 0, 0.7, 0).caja(0.46, 0.44, 0.46, color, 0, 1.05, 0.5).caja(0.26, 0.22, 0.3, color, 0, 0.94, 0.85)
   .caja(0.12, 0.12, 0.12, '#222', 0, 1.0, 1.0).caja(0.08, 0.1, 0.06, '#fff', -0.13, 1.14, 0.72).caja(0.08, 0.1, 0.06, '#fff', 0.13, 1.14, 0.72)
   .caja(0.05, 0.06, 0.05, '#222', -0.13, 1.14, 0.75).caja(0.05, 0.06, 0.05, '#222', 0.13, 1.14, 0.75)
   .caja(0.14, 0.34, 0.14, color, -0.24, 1.14, 0.42, 0,0,0.3).caja(0.14, 0.34, 0.14, color, 0.24, 1.14, 0.42, 0,0,-0.3)
   .caja(0.16, 0.06, 0.08, '#ff5060', 0, 0.82, 1.0)
   .caja(0.3, 0.12, 0.12, '#e63946', 0, 0.86, 0.5);
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  const cola = new Armador().caja(0.1, 0.1, 0.42, color, 0, 0.1, -0.2).malla(matMate()); cola.position.set(0, 0.86, -0.42); g.add(cola);
  const patas = [];
  for (const [x,z] of [[-0.17,0.32],[0.17,0.32],[-0.17,-0.32],[0.17,-0.32]]){
    const p = new Armador().caja(0.14, 0.5, 0.16, color, 0, -0.25, 0).caja(0.16, 0.08, 0.2, '#3a2a1a', 0, -0.48, 0.02).malla(matMate());
    p.position.set(x, 0.5, z); g.add(p); patas.push(p);
  }
  g.partes = {cuerpo, cola, patas}; g.fase = azar()*6.28; g.scale.setScalar(0.9);
  return g;
}
function armarSrPopo(){
  const g = new THREE.Group(), A = new Armador();
  const cafe = '#7a4a1e', claro = '#95602a';
  A.bola(0.88, cafe, 0, 0.7, 0, 12, 1, 0.78, 1).bola(0.7, claro, 0.04, 1.3, 0.06, 12, 1, 0.85, 1).bola(0.5, cafe, 0.02, 1.82, 0.1, 10)
   .cono(0.3, 0.6, claro, 0.12, 2.3, 0.18, 8, 0, 0, -0.35)
   .bola(0.18, '#ffffff', -0.22, 1.42, 0.62, 8).bola(0.18, '#ffffff', 0.22, 1.42, 0.62, 8).bola(0.08, '#111', -0.2, 1.42, 0.78, 6).bola(0.08, '#111', 0.24, 1.42, 0.78, 6)
   .caja(0.4, 0.07, 0.06, '#3a1a08', 0, 1.14, 0.72).caja(0.08, 0.14, 0.06, '#3a1a08', -0.22, 1.19, 0.7).caja(0.08, 0.14, 0.06, '#3a1a08', 0.22, 1.19, 0.7)
   .bola(0.09, '#ff9aa0', -0.4, 1.28, 0.58, 6).bola(0.09, '#ff9aa0', 0.42, 1.28, 0.58, 6)
   .cil(0.5, 0.5, 0.06, '#111', 0.02, 2.1, 0.1, 0,0,0,14).cil(0.34, 0.34, 0.62, '#111', 0.02, 2.44, 0.1, 0,0,0,12).cil(0.35, 0.35, 0.12, '#e63946', 0.02, 2.2, 0.1, 0,0,0,12)
   .caja(0.16, 0.16, 0.08, '#e63946', -0.12, 0.98, 0.78, 0,0,0.3).caja(0.16, 0.16, 0.08, '#e63946', 0.12, 0.98, 0.78, 0,0,-0.3).bola(0.06, '#e63946', 0, 0.98, 0.82, 6)
   .pieza(new THREE.TorusGeometry(0.2, 0.03, 6, 14), '#ffd23f', 0.22, 1.42, 0.7)
   .caja(0.34, 0.14, 0.5, '#111', -0.24, 0.07, 0.5).caja(0.34, 0.14, 0.5, '#111', 0.24, 0.07, 0.5);
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  const bI = new Armador().caja(0.16, 0.5, 0.16, cafe, 0, -0.25, 0).bola(0.14, '#ffffff', 0, -0.55, 0, 6).malla(matMate()); bI.position.set(-0.78, 1.2, 0.1); bI.rotation.z = -0.5;
  const bD = new Armador().caja(0.16, 0.5, 0.16, cafe, 0, -0.25, 0).bola(0.14, '#ffffff', 0, -0.55, 0, 6).malla(matMate()); bD.position.set(0.78, 1.2, 0.1); bD.rotation.z = 0.5;
  g.add(bI, bD);
  g.partes = {cuerpo, bI, bD}; g.fase = 0; g.scale.setScalar(0.95);
  return g;
}
/* el popo bebé: un popito con lazo rosado y chupón */
function armarPopito(){
  const g = new THREE.Group(), A = new Armador();
  const cafe = '#7a4a1e', claro = '#95602a';
  A.bola(0.5, cafe, 0, 0.4, 0, 10, 1, 0.78, 1).bola(0.38, claro, 0.02, 0.74, 0.04, 10, 1, 0.85, 1).bola(0.26, cafe, 0.01, 1.02, 0.06, 8)
   .cono(0.16, 0.34, claro, 0.07, 1.3, 0.1, 8, 0, 0, -0.35)
   .bola(0.13, '#ffffff', -0.13, 0.8, 0.34, 8).bola(0.13, '#ffffff', 0.13, 0.8, 0.34, 8).bola(0.065, '#111', -0.12, 0.8, 0.45, 6).bola(0.065, '#111', 0.15, 0.8, 0.45, 6)
   .bola(0.06, '#ff9aa0', -0.26, 0.7, 0.32, 6).bola(0.06, '#ff9aa0', 0.27, 0.7, 0.32, 6)
   .cil(0.09, 0.09, 0.05, '#ffd23f', 0, 0.62, 0.42, Math.PI/2, 0, 0, 8).bola(0.05, '#4fc3f7', 0, 0.62, 0.47, 6)
   .caja(0.14, 0.12, 0.06, '#ff6ec0', -0.12, 1.16, 0.12, 0, 0, 0.4).caja(0.14, 0.12, 0.06, '#ff6ec0', 0.1, 1.16, 0.12, 0, 0, -0.4).bola(0.05, '#ff6ec0', -0.01, 1.16, 0.15, 6)
   .caja(0.2, 0.09, 0.3, '#ffffff', -0.15, 0.045, 0.28).caja(0.2, 0.09, 0.3, '#ffffff', 0.15, 0.045, 0.28);
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  g.partes = {cuerpo}; g.fase = 0;
  return g;
}
const popitosMesh = [];
/* la persona camina: piernas y brazos van y vienen, y el cuerpo rebota */
function animarPersona(g, mov, fase, aire, nadando, sentado){
  const p = g.partes;
  if (sentado){ p.pI.rotation.x = -1.4; p.pD.rotation.x = -1.4; p.bI.rotation.x = -0.9; p.bD.rotation.x = -0.9; p.cuerpo.position.y = 0; return; }
  if (nadando){ p.pI.rotation.x = 1.2 + Math.sin(fase*1.5)*0.3; p.pD.rotation.x = 1.2 - Math.sin(fase*1.5)*0.3; p.bI.rotation.x = fase*2 % 6.28; p.bD.rotation.x = (fase*2+3.14) % 6.28; p.cuerpo.position.y = 0; return; }
  if (aire){ p.pI.rotation.x = -0.7; p.pD.rotation.x = 0.4; p.bI.rotation.x = -2.6; p.bD.rotation.x = -2.6; p.cuerpo.position.y = 0; return; }
  const amp = Math.min(1, mov/3.5);
  const s = Math.sin(fase);
  p.pI.rotation.x = s*0.85*amp; p.pD.rotation.x = -s*0.85*amp;
  p.bI.rotation.x = -s*0.7*amp; p.bD.rotation.x = s*0.7*amp;
  p.bI.rotation.z = -0.12; p.bD.rotation.z = 0.12;
  p.cuerpo.position.y = Math.abs(Math.cos(fase))*0.05*amp + (amp < 0.1 ? Math.sin(fase*0.5)*0.015 : 0);
}
function animarPerro(g, mov, fase){
  const p = g.partes, amp = Math.min(1, mov/3), s = Math.sin(fase);
  p.patas[0].rotation.x = s*0.8*amp; p.patas[3].rotation.x = s*0.8*amp; p.patas[1].rotation.x = -s*0.8*amp; p.patas[2].rotation.x = -s*0.8*amp;
  p.cola.rotation.z = Math.sin(fase*3)*0.5; p.cola.rotation.x = 0.5;
  p.cuerpo.position.y = Math.abs(Math.cos(fase))*0.05*amp;
}
function ondearCapa(capa, t, fuerza){
  if (!capa) return;
  const pos = capa.geometry.attributes.position;
  for (let i=0;i<pos.count;i++){ const y = pos.getY(i); const k = (0.65 - y)/1.3; pos.setZ(i, -k*k*0.55*fuerza - Math.sin(t*9 + k*7)*0.08*k*(0.4+fuerza)); }
  pos.needsUpdate = true; capa.geometry.computeVertexNormals();
}

/* ---------------- Los vehículos ---------------- */
function rueda(r, ancho, color){
  const dir = new THREE.Group(), giro = new THREE.Group();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, ancho, 16), new THREE.MeshPhongMaterial({color: lin(0x1a1a1e), shininess: 14}));
  m.rotation.z = Math.PI/2; m.castShadow = true;
  const tapa = new THREE.Mesh(new THREE.CylinderGeometry(r*0.55, r*0.55, ancho+0.04, 10), new THREE.MeshPhongMaterial({color: lin(color||0xd8d8e0), shininess: 90, specular: lin(0xffffff)}));
  tapa.rotation.z = Math.PI/2; m.add(tapa);
  giro.add(m); dir.add(giro);
  return {dir, giro, r};
}
function armarVehiculo(id){
  const g = new THREE.Group(), A = new Armador(), R = {ruedas: [], id};
  if (id==='carro'){
    const c = '#e63946', claro = '#ff6b6b';
    A.caja(2.0, 0.55, 4.4, c, 0, 0.72, 0).caja(1.7, 0.72, 1.9, c, 0, 1.32, -0.3).caja(1.9, 0.12, 4.42, claro, 0, 1.03, 0)
     .caja(1.55, 0.5, 0.08, '#bfe9ff', 0, 1.34, 0.68, -0.35, 0, 0).caja(1.55, 0.44, 0.08, '#bfe9ff', 0, 1.34, -1.26, 0.35, 0, 0)
     .caja(0.06, 0.4, 1.3, '#bfe9ff', -0.86, 1.36, -0.3).caja(0.06, 0.4, 1.3, '#bfe9ff', 0.86, 1.36, -0.3)
     .caja(2.1, 0.26, 0.3, '#2a2a30', 0, 0.5, 2.22).caja(2.1, 0.26, 0.3, '#2a2a30', 0, 0.5, -2.22)
     .caja(0.36, 0.2, 0.12, '#fff6c0', -0.7, 0.82, 2.24).caja(0.36, 0.2, 0.12, '#fff6c0', 0.7, 0.82, 2.24)
     .caja(0.3, 0.16, 0.12, '#ff2020', -0.7, 0.82, -2.24).caja(0.3, 0.16, 0.12, '#ff2020', 0.7, 0.82, -2.24)
     .caja(0.5, 0.03, 4.4, '#ffffff', 0, 1.1, 0).caja(0.5, 0.03, 1.9, '#ffffff', 0, 1.69, -0.3)
     .caja(0.7, 0.3, 0.7, '#1a1a20', -0.4, 1.12, -0.5).caja(0.7, 0.6, 0.2, '#1a1a20', -0.4, 1.35, -0.85)
     .cil(0.18, 0.18, 0.05, '#2a2a2a', -0.4, 1.3, 0.2, 0.8, 0, 0, 10).caja(1.3, 0.08, 0.5, '#2a2a30', 0, 1.7, -1.35);
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    for (const [x,z,delante] of [[-1.05,1.35,true],[1.05,1.35,true],[-1.05,-1.35,false],[1.05,-1.35,false]]){ const w = rueda(0.42, 0.32); w.dir.position.set(x, 0.42, z); w.delante = delante; g.add(w.dir); R.ruedas.push(w); }
    R.asiento = {x:-0.4, y:0.85, z:-0.45, esc:0.6}; R.altoOjos = 1.4;
  } else if (id==='moto'){
    const c = '#4fc3f7';
    A.caja(0.44, 0.42, 1.7, c, 0, 0.8, 0).bola(0.34, c, 0, 1.06, 0.25, 10, 1, 0.7, 1.4).caja(0.5, 0.18, 0.8, '#1a1a20', 0, 1.06, -0.45)
     .caja(1.0, 0.06, 0.06, '#333', 0, 1.3, 0.72).caja(0.08, 0.5, 0.08, '#c8c8d0', -0.12, 1.02, 0.78, 0.4, 0, 0).caja(0.08, 0.5, 0.08, '#c8c8d0', 0.12, 1.02, 0.78, 0.4, 0, 0)
     .cil(0.16, 0.16, 0.14, '#fff6c0', 0, 1.1, 0.95, Math.PI/2, 0, 0, 10).cil(0.07, 0.07, 1.1, '#c8c8d0', 0.3, 0.55, -0.4, 1.3, 0, 0, 8)
     .caja(0.36, 0.3, 0.5, '#3a3a44', 0, 0.62, 0.05).caja(0.5, 0.06, 0.5, '#e63946', 0, 0.42, -0.9);
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    for (const [z,delante] of [[0.92,true],[-0.88,false]]){ const w = rueda(0.44, 0.24, 0x8a8a90); w.dir.position.set(0, 0.44, z); w.delante = delante; g.add(w.dir); R.ruedas.push(w); }
    R.asiento = {x:0, y:0.9, z:-0.3, esc:0.62}; R.altoOjos = 1.5;
  } else if (id==='barco'){
    A.caja(2.6, 1.0, 5.6, '#ffffff', 0, 0.55, -0.3).cono(1.3, 2.4, '#ffffff', 0, 0.55, 3.6, 4, Math.PI/2, Math.PI/4, 0)
     .caja(2.66, 0.24, 5.62, '#2a6ad0', 0, 0.62, -0.3).caja(2.4, 0.1, 5.2, '#e0c090', 0, 1.06, -0.3)
     .caja(1.8, 1.1, 1.9, '#ffffff', 0, 1.65, -0.9).caja(1.7, 0.5, 0.08, '#bfe9ff', 0, 1.75, 0.07).caja(0.08, 0.5, 1.4, '#bfe9ff', -0.9, 1.75, -0.9).caja(0.08, 0.5, 1.4, '#bfe9ff', 0.9, 1.75, -0.9)
     .caja(2.1, 0.12, 2.2, '#2a6ad0', 0, 2.26, -0.9).cil(0.05, 0.05, 2.6, '#c8c8d0', 0.6, 3.5, -1.6, 0,0,0,6)
     .caja(1.0, 0.6, 0.5, '#2a2a30', 0, 1.2, -3.2).cil(0.3, 0.3, 0.1, '#ff7a1a', -1.34, 1.2, -1.4, 0, 0, Math.PI/2, 12)
     .pieza(new THREE.TorusGeometry(0.34, 0.1, 6, 14), '#ff7a1a', 1.36, 1.3, -1.6, 0, Math.PI/2, 0)
     .cil(0.2, 0.2, 0.05, '#5a3418', 0, 1.6, 0.05, 1.2, 0, 0, 10);
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    R.bandera = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.6, 4, 1), new THREE.MeshLambertMaterial({color: lin(0xe63946), side: THREE.DoubleSide}));
    R.bandera.position.set(0.6, 4.5, -1.6); R.bandera.geometry.translate(-0.5, 0, 0); R.bandera.rotation.y = Math.PI/2; g.add(R.bandera);
    R.asiento = {x:0, y:1.1, z:-0.55, esc:0.7, parado:true}; R.altoOjos = 2.2;
  } else if (id==='avion'){
    const c = '#4fc3f7';
    A.cil(0.62, 0.5, 5.2, c, 0, 1.1, 0, Math.PI/2, 0, 0, 14).cono(0.62, 0.9, '#e63946', 0, 1.1, 3.05, 14, Math.PI/2, 0, 0).cono(0.5, 1.3, c, 0, 1.1, -3.25, 14, -Math.PI/2, 0, 0)
     .caja(9.0, 0.14, 1.6, '#ffffff', 0, 1.0, 0.3).caja(1.2, 0.16, 1.62, '#e63946', -3.9, 1.0, 0.3).caja(1.2, 0.16, 1.62, '#e63946', 3.9, 1.0, 0.3)
     .caja(3.2, 0.1, 0.9, '#ffffff', 0, 1.3, -2.8).caja(0.12, 1.3, 1.1, '#e63946', 0, 1.95, -2.9)
     .caja(0.9, 0.5, 0.08, '#bfe9ff', 0, 1.85, 0.95, -0.5, 0, 0).caja(0.5, 0.08, 4.4, '#ffffff', 0, 1.6, 0.2)
     .caja(0.1, 0.5, 0.1, '#5a6270', -1.4, 0.65, 0.6).caja(0.1, 0.5, 0.1, '#5a6270', 1.4, 0.65, 0.6).caja(0.08, 0.4, 0.08, '#5a6270', 0, 0.45, -2.6)
     .caja(0.4, 0.12, 0.4, '#ffd23f', 0, 1.02, 1.0);
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    for (const [x,y,z,r] of [[-1.4,0.34,0.6,0.34],[1.4,0.34,0.6,0.34],[0,0.22,-2.6,0.22]]){ const w = rueda(r, 0.2); w.dir.position.set(x, y, z); g.add(w.dir); R.ruedas.push(w); }
    R.helice = new THREE.Group(); R.helice.position.set(0, 1.1, 3.55);
    R.helice.add(new Armador().bola(0.2, '#ffd23f', 0,0,0, 8).caja(0.16, 2.4, 0.08, '#2a2a30', 0,0,0).caja(2.4, 0.16, 0.08, '#2a2a30', 0,0,0).malla(matBrillo()));
    g.add(R.helice);
    R.asiento = {x:0, y:1.05, z:0.1, esc:0.62}; R.altoOjos = 1.9;
  } else if (id==='sub'){
    const c = '#ffd23f';
    A.cil(1.1, 1.1, 5.5, c, 0, 1.1, 0, Math.PI/2, 0, 0, 16).bola(1.1, c, 0, 1.1, 2.75, 12, 1, 1, 0.9).cono(1.1, 1.8, c, 0, 1.1, -3.6, 14, -Math.PI/2, 0, 0)
     .caja(1.2, 1.0, 1.9, c, 0, 2.5, 0.2).cil(0.08, 0.08, 1.2, '#333', 0.35, 3.5, -0.3, 0,0,0,6).caja(0.3, 0.14, 0.14, '#333', 0.45, 4.1, -0.3)
     .caja(3.2, 0.1, 0.9, '#f0a020', 0, 1.1, -2.7).caja(0.1, 1.5, 0.9, '#f0a020', 0, 1.9, -2.9).caja(1.6, 0.1, 0.8, '#f0a020', 0, 2.55, 1.1)
     .caja(0.3, 0.3, 4.0, '#f0a020', 0, 0.12, 0);
    for (const lado of [-1,1]) for (const z of [-1.4, 0, 1.4]){ A.cil(0.3, 0.3, 0.16, '#2a2a30', lado*1.1, 1.3, z, 0, 0, Math.PI/2, 12); A.cil(0.22, 0.22, 0.2, '#bfe9ff', lado*1.1, 1.3, z, 0, 0, Math.PI/2, 12); }
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    R.cupula = new THREE.Mesh(new THREE.SphereGeometry(0.8, 14, 10), new THREE.MeshPhongMaterial({color: lin(0xbfe9ff), transparent:true, opacity:0.38, shininess:120, specular: lin(0xffffff), depthWrite:false}));
    R.cupula.position.set(0, 3.0, 0.3); g.add(R.cupula);
    R.helice = new THREE.Group(); R.helice.position.set(0, 1.1, -4.55);
    R.helice.add(new Armador().bola(0.18, '#2a2a30', 0,0,0, 6).caja(0.2, 1.6, 0.08, '#8a8a90', 0,0,0, 0,0,0).caja(0.2, 1.6, 0.08, '#8a8a90', 0,0,0, 0,0,1.05).caja(0.2, 1.6, 0.08, '#8a8a90', 0,0,0, 0,0,2.1).malla(matBrillo()));
    g.add(R.helice);
    R.asiento = {x:0, y:2.3, z:0.3, esc:0.5}; R.altoOjos = 2.6;
  }
  const sombra = new THREE.Mesh(new THREE.CircleGeometry(id==='avion' ? 3.2 : id==='barco' ? 2.6 : 1.8, 16), new THREE.MeshBasicMaterial({color:0x000000, transparent:true, opacity:0.18, depthWrite:false}));
  sombra.rotation.x = -Math.PI/2; sombra.position.y = 0.04; g.add(sombra); R.sombra = sombra;
  g.partes = R;
  return g;
}

/* ---------------- Todo el elenco, puesto en la isla ---------------- */
let fer = armarPersona('fernando'); scene.add(fer);
let ferSentado = armarPersona('fernando'); ferSentado.visible = false; scene.add(ferSentado);
function ponerPersonaje(pj){
  if (!PERSONAJES_RED.some(p=>p.id===pj)) return;
  if (fer.parent) fer.parent.remove(fer); if (ferSentado.parent) ferSentado.parent.remove(ferSentado);
  fer = armarPersona(pj); scene.add(fer);
  ferSentado = armarPersona(pj); ferSentado.visible = false; scene.add(ferSentado);
}
const tioJuan = armarPersona('tiojuan'); scene.add(tioJuan);
tioJuan.partes.bI.rotation.x = -2.9; tioJuan.partes.bD.rotation.x = -2.9;
const familiaMesh = {};
for (const f of FAMILIA){
  const m = armarPersona(f.id);
  m.position.set(f.x, altura(f.x, f.z), f.z); m.rotation.y = f.ang;
  const et = letrero(f.nombre, '#fff', 'rgba(20,20,50,0.75)', 1.1); et.position.y = 2.5/m.esc; m.add(et); m.etiqueta = et;
  scene.add(m); familiaMesh[f.id] = m;
}
const perrosMesh = {};
for (const p of PERROS_DEF){
  const m = armarPerro(p.color); scene.add(m); perrosMesh[p.id] = m;
  const et = letrero(p.nombre, '#fff', 'rgba(20,20,50,0.75)', 0.9); et.position.y = 1.9; m.add(et); m.etiqueta = et;
}
const srPopo = armarSrPopo(); scene.add(srPopo);
{ const et = letrero('Señor Popo', '#fff', 'rgba(90,50,20,0.85)', 1.3); et.position.y = 3.4; srPopo.add(et); }
const vehMesh = {};
for (const v of VEHICULOS_DEF){
  const m = armarVehiculo(v.id); scene.add(m); vehMesh[v.id] = m;
  const et = letrero(v.emoji+' '+v.nombre.replace('el ','').replace('la ','').toUpperCase(), '#fff', 'rgba(20,20,50,0.8)', 1.6);
  et.position.y = v.id==='avion' ? 4.2 : v.id==='barco' ? 5.6 : v.id==='sub' ? 4.8 : 3.0; m.add(et); m.etiqueta = et;
}

/* ---------------- Jugar con amigos: PeerJS ----------------
   Los navegadores se conectan directo entre sí (WebRTC); el servidor
   público de PeerJS solo presenta a los dos aparatos por el código de sala.
   El que crea la sala es el anfitrión: recibe lo de cada amigo y se lo
   reenvía a los demás. Cada quien juega su propia partida y ve a los otros
   corriendo, manejando y volando por la misma isla. */
const RED = {estado:'off', peer:null, conns:new Map(), sala:'', anfitrion:false, remotos:new Map(), pj:'fernando', error:'', codigo:'', pendiente:'', entrandoCodigo:false, avisos:[]};
try{ const g = localStorage.getItem('aventura3d.pj'); if (g && PERSONAJES_RED.some(p=>p.id===g)) RED.pj = g; }catch(e){}
try{ const c = normalizarCodigo(new URL(location.href).searchParams.get('sala')); if (c.length===4) RED.pendiente = c; }catch(e){}
const nombreLocal = ()=> PERSONAJES_RED.find(p=>p.id===RED.pj).nombre;
const hayPeerJS = ()=> typeof Peer !== 'undefined';
const redActiva = ()=> !!RED.peer && (RED.estado==='sala' || RED.estado==='conectado');
const enlaceSala = ()=> location.origin + location.pathname + '?sala=' + RED.sala;
function textoErrorRed(e){
  const t = e && e.type;
  if (t==='peer-unavailable') return 'No encontré la sala '+RED.sala+'. Revisa el código, o pide que la creen otra vez.';
  if (t==='network' || t==='server-error' || t==='socket-error' || t==='socket-closed') return 'No pude hablar con el servidor de salas. Revisa el internet y vuelve a intentar.';
  if (t==='browser-incompatible') return 'Este navegador no puede jugar en línea. Prueba con Chrome o Safari actualizados.';
  return 'Algo falló en la conexión ('+(t||'?')+'). Vuelve a intentar.';
}
function redLimpiar(){
  if (RED.peer){ try{ RED.peer.destroy(); }catch(e){} }
  RED.peer = null; RED.conns.clear();
  for (const id of [...RED.remotos.keys()]) quitarRemoto(id);
  RED.anfitrion = false;
}
function redCrear(){
  if (!hayPeerJS()){ RED.estado = 'error'; RED.error = 'No se cargó la parte de red. Revisa la conexión y recarga la página.'; return; }
  redLimpiar(); RED.estado = 'creando'; RED.sala = codigoSala(); RED.anfitrion = true; RED.error = '';
  const peer = new Peer('fernando-bros-'+RED.sala, {debug:0});
  RED.peer = peer;
  peer.on('open', ()=>{ if (RED.peer===peer) RED.estado = 'sala'; });
  peer.on('connection', conn=>{ if (RED.peer===peer) prepararConn(conn); });
  peer.on('error', e=>{ if (RED.peer!==peer) return; if (e.type==='unavailable-id'){ redCrear(); return; } RED.estado = 'error'; RED.error = textoErrorRed(e); RED.anfitrion = false; });
  peer.on('disconnected', ()=>{ try{ if (RED.peer===peer && !peer.destroyed) peer.reconnect(); }catch(e){} });
  setTimeout(()=>{ if (RED.peer===peer && RED.estado==='creando'){ RED.estado = 'error'; RED.error = 'El servidor de salas no respondió. Revisa el internet y vuelve a intentar.'; } }, 15000);
}
function redUnirse(codigo){
  codigo = normalizarCodigo(codigo);
  if (codigo.length !== 4){ RED.error = 'El código tiene 4 letras o números'; return; }
  if (!hayPeerJS()){ RED.estado = 'error'; RED.error = 'No se cargó la parte de red. Revisa la conexión y recarga la página.'; return; }
  redLimpiar(); RED.estado = 'uniendo'; RED.sala = codigo; RED.anfitrion = false; RED.error = ''; RED.entrandoCodigo = false;
  const peer = new Peer({debug:0});
  RED.peer = peer;
  peer.on('open', ()=>{ if (RED.peer!==peer) return; prepararConn(peer.connect('fernando-bros-'+codigo, {reliable:true, serialization:'json'})); });
  peer.on('error', e=>{ if (RED.peer!==peer) return; RED.estado = 'error'; RED.error = textoErrorRed(e); });
  peer.on('disconnected', ()=>{ try{ if (RED.peer===peer && !peer.destroyed) peer.reconnect(); }catch(e){} });
  setTimeout(()=>{ if (RED.peer===peer && RED.estado==='uniendo'){ RED.estado = 'error'; RED.error = 'No pude entrar a la sala '+codigo+'. Revisa el internet de los dos aparatos y que el código sea el mismo.'; } }, 20000);
}
function redSalir(){ if (RED.conns.size) redEnviar({t:'chau'}); redLimpiar(); RED.estado = 'off'; RED.sala = ''; }
function prepararConn(conn){
  conn.on('open', ()=>{
    RED.conns.set(conn.peer, conn);
    try{ conn.send({t:'hola', pj:RED.pj, n:nombreLocal(), v:VERSION_RED}); }catch(e){}
    if (!RED.anfitrion){ RED.estado = 'conectado'; if (estado!=='juego'){ estado = 'juego'; cortina = 20; } aviso('👥 ¡Entraste a la sala '+RED.sala+'!'); sfx.estrella(); }
  });
  conn.on('data', m=>redRecibir(conn.peer, m));
  const cerrar = ()=>{
    if (!RED.conns.has(conn.peer)) return;
    RED.conns.delete(conn.peer);
    const r = RED.remotos.get(conn.peer);
    if (r) aviso(r.nombre+' se fue de la isla 👋');
    quitarRemoto(conn.peer);
    if (RED.anfitrion) redEnviar({t:'r', de:conn.peer, m:{t:'chau'}});
    else { aviso('Se cerró la sala; sigues jugando solo'); redLimpiar(); RED.estado = 'off'; RED.sala = ''; }
  };
  conn.on('close', cerrar); conn.on('error', cerrar);
}
function redEnviar(m){ for (const [,c] of RED.conns){ try{ if (c.open) c.send(m); }catch(e){} } }
function redEvento(tipo, datos){ if (RED.conns.size) redEnviar(Object.assign({t:'ev', tipo}, datos||{})); }
function redRecibir(id, m){
  if (!m || typeof m !== 'object') return;
  if (m.t==='r'){ if (!RED.anfitrion && typeof m.de==='string' && m.m && typeof m.m==='object') redRecibir(m.de, m.m); return; }
  if (RED.anfitrion){ for (const [pid, c] of RED.conns) if (pid!==id){ try{ if (c.open) c.send({t:'r', de:id, m}); }catch(e){} } }
  if (m.t==='chau'){ const r = RED.remotos.get(id); if (r) aviso(r.nombre+' se fue de la isla 👋'); quitarRemoto(id); return; }
  if (m.t==='hola'){
    const pj = PERSONAJES_RED.some(p=>p.id===m.pj) ? m.pj : 'fernando';
    const nombre = String(m.n||'').replace(/[^\wáéíóúñÁÉÍÓÚÑ ]/g, '').slice(0, 14) || PERSONAJES_RED.find(p=>p.id===pj).nombre;
    if (!RED.remotos.has(id)) crearRemoto(id, {pj, nombre, x:P.J.x, y:P.J.y, z:P.J.z, ang:0, veh:'', mov:0, fase:0, nadando:false, suelo:true, cabeceo:0, giro:0, vel:0, aire:false, popitos:0, ganas:false, estrellas:0});
    aviso('👋 '+nombre+' entró a la isla'); sfx.saludo();
    return;
  }
  if (m.t==='e'){
    const e = desempaquetarEstado(m); if (!e) return;
    let r = RED.remotos.get(id);
    if (!r) r = crearRemoto(id, e);
    else if (r.pj !== e.pj || r.nombre !== e.nombre){ quitarRemoto(id); r = crearRemoto(id, e); }
    r.obj = e; r.t = tick;
    return;
  }
  if (m.t==='ev'){
    const r = RED.remotos.get(id); if (!r) return;
    const x = Number.isFinite(m.x) ? m.x : r.act.x, y = Number.isFinite(m.y) ? m.y : r.act.y, z = Number.isFinite(m.z) ? m.z : r.act.z;
    const cerca = Math.hypot(x-P.J.x, z-P.J.z) < 80;
    if (m.tipo==='pedo'){ nubePeo(x, y, z, !!m.grande); if (cerca) sfx.pedo(!!m.grande); }
    else if (m.tipo==='hamburguesa'){ chispas(x, y, z, '#ffe36e', 10, 4); if (cerca) sfx.hamburguesa(); }
    else if (m.tipo==='estrella'){ confeti(x, y, z, 30); aviso('⭐ '+r.nombre+' ganó una estrella'); sfx.estrella(); }
    else if (m.tipo==='popo'){ confeti(x, y, z, 12); aviso('💩 '+r.nombre+' hizo popo'); }
    else if (m.tipo==='salto' && cerca){ sfx.salto(); }
  }
}
function crearRemoto(id, e){
  const r = {id, pj:e.pj, nombre:e.nombre, obj:e, act:{x:e.x, y:e.y, z:e.z, ang:e.ang}, t:tick, fase:0, vehs:{}};
  r.g = armarPersona(e.pj); r.g.visible = false; scene.add(r.g);
  r.gs = armarPersona(e.pj); r.gs.visible = false; scene.add(r.gs);
  r.etiqueta = letrero('👤 '+e.nombre, '#fff', 'rgba(20,80,170,0.88)', 1.4); r.etiqueta.position.y = 2.6/r.g.esc; r.g.add(r.etiqueta);
  RED.remotos.set(id, r); return r;
}
function quitarRemoto(id){
  const r = RED.remotos.get(id); if (!r) return;
  scene.remove(r.g); if (r.gs.parent) r.gs.parent.remove(r.gs);
  for (const k in r.vehs) scene.remove(r.vehs[k]);
  RED.remotos.delete(id);
}
function sincronizarRemotos(){
  for (const [id, r] of RED.remotos){
    if (tick - r.t > 60*12){ quitarRemoto(id); continue; }
    const o = r.obj, a = r.act;
    a.x += (o.x-a.x)*0.22; a.y += (o.y-a.y)*0.22; a.z += (o.z-a.z)*0.22; a.ang = envolver(a.ang + envolver(o.ang-a.ang)*0.22);
    r.fase += o.mov*DT*2.2 + DT*0.5;
    if (o.veh){
      let vm = r.vehs[o.veh];
      if (!vm){ vm = armarVehiculo(o.veh); const et = letrero('👤 '+r.nombre, '#fff', 'rgba(20,80,170,0.88)', 1.4); et.position.y = o.veh==='avion' ? 4.2 : o.veh==='barco' ? 5.6 : o.veh==='sub' ? 4.8 : 3.0; vm.add(et); scene.add(vm); r.vehs[o.veh] = vm; }
      for (const k in r.vehs) r.vehs[k].visible = k===o.veh;
      vm.position.set(a.x, a.y, a.z);
      vm.rotation.set(-o.cabeceo, a.ang, o.veh==='avion' && o.aire ? o.giro*0.7 : o.veh==='moto' ? o.giro*0.45 : o.giro*0.1, 'YXZ');
      const R = vm.partes;
      for (const w of R.ruedas){ w.giro.rotation.x += o.vel*DT/w.r; if (w.delante) w.dir.rotation.y = o.giro*0.45; }
      if (R.helice) R.helice.rotation.z += 0.3;
      R.sombra.visible = o.veh!=='sub';
      if (r.gs.parent !== vm) vm.add(r.gs);
      r.gs.visible = true; r.gs.position.set(R.asiento.x, R.asiento.y, R.asiento.z); r.gs.scale.setScalar(r.gs.esc*R.asiento.esc); r.gs.rotation.set(0,0,0);
      animarPersona(r.gs, 0, 0, false, false, !R.asiento.parado);
      r.g.visible = false;
    } else {
      for (const k in r.vehs) r.vehs[k].visible = false;
      r.gs.visible = false;
      r.g.visible = true; r.g.position.set(a.x, a.y, a.z); r.g.rotation.set(o.nadando ? 1.2 : 0, a.ang, 0);
      animarPersona(r.g, o.mov, r.fase, !o.suelo && !o.nadando, o.nadando);
      r.etiqueta.visible = Math.hypot(a.x-P.J.x, a.z-P.J.z) > 3;
    }
  }
}
function redPaso(){
  if (!redActiva() || !RED.conns.size) return;
  if (tick % 4 === 0) redEnviar(empaquetarEstado(P, RED.pj, nombreLocal()));
}
function compartirSala(){
  const url = enlaceSala(), texto = '¡Ven a jugar conmigo a la isla de Fernando! Sala '+RED.sala+': '+url;
  try{ if (navigator.share){ navigator.share({title:'Fernando y Tío Juan: La Gran Aventura', text:texto, url}).catch(()=>{}); return; } }catch(e){}
  copiarEnlace();
}
function copiarEnlace(){
  const url = enlaceSala();
  try{ if (navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(url).then(()=>aviso('📋 Enlace copiado: mándalo por WhatsApp'), ()=>aviso('Enlace: '+url)); return; } }catch(e){}
  aviso('Enlace: '+url);
}

/* ---------------- El juego: estados, cámara, eventos y marcador ---------------- */
let estado = 'menu';          /* menu · juego · pausa · final · amigos */
let P = null;
let camYaw = Math.PI, cortina = 40, mensajeGrande = null, sacudida = 0, ferDentro = false, sacudidaBano = 0;
const burbujas = [];
const camPos = new THREE.Vector3(INICIO.x, 30, INICIO.z+40), camMira = new THREE.Vector3(INICIO.x, 4, INICIO.z);
let bajoF = 0, fovObj = 70, tactil = false, entradaForzada = null, selPausa = 0, estrellaAnim = null, ultimoGuardado = 0, avisoT = 0, avisoTxt = '';
try{ tactil = matchMedia('(pointer: coarse)').matches; }catch(e){}
addEventListener('touchstart', ()=>{ tactil = true; }, {passive:true, once:true});
const URL_VOLVER = '../';
const CAM_CFG = {
  pie:   {d:6.8,  h:3.0, mira:1.4}, nadar: {d:7.5, h:3.6, mira:0.6},
  carro: {d:10.5, h:4.2, mira:1.6}, moto:  {d:8.5, h:3.6, mira:1.4}, barco: {d:14, h:5.8, mira:1.8},
  avion: {d:16,   h:5.5, mira:1.8}, sub:   {d:12,  h:3.8, mira:1.0},
};
scene.fog = new THREE.FogExp2(0xc9e4ff, 0.0014);
const NIEBLA = {aire: new THREE.Color(0xc9e4ff), agua: new THREE.Color(0x0b4f8a)};

function cargarGuardado(){ try{ const g = localStorage.getItem('aventura3d.partida'); return g ? JSON.parse(g) : null; }catch(e){ return null; } }
function guardar(){ try{ localStorage.setItem('aventura3d.partida', JSON.stringify(exportar(P))); }catch(e){} }
function nuevaPartida(guardado){
  P = crearPartida(guardado);
  camYaw = envolver(P.J.ang + Math.PI) ; camYaw = P.J.ang;
  ferDentro = false;
  for (const id in vehMesh){ const v = P.vehiculos.find(v=>v.id===id); vehMesh[id].position.set(v.x, v.y, v.z); vehMesh[id].rotation.set(0, v.ang, 0); }
  hambMesh.forEach((m, i)=>{ m.visible = !P.comidas.has(HAMBURGUESAS[i].id); });
  arosMesh.forEach((m, i)=>{ m.material.color.copy(P.prog.aros.includes(i) ? lin(0x7dffa0) : lin(0xffd23f)); });
  banderasMesh.forEach((g, i)=>{ g.bandera.material.color.copy(P.prog.banderas.includes(i) ? lin(0xffd23f) : lin(0xe63946)); });
  aroRampa.material.color.copy(P.prog.rampa ? lin(0x7dffa0) : lin(0xffd23f));
}
P = crearPartida(cargarGuardado());
nuevaPartida(cargarGuardado());
if (RED.pj !== 'fernando') ponerPersonaje(RED.pj);
function burbuja(txt, quien, dur){ burbujas.push({txt, quien: quien||'', t: dur||200, t0: dur||200}); if (burbujas.length > 2) burbujas.shift(); }
function grande(txt, color, dur){ mensajeGrande = {txt, color: color||'#ffe36e', t: dur||90, t0: dur||90}; }
function aviso(txt){ avisoTxt = txt; avisoT = 180; }
function volverAFernandoBros(){ try{ location.href = URL_VOLVER; }catch(e){} }
function empezar(){
  if (RED.pendiente && RED.estado==='off'){ const c = RED.pendiente; RED.pendiente = ''; estado = 'amigos'; redUnirse(c); return; }
  estado = 'juego'; cortina = 30;
  hablar('Eres mi pichunguito'); burbuja('Eres mi pichunguito', 'Tío Juan');
  setTimeout(()=>{ if (estado==='juego'){ hablar('¡Pichunguito al ataque!'); burbuja('¡Pichunguito al ataque!', 'Fernando'); } }, 2500);
}
function procesarTecla(k){
  if (estado==='menu'){
    if (k==='Escape') return;
    if (k==='Enter'||k===' '||k==='ArrowUp'||k==='ArrowDown'||k==='ArrowLeft'||k==='ArrowRight'||k==='Shift'){ sfx.toque(); empezar(); }
    return;
  }
  if (estado==='juego'){
    if (k==='Escape'||k==='p'||k==='P'){ estado = 'pausa'; selPausa = 0; sfx.toque(); }
    else if (k==='m'||k==='M'){ musicaOn = !musicaOn; try{ localStorage.setItem('aventura3d.musica', musicaOn ? 'si' : 'no'); }catch(e){} aviso(musicaOn ? '🎵 Música encendida' : '🔇 Música apagada'); }
    return;
  }
  if (estado==='pausa'){
    if (k==='Escape'||k==='p'||k==='P'){ estado = 'juego'; sfx.toque(); }
    else if (k==='ArrowUp'){ selPausa = (selPausa+4)%5; sfx.toque(); }
    else if (k==='ArrowDown'){ selPausa = (selPausa+1)%5; sfx.toque(); }
    else if (k==='Enter'||k===' ') elegirPausa(selPausa);
    return;
  }
  if (estado==='amigos'){
    if (k==='Escape'){ if (RED.entrandoCodigo){ RED.entrandoCodigo = false; } else if (RED.estado==='error'||RED.estado==='creando'||RED.estado==='uniendo'){ redSalir(); } else estado = 'juego'; sfx.toque(); return; }
    if (RED.entrandoCodigo){
      if (k==='Backspace'){ RED.codigo = RED.codigo.slice(0,-1); sfx.toque(); }
      else if (k==='Enter'){ if (RED.codigo.length===4){ sfx.toque(); redUnirse(RED.codigo); } }
      else if (k.length===1){ const c = normalizarCodigo(k); if (c && RED.codigo.length<4){ RED.codigo += c; sfx.toque(); } }
    } else if (k==='Enter' && (RED.estado==='sala'||RED.estado==='conectado')){ estado = 'juego'; sfx.toque(); }
    return;
  }
  if (estado==='final'){
    if (k==='Enter'||k===' '||k==='Escape'){ estado = 'juego'; sfx.toque(); }
  }
}
function elegirPausa(i){
  sfx.toque();
  if (i===0) estado = 'juego';
  else if (i===1){ estado = 'amigos'; RED.entrandoCodigo = false; RED.error = ''; }
  else if (i===2){ musicaOn = !musicaOn; try{ localStorage.setItem('aventura3d.musica', musicaOn ? 'si' : 'no'); }catch(e){} }
  else if (i===3){ try{ localStorage.removeItem('aventura3d.partida'); }catch(e){} nuevaPartida(null); estado = 'juego'; cortina = 30; aviso('Aventura nueva: ¡a empezar de cero!'); }
  else if (i===4){ redSalir(); volverAFernandoBros(); }
}
const enZona = (mx,my,z,m)=>mx>=z.x-(m||0) && mx<=z.x+z.w+(m||0) && my>=z.y-(m||0) && my<=z.y+z.h+(m||0);
const zonaAtras = ()=>({x:14, y:12, w:190, h:42});
const zonasPausa = ()=>[0,1,2,3,4].map(i=>({x:W/2-150, y:H/2+24+i*41, w:300, h:36}));
/* la pantalla de JUGAR CON AMIGOS */
const zonaAmigos = ()=>{
  const z = {volver: zonaAtras(), guia: {x:W-190, y:12, w:176, h:42}, pjs: [], teclas: [], borrar:null, entrar:null};
  const n = PERSONAJES_RED.length, w = Math.min(100, (W-40)/n - 8), x0 = W/2 - (n*(w+8)-8)/2;
  for (let i=0;i<n;i++) z.pjs.push({x: x0 + i*(w+8), y: 96, w, h: 62});
  z.crear = {x:W/2-310, y:H/2+16, w:300, h:50}; z.unirme = {x:W/2+10, y:H/2+16, w:300, h:50};
  z.jugar = {x:W/2-150, y:H-64, w:300, h:46}; z.salir = {x:W/2-150, y:H-64, w:300, h:46};
  z.compartir = {x:W/2-250, y:H/2+64, w:240, h:44}; z.copiar = {x:W/2+10, y:H/2+64, w:240, h:44};
  z.reintentar = {x:W/2-150, y:H/2+40, w:300, h:46};
  const cols = 8, tw = Math.min(58, (W-60)/cols - 6), tx0 = W/2 - (cols*(tw+6)-6)/2, ty0 = H/2 - 30;
  for (let i=0;i<ALFABETO_SALA.length;i++) z.teclas.push({x: tx0 + (i%cols)*(tw+6), y: ty0 + Math.floor(i/cols)*(tw*0.78+6), w: tw, h: tw*0.78, ch: ALFABETO_SALA[i]});
  z.borrar = {x:W/2-150, y:H-64, w:140, h:46}; z.entrar = {x:W/2+10, y:H-64, w:140, h:46};
  return z;
};
function clic(x, y){
  if (estado==='menu'){
    if (enZona(x, y, zonaAtras(), 6)) return volverAFernandoBros();
    if (enZona(x, y, {x:W-190, y:12, w:176, h:42}, 6)){ sfx.toque(); estado = 'amigos'; RED.entrandoCodigo = false; if (RED.pendiente){ const c = RED.pendiente; RED.pendiente = ''; redUnirse(c); } return; }
    sfx.toque(); empezar(); return;
  }
  if (estado==='pausa'){
    let dio = false;
    zonasPausa().forEach((z, i)=>{ if (enZona(x, y, z, 4)){ elegirPausa(i); dio = true; } });
    if (!dio && y < H/2-10) { estado = 'juego'; sfx.toque(); }
    return;
  }
  if (estado==='amigos'){
    const z = zonaAmigos();
    if (enZona(x, y, z.volver, 6)){ sfx.toque(); if (RED.entrandoCodigo) RED.entrandoCodigo = false; else { if (RED.estado==='error'||RED.estado==='creando'||RED.estado==='uniendo') redSalir(); estado = 'juego'; } return; }
    if (enZona(x, y, z.guia, 6)){ try{ window.open('amigos.html', '_blank'); }catch(e){} return; }
    if (RED.entrandoCodigo){
      for (const t of z.teclas) if (enZona(x, y, t, 2) && RED.codigo.length<4){ RED.codigo += t.ch; sfx.toque(); return; }
      if (enZona(x, y, z.borrar, 4)){ RED.codigo = RED.codigo.slice(0,-1); sfx.toque(); return; }
      if (enZona(x, y, z.entrar, 4) && RED.codigo.length===4){ sfx.toque(); redUnirse(RED.codigo); return; }
      return;
    }
    if (RED.estado==='off' || RED.estado==='error'){
      z.pjs.forEach((zp, i)=>{ if (enZona(x, y, zp, 2)){ const pj = PERSONAJES_RED[i].id; if (pj!==RED.pj){ RED.pj = pj; ponerPersonaje(pj); try{ localStorage.setItem('aventura3d.pj', pj); }catch(e){} sfx.toque(); } } });
    }
    if (RED.estado==='off'){
      if (enZona(x, y, z.crear, 4)){ sfx.toque(); redCrear(); return; }
      if (enZona(x, y, z.unirme, 4)){ sfx.toque(); RED.entrandoCodigo = true; RED.codigo = ''; return; }
    } else if (RED.estado==='error'){
      if (enZona(x, y, z.reintentar, 4)){ sfx.toque(); if (RED.anfitrion) redCrear(); else if (RED.sala) redUnirse(RED.sala); else { RED.estado = 'off'; } return; }
    } else if (RED.estado==='sala' || RED.estado==='conectado'){
      if (enZona(x, y, z.jugar, 4)){ sfx.toque(); estado = 'juego'; return; }
      if (RED.estado==='sala'){
        if (enZona(x, y, z.compartir, 4)){ sfx.toque(); compartirSala(); return; }
        if (enZona(x, y, z.copiar, 4)){ sfx.toque(); copiarEnlace(); return; }
      }
      if (enZona(x, y, {x:W-190, y:H-64, w:176, h:46}, 4)){ sfx.toque(); redSalir(); aviso('Saliste de la sala'); return; }
    }
    return;
  }
  if (estado==='final'){
    if (enZona(x, y, {x:W/2-150, y:H-90, w:300, h:44}, 6)){ estado = 'juego'; sfx.toque(); }
    else if (enZona(x, y, zonaAtras(), 6)) volverAFernandoBros();
  }
}

/* ---- lo que pasa en el núcleo se convierte en sonido, partículas y frases ---- */
function atenderEventos(){
  const J = P.J;
  for (const e of P.eventos){
    switch (e.tipo){
      case 'hablar': hablar(e.texto); burbuja(e.texto, e.quien); break;
      case 'hamburguesa': sfx.hamburguesa(); chispas(e.x, e.y, e.z, '#ffe36e', 16, 5); redEvento('hamburguesa', {x:e.x, y:e.y, z:e.z}); hambMesh[e.id].visible = false; grande('¡HAMBURGUESA! 🍔 '+e.total, '#ffe36e', 60); break;
      case 'pedo': sfx.pedo(e.grande); nubePeo(e.x, e.y, e.z, e.grande); if (!e.tioFran) redEvento('pedo', {x:e.x, y:e.y, z:e.z, grande:!!e.grande}); if (!e.tioFran) grande(e.grande ? '¡PRRRRRT! 💨' : '¡prrt! 💨', '#b8ec6a', 50); else grande('¡QUÉ PEDO, TÍO FRAN! 💨', '#b8ec6a', 80); break;
      case 'ganas': grande('¡QUIERO HACER POPO! 🚽', '#ffb070', 120); break;
      case 'banoEntra': ferDentro = true; sfx.puerta(); banosMesh[e.bano].puertaObj = 1; break;
      case 'banoPuerta': sfx.puerta(); banosMesh[e.bano].puertaObj = e.abre ? 1 : 0; break;
      case 'plop': sfx.plop(); sacudidaBano = 14; break;
      case 'descarga': sfx.descarga(); { const b = BANOS[e.bano]; for (let i=0;i<12;i++) particula(b.x + (azar()-0.5)*2, altura(b.x,b.z)+3.2, b.z + (azar()-0.5)*2, '#8fd3ff', (azar()-0.5)*3, 2+azar()*3, (azar()-0.5)*3, 40, 0.15, {grav:10, alfa:0.8}); } break;
      case 'banoSale': ferDentro = false; sfx.puerta(); redEvento('popo', {x:J.x, y:J.y, z:J.z}); setTimeout(()=>{ banosMesh[e.bano].puertaObj = 0; }, 900); confeti(J.x, J.y, J.z, 20); grande('¡POPO HECHO! 💩 +500', '#ffb070', 100); break;
      case 'estrella': sfx.estrella(); confeti(J.x, J.y, J.z, 60); redEvento('estrella', {x:J.x, y:J.y, z:J.z}); grande('¡ESTRELLA! ⭐ '+e.total+'/'+MISIONES.length, '#ffe36e', 150); estrellaAnim = {t:0}; guardar();
        if (e.id!=='popo' && e.id!=='banos'){ hablar('¡Muy bien, mi pichunguito! ¡Eres un campeón!'); burbuja('¡Muy bien, mi pichunguito! ¡Eres un campeón!', 'Tío Juan'); }
        if (e.id==='avion') arosMesh.forEach(m=>m.material.color.copy(lin(0x7dffa0)));
        break;
      case 'montar': sfx.montar(); motorArrancar(e.id); grande(VEHICULOS_DEF.find(v=>v.id===e.id).emoji+' ¡A MANEJAR!', '#bfe9ff', 70); break;
      case 'bajar': sfx.bajar(); motorParar(); break;
      case 'noBajar': sfx.no(); aviso(e.id==='avion' ? 'Aterriza y frena para bajarte ✈️' : e.id==='sub' ? 'Sube a la superficie (A) para bajarte 🤿' : 'Frena primero para bajarte'); break;
      case 'despegue': sfx.despegue(); grande('¡DESPEGUE! ✈️', '#bfe9ff', 70); break;
      case 'aterriza': sfx.aterriza(); for (let i=0;i<8;i++) particula(J.x+(azar()-0.5)*2, J.y+0.3, J.z+(azar()-0.5)*2, '#d8c8a0', (azar()-0.5)*4, 1+azar()*2, (azar()-0.5)*4, 30, 0.3, {alfa:0.6, crece:1.5}); break;
      case 'rebote': sfx.choque(); sacudida = 10; break;
      case 'estelaAire': particula(e.x, e.y, e.z, '#ffffff', 0, 0.3, 0, 70, 0.5, {alfa:0.5, crece:2.5}); break;
      case 'estela': particula(e.x + (azar()-0.5)*2, NIVEL_MAR+0.1, e.z + (azar()-0.5)*2, '#ffffff', (azar()-0.5)*2, 0.5, (azar()-0.5)*2, 45, 0.35, {alfa:0.7, crece:2}); break;
      case 'polvo': particula(e.x + (azar()-0.5), e.y+0.2, e.z + (azar()-0.5), e.agua ? '#ffffff' : '#d8c8a0', (azar()-0.5)*2, 1+azar(), (azar()-0.5)*2, 30, 0.3, {alfa:0.5, crece:2}); break;
      case 'burbujas': for (let i=0;i<3;i++) particula(e.x + (azar()-0.5)*1.5, e.y + (azar()-0.5), e.z + (azar()-0.5)*1.5, '#cfefff', (azar()-0.5), 1.2+azar()*1.5, (azar()-0.5), 55, 0.12+azar()*0.15, {alfa:0.55, flota:true}); break;
      case 'choque': if (tick - (P.ultimoChoqueV||0) > 20){ P.ultimoChoqueV = tick; sfx.choque(); sacudida = 8; chispas(e.x, J.y+0.8, e.z, '#ffffff', 6, 4); } break;
      case 'chapoteo': sfx.chapoteo(); for (let i=0;i<14;i++) particula(e.x + (azar()-0.5)*2, NIVEL_MAR+0.2, e.z + (azar()-0.5)*2, '#dff4ff', (azar()-0.5)*4, 2+azar()*4, (azar()-0.5)*4, 35, 0.2, {grav:10, alfa:0.85}); break;
      case 'saludo': sfx.saludo(); { const f = porId(e.id); for (let i=0;i<8;i++) particula(f.x + (azar()-0.5)*1.5, altura(f.x,f.z)+2+azar(), f.z + (azar()-0.5)*1.5, '#ff6ec0', (azar()-0.5)*1.5, 1+azar()*1.5, (azar()-0.5)*1.5, 50, 0.2, {alfa:0.9}); if (e.primera) grande('¡HOLA '+f.nombre.toUpperCase()+'! 💗', '#ff9ed6', 80); } break;
      case 'eructo': sfx.eructo(); break;
      case 'popito': sfx.perro(); grande('¡UN POPO BEBÉ TE SIGUE! 💩 '+e.total, '#ffb070', 110); for (let i=0;i<8;i++) particula(J.x + (azar()-0.5)*2, J.y+1.5+azar(), J.z + (azar()-0.5)*2, '#ff6ec0', (azar()-0.5)*1.5, 1+azar()*1.5, (azar()-0.5)*1.5, 50, 0.18, {alfa:0.9}); break;
      case 'perro': sfx.perro(); grande('¡'+PERROS_DEF.find(p=>p.id===e.id).nombre.toUpperCase()+' TE SIGUE! 🐕', '#fff', 80); break;
      case 'bandera': sfx.bandera(); banderasMesh[e.id].bandera.material.color.copy(lin(0xffd23f)); { const b = BANDERAS[e.id]; chispas(b.x, altura(b.x,b.z)+5, b.z, '#ffe36e', 20, 8); } grande('🚩 BANDERA '+e.total+'/'+BANDERAS.length, '#ffe36e', 60); break;
      case 'aro': sfx.aro(); arosMesh[e.id].material.color.copy(lin(0x7dffa0)); { const a = AROS[e.id]; chispas(a.x, a.y, a.z, '#ffe36e', 26, 9); } grande('⭕ ARO '+e.total+'/'+AROS.length, '#ffe36e', 60); break;
      case 'rampa': aroRampa.material.color.copy(lin(0x7dffa0)); chispas(RAMPA.aro.x, RAMPA.aro.y, RAMPA.aro.z, '#ffe36e', 30, 9); grande('¡RAMPA SALTADA! 🏍️', '#ffe36e', 90); break;
      case 'cofre': sfx.cofre(); confeti(COFRE.x, altura(COFRE.x, COFRE.z)+2, COFRE.z, 40); grande('¡EL TESORO! 💎', '#ffe36e', 120); break;
      case 'salto': sfx.salto(); redEvento('salto', {x:J.x, y:J.y, z:J.z}); break;
      case 'brinco': sfx.brinco(); break;
      case 'sinGanas': aviso('Come una hamburguesa 🍔 y después ven al baño'); break;
      case 'final': sfx.final(); setTimeout(()=>{ if (estado==='juego'){ estado = 'final'; hablar('Te amo tío Juan, yo soy tu pichunguito'); burbuja('Te amo tío Juan, yo soy tu pichunguito', 'Fernando'); setTimeout(()=>{ hablar('¡Ganaste! ¡Te amo tío Juan!'); }, 3500); } }, 2500); break;
    }
  }
  P.eventos.length = 0;
}

/* ---- los modelos siguen al núcleo ---- */
const tmpV = new THREE.Vector3();
function sincronizar(){
  const J = P.J, t = tick*DT;
  /* Fernando a pie */
  fer.visible = !P.veh && !ferDentro;
  fer.position.set(J.x, J.y, J.z); fer.rotation.y = J.ang;
  const apretado = P.ganas && !J.nadando;
  animarPersona(fer, J.mov*(apretado ? 1.8 : 1), J.fase*(apretado ? 1.6 : 1), !J.suelo && !J.nadando, J.nadando);
  fer.rotation.x = J.nadando ? 1.2 : 0;
  if (apretado){ fer.partes.pI.rotation.z = 0.25; fer.partes.pD.rotation.z = -0.25; fer.partes.bI.rotation.x = -1.2; fer.partes.bD.rotation.x = -1.2; fer.rotation.z = Math.sin(J.fase*1.6)*0.08; }
  else { fer.partes.pI.rotation.z = 0; fer.partes.pD.rotation.z = 0; fer.rotation.z = 0; }
  /* los vehículos */
  for (const v of P.vehiculos){
    const m = vehMesh[v.id], R = m.partes;
    m.position.set(v.x, v.y, v.z);
    let cab = -v.cabeceo, rol = 0;
    if (v.id==='barco'){ cab = (ola(v.x + Math.sin(v.ang)*2, v.z + Math.cos(v.ang)*2, t) - ola(v.x - Math.sin(v.ang)*2, v.z - Math.cos(v.ang)*2, t))*-0.25 - v.vel*0.004; rol = v.giro*0.12 + (ola(v.x + Math.cos(v.ang)*1.5, v.z - Math.sin(v.ang)*1.5, t) - ola(v.x - Math.cos(v.ang)*1.5, v.z + Math.sin(v.ang)*1.5, t))*0.3; }
    else if (v.id==='avion') rol = v.aire ? v.giro*0.7 : v.giro*0.05;
    else if (v.id==='moto') rol = v.giro*0.45*Math.min(1, Math.abs(v.vel)/8);
    else if (v.id==='carro') rol = v.giro*0.06*Math.min(1, Math.abs(v.vel)/8);
    else if (v.id==='sub') rol = v.giro*0.15;
    m.rotation.set(cab, v.ang, rol, 'YXZ');
    for (const w of R.ruedas){ w.giro.rotation.x += v.vel*DT/w.r; if (w.delante) w.dir.rotation.y = v.giro*0.45; }
    if (R.helice) R.helice.rotation.z += (P.veh===v ? 0.3 + Math.abs(v.vel)*0.03 : 0.02);
    if (R.bandera) ondearBandera(R.bandera, t);
    R.sombra.visible = v.id!=='sub';
    if (R.sombra.visible){ const g = altura(v.x, v.z); const alt = clamp(v.y - Math.max(g, NIVEL_MAR), 0, 40); R.sombra.position.y = -alt + 0.05 - (v.y - Math.max(g, NIVEL_MAR)) + alt; R.sombra.position.y = -(v.y - Math.max(g, NIVEL_MAR)) + 0.06; R.sombra.material.opacity = 0.18*(1-alt/40); }
    { const dv = Math.hypot(v.x-J.x, v.z-J.z); m.etiqueta.visible = P.veh!==v && dv < 70 && dv > 5; }
  }
  /* Fernando sentado dentro del vehículo */
  if (P.veh){
    const m = vehMesh[P.veh.id], R = m.partes;
    if (ferSentado.parent !== m){ if (ferSentado.parent) ferSentado.parent.remove(ferSentado); m.add(ferSentado); }
    ferSentado.visible = true;
    ferSentado.position.set(R.asiento.x, R.asiento.y, R.asiento.z); ferSentado.scale.setScalar(ferSentado.esc*R.asiento.esc);
    ferSentado.rotation.set(0,0,0);
    animarPersona(ferSentado, 0, 0, false, false, !R.asiento.parado);
    if (R.asiento.parado){ ferSentado.partes.bI.rotation.x = -1.3; ferSentado.partes.bD.rotation.x = -1.3; }
  } else ferSentado.visible = false;
  /* los perritos */
  P.perros.forEach(p=>{
    const m = perrosMesh[p.id];
    m.visible = !p.dentro;
    m.position.set(p.x, p.y, p.z); m.rotation.y = p.ang;
    animarPerro(m, p.sigue ? p.mov : 0, p.fase);
    if (!p.sigue) m.position.y += Math.abs(Math.sin(p.fase*2))*0.15;
    m.etiqueta.visible = !p.sigue;
  });
  /* los popos bebés brincan detrás */
  while (popitosMesh.length < P.popitos.length){ const m = armarPopito(); scene.add(m); popitosMesh.push(m); }
  popitosMesh.forEach((m, i)=>{
    const p = P.popitos[i];
    if (!p || p.dentro){ m.visible = false; return; }
    m.visible = true;
    const brinco = Math.abs(Math.sin(p.fase))*0.35*Math.min(1, p.mov/2.5);
    m.position.set(p.x, p.y + brinco, p.z); m.rotation.y = p.ang;
    m.scale.set(1 - brinco*0.25, 1 + brinco*0.35 + Math.sin(p.fase*0.7)*0.03, 1 - brinco*0.25);
  });
  /* Tío Juan vuela al lado de Fernando */
  {
    const ang = J.ang, lado = P.veh ? (P.veh.id==='avion' ? 7 : 4.2) : 2.4, atras = P.veh ? 2 : 1.4, alto = (P.veh ? 3.2 : 2.6) + Math.sin(t*2.1)*0.25;
    const ox = J.x + Math.cos(ang)*lado - Math.sin(ang)*atras, oz = J.z - Math.sin(ang)*lado - Math.cos(ang)*atras;
    let oy = J.y + alto;
    const g = altura(ox, oz); if (oy < g + 1.5) oy = g + 1.5;
    tmpV.set(ox, oy, oz);
    tioJuan.position.lerp(tmpV, P.veh ? 0.12 : 0.08);
    const vel = Math.hypot(tmpV.x - tioJuan.position.x, tmpV.z - tioJuan.position.z);
    tioJuan.rotation.set(0.9 + Math.min(0.4, vel*0.02), ang, 0, 'YXZ');
    tioJuan.partes.pI.rotation.x = 0.2 + Math.sin(t*3)*0.1; tioJuan.partes.pD.rotation.x = 0.2 - Math.sin(t*3)*0.1;
    ondearCapa(tioJuan.partes.capa, t, 0.6 + Math.min(1, vel));
  }
  /* la familia mira a Fernando cuando se acerca */
  for (const f of FAMILIA){
    const m = familiaMesh[f.id];
    const d = Math.hypot(f.x-J.x, f.z-J.z);
    if (d > 120) continue;
    const obj = d < 12 ? Math.atan2(J.x-f.x, J.z-f.z) : f.ang;
    m.rotation.y = envolver(m.rotation.y + envolver(obj - m.rotation.y)*0.08);
    m.fase += DT*2;
    const sal = P.saludos[f.id+'T'] && P.t - P.saludos[f.id+'T'] < 90;
    animarPersona(m, sal ? 5 : 0, sal ? m.fase*6 : m.fase, false, false);
    if (sal){ m.partes.bD.rotation.x = -2.6 + Math.sin(m.fase*8)*0.4; m.position.y = altura(f.x, f.z) + Math.abs(Math.sin(m.fase*6))*0.35; } else m.position.y = altura(f.x, f.z);
    m.etiqueta.visible = d < 40 && d > 4;
  }
  /* el Señor Popo */
  {
    const s = posSrPopo(P);
    tmpV.set(s.x, altura(s.x, s.z), s.z);
    if (srPopo.position.distanceTo(tmpV) > 30) srPopo.position.copy(tmpV); else srPopo.position.lerp(tmpV, 0.2);
    srPopo.rotation.y = envolver(srPopo.rotation.y + envolver(Math.atan2(J.x-srPopo.position.x, J.z-srPopo.position.z) - srPopo.rotation.y)*0.06);
    srPopo.fase += DT*(P.escena ? 9 : 3);
    const brinco = P.escena ? Math.abs(Math.sin(srPopo.fase))*0.8 : 0;
    srPopo.position.y += brinco;
    srPopo.scale.set(0.95*(1 - brinco*0.1), 0.95*(1 + Math.sin(srPopo.fase)*0.05 + brinco*0.15), 0.95*(1 - brinco*0.1));
    srPopo.partes.bD.rotation.z = 0.5 + (P.escena || Math.hypot(J.x-srPopo.position.x, J.z-srPopo.position.z) < 8 ? 1.6 + Math.sin(srPopo.fase*4)*0.5 : 0);
    srPopo.visible = P.srPopo.visible;
  }
  /* las puertas de los baños */
  banosMesh.forEach((g, i)=>{
    g.puerta.rotation.y = lerp(g.puerta.rotation.y, -1.75*(g.puertaObj||0), 0.12);
    const b = BANOS[i];
    if (sacudidaBano > 0 && P.escena && P.escena.bano===i){ g.position.set(b.x + (azar()-0.5)*0.12, altura(b.x,b.z), b.z + (azar()-0.5)*0.12); g.rotation.z = (azar()-0.5)*0.04; }
    else { g.position.set(b.x, altura(b.x,b.z), b.z); g.rotation.z = 0; }
  });
  if (sacudidaBano > 0) sacudidaBano--;
  /* hamburguesas girando, aros, cofre, letreros */
  hambMesh.forEach((m, i)=>{ if (!m.visible) return; if (Math.abs(m.position.x-J.x) > 160 || Math.abs(m.position.z-J.z) > 160) return; m.rotation.y = t*1.6; m.position.y = HAMBURGUESAS[i].y + Math.sin(t*2.4 + i)*0.18; });
  arosMesh.forEach((m, i)=>{ m.rotation.z = t*0.5 + i; m.rotation.y = Math.atan2(J.x-m.position.x, J.z-m.position.z)*0 ; });
  aroRampa.rotation.z = t*0.8;
  cofre.haz.material.opacity = 0.12 + Math.sin(t*2)*0.05; cofre.rotation.y = 0.6 + Math.sin(t*0.5)*0.1;
  for (const l of letreros) l.giro.rotation.y = t*0.6;
  /* la estrella que sube cuando se gana una */
  if (estrellaAnim){
    if (!estrellaAnim.m){ estrellaAnim.m = new THREE.Mesh(geoEstrella, matEstrella); estrellaAnim.m.scale.setScalar(1.6); scene.add(estrellaAnim.m); }
    estrellaAnim.t++;
    const k = estrellaAnim.t/150;
    estrellaAnim.m.position.set(J.x, J.y + 2.5 + k*4, J.z); estrellaAnim.m.rotation.y = estrellaAnim.t*0.08; estrellaAnim.m.scale.setScalar(1.6*(1 + Math.sin(k*Math.PI)*0.4));
    if (estrellaAnim.t % 6 === 0) chispas(estrellaAnim.m.position.x, estrellaAnim.m.position.y, estrellaAnim.m.position.z, '#ffe36e', 3, 3);
    if (estrellaAnim.t > 150){ scene.remove(estrellaAnim.m); estrellaAnim = null; }
  }
}
function ondearBandera(b, t){
  const pos = b.geometry.attributes.position;
  for (let i=0;i<pos.count;i++){ const x = pos.getX(i); const k = -x; pos.setZ(i, Math.sin(t*8 + k*6)*0.08*k); }
  pos.needsUpdate = true;
}

/* ---- la cámara: detrás de Fernando o de su vehículo, suavecita ---- */
function camaraJuego(){
  const J = P.J, v = P.veh;
  let objYaw = camYaw;
  if (v) objYaw = v.ang; else if (J.mov > 0.6) objYaw = J.ang;
  camYaw = envolver(camYaw + envolver(objYaw - camYaw)*(v ? 0.07 : 0.035));
  const cfg = v ? CAM_CFG[v.id] : (J.nadando ? CAM_CFG.nadar : CAM_CFG.pie);
  let dist = cfg.d, alt = cfg.h;
  if (v && v.id==='avion' && v.aire){ alt = cfg.h - v.cabeceo*7; dist = cfg.d + Math.abs(v.cabeceo)*3; }
  if (v) dist += Math.abs(v.vel)*0.08;
  const fx = Math.sin(camYaw), fz = Math.cos(camYaw);
  let ox = J.x - fx*dist, oy = J.y + alt, oz = J.z - fz*dist;
  const g = altura(ox, oz) + 1.3;
  if (oy < g) oy = g;
  if (v && v.id==='sub' && v.y < NIVEL_MAR - 1.5) oy = Math.min(oy, NIVEL_MAR - 0.8);
  else if (!v && J.nadando) oy = Math.max(oy, NIVEL_MAR + 1.6);
  tmpV.set(ox, oy, oz);
  camPos.lerp(tmpV, v ? 0.12 : 0.1);
  const adelante = v ? clamp(v.vel*0.12, -3, 5) : 0;
  tmpV.set(J.x + Math.sin(J.ang)*adelante, J.y + cfg.mira, J.z + Math.cos(J.ang)*adelante);
  camMira.lerp(tmpV, 0.16);
  camera.position.copy(camPos);
  if (sacudida > 0){ sacudida--; camera.position.x += (azar()-0.5)*0.4; camera.position.y += (azar()-0.5)*0.4; }
  camera.lookAt(camMira);
  fovObj = 70 + (v ? Math.min(14, Math.abs(v.vel)*0.3) : 0) + (v && v.turbo > 0.5 ? 6 : 0);
  camera.fov += (fovObj - camera.fov)*0.05; camera.updateProjectionMatrix();
}
function camaraMenu(){
  const t = tick*DT*0.12;
  const cx = PUEBLO.x + Math.cos(t)*70, cz = PUEBLO.z + Math.sin(t)*70;
  tmpV.set(cx, Math.max(altura(cx, cz)+6, 26), cz);
  camPos.lerp(tmpV, 0.05);
  tmpV.set(FUENTE.x, 6, FUENTE.z); camMira.lerp(tmpV, 0.05);
  camera.position.copy(camPos); camera.lookAt(camMira);
  camera.fov += (62 - camera.fov)*0.05; camera.updateProjectionMatrix();
}
/* el aire y el agua: niebla, cielo y luz cambian cuando la cámara se hunde */
function ambiente(){
  const bajo = camera.position.y < NIVEL_MAR + ola(camera.position.x, camera.position.z, tick*DT);
  bajoF += ((bajo ? 1 : 0) - bajoF)*0.15;
  scene.fog.color.copy(NIEBLA.aire).lerp(NIEBLA.agua, bajoF);
  scene.fog.density = lerp(0.0014, 0.011, bajoF);
  cupula.material.uniforms.arriba.value.copy(CIELO.arriba).lerp(CIELO.arribaAgua, bajoF);
  cupula.material.uniforms.horizonte.value.copy(CIELO.horizonte).lerp(CIELO.horizonteAgua, bajoF);
  agua.material.uniforms.bajo.value = bajo ? 1 : 0;
  agua.material.uniforms.t.value = tick*DT;
  sol.visible = bajoF < 0.5;
  luzSol.intensity = lerp(1.05, 0.5, bajoF);
  luzCielo.intensity = lerp(0.6, 0.45, bajoF);
  luzCielo.color.copy(lin(0xcfe9ff)).lerp(lin(0x2a7ab0), bajoF);
  luzAmb.intensity = lerp(0.1, 0.3, bajoF);
  cupula.position.copy(camera.position);
  sol.position.set(camera.position.x + 600, camera.position.y + 800, camera.position.z + 470);
  enfocarLuz(P.J.x, P.J.y, P.J.z);
}

/* ---- un paso del juego ---- */
function actualizar(){
  tick++;
  leerMandos();
  if (estado==='juego'){
    const ent = entradaForzada ? Object.assign({}, entradaForzada) : leerEntrada(); ent.camYaw = camYaw;
    pasoPartida(P, ent);
    atenderEventos();
    if (P.veh) motorAjustar(P.veh.vel, P.veh.turbo); else motorParar();
    if (tick - ultimoGuardado > 600){ ultimoGuardado = tick; guardar(); }
  } else motorParar();
  if (estado==='juego' || estado==='pausa' || estado==='amigos') redPaso();
  sincronizar(); sincronizarRemotos();
  pasoNubes(); pasoGaviotas(); pasoPeces(); pasoAlgas(); pasoParticulas();
  if (estado==='menu') camaraMenu(); else camaraJuego();
  if (RED.estado==='conectado' && estado==='menu') estado = 'juego';
  ambiente();
  if (cortina > 0) cortina--;
  if (mensajeGrande && --mensajeGrande.t <= 0) mensajeGrande = null;
  for (let i=burbujas.length-1;i>=0;i--) if (--burbujas[i].t <= 0) burbujas.splice(i,1);
  if (avisoT > 0) avisoT--;
  if (MANDO.avisoT > 0) MANDO.avisoT--;
  const tema = estado==='menu' ? TEMA_MENU : (bajoF > 0.5 ? TEMA_MAR : (P.veh && P.veh.id==='avion' && P.veh.aire ? TEMA_CIELO : TEMA_ISLA));
  programarMusica(tema);
}

/* ---------------- El marcador en 2D ---------------- */
const TIT = "'Luckiest Guy','Fredoka','Arial Black','Impact',sans-serif";
const TXT = "'Fredoka','Nunito','Trebuchet MS','Arial Rounded MT Bold',sans-serif";
function texto(t, x, y, tam, color, alin, titular){
  ctx.font = (titular ? '' : 'bold ')+tam+'px '+(titular ? TIT : TXT);
  ctx.textAlign = alin||'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = color||'#fff'; ctx.fillText(t, x, y);
}
function textoBorde(t, x, y, tam, color, alin, titular){
  ctx.font = (titular ? '' : 'bold ')+tam+'px '+(titular ? TIT : TXT);
  ctx.textAlign = alin||'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(3, tam*0.16); ctx.strokeStyle = 'rgba(20,20,40,0.85)'; ctx.strokeText(t, x, y);
  ctx.fillStyle = color||'#fff'; ctx.fillText(t, x, y);
}
function titulo(t, x, y, tam, c1, c2, alin){
  ctx.font = tam+'px '+TIT; ctx.textAlign = alin||'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round'; ctx.lineWidth = tam*0.2; ctx.strokeStyle = '#2a1a0a'; ctx.strokeText(t, x, y+3);
  const g = ctx.createLinearGradient(0, y-tam/2, 0, y+tam/2); g.addColorStop(0, c1||'#fff6a0'); g.addColorStop(1, c2||'#ffb000');
  ctx.fillStyle = g; ctx.fillText(t, x, y);
}
function cristal(x,y,w,h,r,alfa){
  ctx.fillStyle = 'rgba(15,20,45,'+(alfa===undefined?0.5:alfa)+')';
  ctx.beginPath(); ctx.roundRect(x,y,w,h,r||12); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1.5; ctx.stroke();
}
function boton(x,y,w,h,txt,c1,c2,tam,brilla){
  const g = ctx.createLinearGradient(0,y,0,y+h); g.addColorStop(0,c1); g.addColorStop(1,c2);
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x,y,w,h,h/2); ctx.fill();
  ctx.lineWidth = brilla ? 4 : 2; ctx.strokeStyle = brilla ? '#fff6a0' : 'rgba(255,255,255,0.6)'; ctx.stroke();
  textoBorde(txt, x+w/2, y+h/2+1, tam||20, '#fff', 'center', true);
}
function vineta(f){
  const g = ctx.createRadialGradient(W/2, H/2, H*0.45, W/2, H/2, H*0.95);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,'+f+')');
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
}
function botonAtras(txt){ const z = zonaAtras(); boton(z.x, z.y, z.w, z.h, txt, '#4a6ad0', '#2a3a90', 17); }
/* el mapita: la isla pintada una vez, y encima Fernando, los baños y los vehículos */
const mapaImg = (()=>{
  const c = document.createElement('canvas'); c.width = c.height = 200;
  const x = c.getContext('2d'), im = x.createImageData(200, 200), d = im.data;
  for (let j=0;j<200;j++) for (let i=0;i<200;i++){
    const h = alturaMalla((i/200-0.5)*1240, (j/200-0.5)*1240);
    let r,g,b;
    if (h < -0.4){ const k = clamp(-h/30, 0, 1); r = 40*(1-k)+10*k; g = 150*(1-k)+60*k; b = 220*(1-k)+140*k; }
    else if (h < 1.8){ r = 240; g = 222; b = 160; }
    else if (h > 50){ r = 245; g = 245; b = 250; }
    else { const k = clamp((h-2)/40, 0, 1); r = 110*(1-k)+70*k; g = 200*(1-k)+120*k; b = 70*(1-k)+60*k; }
    const o = (j*200+i)*4; d[o]=r; d[o+1]=g; d[o+2]=b; d[o+3]=255;
  }
  x.putImageData(im, 0, 0);
  x.strokeStyle = 'rgba(60,60,80,0.9)'; x.lineWidth = 1.6; x.beginPath();
  RUTA.M.forEach((m, i)=>{ const px = (m.x/1240+0.5)*200, pz = (m.z/1240+0.5)*200; if (i===0) x.moveTo(px, pz); else x.lineTo(px, pz); }); x.closePath(); x.stroke();
  x.strokeStyle = 'rgba(200,200,210,0.9)'; x.lineWidth = 2.5; x.beginPath(); x.moveTo((PISTA.x/1240+0.5)*200, (PISTA.z0/1240+0.5)*200); x.lineTo((PISTA.x/1240+0.5)*200, (PISTA.z1/1240+0.5)*200); x.stroke();
  return c;
})();
function dibujarMapa(cx, cy, r){
  const J = P.J, esc_ = (r*2)/1240;
  const aM = (x, z)=>({x: cx + x*esc_, y: cy + z*esc_});
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.clip();
  ctx.drawImage(mapaImg, cx-r, cy-r, r*2, r*2);
  const obj = objetivo(P);
  for (const b of BANOS){ const p = aM(b.x, b.z); ctx.fillStyle = P.prog.banos.includes(b.id) ? '#7dffa0' : '#8fd3ff'; ctx.fillRect(p.x-2.5, p.y-2.5, 5, 5); }
  for (const v of P.vehiculos){ if (P.veh===v) continue; const p = aM(v.x, v.z); ctx.font = '9px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(v.emoji, p.x, p.y); }
  if (obj.x !== null && obj.x !== undefined){ const p = aM(obj.x, obj.z); ctx.strokeStyle = '#ffe36e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 4 + Math.sin(tick*0.15)*2, 0, Math.PI*2); ctx.stroke(); }
  for (const [, r] of RED.remotos){ const q = aM(r.act.x, r.act.z); ctx.fillStyle = '#4fc3f7'; ctx.beginPath(); ctx.arc(q.x, q.y, 3.5, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke(); }
  const p = aM(J.x, J.z);
  ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + Math.sin(J.ang)*8, p.y + Math.cos(J.ang)*8); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
}
function flecha(x, y, ang, tam, color){
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = color; ctx.strokeStyle = 'rgba(20,20,40,0.8)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, -tam); ctx.lineTo(tam*0.7, tam*0.6); ctx.lineTo(0, tam*0.2); ctx.lineTo(-tam*0.7, tam*0.6); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function dibujarPalancaYBotones(){
  if (!tactil || MANDO.activo) return;
  const p = TOQUE.palanca;
  const base = p ? {x:p.x0, y:p.y0} : {x: 90, y: H-90};
  ctx.globalAlpha = p ? 0.9 : 0.45;
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.arc(base.x, base.y, 52, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2; ctx.stroke();
  const j = palancaTactil(); const kx = base.x + j.jx*36, ky = base.y - j.jy*36;
  ctx.fillStyle = 'rgba(255,255,255,0.65)'; ctx.beginPath(); ctx.arc(kx, ky, 22, 0, Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;
  const activos = new Set([...TOQUE.botones.values()].map(b=>b.id));
  for (const b of BOTONES_TACTILES){
    if (b.solo==='veh' && !P.veh) continue;
    const pos = b.pos(), on = activos.has(b.id);
    ctx.fillStyle = b.color; ctx.beginPath(); ctx.arc(pos.x, pos.y, b.r*(on ? 1.1 : 1), 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = b.borde; ctx.lineWidth = 2.5; ctx.stroke();
    textoBorde(b.txt, pos.x, pos.y+1, b.r*0.9, '#fff', 'center', b.id==='A'||b.id==='B');
  }
}
function dibujarMenu(){
  vineta(0.35);
  const g = ctx.createLinearGradient(0, 0, 0, 150); g.addColorStop(0, 'rgba(10,20,60,0.7)'); g.addColorStop(1, 'rgba(10,20,60,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 150);
  titulo('FERNANDO Y TÍO JUAN', W/2, 78 + Math.sin(tick*0.04)*3, Math.min(64, W*0.075), '#fff6a0', '#ffb000');
  titulo('LA GRAN AVENTURA', W/2, 140, Math.min(44, W*0.05), '#bfe9ff', '#2a8ad0');
  cristal(W/2-250, H-190, 500, 84, 18, 0.55);
  texto('Una isla entera para explorar: carro 🚗 · moto 🏍️ · barco 🚤 · avión ✈️ · submarino 🤿', W/2, H-165, 15, '#fff');
  texto('Come hamburguesas 🍔, corre al baño 🚽 del Señor Popo 💩 y saluda a toda la familia 👨‍👩‍👧', W/2, H-140, 15, '#ffe36e');
  texto(tactil ? 'Palanca a la izquierda · A salta y monta · B corre y turbo · 🚪 para bajarte' : 'Flechas o WASD · ESPACIO salta y monta · MAYÚS corre y turbo · E para bajarte · ESC menú', W/2, H-118, 13, '#bcd6ff');
  if (Math.floor(tick/30)%2===0) textoBorde(tactil ? 'TOCA PARA JUGAR' : 'PULSA ENTER PARA JUGAR', W/2, H-70, 30, '#fff', 'center', true);
  if (P.estrellas.length) textoBorde('⭐ '+P.estrellas.length+'/'+MISIONES.length+' · tu aventura sigue donde la dejaste', W/2, H-32, 16, '#ffe36e');
  botonAtras('◀ FERNANDO BROS');
  boton(W-190, 12, 176, 42, '👥 CON AMIGOS', '#2a8ad0', '#1a4a90', 16, !!RED.pendiente);
  if (RED.pendiente) textoBorde('🎉 Te invitaron a la sala '+RED.pendiente+' · toca para entrar', W/2, H-96, 18, '#7dffa0');
  texto('🎮 Funciona con mando · 📱 con los dedos · 👥 en línea con amigos', W-14, 66, 13, '#bcd6ff', 'right');
}
function dibujarAmigos(){
  ctx.fillStyle = 'rgba(5,10,30,0.82)'; ctx.fillRect(0,0,W,H);
  const z = zonaAmigos();
  titulo('JUGAR CON AMIGOS', W/2, 44, 40, '#bfe9ff', '#2a8ad0');
  botonAtras('◀ VOLVER');
  boton(z.guia.x, z.guia.y, z.guia.w, z.guia.h, '📖 GUÍA', '#4a6ad0', '#2a3a90', 16);
  if (RED.entrandoCodigo){
    texto('Escribe el código de la sala (4 letras o números)', W/2, 100, 17, '#fff');
    const cod = (RED.codigo + '____').slice(0,4).split('').join('  ');
    cristal(W/2-140, 120, 280, 56, 16, 0.6); titulo(cod, W/2, 150, 40, '#fff6a0', '#ffb000');
    for (const t of z.teclas){ boton(t.x, t.y, t.w, t.h, t.ch, '#3a4a90', '#22306a', 20); }
    boton(z.borrar.x, z.borrar.y, z.borrar.w, z.borrar.h, '⌫ BORRAR', '#8a3a30', '#5a1a10', 16);
    boton(z.entrar.x, z.entrar.y, z.entrar.w, z.entrar.h, '✅ ENTRAR', RED.codigo.length===4 ? '#3aa040' : '#4a4a4a', RED.codigo.length===4 ? '#1e6a24' : '#2a2a2a', 16, RED.codigo.length===4);
    if (RED.error) texto(RED.error, W/2, H-84, 14, '#ff9e9e');
    return;
  }
  if (RED.estado==='off' || RED.estado==='error'){
    texto('¿Quién eres tú?', W/2, 84, 15, '#bcd6ff');
    z.pjs.forEach((zp, i)=>{ const pj = PERSONAJES_RED[i], sel = pj.id===RED.pj;
      cristal(zp.x, zp.y, zp.w, zp.h, 12, sel ? 0.8 : 0.4); if (sel){ ctx.strokeStyle = '#ffe36e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(zp.x, zp.y, zp.w, zp.h, 12); ctx.stroke(); }
      texto(pj.emoji, zp.x+zp.w/2, zp.y+24, 24, '#fff'); texto(pj.nombre, zp.x+zp.w/2, zp.y+49, 12, sel ? '#ffe36e' : '#fff'); });
  }
  if (RED.estado==='off'){
    cristal(W/2-330, 176, 660, 78, 16, 0.5);
    texto('Uno crea la sala y comparte el enlace o el código de 4 letras.', W/2, 200, 15, '#fff');
    texto('Los demás entran con ese código y todos juegan en la misma isla, cada uno con su aventura.', W/2, 222, 14, '#bcd6ff');
    texto(hayPeerJS() ? 'Gratis, sin cuentas. Los dos aparatos necesitan internet.' : '⚠️ No se cargó la parte de red: revisa la conexión y recarga.', W/2, 242, 13, hayPeerJS() ? '#7dffa0' : '#ff9e9e');
    boton(z.crear.x, z.crear.y, z.crear.w, z.crear.h, '🏝️ CREAR UNA SALA', '#3aa040', '#1e6a24', 20, true);
    boton(z.unirme.x, z.unirme.y, z.unirme.w, z.unirme.h, '🔑 ENTRAR CON CÓDIGO', '#2a8ad0', '#1a4a90', 20);
    return;
  }
  if (RED.estado==='creando' || RED.estado==='uniendo'){
    const puntos = '.'.repeat(1 + Math.floor(tick/20)%3);
    titulo(RED.estado==='creando' ? 'Creando la sala'+puntos : 'Entrando a la sala '+RED.sala+puntos, W/2, H/2, 34, '#fff6a0', '#ffb000');
    texto('Esto tarda unos segundos', W/2, H/2+40, 15, '#bcd6ff');
    return;
  }
  if (RED.estado==='error'){
    cristal(W/2-330, 176, 660, 100, 16, 0.6);
    texto('😕 No se pudo', W/2, 200, 20, '#ff9e9e');
    ctx.font = 'bold 15px '+TXT; const palabras = RED.error.split(' '); let linea = '', y = 226;
    for (const w of palabras){ const t = linea ? linea+' '+w : w; if (ctx.measureText(t).width > 620){ texto(linea, W/2, y, 15, '#fff'); linea = w; y += 20; } else linea = t; }
    texto(linea, W/2, y, 15, '#fff');
    boton(z.reintentar.x, z.reintentar.y, z.reintentar.w, z.reintentar.h, '🔁 INTENTAR DE NUEVO', '#3aa040', '#1e6a24', 18, true);
    return;
  }
  /* sala creada o conectado */
  const nombres = [nombreLocal()+' (tú)', ...[...RED.remotos.values()].map(r=>r.nombre)];
  if (RED.estado==='sala'){
    texto('Tu sala está lista. Diles este código:', W/2, 96, 17, '#fff');
    cristal(W/2-170, 116, 340, 76, 20, 0.6); titulo(RED.sala.split('').join('  '), W/2, 154, 54, '#fff6a0', '#ffb000');
    texto('o mándales el enlace por WhatsApp:', W/2, 212, 15, '#bcd6ff');
    cristal(W/2-330, 226, 660, 34, 17, 0.5); texto(enlaceSala(), W/2, 243, 13, '#7de0ff');
    boton(z.compartir.x, z.compartir.y, z.compartir.w, z.compartir.h, '📲 COMPARTIR', '#2a8ad0', '#1a4a90', 18);
    boton(z.copiar.x, z.copiar.y, z.copiar.w, z.copiar.h, '📋 COPIAR ENLACE', '#4a6ad0', '#2a3a90', 18);
  } else {
    titulo('Estás en la sala '+RED.sala, W/2, 130, 36, '#fff6a0', '#ffb000');
    texto('Puedes seguir jugando: tus amigos aparecen en la isla con su nombre encima.', W/2, 176, 15, '#bcd6ff');
  }
  cristal(W/2-330, H/2+118, 660, 34, 17, 0.5);
  texto('👥 En la isla: '+nombres.join(' · ')+(nombres.length===1 ? '  (esperando amigos…)' : ''), W/2, H/2+135, 14, '#fff');
  boton(z.jugar.x, z.jugar.y, z.jugar.w, z.jugar.h, '▶ ¡A JUGAR!', '#3aa040', '#1e6a24', 20, true);
  boton(W-190, H-64, 176, 46, '🚪 SALIR DE LA SALA', '#8a3a30', '#5a1a10', 14);
}
function dibujarHUD(){
  const J = P.J;
  vineta(0.22);
  /* arriba a la izquierda: estrellas, hamburguesas, puntos y las ganas de popo */
  cristal(12, 10, 222, 60, 14, 0.5);
  textoBorde('⭐ '+P.estrellas.length+'/'+MISIONES.length, 26, 30, 21, '#ffe36e', 'left');
  textoBorde('🍔 '+P.hamburguesas, 128, 30, 21, '#fff', 'left');
  texto(P.puntos.toLocaleString('es')+' puntos', 26, 56, 14, '#bcd6ff', 'left');
  const px = 12, py = 78, pw = 222, ph = 22;
  cristal(px, py, pw, ph, 11, 0.5);
  ctx.fillStyle = P.ganas ? (Math.floor(tick/10)%2 ? '#ff9040' : '#c05a10') : '#8a5a2a';
  ctx.beginPath(); ctx.roundRect(px+30, py+5, (pw-38)*P.popo, ph-10, 6); ctx.fill();
  texto('💩', px+16, py+ph/2+1, 15, '#fff');
  if (P.ganas) textoBorde('¡AL BAÑO!', px+pw/2+14, py+ph/2+1, 14, '#fff');
  /* el mapita y el objetivo, arriba a la derecha */
  dibujarMapa(W-80, 112, 62);
  const o = objetivo(P);
  const ancho = Math.min(300, W*0.36);
  cristal(W-ancho-12, 186, ancho, 44, 12, 0.5);
  ctx.font = 'bold 14px '+TXT; let txt = o.texto; while (ctx.measureText(txt).width > ancho-104 && txt.length > 8) txt = txt.slice(0, -2);
  if (txt !== o.texto) txt += '…';
  texto(txt, W-ancho+30, 208, 14, '#fff', 'left');
  if (o.x !== null && o.x !== undefined){
    const ang = envolver(Math.atan2(o.x-J.x, o.z-J.z) - camYaw);
    flecha(W-ancho+8, 208, -ang, 9, '#ffe36e');
    const d = Math.hypot(o.x-J.x, o.z-J.z);
    texto(d > 999 ? (d/1000).toFixed(1)+' km' : Math.round(d)+' m', W-24, 208, 12, '#bcd6ff', 'right');
  }
  /* avisos y frases */
  if (P.cercaVeh && !P.veh && !P.escena) textoBorde((tactil ? 'A' : 'ESPACIO')+' = MONTAR '+P.cercaVeh.emoji, W/2, H-96, 22, '#fff', 'center', true);
  if (P.veh){
    textoBorde(Math.round(Math.abs(P.veh.vel)*3.6)+' km/h', W/2, H-30, 18, '#fff');
    if (P.veh.id==='avion' && P.veh.aire) textoBorde(Math.round(P.veh.y)+' m de altura', W/2, H-52, 14, '#bfe9ff');
    if (P.veh.id==='sub') textoBorde(Math.round(-P.veh.y)+' m de profundidad', W/2, H-52, 14, '#bfe9ff');
    if (puedeBajar(P)) texto((tactil ? '🚪' : 'E')+' = bajarse', W/2, H-72, 13, '#bcd6ff');
  }
  if (redActiva()){ const n = RED.remotos.size + 1; cristal(W/2-120, 10, 240, 30, 15, 0.55); texto('👥 sala '+RED.sala+' · '+n+(n===1 ? ' jugador (esperando…)' : ' jugadores'), W/2, 25, 14, '#bfe9ff'); }
  if (avisoT > 0){ cristal(W/2-220, 92, 440, 34, 17, 0.6); texto(avisoTxt, W/2, 109, 15, '#ffe36e'); }
  burbujas.forEach((b, i)=>{
    const y = H - 150 - i*44, alfa = Math.min(1, b.t/20);
    ctx.globalAlpha = alfa;
    ctx.font = 'bold 17px '+TXT; const w = Math.min(W-40, ctx.measureText(b.txt).width + 40 + (b.quien ? 90 : 0));
    cristal(W/2-w/2, y-18, w, 36, 18, 0.65);
    if (b.quien) texto(b.quien+':', W/2-w/2+16, y+1, 15, '#ffe36e', 'left');
    texto(b.txt, W/2 + (b.quien ? 40 : 0), y+1, 17, '#fff');
    ctx.globalAlpha = 1;
  });
  if (mensajeGrande){
    const m = mensajeGrande, k = 1 - m.t/m.t0, esc_ = k < 0.1 ? k*10 : 1;
    ctx.save(); ctx.translate(W/2, H*0.32); ctx.scale(esc_, esc_);
    ctx.globalAlpha = m.t < 20 ? m.t/20 : 1;
    titulo(m.txt, 0, 0, Math.min(46, W*0.05), '#fff', m.color);
    ctx.restore(); ctx.globalAlpha = 1;
  }
  if (P.escena){ if (Math.floor(tick/20)%2===0) textoBorde('💩 Fernando está haciendo popo… 🚽', W/2, H*0.2, 24, '#ffb070', 'center', true); }
  if (P.veh && P.veh.turbo > 0.5){ ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2; for (let i=0;i<10;i++){ const a = azar()*6.28, r1 = H*0.45, r2 = H*0.75; ctx.beginPath(); ctx.moveTo(W/2+Math.cos(a)*r1, H/2+Math.sin(a)*r1); ctx.lineTo(W/2+Math.cos(a)*r2, H/2+Math.sin(a)*r2); ctx.stroke(); } }
  dibujarPalancaYBotones();
  if (!tactil && !MANDO.activo){ texto('ESC = misiones', W-14, H-14, 12, 'rgba(255,255,255,0.6)', 'right'); }
}
function dibujarPausa(){
  ctx.fillStyle = 'rgba(5,10,30,0.82)'; ctx.fillRect(0,0,W,H);
  titulo('LAS MISIONES', W/2, 42, 40, '#fff6a0', '#ffb000');
  const x0 = W/2-300, y0 = 76;
  cristal(x0, y0-6, 600, MISIONES.length*24+12, 16, 0.5);
  MISIONES.forEach((m, i)=>{
    const ok = P.estrellas.includes(m.id);
    let extra = '';
    if (m.id==='banos') extra = P.prog.banos.length+'/'+BANOS.length; else if (m.id==='carro') extra = P.prog.banderas.length+'/'+BANDERAS.length;
    else if (m.id==='avion') extra = P.prog.aros.length+'/'+AROS.length; else if (m.id==='familia') extra = P.prog.familia.length+'/'+SALUDABLES.length;
    texto((ok ? '⭐ ' : '☆ ')+m.emoji+'  '+m.titulo, x0+18, y0+12+i*24, 16, ok ? '#7dffa0' : '#fff', 'left');
    if (extra && !ok) texto(extra, x0+582, y0+12+i*24, 14, '#bcd6ff', 'right');
  });
  const zs = zonasPausa();
  const etiquetas = ['▶ SEGUIR JUGANDO', redActiva() ? '👥 SALA '+RED.sala+' · '+(RED.remotos.size+1)+' EN LA ISLA' : '👥 JUGAR CON AMIGOS', musicaOn ? '🎵 MÚSICA: SÍ' : '🔇 MÚSICA: NO', '🗑️ EMPEZAR DE CERO', '◀ FERNANDO BROS'];
  const colores = [['#3aa040','#1e6a24'],['#2a8ad0','#1a4a90'],['#4a6ad0','#2a3a90'],['#c05a10','#803a08'],['#4a6ad0','#2a3a90']];
  zs.forEach((z, i)=> boton(z.x, z.y, z.w, z.h, etiquetas[i], colores[i][0], colores[i][1], 16, selPausa===i));
  texto(P.puntos.toLocaleString('es')+' puntos · '+P.hamburguesas+' hamburguesas comidas', W/2, H-12, 13, '#bcd6ff');
}
function dibujarFinal(){
  ctx.fillStyle = 'rgba(5,10,30,0.55)'; ctx.fillRect(0,0,W,H);
  titulo('¡LO LOGRASTE TODO!', W/2, 80 + Math.sin(tick*0.06)*4, Math.min(60, W*0.07), '#fff6a0', '#ffb000');
  let s = ''; for (let i=0;i<MISIONES.length;i++) s += '⭐';
  textoBorde(s, W/2, 150, 40, '#ffe36e');
  cristal(W/2-260, 190, 520, 130, 18, 0.55);
  texto('Fernando hizo popo en todos los baños, manejó el carro,', W/2, 216, 17, '#fff');
  texto('saltó con la moto, voló por los aros, navegó hasta Santi,', W/2, 242, 17, '#fff');
  texto('encontró el tesoro y saludó a toda la familia.', W/2, 268, 17, '#fff');
  texto('¡Eres el pichunguito campeón de la isla! · '+P.puntos.toLocaleString('es')+' puntos', W/2, 298, 16, '#ffe36e');
  boton(W/2-150, H-90, 300, 44, '▶ SEGUIR EXPLORANDO', '#3aa040', '#1e6a24', 18, true);
  botonAtras('◀ FERNANDO BROS');
  if (tick % 4 === 0) confeti(P.J.x, P.J.y, P.J.z, 2);
}
function dibujar(){
  renderer.render(scene, camera);
  ctx.setTransform(esc,0,0,esc,0,0);
  ctx.clearRect(0,0,W,H);
  if (estado==='menu') dibujarMenu();
  else if (estado==='juego') dibujarHUD();
  else if (estado==='pausa'){ dibujarHUD(); dibujarPausa(); }
  else if (estado==='final') dibujarFinal();
  else if (estado==='amigos') dibujarAmigos();
  if (cortina>0){ ctx.fillStyle = 'rgba(0,0,0,'+(cortina/40)+')'; ctx.fillRect(0,0,W,H); }
  if (MANDO.avisoT>0){ cristal(W/2-160, 40, 320, 40, 20, 0.5); textoBorde('🎮 MANDO CONECTADO', W/2, 61, 20, '#7dffa0', 'center', true); }
}

/* ---------------- Bucle principal: 60 pasos por segundo, pase lo que pase ---------------- */
let ultimo = performance.now(), acum = 0, medida = 0, lentos = 0;
function bucle(ahora){
  requestAnimationFrame(bucle);
  const dt = ahora - ultimo;
  if (estado==='juego' && CAL.nivel < 3){
    if (dt > 34) lentos++; else lentos = Math.max(0, lentos-1);
    if (++medida > 180){ medida = 0; if (lentos > 60) bajarCalidad(); lentos = 0; }
  }
  acum += Math.min(100, dt); ultimo = ahora;
  let pasos = 0;
  while (acum >= 1000/60 && pasos < 4){ actualizar(); acum -= 1000/60; pasos++; }
  if (pasos===4) acum = 0;
  dibujar();
}
/* asas para las pruebas automáticas (no hacen nada en el juego) */
window.AV = { get estado(){ return estado; }, set estado(v){ estado = v; }, get P(){ return P; }, camera, scene, renderer, tecla: procesarTecla, paso: actualizar, empezar, set entrada(v){ entradaForzada = v; }, RED, redRecibir, empaquetar: ()=>empaquetarEstado(P, RED.pj, nombreLocal()), ponerPersonaje, get particulas(){ return particulas.length; }, get CAL(){ return CAL; } };
requestAnimationFrame(bucle);
})();
