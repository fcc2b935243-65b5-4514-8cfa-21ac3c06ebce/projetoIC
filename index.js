/* 
TODO
colocar "selecionar tudo" em importar e mostrar funcionalidade nao implementada
adicionar opcao de apagar fotos DENTRO dos albuns, se dificil de implementar mostrar aviso
mudar ordem dos botoes na pasta de duplicados
*/

const picsContainer = document.getElementById('albums-pics-container');
let albumNumbers = getSession('albumNumber') || []; 
let allAlbumPicsNum = {};

albumNumbers.forEach(album => {
    allAlbumPicsNum[album] = getSession(`allAlbumPicsNum${album}`) || 0;
});

function importFunctionality() {
    let HTML = '';
    albumNumbers.forEach(album => {
        HTML += `<div class="albumPicsTheContainer"><span class="material-symbols-outlined trashIcon" data-id="${album}">delete</span>
        <img alt="picture" id="album${album}" class="click" src="imagens/albumPic.png"></div>`;
    });
    picsContainer.innerHTML = HTML;
}
importFunctionality();

function deleteAlbum(albumNumber) {
    /*mudar foto*/
    const pictureToReplace = document.querySelector(`img.album${albumNumber}`); 
    if (pictureToReplace) {
        replacePic(albumNumber);
    }
    /*retirar nr de album*/
    albumNumbers = albumNumbers.filter(album => album !== albumNumber);
    saveSession('albumNumber', albumNumbers);
    const picturesToRemove = allAlbumPicsNum[albumNumber];    
    /*apagar fotos do album*/
    let albumPics = getSession('albumPics') || [];    
    albumPics = albumPics.filter(picture => !picturesToRemove.some(pic => pic.ID === picture.ID));
    saveSession('albumPics', albumPics);
    let todasFotos = getSession('todasFotos') || [];
    todasFotos = todasFotos.filter(picture => !picturesToRemove.some(pic => pic.ID === picture.ID));
    saveSession('todasFotos', todasFotos);
    delete allAlbumPicsNum[albumNumber];
    saveSession(`allAlbumPicsNum${albumNumber}`, null); //TODO mudar isto?
    hideTrashIcon(albumNumber);
    let deletedAlbum = getSession('deletedAlbum') || [];
    deletedAlbum.push(albumNumber);
    saveSession('deletedAlbum', deletedAlbum);
}

function hideTrashIcon(albumNumber) {
    const trashIcon = document.querySelector(`.trashIcon[data-id="${albumNumber}"]`);
    if (trashIcon) {
        trashIcon.remove();
    }
}

function replacePic(albumNumber) {
    const pictureToReplace = document.querySelector(`img.album${albumNumber}`);
    if (pictureToReplace) {
        pictureToReplace.src = 'imagens/150x150transparente.png'; //TODO verificar
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const parentElement = document.getElementById('albums');
    const deletedAlbum = getSession('deletedAlbum') || [];
    deletedAlbum.forEach(deletedAlbumNumber => {
        replacePic(deletedAlbumNumber);
        hideTrashIcon(deletedAlbumNumber);
    });
    
    parentElement.addEventListener("click", function(event) {
        if (event.target.classList.contains("trashIcon")) {
            const albumNumber = event.target.getAttribute('data-id');
            Swal.fire({
                title: "Eliminar este álbum?",
                text: "Não poderá voltar atrás!",
                icon: "warning",
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
                },      
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Sucesso",
                        text: "O álbum foi eliminado.",
                        icon: "success"
                    });
                    deleteAlbum(albumNumber); 
                }
            });
        }
    });
});

const album1 = document.getElementById('album1');
const album2 = document.getElementById('album2');
const album3 = document.getElementById('album3');
const album4 = document.getElementById('album4');
const album5 = document.getElementById('album5');
const album6 = document.getElementById('album6');
function redirect(num) {
  window.location.href = `albumnumber${num}.html`;
}
album1.onclick = function() {redirect(1);};
album2.onclick = function() {redirect(2);};
album3.onclick = function() {redirect(3);};
album4.onclick = function() {redirect(4);};
album5.onclick = function() {redirect(5);};
album6.onclick = function() {redirect(6);};