const productos = {

    mostrar(){

        const app =
            document.getElementById("app");

        app.innerHTML = `

<div class="pantalla">

    <header class="barra-superior">

        <button id="btnRegresar">

            ←

        </button>

        <h2>

            Productos

        </h2>

    </header>

    <main>

        <h1>

            Catálogo de Productos

        </h1>

        <p>

            Aquí aparecerán los productos.

        </p>

    </main>

</div>

`;

        this.inicializar();

    },

    inicializar(){

        document
            .getElementById("btnRegresar")
            .addEventListener(
                "click",
                ()=>{

                    dashboard.mostrar();

                }
            );

    }

};