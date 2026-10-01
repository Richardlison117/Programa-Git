/* ==========================================================
   PROYECTO : MINUTA DIGITAL 360
   ARCHIVO  : recibir-turno.js
   DESCRIPCIÓN:
   Controla el registro de recepción de turno.
========================================================== */


/* ==========================================================
   01. ELEMENTOS
========================================================== */

const formulario =
    document.getElementById("formulario-recibir-turno");

const empresa =
    document.getElementById("empresa");

const otraEmpresa =
    document.getElementById("otraEmpresa");

const nombreEmpresa =
    document.getElementById("nombreEmpresa");


const empresaEntrega =
    document.getElementById("empresaEntrega");

const otraEmpresaEntrega =
    document.getElementById("otraEmpresaEntrega");

const nombreEmpresaEntrega =
    document.getElementById("nombreEmpresaEntrega");


const fecha =
    document.getElementById("fecha");

const hora =
    document.getElementById("hora");


const tipoArmamento =
    document.getElementById("tipoArmamento");

const datosArmaLetal =
    document.getElementById("datosArmaLetal");

const datosArmaNoLetal =
    document.getElementById("datosArmaNoLetal");


const vistaCamara =
    document.getElementById("vistaCamara");

const vistaSelfie =
    document.getElementById("vistaSelfie");

const canvasSelfie =
    document.getElementById("canvasSelfie");

const estadoSelfie =
    document.getElementById("estadoSelfie");

const btnActivarCamara =
    document.getElementById("btnActivarCamara");

const btnTomarSelfie =
    document.getElementById("btnTomarSelfie");

const btnRepetirSelfie =
    document.getElementById("btnRepetirSelfie");


const btnConfirmar =
    document.getElementById("btnConfirmarRecibo");

const btnLimpiar =
    document.getElementById("btnLimpiar");


/* ==========================================================
   02. CÁMARA
========================================================== */

let camara = null;


/* ==========================================================
   03. INICIAR
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    cargarFechaHora();

    controlarEmpresa();

    controlarEmpresaEntrega();

    controlarArmamento();

    configurarCamara();

});


/* ==========================================================
   04. EMPRESA DEL RECEPTOR
========================================================== */

function controlarEmpresa() {

    if (!empresa) return;

    empresa.addEventListener("change", () => {

        const mostrar =
            empresa.value === "otra";

        otraEmpresa.hidden = !mostrar;

        nombreEmpresa.required = mostrar;


        if (!mostrar) {

            nombreEmpresa.value = "";

        }

    });

}


/* ==========================================================
   05. EMPRESA DE QUIEN ENTREGA
========================================================== */

function controlarEmpresaEntrega() {

    if (!empresaEntrega) return;

    empresaEntrega.addEventListener("change", () => {

        const mostrar =
            empresaEntrega.value === "otra";

        otraEmpresaEntrega.hidden = !mostrar;

        nombreEmpresaEntrega.required = mostrar;


        if (!mostrar) {

            nombreEmpresaEntrega.value = "";

        }

    });

}


/* ==========================================================
   06. FECHA Y HORA
========================================================== */

function cargarFechaHora() {

    const ahora = new Date();


    const anio =
        ahora.getFullYear();

    const mes =
        String(ahora.getMonth() + 1)
        .padStart(2, "0");

    const dia =
        String(ahora.getDate())
        .padStart(2, "0");


    const horas =
        String(ahora.getHours())
        .padStart(2, "0");

    const minutos =
        String(ahora.getMinutes())
        .padStart(2, "0");


    fecha.value =
        `${anio}-${mes}-${dia}`;

    hora.value =
        `${horas}:${minutos}`;

}


/* ==========================================================
   07. ARMAMENTO
========================================================== */

function controlarArmamento() {

    if (!tipoArmamento) return;

    tipoArmamento.addEventListener("change", () => {

        datosArmaLetal.hidden = true;

        datosArmaNoLetal.hidden = true;


        if (tipoArmamento.value === "letal") {

            datosArmaLetal.hidden = false;

        }


        if (tipoArmamento.value === "no_letal") {

            datosArmaNoLetal.hidden = false;

        }

    });

}


