import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { uploadProductImage } from '../middleware/upload.middleware.js';
import Product from '../models/Product.model.js';

const router = Router();

// Public: get all published products
router.get('/', async (req, res) => {
  const products = await Product.find({ isPublished: true }).sort({ createdAt: -1 });
  res.json({ success: true, products });
});

// Admin: get all products (including drafts)
router.get('/all', protect, adminOnly, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ success: true, products });
});

// Public: get single product by slug
router.get('/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isPublished: true });
  if (!product) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, product });
});

// Admin: upload product image
router.post('/upload', protect, adminOnly, (req, res) => {
  uploadProductImage.single('coverImage')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    const imageUrl = `/uploads/products/${req.file.filename}`;
    res.json({ success: true, imageUrl });
  });
});

// Admin: create product
router.post('/', protect, adminOnly, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// Admin: update product
router.put('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, product });
});

// Admin: delete product
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Deleted' });
});

export default router;
