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
  npc_santa:{pitch:0.5, rate:0.9}, npc_vampiro:{pitch:0.6, rate:0.85}, npc_payaso:{pitch:1.6, rate:1.2}, npc_alien:{pitch:1.5, rate:1.3}, npc_elefante:{pitch:0.4, rate:0.8}, npc_elefanteCirco:{pitch:0.45, rate:0.85}, npc_leon:{pitch:0.3, rate:0.7}, npc_reno:{pitch:1.2, rate:1.0}, npc_jirafa:{pitch:1.3, rate:1.0},
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
const LUNA = {x:0, y:520, z:0, r:90};   /* más baja que antes: se llega más fácil */
const ISLA_BANANA = {x:-430, z:250, r:48};    /* la isla de las bananas, al suroeste: quien come banana se vuelve gorila */
const CASTILLO = {x:-150, z:30, r:24, ang:Math.PI/2};   /* el castillo, al oeste del pueblo; la puerta mira al este */
const VALLE_DINOS = {x:110, z:-110, r:28};    /* el valle donde pasean los dinosaurios sueltos */
const enIslaBanana = (x, z)=> Math.hypot(x-ISLA_BANANA.x, z-ISLA_BANANA.z) < ISLA_BANANA.r + 8;
const ISLA_ELEFANTES = {x:430, z:-330, r:50};   /* la isla de los elefantes, al noreste */
const ISLA_VAMPIROS = {x:330, z:450, r:46};     /* la isla de los vampiros borrachos, al sureste */
const ISLA_CIRCO = {x:150, z:-500, r:55};       /* la isla del gran circo, al norte */
const ISLA_CONCIERTO = {x:-160, z:480, r:52};   /* la sala de conciertos al aire libre, al sur */
const ESCENARIO = {x:ISLA_CONCIERTO.x, z:ISLA_CONCIERTO.z-14, w:18, d:9};   /* la tarima mira hacia +z, donde está el público */
const MICROFONO = {x:ESCENARIO.x, z:ESCENARIO.z+2.6};
const CANCION_FRAMES = 60*10;   /* la canción de Fernando dura unos diez segundos */
const enIslaLejana = (x, z)=> [ISLA_ELEFANTES, ISLA_VAMPIROS, ISLA_CIRCO, ISLA_CONCIERTO].some(i=>Math.hypot(x-i.x, z-i.z) < i.r + 8);
/* los planetas, más arriba que la luna: el cohete llega a los tres */
const SATURNO = {x:350, y:900, z:-250, r:105};
const JUPITER = {x:-420, y:1300, z:380, r:150};
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
  const montana = 62*Math.exp(-dm/(95*95)) + 50*Math.exp(-dm/(40*40));
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
  const d4 = Math.hypot(x-ISLA_BANANA.x, z-ISLA_BANANA.z);
  const m4 = 1 - smooth(20, 72, d4);
  h = lerp(h, -8 + 12.5*m4 + 3*m4*(ruido(x/30+4, z/30+6)-0.5), m4);
  for (const isla of [ISLA_ELEFANTES, ISLA_VAMPIROS, ISLA_CIRCO, ISLA_CONCIERTO]){
    const di = Math.hypot(x-isla.x, z-isla.z), mi = 1 - smooth(isla.r*0.45, isla.r*1.5, di);
    h = lerp(h, -8 + 12*mi + 2.5*mi*(ruido(x/28+isla.x, z/28+isla.z)-0.5), mi);
  }
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
  {x:MONTANA.x-14, z:MONTANA.z+12, w:10, d:8, h:4.2, color:'#c0392b', techo:'#ffffff', nombre:'CASA DE SANTA CLAUS', santa:true, puerta:Math.PI/2},
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
/* la vereda del lago: un paseo de madera por la orilla de Maracaibo, mirando al lago y al puente */
const VEREDA = (()=>{
  const pts = [], a0 = Math.atan2(MARACAIBO.z, MARACAIBO.x) + Math.PI;   /* la dirección del puente, hacia la isla grande */
  for (let i=0;i<=34;i++){
    const a = a0 + 0.42 + i/34*1.5;
    let r = 60; while (r < 150 && alturaBase(MARACAIBO.x + Math.cos(a)*r, MARACAIBO.z + Math.sin(a)*r) > 1.0) r += 1;
    const rr = r - 4.5;
    pts.push({x: MARACAIBO.x + Math.cos(a)*rr, z: MARACAIBO.z + Math.sin(a)*rr, a});
  }
  for (let i=0;i<pts.length;i++){ const p = pts[Math.max(0,i-1)], q = pts[Math.min(pts.length-1,i+1)]; const dx = q.x-p.x, dz = q.z-p.z, L = Math.hypot(dx,dz)||1; pts[i].tx = dx/L; pts[i].tz = dz/L; pts[i].nx = -dz/L; pts[i].nz = dx/L; }
  const m = pts[Math.floor(pts.length/2)];
  return {pts, ancho: 5, centro: {x:m.x, z:m.z}};
})();
const cercaVereda = (x, z, d)=>{ for (const p of VEREDA.pts) if (Math.hypot(x-p.x, z-p.z) < d) return true; return false; };
const BOYAS = [];
for (let i=0;i<6;i++){ const a = i/6*Math.PI*2 + 0.35; let r = 372; while (alturaBase(Math.cos(a)*r, Math.sin(a)*r) > -2.5 && r < 470) r += 5; BOYAS.push({id:i, x:Math.cos(a)*r, z:Math.sin(a)*r}); }
const HUEVOS = [];
for (const [cx,cz] of [[-120,-40],[-205,-25],[-40,-260],[120,-205],[255,-95],[-245,120],[70,-100],[-140,80]]){
  let x = cx, z = cz, k = 0; while (alturaBase(x, z) < 1.5 && k < 40){ x += (0-x)*0.05; z += (0-z)*0.05; k++; }
  HUEVOS.push({id:HUEVOS.length, x, z});
}
/* los dinosaurios sueltos del valle: cuello largo, un tiranosaurio y dos triceratops, uno chiquito */
const DINOS = [
  {id:0, tipo:'cuello', esc:1.0,  color:'#7a9e5a', claro:'#b8d48a', x:VALLE_DINOS.x-10, z:VALLE_DINOS.z-6},
  {id:1, tipo:'trex',   esc:1.0,  color:'#b0603a', claro:'#e0a070', x:VALLE_DINOS.x+12, z:VALLE_DINOS.z+8},
  {id:2, tipo:'trice',  esc:1.0,  color:'#6a7ab0', claro:'#a8b4e0', x:VALLE_DINOS.x-2,  z:VALLE_DINOS.z+14},
  {id:3, tipo:'cuello', esc:0.6,  color:'#8ab06a', claro:'#c8e0a0', x:VALLE_DINOS.x-14, z:VALLE_DINOS.z+2},
  {id:4, tipo:'trice',  esc:0.75, color:'#8a6ab0', claro:'#c0a8e0', x:VALLE_DINOS.x+6,  z:VALLE_DINOS.z-14},
];
for (const d of DINOS){ let k = 0; while (alturaBase(d.x, d.z) < 1.5 && k < 30){ d.x += (VALLE_DINOS.x-d.x)*0.1; d.z += (VALLE_DINOS.z-d.z)*0.1; k++; } }
/* la isla de las bananas: matas de plátano y bananas que vuelven a crecer */
const PLATANOS = [], BANANAS = [];
{ semilla = 9090;
  for (let i=0;i<12;i++){ const a = i/12*6.283 + azar()*0.4, r = 10 + azar()*24; const x = ISLA_BANANA.x + Math.cos(a)*r, z = ISLA_BANANA.z + Math.sin(a)*r; if (alturaBase(x, z) > 1.6) PLATANOS.push({x, z, esc: 0.85 + azar()*0.4, rot: azar()*6.28}); }
  for (let i=0;i<8;i++){ const a = i/8*6.283 + 0.3, r = 5 + (i%3)*7; const x = ISLA_BANANA.x + Math.cos(a)*r, z = ISLA_BANANA.z + Math.sin(a)*r; BANANAS.push({id:'b'+i, x, z}); } }
/* un paseante cualquiera: elefante, vampiro, reno, payaso, extraterrestre… */
function npc(tipo, nombre, x, z, extra){ return Object.assign({tipo, nombre, x, z, ang: 0, mov: 0, fase: 0, obj: null, espera: 30, saludoT: -99999, r: 1.2, vel: 2, monedas: 10, frase: '¡Hola!'}, extra||{}); }
const ELEFANTES = [0,1,2,3].map(i=>{ const a = i/4*6.283; return npc('elefante', 'Elefante', ISLA_ELEFANTES.x + Math.cos(a)*16, ISLA_ELEFANTES.z + Math.sin(a)*16, {r: 2.6, vel: 1.6, frase: '¡Prrrrruuu! ¡Qué trompa tan larga tengo!', monedas: 10, esc: i===3 ? 0.6 : 1}); });
const VAMPIROS = [0,1,2,3].map(i=>{ const a = i/4*6.283 + 0.8; return npc('vampiro', 'Vampiro', ISLA_VAMPIROS.x + Math.cos(a)*12, ISLA_VAMPIROS.z + Math.sin(a)*12, {r: 0.8, vel: 1.4, borracho: true, frase: ['¡Hip! ¡Quiero jugo de tomate!', '¡Hip! ¡Se me cayó un colmillo!', '¡Buenas noooches! ¡Hip!', '¡Hip! ¿Dónde dejé mi ataúd?'][i], monedas: 10}); });
const RENOS = [0,1,2,3].map(i=>{ const a = i/4*6.283 + 0.4; return npc('reno', 'Reno', MONTANA.x + Math.cos(a)*22, MONTANA.z + Math.sin(a)*22, {r: 1.3, vel: 2.4, frase: '¡Jo! ¡Soy el reno de Santa!', monedas: 10, nariz: i===0}); });
const SANTA = npc('santa', 'Santa Claus', MONTANA.x-14+5+3.2, MONTANA.z+12+1.5, {r: 0.9, vel: 0, quieto: true, frase: '¡Jo, jo, jo! ¡Feliz Navidad, pichunguito!', monedas: 30});
SANTA.ang = -Math.PI/2;
/* Fernando cantante: aparece frente al micrófono cuando el que juega no es Fernando; al saludarlo, canta */
const CANTANTE = npc('cantante', 'Fernando', MICROFONO.x, MICROFONO.z-0.9, {r: 0.9, vel: 0, quieto: true, canta: true, frase: '¡Este concierto es para ti, pichunguito! 🎤', monedas: 25});
CANTANTE.ang = 0;
/* el gran circo: una carpa con pista, gradas, payasos, un león, una jirafa y un elefante en pelota */
const CIRCO_DEF = {x:ISLA_CIRCO.x, z:ISLA_CIRCO.z, w:36, d:36, h:14, color:'#e63946', techo:'#ffd23f', nombre:'EL GRAN CIRCO', circo:true, puerta:0};
const CIRCO_NPCS = [
  npc('payaso', 'Payaso Pipo', -4, 2, {r: 0.7, vel: 2.2, frase: '¡Piiip, piiip! ¿Quieres una flor que moja?', monedas: 10, color: '#e63946'}),
  npc('payaso', 'Payasa Lula', 4, -3, {r: 0.7, vel: 2.0, frase: '¡Jajaja! ¡Mira mis zapatos gigantes!', monedas: 10, color: '#4fc3f7'}),
  npc('payaso', 'Payaso Toto', 0, 6, {r: 0.7, vel: 2.6, frase: '¡Piiip! ¡Cuidado con el pastelazo!', monedas: 10, color: '#7dffa0'}),
  npc('leon', 'León Leo', -9, -9, {r: 1.4, vel: 0, quieto: true, frase: '¡ROAAAR! …es broma, soy manso.', monedas: 15}),
  npc('jirafa', 'Jirafa Fifi', 8, 8, {r: 1.4, vel: 1.4, frase: '¡Hola desde arriba! ¿Me alcanzas una hoja?', monedas: 15}),
  npc('elefanteCirco', 'Elefante Bombo', 9, -9, {r: 1.8, vel: 0, quieto: true, frase: '¡Prrrruuu! ¡Mira cómo bailo en mi pelota!', monedas: 15}),
];
/* las zonas del espacio: superficies planas escondidas bajo la isla, con su gravedad, sus rocas y sus extraterrestres */
const ZONAS = {
  luna:    {id:'luna',    nombre: NOCHE ? 'MARTE' : 'LA LUNA', x:300,  y:-420, z:300,  r:110, grav:0.34, color: NOCHE ? '#c8553d' : '#d8d8d0', crater: NOCHE ? '#8f3a2a' : '#b8b8b0', alien:'gris',   planeta: LUNA,    frase:'luna'},
  saturno: {id:'saturno', nombre:'SATURNO',                    x:-300, y:-620, z:300,  r:100, grav:0.8,  color:'#e8d29a', crater:'#c9b070', alien:'anillo', planeta: SATURNO, frase:'saturno'},
  jupiter: {id:'jupiter', nombre:'JÚPITER',                    x:300,  y:-820, z:-300, r:120, grav:1.5,  color:'#d9944f', crater:'#b8702e', alien:'blob',   planeta: JUPITER, frase:'jupiter'},
};
const ALIEN_INFO = {
  gris:   {nombre:'Extraterrestre gris', frase:'¡Bip, bip! ¡Saludos terrícola!', color:'#9aa4b8'},
  anillo: {nombre:'Saturniano', frase:'¡Zzzum! ¡Bienvenido a los anillos!', color:'#c07dff'},
  blob:   {nombre:'Jupiteriano', frase:'¡Blub, blub! ¡Qué grande es mi planeta!', color:'#ff8a3d'},
};
for (const k in ZONAS){
  const Z = ZONAS[k]; semilla = 5000 + k.length*77;
  Z.nave = {x: Z.x, z: Z.z - 14};
  Z.rocas = []; for (let i=0;i<16;i++){ const a = azar()*6.283, r = 22 + azar()*(Z.r-30); Z.rocas.push({x: Z.x + Math.cos(a)*r, z: Z.z + Math.sin(a)*r, r: 1.4 + azar()*2.4, esc: 0.8 + azar()*0.8}); }
  Z.crateres = []; for (let i=0;i<12;i++){ const a = azar()*6.283, r = azar()*(Z.r-10); Z.crateres.push({x: Z.x + Math.cos(a)*r, z: Z.z + Math.sin(a)*r, r: 3 + azar()*7}); }
  Z.aliens = [0,1,2,3].map(i=>{ const a = i/4*6.283 + 1.1, r = 18 + (i%2)*14; const info = ALIEN_INFO[Z.alien]; return npc('alien', info.nombre, Z.x + Math.cos(a)*r, Z.z + Math.sin(a)*r, {r: 0.9, vel: 1.8 + i*0.3, frase: info.frase, monedas: 20, alien: Z.alien, zona: k, id: i}); });
  Z.recogibles = [];
  if (k==='luna') for (let i=0;i<6;i++){ const a = i/6*6.283 + 0.5, r = 30 + (i%3)*18; Z.recogibles.push({id:'r'+i, tipo:'roca', x: Z.x + Math.cos(a)*r, z: Z.z + Math.sin(a)*r}); }
  if (k==='jupiter') for (let i=0;i<5;i++){ const a = i/5*6.283 + 0.9, r = 26 + (i%2)*30; Z.recogibles.push({id:'c'+i, tipo:'cristal', x: Z.x + Math.cos(a)*r, z: Z.z + Math.sin(a)*r}); }
  Z.bandera = {x: Z.x + 8, z: Z.z + 6};
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
  {id:'tanque', nombre:'el tanque', emoji:'🪖', x:HANGAR.x-20, z:HANGAR.z+12, ang:-Math.PI/2, radio:2.6, aplasta:true},
  {id:'tabla', nombre:'la tabla de surf', emoji:'🏄', x:PLAYA.x + Math.cos(PLAYA.ang)*31, z:PLAYA.z + Math.sin(PLAYA.ang)*31, ang:PLAYA.ang + Math.PI/2, radio:1.2, agua:true},
  {id:'ovni',  nombre:'la nave extraterrestre', emoji:'🛸', x:CASTILLO.x, z:CASTILLO.z-44, ang:0, radio:3.2, vuela:true},
  {id:'motonieve', nombre:'la moto de nieve', emoji:'🛷', x:MONTANA.x+16, z:MONTANA.z+10, ang:Math.PI/2, radio:1.6, nieve:true},
  {id:'esquis', nombre:'los esquís', emoji:'⛷️', x:MONTANA.x+20, z:MONTANA.z+16, ang:Math.PI/2, radio:1.0, nieve:true},
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
/* las situaciones nuevas (casas, castillo, ovni, meteoritos, dinosaurios, la vereda, las bananas y la gordura)
   no tienen grabación: se dicen con la voz sintética de cada personaje, con su manera de hablar */
const FRASES_NUEVAS = {
  casa: '¡Hola! ¿Hay alguien en casa?',
  castillo: '¡Un castillo! ¡Soy el rey del castillo!',
  ovni: '¡Estoy manejando la nave extraterrestre!',
  meteorito: '¡Cuidado! ¡Están cayendo meteoritos!',
  dinos: '¡Mira! ¡Dinosaurios de verdad!',
  vereda: '¡La vereda del lago! ¡Qué brisa tan rica!',
  gorila: '¡Comí banana! ¡Soy un gorila! ¡Uh, uh, ah, ah!',
  gorilaFin: '¡Uf! Ya no soy un gorila.',
  gordo: '¡Uy! ¡Estoy gordito de tantas hamburguesas!',
  saturno: '¡Saturno! ¡Mira sus anillos gigantes!',
  jupiter: '¡Júpiter! ¡El planeta más grande de todos!',
  paracaidas: '¡Geroooónimo! ¡Salté en paracaídas!',
  nieve: '¡Nieve! ¡Qué frío tan rico!',
  circo: '¡El circo! ¡Quiero ver a los payasos!',
  fantasma: '¡Un fantasma de popo! ¡Buuu!',
  concierto: '¡Un concierto! ¡Voy a cantar mi canción!',
  conciertoFer: '¡Mira, es Fernando! ¡Vamos a saludarlo para que cante!',
  surf: '¡Surf! ¡Voy a agarrar las olas grandes!',
  tanque: '¡Al ataque con el tanque! ¡Pum, pum!',
  gol: '¡Goooool! ¡Qué golazo!',
  flaco: '¡Hice popo y quedé flaquito!',
};
const alFinal = (t, suf)=> /!$/.test(t) ? t.replace(/!(?=[^!]*$)/, suf+'!') : t + suf;
const SABOR_PJ = {
  tiojuan: t=>alFinal(t, ', pichunguito'), luca: t=>t+' ¡Qué chévere!', salomon: t=>alFinal(t, ', primo'), cucu: t=>'¡Cucú! '+t,
  santi: t=>(t.match(/^[^!?]*[!?]/)||[t])[0], mama: t=>alFinal(t, ', mis amores'), papa: t=>t+' ¡Increíble!', abu: t=>t+' ¡Ay, mi cielo!',
  nacho: t=>'¡Épale! '+t, yanny: t=>alFinal(t, ', mi amor'), tiofran: t=>t+' ¡Prrrr!', romulo: t=>t+' ¡Brrrp! ¡Ay, qué pena!',
  beto: t=>alFinal(t, ', pichunguito'), giuliana: t=>t+' ¡Un abrazo!', penny: t=>'¡Guau! '+t, sheldon: t=>'¡Guau, guau! '+t, srpopo: t=>t+' ¡Y después, a hacer popo!',
};
function variar(pj, t){ const f = SABOR_PJ[pj]; return f ? f(t) : t; }
function fraseDe(pj, k, id){
  const paq = DIALOGOS[pj] || DIALOGOS.fernando;
  if (k==='saludo' && (!paq.saludo || pj==='fernando')){ const f = porId(id); return f ? f.frase : DIALOGOS.tiojuan.saludo; }
  return paq[k] || DIALOGOS.fernando[k] || (FRASES_NUEVAS[k] ? variar(pj, FRASES_NUEVAS[k]) : '');
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
solar(CASTILLO.x, CASTILLO.z, 26); solar(CASTILLO.x, CASTILLO.z-44, 9, alturaBase(CASTILLO.x, CASTILLO.z)); solar(ISLA_BANANA.x, ISLA_BANANA.z, 12);
solar(ISLA_CIRCO.x, ISLA_CIRCO.z, 24); solar(ESCENARIO.x, ESCENARIO.z+7, 26); solar(ISLA_VAMPIROS.x, ISLA_VAMPIROS.z, 12); solar(MONTANA.x+18, MONTANA.z+13, 9, alturaBase(MONTANA.x-14, MONTANA.z+12));
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
for (const b of BANANAS) b.y = alturaMalla(b.x, b.z) + 1.0;
/* ---------------- Por dentro de las casas y del castillo ----------------
   Cada casa tiene un cuarto escondido 220 m bajo la isla, justo debajo de ella. Al tocar
   la puerta con A se entra (se teletransporta al cuarto) y desde la puerta de adentro se
   sale. Los muebles se definen aquí, en el marco «puerta al frente» (+z), y se giran según
   hacia dónde mira la puerta de esa casa; así el núcleo choca con los mismos muebles que
   la vista dibuja. */
const CASTILLO_DEF = {x:CASTILLO.x, z:CASTILLO.z, w:30, d:30, h:8, color:'#a8a8b0', techo:'#c0392b', nombre:'EL CASTILLO', castillo:true, puerta:CASTILLO.ang};
const Y_INTERIOR = -220;
function muebles(c, HW, HD){
  const M = [];
  const m = (t, x, z, w, d, extra)=> M.push(Object.assign({t, x, z, w, d, ang:0, alto:0}, extra||{}));
  if (c.castillo){
    m('alfombraRoja', 0, 0.6, 4.4, HD*2-3, {suave:true});
    m('trono', 0, -HD+2.4, 2.6, 1.8);
    for (const sx of [-1, 1]) for (const k of [-0.55, 0, 0.55]) m('columna', sx*HW*0.62, k*HD, 1.6, 1.6);
    for (const sx of [-1, 1]) for (const k of [-0.6, -0.2, 0.2, 0.6]) m('estandarte', sx*(HW-0.35), k*HD, 0.2, 1.6, {suave:true, ang: sx > 0 ? -Math.PI/2 : Math.PI/2});
    for (const k of [-0.45, 0.35]) m('candelabro', 0, k*HD, 3, 3, {suave:true});
    m('mesaBanquete', -HW*0.35, HD*0.55, 8, 2.2);
    for (const sx of [-1, 1]) m('armadura', sx*3.2, -HD+2.6, 1.0, 1.0);
    m('chimenea', HW-0.9, HD*0.5, 1.6, 3.2, {ang: -Math.PI/2});
    m('cuadro', 0, -HD+0.3, 3, 0.2, {suave:true, alto: 4.6, texto:'🏰'});
    m('piano', HW*0.55, -HD*0.2, 2.8, 1.3, {ang: -Math.PI/2});
  } else if (c.circo){
    m('pista', 0, 0, 20, 20, {suave:true});
    m('poste', 0, 0, 0.8, 0.8);
    for (const lado of [-1, 1]) for (let f=0;f<3;f++) m('grada', lado*(HW-1.2-f*1.3), 0, 1.1, HD*2-8, {alto: 0.5+f*0.55, fila:f});
    for (let f=0;f<3;f++) m('grada', 0, -HD+1.2+f*1.3, HW*2-8, 1.1, {alto: 0.5+f*0.55, fila:f, ang: Math.PI/2});
    m('pedestal', -9, -9, 2.2, 2.2); m('pelota', 9, -9, 2.4, 2.4);
    m('trapecio', 0, 0, 1, 1, {suave:true, alto: 9.5});
    m('cuadro', 0, HD-0.3, 4, 0.2, {suave:true, alto: 5, texto:'🎪'});
  } else if (c.santa){
    m('cama', -HW+2.0, -HD+2.3, 2.4, 3.6, {color: '#c0392b'});
    m('arbolNavidad', HW*0.45, -HD*0.35, 2.4, 2.4);
    m('regalos', HW*0.45, HD*0.35, 2.6, 2.0);
    m('sofa', -HW*0.4, HD*0.45, 2.8, 1.2, {color: '#2a9c3a', ang: Math.PI});
    m('chimenea', -HW+0.9, HD*0.1, 1.6, 2.4, {ang: Math.PI/2});
    m('alfombra', 0.3, HD*0.05, 4.2, 3.2, {suave:true, color: '#c0392b'});
    m('cuadro', 0, -HD+0.3, 3, 0.2, {suave:true, alto: 2.4, texto:'🎅'});
  } else if (c.letrero==='BAR'){
    m('barra', 0, -HD+2.0, 8, 1.3);
    for (const k of [-2.4, -0.8, 0.8, 2.4]) m('banqueta', k, -HD+3.2, 0.6, 0.6, {suave:true});
    m('estante', 0, -HD+0.45, 8, 0.5, {suave:true, alto: 1.4});
    for (const [x, z] of [[-HW*0.55, 0.6], [HW*0.55, 0.6], [0, HD*0.55]]) m('mesaRedonda', x, z, 2.0, 2.0);
    m('rocola', HW-1.0, HD-1.6, 1.3, 0.9, {ang: -Math.PI/2});
    m('cuadro', -HW+0.3, -HD*0.2, 0.2, 2.4, {suave:true, alto: 2.4, texto:'🍺'});
  } else if (c.letrero==='BURGER' || c.letrero==='AREPAS'){
    m('mostrador', 0, -HD+2.4, 7, 1.3, {comida: c.letrero});
    m('cocina', 0, -HD+0.8, 6, 1.1, {ang: Math.PI});
    for (const [x, z] of [[-HW*0.55, 0.4], [HW*0.55, 0.4], [-HW*0.55, HD*0.65], [HW*0.55, HD*0.65]]) m('mesaRedonda', x, z, 2.0, 2.0);
    m('cuadro', HW-0.3, -HD*0.3, 0.2, 2.4, {suave:true, alto: 2.4, texto: c.letrero==='BURGER' ? '🍔' : '🫓'});
  } else if (c.gasolinera){
    m('mostrador', 0, -HD+2.2, 5, 1.3);
    for (const sx of [-1, 1]) m('estanteTienda', sx*HW*0.5, 0.4, 4.2, 0.9);
    m('llantas', HW-1.4, HD-1.6, 1.6, 1.6);
    m('cuadro', 0, -HD+0.3, 3, 0.2, {suave:true, alto: 3.0, texto:'⛽'});
  } else {
    m('cama', -HW+2.0, -HD+2.3, 2.4, 3.6, {color: c.techo});
    m('mesita', -HW+0.7, -HD+0.7, 0.9, 0.9);
    m('mesa', HW*0.4, -HD*0.25, 2.4, 1.6);
    m('sofa', -HW*0.4, HD*0.45, 2.8, 1.2, {color: c.techo, ang: Math.PI});
    m('tele', -HW*0.4, HD-0.75, 1.7, 0.7, {ang: Math.PI});
    m('cocina', HW-0.6, -HD*0.35, 1.1, 4.2, {ang: -Math.PI/2});
    m('alfombra', 0.3, HD*0.05, 4.2, 3.2, {suave:true, color: c.color});
    m('lampara', HW-1.1, HD-1.2, 0.6, 0.6);
    m('nevera', HW-0.75, HD*0.3, 1.1, 1.1, {ang: -Math.PI/2});
    m('piano', -HW*0.15, -HD+0.9, 2.8, 1.3);
    m('planta', -HW+0.7, HD-0.7, 0.8, 0.8, {suave:true});
    m('cuadro', -HW+0.3, -HD*0.2, 0.2, 2.2, {suave:true, alto: 2.4, texto: c.nombre==='CASA DE FERNANDO' ? '🧢' : c.nombre==='CASA DE ABU' ? '👵' : '🖼️'});
    m('ventana', 0, -HD+0.3, 2.4, 0.2, {suave:true, alto: 2.2});
  }
  return M;
}
const INTERIORES = CASAS.concat(CASAS_MCBO, [CASTILLO_DEF, CIRCO_DEF]).map((c, i)=>{
  const HW = c.castillo ? 19 : c.circo ? 17 : 10, HD = c.castillo ? 15 : c.circo ? 17 : 8, alto = c.castillo ? 11 : c.circo ? 12 : 5.2, a = c.puerta;   /* cuartos amplios: casas de 20×16, castillo de 38×30 */
  const gira = (x, z)=>({x: x*Math.cos(a) + z*Math.sin(a), z: -x*Math.sin(a) + z*Math.cos(a)});
  const lado = Math.abs(Math.sin(a)) > 0.5;                     /* la puerta mira al este u oeste: el cuarto va girado */
  const hw = lado ? HD : HW, hd = lado ? HW : HD;
  const M = muebles(c, HW, HD).map(mb=>{ const g = gira(mb.x, mb.z); return Object.assign({}, mb, {x: c.x + g.x, z: c.z + g.z, w: lado ? mb.d : mb.w, d: lado ? mb.w : mb.d, ang: mb.ang + a}); });
  const sx = Math.sin(a), cz = Math.cos(a);
  const px = c.x + sx*(lado ? hw : hd), pz = c.z + cz*(lado ? hw : hd);    /* la puerta de adentro, en la pared del frente */
  const ex = c.x + sx*(c.w/2 + 1.9), ez = c.z + cz*(c.d/2 + 1.9);              /* el sitio de afuera, frente a la puerta */
  return {id:i, c, nombre:c.nombre, castillo:!!c.castillo, circo:!!c.circo, x:c.x, z:c.z, y:Y_INTERIOR, hw, hd, alto, ang:a, px, pz, ex, ez, muebles:M,
    ix: px - sx*1.7, iz: pz - cz*1.7};                                          /* donde se aparece al entrar, un pasito adentro */
});
const INTERIOR_CASTILLO = INTERIORES.find(I=>I.castillo), INTERIOR_CIRCO = INTERIORES.find(I=>I.circo);
/* los muebles con los que se juega (A al lado): qué hacen y qué dice el botón */
const USOS = {tele:'VER LA TELE 📺', cama:'DORMIR 🛏️', nevera:'COMER 🍔', cocina:'COCINAR 🍳', piano:'TOCAR 🎹', lampara:'LUZ 💡', sofa:'SENTARSE 🛋️', banqueta:'SENTARSE 🪑', trono:'SENTARSE EN EL TRONO 👑',
  rocola:'MÚSICA 🎵', chimenea:'ENCENDER 🔥', regalos:'ABRIR 🎁', arbolNavidad:'LUCES 🎄', armadura:'TOCAR 🛡️', llantas:'SALTAR 🛞', mostrador:'PEDIR COMIDA 🍽️', mesaBanquete:'BANQUETE 🍗', grada:'SENTARSE 🪑'};
const SE_SIENTA = {sofa:true, banqueta:true, trono:true, grada:true};
function muebleCerca(P){
  const J = P.J, I = P.casa; if (!I) return null;
  let mejor = null, md = 1.25;
  for (let i=0;i<I.muebles.length;i++){ const m = I.muebles[i]; if (!USOS[m.t]) continue;
    const hx = m.w/2, hz = m.d/2, cx = clamp(J.x, m.x-hx, m.x+hx), cz = clamp(J.z, m.z-hz, m.z+hz), d = Math.hypot(J.x-cx, J.z-cz);
    if (d < md){ md = d; mejor = m; } }
  return mejor;
}
function estadoCasa(P, m){ const k = P.casa.id + '/' + m.t + '/' + Math.round(m.x) + ',' + Math.round(m.z); if (!P.casaEstado[k]) P.casaEstado[k] = {on:false, usos:0, ultimo:-9999}; return P.casaEstado[k]; }
function usarMueble(P, m){
  const I = P.casa, J = P.J, e = estadoCasa(P, m), primera = e.usos === 0; e.usos++;
  const base = {t:m.t, x:m.x, y:I.y, z:m.z, primera, nombre:I.nombre};
  if (SE_SIENTA[m.t]){
    P.sentado = {m, t:0}; J.vx = J.vz = 0; J.mov = 0;
    if (m.t==='trono'){ J.x = m.x; J.z = m.z; J.ang = envolver(m.ang + Math.PI); }
    else { const sx = Math.sin(m.ang), cz = Math.cos(m.ang); J.x = m.x - sx*0.05; J.z = m.z - cz*0.05; J.ang = envolver(m.ang + Math.PI); }
    evento(P, 'sentado', base);
    if (m.t==='trono' && !P.saludos.rey){ P.saludos.rey = true; P.monedas += 15; P.puntos += 300; evento(P, 'rey', base); }
    return;
  }
  if (m.t==='cama'){ P.durmiendo = {t:0, dur:170}; J.vx = J.vz = 0; J.mov = 0; J.x = m.x; J.z = m.z; evento(P, 'dormir', base); return; }
  if (m.t==='nevera' || m.t==='cocina' || m.t==='mostrador' || m.t==='mesaBanquete'){
    if (P.t - e.ultimo < 60*20){ evento(P, 'muebleNada', Object.assign({texto:'Ya comiste hace poquito 😅'}, base)); return; }
    e.ultimo = P.t;
    const arepa = m.comida==='AREPAS';
    if (arepa){ P.arepas++; } else P.hamburguesas++;
    P.puntos += 100; P.monedas += 2; P.popo = Math.min(1, P.popo + 0.34); engordar(P);
    evento(P, 'comidaCasa', Object.assign({arepa, total: arepa ? P.arepas : P.hamburguesas}, base));
    if (P.t - P.ultimaHamb > 60){ decir(P, arepa ? 'arepa' : 'hamburguesa'); } P.ultimaHamb = P.t;
    P.pedoT = 14;
    return;
  }
  if (m.t==='regalos'){
    if (e.on){ evento(P, 'muebleNada', Object.assign({texto:'Ya abriste los regalos 🎁'}, base)); return; }
    e.on = true; P.monedas += 15; P.puntos += 200; evento(P, 'regalo', base); return;
  }
  if (m.t==='llantas'){ J.vy = 13; J.suelo = false; evento(P, 'muebleSalto', base); return; }
  if (m.t==='piano' || m.t==='armadura'){ evento(P, 'mueble', Object.assign({on:true}, base)); return; }
  /* lo demás se prende y se apaga: tele, lámpara, chimenea, rocola, árbol */
  e.on = !e.on; evento(P, 'mueble', Object.assign({on:e.on}, base));
}
function usoDe(m){ return USOS[m.t] || 'USAR'; }
for (const n of CIRCO_NPCS){ n.x += INTERIOR_CIRCO.x; n.z += INTERIOR_CIRCO.z; n.hx = n.x; n.hz = n.z; }
/* moverse dentro de un cuarto: paredes y muebles, sin árboles ni mar */
function moverEnCasa(J, nx, nz, I){
  let choco = false;
  const mx = I.hw - 0.55, mz = I.hd - 0.55;
  if (nx < I.x-mx || nx > I.x+mx){ nx = clamp(nx, I.x-mx, I.x+mx); choco = true; }
  if (nz < I.z-mz || nz > I.z+mz){ nz = clamp(nz, I.z-mz, I.z+mz); choco = true; }
  for (const o of I.muebles){
    if (o.suave) continue;
    const hx = o.w/2, hz = o.d/2;
    const cx = clamp(nx, o.x-hx, o.x+hx), cz = clamp(nz, o.z-hz, o.z+hz);
    const dx = nx-cx, dz = nz-cz, d = Math.hypot(dx,dz);
    if (d < J.radio){
      if (d > 1e-6){ nx = cx + dx/d*J.radio; nz = cz + dz/d*J.radio; }
      else { const s1 = o.x+hx+J.radio-nx, s2 = nx-(o.x-hx-J.radio), s3 = o.z+hz+J.radio-nz, s4 = nz-(o.z-hz-J.radio); const m = Math.min(s1,s2,s3,s4);
        if (m===s1) nx = o.x+hx+J.radio; else if (m===s2) nx = o.x-hx-J.radio; else if (m===s3) nz = o.z+hz+J.radio; else nz = o.z-hz-J.radio; }
      choco = true;
    }
  }
  return {x:nx, z:nz, choco};
}
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
/* frente a la playa hay una zona de olas grandes que ruedan hacia la orilla: ahí se surfea */
const OLAS = {x: PLAYA.x + Math.cos(PLAYA.ang)*90, z: PLAYA.z + Math.sin(PLAYA.ang)*90, r: 62, dx: Math.cos(PLAYA.ang), dz: Math.sin(PLAYA.ang), amp: 2.4, k: 0.11, w: 1.1};
function olaGrande(x, z, t){
  const d = Math.hypot(x-OLAS.x, z-OLAS.z); if (d > OLAS.r) return 0;
  const f = 1 - smooth(OLAS.r*0.35, OLAS.r, d);
  return OLAS.amp*f*Math.sin(OLAS.k*(x*OLAS.dx + z*OLAS.dz) + OLAS.w*t);
}
function ola(x, z, t){
  return 0.22*Math.sin(x*0.23 + t*1.3) + 0.16*Math.sin(z*0.29 - t*1.1) + 0.1*Math.sin((x+z)*0.11 + t*0.7) + olaGrande(x, z, t);
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
    if (enIslaBanana(x, z) || enIslaLejana(x, z) || cercaVereda(x, z, 7) || Math.hypot(x-CASTILLO.x, z-CASTILLO.z) < 34 || Math.hypot(x-VALLE_DINOS.x, z-VALLE_DINOS.z) < VALLE_DINOS.r + 4 || Math.hypot(x-MONTANA.x, z-MONTANA.z) < 34) continue;
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
    if (h > 1.5 && (enIslaBanana(x, z) || enIslaLejana(x, z) || Math.hypot(x-MONTANA.x, z-MONTANA.z) < 34 || cercaVereda(x, z, 7) || Math.hypot(x-CASTILLO.x, z-CASTILLO.z) < 34 || Math.hypot(x-VALLE_DINOS.x, z-VALLE_DINOS.z) < VALLE_DINOS.r + 4)) continue;
    DECOR.rocas.push({x, z, h, esc: 0.6 + azar()*1.6, rot: azar()*6.28, agua: h < -2});
  }
  for (let i=2;i<VEREDA.pts.length;i+=5){ const p = VEREDA.pts[i]; const x = p.x + p.nx*6.2, z = p.z + p.nz*6.2; if (altura(x, z) > 1.0) DECOR.palmeras.push({x, z, h: altura(x, z), esc: 1.05 + (i%3)*0.12, rot: i*1.7, inclina: -0.25}); }
  for (const a of DECOR.arboles) agregarObst({x:a.x, z:a.z, r:0.9*a.esc});
  for (const a of DECOR.palmeras) agregarObst({x:a.x, z:a.z, r:0.7*a.esc});
  for (const a of DECOR.pinos) agregarObst({x:a.x, z:a.z, r:0.9*a.esc});
  for (const r of DECOR.rocas) if (!r.agua && r.esc > 1.0) agregarObst({x:r.x, z:r.z, r:1.1*r.esc});
  for (const c of CASAS) agregarObst({x:c.x, z:c.z, hx:c.w/2, hz:c.d/2, alto: altura(c.x, c.z) + c.h});
  for (const c of CASAS_MCBO) agregarObst({x:c.x, z:c.z, hx:c.w/2, hz:c.d/2, alto: altura(c.x, c.z) + c.h});
  agregarObst({x:HANGAR.x, z:HANGAR.z, hx:HANGAR.w/2, hz:HANGAR.d/2});
  agregarObst({x:CASTILLO.x, z:CASTILLO.z, hx:15, hz:15});
  agregarObst({x:CIRCO_DEF.x, z:CIRCO_DEF.z, r:18});
  for (const p of PLATANOS) agregarObst({x:p.x, z:p.z, r:0.6*p.esc});
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

/* ---------------- Las monedas ---------------- */
const MONEDAS = [];
(function ponerMonedas(){
  let id = 0;
  const poner = (x, z, y, valor)=>{ MONEDAS.push({id:'m'+(id++), x, z, y: y===undefined ? altura(x, z)+1.0 : y, valor: valor||1}); };
  for (let i=0;i<16;i++){ const m = puntoRuta(i*RUTA.L/16 + 60); poner(m.x - m.nx*3.4, m.z - m.nz*3.4); }
  for (const [x,z] of [[30,34],[58,36],[10,52],[-6,74],[26,74],[48,66],[74,60],[-30,44],[-52,66],[20,110],[46,132],[-16,140],[80,120],[104,84]]) poner(x, z);
  for (const isla of [ISLA_BANANA, ISLA_ELEFANTES, ISLA_VAMPIROS, ISLA_CIRCO]) for (let i=0;i<4;i++){ const a = i/4*6.283 + 0.4, x = isla.x + Math.cos(a)*(isla.r*0.45), z = isla.z + Math.sin(a)*(isla.r*0.45); if (altura(x, z) > 1.2) poner(x, z, undefined, 2); }
  for (let i=0;i<5;i++){ const a = i/5*6.283, x = MONTANA.x + Math.cos(a)*14, z = MONTANA.z + Math.sin(a)*14; poner(x, z, undefined, 2); }
  for (let i=3;i<VEREDA.pts.length;i+=7){ const p = VEREDA.pts[i]; poner(p.x, p.z); }
  for (const [ox,oz] of [[-22,0],[22,-4],[0,26]]) poner(CASTILLO.x+ox, CASTILLO.z+oz, undefined, 2);
  for (let i=0;i<4;i++){ const a = i/4*6.283, x = VALLE_DINOS.x + Math.cos(a)*18, z = VALLE_DINOS.z + Math.sin(a)*18; if (altura(x, z) > 1.2) poner(x, z); }
  for (const [ox,oz] of [[-30,10],[30,12],[10,-30],[-8,44]]) poner(MARACAIBO.x+ox, MARACAIBO.z+oz);
  for (const k in ZONAS){ const Z = ZONAS[k]; for (let i=0;i<6;i++){ const a = i/6*6.283 + 0.2, r = 14 + (i%3)*22; poner(Z.x + Math.cos(a)*r, Z.z + Math.sin(a)*r, Z.y + 1.0, 3); } }
})();
/* la tienda de disfraces: gorros, capas, colores del carro y mascotas; se compran con monedas y se guardan aparte de la partida */
const ITEMS_TIENDA = [
  {id:'corona',  tipo:'gorro', nombre:'Corona de rey',    emoji:'👑', precio:60},
  {id:'vaquero', tipo:'gorro', nombre:'Sombrero vaquero', emoji:'🤠', precio:40},
  {id:'casco',   tipo:'gorro', nombre:'Casco espacial',   emoji:'🪖', precio:80},
  {id:'santa',   tipo:'gorro', nombre:'Gorro de Santa',   emoji:'🎅', precio:50},
  {id:'mago',    tipo:'gorro', nombre:'Sombrero de mago', emoji:'🎩', precio:70},
  {id:'conejo',  tipo:'gorro', nombre:'Orejas de conejo', emoji:'🐰', precio:45},
  {id:'capaRoja',   tipo:'capa', nombre:'Capa roja',    emoji:'🟥', precio:30, color:'#d82800'},
  {id:'capaAzul',   tipo:'capa', nombre:'Capa azul',    emoji:'🟦', precio:40, color:'#2a6ad0'},
  {id:'capaVerde',  tipo:'capa', nombre:'Capa verde',   emoji:'🟩', precio:40, color:'#2a9c3a'},
  {id:'capaDorada', tipo:'capa', nombre:'Capa dorada',  emoji:'🟨', precio:100, color:'#ffd23f'},
  {id:'carroAzul',   tipo:'carro', nombre:'Carro azul',    emoji:'🚙', precio:50, color:'#2a6ad0', claro:'#6aa0ff'},
  {id:'carroVerde',  tipo:'carro', nombre:'Carro verde',   emoji:'🚙', precio:50, color:'#2a9c3a', claro:'#7de08a'},
  {id:'carroMorado', tipo:'carro', nombre:'Carro morado',  emoji:'🚙', precio:70, color:'#7b4fa8', claro:'#c09aff'},
  {id:'carroDorado', tipo:'carro', nombre:'Carro dorado',  emoji:'🚙', precio:150, color:'#e8b820', claro:'#fff0a0'},
  {id:'gatito',     tipo:'mascota', nombre:'Gatito',     emoji:'🐱', precio:120},
  {id:'pollito',    tipo:'mascota', nombre:'Pollito',    emoji:'🐥', precio:90},
  {id:'dragoncito', tipo:'mascota', nombre:'Dragoncito', emoji:'🐲', precio:200},
];
const ropaNueva = ()=>({comprados:[], gorro:null, capa:null, carro:null, mascota:null});
/* comprar o ponerse algo: devuelve qué pasó */
function comprar(P, ropa, id){
  const it = ITEMS_TIENDA.find(i=>i.id===id); if (!it) return 'no';
  if (ropa.comprados.includes(id)){ ropa[it.tipo] = ropa[it.tipo]===id ? null : id; if (it.tipo==='mascota') P.mascota = ropa.mascota; evento(P, 'ropa', {id, puesto: ropa[it.tipo]===id}); return ropa[it.tipo]===id ? 'puesto' : 'quitado'; }
  if (P.monedas < it.precio) return 'faltan';
  P.monedas -= it.precio; ropa.comprados.push(id); ropa[it.tipo] = id;
  if (it.tipo==='mascota') P.mascota = id;
  evento(P, 'compra', {id, nombre:it.nombre, emoji:it.emoji, precio:it.precio});
  return 'comprado';
}
function ganarMonedas(P, n, x, y, z){ P.monedas += n; evento(P, 'monedas', {n, total:P.monedas, x, y, z}); }
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
  {id:'rocas',   emoji:'🌑', titulo:'Recoge 6 rocas marcianas paseando por Marte'},
  {id:'saturno', emoji:'🪐', titulo:'Vuela hasta Saturno y saluda a 4 saturnianos'},
  {id:'jupiter', emoji:'🟠', titulo:'Vuela hasta Júpiter y recoge 5 cristales'},
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
  {id:'rocas',   emoji:'🌑', titulo:'Recoge 6 rocas lunares paseando por la luna'},
  {id:'saturno', emoji:'🪐', titulo:'Vuela hasta Saturno y saluda a 4 saturnianos'},
  {id:'jupiter', emoji:'🟠', titulo:'Vuela hasta Júpiter y recoge 5 cristales'},
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
    prog: {banos:[], banderas:[], aros:[], familia:[], helipuertos:[], boyas:[], huevos:[], chivos:[], arosNoche:[], rocas:[], saturnianos:[], cristales:[], casas:[], rayos:0, rampa:false, santi:false, cofre:false, popo:false, luna:false, maracaibo:false, ovni:false, coroDicho:false},
    chivos: CHIVOS.map(c=>({id:c.id, x:c.x, z:c.z, ang:c.ang, t:0, saltoT:0})), ultimoRayo: -9999, catatumboDicho: -9999,
    espacio: false, rugidoT: -9999, pj: 'fernando', enPuenteT: -9999,
    casa: null, cercaPuerta: null, meteoros: [], proxMeteoros: 60*40, meteoroDicho: -9999,
    dinos: DINOS.map(d=>({id:d.id, x:d.x, z:d.z, ang:0, mov:0, fase:0, obj:null, espera:60*d.id, r: (d.tipo==='cuello' ? 2.8 : d.tipo==='trex' ? 1.9 : 2.2)*d.esc})), rugidoDinoT: -9999, dinosDicho: -99999,
    bananasT: {}, gorilaT: 0, gordura: 0, flacoT: 0, gordoDicho: -9999, veredaT: -99999, castilloDicho: false,
    zona: null, zonaSalidaT: -99999, zonasVistas: [], paracaidas: false, avionSolo: null, monedas: 0, monedasT: {},
    hora: NOCHE ? 0.0 : 0.32, fantasmas: [], fantasmaDicho: -99999, mascota: null, mascotaPos: null,
    props: PROPS_DEF.map(d=>Object.assign({}, d, {ox:d.x, oz:d.z, y:0, vx:0, vy:0, vz:0, giro:0, ang:d.ang||0, estado:'quieto', t:0, fase:0, huyeT:0, premioT:-9999})),
    aliens: {luna: ZONAS.luna.aliens.map(a=>Object.assign({}, a)), saturno: ZONAS.saturno.aliens.map(a=>Object.assign({}, a)), jupiter: ZONAS.jupiter.aliens.map(a=>Object.assign({}, a))},
    visita: null, proxVisita: 60*150, elefantes: ELEFANTES.map(n=>Object.assign({}, n)), vampiros: VAMPIROS.map(n=>Object.assign({}, n)), renos: RENOS.map(n=>Object.assign({}, n)), santa: Object.assign({}, SANTA), circo: CIRCO_NPCS.map(n=>Object.assign({}, n)), cantante: Object.assign({}, CANTANTE), canto: null, cantoT: -99999, conciertoDicho: -99999, ovacionT: -99999,
    balas: [], explosiones: [], disparoT: -9999, surfT: -9999, casaEstado: {}, cercaMueble: null, sentado: null, durmiendo: null, columpio: null, trepando: false, balon: {x:CANCHA.x, y:0, z:CANCHA.z, vx:0, vy:0, vz:0, gol:0}, goles: 0,
    trompetaT: -9999, hipoT: -9999, rugidoLeonT: -9999,
    saludos: {}, escena: null, srPopo: {bano: 0, visible: true, saludo: -9999}, cercaVeh: null, final: false, finalT: 0,
    aPrev: false, bPrev: false, salirPrev: false, avisoBano: -9999, ultimoChoque: -9999,
  };
  P.J.y = altura(P.J.x, P.J.z);
  for (const v of P.vehiculos) v.y = v.id==='barco' || v.id==='sub' || v.agua ? NIVEL_MAR : altura(v.x, v.z);
  for (const p of P.props) p.y = altura(p.x, p.z);
  for (const p of P.perros) p.y = altura(p.x, p.z);
  if (guardado) importar(P, guardado);
  return P;
}
function exportar(P){
  const prog = {};
  for (const k of ['banos','banderas','aros','familia','helipuertos','boyas','huevos','chivos','arosNoche','rocas','saturnianos','cristales','casas']) prog[k] = P.prog[k].slice();
  for (const k of ['rampa','santi','cofre','popo','luna','maracaibo','ovni','coroDicho']) prog[k] = P.prog[k];
  prog.rayos = P.prog.rayos;
  return {estrellas: P.estrellas.slice(), puntos: P.puntos, hamburguesas: P.hamburguesas, comidas: [...P.comidas], arepas: P.arepas, comidasArepas: [...P.comidasArepas], popitos: P.popitos.length, prog, gordura: P.gordura, monedas: P.monedas, zonasVistas: P.zonasVistas.slice(), hora: P.hora};
}
function importar(P, g){
  try{
    if (Array.isArray(g.estrellas)) P.estrellas = g.estrellas.filter(id=>MISIONES.some(m=>m.id===id));
    if (Number.isFinite(g.puntos)) P.puntos = g.puntos;
    if (Number.isFinite(g.hamburguesas)) P.hamburguesas = g.hamburguesas;
    if (Array.isArray(g.comidas)) P.comidas = new Set(g.comidas);
    if (Number.isFinite(g.arepas)) P.arepas = g.arepas;
    if (Number.isFinite(g.gordura)) P.gordura = clamp(g.gordura, 0, 6)|0;
    if (Number.isFinite(g.monedas)) P.monedas = Math.max(0, g.monedas|0);
    if (Number.isFinite(g.hora) && !NOCHE) P.hora = clamp(g.hora, 0, 1);
    if (Array.isArray(g.zonasVistas)) P.zonasVistas = g.zonasVistas.filter(z=>ZONAS[z]);
    if (Array.isArray(g.comidasArepas)) P.comidasArepas = new Set(g.comidasArepas);
    if (g.prog){ for (const k of ['banos','banderas','aros','familia','helipuertos','boyas','huevos','chivos','arosNoche','rocas','saturnianos','cristales','casas']) if (Array.isArray(g.prog[k])) P.prog[k] = g.prog[k].slice();
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
  P.puntos += 2000; P.monedas += 50;
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
    } else if (o.alto !== undefined && e.y !== undefined && e.y >= o.alto - 0.6){
      continue;                                                    /* sobre el techo de la casa no chocan sus paredes */
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
/* los techos se pisan: cada casa tiene una escalera en un costado; el techo es a dos aguas con la cumbrera a lo largo de z */
function techoAltura(c, x, z){
  const hx = c.w/2 + 0.6, hz = c.d/2 + 0.6;
  if (Math.abs(x-c.x) > hx || Math.abs(z-c.z) > hz) return -Infinity;
  return altura(c.x, c.z) + c.h + c.h*0.55*(1 - Math.abs(x-c.x)/hx);
}
const ESCALERAS = CASAS.concat(CASAS_MCBO).map(c=>{ const lado = Math.abs(Math.sin(c.puerta)) > 0.5 && Math.sin(c.puerta) < 0 ? 1 : -1; return {c, x: c.x + lado*(c.w/2 + 0.6), z: c.z, lado, base: altura(c.x, c.z), top: altura(c.x, c.z) + c.h}; });
function escaleraCerca(J){ for (const L of ESCALERAS) if (Math.hypot(J.x-L.x, J.z-L.z) < 1.2 && J.y >= L.base - 0.5 && J.y <= L.top + 0.5) return L; return null; }
/* lo que se puede pisar además del suelo: las cajas quietas y los techos (solo si ya se está a esa altura) */
function plataformaEn(P, x, z, y){
  let g = -Infinity;
  for (const p of P.props){ if (p.tipo!=='caja' || p.estado!=='quieto') continue; if (Math.abs(p.x-x) <= 0.78 && Math.abs(p.z-z) <= 0.78){ const top = p.y + 1.0; if (y >= top - 0.7 && top > g) g = top; } }
  for (const c of (NOCHE ? CASAS_MCBO : CASAS)){ const t = techoAltura(c, x, z); if (t > -Infinity && y >= t - 0.7 && t > g) g = t; }
  return g;
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
  let velMax = J.nadando ? 3.2 : (ent.b ? 19.8 : 6.2);                 /* con B se corre un 60% más rápido que antes */
  if (P.ganas && !J.nadando) velMax *= 0.72;                          /* con ganas de popo se camina apretado */
  if (P.gorilaT > 0) velMax *= 1.3;                                    /* el gorila corre más */
  else if (P.gordura > 0) velMax *= 1 - 0.05*P.gordura;                /* gordito se camina más lento */
  if (P.casa){ pasoEnCasa(P, ent, dx, dz, velMax, mag); return; }
  if (P.zona){ pasoEnZona(P, ent, dx, dz, velMax, mag); return; }
  if (P.paracaidas) velMax = 9;
  /* en el columpio: péndulo que se impulsa con la palanca; con A se salta */
  if (P.columpio){
    const C = P.columpio, c = COLUMPIOS[C.i];
    if (ent.aNuevo){ P.columpio = null; J.x = c.x; J.z = c.z + Math.sin(C.ang)*c.largo; J.y = c.py + c.pivote - Math.cos(C.ang)*c.largo - 0.4; J.vz = C.vel*c.largo*Math.cos(C.ang)*1.1; J.vx = 0; J.vy = 6 + Math.abs(C.vel)*1.5; J.suelo = false; evento(P, 'columpioSalta', {x:J.x, y:J.y, z:J.z, fuerte: Math.abs(C.vel) > 1.6}); if (Math.abs(C.vel) > 1.6 && !P.saludos.columpioAlto){ P.saludos.columpioAlto = true; P.monedas += 10; evento(P, 'columpioAlto', {x:J.x, y:J.y, z:J.z}); } return; }
    const empuje = ent.jy > 0.2 && Math.abs(C.ang) < 1.35 ? 2.6*Math.sign(C.vel || 1) : 0;
    C.vel += (-(GRAV/c.largo)*Math.sin(C.ang) - 0.12*C.vel + empuje)*DT; C.ang += C.vel*DT; C.ang = clamp(C.ang, -1.5, 1.5); C.t++;
    J.x = c.x; J.z = c.z + Math.sin(C.ang)*c.largo; J.y = c.py + c.pivote - Math.cos(C.ang)*c.largo - 0.55; J.ang = 0; J.vx = J.vz = J.vy = 0; J.mov = 0; J.suelo = true; J.nadando = false;
    P.cercaVeh = null; P.cercaPuerta = null; return;
  }
  if (!P.paracaidas && !J.nadando && J.suelo && ent.aNuevo){ for (let i=0;i<COLUMPIOS.length;i++){ const c = COLUMPIOS[i]; if (Math.hypot(J.x-c.x, J.z-c.z) < 1.4 && Math.abs(J.y-c.py) < 2){ P.columpio = {i, ang:0.15, vel:0, t:0}; evento(P, 'columpio', {i, x:c.x, y:c.py, z:c.z}); return; } } }
  /* en la escalera de una casa: con la palanca hacia arriba se trepa hasta el techo, hacia abajo se baja */
  { const L = !J.nadando && !P.paracaidas ? escaleraCerca(J) : null;
    if (L && (ent.jy > 0.2 || (P.trepando && ent.jy < -0.2) || (P.trepando && Math.abs(ent.jx) < 0.3 && J.y > L.base + 0.3))){
      P.trepando = true; J.x += (L.x - J.x)*0.3; J.z += (L.z - J.z)*0.3; J.vx = J.vz = J.vy = 0; J.mov = ent.jy > 0.2 || ent.jy < -0.2 ? 1.2 : 0; J.suelo = true; J.ang = Math.atan2(-L.lado, 0);
      J.y = clamp(J.y + (ent.jy > 0.2 ? 4.2 : ent.jy < -0.2 ? -4.2 : 0)*DT, L.base, L.top); J.fase += DT*6*(J.mov ? 1 : 0);
      if (J.y >= L.top - 0.01 && ent.jy > 0.2){ P.trepando = false; J.x = L.c.x + L.lado*(L.c.w/2 - 0.7); J.z = L.c.z; J.y = techoAltura(L.c, J.x, J.z); evento(P, 'techo', {x:J.x, y:J.y, z:J.z, nombre:L.c.nombre}); if (!P.saludos.techo){ P.saludos.techo = true; P.monedas += 10; } }
      else if (J.y <= L.base + 0.01 && ent.jy < -0.2) P.trepando = false;
      P.cercaVeh = null; P.cercaPuerta = null; return;
    }
    P.trepando = false; }
  const objx = dx*velMax*mag, objz = dz*velMax*mag;
  const k = J.suelo || J.nadando ? 0.18 : (P.paracaidas ? 0.08 : 0.04);
  J.vx += (objx - J.vx)*k; J.vz += (objz - J.vz)*k;
  J.mov = Math.hypot(J.vx, J.vz);
  const nx = J.x + J.vx*DT, nz = J.z + J.vz*DT;
  const m = moverChocando(J, nx, nz);
  const gNueva = Math.max(altura(m.x, m.z), plataformaEn(P, m.x, m.z, J.y));
  if (!J.nadando && gNueva - J.y > ESCALON && J.suelo){ J.vx *= 0.2; J.vz *= 0.2; }   /* pared */
  else { J.x = m.x; J.z = m.z; if (m.choco){ J.vx *= 0.5; J.vz *= 0.5; } }
  const g = Math.max(altura(J.x, J.z), plataformaEn(P, J.x, J.z, J.y));
  if (g < NIVEL_MAR - 1.1 && J.y <= NIVEL_MAR + 0.3){
    if (P.paracaidas){ P.paracaidas = false; evento(P, 'paracaidasSuelo', {agua:true}); }
    if (!J.nadando){ J.nadando = true; J.suelo = false; J.vy = 0; evento(P, 'chapoteo', {x:J.x, z:J.z}); }
    J.y = NIVEL_MAR - 0.35 + ola(J.x, J.z, P.t*DT)*0.5;
  } else if (J.nadando){
    J.nadando = false; J.suelo = true; J.y = Math.max(J.y, g);
  }
  if (!J.nadando){
    if (J.suelo && ent.aNuevo){ J.vy = P.gorilaT > 0 ? 13 : 9.8 - 0.4*P.gordura; J.suelo = false; evento(P, 'salto'); }
    if (J.suelo){
      if (g >= J.y - 0.8){ J.vy = 0; J.y = g; }
      else { J.suelo = false; J.vy = 0; }
    }
    if (!J.suelo){
      J.vy = P.paracaidas ? Math.max(J.vy - GRAV*DT, -6.5) : J.vy - GRAV*DT; J.y += J.vy*DT;
      if (J.y <= g){ J.y = g; J.suelo = true; if (J.vy < -8 && !P.paracaidas) evento(P, 'aterriza'); J.vy = 0; if (P.paracaidas){ P.paracaidas = false; evento(P, 'paracaidasSuelo', {agua:false}); } }
    }
  }
  J.fase += J.mov*DT*2.2;
  /* ¿hay un vehículo al lado? */
  P.cercaVeh = null; let md = 4.6;
  for (const v of P.vehiculos){
    const d = Math.hypot(v.x-J.x, v.z-J.z) - v.radio;
    if (d < md && Math.abs(v.y - J.y) < 4){ md = d; P.cercaVeh = v; }
  }
  /* ¿o una puerta? (la puerta gana: A entra en vez de montar) */
  P.cercaPuerta = null;
  for (const I of INTERIORES) if (Math.hypot(I.ex-J.x, I.ez-J.z) < 2.3 && Math.abs(altura(I.ex, I.ez) - J.y) < 3){ P.cercaPuerta = I; P.cercaVeh = null; break; }
}
/* dentro de una casa: piso plano, paredes, muebles y la puerta para salir */
function pasoEnCasa(P, ent, dx, dz, velMax, mag){
  const J = P.J, I = P.casa;
  if (P.sentado){ P.sentado.t++; if (mag > 0.3 && P.sentado.t > 10){ P.sentado = null; evento(P, 'levanta'); } else { J.mov = 0; J.vx = J.vz = 0; J.y = I.y; J.suelo = true; J.fase += DT*0.5; P.cercaMueble = null; P.cercaPuerta = null; return; } }
  const objx = dx*velMax*mag, objz = dz*velMax*mag;
  J.vx += (objx - J.vx)*0.18; J.vz += (objz - J.vz)*0.18;
  J.mov = Math.hypot(J.vx, J.vz);
  const m = moverEnCasa(J, J.x + J.vx*DT, J.z + J.vz*DT, I);
  J.x = m.x; J.z = m.z; if (m.choco){ J.vx *= 0.5; J.vz *= 0.5; }
  J.nadando = false;
  const g = I.y;
  if (J.suelo && ent.aNuevo){ J.vy = P.gorilaT > 0 ? 11 : 9.0; J.suelo = false; evento(P, 'salto'); }
  if (!J.suelo){
    J.vy -= GRAV*DT; J.y += J.vy*DT;
    if (J.y > g + I.alto - 2.0){ J.y = g + I.alto - 2.0; J.vy = Math.min(J.vy, 0); }
    if (J.y <= g){ J.y = g; J.suelo = true; J.vy = 0; }
  } else J.y = g;
  J.fase += J.mov*DT*2.2;
  P.cercaVeh = null;
  P.cercaPuerta = Math.hypot(I.px-J.x, I.pz-J.z) < 2.4 ? I : null;
  P.cercaMueble = P.cercaPuerta ? null : muebleCerca(P);
}
function pasoEnZona(P, ent, dx, dz, velMax, mag){
  const J = P.J, Z = P.zona;
  const objx = dx*velMax*mag, objz = dz*velMax*mag, k = J.suelo ? 0.18 : 0.06;
  J.vx += (objx - J.vx)*k; J.vz += (objz - J.vz)*k;
  J.mov = Math.hypot(J.vx, J.vz);
  let nx = J.x + J.vx*DT, nz = J.z + J.vz*DT, choco = false;
  const d = Math.hypot(nx-Z.x, nz-Z.z); if (d > Z.r - 1.5){ nx = Z.x + (nx-Z.x)/d*(Z.r-1.5); nz = Z.z + (nz-Z.z)/d*(Z.r-1.5); choco = true; }
  const nave = P.vehiculos.find(v=>v.id==='nave');
  for (const o of Z.rocas.concat([{x:nave.x, z:nave.z, r:nave.radio}])){
    const ox = nx-o.x, oz = nz-o.z, od = Math.hypot(ox, oz), rr = o.r + J.radio;
    if (od < rr){ if (od > 1e-6){ nx = o.x + ox/od*rr; nz = o.z + oz/od*rr; } else nx += rr; choco = true; }
  }
  J.x = nx; J.z = nz; if (choco){ J.vx *= 0.5; J.vz *= 0.5; }
  J.nadando = false;
  if (J.suelo && ent.aNuevo){ J.vy = P.gorilaT > 0 ? 12 : 9.8; J.suelo = false; evento(P, 'salto'); }
  if (!J.suelo){ J.vy -= GRAV*Z.grav*DT; J.y += J.vy*DT; if (J.y <= Z.y){ J.y = Z.y; J.suelo = true; J.vy = 0; } }
  else J.y = Z.y;
  J.fase += J.mov*DT*2.2;
  P.cercaPuerta = null;
  P.cercaVeh = Math.hypot(nave.x-J.x, nave.z-J.z) - nave.radio < 4.6 ? nave : null;
}
/* llegar a un planeta: la nave se posa en su plataforma y el jugador puede bajarse a pasear */
function irAZona(P, id){
  const Z = ZONAS[id], v = P.vehiculos.find(v=>v.id==='nave');
  P.zona = Z; P.escena = null;
  v.x = Z.nave.x; v.z = Z.nave.z; v.y = Z.y; v.vy = 0; v.vel = 0; v.suelo = true; v.aire = false; v.ang = 0; v.cabeceo = 0;
  P.J.x = v.x; P.J.y = v.y; P.J.z = v.z; P.J.ang = v.ang;
  const primera = !P.zonasVistas.includes(id);
  if (primera){ P.zonasVistas.push(id); P.puntos += 500; }
  evento(P, 'zonaEntra', {id, nombre:Z.nombre, primera});
  if (id !== 'luna' || primera) decir(P, Z.frase === 'luna' ? (NOCHE ? 'marte' : 'luna') : Z.frase);
}
function salirZona(P){
  const Z = P.zona, v = P.vehiculos.find(v=>v.id==='nave'); if (!Z) return;
  P.zona = null; P.zonaSalidaT = P.t;
  /* la nave reaparece a un costado del planeta, mirando hacia fuera: así, aunque se mantenga A, no se vuelve a chocar con él */
  const B = Z.planeta; v.x = B.x + B.r + 40; v.z = B.z; v.y = B.y - B.r*0.3; v.vy = 0; v.vel = 0; v.suelo = false; v.aire = true; v.ang = Math.PI/2; v.cabeceo = 0;
  P.J.x = v.x; P.J.y = v.y; P.J.z = v.z;
  P.espacio = true;
  evento(P, 'zonaSale', {id:Z.id});
}
function entrarCasa(P, I){
  const J = P.J;
  P.casa = I; J.x = I.ix; J.z = I.iz; J.y = I.y; J.vx = J.vz = J.vy = 0; J.suelo = true; J.nadando = false; J.ang = envolver(I.ang + Math.PI);
  P.cercaPuerta = null; P.cercaVeh = null;
  if (!P.prog.casas.includes(I.id)){ P.prog.casas.push(I.id); P.monedas += 5; }
  evento(P, 'casaEntra', {id:I.id, nombre:I.nombre, castillo:I.castillo, circo:I.circo});
  if (I.circo) decir(P, 'circo');
  else if (I.castillo){ if (!P.castilloDicho){ P.castilloDicho = true; P.puntos += 300; decir(P, 'castillo'); } }
  else decir(P, 'casa');
}
function salirCasa(P){
  const J = P.J, I = P.casa; if (!I) return;
  P.casa = null; J.x = I.ex; J.z = I.ez; J.y = altura(I.ex, I.ez); J.vx = J.vz = J.vy = 0; J.suelo = true; J.nadando = false; J.ang = I.ang;
  P.cercaPuerta = null;
  for (const p of P.perros) if (p.sigue){ p.x = J.x + (azar()-0.5)*2; p.z = J.z + 1.5 + azar(); p.y = altura(p.x, p.z); }
  evento(P, 'casaSale', {id:I.id});
}
function montar(P, v){
  P.veh = v; P.J.suelo = true; P.J.nadando = false; P.J.vx = P.J.vz = 0;
  P.J.x = v.x; P.J.z = v.z; P.J.y = v.y; P.J.ang = v.ang;
  P.cercaVeh = null;
  evento(P, 'montar', {id: v.id});
  if (v.id==='ovni') decir(P, 'ovni');
  else if (v.id==='avion' || v.id==='heli' || v.id==='nave' || v.id==='ptero') decir(P, 'volar');
  else if (v.id==='barco' || v.id==='motoagua') decir(P, 'barco');
  else if (v.id==='tabla') decir(P, 'surf');
  else if (v.id==='tanque') decir(P, 'tanque');
  else if (v.id==='dino') decir(P, 'dino');
}
function puedeBajar(P){
  const v = P.veh; if (!v) return false;
  if (Math.abs(v.vel) > 4) return false;
  if ((v.id==='avion' || v.id==='heli' || v.id==='nave' || v.id==='ovni') && v.aire) return false;
  if (v.id==='sub' && v.y < NIVEL_MAR - 0.9) return false;
  if (v.agua && v.y > NIVEL_MAR + ola(v.x, v.z, P.t*DT) + 1.2) return false;   /* solo si está en el aire, no sobre una ola alta */
  return true;
}
function saltarParacaidas(P){
  const v = P.veh, J = P.J;
  P.veh = null; J.x = v.x; J.z = v.z; J.y = v.y - 1.5; J.vx = Math.sin(v.ang)*4; J.vz = Math.cos(v.ang)*4; J.vy = -1; J.suelo = false; J.nadando = false;
  P.paracaidas = true; P.avionSolo = {t:0};
  evento(P, 'paracaidas', {x:J.x, y:J.y, z:J.z}); decir(P, 'paracaidas');
}
function intentarBajar(P){
  const v = P.veh; if (!v) return;
  if (v.id==='avion' && v.aire && v.y - Math.max(altura(v.x, v.z), NIVEL_MAR) > 14){ saltarParacaidas(P); return; }
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
  J.nadando = !P.zona && enAgua(x, z); J.suelo = !J.nadando;
  J.y = P.zona ? P.zona.y : J.nadando ? NIVEL_MAR - 0.35 : altura(x, z);
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
  nave:  {vmax: 48, acc: 14, freno: 14, giro: 1.4, reversa: 0, turbo: 1.4, empuje: 40, techo: 1700},
  tanque: {vmax: 14, acc: 8,  freno: 14, giro: 1.4, reversa: 6, turbo: 1},
  tabla:  {vmax: 7.5, acc: 6, freno: 8, giro: 2.2, reversa: 2, turbo: 1.2},   /* remando es lenta: la ola es la que la lleva */
  dino:  {vmax: 18, acc: 24, freno: 30, giro: 2.6, reversa: 3, turbo: 1.35},
  ptero: {vmax: 30, acc: 10, freno: 10, giro: 2.1, reversa: 6, turbo: 1.4, vertical: 8, techo: 200},
  ovni:  {vmax: 46, acc: 16, freno: 16, giro: 2.6, reversa: 12, turbo: 1.6, vertical: 13, techo: 420},
  motonieve: {vmax: 26, acc: 12, freno: 20, giro: 2.3, reversa: 5, turbo: 1.35},
  esquis: {vmax: 30, acc: 3, freno: 14, giro: 2.4, reversa: 0, turbo: 1.2},
};
function pasoVehiculo(P, v, ent){
  const C = CARACT[v.id];
  const turbo = ent.b && v.id!=='sub' && v.id!=='tanque';
  if (v.id==='tanque') dispararTanque(P, v, ent);
  v.turbo = turbo ? Math.min(1, v.turbo+0.1) : Math.max(0, v.turbo-0.05);
  const fx = Math.sin(v.ang), fz = Math.cos(v.ang);
  if (v.id==='avion' && v.aire) return pasoAvionAire(P, v, ent, C);
  if (v.id==='sub') return pasoSub(P, v, ent, C);
  if (v.id==='heli' || v.id==='ptero' || v.id==='ovni') return pasoHeli(P, v, ent, C);
  if (v.id==='nave') return pasoNave(P, v, ent, C);
  const esAgua = v.id==='barco' || v.agua, esDino = v.id==='dino';
  if (esDino && ent.b && P.t - P.rugidoT > 90){ P.rugidoT = P.t; evento(P, 'rugido', {x:v.x, y:v.y, z:v.z}); }
  /* en tierra o sobre el agua: gas, freno, marcha atrás y volante */
  const sobreNieve = v.nieve && altura(v.x, v.z) > 44;
  const enRuta = sobreNieve || cercaRuta(v.x, v.z).d < RUTA.ancho/2 + 1 || distPista(v.x, v.z) < PISTA.ancho/2 || esAgua || esDino || enPuente(v.x, v.z) >= 0 || Math.hypot(v.x-PUEBLO.x, v.z-PUEBLO.z) < 130;
  /* la tabla: pendiente del agua bajo la tabla (positiva = la ola viene por detrás y empuja) */
  if (v.id==='tabla'){ const tt = P.t*DT; v.pend = (ola(v.x - fx*3, v.z - fz*3, tt) - ola(v.x + fx*3, v.z + fz*3, tt))/6; }
  const vmax = C.vmax*(enRuta ? 1 : (v.nieve ? 0.4 : 0.68))*(turbo ? C.turbo : 1)*(v.id==='tabla' && v.pend > -0.03 ? 1.7 : 1);
  if (v.id==='esquis'){ const adel = altura(v.x + fx*3, v.z + fz*3), atr = altura(v.x - fx*3, v.z - fz*3); v.vel += clamp((atr-adel)/6, -1, 1)*(sobreNieve ? 16 : 6)*DT; }   /* los esquís bajan solos la pendiente */
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
      /* la tabla baja las olas: si el agua de atrás está más alta que la de adelante, empuja */
      if (v.id==='tabla' && v.suelo){ const pend = v.pend; v.vel += clamp(pend, -0.5, 0.5)*(pend > 0 ? 44 : 14)*DT; v.surf = v.vel > 8.2 && Math.hypot(v.x-OLAS.x, v.z-OLAS.z) < OLAS.r ? (v.surf||0) + 1 : 0; if (v.surf === 45 && P.t - P.surfT > 60*6){ P.surfT = P.t; const primera = !P.saludos.surf; P.saludos.surf = true; if (primera){ P.monedas += 20; P.puntos += 300; } evento(P, 'surfea', {x:v.x, y:v.y, z:v.z, primera}); } }
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
/* el tanque: con B dispara una bala de cañón que estalla en confeti y manda a volar lo que haya cerca */
function dispararTanque(P, v, ent){
  if (!ent.b || P.t - P.disparoT < 45) return;
  P.disparoT = P.t;
  const fx = Math.sin(v.ang), fz = Math.cos(v.ang);
  P.balas.push({x: v.x + fx*3.4, y: v.y + 2.3, z: v.z + fz*3.4, vx: fx*40, vy: 8, vz: fz*40, t:0});
  evento(P, 'disparo', {x: v.x + fx*3.4, y: v.y + 2.3, z: v.z + fz*3.4});
}
function pasoBalas(P){
  P.explosiones.length = 0;
  for (let i=P.balas.length-1;i>=0;i--){
    const b = P.balas[i]; b.t++;
    b.vy -= GRAV*0.8*DT; b.x += b.vx*DT; b.y += b.vy*DT; b.z += b.vz*DT;
    const g = Math.max(altura(b.x, b.z), NIVEL_MAR);
    if (b.y <= g || b.t > 60*5 || Math.abs(b.x) > LIMITE || Math.abs(b.z) > LIMITE){
      P.balas.splice(i, 1);
      const agua = altura(b.x, b.z) < NIVEL_MAR - 0.5;
      P.explosiones.push({x:b.x, y:g, z:b.z});
      evento(P, 'explosion', {x:b.x, y:g, z:b.z, agua, d: Math.hypot(b.x-P.J.x, b.z-P.J.z)});
    }
  }
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
  if (P.zona){
    const Z = P.zona, g = Z.y;
    if (ent.a){ v.vy = Math.min(v.vy + C.empuje*DT, 38); if (v.suelo){ v.suelo = false; v.aire = true; evento(P, 'despegue'); } if (P.t % 2 === 0) evento(P, 'fuego', {x:v.x, y:v.y, z:v.z}); }
    else if (!v.suelo) v.vy = Math.max(v.vy - 12*DT, -12);
    if (v.suelo){ v.vy = 0; v.y = g; v.vel = 0; v.cabeceo = lerp(v.cabeceo, 0, 0.1); return; }
    v.y = v.y + v.vy*DT;
    const objetivo = ent.jy*C.vmax*0.5; v.vel += (objetivo - v.vel)*0.03;
    v.giro = lerp(v.giro, -ent.jx, 0.1); v.ang = envolver(v.ang + v.giro*C.giro*DT);
    const fx = Math.sin(v.ang), fz = Math.cos(v.ang);
    let nx = v.x + fx*v.vel*DT, nz = v.z + fz*v.vel*DT; const d = Math.hypot(nx-Z.x, nz-Z.z); if (d > Z.r - 6){ nx = Z.x + (nx-Z.x)/d*(Z.r-6); nz = Z.z + (nz-Z.z)/d*(Z.r-6); v.vel *= 0.5; }
    v.x = nx; v.z = nz;
    if (v.y <= g){ v.y = g; v.suelo = true; v.aire = false; v.vy = 0; evento(P, 'aterriza', {id:'nave'}); }
    if (v.y > Z.y + 80) salirZona(P);
    return;
  }
  const g = Math.max(altura(v.x, v.z), NIVEL_MAR + 0.3);
  if (ent.a){ v.vy = Math.min(v.vy + C.empuje*DT, 38); if (v.suelo){ v.suelo = false; v.aire = true; evento(P, 'despegue'); } if (P.t % 2 === 0) evento(P, 'fuego', {x:v.x, y:v.y, z:v.z}); }
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
  for (const B of [LUNA, SATURNO, JUPITER]){
    const dl = Math.hypot(v.x-B.x, v.y-B.y, v.z-B.z), abajo = Math.hypot(v.x-B.x, v.y-(B.y-B.r), v.z-B.z) < 60;
    if (dl < B.r + 14 && !abajo){
      const k = (B.r + 14)/Math.max(dl, 0.01);
      v.x = B.x + (v.x-B.x)*k; v.y = B.y + (v.y-B.y)*k; v.z = B.z + (v.z-B.z)*k;
      if (v.y < B.y && v.vy > 0) v.vy = -4; else if (v.y >= B.y && v.vy < 0) v.vy = 2;
      v.vel *= -0.3; evento(P, 'rebote');
    }
  }
  /* Saturno y Júpiter: al llegar a su cara de abajo, la nave se posa y se puede pasear */
  if (!P.escena && P.t - P.zonaSalidaT > 60*6) for (const id of ['saturno', 'jupiter']){
    const B = ZONAS[id].planeta;
    if (Math.hypot(v.x-B.x, v.y-(B.y-B.r), v.z-B.z) < 60){ P.escena = {tipo:'planeta', zona:id, t:0, dur:150}; v.vy = 0; v.vel = 0; evento(P, 'planetaLlega', {id, nombre:ZONAS[id].nombre}); return; }
  }
  /* la luna: al llegar a su cara de abajo, se posa y se planta la bandera */
  if (NOCHE && !P.escena && !P.prog.ovni && Math.hypot(v.x-OVNI.x, v.y-OVNI.y, v.z-OVNI.z) < 42){
    P.escena = {tipo:'ovni', t:0, dur:360}; v.vy = 0; v.vel = 0;
    evento(P, 'ovniLlega'); return;
  }
  if (!P.escena && P.t - P.zonaSalidaT > 60*6 && Math.hypot(v.x-LUNA.x, v.y-(LUNA.y-LUNA.r), v.z-LUNA.z) < 60){
    P.escena = {tipo:'luna', t:0, dur: P.prog.luna ? 120 : 300}; v.vy = 0; v.vel = 0;
    evento(P, 'lunaLlega'); if (!P.prog.luna) decir(P, NOCHE ? 'marte' : 'luna');
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
    if (P.veh || P.casa || P.zona){ p.dentro = true; return; }
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
    if (P.veh || P.casa || P.zona){ p.dentro = true; return; }
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
  P.comidas.add(h.id); P.hamburguesas++; P.puntos += 100; P.monedas += 2;
  P.popo = Math.min(1, P.popo + 0.34);
  engordar(P);
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
/* cada hamburguesa o arepa engorda un poquito (hasta 6); al hacer popo se queda flaquito un rato */
function engordar(P){
  P.gordura = Math.min(6, P.gordura + 1); P.flacoT = 0;
  evento(P, 'gordura', {n:P.gordura});
  if (P.gordura >= 4 && P.t - P.gordoDicho > 60*30){ P.gordoDicho = P.t; decir(P, 'gordo'); }
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
  /* la vereda del lago: al pasear por ella se dice lo de la brisa (una vez cada rato) */
  if (!P.veh && !P.casa && P.t - P.veredaT > 60*60*5 && cercaVereda(J.x, J.z, 4)){ P.veredaT = P.t; evento(P, 'vereda'); decir(P, 'vereda'); }
  /* las monedas: se recogen y vuelven a aparecer a los 3 minutos */
  if (!P.casa && !P.zona) for (const m of MONEDAS){
    if (m.y < -100) continue;
    const tm = P.monedasT[m.id]; if (tm !== undefined && P.t - tm < 60*180) continue;
    const dx = m.x-J.x, dz = m.z-J.z, dy = m.y-(J.y+1);
    if (dx*dx+dz*dz+dy*dy < (alcance+0.6)*(alcance+0.6)){ P.monedasT[m.id] = P.t; ganarMonedas(P, m.valor, m.x, m.y, m.z); P.puntos += 20; }
  }
  /* las bananas de la isla: se comen y vuelven a crecer */
  if (!P.casa) for (const b of BANANAS){
    const te = P.bananasT[b.id]; if (te !== undefined && P.t - te < 60*45) continue;
    const dx = b.x-J.x, dz = b.z-J.z, dy = b.y-(J.y+1);
    if (dx*dx+dz*dz+dy*dy < alcance*alcance) comerBanana(P, b);
  }
}
function comerBanana(P, b){
  P.bananasT[b.id] = P.t; P.puntos += 200; P.monedas += 5;
  const nueva = P.gorilaT <= 0;
  P.gorilaT = 60*60;
  evento(P, 'banana', {id:b.id, x:b.x, y:b.y, z:b.z, nueva});
  if (nueva){ evento(P, 'gorila', {on:true}); decir(P, 'gorila'); }
}
function pasoGorila(P){
  if (P.gorilaT > 0){ P.gorilaT--; if (P.gorilaT === 0){ evento(P, 'gorila', {on:false}); decir(P, 'gorilaFin'); } }
  if (P.flacoT > 0) P.flacoT--;
}
/* ---- los dinosaurios sueltos pasean por su valle ---- */
function pasoDinos(P){
  const J = P.J;
  for (const d of P.dinos){
    const def = DINOS[d.id];
    if (d.espera > 0){ d.espera--; d.mov = 0; d.fase += DT; continue; }
    if (!d.obj || Math.hypot(d.obj.x-d.x, d.obj.z-d.z) < 2.5){
      let k = 0, ox, oz;
      do { const a = azar()*6.283, r = 6 + azar()*(VALLE_DINOS.r-6); ox = VALLE_DINOS.x + Math.cos(a)*r; oz = VALLE_DINOS.z + Math.sin(a)*r; k++; }
      while (k < 12 && (altura(ox, oz) < 1.5 || cercaRuta(ox, oz).d < 12));
      d.obj = {x:ox, z:oz}; d.espera = 60*(1 + azar()*4);
      if (def.tipo==='trex' && P.t - P.rugidoDinoT > 60*9 && Math.hypot(d.x-J.x, d.z-J.z) < 70){ P.rugidoDinoT = P.t; evento(P, 'rugidoDino', {x:d.x, y:altura(d.x, d.z), z:d.z}); }
      continue;
    }
    const vel = (def.tipo==='trex' ? 3.4 : def.tipo==='trice' ? 2.4 : 1.8)*(0.7 + 0.3*def.esc);
    const dx = d.obj.x-d.x, dz = d.obj.z-d.z;
    d.ang = envolver(d.ang + envolver(Math.atan2(dx, dz) - d.ang)*0.05);
    d.x += Math.sin(d.ang)*vel*DT; d.z += Math.cos(d.ang)*vel*DT; d.mov = vel; d.fase += vel*DT*1.6;
  }
  /* a pie no se atraviesan: empujan suavecito */
  if (!P.veh && !P.casa && !P.zona) for (const d of P.dinos){
    let dx = J.x-d.x, dz = J.z-d.z, dist = Math.hypot(dx, dz); const rr = d.r + J.radio;
    if (dist < 1e-3){ dx = 0; dz = 1; dist = 1; }
    if (dist < rr && Math.abs(altura(d.x, d.z) - J.y) < 4){ J.x = d.x + dx/dist*rr; J.z = d.z + dz/dist*rr; }
  }
  if (!P.casa && !P.zona && P.t - P.dinosDicho > 60*60*4 && Math.hypot(J.x-VALLE_DINOS.x, J.z-VALLE_DINOS.z) < VALLE_DINOS.r + 14){ P.dinosDicho = P.t; evento(P, 'dinosVistos'); decir(P, 'dinos'); }
}
/* ---- los paseantes: elefantes, vampiros, renos, payasos y extraterrestres dan vueltas por su casa ---- */
function pasear(n, cx, cz, r, valido){
  if (n.quieto){ n.fase += DT; n.mov = 0; return; }
  if (n.espera > 0){ n.espera--; n.mov = 0; n.fase += DT; return; }
  if (!n.obj || Math.hypot(n.obj.x-n.x, n.obj.z-n.z) < 2){
    let k = 0, ox, oz;
    do { const a = azar()*6.283, d = 4 + azar()*(r-4); ox = cx + Math.cos(a)*d; oz = cz + Math.sin(a)*d; k++; } while (k < 12 && valido && !valido(ox, oz));
    n.obj = {x:ox, z:oz}; n.espera = 60*(0.5 + azar()*3); return;
  }
  const dx = n.obj.x-n.x, dz = n.obj.z-n.z;
  n.ang = envolver(n.ang + envolver(Math.atan2(dx, dz) - n.ang)*0.06 + (n.borracho ? Math.sin(n.fase*2.5)*0.05 : 0));
  n.x += Math.sin(n.ang)*n.vel*DT; n.z += Math.cos(n.ang)*n.vel*DT; n.mov = n.vel; n.fase += n.vel*DT*1.5;
}
const enTierra = (x, z)=> altura(x, z) > 1.5;
function pasoBichos(P){
  const J = P.J;
  const cercaDe = (x, z, d)=> Math.hypot(x-J.x, z-J.z) < d;
  if (cercaDe(ISLA_ELEFANTES.x, ISLA_ELEFANTES.z, 160)){
    for (const n of P.elefantes) pasear(n, ISLA_ELEFANTES.x, ISLA_ELEFANTES.z, ISLA_ELEFANTES.r-8, enTierra);
    if (P.t - P.trompetaT > 60*12 && cercaDe(ISLA_ELEFANTES.x, ISLA_ELEFANTES.z, 70)){ P.trompetaT = P.t; const n = P.elefantes[Math.floor(azar()*P.elefantes.length)]; evento(P, 'trompeta', {x:n.x, y:altura(n.x, n.z), z:n.z}); }
  }
  if (cercaDe(ISLA_VAMPIROS.x, ISLA_VAMPIROS.z, 160)){
    for (const n of P.vampiros) pasear(n, ISLA_VAMPIROS.x, ISLA_VAMPIROS.z, ISLA_VAMPIROS.r-10, enTierra);
    if (P.t - P.hipoT > 60*7 && cercaDe(ISLA_VAMPIROS.x, ISLA_VAMPIROS.z, 60)){ P.hipoT = P.t; const n = P.vampiros[Math.floor(azar()*P.vampiros.length)]; evento(P, 'hipo', {x:n.x, y:altura(n.x, n.z), z:n.z}); }
  }
  if (cercaDe(MONTANA.x, MONTANA.z, 160)) for (const n of P.renos) pasear(n, MONTANA.x, MONTANA.z, 30, (x, z)=>altura(x, z) > 46 && Math.hypot(x-(MONTANA.x-14), z-(MONTANA.z+12)) > 9);
  P.santa.fase += DT;
  if (P.casa && P.casa.circo){
    const I = P.casa;
    for (const n of P.circo){ if (n.tipo==='jirafa') pasear(n, I.x, I.z, 13, (x, z)=>Math.hypot(x-I.x, z-I.z) > 9); else pasear(n, I.x, I.z, 8.5); }
    if (P.t - P.rugidoLeonT > 60*14){ P.rugidoLeonT = P.t; const l = P.circo.find(n=>n.tipo==='leon'); evento(P, 'rugidoLeon', {x:l.x, y:I.y, z:l.z}); }
  }
  if (P.zona) for (const n of P.aliens[P.zona.id]) pasear(n, P.zona.x, P.zona.z, P.zona.r-16, (x, z)=>!P.zona.rocas.some(o=>Math.hypot(x-o.x, z-o.z) < o.r+1.5));
}
/* los extraterrestres visitan la Tierra de vez en cuando: baja un ovni cerca, pasean un rato y se van */
function pasoVisita(P){
  const J = P.J;
  if (!P.visita){
    if (P.t >= P.proxVisita && !P.casa && !P.zona && !P.escena && !P.veh){
      const a = azar()*6.283, x = J.x + Math.cos(a)*26, z = J.z + Math.sin(a)*26;
      if (altura(x, z) > 1.5 && !enAgua(x, z)){
        const tipo = ['gris','anillo','blob'][Math.floor(azar()*3)], info = ALIEN_INFO[tipo];
        P.visita = {t:0, x, z, y: altura(x, z) + 70, tipo, fase:'baja', aliens: [0,1].map(i=>npc('alien', info.nombre, x + (i ? 3 : -3), z + 2, {r: 0.9, vel: 1.6, frase: info.frase, monedas: 20, alien: tipo, visita: true, id: i}))};
        evento(P, 'visitaLlega', {x, z, tipo});
      } else P.proxVisita = P.t + 60*20;
    }
    return;
  }
  const V = P.visita; V.t++;
  const g = altura(V.x, V.z);
  if (V.fase==='baja'){ V.y = lerp(V.y, g + 2.6, 0.03); if (V.t > 200){ V.fase = 'pasea'; V.t = 0; evento(P, 'visitaBaja', {x:V.x, z:V.z}); } }
  else if (V.fase==='pasea'){ for (const n of V.aliens) pasear(n, V.x, V.z, 12, enTierra); if (V.t > 60*40){ V.fase = 'sube'; V.t = 0; evento(P, 'visitaSeVa', {x:V.x, z:V.z}); } }
  else { V.y += 30*DT; if (V.y > g + 120){ P.visita = null; P.proxVisita = P.t + 60*(150 + azar()*120); } }
}
/* el avión sigue solo un ratito después del salto y vuelve a la pista */
function pasoAvionSolo(P){
  const S = P.avionSolo; if (!S) return;
  const v = P.vehiculos.find(v=>v.id==='avion'), def = VEHICULOS_DEF.find(d=>d.id==='avion');
  S.t++;
  const fx = Math.sin(v.ang), fz = Math.cos(v.ang);
  v.x = clamp(v.x + fx*v.vel*DT, -LIMITE, LIMITE); v.z = clamp(v.z + fz*v.vel*DT, -LIMITE, LIMITE); v.y += 2*DT;
  if (S.t > 60*7 || Math.abs(v.x) >= LIMITE || Math.abs(v.z) >= LIMITE){
    v.x = def.x; v.z = def.z; v.ang = def.ang; v.y = altura(v.x, v.z); v.vel = 0; v.vy = 0; v.suelo = true; v.aire = false; v.cabeceo = 0;
    P.avionSolo = null; evento(P, 'avionVuelve');
  }
}
/* saludar a los bichos: a pie, cerquita, cada tanto; dan monedas y dicen su frase */
function npcsCerca(P){
  const J = P.J, lista = [];
  if (P.zona){ for (const n of P.aliens[P.zona.id]) lista.push(n); return lista; }
  if (P.casa){ if (P.casa.circo) for (const n of P.circo) lista.push(n); return lista; }
  if (P.visita && P.visita.fase==='pasea') for (const n of P.visita.aliens) lista.push(n);
  if (Math.hypot(J.x-ISLA_ELEFANTES.x, J.z-ISLA_ELEFANTES.z) < 90) for (const n of P.elefantes) lista.push(n);
  if (Math.hypot(J.x-ISLA_VAMPIROS.x, J.z-ISLA_VAMPIROS.z) < 90) for (const n of P.vampiros) lista.push(n);
  if (Math.hypot(J.x-MONTANA.x, J.z-MONTANA.z) < 90){ for (const n of P.renos) lista.push(n); lista.push(P.santa); }
  if (P.pj !== 'fernando' && Math.hypot(J.x-ISLA_CONCIERTO.x, J.z-ISLA_CONCIERTO.z) < 90) lista.push(P.cantante);
  return lista;
}
function revisarSaludosNPC(P){
  if (P.veh || P.escena) return;
  const J = P.J, y = P.zona ? P.zona.y : P.casa ? P.casa.y : null;
  for (const n of npcsCerca(P)){
    if (P.t - n.saludoT < 60*20) continue;
    if (Math.hypot(n.x-J.x, n.z-J.z) > n.r + 1.6) continue;
    if (y === null && Math.abs(altura(n.x, n.z) - J.y) > 4) continue;
    n.saludoT = P.t;
    const primera = !P.saludos['npc_'+n.tipo+(n.id||'')+(n.zona||'')];
    P.saludos['npc_'+n.tipo+(n.id||'')+(n.zona||'')] = true;
    const monedas = primera ? n.monedas : Math.ceil(n.monedas/4);
    P.monedas += monedas; P.puntos += 100;
    evento(P, 'saludoNPC', {bicho:n.tipo, nombre:n.nombre, texto:n.frase, monedas, x:n.x, y: y === null ? altura(n.x, n.z) : y, z:n.z, alien:n.alien});
    if (n.canta) empezarCanto(P, 'npc'); else evento(P, 'hablar', {texto:n.frase, quien:n.nombre, pj:'npc_'+n.tipo});
    if (n.zona==='saturno' && !P.prog.saturnianos.includes(n.id)){ P.prog.saturnianos.push(n.id); evento(P, 'saturniano', {total:P.prog.saturnianos.length}); if (P.prog.saturnianos.length >= 4) darEstrella(P, 'saturno'); }
  }
}
/* la cancha: un balón que se patea corriendo contra él (con B, patadón), rebota en los bordes y entra por las porterías */
function pasoBalon(P, ent){
  const B = P.balon, J = P.J, C = CANCHA;
  if (Math.abs(J.x-C.x) > 160 || Math.abs(J.z-C.z) > 160) return;
  if (B.gol){ if (--B.gol <= 0){ B.x = C.x; B.z = C.z; B.y = altura(C.x, C.z) + 0.45; B.vx = B.vz = B.vy = 0; } return; }
  /* patadas: a pie, con los vehículos y con las explosiones del tanque */
  const pat = [];
  if (!P.veh && !P.casa && !P.zona) pat.push({x:J.x, y:J.y, z:J.z, r:1.25, dx:Math.sin(J.ang), dz:Math.cos(J.ang), fuerza: 6 + J.mov*1.1 + (ent.b ? 9 : 0), alto: ent.b ? 5 : 2 + J.mov*0.15, id:'pie'});
  else if (P.veh && !P.zona) pat.push({x:P.veh.x, y:P.veh.y, z:P.veh.z, r:P.veh.radio + 0.8, dx:Math.sin(P.veh.ang), dz:Math.cos(P.veh.ang), fuerza: 8 + Math.abs(P.veh.vel)*0.9, alto: 3 + Math.abs(P.veh.vel)*0.15, id:P.veh.id});
  for (const ex of P.explosiones) pat.push({x:ex.x, y:ex.y, z:ex.z, r:7, radial:true, fuerza:16, alto:9, id:'explosion'});
  for (const k of pat){
    const d = Math.hypot(B.x-k.x, B.z-k.z);
    if (d > k.r + 0.45 || Math.abs(B.y-k.y) > 2.2 || (k.id==='pie' && J.mov < 0.6 && !ent.b)) continue;
    let dx = (B.x-k.x)/Math.max(d, 0.01), dz = (B.z-k.z)/Math.max(d, 0.01);
    if (!k.radial){ dx = dx*0.5 + k.dx*0.5; dz = dz*0.5 + k.dz*0.5; const m = Math.hypot(dx, dz) || 1; dx /= m; dz /= m; }
    B.vx = dx*k.fuerza; B.vz = dz*k.fuerza; B.vy = k.alto;
    B.x = k.x + dx*(k.r + 0.5); B.z = k.z + dz*(k.r + 0.5);
    evento(P, 'patada', {x:B.x, y:B.y, z:B.z, fuerza:k.fuerza});
    break;
  }
  /* vuela, cae, rueda y frena */
  const g = altura(B.x, B.z) + 0.45;
  B.vy -= GRAV*DT; B.x += B.vx*DT; B.z += B.vz*DT; B.y += B.vy*DT;
  if (B.y <= g){ B.y = g; if (B.vy < -2){ B.vy = -B.vy*0.55; } else B.vy = 0; B.vx *= 0.975; B.vz *= 0.975; }
  else { B.vx *= 0.998; B.vz *= 0.998; }
  if (Math.hypot(B.vx, B.vz) < 0.05){ B.vx = B.vz = 0; }
  /* los bordes: rebota, salvo por la boca de las porterías, que es gol */
  const hx = C.w/2 + 1.2, hz = C.d/2 + 1.2;
  if (Math.abs(B.x-C.x) > hx){
    if (Math.abs(B.z-C.z) < 3 && B.y < g + 2.1){
      const lado = B.x > C.x ? 'derecha' : 'izquierda';
      B.gol = 90; P.goles++; ganarMonedas(P, 10, B.x, B.y+1, B.z); P.puntos += 200;
      evento(P, 'gol', {x:B.x, y:B.y, z:B.z, lado, goles:P.goles});
      B.vx *= 0.2;
      return;
    }
    B.x = C.x + Math.sign(B.x-C.x)*hx; B.vx = -B.vx*0.6;
  }
  if (Math.abs(B.z-C.z) > hz){ B.z = C.z + Math.sign(B.z-C.z)*hz; B.vz = -B.vz*0.6; }
}
/* la sala de conciertos: si el que juega es Fernando, canta al pararse frente al micrófono;
   si es otro, Fernando está ahí de cantante y canta cuando lo saludan (revisarSaludosNPC) */
function empezarCanto(P, quien){
  P.canto = {t:0, dur:CANCION_FRAMES, quien}; P.cantoT = P.t;
  const primera = !P.saludos.concierto; P.saludos.concierto = true;
  if (primera){ P.monedas += 25; P.puntos += 300; }
  evento(P, 'canta', {quien, x:MICROFONO.x, y:altura(MICROFONO.x, MICROFONO.z), z:MICROFONO.z, primera});
}
function pasoConcierto(P){
  const J = P.J, dm = Math.hypot(J.x-MICROFONO.x, J.z-MICROFONO.z);
  if (P.canto){
    const C = P.canto; C.t++;
    const lejos = C.quien==='yo' ? (!!P.veh || dm > 4) : dm > 70;
    if (C.t >= C.dur || lejos || P.casa || P.zona){ P.canto = null; P.cantoT = P.t; const completo = C.t >= C.dur; evento(P, 'cantoFin', {completo}); if (completo){ P.ovacionT = P.t; evento(P, 'ovacion', {x:MICROFONO.x, y:altura(MICROFONO.x, MICROFONO.z), z:MICROFONO.z}); } }   /* el descanso de 8 s se cuenta desde el final */
    return;
  }
  if (P.pj==='fernando' && !P.veh && !P.casa && !P.zona && !P.escena && J.suelo && P.t - P.cantoT > 60*8 && dm < 1.5) empezarCanto(P, 'yo');
  if (!P.veh && !P.casa && !P.zona && P.t - P.conciertoDicho > 60*60*4 && Math.hypot(J.x-ISLA_CONCIERTO.x, J.z-ISLA_CONCIERTO.z) < ISLA_CONCIERTO.r + 10){ P.conciertoDicho = P.t; evento(P, 'conciertoCerca'); decir(P, P.pj==='fernando' ? 'concierto' : 'conciertoFer'); }
}
/* las rocas de la luna y los cristales de Júpiter se recogen a pie */
function revisarRecogiblesZona(P){
  const Z = P.zona; if (!Z || P.veh) return;
  const J = P.J;
  for (const m of MONEDAS){
    if (Math.abs(m.y - Z.y - 1) > 2) continue;
    const tm = P.monedasT[m.id]; if (tm !== undefined && P.t - tm < 60*180) continue;
    if (Math.hypot(m.x-J.x, m.z-J.z) < 2.4){ P.monedasT[m.id] = P.t; ganarMonedas(P, m.valor, m.x, m.y, m.z); P.puntos += 20; }
  }
  const lista = Z.id==='luna' ? P.prog.rocas : Z.id==='jupiter' ? P.prog.cristales : null; if (!lista) return;
  for (const r of Z.recogibles){
    if (lista.includes(r.id) || Math.hypot(r.x-J.x, r.z-J.z) > 2.2) continue;
    lista.push(r.id); P.puntos += 300; P.monedas += 3;
    evento(P, r.tipo, {id:r.id, x:r.x, y:Z.y, z:r.z, total:lista.length});
    if (Z.id==='luna' && lista.length >= 6) darEstrella(P, 'rocas');
    if (Z.id==='jupiter' && lista.length >= 5) darEstrella(P, 'jupiter');
  }
}
/* ---- el día y la noche: en el mapa 1 un día dura 10 minutos; de noche salen los fantasmas de popo ---- */
const DIA_FRAMES = 60*600;
function nocheF(P){ if (NOCHE) return 1; const h = P.hora; return Math.max(1 - smooth(0.20, 0.30, h), smooth(0.76, 0.86, h)); }
const esNoche = (P)=> nocheF(P) > 0.6;
function pasoHora(P){
  if (!NOCHE){ P.hora += 1/DIA_FRAMES; if (P.hora >= 1) P.hora -= 1; }
  const J = P.J, noche = esNoche(P);
  if (noche && !P.casa && !P.zona){
    /* hasta cinco fantasmas de popo flotan cerca; al tocarlos explotan en monedas */
    if (P.fantasmas.length < 5 && P.t % 90 === 0){ const a = azar()*6.283, r = 25 + azar()*40, x = J.x + Math.cos(a)*r, z = J.z + Math.sin(a)*r; if (altura(x, z) > 1.0) P.fantasmas.push({x, z, y: altura(x, z) + 2.2, ang: azar()*6.283, fase: azar()*6.28, t: 0}); }
    for (let i=P.fantasmas.length-1;i>=0;i--){
      const f = P.fantasmas[i]; f.t++; f.fase += DT*2;
      if (f.t % 120 === 0) f.ang = envolver(f.ang + (azar()-0.5)*2);
      const nx = f.x + Math.sin(f.ang)*1.6*DT, nz = f.z + Math.cos(f.ang)*1.6*DT;
      if (altura(nx, nz) > 1.0){ f.x = nx; f.z = nz; } else f.ang = envolver(f.ang + Math.PI);
      f.y = Math.max(altura(f.x, f.z), NIVEL_MAR) + 2.2 + Math.sin(f.fase)*0.4;
      const d = Math.hypot(f.x-J.x, f.z-J.z);
      if (d > 140){ P.fantasmas.splice(i, 1); continue; }
      if (d < (P.veh ? P.veh.radio + 1.2 : 1.6) && Math.abs(f.y - (J.y+1)) < 3){
        P.fantasmas.splice(i, 1); ganarMonedas(P, 8, f.x, f.y, f.z); P.puntos += 150;
        evento(P, 'fantasma', {x:f.x, y:f.y, z:f.z});
        if (P.t - P.fantasmaDicho > 60*60*2){ P.fantasmaDicho = P.t; decir(P, 'fantasma'); }
      }
    }
  } else if (P.fantasmas.length && nocheF(P) < 0.4) P.fantasmas.length = 0;
}
/* la mascota comprada sigue al jugador detrás de los perritos y los popitos */
function pasoMascota(P){
  if (!P.mascota){ P.mascotaPos = null; return; }
  const J = P.J;
  if (!P.mascotaPos) P.mascotaPos = {x:J.x-1, z:J.z-1, y:J.y, ang:J.ang, mov:0, fase:0, dentro:false, radio:0.3};
  const m = P.mascotaPos;
  if (P.veh || P.casa || P.zona){ m.dentro = true; return; }
  m.dentro = false;
  const k = P.perros.filter(p=>p.sigue).length + P.popitos.length, atras = 2.2 + k*1.5, lado = 1.4;
  const ox = J.x - Math.sin(J.ang)*atras + Math.cos(J.ang)*lado, oz = J.z - Math.cos(J.ang)*atras - Math.sin(J.ang)*lado;
  const dx = ox-m.x, dz = oz-m.z, d = Math.hypot(dx, dz);
  if (d > 45){ m.x = ox; m.z = oz; }
  else if (d > 0.8){ const vel = Math.min(11, d*2.4); const mm = moverChocando(m, m.x + dx/d*vel*DT, m.z + dz/d*vel*DT); m.x = mm.x; m.z = mm.z; m.ang = envolver(m.ang + envolver(Math.atan2(dx,dz)-m.ang)*0.2); m.mov = vel; }
  else { m.mov = 0; m.ang = envolver(m.ang + envolver(J.ang-m.ang)*0.05); }
  const g = altura(m.x, m.z); m.y = g < NIVEL_MAR - 1.1 ? NIVEL_MAR - 0.2 : g;
  m.fase += m.mov*DT*3 + DT*3;
}
/* ---- la física de juguete: cajas, conos, gallinas y sandías que salen volando ---- */
/* los columpios del parque: se cuelga uno, se impulsa con la palanca y con A salta */
const COLUMPIOS = [-1.1, 1.1].map(ox=>({x: PARQUE.x + 6 + ox, z: PARQUE.z - 1, py: altura(PARQUE.x, PARQUE.z), pivote: 3.0, largo: 2.1}));
const PROPS_DEF = [];
(function ponerProps(){
  let id = 0;
  const poner = (tipo, x, z, ang)=>{ PROPS_DEF.push({id:'p'+(id++), tipo, x, z, ang: ang||0}); };
  for (const [x,z] of [[22,22],[24,26],[-20,50],[-18,54],[70,74],[72,78],[108,132],[104,134],[-56,110],[92,178],[96,182],[14,146]]) poner('caja', x, z, azar()*6);
  { const gas = CASAS.find(c=>c.gasolinera); for (let i=0;i<6;i++){ const m = puntoRuta(cercaRuta(gas.x, gas.z).s + i*7 - 20); poner('cono', m.x + m.nx*4.4, m.z + m.nz*4.4); } for (let i=0;i<4;i++) poner('cono', PISTA.x + 10, PISTA.z0 + 30 + i*10); }
  for (let i=0;i<8;i++){ const a = i/8*6.283, cx = i < 4 ? -10 : PARQUE.x, cz = i < 4 ? -4 : PARQUE.z + 14; poner('gallina', cx + Math.cos(a)*5, cz + Math.sin(a)*5, azar()*6); }
  for (let i=0;i<8;i++){ if (i < 4) poner('sandia', PLAYA.x - 14 + i*2.2, PLAYA.z + 6 + (i%2)*1.6); else poner('sandia', FUENTE.x + 8 + (i-4)*1.6, FUENTE.z + 7 + ((i-4)%2)*1.6); }
})();
function pasoProps(P){
  const J = P.J, golpes = [];
  if (P.veh && Math.abs(P.veh.vel) > 4 && !P.zona) golpes.push({x:P.veh.x, y:P.veh.y, z:P.veh.z, r:P.veh.radio + 0.9, vx:Math.sin(P.veh.ang)*P.veh.vel, vz:Math.cos(P.veh.ang)*P.veh.vel, fuerza:Math.abs(P.veh.vel)});
  else if (!P.veh && !P.casa && !P.zona && J.mov > 3) golpes.push({x:J.x, y:J.y, z:J.z, r:1.0, vx:J.vx, vz:J.vz, fuerza:J.mov});
  for (const ex of P.explosiones) golpes.push({x:ex.x, y:ex.y, z:ex.z, r:7, vx:0, vz:0, fuerza:22, radial:true});
  for (const p of P.props){
    if (Math.abs(p.x-J.x) > 140 || Math.abs(p.z-J.z) > 140) continue;
    if (p.estado==='roto'){ if (++p.t > 60*60){ p.estado = 'quieto'; p.x = p.ox; p.z = p.oz; p.y = altura(p.x, p.z); p.t = 0; } continue; }
    if (p.estado!=='aire') for (const g of golpes){
      if (Math.hypot(p.x-g.x, p.z-g.z) < g.r && Math.abs(p.y-g.y) < 3){
        if (g.radial){ const d = Math.max(0.5, Math.hypot(p.x-g.x, p.z-g.z)); p.vx = (p.x-g.x)/d*12 + (azar()-0.5)*3; p.vz = (p.z-g.z)/d*12 + (azar()-0.5)*3; }
        else { p.vx = g.vx*0.75 + (azar()-0.5)*3; p.vz = g.vz*0.75 + (azar()-0.5)*3; }
        p.vy = 4 + Math.min(14, g.fuerza*0.4); p.giro = (azar()-0.5)*10; p.estado = 'aire'; p.t = 0;
        evento(P, p.tipo==='gallina' ? 'gallinaVuela' : 'propVuela', {tipo:p.tipo, x:p.x, y:p.y, z:p.z, fuerza:g.fuerza});
        if (P.t - p.premioT > 60*15){ p.premioT = P.t; if (p.tipo==='gallina') ganarMonedas(P, 2, p.x, p.y+1, p.z); else if (p.tipo==='cono' || p.tipo==='caja') P.puntos += 20; }
        break;
      }
    }
    if (p.estado==='aire'){
      p.vy -= GRAV*(p.tipo==='gallina' ? 0.35 : 1)*DT; p.x += p.vx*DT; p.z += p.vz*DT; p.y += p.vy*DT; p.ang += p.giro*DT; p.t++;
      if (p.tipo==='gallina'){ p.vx *= 0.995; p.vz *= 0.995; }
      const g = altura(p.x, p.z);
      if (Math.abs(p.x) > LIMITE || Math.abs(p.z) > LIMITE || g < NIVEL_MAR - 1.1 && p.y <= NIVEL_MAR){ evento(P, 'chapoteo', {x:p.x, z:p.z}); p.estado = 'quieto'; p.x = p.ox; p.z = p.oz; p.y = altura(p.x, p.z); p.vx = p.vz = p.vy = 0; continue; }
      if (p.y <= g){
        p.y = g;
        if (p.tipo==='sandia'){ p.estado = 'roto'; p.t = 0; ganarMonedas(P, 3, p.x, p.y+0.5, p.z); evento(P, 'sandiaRota', {x:p.x, y:p.y, z:p.z}); }
        else if (Math.abs(p.vy) > 3 && p.tipo!=='gallina'){ p.vy *= -0.4; p.vx *= 0.6; p.vz *= 0.6; }
        else { p.estado = 'quieto'; p.vy = 0; p.vx = p.vz = 0; p.giro = 0; p.t = 0; if (p.tipo==='gallina') evento(P, 'gallinaAterriza', {x:p.x, y:p.y, z:p.z}); }
      }
      continue;
    }
    p.y = altura(p.x, p.z);
    if (p.tipo==='gallina'){
      p.fase += DT*3;
      const d = Math.hypot(p.x-J.x, p.z-J.z);
      if (d < 5 && !P.casa && !P.zona){ p.estado = 'huye'; p.huyeT = 60*2; p.ang = Math.atan2(p.x-J.x, p.z-J.z); }
      if (p.estado==='huye'){
        if (--p.huyeT <= 0) p.estado = 'quieto';
        const m = moverChocando(Object.assign(p, {radio:0.3}), p.x + Math.sin(p.ang)*4.5*DT, p.z + Math.cos(p.ang)*4.5*DT);
        if (altura(m.x, m.z) > 1.0){ p.x = m.x; p.z = m.z; } else p.ang = envolver(p.ang + 2);
        p.mov = 4.5;
      } else {
        p.mov = 0;
        if (p.t++ % 240 === 0 && Math.hypot(p.x-p.ox, p.z-p.oz) > 12){ p.ang = Math.atan2(p.ox-p.x, p.oz-p.z); p.estado = 'huye'; p.huyeT = 90; }
        else if (p.t % 150 === 0) p.ang = azar()*6.283;
      }
      continue;
    }
    if (Math.hypot(p.x-p.ox, p.z-p.oz) > 1.5 && ++p.t > 60*40 && Math.hypot(p.x-J.x, p.z-J.z) > 70){ p.x = p.ox; p.z = p.oz; p.y = altura(p.x, p.z); p.ang = 0; p.t = 0; }
  }
}
/* ---- los meteoritos: de vez en cuando cae una lluvia cerca del jugador (no hacen daño, solo susto) ---- */
function pasoMeteoros(P){
  const J = P.J;
  if (P.t >= P.proxMeteoros){
    P.proxMeteoros = P.t + 60*(70 + azar()*60);
    if (!P.casa && !P.zona && !P.escena){
      const n = 3 + Math.floor(azar()*4);
      for (let i=0;i<n;i++){ const a = azar()*6.283, r = 22 + azar()*70; P.meteoros.push({x: J.x + Math.cos(a)*r, z: J.z + Math.sin(a)*r, y: 240 + azar()*60 + i*35, vx:(azar()-0.5)*16, vz:(azar()-0.5)*16, vy: -(62 + azar()*30), r: 0.7 + azar()*0.9, t:0}); }
      evento(P, 'meteoros', {n});
      if (P.t - P.meteoroDicho > 60*45){ P.meteoroDicho = P.t; decir(P, 'meteorito'); }
    }
  }
  for (let i=P.meteoros.length-1;i>=0;i--){
    const m = P.meteoros[i]; m.t++;
    m.x += m.vx*DT; m.z += m.vz*DT; m.y += m.vy*DT;
    const g = Math.max(altura(m.x, m.z), NIVEL_MAR);
    if (m.y <= g + m.r || m.t > 60*8){
      const d = Math.hypot(m.x-J.x, m.z-J.z);
      evento(P, 'meteoroCae', {x:m.x, y:g, z:m.z, r:m.r, agua: altura(m.x, m.z) < NIVEL_MAR - 0.5, d});
      if (d < 7 && !P.veh && !P.casa && J.suelo){ J.vy = 7; J.suelo = false; }
      P.meteoros.splice(i, 1);
    }
  }
}
function comerArepa(P, a){
  P.comidasArepas.add(a.id); P.arepas++; P.puntos += 150; P.monedas += 2;
  P.popo = Math.min(1, P.popo + 0.34);
  engordar(P);
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
    if (E.t === 90 && !P.prog.luna) evento(P, 'banderaLuna');
    if (E.t >= E.dur){ const primera = !P.prog.luna; P.prog.luna = true; if (primera){ P.puntos += 1000; evento(P, 'lunaLista'); darEstrella(P, 'luna'); } irAZona(P, 'luna'); }
    return;
  }
  if (E.tipo==='planeta'){
    const v = P.vehiculos.find(v=>v.id==='nave'), B = ZONAS[E.zona].planeta;
    v.x = lerp(v.x, B.x, 0.03); v.z = lerp(v.z, B.z, 0.03); v.y = lerp(v.y, B.y-B.r-3, 0.03); v.vel = 0; v.vy = 0;
    P.J.x = v.x; P.J.y = v.y; P.J.z = v.z;
    if (E.t >= E.dur) irAZona(P, E.zona);
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
      P.escena = null; P.popo = 0; P.ganas = false; P.puntos += 500; P.monedas += 10;
      { const g = P.gordura; P.gordura = 0; P.flacoT = 60*40; evento(P, 'flaco', {antes:g}); if (g >= 3) decir(P, 'flaco'); }
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
      P.puntos += 500; P.monedas += 5;
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
  if (P.escena && P.escena.tipo==='planeta') return {texto:'¡Llegamos a '+ZONAS[P.escena.zona].nombre+'! 🚀', x:null};
  if (P.escena && P.escena.tipo==='luna') return {texto: NOCHE ? '¡Llegamos a Marte! 🔴' : '¡Llegamos a la luna! 🌙', x:null};
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
    if (v.id==='tanque') return {texto:'Con B dispara el cañón 💥 (aplasta árboles y rocas)', x:null};
    if (v.id==='tabla') return {texto: Math.hypot(v.x-OLAS.x, v.z-OLAS.z) < OLAS.r ? '¡Déjate llevar por la ola! 🌊' : 'Rema hasta las olas grandes 🌊', x:OLAS.x, z:OLAS.z, y:0, emoji:'🌊'};
    if (v.id==='motoagua' && !tieneEstrella(P,'motoagua')){ const b = masCerca(BOYAS.filter(b=>!P.prog.boyas.includes(b.id))); if (b) return {texto:'Pasa por las boyas 🛟 '+P.prog.boyas.length+'/'+BOYAS.length, x:b.x, z:b.z, y:0, emoji:'🛟'}; }
    if (v.id==='dino' && !tieneEstrella(P,'dino')){ const h = masCerca(HUEVOS.filter(h=>!P.prog.huevos.includes(h.id))); if (h) return {texto:'Busca los huevos 🥚 '+P.prog.huevos.length+'/'+HUEVOS.length, x:h.x, z:h.z, y:altura(h.x,h.z), emoji:'🥚'}; }
    if (v.id==='nave' && P.zona){ const Z = P.zona; return {texto: (Z.id==='luna' && !tieneEstrella(P,'rocas')) || (Z.id==='jupiter' && !tieneEstrella(P,'jupiter')) || (Z.id==='saturno' && !tieneEstrella(P,'saturno')) ? 'Bájate (E) y pasea por '+Z.nombre : 'Mantén A para despegar de '+Z.nombre+' 🚀', x:null}; }
    if (v.id==='nave' && !tieneEstrella(P,'luna')) return {texto: v.aire ? (NOCHE ? '¡Sube, sube hasta Marte! 🔴' : '¡Sube, sube hasta la luna! 🌙') : 'Mantén A para encender los motores 🚀', x:LUNA.x, z:LUNA.z, y:LUNA.y-LUNA.r, emoji: NOCHE ? '🔴' : '🌙'};
    if (v.id==='nave' && !tieneEstrella(P,'rocas')) return {texto: (NOCHE ? 'Vuelve a Marte y pósate abajo 🔴' : 'Vuelve a la luna y pósate abajo 🌙'), x:LUNA.x, z:LUNA.z, y:LUNA.y-LUNA.r, emoji: NOCHE ? '🔴' : '🌙'};
    if (v.id==='nave' && !tieneEstrella(P,'saturno')) return {texto: v.aire ? '¡Sube más alto, hasta Saturno! 🪐' : 'Mantén A y sube hasta Saturno 🪐', x:SATURNO.x, z:SATURNO.z, y:SATURNO.y-SATURNO.r, emoji:'🪐'};
    if (v.id==='nave' && !tieneEstrella(P,'jupiter')) return {texto: v.aire ? '¡Más alto todavía, hasta Júpiter! 🟠' : 'Mantén A y sube hasta Júpiter 🟠', x:JUPITER.x, z:JUPITER.z, y:JUPITER.y-JUPITER.r, emoji:'🟠'};
    if (v.id==='nave' && NOCHE && !tieneEstrella(P,'ovni')) return {texto: v.aire ? 'Busca la nave extraterrestre en el espacio 👽' : 'Mantén A para subir al espacio 🚀', x:OVNI.x, z:OVNI.z, y:OVNI.y, emoji:'👽'};
    if (v.id==='ptero' && !tieneEstrella(P,'ptero')){ const i = AROS_NOCHE.findIndex((a,i)=>!P.prog.arosNoche.includes(i)); if (i>=0){ const a = AROS_NOCHE[i]; return {texto: v.aire ? 'Pasa por los aros de la noche ⭕ '+P.prog.arosNoche.length+'/'+AROS_NOCHE.length : 'Mantén A para que el pterodáctilo despegue 🦅', x:a.x, z:a.z, y:a.y, emoji:'⭕'}; } }
    if ((v.id==='barco' || v.id==='motoagua') && NOCHE && !tieneEstrella(P,'catatumbo')) return {texto:'Navega cerca de Maracaibo y mira el Catatumbo ⚡ '+P.prog.rayos+'/5', x:MARACAIBO.x, z:MARACAIBO.z + MARACAIBO.r + 30, y:0, emoji:'⚡'};
    return {texto:'¡Explora la isla! 🌴', x:null};
  }
  if (P.zona){
    const Z = P.zona;
    if (Z.id==='luna' && !tieneEstrella(P,'rocas')){ const r = masCerca(Z.recogibles.filter(r=>!P.prog.rocas.includes(r.id))); if (r) return {texto:'Recoge las rocas 🌑 '+P.prog.rocas.length+'/6', x:r.x, z:r.z, y:Z.y, emoji:'🌑'}; }
    if (Z.id==='saturno' && !tieneEstrella(P,'saturno')){ const a = masCerca(P.aliens.saturno.filter(a=>!P.prog.saturnianos.includes(a.id))); if (a) return {texto:'Saluda a los saturnianos 👽 '+P.prog.saturnianos.length+'/4', x:a.x, z:a.z, y:Z.y, emoji:'👽'}; }
    if (Z.id==='jupiter' && !tieneEstrella(P,'jupiter')){ const r = masCerca(Z.recogibles.filter(r=>!P.prog.cristales.includes(r.id))); if (r) return {texto:'Recoge los cristales 💎 '+P.prog.cristales.length+'/5', x:r.x, z:r.z, y:Z.y, emoji:'💎'}; }
    const n = P.vehiculos.find(v=>v.id==='nave'); return {texto:'Móntate en la nave para volver 🚀', x:n.x, z:n.z, y:n.y, emoji:'🚀'};
  }
  if (!tieneEstrella(P,'popo')){ const h = masCerca(HAMBURGUESAS.filter(h=>!P.comidas.has(h.id) && h.y < 30)); if (h) return {texto:'Busca hamburguesas 🍔', x:h.x, z:h.z, y:h.y, emoji:'🍔'}; }
  const orden = NOCHE ? ['familia','polarcita','carro','coro','ptero','catatumbo','maracaibo','luna','ovni','banos','rocas','saturno','jupiter'] : ['carro','moto','familia','dino','avion','heli','barco','motoagua','sub','maracaibo','luna','banos','rocas','saturno','jupiter'];
  for (const id of orden){
    if (tieneEstrella(P, id)) continue;
    if (id==='polarcita'){ const r = porId('romulo'); return {texto:'Visita a Rómulo en su bar 🍺', x:r.x, z:r.z, y:altura(r.x,r.z), emoji:'🍺'}; }
    if (id==='coro'){ const c = masCerca(P.chivos.filter(c=>!P.prog.chivos.includes(c.id))); if (c) return {texto: Math.hypot(J.x-CORO.x, J.z-CORO.z) < CORO.r + 30 ? 'Saluda a los chivos 🐐 '+P.prog.chivos.length+'/'+CHIVOS.length : 'Ve a Coro, la tierra de los chivos 🐐', x:c.x, z:c.z, y:altura(c.x,c.z), emoji:'🐐'}; continue; }
    if (id==='catatumbo'){ const b = P.vehiculos.find(v=>v.id==='motoagua'); return {texto:'Móntate en la moto de agua y ve a Maracaibo ⚡', x:b.x, z:b.z, y:b.y, emoji:'🛥️'}; }
    if (id==='ovni'){ const n = P.vehiculos.find(v=>v.id==='nave'); return {texto:'Móntate en la nave espacial y busca el ovni 👽', x:n.x, z:n.z, y:n.y, emoji:'🚀'}; }
    if (id==='familia'){ const f = masCerca(FAMILIA.filter(f=>!f.bebe && !P.saludos[f.id])); if (f) return {texto:'Saluda a '+f.nombre+' 👋', x:f.x, z:f.z, y:altura(f.x,f.z), emoji:'👋'}; continue; }
    if (id==='banos'){ const b = masCerca(BANOS.filter(b=>!P.prog.banos.includes(b.id))); if (b) return {texto:'Come 🍔 y ve a '+b.nombre+' 🚽', x:b.px, z:b.pz, y:altura(b.px,b.pz), emoji:'🚽'}; continue; }
    if (id==='maracaibo'){ if (enMaracaibo(J.x, J.z)){ const a = masCerca(AREPAS.filter(a=>!P.comidasArepas.has(a.id))); if (a) return {texto:'Come arepas 🫓 '+P.arepas+'/5', x:a.x, z:a.z, y:a.y, emoji:'🫓'}; } return {texto:'Cruza el puente hasta Maracaibo 🫓', x:PUENTE.x0, z:PUENTE.z0, y:altura(PUENTE.x0, PUENTE.z0), emoji:'🌉'}; }
    const vid = id==='luna' || id==='rocas' || id==='saturno' || id==='jupiter' ? 'nave' : id;
    const vd = P.vehiculos.find(v=>v.id===vid);
    return {texto: vid==='nave' && id!=='luna' ? 'Móntate en la nave y vuela '+(id==='rocas' ? (NOCHE ? 'a Marte 🔴' : 'a la luna 🌙') : id==='saturno' ? 'hasta Saturno 🪐' : 'hasta Júpiter 🟠') : 'Móntate en '+vd.nombre+' '+vd.emoji, x:vd.x, z:vd.z, y:vd.y, emoji:vd.emoji};
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
function empaquetarEstado(P, pj, nombre, ropa){
  const J = P.J, v = P.veh, r = (n, d)=> Math.round(n*(d||100))/(d||100);
  ropa = ropa || {};
  return {t:'e', pj, n:nombre, x:r(J.x), y:r(J.y), z:r(J.z), a:r(J.ang), v: v ? v.id : '', m:r(J.mov,10), f:r(J.fase,10),
    na: J.nadando ? 1 : 0, su: J.suelo ? 1 : 0, c: v ? r(v.cabeceo) : 0, g: v ? r(v.giro) : 0, ve: v ? r(v.vel,10) : 0, ai: v && v.aire ? 1 : 0,
    pp: P.popitos.length, ga: P.ganas ? 1 : 0, es: P.estrellas.length, go: P.gorilaT > 0 ? 1 : 0, gd: P.gordura, fl: P.flacoT > 0 ? 1 : 0, hg: ropa.gorro||'', hc: ropa.capa||'', ha: ropa.carro||''};
}
function desempaquetarEstado(m){
  if (!m || typeof m !== 'object' || m.t !== 'e' || ![m.x, m.y, m.z].every(Number.isFinite)) return null;
  const num = (v, a, b)=> Number.isFinite(v) ? clamp(v, a, b) : 0;
  const pj = PERSONAJES_RED.some(p=>p.id===m.pj) ? m.pj : 'fernando';
  const nombre = String(m.n||'').replace(/[^\wáéíóúñÁÉÍÓÚÑ ]/g, '').slice(0, 14) || PERSONAJES_RED.find(p=>p.id===pj).nombre;
  return {pj, nombre, x:num(m.x,-LIMITE,LIMITE), y:num(m.y,-260,950), z:num(m.z,-LIMITE,LIMITE), ang:num(m.a,-7,7),
    veh: VEHICULOS_DEF.some(d=>d.id===m.v) ? m.v : '', mov:num(m.m,0,40), fase:num(m.f,0,1e7), nadando:!!m.na, suelo:!!m.su,
    cabeceo:num(m.c,-1,1), giro:num(m.g,-1,1), vel:num(m.ve,-20,80), aire:!!m.ai, popitos:num(m.pp,0,MAX_POPITOS)|0, ganas:!!m.ga, estrellas:num(m.es,0,8)|0, gorila:!!m.go, gordura:num(m.gd,0,6)|0, flaco:!!m.fl, ropa:{gorro: ITEMS_TIENDA.some(i=>i.id===m.hg && i.tipo==='gorro') ? m.hg : null, capa: ITEMS_TIENDA.some(i=>i.id===m.hc && i.tipo==='capa') ? m.hc : null, carro: ITEMS_TIENDA.some(i=>i.id===m.ha && i.tipo==='carro') ? m.ha : null}};
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
  if (P.durmiendo){ const D = P.durmiendo; D.t++; if (D.t >= D.dur){ P.durmiendo = null; if (!NOCHE){ P.hora += 0.25; if (P.hora >= 1) P.hora -= 1; } P.popo = Math.max(0, P.popo - 0.15); const primera = !P.saludos.siesta; P.saludos.siesta = true; if (primera){ P.monedas += 10; } evento(P, 'despierta', {primera}); } return; }
  const e2 = {jx, jy, a:!!ent.a, b:!!ent.b, aNuevo, bNuevo};
  if (P.veh){
    pasoVehiculo(P, P.veh, e2);
    P.J.x = P.veh.x; P.J.y = P.veh.y; P.J.z = P.veh.z; P.J.ang = P.veh.ang;
    if (salirNuevo) intentarBajar(P);
  } else {
    if (aNuevo && P.cercaPuerta){ if (P.casa) salirCasa(P); else entrarCasa(P, P.cercaPuerta); e2.aNuevo = false; e2.a = false; }
    else if (aNuevo && P.cercaVeh){ montar(P, P.cercaVeh); e2.aNuevo = false; e2.a = false; }
    else if (aNuevo && P.sentado){ P.sentado = null; evento(P, 'levanta'); e2.aNuevo = false; e2.a = false; }
    else if (aNuevo && P.casa && P.cercaMueble){ usarMueble(P, P.cercaMueble); e2.aNuevo = false; e2.a = false; }
    if (P.veh) pasoVehiculo(P, P.veh, {jx:0, jy:0, a:false, b:false, aNuevo:false, bNuevo:false});
    else pasoPie(P, e2);
  }
  pasoPerros(P); pasoPopitos(P); pasoPopo(P); revisarRecogibles(P); revisarFamilia(P); revisarMisiones(P); revisarBanos(P);
  pasoDinos(P); pasoMeteoros(P); pasoGorila(P);
  pasoBichos(P); pasoConcierto(P); pasoBalas(P); pasoBalon(P, e2); pasoVisita(P); pasoAvionSolo(P); revisarSaludosNPC(P); revisarRecogiblesZona(P);
  pasoHora(P); pasoMascota(P); pasoProps(P);
  pasoNoche(P);
}
/* ---- lo que solo pasa de noche: el relámpago del Catatumbo sobre el lago y los chivos de Coro ---- */
function pasoNoche(P){
  const J = P.J, v = P.veh;
  /* el Catatumbo: en la lancha o el barco, cerca de la orilla de Maracaibo, cae un relámpago cada pocos segundos (de noche) */
  const dM = Math.hypot(J.x-MARACAIBO.x, J.z-MARACAIBO.z);
  if (esNoche(P) && v && (v.id==='barco' || v.id==='motoagua') && dM < MARACAIBO.r + 90 && P.t - P.ultimoRayo > 60*4){
    P.ultimoRayo = P.t;
    const a = azar()*6.283, r = 40 + azar()*90;
    evento(P, 'rayo', {x: MARACAIBO.x + Math.cos(a)*r, z: MARACAIBO.z + Math.sin(a)*r});
    if (NOCHE && !tieneEstrella(P, 'catatumbo')){ P.prog.rayos++; evento(P, 'catatumboCuenta', {total:P.prog.rayos}); if (P.prog.rayos >= 5) darEstrella(P, 'catatumbo'); }
    if (P.t - P.catatumboDicho > 60*25){ P.catatumboDicho = P.t; decir(P, 'catatumbo'); }
  }
  if (!NOCHE) return;
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
    posSrPopo, puedeBajar, montar, obstaculosCerca, azar, SOLARES, MAX_POPITOS, MAX_JUGADORES, PERSONAJES_RED, DIALOGOS, CLAVES_DIALOGO, fraseDe, nombreDe, MAPA, NOCHE, CORO, CHIVOS, AROS_NOCHE, OVNI, decir, CLIPS_PJ, MARACAIBO, LUNA, PUENTE, enPuente, alturaPuente, enMaracaibo, CASAS_MCBO, PLAZA_MCBO, HELIPUERTOS, BOYAS, HUEVOS, AREPAS, alturaAgua, ALFABETO_SALA, codigoSala, normalizarCodigo, empaquetarEstado, desempaquetarEstado,
    CASTILLO, CASTILLO_DEF, INTERIORES, INTERIOR_CASTILLO, INTERIOR_CIRCO, entrarCasa, salirCasa, ISLA_BANANA, BANANAS, PLATANOS, DINOS, VALLE_DINOS, VEREDA, cercaVereda, FRASES_NUEVAS, variar, Y_INTERIOR, engordar, comerBanana,
    MONEDAS, ITEMS_TIENDA, ropaNueva, comprar, ganarMonedas, nocheF, esNoche, DIA_FRAMES, PROPS_DEF, pasoHora, ZONAS, SATURNO, JUPITER, ISLA_ELEFANTES, ISLA_VAMPIROS, ISLA_CIRCO, ISLA_CONCIERTO, MICROFONO, CANTANTE, CANCION_FRAMES, npcsCerca, OLAS, olaGrande, ola, USOS, muebleCerca, usarMueble, COLUMPIOS, ESCALERAS, techoAltura, plataformaEn, CIRCO_DEF, CIRCO_NPCS, ELEFANTES, VAMPIROS, RENOS, SANTA, ALIEN_INFO, irAZona, salirZona, saltarParacaidas, npcsCerca, pasear};
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
/* cerrar la pestaña o ir atrás por error: el navegador pregunta antes (en iPhone Safari no lo hace) */
let salidaAvisada = false;
window.addEventListener('beforeunload', e=>{ try{ if (salidaAvisada || estado==='menu') return; }catch(err){ return; } e.preventDefault(); e.returnValue = ''; return ''; });
redimensionar();

/* ---------------- Sonido y música 8-bits (Web Audio) ---------------- */
let AC = null, motor = null;
function audio(){
  prepararClips();
  if (!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  if (AC && (AC.state==='suspended' || AC.state==='interrupted')){ try{ AC.resume(); }catch(e){} }
  vozDesbloquear();
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
  moneda(){ beep(1568,0.06,'square',0.05); beep(2093,0.12,'square',0.05,0.06); },
  campanitas(){ [1319,1568,1319,1568,1760,2093].forEach((f,i)=>beep(f,0.12,'sine',0.08,i*0.12)); },
  trompeta(){ [180,220,260,220].forEach((f,i)=>beep(f,0.3,'sawtooth',0.18,i*0.25)); },
  hipo(){ beep(600,0.05,'square',0.08); beep(900,0.08,'square',0.08,0.05); },
  tele(){ [659,784,988,784,1319].forEach((f,i)=>beep(f,0.12,'square',0.06,i*0.1)); },
  piano(){ const esc = [523,587,659,698,784,880,988,1047]; for (let i=0;i<7;i++) beep(esc[Math.floor(Math.random()*esc.length)],0.22,'triangle',0.09,i*0.18); },
  rocola(){ const m = [523,659,784,659,880,784,659,523,587,698,880,1047]; m.forEach((f,i)=>beep(f,0.16,'square',0.06,i*0.17)); },
  aplausos(){ for (let i=0;i<48;i++) ruidoSonoro(0.025 + Math.random()*0.02, 0.10, 2600 + Math.random()*1200, 900, i*0.075 + Math.random()*0.05); [784,988,1175].forEach((f,i)=>beep(f,0.25,'triangle',0.05,0.4+i*0.3)); },
  disparo(){ ruidoSonoro(0.18, 0.5, 900, 120); beep(90,0.15,'square',0.2); },
  explosion(d){ const v = clamp(0.6 - (d||0)/300, 0.08, 0.6); ruidoSonoro(0.55, v, 1400, 60); beep(60,0.3,'sawtooth',v*0.5); },
  gallina(){ [880,1046,880,1046,700].forEach((f,i)=>beep(f,0.08,'square',0.07,i*0.09)); },
  golpe(){ ruidoSonoro(0.15, 0.2, 800, 200); beep(120,0.1,'triangle',0.15); },
  sandia(){ ruidoSonoro(0.25, 0.25, 1500, 300); beep(200,0.12,'sine',0.1); },
  fantasma(){ [400,300,500,250].forEach((f,i)=>beep(f,0.2,'sine',0.1,i*0.15)); },
  meteoro(d){ const v = clamp(1 - (d||0)/160, 0.15, 1); ruidoSonoro(1.2, 0.45*v, 700, 50, 0.3*v); beep(60, 0.5, 'sawtooth', 0.25*v); ruidoSonoro(0.3, 0.25*v, 3000, 600, 0.05); },
  gorila(){ [180,150,200,140,220,160].forEach((f,i)=>beep(f,0.14,'sawtooth',0.22,i*0.11)); ruidoSonoro(0.5, 0.12, 500, 150, 0.1); },
  banana(){ [659,784,988,1319].forEach((f,i)=>beep(f,0.09,'square',0.06,i*0.06)); },
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
    o.type = tipo==='avion' || tipo==='nave' ? 'sawtooth' : tipo==='sub' || tipo==='heli' || tipo==='ovni' || tipo==='esquis' ? 'sine' : tipo==='barco' || tipo==='motoagua' || tipo==='motonieve' ? 'square' : tipo==='dino' ? 'triangle' : 'sawtooth';
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
/* al pedir permiso de micrófono el teléfono tapa la página (blur): ahí no se suelta el botón 🎙️,
   para que al aceptar se pueda hablar de una vez */
addEventListener('blur', ()=>{ TOQUE.palanca = null; if (VOZ.pidiendo){ for (const [k,b] of [...TOQUE.botones]) if (b.k!=='voz') TOQUE.botones.delete(k); } else { TOQUE.botones.clear(); vozParar(); } });
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
const CIELO_NOCHE = {arriba: lin(0x050a24), horizonte: lin(0x1b2b5c), arribaAgua: lin(0x02142a), horizonteAgua: lin(0x083058)}, CIELO_DIA = {arriba: lin(0x2f7fe0), horizonte: lin(0xd6ecff), arribaAgua: lin(0x03305e), horizonteAgua: lin(0x0b5f9c)};
const CIELO = NOCHE ? CIELO_NOCHE : CIELO_DIA;
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
  const n = 220, lado = 1400, seg = lado/n, k = n+1;
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
      olasC:{value:new THREE.Vector3(OLAS.x, OLAS.z, OLAS.r)}, olasD:{value:new THREE.Vector2(OLAS.dx, OLAS.dz)}, olasP:{value:new THREE.Vector3(OLAS.amp, OLAS.k, OLAS.w)},
      hondo:{value:lin(0x0d5c9a)}, claro:{value:lin(0x3fd0d8)}, espuma:{value:lin(0xffffff)}, cielo:{value:lin(0xbfe4ff)},
    }]),
    vertexShader: `
      uniform float t; attribute float prof; uniform vec3 olasC; uniform vec2 olasD; uniform vec3 olasP;
      varying float vProf; varying vec3 vPos; varying vec3 vN; varying float vOla; varying float vPend;
      #include <fog_pars_vertex>
      void main(){
        vec3 p = position;
        float h = 0.22*sin(p.x*0.23 + t*1.3) + 0.16*sin(p.z*0.29 - t*1.1) + 0.1*sin((p.x+p.z)*0.11 + t*0.7);
        float dOla = distance(p.xz, olasC.xy);
        float fOla = 1.0 - smoothstep(olasC.z*0.35, olasC.z, dOla);
        float fase = olasP.y*dot(p.xz, olasD) + olasP.z*t;
        h += olasP.x*fOla*sin(fase);
        vOla = olasP.x*fOla*sin(fase); vPend = olasP.x*olasP.y*fOla*cos(fase);
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
      uniform vec3 hondo, claro, espuma, cielo, sol; uniform float t, bajo; uniform vec2 olasD;
      varying float vProf; varying vec3 vPos; varying vec3 vN; varying float vOla; varying float vPend;
      #include <fog_pars_fragment>
      void main(){
        vec3 V = normalize(cameraPosition - vPos);
        float dhx = 0.0506*cos(vPos.x*0.23 + t*1.3) + 0.011*cos((vPos.x+vPos.z)*0.11 + t*0.7) + 0.02*cos(vPos.x*1.3 + vPos.z*0.7 + t*2.6);
        float dhz = 0.0464*cos(vPos.z*0.29 - t*1.1) + 0.011*cos((vPos.x+vPos.z)*0.11 + t*0.7) + 0.02*cos(vPos.z*1.1 - vPos.x*0.6 + t*2.2);
        vec3 n = normalize(vec3(-dhx*4.0 - vPend*olasD.x*2.5, 1.0, -dhz*4.0 - vPend*olasD.y*2.5));
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
        esp += smoothstep(1.2, 2.3, vOla)*0.85;   /* la cresta de las olas grandes se pone blanca */
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
    if (c.santa){ const sp = letrero('🎅 CASA DE SANTA CLAUS', '#fff', 'rgba(190,40,40,0.9)', 2); sp.position.set(c.x, y + c.h*1.55 + 1.6, c.z); mundo.add(sp); A.bola(0.6, '#ffffff', c.x - c.w/2 - 1.5, y + 0.6, c.z + 2, 10).bola(0.45, '#ffffff', c.x - c.w/2 - 1.5, y + 1.5, c.z + 2, 10).bola(0.32, '#ffffff', c.x - c.w/2 - 1.5, y + 2.15, c.z + 2, 10).cono(0.07, 0.4, '#ff8a3d', c.x - c.w/2 - 1.5, y + 2.15, c.z + 2.5, 5, Math.PI/2, 0, 0).bola(0.05, '#111', c.x - c.w/2 - 1.62, y + 2.25, c.z + 2.28, 4).bola(0.05, '#111', c.x - c.w/2 - 1.38, y + 2.25, c.z + 2.28, 4).cil(0.36, 0.36, 0.06, '#222', c.x - c.w/2 - 1.5, y + 2.45, c.z + 2, 0,0,0, 10).cil(0.26, 0.26, 0.4, '#222', c.x - c.w/2 - 1.5, y + 2.65, c.z + 2, 0,0,0, 10);
      for (let k=0;k<4;k++) A.cono(1.6 - k*0.3, 1.4, k%2 ? '#2e7d32' : '#43a047', c.x + c.w/2 + 3, y + 1.0 + k*0.9, c.z - 3, 8); A.cil(0.2, 0.25, 1.0, '#5a3418', c.x + c.w/2 + 3, y + 0.5, c.z - 3, 0,0,0, 6); for (let k=0;k<8;k++){ const a = k*0.8; A.bola(0.14, ['#e63946','#ffd23f','#4fc3f7','#ff6ec0'][k%4], c.x + c.w/2 + 3 + Math.cos(a)*(1.3 - k*0.12), y + 1.2 + k*0.4, c.z - 3 + Math.sin(a)*(1.3 - k*0.12), 5); } A.bola(0.22, '#ffd23f', c.x + c.w/2 + 3, y + 4.5, c.z - 3, 6); }
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
  for (const L of ESCALERAS){ if (!CASAS.includes(L.c)) continue; const h = L.top - L.base + 0.5; for (const dz of [-0.35, 0.35]) A.caja(0.1, h, 0.1, '#d9a066', L.x, L.base + h/2, L.z + dz); for (let y = 0.45; y < h - 0.2; y += 0.45) A.caja(0.12, 0.08, 0.8, '#8b5a2b', L.x, L.base + y, L.z); }
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
  for (const lado of [-1,1]){ const gx = CANCHA.x + lado*CANCHA.w/2; for (let k=0;k<6;k++) A.caja(0.04, 2.2, 0.04, '#e8e8f0', gx + lado*1.2, cy+1.1, CANCHA.z-3+k*1.2, 0,0,0).caja(1.3, 0.04, 0.04, '#e8e8f0', gx + lado*0.65, cy+0.4+k*0.36, CANCHA.z, 0, Math.PI/2, 0); A.caja(0.04, 0.04, 6.2, '#e8e8f0', gx + lado*1.2, cy+2.2, CANCHA.z); }
  /* el parque: tobogán, columpios y arenero */
  const py = altura(PARQUE.x, PARQUE.z);
  A.caja(1.2, 0.2, 5, '#ffd23f', PARQUE.x, py+1.5, PARQUE.z, -0.55, 0, 0); A.caja(1.4, 0.3, 1.4, '#ff6ec0', PARQUE.x, py+2.75, PARQUE.z-2.4);
  for (const [ox,oz] of [[-0.6,-2.4],[0.6,-2.4],[-0.6,-3.2],[0.6,-3.2]]) A.cil(0.08,0.08,2.8,'#2a6ad0', PARQUE.x+ox, py+1.4, PARQUE.z+oz, 0,0,0,6);
  for (let i=0;i<4;i++) A.caja(0.9, 0.08, 0.3, '#2a6ad0', PARQUE.x, py+0.4+i*0.55, PARQUE.z-2.8);
  const sx = PARQUE.x+6, sz = PARQUE.z-1;
  A.cil(0.12,0.12,3,'#2a9c3a', sx-2.5, py+1.5, sz, 0,0,0,6); A.cil(0.12,0.12,3,'#2a9c3a', sx+2.5, py+1.5, sz, 0,0,0,6); A.cil(0.1,0.1,5.2,'#2a9c3a', sx, py+3, sz, 0,0,Math.PI/2,6);
  /* los asientos y las cuerdas de los columpios son aparte, porque se mueven (columpiosMesh) */
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
  /* los postes de los faroles (el brillo lo pone ponerFarolas, que sirve para los dos mapas) */
  for (const c of CASAS.concat(CASAS_MCBO)){ const y = altura(c.x, c.z), px = c.x + Math.sin(c.puerta)*(c.w/2 + 2.5), pz = c.z + Math.cos(c.puerta)*(c.d/2 + 2.5); A.cil(0.12, 0.16, 4.2, '#3a3a44', px, y+2.1, pz, 0,0,0,6).bola(0.42, '#fff2b0', px, y+4.4, pz, 8); }
  for (const [x, z] of [[FUENTE.x+6, FUENTE.z+6], [FUENTE.x-6, FUENTE.z-6], [PLAZA_MCBO.x+8, PLAZA_MCBO.z], [PLAZA_MCBO.x-8, PLAZA_MCBO.z]]){ const y = altura(x, z); A.cil(0.12, 0.16, 4.2, '#3a3a44', x, y+2.1, z, 0,0,0,6).bola(0.42, '#fff2b0', x, y+4.4, z, 8); }
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
  for (const L of ESCALERAS){ if (!CASAS_MCBO.includes(L.c)) continue; const h = L.top - L.base + 0.5; for (const dz of [-0.35, 0.35]) A.caja(0.1, h, 0.1, '#d9a066', L.x, L.base + h/2, L.z + dz); for (let y = 0.45; y < h - 0.2; y += 0.45) A.caja(0.12, 0.08, 0.8, '#8b5a2b', L.x, L.base + y, L.z); }
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
/* ---------------- Lo nuevo: el castillo, la plataforma del ovni, el valle de los dinosaurios,
   la isla de las bananas y la vereda del lago ---------------- */
(function construirLugaresNuevos(){
  const A = new Armador();
  const matPiso = new THREE.MeshLambertMaterial({vertexColors:true, polygonOffset:true, polygonOffsetFactor:-1, polygonOffsetUnits:-1});
  /* el castillo: foso, murallas con almenas, cuatro torres, portón y la torre del homenaje */
  { const cx = CASTILLO.x, cz = CASTILLO.z, y0 = altura(cx, cz), PIEDRA = '#a8a8b0', PIEDRA2 = '#8e8e98', ROJO = '#c0392b';
    A.pieza(new THREE.RingGeometry(16.2, 20.5, 48), '#4fa3d8', cx, y0+0.12, cz, -Math.PI/2, 0, 0);
    A.pieza(new THREE.RingGeometry(20.5, 21.3, 48), PIEDRA2, cx, y0+0.2, cz, -Math.PI/2, 0, 0);
    const sx = Math.sin(CASTILLO.ang), sz = Math.cos(CASTILLO.ang);
    A.caja(sx ? 6.5 : 5, 0.4, sx ? 5 : 6.5, '#8b5a2b', cx + sx*18.2, y0+0.35, cz + sz*18.2);   /* el puente levadizo */
    for (const k of [-1.4, 1.4]) for (let i=0;i<4;i++) A.caja(0.14, 1.0, 0.14, '#5a3418', cx + sx*(15.8+i*1.6) + (sx ? 0 : k), y0+0.9, cz + sz*(15.8+i*1.6) + (sx ? k : 0));
    for (const lado of [-1, 1]){
      A.caja(30, 8, 1.4, PIEDRA, cx, y0+4, cz + lado*14.3); A.caja(1.4, 8, 30, PIEDRA, cx + lado*14.3, y0+4, cz);
      A.caja(30.2, 1.2, 1.6, PIEDRA2, cx, y0+0.6, cz + lado*14.3); A.caja(1.6, 1.2, 30.2, PIEDRA2, cx + lado*14.3, y0+0.6, cz);
      for (let i=-6;i<=6;i++){ A.caja(1.2, 1.1, 1.5, PIEDRA, cx + i*2.3, y0+8.55, cz + lado*14.3); A.caja(1.5, 1.1, 1.2, PIEDRA, cx + lado*14.3, y0+8.55, cz + i*2.3); }
    }
    for (const [tx, tz] of [[-1,-1],[1,-1],[-1,1],[1,1]]){
      const x = cx + tx*14.3, z = cz + tz*14.3;
      A.cil(3.6, 3.9, 12, PIEDRA, x, y0+6, z, 0,0,0, 14); A.cil(4.0, 4.0, 0.6, PIEDRA2, x, y0+12.2, z, 0,0,0, 14);
      A.cono(4.4, 5.5, ROJO, x, y0+15.2, z, 14);
      A.cil(0.08, 0.08, 3, '#5a3418', x, y0+19.3, z, 0,0,0, 5); A.caja(1.4, 0.8, 0.06, '#ffd23f', x+0.7, y0+20.4, z);
      for (const a of [0, Math.PI/2, Math.PI, -Math.PI/2]) A.caja(0.6, 1.0, 0.6, '#1a2a4a', x + Math.sin(a)*3.7, y0+7.5, z + Math.cos(a)*3.7);
    }
    /* el portón, en la muralla hacia donde mira la puerta */
    A.caja(sx ? 1.0 : 7.0, 7.2, sx ? 7.0 : 1.0, PIEDRA2, cx + sx*14.4, y0+3.6, cz + sz*14.4);
    A.caja(sx ? 0.5 : 5.0, 6.0, sx ? 5.0 : 0.5, '#4a2a10', cx + sx*14.85, y0+3.0, cz + sz*14.85);
    for (let i=0;i<4;i++) A.caja(sx ? 0.55 : 5.2, 0.16, sx ? 5.2 : 0.55, '#2a1a08', cx + sx*14.86, y0+0.9+i*1.5, cz + sz*14.86);
    A.bola(0.18, '#ffd23f', cx + sx*15.1 + (sx ? 0 : 1.6), y0+3.0, cz + sz*15.1 + (sx ? 1.6 : 0), 6);
    /* la torre del homenaje en el medio, con su tejado y su torre alta */
    A.caja(12, 14, 12, PIEDRA, cx, y0+7, cz); A.caja(12.4, 1.0, 12.4, PIEDRA2, cx, y0+0.5, cz);
    A.pieza(techoGeo(12, 12, 5), ROJO, cx, y0+14, cz);
    for (const a of [0, Math.PI/2, Math.PI, -Math.PI/2]) for (const k of [-3, 0, 3]) A.caja(a===0||a===Math.PI ? 1.0 : 0.3, 1.4, a===0||a===Math.PI ? 0.3 : 1.0, '#bfe9ff', cx + Math.sin(a)*6.1 + (a===0||a===Math.PI ? k : 0), y0+9.5, cz + Math.cos(a)*6.1 + (a===0||a===Math.PI ? 0 : k));
    A.cil(2.4, 2.6, 22, PIEDRA, cx, y0+11, cz, 0,0,0, 12); A.cono(3.0, 4.5, ROJO, cx, y0+24.2, cz, 12);
    A.cil(0.1, 0.1, 4, '#5a3418', cx, y0+28.4, cz, 0,0,0, 5); A.caja(2.2, 1.2, 0.08, '#e63946', cx+1.1, y0+29.8, cz); A.caja(0.7, 0.7, 0.1, '#ffd23f', cx+1.1, y0+29.8, cz);
    const sp = letrero('🏰 EL CASTILLO', '#fff6a0', 'rgba(60,40,20,0.92)', 3.2); sp.position.set(cx, y0+34, cz); mundo.add(sp);
  }
  /* la plataforma de la nave extraterrestre */
  { const v = VEHICULOS_DEF.find(v=>v.id==='ovni'), y = altura(v.x, v.z);
    A.cil(5.4, 5.8, 0.4, '#3a3a48', v.x, y+0.2, v.z, 0,0,0, 24); A.pieza(new THREE.RingGeometry(3.8, 4.6, 32), '#7dffa0', v.x, y+0.42, v.z, -Math.PI/2, 0, 0);
    for (let i=0;i<8;i++){ const a = i/8*6.283; A.bola(0.28, i%2 ? '#7dffa0' : '#ff5aa0', v.x + Math.cos(a)*5.2, y+0.55, v.z + Math.sin(a)*5.2, 6); }
    const sp = letrero('🛸 PLATAFORMA OVNI', '#fff', 'rgba(40,160,80,0.9)', 2); sp.position.set(v.x, y+9, v.z); mundo.add(sp); }
  /* el valle de los dinosaurios: cartel, huesos y una cerca de troncos */
  { const y = altura(VALLE_DINOS.x, VALLE_DINOS.z);
    const sp = letrero('🦕 VALLE DE LOS DINOSAURIOS', '#fff', 'rgba(60,110,40,0.92)', 2.8); sp.position.set(VALLE_DINOS.x, y+10, VALLE_DINOS.z); mundo.add(sp);
    A.cil(0.16, 0.16, 7, '#8b5a2b', VALLE_DINOS.x, y+3.5, VALLE_DINOS.z, 0,0,0, 6);
    for (let i=0;i<3;i++){ const x = VALLE_DINOS.x + Math.cos(i*2.1)*14, z = VALLE_DINOS.z + Math.sin(i*2.1)*14, h = altura(x, z); if (h < 1.5) continue;
      A.cil(0.16, 0.16, 3.2, '#f4f0e0', x, h+0.2, z, Math.PI/2, i*0.8, 0, 6); for (const k of [-1.2, 0, 1.2]) A.cil(0.1, 0.1, 1.4, '#f4f0e0', x + Math.sin(i*0.8)*k, h+0.2, z + Math.cos(i*0.8)*k, Math.PI/2, i*0.8 + Math.PI/2, 0, 5); }
  }
  /* la isla de las bananas: matas de plátano y su cartel */
  for (const p of PLATANOS){
    const y = altura(p.x, p.z), e = p.esc, alto = 3.4*e;
    A.cil(0.22*e, 0.34*e, alto, '#8aa050', p.x, y+alto/2, p.z, 0,0,0, 8);
    for (let k=0;k<6;k++){ const a = p.rot + k/6*6.283; A.bola(1, k%2 ? '#4caf50' : '#43a047', p.x + Math.cos(a)*1.5*e, y+alto+0.2 - (k%2)*0.3, p.z + Math.sin(a)*1.5*e, 8, 0.42*e, 0.09*e, 1.7*e); }
    A.bola(0.5*e, '#43a047', p.x, y+alto+0.35, p.z, 8, 1, 0.6, 1);
    for (let k=0;k<7;k++){ const a = k/7*6.283; A.bola(0.16*e, '#ffd23f', p.x + Math.cos(a)*0.32*e, y+alto-0.55*e, p.z + Math.sin(a)*0.32*e, 6, 0.6, 1.8, 0.6); }
  }
  { const y = altura(ISLA_BANANA.x, ISLA_BANANA.z);
    const sp = letrero('🍌 ISLA DE LAS BANANAS', '#fff6a0', 'rgba(120,80,10,0.92)', 2.8); sp.position.set(ISLA_BANANA.x, y+9, ISLA_BANANA.z); mundo.add(sp);
    A.cil(0.16, 0.16, 6, '#8b5a2b', ISLA_BANANA.x, y+3, ISLA_BANANA.z, 0,0,0, 6);
    const sp2 = letrero('come banana → gorila por 1 minuto 🦍', '#fff', 'rgba(40,40,60,0.85)', 1.6); sp2.position.set(ISLA_BANANA.x, y+6.6, ISLA_BANANA.z); mundo.add(sp2); }
  /* la vereda del lago: tablado de madera por la orilla, baranda hacia el agua, farolas y bancos */
  { const pts = VEREDA.pts;
    mundo.add(new THREE.Mesh(cinta(pts, -2.5, 2.5, '#c9a06a', 0.1, false), matPiso));
    mundo.add(new THREE.Mesh(cinta(pts, -2.55, -2.1, '#8a6a3a', 0.16, false), matPiso));
    mundo.add(new THREE.Mesh(cinta(pts, 2.1, 2.55, '#8a6a3a', 0.16, false), matPiso));
    const b = pts.map(p=>({x:p.x + p.nx*-2.8, z:p.z + p.nz*-2.8, nx:p.nx, nz:p.nz}));
    mundo.add(new THREE.Mesh(cinta(b, -0.07, 0.07, '#f2ece0', 1.1, false), matPiso));
    mundo.add(new THREE.Mesh(cinta(b, -0.05, 0.05, '#f2ece0', 0.6, false), matPiso));
    pts.forEach((p, i)=>{
      const h = altura(p.x, p.z);
      if (i % 2 === 0) A.caja(0.14, 1.2, 0.14, '#f2ece0', p.x + p.nx*-2.8, h+0.7, p.z + p.nz*-2.8);
      if (i % 5 === 1){ const x = p.x + p.nx*3.0, z = p.z + p.nz*3.0, hh = altura(x, z); A.cil(0.12, 0.16, 4.2, '#3a3a44', x, hh+2.1, z, 0,0,0, 6).bola(0.42, '#fff2b0', x, hh+4.4, z, 8); }
      if (i % 6 === 3){ const x = p.x + p.nx*1.6, z = p.z + p.nz*1.6, hh = altura(x, z), ry = Math.atan2(-p.nx, -p.nz);
        A.caja(1.8, 0.1, 0.5, '#8b5a2b', x, hh+0.55, z, 0, ry, 0).caja(1.8, 0.5, 0.1, '#8b5a2b', x - Math.sin(ry)*0.25, hh+0.85, z - Math.cos(ry)*0.25, 0, ry, 0);
        for (const k of [-0.7, 0.7]) A.caja(0.1, 0.5, 0.5, '#3a3a44', x + Math.cos(ry)*k, hh+0.28, z - Math.sin(ry)*k, 0, ry, 0); }
    });
    const c = VEREDA.centro, y = altura(c.x, c.z);
    const sp = letrero('🌴 LA VEREDA DEL LAGO', '#fff', 'rgba(20,110,90,0.92)', 3); sp.position.set(c.x, y+8, c.z); mundo.add(sp);
    A.cil(0.16, 0.16, 5, '#8b5a2b', c.x + VEREDA.pts[17].nx*3.0, y+2.5, c.z + VEREDA.pts[17].nz*3.0, 0,0,0, 6);
    /* un kiosco de jugos a mitad de camino */
    const q = VEREDA.pts[8], kx = q.x + q.nx*5.5, kz = q.z + q.nz*5.5, ky = altura(kx, kz);
    A.caja(3.2, 1.0, 1.4, '#ff8a3d', kx, ky+0.5, kz, 0, Math.atan2(-q.nx, -q.nz), 0).caja(3.6, 0.2, 2.6, '#e63946', kx, ky+2.6, kz, 0, Math.atan2(-q.nx, -q.nz), 0);
    for (const k of [-1.5, 1.5]) A.cil(0.07, 0.07, 2.6, '#f2ece0', kx + Math.cos(Math.atan2(-q.nx, -q.nz))*k, ky+1.3, kz - Math.sin(Math.atan2(-q.nx, -q.nz))*k, 0,0,0, 5);
    const spk = letrero('🥤 JUGOS', '#fff', 'rgba(220,60,40,0.92)', 1.4); spk.position.set(kx, ky+3.4, kz); mundo.add(spk);
  }
  const m = A.malla(matMate()); mundo.add(m);
})();
/* las bananas: giran y brillan como las hamburguesas, y vuelven a aparecer cuando crecen */
const geoBanana = (()=>{ const A = new Armador(); A.pieza(new THREE.TorusGeometry(0.55, 0.15, 8, 14, Math.PI*0.95), '#ffd23f', 0, 0.3, 0, 0, 0, -0.1).bola(0.1, '#5a3418', -0.55, 0.3, 0, 5).bola(0.1, '#5a3418', 0.55, 0.3, 0, 5); return A.geo(); })();
const bananasMesh = BANANAS.map(b=>{
  const m = new THREE.Mesh(geoBanana, matBrillo()); m.scale.set(1.5,1.5,1.5); m.position.set(b.x, b.y, b.z); m.castShadow = true;
  const brillo = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xfff0a0, transparent:true, opacity:0.45, depthWrite:false, blending:THREE.AdditiveBlending}));
  brillo.scale.set(2.4,2.4,1); brillo.position.y = 0.3; m.add(brillo);
  mundo.add(m); return m;
});
/* los dinosaurios sueltos: cuello largo, tiranosaurio y triceratops, con patas que caminan */
function armarDinoLibre(def){
  const g = new THREE.Group(), A = new Armador(), c = def.color, cl = def.claro;
  const patas = [];
  const pata = (x, z, alto, grosor)=>{ const p = new Armador().cil(grosor, grosor*0.85, alto, c, 0, -alto/2, 0, 0,0,0, 8).bola(grosor*1.15, cl, 0, -alto, 0.1, 7, 1.1, 0.45, 1.4).malla(matMate()); p.position.set(x, alto, z); g.add(p); patas.push(p); return p; };
  if (def.tipo==='cuello'){
    A.bola(1.6, c, 0, 2.6, 0, 12, 1.1, 0.9, 1.7).bola(1.1, cl, 0, 2.3, 0.2, 10, 0.9, 0.6, 1.5)
     .cil(0.42, 0.62, 5.2, c, 0, 5.0, 2.2, 0.55, 0, 0, 10).bola(0.62, c, 0, 7.2, 3.6, 10, 1, 0.8, 1.3).caja(0.55, 0.3, 0.9, c, 0, 6.95, 4.3).caja(0.5, 0.2, 0.8, cl, 0, 6.8, 4.25)
     .bola(0.13, '#fff', -0.3, 7.35, 3.9, 6).bola(0.13, '#fff', 0.3, 7.35, 3.9, 6).bola(0.06, '#111', -0.31, 7.36, 4.02, 5).bola(0.06, '#111', 0.31, 7.36, 4.02, 5)
     .cono(0.9, 5.0, c, 0, 2.4, -4.4, 8, Math.PI/2, 0, 0);
    for (let i=0;i<7;i++) A.cono(0.2, 0.42, cl, 0, 4.0 - i*0.12, 1.4 - i*1.0, 4);
    pata(-0.9, 1.3, 2.2, 0.36); pata(0.9, 1.3, 2.2, 0.36); pata(-0.9, -1.3, 2.2, 0.36); pata(0.9, -1.3, 2.2, 0.36);
  } else if (def.tipo==='trex'){
    A.bola(1.2, c, 0, 2.6, -0.2, 12, 1.0, 1.0, 1.7).bola(0.85, cl, 0, 2.3, 0.2, 10, 0.85, 0.7, 1.4)
     .cil(0.55, 0.7, 1.6, c, 0, 3.6, 1.3, 0.8, 0, 0, 10).bola(1.0, c, 0, 4.4, 2.3, 12, 1, 0.9, 1.4).caja(1.0, 0.55, 1.6, c, 0, 3.95, 3.3).caja(0.9, 0.35, 1.4, cl, 0, 3.55, 3.2)
     .bola(0.18, '#fff', -0.42, 4.6, 2.8, 8).bola(0.18, '#fff', 0.42, 4.6, 2.8, 8).bola(0.08, '#111', -0.44, 4.6, 2.96, 6).bola(0.08, '#111', 0.44, 4.6, 2.96, 6)
     .cono(0.85, 4.0, c, 0, 2.6, -3.2, 8, Math.PI/2, 0, 0)
     .caja(0.24, 0.6, 0.24, c, -0.7, 2.9, 1.0, 0.7, 0, 0).caja(0.24, 0.6, 0.24, c, 0.7, 2.9, 1.0, 0.7, 0, 0);
    for (let i=0;i<6;i++) A.caja(0.12, 0.3, 0.1, '#fff', -0.35 + i*0.14, 3.8, 4.1);
    for (let i=0;i<6;i++) A.cono(0.22, 0.5, cl, 0, 3.7 - i*0.15, 0.9 - i*0.75, 4);
    pata(-0.7, -0.3, 2.0, 0.42); pata(0.7, -0.3, 2.0, 0.42);
  } else {
    A.bola(1.5, c, 0, 2.2, 0, 12, 1.1, 0.85, 1.6).bola(1.0, cl, 0, 1.9, 0.2, 10, 0.95, 0.55, 1.4)
     .bola(0.95, c, 0, 2.5, 2.4, 12, 1, 0.85, 1.2).caja(0.8, 0.45, 1.1, c, 0, 2.2, 3.3).caja(0.7, 0.3, 1.0, cl, 0, 1.9, 3.25)
     .pieza(new THREE.CylinderGeometry(1.7, 1.7, 0.3, 16, 1, false, 0, Math.PI), cl, 0, 3.0, 1.7, -0.3, 0, 0)
     .cono(0.14, 1.4, '#fff8e0', 0, 2.5, 3.9, 6, Math.PI/2, 0, 0).cono(0.14, 1.2, '#fff8e0', -0.5, 3.1, 2.9, 6, Math.PI/2, 0, 0).cono(0.14, 1.2, '#fff8e0', 0.5, 3.1, 2.9, 6, Math.PI/2, 0, 0)
     .bola(0.15, '#fff', -0.45, 2.75, 3.0, 7).bola(0.15, '#fff', 0.45, 2.75, 3.0, 7).bola(0.07, '#111', -0.46, 2.75, 3.14, 5).bola(0.07, '#111', 0.46, 2.75, 3.14, 5)
     .cono(0.7, 3.0, c, 0, 2.0, -3.4, 8, Math.PI/2, 0, 0);
    pata(-1.0, 1.1, 1.8, 0.4); pata(1.0, 1.1, 1.8, 0.4); pata(-1.0, -1.1, 1.8, 0.4); pata(1.0, -1.1, 1.8, 0.4);
  }
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  g.partes = {cuerpo, patas}; g.scale.setScalar(def.esc);
  const et = letrero(def.tipo==='cuello' ? '🦕 cuello largo' : def.tipo==='trex' ? '🦖 tiranosaurio' : '🦕 triceratops', '#fff', 'rgba(60,110,40,0.8)', 1.4/def.esc); et.position.y = (def.tipo==='cuello' ? 9 : 6.2); g.add(et); g.etiqueta = et;
  mundo.add(g); return g;
}
const dinosMesh = DINOS.map(armarDinoLibre);
/* los meteoritos que caen y los escombros que dejan */
const meteorosMesh = new Map(), escombros = [];
const geoMeteoro = (()=>{ const A = new Armador(); A.bola(1, '#4a3a30', 0, 0, 0, 8, 1.1, 0.9, 1).bola(0.6, '#6a5040', 0.3, 0.3, 0.2, 6).bola(0.5, '#3a2a20', -0.4, -0.2, 0.3, 6); return A.geo(); })();
const texGlow = texturaResplandor();
function sincronizarNuevos(t){
  const J = P.J;
  P.dinos.forEach((d, i)=>{
    const g = dinosMesh[i], def = DINOS[i], amp = Math.min(1, d.mov/1.5), s = Math.sin(d.fase*(def.tipo==='trex' ? 6 : 4));
    g.position.set(d.x, altura(d.x, d.z), d.z); g.rotation.y = d.ang;
    g.partes.patas.forEach((p, k)=>{ p.rotation.x = s*0.6*amp*(k%2 ? -1 : 1)*(k>=2 ? -1 : 1); });
    g.partes.cuerpo.position.y = Math.abs(Math.cos(d.fase*4))*0.15*amp + (d.mov === 0 ? Math.sin(t*1.5 + i)*0.04 : 0);
    g.partes.cuerpo.rotation.x = d.mov === 0 ? Math.sin(t*0.8 + i)*0.02 : 0;
    g.etiqueta.visible = Math.hypot(d.x-J.x, d.z-J.z) < 60;
  });
  for (const m of P.meteoros){
    let g = meteorosMesh.get(m);
    if (!g){ g = new THREE.Group(); const b = new THREE.Mesh(geoMeteoro, matMate()); b.scale.setScalar(m.r); g.add(b); g.bola = b;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({map: texGlow, color: 0xff8a20, transparent:true, opacity:0.85, depthWrite:false, blending:THREE.AdditiveBlending})); sp.scale.set(m.r*7, m.r*7, 1); g.add(sp); scene.add(g); meteorosMesh.set(m, g); }
    g.position.set(m.x, m.y, m.z); g.bola.rotation.x += 0.12; g.bola.rotation.y += 0.07;
    if (m.t % 2 === 0) particula(m.x + (azar()-0.5)*m.r, m.y + m.r*0.5, m.z + (azar()-0.5)*m.r, m.t % 4 ? '#ffa020' : '#ffe36e', (azar()-0.5)*3, 6+azar()*6, (azar()-0.5)*3, 26, m.r*0.9, {alfa:0.8, aditivo:true, crece:1.6});
  }
  for (const [m, g] of meteorosMesh) if (!P.meteoros.includes(m)){ scene.remove(g); meteorosMesh.delete(m); }
  for (let i=escombros.length-1;i>=0;i--){ const e = escombros[i]; e.t--; e.sp.material.opacity = Math.max(0, e.t/300)*0.7; if (e.t <= 0){ scene.remove(e.g); escombros.splice(i, 1); } }
  bananasMesh.forEach((m, i)=>{ const b = BANANAS[i], te = P.bananasT[b.id]; m.visible = te === undefined || P.t - te >= 60*45; if (!m.visible || Math.abs(b.x-J.x) > 160 || Math.abs(b.z-J.z) > 160) return; m.rotation.y = t*1.8; m.position.y = b.y + Math.sin(t*2.6 + i)*0.18; });
  /* la luz de la casa donde se está */
  if (P.casa){ luzCasa.position.set(P.casa.x, P.casa.y + P.casa.alto - 0.9, P.casa.z); luzCasa.intensity = NOCHE ? 1.7 : 0.9; luzCasa.distance = P.casa.castillo ? 70 : 40; }
  else luzCasa.intensity = 0;
}
function caeMeteoro(e){
  sfx.meteoro(e.d);
  chispas(e.x, e.y + 0.5, e.z, '#ffa020', 34, 14); chispas(e.x, e.y + 0.5, e.z, '#ffe36e', 16, 9);
  for (let i=0;i<18;i++) particula(e.x + (azar()-0.5)*3, e.y + 0.3, e.z + (azar()-0.5)*3, e.agua ? '#dff4ff' : '#8a7a68', (azar()-0.5)*7, 2+azar()*7, (azar()-0.5)*7, 50+azar()*30, 0.5+azar()*0.6, {alfa:0.7, crece:2.5, grav: e.agua ? 10 : 2});
  if (e.d < 110) sacudida = Math.round(clamp(26 - e.d/4, 5, 26));
  if (!e.agua){
    const g = new THREE.Group(); const b = new THREE.Mesh(geoMeteoro, matMate()); b.scale.set(e.r, e.r*0.6, e.r); b.rotation.y = azar()*6; g.add(b);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({map: texGlow, color: 0xff6a20, transparent:true, opacity:0.7, depthWrite:false, blending:THREE.AdditiveBlending})); sp.scale.set(e.r*6, e.r*6, 1); g.add(sp);
    const A = new Armador(); A.pieza(new THREE.CircleGeometry(e.r*2.6, 14), '#3a2e26', 0, 0.05, 0, -Math.PI/2, 0, 0); g.add(A.malla(matMate(), false));
    g.position.set(e.x, e.y, e.z); scene.add(g); escombros.push({g, sp, t: 60*25});
  }
}
/* ---------------- Por dentro: los cuartos de las casas y el salón del castillo ---------------- */
const luzCasa = new THREE.PointLight(0xffe2b8, 0, 48, 1.4); scene.add(luzCasa);
function aclarar(hex, k){ const c = new THREE.Color(hex); c.lerp(new THREE.Color(0xffffff), k===undefined ? 0.45 : k); return '#'+c.getHexString(); }
function armarMueble(m, I){
  const B = new Armador(), w = m.w, d = m.d, H = I.alto;
  /* en el marco del mueble: el frente es +z, w a lo ancho (x) y d a lo hondo (z) ya girados como el cuarto */
  const lw = Math.abs(Math.sin(m.ang)) > 0.5 ? d : w, ld = Math.abs(Math.sin(m.ang)) > 0.5 ? w : d;
  const col = m.color || '#c0392b', MAD = '#8b5a2b', MAD2 = '#a0703a';
  switch (m.t){
    case 'cama': B.caja(lw, 0.5, ld, MAD, 0, 0.25, 0).caja(lw-0.2, 0.35, ld-0.2, '#ffffff', 0, 0.65, 0).caja(lw-0.2, 0.14, ld*0.55, col, 0, 0.88, ld*0.12).bola(0.36, '#ffffff', 0, 0.95, -ld/2+0.55, 8, 1.7, 0.55, 1); break;
    case 'mesita': B.caja(0.9, 0.6, 0.9, MAD, 0, 0.3, 0).cil(0.05, 0.05, 0.5, '#333', 0, 0.85, 0, 0,0,0, 5).cil(0.16, 0.3, 0.32, '#ffe36e', 0, 1.2, 0, 0,0,0, 10); break;
    case 'mesa': B.caja(lw, 0.1, ld, MAD2, 0, 0.75, 0); for (const [x,z] of [[-1,-1],[1,-1],[-1,1],[1,1]]) B.cil(0.06, 0.06, 0.75, MAD, x*(lw/2-0.15), 0.37, z*(ld/2-0.15), 0,0,0, 6);
      B.cil(0.26, 0.26, 0.03, '#ffffff', -0.5, 0.82, 0, 0,0,0, 10).cil(0.1, 0.09, 0.22, '#4fc3f7', 0.5, 0.92, 0.1, 0,0,0, 8).bola(0.14, '#e63946', -0.5, 0.9, 0, 6);
      for (const z of [-1, 1]){ B.caja(0.5, 0.08, 0.5, MAD, 0, 0.45, z*(ld/2+0.4)).caja(0.5, 0.6, 0.08, MAD, 0, 0.78, z*(ld/2+0.62)); for (const [x,zz] of [[-0.2,-0.2],[0.2,-0.2],[-0.2,0.2],[0.2,0.2]]) B.cil(0.03,0.03,0.45,MAD, x, 0.22, z*(ld/2+0.4)+zz, 0,0,0, 4); } break;
    case 'sofa': B.caja(lw, 0.5, ld, col, 0, 0.25, 0).caja(lw, 0.55, 0.32, col, 0, 0.75, -ld/2+0.16).caja(0.3, 0.75, ld, col, -lw/2+0.15, 0.37, 0).caja(0.3, 0.75, ld, col, lw/2-0.15, 0.37, 0)
      .bola(0.32, '#ffe36e', -lw*0.25, 0.62, 0.1, 8, 1.2, 0.5, 1).bola(0.32, '#ffe36e', lw*0.25, 0.62, 0.1, 8, 1.2, 0.5, 1); break;
    case 'tele': B.caja(lw, 0.5, ld, '#3a3a44', 0, 0.25, 0).caja(lw-0.2, 1.0, 0.1, '#111', 0, 1.05, 0).caja(lw-0.4, 0.8, 0.03, '#4fc3f7', 0, 1.05, 0.06).bola(0.16, '#ffd23f', -0.2, 1.1, 0.08, 6).bola(0.1, '#e63946', 0.25, 0.95, 0.08, 6); break;
    case 'cocina': B.caja(lw, 0.9, ld, '#e8e8ea', 0, 0.45, 0).caja(lw+0.06, 0.06, ld+0.06, '#8a8a94', 0, 0.93, 0)
      .cil(0.16, 0.16, 0.03, '#222', -lw*0.25, 0.97, 0, 0,0,0, 8).cil(0.16, 0.16, 0.03, '#222', lw*0.25, 0.97, -ld*0.2, 0,0,0, 8).cil(0.2, 0.18, 0.26, '#c0392b', -lw*0.25, 1.1, 0, 0,0,0, 10).cil(0.13, 0.13, 0.03, '#4fc3f7', lw*0.25, 0.97, ld*0.25, 0,0,0, 8)
      .caja(lw, 0.7, 0.45, '#e8e8ea', 0, 2.1, -ld/2+0.22).caja(0.9, 1.9, 0.8, '#f4f4f8', -lw/2+0.45, 0.95, ld/2+0.45).caja(0.06, 0.6, 0.06, '#8a8a94', -lw/2+0.9, 1.1, ld/2+0.86); break;
    case 'alfombra': B.pieza(new THREE.CylinderGeometry(1, 1, 0.04, 20), aclarar(col, 0.2), 0, 0.03, 0, 0,0,0, lw/2, 1, ld/2).pieza(new THREE.CylinderGeometry(1, 1, 0.045, 20), '#ffffff', 0, 0.03, 0, 0,0,0, lw/2-0.5, 1, ld/2-0.5); break;
    case 'alfombraRoja': B.caja(lw, 0.05, ld, '#c0392b', 0, 0.03, 0).caja(0.25, 0.06, ld, '#ffd23f', -lw/2+0.12, 0.03, 0).caja(0.25, 0.06, ld, '#ffd23f', lw/2-0.12, 0.03, 0); break;
    case 'nevera': B.caja(lw, 2.0, ld, '#e8f0f4', 0, 1.0, 0).caja(lw-0.1, 0.05, 0.05, '#8a8a94', 0, 1.25, ld/2+0.01).caja(0.06, 0.5, 0.06, '#8a8a94', lw*0.35, 1.6, ld/2+0.05).caja(0.06, 0.6, 0.06, '#8a8a94', lw*0.35, 0.7, ld/2+0.05).bola(0.16, '#ff6ec0', -lw*0.25, 1.55, ld/2+0.03, 6, 1, 1, 0.3); break;
    case 'piano': B.caja(lw, 1.0, ld*0.55, '#1a1a20', 0, 0.5, -ld*0.2).caja(lw, 0.12, ld*0.45, '#1a1a20', 0, 0.9, ld*0.25).caja(lw-0.3, 0.06, ld*0.35, '#ffffff', 0, 0.97, ld*0.27);
      for (let i=0;i<10;i++) B.caja(0.08, 0.05, ld*0.2, '#111', -lw/2 + 0.32 + i*(lw-0.6)/9, 1.01, ld*0.22);
      B.caja(lw, 0.5, 0.06, '#1a1a20', 0, 1.25, -ld*0.47).caja(0.9, 0.4, 0.5, '#8b5a2b', 0, 0.2, ld*0.7); break;
    case 'planta': B.cil(0.3, 0.22, 0.5, '#c0392b', 0, 0.25, 0, 0,0,0, 8); for (let i=0;i<5;i++){ const a = i/5*6.283; B.bola(0.32, '#2a9c3a', Math.cos(a)*0.28, 0.85 + (i%2)*0.2, Math.sin(a)*0.28, 6, 1, 1.4, 1); } break;
    case 'lampara': B.cil(0.3, 0.3, 0.05, '#333', 0, 0.03, 0, 0,0,0, 8).cil(0.04, 0.04, 1.6, '#333', 0, 0.8, 0, 0,0,0, 5).cil(0.22, 0.36, 0.4, '#ffe36e', 0, 1.75, 0, 0,0,0, 10); break;
    case 'cuadro': { const y = m.alto || 2.2, pared = lw > ld; B.caja(pared ? lw : 0.12, 1.1, pared ? 0.12 : ld, '#6b3e1e', 0, y, 0).caja(pared ? lw-0.24 : 0.2, 0.86, pared ? 0.2 : ld-0.24, '#8ecbff', 0, y, 0); break; }
    case 'ventana': { const y = m.alto || 2.2; B.caja(lw, 1.5, 0.16, '#bfe9ff', 0, y, 0).caja(lw+0.16, 0.12, 0.2, '#ffffff', 0, y+0.78, 0).caja(lw+0.16, 0.12, 0.2, '#ffffff', 0, y-0.78, 0).caja(0.1, 1.5, 0.2, '#ffffff', 0, y, 0).caja(lw, 0.1, 0.2, '#ffffff', 0, y, 0); break; }
    case 'barra': B.caja(lw, 1.1, ld, '#5a3418', 0, 0.55, 0).caja(lw+0.1, 0.08, ld+0.1, '#d9c6a1', 0, 1.14, 0); for (let i=0;i<5;i++) B.cil(0.07, 0.07, 0.36, ['#2a9c3a','#c0392b','#ffd23f','#4fc3f7','#7b4fa8'][i], -lw*0.4 + i*lw*0.2, 1.36, -ld*0.2, 0,0,0, 6).cil(0.04, 0.04, 0.12, '#222', -lw*0.4 + i*lw*0.2, 1.6, -ld*0.2, 0,0,0, 5);
      B.cil(0.05, 0.05, 0.4, '#c8c8d0', lw*0.3, 1.34, ld*0.1, 0,0,0, 6).caja(0.24, 0.08, 0.08, '#c8c8d0', lw*0.3, 1.52, ld*0.14).cil(0.14, 0.12, 0.3, '#ffd23f', -lw*0.1, 1.33, ld*0.2, 0,0,0, 8).cil(0.14, 0.14, 0.06, '#ffffff', -lw*0.1, 1.5, ld*0.2, 0,0,0, 8); break;
    case 'banqueta': B.cil(0.2, 0.2, 0.04, '#333', 0, 0.02, 0, 0,0,0, 8).cil(0.04, 0.04, 0.7, '#888', 0, 0.37, 0, 0,0,0, 5).cil(0.26, 0.26, 0.08, '#c0392b', 0, 0.76, 0, 0,0,0, 10); break;
    case 'estante': { const y = m.alto || 1.4; B.caja(lw, 0.08, ld, '#5a3418', 0, y, 0).caja(lw, 0.08, ld, '#5a3418', 0, y+0.7, 0); for (let i=0;i<9;i++) B.cil(0.07, 0.07, 0.34, ['#2a9c3a','#c0392b','#ffd23f','#4fc3f7','#ff6ec0'][i%5], -lw*0.45 + i*lw*0.11, y+0.22, 0, 0,0,0, 6); break; }
    case 'mesaRedonda': B.cil(0.9, 0.9, 0.08, MAD2, 0, 0.75, 0, 0,0,0, 16).cil(0.08, 0.08, 0.72, MAD, 0, 0.36, 0, 0,0,0, 6).cil(0.4, 0.4, 0.05, MAD, 0, 0.03, 0, 0,0,0, 10).cil(0.22, 0.22, 0.03, '#ffffff', 0.3, 0.81, 0.1, 0,0,0, 10).cil(0.09, 0.08, 0.2, '#ffe36e', -0.3, 0.9, -0.2, 0,0,0, 8);
      for (let i=0;i<3;i++){ const a = i/3*6.283 + 0.5, x = Math.cos(a)*1.25, z = Math.sin(a)*1.25; B.caja(0.46, 0.08, 0.46, MAD, x, 0.45, z, 0, -a, 0).caja(0.46, 0.55, 0.08, MAD, x + Math.cos(a)*0.22, 0.76, z + Math.sin(a)*0.22, 0, -a + Math.PI/2, 0).cil(0.03, 0.03, 0.45, MAD, x, 0.22, z, 0,0,0, 4); } break;
    case 'rocola': B.caja(lw, 1.7, ld, '#c0392b', 0, 0.85, 0).bola(lw/2, '#ffd23f', 0, 1.7, 0, 10, 1, 0.5, ld/lw).caja(lw-0.3, 0.5, 0.08, '#4fc3f7', 0, 1.15, ld/2).caja(lw-0.3, 0.3, 0.08, '#111', 0, 0.5, ld/2); for (let i=0;i<4;i++) B.bola(0.07, ['#ff5aa0','#7dffa0','#ffe36e','#4fc3f7'][i], -lw*0.3 + i*lw*0.2, 1.5, ld/2, 5); break;
    case 'mostrador': B.caja(lw, 1.0, ld, '#e63946', 0, 0.5, 0).caja(lw+0.1, 0.08, ld+0.1, '#ffffff', 0, 1.04, 0).caja(lw*0.8, 0.5, 0.06, '#ffd23f', 0, 0.55, ld/2);
      { const geo = m.comida==='AREPAS' ? arepaGeo() : m.comida==='BURGER' ? hamburguesaGeo() : null; if (geo) B.pieza(geo, '#ffffff', -lw*0.3, 1.1, 0, 0,0,0, 1.6, 1.6, 1.6); }
      B.caja(0.5, 0.4, 0.4, '#333', lw*0.3, 1.28, -ld*0.1).caja(0.36, 0.28, 0.05, '#7dffa0', lw*0.3, 1.3, ld*0.1); break;
    case 'estanteTienda': B.caja(lw, 1.9, ld, '#8a8a94', 0, 0.95, 0); for (let f=0;f<3;f++) for (let i=0;i<6;i++) B.caja(0.36, 0.42, 0.36, ['#e63946','#4fc3f7','#ffd23f','#2a9c3a','#ff6ec0','#7b4fa8'][(i+f)%6], -lw*0.42 + i*lw*0.168, 0.5 + f*0.62, ld/2 - 0.1); break;
    case 'llantas': for (let i=0;i<3;i++) B.pieza(new THREE.TorusGeometry(0.55, 0.2, 8, 14), '#222', 0, 0.2 + i*0.42, 0, Math.PI/2, 0, 0); break;
    case 'trono': B.caja(lw, 0.6, ld, '#ffd23f', 0, 0.3, 0).caja(1.6, 0.5, 1.2, '#c0392b', 0, 0.85, 0.15).caja(1.7, 2.8, 0.34, '#ffd23f', 0, 1.9, -ld/2+0.2).caja(1.3, 2.0, 0.1, '#c0392b', 0, 1.7, -ld/2+0.4)
      .caja(0.3, 0.6, 1.2, '#ffd23f', -0.95, 1.3, 0.1).caja(0.3, 0.6, 1.2, '#ffd23f', 0.95, 1.3, 0.1).bola(0.22, '#e63946', 0, 3.35, -ld/2+0.2, 8).bola(0.15, '#4fc3f7', -0.6, 3.1, -ld/2+0.2, 6).bola(0.15, '#4fc3f7', 0.6, 3.1, -ld/2+0.2, 6); break;
    case 'columna': B.cil(0.55, 0.65, H-0.6, '#d0d0d8', 0, H/2-0.3, 0, 0,0,0, 12).caja(1.6, 0.4, 1.6, '#b8b8c4', 0, 0.2, 0).caja(1.6, 0.4, 1.6, '#b8b8c4', 0, H-0.5, 0); break;
    case 'estandarte': B.caja(1.4, 0.12, 0.12, '#5a3418', 0, 4.4, 0.1).caja(1.2, 2.2, 0.08, '#c0392b', 0, 3.2, 0.1).caja(1.2, 0.3, 0.09, '#ffd23f', 0, 4.2, 0.1).bola(0.3, '#ffd23f', 0, 3.1, 0.16, 8, 1, 1, 0.3); break;
    case 'candelabro': { const y = H-2.2; B.cil(0.04, 0.04, 2.0, '#5a4a3a', 0, y+1.0, 0, 0,0,0, 5).pieza(new THREE.TorusGeometry(1.3, 0.09, 8, 20), '#c9a032', 0, y, 0, Math.PI/2, 0, 0);
      for (let i=0;i<8;i++){ const a = i/8*6.283; B.cil(0.06, 0.06, 0.4, '#fff8e0', Math.cos(a)*1.3, y+0.25, Math.sin(a)*1.3, 0,0,0, 5).bola(0.09, '#ffa020', Math.cos(a)*1.3, y+0.55, Math.sin(a)*1.3, 5, 1, 1.6, 1); } break; }
    case 'mesaBanquete': B.caja(lw, 0.12, ld, MAD2, 0, 0.9, 0); for (const [x,z] of [[-1,-1],[1,-1],[-1,1],[1,1]]) B.caja(0.16, 0.9, 0.16, MAD, x*(lw/2-0.3), 0.45, z*(ld/2-0.3));
      for (const z of [-1, 1]){ B.caja(lw, 0.08, 0.4, MAD, 0, 0.45, z*(ld/2+0.5)); for (const x of [-1, 1]) B.caja(0.14, 0.45, 0.4, MAD, x*(lw/2-0.4), 0.22, z*(ld/2+0.5)); }
      B.bola(0.5, '#c8763a', 0, 1.25, 0, 10, 1.4, 0.7, 1).cil(0.6, 0.6, 0.06, '#ffffff', 0, 0.99, 0, 0,0,0, 12); for (let i=0;i<6;i++) B.bola(0.16, ['#e63946','#ffd23f','#7dffa0','#ff8a3d','#c07dff','#4fc3f7'][i], -lw*0.4 + i*lw*0.16, 1.1, (i%2 ? 0.6 : -0.6), 6);
      for (let i=0;i<4;i++) B.cil(0.1, 0.09, 0.2, '#c9a032', -lw*0.3 + i*lw*0.2, 1.06, (i%2 ? -0.7 : 0.7), 0,0,0, 6); break;
    case 'armadura': B.caja(0.7, 0.5, 0.7, '#5a5a66', 0, 0.25, 0).caja(0.22, 0.8, 0.26, '#c8c8d0', -0.16, 0.9, 0).caja(0.22, 0.8, 0.26, '#c8c8d0', 0.16, 0.9, 0).caja(0.7, 0.9, 0.45, '#d8d8e0', 0, 1.75, 0).bola(0.32, '#c8c8d0', 0, 2.45, 0, 10).caja(0.4, 0.1, 0.1, '#222', 0, 2.45, 0.28)
      .caja(0.16, 0.8, 0.2, '#c8c8d0', -0.5, 1.7, 0.1).caja(0.16, 0.8, 0.2, '#c8c8d0', 0.5, 1.7, 0.1).cil(0.04, 0.04, 1.6, '#e8e8f0', 0.55, 2.0, 0.35, 0,0,0, 5).caja(0.3, 0.06, 0.1, '#c9a032', 0.55, 1.5, 0.35).cil(0.45, 0.45, 0.06, '#c0392b', -0.62, 1.6, 0.3, Math.PI/2, 0, 0, 10).cono(0.12, 0.35, '#e63946', 0, 2.95, 0, 6); break;
    case 'pista': B.pieza(new THREE.CylinderGeometry(1, 1, 0.08, 28), '#e8c890', 0, 0.04, 0, 0,0,0, lw/2, 1, ld/2).pieza(new THREE.TorusGeometry(1, 0.05, 6, 28), '#e63946', 0, 0.12, 0, Math.PI/2, 0, 0, lw/2, ld/2, 1); for (let i=0;i<10;i++){ const a = i/10*6.283; B.bola(0.16, i%2 ? '#ffd23f' : '#ffffff', Math.cos(a)*lw/2, 0.2, Math.sin(a)*ld/2, 5); } break;
    case 'poste': B.cil(0.3, 0.36, H, '#e63946', 0, H/2, 0, 0,0,0, 10); for (let i=0;i<8;i++) B.cil(0.32, 0.32, 0.3, '#ffd23f', 0, 1 + i*1.4, 0, 0,0,0, 10); break;
    case 'grada': { const y = m.alto || 0.5; B.caja(lw, 0.5, ld, ['#e63946','#4fc3f7','#ffd23f'][m.fila||0], 0, y - 0.25, 0).caja(lw, 0.08, ld+0.1, '#ffffff', 0, y, 0); for (let i=0;i<Math.floor(lw/3);i++) B.caja(0.9, 0.5, 0.5, ['#e63946','#4fc3f7','#7dffa0'][i%3], -lw/2 + 1.5 + i*3, y + 0.25, 0.2); break; }
    case 'pedestal': B.cil(lw/2, lw/2+0.2, 1.0, '#e63946', 0, 0.5, 0, 0,0,0, 14).cil(lw/2+0.1, lw/2+0.1, 0.12, '#ffd23f', 0, 1.06, 0, 0,0,0, 14); for (let i=0;i<8;i++){ const a = i/8*6.283; B.bola(0.12, '#ffffff', Math.cos(a)*lw/2, 0.5, Math.sin(a)*lw/2, 5); } break;
    case 'pelota': B.bola(lw/2, '#4fc3f7', 0, lw/2, 0, 14).bola(lw/2+0.01, '#e63946', 0, lw/2, 0, 14, 1, 0.3, 1).bola(lw/2+0.02, '#ffd23f', 0, lw/2, 0, 14, 0.3, 1, 1); break;
    case 'trapecio': { const y = m.alto || 9; for (const sx of [-1, 1]) B.cil(0.03, 0.03, H-y, '#e8e0c0', sx*1.2, y + (H-y)/2, 0, 0,0,0, 4); B.cil(0.05, 0.05, 2.6, '#c9a032', 0, y, 0, 0,0,Math.PI/2, 6); break; }
    case 'arbolNavidad': B.cil(0.2, 0.25, 0.8, '#5a3418', 0, 0.4, 0, 0,0,0, 6); for (let k=0;k<4;k++) B.cono(1.1 - k*0.22, 1.0, k%2 ? '#2e7d32' : '#43a047', 0, 0.9 + k*0.65, 0, 8); for (let k=0;k<10;k++){ const a = k*0.9; B.bola(0.1, ['#e63946','#ffd23f','#4fc3f7','#ff6ec0'][k%4], Math.cos(a)*(0.9 - k*0.07), 1.0 + k*0.3, Math.sin(a)*(0.9 - k*0.07), 5); } B.bola(0.16, '#ffd23f', 0, 3.6, 0, 6); break;
    case 'regalos': for (let i=0;i<5;i++){ const x = -lw/2 + 0.4 + (i%3)*0.9, z = -ld/2 + 0.4 + Math.floor(i/3)*0.9, sz = 0.5 + (i%2)*0.2; B.caja(sz, sz, sz, ['#e63946','#4fc3f7','#7dffa0','#ffd23f','#ff6ec0'][i], x, sz/2, z).caja(sz+0.04, 0.1, sz+0.04, '#ffffff', x, sz/2, z).caja(0.1, sz+0.04, sz+0.04, '#ffffff', x, sz/2, z).bola(0.1, '#ffffff', x, sz+0.05, z, 5); } break;
    case 'chimenea': B.caja(lw, 2.8, ld, '#8a6a5a', 0, 1.4, 0).caja(lw-0.5, 1.4, ld*0.6, '#2a1a10', 0, 0.75, ld*0.3).caja(lw+0.2, 0.16, ld+0.2, '#5a3a2a', 0, 2.85, 0)
      .bola(0.28, '#ff8a20', -0.3, 0.45, ld*0.3, 6, 1, 1.6, 1).bola(0.24, '#ffd23f', 0.25, 0.4, ld*0.3, 6, 1, 1.5, 1).cil(0.1, 0.1, 0.9, '#5a3418', 0, 0.2, ld*0.3, 0,0,Math.PI/2, 5).caja(lw, H-3.0, ld*0.7, '#8a6a5a', 0, 2.9+(H-3.0)/2, -ld*0.15); break;
  }
  const mm = B.malla(matMate()); mm.position.set(m.x - I.x, 0, m.z - I.z); mm.rotation.y = m.ang;
  return mm;
}
const interioresMesh = INTERIORES.map(I=>{
  const g = new THREE.Group(); g.position.set(I.x, I.y, I.z);
  const A = new Armador(), c = I.c, W2 = I.hw, D2 = I.hd, H = I.alto;
  const pared = c.castillo ? '#9a9aa4' : c.circo ? '#e63946' : aclarar(c.color, 0.5), piso = c.castillo ? '#6e6a70' : c.circo ? '#c9a06a' : (c.letrero || c.gasolinera ? '#e0d8c8' : '#c9a06a'), techo = c.castillo ? '#5a5a66' : c.circo ? '#ffd23f' : '#f4f2ee';
  A.caja(W2*2+0.6, 0.3, D2*2+0.6, piso, 0, -0.15, 0).caja(W2*2+0.6, 0.3, D2*2+0.6, techo, 0, H+0.15, 0);
  A.caja(W2*2+0.6, H, 0.3, pared, 0, H/2, -D2-0.15).caja(W2*2+0.6, H, 0.3, pared, 0, H/2, D2+0.15).caja(0.3, H, D2*2+0.6, pared, -W2-0.15, H/2, 0).caja(0.3, H, D2*2+0.6, pared, W2+0.15, H/2, 0);
  const zoc = c.castillo ? '#6a6a74' : '#8b5a2b';
  A.caja(W2*2, 0.25, 0.12, zoc, 0, 0.12, -D2+0.06).caja(W2*2, 0.25, 0.12, zoc, 0, 0.12, D2-0.06).caja(0.12, 0.25, D2*2, zoc, -W2+0.06, 0.12, 0).caja(0.12, 0.25, D2*2, zoc, W2-0.06, 0.12, 0);
  if (c.castillo){ for (let i=0;i<9;i++) for (let j=0;j<7;j++) if ((i+j)%2===0) A.caja(2.6, 0.04, 2.6, '#7e7a80', -W2+2+i*3.1, 0.02, -D2+2+j*3.2); }
  if (c.circo){ for (let i=0;i<12;i++){ const a = i/12*6.283; A.caja(2.0, H, 0.3, i%2 ? '#ffd23f' : '#e63946', Math.cos(a)*(W2-0.3), H/2, Math.sin(a)*(D2-0.3), 0, -a, 0); } for (let i=0;i<8;i++) A.cono(3.6, 1.6, i%2 ? '#e63946' : '#ffd23f', -W2 + 2.4 + i*4.6, H-0.6, D2-0.2, 8, Math.PI, 0, 0); }
  /* la puerta de adentro, en la pared del frente */
  const s = Math.sin(I.ang), co = Math.cos(I.ang), lado = Math.abs(s) > 0.5, dx = I.px - I.x, dz = I.pz - I.z;
  const pw = c.castillo || c.circo ? 3.2 : 1.4, ph = c.castillo || c.circo ? 5 : 2.4;
  A.caja(lado ? 0.24 : pw+0.5, ph+0.3, lado ? pw+0.5 : 0.24, c.castillo ? '#6a6a74' : '#ffffff', dx - s*0.22, ph/2+0.1, dz - co*0.22);
  A.caja(lado ? 0.2 : pw, ph, lado ? pw : 0.2, c.castillo ? '#4a2a10' : '#6b3e1e', dx - s*0.28, ph/2, dz - co*0.28);
  A.bola(0.1, '#ffd23f', dx - s*0.42 + (lado ? 0 : pw*0.32), ph*0.45, dz - co*0.42 + (lado ? pw*0.32 : 0), 6);
  /* ventanas en las paredes de los lados (hacia afuera no hay nada: las hacemos brillantes) */
  if (!c.castillo && !c.circo){ for (const sx of [-1, 1]) A.caja(0.16, 1.3, 1.8, '#bfe9ff', sx*(W2-0.08), 2.3, -D2*0.3).caja(0.2, 0.1, 1.9, '#ffffff', sx*(W2-0.08), 2.3, -D2*0.3).caja(0.2, 1.4, 0.1, '#ffffff', sx*(W2-0.08), 2.3, -D2*0.3); }
  else if (c.castillo){ for (const sx of [-1, 1]) for (const k of [-0.6, 0, 0.6]) A.caja(0.16, 3.0, 1.2, '#bfe9ff', sx*(W2-0.08), 5.5, k*D2).caja(0.2, 3.2, 0.2, '#6a6a74', sx*(W2-0.08), 5.5, k*D2); }
  /* la lámpara del techo */
  if (!c.castillo && !c.circo) A.cil(0.03, 0.03, 0.7, '#333', 0, H-0.35, 0, 0,0,0, 4).cil(0.3, 0.55, 0.4, '#ffe36e', 0, H-0.9, 0, 0,0,0, 12).bola(0.16, '#fff8e0', 0, H-1.0, 0, 6);
  g.add(A.malla(matMate()));
  for (const m of I.muebles){ const mm = armarMueble(m, I); g.add(mm);
    { const lw = Math.abs(Math.sin(m.ang)) > 0.5 ? m.d : m.w;
      if (m.t==='tele'){ const pn = new THREE.Mesh(new THREE.PlaneGeometry(lw-0.4, 0.8), new THREE.MeshBasicMaterial({color:0x1a2a3a})); pn.position.set(0, 1.05, 0.1); mm.add(pn); m.vista = {pantalla:pn}; }
      else if (m.t==='lampara'){ const sp = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xffe9a0, transparent:true, opacity:0.55, depthWrite:false, blending:THREE.AdditiveBlending})); sp.scale.set(3, 3, 1); sp.position.set(0, 1.75, 0); sp.visible = false; mm.add(sp); m.vista = {brillo:sp}; }
      else if (m.t==='arbolNavidad'){ const luces = []; for (let i=0;i<10;i++){ const l = new THREE.Mesh(new THREE.SphereGeometry(0.09, 5, 4), new THREE.MeshBasicMaterial({color: [0xff4040, 0x40ff60, 0x4090ff, 0xffe040][i%4]})); const a = i*1.9, r = 0.55 - i*0.04; l.position.set(Math.cos(a)*r, 1.0 + i*0.19, Math.sin(a)*r); l.visible = false; mm.add(l); luces.push(l); } m.vista = {luces}; } } if (m.t==='cuadro' && m.texto){ const sp = letrero(m.texto, '#fff', 'rgba(0,0,0,0)', 0.8); sp.position.set(m.x - I.x + (m.w > m.d ? 0 : (m.x > I.x ? -0.25 : 0.25)), (m.alto||2.2), m.z - I.z + (m.w > m.d ? (m.z > I.z ? -0.25 : 0.25) : 0)); g.add(sp); } }
  const et = letrero((c.castillo ? '🏰 ' : c.circo ? '🎪 ' : c.santa ? '🎅 ' : c.letrero==='BAR' ? '🍺 ' : c.letrero==='BURGER' ? '🍔 ' : c.letrero==='AREPAS' ? '🫓 ' : c.gasolinera ? '⛽ ' : '🏠 ') + c.nombre.toUpperCase(), '#fff', 'rgba(20,20,50,0.8)', c.castillo || c.circo ? 3 : 1.6);
  et.position.set(0, H-0.6-(c.castillo ? 1.2 : 0), -D2+0.6); g.add(et);
  if (NOCHE){ const sp = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xffd27a, transparent:true, opacity:0.5, depthWrite:false, blending:THREE.AdditiveBlending})); sp.scale.set(8, 8, 1); sp.position.set(0, H-1.0, 0); g.add(sp); }
  mundo.add(g); return g;
});
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
/* brazos y piernas redondeados: un cilindro con una manito (bola) o un zapato (bola aplastada) al final */
function extremidad(w, h, d, color, pie, colorPie){
  const A = new Armador();
  A.cil(w*0.52, w*0.46, h, color, 0, -h/2, 0, 0,0,0, 10);
  if (pie) A.bola(w*0.56, colorPie||'#3a2a1a', 0, -h+0.04, 0.07, 8, 1, 0.55, 1.55);
  else A.bola(w*0.5, colorPie||PIEL, 0, -h-0.01, 0, 8);
  return A.malla(matMate());
}
/* las personas: cabeza redonda, tronco en forma de cápsula y caritas con nariz, orejas y cachetes */
function armarPersona(id, extra){
  extra = extra || {};
  const g = new THREE.Group();
  const A = new Armador();
  const R = {};
  const torso = (color, alto)=>{
    const h = alto||0.7;
    A.cil(0.31, 0.27, h, color, 0, 0.72+h/2, 0, 0,0,0, 14);
    A.bola(0.31, color, 0, 0.72+h, 0, 12, 1, 0.45, 1);          /* los hombros */
    A.bola(0.27, color, 0, 0.72, 0, 12, 1, 0.4, 1);             /* la cadera */
  };
  const falda = (color)=>{ A.cil(0.29, 0.5, 0.5, color, 0, 0.62, 0, 0,0,0,14); };
  const cabeza = (piel)=>{
    const p = piel||PIEL;
    A.cil(0.1, 0.11, 0.16, p, 0, 1.46, 0, 0,0,0, 8);                                            /* el cuello */
    A.bola(0.32, p, 0, 1.76, 0, 14, 1, 1.05, 0.92);                                             /* la cabeza */
    A.bola(0.065, p, -0.3, 1.76, 0, 7); A.bola(0.065, p, 0.3, 1.76, 0, 7);                      /* las orejas */
    A.bola(0.068, '#ffffff', -0.12, 1.82, 0.26, 8); A.bola(0.068, '#ffffff', 0.12, 1.82, 0.26, 8); /* los ojos */
    A.bola(0.036, '#222', -0.11, 1.825, 0.315, 6); A.bola(0.036, '#222', 0.13, 1.825, 0.315, 6);
    A.bola(0.04, p, 0, 1.74, 0.31, 6);                                                          /* la nariz */
    A.caja(0.18, 0.04, 0.04, '#b0483a', 0, 1.64, 0.29);                                         /* la boca */
    A.bola(0.05, '#ffa0a0', -0.21, 1.69, 0.23, 6); A.bola(0.05, '#ffa0a0', 0.21, 1.69, 0.23, 6); /* los cachetes */
  };
  /* media esfera (solo la mitad de arriba): sirve de pelo y de gorra sin tapar la cara */
  const casco = (r, color, y, sx, sy, sz)=>{ A.pieza(new THREE.SphereGeometry(r, 14, 8, 0, Math.PI*2, 0, Math.PI/2), color, 0, y, 0, 0,0,0, sx, sy, sz); };
  const gorra = (color)=>{ casco(0.35, color, 1.9, 1, 0.75, 0.98); A.cil(0.352, 0.352, 0.04, color, 0, 1.9, 0, 0,0,0, 16); A.cil(0.2, 0.2, 0.045, color, 0, 1.9, 0.32, 0,0,0, 12); };
  const pelo = (color, alto)=>{ casco(0.345, color, 1.87, 1.02, 0.75+(alto||0), 1.02); A.bola(0.29, color, 0, 1.72, -0.13, 12, 1.15, 0.95, 0.72); };
  const melena = (color)=>{ pelo(color, 0.05); A.cil(0.09, 0.1, 0.62, color, -0.32, 1.58, -0.04, 0,0,0, 8); A.cil(0.09, 0.1, 0.62, color, 0.32, 1.58, -0.04, 0,0,0, 8); A.bola(0.24, color, 0, 1.5, -0.24, 12, 1.4, 1.5, 0.7); };
  const bigote = ()=>{ A.cil(0.045, 0.045, 0.32, '#3a2a1a', 0, 1.68, 0.3, 0,0,Math.PI/2, 8); };
  const barba = (color)=>{ A.bola(0.22, color||'#3a2a1a', 0, 1.56, 0.18, 10, 1.1, 0.45, 0.75); };
  const lentes = ()=>{
    A.pieza(new THREE.TorusGeometry(0.09, 0.018, 6, 14), '#1a1a1a', -0.13, 1.82, 0.31); A.pieza(new THREE.TorusGeometry(0.09, 0.018, 6, 14), '#1a1a1a', 0.13, 1.82, 0.31);
    A.caja(0.08, 0.02, 0.02, '#1a1a1a', 0, 1.82, 0.31);
    A.cil(0.08, 0.08, 0.015, '#8ecbff', -0.13, 1.82, 0.31, Math.PI/2, 0, 0, 12); A.cil(0.08, 0.08, 0.015, '#8ecbff', 0.13, 1.82, 0.31, Math.PI/2, 0, 0, 12);
  };
  let ropa = '#d82800', piel = PIEL, esc = 1, brazoColor = null;
  switch(id){
    case 'fernando': ropa = '#d82800'; torso(ropa); A.cil(0.315, 0.28, 0.34, '#2038ec', 0, 0.9, 0, 0,0,0, 14); A.cil(0.04, 0.04, 0.5, '#2038ec', -0.2, 1.2, 0.29, 0,0,0, 6); A.cil(0.04, 0.04, 0.5, '#2038ec', 0.2, 1.2, 0.29, 0,0,0, 6);
      A.bola(0.05, '#ffd23f', -0.2, 1.05, 0.31, 6); A.bola(0.05, '#ffd23f', 0.2, 1.05, 0.31, 6);
      cabeza(); casco(0.335, '#5a3418', 1.85, 1.02, 0.7, 1.0); gorra('#d82800'); A.bola(0.065, '#fff', 0, 2.03, 0.26, 8); esc = 0.8; break;
    case 'cucu': ropa = '#ff6ec0'; torso(ropa); falda(ropa); cabeza(); pelo('#3b2410'); A.cil(0.09, 0.07, 0.5, '#3b2410', -0.42, 1.7, 0, 0,0,0, 8); A.cil(0.09, 0.07, 0.5, '#3b2410', 0.42, 1.7, 0, 0,0,0, 8);
      A.bola(0.1, '#ff6ec0', -0.42, 1.98, 0, 6); A.bola(0.1, '#ff6ec0', 0.42, 1.98, 0, 6); esc = 0.74; break;
    case 'luca': ropa = '#ffe36e'; piel = '#e8b088'; torso(ropa); cabeza(piel); casco(0.335, '#3a2a1a', 1.85, 1.02, 0.7, 1.0); gorra('#2a9c3a'); esc = 0.76; break;
    case 'salomon': ropa = '#d86a28'; piel = '#c88a5a'; torso(ropa); cabeza(piel); lentes();
      for (const [x,z] of [[-0.2,-0.2],[0.2,-0.2],[-0.2,0.2],[0.2,0.2],[0,0],[0,-0.3],[0.3,0],[-0.3,0]]) A.bola(0.17, '#2a1a0a', x, 2.08, z, 8); esc = 0.76; break;
    case 'tiojuan': ropa = '#1560d0'; torso(ropa); cabeza(); pelo('#222'); A.cil(0.15, 0.15, 0.04, '#ffe36e', 0, 1.15, 0.3, Math.PI/2, 0, 0, 12); A.caja(0.1, 0.16, 0.04, '#d82800', 0, 1.15, 0.32);
      A.cil(0.3, 0.3, 0.16, '#d82800', 0, 0.76, 0, 0,0,0, 14); esc = 1.0; break;
    case 'nacho': ropa = '#ffe36e'; piel = '#d8a070'; torso(ropa); cabeza(piel); bigote(); A.cil(0.72, 0.72, 0.06, '#e8a33d', 0, 2.06, 0, 0,0,0,16); A.cil(0.3, 0.36, 0.34, '#e8a33d', 0, 2.24, 0, 0,0,0,12); A.bola(0.3, '#e8a33d', 0, 2.4, 0, 10, 1, 0.5, 1); break;
    case 'yanny': ropa = '#40c0b0'; torso(ropa); falda(ropa); cabeza(); melena('#7a3aa8'); esc = 0.95; break;
    case 'tiofran': ropa = '#8a6a3a'; torso(ropa); cabeza(); pelo('#3a2a1a'); bigote(); break;
    case 'romulo': ropa = '#b8b8c8'; piel = '#9a9aae'; torso(ropa); A.cil(0.1, 0.11, 0.16, piel, 0, 1.46, 0, 0,0,0, 8); A.bola(0.32, piel, 0, 1.76, 0, 14, 1.05, 1, 0.95); A.caja(0.6, 0.16, 0.06, '#2a2a34', 0, 1.84, 0.28);
      A.bola(0.055, '#fff', -0.13, 1.84, 0.315, 7); A.bola(0.055, '#fff', 0.13, 1.84, 0.315, 7);
      A.cono(0.1, 0.22, piel, -0.24, 2.12, 0, 8); A.cono(0.1, 0.22, piel, 0.24, 2.12, 0, 8); A.bola(0.08, '#3a3a44', 0, 1.64, 0.3, 7);
      A.cil(0.06, 0.08, 0.7, piel, 0, 0.7, -0.35, 0.7, 0, 0, 8); A.bola(0.1, '#3a3a44', 0, 0.95, -0.55, 7);
      brazoColor = piel; break;
    case 'abu': ropa = '#7b4fa8'; torso(ropa); falda(ropa); cabeza(); pelo('#cfcfcf'); A.bola(0.2, '#cfcfcf', 0, 2.22, -0.1, 8); lentes(); esc = 0.92; break;
    case 'mama': ropa = '#ff6ea8'; torso(ropa); falda(ropa); cabeza(); melena('#5a3418'); A.bola(0.1, '#e0304a', 0, 1.64, 0.28, 8, 1, 0.4, 0.5); esc = 0.96; break;
    case 'papa': ropa = '#2a6ad0'; torso(ropa); cabeza(); gorra('#1560d0'); barba('#8a5a3a'); esc = 1.04; break;
    case 'beto': ropa = '#2a9c6a'; piel = '#e8b088'; torso(ropa); cabeza(piel); pelo('#2a2a2a'); lentes(); barba(); break;
    case 'giuliana': ropa = '#ff8a3d'; torso(ropa); falda(ropa); cabeza(); melena('#7a4a1a'); esc = 0.95; break;
    case 'santi': ropa = '#9bd1ff'; torso(ropa, 0.5); A.bola(0.4, PIEL, 0, 1.62, 0, 14, 1, 0.95, 0.95); A.bola(0.075, '#fff', -0.15, 1.68, 0.33, 8); A.bola(0.075, '#fff', 0.15, 1.68, 0.33, 8);
      A.bola(0.04, '#222', -0.14, 1.685, 0.39, 6); A.bola(0.04, '#222', 0.16, 1.685, 0.39, 6);
      A.bola(0.06, '#ffa0a0', -0.27, 1.55, 0.27, 6); A.bola(0.06, '#ffa0a0', 0.27, 1.55, 0.27, 6); A.cil(0.12, 0.12, 0.08, '#ff6ec0', 0, 1.5, 0.37, Math.PI/2, 0, 0, 10); A.bola(0.08, '#ffd23f', 0, 1.5, 0.44, 6);
      A.bola(0.1, '#5a3418', 0, 2.0, 0.02, 8, 1, 0.7, 1); esc = 0.55; break;
    case 'santa': ropa = '#c0392b'; torso(ropa); A.cil(0.33, 0.3, 0.22, '#ffffff', 0, 0.78, 0, 0,0,0, 14).cil(0.3, 0.3, 0.14, '#222', 0, 0.98, 0, 0,0,0, 14).caja(0.16, 0.16, 0.06, '#ffd23f', 0, 0.98, 0.3);
      cabeza(); A.bola(0.3, '#ffffff', 0, 1.55, 0.14, 10, 1.15, 0.6, 0.9).bola(0.34, '#ffffff', 0, 1.42, 0.1, 10, 1.0, 0.7, 0.8).cil(0.05, 0.05, 0.36, '#ffffff', 0, 1.7, 0.3, 0,0,Math.PI/2, 6);
      casco(0.345, '#c0392b', 1.87, 1.02, 0.85, 1.02); A.cil(0.37, 0.37, 0.14, '#ffffff', 0, 1.9, 0, 0,0,0, 16).cono(0.3, 0.7, '#c0392b', 0.05, 2.45, -0.1, 10, 0.35, 0, 0.3).bola(0.13, '#ffffff', 0.3, 2.62, -0.28, 8); esc = 1.08; break;
    case 'vampiro': ropa = '#1a1a24'; piel = '#e8e0f0'; torso(ropa); A.caja(0.34, 0.5, 0.04, '#ffffff', 0, 1.12, 0.3).caja(0.3, 0.12, 0.06, '#c0392b', 0, 1.34, 0.31);
      cabeza(piel); A.caja(0.06, 0.12, 0.04, '#ffffff', -0.06, 1.6, 0.3).caja(0.06, 0.12, 0.04, '#ffffff', 0.06, 1.6, 0.3);
      pelo('#111'); A.cil(0.36, 0.36, 0.06, '#111', 0, 2.06, 0, 0,0,0, 14).cil(0.26, 0.26, 0.5, '#111', 0, 2.33, 0, 0,0,0, 14).cil(0.27, 0.27, 0.08, '#c0392b', 0, 2.14, 0, 0,0,0, 14); esc = 1.0; break;
    case 'payaso': ropa = extra.color || '#e63946'; torso(ropa); for (const [x,y] of [[-0.14,1.2],[0.14,1.0],[-0.14,0.8]]) A.bola(0.07, '#ffd23f', x, y, 0.31, 6);
      cabeza('#ffe8d8'); A.bola(0.09, '#e63946', 0, 1.74, 0.34, 8); A.caja(0.24, 0.05, 0.04, '#e63946', 0, 1.62, 0.3);
      for (let i=0;i<7;i++){ const a = i/7*6.283; A.bola(0.16, extra.pelo || '#ff8a3d', Math.cos(a)*0.3, 2.02 + Math.sin(a*2)*0.05, Math.sin(a)*0.3, 8); } A.bola(0.16, extra.pelo || '#ff8a3d', 0, 2.14, 0, 8);
      A.bola(0.07, '#4fc3f7', -0.12, 1.85, 0.3, 5); A.bola(0.07, '#4fc3f7', 0.12, 1.85, 0.3, 5); esc = 0.96; brazoColor = extra.color || '#e63946'; break;
    default: torso(ropa); cabeza(); pelo('#3a2a1a');
  }
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  const bI = extremidad(0.19, 0.62, 0.19, brazoColor||ropa, false, piel), bD = extremidad(0.19, 0.62, 0.19, brazoColor||ropa, false, piel);
  bI.position.set(-0.36, 1.38, 0); bD.position.set(0.36, 1.38, 0);
  const colP = id==='cucu'||id==='yanny'||id==='abu'||id==='mama'||id==='giuliana' ? PIEL : id==='fernando' ? '#2038ec' : id==='romulo' ? piel : id==='santa' ? '#c0392b' : id==='vampiro' ? '#1a1a24' : id==='payaso' ? (extra.pantalon || '#ffd23f') : '#3a4a8a', colZ = id==='fernando' ? '#5a3418' : id==='payaso' ? '#e63946' : '#2a2a2a';
  const pI = extremidad(0.25, 0.7, 0.26, colP, true, colZ), pD = extremidad(0.25, 0.7, 0.26, colP, true, colZ);
  if (id==='payaso'){ for (const pp of [pI, pD]){ const z = new Armador().bola(0.3, '#e63946', 0, -0.68, 0.25, 8, 1, 0.5, 1.6).malla(matMate()); pp.add(z); } }
  pI.position.set(-0.15, 0.72, 0); pD.position.set(0.15, 0.72, 0);
  g.add(bI, bD, pI, pD);
  const cuerpoG = new THREE.Group(); g.add(cuerpoG);
  let capa = null;
  if (id==='tiojuan' || id==='vampiro'){
    capa = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.3, 1, 4), new THREE.MeshLambertMaterial({color: lin(id==='vampiro' ? 0x2a0a20 : 0xd82800), side: THREE.DoubleSide}));
    capa.position.set(0, 0.85, -0.22); capa.castShadow = true; g.add(capa);
  }
  g.scale.setScalar(esc);
  g.partes = {cuerpo, bI, bD, pI, pD, capa};
  g.esc = esc; g.fase = azar()*6.28;
  return g;
}
function armarPerro(color){
  const g = new THREE.Group(), A = new Armador();
  /* el cuerpo es una cápsula, la cabeza y el hocico son bolas: un perrito redondito */
  A.cil(0.24, 0.24, 0.78, color, 0, 0.7, 0, Math.PI/2, 0, 0, 12).bola(0.24, color, 0, 0.7, 0.39, 10).bola(0.24, color, 0, 0.7, -0.39, 10)
   .bola(0.27, color, 0, 1.06, 0.5, 12).bola(0.15, color, 0, 0.96, 0.76, 10, 1, 0.8, 1.2)
   .bola(0.07, '#222', 0, 1.0, 0.93, 7)
   .bola(0.06, '#fff', -0.12, 1.14, 0.7, 7).bola(0.06, '#fff', 0.12, 1.14, 0.7, 7).bola(0.032, '#222', -0.12, 1.14, 0.755, 6).bola(0.032, '#222', 0.12, 1.14, 0.755, 6)
   .bola(0.1, color, -0.24, 1.14, 0.42, 8, 0.75, 1.7, 0.5).bola(0.1, color, 0.24, 1.14, 0.42, 8, 0.75, 1.7, 0.5)
   .bola(0.05, '#ff5060', 0, 0.86, 0.9, 6, 1, 0.5, 1.5)
   .pieza(new THREE.TorusGeometry(0.25, 0.05, 6, 16), '#e63946', 0, 0.86, 0.3, Math.PI/2, 0, 0);
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  const cola = new Armador().cil(0.04, 0.055, 0.42, color, 0, 0.1, -0.2, Math.PI/2, 0, 0, 8).bola(0.06, color, 0, 0.1, -0.41, 6).malla(matMate()); cola.position.set(0, 0.86, -0.42); g.add(cola);
  const patas = [];
  for (const [x,z] of [[-0.17,0.32],[0.17,0.32],[-0.17,-0.32],[0.17,-0.32]]){
    const p = new Armador().cil(0.07, 0.065, 0.5, color, 0, -0.25, 0, 0,0,0, 8).bola(0.085, '#3a2a1a', 0, -0.48, 0.03, 7, 1, 0.5, 1.3).malla(matMate());
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
/* el gorila: quien come una banana en la isla se vuelve gorila un minuto; se anima como una persona */
function armarGorila(color){
  const g = new THREE.Group(), A = new Armador(), PEL = color || '#2a2320', PIEL2 = color ? '#8a8a94' : '#5a4a44';
  A.bola(0.72, PEL, 0, 1.2, 0, 12, 1.15, 1.0, 0.9).bola(0.5, PIEL2, 0, 1.15, 0.32, 10, 1.0, 0.85, 0.7)     /* el cuerpo y el pecho */
   .bola(0.5, PEL, 0, 2.05, 0.1, 12, 1.05, 0.95, 1.0).bola(0.34, PIEL2, 0, 1.95, 0.42, 10, 1.1, 0.8, 0.7)      /* la cabeza y la cara */
   .bola(0.09, '#111', -0.16, 2.08, 0.62, 6).bola(0.09, '#111', 0.16, 2.08, 0.62, 6).bola(0.04, '#fff', -0.14, 2.1, 0.68, 4).bola(0.04, '#fff', 0.18, 2.1, 0.68, 4)
   .bola(0.07, '#111', -0.08, 1.9, 0.72, 5).bola(0.07, '#111', 0.08, 1.9, 0.72, 5).caja(0.3, 0.05, 0.05, '#3a2a28', 0, 1.78, 0.7)
   .bola(0.14, PEL, -0.5, 2.12, 0, 6).bola(0.14, PEL, 0.5, 2.12, 0, 6).bola(0.28, PEL, 0, 2.5, -0.05, 8, 1, 0.5, 1)
   .cil(0.1, 0.1, 0.3, PEL, 0, 1.68, 0, 0,0,0, 6);
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  const brazo = ()=>{ const B = new Armador(); B.cil(0.2, 0.17, 1.15, PEL, 0, -0.55, 0, 0,0,0, 8).bola(0.24, PIEL2, 0, -1.15, 0, 8, 1.2, 0.7, 1.1); return B.malla(matMate()); };
  const pierna = ()=>{ const B = new Armador(); B.cil(0.2, 0.18, 0.62, PEL, 0, -0.3, 0, 0,0,0, 8).bola(0.24, PIEL2, 0, -0.62, 0.08, 8, 1.1, 0.5, 1.5); return B.malla(matMate()); };
  const bI = brazo(), bD = brazo(), pI = pierna(), pD = pierna();
  bI.position.set(-0.78, 1.55, 0); bD.position.set(0.78, 1.55, 0); pI.position.set(-0.32, 0.62, 0); pD.position.set(0.32, 0.62, 0);
  g.add(bI, bD, pI, pD);
  g.partes = {cuerpo, bI, bD, pI, pD, capa:null};
  g.scale.setScalar(1.25); g.esc = 1.25; g.fase = 0;
  return g;
}
/* cualquier personaje elegible: persona, perrito o el Señor Popo (y el gorila, mientras dure la banana) */
function armarJugador(pj, gorila){
  const def = PERSONAJES_RED.find(p=>p.id===pj) || PERSONAJES_RED[0];
  let g;
  if (gorila){ g = armarGorila(); g.tipo = 'persona'; }
  else if (def.perro){ g = armarPerro(def.perro); g.tipo = 'perro'; g.esc = 0.9; }
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
function armarVehiculo(id, colores){
  const g = new THREE.Group(), A = new Armador(), R = {ruedas: [], id};
  if (id==='carro'){
    const c = colores ? colores.color : '#e63946', claro = colores ? colores.claro : '#ff6b6b';
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
  } else if (id==='tanque'){
    const c = '#5a7a3a', c2 = '#3f5a28', ORUGA = '#2a2a2e';
    A.caja(3.0, 1.1, 5.2, c, 0, 1.05, 0).caja(3.2, 0.3, 5.4, c2, 0, 1.62, 0).caja(2.6, 0.4, 1.0, c2, 0, 0.7, 2.7, -0.5, 0, 0)
     .cil(1.15, 1.3, 0.9, c, 0, 2.2, -0.4, 0,0,0, 14).cil(0.55, 0.62, 0.35, c2, 0.2, 2.8, -0.9, 0,0,0, 10)
     .caja(0.3, 0.16, 0.16, '#ffd23f', -1.2, 1.4, 2.62).caja(0.3, 0.16, 0.16, '#ffd23f', 1.2, 1.4, 2.62)
     .caja(0.5, 0.06, 0.06, '#ffffff', 0, 1.8, 0).cil(0.05, 0.05, 1.6, '#d0d0d8', 1.2, 2.6, -1.4, 0,0,0, 6).caja(0.5, 0.35, 0.05, '#e63946', 1.45, 3.2, -1.4);
    for (const sx of [-1, 1]) A.caja(0.9, 1.3, 5.6, ORUGA, sx*1.95, 0.75, 0).caja(0.94, 0.12, 5.7, '#444', sx*1.95, 1.42, 0);
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    const canon = new Armador().cil(0.18, 0.2, 3.4, c2, 0, 0, 1.7, Math.PI/2, 0, 0, 10).cil(0.26, 0.26, 0.4, ORUGA, 0, 0, 3.3, Math.PI/2, 0, 0, 10).malla(matBrillo());
    canon.position.set(0, 2.35, 0.4); g.add(canon); R.canon = canon; R.retroceso = 0;
    for (const sx of [-1, 1]) for (let k=0;k<5;k++){ const w = rueda(0.34, 0.5); w.dir.position.set(sx*1.95, 0.42, -2.0 + k*1.0); w.delante = false; g.add(w.dir); R.ruedas.push(w); }
    R.asiento = {x:0.2, y:2.15, z:-0.9, esc:0.6, parado:true}; R.altoOjos = 3.4;
  } else if (id==='tabla'){
    A.caja(0.9, 0.12, 2.8, '#ffd23f', 0, 0.62, 0).caja(0.5, 0.13, 3.1, '#e63946', 0, 0.625, 0).bola(0.45, '#ffd23f', 0, 0.62, 1.4, 8, 1, 0.26, 1).bola(0.45, '#ffd23f', 0, 0.62, -1.4, 8, 1, 0.26, 1)
     .caja(0.06, 0.4, 0.5, '#ffffff', 0, 0.38, -1.1);
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    R.asiento = {x:0, y:0.68, z:-0.2, esc:0.62, parado:true}; R.altoOjos = 2.0;
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
  } else if (id==='motonieve'){
    const c = '#2a6ad0';
    A.caja(1.0, 0.5, 2.4, c, 0, 0.7, 0).bola(0.5, c, 0, 0.85, 0.9, 8, 1, 0.6, 1.4).caja(0.6, 0.4, 1.0, '#1a1a20', 0, 1.0, -0.5).caja(1.2, 0.06, 0.06, '#333', 0, 1.25, 0.9)
     .caja(0.08, 0.5, 0.08, '#c8c8d0', -0.14, 1.0, 0.95, 0.3,0,0).caja(0.08, 0.5, 0.08, '#c8c8d0', 0.14, 1.0, 0.95, 0.3,0,0).cil(0.16, 0.16, 0.12, '#fff6c0', 0, 0.95, 1.25, Math.PI/2, 0, 0, 10)
     .caja(0.24, 0.08, 1.6, '#c8c8d0', -0.7, 0.2, 0.9).caja(0.24, 0.08, 1.6, '#c8c8d0', 0.7, 0.2, 0.9).caja(0.1, 0.4, 0.1, '#c8c8d0', -0.7, 0.4, 1.0).caja(0.1, 0.4, 0.1, '#c8c8d0', 0.7, 0.4, 1.0)
     .caja(0.9, 0.4, 1.6, '#222', 0, 0.3, -0.6);
    for (let i=0;i<6;i++) A.caja(0.95, 0.08, 0.14, '#444', 0, 0.12, -1.3 + i*0.28);
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    R.asiento = {x:0, y:1.0, z:-0.45, esc:0.62}; R.altoOjos = 1.6;
  } else if (id==='esquis'){
    A.caja(0.16, 0.05, 1.9, '#e63946', -0.2, 0.05, 0.2).caja(0.16, 0.05, 1.9, '#e63946', 0.2, 0.05, 0.2).caja(0.16, 0.08, 0.2, '#e63946', -0.2, 0.1, 1.15, 0.35, 0, 0).caja(0.16, 0.08, 0.2, '#e63946', 0.2, 0.1, 1.15, 0.35, 0, 0)
     .caja(0.18, 0.12, 0.34, '#222', -0.2, 0.12, -0.1).caja(0.18, 0.12, 0.34, '#222', 0.2, 0.12, -0.1)
     .cil(0.02, 0.02, 1.2, '#c8c8d0', -0.5, 0.65, -0.3, 0.2, 0, 0, 5).cil(0.02, 0.02, 1.2, '#c8c8d0', 0.5, 0.65, -0.3, 0.2, 0, 0, 5).cil(0.1, 0.1, 0.03, '#c8c8d0', -0.5, 0.1, -0.4, 0,0,0, 8).cil(0.1, 0.1, 0.03, '#c8c8d0', 0.5, 0.1, -0.4, 0,0,0, 8);
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    R.asiento = {x:0, y:0.18, z:-0.05, esc:0.62, parado:true}; R.altoOjos = 1.4;
  } else if (id==='ovni'){
    A.cil(3.0, 4.1, 0.7, '#9aa4b8', 0, 1.05, 0, 0,0,0, 24).cil(4.1, 3.0, 0.5, '#7a8498', 0, 0.45, 0, 0,0,0, 24).cil(0.9, 0.9, 0.5, '#5a6270', 0, 0.2, 0, 0,0,0, 12)
     .cil(1.9, 1.9, 0.12, '#5a6270', 0, 1.45, 0, 0,0,0, 20).cil(0.5, 0.5, 0.1, '#7dffa0', 0, 0.06, 0, 0,0,0, 12);
    for (let i=0;i<3;i++){ const a = i/3*6.283; A.cil(0.12, 0.16, 1.0, '#5a6270', Math.cos(a)*2.4, 0.35, Math.sin(a)*2.4, 0,0,0, 6).cil(0.36, 0.36, 0.1, '#3a3a48', Math.cos(a)*2.4, 0.05, Math.sin(a)*2.4, 0,0,0, 8); }
    R.cuerpo = A.malla(matBrillo()); g.add(R.cuerpo);
    R.cupula = new THREE.Mesh(new THREE.SphereGeometry(1.75, 18, 12, 0, Math.PI*2, 0, Math.PI/2), new THREE.MeshPhongMaterial({color: lin(0x9de8ff), transparent:true, opacity:0.42, shininess:90, side:THREE.DoubleSide}));
    R.cupula.position.y = 1.4; g.add(R.cupula);
    R.anillo = new THREE.Group(); R.anillo.position.y = 0.75; g.add(R.anillo); R.luces = [];
    for (let i=0;i<12;i++){ const a = i/12*6.283; const l = new THREE.Mesh(new THREE.SphereGeometry(0.22, 7, 6), new THREE.MeshBasicMaterial({color: i%3===0 ? 0xff5a5a : i%3===1 ? 0x7dffa0 : 0xffe36e})); l.position.set(Math.cos(a)*3.75, 0, Math.sin(a)*3.75); R.anillo.add(l); R.luces.push(l); }
    R.haz = new THREE.Mesh(new THREE.ConeGeometry(3.4, 9, 20, 1, true), new THREE.MeshBasicMaterial({color: 0x9dffb0, transparent:true, opacity:0.16, depthWrite:false, side: THREE.DoubleSide}));
    R.haz.position.y = -4.3; R.haz.rotation.x = Math.PI; R.haz.visible = false; g.add(R.haz);
    R.asiento = {x:0, y:1.35, z:0, esc:0.5}; R.altoOjos = 2.2;
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
  const sombra = new THREE.Mesh(new THREE.CircleGeometry(id==='avion' ? 3.2 : id==='ovni' ? 3.6 : id==='barco' || id==='heli' ? 2.6 : id==='dino' ? 2.2 : id==='esquis' ? 1.0 : 1.8, 16), new THREE.MeshBasicMaterial({color:0x000000, transparent:true, opacity:0.18, depthWrite:false}));
  sombra.rotation.x = -Math.PI/2; sombra.position.y = 0.04; g.add(sombra); R.sombra = sombra;
  g.partes = R;
  return g;
}

/* ---------------- Todo el elenco, puesto en la isla ---------------- */
let fer = armarJugador('fernando'); scene.add(fer);
let ferSentado = armarJugador('fernando'); ferSentado.visible = false; scene.add(ferSentado);
const ROPA = (()=>{ try{ const g = JSON.parse(localStorage.getItem('aventura3d.ropa')); if (g && Array.isArray(g.comprados)){ const r = Object.assign(ropaNueva(), g); for (const k of ['gorro','capa','carro','mascota']) if (r[k] && !ITEMS_TIENDA.some(i=>i.id===r[k] && i.tipo===k)) r[k] = null; r.comprados = r.comprados.filter(id=>ITEMS_TIENDA.some(i=>i.id===id)); return r; } }catch(e){} return ropaNueva(); })();
function guardarRopa(){ try{ localStorage.setItem('aventura3d.ropa', JSON.stringify(ROPA)); }catch(e){} }
let carroColorPuesto = null;
function recolorearCarro(){
  const id = ROPA.carro || null; if (id === carroColorPuesto || !vehMesh.carro) return;
  carroColorPuesto = id;
  const it = ITEMS_TIENDA.find(i=>i.id===id), viejo = vehMesh.carro;
  const m = armarVehiculo('carro', it ? {color: it.color, claro: it.claro} : null);
  m.position.copy(viejo.position); m.rotation.copy(viejo.rotation);
  if (ferSentado.parent === viejo){ viejo.remove(ferSentado); m.add(ferSentado); }
  m.add(viejo.etiqueta); m.etiqueta = viejo.etiqueta;
  scene.remove(viejo); scene.add(m); vehMesh.carro = m;
}
function aplicarRopa(){ vestir(fer, ROPA); vestir(ferSentado, ROPA); if (P) P.mascota = ROPA.mascota; if (typeof vehMesh !== 'undefined') recolorearCarro(); }
let ferGorila = false;
function ponerPersonaje(pj){
  if (!PERSONAJES_RED.some(p=>p.id===pj)) return;
  if (P) P.pj = pj;
  ferGorila = !!(P && P.gorilaT > 0);
  if (fer.parent) fer.parent.remove(fer); if (ferSentado.parent) ferSentado.parent.remove(ferSentado);
  fer = armarJugador(pj, ferGorila); scene.add(fer);
  ferSentado = armarJugador(pj, ferGorila); ferSentado.visible = false; scene.add(ferSentado);
  vestir(fer, ROPA); vestir(ferSentado, ROPA);
}
/* el factor de gordura: ancho según las hamburguesas comidas, flaquito después del baño */
function gorduraDe(gordura, flaco){ return flaco ? {kx:0.84, ky:1.04} : {kx: 1 + 0.1*gordura, ky: 1 - 0.015*gordura}; }
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
{ const est = armarGorila('#8a8a94'); est.scale.setScalar(2.2); est.position.set(ISLA_BANANA.x + 4, altura(ISLA_BANANA.x + 4, ISLA_BANANA.z - 4), ISLA_BANANA.z - 4); est.rotation.y = Math.PI*0.75; est.partes.bI.rotation.x = -2.4; est.partes.bD.rotation.x = -2.4; est.partes.bI.rotation.z = 0.5; est.partes.bD.rotation.z = -0.5; mundo.add(est);
  const B = new Armador(); B.cil(2.2, 2.6, 0.8, '#b8b8c4', 0, 0.4, 0, 0,0,0, 12); const base = B.malla(matMate()); base.position.copy(est.position); mundo.add(base); est.position.y += 0.8; }
{ const et = letrero('Señor Popo', '#fff', 'rgba(90,50,20,0.85)', 1.3); et.position.y = 3.4; srPopo.add(et); }
/* ---------------- Los bichos nuevos: elefantes, renos, león, jirafa, monos y extraterrestres ---------------- */
function armarCuadrupedo(def){
  /* elefante, reno, león o jirafa: cuerpo, cabeza y cuatro patas que caminan */
  const g = new THREE.Group(), A = new Armador(), patas = [], t = def.tipo, c = def.color, cl = def.claro;
  const pata = (x, z, alto, gr)=>{ const p = new Armador().cil(gr, gr*0.9, alto, c, 0, -alto/2, 0, 0,0,0, 8).bola(gr*1.1, cl, 0, -alto, 0.05, 6, 1.1, 0.45, 1.3).malla(matMate()); p.position.set(x, alto, z); g.add(p); patas.push(p); return p; };
  if (t==='elefante'){
    A.bola(1.5, c, 0, 2.6, 0, 12, 1.1, 1.0, 1.5).bola(1.0, c, 0, 3.0, 2.1, 12, 1, 0.95, 1).bola(0.9, c, -1.1, 3.1, 1.9, 8, 0.25, 1, 1).bola(0.9, c, 1.1, 3.1, 1.9, 8, 0.25, 1, 1)
     .bola(0.16, '#fff', -0.4, 3.2, 2.9, 6).bola(0.16, '#fff', 0.4, 3.2, 2.9, 6).bola(0.08, '#111', -0.4, 3.2, 3.04, 5).bola(0.08, '#111', 0.4, 3.2, 3.04, 5)
     .cono(0.12, 1.2, '#fff8e0', -0.45, 2.5, 3.2, 6, Math.PI/2, 0, 0).cono(0.12, 1.2, '#fff8e0', 0.45, 2.5, 3.2, 6, Math.PI/2, 0, 0)
     .cil(0.28, 0.32, 1.4, c, 0, 2.2, 3.0, 0.5, 0, 0, 8).cil(0.22, 0.28, 1.2, c, 0, 1.3, 3.5, 0.15, 0, 0, 8).bola(0.24, cl, 0, 0.7, 3.6, 6)
     .cil(0.08, 0.1, 1.2, c, 0, 2.4, -1.6, 0.4, 0, 0, 5).bola(0.14, '#333', 0, 1.9, -1.9, 5);
    pata(-0.8, 0.8, 1.6, 0.4); pata(0.8, 0.8, 1.6, 0.4); pata(-0.8, -0.8, 1.6, 0.4); pata(0.8, -0.8, 1.6, 0.4);
  } else if (t==='reno'){
    A.bola(0.7, c, 0, 1.7, 0, 10, 1, 0.8, 1.6).cil(0.24, 0.3, 1.0, c, 0, 2.2, 0.9, 0.9, 0, 0, 8).bola(0.36, c, 0, 2.7, 1.3, 10, 1, 0.8, 1.2).caja(0.3, 0.26, 0.5, cl, 0, 2.55, 1.7)
     .bola(def.nariz ? 0.14 : 0.1, def.nariz ? '#ff2020' : '#222', 0, 2.55, 1.98, 6).bola(0.1, '#fff', -0.16, 2.85, 1.55, 5).bola(0.1, '#fff', 0.16, 2.85, 1.55, 5).bola(0.05, '#111', -0.16, 2.85, 1.64, 4).bola(0.05, '#111', 0.16, 2.85, 1.64, 4)
     .cono(0.14, 0.5, c, -0.18, 2.8, 0.9, 5, 0, 0, 0.4).cono(0.14, 0.5, c, 0.18, 2.8, 0.9, 5, 0, 0, -0.4)
     .cil(0.04, 0.05, 0.9, '#8a6a3a', -0.22, 3.4, 1.2, 0, 0, 0.5, 5).cil(0.04, 0.05, 0.9, '#8a6a3a', 0.22, 3.4, 1.2, 0, 0, -0.5, 5).cil(0.03, 0.04, 0.5, '#8a6a3a', -0.42, 3.7, 1.2, 0, 0, 1.4, 4).cil(0.03, 0.04, 0.5, '#8a6a3a', 0.42, 3.7, 1.2, 0, 0, -1.4, 4)
     .cil(0.04, 0.03, 0.5, '#8a6a3a', -0.3, 3.9, 1.2, 0, 0, 0.2, 4).cil(0.04, 0.03, 0.5, '#8a6a3a', 0.3, 3.9, 1.2, 0, 0, -0.2, 4).bola(0.12, '#fff', 0, 1.6, -1.05, 5);
    pata(-0.35, 0.55, 1.2, 0.12); pata(0.35, 0.55, 1.2, 0.12); pata(-0.35, -0.55, 1.2, 0.12); pata(0.35, -0.55, 1.2, 0.12);
  } else if (t==='leon'){
    A.bola(0.75, c, 0, 1.5, 0, 10, 1, 0.85, 1.6).bola(0.55, c, 0, 1.9, 1.2, 10).bola(0.8, '#b8702e', 0, 1.9, 1.05, 12, 1, 1, 0.55)
     .bola(0.3, cl, 0, 1.75, 1.6, 8, 1, 0.7, 1).bola(0.08, '#222', 0, 1.8, 1.9, 5).bola(0.1, '#fff', -0.2, 2.05, 1.62, 5).bola(0.1, '#fff', 0.2, 2.05, 1.62, 5).bola(0.05, '#111', -0.2, 2.05, 1.7, 4).bola(0.05, '#111', 0.2, 2.05, 1.7, 4)
     .bola(0.14, c, -0.3, 2.35, 1.2, 5).bola(0.14, c, 0.3, 2.35, 1.2, 5).cil(0.05, 0.06, 1.3, c, 0, 1.4, -1.4, 1.2, 0, 0, 5).bola(0.14, '#b8702e', 0, 1.0, -2.0, 5);
    pata(-0.4, 0.6, 1.0, 0.16); pata(0.4, 0.6, 1.0, 0.16); pata(-0.4, -0.6, 1.0, 0.16); pata(0.4, -0.6, 1.0, 0.16);
  } else if (t==='jirafa'){
    A.bola(0.9, c, 0, 3.0, 0, 10, 1, 0.85, 1.5).cil(0.26, 0.34, 3.4, c, 0, 4.8, 1.0, 0.35, 0, 0, 8).bola(0.42, c, 0, 6.4, 1.6, 10, 1, 0.8, 1.3).caja(0.36, 0.3, 0.5, cl, 0, 6.25, 2.05)
     .cil(0.05, 0.05, 0.4, c, -0.15, 6.9, 1.4, 0,0,0, 4).cil(0.05, 0.05, 0.4, c, 0.15, 6.9, 1.4, 0,0,0, 4).bola(0.08, '#5a3418', -0.15, 7.1, 1.4, 4).bola(0.08, '#5a3418', 0.15, 7.1, 1.4, 4)
     .bola(0.1, '#fff', -0.2, 6.55, 1.85, 5).bola(0.1, '#fff', 0.2, 6.55, 1.85, 5).bola(0.05, '#111', -0.2, 6.55, 1.94, 4).bola(0.05, '#111', 0.2, 6.55, 1.94, 4);
    for (let i=0;i<14;i++){ const a = i*2.4, y = 2.4 + (i%5)*0.35; A.bola(0.16, '#8a5a2a', Math.cos(a)*0.8, y, Math.sin(a)*1.2, 5, 1.2, 1, 1.2); }
    for (let i=0;i<5;i++) A.bola(0.11, '#8a5a2a', Math.cos(i*2.1)*0.25, 3.6 + i*0.6, 1.0 + i*0.12, 4);
    A.cil(0.04, 0.05, 1.1, c, 0, 2.6, -1.4, 0.6, 0, 0, 4).bola(0.12, '#5a3418', 0, 2.1, -1.8, 4);
    pata(-0.45, 0.55, 2.4, 0.15); pata(0.45, 0.55, 2.4, 0.15); pata(-0.45, -0.55, 2.4, 0.15); pata(0.45, -0.55, 2.4, 0.15);
  }
  const cuerpo = A.malla(matMate()); g.add(cuerpo);
  g.partes = {cuerpo, patas}; g.scale.setScalar(def.esc || 1);
  return g;
}
function armarAlien(tipo){
  const g = new THREE.Group(), E = new Armador(), c = ALIEN_INFO[tipo].color;
  if (tipo==='gris'){
    E.bola(0.55, c, 0, 1.75, 0, 10, 1.1, 1.25, 1).caja(0.46, 0.7, 0.3, '#7a8498', 0, 1.0, 0).bola(0.17, '#111', -0.2, 1.85, 0.42, 8, 1, 1.6, 0.6).bola(0.17, '#111', 0.2, 1.85, 0.42, 8, 1, 1.6, 0.6)
     .caja(0.14, 0.6, 0.14, c, -0.2, 0.3, 0).caja(0.14, 0.6, 0.14, c, 0.2, 0.3, 0).cil(0.03, 0.03, 0.5, c, 0, 2.5, 0, 0,0,0,4).bola(0.1, '#7dffa0', 0, 2.8, 0, 6);
  } else if (tipo==='anillo'){
    E.cil(0.24, 0.3, 1.3, c, 0, 0.95, 0, 0,0,0, 10).bola(0.4, c, 0, 2.0, 0, 10, 1, 1.4, 1).bola(0.12, '#ffe36e', 0, 2.2, 0.36, 8).bola(0.06, '#111', 0, 2.2, 0.46, 5)
     .pieza(new THREE.TorusGeometry(0.62, 0.05, 6, 20), '#ffe36e', 0, 2.1, 0, Math.PI/2.4, 0, 0).caja(0.12, 0.5, 0.12, c, -0.18, 0.25, 0).caja(0.12, 0.5, 0.12, c, 0.18, 0.25, 0);
  } else {
    E.bola(0.75, c, 0, 0.9, 0, 12, 1.1, 1.1, 1).bola(0.5, '#ffb070', 0, 1.7, 0, 10, 1.2, 0.8, 1);
    for (const [x, y] of [[-0.28, 1.05], [0, 1.25], [0.28, 1.05]]) E.bola(0.14, '#fff', x, y, 0.62, 7).bola(0.07, '#111', x, y, 0.74, 5);
    E.caja(0.4, 0.06, 0.06, '#8a3a10', 0, 0.62, 0.7).bola(0.18, c, -0.6, 0.5, 0.2, 6).bola(0.18, c, 0.6, 0.5, 0.2, 6);
  }
  g.add(E.malla(matMate()));
  const brazo = (s)=>{ const b = new THREE.Group(); b.position.set(s*(tipo==='blob' ? 0.75 : 0.32), tipo==='blob' ? 1.0 : 1.3, 0); b.add(new Armador().caja(0.12, 0.6, 0.12, c, 0, -0.3, 0).malla(matMate())); g.add(b); return b; };
  g.brazos = [brazo(-1), brazo(1)]; g.tipo = tipo;
  return g;
}
function armarMono(){
  const A = new Armador(), c = '#8a5a2a';
  A.bola(0.3, c, 0, 0.3, 0, 8, 1, 1.2, 0.9).bola(0.24, c, 0, 0.8, 0.05, 8).bola(0.16, '#e8b088', 0, 0.75, 0.2, 7, 1, 0.8, 0.6).bola(0.05, '#111', -0.07, 0.82, 0.32, 4).bola(0.05, '#111', 0.07, 0.82, 0.32, 4)
   .bola(0.08, '#e8b088', -0.24, 0.85, 0, 5).bola(0.08, '#e8b088', 0.24, 0.85, 0, 5).cil(0.05, 0.05, 0.7, c, -0.22, 0.75, 0, 0,0,0, 5).cil(0.05, 0.05, 0.7, c, 0.22, 0.75, 0, 0,0,0, 5)
   .cil(0.06, 0.06, 0.5, c, -0.12, -0.2, 0, 0,0,0, 5).cil(0.06, 0.06, 0.5, c, 0.12, -0.2, 0, 0,0,0, 5).cil(0.04, 0.03, 0.9, c, 0, 0.1, -0.35, 0.8, 0, 0, 4);
  return A.malla(matMate());
}
/* las cosas que uno se pone: gorros, capas; y la mascota */
function armarGorro(id){
  const A = new Armador();
  if (id==='corona'){ A.cil(0.3, 0.32, 0.22, '#ffd23f', 0, 0.11, 0, 0,0,0, 10); for (let i=0;i<6;i++){ const a = i/6*6.283; A.cono(0.07, 0.2, '#ffd23f', Math.cos(a)*0.29, 0.3, Math.sin(a)*0.29, 4).bola(0.05, ['#e63946','#4fc3f7','#7dffa0'][i%3], Math.cos(a)*0.31, 0.12, Math.sin(a)*0.31, 4); } }
  else if (id==='vaquero'){ A.cil(0.62, 0.62, 0.05, '#8a5a2a', 0, 0.02, 0, 0,0,0, 16).cil(0.3, 0.33, 0.34, '#8a5a2a', 0, 0.2, 0, 0,0,0, 12).cil(0.33, 0.33, 0.06, '#3a2a1a', 0, 0.08, 0, 0,0,0, 12); }
  else if (id==='casco'){ A.cil(0.36, 0.36, 0.1, '#c8c8d0', 0, -0.32, 0, 0,0,0, 14); }
  else if (id==='santa'){ A.cil(0.37, 0.37, 0.14, '#ffffff', 0, 0.06, 0, 0,0,0, 16).cono(0.3, 0.7, '#c0392b', 0.05, 0.55, -0.1, 10, 0.35, 0, 0.3).bola(0.13, '#ffffff', 0.3, 0.75, -0.28, 8); }
  else if (id==='mago'){ A.cil(0.5, 0.5, 0.05, '#222', 0, 0.02, 0, 0,0,0, 16).cil(0.28, 0.3, 0.7, '#222', 0, 0.4, 0, 0,0,0, 12).cil(0.31, 0.31, 0.08, '#7b4fa8', 0, 0.12, 0, 0,0,0, 12).bola(0.06, '#ffd23f', 0.2, 0.5, 0.22, 4); }
  else if (id==='conejo'){ for (const s of [-1, 1]) A.bola(0.1, '#ffffff', s*0.16, 0.5, 0, 6, 1, 3.6, 0.6).bola(0.06, '#ffb0c0', s*0.16, 0.5, 0.04, 5, 1, 3, 0.5); }
  const m = A.malla(matMate());
  if (id==='casco'){ const v = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 10), new THREE.MeshPhongMaterial({color: lin(0x9de8ff), transparent:true, opacity:0.35, shininess:90})); v.position.y = -0.12; m.add(v); }
  return m;
}
function vestir(g, ropa){
  if (!g) return;
  if (g.gorroMesh){ g.gorroMesh.parent && g.gorroMesh.parent.remove(g.gorroMesh); g.gorroMesh = null; }
  if (g.capaMesh){ g.capaMesh.parent && g.capaMesh.parent.remove(g.capaMesh); g.capaMesh = null; }
  if (!ropa) return;
  const altoCabeza = g.tipo==='perro' ? 1.32 : g.tipo==='popo' ? 2.55 : g.esc > 1.2 ? 2.75 : 2.06, zCabeza = g.tipo==='perro' ? 0.5 : 0;
  if (ropa.gorro){ const m = armarGorro(ropa.gorro); m.position.set(0, altoCabeza, zCabeza); if (g.tipo==='perro') m.scale.setScalar(0.8); g.add(m); g.gorroMesh = m; }
  if (ropa.capa && g.tipo!=='perro' && g.tipo!=='popo' && g.partes && !g.partes.capa){
    const it = ITEMS_TIENDA.find(i=>i.id===ropa.capa);
    const capa = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.3, 1, 4), new THREE.MeshLambertMaterial({color: lin(new THREE.Color(it ? it.color : '#d82800').getHex()), side: THREE.DoubleSide}));
    capa.position.set(0, 0.85, -0.24); capa.castShadow = true; g.add(capa); g.capaMesh = capa;
  }
}
function armarMascota(id){
  const g = new THREE.Group(), A = new Armador();
  if (id==='gatito'){ const c = '#ff9a3d'; A.bola(0.28, c, 0, 0.3, 0, 8, 1, 0.8, 1.4).bola(0.24, c, 0, 0.62, 0.3, 8).cono(0.08, 0.2, c, -0.12, 0.85, 0.3, 4).cono(0.08, 0.2, c, 0.12, 0.85, 0.3, 4).bola(0.05, '#7dffa0', -0.09, 0.66, 0.5, 4).bola(0.05, '#7dffa0', 0.09, 0.66, 0.5, 4).bola(0.04, '#ff6ec0', 0, 0.58, 0.53, 4).cil(0.04, 0.03, 0.6, c, 0, 0.5, -0.4, 1.0, 0, 0, 4); for (const [x,z] of [[-0.14,0.18],[0.14,0.18],[-0.14,-0.18],[0.14,-0.18]]) A.cil(0.05, 0.05, 0.3, c, x, 0.15, z, 0,0,0, 4); }
  else if (id==='pollito'){ A.bola(0.26, '#ffe36e', 0, 0.36, 0, 8).bola(0.2, '#ffe36e', 0, 0.68, 0.14, 8).cono(0.06, 0.16, '#ff8a3d', 0, 0.66, 0.36, 4, Math.PI/2, 0, 0).bola(0.04, '#111', -0.08, 0.74, 0.28, 4).bola(0.04, '#111', 0.08, 0.74, 0.28, 4).bola(0.12, '#ffd23f', -0.24, 0.4, 0, 5, 0.5, 1, 1).bola(0.12, '#ffd23f', 0.24, 0.4, 0, 5, 0.5, 1, 1).cil(0.02, 0.02, 0.2, '#ff8a3d', -0.08, 0.1, 0, 0,0,0, 4).cil(0.02, 0.02, 0.2, '#ff8a3d', 0.08, 0.1, 0, 0,0,0, 4); }
  else { const c = '#2a9c3a'; A.bola(0.3, c, 0, 0.36, 0, 8, 1, 0.9, 1.5).bola(0.24, c, 0, 0.7, 0.32, 8).caja(0.22, 0.16, 0.3, '#7dffa0', 0, 0.62, 0.55).bola(0.05, '#ffd23f', -0.1, 0.78, 0.5, 4).bola(0.05, '#ffd23f', 0.1, 0.78, 0.5, 4).cono(0.06, 0.16, '#ffd23f', -0.1, 0.95, 0.25, 4).cono(0.06, 0.16, '#ffd23f', 0.1, 0.95, 0.25, 4).cono(0.1, 0.8, c, 0, 0.3, -0.7, 5, Math.PI/2, 0, 0); for (const s of [-1, 1]) A.caja(0.5, 0.04, 0.35, '#7dffa0', s*0.4, 0.55, 0, 0, 0, s*0.4); for (const [x,z] of [[-0.14,0.18],[0.14,0.18],[-0.14,-0.18],[0.14,-0.18]]) A.cil(0.06, 0.06, 0.3, c, x, 0.15, z, 0,0,0, 4); }
  g.add(A.malla(matMate())); g.scale.setScalar(0.9);
  const et = letrero(ITEMS_TIENDA.find(i=>i.id===id).emoji, '#fff', 'rgba(0,0,0,0)', 0.7); et.position.y = 1.4; g.add(et);
  return g;
}
/* el paracaídas: una cúpula a rayas con sus cuerdas, colgada encima del jugador */
const paracaidasMesh = (()=>{
  const g = new THREE.Group(), A = new Armador();
  A.pieza(new THREE.SphereGeometry(3.2, 16, 8, 0, Math.PI*2, 0, Math.PI/2), '#e63946', 0, 5.2, 0, 0,0,0, 1, 0.55, 1);
  for (let i=0;i<8;i+=2){ const a = i/8*6.283; A.pieza(new THREE.SphereGeometry(3.22, 16, 8, a, 6.283/8, 0, Math.PI/2), '#ffffff', 0, 5.2, 0, 0,0,0, 1, 0.55, 1); }
  for (let i=0;i<8;i++){ const a = i/8*6.283, x = Math.cos(a)*3.0, z = Math.sin(a)*3.0; const L = Math.hypot(x, 5.2-1.8, z); const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3(x/L, (5.2-1.8)/L, z/L))); A.cil(0.02, 0.02, L, '#e8e0c0', x/2, (5.2+1.8)/2, z/2, e.x, e.y, e.z, 4); }
  g.add(A.malla(matMate())); g.visible = false; scene.add(g); return g;
})();
/* las monedas, los fantasmas de popo y los props (cajas, conos, gallinas y sandías) */
const geoMoneda = (()=>{ const A = new Armador(); A.cil(0.42, 0.42, 0.1, '#ffd23f', 0, 0, 0, Math.PI/2, 0, 0, 16).cil(0.3, 0.3, 0.12, '#e8b820', 0, 0, 0, Math.PI/2, 0, 0, 12).caja(0.1, 0.32, 0.14, '#ffd23f', 0, 0, 0).caja(0.24, 0.08, 0.14, '#ffd23f', 0, 0.12, 0).caja(0.24, 0.08, 0.14, '#ffd23f', 0, -0.12, 0); return A.geo(); })();
const monedasMesh = MONEDAS.map(m=>{
  const g = new THREE.Mesh(geoMoneda, matBrillo()); g.scale.setScalar(m.valor >= 3 ? 1.3 : 1); g.position.set(m.x, m.y, m.z);
  const brillo = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xffe36e, transparent:true, opacity:0.4, depthWrite:false, blending:THREE.AdditiveBlending})); brillo.scale.set(1.8, 1.8, 1); g.add(brillo);
  mundo.add(g); return g;
});
function armarFantasma(){
  const g = new THREE.Group(), A = new Armador();
  A.bola(0.7, '#f4f0ff', 0, 0.6, 0, 10, 1, 0.8, 1).bola(0.55, '#ffffff', 0.03, 1.1, 0.05, 10, 1, 0.85, 1).bola(0.4, '#f4f0ff', 0.02, 1.55, 0.08, 8).cono(0.24, 0.5, '#ffffff', 0.1, 1.95, 0.14, 8, 0, 0, -0.35)
   .bola(0.12, '#111', -0.18, 1.2, 0.5, 6).bola(0.12, '#111', 0.18, 1.2, 0.5, 6).bola(0.09, '#111', 0, 0.95, 0.56, 6, 1.3, 1, 1);
  const m = A.malla(new THREE.MeshLambertMaterial({vertexColors:true, transparent:true, opacity:0.75, emissive: lin(0x403050)})); g.add(m);
  const brillo = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xc0b0ff, transparent:true, opacity:0.45, depthWrite:false, blending:THREE.AdditiveBlending})); brillo.scale.set(4, 4, 1); brillo.position.y = 1.1; g.add(brillo);
  return g;
}
const fantasmasMesh = [];
function armarProp(tipo){
  const A = new Armador();
  if (tipo==='caja'){ A.caja(1.1, 1.0, 1.1, '#c9a06a', 0, 0.5, 0).caja(1.14, 0.1, 0.16, '#8a6a3a', 0, 0.5, 0.56).caja(0.16, 0.1, 1.14, '#8a6a3a', 0.56, 0.5, 0).caja(1.14, 0.1, 0.16, '#8a6a3a', 0, 0.5, -0.56).caja(0.16, 0.1, 1.14, '#8a6a3a', -0.56, 0.5, 0).caja(0.14, 1.02, 1.14, '#8a6a3a', 0, 0.5, 0).caja(1.14, 1.02, 0.14, '#8a6a3a', 0, 0.5, 0); }
  else if (tipo==='cono'){ A.cono(0.42, 1.1, '#ff7a1a', 0, 0.55, 0, 12).caja(0.9, 0.08, 0.9, '#222', 0, 0.04, 0).cil(0.26, 0.3, 0.14, '#ffffff', 0, 0.62, 0, 0,0,0, 12); }
  else if (tipo==='gallina'){ A.bola(0.36, '#ffffff', 0, 0.5, 0, 8, 1, 0.9, 1.3).bola(0.24, '#ffffff', 0, 0.86, 0.32, 8).cono(0.07, 0.2, '#ff8a3d', 0, 0.86, 0.6, 4, Math.PI/2, 0, 0).caja(0.08, 0.14, 0.06, '#e63946', 0, 1.1, 0.3).bola(0.06, '#e63946', 0, 0.72, 0.5, 4).bola(0.04, '#111', -0.09, 0.92, 0.5, 4).bola(0.04, '#111', 0.09, 0.92, 0.5, 4).cil(0.02, 0.02, 0.24, '#ff8a3d', -0.1, 0.12, 0, 0,0,0, 4).cil(0.02, 0.02, 0.24, '#ff8a3d', 0.1, 0.12, 0, 0,0,0, 4).cono(0.14, 0.3, '#e8e8e8', 0, 0.62, -0.5, 4, -Math.PI/2, 0, 0); }
  else { A.bola(0.5, '#2e7d32', 0, 0.45, 0, 12, 1, 0.9, 1.15); for (let i=0;i<6;i++){ const a = i/6*6.283; A.bola(0.5, '#43a047', 0, 0.45, 0, 12, 1.01, 0.91, 1.16).caja(0.08, 0.9, 1.1, '#a5d6a7', Math.cos(a)*0.02, 0.45, Math.sin(a)*0.02, 0, a, 0); } }
  const g = new THREE.Group(); const m = A.malla(matMate()); g.add(m); g.cuerpo = m;
  if (tipo==='gallina'){ g.alas = []; for (const s of [-1, 1]){ const ala = new Armador().bola(0.2, '#ffffff', s*0.1, 0, 0, 6, 0.5, 0.6, 1.2).malla(matMate()); ala.position.set(s*0.3, 0.55, 0); g.add(ala); g.alas.push(ala); } }
  return g;
}
const propsMesh = PROPS_DEF.map(d=>{ const g = armarProp(d.tipo); g.position.set(d.x, altura(d.x, d.z), d.z); g.rotation.y = d.ang; mundo.add(g); return g; });
/* los planetas del cielo: Saturno con anillos y Júpiter con sus franjas y su mancha roja */
const planetasMesh = (()=>{
  const g = new THREE.Group(), A = new Armador();
  A.bola(SATURNO.r, '#e8d29a', SATURNO.x, SATURNO.y, SATURNO.z, 26);
  for (let i=0;i<4;i++){ const y = SATURNO.r*(-0.5 + i*0.33), r = Math.sqrt(SATURNO.r*SATURNO.r - y*y)*1.003; A.pieza(new THREE.CylinderGeometry(r, r, SATURNO.r*0.06, 32, 1, true), i%2 ? '#d4b878' : '#f0e0b0', SATURNO.x, SATURNO.y + y, SATURNO.z); }
  A.pieza(new THREE.RingGeometry(SATURNO.r*1.35, SATURNO.r*2.1, 48), '#d9c6a1', SATURNO.x, SATURNO.y, SATURNO.z, -Math.PI/2 + 0.35, 0.2, 0).pieza(new THREE.RingGeometry(SATURNO.r*1.6, SATURNO.r*1.75, 48), '#b8a070', SATURNO.x, SATURNO.y, SATURNO.z, -Math.PI/2 + 0.35, 0.2, 0);
  A.bola(JUPITER.r, '#d9944f', JUPITER.x, JUPITER.y, JUPITER.z, 30);
  for (let i=0;i<7;i++){ const y = JUPITER.r*(-0.75 + i*0.25), r = Math.sqrt(JUPITER.r*JUPITER.r - y*y)*1.003; A.pieza(new THREE.CylinderGeometry(r, r, JUPITER.r*0.08, 36, 1, true), i%2 ? '#b8702e' : '#f0c890', JUPITER.x, JUPITER.y + y, JUPITER.z); }
  A.bola(JUPITER.r*0.22, '#c0392b', JUPITER.x + JUPITER.r*0.7, JUPITER.y - JUPITER.r*0.25, JUPITER.z + JUPITER.r*0.62, 12, 1.4, 0.7, 1);
  const m = A.malla(new THREE.MeshLambertMaterial({vertexColors:true, side: THREE.DoubleSide}), false); g.add(m);
  for (const [B, t, f] of [[SATURNO, '🪐 SATURNO', 'rgba(140,110,40,0.9)'], [JUPITER, '🟠 JÚPITER', 'rgba(160,80,20,0.9)']]){ const sp = letrero(t, '#fff', f, 8); sp.position.set(B.x, B.y + B.r + 30, B.z); g.add(sp); }
  scene.add(g); return g;
})();
/* las superficies de la luna, Saturno y Júpiter: un plato con cráteres, rocas, la plataforma de la nave, la bandera y lo recogible */
const zonasMesh = {};
for (const k in ZONAS){
  const Z = ZONAS[k], g = new THREE.Group(), A = new Armador();
  A.pieza(new THREE.CircleGeometry(Z.r + 40, 48), Z.color, Z.x, Z.y, Z.z, -Math.PI/2, 0, 0);
  for (const c of Z.crateres) A.pieza(new THREE.CircleGeometry(c.r, 18), Z.crater, c.x, Z.y + 0.03, c.z, -Math.PI/2, 0, 0).pieza(new THREE.RingGeometry(c.r, c.r + 0.8, 18), aclarar(Z.color, 0.25), c.x, Z.y + 0.04, c.z, -Math.PI/2, 0, 0);
  for (const r of Z.rocas) A.bola(r.r, Z.crater, r.x, Z.y + r.r*0.5, r.z, 8, 1, 0.75, 0.9);
  A.cil(6, 6.4, 0.3, '#5a5a66', Z.nave.x, Z.y + 0.15, Z.nave.z, 0,0,0, 20).pieza(new THREE.RingGeometry(4, 4.8, 24), '#ffd23f', Z.nave.x, Z.y + 0.34, Z.nave.z, -Math.PI/2, 0, 0);
  /* el murito del borde, para que se vea dónde acaba el mundo */
  A.pieza(new THREE.CylinderGeometry(Z.r + 0.5, Z.r + 0.5, 3, 48, 1, true), Z.crater, Z.x, Z.y + 1.5, Z.z);
  /* la base de los extraterrestres: una cúpula con antena y luces */
  const bx = Z.x - 30, bz = Z.z - 20;
  A.pieza(new THREE.SphereGeometry(7, 16, 10, 0, Math.PI*2, 0, Math.PI/2), '#9aa4b8', bx, Z.y, bz).cil(0.15, 0.15, 6, '#5a6270', bx, Z.y + 9, bz, 0,0,0, 6).bola(0.5, '#ff5a5a', bx, Z.y + 12.2, bz, 8).caja(2.4, 3.2, 0.3, '#2a2a34', bx, Z.y + 1.6, bz + 7, 0, 0, 0);
  for (let i=0;i<8;i++){ const a = i/8*6.283; A.bola(0.3, i%2 ? '#7dffa0' : '#ffe36e', bx + Math.cos(a)*7.2, Z.y + 3.5, bz + Math.sin(a)*7.2, 5); }
  const m = A.malla(new THREE.MeshLambertMaterial({vertexColors:true, side: THREE.DoubleSide})); m.receiveShadow = true; g.add(m);
  /* la bandera de Fernando, plantada en la primera visita */
  const bandera = new THREE.Group(); const B = new Armador(); B.cil(0.12, 0.12, 5, '#e8e8ea', 0, 2.5, 0, 0,0,0, 6); bandera.add(B.malla(matMate()));
  const tela = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.6, 4, 1), new THREE.MeshLambertMaterial({color: lin(0xd82800), side: THREE.DoubleSide})); tela.geometry.translate(1.3, 0, 0); tela.position.set(0.1, 4.2, 0); bandera.add(tela);
  const et = letrero('🧢 FERNANDO', '#fff', 'rgba(216,40,0,0.9)', 1.2); et.position.set(1.3, 5.6, 0); bandera.add(et);
  bandera.position.set(Z.bandera.x, Z.y, Z.bandera.z); g.add(bandera);
  /* rocas lunares y cristales */
  const recogibles = Z.recogibles.map(r=>{ const R = new Armador(); if (r.tipo==='roca') R.bola(0.7, '#5a5a66', 0, 0.6, 0, 8, 1.2, 0.9, 1).bola(0.35, '#8a8a94', 0.3, 0.9, 0.2, 6); else R.pieza(new THREE.OctahedronGeometry(0.9, 0), '#7de0ff', 0, 1.0, 0).pieza(new THREE.OctahedronGeometry(0.5, 0), '#c0f0ff', 0.6, 0.6, 0.3); const mm = R.malla(r.tipo==='roca' ? matMate() : matBrillo()); mm.position.set(r.x, Z.y, r.z);
    const br = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: r.tipo==='roca' ? 0xc0c0ff : 0x7de0ff, transparent:true, opacity:0.5, depthWrite:false, blending:THREE.AdditiveBlending})); br.scale.set(3, 3, 1); br.position.y = 1; mm.add(br); g.add(mm); return mm; });
  const aliens = Z.aliens.map(a=>{ const am = armarAlien(Z.alien); am.position.set(a.x, Z.y, a.z); g.add(am); const e = letrero(ALIEN_INFO[Z.alien].nombre, '#fff', 'rgba(40,160,80,0.85)', 1.2); e.position.y = 3.2; am.add(e); return am; });
  const sp = letrero((k==='luna' ? (NOCHE ? '🔴 ' : '🌙 ') : k==='saturno' ? '🪐 ' : '🟠 ') + Z.nombre, '#fff', 'rgba(20,20,60,0.85)', 4); sp.position.set(Z.x, Z.y + 16, Z.z); g.add(sp);
  const sp2 = letrero('👽 BASE', '#fff', 'rgba(40,160,80,0.85)', 2); sp2.position.set(bx, Z.y + 14, bz); g.add(sp2);
  scene.add(g); zonasMesh[k] = {g, bandera, tela, recogibles, aliens};
}
/* el gran circo por fuera: la carpa a rayas con banderines, y las islas de los elefantes y los vampiros */
(function construirIslasNuevas(){
  const A = new Armador();
  { const c = CIRCO_DEF, y = altura(c.x, c.z);
    A.cil(18, 18.4, 6, '#e63946', c.x, y+3, c.z, 0,0,0, 32);
    for (let i=0;i<16;i++){ const a = i/16*6.283; A.caja(3.4, 6.1, 0.4, i%2 ? '#ffd23f' : '#e63946', c.x + Math.cos(a)*18.1, y+3, c.z + Math.sin(a)*18.1, 0, -a, 0); }
    A.cono(19.5, 11, '#e63946', c.x, y+11.5, c.z, 32);
    for (let i=0;i<8;i++){ const a = i/8*6.283; A.pieza(new THREE.ConeGeometry(19.6, 11.05, 32, 1, false, a, 6.283/16), '#ffd23f', c.x, y+11.5, c.z); }
    A.cil(0.3, 0.3, 24, '#ffd23f', c.x, y+12, c.z, 0,0,0, 8).caja(3, 1.6, 0.1, '#e63946', c.x + 1.5, y+23.6, c.z);
    for (let i=0;i<12;i++){ const a = i/12*6.283; A.cil(0.1, 0.1, 8, '#ffd23f', c.x + Math.cos(a)*19, y+6, c.z + Math.sin(a)*19, 0,0,0, 5).caja(1.2, 0.7, 0.08, ['#4fc3f7','#7dffa0','#ff6ec0'][i%3], c.x + Math.cos(a)*19 + 0.6, y+9.6, c.z + Math.sin(a)*19); }
    const sx = Math.sin(c.puerta), sz = Math.cos(c.puerta);
    A.caja(7, 0.4, 5, '#ffd23f', c.x + sx*19.5, y+5.2, c.z + sz*19.5).caja(0.3, 5, 0.3, '#e63946', c.x + sx*21.5 - 3, y+2.5, c.z + sz*21.5).caja(0.3, 5, 0.3, '#e63946', c.x + sx*21.5 + 3, y+2.5, c.z + sz*21.5);
    A.caja(5, 5.6, 0.5, '#4a2a10', c.x + sx*18.2, y+2.8, c.z + sz*18.2);
    const sp = letrero('🎪 EL GRAN CIRCO', '#fff6a0', 'rgba(200,40,60,0.92)', 3.4); sp.position.set(c.x, y+27, c.z); mundo.add(sp);
    const sp2 = letrero('🤡 🦁 🦒 🐘 ¡PASEN Y VEAN!', '#fff', 'rgba(20,20,60,0.85)', 2); sp2.position.set(c.x + sx*20, y+8, c.z + sz*20); mundo.add(sp2);
  }
  { const I = ISLA_ELEFANTES, y = altura(I.x, I.z);
    A.pieza(new THREE.CircleGeometry(7, 20), '#4fa3d8', I.x + 12, altura(I.x+12, I.z-6) + 0.15, I.z - 6, -Math.PI/2, 0, 0);
    for (let i=0;i<5;i++){ const a = i*1.3, x = I.x + Math.cos(a)*28, z = I.z + Math.sin(a)*28, h = altura(x, z); if (h < 1.5) continue; A.cil(0.5, 0.9, 7, '#8a6a3a', x, h+3.5, z, 0,0,0, 8).bola(4.5, '#7dbf5a', x, h+8.5, z, 8, 1, 0.45, 1); }
    const sp = letrero('🐘 ISLA DE LOS ELEFANTES', '#fff', 'rgba(80,80,100,0.92)', 3); sp.position.set(I.x, y+10, I.z); mundo.add(sp);
    A.cil(0.16, 0.16, 7, '#8b5a2b', I.x, y+3.5, I.z, 0,0,0, 6);
  }
  { const I = ISLA_VAMPIROS, y = altura(I.x, I.z), G = '#4a4a56', G2 = '#2e2e38';
    A.caja(10, 6, 8, G, I.x, y+3, I.z).pieza(techoGeo(10, 8, 4), G2, I.x, y+6, I.z).cil(1.6, 1.8, 10, G, I.x-6, y+5, I.z-3, 0,0,0, 8).cono(2.0, 3.5, G2, I.x-6, y+11.7, I.z-3, 8)
     .caja(2.2, 3.4, 0.4, '#1a0a14', I.x, y+1.7, I.z+4.1).caja(2.8, 0.5, 0.5, G2, I.x, y+3.6, I.z+4.1).caja(0.6, 1.0, 0.2, '#ffd23f', I.x-3, y+4, I.z+4.05).caja(0.6, 1.0, 0.2, '#ffd23f', I.x+3, y+4, I.z+4.05);
    for (let i=0;i<8;i++){ const a = i/8*6.283 + 0.3, x = I.x + Math.cos(a)*16, z = I.z + Math.sin(a)*16, h = altura(x, z); if (h < 1.5) continue; A.caja(1.2, 1.6, 0.3, '#8a8a94', x, h+0.8, z, 0, a, 0).caja(0.9, 0.3, 0.32, '#8a8a94', x, h+1.7, z, 0, a, 0).caja(0.16, 0.9, 0.34, '#3a3a44', x, h+1.1, z, 0, a, 0).caja(0.5, 0.16, 0.34, '#3a3a44', x, h+1.3, z, 0, a, 0); }
    for (let i=0;i<5;i++){ const a = i*1.25 + 0.6, x = I.x + Math.cos(a)*24, z = I.z + Math.sin(a)*24, h = altura(x, z); if (h < 1.5) continue; A.cil(0.3, 0.5, 5, '#3a2a28', x, h+2.5, z, 0,0,0, 6); for (let k=0;k<4;k++) A.cil(0.08, 0.14, 2.6, '#3a2a28', x + Math.cos(k*1.6)*0.9, h+5.6, z + Math.sin(k*1.6)*0.9, 0.5, k*1.6, 0.6, 4); }
    const sp = letrero('🧛 ISLA DE LOS VAMPIROS BORRACHOS', '#f4c0ff', 'rgba(40,10,50,0.92)', 3); sp.position.set(I.x, y+14, I.z); mundo.add(sp);
    const sp2 = letrero('🍅 bar de jugo de tomate', '#fff', 'rgba(120,20,40,0.9)', 1.5); sp2.position.set(I.x, y+7.6, I.z+4.2); mundo.add(sp2);
  }
  { /* la sala de conciertos al aire libre: tarima, fondo, torres con luces, bocinas, micrófono y gradas */
    const E = ESCENARIO, y = altura(E.x, E.z), M = MICROFONO, G = '#8a8a96', NEG = '#15151c';
    A.caja(E.w, 0.36, E.d, '#4a3424', E.x, y+0.18, E.z).caja(E.w+1.2, 0.5, 0.9, '#e63946', E.x, y+0.25, E.z + E.d/2 + 0.45)
     .caja(E.w, 7.5, 0.7, '#1e1e34', E.x, y+3.75, E.z - E.d/2).caja(E.w-2.5, 4.6, 0.12, '#0d0a1c', E.x, y+4.3, E.z - E.d/2 + 0.42)
     .caja(1.4, 0.4, 0.14, '#ff6ec0', E.x-6, y+6.9, E.z - E.d/2 + 0.42).caja(1.4, 0.4, 0.14, '#4fc3f7', E.x-4, y+6.9, E.z - E.d/2 + 0.42).caja(1.4, 0.4, 0.14, '#ffd23f', E.x-2, y+6.9, E.z - E.d/2 + 0.42).caja(1.4, 0.4, 0.14, '#7dffa0', E.x, y+6.9, E.z - E.d/2 + 0.42).caja(1.4, 0.4, 0.14, '#ff6ec0', E.x+2, y+6.9, E.z - E.d/2 + 0.42).caja(1.4, 0.4, 0.14, '#4fc3f7', E.x+4, y+6.9, E.z - E.d/2 + 0.42).caja(1.4, 0.4, 0.14, '#ffd23f', E.x+6, y+6.9, E.z - E.d/2 + 0.42);
    for (const sx of [-1, 1]){
      A.caja(0.5, 9, 0.5, G, E.x + sx*(E.w/2+0.3), y+4.5, E.z - E.d/2 + 1.2).caja(0.5, 9, 0.5, G, E.x + sx*(E.w/2+0.3), y+4.5, E.z + E.d/2 - 0.6).caja(0.4, 0.4, E.d, G, E.x + sx*(E.w/2+0.3), y+9, E.z);
      for (let k=0;k<2;k++) A.caja(1.8, 3.4, 1.5, NEG, E.x + sx*(E.w/2+1.9), y+1.7+k*0.0, E.z + E.d/2 - 1.6 + k*(-2.2)).bola(0.42, '#2a2a34', E.x + sx*(E.w/2+1.9), y+2.4, E.z + E.d/2 - 0.84 + k*(-2.2), 10, 1, 1, 0.5).bola(0.22, '#2a2a34', E.x + sx*(E.w/2+1.9), y+1.0, E.z + E.d/2 - 0.84 + k*(-2.2), 8, 1, 1, 0.5);
    }
    A.caja(E.w+1.2, 0.4, 0.4, G, E.x, y+9, E.z - E.d/2 + 1.2).caja(E.w+1.2, 0.4, 0.4, G, E.x, y+9, E.z + E.d/2 - 0.6);
    A.cil(0.28, 0.4, 0.08, '#333', M.x, y+0.4, M.z, 0,0,0, 12).cil(0.045, 0.045, 1.55, '#d0d0d8', M.x, y+1.2, M.z, 0,0,0, 6).cil(0.04, 0.04, 0.5, '#d0d0d8', M.x, y+2.05, M.z+0.16, 0.9,0,0, 6).bola(0.13, '#222', M.x, y+2.22, M.z+0.36, 8, 1, 1.3, 1);
    for (let k=0;k<5;k++){ const zk = E.z + E.d/2 + 5 + k*3.6, hk = altura(E.x, zk); A.caja(E.w+8+k*1.5, 0.3, 0.7, '#8b5a2b', E.x, hk+0.55+k*0.1, zk).caja(0.3, 0.6, 0.3, '#5a3a1a', E.x - (E.w+8+k*1.5)/2 + 0.5, hk+0.3+k*0.1, zk).caja(0.3, 0.6, 0.3, '#5a3a1a', E.x + (E.w+8+k*1.5)/2 - 0.5, hk+0.3+k*0.1, zk).caja(0.3, 0.6, 0.3, '#5a3a1a', E.x, hk+0.3+k*0.1, zk); }
    for (let k=0;k<6;k++){ const a = k/6*6.283, x = ISLA_CONCIERTO.x + Math.cos(a)*30, z = ISLA_CONCIERTO.z + Math.sin(a)*30, h = altura(x, z); if (h < 1.5) continue; A.cil(0.1, 0.1, 5, '#8a8a96', x, h+2.5, z, 0,0,0, 6).bola(0.5, ['#ff6ec0','#4fc3f7','#ffd23f'][k%3], x, h+5.3, z, 8); }
    const sp = letrero('🎤 SALA DE CONCIERTOS', '#fff6a0', 'rgba(60,20,90,0.92)', 3.2); sp.position.set(E.x, y+12.5, E.z); mundo.add(sp);
    const sp2 = letrero('🎶 ¡HOY CANTA FERNANDO!', '#fff', 'rgba(230,57,70,0.9)', 2); sp2.position.set(E.x, y+10.4, E.z + E.d/2); mundo.add(sp2);
  }
  mundo.add(A.malla(matMate()));
})();
/* las luces del concierto: focos de colores en las torres y haces que se encienden cuando alguien canta */
const conciertoLuces = (()=>{
  const E = ESCENARIO, y = altura(E.x, E.z), g = new THREE.Group(), focos = [], haces = [];
  const colores = [0xff6ec0, 0x4fc3f7, 0xffd23f, 0x7dffa0, 0xff8a3d, 0xc07dff];
  for (let i=0;i<6;i++){
    const x = E.x - E.w/2 + 1.5 + i*(E.w-3)/5, z = E.z - E.d/2 + 1.2;
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 6), new THREE.MeshBasicMaterial({color: colores[i]})); f.position.set(x, y+8.6, z); g.add(f); focos.push(f);
    const h = new THREE.Mesh(new THREE.ConeGeometry(2.2, 8.4, 14, 1, true), new THREE.MeshBasicMaterial({color: colores[i], transparent:true, opacity:0.16, depthWrite:false, side:THREE.DoubleSide, blending:THREE.AdditiveBlending}));
    h.position.set(x, y+4.4, z + 1.6); h.rotation.x = Math.PI - 0.35; h.visible = false; g.add(h); haces.push(h);
  }
  mundo.add(g); return {g, focos, haces, colores};
})();
const columpiosMesh = COLUMPIOS.map(c=>{ const g = new THREE.Group(); g.position.set(c.x, c.py + c.pivote, c.z); const A = new Armador(); A.caja(0.9, 0.12, 0.4, '#e63946', 0, -c.largo, 0).cil(0.03, 0.03, c.largo, '#dddddd', -0.4, -c.largo/2, 0, 0,0,0, 4).cil(0.03, 0.03, c.largo, '#dddddd', 0.4, -c.largo/2, 0, 0,0,0, 4); g.add(A.malla(matMate())); g.ang = 0; mundo.add(g); return g; });
const balonMesh = (()=>{ const A = new Armador(); A.bola(0.45, '#ffffff', 0, 0, 0, 12); for (let i=0;i<8;i++){ const a = i/8*6.283, b = (i%2 ? 0.6 : -0.6); A.bola(0.16, '#1a1a20', Math.cos(a)*0.38*Math.cos(b), Math.sin(b)*0.38, Math.sin(a)*0.38*Math.cos(b), 6); } const g = A.malla(matBrillo()); scene.add(g); return g; })();
const balasMesh = [];
function balaMesh(i){ while (balasMesh.length <= i){ const m = new THREE.Mesh(new THREE.SphereGeometry(0.34, 8, 6), new THREE.MeshLambertMaterial({color: 0x222228})); scene.add(m); balasMesh.push(m); } return balasMesh[i]; }
/* el público del concierto: dos versiones de la misma gente (brazos abajo y brazos arriba) que se intercambian en la ovación */
const publico = (()=>{
  const E = ESCENARIO, base = altura(E.x, E.z), camisas = ['#e63946','#4fc3f7','#ffd23f','#7dffa0','#ff6ec0','#ff8a3d','#c07dff','#ffffff','#2a8ad0'], pieles = ['#f1c27d','#e0ac69','#c68642','#8d5524','#ffdbac'];
  const gente = [];
  for (let k=0;k<5;k++){ const zk = E.z + E.d/2 + 5 + k*3.6, hk = altura(E.x, zk), ancho = E.w+8+k*1.5, n = Math.floor(ancho/1.5); for (let i=0;i<n;i++) gente.push({x: E.x - ancho/2 + 0.9 + i*1.5 + (azar()-0.5)*0.4, y: hk+0.7+k*0.1, z: zk + (azar()-0.5)*0.3}); }
  for (let f=0;f<2;f++){ const zf = E.z + E.d/2 + 1.7 + f*1.6; for (let i=0;i<14;i++){ const x = E.x - 10 + i*1.5 + (azar()-0.5)*0.5; gente.push({x, y: altura(x, zf), z: zf}); } }
  const armar = (arriba)=>{
    const A = new Armador();
    gente.forEach((p, i)=>{ const c = camisas[i%camisas.length], piel = pieles[i%pieles.length], x = p.x - E.x, y = p.y - base, z = p.z - E.z;
      A.caja(0.44, 0.5, 0.3, i%3 ? '#2a3a70' : '#5a4a3a', x, y+0.25, z).caja(0.5, 0.6, 0.32, c, x, y+0.8, z).bola(0.22, piel, x, y+1.32, z, 7).bola(0.24, ['#2a1a0a','#5a3a1a','#111','#c8a040'][i%4], x, y+1.4, z, 7, 1, 0.6, 1);
      if (arriba) A.caja(0.12, 0.6, 0.12, c, x-0.36, y+1.28, z, 0, 0, 0.45).caja(0.12, 0.6, 0.12, c, x+0.36, y+1.28, z, 0, 0, -0.45).bola(0.09, piel, x-0.5, y+1.56, z, 5).bola(0.09, piel, x+0.5, y+1.56, z, 5);
      else A.caja(0.12, 0.55, 0.12, c, x-0.32, y+0.8, z).caja(0.12, 0.55, 0.12, c, x+0.32, y+0.8, z).bola(0.09, piel, x-0.32, y+0.5, z, 5).bola(0.09, piel, x+0.32, y+0.5, z, 5); });
    const m = A.malla(matMate()); m.position.set(E.x, base, E.z); mundo.add(m); return m;
  };
  const abajo = armar(false), arriba = armar(true); arriba.visible = false;
  return {abajo, arriba, base, n: gente.length};
})();
let ovacionHasta = 0;
const cantanteMesh = (()=>{ const g = armarJugador('fernando'); g.position.set(CANTANTE.x, altura(CANTANTE.x, CANTANTE.z) + 0.36, CANTANTE.z); g.rotation.y = CANTANTE.ang; const et = letrero('🎤 Fernando', '#fff', 'rgba(200,40,60,0.88)', 1.4); et.position.y = 2.7; g.add(et); mundo.add(g); return g; })();
/* la canción de Fernando (el mp3 de la carpeta): suena al cantar y baja de volumen con la distancia */
let cancion = null;
function cancionTocar(){
  try{
    if (!cancion){ cancion = document.createElement('audio'); cancion.src = 'cancion_pichunguito.mp3'; cancion.preload = 'auto'; cancion.setAttribute('playsinline', ''); vozCaja().appendChild(cancion); }
    cancion.currentTime = 0; cancion.volume = 1;
    const p = cancion.play(); if (p && p.catch) p.catch(()=>{ VOZ.pendientes.add(cancion); if (estado==='juego') aviso('🔊 Toca la pantalla para oír la canción'); });
  }catch(e){}
}
function cancionParar(){ if (cancion){ try{ cancion.pause(); }catch(e){} VOZ.pendientes.delete(cancion); } }
/* los bichos vivos, colocados; el ovni de visita; la mascota */
const elefantesMesh = ELEFANTES.map(n=>{ const g = armarCuadrupedo({tipo:'elefante', color:'#8a8a98', claro:'#b8b8c4', esc:n.esc}); mundo.add(g); return g; });
const renosMesh = RENOS.map(n=>{ const g = armarCuadrupedo({tipo:'reno', color:'#8a5a2a', claro:'#d9a066', nariz:n.nariz}); mundo.add(g); return g; });
const vampirosMesh = VAMPIROS.map(n=>{ const g = armarPersona('vampiro'); const et = letrero('🧛 Vampiro', '#f4c0ff', 'rgba(40,10,50,0.85)', 1.2); et.position.y = 2.7; g.add(et); mundo.add(g); return g; });
const santaMesh = (()=>{ const g = armarPersona('santa'); g.position.set(SANTA.x, altura(SANTA.x, SANTA.z), SANTA.z); g.rotation.y = SANTA.ang; const et = letrero('🎅 Santa Claus', '#fff', 'rgba(190,40,40,0.85)', 1.4); et.position.y = 2.7; g.add(et); mundo.add(g); return g; })();
const circoMesh = CIRCO_NPCS.map(n=>{
  let g;
  if (n.tipo==='payaso') g = armarPersona('payaso', {color:n.color, pelo: n.color==='#e63946' ? '#4fc3f7' : n.color==='#4fc3f7' ? '#ff6ec0' : '#ff8a3d'});
  else if (n.tipo==='leon') g = armarCuadrupedo({tipo:'leon', color:'#e0a040', claro:'#f4d090'});
  else if (n.tipo==='jirafa') g = armarCuadrupedo({tipo:'jirafa', color:'#f0c060', claro:'#f8e0a0', esc:0.85});
  else g = armarCuadrupedo({tipo:'elefante', color:'#9a9aa8', claro:'#c8c8d4', esc:0.75});
  const et = letrero(n.nombre, '#fff', 'rgba(200,40,60,0.85)', 1.4); et.position.y = n.tipo==='jirafa' ? 8.5 : n.tipo==='elefanteCirco' ? 6 : 2.7; g.add(et);
  g.position.set(n.x, INTERIOR_CIRCO.y + (n.tipo==='elefanteCirco' ? 2.4 : n.tipo==='leon' ? 1.1 : 0), n.z); interioresMesh[INTERIOR_CIRCO.id].parent.add(g); return g;
});
const monosMesh = (()=>{ const g = new THREE.Group(); const I = INTERIOR_CIRCO; g.position.set(I.x, I.y + I.alto, I.z); const cuerda = new Armador().cil(0.03, 0.03, 2.6, '#e8e0c0', -0.9, -1.3, 0, 0,0,0, 4).cil(0.03, 0.03, 2.6, '#e8e0c0', 0.9, -1.3, 0, 0,0,0, 4).cil(0.05, 0.05, 2.2, '#c9a032', 0, -2.6, 0, 0,0,Math.PI/2, 6).malla(matMate()); g.add(cuerda); for (const s of [-1, 1]){ const m = armarMono(); m.position.set(s*0.5, -2.8, 0); m.rotation.y = s*0.6; g.add(m); } scene.add(g); return g; })();
const visitaMesh = (()=>{ const g = new THREE.Group(); const A = new Armador(); A.cil(2.4, 3.3, 0.6, '#9aa4b8', 0, 0.9, 0, 0,0,0, 20).cil(3.3, 2.4, 0.4, '#7a8498', 0, 0.4, 0, 0,0,0, 20).bola(1.4, '#7de0ff', 0, 1.2, 0, 12, 1, 0.75, 1); g.add(A.malla(matBrillo())); g.luces = []; for (let i=0;i<8;i++){ const a = i/8*6.283; const l = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 5), new THREE.MeshBasicMaterial({color: i%2 ? 0xff5a5a : 0x7dffa0})); l.position.set(Math.cos(a)*3.0, 0.7, Math.sin(a)*3.0); g.add(l); g.luces.push(l); }
  g.haz = new THREE.Mesh(new THREE.ConeGeometry(3.2, 8, 20, 1, true), new THREE.MeshBasicMaterial({color: 0x9dffb0, transparent:true, opacity:0.2, depthWrite:false, side: THREE.DoubleSide})); g.haz.position.y = -3.8; g.haz.rotation.x = Math.PI; g.add(g.haz);
  g.aliens = []; g.visible = false; scene.add(g); return g; })();
let mascotaMesh = null, mascotaId = null;
/* el sol y la luna del cielo con la hora; de noche las farolas y las ventanas se encienden */
const FAROLAS = [];
(function ponerFarolas(){
  const A = new Armador(), glowTex = texturaResplandor();
  const brillo = (x, y, z, color, esc, alfa)=>{ const sp = new THREE.Sprite(new THREE.SpriteMaterial({map: glowTex, color, transparent:true, opacity: 0, depthWrite:false, blending:THREE.AdditiveBlending})); sp.scale.set(esc, esc, 1); sp.position.set(x, y, z); sp.alfa = alfa; mundo.add(sp); FAROLAS.push(sp); return sp; };
  for (const c of CASAS.concat(CASAS_MCBO)){
    const y = altura(c.x, c.z), px = c.x + Math.sin(c.puerta)*(c.w/2 + 2.5), pz = c.z + Math.cos(c.puerta)*(c.d/2 + 2.5);
    if (!NOCHE) A.cil(0.12, 0.16, 4.2, '#3a3a44', px, y+2.1, pz, 0,0,0,6).bola(0.42, '#fff2b0', px, y+4.4, pz, 8);
    brillo(px, y+4.4, pz, 0xffd27a, 9, 0.6);
    for (const k of [-0.3, 0.3]){ const a = c.puerta + Math.PI; const wx = c.x + Math.sin(a)*(c.w/2 + 0.3) + Math.cos(a)*k*(a===0||Math.abs(a)===Math.PI ? c.w : c.d), wz = c.z + Math.cos(a)*(c.d/2 + 0.3) - Math.sin(a)*k*(a===0||Math.abs(a)===Math.PI ? c.w : c.d); brillo(wx, y + c.h*0.55, wz, 0xffe08a, 3.2, 0.5); }
  }
  for (const [x, z] of [[FUENTE.x+6, FUENTE.z+6], [FUENTE.x-6, FUENTE.z-6], [PLAZA_MCBO.x+8, PLAZA_MCBO.z], [PLAZA_MCBO.x-8, PLAZA_MCBO.z]]){ const y = altura(x, z); if (!NOCHE) A.cil(0.12, 0.16, 4.2, '#3a3a44', x, y+2.1, z, 0,0,0,6).bola(0.42, '#fff2b0', x, y+4.4, z, 8); brillo(x, y+4.4, z, 0xffd27a, 9, 0.6); }
  for (let i=1;i<VEREDA.pts.length;i+=5){ const p = VEREDA.pts[i]; const x = p.x + p.nx*3.0, z = p.z + p.nz*3.0; brillo(x, altura(x, z)+4.4, z, 0xffd27a, 9, 0.6); }
  if (!NOCHE) mundo.add(A.malla(matMate()));
})();
const lunaCielo = new THREE.Sprite(new THREE.SpriteMaterial({map: texturaResplandor(), color: 0xe8f0ff, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, fog:false, opacity:0}));
lunaCielo.scale.set(150, 150, 1); scene.add(lunaCielo);
/* todo lo nuevo sigue al núcleo */
const meteoritoVisitaLuz = null;
function sincronizarMundoNuevo(t){
  const J = P.J, nf = nocheF(P);
  /* el paracaídas cuelga del jugador */
  paracaidasMesh.visible = P.paracaidas; if (P.paracaidas){ paracaidasMesh.position.set(J.x, J.y, J.z); paracaidasMesh.rotation.set(J.vz*0.02, J.ang, -J.vx*0.02); if (fer.tipo==='persona'){ fer.partes.bI.rotation.x = -2.9; fer.partes.bD.rotation.x = -2.9; } }
  /* monedas girando */
  monedasMesh.forEach((m, i)=>{ const d = MONEDAS[i], tm = P.monedasT[d.id]; m.visible = tm === undefined || P.t - tm >= 60*180; if (!m.visible || Math.abs(d.x-J.x) > 160 || Math.abs(d.z-J.z) > 160) return; m.rotation.y = t*2.2 + i; m.position.y = d.y + Math.sin(t*2.6 + i)*0.12; });
  /* fantasmas de popo */
  while (fantasmasMesh.length < P.fantasmas.length){ const g = armarFantasma(); scene.add(g); fantasmasMesh.push(g); }
  fantasmasMesh.forEach((g, i)=>{ const f = P.fantasmas[i]; if (!f){ g.visible = false; return; } g.visible = true; g.position.set(f.x, f.y, f.z); g.rotation.y = Math.atan2(J.x-f.x, J.z-f.z); g.scale.setScalar(1 + Math.sin(f.fase*1.3)*0.06); });
  /* props: cajas, conos, gallinas y sandías */
  P.props.forEach((p, i)=>{
    const g = propsMesh[i]; if (Math.abs(p.x-J.x) > 180 || Math.abs(p.z-J.z) > 180) return;
    g.visible = p.estado !== 'roto';
    g.position.set(p.x, p.y, p.z); g.rotation.y = p.ang;
    if (p.estado==='aire'){ g.rotation.x = p.tipo==='gallina' ? -0.3 : p.ang*0.7; g.rotation.z = p.tipo==='gallina' ? 0 : p.ang*0.3; } else { g.rotation.x = 0; g.rotation.z = 0; }
    if (g.alas){ const w = p.estado==='aire' ? Math.sin(t*30)*1.0 : p.estado==='huye' ? Math.sin(t*18)*0.5 : 0; g.alas[0].rotation.z = 0.4 + w; g.alas[1].rotation.z = -0.4 - w; g.cuerpo.position.y = p.estado==='huye' ? Math.abs(Math.sin(t*16))*0.12 : 0; g.cuerpo.rotation.x = p.estado==='quieto' && Math.sin(t*0.7 + i) > 0.6 ? 0.5 : 0; }
  });
  /* los bichos que pasean */
  const poneNPC = (g, n, y)=>{ g.position.set(n.x, y, n.z); g.rotation.y = n.ang; const amp = Math.min(1, n.mov/1.2), s = Math.sin(n.fase*4); if (g.partes && g.partes.patas) g.partes.patas.forEach((p, k)=>{ p.rotation.x = s*0.5*amp*(k%2 ? -1 : 1)*(k>=2 ? -1 : 1); }); else if (g.partes) animarPersona(g, n.mov*2, n.fase*2.5, false, false); };
  if (Math.hypot(J.x-ISLA_ELEFANTES.x, J.z-ISLA_ELEFANTES.z) < 220) P.elefantes.forEach((n, i)=>poneNPC(elefantesMesh[i], n, altura(n.x, n.z)));
  columpiosMesh.forEach((g, i)=>{ const obj = P.columpio && P.columpio.i===i ? P.columpio.ang : Math.sin(t*1.1 + i)*0.06; g.ang += (obj - g.ang)*(P.columpio && P.columpio.i===i ? 1 : 0.05); g.rotation.x = g.ang; });
  if (P.casa){ const I = P.casa; for (const m of I.muebles){ if (!m.vista && m.t!=='chimenea' && m.t!=='rocola') continue; const k = I.id + '/' + m.t + '/' + Math.round(m.x) + ',' + Math.round(m.z), e = P.casaEstado[k], on = !!(e && e.on);
      if (m.t==='tele' && m.vista){ m.vista.pantalla.material.color.setHex(on ? [0x4fc3f7, 0xff6ec0, 0xffe36e, 0x7dffa0, 0xffffff][Math.floor(t*2.5)%5] : 0x1a2a3a); }
      else if (m.t==='lampara' && m.vista){ m.vista.brillo.visible = on; }
      else if (m.t==='arbolNavidad' && m.vista){ m.vista.luces.forEach((l, i)=>{ l.visible = on && Math.floor(t*3 + i) % 3 !== 0; }); }
      else if (m.t==='chimenea' && on && tick % 3 === 0){ const sx = Math.sin(m.ang), cz = Math.cos(m.ang); particula(m.x + sx*0.4 + (azar()-0.5)*0.6, I.y + 0.5, m.z + cz*0.4 + (azar()-0.5)*0.4, azar() < 0.5 ? '#ffa020' : '#ffe36e', (azar()-0.5)*0.4, 1.2+azar()*1.2, (azar()-0.5)*0.4, 30, 0.22, {grav:-2, alfa:0.9}); }
      else if (m.t==='rocola' && on && tick % 12 === 0){ particula(m.x + (azar()-0.5)*0.8, I.y + 2.0, m.z + (azar()-0.5)*0.8, ['#ff6ec0','#4fc3f7','#ffe36e'][tick%3], (azar()-0.5)*0.6, 1.5, (azar()-0.5)*0.6, 60, 0.25, {grav:-0.5, alfa:0.9}); } } }
  { const B = P.balon; balonMesh.visible = Math.abs(J.x-CANCHA.x) < 260 && Math.abs(J.z-CANCHA.z) < 260 && !B.gol; balonMesh.position.set(B.x, B.y, B.z); balonMesh.rotation.x += B.vz*DT/0.45; balonMesh.rotation.z -= B.vx*DT/0.45; }
  balasMesh.forEach(m=>{ m.visible = false; }); P.balas.forEach((b, i)=>{ const m = balaMesh(i); m.visible = true; m.position.set(b.x, b.y, b.z); });
  if (Math.hypot(J.x-ISLA_CONCIERTO.x, J.z-ISLA_CONCIERTO.z) < 260){
    const canta = !!P.canto, deNPC = canta && P.canto.quien==='npc';
    const ovacion = tick < ovacionHasta;
    publico.arriba.visible = ovacion; publico.abajo.visible = !ovacion;
    if (ovacion){ publico.arriba.position.y = publico.base + Math.abs(Math.sin(t*9))*0.35; publico.arriba.rotation.z = Math.sin(t*4)*0.02; if (tick % 2 === 0) for (let i=0;i<3;i++) particula(ESCENARIO.x + (azar()-0.5)*40, publico.base + 22 + azar()*6, ESCENARIO.z + 2 + azar()*24, ['#e63946','#ffd23f','#4fc3f7','#7dffa0','#ff6ec0','#ffffff'][Math.floor(azar()*6)], (azar()-0.5)*2, -1 - azar()*2, (azar()-0.5)*2, 200, 0.16+azar()*0.12, {grav:1.2, confeti:true}); }
    else { publico.abajo.position.y = publico.base + (canta ? Math.abs(Math.sin(t*3.5))*0.12 : 0); publico.abajo.rotation.z = canta ? Math.sin(t*1.8)*0.015 : 0; }
    cantanteMesh.visible = P.pj !== 'fernando';
    if (cantanteMesh.visible){
      const c = cantanteMesh.partes;
      animarPersona(cantanteMesh, 0, t*2, false, false);
      if (deNPC){ c.bD.rotation.x = -1.7 + Math.sin(t*6)*0.15; c.bI.rotation.x = -0.5 + Math.sin(t*4)*0.5; c.bI.rotation.z = -0.5; c.cuerpo.position.y = Math.abs(Math.sin(t*7))*0.08; cantanteMesh.rotation.y = CANTANTE.ang + Math.sin(t*1.5)*0.35; }
      else { c.bD.rotation.x = -0.4; c.bI.rotation.z = -0.12; cantanteMesh.rotation.y = envolver(cantanteMesh.rotation.y + envolver((Math.hypot(J.x-CANTANTE.x, J.z-CANTANTE.z) < 12 ? Math.atan2(J.x-CANTANTE.x, J.z-CANTANTE.z) : CANTANTE.ang) - cantanteMesh.rotation.y)*0.06); }
    }
    conciertoLuces.haces.forEach((h, i)=>{ h.visible = canta; if (canta){ h.rotation.z = Math.sin(t*2.2 + i*1.1)*0.5; h.material.opacity = 0.12 + Math.abs(Math.sin(t*5 + i))*0.12; } });
    conciertoLuces.focos.forEach((f, i)=>{ f.material.color.setHex(conciertoLuces.colores[canta ? (i + Math.floor(t*4)) % 6 : i]); });
    if (canta && tick % 8 === 0){ const y = altura(MICROFONO.x, MICROFONO.z); particula(MICROFONO.x + (azar()-0.5)*1.5, y+2.4, MICROFONO.z + 0.6, ['#ff6ec0','#4fc3f7','#ffd23f'][tick%3], (azar()-0.5)*1.5, 2.5+azar()*1.5, 1+azar(), 70, 0.2, {grav:0.5, alfa:0.9}); }
    if (canta && tick % 30 === 0) confeti(ESCENARIO.x + (azar()-0.5)*20, altura(ESCENARIO.x, ESCENARIO.z+12)+6, ESCENARIO.z + 10 + azar()*10, 6);
  }
  if (Math.hypot(J.x-ISLA_VAMPIROS.x, J.z-ISLA_VAMPIROS.z) < 220) P.vampiros.forEach((n, i)=>{ const g = vampirosMesh[i]; poneNPC(g, n, altura(n.x, n.z)); g.rotation.z = Math.sin(n.fase*2.5 + i)*0.18; g.rotation.x = Math.sin(n.fase*1.7)*0.08; if (g.partes.capa) ondearCapa(g.partes.capa, t, 0.4 + n.mov*0.3); });
  if (Math.hypot(J.x-MONTANA.x, J.z-MONTANA.z) < 220){ P.renos.forEach((n, i)=>poneNPC(renosMesh[i], n, altura(n.x, n.z))); santaMesh.rotation.y = envolver(santaMesh.rotation.y + envolver((Math.hypot(J.x-SANTA.x, J.z-SANTA.z) < 14 ? Math.atan2(J.x-SANTA.x, J.z-SANTA.z) : SANTA.ang) - santaMesh.rotation.y)*0.06); animarPersona(santaMesh, 0, P.santa.fase, false, false); santaMesh.partes.bD.rotation.x = P.t - P.santa.saludoT < 90 ? -2.6 + Math.sin(t*8)*0.4 : -0.3; }
  if (P.casa && P.casa.circo){ const I = P.casa; P.circo.forEach((n, i)=>{ const g = circoMesh[i]; poneNPC(g, n, I.y + (n.tipo==='elefanteCirco' ? 2.4 : n.tipo==='leon' ? 1.1 : 0)); if (n.tipo==='payaso') g.position.y += Math.abs(Math.sin(n.fase*3))*0.15; if (n.tipo==='elefanteCirco') g.rotation.y = t*0.8; }); monosMesh.rotation.x = Math.sin(t*1.6)*0.9; }
  if (P.zona){ const Z = P.zona, zm = zonasMesh[Z.id]; P.aliens[Z.id].forEach((n, i)=>{ const g = zm.aliens[i]; g.position.set(n.x, Z.y + Math.abs(Math.sin(n.fase*3))*0.2*Math.min(1, n.mov), n.z); g.rotation.y = n.ang; const sal = P.t - n.saludoT < 90; g.brazos[0].rotation.z = sal ? 2.4 + Math.sin(t*9)*0.5 : 0.2; g.brazos[1].rotation.z = sal ? -2.4 - Math.sin(t*9)*0.5 : -0.2; });
    zm.bandera.visible = P.zonasVistas.includes(Z.id); if (zm.bandera.visible) ondearBandera(zm.tela, t);
    const lista = Z.id==='luna' ? P.prog.rocas : Z.id==='jupiter' ? P.prog.cristales : []; zm.recogibles.forEach((m, i)=>{ const r = Z.recogibles[i]; m.visible = !lista.includes(r.id); m.rotation.y = t*1.5 + i; }); }
  /* la visita de los extraterrestres */
  const V = P.visita;
  visitaMesh.visible = !!V;
  if (V){ visitaMesh.position.set(V.x, V.y, V.z); visitaMesh.rotation.y = t*0.6; visitaMesh.luces.forEach((l, i)=>{ l.visible = Math.floor(t*6 + i) % 3 !== 0; }); visitaMesh.haz.visible = V.fase !== 'pasea';
    while (visitaMesh.aliens.length < 2){ const a = armarAlien(V.tipo); scene.add(a); visitaMesh.aliens.push(a); }
    if (visitaMesh.tipo !== V.tipo){ for (const a of visitaMesh.aliens) scene.remove(a); visitaMesh.aliens = []; visitaMesh.tipo = V.tipo; }
    visitaMesh.aliens.forEach((g, i)=>{ const n = V.aliens[i]; if (!n){ g.visible = false; return; } g.visible = V.fase==='pasea'; g.position.set(n.x, altura(n.x, n.z), n.z); g.rotation.y = n.ang; const sal = P.t - n.saludoT < 90; g.brazos[0].rotation.z = sal ? 2.4 + Math.sin(t*9)*0.5 : 0.2; g.brazos[1].rotation.z = sal ? -2.4 - Math.sin(t*9)*0.5 : -0.2; });
  } else if (visitaMesh.aliens.length){ for (const a of visitaMesh.aliens) a.visible = false; }
  /* la mascota */
  if (P.mascota !== mascotaId){ if (mascotaMesh){ scene.remove(mascotaMesh); mascotaMesh = null; } mascotaId = P.mascota; if (mascotaId){ mascotaMesh = armarMascota(mascotaId); scene.add(mascotaMesh); } }
  if (mascotaMesh){ const m = P.mascotaPos; mascotaMesh.visible = !!m && !m.dentro; if (m){ mascotaMesh.position.set(m.x, m.y + Math.abs(Math.sin(m.fase))*0.2*Math.min(1, m.mov/2), m.z); mascotaMesh.rotation.y = m.ang; } }
  /* el sol y la luna del cielo */
  if (!NOCHE){ const a = (P.hora - 0.25)*6.283; sol.position.set(camera.position.x + Math.cos(a)*700, camera.position.y + Math.sin(a)*600 + 60, camera.position.z + 300); lunaCielo.position.set(camera.position.x - Math.cos(a)*650, camera.position.y - Math.sin(a)*560 + 80, camera.position.z - 250); lunaCielo.material.opacity = nf*0.9; }
  for (const f of FAROLAS) f.material.opacity = f.alfa*nf;
}
const vehMesh = {};
for (const v of VEHICULOS_DEF){
  const m = armarVehiculo(v.id); scene.add(m); vehMesh[v.id] = m;
  const et = letrero(v.emoji+' '+v.nombre.replace('el ','').replace('la ','').toUpperCase(), '#fff', 'rgba(20,20,50,0.8)', 1.6);
  et.position.y = v.id==='avion' ? 4.2 : v.id==='barco' ? 5.6 : v.id==='sub' ? 4.8 : v.id==='heli' ? 5.2 : v.id==='nave' ? 9.5 : v.id==='dino' ? 6.8 : v.id==='ptero' ? 5.2 : v.id==='ovni' ? 4.6 : 3.0; m.add(et); m.etiqueta = et;
}

/* ---------------- Jugar con amigos: Trystero ----------------
   Los navegadores se conectan directo entre sí (WebRTC). Para presentarse
   usan dos caminos a la vez, cada uno con varios relés públicos: Nostr y
   MQTT. Basta con que uno solo de todos esos relés funcione en los dos
   aparatos para que se encuentren; la sala no depende de ningún servidor
   nuestro. Todos se conectan con todos (malla); cada quien juega su propia
   partida y ve a los otros corriendo, manejando y volando por la isla. */
const MEDIOS = ['nostr', 'mqtt'];
const RED = {estado:'off', rooms:{}, acciones:{}, pares:new Map(), otroMapa:new Set(), sala:'', anfitrion:false, anfitrionId:'', remotos:new Map(), pj:'fernando', error:'', codigo:'', pendiente:'', entrandoCodigo:false, avisos:[], t0:0, aviso_:'', fallos:0, vistos:0};
try{ const g = localStorage.getItem('aventura3d.pj'); if (g && PERSONAJES_RED.some(p=>p.id===g)) RED.pj = g; }catch(e){}
try{ const c = normalizarCodigo(new URL(location.href).searchParams.get('sala')); if (c.length===4) RED.pendiente = c; }catch(e){}
const nombreLocal = ()=> PERSONAJES_RED.find(p=>p.id===RED.pj).nombre;
const hayRed = ()=> typeof Trystero !== 'undefined' && !!(Trystero.nostr && Trystero.mqtt);
const redAbierta = ()=> Object.keys(RED.rooms).length > 0;
const redActiva = ()=> redAbierta() && (RED.estado==='sala' || RED.estado==='conectado');
const enlaceSala = ()=> location.origin + location.pathname + '?sala=' + RED.sala + (MAPA===2 ? '&mapa=2' : '');
/* Los servidores que ayudan a que dos aparatos se hablen directo: STUN para
   descubrir la dirección de cada uno, y TURN (relevo gratuito de Open Relay)
   para cuando el router no deja hablar directo, por ejemplo en WiFi con
   aislamiento entre aparatos o cuando uno está con datos móviles. */
const RED_CONFIG = {appId:'fernando-bros-aventura3d', relayConfig:{redundancy:4, warnOnRelayFailure:false}, rtcConfig:{iceServers:[
  {urls:'stun:stun.l.google.com:19302'}, {urls:'stun:stun1.l.google.com:19302'}, {urls:'stun:stun.cloudflare.com:3478'}, {urls:'stun:stun.relay.metered.ca:80'},
  {urls:'turn:openrelay.metered.ca:80', username:'openrelayproject', credential:'openrelayproject'},
  {urls:'turn:openrelay.metered.ca:443', username:'openrelayproject', credential:'openrelayproject'},
  {urls:'turn:openrelay.metered.ca:443?transport=tcp', username:'openrelayproject', credential:'openrelayproject'},
]}};
/* los relés: null = la lista pública de Trystero; en las pruebas se ponen los de la misma máquina */
const RED_RELES = {nostr:null, mqtt:null};
function redReles(medio){ try{ const s = Trystero[medio].getRelaySockets(); const t = Object.values(s); return {abiertos: t.filter(w=>w && w.readyState===1).length, total: t.length}; }catch(e){ return {abiertos:0, total:0}; } }
function redRelesAbiertos(){ let n = 0; for (const m of MEDIOS) if (RED.rooms[m]) n += redReles(m).abiertos; return n; }
/* lo que se ve en pantalla para saber por dónde va la conexión */
function redDiagnostico(){
  const partes = MEDIOS.filter(m=>RED.rooms[m]).map(m=>{ const r = redReles(m); return (m==='nostr' ? '🐦 ' : '📡 ')+r.abiertos+'/'+r.total; });
  if (RED.vistos) partes.push('amigos vistos: '+RED.vistos);
  if (RED.fallos) partes.push('enlaces fallidos: '+RED.fallos);
  return partes.length ? 'relés '+partes.join(' · ') : '';
}
/* por cuál camino se le habla a un amigo: el primero en el que se lo vio */
function redMedioDe(id){ const m = RED.pares.get(id); return m && m.size ? [...m][0] : null; }
function redCerrarSala(){
  vozCortarTodo();
  const rooms = RED.rooms; RED.rooms = {}; RED.acciones = {};
  for (const m in rooms){ try{ rooms[m].leave(); }catch(e){} }
  RED.pares.clear(); RED.otroMapa.clear(); RED.anfitrionId = ''; RED.fallos = 0; RED.vistos = 0;
  for (const id of [...RED.remotos.keys()]) quitarRemoto(id);
}
function redLimpiar(){ redCerrarSala(); RED.anfitrion = false; }
function redAbrirSala(codigo){
  RED.t0 = Date.now(); let abiertos = 0;
  for (const medio of MEDIOS){
    try{
      const cfg = Object.assign({}, RED_CONFIG, {relayConfig: Object.assign({}, RED_CONFIG.relayConfig, RED_RELES[medio] ? {urls: RED_RELES[medio]} : {})});
      const room = Trystero[medio].joinRoom(cfg, 'sala-'+codigo+'-v'+VERSION_RED+'-'+medio, {handshakeTimeoutMs: 25000, onJoinError: ()=>{ if (RED.rooms[medio]===room) RED.fallos++; }});   /* 25 s de saludo: un teléfono lento con relevo TURN tarda */
      RED.rooms[medio] = room;
      const accion = room.makeAction('m'); RED.acciones[medio] = accion;
      accion.onMessage = (m, ctx)=>{ if (RED.rooms[medio]!==room || !ctx) return; redRecibir(ctx.peerId, m); };
      room.onPeerJoin = id=>{ if (RED.rooms[medio]===room) redLlegaPar(medio, id); };
      room.onPeerLeave = id=>{ if (RED.rooms[medio]===room) redSeVaPar(medio, id); };
      room.onPeerStream = (st, id)=>{ if (RED.rooms[medio]===room && RED.pares.has(id)) vozLlegaStream(id, st); };
      abiertos++;
    }catch(e){ console.warn('sala por '+medio+': '+(e && e.message)); }
  }
  if (!abiertos) throw new Error('ningún camino disponible');
}
function redLlegaPar(medio, id){
  let set = RED.pares.get(id); const primero = !set || !set.size;
  if (!set){ set = new Set(); RED.pares.set(id, set); }
  set.add(medio);
  if (!primero) return;   /* ya lo teníamos por el otro camino */
  RED.vistos++;
  if (RED.estado==='creando') RED.estado = 'sala';
  if (RED.estado==='uniendo'){ RED.estado = 'conectado'; RED.aviso_ = ''; if (estado!=='juego'){ estado = 'juego'; cortina = 20; } aviso('👥 ¡Entraste a la sala '+RED.sala+'!'); sfx.estrella(); }
  else if (RED.estado==='sala' && !RED.anfitrion) RED.estado = 'conectado';
  redSaludar(id);
  if (VOZ.stream) vozLlamar(id);
}
function redSeVaPar(medio, id){
  const set = RED.pares.get(id); if (!set) return;
  set.delete(medio);
  if (VOZ.llamadas.get(id)===medio){ VOZ.llamadas.delete(id); if (set.size && VOZ.stream) vozLlamar(id); }
  if (set.size) return;   /* sigue por el otro camino */
  RED.pares.delete(id); RED.otroMapa.delete(id); vozCortar(id);
  const r = RED.remotos.get(id); if (r) aviso(r.nombre+' se fue de la isla 👋');
  quitarRemoto(id);
  if (id===RED.anfitrionId) RED.anfitrionId = '';
  if (RED.estado==='conectado' && !RED.pares.size){ RED.estado = 'sala'; aviso('Te quedaste solo en la sala '+RED.sala+'; si vuelven, se conectan solos 🔄'); }
}
function redCrear(){
  if (!hayRed()){ RED.estado = 'error'; RED.error = 'No se cargó la parte de red. Revisa la conexión y recarga la página.'; return; }
  redLimpiar(); RED.estado = 'creando'; RED.sala = codigoSala(); RED.anfitrion = true; RED.error = ''; RED.aviso_ = '';
  try{ redAbrirSala(RED.sala); }catch(e){ RED.estado = 'error'; RED.error = 'Algo falló al abrir la sala ('+(e && e.message || '?')+'). Vuelve a intentar.'; }
}
function redUnirse(codigo){
  codigo = normalizarCodigo(codigo);
  if (codigo.length !== 4){ RED.error = 'El código tiene 4 letras o números'; return; }
  if (!hayRed()){ RED.estado = 'error'; RED.error = 'No se cargó la parte de red. Revisa la conexión y recarga la página.'; return; }
  redLimpiar(); RED.estado = 'uniendo'; RED.sala = codigo; RED.anfitrion = false; RED.error = ''; RED.entrandoCodigo = false; RED.aviso_ = '';
  try{ redAbrirSala(codigo); }catch(e){ RED.estado = 'error'; RED.error = 'Algo falló al entrar a la sala ('+(e && e.message || '?')+'). Vuelve a intentar.'; }
}
function redSalir(){ if (RED.pares.size) redEnviar({t:'chau'}); redLimpiar(); RED.estado = 'off'; RED.sala = ''; }
function redSaludar(id){ redEnviarA(id, {t:'hola', pj:RED.pj, n:nombreLocal(), v:VERSION_RED, es:P.estrellas.slice(), mapa:MAPA, anf: RED.anfitrion}); }
/* a cada amigo se le manda una sola vez, por el camino en que se lo vio primero */
function redEnviar(m){
  if (!RED.pares.size) return;
  const porMedio = {};
  for (const id of RED.pares.keys()){ const md = redMedioDe(id); if (md) (porMedio[md] = porMedio[md] || []).push(id); }
  for (const md in porMedio){ const ac = RED.acciones[md]; if (ac) try{ ac.send(m, {target: porMedio[md]}).catch(()=>{}); }catch(e){} }
}
function redEnviarA(id, m){ const md = redMedioDe(id), ac = md && RED.acciones[md]; if (!ac) return; try{ ac.send(m, {target:id}).catch(()=>{}); }catch(e){} }
function redEvento(tipo, datos){ if (RED.pares.size) redEnviar(Object.assign({t:'ev', tipo}, datos||{})); }
function redRecibir(id, m){
  if (!m || typeof m !== 'object') return;
  if (RED.otroMapa.has(id) && m.t!=='hola') return;
  if (m.t==='mapa' && !RED.anfitrion && (!RED.anfitrionId || id===RED.anfitrionId) && (m.mapa===1 || m.mapa===2) && m.mapa !== MAPA){
    const sala = RED.sala; redLimpiar(); RED.estado = 'error';
    RED.error = 'La sala '+sala+' está en el mapa '+(m.mapa===2 ? '2, Maracaibo de noche 🌙' : '1, la isla de día ☀️')+'. Te llevo allá…';
    try{ localStorage.setItem('aventura3d.mapa', String(m.mapa)); }catch(e){}
    setTimeout(()=>{ salidaAvisada = true; location.href = location.pathname + '?mapa=' + m.mapa + '&sala=' + sala; }, 1800);
    return;
  }
  if (m.t==='llena'){ if (!RED.anfitrion && (!RED.anfitrionId || id===RED.anfitrionId)){ redLimpiar(); RED.estado = 'error'; RED.error = 'La sala '+RED.sala+' está llena: ya hay '+MAX_JUGADORES+' jugadores. Pídele a alguien que cree otra sala.'; if (estado==='juego') estado = 'amigos'; } return; }
  if (m.t==='voz'){ const r = RED.remotos.get(id); if (r){ r.hablando = !!m.on; r.hablaT = tick; } return; }
  if (m.t==='chau'){ const r = RED.remotos.get(id); if (r) aviso(r.nombre+' se fue de la isla 👋'); quitarRemoto(id); return; }
  if (m.t==='hola'){
    const pj = PERSONAJES_RED.some(p=>p.id===m.pj) ? m.pj : 'fernando';
    const nombre = String(m.n||'').replace(/[^\wáéíóúñÁÉÍÓÚÑ ]/g, '').slice(0, 14) || PERSONAJES_RED.find(p=>p.id===pj).nombre;
    if (m.anf) RED.anfitrionId = id;
    if (m.mapa && m.mapa !== MAPA){ RED.otroMapa.add(id); if (RED.anfitrion){ aviso('🗺️ '+nombre+' estaba en el otro mapa: lo traigo a este'); redEnviarA(id, {t:'mapa', mapa:MAPA}); } return; }
    RED.otroMapa.delete(id);
    if (RED.anfitrion && !RED.remotos.has(id) && RED.remotos.size >= MAX_JUGADORES-1){ redEnviarA(id, {t:'llena', max:MAX_JUGADORES}); return; }
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
    else if (r.pj !== e.pj || r.nombre !== e.nombre || r.gorila !== !!e.gorila){ const hab = r.hablando; quitarRemoto(id, true); r = crearRemoto(id, e); r.hablando = hab; r.hablaT = tick; }   /* cambió de personaje (o se volvió gorila): se rearma el muñeco sin cortar la voz */
    r.obj = e; r.t = tick;
    { const ro = e.ropa || {}, clave = (ro.gorro||'')+'/'+(ro.capa||'')+'/'+(ro.carro||''); if (r.ropaClave !== clave){ r.ropaClave = clave; vestir(r.g, ro); vestir(r.gs, ro); if (r.vehs.carro){ scene.remove(r.vehs.carro); delete r.vehs.carro; } r.ropa = ro; } }
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
    else if (m.tipo==='canta' && cerca){ cancionTocar(); confeti(x, y+3, z, 30); burbuja('🎶 Pichunguito… 🎶', r.nombre); }
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
  r.gorila = !!e.gorila;
  r.g = armarJugador(e.pj, r.gorila); r.g.visible = false; scene.add(r.g);
  r.gs = armarJugador(e.pj, r.gorila); r.gs.visible = false; scene.add(r.gs);
  r.etiqueta = letrero('👤 '+e.nombre, '#fff', 'rgba(20,80,170,0.88)', 1.4); r.etiqueta.position.y = 2.6/r.g.esc; r.g.add(r.etiqueta);
  r.bocina = letrero('🔊', '#fff', 'rgba(40,160,80,0.9)', 0.9); r.bocina.position.y = 3.4/r.g.esc; r.bocina.visible = false; r.g.add(r.bocina);
  r.hablando = false; r.hablaT = 0;
  RED.remotos.set(id, r); return r;
}
function quitarRemoto(id, mantenerVoz){
  if (!mantenerVoz) vozCortar(id);
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
      if (!vm){ const itc = o.veh==='carro' && r.ropa && r.ropa.carro ? ITEMS_TIENDA.find(i=>i.id===r.ropa.carro) : null; vm = armarVehiculo(o.veh, itc ? {color:itc.color, claro:itc.claro} : null); const et = letrero('👤 '+r.nombre, '#fff', 'rgba(20,80,170,0.88)', 1.4); et.position.y = o.veh==='avion' ? 4.2 : o.veh==='barco' ? 5.6 : o.veh==='sub' ? 4.8 : o.veh==='heli' ? 5.2 : o.veh==='nave' ? 9.5 : o.veh==='dino' ? 6.8 : o.veh==='ptero' ? 5.2 : o.veh==='ovni' ? 4.6 : 3.0; vm.add(et); scene.add(vm); r.vehs[o.veh] = vm; }
      for (const k in r.vehs) r.vehs[k].visible = k===o.veh;
      vm.position.set(a.x, a.y, a.z);
      vm.rotation.set(-o.cabeceo, a.ang, o.veh==='avion' && o.aire ? o.giro*0.7 : o.veh==='moto' ? o.giro*0.45 : o.giro*0.1, 'YXZ');
      const R = vm.partes;
      for (const w of R.ruedas){ w.giro.rotation.x += o.vel*DT/w.r; if (w.delante) w.dir.rotation.y = o.giro*0.45; }
      animarVehiculo(R, o.veh, true, o.vel, o.aire, o.y > 260, tick*DT);
      R.sombra.visible = o.veh!=='sub';
      if (r.gs.parent !== vm) vm.add(r.gs);
      r.gs.visible = true; r.gs.position.set(R.asiento.x, R.asiento.y, R.asiento.z); { const k = gorduraDe(o.gordura||0, !!o.flaco); r.gs.scale.set(r.gs.esc*R.asiento.esc*k.kx, r.gs.esc*R.asiento.esc*k.ky, r.gs.esc*R.asiento.esc*k.kx); } r.gs.rotation.set(0,0,0);
      animarModelo(r.gs, 0, 0, false, false, !R.asiento.parado);
      r.g.visible = false;
    } else {
      for (const k in r.vehs) r.vehs[k].visible = false;
      r.gs.visible = false;
      r.g.visible = true; r.g.position.set(a.x, a.y, a.z); r.g.rotation.set(o.nadando ? (r.g.tipo==='persona' ? 1.2 : 0.3) : 0, a.ang, 0);
      { const k = gorduraDe(o.gordura||0, !!o.flaco); r.g.scale.set(r.g.esc*k.kx, r.g.esc*k.ky, r.g.esc*k.kx); }
      if (r.g.capaMesh) ondearCapa(r.g.capaMesh, tick*DT, 0.3 + o.mov*0.12);
      animarModelo(r.g, o.mov, r.fase, !o.suelo && !o.nadando, o.nadando);
      r.etiqueta.visible = Math.hypot(a.x-P.J.x, a.z-P.J.z) > 3;
    }
    r.bocina.visible = r.hablando && !o.veh;
  }
}
/* el vigilante de la conexión corre cada medio segundo por reloj, aparte de los cuadros: en un
   teléfono lento (o con la pestaña de fondo) los cuadros van despacio y esto no puede esperar */
function redVigilar(){
  if (!redAbierta()) return;
  const dt = Date.now() - RED.t0;
  if (RED.estado==='creando' || RED.estado==='uniendo'){
    const abiertos = redRelesAbiertos();
    if (RED.estado==='creando' && abiertos > 0){ RED.estado = 'sala'; RED.aviso_ = ''; return; }
    if (RED.estado==='uniendo' && abiertos > 0 && !RED.aviso_) RED.aviso_ = 'Buscando a tus amigos en la sala '+RED.sala+'… puede tardar unos segundos';
    if (abiertos === 0 && dt > 15000){ RED.estado = 'error'; RED.error = 'No pude conectar con ningún relé de salas. Revisa el internet (si estás por WiFi prueba con datos, o al revés) y vuelve a intentar.'; redCerrarSala(); return; }
    /* si ya vio amigos (aunque el enlace haya fallado) se le da hasta minuto y medio: los relés vuelven a presentarlos solos */
    if (RED.estado==='uniendo' && dt > (RED.vistos || RED.fallos ? 90000 : 45000)){
      RED.estado = 'error';
      RED.error = RED.fallos ? 'Vi a tus amigos en la sala '+RED.sala+' pero no se abrió el enlace directo entre los aparatos ('+RED.fallos+' intentos). Prueba con los dos por WiFi, o los dos con datos, y vuelve a intentar.'
        : 'No encontré a nadie en la sala '+RED.sala+' ('+redDiagnostico()+'). Revisa el código, que quien la creó siga con el juego abierto y con la versión nueva (que recargue la página), y que estén en el mismo mapa.';
      redCerrarSala();
    }
  }
}
setInterval(()=>{ try{ redVigilar(); }catch(e){} }, 500);
function redPaso(){
  if (!redActiva() || !RED.pares.size) return;
  if (tick % 4 === 0) redEnviar(empaquetarEstado(P, RED.pj, nombreLocal(), ROPA));
}
/* ---- el walkie-talkie: mantener 🎙️ (o V) para hablar; la voz viaja por WebRTC ----
   El micrófono se pide una sola vez, la primera que se aprieta el botón. Los
   sonidos del micro se apagan al soltar (push-to-talk), así nadie se oye sin
   querer. Cada jugador llama a los demás por PeerJS; la voz sale del parlante
   con volumen según la distancia en la isla. */
const VOZ = {stream:null, permiso:'', hablando:false, pidiendo:false, llamadas:new Map(), audios:new Map(), silencio:false, quiere:false, avisoT:0, pendientes:new Set(), caja:null};
/* los <audio> con la voz de los amigos viven escondidos dentro de la página: en iPhone y en Chrome un
   audio suelto (fuera del DOM) a veces no suena, y si el navegador bloquea el play() por llegar sin
   un toque del usuario, se reintenta en el próximo toque o tecla (vozDesbloquear) */
function vozCaja(){
  if (VOZ.caja) return VOZ.caja;
  const d = document.createElement('div'); d.id = 'voces-amigos'; d.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;overflow:hidden;opacity:0.01;pointer-events:none';
  document.body.appendChild(d); VOZ.caja = d; return d;
}
function vozReproducir(el){
  let p = null;
  try{ p = el.play(); }catch(e){ VOZ.pendientes.add(el); return; }
  if (p && p.then) p.then(()=>{ VOZ.pendientes.delete(el); }).catch(()=>{ VOZ.pendientes.add(el); if (estado==='juego') aviso('🔊 Toca la pantalla para oír a tus amigos'); });
}
function vozDesbloquear(){
  if (!VOZ.pendientes.size) return;
  for (const el of [...VOZ.pendientes]){ VOZ.pendientes.delete(el); if (el.srcObject) vozReproducir(el); }
}
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
  /* se le manda el micro a un amigo (una sola vez por amigo) */
  const md = redMedioDe(id), room = md && RED.rooms[md];
  if (!VOZ.stream || !room || VOZ.llamadas.has(id)) return;
  try{ room.addStream(VOZ.stream, {target:id}); VOZ.llamadas.set(id, md); }catch(e){}
}
function vozLlamarATodos(){ for (const id of RED.pares.keys()) vozLlamar(id); }
function vozLlegaStream(id, st){
  /* llega la voz de un amigo: se cuelga en un <audio> escondido */
  let a = VOZ.audios.get(id);
  if (a && a.el){ VOZ.pendientes.delete(a.el); try{ a.el.pause(); a.el.srcObject = null; a.el.remove(); }catch(e){} }
  const el = document.createElement('audio'); el.autoplay = true; el.playsInline = true; el.setAttribute('playsinline', ''); el.setAttribute('autoplay', ''); el.controls = false;
  el.muted = VOZ.silencio; vozCaja().appendChild(el); el.srcObject = st;
  VOZ.audios.set(id, {el, st});
  vozReproducir(el);
}
function vozCortar(id){
  if (VOZ.llamadas.has(id)){ const md = VOZ.llamadas.get(id), set = RED.pares.get(id); try{ if (VOZ.stream && RED.rooms[md] && set && set.has(md)) RED.rooms[md].removeStream(VOZ.stream, {target:id}); }catch(e){} VOZ.llamadas.delete(id); }
  const a = VOZ.audios.get(id); if (a && a.el){ VOZ.pendientes.delete(a.el); try{ a.el.pause(); a.el.srcObject = null; a.el.remove(); }catch(e){} VOZ.audios.delete(id); }
}
function vozCortarTodo(){ for (const id of [...new Set([...VOZ.llamadas.keys(), ...VOZ.audios.keys()])]) vozCortar(id); vozParar(); }
function vozSilencio(si){
  VOZ.silencio = si; for (const [,a] of VOZ.audios) if (a.el){ a.el.muted = si; if (!si && a.el.paused) vozReproducir(a.el); }
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
  heli:  {d:14,   h:5.5, mira:2.0}, motoagua: {d:9, h:3.8, mira:1.2}, nave: {d:20, h:7, mira:4.0}, dino: {d:12, h:5.5, mira:3.5}, ptero: {d:13, h:5.2, mira:2.6}, ovni: {d:15, h:6.5, mira:2.2}, motonieve: {d:8.5, h:3.6, mira:1.4}, esquis: {d:8, h:3.4, mira:1.4}, tanque: {d:12, h:5.2, mira:2.0}, tabla: {d:8.5, h:3.6, mira:1.2},
  casa: {d:5.4, h:2.9, mira:1.3},
};
scene.fog = new THREE.FogExp2(NOCHE ? 0x0a1128 : 0xc9e4ff, 0.0014);
const NIEBLA_NOCHE = {aire: new THREE.Color(0x0a1128), agua: new THREE.Color(0x06263f)}, NIEBLA_DIA = {aire: new THREE.Color(0xc9e4ff), agua: new THREE.Color(0x0b4f8a)};
const NIEBLA = NOCHE ? NIEBLA_NOCHE : NIEBLA_DIA;

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
  aplicarRopa();
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
let monedaT = -999;
function horaTexto(P){ const h = Math.floor(P.hora*24), m = Math.floor((P.hora*24 - h)*60); return (nocheF(P) > 0.5 ? '🌙 ' : '🌞 ')+h+':'+(m < 10 ? '0' : '')+m; }
function grande(txt, color, dur){ mensajeGrande = {txt, color: color||'#ffe36e', t: dur||90, t0: dur||90}; }
function aviso(txt){ avisoTxt = txt; avisoT = 180; }
/* la ventanita «¿Seguro?»: se pone encima de cualquier pantalla y no deja salir del juego,
   empezar de cero ni cambiar de mapa sin un SÍ a propósito (el NO está marcado por defecto) */
const CONF = {activa:false, texto:'', detalle:'', si:null, sel:0, etiqueta:'SÍ, SALIR'};
function confirmar(texto, detalle, si, etiqueta){ CONF.activa = true; CONF.texto = texto; CONF.detalle = detalle; CONF.si = si; CONF.sel = 0; CONF.etiqueta = etiqueta || 'SÍ, SALIR'; sfx.toque(); }
const zonasConf = ()=>({no:{x:W/2-190, y:H/2+30, w:170, h:48}, si:{x:W/2+20, y:H/2+30, w:170, h:48}});
function confResolver(si){
  const f = CONF.si; CONF.activa = false; CONF.si = null; sfx.toque();
  if (si && f) f();
}
function dibujarConfirmacion(){
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0,0,W,H);
  const w = Math.min(560, W-40), h = 190, x = W/2-w/2, y = H/2-95;
  cristal(x, y, w, h, 22, 0.85);
  ctx.strokeStyle = '#ffe36e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, w, h, 22); ctx.stroke();
  textoAjustado(CONF.texto, W/2, y+40, 26, w-40, '#fff6a0');
  if (CONF.detalle) textoAjustado(CONF.detalle, W/2, y+78, 15, w-40, '#bcd6ff');
  const z = zonasConf();
  boton(z.no.x, z.no.y, z.no.w, z.no.h, '✋ NO, SEGUIR', '#3aa040', '#1e6a24', 18, CONF.sel===0);
  boton(z.si.x, z.si.y, z.si.w, z.si.h, '✅ '+CONF.etiqueta, '#c03a30', '#801a10', 18, CONF.sel===1);
  if (!tactil) texto('Flechas y ENTER · ESC = no', W/2, y+h-14, 12, 'rgba(255,255,255,0.6)');
}
function volverAFernandoBros(){ salidaAvisada = true; try{ location.href = URL_VOLVER; }catch(e){} }
function pedirSalir(){ if (CONF.activa) return; confirmar('¿Seguro que quieres salir del juego?', 'La partida queda guardada, pero se cierra la isla' + (redActiva() ? ' y sales de la sala ' + RED.sala : '') + '.', ()=>{ redSalir(); volverAFernandoBros(); }); }
let wakeLock = null;
function pedirPantallaViva(){ try{ if (navigator.wakeLock && !wakeLock) navigator.wakeLock.request('screen').then(w=>{ wakeLock = w; w.addEventListener('release', ()=>{ wakeLock = null; }); }).catch(()=>{}); }catch(e){} }
document.addEventListener('visibilitychange', ()=>{
  if (document.visibilityState !== 'visible') return;
  pedirPantallaViva();
  try{ vozDesbloquear(); }catch(e){}
  /* la sala se reconecta sola: los relés y los amigos se vuelven a encontrar por su cuenta */
});
/* el botón «atrás» del teléfono abre la pausa en vez de salir del juego */
try{ history.pushState({juego:1}, ''); }catch(e){}
window.addEventListener('popstate', ()=>{
  try{ history.pushState({juego:1}, ''); }catch(e){}
  if (CONF.activa) return;
  if (estado==='juego'){ estado = 'pausa'; selPausa = 0; sfx.toque(); }
  else if (estado==='menu') pedirSalir();
  else if (estado==='tienda' || estado==='amigos' || (estado==='personaje' && pjOrigen!=='menu')){ estado = estado==='personaje' ? 'juego' : 'pausa'; }
});
function empezar(){
  pedirPantallaViva();
  if (RED.pendiente && RED.estado==='off'){ const c = RED.pendiente; RED.pendiente = ''; estado = 'amigos'; redUnirse(c); return; }
  estado = 'juego'; cortina = 30;
  hablar('Eres mi pichunguito'); burbuja('Eres mi pichunguito', 'Tío Juan');
  setTimeout(()=>{ if (estado==='juego'){ const t = fraseDe(RED.pj, 'inicio'); hablar(t, RED.pj); burbuja(t, nombreLocal()); } }, 2500);
}
function procesarTecla(k){
  if (CONF.activa){
    if (k==='Escape') confResolver(false);
    else if (k==='ArrowLeft'||k==='ArrowRight'||k==='ArrowUp'||k==='ArrowDown'){ CONF.sel = 1-CONF.sel; sfx.toque(); }
    else if (k==='Enter'||k===' ') confResolver(CONF.sel===1);
    return;
  }
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
    else if (k==='ArrowUp'||k==='ArrowDown'){ const orden = ORDEN_PAUSA; const f = orden.indexOf(selPausa); selPausa = orden[(f + (k==='ArrowUp' ? N_PAUSA-1 : 1)) % N_PAUSA]; sfx.toque(); }
    else if (k==='Enter'||k===' ') elegirPausa(selPausa);
    return;
  }
  if (estado==='tienda'){
    const nc = zonaTienda().ncol, n = ITEMS_TIENDA.length;
    if (k==='Escape'){ sfx.toque(); estado = 'pausa'; }
    else if (k==='ArrowLeft'){ selTienda = (selTienda+n-1)%n; sfx.toque(); }
    else if (k==='ArrowRight'){ selTienda = (selTienda+1)%n; sfx.toque(); }
    else if (k==='ArrowUp'){ selTienda = (selTienda-nc+n)%n; sfx.toque(); }
    else if (k==='ArrowDown'){ selTienda = (selTienda+nc)%n; sfx.toque(); }
    else if (k==='Enter'||k===' ') elegirItem(selTienda);
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
  else if (i===6){ abrirPersonaje('juego'); }   /* cambiar de personaje sin perder la partida */
  else if (i===7){ abrirTienda(); }
  else if (i===1){ estado = 'amigos'; RED.entrandoCodigo = false; RED.error = ''; }
  else if (i===2){ musicaOn = !musicaOn; try{ localStorage.setItem('aventura3d.musica', musicaOn ? 'si' : 'no'); }catch(e){} }
  else if (i===3){ confirmar('¿Empezar de cero?', 'Se borran '+(P.estrellas.length===1 ? 'la estrella' : 'las '+P.estrellas.length+' estrellas')+', las hamburguesas y los puntos de esta aventura.', ()=>{ try{ localStorage.removeItem(CLAVE_PARTIDA); }catch(e){} nuevaPartida(null); abrirPersonaje('nuevo'); }, 'SÍ, BORRAR'); }
  else if (i===4){ confirmar(NOCHE ? '¿Ir al mapa 1, la isla de día?' : '¿Ir al mapa 2, Maracaibo de noche?', 'La partida de este mapa queda guardada' + (redActiva() ? ', pero sales de la sala '+RED.sala : '') + '.', cambiarMapa, 'SÍ, CAMBIAR'); }
  else if (i===5){ pedirSalir(); }
}
const enZona = (mx,my,z,m)=>mx>=z.x-(m||0) && mx<=z.x+z.w+(m||0) && my>=z.y-(m||0) && my<=z.y+z.h+(m||0);
const zonaAtras = ()=>({x:14, y:12, w:190, h:42});
const N_PAUSA = 8, ORDEN_PAUSA = [0, 6, 7, 1, 2, 3, 4, 5];
const zonasPausa = ()=>[0,1,2,3,4,5,6,7].map(i=>({x:W/2-150, y:H/2-10+i*33, w:300, h:30}));
function cambiarMapa(){ const otro = MAPA===2 ? 1 : 2; sfx.toque(); salidaAvisada = true; redSalir(); try{ localStorage.setItem('aventura3d.mapa', String(otro)); }catch(e){} location.href = location.pathname + '?mapa=' + otro; }
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
  if (pjOrigen==='juego'){ estado = 'juego'; cortina = 16; aviso('Ahora juegas con '+nombreLocal()+' '+(PERSONAJES_RED.find(p=>p.id===RED.pj)||PERSONAJES_RED[0]).emoji); setTimeout(()=>{ if (estado==='juego'){ const t = fraseDe(RED.pj, 'inicio'); if (t){ hablar(t, RED.pj); burbuja(t, nombreLocal()); } } }, 400); return; }
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
  if (CONF.activa){ const z = zonasConf(); if (enZona(x, y, z.si, 4)) confResolver(true); else if (enZona(x, y, z.no, 4)) confResolver(false); return; }
  if (estado==='juego'){
    if (redActiva() && !P.escena) for (const z of zonasIrCon()) if (enZona(x, y, z, 4)){ sfx.toque(); irCon(z.id); return; }
    return;
  }
  if (estado==='menu'){
    if (enZona(x, y, zonaAtras(), 6)) return pedirSalir();
    if (enZona(x, y, {x:W/2-200, y:196, w:400, h:38}, 4)) return confirmar(NOCHE ? '¿Ir al mapa 1, la isla de día?' : '¿Ir al mapa 2, Maracaibo de noche?', 'La partida de cada mapa se guarda aparte.', cambiarMapa, 'SÍ, CAMBIAR');
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
  if (estado==='tienda'){
    const z = zonaTienda();
    if (enZona(x, y, z.volver, 6)){ sfx.toque(); estado = 'pausa'; return; }
    z.items.forEach((zp, i)=>{ if (enZona(x, y, zp, 2)){ selTienda = i; elegirItem(i); } });
    return;
  }
  if (estado==='pausa'){
    let dio = false;
    zonasPausa().forEach((z, f)=>{ if (enZona(x, y, z, 4)){ elegirPausa(ORDEN_PAUSA[f]); dio = true; } });
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
    else if (enZona(x, y, zonaAtras(), 6)) pedirSalir();
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
      case 'casaEntra': sfx.puerta(); cortina = 22; grande((e.castillo ? '🏰 ' : '🏠 ')+e.nombre, e.castillo ? '#fff6a0' : '#bfe9ff', 90); break;
      case 'casaSale': sfx.puerta(); cortina = 18; break;
      case 'gordura': if (e.n >= 3) grande(e.n >= 5 ? '¡QUÉ GORDITO! 🍔🍔🍔' : '¡Gordito! 🍔', '#ffb070', 70); break;
      case 'flaco': if (e.antes >= 2) grande('¡FLAQUITO OTRA VEZ! 💪', '#7dffa0', 90); break;
      case 'banana': sfx.banana(); chispas(e.x, e.y, e.z, '#ffe36e', 16, 5); grande('¡BANANA! 🍌', '#ffe36e', 60); redEvento('hamburguesa', {x:e.x, y:e.y, z:e.z}); break;
      case 'gorila': if (e.on){ sfx.gorila(); confeti(J.x, J.y, J.z, 30); grande('¡ERES UN GORILA! 🦍 (1 minuto)', '#ffd27a', 140); sacudida = 10; } else grande('Se acabó la banana: ¡de vuelta a la normalidad!', '#bfe9ff', 100); break;
      case 'dinosVistos': grande('¡DINOSAURIOS! 🦕🦖', '#8fd45e', 110); break;
      case 'rugidoDino': if (Math.hypot(e.x-J.x, e.z-J.z) < 80){ sfx.rugido(); sacudida = 8; } for (let i=0;i<8;i++) particula(e.x + (azar()-0.5)*3, e.y+4, e.z + (azar()-0.5)*3, '#c0ffc0', (azar()-0.5)*4, 1+azar()*2, (azar()-0.5)*4, 30, 0.25, {alfa:0.5, crece:2}); break;
      case 'meteoros': grande('¡LLUVIA DE METEORITOS! ☄️', '#ffb070', 120); break;
      case 'meteoroCae': caeMeteoro(e); break;
      case 'vereda': grande('🌴 ¡LA VEREDA DEL LAGO!', '#7de0ff', 120); break;
      case 'paracaidas': sfx.despegue(); grande('¡PARACAÍDAS! 🪂', '#bfe9ff', 90); break;
      case 'paracaidasSuelo': if (!e.agua){ sfx.aterriza(); for (let i=0;i<8;i++) particula(J.x+(azar()-0.5)*2, J.y+0.3, J.z+(azar()-0.5)*2, '#d8c8a0', (azar()-0.5)*4, 1+azar()*2, (azar()-0.5)*4, 30, 0.3, {alfa:0.6, crece:1.5}); } break;
      case 'avionVuelve': aviso('El avión volvió solo a la pista ✈️'); break;
      case 'zonaEntra': sfx.estrella(); cortina = 22; grande((e.id==='luna' ? (NOCHE ? '🔴 ¡MARTE!' : '🌙 ¡LA LUNA!') : e.id==='saturno' ? '🪐 ¡SATURNO!' : '🟠 ¡JÚPITER!')+(e.primera ? ' +500' : ''), '#fff6a0', 140); if (e.primera) confeti(J.x, J.y, J.z, 40); aviso('Bájate con '+(tactil ? '🚪' : 'E')+' y pasea; con A en la nave vuelves al espacio 🚀'); break;
      case 'zonaSale': cortina = 16; grande('🚀 ¡DE VUELTA AL ESPACIO!', '#bfe9ff', 80); break;
      case 'planetaLlega': sfx.despegue(); grande('¡LLEGAMOS A '+e.nombre+'!', '#fff6a0', 120); break;
      case 'roca': sfx.hamburguesa(); chispas(e.x, e.y+1, e.z, '#c0c0ff', 16, 5); grande('🌑 ROCA '+e.total+'/6', '#c0c0ff', 60); break;
      case 'cristal': sfx.hamburguesa(); chispas(e.x, e.y+1, e.z, '#7de0ff', 20, 6); grande('💎 CRISTAL '+e.total+'/5', '#7de0ff', 60); break;
      case 'saturniano': grande('👽 SATURNIANO '+e.total+'/4', '#c07dff', 70); break;
      case 'saludoNPC': sfx.saludo(); chispas(e.x, e.y+2, e.z, '#ff6ec0', 12, 4); grande('¡HOLA, '+e.nombre.toUpperCase()+'! +'+e.monedas+' 🪙', '#ff9ed6', 90); if (e.bicho==='santa') sfx.campanitas(); else if (e.bicho==='leon') sfx.rugido(); else if (e.bicho==='alien') sfx.ovni(); else if (e.bicho==='elefante' || e.bicho==='elefanteCirco') sfx.trompeta(); else if (e.bicho==='vampiro') sfx.hipo(); redEvento('hamburguesa', {x:e.x, y:e.y, z:e.z}); break;
      case 'monedas': sfx.moneda(); monedaT = tick; if (e.n >= 5) grande('+'+e.n+' 🪙', '#ffe36e', 50); if (Number.isFinite(e.x)) chispas(e.x, e.y, e.z, '#ffe36e', 6, 3); break;
      case 'compra': sfx.estrella(); confeti(J.x, J.y, J.z, 20); grande('¡'+e.nombre.toUpperCase()+'! '+e.emoji, '#ffe36e', 100); break;
      case 'ropa': sfx.toque(); break;
      case 'fantasma': sfx.fantasma(); chispas(e.x, e.y, e.z, '#c0b0ff', 18, 5); grande('¡BUUU! 👻 +8 🪙', '#c0b0ff', 70); break;
      case 'trompeta': sfx.trompeta(); for (let i=0;i<16;i++) particula(e.x + (azar()-0.5), e.y+3.2, e.z + 3.4, '#8fd3ff', (azar()-0.5)*3, 5+azar()*4, 2+azar()*4, 40, 0.2, {grav:10, alfa:0.8}); break;
      case 'hipo': sfx.hipo(); burbuja('¡Hip!', 'Vampiro'); break;
      case 'mueble': { const on = e.on; if (e.t==='tele'){ if (on) sfx.tele(); else sfx.toque(); aviso(on ? '📺 ¡Dibujitos!' : '📺 Tele apagada'); } else if (e.t==='lampara'){ sfx.toque(); aviso(on ? '💡 Luz encendida' : '💡 Luz apagada'); } else if (e.t==='chimenea'){ if (on) sfx.trompeta(); else sfx.toque(); aviso(on ? '🔥 ¡Qué calentico!' : '🔥 Chimenea apagada'); } else if (e.t==='rocola'){ if (on) sfx.rocola(); else sfx.toque(); aviso(on ? '🎵 ¡A bailar!' : '🎵 Música apagada'); } else if (e.t==='arbolNavidad'){ sfx.campanitas(); aviso(on ? '🎄 ¡Luces de Navidad!' : '🎄 Luces apagadas'); } else if (e.t==='piano'){ sfx.piano(); for (let i=0;i<8;i++) particula(e.x + (azar()-0.5)*2, e.y + 1.6, e.z + (azar()-0.5)*1, ['#ff6ec0','#4fc3f7','#ffe36e'][i%3], (azar()-0.5)*0.8, 1.5+azar(), (azar()-0.5)*0.8, 60, 0.25, {grav:-0.5, alfa:0.9}); } else if (e.t==='armadura'){ sfx.choque(); sacudida = 5; burbuja('¡CLANK!', 'La armadura'); } break; }
      case 'muebleNada': aviso(e.texto); sfx.toque(); break;
      case 'sentado': sfx.toque(); if (e.t==='trono') grande('👑 ¡EL TRONO!', '#ffe36e', 80); else aviso('😌 Qué cómodo… (A o la palanca para levantarte)'); break;
      case 'rey': sfx.estrella(); sfx.campanitas(); confeti(J.x, J.y+2, J.z, 40); grande('👑 ¡EL REY DEL CASTILLO! +15 🪙', '#ffe36e', 150); break;
      case 'levanta': sfx.toque(); break;
      case 'dormir': sfx.toque(); cortina = 60; grande('💤 ¡A DORMIR!', '#bfe9ff', 120); break;
      case 'despierta': cortina = 40; sfx.campanitas(); aviso(e.primera ? '☀️ ¡Buenos días! Qué siesta. +10 🪙' : '☀️ ¡Buenos días! Pasó un ratico'); break;
      case 'comidaCasa': sfx.hamburguesa(); chispas(J.x, J.y+1.2, J.z, '#ffe36e', 10, 4); grande(e.arepa ? '🫓 ¡AREPA!' : '🍔 ¡HAMBURGUESA!', '#ffe36e', 70); break;
      case 'regalo': sfx.campanitas(); sfx.estrella(); confeti(e.x, e.y+1, e.z, 40); grande('🎁 ¡REGALO! +15 🪙', '#ff9ed6', 130); break;
      case 'muebleSalto': sfx.salto(); aviso('🛞 ¡Boing!'); break;
      case 'columpio': sfx.toque(); aviso('🎠 Palanca arriba para impulsarte · A para saltar'); break;
      case 'columpioSalta': sfx.salto(); if (e.fuerte) grande('🎠 ¡WIIII!', '#ff9ed6', 60); break;
      case 'columpioAlto': sfx.estrella(); confeti(e.x, e.y+1, e.z, 30); grande('🎠 ¡SALTO DESDE EL COLUMPIO! +10 🪙', '#ff9ed6', 130); break;
      case 'techo': sfx.estrella(); grande('🏠 ¡ARRIBA DEL TECHO!', '#ffe36e', 110); break;
      case 'ovacion': ovacionHasta = tick + 60*6; sfx.aplausos(); grande('👏 ¡OVACIÓN! 👏', '#ffe36e', 150); burbuja('¡Bravo, Fernando! ¡Otra, otra!', 'El público'); break;
      case 'patada': sfx.golpe(); if (e.fuerza > 12) chispas(e.x, e.y, e.z, '#ffffff', 6, 3); break;
      case 'gol': sfx.estrella(); sfx.aplausos(); confeti(e.x, e.y+1, e.z, 50); grande('⚽ ¡GOOOOOL! +10 🪙', '#7dffa0', 140); sacudida = 6; if (e.goles === 1 || e.goles % 5 === 0) hablar(fraseDe(RED.pj, 'gol'), RED.pj), burbuja(fraseDe(RED.pj, 'gol'), nombreLocal()); redEvento('hamburguesa', {x:e.x, y:e.y, z:e.z}); break;
      case 'disparo': sfx.disparo(); chispas(e.x, e.y, e.z, '#ffe36e', 10, 6); sacudida = 5; { const vm = vehMesh.tanque; if (vm && vm.partes && vm.partes.canon) vm.partes.retroceso = 1; } break;
      case 'explosion': sfx.explosion(e.d); chispas(e.x, e.y+0.5, e.z, '#ffa020', 26, 12); chispas(e.x, e.y+0.5, e.z, '#ffe36e', 12, 8); confeti(e.x, e.y+1, e.z, 40); for (let i=0;i<12;i++) particula(e.x + (azar()-0.5)*2, e.y+0.3, e.z + (azar()-0.5)*2, e.agua ? '#dff4ff' : '#8a8a80', (azar()-0.5)*5, 2+azar()*6, (azar()-0.5)*5, 50+azar()*30, 0.5+azar()*0.5, {alfa:0.7, crece:2.5, grav: e.agua ? 10 : 1.5}); if (e.d < 60) sacudida = Math.round(clamp(18 - e.d/4, 4, 18)); break;
      case 'surfea': sfx.estrella(); grande('🏄 ¡AGARRASTE LA OLA!'+(e.primera ? ' +20 🪙' : ''), '#7de0ff', 110); for (let i=0;i<14;i++) particula(e.x + (azar()-0.5)*3, e.y+0.3, e.z + (azar()-0.5)*3, '#ffffff', (azar()-0.5)*5, 2+azar()*4, (azar()-0.5)*5, 40, 0.3, {alfa:0.8, grav:8}); break;
      case 'canta': cancionTocar(); sfx.estrella(); confeti(e.x, e.y+3, e.z, 40); grande(e.quien==='yo' ? '🎤 ¡A CANTAR!' : '🎤 ¡CANTA, FERNANDO!', '#ff9ed6', 130); if (e.primera) aviso('¡Qué concierto! +25 🪙'); burbuja('🎶 Pichunguito… 🎶', 'Fernando'); redEvento('canta', {x:e.x, y:e.y, z:e.z}); break;
      case 'cantoFin': cancionParar(); if (e.completo) confeti(e.x||MICROFONO.x, altura(MICROFONO.x, MICROFONO.z)+3, e.z||MICROFONO.z, 30); break;
      case 'rugidoLeon': sfx.rugido(); sacudida = 6; burbuja('¡ROAAAR!', 'León Leo'); break;
      case 'gallinaVuela': sfx.gallina(); for (let i=0;i<8;i++) particula(e.x, e.y+0.6, e.z, '#ffffff', (azar()-0.5)*4, 2+azar()*3, (azar()-0.5)*4, 50, 0.16, {alfa:0.9, grav:3}); grande('¡COCOROCÓ! 🐔', '#fff', 50); break;
      case 'propVuela': sfx.golpe(); chispas(e.x, e.y+0.5, e.z, '#d8c8a0', 8, 4); break;
      case 'gallinaAterriza': break;
      case 'sandiaRota': sfx.sandia(); for (let i=0;i<14;i++) particula(e.x, e.y+0.4, e.z, i%3 ? '#e63946' : '#43a047', (azar()-0.5)*6, 2+azar()*5, (azar()-0.5)*6, 45, 0.22, {grav:10, alfa:0.9}); grande('¡SANDÍA! 🍉 +3 🪙', '#ff6ec0', 60); break;
      case 'visitaLlega': sfx.ovni(); grande('¡LLEGAN EXTRATERRESTRES! 🛸', '#9dffb0', 120); break;
      case 'visitaBaja': sfx.aterriza(); for (let i=0;i<10;i++) particula(e.x + (azar()-0.5)*4, altura(e.x, e.z)+0.3, e.z + (azar()-0.5)*4, '#9dffb0', (azar()-0.5)*3, 1+azar()*2, (azar()-0.5)*3, 40, 0.3, {alfa:0.6, crece:2}); aviso('Salúdalos: dan 20 monedas 👽🪙'); break;
      case 'visitaSeVa': sfx.despegue(); grande('Los extraterrestres se van 🛸👋', '#9dffb0', 90); break;
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
  /* Fernando a pie (y gorila si comió banana; gordito según las hamburguesas) */
  if (ferGorila !== (P.gorilaT > 0)) ponerPersonaje(P.pj);
  { const k = gorduraDe(P.gordura, P.flacoT > 0); fer.scale.set(fer.esc*k.kx, fer.esc*k.ky, fer.esc*k.kx); }
  fer.visible = !P.veh && !ferDentro;
  fer.position.set(J.x, J.y, J.z); fer.rotation.y = J.ang;
  const apretado = P.ganas && !J.nadando;
  animarModelo(fer, J.mov*(apretado ? 1.8 : 1), J.fase*(apretado ? 1.6 : 1), !J.suelo && !J.nadando, J.nadando);
  fer.rotation.x = J.nadando ? (fer.tipo==='persona' ? 1.2 : 0.3) : 0;
  if (P.columpio){ animarModelo(fer, 0, 0, false, false, true); fer.rotation.x = -P.columpio.ang; }
  else if (P.sentado){ animarModelo(fer, 0, 0, false, false, true); }
  else if (P.durmiendo){ animarModelo(fer, 0, 0, false, false, false); fer.position.y = J.y + 0.95; fer.rotation.x = -Math.PI/2; fer.partes.bI.rotation.x = 0; fer.partes.bD.rotation.x = 0; }
  else if (P.trepando){ const s = tick*DT; fer.partes.bI.rotation.x = -2.2 + Math.sin(s*8)*0.4; fer.partes.bD.rotation.x = -2.2 - Math.sin(s*8)*0.4; fer.partes.pI.rotation.x = -0.6 - Math.sin(s*8)*0.4; fer.partes.pD.rotation.x = -0.6 + Math.sin(s*8)*0.4; }
  if (fer.tipo==='persona' && !P.columpio && !P.sentado && !P.durmiendo && !P.trepando){
    if (P.canto && P.canto.quien==='yo'){ const s = tick*DT; fer.partes.bD.rotation.x = -1.7 + Math.sin(s*6)*0.15; fer.partes.bI.rotation.x = -0.5 + Math.sin(s*4)*0.5; fer.partes.bI.rotation.z = -0.5; fer.partes.cuerpo.position.y = Math.abs(Math.sin(s*7))*0.08; fer.rotation.z = Math.sin(s*1.5)*0.06; }
    else if (apretado){ fer.partes.pI.rotation.z = 0.25; fer.partes.pD.rotation.z = -0.25; fer.partes.bI.rotation.x = -1.2; fer.partes.bD.rotation.x = -1.2; fer.rotation.z = Math.sin(J.fase*1.6)*0.08; }
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
    ferSentado.position.set(R.asiento.x, R.asiento.y, R.asiento.z); { const k = gorduraDe(P.gordura, P.flacoT > 0); ferSentado.scale.set(ferSentado.esc*R.asiento.esc*k.kx, ferSentado.esc*R.asiento.esc*k.ky, ferSentado.esc*R.asiento.esc*k.kx); }
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
    tioJuan.visible = RED.pj !== 'tiojuan' && !P.casa && !P.zona;
    ondearCapa(tioJuan.partes.capa, t, 0.6 + Math.min(1, vel));
  }
  if (fer.capaMesh) ondearCapa(fer.capaMesh, t, 0.3 + Math.min(1, J.mov*0.12));
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
  sincronizarNuevos(t); sincronizarMundoNuevo(t);
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
  else if (id==='ovni'){ R.anillo.rotation.y += montado ? 0.09 : 0.015; R.luces.forEach((l, i)=>{ l.visible = Math.floor(t*(montado ? 8 : 2) + i) % 3 !== 0; }); R.cuerpo.position.y = aire ? Math.sin(t*2.2)*0.18 : 0; R.cupula.position.y = 1.4 + (aire ? Math.sin(t*2.2)*0.18 : 0); R.haz.visible = montado && aire; if (R.haz.visible) R.haz.scale.set(1 + Math.sin(t*5)*0.08, 1, 1 + Math.cos(t*5)*0.08); }
  else if (id==='nave'){ if (R.fuego){ R.fuego.visible = montado && aire; R.fuego.scale.set(1 + Math.sin(t*40)*0.15, 1 + Math.sin(t*33)*0.25, 1 + Math.cos(t*40)*0.15); } }
  else if (id==='tanque'){ if (R.retroceso > 0){ R.retroceso -= 0.06; R.canon.position.z = 0.4 - R.retroceso*0.6; } else R.canon.position.z = 0.4; }
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
  const cfg = v ? CAM_CFG[v.id] : (P.casa ? CAM_CFG.casa : J.nadando ? CAM_CFG.nadar : CAM_CFG.pie);
  let dist = cfg.d, alt = cfg.h;
  if (v && v.id==='avion' && v.aire){ alt = cfg.h - v.cabeceo*7; dist = cfg.d + Math.abs(v.cabeceo)*3; }
  if (v) dist += Math.abs(v.vel)*0.08;
  const fx = Math.sin(camYaw), fz = Math.cos(camYaw);
  let ox = J.x - fx*dist, oy = J.y + alt, oz = J.z - fz*dist;
  if (P.casa){ const I = P.casa; ox = clamp(ox, I.x - I.hw + 0.5, I.x + I.hw - 0.5); oz = clamp(oz, I.z - I.hd + 0.5, I.z + I.hd - 0.5); oy = Math.min(oy, I.y + I.alto - 0.5); }
  else if (P.zona){ if (oy < P.zona.y + 1.2) oy = P.zona.y + 1.2; }
  else { const g = altura(ox, oz) + 1.3; if (oy < g) oy = g; }
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
  /* si una loma queda entre la cámara y el personaje (la bajada de la montaña nevada), la cámara se acerca hasta verlo */
  if (!P.casa && !P.zona && !P.escena){
    const ty = J.y + 1.2;
    for (let k = 0.8; k >= 0.15; k -= 0.1){
      const px = ox + (J.x-ox)*k, pz = oz + (J.z-oz)*k, ly = oy + (ty-oy)*k;
      if (altura(px, pz) + 0.8 > ly){ const k2 = Math.min(0.9, k + 0.1), nx = ox + (J.x-ox)*k2, nz = oz + (J.z-oz)*k2; oy = Math.max(oy + (ty-oy)*k2, altura(nx, nz) + 1.3); ox = nx; oz = nz; break; }
    }
  }
  tmpV.set(ox, oy, oz);
  camPos.lerp(tmpV, v ? 0.12 : 0.1);
  /* la cámara va rezagada: en una bajada empinada (la montaña nevada) no debe hundirse en el suelo */
  if (!P.casa && !P.zona){ let gc = altura(camPos.x, camPos.z); for (const k of [0.35, 0.65]) gc = Math.max(gc, altura(camPos.x + (J.x-camPos.x)*k, camPos.z + (J.z-camPos.z)*k) - 1.5); gc += 1.3; if (camPos.y < gc) camPos.y = gc; }
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
  const nf = P ? nocheF(P) : (NOCHE ? 1 : 0), zona = !!(P && P.zona);
  const bajo = !zona && !(P && P.casa) && camera.position.y < NIVEL_MAR + ola(camera.position.x, camera.position.z, tick*DT);
  bajoF += ((bajo ? 1 : 0) - bajoF)*0.15;
  const esp = zona ? 1 : clamp((camera.position.y - 220)/260, 0, 1);            /* de 220 a 480 m el cielo se vuelve espacio */
  const nieblaAire = tmpColorA.copy(NIEBLA_DIA.aire).lerp(NIEBLA_NOCHE.aire, nf), nieblaAgua = tmpColorB.copy(NIEBLA_DIA.agua).lerp(NIEBLA_NOCHE.agua, nf);
  scene.fog.color.copy(nieblaAire).lerp(nieblaAgua, bajoF);
  scene.fog.density = lerp(0.0014, 0.011, bajoF)*(1-esp)*(zona ? 0.25 : 1) + (zona ? 0.0004 : 0);
  cupula.material.uniforms.arriba.value.copy(CIELO_DIA.arriba).lerp(CIELO_NOCHE.arriba, nf).lerp(tmpColorA.copy(CIELO_DIA.arribaAgua).lerp(CIELO_NOCHE.arribaAgua, nf), bajoF).lerp(new THREE.Color(0x02030a), esp);
  cupula.material.uniforms.horizonte.value.copy(CIELO_DIA.horizonte).lerp(CIELO_NOCHE.horizonte, nf).lerp(tmpColorA.copy(CIELO_DIA.horizonteAgua).lerp(CIELO_NOCHE.horizonteAgua, nf), bajoF).lerp(new THREE.Color(0x0a1030), esp);
  estrellasCielo.material.opacity = Math.max(esp, nf*0.9); estrellasCielo.position.copy(camera.position);
  luna.tela.geometry.attributes.position.needsUpdate = false;
  agua.visible = !zona;
  agua.material.uniforms.bajo.value = bajo ? 1 : 0;
  agua.material.uniforms.t.value = tick*DT;
  sol.visible = bajoF < 0.5 && !zona;
  rayoLuz *= 0.82; flashT = Math.max(0, flashT - 1);
  luzSol.color.copy(lin(0xfff1dc)).lerp(lin(0x9fb8ff), nf);
  luzSol.intensity = lerp(lerp(1.05, 0.5, bajoF), lerp(0.32, 0.22, bajoF), nf) + rayoLuz*0.9 + (zona ? 0.2 : 0);
  luzCielo.color.copy(lin(0xcfe9ff)).lerp(lin(0x2a7ab0), bajoF).lerp(tmpColorA.copy(lin(0x2a3a6a)).lerp(lin(0x0b3a5a), bajoF), nf);
  luzCielo.groundColor.copy(lin(0x4f8a3a)).lerp(lin(0x101a2a), nf);
  luzCielo.intensity = lerp(lerp(0.6, 0.45, bajoF), lerp(0.3, 0.28, bajoF), nf) + rayoLuz*0.5;
  luzAmb.intensity = lerp(lerp(0.1, 0.3, bajoF), lerp(0.16, 0.26, bajoF), nf) + rayoLuz*1.2 + (zona ? 0.12 : 0);
  if (NOCHE) sol.position.set(camera.position.x - 500, camera.position.y + 700, camera.position.z - 300);
  else { const a = ((P ? P.hora : 0.32) - 0.25)*6.283; sol.position.set(camera.position.x + Math.cos(a)*700, camera.position.y + Math.sin(a)*600 + 60, camera.position.z + 300); sol.material.opacity = Math.max(0, 1 - nf*1.3); }
  cupula.position.copy(camera.position);
  enfocarLuz(P.J.x, P.J.y, P.J.z);
}
const tmpColorA = new THREE.Color(), tmpColorB = new THREE.Color();

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
  if (estado==='juego' || estado==='pausa' || estado==='amigos' || estado==='tienda'){ redPaso(); vozPaso(); }
  sincronizar(); sincronizarRemotos();
  pasoNubes(); pasoGaviotas(); pasoPeces(); pasoAlgas(); pasoParticulas();
  if (estado==='menu' || (estado==='personaje' && pjOrigen==='menu')) camaraMenu(); else camaraJuego();
  if (RED.estado==='conectado' && (estado==='menu' || (estado==='personaje' && pjOrigen==='menu'))) estado = 'juego';
  ambiente();
  if (cortina > 0) cortina--;
  if (mensajeGrande && --mensajeGrande.t <= 0) mensajeGrande = null;
  for (let i=burbujas.length-1;i>=0;i--) if (--burbujas[i].t <= 0) burbujas.splice(i,1);
  if (avisoT > 0) avisoT--;
  if (MANDO.avisoT > 0) MANDO.avisoT--;
  const tema = estado==='menu' || estado==='personaje' || estado==='tienda' ? TEMA_MENU : (bajoF > 0.5 ? TEMA_MAR : (P.veh && (P.veh.id==='avion' || P.veh.id==='heli' || P.veh.id==='nave' || P.veh.id==='ovni') && P.veh.aire ? TEMA_CIELO : TEMA_ISLA));
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
  for (const b of BANOS){ const p = aM(b.x, b.z); ctx.fillStyle = P.prog.banos.includes(b.id) ? '#7dffa0' : '#8fd3ff'; ctx.fillRect(p.x-3, p.y-3, 6, 6); }
  for (const v of P.vehiculos){ if (P.veh===v) continue; const p = aM(v.x, v.z); ctx.font = '12px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(v.emoji, p.x, p.y); }
  if (obj.x !== null && obj.x !== undefined){ const p = aM(obj.x, obj.z); ctx.strokeStyle = '#ffe36e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 4 + Math.sin(tick*0.15)*2, 0, Math.PI*2); ctx.stroke(); }
  if (NOCHE){ const q = aM(CORO.x, CORO.z); ctx.font = '13px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('🐐', q.x, q.y); }
  { ctx.font = '13px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; for (const [e, o] of [['🏰', CASTILLO], ['🍌', ISLA_BANANA], ['🦕', VALLE_DINOS], ['🐘', ISLA_ELEFANTES], ['🧛', ISLA_VAMPIROS], ['🎪', ISLA_CIRCO], ['🎤', ISLA_CONCIERTO], ['🎅', MONTANA]]){ const q = aM(o.x, o.z); ctx.fillText(e, q.x, q.y); } }
  for (const [, r] of RED.remotos){ const q = aM(r.act.x, r.act.z); ctx.fillStyle = '#4fc3f7'; ctx.beginPath(); ctx.arc(q.x, q.y, 3.5, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke(); }
  const p = aM(J.x, J.z);
  ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + Math.sin(J.ang)*11, p.y + Math.cos(J.ang)*11); ctx.stroke();
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
  texto(pjOrigen==='juego' ? 'La partida sigue igual: solo cambia quién juega 🗣️' : 'Cada personaje habla con su propia voz 🗣️', W/2, 78, 15, '#bcd6ff');
  z.pjs.forEach((zp, i)=>{ const pj = PERSONAJES_RED[i], es = i===selPj;
    cristal(zp.x, zp.y, zp.w, zp.h, 12, es ? 0.85 : 0.4);
    if (es){ ctx.strokeStyle = '#ffe36e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(zp.x, zp.y, zp.w, zp.h, 12); ctx.stroke(); }
    texto(pj.emoji, zp.x+zp.w/2, zp.y+22, 22, '#fff'); textoAjustado(pj.nombre, zp.x+zp.w/2, zp.y+45, 12, zp.w-8, es ? '#ffe36e' : '#fff'); });
  const fh = 56, fy = Math.min(z.pjs[z.pjs.length-1].y + 58 + 14, z.jugar.y - fh - 12);
  if (fy > z.pjs[z.pjs.length-1].y + 40){ cristal(W/2-260, fy, 520, fh, 14, 0.5); textoAjustado(sel.emoji+' '+sel.nombre+' dice: «'+fraseDe(sel.id, 'inicio')+'»', W/2, fy+fh/2, 16, 500, '#fff'); }
  boton(z.jugar.x, z.jugar.y, z.jugar.w, z.jugar.h, (pjOrigen==='juego' ? '▶ SEGUIR CON ' : '▶ JUGAR CON ')+sel.nombre.toUpperCase(), '#3aa040', '#1e6a24', 20, Math.floor(tick/30)%2===0);
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
    textoAjustado(hayRed() ? 'Gratis, sin cuentas, hasta '+MAX_JUGADORES+' jugadores. Todos los aparatos necesitan internet.' : '⚠️ No se cargó la parte de red: revisa la conexión y recarga.', W/2, 292, 13, cw-30, hayRed() ? '#7dffa0' : '#ff9e9e'); }
    boton(z.crear.x, z.crear.y, z.crear.w, z.crear.h, '🏝️ CREAR UNA SALA', '#3aa040', '#1e6a24', 20, true);
    boton(z.unirme.x, z.unirme.y, z.unirme.w, z.unirme.h, '🔑 ENTRAR CON CÓDIGO', '#2a8ad0', '#1a4a90', 20);
    return;
  }
  if (RED.estado==='creando' || RED.estado==='uniendo'){
    const puntos = '.'.repeat(1 + Math.floor(tick/20)%3);
    titulo(RED.estado==='creando' ? 'Creando la sala'+puntos : 'Entrando a la sala '+RED.sala+puntos, W/2, H/2, 34, '#fff6a0', '#ffb000');
    texto(RED.estado==='uniendo' && RED.aviso_ ? RED.aviso_ : 'Esto tarda unos segundos', W/2, H/2+40, 15, '#bcd6ff');
    { const d = redDiagnostico(); if (d) texto(d + ' · v44.2', W/2, H/2+66, 12, 'rgba(255,255,255,0.55)'); }
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
  { const d = redDiagnostico(); if (d) texto(d + ' · v44.2', W/2, 398, 11, 'rgba(255,255,255,0.5)'); }
  boton(W-190, H-64, 176, 46, '🚪 SALIR DE LA SALA', '#8a3a30', '#5a1a10', 13);
  boton(14, H-64, 190, 46, VOZ.silencio ? '🔇 AMIGOS EN SILENCIO' : '🔊 OÍR A LOS AMIGOS', VOZ.silencio ? '#8a3a30' : '#3aa040', VOZ.silencio ? '#5a1a10' : '#1e6a24', 13);
}
function dibujarHUD(){
  const J = P.J;
  vineta(0.22);
  /* arriba a la izquierda: estrellas, hamburguesas, puntos y las ganas de popo */
  cristal(12, 10, 300, 60, 14, 0.5);
  textoBorde('⭐ '+P.estrellas.length+'/'+MISIONES.length, 26, 30, 21, '#ffe36e', 'left');
  textoBorde('🍔 '+P.hamburguesas, 128, 30, 21, '#fff', 'left');
  { const k = tick - monedaT < 14 ? 1 + (14 - (tick - monedaT))/14*0.35 : 1; textoBorde('🪙 '+P.monedas, 210, 30, 21*k, '#ffe36e', 'left'); }
  texto(P.puntos.toLocaleString('es')+' puntos'+(NOCHE ? '' : ' · '+horaTexto(P)), 26, 56, 14, '#bcd6ff', 'left');
  const px = 12, py = 78, pw = 222, ph = 22;
  cristal(px, py, pw, ph, 11, 0.5);
  ctx.fillStyle = P.ganas ? (Math.floor(tick/10)%2 ? '#ff9040' : '#c05a10') : '#8a5a2a';
  ctx.beginPath(); ctx.roundRect(px+30, py+5, (pw-38)*P.popo, ph-10, 6); ctx.fill();
  texto('💩', px+16, py+ph/2+1, 15, '#fff');
  if (P.ganas) textoBorde('¡AL BAÑO!', px+pw/2+14, py+ph/2+1, 14, '#fff');
  /* el mapita y el objetivo, arriba a la derecha */
  const RM = 88, MY = 104;
  dibujarMapa(W-RM-14, MY, RM);
  const o = objetivo(P);
  const ancho = Math.min(320, W*0.38), oy = MY+RM+18;
  cristal(W-ancho-12, oy, ancho, 48, 12, 0.5);
  textoAjustado(o.texto, W-ancho+30, oy+24, 16, ancho-108, '#fff', 'left');
  if (o.x !== null && o.x !== undefined){
    const ang = envolver(Math.atan2(o.x-J.x, o.z-J.z) - camYaw);
    flecha(W-ancho+8, oy+24, -ang, 10, '#ffe36e');
    const d = Math.hypot(o.x-J.x, o.z-J.z);
    texto(d > 999 ? (d/1000).toFixed(1)+' km' : Math.round(d)+' m', W-24, oy+24, 13, '#bcd6ff', 'right');
  }
  if (redActiva()) for (const z of zonasIrCon()){ boton(z.x, z.y, z.w, z.h, '🚀 IR CON '+z.nombre.toUpperCase()+' · '+(z.d > 999 ? (z.d/1000).toFixed(1)+' km' : Math.round(z.d)+' m'), '#2a8ad0', '#1a4a90', 13, z.d > 60 && Math.floor(tick/30)%2===0); }
  /* avisos y frases */
  if (P.cercaPuerta && !P.veh && !P.escena) textoBorde((tactil ? 'A' : 'ESPACIO')+' = '+(P.casa ? 'SALIR 🚪' : (P.cercaPuerta.castillo ? 'ENTRAR AL CASTILLO 🏰' : 'ENTRAR 🏠')), W/2, H-96, 22, '#fff', 'center', true);
  else if (P.cercaVeh && !P.veh && !P.escena) textoBorde((tactil ? 'A' : 'ESPACIO')+' = MONTAR '+P.cercaVeh.emoji, W/2, H-96, 22, '#fff', 'center', true);
  else if (P.sentado) textoBorde((tactil ? 'A' : 'ESPACIO')+' = LEVANTARSE', W/2, H-96, 20, '#fff', 'center', true);
  else if (P.columpio) textoBorde((tactil ? 'A' : 'ESPACIO')+' = ¡SALTAR! 🎠  (palanca arriba: impulso)', W/2, H-96, 20, '#fff', 'center', true);
  else if (P.casa && P.cercaMueble && !P.durmiendo) textoBorde((tactil ? 'A' : 'ESPACIO')+' = '+usoDe(P.cercaMueble), W/2, H-96, 22, '#fff', 'center', true);
  else if (!P.veh && !P.casa && !P.zona && !P.escena){ const L = escaleraCerca(J); if (L) textoBorde('⬆ = TREPAR AL TECHO 🪜', W/2, H-96, 20, '#fff', 'center', true); else if (COLUMPIOS.some(c=>Math.hypot(J.x-c.x, J.z-c.z) < 1.4 && Math.abs(J.y-c.py) < 2)) textoBorde((tactil ? 'A' : 'ESPACIO')+' = COLUMPIARSE 🎠', W/2, H-96, 20, '#fff', 'center', true); }
  if (P.veh){
    const rapidez = (P.veh.id==='nave' || P.veh.id==='heli' || P.veh.id==='ovni' || P.veh.id==='ptero') ? Math.hypot(P.veh.vel, P.veh.vy||0) : Math.abs(P.veh.vel);
    textoBorde(Math.round(rapidez*3.6)+' km/h', W/2, H-30, 18, '#fff');
    if ((P.veh.id==='avion' || P.veh.id==='heli' || P.veh.id==='nave' || P.veh.id==='ovni' || P.veh.id==='ptero') && P.veh.aire) textoBorde(Math.round(P.veh.y)+' m de altura', W/2, H-52, 14, '#bfe9ff');
    if (P.veh.id==='sub') textoBorde(Math.round(-P.veh.y)+' m de profundidad', W/2, H-52, 14, '#bfe9ff');
    if (P.veh.id==='avion' && P.veh.aire && P.veh.y - Math.max(altura(P.veh.x, P.veh.z), NIVEL_MAR) > 14) textoBorde((tactil ? '🚪' : 'E')+' = saltar en paracaídas 🪂', W/2, H-74, 15, '#bfe9ff');
    else if (puedeBajar(P)) texto((tactil ? '🚪' : 'E')+' = bajarse', W/2, H-72, 13, '#bcd6ff');
  }
  let yAviso = 92;
  if (P.zona && !redActiva()) pastilla((P.zona.id==='luna' ? (NOCHE ? '🔴 ' : '🌙 ') : P.zona.id==='saturno' ? '🪐 ' : '🟠 ')+P.zona.nombre+' · gravedad ×'+P.zona.grav, W/2, 25, 14, '#fff6a0', 0.55);
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
  const pw = Math.min(1040, W-24), x0 = W/2-pw/2, y0 = 70, filas = Math.ceil(MISIONES.length/2), cw = pw/2, fh = MISIONES.length > 14 ? 23 : 25;
  cristal(x0, y0-6, pw, filas*fh+16, 16, 0.5);
  MISIONES.forEach((m, i)=>{
    const ok = P.estrellas.includes(m.id), col = Math.floor(i/filas), fila = i%filas, cx = x0 + col*cw, cy = y0+10+fila*fh;
    let extra = '', titulo_ = m.titulo;
    if (m.id==='banos') extra = P.prog.banos.length+'/'+BANOS.length; else if (m.id==='carro') extra = P.prog.banderas.length+'/'+BANDERAS.length;
    else if (m.id==='avion') extra = P.prog.aros.length+'/'+AROS.length; else if (m.id==='heli') extra = P.prog.helipuertos.length+'/'+HELIPUERTOS.length;
    else if (m.id==='motoagua') extra = P.prog.boyas.length+'/'+BOYAS.length; else if (m.id==='dino') extra = P.prog.huevos.length+'/'+HUEVOS.length;
    else if (m.id==='maracaibo') extra = P.arepas+'/5'; else if (m.id==='coro') extra = P.prog.chivos.length+'/'+CHIVOS.length; else if (m.id==='ptero') extra = P.prog.arosNoche.length+'/'+AROS_NOCHE.length; else if (m.id==='catatumbo') extra = P.prog.rayos+'/5';
    else if (m.id==='rocas') extra = P.prog.rocas.length+'/6'; else if (m.id==='saturno') extra = P.prog.saturnianos.length+'/4'; else if (m.id==='jupiter') extra = P.prog.cristales.length+'/5';
    else if (m.id==='familia'){ extra = P.prog.familia.length+'/'+SALUDABLES.length; const faltan = FAMILIA.filter(f=>!f.bebe && !P.saludos[f.id]).map(f=>f.nombre); if (!ok && faltan.length) titulo_ = 'Falta saludar a: '+(faltan.length > 4 ? faltan.slice(0,4).join(', ')+' y '+(faltan.length-4)+' más' : faltan.join(', ')); }
    textoAjustado((ok ? '⭐ ' : '☆ ')+m.emoji+' '+titulo_, cx+14, cy, 17, cw-78, ok ? '#7dffa0' : (m.id==='familia' && titulo_ !== m.titulo ? '#ffe36e' : '#fff'), 'left');
    if (extra && !ok) texto(extra, cx+cw-12, cy, 16, '#bcd6ff', 'right');
  });
  const zs = zonasPausa();
  const etiquetas = ['▶ SEGUIR JUGANDO', redActiva() ? '👥 SALA '+RED.sala+' · '+(RED.remotos.size+1)+' EN LA ISLA' : '👥 JUGAR CON AMIGOS', musicaOn ? '🎵 MÚSICA: SÍ' : '🔇 MÚSICA: NO', '🗑️ EMPEZAR DE CERO', NOCHE ? '☀️ IR AL MAPA 1: LA ISLA DE DÍA' : '🌙 IR AL MAPA 2: MARACAIBO DE NOCHE', '◀ FERNANDO BROS', (PERSONAJES_RED.find(p=>p.id===RED.pj)||PERSONAJES_RED[0]).emoji+' CAMBIAR DE PERSONAJE', '🛍️ TIENDA DE DISFRACES · 🪙 '+P.monedas];
  const colores = [['#3aa040','#1e6a24'],['#2a8ad0','#1a4a90'],['#4a6ad0','#2a3a90'],['#c05a10','#803a08'],['#6a3ad0','#3a1a90'],['#4a6ad0','#2a3a90'],['#d07a20','#8a4a10'],['#c8a020','#806010']];
  /* el orden en pantalla: seguir, cambiar de personaje, amigos, música, de cero, mapa, volver */
  zs.forEach((z, f)=>{ const i = ORDEN_PAUSA[f]; boton(z.x, z.y, z.w, z.h, etiquetas[i], colores[i][0], colores[i][1], 15, selPausa===i); });
  texto(P.puntos.toLocaleString('es')+' puntos · '+P.hamburguesas+' hamburguesas comidas', W/2, H-9, 12, '#bcd6ff');
}
/* la tienda de disfraces: se compra con monedas, se pone y se quita con un toque */
let selTienda = 0;
const zonaTienda = ()=>{
  const z = {volver: zonaAtras(), items: []};
  const n = ITEMS_TIENDA.length, ncol = 6, w = Math.min(150, (W-40)/ncol - 6), h = 96, x0 = W/2 - (ncol*(w+6)-6)/2, y0 = 92;
  for (let i=0;i<n;i++) z.items.push({x: x0 + (i%ncol)*(w+6), y: y0 + Math.floor(i/ncol)*(h+6), w, h});
  z.ncol = ncol; return z;
};
function abrirTienda(){ estado = 'tienda'; selTienda = 0; sfx.toque(); }
function elegirItem(i){
  const it = ITEMS_TIENDA[i]; if (!it) return;
  const r = comprar(P, ROPA, it.id); guardarRopa();
  if (r==='faltan'){ sfx.no(); aviso('Te faltan '+(it.precio - P.monedas)+' monedas 🪙: se ganan explorando, saludando y con las misiones'); }
  else { aplicarRopa(); guardar(); atenderEventos(); }
}
function dibujarTienda(){
  ctx.fillStyle = 'rgba(5,10,30,0.86)'; ctx.fillRect(0,0,W,H);
  tituloAjustado('LA TIENDA DE DISFRACES', W/2, 40, 38, W-420, '#fff6a0', '#ffb000');
  botonAtras('◀ VOLVER');
  pastilla('🪙 '+P.monedas+' monedas', W-110, 32, 18, '#ffe36e', 0.6);
  const z = zonaTienda();
  z.items.forEach((zp, i)=>{
    const it = ITEMS_TIENDA[i], es = i===selTienda, tiene = ROPA.comprados.includes(it.id), puesto = ROPA[it.tipo]===it.id;
    cristal(zp.x, zp.y, zp.w, zp.h, 12, es ? 0.85 : 0.4);
    if (puesto){ ctx.strokeStyle = '#7dffa0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(zp.x, zp.y, zp.w, zp.h, 12); ctx.stroke(); }
    if (es){ ctx.strokeStyle = '#ffe36e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(zp.x-2, zp.y-2, zp.w+4, zp.h+4, 13); ctx.stroke(); }
    texto(it.emoji, zp.x+zp.w/2, zp.y+26, 30, '#fff');
    textoAjustado(it.nombre, zp.x+zp.w/2, zp.y+56, 13, zp.w-8, es ? '#ffe36e' : '#fff');
    texto(puesto ? '✓ PUESTO' : tiene ? 'LO TIENES' : '🪙 '+it.precio, zp.x+zp.w/2, zp.y+78, 13, puesto ? '#7dffa0' : tiene ? '#bcd6ff' : (P.monedas >= it.precio ? '#ffe36e' : '#ff9a9a'));
  });
  const it = ITEMS_TIENDA[selTienda];
  if (it){ const tiene = ROPA.comprados.includes(it.id), puesto = ROPA[it.tipo]===it.id;
    const txt = puesto ? 'Toca otra vez para quitarte '+it.nombre.toLowerCase() : tiene ? 'Toca para ponerte '+it.nombre.toLowerCase() : P.monedas >= it.precio ? 'Toca para comprar '+it.nombre.toLowerCase()+' por '+it.precio+' monedas' : 'Te faltan '+(it.precio - P.monedas)+' monedas para '+it.nombre.toLowerCase();
    cristal(W/2-300, H-100, 600, 44, 14, 0.5); textoAjustado(txt, W/2, H-78, 16, 580, '#fff'); }
  texto('Los gorros y las capas se ven en la sala con amigos · las monedas se ganan explorando, saludando bichos y con las misiones', W/2, H-30, 12, 'rgba(255,255,255,0.7)');
  if (!tactil) texto('Flechas para elegir · ENTER para comprar o ponerse · ESC para volver', W/2, H-10, 12, 'rgba(255,255,255,0.6)');
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
  else if (estado==='tienda') dibujarTienda();
  if (CONF.activa) dibujarConfirmacion();
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
window.AV = { get W(){ return W; }, get H(){ return H; }, get estado(){ return estado; }, set estado(v){ estado = v; }, get camYaw(){ return camYaw; }, set camYaw(v){ camYaw = v; }, get P(){ return P; }, camera, scene, renderer, tecla: procesarTecla, paso: actualizar, empezar, set entrada(v){ entradaForzada = v; }, RED, VOZ, redRecibir, empaquetar: ()=>empaquetarEstado(P, RED.pj, nombreLocal(), ROPA), ponerPersonaje, get particulas(){ return particulas.length; }, get CAL(){ return CAL; }, get vozLog(){ return vozLog; }, get burbujas(){ return burbujas; }, HAMBURGUESAS, MAPA, CORO, OVNI, AROS_NOCHE, PERSONAJES_RED, zonaPersonaje, PUENTE, MARACAIBO, LUNA, HELIPUERTOS, BOYAS, HUEVOS, AREPAS, VEHICULOS_DEF, FAMILIA, RED_CONFIG, RED_RELES, redCrear, redUnirse, redSalir, CONF, CASTILLO, INTERIORES, INTERIOR_CASTILLO, ISLA_BANANA, BANANAS, VALLE_DINOS, DINOS, VEREDA, ZONAS, SATURNO, JUPITER, MONTANA, ISLA_ELEFANTES, ISLA_VAMPIROS, ISLA_CIRCO, ISLA_CONCIERTO, MICROFONO, CANTANTE, OLAS, CANCHA, COLUMPIOS, ESCALERAS, USOS, SANTA, INTERIOR_CIRCO, CIRCO_DEF, MONEDAS, ITEMS_TIENDA, get ROPA(){ return ROPA; }, PROPS_DEF, altura, get tick(){ return tick; } };
requestAnimationFrame(bucle);
})();
