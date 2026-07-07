import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Plus, Loader, Image as ImageIcon } from 'lucide-react';

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
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const thumbnailInputRef = useRef(null);

  // Reset form on open
  useEffect(() => {
    if (isOpen && !course) {
      setTitle('');
      setDescription('');
      setShortDescription('');
      setPrice(0);
      setThumbnailFile(null);
      setThumbnailPreview('');
      setContentItems([createEmptyItem()]);
      setError('');
      setSuccess('');
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

      const payload = {
        title,
        description,
        shortDescription: shortDescription || description,
        price: Number(price),
        thumbnail: assets.thumbnailUrl || '',
        content: assets.contentItems.map((item) => ({
          title: item.title || 'Lesson Content',
          audioUrl: item.audioUrl || '',
          audioTitle: item.audioTitle || 'Audio Lesson',
          pdfUrl: item.pdfUrl || '',
          pdfTitle: item.pdfTitle || 'Lesson PDF',
        })),
      };

      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Course creation failed');

      setSuccess('Course created successfully!');
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

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-espresso mb-2">Price (USD) *</label>
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
