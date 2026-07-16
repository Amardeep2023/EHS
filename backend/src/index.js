import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import productRoutes from './routes/product.routes.js';
import resourceRoutes from './routes/resource.routes.js';
import storyRoutes from './routes/story.routes.js';
import consultationRoutes from './routes/consultation.routes.js';
import cartRoutes from './routes/cart.routes.js';
import adminRoutes from './routes/admin.routes.js';

// ── Connect to MongoDB ─────────────────────────────────────────
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Middleware ─────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  process.env.RENDER_FRONTEND_URL || 'http://localhost:5173',
  process.env.VERCEL_FRONTEND_URL || 'https://ehs-three.vercel.app',
  'https://ehs-0ze5.onrender.com', // Render frontend URL (if deployed separately)
  'https://ehs-three.vercel.app', // Vercel frontend URL
];

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl requests, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Routes ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/cart', cartRoutes);

app.use('/api/admin', adminRoutes);

// ── Health check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Error handler ───────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`EHS API running on http://localhost:${PORT}`);
});

export default app;
