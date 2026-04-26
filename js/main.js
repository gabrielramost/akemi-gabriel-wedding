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

const input = document.querySelector(".rsvp-right input");
const resultado = document.getElementById("resultado");

input.addEventListener("input", () => {
  const valor = input.value.toLowerCase();

  const invitado = invitados.find(i =>
    i.nombre.toLowerCase().includes(valor)
  );

  if (!invitado) {
    resultado.innerHTML = "";
    return;
  }

  // generar lista de asistentes
  let html = `
    <h3>${invitado.nombre}</h3>
    <p>Tienes ${invitado.pases} pase(s)</p>
    <div class="asistentes">
  `;

  // titular (siempre incluido)
  html += `
    <label>
      <input type="checkbox" checked disabled />
      ${invitado.nombre}
    </label>
  `;

  // acompañantes reales
  invitado.acompanantes.forEach(a => {
    html += `
      <label>
        <input type="checkbox" class="acompanante" checked />
        ${a}
      </label>
    `;
  });

  // espacios libres
  const faltantes = invitado.pases - (1 + invitado.acompanantes.length);

  for (let i = 0; i < faltantes; i++) {
    html += `
      <label>
        <input type="checkbox" class="extra" />
        Invitado adicional
      </label>
    `;
  }

  html += `</div>`;

  resultado.innerHTML = html;
});


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
