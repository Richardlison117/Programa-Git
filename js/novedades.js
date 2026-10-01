/* ==========================================================
   PROYECTO : MINUTA DIGITAL 360
   ARCHIVO  : novedades.js

   DESCRIPCIÓN:
   Gestiona la consulta, visualización, edición y cambio
   de estado de las novedades registradas.
========================================================== */

"use strict";


/* ==========================================================
   01. ELEMENTOS
========================================================== */

// Filtros
const buscarNovedad =
    document.getElementById("buscarNovedad");

const filtroTipo =
    document.getElementById("filtroTipo");

const filtroEstado =
    document.getElementById("filtroEstado");

const filtroFecha =
    document.getElementById("filtroFecha");

const btnAplicarFiltros =
    document.getElementById("btnAplicarFiltros");

const btnLimpiarFiltros =
    document.getElementById("btnLimpiarFiltros");

// Listado
const listaNovedades =
    document.getElementById("listaNovedades");

const contadorResultados =
    document.getElementById("contadorResultados");

const resultadoBusqueda =
    document.getElementById("resultadoBusqueda");

const sinResultados =
    document.getElementById("sinResultados");

// Resumen
const totalNovedades =
    document.getElementById("totalNovedades");

const totalPendientes =
    document.getElementById("totalPendientes");

const totalProceso =
    document.getElementById("totalProceso");

const totalCerradas =
    document.getElementById("totalCerradas");

// Modal
const modal =
    document.getElementById("modalNovedad");

const detalleNovedad =
    document.getElementById("detalleNovedad");

const formularioEditar =
    document.getElementById("formularioEditarNovedad");

const evidenciasNovedad =
    document.getElementById("evidenciasNovedad");

const tituloModal =
    document.getElementById("tituloModalNovedad");

// Botones del modal
const btnCerrarModal =
    document.getElementById("btnCerrarModal");

const btnCerrarModalInferior =
    document.getElementById("btnCerrarModalInferior");

const btnEditarNovedad =
    document.getElementById("btnEditarNovedad");

const btnGuardarEdicion =
    document.getElementById("btnGuardarEdicion");

const btnCancelarEdicion =
    document.getElementById("btnCancelarEdicion");

const btnCambiarEstado =
    document.getElementById("btnCambiarEstado");


/* ==========================================================
   02. VARIABLES
========================================================== */

// Novedades almacenadas.
let novedades = [];

// Novedades mostradas después de filtrar.
let novedadesFiltradas = [];

// Novedad seleccionada.
let novedadSeleccionada = null;


/* ==========================================================
   03. INICIAR
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciarAplicacion
);


function iniciarAplicacion() {

    cargarNovedades();

    actualizarResumen();

    aplicarFiltros();

    prepararEventos();

}


/* ==========================================================
   04. CARGAR NOVEDADES
========================================================== */

function cargarNovedades() {

    /*
       Lee las novedades guardadas por minuta.js.
    */

    novedades =
        JSON.parse(
            localStorage.getItem("novedades")
        ) || [];


    novedadesFiltradas =
        [...novedades];

}


/* ==========================================================
   05. PREPARAR EVENTOS
========================================================== */

function prepararEventos() {

    // Buscar en tiempo real.
    buscarNovedad?.addEventListener(
        "input",
        aplicarFiltros
    );

    // Filtros.
    filtroTipo?.addEventListener(
        "change",
        aplicarFiltros
    );

    filtroEstado?.addEventListener(
        "change",
        aplicarFiltros
    );

    filtroFecha?.addEventListener(
        "change",
        aplicarFiltros
    );

    // Botones.
    btnAplicarFiltros?.addEventListener(
        "click",
        aplicarFiltros
    );

    btnLimpiarFiltros?.addEventListener(
        "click",
        limpiarFiltros
    );

    // Modal.
    btnCerrarModal?.addEventListener(
        "click",
        cerrarModal
    );

    btnCerrarModalInferior?.addEventListener(
        "click",
        cerrarModal
    );

    btnEditarNovedad?.addEventListener(
        "click",
        activarEdicion
    );

    btnGuardarEdicion?.addEventListener(
        "click",
        guardarEdicion
    );

    btnCancelarEdicion?.addEventListener(
        "click",
        cancelarEdicion
    );

    btnCambiarEstado?.addEventListener(
        "click",
        cambiarEstado
    );


    // Cerrar modal al pulsar fuera.
    modal?.addEventListener(
        "click",
        evento => {

            if (
                evento.target === modal
            ) {

                cerrarModal();

            }

        }
    );


    // Cerrar con Escape.
    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key === "Escape" &&
                modal &&
                !modal.hidden
            ) {

                cerrarModal();

            }

        }
    );

}


/* ==========================================================
   06. ACTUALIZAR RESUMEN
========================================================== */

