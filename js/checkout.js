document.addEventListener('DOMContentLoaded', function() {
    let user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    let cart = getCart();
    if (cart.length === 0) {
        showToast('No items in cart', 'error');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1000);
        return;
    }

    let itemsContainer = document.getElementById('checkoutItems');
    let subtotal = 0;
    
    itemsContainer.innerHTML = cart.map(item => {
        let total = item.price * item.quantity;
        subtotal += total;
        return `
            <div class="checkout-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>Rs. ${total}</span>
            </div>
        `;
    }).join('');

    let tax = Math.round(subtotal * 0.10);
    let delivery = subtotal >= 1000 ? 0 : 150;
    let total = subtotal + tax + delivery;

    document.getElementById('checkoutSubtotal').textContent = 'Rs. ' + subtotal;
    document.getElementById('checkoutTax').textContent = 'Rs. ' + tax;
    document.getElementById('checkoutDelivery').textContent = 'Rs. ' + delivery;
    document.getElementById('checkoutTotal').textContent = 'Rs. ' + total;

    document.getElementById('checkoutName').value = user.full_name || '';
    document.getElementById('checkoutEmail').value = user.email || '';
    document.getElementById('checkoutPhone').value = user.phone || '';
    document.getElementById('checkoutAddress').value = user.address || '';

    document.getElementById('placeOrder').addEventListener('submit', async function(e) {
        e.preventDefault();

        let name = document.getElementById('checkoutName').value.trim();
        let phone = document.getElementById('checkoutPhone').value.trim();
        let address = document.getElementById('checkoutAddress').value.trim();

        if (!name || !phone || !address) {
            showToast('Please fill all fields', 'error');
            return;
        }

        try {
            const orderData = {
                userId: user.id,
                items: cart,
                total_amount: total,
                delivery_address: address,
                phone: phone
            };

            await API.createOrder(orderData);
            
            saveCart([]);
            
            showToast('Order placed successfully! 🎉');
            
            setTimeout(() => {
                window.location.href = 'orders.html';
            }, 1500);

        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    updateCartBadge();
});