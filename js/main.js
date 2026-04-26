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

  const coincidencias = invitados.filter(i =>
    i.nombre.toLowerCase().includes(valor)
  );

  if (coincidencias.length === 0) {
    resultado.innerHTML = "";
    return;
  }

  // lista de opciones (para evitar nombres duplicados)
  resultado.innerHTML = coincidencias.map(i => `
    <div class="opcion" onclick="seleccionarInvitado('${i.nombre}')">
      ${i.nombre}
    </div>
  `).join("");

});

function renderInvitado(invitado){

  // 🔥 AQUÍ SE ARREGLA EL BUG DE CUPOS
  document.getElementById("cupos").textContent =
    invitado.pases + " asiento(s)";

  let html = `
    <h3>${invitado.nombre}</h3>
    <p>Tienes ${invitado.pases} pase(s)</p>
    <div class="asistentes">
  `;

  // ❗ TITULAR YA NO ESTÁ FORZADO
  html += `
    <label>
      <input type="checkbox" class="acompanante" />
      ${invitado.nombre}
    </label>
  `;

  // acompañantes
  invitado.acompanantes.forEach(a => {
    html += `
      <label>
        <input type="checkbox" class="acompanante" />
        ${a}
      </label>
    `;
  });

  // extras
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
}

function seleccionarInvitado(nombre){

  const invitado = invitados.find(i => i.nombre === nombre);

  invitadoSeleccionado = invitado;

  renderInvitado(invitado);

}

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

  // contar checkboxes seleccionados
  const checks = document.querySelectorAll(".asistentes input:checked");

  const total = checks.length;

  // nombres seleccionados
  const nombres = Array.from(checks).map(c =>
    c.parentElement.textContent.trim()
  );

  const mensaje = `Hola! Soy ${invitadoSeleccionado.nombre}.
Confirmo mi asistencia.

Asistiremos ${total} persona(s):
- ${nombres.join("\n- ")}`;

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
