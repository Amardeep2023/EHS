import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Clock, BookOpen, Users } from 'lucide-react';
import axios from 'axios';
import { resolveMediaUrl } from '../utils/media.js';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/courses`);
        setCourses((res.data.courses || []).map((course) => ({
          id: course.slug || course._id,
          label: course.price < 250 ? 'Foundation' : course.price < 300 ? 'Advanced' : 'Premium',
          title: course.title,
          description: course.shortDescription || course.description || '',
          price: course.price,
          duration: `${Math.max(1, Math.ceil((course.totalDays || 1) / 7))} week${Math.ceil((course.totalDays || 1) / 7) > 1 ? 's' : ''}`,
          lessons: course.content?.length || course.totalDays || 1,
          students: course.enrollmentCount || 0,
          img: resolveMediaUrl(course.thumbnail || course.coverImage) || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=60',
        })));
      } catch {
        setError('Unable to load courses right now.');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const handleCourseOpen = (courseId) => {
    navigate(`/academy/${courseId}`);
  };

  return (
    <main className="pt-20 overflow-hidden">
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-label text-gold mb-4"
          >
            Online Courses
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-boska text-5xl md:text-6xl text-espresso mb-6"
            style={{ fontFamily: 'Boska, Georgia, serif', letterSpacing: '-0.02em' }}
          >
            Transformative learning, one guided course at a time.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary leading-relaxed max-w-2xl mx-auto"
          >
            Choose a course card to view its description and continue into the academy detail experience.
          </motion.p>
        </div>
      </section>

      <section className="pb-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-secondary">Loading courses…</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-600">{error}</div>
          ) : (
            courses.map((course, index) => (
            <motion.article
              key={course.id}
              id={course.id}
              data-course-id={course.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className="rounded-luxury luxury-border bg-white overflow-hidden group hover:shadow-luxury-md transition-all duration-300 h-full cursor-pointer"
              onClick={() => handleCourseOpen(course.id)}
            >
              <div className="overflow-hidden aspect-video">
                <img
                  src={course.img}
                  alt={course.title}
                  className="w-full h-full object-cover img-sepia group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-8 flex flex-col h-[calc(100%-16rem)]">
                <p className="text-label text-gold mb-3">{course.label}</p>
                <h3
                  className="font-boska text-3xl text-espresso mb-3"
                  style={{ fontFamily: 'Boska, Georgia, serif' }}
                >
                  {course.title}
                </h3>
                <p className="text-sm text-secondary leading-relaxed mb-6 flex-1">
                  {course.description}
                </p>

                <div className="flex items-center gap-6 mb-8 text-xs text-secondary">
                  <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen size={12} /> {course.lessons} lessons</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {course.students} students</span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="font-boska text-2xl text-espresso"
                    style={{ fontFamily: 'Boska, Georgia, serif' }}
                  >
                    ${course.price}
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleCourseOpen(course.id);
                    }}
                    className="flex items-center gap-2 bg-espresso text-cream px-5 py-2.5 rounded-full text-sm hover:bg-gold hover:text-espresso transition-all duration-300"
                  >
                    View Details <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </motion.article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
