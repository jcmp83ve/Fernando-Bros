'use strict';
/* ============================================================
   PICHUNGITO KART — carrera en 3D de verdad, estilo Mario Kart
   Con los personajes y las voces grabadas de Fernando Bros.

   El archivo tiene dos mitades:
     · el NÚCLEO (voces, elenco, pistas, física, poderes, rivales),
       que no toca la pantalla y se puede probar con node;
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
};
/* respaldo: si un mp3 no carga, habla el navegador con el tono de cada personaje */
const TONO_TTS = {
  'Eres mi pichunguito': {pitch:0.6, rate:0.95},
  '¡Épale! ¡Aquí viene tío Nacho!': {pitch:0.85, rate:1.15},
  '¡Hola mi amor! ¡Soy tía Yanny!': {pitch:1.45, rate:1.0},
  '¡Brrrp! ¡Qué rica cerveza! ¡Ay, qué pena!': {pitch:0.35, rate:0.8},
  '¡Hola pichunguito! ¡Soy tío Beto!': {pitch:0.75, rate:1.0},
  '¡Un abrazo, pichunguito! ¡Soy tía Giuliana!': {pitch:1.3, rate:1.05},
};
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
/* Cola de diálogos: cada frase espera a que termine la anterior */
function hablar(texto){
  if (!EN_NAVEGADOR) return;
  const src = CLIPS[texto];
  if (!src){ hablarTTS(texto); return; }
  colaVoz.push({src, texto});
  if (colaVoz.length > 3) colaVoz.shift();
  reproducirCola();
}
function reproducirCola(){
  if (hablando) return;
  const sig = colaVoz.shift();
  if (!sig) return;
  if (!reproductor){ hablarTTS(sig.texto); reproducirCola(); return; }
  try{
    hablando = true;
    let sono = false;
    const fallar = ()=>{
      if (sono) return; sono = true;
      try{ reproductor.pause(); }catch(e){}
      hablando = false; hablarTTS(sig.texto); reproducirCola();
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
  if (typeof speechSynthesis === 'undefined') return;
  try{
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-ES';
    const v = vozEspanola();
    if (v){ u.voice = v; u.lang = v.lang; }
    const t = TONO_TTS[texto];
    u.pitch = t ? t.pitch : 1.9; u.rate = t ? t.rate : 1.05; u.volume = 1;
    if (speechSynthesis.speaking || speechSynthesis.pending){
      speechSynthesis.cancel();
      setTimeout(()=>{ try{ speechSynthesis.resume(); speechSynthesis.speak(u); }catch(e){} }, 120);
    } else { speechSynthesis.resume(); speechSynthesis.speak(u); }
  }catch(e){}
}

/* ---------------- Sonido y música 8-bits (Web Audio) ---------------- */
let AC = null;
function audio(){
  if (!EN_NAVEGADOR) return;
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
const sfx = {
  cuenta(){ beep(440,0.18,'square',0.09); },
  salida(){ beep(880,0.5,'square',0.1); },
  caja(){ beep(988,0.08,'square',0.07); beep(1319,0.25,'square',0.07,0.08); },
  poder(){ [523,659,784,1047,1319].forEach((f,i)=>beep(f,0.1,'square',0.06,i*0.07)); },
  golpe(){ [400,300,200].forEach((f,i)=>beep(f,0.12,'sawtooth',0.07,i*0.09)); },
  lanzar(){ beep(700,0.08,'sawtooth',0.05); beep(500,0.1,'sawtooth',0.05,0.06); },
  turbo(){ [300,420,560,720].forEach((f,i)=>beep(f,0.09,'square',0.06,i*0.05)); },
  chispa(){ beep(1600+Math.random()*600,0.03,'square',0.02); },
  vuelta(){ [659,784,988].forEach((f,i)=>beep(f,0.12,'square',0.07,i*0.1)); },
  meta(){ [523,587,659,784,880,1047,1319].forEach((f,i)=>beep(f,0.18,'square',0.07,i*0.11)); },
  pedo(){ for(let i=0;i<14;i++) beep(92-i*4+(i%2)*16, 0.11, 'sawtooth', 0.28, i*0.06); },
  eructo(){ [84,66,94,56,74,50,68,44].forEach((f,i)=>beep(f,0.15,'sawtooth',0.3,i*0.08)); },
  choque(){ beep(160,0.08,'square',0.08); beep(110,0.12,'triangle',0.08,0.05); },
};
const TEMA_KART = { bpm: 176,
  mel: [69,0,69,71, 72,0,69,0, 67,0,64,67, 69,0,0,0,
        69,0,69,71, 72,74,76,0, 74,72,71,72, 69,0,0,0,
        76,0,74,72, 71,0,72,74, 76,0,74,72, 71,72,74,0,
        69,72,76,81, 79,76,72,69, 71,72,74,76, 69,0,0,0],
  bajo:[45,45,52,45, 43,43,50,43, 41,41,48,41, 43,43,50,43,
        45,45,52,45, 48,48,55,48, 43,43,50,43, 45,52,45,0] };
const TEMA_MENU = { bpm: 132,
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
function programarMusica(tema){
  if (!AC || AC.state!=='running' || !musicaOn) return;
  if (tema !== musTema){ musTema = tema; musPaso = 0; }
  if (musProx < AC.currentTime) musProx = AC.currentTime + 0.05;
  const dur = 60/tema.bpm/2;
  while (musProx < AC.currentTime + 0.35){
    const m = tema.mel[musPaso % tema.mel.length];
    if (m) tonoAbs(frecuencia(m), musProx, dur*0.85, 'square', 0.026);
    if (musPaso % 2 === 0){
      const b = tema.bajo[(musPaso>>1) % tema.bajo.length];
      if (b) tonoAbs(frecuencia(b), musProx, dur*1.7, 'triangle', 0.045);
    }
    musPaso++; musProx += dur;
  }
}

/* ---------------- El elenco ----------------
   Cada corredor lleva su color de kart, su frase grabada (la que dice al
   ser elegido y cuando Fernando lo rebasa) y sus mañas al volante. */
const ELENCO = [
  {id:'fernando', nombre:'Fernando',     color:'#d82800', frase:'¡Soy el pichunguito de tío Juan!',        vel:1.00, giro:1.00, emoji:'🧢'},
  {id:'penny',    nombre:'Penny',        color:'#222222', frase:'¡Guau, guau! ¡Soy el perrito pichunguito!', vel:1.03, giro:1.05, emoji:'🐕'},
  {id:'sheldon',  nombre:'Sheldon',      color:'#8a5a2a', frase:'¡Guau, guau! ¡Soy el perrito pichunguito!', vel:0.98, giro:1.08, emoji:'🐕'},
  {id:'cucu',     nombre:'Cucú',         color:'#ff6ec0', frase:'Hola Cucú, acompáñame',                   vel:0.97, giro:1.10, emoji:'👧'},
  {id:'luca',     nombre:'Luca',         color:'#2a9c3a', frase:'¡Luca! ¡Mi amigo pichunguito!',           vel:1.00, giro:1.00, emoji:'🧒'},
  {id:'salomon',  nombre:'Salomón',      color:'#d86a28', frase:'¡Salomón! ¡Juega conmigo, pichunguito!',  vel:1.02, giro:0.95, emoji:'🧒'},
  {id:'tiojuan',  nombre:'Tío Juan',     color:'#1560d0', frase:'Eres mi pichunguito',                     vel:1.06, giro:0.92, emoji:'🦸'},
  {id:'nacho',    nombre:'Tío Nacho',    color:'#e8a33d', frase:'¡Épale! ¡Aquí viene tío Nacho!',          vel:1.01, giro:0.97, emoji:'🤠'},
  {id:'yanny',    nombre:'Tía Yanny',    color:'#b05ad0', frase:'¡Hola mi amor! ¡Soy tía Yanny!',          vel:0.99, giro:1.03, emoji:'👩'},
  {id:'tiofran',  nombre:'Tío Fran',     color:'#8a6a3a', frase:'¡Qué pedo tan podrido, tío Fran!',        vel:0.98, giro:0.95, emoji:'💨'},
  {id:'romulo',   nombre:'Rómulo',       color:'#7a7a8a', frase:'¡Brrrp! ¡Qué rica cerveza! ¡Ay, qué pena!', vel:0.94, giro:0.90, emoji:'🦝'},
  {id:'abu',      nombre:'Abu',          color:'#7b4fa8', frase:'Te amo Abu',                              vel:0.96, giro:1.00, emoji:'👵'},
  {id:'mama',     nombre:'Mamá',         color:'#ff6ea8', frase:'¡Te amo mamá!',                           vel:1.00, giro:1.04, emoji:'💋'},
  {id:'papa',     nombre:'Papá',         color:'#2a6ad0', frase:'¡Papá, mira cómo salto de alto!',         vel:1.04, giro:0.96, emoji:'🧔'},
  {id:'beto',     nombre:'Tío Beto',     color:'#2a9c6a', frase:'¡Hola pichunguito! ¡Soy tío Beto!',       vel:1.01, giro:0.98, emoji:'👓'},
  {id:'giuliana', nombre:'Tía Giuliana', color:'#ff8a3d', frase:'¡Un abrazo, pichunguito! ¡Soy tía Giuliana!', vel:0.99, giro:1.02, emoji:'👩'},
];
const porId = id => ELENCO.find(c=>c.id===id) || ELENCO[0];

/* ---------------- Las pistas ----------------
   pts: el trazado visto desde arriba (metros). relieve: [amplitud, ondas]
   para que la carretera suba y baje. deco: qué se planta a los lados. */
const PISTAS = [
  { id:'circuito', nombre:'CIRCUITO PICHUNGUITO', emoji:'🌄', cielo:0x62b8ff, niebla:0xa9dcff, sol:0xfff1a8,
    hierba:[0x4fbf3a,0x3fa52e], asfalto:0x5c5c66, borde:[0xe03030,0xf4f4f4], ancho:13, relieve:[4,2],
    deco:'arboles', vueltas:3,
    pts:[[0,0],[70,-12],[140,-6],[190,40],[200,110],[160,170],[90,190],[10,175],[-60,130],[-90,60],[-70,10]] },
  { id:'playa', nombre:'PLAYA DE PENNY', emoji:'🏖️', cielo:0x3aa8e8, niebla:0xbfeaff, sol:0xfff5c0,
    hierba:[0xf0d890,0xe4c878], asfalto:0x6a6a70, borde:[0x30a0e0,0xffffff], ancho:14, relieve:[2.5,3],
    deco:'palmeras', vueltas:3,
    pts:[[0,0],[90,-20],[180,10],[240,80],[230,160],[170,220],[80,235],[-20,215],[-90,150],[-100,70],[-60,15]] },
  { id:'cueva', nombre:'CUEVA DE SHELDON', emoji:'🦇', cielo:0x14142a, niebla:0x2a2a48, sol:0x8888ff,
    hierba:[0x5a5a72,0x4c4c62], asfalto:0x3c3c48, borde:[0xa040c0,0xdadaff], ancho:12, relieve:[6,3],
    deco:'rocas', vueltas:3,
    pts:[[0,0],[60,-30],[130,-20],[170,40],[150,110],[190,170],[130,220],[40,210],[-30,170],[-80,110],[-70,40]] },
  { id:'nubes', nombre:'NUBES DE CUCÚ', emoji:'☁️', cielo:0x7ec8ff, niebla:0xeaf6ff, sol:0xffffff,
    hierba:[0xf4f8ff,0xdde8fa], asfalto:0x8a9ab8, borde:[0xff6ec0,0xffffff], ancho:12, relieve:[8,2],
    deco:'nubes', vueltas:3,
    pts:[[0,0],[80,-30],[170,-10],[220,60],[210,150],[150,210],[60,230],[-40,210],[-100,140],[-100,60],[-50,10]] },
  { id:'desierto', nombre:'DESIERTO DE ABU', emoji:'🌵', cielo:0xffc070, niebla:0xffe0b0, sol:0xfff0c0,
    hierba:[0xe8b45a,0xd9a44a], asfalto:0x7a6a5a, borde:[0xd05020,0xfff0d0], ancho:14, relieve:[3,4],
    deco:'cactus', vueltas:3,
    pts:[[0,0],[100,-10],[200,20],[250,90],[220,170],[140,210],[60,200],[-10,230],[-80,180],[-110,90],[-70,20]] },
  { id:'castillo', nombre:'CASTILLO DE BOWSER', emoji:'🐢', cielo:0x3a2050, niebla:0x6a4a8a, sol:0xff9040,
    hierba:[0x4a4458,0x3e3850], asfalto:0x50485c, borde:[0xff9040,0xf4f4f4], ancho:12, relieve:[5,3],
    deco:'torres', vueltas:3,
    pts:[[0,0],[70,-20],[150,-30],[200,30],[180,100],[220,160],[150,210],[60,190],[0,220],[-70,170],[-90,80],[-60,20]] },
];

/* ---------------- Núcleo: el trazado ----------------
   Los puntos se suavizan con una curva Catmull-Rom cerrada y se muestrean
   cada ~1,5 m. Cada muestra sabe su posición, su dirección y su altura. */
function catmull(p0,p1,p2,p3,t){
  const t2=t*t, t3=t2*t;
  return 0.5*((2*p1) + (-p0+p2)*t + (2*p0-5*p1+4*p2-p3)*t2 + (-p0+3*p1-3*p2+p3)*t3);
}
class Trazado {
  constructor(pista){
    this.pista = pista;
    this.ancho = pista.ancho;
    const P = pista.pts, n = P.length, crudo = [];
    for (let i=0;i<n;i++){
      const a=P[(i-1+n)%n], b=P[i], c=P[(i+1)%n], d=P[(i+2)%n];
      const pasos = 24;
      for (let k=0;k<pasos;k++){
        const t=k/pasos;
        crudo.push([catmull(a[0],b[0],c[0],d[0],t), catmull(a[1],b[1],c[1],d[1],t)]);
      }
    }
    /* re-muestreo a paso fijo para que la distancia recorrida sea fiel */
    const M = [], paso = 1.5;
    let acum = 0, prox = 0;
    for (let i=0;i<crudo.length;i++){
      const p = crudo[i], q = crudo[(i+1)%crudo.length];
      const dx=q[0]-p[0], dz=q[1]-p[1], L=Math.hypot(dx,dz);
      while (prox <= acum + L){
        const t = (prox - acum)/L;
        M.push({x:p[0]+dx*t, z:p[1]+dz*t});
        prox += paso;
      }
      acum += L;
    }
    /* la última muestra queda muy cerca de la primera: se cierra el lazo */
    if (M.length > 2 && Math.hypot(M[M.length-1].x-M[0].x, M[M.length-1].z-M[0].z) < paso*0.6) M.pop();
    this.M = M; this.N = M.length; this.L = M.length*paso;
    const [amp, ondas] = pista.relieve;
    for (let i=0;i<this.N;i++){
      const m=M[i], a=M[(i+1)%this.N], b=M[(i-1+this.N)%this.N];
      m.s = i*paso;
      let tx=a.x-b.x, tz=a.z-b.z; const l=Math.hypot(tx,tz)||1;
      m.tx=tx/l; m.tz=tz/l; m.nx=-m.tz; m.nz=m.tx;
      const f = i/this.N*Math.PI*2;
      m.y = amp*(0.5-0.5*Math.cos(f*ondas)) + amp*0.35*Math.sin(f*(ondas+1)+1.3);
      m.y *= Math.min(1, i/40, (this.N-i)/40);   /* la salida siempre está llana */
    }
    /* rejilla para buscar rápido la muestra más cercana */
    this.celda = 12; this.rej = new Map();
    for (let i=0;i<this.N;i++){
      const k = this.clave(M[i].x, M[i].z);
      if (!this.rej.has(k)) this.rej.set(k, []);
      this.rej.get(k).push(i);
    }
    this.lim = M.reduce((r,m)=>({x0:Math.min(r.x0,m.x),x1:Math.max(r.x1,m.x),z0:Math.min(r.z0,m.z),z1:Math.max(r.z1,m.z)}),
                        {x0:1e9,x1:-1e9,z0:1e9,z1:-1e9});
  }
  clave(x,z){ return ((x/this.celda)|0)+':'+((z/this.celda)|0); }
  /* muestra más cercana a un punto, con su distancia y su lado */
  cerca(x, z, pista){
    let mejor = -1, md = 1e18;
    const cx = (x/this.celda)|0, cz = (z/this.celda)|0;
    const M = this.M;
    if (pista !== undefined){                           /* búsqueda local */
      for (let k=-40;k<=40;k++){
        const i=(pista+k+this.N*4)%this.N, m=M[i], d=(m.x-x)**2+(m.z-z)**2;
        if (d<md){ md=d; mejor=i; }
      }
      if (md < 400) return this.infoMuestra(mejor, x, z, md);
    }
    for (let r=0;r<=3;r++){
      for (let a=-r;a<=r;a++) for (let b=-r;b<=r;b++){
        if (Math.max(Math.abs(a),Math.abs(b))!==r) continue;
        const l = this.rej.get((cx+a)+':'+(cz+b));
        if (!l) continue;
        for (const i of l){ const m=M[i], d=(m.x-x)**2+(m.z-z)**2; if (d<md){ md=d; mejor=i; } }
      }
      if (mejor>=0 && r>=1) break;
    }
    if (mejor<0){ for (let i=0;i<this.N;i++){ const m=M[i], d=(m.x-x)**2+(m.z-z)**2; if (d<md){ md=d; mejor=i; } } }
    return this.infoMuestra(mejor, x, z, md);
  }
  infoMuestra(i, x, z, d2){
    const m = this.M[i];
    const lat = (x-m.x)*m.nx + (z-m.z)*m.nz;      /* + a la derecha, - a la izquierda */
    return {i, m, d:Math.sqrt(d2), lat, s:m.s};
  }
  /* altura del suelo: la carretera sube y baja, y el terreno la acompaña */
  altura(x, z, pista){
    const c = this.cerca(x, z, pista);
    const fuera = Math.max(0, c.d - this.ancho/2);
    const f = Math.max(0, 1 - fuera/60);
    return c.m.y * f;
  }
  punto(s){
    const i = ((Math.round(s/1.5)%this.N)+this.N)%this.N;
    return this.M[i];
  }
}

/* ---------------- Núcleo: la carrera ---------------- */
const PODERES = {
  tortuga:  {nombre:'CAPARAZÓN',  emoji:'🐢'},
  estrella: {nombre:'ESTRELLA',   emoji:'⭐'},
  burger:   {nombre:'HAMBURGUESA',emoji:'🍔'},
  pedo:     {nombre:'PEDO DE TÍO FRAN', emoji:'💨'},
};
const VMAX = 0.62;                    /* metros por cuadro, a 60 cuadros por segundo */
let semilla = 12345;
function azar(){ semilla = (semilla*1103515245 + 12345) & 0x7fffffff; return semilla/0x7fffffff; }

function crearCarrera(pistaIdx, jugadorId, opciones){
  opciones = opciones || {};
  const pista = PISTAS[pistaIdx % PISTAS.length];
  const T = new Trazado(pista);
  const jugador = porId(jugadorId);
  /* corren doce: el jugador y once rivales, en el orden clásico del elenco */
  const rivales = ELENCO.filter(c=>c.id!==jugador.id).slice(0, 11);
  const lista = [jugador, ...rivales];
  const m0 = T.M[0];
  const karts = lista.map((c,i)=>{
    const fila = Math.floor(i/2), col = (i%2)? 1 : -1;
    const atras = 6 + fila*4.2;
    return {
      id:c.id, nombre:c.nombre, color:c.color, frase:c.frase, ficha:c,
      x: m0.x - m0.tx*atras + m0.nx*col*2.6,
      z: m0.z - m0.tz*atras + m0.nz*col*2.6,
      y: 0, ang: Math.atan2(m0.tz, m0.tx), vel:0, dir:0,
      esJugador: i===0, s:0, si:0, vuelta:-1, avance:0, pos:i+1,   /* la parrilla está antes de la meta: la vuelta 0 empieza al cruzarla */
      poder:null, ruleta:0, estrella:0, turbo:0, giroT:0, derrape:0, derrapeDir:0, mini:0, salto:0,
      inmune:0, terminado:false, orden:0, cdVoz:0, cdIA: 60+i*17, lat:(i%3-1)*3,
      vmaxF: VMAX*c.vel, giroF: c.giro, rueda:0, inclin:0, humo:0, eventos:0,
    };
  });
  karts.forEach(k=>{ k.s = T.cerca(k.x,k.z).s; k.avance = k.vuelta*T.L + k.s; k.y = T.altura(k.x,k.z); });
  /* cajas de poder: tres en fila cada cierto trecho */
  const cajas = [];
  for (let s=40; s<T.L-30; s+=110){
    const m = T.punto(s);
    for (const l of [-4, 0, 4]) cajas.push({x:m.x+m.nx*l, z:m.z+m.nz*l, y:m.y, activa:true, t:0, giro:azar()*6});
  }
  return {
    pista, pistaIdx, T, karts, J: karts[0], cajas, proyectiles:[], nubes:[],
    t:0, fase:'cuenta', cuenta:200, vueltas: pista.vueltas, resultado:[], eventos:[],
    autoJugador: !!opciones.autoJugador, chispas:[], ultimaVoz:-999,
  };
}

/* qué poder sale de la caja: los de atrás reciben cosas mejores */
function poderAlAzar(k, R){
  const atras = k.pos / R.karts.length;      /* 0 = primero … 1 = último */
  const r = azar();
  if (k.pos===1) return r<0.5 ? 'tortuga' : r<0.8 ? 'pedo' : 'burger';
  if (atras < 0.5) return r<0.4 ? 'tortuga' : r<0.65 ? 'burger' : r<0.85 ? 'pedo' : 'estrella';
  return r<0.3 ? 'estrella' : r<0.6 ? 'burger' : r<0.85 ? 'tortuga' : 'pedo';
}
function usarPoder(k, R){
  if (!k.poder || k.ruleta>0) return;
  const p = k.poder; k.poder = null;
  const T = R.T;
  if (p==='tortuga'){
    const c = T.cerca(k.x,k.z,k.si);
    R.proyectiles.push({x:k.x+Math.cos(k.ang)*2.2, z:k.z+Math.sin(k.ang)*2.2, y:k.y+0.5,
      s:c.s+2, lat:Math.max(-T.ancho/2+1, Math.min(T.ancho/2-1, c.lat)), vel:VMAX*1.55, t:420, de:k, giro:0});
    R.eventos.push({tipo:'lanzar', k});
  } else if (p==='estrella'){
    k.estrella = 380; k.inmune = 380;
    R.eventos.push({tipo:'estrella', k});
  } else if (p==='burger'){
    k.turbo = 130;
    R.eventos.push({tipo:'burger', k});
  } else if (p==='pedo'){
    R.nubes.push({x:k.x-Math.cos(k.ang)*1.5, z:k.z-Math.sin(k.ang)*1.5, y:k.y, t:720, de:k, r:2.8, cria:30});
    R.eventos.push({tipo:'pedo', k});
  }
}
function trompo(k, R, causa){
  if (k.estrella>0 || k.inmune>0 || k.giroT>0) return false;
  k.giroT = 75; k.vel *= 0.25; k.turbo = 0; k.derrape = 0; k.inmune = 75+60;
  R.eventos.push({tipo:'trompo', k, causa});
  return true;
}
/* la inteligencia de los rivales (y del jugador cuando se prueba solo) */
function pensarIA(k, R){
  const T = R.T;
  const c = T.cerca(k.x, k.z, k.si);
  const mira = T.punto(c.s + 10 + k.vel*14);
  /* huir de las nubes de pedo y de los caparazones que vienen */
  let latObj = k.lat;
  for (const n of R.nubes){
    const cn = T.cerca(n.x, n.z);
    const d = ((cn.s - c.s) + T.L) % T.L;
    if (d < 25 && Math.abs(cn.lat - k.lat) < 4) latObj = cn.lat > 0 ? cn.lat - 5 : cn.lat + 5;
  }
  latObj = Math.max(-T.ancho/2+1.5, Math.min(T.ancho/2-1.5, latObj));
  const ox = mira.x + mira.nx*latObj, oz = mira.z + mira.nz*latObj;
  let dif = Math.atan2(oz-k.z, ox-k.x) - k.ang;
  while (dif > Math.PI) dif -= Math.PI*2;
  while (dif < -Math.PI) dif += Math.PI*2;
  const ent = {izq: dif < -0.04, der: dif > 0.04, atras:false, a:false, b:false, dirAn: Math.max(-1, Math.min(1, dif*2.5))};
  /* goma elástica: los que van detrás del jugador aprietan, los de delante aflojan */
  const J = R.J;
  const dif2 = (J.avance - k.avance);
  k.goma = k.esJugador ? 1 : (dif2 > 80 ? 1.14 : dif2 > 25 ? 1.06 : dif2 < -80 ? 0.86 : dif2 < -25 ? 0.95 : 1.0);
  /* poderes: cuando conviene */
  if (k.poder && k.ruleta===0){
    if (--k.cdIA <= 0){
      k.cdIA = 90 + azar()*150;
      const p = k.poder;
      const alguienDelante = R.karts.some(o=>o!==k && o.avance>k.avance && o.avance-k.avance<45 && !o.terminado);
      const alguienDetras  = R.karts.some(o=>o!==k && o.avance<k.avance && k.avance-o.avance<14);
      if ((p==='tortuga' && alguienDelante) || p==='estrella' || p==='burger' || (p==='pedo' && (alguienDetras || azar()<0.4))) ent.b = true;
    }
  }
  if (azar()<0.002) k.lat = (azar()-0.5)*(T.ancho-4);
  return ent;
}
function pasoKart(k, ent, R){
  const T = R.T;
  if (k.terminado){ ent = pensarIA(k, R); ent.b = false; }   /* al acabar sigue dando la vuelta de honor */
  const dir = ent.dirAn !== undefined ? ent.dirAn : ((ent.izq?-1:0)+(ent.der?1:0));
  const c = T.cerca(k.x, k.z, k.si);
  k.si = c.i;
  const enPista = c.d <= T.ancho/2 + 0.6;
  /* velocidad máxima del momento */
  let vmax = k.vmaxF * (k.goma||1);
  if (k.estrella>0) vmax *= 1.22;
  if (k.turbo>0) vmax *= 1.45;
  if (k.mini>0) vmax *= 1.25;
  if (!enPista && k.estrella<=0 && k.turbo<=0) vmax *= 0.5;
  if (R.fase==='cuenta') vmax = 0;
  if (k.giroT>0) vmax = 0;
  /* acelera sola (pensado para manos pequeñas); ▼ frena y da marcha atrás */
  if (ent.atras && k.giroT<=0 && R.fase!=='cuenta') k.vel += (-VMAX*0.35 - k.vel)*0.05;
  else k.vel += (vmax - k.vel)*(k.vel<vmax ? 0.022 : 0.06);
  /* derrape: con A pulsado y girando, el kart cruza más y al soltar da un miniturbo */
  if (ent.a && k.giroT<=0 && Math.abs(dir)>0.2 && k.vel>VMAX*0.45 && R.fase==='carrera'){
    if (k.derrape===0){ k.derrapeDir = dir>0?1:-1; k.salto = 14; }
    k.derrape++;
  } else {
    if (k.derrape >= 45){ k.mini = 50; R.eventos.push({tipo:'mini', k}); }
    k.derrape = 0;
  }
  let giro = 0.036 * k.giroF * Math.min(1, Math.abs(k.vel)/(VMAX*0.35));
  if (k.derrape>0) giro *= 1.55;
  if (k.vel < 0) giro = -giro;
  k.ang += dir*giro;
  if (k.derrape>0) k.ang += k.derrapeDir*0.012;
  k.inclin += (dir*0.22 + (k.derrape>0?k.derrapeDir*0.18:0) - k.inclin)*0.15;
  if (k.giroT>0){ k.giroT--; }
  /* avanza */
  k.x += Math.cos(k.ang)*k.vel; k.z += Math.sin(k.ang)*k.vel;
  /* muro invisible: nadie se pierde en el campo */
  const c2 = T.cerca(k.x, k.z, k.si);
  const lim = T.ancho/2 + 9;
  if (c2.d > lim){
    const emp = c2.d - lim;
    k.x -= c2.m.nx*Math.sign(c2.lat)*emp; k.z -= c2.m.nz*Math.sign(c2.lat)*emp;
    k.vel *= 0.92;
    if (k.esJugador && k.eventos++ % 20 === 0) R.eventos.push({tipo:'muro', k});
  }
  const yS = T.altura(k.x, k.z, k.si);
  if (k.salto>0){ k.salto--; }
  k.y += (yS + (k.salto>0 ? Math.sin(k.salto/14*Math.PI)*0.9 : 0) - k.y)*0.35;
  if (k.estrella>0) k.estrella--;
  if (k.turbo>0) k.turbo--;
  if (k.mini>0) k.mini--;
  if (k.inmune>0) k.inmune--;
  if (k.ruleta>0){ k.ruleta--; }
  if (k.cdVoz>0) k.cdVoz--;
  k.rueda += k.vel*3;
  /* progreso, vueltas y meta */
  const sAnt = k.s; k.s = c2.s;
  if (sAnt > T.L*0.8 && k.s < T.L*0.2 && k.vel > 0){ k.vuelta++; if (!k.terminado && k.vuelta>0) R.eventos.push({tipo:'vuelta', k}); }
  else if (sAnt < T.L*0.2 && k.s > T.L*0.8 && k.vel < 0) k.vuelta--;
  k.avance = k.vuelta*T.L + k.s;
  if (!k.terminado && k.vuelta >= R.vueltas){
    k.terminado = true; k.orden = ++R.terminados;
    R.resultado.push(k);
    R.eventos.push({tipo:'meta', k});
  }
  if (ent.b) usarPoder(k, R);
}
function pasoCarrera(R, entJugador){
  R.t++;
  R.terminados = R.terminados || 0;
  const T = R.T;
  if (R.fase==='cuenta'){
    R.cuenta--;
    if (R.cuenta===180 || R.cuenta===120 || R.cuenta===60) R.eventos.push({tipo:'cuenta', n:R.cuenta/60});
    if (R.cuenta<=0){ R.fase='carrera'; R.eventos.push({tipo:'salida'}); }
  }
  /* si todos los rivales ya llegaron, Tío Juan lleva al jugador hasta la meta */
  if (R.fase==='carrera' && !R.remolque && !R.J.terminado && R.terminados >= R.karts.length-1){
    R.remolque = true; R.eventos.push({tipo:'remolque'});
  }
  for (const k of R.karts){
    let ent;
    if (k.esJugador && !R.autoJugador && !R.remolque) ent = entJugador || {};
    else ent = pensarIA(k, R);
    pasoKart(k, ent, R);
  }
  /* choques entre karts: se apartan; la estrella hace trompo al otro */
  const K = R.karts;
  for (let i=0;i<K.length;i++) for (let j=i+1;j<K.length;j++){
    const a=K[i], b=K[j], dx=b.x-a.x, dz=b.z-a.z, d=Math.hypot(dx,dz);
    if (d < 2.3 && d > 0.001){
      const emp=(2.3-d)/2, nx=dx/d, nz=dz/d;
      a.x-=nx*emp; a.z-=nz*emp; b.x+=nx*emp; b.z+=nz*emp;
      const va=a.vel, vb=b.vel;
      a.vel = va*0.9 + vb*0.05; b.vel = vb*0.9 + va*0.05;
      if (a.estrella>0 && b.estrella<=0) trompo(b, R, a);
      else if (b.estrella>0 && a.estrella<=0) trompo(a, R, b);
      else if ((a.esJugador||b.esJugador) && Math.abs(va-vb)>0.05 && R.t%6===0) R.eventos.push({tipo:'choque'});
    }
  }
  /* cajas de poder */
  for (const c of R.cajas){
    c.giro += 0.04;
    if (!c.activa){ if (--c.t<=0) c.activa = true; continue; }
    for (const k of K){
      if (k.poder || k.ruleta>0 || k.terminado) continue;
      if ((k.x-c.x)**2+(k.z-c.z)**2 < 2.4){
        c.activa=false; c.t=240;
        k.poder = poderAlAzar(k, R); k.ruleta = 70;
        R.eventos.push({tipo:'caja', k});
        break;
      }
    }
  }
  /* caparazones: siguen la carretera y hacen trompo al que tocan */
  for (const p of R.proyectiles){
    p.t--; p.s += p.vel; p.giro += 0.5;
    const m = T.punto(p.s);
    p.x = m.x + m.nx*p.lat; p.z = m.z + m.nz*p.lat; p.y = m.y + 0.5;
    for (const k of K){
      if (k===p.de && p.t>400) continue;
      if ((k.x-p.x)**2+(k.z-p.z)**2 < 2.6){
        if (k.estrella>0){ p.t = 0; break; }
        if (trompo(k, R, p.de)){ p.t=0; R.eventos.push({tipo:'golpe', k, de:p.de}); }
        break;
      }
    }
  }
  R.proyectiles = R.proyectiles.filter(p=>p.t>0);
  /* nubes de pedo: quien entra da vueltas */
  for (const n of R.nubes){
    n.t--; if (n.cria>0) n.cria--;
    for (const k of K){
      if (k===n.de && n.cria>0) continue;
      if ((k.x-n.x)**2+(k.z-n.z)**2 < n.r*n.r && trompo(k, R, n.de)){
        R.eventos.push({tipo:'pedoGolpe', k, de:n.de});
      }
    }
  }
  R.nubes = R.nubes.filter(n=>n.t>0);
  /* clasificación */
  const orden = [...K].sort((a,b)=>{
    if (a.terminado && b.terminado) return a.orden-b.orden;
    if (a.terminado) return -1; if (b.terminado) return 1;
    return b.avance-a.avance;
  });
  const J = R.J;
  const posAnt = J.pos;
  orden.forEach((k,i)=>k.pos=i+1);
  /* al rebasar a alguien de cerca, ese alguien saluda con su voz */
  if (J.pos < posAnt && R.fase==='carrera'){
    const rebasado = orden[J.pos];   /* el que quedó justo detrás */
    if (rebasado && !rebasado.esJugador && Math.hypot(rebasado.x-J.x, rebasado.z-J.z) < 9 && R.t - R.ultimaVoz > 240){
      R.ultimaVoz = R.t; R.eventos.push({tipo:'rebase', k:rebasado});
    }
  }
  if (R.fase==='carrera' && J.terminado){
    R.fase = 'final'; R.finT = 0;
  }
  if (R.fase==='final'){
    R.finT++;
    if (R.finT > 150 || R.resultado.length===K.length){
      /* los que aún no llegaron se ordenan por dónde van */
      for (const k of orden) if (!k.terminado){ k.terminado = true; k.orden = ++R.terminados; R.resultado.push(k); }
      R.fase = 'fin'; R.eventos.push({tipo:'fin'});
    }
  }
}

/* ---------------- Núcleo para node (pruebas) ---------------- */
if (typeof module !== 'undefined' && module.exports){
  module.exports = {CLIPS, ELENCO, PISTAS, PODERES, Trazado, crearCarrera, pasoCarrera, usarPoder, VMAX};
}

/* ============================================================
   VISTA — todo lo que se ve: Three.js para el mundo y un lienzo 2D
   encima para el marcador, los menús y los bocadillos.
   ============================================================ */
if (EN_NAVEGADOR) (function(){
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 1.5));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(72, 16/9, 0.3, 900);
const luzSol = new THREE.DirectionalLight(0xffffff, 0.85);
luzSol.position.set(60, 120, 40);
scene.add(luzSol);
const luzCielo = new THREE.HemisphereLight(0xbfe4ff, 0x4a7a3a, 0.75);
scene.add(luzCielo);
scene.add(new THREE.AmbientLight(0xffffff, 0.22));

/* medidas lógicas del marcador: 540 de alto siempre; el ancho depende de la pantalla */
let W = 960, H = 540, esc = 1;
function redimensionar(){
  const w = window.innerWidth, h = window.innerHeight, dpr = Math.min(window.devicePixelRatio||1, 2);
  renderer.setSize(w, h, false);
  gl.style.width = w+'px'; gl.style.height = h+'px';
  camera.aspect = w/h; camera.updateProjectionMatrix();
  hud.width = Math.round(w*dpr); hud.height = Math.round(h*dpr);
  hud.style.width = w+'px'; hud.style.height = h+'px';
  /* 540 de alto lógico; en pantallas estrechas (teléfono vertical) se
     garantiza un ancho lógico mínimo para que los menús quepan */
  let k = h/540;
  if (w/k < 600) k = w/600;
  esc = k * dpr;
  W = w/k; H = h/k;
}
window.addEventListener('resize', redimensionar);
redimensionar();

/* ---------------- Entrada: teclado, botones de pantalla y mando ---------------- */
const keys = {};
const mando = {};
let tick = 0;
for (const ev of ['gesturestart','gesturechange','gestureend']) document.addEventListener(ev, e=>e.preventDefault());
document.addEventListener('dblclick', e=>e.preventDefault());
document.addEventListener('touchmove', e=>e.preventDefault(), {passive:false});
addEventListener('keydown', e=>{
  if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)) e.preventDefault();
  if (e.repeat){ keys[e.key.toLowerCase()] = true; return; }
  keys[e.key.toLowerCase()] = true;
  audio();
  procesarTecla(e.key);
});
addEventListener('keyup', e=>{ keys[e.key.toLowerCase()] = false; });
addEventListener('blur', ()=>{ for (const k in keys) keys[k] = false; });
const BOTONES = [
  {id:'bL', k:'arrowleft'}, {id:'bR', k:'arrowright'}, {id:'bA', k:' '}, {id:'bB', k:'shift'},
];
const dedos = new Map();
function botonEn(x, y){
  let mejor = null, mejorRel = 1;
  for (const b of BOTONES){
    const el = document.getElementById(b.id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (!r.width) continue;
    const cx = r.left+r.width/2, cy = r.top+r.height/2;
    let rel = Math.hypot(x-cx, y-cy)/(Math.max(r.width,r.height)/2);
    if (x>=r.left && x<=r.right && y>=r.top && y<=r.bottom) rel = Math.min(rel, 0.99);
    if (rel < mejorRel){ mejorRel = rel; mejor = b; }
  }
  return mejor;
}
function refrescarToques(){
  const activas = new Set([...dedos.values()].map(b=>b.k));
  for (const b of BOTONES){
    keys[b.k] = activas.has(b.k);
    const el = document.getElementById(b.id);
    if (el) el.classList.toggle('on', activas.has(b.k));
  }
}
document.addEventListener('pointerdown', ev=>{
  const b = botonEn(ev.clientX, ev.clientY);
  if (!b) return;
  audio();
  dedos.set(ev.pointerId, b); refrescarToques();
  if (b.k===' ' || b.k==='shift') procesarTecla(b.k===' ' ? ' ' : 'Shift');
  ev.preventDefault(); ev.stopPropagation();
}, true);
document.addEventListener('pointermove', ev=>{
  if (!dedos.has(ev.pointerId)) return;
  const b = botonEn(ev.clientX, ev.clientY);
  if (b) dedos.set(ev.pointerId, b);
  refrescarToques(); ev.preventDefault();
}, true);
const soltar = ev=>{ if (dedos.has(ev.pointerId)){ dedos.delete(ev.pointerId); refrescarToques(); } };
document.addEventListener('pointerup', soltar, true);
document.addEventListener('pointercancel', soltar, true);
addEventListener('blur', ()=>{ dedos.clear(); refrescarToques(); });
/* mandos: palanca analógica para girar, A/B como en Fernando Bros */
const MANDO = {activo:false, prev:{}, dirPrev:null, rep:0, eje:0};
function leerMandos(){
  if (!navigator.getGamepads) return;
  let gps; try{ gps = navigator.getGamepads(); }catch(e){ return; }
  let hay = false; const ahora = {}; let eje = 0;
  for (const gp of gps){
    if (!gp || !gp.connected) continue;
    hay = true;
    const ax = gp.axes[0]||0, ay = gp.axes[1]||0;
    if (Math.abs(ax) > 0.12) eje = ax;
    if (ay > 0.5) ahora['arrowdown'] = true;
    const B = {0:' ',1:' ',2:'shift',3:'shift',5:'shift',7:'shift',12:'arrowup',13:'arrowdown',14:'arrowleft',15:'arrowright'};
    for (const i in B){ const b = gp.buttons[i]; if (b && (b.pressed || b.value>0.5)) ahora[B[i]] = true; }
    const P = {0:' ',1:' ',2:'Shift',3:'Shift',5:'Shift',7:'Shift',9:'Enter',8:'Escape',12:'ArrowUp',13:'ArrowDown',14:'ArrowLeft',15:'ArrowRight'};
    for (const i in P){
      const b = gp.buttons[i], p = !!(b && (b.pressed || b.value>0.5)), clave = gp.index+':'+i;
      if (p && !MANDO.prev[clave]){ audio(); procesarTecla(P[i]); }
      MANDO.prev[clave] = p;
    }
    const dir = ax < -0.6 ? 'ArrowLeft' : ax > 0.6 ? 'ArrowRight' : ay < -0.6 ? 'ArrowUp' : ay > 0.6 ? 'ArrowDown' : null;
    if (estado!=='carrera' && dir){
      if (MANDO.dirPrev !== dir || ++MANDO.rep > 18){ procesarTecla(dir); MANDO.rep = 0; }
    } else if (!dir) MANDO.dirPrev = null;
    if (dir) MANDO.dirPrev = dir;
  }
  if (hay !== MANDO.activo){ MANDO.activo = hay; document.body.classList.toggle('conMando', hay); }
  for (const t of [' ','shift','arrowleft','arrowright','arrowup','arrowdown']) mando[t] = !!ahora[t];
  MANDO.eje = hay ? eje : 0;
}
const izq = ()=> keys['arrowleft']||keys['a']||mando['arrowleft'];
const der = ()=> keys['arrowright']||keys['d']||mando['arrowright'];
const atras = ()=> keys['arrowdown']||keys['s']||mando['arrowdown'];
const botA = ()=> keys[' ']||keys['z']||mando[' '];
const botB = ()=> keys['shift']||keys['x']||mando['shift'];

/* ---------------- Modelos: todo hecho con cajitas de colores ----------------
   Cada pieza es una caja (o cilindro/esfera) con su color; al final se
   funden en UNA sola malla por personaje, así doce karts no pesan nada. */
const colorCache = {};
function col(hex){ if (!colorCache[hex]) colorCache[hex] = new THREE.Color(hex); return colorCache[hex]; }
class Armador {
  constructor(){ this.geos = []; }
  pieza(geo, color, x, y, z, rx, ry, rz){
    const g = geo.toNonIndexed();
    const n = g.attributes.position.count, c = col(color), arr = new Float32Array(n*3);
    for (let i=0;i<n;i++){ arr[i*3]=c.r; arr[i*3+1]=c.g; arr[i*3+2]=c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    const m = new THREE.Matrix4();
    const e = new THREE.Euler(rx||0, ry||0, rz||0);
    m.compose(new THREE.Vector3(x||0,y||0,z||0), new THREE.Quaternion().setFromEuler(e), new THREE.Vector3(1,1,1));
    g.applyMatrix4(m);
    this.geos.push(g);
    return this;
  }
  caja(w,h,d,color,x,y,z,rx,ry,rz){ return this.pieza(new THREE.BoxGeometry(w,h,d), color, x,y,z,rx,ry,rz); }
  bola(r,color,x,y,z,seg){ return this.pieza(new THREE.SphereGeometry(r, seg||8, seg||6), color, x,y,z); }
  cil(r1,r2,h,color,x,y,z,rx,ry,rz,seg){ return this.pieza(new THREE.CylinderGeometry(r1,r2,h,seg||10), color, x,y,z,rx,ry,rz); }
  cono(r,h,color,x,y,z,seg){ return this.pieza(new THREE.ConeGeometry(r,h,seg||8), color, x,y,z); }
  malla(material){
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
    return new THREE.Mesh(geo, material || new THREE.MeshLambertMaterial({vertexColors:true}));
  }
}
const PIEL = '#ffc8a0';
/* el piloto sentado, mirando hacia +X (el frente del kart) */
function armarPiloto(A, c){
  const id = c.id;
  const cuerpo = (color)=>{ A.caja(0.62,0.62,0.66,color, -0.05,1.02,0); };
  const cabeza = (piel)=>{
    A.caja(0.62,0.6,0.62, piel||PIEL, -0.02,1.68,0);
    A.caja(0.06,0.1,0.1,'#222', 0.3,1.74,-0.14); A.caja(0.06,0.1,0.1,'#222', 0.3,1.74,0.14);   // ojos
  };
  const brazos = (color, piel)=>{
    A.caja(0.46,0.18,0.18, color, 0.25,1.05,-0.36, 0,0,-0.5); A.caja(0.46,0.18,0.18, color, 0.25,1.05,0.36, 0,0,-0.5);
    A.caja(0.14,0.14,0.14, piel||PIEL, 0.5,1.2,-0.36); A.caja(0.14,0.14,0.14, piel||PIEL, 0.5,1.2,0.36);
  };
  const gorra = (color)=>{ A.caja(0.66,0.22,0.66,color, -0.02,2.06,0); A.caja(0.34,0.06,0.5,color, 0.38,1.98,0); };
  const pelo = (color, alto)=>{ A.caja(0.66,alto||0.16,0.66,color, -0.02,2.02,0); A.caja(0.12,0.4,0.62,color, -0.3,1.8,0); };
  const melena = (color)=>{ pelo(color,0.2); A.caja(0.5,0.62,0.16,color, -0.1,1.55,-0.36); A.caja(0.5,0.62,0.16,color, -0.1,1.55,0.36); A.caja(0.2,0.7,0.62,color, -0.32,1.5,0); };
  const bigote = ()=>{ A.caja(0.08,0.08,0.34,'#3a2a1a', 0.32,1.5,0); };
  const barba = (color)=>{ A.caja(0.1,0.12,0.5,color||'#3a2a1a', 0.3,1.42,0); };
  const lentes = ()=>{ A.caja(0.06,0.14,0.62,'#1a1a1a', 0.33,1.74,0); A.caja(0.07,0.1,0.14,'#8ecbff', 0.34,1.74,-0.14); A.caja(0.07,0.1,0.14,'#8ecbff', 0.34,1.74,0.14); };
  const perro = (color)=>{
    A.caja(0.7,0.5,0.5,color, -0.05,0.98,0);                        // cuerpo
    A.caja(0.6,0.46,0.5,color, 0.2,1.5,0);                           // cabeza
    A.caja(0.3,0.26,0.36,color, 0.6,1.4,0);                          // hocico
    A.caja(0.1,0.12,0.14,'#222', 0.76,1.44,0);                       // nariz
    A.caja(0.06,0.1,0.1,'#fff', 0.5,1.6,-0.14); A.caja(0.06,0.1,0.1,'#fff', 0.5,1.6,0.14);
    A.caja(0.04,0.06,0.06,'#222', 0.54,1.6,-0.14); A.caja(0.04,0.06,0.06,'#222', 0.54,1.6,0.14);
    A.caja(0.16,0.4,0.16,color, 0.1,1.5,-0.33); A.caja(0.16,0.4,0.16,color, 0.1,1.5,0.33); // orejas
    A.caja(0.4,0.12,0.12,color, -0.5,1.2,0, 0,0,0.6);                // cola
    A.caja(0.3,0.16,0.16,color, 0.3,0.98,-0.3, 0,0,-0.6); A.caja(0.3,0.16,0.16,color, 0.3,0.98,0.3, 0,0,-0.6); // patas al volante
  };
  switch(id){
    case 'fernando': cuerpo('#d82800'); A.caja(0.64,0.3,0.68,'#2038ec', -0.05,0.85,0); A.caja(0.1,0.5,0.1,'#2038ec', 0.22,1.15,-0.2); A.caja(0.1,0.5,0.1,'#2038ec', 0.22,1.15,0.2);
      cabeza(); brazos('#d82800'); gorra('#d82800'); A.caja(0.04,0.14,0.14,'#fff', 0.32,2.06,0); A.caja(0.62,0.06,0.62,'#5a3418', -0.02,1.96,0); break;
    case 'penny': perro('#222'); break;
    case 'sheldon': perro('#8a5a2a'); break;
    case 'cucu': cuerpo('#ff6ec0'); A.cil(0.36,0.5,0.4,'#ff6ec0', -0.05,0.82,0); cabeza(); brazos('#ff6ec0'); pelo('#3b2410');
      A.caja(0.2,0.5,0.2,'#3b2410', -0.05,1.6,-0.45); A.caja(0.2,0.5,0.2,'#3b2410', -0.05,1.6,0.45);
      A.caja(0.16,0.16,0.16,'#ff6ec0', -0.05,1.85,-0.5); A.caja(0.16,0.16,0.16,'#ff6ec0', -0.05,1.85,0.5); break;
    case 'luca': cuerpo('#ffe36e'); cabeza('#e8b088'); brazos('#ffe36e','#e8b088'); gorra('#2a9c3a'); break;
    case 'salomon': cuerpo('#d86a28'); cabeza('#c88a5a'); brazos('#d86a28','#c88a5a'); lentes();
      for (const [x,z] of [[-0.2,-0.25],[0.1,-0.25],[-0.2,0.25],[0.1,0.25],[-0.05,0],[-0.3,0]]) A.bola(0.2,'#2a1a0a', x,2.06,z, 6); break;
    case 'tiojuan': cuerpo('#1560d0'); cabeza(); brazos('#1560d0'); pelo('#222'); A.caja(0.06,0.2,0.24,'#ffe36e', 0.28,1.02,0);
      A.caja(0.06,0.12,0.06,'#d82800', 0.3,1.5,0); break;   /* la capa se añade aparte para que ondee */
    case 'nacho': cuerpo('#ffe36e'); cabeza('#d8a070'); brazos('#ffe36e','#d8a070'); bigote();
      A.cil(0.75,0.75,0.06,'#e8a33d', -0.02,1.98,0); A.cil(0.36,0.4,0.3,'#e8a33d', -0.02,2.15,0); break;
    case 'yanny': cuerpo('#40c0b0'); A.cil(0.36,0.5,0.4,'#40c0b0', -0.05,0.82,0); cabeza(); brazos('#40c0b0'); melena('#7a3aa8'); break;
    case 'tiofran': cuerpo('#8a6a3a'); cabeza(); brazos('#8a6a3a'); pelo('#3a2a1a'); bigote(); break;
    case 'romulo': A.caja(0.7,0.62,0.66,'#b8b8c8', -0.05,1.02,0); cabeza('#9a9aae'); brazos('#9a9aae','#9a9aae');
      A.caja(0.1,0.18,0.66,'#2a2a34', 0.3,1.74,0); A.caja(0.06,0.1,0.1,'#fff', 0.36,1.74,-0.14); A.caja(0.06,0.1,0.1,'#fff', 0.36,1.74,0.14);
      A.caja(0.16,0.16,0.16,'#9a9aae', 0.02,2.05,-0.28); A.caja(0.16,0.16,0.16,'#9a9aae', 0.02,2.05,0.28);
      A.caja(0.2,0.16,0.22,'#3a3a44', 0.34,1.56,0);
      A.cil(0.12,0.12,0.26,'#ffdd57', 0.5,1.3,0.42); A.cil(0.13,0.13,0.08,'#fff', 0.5,1.46,0.42);   /* la jarra de cerveza */
      A.caja(0.5,0.16,0.16,'#9a9aae', -0.5,1.15,0, 0,0,0.5); break;
    case 'abu': cuerpo('#7b4fa8'); A.cil(0.36,0.5,0.4,'#7b4fa8', -0.05,0.82,0); cabeza(); brazos('#7b4fa8'); pelo('#cfcfcf');
      A.bola(0.2,'#cfcfcf', -0.2,2.14,0, 6); lentes(); break;
    case 'mama': cuerpo('#ff6ea8'); A.cil(0.36,0.5,0.4,'#ff6ea8', -0.05,0.82,0); cabeza(); brazos('#ff6ea8'); melena('#5a3418');
      A.caja(0.06,0.1,0.1,'#e07a7a', 0.32,1.52,0); break;
    case 'papa': cuerpo('#2a6ad0'); cabeza(); brazos('#2a6ad0'); gorra('#1560d0'); barba('#8a5a3a'); break;
    case 'beto': cuerpo('#2a9c6a'); cabeza('#e8b088'); brazos('#2a9c6a','#e8b088'); pelo('#2a2a2a'); lentes(); barba(); break;
    case 'giuliana': cuerpo('#ff8a3d'); A.cil(0.36,0.5,0.4,'#ff8a3d', -0.05,0.82,0); cabeza(); brazos('#ff8a3d'); melena('#7a4a1a'); break;
    default: cuerpo(c.color); cabeza(); brazos(c.color); pelo('#3a2a1a');
  }
}
function armarKart(c){
  const A = new Armador();
  const claro = '#'+col(c.color).clone().lerp(col('#ffffff'),0.35).getHexString();
  const oscuro = '#'+col(c.color).clone().lerp(col('#000000'),0.4).getHexString();
  A.caja(2.3,0.42,1.3, c.color, 0,0.5,0);                          // carrocería
  A.caja(0.9,0.2,1.0, claro, 0.95,0.75,0);                         // morro
  A.caja(0.5,0.3,1.5, oscuro, -1.05,0.62,0);                       // cola
  A.caja(0.12,0.5,0.12,'#24242c', -1.1,0.98,-0.55); A.caja(0.12,0.5,0.12,'#24242c', -1.1,0.98,0.55);
  A.caja(0.5,0.08,1.5, oscuro, -1.1,1.24,0);                       // alerón
  A.caja(0.9,0.28,0.9,'#1a1a20', -0.2,0.72,0);                     // asiento
  A.caja(0.3,0.5,0.3,'#1a1a20', -0.55,1.05,0);                     // respaldo
  A.cil(0.16,0.16,0.06,'#2a2a2a', 0.5,1.12,0, 0,0,1.2, 8);         // volante
  A.caja(0.3,0.06,0.06,'#3a3a3a', 0.42,0.95,0, 0,0,0.5);
  A.cil(0.1,0.1,0.35,'#3c3c46', -1.25,0.5,-0.3, 0,0,1.57, 6); A.cil(0.1,0.1,0.35,'#3c3c46', -1.25,0.5,0.3, 0,0,1.57, 6); // escapes
  armarPiloto(A, c);
  const g = new THREE.Group();
  const cuerpo = A.malla();
  g.add(cuerpo);
  const ruedas = [];
  const geoR = new THREE.CylinderGeometry(0.36,0.36,0.3,12), matR = new THREE.MeshLambertMaterial({color:0x151518});
  const geoT = new THREE.CylinderGeometry(0.2,0.2,0.32,8), matT = new THREE.MeshLambertMaterial({color:0x8a8a94});
  for (const [x,z] of [[0.8,-0.72],[0.8,0.72],[-0.8,-0.72],[-0.8,0.72]]){
    const r = new THREE.Mesh(geoR, matR); r.rotation.x = Math.PI/2; r.position.set(x,0.36,z);
    const t = new THREE.Mesh(geoT, matT); t.rotation.x = Math.PI/2; r.add(t);
    g.add(r); ruedas.push(r);
  }
  let capa = null;
  if (c.id==='tiojuan'){
    capa = new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.0,1,3), new THREE.MeshLambertMaterial({color:0xd82800, side:THREE.DoubleSide}));
    capa.position.set(-0.45,1.2,0); capa.rotation.y = Math.PI/2; capa.rotation.x = 0.5; g.add(capa);
  }
  const sombra = new THREE.Mesh(new THREE.CircleGeometry(1.35,14), new THREE.MeshBasicMaterial({color:0x000000, transparent:true, opacity:0.32, depthWrite:false}));
  sombra.rotation.x = -Math.PI/2; sombra.position.y = 0.03; g.add(sombra);
  g.userData = {cuerpo, ruedas, capa, sombra, mat: cuerpo.material};
  return g;
}

/* ---------------- El mundo de cada pista ---------------- */
let mundo = null;      /* grupo con todo lo de la pista en curso */
function texturaTexto(txt, fondo, color, w, h, tam){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  x.fillStyle = fondo; x.fillRect(0,0,w,h);
  x.fillStyle = color; x.font = 'bold '+tam+'px monospace'; x.textAlign='center'; x.textBaseline='middle';
  x.fillText(txt, w/2, h/2);
  const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
}
function texturaCuadros(a, b, n){
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d'), s = 64/n;
  for (let i=0;i<n;i++) for (let j=0;j<n;j++){ x.fillStyle = (i+j)%2 ? a : b; x.fillRect(i*s, j*s, s, s); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.NearestFilter; return t;
}
function construirMundo(T){
  if (mundo){ scene.remove(mundo); mundo.traverse(o=>{ if (o.geometry) o.geometry.dispose(); }); }
  const p = T.pista;
  mundo = new THREE.Group();
  scene.background = new THREE.Color(p.cielo);
  scene.fog = new THREE.Fog(p.niebla, 80, 250);
  luzCielo.color.set(p.cielo); luzCielo.groundColor.set(p.hierba[0]);
  /* terreno: rejilla a cuadros que acompaña el relieve de la carretera */
  {
    const lim = T.lim, mar = 260, x0 = lim.x0-mar, x1 = lim.x1+mar, z0 = lim.z0-mar, z1 = lim.z1+mar;
    const paso = 6, nx = Math.ceil((x1-x0)/paso), nz = Math.ceil((z1-z0)/paso);
    const alt = [];
    for (let i=0;i<=nx;i++){ alt[i] = []; for (let j=0;j<=nz;j++) alt[i][j] = T.altura(x0+i*paso, z0+j*paso) - 0.08; }
    const pos = new Float32Array(nx*nz*6*3), colr = new Float32Array(nx*nz*6*3);
    const ca = col(p.hierba[0]), cb = col(p.hierba[1]);
    let o = 0;
    for (let i=0;i<nx;i++) for (let j=0;j<nz;j++){
      const c = (i+j)%2 ? ca : cb;
      const v = [[i,j],[i,j+1],[i+1,j+1],[i,j],[i+1,j+1],[i+1,j]];   /* en sentido antihorario visto desde arriba */
      for (const [a,b] of v){
        pos[o*3] = x0+a*paso; pos[o*3+1] = alt[a][b]; pos[o*3+2] = z0+b*paso;
        colr[o*3] = c.r; colr[o*3+1] = c.g; colr[o*3+2] = c.b; o++;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color', new THREE.BufferAttribute(colr,3));
    geo.computeVertexNormals();
    mundo.add(new THREE.Mesh(geo, new THREE.MeshLambertMaterial({vertexColors:true})));
  }
  /* carretera y bordes rojiblancos */
  {
    const N = T.N, w = T.ancho/2;
    const pos = [], colr = [];
    const asf = col(p.asfalto), asfC = asf.clone().lerp(col('#ffffff'),0.06);
    const b1 = col(p.borde[0]), b2 = col(p.borde[1]), linea = col('#f4f4f4');
    const tri = (a,b,c,cc)=>{ for (const q of [a,b,c]){ pos.push(q[0],q[1],q[2]); colr.push(cc.r,cc.g,cc.b); } };
    const quad = (a,b,c,d,cc)=>{ tri(a,c,b,cc); tri(a,d,c,cc); };
    for (let i=0;i<N;i++){
      const m = T.M[i], n = T.M[(i+1)%N];
      const P = (mm, l, dy)=>[mm.x+mm.nx*l, mm.y+(dy||0), mm.z+mm.nz*l];
      const cc = (i>>2)%2 ? asf : asfC;
      quad(P(m,-w,0.02), P(n,-w,0.02), P(n,w,0.02), P(m,w,0.02), cc);
      /* bordes */
      const cb = (i>>1)%2 ? b1 : b2;
      quad(P(m,-w-0.9,0.06), P(n,-w-0.9,0.06), P(n,-w,0.06), P(m,-w,0.06), cb);
      quad(P(m,w,0.06), P(n,w,0.06), P(n,w+0.9,0.06), P(m,w+0.9,0.06), cb);
      /* línea discontinua del centro */
      if ((i>>2)%2===0) quad(P(m,-0.18,0.04), P(n,-0.18,0.04), P(n,0.18,0.04), P(m,0.18,0.04), linea);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colr,3));
    geo.computeVertexNormals();
    mundo.add(new THREE.Mesh(geo, new THREE.MeshLambertMaterial({vertexColors:true})));
    /* meta a cuadros y el arco con el nombre del juego */
    const m0 = T.M[2];
    const meta = new THREE.Mesh(new THREE.PlaneGeometry(4, T.ancho+1.8), new THREE.MeshBasicMaterial({map: texturaCuadros('#111','#fff',4)}));
    meta.rotation.x = -Math.PI/2; meta.rotation.z = -Math.atan2(m0.tz, m0.tx);
    meta.position.set(m0.x, m0.y+0.09, m0.z);
    mundo.add(meta);
    const arco = new THREE.Group();
    const poste = new THREE.CylinderGeometry(0.35,0.35,7,8), matP = new THREE.MeshLambertMaterial({color:0xf4f4f4});
    for (const l of [-w-1.6, w+1.6]){ const q = new THREE.Mesh(poste, matP); q.position.set(0,3.5,l); arco.add(q); }
    const cartel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.2, T.ancho+4.4),
      [new THREE.MeshLambertMaterial({color:0xd82800}), new THREE.MeshLambertMaterial({color:0xd82800}),
       new THREE.MeshLambertMaterial({color:0xd82800}), new THREE.MeshLambertMaterial({color:0xd82800}),
       new THREE.MeshBasicMaterial({map: texturaTexto('PICHUNGITO KART', '#d82800', '#ffe36e', 1024, 128, 92)}),
       new THREE.MeshBasicMaterial({map: texturaTexto('PICHUNGITO KART', '#d82800', '#ffe36e', 1024, 128, 92)})]);
    cartel.position.set(0, 7.4, 0); arco.add(cartel);
    arco.position.set(m0.x, m0.y, m0.z); arco.rotation.y = -Math.atan2(m0.tz, m0.tx);
    mundo.add(arco);
  }
  /* decorados a los lados, con instancias para que pesen poco */
  {
    const A = new Armador();
    let n = 160, escala = 1;
    if (p.deco==='arboles'){ A.cil(0.35,0.5,2.2,'#7a4a1a',0,1.1,0); A.bola(2.2,'#2f8f2a',0,3.6,0,7); A.bola(1.5,'#3fae2f',0.6,4.8,0.4,6); }
    else if (p.deco==='palmeras'){ A.cil(0.28,0.42,6,'#8a5a2a',0.3,3,0,0,0,0.12); for (let i=0;i<6;i++) A.caja(3.2,0.16,0.7,'#3fae2f', 1.4*Math.cos(i*1.05),6.1,1.4*Math.sin(i*1.05), 0,-i*1.05,-0.45); A.bola(0.35,'#8a5a2a',0.5,5.9,0,5); }
    else if (p.deco==='rocas'){ A.pieza(new THREE.DodecahedronGeometry(1.8,0),'#6a6a84',0,1.2,0); A.cono(0.9,5,'#7a7a94',1.6,2.5,0.8,5); A.cono(0.6,3.5,'#8a8aa4',-1.5,1.7,-1,5); n = 220; }
    else if (p.deco==='nubes'){ A.bola(2.2,'#ffffff',0,0,0,7); A.bola(1.6,'#f4f8ff',2.2,-0.4,0.5,6); A.bola(1.5,'#f4f8ff',-2.1,-0.3,-0.3,6); A.bola(1.3,'#ffffff',0.6,1.0,-1.2,6); n = 120; }
    else if (p.deco==='cactus'){ A.cil(0.5,0.6,4,'#3a8a3a',0,2,0,0,0,0,7); A.cil(0.28,0.3,1.8,'#3a8a3a',0.9,2.8,0,0,0,1.57,6); A.cil(0.28,0.3,1.4,'#3a8a3a',1.6,3.4,0,0,0,0,6); A.cil(0.28,0.3,1.4,'#3a8a3a',-0.9,2.2,0,0,0,1.57,6); A.cil(0.28,0.3,1.2,'#3a8a3a',-1.5,2.8,0,0,0,0,6); }
    else { A.cil(1.6,1.8,8,'#5a5470',0,4,0,0,0,0,8); A.cil(2.0,1.6,1.6,'#4a4460',0,8.8,0,0,0,0,8); A.cono(1.9,2.6,'#8a2020',0,10.9,0,8); A.caja(0.8,1.2,0.4,'#ffd060',0,5,1.7); n = 90; }  /* torres del castillo */
    const base = A.malla();
    const inst = new THREE.InstancedMesh(base.geometry, base.material, n);
    const M = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), s = new THREE.Vector3();
    let puestos = 0, intentos = 0;
    while (puestos < n && intentos++ < n*20){
      const m = T.M[Math.floor(azar()*T.N)];
      const lado = azar()<0.5 ? -1 : 1, lejos = T.ancho/2 + 5 + azar()*45;
      const x = m.x + m.nx*lado*lejos, z = m.z + m.nz*lado*lejos;
      const c = T.cerca(x, z);
      if (c.d < T.ancho/2 + 4.5) continue;                      /* nunca encima de la carretera */
      let y = T.altura(x, z);
      if (p.deco==='nubes') y += 6 + azar()*10;
      escala = 0.7 + azar()*0.7;
      q.setFromEuler(new THREE.Euler(0, azar()*6.28, 0));
      M.compose(v.set(x,y,z), q, s.set(escala,escala,escala));
      inst.setMatrixAt(puestos++, M);
    }
    inst.count = puestos;
    mundo.add(inst);
  }
  /* el sol (o la luna) */
  const sol = new THREE.Mesh(new THREE.SphereGeometry(18, 12, 10), new THREE.MeshBasicMaterial({color:p.sol, fog:false}));
  sol.position.set(180, 120, -200); mundo.add(sol);
  scene.add(mundo);
}
/* cajas de poder: un cubo de colores girando con un ? encima */
let cajasMesh = [];
const texInterrog = ()=>texturaTexto('?', 'rgba(0,0,0,0)', '#fff', 64, 64, 52);
function construirCajas(R){
  for (const c of cajasMesh) scene.remove(c);
  cajasMesh = [];
  const geo = new THREE.BoxGeometry(1.3,1.3,1.3);
  for (const c of R.cajas){
    const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color:0xffffff, transparent:true, opacity:0.85}));
    const q = new THREE.Sprite(new THREE.SpriteMaterial({map: texInterrog(), transparent:true}));
    q.scale.set(1.2,1.2,1); m.add(q);
    m.position.set(c.x, c.y+1.1, c.z);
    scene.add(m); cajasMesh.push(m);
  }
}
/* chispas, humo, nubes de pedo y caparazones: pequeñas piscinas de mallas */
const chispas = [];
const geoChispa = new THREE.BoxGeometry(0.18,0.18,0.18);
function chispa(x,y,z, color, vx,vy,vz, vida){
  let c = chispas.find(c=>c.t<=0);
  if (!c){
    if (chispas.length > 160) return;
    c = {m:new THREE.Mesh(geoChispa, new THREE.MeshBasicMaterial({color:0xffffff, transparent:true})), t:0};
    scene.add(c.m); chispas.push(c);
  }
  c.m.material.color.set(color); c.m.material.opacity = 1;
  c.m.position.set(x,y,z); c.v = [vx,vy,vz]; c.t = vida; c.t0 = vida; c.m.visible = true;
  c.m.scale.setScalar(1);
}
function pasoChispas(){
  for (const c of chispas){
    if (c.t<=0){ c.m.visible = false; continue; }
    c.t--; c.m.position.x += c.v[0]; c.m.position.y += c.v[1]; c.m.position.z += c.v[2];
    c.v[1] -= 0.004; c.m.material.opacity = c.t/c.t0; c.m.scale.setScalar(0.6 + c.t/c.t0);
  }
}
const nubesMesh = new Map(), proyMesh = new Map();
const geoNube = new THREE.SphereGeometry(1, 7, 6);
const geoTort = new THREE.SphereGeometry(0.7, 10, 8);
function sincronizarObjetos(R){
  for (const n of R.nubes){
    if (!nubesMesh.has(n)){
      const g = new THREE.Group();
      for (let i=0;i<5;i++){ const b = new THREE.Mesh(geoNube, new THREE.MeshLambertMaterial({color:0x7ee060, transparent:true, opacity:0.55}));
        b.position.set((azar()-0.5)*2.4, 0.8+azar()*1.2, (azar()-0.5)*2.4); b.scale.setScalar(0.8+azar()*0.8); g.add(b); }
      g.position.set(n.x, n.y, n.z); scene.add(g); nubesMesh.set(n, g);
    }
    const g = nubesMesh.get(n), f = Math.min(1, (720-n.t)/40), a = n.t<60 ? n.t/60 : 1;
    g.scale.setScalar(n.r/2.8*(0.4+0.6*f)); g.rotation.y += 0.01;
    g.children.forEach(b=>{ b.material.opacity = 0.55*a; });
  }
  for (const [n,g] of nubesMesh) if (!R.nubes.includes(n)){ scene.remove(g); nubesMesh.delete(n); }
  for (const p of R.proyectiles){
    if (!proyMesh.has(p)){
      const g = new THREE.Group();
      const casco = new THREE.Mesh(geoTort, new THREE.MeshLambertMaterial({color:0x3aa030})); casco.scale.y = 0.6; g.add(casco);
      const aro = new THREE.Mesh(new THREE.TorusGeometry(0.62,0.12,6,14), new THREE.MeshLambertMaterial({color:0xf4f4d0})); aro.rotation.x = Math.PI/2; g.add(aro);
      scene.add(g); proyMesh.set(p, g);
    }
    const g = proyMesh.get(p); g.position.set(p.x, p.y, p.z); g.rotation.y = p.giro;
  }
  for (const [p,g] of proyMesh) if (!R.proyectiles.includes(p)){ scene.remove(g); proyMesh.delete(p); }
}

