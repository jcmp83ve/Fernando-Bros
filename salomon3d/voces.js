(function(){
'use strict';
/* Las voces grabadas (mp3): las de Salomón vienen de La Gran Aventura y las demás se hicieron
   con Higgsfield. Si una frase no tiene mp3, la dice la voz del navegador. */
const AUDIO_BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Fiy4A0M4MKixWlklbu10QS1hAQ/';
const CLIPS_PJ = {
  salomon: {
    '¡Salomón en la casa!': AUDIO_BASE+'hf_20260906_002518_a0daae9f-c6d4-4f63-9ec6-3f53a5c883bf.mp3',
    '¡Maracaibo, aquí estoy!': AUDIO_BASE+'hf_20260906_002518_8e3f89f9-5d22-4518-9efe-23e27679de79.mp3',
    '¡Mira para arriba, primo! ¡Es el relámpago del Catatumbo!': AUDIO_BASE+'hf_20260906_041837_3e6ca31f-ecfe-4f73-867f-bcc350973252.mp3',
    '¡Qué molleja! ¡Se me hizo un nudo en la garganta, primo!': AUDIO_BASE+'hf_20260906_002554_b9143e4a-6c02-43f2-be30-c3c4cca9a7b1.mp3',
    '¡El tesoro! ¡Somos ricos!': AUDIO_BASE+'hf_20260906_002554_4f0b108c-e4d9-489c-89fa-0cdd63b0ea9c.mp3',
    '¡Hola! ¡Salomón quiere jugar!': AUDIO_BASE+'hf_20260906_002618_8b70ab41-5972-42e2-8a76-87c5d7a19789.mp3',
    '¡Arepa de agüita de sapo, la mejor!': AUDIO_BASE+'hf_20260906_002518_00f00a30-c3af-4c7b-b809-31b58b36708d.mp3',
    '¡Esta hamburguesa está brutal!': AUDIO_BASE+'hf_20260906_002456_8869de81-bee9-47ad-a736-a5cca06f61fe.mp3',
    /* las nuevas, con la voz de Salomón clonada de «¡Hola! ¡Salomón quiere jugar!» */
    '¡Tranquila, Chinita! Primero recogemos las mandocas pa\' la feria, vos.': AUDIO_BASE+'hf_20260927_201342_2ad969bf-13ac-4cdc-8497-e9fa76163b5d.mp3',
    '¡Salí de ahí, Primo Verde, que te necesito pa\' saltar!': AUDIO_BASE+'hf_20260927_201314_341ebdfc-b5d8-4aec-858c-150dfa025df9.mp3',
    '¡Bienvenido al equipo, Mollejúo!': AUDIO_BASE+'hf_20260927_201315_ad1f05d0-eeea-4a4c-9259-b3acc2830cc6.mp3',
    '¡A la orden, Chinita!': AUDIO_BASE+'hf_20260927_201227_c9a6fe73-8063-4ddf-9751-a027015ae3a4.mp3',
    '¡Ay! ¡Eso dolió, primo!': AUDIO_BASE+'hf_20260927_201342_b0942b77-a9f3-4af1-b48d-23563ac95e3a.mp3',
    '¡Otra chispa! ¡Ya van 2!': AUDIO_BASE+'hf_20260927_201408_01c895e3-7ffe-4c6f-bbd1-6645871a1773.mp3',
    '¡Las tres chispas! ¡Ahora vamos por el Nublao!': AUDIO_BASE+'hf_20260927_201414_b303dbf9-c4f9-4063-b365-8ff240bacad0.mp3',
    '¡Mandocas con queso! ¡Qué molleja de ricas!': AUDIO_BASE+'hf_20260927_201450_ba9193aa-a388-426f-ba92-ff0f559ea5f3.mp3',
    '¡Un patacón maracucho! ¡Es más grande que mi cabeza, vos!': AUDIO_BASE+'hf_20260927_201451_94f711bf-cb45-4703-b565-91c870d2a8e2.mp3',
    '¡Tequeños! ¡El queso se estira hasta allá, vos!': AUDIO_BASE+'hf_20260927_201526_cc00db0c-6d5c-4a4d-9535-c50ca1e9a617.mp3',
    '¡Pastelitos calienticos! ¡Cuidado que queman, vos!': AUDIO_BASE+'hf_20260927_201526_9367283b-b680-448b-b2e0-608fd2693f48.mp3',
    '¡Huevos chimbos! ¡Dulcísimos, vos!': AUDIO_BASE+'hf_20260927_201552_2de8b846-ebb1-4cc1-930a-0657299b4d85.mp3',
    '¡Un cepillado bien frío! ¡Se me congela el cerebro, vos!': AUDIO_BASE+'hf_20260927_201551_a2df38b7-4c32-4422-8bf2-8fc91b5f0e6b.mp3',
  },
  primo: {
    '¡Aquí está el Primo Verde, vos!': AUDIO_BASE+'hf_20260927_201148_859914f2-8586-40b7-89f7-02f6f6d969de.mp3',
    '¡Ay, vergación! ¿Ya se fueron esas nubes? Yo de aquí no me asomo, primo.': AUDIO_BASE+'hf_20260927_201618_b406f229-c573-43a2-b74e-554fffed09be.mp3',
    '¡Está bien, pues! ¡Pero vos vais adelante!': AUDIO_BASE+'hf_20260927_201640_1e39e03a-d9a5-4708-b7c7-2902f9aacfd4.mp3',
    '¡Vamos pa\'l puente, primo!': AUDIO_BASE+'hf_20260927_201648_89b32573-b8fb-43ac-9dae-03999c038369.mp3',
    '¡El Puente sobre el Lago! ¡Pendiente con los carros, que aquí nadie frena, vos!': AUDIO_BASE+'hf_20260927_201716_1c87d9c5-0280-4257-be5d-ab7c59cc1edf.mp3',
    '¡Agarrate, primo, que este ventarrón nos lleva pa\' Cabimas!': AUDIO_BASE+'hf_20260927_201715_2accdd59-b57b-413b-894c-577f4a78b3ee.mp3',
    '¡Patitas pa\' qué te tengo!': AUDIO_BASE+'hf_20260927_201800_28d202b1-dcbb-435a-9c71-73cc281bd4e3.mp3',
    '¡Ay, mamá! ¡Yo sabía que no tenía que venir!': AUDIO_BASE+'hf_20260927_201822_98aefb14-816c-41a5-8433-7ba25abb194f.mp3',
  },
  mollejuo: {
    '¡El Mollejúo llegó con hambre!': AUDIO_BASE+'hf_20260927_201216_f85e93c2-abd7-440d-b117-b1fe697bb008.mp3',
    '¡Epa! ¡De aquí no me muevo hasta que me den un patacón, vos!': AUDIO_BASE+'hf_20260927_201829_1926af0a-7e2c-410f-b7ec-2aab9257022c.mp3',
    '¡Traeme algo de comer, mi hermano, que tengo la barriga pegada al espinazo!': AUDIO_BASE+'hf_20260927_201847_bf781b66-70ce-4ca4-b4aa-3d954f3d33a9.mp3',
    '¡Qué molleja de patacón! ¡Ahora sí, vamos pa\'l Catatumbo!': AUDIO_BASE+'hf_20260927_201856_9eae9a65-149b-4635-8504-a2e0dc5ee2fb.mp3',
    '¡Apártense, que ahí va panza!': AUDIO_BASE+'hf_20260927_201932_916fab3a-47c6-4c17-babd-64035160e1d3.mp3',
    '¡Del otro lado del puente ya se ven los palafitos, vos!': AUDIO_BASE+'hf_20260927_201932_bd779c59-c3c8-4723-9d8b-da3b28872b69.mp3',
    '¡Ahora sí, a comer mandocas en la feria, vos!': AUDIO_BASE+'hf_20260927_202012_98115795-701b-48f7-91c9-4d4838005f88.mp3',
    '¡Panzazo!': AUDIO_BASE+'hf_20260927_202012_34dd8209-95a5-4a00-8f2e-4c37d646f221.mp3',
    '¡Epa, más respeto con la panza!': AUDIO_BASE+'hf_20260927_202042_135a66a1-8874-473a-89db-865e6d3ecfbf.mp3',
    '¡Eso no me llenó ni una muela, vos!': AUDIO_BASE+'hf_20260927_202043_f2671cf7-e3ff-4423-8036-31e638e2aaaf.mp3',
  },
  chinita: {
    '¡Muchachos! Unas nubes negras se robaron el relámpago del Catatumbo. ¡Sin relámpago no hay feria!': AUDIO_BASE+'hf_20260927_202111_1d524f01-998c-492f-a86c-cfe6245731bd.mp3',
    'Las nubes escondieron tres chispas del relámpago en los palafitos. ¡Búsquenlas, mis muchachos!': AUDIO_BASE+'hf_20260927_201147_0d61ea84-de1b-4563-a93d-598321f648f5.mp3',
    '¡Gracias, mis muchachos! ¡El Catatumbo vuelve a brillar y la feria se prende!': AUDIO_BASE+'hf_20260927_202108_81ce1311-f1c7-41e7-bdb3-fc71bec9be12.mp3',
  },
  nublao: {
    '¡Jua, jua, jua! ¡El relámpago es mío y el lago se queda a oscuras!': AUDIO_BASE+'hf_20260927_201147_83b8f327-ec3b-427c-a18c-e002cce24fc3.mp3',
    '¡Ay, no! ¡Me desinflaron como un globo!': AUDIO_BASE+'hf_20260927_202136_a314d890-f57f-44ba-8188-5ccf3dee2a45.mp3',
  },
};
window.SALO_VOCES = CLIPS_PJ;
})();
