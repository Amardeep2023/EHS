import mongoose from 'mongoose';
import Course from '../models/Course.model.js';
import paypalService from '../../services/paypal.service.js';
import User from '../models/User.model.js';

// ── Public: list all published courses (no content) ──────────────
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select('title slug shortDescription price coverImage totalDays enrollmentCount')
      .lean();
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Protected: get full course content (only if purchased) ───────
export const getCourse = async (req, res) => {
  try {
    const { slug } = req.params;
    // Try to find by slug first, then by _id
    let course = await Course.findOne({ slug, isPublished: true }).lean();
    if (!course) {
      // If not found by slug, try by _id (assuming slug could be an ObjectId)
      if (mongoose.Types.ObjectId.isValid(slug)) {
        course = await Course.findOne({ _id: slug, isPublished: true }).lean();
      }
    }
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // Check if user has purchased
    const user = await User.findById(req.user._id).lean();
    const hasPurchased = user.purchasedCourses?.some(
      p => p.courseId.toString() === course._id.toString()
    );

    if (!hasPurchased) {
      // Return metadata only — no day content
      const { days, ...meta } = course;
      return res.json({ success: true, course: meta, hasPurchased: false });
    }

    res.json({ success: true, course, hasPurchased: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Admin: create course ─────────────────────────────────────────
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── Admin: update course ─────────────────────────────────────────
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!course) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── Admin: delete course ─────────────────────────────────────────
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Initiate PayPal purchase ─────────────────────────────────────
export const initiatePurchase = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId).select('title price slug');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const user = await User.findById(req.user._id);
    const alreadyPurchased = user.purchasedCourses?.some(
      p => p.courseId.toString() === courseId
    );
    if (alreadyPurchased) {
      return res.status(400).json({ success: false, message: 'Course already purchased' });
    }

    const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
    const { orderId, approvalUrl } = await paypalService.createOrder(
      course.price,
      'USD',
      courseId,                                                           // bookingId = courseId
      `${CLIENT_URL}/course-payment-success?courseId=${courseId}`,
      `${CLIENT_URL}/course-payment-cancel`
    );

    // Persist pending order on user so capture can verify
    user.purchasedCourses = user.purchasedCourses || [];
    user._pendingCourseOrder = orderId; // temp; capture will finalize
    // Store as a temp field — use a separate PendingOrder model if you prefer
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        purchasedCourses: {
          courseId,
          paypalOrderId: orderId,
          amountPaid: 0,          // 0 = pending; set on capture
          purchasedAt: new Date(),
        },
      },
    });

    res.json({ success: true, orderId, approvalUrl });
  } catch (err) {
    console.error('Purchase initiation error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Capture PayPal payment → grant access ────────────────────────
export const capturePurchase = async (req, res) => {
  try {
    const { orderId, courseId } = req.body;
    const result = await paypalService.captureOrder(orderId);

    if (!result.captured) {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    // Update the pending record: set amountPaid (signals confirmed purchase)
    await User.findOneAndUpdate(
      { _id: req.user._id, 'purchasedCourses.paypalOrderId': orderId },
      {
        $set: {
          'purchasedCourses.$.amountPaid': parseFloat(result.amount),
        },
      }
    );

    // Bump enrollment count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

    res.json({ success: true, message: 'Course access granted' });
  } catch (err) {
    console.error('Capture error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Check purchase status ────────────────────────────────────────
export const checkPurchase = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.user._id).lean();
    const purchase = user.purchasedCourses?.find(
      p => p.courseId.toString() === courseId && p.amountPaid > 0
    );
    res.json({ success: true, hasPurchased: !!purchase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
