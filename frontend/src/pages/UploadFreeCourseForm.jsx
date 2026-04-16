import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Upload, X, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CATEGORY_OPTIONS = [
  { value: 'Beginner Guides', label: 'Beginner Guides' },
  { value: 'Quick Practices', label: 'Quick Practices' },
  { value: 'Challenges', label: 'Challenges' },
  { value: 'Videos', label: 'Videos' }
];

export default function UploadFreeCourseForm({ onUpload }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Beginner Guides');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const getAuthToken = () => localStorage.getItem('admin_token') || localStorage.getItem('token');

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      setFile(null);
      return;
    }
    setError('');
    setFile(f);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const f = e.dataTransfer.files[0];
    if (f && f.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      setFile(null);
      return;
    }
    setError('');
    setFile(f);
  };

  const removeFile = () => {
    setFile(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!title.trim()) {
      setError('Resource title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }

    const token = getAuthToken();
    
    if (!token) {
      setError('Session expired. Redirecting to login...');
      setTimeout(() => navigate('/portal-access'), 2000);
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('type', 'PDF');
      formData.append('category', category);
      formData.append('file', file);

      const res = await fetch(`${API_URL}/resources/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(data.message || 'Upload failed.');
      }

      if (!data.success) {
        throw new Error(data.message || 'Upload failed.');
      }

      setSuccess(`"${data.resource.title}" uploaded successfully!`);
      
      // Callback if provided
      if (onUpload) {
        onUpload(data.resource);
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('Beginner Guides');
      setFile(null);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/portal-access');
      }, 2000);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
      
      if (err.message.includes('Session expired')) {
        setTimeout(() => navigate('/portal-access'), 2000);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0eb] to-[#eaf1f5] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 
            className="font-boska text-5xl md:text-6xl lg:text-7xl text-espresso mb-4" 
            style={{ fontFamily: 'Boska, Georgia, serif' }}
          >
            Upload New Resource
          </h1>
          <p className="text-secondary text-lg md:text-xl">
            Share manifestation guides with your community
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-cream/20"
        >
          {/* Resource Type Indicator */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-espresso/5">
            <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
              <FileText size={28} className="text-gold" />
            </div>
            <div>
              <h2 className="font-boska text-2xl md:text-3xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                New Resource
              </h2>
              <p className="text-sm text-secondary mt-1">Fill in the details below</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Title Input */}
            <div>
              <label className="block text-base font-semibold text-espresso mb-3">
                Resource Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                className="w-full border-2 border-espresso/10 rounded-2xl px-6 py-4 text-lg text-espresso placeholder:text-espresso/30 focus:outline-none focus:border-gold transition-colors"
                placeholder="e.g., Manifestation Starter Guide"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-base font-semibold text-espresso mb-3">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border-2 border-espresso/10 rounded-2xl px-6 py-4 text-lg text-espresso bg-white appearance-none cursor-pointer focus:outline-none focus:border-gold transition-colors"
                  style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  size={24} 
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-espresso/40 pointer-events-none" 
                />
              </div>
              <p className="text-xs text-secondary mt-2">
                Select the category for filtering on the resources page
              </p>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-base font-semibold text-espresso mb-3">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                className="w-full border-2 border-espresso/10 rounded-2xl px-6 py-4 text-lg text-espresso placeholder:text-espresso/30 focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="Describe what this resource covers and how it will help the user..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
            </div>

            {/* File Upload Area */}
            <div>
              <label className="block text-base font-semibold text-espresso mb-3">
                Upload PDF Document <span className="text-red-400">*</span>
              </label>
              
              {!file ? (
                <div
                  className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${
                    dragActive 
                      ? 'border-gold bg-gold/5' 
                      : 'border-espresso/15 hover:border-gold/40 hover:bg-cream/5'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <Upload size={36} className="text-gold" />
                  </div>
                  <p className="text-xl text-espresso mb-3 font-medium">
                    Drag & drop your PDF here
                  </p>
                  <p className="text-base text-secondary mb-4">
                    or <span className="text-gold font-medium">browse files</span>
                  </p>
                  <p className="text-sm text-espresso/40">
                    Maximum file size: 50MB • PDF files only
                  </p>
                </div>
              ) : (
                <div className="border-2 border-gold/30 rounded-2xl p-6 bg-gold/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center">
                        <FileText size={28} className="text-gold" />
                      </div>
                      <div>
                        <p className="font-semibold text-espresso text-lg mb-1">{file.name}</p>
                        <p className="text-base text-secondary">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-3 rounded-full hover:bg-red-50 text-red-400 transition-colors"
                    >
                      <X size={22} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Success/Error Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4"
              >
                <AlertCircle size={22} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-base text-red-700">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-4"
              >
                <CheckCircle size={22} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-base text-green-700 font-medium mb-1">{success}</p>
                  <p className="text-sm text-green-600">Redirecting to admin portal...</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-10">
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gold text-white rounded-full py-5 font-bold text-xl hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold/20"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading Resource...
                </span>
              ) : (
                'Publish Resource'
              )}
            </button>
          </div>

          {/* Cancel Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => navigate('/portal-access')}
              className="w-full border-2 border-espresso/10 text-espresso rounded-full py-4 font-semibold text-lg hover:bg-cream/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
