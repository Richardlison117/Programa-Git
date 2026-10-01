/* ==========================================================
   PROYECTO : MINUTA DIGITAL 360
   ARCHIVO  : ayuda.js

   DESCRIPCIÓN:
   Gestiona la búsqueda del centro de ayuda.
========================================================== */

"use strict";


/* ==========================================================
   01. ELEMENTOS
========================================================== */

const buscarAyuda =
    document.getElementById(
        "buscarAyuda"
    );

const listaGuias =
    document.getElementById(
        "listaGuias"
    );

const sinGuias =
    document.getElementById(
        "sinGuias"
    );


/* ==========================================================
   02. INICIAR
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciarAyuda
);


function iniciarAyuda() {

    prepararBusqueda();

}


/* ==========================================================
   03. BÚSQUEDA
========================================================== */

function prepararBusqueda() {

    if (!buscarAyuda) {

        return;
    }


    buscarAyuda.addEventListener(
        "input",
        filtrarGuias
    );

}


/* ==========================================================
   04. FILTRAR GUÍAS
========================================================== */

function filtrarGuias() {

    const texto =
        buscarAyuda.value
            .trim()
            .toLowerCase();


    const guias =
        Array.from(
            listaGuias.querySelectorAll(
                ".guia-ayuda"
            )
        );


    let visibles = 0;


    guias.forEach(
        guia => {

            const contenido =
                guia.dataset.busqueda
                    ?.toLowerCase() || "";


            const titulo =
                guia
                    .querySelector("h3")
                    ?.textContent
                    .toLowerCase() || "";


            const descripcion =
                guia
                    .querySelector("p")
                    ?.textContent
                    .toLowerCase() || "";


            const coincide =
                !texto ||
                contenido.includes(texto) ||
                titulo.includes(texto) ||
                descripcion.includes(texto);


            guia.hidden =
                !coincide;


            if (coincide) {

                visibles++;

            }

        }
    );


    sinGuias.hidden =
        visibles !== 0;

}