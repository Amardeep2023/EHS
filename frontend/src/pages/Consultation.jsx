import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, ArrowUpRight, AlertCircle } from 'lucide-react';
import FAQAccordion from '../components/common/FAQAccordion';
import { useAuth } from '../context/AuthContext'; // Your auth context
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const faqs = [
  {
    question: 'What happens in a consultation session?',
    answer: 'Each session is a deeply personalized 60-minute conversation. We explore where you currently are, uncover what is holding you back, and create a clear, aligned roadmap for your next steps — tailored entirely to you.',
  },
  {
    question: 'How do I receive my meeting link?',
    answer: 'After your booking and payment are confirmed, you will receive an automated email with your meeting link, date, time, and preparation instructions within minutes.',
  },
  {
    question: 'Can I reschedule my session?',
    answer: 'Yes, you may reschedule up to 24 hours before your scheduled session at no additional cost. Simply use the link provided in your confirmation email.',
  },
  {
    question: 'Is the consultation recorded?',
    answer: 'Sessions are recorded upon request only, and solely for your personal use. Please let us know your preference at the time of booking.',
  },
  {
    question: 'What should I prepare?',
    answer: 'Come with openness and a sense of the key areas you wish to address. There are no wrong answers — we meet you exactly where you are.',
  },
];

