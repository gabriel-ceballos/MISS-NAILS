/*****************************************************************
 * MISS NAILS
 * LOGIN
 *****************************************************************/

window.login = {


    /*************************************************
     * MOSTRAR LOGIN
     *************************************************/

    mostrar() {

        console.log(
            "LOGIN → mostrar"
        );


        const app =
            document.getElementById(
                "app"
            );


        if (!app) {

            console.error(
                "LOGIN → no existe #app"
            );

            return;

        }


        app.innerHTML = `

            <div class="contenedor-login">

                <div class="tarjeta-login">

                    <div class="logo-contenedor">

                        <img
                            src="img/logo.png"
                            class="logo-missnails"
                            alt="Miss Nails">

                    </div>


                    <div class="formulario">

                        <input
                            type="email"
                            id="correo"
                            placeholder="Correo">

                        <input
                            type="password"
                            id="password"
                            placeholder="Contraseña">

                        <button
                            id="btnIngresar"
                            type="button">

                            Ingresar

                        </button>

                        <a
                            href="#"
                            id="activarCuenta">

                            Activar cuenta

                        </a>

                        <div
                            id="mensajeSistema">
                        </div>

                    </div>

                </div>

            </div>

        `;


        this.inicializar();


        const correo =
            document.getElementById(
                "correo"
            );


        if (correo) {

            correo.focus();

        }

    },


    /*************************************************
     * EVENTOS
     *************************************************/

    inicializar() {

        const boton =
            document.getElementById(
                "btnIngresar"
            );


        const correo =
            document.getElementById(
                "correo"
            );


        const password =
            document.getElementById(
                "password"
            );


        const activar =
            document.getElementById(
                "activarCuenta"
            );


        boton?.addEventListener(
            "click",
            () => this.ingresar()
        );


        correo?.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    password?.focus();

                }

            }
        );


        password?.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    this.ingresar();

                }

            }
        );


        activar?.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                this.mostrarActivacion();

            }
        );

    },


    /*************************************************
     * INGRESAR
     *************************************************/

    async ingresar() {

        const boton =
            document.getElementById(
                "btnIngresar"
            );


        const correo =
            document.getElementById(
                "correo"
            );


        const password =
            document.getElementById(
                "password"
            );


        if (
            !boton ||
            !correo ||
            !password
        ) {

            return;

        }


        boton.disabled = true;

        boton.textContent =
            "Ingresando...";


        correo.disabled = true;

        password.disabled = true;


        try {

            const respuesta =
                await auth.login(
                    correo.value.trim(),
                    password.value
                );


            console.log(
                "LOGIN →",
                respuesta
            );


            if (
                respuesta &&
                respuesta.ok
            ) {

                sesion.guardar(
                    respuesta.datos
                );


                app.ir(
                    "catalogo"
                );


                return;

            }


            const mensaje =
                document.getElementById(
                    "mensajeSistema"
                );


            if (mensaje) {

                mensaje.textContent =
                    respuesta?.mensaje ||
                    "No fue posible iniciar sesión.";

            }


        } catch (error) {

            console.error(
                "LOGIN ERROR →",
                error
            );


            const mensaje =
                document.getElementById(
                    "mensajeSistema"
                );


            if (mensaje) {

                mensaje.textContent =
                    "Ocurrió un error al iniciar sesión.";

            }

        }


        boton.disabled = false;

        boton.textContent =
            "Ingresar";


        correo.disabled = false;

        password.disabled = false;

    },


    /*************************************************
     * ACTIVACIÓN
     *************************************************/

    mostrarActivacion() {

        const app =
            document.getElementById(
                "app"
            );


        if (!app) {

            return;

        }


        app.innerHTML = `

            <div class="contenedor-login">

                <div class="tarjeta-login">

                    <div class="logo-contenedor">

                        <img
                            src="img/logo.png"
                            class="logo-missnails"
                            alt="Miss Nails">

                    </div>


                    <div class="formulario">

                        <input
                            type="email"
                            id="correoActivacion"
                            placeholder="Correo">

                        <input
                            type="password"
                            id="passwordActivacion"
                            placeholder="Crear contraseña">

                        <input
                            type="password"
                            id="confirmarActivacion"
                            placeholder="Confirmar contraseña">

                        <button
                            id="btnActivar"
                            type="button">

                            Activar Cuenta

                        </button>


                        <a
                            href="#"
                            id="regresarLogin">

                            Regresar

                        </a>


                        <div
                            id="mensajeSistema">
                        </div>

                    </div>

                </div>

            </div>

        `;


        this.inicializarActivacion();

    },


    /*************************************************
     * EVENTOS ACTIVACIÓN
     *************************************************/

    inicializarActivacion() {

        const boton =
            document.getElementById(
                "btnActivar"
            );


        const regresar =
            document.getElementById(
                "regresarLogin"
            );


        boton?.addEventListener(
            "click",
            () => this.activarCuenta()
        );


        regresar?.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                this.mostrar();

            }
        );

    },


    /*************************************************
     * ACTIVAR CUENTA
     *************************************************/

    activarCuenta() {

        console.log(
            "LOGIN → activarCuenta()"
        );

    }

};