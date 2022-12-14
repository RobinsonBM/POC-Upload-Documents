document
  .getElementById('file-input')
  .addEventListener('change', leerArchivo, false);
async function leerArchivo(e) {
  let archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  let lector = new FileReader();
  lector.onload = function (e) {
    let hash = md5(e.target.result);

    App.getDocument(hash);
  };
  lector.readAsText(archivo);
}

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
