const api = 'http://localhost:3000';

async function getUsers() {
  return await axios.get(`${api}/get/Users`);
}

const form = document.querySelector('#newUser');
form.addEventListener('submit', createUser);

function createUser(event) {
  event.preventDefault();
  console.log('entro');
}

function renderDocs() {
  console.log('entro');
  getUsers().then((resp) => {
    console.log(`RobinDev - resp:`, resp);
  });
  let html = '';
  data.forEach((element) => {
    let docElement = `
       <tr>
         <th scope="row">${element.id}</th>
         <td>${element.Titulo}</td>
         <td>${element.Descripcion}</td>
         <td>Certificados</td>
         <td>${new Date(element.createdAt * 1000).toLocaleString()}</td>
         <td>${element.DocOwner}</td>
         <td>${element.Grupo}</td>
       </tr>
       `;
    html += docElement;
  });
  document.querySelector('#documents').innerHTML = html;
}

renderDocs();
