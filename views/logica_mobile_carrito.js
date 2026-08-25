/* ==========================================================
   MISS NAILS
   LOGICA MOBILE CARRITO
   Modulo independiente
   ========================================================== */

(function () {
    "use strict";

    const STORAGE_KEY = "miss_nails_carrito";

    function numero(valor) {
        const n = Number(valor);
        return Number.isFinite(n) ? n : 0;
    }



    function numeroPrecio(valor) {

    if (typeof valor === "number") {
        return Number.isFinite(valor)
            ? valor
            : 0;
    }

    let texto =
        String(valor ?? "")
            .trim()
            .replace(/\$/g, "")
            .replace(/\s/g, "");

    if (!texto) {
        return 0;
    }

    /*
     * Si existen punto y coma:
     * el último separador se considera decimal.
     */
    if (
        texto.includes(".") &&
        texto.includes(",")
    ) {

        if (
            texto.lastIndexOf(",") >
            texto.lastIndexOf(".")
        ) {

            texto =
                texto
                    .replace(/\./g, "")
                    .replace(",", ".");

        } else {

            texto =
                texto
                    .replace(/,/g, "");

        }

    } else if (texto.includes(",")) {

        /*
         * 75,00 → 75
         * 1,250 → 1250
         */
        const partes =
            texto.split(",");

        if (
            partes.length === 2 &&
            partes[1].length === 2
        ) {

            texto =
                partes[0] +
                "." +
                partes[1];

        } else {

            texto =
                texto.replace(/,/g, "");

        }

    }

    const numeroConvertido =
        Number(texto);

    return Number.isFinite(numeroConvertido)
        ? numeroConvertido
        : 0;
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
                        numeroPrecio(item.precio) *
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
                 numeroPrecio(producto.precio),

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
                numeroPrecio(producto.precio);

                item.nombre =
                    producto.nombre ||
                    item.nombre;

                item.imagen =
                    producto.imagen ||
                    item.imagen;

            }

            this.guardar();

            this.actualizarVista();

        },

disminuir(id) {

    const item =
        this.items.find(
            producto =>
                String(producto.id) ===
                String(id)
        );


    if (!item) {
        return;
    }


    /*
     * Si hay más de una unidad,
     * simplemente disminuimos.
     */

    if (
        numero(item.cantidad) > 1
    ) {

        item.cantidad--;

        this.guardar();

        this.actualizarVista();

        return;

    }


    /*
     * Si queda exactamente una unidad,
     * no eliminamos automáticamente.
     *
     * Primero pedimos confirmación.
     */

    const confirmar =
        window.confirm(
            "¿Está seguro que desea remover este artículo?"
        );


    if (!confirmar) {
        return;
    }


    /*
     * El usuario confirmó.
     * Eliminamos completamente el artículo.
     */

    this.items =
        this.items.filter(
            producto =>
                String(producto.id) !==
                String(id)
        );


    this.guardar();

    this.actualizarVista();

},

        eliminar(id) {

            this.items =
                this.items.filter(
                    producto =>
                        String(producto.id) !==
                        String(id)
                );

            this.guardar();

            this.actualizarVista();

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
                                numeroPrecio(producto.precio)
                        ) {

                            cambio = true;

                        }

                        return {

                            ...item,

                            nombre:
                                producto.nombre ||
                                item.nombre,

                        precio:
                            numeroPrecio(
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


        actualizarVista() {

    if (
        window.vistaMobileCarrito &&
        typeof window.vistaMobileCarrito.renderizar ===
            "function"
    ) {

        window.vistaMobileCarrito.renderizar({
            items: this.items,
            unidades: this.totalUnidades(),
            subtotal: this.subtotal()
        });

    }

    this.actualizarContador();

},




        actualizarContador() {

            const cantidad =
                this.totalUnidades();


            const boton =
                document.getElementById(
                    "btnCarrito"
                );


            /*
             * El botón puede no existir cuando
             * estamos en detalle, login u otra vista.
             *
             * El carrito NO se pierde.
             * El estado permanece en this.items.
             */

            if (!boton) {

                return;

            }


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


            badge.textContent =
                cantidad > 99
                    ? "99+"
                    : String(cantidad);


            badge.classList.toggle(
                "oculto",
                cantidad === 0
            );


            console.log(
                "CARRITO → contador actualizado:",
                cantidad
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

if (window.vistaMobileCarrito) {

    window.vistaMobileCarrito.renderizar({
        items: this.items,
        unidades: this.totalUnidades(),
        subtotal: this.subtotal()
    });

}


            console.log(
    "CARRITO → datos para nueva vista",
    {
        items: this.items,
        unidades: this.totalUnidades(),
        subtotal: this.subtotal()
    }
);


            

        },

        volver() {

            if (
                this.vistaActiva
            ) {

                history.back();

            }

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
