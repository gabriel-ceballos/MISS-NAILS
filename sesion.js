/* =========================================================
   MISS NAILS
   SESIÓN DEL USUARIO
   ========================================================= */

window.sesion = {

    usuario: null,

    /*
     * CONFIGURACIÓN DE SESIÓN
     *
     * INACTIVIDAD:
     * La sesión vence después de 8 horas sin actividad.
     *
     * DURACIÓN MÁXIMA:
     * Aunque exista actividad, una sesión no puede permanecer
     * abierta más de 7 días desde su creación.
     *
     * Bloquear/desbloquear el teléfono NO modifica estos tiempos.
     */
    INACTIVIDAD_MAXIMA:
        8 * 60 * 60 * 1000,

    DURACION_MAXIMA:
        7 * 24 * 60 * 60 * 1000,

    CLAVE:
        "missNailsSesion",

    _ultimaEscrituraActividad: 0,


    cargar() {

        try {

            const guardado =
                localStorage.getItem(
                    this.CLAVE
                );

            if (!guardado) {

                this.usuario = null;

                return null;
            }

            const datos =
                JSON.parse(guardado);

            /*
             * Compatibilidad con la sesión anterior:
             * si ya existía una sesión guardada sin metadatos,
             * no obligamos al usuario a volver a entrar ahora.
             * La convertimos en una sesión nueva con los tiempos
             * actuales.
             */
            if (
                !datos ||
                typeof datos !== "object"
            ) {

                this.cerrar();

                return null;
            }

            const ahora =
                Date.now();

            if (
                !Number.isFinite(
                    Number(datos.inicioSesion)
                ) ||
                !Number.isFinite(
                    Number(datos.ultimaActividad)
                )
            ) {

                const usuario =
                    datos.usuario &&
                    typeof datos.usuario === "object"
                        ? datos.usuario
                        : datos;

                this.usuario =
                    usuario;

                this.guardar(
                    usuario
                );

                return this.usuario;
            }

            const inicioSesion =
                Number(
                    datos.inicioSesion
                );

            const ultimaActividad =
                Number(
                    datos.ultimaActividad
                );

            if (
                ahora - inicioSesion >=
                this.DURACION_MAXIMA
            ) {

                console.log(
                    "SESION → duración máxima vencida."
                );

                this.cerrar();

                return null;
            }

            if (
                ahora - ultimaActividad >=
                this.INACTIVIDAD_MAXIMA
            ) {

                console.log(
                    "SESION → inactividad máxima vencida."
                );

                this.cerrar();

                return null;
            }

            this.usuario =
                datos.usuario || null;

            if (!this.usuario) {

                this.cerrar();

                return null;
            }

            this._ultimaEscrituraActividad =
                ultimaActividad;

            return this.usuario;


        } catch (error) {

            console.error(
                "SESION → error al cargar:",
                error
            );

            this.usuario = null;

            localStorage.removeItem(
                this.CLAVE
            );

            return null;
        }
    },


    guardar(usuario) {

        this.usuario =
            usuario;

        const ahora =
            Date.now();

        const sesion = {

            usuario:
                usuario,

            inicioSesion:
                ahora,

            ultimaActividad:
                ahora
        };

        localStorage.setItem(
            this.CLAVE,
            JSON.stringify(sesion)
        );

        this._ultimaEscrituraActividad =
            ahora;
    },


    verificar() {

        if (!this.usuario) {
            return false;
        }

        try {

            const guardado =
                localStorage.getItem(
                    this.CLAVE
                );

            if (!guardado) {

                this.usuario = null;

                return false;
            }

            const datos =
                JSON.parse(guardado);

            const ahora =
                Date.now();

            const inicioSesion =
                Number(
                    datos.inicioSesion
                );

            const ultimaActividad =
                Number(
                    datos.ultimaActividad
                );

            if (
                !Number.isFinite(inicioSesion) ||
                !Number.isFinite(ultimaActividad) ||
                !datos.usuario
            ) {

                this.cerrar();

                return false;
            }

            if (
                ahora - inicioSesion >=
                this.DURACION_MAXIMA
            ) {

                console.log(
                    "SESION → duración máxima vencida."
                );

                this.cerrar();

                return false;
            }

            if (
                ahora - ultimaActividad >=
                this.INACTIVIDAD_MAXIMA
            ) {

                console.log(
                    "SESION → inactividad máxima vencida."
                );

                this.cerrar();

                return false;
            }

            this.usuario =
                datos.usuario;

            return true;

        } catch (error) {

            console.error(
                "SESION → error al verificar:",
                error
            );

            this.cerrar();

            return false;
        }
    },


    actividad() {

        if (!this.usuario) {
            return false;
        }

        const ahora =
            Date.now();

        /*
         * Evita escribir localStorage continuamente.
         * Una actividad se persiste como máximo una vez por minuto.
         */
        if (
            ahora -
            this._ultimaEscrituraActividad <
            60 * 1000
        ) {
            return true;
        }

        try {

            const guardado =
                localStorage.getItem(
                    this.CLAVE
                );

            if (!guardado) {

                this.usuario = null;

                return false;
            }

            const datos =
                JSON.parse(guardado);

            const inicioSesion =
                Number(
                    datos.inicioSesion
                );

            if (
                !Number.isFinite(
                    inicioSesion
                )
            ) {

                this.cerrar();

                return false;
            }

            if (
                ahora - inicioSesion >=
                this.DURACION_MAXIMA
            ) {

                this.cerrar();

                return false;
            }

            datos.usuario =
                this.usuario;

            datos.ultimaActividad =
                ahora;

            localStorage.setItem(
                this.CLAVE,
                JSON.stringify(datos)
            );

            this._ultimaEscrituraActividad =
                ahora;

            return true;

        } catch (error) {

            console.error(
                "SESION → error al registrar actividad:",
                error
            );

            return false;
        }
    },


    cerrar() {

        this.usuario =
            null;

        this._ultimaEscrituraActividad =
            0;

        localStorage.removeItem(
            this.CLAVE
        );
    }
};
