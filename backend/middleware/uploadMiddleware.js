let multer;
try {
  multer = require('multer');
} catch (e) {
  multer = null;
}

// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Multer Storage setup (Memory storage to buffer file into memory before streaming to Cloudinary)
let uploadMiddleware;

if (multer) {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP image formats are supported.'), false);
    }
  };

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: MAX_FILE_SIZE
    },
    fileFilter: fileFilter
  });

  const handleMulterError = (err, res, next) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum allowed file size is 10MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload validation error.'
      });
    }
    next();
  };

  uploadMiddleware = {
    single: (fieldName) => (req, res, next) => {
      upload.single(fieldName)(req, res, (err) => handleMulterError(err, res, next));
    },
    fields: (fieldsConfig) => (req, res, next) => {
      upload.fields(fieldsConfig)(req, res, (err) => handleMulterError(err, res, next));
    },
    array: (fieldName, maxCount = 5) => (req, res, next) => {
      upload.array(fieldName, maxCount)(req, res, (err) => handleMulterError(err, res, next));
    },
    any: () => (req, res, next) => {
      upload.any()(req, res, (err) => handleMulterError(err, res, next));
    }
  };
} else {
  // Fallback if Multer is not installed yet
  uploadMiddleware = {
    single: () => (req, res, next) => next(),
    fields: () => (req, res, next) => next(),
    array: () => (req, res, next) => next(),
    any: () => (req, res, next) => next()
  };
}

module.exports = uploadMiddleware;
