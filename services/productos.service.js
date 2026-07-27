const productosService = {

    async obtener() {

        const respuesta = await api(
            "productos"
        );

        if (!respuesta.ok) {

            return [];

        }

        return respuesta.datos;

    }

};