# Testing Guide for Bug Fixes

This guide provides step-by-step instructions to test all the bug fixes implemented in the restaurant management system.

## Prerequisites

Before testing, ensure:

1. MongoDB is running
2. Backend server is running on port 5000 (or your configured port)
3. Frontend is running on port 5173 (or your configured port)
4. You have test users with different roles

### Creating Test Users

If you don't have test users, create them with these roles:

- **Customer** (for placing orders)
- **Chef** (for kitchen operations)
- **Waiter** (for table service)
- **Cashier** (for payment processing)
- **Manager** (for management tasks)
- **Admin** (for full system access)

You can register these users through the `/register` page or use a seeding script.

---

## Test 1: Role-Based Order Visibility ✅

**What was fixed:** Orders are now filtered by role instead of by creator.

### Test as Chef:

1. Log in as a **Chef** user
2. Navigate to `/chef` dashboard
3. **Expected:** You should see orders with status: `pending`, `confirmed`, or `preparing`
4. **Expected:** You should NOT see your personal orders or orders from other roles
5. Create an order as a customer (different browser/incognito), set status to `confirmed`
6. **Expected:** Chef should now see this order

### Test as Waiter:

1. Log in as a **Waiter** user
2. Navigate to `/waiter` dashboard
3. **Expected:** You should see ALL active dine-in orders (not delivered/cancelled)
4. **Expected:** Orders should be visible regardless of who created them
5. Create a dine-in order as a customer
6. **Expected:** Waiter should see the new dine-in order

### Test as Cashier:

1. Log in as a **Cashier** user
2. Navigate to `/cashier` dashboard
3. **Expected:** You should see orders with status: `ready` or `delivered`
4. **Expected:** These orders should be ready for payment processing
5. Update an order status to `ready` (as admin)
6. **Expected:** Cashier should now see this order

### Test as Admin/Manager/Owner:

1. Log in as **Admin**, **Manager**, or **Owner**
2. Navigate to respective dashboard
3. **Expected:** You should see ALL orders regardless of status
4. **Expected:** Complete order history is visible

### Test as Customer:

1. Log in as a **Customer**
2. Navigate to `/orders`
3. **Expected:** You should ONLY see your own orders
4. **Expected:** Other customers' orders are NOT visible

---

## Test 2: Cart Isolation Per User ✅

**What was fixed:** Cart is now stored per user ID, preventing cross-contamination.

### Test Cart Isolation:

1. Open browser 1 (or regular window)
2. Log in as **Customer A**
3. Add items to cart (e.g., 2x Burger, 1x Pizza)
4. Note the cart contents
5. Open browser 2 (or incognito window)
6. Log in as **Customer B** (different account)
7. **Expected:** Cart should be EMPTY for Customer B
8. Add different items to cart (e.g., 1x Pasta, 2x Soda)
9. Switch back to browser 1 (Customer A)
10. **Expected:** Customer A's cart still has (2x Burger, 1x Pizza)
11. Logout Customer A, login as **Cashier** in same browser
12. **Expected:** Cart should be EMPTY for Cashier (different user)

### Test Guest Cart Isolation:

1. Open browser without logging in (guest)
2. Add items to cart
3. Note the cart contents
4. Log in as a Customer
5. **Expected:** Cart should switch to customer's cart (may be empty)
6. Log out
7. **Expected:** Guest cart is restored with previous items

---

## Test 3: Order Creation Authorization ✅

**What was fixed:** Only customers can create orders through the API.

### Test Staff Cannot Order:

1. Log in as **Chef**
2. Try to navigate to `/checkout`
3. **Expected:** Access Denied message (route is protected)
4. Try to add items to cart from menu
5. **Expected:** Cart functionality should work but checkout is blocked

### Test Customer Can Order:

1. Log in as **Customer**
2. Add items to cart
3. Navigate to `/checkout`
4. **Expected:** Checkout page loads successfully
5. Fill in delivery information
6. Submit order
7. **Expected:** Order is created successfully

### Test API Directly (Optional):

1. Get JWT token for a **Waiter** user
2. Make POST request to `/api/orders` with waiter token
3. **Expected:** Response: 403 Forbidden or "Not authorized"
4. Get JWT token for a **Customer** user
5. Make same POST request with customer token
6. **Expected:** Response: 201 Created, order is created

