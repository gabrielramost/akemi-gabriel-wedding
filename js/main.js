const items = document.querySelectorAll(".timeline-item");

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
},{ threshold:0.2 });

items.forEach(item=>{
  observer.observe(item);
});

function enviarWhatsApp(destino){

  const nombre = document.getElementById("nombre").value;
  const asistencia = document.getElementById("asistencia").value;
  const personas = document.getElementById("personas").value;

  if(!nombre || !asistencia){
    alert("Por favor completa tu nombre y asistencia");
    return;
  }

  let numero = "";

  if(destino === "novia"){
    numero = "51945113430";
  } else {
    numero = "51983545543";
  }

  const mensaje = `Hola! Soy ${nombre}. 
Confirmo que: ${asistencia}. 
Asistiremos: ${personas} persona(s).`;

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}
