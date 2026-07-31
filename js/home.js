
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            let card = this.closest('.food-card');
            let id = card.dataset.id;
            let name = card.dataset.name;
            let price = Number(card.dataset.price);
            let image = card.dataset.image;
            addToCart(id, name, price, image);
        });
    });

    document.querySelectorAll('.fav').forEach(btn => {
        btn.addEventListener('click', function() {
            let card = this.closest('.food-card');
            let id = Number(card.dataset.id);
            let icon = this.querySelector('i');
            
            let favs = getFavourites();
            let index = favs.indexOf(id);
            
            if (index > -1) {
                favs.splice(index, 1);
                icon.className = 'fa-regular fa-heart';
                this.classList.remove('active');
                showToast('Removed from favourites ');
            } else {
                favs.push(id);
                icon.className = 'fa-solid fa-heart';
                this.classList.add('active');
                showToast('Added to favourites ');
            }
            saveFavourites(favs);
        });
    });

    let favs = getFavourites();
    document.querySelectorAll('.food-card').forEach(card => {
        let id = Number(card.dataset.id);
        if (favs.includes(id)) {
            let btn = card.querySelector('.fav');
            if (btn) {
                btn.classList.add('active');
                btn.querySelector('i').className = 'fa-solid fa-heart';
            }
        }
    });

    updateCartBadge();
});