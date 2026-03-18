import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ShoppingBag, FileText, Star, Users, Settings,
  LogOut, Plus, Edit, Trash2, Eye, EyeOff, Lock, ChevronRight, Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    await new Promise((r) => setTimeout(r, 1000));
    // Demo credentials
    if (form.email === 'admin@ehs.com' && form.password === 'admin123') {
      onLogin({ name: 'Admin', email: form.email, role: 'admin' });
    } else {
      setError('Invalid credentials. Try admin@ehs.com / admin123');
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
              className="w-full bg-white/5 border rounded-2xl px-5 py-3.5 text-sm text-cream placeholder-cream/20 focus:outline-none focus:border-gold/50 transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="admin@ehs.com"
            />
          </div>
          <div className="relative">
            <label className="text-label text-cream/40 block mb-2">Password</label>
            <input
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              required
              className="w-full bg-white/5 border rounded-2xl px-5 py-3.5 text-sm text-cream placeholder-cream/20 focus:outline-none focus:border-gold/50 transition-colors pr-12"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-4 bottom-3.5 text-cream/30 hover:text-cream/60 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
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
      <h3
        className="font-boska text-2xl text-espresso mb-6"
        style={{ fontFamily: 'Boska, Georgia, serif' }}
      >
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
  const [activeSection, setActiveSection] = useState('courses');

  const [courses, setCourses] = useState([
    { title: 'Manifestation Mastery', meta: '$197 · 24 lessons' },
    { title: 'Quantum Alignment', meta: '$297 · 18 lessons' },
    { title: 'Soul Purpose Blueprint', meta: '$347 · 30 lessons' },
  ]);
  const [products, setProducts] = useState([
    { title: 'Manifestation Journal', meta: '$27 · PDF' },
    { title: 'Abundance Workbook', meta: '$19 · PDF' },
    { title: 'Vision Board Guide', meta: '$15 · PDF' },
  ]);
  const [resources, setResources] = useState([
    { title: 'Manifestation Starter Guide', meta: 'PDF · Beginner' },
    { title: 'Morning Alignment Ritual', meta: 'Video · Practice' },
  ]);
  const [stories, setStories] = useState([
    { title: 'Manifested My Dream Career', meta: 'Amara K.' },
    { title: 'Found Love by Finding Myself', meta: 'Sophia R.' },
  ]);
  const [bookings, setBookings] = useState([
    { title: 'Session with Maya T.', meta: 'Mar 20, 2026 · 3:00 PM' },
    { title: 'Session with James R.', meta: 'Mar 22, 2026 · 11:00 AM' },
  ]);

  const nav = [
    { key: 'courses', label: 'Courses', icon: BookOpen },
    { key: 'products', label: 'Products', icon: ShoppingBag },
    { key: 'resources', label: 'Free Resources', icon: FileText },
    { key: 'stories', label: 'Success Stories', icon: Star },
    { key: 'bookings', label: 'Bookings', icon: Users },
    { key: 'about', label: 'About Content', icon: Settings },
  ];

  const sectionData = {
    courses: { title: 'Manage Courses', items: courses, setItems: setCourses },
    products: { title: 'Manage Products', items: products, setItems: setProducts },
    resources: { title: 'Manage Free Resources', items: resources, setItems: setResources },
    stories: { title: 'Manage Success Stories', items: stories, setItems: setStories },
    bookings: { title: 'Consultation Bookings', items: bookings, setItems: setBookings },
  };

  const current = sectionData[activeSection];

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside
        className="w-64 flex-shrink-0 bg-espresso flex flex-col"
        style={{ minHeight: '100vh' }}
      >
        <div className="p-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="font-boska italic text-cream text-xl" style={{ fontFamily: 'Boska, Georgia, serif' }}>
            EHS Admin
          </p>
          <p className="text-label text-gold mt-1">{user.email}</p>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-label text-gold mb-1">Admin Dashboard</p>
            <h1
              className="font-boska text-4xl text-espresso"
              style={{ fontFamily: 'Boska, Georgia, serif' }}
            >
              Content Management
            </h1>
          </div>
          {/* Stats */}
          <div className="hidden lg:flex items-center gap-6">
            {[
              { label: 'Courses', value: courses.length },
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
                  <button className="bg-espresso text-cream px-6 py-2.5 rounded-full text-sm hover:bg-gold hover:text-espresso transition-all duration-300">
                    Save Changes
                  </button>
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
                {/* Add new */}
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
                    <Plus size={16} className="text-espresso group-hover:text-espresso" />
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
    </div>
  );
}

// ── Page Export ──────────────────────────────────────────────────
export default function AdminPortal() {
  const { user, login, logout, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return <AdminLogin onLogin={(data) => login({ ...data, role: 'admin' })} />;
  }

  return <AdminDashboard user={user} onLogout={logout} />;
}
