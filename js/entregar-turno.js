/* ==========================================================
   PROYECTO : MINUTA DIGITAL 360
   ARCHIVO  : recibir-turno.js

   DESCRIPCIÓN:
   Controla el módulo de recepción de turno.

   FUNCIONES:
   - Fecha y hora automáticas.
   - Selección de quien entrega.
   - Registro de otro personal.
   - Activación de cámara.
   - Vista previa de cámara.
   - Captura de selfie.
   - Validación de la selfie.
   - Control de armamento.
   - Validación del formulario.
   - Limpieza del formulario.

   AUTOR:
   Richard Duvan Gelves Laguado

   FECHA:
   2026
========================================================== */

"use strict";


/* ==========================================================
   01. INICIALIZACIÓN
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    inicializarRecibirTurno
);


/* ==========================================================
   02. FUNCIÓN PRINCIPAL
========================================================== */

function inicializarRecibirTurno() {

    const formulario =
        document.getElementById("formulario-recibir-turno");

    if (!formulario) {

        console.error(
            "No se encontró el formulario de recepción de turno."
        );

        return;
    }


    /* ======================================================
       ELEMENTOS GENERALES
    ====================================================== */

    const campoFecha =
        document.getElementById("fecha");

    const campoHora =
        document.getElementById("hora");

    const btnLimpiar =
        document.getElementById("btnLimpiar");


    /* ======================================================
       INFORMACIÓN DE QUIEN ENTREGA
    ====================================================== */

    const nombreEntrega =
        document.getElementById("nombreEntrega");

    const cargoEntrega =
        document.getElementById("cargoEntrega");

    const contenedorOtroPersonal =
        document.getElementById("contenedorOtroPersonal");

    const otroPersonal =
        document.getElementById("otroPersonal");


    /* ======================================================
       ELEMENTOS DE LA CÁMARA
    ====================================================== */

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


    /* ======================================================
       ELEMENTOS DE ARMAMENTO
    ====================================================== */

    const tipoArmamento =
        document.getElementById("tipoArmamento");

    const datosArmaLetal =
        document.getElementById("datosArmaLetal");

    const datosArmaNoLetal =
        document.getElementById("datosArmaNoLetal");

    const tipoArmaLetal =
        document.getElementById("tipoArmaLetal");

    const serialArma =
        document.getElementById("serialArma");

    const municion =
        document.getElementById("municion");

    const estadoArmaLetal =
        document.getElementById("estadoArmaLetal");

    const tipoArmaNoLetal =
        document.getElementById("tipoArmaNoLetal");

    const cartuchosNoLetales =
        document.getElementById("cartuchosNoLetales");

    const estadoArmaNoLetal =
        document.getElementById("estadoArmaNoLetal");


    /* ======================================================
       VALIDACIÓN DE ELEMENTOS PRINCIPALES
    ====================================================== */

    const elementosPrincipales = {

        campoFecha,
        campoHora,
        btnLimpiar,

        vistaCamara,
        vistaSelfie,
        canvasSelfie,
        estadoSelfie,

        btnActivarCamara,
        btnTomarSelfie,
        btnRepetirSelfie

    };


    const elementosFaltantes = [];


    Object.entries(
        elementosPrincipales
    ).forEach(
        ([nombre, elemento]) => {

            if (!elemento) {

                elementosFaltantes.push(nombre);

            }

        }
    );


    if (elementosFaltantes.length > 0) {

        console.error(
            "Faltan elementos principales:",
            elementosFaltantes
        );

        return;
    }


    /* ======================================================
       VARIABLES DEL MÓDULO
    ====================================================== */

    let flujoCamara = null;

    let archivoSelfie = null;

    let selfieCapturada = false;


    /* ==========================================================
       03. FECHA Y HORA
    ========================================================== */

    establecerFechaHora();


    function establecerFechaHora() {

        const ahora = new Date();

        const anio =
            ahora.getFullYear();

        const mes =
            String(
                ahora.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                ahora.getDate()
            ).padStart(2, "0");

        const hora =
            String(
                ahora.getHours()
            ).padStart(2, "0");

        const minutos =
            String(
                ahora.getMinutes()
            ).padStart(2, "0");

        campoFecha.value =
            `${anio}-${mes}-${dia}`;

        campoHora.value =
            `${hora}:${minutos}`;
    }


    /* ==========================================================
       04. CONTROL DE QUIEN ENTREGA
    ========================================================== */

    if (
        nombreEntrega &&
        contenedorOtroPersonal &&
        otroPersonal
    ) {

        nombreEntrega.addEventListener(
            "change",
            controlarOtroPersonal
        );


        function controlarOtroPersonal() {

            const esOtroPersonal =
                nombreEntrega.value === "otro";


            contenedorOtroPersonal.hidden =
                !esOtroPersonal;


            otroPersonal.required =
                esOtroPersonal;


            if (!esOtroPersonal) {

                otroPersonal.value = "";

            }

        }


        controlarOtroPersonal();

    }


    /* ==========================================================
       05. CONTROL DE ARMAMENTO
    ========================================================== */

    if (
        tipoArmamento &&
        datosArmaLetal &&
        datosArmaNoLetal
    ) {

        tipoArmamento.addEventListener(
            "change",
            actualizarArmamento
        );


        function actualizarArmamento() {

            datosArmaLetal.hidden = true;

            datosArmaNoLetal.hidden = true;


            cambiarObligatoriedadArmamento(
                false,
                [
                    tipoArmaLetal,
                    serialArma,
                    municion,
                    estadoArmaLetal,
                    tipoArmaNoLetal,
                    cartuchosNoLetales,
                    estadoArmaNoLetal
                ]
            );


            limpiarCamposOcultos();


            /* ==============================================
               ARMA LETAL
            ============================================== */

            if (
                tipoArmamento.value === "letal"
            ) {

                datosArmaLetal.hidden = false;

                cambiarObligatoriedadArmamento(
                    true,
                    [
                        tipoArmaLetal,
                        serialArma,
                        municion,
                        estadoArmaLetal
                    ]
                );

            }


            /* ==============================================
               ARMA NO LETAL
            ============================================== */

            if (
                tipoArmamento.value === "no_letal"
            ) {

                datosArmaNoLetal.hidden = false;

                cambiarObligatoriedadArmamento(
                    true,
                    [
                        tipoArmaNoLetal,
                        cartuchosNoLetales,
                        estadoArmaNoLetal
                    ]
                );

            }

        }


        function cambiarObligatoriedadArmamento(
            obligatorio,
            campos
        ) {

            campos.forEach(
                campo => {

                    if (campo) {

                        campo.required =
                            obligatorio;

                    }

                }
            );

        }


        function limpiarCamposOcultos() {

            if (datosArmaLetal.hidden) {

                if (tipoArmaLetal) {
                    tipoArmaLetal.value = "";
                }

                if (serialArma) {
                    serialArma.value = "";
                }

                if (municion) {
                    municion.value = "";
                }

                if (estadoArmaLetal) {
                    estadoArmaLetal.value = "";
                }

            }


            if (datosArmaNoLetal.hidden) {

                if (tipoArmaNoLetal) {
                    tipoArmaNoLetal.value = "";
                }

                if (cartuchosNoLetales) {
                    cartuchosNoLetales.value = "";
                }

                if (estadoArmaNoLetal) {
                    estadoArmaNoLetal.value = "";
                }

            }

        }


        actualizarArmamento();

    }


    /* ==========================================================
       06. ACTIVAR CÁMARA
    ========================================================== */

    btnActivarCamara.addEventListener(
        "click",
        activarCamara
    );


    async function activarCamara() {

        try {

            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {

                mostrarError(
                    "Este navegador no permite utilizar la cámara."
                );

                return;
            }


            detenerCamara();


            flujoCamara =
                await navigator.mediaDevices.getUserMedia({

                    video: {

                        facingMode: {
                            ideal: "user"
                        },

                        width: {
                            ideal: 1280
                        },

                        height: {
                            ideal: 720
                        }

                    },

                    audio: false

                });


            /* ==============================================
               ASIGNAR LA CÁMARA AL VIDEO
            ============================================== */

            vistaCamara.srcObject =
                flujoCamara;


            vistaCamara.hidden =
                false;


            vistaSelfie.hidden =
                true;


            /* ==============================================
               ESPERAR A QUE EL VIDEO TENGA DATOS
            ============================================== */

            await esperarVideo();


            /* ==============================================
               INICIAR REPRODUCCIÓN
            ============================================== */

            try {

                await vistaCamara.play();

            } catch (error) {

                console.error(
                    "No fue posible reproducir el video:",
                    error
                );

                mostrarError(
                    "La cámara fue activada, pero no fue posible mostrar la imagen."
                );

                return;
            }


            /* ==============================================
               HABILITAR BOTÓN DE SELFIE
            ============================================== */

            btnTomarSelfie.disabled =
                false;


            btnActivarCamara.innerHTML = `

                <i
                    class="fa-solid fa-video"
                    aria-hidden="true">
                </i>

                Cámara activa

            `;


            actualizarEstado(
                "info",
                "Cámara activa. Ubique su rostro dentro del encuadre."
            );

        }

        catch (error) {

            console.error(
                "Error al acceder a la cámara:",
                error
            );


            if (
                error.name === "NotAllowedError"
            ) {

                mostrarError(
                    "Permiso de cámara denegado. Autorice el acceso a la cámara."
                );

                return;
            }


            if (
                error.name === "NotFoundError"
            ) {

                mostrarError(
                    "No se encontró ninguna cámara disponible."
                );

                return;
            }


            if (
                error.name === "NotReadableError"
            ) {

                mostrarError(
                    "La cámara está siendo utilizada por otra aplicación."
                );

                return;
            }


            mostrarError(
                "No fue posible activar la cámara."
            );

        }

    }


    /* ==========================================================
       07. ESPERAR VIDEO
    ========================================================== */

    function esperarVideo() {

        return new Promise(
            (resolve, reject) => {

                if (
                    vistaCamara.readyState >= 2 &&
                    vistaCamara.videoWidth > 0
                ) {

                    resolve();

                    return;
                }


                const tiempoMaximo =
                    setTimeout(
                        () => {

                            reject(
                                new Error(
                                    "La cámara no entregó imagen."
                                )
                            );

                        },
                        5000
                    );


                vistaCamara.onloadedmetadata = () => {

                    clearTimeout(
                        tiempoMaximo
                    );

                    resolve();

                };

            }
        );

    }


    /* ==========================================================
       08. TOMAR SELFIE
    ========================================================== */

    btnTomarSelfie.addEventListener(
        "click",
        tomarSelfie
    );


    function tomarSelfie() {

        if (
            !flujoCamara ||
            !vistaCamara.videoWidth ||
            !vistaCamara.videoHeight
        ) {

            mostrarError(
                "Active la cámara y espere a que aparezca la imagen antes de tomar la selfie."
            );

            return;
        }


        const ancho =
            vistaCamara.videoWidth;

        const alto =
            vistaCamara.videoHeight;


        canvasSelfie.width =
            ancho;

        canvasSelfie.height =
            alto;


        const contexto =
            canvasSelfie.getContext("2d");


        if (!contexto) {

            mostrarError(
                "No fue posible preparar la captura."
            );

            return;
        }


        contexto.clearRect(
            0,
            0,
            ancho,
            alto
        );


        /* ==============================================
           EFECTO ESPEJO
        ============================================== */

        contexto.save();

        contexto.translate(
            ancho,
            0
        );

        contexto.scale(
            -1,
            1
        );


        contexto.drawImage(
            vistaCamara,
            0,
            0,
            ancho,
            alto
        );


        contexto.restore();


        /* ==============================================
           CREAR IMAGEN
        ============================================== */

        const imagenBase64 =
            canvasSelfie.toDataURL(
                "image/jpeg",
                0.90
            );


        vistaSelfie.src =
            imagenBase64;

        vistaSelfie.hidden =
            false;


        vistaCamara.hidden =
            true;


        detenerCamara();


        selfieCapturada =
            true;


        archivoSelfie =
            convertirBase64AArchivo(
                imagenBase64
            );


        btnTomarSelfie.disabled =
            true;

        btnRepetirSelfie.hidden =
            false;


        actualizarEstado(
            "exito",
            "Selfie capturada correctamente. Puede continuar con la recepción del turno."
        );

    }


    /* ==========================================================
       09. REPETIR SELFIE
    ========================================================== */

    btnRepetirSelfie.addEventListener(
        "click",
        repetirSelfie
    );


    async function repetirSelfie() {

        selfieCapturada =
            false;

        archivoSelfie =
            null;


        vistaSelfie.hidden =
            true;


        btnRepetirSelfie.hidden =
            true;


        actualizarEstado(
            "info",
            "Activando cámara..."
        );


        await activarCamara();

    }


    /* ==========================================================
       10. CONVERTIR BASE64 A ARCHIVO
    ========================================================== */

    function convertirBase64AArchivo(
        base64
    ) {

        const partes =
            base64.split(",");


        const coincidencia =
            partes[0].match(
                /:(.*?);/
            );


        if (!coincidencia) {

            return null;

        }


        const tipo =
            coincidencia[1];


        const datos =
            atob(
                partes[1]
            );


        const arreglo =
            new Uint8Array(
                datos.length
            );


        for (
            let i = 0;
            i < datos.length;
            i++
        ) {

            arreglo[i] =
                datos.charCodeAt(i);

        }


        return new File(

            [arreglo],

            `selfie-recepcion-${Date.now()}.jpg`,

            {
                type: tipo
            }

        );

    }


    /* ==========================================================
       11. DETENER CÁMARA
    ========================================================== */

    function detenerCamara() {

        if (!flujoCamara) {

            return;
        }


        flujoCamara
            .getTracks()
            .forEach(
                pista => pista.stop()
            );


        flujoCamara =
            null;


        vistaCamara.srcObject =
            null;


        btnTomarSelfie.disabled =
            true;

    }


    /* ==========================================================
       12. ACTUALIZAR ESTADO DE LA SELFIE
    ========================================================== */

    function actualizarEstado(
        tipo,
        mensaje
    ) {

        estadoSelfie.classList.remove(
            "exito",
            "error"
        );


        let icono =
            "fa-circle-info";


        if (
            tipo === "exito"
        ) {

            estadoSelfie.classList.add(
                "exito"
            );

            icono =
                "fa-circle-check";

        }


        if (
            tipo === "error"
        ) {

            estadoSelfie.classList.add(
                "error"
            );

            icono =
                "fa-circle-exclamation";

        }


        estadoSelfie.innerHTML = `

            <i
                class="fa-solid ${icono}"
                aria-hidden="true">
            </i>

            <span>
                ${mensaje}
            </span>

        `;

    }


    /* ==========================================================
       13. MOSTRAR ERROR
    ========================================================== */

    function mostrarError(
        mensaje
    ) {

        actualizarEstado(
            "error",
            mensaje
        );

    }


    /* ==========================================================
       14. CONFIRMAR RECEPCIÓN
    ========================================================== */

    formulario.addEventListener(
        "submit",
        manejarEnvio
    );


    function manejarEnvio(
        evento
    ) {

        evento.preventDefault();


        /* ==============================================
           VALIDAR FORMULARIO
        ============================================== */

        if (
            !formulario.checkValidity()
        ) {

            formulario.reportValidity();

            return;

        }


        /* ==============================================
           VALIDAR SELFIE
        ============================================== */

        if (
            !selfieCapturada ||
            !archivoSelfie
        ) {

            mostrarError(
                "Debe capturar una selfie antes de confirmar la recepción del turno."
            );


            const tituloSelfie =
                document.getElementById(
                    "titulo-selfie"
                );


            if (tituloSelfie) {

                tituloSelfie.scrollIntoView({

                    behavior: "smooth",

                    block: "center"

                });

            }


            return;

        }


        /* ==============================================
           CREAR DATOS
        ============================================== */

        const datos =
            new FormData(
                formulario
            );


        /* ==============================================
           SI SELECCIONÓ "OTRO PERSONAL"
        ============================================== */

        if (
            nombreEntrega &&
            nombreEntrega.value === "otro"
        ) {

            const nombreManual =
                otroPersonal.value.trim();


            if (!nombreManual) {

                otroPersonal.focus();

                mostrarError(
                    "Ingrese el nombre completo de la persona que entrega."
                );

                return;

            }


            datos.set(
                "nombreEntrega",
                nombreManual
            );

        }


        /* ==============================================
           AGREGAR SELFIE
        ============================================== */

        datos.append(
            "selfie",
            archivoSelfie
        );


        /* ==============================================
           MOSTRAR DATOS TEMPORALMENTE
        ============================================== */

        console.log(
            "Recepción de turno:",
            Object.fromEntries(
                datos.entries()
            )
        );


        /* ==============================================
           CONFIRMACIÓN TEMPORAL
        ============================================== */

        mostrarEstadoFormulario(
            "success",
            "Recepción de turno validada correctamente."
        );

    }


    /* ==========================================================
       15. MENSAJE DE CONFIRMACIÓN
    ========================================================== */

    function mostrarEstadoFormulario(
        tipo,
        mensaje
    ) {

        let contenedor =
            document.getElementById(
                "mensaje-recepcion"
            );


        if (!contenedor) {

            contenedor =
                document.createElement(
                    "div"
                );


            contenedor.id =
                "mensaje-recepcion";


            contenedor.className =
                "mensaje-recepcion";


            contenedor.setAttribute(
                "role",
                "status"
            );


            formulario.prepend(
                contenedor
            );

        }


        contenedor.className =
            `mensaje-recepcion ${tipo}`;


        contenedor.textContent =
            mensaje;

    }


    /* ==========================================================
       16. LIMPIAR FORMULARIO
    ========================================================== */

    formulario.addEventListener(
        "reset",
        manejarLimpieza
    );


    function manejarLimpieza() {

        setTimeout(
            () => {

                detenerCamara();


                selfieCapturada =
                    false;

                archivoSelfie =
                    null;


                vistaSelfie.hidden =
                    true;


                vistaCamara.hidden =
                    true;


                btnRepetirSelfie.hidden =
                    true;


                btnActivarCamara.innerHTML = `

                    <i
                        class="fa-solid fa-video"
                        aria-hidden="true">
                    </i>

                    Activar cámara

                `;


                if (nombreEntrega) {

                    nombreEntrega.value =
                        "";

                }


                if (otroPersonal) {

                    otroPersonal.value =
                        "";

                    otroPersonal.required =
                        false;

                }


                if (contenedorOtroPersonal) {

                    contenedorOtroPersonal.hidden =
                        true;

                }


                if (cargoEntrega) {

                    cargoEntrega.value =
                        "";

                }


                if (tipoArmamento) {

                    tipoArmamento.value =
                        "";

                    actualizarArmamento();

                }


                actualizarEstado(
                    "info",
                    "Debe capturar una selfie para continuar."
                );


                establecerFechaHora();


            },
            0
        );

    }


    /* ==========================================================
       17. CERRAR CÁMARA AL SALIR
    ========================================================== */

    window.addEventListener(
        "beforeunload",
        detenerCamara
    );

}