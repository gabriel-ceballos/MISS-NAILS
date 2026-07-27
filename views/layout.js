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
            alt="MISS NAILS">

    </div>

    <button
        class="mn-cart"
        id="btnCarritoSuperior">

        <span class="cart-icon">🛒</span>

        <span
            class="cart-count"
            id="cantidadCarrito">

            0

        </span>

    </button>

    <button
        class="mn-user"
        id="btnUsuario">

        <span class="user-icon">

            👤

        </span>

        <span class="user-name">

            ${sesion.usuario.nombre}

        </span>

    </button>

</header>

`;

},

    contenido(html){

        document.getElementById("contenido").innerHTML = html;

    }

};