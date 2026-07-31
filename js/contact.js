// =============================================
// FLAMEBITE – CONTACT PAGE
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        if (!name || !email || !subject || !message) {
            showToast('Please fill all fields', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Please enter a valid email', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            });

            const data = await response.json();

            if (response.ok) {
                showToast(' Message sent! We\'ll get back to you soon.');
                form.reset();
            } else {
                showToast(data.message || 'Failed to send message', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error sending message. Please try again.', 'error');
        }
    });

    updateCartBadge();
});