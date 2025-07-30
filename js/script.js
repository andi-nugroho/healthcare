// Global variables
let currentUser = null;
let currentRating = 0;
let doctors = [
    { id: 1, name: "Dr. Sarah Johnson", specialization: "cardiology", experience: "10 years", rating: 4.8 },
    { id: 2, name: "Dr. Michael Chen", specialization: "dermatology", experience: "8 years", rating: 4.7 },
    { id: 3, name: "Dr. Emily Davis", specialization: "pediatrics", experience: "12 years", rating: 4.9 },
    { id: 4, name: "Dr. Robert Wilson", specialization: "orthopedics", experience: "15 years", rating: 4.6 }
];

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');

    notificationText.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        hideNotification();
    }, 5000);
}

// Hide notification
function hideNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show');
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // --- [PENINGKATAN DIMULAI] ---
    // Menghapus kelas 'active' dari semua tab-btn dan nav-links
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    // --- [PENINGKATAN SELESAI] ---

    // Menampilkan section yang dipilih
    if (sectionName === 'home') {
        document.getElementById('home').classList.add('active');
        document.getElementById('services').classList.add('active');
    } else if (sectionName === 'signup' || sectionName === 'login') {
        document.getElementById('auth').classList.add('active');
    } else {
        const section = document.getElementById(sectionName);
        if (section) section.classList.add('active');
    }

    // --- [PENINGKATAN DIMULAI] ---
    // Memberi kelas 'active' pada tab-btn dan nav-link yang sesuai
    const activeTabBtn = document.querySelector(`.tab-btn[onclick="showSection('${sectionName}')"]`);
    if (activeTabBtn) activeTabBtn.classList.add('active');

    let navLinkSelector = sectionName;
    // Penanganan khusus untuk `doctor-search` yang linknya `doctors`
    if(sectionName === 'doctor-search') {
        navLinkSelector = 'doctors';
    }
    const activeNavLink = document.querySelector(`.nav-links a[href="#${navLinkSelector}"]`);
    if(activeNavLink) activeNavLink.classList.add('active');
    // --- [PENINGKATAN SELESAI] ---
}

// Form validation
function validateForm(formData, isSignup = false) {
    const errors = {};

    if (isSignup) {
        if (!formData.fullName || formData.fullName.length < 2) {
            errors.fullName = 'Full name must be at least 2 characters';
        }
        if (!formData.phone || !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!formData.password || formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    return errors;
}

// Display validation errors
function displayErrors(errors) {
    // Clear all previous errors
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');

    // Display new errors
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(field + 'Error');
        if (errorElement) {
            errorElement.textContent = errors[field];
            errorElement.style.color = '#dc3545';
            errorElement.style.fontSize = '0.9rem';
            errorElement.style.marginTop = '0.5rem';
        }
    });
}

// Sign up form handler
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };

    const errors = validateForm(formData, true);

    if (Object.keys(errors).length > 0) {
        displayErrors(errors);
        showNotification('Please fix the errors in the form', 'error');
        return;
    }

    // Simulate successful registration
    currentUser = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone
    };

    updateUIForLoggedInUser();
    showNotification('Account created successfully! Welcome to StayHealthy.');
    showSection('home');
});

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    const errors = validateForm(formData, false);

    if (Object.keys(errors).length > 0) {
        displayErrors(errors);
        showNotification('Please fix the errors in the form', 'error');
        return;
    }

    // Simulate successful login
    currentUser = {
        name: 'John Doe',
        email: formData.email,
        phone: '+1234567890'
    };

    updateUIForLoggedInUser();
    showNotification('Login successful! Welcome back.');
    showSection('home');
});

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const authButtons = document.querySelector('.auth-buttons');
    const loginBtn = authButtons.querySelector('button[onclick="showSection(\'login\')"]');
    const signupBtn = authButtons.querySelector('button[onclick="showSection(\'signup\')"]');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';

    // Update profile information
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileNameEdit').value = currentUser.name;
    document.getElementById('profileEmailEdit').value = currentUser.email;
    document.getElementById('profilePhoneEdit').value = currentUser.phone || '';
}

// Logout function
function logout() {
    currentUser = null;
    const authButtons = document.querySelector('.auth-buttons');
    const loginBtn = authButtons.querySelector('button[onclick="showSection(\'login\')"]');
    const signupBtn = authButtons.querySelector('button[onclick="showSection(\'signup\')"]');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (signupBtn) signupBtn.style.display = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'none';

    showNotification('Logged out successfully');
    showSection('home');
}

