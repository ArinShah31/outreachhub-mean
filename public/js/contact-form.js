window.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const contactId = params.get('id');

    if (contactId) {
        let contact;
        await getContactById(contactId).then(res => contact = res);
        if (contact) {
            document.getElementById("name").value = contact.name || '';
            document.getElementById("phone").value = contact.phoneNumber || contact.phone || '';
            // tags may be array on API -> join to comma string
            document.getElementById("tags").value = Array.isArray(contact.tags) ? contact.tags.join(', ') : (contact.tags || '');
        }
    }

    // Set up form submission handler
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            console.log('Form submitted');

            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const tagsRaw = document.getElementById("tags").value.trim();
            const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
            const contactIdParam = params.get('id');

            console.log('Form data:', {name, phone, tags, contactIdParam});

            // Build payload. Do not include `id` when creating a new contact to avoid datatype issues.
            const payload = {
                name,
                phoneNumber: phone,
                tags
            };
            if (contactIdParam) payload.id = contactIdParam;

            console.log('Payload to send:', payload);
            // API expects phoneNumber field; call saveContact with proper payload
            saveContact(payload);
        });
    } else {
        console.error('Form not found on page');
    }
});