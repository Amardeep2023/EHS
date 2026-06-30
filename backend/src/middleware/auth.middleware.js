import jwt from 'jsonwebtoken';

export function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized — no token' });
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
}

/**
 * Optional auth — decodes JWT if present, but does NOT block unauthenticated requests.
 * Sets req.user when a valid token is provided; otherwise req.user remains undefined.
 */
export function optionalProtect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    } catch {
      // Token invalid — just continue without user
    }
  }
  next();
}

export function requirePurchase(model) {
  return async (req, res, next) => {
    const user = await model.findById(req.user.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    const purchased = user.purchasedCourses.some((id) => id.toString() === req.params.id);
    if (!purchased) {
      return res.status(403).json({ success: false, message: 'Course not purchased' });
    }
    next();
  };
}
