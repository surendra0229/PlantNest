const User = require('../models/User');
const { sendUserToken, setUserTokenCookie, clearUserToken } = require('../utils/jwt');
const passport = require('../config/passport');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // SECURITY: Block admin email from being registered as a normal user
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
    if (adminEmail && email.toLowerCase() === adminEmail) {
      return res.status(400).json({
        success: false,
        message: 'This email address is not available for registration.'
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email address'
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || ''
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully. Please log in with your credentials.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token cookie
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    sendUserToken(res, user._id, 200, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private (User)
const logoutUser = async (req, res) => {
  clearUserToken(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private (User)
const getUserProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (User)
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        addresses: updatedUser.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add shipping address
// @route   POST /api/auth/addresses
// @access  Private (User)
const addAddress = async (req, res, next) => {
  try {
    const { fullName, phone, street, city, state, postalCode, country, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (isDefault) {
      user.addresses.forEach(addr => { addr.isDefault = false; });
    }

    user.addresses.push({
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country: country || 'India',
      isDefault: isDefault || user.addresses.length === 0
    });

    await user.save();

    res.status(201).json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete shipping address
// @route   DELETE /api/auth/addresses/:id
// @access  Private (User)
const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();

    res.status(200).json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initiate Google OAuth authentication
// @route   GET /api/auth/google
// @access  Public
const googleAuth = (req, res, next) => {
  const clientUrl = (process.env.CLIENT_URL || req.headers.origin || req.headers.referer || 'https://plant-nest-alpha.vercel.app').replace(/\/$/, '');
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId.includes('dummy') || clientSecret.includes('dummy')) {
    const errorMsg = encodeURIComponent('Google OAuth is not configured with valid Google Cloud Console credentials in backend/.env');
    return res.redirect(`${clientUrl}/login?error=${errorMsg}`);
  }

  try {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
      prompt: 'select_account'
    })(req, res, next);
  } catch (err) {
    console.error('Google Auth Init Error:', err);
    const errorMsg = encodeURIComponent('Failed to initiate Google OAuth sign-in: ' + err.message);
    return res.redirect(`${clientUrl}/login?error=${errorMsg}`);
  }
};

// @desc    Google OAuth callback endpoint
// @route   GET /api/auth/google/callback
// @access  Public
const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    const clientUrl = (process.env.CLIENT_URL || req.headers.origin || req.headers.referer || 'https://plant-nest-alpha.vercel.app').replace(/\/$/, '');

    if (err) {
      console.error('Google OAuth Authentication Error:', err);
      const errorMsg = encodeURIComponent(err.message || 'Google authentication failed');
      return res.redirect(`${clientUrl}/login?error=${errorMsg}`);
    }

    if (!user) {
      console.warn('Google OAuth Warning: No user returned');
      return res.redirect(`${clientUrl}/login?error=Google%20Authentication%20Cancelled%20or%20Denied`);
    }

    try {
      // Generate & set HTTP-only cookie with app's JWT, and return token for cross-site storage
      const token = setUserTokenCookie(res, user._id);

      // Redirect to frontend dashboard with success query parameter and token
      return res.redirect(`${clientUrl}/dashboard?oauth=success&token=${token}`);
    } catch (tokenError) {
      console.error('JWT Token Error during Google OAuth:', tokenError);
      return res.redirect(`${clientUrl}/login?error=Token%20Generation%20Failed`);
    }
  })(req, res, next);
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  deleteAddress,
  googleAuth,
  googleAuthCallback
};
