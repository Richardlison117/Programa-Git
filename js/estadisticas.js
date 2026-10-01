/* ==========================================================
   PROYECTO : MINUTA DIGITAL 360
   ARCHIVO  : estadisticas.js

   DESCRIPCIÓN:
   Genera estadísticas e indicadores de las novedades.
========================================================== */

"use strict";


/* ==========================================================
   01. ELEMENTOS
========================================================== */

const totalNovedades =
    document.getElementById("totalNovedades");

const novedadesHoy =
    document.getElementById("novedadesHoy");

const novedadesPendientes =
    document.getElementById("novedadesPendientes");

const porcentajeAtencion =
    document.getElementById("porcentajeAtencion");

const textoAlerta =
    document.getElementById("textoAlerta");

const detalleAlerta =
    document.getElementById("detalleAlerta");

const zonaFrecuente =
    document.getElementById("zonaFrecuente");

const tipoFrecuente =
    document.getElementById("tipoFrecuente");

const usuarioFrecuente =
    document.getElementById("usuarioFrecuente");

const periodo =
    document.getElementById("periodo");

const analizarPor =
    document.getElementById("analizarPor");

const fechaInicio =
    document.getElementById("fechaInicio");

const fechaFin =
    document.getElementById("fechaFin");

const btnActualizar =
    document.getElementById("btnActualizar");

const btnLimpiar =
    document.getElementById("btnLimpiar");

const textoGrafica =
    document.getElementById("textoGrafica");

const totalGrafica =
    document.getElementById("totalGrafica");

const sinDatos =
    document.getElementById("sinDatos");

const canvas =
    document.getElementById("graficaNovedades");


/* ==========================================================
   02. VARIABLES
========================================================== */

let novedades = [];

let grafica = null;


/* ==========================================================
   03. INICIAR
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciar
);


function iniciar() {

    cargarNovedades();

    establecerFechas();

    actualizarTodo();

    prepararEventos();

}


/* ==========================================================
   04. CARGAR DATOS
========================================================== */

function cargarNovedades() {

    novedades =
        JSON.parse(
            localStorage.getItem(
                "novedades"
            )
        ) || [];

}


/* ==========================================================
   05. FECHAS
========================================================== */

function establecerFechas() {

    const hoy =
        new Date();

    const inicio =
        new Date();

    inicio.setDate(
        hoy.getDate() - 30
    );


    fechaFin.value =
        convertirFecha(hoy);

    fechaInicio.value =
        convertirFecha(inicio);

}


/* ==========================================================
   06. EVENTOS
========================================================== */

function prepararEventos() {

    periodo.addEventListener(
        "change",
        actualizarGrafica
    );


    analizarPor.addEventListener(
        "change",
        actualizarGrafica
    );


    fechaInicio.addEventListener(
        "change",
        actualizarGrafica
    );


    fechaFin.addEventListener(
        "change",
        actualizarGrafica
    );


    btnActualizar.addEventListener(
        "click",
        () => {

            cargarNovedades();

            actualizarTodo();

        }
    );


    btnLimpiar.addEventListener(
        "click",
        () => {

            establecerFechas();

            periodo.value =
                "diario";

            analizarPor.value =
                "tipo";

            actualizarTodo();

        }
    );

}


/* ==========================================================
   07. ACTUALIZAR TODO
========================================================== */

function actualizarTodo() {

    actualizarIndicadores();

    actualizarAlerta();

    actualizarResumen();

    actualizarGrafica();

}


/* ==========================================================
   08. INDICADORES
========================================================== */

