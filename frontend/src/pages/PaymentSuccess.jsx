import { useEffect ,useState} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, API_URL, user } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const capturePayment = async () => {
      // Use ehs_token if context token is not yet ready (page refresh case)
      const activeToken = token || localStorage.getItem('ehs_token');
      const orderId = searchParams.get('token');
      const consultationId = searchParams.get('consultationId');
      const payerId = searchParams.get('PayerID');

      if (!orderId || !consultationId) {
        setError('Invalid payment information');
        setProcessing(false);
        return;
      }

      if (!activeToken) {
        console.log('No token found yet, waiting...');
        return; // Wait for auth to initialize
      }

      try {
        const response = await axios.post(
          `${API_URL}/consultations/capture-payment`,
          { orderId, consultationId, payerId },
          {
            headers: {
              'Authorization': `Bearer ${activeToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          // Success! Redirect to dashboard after 5 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 5000);
        } else {
          setError(response.data.message || 'Payment capture failed');
        }
      } catch (error) {
        console.error('Payment capture error:', error);
        // Even if it fails, check if the consultation was already confirmed
        // This handles cases where the user refreshes or the backend already processed it
        setError(error.response?.data?.message || 'Payment verification failed');
      } finally {
        setProcessing(false);
      }
    };

    capturePayment();
  }, [searchParams, token, API_URL, navigate]);

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader className="w-16 h-16 text-gold animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-espresso mb-2">Processing Your Payment...</h2>
          <p className="text-secondary">Please wait while we confirm your booking</p>
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
          <button
            onClick={() => navigate('/consultation')}
            className="bg-espresso text-cream px-6 py-3 rounded-full hover:bg-gold hover:text-espresso transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center max-w-md">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-espresso mb-2">Payment Successful! 🎉</h1>
        <p className="text-secondary mb-4">
          Your consultation has been booked. We are currently generating your meeting link and sending your confirmation email.
        </p>
        <p className="text-sm text-secondary mb-6">Redirecting to dashboard in a few seconds...</p>
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}