/* ==========================================================
   08. CONFIGURAR CÁMARA
========================================================== */

function configurarCamara() {

    if (!btnActivarCamara) return;

    btnActivarCamara.addEventListener(
        "click",
        activarCamara
    );


    btnTomarSelfie.addEventListener(
        "click",
        tomarSelfie
    );


    btnRepetirSelfie.addEventListener(
        "click",
        repetirSelfie
    );

}


/* ==========================================================
   09. ACTIVAR CÁMARA
========================================================== */

async function activarCamara() {

    try {

        // Solicita permiso para utilizar la cámara.
        camara =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user"
                },
                audio: false
            });


        // Conecta la cámara con el video.
        vistaCamara.srcObject =
            camara;


        // Muestra la cámara.
        vistaCamara.hidden = false;

        // Activa el botón de tomar selfie.
        btnTomarSelfie.disabled = false;


        // Actualiza el mensaje.
        estadoSelfie.textContent =
            "Cámara activa. Puede tomar la selfie.";


        // Cambia el botón.
        btnActivarCamara.textContent =
            "Cámara activa";


    } catch (error) {

        console.error(
            "Error al activar la cámara:",
            error
        );


        estadoSelfie.textContent =
            "No fue posible acceder a la cámara.";

    }

}


/* ==========================================================
   10. TOMAR SELFIE
========================================================== */

function tomarSelfie() {

    // Verifica que la cámara tenga imagen.
    if (
        !vistaCamara.videoWidth ||
        !vistaCamara.videoHeight
    ) {

        estadoSelfie.textContent =
            "Espere a que la cámara esté lista.";

        return;

    }


    // Define el tamaño de la imagen.
    canvasSelfie.width =
        vistaCamara.videoWidth;

    canvasSelfie.height =
        vistaCamara.videoHeight;


    // Captura la imagen.
    const contexto =
        canvasSelfie.getContext("2d");


    contexto.drawImage(
        vistaCamara,
        0,
        0,
        canvasSelfie.width,
        canvasSelfie.height
    );


    // Guarda la fotografía.
    vistaSelfie.src =
        canvasSelfie.toDataURL("image/jpeg");


    // Cambia la vista.
    vistaCamara.hidden = true;

    vistaSelfie.hidden = false;


    // Cambia los botones.
    btnTomarSelfie.disabled = true;

    btnRepetirSelfie.hidden = false;


    // Mensaje.
    estadoSelfie.textContent =
        "Selfie capturada correctamente.";


    // Apaga la cámara.
    detenerCamara();

}


/* ==========================================================
   11. REPETIR SELFIE
========================================================== */

function repetirSelfie() {

    vistaSelfie.hidden = true;

    btnRepetirSelfie.hidden = true;

    btnActivarCamara.textContent =
        "Activar cámara";

    activarCamara();

}


/* ==========================================================
   12. DETENER CÁMARA
========================================================== */

function detenerCamara() {

    if (!camara) return;


    camara.getTracks().forEach(
        pista => pista.stop()
    );


    camara = null;

}


/* ==========================================================
   13. CONFIRMAR RECEPCIÓN
========================================================== */

