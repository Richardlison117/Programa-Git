/* ==========================================================
   PROYECTO : MINUTA DIGITAL 360
   ARCHIVO  : evidencias.js

   DESCRIPCIÓN:
   Consulta y gestión de evidencias fotográficas y de video.
========================================================== */

"use strict";


/* ==========================================================
   01. ELEMENTOS
========================================================== */

const listaEvidencias =
    document.getElementById("listaEvidencias");

const buscarEvidencia =
    document.getElementById("buscarEvidencia");

const filtroTipo =
    document.getElementById("filtroTipoEvidencia");

const filtroFecha =
    document.getElementById("filtroFechaEvidencia");

const filtroUsuario =
    document.getElementById("filtroUsuarioEvidencia");

const contadorResultados =
    document.getElementById("contadorResultados");

const resultadoBusqueda =
    document.getElementById("resultadoBusqueda");

const sinResultados =
    document.getElementById("sinResultados");

const totalFotografias =
    document.getElementById("totalFotografias");

const totalVideos =
    document.getElementById("totalVideos");

const totalEvidencias =
    document.getElementById("totalEvidencias");

const btnAplicarFiltros =
    document.getElementById("btnAplicarFiltros");

const btnLimpiarFiltros =
    document.getElementById("btnLimpiarFiltros");

const modal =
    document.getElementById("modalEvidencia");

const visor =
    document.getElementById("visorEvidencia");

const detalle =
    document.getElementById("detalleEvidencia");

const tituloModal =
    document.getElementById("tituloModalEvidencia");

const btnCerrarModal =
    document.getElementById("btnCerrarModal");

const btnCerrarModalInferior =
    document.getElementById("btnCerrarModalInferior");

const btnDescargar =
    document.getElementById("btnDescargarEvidencia");


/* ==========================================================
   02. VARIABLES
========================================================== */

let evidencias = [];

let evidenciasFiltradas = [];

let evidenciaSeleccionada = null;


/* ==========================================================
   03. INICIAR
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciarAplicacion
);


function iniciarAplicacion() {

    cargarEvidencias();

    crearEvidenciasDePrueba();

    cargarUsuarios();

    actualizarResumen();

    aplicarFiltros();

    prepararEventos();

}


/* ==========================================================
   04. CARGAR EVIDENCIAS
========================================================== */

function cargarEvidencias() {

    const guardadas =
        JSON.parse(
            localStorage.getItem(
                "evidencias"
            )
        );


    evidencias =
        Array.isArray(guardadas)
            ? guardadas
            : [];

}


/* ==========================================================
   05. DATOS DE PRUEBA
========================================================== */

function crearEvidenciasDePrueba() {

    /*
       Solamente crea registros de prueba
       si todavía no existen evidencias.
    */

    if (evidencias.length > 0) {

        return;

    }


    evidencias = [

        {
            id: 1,
            tipo: "fotografia",
            fecha: "2026-09-11",
            hora: "20:10",
            usuario: "Mercurio",
            puesto: "Mercurio",
            origen: "Novedad",
            novedad: "Novedad #001",
            ubicacion: "Segundo Piso",
            lugar: "Local comercial",
            archivo: "",
            nombreArchivo: "Evidencia de prueba"
        }

    ];

}


/* ==========================================================
   06. CARGAR USUARIOS
========================================================== */

function cargarUsuarios() {

    const usuarios =
        [
            ...new Set(
                evidencias
                    .map(
                        evidencia =>
                            evidencia.usuario
                    )
                    .filter(Boolean)
            )
        ];


    usuarios.forEach(
        usuario => {

            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                usuario;

            opcion.textContent =
                usuario;

            filtroUsuario.appendChild(
                opcion
            );

        }
    );

}


/* ==========================================================
   07. EVENTOS
========================================================== */

function prepararEventos() {

    buscarEvidencia?.addEventListener(
        "input",
        aplicarFiltros
    );


    filtroTipo?.addEventListener(
        "change",
        aplicarFiltros
    );


    filtroFecha?.addEventListener(
        "change",
        aplicarFiltros
    );


    filtroUsuario?.addEventListener(
        "change",
        aplicarFiltros
    );


    btnAplicarFiltros?.addEventListener(
        "click",
        aplicarFiltros
    );


    btnLimpiarFiltros?.addEventListener(
        "click",
        limpiarFiltros
    );


    btnCerrarModal?.addEventListener(
        "click",
        cerrarModal
    );


    btnCerrarModalInferior?.addEventListener(
        "click",
        cerrarModal
    );


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


    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key === "Escape"
            ) {

                cerrarModal();

            }

        }
    );


    btnDescargar?.addEventListener(
        "click",
        descargarEvidencia
    );

}


/* ==========================================================
   08. RESUMEN
========================================================== */

function actualizarResumen() {

    const fotografias =
        evidencias.filter(
            evidencia =>
                evidencia.tipo === "fotografia"
        ).length;


    const videos =
        evidencias.filter(
            evidencia =>
                evidencia.tipo === "video"
        ).length;


    totalFotografias.textContent =
        fotografias;

    totalVideos.textContent =
        videos;

    totalEvidencias.textContent =
        evidencias.length;

}


