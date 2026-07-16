import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.model.js';
import Course from '../models/Course.model.js';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already in use' });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, country: user.country } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, country: user.country } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Handle Google OAuth token verification and user creation/update
 * @route POST /api/auth/google
 * @param {string} token - Google ID token from frontend
 */
export async function googleAuth(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token required' });
    }

    // Verify the Google token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar, locale } = payload;

    // Check if user exists or create new
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        role: 'user',
      });
    } else if (!user.googleId) {
      // Link Google account if user exists without Google ID
      user.googleId = googleId;
      user.avatar = avatar;
      await user.save();
    }

    // Generate JWT token
    const authToken = signToken(user._id);

    res.json({
      success: true,
      token: authToken,
      locale: locale || null,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        country: user.country,
        purchasedCourses: user.purchasedCourses,
      },
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ success: false, message: 'Invalid token or authentication failed' });
  }
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .populate('purchasedProducts', 'title price')
      .populate('consultationBookings');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const purchasedCourses = [];
    for (const purchase of user.purchasedCourses || []) {
      const courseId = purchase.courseId?.toString?.() || purchase.courseId;
      if (!courseId) continue;

      // Only include fully paid / completed purchases — skip stale pending records
      const isPaid = Number(purchase.amountPaid || 0) > 0 || purchase.paymentStatus === 'completed';
      if (!isPaid) continue;

      const course = await Course.findById(courseId).select('title price thumbnail slug').lean();
      if (!course) continue;

      purchasedCourses.push({
        _id: course._id,
        courseId: course._id,
        title: course.title,
        price: course.price,
        thumbnail: course.thumbnail || '',
        slug: course.slug,
        purchasedAt: purchase.purchasedAt,
        amountPaid: purchase.amountPaid,
      });
    }

    res.json({ success: true, user: { ...user.toObject(), purchasedCourses } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Update user profile
 * @route PATCH /api/auth/profile
 */
export async function updateProfile(req, res) {
  try {
    const { name, avatar } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Update user's selected country
 * @route PATCH /api/auth/country
 */
export async function updateCountry(req, res) {
  try {
    const { country } = req.body;

    if (!country || typeof country !== 'string' || country.length > 10) {
      return res.status(400).json({ success: false, message: 'Invalid country code' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { country: country.toUpperCase() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, country: user.country });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