formulario.addEventListener(
    "submit",
    (evento) => {

        // Evita recargar la página.
        evento.preventDefault();


        // Exige la selfie.
        if (vistaSelfie.hidden) {

            estadoSelfie.textContent =
                "Debe capturar una selfie para continuar.";

            return;

        }


        /* ==================================================
           DATOS DEL RECEPTOR
        =================================================== */

        const receptor = {

            nombre:
                document.getElementById(
                    "nombre"
                ).value.trim(),

            documento:
                document.getElementById(
                    "documento"
                ).value.trim(),

            cargo:
                document.getElementById(
                    "cargo"
                ).value,

            empresa:
                empresa.value === "otra"
                    ? nombreEmpresa.value.trim()
                    : empresa.options[
                        empresa.selectedIndex
                    ].text,

            puesto:
                document.getElementById(
                    "puestoReceptor"
                ).value

        };


        /* ==================================================
           DATOS DE QUIEN ENTREGA
        =================================================== */

        const entrega = {

            nombre:
                document.getElementById(
                    "nombreEntrega"
                ).value.trim(),

            documento:
                document.getElementById(
                    "documentoEntrega"
                ).value.trim(),

            cargo:
                document.getElementById(
                    "cargoEntrega"
                ).value,

            empresa:
                empresaEntrega.value === "otra"
                    ? nombreEmpresaEntrega.value.trim()
                    : empresaEntrega.options[
                        empresaEntrega.selectedIndex
                    ].text,

            puesto:
                document.getElementById(
                    "puestoEntrega"
                ).value

        };


        /* ==================================================
           DATOS DEL TURN0
        =================================================== */

        const turno = {

            receptor: receptor,

            entrega: entrega,

            fecha:
                fecha.value,

            hora:
                hora.value,

            estado:
                document.getElementById(
                    "estado"
                ).value,


            /* Elementos */

            elementos: {

                radio:
                    document.getElementById(
                        "radio"
                    ).value,

                llaves:
                    document.getElementById(
                        "llaves"
                    ).value,

                tonfa:
                    document.getElementById(
                        "tonfa"
                    ).value,

                otros:
                    document.getElementById(
                        "otrosElementos"
                    ).value.trim()

            },


            /* Armamento */

            armamento:
                obtenerArmamento(),


            /* Observaciones */

            observaciones:
                document.getElementById(
                    "observaciones"
                ).value.trim(),


            /* Evidencia */

            selfie:
                vistaSelfie.src

        };


        /* ==================================================
           GUARDAR
        =================================================== */

        sessionStorage.setItem(
            "turnoActual",
            JSON.stringify(turno)
        );


        /* ==================================================
           FINALIZAR
        =================================================== */

        btnConfirmar.disabled = true;

        btnConfirmar.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Iniciando turno...
        `;


        setTimeout(() => {

            window.location.href =
                "./dashboard.html";

        }, 700);

    }
);


/* ==========================================================
   14. OBTENER ARMAMENTO
========================================================== */

function obtenerArmamento() {

    const tipo =
        tipoArmamento.value;


    if (tipo === "no_recibe") {

        return {

            tipo: "No recibe armamento"

        };

    }


    if (tipo === "letal") {

        return {

            tipo: "Arma letal",

            arma:
                document.getElementById(
                    "tipoArmaLetal"
                ).value,

            serial:
                document.getElementById(
                    "serialArma"
                ).value.trim(),

            municion:
                document.getElementById(
                    "municion"
                ).value,

            estado:
                document.getElementById(
                    "estadoArmaLetal"
                ).value

        };

    }


    if (tipo === "no_letal") {

        return {

            tipo: "Arma no letal",

            arma:
                document.getElementById(
                    "tipoArmaNoLetal"
                ).value,

            serial:
                document.getElementById(
                    "serialArmaNoLetal"
                ).value.trim(),

            cantidad:
                document.getElementById(
                    "cantidadNoLetal"
                ).value,

            estado:
                document.getElementById(
                    "estadoArmaNoLetal"
                ).value

        };

    }


    return {

        tipo: ""

    };

}


/* ==========================================================
   15. LIMPIAR FORMULARIO
========================================================== */

btnLimpiar.addEventListener(
    "click",
    () => {

        // Apaga la cámara.
        detenerCamara();


        // Oculta campos adicionales.
        if (otraEmpresa) {

            otraEmpresa.hidden = true;

        }


        if (otraEmpresaEntrega) {

            otraEmpresaEntrega.hidden = true;

        }


        // Oculta armamento.
        datosArmaLetal.hidden = true;

        datosArmaNoLetal.hidden = true;


        // Reinicia selfie.
        vistaSelfie.hidden = true;

        vistaCamara.hidden = true;

        btnRepetirSelfie.hidden = true;

        btnTomarSelfie.disabled = true;


        // Reinicia botón.
        btnActivarCamara.textContent =
            "Activar cámara";


        // Mensaje.
        estadoSelfie.textContent =
            "Debe capturar una selfie para continuar.";


        // Actualiza fecha y hora.
        cargarFechaHora();

    }
);