/* Prueba del walkie-talkie de punta a punta, con navegadores de verdad.
   Se necesitan Playwright (con Chromium), un servidor PeerJS local y la página servida:
     npx peerjs --port 9000 --path / --host 127.0.0.1      (paquete «peer»)
     python3 -m http.server 8765                           (desde la raíz del repo)
     node aventura3d/pruebas_voz.js
   Dos navegadores con micrófonos falsos: el anfitrión crea la sala, el invitado entra y
   mantiene V; el anfitrión tiene que oír energía de audio en el stream remoto y silencio al
   soltar. Después al revés, luego un toque reintenta un audio bloqueado, y por último un
   tercero que nunca pidió micrófono también oye. */
const { chromium } = require('playwright');
const ARGS = ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader',
  '--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--autoplay-policy=no-user-gesture-required'];
const URL_ = 'http://127.0.0.1:8765/aventura3d/?mapa=1';
async function pagina(browser, nombre){
  const ctx = await browser.newContext({viewport:{width:960, height:540}, permissions:['microphone']});
  const pg = await ctx.newPage();
  pg.on('pageerror', e=>console.log('  [' + nombre + '] error de página:', e.message));
  pg.on('console', m=>{ if (m.type()==='error') console.log('  ['+nombre+'] consola:', m.text().slice(0,160)); });
  await pg.goto(URL_, {waitUntil:'domcontentloaded', timeout:90000});
  await pg.waitForFunction(()=>window.AV && window.Peer, null, {timeout:60000});
  await pg.evaluate((n)=>{
    localStorage.removeItem('aventura3d.partida'); localStorage.setItem('aventura3d.nombre', n);
    const c = AV.RED_CONFIG; c.host = '127.0.0.1'; c.port = 9000; c.path = '/'; c.secure = false; c.config = {iceServers:[]};
    AV.empezar();
  }, nombre);
  return pg;
}
/* energía RMS del stream remoto de un amigo durante ~700 ms */
async function energia(pg){
  return pg.evaluate(async ()=>{
    const [id, a] = [...AV.VOZ.audios.entries()][0] || [];
    if (!a) return {id:null, rms:-1};
    const ac = new AudioContext(); await ac.resume();
    const src = ac.createMediaStreamSource(a.st), an = ac.createAnalyser(); an.fftSize = 2048; src.connect(an);
    const buf = new Float32Array(an.fftSize); let max = 0;
    for (let i=0;i<7;i++){ await new Promise(r=>setTimeout(r, 100)); an.getFloatTimeDomainData(buf); let s = 0; for (const v of buf) s += v*v; max = Math.max(max, Math.sqrt(s/buf.length)); }
    ac.close();
    const t = a.st.getAudioTracks()[0];
    return {id, rms:+max.toFixed(4), paused:a.el.paused, enDOM:!!a.el.parentNode, muted:a.el.muted, ready:a.el.readyState, pista:t && t.readyState, pistaMuda:t && t.muted, pendientes:AV.VOZ.pendientes.size};
  });
}
const espera = (pg, fn, ms)=>pg.waitForFunction(fn, null, {timeout:ms||20000});
(async ()=>{
  const browser = await chromium.launch({args:ARGS});
  const H = await pagina(browser, 'Anfitrion'), G = await pagina(browser, 'Invitado');
  await H.evaluate(()=>AV.redCrear());
  await espera(H, ()=>AV.RED.estado==='sala');
  const sala = await H.evaluate(()=>AV.RED.sala); console.log('sala', sala);
  await G.evaluate((s)=>AV.redUnirse(s), sala);
  await espera(G, ()=>AV.RED.estado==='conectado'); await espera(H, ()=>AV.RED.remotos.size===1);
  console.log('✓ los dos en la sala');
  /* G mantiene V */
  await G.keyboard.down('v');
  await espera(G, ()=>AV.VOZ.stream && AV.VOZ.hablando, 15000);
  await espera(H, ()=>AV.VOZ.audios.size===1, 15000);
  await H.waitForTimeout(800);
  let e = await energia(H); console.log('H oye a G mientras G habla:', JSON.stringify(e));
  const hablaVisto = await H.evaluate(()=>[...AV.RED.remotos.values()][0].hablando);
  if (e.rms < 0.01 || e.paused || !e.enDOM || !hablaVisto) throw new Error('H no oye a G (rms '+e.rms+', paused '+e.paused+', enDOM '+e.enDOM+', hablando '+hablaVisto+')');
  console.log('✓ el anfitrión oye al invitado (rms '+e.rms+')');
  await G.keyboard.up('v'); await G.waitForTimeout(600);
  e = await energia(H); console.log('H tras soltar V:', JSON.stringify(e));
  if (e.rms > 0.002) throw new Error('sigue sonando tras soltar V');
  console.log('✓ al soltar, silencio (push-to-talk)');
  /* ahora habla H: llama a G, y G contesta con su micro */
  await H.keyboard.down('v');
  await espera(H, ()=>AV.VOZ.stream && AV.VOZ.hablando, 15000);
  await espera(G, ()=>AV.VOZ.audios.size===1, 15000);
  await G.waitForTimeout(800);
  e = await energia(G); console.log('G oye a H:', JSON.stringify(e));
  if (e.rms < 0.01 || e.paused) throw new Error('G no oye a H');
  console.log('✓ el invitado oye al anfitrión (rms '+e.rms+')');
  await H.keyboard.up('v');
  /* el desbloqueo: si el play() fue bloqueado, el próximo toque lo reintenta */
  const des = await G.evaluate(()=>{
    const el = document.createElement('audio'); let n = 0; el.play = ()=>{ n++; return Promise.resolve(); }; el.srcObject = [...AV.VOZ.audios.values()][0].st;
    AV.VOZ.pendientes.add(el); AV.tecla(' '); document.dispatchEvent(new PointerEvent('pointerdown', {clientX:5, clientY:5, bubbles:true}));
    return {intentos:n, pendientes:AV.VOZ.pendientes.size};
  });
  console.log('desbloqueo por toque:', JSON.stringify(des));
  if (des.intentos < 1 || des.pendientes !== 0) throw new Error('el toque no reintentó el play()');
  console.log('✓ un toque reintenta el audio bloqueado');
  /* un tercero: otro invitado entra y oye a H sin pedir micro nunca */
  const K = await pagina(browser, 'Tercero');
  await K.evaluate((s)=>AV.redUnirse(s), sala);
  await espera(K, ()=>AV.RED.estado==='conectado'); await espera(H, ()=>AV.RED.remotos.size===2);
  await H.keyboard.down('v'); await espera(H, ()=>AV.VOZ.hablando, 15000);
  await espera(K, ()=>AV.VOZ.audios.size>=1, 15000); await K.waitForTimeout(800);
  e = await energia(K); console.log('Tercero oye a H:', JSON.stringify(e));
  if (e.rms < 0.01) throw new Error('el tercero no oye a H');
  console.log('✓ un tercero que nunca pidió micrófono también oye');
  await H.keyboard.up('v');
  await browser.close();
  console.log('\n✓ Voz de punta a punta sin fallos');
})().catch(e=>{ console.log('✗', e.message); process.exit(1); });
