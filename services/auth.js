/*****************************************************************
 * SERVICIO DE AUTENTICACIÓN
 *****************************************************************/

const auth = {

    async login(correo, password) {

        return await api("login", {
            correo,
            password
        });

    }

};