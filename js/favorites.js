

console.log(' favorites.js loaded!');

document.addEventListener('DOMContentLoaded', async function() {
    console.log(' DOM ready');

    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    console.log(' User:', user.email);

    const container = document.getElementById('favoritesList');
    const countSpan = document.getElementById('favCount');

    if (!container) {
        console.error('#favoritesList not found');
        return;
    }

    try {
        const favourites = await API.getFavourites(user.id);
        console.log(' Favourites:', favourites);

        if (!favourites || favourites.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:80px 20px;">
                    <i class="fa-regular fa-heart" style="font-size:64px;color:#ddd;display:block;margin-bottom:20px;"></i>
                    <h3>No Favourites Yet</h3>
                    <p style="color:#999;">Start hearting your favorite meals!</p>
                    <a href="menu.html" class="btn primary">Browse Menu</a>
                </div>
            `;
            if (countSpan) countSpan.textContent = '0 items';
            return;
        }

        if (countSpan) countSpan.textContent = favourites.length + ' items';

        container.innerHTML = favourites.map(item => {
            const imagePath = getImagePath(item.image);
            return `
                <div class="favorite-card">
                    <img src="${imagePath}" 
                         alt="${item.name}" 
                         onerror="this.src='../assets/images/placeholder.avif'" />
                    <div class="fav-info">
                        <h3>${item.name}</h3>
                        <p>${item.description || ''}</p>
                        <span class="price">Rs. ${item.price}</span>
                    </div>
                    <div class="fav-actions">
                        <button onclick="addToCart(${item.id}, '${item.name}', ${item.price}, '${imagePath}')" class="cart-btn">
                             Add to Cart
                        </button>
                        <button onclick="removeFav(${item.id})" class="remove-btn">
                             Remove
                        </button>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error(' Error:', error);
        showToast('Error loading favourites', 'error');
    }

    updateCartBadge();
});

// ---------- IMAGE PATH HELPER ----------
function getImagePath(filename) {
    if (!filename) return '../assets/images/placeholder.avif';
    if (filename.includes('/')) return '../assets/images/' + filename;
    
    const pathMap = {
        'burger1.avif': 'burger/burger1.avif',
        'burger-g1.avif': 'burger/burger-g1.avif',
        'burger combo.avif': 'burger/burger combo.avif',
        'pizza1.avif': 'pizza/pizza1.avif',
        'pizza-g1.avif': 'pizza/pizza-g1.avif',
        'fries1.avif': 'fries/fries1.avif',
        'fries-g1.avif': 'fries/fries-g1.avif',
        'drink-g1.avif': 'drinks/drink-g1.avif',
        'drink.png': 'drinks/drink.png',
        'chicken1.avif': 'slides/chicken1.avif',
        'chicken-g1.avif': 'slides/chicken-g1.avif',
        'sandwich-g1.avif': 'slides/sandwich-g1.avif',
    };
    
    return '../assets/images/' + (pathMap[filename] || 'burger/' + filename);
}

// ---------- REMOVE FAVOURITE ----------
async function removeFav(id) {
    const user = getCurrentUser();
    if (!user) return;
    if (!confirm('Remove this from favourites?')) return;

    try {
        await API.addFavourite(user.id, id);
        showToast('Removed from favourites ');
        setTimeout(() => window.location.reload(), 500);
    } catch (error) {
        showToast(error.message, 'error');
    }
}