import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function CoursePaymentCancel() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate('/academy'), 5000);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center max-w-md">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-espresso mb-2">Payment Cancelled</h1>
        <p className="text-secondary mb-4">No charges were made. Your spot is still available.</p>
        <p className="text-sm text-secondary mb-6">Redirecting back to Academy...</p>
        <button onClick={() => navigate('/academy')}
          className="bg-espresso text-cream px-6 py-3 rounded-full hover:bg-gold hover:text-espresso transition">
          Back to Academy
        </button>
      </div>
    </div>
  );
}