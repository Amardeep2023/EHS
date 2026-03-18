import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import Resource from '../models/Resource.model.js';

const router = Router();

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
