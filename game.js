'use strict';
/* ============================================================
   FERNANDO BROS — un plataformas estilo Super Mario Bros 3
   Vidas infinitas · Perritos Negro y Marrón · Tío Juan · Santi
   Abu · Cucú · ¡Hamburguesas de súper velocidad!
   ============================================================ */
const cv = document.getElementById('cv');
let ctx = cv.getContext('2d');
const W = cv.width, H = cv.height;
const TILE = 32, ROWS = 15, HUD_H = 60;
const GRAV = 0.55, MAXFALL = 12;
const ZOOM = 1.2, VW = Math.round(W/ZOOM); // el mundo se ve un poquito más grande

/* ---------------- Voz (Web Speech API) ---------------- */
let voces = [];
function cargarVoces(){ voces = speechSynthesis.getVoices(); }
cargarVoces();
if (typeof speechSynthesis !== 'undefined') speechSynthesis.onvoiceschanged = cargarVoces;
/* Diálogos grabados con voz de niño en español (archivos mp3 del juego).
   Los archivos de audio SÍ suenan siempre en iPhone (incluso en modo
   silencio), a diferencia de la voz sintética de Safari. */
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
  /* Fernando Kart: cada personaje con su propia voz natural */
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
let reproductor = null, clipsListos = false, hablando = false;
function prepararClips(){
  /* iOS bloquea los audios que no se tocan directamente: usamos UN solo
     reproductor que se desbloquea con el primer toque del usuario y luego
     va cambiando de frase. */
  if (clipsListos || typeof Audio === 'undefined') return;
  clipsListos = true;
  try{
    reproductor = new Audio();
    reproductor.preload = 'auto';
    reproductor.src = CLIPS['¡Fernando Bros! ¡Vamos Penny y Sheldon!'];
    if (reproductor.load) reproductor.load();
  }catch(e){ reproductor = null; }
}
function vozEspanola(){
  if (!voces.length) cargarVoces();
  const es = voces.filter(v=>v.lang && v.lang.toLowerCase().startsWith('es'));
  /* preferir español de América si existe */
  return es.find(v=>/es[-_](419|MX|US|CO|VE|AR|CL)/i.test(v.lang)) || es[0] || null;
}
/* Cola de diálogos: cada frase espera a que termine la anterior,
   para que las voces no se corten una sobre otra. */
/* Cola de diálogos: cada frase espera a que termine la anterior.
   Si un audio no arranca en 2 segundos, habla la voz del navegador. */
let colaVoz = [];
function hablar(texto){
  const src2 = CLIPS[texto];
  if (!src2){ hablarTTS(texto); return; }
  colaVoz.push({src: src2, texto});
  if (colaVoz.length > 4) colaVoz.shift();
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
    reproductor.onended = ()=>{ hablando=false; reproducirCola(); };
    reproductor.onerror = fallar;
    reproductor.onplaying = ()=>{ sono = true; };
    if (reproductor.src !== sig.src) reproductor.src = sig.src;
    else { try{ reproductor.currentTime = 0; }catch(e){} }
    const p = reproductor.play();
    if (p && p.catch) p.catch(fallar);
    setTimeout(()=>{ if(!sono) fallar(); }, 2000);
  }catch(e){ hablando=false; hablarTTS(sig.texto); }
}
/* Cada personaje nuevo tiene su propia voz (tono y velocidad) */
const VOCES_TTS = {
  'Eres mi pichunguito': {pitch:0.6, rate:0.95},                       // Tío Juan
  '¡Épale! ¡Aquí viene tío Nacho!': {pitch:0.85, rate:1.15},           // Tío Nacho
  '¡Hola mi amor! ¡Soy tía Yanny!': {pitch:1.45, rate:1.0},            // Tía Yanny
  '¡Brrrp! ¡Qué rica cerveza! ¡Ay, qué pena!': {pitch:0.35, rate:0.8}, // Rómulo el Penoso
  '¡Hola pichunguito! ¡Soy tío Beto!': {pitch:0.75, rate:1.0},          // Tío Beto
  '¡Un abrazo, pichunguito! ¡Soy tía Giuliana!': {pitch:1.3, rate:1.05}, // Tía Giuliana
};
function hablarTTS(texto){
  /* respaldo: voz sintética del navegador, con tono de niño.
     iOS exige que la PRIMERA frase suene dentro del toque del usuario:
     si no hay nada sonando, hablamos de inmediato (sin retraso). */
  if (typeof speechSynthesis === 'undefined') return;
  try{
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-ES';
    const v = vozEspanola();
    if (v){ u.voice = v; u.lang = v.lang; }
    const perfil = VOCES_TTS[texto];
    u.pitch = perfil ? perfil.pitch : 1.9;
    u.rate = perfil ? perfil.rate : 1.05;
    u.volume = 1;
    if (speechSynthesis.speaking || speechSynthesis.pending){
      speechSynthesis.cancel();
      setTimeout(()=>{ try{ speechSynthesis.resume(); speechSynthesis.speak(u); }catch(e){} }, 120);
    } else {
      speechSynthesis.resume();
      speechSynthesis.speak(u);
    }
  }catch(e){}
}

/* ---------------- Sonido (Web Audio) ---------------- */
let AC = null;
function audio(){ prepararClips(); if(!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(AC && AC.state==='suspended') AC.resume(); }
function beep(freq, dur, tipo, vol, t0){
  if(!AC) return;
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = tipo||'square'; o.frequency.value = freq;
  g.gain.setValueAtTime(vol||0.08, AC.currentTime+(t0||0));
  g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime+(t0||0)+dur);
  o.connect(g); g.connect(AC.destination);
  o.start(AC.currentTime+(t0||0)); o.stop(AC.currentTime+(t0||0)+dur+0.02);
}
const sfx = {
  salto(){ beep(320,0.12,'square',0.06); beep(520,0.12,'square',0.05,0.05); },
  moneda(){ beep(988,0.08,'square',0.07); beep(1319,0.25,'square',0.07,0.08); },
  pisoton(){ beep(200,0.1,'triangle',0.1); beep(120,0.12,'triangle',0.08,0.06); },
  poder(){ [523,659,784,1047,1319].forEach((f,i)=>beep(f,0.1,'square',0.06,i*0.07)); },
  dano(){ [400,300,200].forEach((f,i)=>beep(f,0.12,'sawtooth',0.07,i*0.09)); },
  romper(){ beep(150,0.15,'sawtooth',0.1); },
  fuego(){ beep(700,0.08,'sawtooth',0.05); },
  heroe(){ [392,523,659,784,1047].forEach((f,i)=>beep(f,0.14,'triangle',0.08,i*0.09)); },
  meta(){ [523,587,659,784,880,1047,1319].forEach((f,i)=>beep(f,0.18,'square',0.07,i*0.11)); },
  muerte(){ [660,494,392,330,262].forEach((f,i)=>beep(f,0.14,'square',0.06,i*0.1)); },
  huevo(){ beep(600,0.06,'square',0.07); beep(800,0.06,'square',0.07,0.07); beep(1000,0.15,'square',0.07,0.14); },
  pedo(){ for(let i=0;i<14;i++) beep(92-i*4+(i%2)*16, 0.11, 'sawtooth', 0.28, i*0.06); },
  eructo(){ [84,66,94,56,74,50,68,44].forEach((f,i)=>beep(f,0.15,'sawtooth',0.3,i*0.08)); },
  beso(){ beep(880,0.07,'sine',0.1); beep(1175,0.18,'sine',0.1,0.08); },
};


/* ---------------- Música 8-bits (compuesta con código, gratis) ---------------- */
let musPaso = 0, musProx = 0, musTema = 'mundo';
const TEMAS = {
  /* notas MIDI; 0 = silencio. Corcheas. */
  mundo: { bpm: 152,
    mel: [72,0,76,79, 76,0,72,0, 74,0,77,81, 77,0,74,0,
          72,0,76,79, 84,0,81,79, 77,76,74,76, 72,0,0,0,
          69,0,72,76, 72,0,69,0, 71,0,74,77, 74,0,71,0,
          72,0,76,79, 84,0,88,84, 81,79,77,74, 72,0,0,0],
    bajo:[48,55,48,55, 50,57,50,57, 48,55,48,55, 43,50,43,50,
          45,52,45,52, 47,54,47,54, 48,55,48,55, 43,47,48,0] },
  kart: { bpm: 176,
    mel: [69,0,69,71, 72,0,69,0, 67,0,64,67, 69,0,0,0,
          69,0,69,71, 72,74,76,0, 74,72,71,72, 69,0,0,0,
          76,0,74,72, 71,0,72,74, 76,0,74,72, 71,72,74,0,
          69,72,76,81, 79,76,72,69, 71,72,74,76, 69,0,0,0],
    bajo:[45,45,52,45, 43,43,50,43, 41,41,48,41, 43,43,50,43,
          45,45,52,45, 48,48,55,48, 43,43,50,43, 45,52,45,0] },
};
const frecuencia = n => 440*Math.pow(2,(n-69)/12);
function tonoAbs(freq, cuando, dur, tipo, vol){
  if(!AC) return;
  try{
    const o=AC.createOscillator(), g=AC.createGain();
    o.type=tipo; o.frequency.value=freq;
    g.gain.setValueAtTime(vol, cuando);
    g.gain.exponentialRampToValueAtTime(0.001, cuando+dur);
    o.connect(g); g.connect(AC.destination);
    o.start(cuando); o.stop(cuando+dur+0.02);
  }catch(e){}
}
function programarMusica(){
  if (!AC || AC.state!=='running') return;
  const temaAhora = (estado==='kart'||estado==='kartFin') ? 'kart' : 'mundo';
  if (temaAhora !== musTema){ musTema = temaAhora; musPaso = 0; }
  if (musProx < AC.currentTime) musProx = AC.currentTime + 0.05;
  const t = TEMAS[musTema], dur = 60/t.bpm/2;
  while (musProx < AC.currentTime + 0.35){
    const m = t.mel[musPaso % t.mel.length];
    if (m) tonoAbs(frecuencia(m), musProx, dur*0.85, 'square', 0.028);
    if (musPaso % 2 === 0){
      const b = t.bajo[(musPaso>>1) % t.bajo.length];
      if (b) tonoAbs(frecuencia(b), musProx, dur*1.7, 'triangle', 0.05);
    }
    musPaso++; musProx += dur;
  }
}
/* ---------------- Entrada ---------------- */
/* Bloquear el zoom de Safari en iPhone: el doble toque rápido (al saltar
   una y otra vez) y el pellizco agrandan la página y esconden los
   controles; Safari ignora user-scalable=no, así que se frena aquí. */
for (const ev of ['gesturestart','gesturechange','gestureend'])
  document.addEventListener(ev, e=>e.preventDefault());
document.addEventListener('dblclick', e=>e.preventDefault());
document.addEventListener('touchstart', e=>{ e.preventDefault();
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }, {passive:false});
document.addEventListener('touchmove', e=>e.preventDefault(), {passive:false});
document.addEventListener('touchend', e=>e.preventDefault(), {passive:false});

const keys = {};
addEventListener('keydown', e=>{
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)) e.preventDefault();
  keys[e.key.toLowerCase()] = true; keys[e.key] = true;
  audio();
  if (mjActivo()){ MJ.tecla(e.key); return; }
  if (estado==='menu' && (e.key==='k'||e.key==='K')) iniciarKart();
  else if (estado==='menu' && (e.key==='Enter'||e.key===' ')) estado='mapa';
  else if (estado==='mapa'){
    if (e.key==='ArrowLeft') selMapa=(selMapa+11)%12;
    else if (e.key==='ArrowRight') selMapa=(selMapa+1)%12;
    else if (e.key==='ArrowUp') selMapa = selMapa>=10 ? (selMapa===10?5:8) : Math.max(selMapa-5, 0);
    else if (e.key==='ArrowDown') selMapa = selMapa>=5 && selMapa<10 ? (selMapa<8?10:11) : Math.min(selMapa+5, 11);
    else if (e.key>='1'&&e.key<='9') { empezarJuego(+e.key-1); }
    else if (e.key==='0') { empezarJuego(9); }
    else if (e.key==='k'||e.key==='K') iniciarKart();
    else if (e.key==='a'||e.key==='A') { if (typeof MJ!=='undefined') MJ.abrirArcade(); }
    else if (e.key==='Enter'||e.key===' '){
      if(selMapa===10) iniciarKart();
      else if(selMapa===11){ if (typeof MJ!=='undefined') MJ.abrirArcade(); }
      else empezarJuego(selMapa);
    }
    else if (e.key==='Escape') estado='menu';
  }
  else if (estado==='kartPista'){
    if (e.key==='ArrowLeft') selPista=(selPista+PISTAS.length-1)%PISTAS.length;
    else if (e.key==='ArrowRight') selPista=(selPista+1)%PISTAS.length;
    else if (e.key==='ArrowUp'||e.key==='ArrowDown') selPista=(selPista+3)%PISTAS.length;
    else if (e.key==='Enter'||e.key===' ') iniciarCarrera(selPista);
    else if (e.key==='Escape') estado='mapa';
  }
  else if (estado==='kartFin' && (e.key==='Enter'||e.key===' ')) estado='fin';
  else if (estado==='fin' && (e.key==='Enter')) estado='menu';
});
addEventListener('keyup', e=>{ keys[e.key.toLowerCase()] = false; keys[e.key] = false; });
function tocar(id, k){
  const el = document.getElementById(id);
  const on = ev=>{ ev.preventDefault(); keys[k]=true; audio();
    if(estado==='menu'){ if(k==='shift') iniciarKart(); else estado='mapa'; }
    else if(estado==='mapa'){
      if(k==='arrowleft') selMapa=(selMapa+10)%11;
      else if(k==='arrowright') selMapa=(selMapa+1)%11;
      else if(k==='arrowdown') selMapa = selMapa>=5 && selMapa<10 ? 10 : Math.min(selMapa+5, 10);
      else if(k==='shift') iniciarKart();
      else if(k===' '){
        if(selMapa===10) iniciarKart();
        else if(selMapa===11){ if (typeof MJ!=='undefined') MJ.abrirArcade(); }
        else empezarJuego(selMapa);
      }
    }
    else if(estado==='kartPista'){
      if(k==='arrowleft') selPista=(selPista+PISTAS.length-1)%PISTAS.length;
      else if(k==='arrowright') selPista=(selPista+1)%PISTAS.length;
      else if(k===' ') iniciarCarrera(selPista);
    }
    else if(estado==='kartFin'){ estado='fin'; } };
  const off= ev=>{ ev.preventDefault(); keys[k]=false; };
  el.addEventListener('pointerdown', on); el.addEventListener('pointerup', off);
  el.addEventListener('pointerleave', off); el.addEventListener('pointercancel', off);
}
tocar('bL','arrowleft'); tocar('bR','arrowright');
tocar('bUp','arrowup'); tocar('bDown','arrowdown');
tocar('bA',' '); tocar('bB','shift');
cv.addEventListener('pointerdown', (e)=>{
  audio();
  const r = cv.getBoundingClientRect();
  const mx = (e.clientX-r.left)*(W/r.width), my = (e.clientY-r.top)*(H/r.height);
  if (estado==='menu') estado='mapa';
  else if (estado==='kartPista'){
    for(const c of cajasPista())
      if (mx>=c.x && mx<=c.x+c.w && my>=c.y && my<=c.y+c.h){ selPista=c.idx; iniciarCarrera(c.idx); break; }
  }
  else if (estado==='mapa'){
    for(const c of cajasMapa()){
      if (mx>=c.x && mx<=c.x+c.w && my>=c.y && my<=c.y+c.h){
        selMapa=c.idx;
        if (c.idx===10) iniciarKart();
        else if (c.idx===11){ if (typeof MJ!=='undefined') MJ.abrirArcade(); }
        else empezarJuego(c.idx);
        break;
      }
    }
  }
  else if (estado==='kartFin') estado='fin';
  else if (estado==='fin') estado='menu';
});
const izq   = ()=> keys['arrowleft']||keys['a'];
const der   = ()=> keys['arrowright']||keys['d'];
const abajo = ()=> keys['arrowdown']||keys['s'];
const kSalto= ()=> keys[' ']||keys['z']||keys['arrowup']||keys['w'];
const kCorre= ()=> keys['shift']||keys['x'];

/* ---------------- Nivel: constructor de mapas ---------------- */
let grid=[], LEVW=0, entidadesNivel=[];
function nuevoMapa(w){
  LEVW = w;
  grid = Array.from({length:ROWS}, ()=>Array(w).fill('.'));
  for(let x=0;x<w;x++){ grid[13][x]='#'; grid[14][x]='#'; }
}
const setT=(x,y,c)=>{ if(y>=0&&y<ROWS&&x>=0&&x<LEVW) grid[y][x]=c; };
const getT=(x,y)=>{ if(y<0||x<0||x>=LEVW) return '.'; if(y>=ROWS) return '#'; return grid[y][x]; };
function hueco(x0,x1){ for(let x=x0;x<=x1;x++){ setT(x,13,'.'); setT(x,14,'.'); } }
function fila(x0,x1,y,c){ for(let x=x0;x<=x1;x++) setT(x,y,c); }
function colina(x,w,h){ for(let i=0;i<h;i++) fila(x+i, x+w-1-i, 12-i, 'W'); }
function tubo(x,h){ for(let i=0;i<h;i++){ setT(x,12-i,'l'); setT(x+1,12-i,'l'); } }
function arco(x0,y,n){ for(let i=0;i<n;i++) setT(x0+i, y - Math.round(Math.sin(i/(n-1)*Math.PI)*2), 'C'); }
const SOLIDOS = '#BW?MSXl=O';
const esSolido = c => SOLIDOS.includes(c);

function ent(tipo,x,y){ entidadesNivel.push({tipo, x:x*TILE, y:y*TILE}); }

/* alarga un mundo con un patrón seguro: huecos ≤3, bloques a fila 10, tubos ≤3 */
function tramoExtra(x0, x1){
  let k = 0;
  for(let x = x0; x + 24 <= x1; x += 24, k++){
    hueco(x+3, x+5);
    fila(x+9, x+12, 10, 'B'); setT(x+10,10,'?'); setT(x+12,10, k%2 ? 'M' : '?');
    arco(x+15, 9, 4);
    tubo(x+20, 2);
    ent('goomba', x+8, 12);
    if (k%2) ent('koopa', x+18, 12);
  }
}

/* Colores de terreno por tema */
const TIERRAS = {
  pradera:  {base:'#c84c0c', borde:'#f8b800', rel:'#e07020', som:'#7a2e08'},
  playa:    {base:'#e8c070', borde:'#fff0a0', rel:'#d0a050', som:'#a87838'},
  cueva:    {base:'#5a5a78', borde:'#9090b0', rel:'#70708e', som:'#3a3a52'},
  desierto: {base:'#d89040', borde:'#f8d878', rel:'#e8a858', som:'#a86828'},
  castillo: {base:'#6a6a84', borde:'#a8a8c0', rel:'#84849e', som:'#4a4a64'},
};
/* Reglas de diseño (para que TODO sea alcanzable con un salto normal):
   - bloques ?, M y S siempre en la fila 10 (se golpean y se sube encima)
   - plataformas altas en la fila 7 (se sube desde los bloques de la fila 10)
   - tubos de máximo 3 de alto, huecos de máximo 3 de ancho
   - Santi al inicio; huevo de Georgie, estrella y Abu SIEMPRE en suelo
     plano y despejado, nunca dentro de montañas */

