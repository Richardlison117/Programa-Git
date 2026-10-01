/* ==========================================================
   PROYECTO : MINUTA DIGITAL 360
   ARCHIVO  : acerca-de.js

   DESCRIPCIÓN:
   Gestiona funciones básicas de la sección Acerca de.
========================================================== */

"use strict";


/* ==========================================================
   01. INICIAR
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciarAcerca
);


function iniciarAcerca() {

    actualizarVersion();

}


/* ==========================================================
   02. ACTUALIZAR INFORMACIÓN
========================================================== */

function actualizarVersion() {

    /*
       La información institucional actualmente
       se encuentra definida directamente en el HTML.

       Esta función queda preparada para que,
       posteriormente, la versión pueda administrarse
       desde la configuración del sistema.
    */

    const version =
        "1.0.0";


    const elementosVersion =
        document.querySelectorAll(
            ".pie-acerca span"
        );


    /*
       Actualiza solamente el elemento que contiene
       la versión del sistema.
    */

    elementosVersion.forEach(
        elemento => {

            if (
                elemento.textContent
                    .toLowerCase()
                    .includes("versión")
            ) {

                elemento.textContent =
                    `Versión ${version}`;

            }

        }
    );

}