import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, FileText, Headphones, Moon, Sun, ShoppingCart, Lock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { resolveMediaUrl } from '../utils/media';
import { getPriceForCourse, formatPrice, getCurrencySymbol } from '../utils/pricing';
import { useCountryPricing } from '../context/CountryPricingContext';

// ── Small reusable audio player ───────────────────────────────────
function AudioPlayer({ src, label, icon: Icon, accent = 'gold' }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play(); setPlaying(true); }
  };

  const onTimeUpdate = () => {
    if (!ref.current) return;
    setProgress((ref.current.currentTime / ref.current.duration) * 100 || 0);
  };

  return (
    <div className="rounded-2xl luxury-border bg-white p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-gold" />
        <span className="text-sm font-medium text-espresso">{label}</span>
      </div>
      <audio ref={ref} src={src} onTimeUpdate={onTimeUpdate} onEnded={() => setPlaying(false)} />
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="w-10 h-10 rounded-full bg-gold flex items-center justify-center hover:scale-110 transition-transform flex-shrink-0"
        >
          {playing
            ? <Pause size={14} fill="#2a2219" color="#2a2219" />
            : <Play size={14} fill="#2a2219" color="#2a2219" />}
        </button>
        <div className="flex-1 h-1.5 bg-espresso/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token, API_URL, user } = useAuth();
  const { countryCode, getPrice, formatPrice, currencySymbol } = useCountryPricing();

  const [course, setCourse] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const activeToken = token || localStorage.getItem('ehs_token');
        const res = await axios.get(`${API_URL}/courses/${courseId}`, {
          headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        });
        const normalizedCourse = {
          ...res.data.course,
          coverImage: resolveMediaUrl(res.data.course.thumbnail || res.data.course.coverImage || ''),
          includedItems: (res.data.course.content || []).map((item) => item.title),
          days: (res.data.course.content || []).map((item, index) => ({
            dayNumber: index + 1,
            title: item.title,
            pdfUrl: resolveMediaUrl(item.pdfUrl || ''),
            pdfTitle: item.pdfTitle || 'Lesson PDF',
            morningAudioUrl: resolveMediaUrl(item.audioUrl || ''),
            eveningAudioUrl: '',
            storyAudios: [],
          })),
        };
        setCourse(normalizedCourse);
        setHasPurchased(res.data.hasPurchased);
      } catch (err) {
        setError('Course not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId, token, API_URL]);

  const handlePurchase = async () => {
    if (!user) { navigate('/login'); return; }
    setPurchasing(true);
    try {
      const activeToken = token || localStorage.getItem('ehs_token');
      const res = await axios.post(
        `${API_URL}/courses/purchase/initiate`,
        { courseId: course._id },
        { headers: { Authorization: `Bearer ${activeToken}` } }
      );
      if (res.data.approvalUrl) {
        window.location.href = res.data.approvalUrl;
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-espresso/20 border-t-gold rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="pt-20 min-h-screen px-6 pt-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/academy" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-espresso transition-colors">
            <ArrowLeft size={14} /> Back to Academy
          </Link>
          <p className="mt-10 text-espresso">Course not found.</p>
        </div>
      </main>
    );
  }

  const day = course.days?.[activeDay];

  // ── Paywall (not purchased) ───────────────────────────────────
  if (!hasPurchased) {
    return (
      <main className="pt-20 min-h-screen">
        <div className="px-6 pt-8 max-w-7xl mx-auto">
          <Link to="/academy" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-espresso transition-colors mb-8 block">
            <ArrowLeft size={14} /> Back to Academy
          </Link>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-luxury luxury-border bg-white p-8 md:p-10 shadow-luxury-sm">
            {course.coverImage && (
              <img src={course.coverImage} alt={course.title}
                className="w-full aspect-video object-cover rounded-luxury mb-8" />
            )}
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold rounded-full px-4 py-1.5 text-label mb-4">
              <Lock size={12} /> Premium Course
            </div>
            <h1 className="font-boska text-4xl text-espresso mb-4" style={{ fontFamily: 'Boska, Georgia, serif' }}>
              {course.title}
            </h1>
            <p className="text-secondary mb-6 leading-relaxed">{course.description}</p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl bg-cream/70 p-4 text-center">
                <p className="font-boska text-2xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>{course.totalDays || 21}</p>
                <p className="text-label text-secondary">Days</p>
              </div>
              <div className="rounded-2xl bg-cream/70 p-4 text-center">
                <p className="font-boska text-2xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>{course.enrollmentCount || 0}</p>
                <p className="text-label text-secondary">Students</p>
              </div>
              <div className="rounded-2xl bg-cream/70 p-4 text-center">
                <p className="font-boska text-2xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>{formatPrice(getPrice(course))}</p>
                <p className="text-label text-secondary">One-time</p>
              </div>
            </div>

            <div className="rounded-2xl border border-espresso/10 bg-cream/50 p-6 text-left mb-8">
              <h2 className="font-boska text-2xl text-espresso mb-4" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                What you will receive in this course
              </h2>
              <p className="text-sm text-secondary leading-relaxed mb-5">
                This course includes everything listed below so you can move through the experience with clarity, structure, and support.
              </p>
              <ul className="space-y-3 text-sm text-espresso">
                {(course.includedItems || []).map((item, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => navigate(`/checkout/${course._id || courseId}`)}
                disabled={purchasing}
                className="inline-flex items-center gap-3 bg-espresso text-cream px-10 py-4 rounded-full text-sm font-medium hover:bg-gold hover:text-espresso transition-all duration-300 disabled:opacity-60"
              >
                <ShoppingCart size={16} /> Enroll Now — {formatPrice(getPrice(course))}
              </button>
            </div>

            <p className="text-xs text-secondary mt-4 text-center">Secure checkout via PayPal. Instant access after payment.</p>
          </motion.div>
        </div>
      </main>
    );
  }

  // ── Course Player (purchased) ─────────────────────────────────
  return (
    <main className="pt-20 min-h-screen bg-cream">
      <div className="px-6 pt-8 max-w-7xl mx-auto">
        <Link to="/academy" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-espresso transition-colors">
          <ArrowLeft size={14} /> Back to Academy
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-4 gap-8">
        {/* Day Selector Sidebar */}
        <aside className="lg:col-span-1">
          <h3 className="font-boska text-lg text-espresso mb-4" style={{ fontFamily: 'Boska, Georgia, serif' }}>
            {course.title}
          </h3>
          <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
            {course.days?.map((d, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all ${
                  activeDay === i
                    ? 'bg-espresso text-cream'
                    : 'text-secondary hover:text-espresso hover:bg-espresso/5'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                  activeDay === i ? 'bg-gold text-espresso' : 'bg-espresso/10 text-espresso'
                }`}>
                  {d.dayNumber}
                </span>
                <span className="truncate">{d.title}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Day Content */}
        <div className="lg:col-span-3 space-y-6">
          {day ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Day Header */}
                <div>
                  <p className="text-label text-gold mb-1">Day {day.dayNumber}</p>
                  <h2 className="font-boska text-3xl text-espresso" style={{ fontFamily: 'Boska, Georgia, serif' }}>
                    {day.title}
                  </h2>
                </div>

                {/* 1. Video Section */}
                {day.videoUrl && (
                  <section>
                    <h4 className="text-label text-espresso/50 mb-3 flex items-center gap-2">
                      <Play size={12} /> Today's Intro Video
                    </h4>
                    <div className="aspect-video rounded-luxury overflow-hidden bg-espresso">
                      {day.videoUrl.includes('youtube') || day.videoUrl.includes('youtu.be') ? (
                        <iframe
                          src={day.videoUrl.replace('watch?v=', 'embed/')}
                          className="w-full h-full"
                          allow="autoplay; fullscreen"
                          allowFullScreen
                        />
                      ) : day.videoUrl.includes('vimeo') ? (
                        <iframe
                          src={`https://player.vimeo.com/video/${day.videoUrl.split('/').pop()}`}
                          className="w-full h-full"
                          allow="autoplay; fullscreen"
                          allowFullScreen
                        />
                      ) : (
                        <video src={day.videoUrl} controls className="w-full h-full object-cover" />
                      )}
                    </div>
                    {day.videoDuration && (
                      <p className="text-xs text-secondary mt-2">Duration: {day.videoDuration}</p>
                    )}
                  </section>
                )}

                {/* 2. PDF Journaling Section */}
                {day.pdfUrl && (
                  <section>
                    <h4 className="text-label text-espresso/50 mb-3 flex items-center gap-2">
                      <FileText size={12} /> Daily Journal Sheet
                    </h4>
                    <div className="rounded-luxury luxury-border bg-white p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                          <FileText size={20} className="text-gold" />
                        </div>
                        <div>
                          <p className="font-medium text-espresso text-sm">{day.pdfTitle || 'Day ' + day.dayNumber + ' Journal'}</p>
                          <p className="text-xs text-secondary">Print & write your reflections</p>
                        </div>
                      </div>
                      <a
                        href={day.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="bg-espresso text-cream px-5 py-2.5 rounded-full text-sm hover:bg-gold hover:text-espresso transition-all duration-300"
                      >
                        Download PDF
                      </a>
                    </div>
                  </section>
                )}

                {/* 3. Guided Meditations — Split Morning / Evening */}
                {(day.morningAudioUrl || day.eveningAudioUrl) && (
                  <section>
                    <h4 className="text-label text-espresso/50 mb-3 flex items-center gap-2">
                      <Headphones size={12} /> Guided Meditations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {day.morningAudioUrl && (
                        <AudioPlayer
                          src={day.morningAudioUrl}
                          label={day.morningAudioTitle || 'Morning Meditation'}
                          icon={Sun}
                        />
                      )}
                      {day.eveningAudioUrl && (
                        <AudioPlayer
                          src={day.eveningAudioUrl}
                          label={day.eveningAudioTitle || 'Evening Meditation'}
                          icon={Moon}
                        />
                      )}
                    </div>
                  </section>
                )}

                {/* 4. Story Imagination Audios — 3-column grid */}
                {day.storyAudios?.length > 0 && (
                  <section>
                    <h4 className="text-label text-espresso/50 mb-3 flex items-center gap-2">
                      <Headphones size={12} /> Story Imagination Audios
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {day.storyAudios.map((story, si) => (
                        <AudioPlayer
                          key={si}
                          src={story.audioUrl}
                          label={story.title}
                          icon={Headphones}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-20">
              <p className="text-secondary">No content for this day yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
