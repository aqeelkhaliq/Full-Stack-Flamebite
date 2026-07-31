document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirmPassword').value;

        // Validation
        if (!fullName || !username || !email || !phone || !password || !confirm) {
            showToast('Please fill all fields', 'error');
            return;
        }
        if (password.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }
        if (password !== confirm) {
            showToast('Passwords do not match', 'error');
            return;
        }

        try {
            //  Use backend API instead of direct Supabase
            const data = await API.register({
                fullName,
                username,
                email,
                phone,
                password
            });

            console.log('Registration response:', data);

            // Save session
            localStorage.setItem('token', data.token || '');
            localStorage.setItem('user', JSON.stringify({
                id: data.user.id,
                full_name: fullName,
                username: username,
                email: email,
                role: 'user'
            }));
            localStorage.setItem('isLoggedIn', 'true');

            showToast('Account created! 🎉 Welcome to FlameBite!');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            console.error('Registration error:', error);
            showToast(error.message || 'Registration failed', 'error');
        }
    });
});