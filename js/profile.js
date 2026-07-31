document.addEventListener('DOMContentLoaded', async function() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Display user info
    document.getElementById('profileNameDisplay').textContent = user.full_name || user.username;
    document.getElementById('profileEmailDisplay').textContent = user.email;

    // Fill form fields
    document.getElementById('profileName').value = user.full_name || '';
    document.getElementById('profileUsername').value = user.username || '';
    document.getElementById('profileEmail').value = user.email || '';
    document.getElementById('profilePhone').value = user.phone || '';
    document.getElementById('profileAddress').value = user.address || '';

    // Update profile
    document.getElementById('updateProfile').addEventListener('submit', async function(e) {
        e.preventDefault();

        const updated = {
            full_name: document.getElementById('profileName').value.trim(),
            username: document.getElementById('profileUsername').value.trim(),
            phone: document.getElementById('profilePhone').value.trim(),
            address: document.getElementById('profileAddress').value.trim()
        };

        try {
            const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(updated)
            });
            const data = await response.json();

            if (response.ok) {
                // Update local user
                const updatedUser = { ...user, ...updated };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                // Update display name
                document.getElementById('profileNameDisplay').textContent = updated.full_name || updated.username;
                
                showToast('Profile updated! ');
            } else {
                showToast(data.message || 'Update failed', 'error');
            }
        } catch (error) {
            showToast('Error updating profile', 'error');
        }
    });

    updateCartBadge();
});