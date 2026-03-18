import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    tag: { type: String },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    image: { type: String },
    isPublished: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Story', storySchema);
