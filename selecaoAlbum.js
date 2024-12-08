const replaceOne = document.getElementById('replaceOne');
const replaceTwo = document.getElementById('replaceTwo');
const replaceThree = document.getElementById('replaceThree');
const finalizarBtn = document.getElementById('finalizarBtn');
let albumPics = getSession('albumPics') || []; //fotos deste albúm em particular (quando redirected)
let allAlbumPics = getSession('allAlbumPics') || [];
let todasFotos = getSession('todasFotos') || [];  //para a página todas as fotos
let allValuesSelected = getSession('allValuesSelected') || [];
let selectedImgs = getSession('selectedImgs') || []; //seleção manual
let duplicatePics = getSession('duplicatePics') || []; 
let imagesSelected = filterPics(ALLPICSARRAY, allValuesSelected);

/*filtrar as fotos do array de acordo opcoes*/
function filterPics(picCollection, filterValues) {
    return picCollection.filter(picture => {
        return Object.values(picture).some(value => {
            if (Array.isArray(value)) {
                return value.some(item => filterValues.includes(item));
            }
            return filterValues.includes(value);
        });
    });
}

/*Criar foto + botão apagar, lidar com duplicados*/
function createElement(divID, importedPicArray) {
    const divElement = document.getElementById(divID);
    let HTML = '';
    allAlbumPics = [];
    importedPicArray.forEach(importedPicture => {
      const isDuplicate = todasFotos.some(picture => picture.ID === importedPicture.ID); 
      if (isDuplicate) { //avisar user para não achar estranho fotos desaparecerem
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        showCloseButton: true,
      });
      Toast.fire({
        icon: "warning",
        title: "Tem fotos na pasta de duplicados.",
        html: `Guarde o seu trabalho antes de sair.`,
      });}
      if (!isDuplicate) {
        albumPics.push(importedPicture); //fotos deste albúm em particular (quando redirected)
        todasFotos.push(importedPicture); //para a página todas as fotos
          HTML +=`<div class="albumPicsTheContainer"><span class="material-symbols-outlined trashIcon ${importedPicture.ID}">delete</span>
            <img alt="picture" class="${importedPicture.ID}" id="${importedPicture.ID}" src="imagens/${importedPicture.URL}"></div>`;
      } else {
          duplicatePics.push(importedPicture);
      }
    });
    if (duplicatePics.length > 0) {
      saveSession('duplicatePics', duplicatePics); //para página duplicados
      let allDupes = importedPicArray.every(importedPicture => todasFotos.every(picture => picture.ID === importedPicture.ID));
      if (allDupes) { //se todas as fotos importadas forem duplicados
        console.log("all dupes");
      }
    }
    divElement.innerHTML = HTML; 
    allAlbumPics.push(...albumPics); //para não ser um array dum array
}

/*certificar-se de que as fotos aparecem*/
function replaceArrays() {
  albumPics = [] //reset
  if (allValuesSelected?.length) {
    createElement('replaceOne', imagesSelected);
  } else if (selectedImgs.length > 0) {  
    createElement('replaceOne', selectedImgs);
  } else { /*default pictures*/
    let btnChosen = getSession('btnChosen') || "";
    if (btnChosen === "pcBtn") {
    createElement('replaceOne', PCPICSCOLLECTION);}
    if (btnChosen === "gglBtn") {
    createElement('replaceOne', GGLPICSCOLLECTION);}
  };
}
replaceArrays();

function disallowCreation() {
  getSession('albumPics');
  if (albumPics.length === 0) {
    finalizarBtn.classList.add('disabled');
    const titulo = document.getElementById('titulo');
    titulo.innerHTML = "";
    Swal.fire({
      icon: "error",
      title: "Todas as fotos são duplicadas.",
      html: `Selecione as fotos que pretende manter na <a href="duplicados.html">pasta de duplicados</a>.`,
      showCancelButton: true,
      showDenyButton: true,
      cancelButtonText: "Voltar",
      confirmButtonText: "Ir",
      denyButtonText: "Fechar",
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-2',
        confirmButton: 'order-1',
        denyButton: 'order-3',
      },      
      });
      const swal2CancelBtn = document.getElementsByClassName('swal2-cancel');
      swal2CancelBtn[0].onclick = function() {window.location.href = "importar.html";};
      const swal2ConfirmBtn = document.getElementsByClassName('swal2-confirm');
      swal2ConfirmBtn[0].onclick = function() {window.location.href = "duplicados.html";};
  }
}
disallowCreation()

