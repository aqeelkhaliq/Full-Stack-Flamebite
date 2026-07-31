document.addEventListener('DOMContentLoaded', async function() {
    let user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const orders = await API.getUserOrders(user.id);
        let container = document.getElementById('ordersList');
        let countSpan = document.getElementById('orderCount');

        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:80px 20px;">
                    <i class="fa-regular fa-receipt" style="font-size:64px;color:#ddd;display:block;margin-bottom:20px;"></i>
                    <h3 style="margin-bottom:10px;">No Orders Yet</h3>
                    <p style="color:#999;margin-bottom:20px;">Start ordering delicious food now!</p>
                    <a href="menu.html" class="btn primary" style="display:inline-block;padding:12px 30px;background:#E63946;color:#fff;border-radius:30px;text-decoration:none;">Browse Menu</a>
                </div>
            `;
            if (countSpan) countSpan.textContent = '0 orders';
            return;
        }

        if (countSpan) countSpan.textContent = orders.length + ' orders';

        // Sort: newest first
        orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        container.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span><strong>${order.id}</strong></span>
                    <span>${new Date(order.created_at).toLocaleDateString()}</span>
                    <span class="status ${order.status}">${order.status}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>Rs. ${item.price * item.quantity}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <strong>Total: Rs. ${order.total_amount}</strong>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('Error loading orders', 'error');
    }

    updateCartBadge();
});