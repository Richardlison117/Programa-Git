/* ==========================================================
   PROYECTO : MINUTA DIGITAL 360
   ARCHIVO  : minuta.js
   DESCRIPCIÓN:
   Controla el registro de novedades del servicio.
========================================================== */


/* ==========================================================
   01. ELEMENTOS
========================================================== */

// Formulario
const formulario =
    document.getElementById("formulario-minuta");

// Fecha y hora
const campoFecha =
    document.getElementById("fecha");

const campoHora =
    document.getElementById("hora");

// Usuario y puesto
const campoPuesto =
    document.getElementById("puesto");

const campoUsuario =
    document.getElementById("guarda");

// Ubicación
const campoUbicacion =
    document.getElementById("ubicacion");

const campoLugar =
    document.getElementById("lugar");

// Campos dinámicos
const campoColumna =
    document.getElementById("campoColumna");

const campoOtraColumna =
    document.getElementById("campoOtraColumna");

const campoNumeroLocal =
    document.getElementById("campoNumeroLocal");

const campoNombreLocal =
    document.getElementById("campoNombreLocal");

const campoAreaComun =
    document.getElementById("campoAreaComun");

const campoDescripcionLugar =
    document.getElementById("campoDescripcionLugar");

const columna =
    document.getElementById("columna");

const otraColumna =
    document.getElementById("otraColumna");

// Evidencias
const campoEvidencia =
    document.getElementById("evidencia");

const btnTomarFoto =
    document.getElementById("btnTomarFoto");

const vistaPrevia =
    document.getElementById("vistaPreviaEvidencias");

// Acciones
const btnGuardar =
    document.getElementById("btnGuardarNovedad");

const btnLimpiar =
    document.getElementById("btnLimpiarMinuta");

const mensaje =
    document.getElementById("mensaje-minuta");


/* ==========================================================
   02. VARIABLES
========================================================== */

// Guarda las fotografías seleccionadas.
let fotografias = [];

// Guarda la cámara activa.
let flujoCamara = null;


/* ==========================================================
   03. INICIAR APLICACIÓN
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciarAplicacion
);


function iniciarAplicacion() {

    cargarFechaHora();

    cargarUsuario();

    controlarLugar();

    controlarColumna();

    controlarArchivos();

    controlarCamara();

    controlarFormulario();

}


/* ==========================================================
   04. FECHA Y HORA
========================================================== */

function cargarFechaHora() {

    const ahora = new Date();

    campoFecha.value =
        ahora.toISOString().split("T")[0];

    campoHora.value =
        ahora.toTimeString().slice(0, 5);
}


/* ==========================================================
   05. CARGAR USUARIO
========================================================== */

function cargarUsuario() {

    /*
       Primero intenta obtener el turno actual.
       Si no existe, utiliza la sesión del usuario.
    */

    const turno =
        JSON.parse(
            sessionStorage.getItem("turnoActual")
        );

    const usuario =
        JSON.parse(
            sessionStorage.getItem("usuario")
        );


    /* Usuario proveniente del turno */

    if (turno?.receptor) {

        campoUsuario.value =
            turno.receptor.nombre || "";

        campoPuesto.value =
            turno.receptor.puesto || "";

        return;
    }


    /* Usuario proveniente de la sesión */

    if (usuario) {

        campoUsuario.value =
            usuario.nombre || "";

        campoPuesto.value =
            usuario.puesto || "";
    }

}


/* ==========================================================
   06. CONTROLAR LUGAR
========================================================== */

function controlarLugar() {

    campoLugar.addEventListener(
        "change",
        actualizarLugar
    );

    actualizarLugar();
}


function actualizarLugar() {

    /* Oculta todos los campos */
    ocultarCamposLugar();


    switch (campoLugar.value) {

        case "parqueadero":

            mostrar(campoColumna);

            break;


        case "local_comercial":

            mostrar(campoNumeroLocal);

            mostrar(campoNombreLocal);

            break;


        case "area_comun":

            mostrar(campoAreaComun);

            break;


        case "otro":

            mostrar(campoDescripcionLugar);

            break;
    }

}


