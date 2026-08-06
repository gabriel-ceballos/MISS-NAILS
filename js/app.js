console.log("VERSION NUEVA APP");
console.log("APP cargada");

/*************************************************
SISTEMA
*************************************************/

const sistema = {

    pantalla: "",

    ancho: 0,

    alto: 0

};

/*************************************************
APP
*************************************************/

async function iniciar() {

    console.log("1. Antes de llamar a la API");

    const respuesta = await api("ping");

    console.log("2. La API respondió");

    console.log(respuesta);

    if (!respuesta.ok) {

        console.error("No fue posible conectar con el backend.");

        return;

    }

    sistema.ancho = window.innerWidth;

    sistema.alto = window.innerHeight;

    if (sistema.ancho < 768) {

        sistema.pantalla = "MOBILE";

    } else if (sistema.ancho < 1200) {

        sistema.pantalla = "TABLET";

    } else {

        sistema.pantalla = "DESKTOP";

    }

    console.log("================================");
    console.log("PANTALLA :", sistema.pantalla);
    console.log("ANCHO    :", sistema.ancho);
    console.log("ALTO     :", sistema.alto);
    console.log("================================");

    console.log("3. Voy a mostrar el login");

    login.mostrar();

    console.log("4. Login mostrado");

}

console.log("5. Voy a ejecutar iniciar()");

iniciar();

console.log("6. iniciar() fue llamada");