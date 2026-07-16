# ⚠️ VERCEL DEPLOYMENT - ENVIRONMENT VARIABLES SETUP

## Current Issues
Your Vercel frontend is showing errors because **environment variables are not set**:
1. ❌ `VITE_API_URL` - Not configured in Vercel
2. ❌ `VITE_GOOGLE_CLIENT_ID` - Not configured in Vercel
3. ❌ API calls failing with 404 (falling back to relative `/api` paths)

---

## ✅ REQUIRED ACTIONS

### Step 1: Add Environment Variables to Vercel Dashboard

Go to: **https://vercel.com/dashboard** → Your Project → **Settings** → **Environment Variables**

Add these variables:

#### **For Production:**
```
Name: VITE_API_URL
Value: https://ehs-0ze5.onrender.com/api
Environment: Production, Preview
```

```
Name: VITE_GOOGLE_CLIENT_ID
Value: 1012685373950-cae989uu10usrdh02kr996mgebnqu3f1.apps.googleusercontent.com
Environment: Production, Preview
```

#### **For Development/Preview:**
```
Name: VITE_API_URL
Value: https://ehs-0ze5.onrender.com/api
Environment: Preview
```

```
Name: VITE_GOOGLE_CLIENT_ID
Value: 1012685373950-cae989uu10usrdh02kr996mgebnqu3f1.apps.googleusercontent.com
Environment: Preview
```

### Step 2: Redeploy Vercel

After adding environment variables:

**Option A: Automatic (Recommended)**
1. Go to **Deployments** tab in Vercel
2. Click the three dots (•••) on the latest deployment
3. Select **"Redeploy"**

**Option B: Manual (via Git)**
```bash
git push origin main
# Vercel will automatically redeploy
```

---

## 📝 Added Configuration Files

### `frontend/vercel.json` (NEW)
This file tells Vercel to:
1. Build with: `npm run build`
2. Use framework: Vite
3. Expose environment variables: `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`
4. Rewrite `/api/*` requests to Render backend (fallback)

**Key Line:**
```json
"rewrites": [
  {
    "source": "/api/:path*",
    "destination": "https://ehs-0ze5.onrender.com/api/:path*"
  }
]
```

---

## 🔍 How It Works After Setup

### Before (Current - Broken):
```
Browser: https://ehs-three.vercel.app
    ↓
Frontend code: VITE_API_URL is undefined/empty
    ↓
Defaults to relative path: /api/courses
    ↓
Vercel catches request, returns 404 HTML
    ↓
Browser shows: "The page c..." error
```

### After (After Setup - Fixed):
```
Browser: https://ehs-three.vercel.app
    ↓
Frontend code: VITE_API_URL = https://ehs-0ze5.onrender.com/api
    ↓
Makes request to: https://ehs-0ze5.onrender.com/api/courses
    ↓
Render backend responds with JSON
    ↓
Browser shows: Course data ✅
```

---

## 📋 Checklist

### Vercel Dashboard Setup:
- [ ] Open Vercel Dashboard
- [ ] Go to Project Settings → Environment Variables
- [ ] Add `VITE_API_URL=https://ehs-0ze5.onrender.com/api`
- [ ] Add `VITE_GOOGLE_CLIENT_ID=1012685373950-cae989uu10usrdh02kr996mgebnqu3f1.apps.googleusercontent.com`
- [ ] Set both for: **Production** and **Preview**
- [ ] Click "Save"

### Vercel Redeploy:
- [ ] Go to Deployments
- [ ] Click Redeploy on latest deployment OR
- [ ] Push code to GitHub to trigger auto-deploy

### Local Testing (Optional - to verify):
```bash
cd frontend

# Build locally
npm run build

# Serve the build
npm install -g serve
serve -s dist

# Visit http://localhost:3000
# Should use .env.production (https://ehs-0ze5.onrender.com/api)
```

---

## ✨ Updated Frontend Files

### `.env` (Frontend default)
```
VITE_API_URL=/api
VITE_GOOGLE_CLIENT_ID=1012685373950-cae989uu10usrdh02kr996mgebnqu3f1.apps.googleusercontent.com
```

### `.env.local` (Local development)
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=1012685373950-cae989uu10usrdh02kr996mgebnqu3f1.apps.googleusercontent.com
```

### `.env.production` (Vercel/Production build)
```
VITE_API_URL=https://ehs-0ze5.onrender.com/api
VITE_GOOGLE_CLIENT_ID=1012685373950-cae989uu10usrdh02kr996mgebnqu3f1.apps.googleusercontent.com
```

### `vercel.json` (NEW - Vercel config)
```json
{
  "buildCommand": "npm run build",
  "framework": "vite",
  "env": [
    "VITE_API_URL",
    "VITE_GOOGLE_CLIENT_ID"
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://ehs-0ze5.onrender.com/api/:path*"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Still seeing "VITE_GOOGLE_CLIENT_ID not set"?
1. ✅ Check: Environment variables added to Vercel?
2. ✅ Check: Set for **both** Production AND Preview?
3. ✅ Check: Redeployed after adding variables?
4. ✅ Check: Waited 1-2 minutes for Vercel to rebuild?

### Still seeing 404 errors?
1. ✅ Check: `VITE_API_URL=https://ehs-0ze5.onrender.com/api` is set?
2. ✅ Check: Render backend is actually running? Test: https://ehs-0ze5.onrender.com/api/health
3. ✅ Check: Network tab in browser dev tools shows full URL?
4. ✅ Check: No CORS errors in browser console?

### Testing Render Backend:
```bash
# Open browser console and paste:
fetch('https://ehs-0ze5.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log(d))

# Should show: { status: 'ok', timestamp: '...' }
```

---

## 📞 Support

**All errors should be fixed after:**
1. Adding environment variables to Vercel ✅
2. Redeploying the Vercel project ✅

**Verify by:**
1. Visit https://ehs-three.vercel.app
2. Open browser DevTools (F12)
3. Check Network tab for API requests
4. Should see requests to: `https://ehs-0ze5.onrender.com/api/...`
5. Responses should be JSON (not HTML error pages)

---

## Next Steps

1. **Immediately:** Add environment variables to Vercel dashboard ⬅️ DO THIS NOW
2. **Wait:** 1-2 minutes for Vercel to rebuild
3. **Test:** Visit https://ehs-three.vercel.app and check for errors
4. **Report:** Any remaining errors?

🚀 After these steps, your project should work perfectly!
