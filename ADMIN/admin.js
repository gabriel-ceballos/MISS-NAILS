(() => {
"use strict";

/* Se coloca después de publicar el Apps Script ADMIN. */
const ADMIN_API_URL = "https://script.google.com/macros/s/AKfycbx70_vTaH6pTkzQ3_6yYD025eOHlcZzf_mvuN-D4BAK5w0elidFtFyKGG2nrwl2Tuhn/exec";
const GOOGLE_CLIENT_ID = "375980187783-29qa0gh7iiqe3fa9rtc8p4uuq86el8n1.apps.googleusercontent.com";

let idToken = null;
let identidad = null;
const $ = id => document.getElementById(id);

async function api(accion, datos={}) {
  if (!ADMIN_API_URL || ADMIN_API_URL.includes("PEGAR_AQUI"))
    throw new Error("Falta configurar la URL del Apps Script ADMIN.");

  const r = await fetch(ADMIN_API_URL,{
    method:"POST",
    headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
    body:new URLSearchParams({accion,datos:JSON.stringify({...datos,idToken})})
  });
  if(!r.ok) throw new Error("Error HTTP "+r.status);
  const j=await r.json();
  if(!j.ok) throw new Error(j.mensaje||"Operación no autorizada.");
  return j;
}

function mostrarPanel(){
  $("login").classList.add("hidden");
  $("panel").classList.remove("hidden");
  $("btnCerrar").classList.remove("hidden");
  $("identidad").textContent=identidad ? `${identidad.nombre||""} · ${identidad.correo||""}` : "";
}
function mostrarLogin(){
  $("panel").classList.add("hidden");
  $("login").classList.remove("hidden");
  $("btnCerrar").classList.add("hidden");
}

async function validarAdmin(){
  $("loginMsg").textContent="Verificando identidad administrativa...";
  try{
    const r=await api("identificarAdmin");
    identidad=r.datos;
    mostrarPanel();
    await cargarClientes();
  }catch(e){
    idToken=null;
    $("loginMsg").textContent=e.message;
    mostrarLogin();
  }
}

async function cargarClientes(){
  $("msg").textContent="Cargando clientes...";
  try{
    const r=await api("listarClientes");
    const lista=r.datos?.clientes||[];
    $("clientes").innerHTML=lista.length ? lista.map(c=>`
      <tr>
        <td>${esc(c.nombre)}</td><td>${esc(c.correo)}</td><td>${esc(c.rol)}</td>
        <td>${esc(c.activo)}</td><td><strong>${esc(c.estado)}</strong></td>
        <td><div class="actions">
          <button class="secondary" data-a="federado" data-c="${esc(c.correo)}">Reset federado</button>
          <button class="danger" data-a="cuenta" data-c="${esc(c.correo)}">Reset cuenta</button>
        </div></td>
      </tr>`).join("") :
      '<tr><td colspan="6">No hay clientes para mostrar.</td></tr>';
    $("msg").textContent="";
  }catch(e){$("msg").textContent=e.message;}
}

$("clientes").addEventListener("click",async e=>{
  const b=e.target.closest("button[data-a]"); if(!b)return;
  const tipo=b.dataset.a, correo=b.dataset.c;
  const pregunta=tipo==="cuenta"
    ?"La cuenta quedará en AUTORIZADO — NO ACTIVADO. ¿Continuar?"
    :"Se eliminará la identidad federada vinculada. ¿Continuar?";
  if(!confirm(correo+"\n\n"+pregunta))return;
  $("msg").textContent="Ejecutando...";
  try{
    await api(tipo==="cuenta"?"resetCuenta":"resetFederado",{correo});
    $("msg").textContent="Operación realizada correctamente.";
    await cargarClientes();
  }catch(e){$("msg").textContent=e.message;}
});

$("recargar").onclick=cargarClientes;
$("btnCerrar").onclick=()=>{idToken=null;identidad=null;mostrarLogin();$("loginMsg").textContent="Sesión administrativa cerrada.";};

function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}

function cargarGoogle(){
  const s=document.createElement("script");
  s.src="https://accounts.google.com/gsi/client"; s.async=true;
  s.onload=()=>{
    google.accounts.id.initialize({
      client_id:GOOGLE_CLIENT_ID,
      callback:r=>{idToken=r.credential;validarAdmin();},
      auto_select:false,cancel_on_tap_outside:true
    });
    google.accounts.id.renderButton($("googleButton"),{theme:"outline",size:"large",text:"continue_with",width:320});
  };
  s.onerror=()=>{$("loginMsg").textContent="No fue posible cargar Google.";};
  document.head.appendChild(s);
}
cargarGoogle();
})();