# MongoDB Atlas Visual Setup Guide

## 🚀 Quick Start Checklist

- [ ] Create MongoDB Atlas account
- [ ] Create free M0 cluster
- [ ] Create database user
- [ ] Whitelist IP address
- [ ] Copy connection string
- [ ] Update `.env` file
- [ ] Test connection

---

## 📋 Detailed Steps with Screenshots Guide

### Step 1: Create MongoDB Atlas Account

**What to do:**

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up using email or Google/GitHub
3. Verify your email

**Time:** ~2 minutes

---

### Step 2: Create a Free Cluster

**What to do:**

1. Click "Build a Database"
2. Select **"M0 FREE"** option
3. Choose your cloud provider (AWS recommended)
4. Select region closest to you
5. Cluster Name: Keep default or name it `restaurant-cluster`
6. Click "Create"

**Settings:**

```
Provider: AWS (or Google Cloud/Azure)
Region: Choose closest to your location
Tier: M0 Sandbox (FREE)
```

**Wait time:** 3-5 minutes for cluster creation

---

### Step 3: Create Database User

**What to do:**

1. Go to "Database Access" (under Security in left menu)
2. Click "+ ADD NEW DATABASE USER"
3. Select "Password" authentication

**Fill in:**

```
Username: restaurant_admin
Password: [Click "Autogenerate Secure Password" or create your own]
```

**⚠️ IMPORTANT:** Save your password somewhere safe!

**User Privileges:**

- Select: "Read and write to any database"

**Click:** "Add User"

---

### Step 4: Whitelist IP Address

**What to do:**

1. Go to "Network Access" (under Security in left menu)
2. Click "+ ADD IP ADDRESS"

**Choose one:**

**Option A - Development (easier):**

```
Click "ALLOW ACCESS FROM ANYWHERE"
IP Address: 0.0.0.0/0
```

**Option B - Production (more secure):**

```
Click "ADD CURRENT IP ADDRESS"
Your IP will be auto-filled
```

**Click:** "Confirm"

---

### Step 5: Get Connection String

**What to do:**

1. Go to "Database" (in left menu)
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Select:
   - Driver: **Node.js**
   - Version: **5.5 or later**

**Copy the connection string:**

```
mongodb+srv://restaurant_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**⚠️ IMPORTANT:**

- Replace `<password>` with your actual database user password
- Add database name before the `?`: `/restaurant_db?`

**Final connection string should look like:**

```
mongodb+srv://restaurant_admin:MyP@ssw0rd@cluster0.abc12.mongodb.net/restaurant_db?retryWrites=true&w=majority
```

---

### Step 6: Configure Your Application

**Location:** `server/.env`

**Create the file:**

```bash
cd server
cp .env.example .env
```

**Edit `server/.env`:**

```env
NODE_ENV=development
PORT=5000

# Paste your connection string here
MONGO_URI=mongodb+srv://restaurant_admin:MyP@ssw0rd@cluster0.abc12.mongodb.net/restaurant_db?retryWrites=true&w=majority

# Generate a random secret (or use the command below)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0

