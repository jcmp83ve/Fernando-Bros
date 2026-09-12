/* Un broker MQTT sobre WebSocket en la misma máquina, solo para las pruebas
   de la sala sin internet (pruebas_voz.js y las capturas). Necesita los
   paquetes «aedes» y «ws»:  npm i aedes ws   y luego  node aventura3d/broker_local.js */
const { Aedes } = require('aedes'), http = require('http'), ws = require('ws');
(async ()=>{
  const aedes = Aedes.createBroker ? await Aedes.createBroker() : new Aedes();
  const srv = http.createServer(), wss = new ws.Server({server: srv});
  wss.on('connection', sock=>{ aedes.handle(ws.createWebSocketStream(sock)); });
  srv.listen(1884, '127.0.0.1', ()=>console.log('broker MQTT listo en ws://127.0.0.1:1884'));
})();
