import { Router } from 'express';
import { getAllCourses, getCourse, createCourse, updateCourse, deleteCourse } from '../controllers/course.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getAllCourses);
router.get('/:slug', protect, getCourse);

// Admin only
router.post('/', protect, adminOnly, createCourse);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

export default router;
