window.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const contactId = params.get('id');

    if (contactId) {
        let contact;
        await getContactById(contactId).then(res => contact = res);
        if (contact) {
            document.getElementById("contactId").value = contact.id;
            document.getElementById("name").value = contact.name;
            document.getElementById("phone").value = contact.phone;
            document.getElementById("email").value = contact.email;
        }
    }
});

document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("contactId").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    saveContact({ id, name, phone, email });
    // window.location.href = `contacts-details.html?id=${id}`;
});