/* ==========================================================
   09. FILTROS
========================================================== */

function aplicarFiltros() {

    const texto =
        buscarEvidencia?.value
            .trim()
            .toLowerCase() || "";


    const tipo =
        filtroTipo?.value || "";


    const fecha =
        filtroFecha?.value || "";


    const usuario =
        filtroUsuario?.value || "";


    evidenciasFiltradas =
        evidencias.filter(
            evidencia => {

                const contenido = `

                    ${evidencia.tipo || ""}

                    ${evidencia.origen || ""}

                    ${evidencia.novedad || ""}

                    ${evidencia.usuario || ""}

                    ${evidencia.puesto || ""}

                    ${evidencia.ubicacion || ""}

                    ${evidencia.lugar || ""}

                    ${evidencia.nombreArchivo || ""}

                `.toLowerCase();


                const coincideTexto =
                    !texto ||
                    contenido.includes(
                        texto
                    );


                const coincideTipo =
                    !tipo ||
                    evidencia.tipo === tipo;


                const coincideFecha =
                    !fecha ||
                    evidencia.fecha === fecha;


                const coincideUsuario =
                    !usuario ||
                    evidencia.usuario ===
                        usuario;


                return (
                    coincideTexto &&
                    coincideTipo &&
                    coincideFecha &&
                    coincideUsuario
                );

            }
        );


    renderizarEvidencias();

}


/* ==========================================================
   10. MOSTRAR EVIDENCIAS
========================================================== */

function renderizarEvidencias() {

    listaEvidencias.innerHTML =
        "";


    contadorResultados.textContent =
        evidenciasFiltradas.length;


    resultadoBusqueda.textContent =
        evidenciasFiltradas.length === 1
            ? "Se encontró 1 evidencia."
            : `Se encontraron ${evidenciasFiltradas.length} evidencias.`;


    if (
        evidenciasFiltradas.length === 0
    ) {

        sinResultados.hidden =
            false;

        return;

    }


    sinResultados.hidden =
        true;


    evidenciasFiltradas.forEach(
        evidencia => {

            listaEvidencias.appendChild(
                crearTarjeta(
                    evidencia
                )
            );

        }
    );

}


/* ==========================================================
   11. CREAR TARJETA
========================================================== */

function crearTarjeta(
    evidencia
) {

    const tarjeta =
        document.createElement(
            "article"
        );


    tarjeta.className =
        "tarjeta-evidencia";


    const esVideo =
        evidencia.tipo ===
        "video";


    const tipoTexto =
        esVideo
            ? "Video"
            : "Fotografía";


    const icono =
        esVideo
            ? "fa-video"
            : "fa-image";


    let vistaPrevia = `

        <div class="vista-evidencia">

            <div class="icono-video">

                <i
                    class="fa-solid ${icono}"
                    aria-hidden="true">
                </i>

            </div>

        </div>
    `;


    /*
       Si existe un archivo real,
       intenta mostrarlo.
    */

    if (evidencia.archivo) {

        if (esVideo) {

            vistaPrevia = `

                <div class="vista-evidencia">

                    <video
                        src="${evidencia.archivo}"
                        muted>
                    </video>

                    <div class="icono-video">

                        <i
                            class="fa-solid fa-play"
                            aria-hidden="true">
                        </i>

                    </div>

                </div>
            `;

        } else {

            vistaPrevia = `

                <div class="vista-evidencia">

                    <img
                        src="${evidencia.archivo}"
                        alt="Evidencia fotográfica">

                </div>
            `;

        }

    }


    tarjeta.innerHTML = `

        ${vistaPrevia}


        <div class="info-evidencia">

            <span class="tipo-evidencia">

                <i
                    class="fa-solid ${icono}"
                    aria-hidden="true">
                </i>

                ${tipoTexto}

            </span>


            <h3>

                ${escaparHTML(
                    evidencia.novedad ||
                    evidencia.origen ||
                    "Evidencia"
                )}

            </h3>


            <p>

                <strong>
                    Usuario:
                </strong>

                ${escaparHTML(
                    evidencia.usuario ||
                    ""
                )}

            </p>


            <p>

                <strong>
                    Fecha:
                </strong>

                ${formatearFecha(
                    evidencia.fecha
                )}

                ·

                ${escaparHTML(
                    evidencia.hora ||
                    ""
                )}

            </p>


            <p>

                <strong>
                    Lugar:
                </strong>

                ${escaparHTML(
                    evidencia.lugar ||
                    ""
                )}

            </p>


            <div class="acciones-evidencia">

                <button
                    type="button"
                    class="btn-ver-evidencia">

                    <i
                        class="fa-solid fa-eye"
                        aria-hidden="true">
                    </i>

                    Ver

                </button>

            </div>

        </div>

    `;


    const boton =
        tarjeta.querySelector(
            ".btn-ver-evidencia"
        );


    boton?.addEventListener(
        "click",
        () => abrirDetalle(
            evidencia
        )
    );


    return tarjeta;

}


