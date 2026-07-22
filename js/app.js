console.log("VERSION NUEVA APP");
console.log("APP cargada");

async function iniciar() {

    console.log("1. Antes de llamar al puente");

    const respuesta = await puente("ping");

    console.log("2. El puente respondió");

    console.log(respuesta);

    console.log("3. Voy a mostrar el login");

    login.mostrar();

    console.log("4. Login mostrado");

}

console.log("5. Voy a ejecutar iniciar()");

iniciar();

console.log("6. iniciar() fue llamada");