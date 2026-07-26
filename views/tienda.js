const tienda = {

    mostrar() {

        layout.mostrar();

        layout.header();

        layout.contenido(`

<div class="tienda">

    <div class="barra-tienda">

        <input
            type="search"
            id="buscarProducto"
            placeholder="Buscar productos...">

        <button id="btnCarrito">

            🛒 <span id="cantidadCarrito">0</span>

        </button>

    </div>

    <div class="categorias">

        <button>Todas</button>

        <button>Geles</button>

        <button>Rubber</button>

        <button>Acrílicos</button>

        <button>Top Coat</button>

        <button>Promociones</button>

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