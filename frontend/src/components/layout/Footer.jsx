import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin } from 'lucide-react';

const navCol1 = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Success Stories', to: '/success-stories' },
  { label: 'Free Resources', to: '/free-resources' },
];

const navCol2 = [
  { label: 'The Academy', to: '/academy' },
  { label: 'Shop', to: '/shop' },
  { label: 'Consultation', to: '/consultation' },
  { label: 'Dashboard', to: '/dashboard' },
];

export default function Footer() {
  return (
    <footer className="bg-espresso text-cream">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-12 gap-8 mb-16">
          {/* Logo */}
          <div className="col-span-12 md:col-span-4">
            <div className="font-boska italic font-bold text-4xl text-cream mb-4 leading-tight">
              Embracing<br />Higher Self
            </div>
            <p className="text-cream/50 text-sm leading-relaxed max-w-xs">
              A sanctuary for manifestation, growth, and conscious living.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-cream/40 hover:text-gold transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-cream/40 hover:text-gold transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-cream/40 hover:text-gold transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          <div className="col-span-6 md:col-span-2">
            <p className="text-label text-gold mb-6">Explore</p>
            <ul className="space-y-3">
              {navCol1.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-cream/40 hover:text-cream transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="text-label text-gold mb-6">Learn</p>
            <ul className="space-y-3">
              {navCol2.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-cream/40 hover:text-cream transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-12 md:col-span-4">
            <p className="text-label text-gold mb-4">Stay Connected</p>
            <div
              className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <p className="text-sm text-cream/60 mb-4">
                Receive insights, new resources, and transformational guidance.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/10 text-cream placeholder-cream/30 text-sm rounded-xl px-4 py-2.5 outline-none border border-white/10 focus:border-gold/50 transition-colors"
                />
                <button className="bg-gold text-espresso text-nav px-4 py-2.5 rounded-xl hover:bg-cream transition-colors whitespace-nowrap">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-cream/25 text-xs tracking-widest2">
            © {new Date().getFullYear()} EMBRACINGHIGHERSELF. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-cream/25 text-xs tracking-widest2 hover:text-cream/50 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-cream/25 text-xs tracking-widest2 hover:text-cream/50 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
