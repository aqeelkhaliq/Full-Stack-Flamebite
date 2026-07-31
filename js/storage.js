function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(id, name, price, image) {
    let cart = getCart();
    let existing = cart.find(item => item.id == id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    saveCart(cart);
    showToast(name + ' added to cart! 🛒');
}

function getCartCount() {
    let cart = getCart();
    let total = 0;
    cart.forEach(item => { total += item.quantity; });
    return total;
}

function updateCartBadge() {
    let count = getCartCount();
    let badges = document.querySelectorAll('#cart-count');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    });
}

function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    let msg = document.getElementById('toast-message');
    if (!toast || !msg) return;
    
    msg.textContent = message;
    toast.classList.add('show');
    
    if (type === 'error') {
        toast.style.borderLeftColor = '#E63946';
    } else {
        toast.style.borderLeftColor = '#2A9D8F';
    }
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}