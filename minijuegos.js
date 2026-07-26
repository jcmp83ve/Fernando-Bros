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
   desc:'Lanza a Penny y Sheldon con la resortera'},
  {id:'dig',    nombre:'FERNANDO DIG',    emoji:'⛏️', color:'#a05a28',
   desc:'Cava túneles e infla a los goombas'},
  {id:'kong',   nombre:'FERNANDO KONG',   emoji:'🛢️', color:'#2a5ab0',
   desc:'Sube esquivando los barriles de Bowser'},
  {id:'contra', nombre:'FERNANDO CONTRA', emoji:'🔫', color:'#7a2a8a',
   desc:'Dispara sin parar hasta el jefe final'},
];
let sel = 0, modo = null, T = 0, msg = '', msgT = 0, resultado = 0;

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
  if (derTxt) texto(derTxt, 450, 28, 13, '#8ecbff');
  const z = zonaSalir();
  ctx.fillStyle='rgba(255,255,255,0.16)';
  ctx.beginPath(); ctx.roundRect(z.x, z.y, z.w, z.h, 9); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=2; ctx.stroke();
  texto('✕ SALIR', z.x+z.w/2, z.y+20, 13, '#fff', true);
}
function zonaSalir(){ return {x: W-108, y: 8, w: 96, h: 29}; }
function pantallaFin(gano, titulo, sub){
  const g = ctx.createLinearGradient(0,0,0,H);
  if (gano){ g.addColorStop(0,'#0a3a1a'); g.addColorStop(1,'#2a8a4a'); }
  else { g.addColorStop(0,'#3a0a1a'); g.addColorStop(1,'#8a2a3a'); }
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  texto(gano ? '🏆 '+titulo : titulo, W/2, 200, 46, gano?'#ffe36e':'#ffb0b0', true);
  texto(sub, W/2, 260, 20, '#fff', true);
  texto('PUNTOS: '+puntos, W/2, 320, 22, '#8ecbff', true);
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
const B = { proy:null, cajas:[], bichos:[], tiros:3, listos:[], apunta:false, ang:-0.6, fza:0, fase:'espera' };
const SUELO_B = 470;
function iniciarBirds(){
  B.tiros = 3; B.fase='espera'; B.proy=null; B.ang=-0.6; B.fza=0;
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
  aviso('¡Arrastra hacia atrás y suelta para lanzar!', 3);
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
                tipo:B.listos[3-B.tiros] || 'penny', t:0};
      B.fase='vuela'; B.tiros--; sfx.salto();
    } else {
      /* control por teclas para quien juega sin pantalla táctil */
      if (izq()) B.ang -= 0.02;
      if (der()) B.ang += 0.02;
      if (kSalto()) B.fza = Math.min(B.fza+0.35, 20);
      else if (B.fza > 2){
        B.proy = {x:RES.x, y:RES.y, vx:Math.cos(B.ang)*B.fza, vy:Math.sin(B.ang)*B.fza,
                  tipo:B.listos[3-B.tiros] || 'penny', t:0};
        B.fase='vuela'; B.tiros--; sfx.salto(); B.fza=0;
      }
    }
    pt.soltado = false;
  }
  /* proyectil */
  if (B.proy){
    const p = B.proy;
    p.vy += 0.42; p.x += p.vx; p.y += p.vy; p.t++;
    if (p.y > SUELO_B-14){ p.y = SUELO_B-14; p.vy *= -0.42; p.vx *= 0.7; }
    for(const c of B.cajas){
      if (p.x+12>c.x && p.x-12<c.x+c.w && p.y+12>c.y && p.y-12<c.y+c.h){
        const fuerza = Math.hypot(p.vx,p.vy);
        c.vx += p.vx*0.5; c.vy += p.vy*0.4 - 1.5;
        if (fuerza>7){ c.vida--; sacudir(3); }
        p.vx *= -0.32; p.vy *= 0.5;
        sfx.romper();
      }
    }
    for(const b of B.bichos){
      if (b.vivo && Math.abs(p.x-b.x)<24 && Math.abs(p.y-b.y)<24){
        b.vivo=false; puntos+=500; sfx.pisoton(); sacudir(4);
        for(let i=0;i<6;i++) parts.push({tipo:'estrellita', x:b.x, y:b.y, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*3, t:34});
      }
    }
    if (p.t>260 || (Math.abs(p.vx)<0.4 && Math.abs(p.vy)<0.5 && p.y>=SUELO_B-16)){
      B.proy=null; B.fase='espera';
    }
    if (p.x>W+400 || p.x<-200){ B.proy=null; B.fase='espera'; }
  }
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
      puntos+=100;
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
        b.vivo=false; puntos+=500; sfx.pisoton();
      }
      if (b.x+12>c.x && b.x-12<c.x+c.w && b.y+14>c.y && b.y+14<c.y+c.h+6 && b.vy>=0){
        b.y = c.y-14; b.vy = 0;
      }
    }
  }
  /* fin */
  const quedan = B.bichos.filter(b=>b.vivo).length;
  if (quedan===0 && !B.proy){
    resultado = 1; modo='finBirds'; sfx.meta();
    hablar('¡Toma, pichungazo!');
  } else if (B.tiros<=0 && !B.proy && B.fase==='espera'){
    resultado = 0; modo='finBirds';
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
  /* proyectil */
  if (B.proy){
    const p = B.proy;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.t*0.15);
    if (p.tipo==='cucu') dibCucu(-11,-14,1,T);
    else { ctx.translate(-13,-10); dibPerroSolo(p.tipo==='penny'?'#222':'#8a5a2a'); }
    ctx.restore();
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
  /* munición restante */
  for(let i=0;i<B.tiros;i++){
    ctx.save(); ctx.translate(40+i*34, SUELO_B+34); ctx.scale(0.85,0.85);
    dibPerroSolo(i===0?'#222':(i===1?'#8a5a2a':'#ff6ec0'));
    ctx.restore();
  }
  hudMJ('🐦 BIRDS', 'GOOMBAS: '+B.bichos.filter(b=>b.vivo).length+'  TIROS: '+B.tiros, 'arrastra y suelta');
}

