const logicaCatalogo = {

    productos: [],

    // Catálogo e inventario se mantienen separados en memoria.
    // Los productos siguen conteniendo sus datos originales para no romper
    // compatibilidad con las vistas existentes; el inventario oficial
    // para consulta se conserva adicionalmente en este mapa.
    inventario: new Map(),

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

const inicioCatalogo =
    performance.now();

console.log(
    "CATALOGO → solicitando productos"
);

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

            const datos =
                Array.isArray(respuesta.datos)
                    ? respuesta.datos
                    : [];

            console.log(
                "CATALOGO → productos recibidos antes de procesar:",
                datos.length
            );

            const inicioProcesamiento = performance.now();

            // Separar inventario del catálogo sin modificar el backend.
            this.actualizarInventario(datos);

            // Conservamos la estructura completa para no romper todavía
            // las funciones existentes que esperan producto.inventario.
            this.productos = datos;

            console.log(
                "CATALOGO → procesamiento de datos en",
                Math.round(
                    performance.now() -
                    inicioProcesamiento
                ),
                "ms"
            );

            console.log(
                "CATALOGO → tiempo total cargarProductos en",
                Math.round(
                    performance.now() -
                    inicioCatalogo
                ),
                "ms"
            );

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

        const inicioSincronizacion = performance.now();

        console.log(
            "CATALOGO → INICIO SINCRONIZACIÓN INVENTARIO"
        );

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

            // Actualizar únicamente el estado separado de inventario.
            this.actualizarInventario(nuevosProductos);

            // Mantener el catálogo actualizado sin cambiar su estructura.
            this.productos = nuevosProductos;


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
             * Si estamos viendo el catálogo, NO reconstruimos
             * la vista completa. El catálogo progresivo conserva
             * las tarjetas ya construidas y sólo actualizamos
             * el inventario visible.
             */

            if (
                this.vistaActual === "catalogo" &&
                typeof window.catalogo?.actualizarInventarioVisible ===
                "function"
            ) {

                window.catalogo.actualizarInventarioVisible();
            }

            console.log(
                "CATALOGO → inventario sincronizado sin reconstruir catálogo:",
                nuevosProductos.length,
                "| tiempo total:",
                Math.round(
                    performance.now() -
                    inicioSincronizacion
                ),
                "ms"
            );

        } catch (error) {

            console.error(
                "CATALOGO → error de sincronización:",
                error,
                "| tiempo:",
                Math.round(
                    performance.now() -
                    inicioSincronizacion
                ),
                "ms"
            );
        }
    },


    // =====================================================
    // INVENTARIO SEPARADO
    // =====================================================

    actualizarInventario(datos) {

        const nuevoInventario = new Map();
        const idsDuplicados = new Map();
        let registrosValidos = 0;
        let registrosSinId = 0;

        if (Array.isArray(datos)) {

            datos.forEach((producto, indice) => {

                if (!producto || producto.id == null || String(producto.id).trim() === "") {
                    registrosSinId++;
                    return;
                }

                const id = String(producto.id);
                const existencia = Number(producto.inventario) || 0;

                registrosValidos++;

                if (nuevoInventario.has(id)) {

                    if (!idsDuplicados.has(id)) {
                        idsDuplicados.set(id, []);
                    }

                    idsDuplicados.get(id).push({
                        indice,
                        inventario: existencia
                    });
                }

                nuevoInventario.set(
                    id,
                    existencia
                );
            });
        }

        this.inventario = nuevoInventario;

        console.log(
            "CATALOGO → inventario separado:",
            this.inventario.size
        );

        console.log(
            "CATALOGO → registros de inventario válidos:",
            registrosValidos
        );

        console.log(
            "CATALOGO → registros sin ID:",
            registrosSinId
        );

        console.log(
            "CATALOGO → IDs duplicados:",
            idsDuplicados.size
        );

        if (idsDuplicados.size) {

            console.warn(
                "CATALOGO → detalle de IDs duplicados:",
                Array.from(idsDuplicados.entries())
            );
        }
    },


    obtenerInventario(id) {

        return Number(
            this.inventario.get(String(id)) ?? 0
        );
    },


    productoParaCarrito(producto) {

        if (!producto) {
            return producto;
        }

        return {
            ...producto,
            inventario: this.obtenerInventario(producto.id)
        };
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


    /*
     * IMPORTANTE:
     *
     * No debemos guardar las clases de orientación
     * dentro del estado del catálogo.
     *
     * mn-horizontal y mn-vertical pertenecen al
     * viewport actual y son responsabilidad de app.js.
     *
     * Si guardamos esas clases, un catálogo guardado
     * mientras el teléfono estaba horizontal puede
     * regresar posteriormente con 6 columnas aunque
     * el teléfono ya esté vertical.
     */

    const copia =
        app.cloneNode(true);


    copia.querySelectorAll(".mobile").forEach(
        elemento => {

            elemento.classList.remove(
                "mn-horizontal",
                "mn-vertical"
            );
        }
    );


    this.estadoCatalogo = {

        html:
            copia.innerHTML,

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
        "CATALOGO → estado guardado sin orientación"
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