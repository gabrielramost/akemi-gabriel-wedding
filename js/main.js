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

      const valor = input.value.toLowerCase().trim();

      // FIX: resetear estado al borrar el campo
      if (valor.length < 2) {
        resultado.innerHTML = "";
        invitadoSeleccionado = null;
        nombreBuscado = null;
        if (help) help.textContent = "Escribe tu nombre y apellido";
        return;
      }

      // FIX: el filtro de duplicados ahora va DESPUÉS del .filter(),
      // no antes. Así no perdemos acompañantes que comparten nombre
      // con un titular de otra familia.
      const vistos = new Set();
      const coincidencias = invitadosBusqueda
        .filter(i => i.nombre.toLowerCase().includes(valor))
        .filter(i => {
          if (vistos.has(i.nombre)) return false;
          vistos.add(i.nombre);
          return true;
        });

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
function renderInvitado(invitado) {

  const resultado = document.getElementById("resultado");
  if (!resultado) return;

  const cupos = document.getElementById("cupos");
  if (cupos) {
    cupos.textContent = invitado.pases;
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

  // pases extras sin nombre asignado
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
function seleccionarInvitado(nombre) {

  nombreBuscado = nombre;

  const data = invitadosBusqueda.find(i => i.nombre === nombre);
  if (!data) return;

  const invitado = invitados.find(i => i.nombre === data.principal);
  if (!invitado) return;

  invitadoSeleccionado = invitado;

  // FIX: limpiar el input para que quede en estado neutro
  // y el usuario sepa que su selección fue registrada
  const input = document.querySelector(".rsvp-right input");
  if (input) input.value = nombre;

  const resultado = document.getElementById("resultado");
  if (resultado) resultado.innerHTML = "";

  const help = document.getElementById("rsvp-help");
  if (help) help.textContent = "Marca quiénes asistirán y confirma";

  renderInvitado(invitado);
}

// -----------------------------
// RSVP WHATSAPP
// -----------------------------
function confirmar(destino) {

  if (!invitadoSeleccionado) {
    alert("Busca tu nombre primero");
    return;
  }

  const numero = destino === "novia"
    ? "51945113430"
    : "51983545543";

  const checks = document.querySelectorAll(".asistentes input:checked");
  const total = checks.length;

  if (total === 0) {
    alert("Selecciona al menos un asistente");
    return;
  }

  const nombres = Array.from(checks).map(c =>
    c.parentElement.textContent.trim()
  );

  const mensaje =
    `Hola! Soy ${invitadoSeleccionado.nombre}.\n` +
    `Confirmo mi asistencia.\n\n` +
    `Asistiremos ${total} persona(s):\n` +
    `- ${nombres.join("\n- ")}`;

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

// -----------------------------
// MOSTRAR CUENTA BANCARIA
// -----------------------------
function toggleCuenta() {

  const box = document.getElementById("bankBox");
  const btn = document.getElementById("btnCuenta");

  if (!box) return;

  box.classList.toggle("show");

  btn.textContent = box.classList.contains("show")
    ? "Ocultar datos bancarios"
    : "Ver datos bancarios";
}

// -----------------------------
// COPIAR TEXTO (versión unificada)
// FIX: había dos declaraciones de copiarTexto con firmas distintas.
// Esta versión única acepta el elemento clickeado (el botón .copy-btn)
// y busca el .cuenta hermano para copiar su texto.
// En el HTML debe llamarse: onclick="copiarTexto(this)"
// -----------------------------
function copiarTexto(elemento) {

  // Soporta dos casos:
  // 1. Se pasa el botón .copy-btn → busca .cuenta en el mismo .cuenta-row
  // 2. Se pasa directamente el elemento con el texto (legacy)
  const fila = elemento.closest(".cuenta-row");
  const texto = fila
    ? fila.querySelector(".cuenta")?.textContent.trim()
    : elemento.textContent.trim();

  if (!texto) return;

  navigator.clipboard.writeText(texto)
    .then(() => {

      // Feedback visual en el botón, no en el texto de la cuenta
      const btn = fila ? fila.querySelector(".copy-btn") : elemento;
      const original = btn.textContent;

      btn.textContent = "Copiado ✔";
      btn.style.color = "#86895D";

      setTimeout(() => {
        btn.textContent = original;
        btn.style.color = "";
      }, 1500);

    })
    .catch(() => {
      alert("No se pudo copiar. Cópialo manualmente.");
    });
}
