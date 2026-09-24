/* =========================================================
   MISS NAILS — LÓGICA DEL CARRITO

   Responsabilidad:
   - Estado y persistencia del carrito.
   - Cantidades.
   - Inventario disponible.
   - Totales.
   - Sincronización de información del producto.
   ========================================================= */

const logicaCarrito = {

    CLAVE: "missNailsCarrito",

    items: [],

    /* =========================================================
       CARRITO CENTRAL — BACKEND
       CARRITOS es la fuente de verdad.
       localStorage queda como caché local de compatibilidad.
       ========================================================= */

    CLAVE_BACKEND_CLIENTE: "missNailsCarritoBackendCliente",
    _ultimaSincronizacionBackend: 0,
    _sincronizacionBackendEnCurso: null,
    _versionOperacionBackend: 0,

    obtenerIdClienteLocal() {
        return String(
            window.sesion?.usuario?.idCliente ??
            window.sesion?.usuario?.id_cliente ??
            ""
        ).trim();
    },

    normalizarItemsBackend(items) {
        if (!Array.isArray(items)) {
            return [];
        }

        return items
            .filter(item =>
                item &&
                item.id !== undefined &&
                item.id !== null
            )
            .map(item => ({
                id: item.id,
                sku: item.sku ?? "",
                codigo: item.codigo ?? "",
                nombre:
                    item.nombre || "Producto sin nombre",
                precio: this.numero(item.precio),
                imagen: item.imagen || "",
                categoria: item.categoria || "",
                inventario: this.inventario(item),
                cantidad: Math.max(
                    1,
                    Math.floor(this.numero(item.cantidad))
                )
            }));
    },

    async sincronizarConBackend() {
        if (typeof window.api !== "function") {
            return null;
        }

        if (
            Date.now() - this._ultimaSincronizacionBackend <
            3000
        ) {
            return null;
        }

        if (this._sincronizacionBackendEnCurso) {
            return this._sincronizacionBackendEnCurso;
        }

        const version = this._versionOperacionBackend;
        const itemsLocales = this.items.map(item => ({ ...item }));
        const idCliente = this.obtenerIdClienteLocal();

        this._sincronizacionBackendEnCurso = (async () => {
            try {
                let respuesta = await window.api(
                    "obtenerCarrito",
                    {}
                );

                this._ultimaSincronizacionBackend = Date.now();

                if (!respuesta?.ok) {
                    console.warn(
                        "CARRITO → backend:",
                        respuesta?.mensaje || "No fue posible sincronizar."
                    );
                    return respuesta;
                }

                if (version !== this._versionOperacionBackend) {
                    return respuesta;
                }

                let itemsServidor =
                    this.normalizarItemsBackend(
                        respuesta.datos?.items
                    );

                const marca = String(
                    localStorage.getItem(
                        this.CLAVE_BACKEND_CLIENTE
                    ) || ""
                ).trim();

                /*
                 * Primera entrada al backend: conserva el carrito local
                 * existente solamente si CARRITOS todavía está vacío.
                 */
                if (
                    itemsServidor.length === 0 &&
                    itemsLocales.length > 0 &&
                    !marca &&
                    idCliente
                ) {
                    for (const item of itemsLocales) {
                        const migracion = await window.api(
                            "agregarAlCarrito",
                            {
                                id: item.id,
                                cantidad: Math.max(
                                    1,
                                    Math.floor(
                                        this.numero(item.cantidad)
                                    )
                                )
                            }
                        );

                        if (!migracion?.ok) {
                            console.warn(
                                "CARRITO → migración rechazada:",
                                migracion?.mensaje || ""
                            );
                            return migracion;
                        }
                    }

                    respuesta = await window.api(
                        "obtenerCarrito",
                        {}
                    );

                    if (!respuesta?.ok) {
                        return respuesta;
                    }

                    itemsServidor =
                        this.normalizarItemsBackend(
                            respuesta.datos?.items
                        );
                }

                if (version !== this._versionOperacionBackend) {
                    return respuesta;
                }

                this.items = itemsServidor;

                if (idCliente) {
                    localStorage.setItem(
                        this.CLAVE_BACKEND_CLIENTE,
                        idCliente
                    );
                }

                this.guardar();

                console.log(
                    "CARRITO → sincronizado:",
                    this.items.length,
                    "productos"
                );

                return respuesta;

            } catch (error) {
                console.warn(
                    "CARRITO → error backend:",
                    error
                );
                return {
                    ok: false,
                    mensaje:
                        error.message ||
                        "Error de sincronización."
                };

            } finally {
                this._sincronizacionBackendEnCurso = null;
            }
        })();

        return this._sincronizacionBackendEnCurso;
    },

    sincronizarOperacionBackend(accion, datos) {
        if (typeof window.api !== "function") {
            return;
        }

        const version = ++this._versionOperacionBackend;

        window.api(accion, datos)
            .then(respuesta => {
                if (!respuesta?.ok) {
                    console.warn(
                        "CARRITO → operación backend rechazada:",
                        accion,
                        respuesta?.mensaje || ""
                    );
                    this._ultimaSincronizacionBackend = 0;
                    this.sincronizarConBackend();
                    return;
                }

                if (version !== this._versionOperacionBackend) {
                    return;
                }

                this.items = this.normalizarItemsBackend(
                    respuesta.datos?.items
                );

                const idCliente = this.obtenerIdClienteLocal();

                if (idCliente) {
                    localStorage.setItem(
                        this.CLAVE_BACKEND_CLIENTE,
                        idCliente
                    );
                }

                this.guardar();
            })
            .catch(error => {
                console.warn(
                    "CARRITO → error en operación backend:",
                    accion,
                    error
                );
            });
    },

    inicializar() {
        this.cargar();
        this.sincronizarConCatalogo();

        console.log(
            "CARRITO → lógica inicializada:",
            this.items.length,
            "productos"
        );
    },

    numero(valor) {
        if (typeof valor === "string") {
            valor = valor
                .replace(/\$/g, "")
                .replace(/\s/g, "")
                .replace(",", ".");
        }

        const numero = Number(valor);

        return Number.isFinite(numero)
            ? numero
            : 0;
    },

    inventario(producto) {
        return Math.max(
            0,
            Math.floor(
                this.numero(producto?.inventario)
            )
        );
    },

    normalizarProducto(producto) {
        if (!producto) {
            return null;
        }

        const id = producto.id;

        if (
            id === undefined ||
            id === null ||
            id === ""
        ) {
            console.warn(
                "CARRITO → producto sin ID:",
                producto
            );
            return null;
        }

        return {
            id,
            sku: producto.sku ?? "",
            codigo: producto.codigo ?? "",
            nombre:
                producto.nombre ||
                "Producto sin nombre",
            precio:
                this.numero(producto.precio),
            imagen:
                producto.imagen || "",
            categoria:
                producto.categoria || "",
            inventario:
                this.inventario(producto)
        };
    },

    cargar() {
        try {
            const guardado =
                localStorage.getItem(this.CLAVE);

            if (!guardado) {
                this.items = [];
                this.actualizarContador();
                this.sincronizarConBackend();
                return this.items;
            }

            const datos = JSON.parse(guardado);

            this.items =
                Array.isArray(datos)
                    ? datos
                        .filter(item =>
                            item &&
                            item.id !== undefined &&
                            item.id !== null
                        )
                        .map(item => ({
                            id: item.id,
                            sku: item.sku ?? "",
                            codigo: item.codigo ?? "",
                            nombre:
                                item.nombre ||
                                "Producto sin nombre",
                            precio:
                                this.numero(item.precio),
                            imagen:
                                item.imagen || "",
                            categoria:
                                item.categoria || "",
                            inventario:
                                Math.max(
                                    0,
                                    Math.floor(
                                        this.numero(
                                            item.inventario
                                        )
                                    )
                                ),
                            cantidad:
                                Math.max(
                                    1,
                                    Math.floor(
                                        this.numero(
                                            item.cantidad
                                        )
                                    )
                                )
                        }))
                    : [];

            this.actualizarContador();
            this.sincronizarConBackend();

            return this.items;

        } catch (error) {
            console.warn(
                "CARRITO → error al cargar:",
                error
            );

            this.items = [];
            this.actualizarContador();
            this.sincronizarConBackend();

            return this.items;
        }
    },

    guardar() {
        try {
            localStorage.setItem(
                this.CLAVE,
                JSON.stringify(this.items)
            );
        } catch (error) {
            console.warn(
                "CARRITO → error al guardar:",
                error
            );
        }

        this.actualizarContador();
    },

    obtener(id) {
        return (
            this.items.find(
                item =>
                    String(item.id) === String(id)
            ) || null
        );
    },

    obtenerProductoCatalogo(id) {
        if (
            window.logicaCatalogo &&
            typeof
                window.logicaCatalogo.obtenerProducto ===
                "function"
        ) {
            return (
                window.logicaCatalogo.obtenerProducto(id) ||
                null
            );
        }

        return null;
    },

    agregar(producto, cantidad = 1) {
        const normalizado =
            this.normalizarProducto(producto);

        if (!normalizado) {
            return false;
        }

        const disponible =
            normalizado.inventario;

        if (disponible <= 0) {
            this.mensaje(
                "Producto sin inventario disponible",
                "warning"
            );
            return false;
        }

        const incremento =
            Math.max(
                1,
                Math.floor(
                    this.numero(cantidad)
                )
            );

        const existente =
            this.obtener(normalizado.id);

        const actual =
            existente
                ? Math.max(
                    0,
                    Math.floor(
                        this.numero(
                            existente.cantidad
                        )
                    )
                )
                : 0;

        const nuevaCantidad =
            actual + incremento;

        if (nuevaCantidad > disponible) {
            this.mensaje(
                disponible === 1
                    ? "Solo hay 1 disponible"
                    : `Solo hay ${disponible} disponibles`,
                "warning"
            );
            return false;
        }

        if (existente) {
            Object.assign(
                existente,
                normalizado,
                {
                    cantidad: nuevaCantidad
                }
            );
        } else {
            this.items.push({
                ...normalizado,
                cantidad: nuevaCantidad
            });
        }

        this.guardar();

        this.sincronizarOperacionBackend(
            "agregarAlCarrito",
            {
                id: normalizado.id,
                cantidad: incremento
            }
        );

        console.log(
            "CARRITO → agregado:",
            normalizado.nombre,
            "cantidad:",
            nuevaCantidad
        );

        this.mensaje(
            "Producto agregado al carrito",
            "success"
        );

        return true;
    },

    cambiarCantidad(id, cantidad) {
        const item = this.obtener(id);

        if (!item) {
            return false;
        }

        const nueva =
            Math.floor(
                this.numero(cantidad)
            );

        if (nueva <= 0) {
            return this.eliminar(id);
        }

        const productoActual =
            this.obtenerProductoCatalogo(id);

        const disponible =
            productoActual
                ? this.inventario(productoActual)
                : Math.max(
                    0,
                    Math.floor(
                        this.numero(
                            item.inventario
                        )
                    )
                );

        if (
            disponible <= 0 ||
            nueva > disponible
        ) {
            this.mensaje(
                disponible <= 0
                    ? "Producto sin inventario disponible"
                    : `Solo hay ${disponible} disponibles`,
                "warning"
            );

            return false;
        }

        item.cantidad = nueva;

        if (productoActual) {
            Object.assign(
                item,
                this.normalizarProducto(
                    productoActual
                )
            );

            item.cantidad = nueva;
        }

        this.guardar();

        this.sincronizarOperacionBackend(
            "cambiarCantidadCarrito",
            {
                id,
                cantidad: nueva
            }
        );

        return true;
    },

    eliminar(id) {
        const antes = this.items.length;

        this.items =
            this.items.filter(
                item =>
                    String(item.id) !== String(id)
            );

        if (this.items.length !== antes) {
            this.guardar();

            this.sincronizarOperacionBackend(
                "eliminarDelCarrito",
                { id }
            );

            console.log(
                "CARRITO → eliminado:",
                id
            );

            return true;
        }

        return false;
    },

    limpiar() {
        this.items = [];
        this.guardar();

        this.sincronizarOperacionBackend(
            "vaciarCarrito",
            {}
        );
    },

    totalUnidades() {
        return this.items.reduce(
            (total, item) =>
                total +
                Math.max(
                    0,
                    Math.floor(
                        this.numero(
                            item.cantidad
                        )
                    )
                ),
            0
        );
    },

    subtotal() {
        return this.items.reduce(
            (total, item) =>
                total +
                this.numero(item.precio) *
                this.numero(item.cantidad),
            0
        );
    },

    total() {
        return this.subtotal();
    },

    sincronizarConCatalogo() {
        if (
            !window.logicaCatalogo ||
            typeof
                window.logicaCatalogo.obtenerProducto !==
                "function"
        ) {
            return false;
        }

        let cambio = false;

        this.items.forEach(item => {
            const producto =
                this.obtenerProductoCatalogo(item.id);

            if (!producto) {
                return;
            }

            const actualizado =
                this.normalizarProducto(producto);

            if (!actualizado) {
                return;
            }

            const cantidadActual =
                Math.max(
                    1,
                    Math.floor(
                        this.numero(
                            item.cantidad
                        )
                    )
                );

            const nuevaCantidad =
                Math.min(
                    cantidadActual,
                    actualizado.inventario
                );

            const antes =
                JSON.stringify(item);

            if (nuevaCantidad <= 0) {
                Object.assign(
                    item,
                    actualizado,
                    {
                        cantidad: 0
                    }
                );
            } else {
                Object.assign(
                    item,
                    actualizado,
                    {
                        cantidad: nuevaCantidad
                    }
                );
            }

            if (JSON.stringify(item) !== antes) {
                cambio = true;
            }
        });

        if (cambio) {
            this.guardar();
        } else {
            this.actualizarContador();
        }

        return cambio;
    },

    actualizarContador() {
        const cantidad =
            this.totalUnidades();

        if (
            window.footer &&
            typeof
                window.footer.actualizarContador ===
                "function"
        ) {
            window.footer.actualizarContador(
                cantidad
            );
        }

        const contador =
            document.getElementById(
                "contadorCarrito"
            );

        if (contador) {
            contador.textContent = cantidad;
            contador.style.display =
                cantidad > 0
                    ? "inline-flex"
                    : "none";
        }
    },

    mensaje(texto, tipo = "info") {
        console.log(
            `CARRITO → ${tipo}:`,
            texto
        );

        if (
            typeof window.mostrarToast ===
            "function"
        ) {
            window.mostrarToast(
                texto,
                tipo
            );
        }
    }
};

window.logicaCarrito = logicaCarrito;

logicaCarrito.inicializar();
