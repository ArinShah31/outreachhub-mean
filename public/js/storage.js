async function getContacts() {
  let contact;
  const token = localStorage.getItem('token');
  await fetch("http://localhost:3000/contacts", {
    headers: token ? { 'Authorization': 'Bearer ' + token } : {}
  })
    .then((res) => res.json())
    .then((res) => {
      // API returns paginated response: { data: [...], total, page, ... }
      // Extract the data array if present, otherwise assume it's already an array
      contact = Array.isArray(res) ? res : (res.data || []);
      console.log('getContacts response:', res, 'extracted:', contact);
    });
  return contact;
}

async function saveContact(contact) {
  console.log('saveContact called with:', contact);
  if (contact.id) {
    // UPDATE: id exists, so this is an update operation
    const token = localStorage.getItem('token');
    await fetch(
      "http://localhost:3000/contacts/" + contact.id,
      {
        method: "PUT",
        headers: Object.assign({
          "Content-Type": "application/json",
        }, token ? { 'Authorization': 'Bearer ' + token } : {}),
        body: JSON.stringify(contact),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log("Record Updated");
        localStorage.setItem(
          "dialogMessage",
          JSON.stringify({
            text: "Contact Updated successful!",
            type: "info",
          })
        );
        window.location.href = `contact-view.html?id=${res.id}`;
      })
      .catch((error) => {
        console.error('Error updating contact:', error);
        showDialog('Error updating contact: ' + error.message, 'error');
      });
  } else {
      // CREATE: id does not exist, so this is a create operation
      const token = localStorage.getItem('token');
      console.log('Creating new contact, token:', token ? 'present' : 'missing');
      await fetch("http://localhost:3000/contacts", {
        method: "POST",
        headers: Object.assign({
          "Content-Type": "application/json",
        }, token ? { 'Authorization': 'Bearer ' + token } : {}),
        body: JSON.stringify(contact),
      })
      .then((res) => {
        console.log('Create response status:', res.status);
        if (!res.ok) {
          throw new Error('API returned status ' + res.status);
        }
        return res.json();
      })
      .then((res) => {
        console.log("Record Inserted", res);
        localStorage.setItem(
          "dialogMessage",
          JSON.stringify({
            text: "Contact Inserted successful!",
            type: "success",
          })
        );
        // After creating a contact, redirect to contacts list so the new contact is loaded
        window.location.href = 'contacts-list.html';
      })
      .catch((error) => {
        console.error('Error creating contact:', error);
        showDialog('Error creating contact: ' + error.message, 'error');
      });
  }
}

async function getContactById(id) {
  let contact;
    const token = localStorage.getItem('token');
    await fetch("http://localhost:3000/contacts/" + id, {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    })
      .then((res) => res.json())
    .then((res) => {
      contact = res;
    });
  return contact;
}

async function deleteContact(id) {
  const token = localStorage.getItem('token');
  await fetch("http://localhost:3000/contacts/" + id, {
    method: "DELETE",
    headers: token ? { 'Authorization': 'Bearer ' + token } : {}
  }).then((res) => {
    if (!res.ok) {
      localStorage.setItem(
        "dialogMessage",
        JSON.stringify({
          text: "Something went wrong",
          type: "warning",
        })
      );
    } else {
      localStorage.setItem(
        "dialogMessage",
        JSON.stringify({
          text: "Contact Deleted successful!",
          type: "success",
        })
      );
    }
  });
}
