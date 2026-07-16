import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Loader, LogIn, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import GoogleAuthModal from '../components/common/GoogleAuthModal';
import { useCountryPricing } from '../context/CountryPricingContext';
import { getPriceForCourse, formatPrice } from '../utils/pricing';

export default function Checkout() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, token, API_URL, isLoggedIn } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { countryCode, getPrice, formatPrice } = useCountryPricing();

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await axios.get(`${API_URL}/courses/${courseId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setCourse(res.data.course);
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [courseId, token, API_URL]);

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    // Re-fetch course with auth token after login
    const loadCourse = async () => {
      try {
        const activeToken = token || localStorage.getItem('ehs_token');
        const res = await axios.get(`${API_URL}/courses/${courseId}`, {
          headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        });
        setCourse(res.data.course);
      } catch {
        setCourse(null);
      }
    };
    loadCourse();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!course || !isLoggedIn) return;

    setProcessing(true);
    setError('');

    try {
      const activeToken = token || localStorage.getItem('ehs_token');
      const res = await axios.post(
        `${API_URL}/courses/purchase/initiate`,
        { courseId: course._id },
        { headers: { Authorization: `Bearer ${activeToken}` } }
      );

      if (res.data.approvalUrl) {
        // Redirect to PayPal for payment approval
        window.location.href = res.data.approvalUrl;
      } else {
        // Fallback: go directly to success page (local/dev mode)
        navigate(`/course-payment-success?token=${res.data.orderId}&courseId=${course._id}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to start checkout. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-espresso/20 border-t-gold rounded-full animate-spin" />
      </main>
    );
  }

  // ── Course not found ───────────────────────────────────────────
  if (!course) {
    return (
      <main className="pt-20 min-h-screen px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-espresso transition-colors">
            <ArrowLeft size={14} /> Back to Courses
          </Link>
          <p className="mt-8 text-espresso">Course not found.</p>
        </div>
      </main>
    );
  }

  // ── Not logged in — show login prompt ─────────────────────────
  if (!isLoggedIn) {
    return (
      <main className="pt-20 min-h-screen bg-cream">
        <div className="max-w-xl mx-auto px-6 py-20">
          <Link to={`/academy/${courseId}`} className="inline-flex items-center gap-2 text-sm text-secondary hover:text-espresso transition-colors mb-10 block">
            <ArrowLeft size={14} /> Back to Course Details
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-luxury luxury-border bg-white p-12 shadow-luxury-sm text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <LogIn size={28} className="text-gold" />
            </div>
            <h1 className="font-boska text-3xl text-espresso mb-3" style={{ fontFamily: 'Boska, Georgia, serif' }}>
              Sign In to Continue
            </h1>
            <p className="text-secondary leading-relaxed mb-8 max-w-sm mx-auto">
              Please sign in to your account to proceed with purchasing <strong>{course.title}</strong>.
            </p>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="inline-flex items-center gap-2 bg-espresso text-cream px-8 py-3.5 rounded-full text-sm font-medium hover:bg-gold hover:text-espresso transition-all duration-300"
            >
              <LogIn size={16} /> Sign In
            </button>
            <p className="text-xs text-secondary mt-4">
              New here? Sign in with your Google account to get started.
            </p>
          </motion.div>
        </div>

        <GoogleAuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </main>
    );
  }

  // ── Logged in — show checkout form ────────────────────────────
  return (
    <main className="pt-20 min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link to={`/academy/${courseId}`} className="inline-flex items-center gap-2 text-sm text-secondary hover:text-espresso transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Course Details
        </Link>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <section className="rounded-luxury luxury-border bg-white p-8 shadow-luxury-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center">
                <ShoppingCart size={18} className="text-gold" />
              </div>
              <div>
                <p className="text-label text-gold">Checkout</p>
                <h1 className="font-boska text-3xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                  Complete your order
                </h1>
              </div>
            </div>

            <div className="rounded-2xl bg-cream/70 p-5 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-espresso">{course.title}</h2>
                  <p className="text-sm text-secondary mt-2 line-clamp-2">{course.shortDescription || course.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-boska text-2xl text-espresso">{formatPrice(getPrice(course))}</p>
                  <p className="text-xs text-secondary">one-time</p>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-espresso mb-2">Full name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="w-full rounded-2xl border border-espresso/10 bg-cream/50 px-4 py-3 text-sm text-espresso opacity-70 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-espresso mb-2">Email address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full rounded-2xl border border-espresso/10 bg-cream/50 px-4 py-3 text-sm text-espresso opacity-70 cursor-not-allowed"
                />
              </div>

              <div className="rounded-2xl bg-gold/5 border border-gold/20 p-4">
                <p className="text-xs text-gold font-medium mb-1">Secure Payment</p>
                <p className="text-xs text-secondary">
                  You will be redirected to PayPal to securely complete your payment of <strong>{formatPrice(getPrice(course))}</strong>.
                </p>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 bg-espresso text-cream px-6 py-3.5 rounded-full text-sm font-medium hover:bg-gold hover:text-espresso transition-all duration-300 disabled:opacity-60"
              >
                {processing ? (
                  <><Loader size={16} className="animate-spin" /> Processing...</>
                ) : (
                  <><ShoppingCart size={16} /> Pay {formatPrice(getPrice(course))} with PayPal</>
                )}
              </button>
            </form>
          </section>

          <aside className="rounded-luxury luxury-border bg-white p-8 shadow-luxury-sm h-fit">
            <h2 className="font-boska text-2xl text-espresso mb-4" style={{ fontFamily: 'Boska, Georgia, serif' }}>
              Order Summary
            </h2>
            <div className="space-y-3 text-sm text-secondary">
              <div className="flex justify-between">
                <span>Course</span>
                <span className="text-espresso font-medium">{course.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Price</span>
                <span className="text-espresso">{formatPrice(getPrice(course))}</span>
              </div>
              <div className="flex justify-between font-semibold text-espresso pt-3 border-t border-espresso/10">
                <span>Total</span>
                <span>{formatPrice(getPrice(course))}</span>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-cream/70">
              <h3 className="text-xs font-medium text-espresso mb-2">What you'll get:</h3>
              <ul className="space-y-1.5 text-xs text-secondary">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0" />
                  Full course access — all {course.totalDays || 1} days
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0" />
                  Guided audios & journal PDFs
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0" />
                  Lifetime access — learn at your pace
                </li>
              </ul>
            </div>

            <p className="text-xs text-secondary mt-6 leading-relaxed">
              After payment, you'll be redirected back and your course will be immediately available in your dashboard.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
