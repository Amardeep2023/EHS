import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    intent: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    meetingLink: { type: String },
    paymentId: { type: String },
    amountPaid: { type: Number, default: 197 },
  },
  { timestamps: true }
);

export default mongoose.model('Consultation', consultationSchema);
