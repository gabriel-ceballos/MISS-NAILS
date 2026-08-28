/* ==========================================================
   MISS NAILS
   VISTA CUENTA MOBILE

   VERSIÓN BASE
   - Contenido vacío
   - Footer inferior
   - Tres iconos
   - Cuenta activa
   ========================================================== */

(function () {

    "use strict";


    const vistaCuentaMobile = {

        contenedor: null,


        /* ==================================================
           MOSTRAR VISTA
           ================================================== */

        mostrar() {

            this.contenedor =
                document.getElementById("app");


            if (!this.contenedor) {

                console.error(
                    "CUENTA MOBILE → no existe #app"
                );

                return;
            }


            this.renderizar();

        },


        /* ==================================================
           RENDERIZAR
           ================================================== */

        renderizar() {

            this.contenedor.innerHTML = `

                <div
                    class="vista-cuenta-mobile"
                    id="vistaCuentaMobile"
                    style="
                        width:100%;
                        height:100dvh;
                        display:flex;
                        flex-direction:column;
                        overflow:hidden;
                    ">


                    <!-- =====================================
                         CONTENIDO
                         ===================================== -->

                    <main
                        class="vista-cuenta-mobile-contenido"
                        style="
                            flex:1;
                            min-height:0;
                        ">

                    </main>


                    <!-- =====================================
                         FOOTER
                         ===================================== -->

                    <nav
                        class="mobile-footer"
                        id="mobileFooter"
                        style="
                            flex-shrink:0;
                        ">


                        <!-- ================================
                             INICIO
                             ================================ -->

                        <button
                            id="btnInicio"
                            class="mobile-nav-item"
                            type="button"
                            aria-label="Inicio">

                            <span
                                class="mobile-nav-icon">

                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true">

                                    <path
                                        d="
                                            M3 10.5
                                            L12 3
                                            L21 10.5
                                            V21
                                            H14
                                            V15
                                            H10
                                            V21
                                            H3
                                            Z
                                        ">
                                    </path>

                                </svg>

                            </span>

                            <span
                                class="mobile-nav-label">

                                Inicio

                            </span>

                        </button>


                        <!-- ================================
                             CARRITO
                             ================================ -->

                        <button
                            id="btnCarrito"
                            class="mobile-nav-item"
                            type="button"
                            aria-label="Carrito">

                            <span
                                class="mobile-nav-icon">

                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true">

                                    <path
                                        d="
                                            M3 4
                                            H5
                                            L7.2 15.5
                                            H18.5
                                            L21 7
                                            H6
                                        ">
                                    </path>

                                    <circle
                                        cx="9"
                                        cy="19"
                                        r="1.5">
                                    </circle>

                                    <circle
                                        cx="17"
                                        cy="19"
                                        r="1.5">
                                    </circle>

                                </svg>

                            </span>

                            <span
                                class="mobile-nav-label">

                                Carrito

                            </span>

                        </button>


                        <!-- ================================
                             CUENTA
                             ================================ -->

<button
    id="btnCuenta"
    class="mobile-nav-item activo"
    type="button"
    aria-label="Cuenta">

    <span
        class="mobile-nav-icon">

        <svg
            viewBox="0 0 24 24"
            aria-hidden="true">

            <circle
                cx="12"
                cy="8"
                r="4">
            </circle>

            <path
                d="
                    M4 21
                    C4.8 16.5
                    7.5 14
                    12 14
                    C16.5 14
                    19.2 16.5
                    20 21
                ">
            </path>

        </svg>


        <span class="mobile-nav-check">✓</span>


    </span>

    <span
        class="mobile-nav-label">

        Cuenta

    </span>

</button>


                    </nav>

                </div>

            `;

        }

    };


    /* ======================================================
       EXPONER VISTA
       ====================================================== */

    window.vistaCuentaMobile =
        vistaCuentaMobile;


})();