/* ---------------- Estados del juego ---------------- */
let estado = 'menu';          /* menu · elegir · pista · carrera · fin */
let R = null;                 /* la carrera en curso (núcleo) */
let karts3d = new Map();      /* kart del núcleo → su modelo */
let selPersonaje = 0, selPista = 0, T = null;
let burbujas = [], cortina = 40, mensajeGrande = null, sacudida = 0;
let preview = null, previewId = null, podio = null;
const camPos = new THREE.Vector3(), camMira = new THREE.Vector3();
let fovObj = 72;
const URL_VOLVER = '../';

function burbuja(txt, quien, dur){ burbujas.push({txt, quien: quien||'', t: dur||170}); if (burbujas.length>3) burbujas.shift(); }
function grande(txt, color, dur){ mensajeGrande = {txt, color: color||'#ffe36e', t: dur||80, t0: dur||80}; }

/* --- el escaparate: un sitio muy alto en el cielo para mirar un kart de cerca --- */
const ESCAPARATE = new THREE.Vector3(0, 600, 0);
function mostrarPreview(id){
  if (previewId === id && preview) return;
  if (preview){ scene.remove(preview); }
  preview = armarKart(porId(id)); previewId = id;
  preview.position.copy(ESCAPARATE);
  scene.add(preview);
}
function quitarPreview(){ if (preview){ scene.remove(preview); preview = null; previewId = null; } }
function quitarPodio(){ if (podio){ scene.remove(podio); podio = null; } }

