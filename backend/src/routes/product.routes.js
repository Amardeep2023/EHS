import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import Product from '../models/Product.model.js';

const router = Router();

router.get('/', async (req, res) => {
  const products = await Product.find({ isPublished: true });
  res.json({ success: true, products });
});

router.get('/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isPublished: true });
  if (!product) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, product });
});

router.post('/', protect, adminOnly, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, product });
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Deleted' });
});

export default router;
