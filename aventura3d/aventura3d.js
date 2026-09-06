(function(){
'use strict';
/* ============================================================
   FERNANDO Y TÍO JUAN: LA GRAN AVENTURA — mundo abierto en 3D
   Una isla entera para recorrer a pie, en carro, en moto, en
   barco, en avión por el cielo y en submarino por el fondo del
   mar, con toda la familia de Fernando Bros, las hamburguesas
   que dan ganas de hacer popo, los cuatro baños de la isla y el
   nuevo amigo: el Señor Popo.

   El archivo tiene dos mitades:
     · el NÚCLEO (isla, carretera, física de los vehículos,
       hamburguesas, baños, familia y misiones), que no toca la
       pantalla y se prueba con node;
     · la VISTA, que dibuja todo con Three.js y el marcador en 2D.
   ============================================================ */
const EN_NAVEGADOR = typeof window !== 'undefined' && typeof document !== 'undefined';

/* ---------------- Voces (las mismas grabaciones de Fernando Bros) ---------------- */
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
  /* las frases de esta aventura: Fernando y el Señor Popo, con la misma voz de niño */
  '¡Quiero hacer popo!': AUDIO_BASE+'hf_20260904_233610_75469df0-2058-46dc-ac66-10c308254efa.mp3',
  '¡Ahh, qué alivio!': AUDIO_BASE+'hf_20260904_233610_aea4016d-7276-448f-9872-396016fc908d.mp3',
  '¡Uy, me eché un peo!': AUDIO_BASE+'hf_20260904_233610_fe3fbdba-d60d-47b5-89eb-090d7146c14c.mp3',
  '¡Tesoro! ¡Encontré el tesoro!': AUDIO_BASE+'hf_20260904_233610_bfa20432-1aed-46fa-a4c3-13572d4b5b07.mp3',
  '¡Salté la rampa!': AUDIO_BASE+'hf_20260904_233610_cb88f458-b7d4-4f73-b501-0331854d0be3.mp3',
  '¡Hola Fernando! Soy el Señor Popo. ¡Come hamburguesas y ven a mi baño!': AUDIO_BASE+'hf_20260904_233610_a068155f-b5b1-4a1b-b948-4285b70851e8.mp3',
  '¡Pasa, pasa! ¡El baño está libre!': AUDIO_BASE+'hf_20260904_233709_826bb731-f4be-4a00-a2b9-88186e358732.mp3',
  '¡Bravo, Fernando! ¡Qué popo tan grande!': AUDIO_BASE+'hf_20260904_233610_f83490ea-524e-4d27-9258-2bb23eaf49d9.mp3',
  '¡Hiciste popo en todos mis baños! ¡Eres el campeón del popo!': AUDIO_BASE+'hf_20260904_233610_2b076d8a-c436-4b16-91f0-b0b1c3a49fca.mp3',
  '¡Mira, un popo bebé me sigue!': AUDIO_BASE+'hf_20260904_233709_6ef4f4e8-c3d3-4dcd-a1f9-cfb62e319947.mp3',
  '¡Qué rica arepita de agüita de sapo!': AUDIO_BASE+'hf_20260905_202234_1545df83-1e2f-4a61-b0be-c2d1da2a6cc4.mp3',
  '¡Llegamos a Maracaibo!': AUDIO_BASE+'hf_20260905_202155_87520206-045d-4a20-800a-304e83b3381d.mp3',
  '¡Llegué a la luna!': AUDIO_BASE+'hf_20260905_202155_5ecaea00-d580-4cb7-9de5-da1593326bc6.mp3',
  '¡Vamos, dinosaurio!': AUDIO_BASE+'hf_20260905_202154_b65da520-f47e-4fe5-93f6-534755238ff9.mp3',
  '¡Hola! Soy el Señor Popo. ¡Come hamburguesas y ven a mi baño!': AUDIO_BASE+'hf_20260905_212315_e5f05fa4-e608-45ef-9890-5970ca1fb19a.mp3',
  '¡Qué molleja! ¡Se me hizo un nudo en la garganta!': AUDIO_BASE+'hf_20260906_000211_a40ff000-b963-4f36-95be-b4a12f5e797e.mp3',
  '¡Mira para arriba! ¡Es el relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041837_10430c88-cba8-4a30-8af7-a1f73d2459ad.mp3',
  '¿Para qué vamos a traer más chivos a Coro?': AUDIO_BASE+'hf_20260906_041944_c5985a02-6c52-4e1f-930b-235abedbda03.mp3',
  '¡Llegué a Marte!': AUDIO_BASE+'hf_20260906_042143_91a087f1-64a3-407b-b753-fb4e98578b50.mp3',
  '¡Extraterrestres! ¡Hola, amiguitos del espacio!': AUDIO_BASE+'hf_20260906_042246_63549415-875e-4da1-a2c7-0085de21164d.mp3',
  '¡Bravo! ¡Qué popo tan grande!': AUDIO_BASE+'hf_20260905_212315_6ecdfe6d-f9b5-4cc9-80bb-d5ac6a250cb1.mp3',
};
/* Si un mp3 no carga, habla el navegador con la voz sintética y el tono
   de cada personaje. SIN_GRABACION lista las frases que a propósito no
   tienen mp3 (hoy ninguna): la prueba automática avisa si alguna se sale. */
const TONO_TTS = {
  'Eres mi pichunguito': {pitch:0.6, rate:0.95},
  '¡Épale! ¡Aquí viene tío Nacho!': {pitch:0.85, rate:1.15},
  '¡Hola mi amor! ¡Soy tía Yanny!': {pitch:1.45, rate:1.0},
  '¡Brrrp! ¡Qué rica cerveza! ¡Ay, qué pena!': {pitch:0.35, rate:0.8},
  '¡Hola pichunguito! ¡Soy tío Beto!': {pitch:0.75, rate:1.0},
  '¡Un abrazo, pichunguito! ¡Soy tía Giuliana!': {pitch:1.3, rate:1.05},
  /* Fernando */
  '¡Quiero hacer popo!': {pitch:1.9, rate:1.05},
  '¡Ahh, qué alivio!': {pitch:1.9, rate:0.9},
  '¡Uy, me eché un peo!': {pitch:1.9, rate:1.1},
  '¡Tesoro! ¡Encontré el tesoro!': {pitch:1.9, rate:1.05},
  '¡Salté la rampa!': {pitch:1.9, rate:1.05},
  '¡Mira, un popo bebé me sigue!': {pitch:1.9, rate:1.05},
  '¡Qué rica arepita de agüita de sapo!': {pitch:1.9, rate:1.05},
  '¡Llegamos a Maracaibo!': {pitch:1.9, rate:1.05},
  '¡Llegué a la luna!': {pitch:1.9, rate:1.05},
  '¡Vamos, dinosaurio!': {pitch:1.9, rate:1.1},
  /* el Señor Popo */
  '¡Hola Fernando! Soy el Señor Popo. ¡Come hamburguesas y ven a mi baño!': {pitch:0.5, rate:0.92},
  '¡Pasa, pasa! ¡El baño está libre!': {pitch:0.5, rate:0.95},
  '¡Bravo, Fernando! ¡Qué popo tan grande!': {pitch:0.5, rate:0.9},
  '¡Hiciste popo en todos mis baños! ¡Eres el campeón del popo!': {pitch:0.5, rate:0.9},
};
const SIN_GRABACION = [];
/* Las grabaciones de cada personaje jugable: CLIPS_PJ[personaje][frase] (se rellenan abajo) */
const CLIPS_PJ = {};
CLIPS_PJ.tiojuan = {
  '¡Extraterrestres! ¡Un abrazo desde la Tierra, pichunguitos!': AUDIO_BASE+'hf_20260906_042246_36b1f6fe-32fa-4ae9-8a56-f7de4d09683d.mp3',
  '¡Llegué a Marte, pichunguito!': AUDIO_BASE+'hf_20260906_042143_b60b50e8-9328-4f9c-8a0b-d6e2efc86311.mp3',
  '¿Para qué vamos a traer más chivos a Coro, pichunguito?': AUDIO_BASE+'hf_20260906_041849_f70ae849-73df-40ac-87a3-88d399dec0b4.mp3',
  '¡Mira para arriba, pichunguito! ¡Es el relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041837_f8591927-5fa8-4f96-b3bb-089e134113f6.mp3',
  '¡Qué molleja de puente! ¡Se me hizo un nudo en la garganta, pichunguito!': AUDIO_BASE+'hf_20260906_000211_099f1701-fc60-4330-852c-5e6efdd02493.mp3',
  '¡Tío Juan al rescate!': AUDIO_BASE+'hf_20260905_210210_199f86a0-4f49-466b-982a-44bc1cf39451.mp3',
  '¡Arriba, arriba! ¡Tío Juan vuela!': AUDIO_BASE+'hf_20260905_210210_2ad5e405-7d4f-4270-9365-c64e41ad13b3.mp3',
  '¡Capitán tío Juan al mando!': AUDIO_BASE+'hf_20260905_210210_15c52813-fa4a-4894-b0fc-8997998feb0b.mp3',
  '¡Un dinosaurio! ¡Qué bestia tan bonita!': AUDIO_BASE+'hf_20260905_210316_d72237c6-b3fb-4a4f-944b-0e27201c2e4a.mp3',
  '¡Llegué a la luna, pichunguito!': AUDIO_BASE+'hf_20260905_210210_f7a63a42-ed8c-46f2-aebf-549a6cd08941.mp3',
  '¡Mmm, qué rica hamburguesa!': AUDIO_BASE+'hf_20260905_210210_90e97486-b6d4-4724-985d-10b0f5c3210f.mp3',
  '¡Qué rica arepita de agüita de sapo, pichunguito!': AUDIO_BASE+'hf_20260905_210210_d15b4555-bb66-4319-bf6c-28d3119e7b72.mp3',
  '¡Maracaibo, tierra del sol amada!': AUDIO_BASE+'hf_20260905_210316_d81a399d-6027-4b20-9489-a686eb5a1461.mp3',
  '¡Ay, ay! ¡Necesito un baño ya!': AUDIO_BASE+'hf_20260905_210210_edf81b35-3bcf-41a0-a98d-ca198e4f944e.mp3',
  '¡Perdón! ¡Se me escapó un peo!': AUDIO_BASE+'hf_20260905_210316_8a7114ab-f937-487c-b1fd-7bbce0beac4d.mp3',
  '¡Ahh, qué alivio tan grande!': AUDIO_BASE+'hf_20260905_210210_b55de65a-f266-4edc-a18f-9d037663e32c.mp3',
  '¡Mira, un popo bebé me sigue!': AUDIO_BASE+'hf_20260905_210210_30e4e437-5ed5-44c8-90ec-58f65c1f99fd.mp3',
  '¡Salté la rampa como un superhéroe!': AUDIO_BASE+'hf_20260905_210238_d90a78a3-b6e7-4415-8425-8cdde2eba0dd.mp3',
  '¡El tesoro es nuestro, pichunguito!': AUDIO_BASE+'hf_20260905_210238_f8a42e91-e580-41dc-8952-e4891795b46d.mp3',
  '¡Hola, familia! ¡Un abrazo de tío Juan!': AUDIO_BASE+'hf_20260905_210238_218f5c52-99d2-42cc-b3a7-fdbf715e85be.mp3',
};
CLIPS_PJ.luca = {
  '¡Extraterrestres! ¡Hola, amigos del espacio!': AUDIO_BASE+'hf_20260906_042246_09a84784-985f-4ec2-adf0-89261b149a84.mp3',
  '¡Llegué a Marte! ¡Qué chévere!': AUDIO_BASE+'hf_20260906_042143_8e606ee9-95ae-4faf-a5b9-43f05ad19190.mp3',
  '¿Para qué vamos a traer más chivos a Coro?': AUDIO_BASE+'hf_20260906_041944_8bfe372c-5c3d-42c9-801f-7799492f2a9f.mp3',
  '¡Mira para arriba! ¡El relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041837_862706f9-c9b0-4285-8687-ac33b7174cf4.mp3',
  '¡Luca al ataque!': AUDIO_BASE+'hf_20260906_002445_487e6cf8-6ddd-4ce4-9cda-c46d8789c254.mp3',
  '¡Estoy volando! ¡Mírame!': AUDIO_BASE+'hf_20260906_002445_daa4df69-ac78-4c67-9c55-78985d1e4aec.mp3',
  '¡Zarpamos! ¡Todos a bordo!': AUDIO_BASE+'hf_20260906_002445_b4cfb5f1-7816-4eb6-9d69-01052f08d91b.mp3',
  '¡Arre, dinosaurio, arre!': AUDIO_BASE+'hf_20260906_002445_756bbecb-5399-486b-82ff-ccb5d06b7a34.mp3',
  '¡Llegué a la luna! ¡Qué chévere!': AUDIO_BASE+'hf_20260906_002445_c3a3f2d3-3d24-4bc1-b6a3-8770d1b4250f.mp3',
  '¡Ñam! ¡Qué rica hamburguesa!': AUDIO_BASE+'hf_20260906_002445_edf6b901-3709-4614-bde8-358c322b069e.mp3',
  '¡Qué rica arepa de agüita de sapo!': AUDIO_BASE+'hf_20260906_002445_167d9fd1-db65-4ab3-ad75-d3d1308b1449.mp3',
  '¡Llegamos a Maracaibo!': AUDIO_BASE+'hf_20260906_002445_1ff2782c-4e17-45f5-93a3-16e74fdfa608.mp3',
  '¡Quiero hacer popo!': AUDIO_BASE+'hf_20260906_002445_dc01280b-5f2b-4781-bcd5-f2bef2adecae.mp3',
  '¡Uy! ¡Me eché un peo!': AUDIO_BASE+'hf_20260906_002445_9fadaa59-ee29-4288-94cd-303b12424ec0.mp3',
  '¡Ahh, qué alivio!': AUDIO_BASE+'hf_20260906_002445_7272a7e4-5cf0-4057-8a8e-2aa33fbedead.mp3',
  '¡Un popo bebé me sigue!': AUDIO_BASE+'hf_20260906_002445_f8d7df63-1a89-4a5b-9fe3-a43217edccb8.mp3',
  '¡Salté la rampa!': AUDIO_BASE+'hf_20260906_002518_14d0899a-2257-48f7-aad4-82f64805597a.mp3',
  '¡Encontré el tesoro!': AUDIO_BASE+'hf_20260906_002518_5d15a4bf-1039-42ff-a0c6-5f2d124e372d.mp3',
  '¡Hola! ¡Soy Luca, el amigo de Fernando!': AUDIO_BASE+'hf_20260906_002554_2a50befe-07c2-45f7-a0d2-5d98568248b6.mp3',
  '¡Qué molleja! ¡Se me hizo un nudo en la garganta!': AUDIO_BASE+'hf_20260906_002456_bbcd031a-7e38-4b54-ad2c-9515f2771bba.mp3',
};
CLIPS_PJ.salomon = {
  '¡Extraterrestres! ¡Qué genial, primo!': AUDIO_BASE+'hf_20260906_042314_14dbeef8-0928-42c8-af6a-c62ca3eb8249.mp3',
  '¡Marte! ¡Qué genial, primo!': AUDIO_BASE+'hf_20260906_042143_cb72209e-b6ad-419f-800f-9fdbd44b20e3.mp3',
  '¿Para qué vamos a traer más chivos a Coro, primo?': AUDIO_BASE+'hf_20260906_041849_3d5071c2-447d-4dc4-b47a-40a4b67c906d.mp3',
  '¡Mira para arriba, primo! ¡Es el relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041837_3e6ca31f-ecfe-4f73-867f-bcc350973252.mp3',
  '¡Salomón en la casa!': AUDIO_BASE+'hf_20260906_002518_a0daae9f-c6d4-4f63-9ec6-3f53a5c883bf.mp3',
  '¡Volando con estilo!': AUDIO_BASE+'hf_20260906_002457_81b97a1e-c7ac-4738-b6b4-ff99b29381e6.mp3',
  '¡Al agua, marineros!': AUDIO_BASE+'hf_20260906_002456_8ac1c235-765b-44c9-af52-f35bb23daf22.mp3',
  '¡Dinosaurio, tú y yo somos un equipo!': AUDIO_BASE+'hf_20260906_002456_afeedb6f-af7a-4045-a12e-8990ec55a8f1.mp3',
  '¡La luna! ¡Qué genial!': AUDIO_BASE+'hf_20260906_002456_c57a5666-7835-4ed1-bed0-1e8ac6c20f13.mp3',
  '¡Esta hamburguesa está brutal!': AUDIO_BASE+'hf_20260906_002456_8869de81-bee9-47ad-a736-a5cca06f61fe.mp3',
  '¡Arepa de agüita de sapo, la mejor!': AUDIO_BASE+'hf_20260906_002518_00f00a30-c3af-4c7b-b809-31b58b36708d.mp3',
  '¡Maracaibo, aquí estoy!': AUDIO_BASE+'hf_20260906_002518_8e3f89f9-5d22-4518-9efe-23e27679de79.mp3',
  '¡Uy, uy! ¡Quiero hacer popo!': AUDIO_BASE+'hf_20260906_002554_a980494c-9aa6-4736-b90d-177298bb1640.mp3',
  '¡Ups, se me escapó un peo!': AUDIO_BASE+'hf_20260906_002618_f7f841ea-3ecd-4b32-9e83-15099fa04106.mp3',
  '¡Ahh, qué alivio!': AUDIO_BASE+'hf_20260906_002618_74257245-f006-4dbb-b15c-745fdef31b1a.mp3',
  '¡Ja! ¡Un popo bebé me sigue!': AUDIO_BASE+'hf_20260906_002554_0571328c-4889-4c7e-a14d-fe3b68293986.mp3',
  '¡Salté la rampa con estilo!': AUDIO_BASE+'hf_20260906_002554_f5e6199f-ce84-4afd-a0de-774d8b0744bd.mp3',
  '¡El tesoro! ¡Somos ricos!': AUDIO_BASE+'hf_20260906_002554_4f0b108c-e4d9-489c-89fa-0cdd63b0ea9c.mp3',
  '¡Hola! ¡Salomón quiere jugar!': AUDIO_BASE+'hf_20260906_002618_8b70ab41-5972-42e2-8a76-87c5d7a19789.mp3',
  '¡Qué molleja! ¡Se me hizo un nudo en la garganta, primo!': AUDIO_BASE+'hf_20260906_002554_b9143e4a-6c02-43f2-be30-c3c4cca9a7b1.mp3',
};
CLIPS_PJ.cucu = {
  '¡Extraterrestres! ¡Son muy lindos!': AUDIO_BASE+'hf_20260906_042314_13d0a651-6d90-4516-9d87-fd69cf02d050.mp3',
  '¡Llegué a Marte! ¡Hola, planeta rojo!': AUDIO_BASE+'hf_20260906_042143_a14189f1-4248-4688-a0cd-906c584c6207.mp3',
  '¿Para qué vamos a traer más chivos a Coro? ¡Ya hay muchos!': AUDIO_BASE+'hf_20260906_041944_5917f375-e9a0-4671-ace2-32b81ff7699b.mp3',
  '¡Mira para arriba! ¡Es el relámpago del Catatumbo! ¡Qué lindo!': AUDIO_BASE+'hf_20260906_041837_69363380-43b3-427b-8b86-a5e39772d3e3.mp3',
  '¡Ay, qué molleja! ¡Se me hizo un nudo en la garganta!': AUDIO_BASE+'hf_20260906_000211_1b04387a-e2a0-40eb-8e7a-401b0d8c267a.mp3',
  '¡Cucú! ¡Aquí estoy!': AUDIO_BASE+'hf_20260905_210703_5f221ed9-5716-4822-936a-cc9c90391de5.mp3',
  '¡Estoy volando como un pajarito!': AUDIO_BASE+'hf_20260905_210421_337b764a-9edb-4ffd-a9d0-4d254769d80c.mp3',
  '¡Vamos a navegar!': AUDIO_BASE+'hf_20260905_210420_a90c9a2c-8b09-4502-ad7a-f561e020b87f.mp3',
  '¡Qué dinosaurio tan lindo!': AUDIO_BASE+'hf_20260905_210420_f37a49ba-03f2-4e18-b013-ba357d122d7a.mp3',
  '¡Llegué a la luna! ¡Hola, estrellitas!': AUDIO_BASE+'hf_20260905_210421_3c735229-2c8c-40f3-8c38-ca5d781749b6.mp3',
  '¡Qué rica hamburguesa!': AUDIO_BASE+'hf_20260905_210420_568d18a0-1f06-4987-81a1-087849b62382.mp3',
  '¡Qué rica arepita de agüita de sapo!': AUDIO_BASE+'hf_20260905_210420_f8d50d06-6bca-473c-ba5c-1114d725107a.mp3',
  '¡Llegamos a Maracaibo!': AUDIO_BASE+'hf_20260905_210420_56426b15-35d0-4f91-9045-0d87906401dc.mp3',
  '¡Quiero hacer popo!': AUDIO_BASE+'hf_20260905_210420_772c99af-0f37-4423-909e-390c7f5c341d.mp3',
  '¡Ay, me eché un peo!': AUDIO_BASE+'hf_20260905_210606_950967de-ce17-468d-aca7-3df8b876234a.mp3',
  '¡Ahh, qué alivio!': AUDIO_BASE+'hf_20260905_210421_8a8b78e3-75df-4de0-93b0-506cfec8e09c.mp3',
  '¡Un popo bebé me sigue! ¡Qué tierno!': AUDIO_BASE+'hf_20260905_210606_d898820f-f13f-4c24-b348-d43abe78783a.mp3',
  '¡Salté la rampa!': AUDIO_BASE+'hf_20260905_210606_bebbe6ef-90c7-4493-b7aa-2e8ce1b2a43c.mp3',
  '¡Encontré el tesoro!': AUDIO_BASE+'hf_20260905_210606_29288783-0489-45a9-9832-dfabd061ebfb.mp3',
  '¡Hola! ¡Soy Cucú! ¿Jugamos?': AUDIO_BASE+'hf_20260905_210606_dd882164-fed1-4caa-9fe0-bfba75f44245.mp3',
};
CLIPS_PJ.santi = {
  '¡Marcianitos! ¡Hola!': AUDIO_BASE+'hf_20260906_042314_2ab82c09-7770-435b-b5c0-25b72c774978.mp3',
  '¡Marte! ¡Rojo!': AUDIO_BASE+'hf_20260906_042143_445bc306-26c6-4e7d-91c4-f45586e4f53d.mp3',
  '¿Pa qué más chivos a Coro?': AUDIO_BASE+'hf_20260906_041944_6db6af77-29e2-4f43-a522-90f9f76d5363.mp3',
  '¡Arriba! ¡Relámpago!': AUDIO_BASE+'hf_20260906_041837_b00edaf3-c97c-44a7-b41e-371fa97c123f.mp3',
  '¡Tati al ataque!': AUDIO_BASE+'hf_20260906_002554_15812f71-0ca3-4147-8f06-b2f4eedd63f1.mp3',
  '¡A volar! ¡Uuuh!': AUDIO_BASE+'hf_20260906_002618_8e717b13-50ab-4515-82d0-2e6bbf1cf8db.mp3',
  '¡Barquito, barquito!': AUDIO_BASE+'hf_20260906_002554_1b66d073-60e8-4a1f-bab6-fa49a4a86bb5.mp3',
  '¡Dino grande!': AUDIO_BASE+'hf_20260906_002642_12c5ebba-a6e2-4482-a6dd-4ec2bc11a75e.mp3',
  '¡La luna! ¡Qué bonita!': AUDIO_BASE+'hf_20260906_002618_debfb693-a9fa-4b8b-bcaa-f3a9a732e561.mp3',
  '¡Ñam, ñam! ¡Rica!': AUDIO_BASE+'hf_20260906_002618_43fe73e0-5a63-4588-8875-65883d7b3a02.mp3',
  '¡Arepita rica!': AUDIO_BASE+'hf_20260906_002618_f306bf8c-81ea-4936-9ed8-7a1931df0e4a.mp3',
  '¡Maracaibo!': AUDIO_BASE+'hf_20260906_002642_0f66a368-f233-4cd2-9dc7-5c51ffb5cd98.mp3',
  '¡Popó! ¡Quiero popó!': AUDIO_BASE+'hf_20260906_002642_0c040c67-ae54-4d2a-8572-7128b08a06f6.mp3',
  '¡Jiji, un peo!': AUDIO_BASE+'hf_20260906_002642_d0379da6-df45-4096-b45b-5e59e5536fc6.mp3',
  '¡Ahh, qué rico!': AUDIO_BASE+'hf_20260906_002659_6654933b-05c3-4f6f-9c9e-b698bfc61fdf.mp3',
  '¡Popó bebé! ¡Amiguito!': AUDIO_BASE+'hf_20260906_002659_45087126-f849-4718-9a06-4af69550d72c.mp3',
  '¡Salté! ¡Salté!': AUDIO_BASE+'hf_20260906_002642_e86d472c-92c7-4dc1-a8fb-cb73d08892e1.mp3',
  '¡Tesoro! ¡Brilla!': AUDIO_BASE+'hf_20260906_002642_149bf90b-fe6a-4bbd-8876-79ae5857f881.mp3',
  '¡Hola! ¡Soy Santi!': AUDIO_BASE+'hf_20260906_002642_518d7e64-8893-4b6e-aaa0-baa6467643bc.mp3',
  '¡Qué molleja! ¡Un nudo en la garganta!': AUDIO_BASE+'hf_20260906_002642_72530e90-db7b-43c3-8406-c272d2448082.mp3',
};
CLIPS_PJ.mama = {
  '¡Extraterrestres! ¡Hola, mis amores del espacio!': AUDIO_BASE+'hf_20260906_042341_47895ca8-6cf9-4b3f-a13a-cac0da83dff9.mp3',
  '¡Llegué a Marte! ¡No lo puedo creer!': AUDIO_BASE+'hf_20260906_042143_a189e061-2215-4ef8-833f-f1524952b450.mp3',
  '¿Para qué vamos a traer más chivos a Coro, mis amores?': AUDIO_BASE+'hf_20260906_041944_3bb56557-3993-46d0-a239-5f01f1e1a3f3.mp3',
  '¡Miren para arriba, mis amores! ¡Es el relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041837_b0a6c7a9-7e0d-4711-9bbd-32c5fbdb6c6f.mp3',
  '¡Qué molleja, mis amores! ¡Se me hizo un nudo en la garganta!': AUDIO_BASE+'hf_20260906_000211_93c691f1-1236-4925-8afd-cc585ce52a95.mp3',
  '¡Mamá está lista! ¡Vamos, mis amores!': AUDIO_BASE+'hf_20260905_210523_f82fde6b-bd57-476f-91c0-cb7e0e11c8eb.mp3',
  '¡Estoy volando! ¡Sujétense bien!': AUDIO_BASE+'hf_20260905_210523_76fd3f78-5fef-4645-8c77-81297da02c3e.mp3',
  '¡Todos a bordo, mis amores!': AUDIO_BASE+'hf_20260905_210703_1b8c4dd6-f195-4e10-b281-c66169fe8576.mp3',
  '¡Un dinosaurio! ¡Qué aventura!': AUDIO_BASE+'hf_20260905_210523_d5838e14-57a7-47a6-9b7e-4b26d3b6df40.mp3',
  '¡Llegué a la luna! ¡No lo puedo creer!': AUDIO_BASE+'hf_20260905_210523_ddb3249f-76df-4452-84a3-75316b613eec.mp3',
  '¡Qué rica hamburguesa!': AUDIO_BASE+'hf_20260905_210523_28e07e68-48e6-4ec5-86c4-1598fd4d931a.mp3',
  '¡Qué rica arepita de agüita de sapo!': AUDIO_BASE+'hf_20260905_210523_a8f30e3c-f9ef-4a3d-a784-a8a46dd274e6.mp3',
  '¡Llegamos a Maracaibo, mi tierra!': AUDIO_BASE+'hf_20260905_210523_b423185d-1ce5-4ba2-86ef-9afe7e253fb2.mp3',
  '¡Ay, necesito un baño ahora mismo!': AUDIO_BASE+'hf_20260905_210523_e87069ca-c6fa-4506-9432-4a17feedd8b7.mp3',
  '¡Ay, qué pena! ¡Se me escapó un peo!': AUDIO_BASE+'hf_20260905_210703_5bbbe9be-8711-42be-ad02-e4136faeb81a.mp3',
  '¡Ahh, qué alivio!': AUDIO_BASE+'hf_20260905_210759_10604036-7d2d-4900-9521-5351afdba891.mp3',
  '¡Miren, un popo bebé me sigue!': AUDIO_BASE+'hf_20260905_210618_0d2db6fb-2d25-41b8-bdf1-6eb334e399ce.mp3',
  '¡Salté la rampa! ¡Qué susto!': AUDIO_BASE+'hf_20260905_210847_00dc9e5f-bf50-4d99-9895-1f7b380e0f6f.mp3',
  '¡Encontré el tesoro!': AUDIO_BASE+'hf_20260905_210618_6da29cb5-2236-415f-9c44-f448912ed4b9.mp3',
  '¡Hola, mi amor! ¡Mamá te quiere mucho!': AUDIO_BASE+'hf_20260905_210703_bb52a312-7d08-4da6-9abb-a044c1f7c58b.mp3',
};
CLIPS_PJ.papa = {
  '¡Extraterrestres! ¡Hola, amigos del espacio!': AUDIO_BASE+'hf_20260906_042314_690d00b1-f647-4f3b-80ef-f61d9edc852b.mp3',
  '¡Llegué a Marte! ¡Increíble!': AUDIO_BASE+'hf_20260906_042217_41a55601-0361-47ef-b797-35fee76b4e32.mp3',
  '¿Para qué vamos a traer más chivos a Coro?': AUDIO_BASE+'hf_20260906_041944_9a89545f-f6ef-4f99-af71-213e7f5eb7b7.mp3',
  '¡Mira para arriba! ¡Es el relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041837_c17aa7fe-148d-4129-828d-057c6ac3ed78.mp3',
  '¡Qué molleja de puente! ¡Se me hizo un nudo en la garganta!': AUDIO_BASE+'hf_20260906_000211_202294ae-b21a-401c-9dd6-797ba3d29568.mp3',
  '¡Papá al volante!': AUDIO_BASE+'hf_20260905_210703_09f2c4a7-0e88-401c-82df-e2e5637ae56a.mp3',
  '¡Papá vuela alto!': AUDIO_BASE+'hf_20260905_210703_afafa465-7cee-4f13-92b5-c5e8a68532aa.mp3',
  '¡Capitán papá al mando!': AUDIO_BASE+'hf_20260905_210847_1ba382b2-2703-452d-8210-a592f7b925e0.mp3',
  '¡Un dinosaurio! ¡Esto sí es una aventura!': AUDIO_BASE+'hf_20260905_210733_ad6a03b0-924e-40be-a4e5-16f319e336f6.mp3',
  '¡Llegué a la luna! ¡Increíble!': AUDIO_BASE+'hf_20260905_210759_2a57af7f-14b6-4bac-b633-23f264b9432f.mp3',
  '¡Qué rica hamburguesa!': AUDIO_BASE+'hf_20260905_210759_281a92ca-da63-4344-9b30-f7d603e6f4cd.mp3',
  '¡Qué rica arepa de agüita de sapo!': AUDIO_BASE+'hf_20260905_210733_161b8d97-d4d1-4232-aa9e-b2f391a58e6d.mp3',
  '¡Llegamos a Maracaibo!': AUDIO_BASE+'hf_20260905_210759_1825be66-ee0b-4d70-b2cb-b890c4612823.mp3',
  '¡Uy, tengo que ir al baño!': AUDIO_BASE+'hf_20260905_210847_f19feb26-fe5f-4dd9-a902-f6e5c9eefb6c.mp3',
  '¡Perdón! ¡Fue un peo!': AUDIO_BASE+'hf_20260905_210733_9ccdd7e9-8c8e-4a2b-83bb-7170e33b3ba5.mp3',
  '¡Ahh, qué alivio!': AUDIO_BASE+'hf_20260905_210847_cc50a33a-1e17-4da1-befe-1ff6060b8ce9.mp3',
  '¡Un popo bebé me sigue!': AUDIO_BASE+'hf_20260905_210935_22bffa67-5511-4895-b952-3c1ce4188ce5.mp3',
  '¡Salté la rampa! ¡Qué salto!': AUDIO_BASE+'hf_20260905_210847_de390aa9-f3d4-4f10-9eee-7b152fe8479d.mp3',
  '¡El tesoro! ¡Lo encontramos!': AUDIO_BASE+'hf_20260905_210847_7b9e0e7a-60f4-4821-8e23-d048dcd2aa40.mp3',
  '¡Hola, campeón! ¡Papá está aquí!': AUDIO_BASE+'hf_20260905_210935_54408410-f3f6-4954-8784-e6cb2ab18077.mp3',
};
CLIPS_PJ.abu = {
  '¡Ay, extraterrestres! ¡Hola, mis cielos del espacio!': AUDIO_BASE+'hf_20260906_042314_9e84ecdd-899e-46f5-981e-2eedfd30da54.mp3',
  '¡Llegué a Marte! ¡Quién lo diría, mi cielo!': AUDIO_BASE+'hf_20260906_042217_6c3c1675-db59-454c-9a97-78eaa5db3a99.mp3',
  '¡Ay, mi cielo! ¿Para qué vamos a traer más chivos a Coro?': AUDIO_BASE+'hf_20260906_041944_61525261-8065-436f-8715-63e16267ed4b.mp3',
  '¡Ay, mira para arriba, mi cielo! ¡Es el relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041837_fed749fe-c45d-4221-abaa-23b65edbdc69.mp3',
  '¡Ay, qué molleja! ¡Se me hizo un nudo en la garganta, mi cielo!': AUDIO_BASE+'hf_20260906_000244_8d7a6424-c315-468c-b267-4513e1470afc.mp3',
  '¡Abu está lista, mis niños!': AUDIO_BASE+'hf_20260905_210914_5e4b3335-b965-48ef-b932-4bd1226d01f7.mp3',
  '¡Ay, Dios mío, estoy volando!': AUDIO_BASE+'hf_20260905_210914_4d55f7d3-258d-49a2-a850-8431bcbdc8de.mp3',
  '¡Vamos a navegar, mis amores!': AUDIO_BASE+'hf_20260905_210914_a2bc3fad-bc8f-4a44-8fb0-62aee9f62b83.mp3',
  '¡Ay, un dinosaurio! ¡Qué grande!': AUDIO_BASE+'hf_20260905_210935_f489ae75-9949-4436-97d5-1e2be080b113.mp3',
  '¡Llegué a la luna! ¡Quién lo diría!': AUDIO_BASE+'hf_20260905_210935_722c290e-554c-4ab1-96d1-8aa1394d26be.mp3',
  '¡Qué rica hamburguesa!': AUDIO_BASE+'hf_20260905_210935_cf25a535-9917-4c56-b426-7381a983adaa.mp3',
  '¡Qué rica arepita de agüita de sapo!': AUDIO_BASE+'hf_20260905_210935_d9a22459-0499-4de1-a783-540a8087539a.mp3',
  '¡Maracaibo! ¡Qué calor tan sabroso!': AUDIO_BASE+'hf_20260905_211121_588c1a0d-3964-4a0c-92f9-598f72a03545.mp3',
  '¡Ay, necesito un bañito!': AUDIO_BASE+'hf_20260905_211102_f9bbfe4f-0a4c-4e23-85d2-bbcc190e3dc0.mp3',
  '¡Ay, qué pena! ¡Un peíto!': AUDIO_BASE+'hf_20260905_211122_13bd4757-b40c-4d8d-8916-ad55be63467a.mp3',
  '¡Ahh, qué alivio, mi amor!': AUDIO_BASE+'hf_20260905_211101_df9af45f-6f09-4b91-8e2b-926c974b084d.mp3',
  '¡Miren, un popo bebé me sigue!': AUDIO_BASE+'hf_20260905_211122_122b98f9-3a8a-4aec-b3e1-264f924fc82c.mp3',
  '¡Salté la rampa! ¡Ay, mi corazón!': AUDIO_BASE+'hf_20260905_211102_1e867c4d-74db-4591-b573-fc33f0792d1f.mp3',
  '¡Encontré el tesoro!': AUDIO_BASE+'hf_20260905_211121_e11b2932-b5c4-428f-902b-a329bdd79504.mp3',
  '¡Hola, mi cielo! ¡Abu te quiere!': AUDIO_BASE+'hf_20260905_211102_f7b5fee2-a1b1-4a8f-b826-0fcdfe644dc0.mp3',
};
CLIPS_PJ.nacho = {
  '¡Épale! ¡Extraterrestres!': AUDIO_BASE+'hf_20260906_042341_7afb2ecc-8d0f-4ae8-9496-ed37f17179b2.mp3',
  '¡Épale! ¡Llegué a Marte!': AUDIO_BASE+'hf_20260906_042217_6b5feb8f-91e4-43ad-a031-e7d9dd9a8322.mp3',
  '¡Épale! ¿Para qué vamos a traer más chivos a Coro?': AUDIO_BASE+'hf_20260906_041944_c3cb20c4-e8dc-4e5b-9542-66f3219c2cbe.mp3',
  '¡Épale, mira para arriba! ¡Es el relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041837_5e5c5716-d116-44af-8416-6d422822cc67.mp3',
  '¡Épale, qué molleja! ¡Se me hizo un nudo en la garganta!': AUDIO_BASE+'hf_20260906_000244_8e5e054a-3d97-4878-bd78-a127f6561834.mp3',
  '¡Épale! ¡Tío Nacho llegó!': AUDIO_BASE+'hf_20260905_211122_040c8ffb-f2b8-48b0-946e-f1da910c8c46.mp3',
  '¡Épale, estoy volando!': AUDIO_BASE+'hf_20260905_211122_4f35c60a-929f-4aa4-b9e1-4163166552f5.mp3',
  '¡Todos a bordo con tío Nacho!': AUDIO_BASE+'hf_20260905_211122_ad78fe32-f216-4c38-84a4-fad333c188ef.mp3',
  '¡Épale, un dinosaurio!': AUDIO_BASE+'hf_20260905_211121_38beff48-309f-45f1-9ef6-35b759bbd5d5.mp3',
  '¡Épale! ¡Llegué a la luna!': AUDIO_BASE+'hf_20260905_211145_3052c107-2860-4c41-81bb-be212081b065.mp3',
  '¡Épale, qué rica hamburguesa!': AUDIO_BASE+'hf_20260905_211146_0c58a5a1-fe59-4bfd-b944-8277a6c24b1c.mp3',
  '¡Épale, qué rica arepa de agüita de sapo!': AUDIO_BASE+'hf_20260905_211210_7f685b7b-aae2-4a06-b71d-23bfbe52a8c0.mp3',
  '¡Llegamos a Maracaibo, épale!': AUDIO_BASE+'hf_20260905_211146_8077c67b-07f6-4bdc-ba35-bf8829522ada.mp3',
  '¡Épale, quiero hacer popo!': AUDIO_BASE+'hf_20260905_211146_01f3fffb-d45f-40e9-9b37-3eeacd13d5fa.mp3',
  '¡Épale! ¡Se me escapó un peo!': AUDIO_BASE+'hf_20260905_211146_433c0d4d-9968-4d6a-8230-1bfdd8c75ea3.mp3',
  '¡Ahh, qué alivio!': AUDIO_BASE+'hf_20260905_211210_cde9b72b-45da-4859-9f6e-84afffed07be.mp3',
  '¡Épale, un popo bebé me sigue!': AUDIO_BASE+'hf_20260905_211210_52f9d5a9-582d-4ecc-a22e-17af7e0a54ea.mp3',
  '¡Épale, salté la rampa!': AUDIO_BASE+'hf_20260905_211210_efec32eb-c2a5-401a-9a75-e0fd5938f842.mp3',
  '¡Épale, el tesoro!': AUDIO_BASE+'hf_20260905_211233_cc34dd7f-6d5f-4acd-8f31-e77a91af13c5.mp3',
  '¡Épale! ¡Aquí viene tío Nacho!': AUDIO_BASE+'hf_20260905_211233_0d2530c9-62f0-495f-9dd0-c7cd85186173.mp3',
};
CLIPS_PJ.yanny = {
  '¡Extraterrestres! ¡Hola, mis amores!': AUDIO_BASE+'hf_20260906_042341_6617e3c8-c739-4037-bec7-b27795744a46.mp3',
  '¡Llegué a Marte, mi amor!': AUDIO_BASE+'hf_20260906_042217_0345062f-b308-421b-9ea5-14d8d4722ecf.mp3',
  '¿Para qué vamos a traer más chivos a Coro, mi amor?': AUDIO_BASE+'hf_20260906_042016_eea735f7-057b-4dff-8d1a-a732035752ec.mp3',
  '¡Mira para arriba, mi amor! ¡Es el relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041837_e18e2ce7-c657-4e72-b3d1-af1169f126ce.mp3',
  '¡Qué molleja, mi amor! ¡Se me hizo un nudo en la garganta!': AUDIO_BASE+'hf_20260906_000211_120fe22f-2de6-425d-bb70-389e620d512f.mp3',
  '¡Hola mi amor! ¡Tía Yanny está lista!': AUDIO_BASE+'hf_20260905_211210_5ce11796-fa36-43a4-8bf8-930316ba09bf.mp3',
  '¡Estoy volando, mi amor!': AUDIO_BASE+'hf_20260905_211210_9f201a46-e7a4-4dd7-9852-d62f14a8f10b.mp3',
  '¡Todos a bordo, mis amores!': AUDIO_BASE+'hf_20260905_211233_09950464-6a25-4daf-b9f2-987677f4128e.mp3',
  '¡Un dinosaurio! ¡Qué lindo!': AUDIO_BASE+'hf_20260905_211406_13cf960a-b1bb-486a-b1fe-0cb3990e8434.mp3',
  '¡Llegué a la luna, mi amor!': AUDIO_BASE+'hf_20260905_211256_399d3cb0-cc5c-432b-a44f-d4db87d6405d.mp3',
  '¡Qué rica hamburguesa!': AUDIO_BASE+'hf_20260905_211233_8412902b-6506-4cdd-8118-d1cb6178a938.mp3',
  '¡Qué rica arepita de agüita de sapo!': AUDIO_BASE+'hf_20260905_211233_a3e456c4-1900-475c-b79c-9fe8a9a9fd69.mp3',
  '¡Llegamos a Maracaibo!': AUDIO_BASE+'hf_20260905_211233_db8d0442-7035-429d-b44a-2ff156f0634b.mp3',
  '¡Ay, quiero hacer popo!': AUDIO_BASE+'hf_20260905_211256_1dea8b37-e000-481b-a780-1a9ffc2e5e10.mp3',
  '¡Ay, mi amor, me eché un peo!': AUDIO_BASE+'hf_20260905_211321_e2c6a0b0-383e-4cd6-90b6-ae110c86d7e9.mp3',
  '¡Ahh, qué alivio!': AUDIO_BASE+'hf_20260905_211321_03385d54-29dc-459d-8b09-1b958e701616.mp3',
  '¡Un popo bebé me sigue!': AUDIO_BASE+'hf_20260905_211321_d3fb3c9d-e7d1-4f44-b88d-65b5562d05ec.mp3',
  '¡Salté la rampa!': AUDIO_BASE+'hf_20260905_211321_daf0b5ae-67ac-4b23-a6f6-adbd76c75d3d.mp3',
  '¡Encontré el tesoro!': AUDIO_BASE+'hf_20260905_211256_4a72433e-92dd-4a06-8afb-205e17fba25e.mp3',
  '¡Hola mi amor! ¡Soy tía Yanny!': AUDIO_BASE+'hf_20260905_211321_81ef2f70-8ac6-4099-ae39-dd00ef98778f.mp3',
};
CLIPS_PJ.tiofran = {
  '¡Extraterrestres! ¡A ver quién se tira el peo más grande!': AUDIO_BASE+'hf_20260906_042341_74adea0a-d7ff-428b-9900-a3c81d5f04f7.mp3',
  '¡Llegué a Marte! ¡Mi peo me trajo hasta aquí!': AUDIO_BASE+'hf_20260906_042217_00d181c4-5c09-4237-aee9-450b95d3185f.mp3',
  '¿Para qué vamos a traer más chivos a Coro? ¡Prrrr!': AUDIO_BASE+'hf_20260906_042017_fa9b5294-4fb0-4915-9fd8-f3a93a3bf510.mp3',
  '¡Mira para arriba! ¡Es el relámpago del Catatumbo! ¿O fue mi peo?': AUDIO_BASE+'hf_20260906_041837_7008aca4-a42b-4914-9dbd-1584c41e51d0.mp3',
  '¡Qué molleja! ¡Se me hizo un nudo en la garganta… y un peo del susto!': AUDIO_BASE+'hf_20260906_000210_0aaa5fa1-d871-45e9-b492-7fb2eaa58e51.mp3',
  '¡Tío Fran llegó! ¡Cuidado con mis peos!': AUDIO_BASE+'hf_20260905_211321_12cb52df-4047-4462-9e01-56a3f607432b.mp3',
  '¡Volando a pura fuerza de peo!': AUDIO_BASE+'hf_20260905_211321_14d204d3-0be3-45a0-9d53-50215b31f0a1.mp3',
  '¡Todos a bordo! ¡Y abran las ventanas!': AUDIO_BASE+'hf_20260905_211451_45780969-5266-4128-844b-5cfef7d92aed.mp3',
  '¡Un dinosaurio! ¡A ver quién se tira el peo más grande!': AUDIO_BASE+'hf_20260905_211342_4c957b6b-cbb4-4305-b4ae-7f252b910938.mp3',
  '¡Llegué a la luna! ¡Mi peo me trajo hasta aquí!': AUDIO_BASE+'hf_20260905_211429_883bd556-f5d8-4631-862b-fa14021bfa98.mp3',
  '¡Qué rica hamburguesa! ¡Ya viene el peo!': AUDIO_BASE+'hf_20260905_211406_2ba0f90a-e68e-410e-b36d-fa12cc54e4d4.mp3',
  '¡Qué rica arepa de agüita de sapo!': AUDIO_BASE+'hf_20260905_211342_3d19d4f8-c9d9-48c3-b01d-71bc6b998e2e.mp3',
  '¡Llegamos a Maracaibo!': AUDIO_BASE+'hf_20260905_211342_3da997f5-e443-4254-85fd-7ef2acd859e5.mp3',
  '¡Quiero hacer popo! ¡Y no es broma!': AUDIO_BASE+'hf_20260905_211342_5b74b893-9969-4027-992c-3edf4abc0bba.mp3',
  '¡Prrrr! ¡Ese sí fue grande!': AUDIO_BASE+'hf_20260905_211406_cb8ecf17-3fa8-423f-8147-9469aad026a0.mp3',
  '¡Ahh, qué alivio!': AUDIO_BASE+'hf_20260905_211406_0c955194-3a87-4857-a607-cdae55d6b945.mp3',
  '¡Un popo bebé me sigue!': AUDIO_BASE+'hf_20260905_211406_2615c55d-82e6-4d9c-8672-5831b5b2134d.mp3',
  '¡Salté la rampa!': AUDIO_BASE+'hf_20260905_211406_86e8cf2b-296d-478d-aad4-7ab353933ffb.mp3',
  '¡El tesoro! ¡Y huele a peo!': AUDIO_BASE+'hf_20260905_211429_22037325-cf57-44d3-9160-70f459ef30ba.mp3',
  '¡Hola! ¡Soy tío Fran! ¡Prrrr!': AUDIO_BASE+'hf_20260905_211429_9b5e63a7-87c6-4323-8857-1cfa7e1d170d.mp3',
};
CLIPS_PJ.romulo = {
  '¡Qué rica Polarcita!': AUDIO_BASE+'hf_20260906_042401_d3c1b8b3-b489-41a0-8015-73ce4948e280.mp3',
  '¡Extraterrestres! ¡Brrrp! ¡Ay, qué pena!': AUDIO_BASE+'hf_20260906_042341_c6a88b75-8414-4743-b4be-00b623af9503.mp3',
  '¡Llegué a Marte! ¡Brrrp! ¡Ay, qué pena!': AUDIO_BASE+'hf_20260906_042217_859c2853-94d7-4cf7-b82c-79ad160f4400.mp3',
  '¿Para qué vamos a traer más chivos a Coro? ¡Brrrp!': AUDIO_BASE+'hf_20260906_042017_70d4063f-255f-4b6f-b5f1-569e102592b3.mp3',
  '¡Mira para arriba! ¡El relámpago del Catatumbo! ¡Brrrp!': AUDIO_BASE+'hf_20260906_041849_87fa0f22-1d3a-477f-9cd2-3a7c8b856422.mp3',
  '¡Qué molleja! ¡Se me hizo un nudo en la garganta! ¡Brrrp! ¡Ay, qué pena!': AUDIO_BASE+'hf_20260906_000219_788dbe27-e9af-4e47-97b6-74d23ecfd4eb.mp3',
  '¡Rómulo el mapache está listo!': AUDIO_BASE+'hf_20260905_211429_a28b6474-3174-434e-ae2f-77049161db0c.mp3',
  '¡Estoy volando! ¡Brrrp!': AUDIO_BASE+'hf_20260905_211429_b725a450-91f6-46e5-85c9-36466eabd3eb.mp3',
  '¡Al barco! ¡Brrrp!': AUDIO_BASE+'hf_20260905_211451_8a631037-875f-4344-87d8-2f1bef316fe9.mp3',
  '¡Un dinosaurio! ¡Ay, qué pena!': AUDIO_BASE+'hf_20260905_211429_6f7b8308-1d09-4177-9f43-0835f654cbac.mp3',
  '¡Llegué a la luna! ¡Brrrp! ¡Ay, qué pena!': AUDIO_BASE+'hf_20260905_211515_4645afed-d87a-47ef-8347-104e831459d1.mp3',
  '¡Qué rica hamburguesa! ¡Brrrp!': AUDIO_BASE+'hf_20260905_211451_7dc9d9f9-c06d-4029-988b-84129555ad82.mp3',
  '¡Qué rica arepa! ¡Brrrp! ¡Ay, qué pena!': AUDIO_BASE+'hf_20260905_211451_c73c2409-6bcd-4679-a5c8-ca3751f4ccdb.mp3',
  '¡Llegamos a Maracaibo!': AUDIO_BASE+'hf_20260905_211515_44b1bd6b-d7fa-4fe9-830d-ef4430e1118f.mp3',
  '¡Quiero hacer popo! ¡Ay, qué pena!': AUDIO_BASE+'hf_20260905_211451_212bfcc1-3613-47af-b06d-623232e30164.mp3',
  '¡Brrrp! ¡No, eso fue un peo! ¡Ay, qué pena!': AUDIO_BASE+'hf_20260905_211451_fedea793-88e3-4f1a-9759-68a6df11318a.mp3',
  '¡Ahh, qué alivio!': AUDIO_BASE+'hf_20260905_211514_c840edb0-7d8d-4163-bbc5-a2dbb7964b7f.mp3',
  '¡Un popo bebé me sigue!': AUDIO_BASE+'hf_20260905_211537_6b04159c-1b3b-4bb6-835c-173ca86770e6.mp3',
  '¡Salté la rampa!': AUDIO_BASE+'hf_20260905_211515_f0069e73-2c6a-4d02-b13f-50ffe421b99c.mp3',
  '¡El tesoro! ¡Brrrp!': AUDIO_BASE+'hf_20260905_211515_82e3640c-8dfa-4827-b87b-a0adba2c0cc7.mp3',
  '¡Hola! ¡Brrrp! ¡Ay, qué pena!': AUDIO_BASE+'hf_20260905_211515_ae5f8bc5-85c8-403a-a175-8a9915c232aa.mp3',
};
CLIPS_PJ.beto = {
  '¡Extraterrestres! ¡Hola, amigos del espacio!': AUDIO_BASE+'hf_20260906_042341_57d37184-cfb1-4dc8-b484-d345392d0c18.mp3',
  '¡Llegué a Marte, pichunguito!': AUDIO_BASE+'hf_20260906_042314_43cf9221-187d-4270-a007-f99c0d63b0f0.mp3',
  '¿Para qué vamos a traer más chivos a Coro, pichunguito?': AUDIO_BASE+'hf_20260906_042017_7d278b50-0d94-4a7f-80f6-108bff238808.mp3',
  '¡Mira para arriba, pichunguito! ¡Es el relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041849_63bcc969-5042-4013-92d8-0acf015ea6bb.mp3',
  '¡Qué molleja, pichunguito! ¡Se me hizo un nudo en la garganta!': AUDIO_BASE+'hf_20260906_000219_8ee6a2f9-63e7-490c-be01-b18997f187e3.mp3',
  '¡Tío Beto está listo, pichunguito!': AUDIO_BASE+'hf_20260905_211515_44df742b-2dfb-495f-9de1-faf4fdc7a06e.mp3',
  '¡Estoy volando!': AUDIO_BASE+'hf_20260905_211559_70e20026-8ba8-47af-b79c-99ee194c8323.mp3',
  '¡Todos a bordo con tío Beto!': AUDIO_BASE+'hf_20260905_211537_7bf369c2-d0c3-4bfb-9b37-c62b2ba09670.mp3',
  '¡Un dinosaurio! ¡Qué maravilla!': AUDIO_BASE+'hf_20260905_211537_fd82a045-f8f2-467a-8117-bb46fbe15dee.mp3',
  '¡Llegué a la luna!': AUDIO_BASE+'hf_20260905_211537_c8191a27-6ae7-4a35-8673-0fcdff1c503b.mp3',
  '¡Qué rica hamburguesa!': AUDIO_BASE+'hf_20260905_211537_aae70218-d21b-4eac-baa1-0dfa32ef9fb8.mp3',
  '¡Qué rica arepa de agüita de sapo!': AUDIO_BASE+'hf_20260905_211537_63651c88-f1ba-456b-bc7a-c147cd8ab65c.mp3',
  '¡Llegamos a Maracaibo!': AUDIO_BASE+'hf_20260905_211559_b5674ce7-3434-4ce3-ae2f-e2b5ea82b3d1.mp3',
  '¡Quiero hacer popo!': AUDIO_BASE+'hf_20260905_211624_b87ee273-5cde-417f-a7c9-bafe3696e155.mp3',
  '¡Uy, me eché un peo!': AUDIO_BASE+'hf_20260905_211559_93e276c4-e70b-40c3-9c6d-c933e185991f.mp3',
  '¡Ahh, qué alivio!': AUDIO_BASE+'hf_20260905_211559_cfe0a915-dabf-4faa-9bd9-cec26314dbc4.mp3',
  '¡Un popo bebé me sigue!': AUDIO_BASE+'hf_20260905_211645_f6f9c7f7-aa3c-4287-9f66-c468cbd9d517.mp3',
  '¡Salté la rampa!': AUDIO_BASE+'hf_20260905_211559_7300e511-6975-4380-94b0-c04ed043db30.mp3',
  '¡Encontré el tesoro!': AUDIO_BASE+'hf_20260905_211559_05fe0020-6eba-4c2e-8436-aca9c4a3d75e.mp3',
  '¡Hola pichunguito! ¡Soy tío Beto!': AUDIO_BASE+'hf_20260905_211706_6cc72135-3327-4f18-acd7-6fb06b89ec5c.mp3',
};
CLIPS_PJ.giuliana = {
  '¡Extraterrestres! ¡Un abrazo, amigos del espacio!': AUDIO_BASE+'hf_20260906_042418_73e93f8a-13bd-416d-aed6-4e846e2e734a.mp3',
  '¡Llegué a Marte! ¡Un abrazo, planeta rojo!': AUDIO_BASE+'hf_20260906_042246_eb8d88c7-77e4-4265-8f10-7f038c6c0698.mp3',
  '¿Para qué vamos a traer más chivos a Coro?': AUDIO_BASE+'hf_20260906_042217_855cadfa-e6fc-4c29-86aa-647ad059a5e5.mp3',
  '¡Mira para arriba! ¡Es el relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041849_ba2db5d2-2e1b-452a-966c-df7486061296.mp3',
  '¡Qué molleja! ¡Se me hizo un nudo en la garganta!': AUDIO_BASE+'hf_20260906_000219_586d7b35-ba97-4317-9eca-e958f338b4bb.mp3',
  '¡Tía Giuliana está lista!': AUDIO_BASE+'hf_20260905_211624_7b78eff4-1245-4ca6-a493-eb5180754d4f.mp3',
  '¡Estoy volando! ¡Qué emoción!': AUDIO_BASE+'hf_20260905_211706_b3bdb296-e18e-4b80-90d0-f68311297105.mp3',
  '¡Todos a bordo!': AUDIO_BASE+'hf_20260905_211624_8062a0d2-2cf4-49c3-ab57-f571354c9436.mp3',
  '¡Un dinosaurio! ¡Un abrazo, dinosaurio!': AUDIO_BASE+'hf_20260905_211645_6092c4da-69e0-4e47-8c8d-440c7924bd13.mp3',
  '¡Llegué a la luna!': AUDIO_BASE+'hf_20260905_211706_8832106b-aa98-4789-9ec4-3e226328d3b4.mp3',
  '¡Qué rica hamburguesa!': AUDIO_BASE+'hf_20260905_211645_d23626ff-7f2c-43c6-ac20-fee5c90fe01d.mp3',
  '¡Qué rica arepita de agüita de sapo!': AUDIO_BASE+'hf_20260905_211706_a496953b-db33-452a-9db9-d6f33aad160f.mp3',
  '¡Llegamos a Maracaibo!': AUDIO_BASE+'hf_20260905_211645_3f502409-f470-45f7-846b-710799479164.mp3',
  '¡Quiero hacer popo!': AUDIO_BASE+'hf_20260905_211706_d6ee538a-1fcd-43cd-b8e3-9ca1b14dadba.mp3',
  '¡Ay, me eché un peo!': AUDIO_BASE+'hf_20260905_211706_ceb5cff4-f4f4-4a57-88cf-f33799597765.mp3',
  '¡Ahh, qué alivio!': AUDIO_BASE+'hf_20260905_211706_73858bd7-2c1f-4606-8a79-a99e00e96a4d.mp3',
  '¡Un popo bebé me sigue!': AUDIO_BASE+'hf_20260905_211706_fac13c1c-9f7d-4553-8703-1e01eac08686.mp3',
  '¡Salté la rampa!': AUDIO_BASE+'hf_20260905_211729_92f2bd8c-0d86-489e-ad11-bb87a434fd5b.mp3',
  '¡Encontré el tesoro!': AUDIO_BASE+'hf_20260905_211729_30621e05-6f5b-4b59-8a25-8ec4ca7ac564.mp3',
  '¡Un abrazo, pichunguito! ¡Soy tía Giuliana!': AUDIO_BASE+'hf_20260905_211729_580f7a89-60a3-4315-a6f3-f5c18221a592.mp3',
};
CLIPS_PJ.penny = {
  '¡Guau! ¡Extraterrestres!': AUDIO_BASE+'hf_20260906_042401_fcbbbaef-12de-4575-a012-c6cf5baa564e.mp3',
  '¡Guau! ¡Llegué a Marte!': AUDIO_BASE+'hf_20260906_042246_0b37eb2d-1a67-4d24-9154-3dd866fe84bc.mp3',
  '¡Guau! ¿Para qué vamos a traer más chivos a Coro?': AUDIO_BASE+'hf_20260906_042017_7235489b-728f-49d4-a332-dca674cc657e.mp3',
  '¡Guau! ¡Mira para arriba! ¡El relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041849_164ffd54-1cf9-4e8e-88db-eb39d3a1d1dd.mp3',
  '¡Guau! ¡Qué molleja! ¡Se me hizo un nudo en la garganta!': AUDIO_BASE+'hf_20260906_000219_c2772fa7-ef50-4f74-95f1-13ab9b31c77e.mp3',
  '¡Guau! ¡Penny al ataque!': AUDIO_BASE+'hf_20260905_212151_8f86856b-70e0-4ecf-aea9-b2e64425eb14.mp3',
  '¡Guau! ¡Un perrito volador!': AUDIO_BASE+'hf_20260905_211753_9d44db2a-24c7-464e-98a9-472e9880bcca.mp3',
  '¡Guau! ¡Todos a bordo!': AUDIO_BASE+'hf_20260905_211729_6028deea-f5cd-4dfa-a62a-d68af0eb3e8a.mp3',
  '¡Guau, guau! ¡Un dinosaurio!': AUDIO_BASE+'hf_20260905_211729_dea2fa81-e78e-45ce-b3a1-a0f8dffd89c6.mp3',
  '¡Guau! ¡Llegué a la luna!': AUDIO_BASE+'hf_20260905_211729_64046322-a000-42ac-ad5d-8a0435cecda3.mp3',
  '¡Guau! ¡Qué rica hamburguesa!': AUDIO_BASE+'hf_20260905_211835_f43af52f-4a2d-4731-9a6f-ba3cde7d25e6.mp3',
  '¡Guau! ¡Qué rica arepa!': AUDIO_BASE+'hf_20260905_211835_db9e0a98-a995-4381-9ae9-85449a098636.mp3',
  '¡Guau! ¡Llegamos a Maracaibo!': AUDIO_BASE+'hf_20260905_211753_2414d280-c699-4ab2-9460-68dc3be59e68.mp3',
  '¡Guau! ¡Quiero hacer popo!': AUDIO_BASE+'hf_20260905_211813_43b317e5-4b80-4f85-b770-e0a70850b696.mp3',
  '¡Guau! ¡Me eché un peo!': AUDIO_BASE+'hf_20260905_211753_1bf7ae47-bfd6-45d0-9f28-cfd6dab50cef.mp3',
  '¡Ahh, qué alivio! ¡Guau!': AUDIO_BASE+'hf_20260905_211813_9f23f908-bb0d-4cea-b5e2-5cd54da45d95.mp3',
  '¡Guau! ¡Un popo bebé me sigue!': AUDIO_BASE+'hf_20260905_211835_62907712-c5f0-4907-aad9-766cd8370597.mp3',
  '¡Guau! ¡Salté la rampa!': AUDIO_BASE+'hf_20260905_211835_d3ba60a9-46c5-40d3-9b1b-75af80ea9110.mp3',
  '¡Guau! ¡El tesoro!': AUDIO_BASE+'hf_20260905_211813_3acd5ede-6cad-4ac9-8347-f0d433082f22.mp3',
  '¡Guau, guau! ¡Soy Penny!': AUDIO_BASE+'hf_20260905_211835_5309a4b6-fc7c-45bd-85ba-c1049176791d.mp3',
};
CLIPS_PJ.sheldon = {
  '¡Guau, guau! ¡Marcianitos!': AUDIO_BASE+'hf_20260906_042401_2d0d6792-47f7-4afc-9b46-036f55601e6f.mp3',
  '¡Guau! ¡Marte!': AUDIO_BASE+'hf_20260906_042314_bce25eac-b938-4d3e-835d-47c0acb00920.mp3',
  '¡Guau, guau! ¿Más chivos a Coro?': AUDIO_BASE+'hf_20260906_042017_b9a3a079-fa31-4867-9a99-b4d8bf04feeb.mp3',
  '¡Guau, guau! ¡Arriba! ¡El relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041849_d2f0d9ad-6630-4ef5-a7ef-58046501cd7b.mp3',
  '¡Guau, guau! ¡Qué molleja! ¡Un nudo en la garganta!': AUDIO_BASE+'hf_20260906_000219_b7e4b924-8114-4c00-a58a-3cb489743866.mp3',
  '¡Guau! ¡Sheldon al ataque!': AUDIO_BASE+'hf_20260905_211835_ec4070eb-0629-4d71-b2fb-f72f629d493e.mp3',
  '¡Guau! ¡Sheldon vuela!': AUDIO_BASE+'hf_20260905_211835_8f7b85b5-5d43-4411-a9b8-35f068e670ab.mp3',
  '¡Guau! ¡Al barco!': AUDIO_BASE+'hf_20260905_211955_52ee7f72-9965-4e1a-b274-8d97da80e4b7.mp3',
  '¡Guau, guau! ¡Un dinosaurio grande!': AUDIO_BASE+'hf_20260905_211920_7aa7683f-5dfe-4c18-b27f-080d84437e1b.mp3',
  '¡Guau! ¡La luna!': AUDIO_BASE+'hf_20260905_212347_9e3d0331-0577-4497-98a7-c72794f9aa4a.mp3',
  '¡Guau! ¡Hamburguesa rica!': AUDIO_BASE+'hf_20260905_211857_274df2a5-7515-4b3e-86b6-c1c141deadea.mp3',
  '¡Guau! ¡Arepa rica!': AUDIO_BASE+'hf_20260905_211857_996619a4-f007-43c7-b31c-2496f78c401b.mp3',
  '¡Guau! ¡Maracaibo!': AUDIO_BASE+'hf_20260905_211857_e2956d50-c260-4f45-a5cf-1c6f2709fc8d.mp3',
  '¡Guau! ¡Popo, popo!': AUDIO_BASE+'hf_20260905_211857_8ebe0a71-3cf2-48fc-bbf2-47d4507928ec.mp3',
  '¡Guau! ¡Un peo!': AUDIO_BASE+'hf_20260905_211955_8e62671c-ecec-4f2a-9844-c0cbeb193bf6.mp3',
  '¡Ahh, qué alivio! ¡Guau!': AUDIO_BASE+'hf_20260905_211955_ea90ddf1-d4c9-4ce5-8e56-9f0e7cf8ecdd.mp3',
  '¡Guau! ¡Un popo bebé!': AUDIO_BASE+'hf_20260905_211955_647ed8d5-d819-4e58-9739-a9f0aaa4bf07.mp3',
  '¡Guau! ¡Salté la rampa!': AUDIO_BASE+'hf_20260905_211920_4ba05236-6a51-4eac-acc8-131e4b4daeb6.mp3',
  '¡Guau! ¡Tesoro!': AUDIO_BASE+'hf_20260905_212032_e50b6e35-659e-4de1-996e-5bfeac696c10.mp3',
  '¡Guau, guau! ¡Soy Sheldon!': AUDIO_BASE+'hf_20260905_212112_5ee66fdb-b946-4e7c-8ba1-43e6e48ba54e.mp3',
};
CLIPS_PJ.srpopo = {
  '¡Extraterrestres! ¡Seguro hacen popo verde!': AUDIO_BASE+'hf_20260906_042418_902ada31-78b2-4ec6-9c99-79c96c1f0592.mp3',
  '¡Llegué a Marte! ¡El primer popo en Marte!': AUDIO_BASE+'hf_20260906_042246_9a0bb38f-6e74-4b87-9582-c589dcf6849d.mp3',
  '¿Para qué vamos a traer más chivos a Coro?': AUDIO_BASE+'hf_20260906_042017_ad924a89-f55a-450c-9993-aac249f3511f.mp3',
  '¡Mira para arriba! ¡Es el relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041849_d6972d13-39ad-408e-9ef8-c5bf69971441.mp3',
  '¡Qué molleja! ¡Se me hizo un nudo en la garganta… y en la barriga!': AUDIO_BASE+'hf_20260906_000219_8087f8b1-52ca-4468-8bb9-458c6afe8523.mp3',
  '¡El Señor Popo está listo!': AUDIO_BASE+'hf_20260905_212112_974f5448-7fb2-4ad5-89ae-abe686607d2f.mp3',
  '¡Un popo volador! ¡Increíble!': AUDIO_BASE+'hf_20260905_212032_1626c937-7d8f-4ef2-8152-3f2780344488.mp3',
  '¡Todos a bordo del barco popo!': AUDIO_BASE+'hf_20260905_212112_b1e6caf5-f0cc-40d1-af41-262a6ebf804f.mp3',
  '¡Un dinosaurio! ¡Seguro hace popos enormes!': AUDIO_BASE+'hf_20260905_212112_c78280fa-f52f-4834-8d26-1da7f2d9c12f.mp3',
  '¡Llegué a la luna! ¡El primer popo en la luna!': AUDIO_BASE+'hf_20260905_212224_16a94eae-032e-40f4-9d42-e6d1a988ef44.mp3',
  '¡Qué rica hamburguesa! ¡Vamos a hacer popo!': AUDIO_BASE+'hf_20260905_212151_a5e08679-30b5-4a40-8cd5-61f8a9136ed3.mp3',
  '¡Qué rica arepa de agüita de sapo!': AUDIO_BASE+'hf_20260905_212151_14488cad-86f2-47b5-ac90-a28a06695371.mp3',
  '¡Llegamos a Maracaibo!': AUDIO_BASE+'hf_20260905_212256_a0523590-9bcc-4837-a967-fc0425aa5ed3.mp3',
  '¡Quiero hacer popo! ¡Yo, el Señor Popo!': AUDIO_BASE+'hf_20260905_212224_bf9130c6-42c8-4651-a888-b6e14d548546.mp3',
  '¡Uy, un peo! ¡Qué orgullo!': AUDIO_BASE+'hf_20260905_212256_1e049a74-17ac-401b-8186-5ef697a1d51b.mp3',
  '¡Ahh, qué alivio!': AUDIO_BASE+'hf_20260905_212256_ba9db399-55f5-4c40-b8e3-8f393309df18.mp3',
  '¡Un popo bebé me sigue! ¡Es mi hijito!': AUDIO_BASE+'hf_20260905_212256_9d20a4e4-0e0d-4327-8874-91c50a990626.mp3',
  '¡Salté la rampa!': AUDIO_BASE+'hf_20260905_212331_373d3010-93b0-4190-a607-478451a695a4.mp3',
  '¡El tesoro! ¡Huele a popo!': AUDIO_BASE+'hf_20260905_212315_2c7a7e9c-67f7-4f45-8575-049313e84a44.mp3',
  '¡Hola! ¡Soy el Señor Popo!': AUDIO_BASE+'hf_20260905_212315_5a252880-5200-4f1b-83d2-920ec3b59c36.mp3',
};
let voces = [], reproductor = null, clipsListos = false, hablando = false, colaVoz = [], vozLog = [];
function cargarVoces(){ try{ voces = speechSynthesis.getVoices(); }catch(e){ voces = []; } }
if (EN_NAVEGADOR && typeof speechSynthesis !== 'undefined'){ cargarVoces(); speechSynthesis.onvoiceschanged = cargarVoces; }
function prepararClips(){
  /* iOS solo deja sonar audios tocados por el usuario: un único reproductor
     que se desbloquea con el primer toque y luego va cambiando de frase */
  if (clipsListos || typeof Audio === 'undefined') return;
  clipsListos = true;
  try{
    reproductor = new Audio();
    reproductor.preload = 'auto';
    reproductor.src = CLIPS['¡Pichunguito al ataque!'];
    if (reproductor.load) reproductor.load();
  }catch(e){ reproductor = null; }
}
function vozEspanola(){
  if (!voces.length) cargarVoces();
  const es = voces.filter(v=>v.lang && v.lang.toLowerCase().startsWith('es'));
  return es.find(v=>/es[-_](419|MX|US|CO|VE|AR|CL)/i.test(v.lang)) || es[0] || null;
}
/* Cola de diálogos: cada frase espera a que termine la anterior, sea mp3 o voz sintética */
function hablar(texto, pj){
  if (!EN_NAVEGADOR) return;
  const propio = pj && CLIPS_PJ[pj] && CLIPS_PJ[pj][texto];
  colaVoz.push({src: propio || CLIPS[texto] || null, texto, pj});
  vozLog.push({texto, pj: pj||'', propia: !!propio}); if (vozLog.length > 30) vozLog.shift();
  if (colaVoz.length > 3) colaVoz.shift();
  reproducirCola();
}
function reproducirCola(){
  if (hablando) return;
  const sig = colaVoz.shift();
  if (!sig) return;
  if (!sig.src || !reproductor){ hablarTTS(sig.texto, sig.pj); return; }
  try{
    hablando = true;
    let sono = false;
    const fallar = ()=>{
      if (sono) return; sono = true;
      try{ reproductor.pause(); }catch(e){}
      hablando = false; hablarTTS(sig.texto, sig.pj);
    };
    reproductor.onended = ()=>{ hablando = false; reproducirCola(); };
    reproductor.onerror = fallar;
    reproductor.onplaying = ()=>{ sono = true; };
    if (reproductor.src !== sig.src) reproductor.src = sig.src;
    else { try{ reproductor.currentTime = 0; }catch(e){} }
    const p = reproductor.play();
    if (p && p.catch) p.catch(fallar);
    setTimeout(()=>{ if(!sono) fallar(); }, 2000);
  }catch(e){ hablando = false; hablarTTS(sig.texto, sig.pj); }
}
const TONO_PJ = {
  fernando:{pitch:1.9, rate:1.05}, tiojuan:{pitch:0.6, rate:0.95}, luca:{pitch:1.7, rate:1.1}, salomon:{pitch:1.5, rate:1.1}, cucu:{pitch:1.9, rate:1.0},
  santi:{pitch:2.0, rate:0.9}, mama:{pitch:1.3, rate:1.0}, papa:{pitch:0.7, rate:1.0}, abu:{pitch:1.1, rate:0.85}, nacho:{pitch:0.85, rate:1.15},
  yanny:{pitch:1.45, rate:1.0}, tiofran:{pitch:0.65, rate:1.0}, romulo:{pitch:0.35, rate:0.8}, beto:{pitch:0.75, rate:1.0}, giuliana:{pitch:1.3, rate:1.05},
  penny:{pitch:1.6, rate:1.2}, sheldon:{pitch:0.9, rate:1.2}, srpopo:{pitch:0.5, rate:0.92},
};
function hablarTTS(texto, pj){
  if (typeof speechSynthesis === 'undefined'){ hablando = false; reproducirCola(); return; }
  try{
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-ES';
    const v = vozEspanola();
    if (v){ u.voice = v; u.lang = v.lang; }
    const t = (pj && TONO_PJ[pj]) || TONO_TTS[texto];
    u.pitch = t ? t.pitch : 1.9; u.rate = t ? t.rate : 1.05; u.volume = 1;
    hablando = true;
    let listo = false;
    const fin = ()=>{ if (listo) return; listo = true; hablando = false; reproducirCola(); };
    u.onend = fin; u.onerror = fin;
    setTimeout(fin, 1500 + texto.length*90);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }catch(e){ hablando = false; reproducirCola(); }
}

/* ============================================================
   NÚCLEO — no toca la pantalla
   ============================================================ */
const DT = 1/60, GRAV = 24;
const lerp = (a,b,t)=>a+(b-a)*t;
const clamp = (v,a,b)=>v<a?a:v>b?b:v;
const smooth = (a,b,x)=>{ const t = clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); };
const envolver = a=>{ while (a>Math.PI) a-=2*Math.PI; while (a<-Math.PI) a+=2*Math.PI; return a; };
/* ---- ¿qué mapa? 1 = la isla de día · 2 = Maracaibo de noche (con el Catatumbo, Coro, Marte y la nave extraterrestre) ---- */
const MAPA = (()=>{
  try{
    if (!EN_NAVEGADOR) return (typeof process !== 'undefined' && process.env && process.env.MAPA==='2') ? 2 : 1;
    const u = new URL(location.href).searchParams.get('mapa');
    if (u==='2') return 2; if (u==='1') return 1;
    return localStorage.getItem('aventura3d.mapa')==='2' ? 2 : 1;
  }catch(e){ return 1; }
})();
const NOCHE = MAPA===2;
let semilla = 20260904;
function azar(){ semilla = (Math.imul(semilla, 1103515245) + 12345) & 0x7fffffff; return semilla/0x7fffffff; }
/* ruido suave y determinista (el mismo en cada aparato) para las colinas */
function hash(i, j){
  let n = (Math.imul(i, 374761393) + Math.imul(j, 668265263)) | 0;
  n = Math.imul(n ^ (n>>>13), 1274126177); n ^= n>>>16;
  return (n>>>0)/4294967296;
}
function ruido(x, z){
  const i = Math.floor(x), j = Math.floor(z), u = x-i, v = z-j;
  const su = u*u*(3-2*u), sv = v*v*(3-2*v);
  return lerp(lerp(hash(i,j), hash(i+1,j), su), lerp(hash(i,j+1), hash(i+1,j+1), su), sv);
}
function fbm(x, z, oct){
  let a = 0, s = 0, f = 1, amp = 1;
  for (let o=0;o<oct;o++){ a += amp*ruido(x*f, z*f); s += amp; f *= 2.07; amp *= 0.5; }
  return a/s;
}

/* ---------------- La isla ----------------
   El mundo mide 1200 m de lado; la isla grande está en el centro, la islita
   de Santi al este, y todo lo demás es mar (hondo hacia afuera). */
const TAM = 1200, NSEG = 240, SEG = TAM/NSEG, MITAD = TAM/2, LIMITE = 590;
const R_ISLA = 300;
const ISLITA = {x:430, z:170};
const MARACAIBO = {x:-400, z:-300, r:110};   /* la isla de las arepas, al noroeste, unida por el puente */
const LUNA = {x:0, y:700, z:0, r:90};
const MONTANA = {x:-60, z:-200};
const PUEBLO = {x:20, z:70};
const FARO = {x:-270, z:-60};
const NIVEL_MAR = 0;
function alturaBase(x, z){
  const d0 = Math.hypot(x, z), a = Math.atan2(z, x);
  const d = d0 + 22*(fbm(Math.cos(a)*1.6+5.3, Math.sin(a)*1.6+2.7, 2)-0.5)*2;
  const m = 1 - smooth(R_ISLA-30, R_ISLA+50, d);
  const colinas = Math.max(-1.5, (fbm(x/95+3.1, z/95+9.7, 4)-0.45)*52);
  const dm = (x-MONTANA.x)*(x-MONTANA.x)+(z-MONTANA.z)*(z-MONTANA.z);
  const montana = 62*Math.exp(-dm/(95*95));
  let tierra = 2.5 + colinas*m*m + montana;
  const dp = (x-PUEBLO.x)*(x-PUEBLO.x)+(z-PUEBLO.z)*(z-PUEBLO.z);
  const gt = Math.min(1, 1.4*Math.exp(-dp/(130*130)));
  tierra = lerp(tierra, 4, gt);
  const df = (x-FARO.x)*(x-FARO.x)+(z-FARO.z)*(z-FARO.z);
  tierra += 9*Math.exp(-df/(22*22));                                  /* el peñón del faro */
  const mar = -10 - 24*smooth(R_ISLA+60, R_ISLA+220, d0) + 3*(ruido(x/40+1, z/40+1)-0.5);
  let h = lerp(mar, tierra, m);
  const d2 = Math.hypot(x-ISLITA.x, z-ISLITA.z);
  const m2 = 1 - smooth(14, 60, d2);
  h = lerp(h, -8 + 11*m2, m2);
  const d3 = Math.hypot(x-MARACAIBO.x, z-MARACAIBO.z);
  const m3 = 1 - smooth(70, 130, d3);
  h = lerp(h, 3.5 + 2.5*m3 + 4*m3*(ruido(x/50+8, z/50+2)-0.5), m3);
  return h;
}
const enMaracaibo = (x, z)=> Math.hypot(x-MARACAIBO.x, z-MARACAIBO.z) < MARACAIBO.r;

/* ---------------- La carretera ----------------
   Un lazo que da la vuelta a la isla, sube por la falda de la montaña y
   pasa junto al pueblo, la playa, el puerto y el aeropuerto. */
const RUTA_PTS = [[-40,182],[80,192],[160,160],[236,80],[240,-20],[190,-120],[60,-165],[-50,-125],[-165,-75],[-215,30],[-165,135]];
function catmull(p0,p1,p2,p3,t){ const t2=t*t, t3=t2*t; return 0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3); }
function muestrearLazo(pts, paso){
  const n = pts.length, densos = [];
  for (let i=0;i<n;i++){
    const p0=pts[(i-1+n)%n], p1=pts[i], p2=pts[(i+1)%n], p3=pts[(i+2)%n];
    const k = Math.max(4, Math.round(Math.hypot(p2[0]-p1[0], p2[1]-p1[1])*2));
    for (let j=0;j<k;j++){ const t=j/k; densos.push([catmull(p0[0],p1[0],p2[0],p3[0],t), catmull(p0[1],p1[1],p2[1],p3[1],t)]); }
  }
  /* se vuelve a muestrear cada 'paso' metros exactos */
  const M = []; let acum = 0, prox = 0;
  for (let i=0;i<densos.length;i++){
    const a = densos[i], b = densos[(i+1)%densos.length];
    const l = Math.hypot(b[0]-a[0], b[1]-a[1]);
    while (prox <= acum + l){
      const t = l>0 ? (prox-acum)/l : 0;
      M.push({x: lerp(a[0],b[0],t), z: lerp(a[1],b[1],t), s: prox});
      prox += paso;
    }
    acum += l;
  }
  const N = M.length;
  for (let i=0;i<N;i++){
    const a = M[(i-1+N)%N], b = M[(i+1)%N];
    let tx = b.x-a.x, tz = b.z-a.z; const l = Math.hypot(tx,tz)||1; tx/=l; tz/=l;
    M[i].tx = tx; M[i].tz = tz; M[i].nx = tz; M[i].nz = -tx;
  }
  return {M, N, L: acum, paso};
}
const RUTA = muestrearLazo(RUTA_PTS, 2);
RUTA.ancho = 10;
/* la altura de la carretera: la del terreno, pero muy suavizada, para que
   suba y baje sin baches */
{
  let h = RUTA.M.map(m=>alturaBase(m.x, m.z));
  for (let pasada=0; pasada<3; pasada++){
    const s = new Array(RUTA.N).fill(0);
    for (let i=0;i<RUTA.N;i++){ let acc=0; for (let k=-22;k<=22;k++) acc += h[(i+k+RUTA.N)%RUTA.N]; s[i] = acc/45; }
    h = s;
  }
  for (let i=0;i<RUTA.N;i++) RUTA.M[i].h = Math.max(h[i], 1.2);
}
function cercaRuta(x, z){
  /* primero a saltos grandes, luego se afina alrededor del mejor */
  let mejor = 0, md = Infinity;
  for (let i=0;i<RUTA.N;i+=4){ const m = RUTA.M[i], d = (m.x-x)*(m.x-x)+(m.z-z)*(m.z-z); if (d<md){ md=d; mejor=i; } }
  for (let k=-4;k<=4;k++){ const i=(mejor+k+RUTA.N)%RUTA.N, m=RUTA.M[i], d=(m.x-x)*(m.x-x)+(m.z-z)*(m.z-z); if (d<md){ md=d; mejor=i; } }
  const m = RUTA.M[mejor];
  return {i: mejor, d: Math.sqrt(md), lat: (x-m.x)*m.nx + (z-m.z)*m.nz, s: m.s};
}
function puntoRuta(s){ let i = Math.round(s/RUTA.paso) % RUTA.N; if (i<0) i += RUTA.N; return RUTA.M[i]; }

/* ---------------- La pista de aterrizaje ---------------- */
const PISTA = {x:205, z0:-70, z1:100, ancho:18, h: 0};
PISTA.h = Math.max(2.5, alturaBase(PISTA.x, (PISTA.z0+PISTA.z1)/2));
function distPista(x, z){
  const dz = z < PISTA.z0 ? PISTA.z0-z : z > PISTA.z1 ? z-PISTA.z1 : 0;
  return Math.hypot(x-PISTA.x, dz);
}

/* ---------------- Los solares planos ----------------
   Alrededor de cada casa, baño o taller el suelo se aplana para que nada
   quede colgando. Se llenan más abajo, cuando ya están todos los lugares. */
const SOLARES = [];
function solar(x, z, r, h){ SOLARES.push({x, z, r, h: h===undefined ? alturaBase(x,z) : h}); }

/* ---------------- La orilla ----------------
   Busca, en la dirección de un punto, dónde el terreno cruza el nivel del
   mar: así el muelle, la playa y las palmeras caen siempre en la orilla. */
function orilla(x, z){
  const a = Math.atan2(z, x);
  let d = 200;
  while (d < 420 && alturaBase(Math.cos(a)*d, Math.sin(a)*d) > 0.3) d += 1;
  return {x: Math.cos(a)*d, z: Math.sin(a)*d, ang: a, d};
}

/* ---------------- Los lugares de la isla ----------------
   Direcciones: ang=0 mira al sur (+z), π/2 al este (+x), π al norte (−z). */
const orillaPuerto = orilla(-150, 250);
const MUELLE = {x: orillaPuerto.x, z: orillaPuerto.z, ang: orillaPuerto.ang, largo: 40, ancho: 4, alto: 1.0};
MUELLE.x0 = MUELLE.x - Math.cos(MUELLE.ang)*6; MUELLE.z0 = MUELLE.z - Math.sin(MUELLE.ang)*6;
MUELLE.x1 = MUELLE.x + Math.cos(MUELLE.ang)*(MUELLE.largo-6); MUELLE.z1 = MUELLE.z + Math.sin(MUELLE.ang)*(MUELLE.largo-6);
function enMuelle(x, z){
  const dx = MUELLE.x1-MUELLE.x0, dz = MUELLE.z1-MUELLE.z0, l2 = dx*dx+dz*dz;
  const t = clamp(((x-MUELLE.x0)*dx + (z-MUELLE.z0)*dz)/l2, 0, 1);
  const px = MUELLE.x0 + dx*t, pz = MUELLE.z0 + dz*t;
  return Math.hypot(x-px, z-pz) <= MUELLE.ancho/2;
}
const orillaPlaya = orilla(30, 262);
const PLAYA = {x: orillaPlaya.x - Math.cos(orillaPlaya.ang)*14, z: orillaPlaya.z - Math.sin(orillaPlaya.ang)*14, ang: orillaPlaya.ang};

/* el puente sobre el lago: de la costa oeste a Maracaibo, alto para que pasen los barcos */
const PUENTE = (()=>{
  const ux = MARACAIBO.x/500, uz = MARACAIBO.z/500;
  const o = orilla(MARACAIBO.x, MARACAIBO.z);
  const x0 = o.x - ux*10, z0 = o.z - uz*10;
  let d = 0; while (d < 140 && alturaBase(MARACAIBO.x - ux*d, MARACAIBO.z - uz*d) > 0.3) d += 1;
  const x1 = MARACAIBO.x - ux*(d-10), z1 = MARACAIBO.z - uz*(d-10);
  const L = Math.hypot(x1-x0, z1-z0);
  const h0 = Math.max(1.5, alturaBase(x0 - ux*6, z0 - uz*6)), h1 = Math.max(1.5, alturaBase(x1 + ux*6, z1 + uz*6));
  return {x0, z0, x1, z1, L, ux:(x1-x0)/L, uz:(z1-z0)/L, ancho:10, alto:9, rampa:50, h0, h1};
})();
function enPuente(x, z){
  const dx = x-PUENTE.x0, dz = z-PUENTE.z0, t = dx*PUENTE.ux + dz*PUENTE.uz;
  if (t < 0 || t > PUENTE.L) return -1;
  const u = Math.abs(-dx*PUENTE.uz + dz*PUENTE.ux);
  return u <= PUENTE.ancho/2 ? t : -1;
}
/* el tablero: de la altura de una orilla a la de la otra, y nunca por debajo de 9 m en el medio */
function alturaPuente(t){ return Math.max(PUENTE.alto*clamp(Math.min(t, PUENTE.L-t)/PUENTE.rampa, 0, 1), lerp(PUENTE.h0, PUENTE.h1, clamp(t/PUENTE.L, 0, 1))); }

/* la rampa de la moto, sobre la recta del sur de la carretera */
const RAMPA = (()=>{
  const c = cercaRuta(20, 186), m = RUTA.M[c.i];
  return {x: m.x, z: m.z, tx: m.tx, tz: m.tz, nx: m.nx, nz: m.nz, largo: 18, ancho: 8, alto: 5.5, base: m.h,
          ang: Math.atan2(m.tx, m.tz)};
})();
function enRampa(x, z){
  const dx = x-RAMPA.x, dz = z-RAMPA.z;
  const t = dx*RAMPA.tx + dz*RAMPA.tz, u = dx*RAMPA.nx + dz*RAMPA.nz;
  if (t < 0 || t > RAMPA.largo || Math.abs(u) > RAMPA.ancho/2) return -1;
  return t;
}
RAMPA.aro = {x: RAMPA.x + RAMPA.tx*(RAMPA.largo+9), z: RAMPA.z + RAMPA.tz*(RAMPA.largo+9), y: RAMPA.base + RAMPA.alto + 2.2, r: 4.5};

/* los baños del Señor Popo (ang = hacia dónde mira la puerta) */
const banoMontana = (()=>{ const c = cercaRuta(-60,-120), m = RUTA.M[c.i]; return {x: m.x + m.nx*10, z: m.z + m.nz*10, ang: Math.atan2(-m.nx, -m.nz)}; })();
const BANOS = [
  {id:0, nombre:'el baño del pueblo',     x:66,  z:44,  ang:-Math.PI/2},
  {id:1, nombre:'el baño de la playa',    x:PLAYA.x+12, z:PLAYA.z-6, ang: PLAYA.ang+Math.PI/2},
  {id:2, nombre:'el baño de la montaña',  x:banoMontana.x, z:banoMontana.z, ang: banoMontana.ang},
  {id:3, nombre:'el baño del aeropuerto', x:230, z:62,  ang:-Math.PI/2},
  {id:4, nombre:'el baño de Maracaibo',   x:MARACAIBO.x+30, z:MARACAIBO.z-20, ang:Math.PI/2},
];
for (const b of BANOS){ b.px = b.x + Math.sin(b.ang)*1.9; b.pz = b.z + Math.cos(b.ang)*1.9; }

/* las casas del pueblo (cajas alineadas con los ejes; también son obstáculos) */
const CASAS = [
  {x:44,  z:14,  w:10, d:8, h:4.4, color:'#f6c453', techo:'#c0392b', nombre:'CASA DE FERNANDO', puerta:0},
  {x:-22, z:30,  w:9,  d:7, h:4.0, color:'#9bd1ff', techo:'#2a6ad0', nombre:'CASA DE ABU', puerta:0},
  {x:112, z:120, w:12, d:9, h:4.2, color:'#c39bd3', techo:'#5b2c6f', nombre:'BAR DE RÓMULO', letrero:'BAR', puerta:Math.PI},
  {x:100, z:164, w:9,  d:6, h:3.6, color:'#ffffff', techo:'#e63946', nombre:'GASOLINERA', gasolinera:true, puerta:0},
  {x:-44, z:82,  w:11, d:8, h:4.4, color:'#ffb347', techo:'#8b4513', nombre:'HAMBURGUESERÍA', letrero:'BURGER', puerta:Math.PI/2},
  {x:-10, z:8,   w:8,  d:7, h:3.8, color:'#a8e6a1', techo:'#2e7d32', nombre:'casa verde', puerta:0},
  {x:80,  z:10,  w:8,  d:7, h:3.8, color:'#ffd1dc', techo:'#ad1457', nombre:'casa rosada', puerta:0},
  {x:110, z:40,  w:9,  d:7, h:4.0, color:'#fff59d', techo:'#f57f17', nombre:'casa amarilla', puerta:-Math.PI/2},
  {x:-60, z:40,  w:8,  d:8, h:3.8, color:'#80deea', techo:'#006064', nombre:'casa celeste', puerta:Math.PI/2},
  {x:-70, z:120, w:9,  d:7, h:3.8, color:'#ffab91', techo:'#bf360c', nombre:'casa naranja', puerta:Math.PI/2},
  {x:70,  z:150, w:8,  d:7, h:3.8, color:'#b39ddb', techo:'#4527a0', nombre:'casa lila', puerta:Math.PI},
  {x:-10, z:160, w:9,  d:7, h:3.8, color:'#c5e1a5', techo:'#33691e', nombre:'casa verdecita', puerta:Math.PI},
];
const HANGAR = {x:228, z:-20, w:16, d:14, h:7};
const CASAS_MCBO = [
  {x:MARACAIBO.x-30, z:MARACAIBO.z-30, w:9, d:7, h:3.8, color:'#ff8a3d', techo:'#c0392b', nombre:'casa zuliana', puerta:0},
  {x:MARACAIBO.x+2,  z:MARACAIBO.z-40, w:10, d:7, h:4.0, color:'#7de0ff', techo:'#1a4a90', nombre:'AREPERA', letrero:'AREPAS', puerta:0},
  {x:MARACAIBO.x+34, z:MARACAIBO.z+8,  w:8, d:7, h:3.6, color:'#fff59d', techo:'#f57f17', nombre:'casa amarilla', puerta:-Math.PI/2},
  {x:MARACAIBO.x-34, z:MARACAIBO.z+18, w:9, d:8, h:3.8, color:'#c5e1a5', techo:'#33691e', nombre:'casa verde', puerta:Math.PI/2},
  {x:MARACAIBO.x-4,  z:MARACAIBO.z+36, w:9, d:7, h:3.8, color:'#f6c453', techo:'#8b4513', nombre:'casa gaitera', puerta:Math.PI},
];
const PLAZA_MCBO = {x:MARACAIBO.x, z:MARACAIBO.z-6};
const HELIPUERTOS = [
  {id:0, nombre:'la montaña',   x:MONTANA.x+4, z:MONTANA.z-6},
  {id:1, nombre:'el faro',      x:FARO.x+16, z:FARO.z+14},
  {id:2, nombre:'la islita',    x:ISLITA.x-2, z:ISLITA.z+12},
  {id:3, nombre:'Maracaibo',    x:MARACAIBO.x+28, z:MARACAIBO.z+34},
];
const BOYAS = [];
for (let i=0;i<6;i++){ const a = i/6*Math.PI*2 + 0.35; let r = 372; while (alturaBase(Math.cos(a)*r, Math.sin(a)*r) > -2.5 && r < 470) r += 5; BOYAS.push({id:i, x:Math.cos(a)*r, z:Math.sin(a)*r}); }
const HUEVOS = [];
for (const [cx,cz] of [[-120,-40],[-205,-25],[-40,-260],[120,-205],[255,-95],[-245,120],[70,-100],[-140,80]]){
  let x = cx, z = cz, k = 0; while (alturaBase(x, z) < 1.5 && k < 40){ x += (0-x)*0.05; z += (0-z)*0.05; k++; }
  HUEVOS.push({id:HUEVOS.length, x, z});
}
const CANCHA = {x:0, z:128, w:36, d:22};
const PARQUE = {x:90, z:66};
const FUENTE = {x:10, z:70, r:3.2};
const COFRE = {x:-120, z:-470};
/* el mapa 2: Coro con sus chivos, los aros de la noche para el pterodáctilo y la nave extraterrestre en el espacio */
const CORO = {x:150, z:-190, r:36};
const CHIVOS = [];
{ semilla = 1234; for (let i=0;i<8;i++){ const a = i/8*6.283 + azar()*0.5, r = 8 + azar()*22; let x = CORO.x + Math.cos(a)*r, z = CORO.z + Math.sin(a)*r; let k = 0; while (alturaBase(x, z) < 1.5 && k < 30){ x += (CORO.x-x)*0.1; z += (CORO.z-z)*0.1; k++; } CHIVOS.push({id:i, x, z, ang: azar()*6.283}); } }
const AROS_NOCHE = [
  {x:-20, z:-60, y:34}, {x:-120, z:-150, y:48}, {x:-240, z:-40, y:60}, {x:-150, z:120, y:56}, {x:30, z:210, y:44}, {x:150, z:60, y:38},
];
for (const a of AROS_NOCHE) a.r = 7;
const OVNI = {x:170, y:540, z:-140, r:24};
const AROS = [
  {x:205, z:-170, y:42}, {x:120, z:-290, y:62}, {x:-30, z:-330, y:84}, {x:-190, z:-260, y:96},
  {x:-280, z:-80, y:82}, {x:-190, z:140, y:66}, {x:-10, z:290, y:50},
];
for (const a of AROS) a.r = 6;
const BANDERAS = [];
for (let i=0;i<6;i++){ const m = puntoRuta((i+0.5)*RUTA.L/6); BANDERAS.push({id:i, x:m.x, z:m.z, tx:m.tx, tz:m.tz, nx:m.nx, nz:m.nz, s:m.s}); }
const VEHICULOS_DEF = [
  {id:'carro', nombre:'el carro',      emoji:'🚗', x:100, z:177, ang:1.95, radio:2.2},
  {id:'heli',  nombre:'el helicóptero', emoji:'🚁', x:236, z:8, ang:-Math.PI/2, radio:2.6, vuela:true},
  {id:'motoagua', nombre:'la moto de agua', emoji:'🛥️', x:MUELLE.x0 + Math.cos(MUELLE.ang)*34 + Math.sin(MUELLE.ang)*5.5, z:MUELLE.z0 + Math.sin(MUELLE.ang)*34 - Math.cos(MUELLE.ang)*5.5, ang:Math.atan2(Math.cos(MUELLE.ang), Math.sin(MUELLE.ang)), radio:1.6, agua:true},
  {id:'nave',  nombre:'la nave espacial', emoji:'🚀', x:186, z:-56, ang:Math.PI, radio:2.4, vuela:true},
  {id:'dino',  nombre:'el dinosaurio', emoji:'🦖', x:-40, z:-60, ang:Math.PI/2, radio:1.6, aplasta:true},
  ...(MAPA===2 ? [{id:'ptero', nombre:'el pterodáctilo', emoji:'🦅', x:-72, z:-34, ang:Math.PI/2, radio:2.2, vuela:true}] : []),
  {id:'moto',  nombre:'la moto',       emoji:'🏍️', x:RAMPA.x - RAMPA.tx*70, z:RAMPA.z - RAMPA.tz*70, ang:RAMPA.ang, radio:1.2},
  {id:'avion', nombre:'el avión',      emoji:'✈️', x:PISTA.x, z:70, ang:Math.PI, radio:3},
  {id:'barco', nombre:'el barco',      emoji:'🚤', x:MUELLE.x0 + Math.cos(MUELLE.ang)*26 + Math.sin(MUELLE.ang)*5.5, z:MUELLE.z0 + Math.sin(MUELLE.ang)*26 - Math.cos(MUELLE.ang)*5.5, ang:Math.atan2(Math.cos(MUELLE.ang), Math.sin(MUELLE.ang)), radio:2.6},
  {id:'sub',   nombre:'el submarino',  emoji:'🤿', x:MUELLE.x0 + Math.cos(MUELLE.ang)*26 - Math.sin(MUELLE.ang)*5.5, z:MUELLE.z0 + Math.sin(MUELLE.ang)*26 + Math.cos(MUELLE.ang)*5.5, ang:Math.atan2(Math.cos(MUELLE.ang), Math.sin(MUELLE.ang)), radio:2.4},
];
/* la familia: dónde está cada quien y qué dice Fernando al saludarlo */
const FAMILIA = [
  {id:'abu',      nombre:'Abu',          x:-22, z:38,  ang:0,           frase:'Te amo Abu'},
  {id:'cucu',     nombre:'Cucú',         x:PARQUE.x+6, z:PARQUE.z+4, ang:-Math.PI/2, frase:'Hola Cucú, acompáñame'},
  {id:'luca',     nombre:'Luca',         x:-8,  z:128, ang:Math.PI/2,   frase:'¡Luca! ¡Mi amigo pichunguito!'},
  {id:'salomon',  nombre:'Salomón',      x:8,   z:128, ang:-Math.PI/2,  frase:'¡Salomón! ¡Juega conmigo, pichunguito!'},
  {id:'tiofran',  nombre:'Tío Fran',     x:PLAYA.x, z:PLAYA.z, ang:PLAYA.ang+Math.PI, frase:'¡Qué pedo tan grande, tío Fran!', pedo:true},
  {id:'mama',     nombre:'Mamá',         x:38,  z:22,  ang:0,           frase:'¡Te amo mamá!'},
  {id:'papa',     nombre:'Papá',         x:50,  z:22,  ang:0,           frase:'¡Papá, mira cómo salto de alto!'},
  {id:'nacho',    nombre:'Tío Nacho',    x:216, z:-10, ang:-Math.PI/2,  frase:'¡Épale! ¡Aquí viene tío Nacho!'},
  {id:'yanny',    nombre:'Tía Yanny',    x:MUELLE.x0 - Math.cos(MUELLE.ang)*4 + Math.sin(MUELLE.ang)*3, z:MUELLE.z0 - Math.sin(MUELLE.ang)*4 - Math.cos(MUELLE.ang)*3, ang:MUELLE.ang, frase:'¡Hola mi amor! ¡Soy tía Yanny!'},
  {id:'romulo',   nombre:'Rómulo',       x:112, z:112, ang:Math.PI,     frase:'¡Brrrp! ¡Qué rica cerveza! ¡Ay, qué pena!', eructo:true},
  {id:'beto',     nombre:'Tío Beto',     x:92,  z:171, ang:0,           frase:'¡Hola pichunguito! ¡Soy tío Beto!'},
  {id:'giuliana', nombre:'Tía Giuliana', x:FARO.x+6, z:FARO.z+4, ang:Math.PI/2, frase:'¡Un abrazo, pichunguito! ¡Soy tía Giuliana!'},
  {id:'santi',    nombre:'Santi',        x:ISLITA.x, z:ISLITA.z, ang:-Math.PI/2, frase:'Te amo Santi, mi hermanito', bebe:true},
];
const porId = id => FAMILIA.find(c=>c.id===id);
/* ---- El paquete de diálogos de cada personaje: la misma situación, la frase de cada uno.
   Fernando saluda a cada familiar con su frase de FAMILIA (saludo: null). ---- */
const CLAVES_DIALOGO = ['inicio', 'volar', 'barco', 'dino', 'luna', 'hamburguesa', 'arepa', 'maracaibo', 'ganas', 'peo', 'alivio', 'popito', 'rampa', 'tesoro', 'puente', 'saludo', 'catatumbo', 'coro', 'marte', 'extraterrestres'];
const DIALOGOS = {
  fernando: {inicio: '¡Pichunguito al ataque!', volar: '¡A volar, pichunguitos!', barco: '¡Todos a bordo del barco pichunguito!', dino: '¡Vamos, dinosaurio!', luna: '¡Llegué a la luna!', hamburguesa: '¡Qué rica hamburguesa!', arepa: '¡Qué rica arepita de agüita de sapo!', maracaibo: '¡Llegamos a Maracaibo!', ganas: '¡Quiero hacer popo!', peo: '¡Uy, me eché un peo!', alivio: '¡Ahh, qué alivio!', popito: '¡Mira, un popo bebé me sigue!', rampa: '¡Salté la rampa!', tesoro: '¡Tesoro! ¡Encontré el tesoro!', puente: '¡Qué molleja! ¡Se me hizo un nudo en la garganta!', saludo: null, catatumbo: '¡Mira para arriba! ¡Es el relámpago del Catatumbo!', coro: '¿Para qué vamos a traer más chivos a Coro?', marte: '¡Llegué a Marte!', extraterrestres: '¡Extraterrestres! ¡Hola, amiguitos del espacio!'},
  tiojuan: {inicio: '¡Tío Juan al rescate!', volar: '¡Arriba, arriba! ¡Tío Juan vuela!', barco: '¡Capitán tío Juan al mando!', dino: '¡Un dinosaurio! ¡Qué bestia tan bonita!', luna: '¡Llegué a la luna, pichunguito!', hamburguesa: '¡Mmm, qué rica hamburguesa!', arepa: '¡Qué rica arepita de agüita de sapo, pichunguito!', maracaibo: '¡Maracaibo, tierra del sol amada!', ganas: '¡Ay, ay! ¡Necesito un baño ya!', peo: '¡Perdón! ¡Se me escapó un peo!', alivio: '¡Ahh, qué alivio tan grande!', popito: '¡Mira, un popo bebé me sigue!', rampa: '¡Salté la rampa como un superhéroe!', tesoro: '¡El tesoro es nuestro, pichunguito!', puente: '¡Qué molleja de puente! ¡Se me hizo un nudo en la garganta, pichunguito!', saludo: '¡Hola, familia! ¡Un abrazo de tío Juan!', catatumbo: '¡Mira para arriba, pichunguito! ¡Es el relámpago del Catatumbo!', coro: '¿Para qué vamos a traer más chivos a Coro, pichunguito?', marte: '¡Llegué a Marte, pichunguito!', extraterrestres: '¡Extraterrestres! ¡Un abrazo desde la Tierra, pichunguitos!'},
  luca: {inicio: '¡Luca al ataque!', volar: '¡Estoy volando! ¡Mírame!', barco: '¡Zarpamos! ¡Todos a bordo!', dino: '¡Arre, dinosaurio, arre!', luna: '¡Llegué a la luna! ¡Qué chévere!', hamburguesa: '¡Ñam! ¡Qué rica hamburguesa!', arepa: '¡Qué rica arepa de agüita de sapo!', maracaibo: '¡Llegamos a Maracaibo!', ganas: '¡Quiero hacer popo!', peo: '¡Uy! ¡Me eché un peo!', alivio: '¡Ahh, qué alivio!', popito: '¡Un popo bebé me sigue!', rampa: '¡Salté la rampa!', tesoro: '¡Encontré el tesoro!', puente: '¡Qué molleja! ¡Se me hizo un nudo en la garganta!', saludo: '¡Hola! ¡Soy Luca, el amigo de Fernando!', catatumbo: '¡Mira para arriba! ¡El relámpago del Catatumbo!', coro: '¿Para qué vamos a traer más chivos a Coro?', marte: '¡Llegué a Marte! ¡Qué chévere!', extraterrestres: '¡Extraterrestres! ¡Hola, amigos del espacio!'},
  salomon: {inicio: '¡Salomón en la casa!', volar: '¡Volando con estilo!', barco: '¡Al agua, marineros!', dino: '¡Dinosaurio, tú y yo somos un equipo!', luna: '¡La luna! ¡Qué genial!', hamburguesa: '¡Esta hamburguesa está brutal!', arepa: '¡Arepa de agüita de sapo, la mejor!', maracaibo: '¡Maracaibo, aquí estoy!', ganas: '¡Uy, uy! ¡Quiero hacer popo!', peo: '¡Ups, se me escapó un peo!', alivio: '¡Ahh, qué alivio!', popito: '¡Ja! ¡Un popo bebé me sigue!', rampa: '¡Salté la rampa con estilo!', tesoro: '¡El tesoro! ¡Somos ricos!', puente: '¡Qué molleja! ¡Se me hizo un nudo en la garganta, primo!', saludo: '¡Hola! ¡Salomón quiere jugar!', catatumbo: '¡Mira para arriba, primo! ¡Es el relámpago del Catatumbo!', coro: '¿Para qué vamos a traer más chivos a Coro, primo?', marte: '¡Marte! ¡Qué genial, primo!', extraterrestres: '¡Extraterrestres! ¡Qué genial, primo!'},
  cucu: {inicio: '¡Cucú! ¡Aquí estoy!', volar: '¡Estoy volando como un pajarito!', barco: '¡Vamos a navegar!', dino: '¡Qué dinosaurio tan lindo!', luna: '¡Llegué a la luna! ¡Hola, estrellitas!', hamburguesa: '¡Qué rica hamburguesa!', arepa: '¡Qué rica arepita de agüita de sapo!', maracaibo: '¡Llegamos a Maracaibo!', ganas: '¡Quiero hacer popo!', peo: '¡Ay, me eché un peo!', alivio: '¡Ahh, qué alivio!', popito: '¡Un popo bebé me sigue! ¡Qué tierno!', rampa: '¡Salté la rampa!', tesoro: '¡Encontré el tesoro!', puente: '¡Ay, qué molleja! ¡Se me hizo un nudo en la garganta!', saludo: '¡Hola! ¡Soy Cucú! ¿Jugamos?', catatumbo: '¡Mira para arriba! ¡Es el relámpago del Catatumbo! ¡Qué lindo!', coro: '¿Para qué vamos a traer más chivos a Coro? ¡Ya hay muchos!', marte: '¡Llegué a Marte! ¡Hola, planeta rojo!', extraterrestres: '¡Extraterrestres! ¡Son muy lindos!'},
  santi: {inicio: '¡Tati al ataque!', volar: '¡A volar! ¡Uuuh!', barco: '¡Barquito, barquito!', dino: '¡Dino grande!', luna: '¡La luna! ¡Qué bonita!', hamburguesa: '¡Ñam, ñam! ¡Rica!', arepa: '¡Arepita rica!', maracaibo: '¡Maracaibo!', ganas: '¡Popó! ¡Quiero popó!', peo: '¡Jiji, un peo!', alivio: '¡Ahh, qué rico!', popito: '¡Popó bebé! ¡Amiguito!', rampa: '¡Salté! ¡Salté!', tesoro: '¡Tesoro! ¡Brilla!', puente: '¡Qué molleja! ¡Un nudo en la garganta!', saludo: '¡Hola! ¡Soy Santi!', catatumbo: '¡Arriba! ¡Relámpago!', coro: '¿Pa qué más chivos a Coro?', marte: '¡Marte! ¡Rojo!', extraterrestres: '¡Marcianitos! ¡Hola!'},
  mama: {inicio: '¡Mamá está lista! ¡Vamos, mis amores!', volar: '¡Estoy volando! ¡Sujétense bien!', barco: '¡Todos a bordo, mis amores!', dino: '¡Un dinosaurio! ¡Qué aventura!', luna: '¡Llegué a la luna! ¡No lo puedo creer!', hamburguesa: '¡Qué rica hamburguesa!', arepa: '¡Qué rica arepita de agüita de sapo!', maracaibo: '¡Llegamos a Maracaibo, mi tierra!', ganas: '¡Ay, necesito un baño ahora mismo!', peo: '¡Ay, qué pena! ¡Se me escapó un peo!', alivio: '¡Ahh, qué alivio!', popito: '¡Miren, un popo bebé me sigue!', rampa: '¡Salté la rampa! ¡Qué susto!', tesoro: '¡Encontré el tesoro!', puente: '¡Qué molleja, mis amores! ¡Se me hizo un nudo en la garganta!', saludo: '¡Hola, mi amor! ¡Mamá te quiere mucho!', catatumbo: '¡Miren para arriba, mis amores! ¡Es el relámpago del Catatumbo!', coro: '¿Para qué vamos a traer más chivos a Coro, mis amores?', marte: '¡Llegué a Marte! ¡No lo puedo creer!', extraterrestres: '¡Extraterrestres! ¡Hola, mis amores del espacio!'},
  papa: {inicio: '¡Papá al volante!', volar: '¡Papá vuela alto!', barco: '¡Capitán papá al mando!', dino: '¡Un dinosaurio! ¡Esto sí es una aventura!', luna: '¡Llegué a la luna! ¡Increíble!', hamburguesa: '¡Qué rica hamburguesa!', arepa: '¡Qué rica arepa de agüita de sapo!', maracaibo: '¡Llegamos a Maracaibo!', ganas: '¡Uy, tengo que ir al baño!', peo: '¡Perdón! ¡Fue un peo!', alivio: '¡Ahh, qué alivio!', popito: '¡Un popo bebé me sigue!', rampa: '¡Salté la rampa! ¡Qué salto!', tesoro: '¡El tesoro! ¡Lo encontramos!', puente: '¡Qué molleja de puente! ¡Se me hizo un nudo en la garganta!', saludo: '¡Hola, campeón! ¡Papá está aquí!', catatumbo: '¡Mira para arriba! ¡Es el relámpago del Catatumbo!', coro: '¿Para qué vamos a traer más chivos a Coro?', marte: '¡Llegué a Marte! ¡Increíble!', extraterrestres: '¡Extraterrestres! ¡Hola, amigos del espacio!'},
  abu: {inicio: '¡Abu está lista, mis niños!', volar: '¡Ay, Dios mío, estoy volando!', barco: '¡Vamos a navegar, mis amores!', dino: '¡Ay, un dinosaurio! ¡Qué grande!', luna: '¡Llegué a la luna! ¡Quién lo diría!', hamburguesa: '¡Qué rica hamburguesa!', arepa: '¡Qué rica arepita de agüita de sapo!', maracaibo: '¡Maracaibo! ¡Qué calor tan sabroso!', ganas: '¡Ay, necesito un bañito!', peo: '¡Ay, qué pena! ¡Un peíto!', alivio: '¡Ahh, qué alivio, mi amor!', popito: '¡Miren, un popo bebé me sigue!', rampa: '¡Salté la rampa! ¡Ay, mi corazón!', tesoro: '¡Encontré el tesoro!', puente: '¡Ay, qué molleja! ¡Se me hizo un nudo en la garganta, mi cielo!', saludo: '¡Hola, mi cielo! ¡Abu te quiere!', catatumbo: '¡Ay, mira para arriba, mi cielo! ¡Es el relámpago del Catatumbo!', coro: '¡Ay, mi cielo! ¿Para qué vamos a traer más chivos a Coro?', marte: '¡Llegué a Marte! ¡Quién lo diría, mi cielo!', extraterrestres: '¡Ay, extraterrestres! ¡Hola, mis cielos del espacio!'},
  nacho: {inicio: '¡Épale! ¡Tío Nacho llegó!', volar: '¡Épale, estoy volando!', barco: '¡Todos a bordo con tío Nacho!', dino: '¡Épale, un dinosaurio!', luna: '¡Épale! ¡Llegué a la luna!', hamburguesa: '¡Épale, qué rica hamburguesa!', arepa: '¡Épale, qué rica arepa de agüita de sapo!', maracaibo: '¡Llegamos a Maracaibo, épale!', ganas: '¡Épale, quiero hacer popo!', peo: '¡Épale! ¡Se me escapó un peo!', alivio: '¡Ahh, qué alivio!', popito: '¡Épale, un popo bebé me sigue!', rampa: '¡Épale, salté la rampa!', tesoro: '¡Épale, el tesoro!', puente: '¡Épale, qué molleja! ¡Se me hizo un nudo en la garganta!', saludo: '¡Épale! ¡Aquí viene tío Nacho!', catatumbo: '¡Épale, mira para arriba! ¡Es el relámpago del Catatumbo!', coro: '¡Épale! ¿Para qué vamos a traer más chivos a Coro?', marte: '¡Épale! ¡Llegué a Marte!', extraterrestres: '¡Épale! ¡Extraterrestres!'},
  yanny: {inicio: '¡Hola mi amor! ¡Tía Yanny está lista!', volar: '¡Estoy volando, mi amor!', barco: '¡Todos a bordo, mis amores!', dino: '¡Un dinosaurio! ¡Qué lindo!', luna: '¡Llegué a la luna, mi amor!', hamburguesa: '¡Qué rica hamburguesa!', arepa: '¡Qué rica arepita de agüita de sapo!', maracaibo: '¡Llegamos a Maracaibo!', ganas: '¡Ay, quiero hacer popo!', peo: '¡Ay, mi amor, me eché un peo!', alivio: '¡Ahh, qué alivio!', popito: '¡Un popo bebé me sigue!', rampa: '¡Salté la rampa!', tesoro: '¡Encontré el tesoro!', puente: '¡Qué molleja, mi amor! ¡Se me hizo un nudo en la garganta!', saludo: '¡Hola mi amor! ¡Soy tía Yanny!', catatumbo: '¡Mira para arriba, mi amor! ¡Es el relámpago del Catatumbo!', coro: '¿Para qué vamos a traer más chivos a Coro, mi amor?', marte: '¡Llegué a Marte, mi amor!', extraterrestres: '¡Extraterrestres! ¡Hola, mis amores!'},
  tiofran: {inicio: '¡Tío Fran llegó! ¡Cuidado con mis peos!', volar: '¡Volando a pura fuerza de peo!', barco: '¡Todos a bordo! ¡Y abran las ventanas!', dino: '¡Un dinosaurio! ¡A ver quién se tira el peo más grande!', luna: '¡Llegué a la luna! ¡Mi peo me trajo hasta aquí!', hamburguesa: '¡Qué rica hamburguesa! ¡Ya viene el peo!', arepa: '¡Qué rica arepa de agüita de sapo!', maracaibo: '¡Llegamos a Maracaibo!', ganas: '¡Quiero hacer popo! ¡Y no es broma!', peo: '¡Prrrr! ¡Ese sí fue grande!', alivio: '¡Ahh, qué alivio!', popito: '¡Un popo bebé me sigue!', rampa: '¡Salté la rampa!', tesoro: '¡El tesoro! ¡Y huele a peo!', puente: '¡Qué molleja! ¡Se me hizo un nudo en la garganta… y un peo del susto!', saludo: '¡Hola! ¡Soy tío Fran! ¡Prrrr!', catatumbo: '¡Mira para arriba! ¡Es el relámpago del Catatumbo! ¿O fue mi peo?', coro: '¿Para qué vamos a traer más chivos a Coro? ¡Prrrr!', marte: '¡Llegué a Marte! ¡Mi peo me trajo hasta aquí!', extraterrestres: '¡Extraterrestres! ¡A ver quién se tira el peo más grande!'},
  romulo: {inicio: '¡Rómulo el mapache está listo!', volar: '¡Estoy volando! ¡Brrrp!', barco: '¡Al barco! ¡Brrrp!', dino: '¡Un dinosaurio! ¡Ay, qué pena!', luna: '¡Llegué a la luna! ¡Brrrp! ¡Ay, qué pena!', hamburguesa: '¡Qué rica hamburguesa! ¡Brrrp!', arepa: '¡Qué rica arepa! ¡Brrrp! ¡Ay, qué pena!', maracaibo: '¡Llegamos a Maracaibo!', ganas: '¡Quiero hacer popo! ¡Ay, qué pena!', peo: '¡Brrrp! ¡No, eso fue un peo! ¡Ay, qué pena!', alivio: '¡Ahh, qué alivio!', popito: '¡Un popo bebé me sigue!', rampa: '¡Salté la rampa!', tesoro: '¡El tesoro! ¡Brrrp!', puente: '¡Qué molleja! ¡Se me hizo un nudo en la garganta! ¡Brrrp! ¡Ay, qué pena!', saludo: '¡Hola! ¡Brrrp! ¡Ay, qué pena!', catatumbo: '¡Mira para arriba! ¡El relámpago del Catatumbo! ¡Brrrp!', coro: '¿Para qué vamos a traer más chivos a Coro? ¡Brrrp!', marte: '¡Llegué a Marte! ¡Brrrp! ¡Ay, qué pena!', extraterrestres: '¡Extraterrestres! ¡Brrrp! ¡Ay, qué pena!'},
  beto: {inicio: '¡Tío Beto está listo, pichunguito!', volar: '¡Estoy volando!', barco: '¡Todos a bordo con tío Beto!', dino: '¡Un dinosaurio! ¡Qué maravilla!', luna: '¡Llegué a la luna!', hamburguesa: '¡Qué rica hamburguesa!', arepa: '¡Qué rica arepa de agüita de sapo!', maracaibo: '¡Llegamos a Maracaibo!', ganas: '¡Quiero hacer popo!', peo: '¡Uy, me eché un peo!', alivio: '¡Ahh, qué alivio!', popito: '¡Un popo bebé me sigue!', rampa: '¡Salté la rampa!', tesoro: '¡Encontré el tesoro!', puente: '¡Qué molleja, pichunguito! ¡Se me hizo un nudo en la garganta!', saludo: '¡Hola pichunguito! ¡Soy tío Beto!', catatumbo: '¡Mira para arriba, pichunguito! ¡Es el relámpago del Catatumbo!', coro: '¿Para qué vamos a traer más chivos a Coro, pichunguito?', marte: '¡Llegué a Marte, pichunguito!', extraterrestres: '¡Extraterrestres! ¡Hola, amigos del espacio!'},
  giuliana: {inicio: '¡Tía Giuliana está lista!', volar: '¡Estoy volando! ¡Qué emoción!', barco: '¡Todos a bordo!', dino: '¡Un dinosaurio! ¡Un abrazo, dinosaurio!', luna: '¡Llegué a la luna!', hamburguesa: '¡Qué rica hamburguesa!', arepa: '¡Qué rica arepita de agüita de sapo!', maracaibo: '¡Llegamos a Maracaibo!', ganas: '¡Quiero hacer popo!', peo: '¡Ay, me eché un peo!', alivio: '¡Ahh, qué alivio!', popito: '¡Un popo bebé me sigue!', rampa: '¡Salté la rampa!', tesoro: '¡Encontré el tesoro!', puente: '¡Qué molleja! ¡Se me hizo un nudo en la garganta!', saludo: '¡Un abrazo, pichunguito! ¡Soy tía Giuliana!', catatumbo: '¡Mira para arriba! ¡Es el relámpago del Catatumbo!', coro: '¿Para qué vamos a traer más chivos a Coro?', marte: '¡Llegué a Marte! ¡Un abrazo, planeta rojo!', extraterrestres: '¡Extraterrestres! ¡Un abrazo, amigos del espacio!'},
  penny: {inicio: '¡Guau! ¡Penny al ataque!', volar: '¡Guau! ¡Un perrito volador!', barco: '¡Guau! ¡Todos a bordo!', dino: '¡Guau, guau! ¡Un dinosaurio!', luna: '¡Guau! ¡Llegué a la luna!', hamburguesa: '¡Guau! ¡Qué rica hamburguesa!', arepa: '¡Guau! ¡Qué rica arepa!', maracaibo: '¡Guau! ¡Llegamos a Maracaibo!', ganas: '¡Guau! ¡Quiero hacer popo!', peo: '¡Guau! ¡Me eché un peo!', alivio: '¡Ahh, qué alivio! ¡Guau!', popito: '¡Guau! ¡Un popo bebé me sigue!', rampa: '¡Guau! ¡Salté la rampa!', tesoro: '¡Guau! ¡El tesoro!', puente: '¡Guau! ¡Qué molleja! ¡Se me hizo un nudo en la garganta!', saludo: '¡Guau, guau! ¡Soy Penny!', catatumbo: '¡Guau! ¡Mira para arriba! ¡El relámpago del Catatumbo!', coro: '¡Guau! ¿Para qué vamos a traer más chivos a Coro?', marte: '¡Guau! ¡Llegué a Marte!', extraterrestres: '¡Guau! ¡Extraterrestres!'},
  sheldon: {inicio: '¡Guau! ¡Sheldon al ataque!', volar: '¡Guau! ¡Sheldon vuela!', barco: '¡Guau! ¡Al barco!', dino: '¡Guau, guau! ¡Un dinosaurio grande!', luna: '¡Guau! ¡La luna!', hamburguesa: '¡Guau! ¡Hamburguesa rica!', arepa: '¡Guau! ¡Arepa rica!', maracaibo: '¡Guau! ¡Maracaibo!', ganas: '¡Guau! ¡Popo, popo!', peo: '¡Guau! ¡Un peo!', alivio: '¡Ahh, qué alivio! ¡Guau!', popito: '¡Guau! ¡Un popo bebé!', rampa: '¡Guau! ¡Salté la rampa!', tesoro: '¡Guau! ¡Tesoro!', puente: '¡Guau, guau! ¡Qué molleja! ¡Un nudo en la garganta!', saludo: '¡Guau, guau! ¡Soy Sheldon!', catatumbo: '¡Guau, guau! ¡Arriba! ¡El relámpago del Catatumbo!', coro: '¡Guau, guau! ¿Más chivos a Coro?', marte: '¡Guau! ¡Marte!', extraterrestres: '¡Guau, guau! ¡Marcianitos!'},
  srpopo: {inicio: '¡El Señor Popo está listo!', volar: '¡Un popo volador! ¡Increíble!', barco: '¡Todos a bordo del barco popo!', dino: '¡Un dinosaurio! ¡Seguro hace popos enormes!', luna: '¡Llegué a la luna! ¡El primer popo en la luna!', hamburguesa: '¡Qué rica hamburguesa! ¡Vamos a hacer popo!', arepa: '¡Qué rica arepa de agüita de sapo!', maracaibo: '¡Llegamos a Maracaibo!', ganas: '¡Quiero hacer popo! ¡Yo, el Señor Popo!', peo: '¡Uy, un peo! ¡Qué orgullo!', alivio: '¡Ahh, qué alivio!', popito: '¡Un popo bebé me sigue! ¡Es mi hijito!', rampa: '¡Salté la rampa!', tesoro: '¡El tesoro! ¡Huele a popo!', puente: '¡Qué molleja! ¡Se me hizo un nudo en la garganta… y en la barriga!', saludo: '¡Hola! ¡Soy el Señor Popo!', catatumbo: '¡Mira para arriba! ¡Es el relámpago del Catatumbo!', coro: '¿Para qué vamos a traer más chivos a Coro?', marte: '¡Llegué a Marte! ¡El primer popo en Marte!', extraterrestres: '¡Extraterrestres! ¡Seguro hacen popo verde!'},
};
function fraseDe(pj, k, id){
  const paq = DIALOGOS[pj] || DIALOGOS.fernando;
  if (k==='saludo' && (!paq.saludo || pj==='fernando')){ const f = porId(id); return f ? f.frase : DIALOGOS.tiojuan.saludo; }
  return paq[k] || DIALOGOS.fernando[k] || '';
}
function nombreDe(pj){ const p = PERSONAJES_RED.find(q=>q.id===pj); return p ? p.nombre : 'Fernando'; }
/* el jugador dice la frase de su personaje para la situación k */
function decir(P, k, id){ evento(P, 'hablar', {texto: fraseDe(P.pj, k, id), quien: nombreDe(P.pj), k, id, pj: P.pj}); }

const PERROS_DEF = [
  {id:'penny',   nombre:'Penny',   color:'#222222', x:36, z:30},
  {id:'sheldon', nombre:'Sheldon', color:'#8a5a2a', x:52, z:30},
];
const INICIO = {x:44, z:28, ang:0};

/* los solares planos: casas, hangar, faro, baños, muelle, cancha y parque */
for (const c of CASAS) solar(c.x, c.z, Math.max(c.w,c.d)/2+3);
solar(HANGAR.x, HANGAR.z, 12, PISTA.h); solar(FARO.x, FARO.z, 9); solar(CANCHA.x, CANCHA.z, 24); solar(PARQUE.x, PARQUE.z, 12);
solar(FUENTE.x, FUENTE.z, 8);
for (const b of BANOS) solar(b.x, b.z, 5);
for (const c of CASAS_MCBO) solar(c.x, c.z, Math.max(c.w,c.d)/2+3);
solar(PLAZA_MCBO.x, PLAZA_MCBO.z, 10);
for (const h of HELIPUERTOS) solar(h.x, h.z, 8);
solar(186, -56, 9, PISTA.h); solar(-40, -60, 9);
solar(PUENTE.x0 - PUENTE.ux*6, PUENTE.z0 - PUENTE.uz*6, 9, Math.max(1.5, alturaBase(PUENTE.x0 - PUENTE.ux*6, PUENTE.z0 - PUENTE.uz*6)));
solar(PUENTE.x1 + PUENTE.ux*6, PUENTE.z1 + PUENTE.uz*6, 9, Math.max(1.5, alturaBase(PUENTE.x1 + PUENTE.ux*6, PUENTE.z1 + PUENTE.uz*6)));
for (const h of HELIPUERTOS) h.y = 0;
solar(MUELLE.x0 - Math.cos(MUELLE.ang)*4, MUELLE.z0 - Math.sin(MUELLE.ang)*4, 9, Math.max(0.9, alturaBase(MUELLE.x0 - Math.cos(MUELLE.ang)*4, MUELLE.z0 - Math.sin(MUELLE.ang)*4)));
solar(RAMPA.x + RAMPA.tx*9, RAMPA.z + RAMPA.tz*9, 12, RAMPA.base);

/* ---------------- La malla del terreno ----------------
   Se calcula UNA vez con todo (colinas, carretera aplanada, solares) y de
   ahí sale tanto lo que se ve como lo que se pisa: así lo que se dibuja y
   lo que se maneja es exactamente lo mismo. */
function alturaTerreno(x, z){
  let h = alturaBase(x, z);
  const c = cercaRuta(x, z);
  if (c.d < 9) h = lerp(h, RUTA.M[c.i].h, 1 - smooth(4.5, 9, c.d));
  const dp = distPista(x, z);
  if (dp < 18) h = lerp(h, PISTA.h, 1 - smooth(10, 18, dp));
  for (const s of SOLARES){
    const d = Math.hypot(x-s.x, z-s.z);
    if (d < s.r+8) h = lerp(h, s.h, 1 - smooth(s.r, s.r+8, d));
  }
  return h;
}
const MALLA = new Float32Array((NSEG+1)*(NSEG+1));
(function construirTerreno(){
  for (let iy=0; iy<=NSEG; iy++) for (let ix=0; ix<=NSEG; ix++)
    MALLA[iy*(NSEG+1)+ix] = alturaTerreno(ix*SEG-MITAD, iy*SEG-MITAD);
})();
function alturaMalla(x, z){
  const fx = clamp((x+MITAD)/SEG, 0, NSEG-1e-6), fz = clamp((z+MITAD)/SEG, 0, NSEG-1e-6);
  const ix = Math.floor(fx), iz = Math.floor(fz), u = fx-ix, v = fz-iz;
  const a = MALLA[iz*(NSEG+1)+ix], b = MALLA[(iz+1)*(NSEG+1)+ix], c = MALLA[(iz+1)*(NSEG+1)+ix+1], d = MALLA[iz*(NSEG+1)+ix+1];
  /* los mismos dos triángulos por celda que dibuja la vista */
  if (u+v <= 1) return a + (d-a)*u + (b-a)*v;
  return c + (b-c)*(1-u) + (d-c)*(1-v);
}
for (const h of HELIPUERTOS) h.y = alturaMalla(h.x, h.z);
/* la altura que se pisa: la malla más la rampa y el muelle */
function altura(x, z){
  const t = enRampa(x, z);
  if (t >= 0) return RAMPA.base + RAMPA.alto*(t/RAMPA.largo);
  if (enMuelle(x, z)) return MUELLE.alto;
  const tp = enPuente(x, z);
  if (tp >= 0) return Math.max(alturaMalla(x, z), alturaPuente(tp));
  return alturaMalla(x, z);
}
/* lo que ven los barcos: el fondo de verdad, sin puente ni muelle encima */
const alturaAgua = (x, z)=> alturaMalla(x, z);
function ola(x, z, t){
  return 0.22*Math.sin(x*0.23 + t*1.3) + 0.16*Math.sin(z*0.29 - t*1.1) + 0.1*Math.sin((x+z)*0.11 + t*0.7);
}
const enAgua = (x, z)=> altura(x, z) < NIVEL_MAR - 1.1;

/* ---------------- Los adornos con cuerpo (chocan): árboles, palmeras y rocas ---------------- */
const DECOR = {arboles:[], palmeras:[], pinos:[], rocas:[]};
const OBST = new Map();     /* cuadrícula de 24 m → obstáculos (círculos y cajas) */
const CELDA = 24;
function claveCelda(x, z){ return Math.floor((x+MITAD)/CELDA)+','+Math.floor((z+MITAD)/CELDA); }
function agregarObst(o){
  const r = o.r || Math.max(o.hx, o.hz);
  for (let cx=Math.floor((o.x-r+MITAD)/CELDA); cx<=Math.floor((o.x+r+MITAD)/CELDA); cx++)
    for (let cz=Math.floor((o.z-r+MITAD)/CELDA); cz<=Math.floor((o.z+r+MITAD)/CELDA); cz++){
      const k = cx+','+cz; if (!OBST.has(k)) OBST.set(k, []); OBST.get(k).push(o);
    }
}
function obstaculosCerca(x, z){ return OBST.get(claveCelda(x, z)) || []; }
function lejosDeTodo(x, z, minimo){
  if (cercaRuta(x, z).d < 14) return false;
  if (enPuente(x, z) >= 0) return false;
  for (const c of CASAS_MCBO) if (Math.hypot(x-c.x, z-c.z) < 12) return false;
  for (const h of HELIPUERTOS) if (Math.hypot(x-h.x, z-h.z) < 14) return false;
  for (const h of HUEVOS) if (Math.hypot(x-h.x, z-h.z) < 6) return false;
  if (Math.hypot(x-PLAZA_MCBO.x, z-PLAZA_MCBO.z) < 16) return false;
  if (distPista(x, z) < 20) return false;
  if (Math.hypot(x-HANGAR.x, z-HANGAR.z) < 16) return false;
  for (const s of SOLARES) if (Math.hypot(x-s.x, z-s.z) < s.r+3) return false;
  for (const v of VEHICULOS_DEF) if (Math.hypot(x-v.x, z-v.z) < 24) return false;
  for (const f of FAMILIA) if (Math.hypot(x-f.x, z-f.z) < 5) return false;
  for (const b of BANOS) if (Math.hypot(x-b.x, z-b.z) < 7) return false;
  if (Math.hypot(x-CANCHA.x, z-CANCHA.z) < 26 || Math.hypot(x-PARQUE.x, z-PARQUE.z) < 14) return false;
  if (Math.hypot(x-INICIO.x, z-INICIO.z) < 10) return false;
  if (enMuelle(x, z) || enRampa(x, z) >= 0) return false;
  if (Math.hypot(x-RAMPA.aro.x, z-RAMPA.aro.z) < 14) return false;
  for (const a of DECOR.arboles) if (Math.hypot(x-a.x, z-a.z) < minimo) return false;
  for (const a of DECOR.palmeras) if (Math.hypot(x-a.x, z-a.z) < minimo) return false;
  for (const a of DECOR.pinos) if (Math.hypot(x-a.x, z-a.z) < minimo) return false;
  return true;
}
(function plantar(){
  semilla = 777;
  for (let i=0;i<6500;i++){
    const x = (azar()-0.5)*TAM, z = (azar()-0.5)*TAM, h = altura(x, z);
    if (h < 1.0) continue;
    const dp = Math.hypot(x-PUEBLO.x, z-PUEBLO.z);
    if (dp < 160 && azar() < 0.9) continue;                      /* el pueblo casi sin árboles: se choca menos */
    if (enMaracaibo(x, z) && azar() < 0.7) continue;
    if (!lejosDeTodo(x, z, 8)) continue;
    const esc = 0.8 + azar()*0.6;
    if (h > 30) DECOR.pinos.push({x, z, h, esc, rot: azar()*6.28});
    else if (h < 3.4 && Math.hypot(x,z) > 230) DECOR.palmeras.push({x, z, h, esc, rot: azar()*6.28, inclina: (azar()-0.5)*0.5});
    else if (Math.hypot(x-ISLITA.x, z-ISLITA.z) < 40 || enMaracaibo(x, z)) DECOR.palmeras.push({x, z, h, esc, rot: azar()*6.28, inclina: (azar()-0.5)*0.5});
    else DECOR.arboles.push({x, z, h, esc, rot: azar()*6.28, tono: azar()});
  }
  for (let i=0;i<420;i++){
    const x = (azar()-0.5)*TAM, z = (azar()-0.5)*TAM, h = altura(x, z);
    if (h > -2 && h < 1.5) continue;
    if (h > 1.5 && !lejosDeTodo(x, z, 3)) continue;
    if (h > 1.5 && Math.hypot(x-PUEBLO.x, z-PUEBLO.z) < 140) continue;
    DECOR.rocas.push({x, z, h, esc: 0.6 + azar()*1.6, rot: azar()*6.28, agua: h < -2});
  }
  for (const a of DECOR.arboles) agregarObst({x:a.x, z:a.z, r:0.9*a.esc});
  for (const a of DECOR.palmeras) agregarObst({x:a.x, z:a.z, r:0.7*a.esc});
  for (const a of DECOR.pinos) agregarObst({x:a.x, z:a.z, r:0.9*a.esc});
  for (const r of DECOR.rocas) if (!r.agua && r.esc > 1.0) agregarObst({x:r.x, z:r.z, r:1.1*r.esc});
  for (const c of CASAS) agregarObst({x:c.x, z:c.z, hx:c.w/2, hz:c.d/2});
  for (const c of CASAS_MCBO) agregarObst({x:c.x, z:c.z, hx:c.w/2, hz:c.d/2});
  agregarObst({x:HANGAR.x, z:HANGAR.z, hx:HANGAR.w/2, hz:HANGAR.d/2});
  agregarObst({x:FARO.x, z:FARO.z, r:3.2});
  agregarObst({x:FUENTE.x, z:FUENTE.z, r:FUENTE.r});
  for (const b of BANOS) agregarObst({x:b.x, z:b.z, r:1.6});
  for (const f of FAMILIA) agregarObst({x:f.x, z:f.z, r:0.7});
})();

/* ---------------- Las hamburguesas ---------------- */
const HAMBURGUESAS = [];
(function ponerHamburguesas(){
  semilla = 4242;
  let id = 0;
  const poner = (x, z, y)=>{ HAMBURGUESAS.push({id:id++, x, z, y: y===undefined ? altura(x,z)+1.1 : y}); };
  /* en el pueblo, cerca de la casa */
  for (const [x,z] of [[36,44],[54,44],[20,60],[0,84],[-30,60],[60,80],[90,90],[-40,110],[30,150],[-20,100],[70,40],[100,20]]) poner(x, z);
  /* por la carretera, a un ladito */
  for (let i=0;i<14;i++){ const m = puntoRuta(i*RUTA.L/14 + 30); poner(m.x + m.nx*3.2, m.z + m.nz*3.2); }
  /* en la playa, el muelle, el aeropuerto y la montaña */
  poner(PLAYA.x-8, PLAYA.z+3); poner(PLAYA.x+18, PLAYA.z-2); poner(PLAYA.x-20, PLAYA.z-6);
  poner(MUELLE.x0 + Math.cos(MUELLE.ang)*14, MUELLE.z0 + Math.sin(MUELLE.ang)*14);
  poner(PISTA.x, PISTA.z1-20); poner(PISTA.x, PISTA.z0+20); poner(HANGAR.x, HANGAR.z+14);
  poner(MONTANA.x, MONTANA.z); poner(MONTANA.x+30, MONTANA.z+40); poner(FARO.x-8, FARO.z+8);
  /* en la islita, por el cielo (dentro de los aros) y por el fondo del mar */
  poner(ISLITA.x-8, ISLITA.z+6); poner(ISLITA.x+7, ISLITA.z-5);
  for (const a of AROS) poner(a.x, a.z, a.y);
  poner(COFRE.x+10, COFRE.z, altura(COFRE.x+10, COFRE.z)+2.5); poner(COFRE.x-10, COFRE.z+8, altura(COFRE.x-10, COFRE.z+8)+2.5);
  poner(-40, 420, altura(-40,420)+2.5); poner(-300, 300, altura(-300,300)+2.5);
})();

/* ---------------- Las arepas de Maracaibo ---------------- */
const AREPAS = [];
for (const [ox,oz] of [[-18,-12],[14,-18],[24,12],[-14,26],[6,4],[-40,0],[38,-24],[-26,-40],[18,40],[44,26]]){
  const x = MARACAIBO.x+ox, z = MARACAIBO.z+oz;
  AREPAS.push({id:'a'+AREPAS.length, x, z, y: altura(x, z)+1.0});
}
/* ---------------- Las misiones (cada una da una estrella) ---------------- */
const MISIONES = MAPA===2 ? [
  {id:'popo',    emoji:'🍔', titulo:'Come hamburguesas y haz popo en un baño'},
  {id:'banos',   emoji:'🚽', titulo:'Haz popo en los 5 baños del Señor Popo'},
  {id:'familia', emoji:'👨‍👩‍👧', titulo:'Saluda a toda la familia de noche'},
  {id:'polarcita', emoji:'🍺', titulo:'Visita a Rómulo en su bar'},
  {id:'carro',   emoji:'🚗', titulo:'Cruza las 6 banderas con el carro de noche'},
  {id:'catatumbo', emoji:'⚡', titulo:'Mira 5 relámpagos del Catatumbo desde la lancha'},
  {id:'coro',    emoji:'🐐', titulo:'Ve a Coro y saluda a los 8 chivos'},
  {id:'ptero',   emoji:'🦅', titulo:'Vuela con el pterodáctilo por los 6 aros de la noche'},
  {id:'luna',    emoji:'🚀', titulo:'Vuela en la nave espacial hasta Marte'},
  {id:'ovni',    emoji:'👽', titulo:'Encuentra la nave extraterrestre en el espacio'},
  {id:'maracaibo', emoji:'🫓', titulo:'Cruza el puente y come 5 arepas en Maracaibo'},
] : [
  {id:'popo',    emoji:'🍔', titulo:'Come hamburguesas y haz popo en un baño'},
  {id:'banos',   emoji:'🚽', titulo:'Haz popo en los 5 baños del Señor Popo'},
  {id:'carro',   emoji:'🚗', titulo:'Cruza las 6 banderas con el carro'},
  {id:'moto',    emoji:'🏍️', titulo:'Salta la rampa con la moto'},
  {id:'avion',   emoji:'✈️', titulo:'Vuela por los 7 aros del cielo'},
  {id:'barco',   emoji:'🚤', titulo:'Ve en barco a la islita de Santi'},
  {id:'sub',     emoji:'🤿', titulo:'Busca el tesoro con el submarino'},
  {id:'familia', emoji:'👨‍👩‍👧', titulo:'Saluda a toda la familia'},
  {id:'heli',    emoji:'🚁', titulo:'Aterriza en los 4 helipuertos con el helicóptero'},
  {id:'motoagua',emoji:'🛥️', titulo:'Pasa las 6 boyas con la moto de agua'},
  {id:'dino',    emoji:'🦖', titulo:'Recoge los 8 huevos montado en el dinosaurio'},
  {id:'luna',    emoji:'🚀', titulo:'Vuela en la nave espacial hasta la luna'},
  {id:'maracaibo', emoji:'🫓', titulo:'Cruza el puente y come 5 arepas en Maracaibo'},
];
const SALUDABLES = FAMILIA.filter(f=>!f.bebe).map(f=>f.id);

/* ---------------- La partida ---------------- */
function crearPartida(guardado){
  const P = {
    t: 0, eventos: [], puntos: 0, camYaw: Math.PI,
    J: {x: INICIO.x, z: INICIO.z, y: 0, ang: INICIO.ang, vx: 0, vz: 0, vy: 0, suelo: true, nadando: false, radio: 0.5, mov: 0, fase: 0},
    veh: null, vehiculos: VEHICULOS_DEF.map(v=>Object.assign({}, v, {y:0, vel:0, vy:0, suelo:true, aire:false, cabeceo:0, giro:0, turbo:0, pos:null})),
    perros: PERROS_DEF.map(p=>Object.assign({}, p, {y:0, sigue:false, ang:0, mov:0, fase:0, radio:0.4})),
    popitos: [],
    popo: 0, ganas: false, pedoT: 0, ultimoPopoDicho: -9999, ultimaHamb: -9999,
    hamburguesas: 0, comidas: new Set(), arepas: 0, comidasArepas: new Set(), estrellas: [],
    prog: {banos:[], banderas:[], aros:[], familia:[], helipuertos:[], boyas:[], huevos:[], chivos:[], arosNoche:[], rayos:0, rampa:false, santi:false, cofre:false, popo:false, luna:false, maracaibo:false, ovni:false, coroDicho:false},
    chivos: CHIVOS.map(c=>({id:c.id, x:c.x, z:c.z, ang:c.ang, t:0, saltoT:0})), ultimoRayo: -9999, catatumboDicho: -9999,
    espacio: false, rugidoT: -9999, pj: 'fernando', enPuenteT: -9999,
    saludos: {}, escena: null, srPopo: {bano: 0, visible: true, saludo: -9999}, cercaVeh: null, final: false, finalT: 0,
    aPrev: false, bPrev: false, salirPrev: false, avisoBano: -9999, ultimoChoque: -9999,
  };
  P.J.y = altura(P.J.x, P.J.z);
  for (const v of P.vehiculos) v.y = v.id==='barco' || v.id==='sub' || v.agua ? NIVEL_MAR : altura(v.x, v.z);
  for (const p of P.perros) p.y = altura(p.x, p.z);
  if (guardado) importar(P, guardado);
  return P;
}
function exportar(P){
  const prog = {};
  for (const k of ['banos','banderas','aros','familia','helipuertos','boyas','huevos','chivos','arosNoche']) prog[k] = P.prog[k].slice();
  for (const k of ['rampa','santi','cofre','popo','luna','maracaibo','ovni','coroDicho']) prog[k] = P.prog[k];
  prog.rayos = P.prog.rayos;
  return {estrellas: P.estrellas.slice(), puntos: P.puntos, hamburguesas: P.hamburguesas, comidas: [...P.comidas], arepas: P.arepas, comidasArepas: [...P.comidasArepas], popitos: P.popitos.length, prog};
}
function importar(P, g){
  try{
    if (Array.isArray(g.estrellas)) P.estrellas = g.estrellas.filter(id=>MISIONES.some(m=>m.id===id));
    if (Number.isFinite(g.puntos)) P.puntos = g.puntos;
    if (Number.isFinite(g.hamburguesas)) P.hamburguesas = g.hamburguesas;
    if (Array.isArray(g.comidas)) P.comidas = new Set(g.comidas);
    if (Number.isFinite(g.arepas)) P.arepas = g.arepas;
    if (Array.isArray(g.comidasArepas)) P.comidasArepas = new Set(g.comidasArepas);
    if (g.prog){ for (const k of ['banos','banderas','aros','familia','helipuertos','boyas','huevos','chivos','arosNoche']) if (Array.isArray(g.prog[k])) P.prog[k] = g.prog[k].slice();
      for (const k of ['rampa','santi','cofre','popo','luna','maracaibo','ovni','coroDicho']) if (typeof g.prog[k]==='boolean') P.prog[k] = g.prog[k];
      if (Number.isFinite(g.prog.rayos)) P.prog.rayos = g.prog.rayos; }
    for (const id of P.prog.familia) P.saludos[id] = true;
    for (const p of P.perros) p.sigue = false;
    if (Number.isFinite(g.popitos)) for (let i=0;i<Math.min(g.popitos, MAX_POPITOS);i++) nacerPopito(P, P.J.x - 2 - i, P.J.z + 1);
  }catch(e){}
}
const evento = (P, tipo, datos)=>{ P.eventos.push(Object.assign({tipo}, datos||{})); };
const tieneEstrella = (P, id)=> P.estrellas.includes(id);
function darEstrella(P, id){
  if (tieneEstrella(P, id)) return;
  P.estrellas.push(id);
  P.puntos += 2000;
  evento(P, 'estrella', {id, total: P.estrellas.length});
  if (P.estrellas.length === MISIONES.length && !P.final){ P.final = true; P.finalT = P.t; evento(P, 'final'); }
}

/* ---- moverse chocando con los árboles, las casas y el borde del mundo ---- */
function moverChocando(e, nx, nz){
  let choco = false;
  if (nx < -LIMITE || nx > LIMITE || nz < -LIMITE || nz > LIMITE){ nx = clamp(nx, -LIMITE, LIMITE); nz = clamp(nz, -LIMITE, LIMITE); choco = true; }
  const lista = obstaculosCerca(nx, nz);
  for (const o of lista){
    if (o.r){
      if (e.aplasta) continue;                                     /* el dinosaurio pasa por encima de árboles y rocas */
      const dx = nx-o.x, dz = nz-o.z, d = Math.hypot(dx,dz), rr = o.r + e.radio;
      if (d < rr){ if (d > 1e-6){ nx = o.x + dx/d*rr; nz = o.z + dz/d*rr; } else { nx += rr; } choco = true; }
    } else {
      const cx = clamp(nx, o.x-o.hx, o.x+o.hx), cz = clamp(nz, o.z-o.hz, o.z+o.hz);
      const dx = nx-cx, dz = nz-cz, d = Math.hypot(dx,dz);
      if (d < e.radio){
        if (d > 1e-6){ nx = cx + dx/d*e.radio; nz = cz + dz/d*e.radio; }
        else { /* justo dentro: se sale por el lado más cercano */
          const sx = o.x+o.hx+e.radio-nx, sx2 = nx-(o.x-o.hx-e.radio), sz = o.z+o.hz+e.radio-nz, sz2 = nz-(o.z-o.hz-e.radio);
          const m = Math.min(sx,sx2,sz,sz2);
          if (m===sx) nx = o.x+o.hx+e.radio; else if (m===sx2) nx = o.x-o.hx-e.radio; else if (m===sz) nz = o.z+o.hz+e.radio; else nz = o.z-o.hz-e.radio;
        }
        choco = true;
      }
    }
  }
  return {x:nx, z:nz, choco};
}
/* el escalón máximo que se sube de golpe (más alto es pared: el fondo de la rampa, el muelle desde el mar) */
const ESCALON = 1.3;

/* ---- a pie ---- */
function pasoPie(P, ent){
  const J = P.J;
  let dx = 0, dz = 0, mag = Math.hypot(ent.jx, ent.jy);
  if (mag > 0.08){
    mag = Math.min(1, mag);
    const fx = Math.sin(P.camYaw), fz = Math.cos(P.camYaw);          /* hacia dónde mira la cámara */
    const rx = -fz, rz = fx;                                           /* la derecha de la cámara */
    dx = (fx*ent.jy + rx*ent.jx)/mag; dz = (fz*ent.jy + rz*ent.jx)/mag;
    J.ang = envolver(J.ang + envolver(Math.atan2(dx, dz) - J.ang)*0.25);
  }
  let velMax = J.nadando ? 3.2 : (ent.b ? 9.5 : 6.2);
  if (P.ganas && !J.nadando) velMax *= 0.72;                          /* con ganas de popo se camina apretado */
  const objx = dx*velMax*mag, objz = dz*velMax*mag;
  const k = J.suelo || J.nadando ? 0.18 : 0.04;
  J.vx += (objx - J.vx)*k; J.vz += (objz - J.vz)*k;
  J.mov = Math.hypot(J.vx, J.vz);
  const nx = J.x + J.vx*DT, nz = J.z + J.vz*DT;
  const m = moverChocando(J, nx, nz);
  const gNueva = altura(m.x, m.z);
  if (!J.nadando && gNueva - J.y > ESCALON && J.suelo){ J.vx *= 0.2; J.vz *= 0.2; }   /* pared */
  else { J.x = m.x; J.z = m.z; if (m.choco){ J.vx *= 0.5; J.vz *= 0.5; } }
  const g = altura(J.x, J.z);
  if (g < NIVEL_MAR - 1.1 && J.y <= NIVEL_MAR + 0.3){
    if (!J.nadando){ J.nadando = true; J.suelo = false; J.vy = 0; evento(P, 'chapoteo', {x:J.x, z:J.z}); }
    J.y = NIVEL_MAR - 0.35 + ola(J.x, J.z, P.t*DT)*0.5;
  } else if (J.nadando){
    J.nadando = false; J.suelo = true; J.y = Math.max(J.y, g);
  }
  if (!J.nadando){
    if (J.suelo && ent.aNuevo){ J.vy = 9.8; J.suelo = false; evento(P, 'salto'); }
    if (J.suelo){
      if (g >= J.y - 0.8){ J.vy = 0; J.y = g; }
      else { J.suelo = false; J.vy = 0; }
    }
    if (!J.suelo){
      J.vy -= GRAV*DT; J.y += J.vy*DT;
      if (J.y <= g){ J.y = g; J.suelo = true; if (J.vy < -8) evento(P, 'aterriza'); J.vy = 0; }
    }
  }
  J.fase += J.mov*DT*2.2;
  /* ¿hay un vehículo al lado? */
  P.cercaVeh = null; let md = 4.6;
  for (const v of P.vehiculos){
    const d = Math.hypot(v.x-J.x, v.z-J.z) - v.radio;
    if (d < md && Math.abs(v.y - J.y) < 4){ md = d; P.cercaVeh = v; }
  }
}
function montar(P, v){
  P.veh = v; P.J.suelo = true; P.J.nadando = false; P.J.vx = P.J.vz = 0;
  P.J.x = v.x; P.J.z = v.z; P.J.y = v.y; P.J.ang = v.ang;
  P.cercaVeh = null;
  evento(P, 'montar', {id: v.id});
  if (v.id==='avion' || v.id==='heli' || v.id==='nave' || v.id==='ptero') decir(P, 'volar');
  else if (v.id==='barco' || v.id==='motoagua') decir(P, 'barco');
  else if (v.id==='dino') decir(P, 'dino');
}
function puedeBajar(P){
  const v = P.veh; if (!v) return false;
  if (Math.abs(v.vel) > 4) return false;
  if ((v.id==='avion' || v.id==='heli' || v.id==='nave') && v.aire) return false;
  if (v.id==='sub' && v.y < NIVEL_MAR - 0.9) return false;
  if (v.agua && v.y > NIVEL_MAR + 1.5) return false;
  return true;
}
function intentarBajar(P){
  const v = P.veh; if (!v) return;
  if (!puedeBajar(P)){ evento(P, 'noBajar', {id:v.id}); return; }
  const rx = -Math.cos(v.ang), rz = Math.sin(v.ang);            /* a la derecha del vehículo */
  const lado = v.radio + 1.2;
  let x = v.x + rx*lado, z = v.z + rz*lado;
  if (v.id==='sub' || v.id==='barco' || v.agua){
    /* si el muelle está cerca, se baja hacia él */
    for (let i=0;i<=10;i++){ const t=i/10, px = lerp(MUELLE.x0, MUELLE.x1, t), pz = lerp(MUELLE.z0, MUELLE.z1, t);
      if (Math.hypot(px-v.x, pz-v.z) < 9){ x = px; z = pz; break; } }
  }
  const J = P.J;
  J.x = x; J.z = z; J.ang = v.ang; J.vx = J.vz = J.vy = 0;
  J.nadando = enAgua(x, z); J.suelo = !J.nadando;
  J.y = J.nadando ? NIVEL_MAR - 0.35 : altura(x, z);
  v.vel = 0; P.veh = null;
  for (const p of P.perros) if (p.sigue){ p.x = x - rx*2 + azar(); p.z = z - rz*2 + azar(); p.y = altura(p.x, p.z); }
  evento(P, 'bajar', {id: v.id});
}

/* ---- los vehículos ---- */
const CARACT = {
  carro: {vmax: 30, acc: 13, freno: 26, giro: 1.9, reversa: 8, turbo: 1.4},
  moto:  {vmax: 34, acc: 18, freno: 28, giro: 2.5, reversa: 6, turbo: 1.45},
  barco: {vmax: 22, acc: 7,  freno: 10, giro: 1.3, reversa: 5, turbo: 1.4},
  avion: {vmax: 40, acc: 13, freno: 16, giro: 1.15, reversa: 3, turbo: 1.5, despegue: 26, crucero: 34, techo: 230},
  sub:   {vmax: 12, acc: 6,  freno: 8,  giro: 1.35, reversa: 5, turbo: 1.3, vertical: 5.5},
  heli:  {vmax: 26, acc: 10, freno: 10, giro: 1.7, reversa: 8, turbo: 1.3, vertical: 7, techo: 220},
  motoagua: {vmax: 32, acc: 12, freno: 12, giro: 2.0, reversa: 4, turbo: 1.35},
  nave:  {vmax: 48, acc: 14, freno: 14, giro: 1.4, reversa: 0, turbo: 1.4, empuje: 30, techo: 900},
  dino:  {vmax: 18, acc: 24, freno: 30, giro: 2.6, reversa: 3, turbo: 1.35},
  ptero: {vmax: 30, acc: 10, freno: 10, giro: 2.1, reversa: 6, turbo: 1.4, vertical: 8, techo: 200},
};
function pasoVehiculo(P, v, ent){
  const C = CARACT[v.id];
  const turbo = ent.b && (v.id!=='sub');
  v.turbo = turbo ? Math.min(1, v.turbo+0.1) : Math.max(0, v.turbo-0.05);
  const fx = Math.sin(v.ang), fz = Math.cos(v.ang);
  if (v.id==='avion' && v.aire) return pasoAvionAire(P, v, ent, C);
  if (v.id==='sub') return pasoSub(P, v, ent, C);
  if (v.id==='heli' || v.id==='ptero') return pasoHeli(P, v, ent, C);
  if (v.id==='nave') return pasoNave(P, v, ent, C);
  const esAgua = v.id==='barco' || v.agua, esDino = v.id==='dino';
  if (esDino && ent.b && P.t - P.rugidoT > 90){ P.rugidoT = P.t; evento(P, 'rugido', {x:v.x, y:v.y, z:v.z}); }
  /* en tierra o sobre el agua: gas, freno, marcha atrás y volante */
  const enRuta = cercaRuta(v.x, v.z).d < RUTA.ancho/2 + 1 || distPista(v.x, v.z) < PISTA.ancho/2 || esAgua || esDino || enPuente(v.x, v.z) >= 0 || Math.hypot(v.x-PUEBLO.x, v.z-PUEBLO.z) < 130;
  const vmax = C.vmax*(enRuta ? 1 : 0.68)*(turbo ? C.turbo : 1);
  if (ent.jy > 0.05) v.vel += C.acc*ent.jy*(turbo ? 1.5 : 1)*DT;
  else if (ent.jy < -0.05){ if (v.vel > 0.4) v.vel -= C.freno*(-ent.jy)*DT; else v.vel = Math.max(v.vel - C.acc*0.6*DT, -C.reversa); }
  else v.vel -= v.vel*(esAgua ? 0.6 : 1.2)*DT;
  if (v.vel > vmax) v.vel -= (v.vel - vmax)*0.08;
  if (Math.abs(v.vel) < 0.02 && Math.abs(ent.jy) < 0.05) v.vel = 0;
  const agarre = Math.min(1, Math.abs(v.vel)/6);
  v.giro = lerp(v.giro, -ent.jx*agarre, 0.2);
  v.ang = envolver(v.ang + v.giro*C.giro*DT*Math.sign(v.vel||1)*(esAgua ? 1 : Math.min(1, 12/Math.max(6, Math.abs(v.vel)))*1.4));
  const nx = v.x + fx*v.vel*DT, nz = v.z + fz*v.vel*DT;
  const m = moverChocando(v, nx, nz);
  const gNueva = esAgua ? alturaAgua(m.x, m.z) : altura(m.x, m.z);
  if (esAgua){
    if (gNueva > NIVEL_MAR - 0.6){ v.vel *= 0.4; if (Math.abs(v.vel) > 3) evento(P, 'choque', {x:v.x, z:v.z}); }   /* la orilla */
    else { v.x = m.x; v.z = m.z; }
    const sup = NIVEL_MAR + ola(v.x, v.z, P.t*DT);
    if (v.agua){
      /* la moto de agua brinca sobre las olas */
      if (v.suelo && ent.aNuevo){ v.vy = 6; v.suelo = false; evento(P, 'brinco', {id:v.id}); }
      if (!v.suelo){ v.vy -= GRAV*DT; v.y += v.vy*DT; if (v.y <= sup){ v.y = sup; v.suelo = true; v.vy = 0; evento(P, 'chapoteo', {x:v.x, z:v.z}); } }
      else v.y = sup;
      v.cabeceo = lerp(v.cabeceo, v.suelo ? -Math.abs(v.vel)*0.006 : clamp(-v.vy*0.04, -0.4, 0.4), 0.1);
    } else { v.y = sup; v.suelo = true; }
    if (Math.abs(v.vel) > 4 && v.suelo && P.t % 3 === 0) evento(P, 'estela', {x:v.x - fx*2.5, z:v.z - fz*2.5});
    return;
  }
  if (gNueva < NIVEL_MAR - 0.8 && v.id!=='avion'){ v.vel *= 0.3; evento(P, 'chapoteo', {x:m.x, z:m.z}); }              /* el mar frena */
  else if (v.suelo && gNueva - v.y > ESCALON){ v.vel *= -0.25; evento(P, 'choque', {x:v.x, z:v.z}); }                   /* pared */
  else { v.x = m.x; v.z = m.z; if (m.choco){ if (Math.abs(v.vel) > 6) evento(P, 'choque', {x:v.x, z:v.z}); v.vel *= 0.7; } }
  let g = altura(v.x, v.z);
  if (v.id==='avion') g = Math.max(g, NIVEL_MAR + ola(v.x, v.z, P.t*DT) + 0.2);                                 /* el avión también flota */
  if (v.suelo && ent.aNuevo && v.id!=='avion'){ v.vy = esDino ? 13 : 6.5; v.suelo = false; evento(P, 'brinco', {id:v.id}); }
  if (v.suelo){
    if (g >= v.y - 0.9){ v.vy = (g - v.y)/DT; v.y = g; }
    else { v.suelo = false; v.vy = clamp(v.vy, -2, 16); }
  }
  if (!v.suelo){
    v.vy -= GRAV*DT; v.y += v.vy*DT;
    if (v.y <= g){ v.y = g; v.suelo = true; if (v.vy < -5) evento(P, 'aterriza', {id:v.id}); v.vy = 0; }
  }
  v.cabeceo = lerp(v.cabeceo, v.suelo ? 0 : clamp(-v.vy*0.03, -0.35, 0.35), 0.1);
  if (v.id==='avion' && v.vel > C.despegue && v.suelo){ v.aire = true; v.suelo = false; v.cabeceo = 0.2; v.vy = 4; v.y = g + 0.8; evento(P, 'despegue'); }
  if (Math.abs(v.vel) > 8 && v.suelo && P.t % 4 === 0) evento(P, 'polvo', {x:v.x - fx*1.5, z:v.z - fz*1.5, y:v.y, agua: g < NIVEL_MAR + 0.4 && v.id==='avion'});
}
/* el helicóptero: A sube, B baja, la palanca lo mueve; se posa donde sea */
function pasoHeli(P, v, ent, C){
  const g = Math.max(altura(v.x, v.z), NIVEL_MAR + 0.3);
  const vertObj = (ent.a ? C.vertical : 0) - (ent.b ? C.vertical : 0);
  v.vy = lerp(v.vy, vertObj, 0.08);
  if (v.suelo){
    if (ent.a){ v.suelo = false; v.aire = true; v.vy = 1.5; evento(P, 'despegue'); }
    else { v.vy = 0; v.y = g; v.vel -= v.vel*4*DT; if (Math.abs(v.vel) < 0.05) v.vel = 0; v.cabeceo = lerp(v.cabeceo, 0, 0.1); return; }
  }
  v.y = clamp(v.y + v.vy*DT, g, C.techo);
  const objetivo = ent.jy*C.vmax;
  v.vel += (objetivo - v.vel)*(Math.abs(ent.jy) < 0.05 ? 0.09 : 0.03);   /* sin palanca frena rápido, para posarse con tino */
  v.giro = lerp(v.giro, -ent.jx, 0.1);
  v.ang = envolver(v.ang + v.giro*C.giro*DT);
  const fx = Math.sin(v.ang), fz = Math.cos(v.ang);
  const nx = clamp(v.x + fx*v.vel*DT, -LIMITE, LIMITE), nz = clamp(v.z + fz*v.vel*DT, -LIMITE, LIMITE);
  v.x = nx; v.z = nz;
  const g2 = Math.max(altura(v.x, v.z), NIVEL_MAR + 0.3);
  if (v.y < g2) v.y = g2;
  v.cabeceo = lerp(v.cabeceo, clamp(v.vel*0.012, -0.3, 0.3), 0.08);
  if (v.y <= g2 + 0.02 && v.vy <= 0){ v.suelo = true; v.aire = false; v.vy = 0; evento(P, 'aterriza', {id:v.id}); }
  if (P.t % 3 === 0 && v.y - g2 < 6) evento(P, 'polvo', {x:v.x + (azar()-0.5)*4, z:v.z + (azar()-0.5)*4, y:g2, agua:g2 < NIVEL_MAR + 0.5});
}
/* la nave espacial: A enciende los motores y sube; en el aire la palanca la mueve; llega hasta la luna */
function pasoNave(P, v, ent, C){
  const g = Math.max(altura(v.x, v.z), NIVEL_MAR + 0.3);
  if (ent.a){ v.vy = Math.min(v.vy + C.empuje*DT, 28); if (v.suelo){ v.suelo = false; v.aire = true; evento(P, 'despegue'); } if (P.t % 2 === 0) evento(P, 'fuego', {x:v.x, y:v.y, z:v.z}); }
  else if (!v.suelo) v.vy = Math.max(v.vy - 12*DT, v.y > 300 ? -30 : -12);
  if (v.suelo){ v.vy = 0; v.y = g; v.vel = 0; v.cabeceo = lerp(v.cabeceo, 0, 0.1); return; }
  v.y = clamp(v.y + v.vy*DT, g, C.techo);
  const objetivo = ent.jy*C.vmax*(ent.b ? C.turbo : 1);
  v.vel += (objetivo - v.vel)*0.03;
  v.giro = lerp(v.giro, -ent.jx, 0.1);
  v.ang = envolver(v.ang + v.giro*C.giro*DT);
  const fx = Math.sin(v.ang), fz = Math.cos(v.ang);
  v.x = clamp(v.x + fx*v.vel*DT, -LIMITE, LIMITE); v.z = clamp(v.z + fz*v.vel*DT, -LIMITE, LIMITE);
  const g2 = Math.max(altura(v.x, v.z), NIVEL_MAR + 0.3);
  if (v.y <= g2){ v.y = g2; v.suelo = true; v.aire = false; v.vy = 0; evento(P, 'aterriza', {id:'nave'}); }
  v.cabeceo = lerp(v.cabeceo, clamp(v.vel*0.01, -0.35, 0.35), 0.08);
  const esp = v.y > 260;
  if (esp !== P.espacio){ P.espacio = esp; evento(P, esp ? 'espacio' : 'atmosfera'); }
  /* la luna es maciza: si la nave se le echa encima, rebota hacia fuera */
  const dl = Math.hypot(v.x-LUNA.x, v.y-LUNA.y, v.z-LUNA.z);
  if (dl < LUNA.r + 14 && (P.prog.luna || Math.hypot(v.x-LUNA.x, v.z-LUNA.z) > 30)){
    const k = (LUNA.r + 14)/Math.max(dl, 0.01);
    v.x = LUNA.x + (v.x-LUNA.x)*k; v.y = LUNA.y + (v.y-LUNA.y)*k; v.z = LUNA.z + (v.z-LUNA.z)*k;
    if (v.y < LUNA.y && v.vy > 0) v.vy = -4; else if (v.y >= LUNA.y && v.vy < 0) v.vy = 2;
    v.vel *= -0.3; evento(P, 'rebote');
  }
  /* la luna: al llegar a su cara de abajo, se posa y se planta la bandera */
  if (NOCHE && !P.escena && !P.prog.ovni && Math.hypot(v.x-OVNI.x, v.y-OVNI.y, v.z-OVNI.z) < 42){
    P.escena = {tipo:'ovni', t:0, dur:360}; v.vy = 0; v.vel = 0;
    evento(P, 'ovniLlega'); return;
  }
  if (!P.escena && !P.prog.luna && Math.hypot(v.x-LUNA.x, v.y-(LUNA.y-LUNA.r), v.z-LUNA.z) < 34){
    P.escena = {tipo:'luna', t:0, dur:300}; v.vy = 0; v.vel = 0;
    evento(P, 'lunaLlega'); decir(P, NOCHE ? 'marte' : 'luna');
  }
}
function pasoAvionAire(P, v, ent, C){
  const objetivo = ent.b ? C.crucero*C.turbo : C.crucero;
  v.vel += (objetivo - v.vel)*0.02;
  /* subir y bajar: la palanca manda el cabeceo, que vuelve solo al plano */
  const cabObj = clamp(ent.jy, -1, 1)*0.6 + (ent.a ? 0.35 : 0);
  v.cabeceo = lerp(v.cabeceo, clamp(cabObj, -0.6, 0.7), 0.06);
  if (v.y > C.techo && v.cabeceo > 0) v.cabeceo = lerp(v.cabeceo, -0.1, 0.1);
  v.giro = lerp(v.giro, -ent.jx, 0.08);
  v.ang = envolver(v.ang + v.giro*C.giro*DT);
  const fx = Math.sin(v.ang), fz = Math.cos(v.ang);
  const horiz = v.vel*Math.cos(v.cabeceo);
  v.vy = v.vel*Math.sin(v.cabeceo);
  const nx = clamp(v.x + fx*horiz*DT, -LIMITE, LIMITE), nz = clamp(v.z + fz*horiz*DT, -LIMITE, LIMITE);
  if (nx !== v.x + fx*horiz*DT || nz !== v.z + fz*horiz*DT){ v.ang = envolver(v.ang + 0.03); }        /* en el borde del mundo el avión da la vuelta solo */
  v.x = nx; v.z = nz; v.y += v.vy*DT;
  const g = Math.max(altura(v.x, v.z), NIVEL_MAR + ola(v.x, v.z, P.t*DT) + 0.2);
  /* los árboles y las casas no derriban al avión: solo se pasa por encima */
  if (v.y <= g + 0.4 && v.vy <= 0){
    if (v.cabeceo > -0.22 && v.vy > -9){ v.aire = false; v.suelo = true; v.y = g; v.vy = 0; v.cabeceo = 0; v.vel = Math.min(v.vel, 24); evento(P, 'aterriza', {id:'avion'}); }
    else { v.y = g + 0.5; v.vy = 3; v.cabeceo = 0.25; v.vel *= 0.75; evento(P, 'rebote'); }
  }
  if (P.t % 2 === 0) evento(P, 'estelaAire', {x:v.x - fx*3, y:v.y, z:v.z - fz*3});
}
function pasoSub(P, v, ent, C){
  if (ent.jy > 0.05) v.vel += C.acc*ent.jy*DT;
  else if (ent.jy < -0.05) v.vel = Math.max(v.vel - C.acc*0.8*DT, -C.reversa);
  else v.vel -= v.vel*0.8*DT;
  if (v.vel > C.vmax) v.vel -= (v.vel-C.vmax)*0.1;
  v.giro = lerp(v.giro, -ent.jx, 0.12);
  v.ang = envolver(v.ang + v.giro*C.giro*DT);
  const fx = Math.sin(v.ang), fz = Math.cos(v.ang);
  const nx = v.x + fx*v.vel*DT, nz = v.z + fz*v.vel*DT;
  const fondo = altura(nx, nz);
  if (fondo > v.y - 1.6){ v.vel *= 0.3; if (Math.abs(v.vel) > 2) evento(P, 'choque', {x:v.x, z:v.z}); }
  else { v.x = clamp(nx, -LIMITE, LIMITE); v.z = clamp(nz, -LIMITE, LIMITE); }
  const vertObj = (ent.a ? C.vertical : 0) - (ent.b ? C.vertical : 0);
  v.vy = lerp(v.vy, vertObj, 0.08);
  v.y = clamp(v.y + v.vy*DT, altura(v.x, v.z) + 1.6, NIVEL_MAR);
  v.cabeceo = lerp(v.cabeceo, clamp(v.vy*0.08, -0.35, 0.35), 0.1);
  v.suelo = true;
  if ((Math.abs(v.vel) > 1 || Math.abs(v.vy) > 0.5) && P.t % 4 === 0) evento(P, 'burbujas', {x:v.x - fx*3, y:v.y, z:v.z - fz*3});
}

/* ---- los perritos siguen a Fernando ---- */
function pasoPerros(P){
  const J = P.J;
  P.perros.forEach((p, i)=>{
    if (!p.sigue){
      if (!P.veh && Math.hypot(p.x-J.x, p.z-J.z) < 2.6){ p.sigue = true; evento(P, 'perro', {id:p.id}); evento(P, 'hablar', {texto:'¡Guau, guau! ¡Soy el perrito pichunguito!', quien:p.nombre}); }
      p.fase += DT*2;
      return;
    }
    if (P.veh){ p.dentro = true; return; }
    p.dentro = false;
    const atras = 2.2 + i*1.8, lado = (i===0 ? -1 : 1)*1.1;
    const ox = J.x - Math.sin(J.ang)*atras - Math.cos(J.ang)*lado, oz = J.z - Math.cos(J.ang)*atras + Math.sin(J.ang)*lado;
    const dx = ox-p.x, dz = oz-p.z, d = Math.hypot(dx,dz);
    if (d > 40){ p.x = ox; p.z = oz; }
    else if (d > 1.0){
      const vel = Math.min(10.5, d*2.2);
      const nx = p.x + dx/d*vel*DT, nz = p.z + dz/d*vel*DT;
      const m = moverChocando(p, nx, nz);
      p.x = m.x; p.z = m.z; p.ang = envolver(p.ang + envolver(Math.atan2(dx,dz)-p.ang)*0.2); p.mov = vel;
    } else { p.mov = 0; p.ang = envolver(p.ang + envolver(J.ang-p.ang)*0.05); }
    const g = altura(p.x, p.z);
    p.y = g < NIVEL_MAR - 1.1 ? NIVEL_MAR - 0.3 : g;
    p.fase += p.mov*DT*2.8 + DT*2;
  });
}

/* ---- los popos bebés: nacen en el baño y van detrás de los perritos ---- */
const MAX_POPITOS = 10;
function nacerPopito(P, x, z){
  if (P.popitos.length >= MAX_POPITOS) return null;
  const p = {id: P.popitos.length, x, z, y: altura(x, z), ang: 0, mov: 0, fase: azar()*6.28, dentro: false, radio: 0.35};
  P.popitos.push(p); return p;
}
function pasoPopitos(P){
  const J = P.J, base = P.perros.filter(p=>p.sigue).length;
  P.popitos.forEach((p, i)=>{
    if (P.veh){ p.dentro = true; return; }
    p.dentro = false;
    const k = base + i, atras = 2.4 + k*1.5, lado = (k%2 ? 1 : -1)*0.9;
    const ox = J.x - Math.sin(J.ang)*atras - Math.cos(J.ang)*lado, oz = J.z - Math.cos(J.ang)*atras + Math.sin(J.ang)*lado;
    const dx = ox-p.x, dz = oz-p.z, d = Math.hypot(dx,dz);
    if (d > 45){ p.x = ox; p.z = oz; }
    else if (d > 0.8){
      const vel = Math.min(9.5, d*2.4);
      const m = moverChocando(p, p.x + dx/d*vel*DT, p.z + dz/d*vel*DT);
      p.x = m.x; p.z = m.z; p.ang = envolver(p.ang + envolver(Math.atan2(dx,dz)-p.ang)*0.2); p.mov = vel;
    } else { p.mov = 0; p.ang = envolver(p.ang + envolver(J.ang-p.ang)*0.05); }
    const g = altura(p.x, p.z);
    p.y = g < NIVEL_MAR - 1.1 ? NIVEL_MAR - 0.2 : g;
    p.fase += p.mov*DT*3 + DT*3;
  });
}
/* ---- hamburguesas, ganas de popo y peos ---- */
function comerHamburguesa(P, h){
  P.comidas.add(h.id); P.hamburguesas++; P.puntos += 100;
  P.popo = Math.min(1, P.popo + 0.34);
  evento(P, 'hamburguesa', {id:h.id, x:h.x, y:h.y, z:h.z, total:P.hamburguesas});
  if (P.t - P.ultimaHamb > 60) decir(P, 'hamburguesa');
  P.ultimaHamb = P.t;
  /* el peo de la hamburguesa, y las ganas */
  P.pedoT = 14;
  evento(P, 'pedo', {x:P.J.x, y:P.J.y, z:P.J.z, grande: P.popo >= 0.99});
  if (P.popo >= 0.99 && !P.ganas) decir(P, 'peo');
  if (P.t - P.ultimoPopoDicho > 60*7){ decir(P, 'ganas'); P.ultimoPopoDicho = P.t; }
  if (P.popo >= 0.99 && !P.ganas){ P.ganas = true; evento(P, 'ganas'); }
}
function pasoPopo(P){
  if (P.pedoT > 0) P.pedoT--;
  if (P.ganas && P.t % (60*8) === 0){ P.pedoT = 10; evento(P, 'pedo', {x:P.J.x, y:P.J.y, z:P.J.z, grande:false}); }
}
function revisarRecogibles(P){
  const J = P.J, alcance = P.veh ? (P.veh.id==='avion' || P.veh.id==='heli' || P.veh.id==='nave' ? 7 : 3.6) : 2.0;
  for (const h of HAMBURGUESAS){
    if (P.comidas.has(h.id)) continue;
    const dx = h.x-J.x, dz = h.z-J.z, dy = h.y-(J.y+1);
    if (dx*dx+dz*dz+dy*dy < alcance*alcance) comerHamburguesa(P, h);
  }
  for (const a of AREPAS){
    if (P.comidasArepas.has(a.id)) continue;
    const dx = a.x-J.x, dz = a.z-J.z, dy = a.y-(J.y+1);
    if (dx*dx+dz*dz+dy*dy < alcance*alcance) comerArepa(P, a);
  }
  /* al subir al puente (pasada la rampa) se le hace un nudo en la garganta: una vez por cruce */
  { const tp = enPuente(J.x, J.z); const arriba = tp > PUENTE.rampa*0.6 && tp < PUENTE.L - PUENTE.rampa*0.6;
    if (arriba && P.t - P.enPuenteT > 60*8) decir(P, 'puente');
    if (arriba) P.enPuenteT = P.t; }
  if (!P.prog.maracaibo && enMaracaibo(J.x, J.z)){ P.prog.maracaibo = true; evento(P, 'maracaibo'); decir(P, 'maracaibo'); }
}
function comerArepa(P, a){
  P.comidasArepas.add(a.id); P.arepas++; P.puntos += 150;
  P.popo = Math.min(1, P.popo + 0.34);
  evento(P, 'arepa', {id:a.id, x:a.x, y:a.y, z:a.z, total:P.arepas});
  if (P.t - P.ultimaHamb > 60) decir(P, 'arepa');
  P.ultimaHamb = P.t;
  P.pedoT = 14;
  evento(P, 'pedo', {x:P.J.x, y:P.J.y, z:P.J.z, grande: P.popo >= 0.99});
  if (P.popo >= 0.99 && !P.ganas){ P.ganas = true; evento(P, 'ganas'); }
  if (P.arepas >= 5) darEstrella(P, 'maracaibo');
}
/* ---- los baños ---- */
function revisarBanos(P){
  if (P.veh || P.escena) return;
  const J = P.J;
  for (const b of BANOS){
    if (Math.hypot(b.px-J.x, b.pz-J.z) > 2.1) continue;
    if (P.popo <= 0.01){ if (P.t - P.avisoBano > 240){ P.avisoBano = P.t; evento(P, 'sinGanas', {bano:b.id}); } continue; }
    P.escena = {tipo:'bano', t:0, bano:b.id, dur: 330};
    P.srPopo.bano = b.id; P.srPopo.visible = true;
    J.vx = J.vz = 0; J.x = b.px; J.z = b.pz; J.ang = envolver(b.ang + Math.PI);
    evento(P, 'banoEntra', {bano:b.id});
    if (P.t - P.srPopo.saludo > 120) evento(P, 'hablar', {texto:'¡Pasa, pasa! ¡El baño está libre!', quien:'Señor Popo'});
    return;
  }
  /* el Señor Popo saluda cuando Fernando se le acerca */
  const b = BANOS[P.srPopo.bano], sx = b.x + Math.sin(b.ang)*2.6 - Math.cos(b.ang)*2.2, sz = b.z + Math.cos(b.ang)*2.6 + Math.sin(b.ang)*2.2;
  if (P.srPopo.visible && Math.hypot(sx-J.x, sz-J.z) < 3.2 && P.t - P.srPopo.saludo > 60*12){
    P.srPopo.saludo = P.t;
    evento(P, 'hablar', {texto: P.popo > 0.01 ? '¡Pasa, pasa! ¡El baño está libre!' : (P.pj==='fernando' ? '¡Hola Fernando! Soy el Señor Popo. ¡Come hamburguesas y ven a mi baño!' : '¡Hola! Soy el Señor Popo. ¡Come hamburguesas y ven a mi baño!'), quien:'Señor Popo'});
  }
}
function posSrPopo(P){
  const b = BANOS[P.srPopo.bano];
  return {x: b.x + Math.sin(b.ang)*2.6 - Math.cos(b.ang)*2.2, z: b.z + Math.cos(b.ang)*2.6 + Math.sin(b.ang)*2.2, ang: b.ang, bano: b};
}
function pasoEscena(P){
  const E = P.escena; E.t++;
  if (E.tipo==='luna'){
    const v = P.vehiculos.find(v=>v.id==='nave');
    v.x = lerp(v.x, LUNA.x, 0.03); v.z = lerp(v.z, LUNA.z, 0.03); v.y = lerp(v.y, LUNA.y-LUNA.r-3, 0.03); v.vel = 0; v.vy = 0;
    P.J.x = v.x; P.J.y = v.y; P.J.z = v.z;
    if (E.t === 90) evento(P, 'banderaLuna');
    if (E.t >= E.dur){ P.escena = null; P.prog.luna = true; P.puntos += 1000; evento(P, 'lunaLista'); darEstrella(P, 'luna'); v.vy = -6; }
    return;
  }
  if (E.tipo==='ovni'){
    const v = P.vehiculos.find(v=>v.id==='nave');
    v.x = lerp(v.x, OVNI.x, 0.03); v.z = lerp(v.z, OVNI.z, 0.03); v.y = lerp(v.y, OVNI.y - 26, 0.03); v.vel = 0; v.vy = 0;
    P.J.x = v.x; P.J.y = v.y; P.J.z = v.z;
    if (E.t === 50) evento(P, 'ovniLuz');
    if (E.t === 120){ evento(P, 'extraterrestres'); decir(P, 'extraterrestres'); }
    if (E.t >= E.dur){ P.escena = null; P.prog.ovni = true; P.puntos += 1000; evento(P, 'ovniLista'); darEstrella(P, 'ovni'); v.vy = -6; }
    return;
  }
  if (E.tipo==='bano'){
    if (E.t === 40) evento(P, 'banoPuerta', {abre:false, bano:E.bano});
    if (E.t > 70 && E.t < 210 && E.t % 28 === 0) evento(P, 'plop', {bano:E.bano});
    if (E.t === 225) evento(P, 'descarga', {bano:E.bano});
    if (E.t === 285){ evento(P, 'banoPuerta', {abre:true, bano:E.bano}); decir(P, 'alivio'); }
    if (E.t >= E.dur){
      P.escena = null; P.popo = 0; P.ganas = false; P.puntos += 500;
      if (!P.prog.banos.includes(E.bano)) P.prog.banos.push(E.bano);
      evento(P, 'banoSale', {bano:E.bano, banos:P.prog.banos.length});
      /* de cada popo nace un popo bebé que sigue a Fernando */
      { const b = BANOS[E.bano]; const n = nacerPopito(P, b.px + Math.sin(b.ang)*1.2, b.pz + Math.cos(b.ang)*1.2); if (n) { evento(P, 'popito', {total:P.popitos.length}); if (P.popitos.length <= 3) decir(P, 'popito'); } }
      evento(P, 'hablar', {texto: P.pj==='fernando' ? '¡Bravo, Fernando! ¡Qué popo tan grande!' : '¡Bravo! ¡Qué popo tan grande!', quien:'Señor Popo'});
      P.srPopo.saludo = P.t;
      P.prog.popo = true;
      darEstrella(P, 'popo');
      if (P.prog.banos.length >= BANOS.length){ evento(P, 'hablar', {texto:'¡Hiciste popo en todos mis baños! ¡Eres el campeón del popo!', quien:'Señor Popo'}); darEstrella(P, 'banos'); }
    }
  }
}
/* ---- la familia ---- */
function revisarFamilia(P){
  const J = P.J;
  for (const f of FAMILIA){
    const d = Math.hypot(f.x-J.x, f.z-J.z);
    if (d > (P.veh ? 4.5 : 2.6) || Math.abs(altura(f.x,f.z) - J.y) > 3) continue;
    if (P.saludos[f.id] && P.t - P.saludos[f.id+'T'] < 60*15) continue;
    const primera = !P.saludos[f.id];
    P.saludos[f.id] = true; P.saludos[f.id+'T'] = P.t;
    evento(P, 'saludo', {id:f.id, primera});
    decir(P, 'saludo', f.id);
    if (f.pedo) evento(P, 'pedo', {x:f.x, y:altura(f.x,f.z), z:f.z, grande:true, tioFran:true});
    if (f.eructo) evento(P, 'eructo');
    if (f.id==='romulo' && NOCHE){ evento(P, 'hablar', {texto:'¡Qué rica Polarcita!', quien:'Rómulo', pj:'romulo'}); evento(P, 'polarcita'); if (!tieneEstrella(P, 'polarcita')) darEstrella(P, 'polarcita'); }
    if (primera){
      P.puntos += 500;
      if (f.bebe){ if (!P.prog.santi){ P.prog.santi = true; darEstrella(P, 'barco'); } }
      else if (!P.prog.familia.includes(f.id)){ P.prog.familia.push(f.id); if (P.prog.familia.length >= SALUDABLES.length) darEstrella(P, 'familia'); }
    }
  }
}
/* ---- las misiones de los vehículos ---- */
function revisarMisiones(P){
  const v = P.veh; if (!v) return;
  if (v.id==='carro'){
    for (const b of BANDERAS){
      if (P.prog.banderas.includes(b.id)) continue;
      const dx = v.x-b.x, dz = v.z-b.z;
      if (Math.abs(dx*b.tx+dz*b.tz) < 2.5 && Math.abs(dx*b.nx+dz*b.nz) < 7){
        P.prog.banderas.push(b.id); P.puntos += 300; evento(P, 'bandera', {id:b.id, total:P.prog.banderas.length});
        if (P.prog.banderas.length >= BANDERAS.length) darEstrella(P, 'carro');
      }
    }
  } else if (v.id==='moto'){
    if (!P.prog.rampa && !v.suelo){
      const a = RAMPA.aro;
      if (Math.hypot(v.x-a.x, v.z-a.z) < a.r && Math.abs(v.y+1 - a.y) < a.r){ P.prog.rampa = true; P.puntos += 500; evento(P, 'rampa'); decir(P, 'rampa'); darEstrella(P, 'moto'); }
    }
  } else if (v.id==='avion'){
    AROS.forEach((a, i)=>{
      if (P.prog.aros.includes(i)) return;
      if (Math.hypot(v.x-a.x, v.z-a.z) < a.r+1 && Math.abs(v.y-a.y) < a.r+1){
        P.prog.aros.push(i); P.puntos += 300; evento(P, 'aro', {id:i, total:P.prog.aros.length});
        if (P.prog.aros.length >= AROS.length) darEstrella(P, 'avion');
      }
    });
  } else if (v.id==='sub'){
    if (!P.prog.cofre && Math.hypot(v.x-COFRE.x, v.z-COFRE.z) < 9 && v.y < altura(COFRE.x, COFRE.z)+8){
      P.prog.cofre = true; P.puntos += 1000; evento(P, 'cofre'); decir(P, 'tesoro'); darEstrella(P, 'sub');
    }
  } else if (v.id==='ptero'){
    AROS_NOCHE.forEach((a, i)=>{
      if (P.prog.arosNoche.includes(i)) return;
      if (Math.hypot(v.x-a.x, v.z-a.z) < a.r+1 && Math.abs(v.y-a.y) < a.r+1){
        P.prog.arosNoche.push(i); P.puntos += 300; evento(P, 'aroNoche', {id:i, total:P.prog.arosNoche.length});
        if (P.prog.arosNoche.length >= AROS_NOCHE.length) darEstrella(P, 'ptero');
      }
    });
  } else if (v.id==='heli'){
    if (v.suelo && Math.abs(v.vel) < 2.5) for (const h of HELIPUERTOS){
      if (P.prog.helipuertos.includes(h.id) || Math.hypot(v.x-h.x, v.z-h.z) > 9) continue;
      P.prog.helipuertos.push(h.id); P.puntos += 400; evento(P, 'helipuerto', {id:h.id, total:P.prog.helipuertos.length});
      if (P.prog.helipuertos.length >= HELIPUERTOS.length) darEstrella(P, 'heli');
    }
  } else if (v.id==='motoagua'){
    for (const b of BOYAS){
      if (P.prog.boyas.includes(b.id) || Math.hypot(v.x-b.x, v.z-b.z) > 10) continue;
      P.prog.boyas.push(b.id); P.puntos += 300; evento(P, 'boya', {id:b.id, total:P.prog.boyas.length});
      if (P.prog.boyas.length >= BOYAS.length) darEstrella(P, 'motoagua');
    }
  } else if (v.id==='dino'){
    for (const h of HUEVOS){
      if (P.prog.huevos.includes(h.id) || Math.hypot(v.x-h.x, v.z-h.z) > 4.5) continue;
      P.prog.huevos.push(h.id); P.puntos += 300; evento(P, 'huevo', {id:h.id, total:P.prog.huevos.length});
      if (P.prog.huevos.length >= HUEVOS.length) darEstrella(P, 'dino');
    }
  }
}
/* ---- el objetivo de ahora: qué le conviene hacer a Fernando y hacia dónde queda ---- */
function objetivo(P){
  const J = P.J;
  const masCerca = (lista, f)=>{ let mejor=null, md=Infinity; for (const o of lista){ const d = f ? f(o) : Math.hypot(o.x-J.x, o.z-J.z); if (d<md){ md=d; mejor=o; } } return mejor; };
  if (P.popo > 0.01 && !P.veh){ const b = masCerca(BANOS); return {texto: P.ganas ? '¡Corre al baño! 🚽' : 'Ve al baño del Señor Popo 🚽', x:b.px, z:b.pz, y:altura(b.px,b.pz), emoji:'🚽'}; }
  const v = P.veh;
  if (v){
    if (v.id==='carro' && !tieneEstrella(P,'carro')){ const b = masCerca(BANDERAS.filter(b=>!P.prog.banderas.includes(b.id))); if (b) return {texto:'Cruza las banderas 🚩 '+P.prog.banderas.length+'/'+BANDERAS.length, x:b.x, z:b.z, y:altura(b.x,b.z), emoji:'🚩'}; }
    if (v.id==='moto' && !tieneEstrella(P,'moto')) return {texto:'¡Salta la rampa a toda velocidad! 🏍️', x:RAMPA.x, z:RAMPA.z, y:RAMPA.base, emoji:'🏁'};
    if (v.id==='avion' && !tieneEstrella(P,'avion')){ const i = AROS.findIndex((a,i)=>!P.prog.aros.includes(i)); if (i>=0){ const a = AROS[i]; return {texto: v.aire ? 'Pasa por los aros ⭕ '+P.prog.aros.length+'/'+AROS.length : 'Acelera por la pista para despegar ✈️', x:a.x, z:a.z, y:a.y, emoji:'⭕'}; } }
    if (v.id==='barco' && !tieneEstrella(P,'barco')) return {texto:'Navega hasta la islita de Santi 👶', x:ISLITA.x, z:ISLITA.z, y:3, emoji:'👶'};
    if (v.id==='sub' && !tieneEstrella(P,'sub')) return {texto:'Baja al fondo del mar y busca el cofre 💎', x:COFRE.x, z:COFRE.z, y:altura(COFRE.x,COFRE.z), emoji:'💎'};
    if (v.id==='heli' && !tieneEstrella(P,'heli')){ const h = masCerca(HELIPUERTOS.filter(h=>!P.prog.helipuertos.includes(h.id))); if (h) return {texto:'Pósate en el helipuerto de '+h.nombre+' 🚁 '+P.prog.helipuertos.length+'/'+HELIPUERTOS.length, x:h.x, z:h.z, y:h.y, emoji:'🅗'}; }
    if (v.id==='motoagua' && !tieneEstrella(P,'motoagua')){ const b = masCerca(BOYAS.filter(b=>!P.prog.boyas.includes(b.id))); if (b) return {texto:'Pasa por las boyas 🛟 '+P.prog.boyas.length+'/'+BOYAS.length, x:b.x, z:b.z, y:0, emoji:'🛟'}; }
    if (v.id==='dino' && !tieneEstrella(P,'dino')){ const h = masCerca(HUEVOS.filter(h=>!P.prog.huevos.includes(h.id))); if (h) return {texto:'Busca los huevos 🥚 '+P.prog.huevos.length+'/'+HUEVOS.length, x:h.x, z:h.z, y:altura(h.x,h.z), emoji:'🥚'}; }
    if (v.id==='nave' && !tieneEstrella(P,'luna')) return {texto: v.aire ? (NOCHE ? '¡Sube, sube hasta Marte! 🔴' : '¡Sube, sube hasta la luna! 🌙') : 'Mantén A para encender los motores 🚀', x:LUNA.x, z:LUNA.z, y:LUNA.y-LUNA.r, emoji: NOCHE ? '🔴' : '🌙'};
    if (v.id==='nave' && NOCHE && !tieneEstrella(P,'ovni')) return {texto: v.aire ? 'Busca la nave extraterrestre en el espacio 👽' : 'Mantén A para subir al espacio 🚀', x:OVNI.x, z:OVNI.z, y:OVNI.y, emoji:'👽'};
    if (v.id==='ptero' && !tieneEstrella(P,'ptero')){ const i = AROS_NOCHE.findIndex((a,i)=>!P.prog.arosNoche.includes(i)); if (i>=0){ const a = AROS_NOCHE[i]; return {texto: v.aire ? 'Pasa por los aros de la noche ⭕ '+P.prog.arosNoche.length+'/'+AROS_NOCHE.length : 'Mantén A para que el pterodáctilo despegue 🦅', x:a.x, z:a.z, y:a.y, emoji:'⭕'}; } }
    if ((v.id==='barco' || v.id==='motoagua') && NOCHE && !tieneEstrella(P,'catatumbo')) return {texto:'Navega cerca de Maracaibo y mira el Catatumbo ⚡ '+P.prog.rayos+'/5', x:MARACAIBO.x, z:MARACAIBO.z + MARACAIBO.r + 30, y:0, emoji:'⚡'};
    return {texto:'¡Explora la isla! 🌴', x:null};
  }
  if (!tieneEstrella(P,'popo')){ const h = masCerca(HAMBURGUESAS.filter(h=>!P.comidas.has(h.id) && h.y < 30)); if (h) return {texto:'Busca hamburguesas 🍔', x:h.x, z:h.z, y:h.y, emoji:'🍔'}; }
  const orden = NOCHE ? ['familia','polarcita','carro','coro','ptero','catatumbo','maracaibo','luna','ovni','banos'] : ['carro','moto','familia','dino','avion','heli','barco','motoagua','sub','maracaibo','luna','banos'];
  for (const id of orden){
    if (tieneEstrella(P, id)) continue;
    if (id==='polarcita'){ const r = porId('romulo'); return {texto:'Visita a Rómulo en su bar 🍺', x:r.x, z:r.z, y:altura(r.x,r.z), emoji:'🍺'}; }
    if (id==='coro'){ const c = masCerca(P.chivos.filter(c=>!P.prog.chivos.includes(c.id))); if (c) return {texto: Math.hypot(J.x-CORO.x, J.z-CORO.z) < CORO.r + 30 ? 'Saluda a los chivos 🐐 '+P.prog.chivos.length+'/'+CHIVOS.length : 'Ve a Coro, la tierra de los chivos 🐐', x:c.x, z:c.z, y:altura(c.x,c.z), emoji:'🐐'}; continue; }
    if (id==='catatumbo'){ const b = P.vehiculos.find(v=>v.id==='motoagua'); return {texto:'Móntate en la moto de agua y ve a Maracaibo ⚡', x:b.x, z:b.z, y:b.y, emoji:'🛥️'}; }
    if (id==='ovni'){ const n = P.vehiculos.find(v=>v.id==='nave'); return {texto:'Móntate en la nave espacial y busca el ovni 👽', x:n.x, z:n.z, y:n.y, emoji:'🚀'}; }
    if (id==='familia'){ const f = masCerca(FAMILIA.filter(f=>!f.bebe && !P.saludos[f.id])); if (f) return {texto:'Saluda a '+f.nombre+' 👋', x:f.x, z:f.z, y:altura(f.x,f.z), emoji:'👋'}; continue; }
    if (id==='banos'){ const b = masCerca(BANOS.filter(b=>!P.prog.banos.includes(b.id))); if (b) return {texto:'Come 🍔 y ve a '+b.nombre+' 🚽', x:b.px, z:b.pz, y:altura(b.px,b.pz), emoji:'🚽'}; continue; }
    if (id==='maracaibo'){ if (enMaracaibo(J.x, J.z)){ const a = masCerca(AREPAS.filter(a=>!P.comidasArepas.has(a.id))); if (a) return {texto:'Come arepas 🫓 '+P.arepas+'/5', x:a.x, z:a.z, y:a.y, emoji:'🫓'}; } return {texto:'Cruza el puente hasta Maracaibo 🫓', x:PUENTE.x0, z:PUENTE.z0, y:altura(PUENTE.x0, PUENTE.z0), emoji:'🌉'}; }
    const vid = id==='luna' ? 'nave' : id;
    const vd = P.vehiculos.find(v=>v.id===vid);
    return {texto:'Móntate en '+vd.nombre+' '+vd.emoji, x:vd.x, z:vd.z, y:vd.y, emoji:vd.emoji};
  }
  return {texto: P.final ? '¡Lo lograste todo! 🌟' : '¡Explora la isla! 🌴', x:null};
}

/* ---------------- Jugar con amigos: lo que viaja por la red ----------------
   Cada aparato lleva su propia partida (sus hamburguesas, estrellas y popos
   bebés) y solo comparte dónde está y qué hace, quince veces por segundo.
   Aquí está lo puro: armar y leer esos paquetes, y los códigos de sala. */
const PERSONAJES_RED = [
  {id:'fernando', nombre:'Fernando', emoji:'🧢'}, {id:'tiojuan', nombre:'Tío Juan', emoji:'🦸'}, {id:'luca', nombre:'Luca', emoji:'🧒'},
  {id:'salomon', nombre:'Salomón', emoji:'🕶️'}, {id:'cucu', nombre:'Cucú', emoji:'👧'}, {id:'santi', nombre:'Santi', emoji:'👶'},
  {id:'mama', nombre:'Mamá', emoji:'💋'}, {id:'papa', nombre:'Papá', emoji:'🧔'}, {id:'abu', nombre:'Abu', emoji:'👵'},
  {id:'nacho', nombre:'Tío Nacho', emoji:'🤠'}, {id:'yanny', nombre:'Tía Yanny', emoji:'👩'}, {id:'tiofran', nombre:'Tío Fran', emoji:'💨'},
  {id:'romulo', nombre:'Rómulo', emoji:'🦝'}, {id:'beto', nombre:'Tío Beto', emoji:'👓'}, {id:'giuliana', nombre:'Tía Giuliana', emoji:'🧡'},
  {id:'penny', nombre:'Penny', emoji:'🐕', perro:'#222222'}, {id:'sheldon', nombre:'Sheldon', emoji:'🐕', perro:'#8a5a2a'}, {id:'srpopo', nombre:'Señor Popo', emoji:'💩'},
];
const ALFABETO_SALA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   /* sin I, O, 0 ni 1, que se confunden */
const VERSION_RED = 1;
const MAX_JUGADORES = 4;          /* el anfitrión y tres amigos */
function codigoSala(){ let c = ''; for (let i=0;i<4;i++) c += ALFABETO_SALA[Math.floor(Math.random()*ALFABETO_SALA.length)]; return c; }
function normalizarCodigo(t){ return String(t||'').toUpperCase().split('').filter(ch=>ALFABETO_SALA.includes(ch)).slice(0,4).join(''); }
function empaquetarEstado(P, pj, nombre){
  const J = P.J, v = P.veh, r = (n, d)=> Math.round(n*(d||100))/(d||100);
  return {t:'e', pj, n:nombre, x:r(J.x), y:r(J.y), z:r(J.z), a:r(J.ang), v: v ? v.id : '', m:r(J.mov,10), f:r(J.fase,10),
    na: J.nadando ? 1 : 0, su: J.suelo ? 1 : 0, c: v ? r(v.cabeceo) : 0, g: v ? r(v.giro) : 0, ve: v ? r(v.vel,10) : 0, ai: v && v.aire ? 1 : 0,
    pp: P.popitos.length, ga: P.ganas ? 1 : 0, es: P.estrellas.length};
}
function desempaquetarEstado(m){
  if (!m || typeof m !== 'object' || m.t !== 'e' || ![m.x, m.y, m.z].every(Number.isFinite)) return null;
  const num = (v, a, b)=> Number.isFinite(v) ? clamp(v, a, b) : 0;
  const pj = PERSONAJES_RED.some(p=>p.id===m.pj) ? m.pj : 'fernando';
  const nombre = String(m.n||'').replace(/[^\wáéíóúñÁÉÍÓÚÑ ]/g, '').slice(0, 14) || PERSONAJES_RED.find(p=>p.id===pj).nombre;
  return {pj, nombre, x:num(m.x,-LIMITE,LIMITE), y:num(m.y,-60,400), z:num(m.z,-LIMITE,LIMITE), ang:num(m.a,-7,7),
    veh: VEHICULOS_DEF.some(d=>d.id===m.v) ? m.v : '', mov:num(m.m,0,40), fase:num(m.f,0,1e7), nadando:!!m.na, suelo:!!m.su,
    cabeceo:num(m.c,-1,1), giro:num(m.g,-1,1), vel:num(m.ve,-20,80), aire:!!m.ai, popitos:num(m.pp,0,MAX_POPITOS)|0, ganas:!!m.ga, estrellas:num(m.es,0,8)|0};
}

/* ---- un paso de la partida (60 por segundo) ---- */
function pasoPartida(P, ent){
  ent = ent || {};
  P.t++;
  const jx = clamp(ent.jx||0, -1, 1), jy = clamp(ent.jy||0, -1, 1);
  const aNuevo = !!ent.a && !P.aPrev, bNuevo = !!ent.b && !P.bPrev, salirNuevo = !!ent.salir && !P.salirPrev;
  P.aPrev = !!ent.a; P.bPrev = !!ent.b; P.salirPrev = !!ent.salir;
  if (Number.isFinite(ent.camYaw)) P.camYaw = ent.camYaw;
  if (P.escena){ pasoEscena(P); pasoPerros(P); pasoPopitos(P); return; }
  const e2 = {jx, jy, a:!!ent.a, b:!!ent.b, aNuevo, bNuevo};
  if (P.veh){
    pasoVehiculo(P, P.veh, e2);
    P.J.x = P.veh.x; P.J.y = P.veh.y; P.J.z = P.veh.z; P.J.ang = P.veh.ang;
    if (salirNuevo) intentarBajar(P);
  } else {
    if (aNuevo && P.cercaVeh){ montar(P, P.cercaVeh); e2.aNuevo = false; e2.a = false; }
    if (P.veh) pasoVehiculo(P, P.veh, {jx:0, jy:0, a:false, b:false, aNuevo:false, bNuevo:false});
    else pasoPie(P, e2);
  }
  pasoPerros(P); pasoPopitos(P); pasoPopo(P); revisarRecogibles(P); revisarFamilia(P); revisarMisiones(P); revisarBanos(P);
  if (NOCHE) pasoNoche(P);
}
/* ---- lo que solo pasa de noche: el relámpago del Catatumbo sobre el lago y los chivos de Coro ---- */
function pasoNoche(P){
  const J = P.J, v = P.veh;
  /* el Catatumbo: en la lancha o el barco, cerca de la orilla de Maracaibo, cae un relámpago cada pocos segundos */
  const dM = Math.hypot(J.x-MARACAIBO.x, J.z-MARACAIBO.z);
  if (v && (v.id==='barco' || v.id==='motoagua') && dM < MARACAIBO.r + 90 && P.t - P.ultimoRayo > 60*4){
    P.ultimoRayo = P.t;
    const a = azar()*6.283, r = 40 + azar()*90;
    evento(P, 'rayo', {x: MARACAIBO.x + Math.cos(a)*r, z: MARACAIBO.z + Math.sin(a)*r});
    if (!tieneEstrella(P, 'catatumbo')){ P.prog.rayos++; evento(P, 'catatumboCuenta', {total:P.prog.rayos}); if (P.prog.rayos >= 5) darEstrella(P, 'catatumbo'); }
    if (P.t - P.catatumboDicho > 60*25){ P.catatumboDicho = P.t; decir(P, 'catatumbo'); }
  }
  /* Coro: al llegar se dice lo de los chivos, y cada chivo saludado cuenta */
  const dC = Math.hypot(J.x-CORO.x, J.z-CORO.z);
  if (dC < CORO.r + 6 && !P.prog.coroDicho){ P.prog.coroDicho = true; evento(P, 'coro'); decir(P, 'coro'); }
  for (const c of P.chivos){
    c.t++;
    if (c.t % 240 === Math.floor(c.id*30)){ c.ang = azar()*6.283; c.saltoT = 20; }
    const vel = c.saltoT > 0 ? 2.2 : 0.6; c.saltoT = Math.max(0, c.saltoT-1);
    let nx = c.x + Math.sin(c.ang)*vel*DT, nz = c.z + Math.cos(c.ang)*vel*DT;
    if (Math.hypot(nx-CORO.x, nz-CORO.z) > CORO.r || alturaBase(nx, nz) < 1.5){ c.ang = Math.atan2(CORO.x-c.x, CORO.z-c.z) + (azar()-0.5); }
    else { c.x = nx; c.z = nz; }
    if (dC < CORO.r + 30 && !P.prog.chivos.includes(c.id) && Math.hypot(c.x-J.x, c.z-J.z) < (v ? 4 : 2.6) && Math.abs(altura(c.x,c.z) - J.y) < 3){
      P.prog.chivos.push(c.id); P.puntos += 300; c.saltoT = 40; c.ang = Math.atan2(c.x-J.x, c.z-J.z);
      evento(P, 'chivo', {id:c.id, x:c.x, z:c.z, total:P.prog.chivos.length});
      if (P.prog.chivos.length >= CHIVOS.length) darEstrella(P, 'coro');
    }
  }
}

if (typeof module !== 'undefined' && module.exports){
  module.exports = {CLIPS, TONO_TTS, SIN_GRABACION, MISIONES, FAMILIA, PERROS_DEF, VEHICULOS_DEF, BANOS, HAMBURGUESAS, AROS, BANDERAS, CASAS, DECOR,
    RUTA, PISTA, RAMPA, MUELLE, COFRE, ISLITA, INICIO, HANGAR, FARO, PLAYA, MONTANA, PUEBLO, CANCHA, PARQUE, FUENTE, TAM, NSEG, SEG, MALLA, LIMITE, NIVEL_MAR,
    altura, alturaBase, alturaMalla, ola, enAgua, cercaRuta, puntoRuta, distPista, enMuelle, enRampa, crearPartida, pasoPartida, objetivo, exportar, importar,
    posSrPopo, puedeBajar, montar, obstaculosCerca, azar, SOLARES, MAX_POPITOS, MAX_JUGADORES, PERSONAJES_RED, DIALOGOS, CLAVES_DIALOGO, fraseDe, nombreDe, MAPA, NOCHE, CORO, CHIVOS, AROS_NOCHE, OVNI, decir, CLIPS_PJ, MARACAIBO, LUNA, PUENTE, enPuente, alturaPuente, enMaracaibo, CASAS_MCBO, PLAZA_MCBO, HELIPUERTOS, BOYAS, HUEVOS, AREPAS, alturaAgua, ALFABETO_SALA, codigoSala, normalizarCodigo, empaquetarEstado, desempaquetarEstado};
}
if (!EN_NAVEGADOR) return;

/* ============================================================
   VISTA — Three.js y el marcador en 2D
   ============================================================ */
if (typeof THREE === 'undefined'){
  document.body.insertAdjacentHTML('beforeend',
    '<p style="color:#fff;text-align:center;font-family:monospace;padding:40px">No se pudo cargar el motor 3D. Revisa tu conexión y recarga.</p>');
  return;
}
const gl = document.getElementById('gl'), hud = document.getElementById('hud');
const ctx = hud.getContext('2d');
let renderer;
try{
  renderer = new THREE.WebGLRenderer({canvas: gl, antialias: true, powerPreference:'high-performance'});
}catch(e){
  document.body.insertAdjacentHTML('beforeend',
    '<p style="color:#fff;text-align:center;font-family:monospace;padding:40px">Este navegador no puede dibujar en 3D (WebGL). Prueba con Chrome o Safari actualizados.</p>');
  return;
}
const MOVIL = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||'');
const CAL = {sombras:true, pixel: Math.min(window.devicePixelRatio||1, MOVIL ? 1.5 : 2), nivel:0};
renderer.setPixelRatio(CAL.pixel);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, 16/9, 0.4, 1600);
const luzSol = new THREE.DirectionalLight(0xfff1dc, 1.05);
luzSol.position.set(80, 140, 60);
luzSol.castShadow = true;
luzSol.shadow.mapSize.set(MOVIL ? 1024 : 2048, MOVIL ? 1024 : 2048);
luzSol.shadow.camera.near = 10; luzSol.shadow.camera.far = 420;
luzSol.shadow.camera.left = -70; luzSol.shadow.camera.right = 70;
luzSol.shadow.camera.top = 70; luzSol.shadow.camera.bottom = -70;
luzSol.shadow.bias = -0.0005; luzSol.shadow.normalBias = 0.04;
scene.add(luzSol); scene.add(luzSol.target);
const luzCielo = new THREE.HemisphereLight(0xcfe9ff, 0x4f8a3a, 0.6);
scene.add(luzCielo);
const luzAmb = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(luzAmb);
/* de noche la luz es la de la luna: azulada y tenue; el relámpago la sube un instante */
if (NOCHE){ luzSol.color.set(0x9fb8ff); luzSol.intensity = 0.32; luzCielo.color.set(0x2a3a6a); luzCielo.groundColor.set(0x101a2a); luzCielo.intensity = 0.3; luzAmb.intensity = 0.16; }
let rayoLuz = 0, flashT = 0;
function enfocarLuz(x, y, z){
  luzSol.position.set(x+90, y+150, z+70);
  luzSol.target.position.set(x, y, z);
  luzSol.target.updateMatrixWorld();
}
function bajarCalidad(){
  CAL.nivel++;
  if (CAL.nivel===1){ CAL.sombras = false; renderer.shadowMap.enabled = false; luzSol.castShadow = false;
    scene.traverse(o=>{ if (o.material){ (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true); } }); }
  else if (CAL.nivel===2){ renderer.setPixelRatio(1); }
  else if (CAL.nivel===3){ renderer.setPixelRatio(0.75); }
}
/* medidas lógicas del marcador: 540 de alto siempre; el ancho depende de la pantalla */
let W = 960, H = 540, esc = 1, kLog = 1;
function redimensionar(){
  const w = window.innerWidth, h = window.innerHeight, dpr = Math.min(window.devicePixelRatio||1, 2);
  renderer.setSize(w, h, false);
  gl.style.width = w+'px'; gl.style.height = h+'px';
  camera.aspect = w/h; camera.updateProjectionMatrix();
  hud.width = Math.round(w*dpr); hud.height = Math.round(h*dpr);
  hud.style.width = w+'px'; hud.style.height = h+'px';
  let k = h/540;
  if (w/k < 640) k = w/640;
  kLog = k; esc = k*dpr;
  W = w/k; H = h/k;
}
window.addEventListener('resize', redimensionar);
redimensionar();

/* ---------------- Sonido y música 8-bits (Web Audio) ---------------- */
let AC = null, motor = null;
function audio(){
  prepararClips();
  if (!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  if (AC && AC.state==='suspended') AC.resume();
}
function beep(freq, dur, tipo, vol, t0){
  if (!AC) return;
  try{
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = tipo||'square'; o.frequency.value = freq;
    g.gain.setValueAtTime(vol||0.08, AC.currentTime+(t0||0));
    g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime+(t0||0)+dur);
    o.connect(g); g.connect(AC.destination);
    o.start(AC.currentTime+(t0||0)); o.stop(AC.currentTime+(t0||0)+dur+0.02);
  }catch(e){}
}
/* ruido para el agua, el pedo y la descarga del baño */
function ruidoSonoro(dur, vol, fInicio, fFin, t0){
  if (!AC) return;
  try{
    const n = Math.floor(AC.sampleRate*dur), buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0);
    for (let i=0;i<n;i++) d[i] = Math.random()*2-1;
    const src = AC.createBufferSource(); src.buffer = buf;
    const f = AC.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(fInicio, AC.currentTime+(t0||0)); f.frequency.exponentialRampToValueAtTime(fFin, AC.currentTime+(t0||0)+dur);
    const g = AC.createGain(); g.gain.setValueAtTime(vol, AC.currentTime+(t0||0)); g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime+(t0||0)+dur);
    src.connect(f); f.connect(g); g.connect(AC.destination);
    src.start(AC.currentTime+(t0||0));
  }catch(e){}
}
const sfx = {
  salto(){ beep(520,0.06,'square',0.05); beep(780,0.1,'square',0.05,0.05); },
  brinco(){ beep(300,0.08,'square',0.06); beep(440,0.1,'square',0.06,0.06); },
  hamburguesa(){ [784,988,1175,1568].forEach((f,i)=>beep(f,0.09,'square',0.06,i*0.06)); },
  estrella(){ [523,659,784,1047,1319,1568,2093].forEach((f,i)=>beep(f,0.16,'square',0.07,i*0.09)); },
  pedo(grande){ const n = grande ? 18 : 10; for(let i=0;i<n;i++) beep(96-i*3+(i%2)*18, 0.11, 'sawtooth', grande ? 0.3 : 0.2, i*0.055); ruidoSonoro(0.5+(grande?0.4:0), 0.12, 300, 80); },
  eructo(){ [84,66,94,56,74,50,68,44].forEach((f,i)=>beep(f,0.15,'sawtooth',0.3,i*0.08)); },
  trueno(){ ruidoSonoro(1.6, 0.35, 900, 60, 0.35); ruidoSonoro(0.25, 0.3, 4000, 800, 0.05); },
  chivo(){ [660,620,700,640].forEach((f,i)=>beep(f,0.09,'sawtooth',0.12,i*0.08)); },
  ovni(){ [440,554,659,880,1108,1318].forEach((f,i)=>beep(f,0.18,'sine',0.12,i*0.12)); },
  plop(){ beep(180,0.05,'sine',0.2); beep(90,0.14,'sine',0.25,0.05); ruidoSonoro(0.12, 0.06, 900, 200, 0.06); },
  descarga(){ ruidoSonoro(2.4, 0.22, 1200, 200); for (let i=0;i<8;i++) beep(120+i*15, 0.12, 'sine', 0.05, 0.3+i*0.2); },
  puerta(){ beep(240,0.06,'square',0.05); beep(180,0.08,'square',0.05,0.06); },
  montar(){ [330,440,550].forEach((f,i)=>beep(f,0.09,'square',0.06,i*0.07)); },
  bajar(){ [550,440,330].forEach((f,i)=>beep(f,0.09,'square',0.06,i*0.07)); },
  no(){ beep(200,0.12,'square',0.06); beep(150,0.18,'square',0.06,0.12); },
  choque(){ beep(160,0.08,'square',0.09); beep(110,0.12,'triangle',0.09,0.05); ruidoSonoro(0.2, 0.1, 600, 100); },
  chapoteo(){ ruidoSonoro(0.45, 0.14, 2500, 300); },
  aro(){ [988,1319,1568].forEach((f,i)=>beep(f,0.1,'square',0.06,i*0.07)); },
  bandera(){ beep(880,0.08,'square',0.06); beep(1175,0.16,'square',0.06,0.08); },
  despegue(){ [220,330,440,660].forEach((f,i)=>beep(f,0.14,'sawtooth',0.05,i*0.08)); },
  aterriza(){ ruidoSonoro(0.3, 0.1, 800, 200); beep(180,0.1,'triangle',0.06); },
  rugido(){ for (let i=0;i<10;i++) beep(70+Math.sin(i)*20, 0.2, 'sawtooth', 0.22, i*0.07); ruidoSonoro(0.9, 0.15, 400, 120); },
  saludo(){ [659,784,988,1319].forEach((f,i)=>beep(f,0.08,'square',0.05,i*0.06)); },
  cofre(){ [523,659,784,1047,784,1047,1319,1568].forEach((f,i)=>beep(f,0.14,'square',0.07,i*0.1)); },
  perro(){ beep(600,0.06,'square',0.06); beep(500,0.06,'square',0.06,0.1); },
  final(){ [523,587,659,784,880,1047,1319,1568,2093].forEach((f,i)=>beep(f,0.2,'square',0.08,i*0.12)); },
  toque(){ beep(660,0.05,'square',0.04); },
};
/* el motor: un zumbido que sube con la velocidad, distinto en cada vehículo */
function motorArrancar(tipo){
  if (!AC) return;
  motorParar();
  try{
    const o = AC.createOscillator(), o2 = AC.createOscillator(), f = AC.createBiquadFilter(), g = AC.createGain();
    o.type = tipo==='avion' || tipo==='nave' ? 'sawtooth' : tipo==='sub' || tipo==='heli' ? 'sine' : tipo==='barco' || tipo==='motoagua' ? 'square' : tipo==='dino' ? 'triangle' : 'sawtooth';
    o2.type = 'square';
    f.type = 'lowpass'; f.frequency.value = tipo==='sub' ? 220 : 700;
    g.gain.value = 0;
    o.connect(f); o2.connect(f); f.connect(g); g.connect(AC.destination);
    o.start(); o2.start();
    motor = {o, o2, f, g, tipo};
  }catch(e){ motor = null; }
}
function motorParar(){ if (motor){ try{ motor.g.gain.setTargetAtTime(0, AC.currentTime, 0.1); motor.o.stop(AC.currentTime+0.4); motor.o2.stop(AC.currentTime+0.4); }catch(e){} motor = null; } }
function motorAjustar(vel, turbo){
  if (!motor || !AC) return;
  const v = Math.abs(vel);
  const base = motor.tipo==='avion' ? 90 + v*2.2 : motor.tipo==='sub' ? 40 + v*3 : motor.tipo==='barco' ? 50 + v*2.5 : motor.tipo==='moto' ? 70 + v*4.5 : 55 + v*3.2;
  try{
    motor.o.frequency.setTargetAtTime(base*(1+turbo*0.3), AC.currentTime, 0.05);
    motor.o2.frequency.setTargetAtTime(base*0.5, AC.currentTime, 0.05);
    motor.g.gain.setTargetAtTime(Math.min(0.09, 0.025 + v*0.002 + turbo*0.02), AC.currentTime, 0.1);
  }catch(e){}
}
const TEMA_ISLA = { bpm: 150,
  mel: [76,0,79,81, 83,0,81,79, 76,0,74,0, 72,74,76,0,
        74,0,76,79, 81,0,79,76, 74,0,72,0, 71,72,74,0,
        76,0,79,81, 83,0,86,83, 81,0,79,0, 76,79,81,0,
        83,81,79,76, 74,76,79,74, 72,0,74,0, 76,0,0,0],
  bajo:[52,52,59,52, 50,50,57,50, 48,48,55,48, 50,50,57,50,
        52,52,59,52, 55,55,62,55, 50,50,57,50, 52,59,52,0] };
const TEMA_MAR = { bpm: 96,
  mel: [67,0,0,71, 74,0,0,71, 69,0,0,67, 0,0,0,0,
        66,0,0,69, 74,0,0,69, 67,0,0,66, 0,0,0,0,
        67,0,0,71, 74,0,0,78, 76,0,0,74, 0,0,0,0,
        72,0,71,0, 69,0,67,0, 0,0,0,0, 0,0,0,0],
  bajo:[43,0,50,0, 41,0,48,0, 40,0,47,0, 41,0,48,0] };
const TEMA_CIELO = { bpm: 160,
  mel: [79,0,83,0, 86,0,83,79, 81,0,79,0, 78,0,0,0,
        79,0,83,0, 86,0,90,86, 83,0,81,0, 79,0,0,0,
        81,83,86,0, 88,86,83,0, 81,79,78,0, 79,0,0,0,
        83,0,86,0, 90,0,88,86, 83,0,86,0, 91,0,0,0],
  bajo:[55,62,55,62, 52,59,52,59, 50,57,50,57, 55,62,55,62] };
const TEMA_MENU = { bpm: 128,
  mel: [76,0,79,0, 81,0,79,76, 74,0,76,0, 72,0,0,0,
        76,0,79,0, 81,0,84,81, 79,0,76,0, 74,0,0,0],
  bajo:[48,55,48,55, 45,52,45,52, 41,48,41,48, 43,50,43,50] };
const frecuencia = n => 440*Math.pow(2,(n-69)/12);
function tonoAbs(freq, cuando, dur, tipo, vol){
  if (!AC) return;
  try{
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = tipo; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, cuando);
    g.gain.exponentialRampToValueAtTime(0.001, cuando+dur);
    o.connect(g); g.connect(AC.destination);
    o.start(cuando); o.stop(cuando+dur+0.02);
  }catch(e){}
}
let musPaso = 0, musProx = 0, musTema = null, musicaOn = true;
try{ musicaOn = localStorage.getItem('aventura3d.musica') !== 'no'; }catch(e){}
function programarMusica(tema){
  if (!AC || AC.state!=='running' || !musicaOn) return;
  if (tema !== musTema){ musTema = tema; musPaso = 0; }
  if (musProx < AC.currentTime) musProx = AC.currentTime + 0.05;
  const dur = 60/tema.bpm/2;
  while (musProx < AC.currentTime + 0.35){
    const m = tema.mel[musPaso % tema.mel.length];
    if (m) tonoAbs(frecuencia(m), musProx, dur*0.85, tema===TEMA_MAR ? 'sine' : 'square', tema===TEMA_MAR ? 0.04 : 0.024);
    if (musPaso % 2 === 0){
      const b = tema.bajo[(musPaso>>1) % tema.bajo.length];
      if (b) tonoAbs(frecuencia(b), musProx, dur*1.7, 'triangle', 0.04);
    }
    musPaso++; musProx += dur;
  }
}

/* ---------------- Entrada: teclado, palanca táctil, botones y mando ---------------- */
const keys = {};
let tick = 0;
for (const ev of ['gesturestart','gesturechange','gestureend']) document.addEventListener(ev, e=>e.preventDefault());
document.addEventListener('dblclick', e=>e.preventDefault());
document.addEventListener('touchmove', e=>e.preventDefault(), {passive:false});
document.addEventListener('contextmenu', e=>e.preventDefault());
/* un toque muy corto (menos de un cuadro) también cuenta: se guarda hasta el próximo paso */
const pulsadas = new Set();
addEventListener('keydown', e=>{
  if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)) e.preventDefault();
  keys[e.key.toLowerCase()] = true; pulsadas.add(e.key.toLowerCase());
  if (e.repeat) return;
  audio();
  if ((e.key==='v'||e.key==='V') && estado==='juego'){ vozEmpezar(); return; }
  procesarTecla(e.key);
});
addEventListener('keyup', e=>{ keys[e.key.toLowerCase()] = false; if (e.key==='v'||e.key==='V') vozParar(); });
addEventListener('blur', ()=>{ for (const k in keys) keys[k] = false; });
/* la palanca táctil: aparece donde se pone el dedo en la mitad izquierda */
const TOQUE = {palanca:null, botones:new Map()};
const BOTONES_TACTILES = [
  {id:'A', k:'a', txt:'A', color:'rgba(255,120,90,.40)', borde:'rgba(255,190,170,.9)', r:40, pos:()=>({x:W-52, y:H-112})},
  {id:'B', k:'b', txt:'B', color:'rgba(110,170,255,.40)', borde:'rgba(180,210,255,.9)', r:34, pos:()=>({x:W-130, y:H-52})},
  {id:'salir', k:'salir', txt:'🚪', color:'rgba(255,230,110,.40)', borde:'rgba(255,240,180,.9)', r:28, pos:()=>({x:W-52, y:H-210}), solo:'veh'},
  {id:'menu', k:'menu', txt:'☰', color:'rgba(255,255,255,.25)', borde:'rgba(255,255,255,.7)', r:20, pos:()=>({x:W-30, y:30})},
  {id:'voz', k:'voz', txt:'🎙️', color:'rgba(120,230,150,.40)', borde:'rgba(180,255,200,.9)', r:34, pos:()=>({x:W-218, y:H-64}), solo:'red'},
];
function botonTactilEn(x, y){
  let mejor = null, md = 1e9;
  for (const b of BOTONES_TACTILES){
    if (b.solo==='veh' && !(P && P.veh)) continue;
    if (b.solo==='red' && !redActiva()) continue;
    const p = b.pos(), d = Math.hypot(x-p.x, y-p.y);
    if (d < b.r*1.5 && d < md){ md = d; mejor = b; }
  }
  return mejor;
}
const aLogico = ev=>({x: ev.clientX/kLog, y: ev.clientY/kLog});
document.addEventListener('pointerdown', ev=>{
  audio();
  const p = aLogico(ev);
  if (estado==='juego' && !P.escena){
    const b = botonTactilEn(p.x, p.y);
    if (b){ TOQUE.botones.set(ev.pointerId, b); pulsadas.add(b.k); if (b.k==='voz'){ vozEmpezar(); ev.preventDefault(); return; } if (b.k==='a') procesarTecla(' '); if (b.k==='b') procesarTecla('Shift'); if (b.k==='salir') procesarTecla('e'); if (b.k==='menu') procesarTecla('Escape'); ev.preventDefault(); return; }
    if (p.x < W*0.5 && !TOQUE.palanca && ev.pointerType!=='mouse'){ TOQUE.palanca = {id:ev.pointerId, x0:p.x, y0:p.y, x:p.x, y:p.y}; ev.preventDefault(); return; }
    if (p.x < W*0.5 && !TOQUE.palanca && ev.pointerType==='mouse'){ TOQUE.palanca = {id:ev.pointerId, x0:p.x, y0:p.y, x:p.x, y:p.y}; ev.preventDefault(); return; }
  }
  clic(p.x, p.y);
}, true);
document.addEventListener('pointermove', ev=>{
  if (TOQUE.palanca && TOQUE.palanca.id===ev.pointerId){ const p = aLogico(ev); TOQUE.palanca.x = p.x; TOQUE.palanca.y = p.y; ev.preventDefault(); }
  else if (TOQUE.botones.has(ev.pointerId)){ const p = aLogico(ev); const b = botonTactilEn(p.x, p.y); if (b && b.k!==TOQUE.botones.get(ev.pointerId).k && (b.k==='a'||b.k==='b')){ TOQUE.botones.set(ev.pointerId, b); } }
}, true);
const soltar = ev=>{
  if (TOQUE.palanca && TOQUE.palanca.id===ev.pointerId) TOQUE.palanca = null;
  const b = TOQUE.botones.get(ev.pointerId); if (b && b.k==='voz') vozParar();
  TOQUE.botones.delete(ev.pointerId);
};
document.addEventListener('pointerup', soltar, true);
document.addEventListener('pointercancel', soltar, true);
addEventListener('blur', ()=>{ TOQUE.palanca = null; TOQUE.botones.clear(); vozParar(); });
function palancaTactil(){
  const p = TOQUE.palanca; if (!p) return {jx:0, jy:0};
  const R = 46;
  let dx = (p.x-p.x0)/R, dy = (p.y-p.y0)/R;
  const m = Math.hypot(dx, dy);
  if (m > 1){ dx /= m; dy /= m; }
  const zona = 0.12;
  if (m < zona) return {jx:0, jy:0};
  return {jx: dx, jy: -dy};
}
/* mandos: palanca analógica, A/B como en Fernando Bros, hombros para bajarse, + para el menú */
const MANDO = {activo:false, prev:{}, dirPrev:null, rep:0, jx:0, jy:0, a:false, b:false, salir:false, avisoT:0};
function leerMandos(){
  if (!navigator.getGamepads) return;
  let gps; try{ gps = navigator.getGamepads(); }catch(e){ return; }
  let hay = false, jx = 0, jy = 0, a = false, b = false, salir = false;
  const vozAntes = MANDO.voz; MANDO.voz = false;
  for (const gp of gps){
    if (!gp || !gp.connected) continue;
    hay = true;
    const ax = gp.axes[0]||0, ay = gp.axes[1]||0;
    const zona = v=> Math.abs(v) > 0.14 ? Math.sign(v)*Math.pow((Math.abs(v)-0.14)/0.86, 1.3) : 0;
    jx += zona(ax); jy -= zona(ay);
    const pulsado = i=>{ const bt = gp.buttons[i]; return !!(bt && (bt.pressed || bt.value > 0.5)); };
    if (pulsado(0)||pulsado(1)) a = true;
    if (pulsado(2)||pulsado(3)||pulsado(7)||pulsado(6)) b = true;
    if (pulsado(4)||pulsado(5)||pulsado(8)) salir = true;
    if (pulsado(10)) MANDO.voz = true;
    if (pulsado(14)) jx -= 1; if (pulsado(15)) jx += 1; if (pulsado(12)) jy += 1; if (pulsado(13)) jy -= 1;
    const P_ = {0:' ',1:' ',2:'Shift',3:'Shift',4:'e',5:'e',8:'e',9:'Escape',11:'t',12:'ArrowUp',13:'ArrowDown',14:'ArrowLeft',15:'ArrowRight'};
    for (const i in P_){
      const p = pulsado(+i), clave = gp.index+':'+i;
      if (p && !MANDO.prev[clave]){ audio(); procesarTecla(P_[i]); }
      MANDO.prev[clave] = p;
    }
    const dir = ax < -0.6 ? 'ArrowLeft' : ax > 0.6 ? 'ArrowRight' : ay < -0.6 ? 'ArrowUp' : ay > 0.6 ? 'ArrowDown' : null;
    if (estado!=='juego' && dir){
      if (MANDO.dirPrev !== dir || ++MANDO.rep > 18){ procesarTecla(dir); MANDO.rep = 0; }
    } else if (!dir) MANDO.dirPrev = null;
    if (dir) MANDO.dirPrev = dir;
  }
  if (hay !== MANDO.activo){ MANDO.activo = hay; document.body.classList.toggle('conMando', hay); }
  MANDO.jx = hay ? clamp(jx,-1,1) : 0; MANDO.jy = hay ? clamp(jy,-1,1) : 0; MANDO.a = a; MANDO.b = b; MANDO.salir = salir;
  if (MANDO.voz && !vozAntes) vozEmpezar(); else if (!MANDO.voz && vozAntes) vozParar();
}
addEventListener('gamepadconnected', ()=>{ MANDO.avisoT = 200; });
/* la entrada de este cuadro, juntando teclado, palanca táctil, botones y mando */
function leerEntrada(){
  let jx = 0, jy = 0;
  if (keys['arrowleft']||keys['a']) jx -= 1; if (keys['arrowright']||keys['d']) jx += 1;
  if (keys['arrowup']||keys['w']) jy += 1; if (keys['arrowdown']||keys['s']) jy -= 1;
  const t = palancaTactil(); jx += t.jx; jy += t.jy; jx += MANDO.jx; jy += MANDO.jy;
  const m = Math.hypot(jx, jy); if (m > 1){ jx /= m; jy /= m; }
  const tb = [...TOQUE.botones.values()].map(b=>b.k);
  const ent = {jx, jy,
    a: !!(keys[' ']||keys['z']||MANDO.a||tb.includes('a')||pulsadas.has(' ')||pulsadas.has('z')||pulsadas.has('a')),
    b: !!(keys['shift']||keys['x']||MANDO.b||tb.includes('b')||pulsadas.has('shift')||pulsadas.has('x')||pulsadas.has('b')),
    salir: !!(keys['e']||keys['enter']||keys['backspace']||MANDO.salir||tb.includes('salir')||pulsadas.has('e')||pulsadas.has('enter')||pulsadas.has('salir'))};
  pulsadas.clear();
  return ent;
}

/* ---------------- Materiales y el armador de cajitas ----------------
   Cada personaje, casa o vehículo se arma con cajas, bolas y cilindros
   de colores que se funden en UNA sola malla: cientos de cosas pesan poco. */
const colorCache = {};
function col(hex){ if (!colorCache[hex]) colorCache[hex] = new THREE.Color(hex).convertSRGBToLinear(); return colorCache[hex]; }
const lin = hex => new THREE.Color(hex).convertSRGBToLinear();
const matMate = ()=> new THREE.MeshLambertMaterial({vertexColors:true});
const matBrillo = (extra)=> new THREE.MeshPhongMaterial(Object.assign({vertexColors:true, shininess:42, specular: lin(0x606060)}, extra||{}));
class Armador {
  constructor(){ this.geos = []; }
  pieza(geo, color, x, y, z, rx, ry, rz, sx, sy, sz){
    const g = geo.index ? geo.toNonIndexed() : geo;
    const n = g.attributes.position.count, c = col(color), arr = new Float32Array(n*3);
    for (let i=0;i<n;i++){ arr[i*3]=c.r; arr[i*3+1]=c.g; arr[i*3+2]=c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    const m = new THREE.Matrix4();
    m.compose(new THREE.Vector3(x||0,y||0,z||0), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx||0, ry||0, rz||0)), new THREE.Vector3(sx||1, sy||1, sz||1));
    g.applyMatrix4(m);
    this.geos.push(g);
    return this;
  }
  caja(w,h,d,color,x,y,z,rx,ry,rz){ return this.pieza(new THREE.BoxGeometry(w,h,d), color, x,y,z,rx,ry,rz); }
  bola(r,color,x,y,z,seg,sx,sy,sz){ return this.pieza(new THREE.SphereGeometry(r, seg||10, seg? Math.max(5,seg-2):7), color, x,y,z,0,0,0,sx,sy,sz); }
  cil(r1,r2,h,color,x,y,z,rx,ry,rz,seg){ return this.pieza(new THREE.CylinderGeometry(r1,r2,h,seg||12), color, x,y,z,rx,ry,rz); }
  cono(r,h,color,x,y,z,seg,rx,ry,rz){ return this.pieza(new THREE.ConeGeometry(r,h,seg||10), color, x,y,z,rx,ry,rz); }
  geo(){
    let total = 0;
    for (const g of this.geos) total += g.attributes.position.count;
    const pos = new Float32Array(total*3), nor = new Float32Array(total*3), colr = new Float32Array(total*3);
    let o = 0;
    for (const g of this.geos){
      pos.set(g.attributes.position.array, o*3);
      nor.set(g.attributes.normal.array, o*3);
      colr.set(g.attributes.color.array, o*3);
      o += g.attributes.position.count;
      g.dispose();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor,3));
    geo.setAttribute('color', new THREE.BufferAttribute(colr,3));
    return geo;
  }
  malla(material, sombra){
    const m = new THREE.Mesh(this.geo(), material || matMate());
    if (sombra !== false){ m.castShadow = true; m.receiveShadow = true; }
    return m;
  }
}
function texturaTexto(txt, fondo, color, w, h, tam, fuente){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  if (fondo){ x.fillStyle = fondo; x.beginPath(); x.roundRect(2, 2, w-4, h-4, h*0.3); x.fill(); }
  const f = fuente||"'Fredoka','Arial Rounded MT Bold',Arial,sans-serif";
  x.font = 'bold '+tam+'px '+f;
  while (x.measureText(txt).width > w-16 && tam > 8){ tam--; x.font = 'bold '+tam+'px '+f; }   /* el nombre siempre cabe */
  x.fillStyle = color; x.textAlign='center'; x.textBaseline='middle';
  x.fillText(txt, w/2, h/2+tam*0.06);
  const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
}
function texturaCuadros(a, b, n){
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d'), s = 64/n;
  for (let i=0;i<n;i++) for (let j=0;j<n;j++){ x.fillStyle = (i+j)%2 ? a : b; x.fillRect(i*s, j*s, s, s); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.NearestFilter; return t;
}
let texResplandor = null;
function texturaResplandor(){
  if (texResplandor) return texResplandor;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'), g = x.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(0.3,'rgba(255,255,255,0.6)'); g.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0,0,128,128);
  texResplandor = new THREE.CanvasTexture(c); return texResplandor;
}
function letrero(txt, color, fondo, esc){
  const t = texturaTexto(txt, fondo||'rgba(20,20,40,0.72)', color||'#fff', 256, 64, 34);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({map:t, transparent:true, depthWrite:false}));
  sp.scale.set(2.8*(esc||1), 0.7*(esc||1), 1);
  return sp;
}

/* ---------------- El cielo, el sol y las nubes ---------------- */
const CIELO = NOCHE ? {arriba: lin(0x050a24), horizonte: lin(0x1b2b5c), arribaAgua: lin(0x02142a), horizonteAgua: lin(0x083058)} : {arriba: lin(0x2f7fe0), horizonte: lin(0xd6ecff), arribaAgua: lin(0x03305e), horizonteAgua: lin(0x0b5f9c)};
const cupula = new THREE.Mesh(new THREE.SphereGeometry(1400, 24, 12), new THREE.ShaderMaterial({
  uniforms: {arriba:{value:CIELO.arriba.clone()}, horizonte:{value:CIELO.horizonte.clone()}, sol:{value:(NOCHE ? new THREE.Vector3(-0.5,0.7,-0.3) : new THREE.Vector3(0.45,0.6,0.35)).normalize()}},
  vertexShader: 'varying vec3 vP; void main(){ vP = (modelMatrix*vec4(position,1.0)).xyz; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader: `uniform vec3 arriba; uniform vec3 horizonte; uniform vec3 sol; varying vec3 vP;
    void main(){
      vec3 d = normalize(vP - cameraPosition); float h = d.y; float t = pow(clamp(h*1.5, 0.0, 1.0), 0.55);
      vec3 c = mix(horizonte, arriba, t); float s = pow(max(dot(d, sol), 0.0), 18.0); c += vec3(1.0,0.85,0.6)*s*0.35;
      gl_FragColor = vec4(c, 1.0);
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }`,
  side: THREE.BackSide, depthWrite: false, fog: false,
}));
cupula.renderOrder = -10; cupula.frustumCulled = false;
scene.add(cupula);
const sol = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xfff2c0, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, fog:false}));
sol.scale.set(260, 260, 1); scene.add(sol);
if (NOCHE){ sol.material.color.set(0xe8f0ff); sol.scale.set(150, 150, 1); }
const nubes = (()=>{
  const A = new Armador();
  for (const [x,y,z,r] of [[0,0,0,7],[6,-1,1,5.5],[-6,-1,-1,5],[2,3,-2,4.5],[-3,2,2,4.2],[10,-2,-1,3.5],[-10,-2,1,3.2]]) A.bola(r, '#ffffff', x, y, z, 8, 1, 0.62, 1);
  const m = new THREE.InstancedMesh(A.geo(), new THREE.MeshLambertMaterial({vertexColors:true, emissive: lin(0x334455), emissiveIntensity:0.18, transparent:true, opacity:0.96}), 40);
  const M = new THREE.Matrix4(); m.datos = [];
  for (let i=0;i<40;i++){
    const d = {x:(azar()-0.5)*1500, z:(azar()-0.5)*1500, y:130+azar()*80, esc:0.9+azar()*1.6, v:1.5+azar()*2, rot:azar()*6.28};
    m.datos.push(d);
    M.compose(new THREE.Vector3(d.x,d.y,d.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0,d.rot,0)), new THREE.Vector3(d.esc,d.esc,d.esc));
    m.setMatrixAt(i, M);
  }
  m.frustumCulled = false; scene.add(m); return m;
})();
function pasoNubes(){
  const M = new THREE.Matrix4();
  nubes.datos.forEach((d,i)=>{
    d.x += d.v*DT; if (d.x > 800) d.x = -800;
    M.compose(new THREE.Vector3(d.x,d.y,d.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0,d.rot,0)), new THREE.Vector3(d.esc,d.esc,d.esc));
    nubes.setMatrixAt(i, M);
  });
  nubes.instanceMatrix.needsUpdate = true;
}
/* las gaviotas dan vueltas sobre la isla */
const gaviotas = (()=>{
  const A = new Armador();
  A.caja(0.9,0.06,0.28,'#ffffff', -0.45,0,0, 0,0,0.25).caja(0.9,0.06,0.28,'#ffffff', 0.45,0,0, 0,0,-0.25).caja(0.3,0.16,0.5,'#f0f0f0', 0,0,0).cono(0.06,0.2,'#ffb000', 0,0,0.32, 5, 1.57,0,0);
  const m = new THREE.InstancedMesh(A.geo(), matMate(), 18);
  m.datos = [];
  for (let i=0;i<18;i++) m.datos.push({cx:(azar()-0.5)*500, cz:(azar()-0.5)*500, r:40+azar()*80, y:40+azar()*50, a:azar()*6.28, v:(0.15+azar()*0.15)*(azar()<0.5?1:-1), fase:azar()*6.28});
  m.frustumCulled = false; scene.add(m); return m;
})();
function pasoGaviotas(){
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  gaviotas.datos.forEach((d,i)=>{
    d.a += d.v*DT; d.fase += DT*9;
    const x = d.cx + Math.cos(d.a)*d.r, z = d.cz + Math.sin(d.a)*d.r, y = d.y + Math.sin(d.fase*0.3)*2;
    const rumbo = Math.atan2(-Math.sin(d.a)*d.v, Math.cos(d.a)*d.v);
    e.set(0, rumbo, Math.sin(d.fase)*0.5);
    M.compose(new THREE.Vector3(x,y,z), q.setFromEuler(e), new THREE.Vector3(1.6,1.6,1.6));
    gaviotas.setMatrixAt(i, M);
  });
  gaviotas.instanceMatrix.needsUpdate = true;
}

/* ---------------- El terreno: una malla con colores por vértice ----------------
   Arena en la orilla, pasto de varios verdes, roca en las cuestas, nieve
   en la cima y fondo de mar azulado, con un poquito de ruido para que se
   vea pintado a mano. */
const terreno = (()=>{
  const n = NSEG+1, pos = new Float32Array(n*n*3), colr = new Float32Array(n*n*3);
  const arena = col('#f2dfa6'), arenaMojada = col('#d9c48a'), fondo = col('#2c5e83'), fondoHondo = col('#1a3d5c');
  const pasto = [col('#5fb040'), col('#52a238'), col('#6cbf4a'), col('#7ccb56'), col('#58aa3c')];
  const pastoAlto = col('#3f8f3a'), roca = col('#8d8a86'), rocaOscura = col('#6e6a66'), nieve = col('#f7f8fc');
  const c = new THREE.Color();
  for (let iy=0; iy<n; iy++) for (let ix=0; ix<n; ix++){
    const i = iy*n+ix, x = ix*SEG-MITAD, z = iy*SEG-MITAD, h = MALLA[i];
    pos[i*3] = x; pos[i*3+1] = h; pos[i*3+2] = z;
    const hx = MALLA[iy*n+Math.min(ix+1,NSEG)] - MALLA[iy*n+Math.max(ix-1,0)];
    const hz = MALLA[Math.min(iy+1,NSEG)*n+ix] - MALLA[Math.max(iy-1,0)*n+ix];
    const pend = Math.hypot(hx, hz)/(2*SEG);
    const r = ruido(x*0.08+3, z*0.08+7), r2 = ruido(x*0.5, z*0.5);
    if (h < -0.6){ c.copy(arenaMojada).lerp(fondo, clamp(-h/12, 0, 1)).lerp(fondoHondo, clamp((-h-14)/22, 0, 1)); c.multiplyScalar(0.92+r2*0.16); }
    else if (h < 1.2){ c.copy(arena).multiplyScalar(0.95+r2*0.1); }
    else {
      c.copy(pasto[Math.floor(r*4.99)]);
      const t = clamp((h-1.2)/1.0, 0, 1); c.lerp(arena, 1-t);
      if (h > 22) c.lerp(pastoAlto, clamp((h-22)/14, 0, 1));
      if (pend > 0.55) c.lerp(r2 > 0.5 ? roca : rocaOscura, clamp((pend-0.55)/0.35, 0, 1));
      if (h > 50) c.lerp(nieve, clamp((h-50)/6, 0, 1));
      c.multiplyScalar(0.94+r2*0.12);
    }
    colr[i*3] = c.r; colr[i*3+1] = c.g; colr[i*3+2] = c.b;
  }
  const idx = new Uint32Array(NSEG*NSEG*6); let o = 0;
  for (let iy=0; iy<NSEG; iy++) for (let ix=0; ix<NSEG; ix++){
    const a = ix + n*iy, b = ix + n*(iy+1), cc = (ix+1) + n*(iy+1), d = (ix+1) + n*iy;
    idx[o++] = a; idx[o++] = b; idx[o++] = d; idx[o++] = b; idx[o++] = cc; idx[o++] = d;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(colr, 3));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({vertexColors:true}));
  m.receiveShadow = true; m.castShadow = false;
  scene.add(m); return m;
})();

/* ---------------- El mar: olas, brillo del sol, espuma en la orilla ---------------- */
const agua = (()=>{
  const n = 130, lado = 1400, seg = lado/n, k = n+1;
  const pos = new Float32Array(k*k*3), prof = new Float32Array(k*k);
  for (let iy=0; iy<k; iy++) for (let ix=0; ix<k; ix++){
    const i = iy*k+ix, x = ix*seg-lado/2, z = iy*seg-lado/2;
    pos[i*3] = x; pos[i*3+1] = 0; pos[i*3+2] = z; prof[i] = alturaMalla(x, z);
  }
  const idx = new Uint32Array(n*n*6); let o = 0;
  for (let iy=0; iy<n; iy++) for (let ix=0; ix<n; ix++){
    const a = ix + k*iy, b = ix + k*(iy+1), c = (ix+1) + k*(iy+1), d = (ix+1) + k*iy;
    idx[o++] = a; idx[o++] = b; idx[o++] = d; idx[o++] = b; idx[o++] = c; idx[o++] = d;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('prof', new THREE.BufferAttribute(prof, 1));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
      t:{value:0}, bajo:{value:0}, sol:{value:new THREE.Vector3(0.45,0.6,0.35).normalize()},
      hondo:{value:lin(0x0d5c9a)}, claro:{value:lin(0x3fd0d8)}, espuma:{value:lin(0xffffff)}, cielo:{value:lin(0xbfe4ff)},
    }]),
    vertexShader: `
      uniform float t; attribute float prof;
      varying float vProf; varying vec3 vPos; varying vec3 vN;
      #include <fog_pars_vertex>
      void main(){
        vec3 p = position;
        float h = 0.22*sin(p.x*0.23 + t*1.3) + 0.16*sin(p.z*0.29 - t*1.1) + 0.1*sin((p.x+p.z)*0.11 + t*0.7);
        float dhx = 0.0506*cos(p.x*0.23 + t*1.3) + 0.011*cos((p.x+p.z)*0.11 + t*0.7);
        float dhz = 0.0464*cos(p.z*0.29 - t*1.1) + 0.011*cos((p.x+p.z)*0.11 + t*0.7);
        p.y = h;
        vN = vec3(0.0, 1.0, 0.0);
        vProf = prof;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        vPos = (modelMatrix * vec4(p, 1.0)).xyz;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: `
      uniform vec3 hondo, claro, espuma, cielo, sol; uniform float t, bajo;
      varying float vProf; varying vec3 vPos; varying vec3 vN;
      #include <fog_pars_fragment>
      void main(){
        vec3 V = normalize(cameraPosition - vPos);
        float dhx = 0.0506*cos(vPos.x*0.23 + t*1.3) + 0.011*cos((vPos.x+vPos.z)*0.11 + t*0.7) + 0.02*cos(vPos.x*1.3 + vPos.z*0.7 + t*2.6);
        float dhz = 0.0464*cos(vPos.z*0.29 - t*1.1) + 0.011*cos((vPos.x+vPos.z)*0.11 + t*0.7) + 0.02*cos(vPos.z*1.1 - vPos.x*0.6 + t*2.2);
        vec3 n = normalize(vec3(-dhx*4.0, 1.0, -dhz*4.0));
        if (bajo > 0.5) n = -n;
        float fres = pow(1.0 - max(dot(n, V), 0.0), 3.0);
        float prof = clamp(-vProf/16.0, 0.0, 1.0);
        vec3 c = mix(claro, hondo, prof);
        c = mix(c, cielo, fres*0.5);
        vec3 R = reflect(-normalize(sol), n);
        float spec = pow(max(dot(R, V), 0.0), 90.0);
        c += vec3(1.0, 0.97, 0.9)*spec*0.7;
        float orilla = smoothstep(-2.6, -0.1, vProf);
        float esp = orilla * (0.5 + 0.5*sin(vPos.x*0.6 + vPos.z*0.45 + t*2.0 + sin(vPos.x*0.17 + vPos.z*0.13)*3.0));
        esp += smoothstep(-0.9, -0.1, vProf)*0.5;
        c = mix(c, espuma, clamp(esp, 0.0, 1.0)*0.9);
        float alfa = mix(0.58, 0.9, prof) + fres*0.1;
        if (bajo > 0.5){ c = mix(c, hondo, 0.4) + vec3(0.2,0.3,0.35)*spec; alfa = 0.8; }
        gl_FragColor = vec4(c, alfa);
        #include <tonemapping_fragment>
        #include <encodings_fragment>
        #include <fog_fragment>
      }`,
    transparent: true, side: THREE.DoubleSide, fog: true, depthWrite: false,
  });
  const m = new THREE.Mesh(g, mat);
  m.renderOrder = 2; m.frustumCulled = false;
  scene.add(m); return m;
})();

/* ---------------- La carretera, la pista, el muelle y la rampa ---------------- */
const mundo = new THREE.Group(); scene.add(mundo);
/* una cinta que sigue una lista de puntos (con tangente y normal), pegada al terreno */
function cinta(muestras, a, b, color, alza, cerrada){
  const n = muestras.length, pos = new Float32Array(n*6), colr = new Float32Array(n*6), c = col(color);
  for (let i=0;i<n;i++){
    const m = muestras[i];
    const xa = m.x + m.nx*a, za = m.z + m.nz*a, xb = m.x + m.nx*b, zb = m.z + m.nz*b;
    pos[i*6] = xa; pos[i*6+1] = altura(xa, za)+alza; pos[i*6+2] = za;
    pos[i*6+3] = xb; pos[i*6+4] = altura(xb, zb)+alza; pos[i*6+5] = zb;
    for (let k=0;k<2;k++){ colr[i*6+k*3] = c.r; colr[i*6+k*3+1] = c.g; colr[i*6+k*3+2] = c.b; }
  }
  const segs = cerrada ? n : n-1, idx = new Uint32Array(segs*6); let o = 0;
  for (let i=0;i<segs;i++){ const j = (i+1)%n; idx[o++] = i*2; idx[o++] = j*2; idx[o++] = i*2+1; idx[o++] = j*2; idx[o++] = j*2+1; idx[o++] = i*2+1; }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(colr, 3));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeVertexNormals();
  return g;
}
(function construirCarretera(){
  const mat = new THREE.MeshLambertMaterial({vertexColors:true, polygonOffset:true, polygonOffsetFactor:-1, polygonOffsetUnits:-1});
  const asfalto = new THREE.Mesh(cinta(RUTA.M, -5, 5, '#4a4a55', 0.1, true), mat); asfalto.receiveShadow = true; mundo.add(asfalto);
  mundo.add(new THREE.Mesh(cinta(RUTA.M, -5.2, -4.6, '#e8e8ea', 0.14, true), mat));
  mundo.add(new THREE.Mesh(cinta(RUTA.M, 4.6, 5.2, '#e8e8ea', 0.14, true), mat));
  for (let i=0;i<RUTA.N;i+=8){
    const tramo = []; for (let k=0;k<5;k++) tramo.push(RUTA.M[(i+k)%RUTA.N]);
    mundo.add(new THREE.Mesh(cinta(tramo, -0.22, 0.22, '#ffd23f', 0.15, false), mat));
  }
  /* la pista de aterrizaje */
  const P_ = []; for (let z=PISTA.z0; z<=PISTA.z1; z+=4) P_.push({x:PISTA.x, z, nx:1, nz:0});
  const pista = new THREE.Mesh(cinta(P_, -PISTA.ancho/2, PISTA.ancho/2, '#6a6a72', 0.1, false), mat); pista.receiveShadow = true; mundo.add(pista);
  mundo.add(new THREE.Mesh(cinta(P_, -PISTA.ancho/2, -PISTA.ancho/2+0.7, '#ffffff', 0.14, false), mat));
  mundo.add(new THREE.Mesh(cinta(P_, PISTA.ancho/2-0.7, PISTA.ancho/2, '#ffffff', 0.14, false), mat));
  for (let i=0;i<P_.length-2;i+=3) mundo.add(new THREE.Mesh(cinta(P_.slice(i, i+2), -0.35, 0.35, '#ffffff', 0.15, false), mat));
  /* el muelle de madera con sus postes */
  const A = new Armador();
  const cx = (MUELLE.x0+MUELLE.x1)/2, cz = (MUELLE.z0+MUELLE.z1)/2, rot = Math.atan2(Math.cos(MUELLE.ang), Math.sin(MUELLE.ang));
  A.caja(MUELLE.ancho, 0.36, MUELLE.largo, '#a5713f', cx, MUELLE.alto-0.18, cz, 0, rot, 0);
  for (let i=0;i<=8;i++){
    const t = i/8, px = lerp(MUELLE.x0, MUELLE.x1, t), pz = lerp(MUELLE.z0, MUELLE.z1, t);
    for (const lado of [-1,1]){
      const ox = px - Math.sin(MUELLE.ang)*lado*(MUELLE.ancho/2-0.2), oz = pz + Math.cos(MUELLE.ang)*lado*(MUELLE.ancho/2-0.2);
      A.cil(0.16,0.16,5,'#7a4f2a', ox, MUELLE.alto-2.2, oz, 0,0,0,6);
      if (i%2===0) A.bola(0.2,'#e0c090', ox, MUELLE.alto+0.25, oz, 6);
    }
  }
  /* la rampa naranja con rayas blancas */
  const R = RAMPA, w = R.ancho/2, L = R.largo, hh = R.alto;
  const geoR = new THREE.BufferGeometry();
  const v = [
    /* piso */ -w,0,0,  w,0,0,  w,0,L,   -w,0,0,  w,0,L,  -w,0,L,
    /* tapa inclinada */ -w,0,0,  w,hh,L,  w,0,0,   -w,0,0,  -w,hh,L,  w,hh,L,
    /* pared de atrás */ -w,0,L,  w,hh,L,  -w,hh,L,   -w,0,L,  w,0,L,  w,hh,L,
    /* lados */ w,0,0,  w,hh,L,  w,0,L,    -w,0,0,  -w,0,L,  -w,hh,L,
  ];
  geoR.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  const cr = col('#ff7a1a'), colR = new Float32Array(v.length);
  for (let i=0;i<v.length/3;i++){ colR[i*3]=cr.r; colR[i*3+1]=cr.g; colR[i*3+2]=cr.b; }
  geoR.setAttribute('color', new THREE.BufferAttribute(colR, 3));
  geoR.computeVertexNormals();
  const M = new THREE.Matrix4().compose(new THREE.Vector3(R.x, R.base+0.02, R.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, R.ang, 0)), new THREE.Vector3(1,1,1));
  geoR.applyMatrix4(M);
  A.geos.push(geoR);
  for (let i=1;i<5;i++){ const t = i/5; A.caja(R.ancho-0.4, 0.08, 0.6, '#ffffff', R.x + R.tx*L*t, R.base + hh*t + 0.08, R.z + R.tz*L*t, -Math.atan2(hh, L), R.ang, 0); }
  /* el aro dorado sobre la rampa lo pone la lista de misiones */
  const m = A.malla(matMate()); mundo.add(m);
})();

/* ---------------- El pueblo ---------------- */
function techoGeo(w, d, alto){
  const s = new THREE.Shape(); s.moveTo(-w/2-0.6, 0); s.lineTo(w/2+0.6, 0); s.lineTo(0, alto); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {depth: d+1.2, bevelEnabled:false}); g.translate(0, 0, -(d+1.2)/2); return g;
}
const letreros = [];
function armarCasa(A, c){
  {
    const y = altura(c.x, c.z);
    A.caja(c.w, c.h, c.d, c.color, c.x, y + c.h/2, c.z);
    A.pieza(techoGeo(c.w, c.d, c.h*0.55), c.techo, c.x, y + c.h, c.z);
    A.caja(0.5, 0.9, 0.5, '#8a8a90', c.x + c.w*0.3, y + c.h + c.h*0.4, c.z + c.d*0.2);   /* la chimenea */
    /* la puerta hacia c.puerta y ventanas en los otros lados */
    const px = c.x + Math.sin(c.puerta)*(c.w/2), pz = c.z + Math.cos(c.puerta)*(c.d/2);
    const lados = [0, Math.PI/2, Math.PI, -Math.PI/2];
    for (const a of lados){
      const sx = Math.sin(a), sz = Math.cos(a), lx = a===0||a===Math.PI ? c.w : c.d;
      const bx = c.x + sx*(c.w/2), bz = c.z + sz*(c.d/2);
      const grueso = 0.16;
      if (Math.abs(envolver(a - c.puerta)) < 0.01){
        A.caja(a===0||a===Math.PI ? 1.3 : grueso, 2.2, a===0||a===Math.PI ? grueso : 1.3, '#6b3e1e', px + sx*grueso/2, y + 1.1, pz + sz*grueso/2);
        A.caja(a===0||a===Math.PI ? 0.16 : grueso+0.06, 0.16, a===0||a===Math.PI ? grueso+0.06 : 0.16, '#ffd23f', px + sx*grueso/2 + (a===0||a===Math.PI ? 0.4 : 0), y + 1.05, pz + sz*grueso/2 + (a===0||a===Math.PI ? 0 : 0.4));
      }
      for (const k of [-0.3, 0.3]){
        const wx = bx + (a===0||a===Math.PI ? k*lx : 0), wz = bz + (a===0||a===Math.PI ? 0 : k*lx);
        if (Math.abs(envolver(a - c.puerta)) < 0.01 && Math.abs(k) < 0.2) continue;
        A.caja(a===0||a===Math.PI ? 1.1 : grueso, 1.0, a===0||a===Math.PI ? grueso : 1.1, '#bfe9ff', wx + sx*grueso/2, y + c.h*0.55, wz + sz*grueso/2);
        A.caja(a===0||a===Math.PI ? 1.3 : grueso*1.3, 0.12, a===0||a===Math.PI ? grueso*1.3 : 1.3, '#ffffff', wx + sx*grueso/2, y + c.h*0.55 - 0.55, wz + sz*grueso/2);
      }
    }
    if (c.letrero){
      const sp = letrero((c.letrero==='BAR' ? '🍺 ' : c.letrero==='AREPAS' ? '🫓 ' : '🍔 ')+c.letrero, '#fff', c.letrero==='BAR' ? 'rgba(90,40,120,0.9)' : c.letrero==='AREPAS' ? 'rgba(20,90,160,0.9)' : 'rgba(200,60,30,0.9)', 1.6);
      sp.position.set(c.x, y + c.h + c.h*0.55 + 1.2, c.z); mundo.add(sp);
    }
    if (c.gasolinera){
      /* techito sobre postes y el surtidor rojo */
      const gx = c.x, gz = c.z + c.d/2 + 6;
      A.caja(12, 0.5, 7, '#ffffff', gx, y + 4.6, gz); A.caja(12.2, 0.5, 0.5, '#e63946', gx, y + 4.6, gz - 3.5); A.caja(12.2, 0.5, 0.5, '#e63946', gx, y + 4.6, gz + 3.5);
      for (const [ox,oz] of [[-5,-3],[5,-3],[-5,3],[5,3]]) A.cil(0.22,0.22,4.4,'#c8c8d0', gx+ox, y + 2.2, gz+oz, 0,0,0,8);
      A.caja(1.1, 1.8, 0.7, '#e63946', gx, y + 0.9, gz); A.caja(0.7, 0.5, 0.1, '#222', gx, y + 1.3, gz - 0.38); A.caja(0.25, 0.6, 0.25, '#222', gx + 0.6, y + 1.1, gz);
      const sp = letrero('⛽ GASOLINA', '#fff', 'rgba(220,50,40,0.92)', 1.6); sp.position.set(gx, y + 6.2, gz); mundo.add(sp);
    }
    if (c.nombre==='CASA DE FERNANDO'){
      const sp = letrero('🏠 CASA DE FERNANDO', '#ffe36e', 'rgba(20,20,60,0.85)', 1.8); sp.position.set(c.x, y + c.h*1.55 + 1.4, c.z); mundo.add(sp);
    }
    if (c.nombre==='CASA DE ABU'){ const sp = letrero('👵 CASA DE ABU', '#fff', 'rgba(40,80,160,0.85)', 1.6); sp.position.set(c.x, y + c.h*1.55 + 1.2, c.z); mundo.add(sp); }
    if (c.nombre==='HAMBURGUESERÍA'){
      /* la hamburguesa gigante del techo */
      const hg = hamburguesaGeo(); const mh = new THREE.Mesh(hg, matBrillo()); mh.scale.set(3.2,3.2,3.2); mh.position.set(c.x, y + c.h*1.55 + 1.6, c.z); mh.castShadow = true; mundo.add(mh); letreros.push({giro: mh});
    }
    if (c.nombre==='AREPERA'){
      const ma = new THREE.Mesh(arepaGeo(), matBrillo()); ma.scale.set(3.4,3.4,3.4); ma.position.set(c.x, y + c.h*1.55 + 1.4, c.z); ma.castShadow = true; mundo.add(ma); letreros.push({giro: ma});
    }
  }
}
(function construirPueblo(){
  const A = new Armador();
  for (const c of CASAS) armarCasa(A, c);
  /* la fuente de la plaza */
  const fy = altura(FUENTE.x, FUENTE.z);
  A.cil(FUENTE.r, FUENTE.r+0.3, 0.9, '#d9d9e0', FUENTE.x, fy+0.45, FUENTE.z, 0,0,0,20);
  A.cil(FUENTE.r-0.4, FUENTE.r-0.4, 0.2, '#4fc3f7', FUENTE.x, fy+0.85, FUENTE.z, 0,0,0,20);
  A.cil(0.35,0.5,2.2,'#d9d9e0', FUENTE.x, fy+1.9, FUENTE.z, 0,0,0,10); A.bola(0.5,'#4fc3f7', FUENTE.x, fy+3.1, FUENTE.z, 8);
  for (let i=0;i<8;i++){ const a = i/8*6.283; A.caja(0.5,0.5,0.5,'#ff6ec0', FUENTE.x + Math.cos(a)*(FUENTE.r+0.9), fy+0.25, FUENTE.z + Math.sin(a)*(FUENTE.r+0.9)); }
  /* la cancha de fútbol con sus porterías */
  const cy = altura(CANCHA.x, CANCHA.z);
  A.caja(CANCHA.w, 0.12, CANCHA.d, '#4caf50', CANCHA.x, cy+0.06, CANCHA.z);
  A.caja(CANCHA.w, 0.14, 0.25, '#ffffff', CANCHA.x, cy+0.08, CANCHA.z - CANCHA.d/2); A.caja(CANCHA.w, 0.14, 0.25, '#ffffff', CANCHA.x, cy+0.08, CANCHA.z + CANCHA.d/2);
  A.caja(0.25, 0.14, CANCHA.d, '#ffffff', CANCHA.x - CANCHA.w/2, cy+0.08, CANCHA.z); A.caja(0.25, 0.14, CANCHA.d, '#ffffff', CANCHA.x + CANCHA.w/2, cy+0.08, CANCHA.z);
  A.caja(0.25, 0.14, CANCHA.d, '#ffffff', CANCHA.x, cy+0.08, CANCHA.z);
  A.pieza(new THREE.RingGeometry(3, 3.25, 24), '#ffffff', CANCHA.x, cy+0.09, CANCHA.z, -Math.PI/2, 0, 0);
  for (const lado of [-1,1]){
    const gx = CANCHA.x + lado*CANCHA.w/2;
    A.cil(0.1,0.1,2.2,'#ffffff', gx, cy+1.1, CANCHA.z-3, 0,0,0,6); A.cil(0.1,0.1,2.2,'#ffffff', gx, cy+1.1, CANCHA.z+3, 0,0,0,6);
    A.cil(0.1,0.1,6.2,'#ffffff', gx, cy+2.2, CANCHA.z, Math.PI/2,0,0,6);
  }
  A.bola(0.45,'#ffffff', CANCHA.x+2, cy+0.55, CANCHA.z+1, 8);
  /* el parque: tobogán, columpios y arenero */
  const py = altura(PARQUE.x, PARQUE.z);
  A.caja(1.2, 0.2, 5, '#ffd23f', PARQUE.x, py+1.5, PARQUE.z, -0.55, 0, 0); A.caja(1.4, 0.3, 1.4, '#ff6ec0', PARQUE.x, py+2.75, PARQUE.z-2.4);
  for (const [ox,oz] of [[-0.6,-2.4],[0.6,-2.4],[-0.6,-3.2],[0.6,-3.2]]) A.cil(0.08,0.08,2.8,'#2a6ad0', PARQUE.x+ox, py+1.4, PARQUE.z+oz, 0,0,0,6);
  for (let i=0;i<4;i++) A.caja(0.9, 0.08, 0.3, '#2a6ad0', PARQUE.x, py+0.4+i*0.55, PARQUE.z-2.8);
  const sx = PARQUE.x+6, sz = PARQUE.z-1;
  A.cil(0.12,0.12,3,'#2a9c3a', sx-2.5, py+1.5, sz, 0,0,0,6); A.cil(0.12,0.12,3,'#2a9c3a', sx+2.5, py+1.5, sz, 0,0,0,6); A.cil(0.1,0.1,5.2,'#2a9c3a', sx, py+3, sz, 0,0,Math.PI/2,6);
  for (const ox of [-1.1, 1.1]){ A.caja(0.9,0.12,0.4,'#e63946', sx+ox, py+0.9, sz); A.cil(0.03,0.03,2.1,'#dddddd', sx+ox-0.4, py+1.95, sz, 0,0,0,4); A.cil(0.03,0.03,2.1,'#dddddd', sx+ox+0.4, py+1.95, sz, 0,0,0,4); }
  A.caja(5, 0.3, 4, '#f2dfa6', PARQUE.x-6, py+0.15, PARQUE.z+2); A.caja(5.4, 0.5, 0.4, '#a5713f', PARQUE.x-6, py+0.25, PARQUE.z); A.caja(5.4, 0.5, 0.4, '#a5713f', PARQUE.x-6, py+0.25, PARQUE.z+4);
  A.caja(0.4, 0.5, 4.4, '#a5713f', PARQUE.x-8.5, py+0.25, PARQUE.z+2); A.caja(0.4, 0.5, 4.4, '#a5713f', PARQUE.x-3.5, py+0.25, PARQUE.z+2);
  const spP = letrero('🛝 PARQUE DE CUCÚ', '#fff', 'rgba(200,60,140,0.9)', 1.6); spP.position.set(PARQUE.x, py+5, PARQUE.z); mundo.add(spP);
  const spC = letrero('⚽ CANCHA', '#fff', 'rgba(30,120,60,0.9)', 1.6); spC.position.set(CANCHA.x, cy+5, CANCHA.z - CANCHA.d/2 - 2); mundo.add(spC);
  /* el hangar del aeropuerto, con su manga de viento */
  const hy = altura(HANGAR.x, HANGAR.z);
  A.caja(HANGAR.w, HANGAR.h*0.55, HANGAR.d, '#c9ced6', HANGAR.x, hy + HANGAR.h*0.275, HANGAR.z);
  A.pieza(new THREE.CylinderGeometry(HANGAR.w/2, HANGAR.w/2, HANGAR.d, 18, 1, true, Math.PI/2, Math.PI), '#e8a33d', HANGAR.x, hy + HANGAR.h*0.55, HANGAR.z, Math.PI/2, 0, 0);
  A.caja(HANGAR.w-1, HANGAR.h*0.55, 0.3, '#5a6270', HANGAR.x, hy + HANGAR.h*0.275, HANGAR.z + HANGAR.d/2 - 0.2);
  A.cil(0.1,0.1,8,'#ffffff', PISTA.x + 12, PISTA.h+4, PISTA.z1-6, 0,0,0,6); A.cono(0.7, 2.6, '#ff7a1a', PISTA.x + 12, PISTA.h+8, PISTA.z1-6, 8, 0, 0, -Math.PI/2);
  const spH = letrero('✈️ AEROPUERTO', '#fff', 'rgba(40,60,120,0.9)', 2); spH.position.set(HANGAR.x, hy + HANGAR.h + 2.5, HANGAR.z); mundo.add(spH);
  /* el faro de tía Giuliana */
  const fy2 = altura(FARO.x, FARO.z);
  A.cil(2.2, 2.8, 16, '#ffffff', FARO.x, fy2+8, FARO.z, 0,0,0,16);
  for (let i=0;i<3;i++) A.cil(2.45-i*0.12, 2.6-i*0.12, 1.6, '#e63946', FARO.x, fy2+3+i*5, FARO.z, 0,0,0,16);
  A.cil(2.6, 2.6, 0.5, '#8a8a90', FARO.x, fy2+16.2, FARO.z, 0,0,0,16);
  A.cil(1.6, 1.6, 2.4, '#bfe9ff', FARO.x, fy2+17.6, FARO.z, 0,0,0,12);
  A.cono(2.4, 2.2, '#e63946', FARO.x, fy2+19.9, FARO.z, 12);
  A.bola(0.6, '#fff6a0', FARO.x, fy2+17.6, FARO.z, 8);
  const spF = letrero('🗼 FARO', '#fff', 'rgba(200,50,50,0.9)', 1.6); spF.position.set(FARO.x, fy2+23, FARO.z); mundo.add(spF);
  /* la playa de tío Fran: sombrilla y toalla */
  const by = altura(PLAYA.x, PLAYA.z);
  A.cil(0.06,0.06,2.6,'#ffffff', PLAYA.x-4, by+1.3, PLAYA.z-2, 0,0,0,6); A.cono(2.2, 0.9, '#ff6ec0', PLAYA.x-4, by+2.9, PLAYA.z-2, 10);
  A.caja(2.2, 0.06, 3.4, '#ff7a1a', PLAYA.x-3.5, by+0.05, PLAYA.z+1); A.bola(0.6,'#e63946', PLAYA.x+3, by+0.6, PLAYA.z+2, 8);
  const spB = letrero('🏖️ PLAYA', '#fff', 'rgba(230,140,40,0.9)', 1.6); spB.position.set(PLAYA.x, by+5.5, PLAYA.z); mundo.add(spB);
  /* la islita de Santi: cartel */
  const spS = letrero('👶 ISLITA DE SANTI', '#fff', 'rgba(60,160,220,0.9)', 2); spS.position.set(ISLITA.x, altura(ISLITA.x, ISLITA.z)+6, ISLITA.z); mundo.add(spS);
  const spM = letrero('⚓ PUERTO', '#fff', 'rgba(30,80,140,0.9)', 1.6); spM.position.set(MUELLE.x0, MUELLE.alto+5, MUELLE.z0); mundo.add(spM);
  const spMo = letrero('🏔️ MONTAÑA', '#fff', 'rgba(90,90,110,0.9)', 2.4); spMo.position.set(MONTANA.x, altura(MONTANA.x, MONTANA.z)+10, MONTANA.z); mundo.add(spMo);
  const m = A.malla(matMate()); mundo.add(m);
})();

/* ---------------- Lo que solo existe de noche: faroles, Coro con sus chivos, el bar, los aros de la noche y el ovni ---------------- */
const NOCHE_VISTA = (()=>{
  if (!NOCHE) return null;
  const V = {chivos: [], arosNoche: [], rayos: [], farolas: []};
  const A = new Armador(), glowTex = texturaResplandor();
  const brillo = (x, y, z, color, esc, alfa)=>{ const sp = new THREE.Sprite(new THREE.SpriteMaterial({map: glowTex, color, transparent:true, opacity: alfa||0.55, depthWrite:false, blending:THREE.AdditiveBlending})); sp.scale.set(esc, esc, 1); sp.position.set(x, y, z); mundo.add(sp); return sp; };
  /* faroles en cada casa y ventanas encendidas */
  for (const c of CASAS.concat(CASAS_MCBO)){
    const y = altura(c.x, c.z), px = c.x + Math.sin(c.puerta)*(c.w/2 + 2.5), pz = c.z + Math.cos(c.puerta)*(c.d/2 + 2.5);
    A.cil(0.12, 0.16, 4.2, '#3a3a44', px, y+2.1, pz, 0,0,0,6).bola(0.42, '#fff2b0', px, y+4.4, pz, 8);
    brillo(px, y+4.4, pz, 0xffd27a, 9, 0.6);
    for (const k of [-0.3, 0.3]){ const a = c.puerta + Math.PI; const wx = c.x + Math.sin(a)*(c.w/2 + 0.3) + Math.cos(a)*k*(a===0||Math.abs(a)===Math.PI ? c.w : c.d), wz = c.z + Math.cos(a)*(c.d/2 + 0.3) - Math.sin(a)*k*(a===0||Math.abs(a)===Math.PI ? c.w : c.d); brillo(wx, y + c.h*0.55, wz, 0xffe08a, 3.2, 0.5); }
  }
  /* la plaza y la fuente también tienen luz */
  for (const [x, z] of [[FUENTE.x+6, FUENTE.z+6], [FUENTE.x-6, FUENTE.z-6], [PLAZA_MCBO.x+8, PLAZA_MCBO.z], [PLAZA_MCBO.x-8, PLAZA_MCBO.z]]){ const y = altura(x, z); A.cil(0.12, 0.16, 4.2, '#3a3a44', x, y+2.1, z, 0,0,0,6).bola(0.42, '#fff2b0', x, y+4.4, z, 8); brillo(x, y+4.4, z, 0xffd27a, 9, 0.6); }
  /* el bar de Rómulo con su letrero de neón */
  { const bar = CASAS.find(c=>c.nombre==='BAR DE RÓMULO'); const y = altura(bar.x, bar.z);
    const neon = letrero('🍺 BAR DE RÓMULO · POLARCITA', '#fff', 'rgba(255,60,120,0.92)', 2.4); neon.position.set(bar.x, y + bar.h + 4.2, bar.z); mundo.add(neon); V.neon = neon;
    brillo(bar.x, y + bar.h + 4.2, bar.z, 0xff5aa0, 16, 0.45); }
  /* Coro: cerca, cartel y chivos */
  { const y = altura(CORO.x, CORO.z);
    for (let i=0;i<20;i++){ const a = i/20*6.283, a2 = (i+1)/20*6.283, r = CORO.r + 2; const x1 = CORO.x + Math.cos(a)*r, z1 = CORO.z + Math.sin(a)*r, x2 = CORO.x + Math.cos(a2)*r, z2 = CORO.z + Math.sin(a2)*r;
      if (alturaBase(x1, z1) < 1 || alturaBase(x2, z2) < 1) continue;
      const h1 = altura(x1, z1), h2 = altura(x2, z2);
      A.caja(0.2, 1.3, 0.2, '#8b5a2b', x1, h1+0.65, z1);
      for (const k of [0.5, 1.0]){ const dx = x2-x1, dz = z2-z1, L = Math.hypot(dx, dz); A.caja(L, 0.08, 0.1, '#a0703a', (x1+x2)/2, (h1+h2)/2 + k, (z1+z2)/2, 0, Math.atan2(dx, dz) + Math.PI/2, 0); } }
    const sp = letrero('🐐 CORO', '#fff', 'rgba(150,90,30,0.92)', 2.6); sp.position.set(CORO.x, y + 9, CORO.z); mundo.add(sp);
    A.cil(0.14, 0.14, 6, '#8b5a2b', CORO.x, y+3, CORO.z, 0,0,0,6);
    for (const c of CHIVOS){
      const g = new THREE.Group(); const B = new Armador(); const col = c.id % 3 === 0 ? '#d8c8a8' : c.id % 3 === 1 ? '#f4f4f0' : '#8a6a4a';
      B.caja(0.55, 0.5, 1.0, col, 0, 0.75, 0).caja(0.34, 0.34, 0.42, col, 0, 1.12, 0.62).caja(0.24, 0.12, 0.2, '#f0b0b0', 0, 1.04, 0.86)
       .caja(0.06, 0.06, 0.04, '#111', -0.1, 1.2, 0.84).caja(0.06, 0.06, 0.04, '#111', 0.1, 1.2, 0.84)
       .cono(0.05, 0.3, '#5a4a3a', -0.12, 1.4, 0.55, 5, -0.5, 0, 0.3).cono(0.05, 0.3, '#5a4a3a', 0.12, 1.4, 0.55, 5, -0.5, 0, -0.3)
       .caja(0.1, 0.18, 0.06, col, -0.2, 1.1, 0.5, 0, 0, 0.6).caja(0.1, 0.18, 0.06, col, 0.2, 1.1, 0.5, 0, 0, -0.6)
       .caja(0.1, 0.2, 0.1, col, 0, 0.85, -0.55, 0.6, 0, 0).caja(0.16, 0.24, 0.1, '#e8e8e0', 0, 0.78, 0.86);
      for (const [x, z] of [[-0.18, 0.32], [0.18, 0.32], [-0.18, -0.32], [0.18, -0.32]]) B.caja(0.12, 0.5, 0.12, '#4a3a2a', x, 0.25, z);
      g.add(B.malla(matMate())); g.position.set(c.x, altura(c.x, c.z), c.z); mundo.add(g); V.chivos.push(g); }
  }
  /* los aros de la noche, violeta y brillantes, para el pterodáctilo */
  AROS_NOCHE.forEach((a, i)=>{
    const m = new THREE.Mesh(new THREE.TorusGeometry(a.r, 0.55, 10, 30), new THREE.MeshPhongMaterial({color: lin(0xc07dff), emissive: lin(0x6a2aa0), shininess: 80}));
    m.position.set(a.x, a.y, a.z);
    const nudo = new THREE.Sprite(new THREE.SpriteMaterial({map: glowTex, color: 0xd09aff, transparent:true, opacity:0.55, depthWrite:false, blending:THREE.AdditiveBlending})); nudo.scale.set(a.r*1.8, a.r*1.8, 1); m.add(nudo);
    const num = letrero(String(i+1), '#fff', 'rgba(120,40,180,0.9)', 2.2); num.position.y = a.r + 2.5; m.add(num);
    mundo.add(m); V.arosNoche.push(m);
  });
  /* la nave extraterrestre, con sus luces, sus tres extraterrestres y el rayo de luz */
  { const g = new THREE.Group(); const B = new Armador();
    B.cil(13, 17, 2.4, '#9aa4b8', 0, 0, 0, 0,0,0, 28).cil(17, 13, 1.6, '#7a8498', 0, -2.0, 0, 0,0,0, 28).bola(6.5, '#7de0ff', 0, 1.6, 0, 16, 1, 0.75, 1).cil(2.2, 2.2, 1.0, '#5a6270', 0, -3.2, 0, 0,0,0, 12);
    g.add(B.malla(new THREE.MeshPhongMaterial({vertexColors:true, shininess: 90})));
    V.luces = []; for (let i=0;i<12;i++){ const a = i/12*6.283; const l = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 6), new THREE.MeshBasicMaterial({color: i%3===0 ? 0xff5a5a : i%3===1 ? 0x7dffa0 : 0xffe36e})); l.position.set(Math.cos(a)*15.2, -0.6, Math.sin(a)*15.2); g.add(l); V.luces.push(l); }
    V.extraterrestres = [];
    for (let i=0;i<3;i++){ const a = i/3*6.283 + 0.6; const e = new THREE.Group(); const E = new Armador();
      E.bola(0.55, '#7ddc5a', 0, 1.75, 0, 10, 1.1, 1.25, 1).caja(0.46, 0.7, 0.3, '#5ab04a', 0, 1.0, 0).bola(0.17, '#111', -0.2, 1.85, 0.42, 8, 1, 1.6, 0.6).bola(0.17, '#111', 0.2, 1.85, 0.42, 8, 1, 1.6, 0.6)
       .caja(0.14, 0.6, 0.14, '#7ddc5a', -0.2, 0.3, 0).caja(0.14, 0.6, 0.14, '#7ddc5a', 0.2, 0.3, 0).cil(0.03, 0.03, 0.5, '#7ddc5a', 0, 2.5, 0, 0,0,0,4).bola(0.1, '#ff5aa0', 0, 2.8, 0, 6);
      e.add(E.malla(matMate()));
      const brazo = (s)=>{ const b = new THREE.Group(); b.position.set(s*0.32, 1.3, 0); b.add(new Armador().caja(0.12, 0.6, 0.12, '#7ddc5a', 0, -0.3, 0).malla(matMate())); e.add(b); return b; };
      e.brazos = [brazo(-1), brazo(1)];
      e.position.set(Math.cos(a)*9, 1.2, Math.sin(a)*9); e.rotation.y = -a + Math.PI/2; g.add(e); V.extraterrestres.push(e); }
    const haz = new THREE.Mesh(new THREE.ConeGeometry(16, 44, 24, 1, true), new THREE.MeshBasicMaterial({color: 0x9dffb0, transparent:true, opacity:0.22, depthWrite:false, side: THREE.DoubleSide}));
    haz.position.y = -25; haz.rotation.x = Math.PI; haz.visible = false; g.add(haz); V.haz = haz;
    const et = letrero('👽 NAVE EXTRATERRESTRE', '#fff', 'rgba(40,160,80,0.9)', 4); et.position.y = 12; g.add(et);
    g.position.set(OVNI.x, OVNI.y, OVNI.z); scene.add(g); V.ovni = g;
  }
  const m = A.malla(matMate()); mundo.add(m);
  return V;
})();
/* el relámpago del Catatumbo: un rayo blanco en zigzag del cielo al agua, que dura un instante */
function lanzarRayo(x, z){
  if (!NOCHE_VISTA) return;
  const A = new Armador(); let px = x, py = 260, pz = z;
  for (let i=0;i<14;i++){ const nx = px + (azar()-0.5)*22, nz = pz + (azar()-0.5)*22, ny = Math.max(0, py - 260/14); const dx = nx-px, dy = ny-py, dz = nz-pz, L = Math.hypot(dx, dy, dz);
    const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3(dx/L, dy/L, dz/L)));
    A.cil(0.5, 0.5, L, '#f4f8ff', (px+nx)/2, (py+ny)/2, (pz+nz)/2, e.x, e.y, e.z, 5); px = nx; py = ny; pz = nz; }
  const m = A.malla(new THREE.MeshBasicMaterial({vertexColors:true})); scene.add(m);
  NOCHE_VISTA.rayos.push({m, t: 14});
  rayoLuz = 1.4; flashT = 9;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xdfe8ff, transparent:true, opacity:0.8, depthWrite:false, blending:THREE.AdditiveBlending})); sp.scale.set(90, 90, 1); sp.position.set(x, 120, z); scene.add(sp); NOCHE_VISTA.rayos.push({m: sp, t: 10});
}

/* ---------------- Maracaibo y su puente sobre el lago ---------------- */
function arepaGeo(){
  const A = new Armador();
  A.cil(0.55,0.5,0.28,'#f3e2b8', 0,0.14,0, 0,0,0,16).cil(0.5,0.5,0.06,'#e0c090', 0,0.31,0, 0,0,0,16)
   .caja(0.7,0.14,0.16,'#ffd23f', 0,0.36,0.1).caja(0.6,0.1,0.12,'#ffffff', 0,0.44,0.08).caja(0.5,0.06,0.1,'#e63946', 0,0.5,0.06);
  return A.geo();
}
const geoArepa = arepaGeo();
const arepasMesh = AREPAS.map(a=>{
  const m = new THREE.Mesh(geoArepa, matBrillo()); m.scale.set(1.4,1.4,1.4); m.position.set(a.x, a.y, a.z); m.castShadow = true;
  const brillo = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xfff0c0, transparent:true, opacity:0.45, depthWrite:false, blending:THREE.AdditiveBlending}));
  brillo.scale.set(2.2,2.2,1); brillo.position.y = 0.4; m.add(brillo);
  mundo.add(m); return m;
});
(function construirMaracaibo(){
  const A = new Armador();
  for (const c of CASAS_MCBO) armarCasa(A, c);
  /* la plaza con su sol de Maracaibo */
  const py = altura(PLAZA_MCBO.x, PLAZA_MCBO.z);
  A.cil(6, 6.4, 0.5, '#e8d8b0', PLAZA_MCBO.x, py+0.25, PLAZA_MCBO.z, 0,0,0,20);
  A.cil(0.5, 0.7, 4, '#d9d9e0', PLAZA_MCBO.x, py+2.5, PLAZA_MCBO.z, 0,0,0,10);
  A.bola(1.2, '#ffd23f', PLAZA_MCBO.x, py+5.4, PLAZA_MCBO.z, 10);
  for (let i=0;i<8;i++){ const a = i/8*6.283; A.caja(1.4, 0.3, 0.3, '#ffb000', PLAZA_MCBO.x + Math.cos(a)*1.9, py+5.4, PLAZA_MCBO.z + Math.sin(a)*1.9, 0, -a, 0); }
  for (let i=0;i<6;i++){ const a = i/6*6.283; A.caja(0.5,0.5,0.5,'#4fc3f7', PLAZA_MCBO.x + Math.cos(a)*7.2, py+0.25, PLAZA_MCBO.z + Math.sin(a)*7.2); }
  /* el puente: tablero, barandas y pilotes hasta el fondo */
  const pasos = Math.max(8, Math.round(PUENTE.L/4)), muestras = [];
  for (let i=0;i<=pasos;i++){ const t = i/pasos*PUENTE.L; muestras.push({x:PUENTE.x0 + PUENTE.ux*t, z:PUENTE.z0 + PUENTE.uz*t, nx:-PUENTE.uz, nz:PUENTE.ux}); }
  const mat = new THREE.MeshLambertMaterial({vertexColors:true, polygonOffset:true, polygonOffsetFactor:-1, polygonOffsetUnits:-1});
  const tablero = new THREE.Mesh(cinta(muestras, -PUENTE.ancho/2, PUENTE.ancho/2, '#5a5a66', 0.12, false), mat); tablero.receiveShadow = true; mundo.add(tablero);
  mundo.add(new THREE.Mesh(cinta(muestras, -0.25, 0.25, '#ffd23f', 0.16, false), mat));
  for (const lado of [-1, 1]){
    mundo.add(new THREE.Mesh(cinta(muestras, lado*(PUENTE.ancho/2-0.5), lado*PUENTE.ancho/2, '#e8e8ea', 0.16, false), mat));
    for (let i=0;i<=pasos;i++){ const m = muestras[i], h = altura(m.x, m.z); A.caja(0.16, 1.2, 0.16, '#e8e8ea', m.x + m.nx*lado*(PUENTE.ancho/2-0.3), h+0.7, m.z + m.nz*lado*(PUENTE.ancho/2-0.3)); }
    const b = []; for (const m of muestras) b.push({x:m.x + m.nx*lado*(PUENTE.ancho/2-0.3), z:m.z + m.nz*lado*(PUENTE.ancho/2-0.3), nx:m.nx, nz:m.nz});
    mundo.add(new THREE.Mesh(cinta(b, -0.08, 0.08, '#e8e8ea', 1.3, false), mat));
  }
  /* Inspirado en el puente General Rafael Urdaneta de Maracaibo: torres de
     concreto beige en forma de A (pórticos), con los cables en abanico desde
     la punta hasta el tablero, y pilotes dobles entre torre y torre. */
  const BEIGE = '#d9c6a1', BEIGE2 = '#c9b48c', CABLE = '#e6e6ea', giroP = Math.atan2(PUENTE.ux, PUENTE.uz);
  const nx = -PUENTE.uz, nz = PUENTE.ux;
  const barra = (ax, ay, az, bx, by, bz, r, color)=>{                 /* un cilindro de un punto a otro */
    const dx = bx-ax, dy = by-ay, dz = bz-az, L = Math.hypot(dx, dy, dz);
    const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3(dx/L, dy/L, dz/L)));
    A.cil(r, r, L, color, (ax+bx)/2, (ay+by)/2, (az+bz)/2, e.x, e.y, e.z, 6);
  };
  const viga = (ax, ay, az, bx, by, bz, w, d, color)=>{                /* una viga cuadrada de un punto a otro */
    const dx = bx-ax, dy = by-ay, dz = bz-az, L = Math.hypot(dx, dy, dz);
    const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3(dx/L, dy/L, dz/L)));
    A.caja(w, L, d, color, (ax+bx)/2, (ay+by)/2, (az+bz)/2, e.x, e.y, e.z);
  };
  const enT = (t, u, y)=>[PUENTE.x0 + PUENTE.ux*t + nx*u, y, PUENTE.z0 + PUENTE.uz*t + nz*u];
  const torres = [0.2, 0.4, 0.6, 0.8].map(k=>k*PUENTE.L);
  for (const t of torres){
    const [cx, , cz] = enT(t, 0, 0), h = altura(cx, cz), fondo = alturaAgua(cx, cz) - 2, top = h + 24;
    /* la base en el agua y las dos patas inclinadas de cada lado */
    A.caja(20, 3, 6, BEIGE2, cx, NIVEL_MAR - 0.2, cz, 0, giroP, 0);
    for (const lado of [-1, 1]){
      const [bx, , bz] = enT(t, lado*8.5, 0), [dx, , dz] = enT(t, lado*6.2, 0), [tx, , tz] = enT(t, lado*2.2, 0);
      viga(bx, fondo, bz, bx, NIVEL_MAR + 1.2, bz, 2.4, 2.4, BEIGE2);                 /* el pilote bajo el agua */
      viga(bx, NIVEL_MAR + 1, bz, dx, h - 1, dz, 2.2, 2.6, BEIGE);                     /* pata gruesa hasta el tablero */
      viga(dx, h - 1, dz, tx, top, tz, 1.6, 2.2, BEIGE);                               /* pata fina hasta la punta */
    }
    const [l1x, , l1z] = enT(t, -6.2, 0), [l2x, , l2z] = enT(t, 6.2, 0);
    A.caja(13.2, 1.6, 2.6, BEIGE, cx, h - 1.2, cz, 0, giroP, 0);                       /* travesaño a la altura del tablero */
    A.caja(5.6, 1.8, 2.4, BEIGE, cx, top + 0.6, cz, 0, giroP, 0);                      /* la punta */
    A.caja(6.4, 0.5, 3.0, '#f2ece0', cx, top + 1.75, cz, 0, giroP, 0);
    for (const lado of [-1, 1]) A.caja(0.5, 0.5, 0.5, '#ff3b30', cx + nx*lado*2.6, top + 2.2, cz + nz*lado*2.6); /* luces rojas para el avión */
    /* los cables: en abanico desde la punta hasta el tablero, hacia los dos lados */
    for (const lado of [-1, 1]) for (const dir of [-1, 1]) for (const dist of [7, 13, 19, 25]){
      const tt = t + dir*dist; if (tt < 4 || tt > PUENTE.L - 4) continue;
      const [ax, , az] = enT(t, lado*2.2, 0), [bx, , bz] = enT(tt, lado*(PUENTE.ancho/2 - 0.4), 0);
      barra(ax, top - 0.6, az, bx, altura(bx, bz) + 0.3, bz, 0.07, CABLE);
    }
  }
  /* pilotes dobles entre las torres, con su travesaño */
  for (let i=1;i<pasos;i+=2){
    const m = muestras[i], t = i/pasos*PUENTE.L;
    if (torres.some(tt=>Math.abs(tt-t) < 6)) continue;
    const h = altura(m.x, m.z), fondo = alturaAgua(m.x, m.z) - 2;
    for (const lado of [-1, 1]) A.caja(1.2, h-fondo, 1.6, BEIGE, m.x + m.nx*lado*3.4, (h+fondo)/2, m.z + m.nz*lado*3.4, 0, giroP, 0);
    A.caja(PUENTE.ancho, 1.0, 1.6, BEIGE, m.x, h-0.6, m.z, 0, giroP, 0);
  }
  /* los helipuertos: círculo con su H */
  for (const h of HELIPUERTOS){
    A.cil(6, 6, 0.24, '#3a3a44', h.x, h.y+0.12, h.z, 0,0,0,24);
    A.pieza(new THREE.RingGeometry(5.2, 5.8, 32), '#ffffff', h.x, h.y+0.26, h.z, -Math.PI/2, 0, 0);
    A.caja(0.6, 0.04, 3.4, '#ffffff', h.x-1.2, h.y+0.26, h.z); A.caja(0.6, 0.04, 3.4, '#ffffff', h.x+1.2, h.y+0.26, h.z); A.caja(2.4, 0.04, 0.6, '#ffffff', h.x, h.y+0.26, h.z);
  }
  /* la plataforma de la nave */
  const nv = VEHICULOS_DEF.find(v=>v.id==='nave'), ny = altura(nv.x, nv.z);
  A.cil(5, 5.4, 0.4, '#5a5a66', nv.x, ny+0.2, nv.z, 0,0,0,20); A.pieza(new THREE.RingGeometry(3.6, 4.4, 24), '#ffd23f', nv.x, ny+0.42, nv.z, -Math.PI/2, 0, 0);
  A.cil(0.3, 0.3, 9, '#c8c8d0', nv.x+5.5, ny+4.5, nv.z+2, 0,0,0,8); A.caja(2.4, 0.3, 0.3, '#c8c8d0', nv.x+4.4, ny+8.5, nv.z+2);
  /* el nido del dinosaurio */
  const dv = VEHICULOS_DEF.find(v=>v.id==='dino'), dy = altura(dv.x, dv.z);
  A.cil(4.5, 5, 0.6, '#a5713f', dv.x, dy+0.3, dv.z, 0,0,0,16);
  const m = A.malla(matMate()); mundo.add(m);
  const carteles = [['🫓 MARACAIBO', 'rgba(20,90,160,0.92)', MARACAIBO.x, py+9, MARACAIBO.z-6, 3], ['🌉 PUENTE', 'rgba(90,90,110,0.9)', PUENTE.x0, altura(PUENTE.x0,PUENTE.z0)+6, PUENTE.z0, 1.8],
    ['🚀 PLATAFORMA', 'rgba(60,40,120,0.9)', nv.x, ny+11, nv.z, 1.8], ['🦖 NIDO', 'rgba(60,110,40,0.9)', dv.x, dy+6, dv.z, 1.6]];
  for (const [t, f, x, y, z, e] of carteles){ const sp = letrero(t, '#fff', f, e); sp.position.set(x, y, z); mundo.add(sp); }
  for (const h of HELIPUERTOS){ const sp = letrero('🅗 '+h.nombre.toUpperCase(), '#fff', 'rgba(40,40,60,0.9)', 1.4); sp.position.set(h.x, h.y+6, h.z); mundo.add(sp); }
})();
/* las boyas, que se mecen; los huevos con manchas; la luna con sus cráteres y las estrellas del espacio */
const boyasMesh = BOYAS.map(b=>{
  const A = new Armador();
  A.bola(1.1, '#ff7a1a', 0, 0.6, 0, 12).cil(0.12, 0.12, 2.4, '#ffffff', 0, 2.2, 0, 0,0,0,6).bola(0.35, '#ffd23f', 0, 3.5, 0, 8).cil(1.2, 1.2, 0.3, '#ffffff', 0, 0.6, 0, 0,0,0,14);
  const m = A.malla(matBrillo()); m.position.set(b.x, NIVEL_MAR, b.z); mundo.add(m); return m;
});
const huevosMesh = HUEVOS.map(h=>{
  const A = new Armador();
  A.bola(0.8, '#fff8e0', 0, 0.8, 0, 12, 1, 1.25, 1);
  for (let i=0;i<7;i++){ const a = i*2.4, r = 0.55 + (i%3)*0.12; A.bola(0.16, i%2 ? '#7dc37a' : '#5aa04a', Math.cos(a)*0.7, 0.55 + Math.sin(a*1.7)*0.5, Math.sin(a)*0.7, 6); }
  const m = A.malla(matBrillo()); m.position.set(h.x, altura(h.x, h.z), h.z); m.castShadow = true; mundo.add(m);
  const brillo = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xc0ffc0, transparent:true, opacity:0.4, depthWrite:false, blending:THREE.AdditiveBlending}));
  brillo.scale.set(3,3,1); brillo.position.y = 0.9; m.add(brillo);
  return m;
});
const luna = (()=>{
  const g = new THREE.Group();
  const A = new Armador();
  A.bola(LUNA.r, NOCHE ? '#c8553d' : '#d8d8d0', 0, 0, 0, 28);
  semilla = 4321;
  for (let i=0;i<26;i++){ const a = azar()*6.28, b = (azar()-0.5)*3.1, r = LUNA.r*0.995, cr = 6 + azar()*14;
    const x = Math.cos(a)*Math.cos(b)*r, y = Math.sin(b)*r, z = Math.sin(a)*Math.cos(b)*r;
    A.pieza(new THREE.CircleGeometry(cr, 14), NOCHE ? '#8f3a2a' : '#b8b8b0', x, y, z, 0, 0, 0); }
  const m = A.malla(new THREE.MeshLambertMaterial({vertexColors:true}), false); g.add(m);
  /* los cráteres son discos pegados: se orientan mirando hacia afuera */
  m.geometry.computeVertexNormals();
  const bandera = new THREE.Group();
  const B = new Armador(); B.cil(0.15, 0.15, 6, '#e8e8ea', 0, 3, 0, 0,0,0,6);
  bandera.add(B.malla(matMate()));
  const tela = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2, 4, 1), new THREE.MeshLambertMaterial({color: lin(0xd82800), side: THREE.DoubleSide}));
  tela.geometry.translate(1.6, 0, 0); tela.position.set(0.1, 5, 0); bandera.add(tela);
  const et = letrero('🧢 FERNANDO', '#fff', 'rgba(216,40,0,0.9)', 1.2); et.position.set(1.6, 7, 0); et.rotation.z = Math.PI; bandera.add(et);
  bandera.position.set(6, -LUNA.r, 4); bandera.rotation.x = Math.PI; bandera.visible = false;
  g.add(bandera); g.bandera = bandera; g.tela = tela;
  g.position.set(LUNA.x, LUNA.y, LUNA.z);
  scene.add(g); return g;
})();
const estrellasCielo = (()=>{
  const n = 900, pos = new Float32Array(n*3);
  semilla = 8888;
  for (let i=0;i<n;i++){ const a = azar()*6.28, b = Math.acos(azar()*2-1), r = 1300; pos[i*3] = Math.cos(a)*Math.sin(b)*r; pos[i*3+1] = Math.abs(Math.cos(b))*r; pos[i*3+2] = Math.sin(a)*Math.sin(b)*r; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.Points(g, new THREE.PointsMaterial({color: 0xffffff, size: 4, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false}));
  m.frustumCulled = false; m.renderOrder = -9; scene.add(m); return m;
})();

/* ---------------- Los bosques, las flores y las rocas (instanciados) ---------------- */
function instanciar(geo, material, datos, arma){
  const m = new THREE.InstancedMesh(geo, material, datos.length);
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), c = new THREE.Color();
  datos.forEach((d, i)=>{
    const a = arma(d);
    e.set(a.rx||0, a.ry||0, a.rz||0);
    M.compose(new THREE.Vector3(a.x, a.y, a.z), q.setFromEuler(e), new THREE.Vector3(a.sx||a.s||1, a.sy||a.s||1, a.sz||a.s||1));
    m.setMatrixAt(i, M);
    if (a.tinte !== undefined){ c.setHSL(0, 0, 1); c.setRGB(a.tinte, a.tinte, a.tinte); if (a.color) c.copy(a.color); m.setColorAt(i, c); }
  });
  m.castShadow = true; m.receiveShadow = true;
  mundo.add(m); return m;
}
(function plantarVista(){
  /* árbol redondo */
  let A = new Armador();
  A.cil(0.28,0.42,2.4,'#7a4f2a', 0,1.2,0, 0,0,0,6).bola(1.7,'#5db242', 0,3.4,0, 7).bola(1.3,'#6cc04a', 0.9,3.0,0.5, 6).bola(1.2,'#7fd15a', -0.8,3.1,-0.4, 6).bola(1.0,'#8fdc66', 0.1,4.4,-0.2, 6);
  instanciar(A.geo(), matMate(), DECOR.arboles, d=>({x:d.x, y:d.h-0.1, z:d.z, ry:d.rot, s:d.esc, tinte: 0.82 + d.tono*0.28}));
  /* pinos */
  A = new Armador();
  A.cil(0.22,0.32,2.2,'#5a3a1a', 0,1.1,0, 0,0,0,7).cono(2.0,3.0,'#2e7d32', 0,3.0,0, 9).cono(1.6,2.6,'#388e3c', 0,4.8,0, 9).cono(1.1,2.2,'#43a047', 0,6.4,0, 9);
  instanciar(A.geo(), matMate(), DECOR.pinos, d=>({x:d.x, y:d.h-0.1, z:d.z, ry:d.rot, s:d.esc, tinte: 0.9 + (d.esc-0.8)*0.3}));
  /* palmeras */
  A = new Armador();
  A.cil(0.22,0.34,6,'#a5713f', 0,3,0, 0,0,0,7);
  for (let i=0;i<6;i++){ const a = i/6*6.283; A.caja(3.2,0.08,0.9,'#43a047', Math.cos(a)*1.5, 6.1 - 0.3, Math.sin(a)*1.5, 0, -a, -0.45); }
  A.bola(0.3,'#6b3e1e', 0.4,5.7,0.2, 6).bola(0.3,'#6b3e1e', -0.3,5.6,0.3, 6).bola(0.3,'#6b3e1e', 0.1,5.5,-0.4, 6);
  instanciar(A.geo(), matMate(), DECOR.palmeras, d=>({x:d.x, y:d.h-0.1, z:d.z, ry:d.rot, rz:d.inclina, s:d.esc}));
  /* rocas */
  instanciar(new THREE.DodecahedronGeometry(1, 0), new THREE.MeshLambertMaterial({color: lin(0x9a9a9a)}), DECOR.rocas,
    d=>({x:d.x, y:d.h + 0.2*d.esc, z:d.z, ry:d.rot, rx:d.rot*0.3, sx:d.esc*1.3, sy:d.esc*0.8, sz:d.esc, tinte:1, color: d.agua ? lin(0x6a8aa0) : lin(0x9a9a9a).multiplyScalar(0.8+ (d.rot%1)*0.3)}));
  /* matas de pasto y flores: no chocan, solo adornan */
  semilla = 999;
  const pasto = [], flores = [];
  for (let i=0;i<14000 && pasto.length<3600;i++){
    const x = (azar()-0.5)*760, z = (azar()-0.5)*760, h = altura(x, z);
    if (h < 2.0 || h > 32) continue;
    if (cercaRuta(x,z).d < 6 || distPista(x,z) < 12 || enMuelle(x,z) || enRampa(x,z) >= 0) continue;
    let libre = true; for (const s of SOLARES) if (Math.hypot(x-s.x, z-s.z) < s.r) { libre = false; break; }
    if (!libre) continue;
    if (azar() < 0.22) flores.push({x, z, h, rot:azar()*6.28, c:Math.floor(azar()*5), esc:0.8+azar()*0.6});
    else pasto.push({x, z, h, rot:azar()*6.28, esc:0.7+azar()*0.7, tono:azar()});
  }
  A = new Armador();
  A.cono(0.14,0.8,'#6cc04a', 0,0.4,0, 4).cono(0.12,0.65,'#7fd15a', 0.18,0.32,0.05, 4, 0,0,-0.35).cono(0.12,0.6,'#5db242', -0.16,0.3,-0.06, 4, 0,0,0.35);
  const mp = instanciar(A.geo(), matMate(), pasto, d=>({x:d.x, y:d.h, z:d.z, ry:d.rot, s:d.esc, tinte:0.85+d.tono*0.3}));
  mp.castShadow = false;
  A = new Armador();
  A.cil(0.03,0.03,0.6,'#43a047', 0,0.3,0, 0,0,0,4).bola(0.16,'#ffffff', 0,0.62,0, 6);
  const coloresF = [lin(0xff6ec0), lin(0xffd23f), lin(0xff7a1a), lin(0xffffff), lin(0xb39ddb)];
  const mf = instanciar(A.geo(), matMate(), flores, d=>({x:d.x, y:d.h, z:d.z, ry:d.rot, s:d.esc, tinte:1, color:coloresF[d.c]}));
  mf.castShadow = false;
})();

/* ---------------- El fondo del mar: algas, corales, peces y el cofre ---------------- */
const peces = (()=>{
  const A = new Armador();
  A.bola(0.5,'#ffffff', 0,0,0, 8, 0.7,0.9,1.4).cono(0.35,0.7,'#ffffff', 0,0,-0.95, 4, -Math.PI/2,0,0).caja(0.06,0.08,0.08,'#222', 0.22,0.1,0.45).caja(0.06,0.08,0.08,'#222', -0.22,0.1,0.45);
  const m = new THREE.InstancedMesh(A.geo(), new THREE.MeshLambertMaterial({vertexColors:true}), 110);
  m.datos = []; semilla = 31337;
  const colores = [lin(0xff7a1a), lin(0xffd23f), lin(0x4fc3f7), lin(0xff6ec0), lin(0x7dffa0), lin(0xb39ddb), lin(0xffffff)];
  const c = new THREE.Color();
  for (let i=0;i<110;i++){
    let cx, cz; do { cx = (azar()-0.5)*1000; cz = (azar()-0.5)*1000; } while (altura(cx, cz) > -6);
    const d = {cx, cz, r: 6+azar()*20, y: altura(cx,cz)*0.5 - 2 - azar()*6, a: azar()*6.28, v:(0.3+azar()*0.5)*(azar()<0.5?1:-1), esc:0.8+azar()*1.4, fase:azar()*6.28};
    d.y = Math.max(altura(cx,cz)+2.5, Math.min(-2, d.y));
    m.datos.push(d);
    m.setColorAt(i, c.copy(colores[i%colores.length]));
  }
  m.frustumCulled = false; mundo.add(m); return m;
})();
function pasoPeces(){
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  peces.datos.forEach((d,i)=>{
    d.a += d.v*DT; d.fase += DT*6;
    const x = d.cx + Math.cos(d.a)*d.r, z = d.cz + Math.sin(d.a)*d.r, y = d.y + Math.sin(d.fase*0.5)*0.6;
    const rumbo = Math.atan2(-Math.sin(d.a)*d.v, Math.cos(d.a)*d.v);
    e.set(0, rumbo, 0);
    M.compose(new THREE.Vector3(x,y,z), q.setFromEuler(e), new THREE.Vector3(d.esc, d.esc, d.esc*(1+Math.sin(d.fase)*0.06)));
    peces.setMatrixAt(i, M);
  });
  peces.instanceMatrix.needsUpdate = true;
}
const algas = (()=>{
  semilla = 2024;
  const datos = [];
  for (let i=0;i<4000 && datos.length<420;i++){ const x = (azar()-0.5)*1100, z = (azar()-0.5)*1100, h = altura(x,z); if (h > -3.5 || h < -40) continue; datos.push({x, z, h, rot:azar()*6.28, esc:0.7+azar()*1.4, fase:azar()*6.28}); }
  const A = new Armador();
  A.cono(0.35,3.2,'#2e9e5e', 0,1.6,0, 5).cono(0.25,2.6,'#3cb371', 0.5,1.3,0.2, 5, 0,0,-0.2).cono(0.25,2.2,'#2e9e5e', -0.45,1.1,-0.2, 5, 0,0,0.22);
  const m = instanciar(A.geo(), matMate(), datos, d=>({x:d.x, y:d.h, z:d.z, ry:d.rot, s:d.esc}));
  m.castShadow = false; m.datos = datos; return m;
})();
function pasoAlgas(){
  if (tick % 2) return;
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), t = tick*DT;
  algas.datos.forEach((d,i)=>{ e.set(Math.sin(t*1.3+d.fase)*0.12, d.rot, Math.cos(t*1.1+d.fase)*0.12); M.compose(new THREE.Vector3(d.x,d.h,d.z), q.setFromEuler(e), new THREE.Vector3(d.esc,d.esc,d.esc)); algas.setMatrixAt(i, M); });
  algas.instanceMatrix.needsUpdate = true;
}
(function corales(){
  semilla = 555;
  const datos = [];
  for (let i=0;i<3000 && datos.length<260;i++){ const x = (azar()-0.5)*1100, z = (azar()-0.5)*1100, h = altura(x,z); if (h > -4 || h < -38) continue; datos.push({x, z, h, rot:azar()*6.28, esc:0.6+azar()*1.5, c:Math.floor(azar()*5)}); }
  const A = new Armador();
  A.bola(0.8,'#ffffff', 0,0.5,0, 7).bola(0.6,'#ffffff', 0.7,0.9,0.2, 6).bola(0.5,'#ffffff', -0.6,0.8,-0.3, 6).cil(0.18,0.25,1.6,'#ffffff', 0.2,1.3,-0.5, 0.3,0,0.2,6).cil(0.15,0.2,1.3,'#ffffff', -0.4,1.2,0.4, -0.3,0,-0.2,6);
  const colores = [lin(0xff6ec0), lin(0xff7a1a), lin(0xb39ddb), lin(0xffd23f), lin(0x4fc3f7)];
  const m = instanciar(A.geo(), matMate(), datos, d=>({x:d.x, y:d.h, z:d.z, ry:d.rot, s:d.esc, tinte:1, color:colores[d.c]}));
  m.castShadow = false;
})();
const cofre = (()=>{
  const g = new THREE.Group(), y = altura(COFRE.x, COFRE.z);
  const A = new Armador();
  A.caja(2.4,1.3,1.5,'#8b5a2b', 0,0.65,0).caja(2.5,0.16,1.6,'#4a3018', 0,0.16,0).caja(2.5,0.16,1.6,'#4a3018', 0,1.2,0).caja(0.3,1.3,1.6,'#4a3018', 0,0.65,0);
  A.caja(2.4,0.7,1.5,'#8b5a2b', 0,1.65,-0.9, -1.1,0,0).caja(0.3,0.5,0.3,'#ffd23f', 0,1.2,0.78);
  for (let i=0;i<14;i++) A.bola(0.2,'#ffd23f', (azar()-0.5)*1.8, 1.35+azar()*0.35, (azar()-0.5)*1.0, 6);
  A.bola(0.28,'#ff4060', 0.5,1.55,0.2, 6).bola(0.25,'#4fc3f7', -0.6,1.5,-0.1, 6);
  const m = A.malla(matBrillo()); g.add(m);
  const haz = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.6, -y+2, 12, 1, true), new THREE.MeshBasicMaterial({color:0xfff2a0, transparent:true, opacity:0.16, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide}));
  haz.position.y = (-y+2)/2; g.add(haz);
  g.position.set(COFRE.x, y, COFRE.z); g.rotation.y = 0.6;
  mundo.add(g); g.haz = haz; return g;
})();

/* ---------------- Los objetos de las misiones: aros, banderas, baños ---------------- */
const arosMesh = AROS.map((a, i)=>{
  const m = new THREE.Mesh(new THREE.TorusGeometry(a.r, 0.55, 10, 30), new THREE.MeshPhongMaterial({color: lin(0xffd23f), emissive: lin(0x8a6a00), shininess: 80}));
  m.position.set(a.x, a.y, a.z); m.castShadow = false;
  const nudo = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xffe36e, transparent:true, opacity:0.5, depthWrite:false, blending:THREE.AdditiveBlending}));
  nudo.scale.set(a.r*1.6, a.r*1.6, 1); m.add(nudo);
  const num = letrero(String(i+1), '#fff', 'rgba(200,120,0,0.9)', 2.2); num.position.y = a.r + 2.5; m.add(num);
  mundo.add(m); return m;
});
const aroRampa = (()=>{
  const a = RAMPA.aro;
  const m = new THREE.Mesh(new THREE.TorusGeometry(a.r, 0.45, 10, 30), new THREE.MeshPhongMaterial({color: lin(0xffd23f), emissive: lin(0x8a6a00), shininess: 80}));
  m.position.set(a.x, a.y, a.z); m.rotation.y = RAMPA.ang; mundo.add(m); return m;
})();
const banderasMesh = BANDERAS.map(b=>{
  const g = new THREE.Group(), y = altura(b.x, b.z);
  const A = new Armador();
  const rot = Math.atan2(b.tx, b.tz);
  for (const lado of [-1, 1]){ A.cil(0.16,0.16,6.5,'#e8e8ea', b.nx*lado*6.6, y+3.25, b.nz*lado*6.6, 0,0,0,8); A.bola(0.3,'#e63946', b.nx*lado*6.6, y+6.6, b.nz*lado*6.6, 6); }
  A.caja(13.6, 1.0, 0.16, '#ffffff', b.x*0, y+6.0, b.z*0, 0, rot, 0);
  const geoP = A.geo(); geoP.translate(0,0,0);
  const postes = new THREE.Mesh(geoP, matMate()); g.add(postes);
  const tex = texturaCuadros('#e63946', '#ffffff', 8); tex.repeat.set(6, 1);
  const cartel = new THREE.Mesh(new THREE.PlaneGeometry(13.4, 0.9), new THREE.MeshLambertMaterial({map: tex, side: THREE.DoubleSide}));
  cartel.position.set(b.nx*0 + Math.sin(rot)*0.1, y+6.0, Math.cos(rot)*0.1); cartel.rotation.y = rot; g.add(cartel);
  const ban = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshLambertMaterial({color: lin(0xe63946), side: THREE.DoubleSide}));
  ban.position.set(b.nx*6.6 + Math.sin(rot+Math.PI/2)*0.8*0, y+6.9, b.nz*6.6); ban.rotation.y = rot; g.add(ban); g.bandera = ban;
  g.position.set(b.x, 0, b.z);
  mundo.add(g); g.cartel = cartel; return g;
});
const banosMesh = BANOS.map(b=>{
  const g = new THREE.Group(), y = altura(b.x, b.z);
  const A = new Armador();
  A.caja(2.2, 2.7, 2.2, '#8fd3ff', 0, 1.35, 0).caja(2.5, 0.2, 2.5, '#2a6ad0', 0, 2.8, 0, 0.18, 0, 0).caja(0.2, 2.7, 0.2, '#2a6ad0', 1.05, 1.35, 1.05).caja(0.2, 2.7, 0.2, '#2a6ad0', -1.05, 1.35, 1.05)
   .caja(0.2, 2.7, 0.2, '#2a6ad0', 1.05, 1.35, -1.05).caja(0.2, 2.7, 0.2, '#2a6ad0', -1.05, 1.35, -1.05).cil(0.3,0.3,0.8,'#8a8a90', 0.6, 3.3, -0.5, 0,0,0,8);
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  /* la puerta gira sobre su bisagra */
  const bis = new THREE.Group(); bis.position.set(-0.55, 0, 1.12);
  const P2 = new Armador();
  P2.caja(1.1, 2.2, 0.12, '#2a6ad0', 0.55, 1.1, 0).caja(0.12, 0.12, 0.2, '#ffd23f', 0.95, 1.1, 0.1).bola(0.16, '#ffffff', 0.55, 1.75, 0.07, 6);
  bis.add(P2.malla(matMate())); g.add(bis); g.puerta = bis;
  const sp = letrero('🚽 BAÑO', '#fff', 'rgba(30,90,180,0.92)', 1.4); sp.position.set(0, 3.9, 0); g.add(sp);
  g.position.set(b.x, y, b.z); g.rotation.y = b.ang;
  g.puertaObj = 0;
  mundo.add(g); return g;
});

/* ---------------- Las hamburguesas y la estrella ---------------- */
function hamburguesaGeo(){
  const A = new Armador();
  A.cil(0.52,0.46,0.22,'#e8a44a', 0,0.11,0, 0,0,0,14).cil(0.55,0.55,0.16,'#6b3e1e', 0,0.30,0, 0,0,0,14).caja(1.0,0.06,1.0,'#ffd23f', 0,0.41,0, 0,0.6,0)
   .cil(0.62,0.6,0.1,'#43a047', 0,0.47,0, 0,0,0,10).cil(0.5,0.5,0.1,'#e63946', 0,0.56,0, 0,0,0,12)
   .bola(0.56,'#f0b050', 0,0.62,0, 12, 1,0.72,1).caja(0.06,0.03,0.09,'#fff8e0', 0.2,1.0,0.1).caja(0.06,0.03,0.09,'#fff8e0', -0.15,1.0,-0.2).caja(0.06,0.03,0.09,'#fff8e0', 0.05,1.02,0.3).caja(0.06,0.03,0.09,'#fff8e0', -0.25,0.97,0.15);
  return A.geo();
}
const geoHamb = hamburguesaGeo();
const matHamb = matBrillo();
const hambMesh = HAMBURGUESAS.map(h=>{
  const m = new THREE.Mesh(geoHamb, matHamb); m.scale.set(1.4,1.4,1.4); m.position.set(h.x, h.y, h.z); m.castShadow = true;
  const brillo = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xffe9a0, transparent:true, opacity:0.45, depthWrite:false, blending:THREE.AdditiveBlending}));
  brillo.scale.set(2.2,2.2,1); brillo.position.y = 0.5; m.add(brillo);
  mundo.add(m); return m;
});
function estrellaGeo(){
  const s = new THREE.Shape();
  for (let i=0;i<10;i++){ const r = i%2 ? 0.42 : 1, a = i/10*Math.PI*2 - Math.PI/2; if (i===0) s.moveTo(Math.cos(a)*r, Math.sin(a)*r); else s.lineTo(Math.cos(a)*r, Math.sin(a)*r); }
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {depth:0.3, bevelEnabled:true, bevelThickness:0.08, bevelSize:0.08, bevelSegments:2}); g.center(); return g;
}
const geoEstrella = estrellaGeo();
const matEstrella = new THREE.MeshPhongMaterial({color: lin(0xffd23f), emissive: lin(0x7a5a00), shininess: 90});

/* ---------------- Partículas: polvo, chispas, burbujas, nubes de peo, confeti ---------------- */
const particulas = [];
const geoPart = new THREE.SphereGeometry(1, 6, 5), geoConf = new THREE.BoxGeometry(1, 0.2, 0.6);
const matParts = {};
function matPart(color, alfa, aditivo){
  const k = color+'/'+alfa+'/'+(aditivo?1:0);
  if (!matParts[k]) matParts[k] = new THREE.MeshBasicMaterial({color: lin(color), transparent: alfa < 1, opacity: alfa, depthWrite: alfa >= 1, blending: aditivo ? THREE.AdditiveBlending : THREE.NormalBlending});
  return matParts[k];
}
function particula(x,y,z, color, vx,vy,vz, vida, tam, opciones){
  if (particulas.length > 420) return;
  const o = opciones||{};
  const m = new THREE.Mesh(o.confeti ? geoConf : geoPart, matPart(color, o.alfa===undefined ? 1 : o.alfa, o.aditivo));
  m.position.set(x,y,z); m.scale.setScalar(tam);
  if (o.confeti) m.rotation.set(azar()*3, azar()*3, azar()*3);
  scene.add(m);
  particulas.push({m, vx, vy, vz, vida, vida0: vida, tam, crece: o.crece||0, grav: o.grav===undefined ? 0 : o.grav, confeti: !!o.confeti, flota: !!o.flota});
}
function pasoParticulas(){
  for (let i=particulas.length-1;i>=0;i--){
    const p = particulas[i];
    p.vida--;
    p.vy -= p.grav*DT;
    p.m.position.x += p.vx*DT; p.m.position.y += p.vy*DT; p.m.position.z += p.vz*DT;
    if (p.flota){ p.vx *= 0.97; p.vz *= 0.97; if (p.m.position.y > NIVEL_MAR) p.vida = Math.min(p.vida, 2); }
    if (p.confeti){ p.m.rotation.x += 0.15; p.m.rotation.z += 0.1; p.vx *= 0.98; p.vz *= 0.98; }
    const f = p.vida/p.vida0;
    p.m.scale.setScalar(p.tam*(p.crece ? (1 + (1-f)*p.crece) : (0.3 + 0.7*f)));
    /* una partícula pegada a la cámara taparía media pantalla: se esconde */
    p.m.visible = p.m.position.distanceToSquared(camera.position) > 9;
    if (p.vida <= 0){ scene.remove(p.m); particulas.splice(i, 1); }
  }
}
function nubePeo(x, y, z, grande){
  const n = grande ? 16 : 8;
  for (let i=0;i<n;i++) particula(x + (azar()-0.5), y + 0.6 + azar()*0.6, z + (azar()-0.5), i%2 ? '#8fd44a' : '#b8ec6a', (azar()-0.5)*3, 0.8+azar()*1.5, (azar()-0.5)*3, 50+azar()*40, 0.35+azar()*0.4, {alfa:0.55, crece: grande ? 3.5 : 2.2});
}
function chispas(x, y, z, color, n, fuerza){
  for (let i=0;i<n;i++){ const a = azar()*6.28, b = azar()*3.14; const f = fuerza||6; particula(x, y, z, color, Math.cos(a)*Math.sin(b)*f*azar(), Math.abs(Math.cos(b))*f*azar()+2, Math.sin(a)*Math.sin(b)*f*azar(), 30+azar()*30, 0.12+azar()*0.15, {grav:12, aditivo:true, alfa:0.9}); }
}
function confeti(x, y, z, n){
  const cs = ['#e63946','#ffd23f','#4fc3f7','#7dffa0','#ff6ec0','#ffffff'];
  for (let i=0;i<n;i++) particula(x + (azar()-0.5)*3, y + 2 + azar()*3, z + (azar()-0.5)*3, cs[i%cs.length], (azar()-0.5)*6, 2+azar()*6, (azar()-0.5)*6, 90+azar()*60, 0.16+azar()*0.12, {grav:5, confeti:true});
}

/* ---------------- Los personajes: cajitas con brazos y piernas que se mueven ----------------
   Cada uno mira hacia +z y tiene los pies en el origen. */
const PIEL = '#ffc8a0';
function extremidad(w, h, d, color, pie, colorPie){
  const A = new Armador();
  A.caja(w, h, d, color, 0, -h/2, 0);
  if (pie) A.caja(w+0.04, 0.14, d+0.12, colorPie||'#3a2a1a', 0, -h+0.05, 0.05);
  else A.caja(w*0.8, w*0.8, w*0.8, colorPie||PIEL, 0, -h-0.02, 0);
  return A.malla(matMate());
}
function armarPersona(id){
  const g = new THREE.Group();
  const A = new Armador();
  const R = {};
  const torso = (color, alto)=>{ A.caja(0.62, alto||0.7, 0.38, color, 0, 0.72+(alto||0.7)/2, 0); };
  const falda = (color)=>{ A.cil(0.3, 0.5, 0.5, color, 0, 0.62, 0, 0,0,0,10); };
  const cabeza = (piel)=>{
    A.caja(0.56, 0.56, 0.56, piel||PIEL, 0, 1.76, 0);
    A.caja(0.1, 0.13, 0.06, '#222', -0.13, 1.82, 0.28); A.caja(0.1, 0.13, 0.06, '#222', 0.13, 1.82, 0.28);
    A.caja(0.04, 0.05, 0.06, '#fff', -0.11, 1.85, 0.3); A.caja(0.04, 0.05, 0.06, '#fff', 0.15, 1.85, 0.3);
    A.caja(0.2, 0.05, 0.04, '#b0483a', 0, 1.63, 0.29);
    A.caja(0.08, 0.08, 0.04, '#ffa0a0', -0.22, 1.7, 0.28); A.caja(0.08, 0.08, 0.04, '#ffa0a0', 0.22, 1.7, 0.28);
  };
  const gorra = (color)=>{ A.caja(0.6, 0.2, 0.6, color, 0, 2.12, 0); A.caja(0.5, 0.06, 0.34, color, 0, 2.06, 0.42); };
  const pelo = (color, alto)=>{ A.caja(0.6, alto||0.16, 0.6, color, 0, 2.08, 0); A.caja(0.6, 0.4, 0.12, color, 0, 1.86, -0.26); };
  const melena = (color)=>{ pelo(color, 0.2); A.caja(0.14, 0.62, 0.5, color, -0.34, 1.6, -0.06); A.caja(0.14, 0.62, 0.5, color, 0.34, 1.6, -0.06); A.caja(0.6, 0.7, 0.2, color, 0, 1.55, -0.32); };
  const bigote = ()=>{ A.caja(0.34, 0.08, 0.08, '#3a2a1a', 0, 1.66, 0.3); };
  const barba = (color)=>{ A.caja(0.5, 0.14, 0.1, color||'#3a2a1a', 0, 1.52, 0.28); };
  const lentes = ()=>{ A.caja(0.56, 0.14, 0.06, '#1a1a1a', 0, 1.82, 0.31); A.caja(0.16, 0.1, 0.07, '#8ecbff', -0.13, 1.82, 0.32); A.caja(0.16, 0.1, 0.07, '#8ecbff', 0.13, 1.82, 0.32); };
  let ropa = '#d82800', piel = PIEL, esc = 1, brazoColor = null;
  switch(id){
    case 'fernando': ropa = '#d82800'; torso(ropa); A.caja(0.64, 0.34, 0.4, '#2038ec', 0, 0.9, 0); A.caja(0.1, 0.5, 0.06, '#2038ec', -0.2, 1.2, 0.2); A.caja(0.1, 0.5, 0.06, '#2038ec', 0.2, 1.2, 0.2);
      cabeza(); gorra('#d82800'); A.caja(0.16, 0.14, 0.04, '#fff', 0, 2.12, 0.31); A.caja(0.58, 0.06, 0.58, '#5a3418', 0, 2.0, 0); esc = 0.8; break;
    case 'cucu': ropa = '#ff6ec0'; torso(ropa); falda(ropa); cabeza(); pelo('#3b2410'); A.caja(0.18, 0.5, 0.18, '#3b2410', -0.42, 1.7, 0); A.caja(0.18, 0.5, 0.18, '#3b2410', 0.42, 1.7, 0);
      A.bola(0.1, '#ff6ec0', -0.42, 1.98, 0, 6); A.bola(0.1, '#ff6ec0', 0.42, 1.98, 0, 6); esc = 0.74; break;
    case 'luca': ropa = '#ffe36e'; piel = '#e8b088'; torso(ropa); cabeza(piel); gorra('#2a9c3a'); esc = 0.76; break;
    case 'salomon': ropa = '#d86a28'; piel = '#c88a5a'; torso(ropa); cabeza(piel); lentes();
      for (const [x,z] of [[-0.2,-0.2],[0.2,-0.2],[-0.2,0.2],[0.2,0.2],[0,0],[0,-0.3],[0.3,0],[-0.3,0]]) A.bola(0.17, '#2a1a0a', x, 2.08, z, 6); esc = 0.76; break;
    case 'tiojuan': ropa = '#1560d0'; torso(ropa); cabeza(); pelo('#222'); A.caja(0.26, 0.26, 0.05, '#ffe36e', 0, 1.15, 0.21); A.caja(0.1, 0.16, 0.05, '#d82800', 0, 1.15, 0.24);
      A.caja(0.66, 0.16, 0.42, '#d82800', 0, 0.76, 0); esc = 1.0; break;
    case 'nacho': ropa = '#ffe36e'; piel = '#d8a070'; torso(ropa); cabeza(piel); bigote(); A.cil(0.72, 0.72, 0.06, '#e8a33d', 0, 2.06, 0, 0,0,0,14); A.cil(0.34, 0.38, 0.34, '#e8a33d', 0, 2.24, 0, 0,0,0,10); break;
    case 'yanny': ropa = '#40c0b0'; torso(ropa); falda(ropa); cabeza(); melena('#7a3aa8'); esc = 0.95; break;
    case 'tiofran': ropa = '#8a6a3a'; torso(ropa); cabeza(); pelo('#3a2a1a'); bigote(); break;
    case 'romulo': ropa = '#b8b8c8'; piel = '#9a9aae'; torso(ropa); A.caja(0.58, 0.56, 0.56, piel, 0, 1.76, 0); A.caja(0.6, 0.18, 0.06, '#2a2a34', 0, 1.84, 0.28);
      A.caja(0.1, 0.1, 0.06, '#fff', -0.13, 1.84, 0.31); A.caja(0.1, 0.1, 0.06, '#fff', 0.13, 1.84, 0.31);
      A.caja(0.16, 0.16, 0.14, piel, -0.26, 2.08, 0); A.caja(0.16, 0.16, 0.14, piel, 0.26, 2.08, 0); A.caja(0.2, 0.14, 0.2, '#3a3a44', 0, 1.62, 0.32);
      A.caja(0.16, 0.7, 0.16, piel, 0, 0.7, -0.35, 0.7, 0, 0); A.caja(0.18, 0.12, 0.18, '#3a3a44', 0, 0.95, -0.55);
      brazoColor = piel; break;
    case 'abu': ropa = '#7b4fa8'; torso(ropa); falda(ropa); cabeza(); pelo('#cfcfcf'); A.bola(0.2, '#cfcfcf', 0, 2.24, -0.1, 6); lentes(); esc = 0.92; break;
    case 'mama': ropa = '#ff6ea8'; torso(ropa); falda(ropa); cabeza(); melena('#5a3418'); A.caja(0.22, 0.07, 0.04, '#e0304a', 0, 1.63, 0.3); esc = 0.96; break;
    case 'papa': ropa = '#2a6ad0'; torso(ropa); cabeza(); gorra('#1560d0'); barba('#8a5a3a'); esc = 1.04; break;
    case 'beto': ropa = '#2a9c6a'; piel = '#e8b088'; torso(ropa); cabeza(piel); pelo('#2a2a2a'); lentes(); barba(); break;
    case 'giuliana': ropa = '#ff8a3d'; torso(ropa); falda(ropa); cabeza(); melena('#7a4a1a'); esc = 0.95; break;
    case 'santi': ropa = '#9bd1ff'; torso(ropa, 0.5); A.caja(0.7, 0.7, 0.7, PIEL, 0, 1.6, 0); A.caja(0.12, 0.14, 0.06, '#222', -0.15, 1.66, 0.35); A.caja(0.12, 0.14, 0.06, '#222', 0.15, 1.66, 0.35);
      A.caja(0.1, 0.1, 0.05, '#ffa0a0', -0.28, 1.52, 0.35); A.caja(0.1, 0.1, 0.05, '#ffa0a0', 0.28, 1.52, 0.35); A.cil(0.12, 0.12, 0.1, '#ff6ec0', 0, 1.46, 0.38, Math.PI/2, 0, 0, 8); A.bola(0.08, '#ffd23f', 0, 1.46, 0.46, 6);
      A.caja(0.2, 0.12, 0.2, '#5a3418', 0, 2.0, 0); esc = 0.55; break;
    default: torso(ropa); cabeza(); pelo('#3a2a1a');
  }
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  const bI = extremidad(0.18, 0.62, 0.18, brazoColor||ropa, false, piel), bD = extremidad(0.18, 0.62, 0.18, brazoColor||ropa, false, piel);
  bI.position.set(-0.4, 1.36, 0); bD.position.set(0.4, 1.36, 0);
  const pI = extremidad(0.24, 0.7, 0.26, id==='cucu'||id==='yanny'||id==='abu'||id==='mama'||id==='giuliana' ? PIEL : id==='fernando' ? '#2038ec' : id==='romulo' ? piel : '#3a4a8a', true, id==='fernando' ? '#5a3418' : '#2a2a2a');
  const pD = extremidad(0.24, 0.7, 0.26, id==='cucu'||id==='yanny'||id==='abu'||id==='mama'||id==='giuliana' ? PIEL : id==='fernando' ? '#2038ec' : id==='romulo' ? piel : '#3a4a8a', true, id==='fernando' ? '#5a3418' : '#2a2a2a');
  pI.position.set(-0.16, 0.72, 0); pD.position.set(0.16, 0.72, 0);
  g.add(bI, bD, pI, pD);
  const cuerpoG = new THREE.Group(); g.add(cuerpoG);
  let capa = null;
  if (id==='tiojuan'){
    capa = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.3, 1, 4), new THREE.MeshLambertMaterial({color: lin(0xd82800), side: THREE.DoubleSide}));
    capa.position.set(0, 0.85, -0.22); capa.castShadow = true; g.add(capa);
  }
  g.scale.setScalar(esc);
  g.partes = {cuerpo, bI, bD, pI, pD, capa};
  g.esc = esc; g.fase = azar()*6.28;
  return g;
}
function armarPerro(color){
  const g = new THREE.Group(), A = new Armador();
  A.caja(0.5, 0.42, 0.9, color, 0, 0.7, 0).caja(0.46, 0.44, 0.46, color, 0, 1.05, 0.5).caja(0.26, 0.22, 0.3, color, 0, 0.94, 0.85)
   .caja(0.12, 0.12, 0.12, '#222', 0, 1.0, 1.0).caja(0.08, 0.1, 0.06, '#fff', -0.13, 1.14, 0.72).caja(0.08, 0.1, 0.06, '#fff', 0.13, 1.14, 0.72)
   .caja(0.05, 0.06, 0.05, '#222', -0.13, 1.14, 0.75).caja(0.05, 0.06, 0.05, '#222', 0.13, 1.14, 0.75)
   .caja(0.14, 0.34, 0.14, color, -0.24, 1.14, 0.42, 0,0,0.3).caja(0.14, 0.34, 0.14, color, 0.24, 1.14, 0.42, 0,0,-0.3)
   .caja(0.16, 0.06, 0.08, '#ff5060', 0, 0.82, 1.0)
   .caja(0.3, 0.12, 0.12, '#e63946', 0, 0.86, 0.5);
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  const cola = new Armador().caja(0.1, 0.1, 0.42, color, 0, 0.1, -0.2).malla(matMate()); cola.position.set(0, 0.86, -0.42); g.add(cola);
  const patas = [];
  for (const [x,z] of [[-0.17,0.32],[0.17,0.32],[-0.17,-0.32],[0.17,-0.32]]){
    const p = new Armador().caja(0.14, 0.5, 0.16, color, 0, -0.25, 0).caja(0.16, 0.08, 0.2, '#3a2a1a', 0, -0.48, 0.02).malla(matMate());
    p.position.set(x, 0.5, z); g.add(p); patas.push(p);
  }
  g.partes = {cuerpo, cola, patas}; g.fase = azar()*6.28; g.scale.setScalar(0.9);
  return g;
}
function armarSrPopo(){
  const g = new THREE.Group(), A = new Armador();
  const cafe = '#7a4a1e', claro = '#95602a';
  A.bola(0.88, cafe, 0, 0.7, 0, 12, 1, 0.78, 1).bola(0.7, claro, 0.04, 1.3, 0.06, 12, 1, 0.85, 1).bola(0.5, cafe, 0.02, 1.82, 0.1, 10)
   .cono(0.3, 0.6, claro, 0.12, 2.3, 0.18, 8, 0, 0, -0.35)
   .bola(0.18, '#ffffff', -0.22, 1.42, 0.62, 8).bola(0.18, '#ffffff', 0.22, 1.42, 0.62, 8).bola(0.08, '#111', -0.2, 1.42, 0.78, 6).bola(0.08, '#111', 0.24, 1.42, 0.78, 6)
   .caja(0.4, 0.07, 0.06, '#3a1a08', 0, 1.14, 0.72).caja(0.08, 0.14, 0.06, '#3a1a08', -0.22, 1.19, 0.7).caja(0.08, 0.14, 0.06, '#3a1a08', 0.22, 1.19, 0.7)
   .bola(0.09, '#ff9aa0', -0.4, 1.28, 0.58, 6).bola(0.09, '#ff9aa0', 0.42, 1.28, 0.58, 6)
   .cil(0.5, 0.5, 0.06, '#111', 0.02, 2.1, 0.1, 0,0,0,14).cil(0.34, 0.34, 0.62, '#111', 0.02, 2.44, 0.1, 0,0,0,12).cil(0.35, 0.35, 0.12, '#e63946', 0.02, 2.2, 0.1, 0,0,0,12)
   .caja(0.16, 0.16, 0.08, '#e63946', -0.12, 0.98, 0.78, 0,0,0.3).caja(0.16, 0.16, 0.08, '#e63946', 0.12, 0.98, 0.78, 0,0,-0.3).bola(0.06, '#e63946', 0, 0.98, 0.82, 6)
   .pieza(new THREE.TorusGeometry(0.2, 0.03, 6, 14), '#ffd23f', 0.22, 1.42, 0.7)
   .caja(0.34, 0.14, 0.5, '#111', -0.24, 0.07, 0.5).caja(0.34, 0.14, 0.5, '#111', 0.24, 0.07, 0.5);
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  const bI = new Armador().caja(0.16, 0.5, 0.16, cafe, 0, -0.25, 0).bola(0.14, '#ffffff', 0, -0.55, 0, 6).malla(matMate()); bI.position.set(-0.78, 1.2, 0.1); bI.rotation.z = -0.5;
  const bD = new Armador().caja(0.16, 0.5, 0.16, cafe, 0, -0.25, 0).bola(0.14, '#ffffff', 0, -0.55, 0, 6).malla(matMate()); bD.position.set(0.78, 1.2, 0.1); bD.rotation.z = 0.5;
  g.add(bI, bD);
  g.partes = {cuerpo, bI, bD}; g.fase = 0; g.scale.setScalar(0.95);
  return g;
}
/* el popo bebé: un popito con lazo rosado y chupón */
function armarPopito(){
  const g = new THREE.Group(), A = new Armador();
  const cafe = '#7a4a1e', claro = '#95602a';
  A.bola(0.5, cafe, 0, 0.4, 0, 10, 1, 0.78, 1).bola(0.38, claro, 0.02, 0.74, 0.04, 10, 1, 0.85, 1).bola(0.26, cafe, 0.01, 1.02, 0.06, 8)
   .cono(0.16, 0.34, claro, 0.07, 1.3, 0.1, 8, 0, 0, -0.35)
   .bola(0.13, '#ffffff', -0.13, 0.8, 0.34, 8).bola(0.13, '#ffffff', 0.13, 0.8, 0.34, 8).bola(0.065, '#111', -0.12, 0.8, 0.45, 6).bola(0.065, '#111', 0.15, 0.8, 0.45, 6)
   .bola(0.06, '#ff9aa0', -0.26, 0.7, 0.32, 6).bola(0.06, '#ff9aa0', 0.27, 0.7, 0.32, 6)
   .cil(0.09, 0.09, 0.05, '#ffd23f', 0, 0.62, 0.42, Math.PI/2, 0, 0, 8).bola(0.05, '#4fc3f7', 0, 0.62, 0.47, 6)
   .caja(0.14, 0.12, 0.06, '#ff6ec0', -0.12, 1.16, 0.12, 0, 0, 0.4).caja(0.14, 0.12, 0.06, '#ff6ec0', 0.1, 1.16, 0.12, 0, 0, -0.4).bola(0.05, '#ff6ec0', -0.01, 1.16, 0.15, 6)
   .caja(0.2, 0.09, 0.3, '#ffffff', -0.15, 0.045, 0.28).caja(0.2, 0.09, 0.3, '#ffffff', 0.15, 0.045, 0.28);
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  g.partes = {cuerpo}; g.fase = 0;
  return g;
}
const popitosMesh = [];
/* cualquier personaje elegible: persona, perrito o el Señor Popo */
function armarJugador(pj){
  const def = PERSONAJES_RED.find(p=>p.id===pj) || PERSONAJES_RED[0];
  let g;
  if (def.perro){ g = armarPerro(def.perro); g.tipo = 'perro'; g.esc = 0.9; }
  else if (def.id==='srpopo'){ g = armarSrPopo(); g.tipo = 'popo'; g.esc = 0.95; }
  else { g = armarPersona(def.id); g.tipo = 'persona'; }
  return g;
}
function animarModelo(g, mov, fase, aire, nadando, sentado){
  if (g.tipo==='perro'){ animarPerro(g, sentado ? 0 : mov, fase); g.partes.cuerpo.position.y = 0; return; }
  if (g.tipo==='popo'){ const amp = Math.min(1, mov/2.5); g.partes.cuerpo.position.y = sentado ? 0 : Math.abs(Math.sin(fase))*0.3*amp; g.partes.bD.rotation.z = 0.5 + (amp > 0.2 ? Math.sin(fase*2)*0.4 : 0); return; }
  animarPersona(g, mov, fase, aire, nadando, sentado);
}
/* la persona camina: piernas y brazos van y vienen, y el cuerpo rebota */
function animarPersona(g, mov, fase, aire, nadando, sentado){
  const p = g.partes;
  if (sentado){ p.pI.rotation.x = -1.4; p.pD.rotation.x = -1.4; p.bI.rotation.x = -0.9; p.bD.rotation.x = -0.9; p.cuerpo.position.y = 0; return; }
  if (nadando){ p.pI.rotation.x = 1.2 + Math.sin(fase*1.5)*0.3; p.pD.rotation.x = 1.2 - Math.sin(fase*1.5)*0.3; p.bI.rotation.x = fase*2 % 6.28; p.bD.rotation.x = (fase*2+3.14) % 6.28; p.cuerpo.position.y = 0; return; }
  if (aire){ p.pI.rotation.x = -0.7; p.pD.rotation.x = 0.4; p.bI.rotation.x = -2.6; p.bD.rotation.x = -2.6; p.cuerpo.position.y = 0; return; }
  const amp = Math.min(1, mov/3.5);
  const s = Math.sin(fase);
  p.pI.rotation.x = s*0.85*amp; p.pD.rotation.x = -s*0.85*amp;
  p.bI.rotation.x = -s*0.7*amp; p.bD.rotation.x = s*0.7*amp;
  p.bI.rotation.z = -0.12; p.bD.rotation.z = 0.12;
  p.cuerpo.position.y = Math.abs(Math.cos(fase))*0.05*amp + (amp < 0.1 ? Math.sin(fase*0.5)*0.015 : 0);
}
function animarPerro(g, mov, fase){
  const p = g.partes, amp = Math.min(1, mov/3), s = Math.sin(fase);
  p.patas[0].rotation.x = s*0.8*amp; p.patas[3].rotation.x = s*0.8*amp; p.patas[1].rotation.x = -s*0.8*amp; p.patas[2].rotation.x = -s*0.8*amp;
  p.cola.rotation.z = Math.sin(fase*3)*0.5; p.cola.rotation.x = 0.5;
  p.cuerpo.position.y = Math.abs(Math.cos(fase))*0.05*amp;
}
function ondearCapa(capa, t, fuerza){
  if (!capa) return;
  const pos = capa.geometry.attributes.position;
  for (let i=0;i<pos.count;i++){ const y = pos.getY(i); const k = (0.65 - y)/1.3; pos.setZ(i, -k*k*0.55*fuerza - Math.sin(t*9 + k*7)*0.08*k*(0.4+fuerza)); }
  pos.needsUpdate = true; capa.geometry.computeVertexNormals();
}

/* ---------------- Los vehículos ---------------- */
function rueda(r, ancho, color){
  const dir = new THREE.Group(), giro = new THREE.Group();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, ancho, 16), new THREE.MeshPhongMaterial({color: lin(0x1a1a1e), shininess: 14}));
  m.rotation.z = Math.PI/2; m.castShadow = true;
  const tapa = new THREE.Mesh(new THREE.CylinderGeometry(r*0.55, r*0.55, ancho+0.04, 10), new THREE.MeshPhongMaterial({color: lin(color||0xd8d8e0), shininess: 90, specular: lin(0xffffff)}));
  tapa.rotation.z = Math.PI/2; m.add(tapa);
  giro.add(m); dir.add(giro);
  return {dir, giro, r};
}
function armarVehiculo(id){
  const g = new THREE.Group(), A = new Armador(), R = {ruedas: [], id};
  if (id==='carro'){
    const c = '#e63946', claro = '#ff6b6b';
    A.caja(2.0, 0.55, 4.4, c, 0, 0.72, 0).caja(1.7, 0.72, 1.9, c, 0, 1.32, -0.3).caja(1.9, 0.12, 4.42, claro, 0, 1.03, 0)
     .caja(1.55, 0.5, 0.08, '#bfe9ff', 0, 1.34, 0.68, -0.35, 0, 0).caja(1.55, 0.44, 0.08, '#bfe9ff', 0, 1.34, -1.26, 0.35, 0, 0)
     .caja(0.06, 0.4, 1.3, '#bfe9ff', -0.86, 1.36, -0.3).caja(0.06, 0.4, 1.3, '#bfe9ff', 0.86, 1.36, -0.3)
     .caja(2.1, 0.26, 0.3, '#2a2a30', 0, 0.5, 2.22).caja(2.1, 0.26, 0.3, '#2a2a30', 0, 0.5, -2.22)
     .caja(0.36, 0.2, 0.12, '#fff6c0', -0.7, 0.82, 2.24).caja(0.36, 0.2, 0.12, '#fff6c0', 0.7, 0.82, 2.24)
     .caja(0.3, 0.16, 0.12, '#ff2020', -0.7, 0.82, -2.24).caja(0.3, 0.16, 0.12, '#ff2020', 0.7, 0.82, -2.24)
     .caja(0.5, 0.03, 4.4, '#ffffff', 0, 1.1, 0).caja(0.5, 0.03, 1.9, '#ffffff', 0, 1.69, -0.3)
     .caja(0.7, 0.3, 0.7, '#1a1a20', -0.4, 1.12, -0.5).caja(0.7, 0.6, 0.2, '#1a1a20', -0.4, 1.35, -0.85)
     .cil(0.18, 0.18, 0.05, '#2a2a2a', -0.4, 1.3, 0.2, 0.8, 0, 0, 10).caja(1.3, 0.08, 0.5, '#2a2a30', 0, 1.7, -1.35);
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    for (const [x,z,delante] of [[-1.05,1.35,true],[1.05,1.35,true],[-1.05,-1.35,false],[1.05,-1.35,false]]){ const w = rueda(0.42, 0.32); w.dir.position.set(x, 0.42, z); w.delante = delante; g.add(w.dir); R.ruedas.push(w); }
    R.asiento = {x:-0.4, y:0.85, z:-0.45, esc:0.6}; R.altoOjos = 1.4;
  } else if (id==='moto'){
    const c = '#4fc3f7';
    A.caja(0.44, 0.42, 1.7, c, 0, 0.8, 0).bola(0.34, c, 0, 1.06, 0.25, 10, 1, 0.7, 1.4).caja(0.5, 0.18, 0.8, '#1a1a20', 0, 1.06, -0.45)
     .caja(1.0, 0.06, 0.06, '#333', 0, 1.3, 0.72).caja(0.08, 0.5, 0.08, '#c8c8d0', -0.12, 1.02, 0.78, 0.4, 0, 0).caja(0.08, 0.5, 0.08, '#c8c8d0', 0.12, 1.02, 0.78, 0.4, 0, 0)
     .cil(0.16, 0.16, 0.14, '#fff6c0', 0, 1.1, 0.95, Math.PI/2, 0, 0, 10).cil(0.07, 0.07, 1.1, '#c8c8d0', 0.3, 0.55, -0.4, 1.3, 0, 0, 8)
     .caja(0.36, 0.3, 0.5, '#3a3a44', 0, 0.62, 0.05).caja(0.5, 0.06, 0.5, '#e63946', 0, 0.42, -0.9);
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    for (const [z,delante] of [[0.92,true],[-0.88,false]]){ const w = rueda(0.44, 0.24, 0x8a8a90); w.dir.position.set(0, 0.44, z); w.delante = delante; g.add(w.dir); R.ruedas.push(w); }
    R.asiento = {x:0, y:0.9, z:-0.3, esc:0.62}; R.altoOjos = 1.5;
  } else if (id==='barco'){
    A.caja(2.6, 1.0, 5.6, '#ffffff', 0, 0.55, -0.3).cono(1.3, 2.4, '#ffffff', 0, 0.55, 3.6, 4, Math.PI/2, Math.PI/4, 0)
     .caja(2.66, 0.24, 5.62, '#2a6ad0', 0, 0.62, -0.3).caja(2.4, 0.1, 5.2, '#e0c090', 0, 1.06, -0.3)
     .caja(1.8, 1.1, 1.9, '#ffffff', 0, 1.65, -0.9).caja(1.7, 0.5, 0.08, '#bfe9ff', 0, 1.75, 0.07).caja(0.08, 0.5, 1.4, '#bfe9ff', -0.9, 1.75, -0.9).caja(0.08, 0.5, 1.4, '#bfe9ff', 0.9, 1.75, -0.9)
     .caja(2.1, 0.12, 2.2, '#2a6ad0', 0, 2.26, -0.9).cil(0.05, 0.05, 2.6, '#c8c8d0', 0.6, 3.5, -1.6, 0,0,0,6)
     .caja(1.0, 0.6, 0.5, '#2a2a30', 0, 1.2, -3.2).cil(0.3, 0.3, 0.1, '#ff7a1a', -1.34, 1.2, -1.4, 0, 0, Math.PI/2, 12)
     .pieza(new THREE.TorusGeometry(0.34, 0.1, 6, 14), '#ff7a1a', 1.36, 1.3, -1.6, 0, Math.PI/2, 0)
     .cil(0.2, 0.2, 0.05, '#5a3418', 0, 1.6, 0.05, 1.2, 0, 0, 10);
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    R.bandera = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.6, 4, 1), new THREE.MeshLambertMaterial({color: lin(0xe63946), side: THREE.DoubleSide}));
    R.bandera.position.set(0.6, 4.5, -1.6); R.bandera.geometry.translate(-0.5, 0, 0); R.bandera.rotation.y = Math.PI/2; g.add(R.bandera);
    R.asiento = {x:0, y:1.1, z:-0.55, esc:0.7, parado:true}; R.altoOjos = 2.2;
  } else if (id==='avion'){
    const c = '#4fc3f7';
    A.cil(0.62, 0.5, 5.2, c, 0, 1.1, 0, Math.PI/2, 0, 0, 14).cono(0.62, 0.9, '#e63946', 0, 1.1, 3.05, 14, Math.PI/2, 0, 0).cono(0.5, 1.3, c, 0, 1.1, -3.25, 14, -Math.PI/2, 0, 0)
     .caja(9.0, 0.14, 1.6, '#ffffff', 0, 1.0, 0.3).caja(1.2, 0.16, 1.62, '#e63946', -3.9, 1.0, 0.3).caja(1.2, 0.16, 1.62, '#e63946', 3.9, 1.0, 0.3)
     .caja(3.2, 0.1, 0.9, '#ffffff', 0, 1.3, -2.8).caja(0.12, 1.3, 1.1, '#e63946', 0, 1.95, -2.9)
     .caja(0.9, 0.5, 0.08, '#bfe9ff', 0, 1.85, 0.95, -0.5, 0, 0).caja(0.5, 0.08, 4.4, '#ffffff', 0, 1.6, 0.2)
     .caja(0.1, 0.5, 0.1, '#5a6270', -1.4, 0.65, 0.6).caja(0.1, 0.5, 0.1, '#5a6270', 1.4, 0.65, 0.6).caja(0.08, 0.4, 0.08, '#5a6270', 0, 0.45, -2.6)
     .caja(0.4, 0.12, 0.4, '#ffd23f', 0, 1.02, 1.0);
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    for (const [x,y,z,r] of [[-1.4,0.34,0.6,0.34],[1.4,0.34,0.6,0.34],[0,0.22,-2.6,0.22]]){ const w = rueda(r, 0.2); w.dir.position.set(x, y, z); g.add(w.dir); R.ruedas.push(w); }
    R.helice = new THREE.Group(); R.helice.position.set(0, 1.1, 3.55);
    R.helice.add(new Armador().bola(0.2, '#ffd23f', 0,0,0, 8).caja(0.16, 2.4, 0.08, '#2a2a30', 0,0,0).caja(2.4, 0.16, 0.08, '#2a2a30', 0,0,0).malla(matBrillo()));
    g.add(R.helice);
    R.asiento = {x:0, y:1.05, z:0.1, esc:0.62}; R.altoOjos = 1.9;
  } else if (id==='sub'){
    const c = '#ffd23f';
    A.cil(1.1, 1.1, 5.5, c, 0, 1.1, 0, Math.PI/2, 0, 0, 16).bola(1.1, c, 0, 1.1, 2.75, 12, 1, 1, 0.9).cono(1.1, 1.8, c, 0, 1.1, -3.6, 14, -Math.PI/2, 0, 0)
     .caja(1.2, 1.0, 1.9, c, 0, 2.5, 0.2).cil(0.08, 0.08, 1.2, '#333', 0.35, 3.5, -0.3, 0,0,0,6).caja(0.3, 0.14, 0.14, '#333', 0.45, 4.1, -0.3)
     .caja(3.2, 0.1, 0.9, '#f0a020', 0, 1.1, -2.7).caja(0.1, 1.5, 0.9, '#f0a020', 0, 1.9, -2.9).caja(1.6, 0.1, 0.8, '#f0a020', 0, 2.55, 1.1)
     .caja(0.3, 0.3, 4.0, '#f0a020', 0, 0.12, 0);
    for (const lado of [-1,1]) for (const z of [-1.4, 0, 1.4]){ A.cil(0.3, 0.3, 0.16, '#2a2a30', lado*1.1, 1.3, z, 0, 0, Math.PI/2, 12); A.cil(0.22, 0.22, 0.2, '#bfe9ff', lado*1.1, 1.3, z, 0, 0, Math.PI/2, 12); }
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    R.cupula = new THREE.Mesh(new THREE.SphereGeometry(0.8, 14, 10), new THREE.MeshPhongMaterial({color: lin(0xbfe9ff), transparent:true, opacity:0.38, shininess:120, specular: lin(0xffffff), depthWrite:false}));
    R.cupula.position.set(0, 3.0, 0.3); g.add(R.cupula);
    R.helice = new THREE.Group(); R.helice.position.set(0, 1.1, -4.55);
    R.helice.add(new Armador().bola(0.18, '#2a2a30', 0,0,0, 6).caja(0.2, 1.6, 0.08, '#8a8a90', 0,0,0, 0,0,0).caja(0.2, 1.6, 0.08, '#8a8a90', 0,0,0, 0,0,1.05).caja(0.2, 1.6, 0.08, '#8a8a90', 0,0,0, 0,0,2.1).malla(matBrillo()));
    g.add(R.helice);
    R.asiento = {x:0, y:2.3, z:0.3, esc:0.5}; R.altoOjos = 2.6;
  }
  else if (id==='heli'){
    const c = '#e63946';
    A.bola(1.3, c, 0, 1.5, 0.4, 12, 1, 0.85, 1.3).caja(1.6, 1.0, 1.4, c, 0, 1.3, -0.6).caja(0.5, 0.5, 4.2, c, 0, 1.7, -3.0).caja(0.16, 1.4, 0.8, c, 0, 2.4, -5.0).caja(1.4, 0.12, 0.5, '#ffffff', 0, 2.2, -4.8)
     .bola(1.05, '#bfe9ff', 0, 1.6, 1.3, 12, 1, 0.75, 0.9).caja(1.8, 0.12, 0.3, '#ffffff', 0, 1.0, 0.6)
     .cil(0.1, 0.1, 1.1, '#5a6270', -0.9, 0.55, 0.6, 0,0,0,6).cil(0.1, 0.1, 1.1, '#5a6270', 0.9, 0.55, 0.6, 0,0,0,6).cil(0.1, 0.1, 1.1, '#5a6270', -0.9, 0.55, -0.8, 0,0,0,6).cil(0.1, 0.1, 1.1, '#5a6270', 0.9, 0.55, -0.8, 0,0,0,6)
     .caja(0.14, 0.14, 3.4, '#5a6270', -0.95, 0.07, 0).caja(0.14, 0.14, 3.4, '#5a6270', 0.95, 0.07, 0).cil(0.35, 0.35, 0.5, '#2a2a30', 0, 2.55, 0.1, 0,0,0,8);
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    R.helice = new THREE.Group(); R.helice.position.set(0, 2.85, 0.1);
    R.helice.add(new Armador().bola(0.22, '#2a2a30', 0,0,0, 6).caja(9, 0.08, 0.36, '#3a3a44', 0,0,0).caja(0.36, 0.08, 9, '#3a3a44', 0,0,0).malla(matBrillo()));
    g.add(R.helice);
    R.cola = new THREE.Group(); R.cola.position.set(0.32, 2.4, -5.0);
    R.cola.add(new Armador().caja(0.06, 1.6, 0.16, '#3a3a44', 0,0,0).caja(0.06, 0.16, 1.6, '#3a3a44', 0,0,0).malla(matBrillo()));
    g.add(R.cola);
    R.asiento = {x:0, y:0.95, z:0.5, esc:0.62}; R.altoOjos = 1.9;
  } else if (id==='ptero'){
    const c = '#8a5a3a', claro = '#d9a066';
    A.bola(0.9, c, 0, 1.6, 0, 12, 1, 0.8, 2.0).bola(0.55, claro, 0, 1.45, 0.3, 10, 1, 0.55, 1.6)
     .bola(0.55, c, 0, 2.2, 2.0, 10, 1, 0.8, 1.0).cono(0.32, 1.8, '#e0a040', 0, 2.05, 3.5, 6, Math.PI/2, 0, 0).cono(0.3, 1.4, c, 0, 2.7, 1.2, 5, -Math.PI/2, 0, 0)
     .bola(0.14, '#ffffff', -0.32, 2.4, 2.25, 8).bola(0.14, '#ffffff', 0.32, 2.4, 2.25, 8).bola(0.07, '#111', -0.34, 2.4, 2.38, 6).bola(0.07, '#111', 0.34, 2.4, 2.38, 6)
     .cono(0.5, 2.0, c, 0, 1.55, -2.8, 6, Math.PI/2, 0, 0).caja(0.16, 0.8, 0.16, c, -0.35, 0.6, -0.2, 0.3, 0, 0).caja(0.16, 0.8, 0.16, c, 0.35, 0.6, -0.2, 0.3, 0, 0)
     .caja(1.2, 0.12, 0.8, '#8b4513', 0, 2.2, -0.4).caja(0.14, 0.5, 0.14, '#8b4513', 0, 2.5, 0.3);
    R.cuerpo = A.malla(matMate()); g.add(R.cuerpo);
    R.alas = [];
    for (const s of [-1, 1]){ const ala = new THREE.Group(); ala.position.set(s*0.7, 1.9, 0);
      ala.add(new Armador().caja(3.6, 0.1, 2.2, claro, s*1.8, 0, -0.3).caja(2.4, 0.12, 1.4, c, s*3.9, 0, -0.6).caja(0.16, 0.16, 2.4, c, s*0.2, 0.06, -0.2).caja(0.14, 0.14, 2.0, c, s*3.2, 0.06, -0.4).malla(matMate()));
      g.add(ala); R.alas.push(ala); }
    R.asiento = {x:0, y:2.1, z:-0.4, esc:0.62}; R.altoOjos = 3.3;
  } else if (id==='motoagua'){
    const c = '#7de0ff';
    A.caja(1.1, 0.5, 2.8, c, 0, 0.5, 0).cono(0.6, 1.0, c, 0, 0.5, 1.9, 4, Math.PI/2, Math.PI/4, 0).caja(1.2, 0.2, 2.9, '#1a4a90', 0, 0.32, 0)
     .caja(0.7, 0.4, 1.3, '#1a1a20', 0, 0.9, -0.5).bola(0.45, c, 0, 0.85, 0.7, 8, 1, 0.6, 1.2).caja(0.9, 0.06, 0.06, '#333', 0, 1.25, 0.9)
     .caja(0.08, 0.5, 0.08, '#c8c8d0', -0.12, 1.0, 0.95, 0.3,0,0).caja(0.08, 0.5, 0.08, '#c8c8d0', 0.12, 1.0, 0.95, 0.3,0,0);
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    R.asiento = {x:0, y:1.0, z:-0.45, esc:0.62}; R.altoOjos = 1.6;
  } else if (id==='nave'){
    const c = '#ffffff';
    A.cil(1.1, 1.3, 4.6, c, 0, 3.4, 0, 0,0,0,16).cono(1.1, 2.4, '#e63946', 0, 6.9, 0, 16).cil(1.3, 0.9, 0.8, '#e63946', 0, 0.75, 0, 0,0,0,16)
     .cil(0.6, 0.7, 0.9, '#5a6270', 0, 0.1, 0, 0,0,0,12)
     .cil(0.6, 0.6, 0.12, '#2a2a30', 0, 4.3, 1.28, Math.PI/2, 0, 0, 14).cil(0.48, 0.48, 0.14, '#bfe9ff', 0, 4.3, 1.3, Math.PI/2, 0, 0, 14)
     .caja(0.5, 0.06, 4.6, '#e63946', 0, 3.4, 1.3).caja(0.5, 0.06, 4.6, '#e63946', 0, 3.4, -1.3);
    for (let i=0;i<3;i++){ const a = i/3*6.283 + Math.PI/2; A.caja(0.18, 2.2, 1.6, '#e63946', Math.cos(a)*1.5, 1.2, Math.sin(a)*1.5, 0, -a, 0); A.cil(0.16, 0.16, 0.5, '#5a6270', Math.cos(a)*1.9, 0.2, Math.sin(a)*1.9, 0,0,0,6); }
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    R.fuego = new THREE.Mesh(new THREE.ConeGeometry(0.7, 3.2, 10), new THREE.MeshBasicMaterial({color: 0xffa020, transparent: true, opacity: 0.85}));
    R.fuego.rotation.x = Math.PI; R.fuego.position.set(0, -1.6, 0); R.fuego.visible = false; g.add(R.fuego);
    R.asiento = {x:0, y:3.7, z:0.3, esc:0.5}; R.altoOjos = 4.3;
  } else if (id==='dino'){
    const c = '#5aa04a', claro = '#8fd45e';
    A.bola(1.3, c, 0, 2.2, -0.2, 12, 1.1, 1, 1.6).bola(0.9, claro, 0, 1.9, 0.1, 10, 0.9, 0.7, 1.4)
     .cil(0.5, 0.7, 2.6, c, 0, 3.3, 1.5, 0.9, 0, 0, 10).bola(0.95, c, 0, 4.4, 2.7, 12, 1, 0.9, 1.3).caja(0.9, 0.5, 1.4, c, 0, 4.0, 3.6).caja(0.8, 0.3, 1.2, claro, 0, 3.65, 3.5)
     .bola(0.18, '#ffffff', -0.42, 4.6, 3.1, 8).bola(0.18, '#ffffff', 0.42, 4.6, 3.1, 8).bola(0.08, '#111', -0.44, 4.6, 3.26, 6).bola(0.08, '#111', 0.44, 4.6, 3.26, 6)
     .cono(0.45, 1.2, c, 0, 5.1, 2.6, 6).cono(0.9, 3.4, c, 0, 2.2, -2.9, 8, Math.PI/2, 0, 0)
     .caja(0.3, 0.7, 0.3, c, -0.9, 2.6, 0.9, 0.6, 0, 0).caja(0.3, 0.7, 0.3, c, 0.9, 2.6, 0.9, 0.6, 0, 0)
     .caja(1.4, 0.12, 0.9, '#8b4513', 0, 3.1, -0.3).caja(0.16, 0.6, 0.16, '#8b4513', 0, 3.4, 0.3);
    for (let i=0;i<5;i++) A.caja(0.12, 0.28, 0.1, '#ffffff', -0.32 + i*0.16, 3.85, 4.28);
    for (let i=0;i<6;i++) A.cono(0.22, 0.5, '#2e7d32', 0, 3.6 - i*0.15, 0.8 - i*0.75, 4);
    R.cuerpo = A.malla(matMate()); g.add(R.cuerpo);
    R.patas = [];
    for (const x of [-0.7, 0.7]){ const p = new Armador().caja(0.55, 1.6, 0.7, c, 0, -0.8, 0).caja(0.7, 0.3, 1.0, claro, 0, -1.65, 0.2).cono(0.12, 0.3, '#ffffff', -0.2, -1.7, 0.75, 4, Math.PI/2,0,0).cono(0.12, 0.3, '#ffffff', 0.2, -1.7, 0.75, 4, Math.PI/2,0,0).malla(matMate()); p.position.set(x, 1.8, -0.4); g.add(p); R.patas.push(p); }
    R.asiento = {x:0, y:3.25, z:-0.3, esc:0.62}; R.altoOjos = 4.5;
  }
  const sombra = new THREE.Mesh(new THREE.CircleGeometry(id==='avion' ? 3.2 : id==='barco' || id==='heli' ? 2.6 : id==='dino' ? 2.2 : 1.8, 16), new THREE.MeshBasicMaterial({color:0x000000, transparent:true, opacity:0.18, depthWrite:false}));
  sombra.rotation.x = -Math.PI/2; sombra.position.y = 0.04; g.add(sombra); R.sombra = sombra;
  g.partes = R;
  return g;
}

/* ---------------- Todo el elenco, puesto en la isla ---------------- */
let fer = armarJugador('fernando'); scene.add(fer);
let ferSentado = armarJugador('fernando'); ferSentado.visible = false; scene.add(ferSentado);
function ponerPersonaje(pj){
  if (!PERSONAJES_RED.some(p=>p.id===pj)) return;
  if (P) P.pj = pj;
  if (fer.parent) fer.parent.remove(fer); if (ferSentado.parent) ferSentado.parent.remove(ferSentado);
  fer = armarJugador(pj); scene.add(fer);
  ferSentado = armarJugador(pj); ferSentado.visible = false; scene.add(ferSentado);
}
const tioJuan = armarPersona('tiojuan'); scene.add(tioJuan);
tioJuan.partes.bI.rotation.x = -2.9; tioJuan.partes.bD.rotation.x = -2.9;
const familiaMesh = {};
for (const f of FAMILIA){
  const m = armarPersona(f.id);
  m.position.set(f.x, altura(f.x, f.z), f.z); m.rotation.y = f.ang;
  if (f.id==='romulo' && NOCHE){ const cerveza = new Armador().cil(0.1, 0.1, 0.36, '#c98a2a', 0, 0, 0, 0,0,0,8).cil(0.05, 0.06, 0.12, '#c98a2a', 0, 0.22, 0, 0,0,0,6).caja(0.2, 0.14, 0.02, '#1a3a8a', 0, 0.02, 0.1).caja(0.18, 0.06, 0.02, '#ffffff', 0, 0.03, 0.11).malla(matBrillo()); cerveza.position.set(0.44, 1.2, 0.3); m.add(cerveza); }
  const et = letrero(f.nombre, '#fff', 'rgba(20,20,50,0.75)', 1.1); et.position.y = 2.5/m.esc; m.add(et); m.etiqueta = et;
  scene.add(m); familiaMesh[f.id] = m;
}
const perrosMesh = {};
for (const p of PERROS_DEF){
  const m = armarPerro(p.color); scene.add(m); perrosMesh[p.id] = m;
  const et = letrero(p.nombre, '#fff', 'rgba(20,20,50,0.75)', 0.9); et.position.y = 1.9; m.add(et); m.etiqueta = et;
}
const srPopo = armarSrPopo(); scene.add(srPopo);
{ const et = letrero('Señor Popo', '#fff', 'rgba(90,50,20,0.85)', 1.3); et.position.y = 3.4; srPopo.add(et); }
const vehMesh = {};
for (const v of VEHICULOS_DEF){
  const m = armarVehiculo(v.id); scene.add(m); vehMesh[v.id] = m;
  const et = letrero(v.emoji+' '+v.nombre.replace('el ','').replace('la ','').toUpperCase(), '#fff', 'rgba(20,20,50,0.8)', 1.6);
  et.position.y = v.id==='avion' ? 4.2 : v.id==='barco' ? 5.6 : v.id==='sub' ? 4.8 : v.id==='heli' ? 5.2 : v.id==='nave' ? 9.5 : v.id==='dino' ? 6.8 : v.id==='ptero' ? 5.2 : 3.0; m.add(et); m.etiqueta = et;
}

/* ---------------- Jugar con amigos: PeerJS ----------------
   Los navegadores se conectan directo entre sí (WebRTC); el servidor
   público de PeerJS solo presenta a los dos aparatos por el código de sala.
   El que crea la sala es el anfitrión: recibe lo de cada amigo y se lo
   reenvía a los demás. Cada quien juega su propia partida y ve a los otros
   corriendo, manejando y volando por la misma isla. */
const RED = {estado:'off', peer:null, conns:new Map(), sala:'', anfitrion:false, remotos:new Map(), pj:'fernando', error:'', codigo:'', pendiente:'', entrandoCodigo:false, avisos:[]};
try{ const g = localStorage.getItem('aventura3d.pj'); if (g && PERSONAJES_RED.some(p=>p.id===g)) RED.pj = g; }catch(e){}
try{ const c = normalizarCodigo(new URL(location.href).searchParams.get('sala')); if (c.length===4) RED.pendiente = c; }catch(e){}
const nombreLocal = ()=> PERSONAJES_RED.find(p=>p.id===RED.pj).nombre;
const hayPeerJS = ()=> typeof Peer !== 'undefined';
const redActiva = ()=> !!RED.peer && (RED.estado==='sala' || RED.estado==='conectado');
const enlaceSala = ()=> location.origin + location.pathname + '?sala=' + RED.sala + (MAPA===2 ? '&mapa=2' : '');
/* Los servidores que ayudan a que dos aparatos se encuentren: STUN para
   descubrir la dirección de cada uno, y TURN (relevo gratuito de Open Relay)
   para cuando el router no deja hablar directo, por ejemplo en WiFi con
   aislamiento entre aparatos o cuando uno está con datos móviles. */
const RED_CONFIG = {debug:0, config:{iceServers:[
  {urls:'stun:stun.l.google.com:19302'}, {urls:'stun:stun1.l.google.com:19302'}, {urls:'stun:stun.relay.metered.ca:80'},
  {urls:'turn:openrelay.metered.ca:80', username:'openrelayproject', credential:'openrelayproject'},
  {urls:'turn:openrelay.metered.ca:443', username:'openrelayproject', credential:'openrelayproject'},
  {urls:'turn:openrelay.metered.ca:443?transport=tcp', username:'openrelayproject', credential:'openrelayproject'},
]}};
function textoErrorRed(e){
  const t = e && e.type;
  if (t==='peer-unavailable') return 'No encontré la sala '+RED.sala+'. Revisa el código, o pide que la creen otra vez.';
  if (t==='network' || t==='server-error' || t==='socket-error' || t==='socket-closed') return 'No pude hablar con el servidor de salas. Revisa el internet y vuelve a intentar.';
  if (t==='browser-incompatible') return 'Este navegador no puede jugar en línea. Prueba con Chrome o Safari actualizados.';
  return 'Algo falló en la conexión ('+(t||'?')+'). Vuelve a intentar.';
}
function redLimpiar(){
  vozCortarTodo();
  if (RED.peer){ try{ RED.peer.destroy(); }catch(e){} }
  RED.peer = null; RED.conns.clear();
  for (const id of [...RED.remotos.keys()]) quitarRemoto(id);
  RED.anfitrion = false;
}
function redCrear(){
  if (!hayPeerJS()){ RED.estado = 'error'; RED.error = 'No se cargó la parte de red. Revisa la conexión y recarga la página.'; return; }
  redLimpiar(); RED.estado = 'creando'; RED.sala = codigoSala(); RED.anfitrion = true; RED.error = '';
  const peer = new Peer('fernando-bros-'+RED.sala, RED_CONFIG);
  RED.peer = peer;
  peer.on('open', ()=>{ if (RED.peer===peer) RED.estado = 'sala'; });
  peer.on('call', c=>{ if (RED.peer===peer) atenderLlamada(c); });
  peer.on('connection', conn=>{
    if (RED.peer!==peer) return;
    if (RED.conns.size >= MAX_JUGADORES-1){ conn.on('open', ()=>{ try{ conn.send({t:'llena', max:MAX_JUGADORES}); }catch(e){} setTimeout(()=>{ try{ conn.close(); }catch(e){} }, 800); }); return; }
    prepararConn(conn);
  });
  peer.on('error', e=>{ if (RED.peer!==peer) return; if (e.type==='unavailable-id'){ redCrear(); return; } RED.estado = 'error'; RED.error = textoErrorRed(e); RED.anfitrion = false; });
  peer.on('disconnected', ()=>{ try{ if (RED.peer===peer && !peer.destroyed) peer.reconnect(); }catch(e){} });
  setTimeout(()=>{ if (RED.peer===peer && RED.estado==='creando'){ RED.estado = 'error'; RED.error = 'El servidor de salas no respondió. Revisa el internet y vuelve a intentar.'; } }, 15000);
}
function redUnirse(codigo){
  codigo = normalizarCodigo(codigo);
  if (codigo.length !== 4){ RED.error = 'El código tiene 4 letras o números'; return; }
  if (!hayPeerJS()){ RED.estado = 'error'; RED.error = 'No se cargó la parte de red. Revisa la conexión y recarga la página.'; return; }
  redLimpiar(); RED.estado = 'uniendo'; RED.sala = codigo; RED.anfitrion = false; RED.error = ''; RED.entrandoCodigo = false; RED.aviso_ = '';
  const peer = new Peer(RED_CONFIG);
  RED.peer = peer;
  peer.on('call', c=>{ if (RED.peer===peer) atenderLlamada(c); });
  peer.on('open', ()=>{ if (RED.peer!==peer) return; prepararConn(peer.connect('fernando-bros-'+codigo, {reliable:true, serialization:'json'})); });
  peer.on('error', e=>{ if (RED.peer!==peer) return; RED.estado = 'error'; RED.error = textoErrorRed(e); });
  peer.on('disconnected', ()=>{ try{ if (RED.peer===peer && !peer.destroyed) peer.reconnect(); }catch(e){} });
  setTimeout(()=>{ if (RED.peer===peer && RED.estado==='uniendo') RED.aviso_ = 'Encontré la sala, conectando con el anfitrión… puede tardar unos segundos'; }, 6000);
  setTimeout(()=>{ if (RED.peer===peer && RED.estado==='uniendo'){ RED.estado = 'error'; RED.error = 'Encontré la sala '+codigo+' pero no se abrió la conexión. Prueba: los dos en el mismo mapa · el que la creó con la sala abierta en el juego · los dos por WiFi (o los dos con datos) · y vuelve a intentar.'; } }, 25000);
}
function redSalir(){ if (RED.conns.size) redEnviar({t:'chau'}); redLimpiar(); RED.estado = 'off'; RED.sala = ''; }
function prepararConn(conn){
  conn.on('open', ()=>{
    RED.conns.set(conn.peer, conn);
    try{ conn.send({t:'hola', pj:RED.pj, n:nombreLocal(), v:VERSION_RED, es:P.estrellas.slice(), mapa:MAPA}); }catch(e){}
    if (VOZ.stream) vozLlamar(conn.peer);
    if (!RED.anfitrion){ RED.estado = 'conectado'; if (estado!=='juego'){ estado = 'juego'; cortina = 20; } aviso('👥 ¡Entraste a la sala '+RED.sala+'!'); sfx.estrella(); }
  });
  conn.on('data', m=>redRecibir(conn.peer, m));
  const cerrar = ()=>{
    if (!RED.conns.has(conn.peer)) return;
    RED.conns.delete(conn.peer);
    const r = RED.remotos.get(conn.peer);
    if (r) aviso(r.nombre+' se fue de la isla 👋');
    quitarRemoto(conn.peer);
    if (RED.anfitrion) redEnviar({t:'r', de:conn.peer, m:{t:'chau'}});
    else { aviso('Se cerró la sala; sigues jugando solo'); redLimpiar(); RED.estado = 'off'; RED.sala = ''; }
  };
  conn.on('close', cerrar); conn.on('error', cerrar);
}
function redEnviar(m){ for (const [,c] of RED.conns){ try{ if (c.open) c.send(m); }catch(e){} } }
function redEvento(tipo, datos){ if (RED.conns.size) redEnviar(Object.assign({t:'ev', tipo}, datos||{})); }
function redRecibir(id, m){
  if (!m || typeof m !== 'object') return;
  if (m.t==='r'){ if (!RED.anfitrion && typeof m.de==='string' && m.m && typeof m.m==='object') redRecibir(m.de, m.m); return; }
  if (RED.anfitrion){ for (const [pid, c] of RED.conns) if (pid!==id){ try{ if (c.open) c.send({t:'r', de:id, m}); }catch(e){} } }
  if (m.t==='mapa' && !RED.anfitrion && (m.mapa===1 || m.mapa===2) && m.mapa !== MAPA){
    const sala = RED.sala; redLimpiar(); RED.estado = 'error';
    RED.error = 'La sala '+sala+' está en el mapa '+(m.mapa===2 ? '2, Maracaibo de noche 🌙' : '1, la isla de día ☀️')+'. Te llevo allá…';
    try{ localStorage.setItem('aventura3d.mapa', String(m.mapa)); }catch(e){}
    setTimeout(()=>{ location.href = location.pathname + '?mapa=' + m.mapa + '&sala=' + sala; }, 1800);
    return;
  }
  if (m.t==='llena'){ if (!RED.anfitrion){ redLimpiar(); RED.estado = 'error'; RED.error = 'La sala '+RED.sala+' está llena: ya hay '+MAX_JUGADORES+' jugadores. Pídele a alguien que cree otra sala.'; if (estado==='juego') estado = 'amigos'; } return; }
  if (m.t==='voz'){ const r = RED.remotos.get(id); if (r){ r.hablando = !!m.on; r.hablaT = tick; } return; }
  if (m.t==='chau'){ const r = RED.remotos.get(id); if (r) aviso(r.nombre+' se fue de la isla 👋'); quitarRemoto(id); return; }
  if (m.t==='hola'){
    const pj = PERSONAJES_RED.some(p=>p.id===m.pj) ? m.pj : 'fernando';
    const nombre = String(m.n||'').replace(/[^\wáéíóúñÁÉÍÓÚÑ ]/g, '').slice(0, 14) || PERSONAJES_RED.find(p=>p.id===pj).nombre;
    if (m.mapa && m.mapa !== MAPA){ aviso('🗺️ '+nombre+' estaba en el otro mapa: lo traigo a este'); try{ const c = RED.conns.get(id); if (c){ c.send({t:'mapa', mapa:MAPA}); setTimeout(()=>{ try{ c.close(); }catch(e){} }, 1200); } }catch(e){} return; }
    if (!RED.remotos.has(id)) crearRemoto(id, {pj, nombre, x:P.J.x, y:P.J.y, z:P.J.z, ang:0, veh:'', mov:0, fase:0, nadando:false, suelo:true, cabeceo:0, giro:0, vel:0, aire:false, popitos:0, ganas:false, estrellas:0});
    aviso('👋 '+nombre+' entró a la isla'); sfx.saludo();
    /* las estrellas se comparten: lo que ya ganó cualquiera es de todos */
    if (Array.isArray(m.es)){ let nuevas = 0; for (const eid of m.es.slice(0, 12)) if (MISIONES.some(mi=>mi.id===eid) && !P.estrellas.includes(eid)){ P.estrellas.push(eid); P.puntos += 2000; nuevas++; } if (nuevas){ guardar(); pintarMisiones(); aviso('⭐ '+nombre+' te compartió '+nuevas+(nuevas===1 ? ' estrella' : ' estrellas')); } }
    return;
  }
  if (m.t==='e'){
    const e = desempaquetarEstado(m); if (!e) return;
    let r = RED.remotos.get(id);
    if (!r) r = crearRemoto(id, e);
    else if (r.pj !== e.pj || r.nombre !== e.nombre){ const hab = r.hablando; quitarRemoto(id); r = crearRemoto(id, e); r.hablando = hab; r.hablaT = tick; }
    r.obj = e; r.t = tick;
    return;
  }
  if (m.t==='ev'){
    const r = RED.remotos.get(id); if (!r) return;
    const x = Number.isFinite(m.x) ? m.x : r.act.x, y = Number.isFinite(m.y) ? m.y : r.act.y, z = Number.isFinite(m.z) ? m.z : r.act.z;
    const cerca = Math.hypot(x-P.J.x, z-P.J.z) < 80;
    if (m.tipo==='pedo'){ nubePeo(x, y, z, !!m.grande); if (cerca) sfx.pedo(!!m.grande); }
    else if (m.tipo==='hamburguesa'){ chispas(x, y, z, '#ffe36e', 10, 4); if (cerca) sfx.hamburguesa(); }
    else if (m.tipo==='estrella'){ confeti(x, y, z, 30); sfx.estrella(); recibirEstrella(m.id, r.nombre); }
    else if (m.tipo==='popo'){ confeti(x, y, z, 12); aviso('💩 '+r.nombre+' hizo popo'); }
    else if (m.tipo==='salto' && cerca){ sfx.salto(); }
    else if (m.tipo==='habla' && cerca && CLAVES_DIALOGO.includes(m.k)){ const texto = fraseDe(r.pj, m.k, String(m.id||'')); if (texto){ hablar(texto, r.pj); burbuja(texto, r.nombre); } }
  }
}
/* una estrella ganada por un amigo también es tuya */
function recibirEstrella(id, nombre){
  const mi = MISIONES.find(m=>m.id===id);
  if (!mi){ aviso('⭐ '+nombre+' ganó una estrella'); return; }
  if (P.estrellas.includes(id)){ aviso('⭐ '+nombre+' también ganó la estrella '+mi.emoji); return; }
  P.estrellas.push(id); P.puntos += 2000; guardar(); pintarMisiones();
  grande('⭐ '+nombre.toUpperCase()+' GANÓ UNA ESTRELLA: ¡ES DE LOS DOS!', '#ffe36e', 150); estrellaAnim = {t:0};
  if (P.estrellas.length === MISIONES.length && !P.final){ P.final = true; P.eventos.push({tipo:'final'}); }
}
function pintarMisiones(){
  if (P.estrellas.includes('avion')) arosMesh.forEach(m=>m.material.color.copy(lin(0x7dffa0)));
  if (P.estrellas.includes('moto')) aroRampa.material.color.copy(lin(0x7dffa0));
  if (P.estrellas.includes('carro')) banderasMesh.forEach(g=>g.bandera.material.color.copy(lin(0xffd23f)));
  if (NOCHE_VISTA) NOCHE_VISTA.arosNoche.forEach((m, i)=>{ m.material.color.copy(P.prog.arosNoche.includes(i) || P.estrellas.includes('ptero') ? lin(0x7dffa0) : lin(0xc07dff)); });
}
function crearRemoto(id, e){
  const r = {id, pj:e.pj, nombre:e.nombre, obj:e, act:{x:e.x, y:e.y, z:e.z, ang:e.ang}, t:tick, fase:0, vehs:{}};
  r.g = armarJugador(e.pj); r.g.visible = false; scene.add(r.g);
  r.gs = armarJugador(e.pj); r.gs.visible = false; scene.add(r.gs);
  r.etiqueta = letrero('👤 '+e.nombre, '#fff', 'rgba(20,80,170,0.88)', 1.4); r.etiqueta.position.y = 2.6/r.g.esc; r.g.add(r.etiqueta);
  r.bocina = letrero('🔊', '#fff', 'rgba(40,160,80,0.9)', 0.9); r.bocina.position.y = 3.4/r.g.esc; r.bocina.visible = false; r.g.add(r.bocina);
  r.hablando = false; r.hablaT = 0;
  RED.remotos.set(id, r); if (VOZ.stream) vozLlamar(id); return r;
}
function quitarRemoto(id){
  vozCortar(id);
  const r = RED.remotos.get(id); if (!r) return;
  scene.remove(r.g); if (r.gs.parent) r.gs.parent.remove(r.gs);
  for (const k in r.vehs) scene.remove(r.vehs[k]);
  RED.remotos.delete(id);
}
function sincronizarRemotos(){
  for (const [id, r] of RED.remotos){
    if (tick - r.t > 60*12){ quitarRemoto(id); continue; }
    const o = r.obj, a = r.act;
    a.x += (o.x-a.x)*0.22; a.y += (o.y-a.y)*0.22; a.z += (o.z-a.z)*0.22; a.ang = envolver(a.ang + envolver(o.ang-a.ang)*0.22);
    r.fase += o.mov*DT*2.2 + DT*0.5;
    if (o.veh){
      let vm = r.vehs[o.veh];
      if (!vm){ vm = armarVehiculo(o.veh); const et = letrero('👤 '+r.nombre, '#fff', 'rgba(20,80,170,0.88)', 1.4); et.position.y = o.veh==='avion' ? 4.2 : o.veh==='barco' ? 5.6 : o.veh==='sub' ? 4.8 : o.veh==='heli' ? 5.2 : o.veh==='nave' ? 9.5 : o.veh==='dino' ? 6.8 : o.veh==='ptero' ? 5.2 : 3.0; vm.add(et); scene.add(vm); r.vehs[o.veh] = vm; }
      for (const k in r.vehs) r.vehs[k].visible = k===o.veh;
      vm.position.set(a.x, a.y, a.z);
      vm.rotation.set(-o.cabeceo, a.ang, o.veh==='avion' && o.aire ? o.giro*0.7 : o.veh==='moto' ? o.giro*0.45 : o.giro*0.1, 'YXZ');
      const R = vm.partes;
      for (const w of R.ruedas){ w.giro.rotation.x += o.vel*DT/w.r; if (w.delante) w.dir.rotation.y = o.giro*0.45; }
      animarVehiculo(R, o.veh, true, o.vel, o.aire, o.y > 260, tick*DT);
      R.sombra.visible = o.veh!=='sub';
      if (r.gs.parent !== vm) vm.add(r.gs);
      r.gs.visible = true; r.gs.position.set(R.asiento.x, R.asiento.y, R.asiento.z); r.gs.scale.setScalar(r.gs.esc*R.asiento.esc); r.gs.rotation.set(0,0,0);
      animarModelo(r.gs, 0, 0, false, false, !R.asiento.parado);
      r.g.visible = false;
    } else {
      for (const k in r.vehs) r.vehs[k].visible = false;
      r.gs.visible = false;
      r.g.visible = true; r.g.position.set(a.x, a.y, a.z); r.g.rotation.set(o.nadando ? (r.g.tipo==='persona' ? 1.2 : 0.3) : 0, a.ang, 0);
      animarModelo(r.g, o.mov, r.fase, !o.suelo && !o.nadando, o.nadando);
      r.etiqueta.visible = Math.hypot(a.x-P.J.x, a.z-P.J.z) > 3;
    }
    r.bocina.visible = r.hablando && !o.veh;
  }
}
function redPaso(){
  if (!redActiva() || !RED.conns.size) return;
  if (tick % 4 === 0) redEnviar(empaquetarEstado(P, RED.pj, nombreLocal()));
}
/* ---- el walkie-talkie: mantener 🎙️ (o V) para hablar; la voz viaja por WebRTC ----
   El micrófono se pide una sola vez, la primera que se aprieta el botón. Los
   sonidos del micro se apagan al soltar (push-to-talk), así nadie se oye sin
   querer. Cada jugador llama a los demás por PeerJS; la voz sale del parlante
   con volumen según la distancia en la isla. */
const VOZ = {stream:null, permiso:'', hablando:false, pidiendo:false, llamadas:new Map(), audios:new Map(), silencio:false, quiere:false, avisoT:0};
try{ VOZ.silencio = localStorage.getItem('aventura3d.silencio') === 'si'; }catch(e){}
const hayMicrofono = ()=> !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
function vozEmpezar(){
  VOZ.quiere = true;
  if (!redActiva()){ if (estado==='juego') aviso('Para hablar, primero entra a una sala 👥 (menú ☰)'); return; }
  if (!hayMicrofono()){ aviso('Este navegador no deja usar el micrófono'); return; }
  if (VOZ.permiso==='negado'){ aviso('Sin permiso de micrófono: actívalo en Ajustes → Safari → Micrófono y recarga'); VOZ.pidiendo = false; }
  if (VOZ.stream){ vozAbrir(); return; }
  if (VOZ.pidiendo) return;
  VOZ.pidiendo = true;
  navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true, noiseSuppression:true, autoGainControl:true}, video:false}).then(st=>{
    VOZ.pidiendo = false; VOZ.stream = st; VOZ.permiso = 'ok';
    for (const t of st.getAudioTracks()) t.enabled = false;
    aviso('🎙️ Micrófono listo: mantén apretado para hablar');
    vozLlamarATodos();
    if (VOZ.quiere) vozAbrir();
  }).catch(e=>{
    VOZ.pidiendo = false; VOZ.permiso = 'negado';
    aviso(e && e.name==='NotFoundError' ? 'No encontré micrófono en este aparato' : 'Sin permiso de micrófono: toca "Permitir" cuando lo pida');
  });
}
function vozAbrir(){
  if (!VOZ.stream || VOZ.hablando) return;
  for (const t of VOZ.stream.getAudioTracks()) t.enabled = true;
  VOZ.hablando = true; sfx.toque();
  redEnviar({t:'voz', on:1});
}
function vozParar(){
  VOZ.quiere = false;
  if (!VOZ.hablando) return;
  if (VOZ.stream) for (const t of VOZ.stream.getAudioTracks()) t.enabled = false;
  VOZ.hablando = false;
  redEnviar({t:'voz', on:0});
}
function vozLlamar(id){
  if (!VOZ.stream || !RED.peer || VOZ.llamadas.has(id)) return;
  try{ const c = RED.peer.call(id, VOZ.stream); if (!c) return; VOZ.llamadas.set(id, c); prepararLlamada(id, c); }catch(e){}
}
function vozLlamarATodos(){ for (const id of RED.conns.keys()) vozLlamar(id); for (const id of RED.remotos.keys()) vozLlamar(id); }
function atenderLlamada(c){
  /* llega la voz de un amigo: se contesta con el micro propio si ya se pidió, o sin nada (solo se escucha) */
  try{ c.answer(VOZ.stream || undefined); }catch(e){ return; }
  prepararLlamada(c.peer, c);
}
function prepararLlamada(id, c){
  c.on('stream', st=>{
    let a = VOZ.audios.get(id);
    if (a && a.el){ try{ a.el.pause(); }catch(e){} }
    const el = new Audio(); el.autoplay = true; el.playsInline = true; el.srcObject = st; el.muted = VOZ.silencio;
    const p = el.play(); if (p && p.catch) p.catch(()=>{});
    VOZ.audios.set(id, {el, st});
  });
  const fin = ()=>{ if (VOZ.llamadas.get(id)===c) VOZ.llamadas.delete(id); const a = VOZ.audios.get(id); if (a && a.el){ try{ a.el.pause(); a.el.srcObject = null; }catch(e){} VOZ.audios.delete(id); } };
  c.on('close', fin); c.on('error', fin);
}
function vozCortar(id){
  const c = VOZ.llamadas.get(id); if (c){ try{ c.close(); }catch(e){} VOZ.llamadas.delete(id); }
  const a = VOZ.audios.get(id); if (a && a.el){ try{ a.el.pause(); a.el.srcObject = null; }catch(e){} VOZ.audios.delete(id); }
}
function vozCortarTodo(){ for (const id of [...new Set([...VOZ.llamadas.keys(), ...VOZ.audios.keys()])]) vozCortar(id); vozParar(); }
function vozSilencio(si){
  VOZ.silencio = si; for (const [,a] of VOZ.audios) if (a.el) a.el.muted = si;
  try{ localStorage.setItem('aventura3d.silencio', si ? 'si' : 'no'); }catch(e){}
}
function vozPaso(){
  /* el volumen baja con la distancia (en iPhone el navegador lo ignora; no pasa nada) */
  for (const [id, a] of VOZ.audios){
    const r = RED.remotos.get(id); if (!r || !a.el) continue;
    const d = Math.hypot(r.act.x-P.J.x, r.act.z-P.J.z);
    try{ a.el.volume = clamp(1.05 - d/260, 0.3, 1); }catch(e){}
  }
  for (const [,r] of RED.remotos) if (r.hablando && tick - r.hablaT > 60*20) r.hablando = false;
}
/* el botón 🚀 IR CON…: Tío Juan te lleva de un salto hasta el amigo */
function irCon(id){
  const r = RED.remotos.get(id); if (!r) return;
  const J = P.J;
  if (P.veh){ P.veh.vel = 0; P.veh = null; motorParar(); vozParar(); }
  const a = r.act, ang = Math.random()*6.28;
  J.x = clamp(a.x + Math.cos(ang)*2.5, -LIMITE, LIMITE); J.z = clamp(a.z + Math.sin(ang)*2.5, -LIMITE, LIMITE);
  J.nadando = enAgua(J.x, J.z); J.suelo = !J.nadando; J.vx = J.vz = J.vy = 0;
  J.y = J.nadando ? NIVEL_MAR - 0.35 : altura(J.x, J.z);
  J.ang = Math.atan2(a.x-J.x, a.z-J.z); camYaw = J.ang;
  camPos.set(J.x - Math.sin(J.ang)*7, J.y + 3, J.z - Math.cos(J.ang)*7); camMira.set(J.x, J.y+1.4, J.z);
  P.escena = null; ferDentro = false;
  sfx.despegue(); confeti(J.x, J.y, J.z, 30); chispas(J.x, J.y+1, J.z, '#bfe9ff', 20, 6);
  grande('🦸 ¡TÍO JUAN TE LLEVÓ CON '+r.nombre.toUpperCase()+'!', '#bfe9ff', 110);
  hablar('Eres mi pichunguito'); burbuja('Eres mi pichunguito', 'Tío Juan');
}
const zonasIrCon = ()=>{
  const lista = [...RED.remotos.values()].slice(0, 3), ancho = Math.min(300, W*0.36);
  return lista.map((r, i)=>({x:W-ancho-12, y:238+i*40, w:ancho, h:34, id:r.id, nombre:r.nombre, d:Math.hypot(r.act.x-P.J.x, r.act.z-P.J.z)}));
};
function compartirSala(){
  const url = enlaceSala(), texto = '¡Ven a jugar conmigo a la isla de Fernando! Sala '+RED.sala+': '+url;
  try{ if (navigator.share){ navigator.share({title:'Fernando y Tío Juan: La Gran Aventura', text:texto, url}).catch(()=>{}); return; } }catch(e){}
  copiarEnlace();
}
function copiarEnlace(){
  const url = enlaceSala();
  try{ if (navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(url).then(()=>aviso('📋 Enlace copiado: mándalo por WhatsApp'), ()=>aviso('Enlace: '+url)); return; } }catch(e){}
  aviso('Enlace: '+url);
}

/* ---------------- El juego: estados, cámara, eventos y marcador ---------------- */
let estado = 'menu';          /* menu · juego · pausa · final · amigos */
let P = null;
let camYaw = Math.PI, cortina = 40, mensajeGrande = null, sacudida = 0, ferDentro = false, sacudidaBano = 0;
const burbujas = [];
const camPos = new THREE.Vector3(INICIO.x, 30, INICIO.z+40), camMira = new THREE.Vector3(INICIO.x, 4, INICIO.z);
let bajoF = 0, fovObj = 70, tactil = false, entradaForzada = null, selPausa = 0, estrellaAnim = null, ultimoGuardado = 0, avisoT = 0, avisoTxt = '';
try{ tactil = matchMedia('(pointer: coarse)').matches; }catch(e){}
addEventListener('touchstart', ()=>{ tactil = true; }, {passive:true, once:true});
const URL_VOLVER = '../';
const CAM_CFG = {
  pie:   {d:6.8,  h:3.0, mira:1.4}, nadar: {d:7.5, h:3.6, mira:0.6},
  carro: {d:10.5, h:4.2, mira:1.6}, moto:  {d:8.5, h:3.6, mira:1.4}, barco: {d:14, h:5.8, mira:1.8},
  avion: {d:16,   h:5.5, mira:1.8}, sub:   {d:12,  h:3.8, mira:1.0},
  heli:  {d:14,   h:5.5, mira:2.0}, motoagua: {d:9, h:3.8, mira:1.2}, nave: {d:20, h:7, mira:4.0}, dino: {d:12, h:5.5, mira:3.5}, ptero: {d:13, h:5.2, mira:2.6},
};
scene.fog = new THREE.FogExp2(NOCHE ? 0x0a1128 : 0xc9e4ff, 0.0014);
const NIEBLA = NOCHE ? {aire: new THREE.Color(0x0a1128), agua: new THREE.Color(0x06263f)} : {aire: new THREE.Color(0xc9e4ff), agua: new THREE.Color(0x0b4f8a)};

const CLAVE_PARTIDA = MAPA===2 ? 'aventura3d.partida2' : 'aventura3d.partida';
function cargarGuardado(){ try{ const g = localStorage.getItem(CLAVE_PARTIDA); return g ? JSON.parse(g) : null; }catch(e){ return null; } }
function guardar(){ try{ localStorage.setItem(CLAVE_PARTIDA, JSON.stringify(exportar(P))); }catch(e){} }
function nuevaPartida(guardado){
  P = crearPartida(guardado);
  P.pj = RED.pj;
  camYaw = envolver(P.J.ang + Math.PI) ; camYaw = P.J.ang;
  ferDentro = false;
  for (const id in vehMesh){ const v = P.vehiculos.find(v=>v.id===id); vehMesh[id].position.set(v.x, v.y, v.z); vehMesh[id].rotation.set(0, v.ang, 0); }
  hambMesh.forEach((m, i)=>{ m.visible = !P.comidas.has(HAMBURGUESAS[i].id); });
  arosMesh.forEach((m, i)=>{ m.material.color.copy(P.prog.aros.includes(i) ? lin(0x7dffa0) : lin(0xffd23f)); });
  banderasMesh.forEach((g, i)=>{ g.bandera.material.color.copy(P.prog.banderas.includes(i) ? lin(0xffd23f) : lin(0xe63946)); });
  aroRampa.material.color.copy(P.prog.rampa ? lin(0x7dffa0) : lin(0xffd23f));
  huevosMesh.forEach((m, i)=>{ m.visible = !P.prog.huevos.includes(i); });
  boyasMesh.forEach((m, i)=>{ m.material.color.copy(P.prog.boyas.includes(i) ? lin(0x7dffa0) : lin(0xff7a1a)); });
  arepasMesh.forEach((m, i)=>{ m.visible = !P.comidasArepas.has(AREPAS[i].id); });
  luna.bandera.visible = !!P.prog.luna;
}
P = crearPartida(cargarGuardado());
nuevaPartida(cargarGuardado());
if (RED.pj !== 'fernando') ponerPersonaje(RED.pj);
function burbuja(txt, quien, dur){ burbujas.push({txt, quien: quien||'', t: dur||200, t0: dur||200}); if (burbujas.length > 2) burbujas.shift(); }
function grande(txt, color, dur){ mensajeGrande = {txt, color: color||'#ffe36e', t: dur||90, t0: dur||90}; }
function aviso(txt){ avisoTxt = txt; avisoT = 180; }
function volverAFernandoBros(){ try{ location.href = URL_VOLVER; }catch(e){} }
function empezar(){
  if (RED.pendiente && RED.estado==='off'){ const c = RED.pendiente; RED.pendiente = ''; estado = 'amigos'; redUnirse(c); return; }
  estado = 'juego'; cortina = 30;
  hablar('Eres mi pichunguito'); burbuja('Eres mi pichunguito', 'Tío Juan');
  setTimeout(()=>{ if (estado==='juego'){ const t = fraseDe(RED.pj, 'inicio'); hablar(t, RED.pj); burbuja(t, nombreLocal()); } }, 2500);
}
function procesarTecla(k){
  if (estado==='menu'){
    if (k==='Escape') return;
    if (k==='Enter'||k===' '||k==='ArrowUp'||k==='ArrowDown'||k==='ArrowLeft'||k==='ArrowRight'||k==='Shift'){ if (RED.pendiente) empezar(); else abrirPersonaje('menu'); }
    return;
  }
  if (estado==='personaje'){
    const nc = zonaPersonaje().ncol;
    if (k==='ArrowLeft'||k==='a'||k==='A'){ marcarPj(selPj-1); sfx.toque(); }
    else if (k==='ArrowRight'||k==='d'||k==='D'){ marcarPj(selPj+1); sfx.toque(); }
    else if (k==='ArrowUp'||k==='w'||k==='W'){ marcarPj(selPj-nc); sfx.toque(); }
    else if (k==='ArrowDown'||k==='s'||k==='S'){ marcarPj(selPj+nc); sfx.toque(); }
    else if (k==='Enter'||k===' ') confirmarPj();
    else if (k==='Escape'){ sfx.toque(); if (pjOrigen==='menu') estado = 'menu'; else confirmarPj(); }
    return;
  }
  if (estado==='juego'){
    if ((k==='t'||k==='T') && redActiva() && !P.escena){ const r = [...RED.remotos.values()][0]; if (r){ sfx.toque(); irCon(r.id); } }
    else if (k==='Escape'||k==='p'||k==='P'){ estado = 'pausa'; selPausa = 0; sfx.toque(); }
    else if (k==='m'||k==='M'){ musicaOn = !musicaOn; try{ localStorage.setItem('aventura3d.musica', musicaOn ? 'si' : 'no'); }catch(e){} aviso(musicaOn ? '🎵 Música encendida' : '🔇 Música apagada'); }
    return;
  }
  if (estado==='pausa'){
    if (k==='Escape'||k==='p'||k==='P'){ estado = 'juego'; sfx.toque(); }
    else if (k==='ArrowUp'){ selPausa = (selPausa+4)%5; sfx.toque(); }
    else if (k==='ArrowDown'){ selPausa = (selPausa+1)%5; sfx.toque(); }
    else if (k==='Enter'||k===' ') elegirPausa(selPausa);
    return;
  }
  if (estado==='amigos'){
    if (k==='Escape'){ if (RED.entrandoCodigo){ RED.entrandoCodigo = false; } else if (RED.estado==='error'||RED.estado==='creando'||RED.estado==='uniendo'){ redSalir(); } else estado = 'juego'; sfx.toque(); return; }
    if (RED.entrandoCodigo){
      if (k==='Backspace'){ RED.codigo = RED.codigo.slice(0,-1); sfx.toque(); }
      else if (k==='Enter'){ if (RED.codigo.length===4){ sfx.toque(); redUnirse(RED.codigo); } }
      else if (k.length===1){ const c = normalizarCodigo(k); if (c && RED.codigo.length<4){ RED.codigo += c; sfx.toque(); } }
    } else if (k==='Enter' && (RED.estado==='sala'||RED.estado==='conectado')){ estado = 'juego'; sfx.toque(); }
    return;
  }
  if (estado==='final'){
    if (k==='Enter'||k===' '||k==='Escape'){ estado = 'juego'; sfx.toque(); }
  }
}
function elegirPausa(i){
  sfx.toque();
  if (i===0) estado = 'juego';
  else if (i===1){ estado = 'amigos'; RED.entrandoCodigo = false; RED.error = ''; }
  else if (i===2){ musicaOn = !musicaOn; try{ localStorage.setItem('aventura3d.musica', musicaOn ? 'si' : 'no'); }catch(e){} }
  else if (i===3){ try{ localStorage.removeItem(CLAVE_PARTIDA); }catch(e){} nuevaPartida(null); abrirPersonaje('nuevo'); }
  else if (i===4){ cambiarMapa(); }
  else if (i===5){ redSalir(); volverAFernandoBros(); }
}
const enZona = (mx,my,z,m)=>mx>=z.x-(m||0) && mx<=z.x+z.w+(m||0) && my>=z.y-(m||0) && my<=z.y+z.h+(m||0);
const zonaAtras = ()=>({x:14, y:12, w:190, h:42});
const zonasPausa = ()=>[0,1,2,3,4,5].map(i=>({x:W/2-150, y:H/2+6+i*40, w:300, h:36}));
function cambiarMapa(){ const otro = MAPA===2 ? 1 : 2; sfx.toque(); redSalir(); try{ localStorage.setItem('aventura3d.mapa', String(otro)); }catch(e){} location.href = location.pathname + '?mapa=' + otro; }
/* la pantalla de ¿CON QUIÉN JUEGAS?: sale al pulsar JUGAR y al empezar de cero */
let selPj = 0, pjOrigen = 'menu';
const zonaPersonaje = ()=>{
  const z = {volver: zonaAtras(), pjs: []};
  const n = PERSONAJES_RED.length, ncol = Math.ceil(n/3), w = Math.min(112, (W-40)/ncol - 6), h = 58, x0 = W/2 - (ncol*(w+6)-6)/2, y0 = 96;
  for (let i=0;i<n;i++) z.pjs.push({x: x0 + (i%ncol)*(w+6), y: y0 + Math.floor(i/ncol)*(h+6), w, h});
  z.ncol = ncol; z.jugar = {x:W/2-170, y:H-66, w:340, h:50};
  return z;
};
function abrirPersonaje(origen){
  pjOrigen = origen; selPj = Math.max(0, PERSONAJES_RED.findIndex(p=>p.id===RED.pj)); estado = 'personaje'; sfx.toque();
}
function marcarPj(i){
  selPj = (i + PERSONAJES_RED.length) % PERSONAJES_RED.length;
  const pj = PERSONAJES_RED[selPj].id;
  if (pj !== RED.pj){ RED.pj = pj; ponerPersonaje(pj); try{ localStorage.setItem('aventura3d.pj', pj); }catch(e){} }
}
function confirmarPj(){
  marcarPj(selPj); sfx.estrella();
  if (pjOrigen==='nuevo'){ burbujas.length = 0; estado = 'juego'; cortina = 30; aviso('Aventura nueva: ¡a empezar de cero con '+nombreLocal()+'!'); setTimeout(()=>{ if (estado==='juego'){ const t = fraseDe(RED.pj, 'inicio'); hablar(t, RED.pj); burbuja(t, nombreLocal()); } }, 600); }
  else empezar();
}
/* la pantalla de JUGAR CON AMIGOS */
const zonaAmigos = ()=>{
  const z = {volver: zonaAtras(), guia: {x:W-190, y:12, w:176, h:42}, pjs: [], teclas: [], borrar:null, entrar:null};
  const n = PERSONAJES_RED.length, ncol = Math.ceil(n/2), w = Math.min(96, (W-40)/ncol - 6), x0 = W/2 - (ncol*(w+6)-6)/2;
  for (let i=0;i<n;i++) z.pjs.push({x: x0 + (i%ncol)*(w+6), y: 96 + Math.floor(i/ncol)*60, w, h: 54});
  z.crear = {x:W/2-310, y:H-96, w:300, h:50}; z.unirme = {x:W/2+10, y:H-96, w:300, h:50};
  z.jugar = {x:W/2-150, y:H-64, w:300, h:46}; z.salir = {x:W/2-150, y:H-64, w:300, h:46};
  z.compartir = {x:W/2-250, y:274, w:240, h:44}; z.copiar = {x:W/2+10, y:274, w:240, h:44};
  z.reintentar = {x:W/2-150, y:H-96, w:300, h:46};
  const cols = 8, tw = Math.min(58, (W-60)/cols - 6), tx0 = W/2 - (cols*(tw+6)-6)/2, ty0 = H/2 - 30;
  for (let i=0;i<ALFABETO_SALA.length;i++) z.teclas.push({x: tx0 + (i%cols)*(tw+6), y: ty0 + Math.floor(i/cols)*(tw*0.78+6), w: tw, h: tw*0.78, ch: ALFABETO_SALA[i]});
  z.borrar = {x:W/2-150, y:H-64, w:140, h:46}; z.entrar = {x:W/2+10, y:H-64, w:140, h:46};
  return z;
};
function clic(x, y){
  if (estado==='juego'){
    if (redActiva() && !P.escena) for (const z of zonasIrCon()) if (enZona(x, y, z, 4)){ sfx.toque(); irCon(z.id); return; }
    return;
  }
  if (estado==='menu'){
    if (enZona(x, y, zonaAtras(), 6)) return volverAFernandoBros();
    if (enZona(x, y, {x:W/2-200, y:196, w:400, h:38}, 4)) return cambiarMapa();
    if (enZona(x, y, {x:W-190, y:12, w:176, h:42}, 6)){ sfx.toque(); estado = 'amigos'; RED.entrandoCodigo = false; if (RED.pendiente){ const c = RED.pendiente; RED.pendiente = ''; redUnirse(c); } return; }
    if (RED.pendiente){ sfx.toque(); empezar(); } else abrirPersonaje('menu');
    return;
  }
  if (estado==='personaje'){
    const z = zonaPersonaje();
    if (enZona(x, y, z.volver, 6)){ sfx.toque(); if (pjOrigen==='menu') estado = 'menu'; else confirmarPj(); return; }
    z.pjs.forEach((zp, i)=>{ if (enZona(x, y, zp, 2)){ if (i===selPj) confirmarPj(); else { marcarPj(i); sfx.toque(); } } });
    if (enZona(x, y, z.jugar, 4)) confirmarPj();
    return;
  }
  if (estado==='pausa'){
    let dio = false;
    zonasPausa().forEach((z, i)=>{ if (enZona(x, y, z, 4)){ elegirPausa(i); dio = true; } });
    if (!dio && y < H/2-20) { estado = 'juego'; sfx.toque(); }
    return;
  }
  if (estado==='amigos'){
    const z = zonaAmigos();
    if (enZona(x, y, z.volver, 6)){ sfx.toque(); if (RED.entrandoCodigo) RED.entrandoCodigo = false; else { if (RED.estado==='error'||RED.estado==='creando'||RED.estado==='uniendo') redSalir(); estado = 'juego'; } return; }
    if (enZona(x, y, z.guia, 6)){ try{ window.open('amigos.html', '_blank'); }catch(e){} return; }
    if (RED.entrandoCodigo){
      for (const t of z.teclas) if (enZona(x, y, t, 2) && RED.codigo.length<4){ RED.codigo += t.ch; sfx.toque(); return; }
      if (enZona(x, y, z.borrar, 4)){ RED.codigo = RED.codigo.slice(0,-1); sfx.toque(); return; }
      if (enZona(x, y, z.entrar, 4) && RED.codigo.length===4){ sfx.toque(); redUnirse(RED.codigo); return; }
      return;
    }
    if (RED.estado==='off' || RED.estado==='error'){
      z.pjs.forEach((zp, i)=>{ if (enZona(x, y, zp, 2)){ const pj = PERSONAJES_RED[i].id; if (pj!==RED.pj){ RED.pj = pj; ponerPersonaje(pj); try{ localStorage.setItem('aventura3d.pj', pj); }catch(e){} sfx.toque(); } } });
    }
    if (RED.estado==='off'){
      if (enZona(x, y, z.crear, 4)){ sfx.toque(); redCrear(); return; }
      if (enZona(x, y, z.unirme, 4)){ sfx.toque(); RED.entrandoCodigo = true; RED.codigo = ''; return; }
    } else if (RED.estado==='error'){
      if (enZona(x, y, z.reintentar, 4)){ sfx.toque(); if (RED.anfitrion) redCrear(); else if (RED.sala) redUnirse(RED.sala); else { RED.estado = 'off'; } return; }
    } else if (RED.estado==='sala' || RED.estado==='conectado'){
      if (enZona(x, y, z.jugar, 4)){ sfx.toque(); estado = 'juego'; return; }
      if (RED.estado==='sala'){
        if (enZona(x, y, z.compartir, 4)){ sfx.toque(); compartirSala(); return; }
        if (enZona(x, y, z.copiar, 4)){ sfx.toque(); copiarEnlace(); return; }
      }
      if (enZona(x, y, {x:W-190, y:H-64, w:176, h:46}, 4)){ sfx.toque(); redSalir(); aviso('Saliste de la sala'); return; }
      if (enZona(x, y, {x:14, y:H-64, w:190, h:46}, 4)){ sfx.toque(); vozSilencio(!VOZ.silencio); return; }
    }
    return;
  }
  if (estado==='final'){
    if (enZona(x, y, {x:W/2-150, y:H-90, w:300, h:44}, 6)){ estado = 'juego'; sfx.toque(); }
    else if (enZona(x, y, zonaAtras(), 6)) volverAFernandoBros();
  }
}

/* ---- lo que pasa en el núcleo se convierte en sonido, partículas y frases ---- */
function atenderEventos(){
  const J = P.J;
  for (const e of P.eventos){
    switch (e.tipo){
      case 'hablar': hablar(e.texto, e.pj); burbuja(e.texto, e.quien); if (e.k) redEvento('habla', {k:e.k, id:e.id||'', x:J.x, y:J.y, z:J.z}); break;
      case 'hamburguesa': sfx.hamburguesa(); chispas(e.x, e.y, e.z, '#ffe36e', 16, 5); redEvento('hamburguesa', {x:e.x, y:e.y, z:e.z}); hambMesh[e.id].visible = false; grande('¡HAMBURGUESA! 🍔 '+e.total, '#ffe36e', 60); break;
      case 'pedo': sfx.pedo(e.grande); nubePeo(e.x, e.y, e.z, e.grande); if (!e.tioFran) redEvento('pedo', {x:e.x, y:e.y, z:e.z, grande:!!e.grande}); if (!e.tioFran) grande(e.grande ? '¡PRRRRRT! 💨' : '¡prrt! 💨', '#b8ec6a', 50); else grande('¡QUÉ PEDO, TÍO FRAN! 💨', '#b8ec6a', 80); break;
      case 'ganas': grande('¡QUIERO HACER POPO! 🚽', '#ffb070', 120); break;
      case 'banoEntra': ferDentro = true; sfx.puerta(); banosMesh[e.bano].puertaObj = 1; break;
      case 'banoPuerta': sfx.puerta(); banosMesh[e.bano].puertaObj = e.abre ? 1 : 0; break;
      case 'plop': sfx.plop(); sacudidaBano = 14; break;
      case 'descarga': sfx.descarga(); { const b = BANOS[e.bano]; for (let i=0;i<12;i++) particula(b.x + (azar()-0.5)*2, altura(b.x,b.z)+3.2, b.z + (azar()-0.5)*2, '#8fd3ff', (azar()-0.5)*3, 2+azar()*3, (azar()-0.5)*3, 40, 0.15, {grav:10, alfa:0.8}); } break;
      case 'banoSale': ferDentro = false; sfx.puerta(); redEvento('popo', {x:J.x, y:J.y, z:J.z}); setTimeout(()=>{ banosMesh[e.bano].puertaObj = 0; }, 900); confeti(J.x, J.y, J.z, 20); grande('¡POPO HECHO! 💩 +500', '#ffb070', 100); break;
      case 'estrella': sfx.estrella(); confeti(J.x, J.y, J.z, 60); redEvento('estrella', {id:e.id, x:J.x, y:J.y, z:J.z}); grande('¡ESTRELLA! ⭐ '+e.total+'/'+MISIONES.length, '#ffe36e', 150); estrellaAnim = {t:0}; guardar();
        if (e.id!=='popo' && e.id!=='banos'){ hablar('¡Muy bien, mi pichunguito! ¡Eres un campeón!'); burbuja('¡Muy bien, mi pichunguito! ¡Eres un campeón!', 'Tío Juan'); }
        if (e.id==='avion') arosMesh.forEach(m=>m.material.color.copy(lin(0x7dffa0)));
        break;
      case 'montar': sfx.montar(); motorArrancar(e.id); grande(VEHICULOS_DEF.find(v=>v.id===e.id).emoji+' ¡A MANEJAR!', '#bfe9ff', 70); break;
      case 'bajar': sfx.bajar(); motorParar(); break;
      case 'noBajar': sfx.no(); aviso(e.id==='avion' ? 'Aterriza y frena para bajarte ✈️' : e.id==='sub' ? 'Sube a la superficie (A) para bajarte 🤿' : 'Frena primero para bajarte'); break;
      case 'despegue': sfx.despegue(); grande('¡DESPEGUE! ✈️', '#bfe9ff', 70); break;
      case 'aterriza': sfx.aterriza(); for (let i=0;i<8;i++) particula(J.x+(azar()-0.5)*2, J.y+0.3, J.z+(azar()-0.5)*2, '#d8c8a0', (azar()-0.5)*4, 1+azar()*2, (azar()-0.5)*4, 30, 0.3, {alfa:0.6, crece:1.5}); break;
      case 'rebote': sfx.choque(); sacudida = 10; break;
      case 'estelaAire': particula(e.x, e.y, e.z, '#ffffff', 0, 0.3, 0, 70, 0.5, {alfa:0.5, crece:2.5}); break;
      case 'estela': particula(e.x + (azar()-0.5)*2, NIVEL_MAR+0.1, e.z + (azar()-0.5)*2, '#ffffff', (azar()-0.5)*2, 0.5, (azar()-0.5)*2, 45, 0.35, {alfa:0.7, crece:2}); break;
      case 'polvo': particula(e.x + (azar()-0.5), e.y+0.2, e.z + (azar()-0.5), e.agua ? '#ffffff' : '#d8c8a0', (azar()-0.5)*2, 1+azar(), (azar()-0.5)*2, 30, 0.3, {alfa:0.5, crece:2}); break;
      case 'burbujas': for (let i=0;i<3;i++) particula(e.x + (azar()-0.5)*1.5, e.y + (azar()-0.5), e.z + (azar()-0.5)*1.5, '#cfefff', (azar()-0.5), 1.2+azar()*1.5, (azar()-0.5), 55, 0.12+azar()*0.15, {alfa:0.55, flota:true}); break;
      case 'choque': if (tick - (P.ultimoChoqueV||0) > 20){ P.ultimoChoqueV = tick; sfx.choque(); sacudida = 8; chispas(e.x, J.y+0.8, e.z, '#ffffff', 6, 4); } break;
      case 'chapoteo': sfx.chapoteo(); for (let i=0;i<14;i++) particula(e.x + (azar()-0.5)*2, NIVEL_MAR+0.2, e.z + (azar()-0.5)*2, '#dff4ff', (azar()-0.5)*4, 2+azar()*4, (azar()-0.5)*4, 35, 0.2, {grav:10, alfa:0.85}); break;
      case 'saludo': sfx.saludo(); { const f = porId(e.id); for (let i=0;i<8;i++) particula(f.x + (azar()-0.5)*1.5, altura(f.x,f.z)+2+azar(), f.z + (azar()-0.5)*1.5, '#ff6ec0', (azar()-0.5)*1.5, 1+azar()*1.5, (azar()-0.5)*1.5, 50, 0.2, {alfa:0.9}); if (e.primera) grande('¡HOLA '+f.nombre.toUpperCase()+'! 💗', '#ff9ed6', 80); } break;
      case 'eructo': sfx.eructo(); break;
      case 'popito': sfx.perro(); grande('¡UN POPO BEBÉ TE SIGUE! 💩 '+e.total, '#ffb070', 110); for (let i=0;i<8;i++) particula(J.x + (azar()-0.5)*2, J.y+1.5+azar(), J.z + (azar()-0.5)*2, '#ff6ec0', (azar()-0.5)*1.5, 1+azar()*1.5, (azar()-0.5)*1.5, 50, 0.18, {alfa:0.9}); break;
      case 'perro': sfx.perro(); grande('¡'+PERROS_DEF.find(p=>p.id===e.id).nombre.toUpperCase()+' TE SIGUE! 🐕', '#fff', 80); break;
      case 'bandera': sfx.bandera(); banderasMesh[e.id].bandera.material.color.copy(lin(0xffd23f)); { const b = BANDERAS[e.id]; chispas(b.x, altura(b.x,b.z)+5, b.z, '#ffe36e', 20, 8); } grande('🚩 BANDERA '+e.total+'/'+BANDERAS.length, '#ffe36e', 60); break;
      case 'aro': sfx.aro(); arosMesh[e.id].material.color.copy(lin(0x7dffa0)); { const a = AROS[e.id]; chispas(a.x, a.y, a.z, '#ffe36e', 26, 9); } grande('⭕ ARO '+e.total+'/'+AROS.length, '#ffe36e', 60); break;
      case 'rampa': aroRampa.material.color.copy(lin(0x7dffa0)); chispas(RAMPA.aro.x, RAMPA.aro.y, RAMPA.aro.z, '#ffe36e', 30, 9); grande('¡RAMPA SALTADA! 🏍️', '#ffe36e', 90); break;
      case 'cofre': sfx.cofre(); confeti(COFRE.x, altura(COFRE.x, COFRE.z)+2, COFRE.z, 40); grande('¡EL TESORO! 💎', '#ffe36e', 120); break;
      case 'salto': sfx.salto(); redEvento('salto', {x:J.x, y:J.y, z:J.z}); break;
      case 'rugido': sfx.rugido(); sacudida = 12; grande('¡ROAAAR! 🦖', '#8fd45e', 50); for (let i=0;i<10;i++) particula(e.x + (azar()-0.5)*3, e.y+3.5, e.z + 3 + azar()*2, '#c0ffc0', (azar()-0.5)*4, 1+azar()*2, 6+azar()*6, 30, 0.25, {alfa:0.5, crece:2}); break;
      case 'fuego': for (let i=0;i<3;i++) particula(e.x + (azar()-0.5)*1.2, e.y - 1 - azar(), e.z + (azar()-0.5)*1.2, i ? '#ffa020' : '#ffe36e', (azar()-0.5)*3, -8-azar()*8, (azar()-0.5)*3, 25, 0.5+azar()*0.4, {alfa:0.8, aditivo:true}); break;
      case 'huevo': sfx.hamburguesa(); huevosMesh[e.id].visible = false; chispas(HUEVOS[e.id].x, altura(HUEVOS[e.id].x, HUEVOS[e.id].z)+1, HUEVOS[e.id].z, '#c0ffc0', 16, 5); grande('🥚 HUEVO '+e.total+'/'+HUEVOS.length, '#c0ffc0', 60); break;
      case 'boya': sfx.aro(); boyasMesh[e.id].material.color.copy(lin(0x7dffa0)); chispas(BOYAS[e.id].x, 2, BOYAS[e.id].z, '#ffe36e', 16, 6); grande('🛟 BOYA '+e.total+'/'+BOYAS.length, '#ffe36e', 60); break;
      case 'helipuerto': sfx.bandera(); confeti(J.x, J.y, J.z, 20); grande('🅗 HELIPUERTO '+e.total+'/'+HELIPUERTOS.length, '#bfe9ff', 80); break;
      case 'arepa': sfx.hamburguesa(); chispas(e.x, e.y, e.z, '#fff0c0', 16, 5); { const i = AREPAS.findIndex(a=>a.id===e.id); if (i>=0) arepasMesh[i].visible = false; } grande('¡AREPA! 🫓 '+e.total+'/5', '#fff0c0', 60); redEvento('hamburguesa', {x:e.x, y:e.y, z:e.z}); break;
      case 'maracaibo': sfx.estrella(); confeti(J.x, J.y, J.z, 30); grande('¡BIENVENIDO A MARACAIBO! 🫓', '#7de0ff', 140); break;
      case 'espacio': grande('¡ESTÁS EN EL ESPACIO! 🌌', '#bfe9ff', 100); break;
      case 'lunaLlega': sfx.despegue(); grande(NOCHE ? '¡MARTE! 🔴' : '¡LA LUNA! 🌙', NOCHE ? '#ffa080' : '#fff6a0', 120); break;
      case 'rayo': lanzarRayo(e.x, e.z); sfx.trueno(); break;
      case 'catatumboCuenta': grande('⚡ ¡EL RELÁMPAGO DEL CATATUMBO! '+e.total+'/5', '#dfe8ff', 80); break;
      case 'coro': sfx.estrella(); confeti(J.x, J.y, J.z, 20); grande('¡BIENVENIDO A CORO! 🐐', '#ffd27a', 140); break;
      case 'chivo': sfx.chivo(); chispas(e.x, altura(e.x, e.z)+1, e.z, '#ffe36e', 12, 4); grande('🐐 CHIVO '+e.total+'/'+CHIVOS.length, '#ffe36e', 60); break;
      case 'aroNoche': sfx.aro(); if (NOCHE_VISTA) NOCHE_VISTA.arosNoche[e.id].material.color.copy(lin(0x7dffa0)); { const a = AROS_NOCHE[e.id]; chispas(a.x, a.y, a.z, '#d09aff', 26, 9); } grande('⭕ ARO DE LA NOCHE '+e.total+'/'+AROS_NOCHE.length, '#d09aff', 60); break;
      case 'polarcita': grande('🍺 ¡QUÉ RICA POLARCITA! 🦝', '#ffe36e', 90); break;
      case 'ovniLlega': sfx.despegue(); grande('¡UNA NAVE EXTRATERRESTRE! 🛸', '#9dffb0', 120); break;
      case 'ovniLuz': sfx.ovni(); if (NOCHE_VISTA) NOCHE_VISTA.haz.visible = true; break;
      case 'extraterrestres': sfx.estrella(); confeti(OVNI.x, OVNI.y - 8, OVNI.z, 50); grande('¡EXTRATERRESTRES! 👽👽👽', '#9dffb0', 140); break;
      case 'ovniLista': if (NOCHE_VISTA) NOCHE_VISTA.haz.visible = false; break;
      case 'banderaLuna': sfx.estrella(); luna.bandera.visible = true; confeti(LUNA.x, LUNA.y-LUNA.r-2, LUNA.z, 40); grande(NOCHE ? '🚩 ¡LA BANDERA DE FERNANDO EN MARTE!' : '🚩 ¡LA BANDERA DE FERNANDO EN LA LUNA!', '#ffe36e', 120); break;
      case 'lunaLista': aviso('Suelta A y la nave baja solita a la isla 🚀'); break;
      case 'brinco': sfx.brinco(); break;
      case 'sinGanas': aviso('Come una hamburguesa 🍔 y después ven al baño'); break;
      case 'final': sfx.final(); setTimeout(()=>{ if (estado==='juego'){ estado = 'final'; hablar('Te amo tío Juan, yo soy tu pichunguito'); burbuja('Te amo tío Juan, yo soy tu pichunguito', 'Fernando'); setTimeout(()=>{ hablar('¡Ganaste! ¡Te amo tío Juan!'); }, 3500); } }, 2500); break;
    }
  }
  P.eventos.length = 0;
}

/* ---- los modelos siguen al núcleo ---- */
const tmpV = new THREE.Vector3();
function sincronizar(){
  const J = P.J, t = tick*DT;
  /* Fernando a pie */
  fer.visible = !P.veh && !ferDentro;
  fer.position.set(J.x, J.y, J.z); fer.rotation.y = J.ang;
  const apretado = P.ganas && !J.nadando;
  animarModelo(fer, J.mov*(apretado ? 1.8 : 1), J.fase*(apretado ? 1.6 : 1), !J.suelo && !J.nadando, J.nadando);
  fer.rotation.x = J.nadando ? (fer.tipo==='persona' ? 1.2 : 0.3) : 0;
  if (fer.tipo==='persona'){
    if (apretado){ fer.partes.pI.rotation.z = 0.25; fer.partes.pD.rotation.z = -0.25; fer.partes.bI.rotation.x = -1.2; fer.partes.bD.rotation.x = -1.2; fer.rotation.z = Math.sin(J.fase*1.6)*0.08; }
    else { fer.partes.pI.rotation.z = 0; fer.partes.pD.rotation.z = 0; fer.rotation.z = 0; }
  } else fer.rotation.z = apretado ? Math.sin(J.fase*1.6)*0.08 : 0;
  /* los vehículos */
  for (const v of P.vehiculos){
    const m = vehMesh[v.id], R = m.partes;
    m.position.set(v.x, v.y, v.z);
    let cab = -v.cabeceo, rol = 0;
    if (v.id==='barco'){ cab = (ola(v.x + Math.sin(v.ang)*2, v.z + Math.cos(v.ang)*2, t) - ola(v.x - Math.sin(v.ang)*2, v.z - Math.cos(v.ang)*2, t))*-0.25 - v.vel*0.004; rol = v.giro*0.12 + (ola(v.x + Math.cos(v.ang)*1.5, v.z - Math.sin(v.ang)*1.5, t) - ola(v.x - Math.cos(v.ang)*1.5, v.z + Math.sin(v.ang)*1.5, t))*0.3; }
    else if (v.id==='avion') rol = v.aire ? v.giro*0.7 : v.giro*0.05;
    else if (v.id==='moto') rol = v.giro*0.45*Math.min(1, Math.abs(v.vel)/8);
    else if (v.id==='carro') rol = v.giro*0.06*Math.min(1, Math.abs(v.vel)/8);
    else if (v.id==='sub') rol = v.giro*0.15;
    m.rotation.set(cab, v.ang, rol, 'YXZ');
    for (const w of R.ruedas){ w.giro.rotation.x += v.vel*DT/w.r; if (w.delante) w.dir.rotation.y = v.giro*0.45; }
    animarVehiculo(R, v.id, P.veh===v, v.vel, !!v.aire, v.y > 260, t);
    if (R.bandera) ondearBandera(R.bandera, t);
    R.sombra.visible = v.id!=='sub';
    if (R.sombra.visible){ const g = altura(v.x, v.z); const alt = clamp(v.y - Math.max(g, NIVEL_MAR), 0, 40); R.sombra.position.y = -alt + 0.05 - (v.y - Math.max(g, NIVEL_MAR)) + alt; R.sombra.position.y = -(v.y - Math.max(g, NIVEL_MAR)) + 0.06; R.sombra.material.opacity = 0.18*(1-alt/40); }
    { const dv = Math.hypot(v.x-J.x, v.z-J.z); m.etiqueta.visible = P.veh!==v && dv < 70 && dv > 5; }
  }
  /* Fernando sentado dentro del vehículo */
  if (P.veh){
    const m = vehMesh[P.veh.id], R = m.partes;
    if (ferSentado.parent !== m){ if (ferSentado.parent) ferSentado.parent.remove(ferSentado); m.add(ferSentado); }
    ferSentado.visible = true;
    ferSentado.position.set(R.asiento.x, R.asiento.y, R.asiento.z); ferSentado.scale.setScalar(ferSentado.esc*R.asiento.esc);
    ferSentado.rotation.set(0,0,0);
    animarModelo(ferSentado, 0, 0, false, false, !R.asiento.parado);
    if (R.asiento.parado && ferSentado.tipo==='persona'){ ferSentado.partes.bI.rotation.x = -1.3; ferSentado.partes.bD.rotation.x = -1.3; }
  } else ferSentado.visible = false;
  /* los perritos */
  P.perros.forEach(p=>{
    const m = perrosMesh[p.id];
    m.visible = !p.dentro;
    m.position.set(p.x, p.y, p.z); m.rotation.y = p.ang;
    animarPerro(m, p.sigue ? p.mov : 0, p.fase);
    if (!p.sigue) m.position.y += Math.abs(Math.sin(p.fase*2))*0.15;
    m.etiqueta.visible = !p.sigue;
  });
  /* los popos bebés brincan detrás */
  while (popitosMesh.length < P.popitos.length){ const m = armarPopito(); scene.add(m); popitosMesh.push(m); }
  popitosMesh.forEach((m, i)=>{
    const p = P.popitos[i];
    if (!p || p.dentro){ m.visible = false; return; }
    m.visible = true;
    const brinco = Math.abs(Math.sin(p.fase))*0.35*Math.min(1, p.mov/2.5);
    m.position.set(p.x, p.y + brinco, p.z); m.rotation.y = p.ang;
    m.scale.set(1 - brinco*0.25, 1 + brinco*0.35 + Math.sin(p.fase*0.7)*0.03, 1 - brinco*0.25);
  });
  /* Tío Juan vuela al lado de Fernando */
  {
    const ang = J.ang, lado = P.veh ? (P.veh.id==='avion' ? 7 : 4.2) : 2.4, atras = P.veh ? 2 : 1.4, alto = (P.veh ? 3.2 : 2.6) + Math.sin(t*2.1)*0.25;
    const ox = J.x + Math.cos(ang)*lado - Math.sin(ang)*atras, oz = J.z - Math.sin(ang)*lado - Math.cos(ang)*atras;
    let oy = J.y + alto;
    const g = altura(ox, oz); if (oy < g + 1.5) oy = g + 1.5;
    tmpV.set(ox, oy, oz);
    tioJuan.position.lerp(tmpV, P.veh ? 0.12 : 0.08);
    const vel = Math.hypot(tmpV.x - tioJuan.position.x, tmpV.z - tioJuan.position.z);
    tioJuan.rotation.set(0.9 + Math.min(0.4, vel*0.02), ang, 0, 'YXZ');
    tioJuan.partes.pI.rotation.x = 0.2 + Math.sin(t*3)*0.1; tioJuan.partes.pD.rotation.x = 0.2 - Math.sin(t*3)*0.1;
    tioJuan.visible = RED.pj !== 'tiojuan';
    ondearCapa(tioJuan.partes.capa, t, 0.6 + Math.min(1, vel));
  }
  /* la familia mira a Fernando cuando se acerca */
  for (const f of FAMILIA){
    const m = familiaMesh[f.id];
    const d = Math.hypot(f.x-J.x, f.z-J.z);
    if (d > 120) continue;
    const obj = d < 12 ? Math.atan2(J.x-f.x, J.z-f.z) : f.ang;
    m.rotation.y = envolver(m.rotation.y + envolver(obj - m.rotation.y)*0.08);
    m.fase += DT*2;
    const sal = P.saludos[f.id+'T'] && P.t - P.saludos[f.id+'T'] < 90;
    animarPersona(m, sal ? 5 : 0, sal ? m.fase*6 : m.fase, false, false);
    if (sal){ m.partes.bD.rotation.x = -2.6 + Math.sin(m.fase*8)*0.4; m.position.y = altura(f.x, f.z) + Math.abs(Math.sin(m.fase*6))*0.35; } else m.position.y = altura(f.x, f.z);
    m.etiqueta.visible = d < 40 && d > 4;
  }
  /* el Señor Popo */
  {
    const s = posSrPopo(P);
    tmpV.set(s.x, altura(s.x, s.z), s.z);
    if (srPopo.position.distanceTo(tmpV) > 30) srPopo.position.copy(tmpV); else srPopo.position.lerp(tmpV, 0.2);
    srPopo.rotation.y = envolver(srPopo.rotation.y + envolver(Math.atan2(J.x-srPopo.position.x, J.z-srPopo.position.z) - srPopo.rotation.y)*0.06);
    srPopo.fase += DT*(P.escena ? 9 : 3);
    const brinco = P.escena ? Math.abs(Math.sin(srPopo.fase))*0.8 : 0;
    srPopo.position.y += brinco;
    srPopo.scale.set(0.95*(1 - brinco*0.1), 0.95*(1 + Math.sin(srPopo.fase)*0.05 + brinco*0.15), 0.95*(1 - brinco*0.1));
    srPopo.partes.bD.rotation.z = 0.5 + (P.escena || Math.hypot(J.x-srPopo.position.x, J.z-srPopo.position.z) < 8 ? 1.6 + Math.sin(srPopo.fase*4)*0.5 : 0);
    srPopo.visible = P.srPopo.visible;
  }
  /* las puertas de los baños */
  banosMesh.forEach((g, i)=>{
    g.puerta.rotation.y = lerp(g.puerta.rotation.y, -1.75*(g.puertaObj||0), 0.12);
    const b = BANOS[i];
    if (sacudidaBano > 0 && P.escena && P.escena.bano===i){ g.position.set(b.x + (azar()-0.5)*0.12, altura(b.x,b.z), b.z + (azar()-0.5)*0.12); g.rotation.z = (azar()-0.5)*0.04; }
    else { g.position.set(b.x, altura(b.x,b.z), b.z); g.rotation.z = 0; }
  });
  if (sacudidaBano > 0) sacudidaBano--;
  /* hamburguesas girando, aros, cofre, letreros */
  hambMesh.forEach((m, i)=>{ if (!m.visible) return; if (Math.abs(m.position.x-J.x) > 160 || Math.abs(m.position.z-J.z) > 160) return; m.rotation.y = t*1.6; m.position.y = HAMBURGUESAS[i].y + Math.sin(t*2.4 + i)*0.18; });
  arosMesh.forEach((m, i)=>{ m.rotation.z = t*0.5 + i; m.rotation.y = Math.atan2(J.x-m.position.x, J.z-m.position.z)*0 ; });
  aroRampa.rotation.z = t*0.8;
  boyasMesh.forEach((m, i)=>{ m.position.y = NIVEL_MAR + ola(BOYAS[i].x, BOYAS[i].z, t); m.rotation.z = Math.sin(t*1.3+i)*0.12; m.rotation.x = Math.cos(t*1.1+i)*0.12; });
  arepasMesh.forEach((m, i)=>{ if (!m.visible) return; if (Math.abs(m.position.x-J.x) > 160 || Math.abs(m.position.z-J.z) > 160) return; m.rotation.y = t*1.6; m.position.y = AREPAS[i].y + Math.sin(t*2.4 + i)*0.18; });
  luna.rotation.y = t*0.02;
  if (luna.bandera.visible) ondearBandera(luna.tela, t);
  if (NOCHE_VISTA){
    P.chivos.forEach((c, i)=>{ const g = NOCHE_VISTA.chivos[i]; g.position.set(c.x, altura(c.x, c.z) + (c.saltoT > 0 ? Math.abs(Math.sin(t*14))*0.5 : 0), c.z); g.rotation.y = c.ang; });
    const o = NOCHE_VISTA.ovni; o.rotation.y += 0.004; o.position.y = OVNI.y + Math.sin(t*0.9)*2;
    NOCHE_VISTA.luces.forEach((l, i)=>{ l.visible = Math.floor(t*4 + i) % 3 !== 0; });
    const fiesta = P.escena && P.escena.tipo==='ovni';
    NOCHE_VISTA.extraterrestres.forEach((e, i)=>{ e.position.y = 1.2 + (fiesta ? Math.abs(Math.sin(t*6 + i))*0.8 : 0); e.brazos[0].rotation.z = fiesta ? 2.4 + Math.sin(t*9 + i)*0.5 : 0.2; e.brazos[1].rotation.z = fiesta ? -2.4 - Math.sin(t*9 + i)*0.5 : -0.2; });
    for (let i=NOCHE_VISTA.rayos.length-1;i>=0;i--){ const r = NOCHE_VISTA.rayos[i]; if (--r.t <= 0){ scene.remove(r.m); NOCHE_VISTA.rayos.splice(i, 1); } else if (r.m.material.opacity !== undefined) r.m.material.opacity = r.t/10*0.8; }
  }
  cofre.haz.material.opacity = 0.12 + Math.sin(t*2)*0.05; cofre.rotation.y = 0.6 + Math.sin(t*0.5)*0.1;
  for (const l of letreros) l.giro.rotation.y = t*0.6;
  /* la estrella que sube cuando se gana una */
  if (estrellaAnim){
    if (!estrellaAnim.m){ estrellaAnim.m = new THREE.Mesh(geoEstrella, matEstrella); estrellaAnim.m.scale.setScalar(1.6); scene.add(estrellaAnim.m); }
    estrellaAnim.t++;
    const k = estrellaAnim.t/150;
    estrellaAnim.m.position.set(J.x, J.y + 3.2 + k*4, J.z); estrellaAnim.m.rotation.y = estrellaAnim.t*0.08; estrellaAnim.m.scale.setScalar(1.1*(1 + Math.sin(k*Math.PI)*0.4));
    if (estrellaAnim.t % 6 === 0) chispas(estrellaAnim.m.position.x, estrellaAnim.m.position.y, estrellaAnim.m.position.z, '#ffe36e', 3, 3);
    if (estrellaAnim.t > 150){ scene.remove(estrellaAnim.m); estrellaAnim = null; }
  }
}
/* lo que gira y se mueve en cada vehículo: hélices, rotores, patas, fuego */
function animarVehiculo(R, id, montado, vel, aire, alto, t){
  if (id==='heli'){ R.helice.rotation.y += montado ? 0.55 : 0.03; R.cola.rotation.x += montado ? 0.7 : 0.03; }
  else if (id==='ptero'){ const amp = aire ? 0.7 : 0.08, w = Math.sin(t*(aire ? 7 : 1.5))*amp; R.alas[0].rotation.z = w; R.alas[1].rotation.z = -w; }
  else if (id==='nave'){ if (R.fuego){ R.fuego.visible = montado && aire; R.fuego.scale.set(1 + Math.sin(t*40)*0.15, 1 + Math.sin(t*33)*0.25, 1 + Math.cos(t*40)*0.15); } }
  else if (id==='dino'){ const amp = Math.min(1, Math.abs(vel)/4), s = Math.sin(t*9); R.patas[0].rotation.x = s*0.7*amp; R.patas[1].rotation.x = -s*0.7*amp; R.cuerpo.position.y = Math.abs(Math.cos(t*9))*0.18*amp; }
  else if (R.helice) R.helice.rotation.z += (montado ? 0.3 + Math.abs(vel)*0.03 : 0.02);
}
function ondearBandera(b, t){
  const pos = b.geometry.attributes.position;
  for (let i=0;i<pos.count;i++){ const x = pos.getX(i); const k = -x; pos.setZ(i, Math.sin(t*8 + k*6)*0.08*k); }
  pos.needsUpdate = true;
}

/* ---- la cámara: detrás de Fernando o de su vehículo, suavecita ---- */
function camaraJuego(){
  const J = P.J, v = P.veh;
  let objYaw = camYaw;
  if (v) objYaw = v.ang; else if (J.mov > 0.6) objYaw = J.ang;
  camYaw = envolver(camYaw + envolver(objYaw - camYaw)*(v ? 0.07 : 0.035));
  const cfg = v ? CAM_CFG[v.id] : (J.nadando ? CAM_CFG.nadar : CAM_CFG.pie);
  let dist = cfg.d, alt = cfg.h;
  if (v && v.id==='avion' && v.aire){ alt = cfg.h - v.cabeceo*7; dist = cfg.d + Math.abs(v.cabeceo)*3; }
  if (v) dist += Math.abs(v.vel)*0.08;
  const fx = Math.sin(camYaw), fz = Math.cos(camYaw);
  let ox = J.x - fx*dist, oy = J.y + alt, oz = J.z - fz*dist;
  const g = altura(ox, oz) + 1.3;
  if (oy < g) oy = g;
  if (v && v.id==='sub' && v.y < NIVEL_MAR - 1.5) oy = Math.min(oy, NIVEL_MAR - 0.8);
  else if (!v && J.nadando) oy = Math.max(oy, NIVEL_MAR + 1.6);
  let miraY = J.y + cfg.mira;
  if (P.escena && P.escena.tipo==='ovni'){
    const a = Math.PI*0.3 + P.escena.t*0.005;
    ox = J.x + Math.sin(a)*40; oz = J.z + Math.cos(a)*40; oy = J.y + 24; miraY = J.y + 16;
  } else if (P.escena && P.escena.tipo==='luna'){
    /* en la luna la cámara da una vuelta lenta por debajo de la nave, mirando la bandera */
    const a = Math.PI*0.9 + P.escena.t*0.004;
    ox = J.x + Math.sin(a)*22; oz = J.z + Math.cos(a)*22; oy = J.y - 9; miraY = J.y + 4;
  } else if (v && v.id==='nave'){
    /* la luna es maciza también para la cámara */
    const dl = Math.hypot(ox-LUNA.x, oy-LUNA.y, oz-LUNA.z);
    if (dl < LUNA.r + 4){ const k = (LUNA.r + 4)/Math.max(dl, 0.01); ox = LUNA.x + (ox-LUNA.x)*k; oy = LUNA.y + (oy-LUNA.y)*k; oz = LUNA.z + (oz-LUNA.z)*k; }
  }
  tmpV.set(ox, oy, oz);
  camPos.lerp(tmpV, v ? 0.12 : 0.1);
  const adelante = v && !P.escena ? clamp(v.vel*0.12, -3, 5) : 0;
  tmpV.set(J.x + Math.sin(J.ang)*adelante, miraY, J.z + Math.cos(J.ang)*adelante);
  camMira.lerp(tmpV, 0.16);
  camera.position.copy(camPos);
  if (sacudida > 0){ sacudida--; camera.position.x += (azar()-0.5)*0.4; camera.position.y += (azar()-0.5)*0.4; }
  camera.lookAt(camMira);
  fovObj = 70 + (v ? Math.min(14, Math.abs(v.vel)*0.3) : 0) + (v && v.turbo > 0.5 ? 6 : 0);
  camera.fov += (fovObj - camera.fov)*0.05; camera.updateProjectionMatrix();
}
function camaraMenu(){
  const t = tick*DT*0.12;
  const cx = PUEBLO.x + Math.cos(t)*70, cz = PUEBLO.z + Math.sin(t)*70;
  tmpV.set(cx, Math.max(altura(cx, cz)+6, 26), cz);
  camPos.lerp(tmpV, 0.05);
  tmpV.set(FUENTE.x, 6, FUENTE.z); camMira.lerp(tmpV, 0.05);
  camera.position.copy(camPos); camera.lookAt(camMira);
  camera.fov += (62 - camera.fov)*0.05; camera.updateProjectionMatrix();
}
/* el aire y el agua: niebla, cielo y luz cambian cuando la cámara se hunde */
function ambiente(){
  const bajo = camera.position.y < NIVEL_MAR + ola(camera.position.x, camera.position.z, tick*DT);
  bajoF += ((bajo ? 1 : 0) - bajoF)*0.15;
  const esp = clamp((camera.position.y - 220)/260, 0, 1);            /* de 220 a 480 m el cielo se vuelve espacio */
  scene.fog.color.copy(NIEBLA.aire).lerp(NIEBLA.agua, bajoF);
  scene.fog.density = lerp(0.0014, 0.011, bajoF)*(1-esp);
  cupula.material.uniforms.arriba.value.copy(CIELO.arriba).lerp(CIELO.arribaAgua, bajoF).lerp(new THREE.Color(0x02030a), esp);
  cupula.material.uniforms.horizonte.value.copy(CIELO.horizonte).lerp(CIELO.horizonteAgua, bajoF).lerp(new THREE.Color(0x0a1030), esp);
  estrellasCielo.material.opacity = NOCHE ? Math.max(esp, 0.9) : esp; estrellasCielo.position.copy(camera.position);
  luna.tela.geometry.attributes.position.needsUpdate = false;
  agua.material.uniforms.bajo.value = bajo ? 1 : 0;
  agua.material.uniforms.t.value = tick*DT;
  sol.visible = bajoF < 0.5;
  if (NOCHE){
    rayoLuz *= 0.82; flashT = Math.max(0, flashT - 1);
    luzSol.intensity = lerp(0.32, 0.22, bajoF) + rayoLuz*0.9;
    luzCielo.intensity = lerp(0.3, 0.28, bajoF) + rayoLuz*0.5;
    luzCielo.color.copy(lin(0x2a3a6a)).lerp(lin(0x0b3a5a), bajoF);
    luzAmb.intensity = lerp(0.16, 0.26, bajoF) + rayoLuz*1.2;
    sol.position.set(camera.position.x - 500, camera.position.y + 700, camera.position.z - 300);
  } else {
    luzSol.intensity = lerp(1.05, 0.5, bajoF);
    luzCielo.intensity = lerp(0.6, 0.45, bajoF);
    luzCielo.color.copy(lin(0xcfe9ff)).lerp(lin(0x2a7ab0), bajoF);
    luzAmb.intensity = lerp(0.1, 0.3, bajoF);
    sol.position.set(camera.position.x + 600, camera.position.y + 800, camera.position.z + 470);
  }
  cupula.position.copy(camera.position);
  enfocarLuz(P.J.x, P.J.y, P.J.z);
}

/* ---- un paso del juego ---- */
function actualizar(){
  tick++;
  leerMandos();
  if (estado==='juego'){
    const ent = entradaForzada ? Object.assign({}, entradaForzada) : leerEntrada(); ent.camYaw = camYaw;
    pasoPartida(P, ent);
    atenderEventos();
    if (P.veh) motorAjustar(P.veh.vel, P.veh.turbo); else motorParar();
    if (tick - ultimoGuardado > 600){ ultimoGuardado = tick; guardar(); }
  } else motorParar();
  if (estado==='juego' || estado==='pausa' || estado==='amigos'){ redPaso(); vozPaso(); }
  sincronizar(); sincronizarRemotos();
  pasoNubes(); pasoGaviotas(); pasoPeces(); pasoAlgas(); pasoParticulas();
  if (estado==='menu' || (estado==='personaje' && pjOrigen==='menu')) camaraMenu(); else camaraJuego();
  if (RED.estado==='conectado' && (estado==='menu' || estado==='personaje')) estado = 'juego';
  ambiente();
  if (cortina > 0) cortina--;
  if (mensajeGrande && --mensajeGrande.t <= 0) mensajeGrande = null;
  for (let i=burbujas.length-1;i>=0;i--) if (--burbujas[i].t <= 0) burbujas.splice(i,1);
  if (avisoT > 0) avisoT--;
  if (MANDO.avisoT > 0) MANDO.avisoT--;
  const tema = estado==='menu' || estado==='personaje' ? TEMA_MENU : (bajoF > 0.5 ? TEMA_MAR : (P.veh && (P.veh.id==='avion' || P.veh.id==='heli' || P.veh.id==='nave') && P.veh.aire ? TEMA_CIELO : TEMA_ISLA));
  programarMusica(tema);
}

/* ---------------- El marcador en 2D ---------------- */
const TIT = "'Luckiest Guy','Fredoka','Arial Black','Impact',sans-serif";
const TXT = "'Fredoka','Nunito','Trebuchet MS','Arial Rounded MT Bold',sans-serif";
function texto(t, x, y, tam, color, alin, titular){
  ctx.font = (titular ? '' : 'bold ')+tam+'px '+(titular ? TIT : TXT);
  ctx.textAlign = alin||'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = color||'#fff'; ctx.fillText(t, x, y);
}
function textoBorde(t, x, y, tam, color, alin, titular){
  ctx.font = (titular ? '' : 'bold ')+tam+'px '+(titular ? TIT : TXT);
  ctx.textAlign = alin||'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(3, tam*0.16); ctx.strokeStyle = 'rgba(20,20,40,0.85)'; ctx.strokeText(t, x, y);
  ctx.fillStyle = color||'#fff'; ctx.fillText(t, x, y);
}
function titulo(t, x, y, tam, c1, c2, alin){
  ctx.font = tam+'px '+TIT; ctx.textAlign = alin||'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round'; ctx.lineWidth = tam*0.2; ctx.strokeStyle = '#2a1a0a'; ctx.strokeText(t, x, y+3);
  const g = ctx.createLinearGradient(0, y-tam/2, 0, y+tam/2); g.addColorStop(0, c1||'#fff6a0'); g.addColorStop(1, c2||'#ffb000');
  ctx.fillStyle = g; ctx.fillText(t, x, y);
}
/* un título que se encoge hasta caber en un ancho */
function tituloAjustado(t, x, y, tam, anchoMax, c1, c2){
  ctx.font = tam+'px '+TIT;
  while (ctx.measureText(t).width > anchoMax && tam > 14){ tam -= 2; ctx.font = tam+'px '+TIT; }
  titulo(t, x, y, tam, c1, c2); return tam;
}
function textoAjustado(t, x, y, tam, anchoMax, color, alin, borde){
  ctx.font = 'bold '+tam+'px '+TXT;
  while (ctx.measureText(t).width > anchoMax && tam > 9){ tam -= 1; ctx.font = 'bold '+tam+'px '+TXT; }
  if (borde) textoBorde(t, x, y, tam, color, alin); else texto(t, x, y, tam, color, alin);
  return tam;
}
/* una cápsula del ancho justo del texto, centrada en x */
function pastilla(t, x, y, tam, color, alfa, anchoMax){
  ctx.font = 'bold '+tam+'px '+TXT;
  while (ctx.measureText(t).width > (anchoMax||W-40)-36 && tam > 9){ tam -= 1; ctx.font = 'bold '+tam+'px '+TXT; }
  const w = ctx.measureText(t).width + 36, h = tam*2;
  cristal(x-w/2, y-h/2, w, h, h/2, alfa===undefined ? 0.6 : alfa);
  texto(t, x, y+1, tam, color||'#fff');
  return h;
}
function cristal(x,y,w,h,r,alfa){
  ctx.fillStyle = 'rgba(15,20,45,'+(alfa===undefined?0.5:alfa)+')';
  ctx.beginPath(); ctx.roundRect(x,y,w,h,r||12); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1.5; ctx.stroke();
}
function boton(x,y,w,h,txt,c1,c2,tam,brilla){
  const g = ctx.createLinearGradient(0,y,0,y+h); g.addColorStop(0,c1); g.addColorStop(1,c2);
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x,y,w,h,h/2); ctx.fill();
  ctx.lineWidth = brilla ? 4 : 2; ctx.strokeStyle = brilla ? '#fff6a0' : 'rgba(255,255,255,0.6)'; ctx.stroke();
  textoBorde(txt, x+w/2, y+h/2+1, tam||20, '#fff', 'center', true);
}
function vineta(f){
  const g = ctx.createRadialGradient(W/2, H/2, H*0.45, W/2, H/2, H*0.95);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,'+f+')');
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
}
function botonAtras(txt){ const z = zonaAtras(); boton(z.x, z.y, z.w, z.h, txt, '#4a6ad0', '#2a3a90', 17); }
/* el mapita: la isla pintada una vez, y encima Fernando, los baños y los vehículos */
const mapaImg = (()=>{
  const c = document.createElement('canvas'); c.width = c.height = 200;
  const x = c.getContext('2d'), im = x.createImageData(200, 200), d = im.data;
  for (let j=0;j<200;j++) for (let i=0;i<200;i++){
    const h = alturaMalla((i/200-0.5)*1240, (j/200-0.5)*1240);
    let r,g,b;
    if (h < -0.4){ const k = clamp(-h/30, 0, 1); r = 40*(1-k)+10*k; g = 150*(1-k)+60*k; b = 220*(1-k)+140*k; }
    else if (h < 1.8){ r = 240; g = 222; b = 160; }
    else if (h > 50){ r = 245; g = 245; b = 250; }
    else { const k = clamp((h-2)/40, 0, 1); r = 110*(1-k)+70*k; g = 200*(1-k)+120*k; b = 70*(1-k)+60*k; }
    const o = (j*200+i)*4; d[o]=r; d[o+1]=g; d[o+2]=b; d[o+3]=255;
  }
  x.putImageData(im, 0, 0);
  x.strokeStyle = 'rgba(60,60,80,0.9)'; x.lineWidth = 1.6; x.beginPath();
  RUTA.M.forEach((m, i)=>{ const px = (m.x/1240+0.5)*200, pz = (m.z/1240+0.5)*200; if (i===0) x.moveTo(px, pz); else x.lineTo(px, pz); }); x.closePath(); x.stroke();
  x.strokeStyle = 'rgba(200,200,210,0.9)'; x.lineWidth = 2.5; x.beginPath(); x.moveTo((PISTA.x/1240+0.5)*200, (PISTA.z0/1240+0.5)*200); x.lineTo((PISTA.x/1240+0.5)*200, (PISTA.z1/1240+0.5)*200); x.stroke();
  x.strokeStyle = 'rgba(90,90,110,0.95)'; x.lineWidth = 2; x.beginPath(); x.moveTo((PUENTE.x0/1240+0.5)*200, (PUENTE.z0/1240+0.5)*200); x.lineTo((PUENTE.x1/1240+0.5)*200, (PUENTE.z1/1240+0.5)*200); x.stroke();
  return c;
})();
function dibujarMapa(cx, cy, r){
  const J = P.J, esc_ = (r*2)/1240;
  const aM = (x, z)=>({x: cx + x*esc_, y: cy + z*esc_});
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.clip();
  ctx.drawImage(mapaImg, cx-r, cy-r, r*2, r*2);
  const obj = objetivo(P);
  for (const b of BANOS){ const p = aM(b.x, b.z); ctx.fillStyle = P.prog.banos.includes(b.id) ? '#7dffa0' : '#8fd3ff'; ctx.fillRect(p.x-2.5, p.y-2.5, 5, 5); }
  for (const v of P.vehiculos){ if (P.veh===v) continue; const p = aM(v.x, v.z); ctx.font = '9px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(v.emoji, p.x, p.y); }
  if (obj.x !== null && obj.x !== undefined){ const p = aM(obj.x, obj.z); ctx.strokeStyle = '#ffe36e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 4 + Math.sin(tick*0.15)*2, 0, Math.PI*2); ctx.stroke(); }
  if (NOCHE){ const q = aM(CORO.x, CORO.z); ctx.font = '10px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('🐐', q.x, q.y); }
  for (const [, r] of RED.remotos){ const q = aM(r.act.x, r.act.z); ctx.fillStyle = '#4fc3f7'; ctx.beginPath(); ctx.arc(q.x, q.y, 3.5, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke(); }
  const p = aM(J.x, J.z);
  ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + Math.sin(J.ang)*8, p.y + Math.cos(J.ang)*8); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
}
function flecha(x, y, ang, tam, color){
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = color; ctx.strokeStyle = 'rgba(20,20,40,0.8)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, -tam); ctx.lineTo(tam*0.7, tam*0.6); ctx.lineTo(0, tam*0.2); ctx.lineTo(-tam*0.7, tam*0.6); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function dibujarPalancaYBotones(){
  if (!tactil || MANDO.activo) return;
  const p = TOQUE.palanca;
  const base = p ? {x:p.x0, y:p.y0} : {x: 90, y: H-90};
  ctx.globalAlpha = p ? 0.9 : 0.45;
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.arc(base.x, base.y, 52, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2; ctx.stroke();
  const j = palancaTactil(); const kx = base.x + j.jx*36, ky = base.y - j.jy*36;
  ctx.fillStyle = 'rgba(255,255,255,0.65)'; ctx.beginPath(); ctx.arc(kx, ky, 22, 0, Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;
  const activos = new Set([...TOQUE.botones.values()].map(b=>b.id));
  for (const b of BOTONES_TACTILES){
    if (b.solo==='veh' && !P.veh) continue;
    if (b.solo==='red' && !redActiva()) continue;
    const pos = b.pos(), on = activos.has(b.id);
    ctx.fillStyle = b.color; ctx.beginPath(); ctx.arc(pos.x, pos.y, b.r*(on ? 1.1 : 1), 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = b.borde; ctx.lineWidth = 2.5; ctx.stroke();
    textoBorde(b.txt, pos.x, pos.y+1, b.r*0.9, '#fff', 'center', b.id==='A'||b.id==='B');
    if (b.id==='voz'){ if (VOZ.hablando){ ctx.strokeStyle = '#7dffa0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(pos.x, pos.y, b.r+6+Math.sin(tick*0.3)*2, 0, Math.PI*2); ctx.stroke(); } texto(VOZ.permiso==='negado' ? 'sin micro' : 'mantén', pos.x, pos.y+b.r+12, 11, '#fff'); }
  }
}
function dibujarMenu(){
  vineta(0.35);
  const g = ctx.createLinearGradient(0, 0, 0, 150); g.addColorStop(0, 'rgba(10,20,60,0.7)'); g.addColorStop(1, 'rgba(10,20,60,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 150);
  /* fila de arriba: los dos botones; debajo, el título a todo lo ancho */
  botonAtras('◀ FERNANDO BROS');
  boton(W-190, 12, 176, 42, '👥 CON AMIGOS', '#2a8ad0', '#1a4a90', 16, !!RED.pendiente);
  tituloAjustado('FERNANDO Y TÍO JUAN', W/2, 112 + Math.sin(tick*0.04)*3, 64, W-60, '#fff6a0', '#ffb000');
  tituloAjustado(NOCHE ? 'MARACAIBO DE NOCHE' : 'LA GRAN AVENTURA', W/2, 166, 42, W-120, NOCHE ? '#d0b0ff' : '#bfe9ff', NOCHE ? '#6a2aa0' : '#2a8ad0');
  boton(W/2-200, 196, 400, 38, NOCHE ? '☀️ MAPA 1: LA ISLA DE DÍA' : '🌙 MAPA 2: MARACAIBO DE NOCHE', NOCHE ? '#c07a10' : '#6a3ad0', NOCHE ? '#804a08' : '#3a1a90', 15, !NOCHE && Math.floor(tick/40)%2===0);
  /* el cartel de abajo: tres líneas con aire */
  const aw = Math.min(600, W-40), ay = H-206;
  cristal(W/2-aw/2, ay, aw, 96, 18, 0.55);
  textoAjustado(NOCHE ? 'El relámpago del Catatumbo ⚡ · Coro y sus chivos 🐐 · el bar de Rómulo 🍺 · el pterodáctilo 🦅' : 'Una isla entera para explorar: carro 🚗 · moto 🏍️ · barco 🚤 · avión ✈️ · submarino 🤿', W/2, ay+22, 15, aw-30, '#fff');
  textoAjustado(NOCHE ? 'Vuela en la nave hasta Marte 🔴 y encuentra a los extraterrestres 👽 en el espacio' : 'Come hamburguesas 🍔, corre al baño 🚽 del Señor Popo 💩 y saluda a toda la familia 👨‍👩‍👧', W/2, ay+48, 15, aw-30, '#ffe36e');
  textoAjustado(tactil ? 'Palanca a la izquierda · A salta y monta · B corre y turbo · 🚪 para bajarte' : 'Flechas o WASD · ESPACIO salta y monta · MAYÚS corre y turbo · E para bajarte · ESC menú', W/2, ay+74, 13, aw-30, '#bcd6ff');
  if (RED.pendiente) textoBorde('🎉 Te invitaron a la sala '+RED.pendiente+' · toca para entrar', W/2, H-84, 18, '#7dffa0');
  else if (Math.floor(tick/30)%2===0) textoBorde(tactil ? 'TOCA PARA JUGAR' : 'PULSA ENTER PARA JUGAR', W/2, H-78, 30, '#fff', 'center', true);
  if (P.estrellas.length) textoBorde('⭐ '+P.estrellas.length+'/'+MISIONES.length+' · tu aventura sigue donde la dejaste', W/2, H-36, 15, '#ffe36e');
  texto('🎮 mando · 📱 dedos · 👥 en línea con amigos', W/2, H-14, 12, 'rgba(255,255,255,0.6)');
}
function dibujarPersonaje(){
  ctx.fillStyle = 'rgba(5,10,30,0.82)'; ctx.fillRect(0,0,W,H);
  const z = zonaPersonaje(), sel = PERSONAJES_RED[selPj];
  tituloAjustado('¿CON QUIÉN JUEGAS?', W/2, 40, 40, W-240, '#fff6a0', '#ffb000');
  botonAtras(pjOrigen==='menu' ? '◀ VOLVER' : '◀ ASÍ ESTÁ BIEN');
  texto('Cada personaje habla con su propia voz 🗣️', W/2, 78, 15, '#bcd6ff');
  z.pjs.forEach((zp, i)=>{ const pj = PERSONAJES_RED[i], es = i===selPj;
    cristal(zp.x, zp.y, zp.w, zp.h, 12, es ? 0.85 : 0.4);
    if (es){ ctx.strokeStyle = '#ffe36e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(zp.x, zp.y, zp.w, zp.h, 12); ctx.stroke(); }
    texto(pj.emoji, zp.x+zp.w/2, zp.y+22, 22, '#fff'); textoAjustado(pj.nombre, zp.x+zp.w/2, zp.y+45, 12, zp.w-8, es ? '#ffe36e' : '#fff'); });
  const fh = 56, fy = Math.min(z.pjs[z.pjs.length-1].y + 58 + 14, z.jugar.y - fh - 12);
  if (fy > z.pjs[z.pjs.length-1].y + 40){ cristal(W/2-260, fy, 520, fh, 14, 0.5); textoAjustado(sel.emoji+' '+sel.nombre+' dice: «'+fraseDe(sel.id, 'inicio')+'»', W/2, fy+fh/2, 16, 500, '#fff'); }
  boton(z.jugar.x, z.jugar.y, z.jugar.w, z.jugar.h, '▶ JUGAR CON '+sel.nombre.toUpperCase(), '#3aa040', '#1e6a24', 20, Math.floor(tick/30)%2===0);
  if (!tactil) texto('Flechas para elegir · ENTER para jugar', W/2, H-8, 12, 'rgba(255,255,255,0.6)');
}
function dibujarAmigos(){
  ctx.fillStyle = 'rgba(5,10,30,0.82)'; ctx.fillRect(0,0,W,H);
  const z = zonaAmigos();
  tituloAjustado('JUGAR CON AMIGOS', W/2, 40, 40, W-420, '#bfe9ff', '#2a8ad0');
  botonAtras('◀ VOLVER');
  boton(z.guia.x, z.guia.y, z.guia.w, z.guia.h, '📖 GUÍA', '#4a6ad0', '#2a3a90', 16);
  if (RED.entrandoCodigo){
    texto('Escribe el código de la sala (4 letras o números)', W/2, 100, 17, '#fff');
    const cod = (RED.codigo + '____').slice(0,4).split('').join('  ');
    cristal(W/2-140, 120, 280, 56, 16, 0.6); titulo(cod, W/2, 150, 40, '#fff6a0', '#ffb000');
    for (const t of z.teclas){ boton(t.x, t.y, t.w, t.h, t.ch, '#3a4a90', '#22306a', 20); }
    boton(z.borrar.x, z.borrar.y, z.borrar.w, z.borrar.h, '⌫ BORRAR', '#8a3a30', '#5a1a10', 16);
    boton(z.entrar.x, z.entrar.y, z.entrar.w, z.entrar.h, '✅ ENTRAR', RED.codigo.length===4 ? '#3aa040' : '#4a4a4a', RED.codigo.length===4 ? '#1e6a24' : '#2a2a2a', 16, RED.codigo.length===4);
    if (RED.error) texto(RED.error, W/2, H-84, 14, '#ff9e9e');
    return;
  }
  if (RED.estado==='off' || RED.estado==='error'){
    texto('¿Quién eres tú?', W/2, 84, 15, '#bcd6ff');
    z.pjs.forEach((zp, i)=>{ const pj = PERSONAJES_RED[i], sel = pj.id===RED.pj;
      cristal(zp.x, zp.y, zp.w, zp.h, 12, sel ? 0.8 : 0.4); if (sel){ ctx.strokeStyle = '#ffe36e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(zp.x, zp.y, zp.w, zp.h, 12); ctx.stroke(); }
      texto(pj.emoji, zp.x+zp.w/2, zp.y+20, 20, '#fff'); textoAjustado(pj.nombre, zp.x+zp.w/2, zp.y+42, 11, zp.w-8, sel ? '#ffe36e' : '#fff'); });
  }
  if (RED.estado==='off'){
    { const cw = Math.min(660, W-40); cristal(W/2-cw/2, 226, cw, 78, 16, 0.5);
    textoAjustado('Uno crea la sala y comparte el enlace o el código de 4 letras.', W/2, 250, 15, cw-30, '#fff');
    textoAjustado('Los demás entran con ese código y juegan en la misma isla; las estrellas que gane uno son de todos.', W/2, 272, 14, cw-30, '#bcd6ff');
    textoAjustado(hayPeerJS() ? 'Gratis, sin cuentas, hasta '+MAX_JUGADORES+' jugadores. Todos los aparatos necesitan internet.' : '⚠️ No se cargó la parte de red: revisa la conexión y recarga.', W/2, 292, 13, cw-30, hayPeerJS() ? '#7dffa0' : '#ff9e9e'); }
    boton(z.crear.x, z.crear.y, z.crear.w, z.crear.h, '🏝️ CREAR UNA SALA', '#3aa040', '#1e6a24', 20, true);
    boton(z.unirme.x, z.unirme.y, z.unirme.w, z.unirme.h, '🔑 ENTRAR CON CÓDIGO', '#2a8ad0', '#1a4a90', 20);
    return;
  }
  if (RED.estado==='creando' || RED.estado==='uniendo'){
    const puntos = '.'.repeat(1 + Math.floor(tick/20)%3);
    titulo(RED.estado==='creando' ? 'Creando la sala'+puntos : 'Entrando a la sala '+RED.sala+puntos, W/2, H/2, 34, '#fff6a0', '#ffb000');
    texto(RED.estado==='uniendo' && RED.aviso_ ? RED.aviso_ : 'Esto tarda unos segundos', W/2, H/2+40, 15, '#bcd6ff');
    return;
  }
  if (RED.estado==='error'){
    const ew = Math.min(660, W-40);
    cristal(W/2-ew/2, 226, ew, 100, 16, 0.6);
    texto('😕 No se pudo', W/2, 250, 20, '#ff9e9e');
    ctx.font = 'bold 15px '+TXT; const palabras = RED.error.split(' '); let linea = '', y = 276;
    for (const w of palabras){ const t = linea ? linea+' '+w : w; if (ctx.measureText(t).width > ew-40){ texto(linea, W/2, y, 15, '#fff'); linea = w; y += 20; } else linea = t; }
    texto(linea, W/2, y, 15, '#fff');
    boton(z.reintentar.x, z.reintentar.y, z.reintentar.w, z.reintentar.h, '🔁 INTENTAR DE NUEVO', '#3aa040', '#1e6a24', 18, true);
    return;
  }
  /* sala creada o conectado */
  const nombres = [nombreLocal()+' (tú)', ...[...RED.remotos.values()].map(r=>r.nombre)];
  if (RED.estado==='sala'){
    texto('Tu sala está lista. Diles este código:', W/2, 96, 17, '#fff');
    cristal(W/2-170, 116, 340, 76, 20, 0.6); titulo(RED.sala.split('').join('  '), W/2, 154, 54, '#fff6a0', '#ffb000');
    texto('o mándales el enlace por WhatsApp:', W/2, 212, 15, '#bcd6ff');
    { const lw = Math.min(660, W-40); cristal(W/2-lw/2, 226, lw, 34, 17, 0.5); textoAjustado(enlaceSala(), W/2, 243, 13, lw-30, '#7de0ff'); }
    boton(z.compartir.x, z.compartir.y, z.compartir.w, z.compartir.h, '📲 COMPARTIR', '#2a8ad0', '#1a4a90', 18);
    boton(z.copiar.x, z.copiar.y, z.copiar.w, z.copiar.h, '📋 COPIAR ENLACE', '#4a6ad0', '#2a3a90', 18);
  } else {
    tituloAjustado('Estás en la sala '+RED.sala, W/2, 150, 36, W-80, '#fff6a0', '#ffb000');
    textoAjustado('Tus amigos aparecen en la isla con su nombre; el botón 🚀 IR CON… te lleva a su lado.', W/2, 200, 15, W-60, '#bcd6ff');
  }
  texto(tactil ? '🎙️ Para hablar: mantén apretado el botón del micrófono' : '🎙️ Para hablar: mantén apretada la tecla V (o el botón del micrófono)', W/2, 342, 13, '#bcd6ff');
  pastilla('👥 En la isla: '+nombres.join(' · ')+(nombres.length===1 ? '  (esperando amigos…)' : ''), W/2, 376, 14, '#fff', 0.5, Math.min(660, W-40));
  boton(z.jugar.x, z.jugar.y, z.jugar.w, z.jugar.h, '▶ ¡A JUGAR!', '#3aa040', '#1e6a24', 20, true);
  boton(W-190, H-64, 176, 46, '🚪 SALIR DE LA SALA', '#8a3a30', '#5a1a10', 13);
  boton(14, H-64, 190, 46, VOZ.silencio ? '🔇 AMIGOS EN SILENCIO' : '🔊 OÍR A LOS AMIGOS', VOZ.silencio ? '#8a3a30' : '#3aa040', VOZ.silencio ? '#5a1a10' : '#1e6a24', 13);
}
function dibujarHUD(){
  const J = P.J;
  vineta(0.22);
  /* arriba a la izquierda: estrellas, hamburguesas, puntos y las ganas de popo */
  cristal(12, 10, 222, 60, 14, 0.5);
  textoBorde('⭐ '+P.estrellas.length+'/'+MISIONES.length, 26, 30, 21, '#ffe36e', 'left');
  textoBorde('🍔 '+P.hamburguesas, 128, 30, 21, '#fff', 'left');
  texto(P.puntos.toLocaleString('es')+' puntos', 26, 56, 14, '#bcd6ff', 'left');
  const px = 12, py = 78, pw = 222, ph = 22;
  cristal(px, py, pw, ph, 11, 0.5);
  ctx.fillStyle = P.ganas ? (Math.floor(tick/10)%2 ? '#ff9040' : '#c05a10') : '#8a5a2a';
  ctx.beginPath(); ctx.roundRect(px+30, py+5, (pw-38)*P.popo, ph-10, 6); ctx.fill();
  texto('💩', px+16, py+ph/2+1, 15, '#fff');
  if (P.ganas) textoBorde('¡AL BAÑO!', px+pw/2+14, py+ph/2+1, 14, '#fff');
  /* el mapita y el objetivo, arriba a la derecha */
  dibujarMapa(W-80, 112, 62);
  const o = objetivo(P);
  const ancho = Math.min(300, W*0.36);
  cristal(W-ancho-12, 186, ancho, 44, 12, 0.5);
  textoAjustado(o.texto, W-ancho+30, 208, 14, ancho-104, '#fff', 'left');
  if (o.x !== null && o.x !== undefined){
    const ang = envolver(Math.atan2(o.x-J.x, o.z-J.z) - camYaw);
    flecha(W-ancho+8, 208, -ang, 9, '#ffe36e');
    const d = Math.hypot(o.x-J.x, o.z-J.z);
    texto(d > 999 ? (d/1000).toFixed(1)+' km' : Math.round(d)+' m', W-24, 208, 12, '#bcd6ff', 'right');
  }
  if (redActiva()) for (const z of zonasIrCon()){ boton(z.x, z.y, z.w, z.h, '🚀 IR CON '+z.nombre.toUpperCase()+' · '+(z.d > 999 ? (z.d/1000).toFixed(1)+' km' : Math.round(z.d)+' m'), '#2a8ad0', '#1a4a90', 13, z.d > 60 && Math.floor(tick/30)%2===0); }
  /* avisos y frases */
  if (P.cercaVeh && !P.veh && !P.escena) textoBorde((tactil ? 'A' : 'ESPACIO')+' = MONTAR '+P.cercaVeh.emoji, W/2, H-96, 22, '#fff', 'center', true);
  if (P.veh){
    const rapidez = (P.veh.id==='nave' || P.veh.id==='heli') ? Math.hypot(P.veh.vel, P.veh.vy||0) : Math.abs(P.veh.vel);
    textoBorde(Math.round(rapidez*3.6)+' km/h', W/2, H-30, 18, '#fff');
    if ((P.veh.id==='avion' || P.veh.id==='heli' || P.veh.id==='nave') && P.veh.aire) textoBorde(Math.round(P.veh.y)+' m de altura', W/2, H-52, 14, '#bfe9ff');
    if (P.veh.id==='sub') textoBorde(Math.round(-P.veh.y)+' m de profundidad', W/2, H-52, 14, '#bfe9ff');
    if (puedeBajar(P)) texto((tactil ? '🚪' : 'E')+' = bajarse', W/2, H-72, 13, '#bcd6ff');
  }
  let yAviso = 92;
  if (redActiva()){
    const n = RED.remotos.size + 1;
    pastilla('👥 sala '+RED.sala+' · '+n+(n===1 ? ' jugador (esperando…)' : ' jugadores'), W/2, 25, 14, '#bfe9ff', 0.55);
    const hablan = [...RED.remotos.values()].filter(r=>r.hablando).map(r=>r.nombre);
    const partes = [];
    if (VOZ.hablando) partes.push('🎙️ Hablando…');
    if (hablan.length && !VOZ.silencio) partes.push('🔊 '+hablan.join(', ')+(hablan.length===1 ? ' está hablando' : ' están hablando'));
    if (partes.length){ pastilla(partes.join('   ·   '), W/2, 56, 14, VOZ.hablando ? '#7dffa0' : '#fff', 0.6); yAviso = 84; }
    else yAviso = 56;
    if (!tactil && !MANDO.activo && !VOZ.hablando) texto('V = hablar 🎙️', W-14, H-30, 12, 'rgba(255,255,255,0.6)', 'right');
  }
  if (avisoT > 0) pastilla(avisoTxt, W/2, yAviso+16, 15, '#ffe36e', 0.6, Math.min(W-40, 640));
  burbujas.forEach((b, i)=>{
    /* el nombre a la izquierda y la frase a continuación, en una cápsula del ancho justo */
    const y = H - 150 - i*44, alfa = Math.min(1, b.t/20);
    ctx.globalAlpha = alfa;
    let tam = 17;
    const medir = ()=>{ ctx.font = 'bold '+(tam-2)+'px '+TXT; const nw = b.quien ? ctx.measureText(b.quien+':').width + 10 : 0; ctx.font = 'bold '+tam+'px '+TXT; return {nw, tw: ctx.measureText(b.txt).width}; };
    let m = medir();
    while (m.nw + m.tw + 36 > W-40 && tam > 11){ tam--; m = medir(); }
    const w = m.nw + m.tw + 36, x0 = W/2 - w/2;
    cristal(x0, y-18, w, 36, 18, 0.65);
    if (b.quien) texto(b.quien+':', x0+18, y+1, tam-2, '#ffe36e', 'left');
    texto(b.txt, x0+18+m.nw, y+1, tam, '#fff', 'left');
    ctx.globalAlpha = 1;
  });
  if (mensajeGrande){
    const m = mensajeGrande, k = 1 - m.t/m.t0, esc_ = k < 0.1 ? k*10 : 1;
    ctx.save(); ctx.translate(W/2, H*0.28); ctx.scale(esc_, esc_);
    ctx.globalAlpha = m.t < 20 ? m.t/20 : 1;
    tituloAjustado(m.txt, 0, 0, 46, W-60, '#fff', m.color);
    ctx.restore(); ctx.globalAlpha = 1;
  }
  if (P.escena && P.escena.tipo==='bano'){ if (Math.floor(tick/20)%2===0) textoBorde('💩 Fernando está haciendo popo… 🚽', W/2, H*0.26, 24, '#ffb070', 'center', true); }
  if (P.veh && P.veh.turbo > 0.5){ ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2; for (let i=0;i<10;i++){ const a = azar()*6.28, r1 = H*0.45, r2 = H*0.75; ctx.beginPath(); ctx.moveTo(W/2+Math.cos(a)*r1, H/2+Math.sin(a)*r1); ctx.lineTo(W/2+Math.cos(a)*r2, H/2+Math.sin(a)*r2); ctx.stroke(); } }
  dibujarPalancaYBotones();
  if (!tactil && !MANDO.activo){ texto('ESC = misiones', W-14, H-14, 12, 'rgba(255,255,255,0.6)', 'right'); }
}
function dibujarPausa(){
  ctx.fillStyle = 'rgba(5,10,30,0.82)'; ctx.fillRect(0,0,W,H);
  titulo('LAS MISIONES', W/2, 42, 40, '#fff6a0', '#ffb000');
  const pw = Math.min(940, W-24), x0 = W/2-pw/2, y0 = 72, filas = Math.ceil(MISIONES.length/2), cw = pw/2, fh = 22;
  cristal(x0, y0-6, pw, filas*fh+16, 16, 0.5);
  MISIONES.forEach((m, i)=>{
    const ok = P.estrellas.includes(m.id), col = Math.floor(i/filas), fila = i%filas, cx = x0 + col*cw, cy = y0+10+fila*fh;
    let extra = '', titulo_ = m.titulo;
    if (m.id==='banos') extra = P.prog.banos.length+'/'+BANOS.length; else if (m.id==='carro') extra = P.prog.banderas.length+'/'+BANDERAS.length;
    else if (m.id==='avion') extra = P.prog.aros.length+'/'+AROS.length; else if (m.id==='heli') extra = P.prog.helipuertos.length+'/'+HELIPUERTOS.length;
    else if (m.id==='motoagua') extra = P.prog.boyas.length+'/'+BOYAS.length; else if (m.id==='dino') extra = P.prog.huevos.length+'/'+HUEVOS.length;
    else if (m.id==='maracaibo') extra = P.arepas+'/5'; else if (m.id==='coro') extra = P.prog.chivos.length+'/'+CHIVOS.length; else if (m.id==='ptero') extra = P.prog.arosNoche.length+'/'+AROS_NOCHE.length; else if (m.id==='catatumbo') extra = P.prog.rayos+'/5';
    else if (m.id==='familia'){ extra = P.prog.familia.length+'/'+SALUDABLES.length; const faltan = FAMILIA.filter(f=>!f.bebe && !P.saludos[f.id]).map(f=>f.nombre); if (!ok && faltan.length) titulo_ = 'Falta saludar a: '+(faltan.length > 4 ? faltan.slice(0,4).join(', ')+' y '+(faltan.length-4)+' más' : faltan.join(', ')); }
    textoAjustado((ok ? '⭐ ' : '☆ ')+m.emoji+' '+titulo_, cx+14, cy, 14, cw-72, ok ? '#7dffa0' : (m.id==='familia' && titulo_ !== m.titulo ? '#ffe36e' : '#fff'), 'left');
    if (extra && !ok) texto(extra, cx+cw-12, cy, 13, '#bcd6ff', 'right');
  });
  const zs = zonasPausa();
  const etiquetas = ['▶ SEGUIR JUGANDO', redActiva() ? '👥 SALA '+RED.sala+' · '+(RED.remotos.size+1)+' EN LA ISLA' : '👥 JUGAR CON AMIGOS', musicaOn ? '🎵 MÚSICA: SÍ' : '🔇 MÚSICA: NO', '🗑️ EMPEZAR DE CERO', NOCHE ? '☀️ IR AL MAPA 1: LA ISLA DE DÍA' : '🌙 IR AL MAPA 2: MARACAIBO DE NOCHE', '◀ FERNANDO BROS'];
  const colores = [['#3aa040','#1e6a24'],['#2a8ad0','#1a4a90'],['#4a6ad0','#2a3a90'],['#c05a10','#803a08'],['#6a3ad0','#3a1a90'],['#4a6ad0','#2a3a90']];
  zs.forEach((z, i)=> boton(z.x, z.y, z.w, z.h, etiquetas[i], colores[i][0], colores[i][1], 16, selPausa===i));
  texto(P.puntos.toLocaleString('es')+' puntos · '+P.hamburguesas+' hamburguesas comidas', W/2, H-12, 13, '#bcd6ff');
}
function dibujarFinal(){
  ctx.fillStyle = 'rgba(5,10,30,0.55)'; ctx.fillRect(0,0,W,H);
  tituloAjustado('¡LO LOGRASTE TODO!', W/2, 96 + Math.sin(tick*0.06)*4, 60, W-60, '#fff6a0', '#ffb000');
  let s = ''; for (let i=0;i<MISIONES.length;i++) s += '⭐';
  textoBorde(s, W/2, 160, 40, '#ffe36e');
  const fw = Math.min(560, W-40);
  cristal(W/2-fw/2, 200, fw, 130, 18, 0.55);
  textoAjustado('Fernando hizo popo en todos los baños, manejó el carro,', W/2, 226, 17, fw-30, '#fff');
  textoAjustado('saltó con la moto, voló por los aros, navegó hasta Santi,', W/2, 252, 17, fw-30, '#fff');
  textoAjustado('encontró el tesoro y saludó a toda la familia.', W/2, 278, 17, fw-30, '#fff');
  textoAjustado('¡Eres el pichunguito campeón de la isla! · '+P.puntos.toLocaleString('es')+' puntos', W/2, 308, 16, fw-30, '#ffe36e');
  boton(W/2-150, H-90, 300, 44, '▶ SEGUIR EXPLORANDO', '#3aa040', '#1e6a24', 18, true);
  botonAtras('◀ FERNANDO BROS');
  if (tick % 4 === 0) confeti(P.J.x, P.J.y, P.J.z, 2);
}
function dibujar(){
  renderer.render(scene, camera);
  ctx.setTransform(esc,0,0,esc,0,0);
  ctx.clearRect(0,0,W,H);
  if (estado==='menu') dibujarMenu();
  else if (estado==='juego') dibujarHUD();
  else if (estado==='pausa') dibujarPausa();
  else if (estado==='final') dibujarFinal();
  else if (estado==='amigos') dibujarAmigos();
  else if (estado==='personaje') dibujarPersonaje();
  if (flashT > 0 && estado==='juego'){ ctx.fillStyle = 'rgba(235,240,255,'+(flashT/9*0.5)+')'; ctx.fillRect(0,0,W,H); }
  if (cortina>0){ ctx.fillStyle = 'rgba(0,0,0,'+(cortina/40)+')'; ctx.fillRect(0,0,W,H); }
  if (MANDO.avisoT>0) pastilla('🎮 MANDO CONECTADO', W/2, H-90, 18, '#7dffa0', 0.55);
}

/* ---------------- Bucle principal: 60 pasos por segundo, pase lo que pase ---------------- */
let ultimo = performance.now(), acum = 0, medida = 0, lentos = 0;
function bucle(ahora){
  requestAnimationFrame(bucle);
  const dt = ahora - ultimo;
  if (estado==='juego' && CAL.nivel < 3){
    if (dt > 34) lentos++; else lentos = Math.max(0, lentos-1);
    if (++medida > 180){ medida = 0; if (lentos > 60) bajarCalidad(); lentos = 0; }
  }
  acum += Math.min(100, dt); ultimo = ahora;
  let pasos = 0;
  while (acum >= 1000/60 && pasos < 4){ actualizar(); acum -= 1000/60; pasos++; }
  if (pasos===4) acum = 0;
  dibujar();
}
/* asas para las pruebas automáticas (no hacen nada en el juego) */
window.AV = { get W(){ return W; }, get H(){ return H; }, get estado(){ return estado; }, set estado(v){ estado = v; }, get P(){ return P; }, camera, scene, renderer, tecla: procesarTecla, paso: actualizar, empezar, set entrada(v){ entradaForzada = v; }, RED, VOZ, redRecibir, empaquetar: ()=>empaquetarEstado(P, RED.pj, nombreLocal()), ponerPersonaje, get particulas(){ return particulas.length; }, get CAL(){ return CAL; }, get vozLog(){ return vozLog; }, get burbujas(){ return burbujas; }, HAMBURGUESAS, MAPA, CORO, OVNI, AROS_NOCHE, PERSONAJES_RED, zonaPersonaje, PUENTE, MARACAIBO, LUNA, HELIPUERTOS, BOYAS, HUEVOS, AREPAS, VEHICULOS_DEF };
requestAnimationFrame(bucle);
})();
