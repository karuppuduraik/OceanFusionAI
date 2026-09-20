const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `satellite-${uniqueSuffix}${ext}`);
  },
});

// File filter validation (PNG, JPG, JPEG)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid image file format. Only PNG, JPG, and JPEG images are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;
