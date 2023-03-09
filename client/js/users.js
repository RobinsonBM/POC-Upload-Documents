const page = {
    skip: 0,
    take: 2,
};
let skipCopy = page.skip;
let users;

const userLog = sessionStorage.getItem('userLog');
if (!userLog) {
    document.body.style.display = 'none';
    window.location.pathname = '/login.html';
}
const api = 'http://localhost:3000';

async function getUsers() {
    return await axios.get(`${api}/get/Users`, {
        headers: {
            Cookies: sessionStorage.getItem('session'),
        },
    });
}
async function newUsers(body) {
    return await axios.post(`${api}/post/Users`, body, {
        headers: {
            Cookies: sessionStorage.getItem('session'),
        },
    });
}
async function editUsers(userID, body) {
    return await axios.put(`${api}/put/usersUpdate/${userID}`, body, {
        headers: {
            Cookies: sessionStorage.getItem('session'),
        },
    });
}
async function editPassword(userID, body) {
    return await axios.put(`${api}/put/usersPasword/${userID}`, body, {
        headers: {
            Cookies: sessionStorage.getItem('session'),
        },
    });
}

const form = document.querySelector('#newUser');
form.addEventListener('submit', userRF);
const newUserBtn = document.querySelector('.newUserBtn');
newUserBtn.addEventListener('click', newUser);
const volverAdmin = document.querySelector('.volverAdmin');
volverAdmin.addEventListener('click', agregar);

function agregar() {
    window.location.pathname = '/admin.html';
}

function userRF(event) {
    event.preventDefault();
    const titulo = document.querySelector('h2').innerText;
    if (titulo === 'Nuevo usuario') {
        const password = form['pass'].value;
        const confirm = form['confirm'].value;
        if (password === confirm) {
            const user = {
                nombre: form['name'].value,
                apellido: form['lastname'].value,
                rol: form['rol'].value,
                correo: form['email'].value,
                password: form['pass'].value,
            };
            newUsers(user).then((resp) => {
                iziToast.success({
                    class: 'alert-success',
                    close: true,
                    layout: 2,
                    maxWidth: 500,
                    position: 'topCenter',
                    title: 'Usuario creado',
                    titleColor: '#25C554',
                    titleSize: '14px',
                    timeout: 3000,
                    progressBar: true,
                    onClosing: () => {
                        renderDocs();
                    },
                });
            });
        } else {
            iziToast.error({
                backgroundColor: '#F0E5E5',
                class: 'alert-error',
                close: true,
                layout: 2,
                maxWidth: 500,
                position: 'topCenter',
                title: 'Deben coincidir las contraseñas',
                titleColor: '#E21414',
                titleSize: '14px',
                timeout: 3000,
                progressBar: true,
            });
        }
    } else if (titulo === 'Editar usuario') {
        const userId = form['id'].value;
        const user = {
            nombre: form['name'].value,
            apellido: form['lastname'].value,
            rol: form['rol'].value.toLowerCase(),
            correo: form['email'].value,
            IsAcepted: form['isacepted'].value === 'true' ? true : false,
        };
        editUsers(userId, user).then((resp) => {
            iziToast.success({
                class: 'alert-success',
                close: true,
                layout: 2,
                maxWidth: 500,
                position: 'topCenter',
                title: 'Usuario actualizado',
                titleColor: '#25C554',
                titleSize: '14px',
                timeout: 3000,
                progressBar: true,
                onClosing: () => {
                    renderDocs();
                    newUser();
                },
            });
        });
    } else if (titulo === 'Cambiar contraseña') {
        const userId = form['id'].value;
        const password = form['pass'].value;
        const confirm = form['confirm'].value;

        if (password === confirm) {
            const pass = {
                password: form['pass'].value,
            };
            editPassword(userId, pass).then((resp) => {
                iziToast.success({
                    class: 'alert-success',
                    close: true,
                    layout: 2,
                    maxWidth: 500,
                    position: 'topCenter',
                    title: 'Contraseña actualizada',
                    titleColor: '#25C554',
                    titleSize: '14px',
                    timeout: 3000,
                    progressBar: true,
                    onClosing: () => {
                        newUser();
                    },
                });
            });
        } else {
            iziToast.error({
                backgroundColor: '#F0E5E5',
                class: 'alert-error',
                close: true,
                layout: 2,
                maxWidth: 500,
                position: 'topCenter',
                title: 'Deben coincidir las contraseñas',
                titleColor: '#E21414',
                titleSize: '14px',
                timeout: 3000,
                progressBar: true,
            });
        }
    }
}

