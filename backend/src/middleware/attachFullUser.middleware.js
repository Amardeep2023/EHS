import User from '../models/User.model.js';

// Middleware to ensure req.user has full user data (id, name, email)
export async function attachFullUser(req, res, next) {
  if (!req.user || !(req.user.id || req.user._id)) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
  try {
    // Always fetch the user to ensure up-to-date info
    const user = await User.findById(req.user.id || req.user._id).select('name email');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user._id = user._id;
    req.user.id = user._id.toString();
    req.user.name = user.name;
    req.user.email = user.email;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user details' });
  }
}
