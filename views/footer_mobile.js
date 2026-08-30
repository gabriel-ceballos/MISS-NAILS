/**
 * FOOTER MÓVIL
 * Componente independiente.
 *
 * Única responsabilidad:
 * - Inicio
 * - Carrito
 * - Cuenta
 * - Indicador activo (✓)
 * - Permanecer fijo en la parte inferior
 *
 * NO depende de ninguna otra función del proyecto.
 */

(function () {
  'use strict';

  const FOOTER_ID = 'miss-nails-footer-mobile';

  function crearFooter() {

    // Evitar que exista más de un footer.
    const existente = document.getElementById(FOOTER_ID);

    if (existente) return existente;

    const footer = document.createElement('nav');

    footer.id = FOOTER_ID;
    footer.className = 'mn-footer-mobile';

    footer.setAttribute(
      'aria-label',
      'Navegación principal'
    );


    /* =========================================================
       ESTRUCTURA DEL FOOTER
       ========================================================= */

    footer.innerHTML = `

      <!-- =====================================================
           INICIO
           ===================================================== -->

      <button
        class="mn-footer-item activo"
        type="button"
        data-view="home"
        aria-label="Inicio"
        aria-current="page"
      >

        <span class="mn-footer-icono-wrap">

          <span class="mn-footer-icono home-icono">

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


          <!-- PALOMITA INICIO -->

          <span
            class="mn-footer-check"
            aria-hidden="true"
          >✓</span>

        </span>


        <span class="mn-footer-label">
          Inicio
        </span>

      </button>


      <!-- =====================================================
           CARRITO
           ===================================================== -->

      <button
        class="mn-footer-item"
        type="button"
        data-view="cart"
        aria-label="Carrito"
      >

        <span class="mn-footer-icono-wrap">

          <span class="mn-footer-icono cart-icono">

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


          <!-- CONTADOR DEL CARRITO -->

          <span
            class="mn-footer-cart-count"
            aria-label="Cantidad en carrito"
          >38</span>


          <!-- PALOMITA CARRITO -->

          <span
            class="mn-footer-check"
            aria-hidden="true"
          >✓</span>

        </span>


        <span class="mn-footer-label">
          Carrito
        </span>

      </button>


      <!-- =====================================================
           CUENTA
           ===================================================== -->

      <button
        class="mn-footer-item"
        type="button"
        data-view="account"
        aria-label="Cuenta"
      >

        <span class="mn-footer-icono-wrap">

          <span class="mn-footer-icono account-icono">

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


          <!-- PALOMITA CUENTA -->

          <span
            class="mn-footer-check"
            aria-hidden="true"
          >✓</span>

        </span>


        <span class="mn-footer-label">
          Cuenta
        </span>

      </button>

    `;


    /* =========================================================
       ESTILOS PROPIOS DEL FOOTER
       ========================================================= */

    const estilos = document.createElement('style');

    estilos.id =
      'miss-nails-footer-mobile-style';

    estilos.textContent = `

      #${FOOTER_ID} {

        position: fixed;

        left: 0;
        right: 0;
        bottom: 0;

        z-index: 9999;

        height: 112px;

        box-sizing: border-box;

        display: grid;

        grid-template-columns:
          repeat(3, 1fr);

        align-items: start;

        padding:
          14px 12px 8px;

        background: #ffffff;

        border-top:
          1px solid #eeeeee;

        box-shadow:
          0 -2px 8px
          rgba(0, 0, 0, 0.04);

        font-family:
          Arial,
          Helvetica,
          sans-serif;
      }


      /* =====================================================
         BOTONES
         ===================================================== */

      #${FOOTER_ID}
      .mn-footer-item {

        position: relative;

        width: 100%;

        height: 90px;

        margin: 0;

        padding: 0;

        display: flex;

        flex-direction: column;

        align-items: center;

        justify-content: flex-start;

        gap: 4px;

        border: 0;

        outline: 0;

        background: transparent;

        color: #777777;

        cursor: pointer;

        -webkit-tap-highlight-color:
          transparent;
      }


      /* =====================================================
         CONTENEDOR DEL ICONO
         ===================================================== */

      #${FOOTER_ID}
      .mn-footer-icono-wrap {

        position: relative;

        width: 42px;

        height: 45px;

        display: flex;

        align-items: center;

        justify-content: center;
      }


      /* =====================================================
         ICONOS
         ===================================================== */

      #${FOOTER_ID}
      .mn-footer-icono {

        width: 32px;

        height: 32px;

        display: flex;

        align-items: center;

        justify-content: center;
      }


      #${FOOTER_ID}
      .mn-footer-icono svg {

        width: 32px;

        height: 32px;

        display: block;
      }


      /* =====================================================
         TEXTO
         ===================================================== */

      #${FOOTER_ID}
      .mn-footer-label {

        font-size: 16px;

        line-height: 20px;

        font-weight: 600;

        color: #777777;
      }


      /* =====================================================
         PALOMITA
         ===================================================== */

      #${FOOTER_ID}
      .mn-footer-check {

        position: absolute;

        top: -8px;

        right: -1px;

        display: none;

        color: #c83d7a;

        font-size: 25px;

        line-height: 25px;

        font-weight: 700;
      }


      /* =====================================================
         CONTADOR CARRITO
         ===================================================== */

      #${FOOTER_ID}
      .mn-footer-cart-count {

        position: absolute;

        top: 7px;

        left: 27px;

        color: #777777;

        font-size: 21px;

        line-height: 24px;

        font-weight: 600;
      }


      /* =====================================================
         ELEMENTO ACTIVO
         ===================================================== */

      #${FOOTER_ID}
      .mn-footer-item.activo {

        color: #c83d7a;
      }


      #${FOOTER_ID}
      .mn-footer-item.activo
      .mn-footer-label {

        color: #c83d7a;
      }


      #${FOOTER_ID}
      .mn-footer-item.activo
      .mn-footer-check {

        display: block;
      }


      /* =====================================================
         ACCESIBILIDAD
         ===================================================== */

      #${FOOTER_ID}
      .mn-footer-item:focus-visible {

        outline:
          2px solid #c83d7a;

        outline-offset: -3px;

        border-radius: 10px;
      }


      /* =====================================================
         TABLET
         ===================================================== */

      @media (min-width: 768px) {

        #${FOOTER_ID} {

          max-width: 520px;

          margin: 0 auto;

          left: 50%;

          right: auto;

          transform:
            translateX(-50%);

          width: 100%;
        }

      }

    `;


    /* =========================================================
       INSERTAR ESTILOS
       ========================================================= */

    if (
      !document.getElementById(
        estilos.id
      )
    ) {

      document.head.appendChild(
        estilos
      );

    }


    /* =========================================================
       INSERTAR FOOTER
       ========================================================= */

    document.body.appendChild(
      footer
    );


    /* =========================================================
       EVENTOS PROPIOS DEL FOOTER
       ========================================================= */

    const botones =
      footer.querySelectorAll(
        '.mn-footer-item'
      );


    botones.forEach(
      function (boton) {

        boton.addEventListener(
          'click',
          function () {

            /*
             * Quitar estado activo
             * de los tres botones.
             */

            botones.forEach(
              function (item) {

                item.classList.remove(
                  'activo'
                );

                item.removeAttribute(
                  'aria-current'
                );

              }
            );


            /*
             * Activar solamente
             * el botón seleccionado.
             */

            boton.classList.add(
              'activo'
            );

            boton.setAttribute(
              'aria-current',
              'page'
            );

          }
        );

      }
    );

  }


  /* ===========================================================
     INICIO DEL COMPONENTE
     =========================================================== */

  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      crearFooter,
      {
        once: true
      }
    );

  } else {

    crearFooter();

  }

})();