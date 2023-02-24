const form = document.querySelector('#file-upload');
const url = window.location.origin;
const salir = document.querySelector('.logout-btn');
const userLog = sessionStorage.getItem('userLog');
if (!userLog) {
  document.body.style.display = 'none';
  window.location.pathname = '/login.html';
}

const api = 'http://localhost:3000';

async function logAut() {
  return await axios.get(`${api}/get/logAut`);
}

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
    let { update, DocOwner, createdAt } = await App.addDocument(
      hash,
      title,
      description,
      group
    );
    if (update) {
      formData(hash, DocOwner, createdAt);
    }
  };
  lector.readAsText(archivo);
}

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

function redirect() {
  logAut().then((resp) => {
    if (resp.data.message === 'success') {
      sessionStorage.clear();
      window.location.href = url;
    } else {
      console.error('Error al cerrar sesion');
    }
  });
}

function formData(hash, DocOwner, createdAt) {
  try {
    let formData = new FormData(document.querySelector('#file-upload'));
    formData.append('hash', hash);
    formData.append('DocOwner', DocOwner);
    formData.append('createdAt', createdAt);
    let request = new XMLHttpRequest();
    request.open('POST', 'http://localhost:5000/post/upload');
    request.send(formData);
  } catch (error) {}
}
