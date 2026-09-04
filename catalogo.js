const catalogo = {

    // =====================================================
    // MOSTRAR CATÁLOGO
    // =====================================================

    async mostrar() {

        const app =
            document.getElementById("app");

        if (!app) {

            console.error(
                "CATALOGO → no existe #app"
            );

            return;
        }


        /*
         * Si venimos de otra vista y tenemos
         * un catálogo guardado, lo restauramos.
         */

    if (
    logicaCatalogo.estadoCatalogo &&
    logicaCatalogo.restaurarEstado()
) {

    this.inicializarEventos();
    this.inicializarHistorial();

    /*
     * El estado restaurado NO contiene mn-horizontal
     * ni mn-vertical.
     *
     * Volvemos a aplicar inmediatamente la orientación
     * real del viewport actual.
     */
    if (
        window.app &&
        typeof window.app.actualizarOrientacion ===
            "function"
    ) {

        window.app.actualizarOrientacion();
    }

    logicaCatalogo.iniciarSincronizacion();

    console.log(
        "CATALOGO → vista restaurada"
    );

    return;
}


        // =================================================
        // ESTRUCTURA
        // =================================================

        app.innerHTML = `

            <div class="mobile">

                <!-- =====================================
                     ENCABEZADO
                ====================================== -->

                <header class="mobile-header">

                    <div class="mobile-logo">

                        <img
                            src="img/logo.png"
                            alt="Miss Nails">

                    </div>


                    <button
                        id="btnNotificaciones"
                        class="mobile-notificaciones"
                        type="button"
                        aria-label="Notificaciones">

                        <svg
                            class="icono-notificacion"
                            viewBox="0 0 24 24"
                            aria-hidden="true">

                            <path
                                d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9">
                            </path>

                            <path
                                d="M10 21h4">
                            </path>

                        </svg>

                    </button>

                </header>


                <!-- =====================================
                     BUSCADOR
                ====================================== -->

                <section class="mobile-buscador">

                    <input
                        type="search"
                        id="txtBuscar"
                        placeholder="Buscar productos..."
                        autocomplete="off">

                </section>


                <!-- =====================================
                     CATEGORÍAS
                ====================================== -->

                <section
                    class="mobile-categorias"
                    id="categorias">

                    <button
                        class="mobile-categoria activa"
                        type="button"
                        data-categoria="">
                        Todas
                    </button>


                    <button
                        class="mobile-categoria"
                        type="button"
                        data-categoria="GEL">
                        Gel
                    </button>


                    <button
                        class="mobile-categoria"
                        type="button"
                        data-categoria="RUBBER">
                        Rubber
                    </button>


                    <button
                        class="mobile-categoria"
                        type="button"
                        data-categoria="ACRILICOS">
                        Acrílicos
                    </button>


                    <button
                        class="mobile-categoria"
                        type="button"
                        data-categoria="TOP COAT">
                        Top Coat
                    </button>


                    <button
                        class="mobile-categoria"
                        type="button"
                        data-categoria="PROMOCIONES">
                        Promociones
                    </button>

                </section>


                <!-- =====================================
                     CATÁLOGO
                ====================================== -->

                <main
                    class="mobile-parte-catalogo">

                    <div
                        class="productos mobile-productos"
                        id="productos">
                    </div>

                </main>


                <!-- =====================================
                     ESPACIO DEL FOOTER
                ====================================== -->

                <section
                    class="mobile-parte-inferior"
                    aria-hidden="true">

                    <div
                        class="mobile-footer-zone">
                    </div>

                </section>

            </div>
        `;


        // =================================================
        // EVENTOS
        // =================================================

        this.inicializarEventos();

        this.inicializarHistorial();


        // =================================================
        // CARGAR PRODUCTOS
        // =================================================

        const resultado =
            await logicaCatalogo.cargarProductos();


        if (!resultado.ok) {

            this.mostrarError(
                resultado.mensaje
            );

            return;
        }


        this.renderizar();



            logicaCatalogo.guardarEstado();


        // =================================================
        // SINCRONIZACIÓN
        // =================================================

        logicaCatalogo.iniciarSincronizacion();
    },


    // =====================================================
    // EVENTOS
    // =====================================================

    inicializarEventos() {

        // -----------------------------------------------
        // BUSCADOR
        // -----------------------------------------------

        const buscador =
            document.getElementById("txtBuscar");


        if (buscador) {

            /*
             * Evita duplicar eventos cuando
             * restauramos la vista.
             */

            buscador.oninput =
                evento => {

                    logicaCatalogo.textoBusqueda =
                        evento.target.value
                            .trim()
                            .toLowerCase();

                    this.renderizar();
                };
        }


        // -----------------------------------------------
        // CATEGORÍAS
        // -----------------------------------------------

        const categorias =
            document.querySelectorAll(
                ".mobile-categoria"
            );


        categorias.forEach(
            boton => {

                boton.onclick =
                    () => {

                        categorias.forEach(
                            item =>
                                item.classList.remove(
                                    "activa"
                                )
                        );


                        boton.classList.add(
                            "activa"
                        );


                        logicaCatalogo.filtroCategoria =
                            String(
                                boton.dataset.categoria ||
                                ""
                            )
                            .trim()
                            .toUpperCase();


                        this.renderizar();
                    };
            }
        );


        // -----------------------------------------------
        // PRODUCTOS
        // -----------------------------------------------

        const productos =
            document.getElementById(
                "productos"
            );


        if (!productos) {
            return;
        }


        productos.onclick =
            evento => {


                // =======================================
                // CARRITO RÁPIDO
                // =======================================

                const botonCarrito =
                    evento.target.closest(
                        ".btnCarritoRapido"
                    );


                if (botonCarrito) {

                    const id =
                        botonCarrito.dataset.id;


                    const producto =
                        logicaCatalogo.obtenerProducto(
                            id
                        );


                    if (
                        producto &&
                        window.carrito &&
                        typeof window.carrito.agregar ===
                        "function"
                    ) {

                        window.carrito.agregar(
                            producto,
                            1
                        );

                    } else {

                        console.warn(
                            "CATALOGO → carrito todavía no está disponible"
                        );
                    }


                    return;
                }


                // =======================================
                // TARJETA
                // =======================================

                const tarjeta =
                    evento.target.closest(
                        ".producto"
                    );


                if (!tarjeta) {
                    return;
                }


                const id =
                    tarjeta.dataset.id;


                const producto =
                    logicaCatalogo.obtenerProducto(
                        id
                    );


                if (!producto) {

                    console.warn(
                        "CATALOGO → producto no encontrado:",
                        id
                    );

                    return;
                }


                console.log(
                    "CATALOGO → abrir detalle:",
                    producto
                );


                logicaCatalogo.guardarEstado();


                this.mostrarDetalleProducto(
                    producto
                );
            };
    },


    // =====================================================
    // RENDERIZAR
    // =====================================================

    renderizar() {

        const contenedor =
            document.getElementById(
                "productos"
            );


        if (!contenedor) {

            console.error(
                "CATALOGO → no existe #productos"
            );

            return;
        }


        const lista =
            logicaCatalogo.obtenerFiltrados();


        if (!lista.length) {

            contenedor.innerHTML = `

                <div class="estado-vacio">

                    <strong>
                        No hay productos disponibles
                    </strong>

                    <span>
                        No se encontraron productos.
                    </span>

                </div>
            `;

            return;
        }


        contenedor.innerHTML =
            lista
                .map(
                    producto =>
                        this.crearProducto(
                            producto
                        )
                )
                .join("");


        console.log(
            "CATALOGO → productos mostrados:",
            lista.length
        );
    },


    // =====================================================
    // TARJETA DE PRODUCTO
    // =====================================================

    crearProducto(producto) {

        const id =
            producto.id ?? "";


        const nombre =
            producto.nombre ||
            "Producto sin nombre";


        let precio =
            producto.precio;


        if (
            typeof precio ===
            "string"
        ) {

            precio =
                precio
                    .replace(/\$/g, "")
                    .replace(/\s/g, "")
                    .replace(",", ".");
        }


        precio =
            Number(precio) || 0;


        const inventario =
            Number(
                producto.inventario
            ) || 0;


        const categoria =
            producto.categoria ||
            "";


        const codigo =
            producto.codigo ||
            "";


        const escape =
            logicaCatalogo.escape;


        return `

            <article
                class="producto"
                data-id="${escape(id)}"
                data-categoria="${escape(categoria)}"
                data-codigo="${escape(codigo)}">


                <!-- ===============================
                     IMAGEN
                ================================= -->

                <div class="foto">

                    ${
                        producto.imagen

                        ?

                        `

                        <img
                            src="https://drive.google.com/thumbnail?id=${escape(producto.imagen)}&sz=w800"
                            class="fotoProducto"
                            alt="${escape(nombre)}">


                        <button
                            class="btnCarritoRapido"
                            type="button"
                            data-id="${escape(id)}"
                            aria-label="Agregar al carrito">

                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true">

                                <path
                                    d="M3 4
                                       H5
                                       L7 15
                                       H18
                                       L21 7
                                       H6">
                                </path>

                                <circle
                                    cx="9"
                                    cy="19"
                                    r="1.2">
                                </circle>

                                <circle
                                    cx="17"
                                    cy="19"
                                    r="1.2">
                                </circle>

                                <path
                                    d="M17 3
                                       V7
                                       M14.5 5
                                       H19.5">
                                </path>

                            </svg>

                        </button>

                        `

                        :

                        `

                        <div class="producto-sin-imagen">

                            <span>
                                SIN IMAGEN
                            </span>

                        </div>

                        `
                    }

                </div>


                <!-- ===============================
                     INFORMACIÓN
                ================================= -->

                <div class="producto__contenido">

                    <h3>
                        ${escape(nombre)}
                    </h3>


                    <div class="producto__detalle">
                        ${escape(categoria)}
                    </div>


                    <div class="producto__meta">
                        Disponible:
                        ${inventario}
                    </div>


                    <div class="precio">
                        $${precio.toFixed(2)}
                    </div>

                </div>

            </article>
        `;
    },


    // =====================================================
    // DETALLE DEL PRODUCTO
    // =====================================================

    mostrarDetalleProducto(
        producto,
        restaurado = false
    ) {

        const app =
            document.getElementById(
                "app"
            );


        if (!app) {

            console.error(
                "CATALOGO → no existe #app"
            );

            return;
        }


        logicaCatalogo.vistaActual =
            "detalle";


        // -----------------------------------------------
        // HISTORIAL
        // -----------------------------------------------

        if (!restaurado) {

            history.pushState(
                {
                    vista: "detalle",
                    productoId: producto.id
                },
                "",
                "#producto-" +
                producto.id
            );

        } else {

            history.replaceState(
                {
                    vista: "detalle",
                    productoId: producto.id
                },
                "",
                "#producto-" +
                producto.id
            );
        }


        const nombre =
            producto.nombre ||
            "Producto sin nombre";


        let precio =
            producto.precio;


        if (
            typeof precio ===
            "string"
        ) {

            precio =
                precio
                    .replace(/\$/g, "")
                    .replace(/\s/g, "")
                    .replace(",", ".");
        }


        precio =
            Number(precio) || 0;


        const inventario =
            Number(
                producto.inventario
            ) || 0;


        const categoria =
            producto.categoria ||
            "";


        const imagen =
            producto.imagen ||
            "";


        const escape =
            logicaCatalogo.escape;


        app.innerHTML = `

            <div
                class="mobile-detalle-producto">


                <header
                    class="mobile-detalle-header">


                    <button
                        id="btnRegresarProductos"
                        type="button"
                        class="mobile-detalle-regresar"
                        aria-label="Regresar">

                        ←

                    </button>


                    <h2>
                        Producto
                    </h2>

                </header>


                <main
                    class="mobile-detalle-contenido">


                    <div
                        class="mobile-detalle-imagen">

                        ${
                            imagen

                            ?

                            `

                            <img
                                src="https://drive.google.com/thumbnail?id=${escape(imagen)}&sz=w1200"
                                alt="${escape(nombre)}">

                            `

                            :

                            `

                            <div
                                class="producto-sin-imagen">

                                <span>
                                    SIN IMAGEN
                                </span>

                            </div>

                            `
                        }

                    </div>


                    <div
                        class="mobile-detalle-informacion">


                        <div
                            class="mobile-detalle-categoria">

                            ${escape(categoria)}

                        </div>


                        <h1>
                            ${escape(nombre)}
                        </h1>


                        <div
                            class="mobile-detalle-precio">

                            $${precio.toFixed(2)}

                        </div>


                        <div
                            class="mobile-detalle-inventario">

                            Disponible:
                            ${inventario}

                        </div>


                        <div
                            class="mobile-detalle-separador">
                        </div>


                        <div
                            class="mobile-detalle-acciones">


                            <button
                                id="btnAgregarDetalle"
                                type="button"
                                class="mobile-detalle-carrito">

                                🛒
                                Agregar al carrito

                            </button>


                        </div>

                    </div>

                </main>

            </div>
        `;


        // -----------------------------------------------
        // REGRESAR
        // -----------------------------------------------

        const regresar =
            document.getElementById(
                "btnRegresarProductos"
            );


        if (regresar) {

            regresar.onclick =
                () => {

                    history.back();
                };
        }


        // -----------------------------------------------
        // AGREGAR AL CARRITO
        // -----------------------------------------------

        const agregar =
            document.getElementById(
                "btnAgregarDetalle"
            );


        if (agregar) {

            agregar.onclick =
                () => {

                    if (
                        window.carrito &&
                        typeof window.carrito.agregar ===
                        "function"
                    ) {

                        window.carrito.agregar(
                            producto,
                            1
                        );

                    } else {

                        console.warn(
                            "CATALOGO → carrito todavía no está disponible"
                        );
                    }
                };
        }
    },


    // =====================================================
    // HISTORIAL
    // =====================================================

    inicializarHistorial() {

        if (
            logicaCatalogo.historialInicializado
        ) {
            return;
        }


        window.addEventListener(
            "popstate",
            () => {

                if (
                    logicaCatalogo.vistaActual ===
                    "detalle"
                ) {

                    if (
                        logicaCatalogo.restaurarEstado()
                    ) {

                        logicaCatalogo.vistaActual =
                            "catalogo";

                        this.inicializarEventos();
                    }
                }
            }
        );


        logicaCatalogo.historialInicializado =
            true;


        console.log(
            "CATALOGO → historial inicializado"
        );
    },


    // =====================================================
    // ERROR
    // =====================================================

    mostrarError(mensaje) {

        const contenedor =
            document.getElementById(
                "productos"
            );


        if (!contenedor) {
            return;
        }


        const escape =
            logicaCatalogo.escape;


        contenedor.innerHTML = `

            <div class="estado-vacio">

                <strong>
                    No se pudieron cargar los productos
                </strong>

                <span>
                    ${escape(mensaje)}
                </span>

            </div>
        `;
    }
};


window.catalogo =
    catalogo;