CLIENT_URL=http://localhost:5173
```

**Generate JWT_SECRET (optional):**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Step 7: Test Connection

**Start your server:**

```bash
cd server
npm install
npm start
```

**Expected output:**

```
Server running on port 5000
MongoDB Connected: cluster0-shard-00-02.abc12.mongodb.net
```

**✅ Success!** If you see "MongoDB Connected", you're all set!

**❌ Error?** Check [Troubleshooting](#troubleshooting) below

---

### Step 8: Verify in Atlas Dashboard

**What to do:**

1. Go back to MongoDB Atlas
2. Click "Browse Collections" on your cluster
3. You should see `restaurant_db` database after making your first API call

**Collections will appear as you use the app:**

- `users` - After first user registration
- `categories` - After creating first category
- `menuitems` - After creating first menu item
- `orders` - After placing first order (Phase 4)

---

## 🔧 Troubleshooting

### Error: "MongoServerError: bad auth"

**Cause:** Incorrect username or password

**Solution:**

1. Check your connection string
2. Verify username and password match what you created
3. If password has special characters, URL-encode them:
   ```
   @ → %40
   # → %23
   $ → %24
   % → %25
   ^ → %5E
   & → %26
   ```

**Example:**

```
Password: Pass@123#
Encoded:  Pass%40123%23
```

---

### Error: "MongooseServerSelectionError"

**Cause:** Network access not configured or IP not whitelisted

**Solution:**

1. Go to Atlas → Network Access
2. Make sure your IP is whitelisted
3. For development, use `0.0.0.0/0`
4. Wait 2-3 minutes after adding IP

---

### Error: "Connection string not found"

**Cause:** `.env` file not loaded properly

**Solution:**

1. Make sure `.env` file is in `server/` directory
2. Check file name is exactly `.env` (not `.env.txt`)
3. Restart your server
4. Make sure `require('dotenv').config()` is at top of `server.js`

---

### Error: "ENOTFOUND cluster0.xxxxx.mongodb.net"

**Cause:** DNS or internet connectivity issue

**Solution:**

1. Check your internet connection
2. Try pinging Google: `ping google.com`
3. Check if your firewall is blocking MongoDB
4. Try using different network (mobile hotspot)

---

## 📝 Connection String Breakdown

```
mongodb+srv://username:password@cluster-url/database-name?options
```

**Parts:**

- `mongodb+srv://` - Protocol (use SRV for Atlas)
- `username` - Your database user (not Atlas login)
- `password` - Database user password (URL-encoded)
- `cluster-url` - Your cluster address (from Atlas)
- `database-name` - Your database name (`restaurant_db`)
- `options` - Connection options (`retryWrites=true&w=majority`)

---

## 🔒 Security Reminders

**✅ DO:**

- Keep your password secure
- Use strong passwords (12+ characters)
- Use IP whitelisting in production
- Use environment variables
- Regularly rotate credentials

**❌ DON'T:**

- Commit `.env` to Git
- Share your connection string publicly
- Use simple passwords
- Allow 0.0.0.0/0 in production
- Hardcode credentials in code

---

## 🎯 Next Steps After Connection

1. **Test User Registration**

   ```bash
   POST http://localhost:5000/api/auth/register
   {
     "name": "Admin User",
     "email": "admin@test.com",
     "password": "admin123",
     "role": "admin"
   }
   ```

2. **Test User Login**

   ```bash
   POST http://localhost:5000/api/auth/login
   {
     "email": "admin@test.com",
     "password": "admin123"
   }
   ```

3. **Create Categories** (Admin Dashboard)

   - Login to frontend as admin
   - Go to `/admin`
   - Create categories

4. **Create Menu Items** (Admin Dashboard)

   - Add menu items to categories
   - Set prices and details

5. **View Public Menu**
   - Go to `/menu`
   - Browse menu items
   - Filter by category

---

## 🛠️ Useful MongoDB Atlas Features

### Monitor Your Database

1. Go to "Metrics" tab in Atlas
2. View:
   - Operations per second
   - Network traffic
   - Connections
   - Query performance

### Set Up Alerts

1. Go to "Alerts" in Atlas
2. Configure email alerts for:
   - High connection count
   - Slow queries
   - Storage usage

### Backups

1. Go to "Backup" tab
2. Atlas automatically backs up your data
3. Configure retention period
4. Test restore process

---

## 📚 Resources

- **Full Setup Guide:** [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)
- **Atlas Docs:** https://docs.atlas.mongodb.com/
- **Connection Strings:** https://docs.mongodb.com/manual/reference/connection-string/
- **Mongoose Docs:** https://mongoosejs.com/docs/

---

## 💡 Pro Tips

1. **Use MongoDB Compass (GUI)**

   - Download from: https://www.mongodb.com/products/compass
   - Connect using your connection string
   - View and edit data visually

2. **Use MongoDB Shell**

   ```bash
   npm install -g mongosh
   mongosh "your-connection-string"
   ```

3. **Monitor Logs**

   - Check Atlas logs for errors
   - Monitor slow queries
   - Set up real-time alerts

4. **Database Naming**
   - Use descriptive names
   - Separate dev/staging/prod databases
   - Example: `restaurant_db_dev`, `restaurant_db_prod`

---

## ✨ You're All Set!

Once connected successfully, you can:

- ✅ Register users
- ✅ Create categories
- ✅ Add menu items
- ✅ Place orders (Phase 4)
- ✅ View data in Atlas dashboard

**Happy coding! 🚀**
