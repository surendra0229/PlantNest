const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  deleteAddress,
  googleAuth,
  googleAuthCallback
} = require('../controllers/authController');
const { protectUser } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.post('/logout', logoutUser);
router.get('/me', protectUser, getUserProfile);
router.put('/profile', protectUser, updateUserProfile);
router.post('/addresses', protectUser, addAddress);
router.delete('/addresses/:id', protectUser, deleteAddress);

module.exports = router;
