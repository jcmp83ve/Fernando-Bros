'use strict';
/* ============================================================
   EL DOMINÓ DE TÍA YANY
   Dominó doble-seis para cuatro: Fernando, Salomón, tía Yany y
   tío Fran, con las voces y los diálogos de Fernando Bros.
   ============================================================ */
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const W = cv.width, H = cv.height;

/* ---------------- Voz ----------------
   Las mismas grabaciones con voz de niño que Fernando Bros. El texto de
   cada frase tiene que coincidir LETRA POR LETRA con su mp3; si no, se
   cae a la voz sintética del navegador (que es el respaldo de siempre). */
let voces = [];
function cargarVoces(){ voces = speechSynthesis.getVoices(); }
if (typeof speechSynthesis !== 'undefined'){ cargarVoces(); speechSynthesis.onvoiceschanged = cargarVoces; }
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

let reproductor = null, clipsListos = false, hablando = false, colaVoz = [];
function prepararClips(){
  /* iOS solo deja sonar los audios que arrancan dentro de un toque: se usa
     UN reproductor, desbloqueado con el primer toque, que va cambiando de
     frase. */
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
  return es.find(v=>/es[-_](419|MX|US|CO|VE|AR|CL)/i.test(v.lang)) || es[0] || null;
}
/* Cada personaje tiene su tono: así se les distingue aunque la frase la
   diga la voz del navegador. */
const TONO = {
  fernando: {pitch:1.9,  rate:1.05},
  salomon:  {pitch:1.6,  rate:1.12},
  yany:     {pitch:1.45, rate:1.0},
  fran:     {pitch:0.7,  rate:0.95},
  mesa:     {pitch:1.2,  rate:1.0},
};
function hablar(texto, quien){
  if (!texto) return;
  const src = CLIPS[texto];
  if (!src){ hablarTTS(texto, quien); return; }
  colaVoz.push({src, texto, quien});
  if (colaVoz.length > 3) colaVoz.shift();
  reproducirCola();
}
function reproducirCola(){
  if (hablando) return;
  const sig = colaVoz.shift();
  if (!sig) return;
  if (!reproductor){ hablarTTS(sig.texto, sig.quien); reproducirCola(); return; }
  try{
    hablando = true;
    let sono = false;
    const fallar = ()=>{
      if (sono) return; sono = true;
      try{ reproductor.pause(); }catch(e){}
      hablando = false; hablarTTS(sig.texto, sig.quien); reproducirCola();
    };
    reproductor.onended = ()=>{ hablando = false; reproducirCola(); };
    reproductor.onerror = fallar;
    reproductor.onplaying = ()=>{ sono = true; };
    if (reproductor.src !== sig.src) reproductor.src = sig.src;
    else { try{ reproductor.currentTime = 0; }catch(e){} }
    const p = reproductor.play();
    if (p && p.catch) p.catch(fallar);
    setTimeout(()=>{ if(!sono) fallar(); }, 2000);
  }catch(e){ hablando = false; hablarTTS(sig.texto, sig.quien); }
}
function hablarTTS(texto, quien){
  if (typeof speechSynthesis === 'undefined') return;
  try{
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-ES';
    const v = vozEspanola();
    if (v){ u.voice = v; u.lang = v.lang; }
    const t = TONO[quien] || TONO.mesa;
    u.pitch = t.pitch; u.rate = t.rate; u.volume = 1;
    if (speechSynthesis.speaking || speechSynthesis.pending){
      speechSynthesis.cancel();
      setTimeout(()=>{ try{ speechSynthesis.resume(); speechSynthesis.speak(u); }catch(e){} }, 120);
    } else {
      speechSynthesis.resume();
      speechSynthesis.speak(u);
    }
  }catch(e){}
}

