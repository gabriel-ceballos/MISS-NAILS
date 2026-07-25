const dashboard = {

    mostrar(){

        const app =
            document.getElementById("app");

        app.innerHTML = `

<div class="dashboard">

    <header class="barra-superior">

<div class="logo">

    <img
        src="img/logo.png"
        alt="Miss Nails">

</div>

        <div class="usuario">

            ${sesion.usuario.nombre}

        </div>

    </header>

    <main class="panel-dashboard">

        <div class="tarjeta" id="btnProductos">

            <div class="icono">

                📦

            </div>

            <h2>Productos</h2>

        </div>

        <div class="tarjeta" id="btnPedidos">

            <div class="icono">

                🛒

            </div>

            <h2>Pedidos</h2>

        </div>

        <div class="tarjeta" id="btnCuenta">

            <div class="icono">

                ⚙

            </div>

            <h2>Mi Cuenta</h2>

        </div>

        <div class="tarjeta" id="btnSalir">

            <div class="icono">

                🚪

            </div>

            <h2>Salir</h2>

        </div>

    </main>

</div>

`;

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