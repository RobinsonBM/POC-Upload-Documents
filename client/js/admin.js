const form = document.querySelector('#file-upload');
const url = window.location.origin;
const salir = document.querySelector('.logout-btn');

form.addEventListener('submit', addDocs);
salir.addEventListener('click', redirect);

function addDocs(e) {
  e.preventDefault();
  let title = form['title'].value;
  let description = form['description'].value;
  let group = form['group'].value;
  let archivo = e.target[3].files[0];
  if (!archivo) {
    return;
  }
  let lector = new FileReader();
  lector.onload = async function (e) {
    let hash = md5(e.target.result);
    let { update, DocOwner } = await App.addDocument(
      hash,
      title,
      description,
      group
    );
    if (update) {
      formData(hash, DocOwner);
    }
  };
  lector.readAsText(archivo);
}

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

function redirect() {
  window.location.href = url;
}

function formData(hash, DocOwner) {
  try {
    let formData = new FormData(document.querySelector('#file-upload'));
    formData.append('hash', hash);
    formData.append('DocOwner', DocOwner);
    let request = new XMLHttpRequest();
    request.open('POST', 'http://localhost:5000/upload');
    request.send(formData);
  } catch (error) {}
}
