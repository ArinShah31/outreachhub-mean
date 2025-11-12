// Populate contact-view.html with API data
window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id || id === 'undefined') {
    showDialog('No contact selected', 'warning');
    // Replace the section content with a friendly message
    const container = document.querySelector('section.card');
    if (container) {
      container.innerHTML = '<h1>Contact details</h1><p>No contact selected.</p><p><a href="contacts-list.html" class="btn">Back to list</a></p>';
    }
    return;
  }

  try {
    const contact = await getContactById(id);
    if (!contact) return;

    // Find placeholders in the page; fallback to existing static content
    const container = document.querySelector('section.card');
    if (container) {
      // Replace the static paragraphs with dynamic content
      container.innerHTML = `\n            <h1>Contact details</h1>\n\n            <p>\n                <strong>Name:</strong>\n                ${contact.name || '-'}\n            </p>\n            <p>\n                <strong>Phone:</strong>\n                ${contact.phoneNumber || contact.phone || '-'}\n            </p>\n            <p>\n                <strong>Tags:</strong>\n                ${Array.isArray(contact.tags) ? contact.tags.join(', ') : (contact.tags || '-')}\n            </p>\n\n            <p style="margin-top:12px;" id="contactActions">\n            </p>\n        `;

      const user = JSON.parse(localStorage.getItem('userData'));
      const role = user?.role || 'viewer';
      const actionsEl = document.getElementById('contactActions');
      if (actionsEl) {
        let html = ` <a href="contacts-list.html" class="btn">Back to list</a> `;
        html = `<a href="contacts-list.html" class="btn">Back to list</a>`;
        html += ' ';
        if (role === 'editor') {
          html = `<a href="contact-edit.html?id=${contact.id}" class="btn">Edit</a> <a href="contacts-list.html" class="btn" onclick="event.preventDefault(); if(confirm('Delete this contact?')){ deleteContact(${contact.id}).then(()=>{ const msg = localStorage.getItem('dialogMessage'); if(msg){ const {text,type} = JSON.parse(msg); showDialog(text,type); localStorage.removeItem('dialogMessage'); } window.location.href='contacts-list.html'; }) }">Delete</a> <a href="contacts-list.html" class="btn">Back to list</a>`;
        }
        actionsEl.innerHTML = html;
      }
    }
  } catch (err) {
    console.error('Failed to load contact', err);
  }
});
