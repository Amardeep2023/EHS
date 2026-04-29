import { Router } from 'express';
import {
  getAllCourses, getCourse, createCourse, updateCourse, deleteCourse,
  initiatePurchase, capturePurchase, checkPurchase,
} from '../controllers/course.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = Router();

// Public
router.get('/', getAllCourses);

// Protected user routes
router.get('/:slug', protect, getCourse);
router.post('/purchase/initiate', protect, initiatePurchase);
router.post('/purchase/capture', protect, capturePurchase);
router.get('/purchase/status/:courseId', protect, checkPurchase);

// Admin only
router.post('/', protect, adminOnly, createCourse);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

export default router;
