import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function PaymentCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/consultation');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center max-w-md">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-espresso mb-2">Payment Cancelled</h1>
        <p className="text-secondary mb-4">
          Your payment was cancelled. No charges have been made.
        </p>
        <p className="text-sm text-secondary mb-6">Redirecting you back to booking page...</p>
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