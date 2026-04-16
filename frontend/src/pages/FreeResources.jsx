import { motion } from 'framer-motion';
import { Download, Play, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const categories = ['All', 'Beginner Guides', 'Quick Practices', 'Challenges', 'Videos'];

export default function FreeResources() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch(`${API_URL}/resources`);
      const data = await res.json();
      if (data.success) {
        setResources(data.resources);
      }
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = activeCategory === 'All'
    ? resources
    : resources.filter((r) => r.category === activeCategory);

  // Helper function to get full file URL
  const getFileUrl = (fileUrl) => {
    return `${API_URL.replace('/api', '')}${fileUrl}`;
  };

  const getDownloadName = (resource) => {
    const safeTitle = (resource?.title || 'resource')
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return `${safeTitle || 'resource'}.pdf`;
  };

  const handleDownload = async (e, resource) => {
    e.preventDefault();
    try {
      const fileUrl = getFileUrl(resource.fileUrl);
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = getDownloadName(resource);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  // Helper function to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
        {loading ? (
          <div className="max-w-7xl mx-auto text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gold border-t-transparent"></div>
            <p className="text-secondary mt-4">Loading resources...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="max-w-7xl mx-auto text-center py-20">
            <p className="text-secondary text-lg">No resources found in this category.</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r, i) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(42,34,25,0.06)' }}
                className="p-8 rounded-luxury luxury-border bg-white group"
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
                <p className="text-sm text-secondary leading-relaxed mb-4">{r.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-espresso/40">
                    {formatDate(r.createdAt)}
                  </span>
                  <a
                    href={getFileUrl(r.fileUrl)}
                    onClick={(e) => handleDownload(e, r)}
                    className="flex items-center gap-2 text-sm font-medium text-gold hover:text-espresso transition-colors"
                    download={getDownloadName(r)}
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
        )}
      </section>
    </main>
  );
}
