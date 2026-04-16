import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    intent: { 
      type: String, 
      required: true 
    },
    preferredDate: { 
      type: Date, 
      required: true 
    },
    preferredTime: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'payment_failed'], 
      default: 'pending' 
    },
    paypalOrderId: { 
      type: String 
    },
    paypalPaymentId: { 
      type: String 
    },
    amountPaid: { 
      type: Number, 
      default: 197 
    },
    zoomMeetingId: { 
      type: String 
    },
    zoomMeetingLink: { 
      type: String 
    },
    zoomStartUrl: { 
      type: String 
    },
    zoomPassword: { 
      type: String 
    },
    adminNotes: { 
      type: String 
    },
  },
  { 
    timestamps: true 
  }
);

// Create indexes for better performance
consultationSchema.index({ user: 1, createdAt: -1 });
consultationSchema.index({ status: 1 });
consultationSchema.index({ preferredDate: 1 });

// Check if model already exists to prevent overwriting
const Consultation = mongoose.models.Consultation || mongoose.model('Consultation', consultationSchema);

export default Consultation;