function paginator(data, bucle = false) {
    users = data;
    const dataPag = data.slice(page.skip, page.take + page.skip);
    if (dataPag.length >= page.skip) {
        const totalPager = Math.ceil(data.length / dataPag.length);
        let html = '';
        if (!bucle) {
            for (let index = 0; index < totalPager; index++) {
                if (index === 0) {
                    let htmlTemplate = `
                        <button type="button" class="page-link btn${index} active" data-id="${index}" onclick="skipPLus(this)">
                            ${index + 1}
                        </button>
                    `;
                    html += htmlTemplate;
                } else {
                    let htmlTemplate = `
                    <button type="button" class="page-link btn${index}" data-id="${index}" onclick="skipPLus(this)">
                    ${index + 1}
                    </button>
                    `;
                    html += htmlTemplate;
                }
            }
            document.querySelector('.pagination').innerHTML = html;
        }
    }
    return dataPag;
}

function skipPLus(element) {
    const { id } = element.dataset;
    page.skip = id * page.take;
    element.classList.add('active');
    const allBtns = document.querySelectorAll('.page-link');
    allBtns.forEach((btn) => {
        if (!btn.classList.contains(`btn${id}`)) {
            btn.classList.remove('active');
        }
    });
    paginator(users, true);
    renderDocs(true);
}

function renderDocs(bucle = false) {
    getUsers().then((resp) => {
        let data = resp.data.data;
        data.map((item) => {
            item.Apellido = item.Apellido ? item.Apellido : '';
            item.Rol = item.Rol ? item.Rol : '';
            return item;
        });
        newData = paginator(data, bucle);
        let html = '';
        newData.forEach((element) => {
            let docElement = `
            <tr>
            <td>${element.Nombre}</td>
            <td>${element.Apellido}</td>
            <td>${element.Correo}</td>
            <td>${element.Rol}</td>
            <td>
                <div class="form-check form-switch">
                    <input class="form-check-input" data-id='${element.id}' data-nombre='${
                element.Nombre
            }' data-apellido='${element.Apellido}' data-email="${element.Correo}" data-isacepted="${
                element.IsAcepted
            }" data-rol="${element.Rol}" type="checkbox" ${
                element.IsAcepted && 'checked'
            } onchange='handler(this)' />
                </div>
            </td>
            <td class='d-flex'>
              <div data-id='${element.id}' data-nombre='${element.Nombre}' data-apellido='${
                element.Apellido
            }' data-email="${element.Correo}" data-rol="${element.Rol}" data-isacepted="${
                element.IsAcepted
            }"  onclick='modalEditUser(this)'>
                <i class="fa-solid fa-pen-to-square me-3"></i>
              </div>
              <div data-id='${element.id}' data-nombre='${element.Nombre}' data-apellido='${
                element.Apellido
            }' data-email='${element.Correo}' onclick='modalEditPass(this)'>
                <i class="fa-solid fa-lock"></i>
              </div>
            </td>
          </tr>
         `;
            html += docElement;
        });
        document.querySelector('#users').innerHTML = html;
    });
}

function newUser() {
    document.querySelector('h2').innerHTML = `
    <h2>Nuevo usuario</h2>
    `;
    let html = '';
    let htmlTemplate = `
        <div class="col-md-4 col-12 d-flex flex-column mb-3">
            <label class="form-label" for="name">Nombre</label>
            <input
                class="form-control"
                type="text"
                name="name"
                id="name"
                placeholder="Ej: Pedro"
                required />
        </div>
        <div class="col-md-4 col-12 d-flex flex-column mb-3">
            <label class="form-label" for="lastname">Apellido</label>
            <input
                class="form-control"
                type="text"
                name="lastname"
                id="lastname"
                placeholder="Ej: Smith"
                required />
        </div>
        <div class="col-md-4 col-12 d-flex flex-column mb-3">
            <label class="form-label" for="email">Email</label>
            <input
                class="form-control"
                type="email"
                name="email"
                id="email"
                placeholder="Ej: ejemplo@gmail.com"
                required />
        </div>
        <div class="col-md-4 col-12 d-flex flex-column mb-3">
            <label class="form-label" for="rol">Rol</label>
            <select class="form-select" name="rol" id="rol" required>
                <option disabled selected>Seleccione una opcion</option>
                <option disabled>root</option>
                <option>admin</option>
                <option>user</option>
            </select>
        </div>
        <div class="col-md-4 col-12 d-flex flex-column mb-3">
            <label class="form-label" for="pass">Contraseña</label>
            <input
                class="form-control"
                type="password"
                name="pass"
                id="pass"
                required />
        </div>
        <div class="col-md-4 col-12 d-flex flex-column mb-3">
            <label class="form-label" for="confirm">Confirmar contraseña</label>
            <input
                class="form-control"
                type="password"
                name="confirm"
                id="confirm"
                required />
        </div>
      `;
    html += htmlTemplate;
    document.querySelector('.files').innerHTML = html;
}

