import Consultation from '../models/Consultation.model.js';
import paypalService from '../../services/paypal.service.js';
import zoomService from '../../services/zoom.service.js';
import emailService from '../../services/email.service.js';

// Helper function to create Zoom meeting and send emails
async function createZoomMeetingAndSendEmails(consultation) {
  try {
    console.log('🎥 Creating Zoom meeting...');
    const meetingDateTime = new Date(consultation.preferredDate);
    const [hours, minutes] = consultation.preferredTime.split(':');
    meetingDateTime.setHours(parseInt(hours), parseInt(minutes));
    
    const zoomMeeting = await zoomService.createMeeting(
      `Consultation with ${consultation.name}`,
      meetingDateTime,
      60,
      consultation.email,
      consultation.name
    );
    
    // Update consultation with Zoom details
    consultation.zoomMeetingId = zoomMeeting.meetingId;
    consultation.zoomMeetingLink = zoomMeeting.meetingLink;
    consultation.zoomStartUrl = zoomMeeting.startUrl;
    consultation.zoomPassword = zoomMeeting.password;
    await consultation.save();
    
    console.log('✅ Zoom meeting created:', zoomMeeting.meetingId);
    
    // Send confirmation emails
    console.log('📧 Sending confirmation emails...');
    await emailService.sendConfirmationEmails(consultation, {
      meetingLink: zoomMeeting.meetingLink,
      startUrl: zoomMeeting.startUrl,
      meetingId: zoomMeeting.meetingId,
      password: zoomMeeting.password
    });
    
    console.log('✅ Emails sent successfully');
  } catch (postError) {
    console.error('❌ Post-payment services failed (Zoom/Email):', postError.message);
    // We don't throw here because payment was already successful
    // But we re-throw to let caller know Zoom/email failed
    throw postError;
  }
}

// Create booking and initiate PayPal payment
export const createBooking = async (req, res) => {
  try {
    console.log('📝 Creating booking for user:', req.user?.email);
    console.log('Request body:', req.body);
    
    const { intent, preferredDate, preferredTime } = req.body;
    
    // Validate required fields
    if (!intent || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: intent, preferredDate, preferredTime'
      });
    }
    
    // Create consultation record with pending payment
    const consultation = new Consultation({
      user: req.user._id,
      name: req.user.name || req.user.displayName,
      email: req.user.email,
      intent: intent,
      preferredDate: new Date(preferredDate),
      preferredTime: preferredTime,
      amountPaid: 197,
      status: 'pending'
    });
    
    await consultation.save();
    console.log('✅ Consultation created:', consultation._id);

    // Add consultation to user's consultationBookings array
    try {
      const User = (await import('../models/User.model.js')).default;
      await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { consultationBookings: consultation._id } }
      );
      console.log('✅ Consultation added to user.consultationBookings');
    } catch (userUpdateErr) {
      console.error('❌ Failed to update user.consultationBookings:', userUpdateErr);
    }
    
    // Create PayPal order
    // Support both localhost and Render URLs
    const frontendUrl = process.env.FRONTEND_URL || process.env.RENDER_FRONTEND_URL || 'http://localhost:5173';
    const returnUrl = `${frontendUrl}/payment-success?consultationId=${consultation._id}`;
    const cancelUrl = `${frontendUrl}/payment-cancel?consultationId=${consultation._id}`;
    
    console.log('Creating PayPal order...');
    const paypalOrder = await paypalService.createOrder(
      197,
      'USD',
      consultation._id.toString(),
      returnUrl,
      cancelUrl
    );
    
    console.log('PayPal order created:', paypalOrder.orderId);
    
    // Update consultation with PayPal order ID
    consultation.paypalOrderId = paypalOrder.orderId;
    await consultation.save();
    
    // Send back the approval URL
    res.json({
      success: true,
      consultationId: consultation._id,
      approvalUrl: paypalOrder.approvalUrl
    });
    
  } catch (error) {
    console.error('❌ Create booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking'
    });
  }
};