function empezarCarrera(){
  quitarPreview(); quitarPodio(); camera.clearViewOffset();
  semilla = (Date.now() & 0x7fffffff) || 1;
  R = crearCarrera(selPista, ELENCO[selPersonaje].id);
  T = R.T;
  construirMundo(T);
  construirCajas(R);
  for (const [k,g] of karts3d) scene.remove(g);
  karts3d = new Map();
  for (const k of R.karts){
    const g = armarKart(k.ficha);
    scene.add(g); karts3d.set(k, g);
  }
  for (const [n,g] of nubesMesh) scene.remove(g); nubesMesh.clear();
  for (const [p,g] of proyMesh) scene.remove(g); proyMesh.clear();
  burbujas = []; mensajeGrande = null; cortina = 40;
  estado = 'carrera';
  /* la cámara arranca detrás del jugador */
  const J = R.J;
  camPos.set(J.x - Math.cos(J.ang)*8, J.y+3.5, J.z - Math.sin(J.ang)*8);
  camMira.set(J.x, J.y+1, J.z);
  document.body.classList.remove('sinBotones');
  hablar('¡Pichunguito al ataque!');
}
function irAlMenu(){
  estado = 'menu'; quitarPodio(); quitarPreview(); camera.clearViewOffset();
  if (!mundo){ T = new Trazado(PISTAS[0]); construirMundo(T); }
  document.body.classList.add('sinBotones');
}
function abrirElegir(){ estado = 'elegir'; mostrarPreview(ELENCO[selPersonaje].id); document.body.classList.add('sinBotones'); }
function abrirPistas(){ estado = 'pista'; quitarPreview(); camera.clearViewOffset(); document.body.classList.add('sinBotones'); }
function volverAFernandoBros(){ try{ location.href = URL_VOLVER; }catch(e){} }

