import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { uploadResource } from '../middleware/upload.middleware.js';
import Resource from '../models/Resource.model.js';

const router = Router();

// POST /api/resources/upload — admin uploads a PDF
router.post(
  '/upload',
  protect,
  adminOnly,
  uploadResource.single('file'),   // uses your shared uploadResource multer config
  async (req, res) => {
    try {
      const { title, description, type, category } = req.body;

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
      }
      if (!title || !description) {
        return res.status(400).json({ success: false, message: 'Title and description are required.' });
      }

      const fileUrl = `/uploads/resources/${req.file.filename}`;

      const resource = await Resource.create({
        title,
        description,
        type: type || 'PDF',
        category: category || 'Beginner Guides',
        fileUrl,
        isPublished: true,
      });

      res.status(201).json({ success: true, resource });
    } catch (err) {
      // Multer errors (wrong file type, size limit) arrive here
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// GET /api/resources — public, returns published resources
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, resource });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;