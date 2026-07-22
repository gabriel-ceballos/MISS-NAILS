/*****************************************************************
 * MISS NAILS
 * API CENTRAL
 * Único archivo autorizado para comunicarse con el backend
 *****************************************************************/

const API_URL = "https://miss-nails-api.ceballosgg2000.workers.dev/";

async function api(accion, datos = {}) {

    try {

        console.log("API →", accion);

        const body = new URLSearchParams();

        body.append("accion", accion);
        body.append("datos", JSON.stringify(datos));

        const respuesta = await fetch(API_URL, {
            method: "POST",
            body
        });

        const json = await respuesta.json();

        console.log("BACKEND →", json);

        return json;

    } catch (error) {

        console.error("API ERROR:", error);

        return {
            ok: false,
            mensaje: error.message
        };

    }

}