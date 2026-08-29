/* ============================================================
   PRUEBAS DE EL DOMINÓ DE TÍA YANY
   Se corre con:   node pruebas.js
   No hace falta navegador ni instalar nada: aquí se finge la pantalla y se
   juegan partidas enteras solas, tocando las fichas de Fernando como lo
   haría un dedo. Después de CADA jugada se revisa que la culebra siga
   pegando, que ninguna ficha se duplique o desaparezca y que los puntos
   cuadren. También comprueba que las frases marcadas «grabada» existan de
   verdad en los mp3 de Fernando Bros.
   ============================================================ */
const fs = require('fs'), vm = require('vm'), path = require('path');
const RAIZ = process.argv[2] || __dirname;
const PARTIDAS = +(process.argv[3] || 40);

function ctxFalso(){
  const c = {}, nada = ()=>{};
  for (const m of ['fillRect','strokeRect','clearRect','beginPath','closePath','fill','stroke',
    'moveTo','lineTo','arc','arcTo','ellipse','rect','roundRect','quadraticCurveTo','bezierCurveTo',
    'save','restore','translate','scale','rotate','transform','setTransform','clip','drawImage',
    'setLineDash','fillText','strokeText']) c[m] = nada;
  c.measureText = t => ({width: String(t).length*8});
  c.createLinearGradient = () => ({addColorStop: nada});
  c.createRadialGradient = () => ({addColorStop: nada});
  return c;
}
const oyentes = {};
const canvas = {width:960, height:540, getContext:()=>ctxFalso(),
  addEventListener:(t,f)=>{ (oyentes[t] = oyentes[t]||[]).push(f); },
  getBoundingClientRect:()=>({left:0,top:0,width:960,height:540}), style:{}};
const clases = ()=>({add(){},remove(){},toggle(){},contains(){return false}});
const elem = () => ({style:{}, classList:clases(), addEventListener:()=>{},
  insertAdjacentHTML:()=>{}, appendChild:()=>{}});
globalThis.document = {
  getElementById: id => id==='cv' ? canvas : elem(),
  addEventListener: ()=>{}, createElement: ()=>elem(),
  body: {classList: clases(), appendChild:()=>{}, insertAdjacentHTML:()=>{}},
};
globalThis.window = globalThis;
globalThis.addEventListener = ()=>{};
globalThis.speechSynthesis = {getVoices:()=>[], speak:()=>{}, cancel:()=>{}, resume:()=>{},
  speaking:false, pending:false};
globalThis.SpeechSynthesisUtterance = function(){ return {}; };
globalThis.Audio = function(){ return {play:()=>Promise.resolve(), pause:()=>{}, load:()=>{},
  addEventListener:()=>{}, src:'', currentTime:0}; };
globalThis.AudioContext = undefined;
globalThis.performance = {now: ()=>Date.now()};
globalThis.requestAnimationFrame = ()=>0;

vm.runInThisContext(fs.readFileSync(path.join(RAIZ,'domino.js'),'utf8'), {filename:'domino.js'});
const ev = src => vm.runInThisContext(src);
const P = ev('P'), CLIPS = ev('CLIPS'), VOZ = ev('VOZ'), JUGADORES = ev('JUGADORES');
const update = ev('update'), draw = ev('draw'), suma = ev('suma');
let fallos = 0;
const fallo = (...m) => { console.log('✗', ...m); fallos++; };

/* 1) las frases marcadas «grabada» tienen que existir tal cual en los mp3 */
const grabadas = [...Object.values(VOZ.fernando), VOZ.salomon.saluda, VOZ.yany.saluda,
                  VOZ.fran.saluda, VOZ.fran.pedo];
for (const f of grabadas) if (!CLIPS[f]) fallo('sin grabación:', JSON.stringify(f));

