document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // ----- LOAD USER DATA -----
    document.getElementById('displayName').value = user.full_name || user.username || '';
    document.getElementById('displayEmail').value = user.email || '';

    // ----- UPDATE DISPLAY NAME -----
    window.updateDisplayName = async function() {
        const name = document.getElementById('displayName').value.trim();
        if (!name) {
            showToast('Please enter a display name', 'error');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ full_name: name })
            });
            const data = await response.json();

            if (response.ok) {
                // Update local user
                const updatedUser = { ...user, full_name: name };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                showToast('Display name updated! ');
            } else {
                showToast(data.message || 'Update failed', 'error');
            }
        } catch (error) {
            showToast('Error updating display name', 'error');
        }
    };

    // ----- NAVIGATION TABS -----
    document.querySelectorAll('.settings-nav a[data-tab]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Update active link
            document.querySelectorAll('.settings-nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');

            // Show tab content
            const tab = this.dataset.tab;
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            document.getElementById('tab-' + tab).classList.add('active');
        });
    });

    // ----- DARK MODE TOGGLE (demo only) -----
    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) {
        darkToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.style.background = '#1a1a2e';
                document.body.style.color = '#fff';
                showToast('Dark mode enabled ');
            } else {
                document.body.style.background = '';
                document.body.style.color = '';
                showToast('Light mode enabled ');
            }
        });
    }

    // ----- LANGUAGE SELECT -----
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.addEventListener('change', function() {
            showToast('Language changed to ' + this.options[this.selectedIndex].text);
        });
    }

    updateCartBadge();
});