/* --- lo que pasa en la carrera se traduce a sonidos, voces y bocadillos --- */
function atenderEventos(){
  for (const e of R.eventos){
    const k = e.k, mio = k && k.esJugador;
    switch(e.tipo){
      case 'cuenta': sfx.cuenta(); grande(String(e.n), '#ffe36e', 60); break;
      case 'salida': sfx.salida(); grande('¡YA!', '#7dffa0', 60); break;
      case 'caja': if (mio) sfx.caja(); break;
      case 'lanzar': if (mio){ sfx.lanzar(); burbuja('¡Toma, pichungazo!'); } break;
      case 'estrella': if (mio){ sfx.poder(); burbuja('¡Estrella mágica!'); hablar('¡Toma, pichungazo!'); } break;
      case 'burger': if (mio){ sfx.turbo(); burbuja('¡Qué rica hamburguesa!'); hablar('¡Qué rica hamburguesa!'); } break;
      case 'pedo': sfx.pedo(); if (mio){ burbuja('¡Qué pedo tan grande, tío Fran!'); hablar('¡Qué pedo tan grande, tío Fran!'); }
        else if (Math.hypot(k.x-R.J.x, k.z-R.J.z) < 14) burbuja('¡Pedo de tío Fran!', k.nombre); break;
      case 'mini': if (mio) sfx.turbo(); break;
      case 'trompo': if (mio){ sfx.golpe(); sacudida = 14; } break;
      case 'golpe': if (e.de && e.de.esJugador && !mio){ burbuja('¡Toma, pichungazo!'); hablar('¡Toma, pichungazo!'); } break;
      case 'pedoGolpe': if (mio){ burbuja('¡Qué pedo tan podrido, tío Fran!'); hablar('¡Qué pedo tan podrido, tío Fran!'); } break;
      case 'choque': sfx.choque(); break;
      case 'muro': sfx.choque(); break;
      case 'vuelta': if (mio){ sfx.vuelta(); grande(k.vuelta >= R.vueltas-1 ? '¡ÚLTIMA VUELTA!' : 'VUELTA '+(k.vuelta+1), '#ffe36e', 90); } break;
      case 'rebase': burbuja(k.frase, k.nombre, 200); hablar(k.frase);
        if (k.id==='tiofran') sfx.pedo(); else if (k.id==='romulo') sfx.eructo(); break;
      case 'remolque': burbuja('¡Tío Juan te lleva a la meta!', 'Tío Juan', 240); hablar('Eres mi pichunguito'); break;
      case 'meta': if (mio){ sfx.meta(); grande(k.pos===1 ? '¡GANASTE!' : '¡META!', '#7dffa0', 120);
          if (k.pos===1){ hablar('¡Gané! ¡Soy el pichunguito campeón!'); hablar('¡Muy bien, mi pichunguito! ¡Eres un campeón!'); }
          else hablar('¡Qué divertido! ¡Otra vez, otra vez!'); } break;
      case 'fin': terminarCarrera(); break;
    }
  }
  R.eventos.length = 0;
}
function terminarCarrera(){
  estado = 'fin'; cortina = 30;
  document.body.classList.add('sinBotones');
  /* el podio, en el escaparate del cielo */
  quitarPodio();
  podio = new THREE.Group();
  const alturas = [1.6, 1.0, 0.6], xs = [0, -3.2, 3.2], colores = [0xffd700, 0xc0c0c0, 0xcd7f32];
  R.resultado.slice(0,3).forEach((k,i)=>{
    const caja = new THREE.Mesh(new THREE.BoxGeometry(3, alturas[i], 3), new THREE.MeshLambertMaterial({color: colores[i]}));
    caja.position.set(xs[i], alturas[i]/2, 0); podio.add(caja);
    const g = armarKart(k.ficha); g.position.set(xs[i], alturas[i], 0); g.rotation.y = -Math.PI/2; podio.add(g);
  });
  podio.position.copy(ESCAPARATE);
  scene.add(podio);
}

