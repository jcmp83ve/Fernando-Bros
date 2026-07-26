'use strict';
/* ============================================================
   SALA ARCADE DE FERNANDO BROS
   Minijuegos con los personajes del juego:
     · FERNANDO BIRDS  (estilo Angry Birds)
     · FERNANDO DIG    (estilo Dig Dug)
     · FERNANDO KONG   (estilo Donkey Kong)
     · FERNANDO CONTRA (estilo Contra)
   ============================================================ */
var MJ = (function(){   // var: seguro para 'typeof MJ' desde game.js

const JUEGOS = [
  {id:'birds',  nombre:'FERNANDO BIRDS',  emoji:'🐦', color:'#2a8a4a',
   desc:'Tiros infinitos · poder de cada perrito en el aire'},
  {id:'dig',    nombre:'FERNANDO DIG',    emoji:'⛏️', color:'#a05a28',
   desc:'Cava e infla goombas · poder: pedo de tío Fran'},
  {id:'kong',   nombre:'FERNANDO KONG',   emoji:'🛢️', color:'#2a5ab0',
   desc:'Sube hasta mamá · poder: martillo pichunguito'},
  {id:'contra', nombre:'FERNANDO CONTRA', emoji:'🔫', color:'#7a2a8a',
   desc:'Dispara hasta el jefe · poder: perrito rojo gigante'},
  {id:'globos', nombre:'FERNANDO GLOBOS', emoji:'🎈', color:'#2a6ad0',
   desc:'Vuela con globos · poder: impulso pedorro'},
  {id:'bomba',  nombre:'FERNANDO BOMBAS',  emoji:'💣', color:'#a02a3a',
   desc:'Bombas y poderes · poder: súper pedo en cruz'},
  {id:'hielo',  nombre:'FERNANDO HIELO',   emoji:'🧊', color:'#2a8aa0',
   desc:'Sube hasta Cucú · poder: salto de papá'},
];
let sel = 0, modo = null, T = 0, msg = '', msgT = 0, resultado = 0;
/* controles: la flecha arriba sirve para SUBIR, nunca para saltar */
const mIzq   = ()=> keys['arrowleft']||keys['a']||mando['arrowleft'];
const mDer   = ()=> keys['arrowright']||keys['d']||mando['arrowright'];
const mArr   = ()=> keys['arrowup']||keys['w']||mando['arrowup'];
const mAbj   = ()=> keys['arrowdown']||keys['s']||mando['arrowdown'];
const mSalta = ()=> keys[' ']||keys['z']||mando[' '];
const mAccion= ()=> keys['shift']||keys['x']||mando['shift'];
let puntosMJ = 0;               /* marcador propio de cada partida */
function sumar(n){ puntosMJ += n; puntos += n; }

/* ---------- utilidades ---------- */
const HUD2 = 44;
function texto(t, x, y, tam, color, centro){
  ctx.font = 'bold '+tam+'px monospace';
  ctx.textAlign = centro ? 'center' : 'left';
  ctx.fillStyle = '#000'; ctx.fillText(t, x+2, y+2);
  ctx.fillStyle = color || '#fff'; ctx.fillText(t, x, y);
  ctx.textAlign = 'left';
}
function aviso(t, seg){ msg = t; msgT = (seg||2)*60; }
function hudMJ(titulo, izqTxt, derTxt){
  ctx.fillStyle='rgba(8,10,24,0.92)'; ctx.fillRect(0,0,W,HUD2);
  const acc = ctx.createLinearGradient(0,0,W,0);
  acc.addColorStop(0,'#d82800'); acc.addColorStop(0.5,'#f8b800'); acc.addColorStop(1,'#2a6ad0');
  ctx.fillStyle=acc; ctx.fillRect(0,HUD2-3,W,3);
  texto(titulo, 16, 29, 17, '#f8b800');
  if (izqTxt) texto(izqTxt, 290, 29, 16, '#fff');
  if (derTxt) texto(derTxt, 560, 28, 13, '#8ecbff');
  const z = zonaSalir();
  ctx.fillStyle='rgba(255,255,255,0.16)';
  ctx.beginPath(); ctx.roundRect(z.x, z.y, z.w, z.h, 9); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=2; ctx.stroke();
  texto('✕ SALIR', z.x+z.w/2, z.y+20, 13, '#fff', true);
}
function zonaSalir(){ return {x: W-108, y: 8, w: 96, h: 29}; }
/* botón de volver de la propia sala arcade (aquí no hay marcador) */
function zonaVolver(){ return {x: 22, y: 22, w: 150, h: 42}; }

/* ---------- vidas infinitas ----------
   En los minijuegos nadie pierde nunca: un golpe solo cuesta un susto,
   deja a Fernando parpadeando un rato y lo devuelve a un sitio seguro. */
function susto(obj, frase){
  obj.sustos = (obj.sustos||0) + 1;
  sfx.dano(); sacudir(4);
  aviso(frase || '¡Ay! Vidas infinitas: sigue jugando', 1.4);
}
const corazonesInf = obj => '♥∞   😵'+(obj.sustos||0);

/* nube de pedo reutilizable (el poder favorito de tío Fran) */
function nubePedo(x, y, n){
  for(let i=0;i<(n||10);i++)
    parts.push({tipo:'pedo', x:x+(Math.random()-0.5)*26, y:y+(Math.random()-0.5)*18,
                vx:(Math.random()-0.5)*2.6, vy:-0.5-Math.random()*1.1, t:34+((Math.random()*20)|0)});
}

/* medidor del poder de cada minijuego, abajo a la derecha */
function barraPoder(nombre, frac, encendido){
  const w = 216, x = W-w-16, y = H-42;
  ctx.fillStyle = 'rgba(8,10,24,0.72)';
  ctx.beginPath(); ctx.roundRect(x, y, w, 30, 9); ctx.fill();
  ctx.strokeStyle = encendido ? '#ffe36e' : 'rgba(255,255,255,0.32)';
  ctx.lineWidth = encendido ? 3 : 2; ctx.stroke();
  const bx = x+10, bw = w-20;
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.beginPath(); ctx.roundRect(bx, y+20, bw, 6, 3); ctx.fill();
  ctx.fillStyle = encendido ? '#ffe36e' : (frac>=1 ? '#5ee08a' : '#8ecbff');
  ctx.beginPath(); ctx.roundRect(bx, y+20, bw*Math.max(0,Math.min(1,frac)), 6, 3); ctx.fill();
  texto(nombre, x+w/2, y+15, 13, frac>=1||encendido ? '#ffe36e' : '#cfd8ff', true);
}
function pantallaFin(gano, titulo, sub){
  const g = ctx.createLinearGradient(0,0,0,H);
  if (gano){ g.addColorStop(0,'#0a3a1a'); g.addColorStop(1,'#2a8a4a'); }
  else { g.addColorStop(0,'#3a0a1a'); g.addColorStop(1,'#8a2a3a'); }
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  texto(gano ? '🏆 '+titulo : titulo, W/2, 200, 46, gano?'#ffe36e':'#ffb0b0', true);
  texto(sub, W/2, 260, 20, '#fff', true);
  texto('PUNTOS: '+puntosMJ, W/2, 320, 22, '#8ecbff', true);
  if ((T>>4)%2===0) texto('ENTER o toca para volver a la sala', W/2, 420, 20, '#fff', true);
}
/* control táctil propio (arrastrar en Birds) */
let pt = {x:0, y:0, abajo:false, soltado:false};
try{
  const rel = e => {
    const r = cv.getBoundingClientRect();
    return { x:(e.clientX-r.left)*(W/r.width), y:(e.clientY-r.top)*(H/r.height) };
  };
  cv.addEventListener('pointerdown', e=>{ if(!activo()) return; const p=rel(e); pt.x=p.x; pt.y=p.y; pt.abajo=true; });
  cv.addEventListener('pointermove', e=>{ if(!activo()||!pt.abajo) return; const p=rel(e); pt.x=p.x; pt.y=p.y; });
  cv.addEventListener('pointerup',   e=>{ if(!activo()) return; if(pt.abajo){ pt.abajo=false; pt.soltado=true; } });
}catch(e){}

/* ============================================================
   1) FERNANDO BIRDS
   ============================================================ */
const B = { proy:null, extras:[], cajas:[], bichos:[], tiros:3, listos:[], apunta:false, ang:-0.6, fza:0,
            fase:'espera', disparos:0, podPrev:false, sustos:0 };
const SUELO_B = 470;
/* nombre del perrito que toca lanzar (los tiros son infinitos y van rotando) */
const bichoTurno = () => B.listos[B.disparos % B.listos.length];
function iniciarBirds(){
  B.tiros = 0; B.fase='espera'; B.proy=null; B.extras=[]; B.ang=-0.6; B.fza=0; B.apunta=false; B.finT=undefined;
  B.disparos = 0; B.podPrev = false; B.sustos = 0;
  B.listos = ['penny','sheldon','cucu'];
  B.cajas = []; B.bichos = [];
  const base = 560;
  /* torre de cajas con goombas dentro */
  const col = (x, n, y0) => { for(let i=0;i<n;i++) B.cajas.push({x, y:y0-i*36, w:36, h:36, vx:0, vy:0, vida:2}); };
  col(base, 3, SUELO_B-36); col(base+150, 3, SUELO_B-36);
  for(let i=0;i<4;i++) B.cajas.push({x:base+i*38, y:SUELO_B-36*3-36, w:36, h:36, vx:0, vy:0, vida:2});
  col(base+300, 2, SUELO_B-36);
  B.bichos.push({x:base+46, y:SUELO_B-30, vx:0, vy:0, vivo:true});
  B.bichos.push({x:base+96, y:SUELO_B-30, vx:0, vy:0, vivo:true});
  B.bichos.push({x:base+60, y:SUELO_B-36*4-30, vx:0, vy:0, vivo:true});
  B.bichos.push({x:base+310, y:SUELO_B-36*2-30, vx:0, vy:0, vivo:true});
  aviso('¡Arrastra y suelta! En pleno vuelo toca otra vez: cada perrito tiene su poder', 4);
}
/* ---- poderes en el aire: uno distinto por personaje ---- */
function poderBird(p){
  if (p.usado) return;
  p.usado = true;
  if (p.tipo==='penny'){                       /* Penny cohete */
    const m = Math.hypot(p.vx, p.vy) || 1;
    p.vx = p.vx/m*23; p.vy = p.vy/m*23;
    sfx.fuego(); aviso('🚀 ¡PENNY COHETE!', 1.4);
    for(let i=0;i<8;i++) parts.push({tipo:'estrellita', x:p.x, y:p.y,
      vx:-p.vx*0.2+(Math.random()-0.5)*2, vy:-p.vy*0.2+(Math.random()-0.5)*2, t:24});
  } else if (p.tipo==='sheldon'){              /* Sheldon pedorro */
    nubePedo(p.x, p.y, 18); sfx.pedo(); sacudir(6);
    for(const c of B.cajas){
      const d = Math.hypot(c.x+18-p.x, c.y+18-p.y);
      if (d < 155){ c.vida--; c.vx += (c.x+18-p.x)/(d||1)*7; c.vy += (c.y+18-p.y)/(d||1)*6 - 2.5; }
    }
    for(const b of B.bichos)
      if (b.vivo && Math.hypot(b.x-p.x, b.y-p.y) < 115){ b.vivo = false; sumar(500); sfx.pisoton(); }
    p.vx *= 0.25; p.vy = -2.5;
    aviso('💨 ¡Qué pedo tan grande, tío Fran!', 2);
    hablar('¡Qué pedo tan grande, tío Fran!');
  } else {                                     /* Cucú se multiplica por tres */
    for(const giro of [-0.32, 0.32]){
      const co = Math.cos(giro), si = Math.sin(giro);
      B.extras.push({x:p.x, y:p.y, vx:p.vx*co - p.vy*si, vy:p.vx*si + p.vy*co,
                     tipo:'cucu', t:p.t, espera:0, usado:true});
    }
    sfx.huevo(); aviso('👧 ¡CUCÚ SE MULTIPLICA POR TRES!', 1.8);
  }
}
/* física de un proyectil; devuelve false cuando ya terminó su vuelo */
function fisicaProy(p){
  if (p.espera>0) p.espera--;
  p.vy += 0.42; p.x += p.vx; p.y += p.vy; p.t++;
  if (p.y > SUELO_B-14){ p.y = SUELO_B-14; p.vy *= -0.42; p.vx *= 0.7; }
  for(const c of B.cajas){
    if (p.x+12>c.x && p.x-12<c.x+c.w && p.y+12>c.y && p.y-12<c.y+c.h){
      if (p.espera>0) continue;                 /* evita golpear 60 veces por segundo */
      p.espera = 8;
      const fuerza = Math.hypot(p.vx,p.vy);
      c.vx += p.vx*0.5; c.vy += p.vy*0.4 - 1.5;
      if (fuerza>6.5){ c.vida--; sacudir(3); }
      /* salir por el lado por donde entró */
      if (Math.abs(p.vx) > Math.abs(p.vy)) p.x = p.vx>0 ? c.x-13 : c.x+c.w+13;
      else p.y = p.vy>0 ? c.y-13 : c.y+c.h+13;
      p.vx *= -0.3; p.vy *= 0.45;
      sfx.romper();
    }
  }
  for(const b of B.bichos){
    if (b.vivo && Math.abs(p.x-b.x)<24 && Math.abs(p.y-b.y)<24){
      b.vivo=false; sumar(500); sfx.pisoton(); sacudir(4);
      for(let i=0;i<6;i++) parts.push({tipo:'estrellita', x:b.x, y:b.y, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*3, t:34});
    }
  }
  if (p.x>W+400 || p.x<-200) return false;
  if (p.t>260 || (Math.abs(p.vx)<0.4 && Math.abs(p.vy)<0.5 && p.y>=SUELO_B-16)) return false;
  return true;
}
function updateBirds(){
  const RES = {x:150, y:SUELO_B-90};
  /* apuntar */
  if (B.fase==='espera'){
    if (pt.abajo){
      B.apunta = true;
      const dx = RES.x-pt.x, dy = RES.y-pt.y;
      B.ang = Math.atan2(dy, dx);
      B.fza = Math.min(Math.hypot(dx,dy)/9, 20);
    } else if (B.apunta && B.fza>2){
      B.apunta = false;
      B.proy = {x:RES.x, y:RES.y, vx:Math.cos(B.ang)*B.fza, vy:Math.sin(B.ang)*B.fza,
                tipo:bichoTurno(), t:0, espera:0};
      B.fase='vuela'; B.disparos++; B.tiros++; B.fza=0; sfx.salto();
    } else {
      B.apunta = false;
      /* control por teclas para quien juega sin pantalla táctil */
      if (mIzq()) B.ang -= 0.02;
      if (mDer()) B.ang += 0.02;
      if (mSalta()) B.fza = Math.min(B.fza+0.35, 20);
      else if (B.fza > 2){
        B.proy = {x:RES.x, y:RES.y, vx:Math.cos(B.ang)*B.fza, vy:Math.sin(B.ang)*B.fza,
                  tipo:bichoTurno(), t:0, espera:0};
        B.fase='vuela'; B.disparos++; B.tiros++; sfx.salto(); B.fza=0;
      }
    }
    pt.soltado = false;
    B.podPrev = mSalta() || mAccion();
  } else {
    /* en pleno vuelo, un toque (o A/B) activa el poder del personaje */
    const pulsa = mSalta() || mAccion();
    if ((pt.soltado || (pulsa && !B.podPrev)) && B.proy) poderBird(B.proy);
    pt.soltado = false;
    B.podPrev = pulsa;
  }
  /* proyectiles: el principal y las Cucús clonadas */
  if (B.proy && !fisicaProy(B.proy)) B.proy = null;
  for(const p of B.extras) p.fuera = !fisicaProy(p);
  B.extras = B.extras.filter(p=>!p.fuera);
  if (!B.proy && B.extras.length===0 && B.fase==='vuela') B.fase='espera';
  /* cajas: caída, apilado y rotura */
  for(const c of B.cajas){
    if (c.vida<=0) continue;
    c.vy += 0.42; c.x += c.vx; c.y += c.vy; c.vx *= 0.94;
    if (c.y+c.h > SUELO_B){ c.y = SUELO_B-c.h; c.vy = c.vy>3 ? -c.vy*0.2 : 0; c.vx *= 0.7; }
    for(const o of B.cajas){
      if (o===c || o.vida<=0) continue;
      if (c.x+c.w>o.x+4 && c.x<o.x+o.w-4 && c.y+c.h>o.y && c.y+c.h<o.y+o.h && c.vy>=0){
        c.y = o.y-c.h; c.vy = 0; c.vx *= 0.8;
      }
    }
  }
  B.cajas = B.cajas.filter(c=>{
    if (c.vida<=0){
      sumar(100);
      for(let i=0;i<4;i++) parts.push({tipo:'ladrillo', x:c.x+18, y:c.y+18, vx:(Math.random()-0.5)*5, vy:-2-Math.random()*3, t:40});
      return false;
    }
    return true;
  });
  /* bichos: caen con las cajas y mueren aplastados */
  for(const b of B.bichos){
    if (!b.vivo) continue;
    b.vy += 0.42; b.y += b.vy; b.x += b.vx; b.vx *= 0.93;
    if (b.y > SUELO_B-14){ b.y = SUELO_B-14; b.vy = 0; }
    for(const c of B.cajas){
      if (Math.abs(b.x-(c.x+18))<26 && b.y-c.y>-30 && b.y-c.y<8 && c.vy>4){
        b.vivo=false; sumar(500); sfx.pisoton();
      }
      if (b.x+12>c.x && b.x-12<c.x+c.w && b.y+14>c.y && b.y+14<c.y+c.h+6 && b.vy>=0){
        b.y = c.y-14; b.vy = 0;
      }
    }
  }
  /* fin: solo se gana; los lanzamientos son infinitos */
  const quedan = B.bichos.filter(b=>b.vivo).length;
  if (quedan===0 && !B.proy && B.extras.length===0){
    resultado = 1; modo='finBirds'; sfx.meta();
    hablar('¡Toma, pichungazo!');
  }
}
function drawBirds(){
  /* cielo y suelo */
  const g = ctx.createLinearGradient(0,0,0,SUELO_B);
  g.addColorStop(0,'#5c94fc'); g.addColorStop(1,'#a8dcf8');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,SUELO_B);
  ctx.fillStyle='#3fae2f'; ctx.fillRect(0,SUELO_B,W,H-SUELO_B);
  ctx.fillStyle='#2f8f22'; ctx.fillRect(0,SUELO_B,W,8);
  for(let i=0;i<8;i++){ ctx.fillStyle='rgba(255,255,255,0.85)';
    ctx.beginPath(); ctx.ellipse(120+i*230-(T*0.2)%1800, 90+(i%3)*40, 44, 15, 0, 0, Math.PI*2); ctx.fill(); }
  /* resortera */
  const RES = {x:150, y:SUELO_B-90};
  rect(RES.x-6, RES.y, 12, 90, '#8a5a2a');
  rect(RES.x-24, RES.y-34, 10, 40, '#8a5a2a');
  rect(RES.x+14, RES.y-34, 10, 40, '#8a5a2a');
  /* cajas */
  for(const c of B.cajas){
    rect(c.x, c.y, c.w, c.h, '#c88a3a');
    rect(c.x+2, c.y+2, c.w-4, 4, 'rgba(255,255,255,0.25)');
    rect(c.x+2, c.y+c.h-5, c.w-4, 3, 'rgba(0,0,0,0.3)');
    ctx.strokeStyle='#7a4a10'; ctx.lineWidth=2; ctx.strokeRect(c.x+1, c.y+1, c.w-2, c.h-2);
  }
  /* goombas */
  for(const b of B.bichos) if (b.vivo){ sombra(b.x, SUELO_B+2, 16); dibGoomba(b.x-13, b.y-12, T); }
  /* proyectiles */
  for(const p of (B.proy ? [B.proy].concat(B.extras) : B.extras)){
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.t*0.15);
    if (p.tipo==='cucu') dibCucu(-11,-14,1,T);
    else { ctx.translate(-13,-10); dibPerroSolo(p.tipo==='penny'?'#222':'#8a5a2a'); }
    ctx.restore();
    if (!p.usado){                                  /* aro que recuerda que tiene poder */
      ctx.strokeStyle='rgba(255,227,110,'+(0.45+Math.sin(T/5)*0.3)+')'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(p.x, p.y, 22+Math.sin(T/6)*2, 0, Math.PI*2); ctx.stroke();
    }
  }
  /* Fernando junto a la resortera */
  ctx.save(); ctx.translate(64, SUELO_B-52); ctx.scale(1.3,1.3); dibFernandoSolo(); ctx.restore();
  /* guía de puntería */
  if (B.fase==='espera'){
    const f = B.apunta ? B.fza : B.fza;
    if (f>1){
      ctx.fillStyle='rgba(255,255,255,0.55)';
      for(let i=1;i<=9;i++){
        const t2=i*4.2;
        ctx.beginPath();
        ctx.arc(RES.x+Math.cos(B.ang)*f*t2, RES.y+Math.sin(B.ang)*f*t2+0.21*t2*t2, 3.4, 0, Math.PI*2);
        ctx.fill();
      }
    }
  }
  /* a quién le toca lanzar (la munición nunca se acaba) */
  for(let i=0;i<3;i++){
    const t2 = B.listos[(B.disparos+i) % B.listos.length];
    ctx.save(); ctx.translate(40+i*34, SUELO_B+34); ctx.scale(i===0?1:0.7, i===0?1:0.7);
    ctx.globalAlpha = i===0 ? 1 : 0.5;
    if (t2==='cucu') dibCucu(-8,-14,1,T); else dibPerroSolo(t2==='penny'?'#222':'#8a5a2a');
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  texto('∞', 40+3*34+6, SUELO_B+50, 24, '#ffe36e');
  const enVuelo = B.proy && !B.proy.usado;
  hudMJ('🐦 BIRDS', 'GOOMBAS: '+B.bichos.filter(b=>b.vivo).length+'   TIROS: ∞', 'arrastra y suelta');
  const nomP = {penny:'🚀 PENNY COHETE', sheldon:'💨 PEDO DE SHELDON', cucu:'👧 CUCÚ POR TRES'};
  barraPoder(enVuelo ? '¡TOCA YA! '+nomP[B.proy.tipo] : 'PODER: '+nomP[bichoTurno()],
             enVuelo ? 1 : 0.34, !!enVuelo);
}

/* ============================================================
   2) FERNANDO DIG  (estilo Dig Dug)
   ============================================================ */
const D = { g:[], jx:0, jy:0, dir:0, arpon:0, arponL:0, enem:[], rocas:[], px:0, py:0, vida:3, inv:0,
            disparoPrev:false, sustos:0, pedo:0, pedoCd:0, pedoPrev:false };
const PEDO_CD = 280;
const DC = 40, DW = 24, DH = 11, DY0 = 60;
function iniciarDig(){
  D.g = Array.from({length:DH}, (_,y)=> Array.from({length:DW}, (_,x)=> y<1 ? 0 : 1));
  D.jx = 2; D.jy = 1; D.dir = 1; D.arpon = 0; D.arponL = 0;
  D.px = D.jx*DC; D.py = DY0+D.jy*DC; D.vida = 3; D.inv = 0; D.disparoPrev = false;
  D.sustos = 0; D.pedo = 0; D.pedoCd = 0; D.pedoPrev = false;
  D.g[1][1] = 0; D.g[1][2] = 0; D.g[1][3] = 0;
  /* los goombas arrancan lejos de Fernando para que nadie muera de entrada */
  D.enem = [
    {x:18*DC, y:DY0+4*DC, vivo:true, infla:0, t:0, golpe:0},
    {x:21*DC, y:DY0+7*DC, vivo:true, infla:0, t:0, golpe:0},
    {x:9*DC,  y:DY0+9*DC, vivo:true, infla:0, t:0, golpe:0},
    {x:16*DC, y:DY0+9*DC, vivo:true, infla:0, t:0, golpe:0},
  ];
  for(const e of D.enem){ const cx=(e.x/DC)|0, cy=((e.y-DY0)/DC)|0; D.g[cy][cx]=0; }
  D.rocas = [{cx:6, cae:false, y:DY0+2*DC, quieta:false}, {cx:13, cae:false, y:DY0+4*DC, quieta:false},
             {cx:19, cae:false, y:DY0+7*DC, quieta:false}];
  aviso('¡Cava y usa B para inflar! Con A sueltas el PEDO DE TÍO FRAN 💨', 4);
}
function celdaLibre(cx, cy){ return cx>=0 && cx<DW && cy>=0 && cy<DH; }
function danoDig(){
  if (D.inv>0) return;
  D.inv = 120; susto(D, '¡Ay! Vidas infinitas: vuelves arriba y sigues');
  /* lo devuelve a la entrada para que pueda reorganizarse */
  D.px = 2*DC; D.py = DY0+DC;
}
function updateDig(){
  /* movimiento por rejilla suave */
  if (D.inv>0) D.inv--;
  const vel = 2.6;
  let mx=0, my=0;
  if (mIzq()) mx=-1; else if (mDer()) mx=1;
  else if (mArr()) my=-1; else if (mAbj()) my=1;
  if (mx){ D.dir = mx>0?1:3; D.px += mx*vel; }
  else if (my){ D.dir = my>0?2:0; D.py += my*vel; }
  D.px = Math.max(0, Math.min((DW-1)*DC, D.px));
  D.py = Math.max(DY0, Math.min(DY0+(DH-1)*DC, D.py));
  /* excavar */
  const cx = Math.round(D.px/DC), cy = Math.round((D.py-DY0)/DC);
  if (celdaLibre(cx,cy) && D.g[cy][cx]===1){ D.g[cy][cx]=0; sumar(10); }
  /* arpón / bomba de aire */
  if (mAccion() && !D.disparoPrev && D.arpon<=0){ D.arpon = 40; D.arponL = 0; sfx.fuego(); }
  D.disparoPrev = mAccion();
  if (D.arpon>0){
    D.arpon--;
    D.arponL = Math.min(D.arponL+7, 110);
    const dx=[0,1,0,-1][D.dir], dy=[-1,0,1,0][D.dir];
    for(const e of D.enem){
      if (!e.vivo) continue;
      for(let l=10; l<=D.arponL; l+=12){
        if (Math.abs(e.x-(D.px+dx*l))<20 && Math.abs(e.y-(D.py+dy*l))<20){
          e.infla += 0.06; e.golpe = 10;
          if (e.infla>=1){ e.vivo=false; sumar(800); sfx.pisoton(); sacudir(3);
            for(let i=0;i<8;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y, vx:(Math.random()-0.5)*5, vy:-2-Math.random()*3, t:34}); }
          break;
        }
      }
    }
  } else {
    D.arponL = 0;
    for(const e of D.enem) if (e.infla>0) e.infla = Math.max(0, e.infla-0.004);
  }
  /* ---- PODER: el pedo de tío Fran infla a todos los goombas de alrededor ---- */
  if (D.pedoCd>0) D.pedoCd--;
  if (mSalta() && !D.pedoPrev && D.pedo<=0 && D.pedoCd<=0){
    D.pedo = 80; D.pedoCd = PEDO_CD; sfx.pedo(); sacudir(5);
    aviso('💨 ¡PEDO DE TÍO FRAN!', 2);
    hablar('¡Qué pedo tan grande, tío Fran!');
  }
  D.pedoPrev = mSalta();
  if (D.pedo>0){
    D.pedo--;
    if (D.pedo%4===0) nubePedo(D.px, D.py, 3);
    for(const e of D.enem){
      if (!e.vivo) continue;
      if (Math.hypot(e.x-D.px, e.y-D.py) < 175){
        e.infla += 0.022; e.golpe = 4;
        if (e.infla>=1){
          e.vivo = false; sumar(900); sfx.pisoton();
          for(let i=0;i<8;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y, vx:(Math.random()-0.5)*5, vy:-2-Math.random()*3, t:34});
        }
      }
    }
  }
  /* enemigos: persiguen por los túneles */
  for(const e of D.enem){
    if (!e.vivo) continue;
    e.t++;
    if (e.golpe>0){ e.golpe--; continue; }
    const v = 1.05 + e.infla*0.2;
    const ecx = Math.round(e.x/DC), ecy = Math.round((e.y-DY0)/DC);
    const dx = D.px-e.x, dy = D.py-e.y;
    let nx = e.x, ny = e.y;
    if (Math.abs(dx)>Math.abs(dy)) nx += Math.sign(dx)*v; else ny += Math.sign(dy)*v;
    const ncx = Math.round(nx/DC), ncy = Math.round((ny-DY0)/DC);
    if (celdaLibre(ncx,ncy) && D.g[ncy][ncx]===0){ e.x=nx; e.y=ny; }
    else {  /* intenta el otro eje */
      let ax = e.x + (Math.abs(dx)>Math.abs(dy) ? 0 : Math.sign(dx)*v);
      let ay = e.y + (Math.abs(dx)>Math.abs(dy) ? Math.sign(dy)*v : 0);
      const acx = Math.round(ax/DC), acy = Math.round((ay-DY0)/DC);
      if (celdaLibre(acx,acy) && D.g[acy][acx]===0){ e.x=ax; e.y=ay; }
    }
    if (Math.abs(e.x-D.px)<24 && Math.abs(e.y-D.py)<24 && e.infla<0.5) danoDig();
  }
  /* rocas: caen si les quitan el suelo y quedan enterradas al tocar tierra */
  for(const r of D.rocas){
    if (r.quieta) continue;
    const rcy = Math.round((r.y-DY0)/DC);
    if (!r.cae){
      if (celdaLibre(r.cx, rcy+1) && D.g[rcy+1][r.cx]===0 && Math.abs(D.px-r.cx*DC)>10){
        r.aviso = (r.aviso||0)+1;
        if (r.aviso>28) r.cae = true;             /* tiembla antes de caer, como en el original */
      } else r.aviso = 0;
      continue;
    }
    r.y += 5;
    const ncy = Math.round((r.y-DY0)/DC);
    for(const e of D.enem) if (e.vivo && Math.abs(e.x-r.cx*DC)<26 && Math.abs(e.y-r.y)<28){
      e.vivo=false; sumar(1000); sfx.romper(); sacudir(4);
    }
    if (Math.abs(D.px-r.cx*DC)<26 && Math.abs(D.py-r.y)<28) danoDig();
    if (r.y > DY0+(DH-1)*DC){ r.y = DY0+(DH-1)*DC; r.quieta = true; }
    else if (celdaLibre(r.cx, ncy+1) && D.g[ncy+1][r.cx]===1){ r.quieta = true; }
  }
  if (D.enem.every(e=>!e.vivo)){ resultado=1; modo='finDig'; sfx.meta(); hablar('¡Toma, pichungazo!'); }
}
function drawDig(){
  ctx.fillStyle='#2a1a0e'; ctx.fillRect(0,0,W,H);
  /* capas de tierra */
  const tonos = ['#8a5a2a','#7a4a22','#6a3e1c','#5a3418'];
  for(let y=0;y<DH;y++) for(let x=0;x<DW;x++){
    const px = x*DC, py = DY0+y*DC;
    if (D.g[y][x]===1){
      ctx.fillStyle = tonos[Math.min(3, (y/3)|0)];
      ctx.fillRect(px-DC/2, py-DC/2, DC, DC);
      ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fillRect(px-DC/2, py-DC/2, DC, 3);
    } else {
      ctx.fillStyle='#150c06'; ctx.fillRect(px-DC/2, py-DC/2, DC, DC);
    }
  }
  ctx.fillStyle='#3fae2f'; ctx.fillRect(0, DY0-DC/2-10, W, 10);
  /* rocas (tiemblan justo antes de caer) */
  for(const r of D.rocas){
    const tem = (!r.cae && r.aviso>0) ? Math.sin(T)*2 : 0;
    ctx.fillStyle='#8a8a96';
    ctx.beginPath(); ctx.roundRect(r.cx*DC-18+tem, r.y-18, 36, 36, 9); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.22)'; ctx.fillRect(r.cx*DC-12+tem, r.y-13, 20, 5);
  }
  /* arpón */
  if (D.arpon>0){
    const dx=[0,1,0,-1][D.dir], dy=[-1,0,1,0][D.dir];
    ctx.strokeStyle='#ffe36e'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(D.px, D.py); ctx.lineTo(D.px+dx*D.arponL, D.py+dy*D.arponL); ctx.stroke();
    ctx.fillStyle='#fff';
    ctx.beginPath(); ctx.arc(D.px+dx*D.arponL, D.py+dy*D.arponL, 6, 0, Math.PI*2); ctx.fill();
  }
  /* goombas inflados */
  for(const e of D.enem){
    if (!e.vivo) continue;
    const s = 1 + e.infla*1.5;
    ctx.save(); ctx.translate(e.x, e.y); ctx.scale(s, s); ctx.translate(-13, -12);
    dibGoomba(0, 0, T);
    ctx.restore();
  }
  /* nube verde mientras dura el pedo */
  if (D.pedo>0){
    ctx.fillStyle='rgba(120,220,90,'+(0.12+Math.sin(T/6)*0.05)+')';
    ctx.beginPath(); ctx.arc(D.px, D.py, 175, 0, Math.PI*2); ctx.fill();
  }
  /* Fernando (parpadea tras un golpe) */
  if (!(D.inv>0 && (T>>2)%2)){
    ctx.save(); ctx.translate(D.px-12, D.py-20); dibFernandoSolo(); ctx.restore();
  }
  hudMJ('⛏️ DIG', 'GOOMBAS: '+D.enem.filter(e=>e.vivo).length+'   '+corazonesInf(D), 'flechas cavan · B infla');
  barraPoder('💨 PEDO DE TÍO FRAN (A)', D.pedo>0 ? 1 : 1-D.pedoCd/PEDO_CD, D.pedo>0);
}

