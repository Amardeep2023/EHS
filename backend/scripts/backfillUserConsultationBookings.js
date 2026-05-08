// scripts/backfillUserConsultationBookings.js
import mongoose from 'mongoose';
import User from '../src/models/User.model.js';
import Consultation from '../src/models/Consultation.model.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ehs';

async function backfill() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const users = await User.find();
  let updatedCount = 0;

  for (const user of users) {
    // Find all consultations for this user
    const consultations = await Consultation.find({ user: user._id }, '_id');
    if (consultations.length > 0) {
      user.consultationBookings = consultations.map(c => c._id);
      await user.save();
      updatedCount++;
      console.log(`Updated user ${user.email} with ${consultations.length} consultations.`);
    }
  }

  console.log(`Backfill complete. Updated ${updatedCount} users.`);
  await mongoose.disconnect();
}

backfill().catch(err => {
  console.error('Backfill error:', err);
  process.exit(1);
});
