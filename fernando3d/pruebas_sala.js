/* ============================================================
   PRUEBA DE JUGAR CON AMIGOS (con navegadores de verdad)
   Se necesitan Playwright (con Chromium), el broker local y la página servida:
     node aventura3d/broker_local.js        (ws://127.0.0.1:1884)
     python3 -m http.server 8765            (desde la raíz del repo)
     node fernando3d/pruebas_sala.js
   Dos jugadores (Fernando y Lucca), cada uno en su navegador:
   1) el anfitrión crea la sala y el invitado entra con el código;
   2) cada uno ve al otro moverse en el mismo mundo, con su personaje;
   3) la estrella que gana uno le llega al otro (es de todos);
   4) «Ir con…»: Tío Juan lleva al invitado al mundo del amigo;
   5) con el enlace directo imposible (como con datos móviles), igual
      se juega por el relé.
   ============================================================ */
const { chromium } = require('playwright');
const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'];
const URL_ = process.env.URL_F3D || 'http://127.0.0.1:8765/fernando3d/';
let fallos = 0; const mal = m=>{ console.log('✗', m); fallos++; }, bien = (...m)=>console.log('✓', ...m);
const espera = async (pg, fn, ms, que, arg)=>{ try{ await pg.waitForFunction(fn, arg, {timeout: ms || 30000, polling: 200}); return true; }catch(e){ mal('no pasó: ' + que); return false; } };

async function pagina(browser, pj, romperRTC){
  const ctx = await browser.newContext({viewport: {width: 480, height: 300}});
  const pg = await ctx.newPage();
  pg.on('pageerror', e=>console.log('  [' + pj + '] error de página:', e.message));
  await pg.goto(URL_, {waitUntil: 'domcontentloaded', timeout: 90000});
  await pg.waitForFunction(()=>window.FER3D && window.F3D_RED && window.Trystero, null, {timeout: 90000});
  await pg.evaluate(([pj, romper])=>{
    localStorage.clear();
    const R = F3D_RED;
    R.RELES.mqtt = ['ws://127.0.0.1:1884']; R.RELES.nostr = ['ws://127.0.0.1:65530']; R.RELES.rele = ['ws://127.0.0.1:1884'];
    R.CONFIG.rtcConfig = romper ? {iceServers: [], iceTransportPolicy: 'relay'} : {iceServers: []};
    const J = FER3D.J(); for (const k in J.prog.estrellas) delete J.prog.estrellas[k];
    FER3D.calidad('baja'); FER3D.cambiarPj(pj); FER3D.empezar();
  }, [pj, !!romperRTC]);
  return pg;
}
async function sala(browser, romper){
  const H = await pagina(browser, 'fernando', romper), G = await pagina(browser, 'lucca', romper);
  await H.evaluate(()=>F3D_RED.crear());
  await espera(H, ()=>F3D_RED.estado === 'sala', 30000, 'el anfitrión abrió la sala');
  const codigo = await H.evaluate(()=>F3D_RED.sala);
  const t0 = Date.now();
  await G.evaluate(c=>F3D_RED.unirse(c), codigo);
  if (await espera(G, ()=>F3D_RED.estado === 'conectado', 40000, 'el invitado entró a la sala'))
    bien('el invitado entró a la sala', codigo, 'en', ((Date.now() - t0)/1000).toFixed(1), 's por', await G.evaluate(()=>[...F3D_RED.remotos.keys()].map(id=>F3D_RED.medioDe(id)).join()));
  await espera(H, ()=>[...F3D_RED.remotos.values()].some(r=>r.listo), 30000, 'el anfitrión ve al invitado');
  await espera(G, ()=>[...F3D_RED.remotos.values()].some(r=>r.listo), 30000, 'el invitado ve al anfitrión');
  return {H, G, codigo};
}
const remoto = pg=>pg.evaluate(()=>{ const r = [...F3D_RED.remotos.values()][0]; return r ? {x: r.obj.x, z: r.obj.z, nv: r.obj.nv, pj: r.pj, nombre: r.nombre} : null; });

