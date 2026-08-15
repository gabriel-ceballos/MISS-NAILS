const tablet = {

    mostrar(){

        document.getElementById("app").innerHTML = `

        <div class="tablet">

            <header>

                <img
                    src="img/logo.png"
                    alt="Miss Nails">

                <input
                    type="search"
                    id="txtBuscar"
                    placeholder="Buscar productos...">

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

            <footer>

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

            </footer>

        </div>

        `;

    }

};

