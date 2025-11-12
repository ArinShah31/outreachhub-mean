document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            try {
                const response = await fetch('http://localhost:3000/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    throw new Error('Login failed');
                }

                const data = await response.json();

                if (data.token || data.access_token) {
                    const token = data.token || data.access_token;
                    localStorage.setItem('token', token);
                    // Try to decode role/username from JWT if not present in body
                    let role = data.role || 'user';
                    let uname = username;
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        if (payload.role) role = payload.role;
                        if (payload.username) uname = payload.username;
                        if (payload.sub && !uname) uname = payload.sub;
                    } catch (e) {
                        // ignore decode errors
                    }
                    localStorage.setItem('userData', JSON.stringify({
                        username: uname,
                        role: role
                    }));
                    localStorage.setItem("dialogMessage", JSON.stringify({
                        text: "Login successful!",
                        type: "success"
                    }));
                    window.location.href = 'home.html';
                } else {
                    showDialog('Invalid username or password!', 'error');
                }

            } catch (error) {
                console.error('Login error:', error);
                showDialog('Something went wrong. Please try again later.', 'error');
            }
        });
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