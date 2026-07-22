/******************************************************************
 * API OFICIAL DE MISS NAILS
 ******************************************************************/

const API_URL = "https://miss-nails-api.ceballosgg2000.workers.dev/";

async function api(accion, datos = {}) {

    try {

        const body = new URLSearchParams();

        body.append("accion", accion);
        body.append("datos", JSON.stringify(datos));

        const respuesta = await fetch(API_URL, {
            method: "POST",
            body
        });

        return await respuesta.json();

    } catch (error) {

        console.error("API:", error);

        return {
            ok: false,
            mensaje: error.message
        };

    }

}