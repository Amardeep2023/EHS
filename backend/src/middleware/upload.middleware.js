import multer from 'multer';
import path from 'path';

function storage(destination) {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, destination),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });
}

const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Only ${allowedTypes.join(', ')} files are allowed`), false);
  }
};

export const uploadCourse = multer({
  storage: storage('uploads/courses'),
  fileFilter: fileFilter(['video/mp4', 'video/webm', 'image/jpeg', 'image/png']),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

export const uploadProduct = multer({
  storage: storage('uploads/products'),
  fileFilter: fileFilter(['application/pdf', 'image/jpeg', 'image/png']),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

export const uploadResource = multer({
  storage: storage('uploads/resources'),
  fileFilter: fileFilter(['application/pdf', 'video/mp4', 'image/jpeg', 'image/png']),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});
