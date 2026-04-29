import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Eye, Star } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
};

function AnimSection({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

const values = [
  { icon: Heart, title: 'Authenticity', text: 'We believe transformation begins with radical honesty about where you are and who you truly desire to become.' },
  { icon: Eye, title: 'Clarity', text: 'Through proven practices, we help you cut through the noise and see your path forward with crystal clarity.' },
  { icon: Star, title: 'Abundance', text: 'Abundance is your natural state. Our mission is to help you remember and reclaim that truth.' },
];

export default function About() {
  return (
    <main className="pt-20 overflow-hidden">
      {/* Hero */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimSection>
            <p className="text-label text-gold mb-4">Our Story</p>
            <h1
              className="font-boska text-6xl md:text-7xl text-espresso mb-8 leading-tight"
              style={{ fontFamily: 'Boska, Georgia, serif', letterSpacing: '-0.02em' }}
            >
              Born from a Deep Desire to Awaken
            </h1>
            <p className="text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
              EmbracingHigherSelf was created as a response to a world that often teaches us to shrink, doubt, and settle — when in truth, we are capable of so much more.
            </p>
          </AnimSection>
        </div>
      </section>

      {/* Founder story */}
      <section className="py-20 bg-gradient-section">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <AnimSection>
            <div className="overflow-hidden rounded-luxury-lg">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60"
                alt="Founder"
                className="w-full h-[500px] object-cover img-sepia"
              />
            </div>
          </AnimSection>
          <AnimSection>
            <p className="text-label text-gold mb-4">Founder's Journey</p>
            <h2
              className="font-boska text-4xl text-espresso mb-6"
              style={{ fontFamily: 'Boska, Georgia, serif' }}
            >
              From Searching to Becoming
            </h2>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                After years of searching for meaning, purpose, and genuine transformation, our founder discovered the profound power of intentional manifestation — not as a mystical concept, but as a grounded, practical science of the mind and soul.
              </p>
              <p>
                What began as a personal practice became a calling. A calling to share these tools with every soul who feels the quiet pull toward something greater — toward the life they know, deep down, they were meant to live.
              </p>
              <p>
                EmbracingHigherSelf is the culmination of that journey: a thoughtfully crafted platform where ancient wisdom meets modern practice, and where every individual is met exactly where they are.
              </p>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto my-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <AnimSection>
              <div className="p-16 rounded-luxury bg-espresso/80 text-cream">
                <p className="text-label text-gold mb-4">Our Mission</p>
                <h3
                  className="font-boska text-4xl mb-6"
                  style={{ fontFamily: 'Boska, Georgia, serif' }}
                >
                  Empower Every Soul
                </h3>
                <p className="text-cream/80 text-lg font-semibold leading-relaxed">
                  To provide every person with the knowledge, tools, and community they need to step fully into their highest self — unapologetically, powerfully, and with unwavering clarity.
                </p>
              </div>
            </AnimSection>
            <AnimSection>
              <div className="p-12 rounded-luxury luxury-border bg-white/80">
                <p className="text-label text-gold mb-4">Our Vision</p>
                <h3
                  className="font-boska text-4xl text-espresso mb-6"
                  style={{ fontFamily: 'Boska, Georgia, serif' }}
                >
                  A World Awakened
                </h3>
                <p className="text-espresso text-lg font-semibold  leading-relaxed">
                  We envision a world where every human being lives in conscious alignment with their deepest desires — where abundance, purpose, and joy are not exceptions but the lived norm.
                </p>
              </div>
            </AnimSection>
          </div>

          {/* Philosophy */}
          <AnimSection className="text-center mb-20">
            <p className="text-label text-gold  mb-4">Our Philosophy</p>
            <h2
              className="font-boska text-5xl text-espresso mb-6"
              style={{ fontFamily: 'Boska, Georgia, serif' }}
            >
              The Core Beliefs We Build Upon
            </h2>
          </AnimSection>

          <div className="grid md:grid-cols-3 gap-6  ">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -8, backgroundColor: '#ffffff', boxShadow: '0 25px 50px rgba(42,34,25,0.05)' }}
                className="p-12 rounded-luxury luxury-border cursor-default transition-all duration-300"
                style={{ background: '#E3F2FD', opacity: '0.4' }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                  style={{ background: '#2a2219' }}
                >
                  <v.icon size={22} color="#d4a574" />
                </div>
                <h3
                  className="font-boska text-3xl text-espresso mb-3"
                  style={{ fontFamily: 'Boska, Georgia, serif' }}
                >
                  {v.title}
                </h3>
                <p className="text-lg font-semibold text-secondary leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
