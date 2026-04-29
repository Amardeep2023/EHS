import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Clock, BookOpen, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal'; // (see below)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Academy() {
  const { user, isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  // Transform API course data to match component expectations
  const transformCourse = (apiCourse) => {
    // Determine label based on price or other logic
    let label = 'Course';
    if (apiCourse.price < 250) label = 'Foundation';
    else if (apiCourse.price < 300) label = 'Advanced';
    else if (apiCourse.price < 350) label = 'Deep Dive';
    else label = 'Premium';

    // Calculate duration based on totalDays
    const weeks = Math.ceil(apiCourse.totalDays / 7);
    const duration = `${weeks} week${weeks !== 1 ? 's' : ''}`;
    
    return {
      id: apiCourse.slug || apiCourse._id, // Use slug as ID for routing
      label,
      title: apiCourse.title,
      description: apiCourse.shortDescription || apiCourse.description || '',
      price: apiCourse.price,
      duration,
      lessons: apiCourse.totalDays, // Each day is a lesson
      students: apiCourse.enrollmentCount || 0,
      img: apiCourse.coverImage || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=60',
      purchased: apiCourse.purchased || false, // This will need to be populated from user data
      _id: apiCourse._id, // Keep original ID for delete operations
    };
  };

  useEffect(() => {
    axios.get(`${API_URL}/courses`)
      .then(res => {
        const transformed = (res.data.courses || []).map(transformCourse);
        setCourses(transformed);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load'); setLoading(false); });
  }, []);

  const handleDelete = async (id) => {
    try {
      // id is the MongoDB _id (passed from deleteId which is set as course._id)
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${API_URL}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(prev => prev.filter(c => c._id !== id));
      setDeleteId(null);
    } catch {
      setError('Failed to delete');
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/academy/${courseId}`);
  };

  return (
    <main className="pt-20 overflow-hidden">
      {/* Header */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-label text-gold mb-4"
          >
            The Academy
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-boska text-6xl md:text-7xl text-espresso mb-6"
            style={{ fontFamily: 'Boska, Georgia, serif', letterSpacing: '-0.02em' }}
          >
            Deep, Structured Learning
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary leading-relaxed max-w-xl mx-auto"
          >
            Each course is a carefully curated, immersive journey designed to shift not just your thinking — but your entire way of being.
          </motion.p>
        </div>
      </section>

      {/* My Courses (if user has purchases) */}
      {user && courses.some((c) => c.purchased) && (
        <section className="px-6 mb-20">
          <div className="max-w-7xl mx-auto">
            <p className="text-label text-gold mb-6">My Courses</p>
            <div className="grid md:grid-cols-2 gap-6">
              {courses.filter((c) => c.purchased).map((course) => (
                <Link
                  key={course.id}
                  to={`/academy/${course.id}`}
                  className="flex gap-6 p-6 rounded-luxury luxury-border bg-white hover:shadow-luxury-md transition-all duration-300 group"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={course.img} alt={course.title} className="w-full h-full object-cover img-sepia" />
                  </div>
                  <div className="flex-1">
                    <p className="text-label text-gold mb-1">{course.label}</p>
                    <h3
                      className="font-boska text-xl text-espresso mb-2"
                      style={{ fontFamily: 'Boska, Georgia, serif' }}
                    >
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-secondary">
                      <span className="flex items-center gap-1"><Clock size={11} /> {course.duration}</span>
                      <span className="flex items-center gap-1"><BookOpen size={11} /> {course.lessons} lessons</span>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="text-gold self-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Courses */}
      <section className="pb-28 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-label text-gold mb-8">All Courses</p>
          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.1, duration: 0.6 }}
                className="rounded-luxury luxury-border bg-white overflow-hidden group hover:shadow-luxury-md transition-shadow duration-300 h-full cursor-pointer"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="overflow-hidden aspect-video">
                  <img
                    src={course.img}
                    alt={course.title}
                    className="w-full h-full object-cover img-sepia group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <p className="text-label text-gold mb-3">{course.label}</p>
                  <h3
                    className="font-boska text-3xl text-espresso mb-3"
                    style={{ fontFamily: 'Boska, Georgia, serif' }}
                  >
                    {course.title}
                  </h3>
                  <p className="text-sm text-secondary leading-relaxed mb-6">{course.description}</p>

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
                    <div 
                      className="flex items-center gap-2 bg-espresso text-cream px-6 py-2.5 rounded-full text-sm group-hover:bg-gold group-hover:text-espresso transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course.id);
                      }}
                    >
                      {course.purchased ? 'Continue' : 'Enroll Now'} <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {isAdmin && (
        <>
          {deleteId && (
            <ConfirmDeleteModal
              isOpen={deleteId !== null}
              onConfirm={() => handleDelete(deleteId)}
              onCancel={() => setDeleteId(null)}
              itemName={courses.find(c => c._id === deleteId)?.title}
            />
          )}
        </>
      )}
    </main>
  );
}
