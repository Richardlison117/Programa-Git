/* ==========================================================
   PROYECTO : MINUTA DIGITAL 360
   ARCHIVO  : perfil.js

   DESCRIPCIÓN:
   Muestra la información del usuario que inició sesión.
========================================================== */

"use strict";


/* ==========================================================
   01. INICIAR
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciarPerfil
);


function iniciarPerfil() {

    const usuario =
        obtenerUsuario();

    /* Si no existe sesión, vuelve al login. */

    if (!usuario) {

        window.location.href =
            "./login.html";

        return;
    }


    mostrarInformacion(
        usuario
    );

    prepararCerrarSesion();

}


/* ==========================================================
   02. OBTENER USUARIO
========================================================== */

function obtenerUsuario() {

    try {

        return JSON.parse(
            sessionStorage.getItem(
                "usuario"
            )
        );

    } catch (error) {

        console.error(
            "No fue posible leer la sesión.",
            error
        );

        return null;
    }

}


/* ==========================================================
   03. MOSTRAR INFORMACIÓN
========================================================== */

function mostrarInformacion(
    usuario
) {

    /* Identidad */

    colocarTexto(
        "nombrePerfil",
        usuario.nombre
    );


    colocarTexto(
        "cargoPerfil",
        usuario.cargo
    );


    colocarTexto(
        "estadoPerfil",
        usuario.estado || "Activo"
    );


    /* Información personal */

    colocarTexto(
        "nombreCompleto",
        usuario.nombre
    );


    colocarTexto(
        "documentoPerfil",
        usuario.documento
    );


    colocarTexto(
        "cargoCompleto",
        usuario.cargo
    );


    colocarTexto(
        "empresaPerfil",
        usuario.empresa
    );


    /* Información operativa */

    colocarTexto(
        "puestoPerfil",
        usuario.puesto
    );


    colocarTexto(
        "rolPerfil",
        usuario.rol
    );


    colocarTexto(
        "estadoCuenta",
        usuario.estado || "Activo"
    );


    colocarTexto(
        "usuarioPerfil",
        usuario.usuario
    );

}


/* ==========================================================
   04. COLOCAR TEXTO
========================================================== */

function colocarTexto(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {

        return;
    }


    elemento.textContent =
        valor || "Sin información";

}


/* ==========================================================
   05. CERRAR SESIÓN
========================================================== */

function prepararCerrarSesion() {

    const boton =
        document.getElementById(
            "btnCerrarSesion"
        );


    if (!boton) {

        return;
    }


    boton.addEventListener(
        "click",
        () => {

            const confirmar =
                confirm(
                    "¿Está seguro de que desea cerrar sesión?"
                );


            if (!confirmar) {

                return;
            }


            /* Elimina la sesión actual. */

            sessionStorage.removeItem(
                "usuario"
            );


            sessionStorage.removeItem(
                "turnoActual"
            );


            /* Regresa al login. */

            window.location.href =
                "./login.html";

        }
    );

}