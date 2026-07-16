import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCountryPricing } from '../context/CountryPricingContext';
import { getPriceForProduct, formatPrice } from '../utils/pricing';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const categories = ['All', 'Journals', 'Workbooks', 'Guides', 'Planners', 'Cards'];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { countryCode } = useCountryPricing();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Map API products to include `img` and `id` for compatibility
  const mapped = products.map((p) => ({
    ...p,
    id: p.slug || p._id,
    img: p.coverImage?.startsWith('http')
      ? p.coverImage
      : p.coverImage
        ? `${API_URL.replace('/api', '')}${p.coverImage}`
        : 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=60',
  }));

  const filtered = activeCategory === 'All'
    ? mapped
    : mapped.filter((p) => p.category === activeCategory);

  return (
    <main className="pt-20 overflow-hidden">
      {/* Header */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto text-center  bg-cream/65 backdrop-blur-[6px] rounded-luxury luxury-border p-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-label text-gold mb-4"
          >
            Digital Shop
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-boska text-6xl md:text-7xl text-espresso mb-6"
            style={{ fontFamily: 'Boska, Georgia, serif', letterSpacing: '-0.02em' }}
          >
            Tools for Transformation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary leading-relaxed max-w-xl mx-auto"
          >
            Instant-download digital products — journals, workbooks, and guides — to support your practice.
          </motion.p>
        </div>
      </section>

      {/* Loading */}
      {loading ? (
        <section className="pb-28 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-espresso/20 border-t-gold rounded-full animate-spin" />
          </div>
        </section>
      ) : (
        <>
          {/* Filter */}
          <section className="px-6 mb-10">
            <div className="max-w-7xl mx-auto flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-nav px-5 py-2 rounded-full transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-espresso text-cream'
                      : 'luxury-border text-espresso/60 hover:text-espresso'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Products grid */}
          <section className="pb-28 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
              {filtered.length === 0 ? (
                <div className="col-span-full text-center py-20 text-secondary">
                  No products found in this category.
                </div>
              ) : (
                filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(42,34,25,0.06)' }}
                    className="aspect-square rounded-luxury luxury-border bg-white overflow-hidden group cursor-pointer relative"
                    onClick={() => navigate(`/shop/${product.id}`)}
                  >
                    <img
                      src={product.img}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-cover img-sepia"
                    />

                    {/* Gradient overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/65 via-black/30 to-transparent pointer-events-none" />

                    {/* Category badge - top left */}
                    <span
                      className="absolute top-2.5 left-2.5 md:top-3 md:left-3 text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm z-10"
                      style={{ background: 'rgba(250,248,243,0.85)', color: '#d4a574' }}
                    >
                      {product.category}
                    </span>

                    {/* Add to Cart - top right, appears on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem(product);
                      }}
                      className="absolute top-2.5 right-2.5 md:top-3 md:right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ background: 'rgba(250,248,243,0.85)' }}
                      title="Add to Cart"
                    >
                      <ShoppingBag size={14} className="text-espresso group-hover:text-gold transition-colors" />
                    </button>

                    {/* Name and price overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 p-3 md:p-5 z-10">
                      <h3
                        className="font-boska text-sm md:text-lg lg:text-xl text-white leading-tight mb-0.5 md:mb-1 line-clamp-2"
                        style={{ fontFamily: 'Boska, Georgia, serif' }}
                      >
                        {product.title}
                      </h3>
                      <span
                        className="font-boska text-base md:text-xl lg:text-2xl text-gold"
                        style={{ fontFamily: 'Boska, Georgia, serif' }}
                      >
                        {formatPrice(getPriceForProduct(product, countryCode), countryCode)}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
