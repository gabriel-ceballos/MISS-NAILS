const login = {

    mostrar() {

        console.log("Entré a login.mostrar()");

        const app = document.getElementById("app");

        console.log(app);

       app.innerHTML = `

<div class="contenedor-login">

    <div class="tarjeta-login">

        <div class="logo-contenedor">

            <img
                src="img/logo.png"
                class="logo-missnails"
                alt="Miss Nails">

        </div>


           <div class="formulario">

        <input
            type="email"
            id="correo"
            placeholder="Correo">

        <input
            type="password"
            id="password"
            placeholder="Contraseña">

             <button id="btnIngresar">

        Ingresar

    </button>


     <a
        href="#"
        id="activarCuenta">

        Activar cuenta

    </a>

    <div id="mensajeSistema"></div>



    </div>



    </div>

</div>

`;

      this.inicializar();

    },

    inicializar(){

        const boton =
            document.getElementById("btnIngresar");

        boton.addEventListener(
            "click",
            () => this.ingresar()
        );

    },

   ingresar(){

    const boton = document.getElementById("btnIngresar");
    const correo = document.getElementById("correo");
    const password = document.getElementById("password");

    boton.disabled = true;
    boton.textContent = "Ingresando...";

    correo.disabled = true;
    password.disabled = true;

setTimeout(() => {

    toast.mostrar("Bienvenido a MISS NAILS");

    boton.disabled = false;
    boton.textContent = "Ingresar";

    correo.disabled = false;
    password.disabled = false;

},2000);

}
};