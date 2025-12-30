# Restaurant Management System - Deployment Guide

This guide provides step-by-step instructions for deploying your Restaurant Management System to production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (MongoDB Atlas)](#database-setup)
3. [Backend Deployment (Render)](#backend-deployment)
4. [Frontend Deployment (Vercel)](#frontend-deployment)
5. [Alternative Deployment Options](#alternative-options)
6. [Post-Deployment Configuration](#post-deployment)
7. [Testing Your Deployment](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before you begin, ensure you have:

- ✅ A GitHub account (for code repository)
- ✅ Node.js 16+ installed locally
- ✅ Your project code pushed to GitHub
- ✅ A MongoDB Atlas account (free tier available)
- ✅ Accounts on deployment platforms (Render, Vercel, etc.)

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** and sign up
3. Verify your email address

### Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **"Shared"** (Free tier - M0)
3. Select your cloud provider and region (choose closest to your users)
4. Click **"Create Cluster"** (takes 1-3 minutes)

### Step 3: Configure Database Access

1. In left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username: `admin` (or your choice)
5. Click **"Autogenerate Secure Password"** and **save it securely**
6. Under **"Database User Privileges"**, select **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Configure Network Access

1. In left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, restrict to specific IPs if possible
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go back to **"Database"** in sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add your database name after `.net/` (e.g., `restaurant_db`):
   ```
   mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority
   ```

**Save this connection string - you'll need it for backend deployment!**

---

## 🚀 Backend Deployment (Render)

### Why Render?

- Free tier available
- Automatic deploys from GitHub
- Built-in SSL certificates
- Easy environment variable management

### Step 1: Prepare Backend Code

1. Ensure your `server/package.json` has a start script:

   ```json
   "scripts": {
     "start": "node src/server.js",
     "dev": "nodemon src/server.js",
     "test": "jest"
   }
   ```

2. Make sure your `server/src/server.js` uses `process.env.PORT`:
   ```javascript
   const PORT = process.env.PORT || 5000;
   ```

### Step 2: Create Render Account

1. Go to [Render.com](https://render.com/)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your restaurant management system repo
4. Configure the service:

   **Name**: `restaurant-backend` (or your choice)

   **Root Directory**: `server`

   **Environment**: `Node`

   **Build Command**: `npm install`

   **Start Command**: `npm start`

   **Plan**: `Free`

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

**Important**: Generate a strong JWT secret:

```bash
# In terminal, run:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes first time)
3. Once deployed, you'll get a URL like: `https://restaurant-backend-xxxx.onrender.com`

**Save your backend URL!**

### Step 6: Test Backend

Open in browser: `https://your-backend-url.onrender.com/`

You should see: `{"message": "Restaurant Ordering API is running"}`

---

## 🎨 Frontend Deployment (Vercel)

### Why Vercel?

- Optimized for React/Vite
- Free tier with unlimited deployments
- Automatic SSL
- Edge network for fast loading
- Preview deployments for pull requests

### Step 1: Prepare Frontend Code

1. Update `client/src/App.jsx` and all API calls to use environment variable:

   Create `client/.env.production`:

   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

2. In your code, use:

   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
   ```

3. Update Socket.IO connection in `client/src/context/SocketContext.jsx`:

   ```javascript
   const SOCKET_URL =
     import.meta.env.VITE_API_URL?.replace("/api", "") ||
     "http://localhost:5000";

   const socketInstance = io(SOCKET_URL, {
     // ... rest of config
   });
   ```

### Step 2: Update Backend CORS

Update your `server/src/server.js` to allow your frontend domain:

```javascript
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-frontend-domain.vercel.app", // Add after deployment
  ],
  credentials: true,
};

app.use(cors(corsOptions));
```

### Step 3: Create Vercel Account

1. Go to [Vercel.com](https://vercel.com/)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 4: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure the project:

   **Framework Preset**: `Vite`

   **Root Directory**: `client`

   **Build Command**: `npm run build`

   **Output Directory**: `dist`

### Step 5: Add Environment Variables

In **"Environment Variables"** section, add:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Step 6: Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Once deployed, you'll get a URL like: `https://your-project.vercel.app`

### Step 7: Update Backend CORS (Again)

Go back to Render dashboard:

1. Open your backend service
2. Go to **"Environment"**
3. Add new variable or update CORS in code:
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```
4. Update `server/src/server.js`:
   ```javascript
   const corsOptions = {
     origin: ["http://localhost:5173", process.env.FRONTEND_URL],
     credentials: true,
   };
   ```
5. Save and redeploy (automatic on Render)

---

## 🔄 Alternative Deployment Options

### Backend Alternatives

#### **Railway** (Recommended Alternative)

1. Go to [Railway.app](https://railway.app/)
2. Sign up with GitHub
3. New Project → Deploy from GitHub repo
4. Select `server` directory
5. Add same environment variables
6. Deploy

**Pros**: Easy, good free tier, fast
**Cons**: Free tier has limited hours/month

#### **Heroku**

1. Create Heroku account
2. Install Heroku CLI
3. `heroku create restaurant-backend`
4. `git subtree push --prefix server heroku main`
5. Set environment variables via dashboard

**Pros**: Well-documented, reliable
**Cons**: No free tier anymore (minimum $7/month)

#### **DigitalOcean App Platform**

1. Create DigitalOcean account
2. Apps → Create App → GitHub
3. Select repo and server directory
4. Configure build settings
5. Add environment variables

**Pros**: More control, good pricing
**Cons**: Steeper learning curve

### Frontend Alternatives

#### **Netlify**

1. Go to [Netlify.com](https://www.netlify.com/)
2. Sign up with GitHub
3. New site from Git → Choose repo
4. Base directory: `client`
5. Build command: `npm run build`
6. Publish directory: `client/dist`
7. Add environment variables

**Pros**: Similar to Vercel, good free tier
**Cons**: Slightly slower build times

#### **GitHub Pages**

1. Build locally: `cd client && npm run build`
2. Install gh-pages: `npm install -D gh-pages`
3. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Run: `npm run deploy`

**Pros**: Free, integrated with GitHub
**Cons**: Static only, no server-side features

---

## ⚙️ Post-Deployment Configuration

### 1. Create Admin User

Since admin users can't be created through registration, use MongoDB Atlas:

1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"**
3. Find **"users"** collection
4. Click **"Insert Document"**
5. Add:
   ```json
   {
     "name": "Admin User",
     "email": "admin@restaurant.com",
     "password": "$2a$10$hashed_password_here",
     "role": "admin"
   }
   ```

**OR** Register normally then update:

1. Register as customer through your website
2. Go to MongoDB Atlas → Collections → users
3. Find your user
4. Click edit
5. Change `"role": "customer"` to `"role": "admin"`

### 2. Test All Features

- ✅ User registration
- ✅ User login
- ✅ Browse menu
- ✅ Add to cart
- ✅ Checkout
- ✅ Order tracking
- ✅ Admin dashboard
- ✅ Real-time updates
- ✅ Logout

### 3. Add Custom Domain (Optional)

**Vercel:**

1. Domains → Add Domain
2. Enter your domain
3. Update DNS records at your registrar
4. Wait for SSL certificate (automatic)

**Render:**

1. Settings → Custom Domain
2. Enter your domain
3. Add CNAME record at registrar
4. SSL automatic

### 4. Set Up Monitoring

**Render Dashboard:**

- Check logs under "Logs" tab
- Set up email alerts

**MongoDB Atlas:**

- Enable monitoring
- Set up alerts for database issues

### 5. Enable Analytics (Optional)

Add Google Analytics to `client/index.html`:

```html
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"
></script>
```

---

## 🧪 Testing Your Deployment

### Backend Health Check

```bash
curl https://your-backend-url.onrender.com/
```

Expected: `{"message": "Restaurant Ordering API is running"}`

### Test API Endpoint

```bash
curl https://your-backend-url.onrender.com/api/categories
```

### Frontend Test

1. Open `https://your-frontend.vercel.app`
2. Check browser console (F12) for errors
3. Test login/registration
4. Test menu browsing
5. Test adding to cart
6. Place a test order

### Real-time Test

1. Open two browser windows
2. Window 1: Admin dashboard
3. Window 2: Customer order tracking
4. Update order status in admin
5. Verify customer sees real-time update

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**

1. Check MongoDB Atlas network access allows 0.0.0.0/0
2. Verify MONGO_URI is correct in environment variables
3. Check MongoDB Atlas cluster is running
4. Test connection string locally first

### Issue: "CORS Error"

**Solution:**

1. Add your frontend URL to CORS whitelist in `server/src/server.js`
2. Redeploy backend
3. Clear browser cache
4. Check browser console for exact error

### Issue: "Socket.IO not connecting"

**Solution:**

1. Verify WebSocket connections are enabled on hosting platform
2. Check Socket.IO URL in frontend matches backend URL
3. Ensure backend emits connection events
4. Check browser console for Socket.IO errors

### Issue: "Environment variables not working"

**Solution:**

1. For Vite: Variables must start with `VITE_`
2. Rebuild frontend after adding variables
3. Check spelling of variable names
4. Log variables to verify they're loaded: `console.log(import.meta.env)`

### Issue: "App is slow to load first time"

**Solution:**

- Free tier services "sleep" after inactivity
- Render: Keep-alive service or upgrade plan
- First request wakes server (20-30 seconds)
- Subsequent requests are fast

### Issue: "Orders not creating"

**Solution:**

1. Check browser console for errors
2. Verify JWT token is being sent
3. Check backend logs on Render
4. Test API endpoint directly with Postman
5. Verify MongoDB connection

---

## 📊 Performance Optimization

### Backend

1. Enable gzip compression:

   ```javascript
   const compression = require("compression");
   app.use(compression());
   ```

2. Add response caching for menu items

3. Optimize MongoDB queries with indexes

### Frontend

1. Enable code splitting in Vite
2. Optimize images (use WebP format)
3. Lazy load components
4. Enable service worker for PWA

---

## 🔐 Security Checklist

- [ ] Strong JWT secret (64+ characters)
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] MongoDB password is strong
- [ ] CORS properly configured
- [ ] Environment variables secured (not in code)
- [ ] Input validation on all forms
- [ ] Rate limiting enabled (optional)
- [ ] Regular security updates

---

## 📱 Making it a PWA (Progressive Web App)

1. Add `manifest.json` to `client/public/`:

   ```json
   {
     "name": "Restaurant Ordering System",
     "short_name": "RestoApp",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#ff5722",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "/icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

2. Add to `client/index.html`:

   ```html
   <link rel="manifest" href="/manifest.json" />
   <meta name="theme-color" content="#ff5722" />
   ```

3. Install service worker (vite-plugin-pwa)

---

## 📝 Deployment Checklist

Before going live:

- [ ] Database configured and accessible
- [ ] Backend deployed and returning data
- [ ] Frontend deployed and connected to backend
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Admin user created
- [ ] All features tested
- [ ] Real-time updates working
- [ ] SSL certificates active (HTTPS)
- [ ] Custom domain configured (if applicable)
- [ ] Error monitoring set up
- [ ] Backups configured for database
- [ ] Documentation updated with live URLs

---

## 🎉 You're Live!

Congratulations! Your restaurant management system is now deployed and accessible worldwide!

### Next Steps:

1. Share the URL with users
2. Monitor logs and errors
3. Gather user feedback
4. Plan new features
5. Regular maintenance and updates

### Maintenance:

- Check logs weekly
- Update dependencies monthly
- Monitor database size
- Review error reports
- Back up database regularly

---

## 📞 Support & Resources

- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev/
- **Express Docs**: https://expressjs.com/

---

**Deployment Guide Version**: 1.0
**Last Updated**: December 30, 2025

_Happy Deploying! 🚀_
