/* ==========================================================
   PROYECTO : MINUTA DIGITAL 360
   ARCHIVO  : app.js
   DESCRIPCIÓN:
   Controla la pantalla de carga y redirecciona al usuario
   hacia la pantalla de inicio de sesión.
   AUTOR:
   Richard Duvan Gelves Laguado
========================================================== */


/* ==========================================================
   CONFIGURACIÓN
========================================================== */

// Tiempo que permanecerá visible la pantalla de bienvenida.
// 3000 milisegundos = 3 segundos.

const TIEMPO_CARGA = 3000;


/* ==========================================================
   REDIRECCIÓN AL INICIO DE SESIÓN
========================================================== */

setTimeout(() => {

    window.location.href = "./pages/login.html";

}, TIEMPO_CARGA);