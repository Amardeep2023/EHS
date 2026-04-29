import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function StoryForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const [form, setForm] = useState({
    title: '',
    name: '',
    description: '',
    tag: '',
    image: '',
    rating: 5,
  });

  const categories = ['Career', 'Relationships', 'Abundance', 'Health', 'Business', 'Purpose', 'Personal Growth'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store file for upload
      setForm((prev) => ({ ...prev, imageFile: file }));
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setForm((prev) => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!form.title || !form.name || !form.description || !form.tag) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      let data = {
        title: form.title,
        name: form.name,
        description: form.description,
        tag: form.tag,
        rating: parseInt(form.rating),
        isPublished: true,
      };

      // Use URL image if provided, otherwise use file
      if (form.image) {
        data.image = form.image;
      } else if (form.imageFile) {
        // For file upload, we'd need to handle it differently
        // For now, we'll require image URL
        setErrorMessage('Please provide an image URL or upload an image');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('admin_token');
      const response = await axios.post(`${API_URL}/stories`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSuccessMessage('✓ Story uploaded successfully!');
        setForm({
          title: '',
          name: '',
          description: '',
          tag: '',
          image: '',
          rating: 5,
        });
        setImagePreview('');

        // Redirect after success
        setTimeout(() => {
          navigate('/portal-access');
        }, 1500);
      }
    } catch (error) {
      console.error('Error uploading story:', error);
      setErrorMessage(
        error.response?.data?.message || 'Failed to upload story. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-20 min-h-screen pb-20">
      {/* Back Navigation */}
      <div className="px-6 pt-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/portal-access"
            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-espresso transition-colors"
          >
            <ArrowLeft size={14} /> Back to Admin
          </Link>
        </div>
      </div>

      {/* Form Container */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <p className="text-label text-gold mb-3">Share Your Story</p>
            <h1
              className="font-boska text-4xl md:text-5xl text-espresso mb-3"
              style={{ fontFamily: 'Boska, Georgia, serif' }}
            >
              Inspire Our Community
            </h1>
            <p className="text-secondary leading-relaxed">
              Share your transformation journey and inspire others who are just beginning theirs.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-luxury luxury-border p-8 space-y-6"
          >
            {/* Toast Messages */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200"
                >
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  <p className="text-sm text-emerald-700">{successMessage}</p>
                </motion.div>
              )}

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200"
                >
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Story Title */}
            <div>
              <label className="block text-sm font-medium text-espresso mb-3">
                Story Title <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="e.g., Manifested My Dream Career in 90 Days"
                className="w-full px-5 py-3.5 rounded-2xl border border-espresso/10 bg-cream/30 text-espresso placeholder-secondary/40 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              />
            </div>

            {/* Person's Name */}
            <div>
              <label className="block text-sm font-medium text-espresso mb-3">
                Your Name <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="e.g., Amara K."
                className="w-full px-5 py-3.5 rounded-2xl border border-espresso/10 bg-cream/30 text-espresso placeholder-secondary/40 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-espresso mb-3">
                Your Story <span className="text-gold">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Share your transformation journey in detail..."
                rows={6}
                className="w-full px-5 py-3.5 rounded-2xl border border-espresso/10 bg-cream/30 text-espresso placeholder-secondary/40 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none"
              />
            </div>

            {/* Category/Tag */}
            <div>
              <label className="block text-sm font-medium text-espresso mb-3">
                Category <span className="text-gold">*</span>
              </label>
              <select
                name="tag"
                value={form.tag}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 rounded-2xl border border-espresso/10 bg-cream/30 text-espresso focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-espresso mb-3">Image URL</label>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleImageUrlChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-5 py-3.5 rounded-2xl border border-espresso/10 bg-cream/30 text-espresso placeholder-secondary/40 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              />
              <p className="text-xs text-secondary mt-2">Use an image URL from Unsplash, Pexels, or your own hosted image</p>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl overflow-hidden border-2 border-gold/20 h-40"
              >
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </motion.div>
            )}

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-espresso mb-3">
                Rating (Stories default to 5 stars)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, rating: num }))}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      form.rating === num
                        ? 'bg-gold text-espresso'
                        : 'bg-cream/50 text-secondary hover:bg-cream'
                    }`}
                  >
                    {num}★
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gold text-espresso px-8 py-4 rounded-full font-medium hover:bg-gold/90 disabled:opacity-60 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-espresso/30 border-t-espresso rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload size={16} /> Publish Story
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/portal-access')}
                className="px-8 py-4 rounded-full font-medium bg-espresso/5 text-espresso hover:bg-espresso/10 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
