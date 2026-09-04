const logicaCatalogo = {

    productos: [],
    filtroCategoria: "",
    textoBusqueda: "",
    intervaloInventario: null,

    vistaActual: "catalogo",

    estadoCatalogo: null,
    historialInicializado: false,


    // =====================================================
    // CARGAR PRODUCTOS
    // =====================================================

    async cargarProductos() {

        console.log("CATALOGO → solicitando productos");

        try {

            const respuesta = await api("productos");

            console.log(
                "CATALOGO → respuesta productos:",
                respuesta
            );

            if (!respuesta || !respuesta.ok) {

                console.error(
                    "CATALOGO → error al obtener productos"
                );

                return {
                    ok: false,
                    mensaje:
                        respuesta?.mensaje ||
                        "No fue posible cargar los productos."
                };
            }

            this.productos =
                Array.isArray(respuesta.datos)
                    ? respuesta.datos
                    : [];

            console.log(
                "CATALOGO → productos recibidos:",
                this.productos.length
            );

            return {
                ok: true
            };

        } catch (error) {

            console.error(
                "CATALOGO → error cargando productos:",
                error
            );

            return {
                ok: false,
                mensaje:
                    "No fue posible cargar los productos."
            };
        }
    },


    // =====================================================
    // SINCRONIZACIÓN AUTOMÁTICA
    // =====================================================

    iniciarSincronizacion() {

        if (this.intervaloInventario) {

            clearInterval(
                this.intervaloInventario
            );
        }

        this.intervaloInventario =
            setInterval(
                () => this.sincronizarProductos(),
                10000
            );

        console.log(
            "CATALOGO → sincronización automática iniciada"
        );
    },


    detenerSincronizacion() {

        if (this.intervaloInventario) {

            clearInterval(
                this.intervaloInventario
            );

            this.intervaloInventario = null;
        }
    },


    async sincronizarProductos() {

        try {

            const respuesta =
                await api("productos");

            if (
                !respuesta ||
                !respuesta.ok
            ) {

                console.warn(
                    "CATALOGO → sincronización sin respuesta válida"
                );

                return;
            }

            const nuevosProductos =
                Array.isArray(respuesta.datos)
                    ? respuesta.datos
                    : [];

            this.productos =
                nuevosProductos;


            /*
             * Si estamos viendo el detalle,
             * actualizamos los datos internos
             * pero no destruimos el detalle.
             */

            if (
                this.vistaActual === "detalle"
            ) {

                console.log(
                    "CATALOGO → inventario actualizado durante detalle:",
                    nuevosProductos.length
                );

                return;
            }


            /*
             * Si estamos viendo el catálogo,
             * actualizamos las tarjetas.
             */

            if (
                typeof window.catalogo?.renderizar ===
                "function"
            ) {

                window.catalogo.renderizar();
            }

            console.log(
                "CATALOGO → inventario sincronizado:",
                nuevosProductos.length
            );

        } catch (error) {

            console.error(
                "CATALOGO → error de sincronización:",
                error
            );
        }
    },


    // =====================================================
    // FILTRADO
    // =====================================================

    obtenerFiltrados() {

        let lista = [
            ...this.productos
        ];


        // -----------------------------
        // CATEGORÍA
        // -----------------------------

        if (this.filtroCategoria) {

            lista =
                lista.filter(
                    producto => {

                        const categoria =
                            String(
                                producto.categoria || ""
                            )
                            .trim()
                            .toUpperCase();

                        return (
                            categoria ===
                            this.filtroCategoria
                        );
                    }
                );
        }


        // -----------------------------
        // BÚSQUEDA
        // -----------------------------

        if (this.textoBusqueda) {

            lista =
                lista.filter(
                    producto => {

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
                    }
                );
        }


        return lista;
    },


    // =====================================================
    // BUSCAR PRODUCTO POR ID
    // =====================================================

    obtenerProducto(id) {

        return this.productos.find(
            producto =>
                String(producto.id) ===
                String(id)
        );
    },


    // =====================================================
    // GUARDAR ESTADO DEL CATÁLOGO
    // =====================================================

    guardarEstado() {

        const app =
            document.getElementById("app");

        if (!app) {
            return;
        }

        const productos =
            document.getElementById("productos");


        this.estadoCatalogo = {

            html:
                app.innerHTML,

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
            "CATALOGO → estado guardado"
        );
    },


    // =====================================================
    // RESTAURAR ESTADO
    // =====================================================

    restaurarEstado() {

        if (!this.estadoCatalogo) {

            console.warn(
                "CATALOGO → no existe estado para restaurar"
            );

            return false;
        }


        const app =
            document.getElementById("app");

        if (!app) {
            return false;
        }


        app.innerHTML =
            this.estadoCatalogo.html;


        this.vistaActual =
            "catalogo";


        this.filtroCategoria =
            this.estadoCatalogo.filtroCategoria ||
            "";

        this.textoBusqueda =
            this.estadoCatalogo.textoBusqueda ||
            "";


        const productos =
            document.getElementById("productos");

        if (productos) {

            productos.scrollTop =
                this.estadoCatalogo.scrollTop ||
                0;
        }


        console.log(
            "CATALOGO → estado restaurado"
        );

        return true;
    },


    // =====================================================
    // LIMPIAR ESTADO
    // =====================================================

    limpiarEstado() {

        this.estadoCatalogo =
            null;

        this.filtroCategoria =
            "";

        this.textoBusqueda =
            "";
    },


    // =====================================================
    // SEGURIDAD HTML
    // =====================================================

    escape(valor) {

        return String(valor)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );
    }
};


window.logicaCatalogo =
    logicaCatalogo;