/* ==========================================================
   07. OCULTAR CAMPOS DEL LUGAR
========================================================== */

function ocultarCamposLugar() {

    ocultar(campoColumna);

    ocultar(campoOtraColumna);

    ocultar(campoNumeroLocal);

    ocultar(campoNombreLocal);

    ocultar(campoAreaComun);

    ocultar(campoDescripcionLugar);


    otraColumna.value = "";

    document.getElementById(
        "numeroLocal"
    ).value = "";

    document.getElementById(
        "nombreLocal"
    ).value = "";

    document.getElementById(
        "areaComun"
    ).value = "";

    document.getElementById(
        "descripcionLugar"
    ).value = "";

}


/* ==========================================================
   08. CONTROLAR COLUMNA
========================================================== */

function controlarColumna() {

    columna.addEventListener(
        "change",
        () => {

            const esOtra =
                columna.value === "otro";

            campoOtraColumna.hidden =
                !esOtra;

            otraColumna.required =
                esOtra;


            if (!esOtra) {

                otraColumna.value = "";

            }

        }
    );

}


/* ==========================================================
   09. MOSTRAR Y OCULTAR
========================================================== */

function mostrar(elemento) {

    if (elemento) {

        elemento.hidden = false;

    }

}


function ocultar(elemento) {

    if (elemento) {

        elemento.hidden = true;

    }

}


/* ==========================================================
   10. CARGAR FOTOGRAFÍAS
========================================================== */

function controlarArchivos() {

    campoEvidencia.addEventListener(
        "change",
        () => {

            const archivos =
                Array.from(
                    campoEvidencia.files
                );


            archivos.forEach(
                archivo => {

                    if (
                        archivo.type.startsWith(
                            "image/"
                        )
                    ) {

                        fotografias.push(
                            archivo
                        );

                    }

                }
            );


            campoEvidencia.value = "";

            mostrarFotografias();

        }
    );

}


/* ==========================================================
   11. MOSTRAR FOTOGRAFÍAS
========================================================== */

function mostrarFotografias() {

    vistaPrevia.innerHTML = "";


    fotografias.forEach(
        (archivo, indice) => {

            const lector =
                new FileReader();


            lector.onload =
                evento => {

                    const tarjeta =
                        document.createElement(
                            "div"
                        );

                    tarjeta.className =
                        "evidencia-item";


                    const imagen =
                        document.createElement(
                            "img"
                        );

                    imagen.src =
                        evento.target.result;

                    imagen.alt =
                        `Evidencia ${indice + 1}`;


                    const boton =
                        document.createElement(
                            "button"
                        );

                    boton.type =
                        "button";

                    boton.className =
                        "btn-eliminar-evidencia";

                    boton.innerHTML =
                        `<i class="fa-solid fa-xmark"
                            aria-hidden="true"></i>`;


                    boton.addEventListener(
                        "click",
                        () => {

                            fotografias.splice(
                                indice,
                                1
                            );

                            mostrarFotografias();

                        }
                    );


                    tarjeta.appendChild(
                        imagen
                    );

                    tarjeta.appendChild(
                        boton
                    );

                    vistaPrevia.appendChild(
                        tarjeta
                    );

                };


            lector.readAsDataURL(
                archivo
            );

        }
    );

}


/* ==========================================================
   12. CÁMARA
========================================================== */

function controlarCamara() {

    btnTomarFoto.addEventListener(
        "click",
        abrirCamara
    );

}


/* ==========================================================
   13. ABRIR CÁMARA
========================================================== */

