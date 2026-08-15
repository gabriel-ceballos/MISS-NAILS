const pc = {

    mostrar(){

        document.getElementById("app").innerHTML = `

        <div class="pc">

            <header>

                <img
                    src="img/logo.png"
                    alt="Miss Nails">

                <input
                    type="search"
                    id="txtBuscar"
                    placeholder="Buscar productos...">

                <button
                    id="btnInicio"
                    type="button">

                    Inicio

                </button>

                <button
                    id="btnCarrito"
                    type="button">

                    Carrito

                </button>

                <button
                    id="btnCuenta"
                    type="button">

                    Cuenta

                </button>

                <button
                    id="btnNotificaciones"
                    type="button">

                    🔔

                </button>

            </header>

            <section id="categorias">

            </section>

            <main id="contenido">

            </main>

        </div>

        `;

    }

};


