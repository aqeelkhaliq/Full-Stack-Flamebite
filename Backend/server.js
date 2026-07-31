const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const path = require('path');
const supabase = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// ---------- AUTH MIDDLEWARE ----------
function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

function admin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
}

// ---------- TEST ----------
app.get('/', (req, res) => {
    res.json({ message: ' FlameBite API is running!' });
});



// ---------- REGISTER ----------
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, username, email, phone, password } = req.body;

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName, username, phone }
            }
        });

        if (authError) {
            return res.status(400).json({ message: authError.message });
        }

        const user = authData.user;

        const { error: profileError } = await supabase
            .from('users_profile')
            .insert([
                {
                    id: user.id,
                    full_name: fullName,
                    username: username,
                    phone: phone,
                    email: email,
                    role: 'user'
                }
            ]);

        if (profileError) {
            console.error('Profile error:', profileError);
            await supabase.auth.admin.deleteUser(user.id);
            return res.status(500).json({ message: 'Failed to create profile' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: {
                id: user.id,
                full_name: fullName,
                username: username,
                email: email,
                role: 'user'
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------- LOGIN ----------
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = authData.user;

        let { data: profile, error: profileError } = await supabase
            .from('users_profile')
            .select('*')
            .eq('id', user.id)
            .single();

        if (!profile) {
            const { data: newProfile } = await supabase
                .from('users_profile')
                .insert([
                    {
                        id: user.id,
                        full_name: user.user_metadata?.full_name || 'User',
                        username: user.user_metadata?.username || 'user_' + user.id.substring(0, 8),
                        email: user.email,
                        role: 'user'
                    }
                ])
                .select()
                .single();
            profile = newProfile;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: profile?.role || 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                full_name: profile?.full_name || user.user_metadata?.full_name || 'User',
                username: profile?.username || user.user_metadata?.username || '',
                email: user.email,
                role: profile?.role || 'user'  
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// ---------- GET ALL MENU ----------
app.get('/api/menu', async (req, res) => {
    try {
        const { data, error } = await supabase.from('menu_items').select('*').order('id');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------- ADD MENU ITEM (Admin only) ----------
app.post('/api/menu', auth, admin, async (req, res) => {
    try {
        const { data, error } = await supabase.from('menu_items').insert([req.body]).select().single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------- DELETE MENU ITEM (Admin only) ----------
app.delete('/api/menu/:id', auth, admin, async (req, res) => {
    try {
        await supabase.from('menu_items').delete().eq('id', req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



// ---------- CREATE ORDER ----------
app.post('/api/orders', auth, async (req, res) => {
    try {
        const { items, total_amount, delivery_address, phone } = req.body;
        const orderId = 'ORD-' + Date.now();

        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    id: orderId,
                    user_id: req.user.id,
                    items: items,
                    total_amount: total_amount,
                    delivery_address: delivery_address,
                    phone: phone,
                    status: 'pending'
                }
            ])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error(' Create order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET ALL ORDERS (Admin only) - MUST BE FIRST
app.get('/api/orders/all', auth, admin, async (req, res) => {
    try {
        console.log(' Fetching all orders...');
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(' Orders error:', error);
            return res.status(500).json({ message: error.message });
        }

        console.log(' Orders found:', data?.length || 0);
        res.json(data || []);
    } catch (error) {
        console.error(' Orders catch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

//  GET USER ORDERS - MUST BE AFTER /all
app.get('/api/orders/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(' Fetching orders for user:', userId);
        
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(' User orders error:', error);
            return res.status(500).json({ message: error.message });
        }

        console.log(' Orders found for user:', data?.length || 0);
        res.json(data || []);
    } catch (error) {
        console.error(' Get user orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------- UPDATE ORDER STATUS (Admin only) ----------
app.put('/api/orders/:id/status', auth, admin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from('orders')
            .update({ status: status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(data);
    } catch (error) {
        console.error(' Update order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// ---------- GET ALL USERS (Admin only) ----------
app.get('/api/users', auth, admin, async (req, res) => {
    try {
        console.log('📥 Fetching all users...');
        
        //  Use service role to bypass RLS completely
        const { data, error } = await supabase
            .from('users_profile')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(' Users error:', error);
            return res.status(500).json({ message: error.message });
        }

        console.log(' Users found:', data?.length || 0);
        res.json(data || []);
    } catch (error) {
        console.error(' Users catch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------- DELETE USER (Admin only) ----------
app.delete('/api/users/:id', auth, admin, async (req, res) => {
    try {
        await supabase.auth.admin.deleteUser(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------- ADD TO FAVOURITES ----------
app.post('/api/favourites', auth, async (req, res) => {
    try {
        const { menuItemId } = req.body;
        const { data, error } = await supabase
            .from('favourites')
            .insert([{ user_id: req.user.id, menu_item_id: menuItemId }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') return res.status(200).json({ message: 'Already in favourites' });
            throw error;
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------- GET USER FAVOURITES ----------
app.get('/api/favourites/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        const { data, error } = await supabase
            .from('favourites')
            .select(`menu_items (*)`)
            .eq('user_id', userId);

        if (error) throw error;
        const items = data.map(f => f.menu_items);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// ---------- GET ALL CONTACT MESSAGES (Admin only) ----------
app.get('/api/contact', auth, admin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// ---------- SAVE CONTACT MESSAGE ----------
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        console.log(' Contact message from:', email);

        const { data, error } = await supabase
            .from('contact_messages')
            .insert([
                {
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    status: 'unread'
                }
            ])
            .select()
            .single();

        if (error) {
            console.error(' Contact DB error:', error);
            return res.status(500).json({ message: error.message });
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully!',
            data: data
        });

    } catch (error) {
        console.error(' Contact error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------- MARK MESSAGE AS READ (Admin only) ----------
app.put('/api/contact/:id/read', auth, admin, async (req, res) => {
    try {
        await supabase.from('contact_messages').update({ status: 'read' }).eq('id', req.params.id);
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Connected to Supabase`);
});

console.log(' All routes loaded!');