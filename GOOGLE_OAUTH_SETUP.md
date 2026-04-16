# 🚀 Google OAuth Setup Guide - Step by Step

## Problem
You're seeing: **"Missing required parameter: client_id"**

This means your frontend doesn't have the Google Client ID configured.

---

## ✅ Solution: Get Your Google Credentials

### Step 1: Create Google OAuth Credentials

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)**
2. **Click "Select a Project"** → **"NEW PROJECT"**
   - Project name: `EHS` (or any name)
   - Click **Create**

3. Once created, search for **"Google+ API"** in the search bar
4. Click **"Google+ API"** → **Enable**

5. Go to **"Credentials"** (left sidebar)
   - Click **"+ CREATE CREDENTIALS"**
   - Choose **"OAuth 2.0 Client ID"**
   - If prompted, click **"CONFIGURE CONSENT SCREEN"** first:
     - Choose **External** → **Create**
     - Fill in:
       - App name: `EmbracingHigherSelf`
       - User support email: (your email)
       - Developer contact: (your email)
     - Click **Save and Continue** → **Save and Continue** → **Back to Dashboard**

6. Click **"+ CREATE CREDENTIALS"** → **OAuth 2.0 Client ID** again
   - Application type: **Web application**
   - Name: `EHS Frontend`
   - **Authorized JavaScript origins**, click **+ ADD URI**:
     ```
     http://localhost:5173
     http://localhost:3000
     ```
   - **Authorized redirect URIs**, click **+ ADD URI**:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
   - Click **Create**

7. **COPY** your `Client ID` (it looks like: `123456.apps.googleusercontent.com`)

---

## 🔧 Frontend Setup

### Step 2: Create Frontend .env File

1. Go to the **frontend folder**: `d:\EHS2\EHS\frontend\`

2. Create a new file named **`.env.local`** (NOT `.env`)

3. Add these lines:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

**Replace `YOUR_GOOGLE_CLIENT_ID_HERE`** with the Client ID you copied above.

**Example:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
```

4. **Save the file**

---

## 🔧 Backend Setup

### Step 3: Create Backend .env File

1. Go to the **backend folder**: `d:\EHS2\EHS\backend\`

2. Create a new file named **`.env`**

3. Add these lines:
```env
MONGODB_URI=mongodb://localhost:27017/embracinghigherself
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

**Get the values from Google Cloud Console:**
- Log back into [Google Cloud Console](https://console.cloud.google.com/)
- Go to **Credentials**
- Click on your OAuth 2.0 Client ID
- **Copy**:
  - `Client ID` (goes as `GOOGLE_CLIENT_ID`)
  - `Client Secret` (goes as `GOOGLE_CLIENT_SECRET`)

---

## 🏃 Run Your Application

### Terminal 1: Backend
```bash
cd d:\EHS2\EHS\backend
npm install  # First time only
npm run dev
```

### Terminal 2: Frontend
```bash
cd d:\EHS2\EHS\frontend
npm install  # First time only
npm run dev
```

Visit: **http://localhost:5173**

---

## ✅ Testing

1. Open http://localhost:5173 in your browser
2. Click **"Sign In"** or **"Sign Up"** button
3. You should see Google Sign-In options (not a blocked error)
4. Click a Google account to sign in
5. You should be logged in and see your profile image in the navbar!

---

## ❌ Troubleshooting

### Still seeing "Missing required parameter: client_id"?

**Checklist:**
- [ ] .env.local file exists in frontend folder (NOT .env)
- [ ] VITE_GOOGLE_CLIENT_ID is not empty
- [ ] No typos in Client ID
- [ ] Restarted frontend dev server after saving .env.local
- [ ] Cleared browser cache (Ctrl+Shift+Delete)

### "Access blocked: Authorization Error"?

- [ ] Check authorized origins in Google Cloud Console
- [ ] Make sure `http://localhost:5173` is added
- [ ] Wait 5 minutes for Google settings to propagate

### "Invalid token or authentication failed"?

- [ ] Check backend .env has GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- [ ] Restarted backend server
- [ ] Backend server is running on port 5000

### Can't find Google Cloud Console?

Visit: https://console.cloud.google.com/

---

## 🎉 You're Done!

Once set up, your EHS platform will have:
- ✅ Google Sign-In button
- ✅ Automatic user creation
- ✅ Profile image in navbar
- ✅ User dashboard
- ✅ Course tracking
- ✅ Logout functionality

**Happy coding! 🚀**
