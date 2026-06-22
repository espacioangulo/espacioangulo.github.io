// CONFIGURACIÓN RÁPIDA — ESPACIO ÁNGULO
// 1) Formspree: crea un formulario y pega aquí el endpoint, por ejemplo:
//    https://formspree.io/f/abcdwxyz
// 2) Stripe: crea un Payment Link de 60 € y pégalo aquí, por ejemplo:
//    https://buy.stripe.com/xxxxxxxx
// La web añadirá automáticamente ?client_reference_id=EA-... al enlace de Stripe.

window.ESPACIO_ANGULO_CONFIG = {
  formEndpoint: "https://formspree.io/f/xlgyebgk",
  stripePaymentLink: "https://buy.stripe.com/aFa7sKcEdai79q407RfAc00",
  sessionPrice: "60 €",
  sessionDuration: "una hora",
  siteName: "Espacio Ángulo",
  agendaPath: "data/agenda.json"
};
