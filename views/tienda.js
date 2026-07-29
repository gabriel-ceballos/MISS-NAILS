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

    <section class="hero-tienda">

        <div class="hero-tienda__contenido">

            <span class="etiqueta-oferta">Venta especial MISS NAILS</span>

            <h1>Todo para tus unas en un solo lugar</h1>

            <p>

                Compra geles, acrilicos, herramientas y decoracion con una experiencia rapida, moderna y lista para celular.

            </p>

            <div class="hero-tienda__acciones">

                <a href="#productosTienda">Ver productos</a>

                <span>Ofertas por tiempo limitado</span>

            </div>

        </div>

        <div class="hero-tienda__panel">

            <span>Hasta</span>

            <strong>45%</strong>

            <small>menos en kits seleccionados</small>

        </div>

    </section>

    <section class="beneficios-tienda" aria-label="Beneficios de compra">

        <article>

            <strong>Envio nacional</strong>

            <span>Seguimiento de pedido</span>

        </article>

        <article>

            <strong>Compra protegida</strong>

            <span>Atencion personalizada</span>

        </article>

        <article>

            <strong>Precio salon</strong>

            <span>Ideal para profesionales</span>

        </article>

    </section>

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

    <section class="encabezado-productos">

        <div>

            <span class="etiqueta-oferta">Catalogo</span>

            <h2>Productos destacados</h2>

        </div>

        <p>Orden visual tipo marketplace, conservando los datos reales del backend.</p>

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

        <span class="producto-badge">Oferta</span>

    </div>

    <div class="producto__contenido">

        <h3>

            ${producto.nombre}

        </h3>

        <p class="producto__detalle">

            Producto seleccionado para salon y uso profesional.

        </p>

        <div class="producto__meta">

            <span>4.8</span>

            <span>Envio disponible</span>

        </div>

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
