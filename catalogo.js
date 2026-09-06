const catalogo = {

    listaRenderizada: [],
    indiceRender: 0,
    capacidadViewport: 0,
    bloqueRender: 0,
    manejadorScroll: null,
    cargandoBloque: false,
    ultimoScrollTopCarga: -1,
    umbralScrollCarga: 120,

    // =====================================================
    // MOSTRAR CATÁLOGO
    // =====================================================

    async mostrar() {

        const inicioArranqueCatalogo = performance.now();

        console.log(
            "CATALOGO → INICIO ARRANQUE"
        );

        const app =
            document.getElementById("app");

        if (!app) {

            console.error(
                "CATALOGO → no existe #app"
            );

            return;
        }

        /*
         * BLINDAJE DE MONTAJE
         *
         * Si el catálogo ya está montado, una llamada repetida
         * a mostrar() no debe destruirlo ni volver a cargarlo.
         * Esto permite que la sincronización, orientación o
         * navegación repetida no reinicien la carga progresiva.
         */
        if (
            logicaCatalogo.vistaActual === "catalogo" &&
            document.getElementById("productos")
        ) {
            console.log(
                "CATALOGO → mostrar omitido: catálogo ya montado"
            );
            return;
        }

        logicaCatalogo.vistaActual = "catalogo";


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


            const inicioRender =
                performance.now();

            this.renderizar();

            console.log(
                "CATALOGO → renderizado en",
                Math.round(
                    performance.now() -
                    inicioRender
                ),
                "ms"
            );

            logicaCatalogo.guardarEstado();

            const tiempoDisponible = Math.round(
                performance.now() -
                inicioArranqueCatalogo
            );

            console.log(
                "CATALOGO → ARRANQUE COMPLETADO",
                "| tiempo total:",
                tiempoDisponible,
                "ms",
                "| tarjetas iniciales:",
                this.indiceRender,
                "| productos totales recibidos:",
                this.listaRenderizada.length,
                "| capacidad viewport:",
                this.capacidadViewport,
                "| bloque:",
                this.bloqueRender
            );

            console.log(
                "CATALOGO → DISPONIBLE PARA EL USUARIO EN",
                tiempoDisponible,
                "ms",
                "| tarjetas iniciales:",
                this.indiceRender,
                "| productos totales:",
                this.listaRenderizada.length
            );


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
                            logicaCatalogo.productoParaCarrito(producto),
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
            document.getElementById("productos");

        if (!contenedor) {
            console.error(
                "CATALOGO → no existe #productos"
            );
            return;
        }

        const lista =
            logicaCatalogo.obtenerFiltrados();

        // Si la misma lista ya está renderizada, no reconstruimos
        // el catálogo. Esto permite que una sincronización de inventario
        // o una nueva entrada a la vista conserve la carga progresiva.
        const mismaLista =
            Array.isArray(this.listaRenderizada) &&
            this.listaRenderizada.length === lista.length &&
            this.listaRenderizada.every((producto, indice) =>
                String(producto?.id ?? "") ===
                String(lista[indice]?.id ?? "")
            );

        if (mismaLista && contenedor.querySelector(".producto[data-id]")) {
            this.listaRenderizada = lista;
            this.actualizarInventarioVisible();
            console.log(
                "CATALOGO → render omitido: lista sin cambios; se conserva carga progresiva"
            );
            return;
        }

        if (!lista.length) {
            contenedor.innerHTML = `
                <div class="estado-vacio">
                    <strong>No hay productos disponibles</strong>
                    <span>No se encontraron productos.</span>
                </div>
            `;
            this.listaRenderizada = [];
            this.indiceRender = 0;
            return;
        }

        this.listaRenderizada = lista;
        this.indiceRender = 0;
        this.bloqueRender = 0;
        this.capacidadViewport = 0;

        contenedor.innerHTML = "";
        this.cargarBloqueInicial();
    },


    // =====================================================
    // CARGA PROGRESIVA SEGÚN CAPACIDAD REAL DEL VIEWPORT
    // =====================================================

    calcularCapacidadViewport() {

        const contenedor =
            document.getElementById("productos");

        if (!contenedor) return 1;

        const alturaDisponible = contenedor.clientHeight;

        if (alturaDisponible <= 0) return 1;

        const columnas = Math.max(
            1,
            getComputedStyle(contenedor)
                .gridTemplateColumns
                .split(" ")
                .filter(Boolean)
                .length
        );

        // Medimos una tarjeta real para no inventar una altura.
        const muestra = this.listaRenderizada[0];
        contenedor.innerHTML = this.crearProducto(muestra);

        const tarjeta = contenedor.querySelector(".producto");
        const estilo = tarjeta
            ? getComputedStyle(tarjeta)
            : null;

        const alturaTarjeta = tarjeta
            ? tarjeta.getBoundingClientRect().height +
              parseFloat(estilo?.marginBottom || 0)
            : 1;

        const filasVisibles = Math.max(
            1,
            Math.ceil(alturaDisponible / Math.max(1, alturaTarjeta))
        );

        const capacidad = filasVisibles * columnas;

        console.log(
            "CATALOGO → capacidad viewport:",
            capacidad,
            "| columnas:",
            columnas,
            "| filas:",
            filasVisibles
        );

        return capacidad;
    },


    cargarBloqueInicial() {

        const contenedor =
            document.getElementById("productos");

        if (!contenedor || !this.listaRenderizada?.length) return;

        const capacidad =
            this.calcularCapacidadViewport();

        this.capacidadViewport = capacidad;

        const cantidadInicial = Math.min(
            this.listaRenderizada.length,
            capacidad * 2
        );

        contenedor.innerHTML =
            this.listaRenderizada
                .slice(0, cantidadInicial)
                .map(producto => this.crearProducto(producto))
                .join("");

        this.indiceRender = cantidadInicial;
        this.bloqueRender = 1;
        this.cargandoBloque = false;
        this.ultimoScrollTopCarga = contenedor.scrollTop;

        console.log(
            "CATALOGO → bloque inicial:",
            cantidadInicial,
            "de",
            this.listaRenderizada.length
        );

        this.prepararCargaPorScroll();
    },


    actualizarInventarioVisible() {

        const contenedor =
            document.getElementById("productos");

        if (!contenedor) return;

        const tarjetas =
            contenedor.querySelectorAll(".producto[data-id]");

        let actualizadas = 0;

        tarjetas.forEach(tarjeta => {

            const id = tarjeta.dataset.id;

            const inventario =
                logicaCatalogo.obtenerInventario(id);

            const meta =
                tarjeta.querySelector(".producto__meta");

            if (meta) {
                meta.textContent =
                    `Disponible: ${inventario}`;
                actualizadas++;
            }
        });

        console.log(
            "CATALOGO → inventario visible actualizado:",
            actualizadas
        );
    },


    cargarSiguienteBloque() {

        const contenedor =
            document.getElementById("productos");

        if (
            !contenedor ||
            !this.listaRenderizada?.length ||
            this.indiceRender >= this.listaRenderizada.length
        ) {
            return;
        }

        const cantidad = Math.max(
            1,
            this.capacidadViewport * 2
        );

        const siguiente =
            this.listaRenderizada.slice(
                this.indiceRender,
                this.indiceRender + cantidad
            );

        const inicioBloque = performance.now();

        contenedor.insertAdjacentHTML(
            "beforeend",
            siguiente
                .map(producto => this.crearProducto(producto))
                .join("")
        );

        this.indiceRender += siguiente.length;
        this.bloqueRender++;

        console.log(
            "CATALOGO → siguiente bloque:",
            siguiente.length,
            "| construidos:",
            this.indiceRender,
            "de",
            this.listaRenderizada.length,
            "| render bloque:",
            Math.round(performance.now() - inicioBloque),
            "ms"
        );
    },


    prepararCargaPorScroll() {

        const contenedor =
            document.getElementById("productos");

        if (!contenedor) return;

        if (this.manejadorScroll) {
            contenedor.removeEventListener(
                "scroll",
                this.manejadorScroll
            );
        }

        this.manejadorScroll = () => {

            const cercaDelFinal =
                contenedor.scrollTop +
                contenedor.clientHeight >=
                contenedor.scrollHeight -
                Math.max(
                    160,
                    contenedor.clientHeight
                );

            /*
             * Una sola ampliación por avance real del scroll.
             * Después de insertar tarjetas el navegador puede
             * emitir nuevos eventos scroll aunque el usuario no
             * haya avanzado. Sin este control se podían encadenar
             * todos los bloques hasta construir los 1346 productos.
             */
            const scrollAvanzo =
                contenedor.scrollTop -
                this.ultimoScrollTopCarga >=
                this.umbralScrollCarga;

            if (
                cercaDelFinal &&
                scrollAvanzo &&
                !this.cargandoBloque
            ) {
                this.cargandoBloque = true;
                this.ultimoScrollTopCarga =
                    contenedor.scrollTop;

                this.cargarSiguienteBloque();

                this.cargandoBloque = false;
            }
        };

        contenedor.addEventListener(
            "scroll",
            this.manejadorScroll,
            { passive: true }
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
            logicaCatalogo.obtenerInventario(
                producto.id
            );


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
            logicaCatalogo.obtenerInventario(
                producto.id
            );


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
                            logicaCatalogo.productoParaCarrito(producto),
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