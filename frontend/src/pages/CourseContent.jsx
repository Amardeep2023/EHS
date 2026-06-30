import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, Pause, FileText, Headphones, Download,
  BookOpen, CheckCircle, Lock, ChevronLeft, ChevronRight,
  Sun, Moon, Clock, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { resolveMediaUrl } from '../utils/media';

// ── Audio Player Component ──────────────────────────────────────
function ContentAudioPlayer({ src, label, icon: Icon, accent = 'gold' }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play(); setPlaying(true); }
  };

  const onTimeUpdate = () => {
    if (!ref.current) return;
    const pct = (ref.current.currentTime / ref.current.duration) * 100 || 0;
    setProgress(pct);
    setCurrentTime(formatTime(ref.current.currentTime));
  };

  const onLoaded = () => {
    if (ref.current) setDuration(formatTime(ref.current.duration));
  };

  const onEnded = () => setPlaying(false);

  const skip = (dir) => {
    if (!ref.current) return;
    ref.current.currentTime = Math.max(0, Math.min(
      ref.current.duration,
      ref.current.currentTime + dir * 15
    ));
  };

  return (
    <div className="rounded-2xl bg-white border border-espresso/10 p-5 hover:shadow-luxury-md transition-all duration-300">
      <audio
        ref={ref}
        src={resolveMediaUrl(src)}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoaded}
        onEnded={onEnded}
        preload="metadata"
      />
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-gold" />
        </div>
        <span className="text-sm font-medium text-espresso truncate">{label}</span>
      </div>

      {/* Progress Bar */}
      <div
        className="h-2 bg-espresso/8 rounded-full overflow-hidden mb-3 cursor-pointer group"
        onClick={(e) => {
          if (!ref.current) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          ref.current.currentTime = pct * ref.current.duration;
        }}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-amber-400 relative transition-all duration-150"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-gold shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => skip(-1)}
            className="p-1.5 rounded-lg hover:bg-espresso/5 text-secondary hover:text-espresso transition-colors"
            title="Rewind 15s"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>

          <button
            onClick={toggle}
            className="w-9 h-9 rounded-full bg-gold flex items-center justify-center hover:scale-110 active:scale-95 transition-transform flex-shrink-0 shadow-sm"
          >
            {playing
              ? <Pause size={13} fill="#2a2219" color="#2a2219" />
              : <Play size={13} fill="#2a2219" color="#2a2219" className="ml-0.5" />}
          </button>

          <button
            onClick={() => skip(1)}
            className="p-1.5 rounded-lg hover:bg-espresso/5 text-secondary hover:text-espresso transition-colors"
            title="Forward 15s"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-secondary font-mono">
          <span>{currentTime}</span>
          <span className="text-espresso/20">/</span>
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
}

