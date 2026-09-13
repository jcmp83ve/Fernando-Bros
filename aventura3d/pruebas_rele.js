/* Prueba del camino de reserva (el relé por MQTT), con navegadores de verdad.
   Se necesitan Playwright (con Chromium), el broker local y la página servida:
     node aventura3d/broker_local.js        (ws://127.0.0.1:1884)
     python3 -m http.server 8765            (desde la raíz del repo)
     node aventura3d/pruebas_rele.js
   1) Con el enlace directo (WebRTC) imposible a propósito (solo se permiten candidatos de relevo TURN y no hay
      ninguno, como un teléfono con datos detrás de una operadora que no deja pasar), el anfitrión y el invitado
      se ven igual por el relé: el invitado entra a la sala, los muñecos se mueven y los eventos llegan; el enlace
      directo falla (fallos > 0) sin que se caiga la sala.
   2) Con el enlace directo sano, el juego lo prefiere al relé en cuanto abre. */
const { chromium } = require('playwright');
/* sin frenar los temporizadores de las pestañas de fondo (ver pruebas_voz.js) */
const ARGS = ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows'];
const URL_ = 'http://127.0.0.1:8765/aventura3d/?mapa=1';
let fallos = 0; const mal = m=>{ console.log('✗', m); fallos++; }, bien = (...m)=>console.log('✓', ...m);
async function pagina(browser, nombre, romperRTC){
  const ctx = await browser.newContext({viewport:{width:480, height:270}});
  const pg = await ctx.newPage();
  pg.on('pageerror', e=>console.log('  [' + nombre + '] error de página:', e.message));
  await pg.goto(URL_, {waitUntil:'domcontentloaded', timeout:90000});
  await pg.waitForFunction(()=>window.AV && window.Trystero, null, {timeout:60000});
  await pg.evaluate(([n, romper])=>{
    localStorage.removeItem('aventura3d.partida'); localStorage.setItem('aventura3d.nombre', n);
    AV.RED_RELES.mqtt = ['ws://127.0.0.1:1884']; AV.RED_RELES.nostr = ['ws://127.0.0.1:65530']; AV.RED_RELES.rele = ['ws://127.0.0.1:1884'];
    AV.RED_CONFIG.rtcConfig = romper ? {iceServers:[], iceTransportPolicy:'relay'} : {iceServers:[]};
    AV.empezar();
  }, [nombre, !!romperRTC]);
  return pg;
}
const espera = async (pg, fn, ms, que)=>{ try{ await pg.waitForFunction(fn, null, {timeout:ms||20000}); return true; }catch(e){ mal('no pasó: '+que); return false; } };
const posRemoto = pg=>pg.evaluate(()=>{ const r = [...AV.RED.remotos.values()][0]; return r ? [r.obj.x, r.obj.z, r.nombre] : [0, 0, '?']; });   /* r.obj: lo último que llegó por la red */
(async ()=>{
  const browser = await chromium.launch({args:ARGS});
  /* 1) el enlace directo imposible */
  {
    const t0 = Date.now();
    const H = await pagina(browser, 'Anfitrion', true), G = await pagina(browser, 'Invitado', true);
    await H.evaluate(()=>AV.redCrear());
    await espera(H, ()=>AV.RED.estado==='sala', 20000, 'el anfitrión abrió la sala');
    await H.evaluate(()=>{ AV.estado = 'juego'; });
    const sala = await H.evaluate(()=>AV.RED.sala);
    const t1 = Date.now(); await G.evaluate((s)=>AV.redUnirse(s), sala);
    if (await espera(G, ()=>AV.RED.estado==='conectado', 20000, 'el invitado entró por el relé')) bien('el invitado entró a la sala', sala, 'por el relé en', ((Date.now()-t1)/1000).toFixed(1), 's');
    await espera(H, ()=>AV.RED.remotos.size===1, 20000, 'el anfitrión ve al invitado'); await espera(G, ()=>AV.RED.remotos.size===1, 20000, 'el invitado ve al anfitrión');
    const medios = await G.evaluate(()=>[...AV.RED.pares.values()].map(s=>[...s].join('+')));
    if (medios.join() !== 'rele') mal('el invitado debería tener al anfitrión solo por el relé: '+medios.join()); else bien('camino:', medios.join(), '·', await G.evaluate(()=>AV.RED.acciones.rele ? 'acción del relé lista' : 'sin acción'));
    /* el anfitrión corre y el invitado lo ve moverse */
    const antes = await posRemoto(G);
    await H.evaluate(()=>{ AV.entrada = {jy:1, b:true}; for (let i=0;i<180;i++) AV.paso(); AV.entrada = null; });   /* el bucle de la página no corre en pestañas de fondo: se avanza a mano */
    await G.waitForTimeout(1000);
    const despues = await posRemoto(G), d = Math.hypot(despues[0]-antes[0], despues[1]-antes[1]);
    if (d < 2) mal('el invitado no vio moverse al anfitrión ('+d.toFixed(1)+' m; el anfitrión está en '+(await H.evaluate(()=>AV.P.J.x.toFixed(1)+','+AV.P.J.z.toFixed(1)+' estado '+AV.estado))+')'); else bien('el invitado vio a', despues[2], 'correr', d.toFixed(1), 'm por el relé');
    /* un evento (confeti de una hamburguesa) llega */
    const evAntes = await G.evaluate(()=>AV.particulas);
    await H.evaluate(()=>AV.RED.acciones.rele.send({t:'ev', tipo:'hamburguesa', x:AV.P.J.x, y:AV.P.J.y, z:AV.P.J.z}, {target: [...AV.RED.pares.keys()]}));
    await G.waitForTimeout(700);
    const evDespues = await G.evaluate(()=>AV.particulas);
    if (evDespues <= evAntes) mal('el evento por el relé no llegó al invitado'); else bien('un evento por el relé llegó al invitado (partículas', evAntes, '→', evDespues+')');
    /* el enlace directo falla de verdad (a los 25 s de saludo) y la sala sigue */
    await espera(G, ()=>AV.RED.fallos > 0, 45000, 'el enlace directo debía fallar (imposible a propósito)');
    const sigue = await G.evaluate(()=>AV.RED.estado+' '+AV.RED.remotos.size+' '+AV.RED.fallos);
    if (!sigue.startsWith('conectado 1')) mal('tras el fallo del enlace directo la sala no siguió: '+sigue); else bien('el enlace directo falló ('+sigue.split(' ')[2]+' intentos) y la sala siguió por el relé');
    /* el invitado se va y el anfitrión lo nota */
    await G.evaluate(()=>AV.redSalir());
    await espera(H, ()=>AV.RED.remotos.size===0, 15000, 'el anfitrión notó que el invitado se fue');
    bien('el anfitrión vio irse al invitado · duración', ((Date.now()-t0)/1000).toFixed(0), 's');
    await H.evaluate(()=>AV.redSalir()); await H.context().close(); await G.context().close();
  }
  /* 2) el enlace directo sano: se prefiere al relé */
  {
    const H = await pagina(browser, 'Anfitrion', false), G = await pagina(browser, 'Invitado', false);
    await H.evaluate(()=>AV.redCrear()); await espera(H, ()=>AV.RED.estado==='sala', 20000, 'sala 2');
    const sala = await H.evaluate(()=>AV.RED.sala); await G.evaluate((s)=>AV.redUnirse(s), sala);
    await espera(G, ()=>AV.RED.estado==='conectado', 20000, 'entró (2)');
    if (await espera(G, ()=>[...AV.RED.pares.values()].some(s=>s.has('mqtt')), 40000, 'el enlace directo abrió')){
      const md = await G.evaluate(()=>{ const s = [...AV.RED.pares.values()][0]; return [...s].join('+'); });
      const pref = await G.evaluate(()=>{ const id = [...AV.RED.pares.keys()][0]; return AV.RED.acciones[[...AV.RED.pares.get(id)].find(m=>m!=='rele')] ? 'directo' : 'relé'; });
      bien('con el enlace directo sano el invitado tiene al anfitrión por', md, '· se prefiere el', pref);
      if (md.indexOf('mqtt') < 0) mal('faltó el camino directo');
    }
    await G.evaluate(()=>AV.redSalir()); await H.evaluate(()=>AV.redSalir());
  }
  await browser.close();
  console.log(fallos ? '\n'+fallos+' FALLO(S)' : '\n✓ el relé sin fallos');
  process.exit(fallos ? 1 : 0);
})().catch(e=>{ console.log('✗', e.message); process.exit(1); });
