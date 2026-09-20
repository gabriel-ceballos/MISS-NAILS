(() => {
"use strict";

/* Se coloca después de publicar el Apps Script ADMIN. */
const ADMIN_API_URL = "https://script.google.com/macros/s/AKfycbx70_vTaH6pTkzQ3_6yYD025eOHlcZzf_mvuN-D4BAK5w0elidFtFyKGG2nrwl2Tuhn/exec";
const GOOGLE_CLIENT_ID = "375980187783-29qa0gh7iiqe3fa9rtc8p4uuq86el8n1.apps.googleusercontent.com";

const MISS_NAILS_APP_URL = "https://gabriel-ceballos.github.io/MISS-NAILS/";

let idToken = null;
let identidad = null;

const $ = id => document.getElementById(id);


/* =========================================================
   API ADMIN
   ========================================================= */

async function api(accion, datos={}) {

  if (!ADMIN_API_URL || ADMIN_API_URL.includes("PEGAR_AQUI")) {
    throw new Error(
      "Falta configurar la URL del Apps Script ADMIN."
    );
  }

  const r = await fetch(
    ADMIN_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: new URLSearchParams({
        accion,
        datos: JSON.stringify({
          ...datos,
          idToken
        })
      })
    }
  );

  if (!r.ok) {
    throw new Error(
      "Error HTTP " + r.status
    );
  }

  const j = await r.json();

  if (!j.ok) {
    throw new Error(
      j.mensaje ||
      "Operación no autorizada."
    );
  }

  return j;
}


/* =========================================================
   VISTAS
   ========================================================= */

function mostrarPanel() {

  $("login").classList.add("hidden");
  $("panel").classList.remove("hidden");
  $("btnCerrar").classList.remove("hidden");

  $("identidad").textContent =
    identidad
      ? `${identidad.nombre || ""} · ${identidad.correo || ""}`
      : "";
}


function mostrarLogin() {

  $("panel").classList.add("hidden");
  $("login").classList.remove("hidden");
  $("btnCerrar").classList.add("hidden");
}


/* =========================================================
   VALIDAR ADMINISTRADOR
   ========================================================= */

async function validarAdmin() {

  $("loginMsg").textContent =
    "Verificando identidad administrativa...";

  try {

    const r =
      await api("identificarAdmin");

    identidad =
      r.datos;

    mostrarPanel();

    await cargarClientes();

  } catch (e) {

    idToken = null;

    $("loginMsg").textContent =
      e.message;

    mostrarLogin();
  }
}


/* =========================================================
   LISTAR CLIENTES
   ========================================================= */

async function cargarClientes() {

  $("msg").textContent =
    "Cargando clientes...";

  try {

    const r =
      await api("listarClientes");

    const lista =
      r.datos?.clientes || [];

    $("clientes").innerHTML =
      lista.length

        ? lista.map(c => `

      <tr>

        <td>
          ${esc(c.nombre)}
        </td>

        <td>
          ${esc(c.correo)}
        </td>

        <td>
          ${esc(c.rol)}
        </td>

        <td>
          ${esc(c.activo)}
        </td>

        <td>
          <strong>
            ${esc(c.estado)}
          </strong>
        </td>

        <td>

          <div class="actions">

            <button
              class="secondary"
              data-a="login"
              data-c="${esc(c.correo)}">

              Reset login

            </button>

            <button
              class="danger"
              data-a="cuenta"
              data-c="${esc(c.correo)}">

              Reset cuenta

            </button>

          </div>

        </td>

      </tr>

    `).join("")

        :

        '<tr><td colspan="6">No hay clientes para mostrar.</td></tr>';

    $("msg").textContent = "";

  } catch (e) {

    $("msg").textContent =
      e.message;
  }
}


/* =========================================================
   ACCIONES DE CLIENTES
   ========================================================= */

$("clientes").addEventListener(
  "click",
  async e => {

    const b =
      e.target.closest(
        "button[data-a]"
      );

    if (!b) {
      return;
    }

    const tipo =
      b.dataset.a;

    const correo =
      b.dataset.c;


    /* =====================================================
       RESET LOGIN

       SOLO elimina la sesión local de MISS NAILS.

       NO modifica CLIENTES.
       NO modifica PasswordHash.
       NO modifica Proveedor.
       NO modifica FederatedSubject.
       NO modifica Activo.

       Mantiene al administrador en la misma página.
       ===================================================== */

    if (tipo === "login") {

      const confirmar =
        confirm(
          correo +
          "\n\n" +
          "Se cerrará la sesión de MISS NAILS para " +
          "simular un nuevo inicio de sesión." +
          "\n\n" +
          "La cuenta y su activación no serán modificadas." +
          "\n\n" +
          "¿Continuar?"
        );

      if (!confirmar) {
        return;
      }

      try {

        localStorage.removeItem(
          "missNailsSesion"
        );

        localStorage.setItem(
          "missNailsResetLogin",
          "1"
        );

        sessionStorage.removeItem(
          "missNailsMicrosoftAuth"
        );

      } catch (e) {

        $("msg").textContent =
          "No fue posible restablecer el login: " + e.message;
      }

      return;
    }


    /* =====================================================
       RESET CUENTA

       RESET TOTAL DE LA CUENTA.

       1. El servidor elimina los datos de activación.
       2. Se cierra la sesión actual de MISS NAILS.
       3. Se mantiene ADMIN abierto.
       ===================================================== */

    if (tipo === "cuenta") {

      const pregunta =
        "La cuenta quedará en AUTORIZADO — NO ACTIVADO." +
        "\n\n" +
        "Se eliminarán los datos de activación." +
        "\n\n" +
        "También se cerrará la sesión actual de MISS NAILS." +
        "\n\n" +
        "¿Continuar?";

      if (
        !confirm(
          correo +
          "\n\n" +
          pregunta
        )
      ) {
        return;
      }

      $("msg").textContent =
        "Ejecutando...";

      try {

        await api(
          "resetCuenta",
          {
            correo
          }
        );


        /* =================================================
           CIERRE DE SESIÓN DEL CLIENTE

           EXACTAMENTE LA MISMA MECÁNICA DE RESET LOGIN.

           IMPORTANTE:
           Esto se ejecuta SOLO después de que el servidor
           confirmó correctamente el RESET CUENTA.
           ================================================= */

        localStorage.removeItem(
          "missNailsSesion"
        );

        localStorage.setItem(
          "missNailsResetLogin",
          "1"
        );

        sessionStorage.removeItem(
          "missNailsMicrosoftAuth"
        );


        $("msg").textContent =
          "Cuenta restablecida correctamente.";

        await cargarClientes();

      } catch (e) {

        $("msg").textContent =
          e.message;
      }

    }

  }
);


/* =========================================================
   RECARGAR
   ========================================================= */

$("recargar").onclick =
  cargarClientes;


/* =========================================================
   CERRAR SESIÓN ADMIN
   ========================================================= */

$("btnCerrar").onclick =
  () => {

    idToken = null;
    identidad = null;

    mostrarLogin();

    $("loginMsg").textContent =
      "Sesión administrativa cerrada.";
  };


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function esc(v) {

  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================================================
   GOOGLE ADMIN
   ========================================================= */

function cargarGoogle() {

  const s =
    document.createElement("script");

  s.src =
    "https://accounts.google.com/gsi/client";

  s.async = true;

  s.onload = () => {

    google.accounts.id.initialize({

      client_id:
        GOOGLE_CLIENT_ID,

      callback: r => {

        idToken =
          r.credential;

        validarAdmin();
      },

      auto_select: false,

      cancel_on_tap_outside: true
    });

    google.accounts.id.renderButton(
      $("googleButton"),
      {
        theme: "outline",
        size: "large",
        text: "continue_with",
        width: 320
      }
    );
  };

  s.onerror = () => {

    $("loginMsg").textContent =
      "No fue posible cargar Google.";
  };

  document.head.appendChild(s);
}


cargarGoogle();

})();