/* ---- Mundo 1: Pradera del Pichunguito ---- */
function nivel1(){
  nuevoMapa(270); entidadesNivel=[];
  tramoExtra(176, 254);
  hueco(30,32); hueco(70,72); hueco(121,123);
  colina(10,5,2); colina(85,6,2); colina(140,5,2);
  fila(18,21,10,'B'); setT(19,10,'?'); setT(21,10,'M'); setT(25,10,'?');
  fila(40,44,10,'B'); setT(40,10,'?'); setT(42,10,'?'); setT(44,10,'M');
  fila(41,43,7,'B'); setT(42,7,'?');
  fila(100,103,10,'B'); setT(101,10,'?'); setT(103,10,'?');
  fila(110,113,7,'='); fila(126,129,10,'=');
  fila(155,158,10,'B'); setT(156,10,'M'); setT(158,10,'?');
  arco(58,9,5); arco(95,9,6); arco(133,9,5);
  tubo(52,2); tubo(78,3); tubo(146,2);
  [26,48,108,116,150,162].forEach(x=>ent('goomba',x,12));
  [96,136].forEach(x=>ent('koopa',x,12));
  ent('santi',8,11.4); ent('huevo',57,12); setT(66,10,'S'); ent('abu',105,12); ent('meta',262,9);
  return {nombre:'MUNDO 1 · PRADERA DEL PICHUNGUITO', cielo:'#5c94fc', decor:'colinas', tierra:TIERRAS.pradera, spawn:{x:3,y:11}};
}
/* ---- Mundo 2: Cielos de Santi ---- */
function nivel2(){
  nuevoMapa(300); entidadesNivel=[];
  tramoExtra(196, 284);
  hueco(24,26); hueco(46,48); hueco(74,76); hueco(105,107); hueco(138,140); hueco(160,162);
  fila(14,17,10,'B'); setT(15,10,'M'); setT(17,10,'?');
  fila(34,36,10,'B'); setT(35,10,'?');
  setT(56,10,'?'); setT(58,10,'M'); setT(60,10,'?');
  fila(84,85,10,'B'); fila(87,88,10,'B');
  fila(92,94,7,'='); fila(98,100,7,'=');
  setT(118,10,'?'); fila(120,123,10,'B'); setT(122,10,'M');
  fila(146,149,10,'='); fila(152,155,7,'=');
  colina(128,6,2);
  arco(38,8,5); arco(66,9,6); arco(112,9,5); arco(142,8,4); arco(168,9,5);
  tubo(42,2); tubo(70,3); tubo(135,2); tubo(174,2);
  [20,54,62,101,115,144,157].forEach(x=>ent('goomba',x,12));
  [32,90,126,170].forEach(x=>ent('koopa',x,12));
  ent('santi',10,11.4); ent('huevo',80,12); setT(86,10,'S'); ent('abu',110,12); ent('meta',292,9);
  return {nombre:'MUNDO 2 · CIELOS DE SANTI', cielo:'#48b0e8', decor:'nubes', tierra:TIERRAS.pradera, spawn:{x:3,y:11}};
}
/* ---- Mundo 3: Bosque de Georgie ---- */
function nivel3(){
  nuevoMapa(330); entidadesNivel=[];
  tramoExtra(216, 314);
  hueco(20,22); hueco(40,42); hueco(66,68); hueco(92,94); hueco(120,122); hueco(150,152); hueco(176,178);
  fila(12,15,10,'B'); setT(13,10,'M'); setT(15,10,'?');
  fila(28,31,10,'B'); setT(29,10,'?'); setT(31,10,'?');
  fila(50,54,10,'B'); setT(52,10,'?'); setT(56,10,'M');
  fila(58,60,7,'B'); setT(59,7,'?');
  colina(72,6,2);
  setT(100,10,'?'); setT(102,10,'?'); setT(104,10,'M');
  fila(110,114,10,'B'); arco(110,8,5);
  colina(130,6,3);
  fila(144,147,10,'B'); setT(145,10,'?'); setT(147,10,'M');
  fila(158,161,10,'='); fila(164,167,7,'=');
  arco(34,9,5); arco(63,9,5); arco(87,8,4); arco(117,9,6); arco(155,9,5); arco(184,9,6);
  tubo(24,2); tubo(46,2); tubo(126,2); tubo(190,3); tubo(204,2);
  [18,26,56,62,88,106,128,148,168,186].forEach(x=>ent('goomba',x,12));
  [36,124,156,196].forEach(x=>ent('koopa',x,12));
  ent('santi',9,11.4); ent('huevo',84,12); setT(97,10,'S'); ent('abu',138,12); ent('meta',322,9);
  return {nombre:'MUNDO 3 · BOSQUE DE GEORGIE', cielo:'#4a9c58', decor:'bosque', tierra:TIERRAS.pradera, spawn:{x:3,y:11}};
}
/* ---- Mundo 4: Playa de Penny ---- */
function nivel4(){
  nuevoMapa(285); entidadesNivel=[];
  tramoExtra(186, 269);
  hueco(34,36); hueco(78,80); hueco(126,128); hueco(158,160);
  fila(20,23,10,'B'); setT(21,10,'M'); setT(23,10,'?');
  setT(44,10,'?'); setT(46,10,'?');
  fila(60,63,10,'B'); setT(61,10,'?'); setT(63,10,'M');
  fila(96,99,10,'='); fila(104,107,7,'=');
  setT(116,10,'?'); setT(118,10,'M');
  fila(140,143,10,'B'); setT(141,10,'?'); setT(143,10,'?');
  fila(166,169,10,'=');
  arco(50,9,5); arco(86,9,4); arco(132,8,5); arco(172,9,5);
  tubo(30,2); tubo(72,3); tubo(150,2);
  [26,52,112,134,154,172].forEach(x=>ent('goomba',x,12));
  [66,120,176].forEach(x=>ent('koopa',x,12));
  ent('santi',8,11.4); ent('huevo',84,12); setT(92,10,'S'); ent('abu',110,12); ent('meta',277,9);
  return {nombre:'MUNDO 4 · PLAYA DE PENNY', cielo:'#6bd0f8', decor:'playa', tierra:TIERRAS.playa, spawn:{x:3,y:11}};
}
/* ---- Mundo 5: Cueva de Sheldon ---- */
function nivel5(){
  nuevoMapa(300); entidadesNivel=[];
  tramoExtra(198, 284);
  hueco(28,30); hueco(58,60); hueco(96,98); hueco(130,132); hueco(164,166);
  fila(16,19,10,'B'); setT(17,10,'M'); setT(19,10,'?');
  fila(38,41,10,'B'); setT(39,10,'?'); setT(41,10,'?');
  setT(68,10,'?'); setT(70,10,'M');
  fila(104,108,10,'B'); setT(105,10,'?'); setT(107,10,'?');
  fila(118,121,7,'=');
  fila(140,143,10,'B'); setT(141,10,'M'); setT(143,10,'?');
  fila(172,175,10,'=');
  arco(46,9,5); arco(88,8,5); arco(124,9,5); arco(156,9,6); arco(180,8,4);
  tubo(34,2); tubo(90,3); tubo(148,2); tubo(184,2);
  [22,44,66,102,112,136,154,178].forEach(x=>ent('goomba',x,12));
  [50,126,170].forEach(x=>ent('koopa',x,12));
  ent('santi',9,11.4); ent('huevo',76,12); setT(82,10,'S'); ent('abu',114,12); ent('meta',292,9);
  return {nombre:'MUNDO 5 · CUEVA DE SHELDON', cielo:'#2a2a48', decor:'cueva', tierra:TIERRAS.cueva, spawn:{x:3,y:11}};
}
/* ---- Mundo 6: Nubes de Cucú ---- */
function nivel6(){
  nuevoMapa(315); entidadesNivel=[];
  tramoExtra(206, 299);
  hueco(24,26); hueco(48,50); hueco(72,74); hueco(100,102); hueco(128,130); hueco(154,156); hueco(180,182);
  fila(14,17,10,'B'); setT(15,10,'M'); setT(17,10,'?');
  fila(32,35,7,'='); fila(40,43,10,'B'); setT(41,10,'?');
  setT(58,10,'?'); setT(60,10,'M');
  fila(84,87,10,'B'); setT(85,10,'?'); setT(87,10,'?');
  fila(108,111,7,'='); setT(118,10,'?'); setT(120,10,'M');
  fila(138,141,10,'B'); setT(139,10,'?');
  fila(162,165,7,'='); fila(170,173,10,'B'); setT(171,10,'?'); setT(173,10,'M');
  arco(28,9,4); arco(54,8,5); arco(78,9,5); arco(114,8,5); arco(146,9,5); arco(186,8,5);
  tubo(66,2); tubo(146,3);
  [20,38,56,80,106,124,144,168,188].forEach(x=>ent('goomba',x,12));
  [90,134,176].forEach(x=>ent('koopa',x,12));
  ent('santi',8,11.4); ent('huevo',92,12); setT(96,10,'S'); ent('abu',114,12); ent('meta',307,9);
  return {nombre:'MUNDO 6 · NUBES DE CUCÚ', cielo:'#7ec8f8', decor:'nubes', tierra:TIERRAS.pradera, spawn:{x:3,y:11}};
}
/* ---- Mundo 7: Desierto de Abu ---- */
function nivel7(){
  nuevoMapa(330); entidadesNivel=[];
  tramoExtra(218, 314);
  hueco(30,32); hueco(64,66); hueco(98,100); hueco(134,136); hueco(170,172); hueco(196,198);
  fila(18,21,10,'B'); setT(19,10,'M'); setT(21,10,'?');
  setT(40,10,'?'); setT(42,10,'?');
  fila(54,57,10,'B'); setT(55,10,'?'); setT(57,10,'M');
  fila(76,79,7,'=');
  setT(108,10,'?'); setT(110,10,'M'); setT(112,10,'?');
  fila(122,126,10,'B'); setT(123,10,'?'); setT(125,10,'?');
  fila(146,149,10,'='); fila(152,155,7,'=');
  fila(162,165,10,'B'); setT(163,10,'M');
  fila(184,187,10,'B'); setT(185,10,'?');
  arco(46,9,5); arco(84,9,5); arco(116,8,5); arco(158,9,4); arco(190,9,5);
  tubo(26,2); tubo(70,3); tubo(140,2); tubo(204,3);
  [24,46,60,94,116,130,158,178,200,208].forEach(x=>ent('goomba',x,12));
  [50,104,150,190].forEach(x=>ent('koopa',x,12));
  ent('santi',9,11.4); ent('huevo',86,12); setT(92,10,'S'); ent('abu',118,12); ent('meta',322,9);
  return {nombre:'MUNDO 7 · DESIERTO DE ABU', cielo:'#8fd4f0', decor:'desierto', tierra:TIERRAS.desierto, spawn:{x:3,y:11}};
}
/* ---- Mundo 8: Castillo de Tío Juan ---- */
function nivel8(){
  nuevoMapa(360); entidadesNivel=[];
  tramoExtra(238, 344);
  hueco(22,24); hueco(44,46); hueco(70,72); hueco(94,96); hueco(118,120); hueco(144,146); hueco(168,170); hueco(194,196);
  fila(14,17,10,'B'); setT(15,10,'M'); setT(17,10,'?');
  fila(30,34,10,'B'); setT(31,10,'?'); setT(33,10,'?');
  fila(52,56,10,'B'); setT(53,10,'?'); setT(55,10,'M');
  fila(58,60,7,'B'); setT(59,7,'?');
  setT(80,10,'?'); setT(82,10,'M');
  fila(102,106,10,'B'); setT(103,10,'?'); setT(105,10,'?');
  fila(110,113,7,'=');
  fila(126,129,10,'B'); setT(127,10,'M');
  fila(150,154,10,'B'); setT(151,10,'?'); setT(153,10,'?');
  fila(158,161,7,'=');
  fila(176,180,10,'B'); setT(177,10,'?'); setT(179,10,'M');
  fila(200,204,10,'B'); setT(201,10,'?'); setT(203,10,'?');
  fila(210,213,10,'='); fila(216,219,7,'=');
  arco(38,9,4); arco(64,9,4); arco(88,8,4); arco(140,9,4); arco(164,8,4); arco(188,9,4); arco(222,9,5);
  tubo(38,3); tubo(66,2); tubo(140,2); tubo(190,3); tubo(224,2);
  [20,28,48,62,76,100,116,124,142,156,166,186,206,222].forEach(x=>ent('goomba',x,12));
  [40,108,132,164,198,228].forEach(x=>ent('koopa',x,12));
  ent('santi',8,11.4); ent('huevo',86,12); setT(90,10,'S'); ent('abu',122,12); ent('meta',352,9);
  return {nombre:'MUNDO 8 · CASTILLO DE TÍO JUAN', cielo:'#3a3a5c', decor:'castillo', tierra:TIERRAS.castillo, spawn:{x:3,y:11}};
}
/* ---- Mundo 9: Mar de Fernando (¡nadando!) ---- */
function nivel9(){
  nuevoMapa(300); entidadesNivel=[];
  hueco(26,28); hueco(58,60); hueco(90,92); hueco(124,126); hueco(158,160); hueco(190,192); hueco(224,226); hueco(258,260);
  colina(14,5,2); colina(70,6,2); colina(140,6,3); colina(210,5,2); colina(266,5,2);
  fila(20,23,10,'B'); setT(21,10,'M'); setT(23,10,'?');
  fila(48,51,10,'B'); setT(49,10,'?'); setT(51,10,'?');
  setT(76,10,'?'); setT(78,10,'M');
  fila(104,107,10,'B'); setT(105,10,'?'); setT(107,10,'M');
  fila(132,135,7,'=');
  setT(148,10,'?'); setT(150,10,'?');
  fila(170,173,10,'B'); setT(171,10,'M'); setT(173,10,'?');
  fila(200,203,10,'='); fila(206,209,7,'=');
  fila(232,235,10,'B'); setT(233,10,'?');
  fila(248,251,10,'=');
  arco(34,9,5); arco(66,8,5); arco(98,9,5); arco(142,8,4); arco(180,9,5); arco(216,9,5); arco(242,8,4); arco(270,9,5);
  tubo(40,2); tubo(84,3); tubo(164,2); tubo(220,3); tubo(276,2);
  [24,44,64,112,130,152,176,198,222,246,268].forEach(x=>ent('goomba',x,12));
  [36,96,144,188,240,280].forEach(x=>ent('koopa',x,12));
  ent('santi',8,11.4); ent('huevo',80,12); setT(88,10,'S'); ent('abu',118,12); ent('meta',292,9);
  return {nombre:'MUNDO 9 · MAR DE FERNANDO', cielo:'#1560c8', decor:'marino', tierra:TIERRAS.playa, agua:true, spawn:{x:3,y:11}};
}
/* ---- Mundo 10: Castillo de Bowser (¡rescata a mamá princesa!) ---- */
function nivel10(){
  nuevoMapa(330); entidadesNivel=[];
  hueco(24,26); hueco(50,52); hueco(78,80); hueco(106,108); hueco(134,136); hueco(162,164); hueco(190,192); hueco(218,220); hueco(246,248);
  fila(16,19,10,'B'); setT(17,10,'M'); setT(19,10,'?');
  fila(34,38,10,'B'); setT(35,10,'?'); setT(37,10,'?');
  fila(58,62,10,'B'); setT(59,10,'?'); setT(61,10,'M');
  fila(64,66,7,'B'); setT(65,7,'?');
  setT(88,10,'?'); setT(90,10,'M');
  fila(114,118,10,'B'); setT(115,10,'?'); setT(117,10,'?');
  fila(122,125,7,'=');
  fila(142,145,10,'B'); setT(143,10,'M');
  fila(170,174,10,'B'); setT(171,10,'?'); setT(173,10,'?');
  fila(198,201,10,'B'); setT(199,10,'M');
  fila(226,230,10,'B'); setT(227,10,'?'); setT(229,10,'?');
  fila(252,255,10,'='); fila(258,261,7,'=');
  arco(30,9,4); arco(70,9,4); arco(96,8,4); arco(128,9,4); arco(154,8,4); arco(184,9,4); arco(210,9,4); arco(238,8,4); arco(266,9,5);
  tubo(44,3); tubo(74,2); tubo(150,2); tubo(206,3); tubo(242,2);
  [20,32,48,68,86,104,120,140,158,180,196,216,236,258,274].forEach(x=>ent('goomba',x,12));
  [42,92,132,168,212,250].forEach(x=>ent('koopa',x,12));
  ent('santi',8,11.4); ent('huevo',84,12); setT(98,10,'S'); ent('abu',126,12);
  /* el castillo del malvado Bowser y mamá princesa cautiva */
  ent('bowser',300,12); ent('princesa',314,12);
  return {nombre:'MUNDO 10 · CASTILLO DE BOWSER', cielo:'#2a1a3c', decor:'castillo', tierra:TIERRAS.castillo, jefe:true, spawn:{x:3,y:11}};
}
const NIVELES = [nivel1, nivel2, nivel3, nivel4, nivel5, nivel6, nivel7, nivel8, nivel9, nivel10];

/* ---------------- Estado del juego ---------------- */
let estado = 'menu';   // menu | juego | meta | fin
let nivelIdx = 0, infoNivel = null;
let camX = 0, tick = 0;
let puntos = 0, monedas = 0, tiempo = 300, tiempoAcum = 0, muertes = 0;
let enemigos = [], items = [], fuegos = [], parts = [], npcs = [], burbujas = [], bumps = [];
let historia = [];    // rastro del jugador para los seguidores
let evTioJuan = null; // evento estrella / meta
let secMeta = 0;

/* ---------------- Jugador ---------------- */
const J = {
  x:0, y:0, vx:0, vy:0, w:24, h:28,
  grande:false, fuego:false, cara:1, enSuelo:false,
  invul:0, burger:0, pmetro:0, muerto:0,
  cargaSanti:false, cucu:false, abu:false, mama:false, papa:false,
  tiofran:false, yanny:false, nacho:false, beto:false, giuliana:false,
  perro:0, enAvion:0, enBarco:false,
  animT:0, escX:1, escY:1
};
/* efectos modernos */
let shake = 0, cortina = 0, monedasHUD = [], chispasKart = [];
/* calidad adaptativa: si el aparato va lento, se bajan efectos automáticamente */
const CAL = { volumen:true, sombras:true, particulas:1, crt:true, nivel:3 };
let msAcum = 0, msN = 0, msUlt = 0, calTick = 0;
function medirCalidad(ahora){
  if (msUlt){ msAcum += ahora - msUlt; msN++; }
  msUlt = ahora;
  if (msN < 45) return;
  const prom = msAcum / msN; msAcum = 0; msN = 0;
  if (++calTick < 2) return;          // ignorar los primeros arranques
  if (prom > 26 && CAL.nivel > 1){    // por debajo de ~38 fps: bajar
    CAL.nivel--;
    CAL.volumen = CAL.nivel >= 3;
    CAL.sombras = CAL.nivel >= 2;
    CAL.particulas = CAL.nivel >= 3 ? 1 : (CAL.nivel === 2 ? 0.5 : 0.25);
    CAL.crt = CAL.nivel >= 2;
  } else if (prom < 15 && CAL.nivel < 3){  // sobrado de fluidez: subir
    CAL.nivel++;
    CAL.volumen = CAL.nivel >= 3;
    CAL.sombras = CAL.nivel >= 2;
    CAL.particulas = CAL.nivel >= 3 ? 1 : (CAL.nivel === 2 ? 0.5 : 0.25);
    CAL.crt = CAL.nivel >= 2;
  }
}
function sacudir(n){ shake = Math.max(shake, n*0.45); }   // temblor discreto
function aPantalla(wx, wy){
  return { x:(wx-camX)*ZOOM, y:(wy+HUD_H)*ZOOM + H*(1-ZOOM) };
}
function destello(wx, wy){
  parts.push({tipo:'destello', x:wx, y:wy, t:22});
}
function monedaVuela(wx, wy){
  const p = aPantalla(wx, wy);
  monedasHUD.push({x:p.x, y:p.y, t:0});
}
function altoJ(){ return J.grande ? 56 : 28; }

function burbuja(txt, quien){
  burbujas.push({txt, quien:quien||'J', t:150});
}

function empezarJuego(idx){
  nivelIdx = idx||0; puntos = 0; monedas = 0; muertes = 0;
  cargarNivel(nivelIdx);
  estado = 'juego';
  burbuja('¡Vamos Penny y Sheldon!');
  hablar('¡Fernando Bros! ¡Vamos Penny y Sheldon!');
}

function cargarNivel(i){
  nivelIdx = i;
  infoNivel = NIVELES[i]();
  enemigos=[]; items=[]; fuegos=[]; parts=[]; npcs=[]; burbujas=[]; bumps=[];
  evTioJuan=null; secMeta=0; tiempo=300; tiempoAcum=0; colaVoz=[];
  J.x = infoNivel.spawn.x*TILE; J.y = infoNivel.spawn.y*TILE;
  J.vx=0; J.vy=0; J.cara=1; J.invul=0; J.burger=0; J.pmetro=0; J.muerto=0;
  J.cargaSanti=false; J.cucu=false; J.abu=false; J.mama=false; J.papa=false;
  J.tiofran=false; J.yanny=false; J.nacho=false; J.beto=false; J.giuliana=false;
  J.perro=0; J.enAvion=0; J.enBarco=false;
  J.luca=false; J.salomon=false; J.superSalto=false;
  historia = [];
  for(const e of entidadesNivel){
    if (e.tipo==='goomba') enemigos.push({tipo:'goomba', x:e.x, y:e.y, vx:-0.8, vy:0, w:26, h:24, vivo:true});
    else if (e.tipo==='koopa') enemigos.push({tipo:'koopa', x:e.x, y:e.y, vx:-0.7, vy:0, w:26, h:36, vivo:true, caparazon:false, girando:false});
    else if (e.tipo==='santi') npcs.push({tipo:'santi', x:e.x, y:e.y, t:0, activo:true});
    else if (e.tipo==='huevo') npcs.push({tipo:'huevo', x:e.x, y:e.y+8, t:0, activo:true});
    else if (e.tipo==='abu')   npcs.push({tipo:'abu', x:e.x, y:e.y-16, vx:-0.5, vy:0, t:0, activo:true});
    else if (e.tipo==='meta')  npcs.push({tipo:'meta', x:e.x, y:e.y, t:0, activo:true});
    else if (e.tipo==='bowser') npcs.push({tipo:'bowser', x:e.x, y:e.y-40, vx:-0.5, vy:0, hp:3, t:0, activo:true});
    else if (e.tipo==='princesa') npcs.push({tipo:'princesa', x:e.x, y:e.y-20, t:0, activo:true});
  }
  colocarHueso();
  colocarFamilia();
  colocarVehiculos();
  camX = 0;
  cortina = 45;
}

/* un bloque de HUESO por mundo, en columna libre */
function colocarHueso(){
  let x = Math.floor(LEVW*0.24);
  while(x < LEVW-12){
    if (getT(x,13)==='#' && getT(x,12)==='.' && getT(x,11)==='.' && getT(x,10)==='.' &&
        getT(x-1,10)==='.' && getT(x+1,10)==='.' && getT(x,9)==='.') break;
    x++;
  }
  setT(x,10,'O');
}
/* avión en los mundos de cielo; barco en el mundo marino */
function colocarVehiculos(){
  const meter = (tipo, frac, w2)=>{
    let x = Math.floor(LEVW*frac);
    while(x < LEVW-12){
      if (getT(x,13)==='#' && getT(x+1,13)==='#' && getT(x,12)==='.' && getT(x,11)==='.' &&
          getT(x+1,12)==='.' && !npcs.some(n=>Math.abs(n.x-x*TILE)<3*TILE)) break;
      x++;
    }
    npcs.push({tipo, x:x*TILE, y:13*TILE-w2, t:0, activo:true});
  };
  if (nivelIdx===1 || nivelIdx===5) meter('avion', 0.38, 30);
  if (infoNivel && infoNivel.agua) meter('barco', 0.30, 34);
}

/* Coloca a Mamá, Luca, Papá, Salomón y Tío Fran en suelo plano y
   despejado de cada mundo, buscando automáticamente un lugar libre. */
function colocarFamilia(){
  const familia = [['mama',0.18,48],['luca',0.30,34],['nacho',0.40,48],['papa',0.48,48],
    ['salomon',0.58,34],['beto',0.66,46],['tiofran',0.74,48],['giuliana',0.80,47],['yanny',0.88,47]];
  for(const [tipo, frac, alto] of familia){
    let x = Math.floor(LEVW*frac);
    while(x < LEVW-12){
      const libre = getT(x,13)==='#' && getT(x+1,13)==='#' &&
        getT(x,12)==='.' && getT(x,11)==='.' && getT(x,10)==='.' &&
        getT(x+1,12)==='.' && getT(x+1,11)==='.' &&
        !npcs.some(n=>Math.abs(n.x - x*TILE) < 3*TILE) &&
        !entidadesNivel.some(e=>e.tipo!=='goomba'&&e.tipo!=='koopa'&&Math.abs(e.x - x*TILE) < 3*TILE);
      if (libre) break;
      x++;
    }
    npcs.push({tipo, x:x*TILE, y:13*TILE-alto, t:0, activo:true, hecho:false});
  }
}

/* ---------------- Física / colisiones ---------------- */
function chocaMapa(px,py,pw,ph){
  const x0=Math.floor(px/TILE), x1=Math.floor((px+pw-1)/TILE);
  const y0=Math.floor(py/TILE), y1=Math.floor((py+ph-1)/TILE);
  for(let ty=y0;ty<=y1;ty++) for(let tx=x0;tx<=x1;tx++)
    if (esSolido(getT(tx,ty))) return {tx,ty};
  return null;
}
function moverEnte(e){
  e.vy = Math.min(e.vy + GRAV, MAXFALL);
  e.x += e.vx;
  let c = chocaMapa(e.x, e.y, e.w, e.h);
  if (c){ if (e.vx>0) e.x = c.tx*TILE - e.w; else if (e.vx<0) e.x = (c.tx+1)*TILE; e.vx = -e.vx; e.choco=true; }
  else e.choco=false;
  e.y += e.vy;
  c = chocaMapa(e.x, e.y, e.w, e.h);
  e.enSuelo=false;
  if (c){
    if (e.vy>0){ e.y = c.ty*TILE - e.h; e.enSuelo=true; }
    else { e.y = (c.ty+1)*TILE; }
    e.vy = 0;
  }
}
const solapa=(a,b)=> a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;

/* ---------------- Bloques golpeados ---------------- */
function golpeaBloque(tx,ty){
  const c = getT(tx,ty);
  if (c==='?'){
    setT(tx,ty,'X'); monedas++; puntos+=100; sfx.moneda();
    parts.push({tipo:'moneda', x:tx*TILE+8, y:ty*TILE-20, vy:-6, t:30});
    monedaVuela(tx*TILE+16, ty*TILE-10);
    bumps.push({tx,ty,t:10});
  } else if (c==='M'){
    setT(tx,ty,'X'); sfx.poder();
    items.push(J.grande
      ? {tipo:'flor', x:tx*TILE+3, y:(ty-1)*TILE+6, vx:0, vy:0, w:26, h:26}
      : {tipo:'hongo', x:tx*TILE+3, y:(ty-1)*TILE+4, vx:0.6, vy:0, w:26, h:26});
    bumps.push({tx,ty,t:10});
  } else if (c==='O'){
    setT(tx,ty,'X'); sfx.poder();
    items.push({tipo:'hueso', x:tx*TILE+3, y:(ty-1)*TILE+4, vx:0.6, vy:0, w:26, h:26});
    bumps.push({tx,ty,t:10});
  } else if (c==='S'){
    setT(tx,ty,'X'); sfx.poder();
    /* la estrella se queda flotando sobre el bloque, fácil de agarrar */
    items.push({tipo:'estrella', x:tx*TILE+3, y:(ty-1)*TILE+4, vx:0, vy:0, w:26, h:26, t:0});
    bumps.push({tx,ty,t:10});
  } else if (c==='B'){
    if (J.grande){
      setT(tx,ty,'.'); puntos+=50; sfx.romper(); sacudir(2);
      for(let i=0;i<4;i++) parts.push({tipo:'ladrillo', x:tx*TILE+16, y:ty*TILE+16,
        vx:(i%2?2:-2)*(0.6+Math.random()), vy:-5-Math.random()*3, t:50});
    } else { bumps.push({tx,ty,t:10}); beep(180,0.08,'square',0.06); }
  }
}

/* ---------------- Daño / muerte (¡vidas infinitas!) ---------------- */
function dano(){
  if (J.invul>0 || J.burger>0 || J.muerto>0) return;
  if (J.perro>0) return;                              // el perrito rojo es invencible
  if (J.enAvion>0){ J.enAvion=0; J.invul=110; sfx.dano(); return; }
  if (J.enBarco){ J.enBarco=false; J.invul=110; sfx.dano(); return; }
  if (J.fuego){ J.fuego=false; J.invul=110; sfx.dano(); }
  else if (J.grande){ J.grande=false; J.invul=110; sfx.dano(); }
  else morir();
}
function morir(){
  if (J.muerto>0) return;
  J.muerto = 110; J.vy = -10; muertes++; sfx.muerte(); sacudir(5);
}
function respawn(){
  const s = infoNivel.spawn;
  J.x=s.x*TILE; J.y=s.y*TILE; J.vx=0; J.vy=0; J.muerto=0;
  J.grande=false; J.fuego=false; J.burger=0; J.invul=120;
  J.perro=0; J.enAvion=0; J.enBarco=false; tiempo=300; tiempoAcum=0;
  historia=[]; cortina = 32;
}