function modalEditUser({ dataset }) {
    const { id, nombre, apellido, email, rol, isacepted } = dataset;
    document.querySelector('h2').innerHTML = `
    <h2>Editar usuario</h2>
    `;
    let html = '';
    let htmlTemplate = `
        <input type="hidden" name="id" value="${id}"/>
        <input type="hidden" name="isacepted" value="${isacepted}"/>
        <div class="col-md-6 col-12 d-flex flex-column mb-3">
        <label class="form-label" for="name">Nombre</label>
        <input
            class="form-control"
            type="text"
            name="name"
            id="name"
            value="${nombre}"
            placeholder="Ej: Pedro"
            />
        </div>
        <div class="col-md-6 col-12 d-flex flex-column mb-3">
            <label class="form-label" for="lastname">Apellido</label>
            <input
                class="form-control"
                type="text"
                name="lastname"
                id="lastname"
                value="${apellido}"
                placeholder="Ej: Smith"
                />
        </div>
        <div class="col-md-6 col-12 d-flex flex-column mb-3">
            <label class="form-label" for="email">Email</label>
            <input
                class="form-control"
                type="email"
                name="email"
                id="email"
                value="${email}"
                placeholder="Ej: ejemplo@gmail.com"
                />
        </div>
        <div class="col-md-6 col-12 d-flex flex-column mb-3">
            <label class="form-label" for="rol">Rol</label>
            <input
                class="form-control"
                type="text"
                name="rol"
                id="rol"
                value="${rol}"
                disabled/>
        </div>
      `;
    html += htmlTemplate;
    document.querySelector('.files').innerHTML = html;
}

function modalEditPass({ dataset }) {
    const { id, nombre, apellido, email } = dataset;
    document.querySelector('h2').innerHTML = `
    <h2>Cambiar contraseña</h2>
    `;
    let html = '';
    let htmlTemplate = `
        <input type="hidden" name="id" value="${id}"/>     
        <div class="col-md-4 col-12 d-flex flex-column mb-3">
            <label class="form-label" for="name">Nombre</label>
            <input
            class="form-control"
            type="text"
            name="name"
            id="name"
            value="${nombre}"
            disabled
            />
        </div>
        <div class="col-md-4 col-12 d-flex flex-column mb-3">
            <label class="form-label" for="lastname">Apellido</label>
            <input
                class="form-control"
                type="text"
                name="lastname"
                id="lastname"
                value="${apellido}"
                disabled
                />
        </div>
        <div class="col-md-4 col-12 d-flex flex-column mb-3">
            <label class="form-label" for="email">Email</label>
            <input
                class="form-control"
                type="email"
                name="email"
                id="email"
                value="${email}"
                disabled
                />
        </div> 
        <div class="col-md-6 col-12 d-flex flex-column mb-3">
            <label class="form-label" for="name">Contraseña</label>
            <input
                class="form-control"
                type="password"
                name="pass"
                id="pass"
                required />
        </div>
        <div class="col-md-6 col-12 d-flex flex-column mb-3">
            <label class="form-label" for="lastname">Confirmar contraseña</label>
            <input
                class="form-control"
                type="password"
                name="confirm"
                id="confirm"
                required />
        </div>
      `;
    html += htmlTemplate;
    document.querySelector('.files').innerHTML = html;
}

function handler({ dataset }) {
    const { id, nombre, apellido, email, isacepted, rol } = dataset;
    const changeAccept = isacepted === 'true' ? true : false;
    const edit = {
        nombre: nombre,
        apellido: apellido,
        correo: email,
        IsAcepted: !changeAccept,
        rol: rol,
    };
    editUsers(id, edit).then(() => {
        renderDocs();
    });
}

newUser();
renderDocs();
