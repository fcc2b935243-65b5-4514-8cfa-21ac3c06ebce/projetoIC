const pcBtn = document.getElementById('pcBtn');
const importText = document.getElementById('importText');
const opcoesImportPC = document.getElementById('opcoesImportPC');
const opcoesImportGgl = document.getElementById('opcoesImportGgl');
const selecaoAlbumBtn = document.getElementById('selecaoAlbumBtn');
const selecaoAlbumLink = document.getElementById('selecaoAlbumLink');
const iconsSVG = document.getElementById('import');
const importContainer = document.getElementById('importPicsContainerContainer');
const footer = document.getElementById('footer');
let imagesSelected = new Set();
const gglBtn = document.getElementById('googleFotosBtn');
let btnChosen = getSession('btnChosen') || "";

/*reset options & add pics*/
pcBtn.addEventListener("click", function () {
    importFunctionality("imagens", opcoesImportPC, PCPICSCOLLECTION);
    sessionStorage.removeItem("deletedPictures");
    sessionStorage.removeItem("allValuesSelected");
    sessionStorage.removeItem("selectedImgs");
    opcoesImportGgl.style.display = "none";
    saveSession('btnChosen', "pcBtn");
});

googleFotosBtn.addEventListener("click", function () {
    importFunctionality("imagens", opcoesImportGgl, GGLPICSCOLLECTION);
    sessionStorage.removeItem("deletedPictures");
    sessionStorage.removeItem("allValuesSelected");
    sessionStorage.removeItem("selectedImgs");
    opcoesImportPC.style.display = "none";
    saveSession('btnChosen', "gglBtn");
});


/*modificar área para mostrar imagens pela 1 vez*/
function importFunctionality(location, importBtn, importedPicArray) {
    let opcoesImportBTN = importBtn;
    importText.classList.remove("marginText");  //isto faz com que não haja scroll na pagina
    importText.classList.remove("picsB4");
    iconsSVG.classList.remove("svgB4");
    importContainer.classList.add("picsAfter");
    footer.classList.add("footerAfter");
    importText.classList.add("picsGrid");
    opcoesImportBTN.style.display = "block";
    let HTML = '';
    importedPicArray.forEach(importedPicture => {
        HTML +=`<div class="picContainer">
            <img alt="checkIcon" class="whitecheck hidden whitecheck-${importedPicture.ID}" src="imagens/whitecheck.png">
            <img alt="picture" class="${importedPicture.ID}" id="${importedPicture.ID}" src="${location}/${importedPicture.URL}">
        </div>`;
    });
    importText.innerHTML = HTML;
    /*seleção manual*/
    /*TODO há um bug em que selecionar manualmente e depois filtrar 
    faz com que a seleção desapareça mas só na primeira vez em que isto é feito -??*/
    importedPicArray.forEach(importedPicture => {
        const img = document.getElementById(importedPicture.ID);
        img.addEventListener('click', function() {
            const selectIcon = document.querySelector(`.whitecheck-${importedPicture.ID}`);
            let selectedImages = getSession('selectedImgs') || [];
            if (selectIcon.classList.contains('hidden')) { //select
                selectIcon.classList.remove('hidden'); 
                selectedImages.push(importedPicture);
            } else { //deselect
                selectIcon.classList.add('hidden'); 
                selectedImages = selectedImages.filter(id => id !== importedPicture.ID); 
            }
            saveSession('selectedImgs', selectedImages);
        });
    });
}

/*TODO há alguns erros com o apagar de álbuns (ex apagar número 1 e criar outro = nr 6...) */
/*se houver mais que 6 álbuns, dar mensagem de erro ao clicar num botão de origem
se não, permitir criar*/
function errorMsg() {
  let albumArray = getSession('albumNumber') || [];
  if (albumArray.length === 6) {
      selecaoAlbumBtn.classList.add('disabled');
      selecaoAlbumLink.classList.add("disabled");
      Swal.fire({
        icon: "error",
        title: "Erro.",
        text: "Só pode criar até 6 álbuns.",
      });
  } else {
      selecaoAlbumBtn.classList.remove("disabled");
      selecaoAlbumLink.classList.remove("disabled");
  }
}

/*função para poder usar para vários tipos de import*/
function enableBtn (importBtn) { 
  importBtn.addEventListener("click", function () {
    errorMsg();
  });
}
enableBtn(pcBtn);
enableBtn(googleFotosBtn);