/* ---------------- Entrada en los menús ---------------- */
function procesarTecla(k){
  if (estado==='menu'){
    if (k==='Enter' || k===' ' || k==='Shift') abrirElegir();
    else if (k==='Escape') volverAFernandoBros();
  } else if (estado==='elegir'){
    const n = ELENCO.length, cols = 8;
    if (k==='ArrowLeft') selPersonaje = (selPersonaje+n-1)%n;
    else if (k==='ArrowRight') selPersonaje = (selPersonaje+1)%n;
    else if (k==='ArrowUp' || k==='ArrowDown') selPersonaje = (selPersonaje+cols)%n;
    else if (k==='Enter' || k===' ' || k==='Shift'){ abrirPistas(); return; }
    else if (k==='Escape'){ irAlMenu(); return; }
    else return;
    mostrarPreview(ELENCO[selPersonaje].id); hablar(ELENCO[selPersonaje].frase); sfx.caja();
  } else if (estado==='pista'){
    const n = PISTAS.length;
    if (k==='ArrowLeft') selPista = (selPista+n-1)%n;
    else if (k==='ArrowRight') selPista = (selPista+1)%n;
    else if (k==='ArrowUp' || k==='ArrowDown') selPista = (selPista+3)%n;
    else if (k==='Enter' || k===' ' || k==='Shift') empezarCarrera();
    else if (k==='Escape') abrirElegir();
  } else if (estado==='carrera'){
    if (k==='Escape') irAlMenu();
  } else if (estado==='fin'){
    if (k==='Enter' || k===' ' || k==='Shift' || k==='Escape') abrirPistas();
  }
}
/* toques en la pantalla (en coordenadas lógicas del marcador) */
const zonaAtras = ()=>({x:16, y:12, w:150, h:40});
const enZona = (mx,my,z,m)=>mx>=z.x-(m||0) && mx<=z.x+z.w+(m||0) && my>=z.y-(m||0) && my<=z.y+z.h+(m||0);
hud.addEventListener('pointerdown', e=>{
  audio();
  const mx = e.clientX/(esc/(Math.min(window.devicePixelRatio||1, 2))), my = e.clientY/(esc/(Math.min(window.devicePixelRatio||1, 2)));
  if (estado==='menu'){ if (enZona(mx,my,zonaAtras(),20)) volverAFernandoBros(); else abrirElegir(); }
  else if (estado==='elegir'){
    if (enZona(mx,my,zonaAtras(),20)){ irAlMenu(); return; }
    const z = zonaSiguiente(); if (enZona(mx,my,z,16)){ abrirPistas(); return; }
    for (const c of cajasPersonajes()) if (enZona(mx,my,c)){
      if (selPersonaje===c.idx){ abrirPistas(); return; }
      selPersonaje = c.idx; mostrarPreview(ELENCO[c.idx].id); hablar(ELENCO[c.idx].frase); sfx.caja(); return;
    }
  }
  else if (estado==='pista'){
    if (enZona(mx,my,zonaAtras(),20)){ abrirElegir(); return; }
    for (const c of cajasPistas()) if (enZona(mx,my,c)){ selPista = c.idx; empezarCarrera(); return; }
  }
  else if (estado==='carrera'){ if (enZona(mx,my,zonaAtras(),20)) irAlMenu(); }
  else if (estado==='fin'){ abrirPistas(); }
});