function actualizarResumen() {

    const pendientes =
        novedades.filter(
            novedad =>
                novedad.estado === "Pendiente"
        ).length;


    const proceso =
        novedades.filter(
            novedad =>
                novedad.estado === "En proceso"
        ).length;


    const cerradas =
        novedades.filter(
            novedad =>
                novedad.estado === "Cerrada"
        ).length;


    totalNovedades.textContent =
        novedades.length;

    totalPendientes.textContent =
        pendientes;

    totalProceso.textContent =
        proceso;

    totalCerradas.textContent =
        cerradas;

}


/* ==========================================================
   07. APLICAR FILTROS
========================================================== */

function aplicarFiltros() {

    const texto =
        buscarNovedad?.value
            .trim()
            .toLowerCase() || "";


    const tipo =
        filtroTipo?.value || "";


    const estado =
        filtroEstado?.value || "";


    const fecha =
        filtroFecha?.value || "";


    novedadesFiltradas =
        novedades.filter(
            novedad => {

                /*
                   Texto utilizado para la búsqueda.
                */

                const contenido = `

                    ${novedad.tipoTexto || ""}

                    ${novedad.tipo || ""}

                    ${novedad.ubicacion || ""}

                    ${novedad.lugar || ""}

                    ${novedad.detalleLugar || ""}

                    ${novedad.usuario || ""}

                    ${novedad.puesto || ""}

                    ${novedad.descripcion || ""}

                `.toLowerCase();


                const coincideTexto =
                    !texto ||
                    contenido.includes(texto);


                const coincideTipo =
                    !tipo ||
                    novedad.tipo === tipo;


                const coincideEstado =
                    !estado ||
                    novedad.estado === estado;


                const coincideFecha =
                    !fecha ||
                    novedad.fecha === fecha;


                return (
                    coincideTexto &&
                    coincideTipo &&
                    coincideEstado &&
                    coincideFecha
                );

            }
        );


    renderizarNovedades(
        novedadesFiltradas
    );

}


/* ==========================================================
   08. MOSTRAR LISTADO
========================================================== */

function renderizarNovedades(lista) {

    if (!listaNovedades) {

        return;

    }


    listaNovedades.innerHTML =
        "";


    contadorResultados.textContent =
        lista.length;


    resultadoBusqueda.textContent =
        lista.length === 1
            ? "Se encontró 1 novedad."
            : `Se encontraron ${lista.length} novedades.`;


    if (lista.length === 0) {

        sinResultados.hidden =
            false;

        return;
    }


    sinResultados.hidden =
        true;


    lista.forEach(
        novedad => {

            listaNovedades.appendChild(
                crearNovedad(novedad)
            );

        }
    );

}


/* ==========================================================
   09. CREAR NOVEDAD
========================================================== */

function crearNovedad(novedad) {

    const elemento =
        document.createElement(
            "article"
        );


    elemento.className =
        "item-novedad";


    elemento.innerHTML = `

        <div class="identificador-novedad">

            #${String(
                novedad.id
            ).padStart(3, "0")}

        </div>


        <div class="info-principal-novedad">

            <h3>
                ${escaparHTML(
                    novedad.tipoTexto ||
                    novedad.tipo ||
                    "Sin tipo"
                )}
            </h3>


            <p>

                ${escaparHTML(
                    novedad.lugar ||
                    "Sin lugar"
                )}

                ${novedad.detalleLugar
                    ? " · " +
                      escaparHTML(
                          novedad.detalleLugar
                      )
                    : ""}

            </p>

        </div>


        <div class="datos-novedad">

            <div class="dato-novedad">

                <strong>
                    Usuario:
                </strong>

                ${escaparHTML(
                    novedad.usuario || ""
                )}

            </div>


            <div class="dato-novedad">

                <strong>
                    Fecha:
                </strong>

                ${formatearFecha(
                    novedad.fecha
                )}

                ·

                ${escaparHTML(
                    novedad.hora || ""
                )}

            </div>


            <div class="dato-novedad">

                <strong>
                    Ubicación:
                </strong>

                ${escaparHTML(
                    novedad.ubicacion || ""
                )}

            </div>

        </div>


        <div>

            <span
                class="estado-novedad
                ${obtenerClaseEstado(
                    novedad.estado
                )}"
            >

                ${escaparHTML(
                    novedad.estado || ""
                )}

            </span>

        </div>


        <div class="accion-novedad">

            <button
                type="button"
                class="btn-ver-detalle"
            >

                <i
                    class="fa-solid fa-eye"
                    aria-hidden="true">
                </i>

                Ver detalle

            </button>

        </div>

    `;


    const boton =
        elemento.querySelector(
            ".btn-ver-detalle"
        );


    boton?.addEventListener(
        "click",
        () => {

            abrirDetalle(
                novedad.id
            );

        }
    );


    return elemento;

}