/* ============================================================
   2) FERNANDO DIG  (estilo Dig Dug)
   ============================================================ */
const D = { g:[], jx:0, jy:0, dir:0, arpon:0, arponL:0, enem:[], rocas:[], listo:false };
const DC = 40, DW = 24, DH = 11, DY0 = 60;
function iniciarDig(){
  D.g = Array.from({length:DH}, (_,y)=> Array.from({length:DW}, (_,x)=> y<1 ? 0 : 1));
  D.jx = 2; D.jy = 1; D.dir = 1; D.arpon = 0; D.px = D.jx*DC; D.py = DY0+D.jy*DC;
  D.g[1][1] = 0; D.g[1][2] = 0;
  D.enem = [
    {x:18*DC, y:DY0+3*DC, vivo:true, infla:0, t:0},
    {x:20*DC, y:DY0+6*DC, vivo:true, infla:0, t:0},
    {x:8*DC,  y:DY0+8*DC, vivo:true, infla:0, t:0},
    {x:15*DC, y:DY0+9*DC, vivo:true, infla:0, t:0},
  ];
  for(const e of D.enem){ const cx=(e.x/DC)|0, cy=((e.y-DY0)/DC)|0; D.g[cy][cx]=0; }
  D.rocas = [{cx:6, cy:2, cae:false, y:DY0+2*DC}, {cx:13, cy:4, cae:false, y:DY0+4*DC}, {cx:19, cy:7, cae:false, y:DY0+7*DC}];
  aviso('¡Cava túneles y usa A para inflar a los goombas!', 3);
}
function celdaLibre(cx, cy){ return cx>=0 && cx<DW && cy>=0 && cy<DH; }
function updateDig(){
  /* movimiento por rejilla suave */
  const vel = 2.6;
  let mx=0, my=0;
  if (izq()) mx=-1; else if (der()) mx=1;
  else if (kSalto() && !D.disparoPrev) mx=0;
  if (keys['arrowup']||keys['w']) my=-1; else if (keys['arrowdown']||keys['s']) my=1;
  if (mx){ D.dir = mx>0?1:3; D.px += mx*vel; my=0; }
  else if (my){ D.dir = my>0?2:0; D.py += my*vel; }
  D.px = Math.max(0, Math.min((DW-1)*DC, D.px));
  D.py = Math.max(DY0, Math.min(DY0+(DH-1)*DC, D.py));
  /* excavar */
  const cx = Math.round(D.px/DC), cy = Math.round((D.py-DY0)/DC);
  if (celdaLibre(cx,cy) && D.g[cy][cx]===1){ D.g[cy][cx]=0; puntos+=10; }
  /* arpón / bomba de aire */
  if (kCorre() && !D.disparoPrev && D.arpon<=0){ D.arpon = 34; D.arponL = 0; sfx.fuego(); }
  D.disparoPrev = kCorre();
  if (D.arpon>0){
    D.arpon--;
    D.arponL = Math.min(D.arponL+7, 110);
    const dx=[0,1,0,-1][D.dir], dy=[-1,0,1,0][D.dir];
    for(const e of D.enem){
      if (!e.vivo) continue;
      for(let l=10; l<=D.arponL; l+=12){
        if (Math.abs(e.x-(D.px+dx*l))<20 && Math.abs(e.y-(D.py+dy*l))<20){
          e.infla += 0.06; e.golpe = 10;
          if (e.infla>=1){ e.vivo=false; puntos+=800; sfx.pisoton(); sacudir(3);
            for(let i=0;i<8;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y, vx:(Math.random()-0.5)*5, vy:-2-Math.random()*3, t:34}); }
          break;
        }
      }
    }
  } else {
    D.arponL = 0;
    for(const e of D.enem) if (e.infla>0) e.infla = Math.max(0, e.infla-0.004);
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
    if (Math.abs(e.x-D.px)<24 && Math.abs(e.y-D.py)<24 && e.infla<0.5){
      resultado = 0; modo='finDig'; sfx.dano();
    }
  }
  /* rocas: caen si no hay tierra debajo */
  for(const r of D.rocas){
    if (!r.cae){
      const cy2 = Math.round((r.y-DY0)/DC)+1;
      if (celdaLibre(r.cx, cy2) && D.g[cy2][r.cx]===0 && Math.abs(D.px-r.cx*DC)>6) r.cae = true;
    } else {
      r.y += 5;
      const rcy = Math.round((r.y-DY0)/DC);
      for(const e of D.enem) if (e.vivo && Math.abs(e.x-r.cx*DC)<26 && Math.abs(e.y-r.y)<26){
        e.vivo=false; puntos+=1000; sfx.romper(); sacudir(4);
      }
      if (Math.abs(D.px-r.cx*DC)<26 && Math.abs(D.py-r.y)<26){ resultado=0; modo='finDig'; sfx.dano(); }
      if (r.y > DY0+(DH-1)*DC || (celdaLibre(r.cx,rcy+1) && D.g[rcy+1][r.cx]===1)){ r.cae=false; r.parada=true; }
    }
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
  /* rocas */
  for(const r of D.rocas){
    ctx.fillStyle='#8a8a96';
    ctx.beginPath(); ctx.roundRect(r.cx*DC-18, r.y-18, 36, 36, 9); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.22)'; ctx.fillRect(r.cx*DC-12, r.y-13, 20, 5);
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
  /* Fernando */
  ctx.save(); ctx.translate(D.px-12, D.py-20); dibFernandoSolo(); ctx.restore();
  hudMJ('⛏️ DIG', 'GOOMBAS: '+D.enem.filter(e=>e.vivo).length, 'flechas cavan · B infla');
}

