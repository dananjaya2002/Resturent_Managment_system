# Quick Fix Guide - Database & Images

## ✅ Fix 1: Database Name Issue

### Problem

Your data is going to `test` database instead of `restaurant_db`.

### Solution

**Check your `server/.env` file:**

Look for the `MONGO_URI` line. It should have `/restaurant_db` before the `?`:

**❌ Wrong:**

```env
MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?retryWrites=true
```

**✅ Correct:**

```env
MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true
```

### Steps:

1. Open `server/.env`
2. Find your connection string
3. Add `/restaurant_db` between the cluster URL and the `?`
4. Save the file
5. **Restart your server** (stop with Ctrl+C, then `npm start`)

### Verify:

- Check MongoDB Atlas → Browse Collections
- You should see `restaurant_db` (new data will go here)
- Old data in `test` can be ignored or deleted

---

## ✅ Fix 2: Add Images to Menu Items

### Setup Complete! ✓

I've already configured your server to serve images. Now you just need to add your images.

### Step 1: Add Your Images

Copy your food images to this folder:

```
server/public/images/menu/
```

**Example structure:**

```
server/
├── public/
│   └── images/
│       ├── menu/
│       │   ├── spring-rolls.jpg
│       │   ├── burger.jpg
│       │   ├── pasta.jpg
│       │   └── cake.jpg
│       └── categories/
│           ├── appetizers.jpg
│           └── desserts.jpg
```

### Step 2: Restart Your Server

```bash
cd server
npm start
```

### Step 3: Test Your Images

Open browser and visit:

```
http://localhost:5000/images/menu/spring-rolls.jpg
```

If you see your image, it's working! ✅

### Step 4: Use Image URLs in Admin Dashboard

When creating or editing menu items, use image URLs like:

**Option 1 - Full URL:**

```
http://localhost:5000/images/menu/spring-rolls.jpg
```

**Option 2 - Relative URL (Better):**

```
/images/menu/spring-rolls.jpg
```

### Step 5: Update Existing Items

1. Go to http://localhost:5173/admin
2. Click "Menu Items" tab
3. Click "Edit" on any item
4. In "Image URL" field, enter:
   ```
   /images/menu/your-image-name.jpg
   ```
5. Click "Update"
6. Go to Menu page to see the image!

---

## 📝 Image File Naming Tips

**Good names:**

- `spring-rolls.jpg`
- `chicken-burger.jpg`
- `chocolate-cake.jpg`

**Avoid:**

- Spaces: `spring rolls.jpg` ❌
- Special characters: `spring@rolls.jpg` ❌
- Use lowercase and hyphens

---

## 🖼️ Alternative: Use Online Images (Quick Test)

Don't have images ready? Use free online images:

### Free Food Image Sources:

1. **Unsplash** - https://unsplash.com/s/photos/food

   - Right-click image → "Copy image address"
   - Paste URL in Image URL field

2. **Pexels** - https://www.pexels.com/search/food/

   - Free high-quality food photos

3. **Sample URLs you can use right now:**

```
https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400 (Burger)
https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400 (Burger)
https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400 (Spring Rolls)
https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400 (Pasta)
https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400 (Cake)
https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400 (Pizza)
```

---

## 🔄 Summary of Changes Made

✅ **Added static file serving to server**
✅ **Created image directories**
✅ **Server ready to serve images**

---

## 🧪 Quick Test

### Test 1: Check if server serves images

1. Put any image in `server/public/images/menu/test.jpg`
2. Visit: http://localhost:5000/images/menu/test.jpg
3. See the image? ✅ Working!

### Test 2: Add image to menu item

1. Go to Admin Dashboard
2. Edit a menu item
3. Add image URL: `/images/menu/test.jpg`
4. Save
5. Go to Menu page
6. See the image on the menu card? ✅ Working!

---

## ❓ Troubleshooting

### Images not showing?

**Check:**

1. ✅ Server restarted after adding static middleware?
2. ✅ Image file in correct folder `server/public/images/menu/`?
3. ✅ Image filename matches URL exactly? (case-sensitive)
4. ✅ Visit image URL directly to verify: `http://localhost:5000/images/menu/your-file.jpg`

### Database still showing test?

**Check:**

1. ✅ `.env` file has `/restaurant_db` in connection string?
2. ✅ Server restarted after changing `.env`?
3. ✅ New data goes to `restaurant_db` (old data stays in `test`)

---

## 📋 Complete Checklist

- [ ] Fix connection string in `server/.env` (add `/restaurant_db`)
- [ ] Restart server
- [ ] Copy images to `server/public/images/menu/`
- [ ] Test image URL in browser
- [ ] Add image URLs to menu items in admin dashboard
- [ ] View menu page to see images
- [ ] Celebrate! 🎉

---

**Need help? Check the detailed guide:** [IMAGE_UPLOAD_GUIDE.md](IMAGE_UPLOAD_GUIDE.md)
