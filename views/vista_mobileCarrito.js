/* ==========================================================
   MISS NAILS
   VISTA MOBILE CARRITO

   VISTA INDEPENDIENTE DE PRESENTACIÓN

   IMPORTANTE:
   - NO contiene lógica del carrito.
   - NO modifica mobile_carrito.js.
   - NO modifica mobile.js.
   - NO utiliza localStorage.
   - NO utiliza API.
   - NO conecta navegación.
   - NO conecta botones.

   Esta versión corresponde únicamente
   al ESQUELETO ESTRUCTURAL de la vista.
   ========================================================== */

(function () {

    "use strict";


    const vistaMobileCarrito = {


        /* ==================================================
           CONTENEDOR PRINCIPAL
        ================================================== */

        contenedor: null,


        /* ==================================================
           INICIAR VISTA
        ================================================== */

        iniciar() {

            this.contenedor =
                document.getElementById("app");


            if (!this.contenedor) {

                console.warn(
                    "VISTA MOBILE CARRITO → no existe #app"
                );

                return;

            }


            this.renderizar();

        },


        /* ==================================================
           RENDERIZAR ESTRUCTURA
        ================================================== */

        renderizar() {

            if (!this.contenedor) {

                this.contenedor =
                    document.getElementById("app");

            }


            if (!this.contenedor) {

                return;

            }


            this.contenedor.innerHTML = `

                <div
                    class="vista-mobile-carrito"
                    id="vistaMobileCarrito">


                    <!-- ==================================
                         CABECERA FIJA
                    =================================== -->

                    <header
                        class="vista-mobile-carrito-header">


                        <button
                            class="vista-mobile-carrito-btn-regresar"
                            id="vistaMobileCarritoRegresar"
                            type="button"
                            aria-label="Regresar">

                            <span
                                class="vista-mobile-carrito-icono-regresar">

                                ←

                            </span>

                        </button>


                        <div
                            class="vista-mobile-carrito-header-titulo">


                            <h1>

                                Mi carrito

                            </h1>


                            <span
                                class="vista-mobile-carrito-header-cantidad">

                                <span
                                    id="vistaMobileCarritoCantidad">

                                    0

                                </span>

                                productos

                            </span>


                        </div>


                    </header>


                    <!-- ==================================
                         CONTENEDOR CENTRAL
                         ÚNICA ZONA CON SCROLL
                    =================================== -->

                    <main
                        class="vista-mobile-carrito-contenido">


                        <!-- =================================
                             LISTA DE PRODUCTOS
                        ================================== -->

                        <section
                            class="vista-mobile-carrito-lista"
                            id="vistaMobileCarritoLista">


                            <!-- =================================
                                 TARJETA DE PRODUCTO
                                 ESTRUCTURA BASE
                            ================================== -->

                            <article
                                class="vista-mobile-carrito-producto">


                                <!-- IMAGEN -->

                                <div
                                    class="vista-mobile-carrito-producto-imagen">


                                    <div
                                        class="vista-mobile-carrito-producto-imagen-placeholder">

                                        FOTO

                                    </div>


                                </div>


                                <!-- INFORMACIÓN -->

                                <div
                                    class="vista-mobile-carrito-producto-info">


                                    <div
                                        class="vista-mobile-carrito-producto-cabecera">


                                        <div
                                            class="vista-mobile-carrito-producto-datos">


                                            <span
                                                class="vista-mobile-carrito-producto-categoria">

                                                CATEGORÍA

                                            </span>


                                            <h2
                                                class="vista-mobile-carrito-producto-nombre">

                                                Nombre del producto

                                            </h2>


                                            <span
                                                class="vista-mobile-carrito-producto-presentacion">

                                                Presentación / descripción

                                            </span>


                                        </div>


                                        <button
                                            class="vista-mobile-carrito-producto-eliminar"
                                            type="button"
                                            aria-label="Eliminar producto">

                                            ×

                                        </button>


                                    </div>


                                    <!-- PRECIO -->

                                    <div
                                        class="vista-mobile-carrito-producto-precio">

                                        $0.00

                                    </div>


                                    <!-- PARTE INFERIOR -->

                                    <div
                                        class="vista-mobile-carrito-producto-pie">


                                        <!-- CANTIDAD -->

                                        <div
                                            class="vista-mobile-carrito-cantidad">


                                            <button
                                                class="vista-mobile-carrito-cantidad-btn"
                                                type="button"
                                                aria-label="Disminuir cantidad">

                                                −

                                            </button>


                                            <span
                                                class="vista-mobile-carrito-cantidad-numero">

                                                1

                                            </span>


                                            <button
                                                class="vista-mobile-carrito-cantidad-btn"
                                                type="button"
                                                aria-label="Aumentar cantidad">

                                                +

                                            </button>


                                        </div>


                                        <!-- SUBTOTAL -->

                                        <strong
                                            class="vista-mobile-carrito-producto-subtotal">

                                            $0.00

                                        </strong>


                                    </div>


                                </div>


                            </article>


                        </section>


                        <!-- =================================
                             ESTADO CARRITO VACÍO

                             ESTA SECCIÓN QUEDA RESERVADA
                             PARA CUANDO NO EXISTAN PRODUCTOS.
                        ================================== -->

                        <section
                            class="vista-mobile-carrito-vacio"
                            id="vistaMobileCarritoVacio">


                            <div
                                class="vista-mobile-carrito-vacio-icono">

                                🛒

                            </div>


                            <h2>

                                Tu carrito está vacío

                            </h2>


                            <p>

                                Agrega productos desde el catálogo.

                            </p>


                            <button
                                class="vista-mobile-carrito-vacio-btn"
                                id="vistaMobileCarritoIrCatalogo"
                                type="button">

                                Ver productos

                            </button>


                        </section>


                    </main>


                    <!-- ==================================
                         RESUMEN FIJO
                    =================================== -->

                    <section
                        class="vista-mobile-carrito-resumen"
                        id="vistaMobileCarritoResumen">


                        <div
                            class="vista-mobile-carrito-resumen-fila">


                            <span>

                                Productos

                            </span>


                            <strong
                                id="vistaMobileCarritoSubtotal">

                                $0.00

                            </strong>


                        </div>


                        <div
                            class="vista-mobile-carrito-resumen-fila">


                            <span>

                                Envío

                            </span>


                            <span
                                id="vistaMobileCarritoEnvio">

                                Por calcular

                            </span>


                        </div>


                        <div
                            class="vista-mobile-carrito-resumen-separador">
                        </div>


                        <div
                            class="vista-mobile-carrito-resumen-total">


                            <span>

                                Total

                            </span>


                            <strong
                                id="vistaMobileCarritoTotal">

                                $0.00

                            </strong>


                        </div>


                        <button
                            class="vista-mobile-carrito-continuar"
                            id="vistaMobileCarritoContinuar"
                            type="button">

                            Continuar pedido

                        </button>


                    </section>


                    <!-- ==================================
                         NAVEGACIÓN INFERIOR FIJA
                    =================================== -->

                    <nav
                        class="vista-mobile-carrito-footer">


                        <!-- ==============================
                             INICIO
                        =============================== -->

                        <button
                            class="vista-mobile-carrito-footer-item"
                            type="button">


                            <span
                                class="vista-mobile-carrito-footer-icono">


                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true">

                                    <path
                                        d="
                                            M3 10.5
                                            L12 3
                                            L21 10.5
                                            V20
                                            H14
                                            V14
                                            H10
                                            V20
                                            H3
                                            Z
                                        ">
                                    </path>

                                </svg>


                            </span>


                            <span
                                class="vista-mobile-carrito-footer-label">

                                Inicio

                            </span>


                        </button>


                        <!-- ==============================
                             CARRITO
                        =============================== -->

                        <button
                            class="
                                vista-mobile-carrito-footer-item
                                activo
                            "
                            type="button">


                            <span
                                class="vista-mobile-carrito-footer-icono">


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
                                class="vista-mobile-carrito-footer-label">

                                Carrito

                            </span>


                        </button>


                        <!-- ==============================
                             CUENTA
                        =============================== -->

                        <button
                            class="vista-mobile-carrito-footer-item"
                            type="button">


                            <span
                                class="vista-mobile-carrito-footer-icono">


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


                            </span>


                            <span
                                class="vista-mobile-carrito-footer-label">

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

       La vista queda disponible pero NO se ejecuta sola.
       ====================================================== */

    window.vistaMobileCarrito =
        vistaMobileCarrito;


})();