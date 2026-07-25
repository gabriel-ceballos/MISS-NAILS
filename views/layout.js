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

<div class="barra-superior">

    <div class="logo">

        <img
            src="img/logo.png"
            alt="Miss Nails">

    </div>

 <div class="usuario">

    ${sesion.usuario.nombre}

</div>

</div>

`;

    },

    contenido(html){

        document.getElementById("contenido").innerHTML = html;

    }

};