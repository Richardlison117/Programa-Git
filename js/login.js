/* ==========================================================
   PROYECTO : MINUTA DIGITAL 360
   ARCHIVO  : login.js
   DESCRIPCIÓN:
   Controla el inicio de sesión y guarda los datos del usuario.
========================================================== */


/* ==========================================================
   01. ELEMENTOS DEL LOGIN
========================================================== */

const formulario =
    document.getElementById("formulario-login");

const usuario =
    document.getElementById("usuario");

const password =
    document.getElementById("password");

const recordarme =
    document.getElementById("recordarme");

const mensaje =
    document.getElementById("mensaje-login");

const botonLogin =
    document.getElementById("btn-login");


/* ==========================================================
   02. USUARIOS DE PRUEBA
========================================================== */

// Datos temporales.
// Después serán consultados desde la base de datos.

const usuarios = [

    {
        usuario: "apolo 3",
        password: "1234",
        nombre: "Apolo 3",
        documento: "1000000003",
        cargo: "Guarda de Seguridad",
        empresa: "C.C. Ventura Plaza",
        puesto: "Apolo 3",
        rol: "Guarda de Seguridad"
    },

    {
        usuario: "orion",
        password: "1234",
        nombre: "Orion",
        documento: "1000000001",
        cargo: "Jefe de Seguridad",
        empresa: "C.C. Ventura Plaza",
        puesto: "Orion",
        rol: "Jefe de Seguridad"
    },

    {
        usuario: "apolo",
        password: "1234",
        nombre: "Apolo",
        documento: "1000000002",
        cargo: "Coordinador",
        empresa: "Coopsercivicos",
        puesto: "Apolo",
        rol: "Coordinador"
    },

    {
        usuario: "mercurio",
        password: "1234",
        nombre: "Mercurio",
        documento: "1000000004",
        cargo: "Operador de CCTV",
        empresa: "C.C. Ventura Plaza",
        puesto: "Mercurio",
        rol: "Operador de CCTV"
    },

    {
        usuario: "administrativo",
        password: "1234",
        nombre: "Soporte Administrativo",
        documento: "1000000005",
        cargo: "Administrativo",
        empresa: "C.C. Ventura Plaza",
        puesto: "Administración",
        rol: "Administrativo"
    }

];


/* ==========================================================
   03. RECORDAR USUARIO
========================================================== */

// Busca un usuario guardado anteriormente.

const usuarioGuardado =
    localStorage.getItem("usuarioRecordado");


if (usuarioGuardado) {

    usuario.value =
        usuarioGuardado;

    recordarme.checked =
        true;
}


/* ==========================================================
   04. INICIAR SESIÓN
========================================================== */

formulario.addEventListener(
    "submit",
    function (evento) {

        // Evita recargar la página.
        evento.preventDefault();


        // Obtiene los datos escritos.
        const nombreUsuario =
            usuario.value
                .trim()
                .toLowerCase();

        const contrasena =
            password.value.trim();


        /* ==================================================
           BUSCAR USUARIO
        ================================================== */

        const usuarioEncontrado =
            usuarios.find(
                cuenta =>
                    cuenta.usuario === nombreUsuario &&
                    cuenta.password === contrasena
            );


        /* ==================================================
           VALIDAR ACCESO
        ================================================== */

        if (!usuarioEncontrado) {

            mostrarMensaje(
                "Usuario o contraseña incorrectos.",
                "error"
            );

            return;
        }


        /* ==================================================
           GUARDAR SESIÓN
        ================================================== */

        // Guarda toda la información del usuario.

        sessionStorage.setItem(
            "usuario",
            JSON.stringify(usuarioEncontrado)
        );


        /* ==================================================
           RECORDAR USUARIO
        ================================================== */

        if (recordarme.checked) {

            localStorage.setItem(
                "usuarioRecordado",
                nombreUsuario
            );

        } else {

            localStorage.removeItem(
                "usuarioRecordado"
            );
        }


        /* ==================================================
           MOSTRAR ÉXITO
        ================================================== */

        mostrarMensaje(
            "Inicio de sesión correcto.",
            "exito"
        );


        // Desactiva el botón.
        botonLogin.disabled =
            true;


        // Muestra el proceso de ingreso.
        botonLogin.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Ingresando...
        `;


        /* ==================================================
           IR AL DASHBOARD
        ================================================== */

        setTimeout(() => {

            window.location.href =
                "./dashboard.html";

        }, 500);

    }
);


/* ==========================================================
   05. MOSTRAR MENSAJE
========================================================== */

function mostrarMensaje(
    texto,
    tipo
) {

    mensaje.textContent =
        texto;

    mensaje.className =
        "mensaje-login " +
        tipo;
}