/* ---------------- Actualización ---------------- */
function actualizar(){
  tick++;
  leerMandos();
  if (cortina>0) cortina--;
  if (sacudida>0) sacudida--;
  if (mensajeGrande && --mensajeGrande.t<=0) mensajeGrande = null;
  for (const b of burbujas) b.t--;
  burbujas = burbujas.filter(b=>b.t>0);
  if (estado==='carrera'){
    const ent = {
      izq: izq(), der: der(), atras: atras(), a: botA(), b: botB() && !R.J.usoB,
      dirAn: MANDO.eje ? MANDO.eje : undefined,
    };
    if (ent.dirAn===undefined && (ent.izq||ent.der)) ent.dirAn = (ent.izq?-1:0)+(ent.der?1:0);
    R.J.usoB = botB();       /* B se usa por pulsación, no manteniéndolo */
    pasoCarrera(R, ent);
    atenderEventos();
    if (estado!=='carrera') return;
    sincronizarKarts();
    sincronizarObjetos(R);
    pasoChispas();
    camaraCarrera();
    programarMusica(TEMA_KART);
  } else {
    programarMusica(TEMA_MENU);
    pasoChispas();
    if (estado==='menu'){
      /* la cámara pasea por la pista de portada */
      const s = (tick*0.25) % T.L, m = T.punto(s), m2 = T.punto(s+30);
      camPos.set(m.x + m.nx*10, m.y+6, m.z + m.nz*10);
      camMira.set(m2.x, m2.y+1, m2.z);
      camera.position.lerp(camPos, 0.05); camera.lookAt(camMira);
    } else if (estado==='elegir'){
      if (preview){ preview.rotation.y = tick*0.02; preview.userData.ruedas.forEach(r=>{ r.rotation.z += 0.15; }); }
      const d = disenoElegir(), lejos = d.ancha ? 1 : 1.9;
      camera.position.set(ESCAPARATE.x+3.6*lejos, ESCAPARATE.y+2.2*lejos, ESCAPARATE.z+4.4*lejos);
      camera.lookAt(ESCAPARATE.x, ESCAPARATE.y+1.0, ESCAPARATE.z);
      /* el kart se desplaza en la imagen para dejar sitio a las tarjetas:
         a la izquierda en pantalla ancha, abajo en pantalla estrecha */
      const w = gl.width/renderer.getPixelRatio(), h = gl.height/renderer.getPixelRatio();
      if (d.ancha) camera.setViewOffset(w*1.6, h, w*0.62, 0, w, h);
      else camera.setViewOffset(w, h*1.5, 0, h*(0.75 - d.kartFrac), w, h);
      camera.updateProjectionMatrix();
    } else if (estado==='fin'){
      const a = tick*0.006;
      camera.position.set(ESCAPARATE.x+Math.sin(a)*9, ESCAPARATE.y+4, ESCAPARATE.z+Math.cos(a)*9);
      camera.lookAt(ESCAPARATE.x, ESCAPARATE.y+1.5, ESCAPARATE.z);
      if (podio && tick%3===0) chispa(ESCAPARATE.x+(azar()-0.5)*10, ESCAPARATE.y+6, ESCAPARATE.z+(azar()-0.5)*6,
        ['#ffe36e','#ff6ec0','#7dffa0','#8ecbff'][tick%4], (azar()-0.5)*0.05, -0.02, (azar()-0.5)*0.05, 90);
    } else if (estado==='pista'){
      const s = (tick*0.25) % T.L, m = T.punto(s), m2 = T.punto(s+30);
      camPos.set(m.x + m.nx*10, m.y+6, m.z + m.nz*10); camMira.set(m2.x, m2.y+1, m2.z);
      camera.position.lerp(camPos, 0.05); camera.lookAt(camMira);
    }
  }
}
function sincronizarKarts(){
  for (const k of R.karts){
    const g = karts3d.get(k);
    g.position.set(k.x, k.y, k.z);
    let ry = -k.ang;
    if (k.giroT>0) ry += (75-k.giroT)*0.25;   /* el trompo */
    g.rotation.set(0, ry, 0);
    /* inclinación de la carretera: se mira la pendiente hacia delante */
    const yA = T.altura(k.x+Math.cos(k.ang)*1.2, k.z+Math.sin(k.ang)*1.2, k.si), yB = T.altura(k.x-Math.cos(k.ang)*1.2, k.z-Math.sin(k.ang)*1.2, k.si);
    g.rotateZ(Math.atan2(yA-yB, 2.4));
    g.rotateX(-k.inclin*0.6);
    g.position.y += (k.y - T.altura(k.x,k.z,k.si));
    const u = g.userData;
    u.ruedas.forEach((r,i)=>{ r.rotation.z = -k.rueda; if (i<2) r.rotation.y = -k.inclin*0.8; });
    if (u.capa){ u.capa.rotation.x = 0.4 + Math.sin(tick/4)*0.25 + Math.min(k.vel,0.7)*0.8; }
    u.sombra.position.y = 0.03 - (k.y - T.altura(k.x,k.z,k.si));
    /* estrella: el kart brilla de colores */
    if (k.estrella>0){ u.mat.emissive = u.mat.emissive || new THREE.Color(); u.mat.emissive.setHSL((tick*0.05)%1, 0.9, 0.35); }
    else if (u.mat.emissive) u.mat.emissive.setRGB(0,0,0);
    /* chispas del derrape, fuego del turbo y humo */
    const bx = k.x - Math.cos(k.ang)*1.3, bz = k.z - Math.sin(k.ang)*1.3;
    if (k.derrape>0 && tick%2===0){
      const c = k.derrape>45 ? '#ff9a30' : '#ffe36e';
      chispa(bx + Math.sin(k.ang)*0.7*k.derrapeDir, k.y+0.2, bz - Math.cos(k.ang)*0.7*k.derrapeDir, c, (azar()-0.5)*0.1, 0.05, (azar()-0.5)*0.1, 18);
      if (k.esJugador && tick%6===0) sfx.chispa();
    }
    if ((k.turbo>0 || k.mini>0) && tick%2===0) chispa(bx, k.y+0.5, bz, tick%4?'#ff6a20':'#ffe36e', -Math.cos(k.ang)*0.15, 0.02, -Math.sin(k.ang)*0.15, 14);
    if (k.esJugador && k.vel>0.1 && tick%5===0) chispa(bx, k.y+0.45, bz, '#c8c8d0', (azar()-0.5)*0.03, 0.02, (azar()-0.5)*0.03, 20);
  }
  for (let i=0;i<R.cajas.length;i++){
    const c = R.cajas[i], m = cajasMesh[i];
    m.visible = c.activa; m.rotation.y = c.giro; m.rotation.x = c.giro*0.7;
    m.position.y = c.y + 1.1 + Math.sin(c.giro*2)*0.15;
    m.material.color.setHSL((c.giro*0.1)%1, 0.7, 0.75);
  }
}
function camaraCarrera(){
  const J = R.J;
  const atrasD = 7.5, alto = 3.2;
  const ang = J.ang;
  const objetivo = new THREE.Vector3(J.x - Math.cos(ang)*atrasD, T.altura(J.x - Math.cos(ang)*atrasD, J.z - Math.sin(ang)*atrasD, J.si) + alto, J.z - Math.sin(ang)*atrasD);
  objetivo.y = Math.max(objetivo.y, J.y + 2.2);
  camPos.lerp(objetivo, R.fase==='cuenta' ? 0.04 : 0.12);
  camMira.lerp(new THREE.Vector3(J.x + Math.cos(ang)*3, J.y + 1.1, J.z + Math.sin(ang)*3), 0.2);
  camera.position.copy(camPos);
  if (sacudida>0){ camera.position.x += (azar()-0.5)*0.4; camera.position.y += (azar()-0.5)*0.3; }
  camera.lookAt(camMira);
  camera.rotateZ(-J.inclin*0.12);
  fovObj = 72 + (J.turbo>0||J.mini>0 ? 12 : 0) + Math.min(J.vel,0.9)*6;
  camera.fov += (fovObj - camera.fov)*0.08; camera.updateProjectionMatrix();
}