// Capture payment after PayPal approval
export const capturePayment = async (req, res) => {
  try {
    const { orderId, consultationId, payerId } = req.body;
    
    console.log('💰 Capturing payment for order:', orderId);
    console.log('Consultation ID:', consultationId);
    
    if (!orderId || !consultationId) {
      return res.status(400).json({
        success: false,
        message: 'Missing orderId or consultationId'
      });
    }
    
    // Find the consultation
    const consultation = await Consultation.findById(consultationId);
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }
    
    // Verify user owns this consultation
    if (consultation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    // Check if consultation is already confirmed
    if (consultation.status === 'confirmed') {
      console.log('ℹ️ Consultation already confirmed, skipping payment capture');
      // Check if Zoom meeting already exists
      if (!consultation.zoomMeetingId) {
        console.log('ℹ️ Zoom meeting not found, creating now...');
        await createZoomMeetingAndSendEmails(consultation);
      }
      return res.json({
        success: true,
        message: 'Booking already confirmed',
        consultation: {
          id: consultation._id,
          meetingLink: consultation.zoomMeetingLink,
          date: consultation.preferredDate,
          time: consultation.preferredTime,
          amountPaid: consultation.amountPaid
        }
      });
    }
    
    // Capture payment with PayPal
    let paymentResult;
    try {
      paymentResult = await paypalService.captureOrder(orderId);
    } catch (paypalError) {
      console.error('❌ PayPal capture threw error:', paypalError.message);
      
      // Check if error is ORDER_ALREADY_CAPTURED - this means payment was already successful
      const errorData = paypalError.message;
      if (errorData.includes('ORDER_ALREADY_CAPTURED')) {
        console.log('ℹ️ Order already captured, checking PayPal status...');
        // Payment was already captured, mark as confirmed
        consultation.status = 'confirmed';
        consultation.paypalPaymentId = orderId; // Use orderId as paymentId
        await consultation.save();
        
        // Create Zoom meeting if not already created
        if (!consultation.zoomMeetingId) {
          console.log('ℹ️ Creating Zoom meeting for already-captured order...');
          try {
            await createZoomMeetingAndSendEmails(consultation);
          } catch (zoomEmailError) {
            console.error('❌ Zoom/Email creation failed for already-captured order:', zoomEmailError.message);
            // Continue - payment was already successful
          }
        }
        
        return res.json({
          success: true,
          message: 'Payment already captured, booking confirmed',
          consultation: {
            id: consultation._id,
            meetingLink: consultation.zoomMeetingLink,
            date: consultation.preferredDate,
            time: consultation.preferredTime,
            amountPaid: consultation.amountPaid
          }
        });
      }
      
      // For other PayPal errors, delete the consultation record and return error
      console.log('❌ Payment failed, deleting consultation record:', consultationId);
      
      // Remove consultation from user's consultationBookings array
      try {
        const User = (await import('../models/User.model.js')).default;
        await User.findByIdAndUpdate(
          consultation.user,
          { $pull: { consultationBookings: consultation._id } }
        );
        console.log('✅ Consultation removed from user.consultationBookings');
      } catch (userUpdateErr) {
        console.error('❌ Failed to remove consultation from user:', userUpdateErr);
      }
      
      // Delete the consultation record
      await Consultation.findByIdAndDelete(consultationId);
      
      return res.status(500).json({
        success: false,
        message: 'Payment failed. Please try again.'
      });
    }
    
    if (!paymentResult.captured) {
      console.log('❌ Payment capture failed for consultation:', consultationId, 'Status:', paymentResult.status);
      
      // Remove consultation from user's consultationBookings array
      try {
        const User = (await import('../models/User.model.js')).default;
        await User.findByIdAndUpdate(
          consultation.user,
          { $pull: { consultationBookings: consultation._id } }
        );
        console.log('✅ Consultation removed from user.consultationBookings');
      } catch (userUpdateErr) {
        console.error('❌ Failed to remove consultation from user:', userUpdateErr);
      }
      
      // Delete the consultation record
      await Consultation.findByIdAndDelete(consultationId);
      
      return res.status(400).json({
        success: false,
        message: 'Payment failed. Please try again.'
      });
    }
    
    // Payment was successfully captured
    consultation.paypalPaymentId = paymentResult.paymentId;
    consultation.status = 'confirmed';
    await consultation.save();
    
    console.log('✅ Payment captured:', paymentResult.paymentId);
    
    // Create Zoom meeting and send emails (non-blocking, don't fail the request if this fails)
    try {
      await createZoomMeetingAndSendEmails(consultation);
    } catch (zoomEmailError) {
      console.error('❌ Zoom/Email creation failed but payment was successful:', zoomEmailError.message);
      // Continue - payment was successful, user can access booking even if Zoom/email failed
    }
    
    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      consultation: {
        id: consultation._id,
        meetingLink: consultation.zoomMeetingLink, // Might be null if Zoom creation failed
        date: consultation.preferredDate,
        time: consultation.preferredTime,
        amountPaid: consultation.amountPaid
      }
    });
    
  } catch (error) {
    console.error('❌ Capture payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete booking'
    });
  }
};

// Get user's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Consultation.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      bookings: bookings.map(booking => ({
        id: booking._id,
        intent: booking.intent,
        date: booking.preferredDate,
        time: booking.preferredTime,
        meetingLink: booking.zoomMeetingLink,
        status: booking.status,
        amountPaid: booking.amountPaid,
        createdAt: booking.createdAt
      }))
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all bookings (admin only)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Consultation.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      bookings: bookings 
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update booking (admin only)
export const updateBooking = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const booking = await Consultation.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }
    
    res.json({ 
      success: true, 
      booking: booking 
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};