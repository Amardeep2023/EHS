# 🎯 Copy-Paste Setup (Fastest Way)

## Step 1: Get Your Google Credentials

Go to: **https://console.cloud.google.com/**

1. Click "Select a Project" → "NEW PROJECT"
2. Name: `EHS`
3. Create
4. Search "Google+ API" → Enable
5. Left sidebar: "Credentials"
6. "Create Credentials" → "OAuth 2.0 Client ID" → "Web application"
7. If asked about Consent Screen - fill it and save
8. Authorized origins: Add `http://localhost:5173`
9. Redirect URIs: Add `http://localhost:5000/api/auth/google/callback`
10. Create

**You now have:**
- Client ID (something like: `123456-abc.apps.googleusercontent.com`)
- Client Secret

---

## Step 2: Frontend .env File

📁 Location: `d:\EHS2\EHS\frontend\`

📄 File name: **`.env.local`**

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
```

**Replace `PASTE_YOUR_CLIENT_ID_HERE` with your actual Client ID from Step 1**

---

## Step 3: Backend .env File

📁 Location: `d:\EHS2\EHS\backend\`

📄 File name: **`.env`**

```env
MONGODB_URI=mongodb://localhost:27017/embracinghigherself
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=my-super-secret-jwt-key-2026
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=PASTE_YOUR_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

**Replace:**
- `PASTE_YOUR_CLIENT_ID_HERE` with Client ID from Step 1
- `PASTE_YOUR_CLIENT_SECRET_HERE` with Client Secret from Step 1

---

## Step 4: Run It

### Terminal 1:
```bash
cd d:\EHS2\EHS\backend
npm install
npm run dev
```

Wait for: `✓ MongoDB connected`

### Terminal 2 (NEW):
```bash
cd d:\EHS2\EHS\frontend
npm install
npm run dev
```

Wait for: `VITE v... ready in ... ms`

---

## Step 5: Test

Open: http://localhost:5173

Click "Sign In" → Should work now! 🎉

---

## ❌ If Still Getting Error

### Most Common Issues:

1. **Missing .env.local in frontend**
   - Must be in: `d:\EHS2\EHS\frontend\.env.local`
   - Name must be `.env.local` (not `.env`)

2. **Frontend dev server not restarted**
   - Stop `npm run dev` (Ctrl+C)
   - Start it again

3. **Browser cache not cleared**
   - Press: Ctrl+Shift+Delete
   - Clear cache
   - Refresh page

4. **Wrong Client ID**
   - Make sure no spaces before/after
   - Verify it ends with `.apps.googleusercontent.com`

---

**That's it! 🚀**

If you still have issues, check AUTHENTICATION_SETUP.md or GOOGLE_OAUTH_SETUP.md for detailed troubleshooting.
