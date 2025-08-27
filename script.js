// Beauty Shop Product Data
const beautyShopData = {
    clothes: {
        name: "Clothes",
        icon: "👕",
        subcategories: {
            shirts: {
                name: "Shirts",
                icon: "👔",
                items: [
                    { id: "c1", name: "Casual Shirt", price: 45.00, stock: "50/100", icon: "👔" },
                    { id: "c2", name: "Formal Shirt", price: 65.00, stock: "30/80", icon: "👔" },
                    { id: "c3", name: "T-Shirt", price: 25.00, stock: "100/150", icon: "👕" },
                    { id: "c4", name: "Polo Shirt", price: 35.00, stock: "60/90", icon: "👕" }
                ]
            },
            dresses: {
                name: "Dresses",
                icon: "👗",
                items: [
                    { id: "c5", name: "Summer Dress", price: 85.00, stock: "25/50", icon: "👗" },
                    { id: "c6", name: "Evening Dress", price: 120.00, stock: "15/30", icon: "👗" },
                    { id: "c7", name: "Casual Dress", price: 55.00, stock: "40/70", icon: "👗" }
                ]
            },
            pants: {
                name: "Pants",
                icon: "👖",
                items: [
                    { id: "c8", name: "Jeans", price: 75.00, stock: "80/120", icon: "👖" },
                    { id: "c9", name: "Dress Pants", price: 90.00, stock: "35/60", icon: "👖" },
                    { id: "c10", name: "Casual Pants", price: 50.00, stock: "45/80", icon: "👖" }
                ]
            },
            jackets: {
                name: "Jackets",
                icon: "🧥",
                items: [
                    { id: "c11", name: "Leather Jacket", price: 150.00, stock: "20/40", icon: "🧥" },
                    { id: "c12", name: "Denim Jacket", price: 85.00, stock: "30/50", icon: "🧥" },
                    { id: "c13", name: "Blazer", price: 110.00, stock: "25/45", icon: "🧥" }
                ]
            }
        }
    },
    cosmetics: {
        name: "Cosmetics",
        icon: "💄",
        subcategories: {
            makeup: {
                name: "Makeup",
                icon: "💄",
                items: [
                    { id: "m1", name: "Lipstick", price: 25.00, stock: "100/200", icon: "💄" },
                    { id: "m2", name: "Foundation", price: 45.00, stock: "60/120", icon: "💄" },
                    { id: "m3", name: "Mascara", price: 30.00, stock: "80/150", icon: "💄" },
                    { id: "m4", name: "Eyeshadow", price: 35.00, stock: "70/130", icon: "💄" },
                    { id: "m5", name: "Blush", price: 28.00, stock: "50/100", icon: "💄" }
                ]
            },
            skincare: {
                name: "Skincare",
                icon: "🧴",
                items: [
                    { id: "s1", name: "Moisturizer", price: 40.00, stock: "75/140", icon: "🧴" },
                    { id: "s2", name: "Cleanser", price: 35.00, stock: "90/160", icon: "🧴" },
                    { id: "s3", name: "Sunscreen", price: 30.00, stock: "65/120", icon: "🧴" },
                    { id: "s4", name: "Serum", price: 55.00, stock: "40/80", icon: "🧴" }
                ]
            },
            perfume: {
                name: "Perfume",
                icon: "🌸",
                items: [
                    { id: "p1", name: "Floral Perfume", price: 85.00, stock: "30/60", icon: "🌸" },
                    { id: "p2", name: "Citrus Perfume", price: 75.00, stock: "25/50", icon: "🌸" },
                    { id: "p3", name: "Woody Perfume", price: 95.00, stock: "20/40", icon: "🌸" }
                ]
            },
            haircare: {
                name: "Hair Care",
                icon: "🧴",
                items: [
                    { id: "h1", name: "Shampoo", price: 25.00, stock: "120/200", icon: "🧴" },
                    { id: "h2", name: "Conditioner", price: 28.00, stock: "110/180", icon: "🧴" },
                    { id: "h3", name: "Hair Mask", price: 45.00, stock: "40/80", icon: "🧴" }
                ]
            }
        }
    },
    shoes: {
        name: "Shoes",
        icon: "👠",
        subcategories: {
            heels: {
                name: "Heels",
                icon: "👠",
                items: [
                    { id: "sh1", name: "Stiletto Heels", price: 120.00, stock: "25/50", icon: "👠" },
                    { id: "sh2", name: "Block Heels", price: 95.00, stock: "30/60", icon: "👠" },
                    { id: "sh3", name: "Wedges", price: 85.00, stock: "35/70", icon: "👠" }
                ]
            },
            sneakers: {
                name: "Sneakers",
                icon: "👟",
                items: [
                    { id: "sn1", name: "Running Shoes", price: 110.00, stock: "50/100", icon: "👟" },
                    { id: "sn2", name: "Casual Sneakers", price: 75.00, stock: "80/150", icon: "👟" },
                    { id: "sn3", name: "Athletic Shoes", price: 95.00, stock: "45/90", icon: "👟" }
                ]
            },
            flats: {
                name: "Flats",
                icon: "🥿",
                items: [
                    { id: "sf1", name: "Ballet Flats", price: 65.00, stock: "40/80", icon: "🥿" },
                    { id: "sf2", name: "Loafers", price: 85.00, stock: "30/60", icon: "🥿" },
                    { id: "sf3", name: "Sandals", price: 55.00, stock: "60/120", icon: "🥿" }
                ]
            },
            boots: {
                name: "Boots",
                icon: "👢",
                items: [
                    { id: "sb1", name: "Ankle Boots", price: 130.00, stock: "25/50", icon: "👢" },
                    { id: "sb2", name: "Knee Boots", price: 150.00, stock: "20/40", icon: "👢" },
                    { id: "sb3", name: "Chelsea Boots", price: 110.00, stock: "30/60", icon: "👢" }
                ]
            }
        }
    }
};

