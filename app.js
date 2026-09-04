/* =========================================================
   MISS NAILS
   CONTROLADOR CENTRAL DE LA APLICACIÓN
   ========================================================= */

window.app = {

    vistaActual: null,


    async iniciar() {

        console.log(
            "APP → iniciando MISS NAILS"
        );


        /*
         * Comprobar comunicación
         * con el backend.
         */

        try {

            const respuesta =
                await api("ping");

            console.log(
                "APP → ping:",
                respuesta
            );

        } catch (error) {

            console.error(
                "APP → error de comunicación:",
                error
            );
        }


        /*
         * Recuperar sesión.
         */

        const usuario =
            sesion.cargar();


        /*
         * Si existe sesión,
         * entrar directamente
         * al catálogo.
         */

        if (usuario) {

            this.ir(
                "catalogo"
            );

            return;
        }


        /*
         * Si no existe sesión,
         * mostrar login.
         */

        this.ir(
            "login"
        );
    },


    ir(vista) {

        console.log(
            "APP → navegar:",
            vista
        );


        this.vistaActual =
            vista;

            if (
                    window.footer &&
                    typeof window.footer.activar === "function"
                ) {
                    window.footer.activar(vista);
                }


        switch (vista) {


            case "login":

                if (
                    window.login &&
                    typeof window.login.mostrar === "function"
                ) {

                    window.login.mostrar();

                } else {

                    this.mostrarError(
                        "No se pudo cargar el módulo de acceso."
                    );
                }

                break;


            case "catalogo":

                if (
                    window.catalogo &&
                    typeof window.catalogo.mostrar === "function"
                ) {

                    window.catalogo.mostrar();

                } else {

                    console.warn(
                        "APP → catálogo todavía no cargado."
                    );
                }

                break;


            case "carrito":

                if (
                    window.carrito &&
                    typeof window.carrito.mostrar === "function"
                ) {

                    window.carrito.mostrar();

                } else {

                    console.warn(
                        "APP → carrito todavía no cargado."
                    );
                }

                break;


            case "cuenta":

                if (
                    window.cuenta &&
                    typeof window.cuenta.mostrar === "function"
                ) {

                    window.cuenta.mostrar();

                } else {

                    console.warn(
                        "APP → cuenta todavía no cargada."
                    );
                }

                break;


            default:

                console.error(
                    "APP → vista desconocida:",
                    vista
                );

                break;
        }
    },


    mostrarError(mensaje) {

        const contenedor =
            document.getElementById("app");

        if (!contenedor) {
            return;
        }


        contenedor.innerHTML = `
            <div class="mn-error">
                <strong>
                    Ocurrió un problema
                </strong>

                <span>
                    ${String(mensaje)}
                </span>
            </div>
        `;
    }
};


/*
 * Arranque de la aplicación.
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.app.iniciar();

    },
    {
        once: true
    }
);