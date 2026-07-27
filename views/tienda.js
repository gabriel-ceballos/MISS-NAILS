const tienda = {

    async mostrar() {

        layout.mostrar();

        layout.header();

        const lista = await productosService.obtener();

        let htmlProductos = "";

        lista.forEach(producto => {

            htmlProductos += this.crearTarjeta(producto);

        });

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

        ${htmlProductos}

    </div>

</div>

`);

    },

    crearTarjeta(producto){

        return `

<div class="producto">

    <div class="foto">

        <img
            src="${producto.imagen || 'img/productos/sin-foto.png'}"
            class="fotoProducto">

    </div>

    <h3>

        ${producto.nombre}

    </h3>

    <p class="precio">

        ${producto.precio}

    </p>

    <button
        class="btnAgregar"
        data-id="${producto.id}">

        🛒 Agregar

    </button>

</div>

`;

    }

};