/*Apagar foto ao clicar no respetivo botão, 
guardar no sessionstorage, 
e a foto é substituida por um placeholder*/
document.addEventListener("DOMContentLoaded", function() {
  const parentElement = document.getElementById('albums');
  const deletedPictures = getSession('deletedPictures') || [];
  deletedPictures.forEach(pictureID => {
    replacePic(pictureID);
    hideTrashIcon(pictureID);
  });
  parentElement.addEventListener("click", function(event) {
    if (event.target.classList.contains("trashIcon")) {
      const pictureID = event.target.classList[2];
      Swal.fire({
      title: "Eliminar esta foto?",
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
          text: "A foto foi eliminada.",
          icon: "success"
          });
        deletePic(pictureID);
      }
      });
  }
},)});

function deletePic(pictureID) {
  const pictureToReplace = document.querySelector(`img.${pictureID}`); 
  if (pictureToReplace) {
    replacePic(pictureID);
  }
  albumPics = albumPics.filter(picture => picture.ID !== pictureID);
  let deletedPictures = getSession('deletedPictures') || [];
  deletedPictures.push(pictureID);
  saveSession('deletedPictures', deletedPictures);
  hideTrashIcon(pictureID);
}

function hideTrashIcon(pictureID) {
  const trashIcon = document.querySelector(`.trashIcon.${pictureID}`);
  if (trashIcon) {
    trashIcon.remove();
  }
}

function replacePic(pictureID) {
  const pictureToReplace = document.querySelector(`img.${pictureID}`);
  if (pictureToReplace) {
    pictureToReplace.src = 'imagens/placeholder.png'; 
  }
}

/*Criar álbum*/ 
function finalizarAlbum() {
  let albumNumber = getSession('albumNumber') || [];
  let counter = albumNumber.length+1;
  const countNumber = `${counter}`; //usar como string
  albumNumber.push(countNumber);
  let deletedPictures = getSession('deletedPictures') || [];
  saveSession('deletedPictures', deletedPictures);
  saveSession('albumPics', albumPics);
  let todasFotos = getSession('todasFotos') || []; //preciso aqui ou não funciona bem
  const filteredAlbumPics = albumPics.filter(importedPicture => 
    !deletedPictures.some(deletedPicture => deletedPicture.ID === importedPicture.ID)
  );
  todasFotos = [...todasFotos, ...filteredAlbumPics];
  saveSession('todasFotos', todasFotos);
  saveSession('albumNumber', albumNumber);
  saveSession(`allAlbumPicsNum${countNumber}`, filteredAlbumPics);
  Swal.fire({
    title: "Sucesso",
    text: "O álbum foi criado.",
    icon: "success"
  });
  finalizarBtn.classList.add('disabled');
  setTimeout(redirect, 1300);    
}
finalizarBtn.onclick = finalizarAlbum;

function redirect() {
  window.location.href = "album.html";
};

/*TODO consertar: a info aparece mesmo que a foto tenha sido eliminada se clicar no sítio
(pq ela continua no DOM apenas foi substituida) */

/*info de cada foto*/
document.addEventListener('DOMContentLoaded', function() {
    function giveInfo(importedPicture) {
        Swal.fire({
            title: "Informação",
            html: `<div id="infoFotos">
            <b>Autor:</b>
            <br>
            <b>Câmera:</b>
            <br>
            <b>Data:</b>
            <br>
            <b>Emoções:</b>
            <br>
            <b>Entidades:</b>
            <br>
            <b>Local:</b>
            <br>
            <b>Ocasião:</b>
            <br>
            <b>Resolução:</b> 
            <br>
            <b>Tipo de foto:</b>
            </div>
            <div id="infoFoto">
            ${importedPicture.autor} <br>
            ${importedPicture.camera} <br>
            ${importedPicture.data} <br>
            ${importedPicture.emocoes} <br>
            ${importedPicture.entidades} <br>
            ${importedPicture.local} <br>
            ${importedPicture.ocasiao} <br>
            ${importedPicture.resolucao} <br>
            ${importedPicture.tipofoto}
            </div>`,
            imageUrl: `imagens/${importedPicture.URL}`,
            imageWidth: 300,
            imageHeight: 300,
            showCloseButton: true,
        });
    }
    ALLPICSARRAY.forEach(importedPicture => {
        let importedPictureElement = document.getElementById(importedPicture.ID);
        if (importedPictureElement) {
            importedPictureElement.onclick = function() {
                giveInfo(importedPicture);
            };
        }
    });
});