/* ============================================================
   3) FERNANDO KONG  (estilo Donkey Kong)
   ============================================================ */
const K = { x:0, y:0, vy:0, suelo:false, barriles:[], t:0, escalando:false, vida:3, inv:0, saltoPrev:false,
            sustos:0, martillo:0, martillos:[] };
const MARTILLO_T = 460;
function yEnPlat(p, x){
  const t = Math.max(0, Math.min(1, (x-p.x0)/(p.x1-p.x0)));
  return p.y0 + (p.y1-p.y0)*t;
}
const KPL = [];   /* plataformas: {x0,x1,y0,y1} ligeramente inclinadas */
const KESC = [];  /* escaleras: {x, y0, y1} */
function iniciarKong(){
  KPL.length = 0; KESC.length = 0;
  const filas = 5, sep = 84, baseY = 500;
  for(let i=0;i<filas;i++){
    const y = baseY - i*sep;
    const izqL = i%2===0;
    KPL.push({x0: izqL?60:120, x1: izqL?W-120:W-60, y0: izqL?y:y-14, y1: izqL?y-14:y});
    if (i < filas-1) KESC.push({x: izqL ? W-190 : 190, y0: y-sep, y1: y});
  }
  KPL.push({x0:60, x1:W-60, y0:baseY+40, y1:baseY+40});
  K.x = 110; K.y = baseY+40; K.vy = 0; K.barriles = []; K.t = 0;
  K.vida = 3; K.inv = 0; K.escalando = false; K.saltoPrev = false;
  K.sustos = 0; K.martillo = 0;
  /* dos martillos repartidos por la torre, como en el Donkey Kong de verdad */
  K.martillos = [
    {x: 300,   y: yEnPlat(KPL[1], 300)-20,   tomado:false},
    {x: W-320, y: yEnPlat(KPL[3], W-320)-20, tomado:false},
  ];
  aviso('¡Sube hasta mamá! Agarra los 🔨 martillos para romper barriles', 4);
}
function danoKong(caida){
  if (K.inv>0 && !caida) return;
  K.inv = 110; susto(K, '¡Ay! Vidas infinitas: vuelves abajo y sigues');
  /* vuelve al suelo, sin castigo mayor */
  K.x = 110; K.y = KPL[KPL.length-1].y0; K.vy = 0; K.escalando = false;
}
function alturaPlataforma(x, y){
  let mejor = null;
  for(const p of KPL){
    if (x < p.x0-6 || x > p.x1+6) continue;
    const t = (x-p.x0)/(p.x1-p.x0);
    const py = p.y0 + (p.y1-p.y0)*t;
    if (py >= y-14 && (mejor===null || py < mejor)) mejor = py;
  }
  return mejor;
}
function updateKong(){
  K.t++;
  if (K.inv>0) K.inv--;
  /* escaleras: se sube desde abajo y se remata sobre la plataforma de arriba */
  const esc = KESC.find(e => Math.abs(K.x-e.x)<22 && K.y<=e.y1+18 && K.y>=e.y0-10);
  if (esc && (mArr()||mAbj())){
    K.escalando = true; K.vy = 0;
    K.y += mArr() ? -2.6 : 2.6;
    K.x += (esc.x - K.x)*0.45;
    if (K.y < esc.y0){ K.y = esc.y0; K.escalando = false; }   /* queda firme arriba */
    if (K.y > esc.y1){ K.y = esc.y1; K.escalando = false; }
  } else {
    K.escalando = false;
    if (mIzq()) K.x -= 3.2; if (mDer()) K.x += 3.2;
    K.x = Math.max(60, Math.min(W-60, K.x));
    if (mSalta() && K.suelo && !K.saltoPrev){ K.vy = -9.5; K.suelo=false; sfx.salto(); }
    K.saltoPrev = mSalta();
    const antesY = K.y;
    K.vy = Math.min(K.vy+0.55, 13); K.y += K.vy;
    const py = alturaPlataforma(K.x, K.y);
    K.suelo = false;
    if (py!==null && K.vy>=0 && antesY<=py+4 && K.y>=py-2){ K.y = py; K.vy = 0; K.suelo = true; }
    if (K.y > H+60) danoKong(true);
  }
  /* barriles que tira Bowser */
  if (K.t%92===0){
    K.barriles.push({x:150, y:KPL[KPL.length-2].y0-16, vx:2.6, vy:0, rot:0});
    sfx.romper();
  }
  /* ---- PODER: el martillo pichunguito ---- */
  for(const m of K.martillos){
    if (m.tomado) continue;
    if (Math.abs(m.x-K.x)<28 && Math.abs(m.y-(K.y-20))<44){
      m.tomado = true; K.martillo = MARTILLO_T;
      sfx.poder(); sacudir(3);
      aviso('🔨 ¡MARTILLO PICHUNGUITO! Rompe todos los barriles', 2.4);
      hablar('¡Pichunguito al ataque!');
    }
  }
  if (K.martillo>0){
    K.martillo--;
    for(const b of K.barriles){
      if (b.roto) continue;
      if (Math.abs(b.x-K.x)<52 && Math.abs(b.y-K.y)<54){
        b.roto = true; sumar(500); sfx.romper(); sacudir(4);
        for(let i=0;i<6;i++) parts.push({tipo:'ladrillo', x:b.x, y:b.y-10, vx:(Math.random()-0.5)*6, vy:-2-Math.random()*3, t:38});
      }
    }
  }
  for(const b of K.barriles){
    if (b.roto) continue;
    const antesB = b.y;
    b.vy = Math.min(b.vy+0.55, 12);
    b.x += b.vx; b.y += b.vy; b.rot += b.vx*0.09;
    const py = alturaPlataforma(b.x, b.y);
    if (py!==null && b.vy>=0 && antesB<=py+6 && b.y>=py-4){ b.y = py; b.vy = 0; }
    /* al llegar al borde, el barril CAE al piso de abajo (antes subía por error) */
    if (b.x > W-64){ b.x = W-64; b.vx = -Math.abs(b.vx); b.y += 6; b.vy = 2; }
    if (b.x < 64){ b.x = 64; b.vx = Math.abs(b.vx); b.y += 6; b.vy = 2; }
    if (Math.abs(b.x-K.x)<20 && Math.abs(b.y-K.y)<26) danoKong(false);
    if (Math.abs(b.x-K.x)<40 && K.y < b.y-20 && !b.contado){ b.contado=true; sumar(200); }
  }
  K.barriles = K.barriles.filter(b=>!b.roto && b.y < H+60);
  /* llegar arriba con mamá princesa */
  if (K.y <= KPL[KPL.length-2].y0+6 && K.x > W-330){
    resultado=1; modo='finKong'; sfx.meta();
    hablar('¡Te amo mamá!');
  }
}
function drawKong(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#1a0a2a'); g.addColorStop(1,'#3a1a4a');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<26;i++){ ctx.fillStyle='rgba(255,255,255,'+(0.2+Math.sin(T/20+i)*0.15)+')';
    ctx.fillRect((i*173)%W, 60+((i*97)%260), 2, 2); }
  /* escaleras */
  for(const e of KESC){
    ctx.strokeStyle='#8ecbff'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(e.x-11, e.y0); ctx.lineTo(e.x-11, e.y1);
    ctx.moveTo(e.x+11, e.y0); ctx.lineTo(e.x+11, e.y1); ctx.stroke();
    ctx.lineWidth=3;
    for(let y=e.y0; y<e.y1; y+=16){ ctx.beginPath(); ctx.moveTo(e.x-11,y); ctx.lineTo(e.x+11,y); ctx.stroke(); }
  }
  /* plataformas */
  for(const p of KPL){
    ctx.strokeStyle='#e05a3a'; ctx.lineWidth=13; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(p.x0,p.y0); ctx.lineTo(p.x1,p.y1); ctx.stroke();
    ctx.strokeStyle='#ff8a6a'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(p.x0,p.y0-4); ctx.lineTo(p.x1,p.y1-4); ctx.stroke();
  }
  /* Bowser arriba a la izquierda y mamá princesa arriba a la derecha */
  const arriba = KPL[KPL.length-2];
  dibBowser(96, arriba.y0-70, T, 0);
  dibPrincesa(W-250, arriba.y0-74, T, false);
  texto('MAMÁ', W-236, arriba.y0-92, 13, '#ff9ed6', true);
  /* barriles */
  for(const b of K.barriles){
    ctx.save(); ctx.translate(b.x, b.y-12); ctx.rotate(b.rot);
    ctx.fillStyle='#c87838';
    ctx.beginPath(); ctx.roundRect(-15,-12,30,24,7); ctx.fill();
    ctx.fillStyle='#8a4a18'; ctx.fillRect(-15,-5,30,4); ctx.fillRect(-15,2,30,3);
    ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.fillRect(-11,-10,22,3);
    ctx.restore();
  }
  /* martillos esperando en las plataformas */
  for(const m of K.martillos){
    if (m.tomado) continue;
    const fl = Math.sin(T/10)*4;
    dibMartillo(m.x, m.y+fl, 0);
    ctx.globalAlpha = 0.35+Math.sin(T/8)*0.2;
    ctx.strokeStyle='#ffe36e'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(m.x, m.y+fl-6, 24, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  /* Fernando (parpadea tras un golpe) */
  sombra(K.x, K.y+2, 15);
  if (!(K.inv>0 && (K.t>>2)%2)){
    ctx.save(); ctx.translate(K.x-12, K.y-40); dibFernandoSolo(); ctx.restore();
    if (K.martillo>0) dibMartillo(K.x+((K.t>>3)%2?18:-18), K.y-44, (K.t>>3)%2 ? 0.6 : -0.6);
  }
  hudMJ('🛢️ KONG', 'ALTURA: '+Math.max(0, Math.round((540-K.y)/4))+'m   '+corazonesInf(K), '↑ escaleras · A salta');
  const restan = K.martillos.filter(m=>!m.tomado).length;
  barraPoder(K.martillo>0 ? '🔨 ¡MARTILLO ACTIVO!' : (restan ? '🔨 BUSCA UN MARTILLO ('+restan+')' : '🔨 SIN MARTILLOS'),
             K.martillo>0 ? K.martillo/MARTILLO_T : (restan?1:0), K.martillo>0);
}
/* martillo dibujado a mano, girado un poco al golpear */
function dibMartillo(x, y, giro){
  ctx.save(); ctx.translate(x, y); ctx.rotate(giro||0);
  ctx.fillStyle='#8a5a2a'; ctx.fillRect(-3, -4, 6, 26);
  ctx.fillStyle='#d8d8e0';
  ctx.beginPath(); ctx.roundRect(-15, -18, 30, 16, 4); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.fillRect(-12, -15, 24, 4);
  ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.fillRect(-12, -6, 24, 3);
  ctx.restore();
}

/* ============================================================
   4) FERNANDO CONTRA
   ============================================================ */
const C = { x:0, y:0, vy:0, suelo:false, vida:5, balas:[], enem:[], balasE:[], scroll:0, t:0, jefe:null,
            items:[], perro:0, bajas:0, sustos:0 };
const SUELO_C = 470, PERRO_T = 560;
function iniciarContra(){
  C.x = 140; C.y = SUELO_C; C.vy = 0; C.vida = 5;
  C.balas = []; C.enem = []; C.balasE = []; C.scroll = 0; C.t = 0; C.jefe = null; C.inv = 0; C.cara = 1;
  C.items = []; C.perro = 0; C.bajas = 0; C.sustos = 0;
  aviso('¡B dispara · A salta! Recoge el 🦴 hueso y serás un perrito rojo gigante', 4);
}
function updateContra(){
  C.t++;
  if (C.inv>0) C.inv--;
  if (mIzq()) C.x -= 3.4; if (mDer()) C.x += 3.4;
  C.x = Math.max(30, Math.min(W-260, C.x));
  if (mIzq()) C.cara = -1; else if (mDer()) C.cara = 1;
  if (mSalta() && C.suelo && !C.saltoPrev){ C.vy = -11; C.suelo = false; sfx.salto(); }
  C.saltoPrev = mSalta();
  C.vy = Math.min(C.vy+0.6, 14); C.y += C.vy;
  if (C.y >= SUELO_C){ C.y = SUELO_C; C.vy = 0; C.suelo = true; }
  C.scroll += C.jefe ? 0 : 1.5;
  /* ---- PODER: hueso → perrito rojo gigante (dispara en abanico) ---- */
  if (C.perro>0){
    C.perro--;
    if (C.perro%5===0) parts.push({tipo:'estrellita', x:C.x+(Math.random()-0.5)*30, y:C.y-20-Math.random()*30,
                                   vx:(Math.random()-0.5)*2, vy:-1, t:22});
  }
  for(const it of C.items){
    it.vy = Math.min((it.vy||0)+0.5, 12); it.y += it.vy; it.x -= 1.5;
    if (it.y > SUELO_C-10){ it.y = SUELO_C-10; it.vy = 0; }
    if (!it.usado && Math.abs(it.x-C.x)<32 && Math.abs(it.y-(C.y-20))<46){
      it.usado = true; C.perro = PERRO_T; sfx.poder(); sacudir(4); sumar(400);
      aviso('🦴 ¡FERNANDO PERRITO ROJO GIGANTE!', 2.4);
      hablar('¡Guau guau! ¡Soy un perrito grande!');
    }
  }
  C.items = C.items.filter(it=>!it.usado && it.x>-40);
  /* disparo */
  if (mAccion() && !C.dispPrev){
    const cara = C.cara||1;
    if (C.perro>0){                       /* de perrito grande dispara en abanico */
      for(const dv of [-3.4, 0, 3.4]) C.balas.push({x:C.x+18*cara, y:C.y-30, vx:11*cara, vy:dv, perro:true});
      sfx.pisoton();
    } else {
      C.balas.push({x:C.x+16*cara, y:C.y-26, vx:11*cara, vy:0});
    }
    sfx.fuego();
  }
  C.dispPrev = mAccion();
  for(const b of C.balas){ b.x += b.vx; b.y += b.vy||0; }
  C.balas = C.balas.filter(b=>b.x>-20 && b.x<W+20 && b.y>-20 && b.y<H+20);
  /* aparición de enemigos */
  if (!C.jefe && C.t%64===0 && C.scroll < 2400){
    C.enem.push({x:W+30, y:SUELO_C, vida:2, t:0, tipo: Math.random()<0.35?'koopa':'goomba'});
  }
  for(const e of C.enem){
    e.t++;
    e.x -= 1.9;
    if (e.t%110===0 && e.x<W-40){
      C.balasE.push({x:e.x, y:e.y-24, vx:-4.6});
      sfx.fuego();
    }
    for(const b of C.balas){
      if (Math.abs(b.x-e.x)<22 && Math.abs(b.y-(e.y-22))<26){
        e.vida--; b.x = 9999;
        if (e.vida<=0){ e.muerto=true; sumar(300); sfx.pisoton(); soltarHueso(e);
          for(let i=0;i<5;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y-20, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*2, t:30}); }
      }
    }
    if (Math.abs(e.x-C.x)<26 && Math.abs(e.y-C.y)<40 && !e.muerto){
      if (C.perro>0){                     /* el perrito rojo arrolla a quien se le cruce */
        e.muerto = true; sumar(300); sfx.pisoton(); sacudir(3);
        for(let i=0;i<5;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y-20, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*2, t:28});
      } else if (C.inv<=0){
        C.inv = 70; susto(C, '¡Ay! Vidas infinitas: sigue disparando');
      }
    }
  }
  C.enem = C.enem.filter(e=>!e.muerto && e.x>-60);
  for(const b of C.balasE){
    b.x += b.vx;
    if (Math.abs(b.x-C.x)<18 && Math.abs(b.y-(C.y-26))<28 && !b.usada){
      b.usada = true;
      if (C.perro>0){ /* el perrito rojo aguanta los disparos */ }
      else if (C.inv<=0){ C.inv = 70; susto(C, '¡Ay! Vidas infinitas: sigue disparando'); }
    }
  }
  C.balasE = C.balasE.filter(b=>!b.usada && b.x>-20);
  /* jefe final */
  if (!C.jefe && C.scroll >= 2400 && C.enem.length===0){
    C.jefe = {x:W-220, y:150, vy:1.6, vida:14, golpe:0};
    aviso('¡JEFE FINAL!', 2);
  }
  if (C.jefe){
    const j = C.jefe;
    j.y += j.vy;
    if (j.y < 110 || j.y > 330) j.vy *= -1;
    if (C.t%46===0) C.balasE.push({x:j.x, y:j.y+40, vx:-5.4});
    for(const b of C.balas){
      if (Math.abs(b.x-(j.x+28))<40 && Math.abs(b.y-(j.y+30))<40){
        b.x = 9999; j.vida--; j.golpe = 8; sfx.pisoton(); sumar(100);
      }
    }
    if (j.golpe>0) j.golpe--;
    if (j.vida<=0){ resultado=1; modo='finContra'; sfx.meta(); hablar('¡Gané! ¡Soy el pichunguito campeón!'); }
    /* el jefe también suelta huesos, para no quedarse nunca sin poder */
    if (C.t%420===0) soltarHueso({x:j.x, y:j.y+60});
  }
}
/* un hueso cada tres enemigos vencidos */
function soltarHueso(e){
  if (++C.bajas % 3 !== 0) return;
  C.items.push({x:e.x, y:e.y-30, vy:-3, tipo:'hueso'});
}
function drawContra(){
  const g = ctx.createLinearGradient(0,0,0,SUELO_C+40);
  g.addColorStop(0,'#1a2a4a'); g.addColorStop(1,'#4a6a8a');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  /* selva de fondo con desplazamiento */
  for(let i=0;i<10;i++){
    const x = ((i*180 - C.scroll*0.35)%(W+200)+(W+200))%(W+200)-100;
    ctx.fillStyle='#14361f';
    ctx.beginPath(); ctx.moveTo(x,SUELO_C+40); ctx.lineTo(x+50,SUELO_C-140); ctx.lineTo(x+100,SUELO_C+40); ctx.fill();
  }
  for(let i=0;i<14;i++){
    const x = ((i*130 - C.scroll*0.7)%(W+160)+(W+160))%(W+160)-80;
    ctx.fillStyle='#1c4a28';
    ctx.beginPath(); ctx.arc(x+40, SUELO_C-30, 34, Math.PI, 0); ctx.fill();
  }
  /* suelo con rayas que se mueven */
  ctx.fillStyle='#3a2a1a'; ctx.fillRect(0,SUELO_C+18,W,H-SUELO_C);
  ctx.fillStyle='#4a3a24';
  for(let i=0;i<16;i++){
    const x = ((i*70 - C.scroll)%(W+80)+(W+80))%(W+80)-40;
    ctx.fillRect(x, SUELO_C+18, 40, 8);
  }
  ctx.fillStyle='#5a4a30'; ctx.fillRect(0,SUELO_C+14,W,6);
  /* enemigos */
  for(const e of C.enem){
    sombra(e.x, SUELO_C+18, 16);
    if (e.tipo==='koopa') dibKoopa(e.x-13, e.y-38, {caparazon:false}, T);
    else dibGoomba(e.x-13, e.y-24, T);
  }
  /* jefe */
  if (C.jefe){
    const j = C.jefe;
    if (!(j.golpe>0 && (T>>1)%2)) dibBowser(j.x, j.y, T, 0);
    rect(j.x-4, j.y-24, 68, 9, '#3a0a0a');
    rect(j.x-4, j.y-24, 68*Math.max(0,j.vida)/14, 9, '#e03434');
  }
  /* huesos por recoger */
  for(const it of C.items){
    ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(Math.sin(T/9)*0.35);
    ctx.fillStyle='#f4f0e2';
    ctx.beginPath(); ctx.roundRect(-14, -4, 28, 8, 4); ctx.fill();
    for(const sx of [-14, 14]) for(const sy of [-6, 6]){
      ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 0.35+Math.sin(T/7)*0.2;
    ctx.strokeStyle='#ffe36e'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(it.x, it.y, 26, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  /* balas */
  for(const b of C.balas){ ctx.fillStyle = b.perro ? '#ff5a3a' : '#ffe36e';
    ctx.beginPath(); ctx.arc(b.x, b.y, b.perro?7:5, 0, Math.PI*2); ctx.fill(); }
  for(const b of C.balasE){ ctx.fillStyle='#ff6a4a';
    ctx.beginPath(); ctx.arc(b.x, b.y, 6, 0, Math.PI*2); ctx.fill(); }
  /* Fernando disparando (parpadea tras un golpe) */
  sombra(C.x, SUELO_C+18, C.perro>0 ? 26 : 16);
  if (C.inv>0 && (C.t>>2)%2){ /* invisible un instante */ } else {
  ctx.save();
  if (C.perro>0){                       /* convertido en perrito rojo gigante */
    ctx.translate(C.x, C.y);
    if (C.cara<0) ctx.scale(-1,1);
    ctx.scale(2.4, 2.4); ctx.translate(-13, -21);
    dibPerroSolo('#e03434');
    /* orejotas y cola para que se note que es el perrito rojo gigante */
    rect(15, -3, 4, 5, '#b02020'); rect(-4, 5, 6, 3, '#b02020');
  } else {
    ctx.translate(C.x-12, C.y-40);
    if (C.cara<0){ ctx.translate(24,0); ctx.scale(-1,1); }
    dibFernandoSolo();
    rect(20, 16, 16, 5, '#3a3a44');
  }
  ctx.restore(); }
  /* Tío Juan de apoyo, volando */
  dibTioJuan(C.x-70, C.y-150+Math.sin(T/16)*8, T);
  hudMJ('🔫 CONTRA', corazonesInf(C), C.jefe ? '¡DERROTA A BOWSER!' : 'B dispara · A salta');
  barraPoder(C.perro>0 ? '🦴 ¡PERRITO ROJO GIGANTE!' : '🦴 VENCE ENEMIGOS Y SUELTAN HUESOS',
             C.perro>0 ? C.perro/PERRO_T : (C.bajas%3)/3, C.perro>0);
}


/* ============================================================
   5) FERNANDO GLOBOS  (estilo Balloon Fight)
   ============================================================ */
const G = { x:0, y:0, vx:0, vy:0, globos:2, enem:[], plats:[], t:0, aletPrev:false,
            premios:[], pedoCd:0, pedoPrev:false, sustos:0 };
const AGUA_G = 512, PEDO_G = 140;
function iniciarGlobos(){
  G.x = 180; G.y = 300; G.vx = 0; G.vy = 0; G.globos = 2; G.t = 0; G.inv = 0; G.aletPrev = false;
  G.premios = []; G.pedoCd = 0; G.pedoPrev = false; G.sustos = 0;
  G.plats = [{x:120,y:420,w:180},{x:420,y:340,w:170},{x:700,y:430,w:190},{x:560,y:210,w:150},{x:200,y:180,w:150}];
  G.enem = [];
  for(let i=0;i<4;i++)
    G.enem.push({x:400+i*140, y:150+ (i%2)*120, vx:(i%2?1:-1)*1.1, vy:0, globos:2, cae:0, vivo:true, f:Math.random()*6});
  aviso('¡Aletea con A! Con B sueltas el IMPULSO PEDORRO 💨 y subes como un cohete', 4);
}
function updateGlobos(){
  G.t++;
  if (G.inv>0) G.inv--;
  /* aleteo */
  if (mIzq()) G.vx -= 0.22; if (mDer()) G.vx += 0.22;
  if ((mSalta()||mArr()) && !G.aletPrev && G.globos>0){ G.vy = -3.4; sfx.salto();
    for(let i=0;i<3;i++) parts.push({tipo:'polvo', x:G.x, y:G.y+22, vx:(Math.random()-0.5)*2, vy:1, t:16}); }
  G.aletPrev = mSalta()||mArr();
  /* ---- PODER: impulso pedorro ---- */
  if (G.pedoCd>0) G.pedoCd--;
  if (mAccion() && !G.pedoPrev && G.pedoCd<=0){
    G.vy = -9; G.vx += (G.vx>=0 ? 2.6 : -2.6); G.pedoCd = PEDO_G;
    nubePedo(G.x, G.y+24, 14); sfx.pedo(); sacudir(4);
    aviso('💨 ¡IMPULSO PEDORRO!', 1.4);
  }
  G.pedoPrev = mAccion();
  /* globos sueltos que devuelven aire (hasta tres) */
  if (G.t%380===120 && G.premios.length<2)
    G.premios.push({x:80+Math.random()*(W-160), y:110+Math.random()*260, t:0});
  for(const pr of G.premios){
    pr.t++; pr.y += Math.sin(pr.t/26)*0.5;
    if (!pr.usado && Math.abs(pr.x-G.x)<30 && Math.abs(pr.y-G.y)<34){
      pr.usado = true;
      if (G.globos<3){ G.globos++; aviso('🎈 ¡GLOBO EXTRA!', 1.4); }
      else { sumar(300); aviso('🎈 +300 puntos', 1.2); }
      sfx.moneda();
    }
  }
  G.premios = G.premios.filter(pr=>!pr.usado);
  G.vy += G.globos>0 ? (G.globos>2 ? 0.10 : 0.13) : 0.42;
  G.vx *= 0.975; G.vy = Math.min(G.vy, G.globos>0 ? 3.6 : 9);
  G.x += G.vx; G.y += G.vy;
  if (G.x < 20){ G.x = 20; G.vx = Math.abs(G.vx)*0.5; }
  if (G.x > W-20){ G.x = W-20; G.vx = -Math.abs(G.vx)*0.5; }
  if (G.y < 60){ G.y = 60; G.vy = Math.abs(G.vy)*0.5; }
  /* plataformas */
  for(const p of G.plats){
    if (G.x > p.x-14 && G.x < p.x+p.w+14 && G.y+26 > p.y && G.y+26 < p.y+22 && G.vy>0){
      G.y = p.y-26; G.vy = 0;
    }
  }
  /* enemigos */
  for(const e of G.enem){
    if (!e.vivo) continue;
    e.f += 0.03;
    if (e.globos>0){
      e.vx += (G.x - e.x) * 0.00035;
      e.vy = Math.sin(e.f)*1.1 + (G.y - e.y)*0.004;
      e.x += e.vx; e.y += e.vy;
      e.vx = Math.max(-2, Math.min(2, e.vx));
      if (e.x<24 || e.x>W-24) e.vx *= -1;
      if (e.y<70) e.y = 70;
      for(const p of G.plats)
        if (e.x>p.x-12 && e.x<p.x+p.w+12 && e.y+24>p.y && e.y+24<p.y+20 && e.vy>0) e.y = p.y-24;
    } else {
      e.cae++; e.y += 2.4;                      /* baja en paracaídas */
      if (e.y > AGUA_G-10){ e.vivo=false; sumar(600); sfx.moneda(); }
    }
    /* choque con Fernando: gana quien viene desde arriba */
    if (Math.abs(e.x-G.x)<28 && Math.abs(e.y-G.y)<30){
      if (G.y < e.y-6 && e.globos>0){
        e.globos--; e.vy = 2; sfx.pisoton(); sacudir(3); sumar(300);
        G.vy = -3.5;
        for(let i=0;i<5;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y-16, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*2, t:28});
      } else if (e.y < G.y-6 && e.globos>0 && G.globos>0 && G.inv<=0){
        G.globos--; G.inv = 80; G.vy = 3; G.vx = (G.x<e.x?-3:3);
        susto(G, '¡Se reventó un globo! Vidas infinitas: aguanta');
      }
    }
  }
  /* agua: sin globos, Fernando sale a flote con globos nuevos (vidas infinitas) */
  if (G.y > AGUA_G-10){
    if (G.globos>0){ G.y = AGUA_G-10; G.vy = -4; }
    else {
      G.x = 180; G.y = 220; G.vx = 0; G.vy = 0; G.globos = 2; G.inv = 90;
      susto(G, '¡Al agua! Vidas infinitas: globos nuevos y a volar');
      sfx.poder();
    }
  }
  if (G.enem.every(e=>!e.vivo)){ resultado=1; modo='finGlobos'; sfx.meta(); hablar('¡Toma, pichungazo!'); }
}
function dibGlobitos(x, y, n, color){
  const desf = n===1 ? [0] : n===2 ? [-11,11] : [-16,0,16];
  for(let i=0;i<n;i++){
    const gx = x + (desf[i]||0), gy = y - 30 - (n>2&&i===1?6:0) + Math.sin(T/14+i)*2;
    ctx.strokeStyle='#eee'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(x, y-8); ctx.lineTo(gx, gy+11); ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.ellipse(gx, gy, 10, 12, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.45)';
    ctx.beginPath(); ctx.ellipse(gx-3, gy-4, 3.4, 4.4, -0.3, 0, Math.PI*2); ctx.fill();
  }
}
function drawGlobos(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#0a2a5a'); g.addColorStop(0.7,'#2a6ad0'); g.addColorStop(1,'#6bb0f0');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<20;i++){ ctx.fillStyle='rgba(255,255,255,'+(0.25+Math.sin(T/24+i)*0.2)+')';
    ctx.fillRect((i*151)%W, 60+((i*67)%160), 2, 2); }
  /* agua */
  ctx.fillStyle='#1560c8'; ctx.fillRect(0,AGUA_G,W,H-AGUA_G);
  ctx.fillStyle='rgba(255,255,255,0.28)';
  for(let i=0;i<W;i+=28) ctx.fillRect(i+((T*0.6)%28), AGUA_G+4, 16, 3);
  /* plataformas */
  for(const p of G.plats){
    rect(p.x, p.y, p.w, 16, '#4a8a3a');
    rect(p.x, p.y, p.w, 5, '#7ed040');
    rect(p.x, p.y+13, p.w, 3, '#2a5a20');
  }
  /* enemigos */
  for(const e of G.enem){
    if (!e.vivo) continue;
    if (e.globos>0) dibGlobitos(e.x, e.y, e.globos, '#e03434');
    else { ctx.strokeStyle='#fff'; ctx.lineWidth=2;   /* paracaídas */
      ctx.beginPath(); ctx.arc(e.x, e.y-26, 18, Math.PI, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(e.x-18,e.y-26); ctx.lineTo(e.x,e.y-8);
      ctx.lineTo(e.x+18,e.y-26); ctx.stroke(); }
    dibKoopa(e.x-13, e.y-22, {caparazon:false}, T);
  }
  /* globos extra flotando */
  for(const pr of G.premios){
    dibGlobitos(pr.x, pr.y, 1, '#5ee08a');
    ctx.globalAlpha = 0.3+Math.sin(T/7)*0.2;
    ctx.strokeStyle='#ffe36e'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(pr.x, pr.y-26, 22, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  /* Fernando con sus globos (parpadea tras un golpe) */
  if (!(G.inv>0 && (T>>2)%2)){
    if (G.globos>0) dibGlobitos(G.x, G.y, G.globos, '#f8b800');
    ctx.save(); ctx.translate(G.x-12, G.y-16); dibFernandoSolo(); ctx.restore();
  }
  hudMJ('🎈 GLOBOS', 'KOOPAS: '+G.enem.filter(e=>e.vivo).length+'   🎈'+G.globos+'   '+corazonesInf(G), 'A = aletear');
  barraPoder(G.pedoCd<=0 ? '💨 IMPULSO PEDORRO LISTO (B)' : '💨 tomando aire...',
             1-G.pedoCd/PEDO_G, G.pedoCd<=0);
}

/* ============================================================
   6) FERNANDO BOMBAS  (estilo Bomberman)
   ============================================================ */
const M = { g:[], jx:1, jy:1, px:0, py:0, bombas:[], fuego:[], enem:[], t:0, bombaPrev:false, vida:3, inv:0,
            items:[], alcance:2, maxBombas:2, vel:2.6, pedoCd:0, pedoPrev:false, sustos:0 };
const MC = 42, MW = 17, MH = 11, MX0 = 60, MY0 = 66, PEDO_M = 330;
function iniciarBombas(){
  M.g = Array.from({length:MH}, (_,y)=> Array.from({length:MW}, (_,x)=>{
    if (x===0||y===0||x===MW-1||y===MH-1) return 2;         /* muro duro */
    if (x%2===0 && y%2===0) return 2;                        /* pilar */
    if (x+y < 4) return 0;                                   /* esquina libre */
    return Math.random()<0.55 ? 1 : 0;                       /* bloque blando */
  }));
  M.jx = 1; M.jy = 1; M.px = MX0+MC; M.py = MY0+MC;
  M.bombas = []; M.fuego = []; M.t = 0; M.vida = 3; M.inv = 0;
  M.items = []; M.alcance = 2; M.maxBombas = 2; M.vel = 2.6;
  M.pedoCd = 0; M.pedoPrev = false; M.sustos = 0;
  M.enem = [];
  const libres = [];
  for(let y=1;y<MH-1;y++) for(let x=1;x<MW-1;x++)
    if (M.g[y][x]===0 && x+y>8) libres.push({x,y});
  for(let i=0;i<4 && libres.length;i++){
    const c = libres.splice((Math.random()*libres.length)|0, 1)[0];
    M.enem.push({x:MX0+c.x*MC, y:MY0+c.y*MC, dir:(Math.random()*4)|0, vivo:true});
  }
  aviso('¡B pone bombas! Rompe cajas para hallar poderes · A = SÚPER PEDO 💨', 4);
}
const mCel = (x,y) => (x<0||y<0||x>=MW||y>=MH) ? 2 : M.g[y][x];
function danoBomba(){
  if (M.inv>0) return;
  M.inv = 110; susto(M, '¡Ay! Vidas infinitas: vuelves a la esquina');
  M.px = MX0+MC; M.py = MY0+MC;
}
function updateBombas(){
  M.t++;
  if (M.inv>0) M.inv--;
  /* movimiento con paredes */
  const v = M.vel;
  const libre = (px,py)=>{
    for(const [ox,oy] of [[-17,-17],[17,-17],[-17,17],[17,17]])
      if (mCel(Math.round((px+ox-MX0)/MC), Math.round((py+oy-MY0)/MC)) !== 0) return false;
    return true;
  };
  let dx = 0, dy = 0;
  if (mIzq()) dx = -v; else if (mDer()) dx = v;
  else if (mArr()) dy = -v; else if (mAbj()) dy = v;
  if (dx){
    if (libre(M.px+dx, M.py)) M.px += dx;
    else {  /* deslizarse hacia el centro del pasillo para no atascarse */
      const cyc = MY0 + Math.round((M.py-MY0)/MC)*MC;
      if (Math.abs(M.py-cyc) > 3 && libre(M.px+dx, cyc)) M.py += Math.sign(cyc-M.py)*v;
    }
  } else if (dy){
    if (libre(M.px, M.py+dy)) M.py += dy;
    else {
      const cxc = MX0 + Math.round((M.px-MX0)/MC)*MC;
      if (Math.abs(M.px-cxc) > 3 && libre(cxc, M.py+dy)) M.px += Math.sign(cxc-M.px)*v;
    }
  }
  M.jx = Math.round((M.px-MX0)/MC); M.jy = Math.round((M.py-MY0)/MC);
  /* poner bomba */
  if (mAccion() && !M.bombaPrev && M.bombas.length<M.maxBombas &&
      !M.bombas.some(b=>b.x===M.jx && b.y===M.jy)){
    M.bombas.push({x:M.jx, y:M.jy, t:120});
    sfx.romper();
  }
  M.bombaPrev = mAccion();
  /* ---- PODER: el súper pedo, una cruz enorme que no daña a Fernando ---- */
  if (M.pedoCd>0) M.pedoCd--;
  if (mSalta() && !M.pedoPrev && M.pedoCd<=0){
    M.pedoCd = PEDO_M; sfx.pedo(); sacudir(6);
    aviso('💨 ¡SÚPER PEDO PICHUNGUITO!', 2);
    hablar('¡Qué pedo tan grande, tío Fran!');
    M.fuego.push({x:M.jx, y:M.jy, t:36, pedo:true});
    nubePedo(M.px, M.py, 14);
    for(const [dx2,dy2] of [[1,0],[-1,0],[0,1],[0,-1]]){
      for(let r=1;r<=M.alcance+2;r++){
        const fx = M.jx+dx2*r, fy = M.jy+dy2*r;
        if (mCel(fx,fy)===2) break;
        M.fuego.push({x:fx, y:fy, t:36, pedo:true});
        nubePedo(MX0+fx*MC, MY0+fy*MC, 4);
        if (mCel(fx,fy)===1){ M.g[fy][fx] = 0; sumar(50); soltarPremio(fx,fy); break; }
      }
    }
  }
  M.pedoPrev = mSalta();
  /* premios que aparecen al romper cajas */
  for(const it of M.items){
    if (Math.abs(MX0+it.x*MC-M.px)<24 && Math.abs(MY0+it.y*MC-M.py)<24){
      it.usado = true; sfx.poder();
      if (it.tipo==='fuego'){ M.alcance = Math.min(6, M.alcance+1); aviso('🔥 ¡Explosiones más largas!', 1.6); }
      else if (it.tipo==='bomba'){ M.maxBombas = Math.min(6, M.maxBombas+1); aviso('💣 ¡Una bomba más!', 1.6); }
      else { M.vel = Math.min(4.4, M.vel+0.35); aviso('👟 ¡Zapatos veloces!', 1.6); }
      sumar(200);
    }
  }
  M.items = M.items.filter(it=>!it.usado);
  /* bombas y explosiones */
  for(const b of M.bombas){
    b.t--;
    if (b.t<=0){
      b.explota = true; sfx.pedo(); sacudir(5);
      M.fuego.push({x:b.x, y:b.y, t:34});
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
        for(let r=1;r<=M.alcance;r++){
          const fx = b.x+dx*r, fy = b.y+dy*r;
          if (mCel(fx,fy)===2) break;
          M.fuego.push({x:fx, y:fy, t:34});
          if (mCel(fx,fy)===1){ M.g[fy][fx] = 0; sumar(50); soltarPremio(fx,fy); break; }
        }
      }
    }
  }
  M.bombas = M.bombas.filter(b=>!b.explota);
  for(const f of M.fuego) f.t--;
  M.fuego = M.fuego.filter(f=>f.t>0);
  /* daño del fuego */
  for(const f of M.fuego){
    if (f.t<30){
      const fx2 = MX0+f.x*MC, fy2 = MY0+f.y*MC;
      for(const e of M.enem)
        if (e.vivo && Math.abs(e.x-fx2)<24 && Math.abs(e.y-fy2)<24){
          e.vivo=false; sumar(700); sfx.pisoton();
          for(let i=0;i<6;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*3, t:30});
        }
      if (!f.pedo && Math.abs(M.px-fx2)<20 && Math.abs(M.py-fy2)<20) danoBomba();
    }
  }
  /* enemigos */
  for(const e of M.enem){
    if (!e.vivo) continue;
    const dx=[1,0,-1,0][e.dir], dy=[0,1,0,-1][e.dir];
    const nx2 = e.x+dx*1.3, ny2 = e.y+dy*1.3;
    const ecx = Math.round((nx2-MX0)/MC), ecy = Math.round((ny2-MY0)/MC);
    if (mCel(ecx,ecy)===0 && !M.bombas.some(b=>b.x===ecx&&b.y===ecy)){ e.x=nx2; e.y=ny2; }
    else e.dir = (Math.random()*4)|0;
    if (M.t%90===0 && Math.random()<0.4) e.dir = (Math.random()*4)|0;
    if (Math.abs(e.x-M.px)<24 && Math.abs(e.y-M.py)<24) danoBomba();
  }
  if (M.enem.every(e=>!e.vivo)){ resultado=1; modo='finBombas'; sfx.meta(); hablar('¡Toma, pichungazo!'); }
}
/* una de cada tres cajas rotas esconde un poder */
function soltarPremio(x, y){
  if (Math.random() > 0.34) return;
  const tipo = ['fuego','bomba','zapato'][(Math.random()*3)|0];
  M.items.push({x, y, tipo});
}
function drawBombas(){
  ctx.fillStyle='#1a2a1a'; ctx.fillRect(0,0,W,H);
  for(let y=0;y<MH;y++) for(let x=0;x<MW;x++){
    const px = MX0+x*MC-MC/2, py = MY0+y*MC-MC/2, c = M.g[y][x];
    if (c===2){
      rect(px,py,MC,MC,'#5a6a7a');
      rect(px+2,py+2,MC-4,4,'rgba(255,255,255,0.28)');
      rect(px+2,py+MC-6,MC-4,4,'rgba(0,0,0,0.35)');
    } else if (c===1){
      rect(px,py,MC,MC,'#a06a3a');
      rect(px+2,py+2,MC-4,4,'rgba(255,255,255,0.22)');
      ctx.strokeStyle='#6a4020'; ctx.lineWidth=2; ctx.strokeRect(px+2,py+2,MC-4,MC-4);
    } else {
      rect(px,py,MC,MC, (x+y)%2 ? '#2f7a2a' : '#2a6f26');
    }
  }
  /* bombas */
  for(const b of M.bombas){
    const bx = MX0+b.x*MC, by = MY0+b.y*MC;
    const s = 1 + Math.sin(M.t/4)*0.09;
    ctx.save(); ctx.translate(bx,by); ctx.scale(s,s);
    ctx.fillStyle='#1a1a22'; ctx.beginPath(); ctx.arc(0,2,15,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(-5,-4,4,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#c8a050'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(0,-13); ctx.quadraticCurveTo(8,-22,3,-27); ctx.stroke();
    ctx.fillStyle=(M.t>>2)%2?'#ffe36e':'#ff6a20';
    ctx.beginPath(); ctx.arc(3,-28,4,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
  /* premios */
  for(const it of M.items){
    const ix = MX0+it.x*MC, iy = MY0+it.y*MC;
    const s = 1+Math.sin(M.t/9)*0.08;
    ctx.save(); ctx.translate(ix, iy); ctx.scale(s,s);
    ctx.fillStyle = it.tipo==='fuego' ? '#e05a20' : it.tipo==='bomba' ? '#2a3a6a' : '#2a8a4a';
    ctx.beginPath(); ctx.roundRect(-16,-16,32,32,8); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.7)'; ctx.lineWidth=2; ctx.stroke();
    ctx.font='19px monospace'; ctx.textAlign='center';
    ctx.fillStyle='#fff';
    ctx.fillText(it.tipo==='fuego' ? '🔥' : it.tipo==='bomba' ? '💣' : '👟', 0, 7);
    ctx.textAlign='left';
    ctx.restore();
  }
  /* fuego (el del súper pedo sale verde y no hace daño) */
  for(const f of M.fuego){
    const fx = MX0+f.x*MC-MC/2, fy = MY0+f.y*MC-MC/2;
    const a = Math.min(1, f.t/16);
    ctx.globalAlpha = f.pedo ? a*0.8 : a;
    rect(fx+2, fy+2, MC-4, MC-4, f.pedo ? ((M.t>>1)%2 ? '#7ad84a' : '#4aa832') : ((M.t>>1)%2 ? '#ff8a20' : '#ffe36e'));
    rect(fx+8, fy+8, MC-16, MC-16, f.pedo ? '#d8f8b0' : '#fff6c0');
    ctx.globalAlpha = 1;
  }
  /* goombas */
  for(const e of M.enem) if (e.vivo) dibGoomba(e.x-13, e.y-12, T);
  /* Fernando (parpadea tras un golpe) */
  if (!(M.inv>0 && (M.t>>2)%2)){
    ctx.save(); ctx.translate(M.px-12, M.py-22); dibFernandoSolo(); ctx.restore();
  }
  hudMJ('💣 BOMBAS', 'GOOMBAS: '+M.enem.filter(e=>e.vivo).length+'   '+corazonesInf(M),
        '💣'+M.maxBombas+' 🔥'+M.alcance+' 👟'+M.vel.toFixed(1));
  barraPoder(M.pedoCd<=0 ? '💨 SÚPER PEDO LISTO (A)' : '💨 cargando pedo...',
             1-M.pedoCd/PEDO_M, M.pedoCd<=0);
}

/* ============================================================
   7) FERNANDO HIELO  (estilo Ice Climber)
   ============================================================ */
const I = { x:0, y:0, vy:0, cam:0, suelo:false, pisos:[], enem:[], t:0, saltoPrev:false, cima:0, vida:3, inv:0,
            papa:0, papaCd:0, papaPrev:false, sustos:0 };
const IPISOS = 12, IALTO = 116, IC2 = 40, PAPA_CD = 190;
function iniciarHielo(){
  I.pisos = [];
  const nCel = Math.ceil(W/IC2);
  for(let p=0;p<IPISOS;p++){
    const y = 470 - p*IALTO;
    const cel = new Array(nCel).fill(1);
    if (p>0){
      /* dos o tres huecos, nunca en los bordes ni pegados entre sí:
         así siempre hay hielo firme a ambos lados para aterrizar */
      const nH = 2, huecos = [];
      let intentos = 0;
      while(huecos.length<nH && intentos++<80){
        const h = 3 + ((Math.random()*(nCel-6))|0);
        if (huecos.every(o=>Math.abs(o-h)>=3)) huecos.push(h);
      }
      for(const h of huecos) cel[h] = 0;
    }
    I.pisos.push({y, cel});
  }
  I.x = 120; I.y = 470; I.vy = 0; I.cam = 0; I.t = 0; I.cima = 0;
  I.vida = 3; I.inv = 0; I.suelo = true; I.saltoPrev = false;
  I.papa = 0; I.papaCd = 0; I.papaPrev = false; I.sustos = 0;
  I.enem = [];
  for(let p=2;p<IPISOS-1;p+=2)
    I.enem.push({x:200+Math.random()*500, y:I.pisos[p].y-22, vx:(p%4?1:-1)*1.15, piso:p, vivo:true});
  aviso('¡Rompe el hielo con la cabeza! Con B das el SALTO DE PAPÁ 🦘', 4);
}
function danoHielo(){
  if (I.inv>0) return;
  I.inv = 120; susto(I, '¡Ay! Vidas infinitas: vuelves al piso más alto');
  /* lo devuelve a un bloque firme del piso más alto alcanzado */
  const pi = I.pisos[Math.max(0, I.cima)];
  let c = pi.cel.findIndex(v=>v===1);
  if (c<0){ c = 2; pi.cel[2] = 1; }
  I.x = c*IC2 + IC2/2; I.y = pi.y; I.vy = 0; I.suelo = true;
}
function bloqueEn(px, py){
  for(let p=0;p<IPISOS;p++){
    const pi = I.pisos[p];
    if (py > pi.y-4 && py < pi.y+24){
      const c = Math.floor(px/IC2);
      if (c>=0 && c<pi.cel.length && pi.cel[c]===1) return {p, c, pi};
    }
  }
  return null;
}
function updateHielo(){
  I.t++;
  if (I.inv>0) I.inv--;
  if (mIzq()) I.x -= 3.4; if (mDer()) I.x += 3.4;
  I.x = Math.max(14, Math.min(W-14, I.x));
  if ((mSalta()||mArr()) && I.suelo && !I.saltoPrev){ I.vy = -12.6; I.suelo = false; sfx.salto(); }
  I.saltoPrev = mSalta()||mArr();
  /* ---- PODER: el salto de papá, sube dos pisos y rompe hielo a lo ancho ---- */
  if (I.papaCd>0) I.papaCd--;
  if (I.papa>0) I.papa--;
  if (mAccion() && !I.papaPrev && I.suelo && I.papaCd<=0){
    I.vy = -18.6; I.suelo = false; I.papa = 70; I.papaCd = PAPA_CD;
    sfx.poder(); sacudir(3);
    aviso('🦘 ¡SALTO DE PAPÁ!', 1.6);
    hablar('¡Papá, mira cómo salto de alto!');
  }
  I.papaPrev = mAccion();
  I.vy = Math.min(I.vy+0.62, 14);
  const antes = I.y;
  I.y += I.vy;
  I.suelo = false;
  /* romper el hielo con la cabeza (la cabeza va 40 px sobre los pies) */
  if (I.vy < 0){
    const b = bloqueEn(I.x, I.y-40);
    if (b){
      b.pi.cel[b.c] = 0; sfx.romper(); sacudir(3); sumar(80);
      if (I.papa>0){
        /* con el salto de papá abre un butrón de tres bloques y no frena */
        for(const d2 of [-1, 1]) if (b.pi.cel[b.c+d2]===1){ b.pi.cel[b.c+d2] = 0; sumar(80); }
        sacudir(5);
        for(let i=0;i<10;i++) parts.push({tipo:'cascara', x:I.x+(Math.random()-0.5)*80, y:I.y-36, vx:(Math.random()-0.5)*6, vy:-2-Math.random()*3, t:34});
      } else {
        I.vy = 1.2;
        for(let i=0;i<5;i++) parts.push({tipo:'cascara', x:I.x, y:I.y-36, vx:(Math.random()-0.5)*5, vy:-2-Math.random()*2, t:32});
      }
    }
  }
  /* apoyarse en el hielo, sin atravesarlo por ir rápido */
  if (I.vy >= 0){
    for(let p=0;p<IPISOS;p++){
      const pi = I.pisos[p];
      const c = Math.floor(I.x/IC2);
      if (c<0 || c>=pi.cel.length || pi.cel[c]!==1) continue;
      if (antes <= pi.y+2 && I.y >= pi.y){
        I.y = pi.y; I.vy = 0; I.suelo = true;
        I.cima = Math.max(I.cima, p);
        break;
      }
    }
  }
  /* cámara */
  const objetivo = Math.max(0, 470 - I.y - 200);
  I.cam += (objetivo - I.cam) * 0.1;
  /* enemigos que caminan por su piso */
  for(const e of I.enem){
    if (!e.vivo) continue;
    e.x += e.vx;
    const pi = I.pisos[e.piso];
    const c = Math.floor(e.x/IC2);
    if (e.x<20 || e.x>W-20 || c<0 || c>=pi.cel.length || pi.cel[c]!==1) e.vx *= -1;
    e.y = pi.y-22;
    /* aplastarlo cayendo encima; si no, empujón y un corazón menos */
    if (Math.abs(e.x-I.x)<26 && I.y > e.y-6 && I.y < e.y+34){
      if (I.vy > 1.5 && antes < e.y+4){
        e.vivo=false; sumar(400); I.vy=-9; sfx.pisoton(); sacudir(3);
        for(let i=0;i<5;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*2, t:28});
      } else if (I.inv<=0) danoHielo();
    }
  }
  /* caer fuera de la pantalla: pierde un corazón y vuelve al último piso pisado */
  if (I.y > 470 + 240) danoHielo();
  /* llegar a la cima */
  if (I.cima >= IPISOS-1){ resultado=1; modo='finHielo'; sfx.meta(); hablar('¡Hola Cucú, acompáñame'); }
}
function drawHielo(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#0a2a4a'); g.addColorStop(1,'#4a9ad0');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  /* nieve cayendo */
  for(let i=0;i<40;i++){
    const sx = (i*137 + Math.sin(T/30+i)*20)%W;
    const sy = ((i*97 + T*1.6)%(H+40))-20;
    ctx.fillStyle='rgba(255,255,255,0.75)';
    ctx.fillRect(sx, sy, 3, 3);
  }
  ctx.save(); ctx.translate(0, I.cam);
  /* pisos de hielo */
  for(let p=0;p<IPISOS;p++){
    const pi = I.pisos[p];
    if (pi.y+I.cam < -60 || pi.y+I.cam > H+60) continue;
    for(let c=0;c<pi.cel.length;c++){
      if (pi.cel[c]!==1) continue;
      const x = c*IC2;
      rect(x, pi.y, IC2, 24, p===0 ? '#8a7a6a' : '#bfe8f8');
      rect(x, pi.y, IC2, 6, p===0 ? '#a89888' : '#eafaff');
      rect(x, pi.y+20, IC2, 4, p===0 ? '#5a4a3a' : '#7ab8d8');
      ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1;
      ctx.strokeRect(x+1, pi.y+1, IC2-2, 22);
    }
  }
  /* Cucú esperando en la cima */
  const cima = I.pisos[IPISOS-1];
  dibCucu(W/2-11, cima.y-52, 1, T);
  texto('CUCÚ', W/2, cima.y-62, 13, '#ff9ed6', true);
  /* enemigos */
  for(const e of I.enem) if (e.vivo){ sombra(e.x, e.y+22, 15); dibGoomba(e.x-13, e.y, T); }
  /* Fernando (parpadea tras un golpe) */
  sombra(I.x, I.y+2, 15);
  if (!(I.inv>0 && (I.t>>2)%2)){
    ctx.save(); ctx.translate(I.x-12, I.y-40); dibFernandoSolo(); ctx.restore();
  }
  ctx.restore();
  hudMJ('🧊 HIELO', 'PISO: '+(I.cima+1)+'/'+IPISOS+'   '+corazonesInf(I), 'A salta · rompe hielo');
  barraPoder(I.papa>0 ? '🦘 ¡SALTO DE PAPÁ!' : (I.papaCd<=0 ? '🦘 SALTO DE PAPÁ LISTO (B)' : '🦘 tomando impulso...'),
             I.papa>0 ? 1 : 1-I.papaCd/PAPA_CD, I.papa>0);
}

/* ============================================================
   Sala arcade y orquestación
   ============================================================ */
function cajasArcade(){
  return JUEGOS.map((j,i)=>({x: 26+(i%3)*318, y: 140+((i/3)|0)*128, w: 296, h: 116, idx:i, j}));
}
function drawArcade(){
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#1a0a3a'); g.addColorStop(1,'#4a1a6a');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<40;i++){
    ctx.fillStyle='rgba(255,255,255,'+(0.05+Math.sin(T/22+i)*0.05)+')';
    ctx.fillRect((i*137)%W, (i*89)%H, 3, 3);
  }
  texto('🕹️ SALA ARCADE 🕹️', W/2, 78, 40, '#ff9ed6', true);
  texto('Los minijuegos de Fernando y sus amigos', W/2, 110, 16, '#dfc8ff', true);
  for(const c of cajasArcade()){
    const s = sel===c.idx;
    ctx.fillStyle = c.j.color;
    ctx.beginPath(); ctx.roundRect(c.x, c.y, c.w, c.h, 16); ctx.fill();
    ctx.lineWidth = s?6:3; ctx.strokeStyle = s ? '#ffe36e' : 'rgba(255,255,255,0.45)';
    ctx.stroke();
    if (s){ ctx.globalAlpha=0.3+Math.sin(T/7)*0.22; ctx.lineWidth=12; ctx.stroke(); ctx.globalAlpha=1; }
    ctx.font='36px monospace'; ctx.textAlign='left';
    ctx.fillText(c.j.emoji, c.x+16, c.y+62);
    texto(c.j.nombre, c.x+66, c.y+44, 17, '#fff');
    /* la descripción se parte en líneas que quepan de verdad dentro de la tarjeta */
    ctx.font = 'bold 11.5px monospace';
    const ancho = c.w - 76;
    const lineas = [];
    let linea = '';
    for(const palabra of c.j.desc.split(' ')){
      const prueba = linea ? linea+' '+palabra : palabra;
      if (ctx.measureText(prueba).width > ancho && linea){ lineas.push(linea); linea = palabra; }
      else linea = prueba;
      if (lineas.length===3) break;
    }
    if (linea && lineas.length<3) lineas.push(linea);
    lineas.forEach((l,i)=> texto(l, c.x+66, c.y+64+i*16, 11.5, 'rgba(255,255,255,0.85)'));
  }
  /* botón para volver: sin él, en el celular no había manera de salir de la sala */
  const z = zonaVolver();
  ctx.fillStyle='rgba(255,255,255,0.18)';
  ctx.beginPath(); ctx.roundRect(z.x, z.y, z.w, z.h, 12); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=2; ctx.stroke();
  texto('✕ VOLVER', z.x+z.w/2, z.y+27, 17, '#fff', true);
  texto('Toca un juego · flechas + ENTER · ESC o ✕ VOLVER para salir', W/2, H-30, 15, '#dfc8ff', true);
}
function abrirArcade(){ estado = 'arcade'; modo = null; sel = 0; }
function empezar(id){
  resultado = 0; puntosMJ = 0; parts.length = 0;
  if (id==='birds'){ iniciarBirds(); modo='birds'; estado='mjBirds'; }
  else if (id==='dig'){ iniciarDig(); modo='dig'; estado='mjDig'; }
  else if (id==='kong'){ iniciarKong(); modo='kong'; estado='mjKong'; }
  else if (id==='contra'){ iniciarContra(); modo='contra'; estado='mjContra'; }
  else if (id==='globos'){ iniciarGlobos(); modo='globos'; estado='mjGlobos'; }
  else if (id==='bomba'){ iniciarBombas(); modo='bomba'; estado='mjBombas'; }
  else if (id==='hielo'){ iniciarHielo(); modo='hielo'; estado='mjHielo'; }
  cortina = 40;
}
function activo(){ return estado==='arcade' || (typeof estado==='string' && estado.indexOf('mj')===0); }
function update(){
  T++;
  if (msgT>0) msgT--;
  actualizarExtras();
  if (estado==='arcade'){
    if (pt.soltado){
      pt.soltado = false;
      /* volver al selector de mundos (y de ahí al menú principal) */
      const z = zonaVolver();
      if (pt.x>=z.x && pt.x<=z.x+z.w && pt.y>=z.y && pt.y<=z.y+z.h){ estado='mapa'; return; }
      /* toque en las tarjetas */
      for(const c of cajasArcade())
        if (pt.x>=c.x && pt.x<=c.x+c.w && pt.y>=c.y && pt.y<=c.y+c.h){ sel=c.idx; empezar(c.j.id); break; }
    }
    return;
  }
  if (modo==='birds') updateBirds();
  else if (modo==='dig') updateDig();
  else if (modo==='kong') updateKong();
  else if (modo==='contra') updateContra();
  else if (modo==='globos') updateGlobos();
  else if (modo==='bomba') updateBombas();
  else if (modo==='hielo') updateHielo();
  else if (modo && modo.indexOf('fin')===0){
    if (pt.soltado){ pt.soltado=false; abrirArcade(); }
  }
  /* salir tocando el botón SALIR del marcador */
  if (pt.soltado && modo && modo.indexOf('fin')!==0){
    const z = zonaSalir();
    if (pt.x>=z.x && pt.x<=z.x+z.w && pt.y>=z.y && pt.y<=z.y+z.h){ pt.soltado=false; abrirArcade(); return; }
  }
}
function draw(){
  if (estado==='arcade'){ drawArcade(); dibFXFinales(); return; }
  if (modo==='birds') drawBirds();
  else if (modo==='dig') drawDig();
  else if (modo==='kong') drawKong();
  else if (modo==='contra') drawContra();
  else if (modo==='globos') drawGlobos();
  else if (modo==='bomba') drawBombas();
  else if (modo==='hielo') drawHielo();
  else if (modo==='finBirds') pantallaFin(resultado, resultado?'¡GANASTE!':'CASI...', resultado?'¡Todos los goombas fuera!':'Se acabaron los lanzamientos');
  else if (modo==='finDig') pantallaFin(resultado, resultado?'¡GANASTE!':'¡TE ATRAPARON!', resultado?'¡Túneles limpios!':'Inténtalo otra vez, pichunguito');
  else if (modo==='finKong') pantallaFin(resultado, resultado?'¡RESCATASTE A MAMÁ!':'¡UN BARRIL!', resultado?'«¡Te amo mamá!»':'Sube con más cuidado');
  else if (modo==='finContra') pantallaFin(resultado, resultado?'¡JEFE DERROTADO!':'SIN CORAZONES', resultado?'¡Eres el pichunguito campeón!':'Vuelve a intentarlo');
  else if (modo==='finGlobos') pantallaFin(resultado, resultado?'¡GANASTE!':'¡AL AGUA!', resultado?'¡Todos los koopas al mar!':'Se te acabaron los globos');
  else if (modo==='finBombas') pantallaFin(resultado, resultado?'¡GANASTE!':'¡BOOM!', resultado?'¡Laberinto despejado!':'Cuidado con tus propias bombas');
  else if (modo==='finHielo') pantallaFin(resultado, resultado?'¡LLEGASTE A CUCÚ!':'¡TE CAÍSTE!', resultado?'«¡Hola Cucú, acompáñame!»':'Sube con más cuidado');
  /* partículas compartidas */
  for(const p of parts){
    if (p.tipo==='estrellita'){ ctx.fillStyle='#ffe36e'; ctx.font='16px monospace'; ctx.fillText('✦',p.x,p.y); }
    else if (p.tipo==='ladrillo'){ ctx.fillStyle='#c88a3a'; ctx.fillRect(p.x,p.y,9,7); }
    else if (p.tipo==='pedo'){
      ctx.fillStyle='rgba(140,225,100,'+Math.min(0.6, p.t/70)+')';
      ctx.beginPath(); ctx.arc(p.x, p.y, 6+ (60-Math.min(60,p.t))*0.22, 0, Math.PI*2); ctx.fill();
    }
    else if (p.tipo==='cascara'){ ctx.fillStyle='#dff2fb'; ctx.fillRect(p.x,p.y,7,7); }
    else if (p.tipo==='polvo'){ ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.fillRect(p.x,p.y,4,4); }
  }
  if (msgT>0){
    const a = Math.min(1, msgT/30);
    ctx.globalAlpha = a;
    ctx.fillStyle='rgba(0,0,0,0.65)';
    ctx.font='bold 20px monospace';
    const w2 = ctx.measureText(msg).width;
    ctx.beginPath(); ctx.roundRect(W/2-w2/2-16, H-92, w2+32, 40, 10); ctx.fill();
    texto(msg, W/2, H-64, 20, '#ffe36e', true);
    ctx.globalAlpha = 1;
  }
  dibFXFinales();
}
function tecla(k){
  if (estado==='arcade'){
    if (k==='ArrowLeft') sel = (sel+JUEGOS.length-1)%JUEGOS.length;
    else if (k==='ArrowRight') sel = (sel+1)%JUEGOS.length;
    else if (k==='ArrowUp') sel = (sel+JUEGOS.length-3)%JUEGOS.length;
    else if (k==='ArrowDown') sel = (sel+3)%JUEGOS.length;
    else if (k==='Enter'||k===' ') empezar(JUEGOS[sel].id);
    else if (k==='Escape') estado='mapa';
    return;
  }
  if (modo && modo.indexOf('fin')===0){
    if (k==='Enter'||k===' '||k==='Escape') abrirArcade();
    return;
  }
  if (k==='Escape') abrirArcade();
}
return { activo, update, draw, tecla, abrirArcade, empezar,
         _estado: ()=>modo, _juegos: JUEGOS,
         _B:B, _D:D, _K:K, _C:C, _KPL:KPL, _KESC:KESC, _G:G, _M:M, _I:I,
         _MW:MW, _MH:MH, _IPISOS:IPISOS, _DY0:DY0, _DC:DC, _MX0:MX0, _MY0:MY0, _MC:MC, _IC2:IC2 };
})();
