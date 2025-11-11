

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('userData'));

if (!token || !user) {
  window.location.href = '/html/login.html';
} else {
  document.getElementById('username').textContent = user.name;
}

window.addEventListener("DOMContentLoaded", () => {
  const msg = localStorage.getItem("dialogMessage");
  if (msg) {
    const { text, type } = JSON.parse(msg);
    showDialog(text, type);
    localStorage.removeItem("dialogMessage");
  }
});