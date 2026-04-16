# ⚡ Quick Fix Checklist - Google OAuth Error

## The Error You're Seeing:
```
Missing required parameter: client_id
Access blocked: Authorization Error
```

---

## ✅ Fix Steps (Do These in Order)

### 1️⃣ Get Google Client ID
- [ ] Go to: https://console.cloud.google.com/
- [ ] Create new project named `EHS`
- [ ] Search for "Google+ API" → Enable it
- [ ] Go to Credentials → Create OAuth 2.0 Client ID
- [ ] Choose "Web application"
- [ ] Add Authorized JavaScript origin: `http://localhost:5173`
- [ ] Add Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
- [ ] **COPY** the Client ID (looks like: `123456.apps.googleusercontent.com`)
- [ ] **COPY** the Client Secret

### 2️⃣ Create Frontend .env File
- [ ] Navigate to: `d:\EHS2\EHS\frontend\`
- [ ] Create new file: `.env.local` (IMPORTANT: NOT `.env`)
- [ ] Add these lines:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
```
- [ ] Replace `YOUR_CLIENT_ID_HERE` with your actual Client ID
- [ ] Save file

### 3️⃣ Create Backend .env File
- [ ] Navigate to: `d:\EHS2\EHS\backend\`
- [ ] Create new file: `.env`
- [ ] Add these lines:
```env
MONGODB_URI=mongodb://localhost:27017/embracinghigherself
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```
- [ ] Replace with your Google credentials
- [ ] Save file

### 4️⃣ Install & Run
```bash
# Terminal 1 - Backend
cd d:\EHS2\EHS\backend
npm install
npm run dev

# Terminal 2 - Frontend (NEW TERMINAL)
cd d:\EHS2\EHS\frontend
npm install
npm run dev
```

### 5️⃣ Test
- [ ] Open: http://localhost:5173
- [ ] Click "Sign In" button
- [ ] See Google sign-in options (NOT an error)
- [ ] Click a Google account to test

---

## 🔍 Still Having Issues?

### Problem: Still seeing "Missing required parameter: client_id"

**Things to check:**
1. File name is **`.env.local`** (not `.env` or `.env.example`)
2. VITE_GOOGLE_CLIENT_ID is NOT empty
3. No spaces before/after the Client ID
4. Closed and restarted frontend dev server
5. Cleared browser cache (Ctrl+Shift+Delete) and refreshed

### Problem: "Access blocked: Authorization Error"

**Check in Google Cloud Console:**
1. Go to Credentials
2. Click your OAuth Client ID
3. Verify `http://localhost:5173` is in Authorized JavaScript origins
4. Verify `http://localhost:5000/api/auth/google/callback` is in redirect URIs
5. Changes can take 5 minutes to apply

### Problem: Backend errors

Only proceed after backend shows:
```
✓ MongoDB connected
✓ Server running on port 5000
```

---

## 📧 File Locations Reference

```
d:\EHS2\EHS\
├── frontend\
│   ├── .env.local          ← CREATE THIS (User & Google ID)
│   ├── src\
│   │   └── components\
│   │       └── common\
│   │           └── GoogleAuthModal.jsx
│   └── package.json
│
└── backend\
    ├── .env                ← CREATE THIS (All credentials)
    ├── src\
    │   └── controllers\
    │       └── auth.controller.js
    └── package.json
```

---

## 🎯 Expected Result

After setup, you should be able to:
1. ✅ Click "Sign In" button without errors
2. ✅ See Google sign-in options
3. ✅ Sign in with your Google account
4. ✅ See your profile image in the navbar
5. ✅ Access Dashboard with your courses & products
6. ✅ Logout and cookies are cleared

---

**Need help? Follow GOOGLE_OAUTH_SETUP.md for detailed steps!**
