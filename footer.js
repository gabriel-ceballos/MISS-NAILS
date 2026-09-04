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
        // ESTILOS PROPIOS DEL FOOTER
        // =================================================

        const estilos =
            document.createElement("style");


        estilos.id =
            "miss-nails-footer-mobile-style";


        estilos.textContent = `

            #${FOOTER_ID} {

                position:fixed;

                left:0;
                right:0;
                bottom:0;

                z-index:9999;

                height:112px;

                box-sizing:border-box;

                display:grid;

                grid-template-columns:
                    repeat(3,1fr);

                align-items:start;

                padding:
                    14px 12px 8px;

                background:#FFFFFF;

                border-top:
                    1px solid #EEEEEE;

                box-shadow:
                    0 -2px 8px
                    rgba(0,0,0,.04);

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;
            }


            /* =========================================
               BOTONES
            ========================================== */

            #${FOOTER_ID}
            .mn-footer-item {

                position:relative;

                width:100%;

                height:90px;

                margin:0;
                padding:0;

                display:flex;

                flex-direction:column;

                align-items:center;

                justify-content:flex-start;

                border:0;

                background:transparent;

                color:#777777;

                cursor:pointer;

                -webkit-tap-highlight-color:
                    transparent;
            }


            /* =========================================
               ICONOS
            ========================================== */

            #${FOOTER_ID}
            .mn-footer-icono-wrap {

                position:relative;

                width:48px;
                height:48px;

                display:flex;

                align-items:center;

                justify-content:center;
            }


            #${FOOTER_ID}
            .mn-footer-icono {

                width:30px;
                height:30px;

                display:flex;

                align-items:center;

                justify-content:center;
            }


            #${FOOTER_ID}
            .mn-footer-icono svg {

                width:30px;
                height:30px;

                display:block;

                fill:none;

                stroke:currentColor;

                pointer-events:none;
            }


            /* =========================================
               TEXTO
            ========================================== */

            #${FOOTER_ID}
            .mn-footer-label {

                margin-top:3px;

                font-size:16px;

                line-height:20px;

                font-weight:600;

                color:#777777;
            }


            /* =========================================
               PALOMITA
            ========================================== */

            #${FOOTER_ID}
            .mn-footer-check {

                position:absolute;

                top:-8px;
                right:-1px;

                display:none;

                color:#C83D7A;

                font-size:25px;

                line-height:25px;

                font-weight:700;
            }


            /* =========================================
               CONTADOR
            ========================================== */

            #${FOOTER_ID}
            .mn-footer-cart-count {

                position:absolute;

                top:7px;
                left:27px;

                color:#777777;

                font-size:16px;

                line-height:20px;

                font-weight:600;
            }


            /* =========================================
               ACTIVO
            ========================================== */

            #${FOOTER_ID}
            .mn-footer-item.activo {

                color:#C83D7A;
            }


            #${FOOTER_ID}
            .mn-footer-item.activo
            .mn-footer-label {

                color:#C83D7A;
            }


            #${FOOTER_ID}
            .mn-footer-item.activo
            .mn-footer-check {

                display:block;
            }


            /* =========================================
               ACCESIBILIDAD
            ========================================== */

            #${FOOTER_ID}
            .mn-footer-item:focus-visible {

                outline:
                    2px solid #C83D7A;

                outline-offset:-3px;

                border-radius:10px;
            }


            /* =========================================
               TABLET / DESKTOP
            ========================================== */

            @media (min-width:768px) {

                #${FOOTER_ID} {

                    max-width:520px;

                    margin:0 auto;

                    left:50%;
                    right:auto;

                    transform:
                        translateX(-50%);

                    width:100%;
                }

            }

        `;


        if (
            !document.getElementById(
                estilos.id
            )
        ) {

            document.head.appendChild(
                estilos
            );
        }


        // =================================================
        // INSERTAR FOOTER FUERA DE #app
        // =================================================

        document.body.appendChild(
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

    window.footer = {

        mostrar: crearFooter,

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