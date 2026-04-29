import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['PDF', 'Video'], required: true },
    category: { type: String, enum: ['Beginner Guides', 'Quick Practices', 'Challenges', 'Videos'], required: true },
    fileUrl: { type: String, required: true },
    coverImage: { type: String },
    isPublished: { type: Boolean, default: false },
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Resource', resourceSchema);
