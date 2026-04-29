import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.model.js';

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
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
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
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
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
    const { sub: googleId, email, name, picture: avatar } = payload;

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
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
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
      .populate('purchasedCourses', 'title price thumbnail')
      .populate('purchasedProducts', 'title price')
      .populate('consultationBookings');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
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
