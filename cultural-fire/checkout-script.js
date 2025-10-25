// Checkout Page Functionality

let selectedOrderType = null;
const TAX_RATE = 0.085;
const DELIVERY_FEE = 3.99;

// Load cart and display
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
                <button class="btn btn-outline" onclick="window.location.href='menu.html'">
                    Browse Menu
                </button>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="item-quantity">Quantity: ${item.quantity}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="item-remove" onclick="removeCartItem(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    updateTotals();
}

// Remove item from cart
function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Update totals
function updateTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const deliveryFee = selectedOrderType === 'delivery' ? DELIVERY_FEE : 0;
    const total = subtotal + tax + deliveryFee;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Show/hide delivery fee
    const deliveryFeeRow = document.querySelector('.delivery-fee');
    if (selectedOrderType === 'delivery') {
        deliveryFeeRow.style.display = 'flex';
    } else {
        deliveryFeeRow.style.display = 'none';
    }
}

// Order type selection
const orderTypeCards = document.querySelectorAll('.order-type-card');
orderTypeCards.forEach(card => {
    card.addEventListener('click', function() {
        // Remove selected class from all cards
        orderTypeCards.forEach(c => c.classList.remove('selected'));
        // Add selected class to clicked card
        this.classList.add('selected');
        
        selectedOrderType = this.dataset.type;
        
        // Show customer info section
        document.getElementById('customerInfoSection').style.display = 'block';
        document.getElementById('paymentSection').style.display = 'block';
        
        // Show/hide delivery fields
        const deliveryFields = document.getElementById('deliveryFields');
        if (selectedOrderType === 'delivery') {
            deliveryFields.style.display = 'block';
            // Make delivery fields required
            document.getElementById('address').required = true;
            document.getElementById('city').required = true;
            document.getElementById('zip').required = true;
        } else {
            deliveryFields.style.display = 'none';
            // Remove required from delivery fields
            document.getElementById('address').required = false;
            document.getElementById('city').required = false;
            document.getElementById('zip').required = false;
        }
        
        // Update button text
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        placeOrderBtn.textContent = 'Complete Order';
        placeOrderBtn.disabled = false;
        
        // Update totals
        updateTotals();
        
        // Scroll to customer info
        document.getElementById('customerInfoSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Payment method selection
const paymentMethods = document.querySelectorAll('.payment-method');
paymentMethods.forEach(method => {
    method.addEventListener('click', function() {
        paymentMethods.forEach(m => m.classList.remove('active'));
        this.classList.add('active');
    });
});

// Place order
document.getElementById('placeOrderBtn').addEventListener('click', function() {
    if (!selectedOrderType) {
        alert('Please select an order type (Delivery or Pickup)');
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Validate form
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Generate order number
    const orderNumber = '#' + Math.floor(10000 + Math.random() * 90000);
    const estimatedTime = selectedOrderType === 'delivery' ? '30-45 minutes' : '15-20 minutes';
    
    // Show confirmation modal
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('estimatedTime').textContent = estimatedTime;
    document.getElementById('confirmationModal').style.display = 'block';
    
    // Clear cart
    localStorage.removeItem('cart');
    updateCartCount();
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount();
});