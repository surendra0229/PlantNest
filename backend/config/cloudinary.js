const crypto = require('crypto');
const https = require('https');

// Cloudinary Configuration from Environment Variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

let cloudinarySDK = null;
try {
  cloudinarySDK = require('cloudinary').v2;
  if (cloudName && apiKey && apiSecret) {
    cloudinarySDK.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
    console.log('☁️ Cloudinary SDK configured successfully with cloud:', cloudName);
  }
} catch (e) {
  console.log('ℹ️ Cloudinary SDK package not found, using Cloudinary REST API engine.');
}

/**
 * Extract public_id from a Cloudinary image URL
 * e.g., https://res.cloudinary.com/ibjx8odi/image/upload/v1726700000/plantnest/plant_123.jpg -> plantnest/plant_123
 */
const extractPublicId = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return null;
  }
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    let path = parts[1];
    // Remove version tag e.g. v123456789/
    path = path.replace(/^v\d+\//, '');
    // Remove extension e.g. .jpg, .png
    const lastDotIndex = path.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex);
    }
    return path;
  } catch (err) {
    return null;
  }
};

/**
 * Upload image buffer or base64 string to Cloudinary
 * @param {Buffer|String} fileData - File Buffer or Base64 String
 * @param {String} folder - Folder name in Cloudinary (default: 'plantnest')
 * @returns {Promise<{url: string, public_id: string}>}
 */
const uploadToCloudinary = async (fileData, folder = 'plantnest') => {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing.');
  }

  // Option A: Use Cloudinary SDK if loaded
  if (cloudinarySDK) {
    try {
      const uploadOptions = {
        folder: folder,
        resource_type: 'auto'
      };

      let result;
      if (Buffer.isBuffer(fileData)) {
        result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinarySDK.uploader.upload_stream(
            uploadOptions,
            (error, res) => {
              if (error) reject(error);
              else resolve(res);
            }
          );
          uploadStream.end(fileData);
        });
      } else {
        // Base64 or URL string
        result = await cloudinarySDK.uploader.upload(fileData, uploadOptions);
      }

      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (sdkErr) {
      console.warn('Cloudinary SDK upload error, trying REST API fallback:', sdkErr.message);
    }
  }

  // Option B: Cloudinary REST API Engine
  return new Promise((resolve, reject) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    let base64String = '';
    if (Buffer.isBuffer(fileData)) {
      base64String = `data:image/jpeg;base64,${fileData.toString('base64')}`;
    } else if (typeof fileData === 'string') {
      base64String = fileData;
    } else {
      return reject(new Error('Invalid file format provided for Cloudinary upload.'));
    }

    const postData = new URLSearchParams({
      file: base64String,
      api_key: apiKey,
      timestamp: timestamp.toString(),
      folder: folder,
      signature: signature
    }).toString();

    const options = {
      hostname: 'api.cloudinary.com',
      port: 443,
      path: `/v1_1/${cloudName}/image/upload`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300 && json.secure_url) {
            resolve({
              url: json.secure_url,
              public_id: json.public_id
            });
          } else {
            reject(new Error(json.error?.message || 'Cloudinary API upload failed.'));
          }
        } catch (parseErr) {
          reject(new Error('Failed to parse Cloudinary API response.'));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
};

/**
 * Delete image from Cloudinary by public_id
 * @param {String} publicId - Cloudinary public_id
 * @returns {Promise<{result: string}>}
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId || !cloudName || !apiKey || !apiSecret) {
    return { result: 'ignored' };
  }

  // Option A: Use Cloudinary SDK if loaded
  if (cloudinarySDK) {
    try {
      const res = await cloudinarySDK.uploader.destroy(publicId);
      return res;
    } catch (err) {
      console.warn('Cloudinary SDK destroy error, trying REST API fallback:', err.message);
    }
  }

  // Option B: Cloudinary REST API Engine
  return new Promise((resolve, reject) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const postData = new URLSearchParams({
      public_id: publicId,
      api_key: apiKey,
      timestamp: timestamp.toString(),
      signature: signature
    }).toString();

    const options = {
      hostname: 'api.cloudinary.com',
      port: 443,
      path: `/v1_1/${cloudName}/image/destroy`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          resolve({ result: 'error' });
        }
      });
    });

    req.on('error', (err) => {
      console.error('Cloudinary destroy error:', err.message);
      resolve({ result: 'error', error: err.message });
    });

    req.write(postData);
    req.end();
  });
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId
};