---

## Test 4: Table-Order Relationship ✅

**What was fixed:** Orders now reference the table for dine-in orders.

### Test Table Validation:

1. Log in as **Customer**
2. Add items to cart
3. Go to checkout
4. Select "Dine-in" order type
5. Enter a table number that **does not exist** (e.g., 999)
6. Submit order
7. **Expected:** Error message: "Table 999 not found"

### Test Valid Table Order:

1. First, create a table (as Admin):
   - Navigate to `/admin` or use tables endpoint
   - Create table with number 5, capacity 4
2. Log in as **Customer**
3. Add items to cart
4. Go to checkout
5. Select "Dine-in" order type
6. Enter table number **5**
7. Submit order
8. **Expected:** Order created successfully
9. **Expected:** Order includes `tableNumber: 5` in database

---

## Test 5: Orders By Table Endpoint ✅

**What was fixed:** New endpoint to fetch orders by table number.

### Test as Waiter:

1. Create 2-3 dine-in orders for table number 5
2. Create 1-2 dine-in orders for table number 3
3. Log in as **Waiter**
4. Make API call: `GET /api/orders/by-table/5`
5. **Expected:** Response contains only orders for table 5
6. **Expected:** Orders are dine-in type
7. **Expected:** Active orders only (not delivered/cancelled)

### Test Access Control:

