// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
    setupMobileMenu();
});

function setupContactForm() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Add real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
            
            // Format phone number
            if (input.id === 'phone') {
                formatPhoneNumber(input);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

function validateField(field) {
    const errorElement = field.nextElementSibling;
    let isValid = true;
    let errorMessage = '';
    
    // Reset error state
    field.classList.remove('error');
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = '';
    }
    
    // Required field validation
    if (field.required && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    
    // Phone validation (optional field)
    if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    
    // Message length validation
    if (field.id === 'message' && field.value && field.value.length < 10) {
        isValid = false;
        errorMessage = 'Please provide a more detailed message (at least 10 characters)';
    }
    
    // Display error if validation failed
    if (!isValid) {
        field.classList.add('error');
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = errorMessage;
        }
    }
    
    return isValid;
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate all fields
    let isFormValid = true;
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    // Also validate optional phone field if filled
    const phoneField = document.getElementById('phone');
    if (phoneField.value) {
        if (!validateField(phoneField)) {
            isFormValid = false;
        }
    }
    
    if (!isFormValid) {
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const messageData = {
        timestamp: new Date().toISOString(),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone') || 'Not provided',
        subject: formData.get('subject'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on',
        source: 'Contact Form'
    };
    
    // Simulate form submission
    setTimeout(() => {
        processContactForm(messageData);
        
        // Remove loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }, 2000);
}

function processContactForm(messageData) {
    // Save message to localStorage (in a real app, this would be sent to a server)
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push(messageData);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    // Show success modal
    showSuccessModal();
    
    // Optional: Send to admin notification system
    console.log('New contact message:', messageData);
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('show');
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            closeModal();
        }, 5000);
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const isOpen = answer.classList.contains('show');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-answer').classList.remove('show');
        item.querySelector('.faq-question').classList.remove('active');
    });
    
    // Toggle current item
    if (!isOpen) {
        answer.classList.add('show');
        button.classList.add('active');
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length <= 10) {
        if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/(\d{3})/, '($1)');
        }
    }
    input.value = value;
}

// Global functions
window.toggleFAQ = toggleFAQ;
window.closeModal = closeModal;