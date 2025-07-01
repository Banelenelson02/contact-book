// Sample contact data
let contacts = [];

// DOM Elements
const contactList = document.getElementById('contactList');
const contactModal = document.getElementById('contactModal');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const saveContactBtn = document.getElementById('saveContactBtn');
const contactForm = document.getElementById('contactForm');
const addContactBtn = document.getElementById('addContactBtn');
const refreshBtn = document.getElementById('refreshBtn');
const avatarInput = document.getElementById('avatar');
const avatarPreview = document.getElementById('avatarPreview');
const confirmationModal = document.getElementById('confirmationModal');
const closeConfirmationModal = document.getElementById('closeConfirmationModal');
const cancelConfirmation = document.getElementById('cancelConfirmation');
const confirmSave = document.getElementById('confirmSave');
const confirmationDetails = document.getElementById('confirmationDetails');

// State variables
let currentContactId = null;
let isEditMode = false;

// Initialize the app
function initApp() {
    // Load sample data
    contacts = [
                {
                    id: 1,
                    firstName: "Nkosinathi",
                    lastName: "Mabena",
                    phone: "081 123-4567",
                    email: "Mabenankosi@example.com",
                    avatar: null,
                    notes: "Met at the conference last year",
                    isFavorite: true,
                    createdAt: "2024-05-15"
                },
                {
                    id: 2,
                    firstName: "Nondumiso",
                    lastName: "Mahlangu",
                    phone: "060 987-6543",
                    email: "Nondumisoj@business.com",
                    avatar: null,
                    notes: "Marketing director at AWS",
                    isFavorite: false,
                    createdAt: "2025-06-22"
                },
                {
                    id: 3,
                    firstName: "Sunday",
                    lastName: "Dube",
                    phone: "066 456 7890",
                    email: "sunday.w@tech.io",
                    avatar: null,
                    notes: "Software engineer specializing in AI",
                    isFavorite: true,
                    createdAt: "2024-07-10"
                },
                {
                    id: 4,
                    firstName: "Vision",
                    lastName: "jarvius",
                    phone: "079 234 5678",
                    email: "vision.jarvius@design.com",
                    avatar: null,
                    notes: "Graphic designer and illustrator",
                    isFavorite: false,
                    createdAt: "2025-08-05"
                }
            ];
    
    renderContacts();
    setupEventListeners();
    updateStats();
}

// Set up event listeners
function setupEventListeners() {
    addContactBtn.addEventListener('click', openAddContactModal);
    refreshBtn.addEventListener('click', refreshContacts);
    closeModal.addEventListener('click', closeContactModal);
    cancelBtn.addEventListener('click', closeContactModal);
    saveContactBtn.addEventListener('click', saveContact);
    avatarInput.addEventListener('change', handleAvatarUpload);
    closeConfirmationModal.addEventListener('click', () => confirmationModal.style.display = 'none');
    cancelConfirmation.addEventListener('click', () => confirmationModal.style.display = 'none');
    confirmSave.addEventListener('click', confirmAndSaveContact);
}

// Render contacts to the list
function renderContacts() {
    if (contacts.length === 0) {
        contactList.innerHTML = `
            <div class="no-contacts">
                <i class="fas fa-user-friends"></i>
                <h3>No Contacts Found</h3>
                <p>Add your first contact to get started</p>
            </div>
        `;
        return;
    }
    
    contactList.innerHTML = '';
    
    contacts.forEach(contact => {
        const firstLetter = contact.firstName.charAt(0).toUpperCase();
        const contactElement = document.createElement('div');
        contactElement.className = 'contact-item';
        contactElement.innerHTML = `
            <div class="avatar" style="background: ${stringToColor(contact.firstName + contact.lastName)}">
                ${firstLetter}
            </div>
            <div class="contact-info">
                <div class="contact-name">${contact.firstName} ${contact.lastName}</div>
                <div class="contact-details">
                    <div class="contact-phone">
                        <i class="fas fa-phone"></i> ${contact.phone}
                    </div>
                    <div class="contact-email">
                        <i class="fas fa-envelope"></i> ${contact.email}
                    </div>
                </div>
            </div>
            <div class="contact-actions">
                <button class="action-btn edit-btn" data-id="${contact.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${contact.id}">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="action-btn favorite-btn" data-id="${contact.id}">
                    <i class="fas${contact.isFavorite ? ' fa-star' : ' fa-star'}"></i>
                </button>
            </div>
        `;
        
        contactList.appendChild(contactElement);
        
        // Add event listeners to action buttons
        contactElement.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openEditContactModal(contact.id);
        });
        
        contactElement.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteContact(contact.id);
        });
        
        contactElement.querySelector('.favorite-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(contact.id);
        });
        
        contactElement.addEventListener('click', () => {
            viewContactDetails(contact.id);
        });
    });
}

// Open modal for adding a new contact
function openAddContactModal() {
    isEditMode = false;
    currentContactId = null;
    modalTitle.textContent = "Add New Contact";
    contactForm.reset();
    avatarPreview.innerHTML = '<i class="fas fa-user"></i>';
    contactModal.style.display = 'flex';
}

