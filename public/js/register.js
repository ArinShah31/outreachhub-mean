document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    }).then((res) => {
        console.log({ name, email, password })
        localStorage.setItem("dialogMessage", JSON.stringify({
            text: "Sign up successful!",
            type: "success"
        }));
    })
    window.location.href = '/html/login.html'
})