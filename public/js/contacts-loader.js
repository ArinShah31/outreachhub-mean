// Load and render contacts on page load
window.addEventListener('DOMContentLoaded', async () => {
  try {
    // Check if we're on the contacts list page
    if (!document.getElementById('contactsTableBody')) {
      return;
    }

    // Disable add contact button for viewers
    const user = JSON.parse(localStorage.getItem('userData'));
    const userRole = user?.role || 'viewer';
    const addContactBtn = document.getElementById('addContactBtn');
    
    if (userRole === 'viewer' && addContactBtn) {
      addContactBtn.onclick = (e) => {
        e.preventDefault();
        showDialog('Permission denied: Only editors can add contacts', 'warning');
        return false;
      };
      addContactBtn.style.cursor = 'not-allowed';
      addContactBtn.style.opacity = '0.6';
    }

    // Load contacts from API
    const contacts = await getContacts();
    if (contacts && Array.isArray(contacts)) {
      renderPaginatedContacts(contacts, 1, 5);
    } else {
      document.getElementById('contactsTableBody').innerHTML = 
        '<tr><td colspan="4" style="text-align: center; padding: 20px;">No contacts found</td></tr>';
    }
  } catch (error) {
    console.error('Error loading contacts:', error);
    document.getElementById('contactsTableBody').innerHTML = 
      '<tr><td colspan="4" style="text-align: center; padding: 20px;">Error loading contacts</td></tr>';
  }
});
