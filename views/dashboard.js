const dashboard = {

mostrar(){

    layout.mostrar();

    layout.header();

    layout.contenido(`

<div class="dashboard">

    <section class="bienvenida">

        <h1>

            Hola ${sesion.usuario.nombre.split(" ")[0]} 👋

        </h1>

        <p>

            ¿Qué deseas hacer hoy?

        </p>

    </section>

    <section class="panel-dashboard">

        <div class="tarjeta" id="btnProductos">

            <div class="icono">

                📦

            </div>

            <h2>

                Productos

            </h2>

        </div>

        <div class="tarjeta" id="btnPedidos">

            <div class="icono">

                🛒

            </div>

            <h2>

                Pedidos

            </h2>

        </div>

        <div class="tarjeta" id="btnCuenta">

            <div class="icono">

                ⚙

            </div>

            <h2>

                Mi Cuenta

            </h2>

        </div>

        <div class="tarjeta" id="btnSalir">

            <div class="icono">

                🚪

            </div>

            <h2>

                Salir

            </h2>

        </div>

    </section>

</div>

`);

    this.inicializar();

},
    inicializar(){

        document
            .getElementById("btnProductos")
            .addEventListener(
                "click",
                ()=>{

                    productos.mostrar();

                }
            );

        document
            .getElementById("btnPedidos")
            .addEventListener(
                "click",
                ()=>{

                    alert("Pedidos");

                }
            );

        document
            .getElementById("btnCuenta")
            .addEventListener(
                "click",
                ()=>{

                    alert("Mi Cuenta");

                }
            );

        document
            .getElementById("btnSalir")
            .addEventListener(
                "click",
                ()=>{

                    location.reload();

                }
            );

    }

};