1. Try to access `GET /api/orders/by-table/5` as **Customer**
2. **Expected:** 403 Forbidden (customers can't access this endpoint)
3. Try as **Waiter**, **Cashier**, **Admin**
4. **Expected:** All should have access and see table-specific orders

---

## Test 6: Backend Validation ✅

**What was fixed:** Added constraints for inventory, delivery addresses, and categories.

### Test Inventory Validation:

1. Log in as **Admin** or **Manager**
2. Navigate to `/inventory`
3. Try to add item with name longer than 100 characters
4. **Expected:** Validation error: "Item name cannot exceed 100 characters"
5. Try to add item with quantity 2000000
6. **Expected:** Validation error: "Quantity cannot exceed 1,000,000"
7. Try to add item with quantity -5
8. **Expected:** Validation error: "Quantity cannot be negative"
9. Select category from dropdown
10. **Expected:** Only predefined categories available (Meat, Vegetables, Dairy, etc.)

### Test Delivery Address Validation:

1. Log in as **Customer**
2. Go to checkout with delivery order
3. Enter postal code: "ABC123" (invalid format)
4. Submit order
5. **Expected:** Browser validation error: "Please enter a valid postal code"
6. Enter phone: "123" (too short)
7. **Expected:** Browser validation error: "Please enter a valid phone number"
8. Enter valid postal code: "12345"
9. Enter valid phone: "+1 (555) 123-4567"
10. **Expected:** Order submits successfully

---

## Test 7: Frontend Validation ✅

**What was fixed:** Added pattern validation and dropdowns to prevent invalid input.

### Test Checkout Form:

1. Navigate to `/checkout` as customer
2. Test each field:
   - Street: Try entering 250 characters
   - **Expected:** Limited to 200 characters
   - City: Try entering 60 characters
   - **Expected:** Limited to 50 characters
   - Postal Code: Enter "ABCDE"
   - **Expected:** Form won't submit, shows validation message
   - Phone: Enter "12345"
   - **Expected:** Form won't submit, shows validation message

### Test Inventory Form:

1. Navigate to `/inventory` as admin/manager
2. Click "Add New Item"
3. Try to type in Category field
4. **Expected:** It's a dropdown, not text input
5. **Expected:** Categories: General, Meat, Vegetables, Dairy, Beverages, Spices, Grains, Seafood, Fruits
6. Try to enter quantity greater than 1000000
7. **Expected:** Browser enforces max constraint
8. Try to enter negative quantity
9. **Expected:** Browser enforces min="0"

---

## Test 8: Inventory Edit Functionality ✅

**What was fixed:** Can now edit existing inventory items.

### Test Edit Inventory:

1. Log in as **Admin** or **Manager**
2. Navigate to `/inventory`
3. Find an existing inventory item
4. Click the **"✏️ Edit"** button
5. **Expected:** Edit modal opens with current values pre-filled
6. Change the item name
7. Change the quantity
8. Change the category
9. Click "Save" or "Update"
10. **Expected:** Modal closes, table refreshes with new values
11. **Expected:** Changes are persisted (refresh page to verify)

### Test Edit Validation:

1. Edit an item
2. Try to change name to exceed 100 characters
3. **Expected:** Validation error
4. Try to change quantity to exceed 1,000,000
5. **Expected:** Validation error

---

## Test 9: Table Management Permissions ✅

**What was fixed:** Only admin and manager can create/update/delete tables.

### Test as Manager:

1. Log in as **Manager**
2. Navigate to tables section (may need to access via admin panel or API)
3. Try to create a new table
4. **Expected:** Success - table is created
5. Try to update table (change capacity or number)
6. **Expected:** Success - table is updated
7. Try to delete a table
8. **Expected:** Success - table is deleted

### Test as Waiter:

1. Log in as **Waiter**
2. Try to create table via API: `POST /api/tables`
3. **Expected:** 403 Forbidden
4. Try to update table via API: `PUT /api/tables/:id`
5. **Expected:** 403 Forbidden
6. Try to delete table via API: `DELETE /api/tables/:id`
7. **Expected:** 403 Forbidden
8. Can still update table status (occupied/available)
9. **Expected:** Success - waiters can change status

### Test as Admin:

1. Log in as **Admin**
2. Create, update, and delete tables
3. **Expected:** All operations succeed

---

## Test 10: Error Boundaries & Route Guards ✅

**What was fixed:** Added error boundaries to catch errors and route guards to prevent unauthorized access.

### Test Route Protection:

1. Log out or open incognito window
2. Try to navigate directly to `/admin`
3. **Expected:** Redirected to `/login`
4. Log in as **Customer**
5. Try to navigate to `/chef`
6. **Expected:** "Access Denied" message with your role displayed
7. **Expected:** "Go Back" button is available
8. Try to navigate to `/waiter`
9. **Expected:** Same access denied message
10. Navigate to `/checkout`
11. **Expected:** Success - customers can access checkout

### Test Error Boundary:

1. Log in as any user
2. Navigate to any protected page
3. If a React error occurs (you can simulate by breaking component code)
4. **Expected:** Error boundary catches it
5. **Expected:** User-friendly error message displayed
6. **Expected:** "Refresh Page" button available
7. **Expected:** Error details available in expandable section

### Test Cross-Role Navigation:

1. Log in as **Chef**
2. Navigate to `/chef` - **Expected:** Success
3. Try to navigate to `/waiter` - **Expected:** Access Denied
4. Try to navigate to `/cashier` - **Expected:** Access Denied
5. Log out and login as **Admin**
6. Navigate to `/chef`, `/waiter`, `/cashier`, `/admin` - **Expected:** Access Denied for all except `/admin`
7. **Note:** Only the user's assigned role can access their dashboard

---

## Test 11: Loading States & UI Improvements

**Note:** Some improvements are still pending. Test what's available:

### Test Loading Spinners:

1. Navigate to any dashboard
2. **Check:** Does a loading spinner appear while data loads?
3. **Check:** Does "Loading..." text display?
4. Slow down network (Chrome DevTools: Network tab → Throttling)
5. Navigate between pages
6. **Expected:** Loading indicators should be visible

---

## Quick Smoke Test Checklist

Run through this quick checklist to verify all major fixes:

- [ ] Chef sees only pending/confirmed/preparing orders
- [ ] Waiter sees all dine-in orders
- [ ] Cashier sees ready/delivered orders
- [ ] Cart is isolated between users
- [ ] Staff cannot access checkout page
- [ ] Customer can place orders
- [ ] Invalid table number shows error
- [ ] Valid table number creates order
- [ ] Inventory quantity has max limit
- [ ] Inventory category is dropdown
- [ ] Can edit inventory items
- [ ] Delivery postal code validates format
- [ ] Delivery phone validates format
- [ ] Waiter cannot create tables
- [ ] Manager can create tables
- [ ] Protected routes redirect to login
- [ ] Wrong role shows access denied
- [ ] Error boundary catches errors

---

## Testing with Postman/API Client

For developers who want to test API endpoints directly:

### Test Order Visibility:

```bash
# As Chef
GET /api/orders
Headers: Authorization: Bearer {chef_token}
Expected: Orders with status in [pending, confirmed, preparing]

# As Waiter
GET /api/orders
Headers: Authorization: Bearer {waiter_token}
Expected: Dine-in orders, active only

# As Customer
GET /api/orders
Headers: Authorization: Bearer {customer_token}
Expected: Only orders where user._id matches customer ID
```

### Test Order Creation Authorization:

```bash
# As Customer (Should work)
POST /api/orders
Headers: Authorization: Bearer {customer_token}
Body: { items: [...], orderType: "delivery", deliveryAddress: {...} }
Expected: 201 Created

# As Chef (Should fail)
POST /api/orders
Headers: Authorization: Bearer {chef_token}
Body: { items: [...], orderType: "delivery", deliveryAddress: {...} }
Expected: 403 Forbidden
```

### Test Orders By Table:

```bash
# As Waiter (Should work)
GET /api/orders/by-table/5
Headers: Authorization: Bearer {waiter_token}
Expected: 200 OK, array of orders for table 5

# As Customer (Should fail)
GET /api/orders/by-table/5
Headers: Authorization: Bearer {customer_token}
Expected: 403 Forbidden
```

### Test Table Management:

```bash
# As Manager (Should work)
POST /api/tables
Headers: Authorization: Bearer {manager_token}
Body: { tableNumber: 10, capacity: 4 }
Expected: 201 Created

# As Waiter (Should fail)
POST /api/tables
Headers: Authorization: Bearer {waiter_token}
Body: { tableNumber: 11, capacity: 4 }
Expected: 403 Forbidden

# Update Table (Manager should work)
PUT /api/tables/{table_id}
Headers: Authorization: Bearer {manager_token}
Body: { tableNumber: 12, capacity: 6 }
Expected: 200 OK

# Delete Table (Manager should work)
DELETE /api/tables/{table_id}
Headers: Authorization: Bearer {manager_token}
Expected: 200 OK
```

### Test Inventory Validation:

```bash
# Invalid quantity
POST /api/inventory
Headers: Authorization: Bearer {admin_token}
Body: { itemName: "Test", quantity: 2000000, unit: "kg", category: "General" }
Expected: 400 Bad Request, validation error

# Invalid category
POST /api/inventory
Headers: Authorization: Bearer {admin_token}
Body: { itemName: "Test", quantity: 100, unit: "kg", category: "InvalidCategory" }
Expected: 400 Bad Request, validation error

# Valid request
POST /api/inventory
Headers: Authorization: Bearer {admin_token}
Body: { itemName: "Test Item", quantity: 100, unit: "kg", category: "Vegetables" }
Expected: 201 Created
```

---

## Known Issues & Limitations

The following items are NOT yet implemented:

1. **Toast Notifications:** Alert boxes are still used (should be replaced with toast library)
2. **Guest Ordering:** Customers still need to login (guest checkout not implemented)
3. **Waiter Dashboard Table View:** Waiter dashboard doesn't yet use the new by-table endpoint
4. **Cart UI for Staff:** Cart button still visible for staff roles
5. **Loading States:** Not all pages have loading spinners
6. **Cashier Workflow:** Table-based order creation not fully implemented

---

## Reporting Issues

If you find issues during testing:

1. Note the user role you were testing with
2. Document the exact steps to reproduce
3. Include any error messages
4. Note expected vs actual behavior
5. Check browser console for errors
6. Report in the bug tracking system or create a new issue

---

## Next Steps After Testing

After successful testing:

1. Deploy to staging environment
2. Perform acceptance testing
3. Update user documentation
4. Train staff on new workflows
5. Plan implementation of remaining features
6. Monitor production logs after deployment

---

**Testing completed by:** ********\_********  
**Date:** ********\_********  
**Environment:** ********\_********  
**Overall Result:** ☐ Pass ☐ Fail ☐ Partial Pass
