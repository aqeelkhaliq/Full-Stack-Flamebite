document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
       

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showToast('Please fill all fields', 'error');
            return;
        }

        try {
            const data = await API.login({ email, password });

            console.log('Login data:', data); // Debug

            // Save session
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('isLoggedIn', 'true');

            showToast('Welcome back, ' + (data.user.full_name || 'User') + '! 🎉');

            setTimeout(() => {
                if (data.user.role === 'admin') {
                    window.location.href = '../admin/index.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            showToast(error.message || 'Login failed', 'error');
        }
    });
});

// Auto-redirect if already logged in
if (localStorage.getItem('isLoggedIn') === 'true') {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
        setTimeout(() => {
            window.location.href = user.role === 'admin' ? '../admin/index.html' : 'dashboard.html';
        }, 500);
    }
}