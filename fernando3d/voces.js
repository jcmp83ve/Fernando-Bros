'use strict';
/* ============================================================
   FERNANDO 3D — las VOCES GRABADAS
   Son las mismas grabaciones de la Aventura 3D (hechas con
   Higgsfield): Fernando, Tío Juan, Santi, Abu, Penny, Sheldon,
   Lucca, Salomón y Cucú. Si una frase no tiene grabación, la
   dice la voz del navegador con el tono de cada personaje.
   ============================================================ */
(function(raiz){
const B = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Fiy4A0M4MKixWlklbu10QS1hAQ/';
const V = {
 "fernando": {
  "¡Fernando Bros! ¡Vamos Penny y Sheldon!": "hf_20260723_022831_be4594e7-9934-45df-82f7-ecbd7684a1b4.mp3",
  "¡Soy el pichunguito de tío Juan!": "hf_20260723_022843_1d4b30e7-9e12-45eb-b765-1cd4192a71f1.mp3",
  "¡Fuego pichunguito!": "hf_20260723_022853_3a12f5a7-1254-4828-a79d-ec513d359e17.mp3",
  "¡Gracias tío Juan!": "hf_20260723_022915_731cc734-d397-4780-b376-0ae4832f2098.mp3",
  "¡Qué rica hamburguesa!": "hf_20260723_022926_3851354b-3562-48ad-85a9-600895ad4076.mp3",
  "Te amo Santi, mi hermanito": "hf_20260723_022939_b650e98e-e039-4c68-8517-4bed26cf3136.mp3",
  "Hola Cucú, acompáñame": "hf_20260723_022951_60e42569-0204-4c13-a440-1b3fbb2e8323.mp3",
  "Te amo Abu": "hf_20260723_023000_8b6c7894-da76-44ce-8f1f-01e44d1efb18.mp3",
  "Te amo tío Juan, yo soy tu pichunguito": "hf_20260723_023041_e2b52034-c05e-46b6-bd10-dbb2442db2b2.mp3",
  "¡Luca! ¡Mi amigo pichunguito!": "hf_20260723_023116_bf6a1862-d546-4eca-9ac2-4a9d22830f77.mp3",
  "¡Salomón! ¡Juega conmigo, pichunguito!": "hf_20260723_023126_b6845ef0-32b0-4f99-9e7c-7783dc4c50b2.mp3",
  "¡Toma, pichungazo!": "hf_20260723_023207_6b418548-3e75-4413-b546-9e8adbeba2a7.mp3",
  "¡Pichunguito al ataque!": "hf_20260723_023217_8ad6f4d2-453d-4b77-8a92-6a2ec3f92d41.mp3",
  "¡Gané! ¡Soy el pichunguito campeón!": "hf_20260724_033611_24c906e1-4f49-4d9f-8dad-bef017754598.mp3",
  "¡Qué divertido! ¡Otra vez, otra vez!": "hf_20260724_033620_de835742-0dc8-4820-a07a-dc5fa37afe22.mp3",
  "¡A volar, pichunguitos!": "hf_20260725_162319_5f211291-4377-4290-8dba-6a44907caef6.mp3",
  "¡Tesoro! ¡Encontré el tesoro!": "hf_20260904_233610_bfa20432-1aed-46fa-a4c3-13572d4b5b07.mp3"
 },
 "tio": {
  "¡Tío Juan al rescate! ¡Toma una hamburguesa, pichunguito, corre!": "hf_20260723_022904_7e72ee2f-e753-4c38-9913-82375109fd07.mp3",
  "¡Muy bien, mi pichunguito! ¡Eres un campeón!": "hf_20260723_023053_920db23a-576a-4d54-b97d-03c5bc8741fa.mp3",
  "Eres mi pichunguito": "hf_20260724_033537_c3b9b915-0929-4fce-ad3c-620c24e39123.mp3",
  "¡Tío Juan al rescate!": "hf_20260905_210210_199f86a0-4f49-466b-982a-44bc1cf39451.mp3",
  "¡Arriba, arriba! ¡Tío Juan vuela!": "hf_20260905_210210_2ad5e405-7d4f-4270-9365-c64e41ad13b3.mp3",
  "¡Mmm, qué rica hamburguesa!": "hf_20260905_210210_90e97486-b6d4-4724-985d-10b0f5c3210f.mp3",
  "¡Hola, familia! ¡Un abrazo de tío Juan!": "hf_20260905_210238_218f5c52-99d2-42cc-b3a7-fdbf715e85be.mp3"
 },
 "lucca": {
  "¡Lucca al ataque!": "hf_20260906_002445_487e6cf8-6ddd-4ce4-9cda-c46d8789c254.mp3",
  "¡Estoy volando! ¡Mírame!": "hf_20260906_002445_daa4df69-ac78-4c67-9c55-78985d1e4aec.mp3",
  "¡Ñam! ¡Qué rica hamburguesa!": "hf_20260906_002445_edf6b901-3709-4614-bde8-358c322b069e.mp3",
  "¡Encontré el tesoro!": "hf_20260906_002518_5d15a4bf-1039-42ff-a0c6-5f2d124e372d.mp3",
  "¡Hola! ¡Soy Lucca, el amigo de Fernando!": "hf_20260906_002554_2a50befe-07c2-45f7-a0d2-5d98568248b6.mp3"
 },
 "salomon": {
  "¡Salomón en la casa!": "hf_20260906_002518_a0daae9f-c6d4-4f63-9ec6-3f53a5c883bf.mp3",
  "¡Volando con estilo!": "hf_20260906_002457_81b97a1e-c7ac-4738-b6b4-ff99b29381e6.mp3",
  "¡Esta hamburguesa está brutal!": "hf_20260906_002456_8869de81-bee9-47ad-a736-a5cca06f61fe.mp3",
  "¡El tesoro! ¡Somos ricos!": "hf_20260906_002554_4f0b108c-e4d9-489c-89fa-0cdd63b0ea9c.mp3",
  "¡Hola! ¡Salomón quiere jugar!": "hf_20260906_002618_8b70ab41-5972-42e2-8a76-87c5d7a19789.mp3"
 },
 "cucu": {
  "¡Cucú! ¡Aquí estoy!": "hf_20260905_210703_5f221ed9-5716-4822-936a-cc9c90391de5.mp3",
  "¡Estoy volando como un pajarito!": "hf_20260905_210421_337b764a-9edb-4ffd-a9d0-4d254769d80c.mp3",
  "¡Qué rica hamburguesa!": "hf_20260905_210420_568d18a0-1f06-4987-81a1-087849b62382.mp3",
  "¡Encontré el tesoro!": "hf_20260905_210606_29288783-0489-45a9-9832-dfabd061ebfb.mp3",
  "¡Hola! ¡Soy Cucú! ¿Jugamos?": "hf_20260905_210606_dd882164-fed1-4caa-9fe0-bfba75f44245.mp3"
 },
 "santi": {
  "¡Hola! ¡Soy Santi!": "hf_20260906_002642_518d7e64-8893-4b6e-aaa0-baa6467643bc.mp3",
  "¡A volar! ¡Uuuh!": "hf_20260906_002618_8e717b13-50ab-4515-82d0-2e6bbf1cf8db.mp3"
 },
 "abu": {
  "¡Hola, mi cielo! ¡Abu te quiere!": "hf_20260905_211102_f7b5fee2-a1b1-4a8f-b826-0fcdfe644dc0.mp3",
  "¡Abu está lista, mis niños!": "hf_20260905_210914_5e4b3335-b965-48ef-b932-4bd1226d01f7.mp3"
 },
 "penny": {
  "¡Guau, guau! ¡Soy Penny!": "hf_20260905_211835_5309a4b6-fc7c-45bd-85ba-c1049176791d.mp3",
  "¡Guau! ¡Penny al ataque!": "hf_20260905_212151_8f86856b-70e0-4ecf-aea9-b2e64425eb14.mp3",
  "¡Guau! ¡Un perrito volador!": "hf_20260905_211753_9d44db2a-24c7-464e-98a9-472e9880bcca.mp3"
 },
 "sheldon": {
  "¡Guau, guau! ¡Soy Sheldon!": "hf_20260905_212112_5ee66fdb-b946-4e7c-8ba1-43e6e48ba54e.mp3",
  "¡Guau! ¡Sheldon al ataque!": "hf_20260905_211835_ec4070eb-0629-4d71-b2fb-f72f629d493e.mp3",
  "¡Guau! ¡Sheldon vuela!": "hf_20260905_211835_8f7b85b5-5d43-4411-a9b8-35f068e670ab.mp3"
 }
};
for (const q in V) for (const t in V[q]) V[q][t] = B + V[q][t];
if (typeof module !== 'undefined' && module.exports) module.exports = V;
else raiz.F3D_VOCES = V;
})(typeof window !== 'undefined' ? window : this);
