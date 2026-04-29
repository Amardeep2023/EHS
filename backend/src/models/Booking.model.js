import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  sessionType: {
    type: String,
    required: true,
    enum: ['consultation', 'coaching', 'mentoring', 'other'],
    default: 'consultation'
  },
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 60
  },
  message: {
    type: String,
    default: ''
  },
  zoomMeetingId: {
    type: String,
    default: ''
  },
  zoomMeetingLink: {
    type: String,
    default: ''
  },
  zoomJoinUrl: {
    type: String,
    default: ''
  },
  zoomStartTime: {
    type: Date,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    default: ''
  },
  paymentAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'rescheduled', 'completed'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better query performance
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ status: 1 });

// Check if model already exists before creating
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;