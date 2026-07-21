console.log("VERSION NUEVA APP");
console.log("APP cargada");

async function iniciar() {

    const respuesta = await puente("ping");

    console.log("RESPUESTA DEL BACKEND:", respuesta);

    login.mostrar();

}

iniciar();