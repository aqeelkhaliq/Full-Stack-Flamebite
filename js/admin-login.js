

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('adminLoginForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('adminPassword').value;

        if (!email || !password) {
            showToast('Please fill all fields', 'error');
            return;
        }

        try {
            const data = await API.login({ email, password });

            console.log(' Admin login response:', data);

            //  Check if user exists
            if (!data.user) {
                showToast('User not found', 'error');
                return;
            }

            //  Log the role for debugging
            console.log('👤 User role:', data.user.role);

            //  Check if user is admin
            if (data.user.role !== 'admin') {
                showToast('Access denied. Admin only. Your role: ' + data.user.role, 'error');
                return;
            }

            //  Save session
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('isLoggedIn', 'true');

            showToast('Welcome Admin! 🎉');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error(' Admin login error:', error);
            showToast(error.message || 'Login failed', 'error');
        }
    });
});