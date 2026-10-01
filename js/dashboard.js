/* ==========================================================
   PROYECTO : MINUTA DIGITAL 360
   ARCHIVO  : dashboard.js
   DESCRIPCIÓN:
   Muestra la información del usuario, turno y novedades.
========================================================== */


/* ==========================================================
   01. INICIAR DASHBOARD
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    aplicarConfiguracion();

    mostrarFecha();

    mostrarSaludo();

    mostrarUsuario();

    mostrarTurno();

    mostrarNovedadesPendientes();

    cerrarSesion();

});


/* ==========================================================
   02. MOSTRAR FECHA
========================================================== */

function mostrarFecha() {

    // Busca dónde mostrar la fecha.
    const fecha =
        document.getElementById("fechaActual");


    if (!fecha) return;


    // Obtiene la fecha actual.
    const hoy = new Date();


    // Formato de fecha en español.
    const texto =
        hoy.toLocaleDateString(
            "es-CO",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );


    // Muestra la fecha con la primera letra en mayúscula.
    fecha.textContent =
        texto.charAt(0).toUpperCase() +
        texto.slice(1);

}


/* ==========================================================
   03. MOSTRAR SALUDO
========================================================== */

function mostrarSaludo() {

    // Busca el mensaje del encabezado.
    const saludo =
        document.querySelector(
            ".encabezado-dashboard p"
        );


    if (!saludo) return;


    // Obtiene la hora actual.
    const hora =
        new Date().getHours();


    let mensaje;


    if (hora < 12) {

        mensaje =
            "Buenos días";

    } else if (hora < 18) {

        mensaje =
            "Buenas tardes";

    } else {

        mensaje =
            "Buenas noches";
    }


    // Muestra el saludo.
    saludo.textContent =
        `${mensaje}, bienvenido a Minuta Digital 360`;

}


/* ==========================================================
   04. MOSTRAR USUARIO
========================================================== */

function mostrarUsuario() {

    // Recupera los datos del usuario.
    const usuario =
        obtenerUsuario();


    // Si no hay sesión, vuelve al Login.
    if (!usuario) {

        window.location.href =
            "./login.html";

        return;
    }


    // Muestra el nombre.
    const nombreMenu =
        document.getElementById(
            "nombreUsuarioMenu"
        );

    if (nombreMenu) {

        nombreMenu.textContent =
            usuario.nombre || "Usuario";
    }


    // Muestra el rol.
    const rolMenu =
        document.getElementById(
            "rolUsuarioMenu"
        );

    if (rolMenu) {

        rolMenu.textContent =
            usuario.rol || "Sin rol";
    }


    // Muestra el nombre en el contenido.
    const nombre =
        document.getElementById(
            "nombreUsuario"
        );

    if (nombre) {

        nombre.textContent =
            usuario.nombre || "Usuario";
    }


    // Muestra el rol en el contenido.
    const rol =
        document.getElementById(
            "rolUsuario"
        );

    if (rol) {

        rol.textContent =
            usuario.rol || "Sin rol";
    }

}


/* ==========================================================
   05. MOSTRAR TURNO
========================================================== */

function mostrarTurno() {

    // Recupera el turno actual.
    const turno =
        obtenerTurno();


    const estado =
        document.getElementById(
            "estadoTurno"
        );


    const puesto =
        document.getElementById(
            "puestoActual"
        );


    const duracion =
        document.getElementById(
            "duracionTurno"
        );


    /*
       Si existe un turno registrado,
       muestra sus datos.
    */

    if (turno) {

        if (estado) {

            estado.textContent =
                turno.estado || "Activo";
        }


        if (puesto) {

            puesto.textContent =
                turno.puesto || "No asignado";
        }


        if (duracion) {

            duracion.textContent =
                `${turno.duracion || 0} horas`;
        }


        return;
    }


    /*
       Si todavía no existe un turno,
       muestra el estado inicial.
    */

    const usuario =
        obtenerUsuario();


    if (estado) {

        estado.textContent =
            "Sin iniciar";
    }


    if (puesto) {

        puesto.textContent =
            usuario?.puesto || "No asignado";
    }


    if (duracion) {

        duracion.textContent =
            "0 horas";
    }

}


/* ==========================================================
   06. MOSTRAR NOVEDADES PENDIENTES
========================================================== */

function mostrarNovedadesPendientes() {

    // Busca el contador de pendientes.
    const contador =
        document.getElementById(
            "novedadesPendientes"
        );


    if (!contador) return;


    /*
       Recupera las novedades guardadas
       desde minuta.js.
    */

    const novedades =
        JSON.parse(
            localStorage.getItem(
                "novedades"
            )
        ) || [];


    // Cuenta únicamente las pendientes.
    const pendientes =
        novedades.filter(
            novedad =>
                novedad.estado === "Pendiente"
        ).length;


    // Muestra el total.
    contador.textContent =
        pendientes;
}


/* ==========================================================
   07. OBTENER USUARIO
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
   08. OBTENER TURNO
========================================================== */

function obtenerTurno() {

    try {

        return JSON.parse(
            sessionStorage.getItem(
                "turnoActual"
            )
        );

    } catch (error) {

        console.error(
            "No fue posible leer el turno.",
            error
        );

        return null;
    }

}


/* ==========================================================
   09. CERRAR SESIÓN
========================================================== */

function cerrarSesion() {

    // Busca el botón.
    const boton =
        document.getElementById(
            "btnCerrarSesion"
        );


    if (!boton) return;


    boton.addEventListener(
        "click",
        (evento) => {

            // Pide confirmación.
            const confirmar =
                confirm(
                    "¿Está seguro de que desea cerrar sesión?"
                );


            // Si cancela, permanece en el Dashboard.
            if (!confirmar) {

                evento.preventDefault();

                return;
            }


            // Elimina la sesión.
            sessionStorage.removeItem(
                "usuario"
            );


            // Elimina el turno actual.
            sessionStorage.removeItem(
                "turnoActual"
            );

        }
    );

}

/* ==========================================================
   10. APLICAR CONFIGURACIÓN
========================================================== */

function aplicarConfiguracion() {

    const configuracion =
        JSON.parse(
            localStorage.getItem("configuracion")
        );

    if (!configuracion) {

        return;
    }


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
