import { useState } from 'react';
import { Upload, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const getToken = () => localStorage.getItem('admin_token');

export default function CourseForm({ course = null, onClose, onCancel, onSuccess }) {
  const handleClose = onClose || onCancel;
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [shortDescription, setShortDescription] = useState(course?.shortDescription || '');
  const [price, setPrice] = useState(course?.price || 0);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [contentTitle, setContentTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const uploadCourseAssets = async () => {
    const formData = new FormData();
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
    if (audioFile) formData.append('audio', audioFile);
    if (pdfFile) formData.append('pdf', pdfFile);

    if (!formData.has('thumbnail') && !formData.has('audio') && !formData.has('pdf')) {
      return { thumbnailUrl: course?.thumbnail || '', audioUrl: '', pdfUrl: '' };
    }

    const token = getToken();
    const response = await fetch(`${API_URL}/courses/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');
    return {
      thumbnailUrl: data.thumbnailUrl || course?.thumbnail || '',
      audioUrl: data.audioUrl || '',
      pdfUrl: data.pdfUrl || '',
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Course title is required');
      setLoading(false);
      return;
    }
    if (!description.trim()) {
      setError('Course description is required');
      setLoading(false);
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('Price must be greater than zero');
      setLoading(false);
      return;
    }

    try {
      const token = getToken();
      const assets = await uploadCourseAssets();
      const payload = {
        title,
        description,
        shortDescription: shortDescription || description,
        price: Number(price),
        thumbnail: assets.thumbnailUrl || '',
        content: [
          {
            title: contentTitle || title,
            audioUrl: assets.audioUrl || '',
            pdfUrl: assets.pdfUrl || '',
            audioTitle: 'Audio Lesson',
            pdfTitle: 'Lesson PDF',
          },
        ],
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
      setTimeout(() => handleClose?.(), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-2xl" disabled={loading}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {success && <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Course Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="e.g. 21-Day Manifestation Course" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Short Description</label>
              <input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="Short summary shown on cards" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Description *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="Describe what learners will experience" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Price (USD) *</label>
              <input type="number" min="1" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-3" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Thumbnail Image</label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-600">
                <Upload size={16} />
                <span>{thumbnailFile ? thumbnailFile.name : 'Choose image file (jpg/png/webp)'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Lesson Content</label>
              <input value={contentTitle} onChange={(e) => setContentTitle(e.target.value)} className="mb-3 w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="Title for lesson content" />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-600">
                  <Upload size={16} />
                  <span>{audioFile ? audioFile.name : 'Upload audio file'}</span>
                  <input type="file" accept="audio/*" className="hidden" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-600">
                  <Upload size={16} />
                  <span>{pdfFile ? pdfFile.name : 'Upload PDF file'}</span>
                  <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button type="button" onClick={handleClose} disabled={loading} className="rounded-xl border border-gray-300 px-5 py-3 text-sm">Cancel</button>
              <button type="submit" disabled={loading || uploading} className="rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-white">
                {loading ? 'Saving...' : 'Save Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