// ── Progress Circle ─────────────────────────────────────────────
function ProgressCircle({ completed, total }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(42,34,25,0.08)" strokeWidth="4" />
          <circle
            cx="32" cy="32" r={r}
            fill="none" stroke="#d4a574"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-espresso">{pct}%</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-espresso">Progress</p>
        <p className="text-xs text-secondary">{completed} of {total} lessons completed</p>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────
export default function CourseContent() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token, API_URL, isLoggedIn } = useAuth();

  const [course, setCourse] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedLessons, setCompletedLessons] = useState(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const activeToken = token || localStorage.getItem('ehs_token');
        if (!activeToken) {
          navigate('/login');
          return;
        }

        const res = await axios.get(`${API_URL}/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        });

        if (!res.data.hasPurchased) {
          navigate(`/checkout/${courseId}`);
          return;
        }

        const courseData = res.data.course;
        setCourse({
          ...courseData,
          coverImage: resolveMediaUrl(courseData.coverImage || courseData.thumbnail || ''),
          days: (courseData.content || []).map((item, index) => ({
            dayNumber: index + 1,
            title: item.title,
            pdfUrl: resolveMediaUrl(item.pdfUrl || ''),
            pdfTitle: item.pdfTitle || 'Lesson PDF',
            audioUrl: resolveMediaUrl(item.audioUrl || ''),
            audioTitle: item.audioTitle || 'Audio Lesson',
          })),
        });
        setHasPurchased(true);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Course not found');
        } else {
          setError(err.response?.data?.message || 'Failed to load course');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    load();
  }, [courseId, token, API_URL, navigate, isLoggedIn]);

  const toggleLessonComplete = (index) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-b from-cream to-white">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-espresso/10 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary animate-pulse">Loading your course...</p>
        </div>
      </main>
    );
  }

  // ── Error ─────────────────────────────────────────────────────
  if (error || !course) {
    return (
      <main className="pt-20 min-h-screen bg-gradient-to-b from-cream to-white px-6 py-10">
        <div className="max-w-3xl mx-auto text-center pt-20">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <span className="text-red-400 text-4xl">!</span>
          </div>
          <h1 className="font-boska text-3xl text-espresso mb-3" style={{ fontFamily: 'Boska, Georgia, serif' }}>
            {error || 'Course not found'}
          </h1>
          <p className="text-secondary mb-8">This course may have been removed or you may not have access.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-espresso text-cream px-8 py-3.5 rounded-full text-sm font-medium hover:bg-gold hover:text-espresso transition-all duration-300"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const day = course.days?.[activeDay];
  const totalDays = course.days?.length || 0;

  return (
    <main className="pt-20 min-h-screen bg-gradient-to-b from-cream via-white to-cream">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-espresso to-espresso/95 text-cream">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-cream/50 hover:text-cream transition-colors mb-4"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-label text-gold/70 mb-1">Your Course</p>
              <h1 className="font-boska text-3xl md:text-4xl text-cream" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                {course.title}
              </h1>
            </div>
            <ProgressCircle completed={completedLessons.size} total={totalDays} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* ── Sidebar — Day Navigation ──────────────────────────── */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-28">
              <h3 className="font-boska text-lg text-espresso mb-4 flex items-center gap-2" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                <BookOpen size={16} className="text-gold" />
                Course Lessons
              </h3>

              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
                {course.days?.map((d, i) => {
                  const isActive = activeDay === i;
                  const isComplete = completedLessons.has(i);

                  return (
                    <button
                      key={i}
                      onClick={() => setActiveDay(i)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all duration-200 group ${
                        isActive
                          ? 'bg-espresso text-cream shadow-md'
                          : 'text-secondary hover:text-espresso hover:bg-espresso/5'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all ${
                        isActive
                          ? 'bg-gold text-espresso'
                          : isComplete
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-espresso/10 text-espresso'
                      }`}>
                        {isComplete ? (
                          <CheckCircle size={12} />
                        ) : (
                          d.dayNumber
                        )}
                      </span>
                      <span className="truncate font-medium">{d.title}</span>
                      {isComplete && (
                        <span className="ml-auto text-emerald-500">
                          <CheckCircle size={12} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Course Stats */}
              <div className="mt-6 p-4 rounded-2xl bg-cream/70 border border-espresso/5">
                <div className="space-y-2 text-xs text-secondary">
                  <div className="flex justify-between">
                    <span>Total Lessons</span>
                    <span className="text-espresso font-medium">{totalDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="text-espresso font-medium">{completedLessons.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining</span>
                    <span className="text-espresso font-medium">{totalDays - completedLessons.size}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setActiveDay((p) => Math.max(0, p - 1))}
                  disabled={activeDay === 0}
                  className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl border border-espresso/10 text-xs text-secondary hover:text-espresso hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <button
                  onClick={() => setActiveDay((p) => Math.min(totalDays - 1, p + 1))}
                  disabled={activeDay === totalDays - 1}
                  className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl border border-espresso/10 text-xs text-secondary hover:text-espresso hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </aside>

          {/* ── Main Content Area ─────────────────────────────────── */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {day ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDay}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="space-y-6"
                >
                  {/* Day Header */}
                  <div className="bg-white rounded-2xl border border-espresso/5 p-6 md:p-8 shadow-luxury-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium">
                            Day {day.dayNumber}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-secondary">
                            <Clock size={12} />
                            ~15 min
                          </span>
                        </div>
                        <h2 className="font-boska text-2xl md:text-3xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                          {day.title}
                        </h2>
                      </div>

                      <button
                        onClick={() => toggleLessonComplete(activeDay)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 flex-shrink-0 ${
                          completedLessons.has(activeDay)
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-cream/70 text-secondary border border-espresso/10 hover:border-gold/30'
                        }`}
                      >
                        <CheckCircle size={14} />
                        {completedLessons.has(activeDay) ? 'Completed' : 'Mark Complete'}
                      </button>
                    </div>

                    {course.description && (
                      <p className="text-sm text-secondary mt-4 leading-relaxed line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>

                  {/* Content Cards Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Audio Player */}
                    {day.audioUrl && (
                      <div className="md:col-span-2">
                        <h3 className="text-label text-espresso/50 mb-3 flex items-center gap-2">
                          <Headphones size={14} className="text-gold" />
                          Guided Audio
                        </h3>
                        <ContentAudioPlayer
                          src={day.audioUrl}
                          label={day.audioTitle}
                          icon={Headphones}
                        />
                      </div>
                    )}

                    {/* PDF Download */}
                    {day.pdfUrl && (
                      <div>
                        <h3 className="text-label text-espresso/50 mb-3 flex items-center gap-2">
                          <FileText size={14} className="text-gold" />
                          Journal Worksheet
                        </h3>
                        <a
                          href={day.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="block group"
                        >
                          <div className="rounded-2xl bg-white border border-espresso/10 p-5 hover:shadow-luxury-md hover:border-gold/30 transition-all duration-300">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText size={22} className="text-gold" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-espresso truncate">{day.pdfTitle}</p>
                                <p className="text-xs text-secondary mt-0.5">Download & print</p>
                              </div>
                              <div className="w-9 h-9 rounded-full bg-espresso flex items-center justify-center group-hover:bg-gold transition-colors flex-shrink-0">
                                <Download size={14} className="text-cream" />
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    )}

                    {/* Notes / Reflection */}
                    {day.audioUrl && (
                      <div>
                        <h3 className="text-label text-espresso/50 mb-3 flex items-center gap-2">
                          <Sparkles size={14} className="text-gold" />
                          Reflection
                        </h3>
                        <div className="rounded-2xl bg-white border border-espresso/10 p-5 h-full">
                          <p className="text-sm text-secondary leading-relaxed">
                            Take a moment to reflect on today's lesson. What resonated with you?
                            Write down your thoughts in your journal.
                          </p>
                          <div className="mt-4 flex items-center gap-2 text-xs text-gold">
                            <Sparkles size={12} />
                            <span>Journal prompt available in the PDF</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* If only audio and no PDF */}
                    {!day.pdfUrl && day.audioUrl && (
                      <div>
                        <h3 className="text-label text-espresso/50 mb-3 flex items-center gap-2">
                          <Sun size={14} className="text-gold" />
                          Practice
                        </h3>
                        <div className="rounded-2xl bg-gradient-to-br from-gold/5 to-amber-50 border border-gold/10 p-5 h-full">
                          <p className="text-sm text-espresso font-medium mb-2">Affirmation</p>
                          <p className="text-sm text-secondary italic leading-relaxed">
                            "I am open to receiving the wisdom this lesson has to offer. I trust the process of my growth."
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Day Navigation Footer */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => setActiveDay((p) => Math.max(0, p - 1))}
                      disabled={activeDay === 0}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-espresso/10 text-sm text-secondary hover:text-espresso hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                      <span className="hidden sm:inline">Previous Lesson</span>
                      <span className="sm:hidden">Previous</span>
                    </button>

                    <span className="text-xs text-secondary">
                      {activeDay + 1} / {totalDays}
                    </span>

                    <button
                      onClick={() => setActiveDay((p) => Math.min(totalDays - 1, p + 1))}
                      disabled={activeDay === totalDays - 1}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-espresso/10 text-sm text-secondary hover:text-espresso hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="hidden sm:inline">Next Lesson</span>
                      <span className="sm:hidden">Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Completed All Celebration */}
                  {completedLessons.size === totalDays && totalDays > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-emerald-600" />
                      </div>
                      <h3 className="font-boska text-2xl text-emerald-800 mb-2" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                        Course Complete! 🎉
                      </h3>
                      <p className="text-sm text-emerald-600 mb-6">
                        Congratulations on completing all {totalDays} lessons. You've taken a beautiful step in your journey.
                      </p>
                      <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-emerald-700 transition-all duration-300"
                      >
                        Return to Dashboard <ArrowLeft size={14} />
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-20">
                <BookOpen size={48} className="text-gold/30 mx-auto mb-4" />
                <p className="text-secondary">No content available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