/* ============================================================
   3) FERNANDO KONG  (estilo Donkey Kong)
   ============================================================ */
const K = { x:0, y:0, vy:0, suelo:false, barriles:[], t:0, escalando:false };
const KPL = [];   /* plataformas: {x0,x1,y0,y1} ligeramente inclinadas */
const KESC = [];  /* escaleras: {x, y0, y1} */
function iniciarKong(){
  KPL.length = 0; KESC.length = 0;
  const filas = 5, sep = 84, baseY = 500;
  for(let i=0;i<filas;i++){
    const y = baseY - i*sep;
    const izqL = i%2===0;
    KPL.push({x0: izqL?60:120, x1: izqL?W-120:W-60, y0: izqL?y:y-14, y1: izqL?y-14:y});
    KESC.push({x: izqL ? W-190 : 190, y0: y-sep, y1: y});
  }
  KPL.push({x0:60, x1:W-60, y0:baseY+40, y1:baseY+40});
  K.x = 110; K.y = baseY+10; K.vy = 0; K.barriles = []; K.t = 0;
  aviso('¡Sube hasta mamá princesa esquivando los barriles!', 3);
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
  /* escaleras */
  const esc = KESC.find(e => Math.abs(K.x-e.x)<20 && K.y<=e.y1+16 && K.y>=e.y0-6);
  const sube = keys['arrowup']||keys['w'], baja = keys['arrowdown']||keys['s'];
  if (esc && (sube||baja)){
    K.escalando = true; K.vy = 0;
    K.y += sube ? -2.4 : 2.4;
    K.x += (esc.x - K.x)*0.4;
    K.y = Math.max(esc.y0-4, Math.min(esc.y1+8, K.y));
    if (K.y<=esc.y0-3) K.escalando = false;
  } else {
    K.escalando = false;
    if (izq()) K.x -= 3.2; if (der()) K.x += 3.2;
    K.x = Math.max(60, Math.min(W-60, K.x));
    if (kSalto() && K.suelo && !K.saltoPrev){ K.vy = -9.5; K.suelo=false; sfx.salto(); }
    K.saltoPrev = kSalto();
    K.vy = Math.min(K.vy+0.55, 13); K.y += K.vy;
    const py = alturaPlataforma(K.x, K.y);
    K.suelo = false;
    if (py!==null && K.vy>=0 && K.y>=py-16 && K.y<=py+20){ K.y = py; K.vy = 0; K.suelo = true; }
    if (K.y > H+40){ resultado=0; modo='finKong'; }
  }
  /* barriles que tira Bowser */
  if (K.t%92===0){
    K.barriles.push({x:150, y:KPL[KPL.length-2].y0-16, vx:2.6, vy:0, rot:0});
    sfx.romper();
  }
  for(const b of K.barriles){
    b.vy = Math.min(b.vy+0.55, 12);
    b.x += b.vx; b.y += b.vy; b.rot += b.vx*0.09;
    const py = alturaPlataforma(b.x, b.y);
    if (py!==null && b.vy>=0 && b.y>=py-16 && b.y<=py+22){ b.y = py; b.vy = 0; }
    if (b.x > W-70){ b.vx = -Math.abs(b.vx); b.y -= 10; }
    if (b.x < 70){ b.vx = Math.abs(b.vx); b.y -= 10; }
    if (Math.abs(b.x-K.x)<20 && Math.abs(b.y-K.y)<26){ resultado=0; modo='finKong'; sfx.dano(); sacudir(5); }
    if (K.suelo && Math.abs(b.x-K.x)<40 && K.y < b.y-18 && !b.contado){ b.contado=true; puntos+=200; }
  }
  K.barriles = K.barriles.filter(b=>b.y < H+60);
  /* llegar arriba con mamá princesa */
  if (K.y < KPL[KPL.length-2].y0-30 && K.x > W-360){
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
  /* Fernando */
  sombra(K.x, K.y+2, 15);
  ctx.save(); ctx.translate(K.x-12, K.y-40); dibFernandoSolo(); ctx.restore();
  hudMJ('🛢️ KONG', 'ALTURA: '+Math.max(0, Math.round((520-K.y)/4))+'m', '↑ escaleras · A salta');
}

/* ============================================================
   4) FERNANDO CONTRA
   ============================================================ */
const C = { x:0, y:0, vy:0, suelo:false, vida:5, balas:[], enem:[], balasE:[], scroll:0, t:0, jefe:null };
const SUELO_C = 470;
function iniciarContra(){
  C.x = 140; C.y = SUELO_C; C.vy = 0; C.vida = 5;
  C.balas = []; C.enem = []; C.balasE = []; C.scroll = 0; C.t = 0; C.jefe = null;
  aviso('¡MAYÚS/B dispara · A salta! Llega hasta el jefe', 3);
}
function updateContra(){
  C.t++;
  if (izq()) C.x -= 3.4; if (der()) C.x += 3.4;
  C.x = Math.max(30, Math.min(W-260, C.x));
  C.cara = izq() ? -1 : 1;
  if (kSalto() && C.suelo && !C.saltoPrev){ C.vy = -11; C.suelo = false; sfx.salto(); }
  C.saltoPrev = kSalto();
  C.vy = Math.min(C.vy+0.6, 14); C.y += C.vy;
  if (C.y >= SUELO_C){ C.y = SUELO_C; C.vy = 0; C.suelo = true; }
  C.scroll += C.jefe ? 0 : 1.5;
  /* disparo */
  if (kCorre() && !C.dispPrev){
    C.balas.push({x:C.x+16, y:C.y-26, vx:11*(C.cara||1)});
    sfx.fuego();
  }
  C.dispPrev = kCorre();
  for(const b of C.balas){ b.x += b.vx; }
  C.balas = C.balas.filter(b=>b.x>-20 && b.x<W+20);
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
        if (e.vida<=0){ e.muerto=true; puntos+=300; sfx.pisoton();
          for(let i=0;i<5;i++) parts.push({tipo:'estrellita', x:e.x, y:e.y-20, vx:(Math.random()-0.5)*4, vy:-2-Math.random()*2, t:30}); }
      }
    }
    if (Math.abs(e.x-C.x)<26 && Math.abs(e.y-C.y)<40 && !e.muerto && !e.tocado){
      e.tocado = true; C.vida--; sfx.dano(); sacudir(4);
    }
  }
  C.enem = C.enem.filter(e=>!e.muerto && e.x>-60);
  for(const b of C.balasE){
    b.x += b.vx;
    if (Math.abs(b.x-C.x)<18 && Math.abs(b.y-(C.y-26))<28 && !b.usada){
      b.usada = true; C.vida--; sfx.dano(); sacudir(4);
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
        b.x = 9999; j.vida--; j.golpe = 8; sfx.pisoton();
      }
    }
    if (j.golpe>0) j.golpe--;
    if (j.vida<=0){ resultado=1; modo='finContra'; sfx.meta(); hablar('¡Gané! ¡Soy el pichunguito campeón!'); }
  }
  if (C.vida<=0){ resultado=0; modo='finContra'; }
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
  /* balas */
  for(const b of C.balas){ ctx.fillStyle='#ffe36e';
    ctx.beginPath(); ctx.arc(b.x, b.y, 5, 0, Math.PI*2); ctx.fill(); }
  for(const b of C.balasE){ ctx.fillStyle='#ff6a4a';
    ctx.beginPath(); ctx.arc(b.x, b.y, 6, 0, Math.PI*2); ctx.fill(); }
  /* Fernando disparando */
  sombra(C.x, SUELO_C+18, 16);
  ctx.save(); ctx.translate(C.x-12, C.y-40);
  if (C.cara<0){ ctx.translate(24,0); ctx.scale(-1,1); }
  dibFernandoSolo();
  rect(20, 16, 16, 5, '#3a3a44');
  ctx.restore();
  /* Tío Juan de apoyo, volando */
  dibTioJuan(C.x-70, C.y-150+Math.sin(T/16)*8, T);
  /* vida */
  for(let i=0;i<5;i++){
    ctx.fillStyle = i<C.vida ? '#ff5a8a' : 'rgba(255,255,255,0.18)';
    ctx.font='22px monospace'; ctx.fillText('♥', 300+i*26, 30);
  }
  hudMJ('🔫 CONTRA', '', C.jefe ? '¡DERROTA A BOWSER!' : 'B dispara · A salta');
}

