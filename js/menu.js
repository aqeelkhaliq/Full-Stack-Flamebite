let allItems = [];
let currentItems = [];
let currentCategory = 'all';

// ---------- GET IMAGE PATH (FIXED) ----------
function getImagePath(item) {
    const basePath = '../assets/images/';
    
    // If image already has a folder, use it as-is
    if (item.image && item.image.includes('/')) {
        return basePath + item.image;
    }
    
    // Map category to folder
    const categoryMap = {
        'burger': 'burger/',
        'pizza': 'pizza/',
        'fries': 'fries/',
        'drink': 'drinks/',
        'sides': 'slides/'
    };
    
    const folder = categoryMap[item.category] || '';
    return basePath + folder + item.image;
}

// ---------- RENDER ----------
function renderMenu(items) {
    let grid = document.querySelector('.food-grid');
    if (!grid) return;

    if (items.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fa-regular fa-face-frown"></i>
                <h3>No items found</h3>
                <p>Try adjusting your search.</p>
            </div>
        `;
        return;
    }

    let html = '';
    items.forEach(item => {
        // Get the correct image path
        const imagePath = getImagePath(item);
        
        html += `
            <div class="food-card" data-id="${item.id}">
                <div class="food-image-wrapper">
                    <img src="${imagePath}" 
                         alt="${item.name}" 
                         onerror="this.src='../assets/images/placeholder.avif'">
                    ${item.popular ? '<span class="food-badge">Popular</span>' : ''}
                    <button class="fav-btn" onclick="handleFav(${item.id})">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
                <div class="food-card-body">
                    <h3>${item.name}</h3>
                    <div class="food-rating">
                        <i class="fa-solid fa-star"></i> ${item.rating}
                    </div>
                    <p>${item.description || ''}</p>
                    <div class="food-card-bottom">
                        <span class="food-price">Rs. ${item.price}</span>
                        <button class="cart-btn" onclick="addToCart(${item.id}, '${item.name}', ${item.price}, '${imagePath}')">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

// ---------- LOAD MENU ----------
async function loadMenu() {
    try {
        const data = await API.getMenu();
        allItems = data;
        currentItems = allItems;
        renderMenu(currentItems);
    } catch (error) {
        showToast('Error loading menu', 'error');
    }
}

// ---------- FAVOURITE ----------
async function handleFav(id) {
    let user = getCurrentUser();
    if (!user) {
        showToast('Please login first', 'error');
        return;
    }
    
    try {
        await API.addFavourite(user.id, id);
        showToast('Favourite updated! ');
        renderMenu(currentItems);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ---------- FILTER ----------
function filterCategory(category) {
    currentCategory = category;
    
    let filtered = allItems;
    if (category !== 'all') {
        filtered = allItems.filter(item => item.category === category);
    }
    
    let query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (query) {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(query)
        );
    }
    
    currentItems = filtered;
    renderMenu(currentItems);
}

// ---------- SEARCH ----------
function searchFood() {
    let query = document.getElementById('searchInput').value.toLowerCase().trim();
    
    let filtered = allItems;
    if (currentCategory !== 'all') {
        filtered = allItems.filter(item => item.category === currentCategory);
    }
    
    if (query) {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(query)
        );
    }
    
    currentItems = filtered;
    renderMenu(currentItems);
}

// ---------- SORT ----------
function sortFood() {
    let select = document.getElementById('sortSelect');
    let sorted = [...currentItems];

    switch (select.value) {
        case 'popular':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        default:
            sorted = allItems;
    }

    currentItems = sorted;
    renderMenu(currentItems);
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', function() {
    loadMenu();
    updateCartBadge();

    document.getElementById('searchInput')?.addEventListener('input', searchFood);
    document.getElementById('sortSelect')?.addEventListener('change', sortFood);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterCategory(this.dataset.category);
        });
    });
});