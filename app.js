
/* =========================================================
   MISS NAILS — CONTROLADOR PRINCIPAL

   Responsabilidades:
   - Iniciar la aplicación.
   - Resolver la sesión.
   - Navegar entre vistas.
   - Mantener actualizado el estado visual del viewport.

   IMPORTANTE:
   - NO detecta tipo de dispositivo.
   - NO decide Android / iPhone / tablet / PC.
   - La orientación se calcula únicamente con el tamaño real
     disponible del viewport.
   ========================================================= */

(function () {

    "use strict";

    /* =========================================================
       MISS NAILS — LECTURA DEL TIPO DE DISPOSITIVO

       SOLO agrega la identificación del entorno.
       NO modifica catálogo, inventario, productos, carrito,
       cuenta, navegación ni la lógica existente.
       NO utiliza dimensiones del viewport para clasificar.
       ========================================================= */
    const entornoDispositivo = {

        leer() {
            const nav = window.navigator || {};
            const ua = String(nav.userAgent || "");
            const uaData = nav.userAgentData || null;
            const touchPoints = Number(nav.maxTouchPoints || 0);

            const esIPhone = /iPhone|iPod/i.test(ua);
            const esIPadUA = /iPad/i.test(ua);

            /*
             * iPadOS puede presentarse ante Safari como Macintosh.
             * Los puntos táctiles permiten reconocer ese caso.
             */
            const esIPadOS =
                /Macintosh/i.test(ua) &&
                touchPoints > 1;

            const esAppleTablet =
                esIPadUA || esIPadOS;

            const esAndroid =
                /Android/i.test(ua);

            const esAndroidMovil =
                esAndroid && /Mobile/i.test(ua);

            const esAndroidTablet =
                esAndroid && !/Mobile/i.test(ua);

            let tipo = "pc";
            let metodo = "entorno de escritorio";

            /*
             * Primero resolvemos los casos inequívocos de tablet.
             * Esto evita convertir una tablet en teléfono por una
             * señal genérica de "mobile".
             */
            if (esAppleTablet) {
                tipo = "tablet";
                metodo = "Apple / iPadOS";
            } else if (esAndroidTablet) {
                tipo = "tablet";
                metodo = "Android tablet";
            } else if (esIPhone) {
                tipo = "telefono";
                metodo = "Apple / iPhone";
            } else if (esAndroidMovil) {
                tipo = "telefono";
                metodo = "Android Mobile";
            } else if (
                uaData &&
                typeof uaData.mobile === "boolean" &&
                uaData.mobile
            ) {
                /*
                 * Solo usamos UA-CH mobile como respaldo.
                 * Las señales específicas de tablet ya fueron
                 * evaluadas antes.
                 */
                tipo = "telefono";
                metodo = "User-Agent Client Hints";
            }

            let plataforma = "desconocida";

            if (
                uaData &&
                typeof uaData.platform === "string" &&
                uaData.platform
            ) {
                plataforma = uaData.platform;
            } else if (/iPhone|iPad|iPod|Macintosh/i.test(ua)) {
                plataforma = "Apple";
            } else if (esAndroid) {
                plataforma = "Android";
            } else if (/Windows/i.test(ua)) {
                plataforma = "Windows";
            } else if (/Mac OS X|Macintosh/i.test(ua)) {
                plataforma = "macOS";
            } else if (/Linux/i.test(ua)) {
                plataforma = "Linux";
            } else {
                plataforma = String(
                    nav.platform || "desconocida"
                );
            }

            const viewport = this.leerViewport();

            return {
                tipo,
                metodo,
                plataforma,
                mobileUA:
                    uaData &&
                    typeof uaData.mobile === "boolean"
                        ? uaData.mobile
                        : null,
                userAgentDataDisponible: !!uaData,
                touchPoints,
                userAgent: ua,
                viewport,
                orientacion:
                    viewport.ancho >= viewport.alto
                        ? "horizontal"
                        : "vertical"
            };
        },

        leerViewport() {
            const vv = window.visualViewport;

            return {
                ancho: Math.round(
                    vv ? vv.width : window.innerWidth
                ),
                alto: Math.round(
                    vv ? vv.height : window.innerHeight
                )
            };
        }
    };

    window.missNailsEntorno =
        entornoDispositivo.leer();

    console.group(
        "MISS NAILS → ENTORNO DEL DISPOSITIVO"
    );

    console.table({
        dispositivo:
            window.missNailsEntorno.tipo,
        metodo:
            window.missNailsEntorno.metodo,
        plataforma:
            window.missNailsEntorno.plataforma,
        mobileUA:
            window.missNailsEntorno.mobileUA,
        uaCH:
            window.missNailsEntorno
                .userAgentDataDisponible,
        touchPoints:
            window.missNailsEntorno.touchPoints,
        viewport:
            `${window.missNailsEntorno.viewport.ancho} × ${window.missNailsEntorno.viewport.alto}`,
        orientacion:
            window.missNailsEntorno.orientacion
    });

    console.log(
        "MISS NAILS → tipo identificado:",
        window.missNailsEntorno.tipo
    );

    console.log(
        "MISS NAILS → datos del entorno:",
        window.missNailsEntorno
    );

    console.groupEnd();

    /* =========================================================
       ACTUALIZACIÓN DEL ENTORNO AL GIRAR EL DISPOSITIVO

       La identificación se vuelve a leer cuando cambia el viewport
       o la orientación. No modifica ninguna vista ni lógica de la app.
       ========================================================= */
    let firmaEntornoAnterior = JSON.stringify({
        tipo: window.missNailsEntorno.tipo,
        orientacion: window.missNailsEntorno.orientacion,
        ancho: window.missNailsEntorno.viewport.ancho,
        alto: window.missNailsEntorno.viewport.alto
    });

    function actualizarEntornoDispositivo() {
        const nuevo = entornoDispositivo.leer();

        const firmaNueva = JSON.stringify({
            tipo: nuevo.tipo,
            orientacion: nuevo.orientacion,
            ancho: nuevo.viewport.ancho,
            alto: nuevo.viewport.alto
        });

        window.missNailsEntorno = nuevo;

        if (firmaNueva === firmaEntornoAnterior) {
            return;
        }

        firmaEntornoAnterior = firmaNueva;

        console.group(
            "MISS NAILS → ENTORNO DEL DISPOSITIVO ACTUALIZADO"
        );

        console.table({
            dispositivo: nuevo.tipo,
            metodo: nuevo.metodo,
            plataforma: nuevo.plataforma,
            mobileUA: nuevo.mobileUA,
            uaCH: nuevo.userAgentDataDisponible,
            touchPoints: nuevo.touchPoints,
            viewport: `${nuevo.viewport.ancho} × ${nuevo.viewport.alto}`,
            orientacion: nuevo.orientacion
        });

        console.log(
            "MISS NAILS → tipo identificado:",
            nuevo.tipo
        );

        console.log(
            "MISS NAILS → orientación actual:",
            nuevo.orientacion
        );

        console.groupEnd();
    }

    window.addEventListener(
        "resize",
        actualizarEntornoDispositivo,
        { passive: true }
    );

    window.addEventListener(
        "orientationchange",
        actualizarEntornoDispositivo,
        { passive: true }
    );

    if (window.visualViewport) {
        window.visualViewport.addEventListener(
            "resize",
            actualizarEntornoDispositivo,
            { passive: true }
        );
    }

    /* =========================================================
       ERUDA — CONSOLA DE DIAGNÓSTICO
       Se carga aparte y no participa en la aplicación.
       ========================================================= */
    (function cargarEruda() {
        if (window.eruda) {
            window.eruda.init();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/eruda";
        script.async = true;
        script.onload = function () {
            if (window.eruda) {
                window.eruda.init();
                console.log("MISS NAILS → Eruda activo");

                /*
                 * Eruda se carga de forma asíncrona. La detección del
                 * dispositivo ocurre antes de que Eruda exista, por lo
                 * que esos mensajes no aparecen en su consola.
                 *
                 * Reemitimos SOLO la información del entorno una vez
                 * que Eruda está activo. No modificamos ninguna lógica
                 * de catálogo, inventario, productos, carrito, cuenta
                 * ni navegación.
                 */
                if (window.missNailsEntorno) {
                    console.group(
                        "MISS NAILS → ENTORNO DEL DISPOSITIVO"
                    );

                    console.table({
                        dispositivo:
                            window.missNailsEntorno.tipo,
                        metodo:
                            window.missNailsEntorno.metodo,
                        plataforma:
                            window.missNailsEntorno.plataforma,
                        mobileUA:
                            window.missNailsEntorno.mobileUA,
                        uaCH:
                            window.missNailsEntorno
                                .userAgentDataDisponible,
                        touchPoints:
                            window.missNailsEntorno.touchPoints,
                        viewport:
                            `${window.missNailsEntorno.viewport.ancho} × ${window.missNailsEntorno.viewport.alto}`,
                        orientacion:
                            window.missNailsEntorno.orientacion
                    });

                    console.log(
                        "MISS NAILS → tipo identificado:",
                        window.missNailsEntorno.tipo
                    );

                    console.log(
                        "MISS NAILS → datos del entorno:",
                        window.missNailsEntorno
                    );

                    console.groupEnd();
                }
            }
        };
        script.onerror = function () {
            console.warn(
                "MISS NAILS → no fue posible cargar Eruda"
            );
        };
        document.head.appendChild(script);
    })();


    const app = {

        vistaActual: null,

        /*************************************************
         * INICIO
         *************************************************/
        async iniciar() {

            console.log(
                "APP → iniciando MISS NAILS"
            );

            /*
             * Activar inmediatamente el estado del viewport.
             * Esto ocurre antes de construir el catálogo.
             */
            this.inicializarOrientacion();

            /*
             * RETORNO DE MICROSOFT
             *
             * Solo procesamos Microsoft cuando realmente existe
             * un código o error devuelto en la URL.
             */
            const parametrosMicrosoft =
                new URLSearchParams(
                    window.location.search
                );

            const tieneRetornoMicrosoft =
                parametrosMicrosoft.has("code") ||
                parametrosMicrosoft.has("error");

            if (
                tieneRetornoMicrosoft &&
                window.auth &&
                typeof window.auth.procesarMicrosoftRedirect ===
                    "function"
            ) {

                const microsoft =
                    await window.auth.procesarMicrosoftRedirect();

                if (microsoft?.ok) {

                    sesion.guardar(
                        microsoft.datos
                    );

                    this.iniciarControlSesion();
                    this.ir("catalogo");

                    return;
                }

                if (microsoft && !microsoft.ok) {

                    console.warn(
                        "APP → acceso Microsoft:",
                        microsoft.mensaje
                    );

                    window._missNailsAuthMensaje =
                        microsoft.mensaje ||
                        "No fue posible iniciar sesión con Microsoft.";
                }
            }


            /*
             * PING EN SEGUNDO PLANO
             *
             * No bloqueamos la entrada al catálogo/login esperando
             * la respuesta del backend. La conexión se comprueba,
             * pero la navegación continúa inmediatamente.
             */
            api("ping")
                .then((respuesta) => {

                    console.log(
                        "APP → ping:",
                        respuesta
                    );

                })
                .catch((error) => {

                    console.error(
                        "APP → error de comunicación:",
                        error
                    );

                });


            const usuario =
                sesion.cargar();

            if (usuario) {

                this.iniciarControlSesion();

                this.ir("catalogo");

                return;

            }

            this.ir("login");

        },


        /*************************************************
         * CONTROL DE SESIÓN
         *
         * Vigila la sesión mientras Miss Nails está abierta.
         * Si vence por inactividad o duración máxima, lleva
         * automáticamente al usuario al LOGIN.
         *************************************************/
        iniciarControlSesion() {

            if (this._controlSesionIniciado) {
                return;
            }

            this._controlSesionIniciado = true;

            const detener = () => {

                if (this._controlSesionTimer) {
                    clearInterval(
                        this._controlSesionTimer
                    );

                    this._controlSesionTimer = null;
                }

                this._controlSesionIniciado = false;
            };

            const comprobar = () => {

                if (this.vistaActual === "login") {
                    return true;
                }

                if (!sesion.verificar()) {

                    detener();

                    console.log(
                        "APP → sesión vencida. Regresando a LOGIN."
                    );

                    this.ir("login");

                    return false;
                }

                return true;
            };

            const registrarActividad = () => {

                if (!comprobar()) {
                    return;
                }

                sesion.actividad();
            };

            const eventos = [
                "pointerdown",
                "keydown",
                "touchstart",
                "click"
            ];

            eventos.forEach((evento) => {
                window.addEventListener(
                    evento,
                    registrarActividad,
                    { passive: true }
                );
            });

            /*
             * Al volver después de bloqueo, suspensión, cambio de pestaña
             * o segundo plano, se comprueba inmediatamente la sesión.
             */
            document.addEventListener(
                "visibilitychange",
                () => {

                    if (document.hidden) {
                        return;
                    }

                    if (!comprobar()) {
                        return;
                    }

                    sesion.actividad();
                },
                { passive: true }
            );

            window.addEventListener(
                "pageshow",
                () => {

                    if (!comprobar()) {
                        return;
                    }

                    sesion.actividad();
                },
                { passive: true }
            );

            /*
             * Comprobación frecuente mientras la página permanece activa.
             * Si el navegador suspende JavaScript durante el bloqueo,
             * visibilitychange/pageshow comprueban al regresar.
             */
            this._controlSesionTimer =
                setInterval(
                    comprobar,
                    15 * 1000
                );

            comprobar();
        },


        /*************************************************
         * ORIENTACIÓN / VIEWPORT
         *
         * No usamos @media (orientation) como mecanismo
         * principal. Cada cambio real del viewport vuelve
         * a aplicar la clase correspondiente al .mobile.
         *************************************************/
        inicializarOrientacion() {

            const actualizar = () => {
                this.actualizarOrientacion();
            };

            const recuperarOrientacion = () => {
                this.iniciarRecuperacionOrientacion();
            };

            window.addEventListener(
                "resize",
                actualizar,
                { passive: true }
            );

            window.addEventListener(
                "orientationchange",
                recuperarOrientacion,
                { passive: true }
            );

            if (window.visualViewport) {
                window.visualViewport.addEventListener(
                    "resize",
                    actualizar,
                    { passive: true }
                );
            }

            document.addEventListener(
                "visibilitychange",
                () => {
                    if (!document.hidden) {
                        recuperarOrientacion();
                    }
                },
                { passive: true }
            );

            window.addEventListener(
                "pageshow",
                recuperarOrientacion,
                { passive: true }
            );

            actualizar();
            this.iniciarRecuperacionOrientacion();
        },


        iniciarRecuperacionOrientacion() {

            if (this._orientacionRecoveryTimer) {
                clearTimeout(this._orientacionRecoveryTimer);
                this._orientacionRecoveryTimer = null;
            }

            /*
             * Android/Chrome puede entregar durante unos cientos de
             * milisegundos un viewport transitorio al desbloquear.
             * Durante esa ventana usamos la orientación real de
             * Screen Orientation, no una clasificación del dispositivo.
             */
            this._orientacionRecovery = true;

            const reintentos = [0, 50, 120, 250, 450, 700, 1000, 1400];

            reintentos.forEach((ms) => {
                setTimeout(() => {
                    this.actualizarOrientacion(true);
                }, ms);
            });

            this._orientacionRecoveryTimer = setTimeout(() => {
                this._orientacionRecovery = false;
                this.actualizarOrientacion(false);
                this.sincronizarFooter();
                this.sincronizarCatalogoTrasOrientacion();
                this._orientacionRecoveryTimer = null;
            }, 1700);
        },


        obtenerOrientacionViewport(usandoRecovery) {

            const viewport = window.visualViewport;

            const ancho = viewport
                ? viewport.width
                : window.innerWidth;

            const alto = viewport
                ? viewport.height
                : window.innerHeight;

            if (
                !Number.isFinite(ancho) ||
                !Number.isFinite(alto) ||
                ancho <= 0 ||
                alto <= 0
            ) {
                return null;
            }

            /*
             * En recuperación de bloqueo/desbloqueo, Android ya conoce
             * la orientación de la pantalla aunque el viewport visual
             * todavía esté reconstruyéndose. Si está disponible,
             * preferimos ese dato temporalmente.
             */
            if (
                usandoRecovery &&
                window.screen &&
                window.screen.orientation &&
                typeof window.screen.orientation.type === "string"
            ) {
                const tipo = window.screen.orientation.type;

                if (tipo.indexOf("landscape") === 0) {
                    return { ancho, alto, horizontal: true };
                }

                if (tipo.indexOf("portrait") === 0) {
                    return { ancho, alto, horizontal: false };
                }
            }

            return {
                ancho,
                alto,
                horizontal: ancho > alto
            };
        },


        actualizarOrientacion(usandoRecovery = false) {

            const vistas =
                document.querySelectorAll(
                    ".mobile"
                );

            if (!vistas.length) {
                return;
            }

            const datos =
                this.obtenerOrientacionViewport(
                    usandoRecovery || this._orientacionRecovery === true
                );

            if (!datos) {
                return;
            }

            const horizontal = datos.horizontal;

            vistas.forEach((vista) => {

                const claseNueva = horizontal
                    ? "mn-horizontal"
                    : "mn-vertical";

                /*
                 * No tocamos el DOM si el estado ya es correcto.
                 * Esto evita reconstrucciones innecesarias durante
                 * los múltiples resize que produce Android.
                 */
                if (vista.classList.contains(claseNueva)) {
                    return;
                }

                vista.classList.remove(
                    "mn-vertical",
                    "mn-horizontal"
                );

                vista.classList.add(claseNueva);
            });

            this.sincronizarFooter();

            console.log(
                "APP → viewport:",
                Math.round(datos.ancho),
                "x",
                Math.round(datos.alto),
                "→",
                horizontal
                    ? "HORIZONTAL"
                    : "VERTICAL"
            );
        },

        /*************************************************
         * SINCRONIZAR CATÁLOGO DESPUÉS DE ORIENTACIÓN
         *
         * Solo se ejecuta al terminar la recuperación de orientación.
         * No consulta datos ni reconstruye la vista completa.
         * El catálogo recalcula su capacidad real y conserva el
         * contenido/posición existentes.
         *************************************************/
        sincronizarCatalogoTrasOrientacion() {

            if (this.vistaActual !== "catalogo") {
                return;
            }

            if (
                !window.catalogo ||
                typeof window.catalogo.sincronizarLayoutTrasOrientacion !==
                    "function"
            ) {
                return;
            }

            const sincronizar = () => {
                if (this.vistaActual !== "catalogo") {
                    return;
                }

                window.catalogo.sincronizarLayoutTrasOrientacion();
            };

            if (typeof window.requestAnimationFrame === "function") {
                window.requestAnimationFrame(sincronizar);
                return;
            }

            sincronizar();
        },

        /*************************************************
         * SINCRONIZAR FOOTER
         *
         * Android/Chrome puede conservar durante el desbloqueo
         * una geometría anterior del footer aunque el viewport
         * ya haya cambiado. Esta función no recrea el footer ni
         * modifica su contenido: únicamente vuelve a fijar su
         * caja y las dimensiones visuales que le corresponden.
         *************************************************/
        sincronizarFooter() {

            const contenedor =
                document.getElementById("mn-footer");

            const footer =
                document.getElementById("miss-nails-footer-mobile");

            if (!contenedor || !footer) {
                return;
            }

            /* Forzar una lectura antes de escribir evita que Chrome
             * conserve una composición intermedia después de unlock. */
            void contenedor.offsetHeight;

            footer.style.position = "static";
            footer.style.left = "auto";
            footer.style.right = "auto";
            footer.style.bottom = "auto";
            footer.style.transform = "none";
            footer.style.width = "100%";
            footer.style.height = "100%";
            footer.style.maxWidth = "none";
            footer.style.minWidth = "0";
            footer.style.minHeight = "0";
            footer.style.display = "grid";
            footer.style.gridTemplateColumns = "repeat(3,minmax(0,1fr))";
            footer.style.gridTemplateRows = "minmax(0,1fr)";
            footer.style.alignItems = "stretch";
            footer.style.overflow = "hidden";
            footer.style.boxSizing = "border-box";
            footer.style.webkitTextSizeAdjust = "100%";
            footer.style.textSizeAdjust = "100%";

            const botones =
                footer.querySelectorAll(".mn-footer-item");

            botones.forEach((boton) => {
                boton.style.width = "100%";
                boton.style.height = "100%";
                boton.style.minWidth = "0";
                boton.style.minHeight = "0";
                boton.style.boxSizing = "border-box";
                boton.style.padding = "4px 4px 3px";
                boton.style.display = "flex";
                boton.style.flexDirection = "column";
                boton.style.alignItems = "center";
                boton.style.justifyContent = "center";
                boton.style.gap = "1px";
                boton.style.overflow = "hidden";
            });

            footer.querySelectorAll(".mn-footer-icono-wrap")
                .forEach((elemento) => {
                    elemento.style.width = "36px";
                    elemento.style.height = "36px";
                    elemento.style.minWidth = "36px";
                    elemento.style.minHeight = "36px";
                    elemento.style.flex = "0 0 36px";
                });

            footer.querySelectorAll(".mn-footer-icono")
                .forEach((elemento) => {
                    elemento.style.width = "29px";
                    elemento.style.height = "29px";
                    elemento.style.flex = "0 0 29px";
                });

            footer.querySelectorAll(".mn-footer-icono svg")
                .forEach((elemento) => {
                    elemento.style.width = "29px";
                    elemento.style.height = "29px";

                    elemento.querySelectorAll("*")
                        .forEach((trazo) => {
                            trazo.style.strokeWidth = "1.6px";
                        });
                });

            footer.querySelectorAll(".mn-footer-label")
                .forEach((elemento) => {
                    elemento.style.fontSize = "11px";
                    elemento.style.lineHeight = "14px";
                    elemento.style.maxWidth = "100%";
                    elemento.style.overflow = "hidden";
                    elemento.style.textOverflow = "ellipsis";
                    elemento.style.whiteSpace = "nowrap";
                });

            /* Segunda lectura: obliga al navegador a aplicar la nueva
             * geometría antes de continuar con el siguiente frame. */
            void footer.offsetHeight;
        },


        /*************************************************
         * SINCRONIZACIÓN ROBUSTA DEL CONTADOR DEL CARRITO
         *
         * No modifica sesión, login, catálogo, orientación ni navegación.
         *
         * El contador depende de logicaCarrito, no de window.carrito.
         * Además, logicaCarrito puede haberse inicializado antes de que
         * el footer exista en el DOM. Por eso se reintenta después de
         * construir la vista.
         *
         * Si otra pestaña modifica localStorage, recargamos primero el
         * estado del carrito y después actualizamos exclusivamente su
         * indicador visual.
         *************************************************/
        sincronizarContadorCarrito() {

            const actualizar = () => {

                if (
                    !window.logicaCarrito ||
                    typeof window.logicaCarrito.actualizarContador !==
                        "function"
                ) {
                    return;
                }

                try {

                    if (
                        typeof window.logicaCarrito.cargar ===
                        "function"
                    ) {
                        window.logicaCarrito.cargar();
                    }

                    window.logicaCarrito.actualizarContador();

                } catch (error) {

                    console.warn(
                        "CARRITO → no fue posible sincronizar el contador:",
                        error
                    );

                }
            };

            actualizar();

            /*
             * El footer puede terminar de montarse en el mismo ciclo
             * de DOMContentLoaded. Estos reintentos cubren ese escenario
             * sin reconstruir ninguna vista.
             */
            [0, 50, 150, 300, 600, 1000].forEach((milisegundos) => {

                setTimeout(
                    actualizar,
                    milisegundos
                );

            });
        },


        /*************************************************
         * ACTUALIZACIÓN MANUAL POR GESTO
         *
         * Solo para teléfono y tablet.
         * No recarga la página.
         * Reutiliza la sincronización existente del catálogo.
         * El indicador visual bloquea la interacción durante
         * un instante y no muestra ningún mensaje adicional.
         *************************************************/
        async actualizarDatosPorGesto() {

            if (this._refreshGestoEnCurso) {
                return;
            }

            const tipo =
                window.missNailsEntorno?.tipo;

            if (
                tipo !== "telefono" &&
                tipo !== "tablet"
            ) {
                return;
            }

            if (!window.sesion?.usuario) {
                return;
            }

            if (
                !window.logicaCatalogo ||
                typeof window.logicaCatalogo.sincronizarProductos !==
                    "function"
            ) {
                return;
            }

            this._refreshGestoEnCurso = true;
            this.mostrarIndicadorRefresh();

            const inicio = performance.now();
            const duracionVisual = 1400;

            {

                const sincronizacion =
                    Promise.resolve()
                        .then(() =>
                            window.logicaCatalogo.sincronizarProductos()
                        )
                        .catch((error) => {
                            console.warn(
                                "MISS NAILS → actualización manual sin completar:",
                                error
                            );
                        })
                        .finally(() => {
                            this._refreshGestoEnCurso = false;
                        });

                /*
                 * El indicador permanece visible alrededor de 1.4 s.
                 * La consulta de datos continúa en segundo plano si
                 * el servidor tarda más; no se recarga la página.
                 */
                await new Promise((resolver) =>
                    setTimeout(resolver, duracionVisual)
                );

                const transcurrido =
                    performance.now() - inicio;

                console.log(
                    "MISS NAILS → indicador de actualización ocultado en",
                    Math.round(transcurrido),
                    "ms"
                );

                this.ocultarIndicadorRefresh();

                /*
                 * No esperamos la respuesta del servidor para retirar
                 * el bloqueo visual. Si la API tarda más, la actualización
                 * continúa en segundo plano y los datos se aplican cuando
                 * la respuesta llega.
                 */
            }
        },


        mostrarIndicadorRefresh() {

            let indicador =
                document.getElementById(
                    "mn-refresh-indicador"
                );

            if (!indicador) {

                indicador =
                    document.createElement("div");

                indicador.id =
                    "mn-refresh-indicador";

                indicador.setAttribute(
                    "aria-hidden",
                    "true"
                );

                indicador.innerHTML =
                    '<span class="mn-refresh-spinner"></span>';

                document.body.appendChild(
                    indicador
                );
            }

            indicador.classList.add(
                "activo"
            );
        },


        ocultarIndicadorRefresh() {

            const indicador =
                document.getElementById(
                    "mn-refresh-indicador"
                );

            if (!indicador) {
                return;
            }

            indicador.classList.remove(
                "activo"
            );
        },


        inicializarRefreshPorGesto() {

            if (this._refreshGestoInicializado) {
                return;
            }

            this._refreshGestoInicializado = true;

            let inicioY = 0;
            let contenedorScroll = null;
            let gestoActivo = false;
            let refrescarAlSoltar = false;

            const esDispositivoPermitido = () => {

                const tipo =
                    window.missNailsEntorno?.tipo;

                return (
                    tipo === "telefono" ||
                    tipo === "tablet"
                );
            };

            const buscarContenedorScroll =
                (elemento) => {

                    let actual = elemento;

                    while (
                        actual &&
                        actual !== document.body &&
                        actual !== document.documentElement
                    ) {

                        if (
                            actual instanceof HTMLElement
                        ) {

                            const estilo =
                                window.getComputedStyle(
                                    actual
                                );

                            const desplazable =
                                actual.scrollHeight >
                                actual.clientHeight;

                            const overflowVertical =
                                estilo.overflowY === "auto" ||
                                estilo.overflowY === "scroll";

                            if (
                                desplazable &&
                                overflowVertical
                            ) {
                                return actual;
                            }
                        }

                        actual =
                            actual.parentElement;
                    }

                    return null;
                };

            const gestoNoPermitido =
                (elemento) => {

                    if (!(elemento instanceof Element)) {
                        return true;
                    }

                    if (
                        elemento.closest(
                            "input, textarea, select, button, a, [contenteditable=\"true\"]"
                        )
                    ) {
                        return true;
                    }

                    if (
                        elemento.closest(
                            ".mobile-categorias"
                        )
                    ) {
                        return true;
                    }

                    return false;
                };

            window.addEventListener(
                "touchstart",
                (evento) => {

                    if (!esDispositivoPermitido()) {
                        return;
                    }

                    if (!window.sesion?.usuario) {
                        return;
                    }

                    if (
                        this._refreshGestoEnCurso
                    ) {
                        return;
                    }

                    const toque =
                        evento.touches?.[0];

                    if (!toque) {
                        return;
                    }

                    if (
                        gestoNoPermitido(
                            evento.target
                        )
                    ) {
                        return;
                    }

                    const contenedor =
                        buscarContenedorScroll(
                            evento.target
                        );

                    if (!contenedor) {
                        return;
                    }

                    if (
                        contenedor.scrollTop > 0
                    ) {
                        return;
                    }

                    inicioY = toque.clientY;
                    contenedorScroll = contenedor;
                    gestoActivo = true;
                    refrescarAlSoltar = false;
                },
                { passive: true }
            );

            window.addEventListener(
                "touchmove",
                (evento) => {

                    if (
                        !gestoActivo ||
                        !contenedorScroll ||
                        this._refreshGestoEnCurso
                    ) {
                        return;
                    }

                    const toque =
                        evento.touches?.[0];

                    if (!toque) {
                        return;
                    }

                    const desplazamiento =
                        toque.clientY - inicioY;

                    if (
                        desplazamiento <= 0 ||
                        contenedorScroll.scrollTop > 0
                    ) {
                        return;
                    }

                    if (desplazamiento >= 60) {
                        refrescarAlSoltar = true;

                        /*
                         * Evita que el navegador ejecute su propio
                         * pull-to-refresh una vez que Miss Nails
                         * reconoció el gesto.
                         */
                        evento.preventDefault();
                    }
                },
                { passive: false }
            );

            window.addEventListener(
                "touchend",
                () => {

                    if (!gestoActivo) {
                        return;
                    }

                    const ejecutar =
                        refrescarAlSoltar;

                    inicioY = 0;
                    contenedorScroll = null;
                    gestoActivo = false;
                    refrescarAlSoltar = false;

                    if (ejecutar) {
                        this.actualizarDatosPorGesto();
                    }
                },
                { passive: true }
            );

            window.addEventListener(
                "touchcancel",
                () => {
                    inicioY = 0;
                    contenedorScroll = null;
                    gestoActivo = false;
                    refrescarAlSoltar = false;
                },
                { passive: true }
            );
        },


        /*************************************************
         * COMPOSICIÓN DEL SHELL POR VISTA
         *
         * LOGIN:
         * - ocupa toda la pantalla
         * - no muestra footer
         *
         * VISTAS AUTENTICADAS:
         * - muestran footer
         *************************************************/
        actualizarShell(vista) {

            const shell =
                document.getElementById("mn-shell");

            const footer =
                document.getElementById("mn-footer");

            if (!shell) {
                return;
            }

            shell.classList.remove(
                "mn-shell-login",
                "mn-shell-autenticado"
            );

            if (vista === "login") {

                shell.classList.add(
                    "mn-shell-login"
                );

                if (footer) {
                    footer.style.display = "none";
                }

                return;
            }

            shell.classList.add(
                "mn-shell-autenticado"
            );

            if (footer) {
                footer.style.display = "";
            }
        },


        /*************************************************
         * NAVEGACIÓN
         *************************************************/
        ir(vista) {

            console.log(
                "APP → navegar:",
                vista
            );

            this.vistaActual =
                vista;

            this.actualizarShell(vista);

            if (
                vista !== "login" &&
                sesion.usuario
            ) {
                this.iniciarControlSesion();

                /*
                 * El contador se sincroniza en TODA vista autenticada.
                 * Esto cubre entrada, recarga y regreso desde carrito/cuenta.
                 */
                this.sincronizarContadorCarrito();
            }

            switch (vista) {

                case "login":

                    if (
                        window.login &&
                        typeof window.login.mostrar ===
                            "function"
                    ) {

                        window.login.mostrar();

                    } else {

                        this.mostrarError(
                            "No se pudo cargar el módulo de acceso."
                        );

                    }

                    break;


                case "catalogo":

                    if (
                        window.catalogo &&
                        typeof window.catalogo.mostrar ===
                            "function"
                    ) {

                        window.catalogo.mostrar();

                    } else {

                        console.warn(
                            "APP → catálogo todavía no cargado."
                        );

                    }

                    break;


                case "carrito":

                    if (
                        window.carrito &&
                        typeof window.carrito.mostrar ===
                            "function"
                    ) {

                        window.carrito.mostrar();

                    } else {

                        console.warn(
                            "APP → carrito todavía no cargado."
                        );

                    }

                    break;


                case "cuenta":

                    if (
                        window.cuenta &&
                        typeof window.cuenta.mostrar ===
                            "function"
                    ) {

                        window.cuenta.mostrar();

                    } else {

                        console.warn(
                            "APP → cuenta todavía no cargada."
                        );

                    }

                    break;


                default:

                    console.error(
                        "APP → vista desconocida:",
                        vista
                    );

            }

        },


        /*************************************************
         * ERROR VISUAL
         *************************************************/
        mostrarError(mensaje) {

            const contenedor =
                document.getElementById("app");

            if (!contenedor) {
                return;
            }

            contenedor.innerHTML = `
                <div class="mn-error">
                    <strong>
                        Ocurrió un problema
                    </strong>
                    <span>
                        ${String(mensaje)}
                    </span>
                </div>
            `;

        }

    };


    /*
     * =============================================================
     * CARRITO — SINCRONIZACIÓN POR CICLO DE VIDA Y STORAGE
     *
     * Estos eventos no alteran la sesión.
     * Solo vuelven a leer el carrito y refrescan su contador.
     * =============================================================
     */

    window.addEventListener(
        "storage",
        (evento) => {

            if (
                evento.storageArea === window.localStorage &&
                (
                    evento.key === "missNailsCarrito" ||
                    evento.key === null
                )
            ) {
                window.app?.sincronizarContadorCarrito();
            }

        }
    );

    window.addEventListener(
        "pageshow",
        () => {

            if (
                window.sesion?.usuario &&
                window.app
            ) {
                window.app.sincronizarContadorCarrito();
            }

        },
        { passive: true }
    );

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                !document.hidden &&
                window.sesion?.usuario &&
                window.app
            ) {
                window.app.sincronizarContadorCarrito();
            }

        },
        { passive: true }
    );

    window.addEventListener(
        "focus",
        () => {

            if (
                window.sesion?.usuario &&
                window.app
            ) {
                window.app.sincronizarContadorCarrito();
            }

        },
        { passive: true }
    );

    window.app = app;

    /* Inicializa una sola vez el gesto de actualización para
     * teléfono/tablet. No modifica ninguna vista. */
    window.app.inicializarRefreshPorGesto();


    /* =====================================================
       ARRANQUE ÚNICO
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {
            window.app.iniciar();
        },
        { once: true }
    );

})();
