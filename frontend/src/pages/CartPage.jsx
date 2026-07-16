import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, ArrowLeft, ShoppingCart, MinusCircle, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCountryPricing } from '../context/CountryPricingContext';
import { getPriceForProduct, formatPrice } from '../utils/pricing';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function fallbackImg() {
  return 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=300&auto=format&fit=crop&q=60';
}

function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_URL.replace('/api', '')}${url}`;
}

export default function CartPage() {
  const { items, count, loading, removeItem, clearCart, getTotal } = useCart();
  const { isLoggedIn } = useAuth();
  const { countryCode } = useCountryPricing();
  const navigate = useNavigate();

  return (
    <main className="pt-20 min-h-screen overflow-hidden">
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-label text-gold mb-2"
              >
                Shopping Cart
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="font-boska text-4xl md:text-5xl text-espresso"
                style={{ fontFamily: 'Boska, Georgia, serif', letterSpacing: '-0.02em' }}
              >
                Your Cart
                {count > 0 && (
                  <span className="text-2xl text-secondary/40 ml-3">
                    ({count} item{count > 1 ? 's' : ''})
                  </span>
                )}
              </motion.h1>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-2 text-sm text-secondary hover:text-espresso transition-colors"
            >
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>

          {!isLoggedIn ? (
            /* ── Not logged in ─────────────────────────────────── */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-luxury luxury-border bg-white p-16 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-cream/70 flex items-center justify-center mx-auto mb-4">
                <LogIn size={28} className="text-secondary/30" />
              </div>
              <h2
                className="font-boska text-2xl text-espresso mb-3"
                style={{ fontFamily: 'Boska, Georgia, serif' }}
              >
                Sign in to view your cart
              </h2>
              <p className="text-sm text-secondary/60 mb-6 max-w-md mx-auto">
                Your cart items are stored with your account. Please sign in to see and manage your items.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-espresso text-cream px-8 py-3 rounded-full text-sm font-medium hover:bg-gold hover:text-espresso transition-all duration-300"
              >
                Sign In
              </button>
            </motion.div>
          ) : loading ? (
            /* ── Loading ───────────────────────────────────────── */
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-espresso/20 border-t-gold rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            /* ── Empty cart ────────────────────────────────────── */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-luxury luxury-border bg-white p-16 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-cream/70 flex items-center justify-center mx-auto mb-6">
                <ShoppingCart size={36} className="text-secondary/20" />
              </div>
              <h2
                className="font-boska text-3xl text-espresso mb-3"
                style={{ fontFamily: 'Boska, Georgia, serif' }}
              >
                Your cart is empty
              </h2>
              <p className="text-sm text-secondary/60 mb-8 max-w-md mx-auto">
                Looks like you haven't added anything yet. Browse our shop to find journals, workbooks, guides, and more.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-espresso text-cream px-8 py-3 rounded-full text-sm font-medium hover:bg-gold hover:text-espresso transition-all duration-300"
              >
                <ShoppingBag size={14} /> Browse Shop
              </Link>
            </motion.div>
          ) : (
            /* ── Cart items ────────────────────────────────────── */
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Items list */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, idx) => {
                  const imgUrl = resolveImage(item.coverImage);
                  const productId = item.productId || item._id;
                  return (
                    <motion.div
                      key={productId}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className="rounded-luxury luxury-border bg-white p-5 flex gap-5 items-center group hover:shadow-luxury-sm transition-all"
                    >
                      {/* Image */}
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-cream/50">
                        <img
                          src={imgUrl || fallbackImg()}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = fallbackImg(); }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/shop/${item.slug || productId}`}
                          className="font-boska text-lg text-espresso hover:text-gold transition-colors line-clamp-1"
                          style={{ fontFamily: 'Boska, Georgia, serif' }}
                        >
                          {item.title}
                        </Link>
                        {item.category && (
                          <p className="text-xs text-secondary/50 uppercase tracking-wider mt-0.5">
                            {item.category}
                          </p>
                        )}
                        <p className="font-boska text-xl text-gold mt-2" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                          {formatPrice(getPriceForProduct(item, countryCode), countryCode)}
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(productId)}
                        className="p-2.5 rounded-xl hover:bg-red-50 text-secondary/30 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Summary sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-luxury luxury-border bg-white p-8 sticky top-28"
                >
                  <h3
                    className="font-boska text-xl text-espresso mb-6"
                    style={{ fontFamily: 'Boska, Georgia, serif' }}
                  >
                    Order Summary
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Items ({count})</span>
                      <span className="text-espresso font-medium">{formatPrice(getTotal(countryCode), countryCode)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Shipping</span>
                      <span className="text-emerald-600 text-xs font-medium">Free (Digital)</span>
                    </div>
                    <div className="border-t border-espresso/5 pt-3 flex justify-between">
                      <span className="text-espresso font-medium">Total</span>
                      <span
                        className="font-boska text-2xl text-espresso"
                        style={{ fontFamily: 'Boska, Georgia, serif' }}
                      >
                        {formatPrice(getTotal(countryCode), countryCode)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        if (items.length === 1) {
                          navigate(`/shop/${items[0].slug || items[0].productId || items[0]._id}`);
                        } else {
                          navigate('/shop');
                        }
                      }}
                      className="w-full bg-espresso text-cream py-3 rounded-full text-sm font-medium hover:bg-gold hover:text-espresso transition-all duration-300"
                    >
                      Proceed to Purchase
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm text-secondary hover:text-red-500 hover:bg-red-50 transition-all border border-espresso/10"
                    >
                      <MinusCircle size={14} />
                      Clear Cart
                    </button>
                  </div>

                  <p className="text-[10px] text-secondary/40 text-center mt-4">
                    Secure checkout · Instant download after purchase
                  </p>
                </motion.div>
              </div>
            </div>
          )}

          {/* Mobile back link */}
          <div className="mt-8 text-center md:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-secondary hover:text-espresso transition-colors"
            >
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
