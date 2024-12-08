const replaceOne = document.getElementById('replaceOne');
const replaceTwo = document.getElementById('replaceTwo');
const replaceThree = document.getElementById('replaceThree');
let albumImages = getSession('albumPics');

function insertPic (divID, albumPicArrayNum) {
    const divElement = document.getElementById(divID);
    let HTML = '';
    albumPicArrayNum.forEach(importedPicture => {
        HTML +=`<img alt="picture" class="${importedPicture.ID}" id="${importedPicture.ID}" src="imagens/${importedPicture.URL}">`;
    });
    divElement.innerHTML = HTML;    
}

insertPic('replaceOne', albumImages);

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