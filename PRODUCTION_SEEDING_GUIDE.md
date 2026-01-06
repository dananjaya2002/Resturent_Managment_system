# 🌱 Production Database Seeding Guide

## Overview

This guide will help you populate your **Railway production database** with demo data including:

- 👥 **7 Demo Users** (Admin, Owner, Manager, Chef, Waiter, Cashier, Customer)
- 📁 **5 Categories** (Appetizers, Main Course, Desserts, Beverages, Salads)
- 🍽️ **23 Menu Items** across all categories
- 🪑 **10 Tables** with different capacities

---

## 🚀 Quick Start - Seed Production Database

### Method 1: Run from Local Machine (Recommended)

This connects your local terminal to Railway's production database.

#### Step 1: Navigate to Server Directory

```bash
cd c:\xampp\htdocs\resturent_mng_sys\server
```

#### Step 2: Create Production Environment File

Create a new file `.env.production` in the `server/` directory:

```bash
# server/.env.production
MONGO_URI=your_railway_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

**Important:** Get your MongoDB connection string from:

- Railway Dashboard → Your MongoDB Service → Variables → `MONGO_URL`

#### Step 3: Run the Seeding Script

```bash
# Option A: Use the production seeding script (all-in-one)
npm run seed:production

# Option B: Seed individually
npm run seed:users
npm run seed:tables
npm run seed:data
```

**For production specifically, use:**

```bash
node src/seedProduction.js
```

---

### Method 2: Run Directly on Railway

You can also run the seed script directly on Railway.

#### Step 1: Connect to Railway CLI

```bash
# Install Railway CLI (if not already installed)
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link
```

#### Step 2: Run Seed Command

```bash
# Run the seed script on Railway
railway run node src/seedProduction.js
```

---

## 📋 What Gets Seeded

### 👥 Demo Users

| Role         | Email              | Password    | Access Level                |
| ------------ | ------------------ | ----------- | --------------------------- |
| **Admin**    | admin@resto.com    | admin123    | Full system access          |
| **Owner**    | owner@resto.com    | owner123    | Business management + stats |
| **Manager**  | manager@resto.com  | manager123  | Operations + reporting      |
| **Chef**     | chef@resto.com     | chef123     | Kitchen orders              |
| **Waiter**   | waiter@resto.com   | waiter123   | Table + order management    |
| **Cashier**  | cashier@resto.com  | cashier123  | Billing + POS               |
| **Customer** | customer@resto.com | customer123 | Menu browsing + ordering    |

### 📁 Categories

1. **Appetizers** - Start your meal right
2. **Main Course** - Hearty main dishes
3. **Desserts** - Sweet endings
4. **Beverages** - Refreshing drinks
5. **Salads** - Fresh and healthy

### 🍽️ Menu Items (23 items)

**Appetizers ($4.99 - $8.99)**

- Spring Rolls
- Chicken Wings
- Garlic Bread
- Mozzarella Sticks

**Main Course ($11.99 - $18.99)**

- Grilled Chicken
- Beef Burger
- Pasta Carbonara
- Grilled Salmon
- Vegetable Stir Fry
- Pizza Margherita

**Desserts ($5.99 - $7.99)**

- Chocolate Cake
- Ice Cream Sundae
- Tiramisu
- Apple Pie

**Beverages ($2.99 - $4.99)**

- Coca Cola
- Fresh Orange Juice
- Coffee
- Iced Tea

**Salads ($7.99 - $9.99)**

- Caesar Salad
- Greek Salad
- Garden Salad

### 🪑 Tables (10 tables)

- Tables 1-2: Capacity 2 (for couples)
- Tables 3-5: Capacity 4 (small groups)
- Tables 6-7: Capacity 6 (medium groups)
- Table 8: Capacity 8 (large groups)
- Table 9: Capacity 2
- Table 10: Capacity 4

---

## 🔧 Configuration

### Environment Variables Needed

The seeding scripts use your `.env` file. Make sure these variables are set:

```bash
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant?retryWrites=true&w=majority

# JWT Secret (for password hashing)
JWT_SECRET=your_super_secret_jwt_key

# Server Port (optional for seeding)
PORT=5000
```

### For Railway Production:

1. Go to Railway Dashboard
2. Select your project
3. Click on **Variables**
4. Ensure `MONGO_URI` is set to your MongoDB Atlas connection string

---

## ✅ Verification

After seeding, verify the data was added:

### Option 1: Check via MongoDB Atlas Dashboard

1. Go to MongoDB Atlas → Clusters
2. Click **Browse Collections**
3. Select your database
4. Check collections:
   - `users` - Should have 7 users
   - `categories` - Should have 5 categories
   - `menuitems` - Should have 23 menu items
   - `tables` - Should have 10 tables

### Option 2: Check via Your Application

1. Go to your Vercel site: https://resturent-managment-system-nu.vercel.app/
2. **Test Login:**
   - Login as `admin@resto.com` / `admin123`
   - Should successfully log in and see admin dashboard
3. **Check Menu:**
   - Go to `/menu` route
   - Should see 23 menu items organized by categories
4. **Check Tables (Waiter Dashboard):**
   - Login as `waiter@resto.com` / `waiter123`
   - Check table allocation page
   - Should see 10 tables

### Option 3: Check via API

Using Postman or browser:

```bash
# Check categories
GET https://resturentmanagmentsystem-production.up.railway.app/api/categories

