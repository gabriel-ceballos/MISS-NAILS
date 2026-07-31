const tienda = {

    async mostrar() {

        const lista = await productosService.obtener();

        let htmlProductos = "";

        lista.forEach(producto => {

            htmlProductos += this.crearTarjeta(producto);

        });

        if (!htmlProductos) {

            htmlProductos = `

<div class="estado-vacio">

    <strong>No hay productos disponibles</strong>

    <span>Cuando el catalogo este listo, aparecera aqui automaticamente.</span>

</div>

`;

        }

        layout.render({

            header: true,

            buscador: true,

            bottomBar: true,

            contenido: `

<div class="tienda">


    <section class="categorias" aria-label="Categorias">

        <button class="categoria activa" type="button">

            Todas

        </button>

        <button class="categoria" type="button">

            Gel

        </button>

        <button class="categoria" type="button">

            Rubber

        </button>

        <button class="categoria" type="button">

            Acrilicos

        </button>

        <button class="categoria" type="button">

            Top Coat

        </button>

        <button class="categoria" type="button">

            Promociones

        </button>

    </section>

    
    <section
        class="productos"
        id="productosTienda">

        ${htmlProductos}

    </section>

</div>

`

        });

    },

crearTarjeta(producto){

    return `

<article class="producto">

    <div class="foto">

        <img
            src="${producto.imagen || 'img/productos/sin-foto.png'}"
            class="fotoProducto"
            alt="${producto.nombre || 'Producto MISS NAILS'}">

    </div>

    <div class="producto__contenido">

        <h3>${producto.nombre}</h3>

        <p class="precio">

            ${producto.precio}

        </p>

        <button
            class="btnAgregar"
            data-id="${producto.id}"
            type="button">

            Agregar

        </button>

    </div>

</article>

`;

}

};
