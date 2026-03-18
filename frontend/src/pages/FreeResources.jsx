import { motion } from 'framer-motion';
import { Download, Play, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

const categories = ['All', 'Beginner Guides', 'Quick Practices', 'Challenges', 'Videos'];

const resources = [
  {
    title: 'Manifestation Starter Guide',
    description: 'A comprehensive introduction to the principles of conscious creation and how to apply them daily.',
    type: 'PDF',
    category: 'Beginner Guides',
    pages: '24 pages',
    file: '#',
  },
  {
    title: 'Morning Alignment Ritual',
    description: 'A 10-minute guided video practice to align your energy with intention before each day begins.',
    type: 'Video',
    category: 'Videos',
    duration: '10 min',
    file: '#',
  },
  {
    title: '7-Day Mindset Reset',
    description: 'A structured 7-day guide with daily prompts, affirmations, and reflection exercises.',
    type: 'PDF',
    category: 'Challenges',
    pages: '18 pages',
    file: '#',
  },
  {
    title: 'Understanding the Law of Attraction',
    description: 'A clear, evidence-based exploration of how your thoughts and energy shape your reality.',
    type: 'PDF',
    category: 'Beginner Guides',
    pages: '16 pages',
    file: '#',
  },
  {
    title: '5-Minute Breathwork Practice',
    description: 'A calming breathwork video to reduce resistance and open yourself to receiving.',
    type: 'Video',
    category: 'Quick Practices',
    duration: '5 min',
    file: '#',
  },
  {
    title: 'Abundance Affirmations Pack',
    description: '50 carefully crafted affirmations for wealth, love, health, and purpose.',
    type: 'PDF',
    category: 'Quick Practices',
    pages: '8 pages',
    file: '#',
  },
];

export default function FreeResources() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? resources
    : resources.filter((r) => r.category === activeCategory);

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
            Free Resource Hub
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-boska text-6xl md:text-7xl text-espresso mb-6"
            style={{ fontFamily: 'Boska, Georgia, serif', letterSpacing: '-0.02em' }}
          >
            Start Here. At No Cost.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary leading-relaxed max-w-xl mx-auto"
          >
            Downloadable PDFs, guided videos, and practices designed to introduce you to the transformational work — completely free.
          </motion.p>
        </div>
      </section>

      {/* Filter */}
      <section className="px-6 mb-12">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-nav px-5 py-2 rounded-full transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-espresso text-cream'
                  : 'luxury-border text-espresso/60 hover:text-espresso hover:border-espresso/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="pb-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(42,34,25,0.06)' }}
              className="p-8 rounded-luxury luxury-border bg-white group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-label text-gold">{r.category}</span>
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{
                    background: r.type === 'PDF' ? 'rgba(212,165,116,0.12)' : 'rgba(42,34,25,0.06)',
                    color: '#d4a574',
                  }}
                >
                  {r.type}
                </span>
              </div>
              <h3
                className="font-boska text-2xl text-espresso mb-3"
                style={{ fontFamily: 'Boska, Georgia, serif' }}
              >
                {r.title}
              </h3>
              <p className="text-sm text-secondary leading-relaxed mb-6">{r.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-espresso/40">{r.pages || r.duration}</span>
                <a
                  href={r.file}
                  className="flex items-center gap-2 text-sm font-medium text-gold hover:text-espresso transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  {r.type === 'Video' ? (
                    <><Play size={14} /> Watch</>
                  ) : (
                    <><Download size={14} /> Download</>
                  )}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
