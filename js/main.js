// -----------------------------
// INIT CUANDO DOM ESTÁ LISTO
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {

  // TIMELINE ANIMATION
  const items = document.querySelectorAll(".timeline-item");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        obs.unobserve(entry.target); // solo una vez (más pro)
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));

});

let invitadoSeleccionado = null;

function buscarInvitado(){

  const input = document.getElementById("busqueda").value.toLowerCase();
  const resultado = document.getElementById("resultado");

  if(input.length < 2){
    resultado.innerHTML = "";
    return;
  }

  const match = invitados.find(inv =>
    inv.nombre.toLowerCase().includes(input)
  );

  if(match){

    invitadoSeleccionado = match;

    document.getElementById("cupos").innerText = match.invitados + " asiento(s)";

    resultado.innerHTML = `
      <h3>${match.nombre}</h3>
      <p>Tienes ${match.invitados} pase(s)</p>
      ${match.acompanante ? `<p>Acompañante: ${match.acompanante}</p>` : ""}
    `;

  } else {
    resultado.innerHTML = `<p>No encontramos tu nombre</p>`;
  }
} 
// -----------------------------
// RSVP WHATSAPP
// -----------------------------
function confirmar(destino){

  if(!invitadoSeleccionado){
    alert("Busca tu nombre primero");
    return;
  }

  const numero = destino === "novia"
    ? "51945113430"
    : "51983545543";

  const mensaje = `Hola! Soy ${invitadoSeleccionado.nombre}.
Confirmo mi asistencia.
Somos ${invitadoSeleccionado.invitados} persona(s).`;

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}

// -----------------------------
// MENSAJE DE ERROR (UX PRO)
// -----------------------------
function mostrarError(texto){

  let error = document.querySelector(".error-msg");

  if(!error){
    error = document.createElement("div");
    error.className = "error-msg";
    document.querySelector(".rsvp-form").prepend(error);
  }

  error.textContent = texto;

  setTimeout(()=>{
    error.textContent = "";
  }, 3000);
}

// -----------------------------
// MOSTRAR CUENTA (ANIMADO)
// -----------------------------
function mostrarCuenta(){

  const cuenta = document.getElementById("cuenta");

  if(!cuenta.classList.contains("visible")){
    cuenta.classList.add("visible");
  } else {
    cuenta.classList.remove("visible");
  }
}
