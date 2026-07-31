function loadCart() {
    let cart = getCart();
    let tbody = document.getElementById('cartTable');
    let wrapper = document.getElementById('cartWrapper');
    let empty = document.getElementById('emptyCart');

    if (!tbody) return;

    if (cart.length === 0) {
        wrapper.style.display = 'none';
        empty.style.display = 'block';
        document.getElementById('cartItemCount').textContent = '(0 items)';
        updateCartBadge();
        return;
    }

    wrapper.style.display = 'grid';
    empty.style.display = 'none';
    document.getElementById('cartItemCount').textContent = `(${cart.length} items)`;

    let html = '';
    let subtotal = 0;

    cart.forEach(item => {
        let total = item.price * item.quantity;
        subtotal += total;
        html += `
            <tr>
                <td>
                    <img src="${item.image}" alt="${item.name}" width="50" height="50" style="border-radius:8px;object-fit:cover;">
                    <span style="margin-left:10px;font-weight:600;">${item.name}</span>
                </td>
                <td>Rs. ${item.price}</td>
                <td>
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
                    <span style="padding:0 15px;font-weight:600;min-width:30px;display:inline-block;text-align:center;">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </td>
                <td>Rs. ${total}</td>
                <td><button onclick="removeItem(${item.id})" style="background:none;border:none;color:#999;font-size:18px;cursor:pointer;">✕</button></td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    let tax = Math.round(subtotal * 0.10);
    let delivery = subtotal >= 1000 ? 0 : 150;
    let total = subtotal + tax + delivery;

    document.getElementById('summarySubtotal').textContent = 'Rs. ' + subtotal;
    document.getElementById('summaryTax').textContent = 'Rs. ' + tax;
    document.getElementById('summaryDelivery').textContent = 'Rs. ' + delivery;
    document.getElementById('summaryGrandTotal').textContent = 'Rs. ' + total;

    updateCartBadge();
}

function changeQty(id, change) {
    let cart = getCart();
    let item = cart.find(i => i.id == id);
    if (!item) return;

    let newQty = item.quantity + change;
    if (newQty < 1) {
        if (confirm('Remove this item?')) {
            cart = cart.filter(i => i.id != id);
            saveCart(cart);
            loadCart();
            showToast('Item removed');
        }
        return;
    }

    item.quantity = newQty;
    saveCart(cart);
    loadCart();
    showToast('Quantity updated');
}

function removeItem(id) {
    if (confirm('Remove this item?')) {
        let cart = getCart().filter(i => i.id != id);
        saveCart(cart);
        loadCart();
        showToast('Item removed');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartBadge();
});