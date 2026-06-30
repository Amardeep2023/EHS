import { Router } from 'express';
import {
  getAllCourses,
  getAdminCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  initiatePurchase,
  capturePurchase,
  checkPurchase,
} from '../controllers/course.controller.js';
import { protect, adminOnly, optionalProtect } from '../middleware/auth.middleware.js';
import { uploadCourseFiles } from '../middleware/upload.middleware.js';

const router = Router();

router.post('/upload', protect, adminOnly, uploadCourseFiles, async (req, res) => {
  try {
    const files = req.files || {};
    const urls = {};

    if (files.thumbnail?.[0]) {
      urls.thumbnailUrl = `/uploads/courses/thumbnails/${files.thumbnail[0].filename}`;
    }
    if (files.audio?.[0]) {
      urls.audioUrl = `/uploads/courses/audio/${files.audio[0].filename}`;
    }
    if (files.pdf?.[0]) {
      urls.pdfUrl = `/uploads/courses/pdf/${files.pdf[0].filename}`;
    }

    if (!Object.keys(urls).length) {
      return res.status(400).json({ success: false, message: 'No course file uploaded' });
    }

    res.json({ success: true, ...urls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Public
router.get('/', getAllCourses);
router.get('/admin', protect, adminOnly, getAdminCourses);

// Public course detail route (optional auth — auto-detects purchased status if token provided)
router.get('/:slug', optionalProtect, getCourse);
router.post('/purchase/initiate', protect, initiatePurchase);
router.post('/purchase/capture', protect, capturePurchase);
router.get('/purchase/status/:courseId', protect, checkPurchase);

// Admin only
router.post('/', protect, adminOnly, createCourse);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

export default router;
