console.log("VERSION NUEVA APP");
console.log("APP cargada");

/*************************************************
SISTEMA
*************************************************/

const sistema = {

    pantalla: "",

    ancho: 0,

    alto: 0

};

/*************************************************
DETECTAR PANTALLA
*************************************************/

function detectarPantalla() {

    sistema.ancho = window.innerWidth;

    sistema.alto = window.innerHeight;

    if (sistema.ancho < 768) {

        sistema.pantalla = "MOBILE";

    } else if (sistema.ancho < 1200) {

        sistema.pantalla = "TABLET";

    } else {

        sistema.pantalla = "PC";

    }

    console.log("================================");
    console.log("ANCHO    :", sistema.ancho);
    console.log("ALTO     :", sistema.alto);
    console.log("PANTALLA :", sistema.pantalla);
    console.log("================================");

}

/*************************************************
MOSTRAR LA DISTRIBUCIÓN CORRESPONDIENTE
*************************************************/

function mostrarPantalla() {

    switch (sistema.pantalla) {

        case "MOBILE":

            mobile.mostrar();

            break;

        case "TABLET":

            tablet.mostrar();

            break;

        case "PC":

            pc.mostrar();

            break;

    }

}

/*************************************************
CAMBIO DE ESPACIO DISPONIBLE
*************************************************/

window.addEventListener("resize", () => {

    const pantallaAnterior = sistema.pantalla;

    detectarPantalla();

    if (pantallaAnterior !== sistema.pantalla) {

        mostrarPantalla();

    }

});



/*************************************************
 * RECUPERAR ESTILOS AL VOLVER A LA APLICACIÓN
 *************************************************/

function refrescarEstilos() {

    const hojas =
        document.querySelectorAll(
            'link[rel="stylesheet"]'
        );

    hojas.forEach(hoja => {

        const href =
            hoja.getAttribute("href");

        if (
            href &&
            href.includes("css/style.css")
        ) {

            const separador =
                href.includes("?")
                    ? "&"
                    : "?";

            hoja.href =
                href.split("?")[0] +
                separador +
                "v=" +
                Date.now();

        }

    });

}


/*************************************************
 * RECUPERAR ESTILOS AL DESBLOQUEAR
 *************************************************/

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState === "visible"
        ) {

            refrescarEstilos();

        }

    }
);






/*************************************************
INICIAR APLICACIÓN
*************************************************/

async function iniciar() {

    console.log("1. Antes de detectar pantalla");

    /*
     * La pantalla se identifica desde el inicio,
     * antes de mostrar el login.
     */

    detectarPantalla();

    console.log("2. Pantalla identificada:", sistema.pantalla);

    console.log("3. Antes de llamar a la API");

    const respuesta = await api("ping");

    console.log("4. La API respondió");

    console.log(respuesta);

        if (!respuesta.ok) {

        console.error(
            "No fue posible conectar con el backend."
        );

        return;

    }


    /*************************************************
     * RECUPERAR SESIÓN
     *************************************************/

    const sesionActiva =
        sesion.cargar();


    if (sesionActiva) {

        console.log(
            "5. Sesión recuperada → entrando a la tienda"
        );

        mostrarPantalla();

        return;

    }


    console.log(
        "5. No existe sesión → mostrar login"
    );

    login.mostrar();

    console.log("6. Login mostrado");

}

/*************************************************
INICIAR
*************************************************/

console.log("7. Voy a ejecutar iniciar()");

iniciar();

console.log("8. iniciar() fue llamada");