// Search doctors
function searchDoctors() {
    const searchTerm = document.getElementById('doctorSearch').value.toLowerCase();
    const specialization = document.getElementById('specializationFilter').value;

    let filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm) ||
                              doctor.specialization.toLowerCase().includes(searchTerm);
        const matchesSpecialization = !specialization || doctor.specialization === specialization;
        return matchesSearch && matchesSpecialization;
    });

    displayDoctors(filteredDoctors);
    showNotification(`Found ${filteredDoctors.length} doctors matching your search`);
}

// Display doctors
function displayDoctors(doctorList) {
    const doctorGrid = document.getElementById('doctorGrid');
    doctorGrid.innerHTML = '';

    if (doctorList.length === 0) {
        doctorGrid.innerHTML = `<p style="text-align:center; grid-column: 1 / -1;">No doctors found.</p>`;
        return;
    }

    doctorList.forEach(doctor => {
        const doctorCard = document.createElement('div');
        doctorCard.className = 'doctor-card';
        doctorCard.innerHTML = `
            <div class="doctor-avatar">
                <i class="fas fa-user-md"></i>
            </div>
            <h3>${doctor.name}</h3>
            <p><strong>Specialization:</strong> ${doctor.specialization.charAt(0).toUpperCase() + doctor.specialization.slice(1)}</p>
            <p><strong>Experience:</strong> ${doctor.experience}</p>
            <p><strong>Rating:</strong> ${'★'.repeat(Math.floor(doctor.rating))}${'☆'.repeat(5 - Math.floor(doctor.rating))} ${doctor.rating}</p>
            <button class="btn btn-primary" onclick="bookAppointment(${doctor.id})">
                <i class="fas fa-calendar-plus"></i> Book Appointment
            </button>
            <button class="btn btn-outline" onclick="instantConsultation(${doctor.id})">
                <i class="fas fa-video"></i> Instant Consultation
            </button>
        `;
        doctorGrid.appendChild(doctorCard);
    });
}

// Book appointment
function bookAppointment(doctorId) {
    if (!currentUser) {
        showNotification('Please login to book an appointment', 'error');
        showSection('login');
        return;
    }

    const doctor = doctors.find(d => d.id === doctorId);
    showNotification(`Appointment booking initiated with ${doctor.name}`);

    setTimeout(() => {
        showNotification(`Appointment successfully booked with ${doctor.name} for tomorrow at 10:00 AM`);
    }, 2000);
}

// Instant consultation
function instantConsultation(doctorId) {
    if (!currentUser) {
        showNotification('Please login for instant consultation', 'error');
        showSection('login');
        return;
    }

    const doctor = doctors.find(d => d.id === doctorId);
    showNotification(`Connecting you with ${doctor.name} for instant consultation...`);

    setTimeout(() => {
        showNotification(`Connected! Starting video consultation with ${doctor.name}`);
    }, 3000);
}

// Profile management
function editProfile() {
    document.getElementById('profileEditForm').style.display = 'block';
}

function cancelEditProfile() {
    document.getElementById('profileEditForm').style.display = 'none';
}

// Profile form handler
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newName = document.getElementById('profileNameEdit').value;
    const newEmail = document.getElementById('profileEmailEdit').value;
    const newPhone = document.getElementById('profilePhoneEdit').value;

    if (currentUser) {
        currentUser.name = newName;
        currentUser.email = newEmail;
        currentUser.phone = newPhone;

        document.getElementById('profileName').textContent = newName;
        document.getElementById('profileEmail').textContent = newEmail;

        showNotification('Profile updated successfully');
        cancelEditProfile();
    }
});

// Rating selector functionality
const stars = document.querySelectorAll('.star');
stars.forEach((star) => {
    star.addEventListener('click', function() {
        currentRating = parseInt(this.getAttribute('data-rating'));
        updateStarDisplay();
        updateReviewButton();
    });

    star.addEventListener('mouseover', function() {
        const rating = parseInt(this.getAttribute('data-rating'));
        highlightStars(rating);
    });
});

document.getElementById('ratingSelector').addEventListener('mouseleave', function() {
    updateStarDisplay();
});

