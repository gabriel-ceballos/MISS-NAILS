const mobile = {

    productos: [],

    filtroCategoria: "",

    textoBusqueda: "",

    intervaloInventario: null,


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
                        type="button">

                        🔔

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
                        type="button">

                        Inicio

                    </button>

                    <button
                        id="btnCarrito"
                        type="button">

                        Carrito

                    </button>

                    <button
                        id="btnCuenta"
                        type="button">

                        Cuenta

                    </button>

                </nav>

            </div>

        `;


        this.inicializarEventos();

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
        `<img
            src="https://drive.google.com/thumbnail?id=${producto.imagen}&sz=w800"
            class="fotoProducto"
            alt="${nombre}">
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


                    <button
                        class="btnAgregar"
                        type="button"
                        data-id="${this.escape(id)}">

                        AGREGAR

                    </button>

                </div>

            </article>

        `;

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