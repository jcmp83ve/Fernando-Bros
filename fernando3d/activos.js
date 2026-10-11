'use strict';
/* ============================================================
   FERNANDO 3D — los RECURSOS de alta calidad (hechos con Higgsfield)
   Fernando en 3D con esqueleto y animaciones (correr, quieto, salto
   y baile), Tío Juan volando como superhéroe (con su pelo negro) y
   las texturas de pasto, tierra, arena, nieve, ladrillo y lava.
   Se cargan desde internet mientras se juega; si no llegan, el
   juego usa los personajes y texturas hechos con piezas.
   ============================================================ */
(function(raiz){
const B = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3Fiy4A0M4MKixWlklbu10QS1hAQ/';
raiz.F3D_ACTIVOS = {
  texturas: {
    pasto:        B + 'ebd10271-242e-4af6-a555-a7ca06452170.jpg',
    tierra:       B + '5f5a4c19-be5c-4402-a6c1-be026208157c.jpg',
    arena:        B + 'b9e1a834-681d-4d26-ae47-617fe627534b.jpg',
    nieve:        B + '9b96ac6d-f8e2-454e-94f7-cabddc2fb5f6.jpg',
    ladrillo:     B + '221c325b-b532-4cf8-83d3-80925a9b6e04.jpg',
    piedraOscura: B + '19c0c3e4-6aba-4ea4-b856-0d5890103d1a.jpg',
  },
  fernando: {
    modelo: B + '5272e153-e220-406a-acaf-60a79d7faf31.glb',   /* trae la animación de correr */
    quieto: B + 'fdd6b4ba-60b3-422f-acaf-724762baaed8.glb',
    salto:  B + 'bdb1811d-7d83-42ba-844d-229c7460d3d7.glb',
    baile:  B + '3c15dbda-c477-4e17-8534-b4dd63bb6c67.glb',
    alto: 1.55,
  },
  tio: {
    modelo: B + 'acfcc71b-3aa8-4742-8d85-0b2d652d1c6d.glb',
    largo: 2.3, giro: -Math.PI/2,
  },
};
})(typeof window !== 'undefined' ? window : this);
