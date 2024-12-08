const divModificar = document.getElementById('ms_imp_list');
const apagarDupesBtn = document.getElementById('apagarDupesBtn');
function getSession(key) {
  const value = sessionStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}
let duplicatePics = getSession('duplicatePics') || []; 

function showDuplicatedPictures() {
    let HTML = "";
    duplicatePics.forEach(pic => {
        HTML += `
            <li id="${pic.ID}" role="option" aria-selected="false">
                <span class="checkmark" aria-hidden="true"></span>
                <img alt="picture" src="imagens/${pic.URL}">
            </li>
        `;
    });
    divModificar.innerHTML = HTML;
}
showDuplicatedPictures();

function deleteDupes() {
    let deletedDupes = getSession('deletedDupes') || [];
    const listItems = document.querySelectorAll('#ms_imp_list li');
    listItems.forEach(item => {
        deletedDupes.push(item.id);
        item.remove();
    });
    saveSession('deletedDupes', deletedDupes);
}

function deleteAlert() {
    Swal.fire({
    title: "Eliminar as fotos duplicadas?",
    text: "Não poderá voltar atrás!",
    icon: "warning",
    confirmButtonText: "Sim",
    showCancelButton: true,
      cancelButtonText: "Não",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim",
      focusCancel: true,
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1',
        confirmButton: 'order-2',
    }}).then((result) => {
    if (result.isConfirmed) {
        Swal.fire({
        title: "Sucesso",
        text: "As fotos duplicadas foram eliminadas.",
        icon: "success"
        });
        deleteDupes();
    }
    });
}
apagarDupesBtn.onclick = deleteAlert;

function saveStateDupes() {
        window.onload = function() {
            let deletedDupes = JSON.parse(sessionStorage.getItem('deletedDupes')) || [];
            const listItems = document.querySelectorAll('#ms_imp_list li');
            listItems.forEach(item => {
                if (deletedDupes.includes(item.id)) {
                    item.remove();
                }
            });
        };
}
saveStateDupes();
