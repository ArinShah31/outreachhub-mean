document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    try {
        const response = await fetch('http://localhost:3000/user');
        const users = await response.json();

        const matchedUser = users.find(user => user.email === email && user.password === password);

        if (matchedUser) {
            const fakeJWT = btoa(`${matchedUser.id}:${matchedUser.email}:${Date.now()}`);

            localStorage.setItem('token', fakeJWT);
            localStorage.setItem('userData', JSON.stringify(matchedUser));
            localStorage.setItem("dialogMessage", JSON.stringify({
                text: "Login successful!",
                type: "success"
            }));
            window.location.href = '../index.html';
        } else {
            alert('Invalid email or password!');
        }

    } catch (error) {
        console.error('Login error:', error);
        alert('Something went wrong. Please try again later.');
    }
});

window.addEventListener("DOMContentLoaded", () => {
  const msg = localStorage.getItem("dialogMessage");
  if (msg) {
    const { text, type } = JSON.parse(msg);
    showDialog(text, type);
    localStorage.removeItem("dialogMessage");
  }
});