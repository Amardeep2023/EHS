import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import Story from '../models/Story.model.js';

const router = Router();

router.get('/', async (req, res) => {
  const stories = await Story.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, stories });
});

router.post('/', protect, adminOnly, async (req, res) => {
  const story = await Story.create(req.body);
  res.status(201).json({ success: true, story });
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const story = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, story });
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Story.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Deleted' });
});

export default router;
