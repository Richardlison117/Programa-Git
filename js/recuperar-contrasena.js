/* ==========================================================
   PROYECTO : MINUTA DIGITAL 360
   ARCHIVO  : recuperar-contraseña.js
   DESCRIPCIÓN:
   Controla la solicitud de recuperación de contraseña.
   AUTOR:
   Richard Duvan Gelves Laguado
========================================================== */


/* ==========================================================
   ELEMENTOS
========================================================== */

// Formulario
const formulario = document.getElementById(
    "formulario-recuperacion"
);

// Campo de usuario
const usuario = document.getElementById(
    "usuario-recuperacion"
);

// Mensaje
const mensaje = document.getElementById(
    "mensaje-recuperacion"
);

// Botón
const boton = document.getElementById(
    "btn-recuperar"
);


/* ==========================================================
   SOLICITAR RECUPERACIÓN
========================================================== */

formulario.addEventListener("submit", function (evento) {

    // Evita recargar la página
    evento.preventDefault();


    // Obtiene el usuario
    const nombreUsuario = usuario.value.trim();


    /* ======================================================
       VALIDAR USUARIO
    ======================================================= */

    if (nombreUsuario === "") {

        mostrarMensaje(
            "Ingrese su usuario.",
            "error"
        );

        return;
    }


    /* ======================================================
       SIMULAR RECUPERACIÓN
    ======================================================= */

    mostrarMensaje(
        "Solicitud enviada correctamente.",
        "exito"
    );


    // Desactiva el botón
    boton.disabled = true;


    // Cambia el texto del botón
    boton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Procesando...
    `;


    /* ======================================================
       SIMULAR PROCESO
    ======================================================= */

    setTimeout(function () {

        boton.disabled = false;

        boton.innerHTML = `
            <i class="fa-solid fa-key"></i>
            Solicitar recuperación
        `;

    }, 2000);

});


/* ==========================================================
   MOSTRAR MENSAJE
========================================================== */

function mostrarMensaje(texto, tipo) {

    mensaje.textContent = texto;

    mensaje.className =
        "mensaje-recuperacion " + tipo;
}