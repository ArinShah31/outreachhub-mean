# Role-Based Access Control (RBAC) Implementation

## Overview
Implemented role-based permission system for the contacts management application with two roles: **Viewer** and **Editor**.

## Roles and Permissions

### Viewer Role
- ✅ Can view contacts list
- ✅ Can view contact details
- ❌ Cannot add contacts (button disabled with warning message)
- ❌ Cannot edit contacts (Edit button shows permission denied message)
- ❌ Cannot delete contacts (Delete button shows permission denied message)
- ❌ Cannot access contact-edit.html (redirected back to contacts list)

### Editor Role
- ✅ Can view contacts list
- ✅ Can view contact details
- ✅ Can add contacts (Add contact button enabled)
- ✅ Can edit contacts (Edit button functional)
- ✅ Can delete contacts (Delete button functional)
- ✅ Can access contact-edit.html

## Changes Made

### 1. **contacts-list.html** - Updated Structure
- Replaced hardcoded contacts with dynamic table body
- Changed table body ID to `contactsTableBody` (previously had no ID)
- Changed pagination container ID to `paginationNav`
- Added `id="addContactBtn"` to "Add contact" button for control

### 2. **pagination.js** - Role-Based Rendering
Added role-based access control:
```javascript
- Reads user role from localStorage
- For Editors: Shows "Edit" link and "Delete" button (functional)
- For Viewers: Shows disabled "Edit" and "Delete" buttons with warning messages
- Added role check in confirmDelete() function
```

Updated table rendering:
- Changed from list (`<li>`) to proper table rows (`<tr>`)
- Uses `getElementById("contactsTableBody")` instead of `getElementById("list")`
- Uses `getElementById("paginationNav")` for pagination

### 3. **contacts-loader.js** - New File
Created new file to:
- Load contacts from API on page load
- Disable "Add contact" button for viewers with visual feedback
- Handle errors gracefully
- Only runs on contacts list page (checks for `contactsTableBody` element)

### 4. **contact-edit-guard.js** - New File
Created permission guard for edit page:
- Checks user role before allowing access
- Redirects viewers back to contacts list
- Shows permission denied message

### 5. **contacts-list.html** - Updated Script Tags
Added new scripts in order:
1. `dialog.js` - Dialog messages
2. `storage.js` - API calls
3. `pagination.js` - Rendering logic
4. `contacts-loader.js` - Page load handler
5. `index.js` - User display

### 6. **contact-edit.html** - Added Permission Guard
Added script in order:
1. `dialog.js` - Dialog messages
2. `contact-edit-guard.js` - Permission check (NEW)
3. `storage.js` - API calls
4. `contact-form.js` - Form handling

## User Experience

### Viewer Seeing Contacts List
```
View button:     [Enabled] Click to view details
Edit button:     [Disabled] Shows: "Permission denied: Only editors can modify contacts"
Delete button:   [Disabled] Shows: "Permission denied: Only editors can delete contacts"
Add Contact btn: [Disabled] Shows: "Permission denied: Only editors can add contacts"
```

### Editor Seeing Contacts List
```
View button:     [Enabled] Click to view details
Edit button:     [Enabled] Click to edit contact
Delete button:   [Enabled] Click to delete contact
Add Contact btn: [Enabled] Click to add new contact
```

### Viewer Trying to Access /contact-edit.html
```
Message: "Permission denied: Only editors can add or edit contacts"
After 2 seconds: Redirected to contacts-list.html
```

## API Calls

### Get Contacts
```javascript
GET /Contact
Returns: Array of contact objects
```

Response format:
```json
[
  {
    "id": 1,
    "name": "Contact Name",
    "phone": "+91-90000111",
    "tags": "prospect"
  }
]
```

## Files Created
1. `/public/js/contacts-loader.js` - Load and render contacts on page load
2. `/public/js/contact-edit-guard.js` - Permission guard for edit page

## Files Modified
1. `/contacts-list.html` - Dynamic structure and script order
2. `/contact-edit.html` - Added guard script
3. `/public/js/pagination.js` - Role-based rendering and permission checks

## Testing Scenarios

### Scenario 1: Viewer Login
1. Login with: `viewer` / `viewer`
2. Navigate to Contacts
3. Verify Edit and Delete buttons show permission denied messages
4. Try to click "Add contact" - should see permission denied message
5. Try to manually navigate to `/contact-edit.html` - should be redirected

### Scenario 2: Editor Login
1. Login with: `editor` / `editor`
2. Navigate to Contacts
3. Verify all buttons are functional
4. Click "Add contact" - should navigate to edit page
5. Click "Edit" on any contact - should navigate to edit page with contact data
6. Click "Delete" on any contact - should show confirmation and delete

### Scenario 3: Dynamic Contact Loading
1. Contacts should load from API (not hardcoded)
2. Should show pagination controls
3. Should handle empty contact list gracefully

## Error Handling
- Displays user-friendly error message if API fails
- Gracefully handles empty contact list
- Validates user role before showing actions
- Prevents unauthorized page access via URL navigation
