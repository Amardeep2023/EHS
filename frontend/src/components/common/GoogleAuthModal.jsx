import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleAuthModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const { login } = useAuth();

  // Initialize Google SDK on component mount
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error('❌ VITE_GOOGLE_CLIENT_ID not set in .env file');
      return;
    }

    // Check if Google SDK already loaded
    if (window.google) {
      setGoogleLoaded(true);
      return;
    }

    // Load Google SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      try {
        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        setGoogleLoaded(true);
      } catch (err) {
        console.error('Failed to initialize Google SDK:', err);
      }
    };

    script.onerror = () => {
      console.error('Failed to load Google SDK script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      setLoading(true);
      setError('');

      // Verify token with backend
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Authentication failed');
      }

      const data = await res.json();

      if (data.success && data.token && data.user) {
        login(data.user, data.token);
        setSuccess('Login successful! Redirecting...');

        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        throw new Error('Invalid authentication response');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    if (!googleLoaded) {
      setError('Google authentication is not ready. Please refresh the page.');
      return;
    }

    if (!GOOGLE_CLIENT_ID) {
      setError('⚠️ Google Client ID not configured. Check VITE_GOOGLE_CLIENT_ID in .env.local file.');
      console.error('❌ VITE_GOOGLE_CLIENT_ID is not set. Create .env.local in frontend folder.');
      return;
    }

    try {
      // Render button
      const buttonDiv = document.getElementById('google-signin-button');
      if (buttonDiv) {
        window.google.accounts.id.renderButton(buttonDiv, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
        });
      }

      // Try to show One Tap
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('One Tap not displayed - use button instead');
        }
      });
    } catch (err) {
      setError('Failed to initialize Google authentication.');
      console.error('Google SDK error:', err);
    }
  };

  useEffect(() => {
    if (isOpen && googleLoaded) {
      handleGoogleAuth();
    }
  }, [isOpen, googleLoaded]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-8"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-boska italic text-2xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                  Sign In
                </h2>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="p-1 hover:bg-gold/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X size={20} className="text-espresso" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-5">
                <p className="text-secondary text-sm">Sign in with your Google account to access exclusive courses and track your progress.</p>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200"
                    >
                      <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Message */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200"
                    >
                      <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                      <p className="text-emerald-700 text-sm">{success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Google Sign-In Button Container */}
                <div id="google-signin-button" className="flex justify-center py-2" />

                {/* Fallback Button */}
                <button
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full bg-gold text-espresso py-4 rounded-full font-medium hover:bg-cream transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-espresso/30 border-t-espresso rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-espresso/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-secondary/60">or</span>
                  </div>
                </div>

                {/* Terms */}
                <p className="text-xs text-secondary/60 text-center">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-gold hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-gold hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
