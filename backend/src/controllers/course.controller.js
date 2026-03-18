import Course from '../models/Course.model.js';
import User from '../models/User.model.js';

export async function getAllCourses(req, res) {
  try {
    const courses = await Course.find({ isPublished: true }).select('-modules');
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getCourse(req, res) {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isPublished: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // If authenticated and purchased, return full course; otherwise preview
    if (req.user) {
      const user = await User.findById(req.user.id);
      const hasPurchased = user?.purchasedCourses.some((id) => id.equals(course._id));
      if (hasPurchased) return res.json({ success: true, course, access: 'full' });
    }

    // Return preview only (no video URLs)
    const preview = course.toObject();
    preview.modules = preview.modules.map((m) => ({
      ...m,
      lessons: m.lessons.map((l, i) => ({ ...l, videoUrl: i === 0 ? l.videoUrl : undefined })),
    }));
    res.json({ success: true, course: preview, access: 'preview' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createCourse(req, res) {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function updateCourse(req, res) {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function deleteCourse(req, res) {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
