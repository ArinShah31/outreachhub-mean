// Check role permissions on contact-edit page
window.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('userData'));
  const userRole = user?.role || 'viewer';

  if (userRole === 'viewer') {
    // Redirect viewer back to contacts list
    showDialog('Permission denied: Only editors can add or edit contacts', 'error');
    setTimeout(() => {
      window.location.href = 'contacts-list.html';
    }, 2000);
  }
});
