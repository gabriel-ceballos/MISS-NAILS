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

                        <div
                            style="display:flex;align-items:center;gap:10px;margin:4px 0;color:#999;font-size:12px;">
                            <span style="flex:1;height:1px;background:#EEEEEE;"></span>
                            <span>o continuar con</span>
                            <span style="flex:1;height:1px;background:#EEEEEE;"></span>
                        </div>

                        <div
                            id="googleSignIn"
                            style="display:flex;justify-content:center;min-height:44px;">
                        </div>

                        <button
                            id="btnMicrosoft"
                            type="button"
                            style="width:100%;height:44px;border:1px solid #D6D6D6;border-radius:6px;background:#FFFFFF;color:#333333;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:10px;">
                            <span style="display:grid;grid-template-columns:repeat(2,8px);grid-template-rows:repeat(2,8px);gap:1px;">
                                <span style="background:#F25022;"></span><span style="background:#7FBA00;"></span>
                                <span style="background:#00A4EF;"></span><span style="background:#FFB900;"></span>
                            </span>
                            Continuar con Microsoft
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


        if (window._missNailsAuthMensaje) {

            this.mostrarMensajeFederado(
                window._missNailsAuthMensaje
            );

            window._missNailsAuthMensaje = null;
        }


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


        const microsoft =
            document.getElementById(
                "btnMicrosoft"
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


        microsoft?.addEventListener(
            "click",
            () => this.ingresarMicrosoft()
        );


        this.inicializarGoogle();

    },


    /*************************************************
     * GOOGLE
     *************************************************/

    async inicializarGoogle() {

        const contenedor =
            document.getElementById(
                "googleSignIn"
            );

        if (!contenedor || !window.auth) {
            return;
        }

        try {

            await this.cargarGoogleIdentity();

            if (
                !window.google ||
                !google.accounts ||
                !google.accounts.id
            ) {
                return;
            }

            if (!window._missNailsGoogleInitialized) {

                google.accounts.id.initialize({
                    client_id:
                        MISS_NAILS_AUTH_CONFIG.googleClientId,
                    callback:
                        async (respuesta) => {
                            await this.procesarGoogle(
                                respuesta.credential
                            );
                        },
                    auto_select: false,
                    cancel_on_tap_outside: true
                });

                window._missNailsGoogleInitialized = true;
            }

            google.accounts.id.renderButton(
                contenedor,
                {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    text: "continue_with",
                    shape: "rectangular",
                    width: Math.min(
                        360,
                        Math.max(240, contenedor.clientWidth || 360)
                    )
                }
            );

            google.accounts.id.prompt();

        } catch (error) {

            console.error(
                "LOGIN → Google no disponible:",
                error
            );
        }
    },


    cargarGoogleIdentity() {

        if (window.google?.accounts?.id) {
            return Promise.resolve();
        }

        if (window._missNailsGoogleLoader) {
            return window._missNailsGoogleLoader;
        }

        window._missNailsGoogleLoader =
            new Promise((resolve, reject) => {

                const script =
                    document.createElement("script");

                script.src =
                    "https://accounts.google.com/gsi/client";
                script.async = true;
                script.defer = true;

                script.onload = () => {
                    resolve();
                };

                script.onerror = () => {
                    reject(
                        new Error(
                            "No fue posible cargar Google Identity Services."
                        )
                    );
                };

                document.head.appendChild(script);
            });

        return window._missNailsGoogleLoader;
    },


    async procesarGoogle(credential) {

        const respuesta =
            await auth.loginGoogle(
                credential
            );

        console.log(
            "LOGIN GOOGLE →",
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

        this.mostrarMensajeFederado(
            respuesta?.mensaje ||
            "No fue posible iniciar sesión con Google."
        );
    },


    async ingresarMicrosoft() {

        const boton =
            document.getElementById(
                "btnMicrosoft"
            );

        if (boton) {
            boton.disabled = true;
            boton.textContent =
                "Conectando con Microsoft...";
        }

        try {
            await auth.iniciarMicrosoft();
        } catch (error) {

            console.error(
                "LOGIN MICROSOFT →",
                error
            );

            this.mostrarMensajeFederado(
                "No fue posible iniciar el acceso con Microsoft."
            );

            if (boton) {
                boton.disabled = false;
                boton.textContent =
                    "Continuar con Microsoft";
            }
        }
    },


    mostrarMensajeFederado(mensaje) {

        const elemento =
            document.getElementById(
                "mensajeSistema"
            );

        if (elemento) {
            elemento.textContent = mensaje;
        }
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