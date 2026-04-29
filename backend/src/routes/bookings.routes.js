import express from 'express';
import Booking from '../models/Booking.model.js';
import paypalService from '../services/paypalService.js';
import zoomService from '../services/zoomService.js';
import emailService from '../services/emailService.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create booking and initiate payment
router.post('/create', protect, async (req, res) => {
  try {
    const {
      sessionType,
      preferredDate,
      preferredTime,
      duration = 60,
      message,
      amount,
      currency = 'USD'
    } = req.body;

    // Validate required fields
    if (!sessionType || !preferredDate || !preferredTime || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Create booking record with pending payment
    const booking = new Booking({
      userId: req.user._id,
      userEmail: req.user.email,
      userName: req.user.name,
      sessionType,
      preferredDate: new Date(preferredDate),
      preferredTime,
      duration,
      message: message || '',
      paymentAmount: amount,
      currency,
      paymentStatus: 'pending'
    });

    await booking.save();

    // Create PayPal order
    const returnUrl = `${process.env.FRONTEND_URL}/payment/success?bookingId=${booking._id}`;
    const cancelUrl = `${process.env.FRONTEND_URL}/payment/cancel?bookingId=${booking._id}`;
    
    const paypalOrder = await paypalService.createOrder(
      amount,
      currency,
      booking._id.toString(),
      returnUrl,
      cancelUrl
    );

    // Update booking with PayPal order ID
    booking.paymentId = paypalOrder.orderId;
    await booking.save();

    res.json({
      success: true,
      bookingId: booking._id,
      approvalUrl: paypalOrder.approvalUrl
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create booking' 
    });
  }
});

// Capture payment after PayPal approval
router.post('/capture-payment', protect, async (req, res) => {
  try {
    const { orderId, bookingId } = req.body;

    if (!orderId || !bookingId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing orderId or bookingId' 
      });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Verify user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    // Capture payment with PayPal
    let paymentResult;
    try {
      paymentResult = await paypalService.captureOrder(orderId);
    } catch (paypalError) {
      console.error('❌ PayPal capture error in bookings:', paypalError.message);
      booking.paymentStatus = 'failed';
      await booking.save();
      return res.status(500).json({
        success: false,
        message: 'Payment capture failed: ' + paypalError.message
      });
    }

    if (!paymentResult.captured) {
      booking.paymentStatus = 'failed';
      await booking.save();
      console.log('❌ Payment capture failed for booking:', bookingId, 'Status:', paymentResult.status);
      return res.status(400).json({
        success: false,
        message: 'Payment capture failed',
        details: paymentResult.status
      });
    }

    // Create Zoom meeting
    const meetingDateTime = new Date(booking.preferredDate);
    const [hours, minutes] = booking.preferredTime.split(':');
    meetingDateTime.setHours(parseInt(hours), parseInt(minutes));

    const zoomMeeting = await zoomService.createMeeting(
      `Session with ${booking.userName} - ${booking.sessionType}`,
      meetingDateTime,
      booking.duration,
      booking.userEmail,
      booking.userName
    );

    // Update booking with Zoom details
    booking.zoomMeetingId = zoomMeeting.meetingId;
    booking.zoomMeetingLink = zoomMeeting.meetingLink;
    booking.zoomJoinUrl = zoomMeeting.joinUrl;
    booking.zoomStartTime = zoomMeeting.startTime;
    booking.paymentStatus = 'completed';
    booking.status = 'confirmed';
    booking.paymentId = paymentResult.paymentId;
    await booking.save();

    // Send confirmation emails
    await emailService.sendBookingConfirmation(
      booking,
      {
        meetingLink: zoomMeeting.meetingLink,
        startUrl: zoomMeeting.startUrl,
        meetingId: zoomMeeting.meetingId,
        password: zoomMeeting.password
      },
      booking.userEmail,
      booking.userName
    );

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      booking: {
        id: booking._id,
        meetingLink: zoomMeeting.meetingLink,
        sessionType: booking.sessionType,
        preferredDate: booking.preferredDate,
        preferredTime: booking.preferredTime
      }
    });
  } catch (error) {
    console.error('Payment capture error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to complete booking' 
    });
  }
});

// Get user's bookings (for dashboard)
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      bookings: bookings.map(booking => ({
        id: booking._id,
        sessionType: booking.sessionType,
        date: booking.preferredDate,
        time: booking.preferredTime,
        duration: booking.duration,
        meetingLink: booking.zoomMeetingLink,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        amount: booking.paymentAmount,
        createdAt: booking.createdAt
      }))
    });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch bookings' 
    });
  }
});

// Get single booking details
router.get('/:bookingId', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    res.json({
      success: true,
      booking: {
        id: booking._id,
        sessionType: booking.sessionType,
        date: booking.preferredDate,
        time: booking.preferredTime,
        duration: booking.duration,
        meetingLink: booking.zoomMeetingLink,
        message: booking.message,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        amount: booking.paymentAmount,
        createdAt: booking.createdAt
      }
    });
  } catch (error) {
    console.error('Fetch booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch booking' 
    });
  }
});

// Cancel booking (optional)
router.post('/:bookingId/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    // Check if booking can be cancelled (e.g., more than 24 hours before)
    const meetingTime = new Date(booking.zoomStartTime);
    const hoursUntilMeeting = (meetingTime - Date.now()) / (1000 * 60 * 60);
    
    if (hoursUntilMeeting < 24) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bookings can only be cancelled 24 hours in advance' 
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to cancel booking' 
    });
  }
});

export default router;