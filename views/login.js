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
      document.getElementById("correo").focus();

    },

inicializar(){

    const boton =
        document.getElementById("btnIngresar");

    const correo =
        document.getElementById("correo");

    const password =
        document.getElementById("password");

    boton.addEventListener(
        "click",
        () => this.ingresar()
    );

    correo.addEventListener(
        "keydown",
        (e)=>{

            if(e.key==="Enter"){

                e.preventDefault();

                password.focus();

            }

        }
    );

    password.addEventListener(
        "keydown",
        (e)=>{

            if(e.key==="Enter"){

                e.preventDefault();

                this.ingresar();

            }

        }
    );

    const activar =
        document.getElementById("activarCuenta");

    activar.addEventListener(
        "click",
        (e)=>{

            e.preventDefault();

            this.mostrarActivacion();

        }
    );

},

  async ingresar() {

    const boton = document.getElementById("btnIngresar");
    const correo = document.getElementById("correo");
    const password = document.getElementById("password");

    boton.disabled = true;
    boton.textContent = "Ingresando...";

    correo.disabled = true;
    password.disabled = true;

    try {

const respuesta = await auth.login(
    correo.value.trim(),
    password.value
);

console.log("LOGIN →", respuesta);

toast.mostrar(respuesta.mensaje);

if(respuesta.ok){

    sesion.usuario = respuesta.datos;

    dashboard.mostrar();

    return;

}

    } catch (error) {

        console.error(error);

        toast.mostrar("Error de comunicación");

    }

    boton.disabled = false;
    boton.textContent = "Ingresar";

    correo.disabled = false;
    password.disabled = false;

},

mostrarActivacion(){

    const app = document.getElementById("app");

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
                id="correoActivacion"
                placeholder="Correo">

            <input
                type="password"
                id="passwordActivacion"
                placeholder="Crear contraseña">

            <input
                type="password"
                id="confirmarActivacion"
                placeholder="Confirmar contraseña">

            <button id="btnActivar">

                Activar Cuenta

            </button>

            <a
                href="#"
                id="regresarLogin">

                Regresar

            </a>

            <div id="mensajeSistema"></div>

        </div>

    </div>

</div>

`;

    this.inicializarActivacion();

},

inicializarActivacion(){

    const boton =
        document.getElementById("btnActivar");

    boton.addEventListener(
        "click",
        () => this.activarCuenta()
    );

    const regresar =
        document.getElementById("regresarLogin");

    regresar.addEventListener(
        "click",
        (e)=>{

            e.preventDefault();

            this.mostrar();

        }
    );

},

activarCuenta(){

    console.log("Entré a activarCuenta()");

    toast.mostrar("Activación conectada");

}


};