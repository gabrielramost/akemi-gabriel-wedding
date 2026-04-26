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


// -----------------------------
// RSVP WHATSAPP
// -----------------------------
function enviarWhatsApp(destino){

  const nombre = document.getElementById("nombre").value.trim();
  const asistencia = document.getElementById("asistencia").value;
  const personas = document.getElementById("personas").value;

  if(nombre === "" || asistencia === ""){
    mostrarError("Por favor completa tu nombre y asistencia");
    return;
  }

  let numero = destino === "novia"
    ? "51945113430"
    : "51983545543";

  const mensaje = `Hola! Soy ${nombre}.
Confirmo que: ${asistencia}.
Asistiremos: ${personas} persona(s).`;

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
