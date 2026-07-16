# API URL Configuration Summary

Your project has been updated to support both **localhost** (for local development) and **Render URL** (https://ehs-0ze5.onrender.com) for production deployment.

## Changes Made

### 1. Backend Configuration

#### `backend/.env`
- Added `RENDER_API_URL=https://ehs-0ze5.onrender.com`
- Added `RENDER_FRONTEND_URL=http://localhost:5173`
- Keep existing `CLIENT_URL` and `FRONTEND_URL` for local development
- The backend uses environment variable fallbacks, so it works locally AND on production

#### `backend/src/index.js`
- Updated CORS configuration to accept multiple origins:
  - `localhost:5173` (local development)
  - `RENDER_FRONTEND_URL` environment variable
  - `https://ehs-0ze5.onrender.com` (production frontend)
- Requests with no origin are also allowed (for mobile apps, curl requests, etc.)

#### `backend/src/controllers/course.controller.js`
- Updated CLIENT_URL logic to support:
  1. `process.env.CLIENT_URL` (primary - localhost)
  2. `process.env.RENDER_FRONTEND_URL` (fallback for production)
  3. `'http://localhost:5173'` (hardcoded fallback)

#### `backend/src/controllers/consultation.controller.js`
- Updated FRONTEND_URL logic to support:
  1. `process.env.FRONTEND_URL` (primary - localhost)
  2. `process.env.RENDER_FRONTEND_URL` (fallback for production)
  3. `'http://localhost:5173'` (hardcoded fallback)
- **Fixed bug**: Changed from port 3000 to 5173 (correct frontend port)

### 2. Frontend Configuration

#### `frontend/.env.local` (Development)
```
VITE_API_URL=http://localhost:5000/api
```
- Used when running locally with `npm run dev`
- Proxies through Vite dev server to localhost backend

#### `frontend/.env.production` (Production Build)
```
VITE_API_URL=https://ehs-0ze5.onrender.com/api
```
- Used when building with `npm run build`
- Points directly to Render backend API

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

### Production Deployment (Render)
1. Backend deployed to: `https://ehs-0ze5.onrender.com`
2. Frontend can be:
   - **Option A**: Deployed to same Render instance → uses relative `/api` paths
   - **Option B**: Deployed to different origin → use `.env.production` with `VITE_API_URL=https://ehs-0ze5.onrender.com/api`

3. Both use correct CORS origins via environment variables

## Environment Variables Reference

### Backend (.env)
| Variable | Local | Production |
|----------|-------|-----------|
| `CLIENT_URL` | `http://localhost:5173` | `http://localhost:5173` (or Render frontend) |
| `FRONTEND_URL` | `http://localhost:5173` | `http://localhost:5173` (or Render frontend) |
| `GOOGLE_CALLBACK_URL` | `http://localhost:5000/api/auth/google/callback` | `https://ehs-0ze5.onrender.com/api/auth/google/callback` |
| `RENDER_API_URL` | (optional) | `https://ehs-0ze5.onrender.com` |
| `RENDER_FRONTEND_URL` | (optional) | Frontend URL on Render |

### Frontend (.env files)
| File | Use Case | VITE_API_URL |
|------|----------|-------------|
| `.env` | Default | `/api` (relative) |
| `.env.local` | Local development | `http://localhost:5000/api` |
| `.env.production` | Production build | `https://ehs-0ze5.onrender.com/api` |

## Next Steps for Production Deployment

Before deploying to Render, update:

1. **Backend `.env` on Render:**
   ```
   GOOGLE_CALLBACK_URL=https://ehs-0ze5.onrender.com/api/auth/google/callback
   CLIENT_URL=<your-frontend-url>  # Or keep http://localhost:5173 if testing locally
   FRONTEND_URL=<your-frontend-url>
   ```

2. **Frontend `.env.production`:**
   ```
   VITE_API_URL=https://ehs-0ze5.onrender.com/api
   ```

3. **Google OAuth Settings:**
   - Update Google Console redirect URI to: `https://ehs-0ze5.onrender.com/api/auth/google/callback`

## Testing

### Local Testing
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev

# Visit http://localhost:5173
# Verify API calls go to http://localhost:5000/api
```

### Testing Render URL Locally
To test the Render URL before deployment:
```bash
# Update frontend/.env.local temporarily:
VITE_API_URL=https://ehs-0ze5.onrender.com/api

# Then run:
npm run dev
```
