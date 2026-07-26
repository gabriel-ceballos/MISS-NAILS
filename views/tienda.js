const tienda = {

    mostrar() {

        layout.mostrar();

        layout.header();

        layout.contenido(`

<div class="tienda">



<div class="categorias">

    <button class="categoria activa">Todas</button>

    <button class="categoria">Geles</button>

    <button class="categoria">Rubber</button>

    <button class="categoria">Acrílicos</button>

    <button class="categoria">Top Coat</button>

    <button class="categoria">Promociones</button>

</div>

    <div class="productos">

        <div class="producto">

            <div class="foto"></div>

            <h3>Gel Pink</h3>

            <p>$250</p>

            <button>Agregar</button>

        </div>

        <div class="producto">

            <div class="foto"></div>

            <h3>Rubber Base</h3>

            <p>$180</p>

            <button>Agregar</button>

        </div>

        <div class="producto">

            <div class="foto"></div>

            <h3>Top Coat</h3>

            <p>$150</p>

            <button>Agregar</button>

        </div>

        <div class="producto">

            <div class="foto"></div>

            <h3>Acrílico Cover</h3>

            <p>$320</p>

            <button>Agregar</button>

        </div>

    </div>

</div>

`);

    }

};