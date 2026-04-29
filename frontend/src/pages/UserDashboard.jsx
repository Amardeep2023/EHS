import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ShoppingBag, Calendar, LogOut, Settings, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const { user, token, logout, isLoggedIn, API_URL } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // Fetch user profile and purchased items
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch profile');

      const data = await res.json();
      if (data.success) {
        setUserProfile(data.user);
        setCourses(data.user.purchasedCourses || []);
        setProducts(data.user.purchasedProducts || []);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      console.log('Fetching bookings from:', `${API_URL}/consultations/my`);
      const res = await fetch(`${API_URL}/consultations/my`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      const data = await res.json();
      console.log('Bookings data received:', data);
      
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        console.error('Failed to fetch bookings:', data.message);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchBookings();
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-espresso/20 border-t-espresso rounded-full animate-spin mx-auto mb-4" />
          <p className="text-espresso/60">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream pt-20">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-luxury p-8 shadow-luxury border border-espresso/5"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-24 h-24 rounded-full object-cover border-4 border-gold shadow-lg" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold to-espresso flex items-center justify-center border-4 border-gold shadow-lg">
                    <span className="text-white text-3xl font-bold">{user?.name?.charAt(0)}</span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div>
                <h1 className="font-boska italic text-4xl text-espresso mb-2" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                  {user?.name}
                </h1>
                <p className="text-secondary text-lg mb-4">{user?.email}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-gold" />
                    <span className="text-espresso font-medium">{courses.length} Courses Enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={18} className="text-gold" />
                    <span className="text-espresso font-medium">{products.length} Products Purchased</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-full font-medium hover:bg-red-100 transition-colors duration-300"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </motion.div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap gap-4 border-b border-espresso/10 pb-6">
          {[
            { id: 'courses', label: 'My Courses', icon: BookOpen },
            { id: 'sessions', label: 'My Sessions', icon: Calendar },
            { id: 'products', label: 'My Products', icon: ShoppingBag },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-gold border-b-2 border-gold pb-2'
                    : 'text-espresso/60 hover:text-espresso'
                }`}
              >
                <TabIcon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* My Courses Tab */}
        {activeTab === 'courses' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, idx) => (
                  <motion.div
                    key={course._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white rounded-luxury overflow-hidden shadow-luxury hover:shadow-2xl transition-all duration-300 border border-espresso/5 hover:border-gold/30"
                  >
                    {/* Course Image */}
                    <div className="relative h-48 bg-gradient-to-br from-gold/20 to-espresso/10 overflow-hidden">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={48} className="text-gold/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Course Info */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-boska italic text-xl text-espresso line-clamp-2" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                          {course.title}
                        </h3>
                        {course.amountPaid !== undefined && course.amountPaid < course.price ? (
                          <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                            Pending
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                            Purchased
                          </span>
                        )}
                      </div>
                      <p className="text-secondary text-sm mb-4">Price: ${course.price}</p>

                      {/* Continue Learning Button */}
                      <button
                        onClick={() => navigate(`/academy/${course._id || course.courseId}`)}
                        className="w-full flex items-center justify-center gap-2 bg-gold text-espresso py-3 rounded-full font-medium hover:bg-cream transition-all duration-300 group/btn"
                      >
                        Continue Learning
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen size={64} className="text-gold/20 mx-auto mb-4" />
                <h3 className="font-boska italic text-2xl text-espresso mb-2" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                  No Courses Yet
                </h3>
                <p className="text-secondary mb-6">Explore our academy and enroll in amazing courses.</p>
                <a
                  href="/academy"
                  className="inline-flex items-center gap-2 bg-gold text-espresso px-8 py-3 rounded-full font-medium hover:bg-cream transition-all duration-300"
                >
                  Browse Courses
                  <ArrowRight size={18} />
                </a>
              </div>
            )}
          </motion.div>
        )}

        {/* My Sessions Tab */}
        {activeTab === 'sessions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {bookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking, idx) => {
                  const meetingDate = new Date(booking.date);
                  const isExpired = meetingDate < new Date();
                  const isConfirmed = booking.status === 'confirmed';

                  return (
                    <motion.div
                      key={booking.id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-white rounded-luxury overflow-hidden shadow-luxury hover:shadow-2xl transition-all duration-300 border border-espresso/5 hover:border-gold/30 p-8"
                    >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-boska italic text-2xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                              Consultation Session
                            </h3>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                              isExpired ? 'bg-red-50 text-red-600' : 
                              isConfirmed ? 'bg-emerald-50 text-emerald-700' : 'bg-gold/10 text-gold'
                            }`}>
                              {isExpired ? 'Meeting Expired' : (booking.status || 'Confirmed')}
                            </span>
                          </div>
                          
                          {booking.intent && (
                            <div className="mb-4 p-3 bg-cream/30 rounded-xl text-sm text-espresso/70 italic border-l-2 border-gold/30">
                              "{booking.intent}"
                            </div>
                          )}

                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-secondary">
                              <Calendar size={18} className="text-gold" />
                              <span className="text-sm font-medium">
                                {new Date(booking.date || booking.preferredDate).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-secondary">
                              <div className="w-[18px] flex justify-center">
                                <span className="text-gold font-bold text-xs">@</span>
                              </div>
                              <span className="text-sm font-medium">{booking.time || booking.preferredTime}</span>
                            </div>
                          </div>
                        </div>

                      {isConfirmed && !isExpired && booking.meetingLink ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <p className="text-xs text-emerald-700 font-bold uppercase tracking-widest mb-1">Booking Confirmed ✨</p>
                            <p className="text-xs text-emerald-600">Your Zoom link is ready for your session.</p>
                          </div>
                          <a
                            href={booking.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-espresso text-cream py-4 rounded-full font-medium hover:bg-gold hover:text-espresso transition-all duration-300 group/link shadow-lg shadow-espresso/10"
                          >
                            Join Zoom Meeting
                            <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                          </a>
                        </div>
                      ) : isConfirmed && !isExpired ? (
                        <div className="p-4 bg-gold/5 rounded-2xl border border-gold/10">
                          <p className="text-xs text-gold font-bold uppercase tracking-widest mb-1">Link Generating...</p>
                          <p className="text-xs text-secondary">We are currently creating your Zoom session. Please check back in a few minutes.</p>
                        </div>
                      ) : isExpired ? (
                        <button disabled className="w-full bg-espresso/5 text-espresso/40 py-4 rounded-full font-medium cursor-not-allowed border border-espresso/10">
                          Session Ended
                        </button>
                      ) : (
                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                          <p className="text-xs text-red-600 font-bold uppercase tracking-widest mb-1">Action Required</p>
                          <p className="text-xs text-red-500">Payment pending or failed. Please contact support.</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar size={64} className="text-gold/20 mx-auto mb-4" />
                <h3 className="font-boska italic text-2xl text-espresso mb-2" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                  No Sessions Scheduled
                </h3>
                <p className="text-secondary mb-6">Ready to transform? Book your first private consultation.</p>
                <a
                  href="/consultation"
                  className="inline-flex items-center gap-2 bg-gold text-espresso px-8 py-3 rounded-full font-medium hover:bg-cream transition-all duration-300"
                >
                  Book Session
                  <ArrowRight size={18} />
                </a>
              </div>
            )}
          </motion.div>
        )}

        {/* My Products Tab */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, idx) => (
                  <motion.div
                    key={product._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white rounded-luxury overflow-hidden shadow-luxury hover:shadow-2xl transition-all duration-300 border border-espresso/5 hover:border-gold/30 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <ShoppingBag size={32} className="text-gold" />
                      <span className="text-gold font-bold">${product.price}</span>
                    </div>
                    <h3 className="font-boska italic text-lg text-espresso mb-4" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                      {product.title}
                    </h3>
                    <button className="w-full flex items-center justify-center gap-2 bg-espresso text-cream py-2 rounded-full text-sm font-medium hover:bg-gold hover:text-espresso transition-all duration-300">
                      Download
                      <ArrowRight size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ShoppingBag size={64} className="text-gold/20 mx-auto mb-4" />
                <h3 className="font-boska italic text-2xl text-espresso mb-2" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                  No Products Yet
                </h3>
                <p className="text-secondary mb-6">Discover our collection of premium products.</p>
                <a
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-gold text-espresso px-8 py-3 rounded-full font-medium hover:bg-cream transition-all duration-300"
                >
                  Shop Now
                  <ArrowRight size={18} />
                </a>
              </div>
            )}
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-luxury p-8 shadow-luxury border border-espresso/5"
              >
                <h3 className="font-boska italic text-xl text-espresso mb-6" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div className="pb-4 border-b border-espresso/10">
                    <label className="block text-secondary text-sm mb-2">Full Name</label>
                    <p className="text-espresso font-medium">{user?.name}</p>
                  </div>
                  <div className="pb-4 border-b border-espresso/10">
                    <label className="block text-secondary text-sm mb-2">Email Address</label>
                    <p className="text-espresso font-medium">{user?.email}</p>
                  </div>
                  <div className="pb-4 border-b border-espresso/10">
                    <label className="block text-secondary text-sm mb-2">Account Type</label>
                    <p className="text-espresso font-medium capitalize">{user?.role}</p>
                  </div>
                  <button className="w-full bg-gold text-espresso py-3 rounded-full font-medium hover:bg-cream transition-all duration-300 mt-4">
                    Edit Profile
                  </button>
                </div>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-luxury p-8 shadow-luxury border border-espresso/5"
              >
                <h3 className="font-boska italic text-xl text-espresso mb-6" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-espresso/10">
                    <span className="text-secondary">Total Courses</span>
                    <span className="text-2xl font-bold text-gold">{courses.length}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-espresso/10">
                    <span className="text-secondary">Total Products</span>
                    <span className="text-2xl font-bold text-gold">{products.length}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-secondary">Member Status</span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">Active</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
