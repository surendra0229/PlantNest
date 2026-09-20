const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { USER_COOKIE, ADMIN_COOKIE } = require('../utils/jwt');

// Protect User Routes
const protectUser = async (req, res, next) => {
  let token;

  // Check Authorization header first (Bearer <token>), fallback to HttpOnly cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && (req.cookies[USER_COOKIE] || req.cookies.userToken || req.cookies.token)) {
    token = req.cookies[USER_COOKIE] || req.cookies.userToken || req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please log in as a user.'
    });
  }

  try {
    const secret = process.env.JWT_USER_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Server configuration error: JWT_USER_SECRET missing.' });
    }
    const decoded = jwt.verify(token, secret);

    if (decoded.role && decoded.role !== 'user' && decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Invalid user role token.'
      });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid token. Please log in again.'
    });
  }
};

// Protect Admin Routes
const protectAdmin = async (req, res, next) => {
  let token;

  // Check Authorization header first (Bearer <token>), fallback to HttpOnly cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && (req.cookies[ADMIN_COOKIE] || req.cookies.adminToken || req.cookies.token)) {
    token = req.cookies[ADMIN_COOKIE] || req.cookies.adminToken || req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized as admin. Access denied.'
    });
  }

  try {
    const secret = process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Server configuration error: JWT_ADMIN_SECRET missing.' });
    }
    const decoded = jwt.verify(token, secret);

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient privileges for admin portal.'
      });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found.'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Admin session expired. Please log in again.'
    });
  }
};

module.exports = {
  protectUser,
  protectAdmin
};
