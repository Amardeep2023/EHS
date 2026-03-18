import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Star, BookOpen, ShoppingBag, Calendar, ChevronDown } from 'lucide-react';
import EchoText from '../components/common/EchoText';
import LuxuryCard from '../components/common/LuxuryCard';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
};

function Section({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const featuredCourses = [
  {
    label: 'Foundation',
    title: 'Manifestation Mastery',
    description: 'A complete 8-week journey into the science and art of conscious creation.',
    price: '$197',
    img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=60',
  },
  {
    label: 'Advanced',
    title: 'Quantum Alignment',
    description: 'Elevate your vibration and align with your highest timeline.',
    price: '$297',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60',
  },
  {
    label: 'Deep Dive',
    title: 'Soul Purpose Blueprint',
    description: 'Uncover and embody your unique soul mission with clarity.',
    price: '$347',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=60',
  },
];

const testimonials = [
  {
    name: 'Amara K.',
    story: 'Within 3 months of practicing these techniques, I manifested my dream job and a new home. The guidance here transformed every area of my life.',
    rating: 5,
  },
  {
    name: 'Sophia R.',
    story: 'The academy courses gave me tools I use daily. My mindset shifted completely — I feel aligned and at peace for the first time.',
    rating: 5,
  },
  {
    name: 'Jasmine T.',
    story: 'The personal consultation was a turning point. I was heard, guided, and given a roadmap that actually works.',
    rating: 5,
  },
];

const process = [
  { step: '01', title: 'Discover', text: 'Explore free resources and begin your journey at your own pace.' },
  { step: '02', title: 'Learn', text: 'Enroll in curated courses designed to shift your reality from the inside out.' },
  { step: '03', title: 'Integrate', text: 'Apply proven practices with digital tools, journals, and workbooks.' },
  { step: '04', title: 'Transform', text: 'Embody your highest self and create the life you truly desire.' },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-label text-gold mb-6"
        >
          Applied Intelligence for the Soul
        </motion.p>

        <div className="relative flex justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <EchoText text="Embrace" />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="max-w-md text-center text-secondary leading-relaxed mb-10"
        >
          Your sanctuary for manifestation, conscious growth, and living in alignment with your highest self.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Link
            to="/academy"
            className="flex items-center gap-2 bg-espresso text-cream px-7 py-3.5 rounded-full text-sm font-medium hover:bg-gold hover:text-espresso transition-all duration-300"
          >
            Explore Courses <ArrowUpRight size={16} />
          </Link>
          <Link
            to="/free-resources"
            className="flex items-center gap-2 luxury-border bg-transparent text-espresso px-7 py-3.5 rounded-full text-sm font-medium hover:bg-espresso hover:text-cream transition-all duration-300"
          >
            Free Resources
          </Link>
          <Link
            to="/shop"
            className="flex items-center gap-2 luxury-border bg-transparent text-espresso px-7 py-3.5 rounded-full text-sm font-medium hover:bg-espresso hover:text-cream transition-all duration-300"
          >
            Shop Now
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-10 flex items-center gap-3"
        >
          <div className="w-px h-16 bg-espresso/20" />
          <span className="text-label text-espresso/40" style={{ writingMode: 'vertical-rl', fontSize: '10px' }}>
            SCROLL
          </span>
        </motion.div>
      </section>

      {/* ── Process / How It Works ── */}
      <section className="py-28 bg-gradient-section">
        <div className="max-w-7xl mx-auto px-6">
          <Section>
            <motion.p variants={fadeUp} className="text-label text-gold text-center mb-3">
              How It Works
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-boska text-5xl text-center text-espresso mb-20"
              style={{ fontFamily: 'Boska, Georgia, serif' }}
            >
              Your Path to Transformation
            </motion.h2>
          </Section>

          <div className="relative">
            {/* Connecting line */}
            <div
              className="hidden md:block absolute top-7 left-0 right-0 h-px"
              style={{ background: 'rgba(42,34,25,0.15)', top: '28px' }}
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {process.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  whileHover={{ backgroundColor: '#ffffff', boxShadow: '0 20px 40px rgba(42,34,25,0.06)' }}
                  className="rounded-luxury p-8 transition-all duration-300"
                  style={{ background: 'rgba(253,252,249,0.5)' }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-6 luxury-border"
                    style={{ background: '#faf8f3' }}
                  >
                    <span
                      className="font-boska text-lg text-gold"
                      style={{ fontFamily: 'Boska, Georgia, serif' }}
                    >
                      {step.step}
                    </span>
                  </div>
                  <h3
                    className="font-boska text-2xl text-espresso mb-3"
                    style={{ fontFamily: 'Boska, Georgia, serif' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-secondary leading-relaxed">{step.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Free Content ── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <Section>
            <motion.p variants={fadeUp} className="text-label text-gold mb-3">
              Free Resources
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-boska text-5xl text-espresso mb-4"
              style={{ fontFamily: 'Boska, Georgia, serif' }}
            >
              Begin Your Journey — Free
            </motion.h2>
            <motion.p variants={fadeUp} className="text-secondary mb-12 max-w-xl">
              Access introductory content, beginner guides, and transformational practices at no cost.
            </motion.p>
          </Section>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { title: 'Manifestation Starter Guide', type: 'PDF', tag: 'Beginner' },
              { title: 'Morning Alignment Ritual', type: 'Video', tag: 'Practice' },
              { title: '7-Day Mindset Reset', type: 'PDF', tag: 'Challenge' },
            ].map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="p-8 rounded-luxury luxury-border bg-white/60 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-label text-gold">{r.tag}</span>
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: r.type === 'PDF' ? 'rgba(212,165,116,0.15)' : 'rgba(42,34,25,0.06)', color: '#d4a574' }}
                  >
                    {r.type}
                  </span>
                </div>
                <h4
                  className="font-boska text-xl text-espresso mb-3"
                  style={{ fontFamily: 'Boska, Georgia, serif' }}
                >
                  {r.title}
                </h4>
                <div className="flex items-center gap-1 text-gold text-sm font-medium group-hover:gap-2 transition-all">
                  Access Free <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
          <Link
            to="/free-resources"
            className="text-nav text-espresso/60 hover:text-espresso transition-colors flex items-center gap-2"
          >
            View All Resources <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section className="py-28 bg-gradient-section">
        <div className="max-w-7xl mx-auto px-6">
          <Section>
            <motion.p variants={fadeUp} className="text-label text-gold mb-3">
              The Academy
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-boska text-5xl text-espresso mb-16"
              style={{ fontFamily: 'Boska, Georgia, serif' }}
            >
              Courses for Deep Transformation
            </motion.h2>
          </Section>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {featuredCourses.map((course, i) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group rounded-luxury overflow-hidden luxury-border bg-white cursor-pointer"
                whileHover={{ y: -6 }}
              >
                <div className="overflow-hidden aspect-video">
                  <img
                    src={course.img}
                    alt={course.title}
                    className="w-full h-full object-cover img-sepia"
                  />
                </div>
                <div className="p-8">
                  <p className="text-label text-gold mb-3">{course.label}</p>
                  <h3
                    className="font-boska text-2xl text-espresso mb-2"
                    style={{ fontFamily: 'Boska, Georgia, serif' }}
                  >
                    {course.title}
                  </h3>
                  <p className="text-sm text-secondary mb-6 leading-relaxed">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-boska text-xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                      {course.price}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gold font-medium group-hover:gap-2 transition-all">
                      Enroll <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <Link
            to="/academy"
            className="text-nav text-espresso/60 hover:text-espresso transition-colors flex items-center gap-2"
          >
            Browse All Courses <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <Section>
            <motion.p variants={fadeUp} className="text-label text-gold mb-3">
              Success Stories
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-boska text-5xl text-espresso mb-16"
              style={{ fontFamily: 'Boska, Georgia, serif' }}
            >
              Lives Transformed
            </motion.h2>
          </Section>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-8 rounded-luxury luxury-border bg-white/60"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={13} fill="#d4a574" className="text-gold" />
                  ))}
                </div>
                <p className="text-secondary text-sm leading-relaxed mb-6 italic">"{t.story}"</p>
                <p className="font-boska text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                  — {t.name}
                </p>
              </motion.div>
            ))}
          </div>
          <Link
            to="/success-stories"
            className="text-nav text-espresso/60 hover:text-espresso transition-colors flex items-center gap-2"
          >
            Read More Stories <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Consultation CTA ── */}
      <section className="py-28 bg-espresso">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-label text-gold mb-4"
          >
            Personal Consultation
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-boska text-5xl md:text-6xl text-cream mb-6"
            style={{ fontFamily: 'Boska, Georgia, serif' }}
          >
            Work With Me, One-on-One
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-cream/50 mb-10 leading-relaxed"
          >
            Experience a deeply personalised session tailored to your unique journey, challenges, and highest aspirations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/consultation"
              className="inline-flex items-center gap-2 bg-gold text-espresso px-8 py-4 rounded-full font-medium hover:bg-cream transition-all duration-300"
            >
              Book a Session <Calendar size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
