import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const initialState = {
  title: '',
  description: '',
  shortDescription: '',
  price: '',
  coverImage: '',
  label: '',
  isPublished: false,
};

export default function CourseForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Validation
    if (!form.title || !form.description || !form.price) {
      setError('Title, Description, and Price are required.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.post(
        `${API_URL}/courses`,
        {
          ...form,
          price: Number(form.price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Course created successfully!');
      setForm(initialState);
      if (onSuccess) onSuccess(res.data.course);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-label text-gold mb-1">Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full bg-white/5 border rounded-2xl px-5 py-3 text-sm text-espresso placeholder-espresso/30 focus:outline-none focus:border-gold transition-colors"
          placeholder="Course Title"
        />
      </div>
      <div>
        <label className="block text-label text-gold mb-1">Short Description</label>
        <input
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          className="w-full bg-white/5 border rounded-2xl px-5 py-3 text-sm text-espresso placeholder-espresso/30 focus:outline-none focus:border-gold transition-colors"
          placeholder="Short Description"
        />
      </div>
      <div>
        <label className="block text-label text-gold mb-1">Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full bg-white/5 border rounded-2xl px-5 py-3 text-sm text-espresso placeholder-espresso/30 focus:outline-none focus:border-gold transition-colors"
          placeholder="Full Description"
        />
      </div>
      <div>
        <label className="block text-label text-gold mb-1">Price (USD) *</label>
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
          min="0"
          className="w-full bg-white/5 border rounded-2xl px-5 py-3 text-sm text-espresso placeholder-espresso/30 focus:outline-none focus:border-gold transition-colors"
          placeholder="Price"
        />
      </div>
      <div>
        <label className="block text-label text-gold mb-1">Cover Image URL</label>
        <input
          name="coverImage"
          value={form.coverImage}
          onChange={handleChange}
          className="w-full bg-white/5 border rounded-2xl px-5 py-3 text-sm text-espresso placeholder-espresso/30 focus:outline-none focus:border-gold transition-colors"
          placeholder="Image URL"
        />
      </div>
      <div>
        <label className="block text-label text-gold mb-1">Label</label>
        <input
          name="label"
          value={form.label}
          onChange={handleChange}
          className="w-full bg-white/5 border rounded-2xl px-5 py-3 text-sm text-espresso placeholder-espresso/30 focus:outline-none focus:border-gold transition-colors"
          placeholder="e.g. Foundation, Advanced"
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          name="isPublished"
          type="checkbox"
          checked={form.isPublished}
          onChange={handleChange}
          id="isPublished"
        />
        <label htmlFor="isPublished" className="text-label text-gold">Published</label>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-emerald-600 text-sm">{success}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-gold text-espresso px-8 py-3 rounded-full font-medium hover:bg-cream transition-all duration-300 disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create Course'}
        </button>
        {typeof onCancel === 'function' && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-cream text-espresso px-8 py-3 rounded-full font-medium hover:bg-gold transition-all duration-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
