# 🎯 Quick Start: Seed Production Database

## Run This Command:

```bash
cd c:\xampp\htdocs\resturent_mng_sys\server
npm run seed:production
```

## What You'll Get:

✅ **7 Demo Users** for testing all roles  
✅ **23 Menu Items** across 5 categories  
✅ **10 Restaurant Tables** ready to use  

---

## 🔐 Login Credentials

After seeding, use these credentials on your live site:

**🔴 Admin Access:**
- Email: `admin@resto.com`
- Password: `admin123`

**🟢 Staff Accounts:**
- Owner: `owner@resto.com` / `owner123`
- Manager: `manager@resto.com` / `manager123`
- Waiter: `waiter@resto.com` / `waiter123`
- Chef: `chef@resto.com` / `chef123`
- Cashier: `cashier@resto.com` / `cashier123`

**🔵 Customer Account:**
- Email: `customer@resto.com`
- Password: `customer123`

---

## ⚡ Two-Step Process:

### Step 1: Make sure your `.env` file has MongoDB connection

```bash
# server/.env
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
```

### Step 2: Run the seed script

```bash
npm run seed:production
```

---

## ✅ Verify It Worked:

1. **Go to your site:** https://resturent-managment-system-nu.vercel.app/
2. **Login as admin:** `admin@resto.com` / `admin123`
3. **Check menu:** Should see 23 items in 5 categories
4. **Login as waiter:** Should see 10 tables available

---

## 📱 What Gets Added:

### Menu Items (23 total):
- 🥟 4 Appetizers ($4.99-$8.99)
- 🍗 6 Main Courses ($11.99-$18.99)
- 🍰 4 Desserts ($5.99-$7.99)
- ☕ 4 Beverages ($2.99-$4.99)
- 🥗 3 Salads ($7.99-$9.99)

### Tables (10 total):
- 4 tables for 2 people
- 4 tables for 4 people
- 1 table for 6 people
- 1 table for 8 people

---

## 🛡️ Safe to Run Multiple Times

- ✅ Won't create duplicates
- ✅ Skips existing data
- ✅ Shows what was created vs. existing

---

## Need More Help?

📖 **Full Guide:** [PRODUCTION_SEEDING_GUIDE.md](./PRODUCTION_SEEDING_GUIDE.md)

🚀 **Deployment Info:** [QUICK_DEPLOY_GUIDE.md](./QUICK_DEPLOY_GUIDE.md)
