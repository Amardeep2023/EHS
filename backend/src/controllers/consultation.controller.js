import Consultation from '../models/Consultation.model.js';
import User from '../models/User.model.js';

export async function createBooking(req, res) {
  try {
    const { name, email, intent, preferredDate, preferredTime, paymentId } = req.body;
    const booking = await Consultation.create({
      user: req.user.id,
      name,
      email,
      intent,
      preferredDate,
      preferredTime,
      paymentId,
      status: paymentId ? 'confirmed' : 'pending',
      meetingLink: paymentId ? `https://meet.example.com/${Date.now()}` : null,
    });

    await User.findByIdAndUpdate(req.user.id, {
      $push: { consultationBookings: booking._id },
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function getMyBookings(req, res) {
  try {
    const bookings = await Consultation.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAllBookings(req, res) {
  try {
    const bookings = await Consultation.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateBooking(req, res) {
  try {
    const booking = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
