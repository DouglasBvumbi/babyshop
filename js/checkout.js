// Checkout page functionality
let checkoutCart = [];
let subtotal = 0;
let shipping = 5.99;
let tax = 0;
let total = 0;

document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
    setupFormValidation();
    setupPaymentMethods();
    setupMobileMenu();
});

function initializeCheckout() {
    // Load cart from localStorage
    const cartData = localStorage.getItem('checkoutCart');
    if (cartData) {
        checkoutCart = JSON.parse(cartData);
    } else {
        // Fallback to regular cart if checkoutCart is not available
        const regularCart = localStorage.getItem('cart');
        if (regularCart) {
            checkoutCart = JSON.parse(regularCart);
        }
    }
    
    if (checkoutCart.length === 0) {
        // Redirect to home if cart is empty
        alert('Your cart is empty. Redirecting to homepage.');
        window.location.href = '../index.html';
        return;
    }
    
    loadOrderSummary();
    calculateTotals();
    
    // Set up form auto-fill from localStorage if available
    loadSavedFormData();
}

function loadOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    if (!orderItems) return;
    
    orderItems.innerHTML = '';
    
    checkoutCart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-image">
                ${item.image ? 
                    `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">` : 
                    `<i class="fas fa-baby"></i>`
                }
            </div>
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        `;
        orderItems.appendChild(orderItem);
    });
}

function calculateTotals() {
    subtotal = checkoutCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    tax = subtotal * 0.08; // 8% tax rate
    total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('finalTotal').textContent = `$${total.toFixed(2)}`;
}

function setupFormValidation() {
    const form = document.getElementById('checkoutForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Add real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
            
            // Special formatting for certain fields
            if (input.id === 'cardNumber') {
                formatCardNumber(input);
            } else if (input.id === 'expiryDate') {
                formatExpiryDate(input);
            } else if (input.id === 'phone') {
                formatPhoneNumber(input);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
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
    
    // Phone validation
    if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    
    // Card number validation (when credit card is selected)
    if (field.id === 'cardNumber' && isPaymentMethodSelected('creditCard') && field.value) {
        if (!isValidCardNumber(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid card number';
        }
    }
    
    // Expiry date validation
    if (field.id === 'expiryDate' && isPaymentMethodSelected('creditCard') && field.value) {
        if (!isValidExpiryDate(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid expiry date (MM/YY)';
        }
    }
    
    // CVV validation
    if (field.id === 'cvv' && isPaymentMethodSelected('creditCard') && field.value) {
        if (!isValidCVV(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid CVV';
        }
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

function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardDetails = document.getElementById('creditCardDetails');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'creditCard') {
                creditCardDetails.classList.remove('hidden');
                // Make credit card fields required
                creditCardDetails.querySelectorAll('input').forEach(input => {
                    if (['cardNumber', 'expiryDate', 'cvv', 'cardholderName'].includes(input.id)) {
                        input.required = true;
                    }
                });
            } else {
                creditCardDetails.classList.add('hidden');
                // Remove required from credit card fields
                creditCardDetails.querySelectorAll('input').forEach(input => {
                    input.required = false;
                    input.classList.remove('error');
                    const errorElement = input.nextElementSibling;
                    if (errorElement && errorElement.classList.contains('error-message')) {
                        errorElement.textContent = '';
                    }
                });
            }
        });
    });
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate all fields
    let isFormValid = true;
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    // Check terms acceptance
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        isFormValid = false;
        const errorElement = termsCheckbox.closest('.checkbox-group').querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = 'You must accept the terms and conditions';
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
    submitButton.classList.add('btn-loading');
    submitButton.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const orderData = {
        orderId: generateOrderId(),
        timestamp: new Date().toISOString(),
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        address: {
            street: formData.get('address1'),
            apartment: formData.get('address2'),
            city: formData.get('city'),
            state: formData.get('state'),
            zipCode: formData.get('zipCode'),
            country: formData.get('country')
        },
        paymentMethod: formData.get('paymentMethod'),
        items: checkoutCart,
        totals: {
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: total
        },
        notes: formData.get('orderNotes') || '',
        newsletter: formData.get('newsletter') === 'on'
    };
    
    // Save form data for future use
    saveFormData(formData);
    
    // Simulate order processing
    setTimeout(() => {
        processOrder(orderData);
    }, 2000);
}

function processOrder(orderData) {
    // Save order to localStorage (in a real app, this would be sent to a server)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('cart');
    localStorage.removeItem('checkoutCart');
    
    // Show success modal
    showSuccessModal(orderData.orderId);
    
    // Remove loading state
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.classList.remove('btn-loading');
    submitButton.disabled = false;
}

function showSuccessModal(orderId) {
    const modal = document.getElementById('successModal');
    const orderIdElement = document.getElementById('orderId');
    
    if (orderIdElement) {
        orderIdElement.textContent = `#${orderId}`;
    }
    
    if (modal) {
        modal.classList.add('show');
    }
}

function generateOrderId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${timestamp}${random}`;
}

function saveFormData(formData) {
    const savedData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address1: formData.get('address1'),
        address2: formData.get('address2'),
        city: formData.get('city'),
        state: formData.get('state'),
        zipCode: formData.get('zipCode'),
        country: formData.get('country')
    };
    
    localStorage.setItem('savedFormData', JSON.stringify(savedData));
}

function loadSavedFormData() {
    const savedData = localStorage.getItem('savedFormData');
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const field = document.getElementById(key);
            if (field && data[key]) {
                field.value = data[key];
            }
        });
    } catch (error) {
        console.log('Error loading saved form data:', error);
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

function isValidCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleanNumber);
}

function isValidExpiryDate(expiryDate) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month));
    const today = new Date();
    
    return expiry > today;
}

function isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

function isPaymentMethodSelected(method) {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
    return selectedMethod && selectedMethod.value === method;
}

function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    if (formattedValue.length <= 19) {
        input.value = formattedValue;
    }
}

function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
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
function goBack() {
    window.history.back();
}

function goToHome() {
    window.location.href = '../index.html';
}

function printReceipt() {
    window.print();
}