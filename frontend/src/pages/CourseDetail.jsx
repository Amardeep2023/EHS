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
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const course = coursesData[courseId] || coursesData['manifestation-mastery'];
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
