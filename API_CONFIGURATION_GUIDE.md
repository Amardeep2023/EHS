# API URL Configuration Summary

Your project has been updated to support **localhost** (local development), **Render** (backend), and **Vercel** (frontend) production deployment.

## Current Deployment URLs
- **Backend**: https://ehs-0ze5.onrender.com
- **Frontend**: https://ehs-three.vercel.app

## Changes Made

### 1. Backend Configuration

#### `backend/.env`
- Added `RENDER_API_URL=https://ehs-0ze5.onrender.com`
- Added `RENDER_FRONTEND_URL=http://localhost:5173` (update for production)
- Added `VERCEL_FRONTEND_URL=https://ehs-three.vercel.app`
- Keep existing `CLIENT_URL` and `FRONTEND_URL` for local development
- The backend uses environment variable fallbacks, so it works locally AND on production

#### `backend/src/index.js`
- Updated CORS configuration to accept multiple origins:
  - `localhost:5173` (local development)
  - `RENDER_FRONTEND_URL` environment variable
  - `VERCEL_FRONTEND_URL` environment variable
  - `https://ehs-0ze5.onrender.com` (production backend)
  - `https://ehs-three.vercel.app` (production frontend on Vercel)
- Requests with no origin are also allowed (for mobile apps, curl requests, etc.)

#### `backend/src/controllers/course.controller.js`
- Updated CLIENT_URL logic to support:
  1. `process.env.CLIENT_URL` (primary - localhost)
  2. `process.env.RENDER_FRONTEND_URL` (fallback for Render production)
  3. `process.env.VERCEL_FRONTEND_URL` (fallback for Vercel production)
  4. `'http://localhost:5173'` (hardcoded fallback)

#### `backend/src/controllers/consultation.controller.js`
- Updated FRONTEND_URL logic to support:
  1. `process.env.FRONTEND_URL` (primary - localhost)
  2. `process.env.RENDER_FRONTEND_URL` (fallback for Render production)
  3. `process.env.VERCEL_FRONTEND_URL` (fallback for Vercel production)
  4. `'http://localhost:5173'` (hardcoded fallback)
- **Fixed bug**: Changed from port 3000 to 5173 (correct frontend port)

### 2. Frontend Configuration

#### `frontend/.env.local` (Development)
```
VITE_API_URL=http://localhost:5000/api
```
- Used when running locally with `npm run dev`
- Proxies through Vite dev server to localhost backend

#### `frontend/.env.production` (Production Build - Vercel)
```
VITE_API_URL=https://ehs-0ze5.onrender.com/api
```
- Used when building with `npm run build`
- Points directly to Render backend API
- Automatically used by Vercel deployment

#### `frontend/.env` (Default)
```
VITE_API_URL=/api
```
- Default fallback for relative API paths
- Works when frontend and backend are served from same origin

#### `frontend/vite.config.js`
- Updated proxy target to use `process.env.VITE_API_URL || 'http://localhost:5000'`
- Allows override of proxy target via environment variables

### 3. Frontend Files Already Using Environment Variables
All these files correctly use `import.meta.env.VITE_API_URL`:
- `src/api/index.js` (axios base configuration)
- `src/utils/media.js` (media URL resolution)
- `src/pages/Courses.jsx`
- `src/pages/CourseDetail.jsx` (Academy.jsx)
- `src/pages/UserDashboard.jsx`
- `src/pages/CartPage.jsx`
- `src/pages/Shop.jsx`
- `src/pages/ProductDetail.jsx`
- `src/pages/FreeResources.jsx`
- `src/pages/SuccessStories.jsx`
- `src/pages/StoryForm.jsx`
- `src/pages/UploadFreeCourseForm.jsx`
- `src/context/AuthContext.jsx`
- `src/context/CartContext.jsx`
- `src/context/CountryPricingContext.jsx`
- `src/components/admin/CourseForm.jsx`
- `src/components/admin/ProductUpload.jsx`
- `src/components/common/GoogleAuthModal.jsx`

