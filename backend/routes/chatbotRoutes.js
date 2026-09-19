const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { USER_COOKIE } = require('../utils/jwt');
const { queryChatbot } = require('../controllers/chatbotController');
const { chatbotLimiter } = require('../middleware/rateLimiter');

// Optional User Auth Middleware for Chatbot Queries
const optionalUserAuth = async (req, res, next) => {
  try {
    let token;
    if (req.cookies && req.cookies[USER_COOKIE]) {
      token = req.cookies[USER_COOKIE];
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token && process.env.JWT_USER_SECRET) {
      const secret = process.env.JWT_USER_SECRET;
      const decoded = jwt.verify(token, secret);
      if (decoded && decoded.id) {
        const user = await User.findById(decoded.id).select('-password');
        if (user) req.user = user;
      }
    }
  } catch (err) {
    // Ignore invalid token so unauthenticated visitors can still ask catalog questions
  }
  next();
};

router.post('/query', chatbotLimiter, optionalUserAuth, queryChatbot);

module.exports = router;
