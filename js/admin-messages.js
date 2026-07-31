function checkAdmin() {
    let user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
        return false;
    }
    let nameElement = document.getElementById('adminName');
    if (nameElement) {
        nameElement.textContent = user.full_name || 'Admin';
    }
    return true;
}

function loadMessages() {
    try {
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        let tbody = document.getElementById('messagesTable');

        if (!tbody) return;

        if (messages.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#999;">No messages yet</td></tr>';
            return;
        }

        tbody.innerHTML = messages.map((msg, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${msg.name || 'N/A'}</td>
                <td>${msg.email || 'N/A'}</td>
                <td>${msg.subject || 'N/A'}</td>
                <td style="max-width:200px;word-wrap:break-word;">${msg.message || ''}</td>
                <td>${msg.date ? new Date(msg.date).toLocaleDateString() : 'N/A'}</td>
                <td><span class="status-badge ${msg.status || 'unread'}">${msg.status || 'unread'}</span></td>
                <td>
                    <button onclick="markRead('${msg.id}')" class="btn primary small">✓ Read</button>
                    <button onclick="deleteMessage('${msg.id}')" class="btn danger small">🗑️</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading messages:', error);
        let tbody = document.getElementById('messagesTable');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#E63946;">Error loading messages. Please try again.</td></tr>';
        }
        showToast('Error loading messages', 'error');
    }
}

function markRead(id) {
    try {
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        let msg = messages.find(m => m.id == id);
        if (msg) {
            msg.status = 'read';
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            loadMessages();
            showToast('Marked as read ');
        }
    } catch (error) {
        showToast('Error updating message', 'error');
    }
}

function deleteMessage(id) {
    if (!confirm('Delete this message?')) return;
    try {
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages = messages.filter(m => m.id != id);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        loadMessages();
        showToast('Message deleted ');
    } catch (error) {
        showToast('Error deleting message', 'error');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (!checkAdmin()) return;
    loadMessages();

    let logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
});