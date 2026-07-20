import mongoose from 'mongoose';
import Course from '../models/Course.model.js';
import paypalService from '../../services/paypal.service.js';
import User from '../models/User.model.js';

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select('title slug shortDescription description price countryPrices thumbnail coverImage totalDays enrollmentCount content')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .select('title slug shortDescription description price countryPrices thumbnail coverImage totalDays enrollmentCount content')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCourse = async (req, res) => {
  try {
    const { slug } = req.params;
    let course = null;

    if (mongoose.Types.ObjectId.isValid(slug)) {
      course = await Course.findOne({ _id: slug, isPublished: true }).lean();
    }

    if (!course) {
      course = await Course.findOne({ slug, isPublished: true }).lean();
    }

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const user = await User.findById(req.user?.id).lean();
    const hasPurchased = !!user && (user.purchasedCourses || []).some((purchase) => {
      const purchaseCourseId = purchase.courseId?.toString?.() || purchase.courseId;
      if (purchaseCourseId !== course._id.toString()) return false;
      // Consider purchased if: amountPaid > 0, paymentStatus is completed, or it's a local/dev purchase
      return (
        Number(purchase.amountPaid || 0) > 0 ||
        purchase.paymentStatus === 'completed' ||
        purchase.paypalOrderId?.startsWith?.('local-') ||
        purchase.paypalOrderId?.startsWith?.('dummy-')
      );
    });

    if (!hasPurchased) {
      const { content, ...meta } = course;
      return res.json({ success: true, course: meta, hasPurchased: false });
    }

    res.json({ success: true, course, hasPurchased: true });
  } catch (err) {
    console.error('getCourse error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, shortDescription, price, countryPrices, thumbnail, content } = req.body;

    if (!title || !description || price === undefined) {
      return res.status(400).json({ success: false, message: 'Title, description, and price are required' });
    }

    // Parse countryPrices if provided (convert plain object to Map-friendly format)
    const parsedCountryPrices = {};
    if (countryPrices && typeof countryPrices === 'object') {
      for (const [code, val] of Object.entries(countryPrices)) {
        if (code && val !== undefined && val !== null && val !== '') {
          parsedCountryPrices[code] = Number(val);
        }
      }
    }

    const payload = {
      title,
      description,
      shortDescription: shortDescription || '',
      price: Number(price),
      countryPrices: Object.keys(parsedCountryPrices).length > 0 ? parsedCountryPrices : {},
      thumbnail: thumbnail || '',
      coverImage: thumbnail || '',
      isPublished: true,
      totalDays: Array.isArray(content) ? Math.max(content.length, 1) : 1,
      content: Array.isArray(content)
        ? content.filter((item) => item?.title || item?.audioUrl || item?.pdfUrl).map((item) => ({
            title: item.title || 'Lesson Content',
            audioUrl: item.audioUrl || '',
            audioTitle: item.audioTitle || 'Audio Lesson',
            pdfUrl: item.pdfUrl || '',
            pdfTitle: item.pdfTitle || 'Lesson PDF',
          }))
        : [],
    };

    const course = await Course.create(payload);
    res.status(201).json({ success: true, course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const payload = { ...req.body };
    // Parse countryPrices if provided
    if (payload.countryPrices && typeof payload.countryPrices === 'object') {
      const parsed = {};
      for (const [code, val] of Object.entries(payload.countryPrices)) {
        if (code && val !== undefined && val !== null && val !== '') {
          parsed[code] = Number(val);
        }
      }
      payload.countryPrices = Object.keys(parsed).length > 0 ? parsed : {};
    }
    // Keep coverImage in sync with thumbnail
    if (payload.thumbnail) {
      payload.coverImage = payload.thumbnail;
    }
    if (payload.content) {
      payload.content = payload.content.filter((item) => item?.title || item?.audioUrl || item?.pdfUrl).map((item) => ({
        title: item.title || 'Lesson Content',
        audioUrl: item.audioUrl || '',
        audioTitle: item.audioTitle || 'Audio Lesson',
        pdfUrl: item.pdfUrl || '',
        pdfTitle: item.pdfTitle || 'Lesson PDF',
      }));
    }
    const course = await Course.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const initiatePurchase = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId).select('title price slug');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    // Only block if there's a COMPLETED purchase (paid or fully captured).
    // Allow retry if the previous attempt was only 'pending' (user didn't complete payment).
    const completedPurchase = (user.purchasedCourses || []).some((purchase) =>
      purchase.courseId?.toString() === courseId &&
      (Number(purchase.amountPaid || 0) > 0 || purchase.paymentStatus === 'completed')
    );
    if (completedPurchase) {
      return res.status(400).json({ success: false, message: 'Course already purchased' });
    }

    // Remove any stale pending records for this course (from previous failed attempts)
    user.purchasedCourses = (user.purchasedCourses || []).filter(
      (purchase) => purchase.courseId?.toString() !== courseId
    );

    // Support localhost, Render, and Vercel frontend URLs
    const CLIENT_URL = process.env.CLIENT_URL || process.env.RENDER_FRONTEND_URL || process.env.VERCEL_FRONTEND_URL || 'http://localhost:5173';

    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      const localOrderId = `local-${courseId}-${Date.now()}`;
      user.purchasedCourses = user.purchasedCourses || [];
      user.purchasedCourses.push({
        courseId,
        paypalOrderId: localOrderId,
        amountPaid: 0,
        paymentStatus: 'pending',
        purchasedAt: new Date(),
      });
      await user.save();
      return res.json({ success: true, orderId: localOrderId, approvalUrl: `${CLIENT_URL}/course-payment-success?token=${localOrderId}&courseId=${courseId}` });
    }

    const { orderId, approvalUrl } = await paypalService.createOrder(
      course.price,
      'USD',
      courseId,
      `${CLIENT_URL}/course-payment-success?courseId=${courseId}`,
      `${CLIENT_URL}/course-payment-cancel`
    );

    user.purchasedCourses = user.purchasedCourses || [];
    user.purchasedCourses.push({
      courseId,
      paypalOrderId: orderId,
      amountPaid: 0,
      paymentStatus: 'pending',
      purchasedAt: new Date(),
    });
    await user.save();

    res.json({ success: true, orderId, approvalUrl });
  } catch (err) {
    console.error('Purchase initiation error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const capturePurchase = async (req, res) => {
  try {
    const { orderId, courseId } = req.body;

    if (orderId?.startsWith('local-')) {
      await User.findOneAndUpdate(
        { _id: req.user.id, 'purchasedCourses.paypalOrderId': orderId },
        {
          $set: {
            'purchasedCourses.$.amountPaid': Number(req.body.amount || 1),
            'purchasedCourses.$.paymentStatus': 'completed',
          },
        }
      );
      await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
      return res.json({ success: true, message: 'Course access granted' });
    }

    // Idempotency check: if already completed, skip PayPal and return success
    const user = await User.findOne({
      _id: req.user.id,
      'purchasedCourses.paypalOrderId': orderId,
    }).lean();

    if (user) {
      const purchase = (user.purchasedCourses || []).find(
        (p) => p.paypalOrderId === orderId
      );
      if (purchase && purchase.paymentStatus === 'completed') {
        return res.json({ success: true, message: 'Already captured', alreadyCaptured: true });
      }
    }

    const result = await paypalService.captureOrder(orderId);

    if (!result.captured) {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    await User.findOneAndUpdate(
      { _id: req.user.id, 'purchasedCourses.paypalOrderId': orderId },
      {
        $set: {
          'purchasedCourses.$.amountPaid': parseFloat(result.amount),
          'purchasedCourses.$.paymentId': result.paymentId || '',
          'purchasedCourses.$.paymentStatus': 'completed',
        },
      }
    );

    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

    res.json({ success: true, message: 'Course access granted' });
  } catch (err) {
    console.error('Capture error:', err);
    // If PayPal says ORDER_ALREADY_CAPTURED, treat as success (idempotent)
    const errorMsg = typeof err.message === 'string' ? err.message : '';
    if (errorMsg.includes('ORDER_ALREADY_CAPTURED') || errorMsg.includes('DUPLICATE')) {
      return res.json({ success: true, message: 'Already captured', alreadyCaptured: true });
    }
    res.status(500).json({ success: false, message: err.message, alreadyCaptured: false });
  }
};

export const checkPurchase = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.user.id).lean();
    const purchase = (user.purchasedCourses || []).find(
      (item) => item.courseId?.toString() === courseId && Number(item.amountPaid || 0) > 0
    );
    res.json({ success: true, hasPurchased: !!purchase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