/* ---------------- Actualización ---------------- */
const mjActivo = ()=> typeof MJ !== 'undefined' && MJ.activo();
function update(){
  tick++;
  if (mjActivo()){ MJ.update(); return; }
  if (estado==='kart'){ updateKart(); return; }
  if (estado!=='juego' && estado!=='meta') return;

  /* tiempo */
  if (estado==='juego' && J.muerto===0){
    tiempoAcum++;
    if (tiempoAcum>=60){ tiempoAcum=0; tiempo--; if(tiempo<=0) morir(); }
  }

  /* --- muerte animada --- */
  if (J.muerto>0){
    J.muerto--; J.y += J.vy; J.vy += 0.4;
    if (J.muerto===0) respawn();
    actualizarExtras();
    return;
  }

  /* --- controles --- */
  const enMeta = estado==='meta';
  const corre = kCorre();
  const velTope = (J.burger>0 ? 7.2 : (corre && J.pmetro>=70 ? 5.8 : corre ? 4.6 : 3.1))
    * (J.perro>0 ? 1.25 : 1) * (J.enBarco ? 1.4 : 1) * (J.enAvion>0 ? 1.2 : 1);
  const acc = J.enSuelo ? 0.5 : 0.35;
  if (!enMeta && izq()){ J.vx = Math.max(J.vx-acc, -velTope); J.cara=-1; }
  else if (!enMeta && der()){ J.vx = Math.min(J.vx+acc, velTope); J.cara=1; }
  else J.vx *= J.enSuelo ? 0.82 : 0.95;
  if (Math.abs(J.vx)<0.05) J.vx=0;

  /* medidor P */
  if (Math.abs(J.vx)>4.4 && J.enSuelo) J.pmetro=Math.min(J.pmetro+1.2,100);
  else if (J.pmetro>0 && !(Math.abs(J.vx)>4.4)) J.pmetro=Math.max(J.pmetro-0.8,0);

  /* salto (en el agua se nada, en el avión se sube) */
  const enAgua = infoNivel && infoNivel.agua;
  if (!enMeta && kSalto()){
    if (J.enAvion>0 && !J.saltando){ J.vy = -4.6; J.saltando=true; }
    else if (enAgua && !J.saltando){ J.vy = -5.2; J.saltando=true; sfx.salto(); }
    else if (J.enSuelo && !J.saltando){
      J.vy = -((J.superSalto?13:11) + Math.min(Math.abs(J.vx)*0.35,2.2));
      J.saltando=true; J.enSuelo=false; sfx.salto();
      J.escX=0.72; J.escY=1.3;
    }
  } else { J.saltando=false; if (J.vy<-4 && !kSalto() && !enAgua && J.enAvion<=0) J.vy=-4; }

  /* bajarse del barco */
  if (J.enBarco && abajo() && J.enSuelo) J.enBarco = false;
  if (J.enAvion>0) J.enAvion--;
  if (J.perro>0) J.perro--;

  /* bolas de fuego */
  if (!enMeta && J.fuego && kCorre() && !J.fuegoPrev && fuegos.length<2){
    fuegos.push({x:J.x+(J.cara>0?J.w:-10), y:J.y+10, vx:7*J.cara, vy:2, w:12, h:12, t:120});
    sfx.fuego();
  }
  J.fuegoPrev = kCorre();

  /* --- física del jugador --- */
  const h = altoJ();
  const gravJ = J.enAvion>0 ? 0.12 : (enAgua ? 0.16 : GRAV);
  const caidaMax = J.enAvion>0 ? 4 : (enAgua ? 2.8 : MAXFALL);
  J.vy = Math.min(J.vy + gravJ, caidaMax);
  J.x += J.vx;
  if (J.x<0) J.x=0;
  if (J.x>LEVW*TILE-J.w) J.x=LEVW*TILE-J.w;
  let c = chocaMapa(J.x, J.y, J.w, h);
  if (c){ if(J.vx>0) J.x=c.tx*TILE-J.w; else if(J.vx<0) J.x=(c.tx+1)*TILE; J.vx=0; }
  J.y += J.vy;
  c = chocaMapa(J.x, J.y, J.w, h);
  J.enSuelo=false;
  if (c){
    if (J.vy>0){
      if (J.vy>6.5){
        J.escX=1.22; J.escY=0.8;
        if (J.vy>11) sacudir(1.2);
        for(let i=0;i<5;i++) parts.push({tipo:'polvo', x:J.x+J.w/2+(Math.random()-0.5)*24,
          y:c.ty*TILE-4, vx:(Math.random()-0.5)*1.6, vy:-0.4-Math.random()*0.6, t:22});
      }
      J.y=c.ty*TILE-h; J.enSuelo=true; J.vy=0;
    }
    else if (J.vy<0){
      J.y=(c.ty+1)*TILE; J.vy=0;
      const txc = Math.floor((J.x+J.w/2)/TILE);
      golpeaBloque(esSolido(getT(txc,c.ty)) ? txc : c.tx, c.ty);
    }
  }
  if (J.y > ROWS*TILE+60) morir();

  /* monedas del mapa */
  const cx0=Math.floor(J.x/TILE), cx1=Math.floor((J.x+J.w)/TILE);
  const cy0=Math.floor(J.y/TILE), cy1=Math.floor((J.y+h)/TILE);
  for(let ty=cy0;ty<=cy1;ty++) for(let tx=cx0;tx<=cx1;tx++)
    if (getT(tx,ty)==='C'){ setT(tx,ty,'.'); monedas++; puntos+=100; sfx.moneda();
      destello(tx*TILE+16, ty*TILE+16); monedaVuela(tx*TILE+16, ty*TILE+16); }

  if (J.invul>0) J.invul--;
  if (J.burger>0){ J.burger--; if(J.burger===0){ burbuja('¡Qué rica hamburguesa!'); hablar('¡Qué rica hamburguesa!'); } }

  /* polvo al correr y estela de súper velocidad */
  if (CAL.particulas>0.4 && J.enSuelo && Math.abs(J.vx)>3.2 && tick%6===0)
    parts.push({tipo:'polvo', x:J.x+(J.cara>0?-4:J.w), y:J.y+altoJ()-4,
      vx:-J.cara*0.8, vy:-0.3-Math.random()*0.4, t:18});
  if (CAL.particulas>0.4 && (J.burger>0 || J.perro>0 || J.pmetro>=95) && tick%4===0)
    parts.push({tipo:'estela', x:J.x, y:J.y, alto:altoJ(),
      color: J.perro>0 ? '#d82800' : `hsl(${(tick*12)%360},90%,60%)`, t:12});

  /* ambiente vivo según el mundo */
  if (parts.length < 120*CAL.particulas && J.muerto===0){
    const d = infoNivel.decor;
    if (d==='colinas' && tick%26===0)
      parts.push({tipo:'petalo', x:camX+Math.random()*VW, y:-10, t:260, color:'#ffd7e8'});
    else if (d==='bosque' && tick%20===0)
      parts.push({tipo:'hoja', x:camX+Math.random()*VW, y:-10, t:260, color:['#4caf50','#8bc34a','#e08a3a'][tick%3]});
    else if (d==='desierto' && tick%9===0)
      parts.push({tipo:'arena', x:camX-20, y:Math.random()*380, t:120});
    else if (d==='cueva' && tick%30===0)
      parts.push({tipo:'luciernaga', x:camX+Math.random()*VW, y:60+Math.random()*300, t:300});
    else if (d==='castillo' && tick%22===0)
      parts.push({tipo:'estrellaAmb', x:camX+Math.random()*VW, y:Math.random()*260, t:110});
    else if ((d==='nubes') && tick%34===0)
      parts.push({tipo:'petalo', x:camX+Math.random()*VW, y:-10, t:260, color:'#ffffff'});
  }

  /* Tío Fran te persigue echándose pedos */
  if (J.tiofran && historia.length>130){
    const hf = historia[130];
    if (tick%150===0) for(let i=0;i<4;i++) parts.push({tipo:'pedo', x:hf.x+10+(Math.random()-0.5)*16,
      y:hf.y+10, vx:-0.5-Math.random(), vy:-0.5-Math.random(), t:55});
    if (tick%600===0) sfx.pedo();
  }
  /* burbujas en el mundo marino */
  if (enAgua && tick%14===0)
    parts.push({tipo:'burbujaAgua', x:J.x+Math.random()*80-30, y:J.y+20, vy:-1.2-Math.random(), t:80});

  /* rastro para seguidores */
  historia.unshift({x:J.x, y:J.y+h-28, cara:J.cara});
  if (historia.length>210) historia.pop();

  /* --- items --- */
  for(const it of items){
    if (it.tipo==='hongo' || it.tipo==='hueso') moverEnte(it);
    else if (it.tipo==='estrella'){ it.t++; it.y += Math.sin(it.t/9)*0.9; }
    if (solapa({x:J.x,y:J.y,w:J.w,h}, it)){
      it.usado=true;
      destello(it.x+13, it.y+13);
      if (it.tipo==='hongo'){
        if(!J.grande){ J.grande=true; J.y-=28; }
        puntos+=1000; sfx.poder();
        burbuja('¡Soy el pichunguito de tío Juan!');
        hablar('¡Soy el pichunguito de tío Juan!');
      } else if (it.tipo==='flor'){
        if(!J.grande){ J.grande=true; J.y-=28; }
        J.fuego=true; puntos+=1000; sfx.poder();
        burbuja('¡Fuego pichunguito!');
        hablar('¡Fuego pichunguito!');
      } else if (it.tipo==='hueso'){
        J.perro = 900; puntos+=1500; sfx.poder();
        burbuja('¡Guau, guau! ¡Soy el perrito pichunguito!');
        hablar('¡Guau, guau! ¡Soy el perrito pichunguito!');
      } else if (it.tipo==='estrella'){
        puntos+=1000;
        lanzarTioJuanEstrella();
      }
    }
  }
  items = items.filter(i=>!i.usado && i.y<ROWS*TILE+80);

  /* --- bolas de fuego --- */
  for(const f of fuegos){
    f.vy=Math.min(f.vy+GRAV,9); f.x+=f.vx; f.y+=f.vy; f.t--;
    const cc = chocaMapa(f.x,f.y,f.w,f.h);
    if (cc){ if(f.vy>0&&f.y+f.h-f.vy<=cc.ty*TILE+4){ f.y=cc.ty*TILE-f.h; f.vy=-6; } else f.t=0; }
    for(const e of enemigos) if(e.vivo && solapa(f,e)){ matarEnemigo(e,true); f.t=0; }
  }
  fuegos = fuegos.filter(f=>f.t>0);

  /* --- enemigos --- */
  for(const e of enemigos){
    if (!e.vivo) continue;
    if (e.x-camX > VW+120) continue;            // aún fuera de pantalla
    if (e.tipo==='koopa' && e.caparazon && !e.girando){ e.vx=0; }
    moverEnte(e);
    if (e.y>ROWS*TILE+60){ e.vivo=false; continue; }
    /* caparazón girando mata a otros */
    if (e.tipo==='koopa' && e.girando){
      for(const o of enemigos) if(o!==e && o.vivo && solapa(e,o)) matarEnemigo(o,true);
    }
    if (enMeta || J.muerto>0 || !solapa({x:J.x,y:J.y,w:J.w,h}, e)) continue;
    const pisando = J.vy>0 && (J.y+h) - e.y < 20;
    if (J.burger>0){ matarEnemigo(e,true); continue; }
    if (J.perro>0 || J.enAvion>0 || J.enBarco){ matarEnemigo(e,true); puntos+=200; continue; }
    if (e.tipo==='goomba'){
      if (pisando){ matarEnemigo(e,false); J.vy=-8; }
      else dano();
    } else if (e.tipo==='koopa'){
      if (e.caparazon && !e.girando){
        e.girando=true; e.vx = (J.x+J.w/2 < e.x+e.w/2) ? 6 : -6; sfx.pisoton(); puntos+=100;
        if (pisando) J.vy=-8;
      } else if (pisando){
        if (e.girando){ e.girando=false; e.vx=0; }
        else { e.caparazon=true; e.h=22; e.y+=14; e.vx=0; }
        sfx.pisoton(); puntos+=100; J.vy=-8;
      } else dano();
    }
  }

  /* --- NPCs --- */
  for(const n of npcs){
    if (!n.activo) continue;
    n.t++;
    if (n.tipo==='santi'){
      n.y += Math.sin(n.t/20)*0.4;
      if (solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:28,h:28})){
        n.activo=false; J.cargaSanti=true; puntos+=2000; sfx.poder();
        burbuja('¡Te amo Santi, mi hermanito!');
        hablar('Te amo Santi, mi hermanito');
      }
    } else if (n.tipo==='huevo'){
      if (solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y-24,w:30,h:40})){
        n.activo=false; J.cucu=true; puntos+=1500; sfx.huevo();
        for(let i=0;i<8;i++) parts.push({tipo:'cascara', x:n.x+15, y:n.y-6,
          vx:(Math.random()-0.5)*5, vy:-3-Math.random()*4, t:45});
        burbuja('¡Hola Cucú, acompáñame!');
        hablar('Hola Cucú, acompáñame');
      }
    } else if (n.tipo==='abu'){
      const ea = {x:n.x, y:n.y, vx:n.vx, vy:n.vy||0, w:28, h:48};
      moverEnte(ea); n.x=ea.x; n.y=ea.y; n.vx=ea.vx; n.vy=ea.vy;
      if (n.huye && n.t>140){ n.activo=false; continue; }
      if (!n.huye && !J.abu && solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:28,h:48})){
        n.activo=false; J.abu=true; puntos+=2000; sfx.poder();
        burbuja('¡Te amo Abu!');
        hablar('Te amo Abu');
      }
    } else if (n.tipo==='luca'){
      if (!J.luca && solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:24,h:34})){
        n.activo=false; J.luca=true; puntos+=1000; sfx.poder();
        burbuja('¡Luca! ¡Mi amigo pichunguito!');
        hablar('¡Luca! ¡Mi amigo pichunguito!');
      }
    } else if (n.tipo==='salomon'){
      if (!J.salomon && solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:24,h:34})){
        n.activo=false; J.salomon=true; puntos+=1000; sfx.poder();
        burbuja('¡Salomón! ¡Juega conmigo, pichunguito!');
        hablar('¡Salomón! ¡Juega conmigo, pichunguito!');
      }
    } else if (n.tipo==='tiofran'){
      if (!n.hecho && Math.abs(J.x-n.x)<110 && Math.abs(J.y-n.y)<120){
        n.hecho=true; n.activo=false; J.tiofran=true; puntos+=500; sfx.pedo(); sacudir(4);
        for(let i=0;i<10;i++) parts.push({tipo:'pedo', x:n.x+14+(Math.random()-0.5)*20,
          y:n.y+30, vx:(Math.random()-0.5)*2, vy:-1-Math.random()*2, t:60});
        for(const e2 of enemigos) if(e2.vivo && Math.abs(e2.x-n.x)<160) matarEnemigo(e2,true);
        burbuja('¡Qué pedo tan grande, tío Fran!');
        hablar('¡Qué pedo tan grande, tío Fran!');
      }
    } else if (n.tipo==='mama'){
      if (!n.hecho && solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:28,h:50})){
        n.hecho=true; n.activo=false; J.mama=true; puntos+=2000; sfx.beso();
        if (!J.grande){ J.grande=true; J.y-=28; }
        J.invul=600;   // el beso de mamá protege un buen rato
        for(let i=0;i<7;i++) parts.push({tipo:'corazon', x:n.x+14+(Math.random()-0.5)*30,
          y:n.y+10, vy:-1-Math.random()*1.5, t:70});
        burbuja('¡Te amo mamá!');
        hablar('¡Te amo mamá!');
      }
    } else if (n.tipo==='papa'){
      if (!n.hecho && solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:28,h:50})){
        n.hecho=true; n.activo=false; J.papa=true; puntos+=1000; sfx.poder();
        J.superSalto=true;   // papá enseña el súper salto por el resto del nivel
        burbuja('¡Papá, mira cómo salto de alto!');
        hablar('¡Papá, mira cómo salto de alto!');
      }
    } else if (n.tipo==='yanny'){
      if (!J.yanny && solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:28,h:48})){
        n.activo=false; J.yanny=true; puntos+=1000; sfx.poder();
        burbuja('¡Hola mi amor! ¡Soy tía Yanny!');
        hablar('¡Hola mi amor! ¡Soy tía Yanny!');
      }
    } else if (n.tipo==='nacho'){
      if (!J.nacho && solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:28,h:48})){
        n.activo=false; J.nacho=true; puntos+=1000; sfx.poder();
        burbuja('¡Épale! ¡Aquí viene tío Nacho!');
        hablar('¡Épale! ¡Aquí viene tío Nacho!');
      }
    } else if (n.tipo==='beto'){
      if (!J.beto && solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:28,h:46})){
        n.activo=false; J.beto=true; puntos+=1000; sfx.poder();
        burbuja('¡Hola pichunguito! ¡Soy tío Beto!');
        hablar('¡Hola pichunguito! ¡Soy tío Beto!');
      }
    } else if (n.tipo==='giuliana'){
      if (!J.giuliana && solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:28,h:47})){
        n.activo=false; J.giuliana=true; puntos+=1000; sfx.poder();
        burbuja('¡Un abrazo, pichunguito! ¡Soy tía Giuliana!');
        hablar('¡Un abrazo, pichunguito! ¡Soy tía Giuliana!');
      }
    } else if (n.tipo==='avion'){
      if (solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:52,h:30})){
        n.activo=false; J.enAvion=720; sfx.poder();
        burbuja('¡A volar, pichunguitos!');
        hablar('¡A volar, pichunguitos!');
      }
    } else if (n.tipo==='barco'){
      if (!J.enBarco && solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:56,h:34})){
        n.activo=false; J.enBarco=true; sfx.poder();
        burbuja('¡Todos a bordo del barco pichunguito!');
        hablar('¡Todos a bordo del barco pichunguito!');
      }
    } else if (n.tipo==='bowser'){
      /* el jefe patrulla frente al castillo */
      const eb = {x:n.x, y:n.y, vx:n.vx, vy:n.vy||0, w:56, h:64};
      moverEnte(eb); n.x=eb.x; n.y=eb.y; n.vx=eb.vx; n.vy=eb.vy;
      if (n.x < 288*TILE) { n.x = 288*TILE; n.vx = Math.abs(n.vx); }
      if (n.x > 306*TILE) { n.x = 306*TILE; n.vx = -Math.abs(n.vx); }
      /* bolas de fuego le hacen daño */
      for(const f of fuegos) if (f.t>0 && solapa(f, {x:n.x,y:n.y,w:56,h:64})){ f.t=0; n.hp--; sfx.pisoton(); n.golpe=20; }
      if (estado==='juego' && J.muerto===0 && solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:56,h:64})){
        const pisando = J.vy>0 && (J.y+h) - n.y < 26;
        if (pisando){ n.hp--; n.golpe=20; J.vy=-10; sfx.pisoton(); puntos+=500; sacudir(6); }
        else if (J.perro>0 || J.burger>0){ n.hp--; n.golpe=20; puntos+=500; }
        else dano();
      }
      if (n.hp<=0){
        n.activo=false; puntos+=5000; sfx.meta();
        burbuja('¡Toma, pichungazo!');
        hablar('¡Toma, pichungazo!');
        for(let i=0;i<10;i++) parts.push({tipo:'estrellita', x:n.x+28, y:n.y+20, vx:0, vy:-2-Math.random()*3, t:50});
      }
      if (n.golpe>0) n.golpe--;
    } else if (n.tipo==='princesa'){
      const jefeVivo = npcs.some(o=>o.tipo==='bowser' && o.activo);
      if (!jefeVivo && estado==='juego' && solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:30,h:52})){
        n.activo=false; n.rescatada=true; puntos+=10000; sfx.beso();
        for(let i=0;i<12;i++) parts.push({tipo:'corazon', x:n.x+15+(Math.random()-0.5)*40,
          y:n.y+10, vy:-1-Math.random()*2, t:80});
        burbuja('¡Te amo mamá! ¡Te rescaté!');
        hablar('¡Te amo mamá!');
        iniciarMeta({x:n.x, y:n.y, activo:false});
      }
    } else if (n.tipo==='meta'){
      if (estado==='juego' && solapa({x:J.x,y:J.y,w:J.w,h}, {x:n.x,y:n.y,w:40,h:13*TILE-n.y})){
        iniciarMeta(n);
      }
    }
  }

  /* --- evento Tío Juan --- */
  if (evTioJuan) actualizarTioJuan();

  /* --- secuencia de meta --- */
  if (estado==='meta'){
    secMeta++;
    J.vx*=0.9;
    if (secMeta===70){
      burbuja('¡Te amo tío Juan, yo soy tu pichunguito!');
      hablar('Te amo tío Juan, yo soy tu pichunguito');
    }
    if (secMeta===200){
      hablar('¡Muy bien, mi pichunguito! ¡Eres un campeón!');
    }
    if (secMeta>=520){
      if (nivelIdx+1 < NIVELES.length){
        cargarNivel(nivelIdx+1); estado='juego';
        burbuja('¡Pichunguito al ataque!');
        hablar('¡Pichunguito al ataque!');
      }
      else { sfx.meta(); hablar('¡Ganaste! ¡Te amo tío Juan!'); iniciarKart(); }
    }
  }

  actualizarExtras();

  /* cámara */
  const objetivo = J.x - VW*0.38;
  camX += (objetivo-camX)*0.12;
  camX = Math.max(0, Math.min(camX, LEVW*TILE - VW));
}

function actualizarExtras(){
  for(const p of parts){
    p.t--;
    if (p.tipo==='hoja'||p.tipo==='petalo'){ p.y+=0.75; p.x+=Math.sin(p.t/9)*1.1; }
    else if (p.tipo==='arena'){ p.x+=3.2; p.y+=0.25; }
    else if (p.tipo==='luciernaga'){ p.x+=Math.sin(p.t/13)*0.7; p.y+=Math.cos(p.t/17)*0.5; }
    else if (p.tipo==='estrellaAmb'||p.tipo==='estela'||p.tipo==='polvo'||p.tipo==='destello'){ p.x+=p.vx||0; p.y+=p.vy||0; }
    else if (p.vy!==undefined){ p.x+=p.vx||0; p.y+=p.vy; p.vy+=0.3; }
  }
  parts = parts.filter(p=>p.t>0);
  shake *= 0.72; if (shake<0.25) shake=0;
  J.escX += (1-J.escX)*0.18; J.escY += (1-J.escY)*0.18;
  for(const m of monedasHUD){ m.t++; m.x += (34-m.x)*0.16; m.y += (46-m.y)*0.16; }
  monedasHUD = monedasHUD.filter(m=>m.t<40);
  for(const b of burbujas) b.t--;
  burbujas = burbujas.filter(b=>b.t>0);
  for(const b of bumps) b.t--;
  bumps = bumps.filter(b=>b.t>0);
}

let frasePichungazo = 0;
function matarEnemigo(e, lanzado){
  e.vivo=false; puntos+=100; sfx.pisoton(); sacudir(2);
  destello(e.x+12, e.y+8);
  parts.push({tipo:'puntos', x:e.x, y:e.y-10, vy:-1.5, t:40, txt:'100'});
  if (lanzado) parts.push({tipo:'estrellita', x:e.x+10, y:e.y, vx:0, vy:-4, t:30});
  /* de vez en cuando, grito de victoria pichunguito */
  if (tick - frasePichungazo > 600 && colaVoz.length===0 && Math.random()<0.4){
    frasePichungazo = tick;
    burbuja('¡Toma, pichungazo!');
    hablar('¡Toma, pichungazo!');
  }
}

/* ---------------- Evento estrella: ¡Tío Juan al rescate! ---------------- */
function lanzarTioJuanEstrella(){
  sfx.heroe();
  evTioJuan = {fase:'entra', x:camX-60, y:40, t:0, burger:null};
  hablar('¡Tío Juan al rescate! ¡Toma una hamburguesa, pichunguito, corre!');
}
function actualizarTioJuan(){
  const ev = evTioJuan; ev.t++;
  const dx = (J.x - 90) - ev.x, dy = (J.y - 100) - ev.y;
  if (ev.fase==='entra'){
    ev.x += dx*0.06; ev.y += dy*0.06;
    if (Math.abs(dx)<30 && Math.abs(dy)<40){
      ev.fase='da'; ev.t=0;
      ev.burger = {x:ev.x+40, y:ev.y+20};
      burbuja('¡Corre pichunguito!', 'TJ');
    }
  } else if (ev.fase==='da'){
    ev.x += dx*0.04; ev.y += dy*0.04;
    const b = ev.burger;
    b.x += (J.x+J.w/2 - b.x)*0.15; b.y += (J.y+10 - b.y)*0.15;
    if (ev.t>45){
      J.burger = 600; sfx.poder();
      burbuja('¡Gracias tío Juan!');
      hablar('¡Gracias tío Juan!');
      ev.fase='sale'; ev.t=0; ev.burger=null;
    }
  } else if (ev.fase==='sale'){
    ev.x -= 5; ev.y -= 3;
    if (ev.t>90) evTioJuan=null;
  } else if (ev.fase==='meta'){
    /* aparece en la meta y se queda celebrando */
    const mx = ev.destX, my = ev.destY;
    ev.x += (mx-ev.x)*0.08; ev.y += (my-ev.y)*0.08 + Math.sin(ev.t/15)*0.5;
  }
}

