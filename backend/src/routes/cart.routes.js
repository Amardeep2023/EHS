import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  getCartCount,
} from '../controllers/cart.controller.js';

const router = Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.get('/count', getCartCount);
router.post('/', addToCart);
router.delete('/clear', clearCart);
router.delete('/:productId', removeFromCart);

export default router;
