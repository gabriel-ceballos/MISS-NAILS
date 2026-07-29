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

<div class="top-strip">

    <div class="top-strip__inner">

        <span>Envios a todo Mexico</span>

        <span>Compra segura para profesionales de unas</span>

    </div>

</div>

<header class="mn-header">

    <a
        href="#"
        class="mn-logo"
        aria-label="MISS NAILS inicio">

        <img
            src="img/logo.png"
            alt="MISS NAILS">

    </a>

    <div class="mn-header__promesa">

        <strong>Precios tipo marketplace</strong>

        <span>Kits, geles y herramientas para salon</span>

    </div>

    <button
        class="mn-notificaciones"
        id="btnNotificaciones"
        type="button"
        aria-label="Notificaciones">

        <span aria-hidden="true">!</span>

        <span class="badge">0</span>

    </button>

</header>

`;

    },

    buscador() {

        document.getElementById("buscador").innerHTML = `

<section class="buscador" aria-label="Buscador de productos">

    <label
        class="sr-only"
        for="buscarProducto">

        Buscar productos

    </label>

    <div class="buscador__campo">

        <span aria-hidden="true">Buscar</span>

        <input
            type="search"
            id="buscarProducto"
            placeholder="Gelish, rubber, lamparas, decoracion...">

    </div>

</section>

`;

    },

    bottomBar() {

        document.getElementById("bottomBar").innerHTML = `

<nav class="bottom-nav" aria-label="Navegacion principal">

    <button
        id="btnInicio"
        type="button">

        <span aria-hidden="true">Inicio</span>

        <small>Inicio</small>

    </button>

    <button
        id="btnCarrito"
        type="button">

        <span aria-hidden="true">Carrito</span>

        <small>Carrito</small>

    </button>

    <button
        id="btnCuenta"
        type="button">

        <span aria-hidden="true">Cuenta</span>

        <small>Cuenta</small>

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
