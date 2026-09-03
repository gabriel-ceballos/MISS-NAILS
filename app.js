/*****************************************************************
 * MISS NAILS
 * APP PRINCIPAL
 *
 * Esta aplicación NO selecciona una versión
 * por dispositivo.
 *****************************************************************/

window.app = {

    vistaActual: null,


    /*************************************************
     * INICIAR
     *************************************************/

    async iniciar() {

        console.log(
            "APP → iniciando"
        );


        console.log(
            "APP → comprobando backend"
        );


        const respuesta =
            await api("ping");


        console.log(
            "APP → respuesta backend",
            respuesta
        );


        if (
            !respuesta ||
            !respuesta.ok
        ) {

            this.mostrarError(
                "No fue posible conectar con MISS NAILS."
            );


            return;

        }


        console.log(
            "APP → backend conectado"
        );


        const sesionActiva =
            sesion.cargar();


        if (sesionActiva) {

            console.log(
                "APP → sesión recuperada"
            );


            this.ir(
                "catalogo"
            );


            return;

        }


        console.log(
            "APP → no existe sesión"
        );


        this.ir(
            "login"
        );

    },


    /*************************************************
     * NAVEGACIÓN
     *************************************************/

    ir(vista) {

        console.log(
            "APP → navegar:",
            vista
        );


        this.vistaActual =
            vista;


        switch (vista) {


            case "login":

                login.mostrar();

                break;


            case "catalogo":

                if (
                    window.catalogo &&
                    typeof catalogo.mostrar ===
                        "function"
                ) {

                    catalogo.mostrar();

                } else {

                    console.warn(
                        "APP → catálogo todavía no está construido"
                    );

                }

                break;


            case "carrito":

                if (
                    window.carrito &&
                    typeof carrito.mostrar ===
                        "function"
                ) {

                    carrito.mostrar();

                } else {

                    console.warn(
                        "APP → carrito todavía no está construido"
                    );

                }

                break;


            case "cuenta":

                if (
                    window.cuenta &&
                    typeof cuenta.mostrar ===
                        "function"
                ) {

                    cuenta.mostrar();

                } else {

                    console.warn(
                        "APP → cuenta todavía no está construida"
                    );

                }

                break;


            default:

                console.error(
                    "APP → vista desconocida:",
                    vista
                );

        }

    },


    /*************************************************
     * ERROR GENERAL
     *************************************************/

    mostrarError(mensaje) {

        const app =
            document.getElementById(
                "app"
            );


        if (!app) {

            return;

        }


        app.innerHTML = `

            <section class="mn-error">

                <h1>
                    MISS NAILS
                </h1>

                <p>
                    ${mensaje}
                </p>

            </section>

        `;

    }

};


/*************************************************
 * ARRANQUE
 *************************************************/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "APP → DOM listo"
        );


        app.iniciar();

    }
);