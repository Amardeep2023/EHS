import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'Academy', to: '/academy' },
  { label: 'Resources', to: '/free-resources' },
  { label: 'Stories', to: '/success-stories' },
  { label: 'Shop', to: '/shop' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-500 ${
          scrolled ? 'bg-cream/90 backdrop-blur-xl shadow-luxury' : 'bg-cream/80 backdrop-blur-xl'
        } luxury-border-b`}
        style={{ borderBottom: '1px solid rgba(42,34,25,0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-boska italic font-bold text-xl text-espresso tracking-tight">
            EmbracingHigherSelf
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-nav transition-colors duration-200 ${
                  location.pathname === link.to
                    ? 'text-gold'
                    : 'text-espresso/60 hover:text-espresso'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-nav text-espresso/60 hover:text-espresso transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-nav text-espresso/40 hover:text-espresso/70 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : null}
            <Link
              to="/consultation"
              className="text-nav bg-espresso text-cream px-5 py-2.5 rounded-full hover:bg-gold transition-all duration-300"
              style={{ fontSize: '10px', letterSpacing: '0.2em' }}
            >
              Inquiry
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
              {user && (
                <>
                  <Link to="/dashboard" className="text-nav text-espresso/70 hover:text-espresso transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="text-nav text-left text-espresso/40">
                    Logout
                  </button>
                </>
              )}
              <Link
                to="/consultation"
                className="text-nav bg-espresso text-cream px-5 py-2.5 rounded-full text-center hover:bg-gold transition-all duration-300 w-fit"
                style={{ fontSize: '10px', letterSpacing: '0.2em' }}
              >
                Inquiry
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
