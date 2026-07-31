

console.log(' admin.js loaded');

let allUsers = [];
let allMenu = [];
let allOrders = [];
let allMessages = [];
let currentPage = 'dashboard';

// ---------- CHECK ADMIN ----------
function checkAdmin() {
    const user = getCurrentUser();
    console.log(' Admin check:', user);
    
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
        return false;
    }
    
    const nameEl = document.getElementById('adminName');
    if (nameEl) {
        nameEl.textContent = user.full_name || user.username || 'Admin';
    }
    return true;
}

// ---------- LOAD ALL DATA FROM DATABASE ----------
async function loadAllData() {
    console.log(' Loading all data from database...');
    
    try {
        // 1. Get ALL Users
        console.log(' Fetching users...');
        const usersData = await API.getUsers();
        allUsers = usersData || [];
        console.log(' Users:', allUsers.length);
        
        // 2. Get ALL Menu
        console.log(' Fetching menu...');
        const menuData = await API.getMenu();
        allMenu = menuData || [];
        console.log(' Menu:', allMenu.length);
        
        // 3. Get ALL Orders
        console.log(' Fetching orders...');
        const ordersData = await API.getAllOrders();
        allOrders = ordersData || [];
        console.log(' Orders:', allOrders.length);
        
        // 4. Get ALL Messages from database
        console.log(' Fetching messages...');
        const messagesData = await API.getContactMessages();
        allMessages = messagesData || [];
        console.log(' Messages:', allMessages.length);

        // Update Stats
        document.getElementById('totalUsers').textContent = allUsers.length;
        document.getElementById('totalMenu').textContent = allMenu.length;
        document.getElementById('totalOrders').textContent = allOrders.length;
        
        let revenue = 0;
        allOrders.forEach(o => { revenue += o.total_amount || 0; });
        document.getElementById('totalRevenue').textContent = 'Rs. ' + revenue;

        renderPage(currentPage);

    } catch (error) {
        console.error(' Error loading data:', error);
        showToast('Error loading data', 'error');
    }
}

// ---------- RENDER PAGES ----------
function renderPage(page) {
    currentPage = page;
    const content = document.getElementById('pageContent');
    if (!content) return;

    switch(page) {
        case 'dashboard': renderDashboard(content); break;
        case 'users': renderUsers(content); break;
        case 'menu': renderMenu(content); break;
        case 'orders': renderOrders(content); break;
        case 'messages': renderMessages(content); break;
        default: renderDashboard(content);
    }
}

