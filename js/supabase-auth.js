const SUPABASE_URL = 'https://nqclnrxwmqibgakgemhw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xY2xucnh3bXFpYmdha2dlbWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNDQ5NTIsImV4cCI6MjEwMDcyMDk1Mn0.bQJIhDdcV3SLv8fTwo7ZzvsyyLO0sWhJ_WAt2XZfQs8';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function resetPassword(email) {
    return await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/pages/login.html'
    });
}

// Auto-check session on login/register pages
document.addEventListener('DOMContentLoaded', function() {
    const page = window.location.pathname.split('/').pop();
    if (page === 'login.html' || page === 'register.html') {
        supabaseClient.auth.getSession().then(({ data }) => {
            if (data?.session) {
                const user = data.session.user;
                localStorage.setItem('token', data.session.access_token);
                localStorage.setItem('user', JSON.stringify({
                    id: user.id,
                    full_name: user.user_metadata?.full_name || 'User',
                    username: user.user_metadata?.username || '',
                    email: user.email,
                    role: 'user'
                }));
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'dashboard.html';
            }
        });
    }
});