/* ---------------- Sonido ---------------- */
let AC = null;
function audio(){
  prepararClips();
  if(!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  if(AC && AC.state==='suspended') AC.resume();
}
function beep(freq, dur, tipo, vol, t0){
  if(!AC) return;
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
  ficha(){ beep(180,0.06,'square',0.10); beep(120,0.10,'triangle',0.09,0.04); },
  elegir(){ beep(520,0.06,'square',0.05); },
  paso(){ beep(300,0.10,'triangle',0.07); beep(210,0.16,'triangle',0.06,0.09); },
  reparto(){ for(let i=0;i<7;i++) beep(260+i*40, 0.05, 'square', 0.05, i*0.06); },
  gana(){ [523,587,659,784,880,1047,1319].forEach((f,i)=>beep(f,0.18,'square',0.07,i*0.10)); },
  ronda(){ [392,523,659,784].forEach((f,i)=>beep(f,0.14,'triangle',0.07,i*0.09)); },
  pedo(){ for(let i=0;i<14;i++) beep(92-i*4+(i%2)*16, 0.11, 'sawtooth', 0.26, i*0.06); },
  nope(){ beep(160,0.12,'sawtooth',0.07); },
};

/* ---------------- Entrada ---------------- */
const keys = {};
let tecla = null;                      /* la última tecla nueva, sin repetir */
addEventListener('keydown', e=>{
  audio();
  const k = e.key.toLowerCase();
  if (!keys[k]) tecla = e.key;
  keys[k] = true;
  if ([' ','arrowleft','arrowright','arrowup','arrowdown'].includes(k)) e.preventDefault();
});
addEventListener('keyup', e=>{ keys[e.key.toLowerCase()] = false; });
for (const ev of ['gesturestart','gesturechange','gestureend'])
  document.addEventListener(ev, e=>e.preventDefault());
document.addEventListener('dblclick', e=>e.preventDefault());

/* toques: se guarda dónde tocó el dedo y se atiende una vez */
const pt = {x:0, y:0, abajo:false, soltado:false};
const rel = e => {
  const r = cv.getBoundingClientRect();
  return { x:(e.clientX-r.left)*(W/r.width), y:(e.clientY-r.top)*(H/r.height) };
};
cv.addEventListener('pointerdown', e=>{ audio(); const p = rel(e); pt.x=p.x; pt.y=p.y; pt.abajo=true; });
cv.addEventListener('pointermove', e=>{ if(!pt.abajo) return; const p = rel(e); pt.x=p.x; pt.y=p.y; });
cv.addEventListener('pointerup',   e=>{ if(pt.abajo){ pt.abajo=false; pt.soltado=true; } });
/* botones grandes de la pantalla, para el celular */
for (const [id,k] of [['bL','ArrowLeft'],['bR','ArrowRight'],['bA',' '],['bB','Escape']]){
  const el = document.getElementById(id);
  if (!el) continue;
  el.addEventListener('pointerdown', e=>{ e.preventDefault(); audio(); tecla = k; el.classList.add('on'); });
  const fin = ()=>el.classList.remove('on');
  el.addEventListener('pointerup', fin); el.addEventListener('pointercancel', fin);
}

/* ============================================================
   LAS REGLAS DEL DOMINÓ
   Doble seis (28 fichas), siete para cada uno. Sale el doble seis en la
   primera ronda y el ganador en las siguientes. Gana la ronda quien se
   quede sin fichas, o —si se tranca— quien menos puntos tenga en la mano;
   se lleva la suma de lo que les quedó a los otros tres. Gana la partida
   el primero que llega a 100.
   ============================================================ */
const META = 100;
const JUGADORES = [
  {id:'fernando', nombre:'FERNANDO', humano:true,  color:'#d82800'},
  {id:'salomon',  nombre:'SALOMÓN',  humano:false, color:'#d86a28'},
  {id:'yany',     nombre:'TÍA YANY', humano:false, color:'#40c0b0'},
  {id:'fran',     nombre:'TÍO FRAN', humano:false, color:'#8a6a3a'},
];
const P = {
  manos: [[],[],[],[]], cadena: [], puntos: [0,0,0,0],
  turno: 0, fase: 'portada', pases: 0, espera: 0, ronda: 1, ultimoLado: 'der',
  sel: 0, pendiente: null, arranca: 0, primeraRonda: true,
  aviso: '', avisoT: 0, burbujas: [null,null,null,null],
  brillo: 0, ganador: -1, motivo: '', ayuda: true, T: 0,
};
function mazo(){
  const m = [];
  for(let a=0;a<=6;a++) for(let b=a;b<=6;b++) m.push([a,b]);
  return m;
}
function barajar(m){
  for(let i=m.length-1;i>0;i--){
    const j = (Math.random()*(i+1))|0;
    const t = m[i]; m[i] = m[j]; m[j] = t;
  }
  return m;
}
const suma = f => f[0]+f[1];
const esDoble = f => f[0]===f[1];
const sumaMano = i => P.manos[i].reduce((s,f)=>s+suma(f), 0);
function extremos(){
  if (!P.cadena.length) return null;
  return { izq: P.cadena[0].a, der: P.cadena[P.cadena.length-1].b };
}
/* ¿por dónde entra esta ficha? devuelve 'izq', 'der', 'ambos' o null */
function cabe(f){
  const e = extremos();
  if (!e) return 'ambos';
  const i = f[0]===e.izq || f[1]===e.izq;
  const d = f[0]===e.der || f[1]===e.der;
  return i && d ? 'ambos' : i ? 'izq' : d ? 'der' : null;
}
const tieneJugada = j => P.manos[j].some(f=>cabe(f) !== null);
function colocar(f, lado){
  if (!P.cadena.length){ P.cadena.push({a:f[0], b:f[1], doble:esDoble(f)}); return; }
  const e = extremos();
  if (lado === 'izq'){
    const pieza = f[1]===e.izq ? {a:f[0], b:f[1]} : {a:f[1], b:f[0]};
    P.cadena.unshift({...pieza, doble:esDoble(f)});
  } else {
    const pieza = f[0]===e.der ? {a:f[0], b:f[1]} : {a:f[1], b:f[0]};
    P.cadena.push({...pieza, doble:esDoble(f)});
  }
}
function repartir(){
  const m = barajar(mazo());
  P.manos = [m.slice(0,7), m.slice(7,14), m.slice(14,21), m.slice(21,28)];
  for (const mano of P.manos) mano.sort((x,y)=> suma(y)-suma(x) || y[0]-x[0]);
  P.cadena = []; P.pases = 0; P.sel = 0; P.pendiente = null;
  P.ganador = -1; P.motivo = ''; P.brillo = 0;
  P.burbujas = [null,null,null,null];
  if (P.primeraRonda){
    /* la primera la abre quien tenga el doble seis */
    P.arranca = P.manos.findIndex(mano => mano.some(f=>f[0]===6 && f[1]===6));
    if (P.arranca < 0) P.arranca = 0;
  }
  P.turno = P.arranca;
  P.fase = 'turno'; P.espera = 46;
  sfx.reparto();
}
/* la única ficha obligatoria del juego: el doble seis de la primera ronda */
const obligada = () => (P.primeraRonda && !P.cadena.length) ? [6,6] : null;
function jugadasDe(j){
  const ob = obligada();
  const salida = [];
  P.manos[j].forEach((f, idx)=>{
    if (ob && !(f[0]===ob[0] && f[1]===ob[1])) return;
    const c = cabe(f);
    if (c === null) return;
    if (c === 'ambos'){ salida.push({idx, lado:'izq'}); salida.push({idx, lado:'der'}); }
    else salida.push({idx, lado:c});
  });
  return salida;
}
/* Cada uno juega a su manera: Salomón adora los dobles, tío Fran suelta
   siempre la más gorda y tía Yany va soltando las suaves. Todos prefieren
   dejar en la mesa un número del que aún les queden fichas. */
/* cuánto se despista cada uno */
const DESPISTE = {salomon:0.28, yany:0.42, fran:0.34};
function elegirIA(j){
  const opciones = jugadasDe(j);
  if (!opciones.length) return null;
  /* nadie juega perfecto: de vez en cuando sueltan cualquier cosa. Así la
     mesa no es una máquina y a Fernando le toca ganar de verdad. */
  if (Math.random() < DESPISTE[JUGADORES[j].id])
    return opciones[(Math.random()*opciones.length)|0];
  const mano = P.manos[j];
  const quien = JUGADORES[j].id;
  let mejor = null, mejorNota = -1e9;
  for (const op of opciones){
    const f = mano[op.idx];
    let nota = 0;
    if (quien === 'salomon') nota = (esDoble(f) ? 40 : 0) + suma(f);
    else if (quien === 'fran') nota = suma(f)*2 + (esDoble(f) ? 6 : 0);
    else nota = 40 - suma(f) + (esDoble(f) ? 10 : 0);        // tía Yany
    /* el número que quedaría abierto: mejor si aún tiene fichas de ese palo */
    const e = extremos();
    if (e){
      const pega = op.lado==='izq' ? e.izq : e.der;
      const queda = f[0]===pega ? f[1] : f[0];
      nota += mano.filter((g,i)=> i!==op.idx && (g[0]===queda || g[1]===queda)).length * 3;
    }
    if (nota > mejorNota){ mejorNota = nota; mejor = op; }
  }
  return mejor;
}

/* ---------------- Lo que dicen ----------------
   Las frases marcadas «grabada» existen tal cual en los mp3 de Fernando
   Bros y suenan con su voz de verdad; el resto las dice la voz del
   navegador con el tono de cada personaje. */
const VOZ = {
  fernando: {
    saluda:  '¡Fernando Bros! ¡Vamos Penny y Sheldon!',      // grabada
    arranca: '¡Pichunguito al ataque!',                      // grabada
    juega:   '¡Toma, pichungazo!',                           // grabada
    gana:    '¡Gané! ¡Soy el pichunguito campeón!',          // grabada
    campeon: '¡Muy bien, mi pichunguito! ¡Eres un campeón!', // grabada
    pierde:  '¡Qué divertido! ¡Otra vez, otra vez!',         // grabada
  },
  salomon: { saluda: '¡Salomón! ¡Juega conmigo, pichunguito!' },   // grabada
  yany:    { saluda: '¡Hola mi amor! ¡Soy tía Yanny!' },           // grabada
  fran:    { saluda: '¡Qué pedo tan grande, tío Fran!',            // grabada
             pedo:   '¡Qué pedo tan podrido, tío Fran!' },         // grabada
};
const CHARLA = {
  fernando: ['¡Ahí va esa!', '¡Mira esta, tía Yany!', '¡Esta es mía!'],
  salomon:  ['¡Ese doble es mío!', '¡Toma, Fernando!', '¡Yo sí sé jugar dominó!'],
  yany:     ['¡Ay mi amor, qué linda ficha!', '¡Esta la tenía guardadita!', '¡Vamos pues, pongo esta!'],
  fran:     ['¡Chúpate esa!', '¡La gorda para la mesa!', '¡Aquí manda tío Fran!'],
};
const PASA = {
  fernando: ['¡Paso!', '¡Ay, no tengo!'],
  salomon:  ['¡Paso, no tengo!', '¡Ay no, paso!'],
  yany:     ['¡Paso mi amor!', '¡Ay, no me llegó!'],
  fran:     ['¡Paso! Pero me quedo con el pedo', '¡No tengo, paso!'],
};
const alAzar = lista => lista[(Math.random()*lista.length)|0];
function decir(j, texto){
  if (!texto) return;
  P.burbujas[j] = {txt: texto, t: 104};
  hablar(texto, JUGADORES[j].id);
}
function aviso(txt, seg){ P.aviso = txt; P.avisoT = (seg||2.4)*60; }

/* ---------------- El curso de la partida ---------------- */
function nuevaPartida(){
  P.puntos = [0,0,0,0]; P.ronda = 1; P.primeraRonda = true; P.arranca = 0;
  repartir();
  decir(0, VOZ.fernando.saluda);
  aviso(P.primeraRonda ? 'Sale el que tenga el 6|6' : '', 3);
}
function nuevaRonda(){
  P.ronda++;
  repartir();
  decir(P.arranca, VOZ[JUGADORES[P.arranca].id].saluda);
}
function pasarTurno(){
  P.turno = (P.turno+1) % 4;
  P.espera = JUGADORES[P.turno].humano ? 10 : 42;
}
function jugarFicha(j, idx, lado){
  const f = P.manos[j][idx];
  colocar(f, lado);
  P.ultimoLado = P.cadena.length === 1 ? 'der' : lado;
  P.manos[j].splice(idx, 1);
  P.pases = 0; P.brillo = 26; P.pendiente = null;
  P.sel = Math.max(0, Math.min(P.sel, P.manos[0].length-1));
  sfx.ficha();
  /* tío Fran se echa un pedo cada vez que suelta un doble */
  if (JUGADORES[j].id === 'fran' && esDoble(f)){
    sfx.pedo();
    decir(j, VOZ.fran.pedo);
  } else if (j === 0){
    decir(j, Math.random()<0.45 ? VOZ.fernando.juega : alAzar(CHARLA.fernando));
  } else {
    decir(j, Math.random()<0.3 ? VOZ[JUGADORES[j].id].saluda : alAzar(CHARLA[JUGADORES[j].id]));
  }
  if (!P.manos[j].length){ terminarRonda(j, 'domino'); return; }
  pasarTurno();
}
function pasar(j){
  P.pases++;
  sfx.paso();
  decir(j, alAzar(PASA[JUGADORES[j].id]));
  if (P.pases >= 4){ trancar(); return; }
  pasarTurno();
}
function trancar(){
  /* tranca: gana el que menos puntos tenga en la mano */
  let mejor = 0;
  for(let i=1;i<4;i++) if (sumaMano(i) < sumaMano(mejor)) mejor = i;
  terminarRonda(mejor, 'tranca');
}
function terminarRonda(ganador, motivo){
  P.ganador = ganador; P.motivo = motivo;
  let ganados = 0;
  for(let i=0;i<4;i++) if (i !== ganador) ganados += sumaMano(i);
  P.puntos[ganador] += ganados;
  P.arranca = ganador;
  P.primeraRonda = false;
  P.ultimosPuntos = ganados;
  const campeon = P.puntos[ganador] >= META;
  P.fase = campeon ? 'finPartida' : 'finRonda';
  P.espera = 30;
  sfx[campeon ? 'gana' : 'ronda']();
  if (campeon){
    hablar(ganador===0 ? VOZ.fernando.campeon : VOZ[JUGADORES[ganador].id].saluda,
           JUGADORES[ganador].id);
  } else {
    hablar(ganador===0 ? VOZ.fernando.gana : VOZ.fernando.pierde, 'fernando');
  }
}
/* el humano intenta soltar una ficha */
function intentarJugar(idx){
  const f = P.manos[0][idx];
  if (!f) return;
  const ob = obligada();
  if (ob && !(f[0]===ob[0] && f[1]===ob[1])){
    sfx.nope(); aviso('En la primera ronda hay que salir con el 6|6', 2.4); return;
  }
  const c = cabe(f);
  if (c === null){ sfx.nope(); aviso('Esa no pega. Prueba con otra 🙂', 2); return; }
  if (c === 'ambos' && P.cadena.length){
    P.pendiente = idx; P.fase = 'lado'; sfx.elegir();
    return;
  }
  jugarFicha(0, idx, c === 'ambos' ? 'der' : c);
}

/* ============================================================
   DIBUJO
   ============================================================ */
function rect(x,y,w,h,c){ ctx.fillStyle=c; ctx.fillRect(Math.round(x),Math.round(y),w,h); }
function texto(t, x, y, tam, color, centro){
  ctx.font = 'bold '+tam+'px monospace';
  ctx.textAlign = centro ? 'center' : 'left';
  ctx.fillStyle = '#000'; ctx.fillText(t, x+2, y+2);
  ctx.fillStyle = color || '#fff'; ctx.fillText(t, x, y);
  ctx.textAlign = 'left';
}
/* los cuatro de la mesa, con los mismos monigotes de Fernando Bros */
function dibFernandoSolo(){
  rect(2,0,20,7,'#d82800'); rect(14,6,12,3,'#d82800');
  rect(4,7,16,10,'#ffc8a0'); rect(15,9,3,2,'#222'); rect(2,7,3,5,'#5a3418');
  rect(3,17,18,10,'#d82800'); rect(5,24,14,10,'#2038ec');
  rect(4,34,7,6,'#6b3410'); rect(13,34,7,6,'#6b3410');
}
function dibSalomon(t){
  rect(3,-3,18,6,'#2a1a0a');
  for(const px of [2,8,14,19]){ ctx.fillStyle='#2a1a0a'; ctx.beginPath(); ctx.arc(px+2,-1,4,0,Math.PI*2); ctx.fill(); }
  rect(4,3,16,10,'#c88a5a');
  rect(12,5,9,4,'#1a1a1a'); rect(14,6,2,2,'#8ecbff');
  rect(3,13,18,13,'#d86a28');
  const paso = Math.sin(t/16)*2;
  rect(5,26+paso*0.4,6,8,'#3a3a3a'); rect(13,26-paso*0.4,6,8,'#3a3a3a');
}
function dibYany(t){
  rect(4,-3,20,7,'#7a3aa8'); rect(2,0,4,16,'#7a3aa8'); rect(22,0,4,16,'#7a3aa8');
  rect(6,3,16,11,'#ffc8a0');
  rect(16,6,3,2,'#222'); rect(8,11,4,2,'#e07a7a');
  rect(4,14,20,22,'#40c0b0');
  rect(2,18,4,9,'#ffc8a0'); rect(22,18,4,9,'#ffc8a0');
  rect(7,36,5,8,'#ffc8a0'); rect(16,36,5,8,'#ffc8a0');
}
function dibFran(t, riendo){
  rect(4,0,20,6,'#3a2a1a');
  rect(6,4,16,12,'#ffc8a0');
  rect(16,8,3,2,'#222');
  rect(8,12,12,3,'#3a2a1a');
  rect(4,16,20,20,'#8a6a3a');
  rect(2,20,4,10,'#8a6a3a'); rect(22,20,4,10,'#8a6a3a');
  const paso = riendo ? Math.sin(t/3)*3 : 0;
  rect(6,36+paso*0.3,6,10,'#4a4a5a'); rect(15,36-paso*0.3,6,10,'#4a4a5a');
  rect(5,44,8,4,'#222'); rect(15,44,8,4,'#222');
}
/* cada personaje se dibuja centrado en (x,y) y a la escala que se pida */
function dibPersona(j, x, y, esc){
  ctx.save(); ctx.translate(x, y); ctx.scale(esc, esc);
  if (j===0){ ctx.translate(-12,-20); dibFernandoSolo(); }
  else if (j===1){ ctx.translate(-12,-16); dibSalomon(P.T); }
  else if (j===2){ ctx.translate(-14,-22); dibYany(P.T); }
  else { ctx.translate(-14,-24); dibFran(P.T, P.burbujas[3] && P.burbujas[3].txt.includes('pedo')); }
  ctx.restore();
}

/* ---------------- una ficha de dominó ---------------- */
const PUNTOS_CARA = {
  0: [], 1: [[0,0]], 2: [[-1,-1],[1,1]], 3: [[-1,-1],[0,0],[1,1]],
  4: [[-1,-1],[1,-1],[-1,1],[1,1]], 5: [[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],
  6: [[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]],
};
function caraFicha(cx, cy, ancho, alto, n, color){
  const r = Math.max(1.4, Math.min(ancho, alto) * 0.115);
  const sx = ancho*0.27, sy = alto*0.27;
  ctx.fillStyle = color || '#1d1a17';
  for (const [px,py] of PUNTOS_CARA[n]){
    ctx.beginPath(); ctx.arc(cx+px*sx, cy+py*sy, r, 0, Math.PI*2); ctx.fill();
  }
}
function dibFicha(x, y, w, h, a, b, op){
  op = op || {};
  ctx.save();
  if (op.apagada) ctx.globalAlpha = 0.45;
  const rad = Math.max(3, Math.min(w,h)*0.13);
  ctx.fillStyle = op.oculta ? '#7a1f14' : '#f6efe0';
  ctx.beginPath(); ctx.roundRect(x, y, w, h, rad); ctx.fill();
  ctx.strokeStyle = op.oculta ? '#4a0f08' : '#3a2f22';
  ctx.lineWidth = Math.max(1.5, Math.min(w,h)*0.055);
  ctx.stroke();
  if (op.oculta){
    ctx.fillStyle = 'rgba(255,255,255,0.20)';
    ctx.beginPath(); ctx.roundRect(x+w*0.22, y+h*0.22, w*0.56, h*0.56, rad*0.7); ctx.fill();
    ctx.restore(); return;
  }
  ctx.strokeStyle = '#3a2f22'; ctx.lineWidth = Math.max(1.2, Math.min(w,h)*0.045);
  ctx.beginPath();
  if (h >= w){ ctx.moveTo(x+w*0.14, y+h/2); ctx.lineTo(x+w*0.86, y+h/2); }
  else { ctx.moveTo(x+w/2, y+h*0.14); ctx.lineTo(x+w/2, y+h*0.86); }
  ctx.stroke();
  if (h >= w){
    caraFicha(x+w/2, y+h*0.25, w*0.74, h*0.40, a);
    caraFicha(x+w/2, y+h*0.75, w*0.74, h*0.40, b);
  } else {
    caraFicha(x+w*0.25, y+h/2, w*0.40, h*0.74, a);
    caraFicha(x+w*0.75, y+h/2, w*0.40, h*0.74, b);
  }
  if (op.marco){
    ctx.strokeStyle = op.marco; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.roundRect(x-3, y-3, w+6, h+6, rad+3); ctx.stroke();
  }
  ctx.restore();
}

/* ---------------- la culebra de fichas de la mesa ----------------
   Las fichas se van poniendo en renglones de izquierda a derecha, como un
   texto: cuando el renglón se llena, sigue en el de abajo. La unidad se
   encoge sola para que la culebra entera quepa siempre en el paño. */
const PANO   = {x:126, y:112, w:708, h:212};              /* el paño verde */
const CULEBRA = {x:134, y:124, w:692, h:168};             /* donde van las fichas */
function armarCadena(u){
  const hueco = 3, altoFila = u*2;
  const filas = [];
  let fila = [], ancho = 0;
  for (const p of P.cadena){
    const w = p.doble ? u : u*2;
    if (fila.length && ancho + hueco + w > CULEBRA.w){ filas.push({fila, ancho}); fila = []; ancho = 0; }
    ancho += (fila.length ? hueco : 0) + w;
    fila.push(p);
  }
  if (fila.length) filas.push({fila, ancho});
  const alto = filas.length*altoFila + (filas.length-1)*6;
  if (alto > CULEBRA.h) return null;
  const salida = [];
  let y = CULEBRA.y + (CULEBRA.h - alto)/2;
  for (const f of filas){
    let x = CULEBRA.x + (CULEBRA.w - f.ancho)/2;
    for (const p of f.fila){
      const w = p.doble ? u : u*2, h = p.doble ? u*2 : u;
      salida.push({p, x, y: y + altoFila/2 - h/2, w, h});
      x += w + hueco;
    }
    y += altoFila + 6;
  }
  return salida;
}
function planCadena(){
  for (let u = 30; u >= 10; u -= 2){
    const plan = armarCadena(u);
    if (plan) return plan;
  }
  return armarCadena(9) || [];
}

/* ---------------- la mesa ---------------- */
function dibMesa(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#0d5230'); g.addColorStop(0.55,'#12703f'); g.addColorStop(1,'#0a3f26');
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = '#7a4a1e';                                  /* marco de madera */
  ctx.beginPath(); ctx.roundRect(PANO.x-22, PANO.y-20, PANO.w+44, PANO.h+40, 22); ctx.fill();
  ctx.fillStyle = '#166b43';                                  /* el paño */
  ctx.beginPath(); ctx.roundRect(PANO.x-14, PANO.y-12, PANO.w+28, PANO.h+24, 16); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.28)'; ctx.lineWidth = 3; ctx.stroke();
}
function dibCadena(){
  const plan = planCadena();
  const ultima = P.brillo > 0 ? (P.ultimoLado==='izq' ? plan[0] : plan[plan.length-1]) : null;
  plan.forEach((c, i)=>{
    const punta = (i===0 || i===plan.length-1);
    dibFicha(c.x, c.y, c.w, c.h, c.p.a, c.p.b,
      {marco: c === ultima ? '#ffe36e' : (punta ? 'rgba(255,227,110,0.5)' : null)});
  });
}
/* los dos números abiertos, bien grandes, en las esquinas de abajo del paño */
function dibExtremos(){
  const e = extremos();
  if (!e) return;
  const y = PANO.y + PANO.h - 8;
  for (const [flecha, n, x] of [['◀', e.izq, PANO.x+78], ['▶', e.der, PANO.x+PANO.w-78]]){
    ctx.fillStyle = 'rgba(6,30,20,0.8)';
    ctx.beginPath(); ctx.roundRect(x-86, y-19, 172, 27, 9); ctx.fill();
    ctx.strokeStyle = 'rgba(255,227,110,0.65)'; ctx.lineWidth = 2; ctx.stroke();
    texto(flecha+'  AQUÍ PEGA EL '+n, x, y, 14, '#ffe36e', true);
  }
}
/* la mano de Fernando, abajo y bien grande */
const MANO = {y: 352, h: 104, hueco: 10};
function zonasMano(){
  const n = P.manos[0].length;
  if (!n) return [];
  const w = Math.min(66, (W-260-(n-1)*MANO.hueco)/n);
  const total = n*w + (n-1)*MANO.hueco;
  const x0 = (W - total)/2 + 44;
  return P.manos[0].map((f,i)=>({f, i, x: x0 + i*(w+MANO.hueco), y: MANO.y, w, h: MANO.h}));
}
function dibMano(){
  const ob = obligada();
  for (const z of zonasMano()){
    const legal = ob ? (z.f[0]===6 && z.f[1]===6) : cabe(z.f) !== null;
    const elegida = z.i === P.sel;
    const miTurno = P.turno===0 && (P.fase==='turno' || P.fase==='lado');
    const sube = (elegida && miTurno) ? 10 : 0;
    dibFicha(z.x, z.y - sube, z.w, z.h, z.f[0], z.f[1], {
      apagada: P.ayuda && miTurno && !legal,
      marco: elegida && miTurno ? '#ffe36e' : (P.ayuda && legal && miTurno ? '#5ee08a' : null),
    });
  }
}
/* una fichita chica, para los iconos y para las manos tapadas */
function fichaChica(x, y, w, h){ dibFicha(x, y, w, h, 0, 0, {oculta:true}); }
/* las manos de los otros tres se ven por detrás, en abanico */
function dibAbanico(x, y, n){
  for(let i=0;i<n;i++) fichaChica(x + i*10, y, 14, 28);
  /* el número, en su chapita, para verlo de un vistazo */
  const cx = x + (n-1)*10 + 22, cy = y + 14;
  ctx.fillStyle = '#0a3a26';
  ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#ffe36e'; ctx.lineWidth = 2; ctx.stroke();
  texto(String(n), cx, cy+6, 15, '#ffe36e', true);
}
function dibBurbuja(j, x, y){
  const b = P.burbujas[j];
  if (!b) return;
  ctx.font = 'bold 13px monospace';
  const dos = ctx.measureText(b.txt).width > 218;
  const an = Math.min(236, ctx.measureText(b.txt).width + 22);
  const al = dos ? 44 : 28;
  const bx = Math.max(6, Math.min(W-an-6, x-an/2)), by = Math.max(46, y-al);
  ctx.globalAlpha = Math.min(1, b.t/22);
  ctx.fillStyle = '#fffdf2';
  ctx.beginPath(); ctx.roundRect(bx, by, an, al, 10); ctx.fill();
  ctx.strokeStyle = JUGADORES[j].color; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = '#20180f'; ctx.textAlign = 'center';
  if (!dos) ctx.fillText(b.txt, bx+an/2, by+18);
  else {
    const corte = b.txt.lastIndexOf(' ', Math.floor(b.txt.length/2) + 6);
    ctx.fillText(b.txt.slice(0, corte), bx+an/2, by+17);
    ctx.fillText(b.txt.slice(corte+1), bx+an/2, by+33);
  }
  ctx.textAlign = 'left';
  ctx.globalAlpha = 1;
}

/* ---------------- el sitio de cada uno en la mesa ----------------
   Tía Yany enfrente, Salomón a la izquierda, tío Fran a la derecha y
   Fernando abajo, con sus fichas a la vista. */
const SITIO = {
  0: {fig:[64, 380, 2.0],  placa:[64, 430],  burbuja:[152, 344]},
  1: {fig:[48, 166, 1.9],  placa:[48, 222],  abanico:[8, 240],  burbuja:[146, 150]},
  2: {fig:[W/2-176, 70, 1.05], placa:[W/2-146, 66], abanico:[W/2+16, 52], burbuja:[W/2+40, 108]},
  3: {fig:[906, 166, 1.9], placa:[906, 222], abanico:[858, 240], burbuja:[814, 150]},
};
const enZona = (z, x, y, m) => {
  m = m===undefined ? 8 : m;
  return x>=z.x-m && x<=z.x+z.w+m && y>=z.y-m && y<=z.y+z.h+m;
};
const zonaAyuda = () => ({x: W-166, y: 8, w: 152, h: 30});
const zonaIzq   = () => ({x: 150, y: 462, w: 280, h: 50});
const zonaDer   = () => ({x: 530, y: 462, w: 280, h: 50});
function boton(z, txt, color, encendido){
  ctx.fillStyle = encendido ? color : 'rgba(6,30,20,0.78)';
  ctx.beginPath(); ctx.roundRect(z.x, z.y, z.w, z.h, 11); ctx.fill();
  ctx.strokeStyle = encendido ? '#fff' : 'rgba(255,255,255,0.5)';
  ctx.lineWidth = encendido ? 3 : 2; ctx.stroke();
  texto(txt, z.x+z.w/2, z.y+z.h/2+6, Math.min(18, z.h*0.42), encendido ? '#fff' : '#ffe36e', true);
}
function dibHUD(){
  ctx.fillStyle = 'rgba(6,26,18,0.92)'; ctx.fillRect(0,0,W,44);
  const acc = ctx.createLinearGradient(0,0,W,0);
  acc.addColorStop(0,'#7a3aa8'); acc.addColorStop(0.5,'#f8b800'); acc.addColorStop(1,'#40c0b0');
  ctx.fillStyle = acc; ctx.fillRect(0,41,W,3);
  fichaChica(16, 9, 13, 26);
  texto('EL DOMINÓ DE TÍA YANY', 38, 29, 19, '#ffe36e');
  texto('RONDA '+P.ronda+'  ·  GANA EL PRIMERO EN LLEGAR A '+META, 356, 29, 13, '#bfe8d4');
  boton(zonaAyuda(), P.ayuda ? '💡 AYUDA: SÍ' : '💡 AYUDA: NO', '#2a7a52', P.ayuda);
}
function dibJugadores(){
  for(let j=0;j<4;j++){
    const s = SITIO[j], suyo = P.turno===j && (P.fase==='turno' || P.fase==='lado');
    if (suyo){
      ctx.globalAlpha = 0.24 + Math.sin(P.T/9)*0.15;
      ctx.fillStyle = '#ffe36e';
      ctx.beginPath(); ctx.arc(s.fig[0], s.fig[1], 42, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    dibPersona(j, s.fig[0], s.fig[1], s.fig[2]);
    if (s.abanico) dibAbanico(s.abanico[0], s.abanico[1], P.manos[j].length);
    /* el nombre y los puntos; las fichas ya se cuentan en la chapita del abanico */
    const centrada = j !== 2;
    texto(JUGADORES[j].nombre, s.placa[0], s.placa[1], 13, suyo ? '#ffe36e' : '#dff2e6', centrada);
    texto(P.puntos[j]+' PUNTOS', s.placa[0], s.placa[1]+17, 12, '#bfe8d4', centrada);
  }
  for(let j=0;j<4;j++) dibBurbuja(j, SITIO[j].burbuja[0], SITIO[j].burbuja[1]);
}
function dibPie(){
  if (P.fase === 'lado'){
    const e = extremos();
    boton(zonaIzq(), '◀  PONLA EN EL '+e.izq, '#7a3aa8', true);
    boton(zonaDer(), 'PONLA EN EL '+e.der+'  ▶', '#7a3aa8', true);
    texto('¿De qué lado la pones?  ·  ✕ para elegir otra ficha', W/2, 532, 14, '#ffe36e', true);
    return;
  }
  const mio = P.turno === 0;
  texto(mio ? '👉 TE TOCA, FERNANDO — toca una ficha para ponerla'
            : '⏳ Juega '+JUGADORES[P.turno].nombre+'...',
        W/2, 486, 17, mio ? '#ffe36e' : '#bfe8d4', true);
  texto('←→ elegir  ·  ESPACIO poner  ·  o tócalas con el dedo', W/2, 514, 13, '#8fc7ab', true);
}
function dibAviso(){
  if (P.avisoT <= 0) return;
  ctx.globalAlpha = Math.min(1, P.avisoT/26);
  ctx.font = 'bold 17px monospace';
  const an = ctx.measureText(P.aviso).width + 32;
  ctx.fillStyle = 'rgba(6,26,18,0.9)';
  ctx.beginPath(); ctx.roundRect(W/2-an/2, 322, an, 34, 10); ctx.fill();
  ctx.strokeStyle = '#ffe36e'; ctx.lineWidth = 2; ctx.stroke();
  texto(P.aviso, W/2, 345, 17, '#ffe36e', true);
  ctx.globalAlpha = 1;
}
function dibPortada(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#0d5230'); g.addColorStop(1,'#07301d');
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  ctx.globalAlpha = 0.12;
  for(let i=0;i<7;i++) dibFicha(70+i*130, 56+Math.sin(P.T/40+i)*10, 42, 76, i, 6-i, {});
  ctx.globalAlpha = 1;
  texto('EL DOMINÓ DE', W/2, 200, 40, '#ffe36e', true);
  texto('TÍA YANY', W/2, 252, 54, '#40c0b0', true);
  texto('Fernando · Salomón · tía Yany · tío Fran', W/2, 296, 17, '#dff2e6', true);
  for(let j=0;j<4;j++) dibPersona(j, W/2 - 150 + j*100, 372, 2.2);
  if ((P.T>>4)%2===0) texto('TOCA LA PANTALLA PARA JUGAR', W/2, 470, 22, '#fff', true);
  texto('Doble seis · siete fichas cada uno · gana quien llegue a '+META, W/2, 508, 14, '#8fc7ab', true);
}
function dibFinal(){
  ctx.fillStyle = 'rgba(4,18,12,0.86)'; ctx.fillRect(0,0,W,H);
  const g = P.ganador, campeon = P.fase === 'finPartida';
  const caja = {x: 150, y: 82, w: 660, h: 376};
  ctx.fillStyle = '#0f5a38';
  ctx.beginPath(); ctx.roundRect(caja.x, caja.y, caja.w, caja.h, 20); ctx.fill();
  ctx.strokeStyle = '#ffe36e'; ctx.lineWidth = 4; ctx.stroke();
  texto(campeon ? '🏆 ¡CAMPEÓN!' : (P.motivo==='tranca' ? '🔒 ¡TRANCA!' : '¡DOMINÓ!'),
        W/2, caja.y+52, 34, '#ffe36e', true);
  texto(JUGADORES[g].nombre + (campeon ? ' gana la partida' : ' gana la ronda'),
        W/2, caja.y+86, 20, '#fff', true);
  dibPersona(g, W/2, caja.y+150, 2.2);
  if (!campeon) texto('+'+P.ultimosPuntos+' puntos', W/2, caja.y+212, 18, '#8fe8b4', true);
  else texto('¡'+P.puntos[g]+' puntos!', W/2, caja.y+212, 18, '#8fe8b4', true);
  for(let j=0;j<4;j++){
    const x = caja.x + 90 + j*160;
    texto(JUGADORES[j].nombre, x, caja.y+264, 13, j===g ? '#ffe36e' : '#dff2e6', true);
    texto(String(P.puntos[j]), x, caja.y+300, 28, j===g ? '#ffe36e' : '#bfe8d4', true);
  }
  if ((P.T>>4)%2===0)
    texto(campeon ? 'Toca para jugar otra partida' : 'Toca para la siguiente ronda',
          W/2, caja.y+346, 17, '#fff', true);
}
function draw(){
  if (P.fase === 'portada'){ dibPortada(); return; }
  dibMesa();
  dibCadena();
  dibMano();
  dibJugadores();
  dibExtremos();
  dibHUD();
  dibPie();
  dibAviso();
  if (P.fase === 'finRonda' || P.fase === 'finPartida') dibFinal();
}


/* ============================================================
   EL TURNO A TURNO
   ============================================================ */
function update(){
  P.T++;
  if (P.avisoT > 0) P.avisoT--;
  if (P.brillo > 0) P.brillo--;
  for(let j=0;j<4;j++){
    const b = P.burbujas[j];
    if (b){ b.t--; if (b.t <= 0) P.burbujas[j] = null; }
  }
  const k = tecla; tecla = null;
  const toque = pt.soltado; pt.soltado = false;

  if (P.fase === 'portada'){
    if (toque || k === 'Enter' || k === ' '){ nuevaPartida(); }
    return;
  }
  if (P.fase === 'finRonda' || P.fase === 'finPartida'){
    if (P.espera > 0){ P.espera--; return; }
    if (toque || k === 'Enter' || k === ' '){
      if (P.fase === 'finPartida') nuevaPartida(); else nuevaRonda();
    }
    return;
  }
  /* el botón de la ayuda se puede tocar en cualquier momento */
  if (toque && enZona(zonaAyuda(), pt.x, pt.y)){
    P.ayuda = !P.ayuda; sfx.elegir();
    aviso(P.ayuda ? 'Ayuda encendida: se marcan en verde las que pegan' : 'Ayuda apagada', 2);
    return;
  }
  if (k === 'h') { P.ayuda = !P.ayuda; sfx.elegir(); return; }

  if (P.fase === 'lado'){
    const e = extremos();
    let lado = null;
    if (toque && enZona(zonaIzq(), pt.x, pt.y)) lado = 'izq';
    else if (toque && enZona(zonaDer(), pt.x, pt.y)) lado = 'der';
    else if (k === 'ArrowLeft') lado = 'izq';
    else if (k === 'ArrowRight') lado = 'der';
    else if (k === 'Escape'){ P.pendiente = null; P.fase = 'turno'; sfx.elegir(); return; }
    if (lado){ const idx = P.pendiente; P.fase = 'turno'; jugarFicha(0, idx, lado); }
    return;
  }

  if (P.espera > 0){ P.espera--; return; }
  const j = P.turno;
  const opciones = jugadasDe(j);
  if (!opciones.length){ pasar(j); return; }

  if (!JUGADORES[j].humano){
    const op = elegirIA(j);
    jugarFicha(j, op.idx, op.lado);
    return;
  }
  /* le toca a Fernando: con el dedo o con las flechas */
  const zonas = zonasMano();
  if (toque){
    for (const z of zonas)
      if (enZona(z, pt.x, pt.y, 6)){ P.sel = z.i; intentarJugar(z.i); return; }
    return;
  }
  if (k === 'ArrowLeft'){ P.sel = (P.sel + P.manos[0].length - 1) % P.manos[0].length; sfx.elegir(); }
  else if (k === 'ArrowRight'){ P.sel = (P.sel + 1) % P.manos[0].length; sfx.elegir(); }
  else if (k === ' ' || k === 'Enter') intentarJugar(P.sel);
}

/* ---------------- bucle, con paso de tiempo fijo ---------------- */
let deudaT = 0, ultT = 0;
const PASO = 1000/60;
function bucle(){
  const t = (typeof performance !== 'undefined' && performance.now) ? performance.now() : 0;
  let dt = ultT ? t - ultT : PASO;
  ultT = t;
  if (dt > 120) dt = 120;
  deudaT = Math.max(-60, Math.min(deudaT + dt - PASO, 60));
  ocultarBotones();
  update();
  let extra = 0;
  while (deudaT >= PASO && extra < 2){ update(); deudaT -= PASO; extra++; }
  draw();
  requestAnimationFrame(bucle);
}
/* en la portada y en los marcadores los botones de la pantalla estorban */
function ocultarBotones(){
  const b = document.body;
  if (!b || !b.classList) return;
  b.classList.toggle('sinBotones',
    P.fase === 'portada' || P.fase === 'finRonda' || P.fase === 'finPartida');
}
bucle();
