const Admin = require('../models/Admin');
const User = require('../models/User');
const Plant = require('../models/Plant');
const Order = require('../models/Order');
const { sendAdminToken, clearAdminToken } = require('../utils/jwt');

// @desc    Admin login
// @route   POST /api/admin/auth/login
// @access  Public
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    sendAdminToken(res, admin._id, 200, {
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin logout
// @route   POST /api/admin/auth/logout
// @access  Private (Admin)
const adminLogout = async (req, res) => {
  clearAdminToken(res);
  res.status(200).json({
    success: true,
    message: 'Admin logged out successfully'
  });
};

// @desc    Get current admin profile
// @route   GET /api/admin/auth/me
// @access  Private (Admin)
const getAdminProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    admin: req.admin
  });
};

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPlants = await Plant.countDocuments();
    const totalOrders = await Order.countDocuments();

    const completedOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['Pending', 'Processing', 'Shipped', 'Out for Delivery'] } });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });

    // Revenue from non-cancelled orders
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Low Stock Plants (stock <= 5)
    const lowStockPlants = await Plant.find({ stock: { $lte: 5 } }).select('name category stock price isAvailable images');

    // Status breakdown for charts
    const statusBreakdown = [
      { name: 'Pending', count: await Order.countDocuments({ orderStatus: 'Pending' }) },
      { name: 'Processing', count: await Order.countDocuments({ orderStatus: 'Processing' }) },
      { name: 'Shipped', count: await Order.countDocuments({ orderStatus: 'Shipped' }) },
      { name: 'Out for Delivery', count: await Order.countDocuments({ orderStatus: 'Out for Delivery' }) },
      { name: 'Delivered', count: completedOrders },
      { name: 'Cancelled', count: cancelledOrders }
    ];

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalPlants,
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        totalRevenue,
        lowStockCount: lowStockPlants.length,
        lowStockPlants,
        statusBreakdown,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all registered users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Aggregate order count per user
    const userOrderCounts = await Order.aggregate([
      { $group: { _id: '$user', orderCount: { $sum: 1 }, totalSpent: { $sum: '$totalAmount' } } }
    ]);

    const orderMap = {};
    userOrderCounts.forEach(u => {
      orderMap[u._id.toString()] = { count: u.orderCount, totalSpent: u.totalSpent };
    });

    const enrichedUsers = users.map(u => ({
      ...u.toObject(),
      orderCount: orderMap[u._id.toString()]?.count || 0,
      totalSpent: orderMap[u._id.toString()]?.totalSpent || 0
    }));

    res.status(200).json({
      success: true,
      users: enrichedUsers
    });
  } catch (error) {
    next(error);
  }
};

// ─── Knowledge Base CRUD ──────────────────────────────────────────────────────

const KnowledgeBase = require('../models/KnowledgeBase');

// @desc    Get all knowledge base entries
// @route   GET /api/admin/knowledge
// @access  Private (Admin)
const getKnowledgeEntries = async (req, res, next) => {
  try {
    const entries = await KnowledgeBase.find().sort({ category: 1, updatedAt: -1 });
    res.status(200).json({ success: true, entries });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a knowledge base entry
// @route   POST /api/admin/knowledge
// @access  Private (Admin)
const createKnowledgeEntry = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }
    const entry = await KnowledgeBase.create({ title, content, category: category || 'other', isActive: true });
    res.status(201).json({ success: true, entry });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a knowledge base entry
// @route   PUT /api/admin/knowledge/:id
// @access  Private (Admin)
const updateKnowledgeEntry = async (req, res, next) => {
  try {
    const { title, content, category, isActive } = req.body;
    const entry = await KnowledgeBase.findByIdAndUpdate(
      req.params.id,
      { title, content, category, isActive },
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ success: false, message: 'Knowledge entry not found.' });
    res.status(200).json({ success: true, entry });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a knowledge base entry
// @route   DELETE /api/admin/knowledge/:id
// @access  Private (Admin)
const deleteKnowledgeEntry = async (req, res, next) => {
  try {
    const entry = await KnowledgeBase.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: 'Knowledge entry not found.' });
    res.status(200).json({ success: true, message: 'Knowledge entry deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminLogin,
  adminLogout,
  getAdminProfile,
  getAnalytics,
  getAllUsers,
  getKnowledgeEntries,
  createKnowledgeEntry,
  updateKnowledgeEntry,
  deleteKnowledgeEntry
};