/* ==========================================================
   12. ABRIR DETALLE
========================================================== */

function abrirDetalle(
    evidencia
) {

    evidenciaSeleccionada =
        evidencia;


    tituloModal.textContent =
        evidencia.tipo === "video"
            ? "Detalle del video"
            : "Detalle de la fotografía";


    mostrarArchivo();

    mostrarDetalle();


    modal.hidden =
        false;


    document.body.style.overflow =
        "hidden";

}


/* ==========================================================
   13. MOSTRAR ARCHIVO
========================================================== */

function mostrarArchivo() {

    visor.innerHTML =
        "";


    if (
        !evidenciaSeleccionada
    ) {

        return;

    }


    const evidencia =
        evidenciaSeleccionada;


    if (evidencia.archivo) {

        if (
            evidencia.tipo ===
            "video"
        ) {

            const video =
                document.createElement(
                    "video"
                );

            video.src =
                evidencia.archivo;

            video.controls =
                true;

            video.autoplay =
                false;

            visor.appendChild(
                video
            );

        } else {

            const imagen =
                document.createElement(
                    "img"
                );

            imagen.src =
                evidencia.archivo;

            imagen.alt =
                "Evidencia";

            visor.appendChild(
                imagen
            );

        }

        return;
    }


    visor.innerHTML = `

        <div class="sin-evidencias">

            <i
                class="fa-regular fa-image"
                aria-hidden="true">
            </i>

            <p>
                Archivo de demostración.
            </p>

        </div>

    `;

}


/* ==========================================================
   14. MOSTRAR DETALLE
========================================================== */

function mostrarDetalle() {

    const evidencia =
        evidenciaSeleccionada;


    detalle.innerHTML = `

        <div class="detalle-evidencia-item">

            <span>
                Tipo
            </span>

            <strong>
                ${evidencia.tipo === "video"
                    ? "Video"
                    : "Fotografía"}
            </strong>

        </div>


        <div class="detalle-evidencia-item">

            <span>
                Origen
            </span>

            <strong>

                ${escaparHTML(
                    evidencia.origen ||
                    ""
                )}

            </strong>

        </div>


        <div class="detalle-evidencia-item">

            <span>
                Usuario
            </span>

            <strong>

                ${escaparHTML(
                    evidencia.usuario ||
                    ""
                )}

            </strong>

        </div>


        <div class="detalle-evidencia-item">

            <span>
                Puesto
            </span>

            <strong>

                ${escaparHTML(
                    evidencia.puesto ||
                    ""
                )}

            </strong>

        </div>


        <div class="detalle-evidencia-item">

            <span>
                Fecha
            </span>

            <strong>

                ${formatearFecha(
                    evidencia.fecha
                )}

            </strong>

        </div>


        <div class="detalle-evidencia-item">

            <span>
                Hora
            </span>

            <strong>

                ${escaparHTML(
                    evidencia.hora ||
                    ""
                )}

            </strong>

        </div>


        <div class="detalle-evidencia-item">

            <span>
                Ubicación
            </span>

            <strong>

                ${escaparHTML(
                    evidencia.ubicacion ||
                    ""
                )}

            </strong>

        </div>


        <div class="detalle-evidencia-item">

            <span>
                Lugar
            </span>

            <strong>

                ${escaparHTML(
                    evidencia.lugar ||
                    ""
                )}

            </strong>

        </div>

    `;

}


/* ==========================================================
   15. DESCARGAR
========================================================== */

function descargarEvidencia() {

    if (
        !evidenciaSeleccionada ||
        !evidenciaSeleccionada.archivo
    ) {

        mostrarMensaje(
            "Esta evidencia todavía no tiene un archivo disponible.",
            "warning"
        );

        return;

    }


    const enlace =
        document.createElement(
            "a"
        );


    enlace.href =
        evidenciaSeleccionada.archivo;


    enlace.download =
        evidenciaSeleccionada.nombreArchivo ||
        "evidencia";


    enlace.click();

}


/* ==========================================================
   16. LIMPIAR FILTROS
========================================================== */

function limpiarFiltros() {

    buscarEvidencia.value =
        "";

    filtroTipo.value =
        "";

    filtroFecha.value =
        "";

    filtroUsuario.value =
        "";


    aplicarFiltros();

}


/* ==========================================================
   17. CERRAR MODAL
========================================================== */

function cerrarModal() {

    modal.hidden =
        true;


    visor.innerHTML =
        "";

    detalle.innerHTML =
        "";


    evidenciaSeleccionada =
        null;


    document.body.style.overflow =
        "";

}


/* ==========================================================
   18. MENSAJE
========================================================== */

function mostrarMensaje(
    texto,
    tipo
) {

    console.log(
        `[${tipo}] ${texto}`
    );

}


/* ==========================================================
   19. FECHA
========================================================== */

function formatearFecha(
    fecha
) {

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


    return `
        ${partes[2]}/
        ${partes[1]}/
        ${partes[0]}
    `.replace(
        /\s/g,
        ""
    );

}


/* ==========================================================
   20. SEGURIDAD
========================================================== */

function escaparHTML(
    texto
) {

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