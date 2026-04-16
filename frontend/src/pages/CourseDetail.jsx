import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Lock, ChevronDown, ArrowLeft } from 'lucide-react';

const coursesData = {
  'manifestation-mastery': {
    title: 'Manifestation Mastery',
    description:
      'An 8-week comprehensive journey into the science and art of conscious creation. Learn the foundational principles, advanced techniques, and practical tools to design your reality with intention and precision.',
    instructor: 'EmbracingHigherSelf Team',
    price: 197,
    duration: '8 weeks',
    lessons: 24,
    students: 412,
    img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=60',
    modules: [
      {
        title: 'Module 1: The Foundation of Conscious Creation',
        lessons: [
          { title: 'Welcome & Orientation', duration: '8 min', unlocked: true },
          { title: 'Understanding Your Creative Power', duration: '22 min', unlocked: true },
          { title: 'The Science Behind Manifestation', duration: '18 min', unlocked: true },
        ],
      },
      {
        title: 'Module 2: Clearing the Path',
        lessons: [
          { title: 'Identifying Limiting Beliefs', duration: '20 min', unlocked: true },
          { title: 'The Belief Reprogramming Method', duration: '25 min', unlocked: false },
          { title: 'Guided Practice: Root Clearing', duration: '14 min', unlocked: false },
        ],
      },
      {
        title: 'Module 3: Vibrational Alignment',
        lessons: [
          { title: 'What Is Frequency?', duration: '16 min', unlocked: false },
          { title: 'Raising Your Baseline Vibration', duration: '21 min', unlocked: false },
          { title: 'Daily Alignment Ritual', duration: '12 min', unlocked: false },
        ],
      },
    ],
  },
  'quantum-alignment': {
    title: 'Quantum Alignment',
    description:
      'Elevate your energetic frequency, dissolve limiting beliefs at the root, and align with your highest timeline with quantum techniques.',
    instructor: 'EmbracingHigherSelf Team',
    price: 297,
    duration: '6 weeks',
    lessons: 18,
    students: 287,
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60',
    modules: [
      {
        title: 'Module 1: Quantum Fundamentals',
        lessons: [
          { title: 'Introduction to Quantum Thinking', duration: '15 min', unlocked: true },
          { title: 'Entanglement & You', duration: '18 min', unlocked: true },
          { title: 'Superposition Mastery', duration: '20 min', unlocked: true },
        ],
      },
      {
        title: 'Module 2: Frequency Engineering',
        lessons: [
          { title: 'Measuring Your Frequency', duration: '16 min', unlocked: true },
          { title: 'Quantum Field Activation', duration: '22 min', unlocked: false },
          { title: 'Timeline Jumping Techniques', duration: '19 min', unlocked: false },
        ],
      },
      {
        title: 'Module 3: Advanced Integration',
        lessons: [
          { title: 'Living in Multiple Realities', duration: '21 min', unlocked: false },
          { title: 'Quantum Manifestation', duration: '25 min', unlocked: false },
        ],
      },
    ],
  },
  'soul-purpose-blueprint': {
    title: 'Soul Purpose Blueprint',
    description:
      'Uncover, clarify, and begin embodying your unique soul mission — with practical tools to bridge the gap between vision and lived reality.',
    instructor: 'EmbracingHigherSelf Team',
    price: 347,
    duration: '10 weeks',
    lessons: 30,
    students: 198,
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=60',
    modules: [
      {
        title: 'Module 1: Discovering Your Soul Blueprint',
        lessons: [
          { title: 'Your Soul\'s Journey', duration: '20 min', unlocked: true },
          { title: 'Decoding Your Numerology', duration: '18 min', unlocked: true },
          { title: 'Purpose Activation Ceremony', duration: '25 min', unlocked: true },
        ],
      },
      {
        title: 'Module 2: Life Design & Alignment',
        lessons: [
          { title: 'From Vision to Reality', duration: '22 min', unlocked: true },
          { title: 'Removing Obstacles', duration: '24 min', unlocked: false },
          { title: 'Embodiment Practices', duration: '20 min', unlocked: false },
        ],
      },
      {
        title: 'Module 3: Living Your Purpose',
        lessons: [
          { title: 'Integration & Mastery', duration: '26 min', unlocked: false },
          { title: 'Legacy Building', duration: '23 min', unlocked: false },
          { title: 'Ongoing Evolution', duration: '19 min', unlocked: false },
        ],
      },
    ],
  },
  'inner-child-healing': {
    title: 'Inner Child Healing',
    description:
      'Gently and powerfully address the subconscious wounds that quietly hold you back from the life, love, and abundance you deserve.',
    instructor: 'EmbracingHigherSelf Team',
    price: 247,
    duration: '5 weeks',
    lessons: 15,
    students: 325,
    img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&auto=format&fit=crop&q=60',
    modules: [
      {
        title: 'Module 1: Understanding Your Inner Child',
        lessons: [
          { title: 'Childhood Patterns & Beliefs', duration: '14 min', unlocked: true },
          { title: 'Identifying Wounds', duration: '16 min', unlocked: true },
          { title: 'Self-Compassion Foundations', duration: '12 min', unlocked: true },
        ],
      },
      {
        title: 'Module 2: Healing Practices',
        lessons: [
          { title: 'Inner Child Dialogues', duration: '18 min', unlocked: true },
          { title: 'Reparenting Yourself', duration: '20 min', unlocked: false },
          { title: 'Emotional Release Techniques', duration: '17 min', unlocked: false },
        ],
      },
      {
        title: 'Module 3: Integration & Growth',
        lessons: [
          { title: 'Building New Patterns', duration: '21 min', unlocked: false },
          { title: 'Adult-Child Integration', duration: '19 min', unlocked: false },
        ],
      },
    ],
  },
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const course = coursesData[courseId];
  
  // Fallback if course not found
  if (!course) {
    return (
      <main className="pt-20 min-h-screen">
        <div className="px-6 pt-8">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/academy"
              className="inline-flex items-center gap-2 text-sm text-secondary hover:text-espresso transition-colors"
            >
              <ArrowLeft size={14} /> Back to Academy
            </Link>
            <div className="mt-10">
              <p className="text-espresso">Course not found. Please select a valid course.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const [activeLesson, setActiveLesson] = useState(course.modules[0].lessons[0]);
  const [openModules, setOpenModules] = useState({ 0: true });

  const toggleModule = (i) =>
    setOpenModules((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <main className="pt-20 min-h-screen">
      {/* Back */}
      <div className="px-6 pt-8">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/academy"
            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-espresso transition-colors"
          >
            <ArrowLeft size={14} /> Back to Academy
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
        {/* Video player */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-video bg-espresso rounded-luxury overflow-hidden flex items-center justify-center mb-6 relative"
          >
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto cursor-pointer hover:scale-110 transition-transform"
                style={{ background: '#d4a574' }}
              >
                <Play size={22} fill="#2a2219" color="#2a2219" />
              </div>
              <p className="text-cream/60 text-sm">{activeLesson.title}</p>
            </div>
          </motion.div>

          <h2
            className="font-boska text-3xl text-espresso mb-2"
            style={{ fontFamily: 'Boska, Georgia, serif' }}
          >
            {activeLesson.title}
          </h2>
          <p className="text-sm text-secondary">Duration: {activeLesson.duration}</p>
        </div>

        {/* Course sidebar */}
        <div className="lg:col-span-1">
          <h3
            className="font-boska text-xl text-espresso mb-6"
            style={{ fontFamily: 'Boska, Georgia, serif' }}
          >
            {course.title}
          </h3>

          <div className="space-y-3">
            {course.modules.map((mod, mi) => (
              <div key={mi} className="rounded-2xl luxury-border overflow-hidden">
                <button
                  onClick={() => toggleModule(mi)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-cream/50 transition-colors"
                >
                  <span className="text-sm font-medium text-espresso">{mod.title}</span>
                  <motion.div animate={{ rotate: openModules[mi] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-secondary" />
                  </motion.div>
                </button>
                {openModules[mi] && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                  >
                    {mod.lessons.map((lesson, li) => (
                      <button
                        key={li}
                        onClick={() => lesson.unlocked && setActiveLesson(lesson)}
                        className={`w-full flex items-center gap-3 px-5 py-3 text-left text-sm transition-colors ${
                          activeLesson.title === lesson.title
                            ? 'bg-gold/10 text-espresso'
                            : lesson.unlocked
                            ? 'text-secondary hover:text-espresso hover:bg-cream/30'
                            : 'text-espresso/30 cursor-not-allowed'
                        }`}
                        style={{ borderTop: '1px solid rgba(42,34,25,0.05)' }}
                      >
                        {lesson.unlocked ? (
                          <Play size={12} className="text-gold flex-shrink-0" />
                        ) : (
                          <Lock size={12} className="text-espresso/20 flex-shrink-0" />
                        )}
                        <span className="flex-1">{lesson.title}</span>
                        <span className="text-xs text-secondary/60">{lesson.duration}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
