# Next Steps - You're Connected! ✅

## Current Status

✅ MongoDB Atlas connected successfully  
✅ Server running on port 5000  
✅ API is responding

---

## Step 1: Create Your First Admin User

### Option A: Using the Frontend (Recommended)

1. **Start the frontend:**

   ```bash
   cd client
   npm run dev
   ```

2. **Open browser:** http://localhost:5173

3. **Register an admin user:**

   - Click "Sign Up" or go to http://localhost:5173/register
   - Fill in the form:
     - Name: `Admin User`
     - Email: `admin@restaurant.com`
     - Password: `admin123`
   - Click "Register"

4. **Update user role to admin:**

   - Go to MongoDB Atlas dashboard
   - Click "Browse Collections" on your cluster
   - You'll now see `restaurant_db` database!
   - Click on `restaurant_db` → `users` collection
   - Find your user document
   - Click "Edit Document"
   - Change `"role": "customer"` to `"role": "admin"`
   - Click "Update"

5. **Login as admin:**
   - Go back to frontend: http://localhost:5173/login
   - Login with your credentials
   - You should now see an "Admin" link in the navigation!

### Option B: Using Postman/Thunder Client (Alternative)

If you prefer testing the API directly:

1. **Register endpoint:**

   ```
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json

   {
     "name": "Admin User",
     "email": "admin@restaurant.com",
     "password": "admin123"
   }
   ```

2. **Response will include a token - save it!**

   ```json
   {
     "_id": "...",
     "name": "Admin User",
     "email": "admin@restaurant.com",
     "role": "customer",
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

3. **Update role in MongoDB Atlas** (same as Option A step 4)

4. **Login again to get admin token:**

   ```
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json

   {
     "email": "admin@restaurant.com",
     "password": "admin123"
   }
   ```

---

## Step 2: Create Categories (Admin Dashboard)

1. **Access admin dashboard:** http://localhost:5173/admin
2. **Click "Categories" tab**
3. **Click "+ Add Category"**
4. **Create your first categories:**

   **Category 1 - Appetizers:**

   - Name: `Appetizers`
   - Description: `Start your meal with our delicious starters`
   - Order: `1`
   - Active: ✓

   **Category 2 - Main Courses:**

   - Name: `Main Courses`
   - Description: `Our signature dishes`
   - Order: `2`
   - Active: ✓

   **Category 3 - Desserts:**

   - Name: `Desserts`
   - Description: `Sweet endings to your meal`
   - Order: `3`
   - Active: ✓

   **Category 4 - Beverages:**

   - Name: `Beverages`
   - Description: `Refreshing drinks`
   - Order: `4`
   - Active: ✓

---

## Step 3: Add Menu Items

1. **Click "Menu Items" tab**
2. **Click "+ Add Menu Item"**
3. **Add your first menu items:**

   **Example - Spring Rolls:**

   - Name: `Vegetable Spring Rolls`
   - Description: `Crispy rolls filled with fresh vegetables`
   - Price: `8.99`
   - Category: `Appetizers`
   - Preparation Time: `15`
   - Available: ✓
   - Vegetarian: ✓

   **Example - Grilled Chicken:**

   - Name: `Grilled Chicken Breast`
   - Description: `Tender chicken breast with herbs and spices`
   - Price: `15.99`
   - Category: `Main Courses`
   - Preparation Time: `25`
   - Available: ✓

   **Example - Chocolate Cake:**

   - Name: `Chocolate Lava Cake`
   - Description: `Warm chocolate cake with molten center`
   - Price: `7.99`
   - Category: `Desserts`
   - Preparation Time: `10`
   - Available: ✓
   - Vegetarian: ✓

---

## Step 4: View Your Menu

1. **Go to public menu:** http://localhost:5173/menu
2. **You should see:**
   - Category filter buttons
   - Your menu items displayed in cards
   - Prices, descriptions, and tags
   - "Add to Cart" buttons (functional in Phase 4)

---

## Verify in MongoDB Atlas

1. **Go to MongoDB Atlas dashboard**
2. **Click "Browse Collections"**
3. **You should now see:**
   ```
   restaurant_db
   ├── users (1 document - your admin user)
   ├── categories (4 documents if you created them)
   └── menuitems (documents for each item you created)
   ```

---

## Testing Checklist

- [ ] Frontend running on http://localhost:5173
- [ ] Backend running on http://localhost:5000
- [ ] Admin user created and role updated
- [ ] Can login as admin
- [ ] "Admin" link visible in navigation
- [ ] Categories created (at least 2-3)
- [ ] Menu items created (at least 2-3)
- [ ] Public menu shows items correctly
- [ ] Can filter menu by category
- [ ] Data visible in MongoDB Atlas

---

## Quick Commands Reference

**Start Backend:**

```bash
cd server
npm start
```

**Start Frontend:**

```bash
cd client
npm run dev
```

**Run Tests:**

```bash
cd server
npm test
```

**Generate JWT Secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Sample Data for Quick Testing

Copy-paste ready data:

**Categories:**

```javascript
// Appetizers
{ name: "Appetizers", description: "Start your meal right", order: 1, isActive: true }

