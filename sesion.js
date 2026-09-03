/* =========================================================
   MISS NAILS
   SESIÓN DEL USUARIO
   ========================================================= */

window.sesion = {

    usuario: null,


    cargar() {

        try {

            const guardado =
                localStorage.getItem(
                    "missNailsSesion"
                );

            if (!guardado) {

                this.usuario = null;

                return null;
            }


            this.usuario =
                JSON.parse(guardado);

            return this.usuario;


        } catch (error) {

            console.error(
                "SESION → error al cargar:",
                error
            );

            this.usuario = null;

            localStorage.removeItem(
                "missNailsSesion"
            );

            return null;
        }
    },


    guardar(usuario) {

        this.usuario =
            usuario;

        localStorage.setItem(
            "missNailsSesion",
            JSON.stringify(usuario)
        );
    },


    cerrar() {

        this.usuario =
            null;

        localStorage.removeItem(
            "missNailsSesion"
        );
    }
};