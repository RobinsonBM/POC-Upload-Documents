const form = document.querySelector('#file-upload');

form.addEventListener('submit', addDocs);

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
  lector.onload = function (e) {
    let hash = md5(e.target.result);

    console.log(`RobinDev ---------------------RobinDev`);
    console.log(`RobinDev - hash`, hash);
    console.log(`RobinDev ---------------------RobinDev`);
    App.addDocument(hash, title, description, group);
  };
  lector.readAsText(archivo);
}

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
