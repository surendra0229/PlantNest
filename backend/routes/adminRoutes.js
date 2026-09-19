const express = require('express');
const router = express.Router();
const {
  adminLogin,
  adminLogout,
  getAdminProfile,
  getAnalytics,
  getAllUsers,
  getKnowledgeEntries,
  createKnowledgeEntry,
  updateKnowledgeEntry,
  deleteKnowledgeEntry
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/auth/login', authLimiter, adminLogin);
router.post('/auth/logout', adminLogout);
router.get('/auth/me', protectAdmin, getAdminProfile);
router.get('/analytics', protectAdmin, getAnalytics);
router.get('/users', protectAdmin, getAllUsers);

// Knowledge Base routes (Admin-controlled chatbot knowledge)
router.get('/knowledge', protectAdmin, getKnowledgeEntries);
router.post('/knowledge', protectAdmin, createKnowledgeEntry);
router.put('/knowledge/:id', protectAdmin, updateKnowledgeEntry);
router.delete('/knowledge/:id', protectAdmin, deleteKnowledgeEntry);

module.exports = router;
