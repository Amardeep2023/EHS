import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import User from '../models/User.model.js';
import Course from '../models/Course.model.js';
import Product from '../models/Product.model.js';
import Consultation from '../models/Consultation.model.js';

const router = Router();

// All admin routes are protected
router.use(protect, adminOnly);

router.get('/dashboard', async (req, res) => {
  const [totalUsers, totalCourses, totalProducts, pendingBookings] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Course.countDocuments(),
    Product.countDocuments(),
    Consultation.countDocuments({ status: 'pending' }),
  ]);
  res.json({ success: true, stats: { totalUsers, totalCourses, totalProducts, pendingBookings } });
});

router.get('/users', async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, users });
});

router.patch('/users/:id/grant-course', async (req, res) => {
  const { courseId } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { purchasedCourses: courseId } },
    { new: true }
  );
  res.json({ success: true, user });
});

export default router;
