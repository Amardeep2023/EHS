import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const defaultStories = [
  {
    title: 'Manifested My Dream Career in 90 Days',
    name: 'Amara K.',
    description:
      'I had been stuck in a job I hated for five years. Within 90 days of applying the Academy teachings, I landed a role that felt like it was written for me — higher pay, creative freedom, and genuine fulfilment.',
    tag: 'Career',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60',
  },
  {
    title: 'Found Love by Finding Myself First',
    name: 'Sophia R.',
    description:
      'I had always sought love externally. The Quantum Alignment course helped me turn inward. Three months later, I met my partner — and for the first time, I was truly ready.',
    tag: 'Relationships',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=60',
  },
  {
    title: 'Healed My Relationship With Money',
    name: 'Jasmine T.',
    description:
      'I grew up believing money was scarce. The Soul Purpose Blueprint dismantled that story completely. My income tripled within six months — not by accident, but by design.',
    tag: 'Abundance',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1546961342-ea5f62d5a27b?w=400&auto=format&fit=crop&q=60',
  },
  {
    title: 'Reclaimed My Health and Energy',
    name: 'Marcus D.',
    description:
      'Chronic fatigue had become my baseline. The morning practices in the free resources section completely shifted my energy. I now wake up genuinely excited for the day.',
    tag: 'Health',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=60',
  },
  {
    title: 'Launched the Business I Always Dreamed Of',
    name: 'Elena V.',
    description:
      'Fear kept me in planning mode for years. The consultation session gave me a clear, actionable roadmap and the confidence to finally launch. My business has been thriving for eight months now.',
    tag: 'Business',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop&q=60',
  },
  {
    title: 'Stepped Into My Purpose Fully',
    name: 'Priya M.',
    description:
      'For years I felt a pull but no direction. Working through the Academy courses helped me articulate and commit to my life\'s work. The clarity I gained is priceless.',
    tag: 'Purpose',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400&auto=format&fit=crop&q=60',
  },
];

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isAdmin = !!localStorage.getItem('admin_token');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/stories`);
        const data = await response.json();

        if (data.success && data.stories && data.stories.length > 0) {
          // Map 'image' field to 'img' for consistency with card rendering
          const mappedStories = data.stories.map((story) => ({
            ...story,
            img: story.image,
          }));
          setStories(mappedStories);
        } else {
          // Use default stories if no published stories from API
          setStories(defaultStories);
        }
        setError('');
      } catch (err) {
        console.error('Error fetching stories:', err);
        // Fallback to default stories on error
        setStories(defaultStories);
        setError('');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Delete story handler
  const handleDelete = async (storyId) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/stories/${storyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setStories((prev) => prev.filter((s) => s._id !== storyId));
      } else {
        alert(data.message || 'Failed to delete story.');
      }
    } catch (err) {
      alert('Error deleting story.');
    }
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
            Community
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-boska text-6xl md:text-7xl text-espresso mb-6"
            style={{ fontFamily: 'Boska, Georgia, serif', letterSpacing: '-0.02em' }}
          >
            Proof That It Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary leading-relaxed max-w-xl mx-auto"
          >
            Real people. Real transformations. These are the stories that remind us what becomes possible when we commit to our highest selves.
          </motion.p>
        </div>

      </section>

      {/* Admin Upload Button */}
      {isAdmin && (
        <div className="max-w-7xl mx-auto px-6 mb-8 flex justify-end">
          <button
            onClick={() => navigate('/admin/story-upload')}
            className="bg-gold text-espresso px-6 py-3 rounded-full font-medium shadow hover:bg-espresso hover:text-gold transition-all duration-300"
          >
            Upload Story
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <section className="pb-28 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-luxury bg-cream/50 h-96 animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && !loading && (
        <section className="pb-28 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center p-8 rounded-luxury border border-red-200 bg-red-50">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      {!loading && (
        <section className="pb-28 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, i) => (
              <motion.article
                key={story._id || story.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1, duration: 0.6 }}
                className="rounded-luxury luxury-border bg-white overflow-hidden group relative"
              >
                {isAdmin && story._id && (
                  <button
                    onClick={() => handleDelete(story._id)}
                    className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow hover:bg-red-700 transition-all z-10"
                  >
                    Delete
                  </button>
                )}
                {story.img && (
                  <div className="overflow-hidden h-52">
                    <img
                      src={story.img}
                      alt={story.name}
                      className="w-full h-full object-cover img-sepia"
                    />
                  </div>
                )}
                <div className="p-8">
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-full mb-4 inline-block"
                    style={{ background: 'rgba(212,165,116,0.12)', color: '#d4a574' }}
                  >
                    {story.tag}
                  </span>
                  <h3
                    className="font-boska text-2xl text-espresso mb-3"
                    style={{ fontFamily: 'Boska, Georgia, serif' }}
                  >
                    {story.title}
                  </h3>
                  <p className="text-sm text-secondary leading-relaxed mb-6 italic">"{story.description}"</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-espresso text-sm">— {story.name}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: story.rating || 5 }).map((_, j) => (
                        <Star key={j} size={11} fill="#d4a574" className="text-gold" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