/* ---------------- Marcador y menús en 2D ---------------- */
function texto(t, x, y, tam, color, alin, negrita){
  ctx.font = (negrita===false?'':'bold ')+tam+'px monospace'; ctx.fillStyle = color; ctx.textAlign = alin||'left';
  ctx.fillText(t, x, y);
}
function textoBorde(t, x, y, tam, color, alin){
  ctx.font = 'bold '+tam+'px monospace'; ctx.textAlign = alin||'center';
  ctx.lineWidth = Math.max(3, tam/7); ctx.strokeStyle = 'rgba(0,0,0,0.75)'; ctx.lineJoin = 'round';
  ctx.strokeText(t, x, y); ctx.fillStyle = color; ctx.fillText(t, x, y);
}
function panel(x,y,w,h,color,r){
  ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x,y,w,h,r||12); ctx.fill();
}
function botonAtras(txt){
  const z = zonaAtras();
  panel(z.x,z.y,z.w,z.h,'rgba(0,0,0,0.35)');
  ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=2; ctx.stroke();
  texto(txt, z.x+z.w/2, z.y+26, 16, '#fff', 'center');
}
/* con pantalla ancha el kart gira a la izquierda y las tarjetas van a la
   derecha; en pantallas estrechas las tarjetas van arriba, la ficha en
   medio y el kart abajo, más pequeño */
