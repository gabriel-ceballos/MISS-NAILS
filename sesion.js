/*****************************************************************
 * MISS NAILS
 * SESIÓN
 *****************************************************************/

window.sesion = {

    usuario: null,


    cargar() {

        try {

            const datos =
                localStorage.getItem(
                    "missNailsSesion"
                );


            if (!datos) {

                this.usuario = null;

                console.log(
                    "SESION → no existe sesión guardada"
                );

                return false;

            }


            this.usuario =
                JSON.parse(datos);


            if (!this.usuario) {

                localStorage.removeItem(
                    "missNailsSesion"
                );

                return false;

            }


            console.log(
                "SESION → recuperada",
                this.usuario
            );


            return true;


        } catch (error) {

            console.error(
                "SESION → error al recuperar",
                error
            );


            this.usuario = null;


            localStorage.removeItem(
                "missNailsSesion"
            );


            return false;

        }

    },


    guardar(usuario) {

        try {

            this.usuario =
                usuario;


            localStorage.setItem(
                "missNailsSesion",
                JSON.stringify(usuario)
            );


            console.log(
                "SESION → guardada correctamente"
            );


        } catch (error) {

            console.error(
                "SESION → error al guardar",
                error
            );

        }

    },


    cerrar() {

        this.usuario = null;


        localStorage.removeItem(
            "missNailsSesion"
        );


        console.log(
            "SESION → cerrada"
        );

    }

};


console.log(
    "SESION CARGADA",
    window.sesion
);