/* ==========================================================
   10. ABRIR DETALLE
========================================================== */

function abrirDetalle(id) {

    novedadSeleccionada =
        novedades.find(
            novedad =>
                String(novedad.id) ===
                String(id)
        );


    if (!novedadSeleccionada) {

        return;

    }


    tituloModal.textContent =
        `Novedad #${String(
            novedadSeleccionada.id
        ).padStart(3, "0")}`;


    mostrarDetalle();

    mostrarEvidencias();

    formularioEditar.hidden =
        true;

    modal.hidden =
        false;


    document.body.style.overflow =
        "hidden";

}


/* ==========================================================
   11. MOSTRAR DETALLE
========================================================== */

function mostrarDetalle() {

    const novedad =
        novedadSeleccionada;


    detalleNovedad.innerHTML = `

        <div class="detalle-grupo">

            <span>
                Tipo de novedad
            </span>

            <strong>

                ${escaparHTML(
                    novedad.tipoTexto ||
                    novedad.tipo ||
                    ""
                )}

            </strong>

        </div>


        <div class="detalle-grupo">

            <span>
                Estado
            </span>

            <strong>

                ${escaparHTML(
                    novedad.estado || ""
                )}

            </strong>

        </div>


        <div class="detalle-grupo">

            <span>
                Fecha
            </span>

            <strong>

                ${formatearFecha(
                    novedad.fecha
                )}

            </strong>

        </div>


        <div class="detalle-grupo">

            <span>
                Hora
            </span>

            <strong>

                ${escaparHTML(
                    novedad.hora || ""
                )}

            </strong>

        </div>


        <div class="detalle-grupo">

            <span>
                Usuario
            </span>

            <strong>

                ${escaparHTML(
                    novedad.usuario || ""
                )}

            </strong>

        </div>


        <div class="detalle-grupo">

            <span>
                Puesto
            </span>

            <strong>

                ${escaparHTML(
                    novedad.puesto || ""
                )}

            </strong>

        </div>


        <div class="detalle-grupo">

            <span>
                Ubicación
            </span>

            <strong>

                ${escaparHTML(
                    novedad.ubicacion || ""
                )}

            </strong>

        </div>


        <div class="detalle-grupo">

            <span>
                Lugar
            </span>

            <strong>

                ${escaparHTML(
                    novedad.lugar || ""
                )}

            </strong>

        </div>


        <div class="detalle-grupo">

            <span>
                Lugar específico
            </span>

            <strong>

                ${escaparHTML(
                    novedad.detalleLugar ||
                    ""
                )}

            </strong>

        </div>


        <div class="detalle-grupo detalle-grupo-completo">

            <span>
                Descripción
            </span>

            <p>

                ${escaparHTML(
                    novedad.descripcion ||
                    ""
                )}

            </p>

        </div>

    `;

}


/* ==========================================================
   12. MOSTRAR EVIDENCIAS
========================================================== */

function mostrarEvidencias() {

    evidenciasNovedad.innerHTML =
        "";


    const evidencias =
        novedadSeleccionada?.evidencias || [];


    if (evidencias.length === 0) {

        evidenciasNovedad.innerHTML = `

            <div class="sin-evidencias">

                <i
                    class="fa-regular fa-image"
                    aria-hidden="true">
                </i>

                <p>
                    Esta novedad no tiene evidencias registradas.
                </p>

            </div>

        `;

        return;

    }


    evidencias.forEach(
        evidencia => {

            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "evidencia-novedad-item";


            elemento.textContent =
                evidencia;


            evidenciasNovedad.appendChild(
                elemento
            );

        }
    );

}


/* ==========================================================
   13. EDITAR NOVEDAD
========================================================== */

function activarEdicion() {

    if (!novedadSeleccionada) {

        return;

    }


    establecerValor(
        "editarId",
        novedadSeleccionada.id
    );


    establecerValor(
        "editarTipo",
        novedadSeleccionada.tipo
    );


    establecerValor(
        "editarUbicacion",
        novedadSeleccionada.ubicacion
    );


    establecerValor(
        "editarLugar",
        novedadSeleccionada.lugar
    );


    establecerValor(
        "editarDetalleLugar",
        novedadSeleccionada.detalleLugar
    );


    establecerValor(
        "editarEstado",
        novedadSeleccionada.estado
    );


    establecerValor(
        "editarDescripcion",
        novedadSeleccionada.descripcion
    );


    formularioEditar.hidden =
        false;

}


/* ==========================================================
   14. GUARDAR EDICIÓN
========================================================== */

