import { useState } from 'react';
import { Upload, Trash2, Plus, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('admin_token');

export default function CourseForm({ course = null, onClose, onCancel, onSuccess }) {
  // Support both onClose and onCancel for backward compatibility
  const handleClose = onClose || onCancel;
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [price, setPrice] = useState(course?.price || 0);
  const [currency, setCurrency] = useState(course?.currency || 'USD');
  const [coverImage, setCoverImage] = useState(course?.coverImage || '');
  const [days, setDays] = useState(course?.days || Array.from({ length: 21 }, (_, i) => ({
    dayNumber: i + 1,
    title: `Day ${i + 1}`,
    description: '',
    videoUrl: '',
    pdfUrl: '',
    morningAudioUrl: '',
    eveningAudioUrl: '',
    storyAudios: [],
  })));
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDayChange = (index, field, value) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
  };

  const handleStoryAudioAdd = (dayIndex, audioUrl, audioTitle = '') => {
    if (!audioUrl.trim()) return;
    const newDays = [...days];
    newDays[dayIndex].storyAudios = [
      ...newDays[dayIndex].storyAudios,
      { url: audioUrl, title: audioTitle || `Story Audio ${newDays[dayIndex].storyAudios.length + 1}` }
    ];
    setDays(newDays);
  };

  const handleStoryAudioRemove = (dayIndex, audioIndex) => {
    const newDays = [...days];
    newDays[dayIndex].storyAudios.splice(audioIndex, 1);
    setDays([...newDays]);
  };

  const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      return data.url;
    } catch (err) {
      console.error('Upload error:', err);
      throw err;
    }
  };

  const handleFileUpload = async (e, dayIndex, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, field.includes('video') ? 'video' : 'audio');
      handleDayChange(dayIndex, field, url);
      setSuccess(`${field} uploaded successfully!`);
    } catch (err) {
      setError(`Failed to upload ${field}: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
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
    if (price < 0) {
      setError('Price must be a positive number');
      setLoading(false);
      return;
    }

    try {
      const token = getToken();
      const payload = {
        title,
        description,
        price: Number(price),
        currency,
        coverImage,
        days,
      };

      const url = course ? `${API_URL}/courses/${course._id}` : `${API_URL}/courses`;
      const method = course ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Operation failed');

      setSuccess(course ? 'Course updated successfully!' : 'Course created successfully!');
      onSuccess?.(data);
      
      // Close after 2 seconds
      setTimeout(() => {
        handleClose?.();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {course ? 'Edit Course' : 'Create New 21‑Day Manifestation Course'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="e.g., 21-Day Manifestation Mastery"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Describe the course content, benefits, and what users will learn..."
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>

            {/* 21‑Day Content */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">21‑Day Content</h3>
                <div className="text-sm text-gray-500">
                  {days.filter(d => d.videoUrl || d.pdfUrl || d.morningAudioUrl || d.eveningAudioUrl).length} / 21 days configured
                </div>
              </div>
              <div className="space-y-8">
                {days.map((day, dayIndex) => (
                  <div key={dayIndex} className="border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Day {day.dayNumber}: {day.title}
                      </h4>
                      <span className="text-sm text-gray-500">Day {day.dayNumber}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Day Title
                        </label>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => handleDayChange(dayIndex, 'title', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent"
                          placeholder={`e.g., Setting Intentions`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Day Description
                        </label>
                        <textarea
                          value={day.description}
                          onChange={(e) => handleDayChange(dayIndex, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent"
                          placeholder={`Brief description for Day ${day.dayNumber}`}
                        />
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Video Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Video URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={day.videoUrl}
                            onChange={(e) => handleDayChange(dayIndex, 'videoUrl', e.target.value)}
                            placeholder="https://..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent"
                          />
                          <label className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer flex items-center justify-center">
                            <Upload size={18} />
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, dayIndex, 'videoUrl')}
                              disabled={uploading}
                            />
                          </label>
                        </div>
                      </div>

                      {/* PDF Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PDF URL
                        </label>
                        <input
                          type="text"
                          value={day.pdfUrl}
                          onChange={(e) => handleDayChange(dayIndex, 'pdfUrl', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent"
                        />
                      </div>

                      {/* Morning Meditation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Morning Meditation Audio
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={day.morningAudioUrl}
                            onChange={(e) => handleDayChange(dayIndex, 'morningAudioUrl', e.target.value)}
                            placeholder="https://..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent"
                          />
                          <label className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer flex items-center justify-center">
                            <Upload size={18} />
                            <input
                              type="file"
                              accept="audio/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, dayIndex, 'morningAudioUrl')}
                              disabled={uploading}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Evening Meditation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Evening Meditation Audio
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={day.eveningAudioUrl}
                            onChange={(e) => handleDayChange(dayIndex, 'eveningAudioUrl', e.target.value)}
                            placeholder="https://..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent"
                          />
                          <label className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer flex items-center justify-center">
                            <Upload size={18} />
                            <input
                              type="file"
                              accept="audio/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, dayIndex, 'eveningAudioUrl')}
                              disabled={uploading}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Story Audios */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Story Audios (Optional)
                      </label>
                      <div className="space-y-3">
                        {day.storyAudios.map((audio, audioIndex) => (
                          <div key={audioIndex} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={audio.url}
                              onChange={(e) => {
                                const newDays = [...days];
                                newDays[dayIndex].storyAudios[audioIndex].url = e.target.value;
                                setDays(newDays);
                              }}
                              placeholder="Audio URL"
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
                            />
                            <input
                              type="text"
                              value={audio.title}
                              onChange={(e) => {
                                const newDays = [...days];
                                newDays[dayIndex].storyAudios[audioIndex].title = e.target.value;
                                setDays(newDays);
                              }}
                              placeholder="Title"
                              className="w-40 px-4 py-3 border border-gray-300 rounded-xl"
                            />
                            <button
                              type="button"
                              onClick={() => handleStoryAudioRemove(dayIndex, audioIndex)}
                              className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl flex items-center justify-center"
                              disabled={loading}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-3">
                          <input
                            type="text"
                            id={`storyAudioUrl-${dayIndex}`}
                            placeholder="New story audio URL"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
                          />
                          <input
                            type="text"
                            id={`storyAudioTitle-${dayIndex}`}
                            placeholder="Audio title (optional)"
                            className="w-40 px-4 py-3 border border-gray-300 rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const urlInput = document.getElementById(`storyAudioUrl-${dayIndex}`);
                              const titleInput = document.getElementById(`storyAudioTitle-${dayIndex}`);
                              handleStoryAudioAdd(dayIndex, urlInput.value, titleInput.value);
                              urlInput.value = '';
                              titleInput.value = '';
                            }}
                            className="px-4 py-3 bg-gold text-white hover:bg-gold/90 rounded-xl flex items-center gap-2"
                            disabled={loading}
                          >
                            <Plus size={18} />
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-6 py-3 bg-gold text-white hover:bg-gold/90 disabled:opacity-50 rounded-xl flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    {course ? 'Updating...' : 'Creating...'}
                  </>
                ) : course ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
