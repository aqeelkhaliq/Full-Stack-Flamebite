function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    showToast(' Logged out');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

function updateNavbar() {
    const nav = document.querySelector('.nav-links');
    if (!nav) return;

    const isLogged = isLoggedIn();
    const user = getCurrentUser();

    nav.querySelectorAll('.dynamic-nav-item').forEach(el => el.remove());

    const loginLi = nav.querySelector('li a[href="login.html"]')?.closest('li');
    const registerLi = nav.querySelector('li a[href="register.html"]')?.closest('li');

    if (isLogged && user) {
        if (loginLi) loginLi.style.display = 'none';
        if (registerLi) registerLi.style.display = 'none';

        //  Show actual user name, not "Test User"
        const displayName = user.full_name || user.username || 'User';
        
        const dashLi = document.createElement('li');
        dashLi.className = 'dynamic-nav-item';
        const dashLink = document.createElement('a');
        dashLink.href = user.role === 'admin' ? '../admin/index.html' : 'dashboard.html';
        dashLink.innerHTML = `<i class="fa-solid fa-user"></i> ${displayName}`;
        dashLi.appendChild(dashLink);
        nav.insertBefore(dashLi, nav.querySelector('li:last-child'));

        const logoutLi = document.createElement('li');
        logoutLi.className = 'dynamic-nav-item';
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Logout`;
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
        logoutLi.appendChild(logoutLink);
        nav.appendChild(logoutLi);
    } else {
        if (loginLi) loginLi.style.display = '';
        if (registerLi) registerLi.style.display = '';
    }
}

// ---------- PROTECT PAGE ----------
function protectPage() {
    const page = window.location.pathname.split('/').pop();
    const isLogged = isLoggedIn();
    const user = getCurrentUser();

    //  If on login or register page
    if (page === 'login.html' || page === 'register.html') {
        if (isLogged && user) {
            if (user.role === 'admin') {
                window.location.href = '../admin/index.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        }
        return;
    }

    // If on admin page (index.html in admin folder)
    if (window.location.pathname.includes('/admin/')) {
        //  Check if user is logged in
        if (!isLogged) {
            showToast('Please login as admin', 'error');
            setTimeout(() => {
                window.location.href = '../pages/login.html';
            }, 1000);
            return;
        }
        //  Check if user is admin
        if (user && user.role !== 'admin') {
            showToast('Admin access only', 'error');
            setTimeout(() => {
                window.location.href = '../pages/login.html';
            }, 1000);
            return;
        }
        // Admin is allowed, stay on page
        return;
    }

    //  Protected user pages
    const protectedPages = ['dashboard.html', 'profile.html', 'orders.html', 
                            'settings.html', 'cart.html', 'checkout.html', 
                            'favorites.html'];

    if (protectedPages.includes(page)) {
        if (!isLogged) {
            showToast('Please login first', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
            return;
        }
        //  If admin tries to access user dashboard, redirect to admin
        if (user && user.role === 'admin') {
            window.location.href = '../admin/index.html';
        }
        return;
    }

    // Home page (allow everyone)
    if (page === 'index.html') {
        return;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    protectPage();
    updateNavbar();
    updateCartBadge();
});