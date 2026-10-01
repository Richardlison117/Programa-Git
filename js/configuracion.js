/* ==========================================================
   PROYECTO : MINUTA DIGITAL 360
   ARCHIVO  : configuracion.js

   DESCRIPCIÓN:
   Gestiona las preferencias generales del sistema.
========================================================== */

"use strict";


/* ==========================================================
   01. ELEMENTOS
========================================================== */

const tema =
    document.getElementById("tema");

const tamanoInterfaz =
    document.getElementById("tamanoInterfaz");

const notificaciones =
    document.getElementById("notificaciones");

const confirmarCierre =
    document.getElementById("confirmarCierre");

const actualizacionAutomatica =
    document.getElementById("actualizacionAutomatica");

const btnGuardar =
    document.getElementById("btnGuardar");

const btnRestablecer =
    document.getElementById("btnRestablecer");

const mensaje =
    document.getElementById(
        "mensajeConfiguracion"
    );


/* ==========================================================
   02. CONFIGURACIÓN POR DEFECTO
========================================================== */

const configuracionPredeterminada = {

    tema: "oscuro",

    tamanoInterfaz: "normal",

    notificaciones: true,

    confirmarCierre: true,

    actualizacionAutomatica: true

};


/* ==========================================================
   03. INICIAR
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciarConfiguracion
);


function iniciarConfiguracion() {

    cargarConfiguracion();

    aplicarConfiguracion();

    prepararEventos();

}


/* ==========================================================
   04. PREPARAR EVENTOS
========================================================== */

function prepararEventos() {

    btnGuardar?.addEventListener(
        "click",
        guardarConfiguracion
    );


    btnRestablecer?.addEventListener(
        "click",
        restablecerConfiguracion
    );

}


/* ==========================================================
   05. CARGAR CONFIGURACIÓN
========================================================== */

function cargarConfiguracion() {

    const guardada =
        JSON.parse(
            localStorage.getItem(
                "configuracion"
            )
        );


    const configuracion =
        guardada || {
            ...configuracionPredeterminada
        };


    tema.value =
        configuracion.tema;


    tamanoInterfaz.value =
        configuracion.tamanoInterfaz;


    notificaciones.checked =
        configuracion.notificaciones;


    confirmarCierre.checked =
        configuracion.confirmarCierre;


    actualizacionAutomatica.checked =
        configuracion.actualizacionAutomatica;

}


/* ==========================================================
   06. APLICAR CONFIGURACIÓN
========================================================== */

function aplicarConfiguracion() {

    const guardada =
        JSON.parse(
            localStorage.getItem(
                "configuracion"
            )
        );


    const configuracion =
        guardada || {
            ...configuracionPredeterminada
        };


    /* ======================================================
       TEMA
    ======================================================= */

    document.documentElement.setAttribute(
        "data-tema",
        configuracion.tema
    );


    /* ======================================================
       TAMAÑO DE INTERFAZ
    ======================================================= */

    document.body.classList.remove(
        "interfaz-compacta",
        "interfaz-grande"
    );


    if (
        configuracion.tamanoInterfaz ===
        "compacto"
    ) {

        document.body.classList.add(
            "interfaz-compacta"
        );

    }


    if (
        configuracion.tamanoInterfaz ===
        "grande"
    ) {

        document.body.classList.add(
            "interfaz-grande"
        );

    }

}


/* ==========================================================
   07. GUARDAR
========================================================== */

function guardarConfiguracion() {

    const configuracion = {

        tema:
            tema.value,

        tamanoInterfaz:
            tamanoInterfaz.value,

        notificaciones:
            notificaciones.checked,

        confirmarCierre:
            confirmarCierre.checked,

        actualizacionAutomatica:
            actualizacionAutomatica.checked

    };


    /* Guarda la configuración */

    localStorage.setItem(
        "configuracion",
        JSON.stringify(
            configuracion
        )
    );


    /* Aplica inmediatamente */

    aplicarConfiguracion();


    mostrarMensaje(
        "La configuración fue guardada correctamente."
    );

}


/* ==========================================================
   08. RESTABLECER
========================================================== */

function restablecerConfiguracion() {

    const configuracion = {

        ...configuracionPredeterminada

    };


    localStorage.setItem(
        "configuracion",
        JSON.stringify(
            configuracion
        )
    );


    cargarConfiguracion();

    aplicarConfiguracion();


    mostrarMensaje(
        "La configuración fue restablecida."
    );

}


/* ==========================================================
   09. MENSAJE
========================================================== */

function mostrarMensaje(
    texto
) {

    if (!mensaje) {

        return;
    }


    mensaje.textContent =
        texto;


    mensaje.classList.add(
        "visible"
    );


    setTimeout(
        () => {

            mensaje.classList.remove(
                "visible"
            );

        },
        2500
    );

}