const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protectUser, protectAdmin } = require('../middleware/authMiddleware');

// Razorpay payment integration routes
router.post('/razorpay/create-order', protectUser, createRazorpayOrder);
router.post('/razorpay/verify-payment', protectUser, verifyRazorpayPayment);

// Standard user order routes
router.post('/', protectUser, createOrder);
router.get('/my-orders', protectUser, getMyOrders);
router.put('/:id/cancel', protectUser, cancelOrder);

// Admin order management routes
router.get('/', protectAdmin, getAllOrders);
router.put('/:id/status', protectAdmin, updateOrderStatus);

// Shared route (User or Admin)
router.get('/:id', async (req, res, next) => {
  const userToken = req.cookies?.plantnest_user_token;
  const adminToken = req.cookies?.plantnest_admin_token;

  if (userToken) {
    return protectUser(req, res, next);
  } else if (adminToken) {
    return protectAdmin(req, res, next);
  } else {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
}, getOrderById);

module.exports = router;
