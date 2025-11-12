function renderPaginatedContacts(contacts, page = 1, perPage = 5) {
  const user = JSON.parse(localStorage.getItem('userData'));
  const userRole = user?.role || 'viewer';
  
  const tableBody = document.getElementById("contactsTableBody");
  const paginationEl = document.getElementById("paginationNav");

  const totalPages = Math.ceil(contacts.length / perPage);
  const start = (page - 1) * perPage;
  const paginated = contacts.slice(start, start + perPage);

  tableBody.innerHTML = "";
  paginated.forEach(contact => {
    const tr = document.createElement("tr");
    
    let actionsHTML = `
      <a href="contact-view.html?id=${contact.id}" class="btn">View</a>
    `;
    
    if (userRole === 'editor') {
      actionsHTML += `
        <a href="contact-edit.html?id=${contact.id}" class="btn">Edit</a>
        <button class="btn btn--danger" onclick="confirmDelete('${contact.id}')">Delete</button>
      `;
    } else if (userRole === 'viewer') {
      // Viewer can only view
      actionsHTML += `
        <button class="btn" onclick="showDialog('Permission denied: Only editors can modify contacts', 'warning')" title="Viewers cannot edit">Edit</button>
        <button class="btn btn--danger" onclick="showDialog('Permission denied: Only editors can delete contacts', 'warning')" title="Viewers cannot delete">Delete</button>
      `;
    }
    
    tr.innerHTML = `
      <td>${contact.name || '-'}</td>
      <td>${contact.phoneNumber || contact.phone || '-'}</td>
      <td>${Array.isArray(contact.tags) ? contact.tags.join(', ') : (contact.tags || '-')}</td>
      <td>${actionsHTML}</td>
    `;
    tableBody.appendChild(tr);
  });

  paginationEl.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("a");
    btn.href = "#";
    btn.textContent = i;
    btn.className = page === i ? "active" : "";
    btn.onclick = (e) => {
      e.preventDefault();
      renderPaginatedContacts(contacts, i, perPage);
    };
    paginationEl.appendChild(btn);
  }
  
  // Add "Next" button if not on last page
  if (page < totalPages) {
    const nextBtn = document.createElement("a");
    nextBtn.href = "#";
    nextBtn.textContent = "Next »";
    nextBtn.onclick = (e) => {
      e.preventDefault();
      renderPaginatedContacts(contacts, page + 1, perPage);
    };
    paginationEl.appendChild(nextBtn);
  }
}

async function confirmDelete(id) {
  const user = JSON.parse(localStorage.getItem('userData'));
  const userRole = user?.role || 'viewer';
  
  if (userRole !== 'editor') {
    showDialog('Permission denied: Only editors can delete contacts', 'error');
    return;
  }

  // Simple confirmation using built-in confirm
  if (confirm("Are you sure you want to delete this contact?")) {
    await deleteContact(id);
    const msg = localStorage.getItem("dialogMessage");
    if (msg) {
      const { text, type } = JSON.parse(msg);
      showDialog(text, type);
      localStorage.removeItem("dialogMessage");
    }
    // Reload contacts after deletion
    getContacts().then(contacts => renderPaginatedContacts(contacts));
  }
}