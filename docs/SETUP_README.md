# Restaurant Management System - Setup Guide

## 🚀 Quick Start

### 1. Database Setup (MongoDB Atlas)

**IMPORTANT:** Before running the application, set up your MongoDB Atlas database.

📖 **Follow the complete guide:** [MongoDB Atlas Setup Guide](docs/MONGODB_ATLAS_SETUP.md)

**Quick checklist:**

- [ ] Create MongoDB Atlas account (free)
- [ ] Create M0 cluster (free tier)
- [ ] Create database user
- [ ] Whitelist your IP (0.0.0.0/0 for development)
- [ ] Copy connection string
- [ ] Configure `server/.env`

**Need help?** See the [Visual Guide](docs/MONGODB_ATLAS_VISUAL_GUIDE.md) with step-by-step instructions.

---

### 2. Configure Environment Variables

Create `server/.env` file:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your MongoDB Atlas connection string:

```env
NODE_ENV=development
PORT=5000

# Your MongoDB Atlas connection string
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority

# Generate a strong secret
JWT_SECRET=your_super_secret_jwt_key_here

CLIENT_URL=http://localhost:5173
```

**⚠️ Replace:**

- `username` - Your MongoDB Atlas username
- `password` - Your MongoDB Atlas password
- `cluster0.xxxxx.mongodb.net` - Your cluster URL

---

### 3. Install Dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd client
npm install
```

---

### 4. Start the Application

**Terminal 1 - Backend:**

```bash
cd server
npm start
```

Expected output: `MongoDB Connected: cluster0-shard-00-xx.xxxxx.mongodb.net`

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

**Access the application:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 📚 Complete Documentation

### Setup Guides

- **[MongoDB Atlas Setup](docs/MONGODB_ATLAS_SETUP.md)** - Complete database setup guide
- **[Visual Setup Guide](docs/MONGODB_ATLAS_VISUAL_GUIDE.md)** - Step-by-step with troubleshooting
- **[Quick Start](README_QUICKSTART.md)** - Development reference guide
- **[Server Setup](server/SETUP.md)** - Backend configuration

### Project Documentation

- **[Phase 3 Summary](docs/phase3_summary.md)** - Latest implementation details
- **[Tasks](docs/tasks/tasks.md)** - Project task tracking
- **[Walkthrough](docs/tasks/walkthrough.md)** - Development walkthrough

---

## 🎯 Current Status

### Completed Phases ✅

- Phase 1: Project Initialization & Architecture
- Phase 1.5: DevOps & Testing Setup
- Phase 2: Authentication & User Management
- Phase 3: Menu Management

### Next Phase ⏳

- Phase 4: Order Management (Core)

---

## 🔧 Common Issues

### "MongoDB Connected" not showing?

**Check:**

1. Is MongoDB Atlas cluster created? (takes 3-5 minutes)
2. Is your IP whitelisted? (Network Access in Atlas)
3. Is connection string correct in `.env`?
4. Special characters in password? (URL-encode them)

**See:** [Troubleshooting Guide](docs/MONGODB_ATLAS_SETUP.md#troubleshooting-common-issues)

### "MongoServerError: bad auth"

- Username or password incorrect
- Check your database user credentials in Atlas
- See [guide](docs/MONGODB_ATLAS_VISUAL_GUIDE.md#error-mongoservererror-bad-auth)

### ".env file not loading"

- Ensure file is named exactly `.env` (not `.env.txt`)
- File should be in `server/` directory
- Restart server after changes

---

## 🧪 Testing

Run backend tests:

```bash
cd server
npm test
```

Expected: All 18 tests passing ✓

---

## 👥 User Roles

### Customer (Default)

- View menu
- Place orders (Phase 4)
- View order history (Phase 4)

### Admin

- All customer features
- Manage categories
- Manage menu items
- View all orders (Phase 4)
- Update order status (Phase 4)

**Create admin user:**

1. Register normally at `/register`
2. Update user role in MongoDB Atlas:
   - Go to Browse Collections
   - Find `users` collection
   - Edit user document
   - Set `role: "admin"`

---

## 🌐 API Endpoints

### Authentication (Public)

```
POST /api/auth/register  - Register new user
POST /api/auth/login     - Login user
GET  /api/auth/profile   - Get user profile (requires token)
```

### Categories

```
Public:
GET  /api/categories     - Get all active categories
GET  /api/categories/:id - Get single category

Admin:
POST   /api/categories     - Create category
PUT    /api/categories/:id - Update category
DELETE /api/categories/:id - Delete category
```

### Menu Items

```
Public:
GET  /api/menu     - Get all menu items
                     Query: ?category=ID&isAvailable=true&search=term
GET  /api/menu/:id - Get single menu item

Admin:
POST   /api/menu     - Create menu item
PUT    /api/menu/:id - Update menu item
DELETE /api/menu/:id - Delete menu item
```

---

## 🖥️ Frontend Routes

```
/            - Home page
/login       - Login page
/register    - Registration page
/menu        - Public menu (all users)
/admin       - Admin dashboard (admin only)
```

---

## 📦 Technology Stack

### Frontend

- React 18 with Vite
- React Router v6
- Axios for API calls
- Context API for state management

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Socket.IO for real-time features

### Testing

- Jest
- Supertest
- MongoDB mocking

---

## 🔐 Security Notes

**✅ Good practices in this project:**

- JWT token authentication
- Password hashing with bcrypt
- Protected admin routes
- CORS configuration
- Environment variables for secrets

**⚠️ For production:**

- Use strong JWT secrets
- Enable HTTPS
- Restrict IP whitelist in Atlas
- Add rate limiting
- Implement input validation
- Add logging and monitoring

---

## 🆘 Need Help?

1. **Database Setup Issues:** [MongoDB Atlas Setup Guide](docs/MONGODB_ATLAS_SETUP.md)
2. **Visual Guide:** [Step-by-step with screenshots](docs/MONGODB_ATLAS_VISUAL_GUIDE.md)
3. **API Reference:** [Quick Start Guide](README_QUICKSTART.md)
4. **Project Structure:** See [Phase 3 Summary](docs/phase3_summary.md)

---

## 📝 License

This project is for educational purposes.

---

**Happy coding! 🚀**

For detailed technical documentation, see [README_QUICKSTART.md](README_QUICKSTART.md)
