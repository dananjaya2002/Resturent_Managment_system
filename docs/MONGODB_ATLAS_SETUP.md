# MongoDB Atlas Setup Guide

## Step-by-Step Guide to Connect Your Restaurant Management System to MongoDB Atlas

---

## Part 1: Create MongoDB Atlas Account & Cluster

### Step 1: Sign Up for MongoDB Atlas

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your email or use Google/GitHub authentication
3. Complete the registration process

### Step 2: Create a New Cluster

1. After logging in, click **"Build a Database"** or **"Create"**
2. Choose **"M0 Free"** tier (perfect for development)
   - Select your preferred cloud provider (AWS, Google Cloud, or Azure)
   - Choose a region closest to your location
   - Click **"Create Cluster"**
3. Wait 3-5 minutes for cluster creation

### Step 3: Create Database User

1. In the **Security** section, click **"Database Access"**
2. Click **"+ ADD NEW DATABASE USER"**
3. Choose **"Password"** authentication method
4. Enter username (e.g., `admin` or `restaurant_user`)
5. Enter a strong password (save this - you'll need it!)
6. Under **"Database User Privileges"**, select **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Whitelist Your IP Address

1. In the **Security** section, click **"Network Access"**
2. Click **"+ ADD IP ADDRESS"**
3. Choose one of these options:
   - **For Development**: Click **"ALLOW ACCESS FROM ANYWHERE"** (0.0.0.0/0)
   - **For Production**: Click **"ADD CURRENT IP ADDRESS"** (recommended)
4. Click **"Confirm"**

### Step 5: Get Your Connection String

1. Click **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Choose **Driver: Node.js** and **Version: 5.5 or later**
5. Copy the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Important**: Replace `<username>` and `<password>` with your actual credentials

---

## Part 2: Configure Your Application

### Step 6: Update Server Environment Variables

1. Open or create `server/.env` file
2. Update the `DATABASE_URL` with your MongoDB Atlas connection string:

```env
# Environment Configuration
NODE_ENV=development
PORT=5000

# MongoDB Atlas Connection String
# Replace <username>, <password>, and <database-name>
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority

# JWT Secret (generate a strong secret)
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Client URL
CLIENT_URL=http://localhost:5173
```

**Example** (with actual values):

```env
DATABASE_URL=mongodb+srv://admin:MyPassword123@cluster0.abc12.mongodb.net/restaurant_db?retryWrites=true&w=majority
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
CLIENT_URL=http://localhost:5173
```

### Step 7: Verify Database Configuration File

Make sure your `server/src/config/db.js` is correctly configured:

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## Part 3: Test the Connection

### Step 8: Install Dependencies (if not already done)

```bash
cd server
npm install mongoose dotenv
```

### Step 9: Start Your Server

```bash
cd server
npm start
```

**Expected Output:**

```
Server running on port 5000
MongoDB Connected: cluster0-shard-00-02.xxxxx.mongodb.net
```

If you see "MongoDB Connected", congratulations! 🎉

---

## Part 4: Verify Data in MongoDB Atlas

### Step 10: Check Your Database in Atlas

1. Go back to MongoDB Atlas dashboard
2. Click **"Browse Collections"** on your cluster
3. You should see your database `restaurant_db` (after first API call)
4. Collections will appear as you use the application:
   - `users` - After user registration
   - `categories` - After creating categories
   - `menuitems` - After creating menu items

---

## Troubleshooting Common Issues

### Issue 1: "MongoServerError: bad auth"

**Solution**:

- Double-check username and password in connection string
- Make sure there are no special characters (or URL-encode them)
- Verify database user exists in Atlas

### Issue 2: "MongooseServerSelectionError: connect ETIMEDOUT"

**Solution**:

- Check Network Access whitelist in Atlas
- Make sure your IP is allowed (or use 0.0.0.0/0 for development)
- Check your internet connection

### Issue 3: Connection string not loading

**Solution**:

- Make sure `.env` file is in the `server/` directory
- Verify `require('dotenv').config()` is called in `server.js`
- Restart your server after changing `.env`

### Issue 4: Special characters in password

**Solution**:

- URL-encode special characters in your password:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `$` becomes `%24`
  - Example: `Pass@123` → `Pass%40123`

---

## Security Best Practices

### ✅ DO:

- Use strong passwords (at least 12 characters)
- Enable IP whitelisting in production
- Use environment variables for sensitive data
- Never commit `.env` file to Git
- Rotate credentials regularly

### ❌ DON'T:

- Use simple passwords like "password123"
- Allow access from anywhere (0.0.0.0/0) in production
- Hardcode credentials in your code
- Share your connection string publicly
- Commit `.env` to version control

---

## Production Deployment Checklist

When deploying to production:

1. **Update Network Access**

   - Remove 0.0.0.0/0 whitelist
   - Add your production server IP addresses

2. **Environment Variables**

   - Set DATABASE_URL in your hosting platform
   - Use platform's environment variable system (Heroku, Vercel, etc.)

3. **Connection String**

   - Update database name from `restaurant_db` to production DB
   - Consider using a different cluster for production

4. **Monitoring**
   - Enable Atlas monitoring and alerts
   - Set up connection pooling
   - Monitor database performance

---

## Additional MongoDB Atlas Features

### Database Triggers

- Set up automated functions on data changes
- Useful for sending notifications, logging, etc.

### Backups

- Atlas provides automated backups (even on free tier)
- Configure backup retention policies

### Performance Monitoring

- View slow queries
- Monitor connection statistics
- Set up custom alerts

### Data API

- RESTful API access to your data
- Useful for third-party integrations

---

## Useful MongoDB Atlas Commands

### Via MongoDB Compass (GUI)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Use your connection string to connect
3. Browse and edit data visually

### Via MongoDB Shell

```bash
# Install MongoDB Shell
npm install -g mongosh

# Connect to Atlas
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/restaurant_db" --username <username>
```

---

## Next Steps

After successful connection:

1. ✅ Test user registration at `/api/auth/register`
2. ✅ Test user login at `/api/auth/login`
3. ✅ Create categories via admin dashboard
4. ✅ Create menu items via admin dashboard
5. ✅ Verify data appears in MongoDB Atlas

---

## Need Help?

- **MongoDB Atlas Documentation**: https://docs.atlas.mongodb.com/
- **Mongoose Documentation**: https://mongoosejs.com/docs/
- **Connection String Format**: https://docs.mongodb.com/manual/reference/connection-string/

---

## Quick Reference

### Connection String Format

```
mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

### Example `.env` File

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb+srv://myuser:mypass123@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority
JWT_SECRET=generate_a_long_random_string_here
CLIENT_URL=http://localhost:5173
```

### Test Connection Command

```bash
cd server && npm start
```

**Look for**: `MongoDB Connected: cluster0-shard-00-xx.xxxxx.mongodb.net`

---

Good luck! 🚀