function actualizarIndicadores() {

    const hoy =
        convertirFecha(
            new Date()
        );


    const deHoy =
        novedades.filter(
            novedad =>
                novedad.fecha === hoy
        ).length;


    const pendientes =
        novedades.filter(
            novedad =>
                novedad.estado === "Pendiente"
        ).length;


    const cerradas =
        novedades.filter(
            novedad =>
                novedad.estado === "Cerrada"
        ).length;


    const atencion =
        novedades.length
            ? Math.round(
                (
                    cerradas /
                    novedades.length
                ) * 100
            )
            : 0;


    totalNovedades.textContent =
        novedades.length;


    novedadesHoy.textContent =
        deHoy;


    novedadesPendientes.textContent =
        pendientes;


    porcentajeAtencion.textContent =
        `${atencion}%`;

}


/* ==========================================================
   09. ALERTA INTELIGENTE
========================================================== */

function actualizarAlerta() {

    if (novedades.length === 0) {

        textoAlerta.textContent =
            "Sin novedades registradas.";

        detalleAlerta.textContent =
            "El sistema mostrará aquí la novedad más frecuente.";

        return;
    }


    const conteo =
        contarPorCampo(
            novedades,
            "tipo"
        );


    const principal =
        obtenerMayor(
            conteo
        );


    const nombre =
        obtenerTextoTipo(
            principal.nombre
        );


    textoAlerta.textContent =
        `La novedad más frecuente es: ${nombre}.`;


    detalleAlerta.textContent =
        `Se han registrado ${principal.cantidad} casos de este tipo.`;

}


/* ==========================================================
   10. RESUMEN OPERATIVO
========================================================== */

function actualizarResumen() {

    if (novedades.length === 0) {

        zonaFrecuente.textContent =
            "Sin datos";

        tipoFrecuente.textContent =
            "Sin datos";

        usuarioFrecuente.textContent =
            "Sin datos";

        return;
    }


    const zonas =
        contarPorCampo(
            novedades,
            "ubicacion"
        );


    const tipos =
        contarPorCampo(
            novedades,
            "tipo"
        );


    const usuarios =
        contarPorCampo(
            novedades,
            "usuario"
        );


    zonaFrecuente.textContent =
        obtenerMayor(
            zonas
        ).nombre || "Sin datos";


    tipoFrecuente.textContent =
        obtenerTextoTipo(
            obtenerMayor(tipos).nombre
        );


    usuarioFrecuente.textContent =
        obtenerMayor(
            usuarios
        ).nombre || "Sin datos";

}


/* ==========================================================
   11. ACTUALIZAR GRÁFICA
========================================================== */

function actualizarGrafica() {

    const registros =
        obtenerRegistrosFiltrados();


    if (
        registros.length === 0
    ) {

        destruirGrafica();

        totalGrafica.textContent =
            "0";

        textoGrafica.textContent =
            "No existen registros para el período seleccionado.";

        sinDatos.hidden =
            false;

        return;
    }


    sinDatos.hidden =
        true;


    totalGrafica.textContent =
        registros.length;


    const agrupacion =
        crearAgrupacion(
            registros
        );


    textoGrafica.textContent =
        crearDescripcionGrafica();


    crearGrafica(
        agrupacion
    );

}


/* ==========================================================
   12. FILTRAR REGISTROS
========================================================== */

function obtenerRegistrosFiltrados() {

    let resultado =
        [...novedades];


    const inicio =
        fechaInicio.value;

    const fin =
        fechaFin.value;


    if (inicio) {

        resultado =
            resultado.filter(
                novedad =>
                    novedad.fecha >=
                    inicio
            );

    }


    if (fin) {

        resultado =
            resultado.filter(
                novedad =>
                    novedad.fecha <=
                    fin
            );

    }


    return resultado;

}


/* ==========================================================
   13. CREAR AGRUPACIÓN
========================================================== */