// Application state
let cart = [];
let currentCategory = 'clothes';
let currentSubcategory = null;
let currentPage = 1;
let itemsPerPage = 8;

// DOM elements
const categoryGrid = document.getElementById('categoryGrid');
const productGrid = document.getElementById('productGrid');
const cartList = document.getElementById('cartList');
const totalItemsElement = document.getElementById('totalItems');
const totalPayableElement = document.getElementById('totalPayable');
const discountElement = document.getElementById('discount');
const shippingElement = document.getElementById('shipping');
const grandTotalElement = document.getElementById('grandTotal');
const searchInput = document.querySelector('.search-bar input');
const tabButtons = document.querySelectorAll('.tab-btn');
const cancelBtn = document.getElementById('cancelBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

// Initialize the application
function init() {
    console.log('Initializing application...');
    console.log('Cancel button:', cancelBtn);
    console.log('Checkout button:', checkoutBtn);
    
    renderCategories();
    setupEventListeners();
    updateCartDisplay();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Tab switching
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.tab;
            currentSubcategory = null;
            currentPage = 1;
            renderCategories();
        });
    });
    
    // Cart action buttons
    if (cancelBtn) {
        cancelBtn.addEventListener('click', handleCancel);
        console.log('Cancel button event listener added');
    } else {
        console.error('Cancel button not found!');
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
        console.log('Checkout button event listener added');
    } else {
        console.error('Checkout button not found!');
    }
    
    // Clear search
    document.querySelector('.search-bar .fa-times').addEventListener('click', clearSearch);
}

// Render categories
function renderCategories() {
    const category = beautyShopData[currentCategory];
    categoryGrid.innerHTML = '';
    productGrid.style.display = 'none';
    categoryGrid.style.display = 'grid';
    
    Object.entries(category.subcategories).forEach(([key, subcategory]) => {
        const categoryCard = createCategoryCard(key, subcategory);
        categoryGrid.appendChild(categoryCard);
    });
}

