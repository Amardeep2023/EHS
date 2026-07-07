import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadRoot = path.join(__dirname, '..', '..', 'uploads');
const resourceDir = path.join(uploadRoot, 'resources');
const courseDir = path.join(uploadRoot, 'courses');
const thumbnailDir = path.join(courseDir, 'thumbnails');
const audioDir = path.join(courseDir, 'audio');
const pdfDir = path.join(courseDir, 'pdf');
const productDir = path.join(uploadRoot, 'products');

for (const dir of [uploadRoot, resourceDir, courseDir, thumbnailDir, audioDir, pdfDir, productDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const createStorage = (destination) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, destination),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

export const uploadProductImage = multer({
  storage: createStorage(productDir),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for product images'), false);
    }
  },
});

export const uploadResource = multer({
  storage: createStorage(resourceDir),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for resources'), false);
    }
  },
});

export const uploadCourseFiles = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) return cb(null, thumbnailDir);
      if (file.mimetype.startsWith('audio/')) return cb(null, audioDir);
      if (file.mimetype === 'application/pdf') return cb(null, pdfDir);
      cb(null, courseDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/webm', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image, audio, and PDF files are allowed'), false);
    }
  },
}).fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'audio', maxCount: 10 },
  { name: 'pdf', maxCount: 10 },
]);
