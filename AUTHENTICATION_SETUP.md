# EHS User Authentication Setup Guide

## Overview
This document explains how to set up Google OAuth authentication for the EHS platform.

## Prerequisites
1. Node.js 16+ installed
2. MongoDB instance running locally or MongoDB Atlas account
3. Google Cloud Project with OAuth credentials

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/embracinghigherself

# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### 3. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Choose "Web application"
6. Authorized JavaScript origins: `http://localhost:5173`
7. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
8. Copy Client ID and Client Secret to `.env`

### 4. Start Backend Server
```bash
npm run dev
```

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3. Add Google Script

In your `index.html`, add Google Sign-In script:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### 4. Start Frontend Development Server
```bash
npm run dev
```

---

## File Structure - What Was Added

### Backend Files
- `src/controllers/auth.controller.js` - Updated with Google OAuth
- `src/routes/auth.routes.js` - Added `/google` endpoint
- `src/scripts/seedAdmin.js` - Admin seeding script

### Frontend Files
- `src/components/common/GoogleAuthModal.jsx` - Google Auth popup component
- `src/components/layout/Navbar.jsx` - Updated with auth buttons
- `src/pages/UserDashboard.jsx` - User dashboard with profile
- `src/context/AuthContext.jsx` - Updated with token management

---

## Authentication Flow

### Login Flow
1. User clicks "Sign In" or "Sign Up" button
2. GoogleAuthModal opens with Google Sign-In button
3. User authenticates with Google
4. Frontend receives Google ID token
5. Token sent to `/api/auth/google` endpoint
6. Backend verifies token and creates/updates user
7. JWT token returned to frontend
8. User redirected to home page
9. User profile image appears in navbar

### Dashboard Flow
1. Logged-in users can click profile image in navbar
2. Dropdown menu shows Dashboard option
3. Dashboard displays:
   - User profile with Google avatar
   - Enrolled courses
   - Purchased products
   - Account settings
   - Quick stats

### Logout Flow
1. User clicks profile picture → Logout
2. AuthContext clears token and user data
3. All cookies cleared
4. Redirected to home page

---

## API Endpoints

### Authentication Endpoints

**POST /api/auth/google**
- Body: `{ token: "google-id-token" }`
- Response: `{ success: true, token: "jwt-token", user: {...} }`

**GET /api/auth/me** (Protected)
- Headers: `Authorization: Bearer {jwt-token}`
- Response: User profile with purchased courses and products

**PATCH /api/auth/profile** (Protected)
- Body: `{ name?: string, avatar?: string }`
- Response: Updated user object

---

## Database Schema

### User Model
- `name` - Full name
- `email` - Email address (unique)
- `password` - Hashed password (optional for Google users)
- `googleId` - Google unique ID
- `avatar` - Profile picture URL
- `role` - 'user' or 'admin'
- `purchasedCourses` - Array of course IDs
- `purchasedProducts` - Array of product IDs
- `consultationBookings` - Array of booking IDs
- `timestamps` - Created and updated dates

---

## Key Features Implemented

✅ Google OAuth authentication
✅ User profile management
✅ Course enrollment tracking
✅ Product purchase history
✅ Circular profile image display in navbar
✅ Protected dashboard
✅ Secure token-based authentication
✅ Cookie clearing on logout
✅ Responsive design (mobile & desktop)
✅ Luxury theme maintained

---

## Testing

### Test Admin Login
```
Email: admin@embracinghigherself.com
Password: Admin@123456
```

### Test User Registration
1. Click "Sign In" or "Sign Up"
2. Google Auth Modal appears
3. Use any Google account to sign in
4. User automatically created/linked in database

---

## Troubleshooting

### "Failed to load Google authentication"
- Check that Google SDK is loading
- Verify GOOGLE_CLIENT_ID is correct in frontend .env
- Check browser console for CORS errors

### "Invalid token or authentication failed"
- Verify GOOGLE_CLIENT_ID is correct in backend .env
- Check JWT_SECRET is set in backend .env
- Ensure MongoDB connection is working

### "User not found after login"
- Check MongoDB connection
- Verify User model exists
- Check server logs for creation errors

### "Profile image not showing"
- Verify user.avatar URL is valid
- Check CORS headers allow avatar domain

---

## Production Deployment

Before deploying to production:

1. **Update Environment Variables**
   - Set `NODE_ENV=production`
   - Use production MongoDB URL
   - Update Google OAuth URLs to production domain
   - Change JWT_SECRET to strong random value

2. **Update CORS**
   - Set `CLIENT_URL` to production frontend URL

3. **Update Google OAuth**
   - Add production URLs to Google Cloud Console
   - Add production domain as authorized origin

4. **Database**
   - Backup production database
   - Run migrations if needed

5. **SSL/HTTPS**
   - Ensure all URLs use HTTPS
   - Update callback URLs accordingly

---

## Support

For issues or questions, contact the development team.
