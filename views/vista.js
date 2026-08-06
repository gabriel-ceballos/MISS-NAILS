const vista = {

    mostrar(){

        switch(sistema.pantalla){

            case "MOBILE":

                this.mobile();

                break;

            case "TABLET":

                this.tablet();

                break;

            default:

                this.desktop();

                break;

        }

    },

    mobile(){

        document.getElementById("app").innerHTML = `

<div class="vista-mobile">

    <header>

        LOGO

        🔔

    </header>

    <section>

        BARRA DE BÚSQUEDA

    </section>

    <section>

        CATEGORÍAS

    </section>

    <main>

        CONTENIDO

    </main>

    <footer>

        INICIO

        CARRITO

        CUENTA

    </footer>

</div>

`;

    },

    tablet(){

        document.getElementById("app").innerHTML = `

<div class="vista-tablet">

    <header>

        LOGO

        BARRA DE BÚSQUEDA

        🔔

    </header>

    <section>

        CATEGORÍAS

    </section>

    <main>

        CONTENIDO

    </main>

    <footer>

        INICIO

        CARRITO

        CUENTA

    </footer>

</div>

`;

    },

    desktop(){

        document.getElementById("app").innerHTML = `

<div class="vista-desktop">

    <header>

        LOGO

        BARRA DE BÚSQUEDA

        INICIO

        CARRITO

        CUENTA

        🔔

    </header>

    <section>

        CATEGORÍAS

    </section>

    <main>

        CONTENIDO

    </main>

</div>

`;

    }

};