import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Download, Check, FileText, BookOpen, Sparkles, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Scroll to top on mount and when productId changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [productId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();

        if (data.success) {
          const found = data.products.find(
            (p) => p.slug === productId || p._id === productId
          );
          if (found) {
            setProduct(found);
          } else {
            setError('Product not found');
          }
          setAllProducts(data.products);
        } else {
          setError('Failed to load product');
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  // Resolve image URL
  const resolveImage = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=60';
    if (url.startsWith('http')) return url;
    return `${API_URL.replace('/api', '')}${url}`;
  };

  if (loading) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-espresso/20 border-t-gold rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="pt-20 min-h-screen px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-espresso transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Back to Shop
          </button>
          <div className="rounded-luxury luxury-border bg-white p-16 text-center">
            <p className="text-espresso font-boska text-3xl mb-3" style={{ fontFamily: 'Boska, Georgia, serif' }}>
              Product Not Found
            </p>
            <p className="text-secondary text-sm mb-6">This product doesn't exist or may have been removed.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-espresso text-cream px-6 py-3 rounded-full text-sm font-medium hover:bg-gold hover:text-espresso transition-all duration-300"
            >
              <ArrowLeft size={14} /> Back to Shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const features = product.features || [];

  return (
    <main className="pt-20 min-h-screen overflow-hidden">
      {/* Back button */}
      <div className="px-6 pt-8 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-espresso transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </button>
      </div>

      {/* Hero Section */}
      <section className="px-6 py-8 pb-0">
        <div className="max-w-7xl mx-auto relative">
          {/* Glass blur — hugs the hero content */}
          <div className="absolute -inset-6 bg-cream/65 backdrop-blur-[6px] rounded-luxury -z-10" />
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-luxury overflow-hidden luxury-border bg-white">
                <img
                  src={resolveImage(product.coverImage)}
                  alt={product.title}
                  className="w-full aspect-[4/3] object-cover img-sepia"
                />
              </div>
              {/* Category badge */}
              <span
                className="absolute top-4 left-4 text-xs font-medium px-4 py-1.5 rounded-full backdrop-blur-sm"
                style={{ background: 'rgba(250,248,243,0.85)', color: '#d4a574' }}
              >
                {product.category}
              </span>
              {product.salesCount > 0 && (
                <span
                  className="absolute bottom-4 left-4 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm"
                  style={{ background: 'rgba(250,248,243,0.85)', color: '#d4a574' }}
                >
                  {product.salesCount} sold
                </span>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col justify-center"
            >
              <p className="text-label text-gold mb-3">{product.category}</p>
              <h1
                className="font-boska text-4xl md:text-5xl text-espresso mb-4 leading-tight"
                style={{ fontFamily: 'Boska, Georgia, serif', letterSpacing: '-0.02em' }}
              >
                {product.title}
              </h1>
              <p className="text-secondary leading-relaxed mb-6 text-base">
                {product.fullDescription || product.description}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4 mb-8">
                {product.pages > 0 && (
                  <div className="flex items-center gap-2 text-sm text-secondary bg-cream/70 px-4 py-2 rounded-full luxury-border">
                    <FileText size={14} className="text-gold" />
                    {product.pages} pages
                  </div>
                )}
                {product.format && (
                  <div className="flex items-center gap-2 text-sm text-secondary bg-cream/70 px-4 py-2 rounded-full luxury-border">
                    <BookOpen size={14} className="text-gold" />
                    {product.format}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-secondary bg-cream/70 px-4 py-2 rounded-full luxury-border">
                  <Sparkles size={14} className="text-gold" />
                  Instant Download
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center gap-5">
                <span
                  className="font-boska text-4xl text-espresso"
                  style={{ fontFamily: 'Boska, Georgia, serif' }}
                >
                  ${product.price}
                </span>
                <button className="inline-flex items-center gap-2 bg-espresso text-cream px-8 py-3.5 rounded-full text-sm font-medium hover:bg-gold hover:text-espresso transition-all duration-300">
                  <ShoppingBag size={16} /> Purchase — ${product.price}
                </button>
              </div>
              <p className="text-xs text-secondary mt-3">Secure checkout. Instant access after purchase.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto relative">
          {/* Glass blur — hugs the features content */}
          <div className="absolute -inset-6 bg-cream/65 backdrop-blur-[6px] rounded-luxury -z-10" />
          <div className="grid lg:grid-cols-2 gap-10">
            {/* What's Included */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-luxury luxury-border bg-white p-8 md:p-10"
            >
              <h2
                className="font-boska text-2xl text-espresso mb-6"
                style={{ fontFamily: 'Boska, Georgia, serif' }}
              >
                What's Included
              </h2>
              {features.length > 0 ? (
                <ul className="space-y-4">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-espresso">
                      <span className="mt-0.5 w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <Check size={13} className="text-gold" />
                      </span>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-secondary">No features listed yet.</p>
              )}
            </motion.div>

            {/* Why This Product */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-luxury luxury-border bg-white p-8 md:p-10"
            >
              <h2
                className="font-boska text-2xl text-espresso mb-6"
                style={{ fontFamily: 'Boska, Georgia, serif' }}
              >
                Why You'll Love It
              </h2>
              <p className="text-sm text-secondary leading-relaxed mb-6">
                Every product in our shop is thoughtfully designed to support your spiritual and personal growth journey. Created with intention and care, each resource blends practical tools with soulful wisdom to help you transform your inner world and outer life.
              </p>
              <div className="rounded-2xl bg-cream/70 p-6">
                <p className="text-sm text-espresso font-medium mb-2">100% Satisfaction Guarantee</p>
                <p className="text-xs text-secondary leading-relaxed">
                  We stand behind the quality of our products. If you're not completely satisfied, contact us within 14 days for a full refund.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {allProducts.length > 1 && (
        <section className="px-6 pb-28">
          <div className="max-w-7xl mx-auto relative">
            {/* Glass blur — hugs the related products */}
            <div className="absolute -inset-6 bg-cream/65 backdrop-blur-[6px] rounded-luxury -z-10" />
            <h2
              className="font-boska text-3xl text-espresso mb-8"
              style={{ fontFamily: 'Boska, Georgia, serif' }}
            >
              You May Also Like
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {allProducts
                .filter((p) => p._id !== product._id)
                .slice(0, 3)
                .map((related, i) => (
                  <motion.div
                    key={related._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(42,34,25,0.06)' }}
                    className="rounded-luxury luxury-border bg-white overflow-hidden group cursor-pointer"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      navigate(`/shop/${related.slug || related._id}`);
                    }}
                  >
                    <div className="overflow-hidden h-36">
                      <img
                        src={resolveImage(related.coverImage)}
                        alt={related.title}
                        className="w-full h-full object-cover img-sepia group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3
                        className="font-boska text-lg text-espresso mb-1"
                        style={{ fontFamily: 'Boska, Georgia, serif' }}
                      >
                        {related.title}
                      </h3>
                      <span
                        className="font-boska text-xl text-gold"
                        style={{ fontFamily: 'Boska, Georgia, serif' }}
                      >
                        ${related.price}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
