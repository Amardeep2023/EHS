import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Plus, Loader, Image as ImageIcon, Globe, ChevronDown, ChevronUp } from 'lucide-react';

// ── Pre-populated country list for location-based pricing ────────
const COMMON_COUNTRIES = [
  { code: 'US', name: 'United States (USD)' },
  { code: 'IN', name: 'India (INR)' },
  { code: 'CA', name: 'Canada (CAD)' },
  { code: 'GB', name: 'United Kingdom (GBP)' },
  { code: 'AU', name: 'Australia (AUD)' },
  { code: 'EU', name: 'Europe (EUR)' },
];

const ALL_COUNTRIES = [
  ...COMMON_COUNTRIES,
  { code: 'AE', name: 'United Arab Emirates (AED)' },
  { code: 'AR', name: 'Argentina (ARS)' },
  { code: 'AT', name: 'Austria (EUR)' },
  { code: 'BE', name: 'Belgium (EUR)' },
  { code: 'BG', name: 'Bulgaria (BGN)' },
  { code: 'BR', name: 'Brazil (BRL)' },
  { code: 'CH', name: 'Switzerland (CHF)' },
  { code: 'CL', name: 'Chile (CLP)' },
  { code: 'CN', name: 'China (CNY)' },
  { code: 'CO', name: 'Colombia (COP)' },
  { code: 'CZ', name: 'Czech Republic (CZK)' },
  { code: 'DE', name: 'Germany (EUR)' },
  { code: 'DK', name: 'Denmark (DKK)' },
  { code: 'EG', name: 'Egypt (EGP)' },
  { code: 'ES', name: 'Spain (EUR)' },
  { code: 'FI', name: 'Finland (EUR)' },
  { code: 'FR', name: 'France (EUR)' },
  { code: 'GR', name: 'Greece (EUR)' },
  { code: 'HK', name: 'Hong Kong (HKD)' },
  { code: 'HU', name: 'Hungary (HUF)' },
  { code: 'ID', name: 'Indonesia (IDR)' },
  { code: 'IE', name: 'Ireland (EUR)' },
  { code: 'IL', name: 'Israel (ILS)' },
  { code: 'IS', name: 'Iceland (ISK)' },
  { code: 'IT', name: 'Italy (EUR)' },
  { code: 'JP', name: 'Japan (JPY)' },
  { code: 'KR', name: 'South Korea (KRW)' },
  { code: 'LU', name: 'Luxembourg (EUR)' },
  { code: 'MX', name: 'Mexico (MXN)' },
  { code: 'MY', name: 'Malaysia (MYR)' },
  { code: 'NG', name: 'Nigeria (NGN)' },
  { code: 'NL', name: 'Netherlands (EUR)' },
  { code: 'NO', name: 'Norway (NOK)' },
  { code: 'NZ', name: 'New Zealand (NZD)' },
  { code: 'PH', name: 'Philippines (PHP)' },
  { code: 'PL', name: 'Poland (PLN)' },
  { code: 'PT', name: 'Portugal (EUR)' },
  { code: 'QA', name: 'Qatar (QAR)' },
  { code: 'RO', name: 'Romania (RON)' },
  { code: 'RU', name: 'Russia (RUB)' },
  { code: 'SA', name: 'Saudi Arabia (SAR)' },
  { code: 'SE', name: 'Sweden (SEK)' },
  { code: 'SG', name: 'Singapore (SGD)' },
  { code: 'TH', name: 'Thailand (THB)' },
  { code: 'TR', name: 'Turkey (TRY)' },
  { code: 'TW', name: 'Taiwan (TWD)' },
  { code: 'VN', name: 'Vietnam (VND)' },
  { code: 'ZA', name: 'South Africa (ZAR)' },
];

function createCountryPriceEntry(code = '', price = '') {
  return { id: Date.now() + Math.random(), code, price };
}

const API_URL = import.meta.env.VITE_API_URL || '/api';
const getToken = () => localStorage.getItem('admin_token');

