

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('userData'));

if (!token || !user) {
  window.location.href = 'index.html';
} else {
  const usernameEl = document.getElementById('username');
  if (usernameEl) {
    usernameEl.textContent = user.username || user.name || 'User';
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const msg = localStorage.getItem("dialogMessage");
  if (msg) {
    const { text, type } = JSON.parse(msg);
    showDialog(text, type);
    localStorage.removeItem("dialogMessage");
  }
});