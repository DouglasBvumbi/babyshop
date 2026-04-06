// Admin page functionality
let currentEditingProductId = null;
let currentDeleteProductId = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    setupMobileMenu();
});

function initializeAdmin() {
    loadDashboardStats();
    loadProductsTable();
    loadOrdersTable();
    loadMessagesTable();
    loadAnalytics();
    setupProductForm();
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

function loadDashboardStats() {
    // Load products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    // Calculate revenue from orders
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totals ? order.totals.total : 0), 0);
    
    // Update dashboard stats
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalMessages').textContent = messages.length;
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to selected tab button
    event.target.classList.add('active');
    
    // Load data for the selected tab
    switch (tabName) {
        case 'products':
            loadProductsTable();
            break;
        case 'orders':
            loadOrdersTable();
            break;
        case 'messages':
            loadMessagesTable();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

function setupProductForm() {
    const form = document.getElementById('productForm');
    form.addEventListener('submit', handleProductSubmission);
}

function showAddProductForm() {
    document.getElementById('formTitle').textContent = 'Add New Product';
    document.getElementById('submitText').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    currentEditingProductId = null;
    document.getElementById('productFormContainer').classList.add('show');
}

function hideProductForm() {
    document.getElementById('productFormContainer').classList.remove('show');
    // Clear any error states
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

function handleProductSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateProductForm(form)) {
        return;
    }
    
    const productData = {
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        description: formData.get('description'),
        image: formData.get('image') || null,
        stock: parseInt(formData.get('stock')) || 0
    };
    
    if (currentEditingProductId) {
        // Update existing product
        editProduct(currentEditingProductId, productData);
    } else {
        // Add new product
        addProduct(productData);
    }
    
    hideProductForm();
    loadProductsTable();
    loadDashboardStats();
    loadAnalytics();
}

function validateProductForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            const errorElement = field.nextElementSibling;
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.textContent = 'This field is required';
            }
        }
    });
    
    // Validate price
    const priceField = document.getElementById('productPrice');
    if (priceField.value && parseFloat(priceField.value) <= 0) {
        isValid = false;
        priceField.classList.add('error');
        const errorElement = priceField.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = 'Price must be greater than 0';
        }
    }
    
    return isValid;
}

function loadProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <i class="fas fa-box"></i>
                    <h3>No Products Found</h3>
                    <p>Add your first product to get started</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                <div class="product-cell">
                    <div class="product-image-cell">
                        ${product.image ? 
                            `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">` : 
                            `<i class="fas fa-baby"></i>`
                        }
                    </div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-description" title="${product.description}">${product.description}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="category-badge">${formatCategory(product.category)}</span>
            </td>
            <td class="price-cell">$${product.price.toFixed(2)}</td>
            <td class="stock-cell">
                <span class="${getStockClass(product.stock)}">
                    ${product.stock || 0} units
                </span>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="btn-icon btn-edit" onclick="editProductForm(${product.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="showDeleteConfirmation(${product.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>No Orders Found</h3>
                    <p>Orders will appear here when customers make purchases</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>#${order.orderId}</strong></td>
            <td>${order.customer.firstName} ${order.customer.lastName}</td>
            <td>${new Date(order.timestamp).toLocaleDateString()}</td>
            <td class="price-cell">$${order.totals.total.toFixed(2)}</td>
            <td><span class="category-badge">Completed</span></td>
            <td>
                <div class="actions-cell">
                    <button class="btn-icon btn-view" onclick="showOrderDetails('${order.orderId}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadMessagesTable() {
    const container = document.getElementById('messagesContainer');
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    if (messages.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-envelope"></i>
                <h3>No Messages Found</h3>
                <p>Customer messages will appear here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = messages.map(message => `
        <div class="message-card">
            <div class="message-header">
                <div class="message-info">
                    <h4>${message.firstName} ${message.lastName}</h4>
                    <div class="message-meta">
                        ${message.email} • ${new Date(message.timestamp).toLocaleDateString()}
                    </div>
                </div>
                <span class="message-subject">${message.subject}</span>
            </div>
            <div class="message-content">
                ${message.message}
            </div>
        </div>
    `).join('');
}

function loadAnalytics() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Category statistics
    const categoryStats = {};
    products.forEach(product => {
        categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
    });
    
    const categoryContainer = document.getElementById('categoryStats');
    categoryContainer.innerHTML = Object.entries(categoryStats).map(([category, count]) => `
        <div class="category-stat">
            <span class="category-name">${formatCategory(category)}</span>
            <span class="category-count">${count}</span>
        </div>
    `).join('') || '<div class="empty-state">No category data available</div>';
    
    // Activity feed
    const activityFeed = document.getElementById('activityFeed');
    const activities = [
        { icon: 'fas fa-box', text: `${products.length} products in inventory`, time: 'Current' },
        { icon: 'fas fa-shopping-bag', text: `${orders.length} orders received`, time: 'Total' },
        { icon: 'fas fa-chart-line', text: 'Analytics updated', time: 'Just now' }
    ];
    
    activityFeed.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-info">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

function editProductForm(productId) {
    const product = getProduct(productId);
    if (!product) return;
    
    currentEditingProductId = productId;
    
    document.getElementById('formTitle').textContent = 'Edit Product';
    document.getElementById('submitText').textContent = 'Update Product';
    
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productImage').value = product.image || '';
    document.getElementById('productStock').value = product.stock || 0;
    
    document.getElementById('productFormContainer').classList.add('show');
}

function showDeleteConfirmation(productId) {
    currentDeleteProductId = productId;
    document.getElementById('deleteModal').classList.add('show');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    currentDeleteProductId = null;
}

function confirmDelete() {
    if (currentDeleteProductId) {
        deleteProduct(currentDeleteProductId);
        loadProductsTable();
        loadDashboardStats();
        loadAnalytics();
        closeDeleteModal();
    }
}

function showOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) return;
    
    const modalBody = document.getElementById('orderModalBody');
    modalBody.innerHTML = `
        <div class="order-details">
            <div class="order-section">
                <h4>Customer Information</h4>
                <div class="order-info">
                    <p><strong>Name:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
                    <p><strong>Email:</strong> ${order.customer.email}</p>
                    <p><strong>Phone:</strong> ${order.customer.phone}</p>
                </div>
            </div>
            <div class="order-section">
                <h4>Delivery Address</h4>
                <div class="order-info">
                    <p>${order.address.street}</p>
                    ${order.address.apartment ? `<p>${order.address.apartment}</p>` : ''}
                    <p>${order.address.city}, ${order.address.state} ${order.address.zipCode}</p>
                    <p>${order.address.country}</p>
                </div>
            </div>
            <div class="order-section">
                <h4>Order Items</h4>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span class="item-name">${item.name} (x${item.quantity})</span>
                            <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <div>Subtotal: $${order.totals.subtotal.toFixed(2)}</div>
                    <div>Shipping: $${order.totals.shipping.toFixed(2)}</div>
                    <div>Tax: $${order.totals.tax.toFixed(2)}</div>
                    <div><strong>Total: $${order.totals.total.toFixed(2)}</strong></div>
                </div>
            </div>
            <div class="order-section">
                <h4>Payment & Notes</h4>
                <div class="order-info">
                    <p><strong>Payment Method:</strong> ${formatPaymentMethod(order.paymentMethod)}</p>
                    <p><strong>Order Date:</strong> ${new Date(order.timestamp).toLocaleDateString()}</p>
                    ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('orderModal').classList.add('show');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('show');
}

// Utility functions
function formatCategory(category) {
    const categoryMap = {
        'clothing': 'Clothing',
        'toys': 'Toys',
        'feeding': 'Feeding',
        'accessories': 'Accessories',
        'bath-care': 'Bath & Care'
    };
    return categoryMap[category] || category;
}

function getStockClass(stock) {
    if (stock === 0) return 'stock-low';
    if (stock < 10) return 'stock-medium';
    return 'stock-high';
}

function formatPaymentMethod(method) {
    const methodMap = {
        'creditCard': 'Credit/Debit Card',
        'paypal': 'PayPal',
        'applePay': 'Apple Pay',
        'googlePay': 'Google Pay'
    };
    return methodMap[method] || method;
}

// Global functions
window.showTab = showTab;
window.showAddProductForm = showAddProductForm;
window.hideProductForm = hideProductForm;
window.editProductForm = editProductForm;
window.showDeleteConfirmation = showDeleteConfirmation;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.showOrderDetails = showOrderDetails;
window.closeOrderModal = closeOrderModal;