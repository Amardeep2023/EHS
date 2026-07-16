import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    fullDescription: { type: String, default: '' },
    price: { type: Number, required: true },
    countryPrices: {
      type: Map,
      of: Number,
      default: {},
    },
    category: { type: String, enum: ['Journals', 'Workbooks', 'Guides', 'Planners', 'Cards'], required: true },
    coverImage: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    features: [{ type: String }],
    pages: { type: Number, default: 0 },
    format: { type: String, default: 'Digital PDF' },
    isPublished: { type: Boolean, default: false },
    salesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

export default mongoose.model('Product', productSchema);