async function abrirCamara() {

    try {

        /* Comprueba que el navegador permita cámara */

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            mostrarMensaje(
                "El navegador no permite utilizar la cámara.",
                "error"
            );

            return;
        }


        /* ==================================================
           CREAR VENTANA DE CÁMARA
        ================================================== */

        const modal =
            document.createElement(
                "div"
            );

        modal.id =
            "modalCamaraEvidencia";

        modal.className =
            "modal-camara-evidencia";


        modal.innerHTML = `

            <div class="camara-evidencia">

                <div class="cabecera-camara">

                    <h3>

                        <i
                            class="fa-solid fa-camera"
                            aria-hidden="true">
                        </i>

                        Tomar fotografía

                    </h3>


                    <button
                        type="button"
                        id="btnCerrarCamara"
                        class="btn-cerrar-camara">

                        <i
                            class="fa-solid fa-xmark"
                            aria-hidden="true">
                        </i>

                    </button>

                </div>


                <div class="visor-camara">

                    <video
                        id="videoEvidencia"
                        autoplay
                        playsinline
                        muted>
                    </video>

                </div>


                <p class="indicacion-camara">

                    Ubique correctamente el elemento
                    antes de tomar la fotografía.

                </p>


                <div class="acciones-camara-evidencia">

                    <button
                        type="button"
                        id="btnCapturarEvidencia"
                        class="btn-primario">

                        <i
                            class="fa-solid fa-camera"
                            aria-hidden="true">
                        </i>

                        Capturar

                    </button>


                    <button
                        type="button"
                        id="btnCancelarCamara"
                        class="btn-secundario">

                        Cancelar

                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        /* ==================================================
           ELEMENTOS DE LA CÁMARA
        ================================================== */

        const video =
            document.getElementById(
                "videoEvidencia"
            );

        const btnCapturar =
            document.getElementById(
                "btnCapturarEvidencia"
            );

        const btnCancelar =
            document.getElementById(
                "btnCancelarCamara"
            );

        const btnCerrar =
            document.getElementById(
                "btnCerrarCamara"
            );


        /* ==================================================
           ACTIVAR CÁMARA
        ================================================== */

        flujoCamara =
            await navigator.mediaDevices
                .getUserMedia({

                    video: {
                        facingMode: {
                            ideal: "environment"
                        }
                    },

                    audio: false

                });


        video.srcObject =
            flujoCamara;


        await video.play();


        /* ==================================================
           BOTONES
        ================================================== */

        btnCapturar.addEventListener(
            "click",
            () => capturarFotografia(video)
        );


        btnCancelar.addEventListener(
            "click",
            cerrarCamara
        );


        btnCerrar.addEventListener(
            "click",
            cerrarCamara
        );


        modal.addEventListener(
            "click",
            evento => {

                if (
                    evento.target === modal
                ) {

                    cerrarCamara();

                }

            }
        );


    } catch (error) {

        console.error(
            "Error al activar la cámara:",
            error
        );


        cerrarCamara();


        if (
            error.name ===
            "NotAllowedError"
        ) {

            mostrarMensaje(
                "Debe permitir el acceso a la cámara.",
                "error"
            );

            return;
        }


        if (
            error.name ===
            "NotFoundError"
        ) {

            mostrarMensaje(
                "No se encontró ninguna cámara.",
                "error"
            );

            return;
        }


        mostrarMensaje(
            "No fue posible activar la cámara.",
            "error"
        );

    }

}


/* ==========================================================
   14. CAPTURAR FOTOGRAFÍA
========================================================== */

function capturarFotografia(video) {

    if (
        !video.videoWidth ||
        !video.videoHeight
    ) {

        mostrarMensaje(
            "La cámara todavía no está lista.",
            "warning"
        );

        return;
    }


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;


    const contexto =
        canvas.getContext(
            "2d"
        );


    contexto.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    canvas.toBlob(
        blob => {

            if (!blob) {

                mostrarMensaje(
                    "No fue posible capturar la fotografía.",
                    "error"
                );

                return;
            }


            const archivo =
                new File(
                    [blob],
                    `evidencia-${Date.now()}.jpg`,
                    {
                        type: "image/jpeg"
                    }
                );


            fotografias.push(
                archivo
            );


            mostrarFotografias();

            cerrarCamara();


            mostrarMensaje(
                "Fotografía capturada correctamente.",
                "success"
            );

        },
        "image/jpeg",
        0.9
    );

}


/* ==========================================================
   15. CERRAR CÁMARA
========================================================== */

function cerrarCamara() {

    /* Detiene la cámara */

    if (flujoCamara) {

        flujoCamara
            .getTracks()
            .forEach(
                pista => pista.stop()
            );

        flujoCamara = null;

    }


    /* Elimina la ventana */

    const modal =
        document.getElementById(
            "modalCamaraEvidencia"
        );


    if (modal) {

        modal.remove();

    }

}


/* ==========================================================
   16. FORMULARIO
========================================================== */

function controlarFormulario() {

    formulario.addEventListener(
        "submit",
        guardarNovedad
    );


    formulario.addEventListener(
        "reset",
        limpiarFormulario
    );

}


/* ==========================================================
   17. GUARDAR NOVEDAD
========================================================== */

function guardarNovedad(evento) {

    evento.preventDefault();


    /* Validación básica */

    if (
        !formulario.checkValidity()
    ) {

        formulario.reportValidity();

        return;
    }


    const datos = {

        fecha:
            campoFecha.value,

        hora:
            campoHora.value,

        puesto:
            campoPuesto.value,

        usuario:
            campoUsuario.value,

        tipo:
            document.getElementById(
                "tipo"
            ).value,

        ubicacion:
            campoUbicacion.value,

        lugar:
            campoLugar.value,

        columna:
            columna.value,

        otraColumna:
            otraColumna.value.trim(),

        numeroLocal:
            document.getElementById(
                "numeroLocal"
            ).value.trim(),

        nombreLocal:
            document.getElementById(
                "nombreLocal"
            ).value.trim(),

        areaComun:
            document.getElementById(
                "areaComun"
            ).value.trim(),

        descripcionLugar:
            document.getElementById(
                "descripcionLugar"
            ).value.trim(),

        descripcion:
            document.getElementById(
                "descripcion"
            ).value.trim(),

        evidencias:
            fotografias.map(
                archivo =>
                    archivo.name
            )

    };


    /* ==================================================
       GUARDAR TEMPORALMENTE
    ================================================== */

    const novedades =
        JSON.parse(
            localStorage.getItem(
                "novedades"
            )
        ) || [];


    novedades.push(
        datos
    );


    localStorage.setItem(
        "novedades",
        JSON.stringify(
            novedades
        )
    );


    /* ==================================================
       MENSAJE
    ================================================== */

    mostrarMensaje(
        "La novedad fue registrada correctamente.",
        "success"
    );


    /* ==================================================
       BOTÓN
    ================================================== */

    btnGuardar.disabled =
        true;

    btnGuardar.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        Novedad registrada
    `;


    setTimeout(
        () => {

            btnGuardar.disabled =
                false;

            btnGuardar.innerHTML = `
                <i class="fa-solid fa-floppy-disk"></i>
                Guardar Novedad
            `;

        },
        1500
    );

}


