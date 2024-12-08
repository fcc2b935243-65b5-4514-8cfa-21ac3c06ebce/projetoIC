const whatsAppBtn = document.getElementById('whatsAppBtn');
const facebookBtn = document.getElementById('facebookBtn');
const instaBtn = document.getElementById('instaBtn');
const etcBtn = document.getElementById('etcBtn');

function indisponivel() {
  Swal.fire("Funcionalidade indisponível :(");
}

whatsAppBtn.onclick = indisponivel;
facebookBtn.onclick = indisponivel;
instaBtn.onclick = indisponivel;
etcBtn.onclick = indisponivel;