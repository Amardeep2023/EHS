import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, ShoppingBag, Calendar, ArrowUpRight, Download, Play, Video, Clock, DollarSign, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Not '../contexts/AuthContext'
import axios from 'axios';

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
  const { user, logout, token, API_URL } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/consultations/my`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      setBookingError('Failed to load your sessions');
    } finally {
      setLoadingBookings(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  // Filter upcoming sessions (not cancelled and future date)
  const upcomingBookings = bookings.filter(
    booking => booking.status === 'confirmed' && new Date(booking.date) > new Date()
  );

  // Filter past sessions
  const pastBookings = bookings.filter(
    booking => booking.status === 'completed' || new Date(booking.date) <= new Date()
  );

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
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Upcoming Sessions Section - NEW */}
            {!loadingBookings && upcomingBookings.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-boska text-2xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                    Upcoming Sessions 🎯
                  </h2>
                  <Link to="/consultation" className="text-nav text-secondary hover:text-espresso transition-colors flex items-center gap-1">
                    Book New <ArrowUpRight size={12} />
                  </Link>
                </div>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-6 rounded-luxury luxury-border bg-white hover:shadow-luxury-md transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-espresso text-lg">
                              ✨ Consultation Session
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                          <div className="mb-3 text-sm text-espresso/70 italic">
                            "{booking.intent}"
                          </div>
                          <div className="space-y-1 text-sm text-secondary">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gold" />
                              <span>{new Date(booking.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-gold" />
                              <span>{booking.time} (60 minutes)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign size={14} className="text-gold" />
                              <span>${booking.amountPaid}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          {booking.meetingLink && (
                            <a
                              href={booking.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-gold text-espresso px-4 py-2 rounded-full text-sm font-medium hover:bg-espresso hover:text-cream transition-all duration-300"
                            >
                              <Video size={14} />
                              Join Meeting
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enrolled Courses */}
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

            {/* Past Sessions Section - NEW */}
            {!loadingBookings && pastBookings.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-boska text-2xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                    Past Sessions 📅
                  </h2>
                </div>
                <div className="space-y-3">
                  {pastBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-luxury luxury-border bg-white/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-espresso">
                            {booking.sessionType === 'consultation' ? 'Consultation Session' : booking.sessionType}
                          </p>
                          <p className="text-xs text-secondary">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {pastBookings.length > 3 && (
                    <button className="text-sm text-gold hover:text-espresso transition-colors text-center w-full py-2">
                      View all past sessions ({pastBookings.length})
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loadingBookings && (
              <div className="p-8 rounded-luxury luxury-border bg-white">
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-secondary text-sm">Loading your sessions...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {bookingError && !loadingBookings && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle size={18} />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Quick Booking Prompt */}
            {!loadingBookings && bookings.length === 0 && (
              <div className="p-8 rounded-luxury luxury-border bg-gradient-to-r from-gold/5 to-transparent">
                <div className="text-center">
                  <Calendar size={40} className="text-gold mx-auto mb-3" />
                  <h3 className="font-boska text-xl text-espresso mb-2">No Sessions Booked Yet</h3>
                  <p className="text-secondary text-sm mb-4">Ready to transform your journey? Book your first consultation session.</p>
                  <Link
                    to="/consultation"
                    className="inline-flex items-center gap-2 bg-espresso text-cream px-6 py-2.5 rounded-full text-sm hover:bg-gold hover:text-espresso transition-all duration-300"
                  >
                    Book Your Session <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Summary - NEW */}
            {!loadingBookings && bookings.length > 0 && (
              <div className="p-6 rounded-luxury bg-gradient-section border border-gold/20">
                <p className="text-label text-gold mb-4">Session Summary</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Total Sessions</span>
                    <span className="font-boska text-xl text-espresso">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Upcoming</span>
                    <span className="font-boska text-xl text-gold">{upcomingBookings.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Completed</span>
                    <span className="font-boska text-xl text-espresso">{pastBookings.length}</span>
                  </div>
                </div>
              </div>
            )}

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
                <p className="break-all">{user?.email || 'user@example.com'}</p>
                <button
                  onClick={logout}
                  className="text-espresso/40 hover:text-espresso transition-colors text-nav"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="p-6 rounded-luxury luxury-border bg-white">
              <p className="text-label text-espresso/40 mb-3">Need Help?</p>
              <p className="text-xs text-secondary mb-3">
                Having trouble joining your session? Contact us and we'll help you right away.
              </p>
              <a
                href="mailto:support@yourdomain.com"
                className="text-gold hover:text-espresso transition-colors text-sm flex items-center gap-1"
              >
                Contact Support <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}