// Create category card
function createCategoryCard(key, subcategory) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
        <div class="category-icon">${subcategory.icon}</div>
        <div class="category-name">${subcategory.name}</div>
        <div class="category-count">${subcategory.items.length} items</div>
        <button class="add-category-btn">View Products</button>
    `;
    
    card.querySelector('.add-category-btn').addEventListener('click', () => {
        currentSubcategory = key;
        renderProducts();
    });
    
    return card;
}

// Render products
function renderProducts() {
    const subcategory = beautyShopData[currentCategory].subcategories[currentSubcategory];
    const filteredProducts = filterProducts(subcategory.items);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    categoryGrid.style.display = 'none';
    productGrid.style.display = 'grid';
    productGrid.innerHTML = '';
    
    // Remove any existing back button first
    const existingBackBtn = document.querySelector('.back-button');
    if (existingBackBtn) {
        existingBackBtn.remove();
    }
    
    // Add back button
    const backBtn = document.createElement('div');
    backBtn.className = 'back-button';
    backBtn.innerHTML = `
        <button onclick="goBackToCategories()" style="
            background: #27ae60;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            margin-bottom: 20px;
            font-weight: 500;
        ">
            <i class="fas fa-arrow-left"></i> Back to ${beautyShopData[currentCategory].name}
        </button>
    `;
    productGrid.parentNode.insertBefore(backBtn, productGrid);
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
    
    updatePagination(filteredProducts.length);
}

// Go back to categories
function goBackToCategories() {
    currentSubcategory = null;
    currentPage = 1;
    renderCategories();
    const backBtn = document.querySelector('.back-button');
    if (backBtn) backBtn.remove();
}

// Filter products based on search
function filterProducts(products) {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        return products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }
    return products;
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const cartItem = cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    
    // Calculate remaining stock
    const stockInfo = product.stock.split('/');
    const currentStock = parseInt(stockInfo[0]);
    const totalStock = parseInt(stockInfo[1]);
    const remainingStock = currentStock - quantity;
    
    card.innerHTML = `
        <div class="product-actions">
            <button class="product-action-btn add-product-btn" onclick="addToCart('${product.id}')" ${remainingStock <= 0 ? 'disabled' : ''}>
                <i class="fas fa-plus"></i>
            </button>
            ${quantity > 0 ? `
                <button class="product-action-btn remove-product-btn" onclick="removeFromCart('${product.id}')">
                    <i class="fas fa-minus"></i>
                </button>
            ` : ''}
        </div>
        <div class="product-image">${product.icon}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="product-stock">Stock: ${remainingStock}/${totalStock}</div>
        ${quantity > 0 ? `<div class="product-quantity">In Cart: ${quantity}</div>` : ''}
    `;
    
    return card;
}

// Add to cart
function addToCart(productId) {
    const product = findProductById(productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    
    // Check stock availability
    const stockInfo = product.stock.split('/');
    const totalStock = parseInt(stockInfo[1]);
    
    if (currentQuantity >= totalStock) {
        showNotification('No more stock available!', 'error');
        return;
    }
    
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.subtotal = existingItem.price * existingItem.quantity;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            subtotal: product.price
        });
    }
    
    updateCartDisplay();
    if (currentSubcategory) {
        renderProducts(); // Refresh product display to show updated quantities
    }
    showNotification(`${product.name} added to cart`);
}

// Remove from cart
function removeFromCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
            existingItem.subtotal = existingItem.price * existingItem.quantity;
        } else {
            cart = cart.filter(item => item.id !== productId);
        }
        
        updateCartDisplay();
        if (currentSubcategory) {
            renderProducts(); // Refresh product display to show updated quantities
        }
        showNotification('Item updated in cart');
    }
}

// Find product by ID
function findProductById(productId) {
    for (const category of Object.values(beautyShopData)) {
        for (const subcategory of Object.values(category.subcategories)) {
            const product = subcategory.items.find(item => item.id === productId);
            if (product) return product;
        }
    }
    return null;
}

// Update cart display
function updateCartDisplay() {
    cartList.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = createCartItem(item);
        cartList.appendChild(cartItem);
    });
    
    updateOrderSummary();
}

// Create cart item
function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
        </div>
        <div class="cart-item-subtotal">$${item.subtotal.toFixed(2)}</div>
        <div class="remove-item" onclick="removeItemFromCart('${item.id}')">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    return cartItem;
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItemFromCart(productId);
        } else {
            item.subtotal = item.price * item.quantity;
            updateCartDisplay();
            if (currentSubcategory) {
                renderProducts();
            }
        }
    }
}

// Remove item completely from cart
function removeItemFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    if (currentSubcategory) {
        renderProducts();
    }
    showNotification('Item removed from cart');
}

// Update order summary
function updateOrderSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPayable = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = 0; // Can be implemented with discount logic
    const shipping = 0; // Can be implemented with shipping logic
    const grandTotal = totalPayable - discount + shipping;
    
    totalItemsElement.textContent = totalItems;
    totalPayableElement.textContent = `$${totalPayable.toFixed(2)}`;
    discountElement.textContent = `$${discount.toFixed(2)}`;
    shippingElement.textContent = `$${shipping.toFixed(2)}`;
    grandTotalElement.textContent = `$${grandTotal.toFixed(2)}`;
}

// Handle search
function handleSearch() {
    if (currentSubcategory) {
        currentPage = 1;
        renderProducts();
    }
}

// Clear search
function clearSearch() {
    searchInput.value = '';
    if (currentSubcategory) {
        currentPage = 1;
        renderProducts();
    }
}

// Update pagination
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.querySelector('.pagination');
    
    // Update page buttons
    const pageButtons = pagination.querySelectorAll('.page-btn:not(:first-child):not(:last-child)');
    pageButtons.forEach((btn, index) => {
        const pageNum = index + 1;
        btn.textContent = pageNum;
        btn.classList.toggle('active', pageNum === currentPage);
        btn.style.display = pageNum <= totalPages ? 'block' : 'none';
    });
    
    // Update navigation buttons
    const prevBtn = pagination.querySelector('.fa-chevron-left').parentElement;
    const nextBtn = pagination.querySelector('.fa-chevron-right').parentElement;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Add click handlers
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
        }
    };
    
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
        }
    };
    
    // Add page number click handlers
    pageButtons.forEach((btn, index) => {
        btn.onclick = () => {
            currentPage = index + 1;
            renderProducts();
        };
    });
}

// Handle cancel
function handleCancel() {
    if (cart.length === 0) {
        showNotification('Cart is already empty!', 'info');
        return;
    }
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (confirm(`Cancel Order\n\nAre you sure you want to remove all ${totalItems} items from the cart?\n\nThis action cannot be undone.`)) {
        cart = [];
        updateCartDisplay();
        if (currentSubcategory) {
            renderProducts();
        }
        showNotification('All items removed from cart', 'info');
        
        // Reset customer selection
        document.getElementById('customer').value = '';
    }
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Cart is empty!', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const customer = document.getElementById('customer').value || 'Walk-in Customer';
    
    // Show payment confirmation dialog
    if (confirm(`Confirm Payment\n\nCustomer: ${customer}\nTotal Amount: $${total.toFixed(2)}\n\nProceed with payment?`)) {
        // Simulate payment processing
        showNotification('Processing payment...', 'info');
        
        // Disable checkout button during processing
        const checkoutBtn = document.getElementById('checkoutBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        checkoutBtn.disabled = true;
        cancelBtn.disabled = true;
        checkoutBtn.textContent = 'Processing...';
        
        setTimeout(() => {
            // Generate receipt
            generateReceipt();
            
            // Show success message
            showNotification(`Payment successful! Total: $${total.toFixed(2)}`, 'success');
            
            // Clear cart
            cart = [];
            updateCartDisplay();
            if (currentSubcategory) {
                renderProducts();
            }
            
            // Re-enable buttons
            checkoutBtn.disabled = false;
            cancelBtn.disabled = false;
            checkoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Process Payment';
            
            // Reset customer selection
            document.getElementById('customer').value = '';
            
        }, 2000);
    }
}

// Generate receipt
function generateReceipt() {
    const receipt = {
        date: new Date().toLocaleString(),
        items: cart,
        total: cart.reduce((sum, item) => sum + item.subtotal, 0),
        customer: document.getElementById('customer').value || 'Walk-in Customer'
    };
    
    console.log('Receipt:', receipt);
    
    // Create a formatted receipt for display
    let receiptText = `
=== BEAUTY SHOP RECEIPT ===
Date: ${receipt.date}
Customer: ${receipt.customer}
Transaction ID: ${generateTransactionId()}

ITEMS:
`;
    
    receipt.items.forEach(item => {
        receiptText += `${item.name} x${item.quantity} - $${item.subtotal.toFixed(2)}\n`;
    });
    
    receiptText += `
TOTAL: $${receipt.total.toFixed(2)}
========================
Thank you for your purchase!
`;
    
    // Show receipt in alert (in real app, this would be sent to printer)
    alert(receiptText);
    
    // In a real application, you would send this to a printer or save to database
}

// Generate transaction ID
function generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TXN-${timestamp}-${random}`;
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
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
    
    .product-quantity {
        font-size: 0.8rem;
        color: #27ae60;
        font-weight: 600;
        margin-top: 5px;
    }
    
    .back-button {
        grid-column: 1 / -1;
        margin-bottom: 20px;
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
