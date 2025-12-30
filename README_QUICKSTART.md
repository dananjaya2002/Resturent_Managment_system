# Quick Start Guide - Restaurant Management System

## Current Status: Phase 3 Complete ✓

### Completed Phases

- ✅ Phase 1: Project Initialization & Architecture
- ✅ Phase 1.5: DevOps & Testing Setup
- ✅ Phase 2: Authentication & User Management
- ✅ Phase 3: Menu Management

### Next Phase

- ⏳ Phase 4: Order Management (Core)

---

## Running the Application

### Prerequisites

- Node.js installed
- MongoDB running locally (default: mongodb://localhost:27017)
- Environment variables configured (JWT_SECRET, DATABASE_URL)

### Start Backend Server

```bash
cd server
npm start
```

Server runs on: http://localhost:5000

### Start Frontend Development Server

```bash
cd client
npm run dev
```

Client runs on: http://localhost:5173

### Run Tests

```bash
cd server
npm test
```

---

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Categories (Public)

- `GET /api/categories` - Get all active categories
- `GET /api/categories/:id` - Get single category

### Categories (Admin Only)

- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Menu Items (Public)

- `GET /api/menu` - Get all menu items
  - Query params: `?category=ID&isAvailable=true&search=term`
- `GET /api/menu/:id` - Get single menu item

### Menu Items (Admin Only)

- `POST /api/menu` - Create menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

---

## Frontend Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/menu` - Public menu (all users)
- `/admin` - Admin dashboard (admin only)

---

## Testing Admin Features

### Create Admin User

You can create an admin user by:

1. Registering a new user via `/register`
2. Manually setting `role: 'admin'` in MongoDB
3. Or modifying the registration to accept role parameter (for testing)

### Test Admin Dashboard

1. Login as admin user
2. Navigate to `/admin`
3. Create categories and menu items
4. Edit and delete items as needed

---

## Project Structure

```
resturent_mng_sys/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Menu.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/       # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   └── package.json
│
├── server/                # Node.js/Express backend
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   │   ├── User.js
│   │   │   ├── Category.js
│   │   │   └── MenuItem.js
│   │   ├── controllers/   # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── categoryController.js
│   │   │   └── menuController.js
│   │   ├── routes/        # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   └── menuRoutes.js
│   │   ├── middleware/    # Custom middleware
│   │   │   └── authMiddleware.js
│   │   ├── __tests__/     # Jest tests
│   │   ├── config/        # Configuration
│   │   ├── app.js         # Express app
│   │   └── server.js      # Server entry point
│   └── package.json
│
└── docs/                  # Documentation
    ├── tasks/
    │   ├── tasks.md
    │   └── walkthrough.md
    └── phase3_summary.md
```

---

## Development Tips

### Adding New Features

1. Backend: Create model → Controller → Routes → Tests
2. Frontend: Create page/component → Add route → Integrate API

### Environment Variables (server/.env)

```
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/restaurant_db
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
```

### Common Commands

```bash
# Install dependencies
cd server && npm install
cd client && npm install

# Run in development
npm run dev      # (from respective directories)

# Run tests
npm test         # (from server directory)

# Build for production
npm run build    # (from client directory)

# Lint code
npm run lint     # (from server directory)
```

---

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify database name matches

### Port Already in Use

- Change PORT in `.env` (server)
- Change port in `vite.config.js` (client)

### CORS Issues

- Verify CLIENT_URL in server `.env`
- Check cors configuration in `app.js`

### Authentication Issues

- Verify JWT_SECRET is set
- Check token in localStorage
- Ensure Authorization header format: `Bearer <token>`

---

## Next Steps (Phase 4)

1. Create Order Schema
2. Implement Cart Context
3. Build Cart Component
4. Create Checkout Page
5. Implement Order APIs
6. Add Order History/Tracking

---

## Resources

- Documentation: `/docs/`
- Task List: `/docs/tasks/tasks.md`
- Phase 3 Summary: `/docs/phase3_summary.md`
- Walkthrough: `/docs/tasks/walkthrough.md`
