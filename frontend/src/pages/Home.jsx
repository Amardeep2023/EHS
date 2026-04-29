import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/layout/Navbar";
import { 
  Instagram, 
  Youtube, 
  ArrowUpRight, 
  X, 
  Play, 
  Pause, 
  ShoppingCart, 
  Menu, 
  Sun, 
  ArrowDown, 
  Mail 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoehs from '../assets/logoehs.png';

const manifestationVideos = [
  {
    id: 'video-1',
    title: 'Quantum Jumping 101',
    desc: 'How to shift your vibration to align with your highest timeline instantly.',
    img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=60',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-background-9130-large.mp4'
  },
  {
    id: 'video-2',
    title: 'The Law of Assumption',
    desc: 'Mastering the feeling of the wish fulfilled to collapse time.',
    img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=60',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-at-sunset-4231-large.mp4'
  },
  {
    id: 'video-3',
    title: 'Manifesting Abundance',
    desc: 'Release scarcity blocks and open the portal to infinite supply.',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=60',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-white-sand-beach-and-palm-trees-1564-large.mp4'
  },
];

export default function Home() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = (e) => {
    e.stopPropagation();
    const videoElement = document.getElementById('reel-video');
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen relative font-satoshi bg-white/10 text-[#3E2928] overflow-x-hidden">
      {/* Global background is now in App.jsx */}

      {/* Navigation */}
      
      {/* <nav className="fixed top-0 w-full z-50 bg-[#E3F2FD]/80 backdrop-blur-md border-b border-[#3E2928]/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center">
              <span className="font-serif text-lg font-bold text-[#D4AF37]">EHS</span>
            </div>
            <span className="font-serif text-xl tracking-tight hidden md:block text-[#3E2928]">Embracing Higher Self</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-[10px] lg:text-xs uppercase tracking-[0.2em] font-medium">
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <Link to="/about" className="hover:text-[#D4AF37] transition-colors">About Us</Link>
            <Link to="/academy" className="hover:text-[#D4AF37] transition-colors">Courses</Link>
            <Link to="/testimonials" className="hover:text-[#D4AF37] transition-colors">Testimonials</Link>
            <Link to="/community" className="hover:text-[#D4AF37] transition-colors">Community</Link>
            <div className="flex items-center space-x-3 ml-2 lg:ml-4">
              <a href="#" className="w-9 h-9 flex items-center justify-center border border-[#3E2928]/30 text-[#3E2928] rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all">
                <ShoppingCart className="w-4 h-4" />
              </a>
              <Link to="/consultation" className="px-4 py-2 border border-[#3E2928]/30 text-[#3E2928] rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all whitespace-nowrap">Book a Session</Link>
              <Link to="/academy" className="px-5 py-2 bg-[#3E2928] text-white rounded-full hover:bg-[#D4AF37] transition-all whitespace-nowrap">Join Us</Link>
            </div>
          </div>
          <button className="md:hidden text-[#3E2928]">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="relative pt-10 pb-32 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#E3F2FD]/50 via-transparent to-[#E3F2FD]"></div>
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#B4D4E8] blur-[150px] rounded-full opacity-30"></div>
          <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-[#3E2928] blur-[180px] rounded-full opacity-40"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center w-full max-w-7xl"
        >
          <div className="relative w-96 h-96 md:w-96 md:h-96 mb-10 warm-glow">
            <div className="w-full h-full rounded-full  overflow-hidden p-1  backdrop-blur-sm">
              <img 
                src={logoehs} 
                alt="Embracing Higher Self Logo" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {/* <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/40 backdrop-blur-md rounded-full border border-[#3E2928]/20 flex items-center justify-center shadow-lg">
              <Sun className="text-[#D4AF37] w-6 h-6" />
            </div> */}
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight text-[#3E2928] mb-6">
            Embracing Higher Self
          </h1>

          <p className="max-w-xl text-sm md:text-base text-[#3E2928]/70 uppercase tracking-[0.4em] mb-12">
            Discover the light within your signature essence
          </p>

          <p className="max-w-2xl text-lg md:text-xl text-[#3E2928]/80 leading-relaxed mb-12 font-light italic">
            A sun-drenched sanctuary for seekers of the sublime. <br className="hidden md:block"/>
            Journey through the golden hour of your soul to manifest your destiny.
          </p>

          <div className="flex flex-col items-center space-y-6">
            <Link to="/academy" className="px-14 py-5 bg-[#3E2928] text-white rounded-full font-bold tracking-[0.2em] uppercase text-sm hover:scale-105 transition-transform shadow-xl">
              Enter the Sanctuary
            </Link>
            <Link to="/about" className="text-xs uppercase tracking-widest border-b border-[#3E2928]/20 pb-1 hover:border-[#D4AF37] transition-all">
              Learn More <ArrowUpRight className="ml-1 inline-block w-3 h-3" />
            </Link>
          </div>
          
          <div className="mt-24">
            <ArrowDown className="w-6 h-6 animate-bounce text-[#3E2928]/30" />
          </div>
        </motion.div>
      </section>

      {/* Ticker Section */}
      <div className="py-10 bg-[#3E2928]/20 border-y border-[#3E2928]/20 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-scroll">
          {[1, 2].map((i) => (
            <span key={i}>
              <span className="font-serif text-2xl mx-12 italic opacity-40">Sacred Alignment</span>
              <span className="mx-12 font-bold opacity-10">*</span>
              <span className="font-serif text-2xl mx-12 italic opacity-40">Divine Essence</span>
              <span className="mx-12 font-bold opacity-10">*</span>
              <span className="font-serif text-2xl mx-12 italic opacity-40">Manifestation Mastery</span>
              <span className="mx-12 font-bold opacity-10">*</span>
              <span className="font-serif text-2xl mx-12 italic opacity-40">Soul Evolution</span>
              <span className="mx-12 font-bold opacity-10">*</span>
            </span>
          ))}
        </div>
      </div>

      {/* The Essence Section */}
      <section className="py-32 px-6 bg-[#E3F2FD]/80 backdrop-blur-md relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1">
            <div className="oval-frame bg-[#B4D4E8]/20 p-4 border border-[#B4D4E8]/30">
              {/* <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" 
                alt="Spiritual practice" 
                className="w-full h-full object-cover rounded-[999px]"
              /> */}
              <video src="/assets/EHS.mp4" autoPlay loop muted playsInline
              className='w-full h-full object-cover rounded-[999px]'
              ></video>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <div className="text-[#D4AF37] text-xs uppercase tracking-[0.5em] font-bold">The Philosophy</div>
            <h2 className="font-serif text-4xl md:text-6xl text-[#3E2928] leading-tight">
              What is Embracing<br/><span className="italic font-light">Higher Self?</span>
            </h2>
            <p className="text-2xl text-[#3E2928]/70 leading-relaxed font-light">
              It is more than a platform—it is a warm embrace for your subconscious. We blend editorial elegance with ancient frequency to help you curate a life of pure resonance.
            </p>
            <div className="pt-4">
              <div className="h-px w-24 bg-[#D4AF37]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your Guides */}
    <section className="py-32 px-6  mx-auto bg-[#E3F2FD]/70 my-10 w-full ">
  <div className="flex flex-col items-center mb-24 bg-[#E3F2FD]/10 backdrop-blur-md rounded-2xl text-center p-5 border-white border-[2px]">
    <h2 className="font-serif text-5xl md:text-7xl text-[#3E2928] mb-6">
      Meet Your <span className="text-[#D4AF37] italic">Guides</span>
    </h2>
    <p className="max-w-lg text-[#3E2928]/80 uppercase tracking-[0.4em] text-md">Artisans of the soul's signature scent</p>
  </div>
  
  <div className="grid md:grid-cols-2 gap-12 lg:gap-24 lg:flex lg:justify-center ">
    <motion.div 
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer"
    >
      <div className="max-w-lg h-[4/3] aspect-[9/10] rounded-[80px] overflow-hidden shadow-2xl relative">
        <img 
          src="https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&q=80&w=800" 
          alt="Clara" 
          className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3E2928]/30 via-transparent to-transparent"></div>
      </div>
      <div className="text-center space-y-4 mt-6">
        <h3 className="font-serif text-3xl text-[#3E2928]">Clara Nightingale</h3>
        <p className="text-sm uppercase tracking-widest text-[#D4AF37]">Master of Frequency</p>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[#3E2928]/90 font-bold text-xl leading-relaxed max-w-lg mx-auto"
        >
          With over two decades of aromatic alchemy, Clara harmonizes ancient wisdom with modern frequency science. Her intuitive approach unlocks the vibrational signature that resonates uniquely with your soul's essence.
        </motion.p>
      </div>
    </motion.div>
    
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer"
    >
      <div className="max-w-lg h-4/3 aspect-[9/10] rounded-[80px] overflow-hidden shadow-2xl relative">
        <img 
          src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800" 
          alt="Elena" 
          className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3E2928]/30 via-transparent to-transparent"></div>
      </div>
      <div className="text-center font-bold space-y-4 mt-6">
        <h3 className="font-serif text-3xl text-[#3E2928]">Elena Solstice</h3>
        <p className="text-sm uppercase tracking-widest text-[#D4AF37]">Wisdom Keeper</p>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[#3E2928]/90 text-xl leading-relaxed max-w-lg mx-auto"
        >
          A guardian of forgotten botanical secrets, Elena weaves stories through scent. Her ceremonial approach transforms perfume into meditation, guiding you through a sensory journey of self-discovery and ancestral connection.
        </motion.p>
      </div>
    </motion.div>
  </div>
</section>

      {/* Instagram Shorts / Digital Gallery (Reusing manifestationVideos) */}
      <section className="py-32 flex items-center px-6 bg-[#3E2928]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row  justify-between  mb-16">
            <div className="space-y-4">
              <div className="w-12 h-px bg-[#3E2928]"></div>
              <h3 className="font-serif text-4xl text-[#3E2928]">The Digital Gallery</h3>
            </div>
            <a href="#" className="text-[#3E2928] text-xs uppercase tracking-[0.3em] font-bold border-b border-[#3E2928]/10 pb-2 hover:text-[#D4AF37] transition-colors mt-6 md:mt-0">
              Follow the journey @embracinghigher
            </a>
          </div>
          
          <div className="grid grid-cols-1  md:grid-cols-3 gap-8 md:flex md:gap-10">
            {manifestationVideos.map((video, index) => (
              <motion.div 
                key={video.id}
                whileHover={{ scale: 1.05 }}
                className={`aspect-[9/16] rounded-[150px] overflow-hidden relative group cursor-pointer border-8 border-[#3E2928] shadow-xl `}
                onClick={() => setActiveVideo(video)}
              >
                <img 
                  src={video.img} 
                  className="w-full h-full object-cover transition-transform duration-1000" 
                  alt={video.title} 
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white fill-white" />
                </div>
                <div className="absolute bottom-12 left-0 right-0 text-center px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <h4 className="text-white font-serif text-xl mb-1">{video.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-12 px-6 bg-[#E3F2FD]/80 backdrop-blur-md border-t border-[#3E2928]/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-1">
              <div className="w-16 h-16 rounded-full border border-[#3E2928] flex items-center justify-center mb-8">
                <span className="font-serif text-2xl font-bold text-[#3E2928]">EHS</span>
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
                <li><Link to="/testimonials" className="hover:text-[#D4AF37] transition-all">Testimonials</Link></li>
                <li><Link to="/community" className="hover:text-[#D4AF37] transition-all">Community</Link></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-[#3E2928] uppercase text-xs tracking-[0.3em] font-bold">Essential</h4>
              <ul className="space-y-4 text-xs tracking-widest text-[#3E2928]/50 uppercase">
                <li><Link to="/privacy" className="hover:text-[#D4AF37] transition-all">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-[#D4AF37] transition-all">Terms</Link></li>
                <li><Link to="/contact" className="hover:text-[#D4AF37] transition-all">Connect</Link></li>
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
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3E2928]/40 mb-4 md:mb-0">© 2024 Embracing Higher Self. The Gold Standard of Being.</p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#3E2928]/40">Designed for the Elevated Soul.</p>
          </div>
        </div>
      </footer>

      {/* Video Modal - Kept from original functionality */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
              onClick={() => setActiveVideo(null)}
            />
            <button 
              className="absolute top-8 right-8 z-[110] text-white/80 hover:text-white transition-colors"
              onClick={() => setActiveVideo(null)}
            >
              <X size={40} strokeWidth={1.5} />
            </button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[450px] aspect-[9/16] h-[90vh] rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border-4 border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                id="reel-video"
                src={activeVideo.videoUrl}
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
                onClick={togglePlay}
              />
              <div className="absolute inset-0 flex flex-col justify-between p-10 pointer-events-none">
                <div className="w-full flex justify-between items-start">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest">Featured Insight</span>
                  </div>
                </div>
                <div className="w-full pointer-events-auto">
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-serif font-bold text-white mb-4"
                  >
                    {activeVideo.title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/80 font-light text-lg mb-8"
                  >
                    {activeVideo.desc}
                  </motion.p>
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={togglePlay}
                      className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform"
                    >
                      {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>
                    <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ width: ["0%", "100%"] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="h-full bg-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