/* 2) invariantes que deben cumplirse en TODO momento */
const clave = f => f[0]+'|'+f[1];
function revisar(donde){
  /* la culebra pega consigo misma */
  for (let i=0;i<P.cadena.length-1;i++)
    if (P.cadena[i].b !== P.cadena[i+1].a)
      return fallo(donde, 'la culebra no pega en la posición', i);
  /* las 28 fichas siguen existiendo, sin repetirse */
  const vistas = new Set();
  const anota = f => {
    const [a,b] = f[0]<=f[1] ? f : [f[1],f[0]];
    const k = a+'|'+b;
    if (vistas.has(k)) return fallo(donde, 'ficha repetida', k);
    vistas.add(k);
  };
  for (const p of P.cadena) anota([p.a, p.b]);
  for (const mano of P.manos) for (const f of mano) anota(f);
  if (vistas.size !== 28) fallo(donde, 'hay', vistas.size, 'fichas en vez de 28');
  /* nadie puede tener puntos negativos ni manos de más de siete */
  for (let j=0;j<4;j++){
    if (P.manos[j].length > 7) fallo(donde, JUGADORES[j].nombre, 'tiene', P.manos[j].length, 'fichas');
    if (P.puntos[j] < 0) fallo(donde, 'puntos negativos');
  }
}

/* 3) se juegan partidas enteras: el dedo toca las fichas de Fernando */
function tocar(x, y){
  for (const f of oyentes.pointerdown||[]) f({clientX:x, clientY:y});
  for (const f of oyentes.pointerup  ||[]) f({clientX:x, clientY:y});
}
const zonasMano = ev('zonasMano'), jugadasDe = ev('jugadasDe');
const zonaIzq = ev('zonaIzq'), zonaDer = ev('zonaDer');
const centro = z => [z.x + z.w/2, z.y + z.h/2];

let partidas = 0, rondas = 0, trancas = 0, dominos = 0, ganadasPorFernando = 0;
let faseAntes = 'portada';
for (let paso = 0; paso < 900000 && partidas < PARTIDAS; paso++){
  /* el dedo, según en qué esté el juego */
  if (P.fase === 'portada') tocar(480, 470);
  else if (P.fase === 'finRonda' || P.fase === 'finPartida'){
    if (P.espera <= 0) tocar(480, 400);
  }
  else if (P.fase === 'lado') tocar(...centro(Math.random()<0.5 ? zonaIzq() : zonaDer()));
  else if (P.fase === 'turno' && P.turno === 0 && P.espera <= 0){
    const ops = jugadasDe(0);
    if (ops.length){
      const op = ops[(Math.random()*ops.length)|0];
      const z = zonasMano().find(z => z.i === op.idx);
      if (z) tocar(...centro(z));
      else fallo('no se encontró en pantalla la ficha', op.idx);
    }
  }
  update(); draw();
  revisar('paso '+paso);
  if (fallos > 6) break;
  if (P.fase !== faseAntes){
    if (P.fase === 'finRonda' || P.fase === 'finPartida'){
      rondas++;
      if (P.motivo === 'tranca') trancas++; else dominos++;
      /* el ganador se lleva exactamente lo que les quedó a los otros tres */
      let esperado = 0;
      for (let j=0;j<4;j++) if (j !== P.ganador) esperado += P.manos[j].reduce((s,f)=>s+suma(f),0);
      if (esperado !== P.ultimosPuntos) fallo('los puntos de la ronda no cuadran');
      if (P.motivo === 'domino' && P.manos[P.ganador].length !== 0)
        fallo('cantó dominó con fichas en la mano');
      if (P.fase === 'finPartida'){
        partidas++;
        if (P.puntos[P.ganador] < 100) fallo('ganó la partida sin llegar a 100');
        if (P.ganador === 0) ganadasPorFernando++;
      }
    }
    faseAntes = P.fase;
  }
}
if (partidas < PARTIDAS) fallo('solo se terminaron', partidas, 'de', PARTIDAS, 'partidas');

console.log(partidas+' partidas · '+rondas+' rondas ('+dominos+' dominó, '+trancas+' trancas)');
console.log('Fernando ganó '+ganadasPorFernando+' de '+partidas);
console.log(fallos ? '\n'+fallos+' FALLO(S)' : '\n✓ sin fallos');
process.exit(fallos ? 1 : 0);
