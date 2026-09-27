(function(raiz){
'use strict';
/* ============================================================
   SALOMÓN Y LOS PRIMOS — LA RED: jugar con amigos (hasta 4)
   Igual que en la Aventura 3D: los navegadores se conectan
   directo entre sí (WebRTC) y para presentarse usan dos caminos
   a la vez, Nostr y MQTT, cada uno con varios relés públicos.
   Además hay un camino de reserva (el «relé» por MQTT) para
   cuando el enlace directo no abre, como pasa con datos móviles.
   Cada aparato juega su propia partida; solo se comparte dónde
   está cada quien, lo que hace y las chispas y barajitas ganadas.

   Este archivo no dibuja nada: la vista lee SALO_RED.remotos y
   rellena SALO_RED.on, SALO_RED.saludo y SALO_RED.alSaludo.
   ============================================================ */

/* ---------------- lo puro: códigos de sala y lo que llega ---------------- */
const ALFABETO_SALA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   /* sin I, O, 0 ni 1, que se confunden */
const VERSION_RED = 1;
const MAX_JUGADORES = 4;          /* el anfitrión y tres amigos (lo mismo que SALO.MAX_JUGADORES) */
const OLVIDO_MS = 12000;          /* quien lleva 12 s sin mandar nada se da por ido */
function codigoSala(azar){ azar = azar || Math.random; let c = ''; for (let i = 0; i < 4; i++) c += ALFABETO_SALA[Math.floor(azar()*ALFABETO_SALA.length)]; return c; }
function normalizarCodigo(t){ return String(t || '').toUpperCase().split('').filter(ch=>ALFABETO_SALA.includes(ch)).slice(0, 4).join(''); }
function sanearNombre(n){ return String(n || '').replace(/[^\wáéíóúñÁÉÍÓÚÑ ]/g, '').slice(0, 14); }
const PJS_OK = ['salomon', 'primo', 'mollejuo'];
const ES_CHISPA = /^\d+-[jcm]\d*$/, ES_BARAJITA = /^\d+-b\d$/;   /* los mismos que SALO.recibirPremio */
const numOk = (v, a, b)=>Number.isFinite(v) ? Math.min(b, Math.max(a, v)) : 0;
/* la lista de premios de un saludo: solo textos cortos con la forma correcta, sin repetidos */
function listaPremios(l, forma){
  if (!Array.isArray(l)) return [];
  const r = [];
  for (const id of l.slice(0, 300)) if (typeof id === 'string' && id.length <= 12 && forma.test(id) && !r.includes(id)) r.push(id);
  return r;
}
function sanearSaludo(m){
  const pj = PJS_OK.includes(m.pj) ? m.pj : 'salomon';
  return {pj, n: sanearNombre(m.n), chispas: listaPremios(m.ch, ES_CHISPA), barajitas: listaPremios(m.ba, ES_BARAJITA), anf: !!m.anf};
}
/* un evento suelto: solo los tipos conocidos y con números finitos; lo demás se tira */
function sanearEvento(m){
  if (!m || typeof m !== 'object') return null;
  if (m.tipo === 'premio'){
    if (m.que === 'chispa' && typeof m.id === 'string' && m.id.length <= 12 && ES_CHISPA.test(m.id)) return {tipo: 'premio', que: 'chispa', id: m.id};
    if (m.que === 'barajita' && typeof m.id === 'string' && m.id.length <= 12 && ES_BARAJITA.test(m.id)) return {tipo: 'premio', que: 'barajita', id: m.id};
    return null;
  }
  if (m.tipo === 'fx'){
    if (typeof m.fx !== 'string' || !/^[a-z]{1,16}$/.test(m.fx) || ![m.x, m.y, m.z].every(Number.isFinite)) return null;
    return {tipo: 'fx', fx: m.fx, x: numOk(m.x, -500, 500), y: numOk(m.y, -60, 300), z: numOk(m.z, -500, 500)};
  }
  return null;
}
const envolver = a=>{ while (a > Math.PI) a -= 2*Math.PI; while (a < -Math.PI) a += 2*Math.PI; return a; };

const PURO = {ALFABETO_SALA, VERSION_RED, MAX_JUGADORES, codigoSala, normalizarCodigo, sanearNombre, sanearSaludo, sanearEvento, listaPremios};
if (typeof module !== 'undefined' && module.exports){ module.exports = PURO; return; }

/* ---------------- Trystero: la sala ---------------- */
const MEDIOS = ['nostr', 'mqtt'];
/* Los servidores que ayudan a que dos aparatos se hablen directo: STUN para
   descubrir la dirección de cada uno, y TURN (relevo gratuito de Open Relay)
   para cuando el router no deja hablar directo, por ejemplo en WiFi con
   aislamiento entre aparatos o cuando uno está con datos móviles. */
const CONFIG = {appId: 'fernando-bros-salomon3d', relayConfig: {redundancy: 4, warnOnRelayFailure: false}, rtcConfig: {iceServers: [
  {urls: 'stun:stun.l.google.com:19302'}, {urls: 'stun:stun1.l.google.com:19302'}, {urls: 'stun:stun.cloudflare.com:3478'}, {urls: 'stun:stun.relay.metered.ca:80'},
  {urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject'},
  {urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject'},
  {urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject'},
]}};
/* los relés: null = la lista pública de Trystero; en las pruebas se ponen los de la misma máquina */
const RELES = {nostr: null, mqtt: null, rele: null};
/* por dentro: salas abiertas, acciones para mandar y por qué caminos se ve a cada amigo */
const I = {rooms: {}, acciones: {}, pares: new Map(), anfitrionId: '', t0: 0, fallos: 0, vistos: 0, llenos: new Set(), ultPaso: 0};
const hay = ()=>typeof Trystero !== 'undefined' && !!(Trystero.nostr && Trystero.mqtt);
const abierta = ()=>Object.keys(I.rooms).length > 0 || !!RELE.sala;
const decir = t=>{ try{ if (RED.on.aviso) RED.on.aviso(t); }catch(e){ console.warn('aviso: ' + (e && e.message)); } };
const llamar = (f, ...a)=>{ try{ if (typeof f === 'function') return f(...a); }catch(e){ console.warn('red: ' + (e && e.message)); } };

/* ---- el camino de reserva ("relé"): cuando el enlace directo entre aparatos (WebRTC) no abre —pasa mucho con
   datos móviles, donde la operadora no deja pasar la conexión— el juego se manda por los mismos brokers MQTT
   públicos, como mensajitos. Se abre desde el principio, así los amigos se ven en un par de segundos; en cuanto
   el enlace directo se abre, se usa ese (es más rápido). ---- */
const RELE_BROKERS = ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt'];
const RELE = {clientes: [], vistos: new Map(), sala: '', ultimoAqui: 0, id: '', seq: 0, nE: 0, avisados: new Set()};
function releId(){ if (!RELE.id){ try{ RELE.id = String(Trystero.mqtt.selfId || ''); }catch(e){} if (!RELE.id) RELE.id = 'r' + Math.random().toString(36).slice(2, 12); } return RELE.id; }
function releTema(){ return 'fernando-bros/salo3d/v' + VERSION_RED + '/sala-' + RELE.sala; }
function releAbrir(codigo){
  releCerrar(); RELE.sala = codigo;
  const M = typeof Trystero !== 'undefined' && Trystero.MQTT; if (!M || !M.connect) return 0;
  const urls = RELES.rele || RELE_BROKERS; let abiertos = 0;
  for (const url of urls){
    try{
      const c = M.connect(url, {keepalive: 20, reconnectPeriod: 5000, connectTimeout: 12000, clean: true, clientId: 'salo3d_' + releId().slice(0, 10) + '_' + Math.random().toString(36).slice(2, 6)});
      const tema = releTema();
      c.on('connect', ()=>{ try{ c.subscribe(tema + '/+', {qos: 0}); }catch(e){} });
      c.on('message', (t, carga)=>{
        if (RELE.sala !== codigo) return;
        const de = String(t).split('/').pop(); if (!de || de === releId() || de.length > 64) return;
        let sobre; try{ sobre = JSON.parse(carga.toString()); }catch(e){ return; }
        if (!sobre || typeof sobre !== 'object') return;
        if (sobre.a && sobre.a !== releId()) return;                       /* iba para otro */
        releLlega(de, sobre);
      });
      c.on('error', ()=>{});
      RELE.clientes.push(c); abiertos++;
    }catch(e){}
  }
  return abiertos;
}
function releCerrar(){ for (const c of RELE.clientes){ try{ c.end(true); }catch(e){} } RELE.clientes = []; RELE.vistos.clear(); RELE.avisados.clear(); RELE.sala = ''; }
function releAbiertos(){ let n = 0; for (const c of RELE.clientes) if (c.connected) n++; return {abiertos: n, total: RELE.clientes.length}; }
/* se publica por todos los brokers conectados (cada quien está suscrito a todos); el que recibe descarta los repetidos por el número de secuencia */
function relePublicar(a, m){
  if (!RELE.sala) return;
  if (m && m.t === 'e'){ RELE.nE++; if (RELE.nE % 3) return; }                /* el estado va a 5 por segundo por el relé, no a 15 */
  const carga = JSON.stringify({a: a || '', s: ++RELE.seq, m}), tema = releTema() + '/' + releId();
  for (const c of RELE.clientes){ if (!c.connected) continue; try{ c.publish(tema, carga, {qos: 0}); }catch(e){} }
}
function releLlega(de, sobre){
  let v = RELE.vistos.get(de); if (!v){ v = {t: 0, seqs: []}; RELE.vistos.set(de, v); }
  v.t = Date.now();
  if (Number.isFinite(sobre.s)){ if (v.seqs.includes(sobre.s)) return; v.seqs.push(sobre.s); if (v.seqs.length > 64) v.seqs.shift(); }
  const set = I.pares.get(de);
  if (!set || !set.size) llegaPar('rele', de); else if (!set.has('rele')) set.add('rele');
  const m = sobre.m; if (!m || typeof m !== 'object' || m.t === 'aqui') return;
  if (medioDe(de) !== 'rele') return;                                      /* ya hay enlace directo: lo del relé es repetido */
  recibir(de, m);
}
function releVigilar(){
  if (!RELE.sala) return;
  const ahora = Date.now();
  if (ahora - RELE.ultimoAqui > 1500){ RELE.ultimoAqui = ahora; relePublicar('', {t: 'aqui'}); }
  for (const [de, v] of RELE.vistos){
    if (ahora - v.t > 7000){ RELE.vistos.delete(de); seVaPar('rele', de); continue; }
    const set = I.pares.get(de);
    if (set && set.size === 1 && set.has('rele') && !RELE.avisados.has(de) && ahora - I.t0 > 40000){ RELE.avisados.add(de); const r = RED.remotos.get(de); if (r) decir('📡 Con ' + r.nombre + ' vas por el relé: se juega igual, solo que un poquito más lento'); }
  }
}
function reles(medio){ try{ const s = Trystero[medio].getRelaySockets(); const t = Object.values(s); return {abiertos: t.filter(w=>w && w.readyState === 1).length, total: t.length}; }catch(e){ return {abiertos: 0, total: 0}; } }
function relesAbiertos(){ let n = 0; for (const m of MEDIOS) if (I.rooms[m]) n += reles(m).abiertos; return n + releAbiertos().abiertos; }
/* lo que se ve en pantalla para saber por dónde va la conexión */
function diagnostico(){
  const partes = MEDIOS.filter(m=>I.rooms[m]).map(m=>{ const r = reles(m); return (m === 'nostr' ? '🐦 ' : '📡 ') + r.abiertos + '/' + r.total; });
  if (RELE.sala){ const r = releAbiertos(); partes.push('🛰 ' + r.abiertos + '/' + r.total); }
  if (I.vistos) partes.push('amigos vistos: ' + I.vistos);
  if (I.fallos) partes.push('enlaces fallidos: ' + I.fallos);
  return partes.length ? 'relés ' + partes.join(' · ') : '';
}
/* por cuál camino se le habla a un amigo: el directo si lo hay; si no, el relé */
function medioDe(id){ const m = I.pares.get(id); if (!m || !m.size) return null; for (const md of m) if (md !== 'rele') return md; return 'rele'; }
function cerrarSala(){
  const rooms = I.rooms; I.rooms = {}; I.acciones = {};
  for (const m in rooms){ try{ rooms[m].leave(); }catch(e){} }
  releCerrar();
  I.pares.clear(); I.llenos.clear(); I.anfitrionId = ''; I.fallos = 0; I.vistos = 0;
  for (const id of [...RED.remotos.keys()]) quitarRemoto(id);
}
function limpiar(){ cerrarSala(); RED.anfitrion = false; }
function abrirSala(codigo){
  I.t0 = Date.now(); let abiertos = 0;
  for (const medio of MEDIOS){
    try{
      const cfg = Object.assign({}, CONFIG, {relayConfig: Object.assign({}, CONFIG.relayConfig, RELES[medio] ? {urls: RELES[medio]} : {})});
      const room = Trystero[medio].joinRoom(cfg, 'sala-' + codigo + '-v' + VERSION_RED + '-' + medio, {handshakeTimeoutMs: 25000, onJoinError: ()=>{ if (I.rooms[medio] === room) I.fallos++; }});   /* 25 s de saludo: un teléfono lento con relevo TURN tarda */
      I.rooms[medio] = room;
      const accion = room.makeAction('m'); I.acciones[medio] = accion;
      accion.onMessage = (m, ctx)=>{ if (I.rooms[medio] !== room || !ctx) return; recibir(ctx.peerId, m); };
      room.onPeerJoin = id=>{ if (I.rooms[medio] === room) llegaPar(medio, id); };
      room.onPeerLeave = id=>{ if (I.rooms[medio] === room) seVaPar(medio, id); };
      abiertos++;
    }catch(e){ console.warn('sala por ' + medio + ': ' + (e && e.message)); }
  }
  try{ if (releAbrir(codigo)){ abiertos++; I.acciones.rele = {send: (m, o)=>{ relePublicar(o && typeof o.target === 'string' ? o.target : '', m); return Promise.resolve(); }}; } }catch(e){ console.warn('relé: ' + (e && e.message)); }
  if (!abiertos) throw new Error('ningún camino disponible');
}
function llegaPar(medio, id){
  let set = I.pares.get(id); const primero = !set || !set.size;
  if (!set){ set = new Set(); I.pares.set(id, set); }
  set.add(medio);
  if (!primero) return;   /* ya lo teníamos por otro camino */
  I.vistos++;
  if (RED.estado === 'creando'){ RED.estado = 'sala'; RED.aviso = ''; }
  if (RED.estado === 'uniendo'){ RED.estado = 'conectado'; RED.aviso = ''; decir('👥 ¡Entraste a la sala ' + RED.sala + '!'); }
  else if (RED.estado === 'sala' && !RED.anfitrion) RED.estado = 'conectado';
  saludar(id);
}
function seVaPar(medio, id){
  const set = I.pares.get(id); if (!set) return;
  set.delete(medio);
  if (set.size) return;   /* sigue por el otro camino */
  I.pares.delete(id); I.llenos.delete(id);
  quitarRemoto(id);
  if (id === I.anfitrionId) I.anfitrionId = '';
  if (RED.estado === 'conectado' && !I.pares.size){ RED.estado = 'sala'; decir('Te quedaste solo en la sala ' + RED.sala + '; si vuelven, se conectan solos 🔄'); }
}
function saludar(id){
  const s = llamar(RED.saludo) || {};
  const pj = PJS_OK.includes(s.pj) ? s.pj : 'salomon';
  enviarA(id, {t: 'hola', v: VERSION_RED, anf: RED.anfitrion, pj, n: sanearNombre(s.n), ch: Array.isArray(s.chispas) ? s.chispas.slice(0, 300) : [], ba: Array.isArray(s.barajitas) ? s.barajitas.slice(0, 300) : []});
}
/* a cada amigo se le manda una sola vez, por el camino en que mejor se lo ve */
function enviar(m){
  if (!I.pares.size) return;
  const porMedio = {};
  for (const id of I.pares.keys()){ if (I.llenos.has(id)) continue; const md = medioDe(id); if (md) (porMedio[md] = porMedio[md] || []).push(id); }
  for (const md in porMedio){ const ac = I.acciones[md]; if (ac) try{ ac.send(m, {target: porMedio[md]}).catch(()=>{}); }catch(e){} }
}
function enviarA(id, m){ const md = medioDe(id), ac = md && I.acciones[md]; if (!ac) return; try{ ac.send(m, {target: id}).catch(()=>{}); }catch(e){} }

/* ---- los amigos que se ven: uno por cada aparato ---- */
function crearRemoto(id, e){
  const r = {id, pj: e.pj, nombre: e.nombre, obj: e, act: {x: e.x, y: e.y, z: e.z, ang: e.ang}, mov: e.mov, t: Date.now(), listo: false, saludo: null};
  RED.remotos.set(id, r);
  llamar(RED.on.llega, r);
  return r;
}
function quitarRemoto(id){
  const r = RED.remotos.get(id); if (!r) return;
  RED.remotos.delete(id);
  llamar(RED.on.seVa, r);
}
/* ¿cabe uno más? el anfitrión le avisa al quinto que la sala está llena; los demás solo no lo cuentan */
function cabe(id){
  if (RED.remotos.has(id)) return true;
  if (RED.remotos.size < MAX_JUGADORES - 1) return true;
  if (RED.anfitrion && !I.llenos.has(id)){ I.llenos.add(id); enviarA(id, {t: 'llena', max: MAX_JUGADORES}); }
  return false;
}
function recibir(id, m){
  if (!m || typeof m !== 'object' || typeof m.t !== 'string') return;
  if (m.t === 'llena'){
    if (!RED.anfitrion && (!I.anfitrionId || id === I.anfitrionId)){ const sala = RED.sala; limpiar(); RED.estado = 'error'; RED.aviso = ''; RED.error = 'La sala ' + sala + ' está llena: ya hay ' + MAX_JUGADORES + ' jugadores. Pídele a alguien que cree otra sala.'; }
    return;
  }
  if (m.t === 'chau'){ quitarRemoto(id); return; }
  if (m.t === 'hola'){
    const s = sanearSaludo(m);
    if (s.anf) I.anfitrionId = id;
    if (!cabe(id)) return;
    let r = RED.remotos.get(id);
    if (!r){
      /* todavía no se sabe dónde está: el nivel -1 dice «sin posición» hasta que llegue su primer estado */
      const nombre = s.n || (typeof SALO !== 'undefined' && SALO.PJS && SALO.PJS[s.pj] ? SALO.PJS[s.pj].nombre : s.pj);
      r = crearRemoto(id, {pj: s.pj, nombre, nv: -1, x: 0, y: 0, z: 0, ang: 0, mov: 0, suelo: true, ataque: '', vidas: 3, puesto: {}});
    } else if (s.n){ r.nombre = s.n; r.pj = s.pj; }
    r.saludo = s; r.t = Date.now();
    /* las chispas y barajitas se comparten: lo que ya ganó cualquiera es de todos */
    llamar(RED.alSaludo, r, s);
    return;
  }
  if (m.t === 'e'){
    if (typeof SALO === 'undefined' || !SALO.desempaquetar) return;
    const e = SALO.desempaquetar(m); if (!e) return;
    if (!cabe(id)) return;
    let r = RED.remotos.get(id);
    if (!r) r = crearRemoto(id, e);
    r.obj = e; r.pj = e.pj; r.nombre = e.nombre; r.mov = e.mov; r.t = Date.now();
    return;
  }
  if (m.t === 'ev'){
    const r = RED.remotos.get(id); if (!r) return;
    const d = sanearEvento(m); if (!d) return;
    r.t = Date.now();
    llamar(RED.on.evento, r, d);
  }
}

/* el vigilante de la conexión corre cada medio segundo por reloj, aparte de los cuadros: en un
   teléfono lento (o con la pestaña de fondo) los cuadros van despacio y esto no puede esperar */
function vigilar(){
  if (!abierta()) return;
  try{ releVigilar(); }catch(e){}
  const dt = Date.now() - I.t0;
  if (RED.estado === 'creando' || RED.estado === 'uniendo'){
    const abiertos = relesAbiertos();
    if (RED.estado === 'creando' && abiertos > 0){ RED.estado = 'sala'; RED.aviso = ''; return; }
    if (RED.estado === 'uniendo' && abiertos > 0 && !RED.aviso) RED.aviso = 'Buscando a tus amigos en la sala ' + RED.sala + '… puede tardar unos segundos';
    if (abiertos === 0 && dt > 15000){ RED.estado = 'error'; RED.aviso = ''; RED.error = 'No pude conectar con ningún relé de salas. Revisa el internet (si estás por WiFi prueba con datos, o al revés) y vuelve a intentar.'; cerrarSala(); return; }
    /* si ya vio amigos (aunque el enlace haya fallado) se le da hasta minuto y medio: los relés vuelven a presentarlos solos */
    if (RED.estado === 'uniendo' && dt > (I.vistos || I.fallos ? 90000 : 45000)){
      RED.estado = 'error'; RED.aviso = '';
      RED.error = I.fallos ? 'Vi a tus amigos en la sala ' + RED.sala + ' pero no se abrió el enlace entre los aparatos (' + I.fallos + ' intentos). Recarguen la página los dos (para tener la versión nueva) y vuelvan a intentar; si sigue, prueben con los dos por WiFi.'
        : 'No encontré a nadie en la sala ' + RED.sala + ' (' + diagnostico() + '). Revisa el código y que quien la creó siga con el juego abierto y con la versión nueva (que recargue la página).';
      cerrarSala();
    }
  }
}
setInterval(()=>{ try{ vigilar(); }catch(e){} }, 500);

/* ---------------- lo que usa la vista ---------------- */
function crear(){
  if (!hay()){ RED.estado = 'error'; RED.error = 'No se cargó la parte de red. Revisa la conexión y recarga la página.'; return; }
  limpiar(); RED.estado = 'creando'; RED.sala = codigoSala(); RED.anfitrion = true; RED.error = ''; RED.aviso = ''; RED.pendiente = '';
  try{ abrirSala(RED.sala); }catch(e){ RED.estado = 'error'; RED.error = 'Algo falló al abrir la sala (' + (e && e.message || '?') + '). Vuelve a intentar.'; }
}
function unirse(codigo){
  codigo = normalizarCodigo(codigo);
  if (codigo.length !== 4){ RED.error = 'El código tiene 4 letras o números'; return; }
  if (!hay()){ RED.estado = 'error'; RED.error = 'No se cargó la parte de red. Revisa la conexión y recarga la página.'; return; }
  limpiar(); RED.estado = 'uniendo'; RED.sala = codigo; RED.anfitrion = false; RED.error = ''; RED.aviso = ''; RED.pendiente = '';
  try{ abrirSala(codigo); }catch(e){ RED.estado = 'error'; RED.error = 'Algo falló al entrar a la sala (' + (e && e.message || '?') + '). Vuelve a intentar.'; }
}
function salir(){ if (I.pares.size) enviar({t: 'chau'}); limpiar(); RED.estado = 'off'; RED.sala = ''; RED.aviso = ''; RED.error = ''; }
const activa = ()=>abierta() && (RED.estado === 'sala' || RED.estado === 'conectado');
const enlace = ()=>location.origin + location.pathname + '?sala=' + RED.sala;
/* la vista lo llama unas 15 veces por segundo con SALO.empaquetar(G, nombre) */
function enviarEstado(p){ if (!activa() || !I.pares.size || !p || typeof p !== 'object') return; enviar(p); }
/* eventos sueltos: {tipo:'premio', que, id} o {tipo:'fx', fx, x, y, z}; se revisan antes de mandarlos */
function enviarEvento(d){ if (!activa() || !I.pares.size) return; const e = sanearEvento(d); if (e) enviar(Object.assign({t: 'ev'}, e)); }
/* cada cuadro: los muñecos de los amigos se deslizan hacia su última posición conocida (igual de suave a 30 o 60 cuadros) */
function paso(){
  const ahora = Date.now(), dt = I.ultPaso ? Math.min(0.25, Math.max(0, (ahora - I.ultPaso)/1000)) : 1/60;
  I.ultPaso = ahora;
  const k = 1 - Math.pow(1 - 0.22, dt*60);
  for (const [id, r] of [...RED.remotos]){
    if (ahora - r.t > OLVIDO_MS){ quitarRemoto(id); continue; }
    const o = r.obj, a = r.act;
    if (o.nv < 0) continue;
    /* el primer estado, un cambio de nivel o un salto enorme (reapareció): se pone ahí de una vez */
    if (!r.listo || r.nv !== o.nv || Math.hypot(o.x - a.x, o.y - a.y, o.z - a.z) > 15){ a.x = o.x; a.y = o.y; a.z = o.z; a.ang = o.ang; r.listo = true; r.nv = o.nv; continue; }
    a.x += (o.x - a.x)*k; a.y += (o.y - a.y)*k; a.z += (o.z - a.z)*k; a.ang = envolver(a.ang + envolver(o.ang - a.ang)*k);
    r.mov = o.mov;
  }
}

const RED = {
  estado: 'off', sala: '', error: '', aviso: '', pendiente: '', anfitrion: false,
  hay, activa, crear, unirse, salir, enlace, enviarEstado, enviarEvento, paso, diagnostico,
  remotos: new Map(),
  on: {llega: null, seVa: null, evento: null, aviso: null},
  saludo: ()=>({pj: 'salomon', n: '', chispas: [], barajitas: []}),
  alSaludo: ()=>{},
  RELES, CONFIG, MAX_JUGADORES, normalizarCodigo, codigoSala,
  get amigos(){ return I.pares.size; },              /* cuántos aparatos se ven ahora (para las pruebas) */
  medioDe,                                           /* por qué camino va cada amigo: 'nostr', 'mqtt' o 'rele' */
  get fallos(){ return I.fallos; },
  _recibir: recibir,                                 /* solo para las pruebas: simular lo que llega */
};
try{ const c = normalizarCodigo(new URL(location.href).searchParams.get('sala')); if (c.length === 4) RED.pendiente = c; }catch(e){}
raiz.SALO_RED = RED;
})(typeof window !== 'undefined' ? window : globalThis);
