document.addEventListener('DOMContentLoaded', async function() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // ----- SET AVATAR -----
    function setAvatar() {
        const name = user.full_name || user.username || 'U';
        const initial = name.charAt(0).toUpperCase();
        
        // Use UI Avatars API (free, no image needed)
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E63946&color=fff&size=60&bold=true&rounded=true`;
        
        // Update sidebar avatar
        const sidebarAvatar = document.querySelector('.sidebar-user img, .sidebar-user .avatar');
        if (sidebarAvatar) {
            sidebarAvatar.src = avatarUrl;
            sidebarAvatar.alt = name;
            sidebarAvatar.onerror = function() {
                this.style.display = 'none';
                // Show initials instead
                const parent = this.parentElement;
                const fallback = document.createElement('span');
                fallback.textContent = initial;
                fallback.style.cssText = 'width:44px;height:44px;background:#E63946;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;';
                parent.appendChild(fallback);
                this.style.display = 'none';
            };
        }
        
        // Update header profile
        const headerAvatar = document.querySelector('.header-profile img');
        if (headerAvatar) {
            headerAvatar.src = avatarUrl;
            headerAvatar.alt = name;
            headerAvatar.onerror = function() {
                this.style.display = 'none';
                const parent = this.parentElement;
                const fallback = document.createElement('span');
                fallback.textContent = initial;
                fallback.style.cssText = 'width:40px;height:40px;background:#E63946;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;';
                parent.appendChild(fallback);
                this.style.display = 'none';
            };
        }
    }

    setAvatar();

    // ----- DISPLAY USER INFO -----
    document.getElementById('userName').textContent = user.full_name || user.username;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('welcomeName').textContent = user.full_name || user.username;

    // ----- LOAD ORDERS -----
    try {
        const orders = await API.getUserOrders(user.id);
        document.getElementById('totalOrders').textContent = orders.length;
        const totalSpent = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        document.getElementById('totalSpent').textContent = 'Rs. ' + totalSpent;

        const list = document.getElementById('recentOrders');
        if (orders.length === 0) {
            list.innerHTML = '<p style="color:#999;text-align:center;padding:20px;">No orders yet. Order now! 🍔</p>';
        } else {
            const recent = orders.slice(-3).reverse();
            list.innerHTML = recent.map(o => `
                <div class="order-item">
                    <span style="font-weight:600;">${o.id}</span>
                    <span>${o.items ? o.items.length : 0} items</span>
                    <span class="status-badge ${o.status || 'pending'}">${o.status || 'pending'}</span>
                    <span style="font-weight:600;color:#E63946;">Rs. ${o.total_amount}</span>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error('Error loading orders:', e);
    }

    // ----- LOAD FAVOURITES -----
    try {
        const favourites = await API.getFavourites(user.id);
        document.getElementById('totalFavs').textContent = favourites.length;

        const grid = document.getElementById('favouritesGrid');
        if (favourites.length === 0) {
            grid.innerHTML = '<p style="color:#999;text-align:center;padding:20px;">No favourites yet. ❤️</p>';
        } else {
            grid.innerHTML = favourites.slice(0, 4).map(item => `
                <div class="fav-item">
                    <img src="../assets/images/${item.image || 'placeholder.avif'}" 
                         alt="${item.name}" 
                         onerror="this.src='../assets/images/placeholder.avif'" />
                    <span style="font-weight:500;">${item.name}</span>
                    <span style="color:#E63946;font-weight:600;">Rs. ${item.price}</span>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error('Error loading favourites:', e);
    }

    updateCartBadge();
});