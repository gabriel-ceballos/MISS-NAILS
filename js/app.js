console.log("VERSION NUEVA APP");
console.log("APP cargada");

async function iniciar() {

    console.log("1. Antes de llamar a la API");

    const respuesta = await api("ping");

    console.log("2. La API respondió");

    console.log(respuesta);

    if (!respuesta.ok) {

        console.error("No fue posible conectar con el backend.");

        return;

    }

    console.log("3. Voy a mostrar el login");

    login.mostrar();

    console.log("4. Login mostrado");

}

console.log("5. Voy a ejecutar iniciar()");

iniciar();

console.log("6. iniciar() fue llamada");