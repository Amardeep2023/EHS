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
    <footer className="bg-[#FAF8F3] text-[#3B2C1A] font-opensans border-t border-white/30">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-12 gap-8 mb-16">
          {/* Logo */}
          <div className="col-span-12 md:col-span-4">
            <div className="font-braven italic font-bold text-4xl text-[#4B6A4A] mb-4 leading-tight">
              Embracing<br />Higher Self
            </div>
            <p className="text-[#3B2C1A]/70 text-sm leading-relaxed max-w-xs font-opensans">
              A sanctuary for manifestation, growth, and conscious living.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-[#4B6A4A]/60 hover:text-[#4B6A4A] transition-all hover:scale-110">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-[#4B6A4A]/60 hover:text-[#4B6A4A] transition-all hover:scale-110">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-[#4B6A4A]/60 hover:text-[#4B6A4A] transition-all hover:scale-110">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          <div className="col-span-6 md:col-span-2">
            <p className="text-label text-[#4B6A4A] mb-6 font-jakarta">Explore</p>
            <ul className="space-y-3">
              {navCol1.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-[#3B2C1A]/60 hover:text-[#3B2C1A] transition-colors font-opensans">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="text-label text-[#4B6A4A] mb-6 font-jakarta">Learn</p>
            <ul className="space-y-3">
              {navCol2.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-[#3B2C1A]/60 hover:text-[#3B2C1A] transition-colors font-opensans">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-12 md:col-span-4">
            <p className="text-label text-[#4B6A4A] mb-4 font-jakarta">Stay Connected</p>
            <div
              className="rounded-2xl p-6"
              style={{ background: 'rgba(75,106,74,0.05)', border: '1px solid rgba(75,106,74,0.1)' }}
            >
              <p className="text-sm text-[#3B2C1A]/70 mb-4 font-opensans">
                Receive insights, new resources, and transformational guidance.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/50 text-[#3B2C1A] placeholder-[#3B2C1A]/30 text-sm rounded-xl px-4 py-2.5 outline-none border border-[#4B6A4A]/10 focus:border-[#4B6A4A]/50 transition-colors font-opensans"
                />
                <button className="bg-[#4B6A4A] text-white text-nav px-4 py-2.5 rounded-xl hover:bg-[#3B2C1A] transition-colors whitespace-nowrap font-jakarta">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(75,106,74,0.08)' }}
        >
          <p className="text-[#3B2C1A]/40 text-xs tracking-widest2 font-jakarta">
            © {new Date().getFullYear()} EMBRACINGHIGHERSELF. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[#3B2C1A]/40 text-xs tracking-widest2 hover:text-[#3B2C1A]/60 transition-colors font-jakarta">
              Privacy Policy
            </a>
            <a href="#" className="text-[#3B2C1A]/40 text-xs tracking-widest2 hover:text-[#3B2C1A]/60 transition-colors font-jakarta">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