/* ============================================================
   Sala arcade y orquestación
   ============================================================ */
function cajasArcade(){
  return JUEGOS.map((j,i)=>({x: 60+(i%2)*450, y: 150+((i/2)|0)*160, w: 420, h: 132, idx:i, j}));
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
    ctx.font='44px monospace'; ctx.textAlign='left';
    ctx.fillText(c.j.emoji, c.x+22, c.y+80);
    texto(c.j.nombre, c.x+92, c.y+56, 24, '#fff');
    texto(c.j.desc, c.x+92, c.y+88, 14, 'rgba(255,255,255,0.85)');
  }
  texto('Toca un juego · flechas + ENTER · ESC vuelve al mapa', W/2, H-30, 15, '#dfc8ff', true);
}
function abrirArcade(){ estado = 'arcade'; modo = null; sel = 0; }
function empezar(id){
  resultado = 0;
  if (id==='birds'){ iniciarBirds(); modo='birds'; estado='mjBirds'; }
  else if (id==='dig'){ iniciarDig(); modo='dig'; estado='mjDig'; }
  else if (id==='kong'){ iniciarKong(); modo='kong'; estado='mjKong'; }
  else if (id==='contra'){ iniciarContra(); modo='contra'; estado='mjContra'; }
  cortina = 40;
}
function activo(){ return estado==='arcade' || (typeof estado==='string' && estado.indexOf('mj')===0); }
function update(){
  T++;
  if (msgT>0) msgT--;
  actualizarExtras();
  if (estado==='arcade'){
    /* toque en las tarjetas */
    if (pt.soltado){
      pt.soltado = false;
      for(const c of cajasArcade())
        if (pt.x>=c.x && pt.x<=c.x+c.w && pt.y>=c.y && pt.y<=c.y+c.h){ sel=c.idx; empezar(c.j.id); break; }
    }
    return;
  }
  if (modo==='birds') updateBirds();
  else if (modo==='dig') updateDig();
  else if (modo==='kong') updateKong();
  else if (modo==='contra') updateContra();
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
  else if (modo==='finBirds') pantallaFin(resultado, resultado?'¡GANASTE!':'CASI...', resultado?'¡Todos los goombas fuera!':'Se acabaron los lanzamientos');
  else if (modo==='finDig') pantallaFin(resultado, resultado?'¡GANASTE!':'¡TE ATRAPARON!', resultado?'¡Túneles limpios!':'Inténtalo otra vez, pichunguito');
  else if (modo==='finKong') pantallaFin(resultado, resultado?'¡RESCATASTE A MAMÁ!':'¡UN BARRIL!', resultado?'«¡Te amo mamá!»':'Sube con más cuidado');
  else if (modo==='finContra') pantallaFin(resultado, resultado?'¡JEFE DERROTADO!':'SIN CORAZONES', resultado?'¡Eres el pichunguito campeón!':'Vuelve a intentarlo');
  /* partículas compartidas */
  for(const p of parts){
    if (p.tipo==='estrellita'){ ctx.fillStyle='#ffe36e'; ctx.font='16px monospace'; ctx.fillText('✦',p.x,p.y); }
    else if (p.tipo==='ladrillo'){ ctx.fillStyle='#c88a3a'; ctx.fillRect(p.x,p.y,9,7); }
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
    else if (k==='ArrowUp') sel = (sel+JUEGOS.length-2)%JUEGOS.length;
    else if (k==='ArrowDown') sel = (sel+2)%JUEGOS.length;
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
         _B:B, _D:D, _K:K, _C:C, _KPL:KPL, _KESC:KESC };
})();
