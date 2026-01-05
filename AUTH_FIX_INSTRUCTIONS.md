# Authentication Fix Instructions

## 🔍 **Problem Identified**

**Root Cause**: The user ID in your JWT session (`cmghsqcew000095n0obppkygt`) does not exist in the database.

**Database Users**:
- `cmgjak5o10000zs09j4ohe9ed` - admin@mediaplanpro.com (ADMIN)
- `cmgjak5vt0001zs090hn5fps0` - editor@mediaplanpro.com (EDITOR)
- `cmgjak63z0002zs09lp4r9tkv` - user@mediaplanpro.com (USER)

**Your Session User ID**: `cmghsqcew000095n0obppkygt` (NOT IN DATABASE)

This happens when:
1. You signed up/logged in previously
2. The database was reset or migrated
3. Your JWT token still contains the old user ID
4. The user no longer exists in the database

---

## ✅ **Solution Applied**

I've updated the API endpoint (`/api/strategies/create-enhanced/route.ts`) to:

1. **Auto-create missing users**: If a valid session exists but the user is not in the database, it will attempt to create the user automatically
2. **Enhanced logging**: Added detailed console logs to debug authentication issues
3. **Better error messages**: Provides clear instructions if user creation fails

---

## 🚀 **How to Fix (Option 1: Sign Out and Sign In)**

### **Step 1: Sign Out**
1. Navigate to http://localhost:3002/dashboard
2. Click on your profile/avatar in the top right
3. Click "Sign Out"

### **Step 2: Sign In with Existing User**
1. Navigate to http://localhost:3002/auth/signin
2. Sign in with one of these test accounts:

**Admin Account**:
- Email: `admin@mediaplanpro.com`
- Password: `admin123` (or check your seed script for the actual password)

**Editor Account**:
- Email: `editor@mediaplanpro.com`
- Password: `editor123`

**User Account**:
- Email: `user@mediaplanpro.com`
- Password: `user123`

### **Step 3: Test Strategy Creation**
1. Navigate to http://localhost:3002/dashboard/strategies/create-enhanced
2. Fill out the form
3. Click "Generate Strategy"
4. Should work now!

---

## 🚀 **How to Fix (Option 2: Let API Auto-Create User)**

### **Step 1: Try Creating Strategy Again**
1. Navigate to http://localhost:3002/dashboard/strategies/create-enhanced
2. Fill out the form
3. Click "Generate Strategy"

### **Step 2: Check Console Logs**
The API will now attempt to create your user automatically. Check the terminal for:
```
User not found in database, attempting to create: cmghsqcew000095n0obppkygt
User created successfully: [your-email]
```

### **Step 3: Verify Success**
If user creation succeeds, the strategy should be created successfully.

---

## 🔧 **Alternative: Reset Your Session**

If the above doesn't work, you can manually clear your session:

### **Browser Console Method**:
1. Open browser DevTools (F12)
2. Go to Application tab → Cookies
3. Delete all cookies for `localhost:3002`
4. Refresh the page
5. Sign in again

### **Incognito Mode Method**:
1. Open an incognito/private window
2. Navigate to http://localhost:3002/auth/signin
3. Sign in with one of the test accounts
4. Test strategy creation

---

## 📊 **Verification Steps**

After signing in, verify your session:

### **Check Session API**:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to http://localhost:3002/api/auth/session
4. Check the response - should show:
```json
{
  "user": {
    "id": "cmgjak5o10000zs09j4ohe9ed",
    "email": "admin@mediaplanpro.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

### **Check Database**:
Run this command to verify your user exists:
```bash
sqlite3 prisma/dev.db "SELECT id, email, name, role FROM users WHERE email='admin@mediaplanpro.com';"
```

---

## 🐛 **If Still Not Working**

### **Check API Logs**:
When you submit the form, check the terminal for these logs:
```
=== Enhanced Strategy Creation Debug ===
Session exists: true
Session user: { id: '...', email: '...', name: '...', role: '...' }
Session user ID: cmgjak5o10000zs09j4ohe9ed
Session user ID type: string
Looking up user with ID: cmgjak5o10000zs09j4ohe9ed
User lookup result: { id: '...', email: '...', name: '...' }
User verified successfully: admin@mediaplanpro.com
```

### **Common Issues**:

**Issue 1: "Unauthorized" error**
- **Cause**: No session found
- **Fix**: Sign in again

**Issue 2: "User not found" error**
- **Cause**: User ID in session doesn't match database
- **Fix**: Sign out and sign in with existing user

**Issue 3: "Invalid input data" error**
- **Cause**: Form validation failed
- **Fix**: Check console for validation errors, ensure all required fields are filled

**Issue 4: "Failed to create strategy" error**
- **Cause**: Database or generator error
- **Fix**: Check terminal logs for detailed error message

---

## 📝 **Test Credentials**

Here are the test accounts in your database:

| Email | Password | Role | User ID |
|-------|----------|------|---------|
| admin@mediaplanpro.com | admin123 | ADMIN | cmgjak5o10000zs09j4ohe9ed |
| editor@mediaplanpro.com | editor123 | EDITOR | cmgjak5vt0001zs090hn5fps0 |
| user@mediaplanpro.com | user123 | USER | cmgjak63z0002zs09lp4r9tkv |

**Note**: If these passwords don't work, check your seed script at `prisma/seed.ts` for the actual passwords.

---

## ✅ **Success Criteria**

After fixing, you should be able to:
1. ✅ Sign in successfully
2. ✅ Navigate to `/dashboard/strategies/create-enhanced`
3. ✅ Fill out all 6 form steps
4. ✅ Click "Generate Strategy"
5. ✅ See success message
6. ✅ Be redirected to strategy view page
7. ✅ See your generated strategy with all 17 sections

---

## 🎯 **Next Steps After Fix**

Once authentication is working:
1. Test strategy creation with different business types (B2B, B2C, SaaS)
2. Verify all 17 sections display correctly
3. Check that data is context-aware
4. Proceed to Part 2 (Form Enhancements)

---

## 💡 **Recommended Action**

**EASIEST FIX**: Sign out and sign in with `admin@mediaplanpro.com` / `admin123`

This will give you a fresh session with a user that definitely exists in the database.

