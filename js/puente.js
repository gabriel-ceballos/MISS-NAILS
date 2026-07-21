const URL_API = "https://script.google.com/macros/s/AKfycbwVmomGVpO5BmeSctlIR-cacKqPB1w2fFU-iU23_7fqHZYfFeGX50sKThx-LR7TtltZ/exec";

async function puente(accion, datos = {}) {

    console.log("PUENTE: inicio");

    try {

        console.log("PUENTE: antes del fetch");

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

        console.log("PUENTE: fetch terminó", respuesta.status);

        const json = await respuesta.json();

        console.log("PUENTE: JSON recibido", json);

        return json;

    } catch (e) {

        console.error("PUENTE ERROR:", e);

        return {
            ok: false,
            mensaje: e.message
        };

    }

}