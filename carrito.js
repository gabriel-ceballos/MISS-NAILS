/* =========================================================
   MISS NAILS — VISTA DEL CARRITO

   Responsabilidad:
   - Construir la vista.
   - Capturar acciones del usuario.
   - Delegar toda la lógica a logicaCarrito.
   ========================================================= */

const carrito = {

    vistaActual: "carrito",

    mostrar() {
        const app =
            document.getElementById("app");

        if (!app) {
            console.error(
                "CARRITO → no existe #app"
            );
            return;
        }

        if (
            !window.logicaCarrito
        ) {
            console.error(
                "CARRITO → lógica no disponible"
            );
            return;
        }

        logicaCarrito.cargar();
        logicaCarrito.sincronizarConCatalogo();

        this.vistaActual = "carrito";

        app.innerHTML =
            this.construirVista();

        this.inicializarEventos();
        this.aplicarOrientacion();

        if (
            window.footer &&
            typeof window.footer.activar ===
            "function"
        ) {
            window.footer.activar("carrito");
        }

        if (
            window.app &&
            typeof window.app.sincronizarFooter ===
            "function"
        ) {
            window.app.sincronizarFooter();
        }

        logicaCarrito.actualizarContador();

        console.log(
            "CARRITO → vista mostrada:",
            logicaCarrito.totalUnidades(),
            "unidades"
        );
    },

    /*
     * Este método existe deliberadamente porque
     * catalogo.js ya utiliza window.carrito.agregar().
     *
     * La regla real permanece en logicaCarrito.
     */
    agregar(producto, cantidad = 1) {
        const agregado =
            logicaCarrito.agregar(
                producto,
                cantidad
            );

        if (agregado) {
            logicaCarrito.actualizarContador();
        }

        return agregado;
    },

    construirVista() {
        const items =
            logicaCarrito.items;

        if (!items.length) {
            return `
                <div
                    class="mobile mobile-carrito mn-vertical"
                    style="
                        display:flex;
                        flex-direction:column;
                        min-height:100%;
                        background:#F5F6F8;
                    ">

                    <header
                        class="mobile-detalle-header">

                        <button
                            id="btnRegresarCarrito"
                            type="button"
                            class="mobile-detalle-regresar"
                            aria-label="Regresar">
                            ←
                        </button>

                        <h2>Carrito</h2>

                    </header>

                    <main
                        class="mobile-detalle-contenido"
                        style="
                            flex:1;
                            display:flex;
                            flex-direction:column;
                            align-items:center;
                            justify-content:center;
                            text-align:center;
                            padding:32px 20px;
                            box-sizing:border-box;
                        ">

                        <div
                            style="
                                font-size:54px;
                                margin-bottom:16px;
                            ">
                            🛒
                        </div>

                        <h2
                            style="
                                margin:0 0 8px;
                            ">
                            Tu carrito está vacío
                        </h2>

                        <p
                            style="
                                margin:0;
                                color:#687083;
                            ">
                            Agrega productos desde el catálogo.
                        </p>

                        <button
                            id="btnContinuarCompraVacio"
                            type="button"
                            style="
                                margin-top:24px;
                                border:0;
                                border-radius:12px;
                                padding:12px 20px;
                                font-weight:700;
                                background:#C93E77;
                                color:#fff;
                            ">
                            Ir al catálogo
                        </button>

                    </main>

                </div>
            `;
        }

        const filas =
            items.map(
                item => this.crearFila(item)
            ).join("");

        const total =
            logicaCarrito.total();

        return `
            <div
                class="mobile mobile-carrito mn-vertical"
                style="
                    display:flex;
                    flex-direction:column;
                    min-height:100%;
                    background:#F5F6F8;
                ">

                <header
                    class="mobile-detalle-header">

                    <button
                        id="btnRegresarCarrito"
                        type="button"
                        class="mobile-detalle-regresar"
                        aria-label="Regresar">
                        ←
                    </button>

                    <h2>Carrito</h2>

                    <span
                        style="
                            font-size:12px;
                            color:#687083;
                        ">
                        ${logicaCarrito.totalUnidades()}
                        ${logicaCarrito.totalUnidades() === 1
                            ? "producto"
                            : "productos"}
                    </span>

                </header>

                <main
                    style="
                        flex:1;
                        overflow-y:auto;
                        padding:14px 12px 24px;
                        box-sizing:border-box;
                    ">

                    <section
                        aria-label="Productos del carrito">

                        ${filas}

                    </section>

                    <section
                        style="
                            background:#fff;
                            border-radius:16px;
                            padding:16px;
                            margin-top:14px;
                            box-shadow:
                                0 1px 5px
                                rgba(0,0,0,.05);
                        ">

                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                                align-items:center;
                                font-size:16px;
                                font-weight:800;
                            ">

                            <span>Subtotal</span>

                            <span
                                style="
                                    color:#C93E77;
                                ">
                                $${total.toFixed(2)}
                            </span>

                        </div>

                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                                align-items:center;
                                margin-top:8px;
                                font-size:18px;
                                font-weight:800;
                            ">

                            <span>Total</span>

                            <span
                                style="
                                    color:#C93E77;
                                ">
                                $${total.toFixed(2)}
                            </span>

                        </div>

                    </section>

                    <button
                        id="btnContinuarCompra"
                        type="button"
                        style="
                            width:100%;
                            margin-top:14px;
                            border:0;
                            border-radius:14px;
                            padding:14px;
                            font-size:15px;
                            font-weight:800;
                            background:#C93E77;
                            color:#fff;
                        ">
                        Continuar comprando
                    </button>

                </main>

            </div>
        `;
    },

    crearFila(item) {
        const precio =
            logicaCarrito.numero(
                item.precio
            );

        const cantidad =
            Math.max(
                0,
                Math.floor(
                    logicaCarrito.numero(
                        item.cantidad
                    )
                )
            );

        const subtotal =
            precio * cantidad;

        const inventario =
            Math.max(
                0,
                Math.floor(
                    logicaCarrito.numero(
                        item.inventario
                    )
                )
            );

        const nombre =
            this.escape(item.nombre);

        const imagen =
            item.imagen
                ? `
                    <img
                        src="https://drive.google.com/thumbnail?id=${encodeURIComponent(item.imagen)}&sz=w300"
                        alt="${nombre}"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                        ">
                  `
                : `
                    <span
                        style="
                            font-size:9px;
                            color:#8a8f9c;
                        ">
                        SIN IMAGEN
                    </span>
                  `;

        const bloqueInventario =
            inventario <= 0
                ? `
                    <span
                        style="
                            display:block;
                            margin-top:5px;
                            color:#b3261e;
                            font-size:11px;
                            font-weight:700;
                        ">
                        Sin inventario disponible
                    </span>
                  `
                : `
                    <span
                        style="
                            display:block;
                            margin-top:5px;
                            color:#687083;
                            font-size:11px;
                        ">
                        Disponible: ${inventario}
                    </span>
                  `;

        return `
            <article
                data-cart-item="${this.escape(item.id)}"
                style="
                    display:grid;
                    grid-template-columns:
                        64px minmax(0,1fr) auto;
                    gap:12px;
                    align-items:center;
                    background:#fff;
                    border-radius:16px;
                    padding:12px;
                    margin-bottom:10px;
                    box-shadow:
                        0 1px 5px
                        rgba(0,0,0,.06);
                ">

                <div
                    style="
                        width:64px;
                        height:64px;
                        border-radius:12px;
                        overflow:hidden;
                        background:#F5F6F8;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                    ">
                    ${imagen}
                </div>

                <div style="min-width:0;">

                    <strong
                        style="
                            display:block;
                            font-size:14px;
                            white-space:nowrap;
                            overflow:hidden;
                            text-overflow:ellipsis;
                        ">
                        ${nombre}
                    </strong>

                    <span
                        style="
                            display:block;
                            margin-top:4px;
                            font-size:13px;
                            color:#C93E77;
                            font-weight:700;
                        ">
                        $${precio.toFixed(2)}
                    </span>

                    ${bloqueInventario}

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:8px;
                            margin-top:9px;
                        ">

                        <button
                            type="button"
                            class="mn-cart-minus"
                            data-id="${this.escape(item.id)}"
                            aria-label="Disminuir cantidad"
                            style="
                                width:30px;
                                height:30px;
                                border:0;
                                border-radius:9px;
                                background:#F1F2F5;
                                font-size:18px;
                            ">
                            −
                        </button>

                        <strong
                            style="
                                min-width:20px;
                                text-align:center;
                            ">
                            ${cantidad}
                        </strong>

                        <button
                            type="button"
                            class="mn-cart-plus"
                            data-id="${this.escape(item.id)}"
                            aria-label="Aumentar cantidad"
                            ${cantidad >= inventario
                                ? "disabled"
                                : ""}
                            style="
                                width:30px;
                                height:30px;
                                border:0;
                                border-radius:9px;
                                background:#F1F2F5;
                                font-size:18px;
                                opacity:${cantidad >= inventario ? ".45" : "1"};
                            ">
                            +
                        </button>

                    </div>

                </div>

                <div style="text-align:right;">

                    <strong
                        style="
                            display:block;
                            font-size:14px;
                        ">
                        $${subtotal.toFixed(2)}
                    </strong>

                    <button
                        type="button"
                        class="mn-cart-delete"
                        data-id="${this.escape(item.id)}"
                        style="
                            display:block;
                            margin:10px 0 0 auto;
                            border:0;
                            background:transparent;
                            color:#C93E77;
                            font-size:12px;
                        ">
                        Eliminar
                    </button>

                </div>

            </article>
        `;
    },

    inicializarEventos() {
        const app =
            document.getElementById("app");

        if (!app) {
            return;
        }

        const regresar =
            document.getElementById(
                "btnRegresarCarrito"
            );

        if (regresar) {
            regresar.onclick = () => {
                this.irCatalogo();
            };
        }

        const continuar =
            document.getElementById(
                "btnContinuarCompra"
            ) ||
            document.getElementById(
                "btnContinuarCompraVacio"
            );

        if (continuar) {
            continuar.onclick = () => {
                this.irCatalogo();
            };
        }

        app.querySelectorAll(
            ".mn-cart-minus"
        ).forEach(boton => {
            boton.onclick = () => {
                const id = boton.dataset.id;
                const item =
                    logicaCarrito.obtener(id);

                if (!item) {
                    return;
                }

                if (
                    logicaCarrito.cambiarCantidad(
                        id,
                        item.cantidad - 1
                    )
                ) {
                    this.actualizarVistaSinHistorial();
                }
            };
        });

        app.querySelectorAll(
            ".mn-cart-plus"
        ).forEach(boton => {
            boton.onclick = () => {
                const id = boton.dataset.id;
                const item =
                    logicaCarrito.obtener(id);

                if (!item) {
                    return;
                }

                if (
                    logicaCarrito.cambiarCantidad(
                        id,
                        item.cantidad + 1
                    )
                ) {
                    this.actualizarVistaSinHistorial();
                }
            };
        });

        app.querySelectorAll(
            ".mn-cart-delete"
        ).forEach(boton => {
            boton.onclick = () => {
                logicaCarrito.eliminar(
                    boton.dataset.id
                );

                this.actualizarVistaSinHistorial();
            };
        });
    },

    irCatalogo() {
        if (
            window.app &&
            typeof window.app.ir ===
            "function"
        ) {
            window.app.ir("catalogo");
            return;
        }

        if (
            window.catalogo &&
            typeof window.catalogo.mostrar ===
            "function"
        ) {
            window.catalogo.mostrar();
            return;
        }

        history.back();
    },

    actualizarVistaSinHistorial() {
        const app =
            document.getElementById("app");

        if (!app) {
            return;
        }

        logicaCarrito.cargar();
        logicaCarrito.sincronizarConCatalogo();

        app.innerHTML =
            this.construirVista();

        this.inicializarEventos();
        this.aplicarOrientacion();

        if (
            window.footer &&
            typeof window.footer.activar ===
            "function"
        ) {
            window.footer.activar("carrito");
        }

        logicaCarrito.actualizarContador();
    },

    aplicarOrientacion() {
        if (
            window.app &&
            typeof
                window.app.actualizarOrientacion ===
                "function"
        ) {
            window.app.actualizarOrientacion();
        }
    },

    escape(valor) {
        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};

window.carrito = carrito;
