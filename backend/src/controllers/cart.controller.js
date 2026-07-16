import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';

/**
 * Get the current user's cart
 * @route GET /api/cart
 */
export async function getCart(req, res) {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Add a product to the cart
 * @route POST /api/cart
 * @body { productId }
 */
export async function addToCart(req, res) {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID required' });
    }

    // Find the product to get current data
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // Check for duplicates
    const exists = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (exists) {
      return res.json({ success: true, cart, message: 'Item already in cart' });
    }

    cart.items.push({
      productId: product._id,
      title: product.title,
      price: product.price,
      coverImage: product.coverImage || '',
      category: product.category || '',
      slug: product.slug || product._id,
    });

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Remove a product from the cart
 * @route DELETE /api/cart/:productId
 */
export async function removeFromCart(req, res) {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();

    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Clear the entire cart
 * @route DELETE /api/cart
 */
export async function clearCart(req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, cart: cart || { items: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get cart item count
 * @route GET /api/cart/count
 */
export async function getCartCount(req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    const count = cart ? cart.items.length : 0;
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