function guardarEdicion() {

    if (!novedadSeleccionada) {

        return;

    }


    const tipo =
        obtenerValor("editarTipo");

    const ubicacion =
        obtenerValor("editarUbicacion");

    const lugar =
        obtenerValor("editarLugar");

    const detalleLugar =
        obtenerValor("editarDetalleLugar");

    const estado =
        obtenerValor("editarEstado");

    const descripcion =
        obtenerValor("editarDescripcion");


    if (
        !tipo ||
        !ubicacion ||
        !lugar ||
        !detalleLugar ||
        !descripcion
    ) {

        mostrarMensaje(
            "Complete todos los campos obligatorios.",
            "warning"
        );

        return;

    }


    novedadSeleccionada.tipo =
        tipo;


    novedadSeleccionada.tipoTexto =
        obtenerTextoOpcion(
            "editarTipo",
            tipo
        );


    novedadSeleccionada.ubicacion =
        ubicacion;


    novedadSeleccionada.lugar =
        lugar;


    novedadSeleccionada.detalleLugar =
        detalleLugar;


    novedadSeleccionada.estado =
        estado;


    novedadSeleccionada.descripcion =
        descripcion;


    guardarNovedades();


    actualizarResumen();

    aplicarFiltros();

    mostrarDetalle();

    mostrarEvidencias();

    formularioEditar.hidden =
        true;


    mostrarMensaje(
        "Los cambios fueron guardados correctamente.",
        "success"
    );

}


/* ==========================================================
   15. CANCELAR EDICIÓN
========================================================== */

function cancelarEdicion() {

    formularioEditar.hidden =
        true;

}


/* ==========================================================
   16. CAMBIAR ESTADO
========================================================== */

function cambiarEstado() {

    if (!novedadSeleccionada) {

        return;

    }


    const estados = [

        "Pendiente",
        "En proceso",
        "Cerrada"

    ];


    const posicion =
        estados.indexOf(
            novedadSeleccionada.estado
        );


    const siguiente =
        posicion === -1
            ? 0
            : (posicion + 1) %
              estados.length;


    novedadSeleccionada.estado =
        estados[siguiente];


    guardarNovedades();

    actualizarResumen();

    aplicarFiltros();

    mostrarDetalle();


    mostrarMensaje(
        `Estado actualizado a: ${novedadSeleccionada.estado}.`,
        "success"
    );

}


/* ==========================================================
   17. GUARDAR NOVEDADES
========================================================== */

function guardarNovedades() {

    localStorage.setItem(
        "novedades",
        JSON.stringify(
            novedades
        )
    );

}


/* ==========================================================
   18. LIMPIAR FILTROS
========================================================== */

function limpiarFiltros() {

    if (buscarNovedad) {

        buscarNovedad.value =
            "";

    }


    if (filtroTipo) {

        filtroTipo.value =
            "";

    }


    if (filtroEstado) {

        filtroEstado.value =
            "";

    }


    if (filtroFecha) {

        filtroFecha.value =
            "";

    }


    aplicarFiltros();

}


/* ==========================================================
   19. CERRAR MODAL
========================================================== */

function cerrarModal() {

    modal.hidden =
        true;


    formularioEditar.hidden =
        true;


    document.body.style.overflow =
        "";


    novedadSeleccionada =
        null;

}


/* ==========================================================
   20. MENSAJE
========================================================== */

function mostrarMensaje(
    texto,
    tipo
) {

    /*
       Por ahora mostramos el mensaje
       en la consola.
    */

    console.log(
        `[${tipo}] ${texto}`
    );

}


/* ==========================================================
   21. UTILIDADES
========================================================== */

function obtenerValor(id) {

    const elemento =
        document.getElementById(id);


    if (!elemento) {

        return "";

    }


    return String(
        elemento.value || ""
    ).trim();

}


function establecerValor(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.value =
            valor || "";

    }

}


function obtenerTextoOpcion(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);


    if (!elemento) {

        return valor;

    }


    const opcion =
        Array.from(
            elemento.options
        ).find(
            opcion =>
                opcion.value ===
                valor
        );


    return opcion
        ? opcion.textContent.trim()
        : valor;

}


/* ==========================================================
   22. FORMATEAR FECHA
========================================================== */

function formatearFecha(fecha) {

    if (!fecha) {

        return "";

    }


    const partes =
        fecha.split("-");


    if (
        partes.length !== 3
    ) {

        return fecha;

    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* ==========================================================
   23. CLASE DEL ESTADO
========================================================== */

function obtenerClaseEstado(
    estado
) {

    switch (estado) {

        case "Pendiente":

            return "estado-pendiente";


        case "En proceso":

            return "estado-proceso";


        case "Cerrada":

            return "estado-cerrada";


        default:

            return "";

    }

}


/* ==========================================================
   24. SEGURIDAD
========================================================== */

function escaparHTML(texto) {

    return String(
        texto ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}