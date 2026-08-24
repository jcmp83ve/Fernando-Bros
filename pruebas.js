/* ============================================================
   PRUEBAS DE FERNANDO BROS
   Se corre con:   node pruebas.js
   No hace falta navegador ni instalar nada: aquí se finge la pantalla
   (un canvas que no dibuja nada) y se hace jugar solos a los 32
   minijuegos, nivel por nivel, con toques y botones al azar. Si alguno
   se rompe, avisa. Además comprueba que todas las frases habladas
   existan tal cual en las grabaciones de voz.
   ============================================================ */
const fs = require('fs'), vm = require('vm'), path = require('path');
const RAIZ = process.argv[2] || __dirname;

function ctxFalso(){
  const c = {};
  const nada = ()=>{};
  for (const m of ['fillRect','strokeRect','clearRect','beginPath','closePath','fill','stroke',
    'moveTo','lineTo','arc','arcTo','ellipse','rect','roundRect','quadraticCurveTo','bezierCurveTo',
    'save','restore','translate','scale','rotate','transform','setTransform','resetTransform',
    'clip','drawImage','putImageData','setLineDash','fillText','strokeText'])
    c[m] = nada;
  c.measureText = t => ({width: String(t).length*8});
  c.createLinearGradient = () => ({addColorStop: nada});
  c.createRadialGradient = () => ({addColorStop: nada});
  c.createPattern = () => null;
  c.getImageData = () => ({data: new Uint8ClampedArray(4)});
  return c;
}
const oyentes = {};
const canvas = {width:960, height:540, getContext:()=>ctxFalso(),
  addEventListener:(t,f)=>{ (oyentes[t] = oyentes[t]||[]).push(f); },
  getBoundingClientRect:()=>({left:0,top:0,width:960,height:540}),
  style:{}, classList:{add(){},remove(){},toggle(){},contains(){return false}}};
function tocar(x, y){
  for (const f of oyentes.pointerdown||[]) f({clientX:x, clientY:y, preventDefault(){}});
  for (const f of oyentes.pointerup  ||[]) f({clientX:x, clientY:y, preventDefault(){}});
}
const elem = () => ({style:{}, classList:{add(){},remove(){},toggle(){},contains(){return false}},
  addEventListener:()=>{}, insertAdjacentHTML:()=>{}, appendChild:()=>{}, textContent:''});
globalThis.document = {
  getElementById: id => id==='cv' ? canvas : elem(),
  addEventListener: ()=>{}, createElement: ()=>elem(),
  body: Object.assign(elem(), {classList:{add(){},remove(){},toggle(){},contains(){return false}}}),
  documentElement: elem(),
};
globalThis.window = globalThis;
globalThis.navigator = {getGamepads: ()=>[], userAgent:'node', vibrate:()=>{}};
globalThis.speechSynthesis = {getVoices:()=>[], speak:()=>{}, cancel:()=>{}, resume:()=>{},
  pause:()=>{}, speaking:false, pending:false};
globalThis.SpeechSynthesisUtterance = function(){ return {}; };
globalThis.Audio = function(){ return {play:()=>Promise.resolve(), pause:()=>{}, load:()=>{},
  addEventListener:()=>{}, canPlayType:()=>'', src:'', currentTime:0, volume:1}; };
globalThis.performance = {now: ()=>Date.now()};
let rafs = 0;
globalThis.requestAnimationFrame = ()=>{ rafs++; return 0; };
globalThis.cancelAnimationFrame = ()=>{};
globalThis.localStorage = {getItem:()=>null, setItem:()=>{}, removeItem:()=>{}};
globalThis.matchMedia = ()=>({matches:false, addEventListener:()=>{}, addListener:()=>{}});
globalThis.alert = ()=>{};
globalThis.addEventListener = ()=>{};
globalThis.removeEventListener = ()=>{};
globalThis.AudioContext = undefined;
globalThis.innerWidth = 960; globalThis.innerHeight = 540;
globalThis.devicePixelRatio = 1;

for (const f of ['game.js','minijuegos.js'])
  vm.runInThisContext(fs.readFileSync(path.join(RAIZ, f), 'utf8'), {filename:f});

const ev = src => vm.runInThisContext(src);
const JUEGOS = ev('MJ._juegos');
let fallos = 0;