export default function Consultation() {
  const { user, token, isLoggedIn, API_URL } = useAuth(); // Use isLoggedIn instead of isAuthenticated
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    intent: '', 
    date: '', 
    time: '' 
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState(null);

  // Auto-fill form if user is logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      console.log('User logged in:', user);
      setForm(prev => ({
        ...prev,
        name: user.name || user.displayName || '',
        email: user.email || ''
      }));
    } else {
      console.log('User not logged in. isLoggedIn:', isLoggedIn, 'user:', user);
    }
  }, [isLoggedIn, user]);

  // Check for payment return
  useEffect(() => {
    const paypalToken = searchParams.get('token');
    const consultationId = searchParams.get('consultationId');
    
    if (paypalToken && consultationId && !submitted) {
      capturePayment(paypalToken, consultationId);
    }
  }, [searchParams]);

  const capturePayment = async (orderId, consultationId) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_URL}/consultations/capture-payment`,
        { orderId, consultationId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setBookingData(response.data.consultation);
        setSubmitted(true);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Payment capture error:', error);
      setError(error.response?.data?.message || 'Payment verification failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  if (!isLoggedIn) {
    setError('Please sign in to book a session');
    setLoading(false);
    setTimeout(() => {
      navigate('/login', { state: { returnUrl: '/consultation' } });
    }, 2000);
    return;
  }

  try {
    const response = await axios.post(
      `${API_URL}/consultations`,
      {
        intent: form.intent,
        preferredDate: form.date,
        preferredTime: form.time
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Booking response:', response.data);

    if (response.data.success && response.data.approvalUrl) {
      window.location.href = response.data.approvalUrl;
    } else {
      setError(response.data.message || 'Failed to create booking or get PayPal link');
      setLoading(false);
    }
  } catch (error) {
    console.error('Booking error:', error);
    setError(error.response?.data?.message || 'Failed to create booking');
    setLoading(false);
  }
};

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <main className="pt-20 overflow-hidden">
      {/* Header */}
      <section className="py-28 px-6 bg-gradient-section">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-label text-gold mb-4"
          >
            Personal Session
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-boska text-6xl md:text-7xl text-espresso mb-6"
            style={{ fontFamily: 'Boska, Georgia, serif', letterSpacing: '-0.02em' }}
          >
            One-on-One Guidance
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary leading-relaxed max-w-xl mx-auto"
          >
            A 60-minute private consultation — entirely tailored to your unique journey, questions, and deepest aspirations.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-boska text-4xl text-espresso mt-8"
            style={{ fontFamily: 'Boska, Georgia, serif' }}
          >
            $197 <span className="text-secondary text-lg font-jakarta font-normal">/ session</span>
          </motion.p>
        </div>
      </section>

      {/* Booking form */}
      <section className="py-28 px-6">
        <div className="max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 rounded-luxury luxury-border bg-white text-center"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto"
                  style={{ background: 'rgba(212,165,116,0.15)' }}
                >
                  <CheckCircle size={28} className="text-gold" />
                </div>
                <h2
                  className="font-boska text-3xl text-espresso mb-3"
                  style={{ fontFamily: 'Boska, Georgia, serif' }}
                >
                  Booking Confirmed! 🎉
                </h2>
                <p className="text-secondary leading-relaxed mb-6">
                  Thank you, {form.name}. Your session is confirmed. You will receive a Zoom meeting link at <strong>{form.email}</strong> within minutes.
                </p>
                <div className="p-5 rounded-2xl text-left space-y-2" style={{ background: 'rgba(212,165,116,0.08)' }}>
                  <p className="text-sm text-espresso">
                    <span className="font-medium">📅 Date:</span> {form.date}
                  </p>
                  <p className="text-sm text-espresso">
                    <span className="font-medium">⏰ Time:</span> {form.time}
                  </p>
                  <p className="text-sm text-espresso">
                    <span className="font-medium">💭 Purpose:</span> {form.intent}
                  </p>
                  {bookingData?.meetingLink && (
                    <div className="mt-4 pt-3 border-t border-gold/20">
                      <a 
                        href={bookingData.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:text-espresso transition-colors text-sm flex items-center gap-2"
                      >
                        Join Zoom Meeting <ArrowUpRight size={14} />
                      </a>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="mt-6 px-6 py-3 bg-espresso text-cream rounded-full hover:bg-gold hover:text-espresso transition-all duration-300"
                >
                  Go to My Dashboard
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="p-10 rounded-luxury luxury-border bg-white space-y-6"
              >
                <h2
                  className="font-boska text-3xl text-espresso mb-2"
                  style={{ fontFamily: 'Boska, Georgia, serif' }}
                >
                  Book Your Session
                </h2>
                <p className="text-sm text-secondary">
                  Fill in the details below and proceed to secure payment via PayPal.
                </p>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2"
                  >
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Login reminder if not authenticated */}
                {!isLoggedIn && (
                  <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 text-espresso text-sm">
                    <p className="font-medium">⚠️ Please sign in to book a session</p>
                    <p className="text-xs mt-1 text-secondary">You'll be redirected to login page</p>
                  </div>
                )}

                <div>
                  <label className="text-label text-espresso/60 block mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    disabled={isLoggedIn}
                    placeholder="Your full name"
                    className="w-full border luxury-border rounded-2xl px-5 py-3.5 text-sm text-espresso bg-cream/50 placeholder-espresso/30 focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-60 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="text-label text-espresso/60 block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={isLoggedIn}
                    placeholder="your@email.com"
                    className="w-full luxury-border rounded-2xl px-5 py-3.5 text-sm text-espresso bg-cream/50 placeholder-espresso/30 focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-60 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="text-label text-espresso/60 block mb-2">Intention / Purpose</label>
                  <textarea
                    name="intent"
                    value={form.intent}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="What would you like to explore or achieve in this session?"
                    className="w-full rounded-2xl px-5 py-3.5 text-sm text-espresso bg-cream/50 placeholder-espresso/30 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-label text-espresso/60 block mb-2">Preferred Date</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full rounded-2xl px-5 py-3.5 text-sm text-espresso bg-cream/50 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-label text-espresso/60 block mb-2">Preferred Time</label>
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl px-5 py-3.5 text-sm text-espresso bg-cream/50 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isLoggedIn}
                  className="w-full bg-espresso text-cream py-4 rounded-full font-medium hover:bg-gold hover:text-espresso transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  ) : (
                    <>Book Session - $197 <ArrowUpRight size={16} /></>
                  )}
                </button>

                <p className="text-xs text-center text-secondary">
                  Secure payment powered by PayPal. Your information is encrypted and secure.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-28 px-6 bg-gradient-section">
        <div className="max-w-2xl mx-auto pt-20">
          <p className="text-label text-gold mb-3 text-center">Common Questions</p>
          <h2
            className="font-boska text-4xl text-espresso text-center mb-12"
            style={{ fontFamily: 'Boska, Georgia, serif' }}
          >
            Everything You Need to Know
          </h2>
          <FAQAccordion items={faqs} />
        </div>
      </section>
    </main>
  );
}