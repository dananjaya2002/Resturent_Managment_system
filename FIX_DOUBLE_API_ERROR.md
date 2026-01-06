# 🔧 Fix: Double `/api/api/` Error

## 🚨 Current Error:
```
Failed to load: /api/api/categories (404)
Failed to load: /api/api/menu (404) 
Failed to load: /api/api/orders (404)
```

## 🎯 Root Cause:
The Vercel environment variable `VITE_API_URL` **does not include** `/api`, but your code now expects it to include `/api`.

### What's Happening:
1. **Vercel Environment Variable:** `https://resturentmanagmentsystem-production.up.railway.app` (❌ missing `/api`)
2. **Code expects:** `https://resturentmanagmentsystem-production.up.railway.app/api`
3. **Result:** Code adds `/api` again → `/api/api/` ❌

---

## ✅ Solution: Update Vercel Environment Variable

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Select your project: **resturent-managment-system**
3. Click **Settings** → **Environment Variables**

### Step 2: Update `VITE_API_URL`
Find the existing `VITE_API_URL` variable and **edit it**:

**Current Value (Wrong):**
```
https://resturentmanagmentsystem-production.up.railway.app
```

**New Value (Correct):**
```
https://resturentmanagmentsystem-production.up.railway.app/api
```

**⚠️ IMPORTANT:** Must end with `/api`

### Step 3: Delete Old Variable (if exists)
If you see duplicate environment variables, delete the old one without `/api`.

### Step 4: Redeploy
After updating the environment variable:

**Option A - Via Dashboard:**
1. Go to **Deployments** tab
2. Click **⋮** (three dots) on latest deployment
3. Click **Redeploy**
4. Check **Use existing Build Cache** (optional)
5. Click **Redeploy**

**Option B - Via Git Push:**
```bash
git add .
git commit -m "Fix API URL configuration"
git push origin main
```

Vercel will automatically redeploy with the new environment variable.

---

## 🧪 Verify the Fix

### After Redeployment:

1. **Clear Browser Cache:**
   - Press `Ctrl + Shift + Delete`
   - Clear cached images and files
   - Or use Incognito/Private mode

2. **Open DevTools Console:**
   - Press `F12`
   - Go to **Console** tab

3. **Reload the page and check:**
   ```
   ✅ Should see: DEBUG: AuthContext VITE_API_URL: https://resturentmanagmentsystem-production.up.railway.app/api
   ✅ Should see: Socket connected
   ```

4. **Check Network Tab:**
   - Press `F12` → **Network** tab
   - Filter by **XHR** or **Fetch**
   - Should see requests to:
     ```
     ✅ https://resturentmanagmentsystem-production.up.railway.app/api/categories
     ✅ https://resturentmanagmentsystem-production.up.railway.app/api/menu
     ✅ https://resturentmanagmentsystem-production.up.railway.app/api/orders
     ```
   - NOT:
     ```
     ❌ /api/api/categories
     ❌ /api/api/menu
     ```

5. **Test Login:**
   - Go to `/login`
   - Login with: `admin@resto.com` / `admin123`
   - Should successfully load admin dashboard with data

---

## 📋 Checklist

- [ ] Updated `VITE_API_URL` in Vercel to include `/api`
- [ ] Redeployed the application
- [ ] Cleared browser cache
- [ ] Verified correct URLs in Network tab
- [ ] Successfully logged in and see data

---

## 🔍 Debugging

### If Still Not Working:

**1. Check Vercel Deployment Logs:**
```
Vercel Dashboard → Deployments → Click on latest → View Function Logs
```

**2. Check Environment Variables Were Applied:**
In browser console after logging in, type:
```javascript
console.log(import.meta.env.VITE_API_URL)
```
Should output:
```
https://resturentmanagmentsystem-production.up.railway.app/api
```

**3. Check if Old Build is Cached:**
- Do a **hard refresh**: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or use Incognito mode

**4. Verify Vercel Build:**
Check if Vercel built with the new environment variable:
```
Vercel Dashboard → Deployments → Latest deployment → Scroll to "Build Logs"
```

---

## 📝 Technical Explanation

### Why This Happened:

**Before Fix:**
```javascript
// .env.production (local)
VITE_API_URL=https://backend.railway.app

// config/api.js
export const API_URL = `${VITE_API_URL}/api`; // Adds /api
// Result: https://backend.railway.app/api
```

**After Fix:**
```javascript
// Vercel Environment Variable
VITE_API_URL=https://backend.railway.app/api

// config/api.js  
const API_URL = import.meta.env.VITE_API_URL; // Already has /api
// Result: https://backend.railway.app/api ✓
```

### Files Updated:
- ✅ `client/.env.production` - Already includes `/api`
- ✅ `client/src/config/api.js` - No longer adds `/api`
- ✅ `client/.env.example` - Documentation updated
- ⏳ **Vercel environment variable** - Needs manual update

---

## ⚡ Quick Fix Command

If you want to redeploy via CLI:

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Update environment variable
vercel env add VITE_API_URL production

# When prompted, enter:
# https://resturentmanagmentsystem-production.up.railway.app/api

# Redeploy
vercel --prod
```

---

**Once the environment variable is updated and redeployed, everything will work perfectly!** 🎉