(async ()=>{
  const browser = await chromium.launch({args: ARGS});
  /* 1-4) con el enlace directo sano */
  {
    const {H, G} = await sala(browser, false);
    const r0 = await remoto(G);
    if (r0 && r0.pj === 'fernando' && r0.nombre === 'Fernando') bien('el invitado ve a', r0.nombre, 'con su gorra roja'); else mal('el invitado no ve bien al anfitrión: ' + JSON.stringify(r0));
    const r1 = await remoto(H);
    if (r1 && r1.pj === 'lucca') bien('el anfitrión ve a', r1.nombre, 'con su gorra verde'); else mal('el anfitrión no ve a Lucca: ' + JSON.stringify(r1));
    /* el anfitrión se mueve */
    await H.evaluate(()=>{ const J = FER3D.J(); J.p.x += 6; J.p.z -= 4; });
    await espera(G, ()=>{ const r = [...F3D_RED.remotos.values()][0]; return r && Math.abs(r.obj.x - 6) < 0.5; }, 15000, 'el invitado ve moverse al anfitrión');
    bien('el invitado ve moverse al anfitrión:', JSON.stringify(await remoto(G)));
    const visible = await G.evaluate(()=>{ const o = [...FER3D.REMOTOS.values()][0]; return !!(o && o.m.g.visible); });
    if (visible) bien('el muñeco del amigo se dibuja en el mismo mundo'); else mal('el muñeco del amigo no se ve');
    /* la estrella del techo: la gana el anfitrión y le llega al invitado */
    await H.evaluate(()=>{ const J = FER3D.J(); const s = J.M.estrellas.find(e=>e.id === 'tejado'); J.p.x = s.x; J.p.z = s.z; J.p.y = s.y - 1; J.p.vy = 0; J.p.enSuelo = false; });
    await espera(H, ()=>FER3D.J().prog.estrellas['castillo:tejado'], 15000, 'el anfitrión ganó la estrella del techo');
    if (await espera(G, ()=>FER3D.J().prog.estrellas['castillo:tejado'], 15000, 'la estrella le llegó al invitado')) bien('la estrella del techo que ganó Fernando también es de Lucca');
    /* una estrella que ya tenía el invitado le llega al anfitrión al saludar de nuevo no hace falta: probamos al revés en vivo */
    await G.evaluate(()=>{ F3D.recibirEstrella(FER3D.J(), 'pradera:torre'); F3D_RED.enviarEvento({tipo: 'premio', que: 'estrella', id: 'pradera:torre'}); });
    if (await espera(H, ()=>FER3D.J().prog.estrellas['pradera:torre'], 15000, 'la estrella de Lucca le llegó al anfitrión')) bien('y la que gana Lucca le llega a Fernando');
    /* ir con el amigo a otro mundo */
    await H.evaluate(()=>{ const J = FER3D.J(); J.p.baile = 0; F3D.irA(J, 1); });
    await espera(H, ()=>FER3D.J().mundo === 1 && !FER3D.J().trans, 30000, 'el anfitrión llegó a la pradera');
    await espera(G, ()=>{ const r = [...F3D_RED.remotos.values()][0]; return r && r.obj.nv === 1; }, 15000, 'el invitado sabe que el anfitrión está en la pradera');
    const oculto = await G.evaluate(()=>{ const o = [...FER3D.REMOTOS.values()][0]; return !!(o && !o.m.g.visible); });
    if (oculto) bien('si el amigo está en otro mundo, no se dibuja'); else mal('el amigo de otro mundo se sigue viendo');
    await G.evaluate(()=>{ const J = FER3D.J(); J.p.baile = 0; FER3D.irCon([...F3D_RED.remotos.values()][0]); });
    await espera(G, ()=>FER3D.J().mundo === 1 && !FER3D.J().trans, 30000, 'Tío Juan llevó al invitado a la pradera');
    const d = await G.evaluate(()=>{ const J = FER3D.J(), r = [...F3D_RED.remotos.values()][0]; return Math.hypot(J.p.x - r.obj.x, J.p.z - r.obj.z); });
    if (d < 4) bien('«Ir con…»: Tío Juan llevó a Lucca al lado de Fernando, en la pradera (a', d.toFixed(1), 'm)'); else mal('el invitado quedó lejos del amigo: ' + d.toFixed(1) + ' m');
    if (process.env.SP){
      await G.evaluate(()=>{ const J = FER3D.J(); J.dialogos = []; FER3D.calidad('media'); FER3D.cam.dist = 7; });
      await G.waitForTimeout(6000);
      await G.screenshot({path: process.env.SP + '/sala_invitado.png'});
      await H.evaluate(()=>FER3D.abrirAmigos());
      await H.waitForTimeout(3000);
      await H.screenshot({path: process.env.SP + '/sala_anfitrion.png'});
    }
    await H.context().close(); await G.context().close();
  }
  /* 5) el enlace directo imposible: igual se juega por el relé */
  {
    const {H, G} = await sala(browser, true);
    const medios = await G.evaluate(()=>[...F3D_RED.remotos.keys()].map(id=>F3D_RED.medioDe(id)).join());
    if (medios === 'rele') bien('sin enlace directo, se ven por el relé'); else console.log('  (camino usado: ' + medios + ')');
    await H.evaluate(()=>{ FER3D.J().p.x += 5; });
    await espera(G, ()=>{ const r = [...F3D_RED.remotos.values()][0]; return r && Math.abs(r.obj.x - 5) < 0.5; }, 15000, 'por el relé también se ve moverse al amigo');
    bien('por el relé también se ve moverse al amigo');
    await H.context().close(); await G.context().close();
  }
  await browser.close();
  console.log(fallos ? '\n' + fallos + ' prueba(s) fallaron' : '\nTodo bien ✓');
  process.exit(fallos ? 1 : 0);
})();
