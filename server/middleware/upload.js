import multer from 'multer';
import path from 'path';

const ALLOWED_TYPES = /jpeg|jpg|png|webp|gif/;

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});

const fileFilter = (req, file, cb) => {
  const valid =
    ALLOWED_TYPES.test(path.extname(file.originalname).toLowerCase()) &&
    ALLOWED_TYPES.test(file.mimetype);
  cb(valid ? null : new Error('Only image files are allowed'), valid);
};

export default multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
