// -----------------------------
// ESTADO GLOBAL
// -----------------------------
let invitadoSeleccionado = null;


const invitadosBusqueda = [];

invitados.forEach(inv => {

  // titular
  invitadosBusqueda.push({
    nombre: inv.nombre,
    principal: inv.nombre,
    pases: inv.pases,
    acompanantes: inv.acompanantes
  });

  // acompañantes
  inv.acompanantes.forEach(a => {
    invitadosBusqueda.push({
      nombre: a,
      principal: inv.nombre,
      pases: inv.pases,
      acompanantes: inv.acompanantes
    });
  });

});
// -----------------------------
// INIT CUANDO DOM ESTÁ LISTO
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {

  // -----------------------------
  // TIMELINE ANIMATION
  // -----------------------------
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


  // -----------------------------
  // RSVP BUSCADOR
  // -----------------------------
  const input = document.querySelector(".rsvp-right input");
  const resultado = document.getElementById("resultado");

 input.addEventListener("input", () => {

  const valor = input.value.toLowerCase();

  if (valor.length < 2) {
    resultado.innerHTML = "";
    help.textContent = "Escribe tu nombre o el de tu familia";
    return;
  }

  const coincidencias = invitadosBusqueda.filter(i =>
    i.nombre.toLowerCase().includes(valor)
  );

  if (coincidencias.length === 0) {
    resultado.innerHTML = "";
    help.textContent = "No encontramos tu nombre";
    return;
  }

  help.textContent = "Selecciona tu nombre de la lista"; // 🔥 CLAVE

  resultado.innerHTML = coincidencias.map(i => `
    <div class="opcion" onclick='seleccionarInvitado(${JSON.stringify(i.nombre)})'>
      ${i.nombre}
    </div>
  `).join("");

});

// -----------------------------
// RENDER INVITADO
// -----------------------------


function renderInvitado(invitado){

  // actualizar cupos
  document.getElementById("cupos").textContent =
    invitado.pases + " asiento(s)";

  let html = `
  <small>Invitación de ${invitado.nombre}</small>
  <h3>${invitado.nombre}</h3>
  <p>Tienes ${invitado.pases} pase(s)</p>
  <div class="asistentes">
`;

  // titular (YA NO forzado)
  html += `
    <label>
      <input type="checkbox" class="asistente" />
      ${invitado.nombre}
    </label>
  `;

  // acompañantes reales
  invitado.acompanantes.forEach(a => {
    html += `
      <label>
        <input type="checkbox" class="asistente" />
        ${a}
      </label>
    `;
  });

  // espacios adicionales
  const faltantes = invitado.pases - (1 + invitado.acompanantes.length);

  for (let i = 0; i < faltantes; i++) {
    html += `
      <label>
        <input type="checkbox" class="asistente" />
        Invitado adicional
      </label>
    `;
  }

  html += `</div>`;

  resultado.innerHTML = html;
}


// -----------------------------
// SELECCIONAR INVITADO
// -----------------------------
function seleccionarInvitado(nombre){

  const data = invitadosBusqueda.find(i => i.nombre === nombre);

  if (!data) return;

  const invitado = invitados.find(i => i.nombre === data.principal);

  invitadoSeleccionado = invitado;

  // 🔥 AGREGA ESTO AQUÍ
  document.getElementById("rsvp-help").textContent =
    "Marca quiénes asistirán y confirma";

  renderInvitado(invitado);

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

  const checks = document.querySelectorAll(".asistentes input:checked");

  const total = checks.length;

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
    document.querySelector(".rsvp-right").prepend(error);
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
