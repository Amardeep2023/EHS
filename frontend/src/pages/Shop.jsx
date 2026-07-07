import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const categories = ['All', 'Journals', 'Workbooks', 'Guides', 'Planners', 'Cards'];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

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
        <div className="max-w-4xl mx-auto text-center">
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
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(42,34,25,0.06)' }}
                    className="rounded-luxury luxury-border bg-white overflow-hidden group cursor-pointer"
                    onClick={() => navigate(`/shop/${product.id}`)}
                  >
                    <div className="overflow-hidden h-48">
                      <img
                        src={product.img}
                        alt={product.title}
                        className="w-full h-full object-cover img-sepia"
                      />
                    </div>
                    <div className="p-8">
                      <span
                        className="text-xs font-medium px-3 py-1 rounded-full mb-4 inline-block"
                        style={{ background: 'rgba(212,165,116,0.12)', color: '#d4a574' }}
                      >
                        {product.category}
                      </span>
                      <h3
                        className="font-boska text-2xl text-espresso mb-2"
                        style={{ fontFamily: 'Boska, Georgia, serif' }}
                      >
                        {product.title}
                      </h3>
                      <p className="text-sm text-secondary leading-relaxed mb-6">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span
                          className="font-boska text-2xl text-espresso"
                          style={{ fontFamily: 'Boska, Georgia, serif' }}
                        >
                          ${product.price}
                        </span>
                        <button className="flex items-center gap-2 bg-espresso text-cream px-5 py-2 rounded-full text-sm hover:bg-gold hover:text-espresso transition-all duration-300">
                          <ShoppingBag size={13} /> Purchase
                        </button>
                      </div>
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
