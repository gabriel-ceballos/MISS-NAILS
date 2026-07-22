/******************************************************************
 * AUTENTICACIÓN
 ******************************************************************/

async function login(correo, password) {

    return await api("login", {
        correo,
        password
    });

}