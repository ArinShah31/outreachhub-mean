function renderPaginatedContacts(contacts, page = 1, perPage = 5) {
  const listEl = document.getElementById("list");
  const paginationEl = document.getElementById("pagination");

  const totalPages = Math.ceil(contacts.length / perPage);
  const start = (page - 1) * perPage;
  const paginated = contacts.slice(start, start + perPage);

  listEl.innerHTML = "";
  paginated.forEach(contact => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="contact-info">
        <strong>${contact.name}</strong>
        <p>${contact.phone}</p>
        <p>${contact.email}</p>
      </div>
      <div class="contact-actions">
        <button class="view" onclick="window.location.href='contacts-details.html?id=${contact.id}'">View</button>
        <button class="edit" onclick="window.location.href='contacts-form.html?id=${contact.id}'">Edit</button>
        <button class="delete" onclick="confirmDelete('${contact.id}')">Delete</button>
      </div>
    `;
    listEl.appendChild(li);
  });

  paginationEl.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = page === i ? "active" : "";
    btn.onclick = () => renderPaginatedContacts(contacts, i, perPage);
    paginationEl.appendChild(btn);
  }
}

async function confirmDelete(id) {
  if (showCustomConfirm("Are you sure you want to delete this contact?")) {

  }

  showCustomConfirm("Do you really want to delete this contact?",async function (confirmed) {
    if (confirmed) {
      await deleteContact(id);
      const msg = localStorage.getItem("dialogMessage");
      if (msg) {
        const { text, type } = JSON.parse(msg);
        showDialog(text, type);
        localStorage.removeItem("dialogMessage");
      }
      getContacts().then(contacts => renderPaginatedContacts(contacts));
    }
  });
}