const createEmptyItem = () => ({
  id: Date.now() + Math.random(),
  title: '',
  audioTitle: '',
  pdfTitle: '',
  audioFile: null,
  pdfFile: null,
});

export default function CourseForm({ isOpen, onClose, course = null, onSuccess }) {
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [shortDescription, setShortDescription] = useState(course?.shortDescription || '');
  const [price, setPrice] = useState(course?.price || 0);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(course?.thumbnail || '');
  const [contentItems, setContentItems] = useState([createEmptyItem()]);
  const [countryPrices, setCountryPrices] = useState(
    course?.countryPrices
      ? Object.entries(course.countryPrices).map(([code, price]) =>
          createCountryPriceEntry(code, price)
        )
      : []
  );
  const [locationPricingOpen, setLocationPricingOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const thumbnailInputRef = useRef(null);

  // ── Country price handlers ──────────────────────────────────────
  const addCountryPrice = () => {
    setCountryPrices((prev) => [...prev, createCountryPriceEntry()]);
  };

  const removeCountryPrice = (id) => {
    setCountryPrices((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCountryPrice = (id, field, value) => {
    setCountryPrices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Reset / initialize form on open
  useEffect(() => {
    if (isOpen) {
      if (course) {
        // ── Edit mode — pre-populate all fields from the course ──
        setTitle(course.title || '');
        setDescription(course.description || '');
        setShortDescription(course.shortDescription || '');
        setPrice(course.price || 0);
        setCountryPrices(
          course.countryPrices
            ? Object.entries(course.countryPrices).map(([code, price]) =>
                createCountryPriceEntry(code, price)
              )
            : []
        );
        setLocationPricingOpen(false);
        setThumbnailFile(null);
        setThumbnailPreview(course.thumbnail || '');
        setContentItems(
          (course.content || []).length > 0
            ? (course.content || []).map((item) => ({
                id: Date.now() + Math.random(),
                title: item.title || '',
                audioTitle: item.audioTitle || '',
                pdfTitle: item.pdfTitle || '',
                audioFile: null,
                pdfFile: null,
                audioUrl: item.audioUrl || '',
                pdfUrl: item.pdfUrl || '',
              }))
            : [createEmptyItem()]
        );
        setError('');
        setSuccess('');
      } else {
        // ── Create mode — reset everything ──
        setTitle('');
        setDescription('');
        setShortDescription('');
        setPrice(0);
        setCountryPrices([]);
        setLocationPricingOpen(false);
        setThumbnailFile(null);
        setThumbnailPreview('');
        setContentItems([createEmptyItem()]);
        setError('');
        setSuccess('');
      }
    }
  }, [isOpen, course]);

  const updateItem = (id, field, value) => {
    setContentItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setContentItems((prev) => [...prev, createEmptyItem()]);
  };

  const removeItem = (id) => {
    setContentItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setThumbnailPreview(ev.target?.result || '');
    reader.readAsDataURL(file);
  };

  const uploadCourseAssets = async () => {
    const formData = new FormData();
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

    const audioFileOrder = [];
    const pdfFileOrder = [];

    contentItems.forEach((item, index) => {
      if (item.audioFile) {
        formData.append('audio', item.audioFile);
        audioFileOrder.push(index);
      }
      if (item.pdfFile) {
        formData.append('pdf', item.pdfFile);
        pdfFileOrder.push(index);
      }
    });

    if (!formData.has('thumbnail') && !formData.has('audio') && !formData.has('pdf')) {
      return { thumbnailUrl: course?.thumbnail || '', contentItems: [...contentItems] };
    }

    const token = getToken();
    const response = await fetch(`${API_URL}/courses/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');

    const updatedItems = contentItems.map((item, index) => {
      const audioPos = audioFileOrder.indexOf(index);
      const pdfPos = pdfFileOrder.indexOf(index);
      return {
        ...item,
        audioUrl: audioPos !== -1 ? (data.audioUrls?.[audioPos] || '') : '',
        pdfUrl: pdfPos !== -1 ? (data.pdfUrls?.[pdfPos] || '') : '',
      };
    });

    return {
      thumbnailUrl: data.thumbnailUrl || course?.thumbnail || '',
      contentItems: updatedItems,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Course title is required');
      setSaving(false);
      return;
    }
    if (!description.trim()) {
      setError('Course description is required');
      setSaving(false);
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('Price must be greater than zero');
      setSaving(false);
      return;
    }

    try {
      const token = getToken();
      setUploading(true);
      const assets = await uploadCourseAssets();
      setUploading(false);

      // Convert countryPrices array to object for the API
      const countryPricesObj = {};
      countryPrices.forEach((item) => {
        if (item.code && item.price !== '' && Number(item.price) > 0) {
          countryPricesObj[item.code] = Number(item.price);
        }
      });

const payload = {
        title,
        description,
        shortDescription: shortDescription || description,
        price: Number(price),
        countryPrices: Object.keys(countryPricesObj).length > 0 ? countryPricesObj : undefined,
        thumbnail: assets.thumbnailUrl || '',
        content: assets.contentItems.map((item) => ({
          title: item.title || 'Lesson Content',
          audioUrl: item.audioUrl || '',
          audioTitle: item.audioTitle || 'Audio Lesson',
          pdfUrl: item.pdfUrl || '',
          pdfTitle: item.pdfTitle || 'Lesson PDF',
        })),
      };

      const isEditing = !!(course && course._id);
      const url = isEditing ? `${API_URL}/courses/${course._id}` : `${API_URL}/courses`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || (isEditing ? 'Course update failed' : 'Course creation failed'));

      setSuccess(isEditing ? 'Course updated successfully!' : 'Course created successfully!');
      onSuccess?.(data.course || data);
      setTimeout(() => onClose?.(), 1200);
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
                  {course ? 'Edit Course' : 'Add New Course'}
                </h2>
              </div>
              <button
                onClick={onClose}
                disabled={saving}
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
              {success && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">Course Thumbnail</label>
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="relative cursor-pointer rounded-2xl border-2 border-dashed border-espresso/20 hover:border-gold/50 transition-colors overflow-hidden aspect-video flex items-center justify-center bg-white/50"
                  >
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-secondary">
                        <ImageIcon size={32} className="text-gold/50" />
                        <span className="text-sm">Click to upload thumbnail</span>
                        <span className="text-xs text-secondary/60">JPG, PNG, or WebP</span>
                      </div>
                    )}
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailSelect}
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">Course Title *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. 21-Day Manifestation Course"
                    className="w-full rounded-2xl border border-espresso/15 bg-white px-5 py-3.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">Short Description</label>
                  <input
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Short summary shown on cards"
                    className="w-full rounded-2xl border border-espresso/15 bg-white px-5 py-3.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    placeholder="Describe what learners will experience"
                    className="w-full rounded-2xl border border-espresso/15 bg-white px-5 py-3.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  />
                </div>

                {/* Default Price */}
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">Default Price (USD) *</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="47"
                    className="w-full rounded-2xl border border-espresso/15 bg-white px-5 py-3.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                  <p className="text-xs text-secondary mt-1.5">
                    Fallback price shown to all countries unless overridden below.
                  </p>
                </div>

                {/* Location-Based Pricing */}
                <div className="rounded-2xl border border-espresso/10 bg-white/40">
                  <button
                    type="button"
                    onClick={() => setLocationPricingOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-espresso hover:bg-white/50 transition-colors rounded-2xl"
                  >
                    <span className="flex items-center gap-2">
                      <Globe size={16} className="text-gold" />
                      Location-Based Pricing
                    </span>
                    {locationPricingOpen ? (
                      <ChevronUp size={16} className="text-secondary" />
                    ) : (
                      <ChevronDown size={16} className="text-secondary" />
                    )}
                  </button>

                  <AnimatePresence>
                    {locationPricingOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-3">
                          <p className="text-xs text-secondary">
                            Set country-specific prices. If a country isn't listed, the default price will be used.
                          </p>

                          {countryPrices.length === 0 && (
                            <div className="py-6 text-center text-xs text-secondary bg-cream/50 rounded-xl">
                              No location prices set. Click "Add Location" to add one.
                            </div>
                          )}

                          {countryPrices.map((entry) => (
                            <div
                              key={entry.id}
                              className="flex items-center gap-3"
                            >
                              {/* Country dropdown */}
                              <select
                                value={entry.code}
                                onChange={(e) => updateCountryPrice(entry.id, 'code', e.target.value)}
                                className="flex-1 rounded-xl border border-espresso/15 bg-white px-3 py-2.5 text-sm text-espresso focus:outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
                              >
                                <option value="" disabled>Select country</option>
                                {ALL_COUNTRIES.filter(
                                  (c) => c.code === entry.code || !countryPrices.some((cp) => cp.code === c.code && cp.id !== entry.id)
                                ).map((c) => (
                                  <option key={c.code} value={c.code}>
                                    {c.name}
                                  </option>
                                ))}
                              </select>

                              {/* Price input */}
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={entry.price}
                                onChange={(e) => updateCountryPrice(entry.id, 'price', e.target.value)}
                                placeholder="Price"
                                className="w-28 rounded-xl border border-espresso/15 bg-white px-3 py-2.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                              />

                              {/* Remove button */}
                              <button
                                type="button"
                                onClick={() => removeCountryPrice(entry.id)}
                                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                                title="Remove location"
                              >
                                <X size={15} />
                              </button>
                            </div>
                          ))}

                          {/* Add button */}
                          <button
                            type="button"
                            onClick={addCountryPrice}
                            className="flex items-center gap-2 text-xs text-gold font-medium hover:text-espresso transition-colors pt-1"
                          >
                            <Plus size={14} /> Add Location
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Lesson Content */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-espresso">Lesson Content</label>
                    <button
                      type="button"
                      onClick={addItem}
                      className="flex items-center gap-1 text-xs text-gold font-medium hover:text-espresso transition-colors"
                    >
                      <Plus size={14} /> Add Lesson
                    </button>
                  </div>

                  <div className="space-y-4">
                    {contentItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-espresso/10 bg-white/60 p-5 relative"
                      >
                        {contentItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm z-10"
                          >
                            <X size={14} />
                          </button>
                        )}
                        <div className="text-xs text-gold font-medium mb-3">Lesson {index + 1}</div>

                        <input
                          value={item.title}
                          onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                          className="mb-3 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                          placeholder="Lesson title"
                        />

                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <input
                              value={item.audioTitle}
                              onChange={(e) => updateItem(item.id, 'audioTitle', e.target.value)}
                              className="w-full rounded-xl border border-espresso/15 bg-white px-4 py-2.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                              placeholder="Audio title"
                            />
                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-espresso/15 p-3 text-sm text-secondary hover:border-gold/30 transition-colors">
                              <Upload size={14} />
                              <span className="truncate">{item.audioFile ? item.audioFile.name : 'Upload audio'}</span>
                              <input type="file" accept="audio/*" className="hidden" onChange={(e) => updateItem(item.id, 'audioFile', e.target.files?.[0] || null)} />
                            </label>
                          </div>

                          <div className="space-y-2">
                            <input
                              value={item.pdfTitle}
                              onChange={(e) => updateItem(item.id, 'pdfTitle', e.target.value)}
                              className="w-full rounded-xl border border-espresso/15 bg-white px-4 py-2.5 text-sm text-espresso placeholder-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                              placeholder="PDF title"
                            />
                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-espresso/15 p-3 text-sm text-secondary hover:border-gold/30 transition-colors">
                              <Upload size={14} />
                              <span className="truncate">{item.pdfFile ? item.pdfFile.name : 'Upload PDF'}</span>
                              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => updateItem(item.id, 'pdfFile', e.target.files?.[0] || null)} />
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      <><Loader size={16} className="animate-spin" /> Uploading files...</>
                    ) : saving ? (
                      <><Loader size={16} className="animate-spin" /> Saving...</>
                    ) : (
                      <><Upload size={16} /> {course ? 'Update Course' : 'Create Course'}</>
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
