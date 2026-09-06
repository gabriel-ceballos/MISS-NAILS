/* =========================================================
   MISS NAILS
   API CENTRAL
   ========================================================= */

const API_URL =
    "https://miss-nails-api.ceballosgg2000.workers.dev/";


async function api(accion, datos = {}) {

    const inicioAPI = performance.now();

    try {

        const body =
            new URLSearchParams();

        body.append(
            "accion",
            accion
        );

        body.append(
            "datos",
            JSON.stringify(datos)
        );


        const respuesta =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    body
                }
            );

        console.log(
            "API →",
            accion,
            "→ respuesta en",
            Math.round(performance.now() - inicioAPI),
            "ms"
        );


        const json =
            await respuesta.json();

        return json;


    } catch (error) {

        console.error(
            "API → ERROR:",
            error
        );

        return {
            ok: false,
            mensaje: error.message
        };

    }
}


window.api = api;