/* ==========================================================
   18. MENSAJES
========================================================== */

function mostrarMensaje(
    texto,
    tipo = "info"
) {

    if (!mensaje) {

        return;
    }


    const iconos = {

        success:
            "fa-circle-check",

        warning:
            "fa-triangle-exclamation",

        error:
            "fa-circle-xmark",

        info:
            "fa-circle-info"

    };


    mensaje.className =
        "mensaje-minuta visible " +
        tipo;


    mensaje.innerHTML = `

        <i
            class="fa-solid ${iconos[tipo]}"
            aria-hidden="true">
        </i>

        <span>
            ${texto}
        </span>

    `;

}


/* ==========================================================
   19. LIMPIAR
========================================================== */

function limpiarFormulario() {

    setTimeout(
        () => {

            /* Fecha y hora */

            cargarFechaHora();


            /* Usuario */

            cargarUsuario();


            /* Lugar */

            ocultarCamposLugar();

            campoLugar.value = "";

            columna.value = "";


            /* Fotografías */

            fotografias = [];

            vistaPrevia.innerHTML = "";


            /* Cámara */

            cerrarCamara();


            /* Botón */

            btnGuardar.disabled =
                false;

            btnGuardar.innerHTML = `
                <i class="fa-solid fa-floppy-disk"></i>
                Guardar Novedad
            `;


            /* Mensaje */

            mensaje.className =
                "mensaje-minuta";

            mensaje.innerHTML = "";

        },
        0
    );

}


/* ==========================================================
   20. CERRAR CÁMARA AL SALIR
========================================================== */

window.addEventListener(
    "beforeunload",
    cerrarCamara
);