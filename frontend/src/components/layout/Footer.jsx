import { Link } from 'react-router-dom';
import { Instagram, Youtube, Mail } from 'lucide-react';
import logoehs from '../../assets/logoehs.png';

export default function Footer() {
  return (
    <footer className="pt-32 pb-12 px-6 bg-[#E3F2FD]/80 backdrop-blur-md border-t border-[#3E2928]/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-1">
            <div className="w-16 h-16 rounded-full border border-[#3E2928] flex items-center justify-center mb-8">
              <span className="font-serif text-2xl font-bold text-[#3E2928]"> <img 
                              src={logoehs} 
                              alt="Embracing Higher Self Logo" 
                              className="w-full h-full object-cover rounded-full"
                            /></span>
            </div>
            <p className="text-[#3E2928]/60 leading-relaxed text-sm">
              Curating the world's most elegant manifestation experiences. Elevate your presence through the art of conscious being.
            </p>
          </div>
          <div className="space-y-8">
            <h4 className="text-[#3E2928] uppercase text-xs tracking-[0.3em] font-bold">The Collection</h4>
            <ul className="space-y-4 text-xs tracking-widest text-[#3E2928]/50 uppercase">
              <li><Link to="/about" className="hover:text-[#D4AF37] transition-all">About Us</Link></li>
              <li><Link to="/academy" className="hover:text-[#D4AF37] transition-all">Courses</Link></li>
              <li><Link to="/success-stories" className="hover:text-[#D4AF37] transition-all">Testimonials</Link></li>
              <li><Link to="/free-resources" className="hover:text-[#D4AF37] transition-all">Community</Link></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-[#3E2928] uppercase text-xs tracking-[0.3em] font-bold">Essential</h4>
            <ul className="space-y-4 text-xs tracking-widest text-[#3E2928]/50 uppercase">
              <li><Link to="/about" className="hover:text-[#D4AF37] transition-all">Privacy</Link></li>
              <li><Link to="/about" className="hover:text-[#D4AF37] transition-all">Terms</Link></li>
              <li><Link to="/consultation" className="hover:text-[#D4AF37] transition-all">Connect</Link></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-[#3E2928] uppercase text-xs tracking-[0.3em] font-bold">Frequency</h4>
            <div className="flex space-x-6">
              <a href="#" className="text-[#3E2928]/40 hover:text-[#D4AF37] transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-[#3E2928]/40 hover:text-[#D4AF37] transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="#" className="text-[#3E2928]/40 hover:text-[#D4AF37] transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-[#3E2928]/5 pt-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#3E2928]/40 mb-4 md:mb-0">
            © {new Date().getFullYear()} Embracing Higher Self. The Gold Standard of Being.
          </p>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#3E2928]/40">
            Designed for the Elevated Soul.
          </p>
        </div>
      </div>
    </footer>
  );
}
