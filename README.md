  FlameBite – Full Stack Restaurant Management System

 📋 Project Overview

FlameBite is a comprehensive, production-ready restaurant management platform that seamlessly bridges the gap between customers and restaurant operations. Built with a modern tech stack, it delivers an exceptional user experience for both diners and administrators.

🎯 Key Highlights

- ✅ **Complete Restaurant Solution** – From browsing menu to order fulfillment
- ✅ **Real-time Data Sync** – Powered by Supabase PostgreSQL
- ✅ **Role-Based Access** – Separate interfaces for users and administrators
- ✅ **Secure Authentication** – JWT-based auth with Supabase
- ✅ **Responsive Design** – Perfect experience on all devices
- ✅ **Production Ready** – Clean code, best practices, scalable architecture

---

 ✨ Feature Rich Experience

 🍔 Customer Features

| Feature | Description |
| :--- | :--- |
| **Smart Menu Browsing** | Real-time search, category filters, dynamic sorting (popularity, price) |
| **Intelligent Cart** | Persistent localStorage cart, quantity management, real-time total calculation |
| **Seamless Checkout** | Delivery details, order summary, instant confirmation |
| **Personal Dashboard** | Order history tracking, favourites management, profile customization |
| **Smart Favourites** | One-click save/remove, persistent across sessions |
| **Instant Feedback** | Toast notifications for all user actions |
| **Contact & Support** | Integrated messaging system with admin visibility |

 👨‍💼 Admin Features

| Feature | Description |
| :--- | :--- |
| **Comprehensive Dashboard** | Real-time analytics: Users, Menu, Orders, Revenue |
| **Menu Management** | Full CRUD operations with image support |
| **Order Fulfillment** | View, filter, update order status (pending → preparing → delivered → cancelled) |
| **User Management** | View all users, role management, user deletion |
| **Message Center** | View, read, delete contact messages |
| **Data Freshness** | Always syncs with database, no stale data |

---

 🛠️ Technology Stack

 Frontend Architecture


graph LR
    A[HTML5] --> B[CSS3]
    A --> C[JavaScript ES6]
    B --> D[Responsive Design]
    C --> E[DOM Manipulation]
    C --> F[API Integration]
    F --> G[Supabase]
    F --> H[Express API]


| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **HTML5** | - | Semantic markup, accessibility |
| **CSS3** | - | Custom properties, grid, flexbox, animations |
| **JavaScript** | ES6+ | Vanilla JS, async/await, modules |
| **Font Awesome** | 6.7.2 | Professional icon library |
| **Google Fonts** | Poppins | Modern typography |

### Backend Infrastructure

graph TD
    A[Express.js] --> B[JWT Auth]
    A --> C[Supabase Client]
    C --> D[PostgreSQL]
    D --> E[Users]
    D --> F[Menu Items]
    D --> G[Orders]
    D --> H[Favourites]
    D --> I[Messages]


| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | 18+ | JavaScript runtime |
| **Express.js** | 4.18.2 | Web framework |
| **JWT** | 9.0.2 | Authentication |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Supabase** | 2.38.0 | PostgreSQL + Auth |
| **dotenv** | 16.3.1 | Environment management |

 Database Schema (5 Tables)


-- ER Diagram (simplified)
users_profile (id, full_name, username, email, phone, address, role, created_at)
    ↑
    │
orders (id, user_id → users_profile.id, items, total_amount, delivery_address, phone, status, created_at)
    │
favourites (id, user_id → users_profile.id, menu_item_id → menu_items.id, created_at)
    │
menu_items (id, name, description, price, image, category, rating, popular, created_at)
    │
