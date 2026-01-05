// Updated for NestJS backend (no /api prefix)
const API_BASE = 'http://localhost:3000';  // Base URL for all API calls

// Get all contacts
async function getContacts() {
  let contacts = [];
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_BASE}/contacts`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (!response.ok) throw new Error('Failed to fetch contacts');
    
    const data = await response.json();
    contacts = Array.isArray(data) ? data : data.data || [];
    console.log('getContacts response:', data, 'extracted:', contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
  }

  return contacts;
}

// Save or update contact
async function saveContact(contact) {
  console.log('saveContact called with:', contact);
  const token = localStorage.getItem('token');
  // Support both `id` and `_id` from different API shapes
  const resourceId = contact.id || contact._id;
  const isUpdate = !!resourceId;
  const url = isUpdate
    ? `${API_BASE}/contacts/${resourceId}`
    : `${API_BASE}/contacts`;
  const method = isUpdate ? 'PUT' : 'POST';

  // Don't send id/_id in the request body for updates
  const payload = { ...contact };
  if (payload.id) delete payload.id;
  if (payload._id) delete payload._id;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'API error');
    }

    const result = await response.json();
    console.log(isUpdate ? 'Contact Updated' : 'Contact Created', result);

    localStorage.setItem(
      "dialogMessage",
      JSON.stringify({
        text: isUpdate ? "Contact Updated successfully!" : "Contact added successfully!",
        type: "success"
      })
    );

    // Redirect after success
    if (isUpdate) {
      window.location.href = `contact-view.html?id=${result.id || resourceId}`;
    } else {
      window.location.href = 'contacts-list.html';
    }
  } catch (error) {
    console.error(`Error ${isUpdate ? 'updating' : 'creating'} contact:`, error);
    showDialog(`Error: ${error.message}`, 'error');
  }
}

// Get single contact by ID
async function getContactById(id) {
  let contact = null;
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_BASE}/contacts/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (!response.ok) throw new Error('Failed to fetch contact');
    
    contact = await response.json();
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
  }

  return contact;
}

// Delete contact
async function deleteContact(id) {
  if (!id || id === 'undefined' || id === 'null') {
    showDialog('Invalid contact ID — cannot delete', 'error');
    return;
  }

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_BASE}/contacts/${id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete');
    }

    localStorage.setItem(
      "dialogMessage",
      JSON.stringify({
        text: "Contact deleted successfully!",
        type: "success"
      })
    );
  } catch (error) {
    console.error('Delete error:', error);
    localStorage.setItem(
      "dialogMessage",
      JSON.stringify({
        text: "Failed to delete contact: " + error.message,
        type: "error"
      })
    );
  }
}