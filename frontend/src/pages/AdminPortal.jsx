import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ShoppingBag, FileText, Star, Users, Settings,
  LogOut, Plus, Edit, Trash2, Eye, EyeOff, Lock, ChevronRight, Upload,
  AlertCircle, CheckCircle2, CheckCircle, Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Token helpers ────────────────────────────────────────────────
const TOKEN_KEY = 'admin_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/** Decode JWT payload without verifying signature (client-side only). */
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/** Returns true if the stored JWT is expired (or invalid). */
function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  // Add 10-second buffer
  return Date.now() / 1000 > payload.exp - 10;
}

// ── Authenticated fetch wrapper ──────────────────────────────────
async function authFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  return response;
}

// ── Toast notification ───────────────────────────────────────────
function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full shadow-xl text-sm font-medium ${
        type === 'success'
          ? 'bg-emerald-600 text-white'
          : 'bg-red-600 text-white'
      }`}
    >
      {type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
      {message}
    </motion.div>
  );
}

// ── Admin Login ────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      });

      // Handle non-JSON responses gracefully
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        setError('Unexpected server response. Please contact support.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (response.status === 401) {
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }

      if (response.status === 403) {
        setError('Your account does not have admin privileges.');
        setLoading(false);
        return;
      }

      if (response.status === 429) {
        setError('Too many login attempts. Please wait and try again.');
        setLoading(false);
        return;
      }

      if (!response.ok || !data.success) {
        setError(data.message || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      if (!data.token) {
        setError('Authentication token missing. Please contact support.');
        setLoading(false);
        return;
      }

      setToken(data.token);
      onLogin({
        name: data.admin.name,
        email: data.admin.email,
        id: data.admin.id,
        role: 'admin',
      });
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot reach server. Check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Login error:', err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <p className="font-boska italic text-3xl text-cream mb-2" style={{ fontFamily: 'Boska, Georgia, serif' }}>
            EmbracingHigherSelf
          </p>
          <p className="text-label text-gold">Admin Portal</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 rounded-luxury p-10 space-y-5"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div>
            <label className="text-label text-cream/40 block mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
              autoComplete="username"
              className="w-full bg-white/5 border rounded-2xl px-5 py-3.5 text-sm text-cream placeholder-cream/20 focus:outline-none focus:border-gold/50 transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="admin@example.com"
            />
          </div>

          <div className="relative">
            <label className="text-label text-cream/40 block mb-2">Password</label>
            <input
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              required
              autoComplete="current-password"
              className="w-full bg-white/5 border rounded-2xl px-5 py-3.5 text-sm text-cream placeholder-cream/20 focus:outline-none focus:border-gold/50 transition-colors pr-12"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-4 bottom-3.5 text-cream/30 hover:text-cream/60 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-400 text-xs flex items-center gap-1.5"
              >
                <AlertCircle size={12} /> {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-espresso py-4 rounded-full font-medium hover:bg-cream transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-espresso/30 border-t-espresso rounded-full animate-spin" />
            ) : (
              <><Lock size={14} /> Access Portal</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Section wrapper ─────────────────────────────────────────────
function AdminSection({ title, children }) {
  return (
    <div className="bg-white rounded-luxury luxury-border p-8">
      <h3 className="font-boska text-2xl text-espresso mb-6" style={{ fontFamily: 'Boska, Georgia, serif' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Content Table ────────────────────────────────────────────────
function ContentTable({ items, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-espresso/5">
          {items.map((item, i) => (
            <tr key={i} className="group">
              <td className="py-3 pr-4 text-espresso font-medium">{item.title}</td>
              <td className="py-3 pr-4 text-secondary hidden md:table-cell">{item.meta}</td>
              <td className="py-3 pl-4 text-right">
                <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg hover:bg-gold/10 text-gold transition-colors">
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => onDelete(i)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Admin Dashboard ─────────────────────────────────────────
function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('courses');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => setToast({ message, type });

  const [courses, setCourses] = useState([
    { title: 'Manifestation Mastery', meta: '$197 · 24 lessons' },
    { title: 'Quantum Alignment', meta: '$297 · 18 lessons' },
    { title: 'Soul Purpose Blueprint', meta: '$347 · 30 lessons' },
  ]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [products, setProducts] = useState([
    { title: 'Manifestation Journal', meta: '$27 · PDF' },
    { title: 'Abundance Workbook', meta: '$19 · PDF' },
    { title: 'Vision Board Guide', meta: '$15 · PDF' },
  ]);
  const [resources, setResources] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [lastUploaded, setLastUploaded] = useState(null);
  const [stories, setStories] = useState([]);

  // Fetch resources on component mount 
  useEffect(() => { 
    fetchResources(); 
  }, []); 

  const fetchResources = async () => { 
    try { 
      const res = await fetch(`${API_URL}/resources?category=Beginner Guides`); 
      const data = await res.json(); 
      if (data.success) { 
        setResources(data.resources); 
      } 
    } catch (err) { 
      console.error('Failed to fetch resources:', err); 
    } 
  }; 

  useEffect(() => {
    if (activeSection === 'stories') {
      fetch(`${API_URL}/stories`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStories(data.stories.map(s => ({ ...s, meta: s.name, id: s._id })));
          }
        })
        .catch(err => console.error('Error fetching stories:', err));
    }
  }, [activeSection]);

  const handleResourceUploaded = (newResource) => { 
    setUploadSuccess(true); 
    setLastUploaded(newResource.title); 
    fetchResources(); // Refresh the list 
    setTimeout(() => setUploadSuccess(false), 5000); 
  }; 

  const handleDeleteResource = async (resourceId, resourceTitle, index) => { 
    if (!window.confirm(`Are you sure you want to delete "${resourceTitle}"? This action cannot be undone.`)) { 
      return; 
    } 
    
    try { 
      const token = getToken(); 
      const res = await fetch(`${API_URL}/resources/${resourceId}`, { 
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${token}` }, 
      }); 
      
      const data = await res.json(); 
      if (data.success) { 
        setResources(prev => prev.filter((_, idx) => idx !== index)); 
        showToast(`"${resourceTitle}" deleted successfully`, 'success'); 
      } else { 
        showToast(data.message || 'Delete failed', 'error'); 
      } 
    } catch (err) { 
      showToast('Error deleting resource', 'error'); 
      console.error(err); 
    } 
  }; 

  const handleDeleteStory = async (index) => {
    const story = stories[index];
    if (!window.confirm(`Are you sure you want to delete "${story.title}"?`)) return;

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/stories/${story.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStories(prev => prev.filter((_, i) => i !== index));
        showToast('Story deleted successfully', 'success');
      } else {
        showToast(data.message || 'Failed to delete story', 'error');
      }
    } catch (err) {
      showToast('Error deleting story', 'error');
    }
  };
  const [bookings, setBookings] = useState([
    { title: 'Session with Maya T.', meta: 'Mar 20, 2026 · 3:00 PM' },
    { title: 'Session with James R.', meta: 'Mar 22, 2026 · 11:00 AM' },
  ]);

  // Auto-logout when token expires
  useEffect(() => {
    const check = () => {
      const token = getToken();
      if (token && isTokenExpired(token)) {
        showToast('Session expired. Please log in again.', 'error');
        setTimeout(onLogout, 1500);
      }
    };
    check();
    const interval = setInterval(check, 60_000); // check every minute
    return () => clearInterval(interval);
  }, [onLogout]);

  const nav = [
    { key: 'courses', label: 'Courses', icon: BookOpen },
    { key: 'products', label: 'Products', icon: ShoppingBag },
    { key: 'resources', label: 'Free Resources', icon: FileText },
    { key: 'stories', label: 'Success Stories', icon: Star },
    { key: 'bookings', label: 'Bookings', icon: Users },
    { key: 'about', label: 'About Content', icon: Settings },
  ];

  const sectionData = {
    courses:   { title: 'Manage Courses',          items: courses,   setItems: setCourses },
    products:  { title: 'Manage Products',          items: products,  setItems: setProducts },
    resources: { title: 'Manage Free Resources',    items: resources, setItems: setResources },
    stories:   { title: 'Manage Success Stories',   items: stories,   setItems: setStories },
    bookings:  { title: 'Consultation Bookings',    items: bookings,  setItems: setBookings },
  };

  const current = sectionData[activeSection];

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-espresso flex flex-col" style={{ minHeight: '100vh' }}>
        <div className="p-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="font-boska italic text-cream text-xl" style={{ fontFamily: 'Boska, Georgia, serif' }}>
            EHS Admin
          </p>
          <p className="text-label text-gold mt-1 truncate">{user.email}</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {nav.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSection === key
                  ? 'bg-gold text-espresso'
                  : 'text-cream/50 hover:text-cream hover:bg-white/5'
              }`}
            >
              <Icon size={15} />
              {label}
              {activeSection === key && <ChevronRight size={13} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-cream/40 hover:text-cream/70 transition-colors"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-label text-gold mb-1">Admin Dashboard</p>
            <h1 className="font-boska text-4xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
              Content Management
            </h1>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            {[
              { label: 'Courses',  value: courses.length },
              { label: 'Products', value: products.length },
              { label: 'Bookings', value: bookings.length },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-boska text-2xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                  {s.value}
                </p>
                <p className="text-label text-secondary">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeSection === 'about' ? (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AdminSection title="About Us Content">
                <div className="space-y-6">
                  <div>
                    <label className="text-label text-espresso/50 block mb-2">Founder Story</label>
                    <textarea
                      rows={5}
                      defaultValue="After years of searching for meaning, purpose, and genuine transformation, our founder discovered the profound power of intentional manifestation..."
                      className="w-full rounded-2xl px-5 py-3.5 text-sm text-espresso bg-cream/50 focus:outline-none resize-none"
                      style={{ border: '1px solid rgba(42,34,25,0.12)' }}
                    />
                  </div>
                  <div>
                    <label className="text-label text-espresso/50 block mb-2">Mission Statement</label>
                    <textarea
                      rows={3}
                      defaultValue="To provide every person with the knowledge, tools, and community they need to step fully into their highest self."
                      className="w-full rounded-2xl px-5 py-3.5 text-sm text-espresso bg-cream/50 focus:outline-none resize-none"
                      style={{ border: '1px solid rgba(42,34,25,0.12)' }}
                    />
                  </div>
                  <button
                    onClick={() => showToast('Changes saved!', 'success')}
                    className="bg-espresso text-cream px-6 py-2.5 rounded-full text-sm hover:bg-gold hover:text-espresso transition-all duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              </AdminSection>
            </motion.div>
          ) : activeSection === 'courses' ? (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AdminSection title="Manage Courses">
                {showCourseForm ? (
                  <CourseForm
                    onSuccess={course => {
                      setCourses(prev => [
                        { title: course.title, meta: `$${course.price} · ${(course.modules?.length || 0)} modules` },
                        ...prev,
                      ]);
                      setShowCourseForm(false);
                    }}
                    onCancel={() => setShowCourseForm(false)}
                  />
                ) : (
                  <div
                    className="flex items-center gap-4 p-5 rounded-2xl mb-6 cursor-pointer group hover:border-gold/30 transition-colors"
                    style={{ border: '1px dashed rgba(42,34,25,0.15)' }}
                    onClick={() => setShowCourseForm(true)}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-gold transition-colors"
                      style={{ background: 'rgba(42,34,25,0.06)' }}
                    >
                      <Plus size={16} className="text-espresso" />
                    </div>
                    <span className="text-sm text-secondary group-hover:text-espresso transition-colors">
                      Add New Course
                    </span>
                  </div>
                )}
                <ContentTable
                  items={courses}
                  onDelete={i => setCourses(prev => prev.filter((_, idx) => idx !== i))}
                />
              </AdminSection>
            </motion.div>
          ) : activeSection === 'stories' ? (
            <motion.div
              key="stories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AdminSection title="Manage Success Stories">
                <div
                  className="flex items-center gap-4 p-5 rounded-2xl mb-6 cursor-pointer group hover:border-gold/30 transition-colors"
                  style={{ border: '1px dashed rgba(42,34,25,0.15)' }}
                  onClick={() => navigate('/portal-access/story-upload')}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-gold transition-colors"
                    style={{ background: 'rgba(42,34,25,0.06)' }}
                  >
                    <Plus size={16} className="text-espresso" />
                  </div>
                  <span className="text-sm text-secondary group-hover:text-espresso transition-colors">
                    Add New Item
                  </span>
                  <div className="ml-auto flex items-center gap-2 text-xs text-secondary">
                    <Upload size={12} /> Upload file
                  </div>
                </div>
                <ContentTable
                  items={stories}
                  onDelete={handleDeleteStory}
                />
              </AdminSection>
            </motion.div>
          ) : activeSection === 'resources' ? (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AdminSection title="Manage Free Resources"> 
                <div 
                  className="flex items-center gap-4 p-5 rounded-2xl mb-4 cursor-pointer group hover:border-gold/30 transition-colors" 
                  style={{ border: '1px dashed rgba(42,34,25,0.15)' }} 
                  onClick={() => navigate('/portal-access/freecourse-upload')} 
                > 
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-gold transition-colors" 
                    style={{ background: 'rgba(42,34,25,0.06)' }} 
                  > 
                    <Plus size={16} className="text-espresso" /> 
                  </div> 
                  <span className="text-sm text-secondary group-hover:text-espresso transition-colors"> 
                    Add New Item 
                  </span> 
                  <div className="ml-auto flex items-center gap-2 text-xs text-secondary"> 
                    <Upload size={12} /> Upload file 
                  </div> 
                </div> 
                
                {/* Upload Success Message */} 
                {uploadSuccess && lastUploaded && ( 
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }} 
                    className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3" 
                  > 
                    <CheckCircle size={16} className="text-green-500" /> 
                    <span className="text-sm text-green-700"> 
                      ✓ "{lastUploaded}" has been uploaded successfully! 
                    </span> 
                  </motion.div> 
                )} 
                
                <div className="overflow-x-auto"> 
                  <table className="w-full text-sm"> 
                    <tbody className="divide-y divide-espresso/5"> 
                      {resources.length === 0 ? ( 
                        <tr> 
                          <td colSpan="3" className="py-12 text-center text-secondary"> 
                            No resources uploaded yet. Click "Add New Item" to get started. 
                          </td> 
                        </tr> 
                      ) : ( 
                        resources.map((item, i) => ( 
                          <tr key={item._id || i} className="group"> 
                            <td className="py-3 pr-4"> 
                              <div className="font-medium text-espresso">{item.title}</div> 
                              <div className="text-xs text-secondary line-clamp-1">{item.description}</div> 
                            </td> 
                            <td className="py-3 pr-4 text-secondary hidden md:table-cell"> 
                              {new Date(item.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })} 
                            </td> 
                            <td className="py-3 pl-4 text-right"> 
                              <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity"> 
                                <a 
                                  href={`${API_URL.replace('/api', '')}${item.fileUrl}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="p-2 rounded-lg hover:bg-gold/10 text-gold transition-colors" 
                                  download 
                                > 
                                  <Download size={14} /> 
                                </a> 
                                <button 
                                  onClick={() => handleDeleteResource(item._id, item.title, i)} 
                                  className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors" 
                                > 
                                  <Trash2 size={14} /> 
                                </button> 
                              </div> 
                            </td> 
                          </tr> 
                        )) 
                      )} 
                    </tbody> 
                  </table> 
                </div> 
              </AdminSection>
            </motion.div>
          ) : current ? (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AdminSection title={current.title}>
                <div
                  className="flex items-center gap-4 p-5 rounded-2xl mb-6 cursor-pointer group hover:border-gold/30 transition-colors"
                  style={{ border: '1px dashed rgba(42,34,25,0.15)' }}
                  onClick={() =>
                    current.setItems((prev) => [
                      { title: 'New Item (edit me)', meta: 'Draft' },
                      ...prev,
                    ])
                  }
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-gold transition-colors"
                    style={{ background: 'rgba(42,34,25,0.06)' }}
                  >
                    <Plus size={16} className="text-espresso" />
                  </div>
                  <span className="text-sm text-secondary group-hover:text-espresso transition-colors">
                    Add New {activeSection === 'bookings' ? 'Entry' : 'Item'}
                  </span>
                  {activeSection !== 'bookings' && (
                    <div className="ml-auto flex items-center gap-2 text-xs text-secondary">
                      <Upload size={12} /> Upload file
                    </div>
                  )}
                </div>
                <ContentTable
                  items={current.items}
                  onDelete={(i) =>
                    current.setItems((prev) => prev.filter((_, idx) => idx !== i))
                  }
                />
              </AdminSection>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page Export ──────────────────────────────────────────────────
export default function AdminPortal() {
  const { user, login, logout, isAdmin } = useAuth();
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Verify the stored JWT against the DB by calling GET /admin/me.
   * This hits the backend on every page load/refresh so revoked tokens
   * (e.g. password changed, account disabled) are caught immediately.
   */
  const verifyStoredToken = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    // Quick client-side expiry check before hitting the network
    if (isTokenExpired(token)) {
      clearToken();
      setLoading(false);
      return;
    }

    try {
      const response = await authFetch('/admin/me');

      if (response.status === 401 || response.status === 403) {
        // Token invalid or revoked in DB — clear it
        clearToken();
        setLoading(false);
        return;
      }

      if (!response.ok) {
        // Network / server error — fail silently, force re-login
        clearToken();
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.admin) {
        const adminData = { ...data.admin, role: 'admin' };
        setAdminUser(adminData);
        login(adminData);
      } else {
        clearToken();
      }
    } catch (err) {
      console.error('Token verification error:', err);
      clearToken();
    }

    setLoading(false);
  }, [login]);

  useEffect(() => {
    verifyStoredToken();
  }, [verifyStoredToken]);

  const handleAdminLogin = useCallback(
    (data) => {
      setAdminUser(data);
      login(data);
    },
    [login]
  );

  const handleAdminLogout = useCallback(() => {
    clearToken();
    setAdminUser(null);
    logout();
  }, [logout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-espresso/20 border-t-espresso rounded-full animate-spin" />
      </div>
    );
  }

  if (!adminUser && (!user || !isAdmin)) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return <AdminDashboard user={adminUser || user} onLogout={handleAdminLogout} />;
}