// Open modal for editing a contact
function openEditContactModal(contactId) {
    isEditMode = true;
    currentContactId = contactId;
    const contact = contacts.find(c => c.id === contactId);
    
    if (contact) {
        modalTitle.textContent = "Edit Contact";
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('phone').value = contact.phone;
        document.getElementById('email').value = contact.email;
        document.getElementById('notes').value = contact.notes || '';
        
        // Show avatar preview if available
        if (contact.avatar) {
            avatarPreview.innerHTML = `<img src="${contact.avatar}" alt="${contact.firstName}">`;
        } else {
            avatarPreview.innerHTML = `<i class="fas fa-user"></i>`;
        }
        
        contactModal.style.display = 'flex';
    }
}

// Close the contact modal
function closeContactModal() {
    contactModal.style.display = 'none';
}

// Save contact (shows confirmation first)
function saveContact() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const notes = document.getElementById('notes').value.trim();
    
    if (!firstName || !lastName || !phone || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show confirmation modal with the entered details
    showConfirmationModal(firstName, lastName, phone, email, notes);
}

// Show confirmation modal with contact details
function showConfirmationModal(firstName, lastName, phone, email, notes) {
    confirmationDetails.innerHTML = `
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        <p>Is this information correct?</p>
    `;
    
    confirmationModal.style.display = 'flex';
}

// Actually save the contact after confirmation
function confirmAndSaveContact() {
    confirmationModal.style.display = 'none';
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const notes = document.getElementById('notes').value.trim();
    const avatarFile = avatarInput.files[0];
    
    if (isEditMode) {
        // Update existing contact
        const contactIndex = contacts.findIndex(c => c.id === currentContactId);
        if (contactIndex !== -1) {
            const updatedContact = {
                ...contacts[contactIndex],
                firstName,
                lastName,
                phone,
                email,
                notes
            };
            
            // Handle avatar update if a new file was selected
            if (avatarFile) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    updatedContact.avatar = event.target.result;
                    contacts[contactIndex] = updatedContact;
                    renderContacts();
                    updateStats();
                    closeContactModal();
                    showNotification('Contact updated successfully!');
                };
                reader.readAsDataURL(avatarFile);
            } else {
                contacts[contactIndex] = updatedContact;
                renderContacts();
                updateStats();
                closeContactModal();
                showNotification('Contact updated successfully!');
            }
        }
    } else {
        // Add new contact
        const newContact = {
            id: Date.now(),
            firstName,
            lastName,
            phone,
            email,
            notes,
            avatar: null,
            isFavorite: false,
            createdAt: new Date().toISOString().split('T')[0]
        };
        
        // Handle avatar if file was selected
        if (avatarFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                newContact.avatar = event.target.result;
                contacts.push(newContact);
                renderContacts();
                updateStats();
                closeContactModal();
                showNotification('Contact added successfully!');
            };
            reader.readAsDataURL(avatarFile);
        } else {
            contacts.push(newContact);
            renderContacts();
            updateStats();
            closeContactModal();
            showNotification('Contact added successfully!');
        }
    }
}

// Delete a contact
function deleteContact(contactId) {
    if (confirm('Are you sure you want to delete this contact?')) {
        const contactIndex = contacts.findIndex(c => c.id === contactId);
        if (contactIndex !== -1) {
            contacts.splice(contactIndex, 1);
            renderContacts();
            updateStats();
            showNotification('Contact deleted successfully!');
        }
    }
}

// Toggle favorite status
function toggleFavorite(contactId) {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
        contact.isFavorite = !contact.isFavorite;
        renderContacts();
        updateStats();
        showNotification(contact.isFavorite ? 'Added to favorites!' : 'Removed from favorites');
    }
}

// View contact details
function viewContactDetails(contactId) {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
        alert(`Viewing details for: ${contact.firstName} ${contact.lastName}\n\nPhone: ${contact.phone}\nEmail: ${contact.email}\n\nNotes: ${contact.notes || 'None'}`);
    }
}

// Handle avatar upload
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            avatarPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// Refresh contacts
function refreshContacts() {
    renderContacts();
    showNotification('Contacts refreshed!');
}

// Update statistics
function updateStats() {
    document.getElementById('totalContacts').textContent = contacts.length;
    document.getElementById('favoriteContacts').textContent = contacts.filter(c => c.isFavorite).length;
    
    // Count contacts added in the last 30 days
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 30);
    const recentContacts = contacts.filter(c => {
        const contactDate = new Date(c.createdAt);
        return contactDate > recentDate;
    });
    
    document.getElementById('recentContacts').textContent = recentContacts.length;
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Set color based on type
    if (type === 'error') {
        notification.style.background = '#e74c3c';
    } else if (type === 'warning') {
        notification.style.background = '#f39c12';
    } else {
        notification.style.background = '#2ecc71';
    }
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Generate color from string for avatar
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

// Initialize the app when the page loads
window.addEventListener('DOMContentLoaded', initApp);