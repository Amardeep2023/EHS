import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    googleId: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    purchasedCourses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        purchasedAt: { type: Date, default: Date.now },
        paypalOrderId: { type: String },
        amountPaid: { type: Number },
      },
    ],
    purchasedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    consultationBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
