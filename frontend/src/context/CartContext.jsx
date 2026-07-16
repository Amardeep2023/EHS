import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getPriceForProduct } from '../utils/pricing';

const CartContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || '/api';

export function CartProvider({ children }) {
  const { user, token, isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  // ── Fetch cart from backend when user logs in ────────────────
  const fetchCart = useCallback(async () => {
    if (!isLoggedIn || !token) {
      setItems([]);
      setCount(0);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setItems(data.cart?.items || []);
        setCount(data.cart?.items?.length || 0);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, token]);

  // Fetch cart on mount and when auth state changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ── Add item ─────────────────────────────────────────────────
  const addItem = useCallback(
    async (product) => {
      if (!isLoggedIn || !token) return;
      try {
        const res = await fetch(`${API_URL}/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product._id }),
        });
        const data = await res.json();
        if (data.success) {
          setItems(data.cart?.items || []);
          setCount(data.cart?.items?.length || 0);
        }
      } catch (err) {
        console.error('Failed to add to cart:', err);
      }
    },
    [isLoggedIn, token]
  );

  // ── Remove item ──────────────────────────────────────────────
  const removeItem = useCallback(
    async (productId) => {
      if (!isLoggedIn || !token) return;
      try {
        const res = await fetch(`${API_URL}/cart/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setItems(data.cart?.items || []);
          setCount(data.cart?.items?.length || 0);
        }
      } catch (err) {
        console.error('Failed to remove from cart:', err);
      }
    },
    [isLoggedIn, token]
  );

  // ── Clear cart ───────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    try {
      const res = await fetch(`${API_URL}/cart/clear`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setItems([]);
        setCount(0);
      }
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  }, [isLoggedIn, token]);

  // ── Helpers ──────────────────────────────────────────────────
  const getTotal = useCallback(
    (countryCode) =>
      items.reduce((sum, item) => sum + getPriceForProduct(item, countryCode), 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        loading,
        addItem,
        removeItem,
        clearCart,
        getTotal,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