contact_messages (id, name, email, subject, message, status, created_at)
```

---

## 📁 Project Architecture

### Directory Structure

```
FlameBite/
├── 🎨 Frontend (Static Files)
│   ├── admin/                    # Admin Panel
│   │   ├── index.html            # Dashboard
│   │   ├── login.html            # Admin Login
│   │   └── messages.html         # Message Center
│   ├── assets/                   # Static Assets
│   │   └── images/               # Organized by category
│   │       ├── burger/
│   │       ├── pizza/
│   │       ├── fries/
│   │       ├── drinks/
│   │       └── slides/
│   ├── css/                      # Stylesheets (12+ files)
│   │   ├── style.css             # Global variables & utilities
│   │   ├── admin.css             # Admin panel styles
│   │   ├── auth.css              # Login/Register styles
│   │   └── ...
│   ├── js/                       # JavaScript Logic (17+ files)
│   │   ├── api.js                # Centralized API handler
│   │   ├── storage.js            # localStorage management
│   │   ├── auth.js               # Authentication helpers
│   │   └── ...
│   └── pages/                    # User Pages (12 pages)
│       ├── index.html            # Home
│       ├── menu.html             # Menu
│       ├── cart.html             # Cart
│       ├── checkout.html         # Checkout
│       ├── dashboard.html        # User Dashboard
│       └── ...
│
└── ⚙️ Backend (API Server)
    └── backend/
        ├── server.js             # Main Express application
        ├── config/
        │   └── supabase.js       # Supabase client configuration
        ├── .env                  # Environment variables
        └── package.json          # Dependencies
```

---

## 🔐 Authentication Flow

### Registration Process

```
User → Register Form → Supabase Auth
        ↓
    Email/Password Validation
        ↓
    User Created in auth.users
        ↓
    Trigger → users_profile Insert
        ↓
    Auto-login Session
        ↓
    Redirect → Dashboard


 Login Process


User → Login Form → Express API
        ↓
    Supabase Auth Validation
        ↓
    JWT Token Generation
        ↓
    Session → localStorage
        ↓
    Role Check → Redirect (User/Admin)




 🌐 API Reference

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/register` | Public | Create new account |
| `POST` | `/api/login` | Public | Authenticate user |

 Core Data Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/menu` | Public | Get all menu items |
| `POST` | `/api/orders` | User | Place new order |
| `GET` | `/api/orders/all` | Admin | Get all orders |
| `GET` | `/api/users` | Admin | Get all users |
| `POST` | `/api/favourites` | User | Add to favourites |
| `GET` | `/api/favourites/:userId` | User | Get user favourites |
| `POST` | `/api/contact` | Public | Send contact message |
| `GET` | `/api/contact` | Admin | Get all messages |

 Admin Management Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/menu` | Admin | Add menu item |
| `DELETE` | `/api/menu/:id` | Admin | Delete menu item |
| `PUT` | `/api/orders/:id/status` | Admin | Update order status |
| `DELETE` | `/api/users/:id` | Admin | Delete user |
| `PUT` | `/api/contact/:id/read` | Admin | Mark message read |
| `DELETE` | `/api/contact/:id` | Admin | Delete message |

---

 🚀 Quick Start

 Prerequisites

Node.js >= 18.x
npm >= 9.x
Supabase Account (Free Tier)
Git


 Installation (5 Minutes)


 1. Clone repository
git clone https://github.com/aqeelkhaliq/Full-Stack-Flamebite.git
cd Full-Stack-Flamebite

 2. Install backend dependencies
cd backend
npm install

 3. Configure environment
cp .env.example .env
 Edit .env with your Supabase credentials

 4. Initialize database
 Run schema.sql in Supabase SQL Editor

 5. Start server
node server.js

 6. Open application
 http://localhost:5000/pages/index.html


 Environment Configuration

env
 .env file
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIs...
JWT_SECRET=your-secret-key-2026


---

 📊 Database Setup

 Supabase Configuration

1. **Create Project** – New Supabase project
2. **Run Schema** – Execute `schema.sql` in SQL Editor
3. **Enable Auth** – Email/Password (disable email confirmation for testing)
4. **Get Keys** – Settings → API → Copy credentials

 Key Tables

| Table | Purpose | RLS |
| :--- | :--- | :--- |
| `users_profile` | User profiles | ✅ Enabled |
| `menu_items` | Menu catalog | Public Read |
| `orders` | Order history | User/Admin |
| `favourites` | User favourites | User |
| `contact_messages` | Contact form | Insert/Admin Read |

---

 🔒 Security Features

- ✅ **JWT Authentication** – Stateless, secure token-based auth
- ✅ **Row Level Security (RLS)** – Database-level access control
- ✅ **Password Hashing** – bcrypt for secure password storage
- ✅ **Role-Based Access** – User vs Admin permissions
- ✅ **Input Validation** – Server-side validation
- ✅ **CORS Protection** – Controlled cross-origin requests
- ✅ **No Hardcoded Secrets** – All keys in `.env`

---

 📱 Responsive Design

| Device | Breakpoint | Features |
| :--- | :--- | :--- |
| **Desktop** | > 1200px | Full layout, multi-column grid |
| **Laptop** | 992px – 1200px | Optimized spacing |
| **Tablet** | 768px – 992px | 2-column layout, collapsible menu |
| **Mobile** | < 768px | Single column, hamburger menu |
| **Small Mobile** | < 480px | Extra compact design |



 🧪 Testing Credentials

 Admin Access


📧 Email: test@gmail.com
🔑 Password: password123
👤 Role: admin


### User Access

text
📧 Email:habibkhaliq@gmail.com
🔑 Password: 12345678
👤 Role: user
`



 📈 Performance Optimizations