/* ---------------- Meta ---------------- */
function iniciarMeta(n){
  estado='meta'; secMeta=0; n.activo=false;
  puntos += 5000 + (J.cargaSanti?2000:0) + (J.cucu?1500:0) + tiempo*10;
  sfx.meta();
  evTioJuan = {fase:'meta', x:camX+W, y:-60, t:0, destX:n.x+60, destY:n.y-3*TILE, burger:null};
}

/* ============================================================
   DIBUJO
   ============================================================ */
function rect(x,y,w,h,c){ ctx.fillStyle=c; ctx.fillRect(Math.round(x),Math.round(y),w,h); }

function letrero(x, y, txt, color){
  /* nombre flotante con flecha, para encontrar fácil a los personajes */
  const f = Math.sin(tick/12)*3;
  ctx.font='bold 12px monospace'; ctx.textAlign='center';
  ctx.fillStyle='#000'; ctx.fillText(txt, x+1, y+f+1);
  ctx.fillStyle=color||'#fff'; ctx.fillText(txt, x, y+f);
  ctx.fillStyle='#000'; ctx.fillText('▼', x+1, y+f+14);
  ctx.fillStyle=color||'#fff'; ctx.fillText('▼', x, y+f+13);
  ctx.textAlign='left';
}

function dibFernando(x,y,cara,grande,fuego,corriendo,t){
  const h = grande?56:28, esc = grande?2:1.4;
  if (J.invul>0 && (tick>>2)%2) return;
  const arco = J.burger>0 ? `hsl(${(tick*12)%360},90%,60%)` : null;
  const ropa = arco || (fuego ? '#fff' : '#d82800');
  const overol = arco || (fuego ? '#d82800' : '#2038ec');
  const piel = '#ffc8a0', pelo = '#5a3418';
  ctx.save(); ctx.translate(Math.round(x), Math.round(y));
  if (cara<0){ ctx.scale(-1,1); ctx.translate(-24,0); }
  /* gorra */
  rect(2,0,20,5*(grande?1.6:1),ropa); rect(14,4*(grande?1.6:1),12,3,ropa);
  /* cara */
  rect(4,5*esc,16,7*esc,piel);
  rect(15,6*esc,3,2,'#222');                 // ojo
  rect(2,5*esc,3,4,pelo);                    // pelo
  /* cuerpo */
  rect(3,12*esc,18,7*esc,ropa);
  rect(5,(12+5)*esc,14,(grande?9:5)*esc,overol);
  rect(7,13*esc,2,3,'#ffe36e'); rect(15,13*esc,2,3,'#ffe36e'); // botones
  /* piernas */
  const paso = corriendo ? Math.sin(t/3)*3 : 0;
  rect(4,h-6,7,6,'#6b3410'); rect(13+paso*0.5,h-6,7,6,'#6b3410');
  /* Santi en brazos */
  if (J.cargaSanti){
    rect(16,10*esc,14,12,'#8ecbff'); rect(19,7*esc,9,8,piel);
    rect(21,9*esc,2,2,'#222'); rect(19,6*esc,9,3,'#4a2f10');
  }
  ctx.restore();
}
function dibPerro(x,y,cara,color,t){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  if (cara<0){ ctx.scale(-1,1); ctx.translate(-26,0); }
  rect(2,8,18,10,color);                       // cuerpo
  rect(16,2,9,8,color);                        // cabeza
  rect(17,0,3,4,color); rect(22,0,3,4,color);  // orejas
  rect(23,4,2,2,'#fff');                       // ojo
  rect(25,7,2,2,'#3b241a');                    // nariz
  const paso=Math.sin(t/4)*2;
  rect(4,16+paso*0.4,3,5,color); rect(14,16-paso*0.4,3,5,color); // patas
  const cola=Math.sin(t/5)*3;
  rect(-2,6+cola,5,3,color);                   // cola
  ctx.restore();
}
function dibCucu(x,y,cara,t){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  if (cara<0){ ctx.scale(-1,1); ctx.translate(-22,0); }
  rect(4,0,14,10,'#ffc8a0');                   // cara
  rect(4,-3,14,4,'#3b2410');                   // pelo
  rect(1,-2,4,9,'#3b2410'); rect(17,-2,4,9,'#3b2410'); // coletas
  rect(0,2,3,3,'#ff6ec0'); rect(19,2,3,3,'#ff6ec0');   // lazos
  rect(12,3,3,2,'#222');                       // ojo
  rect(3,10,16,12,'#ff6ec0');                  // vestido
  const paso=Math.sin(t/4)*2;
  rect(6,22+paso*0.4,4,5,'#ffc8a0'); rect(13,22-paso*0.4,4,5,'#ffc8a0');
  ctx.restore();
}
function dibAbu(x,y,cara,t,sola){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  if (cara<0){ ctx.scale(-1,1); ctx.translate(-28,0); }
  rect(6,4,16,12,'#ffc8a0');                   // cara
  rect(6,0,16,5,'#cfcfcf'); rect(10,-4,8,5,'#cfcfcf'); // pelo moño
  rect(16,7,3,2,'#222');                       // ojo
  rect(8,8,4,1,'#c88');                        // lentes? mejilla
  rect(4,16,20,22,'#7b4fa8');                  // vestido
  rect(2,20,4,10,'#7b4fa8'); rect(22,20,4,10,'#7b4fa8'); // brazos
  const paso=sola?Math.sin(t/6)*2:0;
  rect(7,38+paso*0.4,5,10,'#ffc8a0'); rect(16,38-paso*0.4,5,10,'#ffc8a0');
  rect(6,46,7,3,'#3b241a'); rect(15,46,7,3,'#3b241a');
  ctx.restore();
}
function dibLuca(x,y,t,cara){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  if (cara<0){ ctx.scale(-1,1); ctx.translate(-24,0); }
  rect(2,0,20,6,'#2a9c3a'); rect(14,5,10,3,'#2a9c3a');   // gorra verde
  rect(4,6,16,9,'#e8b088'); rect(15,8,3,2,'#222');
  rect(3,15,18,12,'#ffe36e');                            // camiseta amarilla
  const paso=Math.sin(t/4)*2;
  rect(5,27+paso*0.4,6,7,'#5a5a5a'); rect(13,27-paso*0.4,6,7,'#5a5a5a');
  ctx.restore();
}
function dibSalomon(x,y,t,cara){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  if (cara<0){ ctx.scale(-1,1); ctx.translate(-24,0); }
  rect(3,-3,18,6,'#2a1a0a');                             // pelo rizado
  for(const px of [2,8,14,19]) { ctx.fillStyle='#2a1a0a'; ctx.beginPath(); ctx.arc(px+2,-1,4,0,Math.PI*2); ctx.fill(); }
  rect(4,3,16,10,'#c88a5a');
  rect(12,5,9,4,'#1a1a1a'); rect(14,6,2,2,'#8ecbff');    // lentes
  rect(3,13,18,13,'#d86a28');                            // franela naranja
  const paso=Math.sin(t/4)*2;
  rect(5,26+paso*0.4,6,8,'#3a3a3a'); rect(13,26-paso*0.4,6,8,'#3a3a3a');
  ctx.restore();
}
function dibTioFran(x,y,t,hecho){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  rect(4,0,20,6,'#3a2a1a');                              // pelo
  rect(6,4,16,12,'#ffc8a0');
  rect(16,8,3,2,'#222');
  rect(8,12,12,3,'#3a2a1a');                             // bigote
  rect(4,16,20,20,'#8a6a3a');                            // camisa marrón
  rect(2,20,4,10,'#8a6a3a'); rect(22,20,4,10,'#8a6a3a');
  const paso = hecho ? Math.sin(t/3)*3 : 0;              // se ríe después del pedo
  rect(6,36+paso*0.3,6,10,'#4a4a5a'); rect(15,36-paso*0.3,6,10,'#4a4a5a');
  rect(5,44,8,4,'#222'); rect(15,44,8,4,'#222');
  ctx.restore();
}
function dibMama(x,y,t){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  rect(4,-4,20,8,'#5a3418'); rect(2,0,4,18,'#5a3418'); rect(22,0,4,18,'#5a3418'); // melena
  rect(6,2,16,12,'#ffc8a0');
  rect(16,6,3,2,'#222'); rect(8,11,4,2,'#e07a7a');       // sonrisa
  rect(4,14,20,24,'#ff6ea8');                            // vestido rosa
  rect(2,18,4,10,'#ffc8a0'); rect(22,18,4,10,'#ffc8a0');
  const f=Math.sin(t/14)*2;
  ctx.fillStyle='#ff5a8a'; ctx.font='12px monospace'; ctx.fillText('♥', 26, -2+f);
  rect(7,38,5,9,'#ffc8a0'); rect(16,38,5,9,'#ffc8a0');
  rect(6,46,7,3,'#a83a5a'); rect(15,46,7,3,'#a83a5a');
  ctx.restore();
}
function dibPapa(x,y,t){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  rect(4,-2,20,6,'#1560d0'); rect(16,2,10,3,'#1560d0');  // gorra azul
  rect(6,4,16,12,'#ffc8a0');
  rect(16,8,3,2,'#222'); rect(8,13,10,2,'#8a5a3a');      // barba corta
  rect(4,16,20,20,'#2a6ad0');                            // camisa azul
  rect(2,20,4,10,'#2a6ad0'); rect(22,20,4,10,'#2a6ad0');
  const f=Math.sin(t/12)*2;
  rect(6,36+f*0.2,6,10,'#3a3a4a'); rect(15,36-f*0.2,6,10,'#3a3a4a');
  rect(5,44,8,4,'#222'); rect(15,44,8,4,'#222');
  ctx.restore();
}

function dibNacho(x,y,t){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  rect(0,2,28,5,'#e8a33d'); rect(6,-4,16,8,'#e8a33d');   // sombrero
  rect(6,7,16,11,'#d8a070');
  rect(16,10,3,2,'#222'); rect(8,14,12,3,'#3a2a1a');     // bigote
  rect(4,18,20,18,'#ffe36e');                            // camisa amarilla
  rect(2,22,4,9,'#ffe36e'); rect(22,22,4,9,'#ffe36e');
  rect(6,36,6,8,'#4a4a5a'); rect(15,36,6,8,'#4a4a5a');
  ctx.restore();
}
function dibYanny(x,y,t){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  rect(4,-3,20,7,'#7a3aa8'); rect(2,0,4,16,'#7a3aa8'); rect(22,0,4,16,'#7a3aa8'); // melena morada
  rect(6,3,16,11,'#ffc8a0');
  rect(16,6,3,2,'#222'); rect(8,11,4,2,'#e07a7a');
  rect(4,14,20,22,'#40c0b0');                            // vestido turquesa
  rect(2,18,4,9,'#ffc8a0'); rect(22,18,4,9,'#ffc8a0');
  rect(7,36,5,8,'#ffc8a0'); rect(16,36,5,8,'#ffc8a0');
  ctx.restore();
}
function dibRomulo(x,y,t){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  rect(2,-4,6,6,'#9a9aae'); rect(20,-4,6,6,'#9a9aae');   // orejas
  rect(2,0,24,14,'#9a9aae');                             // cabeza
  rect(0,4,28,6,'#2a2a34');                              // antifaz
  rect(6,5,4,3,'#fff'); rect(18,5,4,3,'#fff');           // ojos
  rect(11,10,6,4,'#3a3a44');                             // hocico
  rect(4,14,20,16,'#b8b8c8');                            // panza
  const f=Math.sin(t/10)*2;
  rect(24,10+f,8,12,'#ffdd57'); rect(24,7+f,8,4,'#fff'); // jarra de cerveza con espuma
  rect(4,30,7,6,'#7a7a8e'); rect(16,30,7,6,'#7a7a8e');
  rect(-6,16,8,4,'#9a9aae');                             // cola
  rect(-6,16,3,4,'#5a5a6e');
  ctx.restore();
}
function dibBowser(x,y,t,golpe){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  if (golpe>0 && (t>>1)%2){ ctx.restore(); return; }
  rect(6,10,44,34,'#2a8a2a');                            // caparazón
  for(const px of [10,24,38]) { ctx.fillStyle='#e8e0d0'; ctx.beginPath();
    ctx.moveTo(px,10); ctx.lineTo(px+8,10); ctx.lineTo(px+4,0); ctx.closePath(); ctx.fill(); } // púas
  rect(0,18,16,20,'#7ed040');                            // panza
  rect(30,-8,26,22,'#7ed040');                           // cabeza
  rect(34,-16,6,10,'#e8e0d0'); rect(46,-16,6,10,'#e8e0d0'); // cuernos
  rect(46,-2,6,4,'#d82800');                             // ojo furioso
  rect(44,8,12,4,'#5a3418');                             // hocico
  const paso=Math.sin(t/6)*2;
  rect(8,44+paso*0.3,12,10,'#e8a33d'); rect(32,44-paso*0.3,12,10,'#e8a33d');
  ctx.restore();
}
function dibPrincesa(x,y,t,rescatada){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  rect(4,-4,22,8,'#5a3418'); rect(2,0,4,18,'#5a3418'); rect(24,0,4,18,'#5a3418'); // melena
  ctx.fillStyle='#ffe36e';                               // corona
  ctx.beginPath(); ctx.moveTo(6,-6); ctx.lineTo(10,-14); ctx.lineTo(15,-7); ctx.lineTo(20,-14); ctx.lineTo(24,-6); ctx.closePath(); ctx.fill();
  rect(7,2,16,12,'#ffc8a0');
  rect(17,6,3,2,'#222'); rect(9,11,4,2,'#e07a7a');
  rect(4,14,22,26,'#ff9ed6');                            // vestido rosa de princesa
  rect(2,18,4,10,'#ffc8a0'); rect(24,18,4,10,'#ffc8a0');
  rect(8,40,5,8,'#ffc8a0'); rect(17,40,5,8,'#ffc8a0');
  if (!rescatada){                                       // jaula
    ctx.strokeStyle='#4a4a5a'; ctx.lineWidth=4;
    for(let bx2=-8;bx2<=38;bx2+=11){ ctx.beginPath(); ctx.moveTo(bx2,-24); ctx.lineTo(bx2,52); ctx.stroke(); }
    ctx.strokeRect(-10,-26,50,80);
  }
  ctx.restore();
}
function dibBeto(x,y,t){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  rect(4,-2,20,6,'#2a2a2a');                             // pelo corto
  rect(6,4,16,12,'#e8b088');
  rect(12,6,10,4,'#1a1a1a'); rect(14,7,2,2,'#8ecbff');   // lentes
  rect(8,13,10,2,'#3a2a1a');                             // barba
  rect(4,16,20,20,'#2a9c6a');                            // camisa verde
  rect(2,20,4,10,'#2a9c6a'); rect(22,20,4,10,'#2a9c6a');
  rect(6,36,6,10,'#3a3a4a'); rect(15,36,6,10,'#3a3a4a');
  ctx.restore();
}
function dibGiuliana(x,y,t){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  rect(4,-4,20,8,'#7a4a1a'); rect(2,0,4,20,'#7a4a1a'); rect(22,0,4,20,'#7a4a1a'); // melena castaña
  rect(6,2,16,12,'#ffc8a0');
  rect(16,6,3,2,'#222'); rect(8,11,4,2,'#e07a7a');
  rect(4,14,20,24,'#ff8a3d');                            // vestido naranja
  rect(2,18,4,10,'#ffc8a0'); rect(22,18,4,10,'#ffc8a0');
  rect(7,38,5,9,'#ffc8a0'); rect(16,38,5,9,'#ffc8a0');
  ctx.restore();
}
function dibAvion(x,y,cara,t){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  if (cara<0){ ctx.scale(-1,1); ctx.translate(-56,0); }
  const f = Math.sin(t/5)*1.5;
  ctx.translate(0,f);
  rect(0,8,52,14,'#e8e8f0');                            // fuselaje
  rect(44,4,12,10,'#d82800');                           // nariz
  rect(4,2,10,10,'#8ecbff');                            // cabina
  rect(10,18,22,5,'#d82800');                           // ala
  rect(-4,4,8,12,'#d82800');                            // cola
  ctx.fillStyle='#aaa';                                  // hélice
  ctx.beginPath(); ctx.ellipse(58,12,3,10+(t%2)*4,0,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
function dibBarco(x,y,t){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y+Math.sin(t/9)*2));
  ctx.fillStyle='#8a5a2a';
  ctx.beginPath(); ctx.moveTo(0,10); ctx.lineTo(60,10); ctx.lineTo(50,26); ctx.lineTo(10,26); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#5a3418'; ctx.lineWidth=2; ctx.stroke();
  rect(28,-22,4,32,'#5a3418');                           // mástil
  ctx.fillStyle='#fff';
  ctx.beginPath(); ctx.moveTo(32,-20); ctx.lineTo(54,-2); ctx.lineTo(32,-2); ctx.closePath(); ctx.fill(); // vela
  ctx.strokeStyle='#ccc'; ctx.stroke();
  ctx.restore();
}
function dibTioJuan(x,y,t){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  /* capa */
  ctx.fillStyle='#d82800';
  ctx.beginPath(); ctx.moveTo(4,10);
  ctx.lineTo(-8+Math.sin(t/8)*4, 44); ctx.lineTo(30, 40); ctx.lineTo(28,10); ctx.closePath(); ctx.fill();
  rect(6,0,20,12,'#ffc8a0');                   // cara
  rect(6,-3,20,4,'#222');                      // pelo
  rect(19,3,4,3,'#222');                       // ojo
  rect(8,9,14,2,'#7a4');                       // sonrisa
  rect(4,12,24,20,'#1560d0');                  // traje
  ctx.fillStyle='#ffe36e'; ctx.font='bold 12px monospace'; ctx.fillText('TJ',10,26); // emblema
  rect(4,32,10,12,'#1560d0'); rect(18,32,10,12,'#1560d0');
  rect(2,42,12,4,'#d82800'); rect(18,42,12,4,'#d82800'); // botas
  ctx.restore();
}
function dibBurger(x,y){
  rect(x,y,22,5,'#e8a33d'); rect(x+2,y+5,18,3,'#4a7a2a');
  rect(x+1,y+8,20,5,'#7a4020'); rect(x+2,y+13,18,3,'#ffdd57');
  rect(x,y+16,22,6,'#e8a33d');
}
function dibSanti(x,y,t){
  const f = Math.sin(t/20)*3;
  ctx.save(); ctx.translate(Math.round(x),Math.round(y+f));
  rect(2,8,24,16,'#8ecbff');                   // manta
  rect(7,0,14,11,'#ffc8a0');                   // cara
  rect(7,-2,14,4,'#4a2f10');                   // pelito
  rect(11,4,2,2,'#222'); rect(16,4,2,2,'#222');// ojos
  rect(12,8,4,2,'#e07a7a');                    // chupón
  ctx.restore();
  letrero(x+14, y-24, 'SANTI', '#8ecbff');
}
function dibHuevo(x,y,t){
  ctx.save(); ctx.translate(Math.round(x),Math.round(y));
  const w = Math.sin(t/9)*2;
  ctx.rotate(w*0.02);
  ctx.fillStyle='#fff';
  ctx.beginPath(); ctx.ellipse(15,-4,14,19,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#ff6ec0';
  for(const [px,py] of [[8,-12],[20,-8],[12,2],[22,-16]]) { ctx.beginPath(); ctx.arc(px,py,3,0,Math.PI*2); ctx.fill(); }
  ctx.restore();
}
function dibGoomba(x,y,t){
  rect(x,y+4,26,14,'#9c5a1c');
  rect(x+2,y,22,8,'#b06a24');
  rect(x+5,y+5,4,5,'#fff'); rect(x+17,y+5,4,5,'#fff');
  rect(x+7,y+7,2,3,'#222'); rect(x+18,y+7,2,3,'#222');
  const paso=Math.sin(t/5)*2;
  rect(x+2,y+18+paso*0.3,9,6,'#222'); rect(x+15,y+18-paso*0.3,9,6,'#222');
}
function dibKoopa(x,y,e,t){
  if (e.caparazon){
    rect(x,y+2,26,18,'#3aa030'); rect(x+3,y+5,20,12,'#7ed040');
    if (e.girando){ rect(x+6,y+8,4,4,'#3aa030'); rect(x+16,y+8,4,4,'#3aa030'); }
    return;
  }
  rect(x+2,y+12,24,18,'#3aa030');              // caparazón
  rect(x+5,y+15,18,12,'#7ed040');
  rect(x+16,y,10,14,'#ffe36e');                // cabeza
  rect(x+22,y+3,3,3,'#222');
  const paso=Math.sin(t/5)*2;
  rect(x+4,y+30+paso*0.3,7,6,'#ffe36e'); rect(x+16,y+30-paso*0.3,7,6,'#ffe36e');
}

function dibTile(tx,ty){
  const c = grid[ty][tx];
  if (c==='.') return;
  let x = tx*TILE, y = ty*TILE + HUD_H;
  const bump = bumps.find(b=>b.tx===tx&&b.ty===ty);
  if (bump) y -= Math.sin(bump.t/10*Math.PI)*8;
  x -= camX;
  if (c==='#'){
    const t = (infoNivel && infoNivel.tierra) || TIERRAS.pradera;
    rect(x,y,TILE,TILE,t.base);
    rect(x,y,TILE,3,t.borde); rect(x,y+3,2,TILE-3,t.borde);
    rect(x+2,y+6,12,10,t.rel); rect(x+18,y+18,12,10,t.rel);
    rect(x+TILE-3,y+3,3,TILE-3,t.som); rect(x,y+TILE-3,TILE,3,t.som);
    rect(x+2,y+3,TILE-4,2,'rgba(255,255,255,0.14)');
  } else if (c==='W' || c==='='){
    rect(x,y,TILE,TILE,'#e09050');
    rect(x,y,TILE,4,'#ffc078'); rect(x,y,3,TILE,'#ffc078');
    rect(x+TILE-3,y,3,TILE,'#8a4a18'); rect(x,y+TILE-3,TILE,3,'#8a4a18');
  } else if (c==='B'){
    rect(x,y,TILE,TILE,'#e07020');
    rect(x+2,y+2,TILE-4,3,'rgba(255,255,255,0.18)');
    ctx.strokeStyle='#7a3000'; ctx.lineWidth=2;
    ctx.strokeRect(x+1,y+1,TILE-2,TILE-2);
    ctx.beginPath(); ctx.moveTo(x,y+16); ctx.lineTo(x+32,y+16);
    ctx.moveTo(x+16,y); ctx.lineTo(x+16,y+16); ctx.moveTo(x+8,y+16); ctx.lineTo(x+8,y+32);
    ctx.moveTo(x+24,y+16); ctx.lineTo(x+24,y+32); ctx.stroke();
  } else if (c==='?'||c==='M'||c==='S'){
    rect(x,y,TILE,TILE,'#f8b800');
    rect(x,y,TILE,3,'#ffe36e'); rect(x,y,3,TILE,'#ffe36e');
    rect(x+TILE-3,y,3,TILE,'#b06000'); rect(x,y+TILE-3,TILE,3,'#b06000');
    rect(x+4,y+4,TILE-8,3,'rgba(255,255,255,0.30)');
    ctx.strokeStyle='#7a3000'; ctx.lineWidth=2; ctx.strokeRect(x+2,y+2,TILE-4,TILE-4);
    /* remaches estilo SMB3 */
    for(const [rx,ry] of [[5,5],[TILE-8,5],[5,TILE-8],[TILE-8,TILE-8]]) rect(x+rx,y+ry,3,3,'#7a3000');
    ctx.fillStyle='#7a3000'; ctx.font='bold 20px monospace';
    const s = c==='S' ? '★' : '?';
    if ((tick>>4)%2===0 || c!=='?') ctx.fillText(s, x+9, y+24);
    else ctx.fillText('?', x+9, y+23);
    if (c==='S') letrero(x+16, y-30, '★ TÍO JUAN ★', '#ffe36e');
  } else if (c==='O'){
    rect(x,y,TILE,TILE,'#c87838');
    rect(x,y,TILE,3,'#e8a868'); rect(x,y,3,TILE,'#e8a868');
    rect(x+TILE-3,y,3,TILE,'#8a4a18'); rect(x,y+TILE-3,TILE,3,'#8a4a18');
    /* huesito */
    rect(x+9,y+14,14,4,'#fff');
    for(const [hx2,hy2] of [[6,11],[6,17],[21,11],[21,17]]){
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x+hx2+2,y+hy2+2,3,0,Math.PI*2); ctx.fill();
    }
    letrero(x+16, y-30, '¡HUESO!', '#ffb0b0');
  } else if (c==='X'){
    rect(x,y,TILE,TILE,'#9c5a1c');
    ctx.strokeStyle='#5a2c00'; ctx.lineWidth=2; ctx.strokeRect(x+2,y+2,TILE-4,TILE-4);
  } else if (c==='l'){
    const tapa = getT(tx,ty-1)!=='l';
    rect(x,y,TILE,TILE,'#30a020');
    rect(x+3,y,5,TILE,'#80d010');
    rect(x+TILE-6,y,4,TILE,'#187010');
    if (tapa){
      const off = getT(tx-1,ty)==='l' ? 0 : 4;
      rect(x-off,y,TILE+4,10,'#30a020');
      rect(x-off,y,TILE+4,3,'#80d010');
      rect(x-off+3,y+3,4,7,'#80d010');
      rect(x-off,y+8,TILE+4,2,'#187010');
    }
  } else if (c==='C'){
    const f = (tick>>3)%4, wdt = [16,10,4,10][f];
    rect(x+(TILE-wdt)/2, y+6, wdt, 20, '#f8b800');
    rect(x+(TILE-wdt)/2+2, y+9, Math.max(wdt-4,2), 14, '#ffe36e');
  }
}