function highlightStars(rating) {
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function updateStarDisplay() {
    highlightStars(currentRating);
}

function updateReviewButton() {
    const reviewBtn = document.getElementById('reviewSubmitBtn');
    const reviewText = document.getElementById('reviewText').value;

    reviewBtn.disabled = !(currentRating > 0 && reviewText.trim().length > 0);
}

// Review text area handler
document.getElementById('reviewText').addEventListener('input', updateReviewButton);

// Review form handler
document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (!currentUser) {
        showNotification('Please login to submit a review', 'error');
        showSection('login');
        return;
    }

    const reviewText = document.getElementById('reviewText').value;

    if (currentRating === 0) {
        showNotification('Please select a rating', 'error');
        return;
    }
    if (reviewText.trim().length === 0) {
        showNotification('Please write a review', 'error');
        return;
    }

    addReviewToList({
        user: currentUser.name,
        rating: currentRating,
        text: reviewText,
        date: new Date().toLocaleDateString('id-ID') // Format tanggal lokal
    });

    // Reset form
    document.getElementById('reviewForm').reset();
    currentRating = 0;
    updateStarDisplay();
    updateReviewButton();

    showNotification('Thank you for your review!');
});

// Add review to list
function addReviewToList(review) {
    const reviewsList = document.getElementById('reviewsList');
    let reviewsContainer = reviewsList.querySelector('.reviews-container');
    if (!reviewsContainer) {
        reviewsContainer = document.createElement('div');
        reviewsContainer.className = 'reviews-container';
        reviewsList.appendChild(reviewsContainer);
    }

    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-item';
    reviewElement.style.cssText = `
        background: #f8f9ff; padding: 1.5rem; border-radius: 10px;
        margin-bottom: 1rem; border-left: 4px solid #667eea;
    `;
    reviewElement.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <strong>${review.user}</strong>
            <span style="color: #666; font-size: 0.9rem;">${review.date}</span>
        </div>
        <div style="margin-bottom: 0.5rem; color: #ffc107;">
            ${'★'.repeat(review.rating)}<span style="color: #ddd;">${'★'.repeat(5 - review.rating)}</span>
        </div>
        <p>${review.text}</p>
    `;
    reviewsContainer.insertBefore(reviewElement, reviewsContainer.firstChild);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayDoctors(doctors);
    showSection('home'); // Pastikan halaman home aktif saat pertama dimuat

    addReviewToList({
        user: 'Sarah Wilson',
        rating: 5,
        text: 'Excellent service! The doctors are very professional and the booking system is so easy to use.',
        date: '28/07/2025'
    });
    addReviewToList({
        user: 'Mike Johnson',
        rating: 4,
        text: 'Great platform for finding doctors. Had a wonderful consultation experience.',
        date: '27/07/2025'
    });

    // --- [PERBAIKAN DIMULAI] ---
    // Menambahkan fungsionalitas pada link di navigasi utama
    const navContainer = document.querySelector('.nav-links');
    if (navContainer) {
        navContainer.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                let sectionId = e.target.getAttribute('href').substring(1);

                // Mapping untuk ID yang tidak konsisten
                if (sectionId === 'doctors') {
                    sectionId = 'doctor-search';
                }

                const targetSection = document.getElementById(sectionId);
                if (targetSection || sectionId === 'home') {
                    showSection(sectionId);
                } else {
                    showNotification(`Bagian '${sectionId}' belum tersedia.`, 'error');
                }
            }
        });
    }
    // --- [PERBAIKAN SELESAI] ---

    const style = document.createElement('style');
    style.textContent = `
        .error-message { display: block; color: #dc3545; font-size: 0.9rem; margin-top: 0.5rem; }
        .form-group input.error { border-color: #dc3545; }
        .reviews-container { margin-top: 2rem; }
        .review-item { transition: transform 0.2s ease; }
        .review-item:hover { transform: translateY(-2px); }
        /* Style untuk nav-link yang aktif */
        .nav-links a.active { background: #667eea; color: white; }
    `;
    document.head.appendChild(style);
});

// SEO and performance optimization
function optimizeForSEO() {
    const metaTags = [
        { name: 'description', content: 'StayHealthy - Your trusted medical care platform. Book appointments, consult with doctors, and manage your health online.' },
        { name: 'keywords', content: 'healthcare, medical, doctors, appointments, consultation, health, medical care' },
        { name: 'author', content: 'StayHealthy Team' },
        { property: 'og:title', content: 'StayHealthy - Medical Care Platform' },
        { property: 'og:description', content: 'Connect with qualified doctors and manage your healthcare journey online' },
        { property: 'og:type', content: 'website' }
    ];
    metaTags.forEach(tag => {
        const meta = document.createElement('meta');
        if (tag.name) meta.name = tag.name;
        if (tag.property) meta.property = tag.property;
        meta.content = tag.content;
        document.head.appendChild(meta);
    });
}

optimizeForSEO();