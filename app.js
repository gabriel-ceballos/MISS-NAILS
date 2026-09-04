/* =========================================================
   MISS NAILS — CONTROLADOR PRINCIPAL

   Responsabilidades:
   - Iniciar la aplicación.
   - Resolver la sesión.
   - Navegar entre vistas.
   - Mantener actualizado el estado visual del viewport.

   IMPORTANTE:
   - NO detecta tipo de dispositivo.
   - NO decide Android / iPhone / tablet / PC.
   - La orientación se calcula únicamente con el tamaño real
     disponible del viewport.
   ========================================================= */

(function () {

    "use strict";


    const app = {

        vistaActual: null,

        /*************************************************
         * INICIO
         *************************************************/
        async iniciar() {

            console.log(
                "APP → iniciando MISS NAILS"
            );

            /*
             * Activar inmediatamente el estado del viewport.
             * Esto ocurre antes de construir el catálogo.
             */
            this.inicializarOrientacion();

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


            const usuario =
                sesion.cargar();


            if (usuario) {

                this.ir("catalogo");

                return;

            }


            this.ir("login");

        },


        /*************************************************
         * ORIENTACIÓN / VIEWPORT
         *
         * No usamos @media (orientation) como mecanismo
         * principal. Cada cambio real del viewport vuelve
         * a aplicar la clase correspondiente al .mobile.
         *************************************************/
        inicializarOrientacion() {

            const actualizar = () => {
                this.actualizarOrientacion();
            };

            const recuperarOrientacion = () => {
                this.iniciarRecuperacionOrientacion();
            };

            window.addEventListener(
                "resize",
                actualizar,
                { passive: true }
            );

            window.addEventListener(
                "orientationchange",
                recuperarOrientacion,
                { passive: true }
            );

            if (window.visualViewport) {
                window.visualViewport.addEventListener(
                    "resize",
                    actualizar,
                    { passive: true }
                );
            }

            document.addEventListener(
                "visibilitychange",
                () => {
                    if (!document.hidden) {
                        recuperarOrientacion();
                    }
                },
                { passive: true }
            );

            window.addEventListener(
                "pageshow",
                recuperarOrientacion,
                { passive: true }
            );

            actualizar();
            this.iniciarRecuperacionOrientacion();
        },


        iniciarRecuperacionOrientacion() {

            if (this._orientacionRecoveryTimer) {
                clearTimeout(this._orientacionRecoveryTimer);
                this._orientacionRecoveryTimer = null;
            }

            /*
             * Android/Chrome puede entregar durante unos cientos de
             * milisegundos un viewport transitorio al desbloquear.
             * Durante esa ventana usamos la orientación real de
             * Screen Orientation, no una clasificación del dispositivo.
             */
            this._orientacionRecovery = true;

            const reintentos = [0, 50, 120, 250, 450, 700, 1000, 1400];

            reintentos.forEach((ms) => {
                setTimeout(() => {
                    this.actualizarOrientacion(true);
                }, ms);
            });

            this._orientacionRecoveryTimer = setTimeout(() => {
                this._orientacionRecovery = false;
                this.actualizarOrientacion(false);
                this.sincronizarFooter();
                this._orientacionRecoveryTimer = null;
            }, 1700);
        },


        obtenerOrientacionViewport(usandoRecovery) {

            const viewport = window.visualViewport;

            const ancho = viewport
                ? viewport.width
                : window.innerWidth;

            const alto = viewport
                ? viewport.height
                : window.innerHeight;

            if (
                !Number.isFinite(ancho) ||
                !Number.isFinite(alto) ||
                ancho <= 0 ||
                alto <= 0
            ) {
                return null;
            }

            /*
             * En recuperación de bloqueo/desbloqueo, Android ya conoce
             * la orientación de la pantalla aunque el viewport visual
             * todavía esté reconstruyéndose. Si está disponible,
             * preferimos ese dato temporalmente.
             */
            if (
                usandoRecovery &&
                window.screen &&
                window.screen.orientation &&
                typeof window.screen.orientation.type === "string"
            ) {
                const tipo = window.screen.orientation.type;

                if (tipo.indexOf("landscape") === 0) {
                    return { ancho, alto, horizontal: true };
                }

                if (tipo.indexOf("portrait") === 0) {
                    return { ancho, alto, horizontal: false };
                }
            }

            return {
                ancho,
                alto,
                horizontal: ancho > alto
            };
        },


        actualizarOrientacion(usandoRecovery = false) {

            const vistas =
                document.querySelectorAll(
                    ".mobile"
                );

            if (!vistas.length) {
                return;
            }

            const datos =
                this.obtenerOrientacionViewport(
                    usandoRecovery || this._orientacionRecovery === true
                );

            if (!datos) {
                return;
            }

            const horizontal = datos.horizontal;

            vistas.forEach((vista) => {

                const claseNueva = horizontal
                    ? "mn-horizontal"
                    : "mn-vertical";

                /*
                 * No tocamos el DOM si el estado ya es correcto.
                 * Esto evita reconstrucciones innecesarias durante
                 * los múltiples resize que produce Android.
                 */
                if (vista.classList.contains(claseNueva)) {
                    return;
                }

                vista.classList.remove(
                    "mn-vertical",
                    "mn-horizontal"
                );

                vista.classList.add(claseNueva);
            });

            this.sincronizarFooter();

            console.log(
                "APP → viewport:",
                Math.round(datos.ancho),
                "x",
                Math.round(datos.alto),
                "→",
                horizontal
                    ? "HORIZONTAL"
                    : "VERTICAL"
            );
        },

        /*************************************************
         * SINCRONIZAR FOOTER
         *
         * Android/Chrome puede conservar durante el desbloqueo
         * una geometría anterior del footer aunque el viewport
         * ya haya cambiado. Esta función no recrea el footer ni
         * modifica su contenido: únicamente vuelve a fijar su
         * caja y las dimensiones visuales que le corresponden.
         *************************************************/
        sincronizarFooter() {

            const contenedor =
                document.getElementById("mn-footer");

            const footer =
                document.getElementById("miss-nails-footer-mobile");

            if (!contenedor || !footer) {
                return;
            }

            /* Forzar una lectura antes de escribir evita que Chrome
             * conserve una composición intermedia después de unlock. */
            void contenedor.offsetHeight;

            footer.style.position = "static";
            footer.style.left = "auto";
            footer.style.right = "auto";
            footer.style.bottom = "auto";
            footer.style.transform = "none";
            footer.style.width = "100%";
            footer.style.height = "100%";
            footer.style.maxWidth = "none";
            footer.style.minWidth = "0";
            footer.style.minHeight = "0";
            footer.style.display = "grid";
            footer.style.gridTemplateColumns = "repeat(3,minmax(0,1fr))";
            footer.style.gridTemplateRows = "minmax(0,1fr)";
            footer.style.alignItems = "stretch";
            footer.style.overflow = "hidden";
            footer.style.boxSizing = "border-box";
            footer.style.webkitTextSizeAdjust = "100%";
            footer.style.textSizeAdjust = "100%";

            const botones =
                footer.querySelectorAll(".mn-footer-item");

            botones.forEach((boton) => {
                boton.style.width = "100%";
                boton.style.height = "100%";
                boton.style.minWidth = "0";
                boton.style.minHeight = "0";
                boton.style.boxSizing = "border-box";
                boton.style.padding = "4px 4px 3px";
                boton.style.display = "flex";
                boton.style.flexDirection = "column";
                boton.style.alignItems = "center";
                boton.style.justifyContent = "center";
                boton.style.gap = "1px";
                boton.style.overflow = "hidden";
            });

            footer.querySelectorAll(".mn-footer-icono-wrap")
                .forEach((elemento) => {
                    elemento.style.width = "36px";
                    elemento.style.height = "36px";
                    elemento.style.minWidth = "36px";
                    elemento.style.minHeight = "36px";
                    elemento.style.flex = "0 0 36px";
                });

            footer.querySelectorAll(".mn-footer-icono")
                .forEach((elemento) => {
                    elemento.style.width = "29px";
                    elemento.style.height = "29px";
                    elemento.style.flex = "0 0 29px";
                });

            footer.querySelectorAll(".mn-footer-icono svg")
                .forEach((elemento) => {
                    elemento.style.width = "29px";
                    elemento.style.height = "29px";

                    elemento.querySelectorAll("*")
                        .forEach((trazo) => {
                            trazo.style.strokeWidth = "1.6px";
                        });
                });

            footer.querySelectorAll(".mn-footer-label")
                .forEach((elemento) => {
                    elemento.style.fontSize = "11px";
                    elemento.style.lineHeight = "14px";
                    elemento.style.maxWidth = "100%";
                    elemento.style.overflow = "hidden";
                    elemento.style.textOverflow = "ellipsis";
                    elemento.style.whiteSpace = "nowrap";
                });

            /* Segunda lectura: obliga al navegador a aplicar la nueva
             * geometría antes de continuar con el siguiente frame. */
            void footer.offsetHeight;
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

                    if (
                        window.login &&
                        typeof window.login.mostrar ===
                            "function"
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
                        typeof window.catalogo.mostrar ===
                            "function"
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
                        typeof window.carrito.mostrar ===
                            "function"
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
                        typeof window.cuenta.mostrar ===
                            "function"
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

            }

        },


        /*************************************************
         * ERROR VISUAL
         *************************************************/
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


    window.app = app;


    /* =====================================================
       ARRANQUE ÚNICO
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {
            window.app.iniciar();
        },
        { once: true }
    );

})();
