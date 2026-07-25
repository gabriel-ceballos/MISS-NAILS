const dashboard = {

mostrar(){

    layout.mostrar();

    layout.header();

layout.contenido(`

<div class="dashboard">

    <section class="contenido-dashboard">

        <div class="tarjeta" id="btnProductos">

            <h2>Productos</h2>

        </div>

        <div class="tarjeta" id="btnPedidos">

            <h2>Pedidos</h2>

        </div>

        <div class="tarjeta" id="btnCuenta">

            <h2>Mi Cuenta</h2>

        </div>

        <div class="tarjeta" id="btnSalir">

            <h2>Salir</h2>

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