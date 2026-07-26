const dashboard = {

mostrar(){

    layout.mostrar();

    layout.header();

    layout.contenido(`

<div class="tienda">

    <div class="barra-tienda">

        <input
            type="text"
            id="buscar"
            placeholder="Buscar productos...">

        <button
            id="btnCarrito"
            class="btn-carrito">

            🛒
            <span id="cantidadCarrito">0</span>

        </button>

    </div>

    <div class="categorias">

        <button class="categoria activa">Todas</button>
        <button class="categoria">Geles</button>
        <button class="categoria">Rubber</button>
        <button class="categoria">Acrílicos</button>
        <button class="categoria">Top Coat</button>
        <button class="categoria">Promociones</button>

    </div>

    <div
        id="contenedorProductos"
        class="grid-productos">

    </div>

</div>

`);

    this.inicializar();

},

inicializar(){

    productos.mostrar();

    document
        .getElementById("buscar")
        .addEventListener(
            "keyup",
            (e)=>{

                productos.buscar(e.target.value);

            }
        );

    document
        .getElementById("btnCarrito")
        .addEventListener(
            "click",
            ()=>{

                pedidos.mostrar();

            }
        );

}

};