/* 1) todas las frases habladas deben existir tal cual en las grabaciones */
const CLIPS = ev('CLIPS'), AMIGOS = ev('MJ._amigos');
for (const a of AMIGOS)
  if (!CLIPS[a.frase]){ console.log('✗ sin grabación:', a.nombre, '→', a.frase); fallos++; }

/* 2) cada minijuego se arranca y se hace correr un buen rato, subiendo de
      nivel a la fuerza, para que se dibujen todos los escenarios */
for (const j of JUEGOS){
  const tope = ev('MJ._maxDe')(j.id);
  for (let n=1; n<=tope; n++){
    try{
      ev('MJ.empezar')(j.id);
      ev('MJ._ponNivel')(j.id, n);
      ev('MJ._reiniciar')(j.id);
      /* se juega de mentira: toques al azar por toda la pantalla y algún
         botón, para recorrer los caminos del dedo y del mando */
      const keys = ev('keys');
      for (let f=0; f<900; f++){
        if (f % 7 === 0) tocar(40 + Math.random()*(960-80), 60 + Math.random()*(540-80));
        keys[' ']     = (f % 23) < 2;
        keys['shift'] = (f % 41) < 2;
        keys['arrowleft']  = (f % 31) < 4;
        keys['arrowright'] = (f % 37) < 4;
        keys['arrowup']    = (f % 43) < 4;
        keys['arrowdown']  = (f % 47) < 4;
        ev('MJ.update')(); ev('MJ.draw')();
      }
      for (const k of Object.keys(ev('keys'))) ev('keys')[k] = false;
    }catch(e){
      console.log('✗', j.id, 'nivel', n, '→', e.message);
      fallos++;
      break;
    }
  }
}

/* 3bis) los cuatro juegos de los peques se juegan BIEN hasta ganar, para
        comprobar que de verdad se pueden terminar y no se atascan */
function paso(){ ev('MJ.update')(); ev('MJ.draw')(); }
function jugarHastaGanar(id, jugada, tope){
  ev('MJ.empezar')(id);
  for (let f=0; f<(tope||90000); f++){
    if (String(ev('MJ._estado')()).indexOf('fin')===0) return f;
    jugada(f);
    paso();
  }
  return -1;
}
const centro = c => [c.x + c.w/2, c.y + c.h/2];
const pruebas = {
  memoria(){
    const ME = ev('MJ._ME');
    let plan = [], k = 0;
    return f => {
      if (ME.espera>0 || ME.abiertas.length>=2) return;
      if (k >= plan.length){
        plan = [];
        const vistos = {};
        for (const c of ME.cartas){ if (c.hecha) continue; (vistos[c.a.id]=vistos[c.a.id]||[]).push(c); }
        for (const id in vistos) if (vistos[id].length===2) plan.push(vistos[id][0], vistos[id][1]);
        k = 0;
        if (!plan.length) return;
      }
      const c = plan[k++];
      if (c && !c.hecha) tocar(...centro(c));
    };
  },
  musica(){
    const MU = ev('MJ._MU');
    let i = 0, ultima = -1;
    return () => {
      if (MU.fase !== 'juega'){ i = 0; return; }
      if (MU.idx !== ultima){ ultima = MU.idx; i = MU.idx; }
      const p = MU.pads[MU.sec[MU.idx]];
      if (p) tocar(...centro(p));
      ultima = MU.idx;
    };
  },
  burbujas(){
    const BB = ev('MJ._BB');
    return () => {
      const b = BB.bur.find(b=>!b.pop && !b.malo);
      if (b) tocar(b.x, b.y);
    };
  },
  pinta(){
    const PI = ev('MJ._PI');
    return () => {
      tocar(PI.ox + Math.random()*400*PI.esc, PI.oy + Math.random()*320*PI.esc);
    };
  },
};
for (const id in pruebas){
  const n = jugarHastaGanar(id, pruebas[id]());
  if (n < 0){ console.log('✗', id, 'no se pudo terminar'); fallos++; }
  else console.log('✓', id, 'terminado en', n, 'cuadros');
}

/* 3) la sala arcade se dibuja y las tarjetas caben en la pantalla */
try{
  ev('MJ.abrirArcade')();
  for (let f=0; f<60; f++){ ev('MJ.update')(); ev('MJ.draw')(); }
}catch(e){ console.log('✗ sala arcade →', e.message); fallos++; }

console.log(fallos ? '\n'+fallos+' FALLO(S)' : '\n✓ ' + JUEGOS.length + ' minijuegos sin fallos');
process.exit(fallos ? 1 : 0);