/*código para pôr OPÇÕES num array, mostrar e guardar*/ 
/*GeeksforGeeks Multiple Selection Dropdown with Checkbox */
function multSelect(inputClass, dropDownBtn, PICSCOLLECTION) {
        getSession('allValuesSelected');
        const chBoxes = document.querySelectorAll(`.${inputClass} input[type="checkbox"]`); //checkboxes - class
        let dropDownBtnID = document.getElementById(`${dropDownBtn}`); // dropdown - id
        let mySelectedListItems = []; 
        function handleCB() { 
            mySelectedListItems = []; 
            let mySelectedListItemsText = ''; 
            chBoxes.forEach((checkbox) => { 
                if (checkbox.checked) { 
                    mySelectedListItems.push(checkbox.value); 
                    mySelectedListItemsText += checkbox.value + ', '; 
                    imagesSelected.add(checkbox.value);
                }  else {
                    imagesSelected.delete(checkbox.value);
                }
            }); 
            dropDownBtnID.innerText = mySelectedListItems.length > 0 ? mySelectedListItemsText.slice(0, -2) : 'Selecionar opção'; 
            saveSession('allValuesSelected', Array.from(imagesSelected));
            changePics(PICSCOLLECTION); //chamar aqui para mudar sempre que valor checkbox se altera
        } 
        chBoxes.forEach((checkbox) => { 
            checkbox.addEventListener('change', handleCB); 
        }); 
}
multSelect('pessoasInput', 'dropDownBtnPessoas', PCPICSCOLLECTION)
multSelect('localInput', 'dropDownBtnLocal', PCPICSCOLLECTION)
multSelect('dataInput', 'dropDownBtnData', PCPICSCOLLECTION)
multSelect('ocasioesInput', 'dropDownBtnOcasioes', PCPICSCOLLECTION)
multSelect('emocoesInput', 'dropDownBtnEmocoes', PCPICSCOLLECTION)
multSelect('tipoFotoInput', 'dropDownBtnTipoFoto', PCPICSCOLLECTION)

multSelect('pessoasInputGgl', 'dropDownBtnPessoasGgl', GGLPICSCOLLECTION)
multSelect('localInputGgl', 'dropDownBtnLocalGgl', GGLPICSCOLLECTION)
multSelect('dataInputGgl', 'dropDownBtnDataGgl', GGLPICSCOLLECTION)
multSelect('ocasioesInputGgl', 'dropDownBtnOcasioesGgl', GGLPICSCOLLECTION)
multSelect('emocoesInputGgl', 'dropDownBtnEmocoesGgl', GGLPICSCOLLECTION)
multSelect('tipoFotoInputGgl', 'dropDownBtnTipoFotoGgl', GGLPICSCOLLECTION)

/*filtrar fotos de acordo opcoes escolhidas + seleção manual de imagens filtradas*/
function filterPics(picCollection, filterValues) {
    if (filterValues.length === 0) {
        return picCollection;
    }
    return picCollection.filter(picture => {
        return Object.values(picture).some(value => {
            if (Array.isArray(value)) {
                return value.some(item => filterValues.includes(item));
            }
            return filterValues.includes(value);
        });
    });
}

function changePics(PICSCOLLECTION) { 
    let allValuesSelected = getSession('allValuesSelected') || [];
    let filteredImages = filterPics(PICSCOLLECTION, allValuesSelected);
    importText.innerHTML = '';
    let selectedImages = getSession('selectedImgs') || []; 
    if (filteredImages.length > 0) {
        filteredImages.forEach(filteredImage => {
            const container = document.createElement('div');
            container.className = 'picContainer';
            const img = document.createElement('img');
            img.alt = "picture";
            img.className = `${filteredImage.URL}`;
            img.src = `imagens/${filteredImage.URL}`;
            const selectIcon = document.createElement('img');
            selectIcon.alt = "check icon";
            selectIcon.className = 'whitecheck hidden';
            selectIcon.src = "imagens/whitecheck.png";
            if (selectedImages.includes(filteredImage.ID)) {
                selectIcon.classList.remove('hidden');
            }
            img.addEventListener('click', function() {
                toggleSelection(filteredImage.ID, selectIcon);
            });
            container.appendChild(selectIcon);
            container.appendChild(img);
            importText.appendChild(container);
        });
    } else { //TODO check this
        importFunctionality(PICSCOLLECTION);
    }
}

/*helper function seleção manual*/
function toggleSelection(imageID, selectIcon) {
    let selectedImages = getSession('selectedImgs') || [];
    if (selectIcon.classList.contains('hidden')) { //select
        selectIcon.classList.remove('hidden'); 
        selectedImages.push(imageID);
    } else {
        selectIcon.classList.add('hidden'); //deselect
        selectedImages = selectedImages.filter(id => id !== imageID);
    }
    saveSession('selectedImgs', selectedImages);
}