- ✅ **Lazy Loading** – Images load on scroll
- ✅ **Minified Assets** – CSS & JS optimization
- ✅ **API Caching** – Smart cache headers
- ✅ **Database Indexing** – Optimized queries
- ✅ **LocalStorage** – Cart persistence, no API calls
- ✅ **Debouncing** – Search input optimization

---

🎯 Future Roadmap

### Phase 2 (Coming Soon)

- [ ] **Payment Integration** – Stripe/JazzCash
- [ ] **Email Confirmation** – Resend/SMTP
- [ ] **Order Tracking** – Real-time status updates
- [ ] **Reviews & Ratings** – Customer feedback system

 Phase 3 (Planned)

- [ ] **Mobile App** – React Native
- [ ] **Push Notifications** – Order updates
- [ ] **Live Chat** – Customer support
- [ ] **Analytics Dashboard** – Sales insights

---
Photos:

 📄 License

MIT License – See [LICENSE](LICENSE) file for details.

---

 👨‍💻 Developer

 Aqeel Khaliq

- 🐙 GitHub: [@aqeelkhaliq](https://github.com/aqeelkhaliq)
- 📧 Email: aqeel.khalique2584@gmail.com


---

 🙏 Acknowledgments

Special thanks to:

- [Supabase](https://supabase.com) – Database & Authentication
- [Font Awesome](https://fontawesome.com) – Icons
- [Google Fonts](https://fonts.google.com) – Typography
- [Express.js](https://expressjs.com) – Backend framework

---

 📊 Project Metrics

| Metric | Value |
| :--- | :--- |
| **Total Pages** | 14 (12 User + 2 Admin) |
| **JavaScript Files** | 17 |
| **CSS Files** | 12 |
| **Database Tables** | 5 |
| **API Endpoints** | 15+ |
| **Lines of Code** | 5000+ |
| **Development Time** | 4 Weeks |

---

 ⭐ Show Your Support

If you found this project helpful, please consider:

1. ⭐ Starring the repository
2. 🍴 Forking it
3. 📣 Sharing it with others
4. 💬 Providing feedback

---

 📞 Contact & Support

For queries, support, or collaboration:

- 📧 **Email:** aqeel.khalique2584@gmail.com
- 🐙 **GitHub:** [aqeelkhaliq](https://github.com/aqeelkhaliq)
- 📱 **LinkedIn:** [[Your LinkedIn URL](https://www.linkedin.com/in/aqeel-khaliq-385a25382/)]

---

**Built with ❤️ by Aqeel Khaliq**

---

 🎯 Quick Links

| Resource | URL |
| :--- | :--- |
| Repository | [GitHub](https://github.com/aqeelkhaliq/Full-Stack-Flamebite) |
| Documentation | [README.md](README.md) |
| Issues | [GitHub Issues](https://github.com/aqeelkhaliq/Full-Stack-Flamebite/issues) |

---

*Last Updated: July 2026*
