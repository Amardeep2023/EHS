import { Router } from 'express';
import { 
  createBooking, 
  getMyBookings, 
  getAllBookings, 
  updateBooking,
  capturePayment  // Add this import
} from '../controllers/consultation.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { attachFullUser } from '../middleware/attachFullUser.middleware.js';

const router = Router();

// Add capture-payment route BEFORE other routes
router.post('/capture-payment', protect, attachFullUser, capturePayment);
router.post('/', protect, attachFullUser, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id', protect, adminOnly, updateBooking);

export default router;