function renderDashboard(content) {
    content.innerHTML = `
        <h2> Dashboard Overview</h2>
        
        <!-- Stats Cards -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin:20px 0;">
            <div style="background:#fff;padding:20px;border-radius:12px;border-left:4px solid #E63946;box-shadow:0 2px 10px rgba(0,0,0,0.02);">
                <h3 style="font-size:28px;margin:0;">${allUsers.length}</h3>
                <p style="color:#999;margin:5px 0 0;">Total Users</p>
            </div>
            <div style="background:#fff;padding:20px;border-radius:12px;border-left:4px solid #FFB703;box-shadow:0 2px 10px rgba(0,0,0,0.02);">
                <h3 style="font-size:28px;margin:0;">${allMenu.length}</h3>
                <p style="color:#999;margin:5px 0 0;">Menu Items</p>
            </div>
            <div style="background:#fff;padding:20px;border-radius:12px;border-left:4px solid #2A9D8F;box-shadow:0 2px 10px rgba(0,0,0,0.02);">
                <h3 style="font-size:28px;margin:0;">${allOrders.length}</h3>
                <p style="color:#999;margin:5px 0 0;">Total Orders</p>
            </div>
            <div style="background:#fff;padding:20px;border-radius:12px;border-left:4px solid #E63946;box-shadow:0 2px 10px rgba(0,0,0,0.02);">
                <h3 style="font-size:28px;margin:0;color:#E63946;">Rs. ${allOrders.reduce((sum,o) => sum + (o.total_amount||0), 0)}</h3>
                <p style="color:#999;margin:5px 0 0;">Revenue</p>
            </div>
        </div>

        <!-- Order History -->
        <h3 style="margin:30px 0 15px;"> Order History</h3>
        <div class="table-wrap">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${allOrders.length > 0 ? allOrders.map(o => `
                        <tr>
                            <td><strong>${o.id}</strong></td>
                            <td>${o.user_id ? o.user_id.substring(0,8)+'...' : 'N/A'}</td>
                            <td>${o.items ? o.items.length : 0}</td>
                            <td>Rs. ${o.total_amount || 0}</td>
                            <td><span class="status-badge ${o.status || 'pending'}">${o.status || 'pending'}</span></td>
                            <td>${o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                    `).join('') : '<tr><td colspan="6" style="text-align:center;padding:30px;color:#999;">No orders</td></tr>'}
                </tbody>
            </table>
        </div>

        <!-- Messages -->
        <h3 style="margin:30px 0 15px;"> Recent Messages</h3>
        <div class="table-wrap">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${allMessages.length > 0 ? allMessages.slice(0, 5).map((m, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${m.name || 'N/A'}</td>
                            <td>${m.email || 'N/A'}</td>
                            <td>${m.subject || 'N/A'}</td>
                            <td><span class="status-badge ${m.status || 'unread'}">${m.status || 'unread'}</span></td>
                            <td>${m.created_at ? new Date(m.created_at).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                    `).join('') : '<tr><td colspan="6" style="text-align:center;padding:30px;color:#999;">No messages</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

function renderUsers(content) {
    content.innerHTML = `
        <h2> All Users (${allUsers.length})</h2>
        <div class="table-wrap">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${allUsers.length > 0 ? allUsers.map(u => `
                        <tr>
                            <td>${u.full_name || u.username || 'N/A'}</td>
                            <td>${u.email || 'N/A'}</td>
                            <td>${u.phone || 'N/A'}</td>
                            <td><span class="status-badge ${u.role || 'user'}">${u.role || 'user'}</span></td>
                            <td>${u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
                            <td>
                                <button onclick="deleteUser('${u.id}')" class="btn danger small">Delete</button>
                            </td>
                        </tr>
                    `).join('') : '<tr><td colspan="6" style="text-align:center;padding:30px;color:#999;">No users</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

function renderMenu(content) {
    content.innerHTML = `
        <h2> Manage Menu (${allMenu.length})</h2>
        <button onclick="showAddMenu()" class="btn primary" style="margin-bottom:20px;">+ Add Item</button>
        <div class="table-wrap">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Popular</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${allMenu.length > 0 ? allMenu.map(item => `
                        <tr>
                            <td>${item.id}</td>
                            <td>${item.name}</td>
                            <td>${item.category}</td>
                            <td>Rs. ${item.price}</td>
                            <td>${item.popular ? '⭐' : ''}</td>
                            <td>
                                <button onclick="deleteMenuItem(${item.id})" class="btn danger small">Delete</button>
                            </td>
                        </tr>
                    `).join('') : '<tr><td colspan="6" style="text-align:center;padding:30px;color:#999;">No menu items</td></tr>'}
                </tbody>
            </table>
        </div>
        <div id="addMenuForm" style="display:none;margin-top:20px;padding:20px;border:1px solid #ddd;border-radius:10px;">
            <h3>Add New Menu Item</h3>
            <form id="menuForm">
                <input type="text" id="menuName" placeholder="Name" />
                <input type="text" id="menuCategory" placeholder="Category" />
                <input type="number" id="menuPrice" placeholder="Price" />
                <input type="text" id="menuImage" placeholder="Image filename" />
                <textarea id="menuDesc" placeholder="Description"></textarea>
                <label><input type="checkbox" id="menuPopular" /> Popular</label>
                <button type="submit" class="btn primary">Save</button>
                <button type="button" onclick="hideAddMenu()" class="btn secondary">Cancel</button>
            </form>
        </div>
    `;
    document.getElementById('menuForm')?.addEventListener('submit', addMenuItem);
}
function renderOrders(content) {
    content.innerHTML = `
        <h2> All Orders (${allOrders.length})</h2>
        <div class="table-wrap">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${allOrders.length > 0 ? allOrders.map(o => `
                        <tr>
                            <td><strong>${o.id}</strong></td>
                            <td>${o.user_id ? o.user_id.substring(0,8)+'...' : 'N/A'}</td>
                            <td>${o.items ? o.items.length : 0}</td>
                            <td>Rs. ${o.total_amount || 0}</td>
                            <td><span class="status-badge ${o.status || 'pending'}">${o.status || 'pending'}</span></td>
                            <td>${o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A'}</td>
                            <td>
                                <select onchange="updateOrderStatus('${o.id}', this.value)">
                                    <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
                                    <option value="preparing" ${o.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                                    <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                    <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    `).join('') : '<tr><td colspan="7" style="text-align:center;padding:30px;color:#999;">No orders</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

function renderMessages(content) {
    content.innerHTML = `
        <h2> All Messages (${allMessages.length})</h2>
        <div class="table-wrap">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${allMessages.length > 0 ? allMessages.map((m, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${m.name || 'N/A'}</td>
                            <td>${m.email || 'N/A'}</td>
                            <td>${m.subject || 'N/A'}</td>
                            <td style="max-width:150px;word-wrap:break-word;">${m.message || 'N/A'}</td>
                            <td><span class="status-badge ${m.status || 'unread'}">${m.status || 'unread'}</span></td>
                            <td>${m.created_at ? new Date(m.created_at).toLocaleDateString() : 'N/A'}</td>
                            <td>
                                <button onclick="markRead('${m.id}')" class="btn primary small">✓ Read</button>
                                <button onclick="deleteMsg('${m.id}')" class="btn danger small">🗑️</button>
                            </td>
                        </tr>
                    `).join('') : '<tr><td colspan="8" style="text-align:center;padding:30px;color:#999;">No messages</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

// ---------- ACTIONS ----------
function showAddMenu() {
    document.getElementById('addMenuForm').style.display = 'block';
}

function hideAddMenu() {
    document.getElementById('addMenuForm').style.display = 'none';
}

async function addMenuItem(e) {
    e.preventDefault();
    const item = {
        name: document.getElementById('menuName').value,
        category: document.getElementById('menuCategory').value,
        price: parseInt(document.getElementById('menuPrice').value),
        image: document.getElementById('menuImage').value || 'default.avif',
        description: document.getElementById('menuDesc').value,
        popular: document.getElementById('menuPopular').checked
    };
    try {
        await API.addMenuItem(item);
        showToast('Item added!');
        await loadAllData();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deleteMenuItem(id) {
    if (!confirm('Delete this item?')) return;
    try {
        await API.deleteMenuItem(id);
        showToast('Item deleted');
        await loadAllData();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        await API.updateOrderStatus(orderId, status);
        showToast('Order status updated');
        await loadAllData();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deleteUser(id) {
    if (!confirm('Delete this user?')) return;
    try {
        await API.deleteUser(id);
        showToast('User deleted');
        await loadAllData();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function markRead(id) {
    showToast('Marked as read ');
    loadAllData();
}

function deleteMsg(id) {
    if (!confirm('Delete this message?')) return;
    showToast('Message deleted ');
    loadAllData();
}

// ---------- NAVIGATION ----------
document.querySelectorAll('.sidebar-nav a[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.dataset.page;
        document.querySelectorAll('.sidebar-nav a[data-page]').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
        renderPage(page);
    });
});

// ---------- LOGOUT ----------
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    logoutUser();
});

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAdmin()) return;
    loadAllData();
});