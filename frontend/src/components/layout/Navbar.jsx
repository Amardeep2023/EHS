import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GoogleAuthModal from '../common/GoogleAuthModal';

const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'Community', to: '/academy' },
  { label: 'Courses', to: '/free-resources' },
  { label: 'Testimonials', to: '/success-stories' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, logout, isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  const handleAuthSuccess = () => {
    navigate('/');
  };

  return (
    <>
      <header
        className={` top-0 left-0 right-0 z-50 h-20 transition-all duration-500 ${
          scrolled ? 'bg-cream/90 backdrop-blur-xl shadow-luxury' : 'bg-cream/80 backdrop-blur-xl'
        } luxury-border-b`}
        style={{ borderBottom: '1px solid rgba(42,34,25,0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden  group-hover:border-[#D47E5A] transition-colors shadow-sm bg-white flex items-center justify-center">
              <img 
                src="/assets/logo.jpg" 
                alt="EmbracingHigherSelf Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-braven text-2xl text-[#070707] tracking-tight group-hover:text-[#2A2219] transition-colors">
              EmbracingHigherSelf
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-nav font-jakarta transition-all duration-300 relative group ${
                  location.pathname === link.to
                    ? 'text-[#4B6A4A]'
                    : 'text-espresso/60 hover:text-[#4B6A4A]'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4B6A4A] transition-all duration-300 group-hover:w-full ${location.pathname === link.to ? 'w-full' : ''}`} />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                {/* Profile Picture & Menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#4B6A4A] hover:border-[#3B2C1A] transition-all hover:scale-110"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#4B6A4A] to-[#3B2C1A] flex items-center justify-center">
                        <User size={20} className="text-cream" />
                      </div>
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-luxury-xl border border-white/20 overflow-hidden"
                      >
                        <div className="p-5 border-b border-espresso/5 bg-cream/30">
                          <p className="text-xs text-gold uppercase tracking-widest font-jakarta mb-1">Welcome back</p>
                          <p className="text-sm font-bold text-espresso font-jakarta truncate">{user?.name || 'User'}</p>
                          <p className="text-[10px] text-secondary truncate font-jakarta">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-secondary hover:text-espresso hover:bg-cream/50 transition-colors font-jakarta"
                          >
                            <User size={16} /> My Dashboard
                          </Link>
                          {isAdmin && (
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors font-jakarta"
                            >
                              <LogOut size={16} /> Logout
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 bg-opacity-80 border border-green-900 text-brown-500 px-6 py-2.5 rounded-full text-nav font-jakarta font-semibold hover:bg-white/40 transition-all shadow-md hover:shadow-emerald-900/10"
              >
                Sign In
              </button>
            )}

            {/* Book a Session Button */}
            <Link
              to="/consultation"
              className="text-nav bg-opacity-80  text-brown-500 px-6 py-2.5 rounded-full hover:bg-white/40 border border-green-900 transition-all duration-300 shadow-md hover:shadow-lg"
              style={{ fontSize: '10px', letterSpacing: '0.2em' }}
            >
              Book a Session
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="flex items-center gap-2 text-nav text-[#2A2219] hover:text-[#4B6A4A] transition-colors"
              style={{ fontSize: '10px', letterSpacing: '0.2em' }}
            >
              <ShoppingCart size={18} />
              <span>Cart</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-espresso"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-40 bg-cream/95 backdrop-blur-xl"
            style={{ borderBottom: '1px solid rgba(42,34,25,0.08)' }}
          >
            <nav className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-nav text-espresso/70 hover:text-espresso transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {isLoggedIn ? (
                <>
                  {user?.avatar && (
                    <div className="flex items-center gap-3 py-2">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-espresso">{user?.name}</p>
                        <p className="text-xs text-secondary/60">{user?.email}</p>
                      </div>
                    </div>
                  )}
                  <Link to="/dashboard" className="text-nav text-espresso/70 hover:text-espresso transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-nav text-left text-espresso/40">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthModalOpen(true);
                      setMobileOpen(false);
                    }}
                    className="text-nav text-espresso/70 hover:text-espresso transition-colors text-left"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalOpen(true);
                      setMobileOpen(false);
                    }}
                    className="text-nav bg-gold text-espresso px-4 py-2 rounded-full text-center"
                  >
                    Sign Up
                  </button>
                </>
              )}

              <Link
                to="/consultation"
                className="text-nav bg-[#4B6A4A] text-white px-6 py-2.5 rounded-full text-center hover:bg-[#2A2219] transition-all duration-300 w-fit"
                style={{ fontSize: '10px', letterSpacing: '0.2em' }}
              >
                Book a Session
              </Link>

              <Link
                to="/cart"
                className="flex items-center gap-2 text-nav text-[#2A2219] hover:text-[#4B6A4A] transition-colors py-2"
                style={{ fontSize: '10px', letterSpacing: '0.2em' }}
              >
                <ShoppingCart size={18} />
                <span>Cart</span>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Auth Modal */}
      <GoogleAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onSuccess={handleAuthSuccess} />
    </>
  );
}
