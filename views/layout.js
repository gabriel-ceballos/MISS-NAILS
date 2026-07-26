const layout = {

    mostrar() {

        const app = document.getElementById("app");

        app.innerHTML = `

<div class="layout">

    <header id="header"></header>

    <main id="contenido"></main>

</div>

`;

    },

    header() {

        document.getElementById("header").innerHTML = `

<header class="mn-header">

    <div class="mn-logo">

        <img
            src="img/logo.png"
            alt="Miss Nails">

    </div>

    <div class="mn-buscador">

        <input
            type="search"
            id="buscarGeneral"
            placeholder="Buscar productos...">

    </div>

    <button
        class="mn-carrito"
        id="btnCarritoSuperior">

        🛒
        <span id="cantidadCarrito">0</span>

    </button>

    <div class="mn-usuario">

        👤
        ${sesion.usuario.nombre}
        ▼

    </div>

</header>

`;

    },

    contenido(html){

        document.getElementById("contenido").innerHTML = html;

    }

};