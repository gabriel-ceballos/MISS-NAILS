const layout = {

    mostrar() {

        const app = document.getElementById("app");

        app.innerHTML = `

<div class="layout">

    <header id="header"></header>

    <section id="buscador"></section>

    <main id="contenido"></main>

    <nav id="bottomBar"></nav>

</div>

`;

        this.detectarPantalla();

        window.onresize = () => this.detectarPantalla();

    },

    header() {

        document.getElementById("header").innerHTML = `

<header class="mn-header">

    <div class="mn-logo">

        <img
            src="img/logo.png"
            alt="MISS NAILS">

    </div>

    <button
        class="mn-notificaciones"
        id="btnNotificaciones">

        🔔

        <span class="badge">0</span>

    </button>

</header>

`;

    },

    buscador() {

        document.getElementById("buscador").innerHTML = `

<section class="buscador">

    <input
        type="search"
        id="buscarProducto"
        placeholder="🔍 Buscar productos...">

</section>

`;

    },

    bottomBar() {

        document.getElementById("bottomBar").innerHTML = `

<nav class="bottom-nav">

    <button id="btnInicio">

        🏠

        <span>Inicio</span>

    </button>

    <button id="btnCarrito">

        🛒

        <span>Carrito</span>

    </button>

    <button id="btnCuenta">

        👤

        <span>Cuenta</span>

    </button>

</nav>

`;

    },

    contenido(html) {

        document.getElementById("contenido").innerHTML = html;

    },

    detectarPantalla() {

        document.body.classList.remove(

            "mobile",
            "tablet",
            "desktop"

        );

        const ancho = window.innerWidth;

        if (ancho < 768) {

            document.body.classList.add("mobile");

        } else if (ancho < 1200) {

            document.body.classList.add("tablet");

        } else {

            document.body.classList.add("desktop");

        }

    },

    render(opciones = {}) {

        this.mostrar();

        if (opciones.header !== false) {

            this.header();

        }

        if (opciones.buscador) {

            this.buscador();

        }

        if (opciones.bottomBar) {

            this.bottomBar();

        }

        this.contenido(

            opciones.contenido || ""

        );

    }

};