/*****************************************************************
 * MISS NAILS
 * PUENTE ENTRE GITHUB Y APPS SCRIPT
 *****************************************************************/

const URL_API = "https://miss-nails-api.ceballosgg2000.workers.dev/";

async function puente(accion, datos = {}) {

    try {

        console.log("PUENTE →", accion);

        const body = new URLSearchParams();

        body.append("accion", accion);
        body.append("datos", JSON.stringify(datos));

        const respuesta = await fetch(URL_API, {
            method: "POST",
            body: body
        });

        const json = await respuesta.json();

        console.log("BACKEND →", json);

        return json;

    } catch (error) {

        console.error("PUENTE ERROR:", error);

        return {
            ok: false,
            mensaje: error.message
        };

    }

}