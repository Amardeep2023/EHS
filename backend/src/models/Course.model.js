import mongoose from 'mongoose';

// Each day has: 1 video, 1 PDF, 2 guided audios (morning/evening), 3 story audios
const daySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true, min: 1, max: 21 },
  title: { type: String, required: true },

  // Short intro video (URL — Vimeo/YouTube/direct)
  videoUrl: { type: String, default: '' },
  videoDuration: { type: String, default: '' }, // e.g. "1:02"

  // PDF journaling sheet
  pdfUrl: { type: String, default: '' },        // served from /uploads or CDN
  pdfTitle: { type: String, default: 'Daily Journal Sheet' },

  // Guided meditations — split left/right UI
  morningAudioUrl: { type: String, default: '' },
  morningAudioTitle: { type: String, default: 'Morning Meditation' },
  eveningAudioUrl: { type: String, default: '' },
  eveningAudioTitle: { type: String, default: 'Evening Meditation' },

  // 3 story/imagination audios — displayed as a grid
  storyAudios: {
    type: [
      {
        title: { type: String, required: true },
        audioUrl: { type: String, required: true },
        duration: { type: String, default: '' },
      },
    ],
    validate: [arr => arr.length <= 3, 'Maximum 3 story audios per day'],
    default: [],
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true },
    coverImage: { type: String, default: '' },
    totalDays: { type: Number, default: 21 },
    isPublished: { type: Boolean, default: false },
    enrollmentCount: { type: Number, default: 0 },
    days: [daySchema],
  },
  { timestamps: true }
);

// Auto-generate slug from title
courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
  next();
});

export default mongoose.model('Course', courseSchema);