/* --- decorados de fondo estilo SMB3 --- */
function nubeSMB3(x,y,esc){
  ctx.save(); ctx.translate(x,y); ctx.scale(esc||1,esc||1);
  ctx.beginPath();
  ctx.arc(0,0,15,Math.PI*0.45,Math.PI*1.5);
  ctx.arc(19,-13,17,Math.PI*0.85,Math.PI*1.95);
  ctx.arc(40,-10,14,Math.PI*1.1,Math.PI*2.1);
  ctx.arc(50,2,13,Math.PI*1.5,Math.PI*0.55);
  ctx.closePath();
  ctx.fillStyle='#fff'; ctx.fill();
  ctx.strokeStyle='#4a6ab8'; ctx.lineWidth=3; ctx.stroke();
  ctx.restore();
}
function colinaSMB3(x,w,h){
  ctx.beginPath(); ctx.moveTo(x,H); ctx.lineTo(x+w/2,H-h); ctx.lineTo(x+w,H); ctx.closePath();
  ctx.fillStyle='#28a828'; ctx.fill();
  ctx.strokeStyle='#0c6c0c'; ctx.lineWidth=3; ctx.stroke();
  ctx.save(); ctx.clip();
  ctx.strokeStyle='#0c6c0c'; ctx.lineWidth=2;
  for(let s=0;s<4;s++){ ctx.beginPath(); ctx.moveTo(x+w/2-30+s*8, H-h+18+s*22); ctx.lineTo(x+w/2-14+s*8, H-h+34+s*22); ctx.stroke(); }
  ctx.restore();
}
function arbustoSMB3(x,y){
  ctx.beginPath();
  ctx.arc(x,y,14,Math.PI,0); ctx.arc(x+20,y-6,16,Math.PI,0.15); ctx.arc(x+42,y,14,Math.PI,0);
  ctx.lineTo(x-14,y);
  ctx.fillStyle='#40c040'; ctx.fill(); ctx.strokeStyle='#0c6c0c'; ctx.lineWidth=3; ctx.stroke();
}
function arbolSMB3(x,y){
  rect(x+10,y-30,10,34,'#8a5a2a');
  ctx.beginPath(); ctx.arc(x+15,y-44,24,0,Math.PI*2);
  ctx.fillStyle='#1f8f1f'; ctx.fill(); ctx.strokeStyle='#0c5c0c'; ctx.lineWidth=3; ctx.stroke();
}
function palmeraSMB3(x,y){
  rect(x+12,y-52,8,56,'#b8863c');
  ctx.fillStyle='#28a828'; ctx.strokeStyle='#0c6c0c'; ctx.lineWidth=2;
  for(const a of [-0.9,-0.45,0.45,0.9]){
    ctx.beginPath(); ctx.ellipse(x+16+Math.cos(a-1.57)*22, y-56+Math.sin(a-1.57)*10+8, 20, 7, a, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();
  }
}
function cactusSMB3(x,y){
  ctx.fillStyle='#2a9c3a'; ctx.strokeStyle='#0c5c1c'; ctx.lineWidth=2;
  rect(x+12,y-42,12,46,'#2a9c3a'); rect(x,y-30,10,8,'#2a9c3a'); rect(x,y-30,6,16,'#2a9c3a');
  rect(x+26,y-22,10,8,'#2a9c3a'); rect(x+30,y-22,6,12,'#2a9c3a');
}
function torreSMB3(x){
  ctx.fillStyle='rgba(20,20,40,0.55)';
  rect(x,H-160,70,160,'rgba(20,20,40,0.55)');
  for(let i=0;i<4;i++) rect(x+i*20,H-172,12,14,'rgba(20,20,40,0.55)');
  rect(x+26,H-120,18,26,'rgba(80,80,120,0.6)');
}
function aclarar(hex, f){
  const n = parseInt(hex.slice(1),16), r=n>>16, g=(n>>8)&255, b=n&255;
  const m = v => Math.round(v + (255-v)*f);
  return 'rgb('+m(r)+','+m(g)+','+m(b)+')';
}
function dibFondo(){
  const im = fondosImg.mundos[nivelIdx];
  if (imgLista(im)){
    /* fondo ilustrado con paneo suave según el avance del nivel */
    const alto = H - HUD_H + 80;
    const ancho = Math.max(VW*1.25, alto * im.naturalWidth / im.naturalHeight);
    const prog = Math.max(0, Math.min(1, camX / Math.max(1, LEVW*TILE - VW)));
    const off = prog * (ancho - VW);
    ctx.drawImage(im, -off, HUD_H - 70, ancho, alto + 70);
    return;
  }
  const d = infoNivel ? infoNivel.decor : 'colinas';
  const cielo = infoNivel ? infoNivel.cielo : '#5c94fc';
  const g = ctx.createLinearGradient(0,HUD_H-60,0,H);
  g.addColorStop(0, cielo); g.addColorStop(1, aclarar(cielo, d==='cueva'?0.06:0.4));
  ctx.fillStyle = g;
  ctx.fillRect(0,HUD_H-60,W,H-HUD_H+60);
  const p1 = camX*0.3, p2 = camX*0.6;
  if (d==='cueva'){
    ctx.fillStyle='rgba(0,0,0,0.35)';
    for(let i=0;i<10;i++){
      const cx2 = ((i*260 - p1) % (W+300) + (W+300))%(W+300) - 150;
      ctx.beginPath(); ctx.moveTo(cx2,HUD_H); ctx.lineTo(cx2+24,HUD_H);
      ctx.lineTo(cx2+12,HUD_H+70+(i%3)*35); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle='rgba(255,255,200,0.12)';
    for(let i=0;i<12;i++){
      const gx = ((i*180 - p2) % (W+200) + (W+200))%(W+200) - 100;
      ctx.beginPath(); ctx.arc(gx, HUD_H+140+(i*53)%260, 3, 0, Math.PI*2); ctx.fill();
    }
  } else {
    for(let i=0;i<7;i++){
      const nx = ((i*430 - p1) % (W+400) + (W+400))%(W+400) - 200;
      nubeSMB3(nx, HUD_H + 100 + (i%3)*45, d==='nubes'?1.15:1);
    }
    if (d==='nubes') for(let i=0;i<5;i++){
      const nx = ((i*380 - p2 + 150) % (W+400) + (W+400))%(W+400) - 200;
      nubeSMB3(nx, HUD_H + 280 + (i%2)*70, 0.8);
    }
  }
  if (d==='colinas' || d==='bosque'){
    for(let i=0;i<6;i++){
      const hx = ((i*560 - p2) % (W+600) + (W+600))%(W+600) - 300;
      colinaSMB3(hx, 260, 140+(i%2)*40);
    }
    for(let i=0;i<8;i++){
      const bx = ((i*330 - p2 + 120) % (W+500) + (W+500))%(W+500) - 200;
      arbustoSMB3(bx, H-14);
    }
    if (d==='bosque') for(let i=0;i<7;i++){
      const tx2 = ((i*300 - p2 + 60) % (W+400) + (W+400))%(W+400) - 150;
      arbolSMB3(tx2, H-14);
    }
  } else if (d==='playa'){
    ctx.fillStyle='#ffe36e'; ctx.beginPath(); ctx.arc(W-140, HUD_H+95, 40, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle='#e8a33d'; ctx.lineWidth=4; ctx.stroke();
    for(let i=0;i<5;i++){
      const px2 = ((i*420 - p2) % (W+500) + (W+500))%(W+500) - 200;
      palmeraSMB3(px2, H-12);
    }
  } else if (d==='desierto'){
    ctx.fillStyle='#e8b858';
    for(let i=0;i<5;i++){
      const dx2 = ((i*480 - p2) % (W+600) + (W+600))%(W+600) - 300;
      ctx.beginPath(); ctx.arc(dx2+150, H, 150, Math.PI, 0); ctx.fill();
    }
    for(let i=0;i<5;i++){
      const cx3 = ((i*390 - p2 + 140) % (W+500) + (W+500))%(W+500) - 200;
      cactusSMB3(cx3, H-12);
    }
  } else if (d==='castillo'){
    for(let i=0;i<5;i++){
      const kx = ((i*470 - p2) % (W+600) + (W+600))%(W+600) - 250;
      torreSMB3(kx);
    }
  } else if (d==='marino'){
    ctx.fillStyle='rgba(255,255,255,0.10)';
    for(let i=0;i<5;i++){
      const rx3 = ((i*260 - p1) % (W+300) + (W+300))%(W+300) - 150;
      ctx.beginPath(); ctx.moveTo(rx3,HUD_H); ctx.lineTo(rx3+90,HUD_H);
      ctx.lineTo(rx3+150,H); ctx.lineTo(rx3+20,H); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle='#1a8a5a';
    for(let i=0;i<9;i++){
      const ax2 = ((i*230 - p2) % (W+250) + (W+250))%(W+250) - 120;
      for(let s2=0;s2<3;s2++) rect(ax2+s2*7, H-40-((i+s2)%3)*16 - Math.sin(tick/30+i)*4, 5, 46, '#1a8a5a');
    }
  }
}

function dibHUD(){
  /* barra translúcida moderna con línea de acento */
  ctx.fillStyle='rgba(8,10,24,0.92)'; ctx.fillRect(0,0,W,HUD_H);
  const acc = ctx.createLinearGradient(0,0,W,0);
  acc.addColorStop(0,'#d82800'); acc.addColorStop(0.5,'#f8b800'); acc.addColorStop(1,'#2a6ad0');
  ctx.fillStyle=acc; ctx.fillRect(0,HUD_H-3,W,3);
  ctx.fillStyle='rgba(255,255,255,0.06)'; ctx.fillRect(0,0,W,1);
  ctx.fillStyle='#fff'; ctx.font='bold 18px monospace';
  ctx.fillText('FERNANDO × ∞', 16, 26);
  /* moneda girando */
  const wq = Math.abs(Math.cos(tick/9))*7+1;
  ctx.fillStyle='#f8b800';
  ctx.beginPath(); ctx.ellipse(23,44,wq,8,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#ffe36e';
  ctx.beginPath(); ctx.ellipse(23,44,Math.max(wq-3,1),5,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#f8b800'; ctx.font='bold 18px monospace';
  ctx.fillText(String(monedas).padStart(2,'0'), 38, 50);
  /* monedas volando hacia el contador */
  for(const m of monedasHUD){
    ctx.globalAlpha=Math.max(0.2, 1-m.t/40);
    ctx.fillStyle='#ffe36e';
    ctx.beginPath(); ctx.ellipse(m.x, m.y, 6, 8, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha=1;
  }
  ctx.fillStyle='#fff';
  ctx.fillText('PUNTOS ' + String(puntos).padStart(7,'0'), 190, 26);
  ctx.fillText('TIEMPO ' + String(Math.max(tiempo,0)).padStart(3,'0'), 190, 50);
  ctx.font='bold 16px monospace';
  ctx.fillText(infoNivel ? infoNivel.nombre : '', 430, 24);
  ctx.font='bold 18px monospace';
  /* medidor P */
  ctx.fillText('P', 430, 50);
  for(let i=0;i<6;i++){
    ctx.fillStyle = J.pmetro > (i+1)*16 ? '#f8b800' : '#333';
    ctx.fillText('▶', 450+i*22, 50);
  }
  if (J.pmetro>=95 && (tick>>3)%2){ ctx.fillStyle='#ff5050'; ctx.fillText('¡¡PP!!', 590, 50); }
  /* estado de compañía (alineado a la derecha, línea 2, compacto) */
  ctx.textAlign='right';
  ctx.font='13px monospace';
  if (J.burger>0){ ctx.fillStyle='#ffe36e'; ctx.fillText('¡SÚPER VELOCIDAD! '+Math.ceil(J.burger/60), W-16, 24); }
  else if (muertes>0){ ctx.fillStyle='#888'; ctx.fillText('caídas: '+muertes+' (¡no pasa nada!)', W-16, 24); }
  ctx.font='12px monospace'; ctx.fillStyle='#8ecbff';
  let comp = 'Penny·Sheldon';
  if (J.cucu) comp += '·Cucú';
  if (J.luca) comp += '·Luca';
  if (J.salomon) comp += '·Salomón';
  if (J.cargaSanti) comp += '·Santi';
  if (J.abu) comp += '·Abu';
  if (J.mama) comp += '·Mamá';
  if (J.papa) comp += '·Papá';
  if (J.tiofran) comp += '·T.Fran💨';
  if (J.yanny) comp += '·T.Yanny';
  if (J.nacho) comp += '·T.Nacho';
  if (J.beto) comp += '·T.Beto';
  if (J.giuliana) comp += '·T.Giuli';
  if (J.perro>0) comp += '·🐕ROJO';
  if (J.superSalto) comp += '·🦘';
  ctx.fillText(comp, W-16, 48);
  ctx.textAlign='left';
}

function dibBurbujas(){
  ctx.font='bold 15px monospace';
  for(const b of burbujas){
    let bx, by;
    if (b.quien==='TJ' && evTioJuan){ bx = evTioJuan.x-camX+16; by = evTioJuan.y+HUD_H-18; }
    else { bx = J.x-camX+J.w/2; by = J.y+HUD_H-16; }
    const wtx = ctx.measureText(b.txt).width;
    const a = Math.min(1, b.t/25);
    ctx.globalAlpha = a;
    ctx.fillStyle='#fff';
    const rx = Math.min(Math.max(bx-wtx/2-8, 4), VW-wtx-20);
    ctx.fillRect(rx, by-24, wtx+16, 26);
    ctx.beginPath(); ctx.moveTo(bx-6,by+2); ctx.lineTo(bx+6,by+2); ctx.lineTo(bx,by+9); ctx.fill();
    ctx.fillStyle='#111'; ctx.fillText(b.txt, rx+8, by-6);
    ctx.globalAlpha = 1;
  }
}

function draw(){
  ctx.clearRect(0,0,W,H);
  if (mjActivo()){ MJ.draw(); return; }
  if (estado==='menu'){ dibMenu(); return; }
  if (estado==='mapa'){ dibMapa(); return; }
  if (estado==='fin'){ dibFin(); return; }
  if (estado==='kartPista'){ dibSelPista(); dibFXFinales(); return; }
  if (estado==='kart'){ drawKart(); return; }
  if (estado==='kartFin'){ drawKartFin(); return; }
  /* el mundo se dibuja con zoom (más grande); el HUD va aparte sin zoom */
  ctx.save();
  if (shake>0) ctx.translate((Math.random()-0.5)*shake*2, (Math.random()-0.5)*shake*2);
  ctx.translate(0, H*(1-ZOOM)); ctx.scale(ZOOM, ZOOM);
  dibFondo();

  /* tiles visibles */
  const tx0 = Math.floor(camX/TILE), tx1 = Math.min(LEVW-1, tx0 + Math.ceil(VW/TILE)+1);
  for(let ty=0;ty<ROWS;ty++) for(let tx=tx0;tx<=tx1;tx++) dibTile(tx,ty);

  /* NPCs */
  for(const n of npcs){
    if (!n.activo) continue;
    const nx = n.x-camX; if (nx<-100||nx>VW+100) continue;
    if (n.tipo!=='meta') sombra(nx+16, 13*TILE+HUD_H-2, n.tipo==='bowser'?34:20);
    if (n.tipo==='santi') dibSanti(nx, n.y+HUD_H, n.t);
    else if (n.tipo==='huevo'){ dibHuevo(nx, n.y+HUD_H, n.t); letrero(nx+15, n.y+HUD_H-48, 'HUEVO DE GEORGIE', '#ff9ed6'); }
    else if (n.tipo==='abu'){ dibAbu(nx, n.y+HUD_H, n.vx>0?1:-1, n.t, true); if(!n.huye) letrero(nx+14, n.y+HUD_H-26, 'ABU', '#d9b3ff'); }
    else if (n.tipo==='luca'){ dibLuca(nx, n.y+HUD_H, n.t); letrero(nx+12, n.y+HUD_H-20, 'LUCA', '#7dffa0'); }
    else if (n.tipo==='salomon'){ dibSalomon(nx, n.y+HUD_H, n.t); letrero(nx+12, n.y+HUD_H-20, 'SALOMÓN', '#ffd27d'); }
    else if (n.tipo==='tiofran'){ dibTioFran(nx, n.y+HUD_H, n.t, n.hecho); letrero(nx+14, n.y+HUD_H-24, 'TÍO FRAN', '#b8e986'); }
    else if (n.tipo==='mama'){ dibMama(nx, n.y+HUD_H, n.t); letrero(nx+14, n.y+HUD_H-24, 'MAMÁ', '#ff9ed6'); }
    else if (n.tipo==='papa'){ dibPapa(nx, n.y+HUD_H, n.t); letrero(nx+14, n.y+HUD_H-24, 'PAPÁ', '#9ecbff'); }
    else if (n.tipo==='yanny'){ dibYanny(nx, n.y+HUD_H, n.t); letrero(nx+14, n.y+HUD_H-24, 'TÍA YANNY', '#e8b0ff'); }
    else if (n.tipo==='avion'){ dibAvion(nx, n.y+HUD_H, 1, n.t); letrero(nx+26, n.y+HUD_H-24, '¡AVIÓN!', '#9ecbff'); }
    else if (n.tipo==='barco'){ dibBarco(nx, n.y+HUD_H, n.t); letrero(nx+30, n.y+HUD_H-40, '¡BARCO!', '#ffe36e'); }
    else if (n.tipo==='nacho'){ dibNacho(nx, n.y+HUD_H, n.t); letrero(nx+14, n.y+HUD_H-24, 'TÍO NACHO', '#ffe36e'); }
    else if (n.tipo==='beto'){ dibBeto(nx, n.y+HUD_H, n.t); letrero(nx+14, n.y+HUD_H-24, 'TÍO BETO', '#7dffa0'); }
    else if (n.tipo==='giuliana'){ dibGiuliana(nx, n.y+HUD_H, n.t); letrero(nx+14, n.y+HUD_H-24, 'TÍA GIULIANA', '#ffb27d'); }
    else if (n.tipo==='bowser'){
      /* castillo de fondo */
      rect(nx+90, n.y+HUD_H-140, 150, 204, '#3a3a52');
      rect(nx+90, n.y+HUD_H-140, 150, 8, '#2a2a3e');
      for(let i2=0;i2<5;i2++) rect(nx+94+i2*30, n.y+HUD_H-156, 18, 18, '#3a3a52');
      rect(nx+140, n.y+HUD_H-60, 44, 124, '#20202e');
      dibBowser(nx, n.y+HUD_H, n.t, n.golpe||0);
      letrero(nx+28, n.y+HUD_H-40, '¡BOWSER! ('+n.hp+'♥)', '#ff7070');
    }
    else if (n.tipo==='princesa'){
      dibPrincesa(nx, n.y+HUD_H, n.t, n.rescatada);
      letrero(nx+15, n.y+HUD_H-46, 'MAMÁ PRINCESA', '#ff9ed6');
    }
    else if (n.tipo==='meta'){
      /* tarjeta de meta estilo SMB3 */
      const my = n.y+HUD_H;
      rect(nx+14,my,6,13*TILE-n.y,'#222');
      rect(nx-6,my+10+Math.sin(n.t/20)*6,46,46,'#fff');
      ctx.strokeStyle='#d82800'; ctx.lineWidth=3; ctx.strokeRect(nx-6,my+10+Math.sin(n.t/20)*6,46,46);
      ctx.font='26px monospace'; ctx.fillStyle='#d82800';
      const simb=['★','♥','🍄'][ (n.t>>5)%3 ]||'★';
      ctx.fillText(simb, nx+4, my+44+Math.sin(n.t/20)*6);
    }
  }

  /* items */
  for(const it of items){
    const x=it.x-camX, y=it.y+HUD_H;
    if (it.tipo!=='estrella') sombra(x+13, y+30, 13);
    if (it.tipo==='hongo'){
      rect(x+2,y+10,22,14,'#ffc8a0');
      rect(x,y,26,12,'#d82800'); rect(x+4,y+2,6,5,'#fff'); rect(x+16,y+2,6,5,'#fff');
      rect(x+7,y+14,3,4,'#222'); rect(x+16,y+14,3,4,'#222');
    } else if (it.tipo==='flor'){
      rect(x+10,y+12,6,14,'#2a8a2a');
      rect(x+4,y,18,12,'#d82800'); rect(x+8,y+3,10,6,'#ffe36e');
    } else if (it.tipo==='hueso'){
      rect(x+6,y+10,14,5,'#fff');
      for(const [hx2,hy2] of [[3,7],[3,14],[19,7],[19,14]]){
        ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x+hx2+2,y+hy2+2,4,0,Math.PI*2); ctx.fill();
      }
    } else if (it.tipo==='estrella'){
      /* halo brillante para que se vea desde lejos */
      ctx.globalAlpha = 0.35 + Math.sin(tick/6)*0.15;
      ctx.fillStyle = '#ffe36e';
      ctx.beginPath(); ctx.arc(x+13, y+13, 24, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = `hsl(${(tick*10)%360},90%,60%)`;
      ctx.font='34px monospace'; ctx.fillText('★', x-3, y+26);
    }
  }

  /* enemigos (con sombra suave y volumen) */
  for(const e of enemigos){
    if(!e.vivo) continue;
    const ex=e.x-camX, ey=e.y+HUD_H;
    sombra(ex+13, ey+e.h+3, 16);
    if(e.tipo==='goomba') dibGoomba(ex,ey,tick); else dibKoopa(ex,ey,e,tick);
  }

  /* bolas de fuego */
  for(const f of fuegos){
    ctx.fillStyle=(tick>>2)%2?'#ff5000':'#ffe36e';
    ctx.beginPath(); ctx.arc(f.x-camX+6, f.y+HUD_H+6, 6, 0, Math.PI*2); ctx.fill();
  }

  /* seguidores: perrito negro, perrito marrón, Cucú */
  const seg = [[14,'#222'],[30,'#8a5a2a']];
  for(const [d,color] of seg){
    const hpos = historia[Math.min(d,historia.length-1)];
    if (hpos) dibPerro(hpos.x-camX-8, hpos.y+HUD_H+4, hpos.cara, color, tick+d);
  }
  if (J.cucu){
    const hpos = historia[Math.min(46,historia.length-1)];
    if (hpos) dibCucu(hpos.x-camX, hpos.y+HUD_H-2, hpos.cara, tick);
  }
  if (J.luca){
    const hpos = historia[Math.min(60,historia.length-1)];
    if (hpos) dibLuca(hpos.x-camX, hpos.y+HUD_H-8, tick, hpos.cara);
  }
  if (J.salomon){
    const hpos = historia[Math.min(74,historia.length-1)];
    if (hpos) dibSalomon(hpos.x-camX, hpos.y+HUD_H-8, tick, hpos.cara);
  }
  if (J.abu){
    const hpos = historia[Math.min(88,historia.length-1)];
    if (hpos) dibAbu(hpos.x-camX, hpos.y+HUD_H-20, hpos.cara, tick, true);
  }
  if (J.mama){
    const hpos = historia[Math.min(102,historia.length-1)];
    if (hpos) dibMama(hpos.x-camX, hpos.y+HUD_H-20, tick);
  }
  if (J.papa){
    const hpos = historia[Math.min(116,historia.length-1)];
    if (hpos) dibPapa(hpos.x-camX, hpos.y+HUD_H-20, tick);
  }
  if (J.tiofran){
    const hpos = historia[Math.min(130,historia.length-1)];
    if (hpos) dibTioFran(hpos.x-camX, hpos.y+HUD_H-20, tick, true);
  }
  if (J.yanny){
    const hpos = historia[Math.min(144,historia.length-1)];
    if (hpos) dibYanny(hpos.x-camX, hpos.y+HUD_H-18, tick);
  }
  if (J.nacho){
    const hpos = historia[Math.min(158,historia.length-1)];
    if (hpos) dibNacho(hpos.x-camX, hpos.y+HUD_H-18, tick);
  }
  if (J.beto){
    const hpos = historia[Math.min(172,historia.length-1)];
    if (hpos) dibBeto(hpos.x-camX, hpos.y+HUD_H-17, tick);
  }
  if (J.giuliana){
    const hpos = historia[Math.min(186,historia.length-1)];
    if (hpos) dibGiuliana(hpos.x-camX, hpos.y+HUD_H-18, tick);
  }
  /* Tío Juan siempre acompaña volando */
  if (!evTioJuan && historia.length>2){
    const hj = historia[Math.min(24,historia.length-1)];
    dibTioJuan(hj.x-camX-10, hj.y+HUD_H-128+Math.sin(tick/14)*7, tick);
  }

  /* sombra suave bajo Fernando (toque moderno) */
  if (J.muerto===0){
    let sy = Math.floor((J.y+altoJ())/TILE);
    const stx = Math.floor((J.x+J.w/2)/TILE);
    while(sy<14 && !esSolido(getT(stx,sy))) sy++;
    sombra(J.x-camX+J.w/2, sy*TILE+HUD_H-2, 17);
  }

  /* jugador (con Abu debajo si va montado) */
  if (J.muerto>0){
    ctx.save(); ctx.translate(J.x-camX+12, J.y+HUD_H+14); ctx.rotate(Math.PI);
    ctx.translate(-12,-14); dibFernando(0,0,1,J.grande,false,false,tick); ctx.restore();
  } else {
    if (J.enAvion>0) dibAvion(J.x-camX-16, J.y+HUD_H+altoJ()-14, J.cara, tick);
    else if (J.enBarco) dibBarco(J.x-camX-18, J.y+HUD_H+altoJ()-14, tick);
    /* squash & stretch alrededor de los pies */
    const pieX = J.x-camX+J.w/2, pieY = J.y+HUD_H+altoJ();
    ctx.save(); ctx.translate(pieX, pieY); ctx.scale(J.escX, J.escY); ctx.translate(-pieX, -pieY);
    if (J.perro>0){
      /* ¡Fernando convertido en perrito rojo grande! */
      ctx.save(); ctx.translate(J.x-camX-8, J.y+HUD_H+altoJ()-36);
      ctx.scale(1.7,1.7);
      if (!((J.invul>0) && (tick>>2)%2)) dibPerroSolo('#d82800');
      ctx.restore();
    } else {
      dibFernando(J.x-camX, J.y+HUD_H, J.cara, J.grande, J.fuego, Math.abs(J.vx)>0.5&&J.enSuelo, tick);
    }
    ctx.restore();
  }

  /* Tío Juan */
  if (evTioJuan){
    dibTioJuan(evTioJuan.x-camX, evTioJuan.y+HUD_H, tick);
    if (evTioJuan.burger) dibBurger(evTioJuan.burger.x-camX, evTioJuan.burger.y+HUD_H);
  }

  /* partículas */
  for(const p of parts){
    const x=p.x-camX, y=p.y+HUD_H;
    if (p.tipo==='moneda'){ rect(x,y,14,18,'#f8b800'); rect(x+3,y+3,8,12,'#ffe36e'); }
    else if (p.tipo==='ladrillo') rect(x,y,10,8,'#e07020');
    else if (p.tipo==='cascara'){ ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fill(); }
    else if (p.tipo==='puntos'){ ctx.fillStyle='#fff'; ctx.font='bold 13px monospace'; ctx.fillText(p.txt,x,y); }
    else if (p.tipo==='estrellita'){ ctx.fillStyle='#ffe36e'; ctx.font='16px monospace'; ctx.fillText('✦',x,y); }
    else if (p.tipo==='pedo'){ ctx.globalAlpha=Math.min(1,p.t/30); ctx.fillStyle='#a8d848';
      ctx.beginPath(); ctx.arc(x,y,6+(60-p.t)*0.3,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; }
    else if (p.tipo==='corazon'){ ctx.fillStyle='#ff5a8a'; ctx.font='16px monospace'; ctx.fillText('♥',x,y); }
    else if (p.tipo==='polvo'){
      ctx.globalAlpha=Math.min(1,p.t/12)*0.7; ctx.fillStyle='#d8c8a8';
      ctx.beginPath(); ctx.arc(x,y,3+(22-p.t)*0.18,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    }
    else if (p.tipo==='destello'){
      ctx.globalAlpha=p.t/22; ctx.strokeStyle='#fff'; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.arc(x,y,(22-p.t)*1.6,0,Math.PI*2); ctx.stroke(); ctx.globalAlpha=1;
    }
    else if (p.tipo==='estela'){
      ctx.globalAlpha=(p.t/12)*0.3; ctx.fillStyle=p.color||'#ffe36e';
      ctx.beginPath(); ctx.roundRect(x, y, 24, p.alto||28, 8); ctx.fill(); ctx.globalAlpha=1;
    }
    else if (p.tipo==='hoja'||p.tipo==='petalo'){
      ctx.globalAlpha=Math.min(1,p.t/40)*0.9; ctx.fillStyle=p.color||'#8bc34a';
      ctx.save(); ctx.translate(x,y); ctx.rotate(Math.sin(p.t/9)*0.8);
      ctx.beginPath(); ctx.ellipse(0,0,5,2.6,0,0,Math.PI*2); ctx.fill(); ctx.restore(); ctx.globalAlpha=1;
    }
    else if (p.tipo==='arena'){
      ctx.globalAlpha=Math.min(1,p.t/30)*0.35; ctx.fillStyle='#f8d878';
      ctx.fillRect(x,y,10,2); ctx.globalAlpha=1;
    }
    else if (p.tipo==='luciernaga'){
      ctx.globalAlpha=0.4+Math.sin(p.t/7)*0.35; ctx.fillStyle='#ffe98a';
      ctx.beginPath(); ctx.arc(x,y,2.6,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    }
    else if (p.tipo==='estrellaAmb'){
      ctx.globalAlpha=Math.sin(Math.min(1,p.t/110)*Math.PI)*0.9; ctx.fillStyle='#fff';
      ctx.font='10px monospace'; ctx.fillText('✦',x,y); ctx.globalAlpha=1;
    }
    else if (p.tipo==='burbujaAgua'){
      ctx.strokeStyle='rgba(220,240,255,0.7)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.arc(x,y,3+(80-p.t)*0.05,0,Math.PI*2); ctx.stroke();
    }
  }

  /* velo azul del mundo marino */
  if (infoNivel && infoNivel.agua){
    ctx.fillStyle='rgba(30,110,200,0.16)';
    ctx.fillRect(0,HUD_H-70,W,H);
  }

  dibBurbujas();
  ctx.restore();
  dibHUD();

  /* cartel de fin de nivel (entra con rebote) */
  if (estado==='meta' && secMeta>40){
    const k = Math.min(1,(secMeta-40)/18), c1=1.70158, c3=c1+1;
    const e = 1 + c3*Math.pow(k-1,3) + c1*Math.pow(k-1,2);
    ctx.save(); ctx.translate(W/2, 170); ctx.scale(e, e); ctx.translate(-W/2, -170);
    ctx.fillStyle='rgba(0,0,0,0.62)';
    ctx.beginPath(); ctx.roundRect(W/2-270, 108, 540, 124, 18); ctx.fill();
    ctx.strokeStyle='#ffe36e'; ctx.lineWidth=2; ctx.stroke();
    ctx.fillStyle='#fff'; ctx.font='bold 30px monospace'; ctx.textAlign='center';
    ctx.fillText('¡NIVEL COMPLETADO!', W/2, 155);
    ctx.font='18px monospace'; ctx.fillStyle='#ffe36e';
    ctx.fillText('Fernando: «Te amo tío Juan, yo soy tu pichunguito»', W/2, 190);
    if (secMeta>200){ ctx.fillStyle='#8ecbff'; ctx.fillText('Tío Juan: «¡Muy bien, mi pichunguito!»', W/2, 215); }
    ctx.textAlign='left';
    ctx.restore();
  }
  dibFXFinales();
}

/* ---- viñeta, scanlines CRT sutiles y cortina circular ---- */
let vinetaG = null;
function dibFXFinales(){
  try{
  if (CAL.crt){
    if (!vinetaG){
      vinetaG = ctx.createRadialGradient(W/2, H/2, H*0.45, W/2, H/2, H*0.85);
      vinetaG.addColorStop(0,'rgba(0,0,0,0)'); vinetaG.addColorStop(1,'rgba(0,0,0,0.22)');
    }
    ctx.fillStyle=vinetaG; ctx.fillRect(0,0,W,H);
    ctx.globalAlpha=0.045; ctx.fillStyle='#000';
    for(let y2=HUD_H; y2<H; y2+=6) ctx.fillRect(0,y2,W,1);
    ctx.globalAlpha=1;
  }
  if (cortina>0){
    cortina--;
    const r = (1-cortina/45)*Math.hypot(W,H)*0.72;
    ctx.fillStyle='#000';
    ctx.beginPath();
    ctx.rect(0,0,W,H);
    ctx.arc(W/2, H/2, Math.max(r,0.1), 0, Math.PI*2, true);
    ctx.fill('evenodd');
  }
  }catch(e){}
}

function dibMenu(){
  if (imgLista(fondosImg.titulo)){
    const im = fondosImg.titulo;
    const ancho = Math.max(W, H * im.naturalWidth / im.naturalHeight);
    ctx.drawImage(im, (W-ancho)/2, 0, ancho, Math.max(H, ancho*im.naturalHeight/im.naturalWidth));
    const velo = ctx.createLinearGradient(0,0,0,H);
    velo.addColorStop(0,'rgba(5,10,40,0.72)'); velo.addColorStop(0.45,'rgba(5,10,40,0.30)');
    velo.addColorStop(1,'rgba(5,10,40,0.72)');
    ctx.fillStyle=velo; ctx.fillRect(0,0,W,H);
  } else {
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#0a1a4a'); g.addColorStop(1,'#5c94fc');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  }
  ctx.textAlign='center';
  ctx.fillStyle='#000'; ctx.font='bold 74px monospace';
  ctx.fillText('FERNANDO BROS', W/2+5, 145);
  ctx.fillStyle='#f8b800';
  ctx.fillText('FERNANDO BROS', W/2, 140);
  ctx.fillStyle='#fff'; ctx.font='bold 22px monospace';
  ctx.fillText('¡La aventura del pichunguito de tío Juan!', W/2, 190);
  /* elenco */
  const cy = 300;
  dibFernandoMenu(W/2-260, cy-30);
  dibPerroMenu(W/2-180, cy, '#222'); dibPerroMenu(W/2-120, cy, '#8a5a2a');
  dibSanti(W/2-50, cy-10, tick);
  ctx.save(); ctx.translate(W/2+20, cy-40); ctx.scale(1.2,1.2); dibAbuMenu(); ctx.restore();
  dibCucu(W/2+90, cy-15, 1, tick);
  ctx.save(); ctx.translate(W/2+160, cy-45); ctx.scale(1.3,1.3); dibTioJuan(0,0,tick); ctx.restore();
  dibBurger(W/2+240, cy-15);
  ctx.fillStyle='#ffe36e'; ctx.font='16px monospace';
  ctx.fillText('Fernando · Penny · Sheldon · Santi · Abu · Cucú · Tío Juan · 🍔', W/2, cy+70);
  ctx.fillStyle='#8ecbff';
  ctx.fillText('¡Nuevos! Luca · Salomón · Tío Fran 💨 · Mamá 💋 · Papá 🦘', W/2, cy+94);
  ctx.fillStyle='#fff'; ctx.font='bold 24px monospace';
  if ((tick>>4)%2===0) ctx.fillText('PULSA ENTER (o toca) PARA ELEGIR MUNDO', W/2, 440);
  ctx.font='15px monospace'; ctx.fillStyle='#bcd6ff';
  ctx.fillText('← → mover · MAYÚS/X correr y fuego · ESPACIO/Z saltar · ↓ bajarse de Abu', W/2, 480);
  ctx.fillText('VIDAS INFINITAS ∞ — ¡aquí nunca se pierde!', W/2, 508);
  ctx.fillStyle='#7dffa0';
  ctx.fillText('🏁 Al ganar el mundo 8: ¡FERNANDO KART! (o pulsa K / botón B para ir directo)', W/2, 486);
  ctx.fillStyle='#ffe36e';
  ctx.fillText('¿No escuchas las voces? Quita el modo silencio del teléfono y sube el volumen', W/2, 530);
  ctx.textAlign='left';
  ctx.fillStyle='#7fa8e0'; ctx.font='12px monospace';
  ctx.fillText('v25', W-30, 18);
}
function dibFernandoMenu(x,y){ ctx.save(); ctx.translate(x,y); ctx.scale(1.6,1.6); dibFernandoSolo(); ctx.restore(); }
function dibFernandoSolo(){
  rect(2,0,20,7,'#d82800'); rect(14,6,12,3,'#d82800');
  rect(4,7,16,10,'#ffc8a0'); rect(15,9,3,2,'#222'); rect(2,7,3,5,'#5a3418');
  rect(3,17,18,10,'#d82800'); rect(5,24,14,10,'#2038ec');
  rect(4,34,7,6,'#6b3410'); rect(13,34,7,6,'#6b3410');
}
function dibPerroMenu(x,y,c){ ctx.save(); ctx.translate(x,y); ctx.scale(1.4,1.4); ctx.translate(-13,-10); dibPerroSolo(c); ctx.restore(); }
function dibPerroSolo(color){
  rect(2,8,18,10,color); rect(16,2,9,8,color);
  rect(17,0,3,4,color); rect(22,0,3,4,color);
  rect(23,4,2,2,'#fff'); rect(25,7,2,2,'#3b241a');
  rect(4,16,3,5,color); rect(14,16,3,5,color); rect(-2,6,5,3,color);
}
function dibAbuMenu(){
  rect(6,4,16,12,'#ffc8a0'); rect(6,0,16,5,'#cfcfcf'); rect(10,-4,8,5,'#cfcfcf');
  rect(16,7,3,2,'#222'); rect(4,16,20,22,'#7b4fa8');
  rect(2,20,4,10,'#7b4fa8'); rect(22,20,4,10,'#7b4fa8');
  rect(7,38,5,10,'#ffc8a0'); rect(16,38,5,10,'#ffc8a0');
  rect(6,46,7,3,'#3b241a'); rect(15,46,7,3,'#3b241a');
}
function dibFin(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#ffb0d0'); g.addColorStop(1,'#5c94fc');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.textAlign='center';
  ctx.fillStyle='#d82800'; ctx.font='bold 60px monospace';
  ctx.fillText('¡GANASTE!', W/2, 130);
  ctx.fillStyle='#222'; ctx.font='bold 24px monospace';
  ctx.fillText('«Te amo tío Juan, yo soy tu pichunguito»', W/2, 180);
  ctx.font='20px monospace';
  ctx.fillText('— Fernando, con Penny, Sheldon, Santi, Cucú y Abu', W/2, 215);
  const cy=330;
  ctx.save(); ctx.translate(W/2-40, cy-90); ctx.scale(1.6,1.6); dibTioJuan(0,0,tick); ctx.restore();
  dibFernandoMenu(W/2-140, cy-60);
  dibPerroMenu(W/2-200, cy, '#222'); dibPerroMenu(W/2-250, cy, '#8a5a2a');
  dibSanti(W/2+70, cy-40, tick);
  dibCucu(W/2+130, cy-40, -1, tick);
  ctx.save(); ctx.translate(W/2+190, cy-75); ctx.scale(1.2,1.2); dibAbuMenu(); ctx.restore();
  dibBurger(W/2-10, cy+10);
  ctx.fillStyle='#fff'; ctx.font='bold 22px monospace';
  ctx.fillText('PUNTOS: '+puntos+'   MONEDAS: '+monedas, W/2, 440);
  if ((tick>>4)%2===0) ctx.fillText('PULSA ENTER PARA VOLVER AL MENÚ', W/2, 490);
  ctx.textAlign='left';
}


/* ============================================================
   FERNANDO KART — ¡carrera con todos los personajes!
   ============================================================ */
const PISTAS = [
  { nombre:'CIRCUITO PICHUNGUITO', emoji:'🌄', cielo:['#2a6ad0','#aadcf8'],
    suelo:['#3fae2f','#379d28'], fondo:[63,174,47], kx:1750, ky:1250,
    pts:[[300,300],[700,210],[1120,250],[1430,420],[1520,720],[1330,960],[930,1040],[520,990],[240,800],[180,520]] },
  { nombre:'PLAYA DE PENNY', emoji:'🏖️', cielo:['#1e8fd0','#bfeaff'],
    suelo:['#e8cf8a','#dcbf72'], fondo:[232,207,138], kx:1900, ky:1300,
    pts:[[320,260],[820,200],[1300,300],[1620,560],[1660,900],[1380,1120],[900,1180],[480,1080],[220,840],[200,520]] },
  { nombre:'CASTILLO DE BOWSER', emoji:'🐢', cielo:['#241436','#6a4a8a'],
    suelo:['#4a4458','#413b4e'], fondo:[74,68,88], kx:1700, ky:1400,
    pts:[[280,300],[760,240],[1180,340],[1450,600],[1380,900],[1000,1080],[620,1160],[300,1000],[200,700],[190,480]] },
  { nombre:'CUEVA DE SHELDON', emoji:'🦇', cielo:['#0e0e20','#3a3a5c'],
    suelo:['#5a5a72','#4e4e64'], fondo:[90,90,114], kx:1650, ky:1500,
    pts:[[300,260],[700,220],[1050,380],[1300,660],[1420,980],[1150,1260],[720,1340],[380,1160],[220,860],[210,520]] },
  { nombre:'NUBES DE CUCÚ', emoji:'☁️', cielo:['#3a8fe0','#eaf6ff'],
    suelo:['#f0f4ff','#dde6f8'], fondo:[240,244,255], kx:1900, ky:1200,
    pts:[[340,240],[880,180],[1380,260],[1680,480],[1700,800],[1400,1040],[900,1120],[460,1020],[230,760],[220,460]] },
  { nombre:'DESIERTO DE ABU', emoji:'🌵', cielo:['#e08a3a','#ffd9a0'],
    suelo:['#e8b45a','#d9a44a'], fondo:[232,180,90], kx:1800, ky:1350,
    pts:[[300,280],[820,220],[1300,320],[1600,580],[1580,920],[1240,1180],[780,1240],[400,1080],[220,800],[200,500]] },
];
let pistaIdx = 0, PISTA = PISTAS[0].pts;
let NWP = PISTA.length, MUNDO_KX = PISTAS[0].kx, MUNDO_KY = PISTAS[0].ky;
const ANCHO_PISTA = 110, VUELTAS = 3;
function cargarPista(i){
  pistaIdx = i;
  const p = PISTAS[i];
  PISTA = p.pts; NWP = PISTA.length; MUNDO_KX = p.kx; MUNDO_KY = p.ky;
  pistaData = null;                    // obliga a redibujar la textura
  drawKart.gcielo = null; drawKart.gn = null; drawKart.gsol = null; drawKart.gbruma = null;
}
let corredores = [], KJ = null, kartT = 0, resultadoKart = [];
/* poderes: caparazón de tortuga, estrella mágica y hamburguesa */
const PODERES = [
  {id:'tortuga', nombre:'CAPARAZÓN', emoji:'🐢', color:'#3aa030'},
  {id:'estrella', nombre:'ESTRELLA MÁGICA', emoji:'⭐', color:'#ffe36e'},
  {id:'burger', nombre:'HAMBURGUESA', emoji:'🍔', color:'#e8a33d'},
];
let cajasPoder = [], caparazones = [];
const KART_CHARS = [
  ['fernando','Fernando','#d82800'], ['penny','Penny','#222222'], ['sheldon','Sheldon','#8a5a2a'],
  ['cucu','Cucú','#ff6ec0'], ['luca','Luca','#2a9c3a'], ['salomon','Salomón','#d86a28'],
  ['tiojuan','Tío Juan','#1560d0'], ['nacho','Tío Nacho','#e8a33d'], ['yanny','Tía Yanny','#b05ad0'],
  ['tiofran','Tío Fran','#8a6a3a'], ['romulo','Rómulo','#7a7a8a'],
];
let selPista = 0;
function iniciarKart(){ estado='kartPista'; selPista = 0; cortina = 30; }
function cajasPista(){
  return PISTAS.map((p,i)=>({x:25+(i%3)*312, y:142+((i/3)|0)*192, w:290, h:176, idx:i, p}));
}
function dibSelPista(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#0a1a4a'); g.addColorStop(1,'#2a5aa8');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.textAlign='center';
  ctx.fillStyle='#f8b800'; ctx.font='bold 38px monospace';
  ctx.fillText('🏁 ELIGE TU PISTA 🏁', W/2, 68);
  ctx.font='14px monospace'; ctx.fillStyle='#bcd6ff';
  ctx.fillText('¡Recoge las cajas y usa el botón B para lanzar tu poder!', W/2, 96);
  for(const c of cajasPista()){
    const s = selPista===c.idx;
    ctx.fillStyle = c.p.cielo[0];
    ctx.beginPath(); ctx.roundRect(c.x,c.y,c.w,c.h,16); ctx.fill();
    ctx.lineWidth = s?6:3; ctx.strokeStyle = s?'#ffe36e':'rgba(255,255,255,0.45)'; ctx.stroke();
    if (s){ ctx.globalAlpha=0.3+Math.sin(tick/7)*0.2; ctx.lineWidth=12; ctx.stroke(); ctx.globalAlpha=1; }
    /* miniatura del trazado */
    ctx.strokeStyle=c.p.suelo[0]; ctx.lineWidth=13; ctx.lineJoin='round';
    ctx.beginPath();
    const e = 0.082, ox = c.x+c.w/2 - c.p.kx*e/2, oy = c.y+96 - c.p.ky*e/2;
    ctx.moveTo(ox+c.p.pts[0][0]*e, oy+c.p.pts[0][1]*e);
    for(let i=1;i<=c.p.pts.length;i++){ const q=c.p.pts[i%c.p.pts.length]; ctx.lineTo(ox+q[0]*e, oy+q[1]*e); }
    ctx.closePath(); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.85)'; ctx.lineWidth=3; ctx.stroke();
    ctx.font='26px monospace'; ctx.fillStyle='#fff';
    ctx.fillText(c.p.emoji, c.x+c.w/2, c.y+34);
    ctx.font='bold 14px monospace'; ctx.fillStyle='#ffe36e';
    ctx.fillText(c.p.nombre, c.x+c.w/2, c.y+c.h-14);
  }
  ctx.fillStyle='#fff'; ctx.font='bold 18px monospace';
  if ((tick>>4)%2===0) ctx.fillText('Toca una pista · flechas + ENTER · ESC vuelve', W/2, H-18);
  ctx.textAlign='left';
  ctx.fillStyle='#7fa8e0'; ctx.font='12px monospace';
  ctx.fillText('v25', W-34, 18);
}
function iniciarCarrera(idx){
  cargarPista(idx===undefined ? 0 : idx);
  estado='kart'; kartT=0; resultadoKart=[]; burbujas=[]; parts=[];
  const a0 = Math.atan2(PISTA[1][1]-PISTA[0][1], PISTA[1][0]-PISTA[0][0]);
  corredores = KART_CHARS.map(([tipo,nombre,color],i)=>({
    tipo, nombre, color,
    x: PISTA[0][0] - Math.cos(a0)*(30+Math.floor(i/3)*44) + Math.cos(a0+Math.PI/2)*((i%3)-1)*46,
    y: PISTA[0][1] - Math.sin(a0)*(30+Math.floor(i/3)*44) + Math.sin(a0+Math.PI/2)*((i%3)-1)*46,
    ang:a0, vel:0, wpi:1, vuelta:0, cd:0, turbo:0, turboCd:0, turboPrev:false,
    esJugador: tipo==='fernando',
    velBase: 3.9 + (i%5)*0.14 + (tipo==='romulo'?-0.4:0) + (tipo==='tiojuan'?0.25:0),
    claro: aclarar(color,0.45), oscuro: oscurecer(color,0.4),
    poder: null, estrella: 0, frenado: 0,
  }));
  KJ = corredores[0]; cortina = 45;
  /* cajas de poder repartidas por la pista */
  cajasPoder = []; caparazones = [];
  for(let i=0;i<NWP;i++){
    const [ax,ay] = PISTA[i], [bx,by] = PISTA[(i+1)%NWP];
    for(const t of [0.35, 0.7]){
      const cx2 = ax+(bx-ax)*t, cy2 = ay+(by-ay)*t;
      const ang = Math.atan2(by-ay, bx-ax) + Math.PI/2;
      for(const lado of [-45, 0, 45])
        cajasPoder.push({x:cx2+Math.cos(ang)*lado, y:cy2+Math.sin(ang)*lado, t:0, activa:true});
    }
  }
  if (!pistaData) prepararMode7();
  burbuja('¡Fernando Kart! ¡A correr, pichunguitos!');
  hablar('¡Fernando Kart! ¡A correr, pichunguitos!');
}
function usarPoder(c){
  const p = c.poder; c.poder = null;
  if (p==='tortuga'){
    caparazones.push({x:c.x + Math.cos(c.ang)*38, y:c.y + Math.sin(c.ang)*38,
                      ang:c.ang, wpi:c.wpi, t:420, de:c});
    if (c.esJugador){ sfx.fuego(); burbuja('¡Toma, pichungazo!'); }
  } else if (p==='estrella'){
    c.estrella = 330;
    if (c.esJugador){ sfx.poder(); burbuja('¡Estrella mágica!'); hablar('¡Toma, pichungazo!'); }
  } else if (p==='burger'){
    c.turbo = 90; c.turboCd = 0;
    if (c.esJugador){ sfx.poder(); burbuja('¡Qué rica hamburguesa!'); hablar('¡Qué rica hamburguesa!'); }
  }
}
function distPista(x,y){
  let m = 1e9;
  for(let i=0;i<NWP;i++){
    const [ax,ay]=PISTA[i], [bx,by]=PISTA[(i+1)%NWP];
    const dx=bx-ax, dy=by-ay, L2=dx*dx+dy*dy;
    let t=((x-ax)*dx+(y-ay)*dy)/L2; t=Math.max(0,Math.min(1,t));
    const ex=ax+dx*t-x, ey=ay+dy*t-y;
    m = Math.min(m, ex*ex+ey*ey);
  }
  return Math.sqrt(m);
}
function updateKart(){
  kartT++;
  for(const c of corredores){
    const enP = distPista(c.x,c.y) <= ANCHO_PISTA;
    if (c.esJugador){
      const girar = (izq()?-1:0)+(der()?1:0);
      c.ang += girar*0.052*(0.35+Math.min(c.vel/6,1));
      c.turboCd--;
      if (kSalto() && !c.turboPrev && c.turboCd<=0){ c.turbo=55; c.turboCd=260; sfx.fuego(); }
      c.turboPrev = kSalto();
      if (c.turbo>0) c.turbo--;
      const vmax = ((enP?6.3:2.3) + (c.turbo>0?2.6:0) + (c.estrella>0?2.2:0)) * (c.frenado>0?0.45:1);
      c.vel += (c.vel<vmax ? 0.09 : -0.18);
    } else {
      const t2 = PISTA[c.wpi%NWP];
      let d = Math.atan2(t2[1]-c.y, t2[0]-c.x) - c.ang;
      while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI;
      c.ang += Math.max(-0.06, Math.min(0.06, d));
      const vmax = ((enP ? c.velBase + Math.sin((kartT+c.x)/80)*0.3 : 2.2)
        + (c.turbo>0?2.4:0) + (c.estrella>0?2:0)) * (c.frenado>0?0.45:1);
      c.vel += (c.vel<vmax ? 0.08 : -0.12);
    }
    c.x += Math.cos(c.ang)*c.vel;
    c.y += Math.sin(c.ang)*c.vel;
    c.x = Math.max(20, Math.min(MUNDO_KX-20, c.x));
    c.y = Math.max(20, Math.min(MUNDO_KY-20, c.y));
    const wp = PISTA[c.wpi%NWP];
    if ((c.x-wp[0])**2 + (c.y-wp[1])**2 < (ANCHO_PISTA*1.5)**2) c.wpi++;
    c.vuelta = Math.floor((c.wpi-1)/NWP);
    c.cd--;
  }
  /* recoger cajas de poder */
  for(const cp of cajasPoder){
    cp.t++;
    if (!cp.activa){ if (cp.t - cp.tomada > 420) cp.activa = true; continue; }
    for(const c of corredores){
      if ((c.x-cp.x)**2 + (c.y-cp.y)**2 < 40*40){
        cp.activa = false; cp.tomada = cp.t;
        if (!c.poder){
          c.poder = PODERES[(Math.random()*PODERES.length)|0].id;
          if (c.esJugador) sfx.moneda();
        }
        break;
      }
    }
  }
  /* usar el poder (jugador con el botón B / MAYÚS) */
  if (KJ.poder && kCorre() && !KJ.poderPrev){
    usarPoder(KJ);
  }
  KJ.poderPrev = kCorre();
  /* la máquina usa su poder al rato de tenerlo */
  for(const c of corredores){
    if (!c.esJugador && c.poder && kartT % 90 === (c.wpi*7)%90) usarPoder(c);
    if (c.estrella > 0) c.estrella--;
    if (c.frenado > 0){ c.frenado--; c.vel *= 0.9; }
  }
  /* caparazones en vuelo */
  for(const cap of caparazones){
    cap.t--;
    const obj = PISTA[cap.wpi % NWP];
    let d = Math.atan2(obj[1]-cap.y, obj[0]-cap.x) - cap.ang;
    while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI;
    cap.ang += Math.max(-0.08, Math.min(0.08, d));
    cap.x += Math.cos(cap.ang)*8.5; cap.y += Math.sin(cap.ang)*8.5;
    if ((cap.x-obj[0])**2 + (cap.y-obj[1])**2 < 120*120) cap.wpi++;
    for(const c of corredores){
      if (c === cap.de || c.estrella>0) continue;
      if ((c.x-cap.x)**2 + (c.y-cap.y)**2 < 34*34){
        cap.t = 0; c.frenado = 70; c.vel *= 0.35;
        if (c.esJugador){ sfx.dano(); sacudir(5); }
        else if (cap.de.esJugador){ puntos += 300; sfx.pisoton(); }
        for(let i=0;i<6;i++) parts.push({tipo:'estrellita', x:c.x, y:c.y, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*3, t:30});
      }
    }
  }
  caparazones = caparazones.filter(c=>c.t>0);
  /* la estrella mágica arrolla a quien toque */
  for(const c of corredores){
    if (c.estrella<=0) continue;
    for(const o of corredores){
      if (o===c || o.estrella>0) continue;
      if ((o.x-c.x)**2 + (o.y-c.y)**2 < 40*40){
        o.frenado = 60; o.vel *= 0.4;
        if (c.esJugador) puntos += 200;
      }
    }
  }
  /* choques suaves entre karts */
  for(let i=0;i<corredores.length;i++) for(let j=i+1;j<corredores.length;j++){
    const a=corredores[i], b=corredores[j];
    const dx=b.x-a.x, dy=b.y-a.y, d2=dx*dx+dy*dy;
    if (d2>0.01 && d2<34*34){ const d=Math.sqrt(d2), p=(34-d)/2;
      a.x-=dx/d*p; a.y-=dy/d*p; b.x+=dx/d*p; b.y+=dy/d*p; }
  }
  /* eventos al pasar cerca de cada personaje */
  for(const c of corredores){
    if (c.esJugador) continue;
    if (c.tipo==='romulo' && kartT%420===200){
      sfx.eructo();
      for(let i=0;i<5;i++) parts.push({tipo:'pedo', x:c.x+(Math.random()-0.5)*20, y:c.y-14, vx:0, vy:-1-Math.random(), t:45});
    }
    const d2=(c.x-KJ.x)**2+(c.y-KJ.y)**2;
    if (d2 < 95*95 && c.cd<=0){
      if (c.tipo==='tiofran'){
        c.cd=600; sfx.pedo(); puntos+=100;
        for(let i=0;i<10;i++) parts.push({tipo:'pedo', x:c.x+(Math.random()-0.5)*26, y:c.y, vx:(Math.random()-0.5)*2, vy:-1-Math.random()*2, t:60});
        burbuja('¡Qué pedo tan podrido, tío Fran!');
        hablar('¡Qué pedo tan podrido, tío Fran!');
      } else if (c.tipo==='tiojuan'){
        c.cd=700;
        burbuja('Eres mi pichunguito','TJ');
        hablar('Eres mi pichunguito');
      } else if (c.tipo==='nacho'){
        c.cd=800;
        burbuja('¡Épale! ¡Aquí viene tío Nacho!');
        hablar('¡Épale! ¡Aquí viene tío Nacho!');
      } else if (c.tipo==='yanny'){
        c.cd=800;
        burbuja('¡Hola mi amor! ¡Soy tía Yanny!');
        hablar('¡Hola mi amor! ¡Soy tía Yanny!');
      } else if (c.tipo==='romulo'){
        c.cd=700; sfx.eructo();
        burbuja('¡Brrrp! ¡Qué rica cerveza! ¡Ay, qué pena!');
        hablar('¡Brrrp! ¡Qué rica cerveza! ¡Ay, qué pena!');
      }
    }
  }
  actualizarExtras();
  if (KJ.vuelta >= VUELTAS){
    resultadoKart = [...corredores].sort((a,b)=>b.wpi-a.wpi);
    estado='kartFin'; sfx.meta();
    const pos = resultadoKart.indexOf(KJ)+1;
    hablar(pos===1 ? '¡Gané! ¡Soy el pichunguito campeón!' : '¡Qué divertido! ¡Otra vez, otra vez!');
  }
}
/* --- Vista en primera persona estilo Super Mario Kart (Mode 7) --- */
const B3W=480, B3H=270, B3HOR=105, CAM_H=34, CAM_FX=150, PC_S=1, ESC3=2;
let kartRoll = 0;
function oscurecer(hex, f){
  const n = parseInt(hex.slice(1),16), r=n>>16, g=(n>>8)&255, b=n&255;
  const m = v => Math.round(v*(1-f));
  return 'rgb('+m(r)+','+m(g)+','+m(b)+')';
}
let pistaData=null, pista32=null, bufCanvas=null, bufCtx=null, bufImg=null, buf32=null, pcW=0, pcH=0;
let bw=B3W, bh=B3H-B3HOR, bufNivel=0, fondoVerde=0;
let LE = true;
try{ const ab=new ArrayBuffer(4); new Uint32Array(ab)[0]=0x11223344; LE = new Uint8Array(ab)[0]===0x44; }catch(e){}
function prepararBuffer(){
  try{
    const esc = CAL.nivel>=3 ? 1 : (CAL.nivel===2 ? 0.75 : 0.55);
    bw = Math.round(B3W*esc); bh = Math.round((B3H-B3HOR)*esc);
    bufCanvas = document.createElement('canvas');
    bufCanvas.width=bw; bufCanvas.height=bh;
    bufCtx = bufCanvas.getContext('2d');
    bufImg = bufCtx.createImageData(bw, bh);
    buf32 = new Uint32Array(bufImg.data.buffer);
    const fc = PISTAS[pistaIdx].fondo;
    fondoVerde = LE ? (255<<24 | fc[2]<<16 | fc[1]<<8 | fc[0]) : (fc[0]<<24 | fc[1]<<16 | fc[2]<<8 | 255);
    bufNivel = CAL.nivel;
  }catch(e){ buf32=null; }
}
function prepararMode7(){
  try{
    const pc = document.createElement('canvas');
    pcW = (MUNDO_KX*PC_S)|0; pcH = (MUNDO_KY*PC_S)|0;
    pc.width=pcW; pc.height=pcH;
    const c2 = pc.getContext('2d');
    /* césped a cuadros como el Super Mario Kart de verdad */
    c2.fillStyle=PISTAS[pistaIdx].suelo[0]; c2.fillRect(0,0,pcW,pcH);
    c2.fillStyle=PISTAS[pistaIdx].suelo[1];
    for(let gy=0;gy<pcH;gy+=64) for(let gx=0;gx<pcW;gx+=64)
      if (((gx>>6)+(gy>>6))%2===0) c2.fillRect(gx,gy,64,64);
    c2.save(); c2.scale(PC_S,PC_S);
    c2.lineJoin='round'; c2.lineCap='round';
    const trazar = ()=>{ c2.beginPath(); c2.moveTo(PISTA[0][0],PISTA[0][1]);
      for(let i=1;i<=NWP;i++) c2.lineTo(PISTA[i%NWP][0],PISTA[i%NWP][1]); c2.closePath(); };
    /* sardineles rojiblancos alternados en los bordes */
    c2.strokeStyle='#e03434'; c2.lineWidth=ANCHO_PISTA*2+26; c2.setLineDash([34,34]); trazar(); c2.stroke();
    c2.strokeStyle='#f4f4f4'; c2.lineDashOffset=34; trazar(); c2.stroke();
    c2.lineDashOffset=0; c2.setLineDash([]);
    /* asfalto */
    c2.strokeStyle='#3f3f47'; c2.lineWidth=ANCHO_PISTA*2; trazar(); c2.stroke();
    c2.strokeStyle='#494952'; c2.lineWidth=ANCHO_PISTA*1.35; trazar(); c2.stroke();
    /* línea central discontinua */
    c2.strokeStyle='#e8e8e8'; c2.lineWidth=7; c2.setLineDash([34,40]); trazar(); c2.stroke(); c2.setLineDash([]);
    /* meta a cuadros */
    const a0 = Math.atan2(PISTA[1][1]-PISTA[0][1], PISTA[1][0]-PISTA[0][0]);
    c2.save(); c2.translate(PISTA[0][0],PISTA[0][1]); c2.rotate(a0+Math.PI/2);
    for(let i=0;i<12;i++) for(let j=0;j<4;j++){
      c2.fillStyle=(i+j)%2?'#f4f4f4':'#151515';
      c2.fillRect(-ANCHO_PISTA+i*(ANCHO_PISTA/6), j*12-24, ANCHO_PISTA/6, 12);
    }
    c2.restore();
    c2.restore();
    /* motitas de asfalto para dar textura */
    const idata = c2.getImageData(0,0,pcW,pcH), dd = idata.data;
    for(let n=0;n<90000;n++){
      const px2 = (Math.random()*pcW)|0, py2 = (Math.random()*pcH)|0;
      const p = (py2*pcW+px2)<<2;
      if (dd[p]>50 && dd[p]<90 && dd[p+2]>60 && dd[p+2]<95){   // solo sobre el asfalto
        const v = Math.random()<0.5 ? -14 : 14;
        dd[p]+=v; dd[p+1]+=v; dd[p+2]+=v;
      }
    }
    pistaData = idata;
    pista32 = new Uint32Array(idata.data.buffer);
    prepararBuffer();
    if (!pistaData || !pistaData.data || !buf32) throw 0;
  }catch(e){ pistaData=null; }
}
/* sprites de los personajes sentados en su kart (mirando a la cámara) */
const MINI = {
  fernando:[24,40, ()=>dibFernandoSolo()],
  penny:[27,21, ()=>dibPerroSolo('#222')],
  sheldon:[27,21, ()=>dibPerroSolo('#8a5a2a')],
  cucu:[22,30, ()=>dibCucu(0,3,1,tick)],
  luca:[24,34, ()=>dibLuca(0,0,tick,1)],
  salomon:[24,37, ()=>dibSalomon(0,3,tick,1)],
  tiojuan:[32,49, ()=>dibTioJuan(0,3,tick)],
  tiofran:[28,48, ()=>dibTioFran(0,0,tick,false)],
  nacho:[28,48, ()=>dibNacho(0,4,tick)],
  yanny:[28,47, ()=>dibYanny(0,3,tick)],
  romulo:[30,40, ()=>dibRomulo(0,4,tick)],
};
const gradKart = {};
function dibCorredor3D(c, X, Y, esc){
  const [sw,sh,fn] = MINI[c.tipo];
  const bote = Math.sin((tick + c.x)/4)*0.5;   // vibración del motor, suave
  ctx.save(); ctx.translate(X,Y+bote*esc*0.3); ctx.scale(esc,esc);
  ctx.fillStyle='rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(0,1,26,5,0,0,Math.PI*2); ctx.fill();   // sombra
  rect(-24,-14,10,16,'#151515'); rect(14,-14,10,16,'#151515');        // ruedas
  rect(-22,-11,6,6,'#3a3a3a'); rect(16,-11,6,6,'#3a3a3a');
  ctx.fillStyle=c.color;
  ctx.beginPath(); ctx.roundRect(-19,-18,38,18,6); ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=2; ctx.stroke();
  rect(-13,-14,26,7,'#1a1a20');                                       // asiento
  rect(-17,-22,34,5,'#24242c');                                       // alerón
  rect(-6,-3,4,4,'#2a2a2a'); rect(3,-3,4,4,'#2a2a2a');                // escapes
  ctx.translate(-sw/2, -20-sh);
  fn();
  ctx.restore();
}
/* Fernando de espaldas, manejando (como en el Super Mario Kart) */
function dibFernandoAtras(tilt){
  ctx.save(); ctx.translate(0, Math.sin(tick/3.2)*0.7); ctx.rotate(tilt*0.06);
  if (sombraImg) ctx.drawImage(sombraImg, -95, 0, 190, 22);           // sombra pre-renderizada
  for(const rx2 of [-88,58]){                                          // ruedas con brillo
    ctx.fillStyle='#101014'; ctx.beginPath(); ctx.roundRect(rx2,-46,30,56,10); ctx.fill();
    ctx.fillStyle='#3a3a42'; ctx.beginPath(); ctx.roundRect(rx2+8,-38,14,20,6); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.22)'; ctx.fillRect(rx2+4,-44,22,5);
  }
  if (!dibFernandoAtras.gk){
    const gk0 = ctx.createLinearGradient(0,-52,0,6);
    gk0.addColorStop(0,'#ff6a4a'); gk0.addColorStop(0.4,'#d82800'); gk0.addColorStop(1,'#7a1400');
    dibFernandoAtras.gk = gk0;
  }
  ctx.fillStyle=dibFernandoAtras.gk;
  ctx.beginPath(); ctx.roundRect(-64,-52,128,58,16); ctx.fill();
  ctx.strokeStyle='#5a0e00'; ctx.lineWidth=4; ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.4)';                               // brillo especular
  ctx.beginPath(); ctx.ellipse(-24,-44,26,7,-0.15,0,Math.PI*2); ctx.fill();
  if (!dibFernandoAtras.gp){
    const gp0 = ctx.createLinearGradient(0,-22,0,6);
    gp0.addColorStop(0,'#c22600'); gp0.addColorStop(1,'#6e1200');
    dibFernandoAtras.gp = gp0;
  }
  ctx.fillStyle=dibFernandoAtras.gp;
  ctx.beginPath(); ctx.roundRect(-64,-22,128,28,12); ctx.fill();       // parachoques
  for(const ex2 of [-18,6]){                                           // escapes cromados
    ctx.fillStyle='#3c3c46'; ctx.beginPath(); ctx.roundRect(ex2,-16,14,12,4); ctx.fill();
    ctx.fillStyle='#0a0a0e'; ctx.beginPath(); ctx.ellipse(ex2+7,-10,5,4,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.fillRect(ex2+2,-15,10,2);
  }
  ctx.fillStyle='#2a2a34'; ctx.beginPath(); ctx.roundRect(-46,-58,92,10,4); ctx.fill(); // alerón
  /* Fernando de espaldas */
  rect(-26,-96,52,44,'#d82800');                                       // camisa
  rect(-30,-88,10,28,'#d82800'); rect(20,-88,10,28,'#d82800');         // brazos
  rect(-22,-92,8,10,'#2038ec'); rect(14,-92,8,10,'#2038ec');           // tirantes
  rect(-18,-124,36,30,'#ffc8a0');                                      // nuca
  rect(-18,-124,36,10,'#5a3418');                                      // pelo
  rect(-22,-136,44,16,'#d82800');                                      // gorra (de atrás)
  rect(-22,-124,44,5,'#a81f00');
  ctx.fillStyle='#fff'; ctx.font='bold 13px monospace'; ctx.textAlign='center';
  ctx.fillText('F', 0, -125); ctx.textAlign='left';
  ctx.restore();
}
function drawKart(){
  const HORY = B3HOR*ESC3;
  /* peralte: la cámara se ladea al girar (sensación Mario Kart 64) */
  const giroK = (izq()?-1:0)+(der()?1:0);
  kartRoll += ((giroK * -0.045 * Math.min(KJ.vel/6,1)) - kartRoll) * 0.12;
  const bob = Math.sin(kartT/6) * Math.min(KJ.vel,7) * 0.12;   // rebote discreto
  ctx.save();
  if (CAL.nivel>=2){
    ctx.translate(W/2, H*0.62);
    ctx.rotate(kartRoll);
    ctx.scale(1.09, 1.09);
    ctx.translate(-W/2, -H*0.62 + bob);
  }
  /* cielo */
  const g = ctx.createLinearGradient(0,0,0,HORY);
  g.addColorStop(0,'#2a6ad0'); g.addColorStop(1,'#aadcf8');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,HORY+2);
  ctx.fillStyle='#ffe36e';
  ctx.beginPath(); ctx.arc(W-170,64,34,0,Math.PI*2); ctx.fill();
  /* montañas y colinas del horizonte, giran con la cámara */
  const off = KJ.ang*420;
  ctx.fillStyle='#6f9fd4';
  ctx.beginPath(); ctx.moveTo(-100,HORY);
  const pasoM = CAL.nivel>=3 ? 12 : 26;
  for(let x=-100;x<=W+100;x+=pasoM){
    const t=(x+off*0.6)*0.008;
    ctx.lineTo(x, HORY - (Math.abs(Math.sin(t))*54 + Math.sin(t*2.3)*8));
  }
  ctx.lineTo(W+100,HORY); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#4f8f4a';
  ctx.beginPath(); ctx.moveTo(-100,HORY);
  for(let x=-100;x<=W+100;x+=pasoM){
    const t=(x+off)*0.012;
    ctx.lineTo(x, HORY - (Math.abs(Math.sin(t+2))*26 + Math.sin(t*3.1)*5));
  }
  ctx.lineTo(W+100,HORY); ctx.closePath(); ctx.fill();
  /* banda de bruma en el horizonte (profundidad N64) */
  if (!drawKart.gbruma){
    const gb0 = ctx.createLinearGradient(0,HORY-14,0,HORY+26);
    gb0.addColorStop(0,'rgba(200,224,248,0)'); gb0.addColorStop(0.5,'rgba(200,224,248,0.55)');
    gb0.addColorStop(1,'rgba(200,224,248,0)');
    drawKart.gbruma = gb0;
  }
  ctx.fillStyle=drawKart.gbruma; ctx.fillRect(-100,HORY-14,W+200,40);
  /* nubes */
  ctx.fillStyle='rgba(255,255,255,0.92)';
  for(let i=0;i<4;i++){
    const nx = ((i*310 - off*0.35) % (W+320) + (W+320))%(W+320) - 160;
    ctx.beginPath(); ctx.ellipse(nx,52+(i%2)*46,48,15,0,0,Math.PI*2);
    ctx.ellipse(nx+34,44+(i%2)*46,30,12,0,0,Math.PI*2); ctx.fill();
  }
  /* suelo en perspectiva */
  const cosA=Math.cos(KJ.ang), sinA=Math.sin(KJ.ang);
  const camx = KJ.x - cosA*78, camy = KJ.y - sinA*78;
  if (pistaData && buf32){
    if (bufNivel !== CAL.nivel) prepararBuffer();
    const escB = bh/(B3H-B3HOR);
    let o = 0;
    for(let j=1;j<=bh;j++){
      const dist = CAM_H*CAM_FX/(j/escB);
      const sx2 = (-sinA)*dist/CAM_FX, sy2 = cosA*dist/CAM_FX;
      let wx = camx + cosA*dist - sx2*(bw/2)/escB, wy = camy + sinA*dist - sy2*(bw/2)/escB;
      const px2 = sx2/escB, py2 = sy2/escB;
      for(let i=0;i<bw;i++){
        const tx=wx|0, ty=wy|0;
        buf32[o++] = (tx>=0 && ty>=0 && tx<pcW && ty<pcH) ? pista32[ty*pcW+tx] : fondoVerde;
        wx+=px2; wy+=py2;
      }
    }
    bufCtx.putImageData(bufImg,0,0);
    ctx.imageSmoothingEnabled=true;   // desenfoque bilineal, marca de la casa N64
    ctx.drawImage(bufCanvas, 0,0,bw,bh, 0,HORY, W, (B3H-B3HOR)*ESC3);
    /* niebla y oscurecimiento de distancia: una sola pasada de degradado */
    if (!drawKart.gn){
      const gn = ctx.createLinearGradient(0,HORY,0,HORY+(B3H-B3HOR)*ESC3);
      gn.addColorStop(0,'rgba(190,220,248,0.75)');
      gn.addColorStop(0.16,'rgba(190,220,248,0.28)');
      gn.addColorStop(0.42,'rgba(190,220,248,0)');
      gn.addColorStop(1,'rgba(0,0,0,0.16)');
      drawKart.gn = gn;
    }
    ctx.fillStyle = drawKart.gn;
    ctx.fillRect(-100, HORY, W+200, (B3H-B3HOR)*ESC3+40);
  } else {
    ctx.fillStyle=PISTAS[pistaIdx].suelo[0]; ctx.fillRect(-100,HORY,W+200,H-HORY+100);
  }
  /* función de proyección compartida */
  const proyectar = (x,y)=>{
    const rx=x-camx, ry=y-camy;
    const fwd = rx*cosA+ry*sinA, lat = -rx*sinA+ry*cosA;
    if (fwd<=45) return null;
    return {fwd, X:(B3W/2+lat*CAM_FX/fwd)*ESC3, Y:(B3HOR+CAM_H*CAM_FX/fwd)*ESC3};
  };
  /* pancarta de META sobre la línea de salida */
  const a0 = Math.atan2(PISTA[1][1]-PISTA[0][1], PISTA[1][0]-PISTA[0][0]);
  const perp = [Math.cos(a0+Math.PI/2), Math.sin(a0+Math.PI/2)];
  const pmL = proyectar(PISTA[0][0]+perp[0]*(ANCHO_PISTA+16), PISTA[0][1]+perp[1]*(ANCHO_PISTA+16));
  const pmR = proyectar(PISTA[0][0]-perp[0]*(ANCHO_PISTA+16), PISTA[0][1]-perp[1]*(ANCHO_PISTA+16));
  if (pmL && pmR && pmL.fwd<2000 && pmR.fwd<2000){
    const hL = 22000/pmL.fwd, hR = 22000/pmR.fwd;
    ctx.fillStyle='#c8c8d0';
    ctx.fillRect(pmL.X-3, pmL.Y-hL, 6, hL);
    ctx.fillRect(pmR.X-3, pmR.Y-hR, 6, hR);
    const bh = Math.max(10,(hL+hR)*0.16);
    ctx.save();
    ctx.beginPath(); ctx.moveTo(pmL.X,pmL.Y-hL); ctx.lineTo(pmR.X,pmR.Y-hR);
    ctx.lineTo(pmR.X,pmR.Y-hR+bh); ctx.lineTo(pmL.X,pmL.Y-hL+bh); ctx.closePath();
    ctx.fillStyle='#d82800'; ctx.fill();
    ctx.clip();
    ctx.fillStyle='#fff'; ctx.font='bold '+Math.max(9,bh*0.62|0)+'px monospace'; ctx.textAlign='center';
    ctx.fillText('★ META ★', (pmL.X+pmR.X)/2, (pmL.Y-hL+pmR.Y-hR)/2+bh*0.72);
    ctx.restore(); ctx.textAlign='left';
  }
  /* rivales (lejos → cerca) */
  const lista=[];
  for(const c of corredores){
    if (c.esJugador) continue;
    const pr = proyectar(c.x, c.y);
    if (pr && pr.fwd<3000 && pr.X>-120 && pr.X<W+120)
      lista.push({c, fwd:pr.fwd, X:pr.X, Y:pr.Y, esc:Math.min(3.2, 480/pr.fwd)});
  }
  lista.sort((a,b)=>b.fwd-a.fwd);
  const maxRiv = CAL.nivel>=3 ? 20 : (CAL.nivel===2 ? 8 : 5);
  for(const s of lista.slice(-maxRiv)){
    dibCorredor3D(s.c, s.X, s.Y, s.esc);
    if (s.fwd<1000){
      ctx.font='bold '+Math.max(11,(13*s.esc/2.4)|0)+'px monospace'; ctx.textAlign='center';
      const [sw,sh]=MINI[s.c.tipo];
      ctx.fillStyle='#000'; ctx.fillText(s.c.nombre, s.X+1, s.Y-(20+sh)*s.esc-5);
      ctx.fillStyle='#fff'; ctx.fillText(s.c.nombre, s.X, s.Y-(20+sh)*s.esc-6);
      ctx.textAlign='left';
    }
  }
  /* cajas de poder flotando sobre la pista */
  for(const cp of cajasPoder){
    if (!cp.activa) continue;
    const pr = proyectar(cp.x, cp.y);
    if (!pr || pr.fwd>2200) continue;
    const s = Math.min(2.6, 420/pr.fwd);
    const yy = pr.Y - 26*s + Math.sin(kartT/12 + cp.x)*4*s;
    ctx.save(); ctx.translate(pr.X, yy); ctx.rotate(kartT/26);
    ctx.fillStyle=`hsl(${(kartT*3+cp.x)%360},85%,60%)`;
    ctx.fillRect(-13*s, -13*s, 26*s, 26*s);
    ctx.strokeStyle='#fff'; ctx.lineWidth=2*s; ctx.strokeRect(-13*s,-13*s,26*s,26*s);
    ctx.fillStyle='#fff'; ctx.font='bold '+(16*s|0)+'px monospace'; ctx.textAlign='center';
    ctx.fillText('?', 0, 6*s); ctx.textAlign='left';
    ctx.restore();
  }
  /* caparazones lanzados */
  for(const cap of caparazones){
    const pr = proyectar(cap.x, cap.y);
    if (!pr || pr.fwd>2200) continue;
    const s = Math.min(2.6, 420/pr.fwd);
    ctx.save(); ctx.translate(pr.X, pr.Y-10*s); ctx.scale(s,s);
    ctx.fillStyle='#3aa030'; ctx.beginPath(); ctx.ellipse(0,0,15,11,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#7ed040'; ctx.beginPath(); ctx.ellipse(0,0,10,7,0,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
  /* nubes de pedo proyectadas */
  for(const p of parts){
    if (p.tipo!=='pedo') continue;
    const pr = proyectar(p.x, p.y);
    if (pr && pr.fwd<1800){
      ctx.globalAlpha=Math.min(1,p.t/30)*0.8; ctx.fillStyle='#a8d848';
      ctx.beginPath(); ctx.arc(pr.X, pr.Y-(60-p.t)*2, (6+(60-p.t)*0.3)*Math.min(2.6,480/pr.fwd/1.2), 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha=1;
    }
  }
  ctx.restore();   // fin del peralte
  /* chispas al derrapar, humo del escape */
  const tilt=giroK;
  if (tilt!==0 && KJ.vel>4.5 && kartT%2===0)
    chispasKart.push({x:W/2+(tilt>0?-64:64), y:H-26, vx:(tilt>0?-1:1)*(2+Math.random()*2),
      vy:-1-Math.random()*2, t:14});
  if (kartT%9===0 && KJ.vel>1)
    chispasKart.push({x:W/2+(kartT%18===0?-11:13), y:H-38, vx:(Math.random()-0.5)*0.6,
      vy:1.5+Math.random(), t:26, humo:true});
  for(const ch of chispasKart){ ch.x+=ch.vx; ch.y+=ch.vy; ch.t--; if(!ch.humo) ch.vy+=0.25; }
  chispasKart = chispasKart.filter(ch=>ch.t>0);
  for(const ch of chispasKart){
    if (ch.humo){ ctx.globalAlpha=Math.min(1,ch.t/16)*0.4; ctx.fillStyle='#9a9aa8';
      ctx.beginPath(); ctx.arc(ch.x,ch.y,4+(26-ch.t)*0.3,0,Math.PI*2); ctx.fill(); }
    else { ctx.globalAlpha=ch.t/14; ctx.fillStyle=(kartT>>1)%2?'#ffe36e':'#ff9040';
      ctx.fillRect(ch.x,ch.y,4,4); }
    ctx.globalAlpha=1;
  }
  /* líneas de velocidad con el turbo */
  if (KJ.turbo>0){
    ctx.globalAlpha=0.28; ctx.strokeStyle='#fff'; ctx.lineWidth=3;
    for(let i=0;i<10;i++){
      const ang2 = (i/10)*Math.PI*2 + (kartT%7)*0.05;
      const cx3=W/2, cy3=H*0.45;
      ctx.beginPath();
      ctx.moveTo(cx3+Math.cos(ang2)*220, cy3+Math.sin(ang2)*150);
      ctx.lineTo(cx3+Math.cos(ang2)*(300+((kartT*13+i*37)%80)), cy3+Math.sin(ang2)*(220+((kartT*13+i*37)%80)));
      ctx.stroke();
    }
    ctx.globalAlpha=1;
  }
  /* el kart de Fernando, de espaldas, abajo al centro */
  ctx.save(); ctx.translate(W/2, H-18);
  if (KJ.estrella>0){
    ctx.globalAlpha=0.5;
    ctx.fillStyle=`hsl(${(kartT*11)%360},95%,62%)`;
    ctx.beginPath(); ctx.ellipse(0,-40,120,80,0,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1;
  }
  if (KJ.turbo>0){
    ctx.fillStyle=(tick>>1)%2?'#ff5000':'#ffe36e';
    ctx.beginPath(); ctx.ellipse(-11,4,9,22,0,0,Math.PI*2); ctx.ellipse(13,4,9,22,0,0,Math.PI*2); ctx.fill();
  }
  dibFernandoAtras(tilt);
  ctx.restore();
  /* burbuja de diálogo (la más reciente) */
  ctx.font='bold 16px monospace';
  for(const b of burbujas.slice(-1)){
    const wtx=ctx.measureText(b.txt).width;
    const bx=W/2, by=H-215;
    ctx.globalAlpha=Math.min(1,b.t/25);
    ctx.fillStyle='#fff';
    const rx2=Math.min(Math.max(bx-wtx/2-10,4),W-wtx-24);
    ctx.fillRect(rx2,by-26,wtx+20,30);
    ctx.fillStyle='#111'; ctx.fillText(b.txt,rx2+10,by-5);
    ctx.globalAlpha=1;
  }
  /* HUD */
  rect(0,0,W,44,'#000');
  ctx.fillStyle='#f8b800'; ctx.font='bold 18px monospace';
  ctx.fillText('FERNANDO KART', 16, 29);
  ctx.fillStyle='#fff';
  const posicion = [...corredores].sort((a,b)=>b.wpi-a.wpi).indexOf(KJ)+1;
  ctx.fillText('VUELTA '+Math.min(KJ.vuelta+1,VUELTAS)+'/'+VUELTAS+'   POSICIÓN '+posicion+'/'+corredores.length, 220, 29);
  ctx.font='13px monospace'; ctx.fillStyle='#8ecbff';
  ctx.fillText(KJ.turboCd<=0?'A = TURBO ✦':'turbo en '+Math.ceil(KJ.turboCd/60)+'s', 596, 29);
  /* caja de poder del jugador */
  const px3 = 720, py3 = 5;
  ctx.fillStyle='rgba(255,255,255,0.14)';
  ctx.beginPath(); ctx.roundRect(px3, py3, 34, 34, 8); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.45)'; ctx.lineWidth=2; ctx.stroke();
  if (KJ.poder){
    const pd2 = PODERES.find(p=>p.id===KJ.poder);
    ctx.font='22px monospace'; ctx.textAlign='center';
    ctx.fillText(pd2.emoji, px3+17, py3+26);
    ctx.font='11px monospace'; ctx.fillStyle='#ffe36e';
    ctx.fillText('B = usar', px3+17, py3+43);
    ctx.textAlign='left';
  }
  /* posición gigante estilo Mario Kart 64 */
  const posK = [...corredores].sort((a,b)=>b.wpi-a.wpi).indexOf(KJ)+1;
  ctx.save();
  ctx.font='italic bold 76px monospace';
  ctx.textAlign='left';
  const colPos = posK===1 ? '#ffd700' : posK===2 ? '#d8d8e8' : posK===3 ? '#d0803a' : '#e8e8f0';
  ctx.lineWidth=9; ctx.strokeStyle='#101018'; ctx.lineJoin='round';
  ctx.strokeText(posK+'º', 22, H-26);
  const gpos = ctx.createLinearGradient(0,H-92,0,H-26);
  gpos.addColorStop(0, aclarar(colPos==='#ffd700'?'#ffd700':colPos==='#d8d8e8'?'#d8d8e8':colPos==='#d0803a'?'#d0803a':'#e8e8f0',0.35));
  gpos.addColorStop(1, colPos);
  ctx.fillStyle=gpos;
  ctx.fillText(posK+'º', 22, H-26);
  ctx.restore();
  /* minimapa */
  const mS=0.062, mX=W-134, mY=54;
  ctx.globalAlpha=0.8; rect(mX-6,mY-6,MUNDO_KX*mS+12,MUNDO_KY*mS+12,'#0a2a0a'); ctx.globalAlpha=1;
  ctx.strokeStyle='#777'; ctx.lineWidth=ANCHO_PISTA*2*mS;
  ctx.beginPath(); ctx.moveTo(mX+PISTA[0][0]*mS,mY+PISTA[0][1]*mS);
  for(let i=1;i<=NWP;i++) ctx.lineTo(mX+PISTA[i%NWP][0]*mS,mY+PISTA[i%NWP][1]*mS);
  ctx.closePath(); ctx.stroke();
  for(const c of corredores){
    ctx.fillStyle = c.esJugador ? '#fff' : c.color;
    ctx.beginPath(); ctx.arc(mX+c.x*mS, mY+c.y*mS, c.esJugador?4:3, 0, Math.PI*2); ctx.fill();
  }
  dibFXFinales();
}
function drawKartFin(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#0a1a4a'); g.addColorStop(1,'#3aa32a');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.textAlign='center';
  ctx.fillStyle='#f8b800'; ctx.font='bold 44px monospace';
  ctx.fillText('🏁 FERNANDO KART 🏁', W/2, 80);
  const pos = resultadoKart.indexOf(KJ)+1;
  ctx.fillStyle='#fff'; ctx.font='bold 26px monospace';
  ctx.fillText(pos===1 ? '¡GANASTE LA COPA PICHUNGUITO! 🏆' : 'Llegaste de '+pos+'º — ¡bien pichunguito!', W/2, 122);
  ctx.font='bold 18px monospace';
  resultadoKart.forEach((c,i)=>{
    const y = 165 + i*32;
    ctx.fillStyle = c.esJugador ? '#ffe36e' : '#dfe8ff';
    const medalla = ['🥇','🥈','🥉'][i] || (i+1)+'º';
    ctx.fillText(medalla+'  '+c.nombre + (c.esJugador?'  ← ¡tú!':''), W/2, y);
  });
  ctx.fillStyle='#fff'; ctx.font='bold 20px monospace';
  if ((tick>>4)%2===0) ctx.fillText('ENTER o toca para continuar', W/2, H-24);
  ctx.textAlign='left';
  /* los tres primeros en su kart */
  const alturas=[0,26,40];
  resultadoKart.slice(0,3).forEach((c,i)=>{
    const px=[W/2-330,W/2+280,W/2+380][i]||0;
    if (MINI[c.tipo]) dibCorredor3D(c, px, 300+alturas[i]*0+((i===0)?260:300), 2.4-(i*0.3));
  });
}



/* ---------------- Fondos ilustrados (generados con IA) ---------------- */
const FONDOS_BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Fiy4A0M4MKixWlklbu10QS1hAQ/';
const FONDOS_URL = {
  titulo: FONDOS_BASE+'hf_20260724_034350_dfc5e0df-6263-425f-bbef-c757efe9fd4d_min.webp',
  mundos: [
    FONDOS_BASE+'hf_20260724_034357_90063032-1a27-4617-a9d7-a00cce8b26f3_min.webp',  // pradera
    FONDOS_BASE+'hf_20260724_034406_96dab8d1-5189-4418-97d0-5ce49d786db0_min.webp',  // cielos
    FONDOS_BASE+'hf_20260724_034417_5a55386e-fe4f-4d65-a0c8-034a8794c0d1_min.webp',  // bosque
    FONDOS_BASE+'hf_20260724_034425_f8a98386-6cc2-47ce-aac5-2615448c238f_min.webp',  // playa
    FONDOS_BASE+'hf_20260724_034433_6836b2d4-8906-4447-ad4d-2f63b03df7bc_min.webp',  // cueva
    FONDOS_BASE+'hf_20260724_034442_712485df-ae38-42bd-8fcd-d354693887d4_min.webp',  // nubes
    FONDOS_BASE+'hf_20260724_034455_5764cc0e-3a0e-454f-80ab-922a3b60cffd_min.webp',  // desierto
    FONDOS_BASE+'hf_20260724_034503_1cdbab22-3f21-4ba6-af9f-f67e858b7876_min.webp',  // castillo
    FONDOS_BASE+'hf_20260725_162335_647b2ba4-02f1-45fa-ad6f-918031054f2a_min.webp',  // mar
    FONDOS_BASE+'hf_20260724_034503_1cdbab22-3f21-4ba6-af9f-f67e858b7876_min.webp',  // castillo de bowser
  ],
};
const fondosImg = { titulo:null, mundos:[null,null,null,null,null,null,null,null,null,null] };
function cargarFondos(){
  if (typeof Image === 'undefined') return;
  try{
    if (FONDOS_URL.titulo){ const im=new Image(); im.src=FONDOS_URL.titulo; fondosImg.titulo=im; }
    FONDOS_URL.mundos.forEach((u,i)=>{ if(u){ const im=new Image(); im.src=u; fondosImg.mundos[i]=im; } });
  }catch(e){}
}
cargarFondos();
const imgLista = im => im && im.complete && im.naturalWidth > 0;
/* ---------------- Selector de mundos ---------------- */
let selMapa = 0;
const NOMBRES_MAPA = ['PRADERA','CIELOS','BOSQUE','PLAYA','CUEVA','NUBES','DESIERTO','CASTILLO','MAR','BOWSER'];
const COLORES_MAPA = ['#5c94fc','#48b0e8','#4a9c58','#6bd0f8','#2a2a48','#7ec8f8','#d89040','#3a3a5c','#1560c8','#2a1a3c'];
const EMOJIS_MAPA = ['🌄','☁️','🌲','🏖️','🦇','☁️','🌵','🏰','🌊','🐢'];
function cajasMapa(){
  const cajas=[];
  for(let i=0;i<10;i++){
    const col=i%5, row=(i/5)|0;
    cajas.push({x:30+col*184, y:130+row*126, w:168, h:106, idx:i});
  }
  cajas.push({x:W/2-330, y:400, w:320, h:64, idx:10});
  cajas.push({x:W/2+10,  y:400, w:320, h:64, idx:11});
  return cajas;
}
function dibMapa(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#0a1a4a'); g.addColorStop(1,'#2a5aa8');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.textAlign='center';
  ctx.fillStyle='#f8b800'; ctx.font='bold 40px monospace';
  ctx.fillText('ELIGE TU MUNDO', W/2, 70);
  ctx.font='15px monospace'; ctx.fillStyle='#bcd6ff';
  ctx.fillText('Toca un mundo · o entra a la carrera y a la SALA ARCADE con sus minijuegos', W/2, 100);
  for(const c of cajasMapa()){
    const sel = selMapa===c.idx;
    ctx.fillStyle = c.idx===10 ? '#0a3a12' : c.idx===11 ? '#3a0a3a' : COLORES_MAPA[c.idx];
    ctx.beginPath(); ctx.roundRect(c.x,c.y,c.w,c.h,12); ctx.fill();
    ctx.lineWidth = sel?6:3;
    ctx.strokeStyle = sel ? '#ffe36e' : 'rgba(255,255,255,0.5)';
    ctx.stroke();
    if (sel){
      ctx.globalAlpha = 0.35+Math.sin(tick/7)*0.25;
      ctx.lineWidth=10; ctx.stroke();
      ctx.globalAlpha = 1; ctx.lineWidth=3;
    }
    if (c.idx===10){
      ctx.fillStyle='#7dffa0'; ctx.font='bold 22px monospace';
      ctx.fillText('🏁 FERNANDO KART', c.x+c.w/2, c.y+40);
    } else if (c.idx===11){
      ctx.fillStyle='#ff9ed6'; ctx.font='bold 22px monospace';
      ctx.fillText('🕹️ SALA ARCADE', c.x+c.w/2, c.y+40);
    } else {
      ctx.fillStyle='rgba(0,0,0,0.35)';
      ctx.beginPath(); ctx.roundRect(c.x,c.y,c.w,30,[12,12,0,0]); ctx.fill();
      ctx.fillStyle='#fff'; ctx.font='bold 16px monospace';
      ctx.fillText('MUNDO '+(c.idx+1), c.x+c.w/2, c.y+22);
      ctx.font='bold 14px monospace'; ctx.fillStyle='#ffe36e';
      ctx.fillText(NOMBRES_MAPA[c.idx], c.x+c.w/2, c.y+56);
      ctx.font='22px monospace';
      ctx.fillText(EMOJIS_MAPA[c.idx]||'', c.x+c.w/2, c.y+90);
    }
  }
  ctx.textAlign='left';
  ctx.fillStyle='#7fa8e0'; ctx.font='12px monospace';
  ctx.fillText('v25', W-34, 18);
}
/* ---- sombra suave: se dibuja UNA vez en un lienzo y se reutiliza ---- */
let sombraImg = null;
function prepararSombra(){
  try{
    const c = document.createElement('canvas'); c.width=64; c.height=64;
    const x2 = c.getContext('2d');
    const g = x2.createRadialGradient(32,32,1,32,32,32);
    g.addColorStop(0,'rgba(0,0,0,0.34)'); g.addColorStop(1,'rgba(0,0,0,0)');
    x2.fillStyle=g; x2.fillRect(0,0,64,64);
    sombraImg = c;
  }catch(e){ sombraImg = null; }
}
prepararSombra();
function sombra(cx, cy, r){
  if (!sombraImg || !CAL.sombras) return;
  ctx.drawImage(sombraImg, cx-r, cy-r*0.34, r*2, r*0.68);
}
/* ---- volumen 3D falso estilo pre-render (N64 / Donkey Kong Country):
   el personaje se dibuja en un lienzo aparte y se le aplica luz arriba
   y sombra abajo SOLO sobre su silueta ---- */
let volC=null, volX=null;
try{ volC=document.createElement('canvas'); volC.width=120; volC.height=140; volX=volC.getContext('2d'); }catch(e){}
const VPAD=24;
const gradVol = {};   // gradientes cacheados por altura (crear uno por cuadro era carísimo)
function envolverVolumen(fn, alto){
  if (!volX) return fn;
  const H2 = alto||40;
  return function(x, y, ...resto){
    if (!CAL.volumen){ fn(x, y, ...resto); return; }   // calidad baja: dibujo directo
    volX.clearRect(0,0,120,140);
    const prev = ctx; ctx = volX;
    try{ fn(VPAD, VPAD, ...resto); } finally { ctx = prev; }
    try{
      let g = gradVol[H2];
      if (!g){
        g = volX.createLinearGradient(0, VPAD-8, 0, VPAD+H2+8);
        g.addColorStop(0,'rgba(255,255,255,0.30)');
        g.addColorStop(0.45,'rgba(255,255,255,0)');
        g.addColorStop(0.72,'rgba(0,0,0,0)');
        g.addColorStop(1,'rgba(0,0,0,0.30)');
        gradVol[H2] = g;
      }
      volX.globalCompositeOperation='source-atop';
      volX.fillStyle=g; volX.fillRect(0,0,120,VPAD+H2+12);
      volX.globalCompositeOperation='source-over';
    }catch(e){}
    ctx.drawImage(volC, Math.round(x)-VPAD, Math.round(y)-VPAD);
  };
}
dibFernando = envolverVolumen(dibFernando, 56);
dibPerro = envolverVolumen(dibPerro, 22);
dibCucu = envolverVolumen(dibCucu, 30);
dibAbu = envolverVolumen(dibAbu, 50);
dibLuca = envolverVolumen(dibLuca, 34);
dibSalomon = envolverVolumen(dibSalomon, 37);
dibTioJuan = envolverVolumen(dibTioJuan, 48);
dibTioFran = envolverVolumen(dibTioFran, 48);
dibMama = envolverVolumen(dibMama, 50);
dibPapa = envolverVolumen(dibPapa, 48);
dibNacho = envolverVolumen(dibNacho, 48);
dibYanny = envolverVolumen(dibYanny, 47);
dibBeto = envolverVolumen(dibBeto, 46);
dibGiuliana = envolverVolumen(dibGiuliana, 47);
dibSanti = envolverVolumen(dibSanti, 28);
dibHuevo = envolverVolumen(dibHuevo, 38);
dibBowser = envolverVolumen(dibBowser, 64);
dibPrincesa = envolverVolumen(dibPrincesa, 70);
dibGoomba = envolverVolumen(dibGoomba, 24);
dibKoopa = envolverVolumen(dibKoopa, 36);
dibAvion = envolverVolumen(dibAvion, 26);
dibBarco = envolverVolumen(dibBarco, 30);

/* ---------------- Bucle principal ---------------- */
/* Paso de tiempo fijo: si el aparato dibuja a menos cuadros por segundo,
   la lógica se pone al día con pasos extra en vez de ir en cámara lenta. */
let deudaT = 0, ultT = 0;
const PASO = 1000/60;
function loop(){
  const t = (typeof performance!=='undefined' && performance.now) ? performance.now() : 0;
  medirCalidad(t);
  let dt = ultT ? t - ultT : PASO;
  ultT = t;
  if (dt > 120) dt = 120;                       // al volver de segundo plano, no saltar
  deudaT = Math.max(-60, Math.min(deudaT + dt - PASO, 60));
  update();                                     // siempre un paso
  let extra = 0;
  while (deudaT >= PASO && extra < 2){ update(); deudaT -= PASO; extra++; }
  programarMusica();
  draw();
  requestAnimationFrame(loop);
}
infoNivel = null;
loop();