# Check menu items
GET https://resturentmanagmentsystem-production.up.railway.app/api/menu

# Check tables
GET https://resturentmanagmentsystem-production.up.railway.app/api/tables
```

---

## 🛡️ Safe Seeding

The seeding script is **safe** and **idempotent**:

✅ **Checks for existing data** - Won't create duplicates  
✅ **Non-destructive** - Doesn't delete existing data  
✅ **Can run multiple times** - Will skip items that already exist  
✅ **Detailed logging** - Shows what was created vs. what already exists

### Example Output:

```
🔌 Connecting to MongoDB...
✅ MongoDB Connected!

👥 Seeding Users...
─────────────────────────────────────────
  ✅ admin      | admin@resto.com           - Created
  ✅ owner      | owner@resto.com           - Created
  ✅ manager    | manager@resto.com         - Created
  ...

📁 Seeding Categories...
─────────────────────────────────────────
  ✅ Appetizers - Created
  ✅ Main Course - Created
  ...

═════════════════════════════════════════
          SEEDING COMPLETED! ✨
═════════════════════════════════════════

📊 Summary:
  Users:       7 created, 0 existing
  Categories:  5 created, 0 existing
  Menu Items:  23 created, 0 existing
  Tables:      10 created, 0 existing
```

---

## 🐛 Troubleshooting

### Issue: "MONGO_URI not found"

**Solution:**

- Make sure `.env` file exists in `server/` directory
- Verify `MONGO_URI` is set in the file
- Check there are no spaces around the `=` sign

### Issue: "Connection timeout"

**Solution:**

- Check MongoDB Atlas IP Whitelist
- Go to MongoDB Atlas → Network Access
- Add IP `0.0.0.0/0` to allow connections from anywhere
- Or add Railway's specific IP addresses

### Issue: "Users already exist"

**Solution:**

- This is normal! The script detects existing data
- It will show "⚠️ Already exists" for items that are already in the database
- No duplicates will be created

### Issue: "Authentication failed"

**Solution:**

- Verify your MongoDB connection string is correct
- Check username and password in the connection string
- Ensure the database user has read/write permissions

---

## 🔄 Re-seeding (Fresh Start)

If you want to **clear all data and start fresh**:

### ⚠️ WARNING: This will DELETE all existing data!

#### Method 1: Via MongoDB Atlas

1. Go to MongoDB Atlas Dashboard
2. Browse Collections
3. Delete collections manually:
   - `users`
   - `categories`
   - `menuitems`
   - `tables`
   - `orders`
4. Run seed script again

#### Method 2: Via Script (Advanced)

Create a new file `server/src/resetDatabase.js`:

```javascript
const mongoose = require("mongoose");
require("dotenv").config();

const resetDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Drop all collections
  await mongoose.connection.db.dropDatabase();

  console.log("✅ Database reset complete!");
  process.exit(0);
};

resetDatabase();
```

Then run:

```bash
node src/resetDatabase.js
npm run seed:production
```

---

## 📝 Script Details

### Available NPM Scripts

```bash
# Seed all data to production (recommended)
npm run seed:production

# Individual seeding scripts
npm run seed:users      # Only users
npm run seed:tables     # Only tables
npm run seed:data       # Categories, menu items, and tables

# Alias for production seeding
npm run seed:all        # Same as seed:production
```

---

## 🎯 Next Steps After Seeding

1. **Test All User Roles:**

   - Login as each user type
   - Verify role-based access works
   - Check dashboards display correctly

2. **Test Menu:**

   - Browse menu as customer
   - Add items to cart
   - Complete checkout

3. **Test Orders:**

   - Place orders as customer
   - View orders in chef kitchen display
   - Process orders through workflow

4. **Test Staff Features:**

   - Waiter: Manage tables
   - Cashier: Process payments
   - Manager: View statistics

5. **Customize Data:**
   - Edit `seedProduction.js` to add your own menu items
   - Modify prices, descriptions, categories
   - Add more tables as needed

---

## 🎉 Success!

Once seeding is complete, your production database will have:

- ✅ 7 test users for all roles
- ✅ Full menu with 23 items
- ✅ 10 restaurant tables
- ✅ 5 organized categories

Your application is now ready for **demo, testing, or production use!** 🚀

---

**Created:** January 6, 2026  
**Database:** MongoDB Atlas (via Railway)  
**Status:** Production Ready ✨
