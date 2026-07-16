import mongoose from 'mongoose';

const contentItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    audioUrl: { type: String, default: '' },
    audioTitle: { type: String, default: 'Audio Lesson' },
    pdfUrl: { type: String, default: '' },
    pdfTitle: { type: String, default: 'Lesson PDF' },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    price: { type: Number, required: true },
    countryPrices: {
      type: Map,
      of: Number,
      default: {},
    },
    thumbnail: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    totalDays: { type: Number, default: 1 },
    isPublished: { type: Boolean, default: false },
    enrollmentCount: { type: Number, default: 0 },
    content: { type: [contentItemSchema], default: [] },
  },
  { timestamps: true }
);

courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
  if (!this.thumbnail && this.coverImage) {
    this.thumbnail = this.coverImage;
  }
  next();
});

export default mongoose.model('Course', courseSchema);
