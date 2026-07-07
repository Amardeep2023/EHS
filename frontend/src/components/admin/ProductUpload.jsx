import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'admin_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

const categories = ['Journals', 'Workbooks', 'Guides', 'Planners', 'Cards'];

export default function ProductUpload({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [pages, setPages] = useState('');
  const [format, setFormat] = useState('Digital PDF');
  const [features, setFeatures] = useState(['', '', '']);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setFullDescription('');
      setPrice('');
      setCategory(categories[0]);
      setCoverImageFile(null);
      setImagePreview('');
      setFileUrl('');
      setPages('');
      setFormat('Digital PDF');
      setFeatures(['', '', '']);
      setError('');
    }
  }, [isOpen]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result || '');
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!coverImageFile) return '';
    const formData = new FormData();
    formData.append('coverImage', coverImageFile);

    const token = getToken();
    const res = await fetch(`${API_URL}/products/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Image upload failed');
    return data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) { setError('Product title is required'); return; }
    if (!description.trim()) { setError('Description is required'); return; }
    if (!price || Number(price) <= 0) { setError('Price must be greater than zero'); return; }

    setSaving(true);

    try {
      const token = getToken();
      let coverImage = '';
      if (coverImageFile) {
        setUploading(true);
        coverImage = await uploadImage();
        setUploading(false);
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        fullDescription: fullDescription.trim() || description.trim(),
        price: Number(price),
        category,
        coverImage,
        pages: Number(pages) || 0,
        format: format || 'Digital PDF',
        features: features.filter((f) => f.trim()),
        fileUrl: fileUrl || `/uploads/products/${title.trim().toLowerCase().replace(/\s+/g, '-')}.pdf`,
        isPublished: true,
      };

      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create product');

      onSuccess?.(data.product);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-3/4 md:w-1/2 lg:w-1/2 bg-cream shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-cream/90 backdrop-blur-xl z-10 flex items-center justify-between px-6 py-5 border-b border-espresso/10">
              <div>
                <p className="text-label text-gold text-xs">Admin</p>
                <h2 className="font-boska text-2xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                  Add New Product
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-espresso/5 transition-colors"
              >
                <X size={20} className="text-espresso" />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-8">
              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">Product Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative cursor-pointer rounded-2xl border-2 border-dashed border-espresso/20 hover:border-gold/50 transition-colors overflow-hidden aspect-video flex items-center justify-center bg-white/50"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-secondary">
                        <ImageIcon size={32} className="text-gold/50" />
                        <span className="text-sm">Click to upload product image</span>
                        <span className="text-xs text-secondary/60">JPG, PNG, or WebP</span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">Product Title *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Manifestation Journal"
                    className="w-full rounded-2xl border border-espresso/15 bg-white px-5 py-3.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">Short Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={2}
                    placeholder="Brief product summary shown on cards..."
                    className="w-full rounded-2xl border border-espresso/15 bg-white px-5 py-3.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">Full Description</label>
                  <textarea
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    rows={4}
                    placeholder="Detailed product description shown on the product page..."
                    className="w-full rounded-2xl border border-espresso/15 bg-white px-5 py-3.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  />
                  <p className="text-xs text-secondary/60 mt-1.5">Leave blank to use the short description.</p>
                </div>

                {/* Price & Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-2">Price (USD) *</label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      placeholder="27"
                      className="w-full rounded-2xl border border-espresso/15 bg-white px-5 py-3.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-2">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-2xl border border-espresso/15 bg-white px-5 py-3.5 text-sm text-espresso focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pages & Format Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-2">Pages</label>
                    <input
                      type="number"
                      min="0"
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      placeholder="e.g. 85"
                      className="w-full rounded-2xl border border-espresso/15 bg-white px-5 py-3.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-2">Format</label>
                    <input
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      placeholder="Digital PDF"
                      className="w-full rounded-2xl border border-espresso/15 bg-white px-5 py-3.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">
                    Features <span className="text-secondary/50 font-normal">(one per line)</span>
                  </label>
                  <div className="space-y-2">
                    {features.map((feature, i) => (
                      <input
                        key={i}
                        value={feature}
                        onChange={(e) => {
                          const next = [...features];
                          next[i] = e.target.value;
                          setFeatures(next);
                        }}
                        placeholder={["e.g. 90 days of guided prompts", "e.g. Weekly reflection pages", "e.g. Printable PDF format"][i] || `Feature ${i + 1}`}
                        className="w-full rounded-2xl border border-espresso/15 bg-white px-5 py-3.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => setFeatures([...features, ''])}
                      className="text-xs text-gold font-medium hover:text-espresso transition-colors"
                    >
                      + Add another feature
                    </button>
                  </div>
                </div>

                {/* File URL (optional) */}
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">
                    Product File URL <span className="text-secondary/50 font-normal">(optional)</span>
                  </label>
                  <input
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="/uploads/products/product-file.pdf"
                    className="w-full rounded-2xl border border-espresso/15 bg-white px-5 py-3.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                  <p className="text-xs text-secondary/60 mt-1.5">
                    Link to the downloadable file (PDF, etc.). Leave blank to auto-generate.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-espresso/10">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={saving}
                    className="px-6 py-3 rounded-full text-sm text-secondary hover:text-espresso transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="inline-flex items-center gap-2 bg-espresso text-cream px-8 py-3 rounded-full text-sm font-medium hover:bg-gold hover:text-espresso transition-all duration-300 disabled:opacity-60"
                  >
                    {uploading ? (
                      <><Loader size={16} className="animate-spin" /> Uploading image...</>
                    ) : saving ? (
                      <><Loader size={16} className="animate-spin" /> Saving...</>
                    ) : (
                      <><Upload size={16} /> Upload Product</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
