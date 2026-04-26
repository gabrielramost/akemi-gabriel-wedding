// -----------------------------
// DATA INVITADOS (EDITA ESTO)
// -----------------------------
const invitados = [
  { nombre: "Gabriel Ramos", cupos: 2, acompaña: "Akemi" },
  { nombre: "Juan Perez", cupos: 1 },
  { nombre: "Maria Lopez", cupos: 2, acompaña: "Carlos" }
];

let invitadoSeleccionado = null;


// -----------------------------
// INIT
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {

  // TIMELINE ANIMATION
  const items = document.querySelectorAll(".timeline-item");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));

  // BUSCADOR RSVP
  const input = document.getElementById("nombre");

  if(input){
    input.addEventListener("input", buscarInvitado);
  }

});


// -----------------------------
// BUSCAR INVITADO
// -----------------------------
function buscarInvitado(e){

  const valor = e.target.value.toLowerCase();
  const resultado = document.getElementById("resultado");

  resultado.innerHTML = "";
  invitadoSeleccionado = null;

  if(valor.length < 2) return;

  const match = invitados.find(inv =>
    inv.nombre.toLowerCase().includes(valor)
  );

  if(match){

    invitadoSeleccionado = match;

    resultado.innerHTML = `
      <div class="rsvp-result">
        <p><strong>${match.nombre}</strong></p>
        <p>Tienes <strong>${match.cupos}</strong asiento(s)</p>
        ${
          match.acompaña
          ? `<p>Acompañante: ${match.acompaña}</p>`
          : ""
        }
      </div>
    `;

  } else {

    resultado.innerHTML = `
      <p class="error-msg">No encontramos tu nombre</p>
    `;
  }
}


// -----------------------------
// ENVIAR WHATSAPP (MEJORADO)
// -----------------------------
function enviarWhatsApp(destino){

  if(!invitadoSeleccionado){
    mostrarError("Primero busca y selecciona tu nombre");
    return;
  }

  let numero = destino === "novia"
    ? "51945113430"
    : "51983545543";

  const mensaje = `Hola! Soy ${invitadoSeleccionado.nombre}.
Confirmo mi asistencia a la boda.

Asistiremos: ${invitadoSeleccionado.cupos} persona(s).
${
  invitadoSeleccionado.acompaña
  ? `Acompañante: ${invitadoSeleccionado.acompaña}`
  : ""
}`;

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}


// -----------------------------
// MENSAJE ERROR (CORREGIDO)
// -----------------------------
function mostrarError(texto){

  let error = document.querySelector(".error-msg");

  if(!error){
    error = document.createElement("div");
    error.className = "error-msg";
    document.querySelector(".rsvp-right").prepend(error);
  }

  error.textContent = texto;

  setTimeout(()=>{
    error.textContent = "";
  }, 3000);
}


// -----------------------------
// MOSTRAR CUENTA
// -----------------------------
function mostrarCuenta(){

  const cuenta = document.getElementById("cuenta");

  cuenta.classList.toggle("visible");
}
