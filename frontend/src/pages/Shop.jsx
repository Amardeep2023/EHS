import { motion } from 'framer-motion';
import { ShoppingBag, Download, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const products = [
  {
    id: 'manifestation-journal',
    title: 'Manifestation Journal',
    description: 'A 90-day guided journal with daily prompts, weekly reflections, and manifestation tracking pages.',
    price: 27,
    category: 'Journals',
    img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=60',
    purchased: false,
  },
  {
    id: 'abundance-workbook',
    title: 'Abundance Mindset Workbook',
    description: 'A deep-dive workbook to identify, challenge, and reprogram your money and abundance beliefs.',
    price: 19,
    category: 'Workbooks',
    img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=60',
    purchased: false,
  },
  {
    id: 'vision-board-guide',
    title: 'Vision Board Mastery Guide',
    description: 'A practical guide to creating a vision board that actually works — grounded in neuroscience.',
    price: 15,
    category: 'Guides',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=60',
    purchased: true,
  },
  {
    id: 'morning-ritual-planner',
    title: 'Morning Ritual Planner',
    description: 'A beautifully designed planner to build and maintain a powerful morning alignment routine.',
    price: 22,
    category: 'Planners',
    img: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=600&auto=format&fit=crop&q=60',
    purchased: false,
  },
  {
    id: 'affirmation-deck',
    title: 'Digital Affirmation Deck',
    description: '60 high-frequency affirmation cards beautifully designed for daily practice and journaling.',
    price: 12,
    category: 'Cards',
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=60',
    purchased: false,
  },
  {
    id: 'goal-setting-blueprint',
    title: 'Goal Setting Blueprint',
    description: 'A comprehensive framework to set, align, and achieve goals from the inside out.',
    price: 24,
    category: 'Guides',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&auto=format&fit=crop&q=60',
    purchased: false,
  },
];

const categories = ['All', 'Journals', 'Workbooks', 'Guides', 'Planners', 'Cards'];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { user } = useAuth();

  const filtered = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const purchased = products.filter((p) => p.purchased);

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

      {/* My Purchases */}
      {user && purchased.length > 0 && (
        <section className="px-6 mb-16">
          <div className="max-w-7xl mx-auto">
            <p className="text-label text-gold mb-6">My Purchases</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchased.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-5 rounded-2xl luxury-border bg-white"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-espresso truncate">{p.title}</h4>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-gold font-medium hover:text-espresso transition-colors flex-shrink-0">
                    <Download size={12} /> Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(42,34,25,0.06)' }}
              className="rounded-luxury luxury-border bg-white overflow-hidden group cursor-pointer"
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
                  {product.purchased ? (
                    <button className="flex items-center gap-2 text-sm font-medium text-gold hover:text-espresso transition-colors">
                      <Download size={14} /> Download
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 bg-espresso text-cream px-5 py-2 rounded-full text-sm hover:bg-gold hover:text-espresso transition-all duration-300">
                      <ShoppingBag size={13} /> Purchase
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
