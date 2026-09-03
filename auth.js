/* =========================================================
   MISS NAILS
   AUTENTICACIÓN
   ========================================================= */

window.auth = {

    async login(
        correo,
        password
    ) {

        return await api(
            "login",
            {
                correo,
                password
            }
        );
    }
};