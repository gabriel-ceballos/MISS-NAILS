/*****************************************************************
 * MISS NAILS
 * PUENTE ENTRE GITHUB Y APPS SCRIPT
 *****************************************************************/

// URL de la Web App de Apps Script
const URL_API = "AQUI_VA_LA_URL_DE_TU_WEBAPP";

/**
 * Envía una petición al backend.
 * @param {string} accion
 * @param {object} datos
 * @returns {Promise<object>}
 */
async function puente(accion, datos = {}) {

    try {

        const respuesta = await fetch(URL_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accion,
                datos
            })
        });

        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}`);
        }

        return await respuesta.json();

    } catch (error) {

        console.error("PUENTE:", error);

        return {
            ok: false,
            mensaje: error.message
        };

    }

}
