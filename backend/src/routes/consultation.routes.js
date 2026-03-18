import { Router } from 'express';
import { createBooking, getMyBookings, getAllBookings, updateBooking } from '../controllers/consultation.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id', protect, adminOnly, updateBooking);

export default router;
