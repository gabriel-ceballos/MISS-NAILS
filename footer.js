/**
 * FOOTER GLOBAL MISS NAILS
 *
 * Única responsabilidad:
 * - Inicio
 * - Carrito
 * - Cuenta
 * - Indicador activo
 *
 * NO contiene lógica de catálogo.
 * NO contiene lógica de carrito.
 * NO contiene lógica de cuenta.
 *
 * La navegación real la realiza app.ir().
 */

(function () {

    "use strict";


    const FOOTER_ID =
        "miss-nails-footer-mobile";


    // =====================================================
    // CREAR FOOTER
    // =====================================================

    function crearFooter() {

        // Evitar duplicados
        const existente =
            document.getElementById(
                FOOTER_ID
            );

        if (existente) {
            return existente;
        }


        const footer =
            document.createElement("nav");


        footer.id =
            FOOTER_ID;


        footer.className =
            "mn-footer-mobile";


        footer.setAttribute(
            "aria-label",
            "Navegación principal"
        );


        footer.innerHTML = `

            <!-- =========================================
                 INICIO
            ========================================== -->

            <button
                class="mn-footer-item activo"
                type="button"
                data-view="home"
                aria-label="Inicio"
                aria-current="page"
            >

                <span class="mn-footer-icono-wrap">

                    <span
                        class="mn-footer-icono home-icono"
                    >

                        <svg
                            viewBox="0 0 32 32"
                            aria-hidden="true"
                        >

                            <path
                                d="M4 14.2 16 4l12 10.2v13.3a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 27.5V14.2Z"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.2"
                                stroke-linejoin="round"
                            />

                            <path
                                d="M11.5 29V19.5h9V29"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.2"
                                stroke-linejoin="round"
                            />

                        </svg>

                    </span>


                    <span
                        class="mn-footer-check"
                        aria-hidden="true"
                    >
                        ✓
                    </span>

                </span>


                <span class="mn-footer-label">
                    Inicio
                </span>

            </button>


            <!-- =========================================
                 CARRITO
            ========================================== -->

            <button
                class="mn-footer-item"
                type="button"
                data-view="cart"
                aria-label="Carrito"
            >

                <span class="mn-footer-icono-wrap">

                    <span
                        class="mn-footer-icono cart-icono"
                    >

                        <svg
                            viewBox="0 0 32 32"
                            aria-hidden="true"
                        >

                            <path
                                d="M4.5 6h3l2.2 13.1a2 2 0 0 0 2 1.7h11.9a2 2 0 0 0 1.9-1.5L28 10H9"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />

                            <circle
                                cx="13"
                                cy="26.2"
                                r="1.8"
                                fill="currentColor"
                            />

                            <circle
                                cx="24"
                                cy="26.2"
                                r="1.8"
                                fill="currentColor"
                            />

                        </svg>

                    </span>


                    <span
                        class="mn-footer-cart-count"
                        aria-label="Cantidad en carrito"
                    >
                        0
                    </span>


                    <span
                        class="mn-footer-check"
                        aria-hidden="true"
                    >
                        ✓
                    </span>

                </span>


                <span class="mn-footer-label">
                    Carrito
                </span>

            </button>


            <!-- =========================================
                 CUENTA
            ========================================== -->

            <button
                class="mn-footer-item"
                type="button"
                data-view="account"
                aria-label="Cuenta"
            >

                <span class="mn-footer-icono-wrap">

                    <span
                        class="mn-footer-icono account-icono"
                    >

                        <svg
                            viewBox="0 0 32 32"
                            aria-hidden="true"
                        >

                            <circle
                                cx="16"
                                cy="9.5"
                                r="5.1"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.1"
                            />

                            <path
                                d="M6.2 28c.8-6 4.1-9.1 9.8-9.1s9 3.1 9.8 9.1"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.1"
                                stroke-linecap="round"
                            />

                        </svg>

                    </span>


                    <span
                        class="mn-footer-check"
                        aria-hidden="true"
                    >
                        ✓
                    </span>

                </span>


                <span class="mn-footer-label">
                    Cuenta
                </span>

            </button>

        `;


        // =================================================
        // INSERTAR FOOTER EN SU CONTENEDOR GLOBAL
        // =================================================

        const contenedor =
            document.getElementById("mn-footer");

        if (!contenedor) {
            console.error(
                "FOOTER → no existe #mn-footer"
            );
            return footer;
        }

        contenedor.appendChild(
            footer
        );


        // =================================================
        // EVENTOS
        // =================================================

        const botones =
            footer.querySelectorAll(
                ".mn-footer-item"
            );


        botones.forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const vista =
                            boton.dataset.view;


                        // ---------------------------------
                        // ESTADO VISUAL
                        // ---------------------------------

                        botones.forEach(
                            item => {

                                item.classList.remove(
                                    "activo"
                                );

                                item.removeAttribute(
                                    "aria-current"
                                );

                            }
                        );


                        boton.classList.add(
                            "activo"
                        );


                        boton.setAttribute(
                            "aria-current",
                            "page"
                        );


                        // ---------------------------------
                        // NAVEGACIÓN CENTRAL
                        // ---------------------------------

                        if (
                            vista === "home" &&
                            window.app
                        ) {

                            window.app.ir(
                                "catalogo"
                            );

                        }


                        if (
                            vista === "cart" &&
                            window.app
                        ) {

                            window.app.ir(
                                "carrito"
                            );

                        }


                        if (
                            vista === "account" &&
                            window.app
                        ) {

                            window.app.ir(
                                "cuenta"
                            );

                        }

                    }
                );

            }
        );


        console.log(
            "FOOTER → creado"
        );


        return footer;
    }


    // =====================================================
    // ACTUALIZAR VISTA ACTIVA
    // =====================================================

    function activar(vista) {

        const footer =
            document.getElementById(
                FOOTER_ID
            );


        if (!footer) {
            return;
        }


        const botones =
            footer.querySelectorAll(
                ".mn-footer-item"
            );


        botones.forEach(
            boton => {

                boton.classList.remove(
                    "activo"
                );

                boton.removeAttribute(
                    "aria-current"
                );

            }
        );


        let destino;


        if (
            vista === "catalogo" ||
            vista === "home"
        ) {

            destino = "home";

        } else if (
            vista === "carrito" ||
            vista === "cart"
        ) {

            destino = "cart";

        } else if (
            vista === "cuenta" ||
            vista === "account"
        ) {

            destino = "account";
        }


        if (!destino) {
            return;
        }


        const boton =
            footer.querySelector(
                `[data-view="${destino}"]`
            );


        if (!boton) {
            return;
        }


        boton.classList.add(
            "activo"
        );


        boton.setAttribute(
            "aria-current",
            "page"
        );
    }


    // =====================================================
    // ACTUALIZAR CONTADOR DEL CARRITO
    // =====================================================

    function actualizarContador(cantidad) {

        const elemento =
            document.querySelector(
                `#${FOOTER_ID} .mn-footer-cart-count`
            );


        if (!elemento) {
            return;
        }


        const numero =
            Number(cantidad);


        elemento.textContent =
            Number.isFinite(numero)
                ? numero
                : 0;
    }


    // =====================================================
    // API PÚBLICA
    // =====================================================

    function ocultar() {

        const elemento =
            document.getElementById(FOOTER_ID);

        if (elemento) {
            elemento.hidden = true;
        }
    }


    window.footer = {

        mostrar: function () {
            const elemento = crearFooter();
            if (elemento) elemento.hidden = false;
            return elemento;
        },

        ocultar,

        activar,

        actualizarContador

    };


    // =====================================================
    // INICIO
    // =====================================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            crearFooter,
            {
                once:true
            }
        );

    } else {

        crearFooter();

    }

})();
