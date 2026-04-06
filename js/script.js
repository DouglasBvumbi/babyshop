// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [
    // Clothing
    {
        id: 1,
        name: "Huggies® Baby Diapers",
        category: "bath-care",
        price: 9.99,
        description: "uniquely perfect line of diapers for your bundle of joy ",
        image: "https://www.huggies.co.za/-/media/feature/huggies/emea/za/product/plp-images/plp-daiper/plp_diapers_hero.jpg?rev=-1&cx=0&cy=0&cw=648&ch=548&hash=49E9CCA0CACB787DF5FA02315573A6B7"
    },
    {
        id: 2,
        name: "Aveeno Baby Dermexa Emollient Cream",
        category: "bath-care",
        price: 2.99,
        description: "Cozy sleep suit with foot covers to keep your baby warm and comfortable all night long.",
        image: "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/K79432s.jpg?im=Resize,width=750"
    },
    {
        id: 3,
        name: "Johnson's Baby Bedtime Petroleum Jelly",
        category: "bath-care",
        price: 28.50,
        description: "Johnson's baby bedtime petroleum jelly has natural calm aromas and proven to help your baby sleep better. ",
        image: "https://www.woolworths.co.za/images/elasticera/products/hero/2013-08-02/6003001008536_hero.jpg"
    },
    
    // Toys
    {
        id: 4,
        name: "Soft Plush Bear",
        category: "toys",
        price: 19.99,
        description: "Ultra-soft plush bear made from hypoallergenic materials. Perfect companion for your little one.",
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop"
    },
    {
        id: 5,
        name: "Musical Mobile",
        category: "toys",
        price: 45.99,
        description: "Soothing musical mobile with gentle melodies and colorful hanging toys to entertain your baby.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
    },
    {
        id: 6,
        name: "Teething Rings",
        category: "toys",
        price: 15.99,
        description: "Safe silicone teething rings to soothe sore gums during teething phase. BPA-free and easy to clean.",
        image: "https://images.unsplash.com/photo-1607107881226-bb37a1b20985?w=400&h=400&fit=crop"
    },
    
    // Feeding
    {
        id: 7,
        name: "Baby Bottle Set",
        category: "feeding",
        price: 39.99,
        description: "Complete bottle set with anti-colic design. Includes 4 bottles of different sizes.",
        image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop"
    },
    {
        id: 8,
        name: "High Chair",
        category: "feeding",
        price: 129.99,
        description: "Adjustable high chair with safety harness and removable tray. Grows with your child.",
        image: "https://images.unsplash.com/photo-1586040140378-b5d5c1f44c26?w=400&h=400&fit=crop"
    },
    {
        id: 9,
        name: "Silicone Bib Set",
        category: "feeding",
        price: 22.99,
        description: "Waterproof silicone bibs with food catch pocket. Easy to clean and dishwasher safe.",
        image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=400&fit=crop"
    },
    
    // Accessories
    {
        id: 10,
        name: "Diaper Bag",
        category: "accessories",
        price: 79.99,
        description: "Spacious diaper bag with multiple compartments and insulated bottle holders.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"
    },
    {
        id: 11,
        name: "Baby Blanket",
        category: "accessories",
        price: 34.99,
        description: "Luxuriously soft baby blanket made from premium bamboo fiber. Naturally antibacterial.",
        image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=400&h=400&fit=crop"
    },
    {
        id: 12,
        name: "Baby Monitor",
        category: "accessories",
        price: 89.99,
        description: "Digital baby monitor with crystal clear audio and long-range coverage for peace of mind.",
        image: "https://images.unsplash.com/photo-1583641440043-ce7c0c113769?w=400&h=400&fit=crop"
    },
    
    // Bath & Care
    {
        id: 13,
        name: "Baby Bath Tub",
        category: "bath-care",
        price: 55.99,
        description: "Ergonomic baby bath tub with non-slip bottom and temperature indicator for safe bathing.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop"
    },
    {
        id: 14,
        name: "Gentle Shampoo",
        category: "bath-care",
        price: 18.99,
        description: "Tear-free gentle shampoo formulated specifically for baby's delicate scalp and hair.",
        image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop"
    },
    {
        id: 15,
        name: "Hooded Towel Set",
        category: "bath-care",
        price: 29.99,
        description: "Super absorbent hooded towel set made from organic cotton. Keeps baby warm after bath time.",
        image: "https://images.unsplash.com/photo-1631449820327-ae2b5cdffd33?w=400&h=400&fit=crop"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadProducts();
    updateCartCount();
    setupEventListeners();
    
    // Load saved products from localStorage if available
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
        loadProducts();
    }
}

function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Hero button functionality
    const heroShopBtn = document.querySelector('.hero-buttons .btn-primary');
    if (heroShopBtn) {
        heroShopBtn.addEventListener('click', () => scrollToSection('products'));
    }
    
    const heroContactBtn = document.querySelector('.hero-buttons .btn-secondary');
    if (heroContactBtn) {
        heroContactBtn.addEventListener('click', () => {
            window.location.href = 'pages/contact.html';
        });
    }
}

function loadProducts(category = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    const filteredProducts = category === 'all' ? products : products.filter(product => product.category === category);
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <p>No products found in this category.</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card show';
    card.setAttribute('data-category', product.category);
    
    card.innerHTML = `
        <div class="product-image">
            ${product.image ? 
                `<img src="${product.image}" alt="${product.name}">` : 
                `<div class="product-placeholder">
                    <i class="fas fa-baby"></i>
                    <p>Product Image</p>
                </div>`
            }
        </div>
        <div class="product-info">
            <div class="product-category">${formatCategory(product.category)}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    return card;
}

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

function filterProducts(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Hide all products first
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.classList.remove('show');
        setTimeout(() => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.classList.add('show');
            }
        }, 100);
    });
    
    // Reload products with filter
    setTimeout(() => {
        loadProducts(category);
    }, 200);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    updateCartCount();
    saveCart();
    showAddToCartFeedback(product.name);
}

function showAddToCartFeedback(productName) {
    // Create and show a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${productName} added to cart!
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('show');
        loadCartItems();
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function loadCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <p>Add some products to get started!</p>
            </div>
        `;
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                ${item.image ? 
                    `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">` : 
                    `<i class="fas fa-baby"></i>`
                }
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="setQuantity(${item.id}, this.value)">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            loadCartItems();
            saveCart();
        }
    }
}

function setQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const newQuantity = parseInt(quantity);
        if (newQuantity > 0) {
            item.quantity = newQuantity;
            updateCartCount();
            loadCartItems();
            saveCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    loadCartItems();
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function goToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Save cart to localStorage for checkout page
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
    window.location.href = 'pages/checkout.html';
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Admin functionality for product management
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function addProduct(productData) {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct = {
        id: newId,
        ...productData
    };
    products.push(newProduct);
    saveProducts();
    loadProducts();
}

function editProduct(id, productData) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { id, ...productData };
        saveProducts();
        loadProducts();
    }
}

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    saveProducts();
    loadProducts();
}

function getProduct(id) {
    return products.find(p => p.id === id);
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .no-products {
        grid-column: 1 / -1;
        text-align: center;
        padding: 2rem;
        color: var(--text-light);
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.filterProducts = filterProducts;
window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.updateQuantity = updateQuantity;
window.setQuantity = setQuantity;
window.removeFromCart = removeFromCart;
window.goToCheckout = goToCheckout;
window.scrollToSection = scrollToSection;
window.addProduct = addProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.getProduct = getProduct;