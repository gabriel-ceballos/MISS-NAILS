/* ==========================================================
   MISS NAILS
   MOBILE CARRITO
   Modulo independiente
   ========================================================== */

(function () {
    "use strict";

    const STORAGE_KEY = "miss_nails_carrito";

    function numero(valor) {
        const n = Number(valor);
        return Number.isFinite(n) ? n : 0;
    }

    function escapar(valor) {
        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const carrito = {

        items: [],

        vistaActiva: false,

        inicializado: false,

        iniciar() {

            this.cargar();

            this.inicializado = true;

            this.actualizarContador();

            console.log(
                "CARRITO → modulo inicializado",
                this.items
            );

        },

        cargar() {

            try {

                const guardado =
                    localStorage.getItem(STORAGE_KEY);

                const datos =
                    guardado
                        ? JSON.parse(guardado)
                        : [];

                this.items =
                    Array.isArray(datos)
                        ? datos
                        : [];

            } catch (error) {

                console.warn(
                    "CARRITO → error al recuperar carrito",
                    error
                );

                this.items = [];

            }

        },

        guardar() {

            try {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(this.items)
                );

            } catch (error) {

                console.warn(
                    "CARRITO → error al guardar carrito",
                    error
                );

            }

            this.actualizarContador();

        },

        totalUnidades() {

            return this.items.reduce(
                (total, item) =>
                    total + numero(item.cantidad),
                0
            );

        },

        subtotal() {

            return this.items.reduce(
                (total, item) =>
                    total +
                    numero(item.precio) *
                    numero(item.cantidad),
                0
            );

        },

        obtenerProducto(id) {

            if (
                !window.mobile ||
                !Array.isArray(mobile.productos)
            ) {
                return null;
            }

            return mobile.productos.find(
                producto =>
                    String(producto.id) ===
                    String(id)
            ) || null;

        },

        obtenerInventario(producto) {

            return Math.max(
                0,
                Math.floor(
                    numero(producto?.inventario)
                )
            );

        },

        agregar(producto, cantidad = 1) {

            if (!producto) {

                return false;

            }

            const disponible =
                this.obtenerInventario(producto);

            if (disponible <= 0) {

                this.mensaje(
                    "Producto sin inventario disponible",
                    "warning"
                );

                return false;

            }

            const existente =
                this.items.find(
                    item =>
                        String(item.id) ===
                        String(producto.id)
                );

            const actual =
                existente
                    ? numero(existente.cantidad)
                    : 0;

            const incremento =
                Math.max(
                    1,
                    Math.floor(numero(cantidad))
                );

            const nuevaCantidad =
                actual + incremento;

            if (nuevaCantidad > disponible) {

                this.mensaje(
                    `Solo hay ${disponible} disponible(s)`,
                    "warning"
                );

                return false;

            }

            const item = {

                id: producto.id,

                nombre:
                    producto.nombre ||
                    "Producto sin nombre",

                precio:
                    numero(producto.precio),

                imagen:
                    producto.imagen || "",

                categoria:
                    producto.categoria || "",

                inventario:
                    disponible,

                cantidad:
                    nuevaCantidad

            };

            if (existente) {

                Object.assign(
                    existente,
                    item
                );

            } else {

                this.items.push(item);

            }

            this.guardar();

            this.mensaje(
                "Producto agregado al carrito",
                "success"
            );

            return true;

        },

        aumentar(id) {

            const item =
                this.items.find(
                    producto =>
                        String(producto.id) ===
                        String(id)
                );

            if (!item) return;

            const producto =
                this.obtenerProducto(id);

            const disponible =
                producto
                    ? this.obtenerInventario(producto)
                    : numero(item.inventario);

            if (
                numero(item.cantidad) >=
                disponible
            ) {

                this.mensaje(
                    `Máximo disponible: ${disponible}`,
                    "warning"
                );

                return;

            }

            item.cantidad++;

            if (producto) {

                item.inventario =
                    disponible;

                item.precio =
                    numero(producto.precio);

                item.nombre =
                    producto.nombre ||
                    item.nombre;

                item.imagen =
                    producto.imagen ||
                    item.imagen;

            }

            this.guardar();

            this.renderizar();

        },

        disminuir(id) {

            const item =
                this.items.find(
                    producto =>
                        String(producto.id) ===
                        String(id)
                );

            if (!item) return;

            item.cantidad--;

            if (item.cantidad <= 0) {

                this.items =
                    this.items.filter(
                        producto =>
                            String(producto.id) !==
                            String(id)
                    );

            }

            this.guardar();

            this.renderizar();

        },

        eliminar(id) {

            this.items =
                this.items.filter(
                    producto =>
                        String(producto.id) !==
                        String(id)
                );

            this.guardar();

            this.renderizar();

        },

        validarInventario() {

            let cambio = false;

            this.items =
                this.items
                    .map(item => {

                        const producto =
                            this.obtenerProducto(
                                item.id
                            );

                        if (!producto) {

                            return item;

                        }

                        const disponible =
                            this.obtenerInventario(
                                producto
                            );

                        const cantidad =
                            Math.min(
                                numero(item.cantidad),
                                disponible
                            );

                        if (
                            cantidad !==
                                numero(item.cantidad) ||
                            numero(item.inventario) !==
                                disponible ||
                            numero(item.precio) !==
                                numero(producto.precio)
                        ) {

                            cambio = true;

                        }

                        return {

                            ...item,

                            nombre:
                                producto.nombre ||
                                item.nombre,

                            precio:
                                numero(
                                    producto.precio
                                ),

                            imagen:
                                producto.imagen ||
                                item.imagen,

                            categoria:
                                producto.categoria ||
                                item.categoria,

                            inventario:
                                disponible,

                            cantidad

                        };

                    })
                    .filter(
                        item =>
                            numero(item.cantidad) > 0 &&
                            numero(item.inventario) > 0
                    );

            if (cambio) {

                this.guardar();

            }

            return cambio;

        },

        actualizarContador() {

            const boton =
                document.getElementById(
                    "btnCarrito"
                );

            if (!boton) return;

            let badge =
                boton.querySelector(
                    ".carrito-contador"
                );

            if (!badge) {

                badge =
                    document.createElement(
                        "span"
                    );

                badge.className =
                    "carrito-contador";

                const icono =
                    boton.querySelector(
                        ".mobile-nav-icon"
                    );

                if (icono) {

                    icono.appendChild(
                        badge
                    );

                } else {

                    boton.appendChild(
                        badge
                    );

                }

            }

            const cantidad =
                this.totalUnidades();

            badge.textContent =
                cantidad > 99
                    ? "99+"
                    : String(cantidad);

            badge.classList.toggle(
                "oculto",
                cantidad === 0
            );

        },

        mostrar() {

            if (!window.mobile) return;

            mobile.guardarEstadoCatalogo();

            mobile.vistaActual =
                "carrito";

            this.vistaActiva =
                true;

            history.pushState(
                {
                    vista: "carrito"
                },
                "",
                "#carrito"
            );

            this.validarInventario();

            this.renderizar();

        },

        volver() {

            if (
                this.vistaActiva
            ) {

                history.back();

            }

        },

        renderizar() {

            const app =
                document.getElementById(
                    "app"
                );

            if (!app) return;

            this.vistaActiva =
                true;

            mobile.vistaActual =
                "carrito";

            const total =
                this.subtotal();

            app.innerHTML = `

                <div class="mobile-carrito">

                    <header
                        class="mobile-carrito-header">

                        <button
                            id="btnVolverCarrito"
                            type="button"
                            aria-label="Regresar">

                            ←

                        </button>

                        <h1>Carrito</h1>

                        <span
                            class="mobile-carrito-unidades">

                            ${this.totalUnidades()}

                        </span>

                    </header>

                    <main
                        class="mobile-carrito-contenido">

                        ${this.renderItems()}

                    </main>

                    <footer
                        class="mobile-carrito-footer">

                        <div
                            class="mobile-carrito-resumen">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                $${total.toFixed(2)}
                            </strong>

                        </div>

                        <div
                            class="mobile-carrito-resumen total">

                            <span>
                                Total
                            </span>

                            <strong>
                                $${total.toFixed(2)}
                            </strong>

                        </div>

                        <button
                            class="mobile-carrito-continuar"
                            type="button">

                            Continuar

                        </button>

                    </footer>

                </div>

            `;

            const volver =
                document.getElementById(
                    "btnVolverCarrito"
                );

            volver?.addEventListener(
                "click",
                () => this.volver()
            );

            const catalogoVacio =
                document.getElementById(
                    "btnIrCatalogoVacio"
                );

            catalogoVacio?.addEventListener(
                "click",
                () => history.back()
            );

            app
                .querySelectorAll(
                    "[data-carrito-accion]"
                )
                .forEach(boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const id =
                                boton.dataset.id;

                            const accion =
                                boton.dataset.carritoAccion;

                            if (
                                accion ===
                                "sumar"
                            ) {

                                this.aumentar(id);

                            }

                            if (
                                accion ===
                                "restar"
                            ) {

                                this.disminuir(id);

                            }

                            if (
                                accion ===
                                "eliminar"
                            ) {

                                this.eliminar(id);

                            }

                        }
                    );

                });

            this.actualizarContador();

        },

        renderItems() {

            if (!this.items.length) {

                return `

                    <section
                        class="mobile-carrito-vacio">

                        <div
                            class="mobile-carrito-vacio-icono">

                            🛒

                        </div>

                        <strong>
                            Tu carrito está vacío
                        </strong>

                        <span>
                            Agrega productos
                            desde el catálogo.
                        </span>

                        <button
                            id="btnIrCatalogoVacio"
                            type="button">

                            Ver productos

                        </button>

                    </section>

                `;

            }

            return this.items.map(
                item => {

                    const imagen =
                        item.imagen

                            ? `

                                <img
                                    src="https://drive.google.com/thumbnail?id=${escapar(item.imagen)}&sz=w500"
                                    alt="${escapar(item.nombre)}">

                              `

                            : `

                                <div
                                    class="mobile-carrito-sin-imagen">

                                    SIN IMAGEN

                                </div>

                              `;

                    const subtotal =
                        numero(item.precio) *
                        numero(item.cantidad);

                    return `

                        <article
                            class="mobile-carrito-item">

                            <div
                                class="mobile-carrito-item-imagen">

                                ${imagen}

                            </div>

                            <div
                                class="mobile-carrito-item-info">

                                <h2>
                                    ${escapar(item.nombre)}
                                </h2>

                                <span
                                    class="mobile-carrito-item-precio">

                                    $${numero(item.precio).toFixed(2)}

                                </span>

                                <div
                                    class="mobile-carrito-controles">

                                    <button
                                        type="button"
                                        data-carrito-accion="restar"
                                        data-id="${escapar(item.id)}">

                                        −

                                    </button>

                                    <strong>
                                        ${numero(item.cantidad)}
                                    </strong>

                                    <button
                                        type="button"
                                        data-carrito-accion="sumar"
                                        data-id="${escapar(item.id)}">

                                        +

                                    </button>

                                </div>

                                <strong
                                    class="mobile-carrito-item-subtotal">

                                    $${subtotal.toFixed(2)}

                                </strong>

                            </div>

                            <button
                                class="mobile-carrito-eliminar"
                                type="button"
                                data-carrito-accion="eliminar"
                                data-id="${escapar(item.id)}"
                                aria-label="Eliminar producto">

                                ×

                            </button>

                        </article>

                    `;

                }
            ).join("");

        },

        mensaje(texto, tipo) {

            if (
                typeof window.mostrarToast ===
                "function"
            ) {

                window.mostrarToast(
                    texto,
                    tipo
                );

                return;

            }

            console.log(
                `CARRITO → ${tipo || "info"}: ${texto}`
            );

        },

        manejarRegreso() {

            if (
                mobile.vistaActual !==
                "carrito"
            ) {

                return;

            }

            this.vistaActiva =
                false;

            mobile.vistaActual =
                "catalogo";

            mobile.restaurarCatalogo();

        }

    };

    window.carritoMobile =
        carrito;

    window.addEventListener(
        "load",
        () => carrito.iniciar()
    );

    console.log(
        "CARRITO → archivo cargado"
    );

})();
