
import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import Resource from '../models/Resource.model.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RESOURCE_UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'resources');

// Multer storage for PDFs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(RESOURCE_UPLOAD_DIR, { recursive: true });
    cb(null, RESOURCE_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});
// Admin upload PDF resource
router.post('/upload', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    const { title, description, type, category } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const fileUrl = `/uploads/resources/${req.file.filename}`;
    const resource = await Resource.create({
      title,
      description,
      type,
      category,
      fileUrl,
      isPublished: true,
    });
    res.status(201).json({ success: true, resource });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', async (req, res) => {
  const { category } = req.query;
  const filter = { isPublished: true };
  if (category) filter.category = category;
  const resources = await Resource.find(filter);
  res.json({ success: true, resources });
});

router.post('/', protect, adminOnly, async (req, res) => {
  const resource = await Resource.create(req.body);
  res.status(201).json({ success: true, resource });
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, resource });
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Resource.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Deleted' });
});

export default router;