const anchaPantalla = ()=> W >= 860;
function disenoElegir(){
  const ancha = anchaPantalla();
  const anc = ancha ? 88 : 82, alt = ancha ? 70 : 64, hueco = 6;
  const zonaX = ancha ? W*0.38 : 12, zonaW = ancha ? W - 12 - zonaX : W - 24;
  const cols = Math.max(3, Math.min(8, Math.floor((zonaW+hueco)/(anc+hueco))));
  const filas = Math.ceil(ELENCO.length/cols);
  const x0 = zonaX + (zonaW - (cols*anc + (cols-1)*hueco))/2;
  const y0 = ancha ? 292 : 108;
  const abajo = y0 + filas*(alt+hueco);
  const panelY = ancha ? 100 : abajo + 8, panelH = ancha ? 180 : 92;
  /* dónde queda el centro del kart en pantalla (fracción de la altura) */
  const kartFrac = ancha ? 0.55 : Math.min(0.86, (panelY + panelH + H)/2/H - 0.03);
  return {ancha, anc, alt, hueco, cols, x0, y0, abajo, panelY, panelH, kartFrac};
}
function cajasPersonajes(){
  const d = disenoElegir();
  return ELENCO.map((c,i)=>({x: d.x0 + (i%d.cols)*(d.anc+d.hueco), y: d.y0 + Math.floor(i/d.cols)*(d.alt+d.hueco), w:d.anc, h:d.alt, idx:i, c}));
}
function zonaSiguiente(){ return anchaPantalla() ? {x: W-230, y: 64, w: 210, h: 46} : {x: W-212, y: 10, w: 200, h: 42}; }
function cajasPistas(){
  const anc = 250, alt = 150, hueco = 14, cols = 3;
  const x0 = W/2 - (cols*anc + (cols-1)*hueco)/2;
  return PISTAS.map((p,i)=>({x: x0 + (i%cols)*(anc+hueco), y: 118 + Math.floor(i/cols)*(alt+hueco), w:anc, h:alt, idx:i, p}));
}
function miniPista(p, cx, cy, e, grosor, colorRuta){
  ctx.strokeStyle = colorRuta; ctx.lineWidth = grosor; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const Tp = p._T || (p._T = new Trazado(p));
  const mx = (Tp.lim.x0+Tp.lim.x1)/2, mz = (Tp.lim.z0+Tp.lim.z1)/2;
  ctx.beginPath();
  for (let i=0;i<=Tp.N;i+=3){ const m = Tp.M[i%Tp.N]; const x = cx+(m.x-mx)*e, y = cy+(m.z-mz)*e; i? ctx.lineTo(x,y) : ctx.moveTo(x,y); }
  ctx.closePath(); ctx.stroke();
  return {mx, mz};
}
function dibujarMenu(){
  panel(0,0,W,H,'rgba(0,0,0,0.25)',0);
  textoBorde('PICHUNGITO', W/2, 150, 78, '#ffe36e');
  textoBorde('KART', W/2, 232, 78, '#ff6a4a');
  textoBorde('con Fernando, Penny, Sheldon, Cucú, Tío Juan y toda la familia', W/2, 282, 17, '#fff');
  if ((tick>>4)%2===0) textoBorde('TOCA LA PANTALLA O PULSA ENTER', W/2, 380, 24, '#7dffa0');
  textoBorde('◀ ▶ girar · A derrape y miniturbo · B poder · ▼ freno', W/2, 430, 15, '#dfe8ff');
  textoBorde('¿No escuchas las voces? Quita el modo silencio y sube el volumen', W/2, 500, 13, '#bcd6ff');
  botonAtras('◀ FERNANDO BROS');
  texto('v1', W-30, 20, 12, 'rgba(255,255,255,0.6)', 'right');
}
function dibujarElegir(){
  const d = disenoElegir(), ancha = d.ancha;
  textoBorde('ELIGE TU PICHUNGUITO', ancha ? W*0.66 : W/2, ancha ? 46 : 88, ancha ? 34 : 26, '#ffe36e');
  const c = ELENCO[selPersonaje];
  const px = ancha ? W*0.66 : W/2, py = d.panelY, pw = Math.min(360, W-24);
  panel(px-pw/2, py, pw, d.panelH, 'rgba(0,0,0,0.45)');
  texto(c.emoji+' '+c.nombre.toUpperCase(), px, py+42, 28, '#fff', 'center');
  texto('«'+c.frase+'»', px, py+74, 13, '#ffe36e', 'center');
  if (ancha){
    const barra = (y, txt, v)=>{
      texto(txt, px-pw/2+20, y, 14, '#dfe8ff');
      panel(px-pw/2+130, y-13, pw-150, 16, 'rgba(255,255,255,0.2)', 6);
      panel(px-pw/2+130, y-13, (pw-150)*Math.min(1,(v-0.85)/0.3), 16, '#7dffa0', 6);
    };
    barra(py+120, 'VELOCIDAD', c.vel); barra(py+152, 'GIRO', c.giro);
  }
  for (const q of cajasPersonajes()){
    const s = q.idx===selPersonaje;
    panel(q.x, q.y, q.w, q.h, s ? 'rgba(255,227,110,0.95)' : 'rgba(255,255,255,0.18)');
    if (s){ ctx.strokeStyle='#fff'; ctx.lineWidth=4; ctx.stroke(); }
    const ch = q.h - 28;
    panel(q.x+6, q.y+6, q.w-12, ch, q.c.color, 8);
    texto(q.c.emoji, q.x+q.w/2, q.y+6+ch*0.74, 22, '#fff', 'center');
    texto(q.c.nombre, q.x+q.w/2, q.y+q.h-8, 11, s?'#222':'#fff', 'center');
  }
  const z = zonaSiguiente();
  panel(z.x, z.y, z.w, z.h, '#2a9c3a'); ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke();
  texto('ELEGIR PISTA ▶', z.x+z.w/2, z.y+30, 18, '#fff', 'center');
  botonAtras('✕ VOLVER');
  if ((tick>>4)%2===0) textoBorde('Toca a tu pichunguito y luego ELEGIR PISTA', W/2, H-14, 15, '#fff');
}
function dibujarPistas(){
  panel(0,0,W,H,'rgba(0,0,0,0.3)',0);
  textoBorde('🏁 ELIGE TU PISTA 🏁', W/2, 60, 36, '#ffe36e');
  textoBorde('Recoge las cajas ? y lanza tu poder con B', W/2, 90, 15, '#dfe8ff');
  for (const q of cajasPistas()){
    const s = q.idx===selPista;
    panel(q.x, q.y, q.w, q.h, '#'+new THREE.Color(q.p.cielo).getHexString());
    ctx.lineWidth = s?6:3; ctx.strokeStyle = s?'#ffe36e':'rgba(255,255,255,0.45)'; ctx.stroke();
    miniPista(q.p, q.x+q.w/2, q.y+78, 0.24, 11, '#'+new THREE.Color(q.p.asfalto).getHexString());
    miniPista(q.p, q.x+q.w/2, q.y+78, 0.24, 3, 'rgba(255,255,255,0.85)');
    texto(q.p.emoji, q.x+q.w/2, q.y+30, 24, '#fff', 'center');
    texto(q.p.nombre, q.x+q.w/2, q.y+q.h-12, 14, '#ffe36e', 'center');
  }
  botonAtras('✕ VOLVER');
  if ((tick>>4)%2===0) textoBorde('Toca una pista · flechas + ENTER', W/2, H-14, 15, '#fff');
}
function dibujarHUD(){
  const J = R.J;
  /* posición gigante, como en el Mario Kart 64 */
  const ord = J.pos + 'º';
  textoBorde(ord, W-40, H-30, 84, J.pos===1?'#ffe36e':J.pos<=3?'#7dffa0':'#fff', 'right');
  textoBorde('de '+R.karts.length, W-40, H-8, 16, '#fff', 'right');
  /* vueltas */
  const v = Math.max(1, Math.min(J.vuelta+1, R.vueltas));
  textoBorde('VUELTA '+v+'/'+R.vueltas, W-20, 36, 24, '#fff', 'right');
  /* velocímetro */
  const kmh = Math.round(Math.abs(J.vel)/VMAX*120);
  textoBorde(kmh+' km/h', W-20, 62, 16, '#dfe8ff', 'right');
  /* el poder */
  const px = W/2, py = 46;
  panel(px-36, py-32, 72, 72, 'rgba(0,0,0,0.45)', 16);
  ctx.strokeStyle='#ffe36e'; ctx.lineWidth=3; ctx.stroke();
  if (J.poder){
    const claves = Object.keys(PODERES);
    const p = J.ruleta>0 ? claves[(tick>>2)%claves.length] : J.poder;
    texto(PODERES[p].emoji, px, py+16, 40, '#fff', 'center');
    if (J.ruleta===0) textoBorde(PODERES[p].nombre, px, py+58, 13, '#ffe36e');
    if (J.ruleta===0 && (tick>>3)%2===0) textoBorde('B', px+46, py-14, 18, '#7dffa0');
  }
  /* minimapa */
  const mx0 = 84, my0 = H-92, e = 0.28;
  const cen = miniPista(R.pista, mx0, my0, e, 9, 'rgba(0,0,0,0.5)');
  miniPista(R.pista, mx0, my0, e, 5, 'rgba(255,255,255,0.7)');
  for (const k of [...R.karts].sort((a,b)=>b.pos-a.pos)){
    const x = mx0+(k.x-cen.mx)*e, y = my0+(k.z-cen.mz)*e;
    ctx.fillStyle = k.color; ctx.beginPath(); ctx.arc(x, y, k.esJugador?7:4.5, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = k.esJugador?'#ffe36e':'#fff'; ctx.lineWidth = k.esJugador?3:1; ctx.stroke();
  }
  /* estrella y turbo */
  if (J.estrella>0){ panel(px-80, py+64, 160, 8, 'rgba(0,0,0,0.4)', 4); panel(px-80, py+64, 160*J.estrella/380, 8, `hsl(${(tick*8)%360},90%,60%)`, 4); }
  if (J.turbo>0){ panel(px-80, py+76, 160, 8, 'rgba(0,0,0,0.4)', 4); panel(px-80, py+76, 160*J.turbo/130, 8, '#ff9a30', 4); }
  if (R.fase==='cuenta'){
    textoBorde(ELENCO[selPersonaje].nombre.toUpperCase()+' EN '+R.pista.nombre, W/2, H-40, 20, '#fff');
  }
  /* salida: el ✕ */
  botonAtras('✕ SALIR');
  /* bocadillos */
  let by = H-150;
  for (const b of burbujas){
    ctx.font = 'bold 16px monospace';
    const wtx = ctx.measureText(b.txt).width + 24, a = Math.min(1, b.t/25);
    ctx.globalAlpha = a;
    panel(W/2-wtx/2, by-24, wtx, 34, '#fff', 10);
    texto(b.txt, W/2, by, 16, '#111', 'center');
    if (b.quien) texto(b.quien, W/2-wtx/2+6, by-28, 12, '#ffe36e', 'left');
    ctx.globalAlpha = 1; by -= 48;
  }
  if (mensajeGrande){
    const m = mensajeGrande, f = m.t/m.t0, tam = 60 + (1-Math.min(1,(m.t0-m.t)/12))*60;
    ctx.globalAlpha = Math.min(1, m.t/15);
    textoBorde(m.txt, W/2, H/2-30, tam, m.color);
    ctx.globalAlpha = 1;
  }
}
function dibujarFin(){
  panel(0,0,W,H,'rgba(0,0,0,0.25)',0);
  const pos = R.J.pos;
  textoBorde('🏁 PICHUNGITO KART 🏁', W/2, 54, 34, '#ffe36e');
  textoBorde(pos===1 ? '¡GANASTE LA COPA PICHUNGUITO! 🏆' : 'Llegaste de '+pos+'º — ¡bien pichunguito!', W/2, 92, 22, '#fff');
  panel(W-330, 112, 310, 26*Math.min(R.resultado.length,12)+20, 'rgba(0,0,0,0.5)');
  R.resultado.forEach((k,i)=>{
    const y = 136 + i*26, med = ['🥇','🥈','🥉'][i] || (i+1)+'º';
    texto(med+'  '+k.nombre + (k.esJugador?'  ← ¡tú!':''), W-316, y, 16, k.esJugador?'#ffe36e':'#dfe8ff');
  });
  if ((tick>>4)%2===0) textoBorde('Toca la pantalla o ENTER para otra carrera', W/2, H-18, 18, '#7dffa0');
}
function dibujar(){
  renderer.render(scene, camera);
  ctx.setTransform(esc,0,0,esc,0,0);
  ctx.clearRect(0,0,W,H);
  if (estado==='menu') dibujarMenu();
  else if (estado==='elegir') dibujarElegir();
  else if (estado==='pista') dibujarPistas();
  else if (estado==='carrera') dibujarHUD();
  else if (estado==='fin') dibujarFin();
  if (cortina>0){ ctx.fillStyle = 'rgba(0,0,0,'+(cortina/40)+')'; ctx.fillRect(0,0,W,H); }
  if (MANDO.avisoT>0){ MANDO.avisoT--; textoBorde('🎮 MANDO CONECTADO', W/2, 100, 22, '#7dffa0'); }
}
addEventListener('gamepadconnected', ()=>{ MANDO.avisoT = 200; });

/* ---------------- Bucle principal: 60 pasos por segundo, pase lo que pase ---------------- */
let ultimo = performance.now(), acum = 0;
function bucle(ahora){
  requestAnimationFrame(bucle);
  acum += Math.min(100, ahora - ultimo); ultimo = ahora;
  let pasos = 0;
  while (acum >= 1000/60 && pasos < 4){ actualizar(); acum -= 1000/60; pasos++; }
  if (pasos===4) acum = 0;
  dibujar();
}
/* asas para las pruebas automáticas (no hacen nada en el juego) */
window.PK = { get estado(){ return estado; }, get R(){ return R; }, get karts3d(){ return karts3d; }, camera, scene, tecla: procesarTecla };
irAlMenu();
requestAnimationFrame(bucle);
})();
