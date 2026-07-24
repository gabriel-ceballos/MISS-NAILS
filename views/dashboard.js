const dashboard = {

    mostrar(){

        const app =
            document.getElementById("app");

        app.innerHTML = `

            <div style="padding:40px">

                <h1>MISS NAILS</h1>

                <h2>Bienvenido ${sesion.usuario.nombre}</h2>

            </div>

        `;

    }

};