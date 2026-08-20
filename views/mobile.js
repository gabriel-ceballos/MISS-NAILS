const mobile = {

    productos: [],

    filtroCategoria: "",

    textoBusqueda: "",

    intervaloInventario: null,

     vistaActual: "catalogo",

    estadoCatalogo: null,

    historialInicializado: false,


    /*************************************************
     * MOSTRAR ESTRUCTURA MOBILE
     *************************************************/

    async mostrar() {

        const app = document.getElementById("app");

        app.innerHTML = `

            <div class="mobile">

                <!-- =================================
                     CABECERA
                ================================== -->

                <header class="mobile-header">

                    <div class="mobile-logo">

                        <img
                            src="img/logo.png"
                            alt="Miss Nails">

                    </div>

<button
    id="btnNotificaciones"
    class="mobile-notificaciones"
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


                <!-- =================================
                     BUSCADOR
                ================================== -->

                <section class="mobile-buscador">

                    <input
                        type="search"
                        id="txtBuscar"
                        placeholder="Buscar productos...">

                </section>


                <!-- =================================
                     CATEGORÍAS
                ================================== -->

                <section
                    class="mobile-categorias"
                    id="categorias">

                    <button
                        class="mobile-categoria activa"
                        data-categoria="">

                        Todas

                    </button>

                    <button
                        class="mobile-categoria"
                        data-categoria="GEL">

                        Gel

                    </button>

                    <button
                        class="mobile-categoria"
                        data-categoria="RUBBER">

                        Rubber

                    </button>

                    <button
                        class="mobile-categoria"
                        data-categoria="ACRILICOS">

                        Acrílicos

                    </button>

                    <button
                        class="mobile-categoria"
                        data-categoria="TOP COAT">

                        Top Coat

                    </button>

                    <button
                        class="mobile-categoria"
                        data-categoria="PROMOCIONES">

                        Promociones

                    </button>

                </section>


                <!-- =================================
                     PRODUCTOS
                     ÚNICA ZONA CON SCROLL
                ================================== -->

                 <main
                    class="productos mobile-productos"
                    id="productos">

                </main>


                <!-- =================================
                     NAVEGACIÓN INFERIOR
                ================================== -->

<nav class="mobile-footer">

    <button
        id="btnInicio"
        class="mobile-nav-item activo"
        type="button">

        <span class="mobile-nav-icon">

            <svg
                viewBox="0 0 24 24"
                aria-hidden="true">

                <path
                    d="M3 10.5
                       L12 3
                       L21 10.5
                       V20
                       H14
                       V14
                       H10
                       V20
                       H3
                       Z">
                </path>

            </svg>

            <span class="mobile-nav-check">✓</span>

        </span>

        <span class="mobile-nav-label">
            Inicio
        </span>

    </button>


    <button
        id="btnCarrito"
        class="mobile-nav-item"
        type="button">

        <span class="mobile-nav-icon">

            <svg
                viewBox="0 0 24 24"
                aria-hidden="true">

                <path
                    d="M3 4
                       H5
                       L7.2 15.5
                       H18.5
                       L21 7
                       H6">
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

            <span class="mobile-nav-check">✓</span>

        </span>

        <span class="mobile-nav-label">
            Carrito
        </span>

    </button>


    <button
        id="btnCuenta"
        class="mobile-nav-item"
        type="button">

        <span class="mobile-nav-icon">

            <svg
                viewBox="0 0 24 24"
                aria-hidden="true">

                <circle
                    cx="12"
                    cy="8"
                    r="4">
                </circle>

                <path
                    d="M4 21
                       C4.8 16.5
                       7.5 14
                       12 14
                       C16.5 14
                       19.2 16.5
                       20 21">
                </path>

            </svg>

            <span class="mobile-nav-check">✓</span>

        </span>

        <span class="mobile-nav-label">
            Cuenta
        </span>

    </button>

</nav>

            </div>

        `;


this.inicializarEventos();

this.inicializarHistorial();

console.log("MOBILE → solicitando productos");


        try {

            const respuesta = await api("productos");

            console.log(
                "MOBILE → respuesta productos",
                respuesta
            );


            if (!respuesta || !respuesta.ok) {

                console.error(
                    "MOBILE → error al obtener productos"
                );

                this.mostrarError(
                    respuesta?.mensaje ||
                    "No fue posible cargar los productos."
                );

                return;

            }


            this.productos =
                Array.isArray(respuesta.datos)
                    ? respuesta.datos
                    : [];


            console.log(
                "MOBILE → PRODUCTOS RECIBIDOS:",
                this.productos.length
            );


            this.renderizar();

             this.iniciarSincronizacion();


        } catch (error) {

            console.error(
                "MOBILE → ERROR:",
                error
            );

            this.mostrarError(
                "No fue posible cargar los productos."
            );

        }

    },


    /*************************************************
     * SINCRONIZACIÓN AUTOMÁTICA DE INVENTARIO
     *************************************************/

    iniciarSincronizacion() {

        /*
         * Evita crear más de un intervalo.
         */

        if (this.intervaloInventario) {

            clearInterval(
                this.intervaloInventario
            );

        }

        /*
         * Actualizar productos cada 10 segundos.
         */

        this.intervaloInventario =
            setInterval(
                () => this.sincronizarProductos(),
                10000
            );

        console.log(
            "MOBILE → sincronización automática iniciada"
        );

    },


    /*************************************************
     * CONSULTAR PRODUCTOS ACTUALIZADOS
     *************************************************/

    async sincronizarProductos() {

        try {

            const respuesta =
                await api("productos");


            if (!respuesta || !respuesta.ok) {

                console.warn(
                    "MOBILE → sincronización sin respuesta válida"
                );

                return;

            }


            const nuevosProductos =
                Array.isArray(respuesta.datos)
                    ? respuesta.datos
                    : [];


            /*
             * Reemplazar la información local
             * por la información actual del backend.
             */

            this.productos =
                nuevosProductos;


            /*
             * Volver a aplicar búsqueda/categoría
             * y actualizar solamente la zona
             * de productos.
             */

            this.renderizar();


            console.log(
                "MOBILE → inventario sincronizado:",
                nuevosProductos.length
            );


        } catch (error) {

            console.error(
                "MOBILE → error de sincronización:",
                error
            );

        }

    },








    /*************************************************
     * EVENTOS
     *************************************************/

    
    inicializarEventos() {

        const buscador =
            document.getElementById("txtBuscar");


        if (buscador) {

            buscador.addEventListener(
                "input",
                (evento) => {

                    this.textoBusqueda =
                        evento.target.value
                            .trim()
                            .toLowerCase();

                    this.renderizar();

                }
            );

        }


        const categorias =
            document.querySelectorAll(
                ".mobile-categoria"
            );


        categorias.forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    categorias.forEach(
                        item =>
                            item.classList.remove("activa")
                    );


                    boton.classList.add("activa");


                    this.filtroCategoria =
                        String(
                            boton.dataset.categoria || ""
                        )
                        .trim()
                        .toUpperCase();


                    this.renderizar();

                }
            );

        });




        /*
         * ============================================
         * CLICK EN TARJETA DE PRODUCTO
         * ============================================
         */

        const productos =
            document.getElementById("productos");


        if (productos) {

            productos.addEventListener(
                "click",
                (evento) => {

                    /*
                     * Si el clic ocurrió dentro del
                     * carrito rápido, no abrir detalle.
                     */

                   if (
    evento.target.closest(
        ".btnCarritoRapido"
    )
) {

    const botonCarrito =
        evento.target.closest(
            ".btnCarritoRapido"
        );

    const id =
        botonCarrito.dataset.id;

    const producto =
        this.productos.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (
        producto &&
        window.carritoMobile
    ) {

        window.carritoMobile.agregar(
            producto
        );

    }

    return;
}

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
                        this.productos.find(
                            item =>
                                String(item.id) ===
                                String(id)
                        );


                    if (!producto) {

                        console.warn(
                            "MOBILE → producto no encontrado:",
                            id
                        );

                        return;

                    }


                 console.log(
    "MOBILE → abrir detalle:",
    producto
);

this.guardarEstadoCatalogo();

this.mostrarDetalleProducto(
    producto
);

                }
            );

        }


                const navegacion =
            document.querySelectorAll(
                ".mobile-nav-item"
            );

        navegacion.forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    navegacion.forEach(item => {

                        item.classList.remove(
                            "activo"
                        );

                    });

                    boton.classList.add(
                        "activo"
                    );

                }
            );

        });

        

    },


    /*************************************************
     * FILTRAR PRODUCTOS
     *************************************************/

    obtenerFiltrados() {

        let lista = [...this.productos];


        /*
         * FILTRO POR CATEGORÍA
         */

        if (this.filtroCategoria) {

            lista = lista.filter(producto => {

                const categoria =
                    String(
                        producto.categoria || ""
                    )
                    .trim()
                    .toUpperCase();

                return categoria ===
                    this.filtroCategoria;

            });

        }


        /*
         * FILTRO POR BUSCADOR
         */

        if (this.textoBusqueda) {

            lista = lista.filter(producto => {

                const nombre =
                    String(
                        producto.nombre || ""
                    )
                    .toLowerCase();

                const sku =
                    String(
                        producto.sku || ""
                    )
                    .toLowerCase();

                const codigo =
                    String(
                        producto.codigo || ""
                    )
                    .toLowerCase();


                return (

                    nombre.includes(
                        this.textoBusqueda
                    )

                    ||

                    sku.includes(
                        this.textoBusqueda
                    )

                    ||

                    codigo.includes(
                        this.textoBusqueda
                    )

                );

            });

        }


        return lista;

    },


    /*************************************************
     * RENDERIZAR PRODUCTOS
     *************************************************/

    renderizar() {

        const contenedor =
            document.getElementById("productos");


        if (!contenedor) {

            console.error(
                "MOBILE → no existe #productos"
            );

            return;

        }


        const lista =
            this.obtenerFiltrados();


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
            lista.map(
                producto =>
                    this.crearProducto(producto)
            ).join("");


        console.log(
            "MOBILE → PRODUCTOS MOSTRADOS:",
            lista.length
        );

    },


    /*************************************************
     * CREAR TARJETA
     *************************************************/

    crearProducto(producto) {

        const id =
            producto.id ?? "";


        const nombre =
            producto.nombre ||
            "Producto sin nombre";


        let precio = producto.precio;

        if (typeof precio === "string") {

            precio = precio
                .replace(/\$/g, "")
                .replace(/\s/g, "")
                .replace(",", ".");

        }

        precio = Number(precio) || 0;


        const inventario =
            Number(producto.inventario) || 0;


        const categoria =
            producto.categoria || "";


        const codigo =
            producto.codigo || "";


        return `

            <article
                class="producto"
                data-id="${this.escape(id)}"
                data-categoria="${this.escape(categoria)}"
                data-codigo="${this.escape(codigo)}">


                <!-- =========================
                     IMAGEN
                ========================== -->

<div class="foto">

    ${
        producto.imagen
        ?
        `

        <img
            src="https://drive.google.com/thumbnail?id=${producto.imagen}&sz=w800"
            class="fotoProducto"
            alt="${this.escape(nombre)}">

      <button
    class="btnCarritoRapido"
    type="button"
    data-id="${this.escape(id)}"
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


                <!-- =========================
                     INFORMACIÓN
                ========================== -->

                <div class="producto__contenido">

                    <h3>

                        ${this.escape(nombre)}

                    </h3>


                    <div class="producto__detalle">

                        ${this.escape(categoria)}

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



        /*************************************************
     * GUARDAR ESTADO DEL CATÁLOGO
     *************************************************/

    guardarEstadoCatalogo() {

        const app =
            document.getElementById("app");

        if (!app) {
            return;
        }

        const productos =
            document.getElementById("productos");

        this.estadoCatalogo = {

            html: app.innerHTML,

            scrollTop:
                productos
                    ? productos.scrollTop
                    : 0,

            filtroCategoria:
                this.filtroCategoria,

            textoBusqueda:
                this.textoBusqueda

        };

        console.log(
            "MOBILE → estado del catálogo guardado"
        );

    },


        /*************************************************
     * RESTAURAR CATÁLOGO
     *************************************************/

    restaurarCatalogo() {

        if (!this.estadoCatalogo) {

            console.warn(
                "MOBILE → no existe estado del catálogo"
            );

            return;

        }


        const app =
            document.getElementById("app");


        if (!app) {
            return;
        }


        app.innerHTML =
            this.estadoCatalogo.html;


        this.vistaActual =
            "catalogo";


        /*
         * Volvemos a conectar los eventos
         * sobre el DOM restaurado.
         */

        this.inicializarEventos();


        const productos =
            document.getElementById("productos");


        if (productos) {

            productos.scrollTop =
                this.estadoCatalogo.scrollTop || 0;

        }


        console.log(
            "MOBILE → catálogo restaurado sin consultar API"
        );

    },





    /*************************************************
     * MOSTRAR DETALLE DEL PRODUCTO
     *************************************************/

mostrarDetalleProducto(producto) {

    const app =
        document.getElementById("app");


    this.vistaActual = "detalle";


    history.pushState(
        {
            vista: "detalle",
            productoId: producto.id
        },
        "",
        "#producto-" + producto.id
    );


        if (!app) {

            console.error(
                "MOBILE → no existe #app"
            );

            return;

        }


        const nombre =
            producto.nombre ||
            "Producto sin nombre";


        let precio =
            producto.precio;


        if (typeof precio === "string") {

            precio =
                precio
                    .replace(/\$/g, "")
                    .replace(/\s/g, "")
                    .replace(",", ".");

        }


        precio =
            Number(precio) || 0;


        const inventario =
            Number(producto.inventario) || 0;


        const categoria =
            producto.categoria || "";


        const imagen =
            producto.imagen || "";


        app.innerHTML = `

            <div class="mobile-detalle-producto">

                <header class="mobile-detalle-header">

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


                <main class="mobile-detalle-contenido">

                    <div class="mobile-detalle-imagen">

                        ${
                            imagen
                            ?

                            `
                            <img
                                src="https://drive.google.com/thumbnail?id=${this.escape(imagen)}&sz=w1200"
                                alt="${this.escape(nombre)}">
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


                    <div class="mobile-detalle-informacion">

                        <div class="mobile-detalle-categoria">

                            ${this.escape(categoria)}

                        </div>


                        <h1>

                            ${this.escape(nombre)}

                        </h1>


                        <div class="mobile-detalle-precio">

                            $${precio.toFixed(2)}

                        </div>


                        <div class="mobile-detalle-inventario">

                            Disponible:
                            ${inventario}

                        </div>


                        <div class="mobile-detalle-separador"></div>


                        <div class="mobile-detalle-acciones">

                            <button
                                id="btnAgregarDetalle"
                                type="button"
                                class="mobile-detalle-carrito">

                                🛒
                                Agregar al carrito
                                <span id="cantidadDetalleCarrito">0</span>

                            </button>

                        </div>

                    </div>

                </main>

            </div>

        `;


        const regresar =
            document.getElementById(
                "btnRegresarProductos"
            );


        if (regresar) {

regresar.addEventListener(
    "click",
    () => {

        history.back();

    }
);

        }


        const agregar =
            document.getElementById(
                "btnAgregarDetalle"
            );

        const cantidadDetalle =
            document.getElementById(
                "cantidadDetalleCarrito"
            );


        /*
         * CANTIDAD ACTUAL DEL PRODUCTO
         *
         * Si el producto ya fue agregado desde
         * el catálogo, mostramos esa cantidad.
         */

        function actualizarCantidadDetalle() {

            if (!cantidadDetalle) {
                return;
            }

            let cantidad = 0;

            if (
                window.carritoMobile &&
                Array.isArray(
                    window.carritoMobile.items
                )
            ) {

                const item =
                    window.carritoMobile.items.find(
                        productoCarrito =>
                            String(
                                productoCarrito.id
                            ) ===
                            String(producto.id)
                    );

                if (item) {

                    cantidad =
                        Number(
                            item.cantidad
                        ) || 0;

                }

            }

            cantidadDetalle.textContent =
                cantidad;

        }


        /*
         * Mostrar inmediatamente la cantidad
         * que ya tenía el producto.
         */

        actualizarCantidadDetalle();


        if (agregar) {

            agregar.addEventListener(
                "click",
                () => {

                    if (
                        !window.carritoMobile
                    ) {

                        console.error(
                            "DETALLE → carritoMobile no está disponible."
                        );

                        return;

                    }


                    const agregado =
                        window.carritoMobile.agregar(
                            producto,
                            1
                        );


                    /*
                     * Si el carrito aceptó el producto,
                     * actualizamos inmediatamente
                     * el número visible en detalle.
                     */

                    if (agregado) {

                        actualizarCantidadDetalle();

                    }

                }
            );

        }

    },


    /*************************************************
     * HISTORIAL DEL DETALLE
     *************************************************/

    inicializarHistorial() {

        if (this.historialInicializado) {
            return;
        }


        window.addEventListener(
            "popstate",
            () => {

                if (
                    this.vistaActual === "detalle"
                ) {

                    this.restaurarCatalogo();

                }

            }
        );


        this.historialInicializado =
            true;


        console.log(
            "MOBILE → historial inicializado"
        );

    },



    /*************************************************
     * MENSAJE DE CARGA
     *************************************************/


    
    mostrarError(mensaje) {

        const contenedor =
            document.getElementById("productos");


        if (!contenedor) return;


        contenedor.innerHTML = `

            <div class="estado-vacio">

                <strong>
                    No se pudieron cargar los productos
                </strong>

                <span>
                    ${this.escape(mensaje)}
                </span>

            </div>

        `;

    },


    /*************************************************
     * SEGURIDAD HTML
     *************************************************/

    escape(valor) {

        return String(valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

};




