import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
  }

  getTransporter() {
    if (this.transporter) return this.transporter;

    const user = process.env.EMAIL_USER || process.env.SMTP_USER;
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    if (!user || !pass) {
      console.error('❌ Missing email credentials in environment variables');
      return null;
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
    return this.transporter;
  }

  async sendConfirmationEmails(consultation, zoomDetails) {
    const transporter = this.getTransporter();
    if (!transporter) {
      console.error('❌ Cannot send emails: Transporter not configured');
      return;
    }

    const { name, email, preferredDate, preferredTime, intent } = consultation;
    // User email
    const userEmailHtml = `
      <div style="font-family: 'Georgia', serif; color: #3E2928; background-color: #FDFBF7; padding: 40px;">
        <h2 style="color: #D4AF37;">Booking Confirmed</h2>
        <p>Hello ${name},</p>
        <p>Your consultation session has been confirmed. Here are the details:</p>
        <div style="background-color: white; padding: 20px; border: 1px solid #D4AF37; border-radius: 8px;">
          <p><strong>Date:</strong> ${new Date(preferredDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${preferredTime}</p>
          <p><strong>Meeting Link:</strong> <a href="${zoomDetails.meetingLink}">${zoomDetails.meetingLink}</a></p>
          <p><strong>Password:</strong> ${zoomDetails.password || 'Not required'}</p>
        </div>
      </div>
    `;

    // Admin email
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Consultation Booking! 🎯</h1>
          </div>
          <div class="content">
            <h2>New Session Booked</h2>
            <p><strong>Client:</strong> ${consultation.name} (${consultation.email})</p>
            <p><strong>Date:</strong> ${new Date(consultation.preferredDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${consultation.preferredTime}</p>
            <p><strong>Amount Paid:</strong> $${consultation.amountPaid}</p>
            <p><strong>Client's Intention:</strong> ${consultation.intent}</p>
            
            <div class="meeting-details">
              <h3>Host Zoom Link:</h3>
              <p><a href="${zoomDetails.startUrl}">Start Meeting as Host</a></p>
              <p><strong>Meeting ID:</strong> ${zoomDetails.meetingId}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await transporter.sendMail({
        from: '"Embracing Higher Self" <noreply@embracinghigherself.com>',
        to: email,
        subject: 'Consultation Booking Confirmed ✨',
        html: userEmailHtml
      });

      // Admin email
      const adminEmailHtml = `
        <div style="font-family: 'Georgia', serif; color: #3E2928; background-color: #FDFBF7; padding: 40px;">
          <h2 style="color: #D4AF37;">New Booking Notification</h2>
          <p>A new consultation has been booked and paid for.</p>
          <div style="background-color: white; padding: 20px; border: 1px solid #D4AF37; border-radius: 8px;">
            <p><strong>Client:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date(preferredDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${preferredTime}</p>
            <p><strong>Intent:</strong> ${intent}</p>
            <p><strong>Host Zoom Link:</strong> <a href="${zoomDetails.startUrl}">${zoomDetails.startUrl}</a></p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: '"Booking System" <noreply@embracinghigherself.com>',
        to: process.env.ADMIN_EMAIL || user,
        subject: 'New Consultation Booking Received 🧘‍♂️',
        html: adminEmailHtml
      });

      console.log('✅ Confirmation emails sent successfully');
      return true;
    } catch (error) {
      console.error('❌ Error sending emails:', error.message);
      throw new Error('Failed to send confirmation emails');
    }
  }
}

export default new EmailService();