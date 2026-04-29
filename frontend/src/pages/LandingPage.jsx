import { motion } from 'framer-motion';
import { useRef } from 'react';

const LandingPage = () => {
  const videoRef = useRef(null);

  return (
    <main className="relative min-h-screen font-opensans overflow-hidden">
      {/* Fixed Background with Blue Tint */}
      <div className="fixed inset-0 -z-50">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/assets/sea-bg.jpg")',
            filter: 'blur(8px) brightness(0.7)'
          }}
        />
        <div className="absolute inset-0 bg-bluebird/40" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 md:px-16 py-32">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Circular Profile Image with SVG Text Path */}
          <div className="relative mb-16">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative mx-auto w-80 h-80 rounded-full overflow-hidden border-8 border-white/20 bg-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/assets/profile.jpg"
                alt="Skylar - Embracing Higher Self"
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Circular Text SVG */}
            <svg className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-10 w-96 h-96" viewBox="0 0 400 400">
              <defs>
                <path
                  id="textCircle"
                  d="M 200, 200
                     m -150, 0
                     a 150,150 0 1,1 300,0
                     a 150,150 0 1,1 -300,0"
                />
              </defs>
              <text className="fill-[#FFE4A8] font-braven text-xl" dominantBaseline="middle" textAnchor="middle">
                <textPath href="#textCircle" startOffset="50%">
                  I'm Skylar, a teacher of quantum manifestation • Embracing Higher Self • 
                </textPath>
              </text>
            </svg>
          </div>

          {/* Hero Content */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-braven font-bold text-white mb-8">
              Embracing <span className="text-miel">Higher</span> Self
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto mb-12">
              Where quantum physics meets spiritual mastery to help you manifest your highest reality
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-miel text-espresso px-12 py-4 rounded-full text-lg font-semibold shadow-2xl hover:bg-butter transition-colors"
            >
              Begin Your Journey
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Wavy Text Break Section */}
      <section className="py-24 bg-bluebird/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <motion.div
            initial={{ x: 100 }}
            whileInView={{ x: -100 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
            viewport={{ once: true }}
            className="whitespace-nowrap"
          >
            <svg className="inline-block w-8 h-8 mr-4" viewBox="0 0 100 100">
              <path
                d="M10,50 Q25,25 50,50 T90,50"
                fill="none"
                stroke="miel"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-2xl md:text-4xl font-braven text-miel italic">
              This space is for the visionaries, the believers, the dreamers ready to quantum leap • 
            </span>
            <svg className="inline-block w-8 h-8 ml-4" viewBox="0 0 100 100">
              <path
                d="M10,50 Q25,75 50,50 T90,50"
                fill="none"
                stroke="miel"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Information Video Section */}
      <section className="py-32 bg-azurea/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-8 md:px-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-braven text-[#2A2219] mb-12"
          >
            What is Embracing Higher Self?
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="aspect-video rounded-3xl overflow-hidden border-2 border-miel bg-white/10 backdrop-blur-sm p-4"
          >
            <iframe
              ref={videoRef}
              title="Embracing Higher Self Introduction"
              src="https://www.youtube.com/embed/eqyTJE5PjWk"
              className="w-full h-full rounded-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </div>
      </section>

      {/* Meet Your Guides Section */}
      <section className="py-32 bg-bluebird/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-braven text-white text-center mb-20"
          >
            Meet Your Guides
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Guide */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-miel mb-8">
                <img
                  src="/assets/guide1.jpg"
                  alt="Quantum Manifestation Guide"
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-white"
              >
                <h3 className="text-2xl font-braven text-miel mb-4">Quantum Alchemist</h3>
                <p className="text-lg font-light">
                  Specializing in bridging quantum physics with ancient spiritual practices to help you manifest reality
                </p>
              </motion.div>
            </motion.div>

            {/* Right Guide */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-miel mb-8">
                <img
                  src="/assets/guide2.jpg"
                  alt="Spiritual Integration Guide"
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                viewport={{ once: true }}
                className="text-white"
              >
                <h3 className="text-2xl font-braven text-miel mb-4">Soul Integration Specialist</h3>
                <p className="text-lg font-light">
                  Helping you embody your highest self through practical spiritual techniques and conscious creation
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Manifestation Gallery Section */}
      <section className="py-32 bg-[#FDFCF9] backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-boska text-[#2A2219] text-center mb-16"
          >
            Manifestation Explained
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: item * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl overflow-hidden shadow-luxury-xl border border-[#9DB2A2]/20"
              >
                <div className="aspect-video bg-gradient-to-br from-bluebird to-azurea flex items-center justify-center">
                  <div className="w-16 h-16 bg-miel rounded-full flex items-center justify-center">
                    <span className="text-2xl font-boska text-[#2A2219]">▶</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-boska text-[#2A2219] mb-3">
                    Quantum Manifestation Principle {item}
                  </h3>
                  <p className="text-[#2A2219]/70 font-light">
                    Learn how to harness quantum principles to consciously create your reality and align with your highest timeline
                  </p>
                  <button className="mt-4 text-sage hover:text-[#4B6A4A] transition-colors font-semibold">
                    Watch Now →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;