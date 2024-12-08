function replaceInfo (pictureObj) {
    const cameraUsada = document.getElementById('cameraUsada');
    const resolucaoFoto = document.getElementById('resolucaoFoto');
    const autorFoto = document.getElementById('autorFoto');
    const dataFoto = document.getElementById('dataFoto');
    const localFoto = document.getElementById('localFoto');
    const entidadesFoto = document.getElementById('entidadesFoto');
    const tipoFoto = document.getElementById('tipoFoto');
    const emocoesFoto = document.getElementById('emocoesFoto');

    cameraUsada.innerHTML = `${pictureObj.camera}`;
    resolucaoFoto.innerHTML = `${pictureObj.resolucao}`;
    autorFoto.innerHTML = `${pictureObj.autor}`;
    dataFoto.innerHTML = `${pictureObj.data}`;
    localFoto.innerHTML = `${pictureObj.local}`;
    entidadesFoto.innerHTML = `${pictureObj.entidades}`;
    tipoFoto.innerHTML = `${pictureObj.tipofoto}`;
    emocoesFoto.innerHTML = `${pictureObj.emocoes}`;
}

let importedPictureExe = {
  camera: "Câmera",
  resolucao: "600 dpi",
  autor: "Vítor",
  data: "24-09-24",
  local: "Berlim",
  entidades: "Antônia",
  tipofoto: "Retrato",
  emocoes: "Artístico",
  feature1: "olhos fechados",
  feature2: "desfocada",
  URL: "gettyimages-1309823644-2048x2048V2.jpg",
  manter: false
};

replaceInfo(importedPictureExe);