const express = require('express');
const router = express.Router();
const {
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getCategories
} = require('../controllers/plantController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', getPlants);
router.get('/categories', getCategories);
router.get('/:id', getPlantById);

// Admin-only plant management routes
router.post('/', protectAdmin, createPlant);
router.put('/:id', protectAdmin, updatePlant);
router.delete('/:id', protectAdmin, deletePlant);

module.exports = router;
