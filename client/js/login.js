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
            const user = resp.data.name;
            const session = JSON.stringify(resp.data);
            document.cookie = session;
            sessionStorage.setItem('userLog', user);
            sessionStorage.setItem('session', session);
            iziToast.success({
                class: 'alert-success',
                close: true,
                layout: 2,
                maxWidth: 500,
                position: 'topCenter',
                progressBar: true,
                timeout: 3000,
                title: 'Inicio de Seccion correcto',
                titleColor: '#25C554',
                titleSize: '14px',
                onClosing: () => {
                    window.location.href = url + '/admin.html';
                },
            });
        })
        .catch((error) => {
            console.error(error);
            iziToast.error({
                backgroundColor: '#F0E5E5',
                class: 'alert-error',
                close: true,
                layout: 2,
                maxWidth: 500,
                position: 'topCenter',
                title: 'Error al iniciar Sesion',
                titleColor: '#E21414',
                titleSize: '14px',
                timeout: 3000,
                progressBar: true,
            });
        });
}
