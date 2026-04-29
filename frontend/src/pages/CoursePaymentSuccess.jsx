import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CoursePaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, API_URL } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const capture = async () => {
      const activeToken = token || localStorage.getItem('ehs_token');
      const orderId = searchParams.get('token');       // PayPal appends ?token=
      const courseId = searchParams.get('courseId');

      if (!orderId || !courseId) {
        setError('Invalid payment information');
        setProcessing(false);
        return;
      }
      if (!activeToken) return; // wait for auth

      try {
        const res = await axios.post(
          `${API_URL}/courses/purchase/capture`,
          { orderId, courseId },
          { headers: { Authorization: `Bearer ${activeToken}` } }
        );
        if (res.data.success) {
          setTimeout(() => navigate('/dashboard'), 4000);
        } else {
          setError(res.data.message || 'Payment capture failed');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Payment verification failed');
      } finally {
        setProcessing(false);
      }
    };
    capture();
  }, [searchParams, token, API_URL, navigate]);

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader className="w-16 h-16 text-gold animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-espresso mb-2">Processing Your Payment...</h2>
          <p className="text-secondary">Unlocking your course access</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-3xl">!</span>
          </div>
          <h2 className="text-2xl font-semibold text-espresso mb-2">Payment Failed</h2>
          <p className="text-secondary mb-6">{error}</p>
          <button onClick={() => navigate('/academy')}
            className="bg-espresso text-cream px-6 py-3 rounded-full hover:bg-gold hover:text-espresso transition">
            Back to Academy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center max-w-md">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-espresso mb-2" style={{ fontFamily: 'Boska, Georgia, serif' }}>
          Course Unlocked! ✨
        </h1>
        <p className="text-secondary mb-4">
          Your course is now available in your dashboard. Begin your 21-day journey whenever you're ready.
        </p>
        <p className="text-sm text-secondary mb-6">Redirecting to dashboard...</p>
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}