## How It Works

### Local Development
```bash
cd backend
npm start          # Runs on http://localhost:5000

# In another terminal:
cd frontend
npm run dev        # Runs on http://localhost:5173
                   # Uses .env.local → VITE_API_URL=http://localhost:5000/api
```

### Production Deployment
**Current Setup:**
- Backend: Render (https://ehs-0ze5.onrender.com)
- Frontend: Vercel (https://ehs-three.vercel.app)

**How it works:**
1. Vercel frontend is configured with `.env.production` → points to Render backend API
2. Render backend CORS accepts both localhost and Vercel frontend URL
3. All payment redirects and OAuth callbacks work across origins

## Environment Variables Reference

### Backend (.env)
| Variable | Local | Render Production |
|----------|-------|------------------|
| `CLIENT_URL` | `http://localhost:5173` | `https://ehs-three.vercel.app` |
| `FRONTEND_URL` | `http://localhost:5173` | `https://ehs-three.vercel.app` |
| `GOOGLE_CALLBACK_URL` | `http://localhost:5000/api/auth/google/callback` | `https://ehs-0ze5.onrender.com/api/auth/google/callback` |
| `RENDER_API_URL` | (optional) | `https://ehs-0ze5.onrender.com` |
| `RENDER_FRONTEND_URL` | `http://localhost:5173` | `https://ehs-three.vercel.app` |
| `VERCEL_FRONTEND_URL` | `https://ehs-three.vercel.app` | `https://ehs-three.vercel.app` |

### Frontend (.env files)
| File | Use Case | VITE_API_URL |
|------|----------|-------------|
| `.env` | Default | `/api` (relative) |
| `.env.local` | Local development | `http://localhost:5000/api` |
| `.env.production` | Production build | `https://ehs-0ze5.onrender.com/api` |

## Next Steps for Production Deployment

### Backend on Render
Update backend environment variables on Render dashboard:
```
GOOGLE_CALLBACK_URL=https://ehs-0ze5.onrender.com/api/auth/google/callback
CLIENT_URL=https://ehs-three.vercel.app
FRONTEND_URL=https://ehs-three.vercel.app
RENDER_FRONTEND_URL=https://ehs-three.vercel.app
VERCEL_FRONTEND_URL=https://ehs-three.vercel.app
```

### Frontend on Vercel
Vercel automatically uses `.env.production`:
- `VITE_API_URL=https://ehs-0ze5.onrender.com/api`
- No additional setup needed; just push to GitHub and Vercel will redeploy

### Google OAuth Configuration
Update Google Cloud Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to OAuth 2.0 Credentials
4. Update authorized redirect URI:
   - Add: `https://ehs-0ze5.onrender.com/api/auth/google/callback`
   - Keep: `http://localhost:5000/api/auth/google/callback` (for local testing)

## Testing

### Local Testing (Localhost + Backend)
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev

# Visit http://localhost:5173
# Verify API calls go to http://localhost:5000/api
```

### Testing with Render Backend (from Localhost Frontend)
To test the Render backend before full production:
```bash
# Update frontend/.env.local temporarily:
VITE_API_URL=https://ehs-0ze5.onrender.com/api

# Then run:
npm run dev

# Visit http://localhost:5173
# Verify API calls go to https://ehs-0ze5.onrender.com/api
```

### Testing Production Build Locally
```bash
# Create production build
npm run build

# Serve the build
npm install -g serve
serve -s dist

# Visit http://localhost:3000
# This uses .env.production → https://ehs-0ze5.onrender.com/api
```

### Production Testing (Vercel + Render)
- Visit https://ehs-three.vercel.app
- Test all features: login, course enrollment, payments, consultations
- Check browser console for CORS errors
- Verify API calls go to https://ehs-0ze5.onrender.com/api
