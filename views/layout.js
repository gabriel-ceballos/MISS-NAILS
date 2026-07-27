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
        class="mn-notificaciones"
        id="btnNotificaciones">

        🔔

        <span class="badge">

            0

        </span>

    </button>

</header>

`;

},

    contenido(html){

        document.getElementById("contenido").innerHTML = html;

    }

};