function crearAgrupacion(
    registros
) {

    const campo =
        analizarPor.value;


    /*
       Para diario, semanal, mensual y anual
       usamos el período como eje principal.
    */

    const conteos = {};


    registros.forEach(
        novedad => {

            let clave;


            if (campo === "tipo") {

                clave =
                    obtenerTextoTipo(
                        novedad.tipo
                    );

            } else {

                clave =
                    novedad[campo] ||
                    "Sin información";

            }


            conteos[clave] =
                (
                    conteos[clave] ||
                    0
                ) + 1;

        }
    );


    const ordenado =
        Object.entries(
            conteos
        )
        .sort(
            (a, b) =>
                b[1] - a[1]
        );


    return {

        etiquetas:
            ordenado.map(
                item => item[0]
            ),

        valores:
            ordenado.map(
                item => item[1]
            )

    };

}


/* ==========================================================
   14. CREAR GRÁFICA
========================================================== */

function crearGrafica(
    datos
) {

    destruirGrafica();


    grafica =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels:
                        datos.etiquetas,

                    datasets: [

                        {

                            label:
                                obtenerEtiquetaCampo(),

                            data:
                                datos.valores,

                            borderWidth: 1,

                            borderRadius: 8

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: true

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                precision: 0

                            }

                        }

                    }

                }

            }
        );

}


/* ==========================================================
   15. DESTRUIR GRÁFICA
========================================================== */

function destruirGrafica() {

    if (grafica) {

        grafica.destroy();

        grafica =
            null;

    }

}


/* ==========================================================
   16. CONTAR POR CAMPO
========================================================== */

function contarPorCampo(
    registros,
    campo
) {

    const resultado = {};


    registros.forEach(
        novedad => {

            const valor =
                novedad[campo] ||
                "Sin información";


            resultado[valor] =
                (
                    resultado[valor] ||
                    0
                ) + 1;

        }
    );


    return resultado;

}


/* ==========================================================
   17. OBTENER MAYOR
========================================================== */

function obtenerMayor(
    objeto
) {

    const elementos =
        Object.entries(
            objeto
        );


    if (
        elementos.length === 0
    ) {

        return {

            nombre: "",

            cantidad: 0

        };

    }


    const mayor =
        elementos.sort(
            (a, b) =>
                b[1] - a[1]
        )[0];


    return {

        nombre: mayor[0],

        cantidad: mayor[1]

    };

}


/* ==========================================================
   18. NOMBRE DEL TIPO
========================================================== */

function obtenerTextoTipo(
    tipo
) {

    const tipos = {

        hurto:
            "Hurto",

        accidente:
            "Accidente",

        persona_sospechosa:
            "Persona sospechosa",

        rina:
            "Riña",

        incendio:
            "Incendio",

        emergencia_medica:
            "Emergencia médica",

        objeto_perdido:
            "Objeto perdido",

        dano_tecnico:
            "Daño técnico",

        apoyo_local:
            "Apoyo a local",

        apertura:
            "Apertura",

        cierre:
            "Cierre",

        ronda_vigilancia:
            "Ronda de vigilancia",

        visita_autoridad:
            "Visita de autoridad",

        otro:
            "Otro"

    };


    return tipos[tipo] ||
        tipo ||
        "Sin información";

}


/* ==========================================================
   19. ETIQUETA DE LA GRÁFICA
========================================================== */

function obtenerEtiquetaCampo() {

    const etiquetas = {

        tipo:
            "Tipo de novedad",

        estado:
            "Estado",

        ubicacion:
            "Ubicación",

        lugar:
            "Lugar",

        usuario:
            "Usuario"

    };


    return etiquetas[
        analizarPor.value
    ] || "Registros";

}


/* ==========================================================
   20. DESCRIPCIÓN
========================================================== */

function crearDescripcionGrafica() {

    const nombresPeriodo = {

        diario:
            "diario",

        semanal:
            "semanal",

        mensual:
            "mensual",

        anual:
            "anual"

    };


    return `Análisis ${nombresPeriodo[periodo.value]} por ${obtenerEtiquetaCampo().toLowerCase()}.`;

}


/* ==========================================================
   21. CONVERTIR FECHA
========================================================== */

function convertirFecha(
    fecha
) {

    const año =
        fecha.getFullYear();


    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            fecha.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${año}-${mes}-${dia}`;

}