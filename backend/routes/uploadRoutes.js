const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/uploadMiddleware');
const { uploadMedia, deleteMedia } = require('../controllers/uploadController');
const { protectAdmin } = require('../middleware/authMiddleware');

// @route POST /api/upload
// Accepts multipart/form-data with field name 'file' (Admin only)
// Falls back to JSON body with { image: "data:image/..." }
router.post('/', protectAdmin, uploadMiddleware.single('file'), uploadMedia);

// @route DELETE /api/upload
// Deletes specified image from Cloudinary by public_id or URL (Admin only)
router.delete('/', protectAdmin, deleteMedia);

module.exports = router;
