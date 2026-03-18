import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, ShoppingBag, Calendar, ArrowUpRight, Download, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const enrolledCourses = [
  {
    id: 'manifestation-mastery',
    title: 'Manifestation Mastery',
    progress: 35,
    nextLesson: 'The Belief Reprogramming Method',
    img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&auto=format&fit=crop&q=60',
  },
];

const purchasedProducts = [
  { id: 'vision-board-guide', title: 'Vision Board Mastery Guide', category: 'Guide' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <p className="text-label text-gold mb-2">Welcome back</p>
          <h1
            className="font-boska text-5xl text-espresso"
            style={{ fontFamily: 'Boska, Georgia, serif' }}
          >
            {user?.name || 'Your Dashboard'}
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-boska text-2xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                  My Courses
                </h2>
                <Link to="/academy" className="text-nav text-secondary hover:text-espresso transition-colors flex items-center gap-1">
                  Browse More <ArrowUpRight size={12} />
                </Link>
              </div>

              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <Link
                      key={course.id}
                      to={`/academy/${course.id}`}
                      className="flex gap-5 p-6 rounded-luxury luxury-border bg-white hover:shadow-luxury-md transition-all duration-300 group"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={course.img} alt={course.title} className="w-full h-full object-cover img-sepia" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-espresso mb-1">{course.title}</h3>
                        <p className="text-xs text-secondary mb-3">Next: {course.nextLesson}</p>
                        <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(42,34,25,0.08)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${course.progress}%`, background: '#d4a574' }}
                          />
                        </div>
                        <p className="text-xs text-secondary mt-1">{course.progress}% complete</p>
                      </div>
                      <div className="flex items-center">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ background: '#2a2219' }}
                        >
                          <Play size={14} fill="#d4a574" color="#d4a574" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-10 rounded-luxury luxury-border bg-white text-center">
                  <BookOpen size={32} className="text-gold mx-auto mb-3" />
                  <p className="text-secondary text-sm mb-4">You haven't enrolled in any courses yet.</p>
                  <Link
                    to="/academy"
                    className="inline-flex items-center gap-2 bg-espresso text-cream px-6 py-2.5 rounded-full text-sm hover:bg-gold hover:text-espresso transition-all duration-300"
                  >
                    Explore Academy <ArrowUpRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            {/* Purchased Products */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-boska text-2xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                  My Downloads
                </h2>
                <Link to="/shop" className="text-nav text-secondary hover:text-espresso transition-colors flex items-center gap-1">
                  Visit Shop <ArrowUpRight size={12} />
                </Link>
              </div>
              {purchasedProducts.length > 0 ? (
                <div className="space-y-3">
                  {purchasedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-5 rounded-2xl luxury-border bg-white"
                    >
                      <div>
                        <p className="text-sm font-medium text-espresso">{p.title}</p>
                        <p className="text-xs text-secondary">{p.category}</p>
                      </div>
                      <button className="flex items-center gap-1 text-sm text-gold hover:text-espresso transition-colors font-medium">
                        <Download size={14} /> Download
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-luxury luxury-border bg-white text-center">
                  <p className="text-secondary text-sm">No purchases yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick actions */}
            <div className="p-8 rounded-luxury bg-espresso text-cream">
              <p className="text-label text-gold mb-5">Quick Actions</p>
              <div className="space-y-3">
                <Link
                  to="/academy"
                  className="flex items-center gap-3 text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  <BookOpen size={15} /> Browse Courses
                </Link>
                <Link
                  to="/shop"
                  className="flex items-center gap-3 text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  <ShoppingBag size={15} /> Visit Shop
                </Link>
                <Link
                  to="/consultation"
                  className="flex items-center gap-3 text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  <Calendar size={15} /> Book Consultation
                </Link>
              </div>
            </div>

            {/* Account */}
            <div className="p-8 rounded-luxury luxury-border bg-white">
              <p className="text-label text-espresso/40 mb-5">Account</p>
              <div className="space-y-3 text-sm text-secondary">
                <p>{user?.email || 'user@example.com'}</p>
                <button
                  onClick={logout}
                  className="text-espresso/40 hover:text-espresso transition-colors text-nav"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