// Main Courses
{ name: "Main Courses", description: "Our signature dishes", order: 2, isActive: true }

// Desserts
{ name: "Desserts", description: "Sweet treats", order: 3, isActive: true }

// Beverages
{ name: "Beverages", description: "Refreshing drinks", order: 4, isActive: true }
```

**Menu Items:**

```javascript
// Spring Rolls
{
  name: "Spring Rolls",
  description: "Crispy vegetable spring rolls",
  price: 8.99,
  category: "appetizers-id",
  preparationTime: 15,
  isVegetarian: true,
  isAvailable: true
}

// Burger
{
  name: "Classic Burger",
  description: "Juicy beef patty with lettuce and tomato",
  price: 12.99,
  category: "main-courses-id",
  preparationTime: 20,
  isAvailable: true
}

// Pasta
{
  name: "Spaghetti Carbonara",
  description: "Creamy pasta with bacon",
  price: 14.99,
  category: "main-courses-id",
  preparationTime: 25,
  isAvailable: true
}

// Ice Cream
{
  name: "Vanilla Ice Cream",
  description: "Classic vanilla ice cream",
  price: 5.99,
  category: "desserts-id",
  preparationTime: 5,
  isVegetarian: true,
  isAvailable: true
}

// Soda
{
  name: "Coca Cola",
  description: "Refreshing cola drink",
  price: 2.99,
  category: "beverages-id",
  preparationTime: 2,
  isVegetarian: true,
  isAvailable: true
}
```

---

## Troubleshooting

### Can't see "Admin" link after login?

- Make sure you updated the role in MongoDB Atlas
- Logout and login again
- Check browser console for errors

### Categories/Items not showing?

- Check MongoDB Atlas - are they there?
- Check browser console for errors
- Verify API endpoints are working: http://localhost:5000/api/categories

### "Add to Cart" doesn't work?

- This is normal! Cart functionality is Phase 4
- For now, it just shows an alert

---

## What's Next?

### Phase 4: Order Management (Coming Next)

Once you've tested everything:

- Cart functionality
- Checkout process
- Order placement
- Order history
- Real-time order updates with Socket.IO

---

## Need Help?

**Common Issues:**

- Role not updating? Wait a few seconds and try logging in again
- Frontend not connecting? Check CORS settings in server
- Data not showing? Check browser DevTools → Network tab

**Resources:**

- [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
- [API Documentation](../README_QUICKSTART.md#api-endpoints)
- [Troubleshooting](MONGODB_ATLAS_SETUP.md#troubleshooting-common-issues)

---

**🎉 Congratulations! Your restaurant management system is now fully operational!**

Start by creating categories and menu items, then test the public menu view.
