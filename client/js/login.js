const api = 'http://localhost:3000';

async function loginAuth(body) {
  return await axios.post(`${api}/post/loginAuth`, body);
}

const form = document.querySelector('#login');
const url = window.location.origin;
form.addEventListener('submit', login);

function login(event) {
  event.preventDefault();
  const user = {
    user: event.target['email'].value,
    pass: event.target['pass'].value,
  };
  loginAuth(user)
    .then((resp) => {
      const user = resp.data.session.name;
      const session = JSON.stringify(resp.data.session);
      sessionStorage.setItem('userLog', user);
      sessionStorage.setItem('session', session);
      iziToast.success({
        class: 'alert-success',
        layout: 2,
        maxWidth: 500,
        message: 'Inicio de Seccion correcto',
        messageColor: '#000000',
        messageSize: '14px',
        position: 'topCenter',
        progressBar: true,
        timeout: false,
        onClosing: () => {
          window.location.href = url + '/admin.html';
        },
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
