const form = document.querySelector('#login');
const url = window.location.origin;
form.addEventListener('submit', login);

function login(e) {
  e.preventDefault();
  window.location.href = url + '/admin.html';
}
