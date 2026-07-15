class Toast {

    mostrar(mensaje, tipo = "success") {

         console.log("Toast ejecutado:", mensaje);

        const anterior = document.getElementById("mn-toast");

        if (anterior) {
            anterior.remove();
        }

        const toast = document.createElement("div");

        toast.id = "mn-toast";
        toast.className = `toast ${tipo}`;
        toast.textContent = mensaje;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("mostrar");
        }, 20);

        setTimeout(() => {

            toast.classList.remove("mostrar");

            setTimeout(() => {
                toast.remove();
            }, 300);

        }, 2500);

    }

}

const toast = new Toast();