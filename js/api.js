const API_URL = 'http://localhost:5000/api';

async function fetchAPI(endpoint, options = {}) {
    const url = API_URL + endpoint;
    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...options
    };

    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ---------- AUTH ----------
function register(userData) {
    return fetchAPI('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

function login(credentials) {
    return fetchAPI('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
}

// ---------- MENU ----------
function getMenu() {
    return fetchAPI('/menu');
}

function addMenuItem(item) {
    return fetchAPI('/menu', {
        method: 'POST',
        body: JSON.stringify(item)
    });
}

function deleteMenuItem(id) {
    return fetchAPI(`/menu/${id}`, {
        method: 'DELETE'
    });
}

// ---------- ORDERS ----------
function getAllOrders() {
    return fetchAPI('/orders/all');
}

function updateOrderStatus(id, status) {
    return fetchAPI(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    });
}

function createOrder(orderData) {
    return fetchAPI('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
    });
}

function getUserOrders(userId) {
    return fetchAPI(`/orders/${userId}`);
}

// ---------- USERS ----------
function getUsers() {
    return fetchAPI('/users');
}

function deleteUser(id) {
    return fetchAPI(`/users/${id}`, {
        method: 'DELETE'
    });
}

// ---------- FAVOURITES ----------
function addFavourite(userId, menuItemId) {
    return fetchAPI('/favourites', {
        method: 'POST',
        body: JSON.stringify({ userId, menuItemId })
    });
}

function getFavourites(userId) {
    return fetchAPI(`/favourites/${userId}`);
}

// ---------- CONTACT ----------

function getContactMessages() {
    return fetchAPI('/contact');
}

function sendContactMessage(data) {
    return fetchAPI('/contact', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

function deleteContactMessage(id) {
    return fetchAPI(`/contact/${id}`, {
        method: 'DELETE'
    });
}

function markMessageRead(id) {
    return fetchAPI(`/contact/${id}/read`, {
        method: 'PUT'
    });
}

// ---------- EXPORT ----------
window.API = {
    register,
    login,
    getMenu,
    addMenuItem,
    deleteMenuItem,
    getAllOrders,
    updateOrderStatus,
    createOrder,
    getUserOrders,
    getUsers,
    deleteUser,
    addFavourite,
    getFavourites,
    getContactMessages,
    deleteContactMessage,
    markMessageRead
};