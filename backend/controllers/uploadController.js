const path = require('path');
const fs = require('fs');
const { uploadToCloudinary, deleteFromCloudinary, extractPublicId } = require('../config/cloudinary');

// @desc    Upload file/media to Cloudinary
// @route   POST /api/upload
// @access  Admin only
const uploadMedia = async (req, res, next) => {
  try {
    let imageSource = null; // Will be a base64 data URL string OR a Buffer

    // 1. JSON body { image: "data:image/jpeg;base64,..." }  (primary path)
    if (req.body && req.body.image && typeof req.body.image === 'string') {
      const raw = req.body.image.trim();
      if (raw.startsWith('data:image')) {
        imageSource = raw; // pass the full data URL directly to Cloudinary SDK
        console.log(`📦 Received base64 image via JSON body | length: ${raw.length} chars`);
      }
    }

    // 2. multer single() → req.file.buffer  (fallback for multipart requests)
    if (!imageSource && req.file && req.file.buffer) {
      imageSource = req.file.buffer;
      console.log(`📦 Multer single file: ${req.file.originalname} | ${req.file.size} bytes`);
    }

    // 3. multer fields() → req.files  (secondary fallback)
    if (!imageSource && req.files) {
      const found =
        (req.files['file'] && req.files['file'][0]) ||
        (req.files['image'] && req.files['image'][0]);
      if (found && found.buffer) {
        imageSource = found.buffer;
        console.log(`📦 Multer fields file: ${found.originalname} | ${found.size} bytes`);
      }
    }

    if (!imageSource) {
      console.error(
        '❌ No image source found.',
        '| req.body keys:', Object.keys(req.body || {}),
        '| req.file:', !!req.file,
        '| req.files:', !!req.files,
        '| content-type:', req.headers['content-type']
      );
      return res.status(400).json({
        success: false,
        message: 'No image data provided. Please select an image and try again.'
      });
    }

    // Upload to Cloudinary (accepts Buffer or base64 data URL string)
    console.log(`☁️ Uploading to Cloudinary, folder: plantnest...`);
    try {
      const cloudinaryResult = await uploadToCloudinary(imageSource, 'plantnest');
      console.log(`✅ Cloudinary upload success: ${cloudinaryResult.url}`);
      return res.status(200).json({
        success: true,
        url: cloudinaryResult.url,
        public_id: cloudinaryResult.public_id,
        storage: 'cloudinary'
      });
    } catch (cloudErr) {
      console.error('❌ Cloudinary upload error:', cloudErr.message);

      // Local file fallback (development only)
      if (process.env.NODE_ENV !== 'production') {
        try {
          let fileBuffer;
          if (Buffer.isBuffer(imageSource)) {
            fileBuffer = imageSource;
          } else if (typeof imageSource === 'string' && imageSource.startsWith('data:image')) {
            const matches = imageSource.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
            if (matches) fileBuffer = Buffer.from(matches[2], 'base64');
          }

          if (fileBuffer) {
            const uploadsDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
            const filename = `plant_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.jpg`;
            fs.writeFileSync(path.join(uploadsDir, filename), fileBuffer);
            console.warn(`⚠️ Cloudinary failed, saved locally: /uploads/${filename}`);
            return res.status(200).json({
              success: true,
              url: `/uploads/${filename}`,
              public_id: null,
              storage: 'local-fallback',
              warning: 'Cloudinary unavailable — image saved locally (development only).'
            });
          }
        } catch (localErr) {
          console.error('❌ Local fallback failed:', localErr.message);
        }
      }

      return res.status(500).json({
        success: false,
        message: cloudErr.message || 'Failed to upload image to Cloudinary.'
      });
    }

  } catch (error) {
    console.error('❌ Upload controller error:', error.message);
    next(error);
  }
};

// @desc    Delete media asset from Cloudinary
// @route   DELETE /api/upload
// @access  Admin only
const deleteMedia = async (req, res, next) => {
  try {
    const { public_id, url } = req.body;
    const targetPublicId = public_id || extractPublicId(url);

    if (!targetPublicId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid public_id or Cloudinary URL to delete.'
      });
    }

    const destroyResult = await deleteFromCloudinary(targetPublicId);
    return res.status(200).json({
      success: true,
      message: 'Media deleted from Cloudinary.',
      result: destroyResult
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadMedia, deleteMedia };
