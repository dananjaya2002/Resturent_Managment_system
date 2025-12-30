# Image Upload & Management Guide

## Issue 1: Fix Database Name ✅

### Problem

Data is being stored in `test` database instead of `restaurant_db`.

### Solution

Check your `server/.env` file - your connection string needs the database name:

**Current (Wrong):**

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Correct:**

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority
```

**Notice:** Added `/restaurant_db` before the `?`

### Steps to Fix:

1. Open `server/.env`
2. Find your `MONGO_URI` line
3. Add `/restaurant_db` before the `?`
4. Restart your server: `npm start`
5. Check MongoDB Atlas - new data will go to `restaurant_db`

---

## Issue 2: Add Images to Menu Items 🖼️

You have several options for handling images:

### Option A: Use Your Local Images with Public Folder (Recommended for Development)

This is the easiest way to use your local images.

#### Step 1: Create Public Images Folder

```bash
cd server
mkdir -p public/images/menu
```

#### Step 2: Copy Your Images

Copy your food images to: `server/public/images/menu/`

For example:

```
server/public/images/menu/
├── spring-rolls.jpg
├── burger.jpg
├── pasta.jpg
├── ice-cream.jpg
└── cake.jpg
```

#### Step 3: Serve Static Files

Your `server/src/app.js` needs to serve static files. Add this:

```javascript
// Add after other middleware
app.use("/images", express.static("public/images"));
```

#### Step 4: Use Relative URLs in Admin Dashboard

When adding menu items, use image URLs like:

```
http://localhost:5000/images/menu/spring-rolls.jpg
```

Or for the frontend to work properly:

```
/images/menu/spring-rolls.jpg
```

---

### Option B: Use Online Image URLs (Quick & Easy)

#### Free Image Hosting Options:

1. **Imgur** (https://imgur.com)

   - Upload image
   - Right-click → "Copy image address"
   - Paste URL: `https://i.imgur.com/xxxxx.jpg`

2. **Cloudinary** (https://cloudinary.com)

   - Free tier: 25GB storage
   - Better for production
   - Get URL after upload

3. **ImgBB** (https://imgbb.com)
   - No account needed
   - Quick uploads
   - Copy direct link

#### Example URLs:

```
https://i.imgur.com/abc123.jpg
https://res.cloudinary.com/yourname/image/upload/v123/burger.jpg
https://i.ibb.co/xyz789/pasta.jpg
```

---

### Option C: Implement File Upload (Production-Ready)

For a complete file upload system, we'll use **Multer**.

#### Step 1: Install Multer

```bash
cd server
npm install multer
```

#### Step 2: Create Upload Configuration

Create `server/src/config/upload.js`:

```javascript
const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/menu/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "menu-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

module.exports = upload;
```

#### Step 3: Create Upload Route

Create `server/src/routes/uploadRoutes.js`:

```javascript
const express = require("express");
const router = express.Router();
const upload = require("../config/upload");
const { protect, admin } = require("../middleware/authMiddleware");

// @desc    Upload image
// @route   POST /api/upload
// @access  Private/Admin
router.post("/", protect, admin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `/images/menu/${req.file.filename}`;
  res.json({
    message: "Image uploaded successfully",
    imageUrl: imageUrl,
    filename: req.file.filename,
  });
});

module.exports = router;
```

#### Step 4: Register Upload Route

Add to `server/src/app.js`:

```javascript
// Serve static files
app.use("/images", express.static("public/images"));

// Routes
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);
```

#### Step 5: Update Frontend for File Upload

The admin dashboard would need an image upload button. For now, you can test with Postman:

```
POST http://localhost:5000/api/upload
Authorization: Bearer YOUR_ADMIN_TOKEN
Body: form-data
Key: image, Type: File, Value: [select your image file]
```

---

## Quick Start: Option A Implementation (Recommended)

### 1. Update server/src/app.js

Add this line after the middleware section:

```javascript
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Serve static files for images
app.use("/images", express.static(path.join(__dirname, "../public/images")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ... rest of your code
```

### 2. Create the folder structure

```bash
cd server
mkdir -p public/images/menu
mkdir -p public/images/categories
```

### 3. Add your images

Copy your food images into `server/public/images/menu/`

### 4. Use in Admin Dashboard

When creating/editing menu items, use:

```
http://localhost:5000/images/menu/your-image-name.jpg
```

Or just:

```
/images/menu/your-image-name.jpg
```

---

## Testing Image URLs

### Test if images are accessible:

1. Copy an image to `server/public/images/menu/test.jpg`
2. Visit: http://localhost:5000/images/menu/test.jpg
3. If you see the image, it works! ✅

### Common Issues:

**Images not showing?**

- Check file path is correct
- Check file name spelling (case-sensitive)
- Restart server after adding static middleware
- Check browser console for 404 errors

**CORS issues?**

- Already configured in your app.js
- Images should load fine

---

## Sample Menu Items with Images

Once you have images set up, create items like:

```javascript
{
  name: "Vegetable Spring Rolls",
  description: "Crispy rolls with fresh vegetables",
  price: 8.99,
  category: "appetizers-id",
  imageUrl: "/images/menu/spring-rolls.jpg",  // Your local image
  isVegetarian: true,
  preparationTime: 15
}
```

---

## Production Considerations

For production deployment:

1. **Use Cloudinary or AWS S3**

   - More reliable
   - CDN benefits
   - Better performance

2. **Optimize Images**

   - Resize to 800x600 or smaller
   - Compress before upload
   - Use WebP format

3. **Image Validation**
   - Check file size
   - Verify image format
   - Scan for security

---

## Next Steps

1. ✅ Fix database name in `.env`
2. ✅ Choose image solution (A, B, or C)
3. ✅ Add static file serving to app.js
4. ✅ Copy your images to public folder
5. ✅ Test image URLs work
6. ✅ Update menu items with image URLs
7. ✅ View menu to see images!

**Need help implementing any of these? Let me know which option you prefer!**
