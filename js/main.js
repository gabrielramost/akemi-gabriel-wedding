// -----------------------------
// ESTADO GLOBAL
// -----------------------------
let invitadoSeleccionado = null;
let nombreBuscado = null;

// -----------------------------
// GENERAR LISTA DE BÚSQUEDA
// -----------------------------
const invitadosBusqueda = [];

if (typeof invitados !== "undefined") {

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

}

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
  const help = document.getElementById("rsvp-help");

  if (input && resultado) {

    input.addEventListener("input", () => {

      const valor = input.value.toLowerCase();

      if (valor.length < 2) {
        resultado.innerHTML = "";
        if (help) help.textContent = "Escribe tu nombre y apellido";
        return;
      }

      // eliminar duplicados
      const coincidencias = [...new Map(
        invitadosBusqueda.map(i => [i.nombre, i])
      ).values()].filter(i =>
        i.nombre.toLowerCase().includes(valor)
      );

      if (coincidencias.length === 0) {
        resultado.innerHTML = "";
        if (help) help.textContent = "No encontramos tu nombre";
        return;
      }

      if (help) help.textContent = "Selecciona tu nombre de la lista";

      resultado.innerHTML = coincidencias.map(i => `
        <div class="opcion" onclick='seleccionarInvitado(${JSON.stringify(i.nombre)})'>
          ${i.nombre}
        </div>
      `).join("");

    });

  }

});

// -----------------------------
// RENDER INVITADO
// -----------------------------
function renderInvitado(invitado){

  const resultado = document.getElementById("resultado");

  if (!resultado) return;

  // actualizar cupos
  const cupos = document.getElementById("cupos");
  if (cupos) {
    cupos.textContent = invitado.pases + " asiento(s)";
  }

  let html = `
  <h3>${nombreBuscado}</h3>
  <small>Invitación de ${invitado.nombre}</small>
  <p>Tienes ${invitado.pases} pase(s)</p>
  <div class="asistentes">
  `;

  // titular
  html += `
    <label>
      <input type="checkbox" class="asistente" />
      ${invitado.nombre}
    </label>
  `;

  // acompañantes
  invitado.acompanantes.forEach(a => {
    html += `
      <label>
        <input type="checkbox" class="asistente" />
        ${a}
      </label>
    `;
  });

  // extras
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

  nombreBuscado = nombre; // 👈 NUEVO
  
  const data = invitadosBusqueda.find(i => i.nombre === nombre);
  if (!data) return;

  const invitado = invitados.find(i => i.nombre === data.principal);
  if (!invitado) return;

  invitadoSeleccionado = invitado;

  const resultado = document.getElementById("resultado");
  if (resultado) resultado.innerHTML = "";

  const help = document.getElementById("rsvp-help");
  if (help) {
    help.textContent = "Marca quiénes asistirán y confirma";
  }

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
// MOSTRAR CUENTA
// -----------------------------
function toggleCuenta(){

  const box = document.getElementById("bankBox");
  const btn = document.getElementById("btnCuenta");

  if(!box) return;

  box.classList.toggle("show");

  if(box.classList.contains("show")){
    btn.textContent = "Ocultar datos bancarios";
  } else {
    btn.textContent = "Ver datos bancarios";
  }

}
