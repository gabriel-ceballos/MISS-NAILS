const dashboard = {

mostrar(){

    layout.mostrar();

    layout.header();

layout.contenido(`

<div class="dashboard">

    <div class="panel-dashboard">

        <div class="card grande" id="btnProductos">
            <h2>PRODUCTOS</h2>
        </div>

        <div class="fila">

            <div class="card" id="btnPedidos">
                <h2>PEDIDOS</h2>
            </div>

            <div class="card" id="btnCuenta">
                <h2>MI CUENTA</h2>
            </div>

        </div>

        <div class="fila-centro">

            <div class="card salir" id="btnSalir">
                <h2>SALIR</h2>
            </div>

        </div>

    </div>

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